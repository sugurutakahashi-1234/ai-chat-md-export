# SwiftUI Common Alert.

Date: 2023-06-15

---

## 👤 User
*2023-06-15 18:01:32*

SwiftUIで共通のアラートを実装したい。

どうすればいいか教えて欲しい

例えば以下のアラートを他の画面でも使いたいんだ

 
struct ContentView: View {
    @State private var showingAlert = false
    
    var body: some View {
        Button("アラート表示") {
            self.showingAlert = true
        }
        .alert("タイトル", isPresented: $showingAlert) {
            Button("了解") {
                // 了解ボタンが押された時の処理
            }
        } message: {
            Text("詳細メッセージ")
        }
    }
}

---

## 🤖 Assistant
*2023-06-15 18:02:22*

共通のアラートを実装するためには、まず新しい`ViewModifier`を作成して、その中でアラートを表示するロジックを定義します。その後、特定の`View`に対して新しく作成した`ViewModifier`を適用することで、共通のアラートを表示することができます。

以下にサンプルコードを示します：

```swift
// 共通のアラートを表示するViewModifierを定義
struct AlertModifier: ViewModifier {
    @Binding var showAlert: Bool
    let title: String
    let message: String
    let dismissButton: Alert.Button
    
    func body(content: Content) -> some View {
        content
            .alert(isPresented: $showAlert) {
                Alert(
                    title: Text(title),
                    message: Text(message),
                    dismissButton: dismissButton
                )
            }
    }
}

// ユーザ定義のextensionを作成し、ViewModifierを適用するメソッドを提供
extension View {
    func commonAlert(isPresented: Binding<Bool>, title: String, message: String, dismissButton: Alert.Button) -> some View {
        self.modifier(AlertModifier(showAlert: isPresented, title: title, message: message, dismissButton: dismissButton))
    }
}
```

これにより、任意の`View`に対して`commonAlert`メソッドを適用して共通のアラートを表示することが可能となります。以下に使用例を示します：

```swift
struct ContentView: View {
    @State private var showingAlert = false
    
    var body: some View {
        Button("アラート表示") {
            self.showingAlert = true
        }
        .commonAlert(isPresented: $showingAlert, 
                     title: "タイトル", 
                     message: "詳細メッセージ", 
                     dismissButton: .default(Text("了解")) {
                         // 了解ボタンが押された時の処理
                     })
    }
}
```

これで、共通のアラートを表示するロジックが`AlertModifier`に集約され、どの`View`でも簡単に共通のアラートを表示できるようになります。

---

## 👤 User
*2023-06-15 20:35:26*

```swift

```swift
.alert(isPresented: &lt;#T##Binding&lt;Bool&gt;#&gt;, error: &lt;#T##LocalizedError?#&gt;) { &lt;#LocalizedError#&gt; in
            &lt;#code#&gt;
        } message: { &lt;#LocalizedError#&gt; in
            &lt;#code#&gt;
        }
```

---

## 🤖 Assistant
*2023-06-15 20:36:31*

SwiftUIでは直接エラーオブジェクトを扱うアラートのメソッドは提供されていませんが、`LocalizedError`プロトコルを利用することでエラーメッセージを扱うことができます。このプロトコルはエラーのローカライズされた説明を提供します。

エラーメッセージを表示する共通のアラートを作成するためには、まずエラーを保存するための`@State`プロパティを作成し、その値を監視してアラートを表示する必要があります。以下に例を示します：

```swift
struct ContentView: View {
    @State private var error: LocalizedError?

    var body: some View {
        Button("エラーテスト") {
            self.error = MyError.testError // MyErrorはLocalizedErrorに適合する必要があります
        }
        .alert(isPresented: $error.map { $0 != nil }) {
            Alert(
                title: Text("エラー"),
                message: Text(error?.errorDescription ?? ""),
                dismissButton: .default(Text("了解")) {
                    // 了解ボタンが押された時の処理
                    self.error = nil
                }
            )
        }
    }
}

// LocalizedErrorに適合するエラー型の定義
enum MyError: LocalizedError {
    case testError

    var errorDescription: String? {
        switch self {
        case .testError:
            return "これはテストエラーです"
        }
    }
}
```

この例では、`MyError`というエラー型を定義し、エラー発生時にその型のインスタンスを`@State`プロパティ`error`に格納します。`error`が`nil`でない場合にアラートが表示され、アラートのメッセージはエラーの`errorDescription`を使って表示します。

しかし、この方法ではまだアラートの表示方法が個々のViewに依存してしまいます。共通のアラートを作成するためには、前述の`ViewModifier`と同様に`ViewModifier`を作成し、その中でエラーを扱う方法を定義します。

```swift
// 共通のエラーアラートを表示するViewModifierを定義
struct ErrorAlertModifier: ViewModifier {
    @Binding var error: LocalizedError?
    
    func body(content: Content) -&gt; some View {
        content
            .alert(item: $error) { error in
                Alert(
                    title: Text("エラー"),
                    message: Text(error.errorDescription ?? ""),
                    dismissButton: .default(Text("了解")) {
                        // 了解ボタンが押された時の処理
                        self.error = nil
                    }
                )
            }
    }
}

// ユーザ定義のextensionを作成し、ViewModifierを適用するメソッドを提供
extension View {
    func commonErrorAlert(error: Binding&lt;LocalizedError?&gt;) -&gt; some View {
        self.mod

---

## 🤖 Assistant
*2023-06-15 20:37:20*

ifier(ErrorAlertModifier(error: error))
    }
}
```

このようにすることで、エラーを引数にとる共通のアラートを任意のViewに表示できます。

---
