# Swap Name Size

日付: 2024-02-23

---

## 👤 ユーザー
*2024/2/23 13:19:03*

以下の name と size を逆にしてほしい

public static let allContentSizes: [(name: String, size: UIContentSizeCategory)] = [
        ("extra-small", UIContentSizeCategory.extraSmall),
        ("small", .small),
        ("medium", .medium),
        ("large", .large),
        ("extra-large", .extraLarge),
        ("extra-extra-large", .extraExtraLarge),
        ("extra-extra-extra-large", .extraExtraExtraLarge),
        ("accessibility-medium", .accessibilityMedium),
        ("accessibility-large", .accessibilityLarge),
        ("accessibility-extra-large", .accessibilityExtraLarge),
        ("accessibility-extra-extra-large", .accessibilityExtraExtraLarge),
        ("accessibility-extra-extra-extra-large", .accessibilityExtraExtraExtraLarge),
    ]

---

## 🤖 アシスタント
*2024/2/23 13:19:10*

指示に従って、`name` と `size` の順番を逆にしたコードは以下の通りです。

```swift
public static let allContentSizes: [(size: UIContentSizeCategory, name: String)] = [
    (.extraSmall, "extra-small"),
    (.small, "small"),
    (.medium, "medium"),
    (.large, "large"),
    (.extraLarge, "extra-large"),
    (.extraExtraLarge, "extra-extra-large"),
    (.extraExtraExtraLarge, "extra-extra-extra-large"),
    (.accessibilityMedium, "accessibility-medium"),
    (.accessibilityLarge, "accessibility-large"),
    (.accessibilityExtraLarge, "accessibility-extra-large"),
    (.accessibilityExtraExtraLarge, "accessibility-extra-extra-large"),
    (.accessibilityExtraExtraExtraLarge, "accessibility-extra-extra-extra-large"),
]
```

---

## 👤 ユーザー
*2024/2/23 13:21:34*

enum の ContentSizeType というものを作成して、CaseIterable と String を準拠させて、var size: UIContentSizeCategory {} の変数を持たせてほしい

---

## 🤖 アシスタント
*2024/2/23 13:21:52*

指定された内容に基づいて、`ContentSizeType` という `enum` を作成し、`CaseIterable` および `String` プロトコルに準拠させ、各ケースに対応する `UIContentSizeCategory` の値を返す `var size` プロパティを含めます。以下にその実装例を示します。

```swift
import UIKit

enum ContentSizeType: String, CaseIterable {
    case extraSmall = "extra-small"
    case small = "small"
    case medium = "medium"
    case large = "large"
    case extraLarge = "extra-large"
    case extraExtraLarge = "extra-extra-large"
    case extraExtraExtraLarge = "extra-extra-extra-large"
    case accessibilityMedium = "accessibility-medium"
    case accessibilityLarge = "accessibility-large"
    case accessibilityExtraLarge = "accessibility-extra-large"
    case accessibilityExtraExtraLarge = "accessibility-extra-extra-large"
    case accessibilityExtraExtraExtraLarge = "accessibility-extra-extra-extra-large"
    
    var size: UIContentSizeCategory {
        switch self {
        case .extraSmall:
            return .extraSmall
        case .small:
            return .small
        case .medium:
            return .medium
        case .large:
            return .large
        case .extraLarge:
            return .extraLarge
        case .extraExtraLarge:
            return .extraExtraLarge
        case .extraExtraExtraLarge:
            return .extraExtraExtraLarge
        case .accessibilityMedium:
            return .accessibilityMedium
        case .accessibilityLarge:
            return .accessibilityLarge
        case .accessibilityExtraLarge:
            return .accessibilityExtraLarge
        case .accessibilityExtraExtraLarge:
            return .accessibilityExtraExtraLarge
        case .accessibilityExtraExtraExtraLarge:
            return .accessibilityExtraExtraExtraLarge
        }
    }
}
```

この実装により、`ContentSizeType` enum の各ケースは `String` 値を持ち、それぞれに対応する `UIContentSizeCategory` の値を `size` プロパティを通じて簡単に取得できます。`CaseIterable` プロトコルに準拠しているため、すべてのケースを列挙することも可能です。

---
