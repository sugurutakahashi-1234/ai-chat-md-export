# Github Actions PRトリガー

日付: 2024-05-16

---

## 👤 ユーザー
*2024/05/16 13:16:37*

Github actions でPRのタイトルやボディが変化したことで走るワークフローのトリガーがあれば知りたい＼

---

## 🤖 アシスタント
*2024/05/16 13:16:46*

GitHub Actions では、プルリクエスト（PR）のタイトルやボディが変更された際にワークフローをトリガーするための直接的なイベントは用意されていませんが、`pull_request` イベントとその特定のアクションを利用することで、これを実現することができます。

PR のタイトルやボディが変更されたときにトリガーされるアクションは `edited` です。以下に、その具体的な例を示します。

```yaml
name: PR Title or Body Change

on:
  pull_request:
    types: [edited]

jobs:
  check-pr:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v2
      
    - name: Do something on PR title or body change
      run: echo "PR title or body has changed!"
```

このワークフローでは、`pull_request` イベントの `edited` タイプを監視しています。この設定により、PR のタイトルやボディが編集されたときにワークフローがトリガーされます。

### 注意点
- このワークフローは、PR の他の部分が編集された場合（例：ラベルの変更やレビューリクエストの追加など）でもトリガーされることがあります。
- より精細な制御が必要な場合、GitHub の API を使用して変更の詳細を確認し、必要なアクションを実行するカスタムスクリプトを作成することができます。

この設定で、PR のタイトルやボディが変更されたときにワークフローが確実に実行されるようになります。

---
