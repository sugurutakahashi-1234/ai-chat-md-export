# Codable for DictionaryConvertible.

日付: 2023-07-28

---

## 👤 ユーザー
*2023/07/28 18:20:17*

Swiftで以下の処理をCodableでリファクタ表現できるかな

public extension DictionaryConvertible {
    // TODO: もしかすると Codable で簡単に書き直せるかもしれない
    func asDictionary(caseFormat: CaseFormat = .original) -&gt; [String: Any] {
        let mirror = Mirror(reflecting: self)
        var dictionary: [String: Any] = [:]

        mirror.children.forEach { child in
            guard let keyName = child.label else { return }

            switch caseFormat {
            case .original:
                dictionary[keyName] = child.value
            case .snakeCase:
                dictionary[keyName.toSnakeCase] = child.value
            }
        }

        return dictionary
    }
}

---

## 🤖 アシスタント
*2023/07/28 18:20:57*

`Codable` を用いた方法でリファクタリングを行いますが、Swiftの `JSONEncoder` を使用します。これにより、Codableで定義されたオブジェクトを直接JSONとしてエンコードできます。また、キーの名前をスネークケースに変更するために `keyEncodingStrategy` プロパティを用います。

ただし、Codableによる方法は `[String: Any]` ではなく、 `Data` タイプ（JSON形式）を生成します。そのため、それを `Dictionary` に変換するために `JSONSerialization` を使用する必要があります。

ここでは、あなたの `DictionaryConvertible` プロトコルを `Codable` に適合させています。そして、`asDictionary(caseFormat:)` 関数をリファクタリングします。それでは、以下にコードを示します。

```swift
public extension DictionaryConvertible where Self: Codable {
    func asDictionary(caseFormat: CaseFormat = .original) -> [String: Any]? {
        let encoder = JSONEncoder()

        switch caseFormat {
        case .original:
            encoder.keyEncodingStrategy = .useDefaultKeys
        case .snakeCase:
            encoder.keyEncodingStrategy = .convertToSnakeCase
        }

        do {
            let data = try encoder.encode(self)
            let dictionary = try JSONSerialization.jsonObject(with: data, options: .allowFragments) as? [String: Any]
            return dictionary
        } catch {
            print("Encoding failed: \(error)")
            return nil
        }
    }
}
```

このリファクタリングは `Codable` プロトコルを使用しており、Swift 4以降で使用できます。また、このコードはエラーハンドリングを含んでいますので、エンコーディングやJSON変換が失敗した場合にはエラーメッセージが表示されます。

ただし、この方法では `[String: Any]` ではなく `[String: Any]?` を返します。これは、エンコーディングやデシリアライゼーションが失敗した場合には `nil` を返すためです。あなたの要件に応じて、このエラーハンドリングを調整することが可能です。

---

## 👤 ユーザー
*2023/07/28 18:21:21*

nilを返さずfatalエラーにしてほしい

---

## 🤖 アシスタント
*2023/07/28 18:21:48*

エラーを処理するための要求に応じて、関数を次のように更新できます。エラーが発生した場合、 `fatalError()` を呼び出してアプリケーションをクラッシュさせます。この関数はエラーメッセージを表示して、実行を停止します。

```swift
public extension DictionaryConvertible where Self: Codable {
    func asDictionary(caseFormat: CaseFormat = .original) -> [String: Any] {
        let encoder = JSONEncoder()

        switch caseFormat {
        case .original:
            encoder.keyEncodingStrategy = .useDefaultKeys
        case .snakeCase:
            encoder.keyEncodingStrategy = .convertToSnakeCase
        }

        do {
            let data = try encoder.encode(self)
            let dictionary = try JSONSerialization.jsonObject(with: data, options: .allowFragments) as? [String: Any]
            return dictionary!
        } catch {
            fatalError("Encoding failed: \(error)")
        }
    }
}
```

この方法はエラー発生時に即座にクラッシュしますので、開発中にエラーを早期に検出するのに役立ちます。ただし、本番環境での使用は避けるべきです。なぜなら、エラーが発生した場合、ユーザーはアプリケーションが予期せず終了するという経験をする可能性があるからです。代わりに、適切なエラーハンドリングとエラーレポートを提供することをお勧めします。

---

## 👤 ユーザー
*2023/07/28 18:23:09*

dictionary! はせずにアンラップしてほしい

---

## 🤖 アシスタント
*2023/07/28 18:23:33*

あなたの要望に応じて、`try?`を使用して`dictionary`を安全にアンラップし、`fatalError()`を呼び出すことができます。以下に、それを行う方法を示します。

```swift
public extension DictionaryConvertible where Self: Codable {
    func asDictionary(caseFormat: CaseFormat = .original) -> [String: Any] {
        let encoder = JSONEncoder()

        switch caseFormat {
        case .original:
            encoder.keyEncodingStrategy = .useDefaultKeys
        case .snakeCase:
            encoder.keyEncodingStrategy = .convertToSnakeCase
        }

        do {
            let data = try encoder.encode(self)
            if let jsonObject = try JSONSerialization.jsonObject(with: data, options: .allowFragments) as? [String: Any] {
                return jsonObject
            } else {
                fatalError("Couldn't convert to [String: Any] dictionary")
            }
        } catch {
            fatalError("Encoding failed: \(error)")
        }
    }
}
```
このコードでは、`JSONSerialization.jsonObject(with:options:)` が `[String: Any]` 型の辞書に変換できなかった場合に `fatalError()` を呼び出します。このメソッドが期待する型に変換できなかった場合のエラーハンドリングがこれで追加されます。

---

## 👤 ユーザー
*2023/07/28 18:23:59*

if let ではなくて guard let してほしい。

---

## 🤖 アシスタント
*2023/07/28 18:24:22*

ご指定に応じて、`if let`を`guard let`に置き換えることで、期待する条件が満たされなかったときに即座に関数を終了できます。以下にその方法を示します。

```swift
public extension DictionaryConvertible where Self: Codable {
    func asDictionary(caseFormat: CaseFormat = .original) -> [String: Any] {
        let encoder = JSONEncoder()

        switch caseFormat {
        case .original:
            encoder.keyEncodingStrategy = .useDefaultKeys
        case .snakeCase:
            encoder.keyEncodingStrategy = .convertToSnakeCase
        }

        do {
            let data = try encoder.encode(self)
            guard let jsonObject = try JSONSerialization.jsonObject(with: data, options: .allowFragments) as? [String: Any] else {
                fatalError("Couldn't convert to [String: Any] dictionary")
            }
            return jsonObject
        } catch {
            fatalError("Encoding failed: \(error)")
        }
    }
}
```

ここで、`guard let`は条件をテストします。もし条件が`false`（つまり、`jsonObject`が`nil`）であれば、`fatalError()`が呼び出されて関数がすぐに終了します。これにより、この関数の後半部分が実行されるのは、`jsonObject`が`nil`ではないときだけになります。

---

## 👤 ユーザー
*2023/07/28 18:25:25*

アプリケーション全体で JSONEncoder を使うことが多いのだけれども、共通のものをシェアしたほうがいいのか、毎回宣言したほうがいいのかどっちだと思いますか？

---

## 🤖 アシスタント
*2023/07/28 18:25:52*

一部のケースでは、アプリケーション全体で共通の`JSONEncoder`インスタンスをシェアすると、コードがすっきりするとともに、エンコーディングの設定が一元化されて管理しやすくなります。しかし、エンコーディング設定がコンテキストごとに異なる場合（例えば、一部のリクエストでは日付のフォーマットが異なる、など）、各場所で別々に`JSONEncoder`を作成する方が適切でしょう。

`JSONEncoder`は複数のスレッドから同時にアクセスされるとスレッドセーフでないため、同時に利用される可能性のあるコンテキストでは新しいインスタンスを作成するほうが良いでしょう。一方、同一のスレッド内で共有することが可能で、かつエンコーディング設定がアプリケーション全体で共通であれば、共通の`JSONEncoder`インスタンスを用意することができます。

よって、アプリケーションの要件と構造によりますが、スレッドセーフを考慮し、設定がコンテキストごとに変わる可能性があるのであれば、各使用時に新しいインスタンスを作成するのが一般的です。

---

## 👤 ユーザー
*2023/07/28 18:28:34*

Codable である必要はあるのかエンコードだけできればいいのでは？

---

## 🤖 アシスタント
*2023/07/28 18:28:54*

その通りです。エンコードだけを行っているのであれば、エンティティが`Encodable`を満たすだけで十分です。`Codable`プロトコルは、`Decodable`と`Encodable`の両方を含んでいますが、この場合、`Decodable`は不要です。

以下に修正版のコードを示します：

```swift
public extension Encodable {
    func asDictionary(caseFormat: CaseFormat = .original) -> [String: Any] {
        let encoder = JSONEncoder()

        switch caseFormat {
        case .original:
            encoder.keyEncodingStrategy = .useDefaultKeys
        case .snakeCase:
            encoder.keyEncodingStrategy = .convertToSnakeCase
        }

        do {
            let data = try encoder.encode(self)
            guard let jsonObject = try JSONSerialization.jsonObject(with: data, options: .allowFragments) as? [String: Any] else {
                fatalError("Couldn't convert to [String: Any] dictionary")
            }
            return jsonObject
        } catch {
            fatalError("Encoding failed: \(error)")
        }
    }
}
```

これで、任意の`Encodable`型のインスタンスが、この`asDictionary`メソッドを使用して、そのエンティティを`[String: Any]`辞書に変換することができます。これは`Encodable`プロトコルを満たす型なら何でも可能です。

---

## 👤 ユーザー
*2023/07/28 18:29:24*

DictionaryConvertible につける必要ってないのでしょうか？

---

## 🤖 アシスタント
*2023/07/28 18:29:46*

元のコードにおける `DictionaryConvertible` プロトコルの役割が具体的に何であったかによりますが、上記の最新のコードは `Encodable` プロトコルに対する拡張となっています。これにより、すべての `Encodable` に対して `asDictionary(caseFormat:)` メソッドが利用可能になります。

この変更により、`DictionaryConvertible` の依存がなくなり、より広い範囲の型がこの機能を使用できるようになります。しかし、このメソッドを `DictionaryConvertible` プロトコルに適合する型のみに制限したい場合、または `DictionaryConvertible` プロトコルに特別なロジックがある場合には、元のプロトコルの適用が依然として有用であると考えられます。

したがって、`DictionaryConvertible` プロトコルに対して拡張を追加する必要があるかどうかは、あなたのコードベース全体の要件と設計に依存します。

---
