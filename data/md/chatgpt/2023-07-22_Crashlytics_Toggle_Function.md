# Crashlytics Toggle Function

日付: 2023-07-22

---

## 👤 ユーザー
*2023/07/22 09:16:40*

Crashlytics.crashlytics() を有効無効を切り替える関数を実行する方法ってあるの？

public enum CrashLogger {
    // Ref: https://firebase.google.com/docs/crashlytics/customize-crash-reports?hl=ja&platform=ios#add-logs
    public static func setUserId(id: String) {
        Crashlytics.crashlytics().setUserID(id)
    }

    public static func sendError(domain: String, code: Int, userInfo: [String: Any]? = nil) {
        sendError(error: .init(domain: domain, code: code, userInfo: userInfo))
    }

    // Ref: https://firebase.google.com/docs/crashlytics/customize-crash-reports?hl=ja&platform=ios#add-logs
    public static func sendError(error: NSError) {
        Crashlytics.crashlytics().record(error: error)
    }

    // Ref: https://firebase.google.com/docs/crashlytics/customize-crash-reports?hl=ja&platform=ios#add-logs
    public static func sendLog(event: CrashLogEvent) {
        Crashlytics.crashlytics().log(event.message)
        AppLogger.debugLog(event.message)
    }
}

---

## 🤖 アシスタント
*2023/07/22 09:16:59*

Firebase Crashlytics は動的にオン・オフを切り替える公式のメソッドを提供していません。そのため、この機能をアプリ内で実装したい場合は、カスタムロジックを自分で追加する必要があります。

基本的なアプローチは、状態のフラグを用いてログ送信メソッドをラップすることです。以下にその例を示します：

```swift
public enum CrashLogger {
    // Add a flag to enable/disable Crashlytics.
    public static var isEnabled = true

    public static func setUserId(id: String) {
        if isEnabled {
            Crashlytics.crashlytics().setUserID(id)
        }
    }

    public static func sendError(domain: String, code: Int, userInfo: [String: Any]? = nil) {
        if isEnabled {
            sendError(error: .init(domain: domain, code: code, userInfo: userInfo))
        }
    }

    public static func sendError(error: NSError) {
        if isEnabled {
            Crashlytics.crashlytics().record(error: error)
        }
    }

    public static func sendLog(event: CrashLogEvent) {
        if isEnabled {
            Crashlytics.crashlytics().log(event.message)
            AppLogger.debugLog(event.message)
        }
    }
}
```

このようにすると、`CrashLogger.isEnabled` を `true` または `false` に設定することで、クラッシュレポートの送信を有効または無効にすることができます。

ただし、すでに起きたクラッシュについては無効化することはできません。このフラグは、新たに発生するクラッシュやエラーのレポートにのみ影響します。また、`isEnabled` の値を変更した後、その値がアプリの再起動後も維持されるように、適切な永続化処理を行うことも重要です。

---
