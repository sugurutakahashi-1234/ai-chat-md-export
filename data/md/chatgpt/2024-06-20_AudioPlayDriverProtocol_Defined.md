# AudioPlayDriverProtocol Defined

Date: 2024-06-20

---

## 👤 User
*2024-06-20 20:53:23*

protocol AudioPlayDriverProtocol を定義したい。public 値はすべてプロトコルとして表現してほしい

public final class AudioPlayDriver: Sendable {
    private nonisolated(unsafe) var player: AVPlayer?
    private nonisolated(unsafe) var cancellables: Set&lt;AnyCancellable&gt; = []
    private nonisolated(unsafe) let errorSubject = PassthroughSubject&lt;AppError, Never&gt;()
    private nonisolated(unsafe) let currentTimeSubject = CurrentValueSubject&lt;TimeInterval, Never&gt;(0.0)
    private nonisolated(unsafe) let durationSubject = CurrentValueSubject&lt;TimeInterval, Never&gt;(0.0)
    private nonisolated(unsafe) let isPlayingSubject = CurrentValueSubject&lt;Bool, Never&gt;(false)
    public nonisolated(unsafe) let isSeekingSubject = CurrentValueSubject&lt;Bool, Never&gt;(false)

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

    public init() {}

    public func prepareToPlay(url: URL) {
        let item = AVPlayerItem(url: url)
        player = AVPlayer(playerItem: item)

        // 0.1 秒ごとに再生時刻を通知
        Timer.publish(every: 0.1, on: .main, in: .common).autoconnect()
            .combineLatest(isPlayingSubject, isSeekingSubject)
            .filter { _, isPlaying, isSeeking in
                isPlaying && !isSeeking // 再生中かつseekしていないときのみ更新
            }
            .map { [weak self] _, _, _ in
                self?.player?.currentTime().seconds ?? 0
            }
            .assign(to: \.value, on: currentTimeSubject)
            .store(in: &cancellables)

        // 再生準備が完了したら再生時間を通知
        player?.currentItem?.publisher(for: \.status)
            .receive(on: RunLoop.main)
            .compactMap { [weak self] status in
                switch status {
                case .readyToPlay:
                    return self?.player?.currentItem?.duration.seconds
                default:
                    return nil
                }
            }
            .assign(to: \.value, on: durationSubject)
            .store(in: &cancellables)

        // 動画を最後まで見終わったら再生開始状態にリセット
        NotificationCenter.default.publisher(for: .AVPlayerItemDidPlayToEndTime, object: player?.currentItem)
            .sink { [weak self] _ in
                guard let self else {
                    return
                }
                player?.seek(to: .zero)
                isPlayingSubject.send(false)
            }
            .store(in: &cancellables)

        // 再生セッション設定
        do {
            try AVAudioSession.sharedInstance().setCategory(.playback)
            try AVAudioSession.sharedInstance().setActive(true)
        } catch {
            OSLogger.errorLog("Audio playback failed: \(error)")
            errorSubject.send(error.toAppError)
        }
    }

    public func play() {
        player?.play()
        isPlayingSubject.send(true)
    }

    public func pause() {
        player?.pause()
        isPlayingSubject.send(false)
    }

    public func seek(to time: TimeInterval) {
        isSeekingSubject.send(true)
        let cmTime = CMTime(seconds: time, preferredTimescale: 600)
        player?.seek(to: cmTime) { [weak self] completed in
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
}

---

## 🤖 Assistant
*2024-06-20 20:54:08*

Here's the `AudioPlayDriverProtocol` defined to include all the public properties and methods from the `AudioPlayDriver` class. The `AudioPlayDriver` class now conforms to this protocol:

```swift
import Foundation
import AVFoundation
import Combine

public protocol AudioPlayDriverProtocol: Sendable {
    var errorPublisher: AnyPublisher<AppError, Never> { get }
    var currentTimePublisher: AnyPublisher<TimeInterval, Never> { get }
    var durationPublisher: AnyPublisher<TimeInterval, Never> { get }
    var isPlayingPublisher: AnyPublisher<Bool, Never> { get }
    var isSeekingSubject: CurrentValueSubject<Bool, Never> { get }

    func prepareToPlay(url: URL)
    func play()
    func pause()
    func seek(to time: TimeInterval)
}

public final class AudioPlayDriver: AudioPlayDriverProtocol {
    private nonisolated(unsafe) var player: AVPlayer?
    private nonisolated(unsafe) var cancellables: Set<AnyCancellable> = []
    private nonisolated(unsafe) let errorSubject = PassthroughSubject<AppError, Never>()
    private nonisolated(unsafe) let currentTimeSubject = CurrentValueSubject<TimeInterval, Never>(0.0)
    private nonisolated(unsafe) let durationSubject = CurrentValueSubject<TimeInterval, Never>(0.0)
    private nonisolated(unsafe) let isPlayingSubject = CurrentValueSubject<Bool, Never>(false)
    public nonisolated(unsafe) let isSeekingSubject = CurrentValueSubject<Bool, Never>(false)

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

    public init() {}

    public func prepareToPlay(url: URL) {
        let item = AVPlayerItem(url: url)
        player = AVPlayer(playerItem: item)

        // 0.1 秒ごとに再生時刻を通知
        Timer.publish(every: 0.1, on: .main, in: .common).autoconnect()
            .combineLatest(isPlayingSubject, isSeekingSubject)
            .filter { _, isPlaying, isSeeking in
                isPlaying && !isSeeking // 再生中かつseekしていないときのみ更新
            }
            .map { [weak self] _, _, _ in
                self?.player?.currentTime().seconds ?? 0
            }
            .assign(to: \.value, on: currentTimeSubject)
            .store(in: &cancellables)

        // 再生準備が完了したら再生時間を通知
        player?.currentItem?.publisher(for: \.status)
            .receive(on: RunLoop.main)
            .compactMap { [weak self] status in
                switch status {
                case .readyToPlay:
                    return self?.player?.currentItem?.duration.seconds
                default:
                    return nil
                }
            }
            .assign(to: \.value, on: durationSubject)
            .store(in: &cancellables)

        // 動画を最後まで見終わったら再生開始状態にリセット
        NotificationCenter.default.publisher(for: .AVPlayerItemDidPlayToEndTime, object: player?.currentItem)
            .sink { [weak self] _ in
                guard let self else {
                    return
                }
                player?.seek(to: .zero)
                isPlayingSubject.send(false)
            }
            .store(in: &cancellables)

        // 再生セッション設定
        do {
            try AVAudioSession.sharedInstance().setCategory(.playback)
            try AVAudioSession.sharedInstance().setActive(true)
        } catch {
            OSLogger.errorLog("Audio playback failed: \(error)")
            errorSubject.send(error.toAppError)
        }
    }

    public func play() {
        player?.play()
        isPlayingSubject.send(true)
    }

    public func pause() {
        player?.pause()
        isPlayingSubject.send(false)
    }

    public func seek(to time: TimeInterval) {
        isSeekingSubject.send(true)
        let cmTime = CMTime(seconds: time, preferredTimescale: 600)
        player?.seek(to: cmTime) { [weak self] completed in
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
}
```

This approach defines the `AudioPlayDriverProtocol` with the necessary properties and methods, ensuring the `AudioPlayDriver` class conforms to it.

---
