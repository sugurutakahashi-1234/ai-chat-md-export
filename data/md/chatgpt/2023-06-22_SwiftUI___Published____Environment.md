# SwiftUI: @Published & @Environment

Date: 2023-06-22

---

## 👤 User
*2023-06-22 17:51:46*

SwiftUI でViewModel で @publishedで var shouldDismiss: Bool を定義して、それがtrueのときに@Environment(\.dismiss) private var dismiss のdismiss()を実行するコードを書いて欲しい

---

## 🤖 Assistant
*2023-06-22 17:52:18*

以下に、あなたの要求に従って作成したサンプルコードを示します。

まず、ViewModel を定義します。`@Published` 属性を持つ `shouldDismiss` 変数を作成します。

```swift
class ViewModel: ObservableObject {
    @Published var shouldDismiss: Bool = false
}
```

次に、SwiftUIビューを作成します。ビューの中でViewModelを監視し、`shouldDismiss`がtrueになったときにdismissを実行します。

```swift
struct MyView: View {
    @Environment(\.dismiss) private var dismiss
    @ObservedObject var viewModel: ViewModel

    var body: some View {
        VStack {
            Text("Hello, World!")
            Button("Dismiss") {
                viewModel.shouldDismiss = true
            }
        }
        .onChange(of: viewModel.shouldDismiss) { shouldDismiss in
            if shouldDismiss {
                dismiss()
            }
        }
    }
}
```

この例では、`MyView`が`ViewModel`を観察し、`shouldDismiss`が`true`に変更された場合、ビューは自身を閉じます。ただし、この動作は`Button`が押されたときにのみ発生します。

このコードは、あなたの要求を満たす基本的な例です。特定の要求に応じてコードを調整する必要があるかもしれません。

---
