# TextField Central Alignment

日付: 2024-08-15

---

## 👤 ユーザー
*2024/8/15 15:56:56*

キーボードが出てきてもしまってもずっと中央にいるTextフィールドをSwiftUIで

---

## 🤖 アシスタント
*2024/8/15 15:57:06*

SwiftUIで、キーボードが出現しても画面中央に位置するTextFieldを実現するには、`GeometryReader`と`@State`または`@FocusState`を組み合わせて使用します。以下はその実装例です。

```swift
import SwiftUI

struct CenteredTextFieldView: View {
    @State private var text: String = ""
    @FocusState private var isFocused: Bool
    
    var body: some View {
        GeometryReader { geometry in
            VStack {
                Spacer()
                TextField("Enter text here", text: $text)
                    .textFieldStyle(UnderlineTextFieldStyle()) // 任意のスタイルを適用
                    .focused($isFocused)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color(.secondarySystemBackground))
                    .cornerRadius(8)
                    .onAppear {
                        // ビューが表示されたときにキーボードを表示
                        isFocused = true
                    }
                Spacer()
            }
            .frame(height: geometry.size.height) // Viewの

---

## 👤 ユーザー
*2024/8/15 15:57:27*

スペーサーとかで上手くできないの？

---

## 🤖 アシスタント
*2024/8/15 15:57:41*

`Spacer` を使って、TextFieldをキーボードが出ても常に画面中央に保つ方法があります。この場合、`Spacer`を使ってTextFieldを上下に中央揃えにし、キーボードの出現時に自動的に対応するようにします。

以下はその実装例です。

```swift
import SwiftUI

struct CenteredTextFieldView: View {
    @State private var text: String = ""
    @FocusState private var isFocused: Bool
    
    var body: some View {
        VStack {
            Spacer() // 上のスペース
            TextField("Enter text here", text: $text)
                .textFieldStyle(UnderlineTextFieldStyle()) // 任意のスタイルを適用
                .focused($isFocused)
                .padding()
                .background(Color(.secondarySystemBackground))
                .cornerRadius(8)
                .onAppear {
                    // ビューが表示されたときにキーボードを表示
                    isFocused = true
                }
            Spacer() // 下のスペース
        }
        .padding()
    }
}
```

このコードでは、TextFieldの上と下に`Spacer`を配置することで、常に画面の中央に配置されます。キーボードが出てきた場合でもTextFieldは中央に留まり、レイアウトが崩れません。`@FocusState`を使って、ビューの表示時にキーボードを自動的に表示するようにしています。

これにより、TextFieldはスペーサーによって中央に配置され、キーボードが出ても常に中央に保たれます。

---
