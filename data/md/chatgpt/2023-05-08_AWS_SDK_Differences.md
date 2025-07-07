# AWS SDK Differences

日付: 2023-05-08

---

## 👤 ユーザー
*2023/5/8 16:04:20*

https://github.com/aws-amplify/aws-sdk-ios とhttps://github.com/awslabs/aws-sdk-swift の違いを教えて

---

## 🤖 アシスタント
*2023/5/8 16:05:56*

`https://github.com/aws-amplify/aws-sdk-ios` と `https://github.com/awslabs/aws-sdk-swift` は、どちらも Amazon Web Services (AWS) のSDK (Software Development Kit) ですが、それぞれ異なるプログラミング言語とプラットフォームに対応しています。

1. aws-sdk-ios：
このリポジトリは、iOSアプリケーション開発のためのAWS SDKです。Objective-CとSwiftの両方の言語で利用できますが、主にiOSプラットフォーム（iPhone、iPad、およびiPod touch）での開発をターゲットにしています。このSDKを使用することで、iOSアプリケーションからAWSサービス（例：Amazon S3、Amazon DynamoDB、Amazon Cognitoなど）に簡単にアクセスできるようになります。

2. aws-sdk-swift：
このリポジトリは、Swift言語でのAWSアプリケーション開発のためのSDKです。これは、Appleのプラットフォーム（iOS、macOS、watchOS、およびtvOS）だけでなく、Swiftがサポートされている他のプラットフォーム（例：Linux）でも使用できます。このSDKは、SwiftNIOをベースにしており、非同期プログラミングと高いパフォーマンスが特徴です。ただし、現在このプロジェクトはアーカイブされており、新しいリポジトリとして `https://github.com/swift-aws/aws-sdk-swift` が継続されています。

要約すると、`aws-sdk-ios`は、iOSプラットフォーム向けのObjective-CとSwift言語に対応したAWS SDKであり、`aws-sdk-swift`（現在は `https://github.com/swift-aws/aws-sdk-swift`）は、Swift言語を中心に、Appleのプラットフォームだけでなく、Linuxなどの他のプラットフォームでも利用できるAWS SDKです。

---

## 👤 ユーザー
*2023/5/8 16:10:02*

https://github.com/soto-project/soto とはどういう関係性？

---

## 🤖 アシスタント
*2023/5/8 16:10:50*

`https://github.com/soto-project/soto` は、Swift言語で書かれたAmazon Web Services (AWS) SDKです。`soto` は、以前は `aws-sdk-swift` と呼ばれていましたが、名前が変更されて、現在は Soto プロジェクトとして開発が継続されています。

`soto` は、SwiftNIOをベースにしており、非同期プログラミングと高いパフォーマンスが特徴です。Appleのプラットフォーム（iOS、macOS、watchOS、およびtvOS）だけでなく、Swiftがサポートされている他のプラットフォーム（例：Linux）でも使用できます。

前述した `https://github.com/awslabs/aws-sdk-swift` は、現在アーカイブされていて、新しいリポジトリとして `https://github.com/swift-aws/aws-sdk-swift` が継続されていますが、それでも `soto` がSwift言語を使用したAWS SDKとしてより一般的に使われており、よりアクティブな開発が行われています。

要約すると、`soto` は、以前 `aws-sdk-swift` と呼ばれていたAWS SDKで、現在は独立したプロジェクトとして、Swift言語を使用したAWSアプリケーション開発のためのSDKとして普及しています。

---

## 👤 ユーザー
*2023/5/8 16:11:56*

https://github.com/soto-project/soto をプロダクションのコードとして採用しようと思うんだけどありかな？

---

## 🤖 アシスタント
*2023/5/8 16:13:17*

`soto` は、Swift言語でAmazon Web Services (AWS) を使用するためのSDKとして、非同期プログラミングと高いパフォーマンスが特徴であり、多くのAWSサービスをサポートしています。プロジェクトは活発に開発が行われており、コミュニティからのサポートも得られています。

プロダクションのコードで `soto` を採用するかどうかを判断する際に、以下の点を検討してください:

1. プロジェクトの要件: あなたのプロジェクトがSwift言語での開発を必要とし、AWSサービスを活用する場合、`soto` は適切な選択肢です。

2. サポートされているAWSサービス: `soto` は多くのAWSサービスをサポートしていますが、すべてのサービスがサポートされているわけではありません。使用する予定のAWSサービスが`soto`によってサポートされているかどうかを確認してください。

3. ドキュメントとサポート: プロジェクトのドキュメントが充実しており、コミュニティによるサポートも得られることが重要です。`soto` のドキュメントは、GitHubリポジトリ内にありますが、公式なAWS SDKに比べて限定的です。ただし、コミュニティによるサポートが得られることから、適切な情報が提供されています。

4. 継続的な開発とメンテナンス: `soto`プロジェクトは活発に開発が行われており、新しいAWSサービスや機能が追加されることが期待できます。プロダクション環境での使用を検討する際には、開発チームがメンテナンスやアップデートを継続的に行っていることが重要です。

これらの点を考慮した上で、プロダクションのコードに`soto`を採用することが適切であると判断できる場合、`soto` を採用することが良い選択と言えます。ただし、使用する前にドキュメントやサポートが十分にあることを確認し、適切なテストと検証を行ってください。

---

## 👤 ユーザー
*2023/5/8 16:15:55*

https://github.com/aws-amplify/aws-sdk-ios と https://github.com/soto-project/soto どちらとも 非同期プログラミングできるかな？

---

## 🤖 アシスタント
*2023/5/8 16:16:49*

はい、`https://github.com/aws-amplify/aws-sdk-ios` と `https://github.com/soto-project/soto` の両方とも非同期プログラミングに対応しています。

1. aws-sdk-ios：
このSDKは、Objective-CとSwiftで利用できます。iOSアプリケーション向けに作られており、非同期プログラミングに対応しています。SDK内の多くのAPIは、コールバックを使用して非同期的に実行できます。また、Swiftであれば、iOS 13以降およびmacOS 10.15以降で利用可能な`Combine`フレームワークを使っても非同期処理を行うことができます。

2. soto：
`soto`はSwift言語を中心に、Appleのプラットフォームだけでなく、Linuxなどの他のプラットフォームでも利用できます。`soto`はSwiftNIOをベースにしており、非同期プログラミングと高いパフォーマンスが特徴です。SwiftNIOは、イベント駆動型のネットワークアプリケーションフレームワークであり、非同期I/Oを提供します。このため、`soto`を使用すると、非同期プログラミングが容易に実現できます。

要約すると、`aws-sdk-ios` と `soto` の両方とも非同期プログラミングに対応しており、それぞれのプラットフォームと言語に応じて適切な非同期処理手法を選択して使用できます。

---

## 👤 ユーザー
*2023/5/8 16:18:23*

両方ともasync await対応していますか？

---

## 🤖 アシスタント
*2023/5/8 16:19:25*

`aws-sdk-ios` と `soto` の両方とも、Swift 5.5で導入された `async`/`await` 機能をサポートしていますが、対応状況は異なります。

1. aws-sdk-ios：
`aws-sdk-ios` は、Swift 5.5の `async`/`await` 機能には直接対応していませんが、`async`/`await` を利用するためのサードパーティ拡張が提供されています。例えば、\[`AWSAsync`\](https://github.com/swift-aws/aws-sdk-ios/blob/main/Sources/AWSAsync/AWSAsync.swift) は、`aws-sdk-ios` の各サービスの非同期メソッドに対して `async`/`await` を使用できるように拡張しています。ただし、この拡張は公式サポートされているわけではないため、使用する際には注意が必要です。

2. soto：
`soto` は、SwiftNIOをベースにしていますが、Swift 5.5以降のバージョンでは `async`/`await` をサポートしています。`soto` のリポジトリには、非同期メソッドを `async`/`await` を使って呼び出す方法が記載されています。これにより、Swift 5.5以降を対象とするプロジェクトでは、`soto` を使った非同期プログラミングがより簡潔で直感的になります。

要約すると、`aws-sdk-ios` は、Swift 5.5の `async`/`await` 機能に直接対応していないものの、サードパーティの拡張を使って間接的に対応できます。一方、`soto` は、Swift 5.5以降で `async`/`await` をサポートしており、非同期プログラミングがより簡潔で直感的に実現できます。

---

## 👤 ユーザー
*2023/5/8 16:19:57*

それぞれでS3に対して、CSVファイルをアップロードするコードを書いてみて

---

## 🤖 アシスタント
*2023/5/8 16:20:10*

以下に、`aws-sdk-ios` と `soto` を使用して、Amazon S3にCSVファイルをアップロードするSwiftコードの例を示します。

1. aws-sdk-ios:

まず、`Podfile`に以下のように`AWSS3`を追加してインストールします。

```
target 'YourProjectName' do
  use_frameworks!
  pod 'AWSS3'
end
```

その後、以下のようにCSVファイルをS3にア

---

## 👤 ユーザー
*2023/5/8 16:20:37*

両方ともSwift Package Manager で書いて欲しい

---

## 🤖 アシスタント
*2023/5/8 16:22:02*

申し訳ありません。Swift Package Managerを使用した例を以下に示します。

1. aws-sdk-ios:

`aws-sdk-ios`は、Swift Package Managerによる直接のインストールはサポートしていません。そのため、[Soto for AWS](https://github.com/soto-project/soto)を使用することをお勧めします。`Soto`は`aws-sdk-ios`と同様にiOSプラットフォームでも利用でき、Swift Package Managerに対応しています。

2. Soto for AWS:

`Package.swift`にSotoを追加します。

```swift
// swift-tools-version:5.5
import PackageDescription

let package = Package(
    name: "YourProjectName",
    platforms: [
        .macOS(.v12)
    ],
    dependencies: [
        .package(url: "https://github.com/soto-project/soto.git", from: "5.0.0")
    ],
    targets: [
        .executableTarget(
            name: "YourProjectName",
            dependencies: [
                .product(name: "SotoS3", package: "soto")
            ]),
    ]
)
```

その後、以下のようにCSVファイルをS3にアップロードするコードを記述します。

```swift
import Foundation
import SotoS3

// バケット名とファイル名を指定してください
let bucket = "your-bucket-name"
let fileName = "your-file-name.csv"

// AWS credentials
let accessKeyId = "your-access-key-id"
let secretAccessKey = "your-secret-access-key"

let awsClient = AWSClient(
    credentialProvider: .static(accessKeyId: accessKeyId, secretAccessKey: secretAccessKey),
    httpClientProvider: .createNew
)
let s3 = S3(client: awsClient, region: .uswest2)

func uploadCSV() async throws {
    let fileURL = Bundle.main.url(forResource: "example", withExtension: "csv")!
    let data = try Data(contentsOf: fileURL)
    
    let request = S3.PutObjectRequest(
        acl: .publicRead,
        body: .bytes(data),
        bucket: bucket,
        contentLength: Int64(data.count),
        key: fileName,
        contentType: "text/csv"
    )
    
    let response = try await s3.putObject(request)
    print("File uploaded successfully: \(response)")
}

@main
struct App {
    static func main() async {
        do {
            try await uploadCSV()
        } catch {
            print("Error uploading file: \(error)")
        }
        
        try? awsClient.syncShutdown()
    }
}

App.main()
```

このコードは、同梱されたCSVファイル（"example.csv"）を指定されたS3バケットにアップロードします。アクセスキーIDとシークレットアクセスキーを使用して認証を行います。バケット名とファイル名は適切に設定してください。`async`/`await`が使われており、Swift 5.5以降が必要です。

---

## 👤 ユーザー
*2023/5/8 16:27:47*

aws-sdk-ios を使って同じことをしようとするとどうやって書けばいい？

---

## 🤖 アシスタント
*2023/5/8 16:28:10*

`aws-sdk-ios`は、Swift Package Managerでの直接のインストールはサポートしていません。しかし、代わりに\[AWSSDKSwift\](https://github.com/swift-aws/aws-sdk-swift)（現在は\[soto\](https://github.com/soto-project/soto)として知られています）を使用することができます。これは、`aws-sdk-ios`と同様にiOSプラットフォームで利用でき、Swift Package Managerに対応しています。

以下の手順で、`soto`を使用してCSVファイルをS3にアップロードするコードを書

---
