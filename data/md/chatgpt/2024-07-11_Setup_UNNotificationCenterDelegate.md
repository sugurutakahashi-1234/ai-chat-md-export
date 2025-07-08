# Setup UNNotificationCenterDelegate

日付: 2024-07-11

---

## 👤 ユーザー
*2024/07/11 17:50:51*

Testで実行しようとするとUNUserNotificationCenter.current().delegate = selfでbundleProxyForCurrentProcess is nilとエラーになってしまう。

import Combine
import Foundation
import UserNotifications

public final class UserNotificationCenterDriver: NSObject, UNUserNotificationCenterDelegate, UserNotificationCenterDriverProtocol {
    override public init() {
        super.init()
        OSLogger.initLog()
        UNUserNotificationCenter.current().delegate = self
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
        if let url = response.notification.request.content.userInfo["url"] as? String, let deeplinkURL = URL(string: url) {
            UserNotificationCenterDelegateNotificationDriver.userNotificationCenterDidReceive.send(deeplinkURL)
        }
    }

    // 以下は OS の通知設定から任意の画面を表示する動線を加えることができる （Facebook のアプリ参照）
    // public func userNotificationCenter(_ center: UNUserNotificationCenter, openSettingsFor notification: UNNotification?) {}
}

extension UNUserNotificationCenter: @unchecked @retroactive Sendable {}
extension UNNotification: @unchecked @retroactive Sendable {}
extension UNNotificationResponse: @unchecked @retroactive Sendable {}

---

## 🤖 アシスタント
*2024/07/11 17:51:10*

`bundleProxyForCurrentProcess is nil`というエラーは、`UNUserNotificationCenter.current().delegate = self`がアプリケーションコンテキストではない場所で呼び出された場合に発生することがあります。これは通常、アプリのライフサイクルが完全にセットアップされる前に通知の設定を試みている場合に起こります。

この問題を解決するために、`UNUserNotificationCenter.current().delegate = self`をアプリケーションの適切なライフサイクルイベント、例えば`AppDelegate`の`application(_:didFinishLaunchingWithOptions:)`メソッド内で設定することをお勧めします。以下のコード例を参考にしてください。

1. `AppDelegate`での設定:

```swift
import UIKit
import UserNotifications

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?
    var userNotificationCenterDriver: UserNotificationCenterDriver?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // 通知の設定
        userNotificationCenterDriver = UserNotificationCenterDriver()
        return true
    }
}
```

2. `UserNotificationCenterDriver`クラスはそのまま使用しますが、`init`メソッドが呼ばれるタイミングが重要です。上記のように`AppDelegate`で初期化されることで、適切なタイミングで通知のデリゲートが設定されます。

上記の設定により、`UNUserNotificationCenter.current().delegate = self`が適切なタイミングで呼び出され、`bundleProxyForCurrentProcess is nil`エラーを回避できます。テスト実行時にもこの手順を再現するために、`AppDelegate`を使用するか、類似のライフサイクルイベントを利用することが重要です。

---

## 👤 ユーザー
*2024/07/11 17:51:56*

でもこのclass単体のテストがしたいんだ。テスト時にUNUserNotificationCenter.current().delegate = selfが実行されないようにしたり、bundleProxyForCurrentProcess is nilであった場合に実行しないようにできないのか？

---

## 🤖 アシスタント
*2024/07/11 17:52:50*

`UNUserNotificationCenter.current().delegate = self`をテスト時に実行されないようにする方法として、以下のように条件を付けて実行することが考えられます。または、テスト環境でモックを使用する方法もあります。以下にいくつかのアプローチを示します。

### アプローチ1: 条件付き実行
まず、アプリの実行環境かどうかを判定する条件を追加して、テスト環境では`UNUserNotificationCenter.current().delegate = self`を実行しないようにします。

```swift
import Combine
import Foundation
import UserNotifications

public final class UserNotificationCenterDriver: NSObject, UNUserNotificationCenterDelegate, UserNotificationCenterDriverProtocol {
    override public init() {
        super.init()
        OSLogger.initLog()
        if !isRunningTests {
            UNUserNotificationCenter.current().delegate = self
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
        if let url = response.notification.request.content.userInfo["url"] as? String, let deeplinkURL = URL(string: url) {
            UserNotificationCenterDelegateNotificationDriver.userNotificationCenterDidReceive.send(deeplinkURL)
        }
    }

    // 以下は OS の通知設定から任意の画面を表示する動線を加えることができる （Facebook のアプリ参照）
    // public func userNotificationCenter(_ center: UNUserNotificationCenter, openSettingsFor notification: UNNotification?) {}

    private var isRunningTests: Bool {
        return ProcessInfo.processInfo.environment["XCTestConfigurationFilePath"] != nil
    }
}

extension UNUserNotificationCenter: @unchecked @retroactive Sendable {}
extension UNNotification: @unchecked @retroactive Sendable {}
extension UNNotificationResponse: @unchecked @retroactive Sendable {}
```

### アプローチ2: モックを使用する
テスト環境で`UNUserNotificationCenter`をモックに差し替える方法です。これにより、実際の`UNUserNotificationCenter`を使用せずにテストを実行できます。

1. モッククラスの作成:

```swift
import UserNotifications

class MockUserNotificationCenter: UNUserNotificationCenter {
    override class func current() -> UNUserNotificationCenter {
        return MockUserNotificationCenter()
    }
}
```

2. テストケースでモックを注入:

```swift
import XCTest
@testable import YourModuleName

class UserNotificationCenterDriverTests: XCTestCase {
    
    func testExample() {
        let originalUserNotificationCenter = UNUserNotificationCenter.current
        UNUserNotificationCenter.current = MockUserNotificationCenter()
        
        let driver = UserNotificationCenterDriver()
        
        // テストコード
        
        UNUserNotificationCenter.current = originalUserNotificationCenter
    }
}
```

### アプローチ3: 初期化を遅延させる
テスト時には`init`で初期化を行わず、後から設定するように変更することもできます。

```swift
import Combine
import Foundation
import UserNotifications

public final class UserNotificationCenterDriver: NSObject, UNUserNotificationCenterDelegate, UserNotificationCenterDriverProtocol {
    override public init() {
        super.init()
        OSLogger.initLog()
    }
    
    public func configure() {
        UNUserNotificationCenter.current().delegate = self
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
        if let url = response.notification.request.content.userInfo["url"] as? String, let deeplinkURL = URL(string: url) {
            UserNotificationCenterDelegateNotificationDriver.userNotificationCenterDidReceive.send(deeplinkURL)
        }
    }

    // 以下は OS の通知設定から任意の画面を表示する動線を加えることができる （Facebook のアプリ参照）
    // public func userNotificationCenter(_ center: UNUserNotificationCenter, openSettingsFor notification: UNNotification?) {}
}

extension UNUserNotificationCenter: @unchecked @retroactive Sendable {}
extension UNNotification: @unchecked @retroactive Sendable {}
extension UNNotificationResponse: @unchecked @retroactive Sendable {}
```

これにより、テスト時には`configure()`を呼び出さないことで、`UNUserNotificationCenter.current().delegate = self`が実行されないようにできます。アプリケーションの通常のフローでは`configure()`を呼び出してデリゲートを設定します。

以上のアプローチを参考にして、テスト環境での実行時に`bundleProxyForCurrentProcess is nil`エラーを回避することができます。

---
