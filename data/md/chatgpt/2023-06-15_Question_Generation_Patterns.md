# Question Generation Patterns

日付: 2023-06-15

---

## 👤 ユーザー
*2023/06/15 10:02:19*

以下の表現を使っていくつかのパターンを生成してみてください



struct Question {
    var id: String
    var title: String
    var order: Int
    var `required`: Bool
    var constraint: ConstraintType
}

enum ConstraintType {
    case textarea(minLength: Int?, maxLength: Int?)
    case singleSelect(choices: [Choice])
}

struct Choice {
    var id: String
    var name: String
}

---

## 🤖 アシスタント
*2023/06/15 10:02:55*

以下は、提供されたSwiftのコードスニペットを用いて質問を表現するいくつかのパターンの例です。

1. テキストエリアを持つ質問：

```swift
let question1 = Question(
    id: "q1",
    title: "Please describe your previous work experience.",
    order: 1,
    required: true,
    constraint: .textarea(minLength: 50, maxLength: 500)
)
```

2. シングルセレクト（一択）を持つ質問：

```swift
let question2 = Question(
    id: "q2",
    title: "What is your highest level of education?",
    order: 2,
    required: true,
    constraint: .singleSelect(choices: [
        Choice(id: "1", name: "High School"),
        Choice(id: "2", name: "Bachelor's Degree"),
        Choice(id: "3", name: "Master's Degree"),
        Choice(id: "4", name: "PhD")
    ])
)
```

3. 必須ではないテキストエリアを持つ質問：

```swift
let question3 = Question(
    id: "q3",
    title: "If applicable, please provide your LinkedIn profile link.",
    order: 3,
    required: false,
    constraint: .textarea(minLength: nil, maxLength: 200)
)
```

4. シングルセレクトを持つが必須ではない質問：

```swift
let question4 = Question(
    id: "q4",
    title: "Do you have any programming language preferences?",
    order: 4,
    required: false,
    constraint: .singleSelect(choices: [
        Choice(id: "1", name: "Python"),
        Choice(id: "2", name: "JavaScript"),
        Choice(id: "3", name: "Java"),
        Choice(id: "4", name: "Swift")
    ])
)
```

5. 最小文字数制限がないテキストエリアを持つ質問：

```swift
let question5 = Question(
    id: "q5",
    title: "Please provide any additional information you feel is relevant.",
    order: 5,
    required: true,
    constraint: .textarea(minLength: nil, maxLength: 1000)
)
```

---
