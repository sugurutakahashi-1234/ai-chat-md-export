# oss_licenses対象変更

日付: 2025-02-22

---

## 👤 ユーザー
*2025/02/22 23:09:54*

以下の処理から oss_licenses.dartの考慮がなくなりました

find lib -type f -name "*.dart" ! -path "lib/gen/*" ! -name "oss_licenses.dart" | xargs dart format

---

## 🤖 アシスタント
*2025/02/22 23:10:02*

この処理では、`oss_licenses.dart` を `dart format` の対象外にしています。

もし `oss_licenses.dart` もフォーマットの対象に含めたい場合は、`! -name "oss_licenses.dart"` を削除すればOKです。

修正後:
```sh
find lib -type f -name "*.dart" ! -path "lib/gen/*" | xargs dart format
```

**変更点**
- `! -name "oss_licenses.dart"` を削除し、`oss_licenses.dart` も `dart format` の対象に含める。

この変更で、`lib/gen/` 配下を除くすべての `.dart` ファイルがフォーマット対象になります。

---
