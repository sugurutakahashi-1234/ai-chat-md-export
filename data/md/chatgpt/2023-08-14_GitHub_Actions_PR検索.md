# GitHub Actions PR検索

日付: 2023-08-14

---

## 👤 ユーザー
*2023/08/15 01:51:10*

ラベルのついていないPRを探す方法

---

## 🤖 アシスタント
*2023/08/15 01:51:37*

GitHubでラベルのついていないPRを探すには、検索機能を使用して特定の条件を満たすPRをフィルタリングすることができます。以下の手順でラベルのついていないPRを検索する方法を示します。

1. GitHubのリポジトリページにアクセスします。
2. 右上にある「Search」ボックスに次のクエリを入力します。
```
is:pr is:open no:label
```
これは、ラベルがないオープン状態のPRを検索します。

3. Enterキーを押して検索を実行します。

これにより、該当するPRがリストとして表示されます。ラベルのついていないクローズド状態のPRを検索したい場合は、`is:open`の部分を`is:closed`に変更して検索を行います。

---

## 👤 ユーザー
*2023/08/15 01:52:10*

closed状態のPRでマージされたやつ限定で絞ってほしい

---

## 🤖 アシスタント
*2023/08/15 01:52:30*

了解しました。closed状態のPRでマージされたものだけを検索するには、以下のクエリを使用します。

```
is:pr is:closed is:merged no:label
```

このクエリは以下の条件に一致するPRを検索します：

- PRである (`is:pr`)
- closed状態である (`is:closed`)
- マージ済みである (`is:merged`)
- ラベルが付いていない (`no:label`)

このクエリをGitHubの検索ボックスに入力して検索を実行することで、指定した条件に一致するPRを確認することができます。

---

## 👤 ユーザー
*2023/08/15 01:53:12*

検索分に最新のタグからマージされた分みたいなフィルタリングをつけることってできる？

---

## 🤖 アシスタント
*2023/08/15 01:53:46*

GitHubの検索クエリでは、直接「最新のタグからマージされたPR」という具体的なフィルタリングを指定することはできません。しかし、手動で最新のタグを取得してそのタグを基に検索することは可能です。

以下の手順で操作することができます：

1. まず、リポジトリ内で最新のタグを調べます。これは、リポジトリの「Releases」や「Tags」セクションで確認できます。
2. 最新のタグを見つけたら、そのタグ名（例: `v1.2.3`）をメモしておきます。
3. 検索ボックスに以下のようなクエリを入力して検索を実行します。
```
is:pr is:closed is:merged no:label merged:>=YYYY-MM-DD
```
ここで、`YYYY-MM-DD`は最新のタグがリリースされた日付に置き換えます。

この方法は完全に自動化されたものではありませんが、最新のタグからマージされたPRを検索するための近似的な方法として利用することができます。

---

## 👤 ユーザー
*2023/08/15 01:54:19*

これをGithubActionとかでやりたいんだけどできる？

---

## 🤖 アシスタント
*2023/08/15 01:55:24*

はい、GitHub Actionsを使用して、最新のタグからマージされたPRを自動的にリストアップすることは可能です。

以下は、そのための大まかな手順とスクリプトの例です：

1. **GitHub Actionsのワークフローをセットアップします。**
    - `.github/workflows/list_merged_prs.yml` などの名前で新しいワークフローファイルを作成します。

2. **ワークフローのトリガーを指定します。**
   例えば、定期的に実行したい場合、`schedule` トリガーを使用します。

```yaml
on:
  schedule:
    - cron: '0 0 * * *'  # 毎日0時に実行
```

3. **ステップを定義して、スクリプトを実行します。**
   ここでは、`actions/github-script` を使用して、GitHub APIを使って最新のタグの日付を取得し、その後、マージされたPRをリストアップするスクリプトを実行します。

```yaml
jobs:
  list-merged-prs:
    runs-on: ubuntu-latest
    steps:
      - name: List merged PRs since the latest tag
        uses: actions/github-script@v3
        with:
          script: |
            const { data: tags } = await github.repos.listTags({
              owner: context.repo.owner,
              repo: context.repo.repo,
              per_page: 1
            });
            const latestTagDate = tags[0].commit.committer.date;
            const { data: pullRequests } = await github.pulls.list({
              owner: context.repo.owner,
              repo: context.repo.repo,
              state: 'closed',
              sort: 'updated',
              direction: 'desc',
              per_page: 100
            });
            const mergedPRsSinceLatestTag = pullRequests.filter(pr => pr.merged_at && new Date(pr.merged_at) >= new Date(latestTagDate));
            for (const pr of mergedPRsSinceLatestTag) {
              console.log(`#${pr.number}: ${pr.title}`);
            }
```

上記のスクリプトは、最新のタグの日付以降にマージされたPRをコンソールにリストアップします。必要に応じて、出力方法や保存方法などをカスタマイズしてください。

このワークフローをリポジトリに追加すると、指定したトリガーに基づいて、最新のタグからマージされたPRを自動的に取得することができます。

---
