# RecordingDriverProtocol Definition

Date: 2024-06-12

---

## 👤 User
*2024-06-12 15:21:49*

RecordingDriverProtocol を定義してほしい。

public final class RecordingDriver {
    private var audioRecorder: AVAudioRecorder?
    private let recordingConfigDriver: RecordingConfigDriver = RecordingConfigDriver()

    private let isRecordingSubject = PassthroughSubject&lt;Bool, Never&gt;()
    public var isRecordingPublisher: AnyPublisher&lt;Bool, Never&gt; {
        isRecordingSubject.eraseToAnyPublisher()
    }

    /// second (s)
    private let recordingTimeSubject = CurrentValueSubject&lt;Int, Never&gt;(0)
    public var recordingTimePublisher: AnyPublisher&lt;Int, Never&gt; {
        recordingTimeSubject.eraseToAnyPublisher()
    }

    /// Audio Power (0.0 - 1.0)
    private var recordingVolumeLevelSubject = CurrentValueSubject&lt;Double, Never&gt;(0)
    public var recordingVolumeLevelPublisher: AnyPublisher&lt;Double, Never&gt; {
        recordingVolumeLevelSubject.eraseToAnyPublisher()
    }

    /// この実装はよくないが検証コードなのでそうしている
    public var isEnabledAudioSessionCache: Bool = false

    private var recordingTimer = Set&lt;AnyCancellable&gt;()
    private var meteringTimer = Set&lt;AnyCancellable&gt;()

    public init() {}

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
        stopRecordingTimer()
        stopMeteringTimer()

        OSLogger.debugLog("Start: stop recording")
        audioRecorder?.stop()
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
        recordingVolumeLevelSubject.value = 0

        Timer.publish(every: 0.05, on: .main, in: .common).autoconnect()
            .sink { [weak self] _ in
                guard let self else {
                    return
                }
                audioRecorder?.updateMeters()
                recordingVolumeLevelSubject.value = scaledPower(power: Double(audioRecorder?.averagePower(forChannel: 0) ?? 0))
            }
            .store(in: &meteringTimer)
    }

    private func stopMeteringTimer() {
        meteringTimer.forEach { $0.cancel() }
    }

    private func scaledPower(power: Double) -&gt; Double {
        let minDb: Double = -80.0 // -80dB を最小値として使用
        let maxDb: Double = 0.0 // 0dB を最大値として使用

        if power &lt; minDb {
            return 0.0
        } else if power &gt;= maxDb {
            return 1.0
        } else {
            return (power - minDb) / (maxDb - minDb)
        }
    }
}

---
