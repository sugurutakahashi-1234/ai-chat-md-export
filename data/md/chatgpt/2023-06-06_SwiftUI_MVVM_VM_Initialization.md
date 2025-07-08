# SwiftUI MVVM VM Initialization

日付: 2023-06-06

---

## 👤 ユーザー
*2023/06/06 19:59:27*

SwiftUI で MVVMアーキテクチャーでVMの初期化時に引数で値を渡したい場合はどうすればいいのかおしてほしい

---

## 🤖 アシスタント
*2023/06/06 20:00:16*

MVVMアーキテクチャでは、ViewModelはViewとModel間のコミュニケーションの主要な役割を果たします。特定のViewに関連付けられたデータとロジックは、対応するViewModel内に格納されます。

ViewModelを初期化する際に引数を渡す場合、通常はViewModelのイニシャライザを使用します。以下に具体的なコードを示します：

まず、`Model`と`ViewModel`を作成します。

```swift
struct Item {
    let id: Int
    let name: String
}

class ItemViewModel: ObservableObject {
    @Published var item: Item

    init(item: Item) {
        self.item = item
    }
}
```

ここでは、`ItemViewModel`が`Item`型の引数を受け取るイニシャライザを持っています。この`Item`は、ViewModelが初期化される際に渡されます。

そして、この`ViewModel`を使用するViewを作成します。

```swift
struct ItemView: View {
    @ObservedObject var viewModel: ItemViewModel

    var body: some View {
        Text("Item name: \(viewModel.item.name)")
    }
}
```

この`ItemView`は、`ItemViewModel`を引数として受け取ります。そして、`ViewModel`の`item`プロパティを用いてUIを描画します。

ViewModelを初期化し、そのViewModelをViewに渡す方法は以下のとおりです。

```swift
let item = Item(id: 1, name: "Example Item")
let viewModel = ItemViewModel(item: item)
let itemView = ItemView(viewModel: viewModel)
```

これで、`ItemView`は初期化時に渡された`ViewModel`を使用してUIを描画します。そして、この`ViewModel`は`Item`という引数を使用して初期化されます。

---

## 👤 ユーザー
*2023/06/06 20:00:28*

ItemView のイニシャライザで、viewModelを初期化してほしい

---

## 🤖 アシスタント
*2023/06/06 20:00:56*

確かに、Viewのイニシャライザ内でViewModelを初期化することも可能です。そのためには、ViewModelを初期化するために必要なデータをViewのイニシャライザに渡す必要があります。以下に具体的な例を示します：

まず、`Model`と`ViewModel`を作成します：

```swift
struct Item {
    let id: Int
    let name: String
}

class ItemViewModel: ObservableObject {
    @Published var item: Item

    init(item: Item) {
        self.item = item
    }
}
```

そして、この`ViewModel`を使用するViewを作成します：

```swift
struct ItemView: View {
    @ObservedObject var viewModel: ItemViewModel

    init(item: Item) {
        self.viewModel = ItemViewModel(item: item)
    }

    var body: some View {
        Text("Item name: \(viewModel.item.name)")
    }
}
```

この例では、`ItemView`のイニシャライザが引数`item`を受け取り、それを使用して`ItemViewModel`を初期化します。

最後に、このViewを初期化する例を示します：

```swift
let item = Item(id: 1, name: "Example Item")
let itemView = ItemView(item: item)
```

これで、`ItemView`は初期化時に受け取った`item`を用いて、内部で`ItemViewModel`を初期化します。

---

## 👤 ユーザー
*2023/06/06 20:29:36*

get-only property というエラーになった

---

## 🤖 アシスタント
*2023/06/06 20:30:16*

すみません、その問題は私の提案がSwiftUIのViewの制限について考慮しきれていなかったためです。SwiftUIのViewはイミュータブルである必要があり、一度作成されるとその状態は変更できません。これにより、Viewの`@ObservedObject`プロパティはget-onlyになり、イニシャライザ内で設定することはできません。

解決策の一つとして、`@StateObject`を使用する方法があります。`@StateObject`はSwiftUIが提供するプロパティラッパで、所有権を持つ参照型のオブジェクトを管理します。このラッパーを使用すると、ViewのイニシャライザでViewModelを初期化することができます。

以下に修正したコードを示します：

```swift
struct Item {
    let id: Int
    let name: String
}

class ItemViewModel: ObservableObject {
    @Published var item: Item

    init(item: Item) {
        self.item = item
    }
}

struct ItemView: View {
    @StateObject var viewModel: ItemViewModel

    init(item: Item) {
        _viewModel = StateObject(wrappedValue: ItemViewModel(item: item))
    }

    var body: some View {
        Text("Item name: \(viewModel.item.name)")
    }
}
```

この例では、`ItemView`のイニシャライザが引数`item`を受け取り、それを使用して`ItemViewModel`を初期化します。ただし、`@ObservedObject`ではなく`@StateObject`を使用しています。

この修正により、`get-only property`エラーは解消されるはずです。

---

## 👤 ユーザー
*2023/06/06 20:30:26*

これってパフォーマンス的に悪くなったりしないの？

---

## 🤖 アシスタント
*2023/06/06 20:31:05*

SwiftUIの`@StateObject`は、そのオブジェクトがViewのライフサイクル全体にわたって生存することを保証します。これは、そのオブジェクトが初期化される回数を最小限に抑えることを意味します。つまり、`@StateObject`が所有するViewModelは、Viewが再描画される度に初期化されることはありません。

一方、`@ObservedObject`はこのような保証を提供しません。`@ObservedObject`が所有するオブジェクトは、Viewの親がそのオブジェクトを再初期化することがあります。これは、パフォーマンスに影響を及ぼす可能性があります。

そのため、ViewModelを`@StateObject`として保持することは、パフォーマンス的にも望ましい場合が多いです。ただし、一般的には、どちらのプロパティラッパーを使用するかは、そのオブジェクトがどの程度のライフサイクルを持つべきかによります。

ViewModelのようなオブジェクトが長期的な状態を保持する場合、またはそのオブジェクトが資源を消費する場合（たとえば、ネットワークリクエストを行うなど）、`@StateObject`を使用することが推奨されます。これにより、オブジェクトが適切に管理され、そのライフサイクルが保証されます。

このため、ViewのイニシャライザでViewModelを初期化し、それを`@StateObject`として保持することは、パフォーマンスにとって有益な場合が多いです。

---
