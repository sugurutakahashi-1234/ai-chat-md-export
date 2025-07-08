# SwiftUI Amplify.Analytics セットアップ

Date: 2023-06-08

---

## 👤 User
*2023-06-08 20:42:19*

SwiftUI で Amplify.Analytics を使ってデータ収集したい、SDKはSPMですでに導入済みである。コグニトでのログインもすでに実装済みである。
ユーザーの設定だったり、Amplify.Analyticsの始め方をiOSエンジニア視点で教えて欲しい。

---

## 🤖 Assistant
*2023-06-08 20:43:27*

Amplify.AnalyticsはモバイルとWebのアプリケーションで分析を簡単に実装するためのAWS Amplifyの部分です。すでにAmplifyの設定がされていて、Cognitoによる認証ができているのであれば、Analyticsを使用するための基本的な手順は以下の通りです：

**Amplifyの設定**

最初にAmplify Analyticsの設定を行います。まずAmplify CLIがインストールされていることを確認し、それから以下のコマンドを実行します：

```bash
amplify add analytics
```

質問に従って設定を進めていきます。すべての設定が完了したら以下のコマンドでバックエンドに設定をプッシュします：

```bash
amplify push
```

**Analyticsの利用**

SwiftUIのコードでAmplifyをimportし、Analyticsを初期化します。

```swift
import Amplify
import AmplifyPlugins

func configureAmplify() {
    do {
        try Amplify.add(plugin: AWSCognitoAuthPlugin())
        try Amplify.add(plugin: AWSPinpointAnalyticsPlugin())
        try Amplify.configure()
        print("Amplify configured with analytics and auth plugin")
    } catch {
        print("Failed to initialize Amplify with \(error)")
    }
}
```

この関数はアプリケーションが初期化される時に一度だけ呼び出すべきです。多くの場合、`AppDelegate.swift`の `application(_:didFinishLaunchingWithOptions:)` メソッド内で行われます。

**イベントの記録**

次に、Analyticsを使用してイベントを記録する方法を見てみましょう。

```swift
let properties: AnalyticsProperties = [
    "isActive": true,
    "duration": 1000,
    "category": "Game",
    "score": 45000
]

Amplify.Analytics.record(event: "LevelComplete", properties: properties)
```

ここで、`record(event:properties:)`メソッドを使用してイベントを記録しています。`"LevelComplete"`はイベントの名前で、`properties`はイベントに関連する追加情報を含む辞書です。

**その他のメソッド**

Amplify.Analyticsには他にもいくつかの便利なメソッドがあります。

- `flushEvents()` : このメソッドは、現在キューに保存されているすべてのイベントを送信します。このメソッドを呼び出すと、キュー内のすべてのイベントが即座に送信され、新しいイベントは通常どおりバックグラウンドで自動的に送信されます。
- `registerGlobalProperties(_:)` : このメソッドを使用すると、すべて

---

## 👤 User
*2023-06-08 20:43:57*

つづき

---

## 🤖 Assistant
*2023-06-08 20:44:45*

すみません、メッセージが途中で切れてしまいました。

`registerGlobalProperties(_:)`メソッドは、すべてのイベントに適用される一連のグローバルプロパティを設定するのに使用します。これにより、すべてのイベントに一貫した情報を提供できます。

例えば、以下のように利用できます：

```swift
let globalProperties: AnalyticsProperties = [
    "AppVersion": "1.0",
    "OSVersion": "14.0"
]
Amplify.Analytics.registerGlobalProperties(globalProperties)
```

これにより、"AppVersion"と"OSVersion"の情報がすべてのイベントに自動的に追加されます。

グローバルプロパティの登録を解除するには `unregisterGlobalProperties(_:)` メソッドを使用します。このメソッドにプロパティの名前を配列で渡すことで、特定のグローバルプロパティの登録を解除できます。特に引数を指定せずに `unregisterGlobalProperties()` を呼び出すと、すべてのグローバルプロパティの登録が解除されます。

```swift
Amplify.Analytics.unregisterGlobalProperties(["AppVersion", "OSVersion"]) // 特定のプロパティの登録解除
Amplify.Analytics.unregisterGlobalProperties() // 全てのグローバルプロパティの登録解除
```

以上の方法でAmplify.Analyticsを利用し、ユーザーの行動データを収集することができます。各イベントのデータはAWSのAmplifyコンソールで確認することができます。これによりユーザーの行動を分析し、ユーザーエクスペリエンスの改善につなげることができます。

---

## 👤 User
*2023-06-08 20:45:08*

Amplify.Analytics.identifyUser()とかはやったほうがいいの？

---

## 🤖 Assistant
*2023-06-08 20:46:05*

はい、`Amplify.Analytics.identifyUser()`メソッドは、特定のユーザーに関連付けられた分析イベントを追跡するために非常に便利です。このメソッドは、ユーザーIDとユーザーの属性を受け取り、これらの情報を使用して分析イベントをそのユーザーに関連付けます。

例えば、以下のように使用できます：

```swift
let userAttributes: AnalyticsUserProfile.UserAttributes = [
    "email": "user@example.com",
    "name": "UserName",
    // 他に追跡したい属性があればここに追加します
]
let location = AnalyticsUserProfile.Location(latitude: 47.606209,
                                              longitude: -122.332069,
                                              postalCode: "98122",
                                              city: "Seattle",
                                              region: "WA",
                                              country: "USA")
let userProfile = AnalyticsUserProfile(name: "user101",
                                       email: "user@example.com",
                                       location: location,
                                       properties: ["plan": "premium"])
Amplify.Analytics.identifyUser("user101", withProfile: userProfile)
```

この例では、ユーザーのID（"user101"）、名前、メールアドレス、地理的な位置情報、およびその他のユーザー属性（プラン情報など）を分析サービスに送信しています。

これにより、イベントが特定のユーザーに関連付けられ、より詳細な分析を行うことができます。例えば、特定の地域やプランのユーザーがどの機能を最も多く使用しているか、どの機能が使われていないかなどを調べることが可能になります。

ただし、ユーザーデータの収集と利用には、プライバシー法規制（例えばGDPRやCCPAなど）に従う必要があります。必ずユーザーから適切な同意を得て、どの情報を収集し、それがどのように使用されるかを明確に説明するようにしてください。

---

## 👤 User
*2023-06-08 20:46:54*

disable()やenable()の設定は永続的なの？それともログインし直したら変わるの？

---

## 🤖 Assistant
*2023-06-08 20:47:47*

Amplify.Analyticsの`enable()`と`disable()`メソッドは、分析のデータ送信を有効化・無効化するためのメソッドです。

具体的には、`Amplify.Analytics.disable()`を呼び出すと、アプリケーションの分析イベントの記録は停止せずに続行されますが、そのデータの送信が停止します。したがって、分析のデータがAmplify Analyticsに送信されなくなります。

逆に、`Amplify.Analytics.enable()`を呼び出すと、分析のデータ送信が再開されます。

これらの設定は一時的なもので、アプリケーションのセッション間で持続するものではありません。つまり、アプリケーションが再起動されると、設定はリセットされ、データ送信はデフォルト（有効化）状態に戻ります。

したがって、ユーザーのログイン状態に関わらず、これらの設定はアプリケーションが再起動するたびにリセットされます。ユーザーがデータの送信を停止したいと決めた場合、その設定を永続化するための追加の仕組みを自身で実装する必要があります（例えば、ユーザー設定をローカルストレージに保存するなど）。

---

## 👤 User
*2023-06-10 01:25:37*

ログを送信するようなサンプルコードを書いてみて

---

## 🤖 Assistant
*2023-06-10 01:26:38*

もちろんです。以下に、ユーザーがボタンを押したときにログを送信するというシンプルなSwiftUIのビューのサンプルコードを書きます。

まず、AmplifyとAnalyticsのプラグインをimportします。

```swift
import SwiftUI
import Amplify
import AmplifyPlugins
```

次に、Amplifyを初期化し、ボタンが押されたときにAnalyticsイベントを記録するビューを作成します。

```swift
struct ContentView: View {
    init() {
        configureAmplify()
    }
    
    var body: some View {
        Button(action: {
            recordButtonPressEvent()
        }) {
            Text("Press me")
        }
    }
    
    private func configureAmplify() {
        do {
            try Amplify.add(plugin: AWSCognitoAuthPlugin())
            try Amplify.add(plugin: AWSPinpointAnalyticsPlugin())
            try Amplify.configure()
            print("Amplify configured with analytics and auth plugin")
        } catch {
            print("Failed to initialize Amplify with \(error)")
        }
    }
    
    private func recordButtonPressEvent() {
        let properties: AnalyticsProperties = [
            "buttonName": "Press me",
            "timestamp": String(describing: Date())
        ]
        
        Amplify.Analytics.record(event: "ButtonPress", properties: properties)
        print("Recorded ButtonPress event")
    }
}
```

このコードでは、`configureAmplify()`がビューの初期化の際に呼ばれ、Amplifyがセットアップされます。そして、ボタンが押されると`recordButtonPressEvent()`が呼び出され、"ButtonPress"という名前のAnalyticsイベントが記録されます。イベントには、ボタンの名前と押された時間をプロパティとして含みます。

このようにして、ユーザーの操作や振る舞いに関する情報を収集し、分析するためのログを送信することができます。

---

## 👤 User
*2023-06-10 01:27:20*

サーバーにはどのタイミングで送信されるの？

---

## 🤖 Assistant
*2023-06-10 01:28:31*

Amplify.Analyticsは、イベントデータをバッチで送信します。これは、イベントが発生した直後にすぐに送信されるわけではなく、一定の条件が満たされたときに複数のイベントをまとめて送信するという意味です。

具体的には、以下の条件のいずれかが満たされたときにイベントデータが送信されます：

- バッファーに保存されているイベントの数が一定の量（デフォルトでは30）に達した場合。
- 最後にイベントを送信してから一定の時間（デフォルトでは600秒＝10分）が経過した場合。

ただし、これらの具体的な値はSDKのバージョンや設定により異なる可能性があります。

また、アプリケーションがバックグラウンドに移行したときや終了したときにも、バッファーに残っているイベントが送信されます。さらに、`Amplify.Analytics.flushEvents()`を呼び出すことで、明示的にバッファーに残っているすべてのイベントを即座に送信することもできます。

---

## 👤 User
*2023-06-10 01:29:29*

エラーログだったり、ユーザーの設定処理など行たい。ログイベントをCognitoユーザーと紐づけたいんだ。Cognitoでアプリではログインするから情報も取れる。

---

## 🤖 Assistant
*2023-06-10 01:30:34*

それは可能です。Amplifyを使用して、Cognitoで認証されたユーザー情報と分析イベントを紐づけることができます。これにより、特定のユーザーがどのようなアクションを取ったか、どのようなエラーに遭遇したかなどの情報を把握することが可能になります。

すでにCognitoで認証機能を実装しているとのことなので、そのユーザー情報を用いてAnalyticsイベントを記録することができます。

まず、ユーザーがログインしたタイミングで`Amplify.Analytics.identifyUser()`を使い、そのユーザーを分析イベントに紐づけます。たとえば、次のようなコードで可能です：

```swift
func login() {
    // ログイン処理...
    
    // ログイン成功後にユーザーを分析に紐づける
    let userId = // Cognitoから取得したユーザーID
    let userAttributes: AnalyticsUserProfile.UserAttributes = [
        "email": // ユーザーのメールアドレス
        // 他に追跡したい属性があればここに追加します
    ]
    let userProfile = AnalyticsUserProfile(name: // ユーザーの名前
                                          email: // ユーザーのメールアドレス
                                          location: nil, 
                                          properties: ["plan": "premium"]) // プラン情報など
    Amplify.Analytics.identifyUser(userId, withProfile: userProfile)
}
```

そして、アクションを行ったタイミングやエラーが発生したタイミングで、`Amplify.Analytics.record()`を使ってそのイベントを記録します。例えば：

```swift
func updateUserSettings() {
    // 設定の更新処理...
    
    // 処理成功時
    Amplify.Analytics.record(event: "UpdateSettings")
    
    // エラー発生時
    Amplify.Analytics.record(event: "UpdateSettingsError")
}
```

このようにすることで、Cognitoのユーザー情報と分析イベントを紐づけることができます。ただし、ユーザーのプライバシーを尊重し、必要な情報のみを取得するように注意してください。

---

## 👤 User
*2023-06-10 01:31:34*

正直、ユーザーIDだけでいい気がするけど、userIDはどうやって取得するの？

---

## 🤖 Assistant
*2023-06-10 01:32:41*

AWS CognitoでユーザーIDを取得する方法はいくつかありますが、一般的にはCognito User Poolsのユーザー属性から`sub`（Subject）属性を取得することが一般的です。この`sub`属性は、Cognitoで管理されるユーザーの一意の識別子であり、ユーザーが作成されたときに自動的に割り当てられます。

具体的な取得方法は、あなたが使用している認証フロー（例えば、ユーザー名とパスワードによる認証、ソーシャルログインなど）や使用しているライブラリによりますが、基本的には認証の結果として返されるユーザー情報から取得することができます。

例えば、AmplifyのAuth APIを使用している場合、次のようにすることで`sub`属性を取得できます：

```swift
func getUserId() {
    _ = Amplify.Auth.fetchAuthSession { result in
        switch result {
        case .success(let session):
            if let cognitoTokenProvider = session as? AuthCognitoTokensProvider {
                _ = cognitoTokenProvider.getCognitoTokens { result in
                    switch result {
                    case .success(let tokens):
                        print("User ID (sub) is \(tokens.sub)")
                    case .failure(let error):
                        print("Failed to get user tokens with error \(error)")
                    }
                }
            }
        case .failure(let error):
            print("Failed to fetch auth session \(error)")
        }
    }
}
```

このコードは、現在の認証セッションを取得し、そのセッションからCognitoのユーザートークンを取得します。そのトークンから`sub`属性を取得することができます。

取得した`sub`属性（ユーザーID）は、`Amplify.Analytics.identifyUser()`の引数として使用できます。これにより、分析イベントとユーザーIDが関連付けられます。

---

## 👤 User
*2023-06-10 01:36:36*

fetchAuthSession のインターフェースがこんな感じでAuthCognitoTokensProviderがしゅとくできなさそうなんだけどどうすればいいは手間

fetchAuthSession(options: AuthFetchSessionRequest.Options? = nil) async throws -&gt; AuthSession

---

## 🤖 Assistant
*2023-06-10 01:37:26*

あなたが引用したメソッドは、Swift 5.5以降で利用可能な非同期（async/await）APIを使用しています。このAPIは、Amplifyのバージョンが1.12.0以降であることを必要とします。

非同期APIを使ってCognitoのユーザーID（sub）を取得するためには、以下のようなコードを書くことができます：

```swift
func getUserId() async throws -> String? {
    let session = try await Amplify.Auth.fetchAuthSession(options: nil)

    if let cognitoTokenResult = session as? AuthCognitoTokensResultProvider {
        let tokens = try await cognitoTokenResult.fetchTokens()
        return tokens.sub
    }

    return nil
}
```

この関数は、認証セッションからユーザーのID（sub）を非同期に取得します。非同期関数なので、`await`キーワードを使用して呼び出す必要があります。この関数は失敗する可能性があるため、`try`キーワードも必要です。

以下はこの関数を使用してユーザーIDをログに出力する例です：

```swift
Task {
    do {
        if let userId = try await getUserId() {
            print("User ID is \(userId)")
        } else {
            print("Failed to get user ID")
        }
    } catch {
        print("Error occurred: \(error)")
    }
}
```

なお、このコードはSwift 5.5以降でのみ動作し、iOS 15以降、またはmacOS 12以降をターゲットにしているプロジェクトで使用することができます。

---

## 👤 User
*2023-06-10 01:39:01*

ひとつの関数で、Amplify.Auth.fetchAuthSession からトークンの取得から、Amplify.Analytics.identifyUser までやってほしい。取れる情報は取れるだけとって欲しい。

---

## 🤖 Assistant
*2023-06-10 01:39:56*

理解しました。以下に、`Amplify.Auth.fetchAuthSession`からユーザートークンの取得、そして`Amplify.Analytics.identifyUser`までを行う一つの関数を記述しました。可能な限りの情報を取得するようにしています：

```swift
func identifyAuthenticatedUser() async throws {
    // Authセッションの取得
    let session = try await Amplify.Auth.fetchAuthSession(options: nil)
    
    if let cognitoTokenResult = session as? AuthCognitoTokensResultProvider {
        // Cognitoのトークンを取得
        let tokens = try await cognitoTokenResult.fetchTokens()
        
        var userAttributes: [String: String] = [:]
        
        // 取得できる情報は取得してuserAttributesに保存
        userAttributes["sub"] = tokens.sub
        userAttributes["accessToken"] = tokens.accessToken
        userAttributes["idToken"] = tokens.idToken
        userAttributes["refreshToken"] = tokens.refreshToken

        // Analyticsにユーザーを登録
        let userProfile = AnalyticsUserProfile(name: nil,
                                               location: nil, 
                                               properties: nil)
        Amplify.Analytics.identifyUser(tokens.sub, withProfile: userProfile)
    } else {
        throw AmplifyError.authError // ここでは一般的なエラーをスローしていますが、適切なエラーハンドリングを行ってください
    }
}
```

この関数は非同期ですので、呼び出し方は以下のようになります：

```swift
Task {
    do {
        try await identifyAuthenticatedUser()
        print("Successfully identified the user.")
    } catch {
        print("Failed to identify the user: \(error)")
    }
}
```

これにより、Cognitoの認証情報を使用してユーザーをAnalyticsに登録できます。ただし、この関数はエラーハンドリングがシンプルになっていますので、本番のアプリケーションでは適切なエラーハンドリングを行ってください。

---

## 👤 User
*2023-06-10 01:40:31*

userAttributes ha\

---

## 🤖 Assistant
*2023-06-10 01:41:23*

`userAttributes`はユーザーの属性情報を格納するための辞書型の変数です。キーは属性の名前（文字列型）、値は属性の値（文字列型）となります。

`userAttributes`を`Amplify.Analytics.identifyUser()`に渡すことで、ユーザープロファイルに属性情報を追加することができます。この情報は分析イベントとともに送信され、ユーザーの行動をより詳細に分析するために使用することができます。

ただし、上記のコードでは`userAttributes`を生成した後でそれを使用していませんね。ご指摘いただき、ありがとうございます。以下のように修正して、`AnalyticsUserProfile`のインスタンス生成時に`userAttributes`を渡します：

```swift
func identifyAuthenticatedUser() async throws {
    // Authセッションの取得
    let session = try await Amplify.Auth.fetchAuthSession(options: nil)
    
    if let cognitoTokenResult = session as? AuthCognitoTokensResultProvider {
        // Cognitoのトークンを取得
        let tokens = try await cognitoTokenResult.fetchTokens()
        
        var userAttributes: [String: String] = [:]
        
        // 取得できる情報は取得してuserAttributesに保存
        userAttributes["sub"] = tokens.sub
        userAttributes["accessToken"] = tokens.accessToken
        userAttributes["idToken"] = tokens.idToken
        userAttributes["refreshToken"] = tokens.refreshToken

        // Analyticsにユーザーを登録
        let userProfile = AnalyticsUserProfile(name: nil,
                                               email: nil,
                                               location: nil, 
                                               properties: userAttributes)
        Amplify.Analytics.identifyUser(tokens.sub, withProfile: userProfile)
    } else {
        throw AmplifyError.authError // ここでは一般的なエラーをスローしていますが、適切なエラーハンドリングを行ってください
    }
}
```

なお、`userAttributes`にアクセストークンやIDトークンなどの認証情報を含めることは、セキュリティ上推奨されません。これらの情報は認証に使用されるため、第三者に漏れると不正なアクセスを許してしまう可能性があります。デモンストレーション目的で上記のコードに含めましたが、本番のアプリケーションではこれらの情報を含めないでください。

---

## 👤 User
*2023-06-10 11:55:19*

ちなみに、Amplifyでユーザーをセットしたりだとか、ログをrecordしたりしたときって、Xcode側にログってしゅつりょくされるのかな？

---

## 🤖 Assistant
*2023-06-10 11:55:52*

はい、Amplifyはデフォルトでは操作に関連するいくつかのログを出力します。これはデバッグ時にとても役立ちます。

ログレベルはAmplifyの設定で変更することができ、以下の5つのレベルから選択することができます：

1. error（エラー）：エラーのみを出力します。
2. warning（警告）：警告とエラーを出力します。
3. info（情報）：情報、警告、エラーを出力します。
4. debug（デバッグ）：デバッグ情報、情報、警告、エラーを出力します。
5. verbose（詳細）：全てのログを出力します。

デフォルトのログレベルは`warning`です。

ログレベルを変更するには、アプリの起動時（通常は`application(_:didFinishLaunchingWithOptions:)`メソッド内）に以下のようなコードを実行します：

```swift
Amplify.Logging.logLevel = .verbose
```

このコードはログレベルを`verbose`（詳細）に設定します。これにより、全てのログが出力されます。

Amplifyの操作に関連するログ（例えば、ユーザーの識別やログの記録）は、設定したログレベルに応じてXcodeのコンソールに出力されます。

ただし、特定の情報（例えば、具体的なログイベントの内容）はプライバシー保護のために出力されないことがあります。これはログが第三者に見られることを防ぐためです。

---

## 👤 User
*2023-06-10 14:36:06*

Amplify.Analytics.record(event: AnalyticsEvent) を飛ばすような具体的サンプルをじっそうしてみてほしい

---

## 🤖 Assistant
*2023-06-10 14:36:34*

もちろんです。以下に、`Amplify.Analytics.record(event: AnalyticsEvent)`を使用してカスタムイベントを記録する簡単な関数を作成しました。この関数はユーザーが特定のアクション（この例では"ButtonClicked"）を行ったときに呼び出すことができます。

```swift
func recordButtonClickedEvent() {
    // カスタムイベントの名前とプロパティを指定
    let eventName = "ButtonClicked"
    let eventProperties: [String: AnalyticsPropertyValue] = [
        "buttonColor": "blue",
        "buttonSize": "large"
    ]

    // AnalyticsEventを作成
    let event = AnalyticsEvent(name: eventName, properties: eventProperties)

    // イベントを記録
    Amplify.Analytics.record(event: event)

    print("ButtonClicked event recorded.")
}
```

この関数では、イベント名として"ButtonClicked"、プロパティとして"buttonColor"と"buttonSize"を指定しています。プロパティは、イベントの追加の詳細を提供します。この例では、ボタンの色とサイズをプロパティとして記録しています。

この関数をボタンのクリックイベントハンドラ内から呼び出すことで、ユーザーがボタンをクリックしたときにイベントを記録することができます。以下はその一例です：

```swift
Button("Click me") {
    recordButtonClickedEvent()
}
```

このように、`Amplify.Analytics.record(event: AnalyticsEvent)`を使うと、アプリ内の任意のアクションをカスタムイベントとして記録し、これを分析することができます。

---

## 👤 User
*2023-06-10 14:36:59*

'any AnalyticsEvent' cannot be constructed because it has no accessible initializers というエラーになった

---

## 🤖 Assistant
*2023-06-10 14:37:19*

ご指摘いただきありがとうございます。申し訳ありませんが、私の提供したコードは間違いがありました。`AnalyticsEvent`は直接初期化することはできません。代わりに、`BasicAnalyticsEvent`を使用して、イベントを作成して記録します。

以下が修正版のコードです：

```swift
func recordButtonClickedEvent() {
    // カスタムイベントの名前とプロパティを指定
    let eventName = "ButtonClicked"
    let eventProperties: [String: AnalyticsPropertyValue] = [
        "buttonColor": "blue",
        "buttonSize": "large"
    ]

    // BasicAnalyticsEventを作成
    let event = BasicAnalyticsEvent(name: eventName, properties: eventProperties)

    // イベントを記録
    Amplify.Analytics.record(event: event)

    print("ButtonClicked event recorded.")
}
```

`BasicAnalyticsEvent`は`AnalyticsEvent`の実装で、名前とプロパティを指定してカスタムイベントを作成するために使用できます。申し訳ありませんが、最初の情報が間違っていました。修正版のコードをお試しください。

---

## 👤 User
*2023-06-10 14:37:36*

BasicAnalyticsEvent 意外に何かあるかな？

---

## 🤖 Assistant
*2023-06-10 14:38:13*

AWS Amplify フレームワークの `Analytics` カテゴリーには、イベントを表現するための `AnalyticsEvent` というプロトコルが存在します。一方で、このプロトコルの具体的な実装としては、標準では `BasicAnalyticsEvent` のみが提供されています。

`BasicAnalyticsEvent` は最も基本的なイベントを表現するためのクラスで、イベントの名前と任意のプロパティを含むことができます。ほとんどの用途では、この `BasicAnalyticsEvent` を使ってアプリケーションのアクティビティを記録することができます。

ただし、特定の用途に応じてカスタムイベントを定義したい場合には、`AnalyticsEvent` プロトコルに準拠した自分自身のイベントクラスを作成することも可能です。これにより、イベントに独自の属性やメソッドを追加することができます。

ただし、このようなカスタムイベントクラスの作成は一般的なユースケースでは必要ないかもしれません。`BasicAnalyticsEvent` を使用して、イベント名とプロパティの組み合わせでアプリ内のほとんどのアクティビティを十分に表現することができます。

以下に、`AnalyticsEvent` プロトコルに準拠したカスタムイベントクラスの簡単な例を示します：

```swift
struct CustomAnalyticsEvent: AnalyticsEvent {
    let name: String
    let properties: [String: AnalyticsPropertyValue]
    let time: Date?
    let id: String

    init(name: String, properties: [String: AnalyticsPropertyValue], time: Date? = nil) {
        self.name = name
        self.properties = properties
        self.time = time
        self.id = UUID().uuidString
    }
}
```

この `CustomAnalyticsEvent` クラスでは、イベントにユニークな ID を追加しています。ただし、このようなカスタムイベントクラスの作成は、特定の要件を満たすために必要な場合にのみ行うべきです。

---

## 👤 User
*2023-06-10 23:48:28*

ちなみになんだけど、Amplify.Auth.fetchAuthSessionとかできる状態なんだけど、アクセストークンの期限とかリフレッシュトークンの期限とかどうやって取得できるの？

---

## 🤖 Assistant
*2023-06-10 23:49:33*

`Amplify.Auth.fetchAuthSession` を使用してアクセストークンやリフレッシュトークンの情報を取得することは可能ですが、これらのトークンの有効期限を直接取得することはできません。トークンの有効期限は、トークン自体にエンコードされていますが、これはJWT (JSON Web Tokens) 形式であるため、これをデコードすることで有効期限を取得することが可能です。

以下に、アクセストークンから有効期限を取得する簡単なコード例を示します：

```swift
do {
    let session = try await Amplify.Auth.fetchAuthSession() as! AuthCognitoTokensProvider
    let accessToken = try session.fetchAuthSessionTokens().accessToken

    // アクセストークンはJWTなので、これをデコードします。
    let parts = accessToken.components(separatedBy: ".")
    guard parts.count > 1 else { return }  // トークンが正しくない場合

    let payloadData = Data(base64Encoded: parts[1], options: .ignoreUnknownCharacters)
    guard let data = payloadData else { return }  // デコードに失敗した場合

    let json = try JSONSerialization.jsonObject(with: data, options: [])
    if let payload = json as? [String: Any], let exp = payload["exp"] as? TimeInterval {
        // 有効期限はエポック時間（1970年1月1日からの秒数）なので、これをDateに変換します。
        let expirationDate = Date(timeIntervalSince1970: exp)
        print("Access token expires at: \(expirationDate)")
    }
} catch {
    print("Error fetching auth session: \(error)")
}
```

ここでは、アクセストークン（JWT）をデコードし、有効期限を取得しています。JWTは3つの部分（ヘッダー、ペイロード、署名）から成り立っており、各部分はピリオドで区切られています。このコードでは、ペイロード部分をデコードし、有効期限（"exp"フィールド）を取得しています。

ただし、このコードはアクセストークンの有効期限を取得するためのものであり、リフレッシュトークンの有効期限は取得できません。リフレッシュトークンの有効期限は、アプリケーションには通常公開されないため、アプリケーション内でこれを取得することはできません。リフレッシュトークンの有効期限はAWS Cognitoサービスによって管理されます。

また、この方法はJWTをデコードするためのものであり、セキュリティの観点から、JWTをデコードする場合は注意が必要です。信頼できないJWT

---

## 👤 User
*2023-06-11 00:07:49*

もっと簡単にログインの有効期間がわかったりしないの？

---

## 🤖 Assistant
*2023-06-11 00:08:40*

AWS AmplifyのAuthモジュールで直接ログインセッションの有効期限を取得することはできません。これは、セッションの管理はAWS Cognitoサービスが行い、クライアント側ではその詳細な情報（例えばセッションの有効期限）にアクセスできないように設計されているからです。

Cognitoのセッションは、アクセストークンとリフレッシュトークンの2つの主要な要素で構成されています。

- アクセストークンは、APIリクエストに伴うユーザーの認証情報を提供します。Cognitoでは、アクセストークンの有効期限はデフォルトで1時間です。
- リフレッシュトークンは、アクセストークンが期限切れになったときに新しいアクセストークンを取得するために使用されます。リフレッシュトークンの有効期限はCognitoで設定することができ、デフォルトでは30日です。

そのため、セッションの有効期間とは、実質的にリフレッシュトークンの有効期間を指すことになります。ただし、この期間はCognitoの設定により変更できます。

セッションの有効期間を管理したい場合は、アプリケーション側で独自のセッション管理ロジックを実装することも可能です。たとえば、ログイン時に現在の日時を保存し、特定の期間（例えば24時間）が経過したらユーザーをログアウトさせる、といったような方法が考えられます。

ただし、セッションの管理はセキュリティ上重要なため、このような独自の実装を行う場合は、セキュリティのベストプラクティスを十分に理解し、適切なテストを行うことが重要です。

---
