# Deprecated Ref Replacement

日付: 2024-12-18

---

## 👤 ユーザー
*2024/12/18 15:48:48*

import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'base_uri_provider.g.dart';

@riverpod
Uri baseUri(BaseUriRef ref) {
  return Uri.parse('http://localhost:3002');
}

'BaseUriRef' is deprecated and shouldn't be used. Will be removed in 3.0. Use Ref instead.
Try replacing the use of the deprecated member with the replacement.dartdeprecated_member_use_from_same_package

---

## 🤖 アシスタント
*2024/12/18 15:48:55*

To address the deprecation warning, you should replace `BaseUriRef` with `Ref`. Here’s the updated code:

```dart
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'base_uri_provider.g.dart';

@riverpod
Uri baseUri(Ref ref) {
  return Uri.parse('http://localhost:3002');
}
```

### Changes Made:
- Replaced `BaseUriRef` with `Ref` as per the warning.

This should resolve the warning, and the provider will now use the recommended `Ref` type. Let me know if you encounter any further issues!

---

## 👤 ユーザー
*2024/12/18 15:50:23*

これってイニシャライズでできないか?

---

## 🤖 アシスタント
*2024/12/18 15:50:28*

Riverpod の `@riverpod` を使ったプロバイダー定義では、デフォルトでプロバイダーの値を定義することはできますが、質問の文脈では「初期化時に直接設定できないか？」ということを考えているようですね。

`Provider` を使って初期化時に直接値を指定することは可能です。以下のように `Provider` を使って解決できます：

### `@riverpod` を使わず、`Provider` で直接初期化

```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';

final baseUriProvider = Provider<Uri>((ref) {
  return Uri.parse('http://localhost:3002');
});
```

これにより、プロバイダーが最初から `Uri` を返すように設定されます。`baseUriProvider` を呼び出すたびにこの `Uri` が提供されます。

---

### なぜ `@riverpod` を使わないか
`@riverpod` はコード生成を活用した便利なツールですが、シンプルなプロバイダーでは必ずしも必要ありません。初期化がシンプルな場合は `Provider` で十分です。

---

### 値の変更や動的設定が必要な場合
もし値を動的に設定する場合や、環境に応じて `Uri` を切り替えたい場合には `StateProvider` などを使う選択肢もあります。

```dart
final baseUriProvider = StateProvider<Uri>((ref) {
  return Uri.parse('http://localhost:3002');
});
```

`StateProvider` を使えば、値を後から更新できるため、アプリの設定画面などで切り替える場合に便利です。

---

シンプルな `Provider` を使った初期化が要件に合う場合、最初の例が最適解です！

---
