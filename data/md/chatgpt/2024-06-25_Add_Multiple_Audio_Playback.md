# Add Multiple Audio Playback

日付: 2024-06-25

---

## 👤 ユーザー
*2024/6/25 19:01:31*

以下に prepareToPlayAndPlay(audioSources: AudioSource) async throws のような複数の音声ファイルを連続再生する機能を追加したい

#if os(iOS)
import AVFoundation
import Combine

/// NSObject は AVAudioPlayerDelegate の適応のために必要
public final class AudioPlayDriver: NSObject, AudioPlayDriverProtocol {
    private nonisolated(unsafe) var player: AVAudioPlayer?
    private nonisolated(unsafe) var cancellables: Set&lt;AnyCancellable&gt; = []
    private nonisolated(unsafe) let currentTimeSubject = CurrentValueSubject&lt;TimeInterval, Never&gt;(0.0)
    private nonisolated(unsafe) let durationSubject = CurrentValueSubject&lt;TimeInterval, Never&gt;(0.0)
    private nonisolated(unsafe) let isPlayingSubject = CurrentValueSubject&lt;Bool, Never&gt;(false)
    private nonisolated(unsafe) var recordingVolumeLevelSubject = CurrentValueSubject&lt;Double, Never&gt;(0.0)

    private nonisolated(unsafe) let meteringTimerInterval: TimeInterval = 0.05
    private nonisolated(unsafe) var meteringTimer = Set&lt;AnyCancellable&gt;()

    public var currentTimePublisher: AnyPublisher&lt;TimeInterval, Never&gt; {
        currentTimeSubject.eraseToAnyPublisher()
    }

    public var durationPublisher: AnyPublisher&lt;TimeInterval, Never&gt; {
        durationSubject.eraseToAnyPublisher()
    }

    public var isPlayingPublisher: AnyPublisher&lt;Bool, Never&gt; {
        isPlayingSubject.eraseToAnyPublisher()
    }

    public var recordingVolumeLevelPublisher: AnyPublisher&lt;Double, Never&gt; {
        recordingVolumeLevelSubject.eraseToAnyPublisher()
    }

    public nonisolated(unsafe) let isSeekingSubject = CurrentValueSubject&lt;Bool, Never&gt;(false)

    override public init() {
        OSLogger.initLog()
    }

    public func prepareToPlay(audioSource: AudioSource) async throws {
        do {
            switch audioSource {
            case .localAudioURL(let localURL):
                player = try AVAudioPlayer(contentsOf: localURL)
            case .remoteAudioURL(let remoteURL):
                // リモートURLの場合、AVAudioPlayer は直接サポートしていないため、データをダウンロードする必要があります
                let data: Data = try await download(url: remoteURL)
                player = try AVAudioPlayer(data: data)
            }

            player?.delegate = self
            player?.prepareToPlay()
            player?.isMeteringEnabled = true

            // 0.1 秒ごとに現在の再生時刻を通知
            Timer.publish(every: 0.1, on: .main, in: .common).autoconnect()
                .combineLatest(isPlayingSubject, isSeekingSubject)
                .filter { _, isPlaying, isSeeking in
                    isPlaying && !isSeeking // 再生中かつseekしていないときのみ更新
                }
                .map { [weak self] _, _, _ in
                    self?.player?.currentTime ?? 0
                }
                .removeDuplicates()
                .assign(to: \.value, on: currentTimeSubject)
                .store(in: &cancellables)

            // 0.1 秒ごとに現在の再生時刻を通知
            Timer.publish(every: 0.1, on: .main, in: .common).autoconnect()
                .map { [weak self] _ in
                    self?.player?.duration ?? 0.0
                }
                .removeDuplicates()
                .assign(to: \.value, on: durationSubject)
                .store(in: &cancellables)

            // 再生セッション設定
            try AVAudioSession.sharedInstance().setCategory(.playback)
            try AVAudioSession.sharedInstance().setActive(true)
        } catch {
            OSLogger.errorLog("\(error)")
            throw error
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

    // TODO: DownloadDriver みたいに一般化してもよいかも
    private func download(url: URL) async throws -&gt; Data {
        do {
            let (data, _) = try await URLSession(configuration: .default).data(from: url)
            OSLogger.debugLog("Completed: Download")
            return data
        } catch {
            OSLogger.errorLog("\(error)")
            throw error
        }
    }

    private func startMeteringTimer() {
        recordingVolumeLevelSubject.value = 0.0

        Timer.publish(every: meteringTimerInterval, on: .main, in: .common).autoconnect()
            .compactMap { [weak self] _ in
                guard let self, let player else {
                    return nil
                }
                player.updateMeters()
                return AudioUtils.normalized(decibel: Double(player.averagePower(forChannel: 0)))
            }
            .assign(to: \.value, on: recordingVolumeLevelSubject)
            .store(in: &meteringTimer)
    }

    private func stopMeteringTimer() {
        meteringTimer.forEach { $0.cancel() }
    }
}

extension AudioPlayDriver: AVAudioPlayerDelegate {
    public func audioPlayerDidFinishPlaying(_ player: AVAudioPlayer, successfully _: Bool) {
        stopMeteringTimer()
        player.currentTime = 0
        isPlayingSubject.send(false)
    }
}
#endif

---

## 🤖 アシスタント
*2024/6/25 19:01:42*

`prepareToPlayAndPlay(audioSources: [AudioSource]) async throws` のような複数の音声ファイルを連続再生する機能を追加するために、以下の変更を行います：

1. `AudioSource` の配列を受け取る新しいメソッドを追加します。
2. 現在の音声ファイルの再生が終了したときに次の音声ファイルを再生するために、 `AVAudioPlayerDelegate` の `audioPlayerDidFinishPlaying` メソッドを拡張します。

以下が変更されたコードです：

```swift
#if os(iOS)
import AVFoundation
import Combine

/// NSObject は AVAudioPlayerDelegate の適応のために必要
public final class AudioPlayDriver: NSObject, AudioPlayDriverProtocol

---
