# カスタマイズ可能なSwiftUI ProgressView

Date: 2023-09-21

---

## 👤 User
*2023-09-21 14:32:44*

SwiftUIのprogressViewStyle(.linear) ではどこまで表示を変更できるのか？

---

## 🤖 Assistant
*2023-09-21 14:34:11*

`progressViewStyle(_:)` は、SwiftUIの `ProgressView` の見た目をカスタマイズするための修飾子です。`ProgressViewStyle` の一つである `.linear` は、線形的な進捗バーのスタイルを提供します。

`.linear` を使用することで、線形の進捗バーの見た目をデフォルトのものに設定することができますが、このスタイル自体には追加のカスタマイズオプションが用意されていません。

しかし、カスタマイズの要件がある場合、以下の手段で対応することができます：

1. **基本の修飾子の使用**：`ProgressView` 自体に色やサイズなどの修飾子を適用することで、見た目の調整を行うことができます。

   ```swift
   ProgressView(value: 0.5)
       .progressViewStyle(.linear)
       .tint(Color.blue)  // 進捗バーの色を変更
       .scaleEffect(1.5)  // サイズを変更
   ```

2. **独自の `ProgressViewStyle` の作成**：特定のカスタマイズが必要な場合、`ProgressViewStyle` のプロトコルに従って独自のスタイルを作成することができます。これにより、進捗バーの見た目や動作を完全にカスタマイズすることが可能です。

   ```swift
   struct CustomProgressViewStyle: ProgressViewStyle {
       func makeBody(configuration: Configuration) -> some View {
           // カスタムの進捗バーのビューを返す
       }
   }
   ```

最終的に、`.linear` で提供されるスタイルのカスタマイズ範囲は限られていますが、基本の修飾子や独自のスタイルを作成することで、様々なカスタマイズが可能です。

---

## 👤 User
*2023-09-21 14:34:29*

例えば、円で100%で表現するようにするにはどうすればいいか？

---

## 🤖 Assistant
*2023-09-21 14:35:37*

円形の進捗表示を実現するには、SwiftUIの `ProgressView` と共に `.circular` スタイルを使用します。ただし、SwiftUIの既定のスタイルでは、`.circular` は存在しないため、独自にカスタマイズする必要があります。

以下は、円形の進捗バーを実現するための簡単な例です：

1. 独自の `ProgressViewStyle` を定義します。

```swift
struct CircularProgressViewStyle: ProgressViewStyle {
    func makeBody(configuration: Configuration) -> some View {
        ZStack {
            Circle()
                .stroke(lineWidth: 10)
                .opacity(0.3)
                .foregroundColor(Color.gray)

            Circle()
                .trim(from: 0.0, to: CGFloat(configuration.fractionCompleted ?? 0))
                .stroke(style: StrokeStyle(lineWidth: 10, lineCap: .round))
                .rotationEffect(.degrees(-90))
                .foregroundColor(.blue)
                .rotationEffect(.degrees(270))
        }
    }
}
```

2. `ProgressView` にこの新しいスタイルを適用します。

```swift
ProgressView(value: 0.5, total: 1.0)
    .progressViewStyle(CircularProgressViewStyle())
    .frame(width: 100, height: 100)
```

このコードは、進捗の50%が完了したことを示す円形の進捗バーを表示します。`ProgressView` の `value` プロパティを変更することで、異なる進捗状況を示すことができます。

このカスタムスタイルは基本的なもので、さらに高度なカスタマイズやアニメーションを追加することも可能です。

---
