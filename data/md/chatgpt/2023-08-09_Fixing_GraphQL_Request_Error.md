# Fixing GraphQL Request Error

日付: 2023-08-09

---

## 👤 ユーザー
*2023/08/09 13:30:05*

以下のエラーになるので直して欲しい
Expected '&gt;' to complete generic argument list

private extension AmplifyApiRequestManager {
    func requestLog(request: GraphQLRequest&lt;R: Decodable&gt;) {
        LoggerContainer.log(.requestApiServer(.init(request: String(describing: request))))
    }
}

---

## 🤖 アシスタント
*2023/08/09 13:30:17*

エラーは、`GraphQLRequest<R: Decodable>` の部分のジェネリクスの書き方に問題があるために発生しています。

修正するためには、ジェネリック型パラメータの宣言を関数の宣言の前に移動させる必要があります。以下のように修正してください。

```swift
private extension AmplifyApiRequestManager {
    func requestLog<R: Decodable>(request: GraphQLRequest<R>) {
        LoggerContainer.log(.requestApiServer(.init(request: String(describing: request))))
    }
}
```

これで `Expected '>' to complete generic argument list` のエラーは解消されるはずです。

---
