# SwiftUI Text Editing Navigation

日付: 2024-07-25

---

## 👤 ユーザー
*2024/7/25 17:28:31*

SwiftUI Text 編集 ナビゲーション ×ボタン

---

## 🤖 アシスタント
*2024/7/25 17:28:52*

SwiftUIでTextを編集するためのビューと、ナビゲーションバーに×ボタンを追加する例を以下に示します。×ボタンを押すと、前の画面に戻るようにします。

```swift
import SwiftUI

struct TextEditorView: View {
    @State private var text: String = "ここにテキストを入力"

    var body: some View {
        NavigationView {
            VStack {
                TextEditor(text: $text)
                    .padding()
                    .border(Color.gray, width: 1)
                Spacer()
            }
            .navigationTitle("Text Editor")
            .navigationBarItems(trailing: Button(action: {
                // ナビゲーションを閉じるアクション
                dismiss()
            }) {
                Image(systemName: "xmark")
                    .foregroundColor(.red)
            })
        }
    }
    
    // ナビゲーションを閉じるためのメソッド
    private func dismiss() {
        // ここにナビゲーションを閉じるコードを記述
        // 例えば、プレゼンテーションモードを使用する
        presentationMode.wrappedValue.dismiss()
    }
    
    @Environment(\.presentationMode) var presentationMode: Binding<PresentationMode>
}

struct TextEditorView_Previews: PreviewProvider {
    static var previews: some View {
        TextEditorView()
    }
}
```

### ポイント
- `NavigationView` を使用してナビゲーションバーを提供します。
- `TextEditor` を使ってテキスト編集を行います。
- `navigationBarItems` を使って、ナビゲーションバーに×ボタンを追加します。
- ×ボタンのアクションでは、`presentationMode` を使って現在のビューを閉じます。

これにより、ユーザーはテキストを編集でき、×ボタンを押して編集ビューを閉じることができます。

---

## 👤 ユーザー
*2024/7/25 17:29:38*

Listで文字列を表示していて、それをタップするとpushで編集画面に遷移させたい

---

## 🤖 アシスタント
*2024/7/25 17:30:00*

リストで文字列を表示し、それをタップすると編集画面にプッシュ遷移させる方法を以下に示します。SwiftUIの`NavigationLink`を使用して、リストのアイテムをタップすると編集画面に遷移するようにします。

### ステップ1: モデルとリストビューの定義

まず、表示する文字列のリストを持つモデルとリストビューを定義します。

```swift
import SwiftUI

struct ContentView: View {
    @State private var items: [String] = ["Item 1", "Item 2", "Item 3"]

    var body: some View {
        NavigationView {
            List(items.indices, id: \.self) { index in
                NavigationLink(destination: TextEditorView(text: $items[index])) {
                    Text(items[index])
                }
            }
            .navigationTitle("Items List")
        }
    }
}
```

### ステップ2: 編集ビューの定義

次に、文字列を編集するためのビューを定義します。

```swift
import SwiftUI

struct TextEditorView: View {
    @Binding var text: String

    var body: some View {
        VStack {
            TextEditor(text: $text)
                .padding()
                .border(Color.gray, width: 1)
            Spacer()
        }
        .navigationTitle("Edit Text")
        .navigationBarItems(trailing: Button(action: {
            // ナビゲーションを閉じるアクション
            dismiss()
        }) {
            Image(systemName: "xmark")
                .foregroundColor(.red)
        })
    }
    
    // ナビゲーションを閉じるためのメソッド
    private func dismiss() {
        // ここにナビゲーションを閉じるコードを記述
        // 例えば、プレゼンテーションモードを使用する
        presentationMode.wrappedValue.dismiss()
    }
    
    @Environment(\.presentationMode) var presentationMode: Binding<PresentationMode>
}

struct TextEditorView_Previews: PreviewProvider {
    static var previews: some View {
        TextEditorView(text: .constant("Sample Text"))
    }
}
```

### ポイント
- `NavigationView`を使用してナビゲーションを提供します。
- `List`と`NavigationLink`を組み合わせて、リストアイテムをタップすると編集ビューに遷移します。
- 編集ビュー`TextEditorView`は`@Binding`でテキストを受け取り、直接編集できるようにします。

この実装により、リストのアイテムをタップすると

---
