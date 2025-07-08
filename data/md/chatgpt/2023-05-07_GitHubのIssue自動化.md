# GitHubのIssue自動化

Date: 2023-05-07

---

## 👤 User
*2023-05-07 20:26:28*

GitHubをつかっているんだけど、issueを立てたり、pull request を作成した際に自動でProjectsと紐づけて欲しいんだけどどうすればいいのかな？

---

## 🤖 Assistant
*2023-05-07 20:27:16*

GitHubのProjectsをIssueやPull Requestに自動で紐づけするには、GitHub Actionsを使用して自動化することができます。以下に、Issueが作成された際に自動でProjectにカードを追加する方法を紹介します。

1. まず、リポジトリのルートディレクトリに`.github/workflows`ディレクトリを作成します。

2. そのディレクトリ内に、例えば`add_to_project.yml`という名前のYAMLファイルを作成します。

3. 次に、そのYAMLファイルに以下のコードを追加してください（プロジェクトID、カラムID、およびGitHubのトークンを適切に設定してください）:

```yaml
name: Add new issues to project

on:
  issues:
    types: [opened]

jobs:
  add_issue_to_project:
    runs-on: ubuntu-latest
    steps:
    - name: Add issue to project
      run: |
        issue_number=${{ github.event.issue.number }}
        project_id=YOUR_PROJECT_ID
        column_id=YOUR_COLUMN_ID
        gh_token=${{ secrets.GITHUB_TOKEN }}

        curl --request POST \
        --url https://api.github.com/projects/columns/$column_id/cards \
        --header "Accept: application/vnd.github+json" \
        --header "Authorization: token $gh_token" \
        --data '{"content_type": "Issue", "content_id": '"$issue_number"'}'
```

この設定ファイルは、Issueが開かれるたびに、指定されたProjectのカラムにカードを追加するGitHub Actionsを実行します。同様に、Pull Requestに対しても同じような設定を行うことができます。

ここで使用される`YOUR_PROJECT_ID`と`YOUR_COLUMN_ID`は、GitHubのプロジェクトページのURLやAPIを使って取得できます。プロジェクトのURLが `https://github.com/your-username/your-repo/projects/1` の場合、プロジェクトIDは `1` です。カラムIDは、[GitHub API](https://docs.github.com/en/rest/reference/projects)を使用して取得できます。

---

## 👤 User
*2023-05-07 20:28:21*

カラムIDの取得の方法を推して欲しい。ちなみにプロジェクトのurlは https://github.com/users/suguruTakahashi-1234/projects/1 です

---

## 🤖 Assistant
*2023-05-07 20:29:07*

カラムIDを取得するには、GitHub APIを使ってリクエストを送信します。まず、[Personal Access Token](https://github.com/settings/tokens) を作成して、リポジトリへのアクセス権限を持つトークンを取得してください。

次に、ターミナルやコマンドプロンプトを開いて、以下のような `curl` コマンドを実行します。`your_personal_access_token` を先ほど作成したトークンに置き換えてください。

```bash
curl -H "Accept: application/vnd.github+json" \
     -H "Authorization: token your_personal_access_token" \
     https://api.github.com/users/suguruTakahashi-1234/projects/1/columns
```

このコマンドは、プロジェクトのカラム情報を取得します。応答は、JSON形式で返されます。例えば、以下のような応答が得られるでしょう。

```json
[
  {
    "id": 12345,
    "url": "https://api.github.com/projects/columns/12345",
    "project_url": "https://api.github.com/projects/1",
    "name": "To do",
    "created_at": "2023-05-07T12:00:00Z",
    "updated_at": "2023-05-07T12:00:00Z"
  },
  {
    "id": 67890,
    "url": "https://api.github.com/projects/columns/67890",
    "project_url": "https://api.github.com/projects/1",
    "name": "In progress",
    "created_at": "2023-05-07T12:00:00Z",
    "updated_at": "2023-05-07T12:00:00Z"
  }
]
```

この例では、2つのカラムがあります。カラムの名前とIDが表示されています。これらのIDを使って、GitHub ActionsでIssueやPull Requestを自動的に紐づけることができます。

---

## 👤 User
*2023-05-07 20:32:14*

gh_token=${{ secrets.GITHUB_TOKEN }} のところなんだけど、ちょっとわからないのでおしえてほしい

---

## 🤖 Assistant
*2023-05-07 20:32:52*

`gh_token=${{ secrets.GITHUB_TOKEN }}` という記述は、GitHub Actionsが実行される際に、リポジトリにアクセスするために使用される特別なトークンを設定しています。

GitHub Actionsは、リポジトリに対して一定の権限を持ち、自動化されたタスクを実行するために使われます。このトークンは、GitHubによって自動的に生成され、アクションが実行されるたびに、一時的なものとして提供されます。これにより、リポジトリの認証や権限管理が簡単になります。

`secrets.GITHUB_TOKEN` は、GitHubが提供する秘密情報の一種で、GitHub Actionsの中で利用できます。`secrets` は、リポジトリの設定から追加・管理できる機密情報を保管するための仕組みです。これらの秘密情報は、GitHub Actionsのワークフローの中で、`${{ secrets.SECRET_NAME }}` のような構文で参照できます。

このコードの例では、`gh_token=${{ secrets.GITHUB_TOKEN }}` として、一時的なGitHubトークンを `gh_token` という環境変数に設定しています。この `gh_token` は、後で `curl` コマンドでAPIリクエストの認証に使用されます。

---

## 👤 User
*2023-05-07 20:34:11*

このGitHubトークンの作成の仕方を教えて。

---

## 🤖 Assistant
*2023-05-07 20:35:06*

`GITHUB_TOKEN` は、GitHub Actionsの実行時に自動的に生成される特別なトークンであり、手動で作成する必要はありません。GitHub Actionsが実行されると、リポジトリに対する一定の権限を持つこのトークンが自動的に提供されます。

ただし、もし手動でPersonal Access Tokenを作成して、GitHub APIを使って操作を行いたい場合は、以下の手順で作成できます。

1. GitHubにログインし、右上のアバターをクリックして、ドロップダウンメニューから "Settings" を選択します。
2. 左サイドバーの "Developer settings" をクリックします。
3. "Personal Access Tokens" タブを選択し、右上の "Generate new token" ボタンをクリックします。
4. Tokenの名前を付け、必要なスコープ（権限）を選択します。リポジトリへのアクセスが必要な場合は、"repo" スコープを選択してください。他にも、必要に応じてスコープを追加できます。
5. 最後に "Generate token" ボタンをクリックして、新しいPersonal Access Tokenが生成されます。このトークンは、表示されるのはこの時だけなので、安全な場所にコピーして保存しておいてください。

GitHub Actionsのワークフローでこの手動で作成したPersonal Access Tokenを使用する場合は、リポジトリの "Secrets" に追加して、`${{ secrets.SECRET_NAME }}` のような構文で参照できるようにします。ただし、GitHub Actionsであれば、通常は自動生成される `GITHUB_TOKEN` を使用することが推奨されます。

---

## 👤 User
*2023-05-07 20:36:25*

さっきのカラムIDを取得した際にPersonal Access Tokenを使用するように言われたけど、そうせずに取得できる方法ってないの？

---

## 🤖 Assistant
*2023-05-07 20:36:48*

申し訳ありませんが、カラムIDを取得するためにはGitHub APIを使用する必要があり、APIを使用するためには認証のためのトークンが必要です。そのため、Personal Access Tokenを使用せずにカラムIDを取得することはできません。

ただし、一度カラムIDを取得すれば、その後はそれを使い続けることができます。カラムIDは、プロジェクトのカラムが変更されない限り、固定の値です。そのため、一度Personal Access Tokenを使ってカラムIDを取得し、それをGitHub Actionsの設定ファイルに記載すれば、その後はPersonal Access Tokenを使用しなくてもGitHub Actionsが正常に動作します。

---

## 👤 User
*2023-05-07 20:37:11*

カラムを追加したり削除したりしても既存のカラムIDは変わらないですか？

---

## 🤖 Assistant
*2023-05-07 20:37:35*

既存のカラムが削除されたり、新しいカラムが追加されたりしても、その他のカラムのIDは変わりません。ただし、もしカラム自体を削除した場合、そのカラムIDは無効になります。新しいカラムを追加した場合、そのカラムには新しいカラムIDが割り当てられます。

GitHub Actionsの設定ファイルに記載されたカラムIDが正しいことを確認するためには、カラムが追加・削除されるたびにGitHub APIを使ってカラムIDを確認することが望ましいです。ただし、通常はカラムが頻繁に変更されることは少ないため、一度カラムIDを取得すればしばらくはそのまま使えることが多いです。

---

## 👤 User
*2023-05-07 20:45:26*

組織でのPersonal Access Tokenの発行するときはどうすればいいの？

---

## 🤖 Assistant
*2023-05-07 20:46:07*

組織でPersonal Access Tokenを発行する場合でも、個人アカウントでPersonal Access Tokenを発行するのと同様に行います。ただし、組織に関連するリポジトリや情報にアクセスするには、あなたのアカウントがその組織に所属していて、適切な権限があることが必要です。

以下の手順でPersonal Access Tokenを作成します。

1. GitHubにログインし、右上のアバターをクリックして、ドロップダウンメニューから "Settings" を選択します。
2. 左サイドバーの "Developer settings" をクリックします。
3. "Personal Access Tokens" タブを選択し、右上の "Generate new token" ボタンをクリックします。
4. Tokenの名前を付け、必要なスコープ（権限）を選択します。組織のリポジトリへのアクセスが必要な場合は、"repo" スコープを選択してください。他にも、必要に応じてスコープを追加できます。
5. 最後に "Generate token" ボタンをクリックして、新しいPersonal Access Tokenが生成されます。このトークンは、表示されるのはこの時だけなので、安全な場所にコピーして保存しておいてください。

このPersonal Access Tokenを使用して、組織のリポジトリや情報にアクセスできます。ただし、アクセスできる範囲は、あなたのアカウントが持っている組織内の権限によって決まります。

---

## 👤 User
*2023-05-07 20:47:23*

さきほどのカラムIDを取得するときのPersonal Access Tokenの発行は個人のアカウント内で発行したPersonal Access Tokenでも問題ないのかな？それても組織のPersonal Access Tokenを作る必要があるのかな？

---

## 🤖 Assistant
*2023-05-07 20:48:00*

組織のプロジェクトにアクセスするには、あなたのアカウントが組織に所属し、適切な権限を持っている必要があります。個人のアカウントで発行したPersonal Access Tokenを使用して、組織のリポジトリやプロジェクトにアクセスできるかどうかは、あなたのアカウントが持っている組織内の権限によって決まります。

もし、あなたのアカウントが組織内で適切な権限を持っている場合、個人のアカウントで発行したPersonal Access Tokenでも組織のリポジトリやプロジェクトにアクセスすることができます。そのため、特別な組織のPersonal Access Tokenを作成する必要はありません。

Personal Access Tokenを発行する際に、必要なスコープ（権限）を選択し、"repo" スコープを含めることで、組織のリポジトリへのアクセスが可能になります。ただし、このときもあなたのアカウントが持っている組織内の権限に従います。

---

## 👤 User
*2023-05-07 21:18:21*

なるほどありがとう。

yamlファイルについて、issueについてのworkflowはわかったけどpull requestについてもどうやって書けばいいか教えて欲しい

---

## 🤖 Assistant
*2023-05-07 21:19:34*

もちろんです！Issueと同様に、Pull Requestのイベントに対してGitHub Actionsのワークフローをトリガーすることができます。以下は、Pull Requestが作成されたときに、特定のプロジェクトカラムに自動的にカードを追加するワークフローの例です。この例では、`COLUMN_ID` を取得したカラムIDに置き換えてください。

```yaml
name: Add Pull Request to Project Column

on:
  pull_request:
    types: [opened]

jobs:
  add_pull_request_to_project_column:
    runs-on: ubuntu-latest
    steps:
      - name: Add Pull Request to Project Column
        env:
          COLUMN_ID: your_column_id
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          PR_ID=$(jq --raw-output .number "$GITHUB_EVENT_PATH")
          PR_URL="https://github.com/$GITHUB_REPOSITORY/pull/$PR_ID"
          
          curl -X POST -H "Accept: application/vnd.github+json" \
               -H "Authorization: token $GITHUB_TOKEN" \
               https://api.github.com/projects/columns/$COLUMN_ID/cards \
               -d '{"content_type":"PullRequest","content_id":'$PR_ID'}'
```

このワークフローは、Pull Requestがオープンされたときにトリガーされます。ワークフローが実行されると、指定されたプロジェクトカラムにPull Requestをカードとして追加します。`on` セクションで `pull_request` イベントを指定し、`types` に `opened` を指定することで、Pull Requestがオープンされたときにトリガーされるように設定しています。

このワークフローを実装するには、リポジトリの `.github/workflows` ディレクトリに新しいYAMLファイル（例えば `add_pull_request_to_project_column.yml`）を作成し、上記のコードを追加してください。ファイルをコミットし、リポジトリにプッシュすると、ワークフローが有効になります。

---
