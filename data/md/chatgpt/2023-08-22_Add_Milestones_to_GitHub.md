# Add Milestones to GitHub

日付: 2023-08-22

---

## 👤 ユーザー
*2023/8/22 10:55:59*

GitHubのマイルストーンを設定したい。
もうすでにある程度issueやPRを行っているのだけれども後からマイルストーンをつけたい。
どういうアプローチがいいのか？

---

## 🤖 アシスタント
*2023/8/22 10:56:49*

GitHubのマイルストーンは、特定の目標に向けたイシューやプルリクエストをグループ化するのに役立ちます。既存のイシューやPRに後からマイルストーンを追加する場合、以下の手順を参考にしてください：

1. \*\*マイルストーンの作成\*\*
    - リポジトリのメインページに移動し、「Issues」タブをクリックします。
    - 「Milestones」タブを選択します。
    - 「New milestone」ボタンをクリックして、新しいマイルストーンを作成します。
    - 必要な情報（タイトル、説明、期限など）を入力し、マイルストーンを作成します。

2. \*\*イシューやPRにマイルストーンを追加\*\*
    - 「Issues」または「Pull requests」タブに移動し、マイルストーンを追加したい項目の横のチェックボックスを選択します。
    - 画面上部のツールバーにある「Label」または「Milestone」ドロップダウンをクリックします。
    - 既存のマイルストーンから適切なものを選択します。

3. \*\*複数のイシューやPRに一度にマイルストーンを追加\*\*
    - 複数のイシューやPRの横のチェックボックスを選択して、上述の手順2を使用してマイルストーンを一括追加します。

4. \*\*既存のマイルストーンの変更や削除\*\*
    - イシューやPRの詳細ページに移動します。
    - 右側のサイドバーにある「Milestone」セクションをクリックし、変更や削除を行います。

5. \*\*進捗の確認\*\*
    - 「Milestones」タブに戻り、進捗バーを確認することで、そのマイルストーンの完了状況を視覚的に確認できます。

この手順を順番に進めることで、GitHubのマイルストーンを効果的に設定し、管理することができます。

---

## 👤 ユーザー
*2023/8/22 10:57:10*

どうやってマイルストーンを運用していくのがいいのか？なるべく自動化していきたいと思っている。

---

## 🤖 アシスタント
*2023/8/22 10:58:15*

マイルストーンの運用を効率的に行い、なるべく自動化するためのヒントと手法を以下に示します。

1. \*\*GitHub Actionsの活用\*\*
    - GitHub Actionsを使用することで、イシューやPRの作成時、マージ時などのトリガーに基づいて、マイルストーンの自動設定や進捗確認などのアクションを自動化することができます。

2. \*\*外部ツールの活用\*\*
    - ZapierやIFTTTなどの外部サービスを利用して、GitHubと他のツールやサービスとの連携を自動化します。例えば、マイルストーンの完了時にSlackに通知を送るなどの動作を設定することができます。

3. \*\*一貫性のある命名規則の採用\*\*
    - マイルストーンの命名規則を一貫性のあるものにすることで、関連するイシューやPRの管理が簡単になります。例えば、`Version 1.0`, `Version 1.1`のようにリリースベースの命名を行うと、どのイシューやPRがどのリリースに関連しているのかを容易に判断できます。

4. \*\*定期的なレビュー\*\*
    - 定期的にマイルストーンの進捗をレビューし、未完了のタスクや優先順位の変更点を確認することで、プロジェクトの進行状況を正確に把握することができます。

5. \*\*テンプレートの利用\*\*
    - イシューやPRのテンプレートを作成して、必要な情報が常に含まれるようにすることで、マイルストーンへの追加や運用を容易にします。

6. \*\*ボットの活用\*\*
    - GitHub Marketplaceには、マイルストーンやイシュー、PRの管理を補助するためのボットが多数存在します。これらのボットを活用することで、一部のタスクを自動化することができます。

7. \*\*ドキュメンテーション\*\*
    - マイルストーンの設定や運用方法をドキュメント化することで、チームメンバー全員が同じ理解を持って作業を進めることができます。

これらのヒントや手法を活用することで、マイルストーンの運用を効率的かつ自動化して行うことができます。自動化の範囲や方法は、プロジェクトの規模や目的に応じて適切に選択してください。

---

## 👤 ユーザー
*2023/8/22 10:58:36*

GitHub Actionsを活用して、マイルストーンの運用を自動化したい。どのようなワークフローが思いつくか？

---

## 🤖 アシスタント
*2023/8/22 10:59:42*

GitHub Actionsを使ってマイルストーンの運用を自動化するには、さまざまなワークフローが考えられます。以下にいくつかのワークフローのアイディアを示します。

1. \*\*新しいリリースが作成されたときに新しいマイルストーンを作成\*\*
    - リリースが作成されると、自動的に次のバージョンのマイルストーンを作成します。

2. \*\*マイルストーンの期日が過ぎたら通知\*\*
    - マイルストーンの期日が過ぎたら、Slackやメールでチームに通知を送る。

3. \*\*PRがマージされたときにマイルストーンを自動クローズ\*\*
    - すべてのイシューとPRが完了したマイルストーンは自動的にクローズします。

4. \*\*イシューやPRが作成されたときにデフォルトのマイルストーンを設定\*\*
    - 新しいイシューやPRが作成されたとき、自動的にデフォルトのマイルストーンを設定します。

5. \*\*マイルストーンがクローズされたときにデプロイメントをトリガー\*\*
    - マイルストーンがクローズされたら、自動的にデプロイメントのワークフローを実行します。

6. \*\*特定のラベルがついたイシュー/PRに対して特定のマイルストーンを設定\*\*
    - 例えば、`urgent` ラベルがついたイシューには、最も近いマイルストーンを自動的に設定します。

GitHub Actionsのワークフローを設定するには、`.github/workflows`ディレクトリにワークフローファイルを作成します。このファイルはYAML形式で、どのイベントでどのアクションを実行するかを定義します。

以上のワークフローのアイディアを実装するためには、GitHub APIを活用する必要があります。GitHub Actionsの中で、\[actions/github-script\](https://github.com/actions/github-script) アクションを使うと、JavaScriptを使用してGitHub APIを簡単に呼び出すことができます。これにより、上述のようなカスタマイズされた動作を自動化することが容易になります。

これらのワークフローはプロジェクトの要件やチームの運用方法に応じてカスタマイズすることができます。

---

## 👤 ユーザー
*2023/8/22 11:00:15*

PRが作成されたときにデフォルトのマイルストーンを設定するようにしたい。

---

## 🤖 アシスタント
*2023/8/22 11:01:10*

PRが作成されたときにデフォルトのマイルストーンを設定するためのGitHub Actionsワークフローを作成します。以下のステップに従って設定してください。

1. **GitHub Actionsのワークフローを設定する**

リポジトリ内の`.github/workflows` ディレクトリに新しいYAMLファイルを作成します。例えば `default_milestone.yml` という名前を使用することができます。

2. **ワークフローの内容を記述**

以下は、PRが作成されたときにデフォルトのマイルストーンを設定するワークフローの例です：

```yaml
name: Set Default Milestone

on:
  pull_request:
    types:
      - opened

jobs:
  set-milestone:
    runs-on: ubuntu-latest
    steps:
    - name: Set default milestone to PR
      uses: actions/github-script@v3
      with:
        github-token: ${{ secrets.GITHUB_TOKEN }}
        script: |
          const github = require('@actions/github');
          const payload = github.context.payload;

          // ここでマイルストーンのIDを設定します。
          // 例: const defaultMilestoneID = 1;
          const defaultMilestoneID = YOUR_DEFAULT_MILESTONE_ID;

          await github.issues.update({
            owner: payload.repository.owner.login,
            repo: payload.repository.name,
            issue_number: payload.number,
            milestone: defaultMilestoneID
          });
```

3. **マイルストーンIDを取得**

上記のスクリプトでは、`YOUR_DEFAULT_MILESTONE_ID` をデフォルトのマイルストーンIDに置き換える必要があります。マイルストーンのIDは、GitHub APIを使用して取得できます。

4. **ワークフローの実行**

上記のワークフローをリポジトリにコミット・プッシュすると、新しいPRが作成されるたびに指定したデフォルトのマイルストーンが自動的に設定されます。

このワークフローを使用すると、PRの作成時に自動的にデフォルトのマイルストーンを設定することができます。マイルストーンのIDやその他の設定を変更する場合は、ワークフローファイルを適宜編集してください。

---

## 👤 ユーザー
*2023/8/22 11:01:33*

最新のマイルストーンを使うように変更してほしい。

---

## 🤖 アシスタント
*2023/8/22 11:02:20*

了解しました。PRが作成されたときに最新のマイルストーンを自動的に設定するためのGitHub Actionsワークフローを以下に示します。

このワークフローでは、GitHub APIを使用してリポジトリの最新のマイルストーンを取得し、そのマイルストーンIDを新しく作成されたPRに設定します。

1. `.github/workflows/default_milestone.yml` に以下の内容を書き込んでください。

```yaml
name: Set Latest Milestone

on:
  pull_request:
    types:
      - opened

jobs:
  set-milestone:
    runs-on: ubuntu-latest
    steps:
    - name: Set latest milestone to PR
      uses: actions/github-script@v3
      with:
        github-token: ${{ secrets.GITHUB_TOKEN }}
        script: |
          const github = require('@actions/github');
          const payload = github.context.payload;

          // マイルストーンのリストを取得して、最新のマイルストーンを抽出
          const milestones = await github.issues.listMilestonesForRepo({
            owner: payload.repository.owner.login,
            repo: payload.repository.name,
            state: 'open',
            sort: 'created',
            direction: 'desc',  // 最新のものから取得
            per_page: 1         // 最新のマイルストーンのみを取得
          });

          const latestMilestone = milestones.data[0];
          if (!latestMilestone) {
            console.log('No open milestones found');
            return;
          }

          await github.issues.update({
            owner: payload.repository.owner.login,
            repo: payload.repository.name,
            issue_number: payload.number,
            milestone: latestMilestone.number
          });
```

このワークフローは、PRが作成されるたびにリポジトリ内の最新のマイルストーンを取得し、そのマイルストーンをPRに設定します。マイルストーンが存在しない場合、何も行われません。

このワークフローをリポジトリにコミット・プッシュすると、新しいPRが作成されるたびに最新のマイルストーンが自動的に設定されます。

---

## 👤 ユーザー
*2023/8/22 11:05:04*

いまは actions/github-script@v6 らしい。

---

## 🤖 アシスタント
*2023/8/22 11:05:46*

了解しました。`actions/github-script` の最新バージョンを考慮して、ワークフローを更新します。

以下のワークフローは、`actions/github-script@v6` を使用して、新しいPRが作成されるたびに最新のマイルストーンを設定します。

1. `.github/workflows/default_milestone.yml` に以下の内容を書き込んでください。

```yaml
name: Set Latest Milestone

on:
  pull_request:
    types:
      - opened

jobs:
  set-milestone:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout code
      uses: actions/checkout@v2

    - name: Set latest milestone to PR
      uses: actions/github-script@v6
      with:
        github-token: ${{ secrets.GITHUB_TOKEN }}
        script: |
          const { repo, payload } = context;
          
          // マイルストーンのリストを取得して、最新のマイルストーンを抽出
          const milestones = await github.issues.listMilestonesForRepo({
            owner: repo.owner,
            repo: repo.repo,
            state: 'open',
            sort: 'created',
            direction: 'desc',  // 最新のものから取得
            per_page: 1         // 最新のマイルストーンのみを取得
          });

          const latestMilestone = milestones.data[0];
          if (!latestMilestone) {
            console.log('No open milestones found');
            return;
          }

          await github.issues.update({
            owner: repo.owner,
            repo: repo.repo,
            issue_number: payload.number,
            milestone: latestMilestone.number
          });
```

このワークフローをリポジトリにコミット・プッシュすると、新しいPRが作成されるたびに最新のマイルストーンが自動的に設定されます。

注意: こちらのワークフローでは、`actions/github-script@v6` を使用していますので、GitHub Actionsの互換性の変更点や更新情報を確認して、適宜修正することが推奨されます。

---

## 👤 ユーザー
*2023/8/22 11:16:51*

const { repo, payload } = context; はつかわないでほしい。

---

## 🤖 アシスタント
*2023/8/22 11:17:32*

了解しました。直接`github.context`を利用して、ワークフローを更新します。

以下が、`actions/github-script@v6`を使用して、新しいPRが作成されるたびに最新のマイルストーンを設定するワークフローです。

1. `.github/workflows/default_milestone.yml` に以下の内容を書き込んでください。

```yaml
name: Set Latest Milestone

on:
  pull_request:
    types:
      - opened

jobs:
  set-milestone:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout code
      uses: actions/checkout@v2

    - name: Set latest milestone to PR
      uses: actions/github-script@v6
      with:
        github-token: ${{ secrets.GITHUB_TOKEN }}
        script: |
          // マイルストーンのリストを取得して、最新のマイルストーンを抽出
          const milestones = await github.issues.listMilestonesForRepo({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            state: 'open',
            sort: 'created',
            direction: 'desc',  // 最新のものから取得
            per_page: 1         // 最新のマイルストーンのみを取得
          });

          const latestMilestone = milestones.data[0];
          if (!latestMilestone) {
            console.log('No open milestones found');
            return;
          }

          await github.issues.update({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            issue_number: github.context.payload.number,
            milestone: latestMilestone.number
          });
```

このワークフローをリポジトリにコミット・プッシュすると、新しいPRが作成されるたびに最新のマイルストーンが自動的に設定されます。

注意: こちらのワークフローでは、`actions/github-script@v6` を使用していますので、GitHub Actionsの互換性の変更点や更新情報を確認して、適宜修正することが推奨されます。

---

## 👤 ユーザー
*2023/8/22 11:19:15*

context.repo.owner とかでアクセスできるみたい。

---

## 🤖 アシスタント
*2023/8/22 11:20:03*

申し訳ございません。指摘の通り、`github.context.repo.owner` という形式で直接アクセスすることができます。

以下が修正されたワークフローです。

1. `.github/workflows/default_milestone.yml` に以下の内容を書き込んでください。

```yaml
name: Set Latest Milestone

on:
  pull_request:
    types:
      - opened

jobs:
  set-milestone:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout code
      uses: actions/checkout@v2

    - name: Set latest milestone to PR
      uses: actions/github-script@v6
      with:
        github-token: ${{ secrets.GITHUB_TOKEN }}
        script: |
          // マイルストーンのリストを取得して、最新のマイルストーンを抽出
          const milestones = await github.issues.listMilestonesForRepo({
            owner: context.repo.owner,
            repo: context.repo.repo,
            state: 'open',
            sort: 'created',
            direction: 'desc',  // 最新のものから取得
            per_page: 1         // 最新のマイルストーンのみを取得
          });

          const latestMilestone = milestones.data[0];
          if (!latestMilestone) {
            console.log('No open milestones found');
            return;
          }

          await github.issues.update({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: context.payload.number,
            milestone: latestMilestone.number
          });
```

このワークフローをリポジトリにコミット・プッシュすると、新しいPRが作成されるたびに最新のマイルストーンが自動的に設定されます。

再度、注意: こちらのワークフローでは、`actions/github-script@v6` を使用していますので、GitHub Actionsの互換性の変更点や更新情報を確認して、適宜修正することが推奨されます。

---

## 👤 ユーザー
*2023/8/22 20:54:53*

listMilestones だったりしない？

---

## 🤖 アシスタント
*2023/8/22 20:55:40*

申し訳ございません、その通りです。

GitHub APIのメソッド名の正確な呼び出しは `listMilestones` です。

以下が修正後のワークフローです。

```yaml
name: Set Latest Milestone

on:
  pull_request:
    types:
      - opened

jobs:
  set-milestone:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout code
      uses: actions/checkout@v2

    - name: Set latest milestone to PR
      uses: actions/github-script@v6
      with:
        github-token: ${{ secrets.GITHUB_TOKEN }}
        script: |
          // マイルストーンのリストを取得して、最新のマイルストーンを抽出
          const milestones = await github.issues.listMilestones({
            owner: context.repo.owner,
            repo: context.repo.repo,
            state: 'open',
            sort: 'created',
            direction: 'desc',  // 最新のものから取得
            per_page: 1         // 最新のマイルストーンのみを取得
          });

          const latestMilestone = milestones.data[0];
          if (!latestMilestone) {
            console.log('No open milestones found');
            return;
          }

          await github.issues.update({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: context.payload.number,
            milestone: latestMilestone.number
          });
```

おっしゃる通り、`listMilestonesForRepo` は正しくは `listMilestones` です。お知らせいただき、ありがとうございます。

---

## 👤 ユーザー
*2023/8/22 20:57:51*

sort: "due\_on",のほうが良くない？あとcontext.payload.pull\_request.numberだったりしない？

---

## 🤖 アシスタント
*2023/8/22 20:58:38*

はい、ご指摘の通りです。

1. マイルストーンを締切日（`due_on`）でソートする方が、多くのシナリオにおいて直感的で適切です。
2. PRの番号にアクセスするには `context.payload.pull_request.number` を使用するのが正確です。

修正後のワークフローは以下のようになります。

```yaml
name: Set Latest Milestone

on:
  pull_request:
    types:
      - opened

jobs:
  set-milestone:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout code
      uses: actions/checkout@v2

    - name: Set latest milestone to PR
      uses: actions/github-script@v6
      with:
        github-token: ${{ secrets.GITHUB_TOKEN }}
        script: |
          // マイルストーンのリストを取得して、最新のマイルストーンを抽出
          const milestones = await github.issues.listMilestones({
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

          await github.issues.update({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: context.payload.pull_request.number,
            milestone: latestMilestone.number
          });
```

ご指摘ありがとうございます。これで、PRが作成されたときに最も直近の締切日を持つマイルストーンが選ばれるようになります。

---

## 👤 ユーザー
*2023/8/22 21:05:46*

以下を参考にPRをopendしたときにenhancementのラベルを付与するワークフローも作って欲しい

on:
  issues:
    types: \[opened\]

jobs:
  apply-label:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/github-script@v6
        with:
          github-token: ${{ secrets.MY\_PAT }}
          script: |
            github.rest.issues.addLabels({
              issue\_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              labels: \['Triage'\]
            })

---

## 🤖 アシスタント
*2023/8/22 21:06:31*

承知しました。ご提示いただいた情報をもとに、新しいPRが作成されたときに `enhancement` ラベルを自動的に付与するGitHub Actionsのワークフローを作成します。

```yaml
name: Auto-label PR with enhancement

on:
  pull_request:
    types: [opened]

jobs:
  apply-label:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/github-script@v6
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}  # ここはGITHUB_TOKENを使用すると良いです
          script: |
            github.rest.issues.addLabels({
              issue_number: context.payload.pull_request.number,  # PRの番号
              owner: context.repo.owner,
              repo: context.repo.repo,
              labels: ['enhancement']
            })
```

上記のワークフローは、新しいPRが作成されるたびに `enhancement` ラベルを自動的に付与します。

**注意点**:

- ワークフローでは `${{ secrets.GITHUB_TOKEN }}` を使用しています。このトークンは、GitHub Actionsが自動的に提供するもので、特定のリポジトリに対するアクセス権を持っています。特別な権限が必要な場合や他のリポジトリにアクセスしたい場合には、個別に生成したトークン（`MY_PAT`のようなもの）を使用する必要があります。
- `issue_number` には `context.payload.pull_request.number` を使用して、PRの番号を指定しています。

---

## 👤 ユーザー
*2023/8/22 21:14:24*

PRのタイトルに"バグ"または"不具合"または"Hotfix"の文字列があればbugのラベルをつけるようにしてほしい。またPRのタイトルに"ドキュメント""README"の文字列があればドキュメントのラベルをつけるようにしてほしい。それ以外はenhancementをつけてほしい

---

## 🤖 アシスタント
*2023/8/22 21:15:00*

了解しました。以下のワークフローは、指定されたキーワードをPRのタイトルから検索し、それに基づいてラベルを自動的に付与します。

```yaml
name: Auto-label PR

on:
  pull_request:
    types: [opened]

jobs:
  apply-label:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/github-script@v6
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          script: |
            const prTitle = context.payload.pull_request.title;

            let label = 'enhancement';  // デフォルトのラベル

            // タイトルに特定のキーワードがあるかチェック
            if (prTitle.includes('バグ') || prTitle.includes('不具合') || prTitle.includes('Hotfix')) {
              label = 'bug';
            } else if (prTitle.includes('ドキュメント') || prTitle.includes('README')) {
              label = 'documentation';
            }

            // ラベルを付与
            github.rest.issues.addLabels({
              issue_number: context.payload.pull_request.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              labels: [label]
            });
```

このワークフローでは、PRのタイトルを検査し、それに基づいて`bug`、`documentation`、またはデフォルトの`enhancement`ラベルを自動的に付与します。

---

## 👤 ユーザー
*2023/8/22 21:15:31*

拡張性があるようにキーワードを配列で保持して欲しい。

---

## 🤖 アシスタント
*2023/8/22 21:16:22*

了解しました。以下のワークフローは、キーワードを配列で管理し、PRのタイトルを検査してそれに基づいてラベルを自動的に付与します。これにより、将来的にキーワードやラベルを追加・変更したい場合にも対応しやすくなります。

```yaml
name: Auto-label PR

on:
  pull_request:
    types: [opened]

jobs:
  apply-label:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/github-script@v6
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          script: |
            const prTitle = context.payload.pull_request.title;

            // キーワードとラベルのマッピングを配列で保持
            const keywordMapping = [
              { keywords: ['バグ', '不具合', 'Hotfix'], label: 'bug' },
              { keywords: ['ドキュメント', 'README'], label: 'documentation' }
            ];

            let labelToApply = 'enhancement';  // デフォルトのラベル

            // キーワードを検査して該当するラベルを見つける
            for (const mapping of keywordMapping) {
              if (mapping.keywords.some(keyword => prTitle.includes(keyword))) {
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

このワークフローでは、`keywordMapping` 配列を使用してキーワードとラベルのマッピングを管理しています。将来的に新しいキーワードやラベルを追加したい場合は、この配列に新しいエントリを追加するだけで済みます。

---

## 👤 ユーザー
*2023/8/22 21:18:30*

documentationのキーワードにGitHubを追加してほしい。あと小文字と大文字の区別をしないように判定してほしい。

---

## 🤖 アシスタント
*2023/8/22 21:19:24*

了解しました。キーワードのマッピングに`GitHub`を追加し、大文字・小文字の区別をしないように調整します。

```yaml
name: Auto-label PR

on:
  pull_request:
    types: [opened]

jobs:
  apply-label:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/github-script@v6
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          script: |
            const prTitle = context.payload.pull_request.title.toLowerCase();  // 大文字・小文字の区別をしない

            // キーワードとラベルのマッピングを配列で保持
            const keywordMapping = [
              { keywords: ['バグ', '不具合', 'hotfix'], label: 'bug' },
              { keywords: ['ドキュメント', 'readme', 'github'], label: 'documentation' }  // 'GitHub'を追加
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

このワークフローでは、PRのタイトルとキーワードマッピング内の各キーワードをすべて小文字に変換して、大文字・小文字の区別なくマッチングを行います。また、`documentation`のキーワードに`GitHub`を追加しました。

---
