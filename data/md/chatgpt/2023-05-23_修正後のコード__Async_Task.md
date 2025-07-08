# 修正後のコード: Async Task

日付: 2023-05-23

---

## 👤 ユーザー
*2023/5/23 19:57:43*

以下のコードでエラーになったんだけどどう修正すればいい？

AVCaptureDevice.requestAccess(for: .video) { [weak self] _ in
            await MainActor.run {
                self?.cameraAuthorizationStatus = AVCaptureDevice.authorizationStatus(for: .video)
            }
        }

Cannot pass function of type '(Bool) async -&gt; Void' to parameter expecting synchronous function type

---

## 🤖 アシスタント
*2023/5/23 19:58:21*

あなたが遭遇した問題は、非同期関数を同期的に期待するパラメータに渡しているためです。Swift 5.5以降では、非同期APIを使用するためには特別な非同期コンテキスト内で実行する必要があります。

しかし、あなたが遭遇した問題は、`AVCaptureDevice.requestAccess(for:completionHandler:)`メソッドが非同期的な関数をサポートしていないという事実に関連しています。この関数の`completionHandler`は、ディスパッチキュー上で実行される普通のクロージャーです。

あなたが`MainActor`の非同期メソッドでコードを実行したい場合、非同期タスクを起動する必要があります。この問題を解決するには、以下のようにコードを修正できます。

```swift
AVCaptureDevice.requestAccess(for: .video) { [weak self] _ in
    Task {
        await MainActor.run {
            self?.cameraAuthorizationStatus = AVCaptureDevice.authorizationStatus(for: .video)
        }
    }
}
```

ここでは、`Task`イニシャリエータを使用して非同期タスクを起動し、その中で`MainActor.run`メソッドを実行しています。これにより、あなたが欲しい非同期の動作が得られます。

---

## 👤 ユーザー
*2023/5/23 19:58:53*

そのように修正したら Reference to captured var 'self' in concurrently-executing code というエラーがでた

---

## 🤖 アシスタント
*2023/5/23 19:59:11*

Swift の `Task { }` はデフォルトで並行実行されるため、クロージャ内から `self` への参照は安全ではない可能性があります。この場合、 `Task { }` を使わずに、 `Task.init` メソッドの `@Sendable` クロージャバージョンを使ってタスクを作成することが推奨されます。

以下のように修正してみてください：

```swift
AVCaptureDevice.requestAccess(for: .video) { granted in
    if let self = self {
        Task.init { [cameraAuthorizationStatus = self.cameraAuthorizationStatus] in
            await MainActor.run {
                cameraAuthorizationStatus = AVCaptureDevice.authorizationStatus(for: .video)
            }
        }
    }
}
```

この修正により、非同期タスクが安全に `self` を参照できるようになります。

---

## 👤 ユーザー
*2023/5/23 19:59:34*

もっと簡単に書けないの？

---

## 🤖 アシスタント
*2023/5/23 19:59:56*

はい、非同期タスクをよりシンプルに書くための方法があります。最初のクロージャ内で`self`を取り出し、非同期タスクを作成する際に`self`を安全に参照できるようにすることで、コードを簡単に書くことが可能です。

その際、以下のように修正することができます。

```swift
AVCaptureDevice.requestAccess(for: .video) { [weak self] _ in
    guard let self = self else { return }
    Task {
        await MainActor.run {
            self.cameraAuthorizationStatus = AVCaptureDevice.authorizationStatus(for: .video)
        }
    }
}
```

この修正では、`guard let self = self else { return }` を使って弱参照を強参照に変換しています。そしてその後で非同期タスクを起動します。

---
