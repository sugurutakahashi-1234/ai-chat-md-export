# Amplify ファイルダウンロード & JSON値取得

日付: 2023-06-25

---

## 👤 ユーザー
*2023/06/26 00:32:39*

Swiftのamplifyでファイルをダウンロードする方法
そして、以下のようなJSONファイルなのでそれから値を取得する方法
amplifyのインストールは済んでいる

keyはconfigs/ios.json


{
  "minimumRequiredAppVersion": "0.0.0"
}

---

## 🤖 アシスタント
*2023/06/26 00:33:30*

AWS AmplifyとAWS S3を使用してファイルをダウンロードし、そのJSONファイルから値を取得する方法を説明します。

まず、Amplifyライブラリをプロジェクトにインポートします。

```swift
import Amplify
import AmplifyPlugins
```

次に、Amplifyを設定します。通常、これは `AppDelegate` またはアプリの初期化部分で行われます。

```swift
func configureAmplify() {
    do {
        try Amplify.add(plugin: AWSCognitoAuthPlugin())
        try Amplify.add(plugin: AWSS3StoragePlugin())
        try Amplify.configure()
        print("Amplify configured with auth and storage plugins")
    } catch {
        print("Failed to initialize Amplify with \(error)")
    }
}
```

次に、S3からファイルをダウンロードするメソッドを作成します。S3のバケットから "configs/ios.json" ファイルをダウンロードするには、以下のようにします。

```swift
func downloadFile() {
    let local = URL(fileURLWithPath: NSTemporaryDirectory()).appendingPathComponent("ios.json")

    _ = Amplify.Storage.downloadFile(key: "configs/ios.json", local: local) { event in
        switch event {
        case .success:
            print("File Downloaded Successfully")
            self.parseJson(localUrl: local)
        case .failure(let storageError):
            print("Failed to download file: \(storageError.errorDescription). \(storageError.recoverySuggestion)")
        default:
            break
        }
    }
}
```

このコードでは、ダウンロードしたファイルは一時ディレクトリに保存され、ダウンロードが成功したらJSONをパースする `parseJson(localUrl:)` メソッドを呼び出します。

最後に、ダウンロードしたJSONファイルから値を取得します。Swiftの `Codable` を使用してJSONをパースします。

まず、対応するデータ構造を作成します。

```swift
struct AppInfo: Codable {
    let minimumRequiredAppVersion: String
}
```

次に、ダウンロードしたファイルをパースするメソッドを作成します。

```swift
func parseJson(localUrl: URL) {
    do {
        let data = try Data(contentsOf: localUrl)
        let decoder = JSONDecoder()
        let appInfo = try decoder.decode(AppInfo.self, from: data)
        print("Minimum Required App Version: \(appInfo.minimumRequiredAppVersion)")
    } catch {
        print("Failed to parse JSON: \(error)")
    }
}
```

これで、S3からファイルをダウンロードし、そのJSONファイルから値を取得することができます。ただし、実際のアプリケーションでこれらのコードを使用する前に、エラーハンドリングと例外処理を適切に行うことが重要です。

---

## 👤 ユーザー
*2023/06/26 00:35:15*

これつかっていますか？

public func downloadFile(
        key: String,
        local: URL,
        options: StorageDownloadFileOperation.Request.Options? = nil
    ) -&gt; StorageDownloadFileTask {
        plugin.downloadFile(key: key, local: local, options: options)
    }

---

## 🤖 アシスタント
*2023/06/26 00:35:38*

はい、その通りです。あなたが引用した関数は、Amplifyの`Storage`カテゴリーの一部です。これはAWSのS3ストレージから特定のキーに関連付けられたファイルをダウンロードするためのものです。

ここでの`key`は、あなたがダウンロードしたいS3オブジェクトの名前（パス含む）です。`local`パラメータは、ダウンロードしたファイルを保存するためのローカルURLです。

この関数は`StorageDownloadFileTask`オブジェクトを返し、このオブジェクトを使用してダウンロード操作を管理することができます。たとえば、ダウンロードの進行状況を監視したり、必要に応じてダウンロードをキャンセルしたりできます。

私が最初に提供したサンプルコードでは、この関数を使用して`configs/ios.json`というキーのファイルを一時ディレクトリにダウンロードします。そして、ダウンロードが成功した場合にはJSONをパースするための別の関数を呼び出しています。

---

## 👤 ユーザー
*2023/06/26 00:36:10*

ローカルに保存する必要はなくてキャッシュで持っておくだけで十分なんだ。

---

## 🤖 アシスタント
*2023/06/26 00:36:36*

それであれば、ファイルを一時的にメモリ内で保持し、パースしたいということですね。その場合、AWS Amplifyの `downloadData` 関数を使用することができます。この関数は指定されたキーのオブジェクトをダウンロードし、そのデータを直接返します。こちらの関数を使ってデータをダウンロードし、JSONDecoderを用いて直接データをパースすることができます。

以下の例では、S3からデータをダウンロードし、JSONをパースして`AppInfo`オブジェクトを作成します。

```swift
func downloadAndParseFile() {
    _ = Amplify.Storage.downloadData(key: "configs/ios.json") { event in
        switch event {
        case .success(let data):
            print("Data Downloaded Successfully")
            self.parseJson(data: data)
        case .failure(let storageError):
            print("Failed to download data: \(storageError.errorDescription). \(storageError.recoverySuggestion)")
        default:
            break
        }
    }
}

func parseJson(data: Data) {
    do {
        let decoder = JSONDecoder()
        let appInfo = try decoder.decode(AppInfo.self, from: data)
        print("Minimum Required App Version: \(appInfo.minimumRequiredAppVersion)")
    } catch {
        print("Failed to parse JSON: \(error)")
    }
}
```

この `downloadAndParseFile` 関数を呼び出すと、"configs/ios.json" からデータがダウンロードされ、そのデータから `AppInfo` オブジェクトが生成されます。

---

## 👤 ユーザー
*2023/06/26 00:40:16*

関数分けなくていいのとdownloadAndParseFile()の引数に key と decoder と デコードする型を指定して、返り値も設定できるようにしたい。（いわゆる型を一般的にしたい。コーダブルであることは指定していいよ）

---

## 🤖 アシスタント
*2023/06/26 00:40:51*

それならば、Swiftのジェネリクスを使って関数を一般化し、デコーダとデコードする型を引数にとるようにすることができます。以下にそのような関数の例を示します：

```swift
func downloadAndParseFile<T: Codable>(key: String, decoder: JSONDecoder, decodeType: T.Type, completion: @escaping (Result<T, Error>) -> Void) {
    _ = Amplify.Storage.downloadData(key: key) { event in
        switch event {
        case .success(let data):
            do {
                let decodedObject = try decoder.decode(T.self, from: data)
                completion(.success(decodedObject))
            } catch {
                completion(.failure(error))
            }
        case .failure(let storageError):
            completion(.failure(storageError))
        default:
            break
        }
    }
}
```

この関数は、`Codable`プロトコルに準拠した任意の型をデコードすることができます。関数は`key`（ダウンロードするファイルのキー）、`decoder`（JSONのデコードに使用するJSONDecoder）、`decodeType`（デコードする型）の3つの引数を受け取ります。

また、関数は成功した場合にデコードされたオブジェクトを返し、失敗した場合にはエラーを返す`completion`クロージャも受け取ります。

この関数を使って`AppInfo`オブジェクトを取得する場合の例は以下のようになります：

```swift
let decoder = JSONDecoder()
downloadAndParseFile(key: "configs/ios.json", decoder: decoder, decodeType: AppInfo.self) { (result: Result<AppInfo, Error>) in
    switch result {
    case .success(let appInfo):
        print("Minimum Required App Version: \(appInfo.minimumRequiredAppVersion)")
    case .failure(let error):
        print("Failed to download and parse file: \(error)")
    }
}
```

---

## 👤 ユーザー
*2023/06/26 00:41:36*

Resultではなくてaysnc /awaitにして欲しい

---
