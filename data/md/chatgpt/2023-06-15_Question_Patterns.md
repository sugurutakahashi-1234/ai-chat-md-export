# Question Patterns

Date: 2023-06-15

---

## 👤 User
*2023-06-15 10:02:06*

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

## 🤖 Assistant
*2023-06-15 10:02:09*

パターン1:
```
Question(id: "1", title: "What is your favorite color?", order: 1, required: true, constraint: .singleSelect(choices: [Choice(id: "1", name: "Red"), Choice(id: "2", name: "Blue"), Choice(id: "3", name: "Green")]))
```

パターン2:
```
Question(id: "2", title: "Please provide your feedback", order: 2, required: false, constraint: .textarea(minLength: 10, maxLength: 100))
```

パターン3:
```
Question(id: "3", title: "Which programming languages do you know?", order: 3, required: true, constraint: .singleSelect(choices: [Choice(id: "1", name: "Python"), Choice(id: "2", name: "Java"), Choice(id: "3", name: "C++")]))
```

パターン4:
```
Question(id: "4", title: "Please describe your previous work experience", order: 4, required: true, constraint: .textarea(minLength: 50, maxLength: 500))
```

パターン5:
```
Question(id: "5", title: "What is your preferred mode of transportation?", order: 5, required: true, constraint: .singleSelect(choices: [Choice(id: "1", name: "Car"), Choice(id: "2", name: "Public transportation"), Choice(id: "3", name: "Bicycle")]))
```

---
