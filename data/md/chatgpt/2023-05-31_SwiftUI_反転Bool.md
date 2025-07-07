# SwiftUI 反転Bool

日付: 2023-05-31

---

## 👤 ユーザー
*2023/5/31 21:40:40*

SwiftUI で binding 型のbool を ! を使って否定系を表したい。どうすればいい？

---

## 🤖 アシスタント
*2023/5/31 21:41:07*

SwiftUIでBindingを使ってBool値を反転させるには、以下のようなコードが使えます：

```swift
// BoolのBinding
@State private var isOn: Bool = true

var body: some View {
    Toggle(isOn: $isOn) {
        Text("Toggle")
    }
    Button("Toggle Button") {
        isOn.toggle()
    }
}
```

この例では、ToggleとButtonが同じBool値(`isOn`)を共有しています。Buttonを押すたびに、Bool値(`isOn`)は反転します。

また、Bindingを使って直接反転させたい場合は、次のような方法もあります：

```swift
@State private var isOn: Bool = true

var body: some View {
    Toggle(isOn: Binding(
        get: { self.isOn },
        set: { self.isOn = !$0 }
    )) {
        Text("Toggle")
    }
}
```

ここでは、BindingはBool値(`isOn`)を共有しますが、値がセットされるときに反転します。この方法を使用すると、Toggleのスイッチがオフの状態を示すときに`isOn`は`true`になり、スイッチがオンの状態を示すときに`isOn`は`false`になります。

どちらの方法を選ぶかは、あなたがどのようにBool値を共有および更新したいかによります。

---

## 👤 ユーザー
*2023/5/31 21:41:47*

以下のようなものを全体で使いたい

```swift
prefix func ! (value: Binding<Bool>) -> Binding<Bool> {
    Binding<Bool>(
        get: { !value.wrappedValue },
        set: { value.wrappedValue = !$0 }
    )
}

```

---

## 🤖 アシスタント
*2023/5/31 21:42:21*

それは十分に可能です。あなたが提供したコードをSwiftUIの全体に適用するためには、そのコードをプロジェクトの共通部分（たとえば共通のUtil.swiftファイルなど）に追加します。

以下にその例を示します：

```swift
import SwiftUI

prefix func ! (value: Binding<Bool>) -> Binding<Bool> {
    Binding<Bool>(
        get: { !value.wrappedValue },
        set: { value.wrappedValue = !$0 }
    )
}
```

上記のコードをプロジェクトのどこかに追加したら、以下のように使うことができます：

```swift
struct ContentView: View {
    @State private var isOn: Bool = false
    
    var body: some View {
        Toggle(isOn: !self.$isOn) {
            Text("Toggle")
        }
    }
}
```

この例では、`isOn`が`true`のときにToggleはオフを示し、`isOn`が`false`のときにToggleはオンを示します。これは、あなたが定義した`!`オペレータがBindingのBool値を反転させるためです。

この方法を使うと、コードが非常に読みやすく、理解しやすいです。ただし、カスタムオペレータがプロジェクト全体でどのように使われるかを理解するためには、コードのドキュメンテーションを適切に行うことが重要です。

---

## 👤 ユーザー
*2023/5/31 21:43:57*

extension Binding&lt;Bool&gt; {} のように記述できないの？

---

## 🤖 アシスタント
*2023/5/31 21:44:26*

残念ながら、Swiftの現在のバージョン（2021年までの情報）では、特定のジェネリック型（この場合は`Binding<Bool>`）のための拡張はサポートされていません。

したがって、以下のようなコードは無効です：

```swift
extension Binding<Bool> {
    static prefix func ! (value: Self) -> Binding<Bool> {
        Binding<Bool>(
            get: { !value.wrappedValue },
            set: { value.wrappedValue = !$0 }
        )
    }
}
```

Swiftの拡張は全体的にジェネリックに適用され、特定のジェネリック型を対象とすることはできません。つまり、`Binding<T>`に対する拡張は可能ですが、`Binding<Bool>`のような特定の型に対する拡張はできません。

この制限はSwiftの型システムの一部であり、将来のバージョンで変更される可能性がありますが、現時点では特定のジェネリック型に対する拡張はサポートされていません。

---

## 👤 ユーザー
*2023/6/1 1:23:20*

以下をpublicにしたつもりなのに呼べなかったんだけど何故

public prefix func ! (value: Binding&lt;Bool&gt;) -&gt; Binding&lt;Bool&gt; {
    Binding&lt;Bool&gt;(
        get: { !value.wrappedValue },
        set: { value.wrappedValue = !$0 }
    )
}

---

## 🤖 アシスタント
*2023/6/1 1:24:14*

Swiftでは、カスタム演算子の定義はグローバルコンテキスト（つまり、型の外部）でなければなりません。そして、演算子の宣言自体も public である必要があります。これは、他のモジュールから見えるようにするためです。

しかし、演算子の実装（具体的な動作）を他のモジュールで利用できるようにするには、その実装も public である必要があります。これを行うためには、通常、演算子を拡張（extension）内に定義します。

ただし、前述の通り、Swiftでは特定のジェネリック型（この場合は`Binding<Bool>`）のための拡張はサポートされていません。

したがって、あなたのコードが他のモジュールからアクセスできない理由は、`Binding<Bool>`に対するカスタム演算子の具体的な実装が public でないためだと考えられます。

現時点では、この問題を解決するための最善の方法は、カスタム演算子の実装を含むモジュールを公開（public）し、それを他のモジュールから直接呼び出すことです。

なお、公開（public）な演算子の宣言と実装を行うには、下記のように記述します：

```swift
// グローバルコンテキストで演算子を宣言
public prefix operator !

// 演算子の具体的な動作を宣言
public prefix func ! (value: Binding<Bool>) -> Binding<Bool> {
    Binding<Bool>(
        get: { !value.wrappedValue },
        set: { value.wrappedValue = !$0 }
    )
}
```

上記のように、`public prefix operator !`を用いて新しい`!`演算子を宣言し、次に公開（public）な関数として演算子の具体的な動作を宣言します。

このコードを含むモジュールが公開（public）されていれば、他のモジュールからもこのカスタム演算子を利用することができるはずです。

---

## 👤 ユーザー
*2023/6/1 1:24:31*

でもすでに ! は使われているのでよくないのでは？

---

## 🤖 アシスタント
*2023/6/1 1:25:07*

その通りで、`!`はSwiftにおいてすでに定義されている演算子で、強制アンラップやブール値の反転に使われます。既存の演算子に新たな動作を追加すると、特に公開APIにおいては、混乱を招く可能性があります。

あなたが定義した`!`演算子は、既存の`!`演算子とは異なる振る舞いをするため、他の開発者が予期しないバグを導入する可能性があります。

なので、一般的には既存の演算子に対して新たな動作を追加するよりも、新しいカスタム演算子を定義する方が推奨されます。その方が他の開発者がその演算子がカスタム定義であることを理解しやすいからです。

例えば、次のような新しいカスタム演算子を作成することもできます：

```swift
public prefix operator ~~

public prefix func ~~ (value: Binding<Bool>) -> Binding<Bool> {
    Binding<Bool>(
        get: { !value.wrappedValue },
        set: { value.wrappedValue = !$0 }
    )
}
```

これにより、SwiftUIのViewでこの新しい`~~`演算子を使ってBoolのBindingを反転させることができます。

---

## 👤 ユーザー
*2023/6/1 1:26:29*

であるならば、`self.$isOn.not`のような使い方の方がいいと思ったけどそれならグローバルにpublicできる？

---

## 🤖 アシスタント
*2023/6/1 1:27:24*

それは実現可能で、Swiftでは `extension` を使用して型に新たな計算プロパティを追加することができます。この場合、`Binding<Bool>`に `not` プロパティを追加したいと思いますが、`Binding` はジェネリック型であるため、特定の型 (`Bool` など) に限定して拡張することはできません。

代わりに、非ジェネリックなラッパータイプを定義して `not` プロパティを追加することができます。以下にその一例を示します。

```swift
public struct NotBinding: DynamicProperty {
    @Binding var value: Bool
    
    public var not: Binding<Bool> {
        Binding<Bool>(
            get: { !self.value },
            set: { self.value = !$0 }
        )
    }
    
    public init(_ source: Binding<Bool>) {
        self._value = source
    }
}
```

このラッパーを使用して、以下のようにBoolのBindingを反転させることができます。

```swift
struct ContentView: View {
    @State private var isOn: Bool = false
    private var notIsOn: NotBinding { NotBinding($isOn) }
    
    var body: some View {
        Toggle(isOn: notIsOn.not) {
            Text("Toggle")
        }
    }
}
```

この方法を使用すると、`self.$isOn.not` のように Bool の Binding を反転させることができます。ただし、ラッパータイプ `NotBinding` を使用するため、`notIsOn` というプロパティを定義してそれを使用する必要があります。

なお、ラッパータイプ `NotBinding` は `DynamicProperty` プロトコルに準拠しています。これは SwiftUI の `@State` などのプロパティラッパーが採用しているプロトコルで、View の body が再計算されるときに適切に更新されることを保証します。

---

## 👤 ユーザー
*2023/6/1 2:02:10*

以下もだめだったんだけどどうすればいい？

public extension Binding where Value == Bool {
    var not: Binding&lt;Value&gt; {
        Binding&lt;Value&gt;(
            get: { !self.wrappedValue },
            set: { self.wrappedValue = !$0 }
        )
    }
}

---

## 🤖 アシスタント
*2023/6/1 2:02:51*

あなたの提供したコードは正しいように見えます。この拡張子は `Binding` の `Bool` 型の値に対して適用され、新しい `not` プロパティを提供します。このプロパティは `Binding<Bool>` を返し、それは元の `Binding` の反転値を提供します。

しかしながら、この拡張子が正しく動作しない原因として考えられるのは、この拡張子が定義されているモジュールが適切にインポートされていない、またはコードの別の部分でエラーが生じている可能性があります。

例えば、この拡張子を使うには、この拡張子が含まれるモジュールが適切にインポートされている必要があります。つまり、この拡張子を使うSwiftファイルの冒頭に次のようなコードが必要です：

```swift
import SwiftUI
import YourModuleName // ここにこの拡張子が含まれるモジュール名を入れる
```

また、この拡張子を使っているコードにエラーがある場合も正しく動作しません。例えば、`not`プロパティを呼び出している `Binding` が実際には `Bool` 型の値を持っていない場合などです。

もしまだこの問題が解決しない場合、より具体的なエラーメッセージや、この拡張子を使っている具体的なコードの例を提供していただければ、より具体的なアドバイスが可能となります。

---
