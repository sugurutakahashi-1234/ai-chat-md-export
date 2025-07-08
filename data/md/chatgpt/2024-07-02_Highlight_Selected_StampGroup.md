# Highlight Selected StampGroup

日付: 2024-07-02

---

## 👤 ユーザー
*2024/07/02 18:50:26*

選択中のstampGroupが選択中であることをUIで示したい。

// MARK: - View

public struct StampListView&lt;Dependency: RootDIContainerDependency&gt;: View {
    private let dependency: Dependency
    @StateObject private var presenter: StampListPresenter&lt;Dependency&gt;

    public init(dependency: Dependency, talkThread: TalkThread) {
        self.dependency = dependency
        _presenter = .init(wrappedValue: StampListPresenter(dependency: dependency, talkThread: talkThread))
    }

    public var body: some View {
        ScrollView {
            VStack {
                ScrollView(.horizontal) {
                    LazyHStack {
                        ForEach(presenter.stampGroups, id: \.id) { stampGroup in
                            Button {
                                presenter.onTapStampGroup(stampGroup: stampGroup)
                            } label: {
                                CustomAsyncImageView(imageUrl: stampGroup.imageUrl)
                                    .frame(width: 40, height: 40)
                                    .cornerRadius(8)
                            }
                        }
                    }
                }
                .scrollIndicators(.hidden)
                    
                // Ref: 【SwiftUI】LazyVGrid内の画像を正方形にする【ワークアラウンド】 https://qiita.com/tsuzuki817/items/cc9364089cee3a763084
                LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 4), spacing: 20) {
                    if let stampGroup = presenter.selectedStampGroup {
                        ForEach(stampGroup.stamps, id: \.id) { stamp in
                            CustomAsyncImageView(imageUrl: stamp.imageUrl)
                                .aspectRatio(Constants.AspectRatio._1_1, contentMode: .fill)
                                .cornerRadius(8)
                                .padding(.all, 4)
                        }
                    }
                }
            }
        }
        .scrollIndicators(.hidden)
        .padding(.all, 10)
        .overlayLoading(isPresented: $presenter.isLoading, isGestureReactable: true)
        .appErrorAlert(isPresented: $presenter.showAlert, appError: presenter.appError)
        .task {
            await presenter.onAppear()
        }
        .onDisappear {
            presenter.onDisappear()
        }
    }
}

// MARK: - Preview

import PreviewSnapshots

struct StampListView_Previews: PreviewProvider, SnapshotTestable {
    static var snapshots: PreviewSnapshots&lt;RootDIContainerDependencyMock&gt; {
        .init(
            configurations: [
                UITestPreviewType.placeholder.configuration,
            ],
            configure: { dependency in
                StampListView(dependency: dependency, talkThread: .placeholder)
                    .navigationStacked()
            }
        )
    }
}


@MainActor
final class StampListPresenter&lt;Dependency: StampListPresenterDependency&gt;: ObservableObject {
    @Published private(set) var stampGroups: [StampGroup] = []
    @Published private(set) var selectedStampGroup: StampGroup?
    
    @Published var isLoading: Bool = false
    @Published var appError: AppError?
    @Published var showAlert: Bool = false

    private let dependency: Dependency
    private let talkThread: TalkThread

    init(dependency: Dependency, talkThread: TalkThread) {
        dependency.logDriver.initLog()

        self.dependency = dependency
        self.talkThread = talkThread
    }

    deinit {
        dependency.logDriver.deinitLog()
    }

    func onAppear() async {
        dependency.logDriver.onAppearLog()

        isLoading = true
        defer {
            isLoading = false
        }

        do {
            stampGroups = try await dependency.apiRequestDriver.getStampGroups()
            selectedStampGroup = stampGroups.first
        } catch {
            dependency.logDriver.errorLog("\(error)")
            appError = error.toAppError
            showAlert = true
        }
    }

    func onDisappear() {
        dependency.logDriver.onDisappearLog()
    }
    
    func onTapStampGroup(stampGroup: StampGroup) {
        selectedStampGroup = stampGroup
    }
}

---

## 🤖 アシスタント
*2024/07/02 18:50:38*

To indicate which `stampGroup` is currently selected in the UI, you can modify the `StampListView` to highlight the selected group. This can be done by changing the appearance of the button when the `stampGroup` is selected. One common way to indicate selection is by changing the background color or adding a border around the selected item.

Here's how you can achieve this:

1. **Add a condition to check if the `stampGroup` is selected.**
2. **Modify the appearance of the selected `stampGroup`.**

Here’s the updated `StampListView` implementation:

```swift
// MARK: - View

public struct StampListView<Dependency: RootDIContainerDependency>: View {
    private let dependency: Dependency
    @StateObject private var presenter: StampListPresenter<Dependency>

    public init(dependency: Dependency, talkThread: TalkThread) {
        self.dependency = dependency
        _presenter = .init(wrappedValue: StampListPresenter(dependency: dependency, talkThread: talkThread))
    }

    public var body: some View {
        ScrollView {
            VStack {
                ScrollView(.horizontal) {
                    LazyHStack {
                        ForEach(presenter.stampGroups, id: \.id) { stampGroup in
                            Button {
                                presenter.onTapStampGroup(stampGroup: stampGroup)
                            } label: {
                                CustomAsyncImageView(imageUrl: stampGroup.imageUrl)
                                    .frame(width: 40, height: 40)
                                    .cornerRadius(8)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 8)
                                            .stroke(stampGroup == presenter.selectedStampGroup ? Color.blue : Color.clear, lineWidth: 2)
                                    )
                                    .background(
                                        stampGroup == presenter.selectedStampGroup ? Color.blue.opacity(0.1) : Color.clear
                                    )
                            }
                        }
                    }
                }
                .scrollIndicators(.hidden)
                    
                LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 4), spacing: 20) {
                    if let stampGroup = presenter.selectedStampGroup {
                        ForEach(stampGroup.stamps, id: \.id) { stamp in
                            CustomAsyncImageView(imageUrl: stamp.imageUrl)
                                .aspectRatio(Constants.AspectRatio._1_1, contentMode: .fill)
                                .cornerRadius(8)
                                .padding(.all, 4)
                        }
                    }
                }
            }
        }
        .scrollIndicators(.hidden)
        .padding(.all, 10)
        .overlayLoading(isPresented: $presenter.isLoading, isGestureReactable: true)
        .appErrorAlert(isPresented: $presenter.showAlert, appError: presenter.appError)
        .task {
            await presenter.onAppear()
        }
        .onDisappear {
            presenter.onDisappear()
        }
    }
}

// MARK: - Preview

import PreviewSnapshots

struct StampListView_Previews: PreviewProvider, SnapshotTestable {
    static var snapshots: PreviewSnapshots<RootDIContainerDependencyMock> {
        .init(
            configurations: [
                UITestPreviewType.placeholder.configuration,
            ],
            configure: { dependency in
                StampListView(dependency: dependency, talkThread: .placeholder)
                    .navigationStacked()
            }
        )
    }
}

@MainActor
final class StampListPresenter<Dependency: StampListPresenterDependency>: ObservableObject {
    @Published private(set) var stampGroups: [StampGroup] = []
    @Published private(set) var selectedStampGroup: StampGroup?
    
    @Published var isLoading: Bool = false
    @Published var appError: AppError?
    @Published var showAlert: Bool = false

    private let dependency: Dependency
    private let talkThread: TalkThread

    init(dependency: Dependency, talkThread: TalkThread) {
        dependency.logDriver.initLog()

        self.dependency = dependency
        self.talkThread = talkThread
    }

    deinit {
        dependency.logDriver.deinitLog()
    }

    func onAppear() async {
        dependency.logDriver.onAppearLog()

        isLoading = true
        defer {
            isLoading = false
        }

        do {
            stampGroups = try await dependency.apiRequestDriver.getStampGroups()
            selectedStampGroup = stampGroups.first
        } catch {
            dependency.logDriver.errorLog("\(error)")
            appError = error.toAppError
            showAlert = true
        }
    }

    func onDisappear() {
        dependency.logDriver.onDisappearLog()
    }
    
    func onTapStampGroup(stampGroup: StampGroup) {
        selectedStampGroup = stampGroup
    }
}
```

In this updated code:
- The `Button` label now includes an `overlay` with a `RoundedRectangle` that gets a blue border if the `stampGroup` is selected.
- The `background` modifier changes the background color of the selected `stampGroup` to a light blue.

These visual cues will help indicate which `stampGroup` is currently selected.

---

## 👤 ユーザー
*2024/07/02 18:53:18*

背景がハイライトしているだけでいいよ　枠線は入れなくていいよ

---

## 🤖 アシスタント
*2024/07/02 18:54:00*

Understood. I'll remove the border and only add a highlighted background for the selected `stampGroup`. Here’s the updated implementation:

```swift
// MARK: - View

public struct StampListView<Dependency: RootDIContainerDependency>: View {
    private let dependency: Dependency
    @StateObject private var presenter: StampListPresenter<Dependency>

    public init(dependency: Dependency, talkThread: TalkThread) {
        self.dependency = dependency
        _presenter = .init(wrappedValue: StampListPresenter(dependency: dependency, talkThread: talkThread))
    }

    public var body: some View {
        ScrollView {
            VStack {
                ScrollView(.horizontal) {
                    LazyHStack {
                        ForEach(presenter.stampGroups, id: \.id) { stampGroup in
                            Button {
                                presenter.onTapStampGroup(stampGroup: stampGroup)
                            } label: {
                                CustomAsyncImageView(imageUrl: stampGroup.imageUrl)
                                    .frame(width: 40, height: 40)
                                    .cornerRadius(8)
                                    .background(
                                        stampGroup == presenter.selectedStampGroup ? Color.blue.opacity(0.1) : Color.clear
                                    )
                            }
                        }
                    }
                }
                .scrollIndicators(.hidden)
                    
                LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 4), spacing: 20) {
                    if let stampGroup = presenter.selectedStampGroup {
                        ForEach(stampGroup.stamps, id: \.id) { stamp in
                            CustomAsyncImageView(imageUrl: stamp.imageUrl)
                                .aspectRatio(Constants.AspectRatio._1_1, contentMode: .fill)
                                .cornerRadius(8)
                                .padding(.all, 4)
                        }
                    }
                }
            }
        }
        .scrollIndicators(.hidden)
        .padding(.all, 10)
        .overlayLoading(isPresented: $presenter.isLoading, isGestureReactable: true)
        .appErrorAlert(isPresented: $presenter.showAlert, appError: presenter.appError)
        .task {
            await presenter.onAppear()
        }
        .onDisappear {
            presenter.onDisappear()
        }
    }
}

// MARK: - Preview

import PreviewSnapshots

struct StampListView_Previews: PreviewProvider, SnapshotTestable {
    static var snapshots: PreviewSnapshots<RootDIContainerDependencyMock> {
        .init(
            configurations: [
                UITestPreviewType.placeholder.configuration,
            ],
            configure: { dependency in
                StampListView(dependency: dependency, talkThread: .placeholder)
                    .navigationStacked()
            }
        )
    }
}

@MainActor
final class StampListPresenter<Dependency: StampListPresenterDependency>: ObservableObject {
    @Published private(set) var stampGroups: [StampGroup] = []
    @Published private(set) var selectedStampGroup: StampGroup?
    
    @Published var isLoading: Bool = false
    @Published var appError: AppError?
    @Published var showAlert: Bool = false

    private let dependency: Dependency
    private let talkThread: TalkThread

    init(dependency: Dependency, talkThread: TalkThread) {
        dependency.logDriver.initLog()

        self.dependency = dependency
        self.talkThread = talkThread
    }

    deinit {
        dependency.logDriver.deinitLog()
    }

    func onAppear() async {
        dependency.logDriver.onAppearLog()

        isLoading = true
        defer {
            isLoading = false
        }

        do {
            stampGroups = try await dependency.apiRequestDriver.getStampGroups()
            selectedStampGroup = stampGroups.first
        } catch {
            dependency.logDriver.errorLog("\(error)")
            appError = error.toAppError
            showAlert = true
        }
    }

    func onDisappear() {
        dependency.logDriver.onDisappearLog()
    }
    
    func onTapStampGroup(stampGroup: StampGroup) {
        selectedStampGroup = stampGroup
    }
}
```

In this updated code:
- The `Button` label now includes a `background` modifier that changes the background color to a light blue (`Color.blue.opacity(0.1)`) when the `stampGroup` is selected.

---

## 👤 ユーザー
*2024/07/02 18:54:03*

少しだけ背景の枠を大きくしたい

---

## 🤖 アシスタント
*2024/07/02 18:54:45*

To make the background highlight slightly larger, you can use a padding modifier to increase the size of the background. Here’s the updated implementation:

```swift
// MARK: - View

public struct StampListView<Dependency: RootDIContainerDependency>: View {
    private let dependency: Dependency
    @StateObject private var presenter: StampListPresenter<Dependency>

    public init(dependency: Dependency, talkThread: TalkThread) {
        self.dependency = dependency
        _presenter = .init(wrappedValue: StampListPresenter(dependency: dependency, talkThread: talkThread))
    }

    public var body: some View {
        ScrollView {
            VStack {
                ScrollView(.horizontal) {
                    LazyHStack {
                        ForEach(presenter.stampGroups, id: \.id) { stampGroup in
                            Button {
                                presenter.onTapStampGroup(stampGroup: stampGroup)
                            } label: {
                                CustomAsyncImageView(imageUrl: stampGroup.imageUrl)
                                    .frame(width: 40, height: 40)
                                    .cornerRadius(8)
                                    .padding(4) // Added padding to make the background slightly larger
                                    .background(
                                        stampGroup == presenter.selectedStampGroup ? Color.blue.opacity(0.1) : Color.clear
                                    )
                                    .cornerRadius(12) // Adjust the corner radius to match the padding
                            }
                        }
                    }
                }
                .scrollIndicators(.hidden)
                    
                LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 4), spacing: 20) {
                    if let stampGroup = presenter.selectedStampGroup {
                        ForEach(stampGroup.stamps, id: \.id) { stamp in
                            CustomAsyncImageView(imageUrl: stamp.imageUrl)
                                .aspectRatio(Constants.AspectRatio._1_1, contentMode: .fill)
                                .cornerRadius(8)
                                .padding(.all, 4)
                        }
                    }
                }
            }
        }
        .scrollIndicators(.hidden)
        .padding(.all, 10)
        .overlayLoading(isPresented: $presenter.isLoading, isGestureReactable: true)
        .appErrorAlert(isPresented: $presenter.showAlert, appError: presenter.appError)
        .task {
            await presenter.onAppear()
        }
        .onDisappear {
            presenter.onDisappear()
        }
    }
}

// MARK: - Preview

import PreviewSnapshots

struct StampListView_Previews: PreviewProvider, SnapshotTestable {
    static var snapshots: PreviewSnapshots<RootDIContainerDependencyMock> {
        .init(
            configurations: [
                UITestPreviewType.placeholder.configuration,
            ],
            configure: { dependency in
                StampListView(dependency: dependency, talkThread: .placeholder)
                    .navigationStacked()
            }
        )
    }
}

@MainActor
final class StampListPresenter<Dependency: StampListPresenterDependency>: ObservableObject {
    @Published private(set) var stampGroups: [StampGroup] = []
    @Published private(set) var selectedStampGroup: StampGroup?
    
    @Published var isLoading: Bool = false
    @Published var appError: AppError?
    @Published var showAlert: Bool = false

    private let dependency: Dependency
    private let talkThread: TalkThread

    init(dependency: Dependency, talkThread: TalkThread) {
        dependency.logDriver.initLog()

        self.dependency = dependency
        self.talkThread = talkThread
    }

    deinit {
        dependency.logDriver.deinitLog()
    }

    func onAppear() async {
        dependency.logDriver.onAppearLog()

        isLoading = true
        defer {
            isLoading = false
        }

        do {
            stampGroups = try await dependency.apiRequestDriver.getStampGroups()
            selectedStampGroup = stampGroups.first
        } catch {
            dependency.logDriver.errorLog("\(error)")
            appError = error.toAppError
            showAlert = true
        }
    }

    func onDisappear() {
        dependency.logDriver.onDisappearLog()
    }
    
    func onTapStampGroup(stampGroup: StampGroup) {
        selectedStampGroup = stampGroup
    }
}
```

In this updated code:
- The `padding(4)` modifier is added to the `CustomAsyncImageView`, which increases the size of the background highlight.
- The `cornerRadius(12)` modifier is adjusted to match the padding, ensuring that the corners of the background highlight are rounded appropriately.

---
