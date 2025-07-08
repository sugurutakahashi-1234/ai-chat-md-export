# SwiftUI Circle Color List

Date: 2023-05-19

---

## 👤 User
*2023-05-19 17:01:11*

SwiftUI で 円形の指定のcolorが塗りつぶされているアイコンとその左にカラー名をしめたしたようなListをLabel型のコンポーネントを使ってコードしてみて

---

## 🤖 Assistant
*2023-05-19 17:01:53*

SwiftUI で、指定の色が塗りつぶされた円形のアイコンとその左に色名を表示した List を作成するには、次のようなコードを使用できます：

```swift
import SwiftUI

struct ColorListItem: View {
    var color: Color
    var colorName: String

    var body: some View {
        Label {
            Text(colorName)
        } icon: {
            Circle()
                .fill(color)
                .frame(width: 20, height: 20)
        }
    }
}

struct ContentView: View {
    let colors: [(Color, String)] = [
        (.red, "Red"),
        (.green, "Green"),
        (.blue, "Blue"),
        (.orange, "Orange"),
        (.yellow, "Yellow"),
        (.purple, "Purple")
    ]
    
    var body: some View {
        List {
            ForEach(colors, id: \.1) { color, colorName in
                ColorListItem(color: color, colorName: colorName)
            }
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
```

このコードは、`ColorListItem`というビューを定義し、各色と色名を表します。`ContentView`では、様々な色と色名のペアを持つリストを定義し、そのリストをループして各色に対応する`ColorListItem`ビューを作成します。

`Label`コンポーネントは、テキストとアイコン（この場合は色で塗りつぶされた円）を一緒に表示するための便利な方法を提供します。

---

## 👤 User
*2023-05-19 17:21:47*

以下のsecondary を Neutral に変換して

secondary90, secondary80, secondary70, secondary60, secondary50, secondary40, secondary30, secondary20, secondary10, secondary5

---

## 🤖 Assistant
*2023-05-19 17:22:21*

SwiftUIで色をカスタム定義する方法を紹介します。それにより、あなたの`secondary`シリーズを`neutral`シリーズに変換することが可能です。

まず、あなたのプロジェクトで使っている色の具体的なRGB値やHSB値が必要となります。あなたの`secondary`色シリーズの具体的な色がどのようになっているかはわかりませんが、仮に以下のようなRGB値を持つ色だとします：

```swift
extension Color {
    static let secondary90 = Color(red: 0.9, green: 0.9, blue: 0.9)
    static let secondary80 = Color(red: 0.8, green: 0.8, blue: 0.8)
    // 以下略
}
```

そしてこれらを`neutral`に変換したいとします。それには以下のように書くことができます：

```swift
extension Color {
    static let neutral90 = Color.secondary90
    static let neutral80 = Color.secondary80
    // 以下略
}
```

ただし、もし`neutral`の色シリーズが`secondary`シリーズと異なる具体的な色を持つ必要がある場合は、その色の具体的なRGB値やHSB値を指定する必要があります。

---

## 👤 User
*2023-05-19 17:23:38*

以下のsecondary を neutral に変換してほしい。1行でお願い。

secondary90, secondary80, secondary70, secondary60, secondary50, secondary40, secondary30, secondary20, secondary10, secondary5

---

## 🤖 Assistant
*2023-05-19 17:24:04*

一行で書く場合、以下のようになります：

```swift
let neutrals = [secondary90, secondary80, secondary70, secondary60, secondary50, secondary40, secondary30, secondary20, secondary10, secondary5].map { Color($0) }
```

ここでは、`secondaryXX`の各値を`Color`として新しい配列`neutrals`にマッピングしています。ただし、この例では`Color`を生成するための適切な`Color`初期化子が必要となります。

そして、`neutrals`配列には、元の`secondaryXX`の各値が`Color`として格納されます。

しかし、SwiftUIの`Color`に直接マッピングする方法は推奨されません。なぜなら、それは色の名前を持つことができず、あとからどの色が何かを判別するのが難しくなるからです。なので、個々の色に名前を付けて定義することを推奨します。

---
