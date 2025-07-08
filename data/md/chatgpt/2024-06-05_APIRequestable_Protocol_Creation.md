# APIRequestable Protocol Creation

日付: 2024-06-05

---

## 👤 ユーザー
*2024/06/05 17:43:56*

以下のprotocol を定義してほしい

final public class APIRequestDriver: Sendable {
    private let client: Client = Client(
        serverURL: try! Servers.server1(),
        transport: URLSessionTransport()
    )

    public init() {}

    public func getUsers() async throws -&gt; [DomainLayer.User] {
        do {
            let response = try await client.getUsers()

            switch response {
            case .ok(let okResponse):
                switch okResponse.body {
                case .json(let users):
                    return users.map { DomainLayer.User(from: $0) }
                }
            case .notFound(let notFoundResponse):
                switch notFoundResponse.body {
                case .json(let error):
                    OSLogger.errorLog("\(error)")
                    throw APIRequestDriverError.notFound
                }
            case .undocumented(statusCode: let statusCode, _):
                OSLogger.errorLog("\(statusCode)")
                throw APIRequestDriverError.undocumented
            }
        } catch {
            OSLogger.errorLog("\(error)")
            throw APIRequestDriverError.unexpected(error)
        }
    }
    
    public func getUserById(id: Int) async throws -&gt; DomainLayer.User {
        do {
            let response = try await client.getUserById(path: .init(id: id))

            switch response {
            case .ok(let okResponse):
                switch okResponse.body {
                case .json(let user):
                    return DomainLayer.User(from: user)
                }
            case .notFound(let notFoundResponse):
                switch notFoundResponse.body {
                case .json(let error):
                    OSLogger.errorLog("\(error)")
                    throw APIRequestDriverError.notFound
                }
            case .undocumented(statusCode: let statusCode, _):
                OSLogger.errorLog("\(statusCode)")
                throw APIRequestDriverError.undocumented
            }
        } catch {
            OSLogger.errorLog("\(error)")
            throw APIRequestDriverError.unexpected(error)
        }
    }
}

---

## 🤖 アシスタント
*2024/06/05 17:44:14*

以下のプロトコル `APIRequestable` を定義し、それに準拠する形で `APIRequestDriver` クラスを修正します。

```swift
protocol APIRequestable: Sendable {
    func getUsers() async throws -> [DomainLayer.User]
    func getUserById(id: Int) async throws -> DomainLayer.User
}

final public class APIRequestDriver: APIRequestable {
    private let client: Client = Client(
        serverURL: try! Servers.server1(),
        transport: URLSessionTransport()
    )

    public init() {}

    public func getUsers() async throws -> [DomainLayer.User] {
        do {
            let response = try await client.getUsers()

            switch response {
            case .ok(let okResponse):
                switch okResponse.body {
                case .json(let users):
                    return users.map { DomainLayer.User(from: $0) }
                }
            case .notFound(let notFoundResponse):
                switch notFoundResponse.body {
                case .json(let error):
                    OSLogger.errorLog("\(error)")
                    throw APIRequestDriverError.notFound
                }
            case .undocumented(statusCode: let statusCode, _):
                OSLogger.errorLog("\(statusCode)")
                throw APIRequestDriverError.undocumented
            }
        } catch {
            OSLogger.errorLog("\(error)")
            throw APIRequestDriverError.unexpected(error)
        }
    }

    public func getUserById(id: Int) async throws -> DomainLayer.User {
        do {
            let response = try await client.getUserById(path: .init(id: id))

            switch response {
            case .ok(let okResponse):
                switch okResponse.body {
                case .json(let user):
                    return DomainLayer.User(from: user)
                }
            case .notFound(let notFoundResponse):
                switch notFoundResponse.body {
                case .json(let error):
                    OSLogger.errorLog("\(error)")
                    throw APIRequestDriverError.notFound
                }
            case .undocumented(statusCode: let statusCode, _):
                OSLogger.errorLog("\(statusCode)")
                throw APIRequestDriverError.undocumented
            }
        } catch {
            OSLogger.errorLog("\(error)")
            throw APIRequestDriverError.unexpected(error)
        }
    }
}
```

これにより、`APIRequestDriver` クラスは `APIRequestable` プロトコルに準拠し、他のクラスやモジュールが依存注入やモックのために `APIRequestable` プロトコルを使用できるようになります。

---
