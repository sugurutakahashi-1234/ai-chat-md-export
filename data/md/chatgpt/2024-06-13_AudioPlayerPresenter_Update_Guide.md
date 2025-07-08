# AudioPlayerPresenter Update Guide

日付: 2024-06-13

---

## 👤 ユーザー
*2024/06/13 15:26:28*

Swift6へのmigrationをしている。

import AVFoundation
import Combine
import DomainLayer
import Foundation

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

    init(audioUrl: URL) {
        self.audioUrl = audioUrl
    }

    func onApper() {
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
            if completed {
                self?.currentTime = time
                self?.isSeeking = false
            } else {
                OSLogger.errorLog("seek failed")
                self?.appError = .customError("seek failed")
                self?.showAlert = true
            }
        }
    }
}

以下の処理について、
Capture of 'self' with non-sendable type 'AudioPlayerPresenter?' in a `@Sendable` closure; this is an error in the Swift 6 language mode
というエラーになった。

player?.seek(to: cmTime) { [weak self] completed in
            if completed {
                self?.currentTime = time
                self?.isSeeking = false
            } else {
                OSLogger.errorLog("seek failed")
                self?.appError = .customError("seek failed")
                self?.showAlert = true
            }
        }

---

## 🤖 アシスタント
*2024/06/13 15:26:38*

Swift 6 introduces stricter concurrency rules, and capturing `self` in an escaping closure now requires explicit handling when `self` is not `Sendable`. You can address this error by explicitly marking the closure as `@MainActor` if you know the code will always be executed on the main thread, or by capturing `self` in a way that ensures safety across concurrency contexts.

Here’s how you can modify your code to resolve the error:

### Solution using `@MainActor`

Since you are updating UI-related properties which should be executed on the main thread, you can mark the closure with `@MainActor` to ensure it runs on the main thread.

```swift
func seek(to time: TimeInterval) {
    let cmTime = CMTime(seconds: time, preferredTimescale: 600)
    player?.seek(to: cmTime) { [weak self] completed in
        guard let self = self else { return }
        
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
```

### Solution using `Task`

Alternatively, you can use `Task { @MainActor in ... }` directly within the closure to ensure the code runs on the main thread.

```swift
func seek(to time: TimeInterval) {
    let cmTime = CMTime(seconds: time, preferredTimescale: 600)
    player?.seek(to: cmTime) { [weak self] completed in
        Task { @MainActor in
            if let self = self {
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
```

Both approaches ensure the UI updates and property changes are executed on the main thread, adhering to Swift’s concurrency model and resolving the non-sendable type error.

---
