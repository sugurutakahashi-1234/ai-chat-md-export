# Sticky Header Implementation

日付: 2024-07-26

---

## 👤 ユーザー
*2024/7/26 17:43:45*

以下について、月の塊で表示しているがスクロールしていくと、その月の表示が見えなくなってしまう。
うまく月の表示をstickyとして残しておきたいのだけれどもどう実装すればいいか？　ちなみに　iOS16以降である                           HStack {
                            Text(monthlyThread.month.toString(.yyyyMM))
                                .font(.title)
                            Spacer()
                        }
                        .padding(.horizontal, 8)

public struct MyHistoryView&lt;Dependency: RootDIContainerDependency&gt;: View {
    private let dependency: Dependency
    @StateObject private var presenter: MyHistoryPresenter&lt;Dependency&gt;

    public init(dependency: Dependency, talkBox: TalkBox) {
        self.dependency = dependency
        \_presenter = .init(wrappedValue: MyHistoryPresenter(dependency: dependency, talkBox: talkBox))
    }

    public var body: some View {
        ScrollView(.vertical) {
            LazyVStack(spacing: 16) {
                ForEach(presenter.monthlyThreads, id: \\.self) { monthlyThread in
                    VStack(spacing: 8) {
                        HStack {
                            Text(monthlyThread.month.toString(.yyyyMM))
                                .font(.title)
                            Spacer()
                        }
                        .padding(.horizontal, 8)

                        // Ref: 【SwiftUI】LazyVGrid内の画像を正方形にする【ワークアラウンド】 https://qiita.com/tsuzuki817/items/cc9364089cee3a763084
                        LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 2), count: 3), spacing: 2) {
                            ForEach(monthlyThread.threads, id: \\.self) { talkThread in
                                Button {
                                    presenter.onTapTalkThread(talkThread: talkThread)
                                } label: {
                                    CustomAsyncImageView(imageUrl: talkThread.imageUrl)
                                        .aspectRatio(Constants.AspectRatio.\_1\_1, contentMode: .fill)
                                        .clipShape(.rect(cornerRadius: 8))
                                }
                            }
                        }
                    }
                }
            }
            .padding(.vertical)
        }
        .navigationTitle(presenter.talkBox.name)
        .navigationDestination(isPresented: $presenter.showThreadDetail) {
            if let \_ = presenter.selectedThread {
                TalkThreadListView(dependency: dependency, talkBox: presenter.talkBox)
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

---

## 🤖 アシスタント
*2024/7/26 17:44:07*

月の表示をスクロールしても固定するためには、`StickyHeader`のような実装を行う必要があります。以下はその方法です。`SwiftUI`では、`Section`を利用して、`header`に`sticky`なヘッダーを設定することができます。`List`と`ScrollView`の両方で使えますが、ここでは`ScrollView`と`LazyVStack`を使用した方法を紹介します。

```swift
import SwiftUI

public struct MyHistoryView<Dependency: RootDIContainerDependency>: View {
    private let dependency: Dependency
    @StateObject private var presenter: MyHistoryPresenter<Dependency>

    public init(dependency: Dependency, talkBox: TalkBox) {
        self.dependency = dependency
        _presenter = .init(wrappedValue: MyHistoryPresenter(dependency: dependency, talkBox: talkBox))
    }

    public var body: some View {
        ScrollView(.vertical) {
            LazyVStack(spacing: 16) {
                ForEach(presenter.monthlyThreads, id: \.self) { monthlyThread in
                    Section(header: StickyHeader(month: monthlyThread.month)) {
                        LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 2), count: 3), spacing: 2) {
                            ForEach(monthlyThread.threads, id: \.self) { talkThread in
                                Button {
                                    presenter.onTapTalkThread(talkThread: talkThread)
                                } label: {
                                    CustomAsyncImageView(imageUrl: talkThread.imageUrl)
                                        .aspectRatio(Constants.AspectRatio._1_1, contentMode: .fill)
                                        .clipShape(.rect(cornerRadius: 8))
                                }
                            }
                        }
                    }
                }
            }
            .padding(.vertical)
        }
        .navigationTitle(presenter.talkBox.name)
        .navigationDestination(isPresented: $presenter.showThreadDetail) {
            if let _ = presenter.selectedThread {
                TalkThreadListView(dependency: dependency, talkBox: presenter.talkBox)
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

struct StickyHeader: View {
    let month: Date

    var body: some View {
        HStack {
            Text(month.toString(.yyyyMM))
                .font(.title)
            Spacer()
        }
        .padding(.horizontal, 8)
        .background(Color(.systemBackground)) // 背景色を指定
    }
}
```

この例では、`StickyHeader`というカスタムビューを作成し、`Section`の`header`として使用しています。`Section`を使うことで、ヘッダーがスクロールしても固定されるようになります。

### ポイント
- `Section`は`SwiftUI`で`List`や`LazyVStack`に対して使うことができ、ヘッダーを固定するのに役立ちます。
- `StickyHeader`ビューを作成し、月のテキストを表示しています。
- 背景色を指定することで、スクロール時に背景が透けないようにしています。

この実装により、月の表示がスクロールしても固定されるようになります。

---

## 👤 ユーザー
*2024/7/26 17:47:17*

Header  として表示されたが残らなかった

---

## 🤖 アシスタント
*2024/7/26 17:47:34*

`LazyVStack`では`Section`のヘッダーがスクロール時に固定されないため、`List`を使用してみてください。以下に`List`を使用して月のヘッダーを固定する方法を示します。

```swift
import SwiftUI

public struct MyHistoryView<Dependency: RootDIContainerDependency>: View {
    private let dependency: Dependency
    @StateObject private var presenter: MyHistoryPresenter<Dependency>

    public init(dependency: Dependency, talkBox: TalkBox) {
        self.dependency = dependency
        _presenter = .init(wrappedValue: MyHistoryPresenter(dependency: dependency, talkBox: talkBox))
    }

    public var body: some View {
        List {
            ForEach(presenter.monthlyThreads, id: \.self) { monthlyThread in
                Section(header: StickyHeader(month: monthlyThread.month)) {
                    LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 2), count: 3), spacing: 2) {
                        ForEach(monthlyThread.threads, id: \.self) { talkThread in
                            Button {
                                presenter.onTapTalkThread(talkThread: talkThread)
                            } label: {
                                CustomAsyncImageView(imageUrl: talkThread.imageUrl)
                                    .aspectRatio(Constants.AspectRatio._1_1, contentMode: .fill)
                                    .clipShape(.rect(cornerRadius: 8))
                            }
                        }
                    }
                }
            }
        }
        .navigationTitle(presenter.talkBox.name)
        .navigationDestination(isPresented: $presenter.showThreadDetail) {
            if let _ = presenter.selectedThread {
                TalkThreadListView(dependency: dependency, talkBox: presenter.talkBox)
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

struct StickyHeader: View {
    let month: Date

    var body: some View {
        HStack {
            Text(month.toString(.yyyyMM))
                .font(.title)
            Spacer()
        }
        .padding(.horizontal, 8)
        .background(Color(.systemBackground)) // 背景色を指定
    }
}
```

### ポイント
- `List`を使うことで、`Section`のヘッダーがスクロール時に固定されるようになります。
- `Section`の`header`としてカスタムビュー`StickyHeader`を使用しています。
- 背景色を指定することで、スクロール時に背景が透けないようにしています。

これにより、月の表示がスクロールしても固定されるようになります。

---
