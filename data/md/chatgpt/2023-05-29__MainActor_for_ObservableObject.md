# @MainActor for ObservableObject

日付: 2023-05-29

---

## 👤 ユーザー
*2023/5/29 17:12:22*

ObservableObjectに対して、class全体を@MainActorにするのと、@publishedな変数のみ@MainActorするのとどっちがいいかな？APIとか接続したりもして、どうすればいいかわからない。APIとか接続について、class全体を@MainActorした場合は、その処理だけ、メインスレッドで処理しないようにしたりできるのかな？

---

## 🤖 アシスタント
*2023/5/29 17:13:36*

SwiftのConcurrency modelについて語るとき、主にUI更新などメインスレッドで行うべき操作と、非同期に行うべき操作（API呼び出し、長時間実行タスクなど）をどのように区分けし、それぞれをどのように管理するか、という問題があります。そのため、Swiftでは新たにアクターモデルという並行処理のパラダイムが導入されました。

アクターは、Swiftの非同期タスクを独立して実行するための手段で、他のアクターからメッセージを受け取り、そのメッセージに対して何らかの処理を行うものです。そして、Swiftでは`@MainActor`という特殊なアクターがあり、このアクターはUIの更新などメインスレッドで行うべき操作を保護するために存在します。

そして、あなたが質問したObservableObjectとは、SwiftUIが提供するプロトコルで、これを満たすオブジェクトが変更を発行（@Published）すると、それを監視しているViewが自動的に更新されます。

では、あなたの質問に答えましょう。class全体を`@MainActor`にするのと、@Publishedな変数のみ`@MainActor`するのとどちらがいいのか、という質問です。

これは一概には答えられません。それはあなたのアプリケーションが何をするのか、どのような非同期処理を行うのかに依存します。

しかし、一般的なガイドラインとしては次のようなことが言えます：

- もし、あなたのObservableObjectが主にUIの状態を管理していて、その状態の変更が主にUIの更新に影響を与えるのであれば、class全体を`@MainActor`にするのが良いでしょう。これにより、すべてのメソッドとプロパティは自動的にメインスレッドで実行され、UIの更新がスムーズに行われます。

- 一方、あなたのObservableObjectがAPI呼び出しや長時間のタスクなど、非同期処理を行うのであれば、その処理を実行するメソッドやプロパティは`@MainActor`から除外し、結果を報告するための変数（@Publishedな変数）のみを`@MainActor`にすべきです。これにより、非同期処理がメインスレッドをブロックすることなく実行

---

## 👤 ユーザー
*2023/5/29 17:13:49*

つづき

---

## 🤖 アシスタント
*2023/5/29 17:14:37*

され、結果は適切にメインスレッドで報告され、UIが更新されます。

具体的には、非同期タスクを実行するメソッドは`Task`を使用して定義し、その中で非同期処理を行い、その結果を`@Published`な変数に設定します。そしてその変数は`@MainActor`を指定してUIの更新に使用します。たとえば、次のようになります：

```swift
class MyViewModel: ObservableObject {
    @MainActor @Published var data: Data?

    func fetchData() {
        Task {
            do {
                let fetchedData = try await fetchFromAPI()
                self.data = fetchedData
            } catch {
                print("Failed to fetch data: \(error)")
            }
        }
    }

    private func fetchFromAPI() async throws -> Data {
        // APIからデータを非同期に取得する処理
    }
}
```

この例では、`fetchData`メソッドは非同期タスク（`Task`）を作成し、その中でAPIからデータを非同期に取得します。取得したデータは`@MainActor`を指定した`@Published`な変数`data`に設定され、これによりUIが更新されます。

このようにすることで、非同期処理とUIの更新を適切に分離し、かつメインスレッドをブロックすることなくスムーズなUIの更新を実現することができます。

なお、SwiftのConcurrency modelは非常に柔軟なため、実際のアプリケーションの要件により、より複雑なパターンや異なるアプローチを取ることも可能です。ですので、上記のガイドラインはあくまで一例であり、必ずしも全ての場合に適応できるわけではありませんのでご注意ください。

---

## 👤 ユーザー
*2023/5/29 17:14:55*

class全体を@MainActorした場合は、その処理だけ、メインスレッドで処理しないようにしたりできるのかな？

---

## 🤖 アシスタント
*2023/5/29 17:15:46*

`@MainActor`は、class全体がメインスレッド（UIスレッド）上で動作することを示すアノテーションです。そのため、基本的には`@MainActor`がつけられたクラス全体の操作はメインスレッド上で行われます。

しかし、ある特定の処理だけをメインスレッド以外で実行したい場合は、Swift 5.5以降で導入された新しい非同期/並行処理の機能を活用することで可能です。`Task`や`async`を利用すれば、非同期の処理を行うことができ、その処理は必ずしもメインスレッドで行われるとは限りません。

具体的には、次のように実装できます：

```swift
@MainActor class MyClass: ObservableObject {
    @Published var data: Data?

    func fetchData() {
        Task {
            await runOnBackgroundThread()
        }
    }

    private func runOnBackgroundThread() async {
        // Background threadで実行したい処理
        let fetchedData = try await fetchFromAPI()
        // APIから取得したデータをメインスレッドで@Published propertyに設定
        await self.updateData(fetchedData)
    }

    private func fetchFromAPI() async throws -> Data {
        // APIからデータを非同期に取得する処理
    }

    @MainActor private func updateData(_ newData: Data) {
        self.data = newData
    }
}
```

この例では、`fetchData`メソッドは`Task`を作成し、その中で非同期に背景での処理を行います。その処理が完了したら、結果をメインスレッドで`@Published`プロパティに設定するためのメソッドを呼び出します。

こうすることで、クラス全体を`@MainActor`にしながら、特定の処理だけをメインスレッド以外で実行することができます。ただし、この方法ではその非同期処理が完了した結果をメインスレッドに戻すためには、`@MainActor`を指定したメソッドを使う必要があります。

---

## 👤 ユーザー
*2023/5/29 17:42:45*

クラス全体を@MainActorにしながら isolated を必要に応じてつけるのはどう？

---

## 🤖 アシスタント
*2023/5/29 17:43:55*

Swiftのアクターモデルにおいて、`isolated`キーワードは、その関数が自身が所属するアクターのコンテキスト（つまり、そのアクター上でのみアクセス可能な状態）にアクセスすることを明示的に示すために使われます。

すなわち、`isolated`キーワードが付けられたメソッドはそのアクター内の状態を変更できます。そして、この機能を利用すれば、特定の処理をそのアクター（この場合、クラス全体が`@MainActor`であることになります）以外のコンテキストで実行することが可能となります。

具体的には以下のような形になるでしょう：

```swift
@MainActor class MyClass: ObservableObject {
    @Published var data: Data?

    func fetchData() {
        Task {
            do {
                let fetchedData = try await fetchFromAPI()
                await updateData(isolated: fetchedData)
            } catch {
                print("Failed to fetch data: \(error)")
            }
        }
    }

    private func fetchFromAPI() async throws -> Data {
        // APIからデータを非同期に取得する処理
    }

    func updateData(isolated newData: Data) {
        self.data = newData
    }
}
```

この例では、`fetchData`メソッドが`Task`を作成し、その中でAPIからデータを非同期に取得します。取得したデータはメソッド`updateData(isolated:)`を通じて`@Published`な変数`data`に設定されます。

ただしこのパターンは一部の特定の状況下で有用であるといえます。その理由は、SwiftのConcurrency modelが既に非同期コードに対して優れた構造と安全性を提供しており、それによってアクター内の状態へのアクセスがすでに保護されているからです。そのため、`isolated`を活用することは必要ない場合がほとんどです。

なお、情報は2021年9月時点のもので、新しいバージョンのSwiftでは詳細が変更されている可能性があるため、最新の公式ドキュメントを参照することをお勧めします。

---

## 👤 ユーザー
*2023/6/1 2:15:07*

以下のauthManager.signIn(username: email, password: password)の処理をメインスレッド外でやって欲しい場合はどうすればいいか？

@MainActor    
func signIn() async {
        do {
            guard let email, let password else {
                assertionFailure("unexpected")
                return
            }
            try await self.authManager.signIn(username: email, password: password)
        } catch {
            self.isShowingAlert = true
        }
    }

---

## 🤖 アシスタント
*2023/6/1 2:16:19*

あなたがその`signIn`メソッドをメインスレッド以外で実行したい場合、その処理を`Task`の中で実行することで実現できます。

具体的には次のような形になります：

```swift
func signIn() {
    guard let email, let password else {
        assertionFailure("unexpected")
        return
    }
    Task {
        do {
            try await self.authManager.signIn(username: email, password: password)
        } catch {
            // 注意: 以下のUI操作はメインスレッドで行われるべきなので、@MainActorを使用します。
            await self.mainActorUpdateUI()
        }
    }
}

@MainActor
private func mainActorUpdateUI() {
    self.isShowingAlert = true
}
```

この例では、`signIn`メソッドは非同期タスク（`Task`）を作成し、その中で非同期に認証処理（`authManager.signIn(username:password:)`）を行います。その処理がエラーをスローした場合、そのエラーを捉えてメインスレッドでUIの更新を行うためのメソッドを呼び出します。

こうすることで、認証処理をメインスレッド以外で実行しつつ、エラーが発生した際のUIの更新は適切にメインスレッドで行われます。これにより、メインスレッドが認証処理によってブロックされることなく、スムーズなUIの操作が保証されます。

なお、上記のコードでは新たに`mainActorUpdateUI`メソッドを定義し、そのメソッドを`@MainActor`にしています。これは、UIの更新は常にメインスレッドで行うべきであり、そのためにはその操作を`@MainActor`にする必要があるからです。

ただし、SwiftのConcurrency modelは非常に柔軟なため、あなたの具体的な要件によっては、上記のコード以外のアプローチを取ることも可能です。

---

## 👤 ユーザー
*2023/6/1 2:16:48*

この関数が定義されているclassが@MainActorだった場合だとメインスレッドで呼ばれたりしない？

---

## 🤖 アシスタント
*2023/6/1 2:17:59*

Swiftのアクターモデルにおいて、クラス全体に`@MainActor`が指定されている場合、そのクラスのメソッドは基本的にメインスレッドで呼び出されます。ただし、非同期タスクを用いることで特定の処理をメインスレッド外で実行することも可能です。

具体的には、Swiftの`Task`機能を用いることでメインスレッド以外で非同期の処理を行いつつ、その結果をメインスレッドで処理することができます。以下のような形になります：

```swift
@MainActor
class MyClass: ObservableObject {
    private var authManager: AuthManager = ...
    @Published var isShowingAlert: Bool = false

    func signIn(email: String, password: String) {
        Task {
            do {
                try await self.authManager.signIn(username: email, password: password)
            } catch {
                // UI操作はメインスレッドで行うべきなので、メインスレッドで実行されます。
                self.isShowingAlert = true
            }
        }
    }
}
```

この例では、`signIn`メソッドは非同期タスク（`Task`）を作成し、その中で非同期に認証処理（`authManager.signIn(username:password:)`）を行います。その処理がエラーをスローした場合、そのエラーを捉えてメインスレッドでUIの更新（`isShowingAlert`の設定）を行います。

こうすることで、認証処理をメインスレッド以外で実行しつつ、エラーが発生した際のUIの更新は適切にメインスレッドで行われます。これにより、メインスレッドが認証処理によってブロックされることなく、スムーズなUIの操作が保証されます。

ただし、SwiftのConcurrency modelは非常に柔軟なため、あなたの具体的な要件によっては、上記のコード以外のアプローチを取ることも可能です。

---

## 👤 ユーザー
*2023/6/1 2:18:40*

signIn に async をつけた場合に try await self.authManager.signIn(username: email, password: password) をメインスレッドで読んで欲しくないんだ

---

## 🤖 アシスタント
*2023/6/1 2:19:58*

理解しました。`signIn`メソッド自体に`async`を付け、それによって非同期に認証処理を行いつつ、その処理自体をメインスレッド以外で行いたいということですね。

この場合、Swiftの`Task`や`Task.detached`を使うことでその目的を達成することができます。`Task.detached`を使うと、新しい非同期タスクが作成され、そのタスクはデフォルトの優先度でグローバルなアクタープール（非メインスレッド）で実行されます。

以下に示すのはその一例です：

```swift
@MainActor
class MyClass: ObservableObject {
    private var authManager: AuthManager = ...
    @Published var isShowingAlert: Bool = false

    func signIn(email: String, password: String) async {
        do {
            try await Task.detached {
                try await self.authManager.signIn(username: email, password: password)
            }.value
        } catch {
            // UI操作はメインスレッドで行われるべきなので、メインスレッドで実行されます。
            self.isShowingAlert = true
        }
    }
}
```

この例では、`Task.detached`を使って新しい非同期タスクを作成し、そのタスクの中で非同期に認証処理を行います。その処理がエラーをスローした場合は、そのエラーを捉えてメインスレッドでUIの更新を行います。

なお、`Task.detached`によって作成されたタスクの結果を取得するには、そのタスクの`value`プロパティを`await`します。その`await`は非同期に処理され、その結果が利用可能になるまで呼び出し元の処理を停止します。

このように、`Task.detached`を使うことで、非同期の処理をメインスレッド以外で行いつつ、その結果をメインスレッドで処理することができます。

---
