# Adjust Layout for Scrolling

日付: 2024-07-03

---

## 👤 ユーザー
*2024/7/3 10:01:24*

これだと、上部は横スクロール、下部は縦スクロールにしたいのだけレオも上下で二等分されてしまう。上に詰めてほしい

public struct StampListView&lt;Dependency: RootDIContainerDependency&gt;: View {
    private let dependency: Dependency
    @StateObject private var presenter: StampListPresenter&lt;Dependency&gt;

    public init(dependency: Dependency, talkThread: TalkThread) {
        self.dependency = dependency
        _presenter = .init(wrappedValue: StampListPresenter(dependency: dependency, talkThread: talkThread))
    }

    public var body: some View {
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
                                .padding(8) // Added padding to make the background slightly larger
                                .background(
                                    stampGroup == presenter.selectedStampGroup ? Color.blue.opacity(0.1) : Color.clear
                                )
                                .cornerRadius(12) // Adjust the corner radius to match the padding
                        }
                    }
                }
            }
            .scrollIndicators(.hidden)
            
            ScrollView {
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
            .scrollIndicators(.hidden)

        }
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

---

## 🤖 アシスタント
*2024/7/3 10:01:49*

上部の横スクロールビューを上部に詰めるためには、`VStack` の外側に余分なスペースが入らないように調整する必要があります。これを達成するために、`VStack` に `alignment` パラメータを指定し、上部にパディングを設定します。以下のコードでは、`VStack` の外側にパディングを設定し、上部の横スクロールビューが上部に詰められるように調整しました。

```swift
public struct StampListView<Dependency: RootDIContainerDependency>: View {
    private let dependency: Dependency
    @StateObject private var presenter: StampListPresenter<Dependency>

    public init(dependency: Dependency, talkThread: TalkThread) {
        self.dependency = dependency
        _presenter = .init(wrappedValue: StampListPresenter(dependency: dependency, talkThread: talkThread))
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            ScrollView(.horizontal) {
                LazyHStack {
                    ForEach(presenter.stampGroups, id: \.id) { stampGroup in
                        Button {
                            presenter.onTapStampGroup(stampGroup: stampGroup)
                        } label: {
                            CustomAsyncImageView(imageUrl: stampGroup.imageUrl)
                                .frame(width: 40, height: 40)
                                .cornerRadius(8)
                                .padding(8) // Added padding to make the background slightly larger
                                .background(
                                    stampGroup == presenter.selectedStampGroup ? Color.blue.opacity(0.1) : Color.clear
                                )
                                .cornerRadius(12) // Adjust the corner radius to match the padding
                        }
                    }
                }
            }
            .scrollIndicators(.hidden)
            .padding(.bottom, 10) // Adjust the padding between the horizontal scroll view and the vertical scroll view

            ScrollView {
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
            .scrollIndicators(.hidden)
        }
        .padding(.horizontal, 10)
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
```

この修正により、上部の横スクロールビューが上部に詰められ、下部の縦スクロールビューと間に適切なスペースが確保されるようになります。

---

## 👤 ユーザー
*2024/7/3 10:02:37*

VStack(alignment: .leading, spacing: 0) { でも上につまらなかった

---

## 🤖 アシスタント
*2024/7/3 10:02:57*

上部の横スクロールビューを詰めるために、親ビュー全体に余計なスペースが入らないように調整し、特に上部に追加のスペースがないことを確認します。また、各コンポーネントのパディングや余白も適切に設定します。

以下のように調整してみてください：

```swift
public struct StampListView<Dependency: RootDIContainerDependency>: View {
    private let dependency: Dependency
    @StateObject private var presenter: StampListPresenter<Dependency>

    public init(dependency: Dependency, talkThread: TalkThread) {
        self.dependency = dependency
        _presenter = .init(wrappedValue: StampListPresenter(dependency: dependency, talkThread: talkThread))
    }

    public var body: some View {
        VStack(spacing: 0) {
            ScrollView(.horizontal, showsIndicators: false) {
                LazyHStack {
                    ForEach(presenter.stampGroups, id: \.id) { stampGroup in
                        Button {
                            presenter.onTapStampGroup(stampGroup: stampGroup)
                        } label: {
                            CustomAsyncImageView(imageUrl: stampGroup.imageUrl)
                                .frame(width: 40, height: 40)
                                .cornerRadius(8)
                                .padding(8)
                                .background(
                                    stampGroup == presenter.selectedStampGroup ? Color.blue.opacity(0.1) : Color.clear
                                )
                                .cornerRadius(12)
                        }
                    }
                }
                .padding(.vertical, 10) // Adding padding here to separate it from the top
            }
            
            ScrollView(showsIndicators: false) {
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
        .padding(.horizontal, 10)
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
```

この調整で、上部の横スクロールビューがしっかりと上部に詰められ、余計なスペースがなくなるはずです。また、各コンポーネント間のパディングや余白も適切に調整されています。

---
