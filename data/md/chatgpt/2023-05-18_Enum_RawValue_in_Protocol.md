# Enum RawValue in Protocol

Date: 2023-05-18

---

## 👤 User
*2023-05-18 13:22:56*

以下のように enum の rawValue をprotocol の exxtension で使いたいのだけれどもどうすればいい？

protocol HogeProtocol: String CaseIterable, Identifiable {}

extension HogeProtocol {
    var id: String {
        rawValue
    }

    var meneName: String {
        rawValue.prefix(1).uppercased() + rawValue.dropFirst()
    }
}

private enum Hoge: HogeProtocol {
    case typography
    case color
}

---

## 🤖 Assistant
*2023-05-18 13:23:40*

あなたが`HogeProtocol`で`Identifiable`および`CaseIterable`を採用しているにもかかわらず、このプロトコルを採用したenumが自動的に`String`や`CaseIterable`の特性を取得するわけではありません。なので`HogeProtocol`が`String`や`CaseIterable`を必要としているならば、それぞれの特性を自身の宣言に明示的に含める必要があります。

以下にあなたのコードを修正したものを示します：

```swift
protocol HogeProtocol: Identifiable, CaseIterable where Self: RawRepresentable, Self.RawValue == String {}

extension HogeProtocol {
    var id: String {
        self.rawValue
    }

    var menuName: String {
        rawValue.prefix(1).uppercased() + rawValue.dropFirst()
    }
}

enum Hoge: String, HogeProtocol {
    case typography
    case color
}
```

これにより、`HogeProtocol`は`Identifiable`および`CaseIterable`を採用し、その自己型が`RawRepresentable`でありその生の値が`String`であることを要求します。次に、`Hoge` enumは`String`および`HogeProtocol`を採用します。これであなたのコードは期待通りに動作するはずです。

---
