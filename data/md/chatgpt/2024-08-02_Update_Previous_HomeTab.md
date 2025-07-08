# Update Previous HomeTab

日付: 2024-08-02

---

## 👤 ユーザー
*2024/08/02 17:53:27*

previousHomeTab を プレゼンターのselectedHomeTab の検知で更新できないか


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
        .sheet(isPresented: $presenter.showBoxPost) {
            BoxPostView(dependency: dependency)
        }
    }
}

// MARK: - Presenter

import Combine

@MainActor
final class HomeTabPresenter: ObservableObject {
    @Published var selectedHomeTab: HomeTab
    @Published var showBoxPost: Bool = false
    private var previousHomeTab: HomeTab
    private var cancellables = Set&lt;AnyCancellable&gt;()

    init(homeTab: HomeTab) {
        OSLogger.initLog()

        selectedHomeTab = homeTab
        previousHomeTab = homeTab

        // selectedHomeTabの変更を監視
        $selectedHomeTab
            .removeDuplicates()
            .sink { [weak self] newTab in
                switch newTab {
                case .post:
                    self?.onTapPostTab()
                case .home, .account:
                    return
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
        selectedHomeTab = previousHomeTab
        showBoxPost = true
    }
}

---

## 🤖 アシスタント
*2024/08/02 17:53:54*

`selectedHomeTab` の変更を監視して `previousHomeTab` を更新するためには、`selectedHomeTab` の変更を検知するたびに `previousHomeTab` を更新する必要があります。これを実現するには、`$selectedHomeTab` の変更を監視して、その変更が `previousHomeTab` に反映されるようにします。以下のように修正できます。

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

// MARK: - Presenter

import Combine

@MainActor
final class HomeTabPresenter: ObservableObject {
    @Published var selectedHomeTab: HomeTab
    @Published var showBoxPost: Bool = false
    private var previousHomeTab: HomeTab
    private var cancellables = Set<AnyCancellable>()

    init(homeTab: HomeTab) {
        OSLogger.initLog()

        selectedHomeTab = homeTab
        previousHomeTab = homeTab

        // selectedHomeTabの変更を監視
        $selectedHomeTab
            .removeDuplicates()
            .sink { [weak self] newTab in
                guard let self = self else { return }
                // previousHomeTab を更新
                self.previousHomeTab = self.selectedHomeTab
                
                switch newTab {
                case .post:
                    self.onTapPostTab()
                case .home, .account:
                    return
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
        // BoxPost を表示している間に previousHomeTab に戻す
        selectedHomeTab = previousHomeTab
        showBoxPost = true
    }
}
```

このようにすることで、`selectedHomeTab` の変更を監視し、それが変更されるたびに `previousHomeTab` を更新します。また、`onTapPostTab` メソッドでは、`selectedHomeTab` を `previousHomeTab` に戻しつつ、`showBoxPost` を `true` に設定しています。これにより、`post` タブが選択されたときに正しく `previousHomeTab` に戻るようになります。

---

## 👤 ユーザー
*2024/08/02 17:54:37*

でもこれだと postタブにならない？

---

## 🤖 アシスタント
*2024/08/02 17:55:03*

ご指摘ありがとうございます。`post` タブに移動した後、`previousHomeTab` に戻してしまうので、`post` タブにならない問題があります。この問題を解決するには、`post` タブに移動した後、`previousHomeTab` に戻す前に一時的に `showBoxPost` をトリガーするようにします。

以下のように修正して、`post` タブに移動した後 `previousHomeTab` に戻すようにしますが、この間に一時的に `showBoxPost` をトリガーします：

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

// MARK: - Presenter

import Combine

@MainActor
final class HomeTabPresenter: ObservableObject {
    @Published var selectedHomeTab: HomeTab
    @Published var showBoxPost: Bool = false
    private var previousHomeTab: HomeTab
    private var cancellables = Set<AnyCancellable>()

    init(homeTab: HomeTab) {
        OSLogger.initLog()

        selectedHomeTab = homeTab
        previousHomeTab = homeTab

        // selectedHomeTabの変更を監視
        $selectedHomeTab
            .removeDuplicates()
            .sink { [weak self] newTab in
                guard let self = self else { return }
                if newTab != .post {
                    self.previousHomeTab = self.selectedHomeTab
                }
                switch newTab {
                case .post:
                    self.onTapPostTab()
                case .home, .account:
                    return
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
        // BoxPost を表示している間に previousHomeTab に戻す
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
            self.showBoxPost = true
            self.selectedHomeTab = self.previousHomeTab
        }
    }
}
```

この修正では、`selectedHomeTab` が `post` に変更されたときに、`showBoxPost` を `true` に設定し、少し遅らせて `previousHomeTab` に戻します。これにより、ユーザーが `post` タブを選択したときに `BoxPostView` が表示され、その後元のタブに戻るようになります。

---
