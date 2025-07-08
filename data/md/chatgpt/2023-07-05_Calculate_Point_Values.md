# Calculate Point Values

Date: 2023-07-05

---

## 👤 User
*2023-07-06 00:39:05*

Pointの配列のvalueの合計をだしてほしい

public struct Point: Identifiable {
    public let id: String
    public let createdAt: Date
    public let orgName: String?
    public let researchTitle: String
    public let value: Int

    public init(id: String, createdAt: Date, orgName: String?, researchTitle: String, value: Int) {
        self.id = id
        self.createdAt = createdAt
        self.orgName = orgName
        self.researchTitle = researchTitle
        self.value = value
    }
}


extension Collection where Element == Int {

    func sum() -&gt; Int {
        return reduce(0, +)
    }
}

---

## 🤖 Assistant
*2023-07-06 00:39:30*

提供された`Point`構造体を考慮すると、`Point`の配列内の`value`の合計を計算するためのSwiftコードは以下のようになります：

```swift
extension Collection where Element == Point {
    func sumValues() -> Int {
        return reduce(0, { $0 + $1.value })
    }
}
```

このコードの`sumValues`メソッドは`Element`タイプが`Point`であるコレクション（例えば配列）に適用され、各`Point`の`value`フィールドの合計を返します。

使用する場合はこのようになります：

```swift
let points: [Point] = [...] // あなたのPointオブジェクトの配列
let total = points.sumValues()
print(total)
```

このコードは、`points`配列内のすべての`Point`オブジェクトの`value`フィールドの合計を計算し、その合計を`total`に割り当て、次にその結果を出力します。

---
