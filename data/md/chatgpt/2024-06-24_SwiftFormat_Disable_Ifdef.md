# SwiftFormat Disable Ifdef

日付: 2024-06-24

---

## 👤 ユーザー
*2024/06/24 10:09:44*

Swift format で // swiftformat:disable indentのようにコメントで一部を無効化したいが、さらに --ifdef のみを無効化する方法を教えてほしい

---

## 🤖 アシスタント
*2024/06/24 10:09:59*

SwiftFormatでは、特定のルールのみを無効化するコメントを挿入することができます。ただし、ルールごとに無効化するためのコメントは用意されておらず、特定のルールを無効化するためには一般的な無効化コメントを使います。 `--ifdef`ルールを無効化したい場合も同様に、適用範囲を指定して無効化コメントを使用します。

次のように、無効化したい範囲の前後に `// swiftformat:disable` と `// swiftformat:enable` を挿入します。このとき、特定のルール名を記述することはできません。

```swift
// swiftformat:disable

#ifdef SOME_CONDITION
func someFunction() {
    // ...
}
#else
func otherFunction() {
    // ...
}
#endif

// swiftformat:enable
```

この方法では、無効化したい範囲全体のフォーマットを一時的に無効にします。他のルールも無効化されてしまいますが、現時点では SwiftFormat で特定のルールのみを無効化するための機能は提供されていません。

もし特定のルールの無効化が必要な場合は、SwiftFormatの設定ファイル（`.swiftformat`）でそのルールを無効化することも検討してください。この設定ファイルをプロジェクトごとにカスタマイズして使うことができます。

---

## 👤 ユーザー
*2024/06/24 10:10:18*

.swiftformat で --ifdef を無効化したい

---

## 🤖 アシスタント
*2024/06/24 10:10:30*

`.swiftformat`ファイルで特定のルールを無効化することができます。`--ifdef`ルールを無効化するには、次のように設定ファイルを編集します。

まず、プロジェクトのルートディレクトリに `.swiftformat` という名前のファイルを作成（または編集）します。その中に次のような内容を記述します：

```plaintext
--disable indent # Other rules you might want to disable
--disable ifdef
```

この設定はSwiftFormatに対して`ifdef`ルールを無効にする指示を与えます。他のルールも無効化したい場合は同様に`--disable`を使ってリストに追加します。

以下は具体例です：

```plaintext
# .swiftformat file

--indent 4
--linebreaks lf
--self insert
--disable ifdef
--disable indent # 他のルールも無効化したい場合
```

このファイルを作成または更新した後、SwiftFormatを再実行すると、`ifdef`ルールが無効化された状態でコードがフォーマットされます。

---
