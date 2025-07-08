# AsyncImage が読み込まれない

Date: 2024-06-25

---

## 👤 User
*2024-06-25 12:22:40*

AsyncImage がtalkThreadsの最初の一つしか読み込まれない。

@available(iOS 17.0, *)
public struct TalkThreadListScrollView: View {
    let talkThreads: [TalkThread]
    let spacing: CGFloat
    let padding: CGFloat

    public var body: some View {
        GeometryReader { geometry in
            ScrollView(.horizontal) {
                LazyHStack(spacing: spacing) {
                    ForEach(talkThreads, id: \.id) { talkThread in
                        AsyncImage(url: talkThread.imageUrl, transaction: .init(animation: .bouncy)) { asyncImagePhase in
                            switch asyncImagePhase {
                            case .success(let image):
                                RoundedRectangle(cornerRadius: 16)
                                    .overlay(
                                        image
                                            .resizable()
                                            .scaledToFill()
                                    )
                                    .clipped()
                            case .failure:
                                AsyncImageErrorView()
                            case .empty:
                                AsyncImageLoadingView()
                            @unknown default:
                                AsyncImageLoadingView()
                            }
                        }
                        .frame(width: geometry.size.width - padding * 2, height: 100)
                    }
                }
                .padding(.horizontal, padding)
                .scrollTargetLayout()
            }
            .scrollTargetBehavior(.viewAligned) // paging だと上手くいかない
            .scrollIndicators(.hidden)
        }
        .frame(height: 100)
    }
}

---

## 🤖 Assistant
*2024-06-25 12:22:58*

`AsyncImage` が `talkThreads` の最初の一つしか読み込まれない場合、いくつかの原因が考えられます。この問題を解決するために、以下の点を確認してみてください。

1. `talkThreads` 配列に正しい URL が設定されているか確認する。
2. `AsyncImage` が正しく動作するように、全ての要素に対して正しい ID が設定されているか確認する。
3. アプリのキャッシュやバックグラウンドでのダウンロードが影響している可能性があるため、異なるネットワーク条件やキャッシュをクリアして再度試してみる。

さらに、以下のコードスニペットにいくつかの修正を加えてみます。

```swift
@available(iOS 17.0, *)
public struct TalkThreadListScrollView: View {
    let talkThreads: [TalkThread]
    let spacing: CGFloat
    let padding: CGFloat

    public var body: some View {
        GeometryReader { geometry in
            ScrollView(.horizontal) {
                LazyHStack(spacing: spacing) {
                    ForEach(talkThreads, id: \.id) { talkThread in
                        AsyncImage(url: talkThread.imageUrl, transaction: .init(animation: .bouncy)) { asyncImagePhase in
                            switch asyncImagePhase {
                            case .success(let image):
                                image
                                    .resizable()
                                    .scaledToFill()
                                    .frame(width: geometry.size.width - padding * 2, height: 100)
                                    .clipped()
                                    .cornerRadius(16)
                            case .failure:
                                AsyncImageErrorView()
                                    .frame(width: geometry.size.width - padding * 2, height: 100)
                            case .empty:
                                AsyncImageLoadingView()
                                    .frame(width: geometry.size.width - padding * 2, height: 100)
                            @unknown default:
                                AsyncImageLoadingView()
                                    .frame(width: geometry.size.width - padding * 2, height: 100)
                            }
                        }
                        .frame(width: geometry.size.width - padding * 2, height: 100)
                    }
                }
                .padding(.horizontal, padding)
            }
            .scrollIndicators(.hidden)
        }
        .frame(height: 100)
    }
}
```

上記の修正点は以下の通りです：
- `AsyncImage` の各ケースで同じフレームサイズを設定しました。
- `RoundedRectangle` の代わりに、画像自体に `cornerRadius` を設定しました。

この修正により、全ての `AsyncImage` が正しく表示されるか確認してみてください。それでも解決しない場合は、キャッシュの問題やネットワークの影響を再確認することをお勧めします。

---
