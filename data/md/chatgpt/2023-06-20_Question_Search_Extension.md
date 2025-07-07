# Question Search Extension

日付: 2023-06-20

---

## 👤 ユーザー
*2023/6/20 15:54:19*

以下のQuestionの配列に対して、id で検索してQuestionを取得するようなextensionを作って欲しい。

public struct Question: Identifiable {
    public let id: String
    public let title: String
    public let order: Int
    public let required: Bool
    public let constraint: TextConstraint

    public init(id: String, title: String, order: Int, required: Bool, constraint: TextConstraint) {
        self.id = id
        self.title = title
        self.order = order
        self.required = required
        self.constraint = constraint
    }
}

---

## 🤖 アシスタント
*2023/6/20 15:54:39*

次のように、Arrayのextensionを追加して、Questionのidを指定して取得するメソッドを作成することができます。このメソッドでは、配列の中の各Questionをループし、与えられたidと一致するQuestionを返します。

```swift
extension Array where Element == Question {
    func getQuestion(by id: String) -> Question? {
        return self.first { $0.id == id }
    }
}
```

このコードを追加した後、Questionの配列に対して、例えば `questions.getQuestion(by: "someID")` のように呼び出すことができます。この関数は、idが一致するQuestionを返すか、存在しない場合はnilを返します。

---

## 👤 ユーザー
*2023/6/20 16:06:58*

追加で以下のようなvar のQuestionの配列を持っていて、idで一致するもののanswerValueを更新するような処理を書きたい。

public struct Question: Identifiable {
    public let id: String
    public let title: String
    public let order: Int
    public let answerType: AnswerType
    public var answerValue: String?

    public init(id: String, title: String, order: Int, answerType: AnswerType, answerValue: String? = nil) {
        self.id = id
        self.title = title
        self.order = order
        self.answerType = answerType
        self.answerValue = answerValue
    }
}

public extension Question {
    var isAnswerValid: Bool {
        guard let answerValue, !answerValue.isEmpty else { return false }
        switch answerType {
        case .textField(let minLength, let maxLength):
            return answerValue.count &gt;= minLength && answerValue.count &lt;= maxLength
        case .picker(choices: \_):
            return true
        }
    }
}

---

## 🤖 アシスタント
*2023/6/20 16:07:26*

Swiftの配列は値型であるため、その要素を直接変更することはできません。その代わり、対象の要素を取り出し、変更した後に再度配列に追加する必要があります。

この目的のために、Arrayの拡張として新たに `updateAnswer` 関数を追加できます。この関数は、特定の `id` を持つ `Question` の `answerValue` を更新します。

```swift
extension Array where Element == Question {
    mutating func updateAnswer(for id: String, with newValue: String?) {
        if let index = self.firstIndex(where: { $0.id == id }) {
            var question = self[index]
            question.answerValue = newValue
            self[index] = question
        }
    }
}
```

この関数を使用するには、次のようにします。

```swift
var questions: [Question] = ... // Your array of questions
questions.updateAnswer(for: "someID", with: "new answer")
```

このコードは、 `id` が "someID" と一致する `Question` の `answerValue` を "new answer" に更新します。

なお、 `updateAnswer` 関数は `mutating` であるため、それを使用する配列も変更可能（つまり `var` ）である必要があります。

---

## 👤 ユーザー
*2023/6/20 16:10:15*

もうすこしスマートな書き方ないの？

---

## 🤖 アシスタント
*2023/6/20 16:10:51*

Swiftの配列は値型であり、その要素を直接変更することはできません。そのため、特定の要素を更新するには通常はその要素を取り出し、変更を行った後で元の位置に戻すという手順が必要です。

ただし、以下のような関数型プログラミングのアプローチを使って、もう少し"スマート"に見えるコードを書くこともできます。

```swift
extension Array where Element == Question {
    mutating func updateAnswer(for id: String, with newValue: String?) {
        self = self.map { question in
            guard question.id == id else { return question }
            var newQuestion = question
            newQuestion.answerValue = newValue
            return newQuestion
        }
    }
}
```

この関数では、配列の各要素をループしているところは同じですが、新たな配列を生成してそれを元の配列に再代入する形になっています。このように書くと、配列の要素を直接変更するという感じではなくなります。ただし、関数内部ではまだ要素を取り出し、変更を行った後で新たな配列に戻しています。

以上のコードでも、 `id` が一致する `Question` の `answerValue` を更新できます。具体的な使用方法は以下のとおりです。

```swift
var questions: [Question] = ... // Your array of questions
questions.updateAnswer(for: "someID", with: "new answer")
```

---

## 👤 ユーザー
*2023/6/20 16:11:48*

そもそもindexがわかればそれを使って直接更新をかけてしまう方法もある気がする

---

## 🤖 アシスタント
*2023/6/20 16:12:27*

確かに、その方法も可能です。配列の中から指定の`id`を持つ`Question`のインデックスを見つけて、その位置の要素を直接変更するという方法です。

以下のようなextensionを作ることができます。

```swift
extension Array where Element == Question {
    mutating func updateAnswer(for id: String, with newValue: String?) {
        if let index = self.firstIndex(where: { $0.id == id }) {
            self[index].answerValue = newValue
        }
    }
}
```

この方法であれば、指定の`id`を持つ`Question`を見つけて直接その`answerValue`を更新します。ただし、この方法は`Question`がクラスではなく構造体である場合には動作しません。なぜなら、Swiftの構造体は値型であり、配列から取り出した場合には元の要素のコピーが生成されるため、そのコピーを変更しても元の要素には影響を与えないからです。

したがって、この方法を利用するには`Question`をクラスに変更する必要があります。もしくは、配列の要素を取り出し、変更した上で再度その位置に戻すという方法（先程の提案）を利用する必要があります。

なお、`Question`をクラスに変更すると、参照型となるため、一つの`Question`の変更が他のすべての参照に影響を与えることに注意してください。これが適切かどうかは、あなたのアプリケーションの具体的な要件によります。

---
