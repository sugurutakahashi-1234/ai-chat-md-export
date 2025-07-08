# Text Typography Extension.

日付: 2023-05-24

---

## 👤 ユーザー
*2023/05/24 12:36:18*

以下のextension は View ではなく Text に絞って対応させたいのだがリファクタして欲しい

```swift
extension View {
    @ViewBuilder
    public func typographyStyle(_ typography: Typography) -> some View {
        let textStyle = typography.textStyle

        if textStyle.fontType == .systemDefault {
            font(.system(size: textStyle.size, weight: textStyle.weightType.fontWeight))
                .setLineHeight(fontSize: textStyle.size, lineHeight: textStyle.lineHeightType.value(for: textStyle.size))
                .kerning(textStyle.kerningType.value(for: textStyle.size))
        } else {
            if #available(iOS 16.0, *) {
                font(.custom(textStyle.fontType.name, size: textStyle.size))
                    .fontWeight(textStyle.weightType.fontWeight)
                    .setLineHeight(fontSize: textStyle.size, lineHeight: textStyle.lineHeightType.value(for: textStyle.size))
                    .kerning(textStyle.kerningType.value(for: textStyle.size))
            } else {
                // fontWeight(_ weight: Font.Weight?) -> some View が iOS16.0未満では対応されていないための対応
                font(.custom(textStyle.fontType.name, size: textStyle.size))
                    .font(fontWeightForLegacyIOS(weight: textStyle.weightType.fontWeight))
                    .setLineHeight(fontSize: textStyle.size, lineHeight: textStyle.lineHeightType.value(for: textStyle.size))
                    .kerning(textStyle.kerningType.value(for: textStyle.size))
            }
        }
    }

    // Ref: https://zenn.dev/satoryo56/articles/0eb589a918bbb1
    private func setLineHeight(fontSize: CGFloat, lineHeight: CGFloat) -> some View {
        let lineSpacing = lineHeight - fontSize
        return self
            .lineSpacing(lineSpacing)
            .padding(.vertical, lineSpacing / 2)
    }

    // iOS 16.0 未満のみ使用
    private func fontWeightForLegacyIOS(weight: Font.Weight) -> Font {
        switch weight {
        case .ultraLight: return Font.body.weight(.ultraLight)
        case .thin: return Font.body.weight(.thin)
        case .light: return Font.body.weight(.light)
        case .regular: return Font.body.weight(.regular)
        case .medium: return Font.body.weight(.medium)
        case .semibold: return Font.body.weight(.semibold)
        case .bold: return Font.body.weight(.bold)
        case .heavy: return Font.body.weight(.heavy)
        case .black: return Font.body.weight(.black)
        default: return Font.body.weight(.regular)
        }
    }
}

```

---

## 🤖 アシスタント
*2023/05/24 12:37:16*

SwiftUIの `View` の拡張から `Text` の拡張へと変更したいとのことですね。以下のようにリファクタリングできます。必要に応じて該当する部分を変更してください。

```swift
extension Text {
    @ViewBuilder
    public func typographyStyle(_ typography: Typography) -> some View {
        let textStyle = typography.textStyle

        if textStyle.fontType == .systemDefault {
            self = self.font(.system(size: textStyle.size, weight: textStyle.weightType.fontWeight))
                .setLineHeight(fontSize: textStyle.size, lineHeight: textStyle.lineHeightType.value(for: textStyle.size))
                .kerning(textStyle.kerningType.value(for: textStyle.size))
        } else {
            if #available(iOS 16.0, *) {
                self = self.font(.custom(textStyle.fontType.name, size: textStyle.size))
                    .fontWeight(textStyle.weightType.fontWeight)
                    .setLineHeight(fontSize: textStyle.size, lineHeight: textStyle.lineHeightType.value(for: textStyle.size))
                    .kerning(textStyle.kerningType.value(for: textStyle.size))
            } else {
                // fontWeight(_ weight: Font.Weight?) -> some View が iOS16.0未満では対応されていないための対応
                self = self.font(.custom(textStyle.fontType.name, size: textStyle.size))
                    .font(fontWeightForLegacyIOS(weight: textStyle.weightType.fontWeight))
                    .setLineHeight(fontSize: textStyle.size, lineHeight: textStyle.lineHeightType.value(for: textStyle.size))
                    .kerning(textStyle.kerningType.value(for: textStyle.size))
            }
        }
    }

    // Ref: https://zenn.dev/satoryo56/articles/0eb589a918bbb1
    private func setLineHeight(fontSize: CGFloat, lineHeight: CGFloat) -> Text {
        let lineSpacing = lineHeight - fontSize
        return self
            .lineSpacing(lineSpacing)
            .padding(.vertical, lineSpacing / 2)
    }

    // iOS 16.0 未満のみ使用
    private func fontWeightForLegacyIOS(weight: Font.Weight) -> Font {
        switch weight {
        case .ultraLight: return Font.body.weight(.ultraLight)
        case .thin: return Font.body.weight(.thin)
        case .light: return Font.body.weight(.light)
        case .regular: return Font.body.weight(.regular)
        case .medium: return Font.body.weight(.medium)
        case .semibold: return Font.body.weight(.semibold)
        case .bold: return Font.body.weight(.bold)
        case .heavy: return Font.body.weight(.heavy)
        case .black: return Font.body.weight(.black)
        default: return Font.body.weight(.regular)
        }
    }
}
```

このリファクタリングでは、`extension View` が `extension Text` に変更され、`self = self.font(...)`, `self = self.fontWeight(...)`, etc. といった形式で自身にスタイルを適用しています。ただし、`Text` オブジェクトはイミュータブルであるため、`self = self...` の部分は新しい `Text` インスタンスを作成して返す必要があります。この点については、`@ViewBuilder` の動作と組

---

## 👤 ユーザー
*2023/05/24 12:39:18*

つづき

---

## 🤖 アシスタント
*2023/05/24 12:40:24*

申し訳ありません、私の説明は誤っていました。`Text` オブジェクト自体は変更できません。ここでは、`Text` のextensionに対する変更という観点から、代わりに `modifier` パターンを使用してリファクタリングします。下記に該当のコードを示します。

```swift
extension Text {
    @ViewBuilder
    public func typographyStyle(_ typography: Typography) -> some View {
        let textStyle = typography.textStyle

        if textStyle.fontType == .systemDefault {
            self.font(.system(size: textStyle.size, weight: textStyle.weightType.fontWeight))
                .setLineHeight(fontSize: textStyle.size, lineHeight: textStyle.lineHeightType.value(for: textStyle.size))
                .kerning(textStyle.kerningType.value(for: textStyle.size))
        } else {
            if #available(iOS 16.0, *) {
                self.font(.custom(textStyle.fontType.name, size: textStyle.size))
                    .fontWeight(textStyle.weightType.fontWeight)
                    .setLineHeight(fontSize: textStyle.size, lineHeight: textStyle.lineHeightType.value(for: textStyle.size))
                    .kerning(textStyle.kerningType.value(for: textStyle.size))
            } else {
                // fontWeight(_ weight: Font.Weight?) -> some View が iOS16.0未満では対応されていないための対応
                self.font(.custom(textStyle.fontType.name, size: textStyle.size))
                    .font(fontWeightForLegacyIOS(weight: textStyle.weightType.fontWeight))
                    .setLineHeight(fontSize: textStyle.size, lineHeight: textStyle.lineHeightType.value(for: textStyle.size))
                    .kerning(textStyle.kerningType.value(for: textStyle.size))
            }
        }
    }

    // Ref: https://zenn.dev/satoryo56/articles/0eb589a918bbb1
    private func setLineHeight(fontSize: CGFloat, lineHeight: CGFloat) -> some View {
        let lineSpacing = lineHeight - fontSize
        return self.lineSpacing(lineSpacing)
            .padding(.vertical, lineSpacing / 2)
    }

    // iOS 16.0 未満のみ使用
    private func fontWeightForLegacyIOS(weight: Font.Weight) -> Font {
        switch weight {
        case .ultraLight: return Font.body.weight(.ultraLight)
        case .thin: return Font.body.weight(.thin)
        case .light: return Font.body.weight(.light)
        case .regular: return Font.body.weight(.regular)
        case .medium: return Font.body.weight(.medium)
        case .semibold: return Font.body.weight(.semibold)
        case .bold: return Font.body.weight(.bold)
        case .heavy: return Font.body.weight(.heavy)
        case .black: return Font.body.weight(.black)
        default: return Font.body.weight(.regular)
        }
    }
}
```

なお、modifierの仕組みは新しい `View` を作成して返すことで、元の `View`（この場合は `Text`）を変更することなく新しいスタイルを適用します。ですので、`Text` はイミュータブルであるため、直接変更することはできませんが、このような方法で新しい `View` を作成し、それに新しい

---

## 👤 ユーザー
*2023/05/24 12:40:31*

つづき

---

## 🤖 アシスタント
*2023/05/24 12:41:19*

新しいスタイルを適用することが可能です。

すみませんが、SwiftUIの`Text`では`padding()`を使うことが出来ません。これは`Text`が具体的なサイズを持たないためです。そのため、以下のように修正します：

```swift
extension Text {
    @ViewBuilder
    public func typographyStyle(_ typography: Typography) -> some View {
        let textStyle = typography.textStyle

        if textStyle.fontType == .systemDefault {
            self.font(.system(size: textStyle.size, weight: textStyle.weightType.fontWeight))
                .kerning(textStyle.kerningType.value(for: textStyle.size))
        } else {
            if #available(iOS 16.0, *) {
                self.font(.custom(textStyle.fontType.name, size: textStyle.size))
                    .fontWeight(textStyle.weightType.fontWeight)
                    .kerning(textStyle.kerningType.value(for: textStyle.size))
            } else {
                // fontWeight(_ weight: Font.Weight?) -> some View が iOS16.0未満では対応されていないための対応
                self.font(.custom(textStyle.fontType.name, size: textStyle.size))
                    .font(fontWeightForLegacyIOS(weight: textStyle.weightType.fontWeight))
                    .kerning(textStyle.kerningType.value(for: textStyle.size))
            }
        }
    }

    // iOS 16.0 未満のみ使用
    private func fontWeightForLegacyIOS(weight: Font.Weight) -> Font {
        switch weight {
        case .ultraLight: return Font.body.weight(.ultraLight)
        case .thin: return Font.body.weight(.thin)
        case .light: return Font.body.weight(.light)
        case .regular: return Font.body.weight(.regular)
        case .medium: return Font.body.weight(.medium)
        case .semibold: return Font.body.weight(.semibold)
        case .bold: return Font.body.weight(.bold)
        case .heavy: return Font.body.weight(.heavy)
        case .black: return Font.body.weight(.black)
        default: return Font.body.weight(.regular)
        }
    }
}
```

これにより`Text`にのみスタイルが適用され、その他の`View`は影響を受けません。また、lineSpacingについては、`Text`に直接適用できるメソッドが存在しないため、ここでは省略しています。具体的なlineSpacingを適用したい場合は、代わりの方法を探す必要があります。

---
