import bent from "bent"
import { parse as parseXml } from "fast-xml-parser"
import { decode as htmlDecode } from "html-entities"

import {
  Tag,
  ThumbAPI,
  ThumbAPIResponseOk,
  ThumbAPITag,
  ThumbInfo,
  UnavailInfo,
  User,
  VideoLength,
} from "./interfaces"

/**
 * '0' と '1' をbooleanにキャスト.
 */
const castToBoolean = (special: string | number): boolean => {
  return Boolean(Number(special))
}

/**
 * "分：秒" 表記のstringからVideoLengthを返す.
 */
const getVideoLength = (length: string): VideoLength => {
  const ArgFormat = /^\d+:\d{1,2}$/g
  if (!ArgFormat.test(length)) {
    throw new Error("getVideoLength: Invalid arguments.")
  }

  // TODO: hoursとminutesは小数点以下切り捨て
  const sec = Number(length.split(":")[0]) * 60 + Number(length.split(":")[1])
  const min = sec / 60
  const hor = sec / 60 / 60
  const str = `${Math.floor(min)}:${String(sec % 60).padStart(2, "0")}`

  return {
    text: str,
    hours: hor,
    minutes: min,
    seconds: sec,
  } as VideoLength
}

/**
 * ThumbAPITagからカテゴリータグ名を取得.
 * カテゴリータグが無かったら空文字を返す.
 */
// TODO: 消す
const pickCategory = (thumbTags: ThumbAPITag | ThumbAPITag[]): string => {
  thumbTags = thumbTags ?? ""
  if (typeof thumbTags === "string" && thumbTags == "") return ""

  if (!Array.isArray(thumbTags)) thumbTags = [thumbTags]
  let category = ""
  thumbTags.map((t) => {
    if (typeof t === "object" && t.category) {
      category = t.text
    }
  })
  return category
}

/**
 * 正しいタグobjectを生成.
 * タグが無い場合は空配列を返す.
 */
// TODO: isCategoryを追加
// TODO: 0.タグ無しを弾く, 1.引数が非配列なら配列にする, 2.配列要素がstringかobjectかで分岐
const constructTag = (thumbTags: ThumbAPITag | ThumbAPITag[]): Tag[] => {
  // TODO: s/??/||/
  thumbTags = thumbTags ?? ""
  if (typeof thumbTags === "string" && thumbTags == "") {
    // thumbTag=''
    return []
  }

  const tags: Tag[] = []
  if (!Array.isArray(thumbTags)) {
    // pack to array when tag is one
    thumbTags = [thumbTags]
  }

  thumbTags.map((t) => {
    if (typeof t === "string") {
      // free tag
      tags.push({
        text: htmlDecode(t),
        locked: false,
      })
    } else {
      // category or locked tag
      tags.push({
        text: htmlDecode(t.text),
        locked: t.lock ? true : false,
      })
    }
  })

  return tags
}

/**
 * 一般ユーザーと公式チャンネルの違いを吸収.
 */
const getUser = (apiResponse: ThumbAPIResponseOk): User => {
  const { user_id, user_nickname, user_icon_url, ch_id, ch_name, ch_icon_url } =
    apiResponse.thumb

  if (user_id && user_nickname && user_icon_url) {
    return {
      id: user_id,
      nickname: user_nickname,
      iconUrl: user_icon_url,
    }
  } else if (ch_id && ch_name && ch_icon_url) {
    return {
      id: ch_id,
      nickname: ch_name,
      iconUrl: ch_icon_url,
    }
  } else {
    // user not exist
    throw new Error("Cannot find user in ThumbAPIResponse.")
  }
}

/**
 * 大きいサムネイル画像のurlを取得.
 * 無ければ空文字.
 */
/*
const getLargeThumbnail = async (thumbnailUrl: string): Promise<string> => {
  const largeUrl = thumbnailUrl + ".L"
  return await axios
    .get(largeUrl)
    .then(() => {
      return largeUrl
    })
    .catch(() => {
      return ""
    })
}*/

/**
 * `Info`に詰め替え.
 */
// TODO: categoryとthumbnail_largeを削除
const pack = async (response: ThumbAPIResponseOk): Promise<ThumbInfo> => {
  const tm = response.thumb

  const info: ThumbInfo = {
    avalable: true,
    //category: pickCategory(tm.tags.tag),
    comments: tm.comment_num,
    description: tm.description,
    embeddable: castToBoolean(tm.embeddable),
    genre: tm.genre,
    id: tm.video_id,
    lastResBody: tm.last_res_body,
    length: getVideoLength(tm.length),
    mylists: tm.mylist_counter,
    noLivePlay: castToBoolean(tm.no_live_play),
    tags: constructTag(tm.tags.tag),
    thumbnail: tm.thumbnail_url,
    //thumbnail_large: "",
    title: tm.title,
    type: tm.movie_type,
    uploaded: new Date(tm.first_retrieve),
    url: tm.watch_url,
    user: getUser(response),
    views: tm.view_counter,
  }
  return info
}

/**
 * APIの結果`ThumbAPI`から`Info`を生成.
 * @param thumb `fetch()`の結果.
 * @returns 動画があったらThumbInfo、無ければUnavailInfo.
 */
const genInfo = async (thumb: ThumbAPI): Promise<ThumbInfo | UnavailInfo> => {
  try {
    if (thumb.nicovideo_thumb_response.status == "fail") {
      const unavail: UnavailInfo = {
        avalable: false,
        reason: {
          code: thumb.nicovideo_thumb_response.error.code,
          desctiption: thumb.nicovideo_thumb_response.error.description,
        },
      }
      return unavail
    }

    const info: ThumbInfo = await pack(thumb.nicovideo_thumb_response)
    return info
  } catch (error) {
    throw new Error("Failed to parse the API response.")
  }
}

/**
 * GETしたxmlを`ThumbAPI`オブジェクトにして返す.
 * @param url getthumbinfo request url.
 * @returns parsed API response object.
 */
// TODO: 関数名を変える(callThumbAPIとか),
const fetch = async (url: string): Promise<ThumbAPI> => {
  const getString = bent("string")
  // TODO: user-agentは消す
  const header = {
    "User-Agent": "niconico-thumbinfo",
  }
  const response = await getString(url).catch((err) => {
    throw new Error(`Connection failed with ${err}`)
  })
  /*
  if (response.status !== 200) {
    // 万が一 axiosがエラーを取りこぼした時
    throw new Error(`Invalid Response: ${response.statusText}`)
  }
  */

  const parsed: ThumbAPI = parseXml(response, {
    attributeNamePrefix: "",
    ignoreAttributes: false,
    textNodeName: "text",
  })

  return parsed
}

/**
 * Client of thumbinfo API.
 *
 * @param videoId ニコニコの動画ID. (ex: sm9, so23335421)
 * @return 動画が見つかれば`ThumbInfo`, 無ければ`UnavailInfo`. 利用する前に`available`を判定すること.
 */
// TODO: export const にする
const GetThumbInfo = async (
  videoId: string,
): Promise<ThumbInfo | UnavailInfo> => {
  /**
   * sm   = normal,    flash;
   * so   = official,  channel;
   * nm   = niconico_moviemaker;
   * none = community, variant of so;
   */
  const videoIdReg = /^(sm|so|nm|)\d+$/
  if (!videoIdReg.test(videoId)) throw new Error("Invalid Niconico video ID.")

  // TODO: httpsにする
  const result = await fetch(
    "https://ext.nicovideo.jp/api/getthumbinfo/" + videoId,
  )

  const info = await genInfo(result)

  return info
}

// TODO: 消す
export default GetThumbInfo