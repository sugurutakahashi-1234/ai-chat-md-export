# NavigationView with NavigationLink

日付: 2023-07-01

---

## 👤 ユーザー
*2023/07/01 22:37:17*

こちらの処理をnavigationViewとnavigationLinkの処理で書き換えて欲しい

```
struct MissionPageNavigatorView: View {
    let mission: Mission
    @StateObject private var navigator: MissionPageNavigator

    init(mission: Mission, shouldShowMissionDetail: Binding<Bool>, shouldShowMissionPage: Binding<Bool>) {
        self.mission = mission
        _navigator = .init(
            wrappedValue: MissionPageNavigator(
                mission: mission,
                shouldShowMissionDetail: shouldShowMissionDetail,
                shouldShowMissionPage: shouldShowMissionPage
            )
        )
    }

    var body: some View {
        NavigationStack(path: $navigator.pageTypes) {
            if let missionTypeDetail = mission.missionTypeDetails.first {
                preparationView(
                    detail: missionTypeDetail,
                    stepType: navigator.stepType
                )
                .navigationTitle(CoreStrings.Common.request)
                .navigationBarTitleDisplayMode(.inline)
                .navigationDestination(for: MissionPageType.self) { type in
                    switch type {
                    case .preparation(let missionTypeDetail):
                        preparationView(
                            detail: missionTypeDetail,
                            stepType: navigator.stepType
                        )
                    case .videoPreparation(let sessionId, let type):
                        MissionVideoPreparationView(sessionId: sessionId, missionVideoType: type)
                    case .watchVideo(let sessionId, let movie):
                        MissionVideoPreparationView(
                            sessionId: sessionId,
                            missionVideoType: .movie(movie: movie)
                        )
                    case .watchWeb(let sessionId, let web):
                        MissionVideoPreparationView(
                            sessionId: sessionId,
                            missionVideoType: .web(web: web)
                        )
                    case .answerQuestions(let sessionId, let questionnaire):
                        QuestionnaireView(
                            sessionId: sessionId,
                            questionnaire: questionnaire
                        )
                    case .interview(let sessionId, let interview):
                        MissionTestView(missionType: .interview(interview: interview))
                    case .result(let mission):
                        MissionResultView(resultType: .didComplete, mission: mission)
                    }
                }
            } else {
                EmptyView()
            }
        }
//        .fixedSize(horizontal: true, vertical: false)
        .environmentObject(navigator)
    }
}

private extension MissionPageNavigatorView {
    func preparationView(
        detail: MissionTypeDetail,
        stepType: MissionPreparationPresenter.MissionStepType
    ) -> some View {
        MissionPreparationView(
            missionTypeDetail: detail,
            stepType: stepType
        )
    }
}

struct MissionPageNavigatorView_Previews: PreviewProvider {
    @State static var shouldShowMissionDetail = true
    @State static var shouldShowMissionPage = true

    static var previews: some View {
        MissionPageNavigatorView(
            mission: .mock,
            shouldShowMissionDetail: $shouldShowMissionDetail,
            shouldShowMissionPage: $shouldShowMissionPage
        )
    }
}
```

---

## 🤖 アシスタント
*2023/07/01 22:38:02*

指定のSwiftUIコードをNavigationViewとNavigationLinkで書き換えるには、以下のように実施できます。ただし、実際のアプリケーションでこの修正を適用する際は、各ビューが正しく遷移と通信を行うために、各ビューの実装と結合を適切に行う必要があります。

```swift
struct MissionPageNavigatorView: View {
    @State private var selectedPage: MissionPageType? = nil

    var body: some View {
        NavigationView {
            List(MissionPageType.allCases, id: \.self) { page in
                NavigationLink(
                    destination: destinationView(for: page),
                    tag: page,
                    selection: $selectedPage
                ) {
                    Text(page.title)
                }
            }
            .navigationBarTitle(CoreStrings.Common.request, displayMode: .inline)
        }
    }

    @ViewBuilder
    private func destinationView(for type: MissionPageType) -> some View {
        switch type {
        case .preparation(let missionTypeDetail):
            preparationView(detail: missionTypeDetail, stepType: navigator.stepType)
        case .videoPreparation(let sessionId, let type):
            MissionVideoPreparationView(sessionId: sessionId, missionVideoType: type)
        case .watchVideo(let sessionId, let movie):
            MissionVideoPreparationView(sessionId: sessionId, missionVideoType: .movie(movie: movie))
        case .watchWeb(let sessionId, let web):
            MissionVideoPreparationView(sessionId: sessionId, missionVideoType: .web(web: web))
        case .answerQuestions(let sessionId, let questionnaire):
            QuestionnaireView(sessionId: sessionId, questionnaire: questionnaire)
        case .interview(let sessionId, let interview):
            MissionTestView(missionType: .interview(interview: interview))
        case .result(let mission):
            MissionResultView(resultType: .didComplete, mission: mission)
        }
    }
    
    private func preparationView(detail: MissionTypeDetail, stepType: MissionPreparationPresenter.MissionStepType) -> some View {
        MissionPreparationView(missionTypeDetail: detail, stepType: stepType)
    }
}
```

この例では、NavigationViewを使用してメインのリストビューを作成し、それぞれのリストアイテムがNavigationLinkとして機能します。各NavigationLinkは、タップされるとその`destinationView`に遷移します。

ただし、具体的なアプリケーションの仕様や動作によって、NavigationLinkとNavigationViewの使用方法は異なる可能性があります。例えば、選択されたアイテムに基づいて複数の目的地ビューを動的に変更する必要がある場合、この方法は適切かもしれません。

また、この修正がアプリケーションの他の部分とどのように統合されるか、または必要なビューがすべて正確に初期化されているかを確認するために、さらに詳細な情報やコードが必要な場合もあります。

---

## 👤 ユーザー
*2023/07/01 22:38:54*

if let missionTypeDetail = mission.missionTypeDetails.first {
                preparationView(
                    detail: missionTypeDetail,
                    stepType: navigator.stepType
                ) の処理が考慮されていない気がする

---

## 🤖 アシスタント
*2023/07/01 22:39:32*

すみません、その点を見落としていました。そうですね、最初に表示されるビューを最初のmissionTypeDetailに基づいて表示するように修正すべきです。

コードは以下のようになります。

```swift
struct MissionPageNavigatorView: View {
    let mission: Mission
    @State private var selectedPage: MissionPageType? = nil

    var body: some View {
        NavigationView {
            if let missionTypeDetail = mission.missionTypeDetails.first {
                preparationView(detail: missionTypeDetail, stepType: navigator.stepType)
                List(MissionPageType.allCases, id: \.self) { page in
                    NavigationLink(
                        destination: destinationView(for: page),
                        tag: page,
                        selection: $selectedPage
                    ) {
                        Text(page.title)
                    }
                }
                .navigationBarTitle(CoreStrings.Common.request, displayMode: .inline)
            }
        }
    }

    @ViewBuilder
    private func destinationView(for type: MissionPageType) -> some View {
        switch type {
        case .preparation(let missionTypeDetail):
            preparationView(detail: missionTypeDetail, stepType: navigator.stepType)
        case .videoPreparation(let sessionId, let type):
            MissionVideoPreparationView(sessionId: sessionId, missionVideoType: type)
        case .watchVideo(let sessionId, let movie):
            MissionVideoPreparationView(sessionId: sessionId, missionVideoType: .movie(movie: movie))
        case .watchWeb(let sessionId, let web):
            MissionVideoPreparationView(sessionId: sessionId, missionVideoType: .web(web: web))
        case .answerQuestions(let sessionId, let questionnaire):
            QuestionnaireView(sessionId: sessionId, questionnaire: questionnaire)
        case .interview(let sessionId, let interview):
            MissionTestView(missionType: .interview(interview: interview))
        case .result(let mission):
            MissionResultView(resultType: .didComplete, mission: mission)
        }
    }
    
    private func preparationView(detail: MissionTypeDetail, stepType: MissionPreparationPresenter.MissionStepType) -> some View {
        MissionPreparationView(missionTypeDetail: detail, stepType: stepType)
    }
}
```

ここでは、NavigationViewの中に最初に表示されるビューとリストビューを含めています。missionTypeDetailsの最初の要素が存在する場合、その詳細に基づいて初期ビュー（preparationView）が表示されます。それ以降のページ遷移はリストのNavigationLinkによって制御されます。

---

## 👤 ユーザー
*2023/07/01 22:41:07*

.environmentObject(navigator) も抜けている気がする抜けている処理も書いて欲しい

---

## 🤖 アシスタント
*2023/07/01 22:41:56*

大変申し訳ございません、その点を見落としていました。実際には、作成されたView全体に`EnvironmentObject`を提供する必要があります。以下にその修正を適用したコードを示します：

```swift
struct MissionPageNavigatorView: View {
    let mission: Mission
    @StateObject private var navigator: MissionPageNavigator
    @State private var selectedPage: MissionPageType? = nil

    init(mission: Mission, shouldShowMissionDetail: Binding<Bool>, shouldShowMissionPage: Binding<Bool>) {
        self.mission = mission
        _navigator = .init(
            wrappedValue: MissionPageNavigator(
                mission: mission,
                shouldShowMissionDetail: shouldShowMissionDetail,
                shouldShowMissionPage: shouldShowMissionPage
            )
        )
    }

    var body: some View {
        NavigationView {
            if let missionTypeDetail = mission.missionTypeDetails.first {
                preparationView(detail: missionTypeDetail, stepType: navigator.stepType)
                List(MissionPageType.allCases, id: \.self) { page in
                    NavigationLink(
                        destination: destinationView(for: page),
                        tag: page,
                        selection: $selectedPage
                    ) {
                        Text(page.title)
                    }
                }
                .navigationBarTitle(CoreStrings.Common.request, displayMode: .inline)
            }
        }
        .environmentObject(navigator)
    }

    @ViewBuilder
    private func destinationView(for type: MissionPageType) -> some View {
        switch type {
        case .preparation(let missionTypeDetail):
            preparationView(detail: missionTypeDetail, stepType: navigator.stepType)
        case .videoPreparation(let sessionId, let type):
            MissionVideoPreparationView(sessionId: sessionId, missionVideoType: type)
        case .watchVideo(let sessionId, let movie):
            MissionVideoPreparationView(sessionId: sessionId, missionVideoType: .movie(movie: movie))
        case .watchWeb(let sessionId, let web):
            MissionVideoPreparationView(sessionId: sessionId, missionVideoType: .web(web: web))
        case .answerQuestions(let sessionId, let questionnaire):
            QuestionnaireView(sessionId: sessionId, questionnaire: questionnaire)
        case .interview(let sessionId, let interview):
            MissionTestView(missionType: .interview(interview: interview))
        case .result(let mission):
            MissionResultView(resultType: .didComplete, mission: mission)
        }
    }

    private func preparationView(detail: MissionTypeDetail, stepType: MissionPreparationPresenter.MissionStepType) -> some View {
        MissionPreparationView(missionTypeDetail: detail, stepType: stepType)
    }
}
```

ここでは、NavigationView全体に`.environmentObject(navigator)`を適用して、必要なすべてのビューが`navigator`オブジェクトにアクセスできるようにしています。このようにすることで、必要なビューで`navigator`を参照できます。

---
