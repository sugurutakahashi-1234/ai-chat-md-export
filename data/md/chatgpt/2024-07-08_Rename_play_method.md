# Rename play method

日付: 2024-07-08

---

## 👤 ユーザー
*2024/07/08 13:19:06*

func play() を すでに prepareToPlay を play するという命名に変えたい

/// @mockable
public protocol AudioPlayDriverProtocol: AnyObject, Sendable {
    var currentTimePublisher: AnyPublisher&lt;TimeInterval, Never&gt; { get }
    var durationPublisher: AnyPublisher&lt;TimeInterval, Never&gt; { get }
    var isPlayingPublisher: AnyPublisher&lt;Bool, Never&gt; { get }
    var audioVolumeLevelPublisher: AnyPublisher&lt;Double, Never&gt; { get }

    var isSeekingSubject: CurrentValueSubject&lt;Bool, Never&gt; { get }

    /// 以下は同期再生
    func play(audioSource: AudioSource) async throws

    // 以下は非同期再生
    func prepareToPlay(audioSource: AudioSource) async throws
    func play()

    func pause()
    func seek(to time: TimeInterval)
}

---

## 🤖 アシスタント
*2024/07/08 13:19:16*

`func play() をすでに prepareToPlay を play するという命名に変えたい`とのことですので、`func play()`を`func prepareToPlay()`に変更し、既存の`func prepareToPlay`は別の適切な名前に変更します。例えば、`func prepareToPlay`を`func setupForPlay`に変更するのが適切です。

以下はその変更を適用したコードです：

```swift
/// @mockable
public protocol AudioPlayDriverProtocol: AnyObject, Sendable {
    var currentTimePublisher: AnyPublisher<TimeInterval, Never> { get }
    var durationPublisher: AnyPublisher<TimeInterval, Never> { get }
    var isPlayingPublisher: AnyPublisher<Bool, Never> { get }
    var audioVolumeLevelPublisher: AnyPublisher<Double, Never> { get }

    var isSeekingSubject: CurrentValueSubject<Bool, Never> { get }

    /// 以下は同期再生
    func play(audioSource: AudioSource) async throws

    // 以下は非同期再生
    func setupForPlay(audioSource: AudioSource) async throws
    func prepareToPlay()

    func pause()
    func seek(to time: TimeInterval)
}
```

この変更により、`func play()`は`func prepareToPlay()`に変更され、既存の`func prepareToPlay`は`func setupForPlay`に変更されました。この方法で、意図した命名の変更が達成されます。

---
