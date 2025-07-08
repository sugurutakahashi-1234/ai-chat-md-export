# Centering Text with GeometryReader

Date: 2024-06-25

---

## 👤 User
*2024-06-25 20:56:36*

GeometryReader で高さの中央配置

---

## 🤖 Assistant
*2024-06-25 20:56:46*

`GeometryReader`を使ってSwiftUIでビューを高さの中央に配置する方法は以下の通りです。`GeometryReader`を使うと、ビューのサイズや位置を動的に取得してレイアウトを調整できます。

以下に例を示します：

```swift
import SwiftUI

struct CenteredView: View {
    var body: some View {
        GeometryReader { geometry in
            VStack {
                Spacer() // 上部のスペース
                Text("中央に配置されたテキスト")
                    .frame(width: geometry.size.width)
                Spacer() // 下部のスペース
            }
            .frame(width: geometry.size.width, height: geometry.size.height)
        }
    }
}

struct ContentView: View {
    var body: some View {
        CenteredView()
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
```

この例では、`GeometryReader`を使って親ビューの高さを取得し、その高さを利用してテキストを中央に配置しています。`Spacer()`を上下に配置することで、テキストを垂直方向に中央に配置しています。

---

## 👤 User
*2024-06-25 20:58:41*

WaveformView を TalkThreadListScrollViewの中心の高さにしたいんだ。今のままだと上の方に表示されてしまう

struct WaveformView: View {
    let volumeLevels: [Double]

    init(volumeLevels: [Double], isRandomized: Bool = false) {
        if isRandomized {
            self.volumeLevels = volumeLevels.shuffled()
        } else {
            self.volumeLevels = volumeLevels
        }
    }

    var body: some View {
        GeometryReader { geometry in
            // バーの間隔がバー幅の 1/2 にするように計算
            let totalWidth = geometry.size.width
            let rectangleWidth = totalWidth / (CGFloat(volumeLevels.count) + CGFloat(volumeLevels.count - 1) / 2)
            let spacing = rectangleWidth / 2

            HStack(spacing: spacing) {
                ForEach(0..&lt;volumeLevels.count, id: \.self) { index in
                    VStack {
                        Spacer()
                        Rectangle()
                            .fill(Color.accentColor)
                            .frame(width: rectangleWidth, height: volumeLevels[index] * 100)
                            .cornerRadius(8)
                        Spacer()
                    }
                }
            }
            .frame(height: 100)
        }
    }
}


public struct TalkThreadListView&lt;Dependency: RootDIContainerDependency&gt;: View {
    private let dependency: Dependency
    @StateObject private var presenter: TalkThreadListPresenter&lt;Dependency&gt;

    public init(dependency: Dependency) {
        self.dependency = dependency
        _presenter = .init(wrappedValue: TalkThreadListPresenter(dependency: dependency))
    }

    public var body: some View {
        VStack {
            if #available(iOS 17.0, *) {
                ZStack {
                    TalkThreadListScrollView(selectedTalkThread: $presenter.selectedTalkThread, talkThreads: presenter.talkThreads, spacing: 16, padding: 32, onTapTalkThread: presenter.onTapTalkThread, onTapStampReaction: presenter.onTapStampReaction)
                    
                    GeometryReader { geometry in
                        VStack {
                            Spacer()
                            if presenter.isPlaying {
                                WaveformView(volumeLevels: presenter.recordingVolumeLevels)
                                    .padding(.horizontal, 40)
                                    .transition(.opacity)
                            }
                            Spacer()
                        }
                        .animation(.easeInOut, value: presenter.isPlaying)
                        .frame(width: geometry.size.width, height: geometry.size.height)
                    }

                }
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
        .navigationBarTitleDisplayMode(.inline)
        .navigationTitle("TODO: Box Name")
        .overlayLoading(isPresented: $presenter.isLoading, isGestureReactable: false)
        .appErrorAlert(isPresented: $presenter.showAlert, appError: presenter.appError)
        .sheet(isPresented: $presenter.showPostView, content: {
            VStack {
                Text("TODO: 今の気持ちを吹き込もう！")

                Button {
                    // TODO: 写真の選択 or 撮影
                } label: {
                    Label {
                        Text("TODO: 写真を追加")
                    } icon: {
                        SFSymbols.cameraFill.image
                    }
                }

                Button {
                    // TODO: 録音
                } label: {
                    Label {
                        Text("TODO: 吹き込む")
                    } icon: {
                        SFSymbols.mic.image
                    }
                }
            }
//            .toolbar {
//                ToolbarItem(placement: .topBarLeading) {
//                    Button {
//                        // TODO: 閉じるボタン & View化
//                    } label: {
//                        SFSymbols.xmark.image
//                    }
//                }
//            }
//            .navigationStacked()
        })
        .sheet(isPresented: $presenter.showStampListView, content: {
            VStack {
                Text("TODO: スタンプ一覧画面")
            }
        })
        .task {
            await presenter.onAppear()
        }
        .onDisappear {
            presenter.onDisappear()
        }
    }
}

@available(iOS 17.0, *)
struct TalkThreadListScrollView: View {
    @Binding var selectedTalkThread: TalkThread?
    let talkThreads: [TalkThread]
    let spacing: CGFloat
    let padding: CGFloat
    let onTapTalkThread: () async -&gt; Void
    let onTapStampReaction: () -&gt; Void

    var body: some View {
        GeometryReader { geometry in
            ScrollView(.horizontal) {
                LazyHStack(spacing: spacing) {
                    ForEach(talkThreads, id: \.self) { talkThread in
                        CustomAsyncImageView(imageUrl: talkThread.imageUrl)
                            .clipShape(RoundedRectangle(cornerRadius: 8))
                            .frame(width: geometry.size.width - padding * 2)

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
                            .onTapGesture {
                                Task {
                                    await onTapTalkThread()
                                }
                            }
                    }
                }
                .padding(.horizontal, padding)
                .padding(.vertical)
                .scrollTargetLayout()
            }
            .scrollTargetBehavior(.viewAligned) // paging だと上手くいかないので注意
            .scrollPosition(id: $selectedTalkThread) // scrollTargetLayout() のコンテンツの id の値とバインディングする
            .scrollIndicators(.hidden)
        }
    }
}

// MARK: - Preview

import PreviewSnapshots

struct TalkThreadListView_Previews: PreviewProvider, SnapshotTestable {
    static var snapshots: PreviewSnapshots&lt;RootDIContainerDependencyMock&gt; {
        .init(
            configurations: [
                UITestPreviewType.placeholder.configuration,
            ],
            configure: { dependency in
                TalkThreadListView(dependency: dependency)
                    .navigationStacked()
            }
        )
    }
}

---

## 🤖 Assistant
*2024-06-25 20:59:45*

`WaveformView` を `TalkThreadListScrollView` の中心の高さに配置するには、`GeometryReader` の使い方を調整し、`WaveformView` を中央に配置するためのレイアウトを設定する必要があります。以下のように `Spacer()` を使って高さの中央に配置する方法を紹介します。

修正したコードは以下の通りです：

```swift
struct WaveformView: View {
    let volumeLevels: [Double]

    init(volumeLevels: [Double], isRandomized: Bool = false) {
        if isRandomized {
            self.volumeLevels = volumeLevels.shuffled()
        } else {
            self.volumeLevels = volumeLevels
        }
    }

    var body: some View {
        GeometryReader { geometry in
            // バーの間隔がバー幅の 1/2 にするように計算
            let totalWidth = geometry.size.width
            let rectangleWidth = totalWidth / (CGFloat(volumeLevels.count) + CGFloat(volumeLevels.count - 1) / 2)
            let spacing = rectangleWidth / 2

            HStack(spacing: spacing) {
                ForEach(0..<volumeLevels.count, id: \.self) { index in
                    VStack {
                        Spacer()
                        Rectangle()
                            .fill(Color.accentColor)
                            .frame(width: rectangleWidth, height: volumeLevels[index] * 100)
                            .cornerRadius(8)
                        Spacer()
                    }
                }
            }
            .frame(height: 100)
        }
    }
}

public struct TalkThreadListView<Dependency: RootDIContainerDependency>: View {
    private let dependency: Dependency
    @StateObject private var presenter: TalkThreadListPresenter<Dependency>

    public init(dependency: Dependency) {
        self.dependency = dependency
        _presenter = .init(wrappedValue: TalkThreadListPresenter(dependency: dependency))
    }

    public var body: some View {
        VStack {
            if #available(iOS 17.0, *) {
                ZStack {
                    TalkThreadListScrollView(
                        selectedTalkThread: $presenter.selectedTalkThread,
                        talkThreads: presenter.talkThreads,
                        spacing: 16,
                        padding: 32,
                        onTapTalkThread: presenter.onTapTalkThread,
                        onTapStampReaction: presenter.onTapStampReaction
                    )
                    
                    if presenter.isPlaying {
                        GeometryReader { geometry in
                            WaveformView(volumeLevels: presenter.recordingVolumeLevels)
                                .frame(width: geometry.size.width, height: 100)
                                .padding(.horizontal, 40)
                                .position(x: geometry.size.width / 2, y: geometry.size.height / 2)
                                .transition(.opacity)
                                .animation(.easeInOut, value: presenter.isPlaying)
                        }
                    }
                }
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
        .navigationBarTitleDisplayMode(.inline)
        .navigationTitle("TODO: Box Name")
        .overlayLoading(isPresented: $presenter.isLoading, isGestureReactable: false)
        .appErrorAlert(isPresented: $presenter.showAlert, appError: presenter.appError)
        .sheet(isPresented: $presenter.showPostView, content: {
            VStack {
                Text("TODO: 今の気持ちを吹き込もう！")

                Button {
                    // TODO: 写真の選択 or 撮影
                } label: {
                    Label {
                        Text("TODO: 写真を追加")
                    } icon: {
                        SFSymbols.cameraFill.image
                    }
                }

                Button {
                    // TODO: 録音
                } label: {
                    Label {
                        Text("TODO: 吹き込む")
                    } icon: {
                        SFSymbols.mic.image
                    }
                }
            }
//            .toolbar {
//                ToolbarItem(placement: .topBarLeading) {
//                    Button {
//                        // TODO: 閉じるボタン & View化
//                    } label: {
//                        SFSymbols.xmark.image
//                    }
//                }
//            }
//            .navigationStacked()
        })
        .sheet(isPresented: $presenter.showStampListView, content: {
            VStack {
                Text("TODO: スタンプ一覧画面")
            }
        })
        .task {
            await presenter.onAppear()
        }
        .onDisappear {
            presenter.onDisappear()
        }
    }
}

@available(iOS 17.0, *)
struct TalkThreadListScrollView: View {
    @Binding var selectedTalkThread: TalkThread?
    let talkThreads: [TalkThread]
    let spacing: CGFloat
    let padding: CGFloat
    let onTapTalkThread: () async -> Void
    let onTapStampReaction: () -> Void

    var body: some View {
        GeometryReader { geometry in
            ScrollView(.horizontal) {
                LazyHStack(spacing: spacing) {
                    ForEach(talkThreads, id: \.self) { talkThread in
                        CustomAsyncImageView(imageUrl: talkThread.imageUrl)
                            .clipShape(RoundedRectangle(cornerRadius: 8))
                            .frame(width: geometry.size.width - padding * 2)

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
                            .onTapGesture {
                                Task {
                                    await onTapTalkThread()
                                }
                            }
                    }
                }
                .padding(.horizontal, padding)
                .padding(.vertical)
                .scrollTargetLayout()
            }
            .scrollTargetBehavior(.viewAligned) // paging だと上手くいかないので注意
            .scrollPosition(id: $selectedTalkThread) // scrollTargetLayout() のコンテンツの id の値とバインディングする
            .scrollIndicators(.hidden)
        }
    }
}

// MARK: - Preview

import PreviewSnapshots

struct TalkThreadListView_Previews: PreviewProvider, SnapshotTestable {
    static var snapshots: PreviewSnapshots<RootDIContainerDependencyMock> {
        .init(
            configurations: [
                UITestPreviewType.placeholder.configuration,
            ],
            configure: { dependency in
                TalkThreadListView(dependency: dependency)
                    .navigationStacked()
            }
        )
    }
}
```

この変更により、`WaveformView` は `TalkThreadListScrollView` の中央の高さに表示されるようになります。`GeometryReader` 内で `WaveformView` の位置を設定し、`position` 修飾子を使って中央に配置しています。

---

## 👤 User
*2024-06-25 21:02:43*

TalkThreadListViewの中央に配置できたが、Wavefomaの左右の余白がなくなった

---

## 🤖 Assistant
*2024-06-25 21:03:42*

`WaveformView` の左右の余白を保持しつつ、中央に配置するためには、`GeometryReader` を使ったレイアウトの中で余白を設定する必要があります。以下の修正では、`WaveformView` に対して左右の余白を設定しています。

```swift
struct WaveformView: View {
    let volumeLevels: [Double]

    init(volumeLevels: [Double], isRandomized: Bool = false) {
        if isRandomized {
            self.volumeLevels = volumeLevels.shuffled()
        } else {
            self.volumeLevels = volumeLevels
        }
    }

    var body: some View {
        GeometryReader { geometry in
            // バーの間隔がバー幅の 1/2 にするように計算
            let totalWidth = geometry.size.width
            let rectangleWidth = totalWidth / (CGFloat(volumeLevels.count) + CGFloat(volumeLevels.count - 1) / 2)
            let spacing = rectangleWidth / 2

            HStack(spacing: spacing) {
                ForEach(0..<volumeLevels.count, id: \.self) { index in
                    VStack {
                        Spacer()
                        Rectangle()
                            .fill(Color.accentColor)
                            .frame(width: rectangleWidth, height: volumeLevels[index] * 100)
                            .cornerRadius(8)
                        Spacer()
                    }
                }
            }
            .frame(height: 100)
        }
    }
}

public struct TalkThreadListView<Dependency: RootDIContainerDependency>: View {
    private let dependency: Dependency
    @StateObject private var presenter: TalkThreadListPresenter<Dependency>

    public init(dependency: Dependency) {
        self.dependency = dependency
        _presenter = .init(wrappedValue: TalkThreadListPresenter(dependency: dependency))
    }

    public var body: some View {
        VStack {
            if #available(iOS 17.0, *) {
                ZStack {
                    TalkThreadListScrollView(
                        selectedTalkThread: $presenter.selectedTalkThread,
                        talkThreads: presenter.talkThreads,
                        spacing: 16,
                        padding: 32,
                        onTapTalkThread: presenter.onTapTalkThread,
                        onTapStampReaction: presenter.onTapStampReaction
                    )

                    if presenter.isPlaying {
                        GeometryReader { geometry in
                            WaveformView(volumeLevels: presenter.recordingVolumeLevels)
                                .frame(width: geometry.size.width - 80, height: 100) // 左右40ポイントずつの余白
                                .padding(.horizontal, 40) // 左右の余白を設定
                                .position(x: geometry.size.width / 2, y: geometry.size.height / 2)
                                .transition(.opacity)
                                .animation(.easeInOut, value: presenter.isPlaying)
                        }
                    }
                }
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
        .navigationBarTitleDisplayMode(.inline)
        .navigationTitle("TODO: Box Name")
        .overlayLoading(isPresented: $presenter.isLoading, isGestureReactable: false)
        .appErrorAlert(isPresented: $presenter.showAlert, appError: presenter.appError)
        .sheet(isPresented: $presenter.showPostView, content: {
            VStack {
                Text("TODO: 今の気持ちを吹き込もう！")

                Button {
                    // TODO: 写真の選択 or 撮影
                } label: {
                    Label {
                        Text("TODO: 写真を追加")
                    } icon: {
                        SFSymbols.cameraFill.image
                    }
                }

                Button {
                    // TODO: 録音
                } label: {
                    Label {
                        Text("TODO: 吹き込む")
                    } icon: {
                        SFSymbols.mic.image
                    }
                }
            }
//            .toolbar {
//                ToolbarItem(placement: .topBarLeading) {
//                    Button {
//                        // TODO: 閉じるボタン & View化
//                    } label: {
//                        SFSymbols.xmark.image
//                    }
//                }
//            }
//            .navigationStacked()
        })
        .sheet(isPresented: $presenter.showStampListView, content: {
            VStack {
                Text("TODO: スタンプ一覧画面")
            }
        })
        .task {
            await presenter.onAppear()
        }
        .onDisappear {
            presenter.onDisappear()
        }
    }
}

@available(iOS 17.0, *)
struct TalkThreadListScrollView: View {
    @Binding var selectedTalkThread: TalkThread?
    let talkThreads: [TalkThread]
    let spacing: CGFloat
    let padding: CGFloat
    let onTapTalkThread: () async -> Void
    let onTapStampReaction: () -> Void

    var body: some View {
        GeometryReader { geometry in
            ScrollView(.horizontal) {
                LazyHStack(spacing: spacing) {
                    ForEach(talkThreads, id: \.self) { talkThread in
                        CustomAsyncImageView(imageUrl: talkThread.imageUrl)
                            .clipShape(RoundedRectangle(cornerRadius: 8))
                            .frame(width: geometry.size.width - padding * 2)

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
                            .onTapGesture {
                                Task {
                                    await onTapTalkThread()
                                }
                            }
                    }
                }
                .padding(.horizontal, padding)
                .padding(.vertical)
                .scrollTargetLayout()
            }
            .scrollTargetBehavior(.viewAligned) // paging だと上手くいかないので注意
            .scrollPosition(id: $selectedTalkThread) // scrollTargetLayout() のコンテンツの id の値とバインディングする
            .scrollIndicators(.hidden)
        }
    }
}

// MARK: - Preview

import PreviewSnapshots

struct TalkThreadListView_Previews: PreviewProvider, SnapshotTestable {
    static var snapshots: PreviewSnapshots<RootDIContainerDependencyMock> {
        .init(
            configurations: [
                UITestPreviewType.placeholder.configuration,
            ],
            configure: { dependency in
                TalkThreadListView(dependency: dependency)
                    .navigationStacked()
            }
        )
    }
}
```

この修正により、`WaveformView` の左右に40ポイントの余白を設定し、中央に配置するようになりました。`frame` 修飾子でビューの幅を `geometry.size.width - 80` とすることで、左右に余白を確保しています。

---
