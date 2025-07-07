# Reverse Overlay Elements

日付: 2024-07-08

---

## 👤 ユーザー
*2024/7/8 19:17:35*

これだと後半の要素が右側に重なっていくが、逆の順番で重ねたい

HStack(spacing: -20) {
                                            ForEach(talkThread.posts.prefix(3)) { post in
                                                ZStack(alignment: .topTrailing) {
                                                    CustomAsyncImageView(imageUrl: post.postedBy.imageUrl)
                                                        .frame(width: 32, height: 32)
                                                        .clipShape(Circle())
                                                    
                                                    if let imageUrl = post.postType.imageUrl {
                                                        CustomAsyncImageView(imageUrl: imageUrl)
                                                            .frame(width: 16, height: 16)
                                                            .clipShape(Circle())
                                                            .offset(x: 4, y: -4)
                                                    }
                                                }
                                            }
                                        }

---

## 🤖 アシスタント
*2024/7/8 19:17:44*

後半の要素を逆の順番で重ねるためには、`ForEach`ループで要素を逆順にする必要があります。次のように、`prefix`を使った後に`reversed()`を適用することで実現できます。

```swift
HStack(spacing: -20) {
    ForEach(talkThread.posts.prefix(3).reversed()) { post in
        ZStack(alignment: .topTrailing) {
            CustomAsyncImageView(imageUrl: post.postedBy.imageUrl)
                .frame(width: 32, height: 32)
                .clipShape(Circle())
            
            if let imageUrl = post.postType.imageUrl {
                CustomAsyncImageView(imageUrl: imageUrl)
                    .frame(width: 16, height: 16)
                    .clipShape(Circle())
                    .offset(x: 4, y: -4)
            }
        }
    }
}
```

これにより、`talkThread.posts.prefix(3)`の要素が逆

---
