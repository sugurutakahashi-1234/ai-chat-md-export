# Refactor with Protocols.

日付: 2023-05-18

---

## 👤 ユーザー
*2023/05/19 01:18:27*

以下のコードをprotocol などをつかってリファクタして欲しい

```swift
enum TransitionMethod {
    case push, modal
}

enum Fruit: String, CaseIterable, Identifiable {
    case apple = "Apple"
    case banana = "Banana"
    case cherry = "Cherry"
    
    var id: String { rawValue }
    
    var transitionMethod: TransitionMethod {
        switch self {
        case .apple:
            return .push
        case .banana, .cherry:
            return .modal
        }
    }
    
    @ViewBuilder
    var destinationView: some View {
        switch self {
        case .apple:
            AppleView()
        case .banana:
            BananaView()
        case .cherry:
            CherryView()
        }
    }
}

enum Vegetable: String, CaseIterable, Identifiable {
    case carrot = "Carrot"
    case tomato = "Tomato"
    case pepper = "Pepper"
    
    var id: String { rawValue }
    
    var transitionMethod: TransitionMethod {
        switch self {
        case .carrot, .pepper:
            return .push
        case .tomato:
            return .modal
        }
    }
    
    @ViewBuilder
    var destinationView: some View {
        DetailView(item: rawValue)
    }
}

```

---

## 🤖 アシスタント
*2023/05/19 01:20:06*

コードを見ると、FruitとVegetableの両方で多くの共通点があることがわかります。それぞれが、遷移方法とデスティネーションビューを提供する方法を定義しています。これをプロトコルで一般化することができます。

まずは、新しいプロトコルを定義します。これにより遷移方法とデスティネーションビューを要求します。

```swift
protocol IdentifiableDestination {
    associatedtype DestinationView: View
    var id: String { get }
    var transitionMethod: TransitionMethod { get }
    var destinationView: DestinationView { get }
}
```

次に、このプロトコルをFruitとVegetableで採用します。

```swift
enum TransitionMethod {
    case push, modal
}

enum Fruit: String, CaseIterable, Identifiable, IdentifiableDestination {
    case apple = "Apple"
    case banana = "Banana"
    case cherry = "Cherry"
    
    var id: String { rawValue }
    
    var transitionMethod: TransitionMethod {
        switch self {
        case .apple:
            return .push
        case .banana, .cherry:
            return .modal
        }
    }
    
    @ViewBuilder
    var destinationView: some View {
        switch self {
        case .apple:
            AppleView()
        case .banana:
            BananaView()
        case .cherry:
            CherryView()
        }
    }
}

enum Vegetable: String, CaseIterable, Identifiable, IdentifiableDestination {
    case carrot = "Carrot"
    case tomato = "Tomato"
    case pepper = "Pepper"
    
    var id: String { rawValue }
    
    var transitionMethod: TransitionMethod {
        switch self {
        case .carrot, .pepper:
            return .push
        case .tomato:
            return .modal
        }
    }
    
    @ViewBuilder
    var destinationView: some View {
        DetailView(item: rawValue)
    }
}
```

この方法で、プロトコルを使用してFruitとVegetableの共通部分を一般化しました。これにより、新たに他のenumを追加する場合も同様のパターンで簡単に実装できます。また、遷移方法とデスティネーションビューを定義する要件が明確になりました。

---

## 👤 ユーザー
*2023/05/19 01:21:34*

protocol IdentifiableDestination の associatedtype DestinationView: View ってどういう意味。もっといい感じに描くことはできるの？

---

## 🤖 アシスタント
*2023/05/19 01:23:21*

Swiftの`associatedtype`キーワードはプロトコル内でプレースホルダータイプを定義します。プロトコルが採用される際、このプレースホルダータイプは具体的な型に置き換えられます。

この場合、`DestinationView`は`View`プロトコルを満たす型であることが要求されています。しかし、具体的にどの`View`型が使用されるかは、`IdentifiableDestination`プロトコルを採用する具体的な型によって決定されます。

具体的には、`Fruit`と`Vegetable` enumのそれぞれで異なる`View`を返すために、`associatedtype`を使用しています。`Fruit`は`AppleView`、`BananaView`、または`CherryView`を返し、`Vegetable`は`DetailView`を返します。

これにより、`IdentifiableDestination`プロトコルはその実装によって動的に`View`を返すことが可能になります。したがって、この`associatedtype`はこの状況では重要な役割を果たします。

しかし、`associatedtype`が必要ない場合や、単一のビュータイプが必要な場合は、このように定義することが可能です：

```swift
protocol IdentifiableDestination {
    var id: String { get }
    var transitionMethod: TransitionMethod { get }
    var destinationView: some View { get }
}
```

この場合、全ての`IdentifiableDestination`は固定の`View`型を返すことが必要になります。それは`some View`プロトコルに準拠していれば何でも良いわけですが、具体的なビューの種類を定義する柔軟性が失われてしまいます。

ですので、具体的にどの方法が「良い」かは、必要な柔軟性と使用シナリオによります。

---
