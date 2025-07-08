# ButtonSize for CustomButtonStyle.

日付: 2023-07-21

---

## 👤 ユーザー
*2023/07/21 12:15:04*

以下に public enum ButtonSize {} でcase medium と case smallの概念を導入して、CustomButtonStyleがButtonTypeの後に、size: ButtonSize = .medium をとるようにして欲しい


import SwiftUI

public enum ButtonState {
    case `default`
    case pressed
    case disabled
}

extension ButtonState: CaseIterable {}

public enum ButtonType {
    case primary
    case secondary
    case tertiary
    case text
}

extension ButtonType: CaseIterable {}

private extension ButtonType {
    var isRounded: Bool {
        switch self {
        case .primary, .secondary:
            return true
        case .tertiary, .text:
            return false
        }
    }

    var typography: Typography {
        switch self {
        case .primary, .secondary, .tertiary:
            return .button1
        case .text:
            return .button3
        }
    }

    func foregroundColor(for state: ButtonState) -&gt; Color {
        switch (self, state) {
        case (.primary, _):
            return CoreAssets.Color.Neutral.white.swiftUIColor
        case (_, .default):
            return CoreAssets.Color.Primary.primary100.swiftUIColor
        case (_, .pressed):
            return CoreAssets.Color.Primary.primary70.swiftUIColor
        case (_, .disabled):
            return CoreAssets.Color.Neutral.neutral50.swiftUIColor
        }
    }

    func backgroundColor(for state: ButtonState) -&gt; Color {
        switch (self, state) {
        case (.primary, .default):
            return CoreAssets.Color.PrimaryBackgroundNoGradation.primaryBackgroundNoGradation100.swiftUIColor
        case (.primary, .pressed):
            return CoreAssets.Color.PrimaryBackgroundNoGradation.primaryBackgroundNoGradation70.swiftUIColor
        case (.primary, .disabled):
            return CoreAssets.Color.Neutral.neutral50.swiftUIColor
        default:
            return .clear
        }
    }

    func borderColor(for state: ButtonState) -&gt; Color {
        switch (self, state) {
        case (.secondary, .default):
            return CoreAssets.Color.PrimaryBackgroundNoGradation.primaryBackgroundNoGradation100.swiftUIColor
        case (.secondary, .pressed):
            return CoreAssets.Color.PrimaryBackgroundNoGradation.primaryBackgroundNoGradation70.swiftUIColor
        case (.secondary, .disabled):
            return CoreAssets.Color.Neutral.neutral50.swiftUIColor
        default:
            return .clear
        }
    }
}

public struct CustomButtonStyle: ButtonStyle {
    // Button が .disabled かどうかを取得する
    // Ref: https://stackoverflow.com/questions/59169436/swiftui-buttonstyle-how-to-check-if-button-is-disabled-or-enabled
    @Environment(\.isEnabled) private var isEnabled: Bool
    private var buttonType: ButtonType
    private static let border: CGFloat = 2
    private static let cornerRadius: CGFloat = 30
    private static let roundButtonHeight: CGFloat = 48

    public init(_ type: ButtonType) {
        buttonType = type
    }

    public func makeBody(configuration: Configuration) -&gt; some View {
        let state: ButtonState = !isEnabled ? .disabled : (configuration.isPressed ? .pressed : .default)

        if buttonType.isRounded {
            configuration.label
                .typographyStyle(buttonType.typography)
                .foregroundColor(buttonType.foregroundColor(for: state))
                .frame(height: Self.roundButtonHeight)
                .frame(maxWidth: .infinity)
                .cornerRadius(Self.cornerRadius)
                .overlay(
                    RoundedRectangle(cornerRadius: Self.cornerRadius)
                        .stroke(buttonType.borderColor(for: state), lineWidth: Self.border)
                )
                .background(
                    RoundedRectangle(cornerRadius: Self.cornerRadius)
                        .fill(buttonType.backgroundColor(for: state))
                )
                .contentShape(Rectangle()) // background が .clear の場合にタップ領域を補う
                .elevation(.elevation1)
        } else {
            configuration.label
                .typographyStyle(buttonType.typography)
                .foregroundColor(buttonType.foregroundColor(for: state))
                .background(buttonType.backgroundColor(for: state))
                .contentShape(Rectangle()) // background が .clear の場合にタップ領域を補う
        }
    }
}

---

## 🤖 アシスタント
*2023/07/21 12:15:45*

以下のようにButtonSize列挙型を導入し、CustomButtonStyleにサイズパラメータを追加しました。各サイズの高さと角の半径は定数として定義し、必要に応じて変更することができます。

```swift
import SwiftUI

public enum ButtonState {
    case `default`
    case pressed
    case disabled
}

extension ButtonState: CaseIterable {}

public enum ButtonType {
    case primary
    case secondary
    case tertiary
    case text
}

extension ButtonType: CaseIterable {}

// 新たにButtonSize列挙型を導入します
public enum ButtonSize {
    case small
    case medium
}

private extension ButtonType {
    // 以下のコードはそのままにします
    // ...
}

public struct CustomButtonStyle: ButtonStyle {
    @Environment(\.isEnabled) private var isEnabled: Bool
    private var buttonType: ButtonType
    private var buttonSize: ButtonSize  // 新たにbuttonSizeを導入します

    // 高さと角の半径をそれぞれのサイズで定義します
    private var buttonHeight: CGFloat {
        switch buttonSize {
        case .small:
            return 40
        case .medium:
            return 48
        }
    }

    private var buttonCornerRadius: CGFloat {
        switch buttonSize {
        case .small:
            return 20
        case .medium:
            return 30
        }
    }

    private static let border: CGFloat = 2

    public init(_ type: ButtonType, size: ButtonSize = .medium) {
        buttonType = type
        buttonSize = size
    }

    // makeBodyで高さと角の半径をそれぞれのサイズに応じて調整します
    public func makeBody(configuration: Configuration) -> some View {
        let state: ButtonState = !isEnabled ? .disabled : (configuration.isPressed ? .pressed : .default)

        if buttonType.isRounded {
            configuration.label
                .typographyStyle(buttonType.typography)
                .foregroundColor(buttonType.foregroundColor(for: state))
                .frame(height: buttonHeight) // ここを変更します
                .frame(maxWidth: .infinity)
                .cornerRadius(buttonCornerRadius) // ここを変更します
                .overlay(
                    RoundedRectangle(cornerRadius: buttonCornerRadius) // ここを変更します
                        .stroke(buttonType.borderColor(for: state), lineWidth: Self.border)
                )
                .background(
                    RoundedRectangle(cornerRadius: buttonCornerRadius) // ここを変更します
                        .fill(buttonType.backgroundColor(for: state))
                )
                .contentShape(Rectangle()) 
                .elevation(.elevation1)
        } else {
            configuration.label
                .typographyStyle(buttonType.typography)
                .foregroundColor(buttonType.foregroundColor(for: state))
                .background(buttonType.backgroundColor(for: state))
                .contentShape(Rectangle()) 
        }
    }
}
```
このコードでは、ButtonSizeに.mediumがデフォルトとして設定されています。初期化時に.sizeパラメータを省略した場合、ボタンサイズは.mediumとなります。サイズを指定するには、CustomButtonStyleの初期化時に.sizeパラメータを指定してください。

---

## 👤 ユーザー
*2023/07/21 12:16:49*

ButtonSize の定義をかいてほしい、そこにvar buttonHeight や var buttonCornerRadius を定義してほしい

---

## 🤖 アシスタント
*2023/07/21 12:17:28*

申し訳ありません、理解しました。そのようにButtonSizeを変更してそれぞれのサイズに対応する高さと角の半径をButtonSize内に設定することも可能です。以下のように修正します：

```swift
import SwiftUI

public enum ButtonState {
    case `default`
    case pressed
    case disabled
}

extension ButtonState: CaseIterable {}

public enum ButtonType {
    case primary
    case secondary
    case tertiary
    case text
}

extension ButtonType: CaseIterable {}

public enum ButtonSize {
    case small
    case medium

    var buttonHeight: CGFloat {
        switch self {
        case .small:
            return 40
        case .medium:
            return 48
        }
    }

    var buttonCornerRadius: CGFloat {
        switch self {
        case .small:
            return 20
        case .medium:
            return 30
        }
    }
}

private extension ButtonType {
    // 以下のコードはそのままにします
    // ...
}

public struct CustomButtonStyle: ButtonStyle {
    @Environment(\.isEnabled) private var isEnabled: Bool
    private var buttonType: ButtonType
    private var buttonSize: ButtonSize  // 新たにbuttonSizeを導入します

    private static let border: CGFloat = 2

    public init(_ type: ButtonType, size: ButtonSize = .medium) {
        buttonType = type
        buttonSize = size
    }

    // makeBodyで高さと角の半径をそれぞれのサイズに応じて調整します
    public func makeBody(configuration: Configuration) -> some View {
        let state: ButtonState = !isEnabled ? .disabled : (configuration.isPressed ? .pressed : .default)

        if buttonType.isRounded {
            configuration.label
                .typographyStyle(buttonType.typography)
                .foregroundColor(buttonType.foregroundColor(for: state))
                .frame(height: buttonSize.buttonHeight) // ここを変更します
                .frame(maxWidth: .infinity)
                .cornerRadius(buttonSize.buttonCornerRadius) // ここを変更します
                .overlay(
                    RoundedRectangle(cornerRadius: buttonSize.buttonCornerRadius) // ここを変更します
                        .stroke(buttonType.borderColor(for: state), lineWidth: Self.border)
                )
                .background(
                    RoundedRectangle(cornerRadius: buttonSize.buttonCornerRadius) // ここを変更します
                        .fill(buttonType.backgroundColor(for: state))
                )
                .contentShape(Rectangle()) 
                .elevation(.elevation1)
        } else {
            configuration.label
                .typographyStyle(buttonType.typography)
                .foregroundColor(buttonType.foregroundColor(for: state))
                .background(buttonType.backgroundColor(for: state))
                .contentShape(Rectangle()) 
        }
    }
}
```
この修正により、ButtonSize内にbuttonHeightとbuttonCornerRadiusを定義しました。そしてCustomButtonStyleのmakeBody関数内でこれらの値を使用しています。

---
