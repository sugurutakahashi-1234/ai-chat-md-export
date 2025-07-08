# PinterestGridLayout Error Debug

日付: 2024-07-31

---

## 👤 ユーザー
*2024/07/31 18:37:40*

どこかでInvalid frame dimension (negative or non-finite).というエラーになっているかもしれない。

struct PinterestGridLayout: Layout {
    let columns: Int
    let verticalSpacing: CGFloat
    let horizontalSpacing: CGFloat
    let horizontalPadding: CGFloat

    init(columns: Int, verticalSpacing: CGFloat, horizontalSpacing: CGFloat, horizontalPadding: CGFloat) {
        self.columns = columns
        self.verticalSpacing = verticalSpacing
        self.horizontalSpacing = horizontalSpacing
        self.horizontalPadding = horizontalPadding
    }

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache _: inout ()) -&gt; CGSize {
        // 各列の高さを保持する配列
        var columnHeights = Array(repeating: CGFloat(0), count: columns)
        // 提案された幅からパディングと横スペーシングを引いて各列の幅を計算
        let width = (proposal.replacingUnspecifiedDimensions().width - 2 * horizontalPadding - CGFloat(columns - 1) * horizontalSpacing) / CGFloat(columns)

        // 各サブビューのサイズを計算し、最も短い列に配置する
        for index in subviews.indices {
            // 最も高さが低い列を見つける
            let columnIndex = columnHeights.firstIndex(of: columnHeights.min() ?? 0) ?? 0
            // サブビューのサイズを計算
            let size = subviews[index].sizeThatFits(ProposedViewSize(width: width, height: nil))
            // 列の高さを更新（サブビューの高さ + 縦スペーシング）
            columnHeights[columnIndex] += size.height + verticalSpacing
        }

        // 最も高い列の高さを全体の高さとして返す（最後のスペーシングは引く）
        let height = (columnHeights.max() ?? 0) - verticalSpacing
        return CGSize(width: proposal.width ?? 0, height: height)
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache _: inout ()) {
        // 各列の高さを保持する配列
        var columnHeights = Array(repeating: CGFloat(0), count: columns)
        // 各列の幅を計算
        let columnWidth = (bounds.width - 2 * horizontalPadding - CGFloat(columns - 1) * horizontalSpacing) / CGFloat(columns)

        // 各サブビューを最も短い列に配置する
        for index in subviews.indices {
            // 最も高さが低い列を見つける
            let columnIndex = columnHeights.firstIndex(of: columnHeights.min() ?? 0) ?? 0
            // 配置する位置を計算
            let x = horizontalPadding + CGFloat(columnIndex) * (columnWidth + horizontalSpacing)
            let y = columnHeights[columnIndex]

            // サブビューのサイズを計算
            let size = subviews[index].sizeThatFits(ProposedViewSize(width: columnWidth, height: nil))
            // サブビューを指定された位置に配置
            subviews[index].place(at: CGPoint(x: x, y: y), anchor: .topLeading, proposal: ProposedViewSize(width: columnWidth, height: size.height))

            // 列の高さを更新（サブビューの高さ + 縦スペーシング）
            columnHeights[columnIndex] += size.height + verticalSpacing
        }
    }
}

---

## 🤖 アシスタント
*2024/07/31 18:38:19*

`Invalid frame dimension (negative or non-finite).`というエラーは、ビューのレイアウト中に無効な寸法が渡されたときに発生します。おそらく、サイズ計算中に無効な幅や高さが原因でエラーが発生している可能性があります。これをデバッグするためには、幅と高さの計算ロジックを確認し、提案されたサイズや計算されたサイズが適切かどうかを検証する必要があります。

以下の改善を試みてください：

1. **幅の計算ロジックを修正**：
    - `width`の計算中に`proposal.width`がnilの場合、無効な計算が発生する可能性があります。
    - 提案された幅が指定されていない場合に対処するためにデフォルト値を設定します。

2. **高さの計算ロジックを検証**：
    - サブビューのサイズ計算結果が正しいかを検証します。

3. **負または非有限なサイズのチェック**：
    - サイズ計算後に負または非有限な値が存在しないことを確認します。

以下は修正版のコードです：

```swift
struct PinterestGridLayout: Layout {
    let columns: Int
    let verticalSpacing: CGFloat
    let horizontalSpacing: CGFloat
    let horizontalPadding: CGFloat

    init(columns: Int, verticalSpacing: CGFloat, horizontalSpacing: CGFloat, horizontalPadding: CGFloat) {
        self.columns = columns
        self.verticalSpacing = verticalSpacing
        self.horizontalSpacing = horizontalSpacing
        self.horizontalPadding = horizontalPadding
    }

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache _: inout ()) -> CGSize {
        var columnHeights = Array(repeating: CGFloat(0), count: columns)
        let width = (proposal.width ?? 0 - 2 * horizontalPadding - CGFloat(columns - 1) * horizontalSpacing) / CGFloat(columns)
        
        guard width.isFinite && width > 0 else {
            return CGSize(width: proposal.width ?? 0, height: 0)
        }

        for index in subviews.indices {
            let columnIndex = columnHeights.firstIndex(of: columnHeights.min() ?? 0) ?? 0
            let size = subviews[index].sizeThatFits(ProposedViewSize(width: width, height: nil))
            columnHeights[columnIndex] += size.height + verticalSpacing
        }

        let height = (columnHeights.max() ?? 0) - verticalSpacing
        return CGSize(width: proposal.width ?? 0, height: max(height, 0))
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache _: inout ()) {
        var columnHeights = Array(repeating: CGFloat(0), count: columns)
        let columnWidth = (bounds.width - 2 * horizontalPadding - CGFloat(columns - 1) * horizontalSpacing) / CGFloat(columns)
        
        guard columnWidth.isFinite && columnWidth > 0 else {
            return
        }

        for index in subviews.indices {
            let columnIndex = columnHeights.firstIndex(of: columnHeights.min() ?? 0) ?? 0
            let x = horizontalPadding + CGFloat(columnIndex) * (columnWidth + horizontalSpacing)
            let y = columnHeights[columnIndex]
            let size = subviews[index].sizeThatFits(ProposedViewSize(width: columnWidth, height: nil))
            
            guard size.width.isFinite && size.height.isFinite && size.width > 0 && size.height > 0 else {
                continue
            }

            subviews[index].place(at: CGPoint(x: x, y: y), anchor: .topLeading, proposal: ProposedViewSize(width: columnWidth, height: size.height))
            columnHeights[columnIndex] += size.height + verticalSpacing
        }
    }
}
```

この修正では、幅や高さが無限や負の値でないことをチェックし、無効な計算を回避します。また、`sizeThatFits`メソッドでは、提案された幅がnilの場合にデフォルト値を使用するようにします。

---

## 👤 ユーザー
*2024/07/31 18:38:43*

ややこしいので負の可能性がある場合は max 0とかで回避できない

---

## 🤖 アシスタント
*2024/07/31 18:39:11*

はい、負の値の可能性がある場合は `max(0, value)` を使って回避できます。これにより、計算結果が負になることを防ぎます。以下にそのような変更を加えた修正版のコードを示します：

```swift
struct PinterestGridLayout: Layout {
    let columns: Int
    let verticalSpacing: CGFloat
    let horizontalSpacing: CGFloat
    let horizontalPadding: CGFloat

    init(columns: Int, verticalSpacing: CGFloat, horizontalSpacing: CGFloat, horizontalPadding: CGFloat) {
        self.columns = columns
        self.verticalSpacing = verticalSpacing
        self.horizontalSpacing = horizontalSpacing
        self.horizontalPadding = horizontalPadding
    }

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache _: inout ()) -> CGSize {
        var columnHeights = Array(repeating: CGFloat(0), count: columns)
        let width = max(0, (proposal.width ?? 0 - 2 * horizontalPadding - CGFloat(columns - 1) * horizontalSpacing) / CGFloat(columns))
        
        for index in subviews.indices {
            let columnIndex = columnHeights.firstIndex(of: columnHeights.min() ?? 0) ?? 0
            let size = subviews[index].sizeThatFits(ProposedViewSize(width: width, height: nil))
            columnHeights[columnIndex] += size.height + verticalSpacing
        }

        let height = max(0, (columnHeights.max() ?? 0) - verticalSpacing)
        return CGSize(width: max(0, proposal.width ?? 0), height: height)
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache _: inout ()) {
        var columnHeights = Array(repeating: CGFloat(0), count: columns)
        let columnWidth = max(0, (bounds.width - 2 * horizontalPadding - CGFloat(columns - 1) * horizontalSpacing) / CGFloat(columns))

        for index in subviews.indices {
            let columnIndex = columnHeights.firstIndex(of: columnHeights.min() ?? 0) ?? 0
            let x = horizontalPadding + CGFloat(columnIndex) * (columnWidth + horizontalSpacing)
            let y = columnHeights[columnIndex]
            let size = subviews[index].sizeThatFits(ProposedViewSize(width: columnWidth, height: nil))
            
            subviews[index].place(at: CGPoint(x: x, y: y), anchor: .topLeading, proposal: ProposedViewSize(width: columnWidth, height: size.height))
            columnHeights[columnIndex] += size.height + verticalSpacing
        }
    }
}
```

この修正では、幅や高さの計算結果が負にならないように `max(0, value)` を使用しています。これにより、負の値によるエラーを回避できます。

---
