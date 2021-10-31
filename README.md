# niconico-thumbinfo

A Niconico Video getthumbinfo API client.

# Usage

```ts
import { getThumbInfo } from "niconico-thumbinfo"

const info = await getThumbInfo("sm9")

if (info.available) {
  console.dir(info)
}

/*
{
  avalable: true,
  comments: 5241184,
  description: 'レッツゴー！陰陽師（フルコーラスバージョン）',
  embeddable: true,
  genre: '未設定',
  id: 'sm9',
  lastResBody: '( ﾟ∀ﾟ)o彡゜どーまん！ ﾟ∀ﾟ)o彡゜どーまん！ ﾟ∀ﾟ)o彡゜どーまん！ ﾟ∀ﾟ)o彡゜どーまん！ ( ﾟ∀ﾟ)...',
  length: {
    text: '5:20',
    hours: 0,
    minutes: 5,
    seconds: 320
  },
  mylists: 180807,
  noLivePlay: false,
  tags: [
    { text: '陰陽師', locked: true },
    { text: 'レッツゴー！陰陽師', locked: true },
    { text: '公式', locked: true },
    { text: '音楽', locked: true },
    { text: 'ゲーム', locked: true },
    { text: '重要ニコニコ文化財', locked: false },
    { text: 'ぷよぷよ禁止令', locked: false },
    { text: '仮時代の先駆者', locked: false },
    { text: '3月6日投稿動画', locked: false },
    { text: '全てはここから始まった', locked: false },
    { text: '伝説の始まり', locked: false }
  ],
  thumbnailUrl: 'https://nicovideo.cdn.nimg.jp/thumbnails/9/9',
  title: '新・豪血寺一族 -煩悩解放 - レッツゴー！陰陽師',
  type: 'flv',
  uploaded: 2007-03-05T15:33:00.000Z,
  url: 'https://www.nicovideo.jp/watch/sm9',
  user: {
    id: 4,
    nickname: '中の',
    iconUrl: 'https://secure-dcdn.cdn.nimg.jp/nicoaccount/usericon/s/0/4.jpg?271141672'
  },
  views: 20458394
}
*/
```

# Interface

GetThumbInfo (id: string): Promise<[ThumbInfo](https://github.com/ookkoouu/niconico-thumbinfo/blob/main/src/interfaces/Info.ts) | [UnavailInfo](https://github.com/ookkoouu/niconico-thumbinfo/blob/main/src/interfaces/Info.ts)>
