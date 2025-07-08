# Frame width calculation.

Date: 2024-06-25

---

## 👤 User
*2024-06-25 16:43:51*

.frame(width: geometry.size.width - 60) この計算を負にならないようにしてほしい

---

## 🤖 Assistant
*2024-06-25 16:43:56*

`geometry.size.width - 60` の計算結果が負にならないようにするためには、最低でも60以上の幅を確保する必要があります。そのためには、以下のように条件付きでフレームの幅を設定することができます：

```swift
.frame(width: max(geometry.size.width - 60, 0))
```

このコードでは、`geometry.size.width - 60` が負にならないように、最低値として0を設定しています。これにより、幅が負になることを防ぐことができます。

---
