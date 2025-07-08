# SwiftUI: 監視rootViewController

日付: 2023-10-02

---

## 👤 ユーザー
*2023/10/02 11:06:27*

SwiftUIでのwindowScenes?.keyWindow?.rootViewControllerの更新のかんしってどうやればできますか？

---

## 🤖 アシスタント
*2023/10/02 11:06:45*

SwiftUIでの`windowScenes?.keyWindow?.rootViewController`を変更するためには、`UIApplicationDelegate`を利用し、直接`UIWindow`オブジェクトにアクセスする必要があります。以下はその基本的な手順です。

1. SwiftUIの`@main`アノテーションを使っている場合は、`@UIApplicationDelegateAdaptor`を用いて、`UIApplicationDelegate`を定義します。

```swift
class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -&gt; Bool {
        // Override point for customization after application launch.
        return true
    }
}

@main
struct YourApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    
    var body: some Scene {
        Window

---
