# Generate iOS Queries.

日付: 2023-06-13

---

## 👤 ユーザー
*2023/6/13 15:38:28*

以下のスキーマ定義からiOSのモバイルアプリ側がリクエストしそうなクエリを生成してほしい

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
  description: String!
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
  situation\_description: String! # TODO データ定義に追加
}

# サイト調査タスク
type WebsiteMeasurement implements IMeasurement @aws\_cognito\_user\_pools {
  id: ID!
  research\_id: ID!
  order: Int!
  measurement\_type: MeasurementType!
  site\_url: AWSURL!
  situation\_description: String! # TODO データ定義に追加
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
  device: String
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
  device: String
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
  device: String
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
  device: String @deprecated(reason: "Use Device.name") # TODO デバイス情報の取得方法を検討
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
  # アンケートタスク情報取得 TODO データ設計検討待ち
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
  # お願い獲得ポイント登録 TODO postgresqlで実施できないか検討
  # アンケートタスク結果登録 TODO データ設計検討待ち
}

## Schema ##
schema {
  query: Query
  mutation: Mutation
}

---

## 🤖 アシスタント
*2023/6/13 15:39:39*

こちらがいくつかのGraphQLクエリの例です。

1. ユーザ情報の取得
```graphql
query {
  get_user {
    id
    name
    email
    points
  }
}
```

2. ユーザ属性情報の取得
```graphql
query {
  get_user_attributes {
    user_id
    date_of_birth
    gender
    annual_income
    occupation
    industry
    marital_status
    residence_type
    household_size
    location
    education
    device
  }
}
```

3. お願い一覧の取得（特定のMeasurementTypeを持つもの）
```graphql
query {
  list_researches(MeasurementType: "video") {
    id
    title
    opening_at
    closing_at
    image_uri
    description
    reward_points
    org_name
    measurement_types
    measurements {
      id
      research_id
      order
      measurement_type
    }
    duration
  }
}
```

4. お願い詳細情報の取得
```graphql
query {
  get_research(id: "ResearchIdHere") {
    id
    title
    opening_at
    closing_at
    image_uri
    description
    reward_points
    org_name
    measurement_types
    measurements {
      id
      research_id
      order
      measurement_type
    }
    duration
  }
}
```

5. 動画タスク情報の取得
```graphql
query {
  get_video_measurement(id: "MeasurementIdHere") {
    id
    research_id
    order
    measurement_type
    file_uri
    situation_description
  }
}
```

6. サイト調査タスク情報の取得
```graphql
query {
  get_website_measurement(id: "MeasurementIdHere") {
    id
    research_id
    order
    measurement_type
    site_url
    situation_description
  }
}
```

7. ポイント履歴の取得
```graphql
query {
  list_point_histories {
    created_at
    org_name
    research_title
    point
  }
}
```

8. ユーザ情報の更新
```graphql
mutation {
  update_user(input: {name: "NewNameHere"}) {
    id
    name
    email
    points
  }
}
```

9. ユーザ属性情報の登録
```graphql
mutation {
  create_user_attributes(input: {date_of_birth: "DateOfBirthHere", gender: "GenderHere"}) {
    user_id
    date_of_birth
    gender
    annual_income
    occupation
    industry
    marital_status
    residence_type
    household_size
    location
    education
    device
  }
}
```

10. ユーザ属性情報の更新
```graphql
mutation {
  update_user_attributes(input: {date_of_birth: "DateOfBirthHere", gender: "GenderHere"}) {
    user_id
    date_of_birth
    gender
    annual_income
    occupation
    industry
    marital_status
    residence_type
    household_size
    location
    education
    device
  }
}
```

注意点として、これらのクエリはスキーマの定義に従っていますが、具体的な値（たとえば、"ResearchIdHere"や"NewNameHere"）は

---

## 👤 ユーザー
*2023/6/13 15:39:53*

つづき

---

## 🤖 アシスタント
*2023/6/13 15:40:34*

具体的な実際の使用状況に応じて適切に置き換える必要があります。上記の例では、"ResearchIdHere"や"NewNameHere"はプレースホルダーであり、具体的なリサーチIDや新しいユーザ名に置き換える必要があります。

加えて、上記のクエリは正しい認証情報と一緒に使用する必要があります。認証情報が必要な操作（例えば、ユーザ情報の取得や更新）を行う場合は、適切な認証トークンやセッションIDが必要になります。

また、これらのクエリは基本的な例であり、具体的なアプリケーションの要件に応じてカスタマイズすることが可能です。たとえば、フィールドの選択を調整することで、サーバから返されるデータの量を制御したり、必要な情報だけを取得するようにすることができます。

最後に、これらのクエリの結果は通常、非同期的に処理されます。そのため、これらのクエリを実行した結果を表示または処理するためには、適切な非同期処理やエラーハンドリングが必要となります。

---

## 👤 ユーザー
*2023/6/13 15:43:19*

たとえば、list\_researches の取得した measurements.research\_id をつかって、get\_research を発行するようなクエリを作成して欲しい

---

## 🤖 アシスタント
*2023/6/13 15:44:06*

GraphQLでは1つのクエリ内で別のクエリの結果を直接使用することはできません。そのため、クライアント側でlist_researchesクエリの結果からresearch_idを取得し、そのidを使用して新たなget_researchクエリを発行することが必要となります。

ただし、以下のようにして、一度のクエリで特定のリサーチとそのリサーチに紐づくMeasurementを取得することが可能です：

```graphql
query {
  get_research(id: "ResearchIdHere") {
    id
    title
    measurements {
      id
      research_id
      order
      measurement_type
    }
  }
}
```

上記のクエリでは、特定のリサーチの詳細とそのリサーチに紐づくMeasurement（タスク）の一覧を取得しています。これにより、2回のネットワークリクエストを行う代わりに、一度のリクエストで必要なデータを全て取得することが可能となります。

なお、特定のMeasurementの詳細情報（例えば、動画タスクの場合のfile_uriやサイト調査タスクの場合のsite_url）を取得する場合には、それぞれのMeasurementTypeに応じたクエリ（例えば、get_video_measurementやget_website_measurement）を発行する必要があります。これはGraphQLの型システムの特性からくる制限で、MeasurementTypeごとに異なるフィールドを持つためにはそれぞれの型に対応するクエリを使用する必要があるからです。

---

## 👤 ユーザー
*2023/6/13 15:44:23*

その辺の使いそうなクエリも書いて欲しい

---

## 🤖 アシスタント
*2023/6/13 15:45:17*

リサーチとそれに関連するメジャーメントの詳細情報を取得するための一連のクエリは以下のようになります。

まず、特定のリサーチとそれに紐づくメジャーメントのIDを取得するためのクエリ：

```graphql
query {
  get_research(id: "ResearchIdHere") {
    id
    title
    measurements {
      id
      research_id
      order
      measurement_type
    }
  }
}
```

次に、得られたメジャーメントのIDとタイプを使って、その詳細情報を取得するクエリは以下のようになります。

VideoMeasurementの詳細を取得：

```graphql
query {
  get_video_measurement(id: "MeasurementIdHere") {
    id
    research_id
    order
    measurement_type
    file_uri
    situation_description
  }
}
```

WebsiteMeasurementの詳細を取得：

```graphql
query {
  get_website_measurement(id: "MeasurementIdHere") {
    id
    research_id
    order
    measurement_type
    site_url
    situation_description
  }
}
```

この例では、まず`get_research`クエリを使用して特定のリサーチとそのメジャーメントのIDを取得し、その後で得られたメジャーメントのIDを使用して`get_video_measurement`または`get_website_measurement`クエリを発行し、メジャーメントの詳細情報を取得しています。

ただし、上記のようにクエリを発行するためには、クライアント側で必要なロジックを実装する必要があります。具体的には、まず`get_research`クエリの結果からメジャーメントのIDを取得し、その後でそれを使用して該当する`get_video_measurement`または`get_website_measurement`クエリを発行するという処理を行う必要があります。このような処理は一般的に非同期的に行うことが多いですので、適切な非同期処理やエラーハンドリングの実装も必要となります。

---
