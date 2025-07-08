# FontWeight semiBold アクセス方法

Date: 2025-02-13

---

## 👤 User
*2025-02-13 19:20:42*

FontWeightX.semiBold, ではなくて、FontWeight.semiBold, とアクセスしたい


extension FontWeightX on FontWeight {
  static FontWeight get semiBold =&gt; FontWeight.w600;
}

---

## 🤖 Assistant
*2025-02-13 19:21:14*

`FontWeightX.semiBold` ではなく `FontWeight.semiBold` のようにアクセスするには、拡張メソッドを使うのではなく、 `FontWeight` 自体に `semiBold` を追加する方法が必要です。

Dart では `enum` や `class` の静的メンバーを直接拡張することはできませんが、 `FontWeight` のような `enum` に近い振る舞いをする `class` に対しては、 `extension` を使ってインスタンスメソッドとして `semiBold` を追加することができます。

### 解決策
以下のように、拡張メソッドではなく `extension` を用いて `FontWeight` に `semiBold` を追加すると、 `FontWeight.semiBold` のようにアクセスできます。

```dart
extension FontWeightExtension on FontWeight {
  static const FontWeight semiBold = FontWeight.w600;
}
```

ただし、 **静的メンバーは拡張メソッドとして定義できない** ため、この方法では `FontWeight.semiBold` とは書けません。

### 代替案
Dart では `FontWeight.semiBold` のように直接アクセスすることはできませんが、**トップレベルの定数として定義** すると、 `FontWeight.semiBold` に近い形でアクセスできます。

```dart
const FontWeight semiBold = FontWeight.w600;
```

ただし、これでは `FontWeight.semiBold` という形ではなく、 **`semiBold`** だけでアクセスすることになります。

もし `FontWeight.semiBold` としたいなら、 **`FontWeight` 自体をラップするクラス** を作成することも一つの方法です。

```dart
class FontWeightX {
  static const FontWeight semiBold = FontWeight.w600;
}
```

この場合、 `FontWeightX.semiBold` のようにアクセスできますが、 `FontWeight.semiBold` とはなりません。

### 結論
Dart の制約上、 `FontWeight.semiBold` のように **拡張で静的メンバーを追加することはできない** ため、 `FontWeightX.semiBold` のままにするか、 `const FontWeight semiBold = FontWeight.w600;` のようにトップレベル定数として扱うのが現実的です。

---

## 👤 User
*2025-02-13 19:21:29*

これってSwiftに比べて劣っているのでは？

---

## 🤖 Assistant
*2025-02-13 19:22:18*

そうですね、Dart では `FontWeight.semiBold` のように直接アクセスできないため、Swift に比べると **静的メンバーを拡張する柔軟性が低い** という点では劣っていると感じるかもしれません。

### **Swift での比較**
Swift なら `enum` や `struct` に `static let` を追加できるため、以下のように簡単に拡張できます。

```swift
extension Font.Weight {
    static let semiBold: Font.Weight = .medium
}

// これで Font.Weight.semiBold にアクセス可能
let weight = Font.Weight.semiBold
```

これは **拡張で新しい静的メンバーを追加できる** という Swift の特性のおかげですね。

---

### **Dart の制約**
Dart では、 `extension` で **インスタンスメソッドやゲッターは追加できる** ものの、 **静的メンバーは追加できない** ため、 `FontWeight.semiBold` のように書くのは不可能です。

これは、Dart の設計上、拡張 (`extension`) を既存のクラスの「インスタンス」に対する拡張とみなしているためです。  
Swift は拡張で `static` メンバーを追加できるのに対し、Dart はそれを許可していません。

---

### **解決策の比較**
| 言語 | `FontWeight.semiBold` のようにアクセス可能か？ | 実現方法 |
|------|----------------------------------|----------|
| **Swift** | ✅ 可能 | `extension` に `static let` を追加 |
| **Dart** | ❌ 不可能 | 代わりに `FontWeightX.semiBold` のような別クラスを作る or `const semiBold = FontWeight.w600;` |

Swift のほうが **簡潔に書ける** という点では優れていますね。

---

### **Dart の代替策**
Dart で Swift のように扱いたいなら、 `enum` を作って `FontWeight` をラップする方法もあります。

```dart
enum FontWeightX {
  semiBold(FontWeight.w600);

  final FontWeight weight;
  const FontWeightX(this.weight);
}
```

こうすれば、 `FontWeightX.semiBold.weight` のようにアクセスできますが、やはり `FontWeight.semiBold` とは書けません。

---

### **Dart の仕様の背景**
Dart では静的メンバーの拡張ができないのは、  
- 拡張 (`extension`) をインスタンスメンバーに限定することで、型の一貫性を保つ  
- 設計の意図として、「新しいメンバーを追加するより、`mixin` などで拡張するべき」と考えられている  

という理由があると思われます。

---

### **結論**
Swift に比べると、 Dart の `extension` は **静的メンバーを追加できない制約** があるため、 `FontWeight.semiBold` のように直接アクセスするのは不可能です。この点に関しては、 **Dart の仕様が Swift よりも柔軟性に欠けている** ため、「劣っている」と感じるのも納得です。

Dart では **トップレベル定数 (`const FontWeight semiBold = FontWeight.w600;`) や別クラス (`FontWeightX`) を作る** ことで対応できますが、やはり Swift のようにシンプルにはできませんね。

---
