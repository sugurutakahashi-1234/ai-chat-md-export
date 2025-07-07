# AVAudioPlayer 書き直し

日付: 2024-06-20

---

## 👤 ユーザー
*2024/6/21 0:47:08*

以下の処理を全部AVAudioPlayerで書き直してほしい。


// swiftformat:disable indent
#if os(iOS)
import AVFoundation
import Combine

public final class AudioPlayDriver: AudioPlayDriverProtocol {
    private nonisolated(unsafe) var player: AVPlayer?
    private nonisolated(unsafe) var cancellables: Set&lt;AnyCancellable&gt; = \[\]
    private nonisolated(unsafe) let errorSubject = PassthroughSubject&lt;AppError, Never&gt;()
    private nonisolated(unsafe) let currentTimeSubject = CurrentValueSubject&lt;TimeInterval, Never&gt;(0.0)
    private nonisolated(unsafe) let durationSubject = CurrentValueSubject&lt;TimeInterval, Never&gt;(0.0)
    private nonisolated(unsafe) let isPlayingSubject = CurrentValueSubject&lt;Bool, Never&gt;(false)
    private nonisolated(unsafe) var recordingVolumeLevelsSubject = CurrentValueSubject&lt;Double, Never&gt;(0.0)

    private nonisolated(unsafe) let meteringTimerInterval: TimeInterval = 0.05
    private nonisolated(unsafe) var meteringTimer = Set&lt;AnyCancellable&gt;()

    public var errorPublisher: AnyPublisher&lt;AppError, Never&gt; {
        errorSubject.eraseToAnyPublisher()
    }

    public var currentTimePublisher: AnyPublisher&lt;TimeInterval, Never&gt; {
        currentTimeSubject.eraseToAnyPublisher()
    }

    public var durationPublisher: AnyPublisher&lt;TimeInterval, Never&gt; {
        durationSubject.eraseToAnyPublisher()
    }

    public var isPlayingPublisher: AnyPublisher&lt;Bool, Never&gt; {
        isPlayingSubject.eraseToAnyPublisher()
    }

    public var recordingVolumeLevelsPublisher: AnyPublisher&lt;Double, Never&gt; {
        recordingVolumeLevelsSubject.eraseToAnyPublisher()
    }

    public nonisolated(unsafe) let isSeekingSubject = CurrentValueSubject&lt;Bool, Never&gt;(false)

    public init() {
        OSLogger.initLog()
    }

    deinit {
        OSLogger.deinitLog()
    }

    public func prepareToPlay(url: URL) {
        let item = AVPlayerItem(url: url)
        player = AVPlayer(playerItem: item)

        // 0.1 秒ごとに再生時刻を通知
        Timer.publish(every: 0.1, on: .main, in: .common).autoconnect()
            .combineLatest(isPlayingSubject, isSeekingSubject)
            .filter { \_, isPlaying, isSeeking in
                isPlaying && !isSeeking // 再生中かつseekしていないときのみ更新
            }
            .map { \[weak self\] \_, \_, \_ in
                self?.player?.currentTime().seconds ?? 0
            }
            .assign(to: \\.value, on: currentTimeSubject)
            .store(in: &cancellables)

        // 再生準備が完了したら再生時間を通知
        player?.currentItem?.publisher(for: \\.status)
            .receive(on: RunLoop.main)
            .compactMap { \[weak self\] status in
                switch status {
                case .readyToPlay:
                    return self?.player?.currentItem?.duration.seconds
                default:
                    return nil
                }
            }
            .assign(to: \\.value, on: durationSubject)
            .store(in: &cancellables)

        // 動画を最後まで見終わったら再生開始状態にリセット
        NotificationCenter.default.publisher(for: .AVPlayerItemDidPlayToEndTime, object: player?.currentItem)
            .sink { \[weak self\] \_ in
                guard let self else {
                    return
                }
                stopMeteringTimer()
                player?.seek(to: .zero)
                isPlayingSubject.send(false)
            }
            .store(in: &cancellables)

        // 再生セッション設定
        do {
            try AVAudioSession.sharedInstance().setCategory(.playback)
            try AVAudioSession.sharedInstance().setActive(true)
        } catch {
            OSLogger.errorLog("Audio playback failed: \\(error)")
            errorSubject.send(error.toAppError)
        }
    }

    public func play() {
        startMeteringTimer()

        player?.play()
        isPlayingSubject.send(true)
    }

    public func pause() {
        stopMeteringTimer()

        player?.pause()
        isPlayingSubject.send(false)
    }

    public func seek(to time: TimeInterval) {
        isSeekingSubject.send(true)
        let cmTime = CMTime(seconds: time, preferredTimescale: 600)
        player?.seek(to: cmTime) { \[weak self\] completed in
            guard let self else {
                return
            }
            if completed {
                currentTimeSubject.send(time)
                isSeekingSubject.send(false)
            } else {
                OSLogger.errorLog("seek failed")
                errorSubject.send(.customError("seek failed"))
                isSeekingSubject.send(false)
            }
        }
    }

    private func startMeteringTimer() {
        recordingVolumeLevelsSubject.value = 0.0

        Timer.publish(every: meteringTimerInterval, on: .main, in: .common).autoconnect()
            .compactMap { \[weak self\] \_ in
                guard let self, let player else {
                    return nil
                }
                // TODO: ただしく音量を取るようにする
                return AudioUtils.normalized(decibel: Double(player.volume))
            }
            .assign(to: \\.value, on: recordingVolumeLevelsSubject)
            .store(in: &meteringTimer)
    }

    private func stopMeteringTimer() {
        meteringTimer.forEach { $0.cancel() }
    }
}
#endif

---

## 🤖 アシスタント
*2024/6/21 0:47:44*

AVPlayerをAVAudioPlayerに変更するための修正を以下に示します。

```swift
// swiftformat:disable indent
#if os(iOS)
import AVFoundation
import Combine

public final class AudioPlayDriver: AudioPlayDriverProtocol {
    private nonisolated(unsafe) var player: AVAudioPlayer?
    private nonisolated(unsafe) var cancellables: Set<AnyCancellable> = []
    private nonisolated(unsafe) let errorSubject = PassthroughSubject<AppError, Never>()
    private nonisolated(unsafe) let currentTimeSubject = CurrentValueSubject<TimeInterval, Never>(0.0)
    private nonisolated(unsafe) let durationSubject = CurrentValueSubject<TimeInterval, Never>(0.0)
    private nonisolated(unsafe) let isPlayingSubject = CurrentValueSubject<Bool, Never>(false)
    private nonisolated(unsafe) var recordingVolumeLevelsSubject = CurrentValueSubject<Double, Never>(0.0)

    private nonisolated(unsafe) let meteringTimerInterval: TimeInterval = 0.05
    private nonisolated(unsafe) var meteringTimer = Set<AnyCancellable>()

    public var errorPublisher: AnyPublisher<AppError, Never> {
        errorSubject.eraseToAnyPublisher()
    }

    public var currentTimePublisher: AnyPublisher<TimeInterval, Never> {
        currentTimeSubject.eraseToAnyPublisher()
    }

    public var durationPublisher: AnyPublisher<TimeInterval, Never> {
        durationSubject.eraseToAnyPublisher()
    }

    public var isPlayingPublisher: AnyPublisher<Bool, Never> {
        isPlayingSubject.eraseToAnyPublisher()
    }

    public var recordingVolumeLevelsPublisher: AnyPublisher<Double, Never> {
        recordingVolumeLevelsSubject.eraseToAnyPublisher()
    }

    public nonisolated(unsafe) let isSeekingSubject = CurrentValueSubject<Bool, Never>(false)

    public init() {
        OSLogger.initLog()
    }

    deinit {
        OSLogger.deinitLog()
    }

    public func prepareToPlay(url: URL) {
        do {
            player = try AVAudioPlayer(contentsOf: url)
            player?.delegate = self
            player?.isMeteringEnabled = true
            
            durationSubject.send(player?.duration ?? 0.0)
            
            // 再生セッション設定
            try AVAudioSession.sharedInstance().setCategory(.playback)
            try AVAudioSession.sharedInstance().setActive(true)
        } catch {
            OSLogger.errorLog("Audio playback failed: \(error)")
            errorSubject.send(error.toAppError)
        }
    }

    public func play() {
        startMeteringTimer()

        player?.play()
        isPlayingSubject.send(true)
    }

    public func pause() {
        stopMeteringTimer()

        player?.pause()
        isPlayingSubject.send(false)
    }

    public func seek(to time: TimeInterval) {
        isSeekingSubject.send(true)
        player?.currentTime = time
        currentTimeSubject.send(time)
        isSeekingSubject.send(false)
    }

    private func startMeteringTimer() {
        recordingVolumeLevelsSubject.value = 0.0

        Timer.publish(every: meteringTimerInterval, on: .main, in: .common).autoconnect()
            .compactMap { [weak self] _ in
                guard let self, let player = self.player else {
                    return nil
                }
                player.updateMeters()
                return AudioUtils.normalized(decibel: player.averagePower(forChannel: 0))
            }
            .assign(to: \.value, on: recordingVolumeLevelsSubject)
            .store(in: &meteringTimer)
    }

    private func stopMeteringTimer() {
        meteringTimer.forEach { $0.cancel() }
    }
}

extension AudioPlayDriver: AVAudioPlayerDelegate {
    public func audioPlayerDidFinishPlaying(_ player: AVAudioPlayer, successfully flag: Bool) {
        stopMeteringTimer()
        player.currentTime = 0
        isPlayingSubject.send(false)
    }
}
#endif
```

このコードは、AVPlayerをAVAudioPlayerに変更し、プレーヤーの再生、停止、シーク、およびメータリングタイマーの処理を適切に実装しています。`AVAudioPlayerDelegate`を使用して、再生完了イベントを処理しています。

---

## 👤 ユーザー
*2024/6/21 0:54:04*

この辺の処理が抜けている

        // 0.1 秒ごとに再生時刻を通知
        Timer.publish(every: 0.1, on: .main, in: .common).autoconnect()
            .combineLatest(isPlayingSubject, isSeekingSubject)
            .filter { \_, isPlaying, isSeeking in
                isPlaying && !isSeeking // 再生中かつseekしていないときのみ更新
            }
            .map { \[weak self\] \_, \_, \_ in
                self?.player?.currentTime().seconds ?? 0
            }
            .assign(to: \\.value, on: currentTimeSubject)
            .store(in: &cancellables)

        // 再生準備が完了したら再生時間を通知
        player?.currentItem?.publisher(for: \\.status)
            .receive(on: RunLoop.main)
            .compactMap { \[weak self\] status in
                switch status {
                case .readyToPlay:
                    return self?.player?.currentItem?.duration.seconds
                default:
                    return nil
                }
            }
            .assign(to: \\.value, on: durationSubject)
            .store(in: &cancellables)

        // 動画を最後まで見終わったら再生開始状態にリセット
        NotificationCenter.default.publisher(for: .AVPlayerItemDidPlayToEndTime, object: player?.currentItem)
            .sink { \[weak self\] \_ in
                guard let self else {
                    return
                }
                stopMeteringTimer()
                player?.seek(to: .zero)
                isPlayingSubject.send(false)
            }
            .store(in: &cancellables)

---

## 🤖 アシスタント
*2024/6/21 0:54:49*

AVAudioPlayerを使用して、抜けていた再生時刻の通知や再生準備が完了した際の通知、および再生完了時のリセット処理を追加したコードは以下のようになります。

```swift
#if os(iOS)
import AVFoundation
import Combine

public final class AudioPlayDriver: AudioPlayDriverProtocol {
    private nonisolated(unsafe) var player: AVAudioPlayer?
    private nonisolated(unsafe) var cancellables: Set<AnyCancellable> = []
    private nonisolated(unsafe) let errorSubject = PassthroughSubject<AppError, Never>()
    private nonisolated(unsafe) let currentTimeSubject = CurrentValueSubject<TimeInterval, Never>(0.0)
    private nonisolated(unsafe) let durationSubject = CurrentValueSubject<TimeInterval, Never>(0.0)
    private nonisolated(unsafe) let isPlayingSubject = CurrentValueSubject<Bool, Never>(false)
    private nonisolated(unsafe) var recordingVolumeLevelsSubject = CurrentValueSubject<Double, Never>(0.0)

    private nonisolated(unsafe) let meteringTimerInterval: TimeInterval = 0.05
    private nonisolated(unsafe) var meteringTimer = Set<AnyCancellable>()
    private nonisolated(unsafe) var timeUpdateTimer = Set<AnyCancellable>()

    public var errorPublisher: AnyPublisher<AppError, Never> {
        errorSubject.eraseToAnyPublisher()
    }

    public var currentTimePublisher: AnyPublisher<TimeInterval, Never> {
        currentTimeSubject.eraseToAnyPublisher()
    }

    public var durationPublisher: AnyPublisher<TimeInterval, Never> {
        durationSubject.eraseToAnyPublisher()
    }

    public var isPlayingPublisher: AnyPublisher<Bool, Never> {
        isPlayingSubject.eraseToAnyPublisher()
    }

    public var recordingVolumeLevelsPublisher: AnyPublisher<Double, Never> {
        recordingVolumeLevelsSubject.eraseToAnyPublisher()
    }

    public nonisolated(unsafe) let isSeekingSubject = CurrentValueSubject<Bool, Never>(false)

    public init() {
        OSLogger.initLog()
    }

    deinit {
        OSLogger.deinitLog()
    }

    public func prepareToPlay(url: URL) {
        do {
            player = try AVAudioPlayer(contentsOf: url)
            player?.delegate = self
            player?.isMeteringEnabled = true
            
            durationSubject.send(player?.duration ?? 0.0)
            
            // 再生セッション設定
            try AVAudioSession.sharedInstance().setCategory(.playback)
            try AVAudioSession.sharedInstance().setActive(true)
        } catch {
            OSLogger.errorLog("Audio playback failed: \(error)")
            errorSubject.send(error.toAppError)
        }

        // 0.1 秒ごとに再生時刻を通知
        Timer.publish(every: 0.1, on: .main, in: .common).autoconnect()
            .combineLatest(isPlayingSubject, isSeekingSubject)
            .filter { _, isPlaying, isSeeking in
                isPlaying && !isSeeking // 再生中かつseekしていないときのみ更新
            }
            .map { [weak self] _, _, _ in
                self?.player?.currentTime ?? 0
            }
            .assign(to: \.value, on: currentTimeSubject)
            .store(in: &timeUpdateTimer)
    }

    public func play() {
        startMeteringTimer()
        player?.play()
        isPlayingSubject.send(true)
    }

    public func pause() {
        stopMeteringTimer()
        player?.pause()
        isPlayingSubject.send(false)
    }

    public func seek(to time: TimeInterval) {
        isSeekingSubject.send(true)
        player?.currentTime = time
        currentTimeSubject.send(time)
        isSeekingSubject.send(false)
    }

    private func startMeteringTimer() {
        recordingVolumeLevelsSubject.value = 0.0

        Timer.publish(every: meteringTimerInterval, on: .main, in: .common).autoconnect()
            .compactMap { [weak self] _ in
                guard let self, let player = self.player else {
                    return nil
                }
                player.updateMeters()
                return AudioUtils.normalized(decibel: player.averagePower(forChannel: 0))
            }
            .assign(to: \.value, on: recordingVolumeLevelsSubject)
            .store(in: &meteringTimer)
    }

    private func stopMeteringTimer() {
        meteringTimer.forEach { $0.cancel() }
        meteringTimer.removeAll()
    }
}

extension AudioPlayDriver: AVAudioPlayerDelegate {
    public func audioPlayerDidFinishPlaying(_ player: AVAudioPlayer, successfully flag: Bool) {
        stopMeteringTimer()
        player.currentTime = 0
        isPlayingSubject.send(false)
    }
}
#endif
```

このコードでは、以下のポイントをカバーしています：

1. `AVPlayer`から`AVAudioPlayer`に変更。
2. 再生時刻の通知を0.1秒ごとに発行。
3. 再生準備が完了した際の通知を`durationSubject`で送信。
4. 再生が終了した際のリセット処理を`AVAudioPlayerDelegate`で処理。

これにより、元のコードの機能をAVAudioPlayerを使って再実装しています。

---
