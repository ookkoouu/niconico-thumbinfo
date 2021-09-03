# テストに使えそうな動画 ID

|     ID     | movie_type | ユーザー/公式 |                  備考                  |
| :--------: | :--------: | :-----------: | :------------------------------------: |
| so23335421 |    mp4     |     公式      |                                        |
| nm2829323  |    swf     |   ユーザー    |              カテゴリなし              |
| 1250059872 |    flv     |     公式      |      プレフィックスなし(内部 so)       |
| 1349357916 |    不明    |     不明      | コミュニティ限定動画(COMMUNITY エラー) |
| sm32423513 |    mp4     |   ユーザー    |     記号多めのタグ/タイトル（<>&）     |

# エッジケース

## コメントやタグが無い場合

`<tags></tags>`で囲われているのが`<tags/>`だけになる。

- `<tags/>`
- `<last_res_body/>`

## 投稿者が非公開または退会(BAN)済の場合

動画が消されない限り、通常通りユーザー情報が格納されて返ってくる。

## カスタム xml

タグ・コメントなし

```js
const notagnocome = `
<nicovideo_thumb_response status="ok">
<thumb>
<video_id>nm2829323</video_id>
<title>NMMでぽぽたんダンス×ｳｯｰｳｯｰｳﾏｳﾏ(ﾟ∀ﾟ)</title>
<description>静止画を10ミリ秒単位で切り貼り（ただし、NMMは25fpsなので40ミリ秒まで余裕はあります）。</description>
<thumbnail_url>https://nicovideo.cdn.nimg.jp/thumbnails/2829323/2829323</thumbnail_url>
<first_retrieve>2008-03-29T23:06:23+09:00</first_retrieve>
<length>2:53</length>
<movie_type>swf</movie_type>
<size_high>3929182</size_high>
<size_low>0</size_low>
<view_counter>75487</view_counter>
<comment_num>4478</comment_num>
<mylist_counter>1025</mylist_counter>
<last_res_body/>
<watch_url>https://www.nicovideo.jp/watch/nm2829323</watch_url>
<thumb_type>video</thumb_type>
<embeddable>1</embeddable>
<no_live_play>0</no_live_play>
<tags/>
<genre>その他</genre>
<user_id>4080496</user_id>
<user_nickname>新ドナP</user_nickname>
<user_icon_url>https://secure-dcdn.cdn.nimg.jp/nicoaccount/usericon/s/408/4080496.jpg?1491755740</user_icon_url>
</thumb>
</nicovideo_thumb_response>
`
```

普通のタグ１個, 再生コメマイリス埋め込み全部ゼロ

```js
const onetag = `
<nicovideo_thumb_response status="ok">
<thumb>
<video_id>so39268741</video_id>
<title>猫の反省会 ＃33</title>
<description>2021年8月30日に放送された「ワードウルフ ～探偵Kの更なる修行～」</description>
<thumbnail_url>https://nicovideo.cdn.nimg.jp/thumbnails/39268741/39268741.48677398</thumbnail_url>
<first_retrieve>2021-08-31T21:30:00+09:00</first_retrieve>
<length>22:41</length>
<movie_type>mp4</movie_type>
<size_high>1</size_high>
<size_low>1</size_low>
<view_counter>0</view_counter>
<comment_num>0</comment_num>
<mylist_counter>0</mylist_counter>
<last_res_body/>
<watch_url>https://www.nicovideo.jp/watch/so39268741</watch_url>
<thumb_type>video</thumb_type>
<embeddable>0</embeddable>
<no_live_play>0</no_live_play>
<tags domain="jp">
<tag>エンターテイメント</tag>
</tags>
<genre>エンターテイメント</genre>
<ch_id>2640349</ch_id>
<ch_name>ハグチャンネル</ch_name>
<ch_icon_url>https://secure-dcdn.cdn.nimg.jp/comch/channel-icon/64x64/ch2640349.jpg?1630413783</ch_icon_url>
</thumb>
</nicovideo_thumb_response>
`
```
