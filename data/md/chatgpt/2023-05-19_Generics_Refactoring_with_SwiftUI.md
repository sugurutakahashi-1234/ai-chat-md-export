# Generics Refactoring with SwiftUI

日付: 2023-05-19

---

## 👤 ユーザー
*2023/05/20 00:48:26*

以下のコードってジェネリクス使っているけど綺麗にかけない？

```
struct BackgroundColorSectionView<BackgroundColorAssets: BackgroundColorAssetsListable>: View {
    var body: some View {
        Section(header: Text(BackgroundColorAssets.sectionName)) {
            ForEach(Array(BackgroundColorAssets.allCases), id: \.self) { backgroundColor in
                HStack {
                    Text(backgroundColor.name)
                        .font(.footnote)
                    Spacer()
                    Text("#\(backgroundColor.leadingColorAsset.color.hex)")
                        .font(.footnote)
                    Spacer()
                    Text("#\(backgroundColor.trailingColorAsset.color.hex)")
                        .font(.footnote)
                    Spacer()
                    Text("Opacity: \(backgroundColor.opacityPercentage)")
                        .font(.footnote)
                }
                .multilineTextAlignment(.center)
                .listRowBackground(backgroundColor.swiftUIColor)
            }
        }
        .textCase(nil)
    }
}
```

---

## 🤖 アシスタント
*2023/05/20 00:49:32*

上記のSwiftUIのコードは全体的にクリーンですが、HStackの中でテキスト部分を重複しているので、これをリファクタリングすることができます。以下に示すように、新たな `footnoteText` 関数を作成して、それを使用することでコードを短くすることができます。

```swift
struct BackgroundColorSectionView<BackgroundColorAssets: BackgroundColorAssetsListable>: View {
    var body: some View {
        Section(header: Text(BackgroundColorAssets.sectionName)) {
            ForEach(Array(BackgroundColorAssets.allCases), id: \.self) { backgroundColor in
                HStack {
                    footnoteText(backgroundColor.name)
                    Spacer()
                    footnoteText("#\(backgroundColor.leadingColorAsset.color.hex)")
                    Spacer()
                    footnoteText("#\(backgroundColor.trailingColorAsset.color.hex)")
                    Spacer()
                    footnoteText("Opacity: \(backgroundColor.opacityPercentage)")
                }
                .multilineTextAlignment(.center)
                .listRowBackground(backgroundColor.swiftUIColor)
            }
        }
        .textCase(nil)
    }
    
    private func footnoteText(_ content: String) -> some View {
        Text(content)
            .font(.footnote)
    }
}
```
この変更により、`Text`を作成し`font(.footnote)`を適用する部分が1行の関数にまとまりました。そして、`HStack`の中でその関数を使用します。これにより、コードの冗長性が減少し、可読性が向上します。

なお、より良いリファクタリングを行うためには、コード全体のコンテキストやアプリケーションの要件を理解する必要があります。本件について更なる改善が必要な場合、または他の部分について質問がある場合は、お気軽にお知らせください。

---

## 👤 ユーザー
*2023/05/20 00:49:36*

これは struct で宣言しているけど関数化したらどうかくことができるかな？

---

## 🤖 アシスタント
*2023/05/20 00:50:52*

SwiftUI の View は一般的に struct で宣言されますが、View を作成する関数を作成することも可能です。ただし、この場合でも、View 本体は関数内のローカル struct として定義されます。

コードを関数化する場合、以下のようになります：

```swift
func createBackgroundColorSectionView<BackgroundColorAssets: BackgroundColorAssetsListable>() -> some View {
    struct BackgroundColorSectionView: View {
        var body: some View {
            Section(header: Text(BackgroundColorAssets.sectionName)) {
                ForEach(Array(BackgroundColorAssets.allCases), id: \.self) { backgroundColor in
                    HStack {
                        footnoteText(backgroundColor.name)
                        Spacer()
                        footnoteText("#\(backgroundColor.leadingColorAsset.color.hex)")
                        Spacer()
                        footnoteText("#\(backgroundColor.trailingColorAsset.color.hex)")
                        Spacer()
                        footnoteText("Opacity: \(backgroundColor.opacityPercentage)")
                    }
                    .multilineTextAlignment(.center)
                    .listRowBackground(backgroundColor.swiftUIColor)
                }
            }
            .textCase(nil)
        }
        
        private func footnoteText(_ content: String) -> some View {
            Text(content)
                .font(.footnote)
        }
    }
    
    return BackgroundColorSectionView()
}
```
しかし、一般的にはこのような関数化は推奨されません。その理由は以下のとおりです：

1. SwiftUI は declarative なフレームワークであり、View の body は宣言的に記述されるべきです。これは SwiftUI の設計哲学の一部であり、それを無視すると、フレームワークとの相互作用が複雑になる可能性があります。

2. View の body は可能な限り pure（副作用のない）であるべきです。関数内で struct を作成し、それを返すという動作は、その原則に反する可能性があります。

このように、SwiftUI の View を関数化することは技術的には可能ですが、一般的には推奨されません。特定のケースにおいては有効な手段かもしれませんが、大部分のケースでは struct を使用する方が適切でしょう。

---
