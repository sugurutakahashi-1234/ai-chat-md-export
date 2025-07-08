# Refactor ToastType for Reusability

Date: 2024-07-04

---

## 👤 User
*2024-07-04 11:45:36*

モディファイアをある程度共通化してほしい

extension ToastType {
    var options: SimpleToastOptions {
        switch self {
        default:
            .default
        }
    }
    
    @ViewBuilder
    var view: some View {
        switch self {
        case .simpleSuccess:
            Label {
                Text("スタンプを送信しました")
            } icon: {
                SFSymbols.checkmarkCircle.image
            }
            .padding()
            .background(Color.green.opacity(0.8))
            .foregroundColor(Color.white)
            .cornerRadius(12)
            .padding(.top)

        case .simpleError:
            Label {
                Text("エラーが発生しました")
            } icon: {
                SFSymbols.exclamationmarkTriangle.image
            }
            .padding()
            .background(Color.red.opacity(0.8))
            .foregroundColor(Color.white)
            .cornerRadius(12)
            .padding(.top)

        case .postedStamp:
            Label {
                Text("スタンプを送信しました")
            } icon: {
                SFSymbols.checkmarkCircle.image
            }
            .padding()
            .background(Color.green.opacity(0.8))
            .foregroundColor(Color.white)
            .cornerRadius(12)
            .padding(.top)
        }
    }
}

extension SimpleToastOptions {
    static var `default`: SimpleToastOptions {
        SimpleToastOptions(alignment: .bottom, hideAfter: 1, dismissOnTap: true)
    }
}

---

## 🤖 Assistant
*2024-07-04 11:45:47*

共通化できる部分を抽出して、コードを整理しました。共通のプロパティやスタイルを再利用することで、コードをより簡潔にすることができます。

```swift
extension ToastType {
    var options: SimpleToastOptions {
        switch self {
        default:
            return .default
        }
    }

    @ViewBuilder
    var view: some View {
        switch self {
        case .simpleSuccess, .postedStamp:
            toastView(text: "スタンプを送信しました", icon: SFSymbols.checkmarkCircle.image, backgroundColor: Color.green.opacity(0.8))
        case .simpleError:
            toastView(text: "エラーが発生しました", icon: SFSymbols.exclamationmarkTriangle.image, backgroundColor: Color.red.opacity(0.8))
        }
    }

    private func toastView(text: String, icon: Image, backgroundColor: Color) -> some View {
        Label {
            Text(text)
        } icon: {
            icon
        }
        .padding()
        .background(backgroundColor)
        .foregroundColor(Color.white)
        .cornerRadius(12)
        .padding(.top)
    }
}

extension SimpleToastOptions {
    static var `default`: SimpleToastOptions {
        SimpleToastOptions(alignment: .bottom, hideAfter: 1, dismissOnTap: true)
    }
}
```

これにより、共通の `toastView` 関数を利用して各ケースのビューを生成し、冗長なコードを減らすことができます。また、`options` プロパティにおいても、デフォルト値を返す処理を簡潔にしています。

---

## 👤 User
*2024-07-04 11:47:19*

toastView は関数ではなくてストラクトで定義してほしい

---

## 🤖 Assistant
*2024-07-04 11:47:32*

`toastView`を関数ではなく、ストラクトとして定義する方法に変更しました。この方法により、SwiftUIの構造体としての再利用が可能になります。

```swift
struct ToastView: View {
    let text: String
    let icon: Image
    let backgroundColor: Color

    var body: some View {
        Label {
            Text(text)
        } icon: {
            icon
        }
        .padding()
        .background(backgroundColor)
        .foregroundColor(Color.white)
        .cornerRadius(12)
        .padding(.top)
    }
}

extension ToastType {
    var options: SimpleToastOptions {
        switch self {
        default:
            return .default
        }
    }

    @ViewBuilder
    var view: some View {
        switch self {
        case .simpleSuccess, .postedStamp:
            ToastView(text: "スタンプを送信しました", icon: SFSymbols.checkmarkCircle.image, backgroundColor: Color.green.opacity(0.8))
        case .simpleError:
            ToastView(text: "エラーが発生しました", icon: SFSymbols.exclamationmarkTriangle.image, backgroundColor: Color.red.opacity(0.8))
        }
    }
}

extension SimpleToastOptions {
    static var `default`: SimpleToastOptions {
        SimpleToastOptions(alignment: .bottom, hideAfter: 1, dismissOnTap: true)
    }
}
```

これにより、`ToastView`は再利用可能なSwiftUIのコンポーネントとして定義され、各ケースでのビュー作成がより簡潔になります。

---
