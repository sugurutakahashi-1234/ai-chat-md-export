# Swift AWS Libraries Comparison

日付: 2023-05-09

---

## 👤 ユーザー
*2023/5/9 14:50:55*

https://github.com/awslabs/aws-sdk-swift とhttps://github.com/aws-amplify/amplify-swift の違いを教えて欲しい

---

## 🤖 アシスタント
*2023/5/9 14:51:55*

`aws-sdk-swift` と `amplify-swift` は、共に Amazon Web Services (AWS) を Swift プログラミング言語で使用するためのライブラリですが、目的と機能が異なります。

1. aws-sdk-swift（現在はswift-aws/aws-sdk-swiftとして知られています）:
このライブラリは、AWS のさまざまなサービスを Swift で直接使用するための SDK（Software Development Kit）です。AWS のサービスを操作するために必要なクライアントを提供し、S3、EC2、DynamoDB などの AWS の多くのサービスに対応しています。これにより、Swift 開発者は AWS サービスを操作できるようになります。

リポジトリ: https://github.com/swift-aws/aws-sdk-swift

2. amplify-swift（正確には、aws-amplify/amplify-ios が Swift で書かれています）:
Amplify は、AWS が提供するフロントエンド開発フレームワークで、iOS、Android、Web 開発者向けの簡単な方法で AWS のバックエンド機能を統合することができます。Amplify iOS は、Swift で書かれた iOS アプリケーションで使用されます。主な機能は認証、API、ストレージ、データの同期などで、アプリケーション開発の高レベルな概念に焦点を当てています。

リポジトリ: https://github.com/aws-amplify/amplify-ios

概要として、`aws-sdk-swift` は Swift 開発者が AWS サービスを直接操作するための SDK を提供し、`amplify-swift`（amplify-ios）は、iOS アプリケーション開発者がアプリケーションに AWS の機能を簡単に統合できるフレームワークを提供します。どちらを選ぶかは、プロジェクトの要件や開発者の経験に応じて異なります。

---

## 👤 ユーザー
*2023/5/9 14:55:24*

Firebase Authの認証フローで得たトークンIDを利用して、Cognitoからクレデンシャルをつど取得して、それを用いて、S3にファイルをアップロードするようなことを実装したくて、その場合はどっちがいいでしょうか？

---

## 🤖 アシスタント
*2023/5/9 14:56:02*

このケースでは、`aws-sdk-swift`がより適切な選択です。`aws-sdk-swift`を使用すると、Amazon CognitoやAmazon S3などの各AWSサービスを個別に操作できます。これにより、Firebase Authから得たトークンIDをAmazon Cognitoに渡してクレデンシャルを取得し、そのクレデンシャルを使用してAmazon S3にファイルをアップロードするといったフローを実装できます。

`amplify-swift`（amplify-ios）は、アプリケーション開発の高レベルな概念に焦点を当てているため、Firebase AuthのトークンIDを使用した独自の認証フローを実装する場合、柔軟性が制限される可能性があります。

ただし、`aws-sdk-swift`を使用する際には、各サービスのAPIを直接操作するため、より多くのコードが必要になることがあります。そのため、開発者はAWSサービスの詳細な知識が必要となる場合があります。しかし、あなたが望むカスタム認証フローを実装するには、このアプローチが最も適しています。

---

## 👤 ユーザー
*2023/5/9 14:56:34*

ちなみにそれぞれでサンプルコードをかいてほしい

---

## 🤖 アシスタント
*2023/5/9 14:58:14*

以下に、それぞれのライブラリを使用して、Firebase Auth の ID トークンを Amazon Cognito に渡し、クレデンシャルを取得して Amazon S3 にファイルをアップロードするサンプルコードを示します。

1. `aws-sdk-swift` の場合:

```swift
import AWS_SDK_Swift
import FirebaseAuth
import AWSCognitoIdentity
import AWSS3

func uploadToS3() {
    // 1. Firebase AuthからIDトークンを取得
    Auth.auth().currentUser?.getIDTokenResult(completion: { (result, error) in
        if let error = error {
            print("Error getting ID token: \(error)")
            return
        }
        guard let idToken = result?.token else {
            print("ID token is missing")
            return
        }

        // 2. Cognito Identityのセットアップ
        let region = AWSRegion.euwest1
        let credentialsProvider = AWSStaticCredentialsProvider(accessKeyId: "YOUR_ACCESS_KEY", secretAccessKey: "YOUR_SECRET_KEY")
        let serviceConfiguration = AWSServiceConfiguration(region: region, credentialsProvider: credentialsProvider)

        // 3. CognitoでのIDプールの認証プロバイダをセットアップ
        let logins: [String: String] = ["securetoken.googleapis.com/YOUR_FIREBASE_PROJECT_ID": idToken]
        let identityProvider = CognitoIdentity.CognitoIdentityCustomProvider(logins: logins)
        
        let identityConfiguration = AWSCognitoIdentityConfiguration(customIdentityProvider: identityProvider, region: region)
        AWSCognitoIdentity.register(with: serviceConfiguration!, forKey: "MyCognitoIdentity")
        
        // 4. Cognito Identityからクレデンシャルを取得
        let cognitoIdentity = AWSCognitoIdentity(forKey: "MyCognitoIdentity")
        let getCredentialsInput = AWSCognitoIdentityGetCredentialsForIdentityInput()
        getCredentialsInput?.identityId = "YOUR_COGNITO_IDENTITY_ID"
        getCredentialsInput?.logins = logins

        cognitoIdentity.getCredentialsForIdentity(getCredentialsInput!).continueWith { (task) -> Any? in
            if let error = task.error {
                print("Error getting Cognito credentials: \(error)")
                return nil
            }
            guard let credentials = task.result else {
                print("Cognito credentials are missing")
                return nil
            }
            
            // 5. S3クライアントのセットアップ
            let s3CredentialsProvider = AWSStaticCredentialsProvider(accessKeyId: credentials.accessKeyId, secretAccessKey: credentials.secretKey, sessionToken: credentials.sessionToken)
            let s3ServiceConfiguration = AWSServiceConfiguration(region: region, credentialsProvider: s3CredentialsProvider)
            AWSS3.register(with: s3ServiceConfiguration!, forKey: "MyS3")
            
            // 6. ファイルをS3にアップロード
            let s3 = AWSS3(forKey: "MyS3")
            let uploadRequest = AWSS3PutObjectRequest()
            uploadRequest?.bucket = "YOUR_S3_BUCKET_NAME"
            uploadRequest?.key = "YOUR_S3_OBJECT_KEY"
            uploadRequest?.body = "YOUR_FILE_URL"
            uploadRequest?.contentType = "YOUR_CONTENT_TYPE"

            return s3.putObject(uploadRequest!).continueWith { (task) -> Any? in
                if let error = task.error {
                    print("Error uploading to

---

## 👤 ユーザー
*2023/5/9 14:58:27*

つづき

---

## 🤖 アシスタント
*2023/5/9 14:59:53*

S3: \(error)")
                    return nil
                }
                print("File uploaded successfully")
                return nil
            }
        }
    })
}

```

上記のサンプルコードでは、まず Firebase Auth から ID トークンを取得し、それを Amazon Cognito に渡してクレデンシャルを取得しています。その後、取得したクレデンシャルを使用して、Amazon S3 にファイルをアップロードしています。注意していただきたいのは、このコードは、あくまでサンプルであり、実際の環境で実行する前に、適切な値に置き換える必要があります。

2. `amplify-swift`（amplify-ios）の場合:

Amplify iOS は主に AWS の認証プロバイダーに対応しており、現在のところ Firebase Auth のカスタムトークンフローには対応していません。そのため、上記のシナリオを実現するためには、`aws-sdk-swift` の使用が推奨されます。

Amplify iOS を使用して S3 へのアップロードを実行する例は以下のとおりですが、これは Cognito User Pools を使用した場合のサンプルコードであり、Firebase Auth での ID トークンを使用していません。

```swift
import Amplify
import AmplifyPlugins

func configureAmplify() {
    do {
        try Amplify.add(plugin: AWSCognitoAuthPlugin())
        try Amplify.add(plugin: AWSS3StoragePlugin())
        try Amplify.configure()
        print("Amplify configured")
    } catch {
        print("Error configuring Amplify: \(error)")
    }
}

func uploadToS3() {
    let key = "YOUR_S3_OBJECT_KEY"
    let localURL = "YOUR_FILE_URL"

    Amplify.Storage.uploadFile(key: key, local: localURL) { result in
        switch result {
        case .success(let data):
            print("File uploaded successfully: \(data)")
        case .failure(let storageError):
            print("Error uploading file: \(storageError)")
        }
    }
}
```

これで、`aws-sdk-swift` を使用したサンプルコードと、Amplify iOS を使用した S3 へのアップロードのサンプルコードが用意されました。ただし、再度注意していただきたいのは、Amplify iOS は現状では Firebase Auth のカスタムトークンフローに対応していないため、前述のシナリオを実現するためには、`aws-sdk-swift` の使用が推奨されます。

---
