# toSnakeCase: _削除

日付: 2023-06-27

---

## 👤 ユーザー
*2023/06/28 02:31:18*

以下のStringのExtensionのtoSnakeCase関数で先頭に_がある場合は削除してほいい

public extension String {
    // ex1) "snakeCase" -&gt; "snake_case"
    // ex2) "SnakeCase" -&gt; "_snake_case"
    // ex3) "snakeCaseURL0123" -&gt; "snake_case_u_r_l0123"
    var toSnakeCase: String {
        unicodeScalars.reduce("") { result, scalar in
            if CharacterSet.uppercaseLetters.contains(scalar) {
                return "\(result)_\(Character(scalar))"
            } else {
                return result + String(scalar)
            }
        }.lowercased()
    }
}

---

## 🤖 アシスタント
*2023/06/28 02:31:47*

以下は指定された条件を満たすように改良した `toSnakeCase` メソッドです。変更点としては、変換後に生成されたスネークケースの文字列がアンダースコア(`_`)で始まる場合にそれを削除する処理を追加しました。

```swift
public extension String {
    // ex1) "snakeCase" -> "snake_case"
    // ex2) "SnakeCase" -> "snake_case"
    // ex3) "snakeCaseURL0123" -> "snake_case_u_r_l0123"
    var toSnakeCase: String {
        let snakeCased = unicodeScalars.reduce("") { result, scalar in
            if CharacterSet.uppercaseLetters.contains(scalar) {
                return "\(result)_\(Character(scalar))"
            } else {
                return result + String(scalar)
            }
        }.lowercased()
        
        // If the string starts with an underscore, remove it
        if snakeCased.hasPrefix("_") {
            return String(snakeCased.dropFirst())
        } else {
            return snakeCased
        }
    }
}
```

このコードでは `hasPrefix(_:)` メソッドを使用して文字列がアンダースコアで始まるかどうかを判断し、もし始まるなら `dropFirst()` メソッドを使用して最初の文字を削除します。そして、最初の文字がアンダースコアでない場合は元の文字列をそのまま返します。

---
