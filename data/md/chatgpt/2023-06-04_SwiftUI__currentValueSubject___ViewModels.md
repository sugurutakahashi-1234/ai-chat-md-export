# SwiftUI: currentValueSubject & ViewModels

Date: 2023-06-04

---

## 👤 User
*2023-06-04 17:28:07*

SwiftUI で environment object を使わずに実装していきたい。static な currentValueSubject を定義すれば、それが実現できるかもしれないんだけどどう思う？、currentValueSubject の値の更新はなるべくViewでは行わず、ViewModelで行いたいんだ。

---

## 🤖 Assistant
*2023-06-04 17:28:45*

`CurrentValueSubject`はCombineフレームワークに属する、値を保存し、新しい値が設定されるたびにその値を発行するSubjectです。SwiftUIとCombineを使用して、`CurrentValueSubject`とViewModelを使用した実装を行うことは可能です。

以下に簡単なサンプルを提示します：

```swift
import Combine
import SwiftUI

// ViewModelの実装
class MyViewModel: ObservableObject {
    // staticなCurrentValueSubjectの実装
    static let sharedValue = CurrentValueSubject<String, Never>("")

    private var cancellables = Set<AnyCancellable>()

    init() {
        MyViewModel.sharedValue
            .sink { value in
                print("Received new value: \(value)")
            }
            .store(in: &cancellables)
    }

    func updateValue(newValue: String) {
        MyViewModel.sharedValue.send(newValue)
    }
}

// SwiftUIのViewの実装
struct ContentView: View {
    @StateObject private var viewModel = MyViewModel()

    var body: some View {
        VStack {
            TextField("Enter new value", text: Binding(
                get: { MyViewModel.sharedValue.value },
                set: { viewModel.updateValue(newValue: $0) }
            ))
        }
    }
}
```

この実装では、ViewModelに`CurrentValueSubject`の更新を委託しています。ただし、あくまでこれは一例ですので、実際のアプリケーションの要件に応じて適切に調整してください。なお、この実装により`@EnvironmentObject`は不要となります。

その一方で、SwiftUIの状態管理を行う際には、`@EnvironmentObject`や`@StateObject`、`@ObservedObject`などのSwiftUI特有の仕組みを活用することが推奨されています。これらの利用により、Viewのライフサイクルとデータの同期を自動的に管理でき、より直感的なコーディングが可能になります。

そのため、特別な理由がない限りは、これらSwiftUIの状態管理機能を活用する方が好ましいでしょう。ただし、あくまでこれは設計方針の一つなので、あなたが行いたいと思う設計が正しく動作するのであれば、それもまた一つの解決策と言えます。

---

## 👤 User
*2023-06-04 17:31:06*

sharedValue は MyViewModel では定義せずに、別に定義したいんだ。例えばloading状態を表す isLoading などのフラグを全画面で共通で使うことを想定している。enum AppState のような  enum を定義して、そこに isLoading を CurrentValueSubject で定義する感じ。でもそれを直接使うのではなくて、ViewからはViewModel経由で公開したり、値を更新したいんだ

---

## 🤖 Assistant
*2023-06-04 17:31:37*

`MyViewModel`の外部で`isLoading`を管理する`AppState`というenumを定義し、それを`MyViewModel`を介して扱うような設計にするということで理解しました。

以下にそのような実装例を示します。

```swift
import Combine
import SwiftUI

// AppStateの定義
enum AppState {
    static let isLoading = CurrentValueSubject<Bool, Never>(false)
}

// ViewModelの実装
class MyViewModel: ObservableObject {
    private var cancellables = Set<AnyCancellable>()

    // isLoadingを公開
    @Published var isLoading: Bool = false

    init() {
        AppState.isLoading
            .sink { [weak self] in self?.isLoading = $0 }
            .store(in: &cancellables)
    }

    func startLoading() {
        AppState.isLoading.send(true)
    }

    func stopLoading() {
        AppState.isLoading.send(false)
    }
}

// SwiftUIのViewの実装
struct ContentView: View {
    @StateObject private var viewModel = MyViewModel()

    var body: some View {
        VStack {
            if viewModel.isLoading {
                ProgressView()
            } else {
                // Content here
            }
            Button(action: {
                viewModel.startLoading()
                // Perform some work, then stop loading
                DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                    viewModel.stopLoading()
                }
            }) {
                Text("Load Data")
            }
        }
    }
}
```

このような設計では、`AppState`で状態を管理し、その状態を`MyViewModel`を介してViewに公開しています。また、`MyViewModel`は`AppState`の`isLoading`の値を変更するためのメソッドも提供しています。

この実装により、`AppState`で管理されている状態は全画面で共通になります。それぞれの画面は、それぞれの`ViewModel`を介して`AppState`にアクセスし、状態を読み取ることができます。また、状態の更新も`ViewModel`を介して行うことができます。

これにより、`ViewModel`の役割を明確にし、`AppState`の直接的な操作をViewから隔離することができます。

---

## 👤 User
*2023-06-04 17:32:53*

AppState をプロトコル化して、MyViewModel のイニシャライザで渡して、依存関係を明確にしたいんだけどできますか？

---

## 🤖 Assistant
*2023-06-04 17:33:26*

もちろん可能です。以下にプロトコルを使用してAppStateを注入する例を示します。

まず、AppStateをプロトコルとして定義します：

```swift
import Combine

protocol AppStateProtocol {
    var isLoading: CurrentValueSubject<Bool, Never> { get }
}

// AppStateの実装
struct AppState: AppStateProtocol {
    var isLoading = CurrentValueSubject<Bool, Never>(false)
}
```

次に、この`AppStateProtocol`を`MyViewModel`のイニシャライザに注入します：

```swift
import Combine

class MyViewModel: ObservableObject {
    private var cancellables = Set<AnyCancellable>()

    @Published var isLoading: Bool = false

    private var appState: AppStateProtocol

    init(appState: AppStateProtocol) {
        self.appState = appState

        self.appState.isLoading
            .sink { [weak self] in self?.isLoading = $0 }
            .store(in: &cancellables)
    }

    func startLoading() {
        appState.isLoading.send(true)
    }

    func stopLoading() {
        appState.isLoading.send(false)
    }
}
```

そして、Viewでは以下のようにViewModelを生成します：

```swift
import SwiftUI

struct ContentView: View {
    @StateObject private var viewModel = MyViewModel(appState: AppState())

    var body: some View {
        VStack {
            if viewModel.isLoading {
                ProgressView()
            } else {
                // Content here
            }
            Button(action: {
                viewModel.startLoading()
                // Perform some work, then stop loading
                DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                    viewModel.stopLoading()
                }
            }) {
                Text("Load Data")
            }
        }
    }
}
```

これにより、`AppState`の実装が`MyViewModel`から分離され、依存関係が明確になります。`AppState`は`AppStateProtocol`を通じて注入され、`MyViewModel`は`AppState`の具体的な実装に依存しなくなります。これにより、テスト時には別の実装を注入するなど、より柔軟なコードを書くことが可能になります。

---

## 👤 User
*2023-06-04 17:35:52*

でもこれだと、AppStateをはアプリ内で複数持つことになってしまう気がするんだけど、アプリとしては isLoading は一つしか持たないように統一したい。

---

## 🤖 Assistant
*2023-06-04 17:36:28*

その問題を解決するためには、`AppState`をSingletonとして実装することが一つの解決策です。以下のコードはその一例となります。

まず、AppStateをSingletonとして定義します：

```swift
import Combine

protocol AppStateProtocol {
    var isLoading: CurrentValueSubject<Bool, Never> { get }
}

// AppStateの実装
class AppState: AppStateProtocol {
    static let shared = AppState()

    var isLoading = CurrentValueSubject<Bool, Never>(false)

    private init() {}
}
```

次に、この`AppStateProtocol`を`MyViewModel`のイニシャライザに注入します：

```swift
import Combine

class MyViewModel: ObservableObject {
    private var cancellables = Set<AnyCancellable>()

    @Published var isLoading: Bool = false

    private var appState: AppStateProtocol

    init(appState: AppStateProtocol = AppState.shared) {
        self.appState = appState

        self.appState.isLoading
            .sink { [weak self] in self?.isLoading = $0 }
            .store(in: &cancellables)
    }

    func startLoading() {
        appState.isLoading.send(true)
    }

    func stopLoading() {
        appState.isLoading.send(false)
    }
}
```

そして、Viewでは以下のようにViewModelを生成します：

```swift
import SwiftUI

struct ContentView: View {
    @StateObject private var viewModel = MyViewModel()

    var body: some View {
        VStack {
            if viewModel.isLoading {
                ProgressView()
            } else {
                // Content here
            }
            Button(action: {
                viewModel.startLoading()
                // Perform some work, then stop loading
                DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                    viewModel.stopLoading()
                }
            }) {
                Text("Load Data")
            }
        }
    }
}
```

この実装では、`AppState`のインスタンスはアプリケーション全体で一つしか生成されません。各`ViewModel`は`AppState.shared`をデフォルトで引数として受け取るため、`ViewModel`は全て同じ`AppState`のインスタンスを共有します。これにより、`isLoading`の状態がアプリ全体で一つに統一されます。

---

## 👤 User
*2023-06-04 17:37:54*

ありがとう。この実装方針で、複数の画面でAppStateのisLoadingが共有されていることがわかるようなサンプルコードを書いて欲しい

---

## 🤖 Assistant
*2023-06-04 17:38:38*

わかりました。以下のコードでは、二つの異なる画面（`ContentView`と`AnotherView`）が同じ`AppState`のインスタンスを共有し、それぞれが`AppState`の`isLoading`の状態を表示します。

まず、AppStateとViewModelの定義は前の例と同様です：

```swift
import Combine

protocol AppStateProtocol {
    var isLoading: CurrentValueSubject<Bool, Never> { get }
}

// AppStateの実装
class AppState: AppStateProtocol {
    static let shared = AppState()

    var isLoading = CurrentValueSubject<Bool, Never>(false)

    private init() {}
}

class MyViewModel: ObservableObject {
    private var cancellables = Set<AnyCancellable>()

    @Published var isLoading: Bool = false

    private var appState: AppStateProtocol

    init(appState: AppStateProtocol = AppState.shared) {
        self.appState = appState

        self.appState.isLoading
            .sink { [weak self] in self?.isLoading = $0 }
            .store(in: &cancellables)
    }

    func startLoading() {
        appState.isLoading.send(true)
    }

    func stopLoading() {
        appState.isLoading.send(false)
    }
}
```

次に、二つの画面の定義をします：

```swift
import SwiftUI

struct ContentView: View {
    @StateObject private var viewModel = MyViewModel()

    var body: some View {
        VStack {
            if viewModel.isLoading {
                ProgressView()
            } else {
                Text("Not Loading")
            }
            Button(action: {
                viewModel.startLoading()
                DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                    viewModel.stopLoading()
                }
            }) {
                Text("Start Loading")
            }
            NavigationLink(destination: AnotherView()) {
                Text("Go to Another View")
            }
        }
    }
}

struct AnotherView: View {
    @StateObject private var viewModel = MyViewModel()

    var body: some View {
        VStack {
            if viewModel.isLoading {
                ProgressView()
            } else {
                Text("Not Loading")
            }
            Button(action: {
                viewModel.startLoading()
                DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                    viewModel.stopLoading()
                }
            }) {
                Text("Start Loading")
            }
        }
    }
}
```

この例では、`ContentView`と`AnotherView`という二つのViewがあり、それぞれが`MyViewModel`を持っています。これらのViewはそれぞれの`ViewModel`を介して`AppState.shared`にアクセスし、`isLoading`の状態を表示します。また、各Viewはそれぞれのボタンをクリックすることで`isLoading`の状態を変更することができます。

これにより、どちらの画面でも`isLoading`の状態が共有され、同期されます。例えば、`ContentView`でボタンを押してローディングを開始し、その後`AnotherView`に遷移すると、`AnotherView`でもローディングが表示されます。そして、ローディングが完了すると、どちらの画面でもローディングが終了することが表示されます。

---

## 👤 User
*2023-06-04 17:40:47*

ローディング画面について、モディファイアをつけるだけで、好きな画面単位で、そこにオーバーレイしたようなProgressViewを出すようなおとをしたいんだけどどうすればいいかな？

---

## 🤖 Assistant
*2023-06-04 17:41:40*

そのためには、`ViewModifier`を用いてローディング表示をカスタマイズすることが可能です。以下にそのような実装例を示します。

まず、新たに`LoadingViewModifier`を定義します：

```swift
import SwiftUI

struct LoadingViewModifier: ViewModifier {
    @Binding var isLoading: Bool

    func body(content: Content) -> some View {
        ZStack {
            content
            if isLoading {
                Color.black.opacity(0.4)
                ProgressView()
                    .progressViewStyle(CircularProgressViewStyle(tint: .white))
                    .scaleEffect(2)
            }
        }
    }
}

extension View {
    func isLoading(_ isLoading: Binding<Bool>) -> some View {
        self.modifier(LoadingViewModifier(isLoading: isLoading))
    }
}
```

そして、各画面ではこの新しいモディファイアを使用します：

```swift
import SwiftUI

struct ContentView: View {
    @StateObject private var viewModel = MyViewModel()

    var body: some View {
        VStack {
            Button(action: {
                viewModel.startLoading()
                DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                    viewModel.stopLoading()
                }
            }) {
                Text("Start Loading")
            }
            NavigationLink(destination: AnotherView()) {
                Text("Go to Another View")
            }
        }
        .isLoading($viewModel.isLoading)
    }
}

struct AnotherView: View {
    @StateObject private var viewModel = MyViewModel()

    var body: some View {
        VStack {
            Button(action: {
                viewModel.startLoading()
                DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                    viewModel.stopLoading()
                }
            }) {
                Text("Start Loading")
            }
        }
        .isLoading($viewModel.isLoading)
    }
}
```

この例では、`ViewModifier`として`LoadingViewModifier`を定義し、その中で`isLoading`が`true`のときに`ProgressView`を表示します。また、`View`のextensionとして`isLoading`関数を定義し、その中で`LoadingViewModifier`を適用します。これにより、任意のViewに`.isLoading($viewModel.isLoading)`という形でモディファイアを追加するだけでローディング表示をカスタマイズできます。

なお、この例ではローディング表示として黒の半透明の背景と白い`ProgressView`を使用していますが、この部分は自由にカスタマイズすることが可能です。また、ローディング表示は全画面を覆う形になりますが、この部分も`ZStack`や`GeometryReader`を用いて調整することが可能です。

---

## 👤 User
*2023-06-04 17:43:40*

func isLoading() ではなくて、これをつけるだけで、ローディングがオーバーレイすることがわかるような名前にrenameしてほしい。また、引数もわかりやすいようにisPresented のようなものにしてほしい。

---

## 🤖 Assistant
*2023-06-04 17:44:21*

わかりました。`isLoading(_:)`の代わりに`overlayLoadingWhenPresented(_:)`という名前にすると、ローディングがオーバーレイされることがわかりやすくなりますし、引数も`isPresented`とすることで、ローディングの表示・非表示が制御されることが直感的に理解できると思います。

以下のようにコードを書き換えてみます：

```swift
struct LoadingViewModifier: ViewModifier {
    @Binding var isPresented: Bool

    func body(content: Content) -> some View {
        ZStack {
            content
            if isPresented {
                Color.black.opacity(0.4)
                ProgressView()
                    .progressViewStyle(CircularProgressViewStyle(tint: .white))
                    .scaleEffect(2)
            }
        }
    }
}

extension View {
    func overlayLoadingWhenPresented(_ isPresented: Binding<Bool>) -> some View {
        self.modifier(LoadingViewModifier(isPresented: isPresented))
    }
}
```

それぞれのViewではこの新しいモディファイアを使用します：

```swift
struct ContentView: View {
    @StateObject private var viewModel = MyViewModel()

    var body: some View {
        VStack {
            Button(action: {
                viewModel.startLoading()
                DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                    viewModel.stopLoading()
                }
            }) {
                Text("Start Loading")
            }
            NavigationLink(destination: AnotherView()) {
                Text("Go to Another View")
            }
        }
        .overlayLoadingWhenPresented($viewModel.isLoading)
    }
}

struct AnotherView: View {
    @StateObject private var viewModel = MyViewModel()

    var body: some View {
        VStack {
            Button(action: {
                viewModel.startLoading()
                DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                    viewModel.stopLoading()
                }
            }) {
                Text("Start Loading")
            }
        }
        .overlayLoadingWhenPresented($viewModel.isLoading)
    }
}
```

これで各Viewがローディングのオーバーレイ表示を持っていることが、`.overlayLoadingWhenPresented($viewModel.isLoading)`という形で直感的に理解できます。また、引数の`isPresented`により、ローディングの表示・非表示が制御されることが明確になります。

---

## 👤 User
*2023-06-04 20:13:54*

ContentView と AnotherView にそれぞれ、ローディングを止めるボタンをつけて欲しい

---

## 🤖 Assistant
*2023-06-04 20:14:18*

指定した通り、各Viewにローディングを止めるボタンを追加することが可能です。以下にその実装例を示します：

```swift
struct ContentView: View {
    @StateObject private var viewModel = MyViewModel()

    var body: some View {
        VStack {
            Button(action: {
                viewModel.startLoading()
            }) {
                Text("Start Loading")
            }
            Button(action: {
                viewModel.stopLoading()
            }) {
                Text("Stop Loading")
            }
            NavigationLink(destination: AnotherView()) {
                Text("Go to Another View")
            }
        }
        .overlayLoadingWhenPresented($viewModel.isLoading)
    }
}

struct AnotherView: View {
    @StateObject private var viewModel = MyViewModel()

    var body: some View {
        VStack {
            Button(action: {
                viewModel.startLoading()
            }) {
                Text("Start Loading")
            }
            Button(action: {
                viewModel.stopLoading()
            }) {
                Text("Stop Loading")
            }
        }
        .overlayLoadingWhenPresented($viewModel.isLoading)
    }
}
```

ここで、"Start Loading"ボタンを押すとローディングが開始し、"Stop Loading"ボタンを押すとローディングが停止します。また、これらの操作は`ContentView`と`AnotherView`という二つのView間で共有されます。つまり、`ContentView`でローディングを開始し、その後`AnotherView`に遷移すると、`AnotherView`でもローディングが表示され、そのまま"Stop Loading"ボタンを押すとローディングが停止します。

---

## 👤 User
*2023-06-04 20:15:59*

func overlayLoadingWhenPresented() を func overlayLoading(isPresented: ) に変えて欲しい。また、ローディング中はナビゲーションView全体をローディングでオーバーレイするが、スクロール操作やタップは可能にして欲しい。

---

## 🤖 Assistant
*2023-06-04 20:16:36*

要望通りに、`overlayLoadingWhenPresented(_:)`を`overlayLoading(isPresented: )`に名前を変更し、ローディング表示中でもユーザーの操作を可能にするように変更します。そのために、ローディングのオーバーレイに`.allowsHitTesting(false)`を追加します。これにより、ローディングのオーバーレイはタッチイベントを受け取らず、下にあるViewへとイベントを通過させることができます。

以下にその実装例を示します：

```swift
struct LoadingViewModifier: ViewModifier {
    @Binding var isPresented: Bool

    func body(content: Content) -> some View {
        ZStack {
            content
            if isPresented {
                Color.black.opacity(0.4)
                ProgressView()
                    .progressViewStyle(CircularProgressViewStyle(tint: .white))
                    .scaleEffect(2)
                    .allowsHitTesting(false)
            }
        }
    }
}

extension View {
    func overlayLoading(isPresented: Binding<Bool>) -> some View {
        self.modifier(LoadingViewModifier(isPresented: isPresented))
    }
}
```

```swift
struct ContentView: View {
    @StateObject private var viewModel = MyViewModel()

    var body: some View {
        VStack {
            Button(action: {
                viewModel.startLoading()
            }) {
                Text("Start Loading")
            }
            Button(action: {
                viewModel.stopLoading()
            }) {
                Text("Stop Loading")
            }
            NavigationLink(destination: AnotherView()) {
                Text("Go to Another View")
            }
        }
        .overlayLoading(isPresented: $viewModel.isLoading)
    }
}

struct AnotherView: View {
    @StateObject private var viewModel = MyViewModel()

    var body: some View {
        VStack {
            Button(action: {
                viewModel.startLoading()
            }) {
                Text("Start Loading")
            }
            Button(action: {
                viewModel.stopLoading()
            }) {
                Text("Stop Loading")
            }
        }
        .overlayLoading(isPresented: $viewModel.isLoading)
    }
}
```

これにより、ローディング表示中でもユーザーはボタンを押したり、スクロールしたりすることが可能になります。また、モディファイアの名前が`overlayLoading(isPresented: )`に変更されているため、ローディングがオーバーレイ表示されることが明示的になりました。

---

## 👤 User
*2023-06-04 22:36:24*

試してみたら、ボタンがタップできなかったのだが、どうすればいい？

---

## 🤖 Assistant
*2023-06-04 22:37:06*

すみません、私の説明が不足していました。`allowsHitTesting(false)`はView自体にはタッチイベントが届くものの、その子View（今回のケースではProgressView）にはタッチイベントが届かないようにするものです。しかし、その背景の`Color.black.opacity(0.4)`にはタッチイベントが届くため、ボタンがタップできなくなってしまいます。

この問題を解決するためには、背景の`Color.black.opacity(0.4)`にも`.allowsHitTesting(false)`を適用する必要があります。以下にその修正を行った実装例を示します：

```swift
struct LoadingViewModifier: ViewModifier {
    @Binding var isPresented: Bool

    func body(content: Content) -> some View {
        ZStack {
            content
            if isPresented {
                Color.black.opacity(0.4).allowsHitTesting(false)
                ProgressView()
                    .progressViewStyle(CircularProgressViewStyle(tint: .white))
                    .scaleEffect(2)
                    .allowsHitTesting(false)
            }
        }
    }
}
```

```swift
struct ContentView: View {
    @StateObject private var viewModel = MyViewModel()

    var body: some View {
        VStack {
            Button(action: {
                viewModel.startLoading()
            }) {
                Text("Start Loading")
            }
            Button(action: {
                viewModel.stopLoading()
            }) {
                Text("Stop Loading")
            }
            NavigationLink(destination: AnotherView()) {
                Text("Go to Another View")
            }
        }
        .overlayLoading(isPresented: $viewModel.isLoading)
    }
}

struct AnotherView: View {
    @StateObject private var viewModel = MyViewModel()

    var body: some View {
        VStack {
            Button(action: {
                viewModel.startLoading()
            }) {
                Text("Start Loading")
            }
            Button(action: {
                viewModel.stopLoading()
            }) {
                Text("Stop Loading")
            }
        }
        .overlayLoading(isPresented: $viewModel.isLoading)
    }
}
```

こうすることで、ローディング表示中でもユーザーはボタンを押したり、スクロールしたりすることが可能になります。

---

## 👤 User
*2023-06-04 22:39:28*

ナビゲーションViewがないのでナビゲーション遷移できません

---

## 🤖 Assistant
*2023-06-04 22:39:51*

すみません、ナビゲーションの部分が抜けていました。`NavigationView`を追加し、遷移が可能になるように修正します。

以下にその修正を行った実装例を示します：

```swift
struct ContentView: View {
    @StateObject private var viewModel = MyViewModel()

    var body: some View {
        NavigationView {
            VStack {
                Button(action: {
                    viewModel.startLoading()
                }) {
                    Text("Start Loading")
                }
                Button(action: {
                    viewModel.stopLoading()
                }) {
                    Text("Stop Loading")
                }
                NavigationLink(destination: AnotherView()) {
                    Text("Go to Another View")
                }
            }
            .overlayLoading(isPresented: $viewModel.isLoading)
        }
    }
}

struct AnotherView: View {
    @StateObject private var viewModel = MyViewModel()

    var body: some View {
        VStack {
            Button(action: {
                viewModel.startLoading()
            }) {
                Text("Start Loading")
            }
            Button(action: {
                viewModel.stopLoading()
            }) {
                Text("Stop Loading")
            }
        }
        .overlayLoading(isPresented: $viewModel.isLoading)
        .navigationTitle("Another View")
    }
}
```

こうすることで、`ContentView`から`AnotherView`への遷移が可能になります。

---

## 👤 User
*2023-06-04 22:42:15*

セーフエリアが 暗くならなかったのだけれどもどうすればいい？

---

## 🤖 Assistant
*2023-06-04 22:42:53*

その問題は`edgesIgnoringSafeArea(_:)` メソッドを使うことで解決できます。これにより、特定のView（ここではローディングのオーバーレイ）がセーフエリアを無視するようになります。

以下にその修正を行った実装例を示します：

```swift
struct LoadingViewModifier: ViewModifier {
    @Binding var isPresented: Bool

    func body(content: Content) -> some View {
        ZStack {
            content
            if isPresented {
                Color.black.opacity(0.4)
                    .edgesIgnoringSafeArea(.all)
                    .allowsHitTesting(false)
                ProgressView()
                    .progressViewStyle(CircularProgressViewStyle(tint: .white))
                    .scaleEffect(2)
                    .allowsHitTesting(false)
            }
        }
    }
}
```

```swift
struct ContentView: View {
    @StateObject private var viewModel = MyViewModel()

    var body: some View {
        NavigationView {
            VStack {
                Button(action: {
                    viewModel.startLoading()
                }) {
                    Text("Start Loading")
                }
                Button(action: {
                    viewModel.stopLoading()
                }) {
                    Text("Stop Loading")
                }
                NavigationLink(destination: AnotherView()) {
                    Text("Go to Another View")
                }
            }
            .overlayLoading(isPresented: $viewModel.isLoading)
        }
    }
}

struct AnotherView: View {
    @StateObject private var viewModel = MyViewModel()

    var body: some View {
        VStack {
            Button(action: {
                viewModel.startLoading()
            }) {
                Text("Start Loading")
            }
            Button(action: {
                viewModel.stopLoading()
            }) {
                Text("Stop Loading")
            }
        }
        .overlayLoading(isPresented: $viewModel.isLoading)
        .navigationTitle("Another View")
    }
}
```

この変更により、ローディングのオーバーレイが全画面をカバーし、セーフエリアも含まれるようになります。

---

## 👤 User
*2023-06-04 22:44:59*

質問なんだけれども、今はContentViewとAnotherViewにそれぞれoverlayLoadingをつけているけど、これを行う場所を各画面で行うべきなのか、全体に一つに統一すべきなのかを教えてほしい。

---

## 🤖 Assistant
*2023-06-04 22:45:36*

この決定は主にアプリケーションの設計と要件によります。

1. **各画面で行う場合**：ローディングオーバーレイを各画面で設定することで、特定のViewのコンテキスト内でローディング状態を管理できます。これは、特定の画面が他の画面とは独立してローディングを管理する必要がある場合に有効です。

2. **全体に一つに統一する場合**：一方、全体に一つのローディングオーバーレイを設定することで、アプリケーション全体でのローディング状態を一元管理できます。例えば、全ての画面が同一のローディング状態を共有する場合や、一つのネットワークリクエストが複数の画面に影響を及ぼす可能性がある場合などに有用です。

どちらの選択肢が適切かはアプリケーションの具体的な要件によるところが大きいです。ただし、ローディングの状態がアプリ全体で共有され、複数の画面が同じ状態に依存する場合は、全体に一つのローディングオーバーレイを設定した方が一貫性を保つことができます。それにより、コードの冗長性を減らし、保守性を高めることが可能になります。

---

## 👤 User
*2023-06-04 22:49:05*

ContentView と AnotherView のローディング状態を一つで共有する方法を教えて欲しい

---

## 🤖 Assistant
*2023-06-04 22:49:41*

それにはAppStateのインスタンスをアプリケーション全体で共有する必要があります。AppStateのインスタンスをEnvironmentObjectとして扱うことで、ContentViewとAnotherView間で共有することが可能になります。

まず、@Publishedプロパティラッパーを使用してAppStateのisLoadingを更新します。そして、このAppStateをEnvironmentObjectとして各Viewに注入します。それにより、各Viewは同一のAppStateインスタンスを参照し、ローディングの状態が同期されます。

以下にその実装例を示します：

```swift
class AppState: ObservableObject {
    static let shared = AppState()
    @Published var isLoading: Bool = false
}

class MyViewModel {
    private var appState: AppState

    init(appState: AppState = .shared) {
        self.appState = appState
    }

    func startLoading() {
        appState.isLoading = true
    }

    func stopLoading() {
        appState.isLoading = false
    }
}

struct ContentView: View {
    @StateObject private var viewModel = MyViewModel()

    var body: some View {
        NavigationView {
            VStack {
                Button(action: {
                    viewModel.startLoading()
                }) {
                    Text("Start Loading")
                }
                Button(action: {
                    viewModel.stopLoading()
                }) {
                    Text("Stop Loading")
                }
                NavigationLink(destination: AnotherView()) {
                    Text("Go to Another View")
                }
            }
            .overlayLoading(isPresented: $viewModel.isLoading)
        }
        .environmentObject(AppState.shared)
    }
}

struct AnotherView: View {
    @StateObject private var viewModel = MyViewModel()

    var body: some View {
        VStack {
            Button(action: {
                viewModel.startLoading()
            }) {
                Text("Start Loading")
            }
            Button(action: {
                viewModel.stopLoading()
            }) {
                Text("Stop Loading")
            }
        }
        .overlayLoading(isPresented: $viewModel.isLoading)
        .navigationTitle("Another View")
        .environmentObject(AppState.shared)
    }
}
```

このようにすることで、AppStateのisLoadingがContentViewとAnotherView間で共有されるようになり、ローディング状態が同期されます。

---
