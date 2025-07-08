# Publish Bool Any Publisher.

日付: 2024-05-09

---

## 👤 ユーザー
*2024/5/9 18:12:49*

recording 中かどうかの bool の Any publisher を提供したい
どうすればいいか？

final class RecordingDriver {
    private let audioSession: AVAudioSession = AVAudioSession.sharedInstance()
    private var audioRecorder: AVAudioRecorder?
    
    private let fileManageDriver: FileManageDriver = FileManageDriver()

    init() {
        
        audioRecorder?.isRecording
    }
    
    deinit {
        try? stopRecording()
    }

    func startRecording(recordingConfig: RecordingConfig) throws {
        let audioFilename = fileManageDriver.getDirectoryURL(directoryType: .tmp)
            .appendingPathComponent("\(Date.ios8601)")
            .appendingPathExtension(recordingConfig.audioFormat.fileExtension.rawValue)

        let settings = [
            AVFormatIDKey: Int(recordingConfig.audioFormat.audioFormatID),
            AVSampleRateKey: recordingConfig.audioSampleRateQuality.rawValue,
            AVNumberOfChannelsKey: recordingConfig.audioChannel.rawValue,
            AVEncoderAudioQualityKey: recordingConfig.audioEncodeQuality.toAVAudioQuality.rawValue
        ]

        // Ref: AVAudioSessionの設定で何が変わるのか？ - https://zenn.dev/entaku/articles/e75c4aa914c6cf
        try audioSession.setCategory(
            recordingConfig.audioSessionCategory.toAVAudioSessionCategory,
            mode: recordingConfig.audioSessionMode.toAVAudioSessionMode,
            options: []
        )
        
        OSLogger.debugLog("Start: session active")
        try audioSession.setActive(true)
        OSLogger.debugLog("Completed: session active")
        
        OSLogger.debugLog("Start: start recording")
        audioRecorder = try AVAudioRecorder(url: audioFilename, settings: settings)
        audioRecorder?.record()
        OSLogger.debugLog("Start: start recording")
    }

    func stopRecording() throws {
        OSLogger.debugLog("Start: stop recording")
        audioRecorder?.stop()
        OSLogger.debugLog("Completed: stop recording")

        OSLogger.debugLog("Start: session unactive")
        try AVAudioSession.sharedInstance().setActive(false)
        OSLogger.debugLog("Completed: session unactive")
    }
}

---

## 🤖 アシスタント
*2024/5/9 18:13:28*

For your `RecordingDriver` class in Swift, if you want to provide an `AnyPublisher` that publishes a boolean indicating whether recording is ongoing, you can use Combine to achieve this. Here’s a step-by-step way to do it:

1. **Import Combine Framework**: First, make sure to import the Combine framework, as it provides the functionality to create publishers and manage subscriptions.

2. **Add a Publisher**: You will need a `PassthroughSubject` to emit values whenever the recording status changes. Declare this at the class level.

3. **Modify the Start and Stop Methods**: Update the `startRecording` and `stopRecording` methods to publish new values when recording starts and stops.

4. **Provide an AnyPublisher**: Create an `AnyPublisher` that external classes can subscribe to for updates on the recording status.

Here's how you could implement these changes in your `RecordingDriver` class:

```swift
import Foundation
import AVFoundation
import Combine

final class RecordingDriver {
    private let audioSession: AVAudioSession = AVAudioSession.sharedInstance()
    private var audioRecorder: AVAudioRecorder?

    private let fileManageDriver: FileManageDriver = FileManageDriver()

    // Create a PassthroughSubject to publish recording status changes
    private let recordingStatusSubject = PassthroughSubject<Bool, Never>()
    var isRecordingPublisher: AnyPublisher<Bool, Never> {
        recordingStatusSubject.eraseToAnyPublisher()
    }

    init() {
        // Initially not recording
        recordingStatusSubject.send(false)
    }

    deinit {
        try? stopRecording()
    }

    func startRecording(recordingConfig: RecordingConfig) throws {
        let audioFilename = fileManageDriver.getDirectoryURL(directoryType: .tmp)
            .appendingPathComponent("\(Date().iso8601)")
            .appendingPathExtension(recordingConfig.audioFormat.fileExtension.rawValue)

        let settings = [
            AVFormatIDKey: Int(recordingConfig.audioFormat.audioFormatID),
            AVSampleRateKey: recordingConfig.audioSampleRateQuality.rawValue,
            AVNumberOfChannelsKey: recordingConfig.audioChannel.rawValue,
            AVEncoderAudioQualityKey: recordingConfig.audioEncodeQuality.toAVAudioQuality.rawValue
        ]

        // Set up the audio session
        try audioSession.setCategory(
            recordingConfig.audioSessionCategory.toAVAudioSessionCategory,
            mode: recordingConfig.audioSessionMode.toAVAudioSessionMode,
            options: []
        )

        try audioSession.setActive(true)

        // Start recording
        audioRecorder = try AVAudioRecorder(url: audioFilename, settings: settings)
        audioRecorder?.record()
        recordingStatusSubject.send(true)  // Publish that recording has started
    }

    func stopRecording() throws {
        audioRecorder?.stop()
        recordingStatusSubject.send(false)  // Publish that recording has stopped
        try audioSession.setActive(false)
    }
}
```

This code now includes a `PassthroughSubject` to track and publish the recording status changes. External subscribers can monitor the `isRecordingPublisher` to get updates on whether the system is currently recording. This approach is useful for integrating with UI elements or other parts of your application that need to respond to changes in recording status dynamically.

---

## 👤 ユーザー
*2024/5/9 18:14:04*

audioRecorder?.isRecording をそのままサブスクライブできないのか？

---

## 🤖 アシスタント
*2024/5/9 18:14:44*

`AVAudioRecorder` の `isRecording` プロパティは、Combine フレームワークと直接統合されているわけではないため、そのプロパティを直接 `AnyPublisher` としてサブスクライブすることはできません。`isRecording` はただの Bool 型の値であり、イベントや状態の変更を通知するメカニズムを持っていません。

ただし、Combineを使用して `AVAudioRecorder` の状態変更を検出するための手法はいくつか考えられます。以下はその一つの方法です：

### タイマーを使用したポーリング
Combineの `Timer.publish` を使用して定期的に `isRecording` の状態をチェックし、その変更をサブスクライバーに通知することができます。この方法はリアルタイムでの反応が必要な場合には最適ではありませんが、状態の変更を追跡するのに十分な場合があります。

```swift
import Combine
import AVFoundation

final class RecordingDriver {
    private let audioSession: AVAudioSession = AVAudioSession.sharedInstance()
    private var audioRecorder: AVAudioRecorder?
    private var timerSubscription: AnyCancellable?

    private let fileManageDriver: FileManageDriver = FileManageDriver()

    // Publish the current recording status
    private let recordingStatusSubject = PassthroughSubject<Bool, Never>()
    var isRecordingPublisher: AnyPublisher<Bool, Never> {
        recordingStatusSubject.eraseToAnyPublisher()
    }

    init() {
        // Start the timer to check the recording status
        timerSubscription = Timer.publish(every: 0.5, on: .main, in: .common)
            .autoconnect()
            .sink { [weak self] _ in
                if let isRecording = self?.audioRecorder?.isRecording {
                    self?.recordingStatusSubject.send(isRecording)
                }
            }
    }

    deinit {
        try? stopRecording()
        timerSubscription?.cancel()
    }

    // The rest of your methods (startRecording, stopRecording) remain unchanged
}
```

このコードでは、`Timer.publish` を使用して0.5秒ごとに `isRecording` の値をチェックし、その値を `recordingStatusSubject` を通じて公開しています。これにより、`isRecording` の値の変更をリアルタイムに監視し、サブスクライバーに通知することができます。ただし、この方法はポーリングに依存しているため、リソースを無駄に消費する可能性がありますので、使用状況に応じて適切な更新間隔を選択してください。

---
