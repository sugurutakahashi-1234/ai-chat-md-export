# 確認方法: APNsトークン (Swift)

日付: 2023-09-28

---

## 👤 ユーザー
*2023/09/28 11:49:38*

Swiftで登録したapnsTokenの確認方法

---

## 🤖 アシスタント
*2023/09/28 11:50:25*

SwiftでAPNs（Apple Push Notification service）のTokenを登録して確認するには、`didRegisterForRemoteNotificationsWithDeviceToken` メソッドを使用してデバイスのAPNsトークンを取得します。このトークンは、リモート通知をデバイスに送信するために使用されます。

以下は、SwiftでAPNsトークンを取得し、文字列として出力する基本的なコード例です。

### 1. AppDelegate.swiftの中で

```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    // Push通知の許可を求める
    registerForPushNotifications()
    return true
}

func registerForPushNotifications() {
    UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) {
        granted, error in
        print("Permission granted: \(granted)")
        
        guard granted else { return }
        self.getNotificationSettings()
    }
}

func getNotificationSettings() {
    UNUserNotificationCenter.current().getNotificationSettings { settings in
        print("Notification settings: \(settings)")
        guard settings.authorizationStatus == .authorized else { return }
        DispatchQueue.main.async {
            UIApplication.shared.registerForRemoteNotifications()
        }
    }
}

func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
    let tokenParts = deviceToken.map { data in String(format: "%02.2hhx", data) }
    let token = tokenParts.joined()
    print("Device Token: \(token)")
}

func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
    print("Failed to register for remote notifications with error: \(error)")
}
```

このコードは、ユーザーにプッシュ通知の許可を求め、ユーザーが許可した場合は、デバイスのAPNsトークンを取得しコンソールに印刷します。

このトークンは通常、サーバーサイドで管理され、それを使用して特定のデバイスにプッシュ通知を送ります。

---
