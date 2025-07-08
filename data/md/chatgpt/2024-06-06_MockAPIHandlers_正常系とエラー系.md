# MockAPIHandlers:正常系とエラー系

日付: 2024-06-06

---

## 👤 ユーザー
*2024/6/6 12:51:50*

getUsers と getUserById のレスポンスを自分で決めたい。
正常系とエラー系をそれぞれ設定してほしい

public final class APIRequestDriverProtocolMock: APIRequestDriverProtocol, @unchecked Sendable {
    public init() { }


    public private(set) var getUsersCallCount = 0
    public var getUsersHandler: (() async throws -&gt; ([DomainLayer.User]))?
    public func getUsers() async throws -&gt; [DomainLayer.User] {
        getUsersCallCount += 1
        if let getUsersHandler = getUsersHandler {
            return try await getUsersHandler()
        }
        return [DomainLayer.User]()
    }

    public private(set) var getUserByIdCallCount = 0
    public var getUserByIdHandler: ((Int) async throws -&gt; (DomainLayer.User))?
    public func getUserById(id: Int) async throws -&gt; DomainLayer.User {
        getUserByIdCallCount += 1
        if let getUserByIdHandler = getUserByIdHandler {
            return try await getUserByIdHandler(id)
        }
        fatalError("getUserByIdHandler returns can't have a default value thus its handler must be set")
    }
}

---

## 🤖 アシスタント
*2024/6/6 12:52:00*

`APIRequestDriverProtocolMock`の`getUsers`と`getUserById`メソッドに対する正常系とエラー系のレスポンスを設定するために、以下のコードを使用できます。このコードでは、正常系とエラー系のハンドラーを設定する例を示しています。

```swift
public final class APIRequestDriverProtocolMock: APIRequestDriverProtocol, @unchecked Sendable {
    public init() { }

    public private(set) var getUsersCallCount = 0
    public var getUsersHandler: (() async throws -> ([DomainLayer.User]))?
    public func getUsers() async throws -> [DomainLayer.User] {
        getUsersCallCount += 1
        if let getUsersHandler = getUsersHandler {
            return try await getUsersHandler()
        }
        return [DomainLayer.User]()
    }

    public private(set) var getUserByIdCallCount = 0
    public var getUserByIdHandler: ((Int) async throws -> (DomainLayer.User))?
    public func getUserById(id: Int) async throws -> DomainLayer.User {
        getUserByIdCallCount += 1
        if let getUserByIdHandler = getUserByIdHandler {
            return try await getUserByIdHandler(id)
        }
        fatalError("getUserByIdHandler returns can't have a default value thus its handler must be set")
    }
}

// 使用例

let mock = APIRequestDriverProtocolMock()

// getUsersの正常系レスポンスを設定
mock.getUsersHandler = {
    return [
        DomainLayer.User(id: 1, name: "Alice"),
        DomainLayer.User(id: 2, name: "Bob")
    ]
}

// getUsersのエラー系レスポンスを設定
mock.getUsersHandler = {
    throw NSError(domain: "TestError", code: 1, userInfo: [NSLocalizedDescriptionKey: "Failed to fetch users"])
}

// getUserByIdの正常系レスポンスを設定
mock.getUserByIdHandler = { id in
    return DomainLayer.User(id: id, name: "Alice")
}

// getUserByIdのエラー系レスポンスを設定
mock.getUserByIdHandler = { id in
    throw NSError(domain: "TestError", code: 2, userInfo: [NSLocalizedDescriptionKey: "User not found"])
}
```

上記の例では、`getUsers`メソッドと`getUserById`メソッドに対してそれぞれ正常系とエラー系のレスポンスを設定しています。テストケースに応じて、これらのハンドラーを設定することで、モックの動作を制御できます。

---
