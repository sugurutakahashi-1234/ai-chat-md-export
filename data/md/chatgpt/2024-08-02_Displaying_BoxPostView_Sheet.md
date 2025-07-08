# Displaying BoxPostView Sheet

Date: 2024-08-02

---

## 👤 User
*2024-08-02 17:05:02*

postタブのときに、BoxPostView のタブに切り替わるのではなく、既存のタブのままBoxPostViewをsheetで表示させたい。どうすればいいか？


// MARK: - View

struct HomeTabView&lt;Dependency: RootDIContainerDependency&gt;: View {
    private let dependency: Dependency
    @StateObject private var presenter: HomeTabPresenter

    init(dependency: Dependency, homeTab: HomeTab = .home) {
        self.dependency = dependency
        _presenter = .init(wrappedValue: .init(homeTab: homeTab))
    }

    var body: some View {
        TabView(selection: $presenter.selectedHomeTab) {
            ForEach(HomeTab.allCases) { tab in
                tab.contentView(dependency: dependency)
                    .navigationStacked()
                    .tabItem {
                        tab.label
                    }
                    .tag(tab)
            }
        }
    }
}

// MARK: - Presenter

import Combine

@MainActor
final class HomeTabPresenter: ObservableObject {
    @Published var selectedHomeTab: HomeTab
    private var cancellables = Set&lt;AnyCancellable&gt;()

    init(homeTab: HomeTab) {
        OSLogger.initLog()

        selectedHomeTab = homeTab

        // TODO: #130 【Push通知】画面管理を見直す
        AppStateSingletonDriver.shared.$customUrlSchema
            .compactMap { customUrlSchema in
                switch customUrlSchema {
                case .pushNotification:
                    .home
                default:
                    nil
                }
            }
            .assign(to: &$selectedHomeTab)
    }

    deinit {
        OSLogger.deinitLog()
    }

    func onAppear() async {
        OSLogger.onAppearLog()
    }

    func onDisappear() {
        OSLogger.onDisappearLog()
    }
}

// MARK: - Extension

private extension HomeTab {
    @ViewBuilder
    var label: some View {
        switch self {
        case .home:
            SFSymbols.house.image
        case .post:
            SFSymbols.plusCircle.image
        case .account:
            SFSymbols.personCropCircle.image
        }
    }

    @MainActor @ViewBuilder
    func contentView(dependency: some RootDIContainerDependency) -&gt; some View {
        switch self {
        case .home:
            BoxListView(dependency: dependency)
        case .post:
            BoxPostView(dependency: dependency)
        case .account:
            MyPageView(dependency: dependency)
        }
    }
}

---

## 🤖 Assistant
*2024-08-02 17:05:12*

`BoxPostView`をタブに切り替えるのではなく、既存のタブの上にシートで表示するには、`HomeTabPresenter`に`isBoxPostViewPresented`という状態を追加し、その状態に基づいて`sheet`を表示するようにします。

以下はその実装例です。

### HomeTabView

```swift
struct HomeTabView<Dependency: RootDIContainerDependency>: View {
    private let dependency: Dependency
    @StateObject private var presenter: HomeTabPresenter

    init(dependency: Dependency, homeTab: HomeTab = .home) {
        self.dependency = dependency
        _presenter = .init(wrappedValue: .init(homeTab: homeTab))
    }

    var body: some View {
        TabView(selection: $presenter.selectedHomeTab) {
            ForEach(HomeTab.allCases) { tab in
                tab.contentView(dependency: dependency, presenter: presenter)
                    .navigationStacked()
                    .tabItem {
                        tab.label
                    }
                    .tag(tab)
            }
        }
        .sheet(isPresented: $presenter.isBoxPostViewPresented) {
            BoxPostView(dependency: dependency)
        }
    }
}
```

### HomeTabPresenter

```swift
import Combine

@MainActor
final class HomeTabPresenter: ObservableObject {
    @Published var selectedHomeTab: HomeTab
    @Published var isBoxPostViewPresented: Bool = false
    private var cancellables = Set<AnyCancellable>()

    init(homeTab: HomeTab) {
        OSLogger.initLog()

        selectedHomeTab = homeTab

        // TODO: #130 【Push通知】画面管理を見直す
        AppStateSingletonDriver.shared.$customUrlSchema
            .compactMap { customUrlSchema in
                switch customUrlSchema {
                case .pushNotification:
                    .home
                default:
                    nil
                }
            }
            .assign(to: &$selectedHomeTab)
    }

    deinit {
        OSLogger.deinitLog()
    }

    func onAppear() async {
        OSLogger.onAppearLog()
    }

    func onDisappear() {
        OSLogger.onDisappearLog()
    }

    func showBoxPostView() {
        isBoxPostViewPresented = true
    }
}
```

### HomeTab Extension

```swift
private extension HomeTab {
    @ViewBuilder
    var label: some View {
        switch self {
        case .home:
            SFSymbols.house.image
        case .post:
            SFSymbols.plusCircle.image
        case .account:
            SFSymbols.personCropCircle.image
        }
    }

    @MainActor @ViewBuilder
    func contentView(dependency: some RootDIContainerDependency, presenter: HomeTabPresenter) -> some View {
        switch self {
        case .home:
            BoxListView(dependency: dependency)
        case .post:
            Button(action: {
                presenter.showBoxPostView()
            }) {
                Text("Post")
            }
        case .account:
            MyPageView(dependency: dependency)
        }
    }
}
```

この実装では、`post`タブを選択した際に`Button`を表示し、そのボタンをタップすると`HomeTabPresenter`の`isBoxPostViewPresented`が`true`に設定され、`BoxPostView`がシートとして表示されます。これにより、タブを切り替えずに`BoxPostView`を表示することができます。

---

## 👤 User
*2024-08-02 17:06:07*

isBoxPostViewPresentedをshowBoxPost にして、 func showBoxPostView() を onTapPostTabとしてほしい

---

## 🤖 Assistant
*2024-08-02 17:06:32*

`isBoxPostViewPresented`を`showBoxPost`に変更し、`showBoxPostView`を`onTapPostTab`に変更するように実装を更新します。

### HomeTabView

```swift
struct HomeTabView<Dependency: RootDIContainerDependency>: View {
    private let dependency: Dependency
    @StateObject private var presenter: HomeTabPresenter

    init(dependency: Dependency, homeTab: HomeTab = .home) {
        self.dependency = dependency
        _presenter = .init(wrappedValue: .init(homeTab: homeTab))
    }

    var body: some View {
        TabView(selection: $presenter.selectedHomeTab) {
            ForEach(HomeTab.allCases) { tab in
                tab.contentView(dependency: dependency, presenter: presenter)
                    .navigationStacked()
                    .tabItem {
                        tab.label
                    }
                    .tag(tab)
            }
        }
        .sheet(isPresented: $presenter.showBoxPost) {
            BoxPostView(dependency: dependency)
        }
    }
}
```

### HomeTabPresenter

```swift
import Combine

@MainActor
final class HomeTabPresenter: ObservableObject {
    @Published var selectedHomeTab: HomeTab
    @Published var showBoxPost: Bool = false
    private var cancellables = Set<AnyCancellable>()

    init(homeTab: HomeTab) {
        OSLogger.initLog()

        selectedHomeTab = homeTab

        // TODO: #130 【Push通知】画面管理を見直す
        AppStateSingletonDriver.shared.$customUrlSchema
            .compactMap { customUrlSchema in
                switch customUrlSchema {
                case .pushNotification:
                    .home
                default:
                    nil
                }
            }
            .assign(to: &$selectedHomeTab)
    }

    deinit {
        OSLogger.deinitLog()
    }

    func onAppear() async {
        OSLogger.onAppearLog()
    }

    func onDisappear() {
        OSLogger.onDisappearLog()
    }

    func onTapPostTab() {
        showBoxPost = true
    }
}
```

### HomeTab Extension

```swift
private extension HomeTab {
    @ViewBuilder
    var label: some View {
        switch self {
        case .home:
            SFSymbols.house.image
        case .post:
            SFSymbols.plusCircle.image
        case .account:
            SFSymbols.personCropCircle.image
        }
    }

    @MainActor @ViewBuilder
    func contentView(dependency: some RootDIContainerDependency, presenter: HomeTabPresenter) -> some View {
        switch self {
        case .home:
            BoxListView(dependency: dependency)
        case .post:
            Button(action: {
                presenter.onTapPostTab()
            }) {
                Text("Post")
            }
        case .account:
            MyPageView(dependency: dependency)
        }
    }
}
```

この変更により、`isBoxPostViewPresented`は`showBoxPost`に、`showBoxPostView`は`onTapPostTab`に変更されました。これにより、タブを切り替えずに`BoxPostView`をシートとして表示することができます。

---

## 👤 User
*2024-08-02 17:08:31*

この処理でpresenterが参照できない

Button(action: {
                presenter.onTapPostTab()
            }) {
                Text("Post")
            }

---

## 🤖 Assistant
*2024-08-02 17:08:50*

`Button`内で`presenter`を参照できるようにするために、`contentView`メソッドに`presenter`を渡す必要があります。以下はそのための修正です。

### HomeTabView

```swift
struct HomeTabView<Dependency: RootDIContainerDependency>: View {
    private let dependency: Dependency
    @StateObject private var presenter: HomeTabPresenter

    init(dependency: Dependency, homeTab: HomeTab = .home) {
        self.dependency = dependency
        _presenter = .init(wrappedValue: .init(homeTab: homeTab))
    }

    var body: some View {
        TabView(selection: $presenter.selectedHomeTab) {
            ForEach(HomeTab.allCases) { tab in
                tab.contentView(dependency: dependency, presenter: presenter)
                    .navigationStacked()
                    .tabItem {
                        tab.label
                    }
                    .tag(tab)
            }
        }
        .sheet(isPresented: $presenter.showBoxPost) {
            BoxPostView(dependency: dependency)
        }
    }
}
```

### HomeTab Extension

```swift
private extension HomeTab {
    @ViewBuilder
    var label: some View {
        switch self {
        case .home:
            SFSymbols.house.image
        case .post:
            SFSymbols.plusCircle.image
        case .account:
            SFSymbols.personCropCircle.image
        }
    }

    @MainActor @ViewBuilder
    func contentView(dependency: some RootDIContainerDependency, presenter: HomeTabPresenter) -> some View {
        switch self {
        case .home:
            BoxListView(dependency: dependency)
        case .post:
            PostTabView(presenter: presenter)
        case .account:
            MyPageView(dependency: dependency)
        }
    }
}
```

### PostTabView

新たに`PostTabView`を定義して、`Button`が正しく`presenter`を参照できるようにします。

```swift
struct PostTabView: View {
    @ObservedObject var presenter: HomeTabPresenter

    var body: some View {
        Button(action: {
            presenter.onTapPostTab()
        }) {
            Text("Post")
        }
    }
}
```

この変更により、`Button`のアクション内で`presenter`を正しく参照できるようになります。また、`contentView`メソッドに`presenter`を渡しているため、`PostTabView`は`presenter`の状態を監視できます。

---

## 👤 User
*2024-08-02 17:09:30*

そもそもcontentViewをpostのときに用意しなくていいのでは、つまりタップを検知したいだけな気がするけど。

---

## 🤖 Assistant
*2024-08-02 17:10:00*

確かに、`post`タブをタップしたときに`BoxPostView`をシートで表示したい場合は、`contentView`メソッドで特定のビューを表示する必要はなく、タップを検知するだけで十分です。`TabView`の`onChange`モディファイアを使用してタブの選択変更を検知し、`post`タブが選択されたときに`BoxPostView`を表示するロジックを追加します。

以下にその方法を示します。

### HomeTabView

```swift
struct HomeTabView<Dependency: RootDIContainerDependency>: View {
    private let dependency: Dependency
    @StateObject private var presenter: HomeTabPresenter

    init(dependency: Dependency, homeTab: HomeTab = .home) {
        self.dependency = dependency
        _presenter = .init(wrappedValue: .init(homeTab: homeTab))
    }

    var body: some View {
        TabView(selection: $presenter.selectedHomeTab) {
            ForEach(HomeTab.allCases) { tab in
                tab.contentView(dependency: dependency)
                    .navigationStacked()
                    .tabItem {
                        tab.label
                    }
                    .tag(tab)
            }
        }
        .onChange(of: presenter.selectedHomeTab) { newTab in
            if newTab == .post {
                presenter.onTapPostTab()
            }
        }
        .sheet(isPresented: $presenter.showBoxPost) {
            BoxPostView(dependency: dependency)
        }
    }
}
```

### HomeTabPresenter

```swift
import Combine

@MainActor
final class HomeTabPresenter: ObservableObject {
    @Published var selectedHomeTab: HomeTab
    @Published var showBoxPost: Bool = false
    private var cancellables = Set<AnyCancellable>()

    init(homeTab: HomeTab) {
        OSLogger.initLog()

        selectedHomeTab = homeTab

        // TODO: #130 【Push通知】画面管理を見直す
        AppStateSingletonDriver.shared.$customUrlSchema
            .compactMap { customUrlSchema in
                switch customUrlSchema {
                case .pushNotification:
                    .home
                default:
                    nil
                }
            }
            .assign(to: &$selectedHomeTab)
    }

    deinit {
        OSLogger.deinitLog()
    }

    func onAppear() async {
        OSLogger.onAppearLog()
    }

    func onDisappear() {
        OSLogger.onDisappearLog()
    }

    func onTapPostTab() {
        showBoxPost = true
        selectedHomeTab = .home // タブをホームに戻す
    }
}
```

### HomeTab Extension

```swift
private extension HomeTab {
    @ViewBuilder
    var label: some View {
        switch self {
        case .home:
            SFSymbols.house.image
        case .post:
            SFSymbols.plusCircle.image
        case .account:
            SFSymbols.personCropCircle.image
        }
    }

    @MainActor @ViewBuilder
    func contentView(dependency: some RootDIContainerDependency) -> some View {
        switch self {
        case .home:
            BoxListView(dependency: dependency)
        case .post:
            // タップを検知するだけなので、ビューは空でOK
            EmptyView()
        case .account:
            MyPageView(dependency: dependency)
        }
    }
}
```

この実装では、`post`タブが選択されたときに`presenter.onTapPostTab()`が呼び出され、`BoxPostView`がシートとして表示されます。また、タブをホームに戻すために、`selectedHomeTab`を`.home`に設定しています。これにより、`BoxPostView`が表示された後、タブがホームに戻ります。

---

## 👤 User
*2024-08-02 17:10:08*

selectedHomeTab の変更はViewではなくて presenterのinitでCombineで監視したい

---

## 🤖 Assistant
*2024-08-02 17:10:35*

`Combine`を使って`selectedHomeTab`の変更を監視し、`post`タブが選択されたときに`BoxPostView`を表示するロジックを`HomeTabPresenter`に追加する方法を以下に示します。

### HomeTabView

```swift
struct HomeTabView<Dependency: RootDIContainerDependency>: View {
    private let dependency: Dependency
    @StateObject private var presenter: HomeTabPresenter

    init(dependency: Dependency, homeTab: HomeTab = .home) {
        self.dependency = dependency
        _presenter = .init(wrappedValue: .init(homeTab: homeTab))
    }

    var body: some View {
        TabView(selection: $presenter.selectedHomeTab) {
            ForEach(HomeTab.allCases) { tab in
                tab.contentView(dependency: dependency)
                    .navigationStacked()
                    .tabItem {
                        tab.label
                    }
                    .tag(tab)
            }
        }
        .sheet(isPresented: $presenter.showBoxPost) {
            BoxPostView(dependency: dependency)
        }
    }
}
```

### HomeTabPresenter

```swift
import Combine

@MainActor
final class HomeTabPresenter: ObservableObject {
    @Published var selectedHomeTab: HomeTab
    @Published var showBoxPost: Bool = false
    private var cancellables = Set<AnyCancellable>()

    init(homeTab: HomeTab) {
        OSLogger.initLog()
        selectedHomeTab = homeTab

        // selectedHomeTabの変更を監視
        $selectedHomeTab
            .sink { [weak self] newTab in
                guard let self = self else { return }
                if newTab == .post {
                    self.onTapPostTab()
                }
            }
            .store(in: &cancellables)

        // TODO: #130 【Push通知】画面管理を見直す
        AppStateSingletonDriver.shared.$customUrlSchema
            .compactMap { customUrlSchema in
                switch customUrlSchema {
                case .pushNotification:
                    .home
                default:
                    nil
                }
            }
            .assign(to: &$selectedHomeTab)
    }

    deinit {
        OSLogger.deinitLog()
    }

    func onAppear() async {
        OSLogger.onAppearLog()
    }

    func onDisappear() {
        OSLogger.onDisappearLog()
    }

    func onTapPostTab() {
        showBoxPost = true
        selectedHomeTab = .home // タブをホームに戻す
    }
}
```

### HomeTab Extension

```swift
private extension HomeTab {
    @ViewBuilder
    var label: some View {
        switch self {
        case .home:
            SFSymbols.house.image
        case .post:
            SFSymbols.plusCircle.image
        case .account:
            SFSymbols.personCropCircle.image
        }
    }

    @MainActor @ViewBuilder
    func contentView(dependency: some RootDIContainerDependency) -> some View {
        switch self {
        case .home:
            BoxListView(dependency: dependency)
        case .post:
            // タップを検知するだけなので、ビューは空でOK
            EmptyView()
        case .account:
            MyPageView(dependency: dependency)
        }
    }
}
```

この実装では、`selectedHomeTab`の変更を`Combine`を使って監視し、`post`タブが選択されたときに`BoxPostView`がシートとして表示されるようにしています。また、`BoxPostView`が表示された後、タブがホームに戻るように`selectedHomeTab`を`.home`に設定しています。

---

## 👤 User
*2024-08-02 17:34:14*

post タブを閉じた時に元々いたtabを表示させたいんだ。

---

## 🤖 Assistant
*2024-08-02 17:34:48*

`post`タブを閉じたときに元のタブに戻るようにするためには、`selectedHomeTab`を変更する前に現在のタブを保持しておく必要があります。その後、シートを閉じたときに元のタブに戻すようにします。

以下はその実装例です。

### HomeTabView

```swift
struct HomeTabView<Dependency: RootDIContainerDependency>: View {
    private let dependency: Dependency
    @StateObject private var presenter: HomeTabPresenter

    init(dependency: Dependency, homeTab: HomeTab = .home) {
        self.dependency = dependency
        _presenter = .init(wrappedValue: .init(homeTab: homeTab))
    }

    var body: some View {
        TabView(selection: $presenter.selectedHomeTab) {
            ForEach(HomeTab.allCases) { tab in
                tab.contentView(dependency: dependency)
                    .navigationStacked()
                    .tabItem {
                        tab.label
                    }
                    .tag(tab)
            }
        }
        .sheet(isPresented: $presenter.showBoxPost, onDismiss: {
            presenter.onDismissPostTab()
        }) {
            BoxPostView(dependency: dependency)
        }
    }
}
```

### HomeTabPresenter

```swift
import Combine

@MainActor
final class HomeTabPresenter: ObservableObject {
    @Published var selectedHomeTab: HomeTab
    @Published var showBoxPost: Bool = false
    private var previousHomeTab: HomeTab?
    private var cancellables = Set<AnyCancellable>()

    init(homeTab: HomeTab) {
        OSLogger.initLog()
        selectedHomeTab = homeTab

        // selectedHomeTabの変更を監視
        $selectedHomeTab
            .sink { [weak self] newTab in
                guard let self = self else { return }
                if newTab == .post {
                    self.onTapPostTab()
                }
            }
            .store(in: &cancellables)

        // TODO: #130 【Push通知】画面管理を見直す
        AppStateSingletonDriver.shared.$customUrlSchema
            .compactMap { customUrlSchema in
                switch customUrlSchema {
                case .pushNotification:
                    .home
                default:
                    nil
                }
            }
            .assign(to: &$selectedHomeTab)
    }

    deinit {
        OSLogger.deinitLog()
    }

    func onAppear() async {
        OSLogger.onAppearLog()
    }

    func onDisappear() {
        OSLogger.onDisappearLog()
    }

    func onTapPostTab() {
        previousHomeTab = selectedHomeTab // 現在のタブを保持
        showBoxPost = true
        selectedHomeTab = .home // タブをホームに戻す
    }

    func onDismissPostTab() {
        if let previousTab = previousHomeTab {
            selectedHomeTab = previousTab // 元のタブに戻す
        }
    }
}
```

### HomeTab Extension

```swift
private extension HomeTab {
    @ViewBuilder
    var label: some View {
        switch self {
        case .home:
            SFSymbols.house.image
        case .post:
            SFSymbols.plusCircle.image
        case .account:
            SFSymbols.personCropCircle.image
        }
    }

    @MainActor @ViewBuilder
    func contentView(dependency: some RootDIContainerDependency) -> some View {
        switch self {
        case .home:
            BoxListView(dependency: dependency)
        case .post:
            // タップを検知するだけなので、ビューは空でOK
            EmptyView()
        case .account:
            MyPageView(dependency: dependency)
        }
    }
}
```

この実装では、`post`タブが選択されたときに現在のタブを`previousHomeTab`に保持し、`BoxPostView`を表示します。`BoxPostView`を閉じたときに`previousHomeTab`に保存されていた元のタブに戻ります。これにより、`post`タブを閉じたときに元のタブが表示されるようになります。

---

## 👤 User
*2024-08-02 17:41:41*

実際にtabを着替えるとViewのチラつきが生じる。postタブの上にボタンを重ねてtabの選択ではなくて、ボタンに反応するように実装できないか？

---

## 🤖 Assistant
*2024-08-02 17:42:10*

`post`タブを実際に選択するのではなく、タブの上にボタンを重ねて、ボタンがタップされたときにシートを表示するようにすることができます。この方法なら、タブが切り替わらないのでビューのちらつきが生じません。

以下にその実装例を示します。

### HomeTabView

```swift
struct HomeTabView<Dependency: RootDIContainerDependency>: View {
    private let dependency: Dependency
    @StateObject private var presenter: HomeTabPresenter

    init(dependency: Dependency, homeTab: HomeTab = .home) {
        self.dependency = dependency
        _presenter = .init(wrappedValue: .init(homeTab: homeTab))
    }

    var body: some View {
        ZStack {
            TabView(selection: $presenter.selectedHomeTab) {
                ForEach(HomeTab.allCases) { tab in
                    tab.contentView(dependency: dependency)
                        .navigationStacked()
                        .tabItem {
                            tab.label
                        }
                        .tag(tab)
                }
            }
            .sheet(isPresented: $presenter.showBoxPost) {
                BoxPostView(dependency: dependency)
            }

            // postタブのボタンを重ねる
            VStack {
                Spacer()
                HStack {
                    Spacer()
                    Button(action: {
                        presenter.onTapPostTab()
                    }) {
                        SFSymbols.plusCircle.image
                            .font(.system(size: 24))
                    }
                    .padding()
                }
            }
        }
    }
}
```

### HomeTabPresenter

```swift
import Combine

@MainActor
final class HomeTabPresenter: ObservableObject {
    @Published var selectedHomeTab: HomeTab
    @Published var showBoxPost: Bool = false
    private var cancellables = Set<AnyCancellable>()

    init(homeTab: HomeTab) {
        OSLogger.initLog()
        selectedHomeTab = homeTab

        // TODO: #130 【Push通知】画面管理を見直す
        AppStateSingletonDriver.shared.$customUrlSchema
            .compactMap { customUrlSchema in
                switch customUrlSchema {
                case .pushNotification:
                    .home
                default:
                    nil
                }
            }
            .assign(to: &$selectedHomeTab)
    }

    deinit {
        OSLogger.deinitLog()
    }

    func onAppear() async {
        OSLogger.onAppearLog()
    }

    func onDisappear() {
        OSLogger.onDisappearLog()
    }

    func onTapPostTab() {
        showBoxPost = true
    }
}
```

### HomeTab Extension

```swift
private extension HomeTab {
    @ViewBuilder
    var label: some View {
        switch self {
        case .home:
            SFSymbols.house.image
        case .post:
            SFSymbols.plusCircle.image // ここはアイコンだけ表示する
        case .account:
            SFSymbols.personCropCircle.image
        }
    }

    @MainActor @ViewBuilder
    func contentView(dependency: some RootDIContainerDependency) -> some View {
        switch self {
        case .home:
            BoxListView(dependency: dependency)
        case .post:
            EmptyView() // タップを検知するだけなので、ビューは空でOK
        case .account:
            MyPageView(dependency: dependency)
        }
    }
}
```

この実装では、`post`タブに対応するボタンを画面上に重ねています。ユーザーが`post`タブをタップしたときに、実際には`presenter.onTapPostTab()`が呼び出され、`BoxPostView`がシートとして表示されます。この方法では、タブが切り替わらないため、ビューのちらつきが発生しません。

---
