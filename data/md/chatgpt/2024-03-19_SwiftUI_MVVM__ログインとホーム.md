# SwiftUI MVVM: ログインとホーム

日付: 2024-03-19

---

## 👤 ユーザー
*2024/03/19 15:03:57*

SwiftUI で ログイン用のViewとホーム画面を出し分けしたい。enumでそれぞれのcaseを持たせたい。どう実装すればいいかMVVMでどう実装すればいいか？

---

## 🤖 アシスタント
*2024/03/19 15:04:48*

SwiftUIでログイン用のViewとホーム画面を出し分けるために、MVVMパターンを使用して実装する方法を説明します。MVVMパターンでは、Model, View, ViewModelの3つの主要コンポーネントを利用します。このケースでは、アプリケーションの状態（ログインしているかどうか）を管理するViewModelを作成し、それに基づいて表示するViewを切り替えることになります。

### Step 1: 状態管理用のEnumを定義

まず、アプリケーションの状態を管理するためのEnumを定義します。このEnumには、ログイン画面とホーム画面の2つのケースを持たせます。

```swift
enum AppState {
    case login
    case home
}
```

### Step 2: ViewModelの作成

ViewModel内で、上記で定義した`AppState`を使用して現在の状態を保持します。また、ユーザーがログインした後に状態を更新するメソッドを提供します。

```swift
import Combine

class AppViewModel: ObservableObject {
    @Published var currentState: AppState = .login

    func login(username: String, password: String) {
        // ログイン処理（ここでは仮の処理とする）
        // 成功したら状態を更新
        self.currentState = .home
    }
    
    func logout() {
        // ログアウト処理
        self.currentState = .login
    }
}
```

### Step 3: Viewの実装

最後に、`AppViewModel`を使用して、現在の状態に応じてログイン画面かホーム画面を表示するViewを作成します。`@ObservedObject`または`@StateObject`を使用してViewModelをViewに結びつけます。

```swift
import SwiftUI

struct ContentView: View {
    @StateObject var viewModel = AppViewModel()

    var body: some View {
        switch viewModel.currentState {
        case .login:
            LoginView(viewModel: viewModel)
        case .home:
            HomeView(viewModel: viewModel)
        }
    }
}

struct LoginView: View {
    @ObservedObject var viewModel: AppViewModel
    
    var body: some View {
        // ログイン画面のUI
        Button("Login") {
            viewModel.login(username: "user", password: "pass")
        }
    }
}

struct HomeView: View {
    @ObservedObject var viewModel: AppViewModel
    
    var body: some View {
        // ホーム画面のUI
        Button("Logout") {
            viewModel.logout()
        }
    }
}
```

このようにMVVMパターンを用いることで、SwiftUIで状態に基づいたViewの出し分けが行えるようになります。`AppViewModel`内で状態管理を行い、その状態に基づいて`ContentView`がどのViewを表示するかを決定します。ログイン処理などのビジネスロジックはViewModel内に実装することで、UIとロジックの分離が図れます。

---

## 👤 ユーザー
*2024/03/19 15:09:32*

currentState が切り替わったときに画面がふわっとするようなアニメーション効果を入れたい。どうすればいいか？

---

## 🤖 アシスタント
*2024/03/19 15:10:28*

SwiftUIでビューの切り替えにアニメーションを加えたい場合、`transition`や`animation`モディファイアを使用して実現できます。ここでは、`AppState`が切り替わった時に画面がふわっと表示されるようなアニメーションを追加する方法を説明します。

### Step 1: `transition`の適用

`LoginView`と`HomeView`に`transition`モディファイアを追加します。ここでは、`opacity`と`scale`を組み合わせたカスタムトランジションを作成して、画面がふわっと表示される効果を作り出します。

```swift
struct LoginView: View {
    @ObservedObject var viewModel: AppViewModel
    
    var body: some View {
        // ログイン画面のUI
        Button("Login") {
            withAnimation {
                viewModel.login(username: "user", password: "pass")
            }
        }
    }
    .transition(.opacity.combined(with: .scale))
}

struct HomeView: View {
    @ObservedObject var viewModel: AppViewModel
    
    var body: some View {
        // ホーム画面のUI
        Button("Logout") {
            withAnimation {
                viewModel.logout()
            }
        }
    }
    .transition(.opacity.combined(with: .scale))
}
```

### Step 2: `animation`の適用

画面の切り替えをトリガーするアクション（例えば、ログインやログアウトボタンのタップ）を`withAnimation`ブロックで囲むことで、その変更にアニメーションを適用します。`ContentView`の`body`内で状態が変わる部分に`animation`モディファイアを追加することもできますが、ここではアクション内で直接`withAnimation`を使用しています。

### Step 3: カスタムトランジションの定義（オプション）

さらにカスタマイズされたトランジションを実現したい場合は、独自のトランジションを定義することができます。以下の例では、`opacity`と`scale`の組み合わせを使ったシンプルなカスタムトランジションを作成していますが、より複雑なアニメーションを定義することも可能です。

```swift
extension AnyTransition {
    static var customTransition: AnyTransition {
        let insertion = AnyTransition.opacity.combined(with: .scale(scale: 0.5))
        let removal = AnyTransition.opacity.combined(with: .scale(scale: 1.5))
        return .asymmetric(insertion: insertion, removal: removal)
    }
}
```

そして、このカスタムトランジションを`LoginView`と`HomeView`に適用します。

```swift
.transition(.customTransition)
```

これらのステップにより、`AppState`が切り替わる際にビューがふわっと表示されるようなアニメーション効果を実装できます。SwiftUIのアニメーションとトランジションは非常に柔軟で、さまざまなカスタマイズが可能ですので、プロジェクトの要件に応じて調整してみてください。

---
