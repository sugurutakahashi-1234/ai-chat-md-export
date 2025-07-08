# Swift Notification Permission Async

日付: 2024-10-29

---

## 👤 ユーザー
*2024/10/29 19:21:59*

Sending 'completion' risks causing data races; this is an error in the Swift 6 language mode

class NotificationPermission {
    private static var center: UNUserNotificationCenter { .current() }

    static func requestAuthorization(_ completion: ((Bool, Error?) -&gt; Void)? = nil) {
        let options: UNAuthorizationOptions = [.alert, .badge, .sound]
        center.requestAuthorization(options: options) { granted, error in
            DispatchQueue.main.async {
                completion?(granted, error)
            }
        }
    }

    static func fetchAuthorizationStatus(_ completion: ((UNAuthorizationStatus) -&gt; Void)? = nil) {
        center.getNotificationSettings { settings in
            DispatchQueue.main.async {
                completion?(settings.authorizationStatus)
            }
        }
    }
}

---

## 🤖 アシスタント
*2024/10/29 19:22:05*

To eliminate the potential for data races in Swift 6, you can replace the use of completion handlers with Swift's Concurrency features, such as `async/await`. This will make the functions more safe and modern, aligning with Swift's concurrency model. Here’s how you can refactor the `NotificationPermission` class:

```swift
import UserNotifications

class NotificationPermission {
    private static var center: UNUserNotificationCenter { .current() }

    static func requestAuthorization() async throws -> Bool {
        let options: UNAuthorizationOptions = [.alert, .badge, .sound]
        return try await withCheckedThrowingContinuation { continuation in
            center.requestAuthorization(options: options) { granted, error in
                if let error = error {
                    continuation.resume(throwing: error)
                } else {
                    continuation.resume(returning: granted)
                }
            }
        }
    }

    static func fetchAuthorizationStatus() async -> UNAuthorizationStatus {
        await withCheckedContinuation { continuation in
            center.getNotificationSettings { settings in
                continuation.resume(returning: settings.authorizationStatus)
            }
        }
    }
}
```

### Key Changes
1. **Using `async/await`:** The methods are now `async`, meaning you can call them using the `await` keyword.
2. **Replacing completion handlers:** `withCheckedThrowingContinuation` and `withCheckedContinuation` are used to bridge callback-based code to Swift’s Concurrency model safely.
3. **Error handling:** The `requestAuthorization()` function now throws an error, making it more explicit when something goes wrong.

This refactoring aligns with Swift 6's enhanced concurrency safety and avoids data races.

---

## 👤 ユーザー
*2024/10/29 19:22:29*

sending とかで対応できないの？

---

## 🤖 アシスタント
*2024/10/29 19:22:33*

Swift 6 では `completion` をそのまま使うとデータ競合のリスクが生じる可能性がありますが、`completion` を直接非同期メソッドで置き換えるのではなく、`sending` を使って値を非同期に渡すことができます。以下のように書き換えると、Swift Concurrency に対応しつつ、データ競合を避けられます。

### `NotificationPermission` の更新
```swift
import UserNotifications

class NotificationPermission {
    private static var center: UNUserNotificationCenter { .current() }

    static func requestAuthorization() async throws -> Bool {
        let options: UNAuthorizationOptions = [.alert, .badge, .sound]
        return try await withCheckedThrowingContinuation { continuation in
            center.requestAuthorization(options: options) { granted, error in
                if let error = error {
                    continuation.resume(throwing: error)
                } else {
                    continuation.resume(returning: granted)
                }
            }
        }
    }

    static func fetchAuthorizationStatus() async -> UNAuthorizationStatus {
        await withCheckedContinuation { continuation in
            center.getNotificationSettings { settings in
                continuation.resume(returning: settings.authorizationStatus)
            }
        }
    }
}
```

`completion` の代わりに `sending` を使うのではなく、`async/await` の非同期処理を活用する形で書き換えることがベストプラクティスです。

---
