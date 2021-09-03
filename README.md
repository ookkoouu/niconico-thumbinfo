# niconico-thumbinfo

A Niconico Video getthumbinfo API client.

# Usage

```ts
import GetThumbInfo from "niconico-thumbinfo"

const info = await GetThumbInfo("sm9")

if (info.available) {
  console.dir(info)
}

/*
{
  avalable: true,
  category: '',
  comments: 5241184,
  description: 'レッツゴー！陰陽師（フルコーラスバージョン）',
  embeddable: true,
  genre: '未設定',
  id: 'sm9',
  last_res_body: '遺影遺影遺影遺影遺影 食えるかぁ 食えるかぁぁ うううううううううう',
  length: {
    string: '5:20',
    hours: 0.08888888888888888,
    minutes: 5.333333333333333,
    seconds: 320
  },
  mylists: 180807,
  no_live_play: false,
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
  thumbnail: 'http://nicovideo.cdn.nimg.jp/thumbnails/9/9',
  title: '新・豪血寺一族 -煩悩解放 - レッツゴー！陰陽師',
  uploaded: 2007-03-05T15:33:00.000Z,
  url: 'https://www.nicovideo.jp/watch/sm9',
  user: {
    id: 4,
    nickname: '中の',
    icon: 'https://secure-dcdn.cdn.nimg.jp/nicoaccount/usericon/s/0/4.jpg?1271141672'
  },
  views: 20458394
}
*/
```

# Method
GetThumbInfo (id: string): Promise<[ThumbInfo](https://github.com/ookkoouu/niconico-thumbinfo/blob/main/src/interfaces/Info.ts) | [UnavailInfo](https://github.com/ookkoouu/niconico-thumbinfo/blob/main/src/interfaces/Info.ts)>
