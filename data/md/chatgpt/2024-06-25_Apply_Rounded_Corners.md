# Apply Rounded Corners

Date: 2024-06-25

---

## 👤 User
*2024-06-25 16:19:29*

角丸にならない

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
                                Rectangle()
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
                        .frame(width: geometry.size.width - padding * 2)
                        // これがないと長押しのタップ領域が正しく反映されない
                        // Ref: 【SwiftUI】contentShapeでTap領域を広げる - https://qiita.com/shiz/items/96585bddbc442683b78c
                        .contentShape(RoundedRectangle(cornerRadius: 8))
                        // Ref: [SwiftUI] contextMenu modifier タップしたViewの背景色を消す方法 - https://zenn.dev/your3i/articles/f03210a0270a5b
                        .contextMenu {
                            Button {
                                //presenter.onTapPost()
                            } label: {
                                Label {
                                    Text("新規投稿")
                                } icon: {
                                    SFSymbols.mic.image
                                }
                            }
                        }
                    }
                }
                .padding(.horizontal, padding)
                .scrollTargetLayout()
            }
            .scrollTargetBehavior(.viewAligned) // paging だと上手くいかないので注意
            .scrollIndicators(.hidden)
        }
    }
}

---

## 🤖 Assistant
*2024-06-25 16:19:56*

角丸が反映されない原因はいくつか考えられます。以下の方法で修正してみてください：

1. **画像のクリッピングを修正する**：
   画像をクリッピングする際に、`RoundedRectangle` を使用して角丸を適用します。

2. **カスタムモディファイアを使用する**：
   角丸の適用が期待通りに動作しない場合、`background`モディファイアを使用して角丸の背景を適用する方法もあります。

以下に修正後のコードを示します：

```swift
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
                                    .clipShape(RoundedRectangle(cornerRadius: 8)) // 角丸を適用
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 8)
                                            .stroke(Color.white, lineWidth: 2)
                                    )
                            case .failure:
                                AsyncImageErrorView()
                                    .clipShape(RoundedRectangle(cornerRadius: 8)) // エラービューにも角丸を適用
                            case .empty:
                                AsyncImageLoadingView()
                                    .clipShape(RoundedRectangle(cornerRadius: 8)) // ローディングビューにも角丸を適用
                            @unknown default:
                                AsyncImageLoadingView()
                                    .clipShape(RoundedRectangle(cornerRadius: 8)) // デフォルトビューにも角丸を適用
                            }
                        }
                        .frame(width: geometry.size.width - padding * 2)
                        .contentShape(RoundedRectangle(cornerRadius: 8))
                        .contextMenu {
                            Button {
                                //presenter.onTapPost()
                            } label: {
                                Label {
                                    Text("新規投稿")
                                } icon: {
                                    SFSymbols.mic.image
                                }
                            }
                        }
                    }
                }
                .padding(.horizontal, padding)
                .scrollTargetLayout()
            }
            .scrollTargetBehavior(.viewAligned) // paging だと上手くいかないので注意
            .scrollIndicators(.hidden)
        }
    }
}
```

この修正により、`AsyncImage` の各フェーズにおいて `RoundedRectangle` を使用してクリップすることで、期待通りの角丸が適用されます。また、必要に応じて `overlay` モディファイアで角丸の枠線を追加することもできます。

---
