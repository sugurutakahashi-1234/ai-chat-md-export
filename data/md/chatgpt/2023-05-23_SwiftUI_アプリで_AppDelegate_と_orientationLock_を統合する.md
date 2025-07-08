# SwiftUI アプリで AppDelegate と orientationLock を統合する

Date: 2023-05-23

---

## 👤 User
*2023-05-23 12:17:48*

SwiftUI のアプリ開発で @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate をつかいたい。また、AppDelegate に static var orientationLock = UIInterfaceOrientationMask.portrait を宣言して、好きなViewでその値を更新したいのだけれどもどうすればいいか教えて欲しい

---

## 🤖 Assistant
*2023-05-23 12:18:21*

SwiftUI 2.0以降では、`@UIApplicationDelegateAdaptor` を使用して `AppDelegate` の機能を統合することができます。

あなたが望む動作に対応するために、以下の手順を試してみてください：

1. `AppDelegate` を作成し、そこに `orientationLock` 変数を作成します。そして、デバイスの向きを制御するために、`application(_:supportedInterfaceOrientationsFor:)` メソッドをオーバーライドします。

```swift
class AppDelegate: UIResponder, UIApplicationDelegate {
    static var orientationLock = UIInterfaceOrientationMask.portrait
    
    func application(_ application: UIApplication, supportedInterfaceOrientationsFor window: UIWindow?) -> UIInterfaceOrientationMask {
        return Self.orientationLock
    }
}
```

2. `@UIApplicationDelegateAdaptor` 属性を使って `AppDelegate` を SwiftUI App に統合します。

```swift
@main
struct YourApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

3. 各 `View` で `AppDelegate.orientationLock` の値を変更します。これにより、デバイスの向きを制御できます。例えば、以下のように行うことができます。

```swift
struct SomeView: View {
    var body: some View {
        // some view code...
        Button("Change Orientation") {
            AppDelegate.orientationLock = .landscape
        }
    }
}
```

以上の方法で、`AppDelegate` 内の静的変数 `orientationLock` を更新し、それによりデバイスの向きを制御することができます。ただし、SwiftUI の場合、これは一部の制約に対する解決策であるため、必ずしも完全な解決策ではない可能性があります。また、Apple が推奨する方法とは異なるかもしれません。

---

## 👤 User
*2023-05-23 12:19:03*

マルチモジュール対応していて、SomeView からは AppDelegate を参照できないのだけれどもどうすればいいかおしえてほしい

---

## 🤖 Assistant
*2023-05-23 12:19:35*

SomeViewから直接AppDelegateを参照できない場合、SwiftUIの環境を利用してインターフェースの方向のロックを操作するための共有データを作成できます。この状況では、通常、共有可能な状態を作成し、それを@EnvironmentObjectプロパティラッパを使用してアプリケーション内の複数のビューに渡すことが推奨されます。

以下のようにOrientationManagerクラスを作成してみてください：

```swift
class OrientationManager: ObservableObject {
    static let shared = OrientationManager()
    @Published var orientationLock = UIInterfaceOrientationMask.portrait
}
```

そして、AppDelegateを以下のように更新します：

```swift
class AppDelegate: UIResponder, UIApplicationDelegate {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate

    func application(_ application: UIApplication, supportedInterfaceOrientationsFor window: UIWindow?) -> UIInterfaceOrientationMask {
        return OrientationManager.shared.orientationLock
    }
}
```

アプリの初期設定部分でOrientationManagerを環境に追加します：

```swift
@main
struct YourApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    @StateObject private var orientationManager = OrientationManager.shared

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(orientationManager)
        }
    }
}
```

最後に、各ビューでOrientationManagerを取得し、orientationLockプロパティを操作します：

```swift
struct SomeView: View {
    @EnvironmentObject var orientationManager: OrientationManager

    var body: some View {
        // some view code...
        Button("Change Orientation") {
            orientationManager.orientationLock = .landscape
        }
    }
}
```

このように、EnvironmentObjectを介してデータを共有することで、各ビューがAppDelegateを直接参照することなくアプリ全体の状態を操作できます。

---

## 👤 User
*2023-05-23 12:20:37*

SomeView 側のコードも書いて欲しい

---

## 🤖 Assistant
*2023-05-23 12:21:06*

もちろんです。上記のコードでは `SomeView` の中で `OrientationManager` を参照するようにしています。以下にその例を示します：

```swift
struct SomeView: View {
    @EnvironmentObject var orientationManager: OrientationManager

    var body: some View {
        VStack {
            // ここにビューのコードを書く
            Text("Current View")
            
            Button("Lock to Landscape") {
                orientationManager.orientationLock = .landscape
            }
            
            Button("Lock to Portrait") {
                orientationManager.orientationLock = .portrait
            }
        }
        .onAppear {
            // ビューが表示されるときに向きを変更する場合
            orientationManager.orientationLock = .portrait //または.landscape
        }
        .onDisappear {
            // ビューが消えるときに向きを変更する場合
            orientationManager.orientationLock = .all
        }
    }
}
```

このように、`OrientationManager` は `EnvironmentObject` として提供され、これにより `SomeView` 内のどこからでもアクセスできます。`orientationLock` を変更することで、アプリケーションの画面の向きを制御することができます。

ただし、このコードはあくまで一例であり、具体的な実装はアプリケーションの要件によります。ビューが表示されるときや消えるときに向きを制御するために `onAppear` および `onDisappear` を使用していますが、必要に応じて調整してください。

---

## 👤 User
*2023-05-23 14:33:41*

UIDevice.current.setValue(3, forKey: "orientation") みたいな処理は必要ないの？

---

## 🤖 Assistant
*2023-05-23 14:34:04*

私が提供したソリューションでは、UIの向きは AppDelegate の `application(_:supportedInterfaceOrientationsFor:)` 関数を通じて制御されます。具体的には、OrientationManagerのorientationLockプロパティが更新されると、この関数が再評価され、適切な向きが選択されます。

`UIDevice.current.setValue(3, forKey: "orientation")` のようなコードは、強制的にデバイスの現在の向きを変更するために使われますが、それは通常推奨されない手法です。この手法はプライベートAPI（この場合は "orientation" キー）を使っていて、このようなAPIの使用はアップルによって禁止されています。プライベートAPIを使用したアプリはApp Storeに登録できない可能性があります。

したがって、orientationLockプロパティを更新するだけでアプリの画面の向きを制御できるなら、その方が良いでしょう。ただし、具体的な要件によっては、AppDelegateにこの処理を含めるという選択肢もあります。ただし、この場合は、この操作がプライベートAPIを使用していてApp Storeのガイドライン違反となる可能性があることを理解しておいてください。

---

## 👤 User
*2023-05-23 14:47:46*

UIInterfaceOrientation を UIInterfaceOrientationMask に変換するコードを書きたい

---

## 🤖 Assistant
*2023-05-23 14:48:09*

`UIInterfaceOrientation`を`UIInterfaceOrientationMask`に変換するには、switchステートメントを使用して各ケースを処理します。以下にその例を示します：

```swift
extension UIInterfaceOrientation {
    var toOrientationMask: UIInterfaceOrientationMask {
        switch self {
        case .portrait:
            return .portrait
        case .portraitUpsideDown:
            return .portraitUpsideDown
        case .landscapeLeft:
            return .landscapeLeft
        case .landscapeRight:
            return .landscapeRight
        case .unknown:
            return .all
        @unknown default:
            return .all
        }
    }
}
```

このSwift拡張機能は、新しいプロパティ`toOrientationMask`を`UIInterfaceOrientation`に追加します。このプロパティを使うと、次のように簡単に変換できます：

```swift
let orientation: UIInterfaceOrientation = .portrait
let mask: UIInterfaceOrientationMask = orientation.toOrientationMask
```

なお、'@unknown default'ケースは、将来的に新しい`UIInterfaceOrientation`値が追加された場合でも、このコードが正しく動作することを保証します。このケースは、新しい向きに対応する明確なマスクがない場合には全ての向きを許可する`UIInterfaceOrientationMask.all`を返します。

---
