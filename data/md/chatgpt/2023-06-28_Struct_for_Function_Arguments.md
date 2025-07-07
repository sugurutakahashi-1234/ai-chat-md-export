# Struct for Function Arguments

日付: 2023-06-28

---

## 👤 ユーザー
*2023/6/29 3:57:00*

swiftで以下の関数の引数をまとめたstructを定義したい。

func uploadAnalysisResults(measurementId: String, userId: User.ID, sessionId: String, gazeRelativeCGPoints: \[RelativeCGPoint\], interactionDataModels: \[InteractionDataModel\]) async throws

---

## 🤖 アシスタント
*2023/6/29 3:57:28*

Swiftでは、関数の引数をまとめるために、Structを使用することができます。以下に示すのは、あなたが指定した関数の引数をまとめたStructを定義する一例です：

```swift
struct AnalysisResultsUploadParameters {
    let measurementId: String
    let userId: User.ID
    let sessionId: String
    let gazeRelativeCGPoints: [RelativeCGPoint]
    let interactionDataModels: [InteractionDataModel]
}
```

このように定義することで、関数を次のように書き換えることが可能になります：

```swift
func uploadAnalysisResults(with parameters: AnalysisResultsUploadParameters) async throws {
    // parameters.measurementId, parameters.userId, etc...
}
```

これにより、関数呼び出し時に引数を1つのオブジェクトとして渡すことが可能になります：

```swift
let parameters = AnalysisResultsUploadParameters(measurementId: "id", userId: User.ID, sessionId: "session", gazeRelativeCGPoints: [], interactionDataModels: [])

await uploadAnalysisResults(with: parameters)
```

この方法が役立つ主なケースは、関数が多数の引数を取る場合や、引数が特定の「意味のあるまとまり」を形成している場合です。

---
