# NavigationView with Section & ForEach

Date: 2023-05-18

---

## 👤 User
*2023-05-18 16:36:18*

SwftUI で NavigationView で List の中身を Section と ForEach で処理するような push 遷移するサンプルコードがほしい

---

## 🤖 Assistant
*2023-05-18 16:38:18*

SwiftUIでNavigationView内にあるListを、SectionとForEachを用いて管理し、その項目を選択したときに新しいViewに遷移する(push遷移)サンプルコードは以下のようになります。

以下は、各セクションごとに違うタイプのデータを表示する例を示しています。それぞれの項目を選択すると、詳細ビューに遷移します。

```swift
import SwiftUI

struct ContentView: View {
    // ここでテストデータを準備します
    let fruits = ["Apple", "Banana", "Cherry"]
    let vegetables = ["Carrot", "Tomato", "Pepper"]
    
    var body: some View {
        NavigationView {
            List {
                // フルーツセクション
                Section(header: Text("Fruits")) {
                    ForEach(fruits, id: \.self) { fruit in
                        NavigationLink(destination: DetailView(item: fruit)) {
                            Text(fruit)
                        }
                    }
                }
                // 野菜セクション
                Section(header: Text("Vegetables")) {
                    ForEach(vegetables, id: \.self) { vegetable in
                        NavigationLink(destination: DetailView(item: vegetable)) {
                            Text(vegetable)
                        }
                    }
                }
            }
            .listStyle(GroupedListStyle())
            .navigationBarTitle("Food List")
        }
    }
}

struct DetailView: View {
    let item: String
    
    var body: some View {
        Text("You selected \(item)")
            .navigationBarTitle(item)
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
```

この例では、NavigationView内のListに2つのSectionを作成しました。それぞれのセクションには異なるデータ（`fruits`と`vegetables`）が含まれています。それぞれのデータ項目に対して、ForEachループを使用して個々の行を作成します。

各行はNavigationLinkで囲まれており、その目的地（遷移先）はDetailViewです。この詳細ビューには、選択された項目の名前が表示されます。

---

## 👤 User
*2023-05-18 16:38:45*

フルーツセクション と 野菜セクション があるけど、これらも ForEach でまとめられないの？

---

## 🤖 Assistant
*2023-05-18 16:40:27*

もちろんです、SwiftUIではForEachを使って複数のSectionを動的に生成することも可能です。以下にそれを実現するサンプルコードを示します：

```swift
import SwiftUI

struct ContentView: View {
    // データをセクションごとに定義します
    let data = [
        ("Fruits", ["Apple", "Banana", "Cherry"]),
        ("Vegetables", ["Carrot", "Tomato", "Pepper"])
    ]
    
    var body: some View {
        NavigationView {
            List {
                // セクションを動的に生成します
                ForEach(data, id: \.0) { section, items in
                    Section(header: Text(section)) {
                        ForEach(items, id: \.self) { item in
                            NavigationLink(destination: DetailView(item: item)) {
                                Text(item)
                            }
                        }
                    }
                }
            }
            .listStyle(GroupedListStyle())
            .navigationBarTitle("Food List")
        }
    }
}

struct DetailView: View {
    let item: String
    
    var body: some View {
        Text("You selected \(item)")
            .navigationBarTitle(item)
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
```
この例では、data配列を作成してセクションのヘッダー（"Fruits"、"Vegetables"）と各セクションのアイテムのリストを持たせています。それから、最初のForEachループでセクションを生成し、その中でさらに2つ目のForEachループを使って各セクションのアイテムを生成しています。

そして、個々のアイテムを選択したときには、DetailViewに遷移するようになっています。これは前の例と同様です。

---

## 👤 User
*2023-05-18 16:40:42*

さらに、Fruit という enum と Vegetable という enum を定義して、リファクタして欲しい

---

## 🤖 Assistant
*2023-05-18 16:42:56*

おっしゃる通りに、`Fruit`と`Vegetable`というenumを定義し、それらを用いてコードをリファクタリングすることができます。以下にそのサンプルコードを示します：

```swift
import SwiftUI

// 各セクションのenumを定義します
enum Fruit: String, CaseIterable {
    case apple = "Apple"
    case banana = "Banana"
    case cherry = "Cherry"
}

enum Vegetable: String, CaseIterable {
    case carrot = "Carrot"
    case tomato = "Tomato"
    case pepper = "Pepper"
}

// 各セクションのデータを表すenumを定義します
enum FoodSection {
    case fruits, vegetables
    
    var title: String {
        switch self {
        case .fruits:
            return "Fruits"
        case .vegetables:
            return "Vegetables"
        }
    }
    
    var items: [String] {
        switch self {
        case .fruits:
            return Fruit.allCases.map { $0.rawValue }
        case .vegetables:
            return Vegetable.allCases.map { $0.rawValue }
        }
    }
}

struct ContentView: View {
    // 全セクションを配列で準備します
    let data: [FoodSection] = [.fruits, .vegetables]
    
    var body: some View {
        NavigationView {
            List {
                // 各セクションを動的に生成します
                ForEach(data, id: \.title) { section in
                    Section(header: Text(section.title)) {
                        ForEach(section.items, id: \.self) { item in
                            NavigationLink(destination: DetailView(item: item)) {
                                Text(item)
                            }
                        }
                    }
                }
            }
            .listStyle(GroupedListStyle())
            .navigationBarTitle("Food List")
        }
    }
}

struct DetailView: View {
    let item: String
    
    var body: some View {
        Text("You selected \(item)")
            .navigationBarTitle(item)
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
```

この例では、`Fruit`と`Vegetable`というenumを定義しています。それぞれのenumはCaseIterableプロトコルを採用しており、これにより全ケースのリストを取得できます。

次に、`FoodSection`というenumを定義しています。これは各セクションのデータを表すためのもので、それぞれのセクションのタイトルと項目のリストを持っています。

そして、これらのenumを用いて、List内のセクションとその項目を動的に生成しています。

---

## 👤 User
*2023-05-18 16:44:10*

Vegetable の遷移先は DetailView のままで、Apple は AppleView()、Banana は BananaView()、CherryはCherryView() に遷移させたい場合はどう書けばいい？

---

## 🤖 Assistant
*2023-05-18 16:46:27*

ご指定の通りに、遷移先を変更するためには、NavigationLinkのdestinationを動的に設定する必要があります。以下にそのサンプルコードを示します：

```swift
import SwiftUI

// 各セクションのenumを定義します
enum Fruit: String, CaseIterable {
    case apple = "Apple"
    case banana = "Banana"
    case cherry = "Cherry"
}

enum Vegetable: String, CaseIterable {
    case carrot = "Carrot"
    case tomato = "Tomato"
    case pepper = "Pepper"
}

// 各セクションのデータを表すenumを定義します
enum FoodSection {
    case fruits, vegetables
    
    var title: String {
        switch self {
        case .fruits:
            return "Fruits"
        case .vegetables:
            return "Vegetables"
        }
    }
    
    var items: [String] {
        switch self {
        case .fruits:
            return Fruit.allCases.map { $0.rawValue }
        case .vegetables:
            return Vegetable.allCases.map { $0.rawValue }
        }
    }
}

struct ContentView: View {
    // 全セクションを配列で準備します
    let data: [FoodSection] = [.fruits, .vegetables]
    
    var body: some View {
        NavigationView {
            List {
                // 各セクションを動的に生成します
                ForEach(data, id: \.title) { section in
                    Section(header: Text(section.title)) {
                        ForEach(section.items, id: \.self) { item in
                            NavigationLink(destination: destinationView(for: item, in: section)) {
                                Text(item)
                            }
                        }
                    }
                }
            }
            .listStyle(GroupedListStyle())
            .navigationBarTitle("Food List")
        }
    }
    
    // 遷移先を返すヘルパーメソッド
    @ViewBuilder
    private func destinationView(for item: String, in section: FoodSection) -> some View {
        switch section {
        case .fruits:
            switch Fruit(rawValue: item) {
            case .apple:
                AppleView()
            case .banana:
                BananaView()
            case .cherry:
                CherryView()
            case .none:
                Text("Unknown Fruit")
            }
        case .vegetables:
            DetailView(item: item)
        }
    }
}

struct DetailView: View {
    let item: String
    
    var body: some View {
        Text("You selected \(item)")
            .navigationBarTitle(item)
    }
}

// 各フルーツ用のViewを定義します
struct AppleView: View {
    var body: some View {
        Text("This is Apple View")
            .navigationBarTitle("Apple")
    }
}

struct BananaView: View {
    var body: some View {
        Text("This is Banana View")
            .navigationBarTitle("Banana")
    }
}

struct CherryView: View {
    var body: some View {
        Text("This is Cherry View")
            .navigationBarTitle("Cherry")
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
```

この例では、新たに`destinationView(for:in:)`というヘルパーメソッドを定義しています。このメソッドは選択

---

## 👤 User
*2023-05-18 16:46:46*

つづき

---

## 🤖 Assistant
*2023-05-18 16:47:54*

ごめんなさい、メッセージが途切れてしまいました。

この`destinationView(for:in:)`メソッドは、選択されたアイテムとその所属するセクションに基づいて遷移先のViewを動的に返す役割を持っています。

具体的には、選択されたセクションがフルーツである場合、選択されたアイテムに基づいて`AppleView()`, `BananaView()`, `CherryView()`のいずれかを返します。アイテムがこれらのいずれにも該当しない場合（例えば新たなフルーツが追加されたが、対応するViewがまだ定義されていない場合など）は、"Unknown Fruit"というテキストが表示されるデフォルトのViewを返します。

一方、選択されたセクションが野菜である場合、引き続き`DetailView(item: item)`を遷移先として返します。

また、このコードでは`@ViewBuilder`アノテーションを使用しています。これは、複数のViewからなる複合的なViewを作ることを可能にします。そのため、このメソッドが複数の異なるViewタイプ（`AppleView`, `BananaView`, `CherryView`, `DetailView`）を返すことができるのです。

---

## 👤 User
*2023-05-18 16:48:23*

func destinationView(for item: String, in section: FoodSection) -&gt; some View を FoodSection にきじゅつすることはできない？

---

## 🤖 Assistant
*2023-05-18 16:50:19*

はい、その通りです。`destinationView(for: String)`メソッドを`FoodSection`のインスタンスメソッドとして定義することで、より整理された形にリファクタリングすることができます。以下にそのサンプルコードを示します：

```swift
import SwiftUI

// 各セクションのenumを定義します
enum Fruit: String, CaseIterable {
    case apple = "Apple"
    case banana = "Banana"
    case cherry = "Cherry"
}

enum Vegetable: String, CaseIterable {
    case carrot = "Carrot"
    case tomato = "Tomato"
    case pepper = "Pepper"
}

// 各セクションのデータを表すenumを定義します
enum FoodSection {
    case fruits, vegetables
    
    var title: String {
        switch self {
        case .fruits:
            return "Fruits"
        case .vegetables:
            return "Vegetables"
        }
    }
    
    var items: [String] {
        switch self {
        case .fruits:
            return Fruit.allCases.map { $0.rawValue }
        case .vegetables:
            return Vegetable.allCases.map { $0.rawValue }
        }
    }
    
    // 遷移先を返すメソッドをインスタンスメソッドとして定義します
    @ViewBuilder
    func destinationView(for item: String) -> some View {
        switch self {
        case .fruits:
            switch Fruit(rawValue: item) {
            case .apple:
                AppleView()
            case .banana:
                BananaView()
            case .cherry:
                CherryView()
            case .none:
                Text("Unknown Fruit")
            }
        case .vegetables:
            DetailView(item: item)
        }
    }
}

struct ContentView: View {
    // 全セクションを配列で準備します
    let data: [FoodSection] = [.fruits, .vegetables]
    
    var body: some View {
        NavigationView {
            List {
                // 各セクションを動的に生成します
                ForEach(data, id: \.title) { section in
                    Section(header: Text(section.title)) {
                        ForEach(section.items, id: \.self) { item in
                            NavigationLink(destination: section.destinationView(for: item)) {
                                Text(item)
                            }
                        }
                    }
                }
            }
            .listStyle(GroupedListStyle())
            .navigationBarTitle("Food List")
        }
    }
}

// 以下のコードは前と同じです
...
```

この例では、`FoodSection`enumに新たな`destinationView(for:)`メソッドを追加しています。このメソッドは`item`を引数に取り、それがフルーツセクションなのか野菜セクションなのかに基づいて適切な遷移先Viewを返します。ContentView内では、この新たなメソッドを直接呼び出すことで遷移先Viewを設定しています。

---

## 👤 User
*2023-05-18 16:50:47*

CherryView() と BananaView() はモーダル遷移させたいんだけどどうすればいい？

---

## 🤖 Assistant
*2023-05-18 16:53:08*

SwiftUIでは`NavigationLink`の代わりに`sheet`または`fullScreenCover`を用いてモーダル遷移を実装できます。それぞれの方法で遷移するViewを制御するためには、各Viewの表示状態を示すBool値を保持する必要があります。

以下のコードでは、モーダル表示に関連する状態変数をContentViewに追加し、その状態に基づいて`sheet`と`NavigationLink`を制御します。具体的には、アイテムが"Cherry"または"Banana"の場合、そのアイテム名をモーダル表示用の状態変数に保存し、それ以外の場合は通常のNavigationLinkを使用します。

また、モーダル表示を閉じるための機能も追加します。

```swift
import SwiftUI

// 各セクションのenumを定義します
enum Fruit: String, CaseIterable {
    case apple = "Apple"
    case banana = "Banana"
    case cherry = "Cherry"
}

enum Vegetable: String, CaseIterable {
    case carrot = "Carrot"
    case tomato = "Tomato"
    case pepper = "Pepper"
}

// 各セクションのデータを表すenumを定義します
enum FoodSection {
    case fruits, vegetables
    
    var title: String {
        switch self {
        case .fruits:
            return "Fruits"
        case .vegetables:
            return "Vegetables"
        }
    }
    
    var items: [String] {
        switch self {
        case .fruits:
            return Fruit.allCases.map { $0.rawValue }
        case .vegetables:
            return Vegetable.allCases.map { $0.rawValue }
        }
    }
    
    // 遷移先を返すメソッドをインスタンスメソッドとして定義します
    @ViewBuilder
    func destinationView(for item: String) -&gt; some View {
        switch self {
        case .fruits:
            switch Fruit(rawValue: item) {
            case .apple:
                AppleView()
            case .none:
                Text("Unknown Fruit")
            default:
                // Cherry and Banana are handled outside
                EmptyView()
            }
        case .vegetables:
            DetailView(item: item)
        }
    }
}

struct ContentView: View {
    // 全セクションを配列で準備します
    let data: [FoodSection] = [.fruits, .vegetables]
    // モーダル表示用の状態変数を追加します
    @State private var showModal: String?
    
    var body: some View {
        NavigationView {
            List {
                // 各セクションを動的に生成します
                ForEach(data, id: \.title) { section in
                    Section(header: Text(section.title)) {
                        ForEach(section.items, id: \.self) { item in
                            if item == "Cherry" || item == "Banana" {
                                // CherryとBananaはモーダル表示します
                                Button(action: {
                                    showModal = item
                                }) {

---

## 👤 User
*2023-05-18 16:53:25*

struct ContentView: View { から続きを書いて

---

## 🤖 Assistant
*2023-05-18 16:55:00*

申し訳ありません、メッセージが途切れてしまいました。以下に続きを示します：

```swift
struct ContentView: View {
    // 全セクションを配列で準備します
    let data: [FoodSection] = [.fruits, .vegetables]
    // モーダル表示用の状態変数を追加します
    @State private var showModal: String?
    
    var body: some View {
        NavigationView {
            List {
                // 各セクションを動的に生成します
                ForEach(data, id: \.title) { section in
                    Section(header: Text(section.title)) {
                        ForEach(section.items, id: \.self) { item in
                            if item == "Cherry" || item == "Banana" {
                                // CherryとBananaはモーダル表示します
                                Button(action: {
                                    showModal = item
                                }) {
                                    Text(item)
                                }
                                .sheet(item: $showModal) { item in
                                    switch item {
                                    case "Cherry":
                                        CherryView()
                                    case "Banana":
                                        BananaView()
                                    default:
                                        EmptyView()
                                    }
                                }
                            } else {
                                // それ以外のアイテムは通常通りに表示します
                                NavigationLink(destination: section.destinationView(for: item)) {
                                    Text(item)
                                }
                            }
                        }
                    }
                }
            }
            .listStyle(GroupedListStyle())
            .navigationBarTitle("Food List")
        }
    }
}
```

ここでは`sheet(item:content:)`メソッドを使用しています。このメソッドは指定されたアイテムがnilでない場合にモーダルを表示し、そのアイテムがnilになるとモーダルを非表示にします。このため、アイテムが"Cherry"または"Banana"を選択したときにモーダルを表示し、モーダルが閉じられるとnilに設定してモーダルを非表示にします。

これにより、"Cherry"と"Banana"を選択したときに専用のモーダルView（`CherryView`または`BananaView`）が表示され、それ以外のアイテムを選択したときには通常の遷移（`AppleView`または`DetailView`）が行われます。

---

## 👤 User
*2023-05-18 17:07:47*

まず、Fruit や Vegetable に、遷移先のViewを定義したい。

また、TransitionMethod という enum を定義したい。そこにはプッシュ遷移またはモーダル遷移のどちらかを指定する。

どんな TransitionMethod なのかを Fruit や Vegetable で保持しておきたい。

あと、ForEach ので id はIdentifiable を適応させたい。 

var id: String { 表示につかうタイトル }　みたいなイメージ実装してほしい。

---

## 🤖 Assistant
*2023-05-18 17:10:14*

まず、`Fruit`と`Vegetable`enumにそれぞれ遷移先のViewと遷移方法を定義します。そして、`Identifiable`プロトコルを適応させてそれぞれのidを提供します。また、遷移方法を示す新たなenum`TransitionMethod`も定義します。

具体的な実装は以下のようになります：

```swift
import SwiftUI

// 遷移方法を定義します
enum TransitionMethod {
    case push, modal
}

// 各セクションのenumを定義します
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
        return .push
    }
    
    @ViewBuilder
    var destinationView: some View {
        DetailView(item: rawValue)
    }
}

// 各セクションのデータを表すenumを定義します
enum FoodSection: Identifiable {
    case fruits, vegetables
    
    var id: String {
        switch self {
        case .fruits:
            return "Fruits"
        case .vegetables:
            return "Vegetables"
        }
    }
    
    var title: String {
        id
    }
    
    var items: [Any] {
        switch self {
        case .fruits:
            return Fruit.allCases
        case .vegetables:
            return Vegetable.allCases
        }
    }
}

struct ContentView: View {
    // 全セクションを配列で準備します
    let data: [FoodSection] = [.fruits, .vegetables]
    // モーダル表示用の状態変数を追加します
    @State private var showModal: Any?
    
    var body: some View {
        NavigationView {
            List {
                // 各セクションを動的に生成します
                ForEach(data) { section in
                    Section(header: Text(section.title)) {
                        ForEach(section.items, id: \.id) { item in
                            switch section {
                            case .fruits:
                                let fruit = item as! Fruit
                                switch fruit.transitionMethod {
                                case .push:
                                    NavigationLink(destination: fruit.destinationView) {
                                        Text(fruit.rawValue)
                                    }
                                case .modal:
                                    Button(action: {
                                        showModal = fruit
                                    }) {
                                        Text(fruit.rawValue)
                                    }
                                    .sheet(item: $showModal) { _ in
                                        fruit.destinationView
                                    }
                                }
                            case .vegetables:
                                let vegetable = item as! Vegetable
                                NavigationLink(destination: vegetable.destinationView) {
                                    Text(veget

---

## 👤 User
*2023-05-18 17:10:34*

case .vegetables: からつづきを描いて欲しい

---

## 🤖 Assistant
*2023-05-18 17:11:58*

申し訳ありません、メッセージが途切れてしまいました。以下に続きを示します：

```swift
                            case .vegetables:
                                let vegetable = item as! Vegetable
                                NavigationLink(destination: vegetable.destinationView) {
                                    Text(vegetable.rawValue)
                                }
                            }
                        }
                    }
                }
            }
            .listStyle(GroupedListStyle())
            .navigationBarTitle("Food List")
        }
    }
}
```

このコードでは、各フルーツと野菜に遷移先のViewと遷移方法を定義しています。そして、それぞれの`destinationView`と`transitionMethod`を利用して適切な遷移を行います。

各アイテム（フルーツまたは野菜）に対して、その遷移方法（プッシュまたはモーダル）に基づいて適切なアクションを行います。これにより、`ContentView`内でのハードコーディングを最小限に抑え、各アイテム自体が遷移先のViewと遷移方法を知っていることを示しています。

また、このコードでは`Identifiable`プロトコルを用いて、各セクションとアイテムが一意の識別子を持つことを保証しています。これにより、`ForEach`において`id`を直接指定することなく、各セクションとアイテムを安全にループ処理することができます。

---

## 👤 User
*2023-05-18 17:12:02*

var items: [Any] をやめたいんだけど、それはできないの？

---

## 🤖 Assistant
*2023-05-18 17:12:45*

確かに、`Any`を使うのは避けたい場面が多いですね。しかし、Swiftでは異なる型の配列を持つことができません。そのため、異なる型の値を持つ配列を作る場合は、`Any`型を使うか、共通のスーパークラスまたはプロトコルを定義する必要があります。

今回のケースで、`Fruit`と`Vegetable`に共通のプロトコルを定義して、`items`プロパティをそのプロトコルの配列にするという解決策があります。

以下に具体的なコードを示します：

```swift
import SwiftUI

// 遷移方法を定義します
enum TransitionMethod {
    case push

---
