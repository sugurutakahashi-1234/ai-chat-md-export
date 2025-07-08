# Swift: Handle AuthError enum

日付: 2023-10-26

---

## 👤 ユーザー
*2023/10/26 09:06:12*

以下の AuthError を switch 文で case でそれぞれのパラメーターをprintするような処理を書いて欲しい

public enum AuthError {

    /// Caused by issue in the way auth category is configured
    case configuration(ErrorDescription, RecoverySuggestion, Error? = nil)

    /// Caused by some error in the underlying service. Check the associated error for more details.
    case service(ErrorDescription, RecoverySuggestion, Error? = nil)

    /// Caused by an unknown reason
    case unknown(ErrorDescription, Error? = nil)

    /// Caused when one of the input field is invalid
    case validation(Field, ErrorDescription, RecoverySuggestion, Error? = nil)

    /// Caused when the current session is not authorized to perform an operation
    case notAuthorized(ErrorDescription, RecoverySuggestion, Error? = nil)

    /// Caused when an operation is not valid with the current state of Auth category
    case invalidState(ErrorDescription, RecoverySuggestion, Error? = nil)

    /// Caused when an operation needs the user to be in signedIn state
    case signedOut(ErrorDescription, RecoverySuggestion, Error? = nil)

    /// Caused when a session is expired and needs the user to be re-authenticated
    case sessionExpired(ErrorDescription, RecoverySuggestion, Error? = nil)
}

---

## 🤖 アシスタント
*2023/10/26 09:06:43*

こちらが、指定された `AuthError` enum を扱う `switch` 文を使用したコードのサンプルです：

```swift
func handleAuthError(error: AuthError) {
    switch error {
    case .configuration(let description, let suggestion, let underlyingError):
        print("Configuration Error: \(description)")
        print("Recovery Suggestion: \(suggestion)")
        if let err = underlyingError { print("Underlying Error: \(err)") }

    case .service(let description, let suggestion, let underlyingError):
        print("Service Error: \(description)")
        print("Recovery Suggestion: \(suggestion)")
        if let err = underlyingError { print("Underlying Error: \(err)") }

    case .unknown(let description, let underlyingError):
        print("Unknown Error: \(description)")
        if let err = underlyingError { print("Underlying Error: \(err)") }

    case .validation(let field, let description, let suggestion, let underlyingError):
        print("Validation Error in Field: \(field)")
        print("Error Description: \(description)")
        print("Recovery Suggestion: \(suggestion)")
        if let err = underlyingError { print("Underlying Error: \(err)") }

    case .notAuthorized(let description, let suggestion, let underlyingError):
        print("Not Authorized Error: \(description)")
        print("Recovery Suggestion: \(suggestion)")
        if let err = underlyingError { print("Underlying Error: \(err)") }

    case .invalidState(let description, let suggestion, let underlyingError):
        print("Invalid State Error: \(description)")
        print("Recovery Suggestion: \(suggestion)")
        if let err = underlyingError { print("Underlying Error: \(err)") }

    case .signedOut(let description, let suggestion, let underlyingError):
        print("Signed Out Error: \(description)")
        print("Recovery Suggestion: \(suggestion)")
        if let err = underlyingError { print("Underlying Error: \(err)") }

    case .sessionExpired(let description, let suggestion, let underlyingError):
        print("Session Expired Error: \(description)")
        print("Recovery Suggestion: \(suggestion)")
        if let err = underlyingError { print("Underlying Error: \(err)") }
    }
}
```

この関数 `handleAuthError` は、与えられた `AuthError` 値に基づいて適切なエラーメッセージを出力します。各ケースで `ErrorDescription`、`RecoverySuggestion` および任意の `Error`（存在する場合）を印刷します。

---

## 👤 ユーザー
*2023/10/26 09:06:53*

ごめん。print文は1行にして欲しい。

---

## 🤖 アシスタント
*2023/10/26 09:07:22*

了解しました。それぞれのエラーケースを1行で出力するように修正します：

```swift
func handleAuthError(error: AuthError) {
    switch error {
    case .configuration(let description, let suggestion, let underlyingError):
        print("Configuration Error: \(description). Suggestion: \(suggestion). \(underlyingError.map { "Underlying Error: \($0)" } ?? "")")

    case .service(let description, let suggestion, let underlyingError):
        print("Service Error: \(description). Suggestion: \(suggestion). \(underlyingError.map { "Underlying Error: \($0)" } ?? "")")

    case .unknown(let description, let underlyingError):
        print("Unknown Error: \(description). \(underlyingError.map { "Underlying Error: \($0)" } ?? "")")

    case .validation(let field, let description, let suggestion, let underlyingError):
        print("Validation Error in Field: \(field). Description: \(description). Suggestion: \(suggestion). \(underlyingError.map { "Underlying Error: \($0)" } ?? "")")

    case .notAuthorized(let description, let suggestion, let underlyingError):
        print("Not Authorized Error: \(description). Suggestion: \(suggestion). \(underlyingError.map { "Underlying Error: \($0)" } ?? "")")

    case .invalidState(let description, let suggestion, let underlyingError):
        print("Invalid State Error: \(description). Suggestion: \(suggestion). \(underlyingError.map { "Underlying Error: \($0)" } ?? "")")

    case .signedOut(let description, let suggestion, let underlyingError):
        print("Signed Out Error: \(description). Suggestion: \(suggestion). \(underlyingError.map { "Underlying Error: \($0)" } ?? "")")

    case .sessionExpired(let description, let suggestion, let underlyingError):
        print("Session Expired Error: \(description). Suggestion: \(suggestion). \(underlyingError.map { "Underlying Error: \($0)" } ?? "")")
    }
}
```

この方法では、`map` を使用して `underlyingError` の存在をチェックし、存在する場合はそのエラーを出力します。存在しない場合は、空の文字列を出力します。

---

## 👤 ユーザー
*2023/10/26 09:08:16*

underlyingError は error に renameして、 handleAuthError(authError: AuthError) { にして、さらにmap と $0 はわかりにくいからもっと簡単に処理して欲しい。

---

## 🤖 アシスタント
*2023/10/26 09:08:41*

了解しました。以下のように修正します：

```swift
func handleAuthError(authError: AuthError) {
    switch authError {
    case .configuration(let description, let suggestion, let error):
        print("Configuration Error: \(description). Suggestion: \(suggestion). \(errorDescription(from: error))")

    case .service(let description, let suggestion, let error):
        print("Service Error: \(description). Suggestion: \(suggestion). \(errorDescription(from: error))")

    case .unknown(let description, let error):
        print("Unknown Error: \(description). \(errorDescription(from: error))")

    case .validation(let field, let description, let suggestion, let error):
        print("Validation Error in Field: \(field). Description: \(description). Suggestion: \(suggestion). \(errorDescription(from: error))")

    case .notAuthorized(let description, let suggestion, let error):
        print("Not Authorized Error: \(description). Suggestion: \(suggestion). \(errorDescription(from: error))")

    case .invalidState(let description, let suggestion, let error):
        print("Invalid State Error: \(description). Suggestion: \(suggestion). \(errorDescription(from: error))")

    case .signedOut(let description, let suggestion, let error):
        print("Signed Out Error: \(description). Suggestion: \(suggestion). \(errorDescription(from: error))")

    case .sessionExpired(let description, let suggestion, let error):
        print("Session Expired Error: \(description). Suggestion: \(suggestion). \(errorDescription(from: error))")
    }
}

func errorDescription(from error: Error?) -> String {
    if let error = error {
        return "Error: \(error)"
    } else {
        return ""
    }
}
```

こちらの修正では、`errorDescription(from:)` というヘルパー関数を使用して、`Error?` 型のエラーから文字列の説明を取得しています。これにより、switch 文の中での処理がよりシンプルになります。

---

## 👤 ユーザー
*2023/10/26 09:08:54*

errorDescription(from error: Error?) も使わずに書けないかな？

---

## 🤖 アシスタント
*2023/10/26 09:09:25*

もちろん、`errorDescription(from:)` 関数を使用しないでコードを書くことも可能です。以下のように修正できます：

```swift
func handleAuthError(authError: AuthError) {
    switch authError {
    case .configuration(let description, let suggestion, let error):
        print("Configuration Error: \(description). Suggestion: \(suggestion)." + (error != nil ? " Error: \(error!)." : ""))

    case .service(let description, let suggestion, let error):
        print("Service Error: \(description). Suggestion: \(suggestion)." + (error != nil ? " Error: \(error!)." : ""))

    case .unknown(let description, let error):
        print("Unknown Error: \(description)." + (error != nil ? " Error: \(error!)." : ""))

    case .validation(let field, let description, let suggestion, let error):
        print("Validation Error in Field: \(field). Description: \(description). Suggestion: \(suggestion)." + (error != nil ? " Error: \(error!)." : ""))

    case .notAuthorized(let description, let suggestion, let error):
        print("Not Authorized Error: \(description). Suggestion: \(suggestion)." + (error != nil ? " Error: \(error!)." : ""))

    case .invalidState(let description, let suggestion, let error):
        print("Invalid State Error: \(description). Suggestion: \(suggestion)." + (error != nil ? " Error: \(error!)." : ""))

    case .signedOut(let description, let suggestion, let error):
        print("Signed Out Error: \(description). Suggestion: \(suggestion)." + (error != nil ? " Error: \(error!)." : ""))

    case .sessionExpired(let description, let suggestion, let error):
        print("Session Expired Error: \(description). Suggestion: \(suggestion)." + (error != nil ? " Error: \(error!)." : ""))
    }
}
```

上記のコードでは、三項演算子（`condition ? truePart : falsePart`）を使用して、エラーが `nil` でない場合にのみエラーメッセージを追加しています。

---

## 👤 ユーザー
*2023/10/26 10:26:13*

AuthError は SDK 側の型でクリーンアーキテクチャを採用しているので、AuthDetailErrorという型を新たに作ってそれにマップするような処理を書いて欲しい。

---

## 🤖 アシスタント
*2023/10/26 10:26:29*

了解しました。`AuthDetailError`という新しい型を作成し、`AuthError`からこの新しい型にマップする関数を提供します。

まず、`AuthDetailError`という型を定義します：

```swift
struct AuthDetailError {
    let type: String
    let description: String
    let suggestion: String?
    let error: String?
}
```

次に、`AuthError`から`AuthDetailError`にマップする関数を作成します：

```swift
func mapToDetailError(authError: AuthError) -&gt; AuthDetailError {
    switch authError {
    case .configuration(let description, let suggestion, let error):
        return AuthDetailError(type: "Configuration", description: description, suggestion: suggestion, error: error?.localizedDescription)

---
