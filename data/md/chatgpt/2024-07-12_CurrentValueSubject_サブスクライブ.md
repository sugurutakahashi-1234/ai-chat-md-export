# CurrentValueSubject サブスクライブ

Date: 2024-07-12

---

## 👤 User
*2024-07-12 17:44:55*

CurrentValueSubject について、サブスクライブした段階での元のvalueの値を流すことはできないか？庵

---

## 🤖 Assistant
*2024-07-12 17:45:03*

`CurrentValueSubject`では、サブスクライブしたタイミングでその時点の値を流す機能が組み込まれています。以下に例を示します。

```swift
import Combine

// CurrentValueSubjectの初期値を設定
let subject = CurrentValueSubject<Int, Never>(42)

// サブスクライブする前に値を変更
subject.value = 100

// サブスクライブ
let subscription = subject.sink { value in
    print("Received value: \(value)")
}

// サブスクライブ時点での値が出力される
```

このコードを実行すると、`Received value: 100`と表示され、サブスクライブした段階での値が流れています。

したがって、`CurrentValueSubject`はサブスクライブした時点でその時点の最新の値を自動的に流します。追加の操作は不要です。

---

## 👤 User
*2024-07-12 17:45:45*

sink のタイミングがおそくても現在の値も流してくれるのか？

---

## 🤖 Assistant
*2024-07-12 17:45:59*

はい、`CurrentValueSubject`はサブスクライブしたタイミングに関わらず、現在の値を流してくれます。以下の例を見てください。

```swift
import Combine
import Foundation

// CurrentValueSubjectの初期値を設定
let subject = CurrentValueSubject<Int, Never>(42)

// 3秒後にサブスクライブ
DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
    let subscription = subject.sink { value in
        print("Received value: \(value)")
    }
}

// 1秒後に値を変更
DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
    subject.value = 100
}

// 5秒後に値を変更
DispatchQueue.main.asyncAfter(deadline: .now() + 5) {
    subject.value = 200
}

// Run the run loop to allow the asynchronous code to execute
RunLoop.main.run()
```

このコードを実行すると、次のような出力が得られます。

```
Received value: 100
Received value: 200
```

説明：
1. 初期値として`42`が設定されます。
2. 1秒後に値が`100`に変更されます。
3. 3秒後にサブスクライブが行われます。この時点で最新の値である`100`が流れます。
4. 5秒後に値が`200`に変更されます。この変更もサブスクライバーに通知されます。

このように、サブスクライブが遅れても、`CurrentValueSubject`はその時点での最新の値を流してくれます。

---
