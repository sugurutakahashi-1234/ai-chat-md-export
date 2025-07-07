# SwiftUI: AppDelegate or SceneDelegate?

日付: 2023-05-06

---

## 👤 ユーザー
*2023/5/6 18:08:35*

AppDelegateとSceneDelegateについて、SwiftUIでアプリ開発をしようとしているけどどちらを採用すべきか教えて欲しい。

---

## 🤖 アシスタント
*2023/5/6 18:09:37*

SwiftUIを使ってアプリ開発を行う場合、基本的には`SceneDelegate`を採用することをお勧めします。

`AppDelegate`と`SceneDelegate`は、iOSアプリのライフサイクル管理に関連する機能を提供します。`AppDelegate`は古いiOSアプリケーションライフサイクル管理方法で、iOS 13以降、複数のウィンドウをサポートするために`SceneDelegate`が導入されました。

SwiftUIでのアプリ開発では、`SceneDelegate`を使ってアプリケーションの初期化やUIの構築を行います。特に、iOS 13以降をターゲットにしている場合は、`SceneDelegate`を使うべきです。ただし、iOS 12以前をサポートするアプリの場合は、`AppDelegate`を使う必要があります。

SwiftUI 2.0以降では、アプリのエントリーポイントとして新しい`@main`アノテーションを使って、`SceneDelegate`や`AppDelegate`を完全に置き換えることができます。これにより、よりシンプルな構成でアプリを開発することができます。

```swift
import SwiftUI

@main
struct MyApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

この例では、`MyApp`構造体がアプリケーションのエントリーポイントになり、`ContentView`がアプリケーションのルートビューとして表示されます。

総じて、SwiftUIを使ってアプリを開発する場合は、`SceneDelegate`を採用するか、SwiftUI 2.0の`@main`アノテーションを利用して、アプリケーションの構成をシンプルにすることをお勧めします。

---

## 👤 ユーザー
*2023/5/6 18:12:35*

SceneDelegate を使って、アプリの起動時とアプリがバックグラウンドから復帰した時にログを出力させたいんだけどどうすればいいかな？

---

## 🤖 アシスタント
*2023/5/6 18:13:19*

`SceneDelegate`を使ってアプリの起動時とバックグラウンドから復帰したときにログを出力させるには、`SceneDelegate.swift`ファイル内で、`sceneWillEnterForeground(_:)`と`sceneDidBecomeActive(_:)`のメソッドを実装します。

以下にその例を示します。

```swift
import UIKit
import SwiftUI

class SceneDelegate: UIResponder, UIWindowSceneDelegate {

    var window: UIWindow?

    // 他のデリゲートメソッド...

    func sceneWillEnterForeground(_ scene: UIScene) {
        // アプリがバックグラウンドからフォアグラウンドに移行する直前に呼ばれます。
        print("アプリがフォアグラウンドに入る直前")
    }

    func sceneDidBecomeActive(_ scene: UIScene) {
        // アプリがアクティブになったときに呼ばれます。これは、アプリの起動時やバックグラウンドから復帰したときにも呼ばれます。
        print("アプリがアクティブになった")
    }

}
```

この例では、`sceneWillEnterForeground(_:)`メソッドがアプリがフォアグラウンドに入る直前に呼ばれ、`sceneDidBecomeActive(_:)`メソッドがアプリがアクティブになったときに呼ばれます。アプリの起動時とバックグラウンドから復帰したときにそれぞれログが出力されます。

これらのメソッドを使って、アプリの起動時

---
