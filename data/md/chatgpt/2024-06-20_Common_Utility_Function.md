# Common Utility Function

日付: 2024-06-20

---

## 👤 ユーザー
*2024/6/20 17:54:41*

以下の normalized(decibel:) の関数をstaticな関数として共通化して、どこでも使いたい。この手の便利関数はどこに定義すべきか？

    /// 0.0 ... 1.0
    private func normalized(decibel: Double) -&gt; Double {
        let minDecibel: Double = -80.0 // -80dB を最小値として使用
        let maxDecibel: Double = 0.0 // 0dB を最大値として使用

        // 分母が0になるケースを避ける
        guard abs(maxDecibel) != abs(minDecibel) else {
            return 0.0
        }

        // 比率の計算
        let linearValue = (abs(decibel) - abs(minDecibel)) / (abs(maxDecibel) - abs(minDecibel))

        // 指数関数的スケーリング
        // 変形、対数、指数でのスケーリングを比較したところ、指数関数的スケールが変化がわかりやすかった
        let scaledValue = pow(linearValue, 2.0)

        // 上限と下限を設定して返却
        return max(0.0, min(1.0, scaledValue))
    }

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

    public func setMeteringTimerInterval(\_ interval: TimeInterval) {
        meteringTimerInterval = interval
        if !recordingTimer.isEmpty {
            stopMeteringTimer()
            startMeteringTimer()
        }
    }

    public func startRecording(recordingConfig: RecordingConfig) throws {
        let audioFilename = recordingConfigDriver.audioFilePath
            .appendingPathComponent("\\(Date.ios8601)")
            .appendingPathExtension(recordingConfig.audioFormat.fileExtension.rawValue)

        let settings = \[
            AVFormatIDKey: Int(recordingConfig.audioFormat.audioFormatID),
            AVSampleRateKey: recordingConfig.audioSampleRate.rawValue,
            AVNumberOfChannelsKey: recordingConfig.audioChannel.rawValue,
            AVEncoderAudioQualityKey: recordingConfig.audioEncodeQuality.toAVAudioQuality.rawValue,
        \]

        AudioServicesPlaySystemSound(SystemSoundID(SystemSound.startRecording.systemSoundID))

        // audio session を active にするタイミングで消えてしまうため、上記のような音をだず場合だと 0.8 秒ほど待たなければならない（なのでやりたくない）
        Thread.sleep(forTimeInterval: 0.8)

        isEnabledAudioSessionCache = recordingConfig.isEnabledAudioSession
        if recordingConfig.isEnabledAudioSession {
            try AVAudioSession.sharedInstance().setCategory(
                recordingConfig.audioSessionCategory.toAVAudioSessionCategory,
                mode: recordingConfig.audioSessionMode.toAVAudioSessionMode,
                options: \[\]
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
            .sink { \[weak self\] \_ in
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
            .sink { \[weak self\] \_ in
                guard let self else {
                    return
                }
                audioRecorder?.updateMeters()
                recordingVolumeLevelsSubject.value = normalized(decibel: Double(audioRecorder?.averagePower(forChannel: 0) ?? -80))
            }
            .store(in: &meteringTimer)
    }

    private func stopMeteringTimer() {
        meteringTimer.forEach { $0.cancel() }
    }

    /// 0.0 ... 1.0
    private func normalized(decibel: Double) -&gt; Double {
        let minDecibel: Double = -80.0 // -80dB を最小値として使用
        let maxDecibel: Double = 0.0 // 0dB を最大値として使用

        // 分母が0になるケースを避ける
        guard abs(maxDecibel) != abs(minDecibel) else {
            return 0.0
        }

        // 比率の計算
        let linearValue = (abs(decibel) - abs(minDecibel)) / (abs(maxDecibel) - abs(minDecibel))

        // 指数関数的スケーリング
        // 変形、対数、指数でのスケーリングを比較したところ、指数関数的スケールが変化がわかりやすかった
        let scaledValue = pow(linearValue, 2.0)

        // 上限と下限を設定して返却
        return max(0.0, min(1.0, scaledValue))
    }
}

---

## 🤖 アシスタント
*2024/6/20 17:54:51*

共通化してどこでも使えるようにするためには、ユーティリティ関数を専用のユーティリティクラスに定義するのが良いでしょう。以下のように、`AudioUtils` というクラスを作成し、その中に `normalized(decibel:)` を `static` 関数として定義します。

### AudioUtils.swift

```swift
public final class AudioUtils {

    /// 0.0 ... 1.0
    public static func normalized(decibel: Double) -> Double {
        let minDecibel: Double = -80.0 // -80dB を最小値として使用
        let maxDecibel: Double = 0.0 // 0dB を最大値として使用

        // 分

---
