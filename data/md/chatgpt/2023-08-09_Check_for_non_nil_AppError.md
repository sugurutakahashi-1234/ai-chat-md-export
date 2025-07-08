# Check for non-nil AppError

日付: 2023-08-09

---

## 👤 ユーザー
*2023/8/9 16:53:14*

以下の場合にAppErrorがnilAppErrorでないことを判定する方法

public enum AppError: Error, LocalizedError {
    // 共通
    case customError(String) // 困ったときに使うエラー
    case defaultError
    case unexpectedError
    case noInternetConnection
    case nilAppError // AppError を Optional とすると困る場合に使う。実質的には nil である AppError

    // ログイン
    case loginSessionExpired

    // 基本情報登録
    case getUserAttributesError
    case saveUserAttributesError

    // Base
    case maintenanceError(title: String, message: String)
    case appUpdate

    // Manager Error
    case apiRequestError(ApiRequestManagerError)
    case authError(AuthManagerError)
    case recordingError(RecordingManagerError)
    case gazeTrackError(GazeTrackManagerError)

    // Interactor Error
    case anchorAndEmotionAnalysisError(AnchorAndEmotionAnalysisInteractorError)

    // Calibration
    case calibrationError
    case requireCalibrationError
    case skipCalibration

    // Camera Permission
    case cameraPermissionError

    // Sound Permission
    case soundPermissionRequired

    // Research
    case fetchVideoFromStorageFailed

    // Video Measurement
    case videoInterruptedError

    // Questionnaire Measurement
    case submitAnswersError

    // Web Measurement
    case websiteInterruptedError
    case websiteAccessControlError(URL)
    case websiteSessionTimeout
}

---

## 🤖 アシスタント
*2023/8/9 16:53:47*

`AppError` という列挙型において、 `nilAppError` というケースが定義されています。ある `AppError` のインスタンスが `nilAppError` でないかどうかを確認するには、Swift の `switch` 文や `if` 文を使用することができます。

以下に、`nilAppError` でないかを判定する方法を示します。

### 方法1: switch文を使用する
```swift
func isErrorNotNilAppError(_ error: AppError) -> Bool {
    switch error {
    case .nilAppError:
        return false
    default:
        return true
    }
}
```

### 方法2: if文を使用する
```swift
func isErrorNotNilAppError(_ error: AppError) -> Bool {
    if case .nilAppError = error {
        return false
    }
    return true
}
```

上記の関数を使用することで、`AppError` のインスタンスが `nilAppError` であるかどうかを判定することができます。例えば:
```swift
let error: AppError = .defaultError

if isErrorNotNilAppError(error) {
    print("This is not a nilAppError!")
} else {
    print("This is a nilAppError!")
}
```

これで、`AppError` が `nilAppError` であるかどうかを簡単に判定できます。

---

## 👤 ユーザー
*2023/8/9 16:55:08*

この処理にif let appError かつ nilAppError でないときにViewを返して欲しい


public extension View {
    @ViewBuilder
    func appErrorAlert(
        isPresented: Binding&lt;Bool&gt;,
        appError: AppError?,
        onDismiss: (() -&gt; Void)? = nil,
        onCancel: (() -&gt; Void)? = nil,
        onOk: (() -&gt; Void)? = nil
    ) -&gt; some View {
        if let appError {
            // SwiftUI 3 からできるようになった View 内でのログの出力方法
            let _ = LoggerContainer.log(.showAlert(.init(
                appError: appError,
                errorName: appError.name,
                alertTitle: appError.alertBody.title,
                alertMessage: appError.alertBody.message
            )))

            switch appError.alertBody.button {
            case .cancelButtonOnly(cancelButtonText: let cancelButtonText):
                modifier(CancelOnlyAppErrorAlertModifier(
                    shouldShowAlert: isPresented,
                    appError: appError,
                    cancelButtonText: cancelButtonText,
                    onDismiss: onDismiss
                ))
            case .cancelAndOkButton(cancelButtonText: let cancelButtonText, okButtonText: let okButtonText):
                modifier(CancelOrOkAppErrorAlertModifier(
                    shouldShowAlert: isPresented,
                    appError: appError,
                    cancelButtonText: cancelButtonText,
                    okButtonText: okButtonText,
                    onCancel: onCancel,
                    onOk: onOk
                ))
            }
        } else {
            self
        }
    }
}

---

## 🤖 アシスタント
*2023/8/9 16:55:53*

指定されたコードの中で、`AppError?` を受け取り、それが `nil` または `nilAppError` でない場合に特定の `View` を返すようにするには、if文の中にさらに条件を追加する必要があります。

以下に、その条件を追加したコードの修正版を示します。

```swift
public extension View {
    @ViewBuilder
    func appErrorAlert(
        isPresented: Binding<Bool>,
        appError: AppError?,
        onDismiss: (() -> Void)? = nil,
        onCancel: (() -> Void)? = nil,
        onOk: (() -> Void)? = nil
    ) -> some View {
        if let appError = appError, appError != .nilAppError {
            // SwiftUI 3 からできるようになった View 内でのログの出力方法
            let _ = LoggerContainer.log(.showAlert(.init(
                appError: appError,
                errorName: appError.name,
                alertTitle: appError.alertBody.title,
                alertMessage: appError.alertBody.message
            )))

            switch appError.alertBody.button {
            case .cancelButtonOnly(cancelButtonText: let cancelButtonText):
                modifier(CancelOnlyAppErrorAlertModifier(
                    shouldShowAlert: isPresented,
                    appError: appError,
                    cancelButtonText: cancelButtonText,
                    onDismiss: onDismiss
                ))
            case .cancelAndOkButton(cancelButtonText: let cancelButtonText, okButtonText: let okButtonText):
                modifier(CancelOrOkAppErrorAlertModifier(
                    shouldShowAlert: isPresented,
                    appError: appError,
                    cancelButtonText: cancelButtonText,
                    okButtonText: okButtonText,
                    onCancel: onCancel,
                    onOk: onOk
                ))
            }
        } else {
            self
        }
    }
}
```

この修正により、`appError` が `nil` または `nilAppError` の場合、関数は元の `View` (`self`) をそのまま返します。それ以外の場合、`View` の修飾子 (`modifier`) を適用して、適切なアラートを表示します。

---

## 👤 ユーザー
*2023/8/9 16:56:15*

Referencing operator function '!=' on 'BinaryInteger' requires that 'AppError' conform to 'BinaryInteger'となった

---

## 🤖 アシスタント
*2023/8/9 16:57:12*

申し訳ございません。私が提供したコードの `appError != .nilAppError` の部分でエラーが発生していますね。

Swiftのenumはデフォルトで `Equatable` を満たしていないため、直接的な比較 (`==` や `!=`) はサポートされません。しかし、特定のenum caseをチェックする場合、pattern matchingを使用することができます。

以下のように修正します。

```swift
if let appError = appError, case .nilAppError = appError {
    // Do nothing for .nilAppError case
} else if let appError = appError {
    // Your original code for other cases
}
```

修正後のコードは以下のようになります。

```swift
public extension View {
    @ViewBuilder
    func appErrorAlert(
        isPresented: Binding<Bool>,
        appError: AppError?,
        onDismiss: (() -> Void)? = nil,
        onCancel: (() -> Void)? = nil,
        onOk: (() -> Void)? = nil
    ) -> some View {
        if let appError = appError, case .nilAppError = appError {
            // Do nothing for .nilAppError case
            self
        } else if let appError = appError {
            // SwiftUI 3 からできるようになった View 内でのログの出力方法
            let _ = LoggerContainer.log(.showAlert(.init(
                appError: appError,
                errorName: appError.name,
                alertTitle: appError.alertBody.title,
                alertMessage: appError.alertBody.message
            )))

            switch appError.alertBody.button {
            case .cancelButtonOnly(cancelButtonText: let cancelButtonText):
                modifier(CancelOnlyAppErrorAlertModifier(
                    shouldShowAlert: isPresented,
                    appError: appError,
                    cancelButtonText: cancelButtonText,
                    onDismiss: onDismiss
                ))
            case .cancelAndOkButton(cancelButtonText: let cancelButtonText, okButtonText: let okButtonText):
                modifier(CancelOrOkAppErrorAlertModifier(
                    shouldShowAlert: isPresented,
                    appError: appError,
                    cancelButtonText: cancelButtonText,
                    okButtonText: okButtonText,
                    onCancel: onCancel,
                    onOk: onOk
                ))
            }
        } else {
            self
        }
    }
}
```

これで、`.nilAppError` というケースを正しく処理することができるはずです。

---

## 👤 ユーザー
*2023/8/9 16:58:19*

あんまりスマートではないね。。。もっとスマートに書けないの？

---

## 🤖 アシスタント
*2023/8/9 16:59:09*

もちろん、よりコンパクトに書くことが可能です。以下は、スマートな方法で`nilAppError`をチェックし、それに応じた`View`を返す方法です。

```swift
public extension View {
    @ViewBuilder
    func appErrorAlert(
        isPresented: Binding<Bool>,
        appError: AppError?,
        onDismiss: (() -> Void)? = nil,
        onCancel: (() -> Void)? = nil,
        onOk: (() -> Void)? = nil
    ) -> some View {
        guard let appError = appError, appError != .nilAppError else {
            self
            return
        }

        // SwiftUI 3 からできるようになった View 内でのログの出力方法
        let _ = LoggerContainer.log(.showAlert(.init(
            appError: appError,
            errorName: appError.name,
            alertTitle: appError.alertBody.title,
            alertMessage: appError.alertBody.message
        )))

        switch appError.alertBody.button {
        case .cancelButtonOnly(cancelButtonText: let cancelButtonText):
            modifier(CancelOnlyAppErrorAlertModifier(
                shouldShowAlert: isPresented,
                appError: appError,
                cancelButtonText: cancelButtonText,
                onDismiss: onDismiss
            ))
        case .cancelAndOkButton(cancelButtonText: let cancelButtonText, okButtonText: let okButtonText):
            modifier(CancelOrOkAppErrorAlertModifier(
                shouldShowAlert: isPresented,
                appError: appError,
                cancelButtonText: cancelButtonText,
                okButtonText: okButtonText,
                onCancel: onCancel,
                onOk: onOk
            ))
        }
    }
}
```

この方法では、まず`guard`文を使用して`appError`が`nil`または`.nilAppError`でないことを確認しています。この条件が満たされない場合は、早期リターンを使ってすぐに元の`View` (`self`) を返しています。

この書き方は、条件チェックとアクションを分離することで、コードの可読性と簡潔性を向上させています。

---

## 👤 ユーザー
*2023/8/9 16:59:21*

Referencing operator function '!=' on 'BinaryInteger' requires that 'AppError' conform to 'BinaryInteger'となる

---

## 🤖 アシスタント
*2023/8/9 17:00:15*

申し訳ございません、私の前回の回答が不正確でした。

`AppError` は `Equatable` に準拠していないため、`!=` オペレータは利用できません。Swift の enum の特定の case と比較するための正しい方法を使用しなければなりません。

以下のように `if case` を使用して、`nilAppError` でないことを確認します。

```swift
public extension View {
    @ViewBuilder
    func appErrorAlert(
        isPresented: Binding<Bool>,
        appError: AppError?,
        onDismiss: (() -> Void)? = nil,
        onCancel: (() -> Void)? = nil,
        onOk: (() -> Void)? = nil
    ) -> some View {
        if case .nilAppError? = appError {
            self
            return
        }

        if let appError = appError {
            // SwiftUI 3 からできるようになった View 内でのログの出力方法
            let _ = LoggerContainer.log(.showAlert(.init(
                appError: appError,
                errorName: appError.name,
                alertTitle: appError.alertBody.title,
                alertMessage: appError.alertBody.message
            )))

            switch appError.alertBody.button {
            case .cancelButtonOnly(cancelButtonText: let cancelButtonText):
                modifier(CancelOnlyAppErrorAlertModifier(
                    shouldShowAlert: isPresented,
                    appError: appError,
                    cancelButtonText: cancelButtonText,
                    onDismiss: onDismiss
                ))
            case .cancelAndOkButton(cancelButtonText: let cancelButtonText, okButtonText: let okButtonText):
                modifier(CancelOrOkAppErrorAlertModifier(
                    shouldShowAlert: isPresented,
                    appError: appError,
                    cancelButtonText: cancelButtonText,
                    okButtonText: okButtonText,
                    onCancel: onCancel,
                    onOk: onOk
                ))
            }
        } else {
            self
        }
    }
}
```

上記のコードで、まず `nilAppError` の場合を取り扱って、それ以外のケースでの処理を進めるようにしています。これにより、`AppError` の値が `nilAppError` かどうかを確認できるようになります。

---
