# Amplify API Token Integration

日付: 2023-06-21

---

## 👤 ユーザー
*2023/6/22 3:13:43*

SwiftのAmplifyでAmplify.API.queryを実行する際にCustomInterceptorを使って、Cognitoからとれるtokenを設定して、クエリを実行する方法を教えて欲しい。

SwiftでAmplifyのSDKは導入済みなので、そこの説明は省略してほしい

---

## 🤖 アシスタント
*2023/6/22 3:14:54*

SwiftでAmplifyのAPIクエリを実行する際に、カスタムインターセプターを使用してCognitoから取得したトークンを設定する方法は以下の通りです。

まず、カスタムインターセプターを作成します。これはHTTPリクエストを変更するためのものです。トークンを設定するためには、`URLRequestInterceptor`プロトコルを実装する必要があります。

```swift
import Amplify
import AWSPluginsCore

class TokenAddingInterceptor: URLRequestInterceptor {
    let token: String

    init(token: String) {
        self.token = token
    }

    func intercept(_ request: URLRequest) throws -> URLRequest {
        var modifiedRequest = request
        modifiedRequest.addValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        return modifiedRequest
    }
}
```

ここでは、コンストラクタでトークンを受け取り、それを`Authorization`ヘッダに設定しています。

次に、このインターセプターをAmplify.APIクエリの設定に含めます。まず、トークンを取得し、それを使用してインターセプターを作成します。その後、インターセプターを使ってAmplify.APIクエリを実行します。

```swift
let options = APIOptions(interceptors: [TokenAddingInterceptor(token: yourToken)])

Amplify.API.query(request: .list(YourModel.self), options: options) { event in
    switch event {
    case .success(let result):
        switch result {
        case .success(let todos):
            print("Successfully retrieved list: \(todos)")
        case .failure(let error):
            print("Got failed result with \(error.errorDescription)")
        }
    case .failure(let error):
        print("Got failed event with error \(error)")
    }
}
```

ここで`yourToken`は、あなたがAWS Cognitoから取得したトークンを指しています。これをあなたのコードで適切に取得し、それをインターセプターに渡すようにすることが重要です。

なお、このコードは特定のユースケースや設定に対応しているため、あなたのプロジェクトの具体的な要件に応じて適宜調整することが必要です。

---

## 👤 ユーザー
*2023/6/22 3:17:35*

なるほど。

AuthTokenURLRequestInterceptor の mutableRequest.setValue(token, forHTTPHeaderField: "authorization") のところにtokenを設定したいのだけれどもこれで大丈夫かな？

---

## 🤖 アシスタント
*2023/6/22 3:18:06*

はい、その通りです。SwiftではHTTPヘッダーの値を設定するために、URLRequestのsetValue(_:forHTTPHeaderField:)メソッドを使用します。あなたが提示したコードスニペットでは、"authorization"ヘッダーに対してトークンを設定しています。

ただし、一般的には、"Authorization"ヘッダーにBearerトークンを設定するときには、"Bearer"というキーワードを先頭につけます。そのため、あなたのコードは次のようになるべきです：

```swift
mutableRequest.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
```

これにより、"Authorization"ヘッダーの値が"Bearer {トークン}"の形式になります。これは、HTTPリクエストにおける標準的なBearerトークンの形式です。

なお、HTTPヘッダーフィールド名は大文字と小文字が区別されないため、"authorization"と"Authorization"は同等です。しかし、一般的には"Authorization"（先頭が大文字）と表記されます。

---

## 👤 ユーザー
*2023/6/22 3:20:01*

addValue と setValue の違いを推して欲しい

---

## 🤖 アシスタント
*2023/6/22 3:20:37*

`addValue(\_:forHTTPHeaderField:)`と`setValue(\_:forHTTPHeaderField:)`はどちらも`URLRequest`のメソッドで、HTTPリクエストヘッダーに値を追加するために使われます。しかしその挙動は若干異なります。

- `addValue(\_:forHTTPHeaderField:)`: このメソッドは、指定したヘッダフィールドに新たな値を追加します。もし既にそのヘッダフィールドに値が存在する場合は、新たな値が既存の値の後ろに追加され、コンマで区切られます。これは、ヘッダフィールドが複数の値を許容する場合に使われます。

- `setValue(\_:forHTTPHeaderField:)`: このメソッドは、指定したヘッダフィールドに新たな値を設定します。もし既にそのヘッダフィールドに値が存在する場合は、その値が新たな値で置き換えられます。

"Authorization"ヘッダのような、通常は1つの値しか持たないヘッダフィールドに対しては、`setValue(\_:forHTTPHeaderField:)`を使用することが一般的です。なぜなら、そのヘッダフィールドに新たな値を追加するのではなく、既存の値を新たな値で置き換えたいからです。

---

## 👤 ユーザー
*2023/6/22 3:28:40*

idTokenの取得方法も教えて欲しい

---

## 🤖 アシスタント
*2023/6/22 3:29:20*

AWS CognitoからIDトークンを取得するには、以下のSwiftコードスニペットを使用できます。これは`Amplify.Auth`を使用してユーザーの認証情報を取得し、それからIDトークンを取り出すものです。

```swift
Amplify.Auth.fetchAuthSession { result in
    switch result {
    case .success(let session):
        if let cognitoTokens = session as? AuthCognitoTokensProvider {
            do {
                let tokens = try cognitoTokens.getCognitoTokens()
                let idToken = tokens.idToken
                print("ID token: \(idToken)")
            } catch {
                print("Failed to get tokens: \(error)")
            }
        }
    case .failure(let error):
        print("Fetch auth session failed with error \(error)")
    }
}
```

このコードでは、`fetchAuthSession`メソッドを使用して現在の認証セッションを取得しています。認証セッションが成功した場合、そのセッションを`AuthCognitoTokensProvider`としてキャストし、それからIDトークンを取得します。

このコードスニペットは、既にユーザーが認証済みであることを前提としています。もしまだ認証していない場合は、まず`Amplify.Auth.signIn`やその他の認証メソッドを使用してユーザーを認証する必要があります。

また、このコードは非同期で動作しますので、IDトークンが必要な処理を適切にハンドリングするためには、コールバックやPromise、Swift 5.5の新機能であるasync/awaitなどを使用する必要があります。

---

## 👤 ユーザー
*2023/6/22 3:29:41*

Amplify.Auth.fetchAuthSession を async/await のほうをつかってほしい。

---

## 🤖 アシスタント
*2023/6/22 3:30:31*

Swift 5.5のasync/await機能を使用してAmplify.Auth.fetchAuthSessionからIDトークンを非同期に取得する方法は以下の通りです。

ただし、現在（2023年6月22日時点）の公式のAmplify SDKはまだasync/awaitに対応していないため、以下のコードスニペットはフレームワークが非同期処理に対応していることを前提としたものです。

以下の関数`fetchIdToken`は非同期にIDトークンを取得します。

```swift
func fetchIdToken() async throws -> String {
    let session = try await Amplify.Auth.fetchAuthSession()
    if let cognitoTokensProvider = session as? AuthCognitoTokensProvider {
        let tokens = try cognitoTokensProvider.getCognitoTokens()
        return tokens.idToken
    }
    throw CustomError.unableToFetchToken
}
```

次に、この非同期関数をどのように呼び出すかを示します。

```swift
async {
    do {
        let idToken = try await fetchIdToken()
        print("ID token: \(idToken)")
    } catch {
        print("Failed to get ID token: \(error)")
    }
}
```

このコードは`fetchIdToken`関数を非同期に呼び出し、結果を待ってからprintします。もしIDトークンの取得に失敗した場合はエラーメッセージをprintします。

なお、上記の`CustomError.unableToFetchToken`はIDトークンが取得できない場合にスローされるエラーで、あなた自身で定義する必要があります。エラーの定義は次のようになるでしょう。

```swift
enum CustomError: Error {
    case unableToFetchToken
}
```

これらのコードスニペットはSwift 5.5の新機能であるasync/awaitを使用しています。async/awaitを使用すると、非同期コードを書くのがはるかに簡単になり、コードも読みやすくなります。しかし、現在のAmplify SDKはまだこの機能をサポートしていないので、今すぐにこのコードを使用することはできません。将来のAmplify SDKのバージョンでこの機能がサポートされることを期待しましょう。

---

## 👤 ユーザー
*2023/6/22 3:30:33*

fetchIdToken はguard文の方がいい気がする

---

## 🤖 アシスタント
*2023/6/22 3:31:00*

そうですね、guard文を使用することで、エラー処理を一箇所にまとめ、コードの可読性を高めることができます。

以下のように、guard文を使用して`fetchIdToken`関数を書き換えることができます。

```swift
enum CustomError: Error {
    case unableToFetchToken
}

func fetchIdToken() async throws -> String {
    let session = try await Amplify.Auth.fetchAuthSession()
    guard let cognitoTokensProvider = session as? AuthCognitoTokensProvider,
          let tokens = try? cognitoTokensProvider.getCognitoTokens() else {
        throw CustomError.unableToFetchToken
    }
    return tokens.idToken
}
```

ここでは、guard文を使ってセッションが`AuthCognitoTokensProvider`にキャストできること、そしてトークンが取得できることを確認しています。もしどちらかの条件が満たされなかった場合は、CustomError.unableToFetchTokenエラーをスローします。

これにより、関数の本体は成功パスに集中することができ、エラーハンドリングはguard文のブロック内にまとめられます。これはコードの読みやすさを向上させる一般的な手法です。

---

## 👤 ユーザー
*2023/6/22 3:31:16*

try? とする必要ってあるかな？

---

## 🤖 アシスタント
*2023/6/22 3:31:45*

ご指摘いただいた通り、ここで`try?`を使用すると、エラーが発生した場合に詳細なエラー情報が失われてしまいます。そのため、エラーが発生した際に原因を特定したい場合は、`try`を使用してエラーをキャッチし、それを再スローするとよいでしょう。以下にその例を示します。

```swift
enum CustomError: Error {
    case unableToFetchToken
    case cognitoError(Error)
}

func fetchIdToken() async throws -> String {
    let session = try await Amplify.Auth.fetchAuthSession()
    guard let cognitoTokensProvider = session as? AuthCognitoTokensProvider else {
        throw CustomError.unableToFetchToken
    }
    do {
        let tokens = try cognitoTokensProvider.getCognitoTokens()
        return tokens.idToken
    } catch {
        throw CustomError.cognitoError(error)
    }
}
```

ここでは、`CustomError`に新たに`cognitoError(Error)`ケースを追加しました。これはCognitoからのエラーをラップします。また、`getCognitoTokens()`の呼び出しは`do-catch`ブロックで行い、エラーが発生した場合は`cognitoError`として再スローします。

これにより、トークンの取得がなぜ失敗したのかについての詳細な情報を得ることができます。

---

## 👤 ユーザー
*2023/6/22 3:32:26*

これで行こう！一旦全文書いて欲しい

---

## 🤖 アシスタント
*2023/6/22 3:33:07*

もちろんです。ここに全体のコードをまとめています。このコードでは、`fetchIdToken`関数を定義し、非同期にIDトークンを取得します。エラーハンドリングにはguard文とdo-catchを使用しています。

```swift
import Amplify

// Define your custom error enum
enum CustomError: Error {
    case unableToFetchToken
    case cognitoError(Error)
}

// Define the function to fetch the ID token
func fetchIdToken() async throws -> String {
    let session = try await Amplify.Auth.fetchAuthSession()
    guard let cognitoTokensProvider = session as? AuthCognitoTokensProvider else {
        throw CustomError.unableToFetchToken
    }
    do {
        let tokens = try cognitoTokensProvider.getCognitoTokens()
        return tokens.idToken
    } catch {
        throw CustomError.cognitoError(error)
    }
}

// Call the function to fetch the ID token
async {
    do {
        let idToken = try await fetchIdToken()
        print("ID token: \(idToken)")
    } catch {
        switch error {
        case let CustomError.cognitoError(cognitoError):
            print("Failed to get Cognito tokens: \(cognitoError)")
        case CustomError.unableToFetchToken:
            print("Failed to fetch token.")
        default:
            print("An unexpected error occurred: \(error)")
        }
    }
}
```

上記の非同期ブロック内で`fetchIdToken`関数を呼び出し、結果を待ってからprintしています。エラーが発生した場合、その種類によって適切なエラーメッセージをprintしています。

このコードはSwift 5.5のasync/awaitを使用しており、非同期コードの書き方を大幅に簡易化しています。ただし、現時点でのAmplify SDKはこの機能をサポートしていないため、このコードはSDKがasync/awaitに対応したときに使えるものとなります。

---

## 👤 ユーザー
*2023/6/22 3:33:38*

Interceptorの方の処理も書いて欲しい

---

## 🤖 アシスタント
*2023/6/22 3:34:39*

もちろんです、トークンを取得する`fetchIdToken`関数とカスタムのリクエストインターセプターを組み合わせることで、各リクエストにAuthorizationヘッダーを追加できます。下記のように実装することができます。

```swift
import Amplify
import AmplifyPlugins
import AWSPluginsCore

// Define your custom error enum
enum CustomError: Error {
    case unableToFetchToken
    case cognitoError(Error)
}

// Define the function to fetch the ID token
func fetchIdToken() async throws -> String {
    let session = try await Amplify.Auth.fetchAuthSession()
    guard let cognitoTokensProvider = session as? AuthCognitoTokensProvider else {
        throw CustomError.unableToFetchToken
    }
    do {
        let tokens = try cognitoTokensProvider.getCognitoTokens()
        return tokens.idToken
    } catch {
        throw CustomError.cognitoError(error)
    }
}

// Create a custom interceptor
class AuthTokenURLRequestInterceptor: URLRequestInterceptor {
    let fetchIdToken: () async throws -> String

    init(fetchIdToken: @escaping () async throws -> String) {
        self.fetchIdToken = fetchIdToken
    }

    func intercept(_ request: URLRequest) throws -> URLRequest {
        var mutableRequest = request
        do {
            let token = try await fetchIdToken()
            mutableRequest.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        } catch {
            print("Failed to fetch ID token: \(error)")
        }
        return mutableRequest
    }
}

// Configure Amplify with the custom interceptor
async {
    do {
        let apiPlugin = AWSAPIPlugin()
        let configuration = try AWSAPIPluginConfiguration(interceptors:
            [AuthTokenURLRequestInterceptor(fetchIdToken: fetchIdToken)])
        try Amplify.add(plugin: apiPlugin)
        try Amplify.configure()
    } catch {
        print("Failed to configure Amplify: \(error)")
    }
}
```

上記のコードは、非同期にIDトークンを取得するための`fetchIdToken`関数とカスタムのリクエストインターセプター`AuthTokenURLRequestInterceptor`を定義しています。

このインターセプターは`URLRequestInterceptor`を実装し、`intercept(_:)`メソッド内でIDトークンを取得し、それを"Authorization"ヘッダフィールドに設定します。

そして、Amplifyを設定する際に、このカスタムインターセプターを含む`AWSAPIPluginConfiguration`を使用してAPIプラグインを設定します。

なお、インターセプターの実装はSDKがasync/awaitをサポートした時点でのもので、現時点ではAmplify SDKはこの機能をまだサポートしていないため、使用できません。ただし、SDKがasync/awaitに対応したときに使用可能になるでしょう。

---

## 👤 ユーザー
*2023/6/22 3:35:44*

こんなことしなくても AuthTokenURLRequestInterceptor をそのまま使えばいいのでは

---

## 🤖 アシスタント
*2023/6/22 3:36:06*

申し訳ありません、ご指摘の通りです。現時点では（2021年9月までの情報に基づいています）、AmplifyのAPIクエリに認証情報を付与するためには、通常はAPIカテゴリの設定を行い、認証モードを指定します。これにより、Amplifyは自動的に認証ヘッダをクエリに追加します。

しかし、あなたが特定の理由でカスタムインターセプターを使用したいと考えている場合、例えば特定のリクエストだけ異なる認証情報を使いたい場合など、自分でカスタムインターセプターを実装することは可能です。

なお、AWS Amplifyや関連するプラグインのAPIが日々進化しているので、最新の情報については公式ドキュメントをご確認ください。

---

## 👤 ユーザー
*2023/6/22 3:37:32*

AuthTokenURLRequestInterceptor をそのまま、apiPluginにaddできないのかな？

---

## 🤖 アシスタント
*2023/6/22 3:38:03*

現時点でのAmplifyの設定は、通常APIカテゴリの設定を使用し、認証モードを指定することで、Amplifyが自動的に認証ヘッダをクエリに追加します。したがって、`AuthTokenURLRequestInterceptor`を直接APIプラグインに追加する機能は提供されていません。

ただし、ある特定のリクエストに対してカスタムの認証ヘッダを設定するような特別なケースがある場合は、独自のリクエストインターセプタを作成し、それを使用することが可能です。

また、モバイルやウェブアプリケーションのバックエンドとしてAWSを使用する場合、アクセス制御はAWS IAM (Identity and Access Management)を使用して管理することが一般的です。これにより、リソースへのアクセスを制御し、特定のユーザやロールがリソースに対して実行できる操作を精密に制御することが可能です。

なお、AWS Amplifyや関連するプラグインのAPIは日々進化していますので、最新の情報については公式ドキュメントをご確認ください。

---

## 👤 ユーザー
*2023/6/22 3:46:45*

Cannot find 'AuthTokenURLRequestInterceptor' in scopeというエラーになった

---

## 🤖 アシスタント
*2023/6/22 3:47:14*

`AuthTokenURLRequestInterceptor`という名前のクラスや構造体が、Amplify FrameworkやAWS SDKには存在しません。そのため、`Cannot find 'AuthTokenURLRequestInterceptor' in scope`というエラーが発生します。

私が提案した`AuthTokenURLRequestInterceptor`はカスタムインターセプターの一例で、具体的な実装にはアプリケーションの要件によります。具体的なコード例を提示する前に、私が理解している課題があなたの実際のニーズと合致しているか確認させていただきたいです。

AmplifyのAPIリクエストに認証トークンを含めるために、どのような実装を検討していますか？ 通常のユースケースであれば、Amplifyの認証カテゴリ(Amplify.Auth)とAPIカテゴリ(Amplify.API)を連携させることで、認証情報を自動的にAPIリクエストに含めることが可能です。ただし、特殊なケースや特定の要件がある場合は、それに応じたカスタムの実装が必要になるかもしれません。

---

## 👤 ユーザー
*2023/6/22 3:48:55*

なるほど。ではこれをこのまま使ってみたいのだけれどもどうすればいい？

import Amplify
import AWSPluginsCore
import Foundation

struct AuthTokenURLRequestInterceptor: URLRequestInterceptor {

    let authTokenProvider: AuthTokenProvider

    init(authTokenProvider: AuthTokenProvider) {
        self.authTokenProvider = authTokenProvider
    }

    func intercept(\_ request: URLRequest) async throws -&gt; URLRequest {

        guard let mutableRequest = (request as NSURLRequest).mutableCopy() as? NSMutableURLRequest else {
            throw APIError.unknown("Could not get mutable request", "")
        }
        let date = Date()
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = AWSAPIPluginsCore.AWSDateISO8601DateFormat2
        let amzDate = dateFormatter.string(from: date)

        mutableRequest.setValue(amzDate,
                                forHTTPHeaderField: URLRequestConstants.Header.xAmzDate)
        mutableRequest.setValue(URLRequestConstants.ContentType.applicationJson,
                                forHTTPHeaderField: URLRequestConstants.Header.contentType)
        mutableRequest.setValue(AWSAPIPluginsCore.baseUserAgent(),
                                forHTTPHeaderField: URLRequestConstants.Header.userAgent)
        
        let token: String
        do {
            token = try await authTokenProvider.getUserPoolAccessToken()
        } catch {
            throw APIError.operationError("Failed to retrieve authorization token.", "", error)
        }
        
        mutableRequest.setValue(token, forHTTPHeaderField: "authorization")
        return mutableRequest as URLRequest
    }
}

---

## 🤖 アシスタント
*2023/6/22 3:49:40*

あなたが提供した `AuthTokenURLRequestInterceptor` はすでに良い形で実装されています。これを使用するには、次のようにAmplify APIの設定に追加する必要があります。以下のコードは例ですので、具体的な実装についてはアプリケーションの要件に応じて適宜変更してください。

```swift
import Amplify
import AmplifyPlugins
import AWSPluginsCore
import Foundation

// Your AuthTokenURLRequestInterceptor implementation
struct AuthTokenURLRequestInterceptor: URLRequestInterceptor {
    ...
}

// Your AuthTokenProvider implementation
struct MyAuthTokenProvider: AuthTokenProvider {
    ...
}

do {
    // Configure Amplify
    try Amplify.add(plugin: AWSAPIPlugin(modelRegistration: AmplifyModels()))
    try Amplify.add(plugin: AWSCognitoAuthPlugin())
    
    let apiConfig = APICategoryConfiguration(
        plugins: [
            "awsAPIPlugin": [
                "MyAPI": [
                    "endpointType": "REST",
                    "endpoint": "https://myapi.com",
                    "region": "us-east-1",
                    "authorizationType": "AMAZON_COGNITO_USER_POOLS",
                    "interceptors": ["AuthTokenURLRequestInterceptor"]
                ]
            ]
        ]
    )

    let amplifyConfig = AmplifyConfiguration(api: apiConfig)
    try Amplify.configure(amplifyConfig)

    print("Amplify configured with API and Auth plugins")
} catch {
    print("Failed to initialize Amplify with \(error)")
}
```

上記の設定では、MyAPIという名前のAPIに対して `AuthTokenURLRequestInterceptor` を適用しています。`AuthTokenProvider`の実装は示されていませんが、具体的な実装はCognitoのIDトークンを非同期に取得する方法に依存します。

なお、上記のコード例はあくまで一例であり、具体的な設定はAPIの要件によります。Amplify Frameworkの設定は柔軟性が高く、プラグインやAPIの設定を自由にカスタマイズできます。より詳しい情報についてはAmplifyの公式ドキュメントを参照してください。

---
