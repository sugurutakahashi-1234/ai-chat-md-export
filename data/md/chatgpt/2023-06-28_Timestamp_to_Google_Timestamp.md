# Timestamp to Google Timestamp

日付: 2023-06-28

---

## 👤 ユーザー
*2023/6/28 14:00:49*

ミリ秒でのInt型のUINXのtimestamp情報をもっていてSwiftProtoBufを導入しており、Google\_Protobuf\_Timestamp型に変換したい。どうすればいいか？

let timestampInMilliseconds: Int

extension Google\_Protobuf\_Timestamp {
  /// Creates a new `Google\_Protobuf\_Timestamp` initialized relative to 00:00:00
  /// UTC on 1 January 1970 by a given number of seconds.
  ///
  /// - Parameter timeIntervalSince1970: The `TimeInterval`, interpreted as
  ///   seconds relative to 00:00:00 UTC on 1 January 1970.
  public init(timeIntervalSince1970: TimeInterval) {
    let sd = floor(timeIntervalSince1970)
    let nd = round((timeIntervalSince1970 - sd) \* TimeInterval(nanosPerSecond))
    let (s, n) = normalizeForTimestamp(seconds: Int64(sd), nanos: Int32(nd))
    self.init(seconds: s, nanos: n)
  }

  /// Creates a new `Google\_Protobuf\_Timestamp` initialized relative to 00:00:00
  /// UTC on 1 January 2001 by a given number of seconds.
  ///
  /// - Parameter timeIntervalSinceReferenceDate: The `TimeInterval`,
  ///   interpreted as seconds relative to 00:00:00 UTC on 1 January 2001.
  public init(timeIntervalSinceReferenceDate: TimeInterval) {
    let sd = floor(timeIntervalSinceReferenceDate)
    let nd = round(
      (timeIntervalSinceReferenceDate - sd) \* TimeInterval(nanosPerSecond))
    // The addition of timeIntervalBetween1970And... is deliberately delayed
    // until the input is separated into an integer part and a fraction
    // part, so that we don't unnecessarily lose precision.
    let (s, n) = normalizeForTimestamp(
      seconds: Int64(sd) + Int64(Date.timeIntervalBetween1970AndReferenceDate),
      nanos: Int32(nd))
    self.init(seconds: s, nanos: n)
  }

  /// Creates a new `Google\_Protobuf\_Timestamp` initialized to the same time as
  /// the given `Date`.
  ///
  /// - Parameter date: The `Date` with which to initialize the timestamp.
  public init(date: Date) {
    // Note: Internally, Date uses the "reference date," not the 1970 date.
    // We use it when interacting with Dates so that Date doesn't perform
    // any double arithmetic on our behalf, which might cost us precision.
    self.init(
      timeIntervalSinceReferenceDate: date.timeIntervalSinceReferenceDate)
  }

  /// The interval between the timestamp and 00:00:00 UTC on 1 January 1970.
  public var timeIntervalSince1970: TimeInterval {
    return TimeInterval(self.seconds) +
      TimeInterval(self.nanos) / TimeInterval(nanosPerSecond)
  }

  /// The interval between the timestamp and 00:00:00 UTC on 1 January 2001.
  public var timeIntervalSinceReferenceDate: TimeInterval {
    return TimeInterval(
      self.seconds - Int64(Date.timeIntervalBetween1970AndReferenceDate)) +
      TimeInterval(self.nanos) / TimeInterval(nanosPerSecond)
  }

  /// A `Date` initialized to the same time as the timestamp.
  public var date: Date {
    return Date(
      timeIntervalSinceReferenceDate: self.timeIntervalSinceReferenceDate)
  }
}

---

## 🤖 アシスタント
*2023/6/28 14:01:15*

あなたの`Int`型のUNIXタイムスタンプはミリ秒単位で、Google Protobufの`Google_Protobuf_Timestamp`は秒とナノ秒単位で時刻を表します。このため、ミリ秒単位のUNIXタイムスタンプを変換するには、以下のステップが必要になります。

1. ミリ秒単位のUNIXタイムスタンプを秒とミリ秒に分割します。
2. ミリ秒をナノ秒に変換します。
3. `Google_Protobuf_Timestamp`の初期化メソッドを使用して新しい`Google_Protobuf_Timestamp`インスタンスを作成します。

以下に具体的なコードを示します：

```swift
let timestampInMilliseconds: Int = // あなたのミリ秒単位のUNIXタイムスタンプ

let seconds = Int64(timestampInMilliseconds / 1000)
let nanoseconds = Int32((timestampInMilliseconds % 1000) * 1_000_000) // ミリ秒をナノ秒に変換

let timestamp = Google_Protobuf_Timestamp(seconds: seconds, nanos: nanoseconds)
```

上記のコードでは、ミリ秒単位のUNIXタイムスタンプを秒とナノ秒に変換し、それらの値を使用して新しい`Google_Protobuf_Timestamp`インスタンスを作成します。

---

## 👤 ユーザー
*2023/6/28 14:02:03*

以下のようなextensionのinitは使えないのかな？

extension Google\_Protobuf\_Timestamp {
  /// Creates a new `Google\_Protobuf\_Timestamp` initialized relative to 00:00:00
  /// UTC on 1 January 1970 by a given number of seconds.
  ///
  /// - Parameter timeIntervalSince1970: The `TimeInterval`, interpreted as
  ///   seconds relative to 00:00:00 UTC on 1 January 1970.
  public init(timeIntervalSince1970: TimeInterval) {
    let sd = floor(timeIntervalSince1970)
    let nd = round((timeIntervalSince1970 - sd) \* TimeInterval(nanosPerSecond))
    let (s, n) = normalizeForTimestamp(seconds: Int64(sd), nanos: Int32(nd))
    self.init(seconds: s, nanos: n)
  }

  /// Creates a new `Google\_Protobuf\_Timestamp` initialized relative to 00:00:00
  /// UTC on 1 January 2001 by a given number of seconds.
  ///
  /// - Parameter timeIntervalSinceReferenceDate: The `TimeInterval`,
  ///   interpreted as seconds relative to 00:00:00 UTC on 1 January 2001.
  public init(timeIntervalSinceReferenceDate: TimeInterval) {
    let sd = floor(timeIntervalSinceReferenceDate)
    let nd = round(
      (timeIntervalSinceReferenceDate - sd) \* TimeInterval(nanosPerSecond))
    // The addition of timeIntervalBetween1970And... is deliberately delayed
    // until the input is separated into an integer part and a fraction
    // part, so that we don't unnecessarily lose precision.
    let (s, n) = normalizeForTimestamp(
      seconds: Int64(sd) + Int64(Date.timeIntervalBetween1970AndReferenceDate),
      nanos: Int32(nd))
    self.init(seconds: s, nanos: n)
  }

  /// Creates a new `Google\_Protobuf\_Timestamp` initialized to the same time as
  /// the given `Date`.
  ///
  /// - Parameter date: The `Date` with which to initialize the timestamp.
  public init(date: Date) {
    // Note: Internally, Date uses the "reference date," not the 1970 date.
    // We use it when interacting with Dates so that Date doesn't perform
    // any double arithmetic on our behalf, which might cost us precision.
    self.init(
      timeIntervalSinceReferenceDate: date.timeIntervalSinceReferenceDate)
  }

  /// The interval between the timestamp and 00:00:00 UTC on 1 January 1970.
  public var timeIntervalSince1970: TimeInterval {
    return TimeInterval(self.seconds) +
      TimeInterval(self.nanos) / TimeInterval(nanosPerSecond)
  }

  /// The interval between the timestamp and 00:00:00 UTC on 1 January 2001.
  public var timeIntervalSinceReferenceDate: TimeInterval {
    return TimeInterval(
      self.seconds - Int64(Date.timeIntervalBetween1970AndReferenceDate)) +
      TimeInterval(self.nanos) / TimeInterval(nanosPerSecond)
  }

  /// A `Date` initialized to the same time as the timestamp.
  public var date: Date {
    return Date(
      timeIntervalSinceReferenceDate: self.timeIntervalSinceReferenceDate)
  }
}

---

## 🤖 アシスタント
*2023/6/28 14:02:23*

はい、その拡張を使用することもできます。`timeIntervalSince1970`というメソッドは、与えられた`TimeInterval`（秒単位）を1970年1月1日00:00:00 UTCからの相対的な時間として解釈します。 

あなたのミリ秒単位のUNIXタイムスタンプを秒単位に変換する必要があるため、以下のようにコードを書くことができます。

```swift
let timestampInMilliseconds: Int = // あなたのミリ秒単位のUNIXタイムスタンプ

let timeIntervalSince1970 = TimeInterval(timestampInMilliseconds) / 1000.0

let timestamp = Google_Protobuf_Timestamp(timeIntervalSince1970: timeIntervalSince1970)
```

このコードでは、まずUNIXタイムスタンプを秒単位の`TimeInterval`に変換し（ミリ秒を秒に変換するために1000で除算）、それを使用して`Google_Protobuf_Timestamp`を初期化します。

このアプローチは、直接`seconds`と`nanos`を設定する上記のアプローチと同じ結果を生成しますが、コードが少しシンプルになります。

---

## 👤 ユーザー
*2023/6/28 14:03:43*

以下のようなものを定義していて、protocolを作成して、その処理をprotocolのextensionで実装して使いたい
public struct EmotionDataModel {
    public enum ResultStatus {
        case success
        case multiFaces
        case failure
    }

    public let timestampInMilliseconds: Int
    public let resultStatus: ResultStatus
    public let neutral: Double?
    public let happy: Double?
    public let sad: Double?
    public let angry: Double?
    public let surprised: Double?
    public let disgusted: Double?
    public let fear: Double?
    public let contempt: Double?

    public init(timestampInMilliseconds: Int, resultStatus: ResultStatus, neutral: Double?, happy: Double?, sad: Double?, angry: Double?, surprised: Double?, disgusted: Double?, fear: Double?, contempt: Double?) {
        self.timestampInMilliseconds = timestampInMilliseconds
        self.resultStatus = resultStatus
        self.neutral = neutral
        self.happy = happy
        self.sad = sad
        self.angry = angry
        self.surprised = surprised
        self.disgusted = disgusted
        self.fear = fear
        self.contempt = contempt
    }
}

public struct AnchorDataModel {
    public let timestampInMilliseconds: Int
    public let left: Double?
    public let top: Double?
    public let trackingState: TrackingState?
    public let eyeMovementState: EyeMovementState?
    public let screenState: ScreenState?
    public let attention: Double?
    public let blinkRight: Bool?
    public let blinkLeft: Bool?
    public let eyeOpenness: Double?
    public let drowsiness: Bool?

    public init(timestampInMilliseconds: Int, left: Double?, top: Double?, trackingState: TrackingState?, eyeMovementState: EyeMovementState?, screenState: ScreenState?, attention: Double?, blinkRight: Bool?, blinkLeft: Bool?, eyeOpenness: Double?, drowsiness: Bool?) {
        self.timestampInMilliseconds = timestampInMilliseconds
        self.left = left
        self.top = top
        self.trackingState = trackingState
        self.eyeMovementState = eyeMovementState
        self.screenState = screenState
        self.attention = attention
        self.blinkRight = blinkRight
        self.blinkLeft = blinkLeft
        self.eyeOpenness = eyeOpenness
        self.drowsiness = drowsiness
    }
}


public struct InteractionDataModel {
    public let timestampInMilliseconds: Int
    public let eventType: InteractionEventType

    public init(timestampInMilliseconds: Int, eventType: InteractionEventType) {
        self.timestampInMilliseconds = timestampInMilliseconds
        self.eventType = eventType
    }
}

---

## 🤖 アシスタント
*2023/6/28 14:04:21*

これらのデータモデルがすべて`timestampInMilliseconds`という共通のプロパティを持っているため、プロトコルを使ってその機能を共有することは理にかなっています。以下のように`Timestampable`という新しいプロトコルを定義することができます：

```swift
protocol Timestampable {
    var timestampInMilliseconds: Int { get }
}

extension Timestampable {
    var timestamp: Google_Protobuf_Timestamp {
        let timeIntervalSince1970 = TimeInterval(timestampInMilliseconds) / 1000.0
        return Google_Protobuf_Timestamp(timeIntervalSince1970: timeIntervalSince1970)
    }
}
```

次に、それぞれのデータモデルにこのプロトコルを適用します：

```swift
public struct EmotionDataModel: Timestampable {
    // 元のプロパティとイニシャライザを維持
    // 省略...
}

public struct AnchorDataModel: Timestampable {
    // 元のプロパティとイニシャライザを維持
    // 省略...
}

public struct InteractionDataModel: Timestampable {
    // 元のプロパティとイニシャライザを維持
    // 省略...
}
```

この設定により、それぞれのデータモデルは新しい`timestamp`プロパティを取得し、これにより`Google_Protobuf_Timestamp`オブジェクトが返されます：

```swift
let emotionData = EmotionDataModel(/* 省略... */)
let timestamp = emotionData.timestamp  // `Google_Protobuf_Timestamp`オブジェクト
```

このプロトコルと拡張機能を使用することで、UNIXタイムスタンプの変換機能をそれぞれのデータモデルで再利用できます。また、他の`timestampInMilliseconds`プロパティを持つ新しいデータモデルを追加する場合、単に`Timestampable`プロトコルを適用するだけでこの機能を使用できます。

---

## 👤 ユーザー
*2023/6/28 14:04:34*

「ミリ秒の」という意味をつけてほしい

---

## 🤖 アシスタント
*2023/6/28 14:04:44*

すみませんが、具体的な内容がわからないため再度質問内容を教えていただけますか？プロトコルの名称を`MillisecondsTimestampable`に変更する、あるいは他の何かを指しているのでしょうか？具体的な情報を提供いただければ幸いです。

---

## 👤 ユーザー
*2023/6/28 14:04:56*

まさにそうでprotocol名についてです。

---

## 🤖 アシスタント
*2023/6/28 14:05:18*

理解しました。それであれば、以下のようにプロトコルの名前を`MillisecondsTimestampable`に変更できます：

```swift
protocol MillisecondsTimestampable {
    var timestampInMilliseconds: Int { get }
}

extension MillisecondsTimestampable {
    var timestamp: Google_Protobuf_Timestamp {
        let timeIntervalSince1970 = TimeInterval(timestampInMilliseconds) / 1000.0
        return Google_Protobuf_Timestamp(timeIntervalSince1970: timeIntervalSince1970)
    }
}
```

そして、各データモデルは次のようにこの新しいプロトコルに準拠します：

```swift
public struct EmotionDataModel: MillisecondsTimestampable {
    // 以前のプロパティとイニシャライザを保持
    // 省略...
}

public struct AnchorDataModel: MillisecondsTimestampable {
    // 以前のプロパティとイニシャライザを保持
    // 省略...
}

public struct InteractionDataModel: MillisecondsTimestampable {
    // 以前のプロパティとイニシャライザを保持
    // 省略...
}
```

このようにすると、プロトコルの名前がより明確になり、それがミリ秒のタイムスタンプに関連していることが明確にわかるようになります。

---

## 👤 ユーザー
*2023/6/28 14:05:41*

var timestamp: Google\_Protobuf\_Timestamp {} もasGoogleProtobufTimestampにrenameしてほしい

---

## 🤖 アシスタント
*2023/6/28 14:06:00*

了解しました。それについては、以下のように変更できます：

```swift
protocol MillisecondsTimestampable {
    var timestampInMilliseconds: Int { get }
}

extension MillisecondsTimestampable {
    var asGoogleProtobufTimestamp: Google_Protobuf_Timestamp {
        let timeIntervalSince1970 = TimeInterval(timestampInMilliseconds) / 1000.0
        return Google_Protobuf_Timestamp(timeIntervalSince1970: timeIntervalSince1970)
    }
}
```

そして、各データモデルでこの新しいメソッドを使用できます：

```swift
let emotionData = EmotionDataModel(/* 省略... */)
let timestamp = emotionData.asGoogleProtobufTimestamp  // `Google_Protobuf_Timestamp`オブジェクト
```

このようにすると、メソッドの名前がその機能をより明確に反映し、`Google_Protobuf_Timestamp`オブジェクトへの変換を行っていることが明確になります。

---

## 👤 ユーザー
*2023/6/28 14:06:08*

MillisecondsTimestampable ももう少しいいのがないか候補をあげてほしい。

---

## 🤖 アシスタント
*2023/6/28 14:06:34*

プロトコル名は、そのプロトコルが何を保証するかをはっきりと示すべきです。タイムスタンプに関連するプロトコルであること、そしてそれがミリ秒単位であることを示す必要があります。以下にいくつかの提案を列挙します：

1. `MillisecondTimed`: プロトコルがミリ秒単位のタイムスタンプを持つことを強調します。ただし、'Timestampable'よりも少し一般的な印象を与えるかもしれません。

2. `TimestampedInMilliseconds`: 'Timestampable'と同様に、タイムスタンプが存在することを示しています。そして'InMilliseconds'がミリ秒単位であることを強調しています。

3. `HasMillisecondTimestamp`: プロトコルがミリ秒単位のタイムスタンプを持つことを示します。この名前は直感的でわかりやすいです。

4. `MillisecondTimestampProvider`: この名前はプロトコルがミリ秒単位のタイムスタンプを提供することを明確に示しています。

最終的な選択はプロトコルの使用方法とコードベースの他の部分との一貫性によるところが大きいです。希望のものがあれば選んでいただければと思います。

---
