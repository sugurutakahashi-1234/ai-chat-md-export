# SwiftUI UIHostingController

日付: 2023-05-23

---

## 👤 ユーザー
*2023/5/23 11:42:35*

SwiftUIでUIHostingControllerを継承したViewを表示する方法をおしえてほしい

---

## 🤖 アシスタント
*2023/5/23 11:42:58*

`UIHostingController`を継承することにより、SwiftUI ViewをUIKit環境で扱うことができます。以下に基本的な使い方を示します：

1. SwiftUIのビューを作成します。例として以下の`ExampleView`を使用します。

```swift
import SwiftUI

struct ExampleView: View {
    var body: some View {
        Text("Hello, SwiftUI!")
    }
}
```

2. 次に、`UIHostingController`を継承したカスタムクラスを作成します。以下の`ExampleViewController`がその例です。

```swift
import SwiftUI

class ExampleViewController: UIHostingController<ExampleView> {
    required init?(coder: NSCoder) {
        super.init(coder: coder, rootView: ExampleView())
    }
}
```

3. そして、このカスタムクラス`ExampleViewController`をStoryboardやコード上で使用します。Storyboardを使用する場合、対象のViewControllerのCustom Classに`ExampleViewController`を設定します。

以上のステップにより、`UIHostingController`を継承した`ExampleViewController`でSwiftUIのViewを表示できます。

---

## 👤 ユーザー
*2023/5/23 11:43:19*

ExampleViewController をせいせいするところもおしえてほしい

---

## 🤖 アシスタント
*2023/5/23 11:43:51*

`ExampleViewController`を生成するには、基本的には他の任意の`UIViewController`と同様に生成できます。ただし、`UIHostingController`の場合、初期化時に`rootView`として表示したいSwiftUIの`View`を指定する必要があります。

以下に`ExampleViewController`の生成と表示の一例をコード上で示します。これは、ある`UIViewController`から`ExampleViewController`へ遷移する場合の一例です：

```swift
import UIKit
import SwiftUI

class SomeViewController: UIViewController {
    // Some action (like button press) which results in transitioning to ExampleViewController
    @IBAction func someAction(_ sender: Any) {
        let exampleView = ExampleView() // Initialize your SwiftUI view
        let exampleViewController = ExampleViewController(rootView: exampleView) // Initialize your custom UIHostingController
        
        // Now you can present it as any other UIViewController
        present(exampleViewController, animated: true, completion: nil)
    }
}
```

このコードは、`SomeViewController`の一部で、特定のアクション（たとえば、ボタンを押す）が発生したときに`ExampleViewController`へ遷移します。SwiftUIの`View`を作成し、それを引数として`ExampleViewController`を初期化します。最後に、`ExampleViewController`を現在の`ViewController`からモーダル表示します。

ただし、この遷移スタイルはあくまで一例です。`ExampleViewController`の表示方法は、アプリの要件や設計によります。ナビゲーションスタックにプッシュすることも、`UIView`の子として追加することも、その他の方法で表示することも可能です。

---

## 👤 ユーザー
*2023/5/23 11:44:26*

ごめん、UIViewController で画面遷移をしたくなくて、SwiftUIのNavigationViewを使って遷移させたいんだ

---

## 🤖 アシスタント
*2023/5/23 11:45:00*

SwiftUIの`NavigationView`を使用して`UIHostingController`を継承したViewに遷移する方法は、`NavigationView`と`NavigationLink`を使用するだけです。以下に、`ExampleViewController`を使用してその方法を示します：

まず、`UIHostingController`を継承したカスタムクラス`ExampleViewController`を作成します。これは先ほどと同じです。

```swift
import SwiftUI

class ExampleViewController: UIHostingController<ExampleView> {
    required init?(coder: NSCoder) {
        super.init(coder: coder, rootView: ExampleView())
    }
}
```

次に、遷移の起点となるSwiftUI Viewを定義します。この例では、`StartView`という新しいViewを作成します。

```swift
struct StartView: View {
    var body: some View {
        NavigationView {
            NavigationLink(destination: ExampleView()) {
                Text("Navigate to ExampleView")
            }
        }
    }
}
```

この`StartView`は、テキストをクリックすると`ExampleView`に遷移する`NavigationLink`を含む`NavigationView`を作成します。この`ExampleView`は実際には`ExampleViewController`の`rootView`として使用されます。

これで、SwiftUIの`NavigationView`を使用して`ExampleViewController`を継承したView（この場合は`ExampleView`）に遷移することができます。

SwiftUIの`NavigationView`はUIKitの`UINavigationController`に相当しますが、SwiftUIの環境内で完全に動作します。したがって、この方法を使用する場合、`UIViewController`を直接操作する必要はありません。

---

## 👤 ユーザー
*2023/5/23 11:45:30*

となるとExampleViewControllerは不要なのでは？

---

## 🤖 アシスタント
*2023/5/23 11:45:57*

おっしゃる通りです、申し訳ありません。ご指摘の通り、SwiftUIの`NavigationView`と`NavigationLink`を使って全てSwiftUIのView間での画面遷移を行う場合、`UIHostingController`のサブクラスを作成する必要はありません。

UIHostingControllerやそのサブクラスは主にSwiftUIのViewをUIKitの世界で表示するために使用されます。もしご自身のアプリが全てSwiftUIで書かれていて、UIKitと混在させる必要がないのであれば、それらは必要ありません。

SwiftUIの`NavigationView`と`NavigationLink`を使用して画面遷移する場合は以下のようになります：

```swift
struct ContentView: View {
    var body: some View {
        NavigationView {
            NavigationLink(destination: ExampleView()) {
                Text("Navigate to ExampleView")
            }
        }
    }
}

struct ExampleView: View {
    var body: some View {
        Text("Hello, SwiftUI!")
    }
}
```

このコードは、"Navigate to ExampleView"というテキストをタップすると`ExampleView`に遷移します。SwiftUIの`NavigationView`は、画面遷移を行うためのコンテナを提供し、`NavigationLink`は遷移の起点と終点をつなげる役割を果たします。

---

## 👤 ユーザー
*2023/5/23 11:46:23*

UIHostingController を使う理由は override var supportedInterfaceOrientations: UIInterfaceOrientationMask を使いたいためなんだ。もし、これをしなくても縦画面と横画面の制御ができるのであればUIHostingControllerを使いたくない

---

## 🤖 アシスタント
*2023/5/23 11:47:08*

SwiftUIでは、UIKitで利用できる`supportedInterfaceOrientations`と同等の機能は直接提供されていませんが、異なるアプローチで同様の機能を達成することが可能です。

縦向きまたは横向きに固定する方法の一つとして、デバイスの向きを検出し、その向きに応じてビューを変更または回転させる方法があります。SwiftUIの`@Environment`プロパティラッパーを使用してデバイスの向きを取得できます。

以下にその一例を示します：

```swift
import SwiftUI

struct ContentView: View {
    @Environment(\.verticalSizeClass) var verticalSizeClass
    @Environment(\.horizontalSizeClass) var horizontalSizeClass

    var body: some View {
        Group {
            if verticalSizeClass == .regular && horizontalSizeClass == .compact {
                // This is a portrait orientation
                Text("Portrait orientation")
            } else {
                // This is a landscape orientation
                Text("Landscape orientation")
            }
        }
    }
}
```

ただし、この方法では画面の向きを強制的に制御することはできず、向きに応じてビューを適応的にレンダリングすることができます。

もし縦向きまたは横向きを強制したい場合、特定の向きをサポートしないようにプロジェクト設定を変更することができます。これは、アプリの `.plist` ファイルまたはプロジェクト設定の "Device Orientation" セクションで設定できます。

もし特定のビューだけで向きを制御したいのであれば、`UIHostingController`を使用し、そのサブクラスで`supportedInterfaceOrientations`をオーバーライドするのが最善の方法となります。これは、UIKitが提供する画面向きの制御はSwiftUIではまだ直接提供されていないためです。

---

## 👤 ユーザー
*2023/5/23 11:47:50*

デバイスの向きを検出するのではなくて、事前にViewModel側に縦向きか横向きの情報を設定させて次にfull screen coverで遷移する先を横画面か縦画面かをきめたいんだ

---

## 🤖 アシスタント
*2023/5/23 11:48:37*

SwiftUI で特定の画面の向きを強制的に変更する直接的な方法はありませんが、この要件を実現するために、現時点では、まだ `UIHostingController` のサブクラスを使って `supportedInterfaceOrientations` をオーバーライドすることが最善の方法となります。

まず、縦向きと横向きそれぞれ用の `UIHostingController` のサブクラスを作ります：

```swift
class PortraitHostingController<Content>: UIHostingController<Content> where Content: View {
    override var supportedInterfaceOrientations: UIInterfaceOrientationMask {
        return .portrait
    }
}

class LandscapeHostingController<Content>: UIHostingController<Content> where Content: View {
    override var supportedInterfaceOrientations: UIInterfaceOrientationMask {
        return .landscape
    }
}
```

それから ViewModel を使って、どの向きで表示させるかを事前に設定します：

```swift
class ViewModel: ObservableObject {
    @Published var isLandscape: Bool = false
}
```

そして、次の画面を `fullScreenCover` で表示するときに、ViewModel の `isLandscape` プロパティに基づいて `UIHostingController` のサブクラスを選びます：

```swift
struct ContentView: View {
    @StateObject var viewModel = ViewModel()

    var body: some View {
        Text("Hello, World!")
            .fullScreenCover(isPresented: $viewModel.isLandscape) {
                if viewModel.isLandscape {
                    LandscapeHostingController(rootView: DestinationView())
                } else {
                    PortraitHostingController(rootView: DestinationView())
                }
            }
    }
}

struct DestinationView: View {
    var body: some View {
        Text("Destination")
    }
}
```

ただし、この方法では `UIHostingController` のサブクラスを SwiftUI の View として使っていますが、これは本来の使い方ではなく、また SwiftUI はこれをサポートしていないため、期待する動作をするとは限らないことに注意が必要です。このため、可能であれば、各画面のレイアウトやデザインを、それぞれが横向きでも縦向きでも適切に表示されるように設計することをお勧めします。

---

## 👤 ユーザー
*2023/5/23 11:49:40*

この記述もっと綺麗にならないの？

class PortraitHostingController&lt;Content&gt;: UIHostingController&lt;Content&gt; where Content: View {
    override var supportedInterfaceOrientations: UIInterfaceOrientationMask {
        return .portrait
    }
}

class LandscapeHostingController&lt;Content&gt;: UIHostingController&lt;Content&gt; where Content: View {
    override var supportedInterfaceOrientations: UIInterfaceOrientationMask {
        return .landscape
    }
}

---

## 🤖 アシスタント
*2023/5/23 11:50:19*

SwiftUIのビューに対して縦向きか横向きの制約を適用するために、それぞれ別の`UIHostingController`のサブクラスを作成するのは少し冗長に感じるかもしれません。同じ効果を得るために、一つの`UIHostingController`サブクラスを作成し、初期化時に方向を指定することもできます。

以下に、このアプローチを示します：

```swift
class CustomHostingController<Content>: UIHostingController<Content> where Content: View {
    private let _supportedInterfaceOrientations: UIInterfaceOrientationMask

    override var supportedInterfaceOrientations: UIInterfaceOrientationMask {
        return _supportedInterfaceOrientations
    }

    init(rootView: Content, supportedInterfaceOrientations: UIInterfaceOrientationMask) {
        self._supportedInterfaceOrientations = supportedInterfaceOrientations
        super.init(rootView: rootView)
    }

    @objc required dynamic init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
```

上記のクラスでは、`supportedInterfaceOrientations`を指定するための新しいパラメータをコンストラクタに追加しています。これにより、このクラスのインスタンスを作成するときに、縦向きか横向きのどちらの向きをサポートするかを指定できます。

```swift
CustomHostingController(rootView: DestinationView(), supportedInterfaceOrientations: .landscape)
```

このようにすることで、一つの`UIHostingController`サブクラスを作成し、その中で異なる向きをサポートできます。これはコードを少し簡潔にすることができます。

---

## 👤 ユーザー
*2023/5/23 11:50:57*

rootView: Content は 特定のViewだと決まっている場合はどうかけばいい？例えばDestinationView()だとして書いて欲しい。

---

## 🤖 アシスタント
*2023/5/23 11:51:25*

`CustomHostingController`が特定のSwiftUIビュー、この場合は`DestinationView`のみを扱うように設定するには、ジェネリック型パラメータ`Content`を削除し、直接`DestinationView`を使うように変更します。

以下にそのような変更を施した`CustomHostingController`クラスを示します：

```swift
class CustomHostingController: UIHostingController<DestinationView> {
    private let _supportedInterfaceOrientations: UIInterfaceOrientationMask

    override var supportedInterfaceOrientations: UIInterfaceOrientationMask {
        return _supportedInterfaceOrientations
    }

    init(supportedInterfaceOrientations: UIInterfaceOrientationMask) {
        self._supportedInterfaceOrientations = supportedInterfaceOrientations
        super.init(rootView: DestinationView())
    }

    @objc required dynamic init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
```

このコードでは、`UIHostingController`のサブクラスは`DestinationView`をルートビューとして使用します。したがって、このクラスのインスタンスを作成するときに、ルートビューを指定する必要はなく、サポートするインターフェースの向きのみを指定すればよいです：

```swift
CustomHostingController(supportedInterfaceOrientations: .landscape)
```

---

## 👤 ユーザー
*2023/5/23 11:52:38*

ありがとう！そしてこれを使って.fullScreenCover で遷移するコードを書いて欲しい

---

## 🤖 アシスタント
*2023/5/23 11:53:27*

`.fullScreenCover`メソッドを使用して、`CustomHostingController`のインスタンスを全画面で表示するコードは次のようになります。

ただし、SwiftUIビューとして`UIHostingController`またはそのサブクラスを直接使用することはできません。そのため、遷移先のビューをカスタムするときは`fullScreenCover`メソッドにSwiftUIのビューを提供する必要があります。

以下に示すように、遷移先として`DestinationView`を直接使用し、ビューが表示されたときに所望の画面向きを設定する方法があります。ただし、これは画面の向きを強制的に変更するものではなく、向きが変更されたときにビューが正しく動作することを保証するためのものです。

```swift
struct ContentView: View {
    @StateObject var viewModel = ViewModel()
    @State private var isPresented = false

    var body: some View {
        Text("Hello, World!")
            .onTapGesture {
                self.isPresented = true
                if viewModel.isLandscape {
                    UIDevice.current.setValue(UIInterfaceOrientation.landscapeLeft.rawValue, forKey: "orientation")
                } else {
                    UIDevice.current.setValue(UIInterfaceOrientation.portrait.rawValue, forKey: "orientation")
                }
            }
            .fullScreenCover(isPresented: $isPresented) {
                DestinationView()
            }
    }
}

struct DestinationView: View {
    var body: some View {
        Text("Destination")
    }
}

class ViewModel: ObservableObject {
    @Published var isLandscape: Bool = false
}
```

上記の例では、タップジェスチャーが`isPresented`を`true`に設定し、ViewModelの`isLandscape`プロパティに基づいてデバイスの向きを設定します。これにより、`fullScreenCover`メソッドが`DestinationView`を表示するときに、適切な向きが選択されます。

---
