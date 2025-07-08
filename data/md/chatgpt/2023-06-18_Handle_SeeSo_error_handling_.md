# Handle SeeSo error handling.

日付: 2023-06-18

---

## 👤 ユーザー
*2023/06/18 18:47:43*

subscribeInitializationDelegate() {} で .sink(receiveValue: のところで、 errorを throw したりうまくハンドリングする方法を教えて欲しい。




import Foundation
import SeeSo
import EmomilCore
import Combine
import CoreMedia // for CMSampleBuffer

public enum GazeTrackManagerError: Error {
    case trackerNotFound
    case initializationError
}

// TODO: PassthroughSubjectではなく、protocol経由でAnyPublisherとして公開する（subscribe側から値をsendできないようにする）
// TODO: 作成するprotocolはSeeSo SDKの型を使わないようにする
final class SeeSoGazeTrackManager {
    
    // InitializationDelegate
    private let onInitializedSubject = PassthroughSubject&lt;(tracker: SeeSo.GazeTracker?, error: SeeSo.InitializationError), Never&gt;()

    // InitializationDelegate
    private let onImageSubject = PassthroughSubject&lt;(timestamp: Double, image: CMSampleBuffer), Never&gt;()
    
    // GazeDelegate
    private let onGazeSubject = PassthroughSubject&lt;SeeSo.GazeInfo, Never&gt;()
    
    // CalibrationDelegate
    private let onCalibrationNextPointSubject = PassthroughSubject&lt;(x: Double, y: Double), Never&gt;()
    private let onCalibrationProgressSubject = PassthroughSubject&lt;Double, Never&gt;()
    private let onCalibrationFinishedSubject = PassthroughSubject&lt;[Double], Never&gt;()
    
    // UserStatusDelegate
    private let onAttentionSubject = PassthroughSubject&lt;(timestampBegin: Int, timestampEnd: Int, score: Double), Never&gt;()
    private let onBlinkSubject = PassthroughSubject&lt;(timestamp: Int, isBlinkLeft: Bool, isBlinkRight: Bool, isBlink: Bool, eyeOpenness: Double), Never&gt;()
    private let onDrowsinessSubject = PassthroughSubject&lt;(timestamp: Int, isDrowsiness: Bool), Never&gt;()
    
    // GazeTrackerDelegate
    private let onStartedSubject = PassthroughSubject&lt;Void, Never&gt;()
    private let onStoppedSubject = PassthroughSubject&lt;SeeSo.StatusError, Never&gt;()
    
    // SeeSo Configs
    private let startTrackingAttentionIntervalSeconds: Int = 10 // 10 to 60 seconds. (The default is 30 seconds.)
    private let calibrationMode: SeeSo.CalibrationMode = .DEFAULT // ONE_POINT or FIVE_POINT(DEFAULT) or SIX_POINT
    private let calibrationCriteria: SeeSo.AccuracyCriteria = .DEFAULT // LOW or DEFAULT or HIGH
    
    private var cancellableSet = Set&lt;AnyCancellable&gt;()
    private var tracker: GazeTracker?
    
    init(buildEnvironment: BuildEnvironmentProtocol) {
        let licenseKey = Constants.getSeeSoLicenseKey(buildEnvironment: buildEnvironment)
        let option = UserStatusOption()
        option.useAll()
        GazeTracker.initGazeTracker(
            license: licenseKey,
            delegate: self,
            option: option
        )
        subscribeInitializationDelegate()
    }
    
    deinit {
        cancellableSet.forEach { $0.cancel() }
        cancellableSet = []
        print("deinit")
    }
    
    private func subscribeInitializationDelegate() {
        cancellableSet.forEach { $0.cancel() }
        cancellableSet = []

        // tracker の初期化
        onInitializedSubject
            .compactMap { tracker, error -&gt; (tracker: SeeSo.GazeTracker, error: SeeSo.InitializationError)? in
                print(error)
                guard let tracker else {
                    print("tracker is not found")
                    return nil
                }
                return (tracker, error)
            }
            .sink(receiveValue: { [weak self] tracker, error in
                guard let self else {
                    return
                }
                guard error == .ERROR_NONE else {
                    print(error)
                    assertionFailure("\(error)")
                    throw GazeTrackManagerError.initializationError
                }
                self.tracker = tracker
                
                do {
                    try self.startTracking()
                } catch {
                    assertionFailure("\(error)")
                    throw error
                }
            })
            .store(in: &cancellableSet)
    }
    
    public func restartTracking() throws {
        try startTracking()
    }
    
    private func startTracking() throws {
        guard let tracker else {
            print("tracker is not found")
            assertionFailure("tracker is not found")
            throw GazeTrackManagerError.trackerNotFound
        }
        tracker.statusDelegate = self
        tracker.gazeDelegate = self
        tracker.calibrationDelegate = self
        tracker.imageDelegate = self
        tracker.userStatusDelegate = self
        tracker.setAttentionInterval(interval: startTrackingAttentionIntervalSeconds)
        tracker.startTracking()
    }
    
    public func startCalibration() {
        guard let tracker else {
            print("tracker is not found")
            assertionFailure("tracker is not found")
            return
        }
        let calibrationParameterIsValid = tracker.startCalibration(mode: calibrationMode, criteria: calibrationCriteria)
        if !calibrationParameterIsValid {
            assertionFailure("calibration parameter is valid")
        }
    }
    
    
}

extension SeeSoGazeTrackManager: InitializationDelegate {
    func onInitialized(tracker: SeeSo.GazeTracker?, error: SeeSo.InitializationError) {
        onInitializedSubject.send((tracker: tracker, error: error))
    }
}

extension SeeSoGazeTrackManager: StatusDelegate {
    func onStarted() {
        onStartedSubject.send(())
    }

    func onStopped(error: SeeSo.StatusError) {
        onStoppedSubject.send(error)
    }
}

extension SeeSoGazeTrackManager: CalibrationDelegate {
    func onCalibrationNextPoint(x: Double, y: Double) {
        onCalibrationNextPointSubject.send((x: x, y: y))
    }
    
    func onCalibrationProgress(progress: Double) {
        onCalibrationProgressSubject.send(progress)
    }
    
    func onCalibrationFinished(calibrationData: [Double]) {
        onCalibrationFinishedSubject.send(calibrationData)
    }
}

extension SeeSoGazeTrackManager: ImageDelegate {
    func onImage(timestamp: Double, image: CMSampleBuffer) {
        onImageSubject.send((timestamp: timestamp, image: image))
    }
}

extension SeeSoGazeTrackManager: GazeDelegate {
    func onGaze(gazeInfo: SeeSo.GazeInfo) {
        onGazeSubject.send(gazeInfo)
    }
}

extension SeeSoGazeTrackManager: UserStatusDelegate {
    func onAttention(timestampBegin: Int, timestampEnd: Int, score: Double) {
        onAttentionSubject.send((timestampBegin: timestampBegin, timestampEnd: timestampEnd, score: score))
    }
    
    func onBlink(timestamp: Int, isBlinkLeft: Bool, isBlinkRight: Bool, isBlink: Bool, eyeOpenness: Double) {
        onBlinkSubject.send((timestamp: timestamp, isBlinkLeft: isBlinkLeft, isBlinkRight: isBlinkRight, isBlink: isBlink, eyeOpenness: eyeOpenness))
    }
    
    func onDrowsiness(timestamp: Int, isDrowsiness: Bool) {
        onDrowsinessSubject.send((timestamp: timestamp, isDrowsiness: isDrowsiness))
    }
}

---

## 🤖 アシスタント
*2023/06/18 18:48:37*

あなたのコードを見ると、あなたが`subscribeInitializationDelegate`メソッドでCombineを使用していることがわかります。しかし、現在の実装では`.sink(receiveValue:)`クロージャ内でエラーをスローしようとしていますが、それは正常に動作しません。なぜなら、`.sink`メソッドはエラーを投げることをサポートしていないからです。

その代わりに、エラーハンドリングを行いたい場合は、次のような戦略を採ることができます：

1. `PassthroughSubject`の出力エラータイプを`Never`から`GazeTrackManagerError`などの具体的なエラータイプに変更します。これにより、エラーを送信できるようになります。

2. エラーを`PassthroughSubject`に送信することで、エラーをストリームにプッシュします。

3. `.sink`メソッドを使って、エラーを処理します。`.sink`には`receiveCompletion:`というパラメータがあり、ストリームが完了したとき（成功したかエラーで終了したか）に呼び出されます。エラーを受け取ったら、適切な処理を行います。

以下にこの修正を反映したコードの一部を示します：

```swift
public enum GazeTrackManagerError: Error {
    case trackerNotFound
    case initializationError(SeeSo.InitializationError)
}

// InitializationDelegate
private let onInitializedSubject = PassthroughSubject<(tracker: SeeSo.GazeTracker?, error: SeeSo.InitializationError), GazeTrackManagerError>()

private func subscribeInitializationDelegate() {
    cancellableSet.forEach { $0.cancel() }
    cancellableSet = []

    // tracker の初期化
    onInitializedSubject
        .compactMap { tracker, error -> (tracker: SeeSo.GazeTracker, error: SeeSo.InitializationError)? in
            print(error)
            guard let tracker = tracker else {
                print("tracker is not found")
                throw GazeTrackManagerError.trackerNotFound
            }
            guard error == .ERROR_NONE else {
                print(error)
                assertionFailure("\(error)")
                throw GazeTrackManagerError.initializationError(error)
            }
            return (tracker, error)
        }
        .sink(
            receiveCompletion: { completion in
                switch completion {
                case .failure(let error):
                    print("Failed with error \(error)")
                case .finished:
                    print("Finished successfully")
                }
            },
            receiveValue: { [weak self] tracker, error in
                guard let self = self else {
                    return
                }
                self.tracker = tracker
                do {
                    try self.startTracking()
                } catch {
                    assertionFailure("\(error)")
                    throw error // Note: This won't actually throw an error, it'll crash your program. You need to handle the error here.
                }
            }
        )
        .store(in: &cancellableSet)
}
```

上記のように修正することで、エラーを適切にハ

---

## 🤖 アシスタント
*2023/06/18 18:49:35*

ンドリングし、エラーが発生した場合にそれをストリームにプッシュすることができます。ただし、エラーをthrowする代わりに、それを適切にハンドルする必要があります。

---

## 👤 ユーザー
*2023/06/18 18:49:46*

いかが気になります。
/ Note: This won't actually throw an error, it'll crash your program. You need to handle the error here.

---

## 🤖 アシスタント
*2023/06/18 18:50:07*

すみません、そのコメントは誤解を招くものでした。`do-catch`ステートメントの中でエラーをthrowすることはできますが、そのエラーは`do-catch`ステートメントの外側には伝播しないという意味でした。

具体的には、以下のコードではエラーはクラッシュせずに適切に処理されます：

```swift
do {
    try self.startTracking()
} catch {
    assertionFailure("\(error)")
    // Handle error here, for example:
    print("Failed to start tracking: \(error)")
}
```

しかし、以下のようにエラーを`catch`ブロックの外側で再度throwしようとすると、Swiftのランタイムはこれをサポートせず、アプリケーションがクラッシュします：

```swift
do {
    try self.startTracking()
} catch {
    assertionFailure("\(error)")
    throw error // This will crash the program.
}
```

エラーをthrowするのではなく、それを`catch`ブロック内で適切にハンドルする必要があるということを説明しようとしたのが、私のコメントの意図でした。お詫びして訂正します。

---

## 👤 ユーザー
*2023/06/18 19:10:54*

以下のclass内には多くのPassthroughSubjectがあるが、それぞれのOutputを連想値を持つenumに定義して、それらを別の1つのAnyPublisher&lt;連想値を持つenum, Never&gt;をつくることはできないかな？

---

## 🤖 アシスタント
*2023/06/18 19:11:23*

はい、それは可能です。そのために、すべてのイベントを表す新しいenumを定義し、それぞれのイベントタイプを表すためのcaseとそれに対応する連想値を用意します。その後、すべてのイベントをこの新しいenumの値としてpublishする共通の`PassthroughSubject`を作成します。

以下に具体的なコードを示します：

```swift
enum GazeTrackEvent {
    case initialized(tracker: SeeSo.GazeTracker?, error: SeeSo.InitializationError)
    case image(timestamp: Double, image: CMSampleBuffer)
    // ... Add cases for all your events here.
}

let eventPublisher = PassthroughSubject<GazeTrackEvent, Never>()

extension SeeSoGazeTrackManager: InitializationDelegate {
    func onInitialized(tracker: SeeSo.GazeTracker?, error: SeeSo.InitializationError) {
        eventPublisher.send(.initialized(tracker: tracker, error: error))
    }
}

extension SeeSoGazeTrackManager: ImageDelegate {
    func onImage(timestamp: Double, image: CMSampleBuffer) {
        eventPublisher.send(.image(timestamp: timestamp, image: image))
    }
}

// ... Repeat for all your other delegate methods
```

これで、すべてのイベントが一つのPublisherから送信されるようになり、このPublisherを購読することでイベントをすべて受信できます。各イベントを処理するためには、`.sink(receiveValue:)`内でswitch文を使用して受信したイベントのタイプをチェックします。

---

## 👤 ユーザー
*2023/06/18 19:11:50*

今の一つ一つ公開しているpublisherも残しておきたいんだ

---

## 🤖 アシスタント
*2023/06/18 19:12:24*

その場合、それぞれの`PassthroughSubject`を保持し、同時に新しい`GazeTrackEvent`を出力する共通の`PassthroughSubject`も作成することができます。これにより、各イベントタイプに対して専用のPublisherと、すべてのイベントを出力する一般的なPublisherの両方を持つことができます。

以下のコードスニペットは、それぞれの`PassthroughSubject`を保持しつつ、`GazeTrackEvent`を出力する`eventPublisher`も使用している例です。

```swift
enum GazeTrackEvent {
    case initialized(tracker: SeeSo.GazeTracker?, error: SeeSo.InitializationError)
    case image(timestamp: Double, image: CMSampleBuffer)
    // ... Add cases for all your events here.
}

let eventPublisher = PassthroughSubject<GazeTrackEvent, Never>()
private let onInitializedSubject = PassthroughSubject<(tracker: SeeSo.GazeTracker?, error: SeeSo.InitializationError), Never>()
private let onImageSubject = PassthroughSubject<(timestamp: Double, image: CMSampleBuffer), Never>()

extension SeeSoGazeTrackManager: InitializationDelegate {
    func onInitialized(tracker: SeeSo.GazeTracker?, error: SeeSo.InitializationError) {
        onInitializedSubject.send((tracker: tracker, error: error))
        eventPublisher.send(.initialized(tracker: tracker, error: error))
    }
}

extension SeeSoGazeTrackManager: ImageDelegate {
    func onImage(timestamp: Double, image: CMSampleBuffer) {
        onImageSubject.send((timestamp: timestamp, image: image))
        eventPublisher.send(.image(timestamp: timestamp, image: image))
    }
}

// ... Repeat for all your other delegate methods
```

これにより、各イベントタイプに対して専用のPublisherを持つことができます（たとえば、初期化が完了したときに通知を受けるための`onInitializedSubject`）、また全てのイベントを通知する`eventPublisher`も持つことができます。

---

## 👤 ユーザー
*2023/06/18 19:14:08*

ありがとう！その容量で全部を記述してほしい。

---

## 🤖 アシスタント
*2023/06/18 19:15:02*

すべての`PassthroughSubject`に対して同様の設定を行うと、コードは次のようになります。

まず、すべてのイベントを表す`GazeTrackEvent` enumを作成します：

```swift
public enum GazeTrackEvent {
    case initialized(tracker: SeeSo.GazeTracker?, error: SeeSo.InitializationError)
    case image(timestamp: Double, image: CMSampleBuffer)
    case gazeInfo(gazeInfo: SeeSo.GazeInfo)
    case calibrationNextPoint(x: Double, y: Double)
    case calibrationProgress(progress: Double)
    case calibrationFinished(calibrationData: [Double])
    case attention(timestampBegin: Int, timestampEnd: Int, score: Double)
    case blink(timestamp: Int, isBlinkLeft: Bool, isBlinkRight: Bool, isBlink: Bool, eyeOpenness: Double)
    case drowsiness(timestamp: Int, isDrowsiness: Bool)
    case started
    case stopped(error: SeeSo.StatusError)
}
```

そして、すべての`PassthroughSubject`を更新して、それぞれのメソッド内で`eventPublisher`にも値を送信するようにします：

```swift
final class SeeSoGazeTrackManager {
    // ... omitting the rest of your properties for brevity

    public let eventPublisher = PassthroughSubject&lt;GazeTrackEvent, Never&gt;()

    // InitializationDelegate
    private let onInitializedSubject = PassthroughSubject&lt;(tracker: SeeSo.GazeTracker?, error: SeeSo.InitializationError), Never&gt;()

    // InitializationDelegate
    private let onImageSubject = PassthroughSubject&lt;(timestamp: Double, image: CMSampleBuffer), Never&gt;()

    // GazeDelegate
    private let onGazeSubject = PassthroughSubject&lt;SeeSo.GazeInfo, Never&gt;()

    // CalibrationDelegate
    private let onCalibrationNextPointSubject = PassthroughSubject&lt;(x: Double, y: Double), Never&gt;()
    private let onCalibrationProgressSubject = PassthroughSubject&lt;Double, Never&gt;()
    private let onCalibrationFinishedSubject = PassthroughSubject&lt;[Double], Never&gt;()

    // UserStatusDelegate
    private let onAttentionSubject = PassthroughSubject&lt;(timestampBegin: Int, timestampEnd: Int, score: Double), Never&gt;()
    private let onBlinkSubject = PassthroughSubject&lt;(timestamp: Int, isBlinkLeft: Bool, isBlinkRight: Bool, isBlink: Bool, eyeOpenness: Double), Never&gt;()
    private let onDrowsinessSubject = PassthroughSubject&lt;(timestamp: Int, isDrowsiness: Bool), Never&gt;()

    // GazeTrackerDelegate
    private let onStartedSubject = PassthroughSubject&lt;Void, Never&gt;()
    private let onStoppedSubject = PassthroughSubject&lt;SeeSo.StatusError, Never&gt;()

    // ... the rest of your class here
}

// delegate methods

extension SeeSoGazeTrackManager: InitializationDelegate {
    func onInitialized(tracker: SeeSo.GazeTracker?, error: SeeSo.InitializationError) {
        onInitializedSubject.send((tracker: tracker, error: error))
        eventPublisher.send(.initialized(tracker: tracker, error: error))
    }
}

extension SeeSoGazeTrackManager: ImageDelegate {
    func onImage(timestamp: Double, image: CMSampleBuffer) {
        onImageSubject.send((timestamp: timestamp, image: image))
        eventPublisher.send(.image(timestamp: timestamp, image: image))
    }
}

extension SeeSoGazeTrackManager: GazeDelegate

---
