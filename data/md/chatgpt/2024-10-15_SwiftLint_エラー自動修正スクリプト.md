# SwiftLint エラー自動修正スクリプト

日付: 2024-10-15

---

## 👤 ユーザー
*2024/10/15 12:46:03*

swiftlint lint コマンドでエラー箇所を見つけたらシェルスクリプトでautocorrectをする処理

---

## 🤖 アシスタント
*2024/10/15 12:46:24*

SwiftLint の `lint` コマンドでエラー箇所を見つけ、それに基づいて `autocorrect` を実行するためのシェルスクリプトの例を以下に示します。このスクリプトは、`swiftlint lint` コマンドを実行して、エラーが発生した場合に `swiftlint autocorrect` を実行する仕組みです。

```bash
#!/bin/bash

# SwiftLint の lint コマンドを実行し、結果を一時ファイルに保存
TEMP_FILE=$(mktemp)
swiftlint lint > "$TEMP_FILE"

# エラーがあるかどうかを確認
if grep -q 'error' "$TEMP_FILE"; then
    echo "SwiftLint のエラーが見つかりました。autocorrect を実行します。"
    swiftlint autocorrect
else
    echo "エラーはありません。"
fi

# 一時ファイルを削除
rm "$TEMP_FILE"
```

### 処理の流れ
1. `swiftlint lint` コマンドを実行し、結果を一時ファイルに保存します。
2. 一時ファイルの内容を `grep` コマンドで確認し、エラー (`error`) が含まれているかどうかを判定します。
3. エラーが見つかった場合は `swiftlint autocorrect` を実行して、自動修正を行います。
4. 最後に一時ファイルを削除します。

このスクリプトを保存して、プロジェクトのルートディレクトリで実行すれば、SwiftLint のエラーがある場合に自動的に修正を試みることができます。

---

## 👤 ユーザー
*2024/10/15 12:46:34*

もっと簡単にできないか？

---

## 🤖 アシスタント
*2024/10/15 12:46:46*

もっと簡単にするために、一時ファイルを使わずに、`swiftlint lint` の結果をそのままパイプで処理してエラーがある場合のみ `swiftlint autocorrect` を実行するようにできます。以下のシェルスクリプトはよりシンプルなバージョンです。

```bash
#!/bin/bash

# swiftlint lint でエラーがあれば autocorrect を実行
if swiftlint lint | grep -q 'error'; then
    echo "SwiftLint のエラーが見つかりました。autocorrect を実行します。"
    swiftlint autocorrect
else
    echo "エラーはありません。"
fi
```

### 改善点
- **一時ファイルを使わない**：`swiftlint lint` の結果を直接 `grep` にパイプし、エラーがあるかどうかを確認します。
- **短くシンプル**：必要な処理だけに絞り、より短く簡潔なスクリプトになっています。

これでスクリプトを実行するだけで、エラーがあれば自動修正を行うことができます。

---

## 👤 ユーザー
*2024/10/15 12:49:07*

標準出力の最終行に

Done linting! Found 0 violations, 0

が含まれていたら成功にしてほしい

---

## 🤖 アシスタント
*2024/10/15 12:49:26*

`swiftlint lint` の標準出力の最終行が `Done linting! Found 0 violations, 0` だった場合に成功として扱うためには、`tail` コマンドを使って出力の最終行を確認する方法が考えられます。以下のようなシェルスクリプトで実現できます。

```bash
#!/bin/bash

# swiftlint lint を実行し、最終行を確認
LAST_LINE=$(swiftlint lint | tail -n 1)

# 最終行が "Done linting! Found 0 violations, 0" なら成功、それ以外は autocorrect 実行
if [[ "$LAST_LINE" == "Done linting! Found 0 violations, 0" ]]; then
    echo "エラーはありません。"
else
    echo "SwiftLint のエラーが見つかりました。autocorrect を実行します。"
    swiftlint autocorrect
fi
```

### スクリプトの解説
1. `swiftlint lint` の出力全体をパイプで `tail -n 1` に渡し、最終行を取得します。
2. `if` 文で最終行が `Done linting! Found 0 violations, 0` かどうかを確認します。
3. 最終行が一致すれば成功としてメッセージを表示し、一致しない場合はエラーがあると判断して `swiftlint autocorrect` を実行します。

これで、最終行が指定の文字列であればエラーなしとして処理し、それ以外の場合は自動修正を試みるようになります。

---

## 👤 ユーザー
*2024/10/15 12:49:57*

LAST_LINE を 小文字にしてほしい

---

## 🤖 アシスタント
*2024/10/15 12:50:07*

`LAST_LINE` の内容を小文字にするには、`tr` コマンドを使用して変換できます。以下のようにスクリプトを更新します。

```bash
#!/bin/bash

# swiftlint lint を実行し、最終行を取得して小文字に変換
LAST_LINE=$(swiftlint lint | tail -n 1 | tr '[:upper:]' '[:lower:]')

# 最終行が "done linting! found 0 violations, 0" なら成功、それ以外は autocorrect 実行
if [[ "$LAST_LINE" == "done linting! found 0 violations, 0" ]]; then
    echo "エラーはありません。"
else
    echo "SwiftLint のエラーが見つかりました。autocorrect を実行します。"
    swiftlint autocorrect
fi
```

### 修正点
- `tail -n 1` で取得した最終行を `tr '[:upper:]' '[:lower:]'` で小文字に変換。
- 比較対象も小文字 (`done linting! found 0 violations, 0`) に変更。

これにより、`LAST_LINE` はすべて小文字に変換されます。

---
