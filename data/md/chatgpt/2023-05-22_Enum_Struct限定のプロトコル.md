# Enum/Struct限定のプロトコル

日付: 2023-05-22

---

## 👤 ユーザー
*2023/05/22 16:56:45*

Swiftのprotocol定義でenum限定のprotocolやStruct限定のprotocolみたいなのはprotocol側で指定できたりしますか？

---

## 🤖 アシスタント
*2023/05/22 16:57:11*

Swiftのプロトコルでは、具体的なデータタイプ（クラス、構造体、列挙型など）にプロトコルを制限することはできません。しかし、クラスのみにプロトコルを制限する方法が存在します。具体的には、プロトコル定義に `: AnyObject` もしくは `: class` を追加することで、そのプロトコルはクラスタイプにのみ適用されるようになります。

以下に具体的な例を示します：

```swift
protocol SomeProtocol: AnyObject {
  // protocol definition goes here
}
```

または：

```swift
protocol SomeProtocol: class {
  // protocol definition goes here
}
```

しかし、このような制限はクラスに対してのみ適用されます。構造体や列挙型に対してプロトコルを制限するような機能は、Swift言語には現在存在しません（2021年9月時点）。

---
