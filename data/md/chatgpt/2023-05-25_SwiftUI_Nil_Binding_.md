# SwiftUI Nil Binding.

Date: 2023-05-25

---

## 👤 User
*2023-05-26 00:53:27*

SwiftUI で nil をバインディングして TextFieldなどで扱いたいんだけどどうすればいいかな

---

## 🤖 Assistant
*2023-05-26 00:54:18*

SwiftUIの`TextField`はバインディングを用いて状態を監視・更新しますが、基本的にnilを直接バインディングすることはできません。しかし、オプショナルなString型を扱いたい場合は、非オプショナルなStringとオプショナルなString間で変換を行うアプローチを取ることができます。

次に、そのための一例を示します。この例では、`TextField`の入力が空の場合はオプショナルなStringをnilに設定し、そうでない場合はその値に設定します。

```swift
import SwiftUI

struct ContentView: View {
    @State private var text: String = ""

    var textBinding: Binding<String> {
        Binding<String>(
            get: { self.text },
            set: { newValue in
                self.text = newValue.isEmpty ? nil : newValue
            }
        )
    }

    var body: some View {
        VStack {
            TextField("Placeholder", text: textBinding)
        }
    }
}
```

ここで、`textBinding`は`text`の値をラップするカスタムバインディングです。このバインディングでは、`TextField`からの新しい値を取得するたびにnilチェックを行い、その結果を元に`text`を更新しています。

この例では非オプショナルなStringとオプショナルなString間で変換を行っていますが、その逆にオプショナルなStringから非オプショナルなStringへの変換も可能です。また、他の方法としては、カスタムバインディングの代わりに自分でカスタムビューを作成することも可能です。

---
