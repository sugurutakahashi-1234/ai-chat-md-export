# Overlay One-Liner Conversion

日付: 2024-07-05

---

## 👤 ユーザー
*2024/7/5 14:02:05*

overlay のコードをワンライナーで描けるようにしたい

        .overlay {
            EmptyView()
                .simpleToast(item: $presenter.toastType, options: presenter.toastType?.options ?? SimpleToastOptions(), content: {
                    presenter.toastType?.view
                })
        }

public enum ToastType: CaseIterable {
    case simpleSuccess
    case simpleError
    case postedStamp
}


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
            ToastView(text: "処理に成功しました", icon: SFSymbols.checkmarkCircle.image, backgroundColor: Color.green.opacity(0.8))

        case .simpleError:
            ToastView(text: "エラーが発生しました", icon: SFSymbols.exclamationmarkTriangle.image, backgroundColor: Color.red.opacity(0.8))

        case .postedStamp:
            ToastView(text: "スタンプを送信しました", icon: SFSymbols.checkmarkCircle.image, backgroundColor: Color.green.opacity(0.8))
        }
    }
}

extension SimpleToastOptions {
    static var `default`: SimpleToastOptions {
        SimpleToastOptions(alignment: .top, hideAfter: 1, dismissOnTap: true)
    }
}

---

## 🤖 アシスタント
*2024/7/5 14:02:10*

You can achieve a one-liner overlay by directly using the `if let` syntax to unwrap `presenter.toastType` and providing default values for the options and view content. Here's how you can do it:

```swift
.overlay {
    if let toastType = presenter.toastType {
        EmptyView()
            .simpleToast(item: $presenter.toastType, options: toastType.options, content: { toastType.view })
    } else {
        EmptyView()
    }
}
```

This code checks if `presenter.toastType` is non-nil and then uses it to configure the `simpleToast` modifier. If `presenter.toastType` is nil, it simply displays an `EmptyView`. This ensures the overlay is concise and remains readable.

---

## 👤 ユーザー
*2024/7/5 14:03:57*

そうじゃなくて、.overlayToast(toastType: $presenter.toastType) のような記述にしたい。

---

## 🤖 アシスタント
*2024/7/5 14:04:17*

なるほど、それでしたら、カスタム修飾子を作成することで、`.overlayToast(toastType: $presenter.toastType)` のような記述を実現できます。以下にその実装例を示します：

### カスタム修飾子の実装

まず、`View`の拡張としてカスタム修飾子`overlayToast`を定義します。

```swift
import SwiftUI

extension View {
    func overlayToast(toastType: Binding<ToastType?>) -> some View {
        self.overlay {
            if let toastType = toastType.wrappedValue {
                EmptyView()
                    .simpleToast(item: toastType, options: toastType.options, content: { toastType.view })
            } else {
                EmptyView()
            }
        }
    }
}
```

### 使用方法

次に、カスタム修飾子を使用して、指定の`ToastType`に基づいたオーバーレイを表示します。

```swift
struct ContentView: View {
    @StateObject private var presenter = Presenter()

    var body: some View {
        VStack {
            // 他のビューコンテンツ
        }
        .overlayToast(toastType: $presenter.toastType)
    }
}

class Presenter: ObservableObject {
    @Published var toastType: ToastType?
}
```

### ToastType の定義

```swift
public enum ToastType: CaseIterable {
    case simpleSuccess
    case simpleError
    case postedStamp
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
        case .simpleSuccess:
            ToastView(text: "処理に成功しました", icon: SFSymbols.checkmarkCircle.image, backgroundColor: Color.green.opacity(0.8))
        case .simpleError:
            ToastView(text: "エラーが発生しました", icon: SFSymbols.exclamationmarkTriangle.image, backgroundColor: Color.red.opacity(0.8))
        case .postedStamp:
            ToastView(text: "スタンプを送信しました", icon: SFSymbols.checkmarkCircle.image, backgroundColor: Color.green.opacity(0.8))
        }
    }
}

extension SimpleToastOptions {
    static var `default`: SimpleToastOptions {
        SimpleToastOptions(alignment: .top, hideAfter: 1, dismissOnTap: true)
    }
}
```

これで、`.overlayToast(toastType: $presenter.toastType)` のように簡潔に記述できるようになります。

---

## 👤 ユーザー
*2024/7/5 14:04:52*

Cannot convert value of type 'ToastType' to expected argument type 'Binding&lt;Item?&gt;?'

---

## 🤖 アシスタント
*2024/7/5 14:05:11*

修正するために、`simpleToast`が`Binding<Item?>`を期待していることを考慮してカスタム修飾子を調整します。具体的には、`simpleToast`にバインディングを渡す必要があります。

### カスタム修飾子の実装

```swift
import SwiftUI

extension View {
    func overlayToast(toastType: Binding<ToastType?>) -> some View {
        self.overlay {
            EmptyView()
                .simpleToast(item: toastType, options: toastType.wrappedValue?.options ?? .default, content: {
                    toastType.wrappedValue?.view
                })
        }
    }
}
```

### 使用方法

次に、カスタム修飾子を使用して、指定の`ToastType`に基づいたオーバーレイを表示します。

```swift
struct ContentView: View {
    @StateObject private var presenter = Presenter()

    var body: some View {
        VStack {
            // 他のビューコンテンツ
        }
        .overlayToast(toastType: $presenter.toastType)
    }
}

class Presenter: ObservableObject {
    @Published var toastType: ToastType?
}
```

### ToastType の定義

```swift
public enum ToastType: CaseIterable {
    case simpleSuccess
    case simpleError
    case postedStamp
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
        case .simpleSuccess:
            ToastView(text: "処理に成功しました", icon: SFSymbols.checkmarkCircle.image, backgroundColor: Color.green.opacity(0.8))
        case .simpleError:
            ToastView(text: "エラーが発生しました", icon: SFSymbols.exclamationmarkTriangle.image, backgroundColor: Color.red.opacity(0.8))
        case .postedStamp:
            ToastView(text: "スタンプを送信しました", icon: SFSymbols.checkmarkCircle.image, backgroundColor: Color.green.opacity(0.8))
        }
    }
}

extension SimpleToastOptions {
    static var `default`: SimpleToastOptions {
        SimpleToastOptions(alignment: .top, hideAfter: 1, dismissOnTap: true)
    }
}
```

これで、`.overlayToast(toastType: $presenter.toastType)` のように簡潔に記述できるようになります。この修正により、`simpleToast`の期待する型に適合し、エラーが解決されます。

---
