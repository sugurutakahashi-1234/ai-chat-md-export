# モックを作る (Create a mock)

Date: 2023-04-29

---

## 👤 User
*2023-04-29 15:34:24*

以下のprotocolに準拠したテスト用のモックをSwiftで記述して

```
public protocol MenuRepositoryProtocol {
    func fetch() async throws -> [Menu]
}
```

---

## 🤖 Assistant
*2023-04-29 15:34:37*

以下は、`MenuRepositoryProtocol`に従うモックの例です。このモックは`fetch()`メソッドを実装し、`Menu`の配列を返します。

```swift
class MenuRepositoryMock: MenuRepositoryProtocol {
    var menus: [Menu] = []
    
    func fetch() async throws -> [Menu] {
        return menus
    }
}
```

このモックは、`MenuRepositoryProtocol`を満たすように作成されています。`menus`プロパティには、テストで使用する`Menu`オブジェクトの配列が格納されます。`fetch()`メソッドは、常に`menus`プロパティの内容を返します。

このモックを使用する場合は、以下のようになります。

```swift
let menuRepositoryMock = MenuRepositoryMock()
menuRepositoryMock.menus = [/* テストで使用するMenuオブジェクトの配列 */]

let menus = try await menuRepositoryMock.fetch()
// menusにはmenuRepositoryMock.menusの値が入る
```

---

## 👤 User
*2023-04-29 15:35:23*

エラーをthrowようなケースもテストで確認したい

---

## 🤖 Assistant
*2023-04-29 15:35:42*

了解です。以下は、`fetch()`メソッドがエラーをスローする場合について、`MenuRepositoryProtocol`に従うモックの例です。

```swift
enum MenuRepositoryMockError: Error {
    case fetchFailed
}

class MenuRepositoryMock: MenuRepositoryProtocol {
    var menus: [Menu] = []
    var shouldThrowError = false
    
    func fetch() async throws -> [Menu] {
        if shouldThrowError {
            throw MenuRepositoryMockError.fetchFailed
        }
        return menus
    }
}
```

このモックでは、`shouldThrowError`フラグを使用して、`fetch()`メソッドがエラーをスローするかどうかを制御できます。`shouldThrowError`が`true`の場合、`fetch()`メソッドは`MenuRepositoryMockError.fetchFailed`エラーをスローします。

このモックを使用する場合は、以下のようになります。

```swift
let menuRepositoryMock = MenuRepositoryMock()
menuRepositoryMock.shouldThrowError = true

do {
    let menus = try await menuRepositoryMock.fetch()
    // menusにはmenuRepositoryMock.menusの値が入る
} catch {
    // エラー処理
}
```

上記の例では、`shouldThrowError`フラグが`true`に設定されているため、`fetch()`メソッドはエラーをスローします。`catch`ブロック内でエラーを処理できます。

---
