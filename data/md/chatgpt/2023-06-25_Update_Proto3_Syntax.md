# Update Proto3 Syntax

Date: 2023-06-25

---

## 👤 User
*2023-06-26 02:46:06*

protoの定義が変わってしまったので、

syntax = "proto3";

import "google/protobuf/timestamp.proto";

message Anchor {
  // 作成日時
  google.protobuf.Timestamp timestamp = 1;
  // 
  optional int32 tracking_state = 2;
  // 目線のx座標
  optional double left = 3;
  // 目線のy座標
  optional double top = 4;
  // 眼球運動状態
  optional EyeMovementState eye_movement_state = 5;
  // 
  optional int32 screen_state = 6;
  // 目の開き度
  optional double eye_openness = 7;
  // 右目の瞬き
  optional bool blink_right = 8;
  // 左目の瞬き
  optional bool blink_left = 9;
  // 眠気度
  optional bool drowsiness = 10;
  // 注意度
  optional bool attention = 11;
}

enum EyeMovementState {
  FIXATION = 0;
  SACCADE = 1;
  UNKNOWN = 2;
}



extension Anchor {
    static var dummies: [Anchor] {
        [.dummyEyeMovement, .dummyBlink, .dummyEyeMovement]
    }

    static var dummyEyeMovement: Anchor {
        var anchor = Anchor()
        anchor.timestamp = Google_Protobuf_Timestamp(date: Date())
        var eyeMovement = EyeMovement()
        eyeMovement.left = 1.0
        eyeMovement.top = 1.0
        eyeMovement.eyeMovementState = .fixation
        anchor.eyeMovement = eyeMovement
        return anchor
    }

    static var dummyBlink: Anchor {
        var anchor = Anchor()
        anchor.timestamp = Google_Protobuf_Timestamp(date: Date())
        var blink = Blink()
        blink.blinkRight = true
        blink.blinkLeft = false
        anchor.blink = blink
        return anchor
    }
}

---

## 🤖 Assistant
*2023-06-26 02:46:49*

`proto3`では`optional`キーワードが廃止されているため、あなたのコードではこれを削除する必要があります。また、メッセージ内には直接フィールドとして設定するべきなので、`eyeMovement`や`blink`などのクラスは作成せず、フィールドを直接設定します。以下に修正したコードを示します。

```protobuf
syntax = "proto3";

import "google/protobuf/timestamp.proto";

message Anchor {
  // 作成日時
  google.protobuf.Timestamp timestamp = 1;
  // 
  int32 tracking_state = 2;
  // 目線のx座標
  double left = 3;
  // 目線のy座標
  double top = 4;
  // 眼球運動状態
  EyeMovementState eye_movement_state = 5;
  // 
  int32 screen_state = 6;
  // 目の開き度
  double eye_openness = 7;
  // 右目の瞬き
  bool blink_right = 8;
  // 左目の瞬き
  bool blink_left = 9;
  // 眠気度
  bool drowsiness = 10;
  // 注意度
  bool attention = 11;
}

enum EyeMovementState {
  FIXATION = 0;
  SACCADE = 1;
  UNKNOWN = 2;
}
```

そして、以下のようにSwiftを修正します。

```swift
extension Anchor {
    static var dummies: [Anchor] {
        [.dummyEyeMovement, .dummyBlink, .dummyEyeMovement]
    }

    static var dummyEyeMovement: Anchor {
        var anchor = Anchor()
        anchor.timestamp = Google_Protobuf_Timestamp(date: Date())
        anchor.left = 1.0
        anchor.top = 1.0
        anchor.eye_movement_state = .FIXATION
        return anchor
    }

    static var dummyBlink: Anchor {
        var anchor = Anchor()
        anchor.timestamp = Google_Protobuf_Timestamp(date: Date())
        anchor.blink_right = true
        anchor.blink_left = false
        return anchor
    }
}
```

上記のように修正すれば、`proto3`に対応した形式になります。ただし、これらの修正は仮定を基にしたもので、具体的な要件によってはさらなる調整が必要になるかもしれません。

---

## 👤 User
*2023-06-26 02:47:31*

enum がないのであれば、全部項目をひとつうめたstatic var dummy: Anchor { } を定義してほしい

---

## 🤖 Assistant
*2023-06-26 02:47:51*

それならば、以下のようにすべてのフィールドに何らかの値をセットしたダミーデータを作成できます。ただし、具体的な値はあなたのアプリケーションの要件に基づいて調整してください。

```swift
extension Anchor {
    static var dummy: Anchor {
        var anchor = Anchor()
        anchor.timestamp = Google_Protobuf_Timestamp(date: Date())
        anchor.tracking_state = 0
        anchor.left = 1.0
        anchor.top = 1.0
        anchor.screen_state = 0
        anchor.eye_openness = 0.5
        anchor.blink_right = false
        anchor.blink_left = false
        anchor.drowsiness = false
        anchor.attention = true
        return anchor
    }
}
```

この`dummy`プロパティは、全てのフィールドに値を設定したAnchorのインスタンスを返します。具体的な値は各フィールドのデータタイプと用途に基づいて調整してください。

---

## 👤 User
*2023-06-26 02:50:39*

以下についても同じようにdummyをつくってほしい

syntax = "proto3";

import "google/protobuf/any.proto";
import "google/protobuf/timestamp.proto";

message Interaction {
  google.protobuf.Timestamp timestamp = 1;
  string event_type = 2;
  map&lt;string, google.protobuf.Any&gt; parameters = 3;
}

message PageViewEvent {
  string url = 1;
  string title = 2;
  string referrer = 3;
}

message ClickEvent {
  string target = 1;
  double left = 2;
  double top = 3;
}

message ScrollEvent {
  string target = 1;
  double left = 2;
  double top = 3;
}

---

## 🤖 Assistant
*2023-06-26 02:51:22*

各メッセージに対してダミーデータを作成するためのSwiftのextensionを以下に示します。

```swift
import Google_Protobuf

extension Interaction {
    static var dummy: Interaction {
        var interaction = Interaction()
        interaction.timestamp = Google_Protobuf_Timestamp(date: Date())
        interaction.event_type = "dummy event"

        let pageViewEvent = PageViewEvent.dummy
        var anyPageViewEvent = Google_Protobuf_Any()
        try? anyPageViewEvent.unpackMessage(pageViewEvent)
        interaction.parameters["dummy page view"] = anyPageViewEvent

        let clickEvent = ClickEvent.dummy
        var anyClickEvent = Google_Protobuf_Any()
        try? anyClickEvent.unpackMessage(clickEvent)
        interaction.parameters["dummy click"] = anyClickEvent

        let scrollEvent = ScrollEvent.dummy
        var anyScrollEvent = Google_Protobuf_Any()
        try? anyScrollEvent.unpackMessage(scrollEvent)
        interaction.parameters["dummy scroll"] = anyScrollEvent

        return interaction
    }
}

extension PageViewEvent {
    static var dummy: PageViewEvent {
        var pageViewEvent = PageViewEvent()
        pageViewEvent.url = "http://dummy.com"
        pageViewEvent.title = "Dummy Title"
        pageViewEvent.referrer = "http://referrer.com"
        return pageViewEvent
    }
}

extension ClickEvent {
    static var dummy: ClickEvent {
        var clickEvent = ClickEvent()
        clickEvent.target = "dummy target"
        clickEvent.left = 0.0
        clickEvent.top = 0.0
        return clickEvent
    }
}

extension ScrollEvent {
    static var dummy: ScrollEvent {
        var scrollEvent = ScrollEvent()
        scrollEvent.target = "dummy target"
        scrollEvent.left = 0.0
        scrollEvent.top = 0.0
        return scrollEvent
    }
}
```

ここでは、Interaction メッセージのparameters マップに、各イベントを Google Protobuf Any メッセージとしてパックし、追加しています。

注意点として、これらのダミーデータは実際のデータに可能な限り近い形で作成されているべきです。以上の例ではあくまで参照用に仮の値を使用しています。あなたのアプリケーションに合わせて適切な値を設定してください。

また、エラーハンドリングを正しく行うためには、`try? anyPageViewEvent.unpackMessage(pageViewEvent)`などの行でエラーが発生した場合の処理も考慮すべきです。上記のコードではエラーハンドリングを省略してシンプルにしていますが、実際の使用においては適切なエラーハンドリングを行ってください。

---

## 👤 User
*2023-06-26 02:54:17*

import SwiftProtobuf はしているけど、import Google_Protobuf はやっていない。

そして、.unpackMessage(pageViewEvent)でエラーになってしまった。

---

## 🤖 Assistant
*2023-06-26 02:55:03*

すみません、誤解を招く記述がありました。SwiftProtobufでは、`Google_Protobuf_Any` メッセージに別のメッセージをパックするために `Message` プロトコルの `serializedData()` メソッドを使用し、`typeURL` を手動で設定します。以下のコードにそれを反映しています：

```swift
import SwiftProtobuf

extension Interaction {
    static var dummy: Interaction {
        var interaction = Interaction()
        interaction.timestamp = Google_Protobuf_Timestamp(date: Date())
        interaction.event_type = "dummy event"

        do {
            var anyPageViewEvent = Google_Protobuf_Any()
            anyPageViewEvent.typeURL = "/PageViewEvent"
            anyPageViewEvent.value = try PageViewEvent.dummy.serializedData()
            interaction.parameters["dummy page view"] = anyPageViewEvent

            var anyClickEvent = Google_Protobuf_Any()
            anyClickEvent.typeURL = "/ClickEvent"
            anyClickEvent.value = try ClickEvent.dummy.serializedData()
            interaction.parameters["dummy click"] = anyClickEvent

            var anyScrollEvent = Google_Protobuf_Any()
            anyScrollEvent.typeURL = "/ScrollEvent"
            anyScrollEvent.value = try ScrollEvent.dummy.serializedData()
            interaction.parameters["dummy scroll"] = anyScrollEvent
        } catch {
            print("Failed to serialize data")
        }

        return interaction
    }
}

extension PageViewEvent {
    static var dummy: PageViewEvent {
        var pageViewEvent = PageViewEvent()
        pageViewEvent.url = "http://dummy.com"
        pageViewEvent.title = "Dummy Title"
        pageViewEvent.referrer = "http://referrer.com"
        return pageViewEvent
    }
}

extension ClickEvent {
    static var dummy: ClickEvent {
        var clickEvent = ClickEvent()
        clickEvent.target = "dummy target"
        clickEvent.left = 0.0
        clickEvent.top = 0.0
        return clickEvent
    }
}

extension ScrollEvent {
    static var dummy: ScrollEvent {
        var scrollEvent = ScrollEvent()
        scrollEvent.target = "dummy target"
        scrollEvent.left = 0.0
        scrollEvent.top = 0.0
        return scrollEvent
    }
}
```

上記の例では、エラーハンドリングを行うために `do-catch` ブロックを使用しています。もしシリアライズに失敗した場合は、エラーメッセージを出力します。これは基本的なエラーハンドリングであり、具体的な要件によっては更に複雑なエラーハンドリングが必要になるかもしれません。

---

## 👤 User
*2023-06-26 02:57:36*

以下についても同様に対応して欲しい


syntax = "proto3";

import "google/protobuf/timestamp.proto";

enum ResultStatus {
  // 成功
  SUCCESS = 0;
  // 複数人物検出
  MULTI_FACES = 1;
  // 失敗
  FAILURE = 2;
}

message Emotions {
  // 作成日時
  google.protobuf.Timestamp timestamp = 1;
  // ステータス
  ResultStatus result_status = 2;
  // 中立
  optional double neutral = 3;
  // 喜び
  optional double happy = 4;
  // 悲しみ
  optional double sad = 5;
  // 怒り
  optional double angry = 6;
  // 驚き
  optional double surprised = 7;
  // 嫌悪
  optional double disgusted = 8;
  // 恐れ
  optional double fear = 9;
  // 
  optional double contempt = 10;
}

---

## 🤖 Assistant
*2023-06-26 02:58:16*

ご指摘の通り、`proto3`では`optional`キーワードは必要ありません。すべてのフィールドがデフォルトで`optional`となります。また、`enum`も修正が必要です。以下に修正したバージョンを示します。

```protobuf
syntax = "proto3";

import "google/protobuf/timestamp.proto";

enum ResultStatus {
  // 成功
  SUCCESS = 0;
  // 複数人物検出
  MULTI_FACES = 1;
  // 失敗
  FAILURE = 2;
}

message Emotions {
  // 作成日時
  google.protobuf.Timestamp timestamp = 1;
  // ステータス
  ResultStatus result_status = 2;
  // 中立
  double neutral = 3;
  // 喜び
  double happy = 4;
  // 悲しみ
  double sad = 5;
  // 怒り
  double angry = 6;
  // 驚き
  double surprised = 7;
  // 嫌悪
  double disgusted = 8;
  // 恐れ
  double fear = 9;
  // 
  double contempt = 10;
}
```

次に、`Emotions`メッセージのSwift拡張を作成します。ここでは全てのフィールドにデフォルト値を設定しています。具体的な値はあなたのアプリケーションの要件に基づいて調整してください。

```swift
import SwiftProtobuf

extension Emotions {
    static var dummy: Emotions {
        var emotions = Emotions()
        emotions.timestamp = Google_Protobuf_Timestamp(date: Date())
        emotions.result_status = .success
        emotions.neutral = 0.0
        emotions.happy = 0.0
        emotions.sad = 0.0
        emotions.angry = 0.0
        emotions.surprised = 0.0
        emotions.disgusted = 0.0
        emotions.fear = 0.0
        emotions.contempt = 0.0
        return emotions
    }
}
```
上記のコードは全てのフィールドを初期化するための`dummy`メソッドを作成しています。実際の値は用途により適宜設定してください。

---

## 👤 User
*2023-06-26 03:21:52*

クリーンアーキテクチャーを対応しようとしていて、DomainEmotionを作って欲しい

public struct DomainEmotion {
    public init() {}
}

---

## 🤖 Assistant
*2023-06-26 03:22:46*

クリーンアーキテクチャーにおいて、ドメインモデルはビジネスロジックを表現するためのものです。したがって、`DomainEmotion` はおそらく `Emotions` メッセージと同様のフィールドを持つことになります。しかし、ここで重要なのは、ドメインモデルは一般的にプロトコルバッファメッセージとは独立して定義され、その後で変換関数を用いて相互に変換されるべきであるという点です。

以下にその一例を示します。

```swift
public struct DomainEmotion {
    public var timestamp: Date
    public var resultStatus: ResultStatus
    public var neutral: Double
    public var happy: Double
    public var sad: Double
    public var angry: Double
    public var surprised: Double
    public var disgusted: Double
    public var fear: Double
    public var contempt: Double

    public init(
        timestamp: Date,
        resultStatus: ResultStatus,
        neutral: Double,
        happy: Double,
        sad: Double,
        angry: Double,
        surprised: Double,
        disgusted: Double,
        fear: Double,
        contempt: Double
    ) {
        self.timestamp = timestamp
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

public enum ResultStatus {
    case success
    case multiFaces
    case failure
}

extension DomainEmotion {
    init(from emotion: Emotions) {
        self.init(
            timestamp: emotion.timestamp.date,
            resultStatus: ResultStatus(rawValue: emotion.result_status.rawValue) ?? .failure,
            neutral: emotion.neutral,
            happy: emotion.happy,
            sad: emotion.sad,
            angry: emotion.angry,
            surprised: emotion.surprised,
            disgusted: emotion.disgusted,
            fear: emotion.fear,
            contempt: emotion.contempt
        )
    }

    func toEmotion() -> Emotions {
        var emotion = Emotions()
        emotion.timestamp = Google_Protobuf_Timestamp(date: self.timestamp)
        emotion.result_status = Emotions.ResultStatus(rawValue: self.resultStatus.rawValue) ?? .failure
        emotion.neutral = self.neutral
        emotion.happy = self.happy
        emotion.sad = self.sad
        emotion.angry = self.angry
        emotion.surprised = self.surprised
        emotion.disgusted = self.disgusted
        emotion.fear = self.fear
        emotion.contempt = self.contempt
        return emotion
    }
}
```

このコードでは、`DomainEmotion` 構造体と `Emotions` メッセージを相互に変換するための関数を定義しています。これにより、ドメイン層とプレゼンテーション層、またはデータアクセス層の間でデータを交換するときに、ビジネスロ

---

## 👤 User
*2023-06-26 04:04:55*

こんな感じのイニシャライザ作って欲しい

extension Anchor {
    init(from dataModel): AnchorDataModel) {
        
    }
}

---

## 🤖 Assistant
*2023-06-26 04:05:25*

指定された`AnchorDataModel`から`Anchor`を作成するためのイニシャライザを提供します。`AnchorDataModel`の内容によってこれを変更する必要があるかもしれませんが、以下に一例を示します：

```swift
extension Anchor {
    init(from dataModel: AnchorDataModel) {
        self.init()
        self.timestamp = Google_Protobuf_Timestamp(date: dataModel.timestamp)
        self.tracking_state = dataModel.trackingState
        self.left = dataModel.left
        self.top = dataModel.top
        self.eye_movement_state = EyeMovementState(rawValue: dataModel.eyeMovementState) ?? .unknown
        self.screen_state = dataModel.screenState
        self.eye_openness = dataModel.eyeOpenness
        self.blink_right = dataModel.blinkRight
        self.blink_left = dataModel.blinkLeft
        self.drowsiness = dataModel.drowsiness
        self.attention = dataModel.attention
    }
}
```

上記のコードは`AnchorDataModel`から`Anchor`を作成するためのイニシャライザを提供しています。`AnchorDataModel`はあなたが定義した型であると仮定していますが、実際にはあなたのプロジェクトで使用している具体的な型に応じてコードを修正する必要があります。

`AnchorDataModel`には、`Anchor`メッセージと同等のすべてのフィールドが含まれていると仮定しています。それぞれのフィールド名はキャメルケースに変換され、`EyeMovementState`型は整数からenumに変換されています。この変換はデフォルトの`UNKNOWN`値を使用してエラーハンドリングを行います。

---

## 👤 User
*2023-06-26 04:06:57*

extension Emotions {
    init(from dataModel: EmotionDataModel) {
        
    }
}

---

## 🤖 Assistant
*2023-06-26 04:07:27*

`EmotionDataModel`から`Emotions`を作成するためのイニシャライザは次のようになります。`EmotionDataModel`の具体的な構造やフィールドにより、このコードを調整する必要があります：

```swift
extension Emotions {
    init(from dataModel: EmotionDataModel) {
        self.init()
        self.timestamp = Google_Protobuf_Timestamp(date: dataModel.timestamp)
        self.result_status = ResultStatus(rawValue: dataModel.resultStatus) ?? .failure
        self.neutral = dataModel.neutral
        self.happy = dataModel.happy
        self.sad = dataModel.sad
        self.angry = dataModel.angry
        self.surprised = dataModel.surprised
        self.disgusted = dataModel.disgusted
        self.fear = dataModel.fear
        self.contempt = dataModel.contempt
    }
}
```

上記のコードは、`EmotionDataModel`から`Emotions`を作成するためのイニシャライザを提供しています。`EmotionDataModel`はあなたが定義した型であると仮定していますが、実際にはあなたのプロジェクトで使用している具体的な型に応じてコードを修正する必要があります。

このコードでは、`EmotionDataModel`に含まれる各フィールドが`Emotions`メッセージの対応するフィールドにマッピングされています。なお、`ResultStatus`の変換はデフォルトの`FAILURE`値を使用してエラーハンドリングを行っています。

---

## 👤 User
*2023-06-26 04:07:30*

AnchorDataModel を定義してほしい。

---

## 🤖 Assistant
*2023-06-26 04:08:00*

以下に、`AnchorDataModel`の例を示します。各フィールドは対応する `Anchor` のプロパティに一致します。ただし、一部の型（特に `Date` や enum）は、Swift が直接扱いやすい型に変更されています。

```swift
public struct AnchorDataModel {
    public var timestamp: Date
    public var trackingState: Int32
    public var left: Double
    public var top: Double
    public var eyeMovementState: EyeMovementState
    public var screenState: Int32
    public var eyeOpenness: Double
    public var blinkRight: Bool
    public var blinkLeft: Bool
    public var drowsiness: Bool
    public var attention: Bool

    public init(
        timestamp: Date,
        trackingState: Int32,
        left: Double,
        top: Double,
        eyeMovementState: EyeMovementState,
        screenState: Int32,
        eyeOpenness: Double,
        blinkRight: Bool,
        blinkLeft: Bool,
        drowsiness: Bool,
        attention: Bool
    ) {
        self.timestamp = timestamp
        self.trackingState = trackingState
        self.left = left
        self.top = top
        self.eyeMovementState = eyeMovementState
        self.screenState = screenState
        self.eyeOpenness = eyeOpenness
        self.blinkRight = blinkRight
        self.blinkLeft = blinkLeft
        self.drowsiness = drowsiness
        self.attention = attention
    }
}

public enum EyeMovementState: Int32 {
    case fixation = 0
    case saccade = 1
    case unknown = 2
}
```

このコードは、`Anchor`プロトコルバッファのメッセージと同じフィールドを持つ`AnchorDataModel`を定義しています。`EyeMovementState` enumは Swiftの enumに変換され、対応する整数値を持つようになっています。

---

## 👤 User
*2023-06-26 04:14:02*

EyeMovementState や ResultStatus の init(from) をつくってほしい

public enum AnchorDataModelEyeMovementState {
    case fixation
    case saccade
    case unknown
}
public enum EmotionDataModelResultStatus {
    case success
    case multiFaces
    case failure
}

---

## 🤖 Assistant
*2023-06-26 04:14:25*

あなたが要求したように、`AnchorDataModelEyeMovementState`と`EmotionDataModelResultStatus`のそれぞれから対応するProtocol BuffersのEnumを生成するためのイニシャライザを作成します。以下に示すように、このイニシャライザは`Anchor.EyeMovementState`と`Emotions.ResultStatus`に対応する値を生成します。

```swift
extension Anchor.EyeMovementState {
    init(from state: AnchorDataModelEyeMovementState) {
        switch state {
        case .fixation:
            self = .fixation
        case .saccade:
            self = .saccade
        case .unknown:
            self = .unknown
        }
    }
}

extension Emotions.ResultStatus {
    init(from status: EmotionDataModelResultStatus) {
        switch status {
        case .success:
            self = .success
        case .multiFaces:
            self = .multiFaces
        case .failure:
            self = .failure
        }
    }
}
```

これにより、Data Model層のenum値をDomain Modelのenum値に変換するためのイニシャライザが提供されます。これにより、プロジェクト全体で一貫性を保つことができ、Data Model層とDomain Model層の間で簡単にマッピングを行うことができます。

---

## 👤 User
*2023-06-26 04:24:59*

AnchorDataModel の left や top をオプショナルにしたら、swiftProtobufで生成されたコードがオプショナルではなかった。どうすればいい？

---

## 🤖 Assistant
*2023-06-26 04:25:40*

SwiftProtobufで生成されたコードでは、基本的に型が`optional`とマークされていても、それが実際に`nil`を持つことができるわけではありません。これは、GoogleのProtobuf 3仕様に基づいています。これは、Proto2では存在したオプショナルフィールドがProto3では廃止され、すべてのフィールドが「オプショナル」であると見なされるためです。

したがって、`optional`キーワードはProto3では無視され、それによってフィールドが`nil`を持つことができるわけではありません。代わりに、フィールドが設定されていない場合、それぞれの型の「ゼロ値」（例えば、数値型では0、ブール型ではfalse）が使用されます。

Swiftでオプショナルを扱うための一般的な方法は、特定の値（通常はその型の範囲外の値）を「存在しない」を表す値として使用することです。たとえば、`Double`型のフィールドに対しては、特定の値（`Double.nan`など）を「存在しない」を表す値として使用できます。

もしくは、オプショナルのように振る舞うカスタムラッパーを作成することもできます。例えば、以下のように定義できます：

```swift
struct OptionalDouble {
  var value: Double = Double.nan
  var isPresent: Bool {
    !value.isNaN
  }
}
```

この`OptionalDouble`型は、`Double`をラップし、`value`が`NaN`でない場合にのみ値が存在することを示します。

ただし、これらのソリューションは完全なオプショナルの振る舞いをエミュレートするものではなく、あくまでワークアラウンドです。もし完全なオプショナルのサポートが必要な場合、Protocol Buffers v2を使用するか、別のシリアライゼーション/デシリアライゼーションライブラリを検討することをおすすめします。

---

## 👤 User
*2023-06-26 04:26:52*

AnchorDataModel を例に使い方を教えて欲しい

---

## 🤖 Assistant
*2023-06-26 04:27:48*

アプリケーションの使用シナリオによりますが、以下は一般的な使用方法の一例です。この例では、左目と右目の座標が存在するかどうかを判断するために `OptionalDouble` ラッパーを使用しています。

```swift
public struct OptionalDouble {
  var value: Double = Double.nan
  var isPresent: Bool {
    !value.isNaN
  }
}

public struct AnchorDataModel {
    public var timestamp: Date
    public var trackingState: Int32
    public var left: OptionalDouble
    public var top: OptionalDouble
    public var eyeMovementState: AnchorDataModelEyeMovementState
    public var screenState: Int32
    public var eyeOpenness: Double
    public var blinkRight: Bool
    public var blinkLeft: Bool
    public var drowsiness: Bool
    public var attention: Bool

    public init(
        timestamp: Date,
        trackingState: Int32,
        left: OptionalDouble,
        top: OptionalDouble,
        eyeMovementState: AnchorDataModelEyeMovementState,
        screenState: Int32,
        eyeOpenness: Double,
        blinkRight: Bool,
        blinkLeft: Bool,
        drowsiness: Bool,
        attention: Bool
    ) {
        self.timestamp = timestamp
        self.trackingState = trackingState
        self.left = left
        self.top = top
        self.eyeMovementState = eyeMovementState
        self.screenState = screenState
        self.eyeOpenness = eyeOpenness
        self.blinkRight = blinkRight
        self.blinkLeft = blinkLeft
        self.drowsiness = drowsiness
        self.attention = attention
    }
}
```

そして、`Anchor` から `AnchorDataModel` を生成するためのイニシャライザを `Anchor` クラスに追加できます：

```swift
extension Anchor {
    init(from dataModel: AnchorDataModel) {
        self.init()
        self.timestamp = Google_Protobuf_Timestamp(date: dataModel.timestamp)
        self.tracking_state = dataModel.trackingState
        self.left = dataModel.left.isPresent ? dataModel.left.value : 0
        self.top = dataModel.top.isPresent ? dataModel.top.value : 0
        self.eye_movement_state = Anchor.EyeMovementState(from: dataModel.eyeMovementState)
        self.screen_state = dataModel.screenState
        self.eye_openness = dataModel.eyeOpenness
        self.blink_right = dataModel.blinkRight
        self.blink_left = dataModel.blinkLeft
        self.drowsiness = dataModel.drowsiness
        self.attention = dataModel.attention
    }
}
```

このようにして、オプショナルな座標 `left` と `top` を扱うことができます。`left` または `top` が存在しない場合、デフォルトの `0` が設定されます。これはプロトコルバッファの特性から来ています。また、`AnchorDataModelEyeMovementState`から`Anchor.EyeMovementState`への変換も行います。

ただし、このアプローチは、`left` と `top` が実際に `0` となる場合には問題が

---

## 🤖 Assistant
*2023-06-26 04:27:59*

生じます。この問題を解決するためには、プロトコルバッファ v2 を使用するか、または別の手段を考える必要があります。

---

## 👤 User
*2023-06-26 04:28:10*

left と top が実際に 0 となる場合があります。

---

## 🤖 Assistant
*2023-06-26 04:29:37*

その場合、`left`と`top`の値が`0`なのか、それとも存在しない（未設定）のかを判別するための代替手段を設ける必要があります。

より良い解決策として、無効値を示すための専用のフラグを使用することがあります。以下に、そのための新しい`AnchorDataModel`の定義を示します：

```swift
public struct AnchorDataModel {
    public var timestamp: Date
    public var trackingState: Int32
    public var left: Double
    public var isLeftSet: Bool
    public var top: Double
    public var isTopSet: Bool
    public var eyeMovementState: AnchorDataModelEyeMovementState
    public var screenState: Int32
    public var eyeOpenness: Double
    public var blinkRight: Bool
    public var blinkLeft: Bool
    public var drowsiness: Bool
    public var attention: Bool

    public init(
        timestamp: Date,
        trackingState: Int32,
        left: Double,
        isLeftSet: Bool,
        top: Double,
        isTopSet: Bool,
        eyeMovementState: AnchorDataModelEyeMovementState,
        screenState: Int32,
        eyeOpenness: Double,
        blinkRight: Bool,
        blinkLeft: Bool,
        drowsiness: Bool,
        attention: Bool
    ) {
        self.timestamp = timestamp
        self.trackingState = trackingState
        self.left = left
        self.isLeftSet = isLeftSet
        self.top = top
        self.isTopSet = isTopSet
        self.eyeMovementState = eyeMovementState
        self.screenState = screenState
        self.eyeOpenness = eyeOpenness
        self.blinkRight = blinkRight
        self.blinkLeft = blinkLeft
        self.drowsiness = drowsiness
        self.attention = attention
    }
}
```

そして、`Anchor`から`AnchorDataModel`を生成するためのイニシャライザを`Anchor`クラスに追加します：

```swift
extension Anchor {
    init(from dataModel: AnchorDataModel) {
        self.init()
        self.timestamp = Google_Protobuf_Timestamp(date: dataModel.timestamp)
        self.tracking_state = dataModel.trackingState
        self.left = dataModel.isLeftSet ? dataModel.left : 0
        self.top = dataModel.isTopSet ? dataModel.top : 0
        self.eye_movement_state = Anchor.EyeMovementState(from: dataModel.eyeMovementState)
        self.screen_state = dataModel.screenState
        self.eye_openness = dataModel.eyeOpenness
        self.blink_right = dataModel.blinkRight
        self.blink_left = dataModel.blinkLeft
        self.drowsiness = dataModel.drowsiness
        self.attention = dataModel.attention
    }
}
```

これで、`left`と`top`の座標が存在しない場合と、`left`と`top`が実際に0である場合を区別できます。このように、`isLeftSet`と`isTopSet`の2つのフラグは、対応する座標が設定されているかどうかを

---

## 👤 User
*2023-06-26 04:29:59*

Double.nan を代入したらまずいかな？

---

## 🤖 Assistant
*2023-06-26 04:30:35*

`Double.nan`（Not a Number）を利用すると、プロパティがセットされていないことを示すことができます。ただし、プロトコルバッファの中で`NaN`値を送信すると、一部のプロトコル（特にJSON）では問題が発生する可能性があります。したがって、`NaN`は注意深く使用する必要があります。

また、`NaN`を比較する際には、常に`false`を返す特性があるため、比較演算子(`==`, `!=`)ではなく、特殊な関数(`isNaN`)を使用しなければなりません。

したがって、`Double.nan`を使用してプロパティがセットされていないことを示す方法もありますが、その場合でも対応するロジックが必要になります。例えば：

```swift
public struct AnchorDataModel {
    // ...
    public var left: Double
    public var top: Double
    // ...

    public var isLeftSet: Bool {
        return !left.isNaN
    }

    public var isTopSet: Bool {
        return !top.isNaN
    }

    // ...
}

// Usage:
let model = AnchorDataModel(/* ... */)
if model.isLeftSet {
    print("Left is set with value: \(model.left)")
} else {
    print("Left is not set.")
}
```

この方法なら、`left`や`top`がセットされていない場合に`NaN`を返し、セットされているかどうかを確認するためのプロパティも提供します。ただし、`Double.nan`という特殊な値を理解し、適切に扱えるようになるまでには、一定の学習コストがかかることは理解しておくべきです。

---

## 👤 User
*2023-06-26 07:04:35*

以下の条件のときにPredictEmotionResultのextensionとして、[EmotionDataModel]を返す、コンピューテッドプロパティーを書いて欲しい

private extension PredictEmotionResult {
    
}

public struct EmotionDataModel {
    public enum ResultStatus {
        case success
        case multiFaces
        case failure
    }

    public let timestamp: Date
    public let resultStatus: ResultStatus
    public let neutral: Double?
    public let happy: Double?
    public let sad: Double?
    public let angry: Double?
    public let surprised: Double?
    public let disgusted: Double?
    public let fear: Double?
    public let contempt: Double?

    public init(timestamp: Date, resultStatus: ResultStatus, neutral: Double?, happy: Double?, sad: Double?, angry: Double?, surprised: Double?, disgusted: Double?, fear: Double?, contempt: Double?) {
        self.timestamp = timestamp
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
public enum EmotionDataModelConverter {
    public static func convertToEmotionDataModel(imageItem: ImageItem) throws -&gt; EmotionDataModel {
        EmotionDataModel(
            timestamp: imageItem.timestamp.asDateFromMilliseconds,
            resultStatus: .success, // TODO: 変える
            neutral: imageItem.emotionConfidence(for: .neutral),
            happy: imageItem.emotionConfidence(for: .happy),
            sad: imageItem.emotionConfidence(for: .sad),
            angry: imageItem.emotionConfidence(for: .anger),
            surprised: imageItem.emotionConfidence(for: .surprise),
            disgusted: imageItem.emotionConfidence(for: .disgust),
            fear: imageItem.emotionConfidence(for: .fear),
            contempt: imageItem.emotionConfidence(for: .contempt)
        )
    }
    
    public static func convertToEmotionDataModel(predictEmotionResult: PredictEmotionResult) throws -&gt; [EmotionDataModel] {
        predictEmotionResult.imageItem.map { imageItem in
            EmotionDataModel(
                timestamp: predictEmotionResult.timestamp,
                resultStatus: EmotionDataModel.ResultStatus(imageItemCount: predictEmotionResult.imageItem.count),
                neutral: imageItem.emotionConfidence(for: .neutral),
                happy: imageItem.emotionConfidence(for: .happy),
                sad: imageItem.emotionConfidence(for: .sad),
                angry: imageItem.emotionConfidence(for: .anger),
                surprised: imageItem.emotionConfidence(for: .surprise),
                disgusted: imageItem.emotionConfidence(for: .disgust),
                fear: imageItem.emotionConfidence(for: .fear),
                contempt: imageItem.emotionConfidence(for: .contempt)
            )
        }
    }
}

private extension ImageItem {
    func emotionConfidence(for emotion: EmotionType) -&gt; Double? {
        self.emotionPredictResults.first(where: { $0.emotion == emotion })?.confidence.asDouble
    }
}


public struct PredictEmotionResult {
    public let id: String = UUID().uuidString
    public let timestamp: Date
    public let imageItem: [ImageItem]
    
    public init(timestamp: Date, imageItem: [ImageItem]) {
        self.timestamp = timestamp
        self.imageItem = imageItem
    }
}

---

## 🤖 Assistant
*2023-06-26 07:05:09*

以下に`PredictEmotionResult`に`EmotionDataModel`の配列を返すコンピューテッドプロパティを追加します：

```swift
public extension PredictEmotionResult {
    var emotionDataModels: [EmotionDataModel] {
        return try! imageItem.map { imageItem in
            try! EmotionDataModelConverter.convertToEmotionDataModel(imageItem: imageItem)
        }
    }
}
```

このコードは、各`imageItem`を`EmotionDataModel`に変換します。このプロパティは失敗しないことを保証するために`try!`を使用しています。しかし、`convertToEmotionDataModel`がエラーをスローする可能性がある場合、あるいは`imageItem`の配列が空でないことを確認する必要がある場合は、このコードを適宜調整する必要があります。

なお、`EmotionDataModelConverter.convertToEmotionDataModel(imageItem: imageItem)`メソッドがエラーを投げる可能性がある場合、安全なコードとするためには以下のように書き換えることを推奨します：

```swift
public extension PredictEmotionResult {
    var emotionDataModels: [EmotionDataModel]? {
        return try? imageItem.compactMap { imageItem in
            try EmotionDataModelConverter.convertToEmotionDataModel(imageItem: imageItem)
        }
    }
}
```

これにより、`emotionDataModels`がnilを返す可能性があることを明示的に示します。この変更を行うことで、呼び出し側は適切なエラーハンドリングを行うことが可能となります。

---

## 👤 User
*2023-06-26 07:05:17*

convertToEmotionDataModel は使ってほしくない

---

## 🤖 Assistant
*2023-06-26 07:05:50*

もし、`convertToEmotionDataModel`を使わずに`PredictEmotionResult`から`EmotionDataModel`の配列を作りたい場合、以下のようにコンピューテッドプロパティを定義することができます：

```swift
public extension PredictEmotionResult {
    var emotionDataModels: [EmotionDataModel] {
        return imageItem.map { item in
            EmotionDataModel(
                timestamp: item.timestamp.asDateFromMilliseconds,
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
```

これは各`ImageItem`を`EmotionDataModel`に変換しています。`EmotionDataModel`のインスタンスは各`ImageItem`の属性に基づいて作成されます。

ただし、元の`EmotionDataModelConverter.convertToEmotionDataModel(imageItem: ImageItem)`関数に存在したロジックが他の場所に分散する可能性があるので、注意が必要です。コードの重複を避けるために、`convertToEmotionDataModel(imageItem: ImageItem)`関数で使用されていたロジックを可能な限り`EmotionDataModel`や`ImageItem`のメソッドやプロパティにカプセル化することを推奨します。

---

## 👤 User
*2023-06-26 07:15:21*

[EmotionDataModel] の initとして、PredictEmotionResultを引数に取るようにはできないの

---

## 🤖 Assistant
*2023-06-26 07:15:51*

もちろん、それは可能です。次のように`EmotionDataModel`の配列（`[EmotionDataModel]`）のイニシャライザを定義することができます：

```swift
public extension Array where Element == EmotionDataModel {
    init(from predictEmotionResult: PredictEmotionResult) {
        self = predictEmotionResult.imageItem.map { item in
            EmotionDataModel(
                timestamp: item.timestamp.asDateFromMilliseconds,
                resultStatus: EmotionDataModel.ResultStatus(imageItemCount: predictEmotionResult.imageItem.count),
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
```

この新しいイニシャライザを使用すると、`PredictEmotionResult`型のインスタンスから直接`EmotionDataModel`の配列を作成できます。例えば：

```swift
let predictEmotionResult: PredictEmotionResult = // ... 何らかの方法でPredictEmotionResultを取得する
let emotionDataModels: [EmotionDataModel] = Array(from: predictEmotionResult)
```

ただし、この方法は`Array`型のextensionとして`init(from:)`メソッドを定義しますので、他の場所でも`Array`が`init(from:)`イニシャライザを持つことに注意してください。それが望ましくない場合は、`EmotionDataModel`自体に`init(from:)`メソッドを定義することも可能ですが、その場合はイニシャライザが一つの`EmotionDataModel`インスタンスを返すため、適切なマッピングを行う必要があります。

---

## 👤 User
*2023-06-26 16:03:45*

この辺のinit(from)なんだけどnilの場合にデフォルト値を入れているところは値をセットしないように修正して欲しい。

extension Anchor {
    init(from dataModel: AnchorDataModel) {
        self.init()
        timestamp = Google_Protobuf_Timestamp(date: dataModel.timestamp)
        trackingState = Int32(dataModel.trackingState ?? 0)
        `left` = dataModel.left ?? 0
        top = dataModel.top ?? 0
        eyeMovementState = EyeMovementState(from: dataModel.eyeMovementState)
        screenState = Int32(dataModel.screenState ?? 0)
        eyeOpenness = dataModel.eyeOpenness ?? 0
        blinkRight = dataModel.blinkRight
        blinkLeft = dataModel.blinkLeft
        drowsiness = dataModel.drowsiness
        attention = dataModel.attention
    }
}

extension EyeMovementState {
    init(from state: AnchorDataModel.EyeMovementState) {
        switch state {
        case .fixation:
            self = .fixation
        case .saccade:
            self = .saccade
        case .unknown:
            self = .unknown
        }
    }
}

extension Emotions {
    init(from dataModel: EmotionDataModel) {
        self.init()
        timestamp = Google_Protobuf_Timestamp(date: dataModel.timestamp)
        resultStatus = ResultStatus(from: dataModel.resultStatus)
        neutral = dataModel.neutral ?? 0
        happy = dataModel.happy ?? 0
        sad = dataModel.sad ?? 0
        angry = dataModel.angry ?? 0
        surprised = dataModel.surprised ?? 0
        disgusted = dataModel.disgusted ?? 0
        fear = dataModel.fear ?? 0
        contempt = dataModel.contempt ?? 0
    }
}

extension ResultStatus {
    init(from status: EmotionDataModel.ResultStatus) {
        switch status {
        case .success:
            self = .success
        case .multiFaces:
            self = .multiFaces
        case .failure:
            self = .failure
        }
    }
}

extension Interaction {
    init(from _: InteractionDataModel) {
        // TODO: Webイベントの処理が出来上がってから対応する
        self.init()
    }
}

---

## 🤖 Assistant
*2023-06-26 16:04:35*

了解しました。Optionalなプロパティについては、nilチェックを行い、nilの場合は値をセットしないように修正します。以下のように修正します：

```swift
extension Anchor {
    init(from dataModel: AnchorDataModel) {
        self.init()
        timestamp = Google_Protobuf_Timestamp(date: dataModel.timestamp)
        if let trackingState = dataModel.trackingState {
            self.trackingState = Int32(trackingState)
        }
        if let left = dataModel.left {
            self.left = left
        }
        if let top = dataModel.top {
            self.top = top
        }
        eyeMovementState = EyeMovementState(from: dataModel.eyeMovementState)
        if let screenState = dataModel.screenState {
            self.screenState = Int32(screenState)
        }
        if let eyeOpenness = dataModel.eyeOpenness {
            self.eyeOpenness = eyeOpenness
        }
        blinkRight = dataModel.blinkRight
        blinkLeft = dataModel.blinkLeft
        drowsiness = dataModel.drowsiness
        attention = dataModel.attention
    }
}

extension Emotions {
    init(from dataModel: EmotionDataModel) {
        self.init()
        timestamp = Google_Protobuf_Timestamp(date: dataModel.timestamp)
        resultStatus = ResultStatus(from: dataModel.resultStatus)
        if let neutral = dataModel.neutral {
            self.neutral = neutral
        }
        if let happy = dataModel.happy {
            self.happy = happy
        }
        if let sad = dataModel.sad {
            self.sad = sad
        }
        if let angry = dataModel.angry {
            self.angry = angry
        }
        if let surprised = dataModel.surprised {
            self.surprised = surprised
        }
        if let disgusted = dataModel.disgusted {
            self.disgusted = disgusted
        }
        if let fear = dataModel.fear {
            self.fear = fear
        }
        if let contempt = dataModel.contempt {
            self.contempt = contempt
        }
    }
}
```

この修正により、nilの場合は値をセットしないようになります。これらの変更はデフォルト値（0など）をセットするのではなく、オプショナルの値がnilである場合には該当のプロパティを設定しないようにすることを意図しています。ただし、注意すべきは、これによりprotobufのデフォルト値（数値型の場合は通常0）が適用されることです。

---

## 👤 User
*2023-06-26 16:05:28*

定義を見るとnilはnilで表現されているような気がします。

// DO NOT EDIT.
// swift-format-ignore-file
//
// Generated by the Swift generator plugin for the protocol buffer compiler.
// Source: emotions.proto
//
// For information on using the generated types, please see the documentation:
//   https://github.com/apple/swift-protobuf/

import Foundation
import SwiftProtobuf

// If the compiler emits an error on this type, it is because this file
// was generated by a version of the `protoc` Swift plug-in that is
// incompatible with the version of SwiftProtobuf to which you are linking.
// Please ensure that you are building against the same version of the API
// that was used to generate this file.
private struct _GeneratedWithProtocGenSwiftVersion: SwiftProtobuf.ProtobufAPIVersionCheck {
    struct _2: SwiftProtobuf.ProtobufAPIVersion_2 {}
    typealias Version = _2
}

enum ResultStatus: SwiftProtobuf.Enum {
    typealias RawValue = Int

    /// 成功
    case success // = 0

    /// 複数人物検出
    case multiFaces // = 1

    /// 失敗
    case failure // = 2
    case UNRECOGNIZED(Int)

    init() {
        self = .success
    }

    init?(rawValue: Int) {
        switch rawValue {
        case 0: self = .success
        case 1: self = .multiFaces
        case 2: self = .failure
        default: self = .UNRECOGNIZED(rawValue)
        }
    }

    var rawValue: Int {
        switch self {
        case .success: return 0
        case .multiFaces: return 1
        case .failure: return 2
        case .UNRECOGNIZED(let i): return i
        }
    }
}

#if swift(&gt;=4.2)

    extension ResultStatus: CaseIterable {
        // The compiler won't synthesize support with the UNRECOGNIZED case.
        static var allCases: [ResultStatus] = [
            .success,
            .multiFaces,
            .failure,
        ]
    }

#endif // swift(&gt;=4.2)

struct Emotions {
    // SwiftProtobuf.Message conformance is added in an extension below. See the
    // `Message` and `Message+*Additions` files in the SwiftProtobuf library for
    // methods supported on all messages.

    /// 作成日時
    var timestamp: SwiftProtobuf.Google_Protobuf_Timestamp {
        get { _timestamp ?? SwiftProtobuf.Google_Protobuf_Timestamp() }
        set { _timestamp = newValue }
    }

    /// Returns true if `timestamp` has been explicitly set.
    var hasTimestamp: Bool { _timestamp != nil }
    /// Clears the value of `timestamp`. Subsequent reads from it will return its default value.
    mutating func clearTimestamp() { _timestamp = nil }

    /// ステータス
    var resultStatus: ResultStatus = .success

    /// 中立
    var neutral: Double {
        get { _neutral ?? 0 }
        set { _neutral = newValue }
    }

    /// Returns true if `neutral` has been explicitly set.
    var hasNeutral: Bool { _neutral != nil }
    /// Clears the value of `neutral`. Subsequent reads from it will return its default value.
    mutating func clearNeutral() { _neutral = nil }

    /// 喜び
    var happy: Double {
        get { _happy ?? 0 }
        set { _happy = newValue }
    }

    /// Returns true if `happy` has been explicitly set.
    var hasHappy: Bool { _happy != nil }
    /// Clears the value of `happy`. Subsequent reads from it will return its default value.
    mutating func clearHappy() { _happy = nil }

    /// 悲しみ
    var sad: Double {
        get { _sad ?? 0 }
        set { _sad = newValue }
    }

    /// Returns true if `sad` has been explicitly set.
    var hasSad: Bool { _sad != nil }
    /// Clears the value of `sad`. Subsequent reads from it will return its default value.
    mutating func clearSad() { _sad = nil }

    /// 怒り
    var angry: Double {
        get { _angry ?? 0 }
        set { _angry = newValue }
    }

    /// Returns true if `angry` has been explicitly set.
    var hasAngry: Bool { _angry != nil }
    /// Clears the value of `angry`. Subsequent reads from it will return its default value.
    mutating func clearAngry() { _angry = nil }

    /// 驚き
    var surprised: Double {
        get { _surprised ?? 0 }
        set { _surprised = newValue }
    }

    /// Returns true if `surprised` has been explicitly set.
    var hasSurprised: Bool { _surprised != nil }
    /// Clears the value of `surprised`. Subsequent reads from it will return its default value.
    mutating func clearSurprised() { _surprised = nil }

    /// 嫌悪
    var disgusted: Double {
        get { _disgusted ?? 0 }
        set { _disgusted = newValue }
    }

    /// Returns true if `disgusted` has been explicitly set.
    var hasDisgusted: Bool { _disgusted != nil }
    /// Clears the value of `disgusted`. Subsequent reads from it will return its default value.
    mutating func clearDisgusted() { _disgusted = nil }

    /// 恐れ
    var fear: Double {
        get { _fear ?? 0 }
        set { _fear = newValue }
    }

    /// Returns true if `fear` has been explicitly set.
    var hasFear: Bool { _fear != nil }
    /// Clears the value of `fear`. Subsequent reads from it will return its default value.
    mutating func clearFear() { _fear = nil }

    var contempt: Double {
        get { _contempt ?? 0 }
        set { _contempt = newValue }
    }

    /// Returns true if `contempt` has been explicitly set.
    var hasContempt: Bool { _contempt != nil }
    /// Clears the value of `contempt`. Subsequent reads from it will return its default value.
    mutating func clearContempt() { _contempt = nil }

    var unknownFields = SwiftProtobuf.UnknownStorage()

    init() {}

    private var _timestamp: SwiftProtobuf.Google_Protobuf_Timestamp?
    private var _neutral: Double?
    private var _happy: Double?
    private var _sad: Double?
    private var _angry: Double?
    private var _surprised: Double?
    private var _disgusted: Double?
    private var _fear: Double?
    private var _contempt: Double?
}

#if swift(&gt;=5.5) && canImport(_Concurrency)
    extension ResultStatus: @unchecked Sendable {}
    extension Emotions: @unchecked Sendable {}
#endif // swift(&gt;=5.5) && canImport(_Concurrency)

// MARK: - Code below here is support for the SwiftProtobuf runtime.

extension ResultStatus: SwiftProtobuf._ProtoNameProviding {
    static let _protobuf_nameMap: SwiftProtobuf._NameMap = [
        0: .same(proto: "SUCCESS"),
        1: .same(proto: "MULTI_FACES"),
        2: .same(proto: "FAILURE"),
    ]
}

extension Emotions: SwiftProtobuf.Message, SwiftProtobuf._MessageImplementationBase, SwiftProtobuf._ProtoNameProviding {
    static let protoMessageName: String = "Emotions"
    static let _protobuf_nameMap: SwiftProtobuf._NameMap = [
        1: .same(proto: "timestamp"),
        2: .standard(proto: "result_status"),
        3: .same(proto: "neutral"),
        4: .same(proto: "happy"),
        5: .same(proto: "sad"),
        6: .same(proto: "angry"),
        7: .same(proto: "surprised"),
        8: .same(proto: "disgusted"),
        9: .same(proto: "fear"),
        10: .same(proto: "contempt"),
    ]

    mutating func decodeMessage(decoder: inout some SwiftProtobuf.Decoder) throws {
        while let fieldNumber = try decoder.nextFieldNumber() {
            // The use of inline closures is to circumvent an issue where the compiler
            // allocates stack space for every case branch when no optimizations are
            // enabled. https://github.com/apple/swift-protobuf/issues/1034
            switch fieldNumber {
            case 1: try try decoder.decodeSingularMessageField(value: &_timestamp)
            case 2: try try decoder.decodeSingularEnumField(value: &resultStatus)
            case 3: try try decoder.decodeSingularDoubleField(value: &_neutral)
            case 4: try try decoder.decodeSingularDoubleField(value: &_happy)
            case 5: try try decoder.decodeSingularDoubleField(value: &_sad)
            case 6: try try decoder.decodeSingularDoubleField(value: &_angry)
            case 7: try try decoder.decodeSingularDoubleField(value: &_surprised)
            case 8: try try decoder.decodeSingularDoubleField(value: &_disgusted)
            case 9: try try decoder.decodeSingularDoubleField(value: &_fear)
            case 10: try try decoder.decodeSingularDoubleField(value: &_contempt)
            default: break
            }
        }
    }

    func traverse(visitor: inout some SwiftProtobuf.Visitor) throws {
        // The use of inline closures is to circumvent an issue where the compiler
        // allocates stack space for every if/case branch local when no optimizations
        // are enabled. https://github.com/apple/swift-protobuf/issues/1034 and
        // https://github.com/apple/swift-protobuf/issues/1182
        try { if let v = self._timestamp {
            try visitor.visitSingularMessageField(value: v, fieldNumber: 1)
        } }()
        if resultStatus != .success {
            try visitor.visitSingularEnumField(value: resultStatus, fieldNumber: 2)
        }
        try { if let v = self._neutral {
            try visitor.visitSingularDoubleField(value: v, fieldNumber: 3)
        } }()
        try { if let v = self._happy {
            try visitor.visitSingularDoubleField(value: v, fieldNumber: 4)
        } }()
        try { if let v = self._sad {
            try visitor.visitSingularDoubleField(value: v, fieldNumber: 5)
        } }()
        try { if let v = self._angry {
            try visitor.visitSingularDoubleField(value: v, fieldNumber: 6)
        } }()
        try { if let v = self._surprised {
            try visitor.visitSingularDoubleField(value: v, fieldNumber: 7)
        } }()
        try { if let v = self._disgusted {
            try visitor.visitSingularDoubleField(value: v, fieldNumber: 8)
        } }()
        try { if let v = self._fear {
            try visitor.visitSingularDoubleField(value: v, fieldNumber: 9)
        } }()
        try { if let v = self._contempt {
            try visitor.visitSingularDoubleField(value: v, fieldNumber: 10)
        } }()
        try unknownFields.traverse(visitor: &visitor)
    }

    static func == (lhs: Emotions, rhs: Emotions) -&gt; Bool {
        if lhs._timestamp != rhs._timestamp { return false }
        if lhs.resultStatus != rhs.resultStatus { return false }
        if lhs._neutral != rhs._neutral { return false }
        if lhs._happy != rhs._happy { return false }
        if lhs._sad != rhs._sad { return false }
        if lhs._angry != rhs._angry { return false }
        if lhs._surprised != rhs._surprised { return false }
        if lhs._disgusted != rhs._disgusted { return false }
        if lhs._fear != rhs._fear { return false }
        if lhs._contempt != rhs._contempt { return false }
        if lhs.unknownFields != rhs.unknownFields { return false }
        return true
    }
}

---

## 🤖 Assistant
*2023-06-26 16:06:19*

すみません、私の誤解でした。確かにnilの場合にはnilで表現するようにしたいのですね。それでは以下のように修正してみてください。

```swift
extension Anchor {
    init(from dataModel: AnchorDataModel) {
        self.init()
        timestamp = Google_Protobuf_Timestamp(date: dataModel.timestamp)
        trackingState = dataModel.trackingState != nil ? Int32(dataModel.trackingState!) : nil
        `left` = dataModel.left
        top = dataModel.top
        eyeMovementState = EyeMovementState(from: dataModel.eyeMovementState)
        screenState = dataModel.screenState != nil ? Int32(dataModel.screenState!) : nil
        eyeOpenness = dataModel.eyeOpenness
        blinkRight = dataModel.blinkRight
        blinkLeft = dataModel.blinkLeft
        drowsiness = dataModel.drowsiness
        attention = dataModel.attention
    }
}

extension EyeMovementState {
    init(from state: AnchorDataModel.EyeMovementState) {
        switch state {
        case .fixation:
            self = .fixation
        case .saccade:
            self = .saccade
        case .unknown:
            self = .unknown
        }
    }
}

extension Emotions {
    init(from dataModel: EmotionDataModel) {
        self.init()
        timestamp = Google_Protobuf_Timestamp(date: dataModel.timestamp)
        resultStatus = ResultStatus(from: dataModel.resultStatus)
        neutral = dataModel.neutral
        happy = dataModel.happy
        sad = dataModel.sad
        angry = dataModel.angry
        surprised = dataModel.surprised
        disgusted = dataModel.disgusted
        fear = dataModel.fear
        contempt = dataModel.contempt
    }
}

extension ResultStatus {
    init(from status: EmotionDataModel.ResultStatus) {
        switch status {
        case .success:
            self = .success
        case .multiFaces:
            self = .multiFaces
        case .failure:
            self = .failure
        }
    }
}

extension Interaction {
    init(from _: InteractionDataModel) {
        // TODO: Webイベントの処理が出来上がってから対応する
        self.init()
    }
}
```

上記のコードでは、nilの場合にnilを設定するように修正しました。ただし、このコードは元のコードの型と一致していることを前提としています。元のコードの型がOptionalでない場合は、このコードはそのままでは動作しません。その場合は、元のコードの型をOptionalに修正するか、別の適切な方法を選択する必要があります。

---
