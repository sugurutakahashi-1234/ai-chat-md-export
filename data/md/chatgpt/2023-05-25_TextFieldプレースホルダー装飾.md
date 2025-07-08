# TextFieldプレースホルダー装飾

Date: 2023-05-25

---

## 👤 User
*2023-05-26 01:21:32*

SwiftUI のTextFieldのプレースホルダーの装飾をすることってできるの？

---

## 🤖 Assistant
*2023-05-26 01:22:39*

SwiftUIのTextFieldには直接的なプレースホルダーテキストの装飾を指定する機能がありません。しかし、いくつかのワークアラウンドがあります。

1. ZStackを使ってテキストフィールドの背後にラベルを配置し、それをプレースホルダーとして使うことができます。入力が空でない場合にはラベルが非表示になるように制御します。

```swift
struct ContentView: View {
    @State private var text: String = ""

    var body: some View {
        ZStack(alignment: .leading) {
            if text.isEmpty {
                Text("Placeholder")
                    .foregroundColor(.gray)
                    // ここでプレースホルダーの装飾を設定
            }
            TextField("", text: $text)
        }
    }
}
```

2. `UITextField`のカスタムビューレプレゼンタブルを作成し、UIKitのテキストフィールドをラップする方法があります。これにより、SwiftUIのテキストフィールドに対するコントロールを拡大できます。しかし、この方法は少し複雑であり、UIKitとSwiftUIの間のブリッジングが必要です。

ここにサンプルコードを示します:

```swift
struct CustomTextField: UIViewRepresentable {
    @Binding var text: String
    var placeholder: String

    func makeUIView(context: UIViewRepresentableContext<CustomTextField>) -> UITextField {
        let textField = UITextField()
        textField.delegate = context.coordinator
        textField.placeholder = placeholder
        textField.textColor = .black  // ここで色を指定
        return textField
    }

    func updateUIView(_ uiView: UITextField, context: UIViewRepresentableContext<CustomTextField>) {
        uiView.text = text
    }

    func makeCoordinator() -> CustomTextField.Coordinator {
        Coordinator(self)
    }

    class Coordinator: NSObject, UITextFieldDelegate {
        var parent: CustomTextField

        init(_ textField: CustomTextField) {
            self.parent = textField
        }

        func textFieldDidChangeSelection(_ textField: UITextField) {
            parent.text = textField.text ?? ""
        }
    }
}
```

そして、このカスタムビューを使うことができます:

```swift
struct ContentView: View {
    @State private var text = ""

    var body: some View {
        CustomTextField(text: $text, placeholder: "Placeholder")
    }
}
```

ただし、これらの方法はあくまでワークアラウンドであり、将来のSwiftUIのバージョンでは、より直感的で簡単な方法が提供されるかもしれません。

---
