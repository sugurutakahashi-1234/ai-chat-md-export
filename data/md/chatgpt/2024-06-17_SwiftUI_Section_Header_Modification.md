# SwiftUI Section Header Modification

日付: 2024-06-17

---

## 👤 ユーザー
*2024/6/17 10:28:54*

SwiftUI で以下のようなモディファイア

List {
            Section(string) {
            }
            .textCase(.none)
        }

---

## 🤖 アシスタント
*2024/6/17 10:29:00*

このコードは、SwiftUIのList内にSectionを作成し、そのヘッダーのテキストの大文字・小文字の変換を行わないように設定するためのものです。モディファイアの `.textCase(.none)` を使用して、セクションヘッダーのテキストのケースを変更しないようにしています。

以下に具体的な例を示します。

```swift
import SwiftUI

struct ContentView: View {
    var body: some View {
        List {
            Section(header: Text("Sample Header").textCase(.none)) {
                Text("Item 1")
                Text("Item 2")
                Text("Item 3")
            }
        }
        .listStyle(InsetGroupedListStyle())
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
```

この例では、`List` の中に `Section` を作成し、そのヘッダーに対して `.textCase(.none)` モディファイアを適用しています。これにより、ヘッダーのテキストが大文字に変換されないようになります。また、リストのスタイルとして `InsetGroupedListStyle` を使用していますが、必要に応じて他のスタイルに変更することもできます。

---
