# CGFloat to Int Conversion

日付: 2023-05-24

---

## 👤 ユーザー
*2023/05/24 13:38:00*

CGFloat を Int 型に変換する

---

## 🤖 アシスタント
*2023/05/24 13:38:18*

Swift で CGFloat を Int に変換するには、Int のイニシャライザを使って変換を行います。次のコードスニペットがそれを示しています：

```swift
let floatNumber: CGFloat = 42.7
let intNumber: Int = Int(floatNumber)
```

このコードは `floatNumber` を整数に変換し、その結果を `intNumber` に代入します。ただし、この方法では小数点以下が切り捨てられます。もし四捨五入を行いたい場合は、次のように記述します：

```swift
let floatNumber: CGFloat = 42.7
let intNumber: Int = Int(floatNumber.rounded())
```

このコードでは、`rounded()` メソッドを使用して CGFloat を四捨五入し、その結果を Int に変換します。

---
