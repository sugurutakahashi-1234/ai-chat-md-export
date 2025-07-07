# SwiftUI `async` and `@MainActor` Guard

日付: 2023-05-26

---

## 👤 ユーザー
*2023/5/26 12:37:33*

SwiftUI で async の関数の中で @MainActor な変数を gurad let でアンラップして使いたい場合はどうすればいい？

---

## 🤖 アシスタント
*2023/5/26 12:38:27*

Swift 5.5から導入された新機能の一つに、非同期タスク（async/await）と`@MainActor`という新たなConcurrency modelがあります。これは、Swiftの非同期処理をより簡単に制御し、データ競合を避けるためのものです。特に`@MainActor`は、メインスレッドで実行されるべき作業を指定するためのものです。

そして、Swiftでnilを安全に取り扱うための方法の一つが`guard let`です。これはOptional変数をアンラップするためのもので、変数がnilの場合には指定したエラーハンドリングを実行します。

非同期関数内で`@MainActor`な変数を`guard let`でアンラップする際には、以下のように書くことができます：

```swift
@MainActor var mainActorVariable: Type? = nil

func someAsyncFunction() async {
    // 非同期な関数の中で mainActorVariable をアンラップ
    await Task {
        guard let unwrapped = mainActorVariable else {
            print("mainActorVariable was nil")
            return
        }
        // unwrapped を利用した処理...
    }
}
```

このコードでは、非同期タスク（`Task`）を作成し、その中で`@MainActor`な変数`mainActorVariable`を`guard let`でアンラップしています。`Task`内部はデフォルトで非同期であるため、この中で`await`を使用することなく`@MainActor`な変数にアクセスできます。

また、タスクが`@MainActor`のコンテキストで実行されることを保証するために、非同期タスクを`@MainActor.run`でラップすることもできます。この場合、以下のようになります：

```swift
func someAsyncFunction() async {
    // 非同期な関数の中で mainActorVariable をアンラップ
    await Task {
        await MainActor.run {
            guard let unwrapped = mainActorVariable else {
                print("mainActorVariable was nil")
                return
            }
            // unwrapped を利用した処理...
        }
    }
}
```

このコードでは、`MainActor.run`によって、`@MainActor`のコンテキストでコードが実行されることが保証されます。

---

## 👤 ユーザー
*2023/5/26 12:39:30*

unwrapped を利用した処理はMainActorで行いたくないんだ

---

## 🤖 アシスタント
*2023/5/26 12:40:01*

非同期タスクの中で`@MainActor`な変数をアンラップし、その値を別のタスクで利用したい場合、その値を一時的に非同期タスクのスコープ外に移すことが必要です。以下にそのための一例を示します：

```swift
@MainActor var mainActorVariable: Type? = nil

func someAsyncFunction() async {
    var unwrapped: Type? = nil
    
    // MainActorでmainActorVariableをアンラップ
    await MainActor.run {
        unwrapped = mainActorVariable
    }
    
    // アンラップした値をguard letで安全に取り出す
    guard let safeUnwrapped = unwrapped else {
        print("mainActorVariable was nil")
        return
    }
    
    // safeUnwrappedを利用した処理...
}
```

このコードでは、`MainActor.run`によってメインスレッドで`mainActorVariable`のアンラップを行い、その結果を`unwrapped`変数に格納しています。この`unwrapped`変数は`MainActor.run`のスコープ外で宣言されているため、`MainActor.run`のスコープ外でその値にアクセスすることができます。そしてその後で`unwrapped`を`guard let`で安全に取り出しています。

このようにすれば、`mainActorVariable`のアンラップはメインスレッドで行われますが、その値の利用は別の非同期タスクで行うことができます。

---

## 👤 ユーザー
*2023/5/26 12:40:49*

ちなみに API 接続などって MainActor で行なったらよくないの？その取得した値をViewに更新するためにはMainActorで記述すると楽なんだが

---

## 🤖 アシスタント
*2023/5/26 12:41:24*

確かに、ビューへの更新が必要な場合は `@MainActor` での処理が非常に便利です。一方で、長時間実行されるような重い作業（例えば、APIへの接続やデータの取得など）を `@MainActor` （つまりメインスレッド）で実行すると、その間UIがフリーズする可能性があります。これはユーザ体験に悪影響を与えるため、通常は非メインスレッドで重い作業を行い、その結果をメインスレッドでUIに反映するという方式が取られます。

そのため、以下のように非メインスレッドでデータ取得を行い、取得したデータをメインスレッドでUIに反映するというパターンがよく使われます：

```swift
func fetchDataAndUpdateUI() async {
    // 非メインスレッドでAPIからデータを取得
    let data = await fetchFromAPI()

    // メインスレッドでUIを更新
    await MainActor.run {
        // UIの更新処理
    }
}

func fetchFromAPI() async -> DataType {
    // APIからデータを取得する処理
    // ...
}
```

このコードでは、`fetchDataAndUpdateUI`関数の中で非メインスレッドでAPIからデータを取得しています。そしてその結果を`MainActor.run`でメインスレッドでUIに反映しています。

---
