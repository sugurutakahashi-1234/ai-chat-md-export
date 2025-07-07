# Adjusting Non-Displayed Items

日付: 2024-08-16

---

## 👤 ユーザー
*2024/8/16 11:01:38*

以下について、displayedItemでない要素のサイズを少し小さくしたり暗くすることは可能なのか？

public struct SimplePositionScrollDesignView: View {
    let items: \[ScrollDesignViewItem\]
    @State var displayedItem: ScrollDesignViewItem?

    public var body: some View {
        GeometryReader { geometry in
            ScrollView(.horizontal) {
                LazyHStack(spacing: 15) {
                    ForEach(items, id: \\.id) { item in
                        GeometryReader { itemGeometry in
                            RoundedRectangle(cornerRadius: 16)
                                .fill(item.color.gradient)
                                .frame(width: geometry.size.width - 60)
                                .onAppear {
                                    updateDisplayedColor(geometry: itemGeometry, containerWidth: geometry.size.width, item: item)
                                }
                                .onChange(of: itemGeometry.frame(in: .global)) { \_ in
                                    updateDisplayedColor(geometry: itemGeometry, containerWidth: geometry.size.width, item: item)
                                }
                        }
                        .frame(width: max(geometry.size.width - 60, 0))
                    }
                }
                .padding(.horizontal, 32)
            }
            .scrollIndicators(.hidden)
        }
        .frame(height: 100)
        .overlay {
            if let displayedItem {
                Text("\\(displayedItem.color)")
            }
        }
    }

    private func updateDisplayedColor(geometry: GeometryProxy, containerWidth: CGFloat, item: ScrollDesignViewItem) {
        let itemCenterX = geometry.frame(in: .global).midX
        let screenCenterX = containerWidth / 2
        if abs(itemCenterX - screenCenterX) &lt; containerWidth / 2 {
            displayedItem = item
        }
    }
}

---

## 🤖 アシスタント
*2024/8/16 11:01:59*

はい、`displayedItem`でない要素のサイズを少し小さくしたり、暗くすることは可能です。`displayedItem`と比較して他の要素のスタイルを調整するためには、`item`が`displayedItem`と一致しているかどうかを確認し、その結果に基づいてスタイルを変更する必要があります。

以下のように変更を加えてみてください。

```swift
public struct SimplePositionScrollDesignView: View {
    let items: [ScrollDesignViewItem]
    @State var displayedItem: ScrollDesignViewItem?

    public var body: some View {
        GeometryReader { geometry in
            ScrollView(.horizontal) {
                LazyHStack(spacing: 15) {
                    ForEach(items, id: \.id) { item in
                        GeometryReader { itemGeometry in
                            let isDisplayedItem = displayedItem == item
                            RoundedRectangle(cornerRadius: 16)
                                .fill(item.color.gradient)
                                .frame(width: isDisplayedItem ? (geometry.size.width - 60) : (geometry.size.width - 80)) // サイズを調整
                                .scaleEffect(isDisplayedItem ? 1.0 : 0.9) // サイズを小さくする
                                .opacity(isDisplayedItem ? 1.0 : 0.7) // 暗くする
                                .onAppear {
                                    updateDisplayedColor(geometry: itemGeometry, containerWidth: geometry.size.width, item: item)
                                }
                                .onChange(of: itemGeometry.frame(in: .global)) { _ in
                                    updateDisplayedColor(geometry: itemGeometry, containerWidth: geometry.size.width, item: item)
                                }
                        }
                        .frame(width: max(geometry.size.width - 60, 0))
                    }
                }
                .padding(.horizontal, 32)
            }
            .scrollIndicators(.hidden)
        }
        .frame(height: 100)
        .overlay {
            if let displayedItem {
                Text("\(displayedItem.color)")
            }
        }
    }

    private func updateDisplayedColor(geometry: GeometryProxy, containerWidth: CGFloat, item: ScrollDesignViewItem) {
        let itemCenterX = geometry.frame(in: .global).midX
        let screenCenterX = containerWidth / 2
        if abs(itemCenterX - screenCenterX) < containerWidth / 2 {
            displayedItem = item
        }
    }
}
```

このコードでは、`displayedItem`と一致しているかどうかを`isDisplayedItem`で確認し、その結果に応じてフレームサイズ、`scaleEffect`、および`opacity`を調整しています。これにより、`displayedItem`でない要素が少し小さくなり、暗く表示されるようになります。

---

## 👤 ユーザー
*2024/8/16 11:36:29*

変化が急なので自然なアニメーションを入れて欲しいのと、次や一つ前のコンテンツが前の実装だと見えていたので、それを維持して欲しい

---

## 🤖 アシスタント
*2024/8/16 11:36:50*

User prefers natural animations for transitions and wants to maintain visibility of the next and previous content when implementing changes.

---

## 🔧 ツール
*2024/8/16 11:36:50*

Model set context updated.

---

## 🤖 アシスタント
*2024/8/16 11:36:50*

自然なアニメーションを追加し、次や一つ前のコンテンツが見えるように調整した実装は以下の通りです。`withAnimation`を使用して、サイズ変更や不透明度の変化をアニメーション化しています。

```swift
public struct SimplePositionScrollDesignView: View {
    let items: [ScrollDesignViewItem]
    @State var displayedItem: ScrollDesignViewItem?

    public var body: some View {
        GeometryReader { geometry in
            ScrollView(.horizontal) {
                LazyHStack(spacing: 15) {
                    ForEach(items, id: \.id) { item in
                        GeometryReader { itemGeometry in
                            let isDisplayedItem = displayedItem == item
                            RoundedRectangle(cornerRadius: 16)
                                .fill(item.color.gradient)
                                .frame(width: isDisplayedItem ? (geometry.size.width - 60) : (geometry.size.width - 80)) // サイズを調整
                                .scaleEffect(isDisplayedItem ? 1.0 : 0.9) // サイズを小さくする
                                .opacity(isDisplayedItem ? 1.0 : 0.7) // 暗くする
                                .animation(.easeInOut, value: isDisplayedItem) // アニメーションを追加
                                .onAppear {
                                    updateDisplayedColor(geometry: itemGeometry, containerWidth: geometry.size.width, item: item)
                                }
                                .onChange(of: itemGeometry.frame(in: .global)) { _ in
                                    updateDisplayedColor(geometry: itemGeometry, containerWidth: geometry.size.width, item: item)
                                }
                        }
                        .frame(width: max(geometry.size.width - 80, 0)) // 前後のコンテンツが見えるように調整
                    }
                }
                .padding(.horizontal, 32)
            }
            .scrollIndicators(.hidden)
        }
        .frame(height: 100)
        .overlay {
            if let displayedItem {
                Text("\(displayedItem.color)")
            }
        }
    }

    private func updateDisplayedColor(geometry: GeometryProxy, containerWidth: CGFloat, item: ScrollDesignViewItem) {
        let itemCenterX = geometry.frame(in: .global).midX
        let screenCenterX = containerWidth / 2
        if abs(itemCenterX - screenCenterX) < containerWidth / 2 {
            withAnimation(.easeInOut) {
                displayedItem = item
            }
        }
    }
}
```

この実装では、`animation`モディファイアを使用して、サイズ変更や不透明度の変化にアニメーションを加えています。また、前後のコンテンツが見えるように、フレームの幅を少し調整しています。これにより、自然なアニメーションとともに、次や前の要素も視認できるデザインになります。

---
