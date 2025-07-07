# UIInterfaceOrientationMaskの取得方法

日付: 2023-06-28

---

## 👤 ユーザー
*2023/6/28 16:51:22*

現在のUIInterfaceOrientationMaskの値の取得方法

---

## 🤖 アシスタント
*2023/6/28 16:51:53*

`UIInterfaceOrientationMask`はアプリケーションで許可されるデバイスの回転方向を表します。この値は、アプリケーションの設定や特定のビューコントローラの要求により定義されます。

特定のビューコントローラで許可される方向を定義するには、ビューコントローラ内で以下のメソッドをオーバーライドします：

```swift
override var supportedInterfaceOrientations: UIInterfaceOrientationMask {
    return .portrait // ここで許可される方向を指定します
}
```

しかし、現在のデバイスの向きを取得するには、`UIDevice` クラスの `orientation` プロパティを使用することができます：

```swift
let currentOrientation = UIDevice.current.orientation
```

この `currentOrientation` は `UIDeviceOrientation` 型で、デバイスの現在の物理的な向きを表します。

なお、`UIInterfaceOrientationMask`と`UIDeviceOrientation`は異なる型であり、それぞれが異なるコンテキストで使用されます。前者はアプリケーションまたはビューコントローラがサポートする向きを定義し、後者はデバイスの物理的な向きを表します。

---

## 👤 ユーザー
*2023/6/28 16:52:00*

UIInterfaceOrientationMask を取得する方法はないの？

---

## 🤖 アシスタント
*2023/6/28 16:52:50*

iOSでは、特定のビューコントローラの許可されるインターフェースの向きを示す `UIInterfaceOrientationMask` を直接取得するメソッドは提供されていません。これは主にアプリケーションまたはビューコントローラの設定やオーバーライドで定義され、特定のビューコントローラがどのような向きをサポートするかをシステムに伝える役割があります。

しかし、あるビューコントローラが特定の向きをサポートしているかどうかを確認するためには、そのビューコントローラで `supportedInterfaceOrientations` メソッドをオーバーライドし、その値を返すことができます。以下に例を示します：

```swift
class MyViewController: UIViewController {
    override var supportedInterfaceOrientations: UIInterfaceOrientationMask {
        return .portrait // ここで許可される向きを指定します
    }
}

let myVC = MyViewController()
let supportedOrientations = myVC.supportedInterfaceOrientations
```

この方法では `supportedInterfaceOrientations` を呼び出すことで、そのビューコントローラがサポートする `UIInterfaceOrientationMask` を取得できます。ただし、この取得は明示的にオーバーライドしたビューコントローラでのみ可能であり、全てのビューコントローラで `UIInterfaceOrientationMask` の値を取得することはできません。

アプリケーション全体で許可される向きを制御する場合、通常は `Info.plist` ファイル内の `UISupportedInterfaceOrientations` キーで設定します。しかし、この設定もランタイム中に直接取得することはできません。

---

## 👤 ユーザー
*2023/6/28 16:52:52*

SiwftUIで開発していて、UIInterfaceOrientation を取得する方法をおしえてほしい

---

## 🤖 アシスタント
*2023/6/28 16:53:24*

SwiftUIでは、`UIInterfaceOrientation`を直接取得するメソッドは提供されていません。しかし、`@Environment`プロパティラッパを使ってデバイスのサイズクラスを取得し、それをもとにデバイスの向きを推定することは可能です。

以下のコードは、`sizeClass`を使ってデバイスの向きを判別する例です：

```swift
import SwiftUI

struct ContentView: View {
    @Environment(\.verticalSizeClass) var verticalSizeClass
    @Environment(\.horizontalSizeClass) var horizontalSizeClass
    
    var body: some View {
        VStack {
            if verticalSizeClass == .compact {
                Text("Landscape")
            } else {
                Text("Portrait")
            }
        }
    }
}
```

上記のコードでは、縦のサイズクラスが`.compact`であれば、デバイスは横向き（Landscape）と推定し、そうでなければ縦向き（Portrait）と推定します。しかし、これはあくまで推定であり、実際のデバイスの向きと一致しない場合もあります。そのため、より厳密にデバイスの向きを取得する必要がある場合は、UIKitの`UIDevice.current.orientation`を使うなど、SwiftUI以外の方法を組み合わせることが必要になるでしょう。

---
