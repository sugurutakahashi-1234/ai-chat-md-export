# Create CurrentValueSubject Publisher

日付: 2023-08-21

---

## 👤 ユーザー
*2023/08/22 00:18:15*

CurrentValueSubject の oldValue相当の値とnewValueのタプルを返すようなAnyPublisherを作りたい。

---

## 🤖 アシスタント
*2023/08/22 00:19:08*

SwiftのCombineフレームワークを使用して、`CurrentValueSubject`のoldValueとnewValueのタプルを返す`AnyPublisher`を作成する場面を想像します。

以下のステップで実現できます：

1. `CurrentValueSubject`を作成します。
2. `CurrentValueSubject`の現在の値と次の値をタプルで結合するPublisherを作成します。
3. 新しい値が`CurrentValueSubject`に送信されるたびに、前の値と新しい値のタプルが返されるようにします。

以下は具体的なコード例です：

```swift
import Combine

let subject = CurrentValueSubject<Int, Never>(0)

let oldAndNewValuesPublisher: AnyPublisher<(Int, Int), Never> = subject
    .dropFirst() // 初期値をスキップ
    .scan((subject.value, subject.value)) { (lastTuple, newValue) in
        (lastTuple.1, newValue)
    }
    .eraseToAnyPublisher()

let cancellable = oldAndNewValuesPublisher
    .sink(receiveValue: { tuple in
        print("Old value: \(tuple.0), New value: \(tuple.1)")
    })

subject.send(1)
subject.send(2)
subject.send(3)

// 出力:
// Old value: 0, New value: 1
// Old value: 1, New value: 2
// Old value: 2, New value: 3
```

この例では、`CurrentValueSubject`が整数を持つと仮定しています。最初に`dropFirst()`を使って初期値をスキップすることに注意してください。これは、`scan`オペレータを使用して前の値と新しい値のタプルを形成するときに、最初のタプルが`(0,0)`であることを避けるためです。

この方法で、`CurrentValueSubject`の前の値と新しい値を結合して返す`AnyPublisher`を作成できます。

---

## 👤 ユーザー
*2023/08/22 00:20:46*

以下の実装を埋めて欲しい

public class ScenePhaseManager: ScenePhaseManagerProtocol {
    public static let shared = ScenePhaseManager()

    private init() {}

    
    private let scenePhaseSubject = CurrentValueSubject&lt;ScenePhase, Never&gt;(.active)
    public var scenePhasePublisher: AnyPublisher&lt;(oldScenePhase: ScenePhase, newScenePhase: ScenePhase), Never&gt; {
        
    }

    public func scenePhageChanged(scenePhase newScenePhase: ScenePhase) {
        scenePhaseSubject.send(newScenePhase)
    }
}

---

## 🤖 アシスタント
*2023/08/22 00:21:34*

`ScenePhaseManager`の要件に基づいて、`scenePhasePublisher`の実装を提供します。この実装では、`CurrentValueSubject`の前の値と新しい値をタプルで結合して、要求された形式の`AnyPublisher`を返します。

まず、SwiftUIの`ScenePhase`をimportすることを前提としています（そうでない場合は、カスタムの`ScenePhase`定義が必要です）。

以下は完成した`ScenePhaseManager`クラスの実装です：

```swift
import SwiftUI
import Combine

public protocol ScenePhaseManagerProtocol {
    var scenePhasePublisher: AnyPublisher<(oldScenePhase: ScenePhase, newScenePhase: ScenePhase), Never> { get }
    func scenePhageChanged(scenePhase newScenePhase: ScenePhase)
}

public class ScenePhaseManager: ScenePhaseManagerProtocol {
    public static let shared = ScenePhaseManager()

    private init() {}

    private let scenePhaseSubject = CurrentValueSubject<ScenePhase, Never>(.active)
    
    public var scenePhasePublisher: AnyPublisher<(oldScenePhase: ScenePhase, newScenePhase: ScenePhase), Never> {
        scenePhaseSubject
            .dropFirst()
            .scan((.active, .active)) { (lastTuple, newValue) in
                (lastTuple.1, newValue)
            }
            .eraseToAnyPublisher()
    }

    public func scenePhageChanged(scenePhase newScenePhase: ScenePhase) {
        scenePhaseSubject.send(newScenePhase)
    }
}
```

この実装では、新しい`ScenePhase`の値が`scenePhaseSubject`に送信されるたびに、`scenePhasePublisher`を購読するすべての購読者に対して前の`ScenePhase`と新しい`ScenePhase`のタプルが返されます。

---

## 👤 ユーザー
*2023/08/22 00:22:49*

これってもしかして、PassthroughSubjectでも同じような処理になる？

---

## 🤖 アシスタント
*2023/08/22 00:23:58*

はい、同じアプローチを`PassthroughSubject`で使用することもできます。しかし、`CurrentValueSubject`と`PassthroughSubject`の間にはいくつかの違いがあります。

1. `CurrentValueSubject`は最後の値を保持しているため、購読時にすぐに最新の値を受け取ることができます。一方、`PassthroughSubject`は値を保持しないため、購読時に以前の値を受け取ることはできません。
2. `PassthroughSubject`の場合、初期値を持たないため、`.dropFirst()`は初期値をスキップする必要がありません。

以下は`PassthroughSubject`を使用した同様の実装です：

```swift
import SwiftUI
import Combine

public protocol ScenePhaseManagerProtocol {
    var scenePhasePublisher: AnyPublisher<(oldScenePhase: ScenePhase, newScenePhase: ScenePhase), Never> { get }
    func scenePhageChanged(scenePhase newScenePhase: ScenePhase)
}

public class ScenePhaseManager: ScenePhaseManagerProtocol {
    public static let shared = ScenePhaseManager()

    private init() {}

    private var lastScenePhase: ScenePhase = .active
    private let scenePhaseSubject = PassthroughSubject<ScenePhase, Never>()
    
    public var scenePhasePublisher: AnyPublisher<(oldScenePhase: ScenePhase, newScenePhase: ScenePhase), Never> {
        scenePhaseSubject
            .map { newValue -> (oldScenePhase: ScenePhase, newScenePhase: ScenePhase) in
                let oldValue = self.lastScenePhase
                self.lastScenePhase = newValue
                return (oldScenePhase: oldValue, newScenePhase: newValue)
            }
            .eraseToAnyPublisher()
    }

    public func scenePhageChanged(scenePhase newScenePhase: ScenePhase) {
        scenePhaseSubject.send(newScenePhase)
    }
}
```

この実装では、最後の`ScenePhase`の値を手動で保持するための`lastScenePhase`変数を追加しています。新しい`ScenePhase`の値が`scenePhaseSubject`に送信されるたびに、この変数の値が更新され、前の値と新しい値のタプルが`scenePhasePublisher`の購読者に返されます。

---

## 👤 ユーザー
*2023/08/22 00:25:40*

以下の処理の解説をしてほしい。

 scenePhaseSubject
            .dropFirst()
            .scan((.active, .active)) { (lastTuple, newValue) in
                (lastTuple.1, newValue)
            }
            .eraseToAnyPublisher()

---

## 🤖 アシスタント
*2023/08/22 00:27:02*

もちろん、この処理の各ステップを詳しく解説いたします。

1. **scenePhaseSubject**:
   - これは`CurrentValueSubject`（またはその他のSubject型）のインスタンスです。`Subject`はPublisherでもありSubscriberでもあります。つまり、このSubjectに新しい値を送信することができると同時に、このSubjectの新しい値を購読することもできます。

2. **.dropFirst()**:
   - このオペレータは、最初の要素をドロップ（スキップ）します。`CurrentValueSubject`の場合、これは初期値を意味します。このオペレータの後、初期値はPublisherの出力の一部として流れることはありません。

3. **.scan((.active, .active)) { (lastTuple, newValue) in (lastTuple.1, newValue) }**:
   - `scan`オペレータは、Publisherが送信する各要素に対して累積的な操作を行うためのものです。
   - この例では、累積の初期値としてタプル`(.active, .active)`を提供しています。
   - クロージャ内では、`lastTuple`は前回のスキャンの結果（または初期値）を持っており、`newValue`はPublisherから送られてきた最新の値です。
   - クロージャ内の処理では、前回のタプルの第二要素（`lastTuple.1`）と新しい値を新しいタプルとして返しています。これにより、次の形式のタプルが生成されます：`(前回の新しい値, 現在の新しい値)`。これは、古いシーンフェーズと新しいシーンフェーズのペアとして機能します。

4. **.eraseToAnyPublisher()**:
   - このオペレータは、Publisherの具体的な型を隠蔽して、`AnyPublisher`という型に変換します。これは特にUIやAPIなどのインターフェースをクリーンに保ちたい場合や、実装の詳細を隠蔽したい場合に役立ちます。

全体として、このチェーンは`scenePhaseSubject`からの新しいシーンフェーズの値を受け取るたびに、前のシーンフェーズの値と新しいシーンフェーズの値のペアを生成して出力するPublisherを作成します。

---

## 👤 ユーザー
*2023/08/22 00:28:13*

以下の処理じゃダメなんだっけ？

public class ScenePhaseManager: ScenePhaseManagerProtocol {
    // TODO: 現状、各画面での ScenePhase の変更を検知しようとするとうまくいかないので、BaseView の更新を shared を使うことで共有しているが、共有する範囲を明確にしたい（rename or シングルトンをやめたい）
    public static let shared = ScenePhaseManager()

    private init() {}

    private var oldScenePhase: ScenePhase = .active
    private let scenePhaseSubject = PassthroughSubject&lt;(oldScenePhase: ScenePhase, newScenePhase: ScenePhase), Never&gt;()
    public var scenePhasePublisher: AnyPublisher&lt;(oldScenePhase: ScenePhase, newScenePhase: ScenePhase), Never&gt; {
        scenePhaseSubject.eraseToAnyPublisher()
    }

    public func scenePhageChanged(scenePhase newScenePhase: ScenePhase) {
        scenePhaseSubject.send((oldScenePhase: oldScenePhase, newScenePhase: newScenePhase))
        LoggerContainer.log(.changeScenePhase(.init(oldScenePhase: oldScenePhase, newScenePhase: newScenePhase)))
        oldScenePhase = newScenePhase
    }
}

---

## 🤖 アシスタント
*2023/08/22 00:29:26*

提案された`ScenePhaseManager`の実装も完全に有効です。実際、この実装はいくつかの面でシンプルであり、直感的です。

具体的には、前のシーンフェーズ（`oldScenePhase`）を直接インスタンス変数として保持し、新しいシーンフェーズが`scenePhageChanged(scenePhase:)`メソッドを通じて変更されるたびに、そのタプルを`scenePhaseSubject`に送信しています。

このアプローチのメリットとデメリット：

**メリット**:
1. **直感的**: 状態の変化とその通知が直接的でわかりやすい。
2. **簡潔**: `scan`や他のオペレータを使用するよりもコードが短くなります。
3. **明確な状態の保持**: `oldScenePhase`の状態は明確にクラス内で保持され、いつでもアクセスできます。

**デメリット**:
1. **状態の管理**: `oldScenePhase`の値を更新する責任が`scenePhageChanged(scenePhase:)`メソッドにあります。これを忘れると、誤った情報が送信される可能性があります。
2. **シングルトンの使用**: TODOコメントにあるように、シングルトンの使用は議論の余地があります。シングルトンは全体のアプリケーションコンテキストで状態を共有するため、その影響範囲と生存期間を考慮する必要があります。

全体として、この実装は`ScenePhase`の変更を追跡する目的には十分であり、特定のニーズやプロジェクトの要件に応じて適切に機能するでしょう。もしシングルトンの使用に懸念があるならば、シングルトンのパターンをやめ、このクラスのインスタンスを必要な箇所で明示的に渡すか、他のDI（依存性注入）のアプローチを検討することも考えられます。

---

## 👤 ユーザー
*2023/08/22 00:29:29*

あと、デメリットとして、oldScenePhaseの更新がスレッドセーフじゃない気概する。

---

## 🤖 アシスタント
*2023/08/22 00:30:36*

その通りです。現在の`ScenePhaseManager`の実装では、`oldScenePhase`の更新はスレッドセーフではありません。これは、`scenePhageChanged(scenePhase:)`メソッドが同時に異なるスレッドから呼び出されると、不整合な状態やデータの競合が発生する可能性があるためです。

スレッドセーフを保証するためのいくつかのアプローチ:

1. **DispatchQueueを使用する**: すべての状態の変更をシリアルキューで同期的に実行することで、同時アクセスを排除します。

    ```swift
    private let syncQueue = DispatchQueue(label: "com.scenePhaseManager.syncQueue")
    
    public func scenePhageChanged(scenePhase newScenePhase: ScenePhase) {
        syncQueue.sync {
            scenePhaseSubject.send((oldScenePhase: oldScenePhase, newScenePhase: newScenePhase))
            LoggerContainer.log(.changeScenePhase(.init(oldScenePhase: oldScenePhase, newScenePhase: newScenePhase)))
            oldScenePhase = newScenePhase
        }
    }
    ```

2. **Atomic Operationsを使用する**: Swiftには標準ライブラリで原子的な操作をサポートする機能は提供されていませんが、低レベルのAPI（例：`OSAtomic`）を使用するか、サードパーティのライブラリを利用することで実現できます。

3. **Combineフレームワークのスケジューラ**: Combineにはスケジューラがあり、特定のキューやスレッドで操作を実行するように制御することができます。例えば、`.receive(on: DispatchQueue.main)`のようにしてメインキューで操作を受け取るように制御することができます。

上記のアプローチは、それぞれが適切なコンテキストや要件に基づいて選択されるべきです。特にパフォーマンスやリソースの利用に関する考慮事項がある場合、正しい方法を選択することが重要です。

---

## 👤 ユーザー
*2023/08/22 00:30:45*

.receive(on: DispatchQueue.main) の場合の実装もみたい。

---

## 🤖 アシスタント
*2023/08/22 00:31:47*

了解しました。`.receive(on: DispatchQueue.main)`を使用して、`scenePhageChanged(scenePhase:)`メソッドの処理をメインキューで実行する場合の実装を示します。

まず、`PassthroughSubject`の送信操作はスレッドセーフですが、`oldScenePhase`の読み取りと書き込みはそうではありません。したがって、この変数へのアクセスをメインキューで同期させる必要があります。

以下は、そのための実装です:

```swift
public class ScenePhaseManager: ScenePhaseManagerProtocol {
    public static let shared = ScenePhaseManager()

    private init() {}

    private var oldScenePhase: ScenePhase = .active
    private let scenePhaseSubject = PassthroughSubject<(oldScenePhase: ScenePhase, newScenePhase: ScenePhase), Never>()
    
    public var scenePhasePublisher: AnyPublisher<(oldScenePhase: ScenePhase, newScenePhase: ScenePhase), Never> {
        scenePhaseSubject.eraseToAnyPublisher()
    }

    public func scenePhageChanged(scenePhase newScenePhase: ScenePhase) {
        DispatchQueue.main.async {
            let currentOldPhase = self.oldScenePhase
            self.scenePhaseSubject.send((oldScenePhase: currentOldPhase, newScenePhase: newScenePhase))
            LoggerContainer.log(.changeScenePhase(.init(oldScenePhase: currentOldPhase, newScenePhase: newScenePhase)))
            self.oldScenePhase = newScenePhase
        }
    }
}
```

この実装では、`scenePhageChanged(scenePhase:)`がどのスレッドから呼び出されるかに関係なく、実際の状態の変更と通知はメインキュー上で実行されます。

このアプローチは特にUIの変更と関連している場合や、メインキューでの操作が適切であると思われる場合に適しています。しかし、大量の操作や高い頻度での更新が発生する場合、メインキューをブロックしてしまう可能性があるため、他のキューを検討することも考えられます。

---

## 👤 ユーザー
*2023/08/22 00:31:49*

というよりも@MainActorで処理してしまえば問題ないのでは？

---

## 🤖 アシスタント
*2023/08/22 00:32:50*

はい、Swift 5.5以降で導入されたConcurrencyモデルを使用する場合、`@MainActor`を利用することで、特定のコードがメインスレッドでのみ実行されるように制御することができます。

`@MainActor`を使用すると、その属性がついているメソッドやプロパティはメインスレッドで実行されることが保証されます。したがって、`scenePhageChanged(scenePhase:)`メソッドに`@MainActor`をつけることで、このメソッドが常にメインスレッドで実行されることを保証することができます。

以下はその実装例です：

```swift
public class ScenePhaseManager: ScenePhaseManagerProtocol {
    public static let shared = ScenePhaseManager()

    private init() {}

    private var oldScenePhase: ScenePhase = .active
    private let scenePhaseSubject = PassthroughSubject<(oldScenePhase: ScenePhase, newScenePhase: ScenePhase), Never>()
    
    public var scenePhasePublisher: AnyPublisher<(oldScenePhase: ScenePhase, newScenePhase: ScenePhase), Never> {
        scenePhaseSubject.eraseToAnyPublisher()
    }

    @MainActor
    public func scenePhageChanged(scenePhase newScenePhase: ScenePhase) {
        let currentOldPhase = self.oldScenePhase
        self.scenePhaseSubject.send((oldScenePhase: currentOldPhase, newScenePhase: newScenePhase))
        LoggerContainer.log(.changeScenePhase(.init(oldScenePhase: currentOldPhase, newScenePhase: newScenePhase)))
        self.oldScenePhase = newScenePhase
    }
}
```

このように、`@MainActor`を使用することで、`DispatchQueue.main.async`の明示的な呼び出しを避けることができ、コードの明瞭性を保持しながらスレッドセーフな実行を保証することができます。ただし、この新しいConcurrencyモデルを使用する場合、呼び出し元もこのモデルをサポートしている必要があります。

---

## 👤 ユーザー
*2023/08/22 00:33:57*

以下でスレッドセーフになったのかな？

public class ScenePhaseManager: ScenePhaseManagerProtocol {
    // TODO: 現状、各画面での ScenePhase の変更を検知しようとするとうまくいかないので、BaseView の更新を shared を使うことで共有しているが、共有する範囲を明確にしたい（rename or シングルトンをやめたい）
    public static let shared = ScenePhaseManager()

    private init() {}

    private var oldScenePhase: ScenePhase = .active
    private let scenePhaseSubject = PassthroughSubject&lt;(oldScenePhase: ScenePhase, newScenePhase: ScenePhase), Never&gt;()
    public var scenePhasePublisher: AnyPublisher&lt;(oldScenePhase: ScenePhase, newScenePhase: ScenePhase), Never&gt; {
        scenePhaseSubject.eraseToAnyPublisher()
    }

    // oldScenePhase の更新がスレッドセーフになるように @MainActor をつけている
    @MainActor
    public func scenePhageChanged(scenePhase newScenePhase: ScenePhase) {
        scenePhaseSubject.send((oldScenePhase: oldScenePhase, newScenePhase: newScenePhase))
        LoggerContainer.log(.changeScenePhase(.init(oldScenePhase: oldScenePhase, newScenePhase: newScenePhase)))
        oldScenePhase = newScenePhase
    }
}

---

## 🤖 アシスタント
*2023/08/22 00:35:03*

はい、`@MainActor`を使用することで、`scenePhageChanged(scenePhase:)` メソッドがメインスレッドで実行されることが保証されます。これにより、`oldScenePhase`の読み取りや書き込みがスレッドセーフになります。

ただし、以下の点を注意してください：

1. **呼び出し元の制約**: `@MainActor`が付与されたメソッドを非メインスレッドから直接呼び出そうとすると、コンパイラはそれを非同期で呼び出すように指示する警告を発します。これを遵守するためには、呼び出し元も非同期的なコンテキストにあるか、もしくは`Task`を使用して非同期的にメソッドを呼び出す必要があります。

2. **他のスレッドセーフでないプロパティ**: このクラスに後から追加される他のプロパティやメソッドにも同様に注意が必要です。`@MainActor`は特定のメソッドやプロパティにのみ適用され、クラス全体をスレッドセーフにするわけではありません。

3. **パフォーマンス**: メインスレッドはUIの更新などのために使用されるため、`@MainActor`を過度に使用するとメインスレッドがブロックされる可能性があります。現在の`scenePhageChanged(scenePhase:)`メソッドの内容は比較的軽量に見えるので、問題はなさそうですが、このメソッドが重い処理を行うようになった場合、UIの反応性に影響する可能性があります。

総じて、`@MainActor`を使用することで、`scenePhageChanged(scenePhase:)`メソッドのスレッドセーフティが向上しています。しかし、上記の点を考慮して、将来的な変更や拡張を行う際には注意が必要です。

---
