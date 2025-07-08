# Success Rate Calculation

日付: 2023-07-04

---

## 👤 ユーザー
*2023/07/04 19:52:33*

AnchorDataModel の配列に対して、
TrackingState が success or lowConfidence かつ、ScreenState が insideOfScreenである割合を計算して、それがAnchorDataModelの配列数の70%以上だったら サクセス、そうではなければ false になるような処理をSwiftで書いて欲しい

import Foundation

public struct AnchorDataModel {
    public let timestampInMilliseconds: Int
    public let left: Double
    public let top: Double
    public let absLeft: Double
    public let absTop: Double
    public let trackingState: TrackingState
    public let eyeMovementState: EyeMovementState
    public let screenState: ScreenState
    public let attention: Double?
    public let blinkRight: Bool?
    public let blinkLeft: Bool?
    public let eyeOpenness: Double?
    public let drowsiness: Bool?

    public init(timestampInMilliseconds: Int, left: Double, top: Double, absLeft: Double, absTop: Double, trackingState: TrackingState, eyeMovementState: EyeMovementState, screenState: ScreenState, attention: Double?, blinkRight: Bool?, blinkLeft: Bool?, eyeOpenness: Double?, drowsiness: Bool?) {
        self.timestampInMilliseconds = timestampInMilliseconds
        self.left = left
        self.top = top
        self.absLeft = absLeft
        self.absTop = absTop
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

public enum TrackingState {
    case success
    case lowConfidence
    case unsupported
    case faceMissing
}

public enum ScreenState {
    case insideOfScreen
    case outsideOfScreen
    case unknown
}

---

## 🤖 アシスタント
*2023/07/04 19:53:09*

下記のSwiftコードがあなたが指定した条件を満たしています。配列`anchorDataModels`に対して、`TrackingState`が`success`または`lowConfidence`、そして`ScreenState`が`insideOfScreen`である`AnchorDataModel`の割合を計算します。その割合が70%以上であれば、関数は`true`を返し、そうでなければ`false`を返します。

```swift
func isTrackingSuccessful(for anchorDataModels: [AnchorDataModel]) -> Bool {
    // Filter the array for the specified conditions
    let successfulModels = anchorDataModels.filter { model in
        (model.trackingState == .success || model.trackingState == .lowConfidence) && model.screenState == .insideOfScreen
    }
    
    // Calculate the percentage
    let percentage = Double(successfulModels.count) / Double(anchorDataModels.count)
    
    // Check if the percentage is 70% or more
    return percentage >= 0.7
}
```

この関数を使用するには、次のように`AnchorDataModel`の配列を作成し、関数に渡すだけです。

```swift
let models: [AnchorDataModel] = [...] // Create your array of AnchorDataModel
let result = isTrackingSuccessful(for: models)

if result {
    print("Tracking is successful.")
} else {
    print("Tracking is not successful.")
}
```

このコードは`AnchorDataModel`の配列が空でないことを前提としています。配列が空の場合、このコードではエラーが発生しますので、その点に注意してください。

---

## 👤 ユーザー
*2023/07/04 19:55:04*

結果をstructで返して欲しい。有効な割合 double、全体の数、有効だった数、基準値の割合、有効だったかどうか、

---

## 🤖 アシスタント
*2023/07/04 19:55:46*

指定の内容に基づき、次のような構造体と関数を作成しました。

まず、結果を保持するための`TrackingResult`構造体を作成します。

```swift
public struct TrackingResult {
    public let validRatio: Double
    public let totalCount: Int
    public let validCount: Int
    public let thresholdRatio: Double
    public let isSuccessful: Bool
}
```

次に、`AnchorDataModel`の配列を引数に取り、上記の`TrackingResult`構造体を返す関数を定義します。

```swift
func evaluateTracking(for anchorDataModels: [AnchorDataModel], threshold: Double = 0.7) -> TrackingResult {
    // Filter the array for the specified conditions
    let successfulModels = anchorDataModels.filter { model in
        (model.trackingState == .success || model.trackingState == .lowConfidence) && model.screenState == .insideOfScreen
    }
    
    // Calculate the ratio
    let validRatio = Double(successfulModels.count) / Double(anchorDataModels.count)
    
    // Check if the ratio is above or equal to the threshold
    let isSuccessful = validRatio >= threshold
    
    // Construct the result
    let result = TrackingResult(validRatio: validRatio,
                                totalCount: anchorDataModels.count,
                                validCount: successfulModels.count,
                                thresholdRatio: threshold,
                                isSuccessful: isSuccessful)
    
    return result
}
```

この関数を使用するには、次のように`AnchorDataModel`の配列を作成し、関数に渡すだけです。

```swift
let models: [AnchorDataModel] = [...] // Create your array of AnchorDataModel
let result = evaluateTracking(for: models)

print("Valid Ratio: \(result.validRatio)")
print("Total Count: \(result.totalCount)")
print("Valid Count: \(result.validCount)")
print("Threshold Ratio: \(result.thresholdRatio)")
print("Is Successful: \(result.isSuccessful ? "Yes" : "No")")
```

---

## 👤 ユーザー
*2023/07/04 19:57:04*

TrackingResult の extension のresultMessage: String でこれらの情報をもとに結果文言を短文で作成してほしい

---

## 🤖 アシスタント
*2023/07/04 19:57:23*

`TrackingResult`構造体に対して拡張を行い、結果メッセージを返すプロパティを追加します。このプロパティでは、適切な形式で情報を文字列にまとめます。

```swift
extension TrackingResult {
    var resultMessage: String {
        var message = "The total count of tracking was \(totalCount), of which \(validCount) were valid. "
        message += "This gives a valid ratio of \(validRatio * 100)% compared to the threshold of \(thresholdRatio * 100)%. "
        message += isSuccessful ? "Therefore, the tracking was successful." : "Therefore, the tracking was not successful."
        return message
    }
}
```

これにより、以下のようにして結果メッセージを得ることができます：

```swift
let models: [AnchorDataModel] = [...] // Create your array of AnchorDataModel
let result = evaluateTracking(for: models)

print(result.resultMessage)
```

---

## 👤 ユーザー
*2023/07/04 19:57:42*

もっと短くていいよ

---

## 🤖 アシスタント
*2023/07/04 19:58:00*

了解しました、それではもっとシンプルなメッセージを作成してみましょう。同様に`TrackingResult`構造体の拡張部分にプロパティを追加します。

```swift
extension TrackingResult {
    var resultMessage: String {
        let successMessage = "Tracking: Success (\(validRatio * 100)%)"
        let failureMessage = "Tracking: Fail (\(validRatio * 100)%)"
        return isSuccessful ? successMessage : failureMessage
    }
}
```

これにより、以下のようにして結果メッセージを得ることができます：

```swift
let models: [AnchorDataModel] = [...] // Create your array of AnchorDataModel
let result = evaluateTracking(for: models)

print(result.resultMessage)
```

---

## 👤 ユーザー
*2023/07/04 19:58:42*

100かけなくていいよ。あと、全体の数と有効だったデータの個数も短くいれてほしい

---

## 🤖 アシスタント
*2023/07/04 19:58:59*

了解しました。それでは結果メッセージを以下のように簡潔に修正します：

```swift
extension TrackingResult {
    var resultMessage: String {
        let status = isSuccessful ? "Success" : "Fail"
        return "Tracking: \(status), Ratio: \(validRatio), Total: \(totalCount), Valid: \(validCount)"
    }
}
```

このメッセージでは、トラッキングのステータス（成功または失敗）、有効なデータの割合、トラッキングデータの全体数、有効だったデータの数を表示します。

以下のように使用できます：

```swift
let models: [AnchorDataModel] = [...] // Create your array of AnchorDataModel
let result = evaluateTracking(for: models)

print(result.resultMessage)
```

---

## 👤 ユーザー
*2023/07/04 20:00:12*

"Tracking" だけに使うわけではないからValidationResultというstrcut名にして、メッセージもTracking:ではなく Validation: にしてほしい。

---

## 🤖 アシスタント
*2023/07/04 20:00:52*

指定通りに構造体の名前を`ValidationResult`に変更し、メッセージもそれに合わせて更新します。

まず、`ValidationResult`構造体を作成します。

```swift
public struct ValidationResult {
    public let validRatio: Double
    public let totalCount: Int
    public let validCount: Int
    public let thresholdRatio: Double
    public let isSuccessful: Bool
}
```

次に、新しい構造体を返す関数を作ります。

```swift
func evaluateValidation(for anchorDataModels: [AnchorDataModel], threshold: Double = 0.7) -> ValidationResult {
    // Filter the array for the specified conditions
    let successfulModels = anchorDataModels.filter { model in
        (model.trackingState == .success || model.trackingState == .lowConfidence) && model.screenState == .insideOfScreen
    }
    
    // Calculate the ratio
    let validRatio = Double(successfulModels.count) / Double(anchorDataModels.count)
    
    // Check if the ratio is above or equal to the threshold
    let isSuccessful = validRatio >= threshold
    
    // Construct the result
    let result = ValidationResult(validRatio: validRatio,
                                  totalCount: anchorDataModels.count,
                                  validCount: successfulModels.count,
                                  thresholdRatio: threshold,
                                  isSuccessful: isSuccessful)
    
    return result
}
```

そして、新しい`ValidationResult`構造体に対して拡張を行い、結果メッセージを返すプロパティを追加します。

```swift
extension ValidationResult {
    var resultMessage: String {
        let status = isSuccessful ? "Success" : "Fail"
        return "Validation: \(status), Ratio: \(validRatio), Total: \(totalCount), Valid: \(validCount)"
    }
}
```

以下のように使用できます：

```swift
let models: [AnchorDataModel] = [...] // Create your array of AnchorDataModel
let result = evaluateValidation(for: models)

print(result.resultMessage)
```

---

## 👤 ユーザー
*2023/07/04 20:01:31*

Validation: true, or Validation: false でいいよ

---

## 🤖 アシスタント
*2023/07/04 20:01:44*

指定通りにメッセージを更に簡潔にします。

`ValidationResult`構造体の拡張部分を以下のように更新します。

```swift
extension ValidationResult {
    var resultMessage: String {
        return "Validation: \(isSuccessful ? "true" : "false")"
    }
}
```

これで、結果メッセージは`Validation: true`または`Validation: false`となります。

使用方法は次の通りです：

```swift
let models: [AnchorDataModel] = [...] // Create your array of AnchorDataModel
let result = evaluateValidation(for: models)

print(result.resultMessage)
```

---

## 👤 ユーザー
*2023/07/04 20:15:33*

EmotionDataModel の配列についても同様の処理をしてほしい。条件は”resultStatus”==”SUCCESS”のみです。

public struct ValidationResult {
    public let isSuccess: Bool
    public let validRatio: Double
    public let thresholdRatio: Double
    public let totalCount: Int
    public let validCount: Int
    
    public init(isSuccess: Bool, validRatio: Double, thresholdRatio: Double, totalCount: Int, validCount: Int) {
        self.isSuccess = isSuccess
        self.validRatio = validRatio
        self.thresholdRatio = thresholdRatio
        self.totalCount = totalCount
        self.validCount = validCount
    }
}
import Foundation

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


    static func validation(anchorDataModels: [AnchorDataModel]) -&gt; ValidationResult {
        let thresholdRatio: Double = 0.7
        let successfulModels = anchorDataModels.filter { model in
            (model.trackingState == .success || model.trackingState == .lowConfidence) && model.screenState == .insideOfScreen
        }
        let validRatio: Double = Double(successfulModels.count) / Double(anchorDataModels.count)
        let isSuccess = validRatio &gt;= thresholdRatio
        let result = ValidationResult(
            isSuccess: isSuccess,
            validRatio: validRatio,
            thresholdRatio: thresholdRatio,
            totalCount: anchorDataModels.count,
            validCount: successfulModels.count
        )
        return result
    }
    
    static func validation(emotionDataModels: [EmotionDataModel]) -&gt; ValidationResult {
        
    }

---

## 🤖 アシスタント
*2023/07/04 20:16:03*

`EmotionDataModel`の配列についても、同様の処理を行う`validation`メソッドを追加します。このメソッドでは`EmotionDataModel`の配列を引数に取り、`ResultStatus`が`SUCCESS`である要素の割合がしきい値を超えるかどうかに基づいて`ValidationResult`を返します。

```swift
static func validation(emotionDataModels: [EmotionDataModel]) -> ValidationResult {
    let thresholdRatio: Double = 0.7
    let successfulModels = emotionDataModels.filter { model in
        model.resultStatus == .success
    }
    let validRatio: Double = Double(successfulModels.count) / Double(emotionDataModels.count)
    let isSuccess = validRatio >= thresholdRatio
    let result = ValidationResult(
        isSuccess: isSuccess,
        validRatio: validRatio,
        thresholdRatio: thresholdRatio,
        totalCount: emotionDataModels.count,
        validCount: successfulModels.count
    )
    return result
}
```

この関数を使用するには、`EmotionDataModel`の配列を作成し、関数に渡すだけです：

```swift
let models: [EmotionDataModel] = [...] // Create your array of EmotionDataModel
let result = validation(emotionDataModels: models)

print(result.isSuccess ? "Validation: true" : "Validation: false")
```

---
