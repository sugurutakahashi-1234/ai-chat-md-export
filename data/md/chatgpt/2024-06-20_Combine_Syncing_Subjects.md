# Combine Syncing Subjects

Date: 2024-06-20

---

## 👤 User
*2024-06-20 20:09:37*

let isPlayingSubject = PassthroughSubject&lt;Bool, Never&gt;() のストリームにlet isSeekingSubject = PassthroughSubject&lt;Bool, Never&gt;() を同期させる方法

---

## 🤖 Assistant
*2024-06-20 20:09:52*

`PassthroughSubject` を使用している場合、`Combine` フレームワークを活用して `isPlayingSubject` と `isSeekingSubject` を同期させることができます。以下は、`isPlayingSubject` の値が変更されたときに `isSeekingSubject` の値も変更されるように設定する方法の一例です。

```swift
import Combine

// PassthroughSubjectの定義
let isPlayingSubject = PassthroughSubject<Bool, Never>()
let isSeekingSubject = PassthroughSubject<Bool, Never>()

// isPlayingSubjectの値を監視し、isSeekingSubjectに値を送信する
let subscription = isPlayingSubject
    .sink { isPlaying in
        // isPlayingの値に基づいてisSeekingSubjectの値を設定するロジックをここに記述
        let isSeeking = !isPlaying // 例えば、isPlayingがtrueならisSeekingをfalseにするなど
        isSeekingSubject.send(isSeeking)
    }

// サンプルデータを送信して動作を確認
isPlayingSubject.send(true)  // isSeekingSubjectにfalseが送信される
isPlayingSubject.send(false) // isSeekingSubjectにtrueが送信される

// 必要に応じて、subscriptionを保持しておくか、キャンセルする
// subscription.cancel()
```

このコードは、`isPlayingSubject` のストリームに新しい値が送信されるたびに `isSeekingSubject` にも値が送信されるように設定しています。`isPlayingSubject` の値に基づいて `isSeekingSubject` の値を決定するロジックを `sink` クロージャ内に記述します。

もし `isPlayingSubject` と `isSeekingSubject` の値が複雑な条件やロジックに基づいて同期される場合は、そのロジックを `sink` クロージャ内で適切に実装してください。

---

## 👤 User
*2024-06-20 20:10:05*

sink ではなくて assign できないのか？

---

## 🤖 Assistant
*2024-06-20 20:10:25*

`assign` を使用する場合、`PassthroughSubject` のような `Publisher` から直接 `Subject` へ値を送ることはできません。`assign` は `Publisher` の出力を特定のプロパティにバインドするために使用されます。

`isSeekingSubject` の値をプロパティとして持つオブジェクトに割り当てる場合、`assign` を利用することができます。以下に、`CurrentValueSubject` を使った例を示します。

```swift
import Combine

// isPlayingとisSeekingを保持するオブジェクトの定義
class PlaybackState {
    @Published var isPlaying: Bool = false
    var isSeekingSubject = CurrentValueSubject<Bool, Never>(false)
    
    private var cancellables = Set<AnyCancellable>()
    
    init() {
        $isPlaying
            .map { !$0 } // isPlayingの反転値をisSeekingに割り当てる場合
            .assign(to: \.value, on: isSeekingSubject)
            .store(in: &cancellables)
    }
}

// オブジェクトのインスタンス作成
let playbackState = PlaybackState()

// サンプルデータを設定して動作を確認
playbackState.isPlaying = true  // isSeekingSubjectにfalseが送信される
print(playbackState.isSeekingSubject.value) // 出力: false

playbackState.isPlaying = false // isSeekingSubjectにtrueが送信される
print(playbackState.isSeekingSubject.value) // 出力: true
```

この例では、`PlaybackState` クラスが `@Published var isPlaying` プロパティと `CurrentValueSubject<Bool, Never>` 型の `isSeekingSubject` を持っています。`assign` を使って、`isPlaying` の値が変更されたときに `isSeekingSubject` の値を更新します。

`assign` はプロパティに値を割り当てるためのメソッドなので、直接 `PassthroughSubject` に使用することはできません。そのため、`CurrentValueSubject` を使用することで、プロパティのように値を保持しつつ、`assign` を使用して値を更新できます。

---
