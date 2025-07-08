# Refactor Boolean Property.

日付: 2023-06-21

---

## 👤 ユーザー
*2023/06/22 02:19:00*

以下のコードを理ファクタして欲しい

```swift
var isAnswerButtonEnabled: Bool {
        questionAnswers.filter { !$0.isAnswerValid }.isEmpty
    }
```

---

## 🤖 アシスタント
*2023/06/22 02:19:23*

以下のようにコードをリファクタリングすることで、より読みやすく、明瞭な意味を持つコードにすることが可能です：

```swift
var isAnswerButtonEnabled: Bool {
    !questionAnswers.contains(where: { !$0.isAnswerValid })
}
```

こちらのバージョンは、「質問の回答の中で有効な答えがないものが含まれていない場合」を直接評価しています。これは前のバージョンと同じ結果を出力しますが、処理の意味がより明瞭であるため、可読性が向上します。

また、性能面でも改善が見込まれます。なぜなら、`contains(where:)` メソッドは該当する要素が見つかった時点で探索を停止するのに対し、`filter` メソッドは全要素に対する操作が必要なためです。したがって、大規模なデータセットで効率的な操作が可能になります。

---

## 👤 ユーザー
*2023/06/22 02:19:47*

allSafeみたいなものってなかったっけ？

---

## 🤖 アシスタント
*2023/06/22 02:20:00*

はい、その通りです。`allSatisfy(_:)` メソッドを利用すると、全ての要素が指定した条件を満たすかどうかを評価することができます。これを使って、より直感的にコードを書くことも可能です。

```swift
var isAnswerButtonEnabled: Bool {
    questionAnswers.allSatisfy { $0.isAnswerValid }
}
```

こちらのバージョンは、「全ての質問の回答が有効である（つまり、無効な回答が存在しない）」を直接評価しています。

---

## 👤 ユーザー
*2023/06/22 02:20:25*

questionAnswers が0件の場合はどうなりますか？

---

## 🤖 アシスタント
*2023/06/22 02:20:48*

`questionAnswers` が空の配列（つまり要素数が0）の場合でも、Swift の `allSatisfy(_:)` メソッドはうまく動作します。空の配列に対して条件を満たす要素があるかどうかを問い合わせると、その配列は条件を「全て満たしている」と見なされます。つまり、`allSatisfy(_:)` メソッドは空の配列に対して `true` を返します。

したがって、以下のコードでは `questionAnswers` が空でも `isAnswerButtonEnabled` は `true` となります。

```swift
var isAnswerButtonEnabled: Bool {
    questionAnswers.allSatisfy { $0.isAnswerValid }
}
```

これが期待する動作でない場合は、適切に配列が空でないことをチェックするコードを追加する必要があります。

---

## 👤 ユーザー
*2023/06/22 02:21:56*

isAnswerValid って命名はどう思う？別名の候補を考えて欲しい

---

## 🤖 アシスタント
*2023/06/22 02:22:39*

`isAnswerValid` という名前は、そのプロパティが真偽値（Bool）を返し、回答が有効（valid）であるかどうかを示すことを明確に表しています。しかし、この名前がそのままでは何を意味するのか、または何に「有効」であるか明示していない場合、より具体的な名前を検討することが有益かもしれません。

以下に、`isAnswerValid` の代わりに使用できるいくつかの名前の提案をします：

1. `isAnswerCorrect` : これは回答が「正しい」かどうかを示します。ただし、これが「有効性」を意味するのか、「正確性」を意味するのかは、具体的なコンテキストによります。

2. `doesAnswerMeetCriteria` : これは回答が特定の「基準」または「要件」を満たしているかどうかを示します。

3. `isAnswerAcceptable` : これは回答が「受け入れ可能」であるかどうかを示します。

4. `isAnswerComplete` : これは回答が「完全」であるかどうかを示します。

5. `isAnswerFormallyValid` : これは形式的に（例えば、形式や長さなどで）回答が有効であるかどうかを示します。

適切な名前は、そのプロパティがどのように使用されるか、または何を表すべきかによります。そのため、最も具体的で直感的な名前を選択することが最善の戦略となります。

---

## 👤 ユーザー
*2023/06/22 02:24:05*

以下もわかりやすいように理ファクタして欲しい

 var shouldShowValidationError: Bool {
        (answerValue ?? "").isEmpty || isValid
    }

---

## 🤖 アシスタント
*2023/06/22 02:24:34*

以下のようにコードをリファクタリングすることで、よりわかりやすく表現することが可能です：

```swift
var shouldShowValidationError: Bool {
    let isAnswerEmpty = (answerValue ?? "").isEmpty
    return isAnswerEmpty || isValid
}
```

このコードでは、`isAnswerEmpty`という明確な変数名を使用して、`answerValue`が空であるかどうかを確認します。そして、この結果と`isValid`の結果をOR演算子(`||`)を使用して比較します。この変更により、この行が何をチェックしているのかがより明確になります。

ただし、`isValid`という名前からは、何が有効であるのか、またなぜその有効性がエラー表示の必要性に関連しているのかが明確にわかりません。この名前をもっと具体的にすることで、コードの意図をより明確にすることができます。例えば、`isAnswerValid`などの名前を使用すると良いでしょう。

---

## 👤 ユーザー
*2023/06/22 02:26:30*

中身をドモルガンの定理で逆にしてほしい
var shouldShowValidationError: Bool {
        (answerValue ?? "").isEmpty || isValid
    }

---

## 🤖 アシスタント
*2023/06/22 02:27:08*

ド・モルガンの定理を適用して、このブール値表現を反転させると以下のようになります：

```swift
var shouldShowValidationError: Bool {
    !(answerValue?.isNotEmpty ?? false) && !isValid
}
```

ここでは `answerValue?.isNotEmpty ?? false` が `answerValue` が空でないかを示し、`!isValid` が無効であることを示します。ド・モルガンの定理を適用すると、 `(A OR B)` が `(NOT A AND NOT B)` になります。

したがって、元のコードの `answerValue` が空であるかまたは `isValid` が `true` である場合に `shouldShowValidationError` が `true` となります。一方、リファクタリング後のコードでは `answerValue` が空でないかつ `isValid` が `false` である場合に `shouldShowValidationError` が `true` となります。

この新しい表現はド・モルガンの定理を適用しているため、元の表現と同じ結果を出力します。ただし、これによりコードの読みやすさが減少する可能性があります。変数の命名やコードの構造によっては、元の表現の方が直感的である場合があります。ド・モルガンの定理を適用することで得られる利点は、特定のコードの理解やデバッグを助ける可能性があることです。

---

## 👤 ユーザー
*2023/06/22 02:42:04*

QuestionAnswerはIdentifiableである。
ForEach文ももっと綺麗にリファクタしたい。

```swift
public struct QuestionnaireView: View {
    @StateObject var presenter: QuestionnairePresenter
    
    public init(mission: Mission) {
        _presenter = StateObject(wrappedValue: QuestionnairePresenter(mission: mission))
        // TextEditの背景設定のためのコード
        UITextView.appearance().backgroundColor = .clear
    }

    public var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                EmomilIconBubbleView(text: CoreStrings.EmomilMission.Questionnaire.bubble(presenter.questionAnswers.count), type: .horizontal)
                
                ForEach(0..<presenter.questionAnswers.count, id: \.self) { index in
                    let questionAnswer = presenter.questionAnswers[index]
                    VStack(alignment: .leading, spacing: 4) {
                        Text(CoreStrings.EmomilMission.Questionnaire.Question.title(index+1, questionAnswer.question.title))
                            .typographyStyle(.body1)
                            .foregroundColor(CoreAssets.Color.Neutral.neutral80.swiftUIColor)
                        
                        switch questionAnswer.question.answerType {
                        case .textField:
                            if #available(iOS 16.0, *) {
                                textEditView(questionAnswer: questionAnswer)
                                    .scrollContentBackground(.hidden)
                            } else {
                                textEditView(questionAnswer: questionAnswer)
                            }
                        case .picker(let choices):
                            pickerView(questionAnswer: questionAnswer, choices: choices)
                        }

                        Text(questionAnswer.validationErrorMessage)
                            .typographyStyle(.caption1)
                            .foregroundColor(CoreAssets.Color.Error.error100.swiftUIColor)
                            .padding(.horizontal, 16)
                            .isHidden(!questionAnswer.shouldShowValidationError, remove: true)
                    }
                }

                Button {
                    presenter.answerButtonTapped()
                } label: {
                    Text(CoreStrings.EmomilMission.Questionnaire.answerButton)
                }
                .buttonStyle(CustomButtonStyle(.primary))
                .padding(.top, 16)
                .disabled(!presenter.isAnswerButtonEnabled)
            }
            .padding(16)
        }
        .background(CoreAssets.Color.Neutral.neutral5.swiftUIColor)
        .task {
            await presenter.onAppear()
        }
        .overlayLoading(isPresented: $presenter.isLoading, allowsGesture: false)
    }
}

```

---

## 🤖 アシスタント
*2023/06/22 02:42:47*

あなたの`QuestionAnswer`型が`Identifiable`プロトコルに準拠しているならば、以下のように`ForEach`ループをリファクタリングできます：

```swift
ForEach(presenter.questionAnswers) { questionAnswer in
    VStack(alignment: .leading, spacing: 4) {
        Text(CoreStrings.EmomilMission.Questionnaire.Question.title(index+1, questionAnswer.question.title))
            .typographyStyle(.body1)
            .foregroundColor(CoreAssets.Color.Neutral.neutral80.swiftUIColor)

        switch questionAnswer.question.answerType {
        case .textField:
            if #available(iOS 16.0, *) {
                textEditView(questionAnswer: questionAnswer)
                    .scrollContentBackground(.hidden)
            } else {
                textEditView(questionAnswer: questionAnswer)
            }
        case .picker(let choices):
            pickerView(questionAnswer: questionAnswer, choices: choices)
        }

        Text(questionAnswer.validationErrorMessage)
            .typographyStyle(.caption1)
            .foregroundColor(CoreAssets.Color.Error.error100.swiftUIColor)
            .padding(.horizontal, 16)
            .isHidden(!questionAnswer.shouldShowValidationError, remove: true)
    }
}
```

ここでは、`ForEach(0..<presenter.questionAnswers.count, id: \.self)` を `ForEach(presenter.questionAnswers)` に変更しています。`Identifiable`プロトコルに準拠しているという事実を利用して、SwiftUIが各要素を一意に識別する方法を指定しています。その結果、`index`の使用が不要になり、直接`questionAnswer`を使用できます。このようにすることで、`QuestionAnswer`オブジェクトのリストをより直接的に反復処理し、コードの明瞭さが向上します。

ただし、この変更により、問題のタイトルを生成するための`index+1`が利用できなくなります。このインデックス値が絶対に必要な場合は、`Array`の`enumerated()`メソッドを使用して`index`を保持することもできます。

---

## 👤 ユーザー
*2023/06/22 03:00:59*

enumerated()メソッドつかってほしい

---

## 🤖 アシスタント
*2023/06/22 03:01:50*

了解しました。その場合は、`enumerated()`メソッドを用いてタプル型でインデックスと要素を同時に取得できます。ただし、SwiftUIの`ForEach`はコレクションを直接ループすることを想定しており、`enumerated()`メソッドを直接使うことはできません。そこで、タプル型の配列を新たに作り、その配列をループすることで`enumerated()`と同等の処理を実現します。

以下がそのためのコードになります：

```swift
ForEach(Array(presenter.questionAnswers.enumerated()), id: \.offset) { index, questionAnswer in
    VStack(alignment: .leading, spacing: 4) {
        Text(CoreStrings.EmomilMission.Questionnaire.Question.title(index+1, questionAnswer.question.title))
            .typographyStyle(.body1)
            .foregroundColor(CoreAssets.Color.Neutral.neutral80.swiftUIColor)

        switch questionAnswer.question.answerType {
        case .textField:
            if #available(iOS 16.0, *) {
                textEditView(questionAnswer: questionAnswer)
                    .scrollContentBackground(.hidden)
            } else {
                textEditView(questionAnswer: questionAnswer)
            }
        case .picker(let choices):
            pickerView(questionAnswer: questionAnswer, choices: choices)
        }

        Text(questionAnswer.validationErrorMessage)
            .typographyStyle(.caption1)
            .foregroundColor(CoreAssets.Color.Error.error100.swiftUIColor)
            .padding(.horizontal, 16)
            .isHidden(!questionAnswer.shouldShowValidationError, remove: true)
    }
}
```

ここで、`Array(presenter.questionAnswers.enumerated())`で新たにタプル型の配列を作り、その各要素の`offset`（インデックス）と`element`（要素）を取り出しています。また、`id: \.offset`で各要素を一意に識別しています。

これで、`index`の値を保持しつつ、`QuestionAnswer`オブジェクトのリストを直接ループすることができます。

---
