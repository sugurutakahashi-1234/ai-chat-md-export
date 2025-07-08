# Immutable self error

Date: 2024-03-29

---

## 👤 User
*2024-03-30 01:36:52*

以下を修正してほしい

Cannot assign to value: 'self' is immutable

public enum BuildScheme: Sendable {
    case testing // 現状、Interactor(UseCase) のテスト時のみしか使われていない
    case development
    case staging
    case production
}

extension BuildScheme {
    var isTesting: Bool {
        self = .testing
    }
}

---

## 🤖 Assistant
*2024-03-30 01:37:24*

Swiftのエラーメッセージ「Cannot assign to value: 'self' is immutable」は、`self`に値を代入しようとした時に表示されます。`self`はそのインスタンス自身を指しますが、プロパティアクセスやメソッド内での値の変更は可能ですが、`self`自体に直接値を代入することはできません。特に、`enum`や`struct`のような値型では、インスタンスメソッド内での`self`への代入は、メソッドが`mutating`キーワードで修飾されていない限り不可能です。しかし、ここでの目的は`self`の値を変更することではなく、ある条件が真であるかどうかを判断することです。

あなたがしたいことは、おそらく`isTesting`が`true`を返す条件を確認することですね。そのため、`self`と特定の値（この場合は`.testing`）を比較することで、その条件を確認できます。以下のように修正することで、期待した動作を得ることができます：

```swift
extension BuildScheme {
    var isTesting: Bool {
        return self == .testing
    }
}
```

この修正により、`isTesting`プロパティは、インスタンスが`.testing`ケースに該当する場合に`true`を返し、それ以外の場合は`false`を返します。これで、「Cannot assign to value: 'self' is immutable」というエラーは解消されるはずです。

---
