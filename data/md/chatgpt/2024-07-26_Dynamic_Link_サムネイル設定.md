# Dynamic Link サムネイル設定

日付: 2024-07-26

---

## 👤 ユーザー
*2024/07/26 11:25:26*

firebase の ダイナミックリンクで生成した URL について、URLを使った際にのサムネイルを設定したい。どうすればいいか？

---

## 🤖 アシスタント
*2024/07/26 11:25:37*

Firebase Dynamic Linksで生成したURLにサムネイルを設定するには、URLのメタタグを使用してOpen Graphプロトコルを利用する方法が一般的です。以下の手順に従って、サムネイルを設定できます。

1. **HTMLページにメタタグを追加する**:
   Dynamic LinkがリダイレクトするターゲットページのHTMLに、Open Graphメタタグを追加します。これにより、リンクがシェアされたときにサムネイル画像が表示されます。

   ```html
   <html>
   <head>
       <meta property="og:title" content="ページのタイトル" />
       <meta property="og:description" content="ページの説明" />
       <meta property="og:image" content="https://example.com/path/to/thumbnail.jpg" />
       <meta property="og:url" content="https://example.com/target-page" />
   </head>
   <body>
       <!-- ページの内容 -->
   </body>
   </html>
   ```

2. **Firebase ConsoleでDynamic Linkを作成する**:
   Firebase ConsoleでDynamic Linkを作成するときに、ターゲットURLとして上記で設定したメタタグを含むページを指定します。

3. **Dynamic Linkのカスタムパラメータを設定する（オプション）**:
   より高度な設定が必要な場合は、Dynamic Linkのカスタムパラメータを使用して、サムネイル画像やその他の情報を設定することもできます。

   ```json
   {
     "dynamicLinkInfo": {
       "domainUriPrefix": "https://example.page.link",
       "link": "https://example.com/target-page",
       "socialMetaTagInfo": {
         "socialTitle": "ページのタイトル",
         "socialDescription": "ページの説明",
         "socialImageLink": "https://example.com/path/to/thumbnail.jpg"
       }
     }
   }
   ```

4. **設定を確認する**:
   URLをシェアするプラットフォームで、サムネイル画像やその他のメタ情報が正しく表示されることを確認します。

以上の手順を実行することで、Firebase Dynamic Linksで生成したURLを使用した際に、指定したサムネイル画像が表示されるようになります。

---

## 👤 ユーザー
*2024/07/26 11:32:08*

Firebase Dynamic Links x Open Graph Protocol x Swiftで実装したい。

---

## 🤖 アシスタント
*2024/07/26 11:32:22*

Firebase Dynamic LinksとOpen Graph Protocolを使用して、Swiftで実装する手順を以下に示します。

1. **Firebase Dynamic Linksのセットアップ**:
   まず、Firebaseプロジェクトを作成し、Dynamic Linksを設定します。以下の手順で進めます。

   - Firebaseコンソールで新しいプロジェクトを作成または既存のプロジェクトを選択します。
   - 左側のナビゲーションメニューから「Dynamic Links」を選択し、セットアップを完了します。
   - 「新しいDynamic Linkを作成」を選択して、リンクのドメインを設定します。

2. **ターゲットページにOpen Graphメタタグを追加する**:
   Dynamic LinkがリダイレクトするターゲットページのHTMLに、Open Graphメタタグを追加します。これにより、リンクがシェアされたときにサムネイル画像が表示されます。

   ```html
   <html>
   <head>
       <meta property="og:title" content="ページのタイトル" />
       <meta property="og:description" content="ページの説明" />
       <meta property="og:image" content="https://example.com/path/to/thumbnail.jpg" />
       <meta property="og:url" content="https://example.com/target-page" />
   </head>
   <body>
       <!-- ページの内容 -->
   </body>
   </html>
   ```

3. **SwiftでDynamic Linkを生成する**:
   SwiftでFirebase Dynamic Linksを生成するために、以下のコードを使用します。まず、Firebase SDKをインストールしてプロジェクトに追加します。

   ```bash
   pod 'Firebase/Analytics'
   pod 'Firebase/DynamicLinks'
   ```

   次に、`AppDelegate`でFirebaseを初期化します。

   ```swift
   import Firebase

   @UIApplicationMain
   class AppDelegate: UIResponder, UIApplicationDelegate {

       var window: UIWindow?

       func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
           FirebaseApp.configure()
           return true
       }
   }
   ```

   Dynamic Linkを生成するコードを追加します。

   ```swift
   import FirebaseDynamicLinks

   func generateDynamicLink() {
       guard let link = URL(string: "https://example.com/target-page") else { return }
       
       let dynamicLink = DynamicLinkComponents(link: link, domainURIPrefix: "https://example.page.link")
       
       dynamicLink?.iOSParameters = DynamicLinkIOSParameters(bundleID: Bundle.main.bundleIdentifier!)
       dynamic

---
