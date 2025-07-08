# Main Actor Protocol Issues

日付: 2024-03-13

---

## 👤 ユーザー
*2024/3/13 13:39:54*

swiftでMain actor-isolated static property 'snapshots' cannot be used to satisfy nonisolated protocol requirement というエラーになってしまう

import PreviewSnapshots

struct HomeTabView_Previews: PreviewProvider, SnapshotTestable {
    static var previews: some View {
        snapshots.previews.previewLayout(.sizeThatFits)
    }

// Main actor-isolated static property 'snapshots' cannot be used to satisfy nonisolated protocol requirement
    static var snapshots: PreviewSnapshots&lt;HomeTab&gt; {
        PreviewSnapshots&lt;HomeTab&gt;(
            configurations: HomeTab.allCases.map { tab in .init(name: "\(tab)".initialUppercased, state: tab) },
            configure: { homeTab in
                HomeTabView(router: AppRootRouter.empty, dependency: AppRootRouterDependencyMock.random, selectedTab: homeTab)
            }
        )
    }
}

---

## 🤖 アシスタント
*2024/3/13 13:40:52*

このエラーは、Swiftの並列処理におけるMain Actorとプロトコルの要件に関する問題から生じています。`@MainActor`でマークされたプロパティやメソッドは、UI更新などメインスレッドでのみ実行されるべき操作を保証します。しかし、非アイソレートされた（`nonisolated`）プロトコル要件を満たす際に`@MainActor`でアイソレートされたプロパティやメソッドを使用すると、コンパイラはエラーを報告します。これは、プロトコルがアイソレートのコンテキストを強制しないため、その要件を満たすプロパティやメソッドもまた非アイソレートである必要があるためです。

この問題を解決するには、いくつかのアプローチがあります。

### `nonisolated`を使用する

もし`SnapshotTestable`プロトコルの`snapshots`プロパティがメインアクターによってアイソレートされる必要がない場合、`snapshots`プロパティを非アイソレート（`nonisolated`）としてマークすることができます。ただし、このアプローチは`snapshots`プロパティがすでに`@MainActor`でマークされている場合には適用できません。

### プロトコルを修正する

プロトコル自体を修正して、要件を`@MainActor`でアイソレートする方法です。これは、プロトコルがメインスレッドでのみ使用されることが保証されている場合に有効です。

```swift
protocol SnapshotTestable {
    @MainActor static var snapshots: PreviewSnapshots<Self> { get }
}
```

この変更により、プロトコルを満たすために`@MainActor`でアイソレートされたプロパティを使用できるようになります。

### `async`/`await`を使用する

もし`snapshots`プロパティが非同期操作を必要とする場合（今回のケースではそうではないかもしれませんが）、`async`/`await`を使用してメインアクター内で非同期的にプロパティにアクセスし、プロトコルの要件を満たすことができます。このアプローチは、主に非同期処理を伴う場合に適しています。

### 実装の見直し

エラーの根本原因に対処するため、実装の構造を見直し、プロトコル要件を満たすために`@MainActor`でアイソレートされたプロパティを直接使用する必要がないようにすることができます。例えば、別の方法でプレビューを生成することや、プロトコルの設計自体を見直すことも考えられます。

最適な解決策は、アプリケーションの要件や既存のコードベースによって異なります。プロトコルとその実装のコンテキストを考慮した上で、適切なアプローチを選択してください。

---
