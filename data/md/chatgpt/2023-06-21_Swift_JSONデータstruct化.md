# Swift JSONデータstruct化

日付: 2023-06-21

---

## 👤 ユーザー
*2023/06/21 23:37:00*

Swiftで以下をstructで扱えるようにしたいです。

"{\"enum\":[\"モーションキャプチャーサービス「Xsens Animate Pro」\",\"ハンドキャプチャーサービス「MANUS Quantum Metagloves」\",\"「暴太郎戦隊ドンブラザーズ」リアルタイムモーションキャプチャー\",\"「ひきだすにほんご Activate Your Japanese!」VFX＋モーションキャプチャー\",\"「KING – Kanaria / 黒杜えれん Cover【VTuber 歌ってみた】」モーションキャプチャー＋MV制作\",\"「初音ミクシンフォニー 2021」モーションキャプチャー/アニメーション\",\"TVアニメ「それが声優」第12話「ライブ」劇中曲「光の先へ」ライブシーンモーションキャプチャー（プリヴィズ制作）\"],\"type\":\"text\"}"

---

## 🤖 アシスタント
*2023/06/21 23:38:43*

このようなJSONデータをSwiftのstructで扱うためには、まず適切な構造体を定義する必要があります。以下に示すように、`Codable`プロトコルを採用したstructを作成します。

```swift
import Foundation

struct Service: Codable {
    var enum: [String]
    var type: String

    enum CodingKeys: String, CodingKey {
        case `enum`
        case type
    }
}
```

このstructはJSONデータをデコードし、Swiftのオブジェクトに変換するために使用します。次に以下のようにJSONデータをデコードします。

```swift
let jsonString = "{\"enum\":[\"モーションキャプチャーサービス「Xsens Animate Pro」\",\"ハンドキャプチャーサービス「MANUS Quantum Metagloves」\",\"「暴太郎戦隊ドンブラザーズ」リアルタイムモーションキャプチャー\",\"「ひきだすにほんご Activate Your Japanese!」VFX＋モーションキャプチャー\",\"「KING – Kanaria / 黒杜えれん Cover【VTuber 歌ってみた】」モーションキャプチャー＋MV制作\",\"「初音ミクシンフォニー 2021」モーションキャプチャー/アニメーション\",\"TVアニメ「それが声優」第12話「ライブ」劇中曲「光の先へ」ライブシーンモーションキャプチャー（プリヴィズ制作）\"],\"type\":\"text\"}"

if let jsonData = jsonString.data(using: .utf8) {
    let decoder = JSONDecoder()
    do {
        let service = try decoder.decode(Service.self, from: jsonData)
        print(service)
    } catch {
        print("Error decoding JSON: \(error)")
    }
}
```

これで、指定したJSONデータがSwiftのstructにデコードされ、プログラム内で利用可能になります。

---

## 👤 ユーザー
*2023/06/21 23:45:50*

今度は以下のstructになるようにdecodeするような仕組みを作ってほしい。typeは読まなくてよくてenumだけ呼んで欲しい

struct SingleSelect {
    let choices: [String]
}

---

## 🤖 アシスタント
*2023/06/21 23:46:49*

Swiftの`Codable`プロトコルを使用すると、特定の部分のみをデコードすることも可能です。以下にその例を示します。

まず、`SingleSelect`という構造体を定義します：

```swift
import Foundation

struct SingleSelect: Codable {
    let choices: [String]
}
```

次に、JSONデータを含む中間の`Service`構造体を定義します：

```swift
struct Service: Codable {
    let enum: [String]

    enum CodingKeys: String, CodingKey {
        case `enum`
    }
}
```

そして、以下の方法でJSONデータをパースします：

```swift
let jsonString = "{\"enum\":[\"モーションキャプチャーサービス「Xsens Animate Pro」\",\"ハンドキャプチャーサービス「MANUS Quantum Metagloves」\",\"「暴太郎戦隊ドンブラザーズ」リアルタイムモーションキャプチャー\",\"「ひきだすにほんご Activate Your Japanese!」VFX＋モーションキャプチャー\",\"「KING – Kanaria / 黒杜えれん Cover【VTuber 歌ってみた】」モーションキャプチャー＋MV制作\",\"「初音ミクシンフォニー 2021」モーションキャプチャー/アニメーション\",\"TVアニメ「それが声優」第12話「ライブ」劇中曲「光の先へ」ライブシーンモーションキャプチャー（プリヴィズ制作）\"],\"type\":\"text\"}"

if let jsonData = jsonString.data(using: .utf8) {
    let decoder = JSONDecoder()
    do {
        let service = try decoder.decode(Service.self, from: jsonData)
        let singleSelect = SingleSelect(choices: service.enum)
        print(singleSelect)
    } catch {
        print("Error decoding JSON: \(error)")
    }
}
```

これにより、`SingleSelect`オブジェクトが生成され、その`choices`プロパティはJSONデータの`enum`フィールドの内容に対応します。

---

## 👤 ユーザー
*2023/06/21 23:46:53*

中間のService構造体はいらない気がするんだけど。

---

## 🤖 アシスタント
*2023/06/21 23:48:26*

確かに、中間の`Service`構造体は必要ありません。`SingleSelect`構造体の`CodingKeys`を設定し、その`choices`プロパティがJSONの`enum`フィールドに対応するように指定すれば、直接デコードできます。

以下のように修正してみましょう。

```swift
import Foundation

struct SingleSelect: Codable {
    let choices: [String]

    enum CodingKeys: String, CodingKey {
        case choices = "enum"
    }
}

let jsonString = "{\"enum\":[\"モーションキャプチャーサービス「Xsens Animate Pro」\",\"ハンドキャプチャーサービス「MANUS Quantum Metagloves」\",\"「暴太郎戦隊ドンブラザーズ」リアルタイムモーションキャプチャー\",\"「ひきだすにほんご Activate Your Japanese!」VFX＋モーションキャプチャー\",\"「KING – Kanaria / 黒杜えれん Cover【VTuber 歌ってみた】」モーションキャプチャー＋MV制作\",\"「初音ミクシンフォニー 2021」モーションキャプチャー/アニメーション\",\"TVアニメ「それが声優」第12話「ライブ」劇中曲「光の先へ」ライブシーンモーションキャプチャー（プリヴィズ制作）\"],\"type\":\"text\"}"

if let jsonData = jsonString.data(using: .utf8) {
    let decoder = JSONDecoder()
    do {
        let singleSelect = try decoder.decode(SingleSelect.self, from: jsonData)
        print(singleSelect)
    } catch {
        print("Error decoding JSON: \(error)")
    }
}
```

このコードでは、`SingleSelect`構造体の`choices`プロパティが直接JSONの`enum`フィールドにマッピングされています。これで、不要な`Service`構造体を省略できます。

---

## 👤 ユーザー
*2023/06/21 23:50:02*

同様に以下の文字列をFreeDescriptionに変換するコードを書いて欲しい。

"{\"type\":\"text\",\"max_length\":256,\"min_length\":0}"

```swift
struct FreeDescription {
    let minLength: Int
    let maxLength: Int
}
```

---

## 🤖 アシスタント
*2023/06/21 23:50:36*

`FreeDescription` structを`Codable`プロトコルに適合させ、特定のキーをプロパティにマッピングするための`CodingKeys`を設定することで実現できます。以下に具体的なコードを示します。

```swift
import Foundation

struct FreeDescription: Codable {
    let minLength: Int
    let maxLength: Int

    enum CodingKeys: String, CodingKey {
        case minLength = "min_length"
        case maxLength = "max_length"
    }
}

let jsonString = "{\"type\":\"text\",\"max_length\":256,\"min_length\":0}"

if let jsonData = jsonString.data(using: .utf8) {
    let decoder = JSONDecoder()
    do {
        let freeDescription = try decoder.decode(FreeDescription.self, from: jsonData)
        print(freeDescription)
    } catch {
        print("Error decoding JSON: \(error)")
    }
}
```
このコードは、指定されたJSON文字列を`FreeDescription`構造体にデコードします。構造体内の`minLength`および`maxLength`プロパティはそれぞれJSONの`min_length`と`max_length`フィールドに対応します。

---

## 👤 ユーザー
*2023/06/22 00:03:29*

以下のような Question の型があって、ConstraintType をもっている。
それによってconstraintsの形式が異なって、freeDescription であれば struct FreeDescription に変換できる文字列で、singleSelect の場合は struct SingleSelect に変換できる文字列である。
そして、変形したものを AnswerType に変換したいと思っている。
FreeDescriptionはAnswerType.textField に SingleSelect は AnswerType.pickerに変えて欲しい。
それを Question のextension で var answerType: AnswerType で取得できるようなコンピューテットプロパティを生やして欲しい

public struct Question: Embeddable {
  var id: String
  var title: String
  var order: Int
  var `required`: Bool
  var constraint_type: ConstraintType
  var constraints: String
}

public enum ConstraintType: String, EnumPersistable {
  case freeDescription = "free_description"
  case singleSelect = "single_select"
}

struct FreeDescription: Codable {
    let minLength: Int
    let maxLength: Int

    enum CodingKeys: String, CodingKey {
        case minLength = "min_length"
        case maxLength = "max_length"
    }
}

struct SingleSelect: Codable {
    let choices: [String]

    enum CodingKeys: String, CodingKey {
        case choices = "enum"
    }
}

public enum AnswerType {
    case textField(minLength: Int, maxLength: Int)
    case picker(choices: [String])
}

---

## 🤖 アシスタント
*2023/06/22 00:04:34*

Swiftでは、`Question`構造体に`answerType`という計算プロパティを追加することで、指定された制約に基づいて`AnswerType`を返すことが可能です。ここでは、JSONデコーダを使用して`constraints`文字列を`FreeDescription`または`SingleSelect`にデコードします。

以下のコードをご覧ください：

```swift
import Foundation

public struct Question: Embeddable {
    var id: String
    var title: String
    var order: Int
    var `required`: Bool
    var constraint_type: ConstraintType
    var constraints: String

    var answerType: AnswerType? {
        switch constraint_type {
        case .freeDescription:
            guard let jsonData = constraints.data(using: .utf8),
                  let freeDescription = try? JSONDecoder().decode(FreeDescription.self, from: jsonData) else {
                return nil
            }
            return .textField(minLength: freeDescription.minLength, maxLength: freeDescription.maxLength)

        case .singleSelect:
            guard let jsonData = constraints.data(using: .utf8),
                  let singleSelect = try? JSONDecoder().decode(SingleSelect.self, from: jsonData) else {
                return nil
            }
            return .picker(choices: singleSelect.choices)
        }
    }
}

public enum ConstraintType: String, EnumPersistable {
    case freeDescription = "free_description"
    case singleSelect = "single_select"
}

struct FreeDescription: Codable {
    let minLength: Int
    let maxLength: Int

    enum CodingKeys: String, CodingKey {
        case minLength = "min_length"
        case maxLength = "max_length"
    }
}

struct SingleSelect: Codable {
    let choices: [String]

    enum CodingKeys: String, CodingKey {
        case choices = "enum"
    }
}

public enum AnswerType {
    case textField(minLength: Int, maxLength: Int)
    case picker(choices: [String])
}
```

`answerType`プロパティは、`ConstraintType`の値に基づいて`constraints`文字列を適切な構造体にデコードし、その結果を`AnswerType`として返します。デコードに失敗した場合は`nil`を返します。

なお、`Embeddable`と`EnumPersistable`が独自のプロトコルまたは型である場合、それらを適切に定義するか、このコードから除去する必要があるかもしれません。コードはその部分を理解できる環境に依存します。

---

## 👤 ユーザー
*2023/06/22 00:06:35*

以下のように書くことでerrorをスローするようにしたい
var answerType: AnswerType {
    get throws {

---

## 🤖 アシスタント
*2023/06/22 00:07:38*

残念ながら、Swiftでは現時点では計算プロパティがエラーをスローすることはできません。しかし、代わりにメソッドを使って同様の結果を得ることが可能です。

以下のように`Question`構造体に`getAnswerType()`メソッドを追加すると、制約タイプに基づいて`AnswerType`を返すことができます。メソッドはエラーをスローするので、デコードに失敗した場合はエラーを投げます。

```swift
import Foundation

public struct Question: Embeddable {
    var id: String
    var title: String
    var order: Int
    var `required`: Bool
    var constraint_type: ConstraintType
    var constraints: String

    func getAnswerType() throws -> AnswerType {
        let decoder = JSONDecoder()
        guard let data = constraints.data(using: .utf8) else {
            throw DecodingError.dataCorrupted(.init(codingPath: [], debugDescription: "Unable to convert string to data."))
        }
        
        switch constraint_type {
        case .freeDescription:
            let freeDescription = try decoder.decode(FreeDescription.self, from: data)
            return .textField(minLength: freeDescription.minLength, maxLength: freeDescription.maxLength)
            
        case .singleSelect:
            let singleSelect = try decoder.decode(SingleSelect.self, from: data)
            return .picker(choices: singleSelect.choices)
        }
    }
}

public enum ConstraintType: String, EnumPersistable {
    case freeDescription = "free_description"
    case singleSelect = "single_select"
}

struct FreeDescription: Codable {
    let minLength: Int
    let maxLength: Int

    enum CodingKeys: String, CodingKey {
        case minLength = "min_length"
        case maxLength = "max_length"
    }
}

struct SingleSelect: Codable {
    let choices: [String]

    enum CodingKeys: String, CodingKey {
        case choices = "enum"
    }
}

public enum AnswerType {
    case textField(minLength: Int, maxLength: Int)
    case picker(choices: [String])
}
```

このメソッドを使用する際には`do-catch`ステートメントを用いてエラーを処理する必要があります。以下のようになります：

```swift
do {
    let answerType = try question.getAnswerType()
    // Use answerType here
} catch {
    print("Error getting answer type: \(error)")
}
```

---

## 👤 ユーザー
*2023/06/22 00:08:21*

debugDescription のないようにconstraintsの値も入れたい」

---

## 🤖 アシスタント
*2023/06/22 00:09:08*

`DecodingError.dataCorrupted`の`debugDescription`に`constraints`の値を含めることができます。これにより、エラーメッセージに具体的な情報を提供することができ、デバッグが容易になります。

以下に修正したコードを示します：

```swift
import Foundation

public struct Question: Embeddable {
    var id: String
    var title: String
    var order: Int
    var `required`: Bool
    var constraint_type: ConstraintType
    var constraints: String

    func getAnswerType() throws -> AnswerType {
        let decoder = JSONDecoder()
        guard let data = constraints.data(using: .utf8) else {
            throw DecodingError.dataCorrupted(.init(codingPath: [], debugDescription: "Unable to convert string to data. The constraints value is: \(constraints)"))
        }
        
        switch constraint_type {
        case .freeDescription:
            let freeDescription = try decoder.decode(FreeDescription.self, from: data)
            return .textField(minLength: freeDescription.minLength, maxLength: freeDescription.maxLength)
            
        case .singleSelect:
            let singleSelect = try decoder.decode(SingleSelect.self, from: data)
            return .picker(choices: singleSelect.choices)
        }
    }
}

public enum ConstraintType: String, EnumPersistable {
    case freeDescription = "free_description"
    case singleSelect = "single_select"
}

struct FreeDescription: Codable {
    let minLength: Int
    let maxLength: Int

    enum CodingKeys: String, CodingKey {
        case minLength = "min_length"
        case maxLength = "max_length"
    }
}

struct SingleSelect: Codable {
    let choices: [String]

    enum CodingKeys: String, CodingKey {
        case choices = "enum"
    }
}

public enum AnswerType {
    case textField(minLength: Int, maxLength: Int)
    case picker(choices: [String])
}
```

このコードでは、エラーメッセージに`constraints`の値が含まれています。この値は、データの変換が失敗した際に何が原因であったかを特定するのに役立ちます。

---

## 👤 ユーザー
*2023/06/22 00:17:33*

以下のようなtryってできないんだっけ？

extension EmomilCore.Measurement {
    init(fromQuestionnaire amplifyQuestionnaire: Questionnaire) throws {
        self.init(
            id: amplifyQuestionnaire.id,
            order: amplifyQuestionnaire.order,
            type: EmomilCore.MeasurementType(from: amplifyQuestionnaire.measurement_type),
            detail: .questionnaire(name: amplifyQuestionnaire.name!, questions: amplifyQuestionnaire.questions!.map { try EmomilCore.Question(from: $0) })
        )
    }
}

extension EmomilCore.Question {
    // TODO: constraints
    init(from amplifyQuestion: Question) throws {
        self.init(
            id: amplifyQuestion.id,
            title: amplifyQuestion.title,
            order: amplifyQuestion.order,
            required: amplifyQuestion.required,
            constraintType: try amplifyQuestion.constraintType
        )
    }
}

---

## 🤖 アシスタント
*2023/06/22 00:18:25*

Swiftの`map`関数はエラーをスローすることはできません。そのため、エラーをスローするクロージャ（`try EmomilCore.Question(from: $0)`）を直接使用することはできません。

しかし、Swiftの`map`の代わりに`compactMap`を使うことで解決可能です。`compactMap`は`nil`を無視して配列を生成するため、`try?`を使ってエラーをスローする操作を`nil`に変換できます。

なお、ここでは失敗した変換が`nil`になり、それが結果から除外されることに注意してください。もし失敗した変換を取り扱う必要があるなら、代わりに`Result`型を使うか、ループを作成してエラーを個別に処理する方が良いかもしれません。

以下に示すように修正可能です：

```swift
extension EmomilCore.Measurement {
    init(fromQuestionnaire amplifyQuestionnaire: Questionnaire) throws {
        self.init(
            id: amplifyQuestionnaire.id,
            order: amplifyQuestionnaire.order,
            type: EmomilCore.MeasurementType(from: amplifyQuestionnaire.measurement_type),
            detail: .questionnaire(name: amplifyQuestionnaire.name!, questions: amplifyQuestionnaire.questions!.compactMap { try? EmomilCore.Question(from: $0) })
        )
    }
}

extension EmomilCore.Question {
    // TODO: constraints
    init(from amplifyQuestion: Question) throws {
        self.init(
            id: amplifyQuestion.id,
            title: amplifyQuestion.title,
            order: amplifyQuestion.order,
            required: amplifyQuestion.required,
            constraintType: try amplifyQuestion.constraintType
        )
    }
}
```

このコードでは、`EmomilCore.Question(from: $0)`の変換が失敗した場合、結果は`nil`となり、それは`compactMap`により結果の配列から除外されます。

---

## 👤 ユーザー
*2023/06/22 00:18:46*

compactMap ではなくてちゃんとエラーをスローするようにしたい

---

## 🤖 アシスタント
*2023/06/22 00:19:30*

エラーをスローするためには、`map`を使う代わりに明示的に`for`ループを使いましょう。その中で各要素を処理し、エラーをスローする操作を行います。

以下のように修正することで、`amplifyQuestionnaire.questions`からの変換時にエラーが発生した場合、そのエラーを上位にスローします。

```swift
extension EmomilCore.Measurement {
    init(fromQuestionnaire amplifyQuestionnaire: Questionnaire) throws {
        var questions = [EmomilCore.Question]()
        if let amplifyQuestions = amplifyQuestionnaire.questions {
            for amplifyQuestion in amplifyQuestions {
                let question = try EmomilCore.Question(from: amplifyQuestion)
                questions.append(question)
            }
        }
        self.init(
            id: amplifyQuestionnaire.id,
            order: amplifyQuestionnaire.order,
            type: EmomilCore.MeasurementType(from: amplifyQuestionnaire.measurement_type),
            detail: .questionnaire(name: amplifyQuestionnaire.name!, questions: questions)
        )
    }
}

extension EmomilCore.Question {
    // TODO: constraints
    init(from amplifyQuestion: Question) throws {
        self.init(
            id: amplifyQuestion.id,
            title: amplifyQuestion.title,
            order: amplifyQuestion.order,
            required: amplifyQuestion.required,
            constraintType: try amplifyQuestion.constraintType
        )
    }
}
```

このコードでは、`init(fromQuestionnaire:)`が配列の各要素を個別に変換し、その結果を新しい`EmomilCore.Question`配列に追加しています。この方法では、エラーが発生した時点で変換が中断され、エラーがスローされます。

---

## 👤 ユーザー
*2023/06/22 00:22:41*

if let amplifyQuestions = amplifyQuestionnaire.questions { はしなくてよくて 強制アンラップしてください

---

## 🤖 アシスタント
*2023/06/22 00:23:16*

了解しました。強制アンラップを使用して`amplifyQuestionnaire.questions`を処理すると、以下のようになります：

```swift
extension EmomilCore.Measurement {
    init(fromQuestionnaire amplifyQuestionnaire: Questionnaire) throws {
        var questions = [EmomilCore.Question]()
        for amplifyQuestion in amplifyQuestionnaire.questions! {
            let question = try EmomilCore.Question(from: amplifyQuestion)
            questions.append(question)
        }
        self.init(
            id: amplifyQuestionnaire.id,
            order: amplifyQuestionnaire.order,
            type: EmomilCore.MeasurementType(from: amplifyQuestionnaire.measurement_type),
            detail: .questionnaire(name: amplifyQuestionnaire.name!, questions: questions)
        )
    }
}

extension EmomilCore.Question {
    // TODO: constraints
    init(from amplifyQuestion: Question) throws {
        self.init(
            id: amplifyQuestion.id,
            title: amplifyQuestion.title,
            order: amplifyQuestion.order,
            required: amplifyQuestion.required,
            constraintType: try amplifyQuestion.constraintType
        )
    }
}
```

しかし、このコードは`amplifyQuestionnaire.questions`が`nil`の場合にクラッシュします。これは、強制アンラップ(`!`)を使用しているからです。ですので、このコードを使用する際は`amplifyQuestionnaire.questions`が必ず値を持つことを保証する必要があります。

---

## 👤 ユーザー
*2023/06/22 00:30:19*

以下の強制アンラップしている処理をguard文でthrowするように変更して欲しい

extension EmomilCore.Measurement {
    init(fromVideo amplifyVideo: Video) {
        self.init(
            id: amplifyVideo.id,
            order: amplifyVideo.order,
            type: EmomilCore.MeasurementType(from: amplifyVideo.measurement_type),
            detail: .video(fileUri: amplifyVideo.file_uri!, instructions: amplifyVideo.instructions!, isSkip: amplifyVideo.skippable!)
        )
    }
}

extension EmomilCore.Measurement {
    init(fromWebsite amplifyWebsite: Website) {
        self.init(
            id: amplifyWebsite.id,
            order: amplifyWebsite.order,
            type: EmomilCore.MeasurementType(from: amplifyWebsite.measurement_type),
            detail: .website(siteUrl: amplifyWebsite.site_url!, instructions: amplifyWebsite.instructions!)
        )
    }
}

extension EmomilCore.Measurement {
    init(fromQuestionnaire amplifyQuestionnaire: Questionnaire) throws {
        var questions = [EmomilCore.Question]()
        // map や forEach だと error を throw できないため for-in 文を使用している
        for amplifyQuestion in amplifyQuestionnaire.questions! {
            let question = try EmomilCore.Question(from: amplifyQuestion)
            questions.append(question)
        }
        self.init(
            id: amplifyQuestionnaire.id,
            order: amplifyQuestionnaire.order,
            type: EmomilCore.MeasurementType(from: amplifyQuestionnaire.measurement_type),
            detail: .questionnaire(name: amplifyQuestionnaire.name!, questions: questions)
        )
    }
}

---

## 🤖 アシスタント
*2023/06/22 00:31:21*

強制アンラップを`guard let`ステートメントに変更し、必要な値が存在しない場合にエラーをスローするようにします。カスタムエラーを定義して各場所で使用することができます。

以下に修正案を示します：

```swift
enum InitializationError: Error {
    case missingValue(String)
}

extension EmomilCore.Measurement {
    init(fromVideo amplifyVideo: Video) throws {
        guard let fileUri = amplifyVideo.file_uri,
              let instructions = amplifyVideo.instructions,
              let isSkip = amplifyVideo.skippable else {
            throw InitializationError.missingValue("Missing necessary value in Video initialization.")
        }

        self.init(
            id: amplifyVideo.id,
            order: amplifyVideo.order,
            type: EmomilCore.MeasurementType(from: amplifyVideo.measurement_type),
            detail: .video(fileUri: fileUri, instructions: instructions, isSkip: isSkip)
        )
    }
}

extension EmomilCore.Measurement {
    init(fromWebsite amplifyWebsite: Website) throws {
        guard let siteUrl = amplifyWebsite.site_url,
              let instructions = amplifyWebsite.instructions else {
            throw InitializationError.missingValue("Missing necessary value in Website initialization.")
        }

        self.init(
            id: amplifyWebsite.id,
            order: amplifyWebsite.order,
            type: EmomilCore.MeasurementType(from: amplifyWebsite.measurement_type),
            detail: .website(siteUrl: siteUrl, instructions: instructions)
        )
    }
}

extension EmomilCore.Measurement {
    init(fromQuestionnaire amplifyQuestionnaire: Questionnaire) throws {
        var questions = [EmomilCore.Question]()
        guard let amplifyQuestions = amplifyQuestionnaire.questions,
              let name = amplifyQuestionnaire.name else {
            throw InitializationError.missingValue("Missing necessary value in Questionnaire initialization.")
        }

        for amplifyQuestion in amplifyQuestions {
            let question = try EmomilCore.Question(from: amplifyQuestion)
            questions.append(question)
        }

        self.init(
            id: amplifyQuestionnaire.id,
            order: amplifyQuestionnaire.order,
            type: EmomilCore.MeasurementType(from: amplifyQuestionnaire.measurement_type),
            detail: .questionnaire(name: name, questions: questions)
        )
    }
}
```

これらの`init`メソッドでは、`guard let`ステートメントを使用して、必要な値が`nil`でないことを確認しています。`nil`の場合、`InitializationError.missingValue`エラーがスローされ、詳細なエラーメッセージが提供されます。

---
