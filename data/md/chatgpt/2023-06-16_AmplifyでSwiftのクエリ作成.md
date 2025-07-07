# AmplifyでSwiftのクエリ作成

日付: 2023-06-16

---

## 👤 ユーザー
*2023/6/16 10:16:01*

AmplifyでSwiftでのクエリを作成したいので。生成して欲しい。

まずスキーマ定義をみてほしい
# 調査項目タイプ
enum MeasurementType {
  video
  website
  questionnaire
  interview
}

# タスクインタフェース
interface IMeasurement {
  id: ID!
  research\_id: ID!
  order: Int!
  measurement\_type: MeasurementType!
}

# 調査（お願い）
type Research @aws\_cognito\_user\_pools {
  id: ID!
  title: String!
  opening\_at: AWSDateTime!
  closing\_at: AWSDateTime!
  image\_uri: String!
  instructions: String!
  reward\_points: Int!
  org\_name: String
  measurement\_types: \[MeasurementType!\]!
  measurements: \[Measurement!\]!
  duration: Int!
}

# タスク
type Measurement implements IMeasurement @aws\_cognito\_user\_pools {
  id: ID!
  research\_id: ID!
  order: Int!
  measurement\_type: MeasurementType!
}

# 動画タスク
type VideoMeasurement implements IMeasurement @aws\_cognito\_user\_pools {
  id: ID!
  research\_id: ID!
  order: Int!
  measurement\_type: MeasurementType!
  file\_uri: String!
  instructions: String!
  is\_skip: Boolean!
}

# サイト調査タスク
type WebsiteMeasurement implements IMeasurement @aws\_cognito\_user\_pools {
  id: ID!
  research\_id: ID!
  order: Int!
  measurement\_type: MeasurementType!
  site\_url: AWSURL!
  instructions: String!
}

# アンケートタスク
type QuestionnaireMeasurement implements IMeasurement @aws\_cognito\_user\_pools {
  id: ID!
  research\_id: ID!
  order: Int!
  measurement\_type: MeasurementType!
  name: ID!
  questions: \[Question!\]!
}

# アンケート質問
type Question @aws\_cognito\_user\_pools {
  id: ID!
  title: String!
  order: Int!
  required: Boolean!
  constraint: Constraint!
}

# アンケート回答タイプ
enum ConstraintType {
  textarea
  single\_select
}

# アンケート制約
union Constraint = TextConstraint | SingleSelectConstraint

# 制約インタフェース
interface IConstraint {
  type: ConstraintType!
}

# テキスト自由記述制約（type=textarea）
type TextConstraint implements IConstraint @aws\_cognito\_user\_pools {
  type: ConstraintType!
  min\_length: Int
  max\_length: Int
}

# 単一選択肢制約（type=single\_select）
type SingleSelectConstraint implements IConstraint @aws\_cognito\_user\_pools {
  type: ConstraintType!
  options: \[String!\]!
}

# アンケート回答
type Answer @aws\_cognito\_user\_pools {
  question\_id: ID!
  value: String!
}

# インタビュータスク
type InterviewMeasurement implements IMeasurement @aws\_cognito\_user\_pools {
  id: ID!
  research\_id: ID!
  order: Int!
  measurement\_type: MeasurementType!
}

# セッション（タスク実行結果）
type Session @aws\_cognito\_user\_pools {
  id: ID!
  success: Boolean!
}

# ユーザ
type User @aws\_cognito\_user\_pools {
  id: ID!
  name: String!
  email: AWSEmail!
  points: Int!
}

# 旧: ユーザ属性
type UserAttribute
  @aws\_cognito\_user\_pools
  @deprecated(reason: "Use UserAttributes") {
  user\_id: ID!
  date\_of\_birth: String!
  gender: String
  annual\_income: String
  occupation: String
  industry: String
  marital\_status: String
  residence\_type: String
  household\_size: String
  location: String
  education: String
  device: String
}

# ユーザ属性
type UserAttributes @aws\_cognito\_user\_pools {
  user\_id: ID!
  date\_of\_birth: AWSDate!
  gender: String
  annual\_income: String
  occupation: String
  industry: String
  marital\_status: String
  residence\_type: String
  household\_size: String
  location: String
  education: String
}

# ユーザ属性コンテンツ
type UserAttributeContents @aws\_cognito\_user\_pools {
  genders: \[String!\]!
  occupations: \[String!\]!
  industries: \[String!\]!
  educations: \[String!\]!
  annual\_incomes: \[String!\]!
  residence\_types: \[String!\]!
  locations: \[String!\]!
  marital\_statuses: \[String!\]!
  household\_sizes: \[String!\]!
}

# ポイント履歴
type PointHistory @aws\_cognito\_user\_pools {
  id: ID!
  created\_at: AWSDateTime!
  org\_name: String
  research\_title: String!
  point: Int!
}

# 旧: ユーザ属性登録Input
input CreateUserAttribute @deprecated(reason: "Use CreateUserAttributeInput") {
  user\_name: String!
  user\_email: String!
  date\_of\_birth: AWSDate!
  gender: String
  annual\_income: String
  occupation: String
  industry: String
  marital\_status: String
  residence\_type: String
  household\_size: String
  location: String
  education: String
  device: String @deprecated(reason: "Use Device.name")
}

# 旧: ユーザ属性更新Input
input UpdateUserAttribute @deprecated(reason: "Use UpdateUserAttributeInput") {
  user\_id: ID!
  user\_name: String
  date\_of\_birth: AWSDate
  gender: String
  annual\_income: String
  occupation: String
  industry: String
  marital\_status: String
  residence\_type: String
  household\_size: String
  location: String
  education: String
  device: String @deprecated(reason: "Use Device.name")
}

# ユーザ情報更新Input
input UpdateUserInput {
  name: String!
}

# ユーザ属性登録Input
input CreateUserAttributeInput {
  date\_of\_birth: AWSDate!
  gender: String
  annual\_income: String
  occupation: String
  industry: String
  marital\_status: String
  residence\_type: String
  household\_size: String
  location: String
  education: String
}

# ユーザ属性更新Input
input UpdateUserAttributeInput {
  date\_of\_birth: AWSDate!
  gender: String!
  annual\_income: String!
  occupation: String!
  industry: String!
  marital\_status: String!
  residence\_type: String!
  household\_size: String!
  location: String!
  education: String!
}

# アンケート回答Input
input AnswerInput {
  question\_id: ID!
  value: String!
}

# アンケートタスク結果登録Input
input CreateQuestionnaireSessionInput {
  questionnaire\_id: ID!
  answers: \[AnswerInput!\]!
}

# インタビュータスク結果登録Input
input CreateInterviewSessionInput {
  interview\_id: ID!
}

## Query ##
type Query @aws\_cognito\_user\_pools {
  getUser(id: String!): User @deprecated(reason: "Use get\_user")
  getResearch(id: String!): Research @deprecated(reason: "Use get\_research")
  listResearches(id: String!, MeasurementType: String): \[Research\]
    @deprecated(reason: "Use list\_researches")
  getUserAttributeContents: UserAttributeContents
    @deprecated(reason: "Use get\_user\_attribute\_contents")
  getUserAttribute(id: String!): UserAttribute
    @deprecated(reason: "Use get\_user\_attributes")
  # ユーザ情報取得(ログインユーザ)
  get\_user: User
  # ユーザ属性コンテンツ取得
  get\_user\_attribute\_contents: UserAttributeContents
  # ユーザ属性情報取得(ログインユーザ)
  get\_user\_attributes: UserAttributes
  # お願い一覧取得
  list\_researches(MeasurementType: String): \[Research!\]!
  # お願い詳細情報取得
  get\_research(id: String!): Research
  # 動画タスク情報取得
  get\_video\_measurement(id: String!): VideoMeasurement
  # サイト調査タスク情報取得
  get\_website\_measurement(id: String!): WebsiteMeasurement
  # アンケートタスク情報取得
  get\_questionnaire\_measurement(id: String!): QuestionnaireMeasurement
  # インタビュータスク情報取得
  get\_interview\_measurement(id: String!): InterviewMeasurement
  # ポイント履歴取得(ログインユーザ)
  list\_point\_histories: \[PointHistory!\]!
}

## Mutation ##
type Mutation @aws\_cognito\_user\_pools {
  createUserAttribute(input: CreateUserAttribute!): UserAttribute
    @deprecated(reason: "Use create\_user\_attributes")
  updateUserAttribute(input: UpdateUserAttribute!): UserAttribute
    @deprecated(reason: "Use update\_user\_attributes")
  # ユーザ情報更新(ログインユーザ)
  update\_user(input: UpdateUserInput!): User!
  # ユーザ属性情報登録(ログインユーザ)
  create\_user\_attributes(input: CreateUserAttributeInput!): UserAttributes!
  # ユーザ属性情報更新(ログインユーザ)
  update\_user\_attributes(input: UpdateUserAttributeInput!): UserAttributes!
  # アンケートタスク結果登録
  create\_questionnaire\_session(
    input: CreateQuestionnaireSessionInput!
  ): Session!
  # インタビュータスク結果登録
  create\_interview\_session(input: CreateInterviewSessionInput!): Session!
}

## Schema ##
schema {
  query: Query
  mutation: Mutation
}

---

## 🤖 アシスタント
*2023/6/16 10:16:48*

あなたのGraphQLスキーマに基づいて、AmplifyとSwiftを使用してクエリを作成する方法を示します。

まず、AmplifyのSwiftパッケージを利用するためには、次のパッケージがプロジェクトにインストールされていることを確認してください。

- Amplify
- AmplifyPlugins/AWSAPIPlugin

これらがインストールされていることを確認したら、以下の手順に従ってクエリを作成します。

## ユーザ情報取得
以下のSwiftコードは、`get_user`クエリを実行します。このクエリは、ログインしているユーザの情報を取得します。

```swift
Amplify.API.query(request: .get(User.self, byId: userId)) { event in
    switch event {
    case .success(let result):
        switch result {
        case .success(let user):
            print("User retrieved: \(user)")
        case .failure(let error):
            print("Could not retrieve user: \(error)")
        }
    case .failure(let error):
        print("Failed to perform query: \(error)")
    }
}
```

ここで、`userId`は取得したいユーザのIDです。

## ユーザ属性情報取得
以下のSwiftコードは、`get_user_attributes`クエリを実行します。このクエリは、ログインしているユーザの属性情報を取得します。

```swift
Amplify.API.query(request: .get(UserAttributes.self, byId: userId)) { event in
    switch event {
    case .success(let result):
        switch result {
        case .success(let attributes):
            print("User attributes retrieved: \(attributes)")
        case .failure(let error):
            print("Could not retrieve user attributes: \(error)")
        }
    case .failure(let error):
        print("Failed to perform query: \(error)")
    }
}
```

## お願い詳細情報取得
以下のSwiftコードは、`get_research`クエリを実行します。このクエリは、指定したお願いの詳細情報を取得します。

```swift
Amplify.API.query(request: .get(Research.self, byId: researchId)) { event in
    switch event {
    case .success(let result):
        switch result {
        case .success(let research):
            print("Research retrieved: \(research)")
        case .failure(let error):
            print("Could not retrieve research: \(error)")
        }
    case .failure(let error):
        print("Failed to perform query: \(error)")
    }
}
```

ここで、`researchId`は取得したいお願いのIDです。

注意: 上記のコードはSwiftおよびAmplifyを使用してクエリを作成する一般的な方法を示しています。クエリが成功するためには、指定したIDのデータがデータベースに存在する必要があります。また、Amplifyが適切に設定および初期化されていることを確認してください。

---

## 👤 ユーザー
*2023/6/16 10:17:18*

以下のようなクエリを生成したい

query MyQuery {
  list\_researches(MeasurementType: "") {
    id
    title
    reward\_points
    org\_name
    opening\_at
    measurements {
      id
      measurement\_type
      order
      research\_id
    }
    measurement\_types
    instructions
    image\_uri
    duration
    closing\_at
  }
}

---

## 🤖 アシスタント
*2023/6/16 10:17:47*

あなたが提示したGraphQLクエリをSwiftとAmplifyを使用して生成するには、以下のように記述することができます。

```swift
let listResearchesRequest = GraphQLRequest<Research>(document:
    """
    query MyQuery {
        list_researches(MeasurementType: "") {
            id
            title
            reward_points
            org_name
            opening_at
            measurements {
                id
                measurement_type
                order
                research_id
            }
            measurement_types
            instructions
            image_uri
            duration
            closing_at
        }
    }
    """, responseType: [Research].self
)

Amplify.API.query(request: listResearchesRequest) { result in
    switch result {
    case .success(let graphQLResponse):
        switch graphQLResponse {
        case .success(let researches):
            print("Query completed: \(researches)")
        case .failure(let error):
            print("Could not complete query: \(error)")
        }
    case .failure(let apiError):
        print("Query failed: \(apiError)")
    }
}
```

このコードでは、最初にGraphQLのクエリを定義しています。そして、`Amplify.API.query`を使ってそのクエリを実行します。その結果を処理し、成功した場合は結果を表示し、失敗した場合はエラーメッセージを表示します。

注意点として、GraphQLのクエリはSwiftの文字列として定義されているため、正確な構文を維持することが重要です。また、レスポンスタイプはクエリの結果を格納するSwiftの型を指定する必要があります。ここでは`[Research].self`を指定しています。

また、Amplifyが適切に設定および初期化されていることを確認してください。

---

## 👤 ユーザー
*2023/6/16 10:18:23*

MeasurementType を引数に取るように変更して欲しい。ここには文字列が来る想定

---

## 🤖 アシスタント
*2023/6/16 10:18:46*

MeasurementTypeを引数に取るように変更する場合、以下のように更新できます：

```swift
func listResearches(measurementType: String) {
    let listResearchesRequest = GraphQLRequest<Research>(document:
        """
        query MyQuery {
            list_researches(MeasurementType: "\(measurementType)") {
                id
                title
                reward_points
                org_name
                opening_at
                measurements {
                    id
                    measurement_type
                    order
                    research_id
                }
                measurement_types
                instructions
                image_uri
                duration
                closing_at
            }
        }
        """, responseType: [Research].self
    )

    Amplify.API.query(request: listResearchesRequest) { result in
        switch result {
        case .success(let graphQLResponse):
            switch graphQLResponse {
            case .success(let researches):
                print("Query completed: \(researches)")
            case .failure(let error):
                print("Could not complete query: \(error)")
            }
        case .failure(let apiError):
            print("Query failed: \(apiError)")
        }
    }
}
```

これにより、`listResearches`関数は`measurementType`をパラメータとして受け取り、それをGraphQLクエリ内で使用します。この関数を呼び出すには、指定したいMeasurementTypeの文字列を引数にします。

```swift
listResearches(measurementType: "video")
```

---

## 👤 ユーザー
*2023/6/16 10:19:51*

listResearchesRequest は staticな関数にしてextension GraphQLRequest {}の中に記述したい

---

## 🤖 アシスタント
*2023/6/16 10:20:14*

指定した通り、GraphQLRequestの拡張としてlistResearchesRequest関数をstaticな関数として定義します：

```swift
import Amplify

extension GraphQLRequest where ResponseType == [Research] {
    static func listResearches(measurementType: String) -> GraphQLRequest {
        return GraphQLRequest<Research>(document:
            """
            query MyQuery {
                list_researches(MeasurementType: "\(measurementType)") {
                    id
                    title
                    reward_points
                    org_name
                    opening_at
                    measurements {
                        id
                        measurement_type
                        order
                        research_id
                    }
                    measurement_types
                    instructions
                    image_uri
                    duration
                    closing_at
                }
            }
            """, responseType: [Research].self
        )
    }
}
```

これにより、次のように`listResearches`関数を呼び出すことができます：

```swift
let request = GraphQLRequest.listResearches(measurementType: "video")
Amplify.API.query(request: request) { result in
    switch result {
    case .success(let graphQLResponse):
        switch graphQLResponse {
        case .success(let researches):
            print("Query completed: \(researches)")
        case .failure(let error):
            print("Could not complete query: \(error)")
        }
    case .failure(let apiError):
        print("Query failed: \(apiError)")
    }
}
```

ここでのポイントは、GraphQLRequestのジェネリック型が`[Research]`であるときのみ、`listResearches`関数が使用可能になることです。

---

## 👤 ユーザー
*2023/6/16 10:20:36*

ごめん他のも一緒に混ぜたいので

where ResponseType == \[Research\] {とはしなくてもいけるかな

---

## 🤖 アシスタント
*2023/6/16 10:21:06*

了解しました。指定された型制約なしでGraphQLRequestを拡張することも可能です。ただし、この場合、ResponseTypeが[Research]以外のときにこの関数を呼び出そうとすると、コンパイラが警告を出すことはありませんが、ランタイムエラーが発生する可能性があります。

以下にその例を示します：

```swift
import Amplify

extension GraphQLRequest {
    static func listResearches(measurementType: String) -> GraphQLRequest<[Research]> {
        return GraphQLRequest<[Research]>(document:
            """
            query MyQuery {
                list_researches(MeasurementType: "\(measurementType)") {
                    id
                    title
                    reward_points
                    org_name
                    opening_at
                    measurements {
                        id
                        measurement_type
                        order
                        research_id
                    }
                    measurement_types
                    instructions
                    image_uri
                    duration
                    closing_at
                }
            }
            """, responseType: [Research].self
        )
    }
}
```

このように呼び出すことができます：

```swift
let request = GraphQLRequest.listResearches(measurementType: "video")
Amplify.API.query(request: request) { result in
    switch result {
    case .success(let graphQLResponse):
        switch graphQLResponse {
        case .success(let researches):
            print("Query completed: \(researches)")
        case .failure(let error):
            print("Could not complete query: \(error)")
        }
    case .failure(let apiError):
        print("Query failed: \(apiError)")
    }
}
```

ただし、この形式ではResponseTypeの型を明示的に指定する必要があるため、異なるResponseTypeを期待する別のGraphQLクエリを追加する場合にも役立ちます。

---

## 👤 ユーザー
*2023/6/16 10:21:38*

ランタイムエラーが発生する理由はどうして？

---

## 🤖 アシスタント
*2023/6/16 10:22:12*

ランタイムエラーが発生する主な理由は、GraphQLRequestが期待するレスポンスの型（ここでは`\[Research\]`）が、実際のサーバーから返されるレスポンスの型と一致しない場合です。GraphQLはタイプセーフな言語であるため、クエリの実行時に期待するレスポンスの型と実際のレスポンスの型が一致しなければなりません。

したがって、サーバーが返すレスポンスが`\[Research\]`型でない場合、クエリの実行中にデコードエラーが発生し、ランタイムエラーとなります。

例えば、`ResponseType`を`\[Research\]`と定義しているが、実際にサーバーから返されるレスポンスは異なる型（例えば、単一の`Research`型やまったく異なる型）である場合、ランタイムエラーが発生します。このような場合、クエリのレスポンスを正しく解析できず、クラッシュやエラーを引き起こす可能性があります。

---

## 👤 ユーザー
*2023/6/16 10:28:26*

ちなみに以下のようなエラーが起きてしまったのだけれどもどうして、
2023-06-16 10:27:30.866698+0900 EmomilAppDevelop\[68097:5016920\] \[network\] \[error\] Amplify API Error listResearches(): GraphQLResponseError&lt;Array&lt;Research&gt;&gt;: Failed to decode GraphQL response to the `ResponseType` Array&lt;Research&gt;
Recovery suggestion: Failed to transform to `ResponseType`.
Take a look at the `RawGraphQLResponse` and underlying error to see where it failed to decode.
Caused by:
APIError: typeMisMatch type: Array&lt;Any&gt;
Caused by:
typeMismatch(Swift.Array&lt;Any&gt;, Swift.DecodingError.Context(codingPath: \[\], debugDescription: "Expected to decode Array&lt;Any&gt; but found a dictionary instead.", underlyingError: nil))
2023-06-16 10:27:30.866972+0900 EmomilAppDevelop\[68097:5016645\] \[network\] \[default\] error: GraphQLResponseError&lt;Array&lt;Research&gt;&gt;: Failed to decode GraphQL response to the `ResponseType` Array&lt;Research&gt;
Recovery suggestion: Failed to transform to `ResponseType`.
Take a look at the `RawGraphQLResponse` and underlying error to see where it failed to decode.
Caused by:
APIError: typeMisMatch type: Array&lt;Any&gt;
Caused by:
typeMismatch(Swift.Array&lt;Any&gt;, Swift.DecodingError.Context(codingPath: \[\], debugDescription: "Expected to decode Array&lt;Any&gt; but found a dictionary instead.", underlyingError: nil))

---

## 🤖 アシスタント
*2023/6/16 10:29:07*

このエラーメッセージは、SwiftがGraphQLレスポンスをデコード（変換）しようとした際に、予期した型（`Array&lt;Research&gt;`）と実際のレスポンス型が一致しなかったことを示しています。

エラーメッセージによれば、`Expected to decode Array&lt;Any&gt; but found a dictionary instead.`とあります。これは、Swiftが`Array&lt;Any&gt;`型のデータを期待していたにもかかわらず、実際に受け取ったデータが辞書型（`Dictionary`または`\[String: Any\]`）であったために、デコードに失敗したことを示しています。

ここで、Swiftにおける`Array&lt;Any&gt;`は任意の型の要素を持つ配列を意味し、`Dictionary`または`\[String: Any\]`はキーが文字列で、値が任意の型である辞書型を意味します。

このエラーが発生した理由として考えられるものとしては、GraphQLサーバーからのレスポンスが、Swiftが期待した`Array&lt;Research&gt;`型ではなく、辞書型であった可能性があります。つまり、GraphQLサーバーから返されるデータの構造が、Swiftのデコード処理が期待する構造と一致していないためにエラーが発生したと考えられます。

この問題を解決するためには、GraphQLクエリのレスポンス型がSwiftで定義した型（ここでは`Array&lt;Research&gt;`）と一致することを確認する必要があります。具体的には、Swiftでレスポンスを解析するための`Research`型（およびその中に含まれる他の型）が、GraphQLサーバーから返されるデータの構造と完全に一致することを確認する必要があります。

また、GraphQLサーバーから返される実際のデータを調べてみると、どのような構造になっているのか、またどの部分がSwiftの期待と異なるのかを理解する手助けになるでしょう。

---

## 👤 ユーザー
*2023/6/16 10:30:07*

サーバー側からはこのようなレスポンスが帰ってくる想定なんだ

{
  "data": {
    "list\_researches": \[
      {
        "id": "806424e6-f571-48b1-9051-12c1917e24e3",
        "title": "アパレルの広告CM",
        "reward\_points": 100,
        "org\_name": "株式会社エモミール",
        "opening\_at": "2023-04-01T00:00:01.000Z",
        "measurements": \[
          {
            "id": "acc0ee2b-8756-47ae-839d-82273a16b72f",
            "measurement\_type": "video",
            "order": 1,
            "research\_id": "806424e6-f571-48b1-9051-12c1917e24e3"
          },
          {
            "id": "794d9ba8-ea3f-4451-bb91-3d2810aaaeca",
            "measurement\_type": "video",
            "order": 2,
            "research\_id": "806424e6-f571-48b1-9051-12c1917e24e3"
          },
          {
            "id": "ee84910e-ea50-44a4-96c7-8979ac286c48",
            "measurement\_type": "website",
            "order": 3,
            "research\_id": "806424e6-f571-48b1-9051-12c1917e24e3"
          }
        \],
        "measurement\_types": \[
          "video",
          "website"
        \],
        "instructions": "再生されるCMを最後まで見てください",
        "image\_uri": "/emomil-movie-image.png",
        "duration": 239,
        "closing\_at": "2023-07-15T23:59:59.000Z"
      },
      {
        "id": "206f19fb-d239-42d4-a01b-daa31ea5357f",
        "title": "ポイントサービスの紹介ページ",
        "reward\_points": 200,
        "org\_name": null,
        "opening\_at": "2023-04-15T00:00:01.000Z",
        "measurements": \[
          {
            "id": "9b27b9c2-4209-492b-9a82-6ac07202d036",
            "measurement\_type": "website",
            "order": 1,
            "research\_id": "206f19fb-d239-42d4-a01b-daa31ea5357f"
          }
        \],
        "measurement\_types": \[
          "website"
        \],
        "instructions": "「エモミル」のサイトを見てください",
        "image\_uri": "/emomil-web-image.png",
        "duration": 180,
        "closing\_at": "2023-07-01T23:59:59.000Z"
      }
    \]
  }
}

---

## 🤖 アシスタント
*2023/6/16 10:30:51*

提供していただいたレスポンスを見ると、データがネストされた辞書型（JSONオブジェクト）と配列型で構成されています。エラーメッセージから推測すると、Swiftが期待しているレスポンスの構造がこの形と一致していない可能性があります。

GraphQLの応答は最上位に `data` というフィールドを持つことが一般的で、それはあなたのクエリのフィールド名に対応するオブジェクトを含みます。今回の場合、`list_researches`フィールドがそのオブジェクトとなっています。

このレスポンスを適切にデコードするには、Swiftで使用する型がこのレスポンスの構造に適合している必要があります。以下に一例を示します。

```swift
struct RootResponse: Decodable {
    let data: DataResponse
}

struct DataResponse: Decodable {
    let list_researches: [Research]
}

struct Research: Decodable {
    let id: String
    let title: String
    let reward_points: Int
    let org_name: String?
    let opening_at: String
    let measurements: [Measurement]
    let measurement_types: [String]
    let instructions: String
    let image_uri: String
    let duration: Int
    let closing_at: String
}

struct Measurement: Decodable {
    let id: String
    let measurement_type: String
    let order: Int
    let research_id: String
}
```

また、GraphQLクエリに対応する`GraphQLRequest`の型はこのようになります。

```swift
extension GraphQLRequest where ResponseType == RootResponse {
    static func listResearchesRequest(measurementType: String) -> GraphQLRequest {
        let operationName = "MyQuery"
        let document = """
        query \(operationName)($MeasurementType: String) {
          list_researches(MeasurementType: $MeasurementType) {
            id
            title
            reward_points
            org_name
            opening_at
            measurements {
              id
              measurement_type
              order
              research_id
            }
            measurement_types
            instructions
            image_uri
            duration
            closing_at
          }
        }
        """
        return GraphQLRequest<ResponseType>(
            document: document,
            variables: ["MeasurementType": measurementType],
            responseType: ResponseType.self,
            decodePath: "data.list_researches"
        )
    }
}
```
注意点としては、この`ResponseType`を変更して`RootResponse`にし、`decodePath`を指定して "data.list_researches" としています。これによりGraphQLレスポンスが期待する構造に合わせて適切にデコードされます。

---

## 👤 ユーザー
*2023/6/16 10:33:48*

Cannot find type 'ResponseType' in scope とかになったのだけれども、 where ResponseType == RootResponse {あたりを消して欲しい

---

## 🤖 アシスタント
*2023/6/16 10:34:17*

了解しました。`ResponseType`という制約を削除し、引数で型を指定するように修正します。以下のように変更します：

```swift
extension GraphQLRequest {
    static func listResearchesRequest<ResponseType: Decodable>(measurementType: String) -> GraphQLRequest<ResponseType> {
        let operationName = "MyQuery"
        let document = """
        query \(operationName)($MeasurementType: String) {
          list_researches(MeasurementType: $MeasurementType) {
            id
            title
            reward_points
            org_name
            opening_at
            measurements {
              id
              measurement_type
              order
              research_id
            }
            measurement_types
            instructions
            image_uri
            duration
            closing_at
          }
        }
        """
        return GraphQLRequest<ResponseType>(
            document: document,
            variables: ["MeasurementType": measurementType],
            responseType: ResponseType.self,
            decodePath: "data.list_researches"
        )
    }
}
```

これにより、このメソッドを呼び出すときにレスポンスタイプを指定できるようになります。例えば、上で定義した`RootResponse`型を使う場合は次のようになります：

```swift
let request = GraphQLRequest.listResearchesRequest(measurementType: "video")
```

注意点としては、この変更により`ResponseType`が何であるかはこのメソッドを呼び出す側が指定することになります。ですので、レスポンスを適切にデコードできるように`ResponseType`がレスポンスのJSON構造と一致している必要があります。

---
