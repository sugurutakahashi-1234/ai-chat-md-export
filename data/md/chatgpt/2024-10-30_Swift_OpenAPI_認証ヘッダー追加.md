# Swift OpenAPI 認証ヘッダー追加

日付: 2024-10-30

---

## 👤 ユーザー
*2024/10/30 18:10:40*

swift で openapigenで生成したコードでリクエストヘッダーにオーソライゼーションを付け加える方法

---

## 🤖 アシスタント
*2024/10/30 18:10:50*

`OpenAPI Generator`で生成されたSwiftクライアントコードにおいて、すべてのリクエストに認証用ヘッダー（例：`Authorization`ヘッダー）を追加するには、カスタムのリクエストインターセプターを実装し、生成されたAPIクライアントに設定する方法が一般的です。

以下の手順で実装できます。

### 1. **認証ヘッダーのためのインターセプターを作成**
リクエストに`Authorization`ヘッダーを追加するインターセプターを作成します。

```swift
import OpenAPIClient

class AuthInterceptor: RequestInterceptor {
    private let token: String

    init(token: String) {
        self.token = token
    }

    func adapt(urlRequest: URLRequest) -> URLRequest {
        var request = urlRequest
        request.addValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        return request
    }
}
```

### 2. **APIクライアントにインターセプターを設定**
生成されたAPIクライアントに、上記で作成したインターセプターを設定します。

```swift
// トークンを設定
let token = "YOUR_ACCESS_TOKEN"

// インターセプターを設定
let authInterceptor = AuthInterceptor(token: token)

// OpenAPIClientConfigを作成
let configuration = OpenAPIClientAPI.Configuration(
    basePath: "https://api.example.com", 
    requestInterceptors: [authInterceptor]
)

// APIクライアントを初期化
let apiClient = OpenAPIClientAPI(configuration: configuration)

// APIリクエストの実行例
apiClient.someAPIMethod { result in
    switch result {
    case .success(let response):
        print("Response: \(response)")
    case .failure(let error):
        print("Error: \(error)")
    }
}
```

### 3. **認証トークンの動的設定**
トークンが動的に変更される場合は、`AuthInterceptor`クラスを更新して、トークンを変更できるようにします。

```swift
class AuthInterceptor: RequestInterceptor {
    private var token: String

    init(token: String) {
        self.token = token
    }

    func updateToken(_ newToken: String) {
        self.token = newToken
    }

    func adapt(urlRequest: URLRequest) -> URLRequest {
        var request = urlRequest
        request.addValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        return request
    }
}
```

これにより、認証ヘッダーをすべてのAPIリクエストに自動的に付加できるようになります。

---

## 👤 ユーザー
*2024/10/31 10:10:04*

RequestInterceptor について教えて欲しい

---

## 🤖 アシスタント
*2024/10/31 10:10:33*

`RequestInterceptor`は、リクエストを送信する前にカスタマイズするための機能です。具体的には、リクエストのヘッダーを追加したり、パラメータを変更したり、リクエスト全体を別の形式に適応させるなど、リクエストを加工できます。

`OpenAPI Generator`で生成されたSwiftクライアントコードでは、リクエストにインターセプターを追加することで、すべてのリクエストに共通の処理（例えば、認証トークンの付加）を実装できます。これにより、各エンドポイントに対して個別にヘッダーを設定する必要がなくなり、共通化できます。

### `RequestInterceptor` の基本構造

生成されたクライアントの構造に応じて、`RequestInterceptor`は以下のように定義されます：

```swift
protocol RequestInterceptor {
    func adapt(urlRequest: URLRequest) -> URLRequest
}
```

### 主な役割

1. **リクエストヘッダーの付加**：リクエストに認証トークンやカスタムヘッダーを追加できます。
2. **リクエストのカスタマイズ**：エンドポイントやパラメータに基づきリクエストを変更したり、特定のルールに従って異なる設定にすることが可能です。
3. **リクエストの再送**：リクエストが失敗した際の再試行や、リフレッシュトークンを使ったトークンの再取得などを行う場合もあります。

### 実装例

#### 認証ヘッダーの追加
例えば、Bearerトークンを`Authorization`ヘッダーに追加するインターセプターを実装します。

```swift
class AuthInterceptor: RequestInterceptor {
    private let token: String

    init(token: String) {
        self.token = token
    }

    func adapt(urlRequest: URLRequest) -> URLRequest {
        var request = urlRequest
        request.addValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        return request
    }
}
```

### 利用方法

生成されたAPIクライアントにインターセプターを適用するためには、APIクライアントの設定に`RequestInterceptor`を追加します。

```swift
let token = "YOUR_ACCESS_TOKEN"
let authInterceptor = AuthInterceptor(token: token)
let configuration = OpenAPIClientAPI.Configuration(
    basePath: "https://api.example.com",
    requestInterceptors: [authInterceptor]
)
let apiClient = OpenAPIClientAPI(configuration: configuration)
```

### リクエストインターセプターの利点

- **共通処理の集約**：すべてのリクエストに対する認証やカスタムヘッダーを、各エンドポイントで個別に設定する必要がなくなります。
- **再利用可能**：インターセプターを使うことで、同様の設定を複数のAPIクライアントに再利用できます。
- **管理の簡素化**：トークンの更新やリクエストの共通カスタマイズが容易になり、コードの保守性が向上します。

このように、`RequestInterceptor`を活用することで、APIクライアントのコードの効率化やメンテナンス性を向上できます。

---
