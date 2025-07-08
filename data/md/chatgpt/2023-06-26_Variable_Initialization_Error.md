# Variable Initialization Error

日付: 2023-06-26

---

## 👤 ユーザー
*2023/6/26 14:12:58*

calibrationData = try getCalibrationData(orientation: orientation, userDefaultsManager: userDefaultsManager) で以下のエラーが出てしまってる。どうして？
Variable 'self.calibrationData' used before being initialized

//
//  Created by sugurutakahashi on 2023/06/20
//  Copyright © 2023 Viagate Inc. All rights reserved.
//

import Combine
import CoreMedia // CMSampleBuffer
import EmomilCore
import EmomilDataTransfer
import EmomilSeeSo
import EmotionAnalysis
import EmotionAnalysisCore
import Foundation

public final class VideoWatchingAnalysisInteractor: VideoWatchingAnalysisInteractorProtocol {
    private let calibrationData: [Double]
    private let measurementId: String
    private let userId: User.ID
    private let sessionId: String
    private let gazeTrackManager: GazeTrackManagerProtocol
    private let serializeAndUploadInteractor: SerializeAndUploadInteractorProtocol

    private let errorSubject = PassthroughSubject&lt;Error, Never&gt;()

    private var cancellableSet = Set&lt;AnyCancellable&gt;()
    private var sampleBufferAndTimestamp: [(sampleBuffer: CMSampleBuffer, timestamp: Date)] = []

    public var errorPublisher: AnyPublisher&lt;Error, Never&gt; {
        errorSubject.eraseToAnyPublisher()
    }

    public init(
        measurementId: String,
        userId: User.ID,
        sessionId: String,
        orientation: AppUIInterfaceOrientation,
        userDefaultsManager: UserDefaultsManagerProtocol = UserDefaultsManager(),
        gazeTrackManager: GazeTrackManagerProtocol = SeeSoGazeTrackManager(),
        serializeAndUploadInteractor: SerializeAndUploadInteractorProtocol = SerializeAndUploadInteractor()
    ) throws {
        // キャリブレーション未設定だとエラーをthrowしてイニシャライザが失敗する
        calibrationData = try getCalibrationData(orientation: orientation, userDefaultsManager: userDefaultsManager)
        self.measurementId = measurementId
        self.userId = userId
        self.sessionId = sessionId
        self.gazeTrackManager = gazeTrackManager
        self.serializeAndUploadInteractor = serializeAndUploadInteractor

        gazeTrackManager
            .gazeTrackEventPublisher
            .sink { [weak self] event in
                switch event {
                case .canStartTracking(let canStartTracking):
                    guard let self else { return }
                    AppLogger.debugLog("Event: \(event), CanStartTracking: \(String(describing: canStartTracking))")
                    guard canStartTracking else { return }

                    do {
                        // setCalibrationData -&gt; startTracking の実行
                        try self.gazeTrackManager.setCalibrationData(calibrationData: self.calibrationData)
                        try self.gazeTrackManager.startTracking()
                    } catch {
                        self.errorSubject.send(error)
                    }

                case .initialized(let trackerVoid, let error):
                    AppLogger.debugLog("Event: \(event), TrackerVoid: \(String(describing: trackerVoid)), Error: \(error)")

                    if error != .none {
                        // ハンドリングすべきエラーのみを送信する
                        self?.errorSubject.send(error)
                    }

                case .stopped(let error):
                    AppLogger.debugLog("Event: \(event), Error: \(error)", level: .error)

                    if error != .none {
                        // ハンドリングすべきエラーのみを送信する
                        self?.errorSubject.send(error)
                    }

                case .image(let timestamp, let sampleBuffer):
                    AppLogger.debugLog("Event: \(event), Timestamp: \(timestamp), Image: \(sampleBuffer)")
                    self?.sampleBufferAndTimestamp.append((sampleBuffer: sampleBuffer, timestamp: timestamp))

                default:
                    break
                }
            }
            .store(in: &cancellableSet)

        self.gazeTrackManager.initializationGazeTracker()
    }

    public func uploadVideoWatchingData() async throws {
        // TODO: 視線分析

        // 感情分析
        let emotionDataModels = try await analyzeEmotion()
        let emotionDataKey = EmotionDataKey(measurementId: measurementId, userId: userId, sessionId: sessionId)
        try await serializeAndUploadInteractor.serializeAndUpload(target: SerializableUploadTarget.emotion(key: emotionDataKey, dataModels: emotionDataModels))
    }

    public func analyzeEmotion() async throws -&gt; [EmotionDataModel] {
        var emotionPredictionResult: [EmotionPredictionResult] = []

        try await withThrowingTaskGroup(of: EmotionPredictionResult.self) { group in
            for (sampleBuffer, timestamp) in sampleBufferAndTimestamp {
                group.addTask {
                    let imageItem = try await EmotionAnalysis.predictWithFaceDetection(sampleBuffer: sampleBuffer, timestamp: timestamp.asMilliseconds)
                    return EmotionPredictionResult(timestamp: timestamp, imageItem: imageItem)
                }
            }

            for try await result in group {
                emotionPredictionResult.append(result)
            }
        }

        return emotionPredictionResult.flatMap { predictEmotionResult -&gt; [EmotionDataModel] in
            predictEmotionResult.emotionDataModels
        }
    }
}

private extension VideoWatchingAnalysisInteractor {
    func getCalibrationData(orientation: AppUIInterfaceOrientation, userDefaultsManager: UserDefaultsManagerProtocol) throws -&gt; [Double] {
        let optionalCalibrationData: [Double]? = {
            switch orientation {
            case .portrait:
                return userDefaultsManager.portraitCalibrationData.value
            case .landscapeRight:
                return userDefaultsManager.landscapeRightCalibrationData.value
            }
        }()

        guard let unwrappedCalibrationData = optionalCalibrationData else {
            AppLogger.debugLog("calibration data not found: \(String(describing: orientation))", level: .error)
            throw VideoWatchingAnalysisInteractorError.calibrationDataNotFound
        }

        return unwrappedCalibrationData
    }
}

// TODO: EmotionAnalysis 側に定義する & EmotionAnalysis.predictWithFaceDetection() -&gt; [ImageItem] を -&gt; PredictEmotionResult とする
public struct EmotionPredictionResult {
    public let id: String = UUID().uuidString
    public let timestamp: Date
    public let imageItem: [ImageItem]

    public init(timestamp: Date, imageItem: [ImageItem]) {
        self.timestamp = timestamp
        self.imageItem = imageItem
    }
}

private extension EmotionPredictionResult {
    var emotionDataModels: [EmotionDataModel] {
        imageItem.map { item in
            EmotionDataModel(
                timestamp: item.timestamp.asDateFromMilliseconds, // Date型に変換
                resultStatus: EmotionDataModel.ResultStatus(imageItemCount: imageItem.count),
                neutral: item.emotionConfidence(for: .neutral),
                happy: item.emotionConfidence(for: .happy),
                sad: item.emotionConfidence(for: .sad),
                angry: item.emotionConfidence(for: .anger),
                surprised: item.emotionConfidence(for: .surprise),
                disgusted: item.emotionConfidence(for: .disgust),
                fear: item.emotionConfidence(for: .fear),
                contempt: item.emotionConfidence(for: .contempt)
            )
        }
    }
}

private extension EmotionDataModel.ResultStatus {
    init(imageItemCount: Int) {
        if imageItemCount == 0 {
            self = .failure
        } else if imageItemCount == 1 {
            self = .success
        } else if imageItemCount &gt;= 2 {
            self = .multiFaces
        } else {
            fatalError("Invalid array count")
        }
    }
}

private extension ImageItem {
    func emotionConfidence(for emotion: EmotionType) -&gt; Double? {
        emotionPredictResults.first(where: { $0.emotion == emotion })?.confidence.asDouble
    }
}

---

## 🤖 アシスタント
*2023/6/26 14:13:36*

コード内でエラーが発生する箇所はここです：

```swift
try self.gazeTrackManager.setCalibrationData(calibrationData: self.calibrationData)
```

これは、`self.calibrationData`が初期化される前に使用されているからです。Swiftでは、インスタンスのプロパティはそのインスタンス自体が初期化された後でなければアクセスできません。つまり、クラスや構造体の全てのプロパティが初期化された後で初めて`self`を参照することができます。この規則は循環参照を防ぎ、初期化が完全に終了した状態でのみ`self`が使用可能であることを保証します。

この問題を解決するためには、`setCalibrationData`メソッドを別の場所で呼び出す必要があります。クラスが完全に初期化された後であれば、どこでも呼び出すことができます。その一つの方法は、`setCalibrationData`メソッドを`init`メソッドの外で呼び出すことです。例えば、クラスの初期化後にメソッドを呼び出すための専用のメソッドを作成することが考えられます。

```swift
public func initializeGazeTracking() throws {
    do {
        // setCalibrationData -> startTracking の実行
        try self.gazeTrackManager.setCalibrationData(calibrationData: self.calibrationData)
        try self.gazeTrackManager.startTracking()
    } catch {
        self.errorSubject.send(error)
    }
}
```

そして、このメソッドはクラスが初期化された後に呼び出されます：

```swift
let interactor = try VideoWatchingAnalysisInteractor(...)
try interactor.initializeGazeTracking()
```

この方法では、全てのプロパティが適切に初期化された後で`self.calibrationData`にアクセスしますので、初期化前にプロパティにアクセスするというエラーは発生しないはずです。

---

## 👤 ユーザー
*2023/6/26 14:14:10*

interactorからそとから関数を実行させたくない

---

## 🤖 アシスタント
*2023/6/26 14:14:44*

それなら、最初にキャリブレーションデータを一時変数に格納し、その後インスタンスプロパティに代入することで問題を解決できます。これにより、メソッド内で`self`を使用せずにキャリブレーションデータを取得でき、`gazeTrackManager.setCalibrationData(calibrationData:)`メソッドの引数として利用することが可能になります。以下に、修正した`init`メソッドを示します。

```swift
public init(
    measurementId: String,
    userId: User.ID,
    sessionId: String,
    orientation: AppUIInterfaceOrientation,
    userDefaultsManager: UserDefaultsManagerProtocol = UserDefaultsManager(),
    gazeTrackManager: GazeTrackManagerProtocol = SeeSoGazeTrackManager(),
    serializeAndUploadInteractor: SerializeAndUploadInteractorProtocol = SerializeAndUploadInteractor()
) throws {
    let calibrationData = try getCalibrationData(orientation: orientation, userDefaultsManager: userDefaultsManager)
    self.measurementId = measurementId
    self.userId = userId
    self.sessionId = sessionId
    self.gazeTrackManager = gazeTrackManager
    self.serializeAndUploadInteractor = serializeAndUploadInteractor
    self.calibrationData = calibrationData

    gazeTrackManager
        .gazeTrackEventPublisher
        .sink { [weak self] event in
            switch event {
            case .canStartTracking(let canStartTracking):
                guard let self else { return }
                AppLogger.debugLog("Event: \(event), CanStartTracking: \(String(describing: canStartTracking))")
                guard canStartTracking else { return }

                do {
                    // setCalibrationData -> startTracking の実行
                    try self.gazeTrackManager.setCalibrationData(calibrationData: self.calibrationData)
                    try self.gazeTrackManager.startTracking()
                } catch {
                    self.errorSubject.send(error)
                }

            ...
```

このように、一時的に`calibrationData`を格納するローカル変数を作成して、その後で`self.calibrationData`に代入することで、Swiftの初期化のルールに従いつつも、`self`がまだ完全に初期化されていない段階での`calibrationData`の利用を可能にすることができます。

---

## 👤 ユーザー
*2023/6/26 14:23:52*

そのように対応しても以下のエラーになってしまう。

Variable 'self.calibrationData' used before being initialized

---

## 🤖 アシスタント
*2023/6/26 14:24:36*

大変申し訳ありません。理解が深まりました。イベントを購読する部分で`self.calibrationData`を使用しているため、それがまだ初期化されていないという問題が発生しています。

この問題を解決する一つの方法は、gaze trackerのイベント購読を`init`から別のメソッドに移動し、そのメソッドを`init`の最後で呼び出すことです。

```swift
public init(
    measurementId: String,
    userId: User.ID,
    sessionId: String,
    orientation: AppUIInterfaceOrientation,
    userDefaultsManager: UserDefaultsManagerProtocol = UserDefaultsManager(),
    gazeTrackManager: GazeTrackManagerProtocol = SeeSoGazeTrackManager(),
    serializeAndUploadInteractor: SerializeAndUploadInteractorProtocol = SerializeAndUploadInteractor()
) throws {
    let calibrationData = try getCalibrationData(orientation: orientation, userDefaultsManager: userDefaultsManager)
    self.measurementId = measurementId
    self.userId = userId
    self.sessionId = sessionId
    self.gazeTrackManager = gazeTrackManager
    self.serializeAndUploadInteractor = serializeAndUploadInteractor
    self.calibrationData = calibrationData

    subscribeToGazeTrackEvents()  // Call the new method here
    self.gazeTrackManager.initializationGazeTracker()
}

private func subscribeToGazeTrackEvents() {
    gazeTrackManager
        .gazeTrackEventPublisher
        .sink { [weak self] event in
            switch event {
            case .canStartTracking(let canStartTracking):
                guard let self = self else { return }
                AppLogger.debugLog("Event: \(event), CanStartTracking: \(String(describing: canStartTracking))")
                guard canStartTracking else { return }

                do {
                    // setCalibrationData -> startTracking の実行
                    try self.gazeTrackManager.setCalibrationData(calibrationData: self.calibrationData)
                    try self.gazeTrackManager.startTracking()
                } catch {
                    self.errorSubject.send(error)
                }

            ...
}
```

このようにすると、`subscribeToGazeTrackEvents`メソッドはクラスの全てのプロパティが初期化された後に呼び出されるので、初期化前にプロパティにアクセスするという問題が解消されます。

---

## 👤 ユーザー
*2023/6/26 14:34:19*

移行しても発生してしまっております。

Variable 'self.calibrationData' used before being initialized

---

## 🤖 アシスタント
*2023/6/26 14:34:58*

申し訳ありませんが、理解が間違っておりました。Swift の初期化は、全てのプロパティが初期化される前に、インスタンスメソッドを呼び出すことができません。そのため、キャリブレーションデータを取得する処理を init 内に直接記述することで問題を解決することが可能です。

以下に示すコードは、`getCalibrationData` 関数の内容を `init` 内に直接記述しています：

```swift
public init(
    measurementId: String,
    userId: User.ID,
    sessionId: String,
    orientation: AppUIInterfaceOrientation,
    userDefaultsManager: UserDefaultsManagerProtocol = UserDefaultsManager(),
    gazeTrackManager: GazeTrackManagerProtocol = SeeSoGazeTrackManager(),
    serializeAndUploadInteractor: SerializeAndUploadInteractorProtocol = SerializeAndUploadInteractor()
) throws {
    // Get calibration data directly in init
    let optionalCalibrationData: [Double]? = {
        switch orientation {
        case .portrait:
            return userDefaultsManager.portraitCalibrationData.value
        case .landscapeRight:
            return userDefaultsManager.landscapeRightCalibrationData.value
        }
    }()

    guard let unwrappedCalibrationData = optionalCalibrationData else {
        AppLogger.debugLog("calibration data not found: \(String(describing: orientation))", level: .error)
        throw VideoWatchingAnalysisInteractorError.calibrationDataNotFound
    }

    self.calibrationData = unwrappedCalibrationData
    self.measurementId = measurementId
    self.userId = userId
    self.sessionId = sessionId
    self.gazeTrackManager = gazeTrackManager
    self.serializeAndUploadInteractor = serializeAndUploadInteractor

    gazeTrackManager
        .gazeTrackEventPublisher
        .sink { [weak self] event in
            switch event {
            case .canStartTracking(let canStartTracking):
                guard let self = self else { return }
                AppLogger.debugLog("Event: \(event), CanStartTracking: \(String(describing: canStartTracking))")
                guard canStartTracking else { return }

                do {
                    // setCalibrationData -> startTracking の実行
                    try self.gazeTrackManager.setCalibrationData(calibrationData: self.calibrationData)
                    try self.gazeTrackManager.startTracking()
                } catch {
                    self.errorSubject.send(error)
                }

    ...
}
```

これで初期化前にプロパティにアクセスするという問題が解消されるはずです。

---
