# Swiftのassociatedtypeの使い方

Date: 2023-09-15

---

## 👤 User
*2023-09-15 15:59:33*

Qiitaの技術記事を書いて欲しい

---
title: "[Swift] associatedtype の実装例"
emoji: "🕊"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["Swift"]
published: true
---



// associatedtypeの実装例

protocol MogeProtocol {
    var mogemoge: String { get }
}

protocol FugaProtocol {
    var fugafuga: String { get }
}

protocol HogeProtocol {
    associatedtype MogeFugaType: MogeProtocol, FugaProtocol
    
    var mogeFuga: MogeFugaType { get }
    
    func piyopiyo(mogeFuga: MogeFugaType)
}

// 複数のプロトコルを適応させる場合は & でつなぐ
struct Hoge&lt;T: MogeProtocol & FugaProtocol&gt;: HogeProtocol {
    typealias MogeFugaType = T
    
    let mogeFuga: MogeFugaType
    
    init(mogeFuga: MogeFugaType) {
        self.mogeFuga = mogeFuga
        print(mogeFuga)
    }
    
    func piyopiyo(mogeFuga: MogeFugaType) {
        print(mogeFuga)
    }
}

struct MogeFuga: MogeProtocol, FugaProtocol {
    let mogemoge: String
    let fugafuga: String
}

let hoge: Hoge&lt;MogeFuga&gt; = .init(mogeFuga: .init(mogemoge: "a", fugafuga: "b"))
// MogeFuga(mogemoge: "a", fugafuga: "b")

hoge.piyopiyo(mogeFuga: .init(mogemoge: "c", fugafuga: "d"))
// MogeFuga(mogemoge: "c", fugafuga: "d")

---

## 🤖 Assistant
*2023-09-15 16:00:57*

---
title: "[Swift] `associatedtype` の実装例"
emoji: "🕊"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["Swift"]
published: true
---

# associatedtype の実装例について

Swiftのプロトコルには、`associatedtype` という非常に便利なキーワードがあります。このキーワードを使用すると、プロトコルの定義時に具体的な型を指定せず、その型を実装する際に具体的な型を指定することができます。この記事では、`associatedtype`の基本的な使い方を説明します。

## 基本的な実装

まず、以下のような2つのプロトコル `MogeProtocol` と `FugaProtocol` を定義します。

```swift
protocol MogeProtocol {
    var mogemoge: String { get }
}

protocol FugaProtocol {
    var fugafuga: String { get }
}
```

次に、これらの2つのプロトコルを組み合わせて使用する新しいプロトコル `HogeProtocol` を定義します。この時、`associatedtype` を使用して、具体的な型を後から指定できるようにします。

```swift
protocol HogeProtocol {
    associatedtype MogeFugaType: MogeProtocol, FugaProtocol
    
    var mogeFuga: MogeFugaType { get }
    
    func piyopiyo(mogeFuga: MogeFugaType)
}
```

`Hoge` という構造体を定義し、`HogeProtocol`を採用させることで、具体的な型を指定します。

```swift
struct Hoge<T: MogeProtocol & FugaProtocol>: HogeProtocol {
    typealias MogeFugaType = T
    
    let mogeFuga: MogeFugaType
    
    init(mogeFuga: MogeFugaType) {
        self.mogeFuga = mogeFuga
        print(mogeFuga)
    }
    
    func piyopiyo(mogeFuga: MogeFugaType) {
        print(mogeFuga)
    }
}
```

最後に、`MogeProtocol` と `FugaProtocol` を採用する構造体 `MogeFuga` を定義し、実際に`Hoge`で使用します。

```swift
struct MogeFuga: MogeProtocol, FugaProtocol {
    let mogemoge: String
    let fugafuga: String
}

let hoge: Hoge<MogeFuga> = .init(mogeFuga: .init(mogemoge: "a", fugafuga: "b"))
// MogeFuga(mogemoge: "a", fugafuga: "b")

hoge.piyopiyo(mogeFuga: .init(mogemoge: "c", fugafuga: "d"))
// MogeFuga(mogemoge: "c", fugafuga: "d")
```

## まとめ

Swiftの`associatedtype`は非常に強力な機能で、プロトコルの柔軟性を向上させます。具体的な型を指定せずにプロトコルを定義し、後からその型を具体的に指定することが可能です。これにより、より汎用的なコードを書くことができます。

---

## 👤 User
*2023-09-15 16:23:18*

こちらもよろしくお願いいたします。

---
title: "[Swift] "
emoji: "🕊"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["Swift"]
published: true
---

import Foundation

struct CustomStringConvertibleHoge: CustomStringConvertible {
    let value: Int
    
    var description: String {
        "CustomStringConvertible を適応している場合: \(value)"
    }
}

struct NotCustomStringConvertibleHoge {
    let value: Int
    
    var description: String {
        "CustomStringConvertible を適応していない場合: \(value)"
    }
}

let customStringConvertibleHoge = CustomStringConvertibleHoge(value: 0)
let notCustomStringConvertibleHoge = NotCustomStringConvertibleHoge(value: 1)

print(customStringConvertibleHoge) // CustomStringConvertible を適応している場合: 0
print(notCustomStringConvertibleHoge) // NotCustomStringConvertibleHoge(value: 1)

---

## 🤖 Assistant
*2023-09-15 16:24:40*

---
title: "[Swift] CustomStringConvertible の使い方とそのメリット"
emoji: "🕊"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["Swift", "CustomStringConvertible"]
published: true
---

# CustomStringConvertible を使ったカスタム文字列表現

Swift には、オブジェクトのカスタム文字列表現を提供するためのプロトコルとして、`CustomStringConvertible` が存在します。このプロトコルを採用することで、オブジェクトを文字列として出力や表示する際に、カスタムな表現を提供することができます。この記事では、`CustomStringConvertible` の使い方とそのメリットについて解説します。

## 基本的な使い方

`CustomStringConvertible` プロトコルを採用するには、`description` プロパティを実装します。

```swift
import Foundation

struct CustomStringConvertibleHoge: CustomStringConvertible {
    let value: Int
    
    var description: String {
        "CustomStringConvertible を適応している場合: \(value)"
    }
}
```

`description` プロパティは、オブジェクトのカスタムな文字列表現を返す役割があります。

## 比較：CustomStringConvertible を採用していない場合

採用していない場合、オブジェクトのデフォルトの文字列表現が使用されます。

```swift
struct NotCustomStringConvertibleHoge {
    let value: Int
    
    var description: String {
        "CustomStringConvertible を適応していない場合: \(value)"
    }
}
```

実際に両方の構造体を使ってみると、その違いが明確になります。

```swift
let customStringConvertibleHoge = CustomStringConvertibleHoge(value: 0)
let notCustomStringConvertibleHoge = NotCustomStringConvertibleHoge(value: 1)

print(customStringConvertibleHoge) // CustomStringConvertible を適応している場合: 0
print(notCustomStringConvertibleHoge) // NotCustomStringConvertibleHoge(value: 1)
```

## メリット

- **可読性**: オブジェクトの内容をわかりやすく表示できるので、デバッグやログの出力時に役立ちます。
- **柔軟性**: 必要に応じてカスタムな表現を提供できるため、より具体的な情報を提供することができます。

## まとめ

Swift の `CustomStringConvertible` プロトコルは、オブジェクトのカスタム文字列表現を簡単に実装できる非常に便利なツールです。デバッグやログの出力など、様々な場面でそのメリットを享受することができます。

---
