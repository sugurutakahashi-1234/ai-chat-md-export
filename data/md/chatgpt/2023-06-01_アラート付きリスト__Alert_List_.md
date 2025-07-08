# アラート付きリスト (Alert List)

日付: 2023-06-01

---

## 👤 ユーザー
*2023/06/01 10:04:49*

SwiftUでIList のViewに対してアラートをつけようと思ったけどつけられなかった。そうすればいい？

---

## 🤖 アシスタント
*2023/06/01 10:05:14*

SwiftUIを使ってリストの各ビューにアラートを付けるには、`.alert`修飾子を使用します。それぞれのリストアイテムに対して個別にアラートを設定したい場合は、リストアイテムビュー自体に`.alert`修飾子を付けることができます。

以下にサンプルのコードを示します：

```swift
struct ContentView: View {
    @State private var showAlert = false
    @State private var selectedItem: String? = nil

    var body: some View {
        List {
            ForEach(["Item 1", "Item 2", "Item 3"], id: \.self) { item in
                Text(item)
                    .onTapGesture {
                        self.selectedItem = item
                        self.showAlert = true
                    }
            }
        }
        .alert(isPresented: $showAlert) {
            Alert(
                title: Text("Selected Item"),
                message: Text("\(selectedItem ?? "") was selected."),
                dismissButton: .default(Text("OK")) {
                    self.showAlert = false
                }
            )
        }
    }
}
```

このコードでは、`List`と`ForEach`を使用してリストアイテムを表示します。各アイテムはタップ可能で、アイテムをタップすると`showAlert`ステート変数が更新され、アラートが表示されます。アラートは選択したアイテムの名前を表示します。

ただし、この例ではリスト全体に一つのアラートしかありません。アラートの内容は選択したアイテムによって変わります。各アイテムに対して完全に別々のアラートを設定する場合は、より複雑なロジックが必要になります。

---
