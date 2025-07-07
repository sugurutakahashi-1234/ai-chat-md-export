# Date.toMilliseconds Extension

日付: 2023-06-25

---

## 👤 ユーザー
*2023/6/26 7:50:27*

以下の処理の逆のDate型のエクステンションを作って欲しい

public extension Double {
    // ex) 1656489212345 -&gt; 2022-06-29T07:53:32.345Z
    var asDateFromMilliseconds: Date {
        Date(timeIntervalSince1970: TimeInterval(self) / 1000)
    }
}

---

## 🤖 アシスタント
*2023/6/26 7:50:41*

あなたが要求したエクステンションは、Dateオブジェクトをミリ秒のDoubleに変換します。次のコードを参照してください：

```swift
public extension Date {
    // Date -> ex) 1656489212345
    var toMilliseconds: Double {
        return self.timeIntervalSince1970 * 1000.0
    }
}
```

これにより、Dateオブジェクトに対して`.toMilliseconds`を呼び出すと、Unixエポック（1970年1月1日0時UTC）からの経過時間がミリ秒単位で返されます。

---
