# StickyHeader スタイル

日付: 2024-05-28

---

## 👤 ユーザー
*2024/05/28 17:26:20*

SwiftUIでスクロール時にlistのsectionのheaderが残るような設定はどのようなスタイルを指定すればいいか？

---

## 🤖 アシスタント
*2024/05/28 17:26:34*

SwiftUIでリストのセクションヘッダーをスクロール時に固定するには、`Section`ビューの`header`に対して`StickyHeader`スタイルを使用します。具体的には、`List`と`Section`を次のように設定します。

```swift
import SwiftUI

struct ContentView: View {
    var body: some View {
        List {
            Section(header: Text("Section 1").font(.headline).stickyHeader()) {
                ForEach(0..<10) { item in
                    Text("Item \(item)")
                }
            }
            Section(header: Text("Section 2").font(.headline).stickyHeader()) {
                ForEach(10..<20) { item in
                    Text("Item \(item)")
                }
            }
        }
    }
}

extension View {
    func stickyHeader() -> some View {
        self
            .background(Color(.systemBackground))
            .listRowInsets(EdgeInsets())
            .padding([.top, .bottom], 5)
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
```

このコードでは、`stickyHeader`というカスタム修飾子を定義して、セクションヘッダーに適用しています。この修飾子は、背景色を設定し、適切なパディングとインセットを調整することで、セクションヘッダーがスクロール時に固定されるようにしています。これにより、ユーザーがスクロールしてもセクションヘッダーが見えたままになる効果を得られます。

---
