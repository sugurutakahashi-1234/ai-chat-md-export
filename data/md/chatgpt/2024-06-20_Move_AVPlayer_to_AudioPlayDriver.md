# Move AVPlayer to AudioPlayDriver

日付: 2024-06-20

---

## 👤 ユーザー
*2024/6/20 19:43:56*

オーディオ再生に関する処理をAudioPlayDriverに移行したい。
必要に応じて、AnyPublisher で変更を飛ばすようにしてほしい。なるべく、PresenterにはAVPlayerの処理を記述したくないんだ。

private let errorSubject = PassthroughSubject&lt;Error, Never&gt;()
    public var errorPublisher: AnyPublisher&lt;Error, Never&gt; {
        errorSubject.eraseToAnyPublisher()
    }


final class AudioPlayDriver {
    init () {}
    
    func readyToPlay() {}
    
    func play()
    
    func pause()
    
    func seek(to time: TimeInterval) {}
}


@MainActor
final class AudioPlayerPresenter: ObservableObject {
    @Published var currentTime: TimeInterval = 0
    @Published var duration: TimeInterval = 0
    @Published var isSeeking: Bool = false
    @Published var isLoading: Bool = false
    @Published var isPlaying: Bool = false
    @Published var appError: AppError?
    @Published var showAlert: Bool = false
    @Published var shouldDismiss: Bool = false

    let audioUrl: URL
    private var player: AVPlayer?
    private var cancellables: Set&lt;AnyCancellable&gt; = []
    private let fileManageDriver: FileManageDriver = FileManageDriver()
    private let audioPlayDriver: AudioPlayDriver = AudioPlayDriver()

    init(audioUrl: URL) {
        self.audioUrl = audioUrl
    }

    func onAppear() {
        isLoading = true

        let item = AVPlayerItem(url: audioUrl)
        player = AVPlayer(playerItem: item)

        // 0.1 秒ごとに再生時刻と seek bar を同期させる
        Timer.publish(every: 0.1, on: .main, in: .common).autoconnect()
            .combineLatest($isPlaying, $isSeeking)
            .filter { _, isPlaying, isSeeking in
                isPlaying && !isSeeking // 再生中かつseekしていないときのみ更新
            }
            .map { [weak self] _, _, _ in
                self?.player?.currentTime().seconds ?? 0
            }
            .assign(to: &$currentTime)

        // 動画を最後まで見終わったら再生開始状態にリセットする
        NotificationCenter.default.publisher(for: .AVPlayerItemDidPlayToEndTime, object: player?.currentItem)
            .receive(on: RunLoop.main)
            .sink { [weak self] _ in
                guard let self else {
                    return
                }
                isPlaying = false
                currentTime = duration
                player?.seek(to: .zero)
            }
            .store(in: &cancellables)

        // 再生準備が完了したら再生時間をセットする
        player?.currentItem?.publisher(for: \.status)
            .receive(on: RunLoop.main)
            .sink { [weak self] status in
                switch status {
                case .readyToPlay:
                    self?.isLoading = false
                    self?.duration = self?.player?.currentItem?.duration.seconds ?? 0
                case .unknown, .failed:
                    break
                @unknown default:
                    break
                }
            }
            .store(in: &cancellables)

        // 音声を再生モードにする
        do {
            try AVAudioSession.sharedInstance().setCategory(.playback)
            try AVAudioSession.sharedInstance().setActive(true)
        } catch {
            OSLogger.errorLog("Audio playback failed: \(error)")
            appError = error.toAppError
            showAlert = true
        }
    }

    func onTapPlay() {
        player?.play()
        isPlaying = true
    }

    func onTapPause() {
        player?.pause()
        isPlaying = false
    }

    func onTapGoBackward() {
        let newTime = max(currentTime - 15, 0)
        seek(to: newTime)
    }

    func onTapGoForward() {
        let newTime = min(currentTime + 15, duration)
        seek(to: newTime)
    }

    func onTapTrash() {
        appError = .delete
        showAlert = true
    }

    func onTapOkDelete() {
        do {
            try fileManageDriver.removeItemIfExists(at: audioUrl)
            shouldDismiss = true
        } catch {
            OSLogger.errorLog("\(error)")
            appError = error.toAppError
            showAlert = true
        }
    }

    func seek(to time: TimeInterval) {
        let cmTime = CMTime(seconds: time, preferredTimescale: 600)
        player?.seek(to: cmTime) { [weak self] completed in
            guard let self else {
                return
            }
            Task { @MainActor in
                if completed {
                    self.currentTime = time
                    self.isSeeking = false
                } else {
                    OSLogger.errorLog("seek failed")
                    self.appError = .customError("seek failed")
                    self.showAlert = true
                }
            }
        }
    }
}

---

## 🤖 アシスタント
*2024/6/20 19:44:48*

以下のように、`AudioPlayDriver` クラスに AVPlayer の処理を移行し、`AudioPlayerPresenter` から呼び出す形に修正します。また、`AudioPlayDriver` からの変更通知を AnyPublisher を使用して実装します。

### AudioPlayDriver

まず、`AudioPlayDriver` クラスを拡張して、AVPlayer の処理を移行します。また、変更を通知するための AnyPublisher を設定します。

```swift
import AVFoundation
import Combine

final class AudioPlayDriver {
    private var player: AVPlayer?
    private var cancellables: Set<AnyCancellable> = []
    private let errorSubject = PassthroughSubject<Error, Never>()
    private let currentTimeSubject = PassthroughSubject<TimeInterval, Never>()
    private let durationSubject = PassthroughSubject<TimeInterval, Never>()
    private let isPlayingSubject = PassthroughSubject<Bool, Never>()

    public var errorPublisher: AnyPublisher<Error, Never> {
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

    init() {}

    func prepareToPlay(url: URL) {
        let item = AVPlayerItem(url: url)
        player = AVPlayer(playerItem: item)

        // 0.1 秒ごとに再生時刻を通知
        Timer.publish(every: 0.1, on: .main, in: .common).autoconnect()
            .sink { [weak self] _ in
                guard let self = self else { return }
                self.currentTimeSubject.send(self.player?.currentTime().seconds ?? 0)
            }
            .store(in: &cancellables)

        // 再生準備が完了したら再生時間を通知
        player?.currentItem?.publisher(for: \.status)
            .sink { [weak self] status in
                guard let self = self else { return }
                if status == .readyToPlay {
                    self.durationSubject.send(self.player?.currentItem?.duration.seconds ?? 0)
                }
            }
            .store(in: &cancellables)

        // 動画を最後まで見終わったら再生開始状態にリセット
        NotificationCenter.default.publisher(for: .AVPlayerItemDidPlayToEndTime, object: player?.currentItem)
            .sink { [weak self] _ in
                guard let self = self else { return }
                self.player?.seek(to: .zero)
                self.isPlayingSubject.send(false)
            }
            .store(in: &cancellables)

        // 再生セッション設定
        do {
            try AVAudioSession.sharedInstance().setCategory(.playback)
            try AVAudioSession.sharedInstance().setActive(true)
        } catch {
            errorSubject.send(error)
        }
    }

    func play() {
        player?.play()
        isPlayingSubject.send(true)
    }

    func pause() {
        player?.pause()
        isPlayingSubject.send(false)
    }

    func seek(to time: TimeInterval) {
        let cmTime = CMTime(seconds: time, preferredTimescale: 600)
        player?.seek(to: cmTime) { [weak self] completed in
            guard let self = self else { return }
            if completed {
                self.currentTimeSubject.send(time)
            } else {
                self.errorSubject.send(NSError(domain: "AudioPlayDriver", code: -1, userInfo: [NSLocalizedDescriptionKey: "Seek failed"]))
            }
        }
    }
}
```

### AudioPlayerPresenter

次に、`AudioPlayerPresenter` クラスを更新し、`AudioPlayDriver` を使用してオーディオ再生を制御します。

```swift
@MainActor
final class AudioPlayerPresenter: ObservableObject {
    @Published var currentTime: TimeInterval = 0
    @Published var duration: TimeInterval = 0
    @Published var isSeeking: Bool = false
    @Published var isLoading: Bool = false
    @Published var isPlaying: Bool = false
    @Published var appError: AppError?
    @Published var showAlert: Bool = false
    @Published var shouldDismiss: Bool = false

    let audioUrl: URL
    private var cancellables: Set<AnyCancellable> = []
    private let fileManageDriver: FileManageDriver = FileManageDriver()
    private let audioPlayDriver: AudioPlayDriver = AudioPlayDriver()

    init(audioUrl: URL) {
        self.audioUrl = audioUrl
    }

    func onAppear() {
        isLoading = true
        audioPlayDriver.prepareToPlay(url: audioUrl)

        audioPlayDriver.currentTimePublisher
            .sink { [weak self] time in
                self?.currentTime = time
            }
            .store(in: &cancellables)

        audioPlayDriver.durationPublisher
            .sink { [weak self] duration in
                self?.duration = duration
                self?.isLoading = false
            }
            .store(in: &cancellables)

        audioPlayDriver.isPlayingPublisher
            .sink { [weak self] isPlaying in
                self?.isPlaying = isPlaying
            }
            .store(in: &cancellables)

        audioPlayDriver.errorPublisher
            .sink { [weak self] error in
                self?.appError = error.toAppError
                self?.showAlert = true
            }
            .store(in: &cancellables)
    }

    func onTapPlay() {
        audioPlayDriver.play()
    }

    func onTapPause() {
        audioPlayDriver.pause()
    }

    func onTapGoBackward() {
        let newTime = max(currentTime - 15, 0)
        seek(to: newTime)
    }

    func onTapGoForward() {
        let newTime = min(currentTime + 15, duration)
        seek(to: newTime)
    }

    func onTapTrash() {
        appError = .delete
        showAlert = true
    }

    func onTapOkDelete() {
        do {
            try fileManageDriver.removeItemIfExists(at: audioUrl)
            shouldDismiss = true
        } catch {
            OSLogger.errorLog("\(error)")
            appError = error.toAppError
            showAlert = true
        }
    }

    func seek(to time: TimeInterval) {
        isSeeking = true
        audioPlayDriver.seek(to: time)
        isSeeking = false
    }
}
```

この修正により、AVPlayerの処理は `AudioPlayDriver` に移行され、`AudioPlayerPresenter` は `AudioPlayDriver` から提供される AnyPublisher を使用してオーディオ再生の状態を管理するようになります。

---

## 👤 ユーザー
*2024/6/20 20:02:36*

Timer.publish(every: 0.1, on: .main, in: .common).autoconnect() は isPlaying && !isSeeking // 再生中かつseekしていないときのみ更新 するようにできないかな？

---

## 🤖 アシスタント
*2024/6/20 20:03:32*

`Timer.publish(every: 0.1, on: .main, in: .common).autoconnect()` を使って、再生中かつシークしていないときのみ `currentTime` を更新するようにするには、Combine フレームワークの `combineLatest` と `filter` を利用して実装できます。以下のように修正します：

### AudioPlayDriver

`isPlaying` と `isSeeking` を監視するようにし、条件を満たすときに `currentTime` を更新します。

```swift
import AVFoundation
import Combine

final class AudioPlayDriver {
    private var player: AVPlayer?
    private var cancellables: Set<AnyCancellable> = []
    private let errorSubject = PassthroughSubject<Error, Never>()
    private let currentTimeSubject = PassthroughSubject<TimeInterval, Never>()
    private let durationSubject = PassthroughSubject<TimeInterval, Never>()
    private let isPlayingSubject = PassthroughSubject<Bool, Never>()
    private let isSeekingSubject = PassthroughSubject<Bool, Never>()

    public var errorPublisher: AnyPublisher<Error, Never> {
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
    public var isSeekingPublisher: AnyPublisher<Bool, Never> {
        isSeekingSubject.eraseToAnyPublisher()
    }

    init() {}

    func prepareToPlay(url: URL) {
        let item = AVPlayerItem(url: url)
        player = AVPlayer(playerItem: item)

        // 0.1 秒ごとに再生時刻を通知
        Timer.publish(every: 0.1, on: .main, in: .common).autoconnect()
            .combineLatest(isPlayingPublisher, isSeekingPublisher)
            .filter { _, isPlaying, isSeeking in
                isPlaying && !isSeeking
            }
            .sink { [weak self] _ in
                guard let self = self else { return }
                self.currentTimeSubject.send(self.player?.currentTime().seconds ?? 0)
            }
            .store(in: &cancellables)

        // 再生準備が完了したら再生時間を通知
        player?.currentItem?.publisher(for: \.status)
            .sink { [weak self] status in
                guard let self = self else { return }
                if status == .readyToPlay {
                    self.durationSubject.send(self.player?.currentItem?.duration.seconds ?? 0)
                }
            }
            .store(in: &cancellables)

        // 動画を最後まで見終わったら再生開始状態にリセット
        NotificationCenter.default.publisher(for: .AVPlayerItemDidPlayToEndTime, object: player?.currentItem)
            .sink { [weak self] _ in
                guard let self = self else { return }
                self.player?.seek(to: .zero)
                self.isPlayingSubject.send(false)
            }
            .store(in: &cancellables)

        // 再生セッション設定
        do {
            try AVAudioSession.sharedInstance().setCategory(.playback)
            try AVAudioSession.sharedInstance().setActive(true)
        } catch {
            errorSubject.send(error)
        }
    }

    func play() {
        player?.play()
        isPlayingSubject.send(true)
    }

    func pause() {
        player?.pause()
        isPlayingSubject.send(false)
    }

    func seek(to time: TimeInterval) {
        isSeekingSubject.send(true)
        let cmTime = CMTime(seconds: time, preferredTimescale: 600)
        player?.seek(to: cmTime) { [weak self] completed in
            guard let self = self else { return }
            if completed {
                self.currentTimeSubject.send(time)
                self.isSeekingSubject.send(false)
            } else {
                self.errorSubject.send(NSError(domain: "AudioPlayDriver", code: -1, userInfo: [NSLocalizedDescriptionKey: "Seek failed"]))
                self.isSeekingSubject.send(false)
            }
        }
    }
}
```

### AudioPlayerPresenter

`AudioPlayerPresenter` クラスでは `isPlayingPublisher` と `isSeekingPublisher` を購読して、再生中かつシークしていないときのみ `currentTime` を更新するようにします。

```swift
@MainActor
final class AudioPlayerPresenter: ObservableObject {
    @Published var currentTime: TimeInterval = 0
    @Published var duration: TimeInterval = 0
    @Published var isSeeking: Bool = false
    @Published var isLoading: Bool = false
    @Published var isPlaying: Bool = false
    @Published var appError: AppError?
    @Published var showAlert: Bool = false
    @Published var shouldDismiss: Bool = false

    let audioUrl: URL
    private var cancellables: Set<AnyCancellable> = []
    private let fileManageDriver: FileManageDriver = FileManageDriver()
    private let audioPlayDriver: AudioPlayDriver = AudioPlayDriver()

    init(audioUrl: URL) {
        self.audioUrl = audioUrl
    }

    func onAppear() {
        isLoading = true
        audioPlayDriver.prepareToPlay(url: audioUrl)

        audioPlayDriver.currentTimePublisher
            .sink { [weak self] time in
                self?.currentTime = time
            }
            .store(in: &cancellables)

        audioPlayDriver.durationPublisher
            .sink { [weak self] duration in
                self?.duration = duration
                self?.isLoading = false
            }
            .store(in: &cancellables)

        audioPlayDriver.isPlayingPublisher
            .sink { [weak self] isPlaying in
                self?.isPlaying = isPlaying
            }
            .store(in: &cancellables)

        audioPlayDriver.isSeekingPublisher
            .sink { [weak self] isSeeking in
                self?.isSeeking = isSeeking
            }
            .store(in: &cancellables)

        audioPlayDriver.errorPublisher
            .sink { [weak self] error in
                self?.appError = error.toAppError
                self?.showAlert = true
            }
            .store(in: &cancellables)
    }

    func onTapPlay() {
        audioPlayDriver.play()
    }

    func onTapPause() {
        audioPlayDriver.pause()
    }

    func onTapGoBackward() {
        let newTime = max(currentTime - 15, 0)
        seek(to: newTime)
    }

    func onTapGoForward() {
        let newTime = min(currentTime + 15, duration)
        seek(to: newTime)
    }

    func onTapTrash() {
        appError = .delete
        showAlert = true
    }

    func onTapOkDelete() {
        do {
            try fileManageDriver.removeItemIfExists(at: audioUrl)
            shouldDismiss = true
        } catch {
            OSLogger.errorLog("\(error)")
            appError = error.toAppError
            showAlert = true
        }
    }

    func seek(to time: TimeInterval) {
        audioPlayDriver.seek(to: time)
    }
}
```

この実装により、`isPlaying` と `isSeeking` の状態に基づいて、`currentTime` が適切に更新されるようになります。

---
