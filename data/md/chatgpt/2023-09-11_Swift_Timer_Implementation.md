# Swift Timer Implementation

Date: 2023-09-11

---

## 👤 User
*2023-09-11 11:55:02*

Swiftで1秒経過ごとに1,2,3,4と値が増えていくタイマーのようなものを実装してほしい。

---

## 🤖 Assistant
*2023-09-11 11:55:42*

Swiftで1秒ごとに値が増加するタイマーを実装するためには、`Timer`を利用するのが簡単です。

以下は、基本的なタイマーの実装例です：

```swift
import UIKit

class TimerViewController: UIViewController {

    // UI要素
    @IBOutlet weak var label: UILabel!

    // タイマー用の変数
    var timer: Timer?
    var counter = 1

    override func viewDidLoad() {
        super.viewDidLoad()

        // タイマーを開始する関数を呼び出す
        startTimer()
    }

    func startTimer() {
        // タイマーがすでに動いている場合は、停止して再開始する
        timer?.invalidate()
        timer = Timer.scheduledTimer(timeInterval: 1.0, target: self, selector: #selector(updateCounter), userInfo: nil, repeats: true)
    }

    @objc func updateCounter() {
        // ラベルにカウンタの値を表示
        label.text = "\(counter)"

        // カウンタをインクリメント
        counter += 1
    }
}
```

このコードは、1秒ごとにラベルのテキストを更新して、値が1ずつ増加します。

この例を実際に動かすには、Storyboardなどで`UILabel`を配置し、そのOutletを上記の`label`と接続してください。

また、タイマーを停止する必要がある場合や、画面遷移などでViewControllerが破棄される場合には、適切な場所で`timer?.invalidate()`を呼び出して、タイマーを停止させることが推奨されます。これにより、メモリリークや不要な処理を防ぐことができます。

---

## 👤 User
*2023-09-11 11:55:48*

SwiftUIのMVVMモデルでVMで実装してほしい。

---

## 🤖 Assistant
*2023-09-11 11:56:38*

SwiftUIとMVVMパターンを組み合わせて、1秒ごとにカウントアップするタイマーを実装します。

1. **Model**:
モデル層はこのシンプルな例ではスキップしますが、通常はデータの定義やデータベース操作、API呼び出しを担当します。

2. **ViewModel**:
ViewModelはUIロジックを担当します。

```swift
import Combine
import SwiftUI

class TimerViewModel: ObservableObject {
    // カウンタの値を公開するための@Publishedプロパティ
    @Published var counter: Int = 1

    // TimerとCancellableを保持するための変数
    var timer: Timer?
    var cancellable: AnyCancellable?

    init() {
        startTimer()
    }

    deinit {
        timer?.invalidate()
    }

    func startTimer() {
        // TimerをCombineを利用してセットアップ
        timer = Timer.publish(every: 1, on: .main, in: .common).autoconnect()
        cancellable = timer?.sink(receiveValue: { [weak self] _ in
            self?.counter += 1
        })
    }

    func stopTimer() {
        timer?.invalidate()
        timer = nil
        cancellable?.cancel()
    }
}
```

3. **View**:
SwiftUIでUIを定義します。

```swift
struct TimerView: View {
    @ObservedObject var viewModel: TimerViewModel

    var body: some View {
        VStack {
            Text("\(viewModel.counter)")
                .font(.largeTitle)
            Button("Stop Timer") {
                viewModel.stopTimer()
            }
            .padding()
        }
    }
}
```

4. **Usage**:
ViewModelをインスタンス化し、それをViewにバインドして使用します。

```swift
struct ContentView: View {
    var body: some View {
        TimerView(viewModel: TimerViewModel())
    }
}
```

この方法でMVVMパターンを利用してSwiftUIでタイマーアプリを作成することができます。注意すべき点として、`TimerViewModel`の`deinit`メソッド内でタイマーを無効にしています。これは、ViewModelが破棄されたときにタイマーも破棄することを保証するためです。

---

## 👤 User
*2023-09-11 11:57:53*

Viewにはひょうじしなくていい。counterのスコープをなるべく小さくしたいんだどできないのかな。

---

## 🤖 Assistant
*2023-09-11 11:58:34*

了解しました。`counter`のスコープを`ViewModel`内部に制限し、外部からアクセスできないようにしたい場合、以下のように実装できます。

1. **ViewModel**:

`counter`を`private`にし、代わりに`displayedValue`という読み取り専用のプロパティを提供します。これにより、外部から`counter`の値は読み取れるものの、変更はできなくなります。

```swift
import Combine
import SwiftUI

class TimerViewModel: ObservableObject {
    // カウンタの値はViewModel内部でのみアクセス可能
    private var counter: Int = 1

    // 外部から読み取り可能な値を提供
    @Published var displayedValue: String = "1"

    private var timer: Timer?
    private var cancellable: AnyCancellable?

    init() {
        startTimer()
    }

    deinit {
        timer?.invalidate()
    }

    private func startTimer() {
        timer = Timer.publish(every: 1, on: .main, in: .common).autoconnect()
        cancellable = timer?.sink(receiveValue: { [weak self] _ in
            self?.counter += 1
            self?.displayedValue = "\(self?.counter ?? 1)"
        })
    }

    func stopTimer() {
        timer?.invalidate()
        timer = nil
        cancellable?.cancel()
    }
}
```

2. **View**:
`counter`の代わりに`displayedValue`を参照します。

```swift
struct TimerView: View {
    @ObservedObject var viewModel: TimerViewModel

    var body: some View {
        VStack {
            Text(viewModel.displayedValue)
                .font(.largeTitle)
            Button("Stop Timer") {
                viewModel.stopTimer()
            }
            .padding()
        }
    }
}
```

この方法で、`counter`のスコープがViewModel内に制限され、Viewからは直接アクセスできなくなりました。

---

## 👤 User
*2023-09-11 11:58:53*

displayedValue すらいらない。startTimer()でvar counter: Int = 1を宣言できないんだっけはてな

---

## 🤖 Assistant
*2023-09-11 11:59:38*

理解しました。`startTimer()`内で`counter`をローカル変数として定義し、外部からは完全に隠蔽したい、ということですね。

ただし、変数を関数の内部でのみ保持する場合、その変数はその関数が終了すると破棄されてしまいます。タイマーのコールバックの中でその変数を参照し続けるためには、何らかの方法で変数のライフサイクルを管理する必要があります。

この要件に応えるための一つの方法は、関数内でクロージャを使用して変数をキャプチャし続けることです。以下はその方法での実装例です。

```swift
import Combine
import SwiftUI

class TimerViewModel: ObservableObject {
    private var timer: Timer?
    private var cancellable: AnyCancellable?

    init() {
        startTimer()
    }

    deinit {
        timer?.invalidate()
    }

    private func startTimer() {
        var counter: Int = 1

        timer = Timer.publish(every: 1, on: .main, in: .common).autoconnect()
        cancellable = timer?.sink(receiveValue: { _ in
            counter += 1
            print(counter)  // ここでカウンタの値を出力や利用する
        })
    }

    func stopTimer() {
        timer?.invalidate()
        timer = nil
        cancellable?.cancel()
    }
}
```

この方法で、`counter`変数は`startTimer()`内部でのみ存在します。タイマーのコールバック（`sink`の中のクロージャ）によって、その変数はキャプチャされ続け、変数の値は更新され続けます。

注意: この方法では、`counter`の値は`ViewModel`の外部からはアクセスできないので、Viewでその値を表示することはできません。上記のコードでは、デバッグのために`print(counter)`としています。

---

## 👤 User
*2023-09-11 12:00:06*

循環参照にならないかな？

---

## 🤖 Assistant
*2023-09-11 12:00:49*

おっしゃるとおり、クロージャ内でselfやインスタンスのプロパティをキャプチャする場合、循環参照（リテインサイクル）のリスクがあります。しかし、上記のコード例では`counter`は単なる整数のローカル変数であり、`self`やその他のプロパティを直接参照していませんので、循環参照は発生しません。

ただし、もしクロージャ内で`self`やインスタンスのプロパティを使用する場合、クロージャのキャプチャリストを使用して弱参照（`weak`）や非所有参照（`unowned`）を使用することで循環参照を防ぐことができます。

例えば、以下のようにViewModel内で何らかの処理を行いたい場合：

```swift
cancellable = timer?.sink(receiveValue: { [weak self] _ in
    counter += 1
    self?.doSomething(with: counter)  // ここでselfを使用している
})
```

上記のように、`[weak self]`というキャプチャリストを使用することで、`self`は弱参照としてキャプチャされ、循環参照は防がれます。ただし、弱参照はオプショナルとして扱われるので、`self?`のようにオプショナルとしてアクセスする必要があります。

要は、循環参照を心配する場面は、クロージャが`self`やインスタンスのプロパティをキャプチャする場合です。ローカル変数のみをキャプチャしている場合には、その心配は不要です。

---
