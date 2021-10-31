export type UnavailInfoType = "COMMUNITY" | "NOT_FOUND" | "DELETED"

export interface UnavailInfo {
  avalable: false
  reason: {
    code: UnavailInfoType
    desctiption: string
  }
}
