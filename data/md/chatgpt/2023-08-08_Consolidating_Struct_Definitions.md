# Consolidating Struct Definitions

Date: 2023-08-08

---

## 👤 User
*2023-08-08 15:17:21*

Swiftで以下のように全く同じ変数の定義を持つstructの記述をまとめることはできないのか？

public struct Click: ProtoBufValueConvertible, Codable {
    private let target: String
    private let left: Double
    private let top: Double
    private let clientLeft: Double
    private let clientTop: Double
}

public struct TouchStart: ProtoBufValueConvertible, Codable {
    private let target: String
    private let left: Double
    private let top: Double
    private let clientLeft: Double
    private let clientTop: Double
}

public struct TouchEnd: ProtoBufValueConvertible, Codable {
    private let target: String
    private let left: Double
    private let top: Double
    private let clientLeft: Double
    private let clientTop: Double
}

public struct TouchMove: ProtoBufValueConvertible, Codable {
    private let target: String
    private let left: Double
    private let top: Double
    private let clientLeft: Double
    private let clientTop: Double
}

public struct TouchCancel: ProtoBufValueConvertible, Codable {
    private let target: String
    private let left: Double
    private let top: Double
    private let clientLeft: Double
    private let clientTop: Double
}

---

## 🤖 Assistant
*2023-08-08 15:17:44*

Swift では、一つの `struct` または `class` が他の型にそのまま変換するような直接的なメカニズムは提供していません。ただし、設計を工夫して冗長性を減少させることは可能です。

共通のプロパティを持つ基本の型を定義して、それを使用して他の型を定義するというアプローチを取ることができます。

例えば、以下のように `Interaction` という基本の `struct` を定義し、その型を利用して異なる型を作成することができます：

```swift
public struct Interaction: ProtoBufValueConvertible, Codable {
    private let target: String
    private let left: Double
    private let top: Double
    private let clientLeft: Double
    private let clientTop: Double
}

public typealias Click = Interaction
public typealias TouchStart = Interaction
public typealias TouchEnd = Interaction
public typealias TouchMove = Interaction
public typealias TouchCancel = Interaction
```

上記のように `typealias` を使用することで、異なる名前の型を定義することができますが、実際の型は `Interaction` と同じです。これはコードの冗長性を減少させる方法ですが、将来的に各イベントに独自のプロパティやメソッドを追加する必要がある場合、このアプローチは不適切となる可能性があります。

もし将来的な拡張性を考慮する場合、各イベントごとに独立した `struct` を保持することが望ましいでしょう。

---
