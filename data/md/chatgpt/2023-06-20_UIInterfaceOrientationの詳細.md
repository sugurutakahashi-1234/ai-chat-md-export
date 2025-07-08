# UIInterfaceOrientationの詳細

日付: 2023-06-20

---

## 👤 ユーザー
*2023/06/21 01:15:04*

Swiftでアプリ開発をしていて、UIInterfaceOrientation について詳しく教えて欲しい

---

## 🤖 アシスタント
*2023/06/21 01:16:00*

SwiftでiOSアプリを開発する際、デバイスの画面方向（オリエンテーション）を管理するためには `UIInterfaceOrientation` という列挙体を使います。これはUIKitフレームワークの一部で、現在のデバイスのオリエンテーションを表すためのものです。

`UIInterfaceOrientation` は以下の4つの値を持つことができます：

- `.portrait`: デバイスが直立の向きにある
- `.portraitUpsideDown`: デバイスが逆さまの直立の向きにある
- `.landscapeLeft`: デバイスが左側が上になるように回転した向きにある
- `.landscapeRight`: デバイスが右側が上になるように回転した向きにある

これらの値は、アプリが特定の向きをサポートするかどうかを制御するため、またはアプリがデバイスの向きを認識し、それに応じてUIを変更するために使用されます。

以下に、アプリが特定の向きをサポートするかどうかを制御する一例を挙げます：

```swift
override var supportedInterfaceOrientations: UIInterfaceOrientationMask {
    return [.portrait, .landscapeLeft]
}
```

このコードは、アプリが縦向きと左向きの横向きをサポートすることを示しています。

なお、`UIInterfaceOrientationMask`はビットマスクとして動作し、複数の`UIInterfaceOrientation`を組み合わせることができます。そして`supportedInterfaceOrientations`プロパティは、アプリがサポートするオリエンテーションを定義します。

デバイスの向きが変更されたときに特定の動作を行うためには、`UIDeviceOrientationDidChangeNotification`通知を使用して、その変更を検知することができます。

---

## 👤 ユーザー
*2023/06/21 01:16:16*

UIDeviceOrientationとUIInterfaceOrientationの違いについて

---

## 🤖 アシスタント
*2023/06/21 01:17:22*

`UIDeviceOrientation`と`UIInterfaceOrientation`の2つは、それぞれデバイスの物理的な向きと、アプリの現在のインターフェース向きを表します。それぞれ異なる状況で使用されますが、混同しやすいので、それぞれの違いについて詳しく説明します。

`UIDeviceOrientation`:
これは`UIDevice`クラスの列挙型で、デバイスの物理的な向きを表します。以下の値を持つことができます。

- `.unknown`: 方向が不明である
- `.portrait`: デバイスが直立の向きにある
- `.portraitUpsideDown`: デバイスが逆さまの直立の向きにある
- `.landscapeLeft`: デバイスが左側が上になるように回転した向きにある
- `.landscapeRight`: デバイスが右側が上になるように回転した向きにある
- `.faceUp`: デバイスが面が上を向いている
- `.faceDown`: デバイスが面が下を向いている

`UIInterfaceOrientation`:
これはUIKitフレームワークの列挙型で、アプリケーションのユーザインターフェースの向きを表します。以下の値を持つことができます。

- `.unknown`: 方向が不明である
- `.portrait`: デバイスが直立の向きにある
- `.portraitUpsideDown`: デバイスが逆さまの直立の向きにある
- `.landscapeLeft`: デバイスが左側が上になるように回転した向きにある
- `.landscapeRight`: デバイスが右側が上になるように回転した向きにある

要点は以下の通りです：

- `UIDeviceOrientation`はデバイスの物理的な向きを反映します。そのため、ユーザーがデバイスをどのように保持しているかを理解するために使用できます。一方で、UIがどのように表示されるべきかは考慮していません。
- `UIInterfaceOrientation`はアプリのユーザインターフェースの現在の向きを表します。これはアプリがどの向きで表示されるべきかを制御します。
- `UIDeviceOrientation`は`faceUp`や`faceDown`のような値を持つことができますが、これらの値は`UIInterfaceOrientation`には存在しません。なぜなら、アプリのインターフェースがこれらの向きを持つことはないからです。

したがって、これらの値を使用する際は、それぞれ

---

## 🤖 アシスタント
*2023/06/21 01:17:31*

の目的と違いを理解することが重要です。

---

## 👤 ユーザー
*2023/06/21 01:18:50*

アプリ側でUIInterfaceOrientationをportraitに設定したときに、デバイスがそれ通りに持っていることを検知したい。もし、そうなっている場合はtrue、そうなっていない場合はfalseになるようなエニーパブリッシャーをはやして欲しい

---

## 🤖 アシスタント
*2023/06/21 01:19:53*

SwiftUIの新しい`Combine`フレームワークを使用して、デバイスの向きを監視し、それがポートレートかどうかを示すパブリッシャーを作成することができます。

以下に、そのようなパブリッシャーを作成する例を示します：

```swift
import Combine
import UIKit

// オリエンテーションチェック用のパブリッシャー
class OrientationPublisher: ObservableObject {
    // パブリッシュするオブジェクト
    @Published var isPortrait: Bool = (UIDevice.current.orientation == .portrait)

    var cancellable: AnyCancellable?

    init() {
        // NotificationCenterからデバイスのオリエンテーション変更の通知を受け取る
        cancellable = NotificationCenter.default.publisher(for: UIDevice.orientationDidChangeNotification)
            .sink { [weak self] _ in
                DispatchQueue.main.async {
                    // デバイスの現在のオリエンテーションがポートレートかどうかを確認し、パブリッシュする
                    self?.isPortrait = (UIDevice.current.orientation == .portrait)
                }
            }
        
        UIDevice.current.beginGeneratingDeviceOrientationNotifications()
    }

    deinit {
        UIDevice.current.endGeneratingDeviceOrientationNotifications()
        cancellable?.cancel()
    }
}
```

ここで、`isPortrait`という名前の`@Published`プロパティを作成しました。これは、デバイスの現在の向きがポートレートかどうかを表します。

このクラスのインスタンスを作成すると、NotificationCenterからデバイスの向きが変わったときの通知を購読し始めます。向きが変わるたびに、新しい向きがポートレートかどうかをチェックし、その結果を`isPortrait`プロパティにセットします。

このパブリッシャーを使用すると、デバイスの向きが変わったときにそれがポートレートかどうかを監視することができます。

注意: `UIDevice.current.beginGeneratingDeviceOrientationNotifications()` を呼び出して、デバイスからの向き変更通知を開始し、ディニシャライザで通知を停止しています。この通知はバッテリーを消費する可能性があるため、必要ないときは停止することが推奨されます。

---

## 👤 ユーザー
*2023/06/21 01:21:14*

どうようにUIInterfaceOrientationをlandscapeLeftにしたときにUIDeviceOrientationが同じようになっているかを通知して欲しい

---

## 🤖 アシスタント
*2023/06/21 01:22:10*

アプリのUI向きとデバイスの向きが同じであるかどうかを確認するために、`UIInterfaceOrientation`を使用してデバイスの向きを取得することはできません。これは、`UIInterfaceOrientation`がアプリの現在の向きを返すだけで、物理的なデバイスの向きを返さないからです。

しかし、アプリがlandscapeLeft向きに設定されていて、デバイスもその向きを保持しているかどうかを監視するためには、以下のようにパブリッシャーを修正することができます：

```swift
import Combine
import UIKit

class OrientationPublisher: ObservableObject {
    @Published var isLandscapeLeft: Bool = (UIDevice.current.orientation == .landscapeLeft)

    var cancellable: AnyCancellable?

    init() {
        cancellable = NotificationCenter.default.publisher(for: UIDevice.orientationDidChangeNotification)
            .sink { [weak self] _ in
                DispatchQueue.main.async {
                    self?.isLandscapeLeft = (UIDevice.current.orientation == .landscapeLeft)
                }
            }

        UIDevice.current.beginGeneratingDeviceOrientationNotifications()
    }

    deinit {
        UIDevice.current.endGeneratingDeviceOrientationNotifications()
        cancellable?.cancel()
    }
}
```

このパブリッシャーは、デバイスの向きがlandscapeLeftに変わったときに通知を送ります。その通知を受け取ると、デバイスの向きがlandscapeLeftになっているかどうかを確認し、その結果を`isLandscapeLeft`プロパティにセットします。

これにより、アプリの向きをlandscapeLeftに設定した際に、デバイスもその向きを保持しているかどうかを監視できます。

---

## 👤 ユーザー
*2023/06/21 01:22:18*

以下のコードも混ぜて欲しい

import Combine
import UIKit

// オリエンテーションチェック用のパブリッシャー
class OrientationPublisher: ObservableObject {
    // パブリッシュするオブジェクト
    @Published var isPortrait: Bool = (UIDevice.current.orientation == .portrait)

    var cancellable: AnyCancellable?

    init() {
        // NotificationCenterからデバイスのオリエンテーション変更の通知を受け取る
        cancellable = NotificationCenter.default.publisher(for: UIDevice.orientationDidChangeNotification)
            .sink { [weak self] _ in
                DispatchQueue.main.async {
                    // デバイスの現在のオリエンテーションがポートレートかどうかを確認し、パブリッシュする
                    self?.isPortrait = (UIDevice.current.orientation == .portrait)
                }
            }
        
        UIDevice.current.beginGeneratingDeviceOrientationNotifications()
    }

    deinit {
        UIDevice.current.endGeneratingDeviceOrientationNotifications()
        cancellable?.cancel()
    }
}

---

## 🤖 アシスタント
*2023/06/21 01:22:53*

あなたが提供したコードと新たに要求されたランドスケープレフトの確認を一緒にすると、以下のようになります：

```swift
import Combine
import UIKit

class OrientationPublisher: ObservableObject {
    @Published var isPortrait: Bool = (UIDevice.current.orientation == .portrait)
    @Published var isLandscapeLeft: Bool = (UIDevice.current.orientation == .landscapeLeft)

    var cancellable: AnyCancellable?

    init() {
        cancellable = NotificationCenter.default.publisher(for: UIDevice.orientationDidChangeNotification)
            .sink { [weak self] _ in
                DispatchQueue.main.async {
                    self?.isPortrait = (UIDevice.current.orientation == .portrait)
                    self?.isLandscapeLeft = (UIDevice.current.orientation == .landscapeLeft)
                }
            }

        UIDevice.current.beginGeneratingDeviceOrientationNotifications()
    }

    deinit {
        UIDevice.current.endGeneratingDeviceOrientationNotifications()
        cancellable?.cancel()
    }
}
```

この修正により、OrientationPublisherは現在のデバイスの向きがポートレートかランドスケープレフトかどうかを同時に監視します。そしてそれぞれの状態を、isPortraitとisLandscapeLeftという2つの@Publishedプロパティで公開します。

これにより、あなたのアプリケーションはデバイスの向きがポートレートかランドスケープレフトに変わるたびに更新される、2つの真偽値を持つことができます。

---

## 👤 ユーザー
*2023/06/21 01:27:12*

どうして、DispatchQueue.main.async { 囲っているのか、.sink { [weak self] _ in の_で省略されている引数は使わないのか？

---

## 🤖 アシスタント
*2023/06/21 01:28:07*

まず、`DispatchQueue.main.async { }` で囲む理由について説明します。これは、UIを更新するコードは必ずメインスレッド上で実行しなければならないというiOSの制約によるものです。デバイスのオリエンテーションが変更された時に通知を受け取ると、その通知を処理するコードがバックグラウンドスレッド上で実行される可能性があります。しかし、`@Published` プロパティの更新はUIの変更を引き起こす可能性があるため、これをメインスレッドで行う必要があります。

次に、`.sink { [weak self] _ in` の `_` について説明します。この `_` は、このクロージャが引数を受け取ることを示していますが、その引数をクロージャの中で使わないという意味です。つまり、この `_` は "我々はこの引数を無視します" という意味になります。

ここでは、`NotificationCenter.default.publisher(for: UIDevice.orientationDidChangeNotification)` がオブザーバブルで、`.sink`メソッドを使ってその通知を購読しています。その通知の本文（`Notification`オブジェクト）は引数として渡されますが、このクロージャではそれを使う必要はありません。なぜなら、デバイスの現在のオリエンテーションは`UIDevice.current.orientation`から直接取得できるからです。そのため、引数を `_` として省略しています。

`[weak self]` は、メモリリークを防ぐためのものです。クロージャが `self` を強く参照すると、それが `OrientationPublisher` のインスタンスを強く保持し、メモリリークを引き起こす可能性があります。そのため、ここでは `self` を弱く参照（`weak`）しています。

---

## 👤 ユーザー
*2023/06/21 01:29:19*

ちになみに現在のUIInterfaceOrientationは取得可能なのか？

---
