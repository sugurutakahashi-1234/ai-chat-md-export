# MainActor Error Resolution

Date: 2024-03-13

---

## 👤 User
*2024-03-13 11:40:01*

こうしたいのだが // Main actor-isolated class property 'current' can not be referenced from a non-isolated context; this is an error in Swift 6 というエラーになる。どうすればいいか？

    /// ex) iPhone15,2, "iPad14,1"
    public var deviceIdentifier: String {
        let hoge = UIDevice.current.deviceIdentifier // Main actor-isolated class property 'current' can not be referenced from a non-isolated context; this is an error in Swift 6
        return hoge
    }

---

## 🤖 Assistant
*2024-03-13 11:40:40*

Swift 6のアクターモデルによる変更の一環として、`UIDevice.current`のようなメインアクターに隔離されたプロパティに、非隔離コンテキストからアクセスすることがエラーとなっています。これは、Swiftの並行性モデルがUIや他のメインスレッドでのみ安全にアクセスできるプロパティやメソッドを保護しようとするものです。

この問題を解決するためには、`@MainActor`アノテーションを使用して、該当するコードがメインスレッド（メインアクター）で実行されることを保証する必要があります。以下の方法で解決できます。

### `@MainActor`を使用する

`deviceIdentifier`プロパティをメインアクターで実行されるように修正します。これにより、`UIDevice.current`に安全にアクセスできるようになります。

```swift
@MainActor
public var deviceIdentifier: String {
    let hoge = UIDevice.current.identifierForVendor?.uuidString ?? "Unknown"
    return hoge
}
```

この変更により、`deviceIdentifier`はメインスレッドでのみアクセスされることが保証されます。しかし、このプロパティを非同期的にアクセスする必要がある場合は、呼び出し側で適切に対応する必要があります（例えば、非同期関数を使用するなど）。

もし`deviceIdentifier`プロパティへのアクセスを非同期的にしたい場合は、Swiftの`async/await`パターンを使用して非同期関数として定義することができます。

### `async/await`を使用する例

```swift
@MainActor
public var deviceIdentifier: String {
    get async {
        let hoge = UIDevice.current.identifierForVendor?.uuidString ?? "Unknown"
        return hoge
    }
}
```

この方法を選択した場合、`deviceIdentifier`プロパティにアクセスする際には`await`を使用する必要があります。これは、メインスレッドでの実行を強制するだけでなく、非同期コードの実行を可能にするためです。

---

## 👤 User
*2024-03-13 11:41:07*

@MainActor を var deviceIdentifier の外で使うのではなく、内部だけで使用するにはどうすればいいか？

---
