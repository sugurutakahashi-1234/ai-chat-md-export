# Amplify Storage: iOS Metadata

日付: 2023-06-29

---

## 👤 ユーザー
*2023/6/29 17:57:48*

Amplify Storage のオプションでmetadataを含めたいのだけれどもiOSアプリでどうすればいい？

---

## 🤖 アシスタント
*2023/6/29 17:58:33*

AWS Amplify StorageはAWSのS3バケットにファイルを保存するためのライブラリです。メタデータを含めるためには、保存する際にoptionsパラメータを使用します。そのoptionsパラメータにはmetadataというフィールドがあり、そこに任意のメタデータを含めることができます。以下にその方法を示します。

Swiftであれば、以下のように書けます:

```swift
import Amplify

let options = StorageUploadDataOperation.Request.Options(metadata: ["description": "My awesome file"])

_ = Amplify.Storage.uploadData(key: "ExampleKey", data: data, options: options) { event in
    switch event {
    case .success(let data):
        print("Completed: \(data)")
    case .failure(let storageError):
        print("Failed: \(storageError.errorDescription). \(storageError.recoverySuggestion)")
    default:
        break
    }
}
```

この例では、`description`というメタデータをアップロードするファイルに追加しています。キー`ExampleKey`でファイルを保存し、そのデータには`data`が使用されます。`uploadData`関数のコールバックでは、成功した場合と失敗した場合の両方をハンドルします。

この方法で、ファイルに任意のメタデータを追加することができます。ただし、各メタデータのキーと値は文字列でなければなりません。

---
