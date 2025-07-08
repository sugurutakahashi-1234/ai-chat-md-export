# appErrorAlert implementation

日付: 2023-07-04

---

## 👤 ユーザー
*2023/07/04 21:40:34*

以下のようなものをつくっていて、appErrorAlert の cancelButtonOnly にonDismiss: (() -&gt; Void)? = nil を渡せるようにして View側でうまく実装したい

import SwiftUI

public struct SimpleCloseAppErrorAlertModifier: ViewModifier {
    @Binding var shouldShowAlert: Bool
    let appError: AppError
    let cancelButtonText: String

    public func body(content: Content) -&gt; some View {
        content
            .alert(isPresented: $shouldShowAlert, error: appError) { _ in
                Button(cancelButtonText, role: .cancel) {}
            } message: { error in
                error.alertMessage
            }
    }
}

public extension View {
    @ViewBuilder
    func appErrorAlert(isPresented: Binding&lt;Bool&gt;, appError: AppError?) -&gt; some View {
        if let appError {
            switch appError.alertBody.button {
            case .cancelButtonOnly(cancelButtonText: let cancelButtonText):
                modifier(SimpleCloseAppErrorAlertModifier(shouldShowAlert: isPresented, appError: appError, cancelButtonText: cancelButtonText))
            }
        } else {
            self
        }
    }
}

public enum AppError: LocalizedError {
    // Common
    case customMessageError(message: String) // 困ったときに使うエラー
    case generalError
    case unexpectedError
    case noInternetConnection

    // ManagerError
    case apiRequestError(ApiRequestManagerError)
    case authError(AuthManagerError)
    case gazeTrackError(GazeTrackManagerError)

    // Calibration
    case calibrationError
    case requireCalibrationError

    // Analysis
    case analysisInvalidDataError
    
    case unknown
}

public struct AppErrorAlertBody {
    public enum AppErrorAlertButtonType {
        case cancelButtonOnly(cancelButtonText: String)
    }

    public let title: String
    public let message: String
    public let button: AppErrorAlertButtonType

    public init(title: String, message: String, button: AppErrorAlertButtonType = .cancelButtonOnly(cancelButtonText: "閉じる")) {
        self.title = title
        self.message = message
        self.button = button
    }
}

// TODO: ローカライズ
// アラート定義
public extension AppError {
    var alertBody: AppErrorAlertBody {
        switch self {
        case .customMessageError:
            return AppErrorAlertBody(title: "エラー", message: "エラーが発生しました")

        case .generalError:
            return AppErrorAlertBody(title: "エラー", message: "エラーが発生しました")

        case .unexpectedError:
            return AppErrorAlertBody(title: "エラー", message: "予期せぬエラーが発生しました")

        case .noInternetConnection:
            return AppErrorAlertBody(title: "通信エラー", message: "インターネットに接続してください")

        case .apiRequestError:
            return AppErrorAlertBody(title: "通信エラー", message: "通信エラーが発生しました")

        case .authError(let authManagerError):
            switch authManagerError {
            case .fetchAuthSessionError:
                return AppErrorAlertBody(title: "認証エラー", message: "通信エラーが発生しました")

            case .signInError:
                return AppErrorAlertBody(title: "ログインエラー", message: "メールアドレスもしくはパスワードが間違っています")

            case .appIdTokenNotFound:
                return AppErrorAlertBody(title: "認証エラー", message: "通信エラーが発生しました")
            }

        case .gazeTrackError:
            return AppErrorAlertBody(title: "エラー", message: "予期せぬエラーが発生しました")
        case .calibrationError:
            return AppErrorAlertBody(title: "エラー", message: "キャリブレーションに失敗しました")

        case .requireCalibrationError:
            return AppErrorAlertBody(title: "エラー", message: "お願いをやるためのキャリブレーション設定情報が、確認できません。お願いを受ける前に「キャリブレーション再設定」実行してください。") // 03001
        case .unknown:
            return .init(title: "エラー", message: "意図しないエラーが発生しました")
        case .analysisInvalidDataError:
            return .init(title: "データ計測に失敗しました", message: "お願い実施中は、画面から目を離さないようご注意ください")
        }
    }

    // 実質的に alert のタイトルになる（LocalizedError の errorDescription の override である）
    var errorDescription: String? {
        alertBody.title
    }

    var alertMessage: some View {
        Text(alertBody.message)
    }

    var debugDescription: String {
        "\(self), \(alertBody.title), \(alertBody.message)"
    }
}

---

## 🤖 アシスタント
*2023/07/04 21:41:40*

`cancelButtonOnly`の定義に`onDismiss`クロージャを追加し、それを`alert`のボタンのアクションで使います。それによって、アラートが閉じられるときに特定のアクションを実行することができます。

まず、`AppErrorAlertButtonType` enumを以下のように変更します：

```swift
public enum AppErrorAlertButtonType {
    case cancelButtonOnly(cancelButtonText: String, onDismiss: (() -> Void)? = nil)
}
```

次に、`SimpleCloseAppErrorAlertModifier`の`body(content: Content)`メソッドを次のように変更します：

```swift
public func body(content: Content) -> some View {
    content
        .alert(isPresented: $shouldShowAlert, error: appError) { _ in
            Button(cancelButtonText, role: .cancel) {
                appError.alertBody.button.onDismiss?()
            }
        } message: { error in
            error.alertMessage
        }
}
```

そして、`appErrorAlert`メソッドを以下のように更新します：

```swift
public extension View {
    @ViewBuilder
    func appErrorAlert(isPresented: Binding<Bool>, appError: AppError?) -> some View {
        if let appError = appError {
            switch appError.alertBody.button {
            case .cancelButtonOnly(let cancelButtonText, _):
                modifier(SimpleCloseAppErrorAlertModifier(shouldShowAlert: isPresented, appError: appError, cancelButtonText: cancelButtonText))
            }
        } else {
            self
        }
    }
}
```

しかし、ここには一つの問題点があります。`AppErrorAlertBody`と`AppErrorAlertButtonType`は値型であり、`onDismiss`クロージャは通常参照型であるため、一部の場合にはこの設計が適切でないかもしれません。それが問題である場合、別の設計を検討する必要があります。

注意: このコードは理論的には動作しますが、実際のコードとの統合や特定の使用ケースによっては修正が必要かもしれません。実際にはSwiftUIの`alert`は非同期的に表示され、`onDismiss`のタイミングを厳密に制御するのは困難です。必要に応じてアラートの表示と非表示のタイミングを制御する別の方法を検討してみてください。

---

## 👤 ユーザー
*2023/07/04 21:42:53*

できれば以下のようにしたい。
public extension View {
    @ViewBuilder
    func appErrorAlert(isPresented: Binding&lt;Bool&gt;, appError: AppError?, onDismiss: (() -&gt; Void)? = nil) -&gt; some View {

---

## 🤖 アシスタント
*2023/07/04 21:43:32*

了解しました。引数`onDismiss`を追加することで、View側で直接クロージャを提供することができます。これは`SimpleCloseAppErrorAlertModifier`の定義を少し変更することで実現できます。

まず、`SimpleCloseAppErrorAlertModifier`に`onDismiss`パラメータを追加します：

```swift
public struct SimpleCloseAppErrorAlertModifier: ViewModifier {
    @Binding var shouldShowAlert: Bool
    let appError: AppError
    let cancelButtonText: String
    let onDismiss: (() -> Void)?

    public func body(content: Content) -> some View {
        content
            .alert(isPresented: $shouldShowAlert) {
                Alert(
                    title: Text(appError.alertBody.title),
                    message: Text(appError.alertBody.message),
                    dismissButton: .cancel(Text(cancelButtonText), action: {
                        shouldShowAlert = false
                        onDismiss?()
                    })
                )
            }
    }
}
```

そして、`appErrorAlert`メソッドを以下のように更新します：

```swift
public extension View {
    @ViewBuilder
    func appErrorAlert(isPresented: Binding<Bool>, appError: AppError?, onDismiss: (() -> Void)? = nil) -> some View {
        if let appError = appError {
            switch appError.alertBody.button {
            case .cancelButtonOnly(let cancelButtonText):
                modifier(SimpleCloseAppErrorAlertModifier(shouldShowAlert: isPresented, appError: appError, cancelButtonText: cancelButtonText, onDismiss: onDismiss))
            }
        } else {
            self
        }
    }
}
```

これで、`onDismiss`クロージャを使って`appErrorAlert`を呼び出す際に、特定のアクションを実行することができます。

---
