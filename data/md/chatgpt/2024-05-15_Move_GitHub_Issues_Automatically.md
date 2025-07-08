# Move GitHub Issues Automatically

日付: 2024-05-15

---

## 👤 ユーザー
*2024/05/16 00:11:58*

GitHub Actions でPRを作成または更新したときにPRのタイトルに含まれるissueをGitHub projectのカラムを移動させたい

---

## 🤖 アシスタント
*2024/05/16 00:12:13*

GitHub Actionsを使って、PRが作成または更新されたときにPRのタイトルに含まれるIssueをGitHub Projectのカラムに移動させる方法を説明します。以下の手順で設定できます。

1. **GitHub Personal Access Tokenの作成**:
   - [GitHub Personal Access Token](https://github.com/settings/tokens) を生成します。トークンには`repo`と`project`のスコープが必要です。

2. **GitHub Actions ワークフローファイルの作成**:
   - `.github/workflows/move_issue.yml` というファイルを作成し、以下のような内容を追加します。

```yaml
name: Move Issue to Project Column

on:
  pull_request:
    types: [opened, edited]

jobs:
  move_issue_to_column:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14'

      - name: Install octokit
        run: npm install @octokit/rest

      - name: Move Issue to Project Column
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          node -e "
            const { Octokit } = require('@octokit/rest');
            const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

            const prTitle = process.env.GITHUB_EVENT_PATH ? require(process.env.GITHUB_EVENT_PATH).pull_request.title : '';
            const issueNumber = prTitle.match(/#\d+/) ? prTitle.match(/#\d+/)[0].substring(1) : null;

            if (issueNumber) {
              const projectId = 'YOUR_PROJECT_ID'; // ここにプロジェクトIDを入力
              const columnId = 'YOUR_COLUMN_ID'; // ここにカラムIDを入力

              async function moveIssue() {
                const projectCards = await octokit.projects.listCards({
                  column_id: columnId
                });

                const issueCard = projectCards.data.find(card => card.content_url && card.content_url.includes(`/issues/${issueNumber}`));

                if (issueCard) {
                  await octokit.projects.moveCard({
                    card_id: issueCard.id,
                    position: 'top'
                  });
                  console.log(`Moved issue #${issueNumber} to column ${columnId}`);
                } else {
                  console.log(`Issue #${issueNumber} not found in column ${columnId}`);
                }
              }

              moveIssue();
            } else {
              console.log('No issue number found in PR title');
            }
          "
```

3. **必要な値の取得と設定**:
   - `projectId`と`columnId`は、それぞれプロジェクトとカラムのIDです。GitHubのプロジェクトページでIDを確認し、適切な値を設定します。
   - GitHubのリポジトリ設定で、先ほど作成したPersonal Access Tokenを`secrets.GITHUB_TOKEN`として登録します。

これで、PRが作成または更新されたときに、タイトルに含まれるIssueが指定したカラムに移動するようになります。

---

## 👤 ユーザー
*2024/05/16 00:13:10*

oktokitを直接使うのではなくラップされたものをuseする方法はないの？

---

## 🤖 アシスタント
*2024/05/16 00:13:25*

Octokitを直接使わずに、ラップされたアクションを使用する方法もあります。例えば、`actions/github-script`を使ってGitHub Actionsのスクリプト部分を簡単に記述できます。以下はその例です。

1. **GitHub Actions ワークフローファイルの作成**:
   - `.github/workflows/move_issue.yml`というファイルを作成し、以下のような内容を追加します。

```yaml
name: Move Issue to Project Column

on:
  pull_request:
    types: [opened, edited]

jobs:
  move_issue_to_column:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Move Issue to Project Column
        uses: actions/github-script@v6
        with:
          script: |
            const prTitle = context.payload.pull_request.title;
            const issueMatch = prTitle.match(/#\d+/);
            if (!issueMatch) {
              console.log('No issue number found in PR title');
              return;
            }

            const issueNumber = issueMatch[0].substring(1);
            const projectId = 'YOUR_PROJECT_ID'; // ここにプロジェクトIDを入力
            const columnId = 'YOUR_COLUMN_ID'; // ここにカラムIDを入力

            const cards = await github.projects.listCards({
              column_id: columnId
            });

            const issueCard = cards.data.find(card => card.content_url && card.content_url.includes(`/issues/${issueNumber}`));

            if (issueCard) {
              await github.projects.moveCard({
                card_id: issueCard.id,
                position: 'top'
              });
              console.log(`Moved issue #${issueNumber} to column ${columnId}`);
            } else {
              console.log(`Issue #${issueNumber} not found in column ${columnId}`);
            }
```

2. **必要な値の取得と設定**:
   - `projectId`と`columnId`は、それぞれプロジェクトとカラムのIDです。GitHubのプロジェクトページでIDを確認し、適切な値を設定します。

これで、Octokitを直接使用せずに、GitHub Actionsでラップされたアクションを利用してPRのタイトルに含まれるIssueを指定したカラムに移動させることができます。

---

## 👤 ユーザー
*2024/05/16 00:13:44*

カラムIDはどう確認するの？

---

## 🤖 アシスタント
*2024/05/16 00:14:01*

GitHub ProjectのカラムIDを確認するには、以下の手順に従います。

1. **GitHub APIを使用してカラムIDを取得する**:
   GitHubのREST APIを使って、プロジェクトボードのカラムIDを取得できます。APIを呼び出すためには、Personal Access Tokenが必要です。

2. **プロジェクトのIDを取得**:
   プロジェクトのIDを取得するために、まずプロジェクトボードのURLを使用してAPIを呼び出します。

   プロジェクトボードのURLが `https://github.com/owner/repo/projects/1` の場合、以下のようなAPIリクエストを行います。

   ```bash
   curl -H "Authorization: token YOUR_PERSONAL_ACCESS_TOKEN" \
        -H "Accept: application/vnd.github.inertia-preview+json" \
        https://api.github.com/repos/owner/repo/projects/1
   ```

   このリクエストのレスポンスからプロジェクトIDを確認します。プロジェクトIDはレスポンスの中の `id` フィールドに含まれています。

3. **カラムIDを取得**:
   次に、取得したプロジェクトIDを使用して、プロジェクトのカラムIDを取得します。

   ```bash
   curl -H "Authorization: token YOUR_PERSONAL_ACCESS_TOKEN" \
        -H "Accept: application/vnd.github.inertia-preview+json" \
        https://api.github.com/projects/YOUR_PROJECT_ID/columns
   ```

   このリクエストのレスポンスには、プロジェクト内のすべてのカラムの情報が含まれています。カラムのIDはレスポンスの中の `id` フィールドに含まれています。

### 例

例えば、プロジェクトのIDが `1001` である場合、以下のコマンドを使用してカラムのIDを取得します。

```bash
curl -H "Authorization: token YOUR_PERSONAL_ACCESS_TOKEN" \
     -H "Accept: application/vnd.github.inertia-preview+json" \
     https://api.github.com/projects/1001/columns
```

レスポンスは以下のようになります。

```json
[
  {
    "id": 2001,
    "name": "To do",
    ...
  },
  {
    "id": 2002,
    "name": "In progress",
    ...
  },
  {
    "id": 2003,
    "name": "Done",
    ...
  }
]
```

この例では、カラム「To do」のIDは `2001`、カラム「In progress」のIDは `2002`、カラム「Done」のIDは `2003` です。

これらのカラムIDを使って、GitHub Actionsのワークフローで必要なカラムにIssueを移動させることができます。

---

## 👤 ユーザー
*2024/05/16 00:14:48*

もっと簡単にカラムIDを取得する方法はないの？

---

## 🤖 アシスタント
*2024/05/16 00:15:08*

より簡単にカラムIDを取得する方法として、ブラウザの開発者ツールを使用する方法があります。以下にその手順を説明します。

1. **ブラウザでプロジェクトボードを開く**:
   - GitHubのリポジトリにアクセスし、対象のプロジェクトボードを開きます。

2. **開発者ツールを開く**:
   - 使用しているブラウザで開発者ツールを開きます。通常、これを行うには右クリックして「検証」または「開発者ツール」を選択します。キーボードショートカットも使用できます（例: Chromeでは`F12`または`Ctrl+Shift+I`）。

3. **ネットワークタブを開く**:
   - 開発者ツール内の「ネットワーク」タブを選択します。

4. **カラムのリクエストを探す**:
   - プロジェクトボード内のカラム（例: To do, In progress, Doneなど）をクリックします。このアクションにより、GitHubがAPIリクエストを送信し、カラム情報を取得します。

5. **APIリクエストを確認する**:
   - ネットワークタブに表示されるリクエストのリストから、`columns` または類似のエンドポイントを含むリクエストを探します。
   - 該当するリクエストを選択し、「レスポンス」タブを開きます。ここで、レスポンスデータとしてカラムのIDと名前を確認できます。

### 具体例

1. **プロジェクトボードのURL**: `https://github.com/owner/repo/projects/1`

2. **開発者ツールでリクエストを探す**:
   - `columns` エンドポイントを含むリクエストを探します。リクエストのURLは次のようになります:
     ```
     https://api.github.com/projects/1001/columns
     ```

3. **レスポンスの確認**:
   - リクエストを選択し、「レスポンス」タブで以下のようなJSONデータを探します:
     ```json
     [
       {
         "id": 2001,
         "name": "To do",
         ...
       },
       {
         "id": 2002,
         "name": "In progress",
         ...
       },
       {
         "id": 2003,
         "name": "Done",
         ...
       }
     ]
     ```
   - この例では、カラム「To do」のIDは `2001`、「In progress」のIDは `2002`、「Done」のIDは `2003` です。

この方法で、直接GitHubのインターフェースを使って簡単にカラムIDを取得できます。

---

## 👤 ユーザー
*2024/05/16 00:16:45*

GitHub Actionsのコードなのだけれども対象のissueが複数ある可能性がある

---

## 🤖 アシスタント
*2024/05/16 00:17:04*

複数のIssueを処理する場合も考慮して、GitHub Actionsのコードを調整します。PRのタイトルに複数のIssue番号が含まれている場合、それぞれのIssueを指定されたカラムに移動させるようにします。

以下は、そのためのGitHub Actionsのコード例です。`actions/github-script`を使って、PRのタイトルから複数のIssue番号を抽出し、それぞれのIssueを指定されたカラムに移動させます。

```yaml
name: Move Issues to Project Column

on:
  pull_request:
    types: [opened, edited]

jobs:
  move_issues_to_column:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Move Issues to Project Column
        uses: actions/github-script@v6
        with:
          script: |
            const prTitle = context.payload.pull_request.title;
            const issueMatches = prTitle.match(/#\d+/g);
            if (!issueMatches) {
              console.log('No issue numbers found in PR title');
              return;
            }

            const projectId = 'YOUR_PROJECT_ID'; // ここにプロジェクトIDを入力
            const columnId = 'YOUR_COLUMN_ID'; // ここにカラムIDを入力

            for (const issueMatch of issueMatches) {
              const issueNumber = issueMatch.substring(1);
              const cards = await github.projects.listCards({
                column_id: columnId
              });

              const issueCard = cards.data.find(card => card.content_url && card.content_url.includes(`/issues/${issueNumber}`));

              if (issueCard) {
                await github.projects.moveCard({
                  card_id: issueCard.id,
                  position: 'top'
                });
                console.log(`Moved issue #${issueNumber} to column ${columnId}`);
              } else {
                console.log(`Issue #${issueNumber} not found in column ${columnId}`);
              }
            }
```

### 重要なポイント

1. **Issue番号の抽出**:
   - `const issueMatches = prTitle.match(/#\d+/g);` でPRのタイトルから全てのIssue番号を抽出します。
   - 正規表現 `/g` フラグを使用して全てのマッチを取得します。

2. **各Issueの処理**:
   - `for (const issueMatch of issueMatches)` で抽出した全てのIssue番号に対してループを回します。
   - 各Issue番号について、カラム内のカードを取得し、対応するIssueカードを見つけて移動させます。

3. **APIトークンの設定**:
   - GitHubリポジトリの設定で、Personal Access Tokenを`secrets.GITHUB_TOKEN`として登録します。

これにより、PRのタイトルに含まれる全てのIssueを指定したカラムに移動させることができます。

---

## 👤 ユーザー
*2024/05/16 00:17:46*

secrets.GITHUB_TOKENはデフォルトだとダメなんだっけ？

---

## 🤖 アシスタント
*2024/05/16 00:18:12*

デフォルトの `secrets.GITHUB_TOKEN` は、リポジトリのコンテキスト内で動作する権限を持っており、多くの操作に使用できます。ただし、プロジェクトボードに対する操作（特にプロジェクトのカラムにカードを移動するような操作）には、デフォルトの `GITHUB_TOKEN` では十分な権限がないことがあります。そのため、個別に設定したPersonal Access Tokenを使用することをお勧めします。

以下は、デフォルトの `secrets.GITHUB_TOKEN` ではなく、個別に設定したPersonal Access Tokenを使用する例です。ここでは、`PERSONAL_ACCESS_TOKEN` として登録されたシークレットを使用しています。

### 手順

1. **Personal Access Tokenの作成**:
   - [GitHub Personal Access Token](https://github.com/settings/tokens) を生成し、必要なスコープ（`repo`、`project`）を付与します。

2. **リポジトリにシークレットを設定**:
   - リポジトリの設定画面で、Secretsのセクションに移動し、`PERSONAL_ACCESS_TOKEN` としてトークンを登録します。

3. **GitHub Actionsのワークフローファイルの設定**:
   - `.github/workflows/move_issue.yml` に以下のような内容を追加します。

```yaml
name: Move Issues to Project Column

on:
  pull_request:
    types: [opened, edited]

jobs:
  move_issues_to_column:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Move Issues to Project Column
        uses: actions/github-script@v6
        env:
          GITHUB_TOKEN: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
        with:
          script: |
            const prTitle = context.payload.pull_request.title;
            const issueMatches = prTitle.match(/#\d+/g);
            if (!issueMatches) {
              console.log('No issue numbers found in PR title');
              return;
            }

            const projectId = 'YOUR_PROJECT_ID'; // ここにプロジェクトIDを入力
            const columnId = 'YOUR_COLUMN_ID'; // ここにカラムIDを入力

            for (const issueMatch of issueMatches) {
              const issueNumber = issueMatch.substring(1);
              const cards = await github.projects.listCards({
                column_id: columnId
              });

              const issueCard = cards.data.find(card => card.content_url && card.content_url.includes(`/issues/${issueNumber}`));

              if (issueCard) {
                await github.projects.moveCard({
                  card_id: issueCard.id,
                  position: 'top'
                });
                console.log(`Moved issue #${issueNumber} to column ${columnId}`);
              } else {
                console.log(`Issue #${issueNumber} not found in column ${columnId}`);
              }
            }
```

### 重要なポイント

- `GITHUB_TOKEN` 環境変数を `secrets.PERSONAL_ACCESS_TOKEN` に置き換えて、十分な権限を持つトークンを使用しています。
- 上記のコード例では、各Issue番号についてリストカードを取得し、対応するIssueカードを見つけて移動させます。

これで、Personal Access Tokenを使用して、複数のIssueを指定されたカラムに移動させることができます。

---

## 👤 ユーザー
*2024/05/16 00:18:27*

Personal Access Tokenを使わない方法は？

---

## 🤖 アシスタント
*2024/05/16 00:18:55*

Personal Access Tokenを使わずに、デフォルトの`secrets.GITHUB_TOKEN`を使用してGitHub ActionsでプロジェクトボードのカラムにIssueを移動させる方法もあります。GitHub Actions内で`secrets.GITHUB_TOKEN`を使用する場合、以下のような設定を試してみてください。

1. **リポジトリの設定**:
   - `secrets.GITHUB_TOKEN`がデフォルトで使用されるように設定します。

2. **GitHub Actionsのワークフローファイルの作成**:
   - `.github/workflows/move_issue.yml`というファイルを作成し、以下のような内容を追加します。

```yaml
name: Move Issues to Project Column

on:
  pull_request:
    types: [opened, edited]

jobs:
  move_issues_to_column:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Move Issues to Project Column
        uses: actions/github-script@v6
        with:
          script: |
            const prTitle = context.payload.pull_request.title;
            const issueMatches = prTitle.match(/#\d+/g);
            if (!issueMatches) {
              console.log('No issue numbers found in PR title');
              return;
            }

            const columnId = 'YOUR_COLUMN_ID'; // ここにカラムIDを入力

            for (const issueMatch of issueMatches) {
              const issueNumber = issueMatch.substring(1);
              const cards = await github.projects.listCards({
                column_id: columnId
              });

              const issueCard = cards.data.find(card => card.content_url && card.content_url.includes(`/issues/${issueNumber}`));

              if (issueCard) {
                await github.projects.moveCard({
                  card_id: issueCard.id,
                  position: 'top'
                });
                console.log(`Moved issue #${issueNumber} to column ${columnId}`);
              } else {
                console.log(`Issue #${issueNumber} not found in column ${columnId}`);
              }
            }
```

### 重要なポイント

1. **スクリプトの設定**:
   - PRのタイトルからIssue番号を抽出し、それぞれのIssueを指定したカラムに移動させるスクリプトです。

2. **カラムIDの設定**:
   - `YOUR_COLUMN_ID` をプロジェクトボードのカラムIDに置き換えます。

### カラムIDの取得方法（簡易版）

GitHubのプロジェクトボードのカラムIDを取得する簡単な方法は、ブラウザの開発者ツールを使用することです。以下の手順でカラムIDを確認します。

1. **プロジェクトボードを開く**:
   - 対象のプロジェクトボードをブラウザで開きます。

2. **開発者ツールを開く**:
   - 使用しているブラウザで開発者ツールを開きます（例: Chromeでは`F12`または`Ctrl+Shift+I`）。

3. **ネットワークタブを開く**:
   - 開発者ツールの「ネットワーク」タブを選択します。

4. **カラムをクリック**:
   - プロジェクトボード内のカラム（例: To do, In progress, Doneなど）をクリックします。

5. **APIリクエストを確認する**:
   - ネットワークタブに表示されるリクエストのリストから、`columns` または類似のエンドポイントを含むリクエストを探します。
   - 該当するリクエストを選択し、「レスポンス」タブを開きます。ここで、レスポンスデータとしてカラムのIDと名前を確認できます。

これにより、カラムIDを簡単に取得できます。取得したカラムIDをワークフローファイルの`YOUR_COLUMN_ID`に設定して使用します。

この方法で、デフォルトの`secrets.GITHUB_TOKEN`を使用して、複数のIssueを指定したカラムに移動させることができます。

---

## 👤 ユーザー
*2024/05/16 09:33:57*

projectsのidは不要なの？

---

## 🤖 アシスタント
*2024/05/16 09:34:21*

`projects`のIDはカラムIDを取得するために必要です。GitHubのプロジェクトボードのカラムIDを取得するためには、まずプロジェクトIDを知る必要があります。以下に、プロジェクトIDとカラムIDの両方を取得する方法を簡単に説明します。

### プロジェクトIDとカラムIDの取得方法

1. **プロジェクトのIDを取得する**:
   プロジェクトのIDを取得するために、GitHubのREST APIを使用します。プロジェクトボードのURLが `https://github.com/owner/repo/projects/1` の場合、以下のようなAPIリクエストを行います。

   ```bash
   curl -H "Authorization: token YOUR_PERSONAL_ACCESS_TOKEN" \
        -H "Accept: application/vnd.github.inertia-preview+json" \
        https://api.github.com/repos/owner/repo/projects/1
   ```

   レスポンスからプロジェクトIDを確認します。プロジェクトIDはレスポンスの中の `id` フィールドに含まれています。

2. **カラムIDを取得する**:
   取得したプロジェクトIDを使用して、プロジェクト内のカラムIDを取得します。

   ```bash
   curl -H "Authorization: token YOUR_PERSONAL_ACCESS_TOKEN" \
        -H "Accept: application/vnd.github.inertia-preview+json" \
        https://api.github.com/projects/YOUR_PROJECT_ID/columns
   ```

   このリクエストのレスポンスには、プロジェクト内のすべてのカラムの情報が含まれています。カラムのIDはレスポンスの中の `id` フィールドに含まれています。

### GitHub Actions ワークフローファイル

以下は、プロジェクトIDとカラムIDを使ってIssueを移動させるGitHub Actionsのワークフローファイルです。

```yaml
name: Move Issues to Project Column

on:
  pull_request:
    types: [opened, edited]

jobs:
  move_issues_to_column:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Move Issues to Project Column
        uses: actions/github-script@v6
        with:
          script: |
            const prTitle = context.payload.pull_request.title;
            const issueMatches = prTitle.match(/#\d+/g);
            if (!issueMatches) {
              console.log('No issue numbers found in PR title');
              return;
            }

            const projectId = 'YOUR_PROJECT_ID'; // ここにプロジェクトIDを入力
            const columnId = 'YOUR_COLUMN_ID'; // ここにカラムIDを入力

            for (const issueMatch of issueMatches) {
              const issueNumber = issueMatch.substring(1);
              const cards = await github.projects.listCards({
                column_id: columnId
              });

              const issueCard = cards.data.find(card => card.content_url && card.content_url.includes(`/issues/${issueNumber}`));

              if (issueCard) {
                await github.projects.moveCard({
                  card_id: issueCard.id,
                  position: 'top'
                });
                console.log(`Moved issue #${issueNumber} to column ${columnId}`);
              } else {
                console.log(`Issue #${issueNumber} not found in column ${columnId}`);
              }
            }
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### プロジェクトIDとカラムIDの簡単な取得方法

ブラウザの開発者ツールを使用して、簡単にカラムIDを取得する方法もあります。

1. **プロジェクトボードを開く**:
   - 対象のプロジェクトボードをブラウザで開きます。

2. **開発者ツールを開く**:
   - 使用しているブラウザで開発者ツールを開きます（例: Chromeでは`F12`または`Ctrl+Shift+I`）。

3. **ネットワークタブを開く**:
   - 開発者ツール内の「ネットワーク」タブを選択します。

4. **カラムをクリック**:
   - プロジェクトボード内のカラム（例: To do, In progress, Doneなど）をクリックします。このアクションにより、GitHubがAPIリクエストを送信し、カラム情報を取得します。

5. **APIリクエストを確認する**:
   - ネットワークタブに表示されるリクエストのリストから、`columns` または類似のエンドポイントを含むリクエストを探します。
   - 該当するリクエストを選択し、「レスポンス」タブを開きます。ここで、レスポンスデータとしてカラムのIDと名前を確認できます。

取得したプロジェクトIDとカラムIDをワークフローファイルに設定して使用します。これで、デフォルトの`secrets.GITHUB_TOKEN`を使用して、複数のIssueを指定したカラムに移動させることができます。

---

## 👤 ユーザー
*2024/05/16 09:35:54*

結局 const projectId = 'YOUR_PROJECT_ID'; // ここにプロジェクトIDを入力 で定義した projectIdを使っていない気がする

---

## 🤖 アシスタント
*2024/05/16 09:36:10*

確かに、その指摘の通りです。上記のコード例では `projectId` を使用していませんでした。必要な `columnId` を取得するために `projectId` を使用し、適切にIssueを移動するために修正します。

以下に、GitHub Actionsを使用してPRのタイトルに含まれるIssueをGitHubプロジェクトボードのカラムに移動する完全なワークフローを示します。ここでは、`projectId`を使用してカラムIDを取得し、Issueを移動します。

### 手順

1. **GitHub Personal Access Tokenの作成と登録**:
   - 先ほどの手順で作成したPersonal Access Tokenを使用しなくても、デフォルトの`secrets.GITHUB_TOKEN`を使う方法です。

2. **GitHub Actionsのワークフローファイルの作成**:
   - `.github/workflows/move_issue.yml` というファイルを作成し、以下の内容を追加します。

```yaml
name: Move Issues to Project Column

on:
  pull_request:
    types: [opened, edited]

jobs:
  move_issues_to_column:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Move Issues to Project Column
        uses: actions/github-script@v6
        with:
          script: |
            const prTitle = context.payload.pull_request.title;
            const issueMatches = prTitle.match(/#\d+/g);
            if (!issueMatches) {
              console.log('No issue numbers found in PR title');
              return;
            }

            const projectId = 'YOUR_PROJECT_ID'; // ここにプロジェクトIDを入力
            const columnName = 'YOUR_COLUMN_NAME'; // ここにカラム名を入力

            async function getColumnId(projectId, columnName) {
              const columns = await github.projects.listColumns({
                project_id: projectId
              });
              const column = columns.data.find(col => col.name === columnName);
              return column ? column.id : null;
            }

            async function moveIssuesToColumn(issueMatches, columnId) {
              for (const issueMatch of issueMatches) {
                const issueNumber = issueMatch.substring(1);
                const cards = await github.projects.listCards({
                  column_id: columnId
                });

                const issueCard = cards.data.find(card => card.content_url && card.content_url.includes(`/issues/${issueNumber}`));

                if (issueCard) {
                  await github.projects.moveCard({
                    card_id: issueCard.id,
                    position: 'top'
                  });
                  console.log(`Moved issue #${issueNumber} to column ${columnId}`);
                } else {
                  console.log(`Issue #${issueNumber} not found in column ${columnId}`);
                }
              }
            }

            (async () => {
              const columnId = await getColumnId(projectId, columnName);
              if (!columnId) {
                console.log(`Column ${columnName} not found in project ${projectId}`);
                return;
              }
              await moveIssuesToColumn(issueMatches, columnId);
            })();
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 重要なポイント

1. **プロジェクトIDとカラム名の設定**:
   - `const projectId = 'YOUR_PROJECT_ID';` でプロジェクトIDを設定します。
   - `const columnName = 'YOUR_COLUMN_NAME';` でカラム名を設定します。

2. **カラムIDの取得**:
   - `getColumnId` 関数を使って、指定したプロジェクトIDとカラム名からカラムIDを取得します。

3. **Issueの移動**:
   - `moveIssuesToColumn` 関数を使って、複数のIssueを指定したカラムに移動させます。

この方法で、デフォルトの`secrets.GITHUB_TOKEN`を使用し、プロジェクトIDとカラム名を指定して、複数のIssueをカラムに移動させることができます。

---
