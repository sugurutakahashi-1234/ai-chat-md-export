# SwiftUI Letter Spacing

Date: 2023-05-24

---

## 👤 User
*2023-05-24 12:23:48*

SwiftUI で Letter Spacing を 実装する方法

---

## 🤖 Assistant
*2023-05-24 12:24:16*

SwiftUIでは、`.kerning` 修飾子を使用してテキストに対する文字間隔 (Letter Spacing) を調整することができます。

次の例では、文字間隔を2ポイントに設定しています。

```swift
Text("Hello, World!")
    .kerning(2)
```

ここで `.kerning(2)` の部分が文字間隔を設定しています。数字を調整することで間隔を増減することが可能です。この例では、文字間隔は2ポイントです。

また、`.tracking` 修飾子も利用でき、これは字間を広げることができますが、`.kerning`とは少し異なります。字間とは異なり、`.tracking` は文字サイズに対する相対的なスペースを増やすので、フォントの大きさが変わるとスペーシングもそれに応じて変わります。例えば、下記のようになります。

```swift
Text("Hello, World!")
    .tracking(2)
```

適切なスペーシングを選択するためには、具体的なデザイン要件や視覚的なニーズに基づいて、これらの修飾子を試してみることをお勧めします。

---

## 👤 User
*2023-05-24 12:25:25*

kerning の設定が フォントに対しての割合（例えば 5%）みたいな場合とポイント指定の両方に対応するような enum を作成して、実装したい

---

## 🤖 Assistant
*2023-05-24 12:26:00*

Swift における Enum を用いて、定数値またはパーセンテージによる kerning を提供することは可能です。この目的のための一般的な実装を以下に示します：

```swift
import SwiftUI

enum KerningValue {
    case points(CGFloat)
    case percent(CGFloat)
}

extension Text {
    func customKerning(_ value: KerningValue, fontSize: CGFloat) -> Text {
        switch value {
        case .points(let points):
            return self.kerning(points)
        case .percent(let percent):
            return self.kerning(fontSize * percent / 100)
        }
    }
}

struct ContentView: View {
    var body: some View {
        VStack {
            Text("Hello, World!")
                .font(.system(size: 24))
                .customKerning(.points(2), fontSize: 24)
            
            Text("Hello, World!")
                .font(.system(size: 24))
                .customKerning(.percent(10), fontSize: 24)
        }
    }
}
```

このコードでは、新たに定義した `KerningValue` Enum が `.points(CGFloat)` と `.percent(CGFloat)` の二つのケースを持っています。そして `Text` に `customKerning` メソッドを追加することで、この Enum を引数として kerning を設定することができます。

この例では、`.customKerning(.points(2), fontSize: 24)` と `.customKerning(.percent(10), fontSize: 24)` を使ってそれぞれ定数値とパーセンテージによる kerning を設定しています。

ただし、パーセンテージによる kerning を設定する場合は、このメソッドに加えてフォントのサイズを引数として渡す必要があります。これは、パーセンテージによる kerning はフォントのサイズに依存するためです。

---

## 👤 User
*2023-05-24 12:31:01*

lineHight と Kerningの両方設定したい場合はどうすればいいか

---

## 🤖 Assistant
*2023-05-24 12:31:42*

SwiftUIでは、テキストの行高（line height）を直接設定するメソッドは提供されていません。しかし、間接的に行高をコントロールするためには、テキストを囲むVStack（垂直スタック）やHStack（水平スタック）の`spacing`プロパティを利用することができます。

そして、その上でカーニング（kerning）を設定するためには、先ほど定義した`customKerning`メソッドを使用します。

以下に、VStackの`spacing`プロパティを使用して行高を調整し、さらにカーニングを設定する例を示します。

```swift
struct ContentView: View {
    var body: some View {
        VStack(spacing: 30) {
            Text("Hello, World!")
                .font(.system(size: 24))
                .customKerning(.points(2), fontSize: 24)
            
            Text("Hello, World!")
                .font(.system(size: 24))
                .customKerning(.percent(10), fontSize: 24)
        }
    }
}
```

この例では、VStackの`spacing`プロパティを30に設定して行高を調整し、その後で`customKerning`メソッドを使用してカーニングを設定しています。

ただし、VStackの`spacing`プロパティはテキスト間のスペースを調整するものであり、行内での行高をコントロールするものではありません。現在のところ、SwiftUIで行内の行高を直接制御するメソッドは提供されていません。そのため、行内での行高を調整するためには、適切なフォントとフォントサイズの選択が重要になります。

---
