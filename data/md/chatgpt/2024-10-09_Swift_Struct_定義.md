# Swift Struct 定義

日付: 2024-10-09

---

## 👤 ユーザー
*2024/10/09 17:24:00*

Swift で　Struct定義して星
{
  "id": "sub_1234abcd"
  "current_period_end": "2024-02-01T12:00:00Z",
  "cancel_at": "2024-02-01T12:00:00Z",
  "customer_id": "cus_1234abcd"
}

---

## 🤖 アシスタント
*2024/10/09 17:24:06*

以下のように、SwiftでJSONのデータ構造に対応する`Subscription`構造体を定義できます。

```swift
struct Subscription: Codable {
    let id: String
    let currentPeriodEnd: String
    let cancelAt: String?
    let customerId: String
    
    enum CodingKeys: String, CodingKey {
        case id
        case currentPeriodEnd = "current_period_end"
        case cancelAt = "cancel_at"
        case customerId = "customer_id"
    }
}
```

この定義では、`id`、`currentPeriodEnd`、`cancelAt`、`customerId` というプロパティが含まれ、JSONキーとSwiftのプロパティ名が異なる場合には、`CodingKeys`でマッピングしています。

---
