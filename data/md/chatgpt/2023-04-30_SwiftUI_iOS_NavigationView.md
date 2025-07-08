# SwiftUI iOS NavigationView

日付: 2023-04-30

---

## 👤 ユーザー
*2023/04/30 16:56:08*

SwiftUI で iOS15以上対応のiOSアプリを開発しているんだけど、NavigationViewがiOS16以上では非推奨になったので、NavigationViewとNavigationStackをラップしたViewを用いて開発を進めたいんだけど、コードを書いてくれないかな？

---

## 🤖 アシスタント
*2023/04/30 16:57:14*

もちろん、お手伝いします！以下に、`NavigationView`と`NavigationStack`をラップしたカスタムビューを作成するサンプルコードを提供します。このカスタムビューは、iOS 15 と iOS 16 以上の両方で動作するように設計されています。

```swift
import SwiftUI

// カスタムビュー CustomNavigationView
struct CustomNavigationView<Content: View>: View {
    @Environment(\.presentationMode) var presentationMode
    @State private var isActive = false
    let content: () -> Content

    init(@ViewBuilder content: @escaping () -> Content) {
        self.content = content
    }

    var body: some View {
        if #available(iOS 16.0, *) {
            NavigationStackView {
                content()
            }
        } else {
            NavigationView {
                content()
            }
        }
    }
}

// NavigationStackView (iOS 16 以上用)
@available(iOS 16.0, *)
struct NavigationStackView<Content: View>: View {
    @StateObject private var navigationStack = NavigationStack()
    let content: () -> Content

    init(@ViewBuilder content: @escaping () -> Content) {
        self.content = content
    }

    var body: some View {
        content()
            .environmentObject(navigationStack)
    }
}

// NavigationStack (iOS 16 以上用)
@available(iOS 16.0, *)
class NavigationStack: ObservableObject {
    @Published var viewStack: [AnyView] = []
    @Published var currentView: AnyView

    init() {
        currentView = AnyView(EmptyView())
    }

    func push<Content: View>(_ view: Content) {
        viewStack.append(currentView)
        currentView = AnyView(view)
    }

    func pop() {
        if !viewStack.isEmpty {
            currentView = viewStack.removeLast()
        }
    }
}
```

これで、`CustomNavigationView` を使用して開発を進めることができます。例えば：

```swift
struct ContentView: View {
    var body: some View {
        CustomNavigationView {
            VStack {
                Text("Hello, World!")
                NavigationLink(destination: Text("Next View")) {
                    Text("Go to Next View")
                }
            }
            .navigationTitle("Home")
        }
    }
}
```

このカスタムビューは、iOS 15 と iOS 16 以上の両方で`NavigationView`と`NavigationStack`の機能を提供するように設計されています。開発を進める際にこのコードを活用してください。

---

## 👤 ユーザー
*2023/04/30 16:58:40*

ありがとう。このコードを使って push と pop するサンプルコードを書いてみて

---

## 🤖 アシスタント
*2023/04/30 16:59:19*

以下のサンプルコードでは、`CustomNavigationView`を使って、ビューをプッシュおよびポップする方法を示しています。このサンプルでは、`Button`を使って`NavigationStack`を操作しています。

```swift
import SwiftUI

struct ContentView: View {
    var body: some View {
        CustomNavigationView {
            HomeView()
        }
    }
}

struct HomeView: View {
    @EnvironmentObject var navigationStack: NavigationStack

    var body: some View {
        VStack {
            Text("Home View")
                .font(.largeTitle)

            Button(action: {
                navigationStack.push(NextView())
            }) {
                Text("Push Next View")
                    .padding()
                    .background(Color.blue)
                    .foregroundColor(.white)
                    .cornerRadius(8)
            }
        }
    }
}

struct NextView: View {
    @EnvironmentObject var navigationStack: NavigationStack

    var body: some View {
        VStack {
            Text("Next View")
                .font(.largeTitle)

            Button(action: {
                navigationStack.pop()
            }) {
                Text("Pop View")
                    .padding()
                    .background(Color.red)
                    .foregroundColor(.white)
                    .cornerRadius(8)
            }
        }
    }
}
```

このサンプルコードでは、`HomeView`に「Push Next View」ボタンがあり、それをタップすると`NextView`がプッシュされます。`NextView`には「Pop View」ボタンがあり、それをタップするとビューがポップされて`HomeView`に戻ります。

このサンプルコードを参考にして、`CustomNavigationView`を使って開発を進めてください。

---

## 👤 ユーザー
*2023/04/30 17:00:16*

AnyView を使うとパフォーマンスが悪くなったりしないかな？

---

## 🤖 アシスタント
*2023/04/30 17:01:12*

`AnyView`は、異なる型のビューを同一の型として扱うために使用される型消去コンテナです。これにより、様々な型のビューを簡単に扱うことができますが、パフォーマンスへの影響がある場合があります。

`AnyView`の使用によるパフォーマンスへの影響は、主に以下の2つの点に関連しています。

1. コンパイル時の最適化: Swiftコンパイラは、具体的な型が明らかである場合、より効果的な最適化を行うことができます。`AnyView`を使用すると、この最適化が損なわれることがあります。

2. 実行時のオーバーヘッド: `AnyView`を使用することで、実行時に追加のオーバーヘッドが発生する場合があります。これは、`AnyView`がビュー階層の一部として存在する場合、SwiftUIがビューの更新を効率的に行えなくなるためです。

ただし、実際のパフォーマンスへの影響はアプリケーションの構造や使用方法に大きく依存します。`AnyView`が多数のビューで使用される場合や、頻繁に更新されるビューで使用される場合、パフォーマンスへの影響が大きくなる可能性があります。

そのため、`AnyView`を使用する際は、適切な最適化や設計が重要です。もしパフォーマンスに懸念がある場合、`AnyView`の使用を最小限に抑えるか、具体的な型を使用してコードをリファクタリングしてみてください。

---

## 👤 ユーザー
*2023/04/30 17:01:45*

教えてくれたコードの class NavigationStack: ObservableObject {} では AnyView を使っているんだけど、それを使わないようにしたいんだけどどうすればいい？

---

## 🤖 アシスタント
*2023/04/30 17:02:39*

`AnyView`を使わずに、`NavigationStack`を実装する方法として、ジェネリック型を使ってコードをリファクタリングすることができます。以下のコードは、`AnyView`を使用せずに`NavigationStack`を実装した例です：

```swift
import SwiftUI

struct CustomNavigationView<Root: View>: View {
    @StateObject private var navigationStack: NavigationStack<Root>

    init(rootView: Root) {
        _navigationStack = StateObject(wrappedValue: NavigationStack(rootView: rootView))
    }

    var body: some View {
        if #available(iOS 16.0, *) {
            NavigationStackView()
                .environmentObject(navigationStack)
        } else {
            NavigationView {
                NavigationStackView()
                    .environmentObject(navigationStack)
            }
        }
    }

    @available(iOS 16.0, *)
    struct NavigationStackView<Content: View>: View {
        @EnvironmentObject var navigationStack: NavigationStack<Content>

        var body: some View {
            navigationStack.currentView
        }
    }
}

class NavigationStack<Root: View>: ObservableObject {
    @Published var viewStack: [Root] = []
    @Published var currentView: Root

    init(rootView: Root) {
        currentView = rootView
    }

    func push<Content: View>(_ view: Content) {
        if let typedView = view as? Root {
            viewStack.append(currentView)
            currentView = typedView
        }
    }

    func pop() {
        if !viewStack.isEmpty {
            currentView = viewStack.removeLast()
        }
    }
}
```

この実装では、`NavigationStack`はジェネリックな`Root`型を持ち、`currentView`もジェネリック型を利用しています。また、`push`メソッドでプッシュされるビューが`Root`型と互換性がある場合に限り、ビューをプッシュするようにしています。

この方法で、`AnyView`を使わずに`NavigationStack`を実装することができます。ただし、これにより`NavigationStack`が扱えるビューの型が制限されるため、異なる型のビューをプッシュする必要がある場合は、このアプローチがうまく機能しないことがあります。そのような場合は、より柔軟な方法として`AnyView`を使用するか、ビュー階層の設計を見直してください。

---

## 👤 ユーザー
*2023/04/30 17:07:15*

AnyView やジェネリック型を用いないいい方法はないの？

---

## 🤖 アシスタント
*2023/04/30 17:08:16*

`NavigationLink`を活用することで、`AnyView`やジェネリック型を用いずにナビゲーションを実装する方法があります。このアプローチでは、`NavigationLink`を使用してビューをプッシュし、各ビューで`.navigationBarBackButtonHidden(true)`を設定することでカスタムの戻るボタンを実装します。以下にサンプルコードを示します：

```swift
import SwiftUI

struct ContentView: View {
    var body: some View {
        NavigationView {
            HomeView()
        }
    }
}

struct HomeView: View {
    @State private var isActive = false

    var body: some View {
        VStack {
            Text("Home View")
                .font(.largeTitle)

            NavigationLink(destination: NextView(), isActive: $isActive) {
                Button(action: {
                    isActive = true
                }) {
                    Text("Push Next View")
                        .padding()
                        .background(Color.blue)
                        .foregroundColor(.white)
                        .cornerRadius(8)
                }
            }
            .isDetailLink(false)
            .opacity(0)
        }
        .navigationBarTitle("Home", displayMode: .inline)
    }
}

struct NextView: View {
    @Environment(\.presentationMode) var presentationMode

    var body: some View {
        VStack {
            Text("Next View")
                .font(.largeTitle)

            Button(action: {
                presentationMode.wrappedValue.dismiss()
            }) {
                Text("Pop View")
                    .padding()
                    .background(Color.red)
                    .foregroundColor(.white)
                    .cornerRadius(8)
            }
        }
        .navigationBarTitle("Next", displayMode: .inline)
        .navigationBarBackButtonHidden(true)
        .toolbar {
            ToolbarItem(placement: .navigationBarLeading) {
                Button("Back") {
                    presentationMode.wrappedValue.dismiss()
                }
            }
        }
    }
}
```

このサンプルコードでは、`NavigationLink`を用いて`HomeView`から`NextView`へ遷移し、`NextView`にはカスタムの戻るボタンを表示しています。カスタムの戻るボタンを押すことで、`HomeView`に戻ることができます。

この方法では、`AnyView`やジェネリック型を使わずにナビゲーションを実装することができますが、プッシュやポップの制御がビューごとに散らばるため、ナビゲーションの管理がやや煩雑になる可能性があります。このアプローチがアプリケーションの要件に適しているかどうかを検討してください。

---
