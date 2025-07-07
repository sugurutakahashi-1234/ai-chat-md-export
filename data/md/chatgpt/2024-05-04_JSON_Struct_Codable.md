# JSON Struct Codable

日付: 2024-05-04

---

## 👤 ユーザー
*2024/5/4 12:39:12*

SwiftのCodableについて教えてほしい

jsonをstructに変換するコードを書いてほしい

---

## 🤖 アシスタント
*2024/5/4 12:39:49*

Swiftの`Codable`は、データをモデルオブジェクトとJSONの間でエンコードおよびデコードするためのプロトコルです。これにより、JSONデータを簡単にパースしてSwiftの構造体やクラスにマッピングすることができます。ここでは、JSONデータを`struct`にデコードする基本的な例を示します。

例えば、以下のようなJSONがあるとします。

```json
{
  "name": "John Doe",
  "age": 30,
  "isStudent": false
}
```

このJSONをSwiftの`struct`にマッピングするには、まず`Codable`プロトコルに準拠した`struct`を定義します。

```swift
import Foundation

// 定義する構造体
struct Person: Codable {
    var name: String
    var age: Int
    var isStudent: Bool
}
```

次に、この構造体を使用してJSON文字列をデコードする方法です。

```swift
import Foundation

// JSON文字列
let jsonString = """
{
  "name": "John Doe",
  "age": 30,
  "isStudent": false
}
"""

// JSONデータをデコードする関数
func decodeJson() {
    guard let jsonData = jsonString.data(using: .utf8) else {
        print("Error: Cannot create JSON Data from string")
        return
    }

    do {
        // デコーダーを使ってデコードする
        let decoder = JSONDecoder()
        let person = try decoder.decode(Person.self, from: jsonData)
        print("Name: \(person.name), Age: \(person.age), Is Student: \(person.isStudent)")
    } catch {
        print("Error: \(error.localizedDescription)")
    }
}

// 関数を実行
decodeJson()
```

このコードは、`jsonString`から`Person`型のインスタンスを作成し、そのプロパティを出力します。エラーハンドリングも含めており、何か問題が発生した場合にはエラーメッセージが出力されます。

---

## 👤 ユーザー
*2024/5/4 12:40:05*

もしjson側に新しい項目が増えたときはどのような挙動になるのか？

---

## 🤖 アシスタント
*2024/5/4 12:40:41*

Swiftの`Codable`プロトコルを使用している場合、JSONに新しい項目が追加されても、その項目がSwiftの構造体に定義されていない限り、基本的には影響を受けません。つまり、デコード処理は正常に行われ、新しい項目は無視されます。

例として、次のような新しい項目を含むJSONがあるとします。

```json
{
  "name": "John Doe",
  "age": 30,
  "isStudent": false,
  "email": "john@example.com"
}
```

もし`Person`構造体が以下のように定義されている場合、

```swift
struct Person: Codable {
    var name: String
    var age: Int
    var isStudent: Bool
}
```

この時、`email`は`Person`構造体に定義されていませんので、デコード過程でこの`email`項目は単純に無視されます。デコード処理は`name`、`age`、`isStudent`のみを対象として行われ、`Person`オブジェクトは正常に生成されます。

ただし、もし構造体で`CodingKeys`を使用していて、すべてのキーを列挙している場合には、JSON内の全てのキーが列挙されていなければならないため、新しいキーが現れるとエラーが発生する可能性があります。この問題を避けるためには、構造体で明示的に列挙しているキー以外を無視する設定をデコーダーに行う必要があります。

```swift
let decoder = JSONDecoder()
decoder.keyDecodingStrategy = .convertFromSnakeCase // または他の適切な設定
let person = try decoder.decode(Person.self, from: jsonData)
```

このように、`Codable`は柔軟で、JSONデータとSwiftのデータモデル間の相違点をうまく処理できるよう設計されています。

---

## 👤 ユーザー
*2024/5/4 12:40:52*

逆に足りない場合はどうなるのか？

---

## 🤖 アシスタント
*2024/5/4 12:41:24*

Swiftの`Codable`プロトコルを使用している場合、JSONデータから必要な情報が欠けていると、デコード処理中にエラーが発生します。これは、Swiftの型の全てのプロパティがデコード中に必要とされるためです。

たとえば、先ほどの`Person`構造体を考えます。

```swift
struct Person: Codable {
    var name: String
    var age: Int
    var isStudent: Bool
}
```

この構造体で、以下のように`name`プロパティが欠けているJSONをデコードしようとすると、エラーが発生します。

```json
{
  "age": 30,
  "isStudent": false
}
```

この場合、`name`が不足しているため、`JSONDecoder`の`decode(_:from:)`メソッドは`DecodingError.keyNotFound`エラーをスローします。このエラーは通常、デコード対象のキーが見つからない場合に発生します。

もしJSONからのデータがオプショナルである可能性がある場合、つまり、データが存在しない場合も考慮する必要がある場合は、プロパティをオプショナル型として宣言することで対応できます。例えば、`name`が必ずしもJSONデータに存在しないとは限らない場合、以下のように定義できます。

```swift
struct Person: Codable {
    var name: String?
    var age: Int
    var isStudent: Bool
}
```

この場合、`name`がJSONデータに含まれていなくても、デコード処理はエラーを発生させずに進行し、`name`の値は`nil`になります。これにより、欠けているデータを柔軟に扱うことができます。

---
