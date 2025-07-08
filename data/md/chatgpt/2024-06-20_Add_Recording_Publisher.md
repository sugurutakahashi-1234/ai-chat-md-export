# Add Recording Publisher

Date: 2024-06-20

---

## 👤 User
*2024-06-20 21:07:19*

AudioPlayDriver にも RecordingDriver の recordingVolumeLevelsPublisher を提供するようにしたい。setMeteringTimerInterval も変更できるようにしたい。

    /// Audio Power (0.0 - 1.0)
    private nonisolated(unsafe) var recordingVolumeLevelsSubject = CurrentValueSubject&lt;Double, Never&gt;(0.0)
    public var recordingVolumeLevelsPublisher: AnyPublisher&lt;Double, Never&gt; {
        recordingVolumeLevelsSubject.eraseToAnyPublisher()
    }



/// Sendable にしているのは deinit で実行するため
public final class RecordingDriver: Sendable {
    private nonisolated(unsafe) var audioRecorder: AVAudioRecorder?
    private nonisolated(unsafe) let recordingConfigDriver: RecordingConfigDriver = RecordingConfigDriver()

    private nonisolated(unsafe) let isRecordingSubject = PassthroughSubject&lt;Bool, Never&gt;()
    public var isRecordingPublisher: AnyPublisher&lt;Bool, Never&gt; {
        isRecordingSubject.eraseToAnyPublisher()
    }

    /// second (s)
    private nonisolated(unsafe) let recordingTimeSubject = CurrentValueSubject&lt;Int, Never&gt;(0)
    public var recordingTimePublisher: AnyPublisher&lt;Int, Never&gt; {
        recordingTimeSubject.eraseToAnyPublisher()
    }

    /// Audio Power (0.0 - 1.0)
    private nonisolated(unsafe) var recordingVolumeLevelsSubject = CurrentValueSubject&lt;Double, Never&gt;(0.0)
    public var recordingVolumeLevelsPublisher: AnyPublisher&lt;Double, Never&gt; {
        recordingVolumeLevelsSubject.eraseToAnyPublisher()
    }

    // TODO: この実装はよくないが検証コードなのでそうしているだけであり、いつか削除する
    public nonisolated(unsafe) var isEnabledAudioSessionCache: Bool = false

    private nonisolated(unsafe) var recordingTimer = Set&lt;AnyCancellable&gt;()
    private nonisolated(unsafe) var meteringTimer = Set&lt;AnyCancellable&gt;()

    private nonisolated(unsafe) var meteringTimerInterval: TimeInterval = 0.05

    public init() {}

    public func setMeteringTimerInterval(_ interval: TimeInterval) {
        meteringTimerInterval = interval
        if !recordingTimer.isEmpty {
            stopMeteringTimer()
            startMeteringTimer()
        }
    }

    public func startRecording(recordingConfig: RecordingConfig) throws {
        let audioFilename = recordingConfigDriver.audioFilePath
            .appendingPathComponent("\(Date.ios8601)")
            .appendingPathExtension(recordingConfig.audioFormat.fileExtension.rawValue)

        let settings = [
            AVFormatIDKey: Int(recordingConfig.audioFormat.audioFormatID),
            AVSampleRateKey: recordingConfig.audioSampleRate.rawValue,
            AVNumberOfChannelsKey: recordingConfig.audioChannel.rawValue,
            AVEncoderAudioQualityKey: recordingConfig.audioEncodeQuality.toAVAudioQuality.rawValue,
        ]

        AudioServicesPlaySystemSound(SystemSoundID(SystemSound.startRecording.systemSoundID))

        // audio session を active にするタイミングで消えてしまうため、上記のような音をだず場合だと 0.8 秒ほど待たなければならない（なのでやりたくない）
        Thread.sleep(forTimeInterval: 0.8)

        isEnabledAudioSessionCache = recordingConfig.isEnabledAudioSession
        if recordingConfig.isEnabledAudioSession {
            try AVAudioSession.sharedInstance().setCategory(
                recordingConfig.audioSessionCategory.toAVAudioSessionCategory,
                mode: recordingConfig.audioSessionMode.toAVAudioSessionMode,
                options: []
            )
            OSLogger.debugLog("Start: session active")
            try AVAudioSession.sharedInstance().setActive(true)
            OSLogger.debugLog("Completed: session active")
        }

        OSLogger.debugLog("Start: start recording")
        audioRecorder = try AVAudioRecorder(url: audioFilename, settings: settings)
        audioRecorder?.isMeteringEnabled = true
        audioRecorder?.prepareToRecord()

        // 上記までの処理はイニシャライザで行っても良いかもしれない
        audioRecorder?.record()
        isRecordingSubject.send(true)
        OSLogger.debugLog("Start: start recording")

        startRecordingTimer()
        startMeteringTimer()
    }

    public func stopRecording() throws {
        guard let audioRecorder, audioRecorder.isRecording else {
            return
        }

        stopRecordingTimer()
        stopMeteringTimer()

        OSLogger.debugLog("Start: stop recording")
        audioRecorder.stop()
        isRecordingSubject.send(false)
        OSLogger.debugLog("Completed: stop recording")

        if isEnabledAudioSessionCache {
            OSLogger.debugLog("Start: session unactive")
            try AVAudioSession.sharedInstance().setActive(false)
            OSLogger.debugLog("Completed: session unactive")
        }

        AudioServicesPlaySystemSound(SystemSoundID(SystemSound.stopRecording.systemSoundID))
    }

    private func startRecordingTimer() {
        recordingTimeSubject.value = 0

        Timer.publish(every: 1, on: .main, in: .common).autoconnect()
            .sink { [weak self] _ in
                self?.recordingTimeSubject.value += 1
            }
            .store(in: &recordingTimer)
    }

    private func stopRecordingTimer() {
        recordingTimer.forEach { $0.cancel() }
    }

    private func startMeteringTimer() {
        recordingVolumeLevelsSubject.value = 0.0

        Timer.publish(every: meteringTimerInterval, on: .main, in: .common).autoconnect()
            .sink { [weak self] _ in
                guard let self else {
                    return
                }
                audioRecorder?.updateMeters()
                recordingVolumeLevelsSubject.value = AudioUtils.normalized(decibel: Double(audioRecorder?.averagePower(forChannel: 0) ?? -80))
            }
            .store(in: &meteringTimer)
    }

    private func stopMeteringTimer() {
        meteringTimer.forEach { $0.cancel() }
    }
}

import AVFoundation
import Combine

public final class AudioPlayDriver: AudioPlayDriverProtocol {
    private nonisolated(unsafe) var player: AVPlayer?
    private nonisolated(unsafe) var cancellables: Set&lt;AnyCancellable&gt; = []
    private nonisolated(unsafe) let errorSubject = PassthroughSubject&lt;AppError, Never&gt;()
    private nonisolated(unsafe) let currentTimeSubject = CurrentValueSubject&lt;TimeInterval, Never&gt;(0.0)
    private nonisolated(unsafe) let durationSubject = CurrentValueSubject&lt;TimeInterval, Never&gt;(0.0)
    private nonisolated(unsafe) let isPlayingSubject = CurrentValueSubject&lt;Bool, Never&gt;(false)

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
*2024-06-20 21:07:29*

以下の変更を加えることで、`AudioPlayDriver` にも `recordingVolumeLevelsPublisher` を提供し、`setMeteringTimerInterval` メソッドも変更できるようにします。

### 1. `AudioPlayDriver`に`recordingVolumeLevelsPublisher`を追加する

まず、`RecordingDriver`のインスタンスを`AudioPlayDriver`に渡し、`recordingVolumeLevelsPublisher`を提供します。

### 2. `setMeteringTimerInterval`メソッドを追加する

`RecordingDriver`の`setMeteringTimerInterval`メソッドを呼び出せるようにします。

以下のコード例を参照してください。

#### RecordingDriver.swift

```swift
import AVFoundation
import Combine

public final class RecordingDriver: Sendable {
    // 現在の定義を含むコード

    // setMeteringTimerInterval メソッドの追加
    public func setMeteringTimerInterval(_ interval: TimeInterval) {
        meteringTimerInterval = interval
        if !recordingTimer.isEmpty {
            stopMeteringTimer()
            startMeteringTimer()
        }
    }
}

---
