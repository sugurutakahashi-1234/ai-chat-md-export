# Singleton Implementation Process

Date: 2024-07-16

---

## 👤 User
*2024-07-16 18:58:33*

シングルトンにしてほしい

public final class UserNotificationCenterDriver: NSObject, UNUserNotificationCenterDelegate, UserNotificationCenterDriverProtocol {
    override public init() {
        super.init()
        OSLogger.initLog()
        if ProcessInfo.processInfo.environment["XCTestConfigurationFilePath"] == nil {
            UNUserNotificationCenter.current().delegate = self
        } else {
            // アプリが起動していない状態で UNUserNotificationCenter.current().delegate = self を行うと bundleProxyForCurrentProcess is nil といったようなエラーになるための対応
            // UI テストで通知のテストが必要になると別の対策が必要かもしれない
            OSLogger.debugLog("Skip: UNUserNotificationCenter.current().delegate = self. Because running test.")
        }
    }

    deinit {
        OSLogger.deinitLog()
    }

    /// アプリがフォアグラウンドにいるときに通知が表示される直前に呼び出され、通知のプレゼンテーションオプションを指定する
    @MainActor
    public func userNotificationCenter(_: UNUserNotificationCenter, willPresent _: UNNotification) async -&gt; UNNotificationPresentationOptions {
        UserNotificationCenterDelegateNotificationDriver.userNotificationCenterWillPresent.send(())
        return [.banner, .sound, .badge]
    }

    /// ユーザーが通知に対してアクションを取ったときに呼び出される
    @MainActor
    public func userNotificationCenter(_: UNUserNotificationCenter, didReceive response: UNNotificationResponse) async {
        OSLogger.debugLog("Receive Notification Response: \(response.notification.request.content.userInfo)")
        guard let urlString = response.notification.request.content.userInfo["url"] as? String else {
            OSLogger.debugLog("Failed to get URL from userInfo. \(response.notification.request.content.userInfo)")
            return
        }

        guard let encodedUrlString = urlString.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) else {
            OSLogger.debugLog("Failed to encode URL string: \(urlString).")
            return
        }

        guard let url = URL(string: encodedUrlString) else {
            OSLogger.debugLog("Failed to create URL from \(encodedUrlString).")
            return
        }
        UserNotificationCenterDelegateNotificationDriver.userNotificationCenterDidReceive.send(url)
    }

    // 以下は OS の通知設定から任意の画面を表示する動線を加えることができる （Facebook のアプリ参照）
    // public func userNotificationCenter(_ center: UNUserNotificationCenter, openSettingsFor notification: UNNotification?) {}
}

---

## 🤖 Assistant
*2024-07-16 18:58:57*

UserNotificationCenterDriverクラスをシングルトンにするために、次のように実装を変更します。

```swift
public final class UserNotificationCenterDriver: NSObject, UNUserNotificationCenterDelegate, UserNotificationCenterDriverProtocol {
    
    // シングルトンインスタンスを保持する静的プロパティ
    public static let shared = UserNotificationCenterDriver()
    
    // initをプライベートにして直接インスタンス化を防止
    private override init() {
        super.init()
        OSLogger.initLog()
        if ProcessInfo.processInfo.environment["XCTestConfigurationFilePath"] == nil {
            UNUserNotificationCenter.current().delegate = self
        } else {
            // アプリが起動していない状態で UNUserNotificationCenter.current().delegate = self を行うと
            // bundleProxyForCurrentProcess is nil といったようなエラーになるための対応
            // UI テストで通知のテストが必要になると別の対策が必要かもしれない
            OSLogger.debugLog("Skip: UNUserNotificationCenter.current().delegate = self. Because running test.")
        }
    }

    deinit {
        OSLogger.deinitLog()
    }

    /// アプリがフォアグラウンドにいるときに通知が表示される直前に呼び出され、通知のプレゼンテーションオプションを指定する
    @MainActor
    public func userNotificationCenter(_: UNUserNotificationCenter, willPresent _: UNNotification) async -> UNNotificationPresentationOptions {
        UserNotificationCenterDelegateNotificationDriver.userNotificationCenterWillPresent.send(())
        return [.banner, .sound, .badge]
    }

    /// ユーザーが通知に対してアクションを取ったときに呼び出される
    @MainActor
    public func userNotificationCenter(_: UNUserNotificationCenter, didReceive response: UNNotificationResponse) async {
        OSLogger.debugLog("Receive Notification Response: \(response.notification.request.content.userInfo)")
        guard let urlString = response.notification.request.content.userInfo["url"] as? String else {
            OSLogger.debugLog("Failed to get URL from userInfo. \(response.notification.request.content.userInfo)")
            return
        }

        guard let encodedUrlString = urlString.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) else {
            OSLogger.debugLog("Failed to encode URL string: \(urlString).")
            return
        }

        guard let url = URL(string: encodedUrlString) else {
            OSLogger.debugLog("Failed to create URL from \(encodedUrlString).")
            return
        }
        UserNotificationCenterDelegateNotificationDriver.userNotificationCenterDidReceive.send(url)
    }

    // 以下は OS の通知設定から任意の画面を表示する動線を加えることができる （Facebook のアプリ参照）
    // public func userNotificationCenter(_ center: UNUserNotificationCenter, openSettingsFor notification: UNNotification?) {}
}
```

この変更により、`UserNotificationCenterDriver` クラスはシングルトンとして動作し、`UserNotificationCenterDriver.shared` を使用してアクセスできます。 `init` メソッドを `private` にすることで、他の場所からの新しいインスタンスの作成を防ぎます。

---
