# Creating RecordingDriverProtocol

日付: 2024-07-29

---

## 👤 ユーザー
*2024/7/29 18:19:55*

以下、RecordingDriverProtocol を作って欲しい

public final class RecordingDriver: Sendable {
    private nonisolated(unsafe) var audioRecorder: AVAudioRecorder?

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
    private nonisolated(unsafe) var audioVolumeLevelSubject = CurrentValueSubject&lt;Double, Never&gt;(0.0)
    public var audioVolumeLevelPublisher: AnyPublisher&lt;Double, Never&gt; {
        audioVolumeLevelSubject.eraseToAnyPublisher()
    }

    // TODO: この実装はよくないが検証コードなのでそうしているだけであり、いつか削除する
    public nonisolated(unsafe) var isEnabledAudioSessionCache: Bool = false

    private nonisolated(unsafe) var recordingTimer = Set&lt;AnyCancellable&gt;()
    private nonisolated(unsafe) var meteringTimer = Set&lt;AnyCancellable&gt;()

    private nonisolated(unsafe) var meteringTimerInterval: TimeInterval = 0.05

    public init() {}

    public func setMeteringTimerInterval(\_ interval: TimeInterval) {
        meteringTimerInterval = interval
    }

    public func startRecording(recordingConfig: RecordingConfig) async throws {
        let audioFilename = Constants.FilePath.audioDirectory
            .appendingPathComponent("\\(Date.ios8601)")
            .appendingPathExtension(recordingConfig.audioFormat.fileExtension.rawValue)

        let settings = \[
            AVFormatIDKey: Int(recordingConfig.audioFormat.audioFormatID),
            AVSampleRateKey: recordingConfig.audioSampleRate.rawValue,
            AVNumberOfChannelsKey: recordingConfig.audioChannel.rawValue,
            AVEncoderAudioQualityKey: recordingConfig.audioEncodeQuality.toAVAudioQuality.rawValue,
        \]

        await SystemSoundStaticDriver.play(systemSoundType: .startRecording)

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

    public func stopRecording() async throws {
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

        await SystemSoundStaticDriver.play(systemSoundType: .stopRecording)
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
        Timer.publish(every: meteringTimerInterval, on: .main, in: .common).autoconnect()
            .compactMap { \[weak self\] \_ in
                guard let self else {
                    return nil
                }
                audioRecorder?.updateMeters()
                return AudioHelpStaticDriver.normalized(decibel: Double(audioRecorder?.averagePower(forChannel: 0) ?? -80))
            }
            .assign(to: \\.value, on: audioVolumeLevelSubject)
            .store(in: &meteringTimer)
    }

    private func stopMeteringTimer() {
        meteringTimer.forEach { $0.cancel() }
    }
}

---

## 🤖 アシスタント
*2024/7/29 18:20:49*

User is working on implementing a RecordingDriver in Swift that uses AVAudioRecorder to handle audio recording functionalities.

---

## 🔧 ツール
*2024/7/29 18:20:49*

Model set context updated.

---

## 🤖 アシスタント
*2024/7/29 18:20:49*

以下の `RecordingDriverProtocol` を作成しました。このプロトコルに基づいて `RecordingDriver` クラスが実装されるべきです。

```swift
import Foundation
import AVFoundation
import Combine

protocol RecordingDriverProtocol {
    var isRecordingPublisher: AnyPublisher<Bool, Never> { get }
    var recordingTimePublisher: AnyPublisher<Int, Never> { get }
    var audioVolumeLevelPublisher: AnyPublisher<Double, Never> { get }

    var isEnabledAudioSessionCache: Bool { get set }

    func setMeteringTimerInterval(_ interval: TimeInterval)
    func startRecording(recordingConfig: RecordingConfig) async throws
    func stopRecording() async throws
}

final class RecordingDriver: RecordingDriverProtocol, Sendable {
    private nonisolated(unsafe) var audioRecorder: AVAudioRecorder?

    private nonisolated(unsafe) let isRecordingSubject = PassthroughSubject<Bool, Never>()
    public var isRecordingPublisher: AnyPublisher<Bool, Never> {
        isRecordingSubject.eraseToAnyPublisher()
    }

    private nonisolated(unsafe) let recordingTimeSubject = CurrentValueSubject<Int, Never>(0)
    public var recordingTimePublisher: AnyPublisher<Int, Never> {
        recordingTimeSubject.eraseToAnyPublisher()
    }

    private nonisolated(unsafe) var audioVolumeLevelSubject = CurrentValueSubject<Double, Never>(0.0)
    public var audioVolumeLevelPublisher: AnyPublisher<Double, Never> {
        audioVolumeLevelSubject.eraseToAnyPublisher()
    }

    public nonisolated(unsafe) var isEnabledAudioSessionCache: Bool = false

    private nonisolated(unsafe) var recordingTimer = Set<AnyCancellable>()
    private nonisolated(unsafe) var meteringTimer = Set<AnyCancellable>()
    private nonisolated(unsafe) var meteringTimerInterval: TimeInterval = 0.05

    public init() {}

    public func setMeteringTimerInterval(_ interval: TimeInterval) {
        meteringTimerInterval = interval
    }

    public func startRecording(recordingConfig: RecordingConfig) async throws {
        let audioFilename = Constants.FilePath.audioDirectory
            .appendingPathComponent("\(Date.ios8601)")
            .appendingPathExtension(recordingConfig.audioFormat.fileExtension.rawValue)

        let settings = [
            AVFormatIDKey: Int(recordingConfig.audioFormat.audioFormatID),
            AVSampleRateKey: recordingConfig.audioSampleRate.rawValue,
            AVNumberOfChannelsKey: recordingConfig.audioChannel.rawValue,
            AVEncoderAudioQualityKey: recordingConfig.audioEncodeQuality.toAVAudioQuality.rawValue,
        ]

        await SystemSoundStaticDriver.play(systemSoundType: .startRecording)

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

        audioRecorder?.record()
        isRecordingSubject.send(true)
        OSLogger.debugLog("Start: start recording")

        startRecordingTimer()
        startMeteringTimer()
    }

    public func stopRecording() async throws {
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

        await SystemSoundStaticDriver.play(systemSoundType: .stopRecording)
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
        Timer.publish(every: meteringTimerInterval, on: .main, in: .common).autoconnect()
            .compactMap { [weak self] _ in
                guard let self else {
                    return nil
                }
                audioRecorder?.updateMeters()
                return AudioHelpStaticDriver.normalized(decibel: Double(audioRecorder?.averagePower(forChannel: 0) ?? -80))
            }
            .assign(to: \.value, on: audioVolumeLevelSubject)
            .store(in: &meteringTimer)
    }

    private func stopMeteringTimer() {
        meteringTimer.forEach { $0.cancel() }
    }
}
```

このプロトコルにより、`RecordingDriver` は `RecordingDriverProtocol` に準拠することができ、他のコンポーネントはこのプロトコルを通じて `RecordingDriver` の機能を利用できます。

---
