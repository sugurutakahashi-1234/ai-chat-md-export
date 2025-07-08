# GitHub integration with Slack

Date: 2023-05-08

---

## 👤 User
*2023-05-08 22:32:25*

https://github.com/integrations/slack#branch-filters-for-commit でデフォルトの通知をOFFにしてreviews, comments だけを通知する方法はありませんか？

---

## 🤖 Assistant
*2023-05-08 22:33:31*

SlackのGitHub integrationでは、リポジトリ内の特定のイベントの通知を設定できます。デフォルトの通知をオフにして、reviewsやcommentsのみを通知する方法は以下の手順で設定できます。

1. Slackで、GitHub integrationを設定したいチャンネルに移動します。
2. チャンネル内で`/github`と入力して、GitHub integrationの設定ウィンドウを開きます。
3. 「Subscribe to a repository」をクリックし、リポジトリを選択または検索します。
4. イベントをフィルタリングするには、`/github`コマンドを使ってサブスクリプションを設定します。デフォルトの通知をオフにして、reviewsとcommentsだけを通知するには、以下のように入力してください:

```
/github subscribe owner/repo reviews comments
```

`owner/repo`は、対象のGitHubリポジトリを指します（例: `integrations/slack`）。

これで、リポジトリに関連するreviewsとcommentsのみが通知されるように設定されます。他のイベントの通知が必要な場合は、上記のコマンドにイベントを追加してください。たとえば、プルリクエストの通知も受け取りたい場合は、以下のように入力します。

```
/github subscribe owner/repo reviews comments pull_requests
```

詳細については、[GitHub+Slack integration のドキュメント](https://docs.github.com/en/github-ae@latest/integrations/github-apps/using-slack#subscribing-to-repositories)を参照してください。

---
