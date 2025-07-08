# Questionnaire View Implementation

Date: 2023-06-27

---

## 👤 User
*2023-06-28 00:32:51*

public struct QuestionnaireView: View {
    @EnvironmentObject private var navigator: MissionPageNavigator
    @StateObject var presenter: QuestionnairePresenter

    public init(questionnaire: MissionValueType.Questionnaire) {
        _presenter = StateObject(wrappedValue: QuestionnairePresenter(questionnaire: questionnaire))
        // TextEditの背景設定のためのコード
        UITextView.appearance().backgroundColor = .clear
    }

    public var body: some View {
        ZStack {
            NavigationLink("", destination: navigator.nextView, isActive: $presenter.shouldShowNextPage)

            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    EmomilIconBubbleView(text: CoreStrings.EmomilMission.Questionnaire.bubble(presenter.questionAnswers.count), type: .horizontal)

                    ForEach(0..&lt;presenter.questionAnswers.count, id: \.self) { index in
                        let questionAnswer = presenter.questionAnswers[index]
                        VStack(alignment: .leading, spacing: 4) {
                            Text(CoreStrings.EmomilMission.Questionnaire.Question.title(index + 1, questionAnswer.question.title))
                                .typographyStyle(.body1)
                                .foregroundColor(CoreAssets.Color.Neutral.neutral80.swiftUIColor)

                            switch questionAnswer.question.answerType {
                            case .freeDescription:
                                if #available(iOS 16.0, *) {
                                    textEditView(questionAnswer: questionAnswer)
                                        .scrollContentBackground(.hidden)
                                } else {
                                    textEditView(questionAnswer: questionAnswer)
                                }
                            case .singleSelect(let choices):
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
                        Task {
                            await presenter.answerButtonTapped()
                        }
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
        }
        .navigationTitle(CoreStrings.Common.request)
        .task {
            await presenter.onAppear()
            navigator.finishedMissionType = .questionnaire(questionnaire: presenter.questionnaire)
        }
        .overlayLoading(isPresented: $presenter.isLoading, allowsGesture: false)
    }
}

---

## 🤖 Assistant
*2023-06-28 00:33:31*

This is a SwiftUI `View` named `QuestionnaireView` for a questionnaire page. It uses an environment object `navigator`, which is likely used to handle navigation between views. It also uses a `StateObject`, `presenter`, which probably contains the business logic related to the questionnaire, such as fetching data, validation and managing the state of the view.

In the `init` method, it initializes the presenter and sets the background color for `UITextView` to be clear.

The `body` of the view is mainly a `ZStack` that contains a `NavigationLink` for navigating to the next page, and a `ScrollView` for displaying the questionnaire content.

Inside the `ScrollView`, a vertical stack (`VStack`) is used to layout the views. For each question and answer pair in the presenter's `questionAnswers` array, a view consisting of a question title, an answer field (which could be a text edit view or a picker view based on the answer type), and a validation error message, are created.

At the end of the `VStack`, there is a button for submitting the questionnaire. The button is disabled if `presenter.isAnswerButtonEnabled` is `false`.

The view also uses the `.task` modifier to handle tasks that need to be executed when the view appears, in this case, invoking the `onAppear` method of the presenter and setting the `finishedMissionType` of the navigator.

The `.overlayLoading` modifier is used to display a loading overlay when `presenter.isLoading` is `true`.

One thing to note is that the code seems to be making use of a lot of custom views, modifiers, and helpers such as `EmomilIconBubbleView`, `CustomButtonStyle`, `typographyStyle`, and `scrollContentBackground`, which are not standard SwiftUI and are probably defined elsewhere in the project. Also, it uses SwiftUI's concurrency model introduced in iOS 15 to handle asynchronous tasks.

---

## 👤 User
*2023-06-28 00:33:54*

NavigationLinkのためにZstackを使っているんだけどやめたい

日本語で回答して欲しい

---

## 🤖 Assistant
*2023-06-28 00:34:56*

`ZStack`を使って`NavigationLink`を扱うことは、特に目立つボタンなどに対してナビゲーションを割り当てたいが、そのボタンが直接`NavigationLink`として表現されることを望まない場合によく用いられます。このパターンは、ビジュアルデザインを邪魔することなくプログラム的なナビゲーションを提供することができます。

しかし、あなたが`ZStack`を用いたナビゲーションをやめたいとのことであれば、その代わりにどのような手法を探しているかによるかもしれません。

1. **シンプルな`NavigationLink`の使用**: `NavigationLink`は、`ZStack`の代わりに直接ビュー内に配置することができます。ただし、この方法では通常、`NavigationLink`が視覚的に表現され、その視覚的な要素に対するタップがナビゲーションを引き起こします。

    ```swift
    NavigationLink(destination: navigator.nextView, isActive: $presenter.shouldShowNextPage) {
        // The content that should act as the tap target
    }
    ```

2. **`NavigationView`と`NavigationLink`の組み合わせ**: `NavigationLink`は、通常、`NavigationView`と一緒に使われます。`NavigationView`はナビゲーションスタックを管理し、`NavigationLink`は新しいビューをスタックにプッシュする役割を果たします。この方式では、`ZStack`は必要ありません。

    ```swift
    NavigationView {
        List {
            NavigationLink(destination: DetailView()) {
                Text("Go to Detail View")
            }
        }
    }
    ```

これらの代替案があなたの目指す方向に適しているかどうかは、具体的な要件と目的によるでしょう。なお、具体的な目標や要件を詳細に説明していただければ、より具体的なアドバイスができるかもしれません。

---

## 👤 User
*2023-06-28 00:35:14*

モディファイアで上手く隠せる方法なかったっけ？

---

## 🤖 Assistant
*2023-06-28 00:35:48*

はい、その通りです。`NavigationLink`を使用する際に、視覚的な要素を完全に隠したい場合には、`NavigationLink`を`EmptyView`と一緒に使用することができます。この方式では、`ZStack`を使用する必要はありません。

例えば以下のように書くことができます。

```swift
struct QuestionnaireView: View {
    @EnvironmentObject private var navigator: MissionPageNavigator
    @StateObject var presenter: QuestionnairePresenter

    // ...他のコード...

    var body: some View {
        ScrollView {
            // ...ScrollViewの中身...

            NavigationLink(destination: navigator.nextView, isActive: $presenter.shouldShowNextPage) {
                EmptyView()
            }
        }
        // ...他のコード...
    }
}
```

このコードでは、`NavigationLink`は`ScrollView`の一部として定義されていますが、`EmptyView`のため、視覚的な出力はありません。この`NavigationLink`は、`presenter.shouldShowNextPage`が`true`になると自動的にナビゲーションを引き起こします。

この方法であれば、`ZStack`を使用せずに、プログラム的なナビゲーションを`NavigationLink`を用いて実現することができます。

---
