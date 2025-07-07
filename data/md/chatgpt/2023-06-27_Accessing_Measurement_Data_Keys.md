# Accessing Measurement Data Keys

日付: 2023-06-27

---

## 👤 ユーザー
*2023/6/28 4:09:23*

以下の定義であるが、measurementDataKey.anchor、measurementDataKey.interaction、measurementDataKey.emotion のようにアクセスできるようにしたいがどうすればいいか

public protocol MeasurementDataKey: DataKey {
    var measurementId: String { get }
    var userId: User.ID { get }
    var sessionId: String { get }
}

public extension MeasurementDataKey {
    var localFileNameSuffix: String {
        "\\(measurementId)\_\\(userId)\_\\(sessionId)\_\\(Date().asISO8601WithFractionalSeconds)"
    }
}
public struct InteractionDataKey: MeasurementDataKey {
    public let measurementId: String
    public let userId: User.ID
    public let sessionId: String

    public init(measurementId: String, userId: User.ID, sessionId: String) {
        self.measurementId = measurementId
        self.userId = userId
        self.sessionId = sessionId
    }

    public var path: String {
        "raw/interactions/measurements/\\(measurementId)/users/\\(userId)/sessions/\\(sessionId)"
    }

    public var localFileName: String {
        "\\(Constants.OutputFileNames.interaction.rawValue)\_\\(localFileNameSuffix)"
    }
}
public struct AnchorDataKey: MeasurementDataKey {
    public let measurementId: String
    public let userId: User.ID
    public let sessionId: String

    public init(measurementId: String, userId: User.ID, sessionId: String) {
        self.measurementId = measurementId
        self.userId = userId
        self.sessionId = sessionId
    }

    public var path: String {
        "raw/anchors/measurements/\\(measurementId)/users/\\(userId)/sessions/\\(sessionId)"
    }

    public var localFileName: String {
        "\\(Constants.OutputFileNames.anchor.rawValue)\_\\(localFileNameSuffix)"
    }
}
public struct EmotionDataKey: MeasurementDataKey {
    public let measurementId: String
    public let userId: User.ID
    public let sessionId: String

    public init(measurementId: String, userId: User.ID, sessionId: String) {
        self.measurementId = measurementId
        self.userId = userId
        self.sessionId = sessionId
    }

    public var path: String {
        "raw/emotions/measurements/\\(measurementId)/users/\\(userId)/sessions/\\(sessionId)"
    }

    public var localFileName: String {
        "\\(Constants.OutputFileNames.emotion.rawValue)\_\\(localFileNameSuffix)"
    }
}
public protocol DataKey {
    var path: String { get }
    // ファイル出力時のファイル名
    var localFileName: String { get }
}

---

## 🤖 アシスタント
*2023/6/28 4:10:06*

質問を理解する限り、おそらくmeasurementDataKeyを用いて、anchor、interaction、emotionへアクセスするようなクラスや構造体を作りたいということだと思います。以下のようにDataKeyFactoryという名前のファクトリークラスを作成し、MeasurementDataKeyインスタンスを作成するメソッドを追加することで、簡単に目的を達成できます。

```swift
public class DataKeyFactory {

    public static func makeKey(_ type: DataType, measurementId: String, userId: User.ID, sessionId: String) -> MeasurementDataKey {
        switch type {
        case .anchor:
            return AnchorDataKey(measurementId: measurementId, userId: userId, sessionId: sessionId)
        case .interaction:
            return InteractionDataKey(measurementId: measurementId, userId: userId, sessionId: sessionId)
        case .emotion:
            return EmotionDataKey(measurementId: measurementId, userId: userId, sessionId: sessionId)
        }
    }
}

public enum DataType {
    case anchor
    case interaction
    case emotion
}
```

このようにすれば、次のような形でMeasurementDataKeyのインスタンスを取得できます。

```swift
let anchorKey = DataKeyFactory.makeKey(.anchor, measurementId: "measurementId", userId: "userId", sessionId: "sessionId")
let interactionKey = DataKeyFactory.makeKey(.interaction, measurementId: "measurementId", userId: "userId", sessionId: "sessionId")
let emotionKey = DataKeyFactory.makeKey(.emotion, measurementId: "measurementId", userId: "userId", sessionId: "sessionId")
```

以上のコードでは、DataKeyFactoryクラスを通じてDataTypeに応じた適切なMeasurementDataKeyのインスタンスを取得します。このように、ファクトリーパターンは、具体的なクラスの名前を知らなくても、必要なオブジェクトを生成するための一般的なインターフェースを提供します。

---

## 👤 ユーザー
*2023/6/28 4:11:13*

ちょっと違くて、let measurementDataKey = MeasurementDataKey(measurementId: measurementId, userId: userId, sessionId: sessionId) と一度作ったら、measurementDataKey.anchor、measurementDataKey.interaction、measurementDataKey.emotion みたいにアクセスできるイメージ。できれば enum でやりたい。

---

## 🤖 アシスタント
*2023/6/28 4:11:49*

理解しました。その場合は、以下のように `MeasurementDataKey` エンムを作成し、そこに anchor, interaction, emotion といったケースを持たせ、それぞれに対して対応する `DataKey` を生成するメソッドを持たせることができます。例えば以下のように定義することが可能です。

```swift
public enum MeasurementDataKey {
    case anchor(measurementId: String, userId: User.ID, sessionId: String)
    case interaction(measurementId: String, userId: User.ID, sessionId: String)
    case emotion(measurementId: String, userId: User.ID, sessionId: String)

    public var dataKey: DataKey {
        switch self {
        case .anchor(let measurementId, let userId, let sessionId):
            return AnchorDataKey(measurementId: measurementId, userId: userId, sessionId: sessionId)
        case .interaction(let measurementId, let userId, let sessionId):
            return InteractionDataKey(measurementId: measurementId, userId: userId, sessionId: sessionId)
        case .emotion(let measurementId, let userId, let sessionId):
            return EmotionDataKey(measurementId: measurementId, userId: userId, sessionId: sessionId)
        }
    }
}
```

そして、以下のように使用できます。

```swift
let measurementDataKey = MeasurementDataKey.anchor(measurementId: "measurementId", userId: "userId", sessionId: "sessionId")
let dataKey = measurementDataKey.dataKey
```

上記のコードは、`MeasurementDataKey` エンムを作成し、各ケースに対して `DataKey` を生成する `dataKey` プロパティを提供します。これにより、特定の `MeasurementDataKey` インスタンスに対する `DataKey` を取得できます。

---
