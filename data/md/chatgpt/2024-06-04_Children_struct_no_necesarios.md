# Children struct no necesarios

日付: 2024-06-04

---

## 👤 ユーザー
*2024/6/4 13:37:26*

children とか enumerated がいらない気がする」

struct PropertyViewBody: View {
    let object: any Encodable
    let onTapElement: (any Encodable) -&gt; Void

    var body: some View {
        ForEach(Array(Mirror(reflecting: object).children.enumerated()), id: \\.offset) { \_, child in
            if let label = child.label, let childValue = child.value as? any Encodable {
                PropertyChildView(label: label, childValue: childValue, onTapElement: onTapElement)
            }
        }
    }
}

---

## 🤖 アシスタント
*2024/6/4 13:37:35*

`children`や`enumerated`を使わずに同様の機能を達成するために、直接`children`を反復処理し、その要素を処理することができます。以下はその修正バージョンです：

```swift
struct PropertyViewBody: View {
    let object: any Encodable
    let onTapElement: (any Encodable) -> Void

    var body: some View {
        ForEach(Mirror(reflecting: object).children, id: \.label) { child in
            if let label = child.label, let childValue = child.value as? any Encodable {
                PropertyChildView(label: label, childValue: childValue, onTapElement: onTapElement)
            }
        }
    }
}
```

`id: \.label`を使用して、`ForEach`に一意の識別子を提供しています。これにより、`children`や`enumerated`を使わずに、直接反復処理が可能です。

---
