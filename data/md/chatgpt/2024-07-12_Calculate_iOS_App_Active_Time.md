# Calculate iOS App Active Time

日付: 2024-07-12

---

## 👤 ユーザー
*2024/7/12 10:21:27*

iOSのアプリのアクティブ時間を計測したい

---

## 🤖 アシスタント
*2024/7/12 10:21:51*

iOSアプリのアクティブ時間を計測するためには、アプリのライフサイクルイベントを活用します。具体的には、`AppDelegate`や`SceneDelegate`のメソッドを使ってアプリのフォアグラウンドとバックグラウンドの移行を追跡し、アクティブ時間を計測できます。以下のステップで実装できます。

### 1. プロジェクトの設定
まず、プロジェクトに必要な変数を追加します。

#### AppDelegate.swift
```swift
import UIKit

@main
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?
    var startTime: Date?
    var totalActiveTime: TimeInterval = 0

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // 初期化コード
        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {
        // アプリがアクティブでなくなる直前に呼ばれる
        if let startTime = startTime {
            totalActiveTime += Date().timeIntervalSince(startTime)
        }
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // アプリがアクティブになった時に呼ばれる
        startTime = Date()
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // アプリが終了する直前に呼ばれる
        if let startTime = startTime {
            totalActiveTime += Date().timeIntervalSince(startTime)
        }
        print("Total Active Time: \(totalActiveTime) seconds")
    }
}
```

### 2. SceneDelegate.swift の設定
iOS 13以降では、`SceneDelegate`も設定する必要があります。

#### SceneDelegate.swift
```swift
import UIKit

class SceneDelegate: UIResponder, UIWindowSceneDelegate {

    var window: UIWindow?
    var startTime: Date?
    var totalActiveTime: TimeInterval = 0

    func sceneDidBecomeActive(_ scene: UIScene) {
        // シーンがアクティブになった時に呼ばれる
        startTime = Date()
    }

    func sceneWillResignActive(_ scene: UIScene) {
        // シーンがアクティブでなくなる直前に呼ばれる
        if let startTime = startTime {
            totalActiveTime += Date().timeIntervalSince(startTime)
        }
    }

    func sceneWillEnterForeground(_ scene: UIScene) {
        // シーンがフォアグラウンドに入る直前に呼ばれる
        startTime = Date()
    }

    func sceneDidEnterBackground(_ scene: UIScene) {
        // シーンがバックグラウンドに入る直前に呼ばれる
        if let startTime = startTime {
            totalActiveTime += Date().timeIntervalSince(startTime)
        }
        print("Total Active Time: \(totalActiveTime) seconds")
    }
}
```

### 3. 計測結果の利用
計測結果は`totalActiveTime`として累積されます。このデータをアプリのどこかに保存したり、表示したりすることでユーザーのアクティブ時間を管理できます。

例えば、`UserDefaults`を使って保存することができます。

#### AppDelegate.swift 及び SceneDelegate.swift の修正
```swift
func applicationWillTerminate(_ application: UIApplication) {
    if let startTime = startTime {
        totalActiveTime += Date().timeIntervalSince(startTime)
    }
    UserDefaults.standard.set(totalActiveTime, forKey: "totalActiveTime")
}

func sceneDidEnterBackground(_ scene: UIScene) {
    if let startTime = startTime {
        totalActiveTime += Date().timeIntervalSince(startTime)
    }
    UserDefaults.standard.set(totalActiveTime, forKey: "totalActiveTime")
}
```

このようにして、アプリのアクティブ時間を計測・保存し、必要に応じて表示することができます。

---

## 👤 ユーザー
*2024/7/12 10:22:10*

SwiftUIで実現したい

---

## 🤖 アシスタント
*2024/7/12 10:22:27*

SwiftUIでアプリのアクティブ時間を計測するためには、Appのライフサイクルイベントを追跡する必要があります。これは、`@UIApplicationDelegateAdaptor`を使って`AppDelegate`の機能をSwiftUIのアプリに統合することで実現できます。

以下はその実装例です。

### 1. `AppDelegate`を定義する

```swift
import SwiftUI

class AppDelegate: NSObject, UIApplicationDelegate {
    var startTime: Date?
    var totalActiveTime: TimeInterval = 0

    func applicationDidBecomeActive(_ application: UIApplication) {
        // アプリがアクティブになった時に呼ばれる
        startTime = Date()
    }

    func applicationWillResignActive(_ application: UIApplication) {
        // アプリがアクティブでなくなる直前に呼ばれる
        if let startTime = startTime {
            totalActiveTime += Date().timeIntervalSince(startTime)
        }
        UserDefaults.standard.set(totalActiveTime, forKey: "totalActiveTime")
    }
}
```

### 2. `SceneDelegate`を定義する

```swift
import SwiftUI

class SceneDelegate: NSObject, UIWindowSceneDelegate {
    var startTime: Date?
    var totalActiveTime: TimeInterval = 0

    func sceneDidBecomeActive(_ scene: UIScene) {
        // シーンがアクティブになった時に呼ばれる
        startTime = Date()
    }

    func sceneWillResignActive(_ scene: UIScene) {
        // シーンがアクティブでなくなる直前に呼ばれる
        if let startTime = startTime {
            totalActiveTime += Date().timeIntervalSince(startTime)
        }
        UserDefaults.standard.set(totalActiveTime, forKey: "totalActiveTime")
    }
}
```

### 3. SwiftUIのアプリ構造に統合する

```swift
@main
struct ActiveTimeApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    @Environment(\.scenePhase) var scenePhase
    @StateObject private var sceneDelegate = SceneDelegate()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .onChange(of: scenePhase) { newPhase in
                    switch newPhase {
                    case .active:
                        sceneDelegate.sceneDidBecomeActive(UIScene())
                    case .inactive:
                        sceneDelegate.sceneWillResignActive(UIScene())
                    case .background:
                        sceneDelegate.sceneWillResignActive(UIScene())
                    @unknown default:
                        break
                    }
                }
                .environmentObject(sceneDelegate)
        }
    }
}
```

### 4. ContentViewを定義する

```swift
import SwiftUI

struct ContentView: View {
    @State private var totalActiveTime: TimeInterval = UserDefaults.standard.double(forKey: "totalActiveTime")

    var body: some View {
        VStack {
            Text("Total Active Time: \(totalActiveTime) seconds")
                .padding()
                .onAppear {
                    totalActiveTime = UserDefaults.standard.double(forKey: "totalActiveTime")
                }
        }
    }
}
```

この構成では、`AppDelegate`と`SceneDelegate`を使用してアプリのアクティブ時間を計測し、`UserDefaults`に保存します。SwiftUIの`@UIApplicationDelegateAdaptor`と`@Environment(\.scenePhase)`を使うことで、SwiftUIアプリでもライフサイクルイベントを処理できます。

---

## 👤 ユーザー
*2024/7/12 10:23:35*

SceneDelegate と @Environment(\\.scenePhase) var scenePhase の機能は重複しているのかそれぞれ役割があるのか教えてほしい

---

## 🤖 アシスタント
*2024/7/12 10:23:53*

`SceneDelegate`と`@Environment(\.scenePhase) var scenePhase`は、iOSアプリのライフサイクルイベントを管理するための異なるアプローチを提供します。それぞれの役割について説明します。

### SceneDelegate

`SceneDelegate`は、iOS 13以降で導入されたマルチウィンドウのサポートに関連しています。アプリの各ウィンドウ（シーン）のライフサイクルを管理するために使用されます。`SceneDelegate`には、次のようなシーン固有のライフサイクルメソッドがあります。

- `sceneDidBecomeActive(_:)`：シーンがアクティブになったときに呼ばれます。
- `sceneWillResignActive(_:)`：シーンがアクティブでなくなるときに呼ばれます。
- `sceneWillEnterForeground(_:)`：シーンがフォアグラウンドに移行する直前に呼ばれます。
- `sceneDidEnterBackground(_:)`：シーンがバックグラウンドに移行したときに呼ばれます。

`SceneDelegate`はUIKitアプリケーションの一部であり、アプリのウィンドウ管理を細かく制御したい場合に使用されます。

### @Environment(\.scenePhase) var scenePhase

`@Environment(\.scenePhase) var scenePhase`は、SwiftUIで提供される環境変数で、アプリケーションのシーンのライフサイクルフェーズを監視するために使用されます。`scenePhase`は次の3つの状態を持ちます。

- `.active`：シーンがアクティブであることを示します。
- `.inactive`：シーンがアクティブでないが、フォアグラウンドにあることを示します。
- `.background`：シーンがバックグラウンドにあることを示します。

`scenePhase`を使用すると、SwiftUIのビューで直接シーンの状態を監視して反応することができます。例えば、以下のようにしてシーンの状態変化に応じたアクションを実行できます。

```swift
@main
struct ActiveTimeApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    @Environment(\.scenePhase) var scenePhase

    var body: some Scene {
        WindowGroup {
            ContentView()
                .onChange(of: scenePhase) { newPhase in
                    switch newPhase {
                    case .active:
                        // シーンがアクティブになったときの処理
                        print("Scene is active")
                    case .inactive:
                        // シーンがアクティブでなくなったときの処理
                        print("Scene is inactive")
                    case .background:
                        // シーンがバックグラウンドに入ったときの処理
                        print("Scene is in background")
                    @unknown default:
                        break
                    }
                }
        }
    }
}
```

### 重複しているのか、それぞれ役割があるのか

`SceneDelegate`と`@Environment(\.scenePhase) var scenePhase`は、どちらもアプリのライフサイクルイベントを処理するために使用できますが、使用するコンテキストが異なります。

- **SceneDelegate**: UIKitアプリや複数のウィンドウ（シーン）を管理する必要がある場合に有用です。シーンごとに細かい制御が必要な場合に使用します。
- **@Environment(\.scenePhase) var scenePhase**: SwiftUIアプリで簡単にシーンの状態を監視するために使用します。SwiftUIビューでライフサイクルイベントに反応する必要がある場合に便利です。

一般的に、SwiftUIを使用している場合は、`@Environment(\.scenePhase) var scenePhase`を使うことで簡潔にライフサイクルイベントを処理できるため、こちらを使用することが推奨されます。

---

## 👤 ユーザー
*2024/7/12 10:24:22*

@Environment(\\.scenePhase) var scenePhase だけで利用時間を調べることはできるのか？

---

## 🤖 アシスタント
*2024/7/12 10:24:42*

はい、`@Environment(\.scenePhase) var scenePhase`だけを使用してアプリのアクティブ時間を計測することができます。SwiftUIの`@Environment(\.scenePhase)`を使えば、アプリのシーンのライフサイクル状態を監視し、適切なタイミングでアクティブ時間を記録することが可能です。

以下に、その実装例を示します。

### 1. SwiftUIアプリの設定

```swift
import SwiftUI

@main
struct ActiveTimeApp: App {
    @StateObject private var activeTimeManager = ActiveTimeManager()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(activeTimeManager)
                .onChange(of: activeTimeManager.scenePhase) { newPhase in
                    activeTimeManager.updateActiveTime(for: newPhase)
                }
        }
    }
}
```

### 2. ActiveTimeManagerクラスの定義

アクティブ時間を管理するためのクラスを定義します。このクラスはシーンの状態を監視し、アクティブ時間を計測します。

```swift
import SwiftUI
import Combine

class ActiveTimeManager: ObservableObject {
    @Published var scenePhase: ScenePhase = .inactive
    private var startTime: Date?
    private var totalActiveTime: TimeInterval = 0

    init() {
        NotificationCenter.default.addObserver(self, selector: #selector(updateScenePhase), name: UIScene.didActivateNotification, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(updateScenePhase), name: UIScene.willDeactivateNotification, object: nil)
    }

    deinit {
        NotificationCenter.default.removeObserver(self)
    }

    @objc private func updateScenePhase(notification: Notification) {
        if let scene = notification.object as? UIScene {
            DispatchQueue.main.async {
                self.scenePhase = scene.activationState == .foregroundActive ? .active : .inactive
            }
        }
    }

    func updateActiveTime(for newPhase: ScenePhase) {
        switch newPhase {
        case .active:
            startTime = Date()
        case .inactive, .background:
            if let startTime = startTime {
                totalActiveTime += Date().timeIntervalSince(startTime)
                self.startTime = nil
                UserDefaults.standard.set(totalActiveTime, forKey: "totalActiveTime")
            }
        @unknown default:
            break
        }
    }

    func getTotalActiveTime() -> TimeInterval {
        return UserDefaults.standard.double(forKey: "totalActiveTime")
    }
}
```

### 3. ContentViewの定義

計測されたアクティブ時間を表示するビューを定義します。

```swift
import SwiftUI

struct ContentView: View {
    @EnvironmentObject var activeTimeManager: ActiveTimeManager

    var body: some View {
        VStack {
            Text("Total Active Time: \(activeTimeManager.getTotalActiveTime()) seconds")
                .padding()
                .onAppear {
                    activeTimeManager.updateActiveTime(for: activeTimeManager.scenePhase)
                }
        }
    }
}
```

### まとめ

この実装では、`@Environment(\.scenePhase) var scenePhase`と`NotificationCenter`を組み合わせて、アプリのアクティブ時間を計測しています。これにより、アプリのシーンがアクティブ状態から非アクティブ状態に移行するタイミングで時間を記録し、アクティブ時間の累積を管理します。

`ActiveTimeManager`クラスは`ObservableObject`を継承しており、アクティブ時間の計測と管理を行います。計測されたアクティブ時間は`UserDefaults`に保存され、`ContentView`で表示されます。

---

## 👤 ユーザー
*2024/7/12 10:26:35*

NotificationCenter.default.addObserver っているかな？ Combine で実装できないかな？

---

## 🤖 アシスタント
*2024/7/12 10:26:51*

はい、Combineを使ってシーンフェーズの変更を監視し、アクティブ時間を計測することができます。Combineを使用することで、よりクリーンで宣言的なコードになります。以下にその実装例を示します。

### 1. SwiftUIアプリの設定

```swift
import SwiftUI

@main
struct ActiveTimeApp: App {
    @StateObject private var activeTimeManager = ActiveTimeManager()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(activeTimeManager)
                .onChange(of: activeTimeManager.scenePhase) { newPhase in
                    activeTimeManager.updateActiveTime(for: newPhase)
                }
        }
    }
}
```

### 2. ActiveTimeManagerクラスの定義

Combineを使用してシーンの状態を監視し、アクティブ時間を計測するためのクラスを定義します。

```swift
import SwiftUI
import Combine

class ActiveTimeManager: ObservableObject {
    @Published var scenePhase: ScenePhase = .inactive
    private var startTime: Date?
    private var totalActiveTime: TimeInterval = 0
    private var cancellables = Set<AnyCancellable>()

    init() {
        $scenePhase
            .sink { [weak self] newPhase in
                self?.updateActiveTime(for: newPhase)
            }
            .store(in: &cancellables)
    }

    func updateActiveTime(for newPhase: ScenePhase) {
        switch newPhase {
        case .active:
            startTime = Date()
        case .inactive, .background:
            if let startTime = startTime {
                totalActiveTime += Date().timeIntervalSince(startTime)
                self.startTime = nil
                UserDefaults.standard.set(totalActiveTime, forKey: "totalActiveTime")
            }
        @unknown default:
            break
        }
    }

    func getTotalActiveTime() -> TimeInterval {
        return UserDefaults.standard.double(forKey: "totalActiveTime")
    }
}
```

### 3. ContentViewの定義

計測されたアクティブ時間を表示するビューを定義します。

```swift
import SwiftUI

struct ContentView: View {
    @EnvironmentObject var activeTimeManager: ActiveTimeManager

    var body: some View {
        VStack {
            Text("Total Active Time: \(activeTimeManager.getTotalActiveTime()) seconds")
                .padding()
                .onAppear {
                    activeTimeManager.updateActiveTime(for: activeTimeManager.scenePhase)
                }
        }
    }
}
```

### まとめ

この実装では、Combineを使用して`scenePhase`の変更を監視し、アクティブ時間を計測しています。`ActiveTimeManager`クラスは`ObservableObject`を継承しており、シーンフェーズが変更されるたびに`updateActiveTime`メソッドが呼ばれます。この方法により、`NotificationCenter`を使用せずに宣言的にアクティブ時間を計測できます。

---
