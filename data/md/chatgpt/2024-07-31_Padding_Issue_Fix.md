# Padding Issue Fix

日付: 2024-07-31

---

## 👤 ユーザー
*2024/07/31 16:14:24*

{
  "content_type": "image_asset_pointer",
  "asset_pointer": "file-service://file-agzG6dMY7Ol9srfLA1KuUu0e",
  "size_bytes": 251641,
  "width": 495,
  "height": 912,
  "fovea": null,
  "metadata": {
    "dalle": null,
    "gizmo": null,
    "generation": null,
    "container_pixel_height": null,
    "container_pixel_width": null,
    "emu_omit_glimpse_image": null,
    "emu_patches_override": null,
    "sanitized": true,
    "asset_pointer_link": null,
    "watermarked_asset_pointer": null
  }
}
.padding(.horizontal, 16) が効かないというか、画面の右にpaddingが集中している。両サイドに 16 のパディングを入れたい

import SwiftUI

struct PinterestGridLayout: Layout {
    let columns: Int
    let verticalSpacing: CGFloat
    let horizontalSpacing: CGFloat

    init(columns: Int, verticalSpacing: CGFloat, horizontalSpacing: CGFloat) {
        self.columns = columns
        self.verticalSpacing = verticalSpacing
        self.horizontalSpacing = horizontalSpacing
    }

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache _: inout ()) -&gt; CGSize {
        // 各列の高さを保持する配列
        var columnHeights = Array(repeating: CGFloat(0), count: columns)
        // 提案された幅から横スペーシングを引いて各列の幅を計算
        let width = (proposal.replacingUnspecifiedDimensions().width - CGFloat(columns - 1) * horizontalSpacing) / CGFloat(columns)

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
        let columnWidth = (bounds.width - CGFloat(columns - 1) * horizontalSpacing) / CGFloat(columns)

        // 各サブビューを最も短い列に配置する
        for index in subviews.indices {
            // 最も高さが低い列を見つける
            let columnIndex = columnHeights.firstIndex(of: columnHeights.min() ?? 0) ?? 0
            // 配置する位置を計算
            let x = CGFloat(columnIndex) * (columnWidth + horizontalSpacing)
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

import DomainLayer

@available(iOS 18.0, *)
#Preview {
    @Previewable @State var talkBoxs: [TalkBox] = TalkBox.randoms

    ScrollView {
        PinterestGridLayout(columns: 2, verticalSpacing: 16, horizontalSpacing: 16) {
            ForEach(talkBoxs.indices, id: \.self) { index in
                TalkBoxView(talkBox: talkBoxs[index])
                    .overlay {
                        Text("\(index)")
                            .font(.largeTitle)
                            .foregroundStyle(Color.white)
                    }
            }
        }
        .padding(.horizontal, 16)
    }
}

---

## 🤖 アシスタント
*2024/07/31 16:15:06*

To ensure that both sides of the view have a horizontal padding of 16, you need to adjust the calculation for the `columnWidth` and make sure the padding is applied correctly in the layout logic. Here's an updated version of the `PinterestGridLayout` that ensures the padding is applied correctly on both sides:

```swift
import SwiftUI

struct PinterestGridLayout: Layout {
    let columns: Int
    let verticalSpacing: CGFloat
    let horizontalSpacing: CGFloat

    init(columns: Int, verticalSpacing: CGFloat, horizontalSpacing: CGFloat) {
        self.columns = columns
        self.verticalSpacing = verticalSpacing
        self.horizontalSpacing = horizontalSpacing
    }

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache _: inout ()) -> CGSize {
        // 各列の高さを保持する配列
        var columnHeights = Array(repeating: CGFloat(0), count: columns)
        // 提案された幅からパディングと横スペーシングを引いて各列の幅を計算
        let width = (proposal.replacingUnspecifiedDimensions().width - 2 * horizontalSpacing - CGFloat(columns - 1) * horizontalSpacing) / CGFloat(columns)

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
        let columnWidth = (bounds.width - 2 * horizontalSpacing - CGFloat(columns - 1) * horizontalSpacing) / CGFloat(columns)

        // 各サブビューを最も短い列に配置する
        for index in subviews.indices {
            // 最も高さが低い列を見つける
            let columnIndex = columnHeights.firstIndex(of: columnHeights.min() ?? 0) ?? 0
            // 配置する位置を計算
            let x = horizontalSpacing + CGFloat(columnIndex) * (columnWidth + horizontalSpacing)
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

import DomainLayer

@available(iOS 18.0, *)
#Preview {
    @Previewable @State var talkBoxs: [TalkBox] = TalkBox.randoms

    ScrollView {
        PinterestGridLayout(columns: 2, verticalSpacing: 16, horizontalSpacing: 16) {
            ForEach(talkBoxs.indices, id: \.self) { index in
                TalkBoxView(talkBox: talkBoxs[index])
                    .overlay {
                        Text("\(index)")
                            .font(.largeTitle)
                            .foregroundStyle(Color.white)
                    }
            }
        }
        .padding(.horizontal, 16)
    }
}
```

In this updated version, the horizontal padding is considered when calculating the column width and the placement of the subviews. This ensures that the padding is correctly applied on both sides.

---

## 👤 ユーザー
*2024/07/31 16:17:20*

PinterestGridLayout にhorizontalPadding を引数で渡したい

---

## 🤖 アシスタント
*2024/07/31 16:17:54*

Sure, you can modify the `PinterestGridLayout` to accept `horizontalPadding` as an argument. This will allow you to customize the padding when creating the layout. Here’s how you can do it:

```swift
import SwiftUI

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

import DomainLayer

@available(iOS 18.0, *)
#Preview {
    @Previewable @State var talkBoxs: [TalkBox] = TalkBox.randoms

    ScrollView {
        PinterestGridLayout(columns: 2, verticalSpacing: 16, horizontalSpacing: 16, horizontalPadding: 16) {
            ForEach(talkBoxs.indices, id: \.self) { index in
                TalkBoxView(talkBox: talkBoxs[index])
                    .overlay {
                        Text("\(index)")
                            .font(.largeTitle)
                            .foregroundStyle(Color.white)
                    }
            }
        }
        .padding(.horizontal, 0) // パディングはレイアウト内で処理されるためここでは 0 を設定
    }
}
```

In this version, `horizontalPadding` is passed as an argument to the layout initializer and used in the calculations for the column width and placement of subviews. This ensures that the padding is correctly applied on both sides according to the value provided.

---
