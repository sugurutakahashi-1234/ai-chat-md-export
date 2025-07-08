# Timer Recording Sync

日付: 2024-05-10

---

## 👤 ユーザー
*2024/05/10 10:18:05*

Timer と recordingTimeSubject をうまく連携させてほしい


final class RecordingDriver {
    private var audioRecorder: AVAudioRecorder?
    
    private let fileManageDriver: FileManageDriver = FileManageDriver()
    
    private var cancellables = Set&lt;AnyCancellable&gt;()
    
    private let isRecordingSubject = PassthroughSubject&lt;Bool, Never&gt;()
    var isRecordingPublisher: AnyPublisher&lt;Bool, Never&gt; {
        isRecordingSubject.eraseToAnyPublisher()
    }
    
    /// second (s)
    private let recordingTimeSubject = PassthroughSubject&lt;Int, Never&gt;()
    var recordingTimePublisher: AnyPublisher&lt;Int, Never&gt; {
        recordingTimeSubject.eraseToAnyPublisher()
    }
    
    // この実装はよくない
    var isEnabledAudioSessionCache: Bool = false
    
    init() {}

    func startRecording(recordingConfig: RecordingConfig) throws {
        let audioFilename = fileManageDriver.getDirectoryUrl(directoryType: .tmp)
            .appendingPathComponent("\(Date.ios8601)")
            .appendingPathExtension(recordingConfig.audioFormat.fileExtension.rawValue)

        let settings = [
            AVFormatIDKey: Int(recordingConfig.audioFormat.audioFormatID),
            AVSampleRateKey: recordingConfig.audioSampleRate.rawValue,
            AVNumberOfChannelsKey: recordingConfig.audioChannel.rawValue,
            AVEncoderAudioQualityKey: recordingConfig.audioEncodeQuality.toAVAudioQuality.rawValue
        ]

        try AVAudioSession.sharedInstance().setCategory(.playback)
        try AVAudioSession.sharedInstance().setActive(true)
        AudioServicesPlaySystemSound(1113)

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
        audioRecorder?.record()
        isRecordingSubject.send(true)
        OSLogger.debugLog("Start: start recording")
        
        startRecordingTimer()
    }

    func stopRecording() throws {
        stopRecordingTimer()
        
        OSLogger.debugLog("Start: stop recording")
        audioRecorder?.stop()
        isRecordingSubject.send(false)
        OSLogger.debugLog("Completed: stop recording")

        if isEnabledAudioSessionCache {
            OSLogger.debugLog("Start: session unactive")
            try AVAudioSession.sharedInstance().setActive(false)
            OSLogger.debugLog("Completed: session unactive")
        }

        try AVAudioSession.sharedInstance().setCategory(.playback)
        try AVAudioSession.sharedInstance().setActive(true)
        AudioServicesPlaySystemSound(1114)
    }
    
    private func startRecordingTimer() {
        recordingTime = 0

        Timer.publish(every: 1, on: .main, in: .common).autoconnect()
            .sink { [weak self] _ in
                self?.recordingTime += 1
            }
            .store(in: &cancellables)
    }

    private func stopRecordingTimer() {
        cancellables.forEach { $0.cancel() }
    }
}

---

## 🤖 アシスタント
*2024/05/10 10:18:36*

`RecordingDriver` クラスで `Timer` と `recordingTimeSubject` を連携させるためには、`recordingTimeSubject` にタイマーからの時間を送信する必要があります。現在の実装では `startRecordingTimer` メソッドに `recordingTime` 変数がありませんが、これを追加して、タイマーからのコールバックごとに `recordingTimeSubject` に時間を送信するように変更します。以下のようにコードを修正することを提案します：

1. `recordingTime` 変数を `RecordingDriver` クラスに追加します。
2. `Timer` のコールバックで `recordingTimeSubject` に `recordingTime` の値を送信します。
3. タイマーを停止するときには、`recordingTime` をリセットします。

修正後の `RecordingDriver` の関連部分は次のようになります：

```swift
final class RecordingDriver {
    private var audioRecorder: AVAudioRecorder?
    private let fileManageDriver: FileManageDriver = FileManageDriver()
    private var cancellables = Set<AnyCancellable>()
    private let isRecordingSubject = PassthroughSubject<Bool, Never>()
    private let recordingTimeSubject = PassthroughSubject<Int, Never>()
    private var isEnabledAudioSessionCache: Bool = false
    
    /// Recording time in seconds
    private var recordingTime = 0
    
    var isRecordingPublisher: AnyPublisher<Bool, Never> {
        isRecordingSubject.eraseToAnyPublisher()
    }
    
    var recordingTimePublisher: AnyPublisher<Int, Never> {
        recordingTimeSubject.eraseToAnyPublisher()
    }
    
    func startRecordingTimer() {
        recordingTime = 0

        Timer.publish(every: 1, on: .main, in: .common).autoconnect()
            .sink { [weak self] _ in
                guard let self = self else { return }
                self.recordingTime += 1
                self.recordingTimeSubject.send(self.recordingTime)
            }
            .store(in: &cancellables)
    }

    func stopRecordingTimer() {
        cancellables.forEach { $0.cancel() }
        recordingTime = 0 // Reset the timer
    }
}
```

これで、録音が開始されると毎秒 `recordingTimeSubject` が更新され、購読しているどのクライアントも現在の録音時間をリアルタイムで知ることができます。この実装により、ユーザーインターフェイスなどで録音時間を表示することが容易になります。

---

## 👤 ユーザー
*2024/05/10 10:18:47*

recordingTime って必要かな？

---

## 🤖 アシスタント
*2024/05/10 10:19:19*

`recordingTime` 変数は、録音が開始されてからの経過時間を追跡するために使用されます。この変数が必要かどうかは、アプリケーションの要件によって異なります。例えば、ユーザーに対して録音時間を表示したい場合や、特定の時間が経過した後に何か処理を行いたい場合には、`recordingTime` 変数が非常に役立ちます。

もし録音時間を追跡する必要がない、または他の方法で時間を管理している場合は、`recordingTime` 変数を削除し、その代わりに直接タイマーのコールバックで処理を行うこともできます。しかし、多くの録音アプリでは、録音の進行状況を視覚的にユーザーにフィードバックするために録音時間を表示することが一般的です。

以下のように`recordingTime`変数を使用しない場合、タイマーのコールバック内で直接`recordingTimeSubject`に送信する値を管理することもできます：

```swift
func startRecordingTimer() {
    var elapsedTime = 0 // Local variable to track elapsed time

    Timer.publish(every: 1, on: .main, in: .common).autoconnect()
        .sink { [weak self] _ in
            guard let self = self else { return }
            elapsedTime += 1
            self.recordingTimeSubject.send(elapsedTime)
        }
        .store(in: &cancellables)
}
```

この場合、`elapsedTime` は `startRecordingTimer` メソッドのローカル変数として機能し、`recordingTime` インスタンス変数を削除できます。この実装は、全体的なクラスの状態を少なくして、タイマーのロジックを単純化するのに役立ちます。

---

## 👤 ユーザー
*2024/05/10 10:19:27*

recordingTimeSubject を CurrentValueSubject にしたら解決するのでは

---

## 🤖 アシスタント
*2024/05/10 10:20:12*

はい、`recordingTimeSubject` を `PassthroughSubject` から `CurrentValueSubject` に変更することは、録音時間の管理に役立ちます。`CurrentValueSubject` は最新の値を保持し、新しいサブスクライバーにその値を即座に提供することができます。これにより、サブスクライバーが購読を開始した時点での録音時間をすぐに知ることができるため、アプリケーションの使い勝手が向上します。

`CurrentValueSubject` を使用する利点は以下の通りです：

1. **即時の値の提供**：新しいサブスクライバーが購読を開始すると、現在の録音時間を直ちに受け取ることができます。
2. **状態の保持**：`CurrentValueSubject` は最新の状態を保持しているため、外部から現在の録音時間を照会することも可能です。
3. **簡潔なロジック**：`recordingTime` の値を別途管理する必要がなく、タイマーがトリガーされるたびに新しい時間を直接 `CurrentValueSubject` に送信するだけで済みます。

以下に、`recordingTimeSubject` を `CurrentValueSubject` に変更した場合のコードの例を示します：

```swift
final class RecordingDriver {
    private var audioRecorder: AVAudioRecorder?
    private let fileManageDriver: FileManageDriver = FileManageDriver()
    private var cancellables = Set<AnyCancellable>()
    private let isRecordingSubject = PassthroughSubject<Bool, Never>()
    
    /// Use CurrentValueSubject to keep track of recording time
    private let recordingTimeSubject = CurrentValueSubject<Int, Never>(0)
    
    private var isEnabledAudioSessionCache: Bool = false
    
    var isRecordingPublisher: AnyPublisher<Bool, Never> {
        isRecordingSubject.eraseToAnyPublisher()
    }
    
    var recordingTimePublisher: AnyPublisher<Int, Never> {
        recordingTimeSubject.eraseToAnyPublisher()
    }
    
    func startRecordingTimer() {
        recordingTimeSubject.value = 0 // Reset the recording time

        Timer.publish(every: 1, on: .main, in: .common).autoconnect()
            .sink { [weak self] _ in
                guard let self = self else { return }
                self.recordingTimeSubject.value += 1 // Increment and send new time
            }
            .store(in: &cancellables)
    }

    func stopRecordingTimer() {
        cancellables.forEach { $0.cancel() }
    }
}
```

この実装では、録音の進行に合わせて `recordingTimeSubject` の値が自動的に更新され、購読者に配信されます。さらに、新しい購読者が途中から接続した場合でも、すぐに最新の録音時間を受け取ることができます。

---
