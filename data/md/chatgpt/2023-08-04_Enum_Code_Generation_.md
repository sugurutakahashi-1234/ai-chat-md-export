# Enum Code Generation.

日付: 2023-08-04

---

## 👤 ユーザー
*2023/8/4 13:54:00*

Swiftで以下のようなenumの定義からcodeを返したいんだけど、enumのcase名から一意な数値って生成できないのかな？

var code: Int {
        switch self {
        case .customMessageError: return 0
        case .generalError: return 1
        case .unexpectedError: return 2
        case .noInternetConnection: return 3
        case .loginSessionExpired: return 4
        case .getUserAttributesError: return 5
        case .saveUserAttributesError: return 6
        case .maintenanceError: return 7
        case .appUpdate: return 8
        case .apiRequestError: return 9
        case .authError: return 10
        case .recordingError: return 11
        case .gazeTrackError: return 12
        case .anchorAndEmotionAnalysisError: return 13
        case .calibrationError: return 14
        case .requireCalibrationError: return 15
        case .skipCalibration: return 16
        case .cameraPermissionError: return 17
        case .soundPermissionRequired: return 18
        case .videoInterruptedError: return 19
        case .submitAnswersError: return 20
        case .websiteInterruptedError: return 21
        case .websiteAccessControlError: return 22
        case .websiteSessionTimeout: return 23
        case .fetchVideoFromStorageFailed: return 24
        case .unknown: return 9999
        case .nilAppError: return -1
        }
    }

---

## 🤖 アシスタント
*2023/8/4 13:54:21*

Swiftのenumは、各ケースに整数値を関連付けることができます。`RawRepresentable`プロトコルを使用して整数値とenumケースを関連付けることができます。この方法では、各ケースに対して一意な数値を手動で割り当てる必要がなくなります。

以下のコードは、あなたの要件に合った例です：

```swift
enum AppError: Int {
    case customMessageError = 0
    case generalError = 1
    case unexpectedError = 2
    case noInternetConnection = 3
    // その他のケースも同様に定義
    case unknown = 9999
    case nilAppError = -1

    var code: Int {
        return self.rawValue
    }
}
```

この方法では、ケースと整数値を関連付ける必要があるため、一意の整数値を自動的に生成することはできません。一意の値が必要な場合、手動でそれぞれのケースに整数値を割り当てる必要があります。最初の例のように`switch`ステートメントを使用して各ケースに対応する値を返すこともできますが、enumの定義が変更されると、関連するコードも更新する必要があります。一意の整数値を割り当てたい場合、値を手動で指定する必要があるため、自動化は難しいでしょう。

---

## 👤 ユーザー
*2023/8/4 13:55:36*

rawValueがStringをつかっているんだ。一意を保証しなくても、caseが異なれば異なるような数値を生成してほしい

---

## 🤖 アシスタント
*2023/8/4 13:55:57*

`rawValue`が`String`型で、各ケースの名前を基にして一意の（または少なくとも異なる）整数値を生成したい場合、ハッシュ関数を使用することができます。

以下はその一例です：

```swift
enum AppError: String {
    case customMessageError
    case generalError
    // 他のケースも同様に定義
    
    var code: Int {
        return self.rawValue.hashValue
    }
}
```

この例では、Swiftの`String`型の`hashValue`プロパティを使用して、各ケースの`rawValue`から整数値を生成します。ハッシュ値は、入力値が異なれば通常は異なる値を生成しますが、一意性は保証されていないため、異なる入力に対して同じハッシュ値が生成される可能性があります（これをハッシュ衝突と呼びます）。

もし、ハッシュ値が一意である必要がなく、単に異なるケースごとに異なる整数値が必要であれば、この方法は機能するでしょう。しかし、一意性が重要な場合は、各ケースに対して手動で整数値を割り当てるか、他の方法を検討する必要があるかもしれません。

---

## 👤 ユーザー
*2023/8/4 14:36:06*

以下のコードで`LoggerContainer.log(.showAlert(.init(appError: appError)))`みたいなViewに関係ないコードを埋め込みたいんだけれどもどうしたらいい？


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
*2023/8/4 14:36:34*

`LoggerContainer.log(.showAlert(.init(appError: appError)))`のようなコードを埋め込みたい場合、ログメッセージが具体的に何を意味するか、また、どのタイミングでログを記録したいのかに応じて、適切な場所に挿入することができます。

例えば、アラートが表示される直前にログを記録したいのであれば、`switch`ステートメントの内部、`modifier`が適用される前にそのコードを挿入することができます。

以下は、その一例です：

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
        if let appError = appError {
            // ログの記録
            LoggerContainer.log(.showAlert(.init(appError: appError)))
            
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

このコードでは、アラートが表示される際に`LoggerContainer.log`メソッドが呼び出され、アプリケーションのエラーがログに記録されます。`LoggerContainer`とその`log`メソッドの実装に応じて、具体的なログの詳細をカスタマイズすることもできるでしょう。

---

## 👤 ユーザー
*2023/8/4 14:36:50*

Type '()' cannot conform to 'View' というようなエラーが起きてしまう

---

## 🤖 アシスタント
*2023/8/4 14:37:18*

すみません、私の提案したコードでは`@ViewBuilder`と一緒に非`View`のコードを使用しているため、コンパイルエラーが発生します。以下は、エラーを修正した更新されたコードです。

```swift
public extension View {
    func appErrorAlert(
        isPresented: Binding<Bool>,
        appError: AppError?,
        onDismiss: (() -> Void)? = nil,
        onCancel: (() -> Void)? = nil,
        onOk: (() -> Void)? = nil
    ) -> some View {
        return ZStack {
            self
            if isPresented.wrappedValue, let appError = appError {
                // Log the event here
                LoggerContainer.log(.showAlert(.init(appError: appError)))

                switch appError.alertBody.button {
                case .cancelButtonOnly(cancelButtonText: let cancelButtonText):
                    CancelOnlyAppErrorAlertModifier(
                        shouldShowAlert: isPresented,
                        appError: appError,
                        cancelButtonText: cancelButtonText,
                        onDismiss: onDismiss
                    )
                case .cancelAndOkButton(cancelButtonText: let cancelButtonText, okButtonText: let okButtonText):
                    CancelOrOkAppErrorAlertModifier(
                        shouldShowAlert: isPresented,
                        appError: appError,
                        cancelButtonText: cancelButtonText,
                        okButtonText: okButtonText,
                        onCancel: onCancel,
                        onOk: onOk
                    )
                }
            }
        }
    }
}
```

このコードでは、`ZStack`を使用して元の`View`とアラートのモディファイアを一緒に配置します。`isPresented.wrappedValue`が`true`で、`appError`が非`nil`の場合のみ、ログが記録され、アラートのモディファイアが表示されます。

この方法でエラーが解消されるはずです。必要に応じて`CancelOnlyAppErrorAlertModifier`と`CancelOrOkAppErrorAlertModifier`の実装を適切に調整してください。

---
