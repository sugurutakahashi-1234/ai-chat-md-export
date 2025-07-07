# SnapshotTestableプロトコル更新

日付: 2024-04-07

---

## 👤 ユーザー
*2024/4/7 10:10:13*

以下のようなプログラムがあるとして

struct SFSymbolsListView\_Previews: PreviewProvider, SnapshotTestable {
    static var snapshots: PreviewSnapshots&lt;Void&gt; {
        .init(
            configurations: \[.init(name: "", state: ())\],
            configure: { \_ in
                SFSymbolsListView()
                    .navigationStacked()
            }
        )
    }
}
public protocol SnapshotTestable {
    associatedtype State

    @MainActor
    static var snapshots: PreviewSnapshots&lt;State&gt; { get }
}

public extension SnapshotTestable {
    @MainActor
    static var previews: some View {
        snapshots.previews.previewLayout(.sizeThatFits)
    }
}

問題なのが、今後いかが繰り返しになることが予想されるので、

 .init(
            configurations: \[.init(name: "", state: ())\],
            configure: { \_ in

以下を書くだけで、同等の処理になるようにしたい。どうすればいいか？

struct SFSymbolsListView\_Previews {
    @MainActor
    static var snapshotView: some View {
        SFSymbolsListView()
            .navigationStacked()
    }
}

---

## 🤖 アシスタント
*2024/4/7 10:11:01*

提案された問題を解決するためには、`SnapshotTestable` プロトコルとその拡張機能を少し変更して、新しい `snapshotView` プロパティを利用できるようにする必要があります。これを実現するには、`SnapshotTestable` プロトコルに新しい `snapshotView` という名前の静的なプロパティを追加し、その型を `some View` とします。その後、`snapshots` プロパティのデフォルト実装を提供して、`snapshotView` を利用するようにします。

以下のコードは、この変更をどのように行うかを示しています。まず、`SnapshotTestable` プロトコルに新しいプロパティを追加し、次にそのプロトコルの拡張機能で `snapshots` と `previews` のデフォルト実装を提供します。

```swift
import SwiftUI

// 既存のプロトコルとその拡張に加えて、新しいsnapshotViewプロパティを追加
public protocol SnapshotTestable {
    associatedtype State
    static var snapshotView: some View { get }
    @MainActor
    static var snapshots: PreviewSnapshots<State> { get }
}

// SnapshotTestableプロトコルの拡張機能を更新し、snapshotViewを使用するデフォルト実装を提供
public extension SnapshotTestable {
    @MainActor
    static var snapshots: PreviewSnapshots<State> {
        .init(
            configurations: [.init(name: "", state: ())],
            configure: { _ in
                snapshotView
            }
        )
    }

    @MainActor
    static var previews: some View {
        snapshots.previews.previewLayout(.sizeThatFits)
    }
}

// SFSymbolsListView_Previews構造体を更新し、新しいsnapshotViewプロパティを使うようにする
struct SFSymbolsListView_Previews: PreviewProvider, SnapshotTestable {
    @MainActor
    static var snapshotView: some View {
        SFSymbolsListView()
            .navigationStacked()
    }
}
```

この方法で、`SFSymbolsListView_Previews` 構造体で `snapshotView` プロパティを定義するだけで、同様のプレビュー構成を達成できます。こうすることで、将来的に同様の設定が必要な他のビューに対しても、簡単に再利用可能なコードを提供できるようになります。

---

## 👤 ユーザー
*2024/4/7 10:14:05*

型がうまく解決しなかった。イメージとしては、StateをVoidにしたものは、configurations が意味をなさないケースがあるので、それを簡素に記述したいだけなんだ。別のprotocolを用意するなど違うアプローチでもいいかも。

---

## 🤖 アシスタント
*2024/4/7 10:14:33*

理解しました。`State`を`Void`に特化させる場合、`configurations`が不要になるケースを扱いやすくするために、別のプロトコルを用意するアプローチが適切かもしれません。この新しいプロトコルは、`State`が`Void`であることを前提として、設定を簡素化します。その上で、`SnapshotTestable` プロトコルはそのままにしておき、`Void`専用のプロトコルを新たに追加します。

以下のコードは、そのアプローチを採用した例です。

```swift
import SwiftUI

// 元々のSnapshotTestable プロトコルはそのままにする
public protocol SnapshotTestable {
    associatedtype State
    @MainActor
    static var snapshots: PreviewSnapshots<State> { get }
}

// StateがVoidの場合に特化した新しいプロトコルを定義
public protocol SimpleSnapshotTestable {
    @MainActor
    static var simpleSnapshotView: some View { get }
}

// SimpleSnapshotTestable用の拡張機能を提供し、デフォルト実装を用意する
public extension SimpleSnapshotTestable {
    @MainActor
    static var snapshots: PreviewSnapshots<Void> {
        .init(
            configurations: [.init(name: "", state: ())],
            configure: { _ in
                simpleSnapshotView
            }
        )
    }
    
    @MainActor
    static var previews: some View {
        snapshots.previews.previewLayout(.sizeThatFits)
    }
}

// 使用例: SFSymbolsListView_PreviewsがSimpleSnapshotTestableを採用
struct SFSymbolsListView_Previews: PreviewProvider, SimpleSnapshotTestable {
    @MainActor
    static var simpleSnapshotView: some View {
        SFSymbolsListView()
            .navigationStacked()
    }
}
```

この変更により、`State`が`Void`である場合のシンプルなスナップショットテストの記述が可能になります。`SimpleSnapshotTestable`プロトコルを実装することで、繰り返しの設定を減らし、より直接的な方法でビューのスナップショットを提供できます。

---
