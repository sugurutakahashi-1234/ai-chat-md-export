# 取得したユーザーのusername（Swift）

日付: 2023-10-26

---

## 👤 ユーザー
*2023/10/26 14:51:39*

Swiftの Amplifyでusenameの取得方法。AmplifyのSPMは導入済みです。

---

## 🤖 アシスタント
*2023/10/26 14:52:01*

Amazon Amplifyを使用して、認証されたユーザーの`username`を取得する方法は以下の通りです。

1. 必要なAmplifyカテゴリを設定します。
   
   ```swift
   import Amplify
   import AmplifyPlugins
   ```

2. ユーザーの認証情報を取得します。
   
   ```swift
   if let user = Amplify.Auth.getCurrentUser() {
       let username = user.username
       print("Username: \(username)")
   } else {
       print("User is not signed in")
   }
   ```

このコードスニペットは、現在のログイン中のユーザーの`username`を取得し、それをコンソールに出力します。ユーザーがサインインしていない場合、"User is not signed in"が出力されます。

注意: この方法で`username`を取得する前に、ユーザーが正しくサインインしていることを確認してください。

---
