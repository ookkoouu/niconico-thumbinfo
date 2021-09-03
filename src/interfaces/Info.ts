export type VideoType = "flv" | "mp4" | "swf"

export interface VideoLength {
  hours: number
  minutes: number
  seconds: number
  string: string
}

export interface Tag {
  locked: boolean
  text: string
}

export interface User {
  icon: string
  id: number
  nickname: string
}

export interface UnavailInfo {
  avalable: false
  reason: {
    code: "COMMUNITY" | "NOT_FOUND" | "DELETED"
    desctiption: string
  }
}

/**
 * return type of module
 */
export interface ThumbInfo {
  avalable: true
  category?: string
  comments: number
  description: string
  embeddable: boolean
  genre: string
  id: string
  last_res_body: string
  length: VideoLength
  mylists: number
  no_live_play: boolean
  tags: Tag[]
  thumbnail: string
  title: string
  uploaded: Date
  url: string
  user: User
  views: number
}
