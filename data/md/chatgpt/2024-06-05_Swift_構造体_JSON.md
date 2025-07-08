# Swift 構造体 JSON

日付: 2024-06-05

---

## 👤 ユーザー
*2024/06/05 15:43:13*

Swiftのstructをjsonを見て定義してほしい

import Foundation

public struct User {}

public struct Address {}

public struct Company {}

public struct Geo {}

[
  {
    "id": 0,
    "name": "string",
    "username": "string",
    "email": "string",
    "address": {
      "street": "string",
      "suite": "string",
      "city": "string",
      "zipcode": "string",
      "geo": {
        "lat": "string",
        "lng": "string"
      }
    },
    "phone": "string",
    "website": "string",
    "company": {
      "name": "string",
      "catchPhrase": "string",
      "bs": "string"
    }
  }
]

---

## 🤖 アシスタント
*2024/06/05 15:43:22*

以下は、提供されたJSONに基づいて定義されたSwiftのstructです。

```swift
import Foundation

public struct User: Codable {
    public let id: Int
    public let name: String
    public let username: String
    public let email: String
    public let address: Address
    public let phone: String
    public let website: String
    public let company: Company
}

public struct Address: Codable {
    public let street: String
    public let suite: String
    public let city: String
    public let zipcode: String
    public let geo: Geo
}

public struct Company: Codable {
    public let name: String
    public let catchPhrase: String
    public let bs: String
}

public struct Geo: Codable {
    public let lat: String
    public let lng: String
}
```

これにより、`User`、`Address`、`Company`、`Geo`の各構造体が、提供されたJSONデータと適切にマッピングされます。また、各構造体が`Codable`プロトコルに準拠しているため、JSONのエンコードとデコードが簡単に行えます。

---

## 👤 ユーザー
*2024/06/05 15:46:57*

以下を埋めてほしい

extension DomainLayer.User {
    init(from openAPIUser: Components.Schemas.User) {
        self.init(id: openAPIUser.id, name: &lt;#T##String#&gt;, username: &lt;#T##String#&gt;, email: &lt;#T##String#&gt;, address: .init(street: &lt;#T##String#&gt;, suite: &lt;#T##String#&gt;, city: &lt;#T##String#&gt;, zipcode: &lt;#T##String#&gt;, geo: .init(lat: &lt;#T##String#&gt;, lng: &lt;#T##String#&gt;)), phone: &lt;#T##String#&gt;, website: &lt;#T##String#&gt;, company: .init(name: &lt;#T##String#&gt;, catchPhrase: &lt;#T##String#&gt;, bs: &lt;#T##String#&gt;))
    }
}

---

## 🤖 アシスタント
*2024/06/05 15:47:05*

以下は、`DomainLayer.User`の`init(from openAPIUser: Components.Schemas.User)`の実装例です。

```swift
extension DomainLayer.User {
    init(from openAPIUser: Components.Schemas.User) {
        self.init(
            id: openAPIUser.id,
            name: openAPIUser.name,
            username: openAPIUser.username,
            email: openAPIUser.email,
            address: .init(
                street: openAPIUser.address.street,
                suite: openAPIUser.address.suite,
                city: openAPIUser.address.city,
                zipcode: openAPIUser.address.zipcode,
                geo: .init(
                    lat: openAPIUser.address.geo.lat,
                    lng: openAPIUser.address.geo.lng
                )
            ),
            phone: openAPIUser.phone,
            website: openAPIUser.website,
            company: .init(
                name: openAPIUser.company.name,
                catchPhrase: openAPIUser.company.catchPhrase,
                bs: openAPIUser.company.bs
            )
        )
    }
}
```

この実装では、`openAPIUser`のプロパティを`DomainLayer.User`のプロパティにマッピングしています。それぞれのプロパティがネストされているため、アドレスや会社のプロパティも適切に初期化しています。

---

## 👤 ユーザー
*2024/06/05 15:47:51*

修正してほしい

    private func getUsers() async throws -&gt; [DomainLayer.User] {
        do {
            let response: [Components.Schemas.User] = try await client.getUsers()

            switch response {
            case .ok(let okResponse):
                switch okResponse.body {
                case .json(let users):
                    return users
                }
            case .notFound(let notFoundResponse):
                switch notFoundResponse.body {
                case .json(let error):
                    OSLogger.errorLog("\(error)")
                    throw error
                }
            case .undocumented(statusCode: let statusCode, _):
                OSLogger.errorLog("\(statusCode)")
                throw error
            }
        } catch {
            OSLogger.errorLog("\(error)")
            throw error
        }
    }

---

## 🤖 アシスタント
*2024/06/05 15:48:03*

以下のコードは、ユーザー取得処理の修正後の実装例です。

```swift
private func getUsers() async throws -> [DomainLayer.User] {
    do {
        let response: [Components.Schemas.User] = try await client.getUsers()
        
        return response.map { DomainLayer.User(from: $0) }
        
    } catch {
        if let errorResponse = error as? ClientError {
            switch errorResponse {
            case .notFound(let notFoundResponse):
                switch notFoundResponse.body {
                case .json(let error):
                    OSLogger.errorLog("\(error)")
                    throw error
                }
            case .undocumented(statusCode: let statusCode, _):
                OSLogger.errorLog("Undocumented error with status code: \(statusCode)")
                throw error
            default:
                OSLogger.errorLog("Unexpected error: \(error)")
                throw error
            }
        } else {
            OSLogger.errorLog("Unexpected error: \(error)")
            throw error
        }
    }
}
```

修正内容:
1. `response`の取得後、各要素を`DomainLayer.User`にマッピングするために`map`関数を使用。
2. エラーハンドリングを改善し、特定のエラー (`notFound`, `undocumented`) に対応するケースを追加。
3. `ClientError`にキャストしてエラーハンドリングを整理。

これにより、関数はユーザーを適切に取得し、エラーハンドリングも包括的に行うことができます。

---
