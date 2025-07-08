# Smart Answer Dict

Date: 2023-07-18

---

## 👤 User
*2023-07-18 19:59:44*

以下のanswersDictの作成の処理をスマートに行うことはできないでしょうか？

public struct Answer {
    public let questionId: String
    public let value: AnswerValue?

    public init(questionId: String, value: AnswerValue?) {
        self.questionId = questionId
        self.value = value
    }
}

public enum AnswerValue {
    case singleAnswer(String)
    case multipleAnswers(Set&lt;String&gt;)
}

let answersDict = answers.map { answerInput -&gt; [String: String] in
            var dict: [String: String] = [:]
            dict["question_id"] = answerInput.questionId
            switch answerInput.value {
            case .singleAnswer(let answer):
                dict["value"] = "\"\(answer)\""
            case .multipleAnswers(let answers):
                dict["value"] = answers.description
            case .none:
                break
            }
            return dict
        }

ちなみにdescriptionは以下のものを使っている

extension Set : CustomStringConvertible, CustomDebugStringConvertible {

    /// A string that represents the contents of the set.
    public var description: String { get }

    /// A string that represents the contents of the set, suitable for debugging.
    public var debugDescription: String { get }
}

---

## 🤖 Assistant
*2023-07-18 20:00:06*

一部の処理を改良し、さらにスマートにしてみましょう。この場合、AnswerValueに対して直接descriptionを適用できます。これにより、switch文でcaseごとに処理を分ける必要がなくなります。ただし、そのためには`AnswerValue`が`CustomStringConvertible`を準拠するように定義を変更する必要があります。

まず、`AnswerValue`の定義を以下のように変更します：

```swift
public enum AnswerValue: CustomStringConvertible {
    case singleAnswer(String)
    case multipleAnswers(Set<String>)

    public var description: String {
        switch self {
        case .singleAnswer(let answer):
            return "\"\(answer)\""
        case .multipleAnswers(let answers):
            return answers.description
        }
    }
}
```

その後、新しい`answersDict`の作成の処理を以下のようにします：

```swift
let answersDict = answers.map { answerInput in
    ["question_id": answerInput.questionId,
     "value": answerInput.value?.description ?? ""]
}
```

これにより、より簡潔に`answersDict`を作成できます。この変更により、新たな`AnswerValue`のケースが追加された場合でも、descriptionの定義だけ更新すれば済むようになりました。

---

## 👤 User
*2023-07-18 20:01:02*

Codable をつかうことでもっとスマートにできないかな？

---

## 🤖 Assistant
*2023-07-18 20:01:26*

`Codable`プロトコルを使用して、よりスマートにコードを書くこともできます。このプロトコルは、Swiftのモデルを簡単にJSONと相互変換することを可能にします。

そのため、まず`Answer`と`AnswerValue`を`Codable`に準拠させます：

```swift
public struct Answer: Codable {
    public let questionId: String
    public let value: AnswerValue?

    public init(questionId: String, value: AnswerValue?) {
        self.questionId = questionId
        self.value = value
    }

    enum CodingKeys: String, CodingKey {
        case questionId = "question_id"
        case value
    }
}

public enum AnswerValue: Codable {
    case singleAnswer(String)
    case multipleAnswers(Set<String>)

    // Provide your own implementation of encode(to encoder: Encoder) and init(from decoder: Decoder)
    // to properly handle the enum cases.
}
```

次に、`JSONEncoder`を使用して`Answer`のインスタンスをJSONにエンコードします：

```swift
let encoder = JSONEncoder()
encoder.keyEncodingStrategy = .convertToSnakeCase

do {
    let jsonData = try encoder.encode(answers)
    if let jsonString = String(data: jsonData, encoding: .utf8) {
        print(jsonString)
    }
} catch {
    print("Failed to encode answers: \(error)")
}
```

ただし、注意点として、`Codable`を使用する場合、エンコーディングとデコーディングの挙動は必要に応じてカスタマイズする必要があります。この例では、`AnswerValue`列挙体はそれぞれ異なる型のデータを持つため、自分でエンコードとデコードの方法を定義する必要があります。

---
