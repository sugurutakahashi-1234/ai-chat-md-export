# エラー: 返すべきオブジェクトなし (No Object Returned)

Date: 2023-06-24

---

## 👤 User
*2023-06-24 22:41:04*

こういうエラーになった。どうして。

{
  "data": null,
  "errors": [
    {
      "path": [
        "update_user"
      ],
      "locations": null,
      "message": "Cannot return null for non-nullable type: 'User' within parent 'Mutation' (/update_user)"
    }
  ]
}

mutation MyMutation {
  update_user(name: "") {
    id
  }
}

---

## 🤖 Assistant
*2023-06-24 22:41:42*

エラーメッセージ「Cannot return null for non-nullable type: 'User' within parent 'Mutation' (/update_user)」を見ると、GraphQL APIに対して送られた`update_user`というMutationがエラーを引き起こしていることがわかります。

具体的には、このMutationがnullを返しているのに、スキーマ定義では`User`型がnullを許容していないからです。つまり、このMutationは何かしらの`User`オブジェクトを必ず返すべきですが、何らかの理由でそれが実行されていないという事です。

このエラーは多くの場合、以下のようなケースで発生します：

1. データベースまたはバックエンドのエラー：更新しようとしているユーザーが存在しない、または更新中に何らかのエラーが発生した可能性があります。

2. 引数が不正：Mutationの引数`name`が空文字列になっています。もし`name`が必要なフィールドであったり、特定の形式を必要とする場合、これがエラーの原因となる可能性があります。

対策としては以下があります：

1. ユーザーが存在し、かつ更新が可能な状態であることを確認します。

2. `name`に正しい値が設定されていることを確認します。必要なら、フィールドのバリデーションルールを再確認します。

3. GraphQLのスキーマを再確認し、nullを許容しないフィールドが正しく扱われていることを確認します。

4. バックエンドのログを確認し、エラーの詳細を把握します。これにより、エラーの原因を特定する手助けになるでしょう。

---
