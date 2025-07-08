# MissionListView improvements.

Date: 2023-06-13

---

## 👤 User
*2023-06-13 16:48:52*

以下のコードの改善点を教えて欲しい

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
*2023-06-13 16:50:15*

コードに大きな問題が見られないという前提で、いくつか考えられる改善点を提案します。ただし、これらの提案は主に可読性や拡張性に関わります。

1. **Dependency Injection:**  `MissionListPresenter` が `MissionListView` の内部でインスタンス化されています。そのため、依存関係が密結合になっています。もしテストを行いたい場合、依存関係を注入することでモックを作成することが容易になります。また、同様の理由で、`MissionListPresenter`を外部から注入することで、このViewを再利用するときにも柔軟性が増します。したがって、`MissionListPresenter`を `init` メソッドのパラメータとして受け取ることをお勧めします。

2. **Redundant State:** `presenter.shouldShowMissionDetail` はフラグとして機能していますが、`presenter.selectedMission` の存在（nilか否か）で代用できます。 `selectedMission` が `nil` でないとき、つまりミッションが選択されているときに詳細を表示するようにすることができます。この変更により、コードの状態を管理するための変数の数が減り、コードが簡素化します。

3. **Usage of Refresh Control:** `didRefreshControl` という `@Binding` プロパティがありますが、それがどのように使われるべきかは明らかではありません。このプロパティの役割と目的をより明確にするため、それを使用して何を行うのかについてのコメントを追加するか、その名前をもう少し説明的なものに変更することを検討してみてください。

修正後のコードは以下のようになります。

```swift
struct MissionListView: View {
    @StateObject private var presenter: MissionListPresenter
    @Binding var didRefreshControl: Void?

    init(presenter: MissionListPresenter, didRefreshControl: Binding&lt;Void?&gt;) {
        _presenter = .init(wrappedValue: presenter)
        _didRefreshControl = didRefreshControl
    }

    var body: some View {
        ScrollView {
            LazyVGrid(columns: Array(repeating: GridItem(), count: 1), spacing: 10) {
                ForEach(presenter.missions, id: \.self) { mission in
                    MissionListItemView(mission: mission)
                        .onTapGesture {
                            presenter.selectedMission = mission
                        }
                }
            }
            .padding(.horizontal)
            .padding(.vertical, 10)
        }
        .refreshable {
            didRefreshControl = ()
        }
        .fullScreenCover(item: $presenter.selectedMission) { mission in
            MissionDetailView(mission: mission, shouldShowMissionDetail: Binding(

---

## 👤 User
*2023-06-13 16:50:26*

つづき

---

## 🤖 Assistant
*2023-06-13 16:50:57*

ごめんなさい、前のメッセージが途中で切れてしまいました。以下に続きを記述します：

```swift
            get: { presenter.selectedMission != nil },
            set: { newValue in
                if !newValue {
                    presenter.selectedMission = nil
                }
            }
        ))
    }
}
```

以上のコードでは、`MissionListPresenter`は初期化時に注入され、`shouldShowMissionDetail`の代わりに`selectedMission`の存在性を利用しています。これにより、状態管理がよりシンプルになります。また、テストが行いやすくなり、このViewを再利用するときにも柔軟性が増します。

ただし、これらの変更は必ずしも"必要"というわけではありません。それは具体的なコードの文脈、アプリケーションの要件、そして既存のアーキテクチャやパターンによるところが大きいです。本当に必要な改善点を見つけるためには、より具体的な背景情報が必要になることもあります。

---

## 👤 User
*2023-06-13 16:51:18*

didRefreshControl = () はなにをしているの？

---

## 🤖 Assistant
*2023-06-13 16:52:05*

`didRefreshControl = ()` は、おそらく外部からバインドされた `didRefreshControl` プロパティを更新することで、何らかのリフレッシュ動作をトリガするために使用されていると思われます。

`didRefreshControl` は Void 型のオプショナル `Binding` で定義されています。これは、おそらくViewがリフレッシュ動作を実行したことを通知するために使われているのでしょう。この通知は、`didRefreshControl` を観察している他の部分（例えば親ViewやViewModelなど）でリフレッシュ後の動作（例えばデータの再取得）を引き起こすことができます。

SwiftUI の `refreshable(action:)` メソッドは、pull-to-refresh メカニズムを提供します。`didRefreshControl = ()` は、このリフレッシュ操作が行われたときに呼び出され、それにより `didRefreshControl` の値が更新されます。この値が更新されると、それにバインドされている他の部分で変更が観察され、それに対する何らかの反応が行われるでしょう。

ただし、このコードの一部が省略されているため、具体的な動作や意図については推測に過ぎません。それに対する正確な回答を提供するためには、より多くのコードや情報が必要です。

---
