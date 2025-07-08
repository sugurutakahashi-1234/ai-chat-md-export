# SwiftでEnumをCodableに

日付: 2023-09-06

---

## 👤 ユーザー
*2023/09/07 07:51:49*

SwiftのenumをCodable適応してJSON変換する例を教えて欲しい

---

## 🤖 アシスタント
*2023/09/07 07:52:15*

Swiftの`enum`を`Codable`プロトコルに適応して、JSONのエンコードおよびデコードを行う例を以下に示します。

例として、色を示す`enum`を考えてみましょう。

```swift
import Foundation

enum Color: String, Codable {
    case red
    case blue
    case green
}

let color: Color = .red

// JSONへのエンコード
let encoder = JSONEncoder()
if let jsonData = try? encoder.encode(color) {
    if let jsonString = String(data: jsonData, encoding: .utf8) {
        print("JSON String: \(jsonString)")
    }
}

// JSONからのデコード
let jsonString = "\"red\""
if let jsonData = jsonString.data(using: .utf8) {
    let decoder = JSONDecoder()
    if let decodedColor = try? decoder.decode(Color.self, from: jsonData) {
        print("Decoded Color: \(decodedColor)")
    }
}
```

この例では、`Color`という`enum`を`Codable`に準拠させるために、`String`を基底としています。このため、JSONのエンコードとデコードは非常に直感的に行うことができます。

非`String`ベースの`enum`、たとえば`Int`ベースのものや関連値を持つ`enum`を扱う場合、カスタムのエンコーダー/デコーダーを実装することで、より詳細なJSONの変換を行うこともできます。

---

## 👤 ユーザー
*2023/09/07 07:53:50*

Structの中にこのenumと適当な変数をいくつか宣言してJSON変換して欲しい

---

## 🤖 アシスタント
*2023/09/07 07:54:12*

了解しました。以下の例では、`Person`という`struct`の中に`name`, `age`, そして上記の`Color`を示す`favoriteColor`という`enum`変数を持たせて、それをJSON変換します。

```swift
import Foundation

enum Color: String, Codable {
    case red
    case blue
    case green
}

struct Person: Codable {
    var name: String
    var age: Int
    var favoriteColor: Color
}

let person = Person(name: "John", age: 25, favoriteColor: .green)

// PersonをJSONへエンコード
let encoder = JSONEncoder()
if let jsonData = try? encoder.encode(person) {
    if let jsonString = String(data: jsonData, encoding: .utf8) {
        print("JSON String: \(jsonString)")
    }
}

// JSONからPersonへデコード
let jsonString = "{\"name\":\"John\",\"age\":25,\"favoriteColor\":\"green\"}"
if let jsonData = jsonString.data(using: .utf8) {
    let decoder = JSONDecoder()
    if let decodedPerson = try? decoder.decode(Person.self, from: jsonData) {
        print("Decoded Person: \(decodedPerson)")
    }
}
```

上記の例では、`Person`のインスタンスをJSON文字列にエンコードし、その後同じJSON文字列を`Person`インスタンスにデコードしています。

---

## 👤 ユーザー
*2023/09/07 07:55:06*

人間がみやすいように表示できるようにして欲しい

---

## 🤖 アシスタント
*2023/09/07 07:55:35*

了解しました。人間が読みやすい形式でJSONを表示するために、エンコーダーの`outputFormatting`プロパティを使って整形します。

以下の例では、`JSONEncoder`の`outputFormatting`プロパティに`.prettyPrinted`を設定し、人間が読みやすい形式でのJSONの出力を得ます。

```swift
import Foundation

enum Color: String, Codable {
    case red
    case blue
    case green
}

struct Person: Codable {
    var name: String
    var age: Int
    var favoriteColor: Color

    // 人間が読みやすい形式でインスタンスの説明を返します。
    var description: String {
        return """
        Name: \(name)
        Age: \(age)
        Favorite Color: \(favoriteColor.rawValue)
        """
    }
}

let person = Person(name: "John", age: 25, favoriteColor: .green)

// Personを人間が読みやすい形式でJSONへエンコード
let encoder = JSONEncoder()
encoder.outputFormatting = .prettyPrinted
if let jsonData = try? encoder.encode(person) {
    if let jsonString = String(data: jsonData, encoding: .utf8) {
        print("JSON String:\n\(jsonString)")
    }
}

// JSONからPersonへデコード
let jsonString = """
{
    "name": "John",
    "age": 25,
    "favoriteColor": "green"
}
"""
if let jsonData = jsonString.data(using: .utf8) {
    let decoder = JSONDecoder()
    if let decodedPerson = try? decoder.decode(Person.self, from: jsonData) {
        print("\nDecoded Person:\n\(decodedPerson.description)")
    }
}
```

上記のコードは、JSONを整形した形式で出力し、さらに`Person`構造体に`description`というプロパティを追加して、人間が読みやすい形式でインスタンスの内容を表示します。

---

## 👤 ユーザー
*2023/09/07 07:56:05*

これの連想値を持つenumにしてほしい

---

## 🤖 アシスタント
*2023/09/07 07:57:00*

了解しました。連想値を持つ`enum`を扱う場合、カスタムのエンコーディングとデコーディングのロジックが必要になることが多いです。以下の例では、`Color` `enum`を連想値を持つものに変更し、それに伴い`Person`構造体をエンコードおよびデコードする方法を示します。

```swift
import Foundation

enum Color: Codable {
    case rgb(Int, Int, Int)
    case name(String)

    // Codableの適用
    private enum CodingKeys: CodingKey {
        case rgb, name
    }

    private enum RGBKeys: CodingKey {
        case red, green, blue
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        if let rgbContainer = try? container.nestedContainer(keyedBy: RGBKeys.self, forKey: .rgb) {
            let red = try rgbContainer.decode(Int.self, forKey: .red)
            let green = try rgbContainer.decode(Int.self, forKey: .green)
            let blue = try rgbContainer.decode(Int.self, forKey: .blue)
            self = .rgb(red, green, blue)
            return
        }

        if let name = try? container.decode(String.self, forKey: .name) {
            self = .name(name)
            return
        }

        throw DecodingError.dataCorrupted(DecodingError.Context(codingPath: decoder.codingPath, debugDescription: "Color data is not decodable"))
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        switch self {
        case .rgb(let red, let green, let blue):
            var rgbContainer = container.nestedContainer(keyedBy: RGBKeys.self, forKey: .rgb)
            try rgbContainer.encode(red, forKey: .red)
            try rgbContainer.encode(green, forKey: .green)
            try rgbContainer.encode(blue, forKey: .blue)
        case .name(let name):
            try container.encode(name, forKey: .name)
        }
    }
}

struct Person: Codable {
    var name: String
    var age: Int
    var favoriteColor: Color

    var description: String {
        return """
        Name: \(name)
        Age: \(age)
        Favorite Color: \(favoriteColor)
        """
    }
}

let person = Person(name: "John", age: 25, favoriteColor: .rgb(255, 0, 0))

// Personを人間が読みやすい形式でJSONへエンコード
let encoder = JSONEncoder()
encoder.outputFormatting = .prettyPrinted
if let jsonData = try? encoder.encode(person) {
    if let jsonString = String(data: jsonData, encoding: .utf8) {
        print("JSON String:\n\(jsonString)")
    }
}

// JSONからPersonへデコード
let jsonString = """
{
    "name": "John",
    "age": 25,
    "favoriteColor": {
        "rgb": {
            "red": 255,
            "green": 0,
            "blue": 0
        }
    }
}
"""
if let jsonData = jsonString.data(using: .utf8) {
    let decoder = JSONDecoder()
    if let decodedPerson = try? decoder.decode(Person.self, from: jsonData) {
        print("\nDecoded Person:\n\(decodedPerson.description)")
    }
}
```

この例では、`Color` enumに連想値を持つ`rgb`および`name`ケースを追加しました。それに対応して、エンコーディングおよびデコーディングの方法もカスタマイズしています。

---

## 👤 ユーザー
*2023/09/07 07:58:19*

nameとrgbの2つのパターンを出して欲しい

---

## 🤖 アシスタント
*2023/09/07 07:59:28*

わかりました。`name`と`rgb`の2つのパターンで`Person`のインスタンスを作成し、それをエンコードおよびデコードします。

以下はその実装です：

```swift
import Foundation

enum Color: Codable {
    case rgb(Int, Int, Int)
    case name(String)

    // Codableの適用
    private enum CodingKeys: CodingKey {
        case rgb, name
    }

    private enum RGBKeys: CodingKey {
        case red, green, blue
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        if let rgbContainer = try? container.nestedContainer(keyedBy: RGBKeys.self, forKey: .rgb) {
            let red = try rgbContainer.decode(Int.self, forKey: .red)
            let green = try rgbContainer.decode(Int.self, forKey: .green)
            let blue = try rgbContainer.decode(Int.self, forKey: .blue)
            self = .rgb(red, green, blue)
            return
        }

        if let name = try? container.decode(String.self, forKey: .name) {
            self = .name(name)
            return
        }

        throw DecodingError.dataCorrupted(DecodingError.Context(codingPath: decoder.codingPath, debugDescription: "Color data is not decodable"))
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        switch self {
        case .rgb(let red, let green, let blue):
            var rgbContainer = container.nestedContainer(keyedBy: RGBKeys.self, forKey: .rgb)
            try rgbContainer.encode(red, forKey: .red)
            try rgbContainer.encode(green, forKey: .green)
            try rgbContainer.encode(blue, forKey: .blue)
        case .name(let name):
            try container.encode(name, forKey: .name)
        }
    }
}

struct Person: Codable {
    var name: String
    var age: Int
    var favoriteColor: Color

    var description: String {
        return """
        Name: \(name)
        Age: \(age)
        Favorite Color: \(favoriteColor)
        """
    }
}

// RGBパターンのPerson
let personRGB = Person(name: "John", age: 25, favoriteColor: .rgb(255, 0, 0))

let encoder = JSONEncoder()
encoder.outputFormatting = .prettyPrinted

if let jsonData = try? encoder.encode(personRGB) {
    if let jsonString = String(data: jsonData, encoding: .utf8) {
        print("RGB Pattern JSON String:\n\(jsonString)")
    }
}

// NameパターンのPerson
let personName = Person(name: "Jane", age: 28, favoriteColor: .name("Red"))

if let jsonData = try? encoder.encode(personName) {
    if let jsonString = String(data: jsonData, encoding: .utf8) {
        print("\nName Pattern JSON String:\n\(jsonString)")
    }
}

// JSONからPersonへデコードする例
let jsonStringRGB = """
{
    "name": "John",
    "age": 25,
    "favoriteColor": {
        "rgb": {
            "red": 255,
            "green": 0,
            "blue": 0
        }
    }
}
"""

let jsonStringName = """
{
    "name": "Jane",
    "age": 28,
    "favoriteColor": {
        "name": "Red"
    }
}
"""

let decoder = JSONDecoder()

if let jsonDataRGB = jsonStringRGB.data(using: .utf8) {
    if let decodedPerson = try? decoder.decode(Person.self, from: jsonDataRGB) {
        print("\nDecoded RGB Pattern Person:\n\(decodedPerson.description)")
    }
}

if let jsonDataName = jsonStringName.data(using: .utf8) {
    if let decodedPerson = try? decoder.decode(Person.self, from: jsonDataName) {
        print("\nDecoded Name Pattern Person:\n\(decodedPerson.description)")
    }
}
```

この実装では、まず`rgb`パターンでの`Person`インスタンスをエンコードし、次に`name`パターンでの`Person`インスタンスをエンコードしています。そして、それぞれのJSON文字列をデコードしています。

---

## 👤 ユーザー
*2023/09/07 08:25:16*

同じ感じで、構文木の連想値を持つenumでもやってほしい。

---

## 🤖 アシスタント
*2023/09/07 08:26:01*

構文木を模倣する`enum`を作成し、それをエンコードおよびデコードする例を示します。以下の例では、簡単な算術式の構文木を表現する`Expression`という`enum`を作成します。

```swift
import Foundation

enum Expression: Codable {
    case number(Int)
    case add(Expression, Expression)
    case subtract(Expression, Expression)

    // Codableの適用
    private enum CodingKeys: String, CodingKey {
        case number, add, subtract
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        
        if let num = try? container.decode(Int.self, forKey: .number) {
            self = .number(num)
            return
        }
        
        if let expressions = try? container.decode([Expression].self, forKey: .add), expressions.count == 2 {
            self = .add(expressions[0], expressions[1])
            return
        }
        
        if let expressions = try? container.decode([Expression].self, forKey: .subtract), expressions.count == 2 {
            self = .subtract(expressions[0], expressions[1])
            return
        }

        throw DecodingError.dataCorrupted(DecodingError.Context(codingPath: decoder.codingPath, debugDescription: "Expression data is not decodable"))
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        switch self {
        case .number(let num):
            try container.encode(num, forKey: .number)
        case .add(let lhs, let rhs):
            try container.encode([lhs, rhs], forKey: .add)
        case .subtract(let lhs, let rhs):
            try container.encode([lhs, rhs], forKey: .subtract)
        }
    }
}

let expression = Expression.add(.number(5), .subtract(.number(3), .number(2)))

let encoder = JSONEncoder()
encoder.outputFormatting = .prettyPrinted

if let jsonData = try? encoder.encode(expression) {
    if let jsonString = String(data: jsonData, encoding: .utf8) {
        print("Expression JSON String:\n\(jsonString)")
    }
}

let jsonString = """
{
    "add": [
        {
            "number": 5
        },
        {
            "subtract": [
                {
                    "number": 3
                },
                {
                    "number": 2
                }
            ]
        }
    ]
}
"""

let decoder = JSONDecoder()
if let jsonData = jsonString.data(using: .utf8) {
    if let decodedExpression = try? decoder.decode(Expression.self, from: jsonData) {
        print("Decoded Expression: \(decodedExpression)")
    }
}
```

上記の実装では、`Expression`という`enum`で簡単な算術式の構文木を表現しています。具体的には、数値、加算、減算の3つのケースがあります。それをエンコードしてデコードする方法も含めて実装しています。

---

## 👤 ユーザー
*2023/09/07 08:26:54*

Expression を保持する適当なStructを定義して欲しい。

---

## 🤖 アシスタント
*2023/09/07 08:27:39*

了解しました。以下に、`Expression`を保持する`Equation`という構造体を定義し、それをエンコードおよびデコードする例を示します。

```swift
import Foundation

enum Expression: Codable {
    case number(Int)
    case add(Expression, Expression)
    case subtract(Expression, Expression)

    // Codableの適用
    private enum CodingKeys: String, CodingKey {
        case number, add, subtract
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        
        if let num = try? container.decode(Int.self, forKey: .number) {
            self = .number(num)
            return
        }
        
        if let expressions = try? container.decode([Expression].self, forKey: .add), expressions.count == 2 {
            self = .add(expressions[0], expressions[1])
            return
        }
        
        if let expressions = try? container.decode([Expression].self, forKey: .subtract), expressions.count == 2 {
            self = .subtract(expressions[0], expressions[1])
            return
        }

        throw DecodingError.dataCorrupted(DecodingError.Context(codingPath: decoder.codingPath, debugDescription: "Expression data is not decodable"))
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        switch self {
        case .number(let num):
            try container.encode(num, forKey: .number)
        case .add(let lhs, let rhs):
            try container.encode([lhs, rhs], forKey: .add)
        case .subtract(let lhs, let rhs):
            try container.encode([lhs, rhs], forKey: .subtract)
        }
    }
}

struct Equation: Codable {
    var description: String
    var expression: Expression
}

let equation = Equation(description: "Simple arithmetic", expression: .add(.number(5), .subtract(.number(3), .number(2))))

let encoder = JSONEncoder()
encoder.outputFormatting = .prettyPrinted

if let jsonData = try? encoder.encode(equation) {
    if let jsonString = String(data: jsonData, encoding: .utf8) {
        print("Equation JSON String:\n\(jsonString)")
    }
}

let jsonString = """
{
    "description": "Simple arithmetic",
    "expression": {
        "add": [
            {
                "number": 5
            },
            {
                "subtract": [
                    {
                        "number": 3
                    },
                    {
                        "number": 2
                    }
                ]
            }
        ]
    }
}
"""

let decoder = JSONDecoder()
if let jsonData = jsonString.data(using: .utf8) {
    if let decodedEquation = try? decoder.decode(Equation.self, from: jsonData) {
        print("\nDecoded Equation: \(decodedEquation.description) -> \(decodedEquation.expression)")
    }
}
```

この例では、`Equation`という構造体を定義し、その中に説明(`description`)と`Expression`を持つようにしています。その後、`Equation`インスタンスをエンコードし、JSON文字列からデコードしています。

---

## 👤 ユーザー
*2023/09/07 08:28:58*

Equationの中からnumberの値の配列を取得する処理を記述してほしい。

---

## 🤖 アシスタント
*2023/09/07 08:29:25*

了解しました。以下に、`Equation`の中の`Expression`から`number`の値を抽出して配列として取得するメソッドを示します。

まず、`Expression` enumに再帰的に数値を取得するメソッドを追加し、それを`Equation`のメソッドから呼び出すようにします。

```swift
extension Expression {
    func extractNumbers() -> [Int] {
        switch self {
        case .number(let num):
            return [num]
        case .add(let lhs, let rhs):
            return lhs.extractNumbers() + rhs.extractNumbers()
        case .subtract(let lhs, let rhs):
            return lhs.extractNumbers() + rhs.extractNumbers()
        }
    }
}

extension Equation {
    func extractNumbers() -> [Int] {
        return expression.extractNumbers()
    }
}

// 使用例:
let equation = Equation(description: "Simple arithmetic", expression: .add(.number(5), .subtract(.number(3), .number(2))))
let numbers = equation.extractNumbers()
print(numbers) // 出力: [5, 3, 2]
```

この例では、`Expression` enumに`extractNumbers`というメソッドを追加しています。このメソッドは、`Expression`の中に存在するすべての`number`値を配列として返します。`Equation`にも同名のメソッドを追加し、`Expression`のメソッドを呼び出して結果を返します。

---

## 👤 ユーザー
*2023/09/07 08:29:39*

ごめん足したりする前の値がほしいんだ。

---

## 🤖 アシスタント
*2023/09/07 08:30:02*

了解しました。加算や減算の操作前の`number`値のみを取得するためのメソッドを示します。

`Expression` enumに直接的に`number`として格納されている値のみを抽出する関数を追加します。

```swift
extension Expression {
    func extractDirectNumbers() -> [Int] {
        switch self {
        case .number(let num):
            return [num]
        case .add(_, _), .subtract(_, _):
            return []
        }
    }
}

extension Equation {
    func extractDirectNumbers() -> [Int] {
        return expression.extractDirectNumbers()
    }
}

// 使用例:
let equation1 = Equation(description: "Simple number", expression: .number(5))
let numbers1 = equation1.extractDirectNumbers()
print(numbers1) // 出力: [5]

let equation2 = Equation(description: "Simple arithmetic", expression: .add(.number(5), .subtract(.number(3), .number(2))))
let numbers2 = equation2.extractDirectNumbers()
print(numbers2) // 出力: []
```

この例では、`extractDirectNumbers`というメソッドを`Expression`と`Equation`に追加しています。このメソッドは、直接的に`number`として格納されている値のみを返します。したがって、加算や減算の操作を含む式からは空の配列が返されます。

---

## 👤 ユーザー
*2023/09/07 08:31:14*

2つ目の例では[5, 3, 2]となるような配列になってほしいんだ。

---

## 🤖 アシスタント
*2023/09/07 08:31:36*

理解しました。`Expression` enum から直接及び間接的に保持されている `number` 値すべてを取得するように関数を修正します。

以下の実装では、`Expression` enum の中にあるすべての `number` 値を抽出します:

```swift
extension Expression {
    func extractAllNumbers() -> [Int] {
        switch self {
        case .number(let num):
            return [num]
        case .add(let lhs, let rhs):
            return lhs.extractAllNumbers() + rhs.extractAllNumbers()
        case .subtract(let lhs, let rhs):
            return lhs.extractAllNumbers() + rhs.extractAllNumbers()
        }
    }
}

extension Equation {
    func extractAllNumbers() -> [Int] {
        return expression.extractAllNumbers()
    }
}

// 使用例:
let equation = Equation(description: "Simple arithmetic", expression: .add(.number(5), .subtract(.number(3), .number(2))))
let numbers = equation.extractAllNumbers()
print(numbers) // 出力: [5, 3, 2]
```

この`extractAllNumbers`メソッドは、与えられた式からすべての`number`値を再帰的に抽出します。

---

## 👤 ユーザー
*2023/09/07 08:32:32*

このEquationをSwiftUIのViewを使ってうまく表現して欲しい

---

## 🤖 アシスタント
*2023/09/07 08:33:07*

了解しました。以下は、`Equation`と`Expression`を表示するためのSwiftUIのビューコンポーネントの例です。この例では、再帰的に式をビューとして表示し、各部分式を適切にレンダリングします。

```swift
import SwiftUI

struct ExpressionView: View {
    let expression: Expression
    
    var body: some View {
        switch expression {
        case .number(let num):
            return Text("\(num)").padding().border(Color.black, width: 1)
        case .add(let lhs, let rhs):
            VStack(spacing: 0) {
                ExpressionView(expression: lhs)
                Divider().background(Color.black)
                ExpressionView(expression: rhs)
            }
            .padding()
            .border(Color.blue, width: 2)
        case .subtract(let lhs, let rhs):
            VStack(spacing: 0) {
                ExpressionView(expression: lhs)
                Divider().background(Color.red)
                ExpressionView(expression: rhs)
            }
            .padding()
            .border(Color.red, width: 2)
        }
    }
}

struct EquationView: View {
    let equation: Equation
    
    var body: some View {
        VStack(alignment: .leading) {
            Text(equation.description).font(.title2)
            ExpressionView(expression: equation.expression)
        }
        .padding()
    }
}

struct ContentView: View {
    var body: some View {
        EquationView(equation: Equation(description: "Simple arithmetic", expression: .add(.number(5), .subtract(.number(3), .number(2)))))
    }
}

@main
struct YourApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

この例では:

- `ExpressionView`: 式の各部分を再帰的に表示するビューです。数値は黒のボーダーで囲まれ、加算式は青のボーダーで囲まれ、減算式は赤のボーダーで囲まれます。
- `EquationView`: 式の説明と式自体を表示するビューです。
- `ContentView`: サンプルの式を表示するメインのビューです。

上記のコードをSwiftUIのプロジェクトに追加して実行すると、式の構造が視覚的に表示されます。

---
