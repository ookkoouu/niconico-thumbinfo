export type VideoType = "flv" | "mp4" | "swf"

export interface VideoLength {
  hours: number
  minutes: number
  seconds: number
  text: string
}

export interface Tag {
  locked: boolean
  text: string
}

export interface User {
  iconUrl: string
  id: number
  nickname: string
}

export type UnavailInfoType = "COMMUNITY" | "NOT_FOUND" | "DELETED"

export interface UnavailInfo {
  avalable: false
  reason: {
    code: UnavailInfoType
    desctiption: string
  }
}

/**
 * return type of module
 */
export interface ThumbInfo {
  avalable: true
  comments: number
  description: string
  embeddable: boolean
  genre: string
  id: string
  lastResBody: string
  length: VideoLength
  mylists: number
  noLivePlay: boolean
  tags: Tag[]
  thumbnail: string
  title: string
  type: VideoType
  uploaded: Date
  url: string
  user: User
  views: number
}
