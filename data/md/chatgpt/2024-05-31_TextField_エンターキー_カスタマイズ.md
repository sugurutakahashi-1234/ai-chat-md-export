# TextField エンターキー カスタマイズ

日付: 2024-05-31

---

## 👤 ユーザー
*2024/5/31 16:15:24*

SwiftUI でキーボードのエンターを押した時のメッセーを変えたい

---

## 🤖 アシスタント
*2024/5/31 16:15:38*

SwiftUI でキーボードのエンターキーを押したときに表示されるメッセージを変更するには、`TextField` や `TextEditor` などのキーボード入力が可能なコンポーネントにカスタムアクションを設定する必要があります。ここでは、`TextField` を使用してエンターキーを押した際にアクションを実行する方法を紹介します。

```swift
import SwiftUI

struct ContentView: View {
    @State private var text: String = ""
    @State private var message: String = ""

    var body: some View {
        VStack {
            TextField("Enter text", text: $text, onCommit: {
                // エンターキーが押されたときに実行されるアクション
                message = "You pressed Enter with text: \(text)"
                // 必要に応じて他のアクションを追加
            })
            .textFieldStyle(RoundedBorderTextFieldStyle())
            .padding()

            Text(message)
                .padding()
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

この例では、`TextField` の `onCommit` クロージャを使用して、エンターキーが押されたときに実行されるアクションを定義しています。`message` ステートを更新することで、エンターキーが押されたときに表示されるメッセージを変更しています。

`TextEditor` を使用する場合も、同様にエンターキーのアクションをカスタマイズできますが、`TextField` のようにデフォルトの `onCommit` クロージャがないため、カスタム `UIViewRepresentable` を作成するか、別の方法でエンターキーのアクションを検出する必要があります。

---

## 👤 ユーザー
*2024/5/31 16:16:45*

アクションじゃなくてキーボードの方

---

## 🤖 アシスタント
*2024/5/31 16:17:02*

SwiftUIでは、デフォルトでキーボードのエンターキーのラベルをカスタマイズする直接的な方法は提供されていません。しかし、`UIKit` の `UITextField` をラップすることでカスタムキーボードのラベルを設定できます。以下にその方法を示します。

1. `UITextField` をラップするカスタムビューを作成する。
2. `SwiftUI` のビューにそのカスタムビューを埋め込む。

まず、`UITextField` をラップするカスタムビューを作成します。

```swift
import SwiftUI
import UIKit

struct CustomTextField: UIViewRepresentable {
    class Coordinator: NSObject, UITextFieldDelegate {
        var parent: CustomTextField

        init(parent: CustomTextField) {
            self.parent = parent
        }

        func textFieldShouldReturn(_ textField: UITextField) -> Bool {
            textField.resignFirstResponder()
            return true
        }
    }

    func makeCoordinator() -> Coordinator {
        return Coordinator(parent: self)
    }

    func makeUIView(context: Context) -> UITextField {
        let textField = UITextField()
        textField.delegate = context.coordinator
        textField.borderStyle = .roundedRect
        textField.returnKeyType = .done  // ここでキーボードのエンターキーのラベルを変更
        return textField
    }

    func updateUIView(_ uiView: UITextField, context: Context) {
        // ここで必要に応じて更新を行う
    }
}
```

次に、`SwiftUI` のビューにこのカスタム `UITextField` を埋め込みます。

```swift
import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack {
            Text("Custom TextField with Custom Return Key")
                .font(.headline)
                .padding()
            
            CustomTextField()
                .frame(height: 40)
                .padding()
            
            Spacer()
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

この方法で、カスタム `UITextField` の `returnKeyType` プロパティを使用してキーボードのエンターキーのラベルを変更できます。`returnKeyType` のオプションには、`.done`, `.go`, `.send`, `.search`, `.default`, `.next` などがあります。例えば、`textField.returnKeyType = .go` とすることで「Go」ラベルのエンターキーに変更できます。

これにより、SwiftUI でカスタムキーボードのラベルを持つテキストフィールドを作成できます。

---
