# Generic struct requires Hashable.

Date: 2023-05-19

---

## 👤 User
*2023-05-19 23:31:24*

以下のコードで Generic struct 'ForEach' requires that 'ColorAsset' conform to 'Hashable' というエラーになってしまうのだけどどうして

```swift

protocol ColorAssetsListable: Hashable {
    static var sectionName: String { get }
    static var allColors: [ColorAsset] { get }
}

struct ColorSectionView<ColorAssets: ColorAssetsListable>: View {
    var body: some View {
        Section(header: Text(ColorAssets.sectionName)) {
            ForEach(ColorAssets.allColors, id: \.self) { color in
                Label {
                    VStack(alignment: .leading) {
                        Text(color.name)
                            .fontWeight(.bold)
                            .padding(.bottom, 4)
                        HStack {
                            Spacer()
                            Text("Hex: #\(color.color.hex)")
                            Spacer()
                            Text("Opacity: \(color.color.opacityPercentage)")
                            Spacer()
                        }
                    }
                } icon: {
                    Circle()
                        .fill(color.swiftUIColor)
                }
            }
        }
        .textCase(nil)
    }
}

```

---

## 🤖 Assistant
*2023-05-19 23:31:53*

Swift の `ForEach` 構造体を使用する際には、列挙する項目が `Hashable` プロトコルを満たしている必要があります。そのため、`ColorAsset` が `Hashable` を満たしていない場合、このエラーが発生します。

提供したコードを見ると、`ColorAssetsListable` プロトコルが `Hashable` を満たしているように見えますが、これは `ColorAssets` の要件を示しているだけであり、`ColorAsset` 型自体が `Hashable` を満たしていることを保証しません。

解決するためには、`ColorAsset` 型自体が `Hashable` プロトコルを満たすように実装する必要があります。`ColorAsset` の定義を見せていただくことはできますか？それによって、`ColorAsset` 型が `Hashable` を満たすようにどのように改修すべきか具体的な提案をすることができます。

---

## 👤 User
*2023-05-19 23:33:24*

```swift
public final class ColorAsset {
  public fileprivate(set) var name: String

  #if os(macOS)
  public typealias Color = NSColor
  #elseif os(iOS) || os(tvOS) || os(watchOS)
  public typealias Color = UIColor
  #endif

  @available(iOS 11.0, tvOS 11.0, watchOS 4.0, macOS 10.13, *)
  public private(set) lazy var color: Color = {
    guard let color = Color(asset: self) else {
      fatalError("Unable to load color asset named \(name).")
    }
    return color
  }()

  #if os(iOS) || os(tvOS)
  @available(iOS 11.0, tvOS 11.0, *)
  public func color(compatibleWith traitCollection: UITraitCollection) -> Color {
    let bundle = MyBundleToken.bundle
    guard let color = Color(named: name, in: bundle, compatibleWith: traitCollection) else {
      fatalError("Unable to load color asset named \(name).")
    }
    return color
  }
  #endif

  #if canImport(SwiftUI)
  @available(iOS 13.0, tvOS 13.0, watchOS 6.0, macOS 10.15, *)
  public private(set) lazy var swiftUIColor: SwiftUI.Color = {
    SwiftUI.Color(asset: self)
  }()
  #endif

  fileprivate init(name: String) {
    self.name = name
  }
}
```

---

## 🤖 Assistant
*2023-05-19 23:34:06*

提供していただいた `ColorAsset` は現状では `Hashable` プロトコルに準拠していません。これを解決するためには、`ColorAsset` が `Hashable` プロトコルに準拠するように修正する必要があります。

Swiftでは、`Hashable` プロトコルに準拠するためには、`hash(into:)` メソッドを提供する必要があります。ただし、Swiftの自動合成機能を利用して、`Hashable` プロトコルを準拠するための実装を自動的に生成することも可能です。

以下に `ColorAsset` の定義を `Hashable` プロトコルに準拠するように修正した例を示します：

```swift
public final class ColorAsset: Hashable {
  // ... 他のコード ...

  // Hashable プロトコルに準拠するためのメソッドを追加します
  public static func == (lhs: ColorAsset, rhs: ColorAsset) -> Bool {
    return lhs.name == rhs.name
  }

  public func hash(into hasher: inout Hasher) {
    hasher.combine(name)
  }
}
```

この例では、`ColorAsset` のインスタンスが等しいと見なされる条件を `name` プロパティが等しい場合としています。そして、その `name` プロパティを使用してハッシュ値を生成しています。これは、異なる `ColorAsset` のインスタンスでも `name` が同じであれば、それらを等しいと見なすという設計に基づいています。もし異なる基準が必要であれば、この部分を適宜修正してください。

---
