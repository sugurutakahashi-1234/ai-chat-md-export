# Stamp Preview on Tap

Date: 2024-07-05

---

## 👤 User
*2024-07-05 11:01:19*

今はスタンプをタップしたらスタンプ投稿しているが、ハーフモーダルの上部にスタンプのプレビューを少し大きく表示してから、その後送信アイコンをタップして投稿させたい

// MARK: - View

public struct StampListView&lt;Dependency: RootDIContainerDependency&gt;: View {
    private let dependency: Dependency
    @StateObject private var presenter: StampListPresenter&lt;Dependency&gt;
    @Environment(\.dismiss) private var dismiss

    public init(dependency: Dependency, talkThread: TalkThread) {
        self.dependency = dependency
        _presenter = .init(wrappedValue: StampListPresenter(dependency: dependency, talkThread: talkThread))
    }

    public var body: some View {
        VStack {
            ScrollView(.horizontal) {
                LazyHStack {
                    Button {
                        presenter.onTapStampHistory()
                    } label: {
                        SFSymbols.clockFill.image
                            .resizable()
                            .frame(width: 30, height: 30)
                            .frame(width: 40, height: 40)
                            .padding(8)
                            .background(
                                presenter.stampGroupSelectType == .history ? Color.gray.opacity(0.2) : Color.clear
                            )
                            .cornerRadius(12)
                    }

                    ForEach(presenter.stampGroups, id: \.id) { stampGroup in
                        Button {
                            presenter.onTapStampGroup(stampGroup: stampGroup)
                        } label: {
                            CachedAsyncImageView(imageUrl: stampGroup.imageUrl, directory: Constants.FilePath.stampDirectory)
                                .frame(width: 40, height: 40)
                                .cornerRadius(8)
                                .padding(8)
                                .background(
                                    .stampGroup(stampGroup) == presenter.stampGroupSelectType ? Color.gray.opacity(0.2) : Color.clear
                                )
                                .cornerRadius(12)
                        }
                    }
                }
            }
            .scrollIndicators(.hidden)
            .frame(height: 60)

            ScrollView {
                // Ref: 【SwiftUI】LazyVGrid内の画像を正方形にする【ワークアラウンド】 https://qiita.com/tsuzuki817/items/cc9364089cee3a763084
                LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 4), spacing: 20) {
                    ForEach(presenter.stamps, id: \.id) { stamp in
                        Button {
                            Task {
                                await presenter.onTapStamp(stamp: stamp)
                            }
                        } label: {
                            CachedAsyncImageView(imageUrl: stamp.imageUrl, directory: Constants.FilePath.stampDirectory)
                                .aspectRatio(Constants.AspectRatio._1_1, contentMode: .fill)
                                .cornerRadius(8)
                                .padding(.all, 4)
                        }
                    }
                }
            }
            .scrollIndicators(.hidden)
        }
        .padding(.all, 10)
        .overlayLoading(isPresented: $presenter.isLoading, isGestureReactable: true)
        .appErrorAlert(isPresented: $presenter.showAlert, appError: presenter.appError)
        .onChange(of: presenter.shouldDismiss) { shouldDismiss in
            if shouldDismiss {
                dismiss.callAsFunction()
            }
        }
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
                Color.clear
                    .sheet(isPresented: .constant(true)) {
                        StampListView(dependency: dependency, talkThread: .placeholder)
                            .navigationStacked()
                            .presentationDetents([.medium])
                    }
            }
        )
    }
}


enum StampGroupSelectType: Equatable {
    case history
    case stampGroup(StampGroup)
}

@MainActor
final class StampListPresenter&lt;Dependency: StampListPresenterDependency&gt;: ObservableObject {
    @Published private(set) var stampGroups: [StampGroup] = []
    @Published private(set) var stamps: [Stamp] = []
    @Published private(set) var stampGroupSelectType: StampGroupSelectType = .history

    @Published var isLoading: Bool = false
    @Published var appError: AppError?
    @Published var showAlert: Bool = false
    @Published var shouldDismiss: Bool = false

    private let dependency: Dependency
    private let talkThread: TalkThread

    init(dependency: Dependency, talkThread: TalkThread) {
        dependency.logDriver.initLog()

        self.dependency = dependency
        self.talkThread = talkThread

        $stampGroupSelectType
            .map { stampGroupSelectType in
                switch stampGroupSelectType {
                case .history:
                    dependency.localDataStoreDriver.stampHistorys.sorted(by: \.postedAt, order: .descending).map { $0.stamp }.reduce(into: [Stamp]()) { result, stamp in
                        // 同じスタンプ は フィルタリングして除外する（Set 型は順番を保持しないので不向き）
                        if !result.contains(where: { $0 == stamp }) {
                            result.append(stamp)
                        }
                    }
                case .stampGroup(let stampGroup):
                    stampGroup.stamps
                }
            }
            .assign(to: &$stamps)
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
        } catch {
            dependency.logDriver.errorLog("\(error)")
            appError = error.toAppError
            showAlert = true
        }
    }

    func onDisappear() {
        dependency.logDriver.onDisappearLog()
    }

    func onTapStampHistory() {
        stampGroupSelectType = .history
    }

    func onTapStampGroup(stampGroup: StampGroup) {
        stampGroupSelectType = .stampGroup(stampGroup)
    }

    func onTapStamp(stamp: Stamp) async {
        do {
            try await dependency.apiRequestDriver.postStamp(stamp: stamp, talkThread: talkThread)

            // スタンプを送信して履歴を 100 件まで登録する（重複 OK として、表示するときにフィルタリングする）
            dependency.localDataStoreDriver.stampHistorys = (dependency.localDataStoreDriver.stampHistorys + [StampHistory(stamp: stamp, postedAt: .now)]).suffix(100)

            // 閉じた先で toast を表示させるので、この画面では toast は表示しない（Bindingでも実装可能であるが取り回しが面倒なのでこうしている）
            dependency.toastDriver.showToast(.postedStamp)

            shouldDismiss = true
        } catch {
            dependency.logDriver.errorLog("\(error)")
            appError = error.toAppError
            showAlert = true
        }
    }
}

---

## 🤖 Assistant
*2024-07-05 11:02:19*

スタンプをタップしたときにまずプレビューを表示し、その後に送信アイコンをタップして投稿させるための変更を加えます。以下に変更案を示します。

1. **スタンププレビュー用の状態管理**を追加します。
2. **プレビューを表示するためのView**を追加します。
3. **送信アイコンをタップしたときに投稿する処理**を追加します。

以下に具体的な変更内容を示します。

### Presenterの変更

まず、スタンプのプレビュー表示と送信アイコンタップの処理を追加します。

```swift
@MainActor
final class StampListPresenter<Dependency: StampListPresenterDependency>: ObservableObject {
    @Published private(set) var stampGroups: [StampGroup] = []
    @Published private(set) var stamps: [Stamp] = []
    @Published private(set) var stampGroupSelectType: StampGroupSelectType = .history

    @Published var isLoading: Bool = false
    @Published var appError: AppError?
    @Published var showAlert: Bool = false
    @Published var shouldDismiss: Bool = false
    @Published var selectedStamp: Stamp?

    private let dependency: Dependency
    private let talkThread: TalkThread

    init(dependency: Dependency, talkThread: TalkThread) {
        dependency.logDriver.initLog()

        self.dependency = dependency
        self.talkThread = talkThread

        $stampGroupSelectType
            .map { stampGroupSelectType in
                switch stampGroupSelectType {
                case .history:
                    dependency.localDataStoreDriver.stampHistorys.sorted(by: \.postedAt, order: .descending).map { $0.stamp }.reduce(into: [Stamp]()) { result, stamp in
                        // 同じスタンプ は フィルタリングして除外する（Set 型は順番を保持しないので不向き）
                        if !result.contains(where: { $0 == stamp }) {
                            result.append(stamp)
                        }
                    }
                case .stampGroup(let stampGroup):
                    stampGroup.stamps
                }
            }
            .assign(to: &$stamps)
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
        } catch {
            dependency.logDriver.errorLog("\(error)")
            appError = error.toAppError
            showAlert = true
        }
    }

    func onDisappear() {
        dependency.logDriver.onDisappearLog()
    }

    func onTapStampHistory() {
        stampGroupSelectType = .history
    }

    func onTapStampGroup(stampGroup: StampGroup) {
        stampGroupSelectType = .stampGroup(stampGroup)
    }

    func onTapStamp(stamp: Stamp) {
        selectedStamp = stamp
    }

    func onSendStamp() async {
        guard let stamp = selectedStamp else { return }

        do {
            try await dependency.apiRequestDriver.postStamp(stamp: stamp, talkThread: talkThread)

            // スタンプを送信して履歴を 100 件まで登録する（重複 OK として、表示するときにフィルタリングする）
            dependency.localDataStoreDriver.stampHistorys = (dependency.localDataStoreDriver.stampHistorys + [StampHistory(stamp: stamp, postedAt: .now)]).suffix(100)

            // 閉じた先で toast を表示させるので、この画面では toast は表示しない（Bindingでも実装可能であるが取り回しが面倒なのでこうしている）
            dependency.toastDriver.showToast(.postedStamp)

            shouldDismiss = true
            selectedStamp = nil
        } catch {
            dependency.logDriver.errorLog("\(error)")
            appError = error.toAppError
            showAlert = true
        }
    }

    func onCancelPreview() {
        selectedStamp = nil
    }
}
```

### Viewの変更

次に、プレビューと送信アイコンの表示を追加します。

```swift
public var body: some View {
    VStack {
        if let selectedStamp = presenter.selectedStamp {
            VStack {
                CachedAsyncImageView(imageUrl: selectedStamp.imageUrl, directory: Constants.FilePath.stampDirectory)
                    .frame(width: 100, height: 100)
                    .cornerRadius(16)
                    .padding()
                HStack {
                    Button(action: {
                        Task {
                            await presenter.onSendStamp()
                        }
                    }) {
                        Image(systemName: "paperplane.fill")
                            .resizable()
                            .frame(width: 30, height: 30)
                            .padding()
                            .background(Color.blue)
                            .foregroundColor(.white)
                            .clipShape(Circle())
                    }
                    .padding()

                    Button(action: {
                        presenter.onCancelPreview()
                    }) {
                        Image(systemName: "xmark.circle.fill")
                            .resizable()
                            .frame(width: 30, height: 30)
                            .padding()
                            .background(Color.red)
                            .foregroundColor(.white)
                            .clipShape(Circle())
                    }
                    .padding()
                }
            }
            .background(Color.white)
            .cornerRadius(20)
            .shadow(radius: 10)
            .padding()
        } else {
            VStack {
                ScrollView(.horizontal) {
                    LazyHStack {
                        Button {
                            presenter.onTapStampHistory()
                        } label: {
                            SFSymbols.clockFill.image
                                .resizable()
                                .frame(width: 30, height: 30)
                                .frame(width: 40, height: 40)
                                .padding(8)
                                .background(
                                    presenter.stampGroupSelectType == .history ? Color.gray.opacity(0.2) : Color.clear
                                )
                                .cornerRadius(12)
                        }

                        ForEach(presenter.stampGroups, id: \.id) { stampGroup in
                            Button {
                                presenter.onTapStampGroup(stampGroup: stampGroup)
                            } label: {
                                CachedAsyncImageView(imageUrl: stampGroup.imageUrl, directory: Constants.FilePath.stampDirectory)
                                    .frame(width: 40, height: 40)
                                    .cornerRadius(8)
                                    .padding(8)
                                    .background(
                                        .stampGroup(stampGroup) == presenter.stampGroupSelectType ? Color.gray.opacity(0.2) : Color.clear
                                    )
                                    .cornerRadius(12)
                            }
                        }
                    }
                }
                .scrollIndicators(.hidden)
                .frame(height: 60)

                ScrollView {
                    // Ref: 【SwiftUI】LazyVGrid内の画像を正方形にする【ワークアラウンド】 https://qiita.com/tsuzuki817/items/cc9364089cee3a763084
                    LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 4), spacing: 20) {
                        ForEach(presenter.stamps, id: \.id) { stamp in
                            Button {
                                presenter.onTapStamp(stamp: stamp)
                            } label: {
                                CachedAsyncImageView(imageUrl: stamp.imageUrl, directory: Constants.FilePath.stampDirectory)
                                    .aspectRatio(Constants.AspectRatio._1_1, contentMode: .fill)
                                    .cornerRadius(8)
                                    .padding(.all, 4)
                            }
                        }
                    }
                }
                .scrollIndicators(.hidden)
            }
        }
    }
    .padding(.all, 10)
    .overlayLoading(isPresented: $presenter.isLoading, isGestureReactable: true)
    .appErrorAlert(isPresented: $presenter.showAlert, appError: presenter.appError)
    .onChange(of: presenter.shouldDismiss) { shouldDismiss in
        if shouldDismiss {
            dismiss.callAsFunction()
        }
    }
    .task {
        await presenter.onAppear()
    }
    .onDisappear {
        presenter.onDisappear()
    }
}
```

これで、スタンプをタップするとプレビューが表示され、送信アイコンをタップすることで投稿が行われるようになります。送信アイコンとキャンセルアイコンをタップすることで、それぞれのアクションが実行されます。

---

## 👤 User
*2024-07-05 11:04:22*

これだとプレビューの分だけハーフモーダルの表示領域が小さくなる気がするが、どうすればいい？

---

## 🤖 Assistant
*2024-07-05 11:04:53*

ハーフモーダルの表示領域を小さくせずにスタンプのプレビューを表示するためには、プレビューをハーフモーダルの上部にオーバーレイとして表示する方法が考えられます。以下にその具体的な変更内容を示します。

### Viewの変更

プレビューをオーバーレイとして表示するための変更を行います。

```swift
public var body: some View {
    ZStack {
        VStack {
            ScrollView(.horizontal) {
                LazyHStack {
                    Button {
                        presenter.onTapStampHistory()
                    } label: {
                        SFSymbols.clockFill.image
                            .resizable()
                            .frame(width: 30, height: 30)
                            .frame(width: 40, height: 40)
                            .padding(8)
                            .background(
                                presenter.stampGroupSelectType == .history ? Color.gray.opacity(0.2) : Color.clear
                            )
                            .cornerRadius(12)
                    }

                    ForEach(presenter.stampGroups, id: \.id) { stampGroup in
                        Button {
                            presenter.onTapStampGroup(stampGroup: stampGroup)
                        } label: {
                            CachedAsyncImageView(imageUrl: stampGroup.imageUrl, directory: Constants.FilePath.stampDirectory)
                                .frame(width: 40, height: 40)
                                .cornerRadius(8)
                                .padding(8)
                                .background(
                                    .stampGroup(stampGroup) == presenter.stampGroupSelectType ? Color.gray.opacity(0.2) : Color.clear
                                )
                                .cornerRadius(12)
                        }
                    }
                }
            }
            .scrollIndicators(.hidden)
            .frame(height: 60)

            ScrollView {
                LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 4), spacing: 20) {
                    ForEach(presenter.stamps, id: \.id) { stamp in
                        Button {
                            presenter.onTapStamp(stamp: stamp)
                        } label: {
                            CachedAsyncImageView(imageUrl: stamp.imageUrl, directory: Constants.FilePath.stampDirectory)
                                .aspectRatio(Constants.AspectRatio._1_1, contentMode: .fill)
                                .cornerRadius(8)
                                .padding(.all, 4)
                        }
                    }
                }
            }
            .scrollIndicators(.hidden)
        }
        .padding(.all, 10)
        .overlayLoading(isPresented: $presenter.isLoading, isGestureReactable: true)
        .appErrorAlert(isPresented: $presenter.showAlert, appError: presenter.appError)
        .onChange(of: presenter.shouldDismiss) { shouldDismiss in
            if shouldDismiss {
                dismiss.callAsFunction()
            }
        }
        .task {
            await presenter.onAppear()
        }
        .onDisappear {
            presenter.onDisappear()
        }

        if let selectedStamp = presenter.selectedStamp {
            VStack {
                Spacer()
                VStack {
                    CachedAsyncImageView(imageUrl: selectedStamp.imageUrl, directory: Constants.FilePath.stampDirectory)
                        .frame(width: 100, height: 100)
                        .cornerRadius(16)
                        .padding()
                    HStack {
                        Button(action: {
                            Task {
                                await presenter.onSendStamp()
                            }
                        }) {
                            Image(systemName: "paperplane.fill")
                                .resizable()
                                .frame(width: 30, height: 30)
                                .padding()
                                .background(Color.blue)
                                .foregroundColor(.white)
                                .clipShape(Circle())
                        }
                        .padding()

                        Button(action: {
                            presenter.onCancelPreview()
                        }) {
                            Image(systemName: "xmark.circle.fill")
                                .resizable()
                                .frame(width: 30, height: 30)
                                .padding()
                                .background(Color.red)
                                .foregroundColor(.white)
                                .clipShape(Circle())
                        }
                        .padding()
                    }
                }
                .background(Color.white)
                .cornerRadius(20)
                .shadow(radius: 10)
                .padding()
            }
        }
    }
}
```

この変更により、スタンプのプレビューがハーフモーダルの上部にオーバーレイとして表示され、プレビュー表示のための領域を確保する必要がなくなります。これにより、ハーフモーダルの表示領域を小さくすることなく、プレビューを表示することができます。

---

## 👤 User
*2024-07-05 11:06:12*

これだと重なった領域が見えなくなってしまうのでは？

---

## 🤖 Assistant
*2024-07-05 11:06:43*

プレビューをオーバーレイとして表示しつつ、重なった領域が見えなくならないようにするには、プレビュー領域をモーダルの上部に固定し、モーダルの内容がスクロール可能になるようにします。これにより、プレビューが常に表示され、残りのコンテンツはスクロール可能になります。

以下はそのための具体的な変更です：

### Viewの変更

プレビューを固定し、コンテンツをスクロール可能にするための変更を行います。

```swift
public var body: some View {
    VStack(spacing: 0) {
        if let selectedStamp = presenter.selectedStamp {
            VStack {
                CachedAsyncImageView(imageUrl: selectedStamp.imageUrl, directory: Constants.FilePath.stampDirectory)
                    .frame(width: 100, height: 100)
                    .cornerRadius(16)
                    .padding()
                HStack {
                    Button(action: {
                        Task {
                            await presenter.onSendStamp()
                        }
                    }) {
                        Image(systemName: "paperplane.fill")
                            .resizable()
                            .frame(width: 30, height: 30)
                            .padding()
                            .background(Color.blue)
                            .foregroundColor(.white)
                            .clipShape(Circle())
                    }
                    .padding()

                    Button(action: {
                        presenter.onCancelPreview()
                    }) {
                        Image(systemName: "xmark.circle.fill")
                            .resizable()
                            .frame(width: 30, height: 30)
                            .padding()
                            .background(Color.red)
                            .foregroundColor(.white)
                            .clipShape(Circle())
                    }
                    .padding()
                }
            }
            .background(Color.white)
            .cornerRadius(20)
            .shadow(radius: 10)
            .padding()
        }

        ScrollView {
            VStack {
                ScrollView(.horizontal) {
                    LazyHStack {
                        Button {
                            presenter.onTapStampHistory()
                        } label: {
                            SFSymbols.clockFill.image
                                .resizable()
                                .frame(width: 30, height: 30)
                                .frame(width: 40, height: 40)
                                .padding(8)
                                .background(
                                    presenter.stampGroupSelectType == .history ? Color.gray.opacity(0.2) : Color.clear
                                )
                                .cornerRadius(12)
                        }

                        ForEach(presenter.stampGroups, id: \.id) { stampGroup in
                            Button {
                                presenter.onTapStampGroup(stampGroup: stampGroup)
                            } label: {
                                CachedAsyncImageView(imageUrl: stampGroup.imageUrl, directory: Constants.FilePath.stampDirectory)
                                    .frame(width: 40, height: 40)
                                    .cornerRadius(8)
                                    .padding(8)
                                    .background(
                                        .stampGroup(stampGroup) == presenter.stampGroupSelectType ? Color.gray.opacity(0.2) : Color.clear
                                    )
                                    .cornerRadius(12)
                            }
                        }
                    }
                }
                .scrollIndicators(.hidden)
                .frame(height: 60)

                LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 4), spacing: 20) {
                    ForEach(presenter.stamps, id: \.id) { stamp in
                        Button {
                            presenter.onTapStamp(stamp: stamp)
                        } label: {
                            CachedAsyncImageView(imageUrl: stamp.imageUrl, directory: Constants.FilePath.stampDirectory)
                                .aspectRatio(Constants.AspectRatio._1_1, contentMode: .fill)
                                .cornerRadius(8)
                                .padding(.all, 4)
                        }
                    }
                }
            }
        }
        .scrollIndicators(.hidden)
        .padding(.horizontal, 10)
    }
    .overlayLoading(isPresented: $presenter.isLoading, isGestureReactable: true)
    .appErrorAlert(isPresented: $presenter.showAlert, appError: presenter.appError)
    .onChange(of: presenter.shouldDismiss) { shouldDismiss in
        if shouldDismiss {
            dismiss.callAsFunction()
        }
    }
    .task {
        await presenter.onAppear()
    }
    .onDisappear {
        presenter.onDisappear()
    }
}
```

このアプローチでは、スタンプのプレビューが上部に固定され、モーダルの残りの部分がスクロール可能になります。これにより、プレビュー領域が常に表示され、他のコンテンツがスクロール可能であるため、重なった領域が見えなくなる問題を解決します。

---

## 👤 User
*2024-07-05 11:06:52*

プレビューの高さの分だけ上部に配置することはできないの？

---

## 🤖 Assistant
*2024-07-05 11:07:27*

スタンプのプレビューを上部に固定し、その分だけ表示領域を調整することは可能です。この方法では、プレビューの高さの分だけ下部のコンテンツの表示領域が減りますが、上部に固定されたプレビューは常に表示されます。これを実現するためには、VStackとZStackを組み合わせて使用します。

以下に具体的な変更例を示します：

### Viewの変更

1. プレビューの高さを固定して表示し、残りのコンテンツをその下に配置します。
2. プレビューが選択されている場合はその高さ分だけスペースを作ります。

```swift
public var body: some View {
    ZStack(alignment: .top) {
        VStack {
            if let selectedStamp = presenter.selectedStamp {
                VStack {
                    CachedAsyncImageView(imageUrl: selectedStamp.imageUrl, directory: Constants.FilePath.stampDirectory)
                        .frame(width: 100, height: 100)
                        .cornerRadius(16)
                        .padding()
                    HStack {
                        Button(action: {
                            Task {
                                await presenter.onSendStamp()
                            }
                        }) {
                            Image(systemName: "paperplane.fill")
                                .resizable()
                                .frame(width: 30, height: 30)
                                .padding()
                                .background(Color.blue)
                                .foregroundColor(.white)
                                .clipShape(Circle())
                        }
                        .padding()

                        Button(action: {
                            presenter.onCancelPreview()
                        }) {
                            Image(systemName: "xmark.circle.fill")
                                .resizable()
                                .frame(width: 30, height: 30)
                                .padding()
                                .background(Color.red)
                                .foregroundColor(.white)
                                .clipShape(Circle())
                        }
                        .padding()
                    }
                }
                .background(Color.white)
                .cornerRadius(20)
                .shadow(radius: 10)
                .padding()
                .frame(maxWidth: .infinity)
            }
        }
        .frame(maxHeight: selectedStamp != nil ? 200 : 0) // Adjust the height of the preview container
        .zIndex(1)

        ScrollView {
            VStack {
                ScrollView(.horizontal) {
                    LazyHStack {
                        Button {
                            presenter.onTapStampHistory()
                        } label: {
                            SFSymbols.clockFill.image
                                .resizable()
                                .frame(width: 30, height: 30)
                                .frame(width: 40, height: 40)
                                .padding(8)
                                .background(
                                    presenter.stampGroupSelectType == .history ? Color.gray.opacity(0.2) : Color.clear
                                )
                                .cornerRadius(12)
                        }

                        ForEach(presenter.stampGroups, id: \.id) { stampGroup in
                            Button {
                                presenter.onTapStampGroup(stampGroup: stampGroup)
                            } label: {
                                CachedAsyncImageView(imageUrl: stampGroup.imageUrl, directory: Constants.FilePath.stampDirectory)
                                    .frame(width: 40, height: 40)
                                    .cornerRadius(8)
                                    .padding(8)
                                    .background(
                                        .stampGroup(stampGroup) == presenter.stampGroupSelectType ? Color.gray.opacity(0.2) : Color.clear
                                    )
                                    .cornerRadius(12)
                            }
                        }
                    }
                }
                .scrollIndicators(.hidden)
                .frame(height: 60)

                LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 4), spacing: 20) {
                    ForEach(presenter.stamps, id: \.id) { stamp in
                        Button {
                            presenter.onTapStamp(stamp: stamp)
                        } label: {
                            CachedAsyncImageView(imageUrl: stamp.imageUrl, directory: Constants.FilePath.stampDirectory)
                                .aspectRatio(Constants.AspectRatio._1_1, contentMode: .fill)
                                .cornerRadius(8)
                                .padding(.all, 4)
                        }
                    }
                }
            }
            .padding(.top, selectedStamp != nil ? 200 : 0) // Add space for the preview if it is showing
        }
        .scrollIndicators(.hidden)
        .padding(.horizontal, 10)
    }
    .overlayLoading(isPresented: $presenter.isLoading, isGestureReactable: true)
    .appErrorAlert(isPresented: $presenter.showAlert, appError: presenter.appError)
    .onChange(of: presenter.shouldDismiss) { shouldDismiss in
        if shouldDismiss {
            dismiss.callAsFunction()
        }
    }
    .task {
        await presenter.onAppear()
    }
    .onDisappear {
        presenter.onDisappear()
    }
}
```

この変更により、スタンプのプレビューが上部に固定され、その分だけ下部のコンテンツが下にシフトします。これにより、プレビューの高さの分だけ表示領域が確保され、重なった領域が見えなくなる問題が解決されます。

---

## 👤 User
*2024-07-05 12:49:16*

SwftUIでsheetを透明にする方法はあるか

---

## 🤖 Assistant
*2024-07-05 12:49:37*

SwiftUIで標準の`sheet`モディファイアを使用して透明な背景を作成することは直接的にはサポートされていません。しかし、カスタムモーダルを作成して透明な背景をシミュレートすることは可能です。

以下に、SwiftUIのカスタムモーダルを作成し、透明な背景を持つシートをシミュレートする方法を示します。

### カスタムモーダルの作成

1. **カスタムモーダルのView**を作成します。
2. **モーダルを表示するロジック**を実装します。

以下はその実装例です。

```swift
import SwiftUI

struct TransparentSheetView<Content: View>: View {
    @Binding var isPresented: Bool
    let content: Content

    var body: some View {
        ZStack {
            if isPresented {
                Color.black.opacity(0.5) // 背景の半透明色
                    .edgesIgnoringSafeArea(.all)
                    .onTapGesture {
                        withAnimation {
                            isPresented = false
                        }
                    }

                content
                    .background(Color.white.opacity(0.0)) // コンテンツの背景色を透明に
                    .cornerRadius(20)
                    .padding()
                    .transition(.move(edge: .bottom))
                    .animation(.spring(), value: isPresented)
            }
        }
    }
}

struct ContentView: View {
    @State private var isSheetPresented = false

    var body: some View {
        VStack {
            Button("Show Sheet") {
                withAnimation {
                    isSheetPresented = true
                }
            }
        }
        .background(
            TransparentSheetView(isPresented: $isSheetPresented) {
                VStack {
                    Text("This is a custom sheet with a transparent background")
                    Button("Close") {
                        withAnimation {
                            isSheetPresented = false
                        }
                    }
                }
                .frame(maxWidth: .infinity)
                .background(Color.white) // シートのコンテンツ背景を白に設定
                .cornerRadius(20)
                .shadow(radius: 10)
            }
        )
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
```

### 説明

1. **TransparentSheetView**: このビューは半透明の背景を持ち、渡されたコンテンツを表示します。タップするとシートを閉じるように設定しています。
2. **ContentView**: ボタンを押すとカスタムモーダルを表示するメインビューです。`TransparentSheetView`をバックグラウンドに追加して、シートのような動作をシミュレートしています。

これにより、SwiftUIで透明な背景を持つカスタムシートを実現できます。シートを表示する際のアニメーションや背景の透明度などもカスタマイズ可能です。

---

## 👤 User
*2024-07-05 15:37:09*

バックグラウンドをサークルにしたい

SFSymbols.speakerWave2Circle.image
                                            .tint(.gray)
                                            .background(.white)

---

## 🤖 Assistant
*2024-07-05 15:37:34*

バックグラウンドをサークルにしたい場合、`background`モディファイアと`clipShape`モディファイアを使用して、背景を円形にクリップすることができます。以下にその実装例を示します。

### 実装例

以下のコードでは、SFSymbolsのアイコンを使用し、背景を白色で円形にクリップしています。

```swift
import SwiftUI

struct ContentView: View {
    @State private var isSheetPresented = false

    var body: some View {
        VStack {
            Button("Show Sheet") {
                withAnimation {
                    isSheetPresented = true
                }
            }
        }
        .background(
            TransparentSheetView(isPresented: $isSheetPresented) {
                VStack {
                    SFSymbols.speakerWave2Circle.image
                        .resizable()
                        .frame(width: 100, height: 100)
                        .foregroundColor(.gray)
                        .background(Color.white)
                        .clipShape(Circle())
                        .shadow(radius: 10)
                        .padding()
                    
                    Text("This is a custom sheet with a transparent background")
                    Button("Close") {
                        withAnimation {
                            isSheetPresented = false
                        }
                    }
                }
                .frame(maxWidth: .infinity)
                .background(Color.white) // シートのコンテンツ背景を白に設定
                .cornerRadius(20)
                .shadow(radius: 10)
            }
        )
    }
}

struct TransparentSheetView<Content: View>: View {
    @Binding var isPresented: Bool
    let content: Content

    var body: some View {
        ZStack {
            if isPresented {
                Color.black.opacity(0.5) // 背景の半透明色
                    .edgesIgnoringSafeArea(.all)
                    .onTapGesture {
                        withAnimation {
                            isPresented = false
                        }
                    }

                content
                    .background(Color.white.opacity(0.0)) // コンテンツの背景色を透明に
                    .cornerRadius(20)
                    .padding()
                    .transition(.move(edge: .bottom))
                    .animation(.spring(), value: isPresented)
            }
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
```

### 説明

1. **SFSymbols.speakerWave2Circle.image**: SFSymbolsのアイコンを使用しています。
2. **resizable()**: アイコンのサイズを変更できるようにします。
3. **frame(width:height:)**: アイコンのサイズを指定します。
4. **foregroundColor(.gray)**: アイコンの色をグレーに設定します。
5. **background(Color.white)**: アイコンの背景色を白に設定します。
6. **clipShape(Circle())**: 背景を円形にクリップします。
7. **shadow(radius: 10)**: アイコンに影を追加します。

この実装により、アイコンが円形の背景に配置され、透明なシートを表示することができます。

---
