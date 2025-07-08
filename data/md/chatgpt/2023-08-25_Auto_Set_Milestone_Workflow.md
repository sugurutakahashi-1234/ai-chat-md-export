# Auto Set Milestone Workflow

日付: 2023-08-25

---

## 👤 ユーザー
*2023/8/25 15:06:26*

PRについて、以下のようなワークフローでマイルストーンを付与している。
issueやPRをcloseした際にマイルストーンがついていない場合は、自動でマイルストーンをつけるようなワークフローを作成してほしい。

name: Auto Set Milestone To PR

on:
  pull_request:
    types: [opened]

jobs:
  set-milestone:
    runs-on: ubuntu-latest
    steps:
      # Ref: github-script https://github.com/actions/github-script
      - uses: actions/github-script@v6
        with:
          # NOTE: `admin:org, project, repo` scope suguruTakahashi-1234's personal access token (classic)
          github-token: ${{ secrets.EMOMIL_IOS_GITHUB_ACTIONS_TOKEN }}
          script: |
            // Ref: PRにマイルストーンを自動設定 https://qiita.com/stnamco/items/06d2147c93a1cca97371
            // Ref: https://octokit.github.io/rest.js/v20
            const milestones = await github.rest.issues.listMilestones({
              owner: context.repo.owner,
              repo: context.repo.repo,
              state: 'open',
              sort: 'due_on',
              direction: 'desc',  // 最新のものから取得
              per_page: 1         // 最新のマイルストーンのみを取得
            });

            const latestMilestone = milestones.data[0];
            if (!latestMilestone) {
              console.log('No open milestones found');
              return;
            }

            await github.rest.issues.update({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.payload.pull_request.number,
              milestone: latestMilestone.number
            });

---

## 🤖 アシスタント
*2023/8/25 15:07:14*

提供していただいたワークフローは、新しくPRが開かれたときにそのPRに最新のマイルストーンを自動的に設定するものです。このワークフローを拡張して、PRまたはissueが閉じられた際にマイルストーンが設定されていなければ自動で最新のマイルストーンを設定するワークフローを作成します。

```yaml
name: Auto Set Milestone To PR or Issue

on:
  pull_request:
    types: [opened, closed]
  issues:
    types: [opened, closed]

jobs:
  set-milestone:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/github-script@v6
        with:
          github-token: ${{ secrets.EMOMIL_IOS_GITHUB_ACTIONS_TOKEN }}
          script: |
            const isPullRequest = !!context.payload.pull_request;
            const number = isPullRequest ? context.payload.pull_request.number : context.payload.issue.number;

            // Get the current milestone of the PR or issue.
            const currentIssueOrPR = await github.rest.issues.get({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: number
            });
            
            // If it already has a milestone, exit.
            if (currentIssueOrPR.data.milestone) {
              console.log('Milestone is already set.');
              return;
            }

            const milestones = await github.rest.issues.listMilestones({
              owner: context.repo.owner,
              repo: context.repo.repo,
              state: 'open',
              sort: 'due_on',
              direction: 'desc',
              per_page: 1
            });

            const latestMilestone = milestones.data[0];
            if (!latestMilestone) {
              console.log('No open milestones found');
              return;
            }

            await github.rest.issues.update({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: number,
              milestone: latestMilestone.number
            });
```

上記のワークフローは以下のことを実現します：

1. PRまたはissueが開かれたり閉じられたりした際に実行されます。
2. そのPRまたはissueが既にマイルストーンを持っている場合は、何もしません。
3. マイルストーンが設定されていない場合、最新のマイルストーンをそのPRまたはissueに自動的に設定します。

このワークフローをGitHub Actionsに追加すると、PRやissueが閉じられたときにそれにマイルストーンが設定されていなければ、自動的に最新のマイルストーンが設定されるようになります。

---

## 👤 ユーザー
*2023/8/25 15:10:56*

!!context.payload.pull_request; ってどういう意味？

---

## 🤖 アシスタント
*2023/8/25 15:11:23*

`!!context.payload.pull_request` はJavaScriptの式で、`context.payload.pull_request` の真偽値を確認しています。

具体的には:

- `context.payload.pull_request` は、イベントのペイロード（この場合は `pull_request` イベントのペイロード）の `pull_request` プロパティを参照します。PRのイベントがトリガーされた場合、このプロパティは存在しますが、issueのイベントがトリガーされた場合、このプロパティは存在しないため `undefined` となります。
  
- `!` 演算子は、その後の値の真偽値を反転させます。たとえば、値が `true` なら `false` に、`false` なら `true` にします。

- `!!` は、`!` 演算子を2回適用することで、元の値の真偽値を取得することができます。

したがって、`!!context.payload.pull_request` の値は以下のようになります:

- `context.payload.pull_request` が存在すれば（つまりPRのイベントの場合）：`true`
- `context.payload.pull_request` が存在しなければ（つまりissueのイベントの場合）：`false`

この式を使用することで、処理がPRに関連しているのか、それともissueに関連しているのかを簡単に確認できます。

---

## 👤 ユーザー
*2023/8/25 15:36:09*

以下についてもすでにlabelがついていたら早期リターンするように修正して欲しい

```yml
name: Auto Set Label To PR

on:
  pull_request:
    types: [opened, closed]
  issues:
    types: [closed]

jobs:
  apply-label:
    runs-on: ubuntu-latest
    steps:
      # Ref: github-script https://github.com/actions/github-script
      - uses: actions/github-script@v6
        with:
          # NOTE: `admin:org, project, repo` scope suguruTakahashi-1234's personal access token (classic)
          github-token: ${{ secrets.EMOMIL_IOS_GITHUB_ACTIONS_TOKEN }}
          script: |
            const prTitle = context.payload.pull_request.title.toLowerCase();  // 大文字・小文字の区別をしない

            // キーワードとラベルのマッピングを配列で保持
            const keywordMapping = [
              { keywords: ['バグ', '不具合', 'hotfix'], label: 'bug' },
              { keywords: ['ドキュメント', 'readme', 'github', 'xcode cloud'], label: 'documentation' }
            ];

            let labelToApply = 'enhancement';  // デフォルトのラベル

            // キーワードを検査して該当するラベルを見つける
            for (const mapping of keywordMapping) {
              if (mapping.keywords.some(keyword => prTitle.includes(keyword.toLowerCase()))) {  // 大文字・小文字の区別をしない
                labelToApply = mapping.label;
                break;
              }
            }

            // ラベルを付与
            github.rest.issues.addLabels({
              issue_number: context.payload.pull_request.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              labels: [labelToApply]
            });

```

---

## 🤖 アシスタント
*2023/8/25 15:37:00*

PRやissueに既にラベルが付いていた場合、早期リターンするようにワークフローを修正します。

以下は修正したワークフローです：

```yml
name: Auto Set Label To PR

on:
  pull_request:
    types: [opened, closed]
  issues:
    types: [closed]

jobs:
  apply-label:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/github-script@v6
        with:
          github-token: ${{ secrets.EMOMIL_IOS_GITHUB_ACTIONS_TOKEN }}
          script: |
            const isPullRequest = !!context.payload.pull_request;
            const number = isPullRequest ? context.payload.pull_request.number : context.payload.issue.number;

            // 既存のラベルを取得
            const currentIssueOrPR = await github.rest.issues.get({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: number
            });

            if (currentIssueOrPR.data.labels && currentIssueOrPR.data.labels.length > 0) {
              console.log('Labels are already set.');
              return;
            }

            const title = isPullRequest ? context.payload.pull_request.title.toLowerCase() : context.payload.issue.title.toLowerCase();

            const keywordMapping = [
              { keywords: ['バグ', '不具合', 'hotfix'], label: 'bug' },
              { keywords: ['ドキュメント', 'readme', 'github', 'xcode cloud'], label: 'documentation' }
            ];

            let labelToApply = 'enhancement';  // デフォルトのラベル

            for (const mapping of keywordMapping) {
              if (mapping.keywords.some(keyword => title.includes(keyword.toLowerCase()))) {
                labelToApply = mapping.label;
                break;
              }
            }

            github.rest.issues.addLabels({
              issue_number: number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              labels: [labelToApply]
            });
```

この修正により、以下の機能が追加されました：

1. まず、PRかissueかを確認するための `isPullRequest` 変数を定義し、それに基づいて適切な番号（`number`）を取得します。
2. その後、現在のラベルを取得します。
3. もし既にラベルが付いていたら、その時点でスクリプトの実行を停止します（早期リターン）。
4. 既存のラベルがない場合のみ、タイトルを確認して適切なラベルを付与します。

---
