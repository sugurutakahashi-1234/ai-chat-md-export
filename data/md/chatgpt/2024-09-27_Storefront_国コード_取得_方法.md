# Storefront 国コード 取得 方法

日付: 2024-09-27

---

## 👤 ユーザー
*2024/9/27 14:21:44*

SwiftでStorefrontのcountryCodeを取得したい

---

## 🤖 アシスタント
*2024/9/27 14:21:52*

`Storefront` の `countryCode` を取得するには、`StoreKit` フレームワークを使用します。`Storefront` は、`SKStorefront` クラスを通じて現在のApp Storeの国情報を提供しています。以下のようにして `countryCode` を取得することができます。

```swift
import StoreKit

func fetchStorefrontCountryCode() {
    Task {
        do {
            if let storefront = try await AppStore.current?.storefront {
                let countryCode = storefront.countryCode
                print("Country Code: \(countryCode)")
            } else {
                print("Failed to fetch storefront.")
            }
        } catch {
            print("Error fetching storefront: \(error)")
        }
    }
}
```

このコードでは、`AppStore.current?.storefront` を非同期で呼び出し、現在のApp Storeの国コードを取得します。 `countryCode` は `String` で表され、例えば `US` や `JP` といったISO 3166-1規格の国コードが返されます。

`Task` を使って非同期処理内で安全に結果を取得し、エラーハンドリングも行っています。

このコードを実行するには、iOS 15以降が必要です。

---

## 👤 ユーザー
*2024/9/27 14:25:45*

func fetchStorefront() async throws -&gt; Storefront { したい

---

## 🤖 アシスタント
*2024/9/27 14:25:59*

`fetchStorefront()` 関数を作成して、非同期に `Storefront` オブジェクトを取得し、エラーハンドリングも含めた形で返す方法は以下のようになります。`AppStore.current?.storefront` を使用して現在の `Storefront` 情報を取得し、それを `async throws` 関数として扱います。

以下がその実装です：

```swift
import StoreKit

struct StorefrontError: Error {
    let message: String
}

func fetchStorefront() async throws -> SKStorefront {
    // AppStore.current から Storefront を取得する
    if let storefront = try await AppStore.current?.storefront {
        return storefront
    } else {
        throw StorefrontError(message: "Failed to fetch storefront.")
    }
}
```

### 使用例：

```swift
func exampleUsage() {
    Task {
        do {
            let storefront = try await fetchStorefront()
            let countryCode = storefront.countryCode
            print("Storefront country code: \(countryCode)")
        } catch {
            print("Error fetching storefront: \(error)")
        }
    }
}
```

### 解説：

- `fetchStorefront()` は `async throws` として定義されており、非同期処理でエラーが発生した場合に `throw` でエラーを返すことができます。
- `AppStore.current?.storefront` から `storefront` オブジェクトを取得し、エラーがない場合は `SKStorefront` を返します。取得に失敗した場合はカスタムエラー `StorefrontError` を `throw` します。
- `Task` を使って非同期で関数を呼び出し、エラーハンドリングを `do-catch` で行っています。

これで `Storefront` の取得とエラーハンドリングを簡潔に行うことができます。

---

## 👤 ユーザー
*2024/9/27 14:27:03*

ype 'AppStore' has no member 'current'

---

## 🤖 アシスタント
*2024/9/27 14:27:14*

`AppStore.current` というメソッドがないのは、私の説明に誤りがありました。`StoreKit` で現在の `Storefront` を取得するには、`SKPaymentQueue` を使います。`SKPaymentQueue` には `storefront` プロパティがあり、そこから `Storefront` を取得できます。

以下のように `SKPaymentQueue.default().storefront` を使って現在の `Storefront` を取得し、`countryCode` を返す非同期関数を実装することができます。

```swift
import StoreKit

struct StorefrontError: Error {
    let message: String
}

func fetchStorefront() async throws -> SKStorefront {
    if let storefront = SKPaymentQueue.default().storefront {
        return storefront
    } else {
        throw StorefrontError(message: "Failed to fetch storefront.")
    }
}
```

### 使用例:

```swift
func exampleUsage() {
    Task {
        do {
            let storefront = try await fetchStorefront()
            let countryCode = storefront.countryCode
            print("Storefront country code: \(countryCode)")
        } catch {
            print("Error fetching storefront: \(error)")
        }
    }
}
```

### 解説:
- `SKPaymentQueue.default().storefront` から現在の `Storefront` を取得できます。
- `storefront` が `nil` の場合には、エラーをスローします。
- `async` 関数ではありますが、実際には `SKPaymentQueue` の操作は非同期処理を伴わないため、この関数自体に `async` を付ける必要はありません。もしも将来的に非同期処理が必要になる場合や拡張性を考えて、あえて `async` を付けている場合は、そのまま使用可能です。

これで、正しく `Storefront` を取得できるはずです。

---

## 👤 ユーザー
*2024/9/27 16:05:49*

以下ってどういう意味

    /// The `Locale.Currency` used for the purchase.
    @available(iOS 16.0, macOS 13.0, tvOS 16.0, watchOS 9.0, visionOS 1.0, \*)
    @backDeployed(before: iOS 17.2, macOS 14.2, tvOS 17.2, watchOS 10.2, visionOS 1.1)

---

## 🤖 アシスタント
*2024/9/27 16:06:13*

このコメントとアノテーションは、iOSや他のAppleプラットフォームで新しい機能やプロパティを使う際のバージョンに関する制約を示しています。以下に、その意味を詳しく説明します。

### コメント部分
```swift
/// The `Locale.Currency` used for the purchase.
```
- これは単にドキュメントコメントであり、`Locale.Currency`（通貨情報）が購入に使用されることを説明しています。

### アノテーション部分
```swift
@available(iOS 16.0, macOS 13.0, tvOS 16.0, watchOS 9.0, visionOS 1.0, *)
```
- `@available` アノテーションは、このプロパティやメソッドが使えるOSバージョンの下限を定義します。
  - iOS 16.0
  - macOS 13.0
  - tvOS 16.0
  - watchOS 9.0
  - visionOS 1.0
- `*` は「他のプラットフォームには全て対応する」という意味です。例えば、iOSやmacOS以外のプラットフォームにも適用できることを示します。

### @backDeployed アノテーション
```swift
@backDeployed(before: iOS 17.2, macOS 14.2, tvOS 17.2, watchOS 10.2, visionOS 1.1)
```
- `@backDeployed` アノテーションは、この機能が後方展開（バックデプロイ）されていることを示します。
- **バックデプロイ** とは、本来新しいOSバージョンで導入された機能や修正が、古いOSバージョンでも使えるように展開されることです。つまり、OSバージョンが上がる前に一部機能が古いバージョンにも提供されることを指します。
  
この場合、`Locale.Currency` に関しては、以下のバージョンより前の環境では後方展開されることを意味します：
  - iOS 17.2 より前
  - macOS 14.2 より前
  - tvOS 17.2 より前
  - watchOS 10.2 より前
  - visionOS 1.1 より前

つまり、これらのバージョンより前のOSであれば、この機能はすでに後方展開されており、使用可能です。それ以降のバージョンではネイティブにサポートされるため、後方展開の必要はありません。

### まとめ
- **@available**: このプロパティやメソッドが使えるOSの最小バージョンを示します。
- **@backDeployed**: 指定されたバージョンより前のOSに対しては、後方展開されているため、新しいOSにアップデートしなくてもこの機能を使用できることを意味します。

---

## 👤 ユーザー
*2024/9/27 16:16:08*

StoreKit.Transaction を 拡張して toDomain() を作ってほしい

struct SubscriptionTransaction: Identifiable {
    let id: UInt64
    let productID: String
    let purchaseDate: Date
    let expirationDate: Date?
    let revocationDate: Date?
    let isUpgraded: Bool

    // TODO: iOS 17 以降では StoreKit.Transaction から Storefront を直接取得が可能なので、SubscriptionTransaction で保持するようにしたい
    // @available(iOS 17.0, macOS 14.0, tvOS 17.0, watchOS 10.0, visionOS 1.0, \*)
    // let storeFront: StoreFront or
}

extension SubscriptionTransaction {
    init(from storeKitTransaction: StoreKit.Transaction) {
        self.id = storeKitTransaction.id
        self.productID = storeKitTransaction.productID
        self.purchaseDate = storeKitTransaction.purchaseDate
        self.expirationDate = storeKitTransaction.expirationDate
        self.revocationDate = storeKitTransaction.revocationDate
        self.isUpgraded = storeKitTransaction.isUpgraded
    }
}

---

## 🤖 アシスタント
*2024/9/27 16:16:25*

User prefers to extend StoreKit.Transaction with a method `toDomain()` to convert it into a `SubscriptionTransaction` entity.

---

## 🔧 ツール
*2024/9/27 16:16:25*

Model set context updated.

---

## 🤖 アシスタント
*2024/9/27 16:16:25*

`StoreKit.Transaction` を拡張し、`toDomain()` メソッドを追加して、`SubscriptionTransaction` に変換する方法を以下に示します。

```swift
import StoreKit

extension StoreKit.Transaction {
    func toDomain() -> SubscriptionTransaction {
        return SubscriptionTransaction(
            id: self.id,
            productID: self.productID,
            purchaseDate: self.purchaseDate,
            expirationDate: self.expirationDate,
            revocationDate: self.revocationDate,
            isUpgraded: self.isUpgraded
        )
    }
}
```

### 説明:
- `StoreKit.Transaction` の `toDomain()` メソッドは、`SubscriptionTransaction` へ変換します。
- `SubscriptionTransaction` に必要なプロパティを `StoreKit.Transaction` から抽出して、同じ値で初期化しています。

### iOS 17 以降の `Storefront` サポート:
`Storefront` を追加したい場合は、iOS 17以降の対応を条件として、次のように `#available` を使って追加できます。

```swift
import StoreKit

extension StoreKit.Transaction {
    func toDomain() -> SubscriptionTransaction {
        var storeFront: String? = nil
        if #available(iOS 17.0, macOS 14.0, tvOS 17.0, watchOS 10.0, visionOS 1.0, *) {
            storeFront = self.storefront?.countryCode
        }
        
        return SubscriptionTransaction(
            id: self.id,
            productID: self.productID,
            purchaseDate: self.purchaseDate,
            expirationDate: self.expirationDate,
            revocationDate: self.revocationDate,
            isUpgraded: self.isUpgraded
        )
        // Storefront情報も後に追加可能
    }
}
```

将来的に `SubscriptionTransaction` に `storeFront` を追加する場合は、コメント部分を適切に反映してください。

---
