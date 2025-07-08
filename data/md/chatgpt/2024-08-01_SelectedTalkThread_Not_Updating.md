# SelectedTalkThread Not Updating

Date: 2024-08-01

---

## 👤 User
*2024-08-01 16:43:40*

selectedTalkThread がスワイプによって格納できていない。どうしてだろう。

final class ThreadListPresenter&lt;Dependency: ThreadListPresenterDependency&gt;: ObservableObject {
    @Published private(set) var talkThreads: [TalkThread] = []
    @Published var selectedTalkThread: TalkThread?
}

public struct ThreadListView&lt;Dependency: RootDIContainerDependency&gt;: View {
    private let dependency: Dependency
    @StateObject private var presenter: ThreadListPresenter&lt;Dependency&gt;

    public init(dependency: Dependency, talkBox: TalkBox) {
        self.dependency = dependency
        _presenter = .init(wrappedValue: ThreadListPresenter(dependency: dependency, talkBox: talkBox))
    }

    public var body: some View {
        VStack {
            // iOS 16 では pageing ができないため iOS 16 対応するのであれば 別途対応する
            if #available(iOS 17.0, *) {
                ThreadListScrollView(
                    selectedTalkThread: $presenter.selectedTalkThread,
                    talkThreads: presenter.talkThreads,
                    spacing: 16,
                    padding: 32,
                    onTapTalkThread: presenter.onTapTalkThread,
                    onTapStampReaction: presenter.onTapStampReaction,
                    onDownSwipe: presenter.onDownSwipe,
                    onUpSwipe: presenter.onUpSwipe,
                    volumeLevels: presenter.audioVolumeLevels,
                    volumeLevelColumns: ThreadListPresenter&lt;Dependency&gt;.volumeLevelColumns,
                    isPlaying: presenter.isPlaying
                )
                .padding(.vertical)

                Button {
                    presenter.onTapNewPost()
                } label: {
                    Label {
                        Text("新規投稿")
                    } icon: {
                        SFSymbols.mic.image
                    }
                }
                .buttonStyle(.borderedProminent)
                .controlSize(.large)
                .tint(.black)
            }
        }
        .navigationTitle(presenter.talkBox.name)
        .overlayLoading(isPresented: $presenter.isLoading, isGestureReactable: true)
        .overlayToast(toastType: $presenter.toastType)
        .appErrorAlert(isPresented: $presenter.showAlert, appError: presenter.appError)
        .sheet(isPresented: $presenter.showThreadPostView) {
            ThreadPostView(dependency: dependency)
                .navigationStacked()
        }
        .sheet(isPresented: $presenter.showVoicePostView) {
            VoicePostView(dependency: dependency)
                .navigationStacked()
        }
        .sheet(isPresented: $presenter.showStampListView) {
            if let talkThread = presenter.selectedTalkThread {
                if #available(iOS 16.4, *) {
                    StampListView(dependency: dependency, talkThread: talkThread)
                        .ignoresSafeArea(edges: .bottom)
                        .navigationStacked()
                        .presentationDetents([.fraction(0.8)])
                        .presentationBackground(.clear) // @available(iOS 16.4, *)
                } else {
                    StampListView(dependency: dependency, talkThread: talkThread)
                        .ignoresSafeArea(edges: .bottom)
                        .navigationStacked()
                        .presentationDetents([.fraction(0.8)])
                }
            }
        }
        .sheet(isPresented: $presenter.showTalkThreadDetailView) {
            if let talkThread = presenter.selectedTalkThread {
                ThreadDetailView(dependency: dependency, talkThread: talkThread)
                    .navigationStacked()
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

@available(iOS 17.0, *)
struct ThreadListScrollView: View {
    @Binding var selectedTalkThread: TalkThread?
    let talkThreads: [TalkThread]
    let spacing: CGFloat
    let padding: CGFloat
    let onTapTalkThread: () -&gt; Void
    let onTapStampReaction: () -&gt; Void
    let onDownSwipe: () -&gt; Void
    let onUpSwipe: () -&gt; Void
    let volumeLevels: [Double]
    let volumeLevelColumns: Int
    let isPlaying: Bool

    @State private var activeOffsetY: [String: CGFloat] = [:]

    var body: some View {
        GeometryReader { geometry in
            ScrollView(.horizontal) {
                LazyHStack(spacing: spacing) {
                    ForEach(talkThreads, id: \.id) { talkThread in
                        ZStack {
                            VStack {
                                Text("↓スワイプでコメント")
                                    .foregroundStyle(.white)
                                    .font(.headline)
                                    .padding()
                                Spacer()
                            }
                            .frame(maxWidth: .infinity, maxHeight: .infinity)
                            .background(Color.accentColor)

                            ZStack {
                                // 裏の画像
                                CachedAsyncImageView(imageUrl: talkThread.imageUrl)

                                // 下側のコンテンツ
                                VStack {
                                    Spacer()
                                    HStack {
                                        CachedAsyncImageView(imageUrl: talkThread.imageUrl)
                                            .frame(width: 40, height: 40)
                                            .clipShape(.circle)

                                        VStack(alignment: .leading) {
                                            Text(talkThread.postedBy.name)
                                                .foregroundColor(.primary)

                                            Text(talkThread.updatedAt.relativeDateTime)
                                                .foregroundColor(.secondary)
                                                .font(.subheadline)
                                        }
                                        .lineLimit(1)
                                        .padding(.leading, 8)

                                        Spacer()

                                        HStack(spacing: -8) {
                                            ForEach(talkThread.posts.prefix(3)) { post in
                                                ZStack(alignment: .topLeading) { // rightToLeft に合わせて leading になっている
                                                    CachedAsyncImageView(imageUrl: post.postedBy.imageUrl)
                                                        .frame(width: 32, height: 32)
                                                        .clipShape(.circle)

                                                    if let imageUrl = post.postType.imageUrl {
                                                        CachedAsyncImageView(imageUrl: imageUrl)
                                                            .frame(width: 16, height: 16)
                                                            .clipShape(.circle)
                                                            .offset(x: -4, y: -4) // rightToLeft に合わせて x が負になっている
                                                    }
                                                }
                                            }
                                        }
                                        .environment(\.layoutDirection, .rightToLeft)
                                    }
                                    .frame(maxWidth: .infinity, alignment: .leading)
                                    .frame(height: 80)
                                    .padding(.horizontal)
                                    .background(.ultraThinMaterial)
                                }

                                // 音声の波
                                GeometryReader { geometry in
                                    if isPlaying, talkThread == selectedTalkThread {
                                        WaveformView(volumeLevels: volumeLevels, maxColumnCount: volumeLevelColumns)
                                            .frame(width: geometry.size.width - 16, height: 100)
                                            .position(x: geometry.size.width / 2, y: geometry.size.height / 2)
                                            .transition(.opacity)
                                    }
                                }
                                .animation(.easeInOut, value: isPlaying)
                            }
                            .offset(y: activeOffsetY[talkThread.id] ?? 0)
                            // 普通の .gesture だとスクロールと干渉してスクロールできなくなる
                            .simultaneousGesture(
                                DragGesture()
                                    .onChanged { value in
                                        let newOffset = value.translation.height

                                        // 下スワイプのみ許可
                                        if newOffset &gt; 0 {
                                            activeOffsetY[talkThread.id] = newOffset
                                        }

                                        // 上スワイプは許可しないが onUpSwipe を実行
                                        if newOffset &lt; -100 {
                                            onUpSwipe()
                                        }

                                        // 下スワイプ
                                        if newOffset &gt; 100 {
                                            activeOffsetY[talkThread.id] = 0
                                            onDownSwipe()
                                        }
                                    }
                                    .onEnded { _ in
                                        activeOffsetY[talkThread.id] = 0
                                    }
                            )
                            .onTapGesture {
                                onTapTalkThread()
                            }
                            // offsetY = 0 としたときになめらかにアニメーションするように
                            .animation(.default, value: activeOffsetY[talkThread.id])
                        }
                        .frame(width: geometry.size.width - padding * 2)
                        .clipShape(RoundedRectangle(cornerRadius: 8))
                        // これがないと長押しのタップ領域が正しく反映されない
                        // Ref: 【SwiftUI】contentShapeでTap領域を広げる - https://qiita.com/shiz/items/96585bddbc442683b78c
                        .contentShape(RoundedRectangle(cornerRadius: 8))
                        // Ref: [SwiftUI] contextMenu modifier タップしたViewの背景色を消す方法 - https://zenn.dev/your3i/articles/f03210a0270a5b
                        .contextMenu {
                            Button {
                                onTapStampReaction()
                            } label: {
                                Label {
                                    Text("スタンプ返信")
                                } icon: {
                                    SFSymbols.faceSmiling.image
                                }
                            }
                        }
                    }
                }
                .padding(.horizontal, padding)
                .padding(.vertical)
                .scrollTargetLayout()
            }
            .scrollTargetBehavior(.viewAligned) // paging だと上手くいかないので注意
            // iOS 18.0 でバックグラウンドで再生して自動スクロールした時にすこしスクロール位置がずれてしまう（おそらく OS バグ）
            .scrollPosition(id: $selectedTalkThread) // scrollTargetLayout() のコンテンツの id の値とバインディングする
            .scrollIndicators(.hidden)
        }
    }
}

---

## 🤖 Assistant
*2024-08-01 16:43:50*

`selectedTalkThread`がスワイプによって設定されない原因はいくつか考えられます。以下の点を確認してみてください：

1. **`onTapTalkThread`の実装を確認する**:
   `onTapTalkThread`メソッドが実際に`selectedTalkThread`を更新しているかどうか確認します。

2. **`ThreadListPresenter`内の`onDownSwipe`と`onUpSwipe`の実装を確認する**:
   `onDownSwipe`または`onUpSwipe`メソッドが`selectedTalkThread`を正しく更新しているか確認します。

3. **`simultaneousGesture`の競合を確認する**:
   スクロールとスワイプジェスチャが競合していないか確認します。特に、スワイプジェスチャの`onChanged`や`onEnded`の中で適切に`selectedTalkThread`が更新されているか確認します。

4. **`selectedTalkThread`のバインディングの問題を確認する**:
   `ThreadListScrollView`で`selectedTalkThread`が正しくバインドされているか、またそのバインドが切れていないか確認します。

以下のコードを確認してください：

### `ThreadListPresenter`

```swift
final class ThreadListPresenter<Dependency: ThreadListPresenterDependency>: ObservableObject {
    @Published private(set) var talkThreads: [TalkThread] = []
    @Published var selectedTalkThread: TalkThread?

    func onTapTalkThread(talkThread: TalkThread) {
        selectedTalkThread = talkThread
    }

    func onDownSwipe() {
        // Implementation of what should happen on down swipe
    }

    func onUpSwipe() {
        // Implementation of what should happen on up swipe
    }
}
```

### `ThreadListView`

```swift
public struct ThreadListView<Dependency: RootDIContainerDependency>: View {
    private let dependency: Dependency
    @StateObject private var presenter: ThreadListPresenter<Dependency>

    public init(dependency: Dependency, talkBox: TalkBox) {
        self.dependency = dependency
        _presenter = .init(wrappedValue: ThreadListPresenter(dependency: dependency, talkBox: talkBox))
    }

    public var body: some View {
        VStack {
            if #available(iOS 17.0, *) {
                ThreadListScrollView(
                    selectedTalkThread: $presenter.selectedTalkThread,
                    talkThreads: presenter.talkThreads,
                    spacing: 16,
                    padding: 32,
                    onTapTalkThread: { talkThread in
                        presenter.onTapTalkThread(talkThread: talkThread)
                    },
                    onTapStampReaction: presenter.onTapStampReaction,
                    onDownSwipe: presenter.onDownSwipe,
                    onUpSwipe: presenter.onUpSwipe,
                    volumeLevels: presenter.audioVolumeLevels,
                    volumeLevelColumns: ThreadListPresenter<Dependency>.volumeLevelColumns,
                    isPlaying: presenter.isPlaying
                )
                .padding(.vertical)

                Button {
                    presenter.onTapNewPost()
                } label: {
                    Label {
                        Text("新規投稿")
                    } icon: {
                        SFSymbols.mic.image
                    }
                }
                .buttonStyle(.borderedProminent)
                .controlSize(.large)
                .tint(.black)
            }
        }
        .navigationTitle(presenter.talkBox.name)
        .overlayLoading(isPresented: $presenter.isLoading, isGestureReactable: true)
        .overlayToast(toastType: $presenter.toastType)
        .appErrorAlert(isPresented: $presenter.showAlert, appError: presenter.appError)
        .sheet(isPresented: $presenter.showThreadPostView) {
            ThreadPostView(dependency: dependency)
                .navigationStacked()
        }
        .sheet(isPresented: $presenter.showVoicePostView) {
            VoicePostView(dependency: dependency)
                .navigationStacked()
        }
        .sheet(isPresented: $presenter.showStampListView) {
            if let talkThread = presenter.selectedTalkThread {
                if #available(iOS 16.4, *) {
                    StampListView(dependency: dependency, talkThread: talkThread)
                        .ignoresSafeArea(edges: .bottom)
                        .navigationStacked()
                        .presentationDetents([.fraction(0.8)])
                        .presentationBackground(.clear)
                } else {
                    StampListView(dependency: dependency, talkThread: talkThread)
                        .ignoresSafeArea(edges: .bottom)
                        .navigationStacked()
                        .presentationDetents([.fraction(0.8)])
                }
            }
        }
        .sheet(isPresented: $presenter.showTalkThreadDetailView) {
            if let talkThread = presenter.selectedTalkThread {
                ThreadDetailView(dependency: dependency, talkThread: talkThread)
                    .navigationStacked()
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
```

### `ThreadListScrollView`

```swift
@available(iOS 17.0, *)
struct ThreadListScrollView: View {
    @Binding var selectedTalkThread: TalkThread?
    let talkThreads: [TalkThread]
    let spacing: CGFloat
    let padding: CGFloat
    let onTapTalkThread: (TalkThread) -&gt; Void
    let onTapStampReaction: () -&gt; Void
    let onDownSwipe: () -&gt; Void
    let onUpSwipe: () -&gt; Void
    let volumeLevels: [Double]
    let volumeLevelColumns: Int
    let isPlaying: Bool

    @State private var activeOffsetY: [String: CGFloat] = [:]

    var body: some View {
        GeometryReader { geometry in
            ScrollView(.horizontal) {
                LazyHStack(spacing: spacing) {
                    ForEach(talkThreads, id: \.id) { talkThread in
                        ZStack {
                            VStack {
                                Text("↓スワイプでコメント")
                                    .foregroundStyle(.white)
                                    .font(.headline)
                                    .padding()
                                Spacer()
                            }
                            .frame(maxWidth: .infinity, maxHeight: .infinity)
                            .background(Color.accentColor)

                            ZStack {
                                // 裏の画像
                                CachedAsyncImageView(imageUrl: talkThread.imageUrl)

                                // 下側のコンテンツ
                                VStack {
                                    Spacer()
                                    HStack {
                                        CachedAsyncImageView(imageUrl: talkThread.imageUrl)
                                            .frame(width: 40, height: 40)
                                            .clipShape(.circle)

                                        VStack(alignment: .leading) {
                                            Text(talkThread.postedBy.name)
                                                .foregroundColor(.primary)

                                            Text(talkThread.updatedAt.relativeDateTime)
                                                .foregroundColor(.secondary)
                                                .font(.subheadline)
                                        }
                                        .lineLimit(1)
                                        .padding(.leading, 8)

                                        Spacer()

                                        HStack(spacing: -8) {
                                            ForEach(talkThread.posts.prefix(3)) { post in
                                                ZStack(alignment: .topLeading) {
                                                    CachedAsyncImageView(imageUrl: post.postedBy.imageUrl)
                                                        .frame(width: 32, height: 32)
                                                        .clipShape(.circle)

                                                    if let imageUrl = post.postType.imageUrl {
                                                        CachedAsyncImageView(imageUrl: imageUrl)
                                                            .frame(width: 16, height: 16)
                                                            .clipShape(.circle)
                                                            .offset(x: -4, y: -4)
                                                    }
                                                }
                                            }
                                        }
                                        .environment(\.layoutDirection, .rightToLeft)
                                    }
                                    .frame(maxWidth: .infinity, alignment: .leading)
                                    .frame(height: 80)
                                    .padding(.horizontal)
                                    .background(.ultraThinMaterial)
                                }

                                // 音声の波
                                GeometryReader { geometry in
                                    if isPlaying, talkThread == selectedTalkThread {
                                        WaveformView(volumeLevels: volumeLevels, maxColumnCount: volumeLevelColumns)
                                            .frame(width: geometry.size.width - 16, height: 100)
                                            .position(x: geometry.size.width / 2, y: geometry.size.height / 2)
                                            .transition(.opacity)
                                    }
                                }
                                .animation(.easeInOut, value: isPlaying)
                            }
                            .offset(y: activeOffsetY[talkThread.id] ?? 0)
                            .simultaneousGesture(
                                DragGesture()
                                    .onChanged { value in
                                        let newOffset = value.translation.height

                                        if newOffset &gt; 0 {
                                            activeOffsetY[talkThread.id] = newOffset
                                        }

                                        if newOffset &lt; -100 {
                                            onUpSwipe()
                                        }

                                        if newOffset &gt; 100 {
                                            activeOffsetY[talkThread.id] = 0
                                            onDownSwipe()
                                        }
                                    }
                                    .onEnded { _ in
                                        activeOffsetY[talkThread.id] = 0
                                    }
                            )
                            .onTapGesture {
                                onTapTalkThread(talkThread)
                            }
                            .animation(.default, value: activeOffsetY[talkThread.id])
                        }
                        .frame(width: geometry.size.width - padding * 2)
                        .clipShape(RoundedRectangle(cornerRadius: 8))
                        .contentShape(RoundedRectangle(cornerRadius: 8))
                        .contextMenu {
                            Button {
                                onTapStampReaction()
                            } label: {
                                Label {
                                    Text("スタンプ返信")
                                } icon: {
                                    SFSymbol

---

## 🤖 Assistant
*2024-08-01 16:46:56*

s.faceSmiling.image
                                }
                            }
                        }
                    }
                }
                .padding(.horizontal, padding)
                .padding(.vertical)
                .scrollTargetLayout()
            }
            .scrollTargetBehavior(.viewAligned)
            .scrollPosition(id: $selectedTalkThread)
            .scrollIndicators(.hidden)
        }
    }
}
```

上記のコードを確認しても問題が解決しない場合、追加の詳細情報を提供していただければ、さらに具体的なアドバイスを提供できます。

---

## 👤 User
*2024-08-01 16:48:01*

simultaneousGesture を gesture に変えたら横スクロールができなくなった。
横スクロールと.scrollPosition(id: $selectedTalkThread)を共存させたい

import DomainLayer
import SwiftUI

// MARK: - View

public struct ThreadListView&lt;Dependency: RootDIContainerDependency&gt;: View {
    private let dependency: Dependency
    @StateObject private var presenter: ThreadListPresenter&lt;Dependency&gt;

    public init(dependency: Dependency, talkBox: TalkBox) {
        self.dependency = dependency
        _presenter = .init(wrappedValue: ThreadListPresenter(dependency: dependency, talkBox: talkBox))
    }

    public var body: some View {
        VStack {
            // iOS 16 では pageing ができないため iOS 16 対応するのであれば 別途対応する
            if #available(iOS 17.0, *) {
                ThreadListScrollView(
                    selectedTalkThread: $presenter.selectedTalkThread,
                    talkThreads: presenter.talkThreads,
                    spacing: 16,
                    padding: 32,
                    onTapTalkThread: presenter.onTapTalkThread,
                    onTapStampReaction: presenter.onTapStampReaction,
                    onDownSwipe: presenter.onDownSwipe,
                    onUpSwipe: presenter.onUpSwipe,
                    volumeLevels: presenter.audioVolumeLevels,
                    volumeLevelColumns: ThreadListPresenter&lt;Dependency&gt;.volumeLevelColumns,
                    isPlaying: presenter.isPlaying
                )
                .padding(.vertical)

                Button {
                    presenter.onTapNewPost()
                } label: {
                    Label {
                        Text("新規投稿")
                    } icon: {
                        SFSymbols.mic.image
                    }
                }
                .buttonStyle(.borderedProminent)
                .controlSize(.large)
                .tint(.black)
            }
        }
        .navigationTitle(presenter.talkBox.name)
        .overlayLoading(isPresented: $presenter.isLoading, isGestureReactable: true)
        .overlayToast(toastType: $presenter.toastType)
        .appErrorAlert(isPresented: $presenter.showAlert, appError: presenter.appError)
        .sheet(isPresented: $presenter.showThreadPostView) {
            ThreadPostView(dependency: dependency)
                .navigationStacked()
        }
        .sheet(isPresented: $presenter.showVoicePostView) {
            VoicePostView(dependency: dependency)
                .navigationStacked()
        }
        .sheet(isPresented: $presenter.showStampListView) {
            if let talkThread = presenter.selectedTalkThread {
                if #available(iOS 16.4, *) {
                    StampListView(dependency: dependency, talkThread: talkThread)
                        .ignoresSafeArea(edges: .bottom)
                        .navigationStacked()
                        .presentationDetents([.fraction(0.8)])
                        .presentationBackground(.clear) // @available(iOS 16.4, *)
                } else {
                    StampListView(dependency: dependency, talkThread: talkThread)
                        .ignoresSafeArea(edges: .bottom)
                        .navigationStacked()
                        .presentationDetents([.fraction(0.8)])
                }
            }
        }
        .sheet(isPresented: $presenter.showTalkThreadDetailView) {
            if let talkThread = presenter.selectedTalkThread {
                ThreadDetailView(dependency: dependency, talkThread: talkThread)
                    .navigationStacked()
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

@available(iOS 17.0, *)
struct ThreadListScrollView: View {
    @Binding var selectedTalkThread: TalkThread?
    let talkThreads: [TalkThread]
    let spacing: CGFloat
    let padding: CGFloat
    let onTapTalkThread: () -&gt; Void
    let onTapStampReaction: () -&gt; Void
    let onDownSwipe: () -&gt; Void
    let onUpSwipe: () -&gt; Void
    let volumeLevels: [Double]
    let volumeLevelColumns: Int
    let isPlaying: Bool

    @State private var activeOffsetY: [String: CGFloat] = [:]

    var body: some View {
        GeometryReader { geometry in
            ScrollView(.horizontal) {
                LazyHStack(spacing: spacing) {
                    ForEach(talkThreads, id: \.id) { talkThread in
                        ZStack {
                            VStack {
                                Text("↓スワイプでコメント")
                                    .foregroundStyle(.white)
                                    .font(.headline)
                                    .padding()
                                Spacer()
                            }
                            .frame(maxWidth: .infinity, maxHeight: .infinity)
                            .background(Color.accentColor)

                            ZStack {
                                // 裏の画像
                                CachedAsyncImageView(imageUrl: talkThread.imageUrl)

                                // 下側のコンテンツ
                                VStack {
                                    Spacer()
                                    HStack {
                                        CachedAsyncImageView(imageUrl: talkThread.imageUrl)
                                            .frame(width: 40, height: 40)
                                            .clipShape(.circle)

                                        VStack(alignment: .leading) {
                                            Text(talkThread.postedBy.name)
                                                .foregroundColor(.primary)

                                            Text(talkThread.updatedAt.relativeDateTime)
                                                .foregroundColor(.secondary)
                                                .font(.subheadline)
                                        }
                                        .lineLimit(1)
                                        .padding(.leading, 8)

                                        Spacer()

                                        HStack(spacing: -8) {
                                            ForEach(talkThread.posts.prefix(3)) { post in
                                                ZStack(alignment: .topLeading) { // rightToLeft に合わせて leading になっている
                                                    CachedAsyncImageView(imageUrl: post.postedBy.imageUrl)
                                                        .frame(width: 32, height: 32)
                                                        .clipShape(.circle)

                                                    if let imageUrl = post.postType.imageUrl {
                                                        CachedAsyncImageView(imageUrl: imageUrl)
                                                            .frame(width: 16, height: 16)
                                                            .clipShape(.circle)
                                                            .offset(x: -4, y: -4) // rightToLeft に合わせて x が負になっている
                                                    }
                                                }
                                            }
                                        }
                                        .environment(\.layoutDirection, .rightToLeft)
                                    }
                                    .frame(maxWidth: .infinity, alignment: .leading)
                                    .frame(height: 80)
                                    .padding(.horizontal)
                                    .background(.ultraThinMaterial)
                                }

                                // 音声の波
                                GeometryReader { geometry in
                                    if isPlaying, talkThread == selectedTalkThread {
                                        WaveformView(volumeLevels: volumeLevels, maxColumnCount: volumeLevelColumns)
                                            .frame(width: geometry.size.width - 16, height: 100)
                                            .position(x: geometry.size.width / 2, y: geometry.size.height / 2)
                                            .transition(.opacity)
                                    }
                                }
                                .animation(.easeInOut, value: isPlaying)
                            }
                            .offset(y: activeOffsetY[talkThread.id] ?? 0)
                            // 普通の .gesture だとスクロールと干渉してスクロールできなくなる
                            .gesture(
                                DragGesture()
                                    .onChanged { value in
                                        let newOffset = value.translation.height

                                        // 下スワイプのみ許可
                                        if newOffset &gt; 0 {
                                            activeOffsetY[talkThread.id] = newOffset
                                        }

                                        // 上スワイプは許可しないが onUpSwipe を実行
                                        if newOffset &lt; -100 {
                                            onUpSwipe()
                                        }

                                        // 下スワイプ
                                        if newOffset &gt; 100 {
                                            activeOffsetY[talkThread.id] = 0
                                            onDownSwipe()
                                        }
                                    }
                                    .onEnded { _ in
                                        activeOffsetY[talkThread.id] = 0
                                    }
                            )
                            .onTapGesture {
                                onTapTalkThread()
                            }
                            // offsetY = 0 としたときになめらかにアニメーションするように
                            .animation(.default, value: activeOffsetY[talkThread.id])
                        }
                        .frame(width: geometry.size.width - padding * 2)
                        .clipShape(RoundedRectangle(cornerRadius: 8))
                        // これがないと長押しのタップ領域が正しく反映されない
                        // Ref: 【SwiftUI】contentShapeでTap領域を広げる - https://qiita.com/shiz/items/96585bddbc442683b78c
                        .contentShape(RoundedRectangle(cornerRadius: 8))
                        // Ref: [SwiftUI] contextMenu modifier タップしたViewの背景色を消す方法 - https://zenn.dev/your3i/articles/f03210a0270a5b
                        .contextMenu {
                            Button {
                                onTapStampReaction()
                            } label: {
                                Label {
                                    Text("スタンプ返信")
                                } icon: {
                                    SFSymbols.faceSmiling.image
                                }
                            }
                        }
                    }
                }
                .padding(.horizontal, padding)
                .padding(.vertical)
                .scrollTargetLayout()
            }
            .scrollTargetBehavior(.viewAligned) // paging だと上手くいかないので注意
            // iOS 18.0 でバックグラウンドで再生して自動スクロールした時にすこしスクロール位置がずれてしまう（おそらく OS バグ）
            .scrollPosition(id: $selectedTalkThread) // scrollTargetLayout() のコンテンツの id の値とバインディングする
            .scrollIndicators(.hidden)
        }
    }
}

---

## 🤖 Assistant
*2024-08-01 16:48:51*

`simultaneousGesture`を`gesture`に変更すると、横スクロールができなくなる問題は、ジェスチャがスクロールと競合するためです。これを解決するために、スワイプとスクロールを共存させる方法として、カスタムジェスチャーを使用して横スクロールを保持しつつ、スワイプを処理する方法を検討します。

以下はその実装例です：

```swift
@available(iOS 17.0, *)
struct ThreadListScrollView: View {
    @Binding var selectedTalkThread: TalkThread?
    let talkThreads: [TalkThread]
    let spacing: CGFloat
    let padding: CGFloat
    let onTapTalkThread: (TalkThread) -> Void
    let onTapStampReaction: () -> Void
    let onDownSwipe: () -> Void
    let onUpSwipe: () -> Void
    let volumeLevels: [Double]
    let volumeLevelColumns: Int
    let isPlaying: Bool

    @State private var activeOffsetY: [String: CGFloat] = [:]
    @State private var dragStartLocation: CGPoint? = nil

    var body: some View {
        GeometryReader { geometry in
            ScrollView(.horizontal) {
                LazyHStack(spacing: spacing) {
                    ForEach(talkThreads, id: \.id) { talkThread in
                        ZStack {
                            VStack {
                                Text("↓スワイプでコメント")
                                    .foregroundStyle(.white)
                                    .font(.headline)
                                    .padding()
                                Spacer()
                            }
                            .frame(maxWidth: .infinity, maxHeight: .infinity)
                            .background(Color.accentColor)

                            ZStack {
                                // 裏の画像
                                CachedAsyncImageView(imageUrl: talkThread.imageUrl)

                                // 下側のコンテンツ
                                VStack {
                                    Spacer()
                                    HStack {
                                        CachedAsyncImageView(imageUrl: talkThread.imageUrl)
                                            .frame(width: 40, height: 40)
                                            .clipShape(.circle)

                                        VStack(alignment: .leading) {
                                            Text(talkThread.postedBy.name)
                                                .foregroundColor(.primary)

                                            Text(talkThread.updatedAt.relativeDateTime)
                                                .foregroundColor(.secondary)
                                                .font(.subheadline)
                                        }
                                        .lineLimit(1)
                                        .padding(.leading, 8)

                                        Spacer()

                                        HStack(spacing: -8) {
                                            ForEach(talkThread.posts.prefix(3)) { post in
                                                ZStack(alignment: .topLeading) { // rightToLeft に合わせて leading になっている
                                                    CachedAsyncImageView(imageUrl: post.postedBy.imageUrl)
                                                        .frame(width: 32, height: 32)
                                                        .clipShape(.circle)

                                                    if let imageUrl = post.postType.imageUrl {
                                                        CachedAsyncImageView(imageUrl: imageUrl)
                                                            .frame(width: 16, height: 16)
                                                            .clipShape(.circle)
                                                            .offset(x: -4, y: -4) // rightToLeft に合わせて x が負になっている
                                                    }
                                                }
                                            }
                                        }
                                        .environment(\.layoutDirection, .rightToLeft)
                                    }
                                    .frame(maxWidth: .infinity, alignment: .leading)
                                    .frame(height: 80)
                                    .padding(.horizontal)
                                    .background(.ultraThinMaterial)
                                }

                                // 音声の波
                                GeometryReader { geometry in
                                    if isPlaying, talkThread == selectedTalkThread {
                                        WaveformView(volumeLevels: volumeLevels, maxColumnCount: volumeLevelColumns)
                                            .frame(width: geometry.size.width - 16, height: 100)
                                            .position(x: geometry.size.width / 2, y: geometry.size.height / 2)
                                            .transition(.opacity)
                                    }
                                }
                                .animation(.easeInOut, value: isPlaying)
                            }
                            .offset(y: activeOffsetY[talkThread.id] ?? 0)
                            .gesture(
                                DragGesture()
                                    .onChanged { value in
                                        let newOffset = value.translation.height

                                        // 下スワイプのみ許可
                                        if newOffset > 0 {
                                            activeOffsetY[talkThread.id] = newOffset
                                        }

                                        // 上スワイプは許可しないが onUpSwipe を実行
                                        if newOffset < -100 {
                                            onUpSwipe()
                                        }

                                        // 下スワイプ
                                        if newOffset > 100 {
                                            activeOffsetY[talkThread.id] = 0
                                            onDownSwipe()
                                        }
                                    }
                                    .onEnded { _ in
                                        activeOffsetY[talkThread.id] = 0
                                    }
                            )
                            .highPriorityGesture(
                                DragGesture(minimumDistance: 30, coordinateSpace: .local)
                                    .onChanged { value in
                                        dragStartLocation = value.startLocation
                                    }
                                    .onEnded { value in
                                        guard let startLocation = dragStartLocation else { return }
                                        let endLocation = value.location
                                        let verticalDistance = abs(startLocation.y - endLocation.y)
                                        let horizontalDistance = abs(startLocation.x - endLocation.x)

                                        if verticalDistance > horizontalDistance {
                                            if endLocation.y > startLocation.y {
                                                onDownSwipe()
                                            } else {
                                                onUpSwipe()
                                            }
                                        }
                                        dragStartLocation = nil
                                    }
                            )
                            .onTapGesture {
                                onTapTalkThread(talkThread)
                            }
                            .animation(.default, value: activeOffsetY[talkThread.id])
                        }
                        .frame(width: geometry.size.width - padding * 2)
                        .clipShape(RoundedRectangle(cornerRadius: 8))
                        .contentShape(RoundedRectangle(cornerRadius: 8))
                        .contextMenu {
                            Button {
                                onTapStampReaction()
                            } label: {
                                Label {
                                    Text("スタンプ返信")
                                } icon: {
                                    SFSymbols.faceSmiling.image
                                }
                            }
                        }
                    }
                }
                .padding(.horizontal, padding)
                .padding(.vertical)
                .scrollTargetLayout()
            }
            .scrollTargetBehavior(.viewAligned)
            .scrollPosition(id: $selectedTalkThread)
            .scrollIndicators(.hidden)
        }
    }
}
```

この実装では、`highPriorityGesture`を使用して、ドラッグジェスチャを高優先度で処理し、縦方向のスワイプと横方向のスクロールを区別しています。この方法で、スクロールとスワイプの両方を適切に動作させることができます。

---

## 👤 User
*2024-08-01 16:50:55*

.scrollPosition(id: $selectedTalkThread) で処理するのは諦めて、スクロール位置で判定するのはどうですか？

public struct ThreadListView&lt;Dependency: RootDIContainerDependency&gt;: View {
    private let dependency: Dependency
    @StateObject private var presenter: ThreadListPresenter&lt;Dependency&gt;

    public init(dependency: Dependency, talkBox: TalkBox) {
        self.dependency = dependency
        _presenter = .init(wrappedValue: ThreadListPresenter(dependency: dependency, talkBox: talkBox))
    }

    public var body: some View {
        VStack {
            // iOS 16 では pageing ができないため iOS 16 対応するのであれば 別途対応する
            if #available(iOS 17.0, *) {
                ThreadListScrollView(
                    selectedTalkThread: $presenter.selectedTalkThread,
                    talkThreads: presenter.talkThreads,
                    spacing: 16,
                    padding: 32,
                    onTapTalkThread: presenter.onTapTalkThread,
                    onTapStampReaction: presenter.onTapStampReaction,
                    onDownSwipe: presenter.onDownSwipe,
                    onUpSwipe: presenter.onUpSwipe,
                    volumeLevels: presenter.audioVolumeLevels,
                    volumeLevelColumns: ThreadListPresenter&lt;Dependency&gt;.volumeLevelColumns,
                    isPlaying: presenter.isPlaying
                )
                .padding(.vertical)

                Button {
                    presenter.onTapNewPost()
                } label: {
                    Label {
                        Text("新規投稿")
                    } icon: {
                        SFSymbols.mic.image
                    }
                }
                .buttonStyle(.borderedProminent)
                .controlSize(.large)
                .tint(.black)
            }
        }
        .navigationTitle(presenter.talkBox.name)
        .overlayLoading(isPresented: $presenter.isLoading, isGestureReactable: true)
        .overlayToast(toastType: $presenter.toastType)
        .appErrorAlert(isPresented: $presenter.showAlert, appError: presenter.appError)
        .sheet(isPresented: $presenter.showThreadPostView) {
            ThreadPostView(dependency: dependency)
                .navigationStacked()
        }
        .sheet(isPresented: $presenter.showVoicePostView) {
            VoicePostView(dependency: dependency)
                .navigationStacked()
        }
        .sheet(isPresented: $presenter.showStampListView) {
            if let talkThread = presenter.selectedTalkThread {
                if #available(iOS 16.4, *) {
                    StampListView(dependency: dependency, talkThread: talkThread)
                        .ignoresSafeArea(edges: .bottom)
                        .navigationStacked()
                        .presentationDetents([.fraction(0.8)])
                        .presentationBackground(.clear) // @available(iOS 16.4, *)
                } else {
                    StampListView(dependency: dependency, talkThread: talkThread)
                        .ignoresSafeArea(edges: .bottom)
                        .navigationStacked()
                        .presentationDetents([.fraction(0.8)])
                }
            }
        }
        .sheet(isPresented: $presenter.showTalkThreadDetailView) {
            if let talkThread = presenter.selectedTalkThread {
                ThreadDetailView(dependency: dependency, talkThread: talkThread)
                    .navigationStacked()
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

@available(iOS 17.0, *)
struct ThreadListScrollView: View {
    @Binding var selectedTalkThread: TalkThread?
    let talkThreads: [TalkThread]
    let spacing: CGFloat
    let padding: CGFloat
    let onTapTalkThread: () -&gt; Void
    let onTapStampReaction: () -&gt; Void
    let onDownSwipe: () -&gt; Void
    let onUpSwipe: () -&gt; Void
    let volumeLevels: [Double]
    let volumeLevelColumns: Int
    let isPlaying: Bool

    @State private var activeOffsetY: [String: CGFloat] = [:]

    var body: some View {
        GeometryReader { geometry in
            ScrollView(.horizontal) {
                LazyHStack(spacing: spacing) {
                    ForEach(talkThreads, id: \.id) { talkThread in
                        ZStack {
                            VStack {
                                Text("↓スワイプでコメント")
                                    .foregroundStyle(.white)
                                    .font(.headline)
                                    .padding()
                                Spacer()
                            }
                            .frame(maxWidth: .infinity, maxHeight: .infinity)
                            .background(Color.accentColor)

                            ZStack {
                                // 裏の画像
                                CachedAsyncImageView(imageUrl: talkThread.imageUrl)

                                // 下側のコンテンツ
                                VStack {
                                    Spacer()
                                    HStack {
                                        CachedAsyncImageView(imageUrl: talkThread.imageUrl)
                                            .frame(width: 40, height: 40)
                                            .clipShape(.circle)

                                        VStack(alignment: .leading) {
                                            Text(talkThread.postedBy.name)
                                                .foregroundColor(.primary)

                                            Text(talkThread.updatedAt.relativeDateTime)
                                                .foregroundColor(.secondary)
                                                .font(.subheadline)
                                        }
                                        .lineLimit(1)
                                        .padding(.leading, 8)

                                        Spacer()

                                        HStack(spacing: -8) {
                                            ForEach(talkThread.posts.prefix(3)) { post in
                                                ZStack(alignment: .topLeading) { // rightToLeft に合わせて leading になっている
                                                    CachedAsyncImageView(imageUrl: post.postedBy.imageUrl)
                                                        .frame(width: 32, height: 32)
                                                        .clipShape(.circle)

                                                    if let imageUrl = post.postType.imageUrl {
                                                        CachedAsyncImageView(imageUrl: imageUrl)
                                                            .frame(width: 16, height: 16)
                                                            .clipShape(.circle)
                                                            .offset(x: -4, y: -4) // rightToLeft に合わせて x が負になっている
                                                    }
                                                }
                                            }
                                        }
                                        .environment(\.layoutDirection, .rightToLeft)
                                    }
                                    .frame(maxWidth: .infinity, alignment: .leading)
                                    .frame(height: 80)
                                    .padding(.horizontal)
                                    .background(.ultraThinMaterial)
                                }

                                // 音声の波
                                GeometryReader { geometry in
                                    if isPlaying, talkThread == selectedTalkThread {
                                        WaveformView(volumeLevels: volumeLevels, maxColumnCount: volumeLevelColumns)
                                            .frame(width: geometry.size.width - 16, height: 100)
                                            .position(x: geometry.size.width / 2, y: geometry.size.height / 2)
                                            .transition(.opacity)
                                    }
                                }
                                .animation(.easeInOut, value: isPlaying)
                            }
                            .offset(y: activeOffsetY[talkThread.id] ?? 0)
                            // 普通の .gesture だとスクロールと干渉してスクロールできなくなる
                            .simultaneousGesture(
                                DragGesture()
                                    .onChanged { value in
                                        let newOffset = value.translation.height

                                        // 下スワイプのみ許可
                                        if newOffset &gt; 0 {
                                            activeOffsetY[talkThread.id] = newOffset
                                        }

                                        // 上スワイプは許可しないが onUpSwipe を実行
                                        if newOffset &lt; -100 {
                                            onUpSwipe()
                                        }

                                        // 下スワイプ
                                        if newOffset &gt; 100 {
                                            activeOffsetY[talkThread.id] = 0
                                            onDownSwipe()
                                        }
                                    }
                                    .onEnded { _ in
                                        activeOffsetY[talkThread.id] = 0
                                    }
                            )
                            .onTapGesture {
                                onTapTalkThread()
                            }
                            // offsetY = 0 としたときになめらかにアニメーションするように
                            .animation(.default, value: activeOffsetY[talkThread.id])
                        }
                        .frame(width: geometry.size.width - padding * 2)
                        .clipShape(RoundedRectangle(cornerRadius: 8))
                        // これがないと長押しのタップ領域が正しく反映されない
                        // Ref: 【SwiftUI】contentShapeでTap領域を広げる - https://qiita.com/shiz/items/96585bddbc442683b78c
                        .contentShape(RoundedRectangle(cornerRadius: 8))
                        // Ref: [SwiftUI] contextMenu modifier タップしたViewの背景色を消す方法 - https://zenn.dev/your3i/articles/f03210a0270a5b
                        .contextMenu {
                            Button {
                                onTapStampReaction()
                            } label: {
                                Label {
                                    Text("スタンプ返信")
                                } icon: {
                                    SFSymbols.faceSmiling.image
                                }
                            }
                        }
                    }
                }
                .padding(.horizontal, padding)
                .padding(.vertical)
                .scrollTargetLayout()
            }
            .scrollTargetBehavior(.viewAligned) // paging だと上手くいかないので注意
            // iOS 18.0 でバックグラウンドで再生して自動スクロールした時にすこしスクロール位置がずれてしまう（おそらく OS バグ）
            .scrollPosition(id: $selectedTalkThread) // scrollTargetLayout() のコンテンツの id の値とバインディングする
            .scrollIndicators(.hidden)
        }
    }
}

---
