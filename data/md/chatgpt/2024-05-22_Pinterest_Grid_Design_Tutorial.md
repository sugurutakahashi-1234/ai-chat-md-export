# Pinterest Grid Design Tutorial

日付: 2024-05-22

---

## 👤 ユーザー
*2024/05/22 17:51:32*

pinterest 風のグリッドデザインのことを一般的になんて呼ぶか？

---

## 🤖 アシスタント
*2024/05/22 17:51:37*

Pinterest風のグリッドデザインは一般的に「マシングリッドレイアウト」または「マソングリッドレイアウト」（Masonry Grid Layout）と呼ばれます。このレイアウトは、異なる高さのコンテンツカードを縦横に隙間なく並べることで、全体的にバランスの取れた外観を作り出します。Pinterestがこのデザインを広めたため、時には「Pinterestスタイルレイアウト」とも呼ばれることがあります。

---

## 👤 ユーザー
*2024/05/22 17:53:08*

これを2個の列で実現したときに表示順が決まっている状態で、優先順位をつけなければいけない。SwiftUIで記述してほしい

---

## 🤖 アシスタント
*2024/05/22 17:53:33*

SwiftUIでPinterest風の2列マシングリッドレイアウトを実現し、表示順が決まっている状態で優先順位をつけるためには、カスタムレイアウトを構築する必要があります。以下にその実装例を示します。

### 1. データモデルの定義

まず、表示するアイテムのデータモデルを定義します。

```swift
struct GridItem: Identifiable {
    let id = UUID()
    let priority: Int
    let content: String
}
```

### 2. アイテムのサンプルデータ

次に、サンプルデータを用意します。

```swift
let sampleData = [
    GridItem(priority: 1, content: "Item 1"),
    GridItem(priority: 2, content: "Item 2"),
    GridItem(priority: 3, content: "Item 3"),
    GridItem(priority: 4, content: "Item 4"),
    GridItem(priority: 5, content: "Item 5")
]
```

### 3. カスタムレイアウトの実装

2列のマシングリッドレイアウトを実装するためのカスタムビューを作成します。

```swift
struct MasonryGrid: View {
    let items: [GridItem]

    var body: some View {
        GeometryReader { geometry in
            let columnWidth = geometry.size.width / 2

            ScrollView {
                VStack {
                    HStack(alignment: .top, spacing: 0) {
                        VStack {
                            ForEach(leftColumnItems) { item in
                                GridItemView(item: item, width: columnWidth)
                            }
                        }
                        VStack {
                            ForEach(rightColumnItems) { item in
                                GridItemView(item: item, width: columnWidth)
                            }
                        }
                    }
                }
            }
        }
    }

    private var leftColumnItems: [GridItem] {
        items.enumerated().compactMap { index, item in
            index.isMultiple(of: 2) ? item : nil
        }
    }

    private var rightColumnItems: [GridItem] {
        items.enumerated().compactMap { index, item in
            index.isMultiple(of: 2) ? nil : item
        }
    }
}

struct GridItemView: View {
    let item: GridItem
    let width: CGFloat

    var body: some View {
        Text(item.content)
            .frame(width: width, height: 100)
            .background(Color.blue)
            .cornerRadius(8)
            .padding([.leading, .trailing, .bottom], 8)
    }
}
```

### 4. コンテンツビューで使用

上記のカスタムレイアウトをコンテンツビューで使用します。

```swift
struct ContentView: View {
    let items: [GridItem]

    var body: some View {
        MasonryGrid(items: items.sorted { $0.priority < $1.priority })
    }
}

@main
struct MyApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView(items: sampleData)
        }
    }
}
```

これにより、優先順位に基づいてアイテムがソートされ、2列のPinterest風マシングリッドレイアウトに表示されます。各アイテムは指定された順序で表示され、カラム間で交互に配置されます。

---

## 👤 ユーザー
*2024/05/22 17:53:53*

高さをrandomにしたいんだ。

---

## 🤖 アシスタント
*2024/05/22 17:54:14*

アイテムの高さをランダムに設定するには、`GridItem`モデルに高さプロパティを追加し、その高さをランダムに生成します。以下にその実装方法を示します。

### 1. データモデルの更新

`GridItem`モデルに高さプロパティを追加します。

```swift
struct GridItem: Identifiable {
    let id = UUID()
    let priority: Int
    let content: String
    let height: CGFloat
}
```

### 2. サンプルデータの更新

サンプルデータを作成する際に高さをランダムに生成します。

```swift
let sampleData = (1...10).map {
    GridItem(priority: $0, content: "Item \($0)", height: CGFloat.random(in: 100...300))
}
```

### 3. カスタムレイアウトの更新

カスタムレイアウトの各アイテムの高さをデータモデルに基づいて設定します。

```swift
struct MasonryGrid: View {
    let items: [GridItem]

    var body: some View {
        GeometryReader { geometry in
            let columnWidth = geometry.size.width / 2

            ScrollView {
                VStack {
                    HStack(alignment: .top, spacing: 0) {
                        VStack {
                            ForEach(leftColumnItems) { item in
                                GridItemView(item: item, width: columnWidth)
                            }
                        }
                        VStack {
                            ForEach(rightColumnItems) { item in
                                GridItemView(item: item, width: columnWidth)
                            }
                        }
                    }
                }
            }
        }
    }

    private var leftColumnItems: [GridItem] {
        items.enumerated().compactMap { index, item in
            index.isMultiple(of: 2) ? item : nil
        }
    }

    private var rightColumnItems: [GridItem] {
        items.enumerated().compactMap { index, item in
            index.isMultiple(of: 2) ? nil : item
        }
    }
}

struct GridItemView: View {
    let item: GridItem
    let width: CGFloat

    var body: some View {
        Text(item.content)
            .frame(width: width, height: item.height)
            .background(Color.blue)
            .cornerRadius(8)
            .padding([.leading, .trailing, .bottom], 8)
    }
}
```

### 4. コンテンツビューで使用

コンテンツビューでカスタムレイアウトを使用します。

```swift
struct ContentView: View {
    let items: [GridItem]

    var body: some View {
        MasonryGrid(items: items.sorted { $0.priority < $1.priority })
    }
}

@main
struct MyApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView(items: sampleData)
        }
    }
}
```

これにより、各アイテムはランダムな高さで表示され、2列のPinterest風マシングリッドレイアウトに配置されます。優先順位に基づいてアイテムがソートされ、指定された順序で表示されます。

---

## 👤 ユーザー
*2024/05/22 17:55:20*

このとき奇数偶数で左右に割り振っているが、左上から順番が前後しないようにしたい。どうすればよいか？

---

## 🤖 アシスタント
*2024/05/22 17:55:39*

左上から順番が前後しないように、アイテムを左から右、上から下の順に配置するためには、交互に割り振るのではなく、高さの合計が少ない方のカラムに次のアイテムを追加するようにします。以下にその実装方法を示します。

### 1. データモデルの定義

データモデルは以前と同じです。

```swift
struct GridItem: Identifiable {
    let id = UUID()
    let priority: Int
    let content: String
    let height: CGFloat
}
```

### 2. サンプルデータの生成

サンプルデータを生成します。

```swift
let sampleData = (1...10).map {
    GridItem(priority: $0, content: "Item \($0)", height: CGFloat.random(in: 100...300))
}
```

### 3. カスタムレイアウトの実装

カスタムレイアウトを、高さの合計が少ない方のカラムに次のアイテムを追加するように変更します。

```swift
struct MasonryGrid: View {
    let items: [GridItem]

    var body: some View {
        GeometryReader { geometry in
            let columnWidth = geometry.size.width / 2

            ScrollView {
                VStack {
                    HStack(alignment: .top, spacing: 0) {
                        VStack {
                            ForEach(leftColumnItems) { item in
                                GridItemView(item: item, width: columnWidth)
                            }
                        }
                        VStack {
                            ForEach(rightColumnItems) { item in
                                GridItemView(item: item, width: columnWidth)
                            }
                        }
                    }
                }
            }
        }
    }

    private var leftColumnItems: [GridItem] {
        var leftColumn: [GridItem] = []
        var rightColumn: [GridItem] = []
        var leftHeight: CGFloat = 0
        var rightHeight: CGFloat = 0

        for item in items {
            if leftHeight <= rightHeight {
                leftColumn.append(item)
                leftHeight += item.height
            } else {
                rightColumn.append(item)
                rightHeight += item.height
            }
        }

        return leftColumn
    }

    private var rightColumnItems: [GridItem] {
        var leftColumn: [GridItem] = []
        var rightColumn: [GridItem] = []
        var leftHeight: CGFloat = 0
        var rightHeight: CGFloat = 0

        for item in items {
            if leftHeight <= rightHeight {
                leftColumn.append(item)
                leftHeight += item.height
            } else {
                rightColumn.append(item)
                rightHeight += item.height
            }
        }

        return rightColumn
    }
}

struct GridItemView: View {
    let item: GridItem
    let width: CGFloat

    var body: some View {
        Text(item.content)
            .frame(width: width, height: item.height)
            .background(Color.blue)
            .cornerRadius(8)
            .padding([.leading, .trailing, .bottom], 8)
    }
}
```

### 4. コンテンツビューで使用

コンテンツビューでカスタムレイアウトを使用します。

```swift
struct ContentView: View {
    let items: [GridItem]

    var body: some View {
        MasonryGrid(items: items.sorted { $0.priority < $1.priority })
    }
}

@main
struct MyApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView(items: sampleData)
        }
    }
}
```

この方法で、アイテムが左から右、上から下の順に配置され、高さの合計が少ない方のカラムに次のアイテムが追加されるため、表示順が前後することなく配置されます。

---

## 👤 ユーザー
*2024/05/22 17:58:30*

下にスクロールしたら要素が10個追加されるようにしてほしい。

---

## 🤖 アシスタント
*2024/05/22 17:59:05*

下にスクロールしたら要素が10個追加されるようにするには、`onAppear`を使って新しいアイテムを追加する仕組みを作成します。以下にその実装例を示します。

### 1. データモデルの定義

データモデルは以前と同じです。

```swift
struct GridItem: Identifiable {
    let id = UUID()
    let priority: Int
    let content: String
    let height: CGFloat
}
```

### 2. コンテンツビューの更新

サンプルデータを追加するロジックと、アイテムを追加する機能を実装します。

```swift
struct ContentView: View {
    @State private var items: [GridItem] = (1...10).map {
        GridItem(priority: $0, content: "Item \($0)", height: CGFloat.random(in: 100...300))
    }

    var body: some View {
        MasonryGrid(items: items)
            .onAppear {
                loadMoreItems()
            }
    }

    private func loadMoreItems() {
        let currentCount = items.count
        let newItems = (currentCount+1...currentCount+10).map {
            GridItem(priority: $0, content: "Item \($0)", height: CGFloat.random(in: 100...300))
        }
        items.append(contentsOf: newItems)
    }
}
```

### 3. MasonryGridの更新

`onAppear`を使って、スクロールの終端で新しいアイテムを追加します。

```swift
struct MasonryGrid: View {
    let items: [GridItem]
    @State private var isLoading: Bool = false

    var body: some View {
        GeometryReader { geometry in
            let columnWidth = geometry.size.width / 2

            ScrollView {
                VStack {
                    HStack(alignment: .top, spacing: 0) {
                        VStack {
                            ForEach(leftColumnItems) { item in
                                GridItemView(item: item, width: columnWidth)
                                    .onAppear {
                                        if item == items.last {
                                            loadMoreItems()
                                        }
                                    }
                            }
                        }
                        VStack {
                            ForEach(rightColumnItems) { item in
                                GridItemView(item: item, width: columnWidth)
                                    .onAppear {
                                        if item == items.last {
                                            loadMoreItems()
                                        }
                                    }
                            }
                        }
                    }
                    if isLoading {
                        ProgressView()
                            .padding()
                    }
                }
            }
        }
    }

    private var leftColumnItems: [GridItem] {
        var leftColumn: [GridItem] = []
        var rightColumn: [GridItem] = []
        var leftHeight: CGFloat = 0
        var rightHeight: CGFloat = 0

        for item in items {
            if leftHeight <= rightHeight {
                leftColumn.append(item)
                leftHeight += item.height
            } else {
                rightColumn.append(item)
                rightHeight += item.height
            }
        }

        return leftColumn
    }

    private var rightColumnItems: [GridItem] {
        var leftColumn: [GridItem] = []
        var rightColumn: [GridItem] = []
        var leftHeight: CGFloat = 0
        var rightHeight: CGFloat = 0

        for item in items {
            if leftHeight <= rightHeight {
                leftColumn.append(item)
                leftHeight += item.height
            } else {
                rightColumn.append(item)
                rightHeight += item.height
            }
        }

        return rightColumn
    }

    private func loadMoreItems() {
        guard !isLoading else { return }
        isLoading = true

        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
            let currentCount = items.count
            let newItems = (currentCount+1...currentCount+10).map {
                GridItem(priority: $0, content: "Item \($0)", height: CGFloat.random(in: 100...300))
            }
            items.append(contentsOf: newItems)
            isLoading = false
        }
    }
}

struct GridItemView: View {
    let item: GridItem
    let width: CGFloat

    var body: some View {
        Text(item.content)
            .frame(width: width, height: item.height)
            .background(Color.blue)
            .cornerRadius(8)
            .padding([.leading, .trailing, .bottom], 8)
    }
}
```

### 4. コンテンツビューで使用

最後に、`ContentView`でアイテムが追加される機能を使用します。

```swift
@main
struct MyApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

このコードにより、ユーザーが下にスクロールするたびに、さらに10個のアイテムがリストに追加されるようになります。スクロールの終端で`onAppear`が呼び出され、新しいアイテムが読み込まれます。

---

## 👤 ユーザー
*2024/05/22 17:59:20*

onAppearではなくて、refreshable なのでは？

---

## 🤖 アシスタント
*2024/05/22 17:59:55*

スクロールの終端でアイテムを追加するには、`onAppear`を使う方法が一般的です。しかし、SwiftUIの`refreshable`修飾子を使うことで、プルツーリフレッシュ（Pull to Refresh）機能を実装することもできます。

以下は、`refreshable`を使って実装する例です。

### 1. データモデルの定義

データモデルは以前と同じです。

```swift
struct GridItem: Identifiable {
    let id = UUID()
    let priority: Int
    let content: String
    let height: CGFloat
}
```

### 2. サンプルデータの生成

サンプルデータを生成します。

```swift
let sampleData = (1...10).map {
    GridItem(priority: $0, content: "Item \($0)", height: CGFloat.random(in: 100...300))
}
```

### 3. MasonryGridの更新

`refreshable`を使って、プルツーリフレッシュ機能を追加します。

```swift
struct MasonryGrid: View {
    @Binding var items: [GridItem]

    var body: some View {
        GeometryReader { geometry in
            let columnWidth = geometry.size.width / 2

            ScrollView {
                VStack {
                    HStack(alignment: .top, spacing: 0) {
                        VStack {
                            ForEach(leftColumnItems) { item in
                                GridItemView(item: item, width: columnWidth)
                            }
                        }
                        VStack {
                            ForEach(rightColumnItems) { item in
                                GridItemView(item: item, width: columnWidth)
                            }
                        }
                    }
                }
                .refreshable {
                    loadMoreItems()
                }
            }
        }
    }

    private var leftColumnItems: [GridItem] {
        distributeItems(in: items).leftColumn
    }

    private var rightColumnItems: [GridItem] {
        distributeItems(in: items).rightColumn
    }

    private func distributeItems(in items: [GridItem]) -> (leftColumn: [GridItem], rightColumn: [GridItem]) {
        var leftColumn: [GridItem] = []
        var rightColumn: [GridItem] = []
        var leftHeight: CGFloat = 0
        var rightHeight: CGFloat = 0

        for item in items {
            if leftHeight <= rightHeight {
                leftColumn.append(item)
                leftHeight += item.height
            } else {
                rightColumn.append(item)
                rightHeight += item.height
            }
        }

        return (leftColumn, rightColumn)
    }

    private func loadMoreItems() {
        let currentCount = items.count
        let newItems = (currentCount+1...currentCount+10).map {
            GridItem(priority: $0, content: "Item \($0)", height: CGFloat.random(in: 100...300))
        }
        items.append(contentsOf: newItems)
    }
}

struct GridItemView: View {
    let item: GridItem
    let width: CGFloat

    var body: some View {
        Text(item.content)
            .frame(width: width, height: item.height)
            .background(Color.blue)
            .cornerRadius(8)
            .padding([.leading, .trailing, .bottom], 8)
    }
}
```

### 4. コンテンツビューで使用

コンテンツビューでカスタムレイアウトを使用し、アイテムが追加される機能を提供します。

```swift
struct ContentView: View {
    @State private var items: [GridItem] = (1...10).map {
        GridItem(priority: $0, content: "Item \($0)", height: CGFloat.random(in: 100...300))
    }

    var body: some View {
        MasonryGrid(items: $items)
    }
}

@main
struct MyApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

このコードでは、ユーザーがリストの上部を引っ張ってリフレッシュ操作を行うと、新しいアイテムが10個追加されます。`refreshable`はプルツーリフレッシュのためのもので、無限スクロールのような機能を実現するためには、依然として`onAppear`を使うのが一般的です。

---
