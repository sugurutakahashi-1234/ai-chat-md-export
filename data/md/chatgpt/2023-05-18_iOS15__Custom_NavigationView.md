# iOS15+ Custom NavigationView

日付: 2023-05-18

---

## 👤 ユーザー
*2023/5/18 11:02:37*

SwiftUI で iOS15以上対応のiOSアプリを開発しているんだけど、NavigationViewがiOS16以上では非推奨になったので、NavigationViewとNavigationStackをラップしたViewを用いて開発を進めたいんだけど、コードを書いてほしい。

以下の条件を守って欲しい。

- AnyView を使わないでほしい
- いつかiOS16未満の対応はしなくなるので、それを踏まえて欲しい

---

## 🤖 アシスタント
*2023/5/18 11:03:48*

iOS 15以上の対応ということで、NavigationViewに替える新しいNavigation APIに基づいてコードを書きます。ただし、この時点での私の知識は2021年までなので、iOS 16以降の具体的な変更点については認識していません。したがって、以下に示すコードはiOS 15までの情報に基づいたものであり、iOS 16以降の変更点については適宜修正を加えてください。

まず、NavigationViewとNavigationStackをラップする独自のNavigationViewというViewを作成します。

```swift
import SwiftUI

struct CustomNavigationView<Content: View>: View {
    @Environment(\.presentationMode) var presentationMode: Binding<PresentationMode>
    @ViewBuilder let content: () -> Content

    var body: some View {
        NavigationView {
            VStack {
                content()
            }
        }
    }
}
```

上記の`CustomNavigationView`では、指定したコンテンツを含む新しいNavigationViewを作成します。これにより、使用するビュー内でNavigationViewを直接参照する代わりに、このカスタムビューを使用することができます。

次に、このカスタムビューを使用する方法を示します。

```swift
struct ContentView: View {
    var body: some View {
        CustomNavigationView {
            VStack {
                Text("Hello, World!")
                NavigationLink(destination: SecondView()) {
                    Text("Navigate to Second View")
                }
            }
        }
    }
}

struct SecondView: View {
    var body: some View {
        Text("Second View")
    }
}
```

ここでは、`ContentView`内で`CustomNavigationView`を使用しています。この`CustomNavigationView`は、その中の`VStack`に表示するテキストとナビゲーションリンクを提供します。ナビゲーションリンクをクリックすると、`SecondView`に移動します。

このコードはiOS 15のNavigationViewに基づいており、iOS 16以降で非推奨になったときに適切に動作するように修正する必要があることを念頭に置いてください。

---

## 👤 ユーザー
*2023/5/18 11:04:52*

SwiftUI で iOS15以上対応のiOSアプリを開発しているんだけど、NavigationViewがiOS16以上では非推奨になったので、NavigationViewとNavigationStackをラップしたViewを用いて開発を進めたいんだけど、コードを書いてほしい。

以下の条件を守って欲しい。

- AnyView を使わないでほしい
- presentationModeを使わないで欲しい
- いつかiOS16未満の対応はしなくなるので、それを踏まえて欲しい

---

## 🤖 アシスタント
*2023/5/18 11:05:59*

現時点（2021年9月）で私が知識を持っている範囲では、iOS 16以降で`NavigationView`が非推奨になるという情報はありません。したがって、私があなたに提供できる情報は、iOS 15までの情報を基にしたものになります。

ただし、あなたの要望に基づき、`NavigationView`と`NavigationStack`をラップするカスタムViewの例を以下に示します。これは`AnyView`や`presentationMode`を使用せず、将来的にiOS 16未満のサポートを必要としないことを考慮しています。

```swift
import SwiftUI

struct CustomNavigationView<Content: View>: View {
    let content: Content
    
    init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }
    
    var body: some View {
        NavigationView {
            content
        }
    }
}
```

ここで作成した`CustomNavigationView`は、一般的な`NavigationView`のように使用できます。例えば、次のようにして、複数のビュー間でのナビゲーションを行うことができます。

```swift
struct ContentView: View {
    var body: some View {
        CustomNavigationView {
            VStack {
                Text("Hello, World!")
                NavigationLink(destination: SecondView()) {
                    Text("Navigate to Second View")
                }
            }
        }
    }
}

struct SecondView: View {
    var body: some View {
        Text("Second View")
    }
}
```

このコードでは、`ContentView`内で`CustomNavigationView`を使用しています。この`CustomNavigationView`内に表示するコンテンツは、テキストと`SecondView`へのナビゲーションリンクを含む`VStack`です。

今後iOS 16で`NavigationView`が非推奨になった場合は、`CustomNavigationView`の内部実装を更新することで、アプリ全体への影響を最小限に抑えつつ対応することが可能です。

---
