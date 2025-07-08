# AmplifySDKエラーの翻訳方法

Date: 2023-06-15

---

## 👤 User
*2023-06-15 17:33:12*

SwiftのアプリでAmplifySDKを使用しているのだけれども、AmplifySDKが返却するエラー文言を日本語に変える方法などはありますか？

---

## 🤖 Assistant
*2023-06-15 17:34:07*

AWS Amplify SDKのエラーメッセージは基本的に英語で返却されます。SDKが直接サポートするエラーメッセージの翻訳機能はないため、アプリ側でエラーメッセージを翻訳する必要があります。

一つの方法は、エラーコードやエラーメッセージを捕捉し、それに対応する日本語のメッセージをユーザーに表示することです。例えば、Swiftの場合は次のように実装できます：

```swift
import Amplify

Amplify.Auth.signIn(username: "username", password: "password") { result in
    switch result {
    case .success:
        print("Sign in succeeded")
    case .failure(let error):
        print("Sign in failed \(error)")
        
        switch error {
        case .usernameNotFound(let message, let recoverySuggestion, let error):
            // 英語のエラーメッセージが "Username not found" の場合
            if message == "Username not found" {
                // 日本語でエラーメッセージを表示
                print("ユーザー名が見つかりません")
            }
        default:
            print("その他のエラー")
        }
    }
}
```

この方法はエラーメッセージの数が少ない場合や、特定のエラーメッセージだけ翻訳する必要がある場合に適しています。しかし、大量のエラーメッセージを翻訳する必要がある場合、翻訳を管理するためのより効率的な方法を探すべきです。

一つの解決策は、ローカライゼーションライブラリを使用することです。これらのライブラリはエラーメッセージをキーとして使用し、対応する翻訳を検索します。ローカライゼーションライブラリには多くのオプションがありますが、Swiftで広く使われているものの一つは `Localize-Swift` です。

---
