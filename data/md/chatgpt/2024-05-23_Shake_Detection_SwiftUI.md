# Shake Detection SwiftUI

日付: 2024-05-23

---

## 👤 ユーザー
*2024/05/23 11:11:18*

SwiftUIでshakeを検知する 最新のiOS

---

## 🤖 アシスタント
*2024/05/23 11:11:38*

最新のiOSでSwiftUIを使用してデバイスのシェイクを検知するには、UIKitの`UIResponder`の`motionEnded(_:with:)`メソッドを利用する必要があります。SwiftUIには直接シェイクを検知する機能がないため、UIKitの機能を使ってカスタムのビューコントローラーを作成し、それをSwiftUIでラップする方法を取ります。

以下のステップに従って、シェイクを検知するSwiftUIのカスタムビューを作成します。

1. **UIKitのカスタムビューコントローラーを作成**  
   まず、シェイクを検知するためのカスタムビューコントローラーを作成します。

   ```swift
   import UIKit
   import SwiftUI

   class ShakeDetectingViewController: UIViewController {
       var onShakeDetected: (() -> Void)?

       override func motionEnded(_ motion: UIEvent.EventSubtype, with event: UIEvent?) {
           if motion == .motionShake {
               onShakeDetected?()
           }
       }
   }
   ```

2. **UIViewControllerRepresentableを使用してSwiftUIにラップ**  
   次に、このビューコントローラーをSwiftUIにラップするために`UIViewControllerRepresentable`プロトコルを実装します。

   ```swift
   struct ShakeDetectingView: UIViewControllerRepresentable {
       var onShake: () -> Void

       func makeUIViewController(context: Context) -> ShakeDetectingViewController {
           let viewController = ShakeDetectingViewController()
           viewController.onShakeDetected = onShake
           return viewController
       }

       func updateUIViewController(_ uiViewController: ShakeDetectingViewController, context: Context) {}
   }
   ```

3. **SwiftUIビューで使用する**  
   このカスタムビューをSwiftUIビューで使用し、シェイクが検知されたときに適切なアクションを実行します。

   ```swift
   struct ContentView: View {
       @State private var shakeCount = 0

       var body: some View {
           VStack {
               Text("Shake count: \(shakeCount)")
                   .padding()
               Spacer()
           }
           .background(ShakeDetectingView {
               shakeCount += 1
           })
       }
   }
   ```

4. **AppDelegateでシェイクイベントを有効にする**  
   最後に、AppDelegateでシェイクイベントを有効にします。これは、アプリ全体でシェイクイベントを有効にするために必要です。

   ```swift
   import UIKit

   @UIApplicationMain
   class AppDelegate: UIResponder, UIApplicationDelegate {
       var window: UIWindow?

       func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
           window = UIWindow(frame: UIScreen.main.bounds)
           window?.rootViewController = UIHostingController(rootView: ContentView())
           window?.makeKeyAndVisible()
           return true
       }

       override var canBecomeFirstResponder: Bool {
           return true
       }

       override func motionEnded(_ motion: UIEvent.EventSubtype, with event: UIEvent?) {
           if motion == .motionShake {
               NotificationCenter.default.post(name: .deviceDidShakeNotification, object: nil)
           }
       }
   }

   extension NSNotification.Name {
       static let deviceDidShakeNotification = NSNotification.Name("deviceDidShakeNotification")
   }
   ```

このセットアップにより、SwiftUIビュー内でシェイクを検知し、カスタムアクションを実行することができます。

---

## 👤 ユーザー
*2024/05/23 11:11:41*

UIViewControllerRepresentable は使わないでほしい

---

## 🤖 アシスタント
*2024/05/23 11:12:01*

`UIViewControllerRepresentable`を使わずにSwiftUIでシェイクを検知するには、`UIApplication`のカスタムデリゲートを使う方法があります。この方法では、シェイクイベントをアプリ全体で検知し、SwiftUIビューに通知することができます。

以下は、`UIApplication`のカスタムデリゲートを使ってシェイクイベントを検知し、SwiftUIビューに通知する例です。

1. **カスタムUIApplicationデリゲートを作成**

   ```swift
   import UIKit

   class ShakeDetectingApplication: UIApplication {
       override func motionEnded(_ motion: UIEvent.EventSubtype, with event: UIEvent?) {
           if motion == .motionShake {
               NotificationCenter.default.post(name: .deviceDidShakeNotification, object: nil)
           }
       }
   }

   extension NSNotification.Name {
       static let deviceDidShakeNotification = NSNotification.Name("deviceDidShakeNotification")
   }
   ```

2. **AppDelegateを設定**

   `@UIApplicationMain`を使わずに`main.swift`を作成してカスタム`UIApplication`を使うように設定します。

   ```swift
   import SwiftUI

   @main
   struct ShakeDetectionApp: App {
       @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate

       var body: some Scene {
           WindowGroup {
               ContentView()
           }
       }
   }

   class AppDelegate: UIResponder, UIApplicationDelegate {
       var window: UIWindow?

       func application(_ application: UIApplication,
                        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
           window = UIWindow(frame: UIScreen.main.bounds)
           window?.rootViewController = UIHostingController(rootView: ContentView())
           window?.makeKeyAndVisible()
           return true
       }
   }
   ```

3. **シェイクイベントをSwiftUIビューに通知する**

   シェイクイベントが発生したときに通知を受け取り、SwiftUIビューでそれを処理します。

   ```swift
   import SwiftUI

   struct ContentView: View {
       @State private var shakeCount = 0

       var body: some View {
           VStack {
               Text("Shake count: \(shakeCount)")
                   .padding()
               Spacer()
           }
           .onAppear {
               NotificationCenter.default.addObserver(forName: .deviceDidShakeNotification, object: nil, queue: .main) { _ in
                   shakeCount += 1
               }
           }
           .onDisappear {
               NotificationCenter.default.removeObserver(self, name: .deviceDidShakeNotification, object: nil)
           }
       }
   }
   ```

このアプローチでは、`UIViewControllerRepresentable`を使用せずにシェイクイベントを検知し、SwiftUIビューでそのイベントを処理することができます。カスタム`UIApplication`を使用してシェイクイベントを検知し、`NotificationCenter`を介してSwiftUIビューに通知を送ることで実現しています。

---
