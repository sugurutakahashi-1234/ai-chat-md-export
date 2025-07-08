# Mission List View Improvement.

Date: 2023-06-13

---

## 👤 User
*2023-06-13 16:48:12*

以下のコードの改善案を教えて欲しい

struct MissionListView: View {
    @StateObject private var presenter: MissionListPresenter
    @Binding var didRefreshControl: Void?

    init(missions: [Mission], didRefreshControl: Binding&lt;Void?&gt;) {
        _presenter = .init(wrappedValue: MissionListPresenter(missions: missions))
        _didRefreshControl = didRefreshControl
    }

    var body: some View {
        ScrollView {
            LazyVGrid(columns: Array(repeating: GridItem(), count: 1), spacing: 10) {
                ForEach(presenter.missions, id: \.self) { mission in
                    MissionListItemView(mission: mission)
                        .onTapGesture {
                            presenter.selectedMission = mission
                            presenter.shouldShowMissionDetail = true
                        }
                }
            }
            .padding(.horizontal)
            .padding(.vertical, 10)
        }
        .onChange(of: presenter.shouldShowMissionDetail, perform: { flag in
            if !flag {
                presenter.selectedMission = nil
            }
        })
        .refreshable {
            didRefreshControl = ()
        }
        .fullScreenCover(item: $presenter.selectedMission) { mission in
            MissionDetailView(mission: mission, shouldShowMissionDetail: $presenter.shouldShowMissionDetail)
        }
    }
}

---

## 🤖 Assistant
*2023-06-13 16:48:26*

このコードにはいくつかの改善点があります。以下に、それぞれの改善案を説明します。

1. `MissionListPresenter`を`@StateObject`ではなく、単純なプロパティとして宣言する

現在のコードでは、`MissionListPresenter`を`@StateObject`として宣言していますが、その必要性はなさそうです。`MissionListPresenter`は`init`内で直接作成され、ビューのライフサイクル全体で共有される必要はないため、単純なプロパティとして宣言することができます。

改善案:

```swift
private let presenter: MissionListPresenter
```

2. `didRefreshControl`を`Bool`型に変更する

`didRefreshControl`を`Void?`として宣言していますが、実際にはただの更新フラグであるため、`Bool`型に変更することができます。`Void?`を使用することで更新をトリガーする必要がなくなり、シンプルになります。

改善案:

```swift
@Binding var didRefreshControl: Bool
```

3. `MissionListItemView`の選択状態を`@State`で管理する

現在のコードでは、`presenter`内の`selectedMission`と`shouldShowMissionDetail`を使用して、`MissionListItemView`の選択状態を管理しています。これは冗長で複雑な方法です。代わりに、`MissionListItemView`内で選択状態を`@State`で管理することができます。

改善案:

```swift
struct MissionListItemView: View {
    @State private var isMissionSelected = false

    var body: some View {
        // ...
            .onTapGesture {
                isMissionSelected = true
            }
        // ...
    }
}
```

4. `ScrollView`の修正

現在のコードでは、`ScrollView`内に`LazyVGrid`を配置していますが、`LazyVGrid`自体がスクロールビューの機能を持っているため、`ScrollView`は不要です。また、`LazyVGrid`にはデフォルトの`GridItem`が使用されているため、指定している配列を空にする必要もありません。

改善案:

```swift
LazyVGrid(columns: [GridItem()], spacing: 10) {
    // ...
}
.padding(.horizontal)
.padding(.vertical, 10)
```

改善を組み合わせた最終的なコード:

```swift
struct MissionListView: View {
    private let presenter: MissionListPresenter
    @Binding var didRefreshControl: Bool

    init(missions: [Mission], didRefreshControl: Binding&lt;Bool&gt;) {
        presenter = MissionListPresenter(missions: missions)
        _didRefreshControl = didRefreshControl
    }

    var body: some View {
        LazyVGrid(columns: [GridItem()], spacing: 10

---
