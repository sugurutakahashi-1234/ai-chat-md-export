# SwiftUI List vs Form

日付: 2023-05-23

---

## 👤 ユーザー
*2023/5/24 0:00:17*

SwiftUI の List と Form の違いを教えて欲しい

---

## 🤖 アシスタント
*2023/5/24 0:01:34*

SwiftUIは、Appleが開発したデクララティブなUIフレームワークで、リスト表示やフォーム表示を簡単に行えます。`List`と`Form`はどちらも一連の子ビューを表示するためのコンテナですが、特定の状況でそれぞれの利点があります。

### List

`List`は一般的なスクロール可能なリストを表示します。iOS上ではテーブルビューのような見た目を持ち、各リストアイテムが個別の行として表示されます。カスタムセルの作成やデータの動的表示などが可能です。`List`は`ForEach`と組み合わせて使用されることが多いです。

```swift
List {
    ForEach(0..<5) { item in
        Text("Row \(item)")
    }
}
```

### Form

一方で、`Form`は主に設定画面などのフォーム入力に最適化されています。フォームは視覚的にセクションに分割され、各セクション内の行は特定の入力要素（スイッチ、スライダー、テキストフィールドなど）に対応します。また、`Form`内の行は自動的に適切なスタイルが適用されます。

```swift
Form {
    Section(header: Text("Personal Information")) {
        TextField("Name", text: $name)
        TextField("Email", text: $email)
    }
    Section(header: Text("Preferences")) {
        Toggle(isOn: $notificationsEnabled) {
            Text("Enable Notifications")
        }
        Picker(selection: $selectedColor, label: Text("Favorite Color")) {
            ForEach(colors, id: \.self) { color in
                Text(color).tag(color)
            }
        }
    }
}
```

`List`と`Form`は似ていますが、基本的にはそれぞれの用途に応じて使用すると良いでしょう。`List`は汎用的なリスト表示に、`Form`はユーザー入力を扱うフォーム表示に最適です。

---
