# AudioPlayDriver Download Handling

Date: 2024-06-21

---

## 👤 User
*2024-06-21 12:35:30*

これだとプログレッシングダウンロードを行なっているが、普通にダウンロードを待った場合の処理はどう書けるのか？

// swiftformat:disable indent
#if os(iOS)
import AVFoundation
import Combine

/// NSObject は AVAudioPlayerDelegate の適応のために必要
public final class AudioPlayDriver: NSObject, AudioPlayDriverProtocol {
    private nonisolated(unsafe) var player: AVAudioPlayer?
    private nonisolated(unsafe) var audioFilePath: URL? // deinit で消すため変数で保持
    private nonisolated(unsafe) var cancellables: Set&lt;AnyCancellable&gt; = []
    private nonisolated(unsafe) let errorSubject = PassthroughSubject&lt;AppError, Never&gt;()
    private nonisolated(unsafe) let currentTimeSubject = CurrentValueSubject&lt;TimeInterval, Never&gt;(0.0)
    private nonisolated(unsafe) let durationSubject = CurrentValueSubject&lt;TimeInterval, Never&gt;(0.0)
    private nonisolated(unsafe) let isPlayingSubject = CurrentValueSubject&lt;Bool, Never&gt;(false)
    private nonisolated(unsafe) var recordingVolumeLevelsSubject = CurrentValueSubject&lt;Double, Never&gt;(0.0)

    private nonisolated(unsafe) let meteringTimerInterval: TimeInterval = 0.05
    private nonisolated(unsafe) var meteringTimer = Set&lt;AnyCancellable&gt;()

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

    public var recordingVolumeLevelsPublisher: AnyPublisher&lt;Double, Never&gt; {
        recordingVolumeLevelsSubject.eraseToAnyPublisher()
    }

    public nonisolated(unsafe) let isSeekingSubject = CurrentValueSubject&lt;Bool, Never&gt;(false)

    override public init() {
        OSLogger.initLog()
    }

    deinit {
        if let audioFilePath {
            try? FileManager.default.removeItem(at: audioFilePath)
        }
        OSLogger.deinitLog()
    }

    public func downloadAndPrepareToPlay(url: URL) async {
        do {
            let minimumPlayableSize: Int = 1024 * 50 // 50 KB （50KB 未満だと再生できないことがある）
            audioFilePath = AudioUtils.audioFilePath.appendingPathComponent(UUID().uuidString + ".mp3")
            guard let audioFilePath else {
                fatalError()
            }
            FileManager.default.createFile(atPath: audioFilePath.path, contents: nil, attributes: nil)
            let audioFileHandle = try FileHandle(forWritingTo: audioFilePath)

            let (bytes, _) = try await URLSession(configuration: .default).bytes(for: URLRequest(url: url))

            var totalBytesWritten: Int = 0
            var isFirstChunk = true

            OSLogger.debugLog("Start: Download")
            for try await chunk in bytes {
                // Convert chunk to Data before writing
                let data = Data([chunk])
                try audioFileHandle.write(contentsOf: data)
                totalBytesWritten += data.count

                if isFirstChunk, totalBytesWritten &gt;= minimumPlayableSize {
                    isFirstChunk = false
                    Task { @MainActor in
                        OSLogger.debugLog("Start: AVAudioPlayer")
                        await prepareToPlay(localFilePath: audioFilePath)
                    }
                }
            }
            audioFileHandle.closeFile()
            OSLogger.debugLog("Completed: Download")
        } catch {
            OSLogger.errorLog("Audio playback failed: \(error)")
            errorSubject.send(error.toAppError)
        }
    }

    public func prepareToPlay(localFilePath: URL) async {
        do {
            player = try AVAudioPlayer(contentsOf: localFilePath)
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
            OSLogger.errorLog("Audio playback failed: \(error)")
            errorSubject.send(error.toAppError)
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

    private func startMeteringTimer() {
        recordingVolumeLevelsSubject.value = 0.0

        Timer.publish(every: meteringTimerInterval, on: .main, in: .common).autoconnect()
            .compactMap { [weak self] _ in
                guard let self, let player else {
                    return nil
                }
                player.updateMeters()
                return AudioUtils.normalized(decibel: Double(player.averagePower(forChannel: 0)))
            }
            .assign(to: \.value, on: recordingVolumeLevelsSubject)
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

## 🤖 Assistant
*2024-06-21 12:36:06*

普通にダウンロードを待った場合の処理は、すべてのデータがダウンロードされるまで再生を開始しないようにすることです。以下に、普通のダウンロードが完了するまで待つ方法を示します。この場合、ダウンロードが完了するまで再生を開始しません。

```swift
#if os(iOS)
import AVFoundation
import Combine

/// NSObject は AVAudioPlayerDelegate の適応のために必要
public final class AudioPlayDriver: NSObject, AudioPlayDriverProtocol {
    private nonisolated(unsafe) var player: AVAudioPlayer?
    private nonisolated(unsafe) var audioFilePath: URL? // deinit で消すため変数で保持
    private nonisolated(unsafe) var cancellables: Set<AnyCancellable> = []
    private nonisolated(unsafe) let errorSubject = PassthroughSubject<AppError, Never>()
    private nonisolated(unsafe) let currentTimeSubject = CurrentValueSubject<TimeInterval, Never>(0.0)
    private nonisolated(unsafe) let durationSubject = CurrentValueSubject<TimeInterval, Never>(0.0)
    private nonisolated(unsafe) let isPlayingSubject = CurrentValueSubject<Bool, Never>(false)
    private nonisolated(unsafe) var recordingVolumeLevelsSubject = CurrentValueSubject<Double, Never>(0.0)

    private nonisolated(unsafe) let meteringTimerInterval: TimeInterval = 0.05
    private nonisolated(unsafe) var meteringTimer = Set<AnyCancellable>()

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

    public var recordingVolumeLevelsPublisher: AnyPublisher<Double, Never> {
        recordingVolumeLevelsSubject.eraseToAnyPublisher()
    }

    public nonisolated(unsafe) let isSeekingSubject = CurrentValueSubject<Bool, Never>(false)

    override public init() {
        OSLogger.initLog()
    }

    deinit {
        if let audioFilePath {
            try? FileManager.default.removeItem(at: audioFilePath)
        }
        OSLogger.deinitLog()
    }

    public func downloadAndPrepareToPlay(url: URL) async {
        do {
            audioFilePath = AudioUtils.audioFilePath.appendingPathComponent(UUID().uuidString + ".mp3")
            guard let audioFilePath else {
                fatalError()
            }
            FileManager.default.createFile(atPath: audioFilePath.path, contents: nil, attributes: nil)
            let audioFileHandle = try FileHandle(forWritingTo: audioFilePath)

            let (data, _) = try await URLSession(configuration: .default).data(from: url)
            try audioFileHandle.write(contentsOf: data)
            audioFileHandle.closeFile()
            
            OSLogger.debugLog("Completed: Download")
            await prepareToPlay(localFilePath: audioFilePath)
        } catch {
            OSLogger.errorLog("Audio playback failed: \(error)")
            errorSubject.send(error.toAppError)
        }
    }

    public func prepareToPlay(localFilePath: URL) async {
        do {
            player = try AVAudioPlayer(contentsOf: localFilePath)
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
            OSLogger.errorLog("Audio playback failed: \(error)")
            errorSubject.send(error.toAppError)
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

    private func startMeteringTimer() {
        recordingVolumeLevelsSubject.value = 0.0

        Timer.publish(every: meteringTimerInterval, on: .main, in: .common).autoconnect()
            .compactMap { [weak self] _ in
                guard let self, let player else {
                    return nil
                }
                player.updateMeters()
                return AudioUtils.normalized(decibel: Double(player.averagePower(forChannel: 0)))
            }
            .assign(to: \.value, on: recordingVolumeLevelsSubject)
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
```

このコードでは、`URLSession`の`data(from:)`メソッドを使用して、すべてのデータがダウンロードされるまで待ちます。ダウンロードが完了したら、`prepareToPlay`メソッドを呼び出して再生の準備を行います。これにより、プログレッシングダウンロードを行わずに、すべてのデータを取得した後に再生を開始します。

---

## 👤 User
*2024-06-21 12:36:10*

FileHandle とか入りますか？

---

## 🤖 Assistant
*2024-06-21 12:36:44*

`FileHandle`を使わずに、ダウンロード完了後にデータをメモリに保持し、`AVAudioPlayer`で再生する方法もあります。この方法では、データを一時ファイルに書き込まずにメモリ内で処理します。以下はその実装例です：

```swift
#if os(iOS)
import AVFoundation
import Combine

/// NSObject は AVAudioPlayerDelegate の適応のために必要
public final class AudioPlayDriver: NSObject, AudioPlayDriverProtocol {
    private nonisolated(unsafe) var player: AVAudioPlayer?
    private nonisolated(unsafe) var audioData: Data? // deinit で消すため変数で保持
    private nonisolated(unsafe) var cancellables: Set<AnyCancellable> = []
    private nonisolated(unsafe) let errorSubject = PassthroughSubject<AppError, Never>()
    private nonisolated(unsafe) let currentTimeSubject = CurrentValueSubject<TimeInterval, Never>(0.0)
    private nonisolated(unsafe) let durationSubject = CurrentValueSubject<TimeInterval, Never>(0.0)
    private nonisolated(unsafe) let isPlayingSubject = CurrentValueSubject<Bool, Never>(false)
    private nonisolated(unsafe) var recordingVolumeLevelsSubject = CurrentValueSubject<Double, Never>(0.0)

    private nonisolated(unsafe) let meteringTimerInterval: TimeInterval = 0.05
    private nonisolated(unsafe) var meteringTimer = Set<AnyCancellable>()

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

    public var recordingVolumeLevelsPublisher: AnyPublisher<Double, Never> {
        recordingVolumeLevelsSubject.eraseToAnyPublisher()
    }

    public nonisolated(unsafe) let isSeekingSubject = CurrentValueSubject<Bool, Never>(false)

    override public init() {
        OSLogger.initLog()
    }

    deinit {
        OSLogger.deinitLog()
    }

    public func downloadAndPrepareToPlay(url: URL) async {
        do {
            let (data, _) = try await URLSession(configuration: .default).data(from: url)
            self.audioData = data
            
            OSLogger.debugLog("Completed: Download")
            await prepareToPlay(audioData: data)
        } catch {
            OSLogger.errorLog("Audio playback failed: \(error)")
            errorSubject.send(error.toAppError)
        }
    }

    public func prepareToPlay(audioData: Data) async {
        do {
            player = try AVAudioPlayer(data: audioData)
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
            OSLogger.errorLog("Audio playback failed: \(error)")
            errorSubject.send(error.toAppError)
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

    private func startMeteringTimer() {
        recordingVolumeLevelsSubject.value = 0.0

        Timer.publish(every: meteringTimerInterval, on: .main, in: .common).autoconnect()
            .compactMap { [weak self] _ in
                guard let self, let player else {
                    return nil
                }
                player.updateMeters()
                return AudioUtils.normalized(decibel: Double(player.averagePower(forChannel: 0)))
            }
            .assign(to: \.value, on: recordingVolumeLevelsSubject)
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
```

このアプローチでは、`FileHandle`や一時ファイルを使用せずに、ダウンロードしたデータをメモリに保持し、そのデータを使って再生を行います。これにより、ファイルシステムへの依存を減らし、シンプルな実装を実現します。

---

## 👤 User
*2024-06-21 12:36:57*

どちらの処理が早いなどありますか？

---

## 🤖 Assistant
*2024-06-21 12:37:21*

一般的には、メモリにデータを保持する方法（`Data`を直接使用する方法）は、以下の理由から通常はファイルシステムを使用する方法よりも高速です。

1. **I/O オーバーヘッドの回避**: ファイルシステムを介する場合、ディスクへの書き込みおよび読み込みのI/Oオーバーヘッドが発生します。特に、ファイルのサイズが大きい場合やI/O性能が低い環境では、このオーバーヘッドが顕著になることがあります。

2. **シンプルなデータ処理**: メモリ上でのデータ操作は、ディスクを介した操作よりも通常は高速です。メモリ内でのデータ操作はCPUによる処理のみで済むため、ディスクI/Oによる遅延が発生しません。

ただし、メモリ使用量が大きくなると、以下の点に注意が必要です。

1. **メモリ消費**: 大きなファイルをメモリに保持すると、多くのメモリを消費します。これがメモリ不足を引き起こし、アプリケーションのパフォーマンスや安定性に悪影響を及ぼす可能性があります。

2. **メモリ制限**: デバイスによっては、利用可能なメモリが制限されている場合があります。特に、メモリの少ない古いデバイスやリソースが限られている環境では、メモリ消費に注意が必要です。

これらの観点から、一般的にはメモリを直接使用する方法が高速ですが、特定のシナリオによってはファイルシステムを使用する方が適している場合もあります。例えば、非常に大きなファイルを扱う場合や、デバイスのメモリが限られている場合です。

### パフォーマンステストの提案

どちらの方法が特定のアプリケーションにおいて最適かを確認するためには、実際にパフォーマンステストを行うことをお勧めします。以下は、パフォーマンステストの例です。

```swift
import XCTest

class AudioDownloadTests: XCTestCase {
    
    func testDownloadToFile() {
        measure {
            let expectation = self.expectation(description: "Download to File")
            let url = URL(string: "https://example.com/audio.mp3")!
            let filePath = FileManager.default.temporaryDirectory.appendingPathComponent(UUID().uuidString + ".mp3")
            
            let task = URLSession.shared.downloadTask(with: url) { location, response, error in
                guard let location = location else {
                    XCTFail("Failed to download file: \(error?.localizedDescription ?? "Unknown error")")
                    return
                }
                
                do {
                    try FileManager.default.moveItem(at: location, to: filePath)
                    expectation.fulfill()
                } catch {
                    XCTFail("Failed to move file: \(error.localizedDescription)")
                }
            }
            task.resume()
            waitForExpectations(timeout: 60)
        }
    }
    
    func testDownloadToMemory() {
        measure {
            let expectation = self.expectation(description: "Download to Memory")
            let url = URL(string: "https://example.com/audio.mp3")!
            
            let task = URLSession.shared.dataTask(with: url) { data, response, error in
                guard let data = data else {
                    XCTFail("Failed to download data: \(error?.localizedDescription ?? "Unknown error")")
                    return
                }
                
                // Simulate processing the data
                _ = data.count
                expectation.fulfill()
            }
            task.resume()
            waitForExpectations(timeout: 60)
        }
    }
}
```

これらのテストケースを使用して、ファイルへのダウンロードとメモリへのダウンロードのパフォーマンスを比較できます。`measure`メソッドはテストの実行時間を測定し、どちらの方法がより効率的かを判断するためのデータを提供します。

---
