# Swift String Extension: Masked Password

Date: 2023-10-27

---

## 👤 User
*2023-10-27 15:19:13*

Swiftでパスワードをマスクしたい。パスワード.maskedPassword で同じ桁すうで記号でマスクしたパワスワードを表示したい。Stringのextension を記述して欲しい。

---

## 🤖 Assistant
*2023-10-27 15:19:36*

Swiftで、指定された要件に基づいて`String`の拡張(extension)を作成することができます。以下に、`.maskedPassword`プロパティを使用して文字列をマスクするための`String`の拡張を示します。

```swift
extension String {
    var maskedPassword: String {
        return String(repeating: "•", count: self.count)
    }
}

// 使用例
let password = "password123"
print(password.maskedPassword)  // "•••••••••••"
```

この拡張機能は、元の文字列の長さに基づいて適切な数の`•`で文字列を置き換えます。この方法で、ユーザーは実際のパスワードの長さを知ることができますが、内容は非表示となります。

---
