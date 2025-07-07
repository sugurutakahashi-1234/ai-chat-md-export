# SwiftUI Amplify 導入方法

日付: 2023-05-10

---

## 👤 ユーザー
*2023/5/10 18:12:25*

SwiftUI Amplify 使い方導入方法

---

## 🤖 アシスタント
*2023/5/10 18:15:28*

SwiftUIとAmplifyを使って、AWSのサービスを簡単にアプリに統合する方法を説明します。Amplifyは、認証、API、ストレージ、データ同期などの機能を提供し、開発を容易にします。以下の手順に従って、SwiftUIとAmplifyを使ってプロジェクトを設定してください。

1. 環境設定:
まず、Xcodeがインストールされていることを確認してください。次に、Amplify CLIをインストールして、AWSアカウントと連携させます。

```
npm install -g @aws-amplify/cli
amplify configure
```

2. 新しいSwiftUIプロジェクトを作成:
Xcodeを開いて、新しいプロジェクトを作成します。プロジェクトを作成する際に、「Interface」を「SwiftUI」に、「Life Cycle」を「SwiftUI App」に設定してください。

3. Amplifyをプロジェクトに追加:
プロジェクトディレクトリに移動し、以下のコマンドを実行してAmplifyを初期化します。

```
cd <YourProjectDirectory>
amplify init
```

4. 必要なAmplifyライブラリをインストール:
Swift Package Managerを使って、Amplifyライブラリをプロジェクトに追加します。Xcodeで、「File」>「Add Packages」を選択し、以下のURLを追加してください。

```
https://github.com/aws-amplify/amplify-ios
```

5. Amplifyカテゴリーを追加:
Amplify CLIを使って、認証やAPIなどの機能を追加します。例えば、認証を追加するには以下のコマンドを実行してください。

```
amplify add auth
```

6. Amplifyをデプロイ:
以下のコマンドを実行して、Amplifyの設定をクラウドにデプロイします。

```
amplify push
```

7. プロジェクトにAmplifyをインポート:
プロジェクトの`<YourProjectName>App.swift`ファイルに、Amplifyライブラリをインポートします。

```swift
import Amplify
import AmplifyPlugins
```

8. Amplifyを設定:
`<YourProjectName>App.swift`の`init`メソッド内で、Amplifyを設定してください。

```swift
init() {
    configureAmplify()
}

private func configureAmplify() {
    do {
        try Amplify.add(plugin: AWSCognitoAuthPlugin())
        try Amplify.configure()
        print("Amplify configured with auth plugin")
    } catch {
        print("Failed to initialize Amplify with \(error)")
    }
}
```

これで、SwiftUIプロジェクトにAmplifyが導入されました。Amplify

---

## 👤 ユーザー
*2023/5/10 18:15:35*

つづき

---

## 🤖 アシスタント
*2023/5/10 18:18:20*

Amplifyを導入したら、さまざまな機能をアプリに統合できます。ここでは、認証とAPIを追加する方法について説明します。

1. 認証の追加:

Amplifyを使って、簡単にユーザー認証を実装できます。まず、認証UIコンポーネントをインポートする必要があります。以下のURLをSwift Package Managerを使って追加してください。

```
https://github.com/aws-amplify/amplify-ios
```

次に、`Amplify.Auth`を使って認証機能を実装します。以下は、サインアップとサインインの例です。

```swift
import Amplify
import AmplifyPlugins

func signUp(username: String, password: String, email: String) {
    let userAttributes = [AuthUserAttribute(.email, value: email)]
    let options = AuthSignUpRequest.Options(userAttributes: userAttributes)
    
    Amplify.Auth.signUp(username: username, password: password, options: options) { result in
        switch result {
        case .success(let signUpResult):
            print("Sign up succeeded: \(signUpResult)")
        case .failure(let error):
            print("Sign up failed: \(error)")
        }
    }
}

func signIn(username: String, password: String) {
    Amplify.Auth.signIn(username: username, password: password) { result in
        switch result {
        case .success(let signInResult):
            print("Sign in succeeded: \(signInResult)")
        case .failure(let error):
            print("Sign in failed: \(error)")
        }
    }
}
```

2. APIの追加:

Amplifyを使って、APIを簡単に追加できます。GraphQLやRESTful APIを使用できます。まず、以下のコマンドを実行して、APIをプロジェクトに追加します。

```
amplify add api
```

APIをデプロイするには、以下のコマンドを実行してください。

```
amplify push
```

次に、APIを呼び出すためのコードを追加します。以下は、GraphQL APIを呼び出す例です。

```swift
import Amplify
import AmplifyPlugins

func fetchTodos() {
    Amplify.API.query(request: .list(Todo.self)) { result in
        switch result {
        case .success(let todos):
            print("Fetched todos: \(todos)")
        case .failure(let error):
            print("Failed to fetch todos: \(error)")
        }
    }
}

func createTodo(title: String, description: String) {
    let todo = Todo(title: title, description: description)
    Amplify.API.mutate(request: .create(todo)) { result in
        switch result {
        case .success(let createdTodo):
            print("Created todo: \(createdTodo)")
        case .failure(let error):
            print("Failed to create todo: \(error)")
        }
    }
}
```

これで、SwiftUIとAmplifyを使って、認証やAPIを含むアプリを簡単に作成できます。他にも、Amplifyはストレージやデ

---

## 👤 ユーザー
*2023/5/10 18:18:27*

つづく

---

## 🤖 アシスタント
*2023/5/10 18:21:31*

ータ同期などの機能も提供しています。以下は、ストレージとデータ同期の例です。

3. ストレージの追加:

Amplifyを使って、簡単にS3バケットにファイルをアップロードしたり、ダウンロードしたりできます。まず、以下のコマンドを実行して、ストレージをプロジェクトに追加します。

```
amplify add storage
```

ストレージをデプロイするには、以下のコマンドを実行してください。

```
amplify push
```

次に、ファイルのアップロードとダウンロードのコードを追加します。

```swift
import Amplify
import AmplifyPlugins

func uploadFile(key: String, localURL: URL) {
    Amplify.Storage.uploadFile(key: key, local: localURL) { result in
        switch result {
        case .success(let data):
            print("File uploaded successfully: \(data)")
        case .failure(let error):
            print("Failed to upload file: \(error)")
        }
    }
}

func downloadFile(key: String, localURL: URL) {
    Amplify.Storage.downloadFile(key: key, to: localURL) { result in
        switch result {
        case .success(let data):
            print("File downloaded successfully: \(data)")
        case .failure(let error):
            print("Failed to download file: \(error)")
        }
    }
}
```

4. データ同期の追加:

Amplify DataStoreを使用して、オフラインとオンラインのデータ同期を簡単に実現できます。まず、以下のコマンドを実行して、DataStoreをプロジェクトに追加します。

```
amplify add datastore
```

データ同期をデプロイするには、以下のコマンドを実行してください。

```
amplify push
```

次に、データを保存および取得するコードを追加します。

```swift
import Amplify
import AmplifyPlugins

func saveTodo(title: String, description: String) {
    let todo = Todo(title: title, description: description)
    Amplify.DataStore.save(todo) { result in
        switch result {
        case .success(let savedTodo):
            print("Saved todo: \(savedTodo)")
        case .failure(let error):
            print("Failed to save todo: \(error)")
        }
    }
}

func fetchTodosFromDataStore() {
    Amplify.DataStore.query(Todo.self) { result in
        switch result {
        case .success(let todos):
            print("Fetched todos from DataStore: \(todos)")
        case .failure(let error):
            print("Failed to fetch todos from DataStore: \(error)")
        }
    }
}
```

これで、SwiftUIとAmplifyを使って、ストレージやデータ同期を含むアプリを簡単に作成できます。Amplifyは他にも、Geo、Predictions、PubSubなどの機能を提供しており、開発を容易にします。

---

## 👤 ユーザー
*2023/5/10 18:23:08*

GoogleService-info.plist みたいな設定ファイルは Amplify には必要ないのかな

---

## 🤖 アシスタント
*2023/5/10 18:24:36*

Amplifyでは、`GoogleService-Info.plist`のような設定ファイルは必要ありません。代わりに、Amplifyは`amplifyconfiguration.json`と`awsconfiguration.json`という設定ファイルを使用します。これらのファイルは、Amplify CLIを使ってプロジェクトに追加されたAmplifyカテゴリに関する設定情報を含んでいます。

`amplify init`コマンドを実行すると、プロジェクトディレクトリに`amplify`フォルダが作成され、その中に`amplifyconfiguration.json`と`awsconfiguration.json`ファイルが生成されます。これらのファイルは、AmplifyがAWSリソースにアクセスするために必要な情報を提供します。

通常、これらのファイルはリポジトリにコミットして共有することができますが、機密情報を含んでいる場合は、適切なセキュリティ対策を検討してください。また、Amplify CLIを使ってカテゴリを追加または変更すると、設定ファイルが自動的に更新されます。

---

## 👤 ユーザー
*2023/5/10 18:25:35*

amplifyconfiguration.jsonとawsconfiguration.json は Xcode 側に取り入れる必要あるのかな

---

## 🤖 アシスタント
*2023/5/10 18:27:37*

はい、`amplifyconfiguration.json`と`awsconfiguration.json`ファイルは、Xcodeプロジェクトに取り込む必要があります。これらのファイルは、アプリがAmplifyを使用してAWSリソースにアクセスするために必要な設定情報を提供します。

Amplify CLIを使ってプロジェクトを初期化（`amplify init`）し、カテゴリを追加または更新すると、通常はこれらのファイルが自動的にプロジェクトディレクトリに生成され、Xcodeプロジェクトに追加されます。

もし、ファイルがXcodeプロジェクトに含まれていない場合は、手動で追加することができます。次の手順に従ってファイルを追加してください：

1. Xcodeを開いて、プロジェクトナビゲーターに移動します。
2. プロジェクトディレクトリにある`amplifyconfiguration.json`と`awsconfiguration.json`ファイルを選択し、ドラッグアンドドロップでプロジェクトナビゲーターに追加します。
3. ファイルが選択された状態で、「File Inspector」を開き、ターゲットメンバーシップのチェックボックスをオンにします。これにより、ファイルがプロジェクトのターゲットに含まれるようになります。

これで、`amplifyconfiguration.json`と`awsconfiguration.json`ファイルがXcodeプロジェクトに追加され、アプリがAmplifyを使用してAWSリソースにアクセスできるようになります。

---

## 👤 ユーザー
*2023/5/10 18:41:18*

awsconfiguration.json と amplifyconfiguration.json の入手方法を教えて、これはサーバーサイドエンジニアが発行してくるものなの？それともiOSエンジニアが作成するの？

---

## 🤖 アシスタント
*2023/5/10 18:43:33*

`awsconfiguration.json`と`amplifyconfiguration.json`ファイルは、Amplify CLIを使用してプロジェクトを初期化し、カテゴリを追加または更新した後に自動的に生成されます。これらのファイルは、アプリがAmplifyを使用してAWSリソースにアクセスするために必要な設定情報を提供します。

プロジェクトの初期化とカテゴリの追加・更新は、サーバーサイドエンジニアやiOSエンジニアのどちらが行っても構いません。ただし、Amplify CLIの操作に慣れている人が行うことをお勧めします。ファイルの生成には、次の手順を実行します。

1. プロジェクトディレクトリでAmplify CLIを使ってプロジェクトを初期化します。

   ```
   amplify init
   ```

2. 必要なAmplifyカテゴリ（認証、API、ストレージなど）を追加または更新します。

   ```
   amplify add <category>
   ```

   例えば、認証を追加する場合は、次のコマンドを実行します。

   ```
   amplify add auth
   ```

3. 変更をデプロイして、AWSリソースを作成または更新します。

   ```
   amplify push
   ```

これらの手順を完了すると、プロジェクトディレクトリに`amplify`フォルダが作成され、その中に`awsconfiguration.json`と`amplifyconfiguration.json`ファイルが生成されます。

生成されたファイルは、プロジェクトのメンバー（iOSエンジニアを含む）と共有して、アプリがAmplifyを使用してAWSリソースにアクセスできるようにする必要があります。ただし、機密情報を含む場合は、適切なセキュリティ対策を検討してください。

---

## 👤 ユーザー
*2023/5/10 18:44:17*

amplify push した情報はAWSコンソールで確認できる？

---

## 🤖 アシスタント
*2023/5/10 18:46:52*

はい、`amplify push`でデプロイされたリソースはAWSコンソールを通じて確認することができます。`amplify push`コマンドは、Amplify CLIを使って定義されたAWSリソースを作成または更新します。リソースは、各カテゴリに応じたAWSサービスにデプロイされます。例えば、認証カテゴリはAmazon Cognito、APIカテゴリはAWS AppSyncやAmazon API Gateway、ストレージカテゴリはAmazon S3などです。

AWSコンソールでリソースを確認するには、以下の手順を実行してください。

1. AWSコンソール（https://aws.amazon.com/console/）にサインインします。
2. サービスの一覧から、確認したいリソースに対応するサービスを選択します。例えば、認証リソースを確認する場合は、Amazon Cognitoを選択します。
3. サービスコンソールを使って、リソースの詳細を確認します。リソース名は、Amplify CLIを使って定義された名前と同じになります。

また、AWSコンソールでAmplify Consoleを使ってデプロイされたアプリケーションを確認することもできます。これには、次の手順を実行してください。

1. AWSコンソールにサインインし、サービスの一覧からAmplify Consoleを選択します。
2. 左側のメニューから、「All apps」をクリックします。
3. デプロイされたアプリケーションの一覧が表示されます。アプリケーション名をクリックして、詳細情報やリソースを確認できます。

Amplify Consoleを使って、フロントエンドアプリケーションのホスティングやCI/CDパイプラインの設定も行うことができます。

---

## 👤 ユーザー
*2023/5/10 18:47:45*

もうすでにサービスが用意されている状態なんだ。この場合ってどうやってawsconfiguration.jsonとamplifyconfiguration.jsonファイルをしゅとくすればいい？

---

## 🤖 アシスタント
*2023/5/10 18:50:26*

すでにAWSリソースが用意されている場合、まずAmplify CLIを使って既存のリソースをローカルのAmplifyプロジェクトに紐付ける必要があります。これには、`amplify pull`コマンドを使用します。`amplify pull`は、Amplifyプロジェクトのバックエンド環境として既存のリソースを追加し、`awsconfiguration.json`および`amplifyconfiguration.json`ファイルを生成します。

以下の手順に従って、既存のリソースをローカルプロジェクトに紐付けてください：

1. ローカルのプロジェクトディレクトリに移動します。

2. 次のコマンドを実行して、既存のバックエンド環境をローカルプロジェクトに紐付けます。

   ```
   amplify pull --appId <your_aws_amplify_app_id> --envName <your_environment_name>
   ```

   `<your_aws_amplify_app_id>`と`<your_environment_name>`は、既存のAmplifyアプリと環境に対応するものに置き換えてください。

3. コマンドを実行すると、プロンプトに従ってプロジェクトの設定を行います。通常、プロジェクト名、プロジェクトタイプ（iOS、Androidなど）、プロファイル名などを指定します。

4. 設定が完了すると、ローカルプロジェクトディレクトリに`amplify`フォルダが作成され、`awsconfiguration.json`および`amplifyconfiguration.json`ファイルが生成されます。

生成された`awsconfiguration.json`および`amplifyconfiguration.json`ファイルを、Xcodeプロジェクトに追加して使用してください。ファイルの追加方法については、先述の説明を参照してください。

---

## 👤 ユーザー
*2023/5/10 18:52:57*

どのディレクトリにawsconfiguration.jsonおよびamplifyconfiguration.jsonを入れればいいのかな

---

## 🤖 アシスタント
*2023/5/10 18:54:49*

`awsconfiguration.json`および`amplifyconfiguration.json`ファイルは、通常、Xcodeプロジェクトのルートディレクトリ（プロジェクトファイル`.xcodeproj`と同じ階層）に配置することが推奨されます。これにより、ファイルがプロジェクトと同じ場所に存在し、他のチームメンバーや開発者が簡単に見つけることができます。

Xcodeプロジェクトにファイルを追加する手順は以下の通りです。

1. Xcodeを開いて、プロジェクトナビゲーターに移動します。
2. プロジェクトディレクトリにある`awsconfiguration.json`と`amplifyconfiguration.json`ファイルを選択し、ドラッグアンドドロップでプロジェクトナビゲーターのルートディレクトリに追加します。
3. ファイルが選択された状態で、「File Inspector」を開き、ターゲットメンバーシップのチェックボックスをオンにします。これにより、ファイルがプロジェクトのターゲットに含まれるようになります。

これで、`awsconfiguration.json`および`amplifyconfiguration.json`ファイルがXcodeプロジェクトに追加され、アプリがAmplifyを使用してAWSリソースにアクセスできるようになります。

---

## 👤 ユーザー
*2023/5/10 18:56:04*

xcworkspace を使っていて複数、プロジェクトファイル.xcodeproj がある場合はどうすればいい。

---

## 🤖 アシスタント
*2023/5/10 18:58:18*

複数の`.xcodeproj`ファイルがある場合でも、`awsconfiguration.json`および`amplifyconfiguration.json`ファイルは通常、ルートディレクトリに配置することが推奨されます。ただし、それぞれのプロジェクトでAmplifyを使用する場合は、各プロジェクトのルートディレクトリにもファイルを追加する必要があります。

複数の`.xcodeproj`ファイルが含まれる`xcworkspace`でAmplifyを使用する場合、以下の手順を実行して各プロジェクトに`awsconfiguration.json`および`amplifyconfiguration.json`ファイルを追加してください。

1. Xcodeを開いて、`xcworkspace`を開きます。
2. プロジェクトナビゲーターで、Amplifyを使用する各プロジェクトのルートディレクトリを見つけます。
3. プロジェクトディレクトリにある`awsconfiguration.json`と`amplifyconfiguration.json`ファイルを選択し、ドラッグアンドドロップで各プロジェクトのルートディレクトリに追加します。
4. ファイルが選択された状態で、「File Inspector」を開き、ターゲットメンバーシップのチェックボックスをオンにします。これにより、ファイルが各プロジェクトのターゲットに含まれるようになります。

これで、`awsconfiguration.json`および`amplifyconfiguration.json`ファイルが各プロジェクトに追加され、アプリがAmplifyを使用してAWSリソースにアクセ

---

## 👤 ユーザー
*2023/5/10 18:58:29*

つづき

---

## 🤖 アシスタント
*2023/5/10 18:59:35*

アクセスできるようになります。

プロジェクト間で異なるAmplify設定が必要な場合は、それぞれのプロジェクトで独自の`awsconfiguration.json`および`amplifyconfiguration.json`ファイルを使用してください。これにより、プロジェクトごとに異なるAWSリソースを管理できます。

注意すべき点として、複数のプロジェクトで共通のAmplify設定を使用する場合は、コードの重複や管理の複雑さを避けるために、共通のコンポーネントやモジュールを作成して、それらを各プロジェクトでインポートして使用することが推奨されます。これにより、Amplify設定を一元管理し、変更が必要な場合に一箇所で変更するだけで済むようになります。

---

## 👤 ユーザー
*2023/5/10 19:49:08*

Amplifyをチームで共有したいのだが、gitで管理すべきファイルやフォルダの対象をおしえてほしい

---

## 🤖 アシスタント
*2023/5/10 19:52:13*

Amplifyをチームで共有する場合、Gitで管理する必要がある主要なファイルとフォルダを以下に示します。

1. **amplify** フォルダ: このフォルダは、Amplify CLIを使用してプロジェクトを構成する際に生成され、バックエンドリソースとローカル環境の設定情報を格納します。チームメンバーが同じバックエンドリソースを共有できるようにするために、このフォルダをGitで管理することが重要です。

2. **awsconfiguration.json** および **amplifyconfiguration.json**: これらのファイルには、Amplifyプロジェクトのバックエンドリソースと通信するために必要な設定が含まれています。これらのファイルをGitで管理することで、チームメンバーがプロジェクトを簡単にセットアップできるようになります。

ただし、リポジトリに機密情報（APIキー、パスワードなど）が含まれていないことを確認してください。機密情報は環境変数や秘密情報管理システムを使用して管理し、Gitリポジトリからは排除してください。

また、`.gitignore`ファイルには、一般的にバージョン管理から除外されるべきファイルやフォルダが含まれています。Amplify CLIを使用すると、デフォルトで次のエントリが`.gitignore`ファイルに追加されます。

```
#amplify
amplify/\#current-cloud-backend
amplify/.config/local-*
amplify/logs
amplify/mock-data
amplify/backend/amplify-meta.json
amplify/backend/awscloudformation
amplify/backend/.temp
```

これらのエントリは、一時ファイルや環境固有の設定、ローカルでの開発に関連するファイルをGitリポジトリから除外するために追加されます。`.gitignore`ファイルにこれらのエントリが含まれていることを確認し、必要に応じてカスタマイズしてください。

これらのファイルとフォルダをGitで管理することで、チームメンバーは同じAmplifyプロジェクト設定とバックエンドリソースを共有でき、効率的に協力して開発を進めることができます。

---
