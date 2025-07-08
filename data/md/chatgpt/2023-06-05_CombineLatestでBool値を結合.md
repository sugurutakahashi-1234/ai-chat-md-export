# CombineLatestでBool値を結合

日付: 2023-06-05

---

## 👤 ユーザー
*2023/6/5 10:21:05*

Swiftで Combine で combineLatest で bool 値が3個ほど流れてくるストリームでそれらの値のなかに一つでもtrueがあればtrueを出力するような処理を書いて欲しい」

---

## 🤖 アシスタント
*2023/6/5 10:21:45*

SwiftとCombineを使って、3つのBool値のストリームから1つでも`true`が含まれる場合に`true`を出力するような処理は次のように書けます。

まず、3つのPublisherを作成します。これらがBool値を発行するストリームとなります。ここでは、それらを`pub1`、`pub2`、`pub3`とします。

次に、これら3つのPublisherの出力を`combineLatest`を使用して結合します。これにより、3つのPublisherからの最新の値を1つの出力として取得できます。

最後に、結合した出力を`map`を使用して新たなBool値に変換します。この際に、もともとの3つのBool値のうち1つでも`true`があれば、新しいBool値は`true`となります。

以下にそのコードを示します。

```swift
import Combine

let pub1 = PassthroughSubject<Bool, Never>()
let pub2 = PassthroughSubject<Bool, Never>()
let pub3 = PassthroughSubject<Bool, Never>()

let subscription = Publishers.CombineLatest3(pub1, pub2, pub3)
    .map { $0 || $1 || $2 }
    .sink { print($0) }

// Tests
pub1.send(false)
pub2.send(false)
pub3.send(true)  // It will print "true" because there's one "true"

pub1.send(false)
pub2.send(false)
pub3.send(false) // It will print "false" because there's no "true"

pub1.send(true)
pub2.send(false)
pub3.send(false) // It will print "true" because there's one "true"
```

このコードでは、`PassthroughSubject`を使用して3つのPublisherを作成しています。そして、`CombineLatest3`を使用してこれらのPublisherを結合し、それらの最新の値を元に新しいBool値を生成しています。最後に、生成したBool値をコンソールに出力しています。

テスト部分では、各Publisherに対して`send`メソッドを使用してBool値を送信しています。これにより、それぞれのPublisherからの最新の値が結合され、新しいBool値が生成されています。

---

## 🤖 アシスタント
*2023/6/5 10:22:27*

何か他にご質問がありますか？ SwiftやCombineについて、または他の何かについてもお答えできます。

---

## 👤 ユーザー
*2023/6/5 10:22:50*

CombineLatest3(pub1, pub2, pub3,,,,pub10) to

---

## 🤖 アシスタント
*2023/6/5 10:23:21*

Combineでは、CombineLatestの一部としてCombineLatest3までしか定義されていません。それ以上のPublisherを組み合わせる場合、複数のCombineLatestを組み合わせて使う方法があります。

しかし、10個のPublisherの値を組み合わせるような状況では、Publisherの配列を操作する方が簡潔になる場合があります。特に、同じ型のPublisherが多数ある場合はそのようになります。

以下に、配列のPublisherを組み合わせて結果を出力するコード例を示します：

```swift
import Combine

let publishers = (1...10).map { _ in PassthroughSubject<Bool, Never>() }

let subscription = publishers
    .publisher
    .flatMap { $0 }
    .removeDuplicates()
    .filter { $0 }
    .sink { _ in print("There's a true") }

// Tests
publishers[0].send(false)
publishers[1].send(false)
publishers[2].send(true)  // It will print "There's a true"

publishers[0].send(false)
publishers[1].send(false)
publishers[2].send(false)

publishers[0].send(true)  // It will print "There's a true"
```

このコードでは、Boolを発行するPassthroughSubjectの配列を作成しています。そして、`flatMap`を使用してそれらのPublisherを一つのPublisherにまとめ、その中の値をフィルタリングしています。

ただし、このコードは配列のすべてのPublisherから値が一度でも`true`になったら出力されます。それが一度でも起きたらすぐに"true"を出力します。

---

## 👤 ユーザー
*2023/6/5 10:24:35*

flatMap の挙動がよくわかっていない、flatMap って一つでもtrueであれば trueを返却するの？

---

## 🤖 アシスタント
*2023/6/5 10:25:13*

`flatMap`は名前が示す通り、フラット化(一次元化)とマッピング(変換)の両方を行う演算子で、多くの関数型プログラミング言語で利用されています。これは元のストリームの各要素に関数を適用し（マッピング）、その結果をフラット化（一次元化）します。

特に、Combineの`flatMap`は、PublisherのPublisherを単一のPublisherに変換します。つまり、それぞれの入力値に対してPublisherを生成し、それら全てのPublisherの出力を単一のPublisherにまとめる役割を果たします。

次の例では、数字の配列からPublisherを生成し、それら全てのPublisherの出力を一つのPublisherにまとめています。ここでの`flatMap`は数字からPublisherを生成する関数を適用し、それらのPublisherの出力を一つのPublisherにまとめています。

```swift
import Combine

let numbers = [1, 2, 3]

let subscription = numbers.publisher
    .flatMap { number in
        return Just(number * 2)
    }
    .sink(receiveValue: { print($0) })  // prints 2, 4, 6
```

なお、この場合の`flatMap`は、入力が`true`である場合に`true`を返すなど、特定の値に基づいて出力を変更するものではありません。`flatMap`の動作は入力に対する関数の適用と出力のフラット化にすぎません。入力が`true`である場合に`true`を返すような振る舞いは、`flatMap`に渡す関数によって決まります。

---

## 👤 ユーザー
*2023/6/5 10:26:31*

タプルの出力を配列にまとめて、その中にtrueが含まれているかを判定して欲しい。また最終的にtrueであろうがfalseであろうがしゅつりょくしてほしい

---

## 🤖 アシスタント
*2023/6/5 10:27:17*

タプルの出力を配列にまとめ、その中に`true`が含まれているかを判定し、最終的にその結果を出力するという処理は以下のように実装できます。 

以下のコードでは、10個のBool値を発行するPublisherを作成し、それらを`CombineLatestMany`を使用して結合しています。その結果を配列に変換し、`true`が含まれているかどうかをチェックしています。

```swift
import Combine

let publishers = (1...10).map { _ in PassthroughSubject<Bool, Never>() }

let subscription = Publishers.CombineLatestMany(publishers)
    .map { $0.contains(true) }
    .sink { print($0) }

// Tests
publishers.forEach { $0.send(false) } // It will print "false" because there's no "true"

publishers[2].send(true) // It will print "true" because there's one "true"

publishers.forEach { $0.send(false) } // It will print "false" because there's no "true"
```

このコードでは、10個のBool値を発行するPassthroughSubjectを作成し、それらをCombineLatestManyを使用して結合しています。そして、結合した結果を`map`でチェックし、`true`が含まれているかどうかを確認し、その結果をコンソールに出力しています。

なお、現時点（2021年9月まで）では、CombineにはCombineLatestManyというメソッドは存在しません。このメソッドが提供する機能を利用するためには、CombineExtというサードパーティライブラリなどを使用するか、自分で同様のメソッドを実装する必要があります。

なお、上記のコードは単純な例であり、実際のコードではエラーハンドリングなども考慮する必要があることに注意してください。

---

## 👤 ユーザー
*2023/6/5 10:27:53*

CombineLatestMany なんてなかったけど、タプルを配列にするようなメソッドはないの？

---

## 🤖 アシスタント
*2023/6/5 10:28:28*

Swift Combineには、タプルを直接配列に変換するメソッドは存在しませんが、3つのPublisherを組み合わせるための`CombineLatest3`の出力を配列に変換することは可能です。その後、配列内に`true`が含まれているかどうかをチェックします。

以下にそのコードを示します:

```swift
import Combine

let pub1 = PassthroughSubject<Bool, Never>()
let pub2 = PassthroughSubject<Bool, Never>()
let pub3 = PassthroughSubject<Bool, Never>()

let subscription = Publishers.CombineLatest3(pub1, pub2, pub3)
    .map { [$0, $1, $2].contains(true) }
    .sink { print($0) }

// Tests
pub1.send(false)
pub2.send(false)
pub3.send(true)  // It will print "true" because there's one "true"

pub1.send(false)
pub2.send(false)
pub3.send(false) // It will print "false" because there's no "true"

pub1.send(true)
pub2.send(false)
pub3.send(false) // It will print "true" because there's one "true"
```

このコードでは、`CombineLatest3`の出力（タプル）を`map`を使用して配列に変換しています。そして、その配列に`true`が含まれているかどうかをチェックしています。

なお、このような方法は3つのPublisherに対してのみ有効で、より多くのPublisherを組み合わせる場合には他のアプローチを探る必要があります。

---

## 👤 ユーザー
*2023/6/5 10:28:44*

どんなあぷろーちがあるかおしえてほしい

---

## 🤖 アシスタント
*2023/6/5 10:29:24*

複数のPublisher（4つ以上）から最新の値を組み合わせて処理するには、以下のようなアプローチがあります。

1. **Nested CombineLatest:** `CombineLatest`をネストして使用することができます。つまり、2つのPublisherの組み合わせを1つのPublisherとみなし、そのPublisherと次のPublisherを組み合わせる、という処理を繰り返します。これにより、任意の数のPublisherを組み合わせることができます。ただし、この方法はコードが複雑になりがちであり、特に大量のPublisherを扱う場合には扱いづらいという欠点があります。

2. **Custom CombineLatest Operator:** 独自のCombineLatest演算子を作成することも可能です。この演算子は、任意の数のPublisherを引数に取り、それらの最新の値を組み合わせることができます。ただし、この方法を使用するためにはCombineフレームワークとSwiftの高度な機能に深く精通している必要があります。

3. **Third-Party Libraries:** サードパーティのライブラリを使用することも一つの選択肢です。例えば、`CombineExt`ライブラリには`CombineLatestMany`というメソッドが含まれており、これを使用すれば任意の数のPublisherを組み合わせることができます。ただし、サードパーティのライブラリを使用することはプロジェクトの依存関係を増やすことを意味します。

これらのアプローチはそれぞれメリットとデメリットがあり、用途によって最適な方法は変わります。要件や制約によって適切なアプローチを選ぶことが重要です。

---

## 👤 ユーザー
*2023/6/5 10:33:37*

同じ型（例えばBool）で統一されたタプルを配列に変換する方法はないの？

---

## 🤖 アシスタント
*2023/6/5 10:34:13*

Swiftの現在のバージョンでは（2021年9月時点）、タプルの要素を直接配列に変換する組み込み関数や演算子は提供されていません。この理由は、タプルが異なる型の値を持つことができ、それぞれの要素に名前を付けることができるためです。この性質は、配列（すべての要素が同じ型で、名前ではなくインデックスでアクセスする）とは基本的に異なります。

そのため、特定のタプルを配列に変換するには、明示的に各要素を配列に追加する必要があります。以下に、Boolのタプルを配列に変換する例を示します:

```swift
let tuple: (Bool, Bool, Bool) = (true, false, true)
let array: [Bool] = [tuple.0, tuple.1, tuple.2]
```

このコードでは、Boolのタプルを作成し、その要素を明示的に配列に追加しています。

また、Combineの`CombineLatest`や`CombineLatest3`などの関数の出力はタプルで、それを配列に変換するには同様に各要素を明示的に配列に追加する必要があります。例えば、以下のようになります:

```swift
let pub1 = PassthroughSubject<Bool, Never>()
let pub2 = PassthroughSubject<Bool, Never>()
let pub3 = PassthroughSubject<Bool, Never>()

let subscription = Publishers.CombineLatest3(pub1, pub2, pub3)
    .map { [$0, $1, $2] }
    .sink { print($0) }
```

このコードでは、`CombineLatest3`の出力（Boolのタプル）を`map`を使用して配列に変換しています。

---

## 👤 ユーザー
*2023/6/5 10:34:39*

以下のような記事を見たけど

func arrayFromTuple&lt;T, U&gt;(tuple: T) -&gt; [U] {
    return Mirror(reflecting: tuple).children.map { $0.value as! U }
}

---

## 🤖 アシスタント
*2023/6/5 10:35:14*

はい、Swiftの`Mirror`を使ってタプルの要素を反射し、その要素を配列に変換することが可能です。あなたが示した関数`arrayFromTuple`はその方法を利用しています。

しかし、この方法にはいくつか注意点があります。まず、全てのタプルの要素が同じ型でなければならないことです。この関数は、タプルの各要素を`U`型としてキャストしますので、それが可能な場合は全ての要素が同じ型でなければなりません。

また、この方法は反射を使用しているため、パフォーマンスの観点から必ずしも最適とは言えません。反射は実行時にオブジェクトの内部情報を取得するための手段であり、それには一定のコストがかかります。

そのため、このような方法は必要な場合に限り、かつ全てのタプルの要素が同じ型であることが保証されている場合のみに使用するべきです。

以下に、この関数を使用してCombineの`CombineLatest3`の出力を配列に変換する例を示します：

```swift
import Combine

func arrayFromTuple<T, U>(tuple: T) -> [U] {
    return Mirror(reflecting: tuple).children.compactMap { $0.value as? U }
}

let pub1 = PassthroughSubject<Bool, Never>()
let pub2 = PassthroughSubject<Bool, Never>()
let pub3 = PassthroughSubject<Bool, Never>()

let subscription = Publishers.CombineLatest3(pub1, pub2, pub3)
    .map { arrayFromTuple(tuple: $0) }
    .sink { print($0) }

// Tests
pub1.send(true)
pub2.send(false)
pub3.send(true)  // It will print "[true, false, true]"
```

このコードでは、`CombineLatest3`の出力（Boolのタプル）を`map`を使用して`arrayFromTuple`関数に渡し、その結果を配列に変換しています。

---

## 👤 ユーザー
*2023/6/5 10:56:20*

Contextual closure type '(((Bool, CurrentValueSubject&lt;Bool, Never&gt;.Output), CurrentValueSubject&lt;Bool, Never&gt;.Output)) -&gt; Bool' expects 1 argument, but 3 were used in closure bodyというエラーが出た

---

## 🤖 アシスタント
*2023/6/5 10:56:56*

指摘されたエラーメッセージは、クロージャの期待する引数の数と実際に提供された引数の数が一致しない場合に表示されます。あなたが示したエラーメッセージは、クロージャが1つの引数を期待しているが、クロージャの本体で3つの引数が使用されているということを示しています。

以下のコードで`CombineLatest3`を使用すると、結果は3つの要素を持つタプルになります：

```swift
let subscription = Publishers.CombineLatest3(pub1, pub2, pub3)
    .map { arrayFromTuple(tuple: $0) }
    .sink { print($0) }
```

`map`メソッドのクロージャにはタプルが1つだけ渡されます。しかし、`$0`, `$1`, `$2`のように3つの別々の引数を参照しようとすると、期待する引数の数と実際の引数の数が一致しないためエラーが発生します。

この問題を解決するためには、クロージャが1つのタプルを引数として受け取り、それを`arrayFromTuple`関数に渡すようにする必要があります。`$0`はクロージャの第一引数（ここでは3つの要素を持つタプル）を参照します：

```swift
let subscription = Publishers.CombineLatest3(pub1, pub2, pub3)
    .map { arrayFromTuple(tuple: $0) }
    .sink { print($0) }
```

この修正により、`map`メソッドのクロージャが期待する1つの引数が正しく提供され、エラーが解消されるはずです。

---
