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
    throw new Error("Cannot parse video length.")
  }

  const sec = Number(length.split(":")[0]) * 60 + Number(length.split(":")[1])
  const min = Math.floor(sec / 60)
  const hor = Math.floor(sec / 3600)
  const str = length

  return {
    text: str,
    hours: hor,
    minutes: min,
    seconds: sec,
  } as VideoLength
}

/**
 * 正しいタグobjectを生成.
 * タグが無い場合は空配列を返す.
 */
const constructTag = (thumbTags: ThumbAPITag | ThumbAPITag[]): Tag[] => {
  if (typeof thumbTags === "undefined") {
    return []
  }

  const tags: Tag[] = []
  if (!Array.isArray(thumbTags)) {
    // タグが1つ
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
        locked: t.lock ? castToBoolean(t.lock) : false,
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
 * `Info`に詰め替え.
 */
const pack = async (response: ThumbAPIResponseOk): Promise<ThumbInfo> => {
  const tm = response.thumb

  const info: ThumbInfo = {
    avalable: true,
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
    thumbnailUrl: tm.thumbnail_url,
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
const formatInfo = async (thumb: ThumbAPI): Promise<ThumbInfo | UnavailInfo> => {
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
}

/**
 * GETしたxmlを`ThumbAPI`オブジェクトにして返す.
 */
const callAPI = async (id: string): Promise<ThumbAPI> => {
  const videoIdRegex = /^(sm|so|nm)?\d+$/
  if (!videoIdRegex.test(id)) {
    throw new Error("Invalid Niconico video ID.")
  }

  const endpoint = "https://ext.nicovideo.jp/api/getthumbinfo/"
  const url = endpoint + id
  const response = await bent("string")(url).catch((err: bent.StatusError) => {
    if (err.statusCode) {
      throw new Error(`HTTP Error ${err.statusCode}`)
    } else {
      throw new Error(`Connection failed with ${err}`)
    }
  })

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
export const getThumbInfo = async (videoId: string): Promise<ThumbInfo | UnavailInfo> => {
  /**
   * sm   = normal,    flash;
   * so   = official,  channel;
   * nm   = niconico_moviemaker;
   * none = community, variant of so;
   */
  const result = await callAPI(videoId)

  const info = await formatInfo(result)

  return info
}
