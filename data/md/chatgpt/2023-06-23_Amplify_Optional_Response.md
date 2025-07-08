# Amplify Optional Response

日付: 2023-06-23

---

## 👤 ユーザー
*2023/06/24 03:00:53*

SwiftのAmplify.API.query(request: .getUserAttribute())を実行した際に以下のレスポンスが返ってくるときにエラーになってしまうので、レスポンスをnilとして取得したい。
どうすればいいか教えて欲しい。
Amplifyは導入されていることを前提に考えて欲しい。


{
  "data": {
    "get_user_attributes": null
  }
}

let result = try await Amplify.API.query(request: .getUserAttribute())
        switch result {
        case .success(let resultData):
            AppLogger.debugLog("Amplify API Success getUserAttribute(): \(resultData)", category: .network)
         case .failure(let error):
            AppLogger.debugLog("Amplify API Error getUserAttribute(): \(error)", category: .network, level: .error)
            throw error
}

extension GraphQLRequest {
static func getUserAttribute() -&gt; GraphQLRequest&lt;UserAttributes&gt; {
        let operationName = "get_user_attributes"
        let document = """
        query \(operationName) {
          \(operationName) {
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
          }
        }
        """
        return GraphQLRequest&lt;UserAttributes&gt;(
            document: document,
            variables: [:],
            responseType: UserAttributes.self,
            decodePath: operationName
        )
    }
}

public struct UserAttributes: Embeddable {
  var user_id: String
  var date_of_birth: Temporal.Date
  var gender: String?
  var annual_income: String?
  var occupation: String?
  var industry: String?
  var marital_status: String?
  var residence_type: String?
  var household_size: String?
  var location: String?
  var education: String?
}



extension UserAttributes {
  // MARK: - CodingKeys 
   public enum CodingKeys: String, ModelKey {
    case user_id
    case date_of_birth
    case gender
    case annual_income
    case occupation
    case industry
    case marital_status
    case residence_type
    case household_size
    case location
    case education
  }
  
  public static let keys = CodingKeys.self
  //  MARK: - ModelSchema 
  
  public static let schema = defineSchema { model in
    let userAttributes = UserAttributes.keys
    
    model.pluralName = "UserAttributes"
    
    model.fields(
      .field(userAttributes.user_id, is: .required, ofType: .string),
      .field(userAttributes.date_of_birth, is: .required, ofType: .date),
      .field(userAttributes.gender, is: .optional, ofType: .string),
      .field(userAttributes.annual_income, is: .optional, ofType: .string),
      .field(userAttributes.occupation, is: .optional, ofType: .string),
      .field(userAttributes.industry, is: .optional, ofType: .string),
      .field(userAttributes.marital_status, is: .optional, ofType: .string),
      .field(userAttributes.residence_type, is: .optional, ofType: .string),
      .field(userAttributes.household_size, is: .optional, ofType: .string),
      .field(userAttributes.location, is: .optional, ofType: .string),
      .field(userAttributes.education, is: .optional, ofType: .string)
    )
    }
}

---

## 🤖 アシスタント
*2023/06/24 03:02:03*

SwiftのCodableの振る舞いにより、APIのレスポンスがnullを含んでいると、Swiftの構造体でnullを表現できないフィールド（ここでは`user_id`と`date_of_birth`）が存在する場合、デコードが失敗し、エラーがスローされます。

対策としては、以下の2つのアプローチがあります。

1. サーバーサイドのAPIの挙動を変更して、ユーザー属性が存在しない場合はnullではなく、全てのフィールドがnullまたはデフォルト値のオブジェクトを返すようにする。これはサーバーサイドが変更可能であればの話です。

2. クライアント側でnullレスポンスを許容するようにする。これはサーバーサイドが変更不可能、または時間がない場合の対応です。以下にその実装を示します。

まず、`UserAttributes`をOptionalにラップした新しい型`OptionalUserAttributes`を定義します。これにより、全体がnullである場合でもデコードが成功します。

```swift
struct OptionalUserAttributes: Codable {
    let userAttributes: UserAttributes?

    init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        userAttributes = try? container.decode(UserAttributes.self)
    }
}
```

そして、GraphQLのリクエストもこの新しい型を返すように変更します。

```swift
extension GraphQLRequest {
    static func getUserAttribute() -> GraphQLRequest<OptionalUserAttributes> {
        let operationName = "get_user_attributes"
        let document = """
        query \(operationName) {
          \(operationName) {
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
          }
        }
        """
        return GraphQLRequest<OptionalUserAttributes>(
            document: document,
            variables: [:],
            responseType: OptionalUserAttributes.self,
            decodePath: operationName
        )
    }
}
```

これで、`Amplify.API.query(request: .getUserAttribute())`はnullレスポンスを正しく処理し、`nil`を返します。ただし、`resultData`は`OptionalUserAttributes`型になり、`OptionalUserAttributes.userAttributes`が`nil`かどうかをチェックする必要があります。

```swift
let result = try await Amplify.API.query(request: .getUserAttribute())
switch result {
case .success(let resultData):
    if let userAttributes = resultData.userAttributes {
        AppLogger.debugLog("Amplify API Success getUserAttribute(): \(userAttributes)", category: .network)
    } else {
        // userAttributesがnilの場合の処理をここに書きます。
    }
case .failure(let error):
    AppLogger.debugLog("Amplify API Error getUserAttribute(): \(error)", category: .network, level: .error)
    throw error
}
```

この方法はSwift

---

## 🤖 アシスタント
*2023/06/24 03:02:15*

の型システムとエラーハンドリングを活用して、nullの可能性をコードに明示的に表現します。

---
