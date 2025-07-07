# SwiftUI Tab onAppear Behavior

日付: 2024-08-03

---

## 👤 ユーザー
*2024/8/3 15:36:17*

SwiftUIでタブの切り替えごとにon appearは走るのか？

---

## 🤖 アシスタント
*2024/8/3 15:36:24*

SwiftUIでタブの切り替えごとに`onAppear`が走るかどうかは、タブのコンテンツのライフサイクルに依存します。デフォルトでは、SwiftUIのタブビュー（`TabView`）はタブ間の切り替え時に`onAppear`をトリガーしない場合があります。これは、タブのコンテンツが一度生成されると、そのまま保持されるためです。

しかし、各タブに表示するビューに`onAppear`を追加することで、タブが表示されるたびに特定のアクションを実行することができます。例えば：

```swift
import SwiftUI

struct ContentView: View {
    var body: some View {
        TabView {
            FirstView()
                .tabItem {
                    Label("First", systemImage: "1.circle")
                }
            SecondView()
                .tabItem {
                    Label("Second", systemImage: "2.circle")
                }
        }
    }
}

struct FirstView: View {
    var body: some View {
        Text("First View")
            .onAppear {
                print("FirstView appeared")
            }
    }
}

struct SecondView: View {
    var body: some View {
        Text("Second View")
            .onAppear {
                print("SecondView appeared")
            }
    }
}
```

この例では、各タブのコンテンツが表示されるたびに`onAppear`が呼ばれます。ただし、これが確実にトリガーされるようにするためには、タブのコンテンツが毎回生成されることを保証する必要があります。例えば、タブのコンテンツを一旦削除して再生成する方法を使うなどの工夫が必要になる場合もあります。

もし、より確実にタブの切り替えごとに`onAppear`を実行したい場合は、カスタムなビューを使ってタブの状態を監視することも検討できます。

---
