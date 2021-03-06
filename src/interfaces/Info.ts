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
  thumbnailUrl: string
  title: string
  type: VideoType
  uploaded: Date
  url: string
  user: User
  views: number
}
