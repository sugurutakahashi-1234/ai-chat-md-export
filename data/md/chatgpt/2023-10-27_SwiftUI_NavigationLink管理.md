# SwiftUI NavigationLink管理

Date: 2023-10-27

---

## 👤 User
*2023-10-27 17:44:10*

SwiftUIでListで表示されたナビゲーションLinkで2回画面遷移した後に一気にTopまで戻りたい

---

## 🤖 Assistant
*2023-10-27 17:45:20*

SwiftUI の `NavigationLink` で画面遷移を行った場合、一気にトップまで戻るための明示的な方法は、通常のナビゲーションスタックをポップする方法としては用意されていません。ただし、いくつかの方法でこのような動作を模倣することができます。

1. **NavigationLinkのisActiveバインディングを使用**:
   各 `NavigationLink` に `isActive` バインディングを設定し、これを使ってプログラム的に遷移を制御します。全ての遷移のアクティブ状態を管理するための共有の状態変数を使用することで、一気にトップに戻ることができます。

```swift
struct ContentView: View {
    @State private var isLink1Active = false
    @State private var isLink2Active = false

    var body: some View {
        NavigationView {
            VStack {
                NavigationLink(destination: SecondView(isLink2Active: $isLink2Active),
                               isActive: $isLink1Active) {
                    Text("Go to Second View")
                }
            }
            .navigationBarTitle("First View", displayMode: .inline)
        }
    }
}

struct SecondView: View {
    @Binding var isLink2Active: Bool

    var body: some View {
        VStack {
            NavigationLink(destination: ThirdView(), isActive: $isLink2Active) {
                Text("Go to Third View")
            }
        }
        .navigationBarTitle("Second View", displayMode: .inline)
        .navigationBarBackButtonHidden(true)
        .navigationBarItems(leading: Button("Back to Top") {
            // Set both to false to return to the top
            isLink2Active = false
        })
    }
}

struct ThirdView: View {
    var body: some View {
        Text("Third View")
            .navigationBarTitle("Third View", displayMode: .inline)
    }
}
```

2. **自前でスタック管理を行う**: 
    自分で遷移のスタックを実装し、`NavigationLink` ではなくカスタムのビュー遷移の方法を使用して、一気にトップに戻る動作を実装することもできます。

どの方法が最も適しているかは、アプリの要件や遷移の複雑さ、および将来の拡張性などの要因によって異なります。必要に応じて適切なアプローチを選択してください。

---

## 👤 User
*2023-10-27 17:51:27*

NavigationLinkのisActiveバインディングを使用: は一つしか戻れなくないでしょうか？

---

## 🤖 Assistant
*2023-10-27 17:52:33*

申し訳ございません、その通りです。一つ前の画面に戻るためには`isActive`バインディングのみでは不十分です。複数の`NavigationLink`に跨る遷移を解除するには、全ての`isActive`を連続して更新する必要があります。

以下のような方法で複数の`NavigationLink`を戻ることができます:

```swift
struct ContentView: View {
    @State private var isLink1Active = false
    @State private var isLink2Active = false

    var body: some View {
        NavigationView {
            VStack {
                NavigationLink(destination: SecondView(isLink1Active: $isLink1Active, isLink2Active: $isLink2Active),
                               isActive: $isLink1Active) {
                    Text("Go to Second View")
                }
            }
            .navigationBarTitle("First View", displayMode: .inline)
        }
    }
}

struct SecondView: View {
    @Binding var isLink1Active: Bool
    @Binding var isLink2Active: Bool

    var body: some View {
        VStack {
            NavigationLink(destination: ThirdView(isLink1Active: $isLink1Active, isLink2Active: $isLink2Active),
                           isActive: $isLink2Active) {
                Text("Go to Third View")
            }
        }
        .navigationBarTitle("Second View", displayMode: .inline)
        .navigationBarBackButtonHidden(true)
        .navigationBarItems(leading: Button("Back to Top") {
            // Set both to false to return to the top
            isLink2Active = false
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                isLink1Active = false
            }
        })
    }
}

struct ThirdView: View {
    @Binding var isLink1Active: Bool
    @Binding var isLink2Active: Bool

    var body: some View {
        Text("Third View")
            .navigationBarTitle("Third View", displayMode: .inline)
    }
}
```

このアプローチでは、`DispatchQueue.main.asyncAfter`を使用して少しの遅延を持たせ、連続して`isActive`を`false`に設定することで、複数の画面を一気に戻ります。この遅延は必要となる場合もあるので、適切に動作するか確認することが必要です。

---

## 👤 User
*2023-10-27 18:01:03*

わかった。一旦別の話で。
SwiftUIでNavigationLinkを使わないでListでNavigationLinkっぽくしたい。

---

## 🤖 Assistant
*2023-10-27 18:01:11*

SwiftUIで`NavigationLink`を使わないで、`List`の中で`NavigationLink`っぽい動作を実現するための一つの方法は、自前で画面遷移の管理を行

---
