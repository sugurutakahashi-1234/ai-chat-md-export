# SwiftUIでMVVMストップウォッチ

日付: 2023-09-21

---

## 👤 ユーザー
*2023/09/21 10:31:59*

SwiftUI でストップウォッチアプリをMVVMで記述して欲しい

---

## 🤖 アシスタント
*2023/09/21 10:33:07*

もちろん、以下はMVVMを使用してSwiftUIでストップウォッチを実装する基本的な例です。

1. **Model**: データやビジネスロジックを扱います。
```swift
struct Stopwatch {
    var secondsElapsed = 0.0
}
```

2. **ViewModel**: ModelとViewの橋渡し役として働きます。この例では、ストップウォッチの制御と表示に関するロジックを担当します。
```swift
class StopwatchViewModel: ObservableObject {
    @Published var stopwatch = Stopwatch()
    var timer: Timer?

    func start() {
        timer?.invalidate()
        timer = Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true) { _ in
            self.stopwatch.secondsElapsed += 0.1
        }
    }

    func stop() {
        timer?.invalidate()
    }

    func reset() {
        stop()
        stopwatch.secondsElapsed = 0.0
    }
}
```

3. **View**: UI部分を担当します。
```swift
struct StopwatchView: View {
    @ObservedObject var viewModel = StopwatchViewModel()

    var body: some View {
        VStack {
            Text(String(format: "%.1f", viewModel.stopwatch.secondsElapsed))
                .font(.largeTitle)

            HStack {
                Button(action: {
                    viewModel.start()
                }) {
                    Text("Start")
                        .padding()
                }

                Button(action: {
                    viewModel.stop()
                }) {
                    Text("Stop")
                        .padding()
                }

                Button(action: {
                    viewModel.reset()
                }) {
                    Text("Reset")
                        .padding()
                }
            }
        }
    }
}
```

4. **表示**
```swift
struct ContentView: View {
    var body: some View {
        StopwatchView()
    }
}

@main
struct StopwatchApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

このコードは基本的なストップウォッチアプリを作成します。ボタンを使用してタイマーを開始、停止、リセットできます。デザインや機能の追加など、さらなる拡張が可能です。

---

## 👤 ユーザー
*2023/09/21 10:34:17*

内部では 0.1 秒づつカウントするけど、画面では 1秒づつカウントするようにしたい。

---

## 🤖 アシスタント
*2023/09/21 10:34:59*

了解しました。ストップウォッチの内部では0.1秒づつカウントする一方、画面には整数の秒数だけを表示するように変更します。

1. **ViewModelの変更**: 表示するための整数の秒数を持つプロパティを追加しましょう。
```swift
class StopwatchViewModel: ObservableObject {
    @Published var stopwatch = Stopwatch()
    @Published var displaySeconds = 0  // これを追加
    var timer: Timer?

    func start() {
        timer?.invalidate()
        timer = Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true) { _ in
            self.stopwatch.secondsElapsed += 0.1

            // これを追加
            self.displaySeconds = Int(self.stopwatch.secondsElapsed)
        }
    }

    // ... その他のメソッドは前述のまま ...
}
```

2. **Viewの変更**: 表示するテキストを変更して、新しく追加した`displaySeconds`プロパティを使用するようにします。
```swift
struct StopwatchView: View {
    @ObservedObject var viewModel = StopwatchViewModel()

    var body: some View {
        VStack {
            // ここを変更
            Text("\(viewModel.displaySeconds)")
                .font(.largeTitle)

            // ... ボタンの部分は前述のまま ...
        }
    }
}
```

これで、内部のカウントは0.1秒ごとに行われますが、画面上では整数の秒数だけが表示されます。

---

## 👤 ユーザー
*2023/09/21 10:35:27*

それだと displaySeconds の更新が 0.1 秒ごとにあるがそれだと無駄な描画が発生するので、更新も1秒刻みにしたい

---

## 🤖 アシスタント
*2023/09/21 10:35:57*

了解しました。それを考慮して、`displaySeconds`の更新も1秒ごとに行われるように変更します。

以下のように`StopwatchViewModel`を変更します：

```swift
class StopwatchViewModel: ObservableObject {
    @Published var stopwatch = Stopwatch()
    @Published var displaySeconds = 0
    var timer: Timer?

    func start() {
        timer?.invalidate()
        timer = Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true) { _ in
            self.stopwatch.secondsElapsed += 0.1

            // displaySecondsが1秒ごとに更新されるように条件を追加
            if Int(self.stopwatch.secondsElapsed) > self.displaySeconds {
                self.displaySeconds = Int(self.stopwatch.secondsElapsed)
            }
        }
    }

    // ... その他のメソッドは前述のまま ...
}
```

この変更により、`displaySeconds`は1秒ごとにのみ更新され、不要な再描画は発生しないようになります。

---

## 👤 ユーザー
*2023/09/21 10:36:43*

うまくCombineを使って表現できないかな？

---

## 🤖 アシスタント
*2023/09/21 10:37:40*

もちろん、Combineフレームワークを利用してより宣言的な方式でこの問題を解決できます。特に`PassthroughSubject`と`debounce`や`filter`を組み合わせることで、この要件を満たすことができます。

1. `StopwatchViewModel`の変更:

```swift
import Combine

class StopwatchViewModel: ObservableObject {
    @Published var stopwatch = Stopwatch()
    @Published var displaySeconds = 0

    var timer: Timer?
    private var cancellables = Set<AnyCancellable>()

    // PassthroughSubjectを用いてsecondsElapsedの変化を通知
    private let secondsElapsedSubject = PassthroughSubject<Double, Never>()

    init() {
        // secondsElapsedSubjectの変化を監視して整数部分が変わったときのみdisplaySecondsを更新
        secondsElapsedSubject
            .map { Int($0) }
            .removeDuplicates()
            .sink { [weak self] in self?.displaySeconds = $0 }
            .store(in: &cancellables)
    }

    func start() {
        timer?.invalidate()
        timer = Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true) { [weak self] _ in
            self?.stopwatch.secondsElapsed += 0.1
            self?.secondsElapsedSubject.send(self?.stopwatch.secondsElapsed ?? 0)
        }
    }

    // ... その他のメソッドは前述のまま ...
}
```

上記のコードでは、`secondsElapsedSubject`という`PassthroughSubject`を使用して、`secondsElapsed`の変更を通知します。その後、`map`を使用して小数点以下を切り捨て、`removeDuplicates`を用いて前回と同じ値の場合は更新しないようにします。最終的に`sink`を使って、`displaySeconds`の値を設定します。

これにより、Combineの力を利用して宣言的に1秒ごとの更新を実現できます。

---

## 👤 ユーザー
*2023/09/21 10:40:24*

Timer.publish(every: 0.1, on: .main, in: .common)  を使って 全部まとめられないか？@Published var stopwatch = Stopwatch()もいらない気がしている

---

## 🤖 アシスタント
*2023/09/21 10:41:08*

了解しました。`Timer.publish`を使って、ViewModelをさらにシンプルに整理できます。

以下は`Timer.publish`を利用してCombineで実装したバージョンです：

```swift
import SwiftUI
import Combine

class StopwatchViewModel: ObservableObject {
    @Published var displaySeconds = 0

    private var cancellables = Set<AnyCancellable>()

    private var elapsedSeconds: Double = 0.0

    private var timer: AnyCancellable?

    func start() {
        timer = Timer.publish(every: 0.1, on: .main, in: .common)
            .autoconnect()
            .sink { [weak self] _ in
                self?.elapsedSeconds += 0.1
                let newDisplayValue = Int(self?.elapsedSeconds ?? 0)
                if newDisplayValue != self?.displaySeconds {
                    self?.displaySeconds = newDisplayValue
                }
            }
    }

    func stop() {
        timer?.cancel()
    }

    func reset() {
        timer?.cancel()
        elapsedSeconds = 0.0
        displaySeconds = 0
    }
}
```

上記のコードでは、`Timer.publish`を利用して0.1秒ごとにタイマーをトリガーしています。`autoconnect()`は、最初のsubscriberが接続されたときに自動的にタイマーを開始します。次に、`sink`でクロージャを使用して時間を更新します。

この方法で、`@Published var stopwatch = Stopwatch()`を削除して、ViewModelをさらにシンプルにしました。

---

## 👤 ユーザー
*2023/09/21 10:41:47*

そして、scan .map .removeDuplicates() でうまくやってほしい

---

## 🤖 アシスタント
*2023/09/21 10:42:38*

了解しました！`scan`, `map`, および `removeDuplicates()` を使って、ストップウォッチのロジックをさらに洗練させることができます。

以下のように`StopwatchViewModel`を更新します：

```swift
import SwiftUI
import Combine

class StopwatchViewModel: ObservableObject {
    @Published var displaySeconds = 0

    private var cancellables = Set<AnyCancellable>()
    private var timer: AnyCancellable?

    func start() {
        timer = Timer.publish(every: 0.1, on: .main, in: .common)
            .autoconnect()
            .scan(0.0, { elapsed, _ in
                return elapsed + 0.1
            })
            .map { Int($0) }
            .removeDuplicates()
            .assign(to: \.displaySeconds, on: self)
    }

    func stop() {
        timer?.cancel()
    }

    func reset() {
        timer?.cancel()
        displaySeconds = 0
    }
}
```

この実装では、以下のステップを取ります：

1. `scan`: これは0.1秒ごとの加算を行います。この操作は累積の値を作成し、その結果を次のクロージャに渡します。
2. `map`: `scan`の結果を整数に変換します。
3. `removeDuplicates`: 連続して同じ値を排除するためのものです。この操作により、整数の部分が変わらない限り、`displaySeconds`の更新をトリガーすることはありません。

この流れにより、結果として表示秒数は1秒ごとにのみ更新されます。

---

## 👤 ユーザー
*2023/09/21 10:42:41*

restartをうまく実装してほしい

---

## 🤖 アシスタント
*2023/09/21 10:44:07*

了解しました。再開機能（restart）は、ストップウォッチを一時停止した後に再度開始する機能です。以下のステップで実装します。

1. `StopwatchViewModel`の更新:

- `elapsedSeconds`のプロパティを追加して、ストップウォッチの状態を保存します。
- `restart`メソッドを追加して、ストップウォッチを再開します。
- `stop`メソッドを更新して、現在の`elapsedSeconds`の値を保存します。

```swift
import SwiftUI
import Combine

class StopwatchViewModel: ObservableObject {
    @Published var displaySeconds = 0

    private var cancellables = Set<AnyCancellable>()
    private var timer: AnyCancellable?
    private var elapsedSeconds: Double = 0.0  // 現在の秒数を記録するための変数

    func start() {
        timer = Timer.publish(every: 0.1, on: .main, in: .common)
            .autoconnect()
            .scan(elapsedSeconds, { elapsed, _ in
                return elapsed + 0.1
            })
            .map { Int($0) }
            .removeDuplicates()
            .sink { [weak self] in
                self?.elapsedSeconds = Double($0)
                self?.displaySeconds = $0
            }
    }

    func stop() {
        timer?.cancel()
        timer = nil
    }

    func reset() {
        timer?.cancel()
        timer = nil
        elapsedSeconds = 0.0
        displaySeconds = 0
    }

    func restart() {
        if timer == nil {  // タイマーが動いていない場合のみ再開
            start()
        }
    }
}
```

2. Viewの更新:

`restart`メソッドをトリガーする新しいボタンを追加します。

```swift
struct StopwatchView: View {
    @ObservedObject var viewModel = StopwatchViewModel()

    var body: some View {
        VStack {
            Text("\(viewModel.displaySeconds)")
                .font(.largeTitle)

            HStack {
                Button(action: viewModel.start) {
                    Text("Start")
                        .padding()
                }

                Button(action: viewModel.stop) {
                    Text("Stop")
                        .padding()
                }

                Button(action: viewModel.reset) {
                    Text("Reset")
                        .padding()
                }

                Button(action: viewModel.restart) {
                    Text("Restart")
                        .padding()
                }
            }
        }
    }
}
```

この実装で、`Stop`ボタンを押して一時停止した後、`Restart`ボタンを押すことでストップウォッチを再開することができます。

---

## 👤 ユーザー
*2023/09/21 10:45:17*

Combinelastestを使って、restart をもっとうまく表現できないか？

---

## 🤖 アシスタント
*2023/09/21 10:45:47*

`CombineLatest` は複数の `Publisher` の最新の値の組み合わせを使用することができます。ここでは、現在の `elapsedSeconds` とタイマーの値を組み合わせることで、`restart` をよりシンプルに表現できるかを検討します。

しかし、このケースにおいて、`CombineLatest` を使用するのは少し過剰かもしれません。代わりに、単純に `start` メソッドを再利用し、`elapsedSeconds` の値をベースとして使用することで再開機能を実現することができます。

しかし、もし `CombineLatest` を使用して具体的なケースを試してみたいのであれば、具体的なシナリオや目的を教えてください。それに基づいてより適切な提案を行います。

---

## 👤 ユーザー
*2023/09/21 10:46:31*

elapsedSeconds の変数を使いたくないんだ。グローバルな変数を作りたくない。restartでsendするだけにしたい。

---

## 🤖 アシスタント
*2023/09/21 10:47:48*

了解しました。`elapsedSeconds` を排除し、ストリームの中でのみデータを管理したい場合、`PassthroughSubject` を利用して直接 `send` を行い、タイマーの値と結合する方法を試してみましょう。

以下のように実装を修正します：

```swift
import SwiftUI
import Combine

class StopwatchViewModel: ObservableObject {
    @Published var displaySeconds = 0

    private var cancellables = Set<AnyCancellable>()
    private var timer: AnyCancellable?

    // 現在の秒数を送信するための PassthroughSubject
    private let elapsedSecondsSubject = PassthroughSubject<Double, Never>()

    func start() {
        timer = Timer.publish(every: 0.1, on: .main, in: .common)
            .autoconnect()
            .combineLatest(elapsedSecondsSubject)
            .scan(0.0) { accumulated, _ in
                return accumulated + 0.1
            }
            .map { Int($0) }
            .removeDuplicates()
            .sink { [weak self] in
                self?.displaySeconds = $0
            }
    }

    func stop() {
        timer?.cancel()
        timer = nil
    }

    func reset() {
        elapsedSecondsSubject.send(0.0)
        displaySeconds = 0
    }

    func restart() {
        elapsedSecondsSubject.send(Double(displaySeconds))
        start()
    }
}
```

1. `elapsedSecondsSubject` は、再開するときに現在の経過時間を送信するための `PassthroughSubject` です。
2. `start` メソッドでは、`combineLatest` を利用してタイマーの出力と `elapsedSecondsSubject` の出力を結合します。この結果、タイマーがトリガーされるたびに `elapsedSecondsSubject` からの最新の値と組み合わされます。
3. `scan` では、累積された時間を更新します。
4. `restart` メソッドでは、現在の `displaySeconds` を `elapsedSecondsSubject` に `send` して、タイマーの再開地点として設定します。

この実装により、`elapsedSeconds` というグローバルな変数を使用せずに再開機能を実現することができます。

---

## 👤 ユーザー
*2023/09/21 10:48:05*

elapsedSecondsSubject のPassthroughSubject は Bool で表現してほしい。0.1 を static let な変数として宣言したい。

---

## 🤖 アシスタント
*2023/09/21 10:49:25*

承知しました。`PassthroughSubject`を`Bool`で表現し、再開をトリガーするために`true`を`send`する方法を採用します。また、`0.1`を`static let`として定義します。

以下のように修正します：

```swift
import SwiftUI
import Combine

class StopwatchViewModel: ObservableObject {
    @Published var displaySeconds = 0

    private var cancellables = Set<AnyCancellable>()
    private var timer: AnyCancellable?

    // 再開のトリガーとして使用するPassthroughSubject
    private let restartSubject = PassthroughSubject<Bool, Never>()

    static let timeIncrement: Double = 0.1

    func start() {
        timer = Timer.publish(every: StopwatchViewModel.timeIncrement, on: .main, in: .common)
            .autoconnect()
            .combineLatest(restartSubject)
            .scan(0.0) { accumulated, tuple in
                let (newTime, isRestarting) = tuple
                return isRestarting ? Double(self.displaySeconds) + newTime : accumulated + StopwatchViewModel.timeIncrement
            }
            .map { Int($0) }
            .removeDuplicates()
            .sink { [weak self] in
                self?.displaySeconds = $0
            }
    }

    func stop() {
        timer?.cancel()
        timer = nil
    }

    func reset() {
        displaySeconds = 0
    }

    func restart() {
        restartSubject.send(true)
        start()
    }
}
```

変更の概要:

1. `restartSubject` は `Bool` で再開のトリガーを表現します。
2. `static let timeIncrement` で `0.1` の値を静的に保持します。
3. `start` メソッドの中で、`combineLatest` を使用してタイマーの出力と `restartSubject` の出力を組み合わせ、タプルの形で取得します。
4. `scan` の中で、`isRestarting` が `true` の場合は、`displaySeconds` から再開します。それ以外の場合は、通常どおり時間を増加させます。
5. `restart` メソッドでは、再開のトリガーとして `true` を `send` します。

これにより、`restartSubject` を使用して再開をトリガーし、`elapsedSeconds` という変数を削除することができました。

---

## 👤 ユーザー
*2023/09/21 10:49:46*

func stop() は restartSubject.send(false)だけで表現できないかrestart() もrestartSubject.send(true)だけで表現したい

---

## 🤖 アシスタント
*2023/09/21 10:51:01*

了解しました。そのように`stop()`と`restart()`を`restartSubject.send()`でシンプルに表現することができます。

以下のように変更します：

```swift
import SwiftUI
import Combine

class StopwatchViewModel: ObservableObject {
    @Published var displaySeconds = 0

    private var timer: AnyCancellable?

    // 再開と停止のトリガーとして使用するPassthroughSubject
    private let restartSubject = PassthroughSubject<Bool, Never>()

    static let timeIncrement: Double = 0.1

    init() {
        timer = Timer.publish(every: StopwatchViewModel.timeIncrement, on: .main, in: .common)
            .autoconnect()
            .combineLatest(restartSubject)
            .scan(0.0) { accumulated, tuple in
                let (newTime, isRestarting) = tuple
                if isRestarting {
                    return Double(self.displaySeconds) + newTime
                } else {
                    return accumulated
                }
            }
            .map { Int($0) }
            .removeDuplicates()
            .sink { [weak self] in
                self?.displaySeconds = $0
            }
    }

    func stop() {
        restartSubject.send(false)
    }

    func reset() {
        displaySeconds = 0
    }

    func restart() {
        restartSubject.send(true)
    }
}
```

以下の点を変更しました：

1. `init()`の中で、`Timer`を初期化し、すぐに`autoconnect()`を使って接続します。これにより、ストップウォッチはインスタンスが作成された時点で開始され、`restartSubject`の値に応じて動作します。
2. `restartSubject`を使用して、再開と停止をトリガーします。`true`が`send`されると再開し、`false`が`send`されると停止します。
3. `stop()`と`restart()`は、それぞれ`restartSubject`に`false`と`true`を`send`するだけのシンプルなメソッドになりました。

この設計は非常にシンプルで簡潔ですが、`init`の中でタイマーが自動的にスタートするのは少し直感的ではないかもしれません。必要に応じて適切に調整してください。

---

## 👤 ユーザー
*2023/09/21 10:52:41*

.sink { [weak self] in
                self?.displaySeconds = $0
            }

は assignで表現して欲しい。
また、start関数も設置して欲しい。timeIncrementももっとわかりやすい表現に変えて欲しい

---

## 🤖 アシスタント
*2023/09/21 10:53:38*

指摘を受けて、以下のように修正を行います：

1. `.sink` を `.assign` に変更して、シンプルな代入を実現します。
2. `start` 関数を追加します。
3. `timeIncrement` をより説明的な名前に変更します。

```swift
import SwiftUI
import Combine

class StopwatchViewModel: ObservableObject {
    @Published var displaySeconds = 0

    private var timer: AnyCancellable?
    private var displaySubscription: AnyCancellable?

    // 再開と停止のトリガーとして使用するPassthroughSubject
    private let restartSubject = PassthroughSubject<Bool, Never>()

    static let intervalForTimerUpdate: Double = 0.1

    func start() {
        timer = Timer.publish(every: StopwatchViewModel.intervalForTimerUpdate, on: .main, in: .common)
            .autoconnect()
            .combineLatest(restartSubject)
            .scan(0.0) { accumulated, tuple in
                let (newTime, isRestarting) = tuple
                if isRestarting {
                    return Double(self.displaySeconds) + newTime
                } else {
                    return accumulated
                }
            }
            .map { Int($0) }
            .removeDuplicates()
            .assign(to: &$displaySeconds)
    }

    func stop() {
        restartSubject.send(false)
    }

    func reset() {
        displaySeconds = 0
    }

    func restart() {
        restartSubject.send(true)
    }
}
```

変更の概要:

1. `sink` の代わりに `assign` を使用して `displaySeconds` に値を代入します。
2. `timeIncrement` を `intervalForTimerUpdate` に変更し、その意味を明確にしました。
3. `start` 関数を追加し、その中でタイマーを開始するようにしました。この関数を呼び出すことでタイマーが動作し始めます。

これで、指摘された点をすべて取り込んだ形になります。

---

## 👤 ユーザー
*2023/09/21 11:00:25*

private var timer: AnyCancellable? いらなくないですか？
intervalForTimerUpdate もちょっとわかりづらい、

---

## 🤖 アシスタント
*2023/09/21 11:01:11*

確かに、`.assign`を使っているため、`timer`変数はもはや不要です。さらに、`intervalForTimerUpdate`の名前をもっとシンプルにしたい場合、`timerInterval`などの名前にすると良いでしょう。

以下のように修正します：

```swift
import SwiftUI
import Combine

class StopwatchViewModel: ObservableObject {
    @Published var displaySeconds = 0

    // 再開と停止のトリガーとして使用するPassthroughSubject
    private let restartSubject = PassthroughSubject<Bool, Never>()

    static let timerInterval: Double = 0.1

    func start() {
        Timer.publish(every: StopwatchViewModel.timerInterval, on: .main, in: .common)
            .autoconnect()
            .combineLatest(restartSubject)
            .scan(0.0) { accumulated, tuple in
                let (newTime, isRestarting) = tuple
                if isRestarting {
                    return Double(self.displaySeconds) + newTime
                } else {
                    return accumulated
                }
            }
            .map { Int($0) }
            .removeDuplicates()
            .assign(to: &$displaySeconds)
    }

    func stop() {
        restartSubject.send(false)
    }

    func reset() {
        displaySeconds = 0
    }

    func restart() {
        restartSubject.send(true)
    }
}
```

変更点:

1. `private var timer: AnyCancellable?` を削除しました。
2. `intervalForTimerUpdate` を `timerInterval` に変更しました。

これにより、コードがよりシンプルかつ簡潔になりました。

---

## 👤 ユーザー
*2023/09/21 11:44:57*

restartSubject の命名がおかしい気がする

---

## 🤖 アシスタント
*2023/09/21 11:46:04*

確かに、`restartSubject`という名前は再開専用の動作を示唆していますが、実際には再開と停止の両方のトリガーとして使われています。このため、より一般的な名前に変更すると、その目的をより正確に反映することができます。

`actionTrigger`や`timerControl`など、その動作を示す名前に変更することを検討します。

以下は、`timerControl`を使用した例です：

```swift
import SwiftUI
import Combine

class StopwatchViewModel: ObservableObject {
    @Published var displaySeconds = 0

    // タイマーの再開と停止のトリガーとして使用するPassthroughSubject
    private let timerControl = PassthroughSubject<Bool, Never>()

    static let timerInterval: Double = 0.1

    func start() {
        Timer.publish(every: StopwatchViewModel.timerInterval, on: .main, in: .common)
            .autoconnect()
            .combineLatest(timerControl)
            .scan(0.0) { accumulated, tuple in
                let (newTime, shouldRun) = tuple
                if shouldRun {
                    return Double(self.displaySeconds) + newTime
                } else {
                    return accumulated
                }
            }
            .map { Int($0) }
            .removeDuplicates()
            .assign(to: &$displaySeconds)
    }

    func stop() {
        timerControl.send(false)
    }

    func reset() {
        displaySeconds = 0
    }

    func restart() {
        timerControl.send(true)
    }
}
```

`timerControl`という名前は、この`PassthroughSubject`がタイマーの制御に関連するトリガーとして使用されることを示しています。

---

## 👤 ユーザー
*2023/09/21 11:46:17*

scan の前に フィルターした方が良くない？

---

## 🤖 アシスタント
*2023/09/21 11:47:30*

確かに、タイマーの更新が必要ない場合（例えば、停止状態のとき）に、不要な計算を避けるために`.filter`を使って処理を最適化できます。これにより、`shouldRun`が`true`の場合にのみストリームを進めるようにします。

以下のように修正を行います：

```swift
import SwiftUI
import Combine

class StopwatchViewModel: ObservableObject {
    @Published var displaySeconds = 0

    // タイマーの再開と停止のトリガーとして使用するPassthroughSubject
    private let timerControl = PassthroughSubject<Bool, Never>()

    static let timerInterval: Double = 0.1

    func start() {
        Timer.publish(every: StopwatchViewModel.timerInterval, on: .main, in: .common)
            .autoconnect()
            .combineLatest(timerControl)
            .filter { $0.1 }  // shouldRun が true の場合のみストリームを進める
            .scan(0.0) { accumulated, tuple in
                let (newTime, _) = tuple
                return Double(self.displaySeconds) + newTime
            }
            .map { Int($0) }
            .removeDuplicates()
            .assign(to: &$displaySeconds)
    }

    func stop() {
        timerControl.send(false)
    }

    func reset() {
        displaySeconds = 0
    }

    func restart() {
        timerControl.send(true)
    }
}
```

`.filter { $0.1 }` によって、タイマーの更新が必要ない場合（`shouldRun`が`false`の場合）に、後続の処理（`.scan`や`.map`など）が行われないようになります。これにより、不要な計算を減らすことができます。

---

## 👤 ユーザー
*2023/09/21 11:48:19*

.scan の 前に タプルの必要な部分だけ map したほうがよくない？

---

## 🤖 アシスタント
*2023/09/21 11:49:41*

はい、`.map` を使ってタプルの必要な部分だけを取り出し、その後の処理をシンプルにすることは良い考えです。それによって、後続の処理がより読みやすく、直感的になります。

以下のように修正を行います：

```swift
import SwiftUI
import Combine

class StopwatchViewModel: ObservableObject {
    @Published var displaySeconds = 0

    // タイマーの再開と停止のトリガーとして使用するPassthroughSubject
    private let timerControl = PassthroughSubject<Bool, Never>()

    static let timerInterval: Double = 0.1

    func start() {
        Timer.publish(every: StopwatchViewModel.timerInterval, on: .main, in: .common)
            .autoconnect()
            .combineLatest(timerControl)
            .filter { $0.1 }  // shouldRun が true の場合のみストリームを進める
            .map { (newTime, _) in newTime } // タプルの新しい時間部分だけを取り出す
            .scan(Double(displaySeconds)) { accumulated, newTime in
                accumulated + newTime
            }
            .map { Int($0) }
            .removeDuplicates()
            .assign(to: &$displaySeconds)
    }

    func stop() {
        timerControl.send(false)
    }

    func reset() {
        displaySeconds = 0
    }

    func restart() {
        timerControl.send(true)
    }
}
```

ここで、`.map { (newTime, _) in newTime }` を使って、タプルの新しい時間部分だけを取り出しています。その後、`.scan`で計算を行うときには、タイムの部分だけを使用して処理を行います。これによって、`.scan` の中でタプルを解析する必要がなくなりました。

---

## 👤 ユーザー
*2023/09/21 11:50:45*

以下のようにして欲しい


class StopwatchViewModel: ObservableObject {
    @Published var displaySeconds = 0

    // タイマーの再開と停止のトリガーとして使用するPassthroughSubject
    private let timerControl = PassthroughSubject&lt;Bool, Never&gt;()

    static let timerInterval: Double = 0.1

    func start() {
        Timer.publish(every: StopwatchViewModel.timerInterval, on: .main, in: .common)
            .autoconnect()
            .combineLatest(timerControl)
            .filter { _, shouldRun in shouldRun }
            .map { newTime, _ in newTime } // タプルの新しい時間部分だけを取り出す
            .scan(Double(displaySeconds)) { accumulated, newTime in
                accumulated + newTime
            }
            .map { Int($0) }
            .removeDuplicates()
            .assign(to: &$displaySeconds)
    }

    func stop() {
        timerControl.send(false)
    }

    func reset() {
        displaySeconds = 0
    }

    func restart() {
        timerControl.send(true)
    }
}

---

## 🤖 アシスタント
*2023/09/21 11:51:44*

指定されたコードは、シンプルで読みやすく、タプルを解析する部分をより明示的にしています。

以下は、要求に従って修正したコードです：

```swift
import SwiftUI
import Combine

class StopwatchViewModel: ObservableObject {
    @Published var displaySeconds = 0

    // タイマーの再開と停止のトリガーとして使用するPassthroughSubject
    private let timerControl = PassthroughSubject<Bool, Never>()

    static let timerInterval: Double = 0.1

    func start() {
        Timer.publish(every: StopwatchViewModel.timerInterval, on: .main, in: .common)
            .autoconnect()
            .combineLatest(timerControl)
            .filter { _, shouldRun in shouldRun } // shouldRun が true の場合のみストリームを進める
            .map { newTime, _ in newTime }       // タプルの新しい時間部分だけを取り出す
            .scan(Double(displaySeconds)) { accumulated, newTime in
                accumulated + newTime
            }
            .map { Int($0) }
            .removeDuplicates()
            .assign(to: &$displaySeconds)
    }

    func stop() {
        timerControl.send(false)
    }

    func reset() {
        displaySeconds = 0
    }

    func restart() {
        timerControl.send(true)
    }
}
```

この修正により、ストリームの各ステップが何を行っているのかが一目でわかるようになりました。

---

## 👤 ユーザー
*2023/09/21 11:51:49*

newTime が Double型じゃないんだけど

---

## 🤖 アシスタント
*2023/09/21 11:53:06*

失礼しました。`Timer.publish` は `Date` オブジェクトを返します。こちらは修正が必要です。

しかし、直接的にこの `Date` オブジェクトを秒として加算するのは正しくありません。代わりに、カウントを増やすための固定のインクリメント値（この場合は `0.1`）を返すように `.map` を変更します。

以下が修正されたコードです：

```swift
import SwiftUI
import Combine

class StopwatchViewModel: ObservableObject {
    @Published var displaySeconds = 0

    // タイマーの再開と停止のトリガーとして使用するPassthroughSubject
    private let timerControl = PassthroughSubject<Bool, Never>()

    static let timerIncrement: Double = 0.1

    func start() {
        Timer.publish(every: StopwatchViewModel.timerIncrement, on: .main, in: .common)
            .autoconnect()
            .combineLatest(timerControl)
            .filter { _, shouldRun in shouldRun } 
            .map { _ in StopwatchViewModel.timerIncrement } // インクリメント値を返す
            .scan(Double(displaySeconds)) { accumulated, increment in
                accumulated + increment
            }
            .map { Int($0) }
            .removeDuplicates()
            .assign(to: &$displaySeconds)
    }

    func stop() {
        timerControl.send(false)
    }

    func reset() {
        displaySeconds = 0
    }

    func restart() {
        timerControl.send(true)
    }
}
```

`.map` 関数を使って、`Date` を単純なインクリメント値（`0.1`）に変換しました。これにより、`.scan` 関数内での加算が正しく行われます。

---

## 👤 ユーザー
*2023/09/21 11:53:34*

measureInterval(using:) とか使って時間間隔を取得できないのか

---

## 🤖 アシスタント
*2023/09/21 11:54:34*

はい、`measureInterval(using:)` を利用して、直前の日付との間隔を取得し、その間隔を加算することができます。

これを利用する場合、`Date` の間隔を秒数として取得し、それを累積する形になります。

以下はそのアプローチを取り入れたコードです：

```swift
import SwiftUI
import Combine

class StopwatchViewModel: ObservableObject {
    @Published var displaySeconds = 0

    private let timerControl = PassthroughSubject<Bool, Never>()

    func start() {
        Timer.publish(every: 0.1, on: .main, in: .common)
            .autoconnect()
            .combineLatest(timerControl)
            .filter { _, shouldRun in shouldRun }
            .measureInterval(using: RunLoop.main)  // Date間のインターバルを測定
            .map { interval in interval.magnitude } // Date間隔を秒数として取得
            .scan(Double(displaySeconds)) { accumulated, interval in
                accumulated + interval
            }
            .map { Int($0) }
            .removeDuplicates()
            .assign(to: &$displaySeconds)
    }

    func stop() {
        timerControl.send(false)
    }

    func reset() {
        displaySeconds = 0
    }

    func restart() {
        timerControl.send(true)
    }
}
```

こちらのアプローチでは、`measureInterval(using:)` を用いて2つの連続する出力日付の間隔を取得し、それを秒数として累積しています。

---
