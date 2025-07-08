# GitHub Workflow Slack通知

日付: 2025-01-31

---

## 👤 ユーザー
*2025/01/31 12:03:58*

特定のワークフローをチャンネルに流したい

/github subscribe Gallusys/snpit_guild_app issues, pulls, commits:'*', releases, deployments, reviews, branches,
comments, discussions

---

## 🤖 アシスタント
*2025/01/31 12:04:10*

特定のワークフローの通知を GitHub チャンネルに流したい場合、GitHub の `github-actions` イベントを `subscribe` コマンドに含める必要があります。

### 手順:
1. **GitHub App の権限を確認**  
   `GitHub Slack Integration` がリポジトリに正しくインストールされていることを確認してください。

2. **Slack チャンネルでコマンドを実行**  
   以下のコマンドを Slack の GitHub チャンネルで実行してください:

   ```
   /github subscribe Gallusys/snpit_guild_app issues, pulls, commits:'*', releases, deployments, reviews, branches, comments, discussions, workflows
   ```

   `workflows` を追加することで、GitHub Actions のワークフロー通知が流れるようになります。

3. **特定のワークフローのフィルタリング (オプション)**
   もし特定のワークフローだけを通知したい場合、GitHub Actions の `on: workflow_run` で `types: [completed]` を設定し、そのワークフロー内で `slack-notify` のようなアクションを使う方法もあります。

例えば、`.github/workflows/slack_notify.yml` に以下のように設定することで、特定のワークフローが完了したときに Slack に通知を送ることができます。

```yaml
name: Notify Slack on Workflow Completion

on:
  workflow_run:
    workflows: ["Your Specific Workflow Name"]
    types:
      - completed

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Send Slack Notification
        uses: rtCamp/action-slack-notify@v2
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
          SLACK_CHANNEL: github-updates
          SLACK_USERNAME: "GitHub Actions"
          SLACK_ICON: ":github:"
          SLACK_MESSAGE: "Workflow *${{ github.event.workflow.name }}* has completed! :rocket:"
```

### まとめ:
- `workflows` を `/github subscribe` に追加する
- 必要に応じて `workflow_run` イベントをトリガーして特定のワークフローだけ通知する

この方法で、特定のワークフローの通知を Slack チャンネルに流せます！

---
