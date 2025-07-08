# Move PR with GitHub-Actions

日付: 2023-08-22

---

## 👤 ユーザー
*2023/08/23 01:58:28*

actions/github-script を使って、PRが作成されたときに、GitHub Actions を使って、Github Projectのカラムを移動する方法を教えて欲しい。カラム名だけわかっている状態なんだ。

https://github.com/orgs/Viagate/projects/2 というプロジェクトで、カラム名は"👀 In Review (Issue)"なんだ。

---

## 🤖 アシスタント
*2023/08/23 01:59:39*

GitHub-script を使用して GitHub Actions を使って、PRが作成されたときに特定のカラムにアイテムを移動するための方法は以下のとおりです：

1. **GitHub Actions ワークフローを作成します**：

リポジトリの `.github/workflows` ディレクトリに新しいファイルを作成します。例えば `move_card_on_pr.yml` という名前でファイルを作成することができます。

2. **ワークフローの内容を記述します**：

以下の内容でワークフローを記述します。

```yaml
name: Move PR to "👀 In Review (Issue)" column

on:
  pull_request:
    types:
      - opened

jobs:
  move-card:
    runs-on: ubuntu-latest
    steps:
    - name: Move PR to "👀 In Review (Issue)" column
      uses: actions/github-script@v5
      with:
        github-token: ${{secrets.GITHUB_TOKEN}}
        script: |
          const gh = github.rest;
          const context = github.context;

          const projectId = 2; // ID of your project
          const columnName = "👀 In Review (Issue)";

          async function getColumnId() {
            const columns = await gh.projects.listColumns({ project_id: projectId });
            const column = columns.data.find(col => col.name === columnName);
            if (column) {
              return column.id;
            } else {
              throw new Error(`Column "${columnName}" not found`);
            }
          }

          async function run() {
            const columnId = await getColumnId();
            await gh.projects.createCard({
              column_id: columnId,
              content_id: context.payload.pull_request.id,
              content_type: 'PullRequest'
            });
          }

          run();
```

このワークフローは、PRが開かれたときにGitHub Actionsをトリガーし、指定されたカラム名 "👀 In Review (Issue)" にPRのカードを移動します。

注意点：
- このワークフローは、リポジトリのデフォルトのGITHUB_TOKENを使用しています。このトークンには、プロジェクトのカードを移動する権限が必要です。
- カラム名を変更したい場合は、`columnName` の値を更新してください。
- プロジェクトのIDを変更したい場合は、`projectId` の値を更新してください。

このワークフローを `.github/workflows` ディレクトリに保存したら、新しいPRが作成されるたびに自動的に指定したカラムに移動されるようになります。

---

## 👤 ユーザー
*2023/08/23 02:01:11*

const gh = github.rest; と const context = github.context; は使わないで欲しい。
${{secrets.GITHUB_TOKEN}} は${{ secrets.PERSONAL_ACCESS_TOKEN }} を使って欲しい。
name: Move PR to "👀 In Review (Issue)" column は記述しなくていいよ
    types: [opened] と書いて欲しい。

---

## 🤖 アシスタント
*2023/08/23 02:01:53*

わかりました。指定された要件に基づいてワークフローを更新します。

`.github/workflows/move_card_on_pr.yml` ファイルに以下の内容を記述してください：

```yaml
on:
  pull_request:
    types: [opened]

jobs:
  move-card:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/github-script@v5
      with:
        github-token: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
        script: |
          const projectId = 2; 
          const columnName = "👀 In Review (Issue)";

          async function getColumnId() {
            const columns = await github.projects.listColumns({ project_id: projectId });
            const column = columns.data.find(col => col.name === columnName);
            if (column) {
              return column.id;
            } else {
              throw new Error(`Column "${columnName}" not found`);
            }
          }

          async function run() {
            const columnId = await getColumnId();
            await github.projects.createCard({
              column_id: columnId,
              content_id: github.context.payload.pull_request.id,
              content_type: 'PullRequest'
            });
          }

          run();
```

指定された内容に基づいてスクリプトを更新しました。これで、新しくPRが開かれるたびに指定したカラムに移動されるようになります。

ただし、`PERSONAL_ACCESS_TOKEN` に関しては、リポジトリの Secrets セクションで適切に設定しておく必要があります。このトークンは、GitHub Actions がプロジェクトカードを操作する権限を持っている必要があります。

---

## 👤 ユーザー
*2023/08/23 02:04:00*

name: は "Auto Move PR to Review Column" として、ファイル名もそれに合わせて欲しい。また、actions/github-script@v6にしてほしい。

---

## 🤖 アシスタント
*2023/08/23 02:04:42*

了解しました。以下にその要件に基づいて更新したワークフローを示します。

ファイル名: `.github/workflows/auto_move_pr_to_review_column.yml`

内容:

```yaml
name: Auto Move PR to Review Column

on:
  pull_request:
    types: [opened]

jobs:
  move-card:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/github-script@v6
      with:
        github-token: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
        script: |
          const projectId = 2; 
          const columnName = "👀 In Review (Issue)";

          async function getColumnId() {
            const columns = await github.projects.listColumns({ project_id: projectId });
            const column = columns.data.find(col => col.name === columnName);
            if (column) {
              return column.id;
            } else {
              throw new Error(`Column "${columnName}" not found`);
            }
          }

          async function run() {
            const columnId = await getColumnId();
            await github.projects.createCard({
              column_id: columnId,
              content_id: github.context.payload.pull_request.id,
              content_type: 'PullRequest'
            });
          }

          run();
```

このワークフローファイルを `.github/workflows` ディレクトリに `auto_move_pr_to_review_column.yml` として保存してください。これで指定したカラムに新しいPRが自動的に移動されるようになります。

念のため、`PERSONAL_ACCESS_TOKEN` が GitHub リポジトリの Secrets セクションに正しく設定されていることを確認してください。

---

## 👤 ユーザー
*2023/08/23 02:16:46*

github.rest.projects.listColumns だと思う。github.rest.projects.createCard の noteはいらないのか？

---

## 🤖 アシスタント
*2023/08/23 02:17:23*

申し訳ございません、指摘いただきました通り、`github-script` の最新のバージョンでは `github.rest` の形式を使用する必要があります。また、`createCard` の場合、PRやIssueをカードとして追加する際に `note` は必要ありません。

以下に修正を反映したワークフローを示します。

`.github/workflows/auto_move_pr_to_review_column.yml`:

```yaml
name: Auto Move PR to Review Column

on:
  pull_request:
    types: [opened]

jobs:
  move-card:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/github-script@v6
      with:
        github-token: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
        script: |
          const projectId = 2; 
          const columnName = "👀 In Review (Issue)";

          async function getColumnId() {
            const columns = await github.rest.projects.listColumns({ project_id: projectId });
            const column = columns.data.find(col => col.name === columnName);
            if (column) {
              return column.id;
            } else {
              throw new Error(`Column "${columnName}" not found`);
            }
          }

          async function run() {
            const columnId = await getColumnId();
            await github.rest.projects.createCard({
              column_id: columnId,
              content_id: github.context.payload.pull_request.id,
              content_type: 'PullRequest'
            });
          }

          run();
```

この修正を反映させることで、新しいPRがオープンされるたびに指定したカラムに自動的に移動されるようになります。

---

## 👤 ユーザー
*2023/08/23 02:17:38*

note のパラメータはrequireになっているんだけど。

---

## 🤖 アシスタント
*2023/08/23 02:18:04*

申し訳ございません、おっしゃるとおりです。`note` は通常必要ですが、`content_id` と `content_type` を指定する場合は必要ありません。

`createCard` のメソッドは以下の2つの方法でカードを作成することができます：

1. `note` を指定してフリーテキストのカードを作成する。
2. `content_id` と `content_type` を指定して、既存のIssueやPull Requestをカードとして追加する。

2番目の方法を使用しているので、`note` は必要ありません。

したがって、現在のコードは正しいです。指定した `content_id` と `content_type` に基づいてPRをカードとして追加する際に、`note` は省略することができます。

---

## 👤 ユーザー
*2023/08/23 02:20:32*

あと、PRを追加したときにプロジェクトに自動追加するようにしているから、カラムの移動だけでいいかも。

---

## 🤖 アシスタント
*2023/08/23 02:21:25*

了解しました。PRが既にプロジェクトに追加されているのであれば、カードを移動するだけになります。カードの移動には、カードIDを取得して、そのカードを目的のカラムに移動する必要があります。

以下は、開かれたPRのカードを指定したカラムに移動するワークフローを示しています：

```yaml
on:
  pull_request:
    types: [opened]

jobs:
  move-card:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/github-script@v6
      with:
        github-token: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
        script: |
          const projectId = 2;
          const columnName = "👀 In Review (Issue)";

          async function getColumnId() {
            const columns = await github.rest.projects.listColumns({ project_id: projectId });
            const column = columns.data.find(col => col.name === columnName);
            if (column) {
              return column.id;
            } else {
              throw new Error(`Column "${columnName}" not found`);
            }
          }

          async function getCardId(issueId) {
            const cards = await github.rest.projects.listCards({ project_id: projectId });
            const card = cards.data.find(card => card.content_id === issueId);
            if (card) {
              return card.id;
            } else {
              throw new Error(`Card for PR #${issueId} not found`);
            }
          }

          async function run() {
            const columnId = await getColumnId();
            const cardId = await getCardId(github.context.payload.pull_request.id);
            await github.rest.projects.moveCard({
              card_id: cardId,
              column_id: columnId,
              position: "top"
            });
          }

          run();
```

このスクリプトは、次の手順を実行します：

1. 目的のカラムのIDを取得します。
2. 開かれたPRに関連するカードのIDを取得します。
3. そのカードを指定したカラムの最上部に移動します。

このワークフローをリポジトリの `.github/workflows` ディレクトリに保存すると、PRが開かれるたびにそのカードが自動的に指定したカラムに移動されます。

---

## 👤 ユーザー
*2023/08/23 02:26:33*

以下のようなエラーになった。

    debug: false
    user-agent: actions/github-script
    result-encoding: json
    retries: 0
    retry-exempt-status-codes: 400,401,403,404,422
RequestError [HttpError]: Must have admin rights to Repository.
Error: Unhandled error: HttpError: Must have admin rights to Repository.
    at /home/runner/work/_actions/actions/github-script/v6/dist/index.js:6842:21
    at processTicksAndRejections (node:internal/process/task_queues:96:5)
    at async getColumnId (eval at callAsyncFunction (/home/runner/work/_actions/actions/github-script/v6/dist/index.js:15143:16), &lt;anonymous&gt;:7:19)
    at async run (eval at callAsyncFunction (/home/runner/work/_actions/actions/github-script/v6/dist/index.js:15143:16), &lt;anonymous&gt;:27:20) {
  status: 403,
  response: {
    url: 'https://api.github.com/projects/1/columns',
    status: 403,
    headers: {
      'access-control-allow-origin': '*',
      'access-control-expose-headers': 'ETag, Link, Location, Retry-After, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Used, X-RateLimit-Resource, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval, X-GitHub-Media-Type, X-GitHub-SSO, X-GitHub-Request-Id, Deprecation, Sunset',
      connection: 'close',
      'content-encoding': 'gzip',
      'content-security-policy': "default-src 'none'",
      'content-type': 'application/json; charset=utf-8',
      date: 'Tue, 22 Aug 2023 17:24:58 GMT',
      'referrer-policy': 'origin-when-cross-origin, strict-origin-when-cross-origin',
      server: 'GitHub.com',
      'strict-transport-security': 'max-age=31536000; includeSubdomains; preload',
      'transfer-encoding': 'chunked',
      vary: 'Accept-Encoding, Accept, X-Requested-With',
      'x-accepted-oauth-scopes': 'repo',
      'x-content-type-options': 'nosniff',
      'x-frame-options': 'deny',
      'x-github-api-version-selected': '2022-11-28',
      'x-github-media-type': 'github.v3; format=json',
      'x-github-request-id': '1419:439E:13A44A4:27EDDAB:64E4EF6A',
      'x-oauth-scopes': 'admin:org, project, repo',
      'x-ratelimit-limit': '5000',
      'x-ratelimit-remaining': '4927',
      'x-ratelimit-reset': '1692727192',
      'x-ratelimit-resource': 'core',
      'x-ratelimit-used': '73',
      'x-xss-protection': '0'
    },
    data: {
      message: 'Must have admin rights to Repository.',
      documentation_url: 'https://docs.github.com/rest/projects/columns#list-project-columns'
    }
  },
  request: {
    method: 'GET',
    url: 'https://api.github.com/projects/1/columns',
    headers: {
      accept: 'application/vnd.github.v3+json',
      'user-agent': 'actions/github-script octokit-core.js/3.6.0 Node.js/16.20.1 (linux; x64)',
      authorization: 'token [REDACTED]'
    },
    request: { agent: [Agent], hook: [Function: bound bound register] }
  }
}

---

## 🤖 アシスタント
*2023/08/23 02:27:22*

エラー内容を見ると、「Must have admin rights to Repository」とのメッセージが表示されています。これは、指定したトークンがリポジトリの管理者権限を持っていないか、またはGitHub Projectsのカラムにアクセスするのに十分な権限を持っていないことを示しています。

以下の手順を試してください：

1. **パーソナルアクセストークンの権限確認**: GitHubにログインし、トークンの設定ページに移動します。このトークンは「repo」、「admin:org」、および「project」のすべての権限を持つ必要があります。これらの権限がない場合、トークンを編集して追加してください。

2. **オーガニゼーションの設定確認**: もしもこのプロジェクトがオーガニゼーションのものであるならば、該当のオーガニゼーションの設定でアクセス権を確認してください。トークンを生成したユーザーが該当のリポジトリやオーガニゼーションに十分な権限を持っているか確認してください。

3. **ワークフローのプロジェクトID確認**: ワークフロー内の`projectId`が正しいか再確認してください。正しいプロジェクトIDであることを確認する必要があります。

これらの手順を踏んで、トークンや設定が正しく、十分な権限を持っていることを確認してください。それでも問題が解決しない場合、さらなるトラブルシューティングが必要となる場合があります。

---

## 👤 ユーザー
*2023/08/23 02:37:59*

admin:repo_hook やadmin:org_hookにはどのような意味があるか？

---

## 🤖 アシスタント
*2023/08/23 02:38:39*

`admin:repo_hook` と `admin:org_hook` は、GitHubのパーソナルアクセストークンのスコープの一部として定義されている権限です。これらのスコープに関連する権限は、リポジトリや組織のWebフックの管理に関連しています。

具体的には：

1. **admin:repo_hook**
    - このスコープは、個々のリポジトリに関連するフックの管理に使用されます。
    - ユーザーは次のことができます：
        - リポジトリフックの読み取り
        - リポジトリフックの作成
        - リポジトリフックの更新
        - リポジトリフックの削除

2. **admin:org_hook**
    - このスコープは、GitHubの組織に関連するフックの管理に使用されます。
    - ユーザーは次のことができます：
        - 組織フックの読み取り
        - 組織フックの作成
        - 組織フックの更新
        - 組織フックの削除

**注意:** 権限を付与する際には注意が必要です。特に `admin` スコープは、権限の範囲が広く、重要な操作ができるため、安全な管理と適切な使用が必要です。必要最小限のスコープのみを付与することを推奨します。

---

## 👤 ユーザー
*2023/08/23 02:38:55*

Slackの通知ではどんな権限が必要は手案

---

## 🤖 アシスタント
*2023/08/23 02:40:06*

Slackに通知を送るためのGitHubのアクションやスクリプトに関しては、直接的にSlackのAPIトークンやWebhook URLを利用する場合が多いです。これは、GitHub側がSlackに直接通知を送るためのものです。したがって、GitHubの権限とSlackの権限は別々のものとして考える必要があります。

1. **GitHub側の権限**:
    - GitHub Actionsを利用する場合、アクションがリポジトリのデータにアクセスするためのトークン (`GITHUB_TOKEN` またはカスタムのPAT) が必要です。
    - ただし、Slackに通知を送るだけの場合、特定の権限は不要となります。ただし、特定のイベントの詳細を通知に含める場合、そのイベントに関連するデータへのアクセス権限が必要になることもあります。

2. **Slack側の権限**:
    - **Incoming Webhooks**: SlackのIncoming Webhookを使用する最もシンプルな方法では、特定のチャンネルにメッセージを送信するためのWebhook URLが必要です。このURLはSlackの設定で生成できます。
    - **Bot Token**: Slack APIをより高度に使用する場合、Bot Tokenが必要となります。これには、メッセージを送信する権限やユーザーのリストを取得する権限など、様々な権限が付与されることがあります。トークンのスコープは、使用するAPIメソッドに応じて適切に設定する必要があります。
    - **OAuth Access Token**: Slackアプリを使用して、特定のワークスペースに対してOAuth認証を行う場合、このトークンを使用します。これは、特定のユーザーアクションやワークスペースデータへのアクセスに関連するものです。

Slackに通知を送る場合、通常はSlackのIncoming Webhookを使用するのが最もシンプルで安全な方法です。これにより、特定のチャンネルに対してメッセージを送信することができます。高度な機能やカスタマイズが必要な場合は、Slack APIとBot Tokenを利用することになります。

---
