# Selectable Text SwiftUI

日付: 2024-05-30

---

## 👤 ユーザー
*2024/05/30 10:39:18*

SwiftUIで選択コピーが可能なTextを表示するView

---

## 🤖 アシスタント
*2024/05/30 10:39:34*

SwiftUIで選択可能なテキストを表示するには、`UITextView`を使用する必要があります。`UITextView`はUIKitのコンポーネントですが、SwiftUIの`UIViewRepresentable`プロトコルを使用することでSwiftUIビューに統合できます。以下はその実装例です。

### 選択可能なテキストビューの実装

まず、`SelectableTextView`というSwiftUIビューを作成し、`UIViewRepresentable`プロトコルを実装します。

```swift
import SwiftUI
import UIKit

struct SelectableTextView: UIViewRepresentable {
    var text: String

    func makeUIView(context: Context) -> UITextView {
        let textView = UITextView()
        textView.isEditable = false
        textView.isSelectable = true
        textView.text = text
        textView.font = UIFont.systemFont(ofSize: 17)
        textView.backgroundColor = UIColor.clear
        return textView
    }

    func updateUIView(_ uiView: UITextView, context: Context) {
        uiView.text = text
    }
}
```

### 使用方法

`SelectableTextView`をSwiftUIビューの中で使用します。

```swift
struct ContentView: View {
    var body: some View {
        VStack {
            Text("通常のテキスト")
                .padding()

            SelectableTextView(text: "選択可能なテキスト")
                .padding()
                .background(Color.gray.opacity(0.1))
                .cornerRadius(8)
        }
        .padding()
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
```

このコードは、通常のテキストと選択可能なテキストを表示するビューを作成します。`SelectableTextView`は、`UITextView`をラップしており、ユーザーがテキストを選択してコピーできるようにします。

### 注意点

- `UITextView`はUIKitのコンポーネントであるため、SwiftUIのスタイルやモディファイアを完全にサポートしていません。見た目のカスタマイズは、主に`UITextView`のプロパティで行います。
- 背景色や角の丸みなどのカスタマイズは、SwiftUI側で行えますが、フォントやテキストの色などのプロパティは`UITextView`内で設定する必要があります。

これにより、SwiftUI内で選択可能なテキストビューを簡単に作成できます。

---

## 👤 ユーザー
*2024/05/30 11:16:29*

このPreviewで表示されない

struct SelectableTextView: UIViewRepresentable {
    var text: String

    func makeUIView(context: Context) -&gt; UITextView {
        let textView = UITextView()
        textView.isEditable = false
        textView.isSelectable = true
        textView.text = text
        textView.font = UIFont.systemFont(ofSize: 17)
        textView.backgroundColor = UIColor.clear
        return textView
    }

    func updateUIView(_ uiView: UITextView, context: Context) {
        uiView.text = text
    }
}

#Preview {
    ScrollView {
        VStack {
            SelectableTextView(text: "hoge\naaa")
        }
    }
}

---

## 🤖 アシスタント
*2024/05/30 11:16:43*

`#Preview`では、特に特定の環境での動作を確認するために利用する場合がありますが、標準的なプレビューでは以下のように書き換えることでうまく表示されるかもしれません。また、デバッグのためにいくつかの変更を試してみることも有効です。

以下のコードでは、プレビュー内に`ScrollView`と`VStack`を使い、`SelectableTextView`を表示します。

```swift
import SwiftUI
import UIKit

struct SelectableTextView: UIViewRepresentable {
    var text: String

    func makeUIView(context: Context) -> UITextView {
        let textView = UITextView()
        textView.isEditable = false
        textView.isSelectable = true
        textView.text = text
        textView.font = UIFont.systemFont(ofSize: 17)
        textView.backgroundColor = UIColor.clear
        return textView
    }

    func updateUIView(_ uiView: UITextView, context: Context) {
        uiView.text = text
    }
}

struct ContentView: View {
    var body: some View {
        ScrollView {
            VStack {
                SelectableTextView(text: "hoge\naaa")
                    .frame(height: 100) // 高さを設定することで表示を確認しやすくする
                    .padding()
                    .background(Color.gray.opacity(0.1))
                    .cornerRadius(8)
            }
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
```

### 変更点とポイント
1. **`SelectableTextView`の高さを設定**: `frame(height: 100)`を追加して高さを設定することで、プレビューで表示されるようにします。
2. **背景色とパディング**: `SelectableTextView`の周りに背景色とパディングを追加して視認性を向上させます。
3. **`ContentView`内で使用**: プレビュー内で直接`SelectableTextView`を使用するのではなく、`ContentView`を定義し、その中で`SelectableTextView`を使用するようにします。

この変更を行うことで、プレビューで`SelectableTextView`が正しく表示されるはずです。プレビューがうまく表示されない場合は、Xcodeのキャッシュをクリアしたり、再起動したりすることも試してみてください。

---

## 👤 ユーザー
*2024/05/30 11:18:01*

frame wo

---

## 🤖 アシスタント
*2024/05/30 11:18:03*

`frame(height:)`を使用せずに、`SelectableTextView`が表示されるように調整する方法を試してみましょう。`UITextView`のコンテンツサイズに基づいて自動的にサイズが調整されるようにするために、ラッパービューの制約を設定する方法もあります。

以下は

---
