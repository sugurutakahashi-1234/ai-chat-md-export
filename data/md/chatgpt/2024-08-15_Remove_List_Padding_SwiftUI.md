# Remove List Padding SwiftUI

日付: 2024-08-15

---

## 👤 ユーザー
*2024/8/15 15:44:06*

list の外側の padding swiftui をなくしたい

---

## 🤖 アシスタント
*2024/8/15 15:44:12*

`SwiftUI` で `List` の外側のパディングをなくすには、`.listStyle()` と `.padding()` 修飾子を組み合わせて調整する方法があります。例えば、`PlainListStyle` を使用して `List` 自体のスタイルをシンプルにし、不要なパディングを取り除くことができます。また、`List` の外側にある不要なパディングを `.padding(EdgeInsets())` で取り除くことも可能です。

以下のコード例は、`List` の外側のパディングを完全になくすための方法を示しています。

```swift
import SwiftUI

struct ContentView: View {
    var body: some View {
        List {
            ForEach(0..<10) { index in
                Text("Item \(index)")
            }
        }
        .listStyle(PlainListStyle()) // シンプルなリストスタイルに設定
        .padding(EdgeInsets()) // パディングを完全に削除
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
```

このコードでは、`PlainListStyle()` を使用し、`padding(EdgeInsets())` を適用することで、リストの外側の余分なパディングを取り除いています。これにより、`List` がビューの端まで広がり、余計なスペースがなくなります。

---

## 👤 ユーザー
*2024/8/15 15:45:51*

Listのグレーの外枠とListの中身との間の上下にグレーのpaddingがあるんだけどそれをけしたいんだ。

---

## 🤖 アシスタント
*2024/8/15 15:46:01*

User wants to remove the gray padding between the content of the List and the gray outer frame in SwiftUI.

---

## 🔧 ツール
*2024/8/15 15:46:01*

Model set context updated.

---

## 🤖 アシスタント
*2024/8/15 15:46:01*

`SwiftUI` の `List` で、リストの中身とグレーの外枠の間の上下にある余計なグレーのパディングを削除するには、リストの `contentInsets` を調整する必要があります。以下の方法で、この余分なスペースを取り除くことができます。

```swift
import SwiftUI

struct ContentView: View {
    var body: some View {
        List {
            ForEach(0..<10) { index in
                Text("Item \(index)")
            }
        }
        .listStyle(PlainListStyle()) // シンプルなリストスタイルに設定
        .padding(EdgeInsets()) // リスト全体のパディングをゼロに設定
        .listRowInsets(EdgeInsets()) // 各行のパディングをゼロに設定
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
```

ここでは、以下の点に注意しています：

- `listStyle(PlainListStyle())`: リストをシンプルなスタイルに変更し、余計な装飾を取り除く。
- `padding(EdgeInsets())`: リスト全体のパディングをゼロに設定して、余計なスペースを削除。
- `listRowInsets(EdgeInsets())`: 各行のパディングをゼロに設定し、行の中身と外枠との間の余計なスペースを取り除く。

これで、リストの中身と外枠との間のグレーの余白をなくし、リストがビューの端まで広がるようにできます。

---
