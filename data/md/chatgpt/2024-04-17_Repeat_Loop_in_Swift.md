# Repeat Loop in Swift

Date: 2024-04-17

---

## 👤 User
*2024-04-17 16:26:40*

Swiftでrepeat 処理

---

## 🤖 Assistant
*2024-04-17 16:27:09*

Swiftにおける`repeat`処理はループの一種で、特定の条件が満たされるまで処理を繰り返します。Swiftには`repeat-while`ループという構文があります。これは他の言語の`do-while`ループに相当します。`repeat-while`ループは、最低一回はブロック内のコードを実行し、その後条件を評価して繰り返しを続けるか決定します。

こちらが`repeat-while`の基本的な使い方です：

```swift
repeat {
    // 実行するコード
} while 条件
```

例えば、5回メッセージを出力する簡単なループを作成することができます：

```swift
var count = 0
repeat {
    print("これは\(count + 1)回目の繰り返しです。")
    count += 1
} while count < 5
```

この例では、`count`変数が5未満の間、メッセージを出力し続けます。最初に`count`が0であるため、ループは5回実行され、各回でカウントが1増加します。

---
