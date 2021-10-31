/* eslint-disable typescript-sort-keys/interface */

type ThumbAPIResponseStatus = "ok" | "fail"
type ThumbAPIResponseMovieType = "flv" | "mp4" | "swf"
type ThumbAPIResponseErrorType = "COMMUNITY" | "NOT_FOUND" | "DELETED"

export interface ThumbAPITagObject {
  // '1' only
  category?: string
  // '1' only
  lock?: string
  text: string
}

/**
 * category, lock 等の属性が付いていない場合は string
 */
export type ThumbAPITag = ThumbAPITagObject | string

interface ThumbAPIResponseFail {
  status: Extract<ThumbAPIResponseStatus, "fail">
  error: {
    code: ThumbAPIResponseErrorType
    description: string
  }
}

export interface ThumbAPIResponseOk {
  status: Extract<ThumbAPIResponseStatus, "ok">
  thumb: {
    // ex: 'sm11157453'
    video_id: string
    title: string
    description: string
    // append '.L' to get large image.
    thumbnail_url: string
    // ISO8601 2021-01-01T00:25:25+09:00
    first_retrieve: string
    // ex: '0:03' '4:30' '128:31'
    length: string
    // 'flv' or 'mp4' or 'swf'
    movie_type: ThumbAPIResponseMovieType
    // total bytes of video. no longer used.
    size_high: number
    // bytes of economy mode. no longer used.
    size_low: number
    view_counter: number
    comment_num: number
    mylist_counter: number
    // '' when no comments
    last_res_body: string
    // ex: 'https://www.nicovideo.jp/watch/sm11157453'
    watch_url: string
    // ex: 'video'
    thumb_type: string
    // '0' or '1'
    embeddable: number
    // '0' or '1'
    no_live_play: number
    // no   tag  => tags.tag = undefined
    // one  tag  => tags.tag = ThumbAPITag
    // many tags => tags.tag = ThumbAPITag[]
    tags: {
      // ex: 'jp'
      domain: string
      tag: ThumbAPITag | ThumbAPITag[]
    }
    // ex: 'ゲーム'
    genre: string
    user_id?: number
    user_nickname?: string
    user_icon_url?: string
    ch_id?: number
    ch_name?: string
    ch_icon_url?: string
  }
}

/**
 * interface of API response object parsed from XML text.
 */
export interface ThumbAPI {
  nicovideo_thumb_response: ThumbAPIResponseOk | ThumbAPIResponseFail
}
