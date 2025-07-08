# Color View Refactoring

Date: 2023-05-19

---

## 👤 User
*2023-05-19 15:55:49*

以下のViewのコードをリファクタして欲しい

```swift

protocol ColorAssetsListable {
    static var name: String { get }
    static var allColors: [ColorAsset] { get }
}

extension CoreAssets.Color.Error: ColorAssetsListable {
    static var name: String { "\(self)" }
    
    static var allColors: [ColorAsset] {
        [error40, error60, error80, error100]
    }
}

extension CoreAssets.Color.Neutral: ColorAssetsListable {
    static var name: String { "\(self)" }
    
    static var allColors: [ColorAsset] {
        [black, white]
    }
}

extension ColorAsset: Identifiable {
    public var id: String {
        name
    }
}

struct ColorListView: View {
    private static let navigationTitle: String = "Color"

    var body: some View {
        SimpleCustomNavigationView {
            List {
                Section(header: Text(CoreAssets.Color.Error.name)) {
                    ForEach(CoreAssets.Color.Error.allColors) { color in
                        HStack {
                            Text(color.name)
                            Spacer()
                            Rectangle()
                                .fill(color.swiftUIColor)
                                .frame(width: 140)
                        }
                    }
                }
                Section(header: Text(CoreAssets.Color.Neutral.name)) {
                    ForEach(CoreAssets.Color.Neutral.allColors) { color in
                        HStack {
                            Text(color.name)
                            Spacer()
                            Rectangle()
                                .fill(color.swiftUIColor)
                                .frame(width: 140)
                        }
                    }
                }
            }
            .listStyle(.automatic)
            .navigationTitle(ColorListView.navigationTitle)
        }
    }
}

```

---

## 🤖 Assistant
*2023-05-19 15:56:41*

あなたのSwiftのコードはきれいで、一般的にはリファクタリングが必要ないように思われます。しかし、それぞれの`Section`が`ForEach`の中で似たようなロジックを繰り返しているため、ここを改善するために新しいビューを作成してこのロジックをそこに移動することができます。その他の部分は比較的簡潔で、役割に応じて適切に区切られています。

リファクタリング後のコードは以下の通りです：

```swift
protocol ColorAssetsListable {
    static var name: String { get }
    static var allColors: [ColorAsset] { get }
}

extension CoreAssets.Color.Error: ColorAssetsListable {
    static var name: String { "\(self)" }
    
    static var allColors: [ColorAsset] {
        [error40, error60, error80, error100]
    }
}

extension CoreAssets.Color.Neutral: ColorAssetsListable {
    static var name: String { "\(self)" }
    
    static var allColors: [ColorAsset] {
        [black, white]
    }
}

extension ColorAsset: Identifiable {
    public var id: String {
        name
    }
}

struct ColorRowView: View {
    let color: ColorAsset

    var body: some View {
        HStack {
            Text(color.name)
            Spacer()
            Rectangle()
                .fill(color.swiftUIColor)
                .frame(width: 140)
        }
    }
}

struct ColorSectionView<Assets: ColorAssetsListable>: View {
    var body: some View {
        Section(header: Text(Assets.name)) {
            ForEach(Assets.allColors) { color in
                ColorRowView(color: color)
            }
        }
    }
}

struct ColorListView: View {
    private static let navigationTitle: String = "Color"

    var body: some View {
        SimpleCustomNavigationView {
            List {
                ColorSectionView<CoreAssets.Color.Error>()
                ColorSectionView<CoreAssets.Color.Neutral>()
            }
            .listStyle(.automatic)
            .navigationTitle(ColorListView.navigationTitle)
        }
    }
}
```

この変更により、新しいカラーグループを追加する際に、新しい`Section`を手動で追加する必要がなくなり、`ColorSectionView`を使用して新しいカラーグループを表示することができます。同様に、`ColorRowView`はカラーの行を表示するためのコンポーネントとして再利用することが可能です。

なお、このコードはビューの部品をより具体的な単位に分割して再利用しやすくすることを目指しています。ただし、どのようにコードをリファクタリングするかはその目的や具体的な要件によります。これらの要素を考慮に入れて適切なアプローチを選択してください。

---

## 👤 User
*2023-05-19 15:57:04*

`CoreAssets.Color` も繰り返し記述しているけど省略できない？

---

## 🤖 Assistant
*2023-05-19 15:57:41*

はい、そのような場合には型エイリアスを使用することで冗長性を減らすことができます。型エイリアスを用いることで、`CoreAssets.Color`の参照を一箇所にまとめることが可能になります。以下に例を示します：

```swift
typealias ColorError = CoreAssets.Color.Error
typealias ColorNeutral = CoreAssets.Color.Neutral

protocol ColorAssetsListable {
    static var name: String { get }
    static var allColors: [ColorAsset] { get }
}

extension ColorError: ColorAssetsListable {
    static var name: String { "\(self)" }
    
    static var allColors: [ColorAsset] {
        [error40, error60, error80, error100]
    }
}

extension ColorNeutral: ColorAssetsListable {
    static var name: String { "\(self)" }
    
    static var allColors: [ColorAsset] {
        [black, white]
    }
}

extension ColorAsset: Identifiable {
    public var id: String {
        name
    }
}

struct ColorRowView: View {
    let color: ColorAsset

    var body: some View {
        HStack {
            Text(color.name)
            Spacer()
            Rectangle()
                .fill(color.swiftUIColor)
                .frame(width: 140)
        }
    }
}

struct ColorSectionView<Assets: ColorAssetsListable>: View {
    var body: some View {
        Section(header: Text(Assets.name)) {
            ForEach(Assets.allColors) { color in
                ColorRowView(color: color)
            }
        }
    }
}

struct ColorListView: View {
    private static let navigationTitle: String = "Color"

    var body: some View {
        SimpleCustomNavigationView {
            List {
                ColorSectionView<ColorError>()
                ColorSectionView<ColorNeutral>()
            }
            .listStyle(.automatic)
            .navigationTitle(ColorListView.navigationTitle)
        }
    }
}
```
上記のコードでは、`CoreAssets.Color.Error`と`CoreAssets.Color.Neutral`をそれぞれ`ColorError`と`ColorNeutral`として定義しています。これにより、コード全体で一貫してこれらのエイリアスを使用することができ、結果として冗長性が減少します。

---

## 👤 User
*2023-05-19 15:58:30*

ちょっと違くて、`CoreAssets.Color` の部分だけ共通化してほいいんだよ

---

## 🤖 Assistant
*2023-05-19 15:59:08*

なるほど、理解しました。それならば `CoreAssets.Color` を共通化するために、`ColorError`と`ColorNeutral`を定義する代わりに、`ColorType`という新しい型エイリアスを作り、それを使用することができます。以下に示すのはそのように修正したコードです:

```swift
typealias ColorType = CoreAssets.Color

protocol ColorAssetsListable {
    static var name: String { get }
    static var allColors: [ColorAsset] { get }
}

extension ColorType.Error: ColorAssetsListable {
    static var name: String { "\(self)" }
    
    static var allColors: [ColorAsset] {
        [error40, error60, error80, error100]
    }
}

extension ColorType.Neutral: ColorAssetsListable {
    static var name: String { "\(self)" }
    
    static var allColors: [ColorAsset] {
        [black, white]
    }
}

extension ColorAsset: Identifiable {
    public var id: String {
        name
    }
}

struct ColorRowView: View {
    let color: ColorAsset

    var body: some View {
        HStack {
            Text(color.name)
            Spacer()
            Rectangle()
                .fill(color.swiftUIColor)
                .frame(width: 140)
        }
    }
}

struct ColorSectionView<Assets: ColorAssetsListable>: View {
    var body: some View {
        Section(header: Text(Assets.name)) {
            ForEach(Assets.allColors) { color in
                ColorRowView(color: color)
            }
        }
    }
}

struct ColorListView: View {
    private static let navigationTitle: String = "Color"

    var body: some View {
        SimpleCustomNavigationView {
            List {
                ColorSectionView<ColorType.Error>()
                ColorSectionView<ColorType.Neutral>()
            }
            .listStyle(.automatic)
            .navigationTitle(ColorListView.navigationTitle)
        }
    }
}
```
このようにすることで、`ColorType`エイリアスを通じて`CoreAssets.Color`への参照を一箇所にまとめることができ、コード全体の冗長性が減ります。

---

## 👤 User
*2023-05-19 15:59:29*

ColorType を ColorAssets に変更して

---

## 🤖 Assistant
*2023-05-19 16:00:10*

はい、その通りです。`ColorType`の代わりに`ColorAssets`という名前を使用することも可能です。ただし、その場合、既に`ColorAssetsListable`という名前のプロトコルが存在するため、混乱を避けるためには適切な名前を選択することが重要です。

以下に修正版のコードを示します：

```swift
typealias ColorAssets = CoreAssets.Color

protocol ColorAssetsListable {
    static var name: String { get }
    static var allColors: [ColorAsset] { get }
}

extension ColorAssets.Error: ColorAssetsListable {
    static var name: String { "\(self)" }
    
    static var allColors: [ColorAsset] {
        [error40, error60, error80, error100]
    }
}

extension ColorAssets.Neutral: ColorAssetsListable {
    static var name: String { "\(self)" }
    
    static var allColors: [ColorAsset] {
        [black, white]
    }
}

extension ColorAsset: Identifiable {
    public var id: String {
        name
    }
}

struct ColorRowView: View {
    let color: ColorAsset

    var body: some View {
        HStack {
            Text(color.name)
            Spacer()
            Rectangle()
                .fill(color.swiftUIColor)
                .frame(width: 140)
        }
    }
}

struct ColorSectionView<Assets: ColorAssetsListable>: View {
    var body: some View {
        Section(header: Text(Assets.name)) {
            ForEach(Assets.allColors) { color in
                ColorRowView(color: color)
            }
        }
    }
}

struct ColorListView: View {
    private static let navigationTitle: String = "Color"

    var body: some View {
        SimpleCustomNavigationView {
            List {
                ColorSectionView<ColorAssets.Error>()
                ColorSectionView<ColorAssets.Neutral>()
            }
            .listStyle(.automatic)
            .navigationTitle(ColorListView.navigationTitle)
        }
    }
}
```

以上のように修正することで、コード全体で`ColorAssets`エイリアスを使用して`CoreAssets.Color`への参照を一箇所にまとめることができます。これにより、コード全体の冗長性が減ります。

---

## 👤 User
*2023-05-19 16:14:47*

以下を数字の大きい順に `, ` 区切りで1行に並べて

primary5, primary10, primary20, primary30, primary40,primary50, primary60, primary70, primary80, primary90, primary100

---

## 🤖 Assistant
*2023-05-19 16:14:55*

指定された順序で並べると以下の通りとなります：

`primary100, primary90, primary80, primary70, primary60, primary50, primary40, primary30, primary20, primary10, primary5`

---

## 👤 User
*2023-05-19 16:18:08*

SwiftUI.Color 型の値からカラーコードとオパシティを取得するコードを教えて

---

## 🤖 Assistant
*2023-05-19 16:18:59*

SwiftUI の `Color` オブジェクトから直接カラーコードやオパシティを取得する手段は提供されていません。そのため、カラーコードやオパシティを必要とする場合は、その値を直接管理するか、UIKitのUIColorを利用する必要があります。

ただし、SwiftUIの`Color`からUIKitの`UIColor`に変換することが可能です。以下にその方法を示します：

```swift
import SwiftUI
import UIKit

extension Color {
    func uiColor() -> UIColor {
        let components = self.cgColor?.components ?? [0, 0, 0]
        let r = components[0]
        let g = components[1]
        let b = components[2]
        let alpha = self.cgColor?.alpha ?? 1
        return UIColor(red: r, green: g, blue: b, alpha: alpha)
    }
}
```

これであるSwiftUIの`Color`を`UIColor`に変換することができます。そして、この`UIColor`からRGB値やオパシティを取得することが可能となります：

```swift
extension UIColor {
    var rgba: (red: CGFloat, green: CGFloat, blue: CGFloat, alpha: CGFloat) {
        var red: CGFloat = 0
        var green: CGFloat = 0
        var blue: CGFloat = 0
        var alpha: CGFloat = 0
        self.getRed(&red, green: &green, blue: &blue, alpha: &alpha)
        return (red, green, blue, alpha)
    }
}
```

注意点として、この方法では色空間がRGBでない場合や特定のプラットフォームでしか利用できない色（`Color.accentColor`など）に対しては正確な結果が得られない可能性があります。

また、`Color`から`CGColor`を取得する方法（`self.cgColor`）はiOS 14以降でのみ利用可能なため、iOS 13などそれより前のバージョンをサポートする場合は別のアプローチが必要となります。

---

## 👤 User
*2023-05-19 16:20:06*

rgba ではなくて #FF4E71 の形式の値が欲しい、また、オパシティを取得するコードもかいてほしいい

---

## 🤖 Assistant
*2023-05-19 16:20:39*

わかりました。以下にUIColorから16進数カラーコードを取得する拡張とオパシティを取得する拡張を記述します。ただし、この方法はRGBカラーに限定されます。

```swift
import SwiftUI
import UIKit

extension Color {
    func uiColor() -> UIColor {
        let components = self.cgColor?.components ?? [0, 0, 0]
        let r = components[0]
        let g = components[1]
        let b = components[2]
        let alpha = self.cgColor?.alpha ?? 1
        return UIColor(red: r, green: g, blue: b, alpha: alpha)
    }
}

extension UIColor {
    var hexString: String {
        guard let components = self.cgColor.components, components.count >= 3 else {
            return "000000"
        }

        let r = Float(components[0])
        let g = Float(components[1])
        let b = Float(components[2])

        return String(format: "%02lX%02lX%02lX", lroundf(r * 255), lroundf(g * 255), lroundf(b * 255))
    }
    
    var opacity: Float {
        return Float(self.cgColor.alpha)
    }
}
```

これらの拡張により、`Color` インスタンスから16進数のカラーコードとオパシティを取得することが可能となります。以下に使用例を示します：

```swift
let color = Color.red
let uiColor = color.uiColor()
let hexString = uiColor.hexString // Returns the hexadecimal color code as a string
let opacity = uiColor.opacity // Returns the opacity value as a float
```

注意点として、この拡張はRGBカラースペースの色に対してのみ正確に動作します。また、`Color` から `CGColor` を取得する方法は iOS 14 以降でのみ利用可能なため、iOS 13 などそれより前のバージョンをサポートする場合は別のアプローチが必要となります。

---

## 👤 User
*2023-05-19 16:23:22*

opacity を百文率で表すextensionもつくってほしい Int だと助かる

---

## 🤖 Assistant
*2023-05-19 16:24:04*

承知しました。以下にUIColorのオパシティをパーセンテージ（整数）で表す拡張を追加しました：

```swift
import SwiftUI
import UIKit

extension Color {
    func uiColor() -> UIColor {
        let components = self.cgColor?.components ?? [0, 0, 0]
        let r = components[0]
        let g = components[1]
        let b = components[2]
        let alpha = self.cgColor?.alpha ?? 1
        return UIColor(red: r, green: g, blue: b, alpha: alpha)
    }
}

extension UIColor {
    var hexString: String {
        guard let components = self.cgColor.components, components.count >= 3 else {
            return "000000"
        }

        let r = Float(components[0])
        let g = Float(components[1])
        let b = Float(components[2])

        return String(format: "%02lX%02lX%02lX", lroundf(r * 255), lroundf(g * 255), lroundf(b * 255))
    }
    
    var opacity: Int {
        return Int(self.cgColor.alpha * 100)
    }
}
```

この拡張機能を使用して、`Color` インスタンスから16進数のカラーコードとオパシティ（パーセンテージ表記）を取得することが可能となります。以下に使用例を示します：

```swift
let color = Color.red
let uiColor = color.uiColor()
let hexString = uiColor.hexString // Returns the hexadecimal color code as a string
let opacity = uiColor.opacity // Returns the opacity value as an integer percentage
```

この拡張機能はRGBカラースペースの色に対してのみ正確に動作します。また、`Color`から`CGColor`を取得する方法（`self.cgColor`）はiOS 14以降でのみ利用可能です。iOS 13などそれより前のバージョンをサポートする場合は別のアプローチが必要となります。

---

## 👤 User
*2023-05-19 16:27:15*

Xcodeの設定と若干、opacityの値がズレるんだけど、、、opacityのInt変換は四捨五入がよい

---

## 🤖 Assistant
*2023-05-19 16:27:44*

指摘いただきありがとうございます。四捨五入を用いて整数値に変換するように修正しました：

```swift
import SwiftUI
import UIKit

extension Color {
    func uiColor() -> UIColor {
        let components = self.cgColor?.components ?? [0, 0, 0]
        let r = components[0]
        let g = components[1]
        let b = components[2]
        let alpha = self.cgColor?.alpha ?? 1
        return UIColor(red: r, green: g, blue: b, alpha: alpha)
    }
}

extension UIColor {
    var hexString: String {
        guard let components = self.cgColor.components, components.count >= 3 else {
            return "000000"
        }

        let r = Float(components[0])
        let g = Float(components[1])
        let b = Float(components[2])

        return String(format: "%02lX%02lX%02lX", lroundf(r * 255), lroundf(g * 255), lroundf(b * 255))
    }
    
    var opacity: Int {
        return Int((self.cgColor.alpha * 100).rounded())
    }
}
```

こうすることで、0.5以上の値は1に丸められ、それ以下の値は0に丸められます。四捨五入を適用することで、より正確なパーセンテージ表現が可能となります。

---

## 👤 User
*2023-05-19 16:42:43*

以下のprimaryをsecondaryに変換してほしい

primary100, primary90, primary80, primary70, primary60, primary50, primary40, primary30, primary20, primary10, primary5

---

## 🤖 Assistant
*2023-05-19 16:42:48*

ご指定の文字列を"primary"から"secondary"に変更しますと、以下のようになります：

secondary100, secondary90, secondary80, secondary70, secondary60, secondary50, secondary40, secondary30, secondary20, secondary10, secondary5

---

## 👤 User
*2023-05-19 16:44:20*

以下のコードの static var name の記述をまとめらないの？

```
protocol ColorAssetsListable {
    static var name: String { get }
    static var allColors: [ColorAsset] { get }
}

extension ColorAssets.Primary: ColorAssetsListable {
    static var name: String { "\(self)" }
    
    static var allColors: [ColorAsset] {
        [primary100, primary90, primary80, primary70, primary60, primary50, primary40, primary30, primary20, primary10, primary5]
    }
}

extension ColorAssets.Secondary: ColorAssetsListable {
    static var name: String { "\(self)" }
    
    static var allColors: [ColorAsset] {
        [secondary100, secondary90, secondary80, secondary70, secondary60, secondary50, secondary40, secondary30, secondary20, secondary10, secondary5]
    }
}

extension ColorAssets.Neutral: ColorAssetsListable {
    static var name: String { "\(self)" }
    
    static var allColors: [ColorAsset] {
        [black, white]
    }
}

extension ColorAssets.Error: ColorAssetsListable {
    static var name: String { "\(self)" }
    
    static var allColors: [ColorAsset] {
        [error100, error80, error60, error40]
    }
}

```

---

## 🤖 Assistant
*2023-05-19 16:45:01*

Swiftではプロトコルにおけるdefault implementationを提供するために、プロトコルエクステンションを利用することができます。そのため、`ColorAssetsListable`プロトコルのエクステンションを作成し、`name`のデフォルト実装を提供することが可能です。

このように修正すると以下のようになります:

```swift
protocol ColorAssetsListable {
    static var name: String { get }
    static var allColors: [ColorAsset] { get }
}

extension ColorAssetsListable {
    static var name: String { "\(self)" }
}

extension ColorAssets.Primary: ColorAssetsListable {
    static var allColors: [ColorAsset] {
        [primary100, primary90, primary80, primary70, primary60, primary50, primary40, primary30, primary20, primary10, primary5]
    }
}

extension ColorAssets.Secondary: ColorAssetsListable {
    static var allColors: [ColorAsset] {
        [secondary100, secondary90, secondary80, secondary70, secondary60, secondary50, secondary40, secondary30, secondary20, secondary10, secondary5]
    }
}

extension ColorAssets.Neutral: ColorAssetsListable {
    static var allColors: [ColorAsset] {
        [black, white]
    }
}

extension ColorAssets.Error: ColorAssetsListable {
    static var allColors: [ColorAsset] {
        [error100, error80, error60, error40]
    }
}
```

上記の修正により、`ColorAssetsListable`を実装する全ての型はデフォルトで`name`プロパティを持つことになります。このプロパティは型の名前を返しますが、各型は必要に応じてこれを上書きすることが可能です。

ただし、この変更が望ましいかどうかは設計上の意図によります。例えば、特定の型が異なる`name`実装を持つことが必要な場合、プロトコルエクステンションによるデフォルト実装は混乱を招く可能性があります。

---
