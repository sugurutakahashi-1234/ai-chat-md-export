# Swift Struct String Conversion

Date: 2024-05-29

---

## 👤 User
*2024-05-29 13:42:31*

swift の struct を文字列でコピーするコードを書きたい。見やすくするためにはどうすればいいか？

struct Address {
    var city: [String]
    var postalCode: [Int]
    var cityType: CityType
}

struct Person {
    var name: String
    var age: Int
    var isEmployed: Bool
    var address: [Address]
}

---

## 🤖 Assistant
*2024-05-29 13:42:46*

`Swift` の `struct` を文字列でコピーするためには、`CustomStringConvertible` プロトコルを採用して、見やすい文字列表現を提供することができます。以下は `Address` と `Person` 構造体に対する実装例です：

```swift
import Foundation

enum CityType: String, CustomStringConvertible {
    case metropolitan = "Metropolitan"
    case rural = "Rural"
    
    var description: String {
        return self.rawValue
    }
}

struct Address: CustomStringConvertible {
    var city: [String]
    var postalCode: [Int]
    var cityType: CityType
    
    var description: String {
        return """
        Address:
        - Cities: \(city.joined(separator: ", "))
        - Postal Codes: \(postalCode.map(String.init).joined(separator: ", "))
        - City Type: \(cityType)
        """
    }
}

struct Person: CustomStringConvertible {
    var name: String
    var age: Int
    var isEmployed: Bool
    var address: [Address]
    
    var description: String {
        let addressDescriptions = address.map { $0.description }.joined(separator: "\n")
        return """
        Person:
        - Name: \(name)
        - Age: \(age)
        - Employed: \(isEmployed ? "Yes" : "No")
        - Address:
        \(addressDescriptions)
        """
    }
}

// Example usage
let address1 = Address(city: ["Tokyo"], postalCode: [1234567], cityType: .metropolitan)
let address2 = Address(city: ["Osaka"], postalCode: [7654321], cityType: .rural)
let person = Person(name: "John Doe", age: 30, isEmployed: true, address: [address1, address2])

print(person)
```

このコードでは、`CustomStringConvertible` プロトコルを使用して各構造体の `description` プロパティを定義し、構造体のプロパティを見やすい文字列表現に変換しています。 `description` プロパティは、`print` 関数を使用したときに呼び出されるので、これを利用して構造体の内容を簡単に確認できます。

---

## 👤 User
*2024-05-29 13:43:09*

たとえばCodableに準拠すれば見やすくできないか？

---

## 🤖 Assistant
*2024-05-29 13:43:24*

`Codable` に準拠することで、構造体を簡単にエンコードおよびデコードすることができます。これを活用して、`JSONEncoder` を使用して見やすい JSON 形式で構造体を文字列に変換することができます。以下はその方法です：

```swift
import Foundation

enum CityType: String, Codable {
    case metropolitan = "Metropolitan"
    case rural = "Rural"
}

struct Address: Codable {
    var city: [String]
    var postalCode: [Int]
    var cityType: CityType
}

struct Person: Codable {
    var name: String
    var age: Int
    var isEmployed: Bool
    var address: [Address]
}

// Example usage
let address1 = Address(city: ["Tokyo"], postalCode: [1234567], cityType: .metropolitan)
let address2 = Address(city: ["Osaka"], postalCode: [7654321], cityType: .rural)
let person = Person(name: "John Doe", age: 30, isEmployed: true, address: [address1, address2])

// Encode to JSON
let encoder = JSONEncoder()
encoder.outputFormatting = .prettyPrinted

if let jsonData = try? encoder.encode(person),
   let jsonString = String(data: jsonData, encoding: .utf8) {
    print(jsonString)
}
```

このコードでは、`Person` および `Address` 構造体が `Codable` プロトコルに準拠しています。次に、`JSONEncoder` を使用してこれらの構造体を JSON 形式にエンコードし、`prettyPrinted` オプションを設定して見やすいインデント付きの JSON 文字列を生成しています。

出力例は次のようになります：

```json
{
  "name" : "John Doe",
  "age" : 30,
  "isEmployed" : true,
  "address" : [
    {
      "city" : [
        "Tokyo"
      ],
      "postalCode" : [
        1234567
      ],
      "cityType" : "Metropolitan"
    },
    {
      "city" : [
        "Osaka"
      ],
      "postalCode" : [
        7654321
      ],
      "cityType" : "Rural"
    }
  ]
}
```

この方法により、構造体の内容を見やすい JSON 形式で出力できます。

---

## 👤 User
*2024-05-29 13:48:08*

インデントを4にしてほしい。

{
  "website" : "hildegard.org",
  "email" : "Sincere@april.biz",
  "username" : "Bret",
  "name" : "Leanne Graham",
  "address" : {
    "city" : "Gwenborough",
    "street" : "Kulas Light",
    "suite" : "Apt. 556",
    "zipcode" : "92998-3874",
    "geo" : {
      "lat" : "-37.3159",
      "lng" : "81.1496"
    }
  },
  "company" : {
    "catchPhrase" : "Multi-layered client-server neural-net",
    "name" : "Romaguera-Crona",
    "bs" : "harness real-time e-markets"
  },
  "id" : 1,
  "phone" : "1-770-736-8031 x56442"
}

---

## 🤖 Assistant
*2024-05-29 13:48:24*

Swift では、`JSONEncoder` にインデントレベルを直接設定するオプションはありませんが、 `outputFormatting` プロパティを `prettyPrinted` に設定するとデフォルトでスペース 2 つでインデントされた JSON を生成します。ただし、カスタムインデントレベル（例：4スペース）を実現するために、次のようなカスタムエンコーダを作成することができます：

```swift
import Foundation

enum CityType: String, Codable {
    case metropolitan = "Metropolitan"
    case rural = "Rural"
}

struct Address: Codable {
    var city: [String]
    var postalCode: [Int]
    var cityType: CityType
}

struct Person: Codable {
    var name: String
    var age: Int
    var isEmployed: Bool
    var address: [Address]
}

// Function to encode with custom indentation
func encodeWithCustomIndentation<T: Codable>(_ value: T, indent: Int) -> String? {
    let encoder = JSONEncoder()
    encoder.outputFormatting = .prettyPrinted
    
    guard let jsonData = try? encoder.encode(value),
          var jsonString = String(data: jsonData, encoding: .utf8) else {
        return nil
    }
    
    let indentation = String(repeating: " ", count: indent)
    let pattern = "^(\\s*)([\\[{])"
    let regex = try! NSRegularExpression(pattern: pattern, options: [.anchorsMatchLines])
    
    jsonString = regex.stringByReplacingMatches(in: jsonString, options: [], range: NSRange(location: 0, length: jsonString.utf16.count), withTemplate: "$1\(indentation)$2")
    
    return jsonString
}

// Example usage
let address1 = Address(city: ["Tokyo"], postalCode: [1234567], cityType: .metropolitan)
let address2 = Address(city: ["Osaka"], postalCode: [7654321], cityType: .rural)
let person = Person(name: "John Doe", age: 30, isEmployed: true, address: [address1, address2])

if let jsonString = encodeWithCustomIndentation(person, indent: 4) {
    print(jsonString)
}
```

このコードでは、`encodeWithCustomIndentation` 関数を使用して、指定したインデントレベルで JSON をエンコードします。正規表現を使用して、生成された JSON 文字列のインデントをカスタマイズしています。この方法により、任意のスペース数でインデントされた JSON を生成できます。

---

## 👤 User
*2024-05-29 13:49:26*

以下の処理をUIPasteboard.general.stringへの代入を一箇所まとめてほしい

Button {
                            UIPasteboard.general.string = "\(object)"
                            
                            if let encodableObject = object as? Encodable {
                                let encoder = JSONEncoder()
                                encoder.outputFormatting = .prettyPrinted
                                
                                if let jsonData = try? encoder.encode(encodableObject) {
                                    let jsonString = String(data: jsonData, encoding: .utf8)
                                    UIPasteboard.general.string = jsonString
                                }
                            }
                        }

---

## 🤖 Assistant
*2024-05-29 13:49:39*

以下のように処理をまとめて、`UIPasteboard.general.string` への代入を一箇所にすることができます：

```swift
import SwiftUI

struct ContentView: View {
    var object: Any // Replace with the actual type of your object

    var body: some View {
        Button(action: {
            copyToPasteboard(object: object)
        }) {
            Text("Copy")
        }
    }

    func copyToPasteboard(object: Any) {
        var pasteboardString: String?

        // Try to encode the object if it conforms to Encodable
        if let encodableObject = object as? Encodable {
            let encoder = JSONEncoder()
            encoder.outputFormatting = .prettyPrinted
            
            if let jsonData = try? encoder.encode(encodableObject) {
                pasteboardString = String(data: jsonData, encoding: .utf8)
            }
        }
        
        // Fallback to the object's description if encoding fails or object is not Encodable
        if pasteboardString == nil {
            pasteboardString = "\(object)"
        }
        
        // Set the string to UIPasteboard
        UIPasteboard.general.string = pasteboardString
    }
}

// Example usage in a SwiftUI app
struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView(object: "Example Object") // Replace with the actual object
    }
}
```

このコードでは、`copyToPasteboard` 関数を定義し、その中で`UIPasteboard.general.string`への代入を一箇所にまとめています。まず、オブジェクトが`Encodable`に準拠している場合はJSON形式にエンコードし、それが失敗した場合やオブジェクトが`Encodable`に準拠していない場合はオブジェクトの文字列表現を使用します。最終的に、得られた文字列を`UIPasteboard.general.string`に設定します。

---

## 👤 User
*2024-05-29 13:50:05*

オプショナルを使わないでほしい

---

## 🤖 Assistant
*2024-05-29 13:50:16*

オプショナルを使わずに `UIPasteboard.general.string` への代入を一箇所にまとめるコードは次のようになります：

```swift
import SwiftUI

struct ContentView: View {
    var object: Any // Replace with the actual type of your object

    var body: some View {
        Button(action: {
            copyToPasteboard(object: object)
        }) {
            Text("Copy")
        }
    }

    func copyToPasteboard(object: Any) {
        var pasteboardString: String = "\(object)"
        
        // Try to encode the object if it conforms to Encodable
        if let encodableObject = object as? Encodable {
            let encoder = JSONEncoder()
            encoder.outputFormatting = .prettyPrinted
            
            if let jsonData = try? encoder.encode(encodableObject),
               let jsonString = String(data: jsonData, encoding: .utf8) {
                pasteboardString = jsonString
            }
        }
        
        // Set the string to UIPasteboard
        UIPasteboard.general.string = pasteboardString
    }
}

// Example usage in a SwiftUI app
struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView(object: "Example Object") // Replace with the actual object
    }
}
```

このコードでは、まずオブジェクトを文字列に変換して `pasteboardString` に代入し、その後、オブジェクトが `Encodable` に準拠している場合は JSON 形式にエンコードして `pasteboardString` を更新します。最終的に、得られた文字列を `UIPasteboard.general.string` に設定します。オプショナルを使用せずに処理を一箇所にまとめています。

---

## 👤 User
*2024-05-29 13:50:39*

guardを使うともっとスマートに書けないか？

---

## 🤖 Assistant
*2024-05-29 13:50:49*

`guard` を使用してさらにスマートに書くことができます。以下はその実装例です：

```swift
import SwiftUI

struct ContentView: View {
    var object: Any // Replace with the actual type of your object

    var body: some View {
        Button(action: {
            copyToPasteboard(object: object)
        }) {
            Text("Copy")
        }
    }

    func copyToPasteboard(object: Any) {
        // Initialize pasteboardString with the default description
        var pasteboardString = "\(object)"
        
        // Attempt to encode the object if it conforms to Encodable
        if let encodableObject = object as? Encodable {
            let encoder = JSONEncoder()
            encoder.outputFormatting = .prettyPrinted
            
            guard let jsonData = try? encoder.encode(encodableObject),
                  let jsonString = String(data: jsonData, encoding: .utf8) else {
                // If encoding fails, use the default description
                UIPasteboard.general.string = pasteboardString
                return
            }
            
            // Update pasteboardString with the JSON string
            pasteboardString = jsonString
        }
        
        // Set the string to UIPasteboard
        UIPasteboard.general.string = pasteboardString
    }
}

// Example usage in a SwiftUI app
struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView(object: "Example Object") // Replace with the actual object
    }
}
```

このコードでは、`guard` を使用して JSON エンコードが成功したかどうかをチェックし、失敗した場合は早期にリターンします。エンコードが成功した場合にのみ `pasteboardString` を JSON 文字列で更新します。これにより、コードがよりシンプルで読みやすくなります。

---

## 👤 User
*2024-05-29 13:52:19*

早期リターンでネストを浅くできないか？

UIPasteboard.general.string = {
                                if let encodableObject = object as? Encodable {
                                    let encoder = JSONEncoder()
                                    encoder.outputFormatting = .prettyPrinted
                                    
                                    if let jsonData = try? encoder.encode(encodableObject) {
                                        let jsonString = String(data: jsonData, encoding: .utf8)
                                        return jsonString
                                    } else {
                                        return"\(object)"
                                    }
                                } else {
                                    return"\(object)"
                                }
                            }()

---

## 🤖 Assistant
*2024-05-29 13:52:27*

早期リターンを使用してネストを浅くする方法は以下の通りです：

```swift
import SwiftUI

struct ContentView: View {
    var object: Any // Replace with the actual type of your object

    var body: some View {
        Button(action: {
            copyToPasteboard(object: object)
        }) {
            Text("Copy")
        }
    }

    func copyToPasteboard(object: Any) {
        UIPasteboard.general.string = {
            guard let encodableObject = object as? Encodable else {
                return "\(object)"
            }
            let encoder = JSONEncoder()
            encoder.outputFormatting = .prettyPrinted
            
            guard let jsonData = try? encoder.encode(encodableObject),
                  let jsonString = String(data: jsonData, encoding: .utf8) else {
                return "\(object)"
            }
            return jsonString
        }()
    }
}

// Example usage in a SwiftUI app
struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView(object: "Example Object") // Replace with the actual object
    }
}
```

このコードでは、`guard` 文を使用して早期リターンを行うことでネストを浅くし、`UIPasteboard.general.string` への代入を一箇所にまとめています。これにより、可読性が向上し、コードがシンプルになります。

---
