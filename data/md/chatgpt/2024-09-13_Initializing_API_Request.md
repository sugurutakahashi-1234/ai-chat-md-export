# Initializing API Request

日付: 2024-09-13

---

## 👤 ユーザー
*2024/09/13 14:52:13*

let _ = try await client.postAppleSubscribe(.init(body: .jsonPayload(receipt_data: receiptData, app_id: .davinci)))
        

Member 'init(receipt_data:app_id:)' in 'Operations.postAppleSubscribe.Input.Body' produces result of type 'Operations.postAppleSubscribe.Input.Body.jsonPayload', but context expects 'Operations.postAppleSubscribe.Input.Body'

---

## 🤖 アシスタント
*2024/09/13 14:52:24*

The error you're encountering indicates that you're trying to initialize a `jsonPayload` when the context expects a `Body` object, not a `jsonPayload`. You likely need to initialize the `Body` type correctly. The `jsonPayload` might be a nested type within the `Body`, so you'll need to wrap it properly.

Here's how you can refactor the code:

```swift
let _ = try await client.postAppleSubscribe(.init(body: .init(receipt_data: receiptData, app_id: .davinci)))
```

This assumes that `Operations.postAppleSubscribe.Input.Body` has a constructor that accepts `receipt_data` and `app_id` and that `Body` itself is a wrapper around `jsonPayload`.

If this is not the case, you might need to explicitly create the `jsonPayload` and then wrap it in the appropriate `Body` type. For example:

```swift
let body = Operations.postAppleSubscribe.Input.Body.jsonPayload(receipt_data: receiptData, app_id: .davinci)
let _ = try await client.postAppleSubscribe(.init(body: .init(body: body)))
```

If the structure is more complex, feel free to provide more details about the `Body` type, and I can assist further.

---
