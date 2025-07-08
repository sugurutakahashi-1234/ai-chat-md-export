# Retrieve Bottom Safe Area

日付: 2024-08-26

---

## 👤 ユーザー
*2024/08/26 20:18:02*

bottomのセーフエリアの高さを取得するコード

public extension UIApplication {
    @MainActor
    var hasHomeIndicator: Bool {
        guard let windowScene = connectedScenes.first as? UIWindowScene,
              let window = windowScene.windows.first
        else {
            return false
        }
        return window.safeAreaInsets.bottom &gt; 0
    }
}

---

## 🤖 アシスタント
*2024/08/26 20:18:14*

上記のコードは、`UIApplication`の拡張としてデバイスにホームインジケータがあるかどうかを判定するプロパティを提供しています。ホームインジケータがあるデバイスでは、セーフエリアの下部インセットがゼロより大きくなるため、その条件を利用して`Bool`値を返しています。

セーフエリアの下部インセットの高さを直接取得するためのコードは以下のように拡張できます：

```swift
public extension UIApplication {
    @MainActor
    var bottomSafeAreaHeight: CGFloat {
        guard let windowScene = connectedScenes.first as? UIWindowScene,
              let window = windowScene.windows.first
        else {
            return 0
        }
        return window.safeAreaInsets.bottom
    }
}
```

このコードを使用すると、`UIApplication.shared.bottomSafeAreaHeight`でセーフエリアの下部の高さを取得できます。ホームインジケータの有無に関わらず、正確なセーフエリアの下部インセットの値が返されます。

---

## 👤 ユーザー
*2024/08/26 20:18:46*

以下はもっと簡単に書くことができないのか？

    @MainActor
    var hasHomeIndicator: Bool {
        guard let windowScene = connectedScenes.first as? UIWindowScene,
              let window = windowScene.windows.first
        else {
            return false
        }
        return window.safeAreaInsets.bottom &gt; 0
    }

---

## 🤖 アシスタント
*2024/08/26 20:18:53*

`hasHomeIndicator`プロパティのコードを簡略化するために、オプショナルチェイニングとnilコアレッシングを使って、よりコンパクトに書くことができます。以下のようにリファクタリングできます：

```swift
@MainActor
var hasHomeIndicator: Bool {
    (connectedScenes.first as? UIWindowScene)?.windows.first?.safeAreaInsets.bottom ?? 0 > 0
}
```

このコードでは、オプショナルチェイニングを使用して`connectedScenes`から`UIWindowScene`および`windows`へのアクセスを簡略化しています。また、`nil`の場合には`0`を返すようにしています。これにより、コードがより簡潔になります。

---
