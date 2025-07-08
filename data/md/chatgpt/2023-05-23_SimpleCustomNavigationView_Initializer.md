# SimpleCustomNavigationView Initializer

Date: 2023-05-23

---

## 👤 User
*2023-05-23 23:36:54*

以下のコードのイニシャライザをつくってほしい

```swift
public struct SimpleCustomNavigationView<Content: View>: View {
    let content: () -> Content

    @ViewBuilder
    public var body: some View {
        if #available(iOS 16.0, *) {
            NavigationStack {
                content()
            }
        } else {
            NavigationView {
                content()
            }
        }
    }
}

```

---

## 🤖 Assistant
*2023-05-23 23:37:27*

SwiftのStructには暗黙的にMemberwise Initializerが生成されます。このため、`SimpleCustomNavigationView` には初期化子が自動的に提供されています。そのため、初期化するときには以下のように行います：

```swift
SimpleCustomNavigationView {
    // ここにContent Viewを定義します
}
```

ただし、明示的にInitializerを追加したい場合、以下のようにすることも可能です。

```swift
public struct SimpleCustomNavigationView<Content: View>: View {
    let content: () -> Content

    public init(@ViewBuilder content: @escaping () -> Content) {
        self.content = content
    }

    @ViewBuilder
    public var body: some View {
        if #available(iOS 16.0, *) {
            NavigationStack {
                content()
            }
        } else {
            NavigationView {
                content()
            }
        }
    }
}
```

この初期化子では、`@escaping` クロージャを使っています。これは、`content`が関数を抜ける後にも保存されることを示しています。また、`@ViewBuilder` を使用して、複数のViewを結合して一つのViewを作成できます。

---
