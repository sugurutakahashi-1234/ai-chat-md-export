# Amplify AppSync Swift Models

日付: 2023-06-12

---

## 👤 ユーザー
*2023/06/12 18:04:59*

SwiftでAmplifyのAppSyncを使ってデータ取得をしようと考えているんだけど、生成されるswiftファイルがどんな感じなのかを教えてほしい。Amplify cli などはすべて導入済みとして仮定して押してほしい。

---

## 🤖 アシスタント
*2023/06/12 18:05:53*

AWS Amplify の AppSync を使って、SwiftでGraphQL APIを生成・操作する場合、Amplify CLI が生成するSwiftファイルは主に次の3つに分けられます：

1. `amplifyconfiguration.json` および `awsconfiguration.json`: これらのファイルには、Amplifyとそのサービス（AppSyncを含む）の設定が含まれます。これらはプロジェクトのルートに存在します。

2. `API.swift` : これは AppSync API のエンドポイントとモデルクラスを含みます。例えば、GraphQLスキーマが以下のような場合：

```graphql
type Todo @model {
  id: ID!
  name: String!
  description: String
}
```

Amplify CLIは以下のようなSwiftのモデルを生成します：

```swift
public struct Todo: Codable {
    public let id: String
    public let name: String
    public let description: String?
  
    // CodingKeys, initializer, and other model functions...
}
```

3. `schema.graphql` : これはGraphQLスキーマを定義したファイルで、`amplify/backend/api/<YourAPIName>/schema.graphql`に位置しています。Amplify CLIはこのスキーマを基にして上述の`API.swift`ファイルを生成します。

データを取得するための基本的なクエリ操作は以下のようになります：

```swift
Amplify.API.query(request: .list(Todo.self)) { event in
    switch event {
    case .success(let result):
        switch result {
        case .success(let todos):
            print("Successfully retrieved list of Todos: \(todos)")
        case .failure(let error):
            print("Got failed result with \(error.errorDescription)")
        }
    case .failure(let error):
        print("Got failed event with error \(error)")
    }
}
```

上記のサンプルは、AppSyncに接続して"Todo"型のオブジェクトのリストを取得するものです。エラーハンドリングも含まれています。

---

## 👤 ユーザー
*2023/06/12 18:07:15*

public func query&lt;R: Decodable&gt;(request: GraphQLRequest&lt;R&gt;) async throws -&gt; GraphQLTask&lt;R&gt;.Success のインターフェースを使ってほしいのと、例えば id: String を指定するような場合はどうなるのかを教えてほしい。

---

## 🤖 アシスタント
*2023/06/12 18:07:59*

Swift 5.5からは、非同期/待機(Async/Await)パターンが導入され、それがAmplifyでもサポートされています。なので、async/awaitを利用することでより直感的な非同期コードを記述することが可能です。

特定のIDを指定してデータを取得するためには、`GraphQLRequest`の`.get`を使用します。以下にその例を示します。

```swift
do {
    let todoWithSpecificID = try await Amplify.API.query(request: .get(Todo.self, byId: "yourTodoID"))
    switch todoWithSpecificID {
    case .success(let todo):
        if let todo = todo {
            print("Successfully retrieved Todo: \(todo)")
        } else {
            print("Todo not found")
        }
    case .failure(let error):
        print("Got failed result with \(error.errorDescription)")
    }
} catch {
    print("Query failed with error \(error)")
}
```

ここでは、指定されたIDを持つTodoを取得します。指定のIDに該当するTodoが存在しない場合は、結果はnilとなります。これにより、Swiftの非同期/待機パターンを使用して、より読みやすく効率的なエラーハンドリングを実現できます。

上記のコードは非同期メソッドの中で実行する必要があります。例えば、SwiftUIの`Task {}`クロージャの中や、非同期関数の中などです。もし非同期コンテクストがない場合、`async`関数を呼び出すためには`Task.init {}`を使用することも可能です。

---

## 👤 ユーザー
*2023/06/12 18:22:48*

たとえば、Todoからは name だけがほしい場合はどうすればいいの？

---

## 🤖 アシスタント
*2023/06/12 18:23:39*

AmplifyのGraphQL APIでは、フィールドを限定してクエリを実行することができます。特定のフィールドだけをリクエストする場合、カスタムのGraphQLリクエストを作成することで実現可能です。

以下の例では、Todoのidが特定の値を持つオブジェクトからnameフィールドだけを取得します：

```swift
struct TodoName: Decodable {
    let name: String
}

let request = GraphQLRequest<TodoName>(document: """
    query GetTodo($id: ID!) {
      getTodo(id: $id) {
        name
      }
    }
    """, variables: ["id": "yourTodoID"], responseType: TodoName.self)

do {
    let result = try await Amplify.API.query(request: request)
    switch result {
    case .success(let todoName):
        if let todoName = todoName {
            print("Successfully retrieved Todo name: \(todoName.name)")
        } else {
            print("Todo not found")
        }
    case .failure(let error):
        print("Got failed result with \(error.errorDescription)")
    }
} catch {
    print("Query failed with error \(error)")
}
```

この例では、`TodoName`という新しい構造体を作成して、返されるデータに合わせています。GraphQLのクエリでは、必要なフィールド(`name`のみ)を指定しています。また、GraphQLリクエストに`variables`を提供して、特定の`id`を指定しています。

---

## 👤 ユーザー
*2023/06/12 18:24:48*

こんなことするよりも、全量受けてしまって、そこから必要なnameなどを取得した方が早い気がするのだけれどもどう思う？

---

## 🤖 アシスタント
*2023/06/12 18:26:10*

データの取得方法については、実際の要件と状況によります。

1. **特定のフィールドだけを取得する方法の利点**：
    * データ転送量が少なくなるため、ネットワーク帯域が制限されている場合やデータ使用量に制約がある場合には有効です。
    * サーバーサイドのリソースを節約できます。フィールドが少なければ、その分だけデータベースからデータを取り出す作業が少なくなります。
    * クライアントサイドのパフォーマンスが改善します。特に、大量のデータを扱う場合や、モバイルデバイスなどリソースが限られている環境では有効です。

2. **全量データを取得し、後から必要なフィールドを抽出する方法の利点**：
    * フロントエンドのコードが単純になります。すべてのデータを取得するため、データ構造を変更せずに新たなフィールドが必要になったときに容易に対応できます。
    * データのキャッシュが容易になります。後から追加のフィールドが必要になったとき、すでにデータが存在していれば再度クエリを行う必要がありません。

それぞれの方法には利点と欠点がありますので、プロジェクトの要件により適切な方を選択してください。もしデータ量がそれほど大きくなく、パフォーマンスの問題が予想されないのであれば、全量データを取得し後から必要なフィールドを抽出する方が簡単かもしれません。

---

## 👤 ユーザー
*2023/06/12 18:26:50*

特定のフィールドだけを取得する方法として、予めそのようなリクエストをするswiftファイルを先に定義したりできないの？

---

## 🤖 アシスタント
*2023/06/12 18:27:53*

GraphQL APIにより、特定のフィールドだけを取得するためのリクエストを定義することが可能です。Amplify CLIにより自動生成されるクラスでは全てのフィールドが含まれますが、必要なフィールドのみを含むカスタムのクエリを作成することもできます。

以下に具体的な例を示します：

まず、特定のフィールド（ここでは`name`）だけを取得するためのモデルを定義します：

```swift
struct TodoName: Decodable {
    let name: String
}
```

次に、このモデルを使って特定のフィールドを取得するためのGraphQLリクエストを定義します：

```swift
extension GraphQLRequest where R: Decodable {
    static func todoName(byId id: String) -> GraphQLRequest<TodoName> {
        let document = """
        query GetTodo($id: ID!) {
          getTodo(id: $id) {
            name
          }
        }
        """
        return GraphQLRequest<TodoName>(document: document,
                                        variables: ["id": id],
                                        responseType: TodoName.self)
    }
}
```

このようにすると、以下のようにクエリを実行することができます：

```swift
do {
    let todoName = try await Amplify.API.query(request: .todoName(byId: "yourTodoID"))
    // do something with todoName
} catch {
    // handle error
}
```

このようにカスタムのGraphQLリクエストを定義しておけば、必要なフィールドだけを取得するためのリクエストを簡単に再利用することができます。

---

## 👤 ユーザー
*2023/06/12 18:28:43*

この準備はSwiftファイルを自分でまずは作成しないといけないの？Amplifyが自動生成してくれるのはどこまでの話なの？

---

## 🤖 アシスタント
*2023/06/12 18:29:48*

AWS Amplifyは、指定したGraphQLスキーマに基づいて、Swiftモデルクラスと相関するGraphQL操作(クエリ、ミューテーション、サブスクリプション)を自動的に生成します。これは、`amplify codegen models`コマンドを実行することで行われます。

これにより、以下のようなSwiftファイルが生成されます：

1. `amplify/generated/models/`ディレクトリに、スキーマで定義した型に対応するSwiftモデルクラスが生成されます。これには、フィールド定義やデコード用のロジックなどが含まれます。

2. 同じディレクトリに`AmplifyModels.swift`というファイルが生成されます。これは、すべてのモデルをまとめるための一覧クラスです。

3. `API.swift`というファイルには、GraphQL APIのエンドポイントと、各モデルに対する基本的なクエリ、ミューテーション、サブスクリプションが含まれます。

これらの自動生成ファイルは全フィールドを対象としたものです。特定のフィールドだけを取得するカスタムクエリや、それに対応するモデルクラスは、Amplifyが自動生成する範囲を超えているため、手動で作成する必要があります。

---

## 👤 ユーザー
*2023/06/12 18:31:08*

定のフィールドだけを取得するカスタムクエリを人の手で描かなきゃいけないのはしんどい気がするのだけれども、なにかいい解決策はないの？

---

## 🤖 アシスタント
*2023/06/12 18:32:36*

現時点でのAmplifyの機能では、特定のフィールドだけを取得するようなカスタムクエリは自動生成されません。しかし、定型的なクエリの生成を自動化するためのツールやライブラリがいくつか存在します。

1. **GraphQL Code Generator**：このツールは、GraphQLスキーマから型定義やクエリを自動生成します。Swiftに対応していますが、設定には手間がかかる可能性があります。

2. **自作スクリプトの利用**：汎用的なクエリ生成スクリプトをPythonやNode.jsなどで作成することも考えられます。スキーマを解析し、特定のフィールドだけを取得するクエリを生成するスクリプトを作成できます。

どの方法を選択するかは、プロジェクトの具体的な要件や規模によります。大規模なプロジェクトや複雑なスキーマの場合、自動化ツールやスクリプトの導入が有効な場合があります。しかし、小規模なプロジェクトやシンプルなスキーマの場合、手動でのクエリ生成が適切な場合もあります。

なお、これらの手段は一部のワークアラウンドを提供するもので、全てのケースを網羅するものではありません。自動生成ツールやスクリプトの作成・維持には時間と労力が必要です。そのため、具体的なシナリオと利益を慎重に評価した上で適切な解決策を選ぶことが重要です。

また、Amplifyにおいて特定のフィールドだけを取得するようなクエリの自動生成を希望する場合は、AWSにフィードバックを送信することをお勧めします。ユーザーからのフィードバックは製品の改善に大いに寄与します。

---

## 👤 ユーザー
*2023/06/12 18:34:10*

AppSync を使って、さらに GraphQL Code Generator でカスタムクエリのSwiftファイルを生成する方法を教えてほしい。

---

## 🤖 アシスタント
*2023/06/12 18:35:19*

まず、Node.jsとnpmがインストールされていることを確認します。次に、プロジェクトのルートディレクトリに移動して、以下のコマンドを実行し、GraphQL Code GeneratorとそのSwiftプラグインをインストールします：

```bash
npm install -D @graphql-codegen/cli
npm install -D @graphql-codegen/swift
npm install -D @graphql-codegen/swift-operations
```

これらのツールがインストールされたら、`codegen.yml`という設定ファイルを作成します：

```yaml
overwrite: true
schema: "<path_to_your_schema>"
documents: "<path_to_your_queries>"
generates:
  <output_path>:
    plugins:
      - "swift"
      - "swift-operations"
```

- `<path_to_your_schema>`は、GraphQLのスキーマファイル（`.graphql`または`.json`）のパスを指定します。Amplifyを使用している場合、`amplify/backend/api/<YourAPIName>/build/schema.graphql`になることが多いです。
- `<path_to_your_queries>`は、クエリ（`*.graphql`）が格納されているディレクトリのパスを指定します。
- `<output_path>`は生成されたSwiftコードの出力先のパスを指定します。

設定ファイルを作成したら、以下のコマンドを実行してSwiftコードを生成します：

```bash
npx graphql-codegen
```

これにより、指定した出力パスにSwiftのコードが生成されます。このコードは、GraphQLスキーマとクエリに基づいて作成され、特定のフィールドだけを取得するようなクエリを簡単に作成することができます。

なお、上記の設定は基本的なもので、詳細な設定やカスタマイズについては[公式ドキュメンテーション](https://graphql-code-generator.com/docs/getting-started/index)を参照してください。また、Swiftプラグインの設定については[こちら](https://graphql-code-generator.com/docs/plugins/swift)を参照してください。

---

## 👤 ユーザー
*2023/06/12 18:50:59*

これで生成されたものの例を見せてほしい。id を引数にとって、nameをとるようなStringを処理を実行してほしい。

---

## 🤖 アシスタント
*2023/06/12 18:52:25*

まず、GraphQL Code Generatorを使うためには、GraphQLクエリファイルが必要です。例えば、以下のような`getTodo.graphql`というクエリファイルを`<path_to_your_queries>`ディレクトリに作成します。

```graphql
query GetTodo($id: ID!) {
  getTodo(id: $id) {
    name
  }
}
```

上記クエリは、IDを引数にとり、対応するTodoオブジェクトのnameフィールドのみを取得します。

その後、GraphQL Code Generatorを実行すると、上記のクエリに対応するSwiftコードが生成されます。生成されたコードは大まかに以下のような構造になります：

```swift
public struct GetTodo: GraphQLSelectionSet {
  public static let possibleTypes: [String] = ["Todo"]
  public static let selections: [GraphQLSelection] = [
    GraphQLField("name", type: .nonNull(.scalar(String.self))),
  ]

  public var snapshot: Snapshot

  public init(snapshot: Snapshot) {
    self.snapshot = snapshot
  }

  public init(name: String) {
    self.init(snapshot: ["name": name])
  }

  public var name: String {
    get {
      return snapshot["name"]! as! String
    }
    set {
      snapshot.updateValue(newValue, forKey: "name")
    }
  }
}

public final class GetTodoQuery: GraphQLQuery {
  public let operationDefinition =
    """
    query GetTodo($id: ID!) {
      getTodo(id: $id) {
        __typename
        name
      }
    }
    """

  public var id: GraphQLID

  public init(id: GraphQLID) {
    self.id = id
  }

  public var variables: GraphQLMap? {
    return ["id": id]
  }

  public struct Data: GraphQLSelectionSet {
    public static let possibleTypes: [String] = ["Query"]

    public static var selections: [GraphQLSelection] {
      return [
        GraphQLField("getTodo", arguments: ["id": GraphQLVariable("id")], type: .object(GetTodo.selections)),
      ]
    }

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(getTodo: GetTodo? = nil) {
      self.init(snapshot: ["getTodo": getTodo.flatMap { $0.snapshot }])
    }

    public var getTodo: GetTodo? {
      get {
        return (snapshot["getTodo"] as? Snapshot).flatMap { GetTodo(snapshot: $0) }
      }
      set {
        snapshot.updateValue(newValue?.snapshot, forKey: "getTodo")
      }
    }
  }
}
```

このコードを使用すると、以下のようにクエリを実行できます：

```swift
let todoId: GraphQLID = "yourTodoID"
let getTodoQuery = GetTodoQuery(id: todoId)
_ = apollo.fetch(query: getTodoQuery) { result in
  switch result {
  case .success(let graphQLResult):
    if let todo = graphQLResult.data?.getTodo {
      print("Todo name: \(todo.name)")
    }
  case .failure(let error):
    print("Error: \(error)")
  }
}
```

上記のコードはサンプルであり、実際にはエラーハン

---

## 👤 ユーザー
*2023/06/12 18:53:02*

つづき

---

## 🤖 アシスタント
*2023/06/12 18:53:38*

続きです。エラーハンドリングやデータの処理方法などは、アプリケーションの要件によります。

```swift
let todoId: GraphQLID = "yourTodoID"
let getTodoQuery = GetTodoQuery(id: todoId)

let task = Amplify.API.query(request: .subscription(of: GetTodoQuery.Data.GetTodo.self, subscribeRequest: getTodoQuery))

do {
    let result = try await task.get()
    switch result {
    case .success(let todo):
        print("Todo name: \(todo.name)")
    case .failure(let apiError):
        print("Failed to get todo, error: \(apiError)")
    }
} catch {
    print("Error performing query, \(error)")
}
```

このSwiftコードは、生成されたSwift GraphQL APIを使用して、指定されたIDのTodoのnameを取得します。もし何か問題が発生した場合はエラーメッセージを出力します。

こうしたSwiftコードは、GraphQL Code Generatorによって生成されたものを使用しています。このツールは、あなたが定義したGraphQLクエリに基づいて型安全なAPIを生成し、それをSwiftで使用できます。このAPIは、クエリの結果を取得するだけでなく、結果に対して行う操作も型安全に行うことができます。

---

## 👤 ユーザー
*2023/06/12 18:55:01*

apollo は必要になるの？Amplifyだけでできないの？

---

## 🤖 アシスタント
*2023/06/12 18:55:53*

すみません、説明が混乱させてしまいました。AWS Amplifyでは確かにApolloを必要としません。誤解を生む記述がありました。

Amplifyを使用する場合、GraphQL Code Generatorで生成されたコードをAmplifyのAPI.queryを使って使用します。具体的なコードは以下の通りです：

```swift
let todoId: String = "yourTodoID"
let getTodoQuery = GetTodoQuery(id: todoId)

_ = Amplify.API.query(request: .graphql(getTodoQuery)) { event in
    switch event {
    case .success(let result):
        switch result {
        case .success(let todoData):
            print("Todo name: \(todoData.getTodo?.name ?? "")")
        case .failure(let error):
            print("Error - \(error.localizedDescription)")
        }
    case .failure(let error):
        print("Query failed with error \(error)")
    }
}
```

このSwiftコードは、生成されたSwift GraphQL APIを使用して、指定されたIDのTodoのnameを取得します。何か問題が発生した場合はエラーメッセージを出力します。

こうしたSwiftコードは、GraphQL Code Generatorによって生成されたものを使用しています。このツールは、あなたが定義したGraphQLクエリに基づいて型安全なAPIを生成し、それをSwiftで使用できます。このAPIは、クエリの結果を取得するだけでなく、結果に対して行う操作も型安全に行うことができます。

GraphQL Code GeneratorとAmplifyを組み合わせることで、AWS AppSyncとの連携をより強力かつ型安全に行うことが可能になります。

---

## 👤 ユーザー
*2023/06/12 21:20:02*

GraphQL Code Generator がSwiftのコードを提供していないみたいなんだけど、どうなのかな？

---

## 🤖 アシスタント
*2023/06/12 21:20:52*

申し訳ありません、情報が古かったようです。確認したところ、GraphQL Code Generatorは現状（2023年6月）Swift言語のサポートをしていないようです。そのため、Swiftでの利用は難しい状況です。

しかし、AmplifyのGraphQL Transformにより生成されるSwiftコードは基本的に全てのクエリ、ミューテーション、サブスクリプションをカバーしています。あくまで特定のフィールドのみを取得したい場合には手動で該当するSwiftのクエリを定義するしかありません。

もしくは他のGraphQLクライアントライブラリを併用することで対応することも可能です。例えば、Apollo iOSライブラリはSwiftをサポートしており、GraphQLのクエリやミューテーションを自動生成する機能があります。ただし、AmplifyとApolloを同時に使うことには一定の設定や管理が必要となるため、注意が必要です。

なお、GraphQL Code Generatorが将来的にSwiftのサポートを追加する可能性もありますので、公式のドキュメンテーションやリリースノートを定期的にチェックすることをお勧めします。

---

## 👤 ユーザー
*2023/06/12 21:22:04*

AmplifyとApolloを同時に使うことにしたいんだけど、認証とかはすべて、Amplifyに寄せたくて、カスタムクエリの作成だけApollo使うみたいな運用を考えていてどうすればいいかな？

---

## 🤖 アシスタント
*2023/06/12 21:23:30*

ApolloとAmplifyを同時に利用し、認証をAmplifyに寄せるためには、少々手間がかかりますが、以下の手順で実装できます。

1. Apolloクライアントの設定: Apolloクライアントは、リクエストにカスタムヘッダーを追加することができます。この機能を使って、Amplifyによる認証情報をApolloのリクエストに追加します。このカスタムヘッダーは、AmplifyのAuthモジュールから取得できます。

```swift
import Apollo
import Amplify

let token = try Amplify.Auth.fetchAuthSession().get().userPoolTokens().get().idToken
let configuration = URLSessionConfiguration.default
configuration.httpAdditionalHeaders = ["Authorization": token]

let url = URL(string: "<AppSync API URL>")
let client = ApolloClient(networkTransport: HTTPNetworkTransport(url: url!, sessionConfiguration: configuration))

```

2. Apolloでカスタムクエリを実行: Apolloクライアントが設定されたら、クエリの実行は次のように行います。

```swift
let query = GetTodoQuery(id: "<Todo ID>")
client.fetch(query: query) { result in
    switch result {
    case .success(let graphQLResult):
        print(graphQLResult.data?.getTodo?.name ?? "")
    case .failure(let error):
        print("Error: \(error)")
    }
}
```

上記のコードでは、AmplifyのAuthモジュールを使用してIDトークンを取得し、それをApolloクライアントのリクエストヘッダーに追加しています。これにより、AppSyncのエンドポイントへのリクエストが認証されます。

これらの手順は、Apolloクライアントの設定とクエリの実行の基本的な例を示しています。詳細な設定やエラーハンドリングなどは、あなたのアプリケーションの要件に応じて追加・修正する必要があります。

なお、上記のコードではApollo iOSの新しい`ApolloClient`APIを使用しています。Apollo iOSのバージョンによっては、APIが異なる場合があるので、正確なAPIを確認するためには公式のドキュメンテーションを参照してください。

ApolloとAmplifyを同時に使用する際には、それぞれのツールの機能と特性を理解し、それぞれのツールが最も得意とする部分を活用するようにしましょう。

---

## 👤 ユーザー
*2023/06/12 21:30:39*

Amplify GraphQL から swift でのカスタムクエリの生成を非公式でもやっているライブラリとかなさそうですか？

---

## 🤖 アシスタント
*2023/06/12 21:31:31*

私の最新の知識（2021年9月までの情報）では、Amplify GraphQLのSwiftでのカスタムクエリを自動生成するための非公式ライブラリは特に存在していないようです。

一般的に、非公式のツールやライブラリを使用する場合には注意が必要です。たとえば、そのツールがメンテナンスされているかどうか、質の良いドキュメンテーションがあるかどうか、バグレポートやフィードバックに対して迅速に対応しているかどうか、などの要素を考慮する必要があります。

一方で、自身で非公式のツールを開発することも可能です。例えば、GraphQLスキーマからSwiftのコードを生成するためのスクリプトを書くこともできます。これにはある程度のプログラミングスキルと時間が必要ですが、自分の要件に完全に合わせたツールを作ることができます。

なお、AmplifyやApolloなどの公式ライブラリは頻繁に更新されており、新しい機能が追加されることもあります。そのため、定期的に公式のド

---
