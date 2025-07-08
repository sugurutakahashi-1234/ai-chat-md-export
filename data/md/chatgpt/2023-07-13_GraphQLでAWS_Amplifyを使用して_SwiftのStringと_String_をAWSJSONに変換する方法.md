# GraphQLでAWS Amplifyを使用して、SwiftのStringと[String]をAWSJSONに変換する方法

Date: 2023-07-13

---

## 👤 User
*2023-07-13 16:22:33*

graphQLでAmplifyを使っている。導入は済んでいる。

let value: String と let values: String を AWSJSONに変換するにはどうすればいいかおしえてほしい


input AnswerInput {
  question_id: ID!
  value: AWSJSON!
}

---

## 🤖 Assistant
*2023-07-13 16:22:43*

GraphQLの`AWSJSON`型は、JSON形式のデータを取り扱うための特殊な型です。JSONは`String`、`Number`、`Object`、`Array`、`Boolean`、`null`の六つのデータ型を持つことができます。

Swiftで文字列を`AWSJSON`に変換するには、まず文字列を適切なJSON表現に変換する必要があります。そしてそれをGraphQL

---
