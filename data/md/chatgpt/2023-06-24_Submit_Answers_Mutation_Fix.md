# Submit Answers Mutation Fix

日付: 2023-06-24

---

## 👤 ユーザー
*2023/6/24 16:27:29*

以下のクエリを発行したいのだけれども、static func submitAnswersの記述が間違っている

直して欲しい。



mutation MyMutation {
  submit_answers(
    answers: [
      { question_id: "1", value: "答え" },
      { question_id: "2", value: "別の答え" }
    ],
    session_id: "session123"
  ) {
    id
    success
  }
}

public struct Answer: Embeddable {
  var question_id: String
  var value: String
}

public struct Session: Embeddable {
  var id: String
  var success: Bool
}


extension GraphQLRequest {
static func submitAnswers(session_id: String, answers: [Answer]) -&gt; GraphQLRequest&lt;Session&gt; {
        let operationName = "submit_answers"
        let document = """
        mutation \(operationName)(
          $session_id: String!,
          $answers: [AnswerInput!]
        ) {
          \(operationName)(
            session_id: $session_id,
            answers: $answers
          ) {
            id
            success
          }
        }
        """
        return GraphQLRequest&lt;Session&gt;(
            document: document,
            variables: [
                "session_id": session_id,
                "answers": answers,
            ],
            responseType: Session.self,
            decodePath: operationName
        )
    }
}

---

## 🤖 アシスタント
*2023/6/24 16:28:23*

以下のコードブロックでは、GraphQLリクエストを作成するために、answersパラメータの変換を行います。これにより、適切な形式でサーバーに送信できます。

なお、これにはSwiftの `Encodable` プロトコルと `JSONEncoder` を使用して、`Answer` オブジェクトの配列をJSON文字列に変換します。

```swift
public struct Answer: Codable {
  var question_id: String
  var value: String
}

public struct Session: Codable {
  var id: String
  var success: Bool
}

extension GraphQLRequest {
    static func submitAnswers(session_id: String, answers: [Answer]) -> GraphQLRequest<Session> {
        let operationName = "submit_answers"
        let document = """
        mutation \(operationName)(
          $session_id: String!,
          $answers: [AnswerInput!]
        ) {
          \(operationName)(
            session_id: $session_id,
            answers: $answers
          ) {
            id
            success
          }
        }
        """
        
        let encoder = JSONEncoder()
        guard let answersData = try? encoder.encode(answers),
            let answersJSON = String(data: answersData, encoding: .utf8)
        else {
            fatalError("Encoding failed")
        }
        
        return GraphQLRequest<Session>(
            document: document,
            variables: [
                "session_id": session_id,
                "answers": answersJSON,
            ],
            responseType: Session.self,
            decodePath: operationName
        )
    }
}
```

このコードでは、`Codable`プロトコルを使用して`Answer`と`Session`を定義しています。`Codable`は`Encodable`と`Decodable`プロトコルの両方を結合したもので、これによりオブジェクトをJSONにエンコードし、JSONからデコードすることができます。

ただし、この実装はあくまで一例であり、実際のプロジェクトのニーズに合わせて適宜調整する必要があります。たとえば、エンコードに失敗した場合のエラーハンドリングが不足しているため、実際のプロジェクトでは適切なエラーハンドリングを行うことが必要です。

---

## 👤 ユーザー
*2023/6/24 16:28:54*

Embeddable だけではできないんでしたっけ？’

---

## 🤖 アシスタント
*2023/6/24 16:29:13*

すみませんが、Swiftの標準ライブラリやフレームワークには`Embeddable`という名前のプロトコルは存在しません。`Embeddable`という名前のプロトコルや型は特定のライブラリやフレームワーク、あるいはあなたのコード内で定義されたものでしょうか？

あるいは、GraphQLリクエストで使われる形式に`Answer`や`Session`のオブジェクトを適合させることを意図している場合、GraphQLのスキーマに一致するようにそれらの型を定義することが重要です。そのために、それらの型が適切にシリアル化（エンコード）できることが求められ、Swiftではこの目的のために`Codable`プロトコルが用意されています。

なお、`Embeddable`が特定のプロトコルや型を示している場合、それに関する詳細な情報が必要となります。その情報をもとに、より適切なアドバイスを提供することが可能です。

---
