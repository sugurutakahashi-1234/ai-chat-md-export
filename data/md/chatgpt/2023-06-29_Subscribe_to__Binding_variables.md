# Subscribe to @Binding variables

日付: 2023-06-29

---

## 👤 ユーザー
*2023/06/29 16:12:46*

@Binding の変数ってsubscribeすることってできないんだっけ？

---

## 🤖 アシスタント
*2023/06/29 16:13:16*

SwiftUIの`@Binding`は、親ビューと子ビュー間でデータを共有するためのツールで、親ビューが所有するデータの一部への参照を子ビューに渡すことができます。しかし、`@Binding`を使用して変数に直接「サブスクライブ」することは基本的にできません。

一方で、SwiftUIは`@ObservableObject`と`@Published`という特性を持つことで、データの変更を監視することが可能です。これらは、データが変更されるとビューに通知し、ビューの再描画を引き起こします。

例えば、次のように`ObservableObject`プロトコルを準拠したクラスを作成することができます：

```swift
class UserSettings: ObservableObject {
    @Published var username = "Anonymous"
}
```

このクラスのインスタンスをSwiftUIビューで使用すると、`username`が変更されるたびにビューが再描画されます：

```swift
struct ContentView: View {
    @ObservedObject var settings = UserSettings()

    var body: some View {
        Text("Username: \(settings.username)")
    }
}
```

このように、SwiftUIでは`@Binding`ではなく`@ObservableObject`と`@Published`を使用してデータの変更をサブスクライブします。

---

## 👤 ユーザー
*2023/06/29 16:13:41*

@Binding な変数にさらに @Published することってできるんだっけ？

---

## 🤖 アシスタント
*2023/06/29 16:14:13*

`@Published`は、`ObservableObject`プロトコルを準拠したクラスのプロパティに適用できるプロパティラッパーです。したがって、`@Published`を直接`@Binding`に適用することはできません。

ただし、`@Binding`を使用して、親ビューが`@Published`としてマークされたプロパティを子ビューと共有することが可能です。それは以下のようになります：

```swift
class UserSettings: ObservableObject {
    @Published var username = "Anonymous"
}

struct ChildView: View {
    @Binding var username: String

    var body: some View {
        TextField("Username", text: $username)
    }
}

struct ParentView: View {
    @ObservedObject var settings = UserSettings()

    var body: some View {
        ChildView(username: $settings.username)
    }
}
```

この例では、`ParentView`が`UserSettings`オブジェクトを保持し、`username`プロパティを`ChildView`と共有しています。`ChildView`でテキストフィールドの値が変更されると、その変更は`@Published`プロパティを通じて`ParentView`に伝達され、必要に応じて`ParentView`は再描画されます。

したがって、`@Binding`を通じて`@Published`プロパティを監視することは可能ですが、`@Published`を`@Binding`変数に直接適用することはできません。

---
