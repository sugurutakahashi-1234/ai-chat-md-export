# Merge branch deletion command

日付: 2024-07-01

---

## 👤 ユーザー
*2024/7/1 14:25:27*

"Merge branch" で始める行を削除したい

$ git log 0.1.0-rc.1..HEAD --oneline --merges --pretty=format:"\[%cs\] %s %b" | sed -E 's|Merge pull request #\[0-9\]+ from \[^/\]+/||' | awk '{print $0 "\\n"}'
\[2024-06-28\] feature/92 

\[2024-06-28\] feature/109 【タイムライン】バックグラウンド再生時のみ次のタイムラインに移行する対応

\[2024-06-28\] feature/104 【タイムライン】バックグラウンド再生に対応する

\[2024-06-27\] Merge branch 'main' of https://github.com/crage-inc/Project-SoftBankSNS-iOS into feature/104 

\[2024-06-27\] feature/102 【タイムライン】タイムラインの上スワイプと下スワイプに対応した

\[2024-06-26\] feature/91 

\[2024-06-21\] feature/90 

\[2024-06-19\] feature/78 【QRコード】QRコードの生成について調査する

\[2024-06-14\] feature/71 【Xcode】Xcode 16 に移行する

\[2024-06-14\] feature/59-fix

---

## 🤖 アシスタント
*2024/7/1 14:25:33*

`Merge branch` で始まる行を削除するには、以下のコマンドを使うことができます。このコマンドは `sed` を使って特定のパターンにマッチする行を削除します。

```bash
git log 0.1.0-rc.1..HEAD --oneline --merges --pretty=format:"[%cs] %s %b" | sed -E '/^Merge branch/d' | sed -E 's|Merge pull request #[0-9]+ from [^/]+/||' | awk '{print $0 "\n"}'
```

このコマンドを実行すると、`Merge branch` で始まる行が削除され、他の行のみが表示されるようになります。

---

## 👤 ユーザー
*2024/7/1 14:26:43*

\[%cs\] %s %b の %sの最初がという意味

---

## 🤖 アシスタント
*2024/7/1 14:26:49*

`%s` の最初が `Merge branch` という意味で解釈しました。その場合、以下のように `sed` コマンドを使用して `%s` の最初が `Merge branch` で始まる行を削除します。

```bash
git log 0.1.0-rc.1..HEAD --oneline --merges --pretty=format:"[%cs] %s %b" | sed -E '/^\[.*\] Merge branch/d' | sed -E 's|Merge pull request #[0-9]+ from [^/]+/||' | awk '{print $0 "\n"}'
```

このコマンドを実行すると、`%s` の最初が `Merge branch` で始まる行が削除され、他の行のみが表示されるようになります。

---
