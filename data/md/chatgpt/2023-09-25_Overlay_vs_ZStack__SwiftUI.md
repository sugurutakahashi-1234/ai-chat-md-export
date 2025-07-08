# Overlay vs ZStack: SwiftUI

日付: 2023-09-25

---

## 👤 ユーザー
*2023/09/25 11:30:32*

SwiftUI で overlay と ZStack はどのように使い分けますか？

---

## 🤖 アシスタント
*2023/09/25 11:31:21*

SwiftUIでの`overlay`と`ZStack`は、ビューのレイアウトや配置を操作するためのもので、どちらもビューを重ねるために使用できますが、主に使い方や目的が異なります。

### 1. `overlay`:
`overlay`は、ビューの上に別のビューを重ねる時に使います。基本的に、元のビューのサイズを基準に、新たなビューを重ねます。これは、主にデコレーションや、少しの追加情報を表示するために利用されます。

```swift
Text("Hello, World!")
    .overlay(
        Circle()
            .fill(Color.red)
            .frame(width: 10, height: 10)
            ,alignment: .topTrailing)
```

上の例では、`Text`ビューの上に、赤い小さな`Circle`ビューを重ねています。

### 2. `ZStack`:
`ZStack`は、複数のビューを同じフレーム内で重ねるために使用します。これは、ビューが互いに重なっているレイアウトを作りたいときや、複数のビューを組み合わせたいときに利用されます。`ZStack`の中のビューは、基本的に中央に配置されますが、`alignment`プロパティを使用して位置を調整できます。

```swift
ZStack {
    Circle()
        .fill(Color.blue)
        .frame(width: 100, height: 100)
    Text("Hello, World!")
        .foregroundColor(.white)
}
```

この例では、`Circle`ビューの中央に`Text`ビューが重ねられています。

### 使い分けのポイント:
- 軽微なデコレーションや追加情報を表示したい場合、または元のビューに対して位置を調整したい場合は`overlay`を利用します。
- 複数のビューを重ねて、新しい複合ビューを作りたい場合、またはビュー同士の位置関係を調整したい場合は`ZStack`を利用します。

---
