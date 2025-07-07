# UserAttributes Form Initializer

日付: 2023-06-22

---

## 👤 ユーザー
*2023/6/23 3:15:06*

dateOfBirthから先を埋めて欲しい

extension UserAttributeFormItems {
    init(user: EmomilCore.User, userAttributes: EmomilCore.UserAttributes) {
        self.init(nickName: user.name, gender: userAttributes.gender, dateOfBirth: userAttributes.dateOfBirth, maritalStatus: &lt;#T##String?#&gt;, location: &lt;#T##String?#&gt;, residenceType: &lt;#T##String?#&gt;, householdSize: &lt;#T##String?#&gt;, annualIncome: &lt;#T##String?#&gt;, occupation: &lt;#T##String?#&gt;, industry: &lt;#T##String?#&gt;, education: &lt;#T##String?#&gt;)
    }
}

---

## 🤖 アシスタント
*2023/6/23 3:15:33*

あなたが求めているコードは次のとおりです。ただし、このコードは `EmomilCore.User` と `EmomilCore.UserAttributes` の属性が `String` 型であることを前提としています。あなたのクラスの実装によっては、型が異なる場合もあるので、その場合は適切に修正してください。

```swift
extension UserAttributeFormItems {
    init(user: EmomilCore.User, userAttributes: EmomilCore.UserAttributes) {
        self.init(nickName: user.name, gender: userAttributes.gender, dateOfBirth: userAttributes.dateOfBirth, maritalStatus: userAttributes.maritalStatus, location: userAttributes.location, residenceType: userAttributes.residenceType, householdSize: userAttributes.householdSize, annualIncome: userAttributes.annualIncome, occupation: userAttributes.occupation, industry: userAttributes.industry, education: userAttributes.education)
    }
}
```

上記のコードでは、`EmomilCore.UserAttributes` クラスに `maritalStatus`, `location`, `residenceType`, `householdSize`, `annualIncome`, `occupation`, `industry`, `education` という属性が存在し、それらが `String?` 型であることを想定しています。これらの属性が存在しない、または型が異なる場合、適切に修正する必要があります。

---

## 👤 ユーザー
*2023/6/23 3:15:37*

みやすく開業して欲しい

---

## 🤖 アシスタント
*2023/6/23 3:15:54*

もちろんです、以下に改行を加えて読みやすくしたバージョンを提供します：

```swift
extension UserAttributeFormItems {
    init(user: EmomilCore.User, userAttributes: EmomilCore.UserAttributes) {
        self.init(
            nickName: user.name, 
            gender: userAttributes.gender, 
            dateOfBirth: userAttributes.dateOfBirth, 
            maritalStatus: userAttributes.maritalStatus, 
            location: userAttributes.location, 
            residenceType: userAttributes.residenceType, 
            householdSize: userAttributes.householdSize, 
            annualIncome: userAttributes.annualIncome, 
            occupation: userAttributes.occupation, 
            industry: userAttributes.industry, 
            education: userAttributes.education
        )
    }
}
```

このようにすることで、各パラメータが別の行に配置され、コードが読みやすくなります。

---
