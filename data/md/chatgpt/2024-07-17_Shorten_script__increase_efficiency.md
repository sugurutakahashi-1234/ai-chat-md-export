# Shorten script, increase efficiency

日付: 2024-07-17

---

## 👤 ユーザー
*2024/07/17 14:49:19*

以下のテストを実行するスクリプトの処理を短くしたい

#!/bin/sh

# スキーマのリストを取得し、「Test」を含むスキーマだけを抽出
schemas=$(xcodebuild -list | awk '/Schemes:/,/^[^ ]/ {if ($1 != "Schemes:" && $1 ~ /Test/) print $1}')

# ViewSnapshotTest を除外
schemas=$(echo "$schemas" | grep -v "ViewSnapshotTest")

# 対象スキーマの一覧を表示
echo "Schemas to be tested:"
for schema in $schemas; do
    echo "- $schema"
done

# スキーマごとにテストを並列実行
for schema in $schemas; do
    echo "Running tests for schema: $schema"
    {
        if xcodebuild test -scheme "$schema" -destination 'platform=iOS Simulator,name=iPhone 15' -quiet; then
            echo "✅ Tests passed for schema: $schema"
        else
            echo "⛔️ Tests failed for schema: $schema"
            exit 1
        fi
    } &
done

# すべてのバックグラウンドジョブの完了を待機
wait

echo "✅ All Unit Tests Executed."

---

## 🤖 アシスタント
*2024/07/17 14:49:22*

以下のようにスクリプトを短縮することができます。`awk`コマンドと`xargs`を使って並列実行を簡潔に行うことで、スクリプト全体を短くできます。

```sh
#!/bin/sh

# スキーマのリストを

---
