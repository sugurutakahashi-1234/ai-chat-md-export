# setNeedsUpdateOfSupportedInterfaceOrientations() 使用法

Date: 2023-07-01

---

## 👤 User
*2023-07-01 22:54:28*

setNeedsUpdateOfSupportedInterfaceOrientations() の使い方を教えて欲しい

---

## 🤖 Assistant
*2023-07-01 22:55:06*

`setNeedsUpdateOfSupportedInterfaceOrientations()`は、現在の設定とは異なる方向をサポートするようにユーザーインターフェースを更新する必要があることをシステムに通知するためのメソッドです。このメソッドはUIKitのUIViewControllerクラスの一部で、SwiftとObjective-Cの両方で利用できます。

利用方法は非常にシンプルで、次のように使います:

```swift
self.setNeedsUpdateOfSupportedInterfaceOrientations()
```

このメソッドを呼び出すと、システムは`supportedInterfaceOrientations`と`preferredInterfaceOrientationForPresentation`の各メソッドを呼び出して、サポートされるインターフェースの方向と推奨されるプレゼンテーションの方向を更新します。したがって、これらのメソッドを適切にオーバーライドして新しい方向設定を提供することが重要です。

たとえば、ある状況でのみアプリがランドスケープモードをサポートするようにすることができます：

```swift
override var supportedInterfaceOrientations: UIInterfaceOrientationMask {
    if someCondition {
        return .landscape
    } else {
        return .portrait
    }
}

// someConditionが変わったときに呼び出す
self.setNeedsUpdateOfSupportedInterfaceOrientations()
```

ここで`someCondition`は、ランドスケープモードをサポートすべきかどうかを決定するためのあなたの条件です。

ただし、`setNeedsUpdateOfSupportedInterfaceOrientations()`はシステムが新しい方向をすぐにクエリすることを保証するものではないことに注意してください。システムは、方向の変更が適切なタイミングで行われるようにこれをスケジュールします。また、方向の変更は、デバイスの物理的な向きと現在のインターフェースの向きが一致しない場合、またはアプリが新しい向きをサポートしない場合には発生しないことにも注意してください。

---

## 👤 User
*2023-07-01 22:55:19*

SwiftUIで使う時はどうすればいいのかな？

---

## 🤖 Assistant
*2023-07-01 22:55:55*

SwiftUIでは、直接的な`setNeedsUpdateOfSupportedInterfaceOrientations()`メソッドはありません。ただし、SwiftUIアプリケーションのインターフェース方向を制御するためには、従来のUIKitのビューコントローラーと混合することで達成することができます。

以下にその方法を示します：

まず、以下のようなカスタムUIViewControllerを作成します：

```swift
import SwiftUI

class OrientationLockViewController: UIViewController {
    
    var orientationLock = UIInterfaceOrientationMask.portrait
    
    override var supportedInterfaceOrientations: UIInterfaceOrientationMask {
        return self.orientationLock
    }
    
}
```

次に、このカスタムUIViewControllerを含むSwiftUIビューを作成します：

```swift
struct ContentView: View {
    
    @State private var orientationLock = UIInterfaceOrientationMask.portrait
    
    var body: some View {
        VStack {
            // あなたのビューの内容
        }
        .background(
            UIViewControllerRepresentableAdaptor(
                OrientationLockViewControllerRepresentable(
                    orientationLock: $orientationLock
                )
            )
        )
    }
    
}

struct OrientationLockViewControllerRepresentable: UIViewControllerRepresentable {
    
    @Binding var orientationLock: UIInterfaceOrientationMask
    
    func makeUIViewController(context: Context) -> OrientationLockViewController {
        let viewController = OrientationLockViewController()
        viewController.orientationLock = orientationLock
        return viewController
    }
    
    func updateUIViewController(_ viewController: OrientationLockViewController, context: Context) {
        viewController.orientationLock = orientationLock
    }
    
}
```

このようにすると、`orientationLock`プロパティを使ってインターフェースの方向を制御することができます。このプロパティを更新すれば、ビューコントローラーの`supportedInterfaceOrientations`も更新され、その結果としてインターフェースの方向が更新されます。

ただし、注意点としてこの方法は直感的なものではなく、またSwiftUIの状態管理の考え方とは完全に一致していません。最終的にAppleがSwiftUIにもインターフェース方向の制御をネイティブでサポートすることを期待したいところです。

---

## 👤 User
*2023-07-01 22:57:27*

画面1ではportrait 画面2では landscapeRight となるように制御したい場合はどうすればいいの？

---

## 🤖 Assistant
*2023-07-01 22:58:08*

あなたが望むように、各画面で異なる方向を指定するためには、以下のようにカスタムビューコントローラーとSwiftUIビューを作成し、各ビューで方向を設定します。

まず、以下のようなカスタムUIViewControllerを作成します：

```swift
import SwiftUI

class OrientationLockViewController: UIViewController {
    
    var orientationLock = UIInterfaceOrientationMask.portrait
    
    override var supportedInterfaceOrientations: UIInterfaceOrientationMask {
        return self.orientationLock
    }
    
}
```

次に、各画面で異なる方向を指定するためのSwiftUIビューを作成します：

```swift
struct PortraitView: View {
    var body: some View {
        VStack {
            // あなたのビューの内容
            NavigationLink("Go to Landscape View", destination: LandscapeView())
        }
        .background(
            UIViewControllerRepresentableAdaptor(
                OrientationLockViewControllerRepresentable(
                    orientationLock: .portrait
                )
            )
        )
    }
}

struct LandscapeView: View {
    var body: some View {
        VStack {
            // あなたのビューの内容
            NavigationLink("Go to Portrait View", destination: PortraitView())
        }
        .background(
            UIViewControllerRepresentableAdaptor(
                OrientationLockViewControllerRepresentable(
                    orientationLock: .landscapeRight
                )
            )
        )
    }
}

struct OrientationLockViewControllerRepresentable: UIViewControllerRepresentable {
    
    var orientationLock: UIInterfaceOrientationMask
    
    func makeUIViewController(context: Context) -> OrientationLockViewController {
        let viewController = OrientationLockViewController()
        viewController.orientationLock = orientationLock
        return viewController
    }
    
    func updateUIViewController(_ viewController: OrientationLockViewController, context: Context) {
        viewController.orientationLock = orientationLock
    }
}
```

ここでは、`PortraitView`と`LandscapeView`という二つのビューを作成し、それぞれがポートレイトとランドスケープに固定されています。`NavigationLink`を使用してビュー間を移動します。各ビューが表示されるときに、それぞれに対応するビューコントローラーが作成され、そこで方向が設定されます。

ただし、注意点としてこの方法は直感的なものではなく、またSwiftUIの状態管理の考え方とは完全に一致していません。最終的にAppleがSwiftUIにもインターフェース方向の制御をネイティブでサポートすることを期待したいところです。

---

## 👤 User
*2023-07-01 22:58:56*

画面3ではPortraitかlandscapeRight かどちらかを選択できるようにしたい

---

## 🤖 Assistant
*2023-07-01 22:59:42*

異なる画面で異なる方向制約を設定するためには、カスタムUIViewControllerとSwiftUIビューを作成し、それぞれの画面でそれに対応する方向を設定します。そのため、画面3ではPortraitとLandscapeRightのどちらもサポートするように設定することができます。

まず、以下のようなカスタムUIViewControllerを作成します：

```swift
import SwiftUI

class OrientationLockViewController: UIViewController {
    
    var orientationLock = UIInterfaceOrientationMask.portrait
    
    override var supportedInterfaceOrientations: UIInterfaceOrientationMask {
        return self.orientationLock
    }
}
```

次に、各画面で異なる方向を指定するためのSwiftUIビューを作成します：

```swift
struct PortraitView: View {
    var body: some View {
        VStack {
            // あなたのビューの内容
            NavigationLink("Go to Landscape View", destination: LandscapeView())
        }
        .background(
            UIViewControllerRepresentableAdaptor(
                OrientationLockViewControllerRepresentable(
                    orientationLock: .portrait
                )
            )
        )
    }
}

struct LandscapeView: View {
    var body: some View {
        VStack {
            // あなたのビューの内容
            NavigationLink("Go to Multi-orientation View", destination: MultiOrientationView())
        }
        .background(
            UIViewControllerRepresentableAdaptor(
                OrientationLockViewControllerRepresentable(
                    orientationLock: .landscapeRight
                )
            )
        )
    }
}

struct MultiOrientationView: View {
    var body: some View {
        VStack {
            // あなたのビューの内容
            NavigationLink("Go to Portrait View", destination: PortraitView())
        }
        .background(
            UIViewControllerRepresentableAdaptor(
                OrientationLockViewControllerRepresentable(
                    orientationLock: [.portrait, .landscapeRight]
                )
            )
        )
    }
}

struct OrientationLockViewControllerRepresentable: UIViewControllerRepresentable {
    
    var orientationLock: UIInterfaceOrientationMask
    
    func makeUIViewController(context: Context) -> OrientationLockViewController {
        let viewController = OrientationLockViewController()
        viewController.orientationLock = orientationLock
        return viewController
    }
    
    func updateUIViewController(_ viewController: OrientationLockViewController, context: Context) {
        viewController.orientationLock = orientationLock
    }
}
```

このようにして、`PortraitView`, `LandscapeView`, `MultiOrientationView`の3つのビューを作成し、それぞれに対応する方向を設定します。そして、`NavigationLink`を使用してビュー間で移動します。各ビューが表示されるときに、それぞれに対応するビューコントローラーが作成され、その中で方向が設定されます。

ただし、注意点としてこの方法は直感的なものではなく、またSwiftUIの状態管理の考え方とは完全に一致していません。最終的にAppleがSwiftUIにもインターフェース方向の制御をネイティブでサポートすることを期待したいところです。

---

## 👤 User
*2023-07-01 23:00:28*

contentViewからPortraitView、LandscapeView、MultiOrientationView にそれぞれ遷移するViewを作って欲しい。またMultiOrientationViewへどちらに向けるかはcontentViewで設定できるようにしたい

---

## 🤖 Assistant
*2023-07-01 23:01:15*

以下のように`ContentView`から各画面に遷移するビューを作成します。また、`MultiOrientationView`への遷移時に方向を選択することができます。

まず、以下のようにカスタムUIViewControllerを作成します：

```swift
import SwiftUI

class OrientationLockViewController: UIViewController {
    
    var orientationLock = UIInterfaceOrientationMask.portrait
    
    override var supportedInterfaceOrientations: UIInterfaceOrientationMask {
        return self.orientationLock
    }
}
```

次に、各画面で異なる方向を指定するためのSwiftUIビューを作成します：

```swift
struct ContentView: View {
    @State private var multiOrientation: UIInterfaceOrientationMask = .portrait

    var body: some View {
        VStack {
            NavigationLink("Go to Portrait View", destination: PortraitView())
            
            NavigationLink("Go to Landscape View", destination: LandscapeView())
            
            Picker("Multi-orientation:", selection: $multiOrientation) {
                Text("Portrait").tag(UIInterfaceOrientationMask.portrait)
                Text("Landscape Right").tag(UIInterfaceOrientationMask.landscapeRight)
            }.pickerStyle(SegmentedPickerStyle())

            NavigationLink("Go to Multi-orientation View", destination: MultiOrientationView(orientationLock: multiOrientation))
        }
    }
}

struct PortraitView: View {
    var body: some View {
        VStack {
            // あなたのビューの内容
        }
        .background(
            UIViewControllerRepresentableAdaptor(
                OrientationLockViewControllerRepresentable(
                    orientationLock: .portrait
                )
            )
        )
    }
}

struct LandscapeView: View {
    var body: some View {
        VStack {
            // あなたのビューの内容
        }
        .background(
            UIViewControllerRepresentableAdaptor(
                OrientationLockViewControllerRepresentable(
                    orientationLock: .landscapeRight
                )
            )
        )
    }
}

struct MultiOrientationView: View {
    let orientationLock: UIInterfaceOrientationMask

    var body: some View {
        VStack {
            // あなたのビューの内容
        }
        .background(
            UIViewControllerRepresentableAdaptor(
                OrientationLockViewControllerRepresentable(
                    orientationLock: orientationLock
                )
            )
        )
    }
}

struct OrientationLockViewControllerRepresentable: UIViewControllerRepresentable {
    
    var orientationLock: UIInterfaceOrientationMask
    
    func makeUIViewController(context: Context) -> OrientationLockViewController {
        let viewController = OrientationLockViewController()
        viewController.orientationLock = orientationLock
        return viewController
    }
    
    func updateUIViewController(_ viewController: OrientationLockViewController, context: Context) {
        viewController.orientationLock = orientationLock
    }
}
```

`ContentView`では、`multiOrientation`という状態を定義し、これをピッカーで選択できるようにします。そして、この値を`MultiOrientationView`に渡します。これにより、`MultiOrientationView`への遷移前に方向を選択することができます。

---

## 👤 User
*2023-07-01 23:01:48*

ContentViewModelをつくって、@published multiOrientation としてほしい

---

## 🤖 Assistant
*2023-07-01 23:02:29*

以下に、`ContentView`で使用するための`ContentViewModel`を作成し、`@Published`プロパティラッパーを使用して`multiOrientation`を公開する例を示します。

```swift
import SwiftUI
import Combine

class ContentViewModel: ObservableObject {
    @Published var multiOrientation: UIInterfaceOrientationMask = .portrait
}

struct ContentView: View {
    @StateObject var viewModel = ContentViewModel()

    var body: some View {
        VStack {
            NavigationLink("Go to Portrait View", destination: PortraitView())
            
            NavigationLink("Go to Landscape View", destination: LandscapeView())
            
            Picker("Multi-orientation:", selection: $viewModel.multiOrientation) {
                Text("Portrait").tag(UIInterfaceOrientationMask.portrait)
                Text("Landscape Right").tag(UIInterfaceOrientationMask.landscapeRight)
            }.pickerStyle(SegmentedPickerStyle())

            NavigationLink("Go to Multi-orientation View", destination: MultiOrientationView(orientationLock: viewModel.multiOrientation))
        }
    }
}

struct PortraitView: View {
    var body: some View {
        VStack {
            // あなたのビューの内容
        }
        .background(
            UIViewControllerRepresentableAdaptor(
                OrientationLockViewControllerRepresentable(
                    orientationLock: .portrait
                )
            )
        )
    }
}

struct LandscapeView: View {
    var body: some View {
        VStack {
            // あなたのビューの内容
        }
        .background(
            UIViewControllerRepresentableAdaptor(
                OrientationLockViewControllerRepresentable(
                    orientationLock: .landscapeRight
                )
            )
        )
    }
}

struct MultiOrientationView: View {
    let orientationLock: UIInterfaceOrientationMask

    var body: some View {
        VStack {
            // あなたのビューの内容
        }
        .background(
            UIViewControllerRepresentableAdaptor(
                OrientationLockViewControllerRepresentable(
                    orientationLock: orientationLock
                )
            )
        )
    }
}

struct OrientationLockViewControllerRepresentable: UIViewControllerRepresentable {
    
    var orientationLock: UIInterfaceOrientationMask
    
    func makeUIViewController(context: Context) -> OrientationLockViewController {
        let viewController = OrientationLockViewController()
        viewController.orientationLock = orientationLock
        return viewController
    }
    
    func updateUIViewController(_ viewController: OrientationLockViewController, context: Context) {
        viewController.orientationLock = orientationLock
    }
}
```

この例では、`ContentView`内で`ContentViewModel`のインスタンスを`@StateObject`として保持します。この`viewModel`の`multiOrientation`プロパティは、ピッカーの選択値としてバインドされ、また`MultiOrientationView`への遷移時に方向の設定として使用されます。

---

## 👤 User
*2023-07-01 23:03:00*

PortraitView、LandscapeView、MultiOrientationView の画面では中央に自分のView名を宣言してもいいかもしれません。

---

## 🤖 Assistant
*2023-07-01 23:03:37*

それぞれのViewの中央にそのViewの名前を表示するには、各ビューのVStack内にTextウィジェットを追加します。以下にその実装例を示します：

```swift
import SwiftUI
import Combine

class ContentViewModel: ObservableObject {
    @Published var multiOrientation: UIInterfaceOrientationMask = .portrait
}

struct ContentView: View {
    @StateObject var viewModel = ContentViewModel()

    var body: some View {
        VStack {
            NavigationLink("Go to Portrait View", destination: PortraitView())
            
            NavigationLink("Go to Landscape View", destination: LandscapeView())
            
            Picker("Multi-orientation:", selection: $viewModel.multiOrientation) {
                Text("Portrait").tag(UIInterfaceOrientationMask.portrait)
                Text("Landscape Right").tag(UIInterfaceOrientationMask.landscapeRight)
            }.pickerStyle(SegmentedPickerStyle())

            NavigationLink("Go to Multi-orientation View", destination: MultiOrientationView(orientationLock: viewModel.multiOrientation))
        }
    }
}

struct PortraitView: View {
    var body: some View {
        VStack {
            Text("This is Portrait View") // Add the view name here
        }
        .background(
            UIViewControllerRepresentableAdaptor(
                OrientationLockViewControllerRepresentable(
                    orientationLock: .portrait
                )
            )
        )
    }
}

struct LandscapeView: View {
    var body: some View {
        VStack {
            Text("This is Landscape View") // Add the view name here
        }
        .background(
            UIViewControllerRepresentableAdaptor(
                OrientationLockViewControllerRepresentable(
                    orientationLock: .landscapeRight
                )
            )
        )
    }
}

struct MultiOrientationView: View {
    let orientationLock: UIInterfaceOrientationMask

    var body: some View {
        VStack {
            Text("This is Multi-orientation View") // Add the view name here
        }
        .background(
            UIViewControllerRepresentableAdaptor(
                OrientationLockViewControllerRepresentable(
                    orientationLock: orientationLock
                )
            )
        )
    }
}

struct OrientationLockViewControllerRepresentable: UIViewControllerRepresentable {
    
    var orientationLock: UIInterfaceOrientationMask
    
    func makeUIViewController(context: Context) -> OrientationLockViewController {
        let viewController = OrientationLockViewController()
        viewController.orientationLock = orientationLock
        return viewController
    }
    
    func updateUIViewController(_ viewController: OrientationLockViewController, context: Context) {
        viewController.orientationLock = orientationLock
    }
}
```

この変更により、各Viewが表示されたときに、そのViewの名前が中央に表示されます。

---

## 👤 User
*2023-07-01 23:03:41*

以下のようなenumを設定してそれでおこなってほしい。

public enum AppUIInterfaceOrientation {
    case portrait
    case landscapeRight
}

---

## 🤖 Assistant
*2023-07-01 23:04:25*

指定した`enum`を使用して指定するようにすることも可能です。以下にその実装を示します：

```swift
import SwiftUI
import Combine

public enum AppUIInterfaceOrientation {
    case portrait
    case landscapeRight
}

class ContentViewModel: ObservableObject {
    @Published var multiOrientation: AppUIInterfaceOrientation = .portrait
}

struct ContentView: View {
    @StateObject var viewModel = ContentViewModel()

    var body: some View {
        VStack {
            NavigationLink("Go to Portrait View", destination: PortraitView())
            
            NavigationLink("Go to Landscape View", destination: LandscapeView())
            
            Picker("Multi-orientation:", selection: $viewModel.multiOrientation) {
                Text("Portrait").tag(AppUIInterfaceOrientation.portrait)
                Text("Landscape Right").tag(AppUIInterfaceOrientation.landscapeRight)
            }.pickerStyle(SegmentedPickerStyle())

            NavigationLink("Go to Multi-orientation View", destination: MultiOrientationView(orientationLock: viewModel.multiOrientation))
        }
    }
}

struct PortraitView: View {
    var body: some View {
        VStack {
            Text("This is Portrait View") // Add the view name here
        }
        .background(
            UIViewControllerRepresentableAdaptor(
                OrientationLockViewControllerRepresentable(
                    orientationLock: .portrait
                )
            )
        )
    }
}

struct LandscapeView: View {
    var body: some View {
        VStack {
            Text("This is Landscape View") // Add the view name here
        }
        .background(
            UIViewControllerRepresentableAdaptor(
                OrientationLockViewControllerRepresentable(
                    orientationLock: .landscapeRight
                )
            )
        )
    }
}

struct MultiOrientationView: View {
    let orientationLock: AppUIInterfaceOrientation

    var body: some View {
        VStack {
            Text("This is Multi-orientation View") // Add the view name here
        }
        .background(
            UIViewControllerRepresentableAdaptor(
                OrientationLockViewControllerRepresentable(
                    orientationLock: orientationLock
                )
            )
        )
    }
}

struct OrientationLockViewControllerRepresentable: UIViewControllerRepresentable {
    
    var orientationLock: AppUIInterfaceOrientation
    
    func makeUIViewController(context: Context) -> OrientationLockViewController {
        let viewController = OrientationLockViewController()
        switch orientationLock {
        case .portrait:
            viewController.orientationLock = .portrait
        case .landscapeRight:
            viewController.orientationLock = .landscapeRight
        }
        return viewController
    }
    
    func updateUIViewController(_ viewController: OrientationLockViewController, context: Context) {
        switch orientationLock {
        case .portrait:
            viewController.orientationLock = .portrait
        case .landscapeRight:
            viewController.orientationLock = .landscapeRight
        }
    }
}
```

この例では`ContentViewModel`の`multiOrientation`が`AppUIInterfaceOrientation`型となっています。そして、各ビューの背景として設定される`UIViewControllerRepresentable`の`orientationLock`も同じく`AppUIInterfaceOrientation`型となっています。それにより、ビューコントローラの`supportedInterfaceOrientations`が設定される際に適切な値に変換されます。

---

## 👤 User
*2023-07-01 23:05:50*

MultiOrientationView について、この画面から他の画面に行くときは portrait に戻して欲しい。それはどうすればいいのかな？

---

## 🤖 Assistant
*2023-07-01 23:06:25*

`MultiOrientationView`から他のビューに移動する際に画面の方向をポートレートに戻すには、`.onDisappear`モディファイアを使います。このモディファイアを使用して、ビューが消える際（つまり他のビューに遷移する際）に実行する処理を定義できます。

以下のように`MultiOrientationView`に`.onDisappear`を追加します：

```swift
struct MultiOrientationView: View {
    @EnvironmentObject var viewModel: ContentViewModel

    var body: some View {
        VStack {
            Text("This is Multi-orientation View") // Add the view name here
        }
        .background(
            UIViewControllerRepresentableAdaptor(
                OrientationLockViewControllerRepresentable(
                    orientationLock: viewModel.multiOrientation
                )
            )
        )
        .onDisappear {
            viewModel.multiOrientation = .portrait
        }
    }
}
```

上記のコードでは、ビューが非表示になるとき（すなわち、`MultiOrientationView`から別のビューに遷移するとき）に`viewModel.multiOrientation`をポートレートに設定し直します。このようにすることで、`MultiOrientationView`から他のビューに遷移したときには常にポートレート方向に戻るようにできます。

なお、上記のコードでは`viewModel`を`@EnvironmentObject`として取得していますので、`ContentView`の`body`で`.environmentObject(viewModel)`を追加する必要があります。以下にその部分のコードを示します：

```swift
var body: some View {
    VStack {
        NavigationLink("Go to Portrait View", destination: PortraitView())
        
        NavigationLink("Go to Landscape View", destination: LandscapeView())
        
        Picker("Multi-orientation:", selection: $viewModel.multiOrientation) {
            Text("Portrait").tag(AppUIInterfaceOrientation.portrait)
            Text("Landscape Right").tag(AppUIInterfaceOrientation.landscapeRight)
        }.pickerStyle(SegmentedPickerStyle())

        NavigationLink("Go to Multi-orientation View", destination: MultiOrientationView().environmentObject(viewModel))
    }
}
```

---

## 👤 User
*2023-07-01 23:08:48*

@EnvironmentObject ではなくて @StateObject をつかってほしい。それぞれでViewModelを

---

## 🤖 Assistant
*2023-07-01 23:09:17*

もちろんです。それぞれのViewに独自の`@StateObject`を持たせる方法を以下に示します。各Viewで新しい`ContentViewModel`インスタンスを作成します：

```swift
struct MultiOrientationView: View {
    @StateObject var viewModel = ContentViewModel()

    var body: some View {
        VStack {
            Text("This is Multi-orientation View") // Add the view name here
        }
        .background(
            UIViewControllerRepresentableAdaptor(
                OrientationLockViewControllerRepresentable(
                    orientationLock: viewModel.multiOrientation
                )
            )
        )
        .onDisappear {
            viewModel.multiOrientation = .portrait
        }
    }
}
```

同様に、`ContentView`もそれぞれのリンクで新しい`ContentViewModel`を作成します：

```swift
var body: some View {
    VStack {
        NavigationLink("Go to Portrait View", destination: PortraitView())
        
        NavigationLink("Go to Landscape View", destination: LandscapeView())
        
        NavigationLink("Go to Multi-orientation View", destination: MultiOrientationView())
    }
}
```

ただし、この方法では各ビューが自分自身の`ContentViewModel`を持つため、`MultiOrientationView`から他のビューに移動したときにポートレートモードに戻る動作が`ContentView`に影響を与えなくなります。これは各ビューが独自の状態を管理しているためで、ビュー間での状態の共有は行われません。もしビュー間で状態を共有する必要がある場合には、`@EnvironmentObject`や`@ObservedObject`などを使うことを検討してください。

---

## 👤 User
*2023-07-01 23:12:44*

UIViewControllerRepresentableAdaptor ってなに？

---

## 🤖 Assistant
*2023-07-01 23:13:16*

すみません、その情報は誤りでした。私の説明で紹介した`UIViewControllerRepresentableAdaptor`というものは実際には存在しません。SwiftUIでUIKitのViewControllerを使用するには`UIViewControllerRepresentable`プロトコルを使用します。そのプロトコルを採用したカスタムViewを作成することで、UIKitのViewControllerをSwiftUIで使用できます。

以下にそれを用いて具体的なコードを示します：

```swift
struct OrientationLockViewControllerRepresentable: UIViewControllerRepresentable {
    var orientationLock: UIInterfaceOrientationMask

    func makeUIViewController(context: Context) -> UIViewController {
        let viewController = UIViewController()
        viewController.orientationLock = orientationLock
        return viewController
    }

    func updateUIViewController(_ uiViewController: UIViewController, context: Context) {
        uiViewController.orientationLock = orientationLock
    }
}
```

ただし、`UIViewController`にはデフォルトで`orientationLock`プロパティは存在しません。そのため、指定した方向にロックするためのカスタムViewControllerが必要です。そのカスタムViewControllerの定義は以下のようになります：

```swift
class OrientationLockViewController: UIViewController {
    var orientationLock: UIInterfaceOrientationMask = .portrait

    override var supportedInterfaceOrientations: UIInterfaceOrientationMask {
        return orientationLock
    }
}
```

これらのコードを組み合わせることで、指定した方向に画面をロックするためのカスタムViewを作成することができます。また、`UIHostingController`のサブクラスとしてこのカスタムViewControllerを使用することで、SwiftUIのビューを表示しつつ、画面の方向もコントロールすることができます。

---

## 👤 User
*2023-07-01 23:13:38*

使う時はどうすればいいの？

---

## 🤖 Assistant
*2023-07-01 23:14:03*

`UIViewControllerRepresentable`を使う場合、まずはSwiftUIのビュー内で使うことができます。以下に具体的な使い方を示します：

```swift
struct MultiOrientationView: View {
    @StateObject var viewModel = ContentViewModel()

    var body: some View {
        VStack {
            Text("This is Multi-orientation View")
        }
        .background(
            OrientationLockViewControllerRepresentable(orientationLock: viewModel.orientationLock)
        )
        .onDisappear {
            viewModel.orientationLock = .portrait
        }
    }
}
```

この例では`MultiOrientationView`内に`OrientationLockViewControllerRepresentable`を配置しています。このビューが表示されたとき、`OrientationLockViewControllerRepresentable`が作成され、それにより背後の`UIViewController`の`supportedInterfaceOrientations`が制御されます。

その結果、このビューが表示されている間は画面の方向が`viewModel.orientationLock`に従います。また、`.onDisappear`により、ビューが非表示になったときには方向をポートレートに戻します。

ただし、上記のコードでは`UIViewControllerRepresentable`を`.background`でビューに追加していますが、これはビジュアルな要素ではなく画面の方向を制御するためのものです。このように`UIViewControllerRepresentable`は、SwiftUIのビューにUIKitの要素を組み込むために使用できます。

---

## 👤 User
*2023-07-01 23:17:24*

なんかタップできなかった


public enum AppOrientation {
    case portrait
    case landscapeRight
}

class ContentViewModel: ObservableObject {
    @Published var multiOrientation: AppOrientation = .portrait
}

struct SampleOrientationView: View {
    @StateObject var viewModel = ContentViewModel()

    var body: some View {
        VStack {
            NavigationLink("Go to Portrait View", destination: PortraitView())
            
            NavigationLink("Go to Landscape View", destination: LandscapeView())
            
            Picker("Multi-orientation:", selection: $viewModel.multiOrientation) {
                Text("Portrait").tag(AppOrientation.portrait)
                Text("Landscape Right").tag(AppOrientation.landscapeRight)
            }.pickerStyle(SegmentedPickerStyle())

            NavigationLink("Go to Multi-orientation View", destination: MultiOrientationView(orientationLock: viewModel.multiOrientation))
        }
    }
}

struct PortraitView: View {
    var body: some View {
        VStack {
            Text("This is Portrait View")
        }
        .background(
            OrientationLockViewControllerRepresentable(
                orientationLock: .portrait
            )
        )
    }
}

struct LandscapeView: View {
    var body: some View {
        VStack {
            Text("This is Landscape View")
        }
        .background(
            OrientationLockViewControllerRepresentable(
                orientationLock: .landscapeRight
            )
        )
    }
}

struct MultiOrientationView: View {
    let orientationLock: AppOrientation

    var body: some View {
        VStack {
            Text("This is Multi-orientation View")
        }
        .background(
            OrientationLockViewControllerRepresentable(
                orientationLock: orientationLock
            )
        )
    }
}

class OrientationLockViewController: UIViewController {
    
    var orientationLock = UIInterfaceOrientationMask.portrait
    
    override var supportedInterfaceOrientations: UIInterfaceOrientationMask {
        return self.orientationLock
    }
    
}

struct OrientationLockViewControllerRepresentable: UIViewControllerRepresentable {
    
    var orientationLock: AppOrientation
    
    func makeUIViewController(context: Context) -&gt; OrientationLockViewController {
        let viewController = OrientationLockViewController()
        switch orientationLock {
        case .portrait:
            viewController.orientationLock = .portrait
        case .landscapeRight:
            viewController.orientationLock = .landscapeRight
        }
        return viewController
    }
    
    func updateUIViewController(_ viewController: OrientationLockViewController, context: Context) {
        switch orientationLock {
        case .portrait:
            viewController.orientationLock = .portrait
        case .landscapeRight:
            viewController.orientationLock = .landscapeRight
        }
    }
}

---

## 🤖 Assistant
*2023-07-01 23:18:12*

私の誤りで申し訳ありません。上記のコードで画面回転を制御する部分を`background`に追加していますが、それにより画面上の他の要素がタップできなくなってしまいます。

`UIViewControllerRepresentable`を利用して画面の向きを制御するのではなく、`UIHostingController`のサブクラスを作成し、それを起動時のルートビューとする方法があります。

以下にその方法を示します：

まず、以下のように`UIHostingController`のサブクラスを定義します：

```swift
class CustomHostingController<Content>: UIHostingController<Content> where Content: View {
    var orientationLock = UIInterfaceOrientationMask.portrait
    
    override var supportedInterfaceOrientations: UIInterfaceOrientationMask {
        return self.orientationLock
    }
}
```

次に、アプリケーションの起動時にこのカスタムHostingControllerを使ってビューを表示します：

```swift
@main
struct YourApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(ContentViewModel())
        }
    }
}
```

そして、`ContentViewModel`で現在の向きを保存し、それを各ビューから参照して現在の向きを設定します：

```swift
class ContentViewModel: ObservableObject {
    @Published var orientationLock: UIInterfaceOrientationMask = .portrait
}
```

最後に、各ビューの`onAppear`と`onDisappear`で方向を変更します：

```swift
struct ContentView: View {
    @EnvironmentObject var viewModel: ContentViewModel

    var body: some View {
        VStack {
            NavigationLink("Go to Portrait View", destination: PortraitView())
            
            NavigationLink("Go to Landscape View", destination: LandscapeView())
            
            NavigationLink("Go to Multi-orientation View", destination: MultiOrientationView())
        }
    }
}

struct PortraitView: View {
    @EnvironmentObject var viewModel: ContentViewModel

    var body: some View {
        VStack {
            Text("This is Portrait View")
        }
        .onAppear {
            viewModel.orientationLock = .portrait
        }
        .onDisappear {
            viewModel.orientationLock = .allButUpsideDown
        }
    }
}

struct LandscapeView: View {
    @EnvironmentObject var viewModel: ContentViewModel

    var body: some View {
        VStack {
            Text("This is Landscape View")
        }
        .onAppear {
            viewModel.orientationLock = .landscapeRight
        }
        .onDisappear {
            viewModel.orientationLock = .allButUpsideDown
        }
    }
}

struct MultiOrientationView: View {
    @EnvironmentObject var viewModel: ContentViewModel

    var body: some View {
        VStack {
            Text("This is Multi-orientation View")
        }
        .onAppear {
            viewModel.orientationLock = .all
        }
        .onDisappear {
            viewModel.orientationLock = .allButUpsideDown
        }
    }
}
```

これで、各ビューが表示されるときに画面の向きを変更し、ビューが非表示になるときには向きを元に戻すようにすることができます。ただし、この方法では全体で一つの`

---

## 👤 User
*2023-07-01 23:18:39*

単純にNavigationLinkが上手くなってないだけなんじゃないの？

---

## 🤖 Assistant
*2023-07-01 23:19:12*

申し訳ありませんが、SwiftUIの`NavigationLink`が正しく機能しない理由はいくつか考えられます。たとえば、`NavigationLink`の宛先ビューが正しく初期化されていない、または`NavigationLink`が`NavigationView`の中にないなどの理由が考えられます。

以下に、`NavigationLink`を正しく使用するための一般的な例を示します：

```swift
struct ContentView: View {
    var body: some View {
        NavigationView {
            VStack {
                NavigationLink(destination: PortraitView()) {
                    Text("Go to Portrait View")
                }

                NavigationLink(destination: LandscapeView()) {
                    Text("Go to Landscape View")
                }

                NavigationLink(destination: MultiOrientationView()) {
                    Text("Go to Multi-orientation View")
                }
            }
        }
    }
}
```

この例では、各`NavigationLink`は`NavigationView`内に存在し、それぞれが別のビューに遷移するように設定されています。また、`NavigationLink`の宛先は明示的に指定されており、その宛先ビューが正しく初期化されています。

もし`NavigationLink`が正しく動作しない場合は、上記のコードを参考に、`NavigationView`と`NavigationLink`の使用方法を再確認してみてください。それでも問題が解決しない場合は、具体的なコードとそれがどのように動作するか（または動作しないか）について詳しく説明していただければ、さらに具体的なアドバイスを提供することができます。

---

## 👤 User
*2023-07-01 23:21:30*

```swift
```

---

## 🤖 Assistant
*2023-07-01 23:21:33*

すみません、あなたのメッセージが空であるようです。何か具

---

## 👤 User
*2023-07-01 23:21:58*

遷移はしたけど回転はしなかった

```swift
public enum AppOrientation {
    case portrait
    case landscapeRight
}

class ContentViewModel: ObservableObject {
    @Published var multiOrientation: AppOrientation = .portrait
}

struct SampleOrientationView: View {
    @StateObject var viewModel = ContentViewModel()

    var body: some View {
        NavigationStack {
            VStack {
                NavigationLink("Go to Portrait View", destination: PortraitView())
                
                NavigationLink("Go to Landscape View", destination: LandscapeView())
                
                Picker("Multi-orientation:", selection: $viewModel.multiOrientation) {
                    Text("Portrait")
                        .tag(AppOrientation.portrait)
                    Text("Landscape Right")
                        .tag(AppOrientation.landscapeRight)
                }
                .pickerStyle(SegmentedPickerStyle())

                NavigationLink("Go to Multi-orientation View", destination: MultiOrientationView(orientationLock: viewModel.multiOrientation))
            }
        }
    }
}

struct PortraitView: View {
    var body: some View {
        VStack {
            Text("This is Portrait View")
        }
        .background(
            OrientationLockViewControllerRepresentable(
                orientationLock: .portrait
            )
        )
    }
}

struct LandscapeView: View {
    var body: some View {
        VStack {
            Text("This is Landscape View")
        }
        .background(
            OrientationLockViewControllerRepresentable(
                orientationLock: .landscapeRight
            )
        )
    }
}

struct MultiOrientationView: View {
    let orientationLock: AppOrientation

    var body: some View {
        VStack {
            Text("This is Multi-orientation View")
        }
        .background(
            OrientationLockViewControllerRepresentable(
                orientationLock: orientationLock
            )
        )
    }
}

class OrientationLockViewController: UIViewController {
    
    var orientationLock = UIInterfaceOrientationMask.portrait
    
    override var supportedInterfaceOrientations: UIInterfaceOrientationMask {
        return self.orientationLock
    }
    
}

struct OrientationLockViewControllerRepresentable: UIViewControllerRepresentable {
    
    var orientationLock: AppOrientation
    
    func makeUIViewController(context: Context) -> OrientationLockViewController {
        let viewController = OrientationLockViewController()
        switch orientationLock {
        case .portrait:
            viewController.orientationLock = .portrait
        case .landscapeRight:
            viewController.orientationLock = .landscapeRight
        }
        return viewController
    }
    
    func updateUIViewController(_ viewController: OrientationLockViewController, context: Context) {
        switch orientationLock {
        case .portrait:
            viewController.orientationLock = .portrait
        case .landscapeRight:
            viewController.orientationLock = .landscapeRight
        }
    }
}

```

---

## 🤖 Assistant
*2023-07-01 23:22:47*

SwiftUIのビューには実際のUIKitのビューコントローラが関連付けられていますが、それは背後のビューコントローラスタックの一部であるため、一部のビューコントローラ特有の動作（ここでは画面回転の制御）が期待通りに動作しない場合があります。そのため、ビューコントローラを`UIViewControllerRepresentable`でラップし、SwiftUIビューに追加しても、そのビューコントローラの`supportedInterfaceOrientations`が常に反映されるわけではありません。

一部のUIKitの動作をSwiftUIで制御するためには、全体で一つのビューコントローラを使い、そのビューコントローラの`supportedInterfaceOrientations`を動的に変更するという方法が考えられます。

具体的には、アプリケーションの起動時にカスタムの`UIHostingController`を作成し、その`supportedInterfaceOrientations`を`ContentViewModel`の`multiOrientation`に同期させることで、画面回転の制御を行うことができます。そのためには、`ContentViewModel`で現在の向きを保存し、それを各ビューから参照して現在の向きを設定することが必要です。

ただし、この方法ではアプリケーション全体で一つの`ContentViewModel`を共有する必要があります。また、各ビューの`onAppear`と`onDisappear`を使用して画面の向きを動的に変更することも必要です。

また、ご存知かもしれませんが、画面の向きはデバイスの物理的な向きだけでなく、ステータスバーの向きも制御します。そのため、画面の向きを変更しても実際のデバイスの向きが変わらない場合でも、ステータスバーの向きは変わることがあります。

以上のことを考慮すると、SwiftUIで画面の向きを動的に制御するのは難しいかもしれません。可能であれば、画面の向きを制御する必要のないデザインを採用することを検討してみてはいかがでしょうか。

---

## 👤 User
*2023-07-01 23:23:01*

動画など横画面で再生させたいんだ

---

## 🤖 Assistant
*2023-07-01 23:23:51*

私の理解では、ご要望は以下のようなシナリオを想定しているかと思います。

- 特定のView（例えば、動画再生View）では、デバイスの向きをLandscapeに強制したい。
- その他のViewでは、デバイスの向きはPortraitに制限したい。

このようなシナリオを実装するためには、一般的には以下の2つのステップが必要です。

1. Info.plistで全ての向きをサポートするように設定します。これは、デバイスの向きをLandscapeに変更できるようにするためです。

```xml
<key>UISupportedInterfaceOrientations</key>
<array>
    <string>UIInterfaceOrientationPortrait</string>
    <string>UIInterfaceOrientationLandscapeLeft</string>
    <string>UIInterfaceOrientationLandscapeRight</string>
</array>
```

2. AppDelegateまたはSceneDelegateで、画面の向きを動的に変更するメソッドを実装します。以下のコードは、AppDelegateでの実装例です。

```swift
class AppDelegate: UIResponder, UIApplicationDelegate {

    var orientationLock = UIInterfaceOrientationMask.portrait

    func application(_ application: UIApplication, 
                     supportedInterfaceOrientationsFor window: UIWindow?) -> UIInterfaceOrientationMask {
        return self.orientationLock
    }
}
```

3. 動画再生Viewに遷移するとき、AppDelegateの`orientationLock`をLandscapeに変更します。動画再生Viewから離れるときには、`orientationLock`を再びPortraitに戻します。

```swift
let appDelegate = UIApplication.shared.delegate as! AppDelegate
appDelegate.orientationLock = .landscapeRight
```

SwiftUIでは、`onAppear`および`onDisappear`を使用して、Viewが表示・非表示になるときの処理を記述することができます。これを使用して、Viewの表示・非表示時に`orientationLock`の値を変更します。

注意点としては、この方法では`orientationLock`がアプリ全体で共有されるため、複数のViewが同時に`orientationLock`の値を変更する場合には意図しない挙動を引き起こす可能性があります。そのため、注意深く設計する必要があります。

---

## 👤 User
*2023-07-01 23:24:53*

SwiftUIの実装でMovieViewとTopViewを作って実装例を押して欲しい

---

## 🤖 Assistant
*2023-07-01 23:25:34*

もちろんです。以下に示すSwiftUIコード例では、`ContentViewModel`を使用して、現在の画面向きを管理しています。そして`TopView`から`MovieView`に遷移する際に画面向きを変更し、`MovieView`から戻る際にもとの画面向きに戻します。

```swift
import SwiftUI

class ContentViewModel: ObservableObject {
    @Published var interfaceOrientation: UIInterfaceOrientationMask = .portrait
}

struct TopView: View {
    @EnvironmentObject var contentViewModel: ContentViewModel
    
    var body: some View {
        VStack {
            NavigationLink(destination: MovieView()) {
                Text("Go to MovieView")
            }
        }
        .onAppear {
            self.contentViewModel.interfaceOrientation = .portrait
            UIDevice.current.setValue(UIInterfaceOrientation.portrait.rawValue, forKey: "orientation")
        }
    }
}

struct MovieView: View {
    @EnvironmentObject var contentViewModel: ContentViewModel
    
    var body: some View {
        VStack {
            Text("MovieView")
        }
        .onAppear {
            self.contentViewModel.interfaceOrientation = .landscapeRight
            UIDevice.current.setValue(UIInterfaceOrientation.landscapeRight.rawValue, forKey: "orientation")
        }
        .onDisappear {
            self.contentViewModel.interfaceOrientation = .portrait
            UIDevice.current.setValue(UIInterfaceOrientation.portrait.rawValue, forKey: "orientation")
        }
    }
}

struct ContentView: View {
    @StateObject var contentViewModel = ContentViewModel()
    
    var body: some View {
        NavigationView {
            TopView()
        }
        .environmentObject(contentViewModel)
    }
}

@main
struct MyApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

この例では、`MovieView`が表示されるときにデバイスの向きをLandscape Rightに強制的に変更し、`MovieView`から戻るときにデバイスの向きをPortraitに戻します。これは`MovieView`の`onAppear`と`onDisappear`メソッドで行っています。

また、アプリケーションの起動時に、`ContentViewModel`をアプリケーション全体で共有するために、`@EnvironmentObject`プロパティラッパーを使用しています。

---
