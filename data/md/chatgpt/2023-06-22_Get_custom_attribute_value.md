# Get custom attribute value

Date: 2023-06-22

---

## 👤 User
*2023-06-22 14:27:23*

以下のauthUserAttributesから.custom("user_id") で一致する場合のvalueを取得したい
var authUserAttributes: [AuthUserAttribute]


public struct AuthUserAttribute {
    public let key: AuthUserAttributeKey
    public let value: String

    public init(_ key: AuthUserAttributeKey, value: String) {
        self.key = key
        self.value = value
    }
}

///
public enum AuthUserAttributeKey {
    // Attribute ref - https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-attributes.html

    /// Attribute key for user's address
    case address

    /// Attribute key for user's birthdate
    case birthDate

    /// Attribute key for user's email
    case email
    
    /// Attribute key for user's email verfication status
    case emailVerified

    /// Attribute key for user's family name
    case familyName

    /// Attribute key for user's gender
    case gender

    /// Attribute key for user's given name
    case givenName

    /// Attribute key for user's locale
    case locale

    /// Attribute key for user's middle name
    case middleName

    /// Attribute key for user's name
    case name

    /// Attribute key for user's nickname
    case nickname

    /// Attribute key for user's phone number
    case phoneNumber
    
    /// Attribute key for user's phone number verficiation status
    case phoneNumberVerified

    /// Attribute key for user's picture
    case picture

    /// Attribute key for user's preferred user name
    case preferredUsername
    
    /// Attribute key for user's profile
    case profile
    
    /// Attribute key for user's identifier
    case sub
    
    /// Attribute key for time of user's information last updated
    case updatedAt
    
    /// Attribute key for user's web page
    case website
    
    /// Attribute key for user's time zone
    case zoneInfo

    /// Attribute key for providing custom attributes
    case custom(String)

    /// Attribute key for representing any other keys not mentioned here
    case unknown(String)
}

---

## 🤖 Assistant
*2023-06-22 14:27:46*

`AuthUserAttributeKey` は Swift の enum で、その中に `.custom(String)` というケースが含まれています。ある特定のカスタムキーを持つ属性の値を探すには、以下のように Swift の `first(where:)` 関数を使用できます。この関数は配列の各要素を評価し、最初に `true` を返す要素を返します。

以下のコードは、`authUserAttributes` 配列から `user_id` のカスタムキーを持つ `AuthUserAttribute` の値を取得します。

```swift
let customKey = "user_id"
let userIdAttribute = authUserAttributes.first { attribute in
    if case .custom(let key) = attribute.key, key == customKey {
        return true
    }
    return false
}

let userId = userIdAttribute?.value
```

このコードではまず、必要なカスタムキーの名前 `user_id` を `customKey` に格納します。次に `first(where:)` を使って `authUserAttributes` の各要素を評価します。各要素のキーが `.custom(String)` ケースで、その文字列が `user_id` と一致する場合、その要素が取得されます。最後に、取得した要素の値が `userId` に格納されます。もし一致する要素がない場合、`userId` は `nil` になります。

---
