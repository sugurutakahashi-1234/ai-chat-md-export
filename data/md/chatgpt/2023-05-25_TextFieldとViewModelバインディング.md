# TextFieldとViewModelバインディング

日付: 2023-05-25

---

## 👤 ユーザー
*2023/05/25 09:30:24*

SwiftUI のTextFieldとViewModelの@published var name: Stinrg? をバインディングしようとしているのだけれども nil のせいでバインディングできないんだけどどうすればいい

---

## 🤖 アシスタント
*2023/05/25 09:30:58*

SwiftUIの `TextField` は、デフォルトでは `nil` を扱うことができません。そのため、 `@Published` で公開されたオプショナルのStringをバインディングしようとすると問題が発生します。

これを解決するためには、ViewModel内で `nil` を特定のデフォルト値で置き換えるなど、適切な非オプショナルの値を提供する必要があります。または、別のプロパティを用意して、それをTextFieldとバインディングする方法もあります。

次に、そのようなViewModelのサンプルを示します。

```swift
class ViewModel: ObservableObject {
    @Published var name: String? {
        didSet {
            _nameForTextField = name ?? ""
        }
    }
    
    @Published private(set) var _nameForTextField: String = ""
    
    init() {
        _nameForTextField = name ?? ""
    }
}
```

このサンプルでは、新たに `_nameForTextField` というString型のプロパティを追加しました。そして、 `name` プロパティが更新されるたびに、 `_nameForTextField` も更新されるようになっています。 `name` が `nil` の場合、 `_nameForTextField` は空文字列 ("") になります。

そして、この `_nameForTextField` を `TextField` とバインディングします。その際には、ユーザーがTextFieldに入力した値を元の `name` プロパティにも反映させるための処理を追加します。次のようなコードになるでしょう。

```swift
struct ContentView: View {
    @ObservedObject var viewModel: ViewModel

    var body: some View {
        TextField("Name", text: $viewModel._nameForTextField, onCommit: {
            viewModel.name = viewModel._nameForTextField.isEmpty ? nil : viewModel._nameForTextField
        })
    }
}
```

`onCommit` のクロージャ内で、TextFieldが空（つまり、ユーザーが何も入力していない）の場合は `name` を `nil` に設定し、それ以外の場合はTextFieldの内容を `name` に設定しています。

---

## 👤 ユーザー
*2023/05/25 09:31:39*

disSetは使いたくないな

---

## 🤖 アシスタント
*2023/05/25 09:32:00*

理解しました。その場合、SwiftUIでよく使われる方法として、`Binding`のカスタム版を作成してバインディングする方法があります。こうすると、`didSet`を使用せずにViewModelの`@Published`変数と`TextField`をバインドすることができます。

以下にその例を示します：

```swift
class ViewModel: ObservableObject {
    @Published var name: String?
}

struct ContentView: View {
    @ObservedObject var viewModel: ViewModel
    
    var body: some View {
        TextField("Name", text: Binding(
            get: { self.viewModel.name ?? "" },
            set: { self.viewModel.name = $0.isEmpty ? nil : $0 }
        ))
    }
}
```

この例では、カスタム`Binding`が作成されています。この`Binding`は、`get`時に`name`が`nil`であれば空の文字列を返し、`set`時には`TextField`からの入力を`name`に設定します。入力が空の場合、`name`は再び`nil`に設定されます。

この方法で、`didSet`を使用せずにViewModelの`@Published`プロパティと`TextField`を適切にバインドできます。

---
