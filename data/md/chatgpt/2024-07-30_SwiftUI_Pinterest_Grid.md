# SwiftUI Pinterest Grid

Date: 2024-07-30

---

## 👤 User
*2024-07-30 15:42:59*

Pinterest風なグリッドデザインをSwiftUIで実装したい。2列の縦スクロールのViewで横の大きさは一定で縦の大きさが5段階に分かれている、その際に各列では縦の間を詰めて実装したい

private extension TalkBoxSize {
    var value: CGFloat {
        switch self {
        case .extraSmall:
            160
        case .small:
            200
        case .medium:
            240
        case .large:
            280
        case .extraLarge:
            320
        }
    }
}

---

## 🤖 Assistant
*2024-07-30 15:43:17*

User wants to implement a Pinterest-like grid design in SwiftUI with a vertically scrolling view with 2 columns, where the width is fixed and the height is divided into 5 sizes. They want to reduce vertical spacing between items within each column.

---

## 🔧 Tool
*2024-07-30 15:43:17*

Model set context updated.

---

## 🤖 Assistant
*2024-07-30 15:43:17*

Pinterest風のグリッドデザインをSwiftUIで実装するには、`LazyVGrid`を使用し、カスタムサイズのアイテムを配置する方法が効果的です。以下はその実装例です。

まず、`TalkBoxSize`の列挙型を定義します。

```swift
enum TalkBoxSize: CaseIterable {
    case extraSmall, small, medium, large, extraLarge
    
    var value: CGFloat {
        switch self {
        case .extraSmall:
            return 160
        case .small:
            return 200
        case .medium:
            return 240
        case .large:
            return 280
        case .extraLarge:
            return 320
        }
    }
}
```

次に、`PinterestGridView`という名前のSwiftUIビューを作成します。

```swift
import SwiftUI

struct PinterestGridView: View {
    let items: [TalkBoxSize] = Array(repeating: TalkBoxSize.allCases, count: 10).flatMap { $0 }
    
    let columns: [GridItem] = [
        GridItem(.fixed(UIScreen.main.bounds.width / 2 - 10), spacing: 10),
        GridItem(.fixed(UIScreen.main.bounds.width / 2 - 10), spacing: 10)
    ]
    
    var body: some View {
        ScrollView {
            LazyVGrid(columns: columns, spacing: 10) {
                ForEach(items.indices, id: \.self) { index in
                    Rectangle()
                        .fill(Color.blue)
                        .frame(height: items[index].value)
                        .cornerRadius(10)
                }
            }
            .padding(.horizontal, 10)
        }
    }
}

struct PinterestGridView_Previews: PreviewProvider {
    static var previews: some View {
        PinterestGridView()
    }
}
```

このコードでは、`TalkBoxSize`列挙型を使って異なる高さのアイテムを生成しています。また、`LazyVGrid`を使って2列のグリッドを作成し、アイテム間の垂直スペースを詰めています。`GridItem`の設定で列の幅を固定し、スペースを調整しています。これにより、Pinterest風のグリッドレイアウトを実現できます。

---

## 👤 User
*2024-07-30 15:45:43*

これだと横の塊で同じ高さを取ってしまっていて、一つ一つの列では垂直方向に詰まっていない

---

## 🤖 Assistant
*2024-07-30 15:45:53*

アイテムをPinterest風に配置するために、各列が独立して高さを決定し、垂直方向に詰めるようにするには、カスタムレイアウトを使用する必要があります。以下のコードはその実装例です。

```swift
import SwiftUI

struct PinterestGridView: View {
    let items: [TalkBoxSize] = Array(repeating: TalkBoxSize.allCases, count: 10).flatMap { $0 }
    
    var body: some View {
        ScrollView {
            PinterestGrid(items: items)
                .padding(.horizontal, 10)
        }
    }
}

struct PinterestGrid: View {
    let items: [TalkBoxSize]
    let numberOfColumns = 2
    
    var body: some View {
        GeometryReader { geometry in
            let columnWidth = (geometry.size.width - CGFloat(numberOfColumns - 1) * 10) / CGFloat(numberOfColumns)
            
            let columns = Array(repeating: GridItem(.fixed(columnWidth)), count: numberOfColumns

---
