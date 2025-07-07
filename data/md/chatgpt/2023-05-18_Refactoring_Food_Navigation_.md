# Refactoring Food Navigation.

日付: 2023-05-18

---

## 👤 ユーザー
*2023/5/19 2:45:02*

以下のコードなんだけど、リファクタリングしてほしい。
特に List の内側の記述が共通化できそうな気がする

```swift
public protocol ForEachAllCasesUsable: CaseIterable, Identifiable, RawRepresentable {}

extension ForEachAllCasesUsable {
    public var id: RawValue { self.rawValue }
}

private enum TransitionMethod {
    case push, modal
}

private protocol Navigatable: ForEachAllCasesUsable {
    associatedtype DestinationView: View
    var name: String { get }
    var transitionMethod: TransitionMethod { get }
    var destinationView: DestinationView { get }
}

private enum Fruit: String, Navigatable {
    case apple = "Apple"
    case banana = "Banana"
    case cherry = "Cherry"
    
    var name: String {
        rawValue
    }

    fileprivate var transitionMethod: TransitionMethod {
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

private enum Vegetable: String, Navigatable {
    case carrot = "Carrot"
    case tomato = "Tomato"
    case pepper = "Pepper"
    
    var name: String {
        rawValue
    }

    fileprivate var transitionMethod: TransitionMethod {
        switch self {
        case .carrot, .pepper:
            return .push
        case .tomato:
            return .modal
        }
    }
    
    @ViewBuilder
    var destinationView: some View {
        DetailView(item: self.rawValue)
    }
}

struct SettingView: View {
    @State private var showFruitModal: Fruit?
    @State private var showVegetableModal: Vegetable?

    var body: some View {
        NavigationView {
            List {
                Section(header: Text("Fruits")) {
                    ForEach(Fruit.allCases) { item in
                        switch item.transitionMethod {
                        case .push:
                            NavigationLink(destination: item.destinationView) {
                                Text(item.name)
                            }
                        case .modal:
                            Button(action: {
                                showFruitModal = item
                            }) {
                                Text(item.name)
                            }
                        }
                    }
                    .listRowSeparatorTint(.blue)
                }
                Section(header: Text("Vegetables")) {
                    ForEach(Vegetable.allCases) { item in
                        switch item.transitionMethod {
                        case .push:
                            NavigationLink(destination: item.destinationView) {
                                Text(item.name)
                            }
                        case .modal:
                            Button(action: {
                                showVegetableModal = item
                            }) {
                                Text(item.name)
                            }
                        }
                    }
                    .listRowSeparatorTint(.red)
                }
            }
            .listStyle(.automatic)
            .navigationBarTitle("Food List")
            .sheet(item: $showFruitModal) { $0.destinationView }
            .sheet(item: $showVegetableModal) { $0.destinationView }
        }
    }
}

```

---

## 🤖 アシスタント
*2023/5/19 2:47:51*

このコードの主な課題は、`Fruit`と`Vegetable`列挙体があまりにも類似していることです。しかし、彼らのコードを共有するためには、Swiftのジェネリック機能を使用することが有効です。

まずは、`FoodItem`というジェネリックなプロトコルを導入しましょう。このプロトコルは`Navigatable`として設定し、食品のタイプをジェネリックパラメータとして持つようにします。

```swift
private protocol FoodItem: Navigatable {
    associatedtype FoodType: RawRepresentable where FoodType.RawValue == String, FoodType: CaseIterable
    var foodType: FoodType { get }
}
```

次に、この`FoodItem`プロトコルを満たす新しい構造体を作成します。これにより、食品アイテムを表示する際のロジックを1箇所にまとめることができます。

```swift
struct GeneralFoodItem<T: RawRepresentable>: FoodItem where T.RawValue == String, T: CaseIterable {
    var foodType: T
    
    var rawValue: String {
        foodType.rawValue
    }
    
    var name: String {
        rawValue
    }

    fileprivate var transitionMethod: TransitionMethod {
        switch foodType {
        case .apple, .carrot, .pepper:
            return .push
        default:
            return .modal
        }
    }

    @ViewBuilder
    var destinationView: some View {
        switch foodType {
        case .apple:
            AppleView()
        case .banana:
            BananaView()
        case .cherry:
            CherryView()
        default:
            DetailView(item: rawValue)
        }
    }
}
```

そして、それぞれの`Fruit`と`Vegetable`は以下のようになります。

```swift
private enum FruitType: String, CaseIterable {
    case apple = "Apple"
    case banana = "Banana"
    case cherry = "Cherry"
}

private enum VegetableType: String, CaseIterable {
    case carrot = "Carrot"
    case tomato = "Tomato"
    case pepper = "Pepper"
}

typealias Fruit = GeneralFoodItem<FruitType>
typealias Vegetable = GeneralFoodItem<VegetableType>
```

さらに`SettingView`も一部修正が必要です。`showFruitModal`と`showVegetableModal`を1つのジェネリックな`showModal`にまとめます。新しい`showModal`は`Optional<FoodItem>`として定義します。

```swift
struct SettingView: View {
    @State private var showModal: FoodItem?

    var body: some View {
        NavigationView {
            List {
                foodSection(title: "Fruits", items: FruitType.allCases.map { Fruit(foodType: $0) }, color: .blue)
                foodSection(title: "Vegetables", items: VegetableType.allCases.map { Vegetable(foodType: $0) }, color: .red)
            }
            .listStyle(.automatic)
            .navigationBarTitle("Food List")
            .sheet(item: $showModal) {

---

## 🤖 アシスタント
*2023/5/19 2:48:32*

$0.destinationView }
        }
    }

    @ViewBuilder
    private func foodSection<T: FoodItem>(title: String, items: [T], color: Color) -> some View {
        Section(header: Text(title)) {
            ForEach(items) { item in
                switch item.transitionMethod {
                case .push:
                    NavigationLink(destination: item.destinationView) {
                        Text(item.name)
                    }
                case .modal:
                    Button(action: {
                        showModal = item
                    }) {
                        Text(item.name)
                    }
                }
            }
            .listRowSeparatorTint(color)
        }
    }
}
```

以上のようにすることで、`Fruit`と`Vegetable`の大部分のコードを共有することが可能になり、さらに`SettingView`内での重複も大幅に削減できました。

---

## 👤 ユーザー
*2023/5/19 2:50:06*

ジェネリックなプロトコルをつかわないようにして書くとどうなるの？AnyとかAnyViewはつかってほしくない。

---

## 🤖 アシスタント
*2023/5/19 2:52:00*

了解しました。その場合、各項目を表示する共通の関数を作成し、リストでの表示をその関数に委譲することでリファクタリングを行うことができます。

まず、`Navigatable` プロトコルに一致する各要素のリストを表示する関数を作成します。ここでは、トランジションメソッドに基づいて適切なビューを作成します。そして、この関数に適用するセクションヘッダーのテキストとセパレータの色も引数として受け取ります。

```swift
struct SettingView: View {
    @State private var showFruitModal: Fruit?
    @State private var showVegetableModal: Vegetable?
    
    var body: some View {
        NavigationView {
            List {
                sectionForItems("Fruits", items: Fruit.allCases, modalItem: $showFruitModal, color: .blue)
                sectionForItems("Vegetables", items: Vegetable.allCases, modalItem: $showVegetableModal, color: .red)
            }
            .listStyle(.automatic)
            .navigationBarTitle("Food List")
            .sheet(item: $showFruitModal) { $0.destinationView }
            .sheet(item: $showVegetableModal) { $0.destinationView }
        }
    }
    
    private func sectionForItems<T: Navigatable>(_ header: String, items: [T], modalItem: Binding<T?>, color: Color) -> some View {
        Section(header: Text(header)) {
            ForEach(items) { item in
                switch item.transitionMethod {
                case .push:
                    NavigationLink(destination: item.destinationView) {
                        Text(item.name)
                    }
                case .modal:
                    Button(action: {
                        modalItem.wrappedValue = item
                    }) {
                        Text(item.name)
                    }
                }
            }
            .listRowSeparatorTint(color)
        }
    }
}
```

このように、共通のビュー生成ロジックを `sectionForItems` 関数内に移動することで、重複を削減することができます。このアプローチは、ジェネリックなプロトコルを使用せず、`Any` または `AnyView` も使用しない場合の良い解決策です。ただし、`Fruit` と `Vegetable` それぞれに対するモーダル表示状態を保持するために、別々の変数が必要である点は変わりません。

---

## 👤 ユーザー
*2023/5/19 2:53:00*

これは結構いいかもね。ありがとう。ちなみにこのコードは動くよね？

---

## 🤖 アシスタント
*2023/5/19 2:54:27*

はい、このコードはSwiftUIで正常に動作するはずです。ただし、以下の前提条件が必要です：

1. `AppleView()`, `BananaView()`, `CherryView()`, および `DetailView(item:)` は `View` を適用する有効なビューであること。
2. `Fruit` および `Vegetable` 列挙型が正確に定義され、適切に `Navigatable` プロトコルに準拠していること。

なお、具体的なUIコンポーネントや遷移については、使用しているSwiftUIのバージョンやターゲットとなるプラットフォーム（iOS, macOSなど）により動作が異なる場合があります。そのため、具体的なプロジェクトの環境に合わせてテストと適応が必要です。

その上で、以下の2点を念頭に置いておくとよいでしょう。

- SwiftUIのビューは宣言的であり、`body` プロパティの内容がビューの状態を表現しています。したがって、このコードはUIの状態を正確に反映するはずです。
- `@State` プロパティラッパーはSwiftUIのビュー内で状態を管理するためのもので、ビューがリフレッシュされるときにその状態を保持します。ここでは、モーダルを表示するための状態を保持しています。この状態が変わると、ビューは自動的に再描画され、新しい状態を反映します。

---

## 👤 ユーザー
*2023/5/19 2:55:10*

ちなみに、このリファクタによって、ビルドが遅くなったり、パフォーマンスが悪くなったりするかな？

---

## 🤖 アシスタント
*2023/5/19 2:56:38*

リファクタリングの目的はコードの可読性やメンテナンス性を向上させることであり、通常はパフォーマンスに大きな影響を及ぼすことはありません。特にこの提案したリファクタリングでは、コードの構造を改善し、重複を減らすことを主目的としています。したがって、ビルド時間やランタイムパフォーマンスに顕著な影響を及ぼすことはほぼないと考えられます。

ただし、一部のリファクタリング（特に大規模なもの）はコンパイル時間に影響を及ぼす可能性があります。たとえば、高度なジェネリクスや複雑な型推論を多用すると、Swiftのコンパイラはそれらを解決するのに時間がかかることがあります。しかし、このケースではそういった複雑な機能は使用していないため、コンパイル時間に大きな影響はないはずです。

ランタイムパフォーマンスについても、このリファクタリングが影響を及ぼす可能性は低いです。SwiftUIは非常に効率的な差分計算アルゴリズムを使用しているため、ビュー階層の変更は最小限に抑えられ、描画パフォーマンスも一般的には高いです。

ただし、最終的にはプロファイラを使用してパフォーマンスを測定することが重要です。これにより、具体的なパフォーマンス影響を定量化し、必要に応じて最適化を行うことができます。

---

## 👤 ユーザー
*2023/5/19 3:02:31*

なるほど、ちなみに以下のようなObservableObjectを使って、SettingView 側の @State を削除した場合はどうやって書けばいいかな。一旦、アクセス修飾子は今までのは全部public だと思って修正していいよ

```swift
class SettingViewModel: ObservableObject {
    @Published var showFruitModal: Fruit?
    @Published var showVegetableModal: Vegetable?
}
```

---

## 🤖 アシスタント
*2023/5/19 3:03:59*

`ObservableObject`を使用すると、状態管理を `SettingView`から `SettingViewModel`に移動できます。 `SettingView` では `SettingViewModel` のインスタンスを `@ObservedObject` プロパティラッパーで参照します。それにより、モーダルの表示状態が更新されると、ビューが自動的に更新されます。

以下に、それを実現するためのコードを示します：

```swift
public class SettingViewModel: ObservableObject {
    @Published public var showFruitModal: Fruit?
    @Published public var showVegetableModal: Vegetable?
}

public struct SettingView: View {
    @ObservedObject var viewModel = SettingViewModel()
    
    public var body: some View {
        NavigationView {
            List {
                sectionForItems("Fruits", items: Fruit.allCases, modalItem: $viewModel.showFruitModal, color: .blue)
                sectionForItems("Vegetables", items: Vegetable.allCases, modalItem: $viewModel.showVegetableModal, color: .red)
            }
            .listStyle(.automatic)
            .navigationBarTitle("Food List")
            .sheet(item: $viewModel.showFruitModal) { $0.destinationView }
            .sheet(item: $viewModel.showVegetableModal) { $0.destinationView }
        }
    }
    
    private func sectionForItems<T: Navigatable>(_ header: String, items: [T], modalItem: Binding<T?>, color: Color) -> some View {
        Section(header: Text(header)) {
            ForEach(items) { item in
                switch item.transitionMethod {
                case .push:
                    NavigationLink(destination: item.destinationView) {
                        Text(item.name)
                    }
                case .modal:
                    Button(action: {
                        modalItem.wrappedValue = item
                    }) {
                        Text(item.name)
                    }
                }
            }
            .listRowSeparatorTint(color)
        }
    }
}
```

これにより、`SettingView`のコードがさらにシンプルになりました。また、状態管理が `SettingViewModel`に集約されるため、テストや再利用がより容易になります。

---

## 👤 ユーザー
*2023/5/19 3:06:17*

ちなみに modalItem.wrappedValue = item をやめて、SettingViewModel の関数経由で値の更新ができたりしますか？

---

## 🤖 アシスタント
*2023/5/19 3:09:25*

はい、それは可能です。そのためには、`SettingViewModel`に新たなメソッドを追加して、そこから`showFruitModal`と`showVegetableModal`を更新します。

以下にその例を示します：

```swift
public class SettingViewModel: ObservableObject {
    @Published public var showFruitModal: Fruit?
    @Published public var showVegetableModal: Vegetable?

    public func showModal<T: Navigatable>(_ item: T) {
        if let fruitItem = item as? Fruit {
            showFruitModal = fruitItem
        } else if let vegetableItem = item as? Vegetable {
            showVegetableModal = vegetableItem
        }
    }
}

public struct SettingView: View {
    @ObservedObject var viewModel = SettingViewModel()
    
    public var body: some View {
        NavigationView {
            List {
                sectionForItems("Fruits", items: Fruit.allCases, color: .blue)
                sectionForItems("Vegetables", items: Vegetable.allCases, color: .red)
            }
            .listStyle(.automatic)
            .navigationBarTitle("Food List")
            .sheet(item: $viewModel.showFruitModal) { $0.destinationView }
            .sheet(item: $viewModel.showVegetableModal) { $0.destinationView }
        }
    }
    
    private func sectionForItems<T: Navigatable>(_ header: String, items: [T], color: Color) -> some View {
        Section(header: Text(header)) {
            ForEach(items) { item in
                switch item.transitionMethod {
                case .push:
                    NavigationLink(destination: item.destinationView) {
                        Text(item.name)
                    }
                case .modal:
                    Button(action: {
                        viewModel.showModal(item)
                    }) {
                        Text(item.name)
                    }
                }
            }
            .listRowSeparatorTint(color)
        }
    }
}
```

このようにすることで、`SettingViewModel`が全ての状態更新を管理します。これはViewModelがどのように動作すべきかを明示的に示す一方で、ビューからはその詳細を隠蔽します。これにより、ビューとビジネスロジックの分離を強化し、コードの再利用性とテストのしやすさを向上させます。

---

## 👤 ユーザー
*2023/5/19 3:12:25*

func showModal&lt;T: Navigatable&gt;(\_ item: T) {} は Fruit または Vegetable が来なかったらエラーにしたいんだけどうまく記述できないかな？

---

## 🤖 アシスタント
*2023/5/19 3:13:35*

Swiftではジェネリック関数の引数の型が特定の型に限定されていない場合、実行時にチェックできますが、コンパイル時にそれを強制することはできません。ただし、期待しない型がこの関数に渡されたときにランタイムエラーを投げることは可能です。

そのためには、関数の内部で条件をチェックし、条件を満たさない場合は`fatalError()`を呼び出すことができます。`fatalError()`はプログラムを終了し、エラーメッセージを出力します。これを利用すると、以下のような実装が可能です。

```swift
public func showModal<T: Navigatable>(_ item: T) {
    if let fruitItem = item as? Fruit {
        showFruitModal = fruitItem
    } else if let vegetableItem = item as? Vegetable {
        showVegetableModal = vegetableItem
    } else {
        fatalError("Unexpected item type: \(type(of: item))")
    }
}
```

これにより、期待しない型が渡されるとプログラムは即座に終了し、エラーメッセージが表示されます。ただし、このような実装はランタイムエラーを発生させるため、原則としては回避するべきです。期待しない型が渡されることがあり得るなら、エラーハンドリングのメカニズムを適切に設計することを検討してみてください。

---

## 👤 ユーザー
*2023/5/19 3:14:14*

ちなみに Switch 文できれいに書けないかな？

---

## 🤖 アシスタント
*2023/5/19 3:14:57*

Swiftのswitch文では、特定の型にキャストすることで期待する型をチェックできます。また、`default`節を使用すると、その他のすべてのケースをカバーすることができます。以下にその例を示します：

```swift
public func showModal<T: Navigatable>(_ item: T) {
    switch item {
    case let fruitItem as Fruit:
        showFruitModal = fruitItem
    case let vegetableItem as Vegetable:
        showVegetableModal = vegetableItem
    default:
        fatalError("Unexpected item type: \(type(of: item))")
    }
}
```

このコードは、元のコードと同じように動作しますが、switch文を使用することで、それぞれのケースが明確になり、読みやすくなります。さらに、新たなケースを追加する場合も、それぞれのケースを独立したブロックとして追加できるため、メンテナンスが容易になります。

---

## 👤 ユーザー
*2023/5/19 3:20:30*

以下のコードって some とか使って綺麗に書けなかったっけ？

```swift
```

---

## 🤖 アシスタント
*2023/5/19 3:20:37*

すみませんが、コードの内容が指定されていません。

---
