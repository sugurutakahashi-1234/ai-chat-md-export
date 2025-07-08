# Async User and Models

日付: 2023-06-15

---

## 👤 ユーザー
*2023/06/15 23:04:44*

userと pointHistories は非同期で呼べる気がする

final class PointRootPresenter: ObservableObject {
    @Published private(set) var user: User?
    @Published private(set) var pointHistories: [PointHistory] = []
    private let apiRequestManager: ApiRequestManagerProtocol

    // TODO: AmplifyApiRequestManagerに変更する
    init(apiRequestManager: ApiRequestManagerProtocol = ApiRequestManagerProtocolMock()) {
        self.apiRequestManager = apiRequestManager
    }

    func onAppear() async {
        do {
            let user = try await apiRequestManager.getUser()
            let pointHistories = try await apiRequestManager.getPointHistories()
            self.user = user
            self.pointHistories = pointHistories
        } catch {
            // TODO: エラーアラート表示ロジックを追加する
            print(error)
        }
    }
}

---

## 🤖 アシスタント
*2023/06/15 23:05:31*

あなたのご指摘の通り、現在の `onAppear` メソッドでは `getUser` と `getPointHistories` メソッドの呼び出しが同期的に行われています。これは、`getUser` が完了するまで `getPointHistories` が始まらないことを意味します。

Swift 5.5 の `async/await` を用いた並行処理を活用すれば、これらのメソッドを非同期的に実行し、処理時間を短縮することが可能です。下記にその修正例を示します。

```swift
func onAppear() async {
    await withTaskGroup(of: (User.self, [PointHistory].self)) { group in
        group.async {
            return (try await apiRequestManager.getUser(), [])
        }
        
        group.async {
            return (nil, try await apiRequestManager.getPointHistories())
        }
        
        for await (user, histories) in group {
            if let user = user {
                self.user = user
            }
            
            if !histories.isEmpty {
                self.pointHistories = histories
            }
        }
    }
}
```

上記のコードでは、`withTaskGroup` を用いて `getUser` と `getPointHistories` のタスクを同時に開始します。各タスクはそれぞれの結果をタプル `(User?, [PointHistory])` の形で返します。

タスクが完了したら、その結果は for-await-in ループで処理されます。`user` が存在すればそれを `self.user` に、`histories` が空でなければそれを `self.pointHistories` に格納します。

なお、上記のコードではエラーハンドリングが含まれていません。エラーが発生した場合の処理も適切に行うようにコードを改善する必要があります。

---

## 👤 ユーザー
*2023/06/15 23:05:40*

もっと簡単に書けないの？

---

## 🤖 アシスタント
*2023/06/15 23:06:14*

`Task` APIを使用して、よりシンプルに非同期的にAPIリクエストを行うことも可能です。以下に示すように、各APIリクエストを別々のタスクとして開始し、結果を取得します。

```swift
func onAppear() async {
    let userTask = Task { () -> User in
        return try await apiRequestManager.getUser()
    }
    
    let pointHistoryTask = Task { () -> [PointHistory] in
        return try await apiRequestManager.getPointHistories()
    }
    
    do {
        self.user = try await userTask.value
        self.pointHistories = try await pointHistoryTask.value
    } catch {
        // Handle error
        print(error)
    }
}
```

このコードでは、`Task` インスタンスを作成して非同期タスクを開始します。それぞれのタスクは `Task` インスタンスの `value` プロパティを `await` することで取得できます。`try await` を使用することで、タスクが失敗した場合のエラーを捕捉できます。

これにより、`getUser` と `getPointHistories` は非同期に実行され、両方の結果が得られた時点でそれぞれのプロパティに値が設定されます。

---

## 👤 ユーザー
*2023/06/15 23:06:28*

シンプルにタスクブロックで囲えないかな？

---

## 🤖 アシスタント
*2023/06/15 23:07:06*

ご指摘の通り、`Task` オブジェクトを使って、複数の非同期タスクを簡単に並行に実行することができます。そのため、非同期関数を同時に起動するために `Task` ブロックを利用することができます。ただし、エラーハンドリングはタスク内で行うことが一般的です。以下に例を示します。

```swift
func onAppear() {
    Task {
        do {
            let user = try await apiRequestManager.getUser()
            self.user = user
        } catch {
            // Handle error
            print(error)
        }
    }
    
    Task {
        do {
            let pointHistories = try await apiRequestManager.getPointHistories()
            self.pointHistories = pointHistories
        } catch {
            // Handle error
            print(error)
        }
    }
}
```

このように、`Task` ブロックを使用して各API呼び出しを非同期に行うことができます。ただし、各タスクが個別にエラーハンドリングを行うため、エラーハンドリングのロジックが重複する可能性があります。これを避けるためには、エラーハンドリングを共通の関数で行うなどの工夫が必要となります。

---
