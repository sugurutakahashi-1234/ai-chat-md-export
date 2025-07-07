# defer behavior in catch

日付: 2023-06-06

---

## 👤 ユーザー
*2023/6/6 15:02:08*

以下の処理って、deferの処理はcatchブロックに行っても実行されるの？

func onAppear() async {
        do {
            isLoadingAutoLogin = true
            defer {
                isLoadingAutoLogin = false
            }

            try await Task.detached {
                try await self.authManager.fetchAuthSession()
            }.value
        } catch {
            // 予期せぬ自動ログインのエラー（有効期限切れなどでもない）
            print("\\(error): \\(error.localizedDescription)")
        }
    }

---

## 🤖 アシスタント
*2023/6/6 15:02:30*

はい、`defer` ブロックに記述されたコードは、それが記述されたスコープから出るときに常に実行されます。このスコープが正常に終了するか、エラーで終了するかに関わらずです。

この例では、`defer` ブロックは `do` ブロックのスコープ内にあるので、`do` ブロックから出るときに実行されます。`do` ブロックは、それが含まれる `onAppear()` 関数が `try await Task.detached { ... }` を実行する間にエラーをスローするかもしれないため、そのエラーは `catch` ブロックで処理されます。そのため、`do` ブロックからの出口は2つあり、正常に終了するか、`catch` ブロックに移るかのいずれかです。

どちらの場合でも、`defer` ブロックの中にある `isLoadingAutoLogin = false` は実行されます。これは、関数から出る前に特定のクリーンアップタスクを保証するための機能です。

---

## 👤 ユーザー
*2023/6/6 15:03:00*

プレイグラウンドでそのような挙動を確認できるような記述を書いて欲しい

---

## 🤖 アシスタント
*2023/6/6 15:03:31*

Swift Playgroundsでは `async` や `Task.detached` といったSwift 5.5の非同期機能が利用できますが、以下にそのような挙動を確認できるSwiftコードを示します。このコードはSwift 5.5以降をサポートする環境で動作します。

```swift
import Foundation

class AuthManager {
    func fetchAuthSession() async throws {
        // Just an example of an async task. Here we simply wait for a second.
        await Task.sleep(1_000_000_000)
        // Uncomment the line below to simulate an error
        // throw NSError(domain: "Auth", code: 1, userInfo: nil)
    }
}

let authManager = AuthManager()

func onAppear() async {
    var isLoadingAutoLogin = true
    do {
        defer {
            isLoadingAutoLogin = false
            print("isLoadingAutoLogin = \(isLoadingAutoLogin)")
        }

        try await Task.detached {
            try await authManager.fetchAuthSession()
        }.value
    } catch {
        print("\(error): \(error.localizedDescription)")
    }
}

Task.init {
    await onAppear()
}
```

このコードでは、`AuthManager`クラスに非同期の`fetchAuthSession`メソッドが定義されています。このメソッドは、実際の認証セッションをフェッチする代わりに、1秒間待つだけのシンプルなタスクです。

`onAppear`関数では、非同期タスクを実行し、それが完了するまで`isLoadingAutoLogin`を`true`に保ちます。非同期タスクが完了するか、エラーがスローされると、`defer`ブロックが実行され、`isLoadingAutoLogin`が`false`にセットされます。

エラーをシミュレートするには、`fetchAuthSession`メソッドの中でコメントを外すと、エラーがスローされ、そのエラーが`onAppear`関数の`catch`ブロックで処理されます。その場合でも、`defer`ブロックは実行されます。

---

## 👤 ユーザー
*2023/6/6 15:04:30*

コメントを外すのではなくて、Boolのrandomで実行するようにしてほしい。そのときにどちらになったかもプリントして欲しい

---

## 🤖 アシスタント
*2023/6/6 15:04:55*

要望に従って、以下のようにコードを修正しました。

```swift
import Foundation

class AuthManager {
    func fetchAuthSession() async throws {
        // Just an example of an async task. Here we simply wait for a second.
        await Task.sleep(1_000_000_000)
        // Randomly throw an error
        if Bool.random() {
            throw NSError(domain: "Auth", code: 1, userInfo: nil)
        }
    }
}

let authManager = AuthManager()

func onAppear() async {
    var isLoadingAutoLogin = true
    do {
        defer {
            isLoadingAutoLogin = false
            print("isLoadingAutoLogin = \(isLoadingAutoLogin)")
        }

        try await Task.detached {
            try await authManager.fetchAuthSession()
        }.value
        print("Task completed without error.")
    } catch {
        print("An error occurred: \(error): \(error.localizedDescription)")
    }
}

Task.init {
    await onAppear()
}
```

ここでは、`fetchAuthSession` メソッド内で `Bool.random()` を使ってランダムにエラーをスローしています。また、エラーが発生したかどうかを確認できるように、エラーが発生しなかった場合と発生した場合の両方でメッセージを出力するようにしました。

---
