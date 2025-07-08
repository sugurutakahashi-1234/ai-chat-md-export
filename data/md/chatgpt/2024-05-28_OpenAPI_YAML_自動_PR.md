# OpenAPI YAML 自動 PR

日付: 2024-05-28

---

## 👤 ユーザー
*2024/05/28 18:12:58*

サーバーサイドのopen api yaml の更新をトリガーに別リポジトリでcode gen してPr作成 をGitHub Actionsでしたい

---

## 🤖 アシスタント
*2024/05/28 18:13:28*

サーバーサイドのOpenAPI YAMLの更新をトリガーに別リポジトリでコード生成し、PRを作成するGitHub Actionsのワークフローを以下のように設定できます。これには、OpenAPI YAMLの変更を検知するためのサーバーサイドリポジトリのワークフローと、コード生成とPR作成を行うクライアントサイドリポジトリのワークフローが必要です。

### サーバーサイドリポジトリのワークフロー
このワークフローは、OpenAPI YAMLファイルの変更を検知し、クライアントサイドリポジトリのワークフローをトリガーします。

```yaml
name: Trigger Code Generation

on:
  push:
    paths:
      - 'path/to/openapi.yaml'

jobs:
  trigger-codegen:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger client repo workflow
        uses: peter-evans/repository-dispatch@v1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          repository: client-repo-owner/client-repo-name
          event-type: openapi-update
          client-payload: '{"ref": "${{ github.ref }}"}'
```

### クライアントサイドリポジトリのワークフロー
このワークフローは、サーバーサイドリポジトリのトリガーにより実行され、コードを生成してPRを作成します。

```yaml
name: Code Generation and PR Creation

on:
  repository_dispatch:
    types: [openapi-update]

jobs:
  codegen:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout client repo
      uses: actions/checkout@v2

    - name: Checkout server repo
      uses: actions/checkout@v2
      with:
        repository: server-repo-owner/server-repo-name
        path: server-repo
        ref: ${{ github.event.client_payload.ref }}
        token: ${{ secrets.GITHUB_TOKEN }}

    - name: Generate code from OpenAPI spec
      run: |
        mkdir generated-code
        openapi-generator-cli generate -i server-repo/path/to/openapi.yaml -g swift5 -o generated-code

    - name: Commit and push changes
      run: |
        git config --global user.name 'github-actions[bot]'
        git config --global user.email '41898282+github-actions[bot]@users.noreply.github.com'
        git add generated-code
        git commit -m "Update generated code from OpenAPI spec"
        git push origin HEAD

    - name: Create Pull Request
      uses: peter-evans/create-pull-request@v3
      with:
        token: ${{ secrets.GITHUB_TOKEN }}
        commit-message: Update generated code from OpenAPI spec
        branch: auto-generated-code
        title: "Update generated code from OpenAPI spec"
        body: "This PR updates the generated code from the latest OpenAPI spec."
        labels: "generated-code"
```

### セットアップ手順

1. サーバーサイドリポジトリに最初のワークフローを追加します。
2. クライアントサイドリポジトリに二番目のワークフローを追加します。
3. `repository-dispatch`と`create-pull-request`アクションを使うために、`GITHUB_TOKEN`をそれぞれのリポジトリのシークレットとして設定します。

これにより、サーバーサイドリポジトリのOpenAPI YAMLが変更されるたびに、自動的にクライアントサイドリポジトリでコード生成が行われ、PRが作成されます。

---

## 👤 ユーザー
*2024/05/28 18:17:51*

privateなリポジトリでも動くのかな？ 同じ組織ではあります

---

## 🤖 アシスタント
*2024/05/28 18:18:27*

はい、同じ組織内のプライベートリポジトリでも動作します。以下の点に注意して設定を行えば、問題なく動作するはずです。

### 注意点

1. **GitHub Tokenの設定**：
   - `GITHUB_TOKEN`はデフォルトでGitHub Actionsの各ジョブに提供されます。このトークンは、リポジトリへの読み書き権限を持ち、他のプライベートリポジトリへのアクセスも許可されていますが、特定の権限が必要な場合があります。
   - 必要に応じて、パーソナルアクセストークン（PAT）を作成し、リポジトリシークレットとして設定することもできます。これにより、リポジトリ間のアクセスを明示的に許可することができます。

2. **リポジトリディスパッチイベント**：
   - `repository_dispatch`イベントをトリガーするには、`repository-dispatch`アクションを使用します。このアクションは、リポジトリ間でイベントを送信するために必要です。
   - トリガーされるリポジトリ（クライアントサイドリポジトリ）に、`repository_dispatch`イベントに対応するワークフローが正しく設定されていることを確認してください。

3. **パーミッション設定**：
   - クライアントサイドリポジトリのワークフローが、サーバーサイドリポジトリにアクセスするための適切な権限を持っていることを確認してください。

以下の手順に従って設定を行います。

### パーソナルアクセストークン（PAT）の設定

1. GitHubの設定ページから新しいパーソナルアクセストークン（PAT）を作成します。必要なスコープとして、`repo`（全リポジトリへの完全アクセス）を選択します。
2. 作成したPATをクライアントサイドリポジトリとサーバーサイドリポジトリのシークレットとして追加します。シークレット名は例えば`PAT`とします。

### サーバーサイドリポジトリのワークフロー

```yaml
name: Trigger Code Generation

on:
  push:
    paths:
      - 'path/to/openapi.yaml'

jobs:
  trigger-codegen:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger client repo workflow
        uses: peter-evans/repository-dispatch@v1
        with:
          token: ${{ secrets.PAT }}
          repository: client-repo-owner/client-repo-name
          event-type: openapi-update
          client-payload: '{"ref": "${{ github.ref }}"}'
```

### クライアントサイドリポジトリのワークフロー

```yaml
name: Code Generation and PR Creation

on:
  repository_dispatch:
    types: [openapi-update]

jobs:
  codegen:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout client repo
      uses: actions/checkout@v2

    - name: Checkout server repo
      uses: actions/checkout@v2
      with:
        repository: server-repo-owner/server-repo-name
        path: server-repo
        ref: ${{ github.event.client_payload.ref }}
        token: ${{ secrets.PAT }}

    - name: Generate code from OpenAPI spec
      run: |
        mkdir generated-code
        openapi-generator-cli generate -i server-repo/path/to/openapi.yaml -g swift5 -o generated-code

    - name: Commit and push changes
      run: |
        git config --global user.name 'github-actions[bot]'
        git config --global user.email '41898282+github-actions[bot]@users.noreply.github.com'
        git add generated-code
        git commit -m "Update generated code from OpenAPI spec"
        git push origin HEAD

    - name: Create Pull Request
      uses: peter-evans/create-pull-request@v3
      with:
        token: ${{ secrets.PAT }}
        commit-message: Update generated code from OpenAPI spec
        branch: auto-generated-code
        title: "Update generated code from OpenAPI spec"
        body: "This PR updates the generated code from the latest OpenAPI spec."
        labels: "generated-code"
```

このように設定することで、同じ組織内のプライベートリポジトリ間でも、OpenAPI YAMLの変更をトリガーにコード生成とPR作成が自動で行われます。

---

## 👤 ユーザー
*2024/05/28 18:19:33*

name: Code Generation and PR Creation
はどのブランチで実施されるのか？

---

## 🤖 アシスタント
*2024/05/28 18:20:07*

`name: Code Generation and PR Creation`ワークフローが実行されるブランチは、トリガーされたときのリポジトリのデフォルトブランチ（通常は`main`や`master`）で実行されます。

具体的には、`repository_dispatch`イベントがトリガーされたときに、以下のような手順でブランチが決定されます：

1. **`actions/checkout`アクション**：
   - `actions/checkout@v2`アクションが使用されている場合、このアクションはデフォルトでリポジトリのデフォルトブランチをチェックアウトします。

2. **`client-payload`の`ref`**：
   - サーバーサイドリポジトリのワークフローでトリガーしたときに、`client-payload`として`ref`（リファレンス、ブランチ名）を送信している場合、そのブランチがチェックアウトされます。

以下のように明示的にブランチを指定することもできます：

### サーバーサイドリポジトリのワークフローの変更（特定のブランチをトリガー）

もし、特定のブランチをトリガーとして設定したい場合、以下のように`ref`を明示的に指定します。

```yaml
name: Trigger Code Generation

on:
  push:
    paths:
      - 'path/to/openapi.yaml'

jobs:
  trigger-codegen:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger client repo workflow
        uses: peter-evans/repository-dispatch@v1
        with:
          token: ${{ secrets.PAT }}
          repository: client-repo-owner/client-repo-name
          event-type: openapi-update
          client-payload: '{"ref": "refs/heads/branch-name"}'
```

### クライアントサイドリポジトリのワークフローの変更（特定のブランチをチェックアウト）

クライアントサイドリポジトリで特定のブランチをチェックアウトしてから作業を行うようにします。

```yaml
name: Code Generation and PR Creation

on:
  repository_dispatch:
    types: [openapi-update]

jobs:
  codegen:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout client repo
      uses: actions/checkout@v2
      with:
        ref: 'branch-name' # 特定のブランチをチェックアウト

    - name: Checkout server repo
      uses: actions/checkout@v2
      with:
        repository: server-repo-owner/server-repo-name
        path: server-repo
        ref: ${{ github.event.client_payload.ref }}
        token: ${{ secrets.PAT }}

    - name: Generate code from OpenAPI spec
      run: |
        mkdir generated-code
        openapi-generator-cli generate -i server-repo/path/to/openapi.yaml -g swift5 -o generated-code

    - name: Commit and push changes
      run: |
        git config --global user.name 'github-actions[bot]'
        git config --global user.email '41898282+github-actions[bot]@users.noreply.github.com'
        git add generated-code
        git commit -m "Update generated code from OpenAPI spec"
        git push origin HEAD

    - name: Create Pull Request
      uses: peter-evans/create-pull-request@v3
      with:
        token: ${{ secrets.PAT }}
        commit-message: Update generated code from OpenAPI spec
        branch: auto-generated-code
        title: "Update generated code from OpenAPI spec"
        body: "This PR updates the generated code from the latest OpenAPI spec."
        labels: "generated-code"
```

上記の設定により、指定されたブランチでワークフローが実行されます。クライアントサイドリポジトリの`actions/checkout`ステップで`ref`を指定することで、特定のブランチをチェックアウトすることができます。

---

## 👤 ユーザー
*2024/05/28 18:22:49*

手順を少し変えて欲しくて、サーバーサイドの openapi.yamlを クライアントサイドのopenapi.yamlに上書きして欲しくて、そうしてからコード生成してほしい

---

## 🤖 アシスタント
*2024/05/28 18:23:17*

サーバーサイドのOpenAPI YAMLファイルをクライアントサイドのリポジトリにコピーし、それを基にコード生成を行う手順に変更します。

### サーバーサイドリポジトリのワークフロー
これは変更ありません。

### クライアントサイドリポジトリのワークフロー

以下のワークフローでは、サーバーサイドリポジトリのOpenAPI YAMLファイルをクライアントサイドリポジトリの指定パスにコピーし、それを基にコード生成を行います。

```yaml
name: Code Generation and PR Creation

on:
  repository_dispatch:
    types: [openapi-update]

jobs:
  codegen:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout client repo
      uses: actions/checkout@v2

    - name: Checkout server repo
      uses: actions/checkout@v2
      with:
        repository: server-repo-owner/server-repo-name
        path: server-repo
        ref: ${{ github.event.client_payload.ref }}
        token: ${{ secrets.PAT }}

    - name: Copy OpenAPI spec
      run: |
        cp server-repo/path/to/openapi.yaml path/to/client/openapi.yaml

    - name: Generate code from OpenAPI spec
      run: |
        mkdir -p generated-code
        openapi-generator-cli generate -i path/to/client/openapi.yaml -g swift5 -o generated-code

    - name: Commit and push changes
      run: |
        git config --global user.name 'github-actions[bot]'
        git config --global user.email '41898282+github-actions[bot]@users.noreply.github.com'
        git add path/to/client/openapi.yaml generated-code
        git commit -m "Update generated code from OpenAPI spec"
        git push origin HEAD

    - name: Create Pull Request
      uses: peter-evans/create-pull-request@v3
      with:
        token: ${{ secrets.PAT }}
        commit-message: Update generated code from OpenAPI spec
        branch: auto-generated-code
        title: "Update generated code from OpenAPI spec"
        body: "This PR updates the generated code from the latest OpenAPI spec."
        labels: "generated-code"
```

### 詳細な手順

1. **`Checkout client repo`**: クライアントサイドリポジトリをチェックアウトします。
2. **`Checkout server repo`**: サーバーサイドリポジトリをチェックアウトし、指定したパスに配置します。
3. **`Copy OpenAPI spec`**: サーバーサイドリポジトリのOpenAPI YAMLファイルをクライアントサイドリポジトリの指定パスにコピーします。
4. **`Generate code from OpenAPI spec`**: クライアントサイドリポジトリ内のOpenAPI YAMLファイルを基にコードを生成します。
5. **`Commit and push changes`**: OpenAPI YAMLファイルと生成されたコードをコミットし、リポジトリにプッシュします。
6. **`Create Pull Request`**: プルリクエストを作成します。

この設定により、サーバーサイドのOpenAPI YAMLファイルがクライアントサイドリポジトリに上書きコピーされ、その後にコード生成が実行されるようになります。

---

## 👤 ユーザー
*2024/05/28 18:26:28*

ちなみにサーバーサイドのmainリポジトリのymalが更新された時にしか動いて欲しくない またそれぞれ手動でも実行できるようにしたい

---

## 🤖 アシスタント
*2024/05/28 18:26:57*

サーバーサイドのmainブランチのOpenAPI YAMLが更新された時にのみ実行されるようにし、手動でも実行できるようにするためには、以下のように設定を変更します。

### サーバーサイドリポジトリのワークフロー
OpenAPI YAMLがmainブランチで更新された場合にのみトリガーします。また、手動実行（workflow_dispatch）にも対応します。

```yaml
name: Trigger Code Generation

on:
  push:
    branches:
      - main
    paths:
      - 'path/to/openapi.yaml'
  workflow_dispatch:

jobs:
  trigger-codegen:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger client repo workflow
        uses: peter-evans/repository-dispatch@v1
        with:
          token: ${{ secrets.PAT }}
          repository: client-repo-owner/client-repo-name
          event-type: openapi-update
          client-payload: '{"ref": "refs/heads/main"}'
```

### クライアントサイドリポジトリのワークフロー
手動実行（workflow_dispatch）にも対応します。

```yaml
name: Code Generation and PR Creation

on:
  repository_dispatch:
    types: [openapi-update]
  workflow_dispatch:

jobs:
  codegen:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout client repo
      uses: actions/checkout@v2

    - name: Checkout server repo
      uses: actions/checkout@v2
      with:
        repository: server-repo-owner/server-repo-name
        path: server-repo
        ref: ${{ github.event.client_payload.ref || 'refs/heads/main' }}
        token: ${{ secrets.PAT }}

    - name: Copy OpenAPI spec
      run: |
        cp server-repo/path/to/openapi.yaml path/to/client/openapi.yaml

    - name: Generate code from OpenAPI spec
      run: |
        mkdir -p generated-code
        openapi-generator-cli generate -i path/to/client/openapi.yaml -g swift5 -o generated-code

    - name: Commit and push changes
      run: |
        git config --global user.name 'github-actions[bot]'
        git config --global user.email '41898282+github-actions[bot]@users.noreply.github.com'
        git add path/to/client/openapi.yaml generated-code
        git commit -m "Update generated code from OpenAPI spec"
        git push origin HEAD

    - name: Create Pull Request
      uses: peter-evans/create-pull-request@v3
      with:
        token: ${{ secrets.PAT }}
        commit-message: Update generated code from OpenAPI spec
        branch: auto-generated-code
        title: "Update generated code from OpenAPI spec"
        body: "This PR updates the generated code from the latest OpenAPI spec."
        labels: "generated-code"
```

### 詳細な手順

1. **サーバーサイドリポジトリのワークフロー**：
   - `push`イベントをmainブランチに対してのみトリガーし、`path/to/openapi.yaml`が変更された場合にのみ実行されます。
   - `workflow_dispatch`を追加して手動実行が可能です。

2. **クライアントサイドリポジトリのワークフロー**：
   - `repository_dispatch`イベントを受け取ると実行されます。
   - `workflow_dispatch`を追加して手動実行が可能です。
   - サーバーサイドリポジトリからmainブランチのOpenAPI YAMLファイルをコピーし、コード生成を行います。

この設定により、サーバーサイドのmainブランチでOpenAPI YAMLが更新されたとき、または手動でワークフローを実行したときに、クライアントサイドリポジトリでコード生成とPR作成が行われるようになります。

---

## 👤 ユーザー
*2024/05/28 21:28:49*

cp コマンドのオプションはあった方がいい気がしている

---

## 🤖 アシスタント
*2024/05/28 21:29:15*

`cp`コマンドにオプションを追加することで、コピー操作の安全性と信頼性を向上させることができます。特に、ファイルの上書きを確認する`-f`オプションや、ディレクトリの再帰的なコピーを行う`-r`オプションなどが役立ちます。以下のように`cp`コマンドにオプションを追加します。

### クライアントサイドリポジトリのワークフロー（修正）

```yaml
name: Code Generation and PR Creation

on:
  repository_dispatch:
    types: [openapi-update]
  workflow_dispatch:

jobs:
  codegen:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout client repo
      uses: actions/checkout@v2

    - name: Checkout server repo
      uses: actions/checkout@v2
      with:
        repository: server-repo-owner/server-repo-name
        path: server-repo
        ref: ${{ github.event.client_payload.ref || 'refs/heads/main' }}
        token: ${{ secrets.PAT }}

    - name: Copy OpenAPI spec
      run: |
        cp -f server-repo/path/to/openapi.yaml path/to/client/openapi.yaml

    - name: Generate code from OpenAPI spec
      run: |
        mkdir -p generated-code
        openapi-generator-cli generate -i path/to/client/openapi.yaml -g swift5 -o generated-code

    - name: Commit and push changes
      run: |
        git config --global user.name 'github-actions[bot]'
        git config --global user.email '41898282+github-actions[bot]@users.noreply.github.com'
        git add path/to/client/openapi.yaml generated-code
        git commit -m "Update generated code from OpenAPI spec"
        git push origin HEAD

    - name: Create Pull Request
      uses: peter-evans/create-pull-request@v3
      with:
        token: ${{ secrets.PAT }}
        commit-message: Update generated code from OpenAPI spec
        branch: auto-generated-code
        title: "Update generated code from OpenAPI spec"
        body: "This PR updates the generated code from the latest OpenAPI spec."
        labels: "generated-code"
```

### 詳細な手順

1. **`cp`コマンドのオプション**：
   - `-f`オプション：コピー先のファイルが存在する場合に強制的に上書きします。
   - 必要に応じて他のオプション（例えば`-r`）も追加できますが、ここでは単一のファイルのコピーのため不要としています。

これにより、OpenAPI YAMLファイルのコピー操作がより安全に実行され、必要な場合にはファイルが強制的に上書きされます。この設定を使用することで、サーバーサイドのOpenAPI YAMLファイルがクライアントサイドリポジトリに確実にコピーされ、その後のコード生成プロセスが正常に進行します。

---

## 👤 ユーザー
*2024/05/28 21:29:57*

デバッグした時に追いやすいように軽くログを出力してほしい

---

## 🤖 アシスタント
*2024/05/28 21:30:36*

デバッグ用のログを出力するために、各ステップで`echo`コマンドを使用してメッセージを出力します。これにより、ワークフローがどこまで進行したかを簡単に追跡できます。

以下は、デバッグ用のログ出力を追加したクライアントサイドリポジトリのワークフローです：

```yaml
name: Code Generation and PR Creation

on:
  repository_dispatch:
    types: [openapi-update]
  workflow_dispatch:

jobs:
  codegen:
    runs-on: ubuntu-latest

    steps:
    - name: Log start of workflow
      run: echo "Starting Code Generation and PR Creation workflow"

    - name: Checkout client repo
      uses: actions/checkout@v2
      with:
        path: client-repo

    - name: Log client repo checked out
      run: echo "Client repository checked out"

    - name: Checkout server repo
      uses: actions/checkout@v2
      with:
        repository: server-repo-owner/server-repo-name
        path: server-repo
        ref: ${{ github.event.client_payload.ref || 'refs/heads/main' }}
        token: ${{ secrets.PAT }}

    - name: Log server repo checked out
      run: echo "Server repository checked out"

    - name: Copy OpenAPI spec
      run: |
        echo "Copying OpenAPI spec from server repository to client repository"
        cp -f server-repo/path/to/openapi.yaml client-repo/path/to/openapi.yaml

    - name: Log OpenAPI spec copied
      run: echo "OpenAPI spec copied to client repository"

    - name: Generate code from OpenAPI spec
      run: |
        echo "Generating code from OpenAPI spec"
        mkdir -p generated-code
        openapi-generator-cli generate -i client-repo/path/to/openapi.yaml -g swift5 -o generated-code

    - name: Log code generation completed
      run: echo "Code generation completed"

    - name: Commit and push changes
      run: |
        echo "Committing and pushing changes"
        git config --global user.name 'github-actions[bot]'
        git config --global user.email '41898282+github-actions[bot]@users.noreply.github.com'
        git add client-repo/path/to/openapi.yaml generated-code
        git commit -m "Update generated code from OpenAPI spec"
        git push origin HEAD

    - name: Log changes pushed
      run: echo "Changes committed and pushed to repository"

    - name: Create Pull Request
      uses: peter-evans/create-pull-request@v3
      with:
        token: ${{ secrets.PAT }}
        commit-message: Update generated code from OpenAPI spec
        branch: auto-generated-code
        title: "Update generated code from OpenAPI spec"
        body: "This PR updates the generated code from the latest OpenAPI spec."
        labels: "generated-code"

    - name: Log PR creation completed
      run: echo "Pull Request created"
```

### 各ステップの詳細

1. **Log start of workflow**：ワークフローの開始をログ出力。
2. **Checkout client repo**：クライアントサイドリポジトリのチェックアウト。
3. **Log client repo checked out**：クライアントサイドリポジトリがチェックアウトされたことをログ出力。
4. **Checkout server repo**：サーバーサイドリポジトリのチェックアウト。
5. **Log server repo checked out**：サーバーサイドリポジトリがチェックアウトされたことをログ出力。
6. **Copy OpenAPI spec**：OpenAPI YAMLファイルをコピー。
7. **Log OpenAPI spec copied**：OpenAPI YAMLファイルがコピーされたことをログ出力。
8. **Generate code from OpenAPI spec**：OpenAPI YAMLファイルからコードを生成。
9. **Log code generation completed**：コード生成が完了したことをログ出力。
10. **Commit and push changes**：変更をコミットしてリポジトリにプッシュ。
11. **Log changes pushed**：変更がプッシュされたことをログ出力。
12. **Create Pull Request**：プルリクエストを作成。
13. **Log PR creation completed**：プルリクエストが作成されたことをログ出力。

これにより、各ステップの進行状況がログに記録され、デバッグ時に容易に追跡できるようになります。

---

## 👤 ユーザー
*2024/05/28 21:31:48*

そういうログは不要でファイルの中身だったりdiffだったりデバッグするのに使えそうな変数関係だったりを出力してほしい

---

## 🤖 アシスタント
*2024/05/28 21:32:31*

デバッグに役立つファイルの内容や差分、変数の値などを出力するようにワークフローを修正します。

以下は、必要な情報をログに出力するために修正したクライアントサイドリポジトリのワークフローです：

```yaml
name: Code Generation and PR Creation

on:
  repository_dispatch:
    types: [openapi-update]
  workflow_dispatch:

jobs:
  codegen:
    runs-on: ubuntu-latest

    steps:
    - name: Log start of workflow
      run: echo "Starting Code Generation and PR Creation workflow"

    - name: Checkout client repo
      uses: actions/checkout@v2
      with:
        path: client-repo

    - name: Log client repo checked out
      run: |
        echo "Client repository checked out"
        ls -l client-repo/path/to/openapi.yaml || echo "Client OpenAPI spec not found"

    - name: Checkout server repo
      uses: actions/checkout@v2
      with:
        repository: server-repo-owner/server-repo-name
        path: server-repo
        ref: ${{ github.event.client_payload.ref || 'refs/heads/main' }}
        token: ${{ secrets.PAT }}

    - name: Log server repo checked out
      run: |
        echo "Server repository checked out"
        ls -l server-repo/path/to/openapi.yaml || echo "Server OpenAPI spec not found"

    - name: Output server OpenAPI spec
      run: |
        echo "Server OpenAPI spec content:"
        cat server-repo/path/to/openapi.yaml

    - name: Copy OpenAPI spec
      run: |
        echo "Copying OpenAPI spec from server repository to client repository"
        cp -f server-repo/path/to/openapi.yaml client-repo/path/to/openapi.yaml

    - name: Log OpenAPI spec copied
      run: |
        echo "OpenAPI spec copied to client repository"
        ls -l client-repo/path/to/openapi.yaml
        echo "Client OpenAPI spec content after copy:"
        cat client-repo/path/to/openapi.yaml

    - name: Show diff of OpenAPI spec
      run: |
        echo "Showing diff of OpenAPI spec"
        diff server-repo/path/to/openapi.yaml client-repo/path/to/openapi.yaml || echo "No differences found"

    - name: Generate code from OpenAPI spec
      run: |
        echo "Generating code from OpenAPI spec"
        mkdir -p generated-code
        openapi-generator-cli generate -i client-repo/path/to/openapi.yaml -g swift5 -o generated-code
        echo "Generated code files:"
        ls -l generated-code

    - name: Commit and push changes
      run: |
        echo "Committing and pushing changes"
        git config --global user.name 'github-actions[bot]'
        git config --global user.email '41898282+github-actions[bot]@users.noreply.github.com'
        git add client-repo/path/to/openapi.yaml generated-code
        git commit -m "Update generated code from OpenAPI spec"
        git push origin HEAD

    - name: Log changes pushed
      run: echo "Changes committed and pushed to repository"

    - name: Create Pull Request
      uses: peter-evans/create-pull-request@v3
      with:
        token: ${{ secrets.PAT }}
        commit-message: Update generated code from OpenAPI spec
        branch: auto-generated-code
        title: "Update generated code from OpenAPI spec"
        body: "This PR updates the generated code from the latest OpenAPI spec."
        labels: "generated-code"

    - name: Log PR creation completed
      run: echo "Pull Request created"
```

### 詳細な手順

1. **ファイルの存在確認とリスト表示**：
   - クライアントサイドとサーバーサイドのOpenAPI specファイルの存在確認とリスト表示。
   - ファイルが存在しない場合はエラーメッセージを表示。

2. **ファイルの内容出力**：
   - サーバーサイドのOpenAPI specファイルの内容を出力。

3. **ファイルのコピー**：
   - `cp`コマンドでファイルをコピーし、その後クライアントサイドのOpenAPI specファイルの内容を出力。

4. **差分の表示**：
   - `diff`コマンドでサーバーサイドとクライアントサイドのOpenAPI specファイルの差分を表示。

5. **生成されたコードのリスト表示**：
   - コード生成後、生成されたコードのファイルリストを表示。

これにより、各ステップでファイルの内容や差分、生成されたコードのファイルリストを確認でき、デバッグが容易になります。

---

## 👤 ユーザー
*2024/05/28 21:34:08*

クライアントとサーバーサイドのopenapi.ymlのパスはよく使うので変数にして欲しい

---

## 🤖 アシスタント
*2024/05/28 21:34:49*

クライアントとサーバーサイドのOpenAPI YAMLのパスを変数にすることで、ワークフローの可読性を向上させ、変更が容易になります。以下はその変更を加えたワークフローです：

```yaml
name: Code Generation and PR Creation

on:
  repository_dispatch:
    types: [openapi-update]
  workflow_dispatch:

jobs:
  codegen:
    runs-on: ubuntu-latest

    env:
      CLIENT_OPENAPI_PATH: client-repo/path/to/openapi.yaml
      SERVER_OPENAPI_PATH: server-repo/path/to/openapi.yaml

    steps:
    - name: Log start of workflow
      run: echo "Starting Code Generation and PR Creation workflow"

    - name: Checkout client repo
      uses: actions/checkout@v2
      with:
        path: client-repo

    - name: Log client repo checked out
      run: |
        echo "Client repository checked out"
        ls -l $CLIENT_OPENAPI_PATH || echo "Client OpenAPI spec not found"

    - name: Checkout server repo
      uses: actions/checkout@v2
      with:
        repository: server-repo-owner/server-repo-name
        path: server-repo
        ref: ${{ github.event.client_payload.ref || 'refs/heads/main' }}
        token: ${{ secrets.PAT }}

    - name: Log server repo checked out
      run: |
        echo "Server repository checked out"
        ls -l $SERVER_OPENAPI_PATH || echo "Server OpenAPI spec not found"

    - name: Output server OpenAPI spec
      run: |
        echo "Server OpenAPI spec content:"
        cat $SERVER_OPENAPI_PATH

    - name: Copy OpenAPI spec
      run: |
        echo "Copying OpenAPI spec from server repository to client repository"
        cp -f $SERVER_OPENAPI_PATH $CLIENT_OPENAPI_PATH

    - name: Log OpenAPI spec copied
      run: |
        echo "OpenAPI spec copied to client repository"
        ls -l $CLIENT_OPENAPI_PATH
        echo "Client OpenAPI spec content after copy:"
        cat $CLIENT_OPENAPI_PATH

    - name: Show diff of OpenAPI spec
      run: |
        echo "Showing diff of OpenAPI spec"
        diff $SERVER_OPENAPI_PATH $CLIENT_OPENAPI_PATH || echo "No differences found"

    - name: Generate code from OpenAPI spec
      run: |
        echo "Generating code from OpenAPI spec"
        mkdir -p generated-code
        openapi-generator-cli generate -i $CLIENT_OPENAPI_PATH -g swift5 -o generated-code
        echo "Generated code files:"
        ls -l generated-code

    - name: Commit and push changes
      run: |
        echo "Committing and pushing changes"
        git config --global user.name 'github-actions[bot]'
        git config --global user.email '41898282+github-actions[bot]@users.noreply.github.com'
        git add $CLIENT_OPENAPI_PATH generated-code
        git commit -m "Update generated code from OpenAPI spec"
        git push origin HEAD

    - name: Log changes pushed
      run: echo "Changes committed and pushed to repository"

    - name: Create Pull Request
      uses: peter-evans/create-pull-request@v3
      with:
        token: ${{ secrets.PAT }}
        commit-message: Update generated code from OpenAPI spec
        branch: auto-generated-code
        title: "Update generated code from OpenAPI spec"
        body: "This PR updates the generated code from the latest OpenAPI spec."
        labels: "generated-code"

    - name: Log PR creation completed
      run: echo "Pull Request created"
```

### 変更点の詳細

1. **`env`セクションの追加**：
   - `CLIENT_OPENAPI_PATH`および`SERVER_OPENAPI_PATH`という環境変数を設定し、クライアントとサーバーのOpenAPI YAMLファイルのパスをそれぞれ指定。

2. **環境変数の使用**：
   - 各ステップでこれらの環境変数を使用して、ファイルパスを参照するように変更。

これにより、ファイルパスを一箇所で管理でき、将来的にパスが変更になった場合にも簡単に対応できます。

---

## 👤 ユーザー
*2024/05/30 17:52:00*

以下の環境変数を使って書き直してほしい。

name: API Request Code Gen

on:
  repository_dispatch:
    types: [openapi-update]
  workflow_dispatch:

env:
  # iOS
  ios_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  ios_openapi_path: suguruTakahashi-1234/swift-openapi-gen-sample/schema/openapi.yaml
  # Server Side
  server_side_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  server_side_openapi_path: suguruTakahashi-1234/swift-openapi-gen-sample/server-side-repository/openapi.yaml

---

## 🤖 アシスタント
*2024/05/30 17:52:35*

指定された環境変数を使用してワークフローを書き直しました。以下はその内容です：

```yaml
name: API Request Code Gen

on:
  repository_dispatch:
    types: [openapi-update]
  workflow_dispatch:

env:
  # iOS
  ios_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  ios_openapi_path: schema/openapi.yaml
  # Server Side
  server_side_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  server_side_openapi_path: server-side-repository/openapi.yaml

jobs:
  codegen:
    runs-on: ubuntu-latest

    steps:
    - name: Log start of workflow
      run: echo "Starting Code Generation and PR Creation workflow"

    - name: Checkout client repo
      uses: actions/checkout@v2
      with:
        repository: ${{ env.ios_repo }}
        path: client-repo

    - name: Log client repo checked out
      run: |
        echo "Client repository checked out"
        ls -l client-repo/${{ env.ios_openapi_path }} || echo "Client OpenAPI spec not found"

    - name: Checkout server repo
      uses: actions/checkout@v2
      with:
        repository: ${{ env.server_side_repo }}
        path: server-repo
        ref: ${{ github.event.client_payload.ref || 'refs/heads/main' }}
        token: ${{ secrets.PAT }}

    - name: Log server repo checked out
      run: |
        echo "Server repository checked out"
        ls -l server-repo/${{ env.server_side_openapi_path }} || echo "Server OpenAPI spec not found"

    - name: Output server OpenAPI spec
      run: |
        echo "Server OpenAPI spec content:"
        cat server-repo/${{ env.server_side_openapi_path }}

    - name: Copy OpenAPI spec
      run: |
        echo "Copying OpenAPI spec from server repository to client repository"
        cp -f server-repo/${{ env.server_side_openapi_path }} client-repo/${{ env.ios_openapi_path }}

    - name: Log OpenAPI spec copied
      run: |
        echo "OpenAPI spec copied to client repository"
        ls -l client-repo/${{ env.ios_openapi_path }}
        echo "Client OpenAPI spec content after copy:"
        cat client-repo/${{ env.ios_openapi_path }}

    - name: Show diff of OpenAPI spec
      run: |
        echo "Showing diff of OpenAPI spec"
        diff server-repo/${{ env.server_side_openapi_path }} client-repo/${{ env.ios_openapi_path }} || echo "No differences found"

    - name: Generate code from OpenAPI spec
      run: |
        echo "Generating code from OpenAPI spec"
        mkdir -p generated-code
        openapi-generator-cli generate -i client-repo/${{ env.ios_openapi_path }} -g swift5 -o generated-code
        echo "Generated code files:"
        ls -l generated-code

    - name: Commit and push changes
      run: |
        echo "Committing and pushing changes"
        git config --global user.name 'github-actions[bot]'
        git config --global user.email '41898282+github-actions[bot]@users.noreply.github.com'
        git add client-repo/${{ env.ios_openapi_path }} generated-code
        git commit -m "Update generated code from OpenAPI spec"
        git push origin HEAD

    - name: Log changes pushed
      run: echo "Changes committed and pushed to repository"

    - name: Create Pull Request
      uses: peter-evans/create-pull-request@v3
      with:
        token: ${{ secrets.PAT }}
        commit-message: Update generated code from OpenAPI spec
        branch: auto-generated-code
        title: "Update generated code from OpenAPI spec"
        body: "This PR updates the generated code from the latest OpenAPI spec."
        labels: "generated-code"

    - name: Log PR creation completed
      run: echo "Pull Request created"
```

### 変更点の詳細

1. **環境変数の設定**：
   - `ios_repo`、`ios_openapi_path`、`server_side_repo`、`server_side_openapi_path`の環境変数を使用して、リポジトリやファイルパスを管理。

2. **環境変数の使用**：
   - 各ステップでこれらの環境変数を使用して、ファイルパスやリポジトリを参照するように変更。

この設定により、ワークフローの可読性が向上し、パスやリポジトリの変更が容易になります。

---

## 👤 ユーザー
*2024/05/30 17:56:19*

prの作成はuses: peter-evans/create-pull-request@v6を使ってほしい。

---

## 🤖 アシスタント
*2024/05/30 17:56:59*

`peter-evans/create-pull-request@v6`を使用してプルリクエストを作成するようにワークフローを修正しました。

以下が修正後のワークフローです：

```yaml
name: API Request Code Gen

on:
  repository_dispatch:
    types: [openapi-update]
  workflow_dispatch:

env:
  # iOS
  ios_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  ios_openapi_path: schema/openapi.yaml
  # Server Side
  server_side_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  server_side_openapi_path: server-side-repository/openapi.yaml

jobs:
  codegen:
    runs-on: ubuntu-latest

    steps:
    - name: Log start of workflow
      run: echo "Starting Code Generation and PR Creation workflow"

    - name: Checkout client repo
      uses: actions/checkout@v2
      with:
        repository: ${{ env.ios_repo }}
        path: client-repo

    - name: Log client repo checked out
      run: |
        echo "Client repository checked out"
        ls -l client-repo/${{ env.ios_openapi_path }} || echo "Client OpenAPI spec not found"

    - name: Checkout server repo
      uses: actions/checkout@v2
      with:
        repository: ${{ env.server_side_repo }}
        path: server-repo
        ref: ${{ github.event.client_payload.ref || 'refs/heads/main' }}
        token: ${{ secrets.PAT }}

    - name: Log server repo checked out
      run: |
        echo "Server repository checked out"
        ls -l server-repo/${{ env.server_side_openapi_path }} || echo "Server OpenAPI spec not found"

    - name: Output server OpenAPI spec
      run: |
        echo "Server OpenAPI spec content:"
        cat server-repo/${{ env.server_side_openapi_path }}

    - name: Copy OpenAPI spec
      run: |
        echo "Copying OpenAPI spec from server repository to client repository"
        cp -f server-repo/${{ env.server_side_openapi_path }} client-repo/${{ env.ios_openapi_path }}

    - name: Log OpenAPI spec copied
      run: |
        echo "OpenAPI spec copied to client repository"
        ls -l client-repo/${{ env.ios_openapi_path }}
        echo "Client OpenAPI spec content after copy:"
        cat client-repo/${{ env.ios_openapi_path }}

    - name: Show diff of OpenAPI spec
      run: |
        echo "Showing diff of OpenAPI spec"
        diff server-repo/${{ env.server_side_openapi_path }} client-repo/${{ env.ios_openapi_path }} || echo "No differences found"

    - name: Generate code from OpenAPI spec
      run: |
        echo "Generating code from OpenAPI spec"
        mkdir -p generated-code
        openapi-generator-cli generate -i client-repo/${{ env.ios_openapi_path }} -g swift5 -o generated-code
        echo "Generated code files:"
        ls -l generated-code

    - name: Commit and push changes
      run: |
        echo "Committing and pushing changes"
        git config --global user.name 'github-actions[bot]'
        git config --global user.email '41898282+github-actions[bot]@users.noreply.github.com'
        git add client-repo/${{ env.ios_openapi_path }} generated-code
        git commit -m "Update generated code from OpenAPI spec"
        git push origin HEAD

    - name: Log changes pushed
      run: echo "Changes committed and pushed to repository"

    - name: Create Pull Request
      uses: peter-evans/create-pull-request@v6
      with:
        token: ${{ secrets.PAT }}
        commit-message: Update generated code from OpenAPI spec
        branch: auto-generated-code
        title: "Update generated code from OpenAPI spec"
        body: "This PR updates the generated code from the latest OpenAPI spec."
        labels: "generated-code"

    - name: Log PR creation completed
      run: echo "Pull Request created"
```

### 変更点の詳細

1. **`peter-evans/create-pull-request@v6`の使用**：
   - `v3`から`v6`に変更し、プルリクエスト作成のための最新バージョンを使用。

2. **その他の設定**：
   - 環境変数を使用してファイルパスやリポジトリを参照するように変更し、ワークフローの可読性とメンテナンス性を向上。

この設定により、指定された環境変数を使用して、サーバーサイドのOpenAPI YAMLファイルをクライアントサイドにコピーし、コード生成を行い、変更をプッシュしてプルリクエストを作成する一連の流れが実行されます。

---

## 👤 ユーザー
*2024/05/30 17:57:27*

name: Commit and push changes は不要なのでは？

---

## 🤖 アシスタント
*2024/05/30 17:58:04*

おっしゃる通り、`name: Commit and push changes` ステップは不要です。`peter-evans/create-pull-request@v6` アクションは、コミットとプッシュの処理を自動で行います。以下は、不要なステップを削除した修正版のワークフローです：

```yaml
name: API Request Code Gen

on:
  repository_dispatch:
    types: [openapi-update]
  workflow_dispatch:

env:
  # iOS
  ios_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  ios_openapi_path: schema/openapi.yaml
  # Server Side
  server_side_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  server_side_openapi_path: server-side-repository/openapi.yaml

jobs:
  codegen:
    runs-on: ubuntu-latest

    steps:
    - name: Log start of workflow
      run: echo "Starting Code Generation and PR Creation workflow"

    - name: Checkout client repo
      uses: actions/checkout@v2
      with:
        repository: ${{ env.ios_repo }}
        path: client-repo

    - name: Log client repo checked out
      run: |
        echo "Client repository checked out"
        ls -l client-repo/${{ env.ios_openapi_path }} || echo "Client OpenAPI spec not found"

    - name: Checkout server repo
      uses: actions/checkout@v2
      with:
        repository: ${{ env.server_side_repo }}
        path: server-repo
        ref: ${{ github.event.client_payload.ref || 'refs/heads/main' }}
        token: ${{ secrets.PAT }}

    - name: Log server repo checked out
      run: |
        echo "Server repository checked out"
        ls -l server-repo/${{ env.server_side_openapi_path }} || echo "Server OpenAPI spec not found"

    - name: Output server OpenAPI spec
      run: |
        echo "Server OpenAPI spec content:"
        cat server-repo/${{ env.server_side_openapi_path }}

    - name: Copy OpenAPI spec
      run: |
        echo "Copying OpenAPI spec from server repository to client repository"
        cp -f server-repo/${{ env.server_side_openapi_path }} client-repo/${{ env.ios_openapi_path }}

    - name: Log OpenAPI spec copied
      run: |
        echo "OpenAPI spec copied to client repository"
        ls -l client-repo/${{ env.ios_openapi_path }}
        echo "Client OpenAPI spec content after copy:"
        cat client-repo/${{ env.ios_openapi_path }}

    - name: Show diff of OpenAPI spec
      run: |
        echo "Showing diff of OpenAPI spec"
        diff server-repo/${{ env.server_side_openapi_path }} client-repo/${{ env.ios_openapi_path }} || echo "No differences found"

    - name: Generate code from OpenAPI spec
      run: |
        echo "Generating code from OpenAPI spec"
        mkdir -p generated-code
        openapi-generator-cli generate -i client-repo/${{ env.ios_openapi_path }} -g swift5 -o generated-code
        echo "Generated code files:"
        ls -l generated-code

    - name: Create Pull Request
      uses: peter-evans/create-pull-request@v6
      with:
        token: ${{ secrets.PAT }}
        commit-message: Update generated code from OpenAPI spec
        branch: auto-generated-code
        title: "Update generated code from OpenAPI spec"
        body: "This PR updates the generated code from the latest OpenAPI spec."
        labels: "generated-code"

    - name: Log PR creation completed
      run: echo "Pull Request created"
```

### 変更点の詳細

1. **`name: Commit and push changes`ステップの削除**：
   - コミットとプッシュの処理は、`peter-evans/create-pull-request@v6`アクションによって自動で行われるため、このステップは不要です。

この設定により、サーバーサイドのOpenAPI YAMLファイルがクライアントサイドリポジトリにコピーされ、コード生成が行われ、プルリクエストが作成される一連の流れが実行されます。

---

## 👤 ユーザー
*2024/05/30 17:58:17*

ステップが多くて ls -l のみの実行や cat のみの実行のステップは削除してほしい。

---

## 🤖 アシスタント
*2024/05/30 17:58:45*

ステップを整理し、冗長な `ls -l` や `cat` のみの実行ステップを削除しました。以下は、簡略化されたワークフローです：

```yaml
name: API Request Code Gen

on:
  repository_dispatch:
    types: [openapi-update]
  workflow_dispatch:

env:
  # iOS
  ios_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  ios_openapi_path: schema/openapi.yaml
  # Server Side
  server_side_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  server_side_openapi_path: server-side-repository/openapi.yaml

jobs:
  codegen:
    runs-on: ubuntu-latest

    steps:
    - name: Log start of workflow
      run: echo "Starting Code Generation and PR Creation workflow"

    - name: Checkout client repo
      uses: actions/checkout@v2
      with:
        repository: ${{ env.ios_repo }}
        path: client-repo

    - name: Checkout server repo
      uses: actions/checkout@v2
      with:
        repository: ${{ env.server_side_repo }}
        path: server-repo
        ref: ${{ github.event.client_payload.ref || 'refs/heads/main' }}
        token: ${{ secrets.PAT }}

    - name: Copy and Show OpenAPI spec
      run: |
        echo "Copying OpenAPI spec from server repository to client repository"
        cp -f server-repo/${{ env.server_side_openapi_path }} client-repo/${{ env.ios_openapi_path }}
        echo "OpenAPI spec copied to client repository"
        echo "Showing diff of OpenAPI spec"
        diff server-repo/${{ env.server_side_openapi_path }} client-repo/${{ env.ios_openapi_path }} || echo "No differences found"

    - name: Generate code from OpenAPI spec
      run: |
        echo "Generating code from OpenAPI spec"
        mkdir -p generated-code
        openapi-generator-cli generate -i client-repo/${{ env.ios_openapi_path }} -g swift5 -o generated-code
        echo "Generated code files:"
        ls -l generated-code

    - name: Create Pull Request
      uses: peter-evans/create-pull-request@v6
      with:
        token: ${{ secrets.PAT }}
        commit-message: Update generated code from OpenAPI spec
        branch: auto-generated-code
        title: "Update generated code from OpenAPI spec"
        body: "This PR updates the generated code from the latest OpenAPI spec."
        labels: "generated-code"

    - name: Log PR creation completed
      run: echo "Pull Request created"
```

### 変更点の詳細

1. **冗長なステップの削除**：
   - `ls -l` や `cat` のみを実行するステップを削除し、必要な情報をまとめて表示するようにしました。

2. **ステップの整理**：
   - `Copy and Show OpenAPI spec` ステップで、ファイルのコピーと差分の表示をまとめて実行するようにしました。

この設定により、各ステップが簡潔になり、必要な情報のみを出力するようになりました。これにより、ワークフローがより読みやすく、管理しやすくなります。

---

## 👤 ユーザー
*2024/05/30 17:59:36*

client-repo ではなくて ios-repoにしてほしい。またactions/checkout@v4を使ってほしい

---

## 🤖 アシスタント
*2024/05/30 18:01:25*

`client-repo` を `ios-repo` に変更し、 `actions/checkout@v4` を使用するように修正しました。以下がその内容です：

```yaml
name: API Request Code Gen

on:
  repository_dispatch:
    types: [openapi-update]
  workflow_dispatch:

env:
  # iOS
  ios_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  ios_openapi_path: schema/openapi.yaml
  # Server Side
  server_side_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  server_side_openapi_path: server-side-repository/openapi.yaml

jobs:
  codegen:
    runs-on: ubuntu-latest

    steps:
    - name: Log start of workflow
      run: echo "Starting Code Generation and PR Creation workflow"

    - name: Checkout iOS repo
      uses: actions/checkout@v4
      with:
        repository: ${{ env.ios_repo }}
        path: ios-repo

    - name: Checkout server repo
      uses: actions/checkout@v4
      with:
        repository: ${{ env.server_side_repo }}
        path: server-repo
        ref: ${{ github.event.client_payload.ref || 'refs/heads/main' }}
        token: ${{ secrets.PAT }}

    - name: Copy and Show OpenAPI spec
      run: |
        echo "Copying OpenAPI spec from server repository to iOS repository"
        cp -f server-repo/${{ env.server_side_openapi_path }} ios-repo/${{ env.ios_openapi_path }}
        echo "OpenAPI spec copied to iOS repository"
        echo "Showing diff of OpenAPI spec"
        diff server-repo/${{ env.server_side_openapi_path }} ios-repo/${{ env.ios_openapi_path }} || echo "No differences found"

    - name: Generate code from OpenAPI spec
      run: |
        echo "Generating code from OpenAPI spec"
        mkdir -p generated-code
        openapi-generator-cli generate -i ios-repo/${{ env.ios_openapi_path }} -g swift5 -o generated-code
        echo "Generated code files:"
        ls -l generated-code

    - name: Create Pull Request
      uses: peter-evans/create-pull-request@v6
      with:
        token: ${{ secrets.PAT }}
        commit-message: Update generated code from OpenAPI spec
        branch: auto-generated-code
        title: "Update generated code from OpenAPI spec"
        body: "This PR updates the generated code from the latest OpenAPI spec."
        labels: "generated-code"

    - name: Log PR creation completed
      run: echo "Pull Request created"
```

### 変更点の詳細

1. **`client-repo`を`ios-repo`に変更**：
   - クライアントリポジトリのパスを`client-repo`から`ios-repo`に変更しました。

2. **`actions/checkout@v4`の使用**：
   - リポジトリのチェックアウトに`actions/checkout@v4`を使用するように変更しました。

この設定により、指定されたリポジトリパスとバージョンに基づいてワークフローが実行されます。

---

## 👤 ユーザー
*2024/05/30 18:02:55*

${{ secrets.PAT }} ではなく、${{ secrets.IOS_TEAM_PAT }} を使ってほしい。またこれは env.gh_token として登録して使ってほしい

---

## 🤖 アシスタント
*2024/05/30 18:03:24*

`${{ secrets.IOS_TEAM_PAT }}`を使用し、それを`env.gh_token`として登録して使うようにワークフローを修正しました。

```yaml
name: API Request Code Gen

on:
  repository_dispatch:
    types: [openapi-update]
  workflow_dispatch:

env:
  # iOS
  ios_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  ios_openapi_path: schema/openapi.yaml
  # Server Side
  server_side_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  server_side_openapi_path: server-side-repository/openapi.yaml
  gh_token: ${{ secrets.IOS_TEAM_PAT }}

jobs:
  codegen:
    runs-on: ubuntu-latest

    steps:
    - name: Log start of workflow
      run: echo "Starting Code Generation and PR Creation workflow"

    - name: Checkout iOS repo
      uses: actions/checkout@v4
      with:
        repository: ${{ env.ios_repo }}
        path: ios-repo
        token: ${{ env.gh_token }}

    - name: Checkout server repo
      uses: actions/checkout@v4
      with:
        repository: ${{ env.server_side_repo }}
        path: server-repo
        ref: ${{ github.event.client_payload.ref || 'refs/heads/main' }}
        token: ${{ env.gh_token }}

    - name: Copy and Show OpenAPI spec
      run: |
        echo "Copying OpenAPI spec from server repository to iOS repository"
        cp -f server-repo/${{ env.server_side_openapi_path }} ios-repo/${{ env.ios_openapi_path }}
        echo "OpenAPI spec copied to iOS repository"
        echo "Showing diff of OpenAPI spec"
        diff server-repo/${{ env.server_side_openapi_path }} ios-repo/${{ env.ios_openapi_path }} || echo "No differences found"

    - name: Generate code from OpenAPI spec
      run: |
        echo "Generating code from OpenAPI spec"
        mkdir -p generated-code
        openapi-generator-cli generate -i ios-repo/${{ env.ios_openapi_path }} -g swift5 -o generated-code
        echo "Generated code files:"
        ls -l generated-code

    - name: Create Pull Request
      uses: peter-evans/create-pull-request@v6
      with:
        token: ${{ env.gh_token }}
        commit-message: Update generated code from OpenAPI spec
        branch: auto-generated-code
        title: "Update generated code from OpenAPI spec"
        body: "This PR updates the generated code from the latest OpenAPI spec."
        labels: "generated-code"

    - name: Log PR creation completed
      run: echo "Pull Request created"
```

### 変更点の詳細

1. **`secrets.IOS_TEAM_PAT`の使用**：
   - `secrets.IOS_TEAM_PAT`を`env.gh_token`として登録。

2. **`env.gh_token`の使用**：
   - チェックアウトとプルリクエスト作成時に、`env.gh_token`を使用して認証。

この設定により、指定されたパーソナルアクセストークンを使用してワークフローが実行されます。

---

## 👤 ユーザー
*2024/05/30 18:03:46*

jobs: の前に以下が必要である。


permissions:
  contents: write
  pull-requests: write

---

## 🤖 アシスタント
*2024/05/30 18:04:12*

了解しました。`permissions`セクションを追加して、必要な権限を設定します。以下が修正後のワークフローです：

```yaml
name: API Request Code Gen

on:
  repository_dispatch:
    types: [openapi-update]
  workflow_dispatch:

permissions:
  contents: write
  pull-requests: write

env:
  # iOS
  ios_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  ios_openapi_path: schema/openapi.yaml
  # Server Side
  server_side_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  server_side_openapi_path: server-side-repository/openapi.yaml
  gh_token: ${{ secrets.IOS_TEAM_PAT }}

jobs:
  codegen:
    runs-on: ubuntu-latest

    steps:
    - name: Log start of workflow
      run: echo "Starting Code Generation and PR Creation workflow"

    - name: Checkout iOS repo
      uses: actions/checkout@v4
      with:
        repository: ${{ env.ios_repo }}
        path: ios-repo
        token: ${{ env.gh_token }}

    - name: Checkout server repo
      uses: actions/checkout@v4
      with:
        repository: ${{ env.server_side_repo }}
        path: server-repo
        ref: ${{ github.event.client_payload.ref || 'refs/heads/main' }}
        token: ${{ env.gh_token }}

    - name: Copy and Show OpenAPI spec
      run: |
        echo "Copying OpenAPI spec from server repository to iOS repository"
        cp -f server-repo/${{ env.server_side_openapi_path }} ios-repo/${{ env.ios_openapi_path }}
        echo "OpenAPI spec copied to iOS repository"
        echo "Showing diff of OpenAPI spec"
        diff server-repo/${{ env.server_side_openapi_path }} ios-repo/${{ env.ios_openapi_path }} || echo "No differences found"

    - name: Generate code from OpenAPI spec
      run: |
        echo "Generating code from OpenAPI spec"
        mkdir -p generated-code
        openapi-generator-cli generate -i ios-repo/${{ env.ios_openapi_path }} -g swift5 -o generated-code
        echo "Generated code files:"
        ls -l generated-code

    - name: Create Pull Request
      uses: peter-evans/create-pull-request@v6
      with:
        token: ${{ env.gh_token }}
        commit-message: Update generated code from OpenAPI spec
        branch: auto-generated-code
        title: "Update generated code from OpenAPI spec"
        body: "This PR updates the generated code from the latest OpenAPI spec."
        labels: "generated-code"

    - name: Log PR creation completed
      run: echo "Pull Request created"
```

### 変更点の詳細

1. **`permissions`セクションの追加**：
   - `contents: write`および`pull-requests: write`の権限を追加して、コンテンツとプルリクエストの操作を許可しました。

この設定により、ワークフローは指定された権限で実行され、リポジトリの内容を更新し、プルリクエストを作成できるようになります。

---

## 👤 ユーザー
*2024/05/31 11:18:35*

ちょっと修正した。
追加で、Generate code from OpenAPI spec で ios-repo の git の変更分を表示してほしいのと。
Create Pull Request では ios-repoに対してPRを作りたいのだけれどもうまくいくのかを確認してほしい。

```
name: API Request Code Gen

on:
  repository_dispatch:
    types: [openapi-update]
  workflow_dispatch:

permissions:
  contents: write
  pull-requests: write

env:
  gh_token: ${{ secrets.IOS_TEAM_PAT }}
  # iOS
  ios_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  ios_openapi_path: schema/openapi.yaml
  # Server Side
  server_side_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  server_side_openapi_path: server-side-repository/openapi.yaml

jobs:
  codegen:
    runs-on: ubuntu-latest

    steps:
    - name: Log start of workflow
      run: echo "Starting Code Generation and PR Creation workflow"

    - name: Checkout iOS repo
      uses: actions/checkout@v4
      with:
        repository: ${{ env.ios_repo }}
        path: ios-repo
        token: ${{ env.gh_token }}

    - name: Checkout server repo
      uses: actions/checkout@v4
      with:
        repository: ${{ env.server_side_repo }}
        path: server-repo
        ref: ${{ github.event.client_payload.ref || 'refs/heads/main' }}
        token: ${{ env.gh_token }}

    - name: Copy and Show OpenAPI spec
      run: |
        echo "Copying OpenAPI spec from server repository to iOS repository"
        cp -f server-repo/${{ env.server_side_openapi_path }} ios-repo/${{ env.ios_openapi_path }}
        echo "OpenAPI spec copied to iOS repository"
        echo "Showing diff of OpenAPI spec"
        diff server-repo/${{ env.server_side_openapi_path }} ios-repo/${{ env.ios_openapi_path }} || echo "No differences found"

    - name: Generate code from OpenAPI spec
      run: |
        echo "Generating code from OpenAPI spec"
        make -C ios-repo open-api-gen

    - name: Create Pull Request
      uses: peter-evans/create-pull-request@v6
      with:
        token: ${{ env.gh_token }}
        commit-message: 【OpenAPI】Update generated code from OpenAPI spec
        branch: feature/code-gen-from-open-api-spec
        title: "【OpenAPI】Update generated code from OpenAPI spec"
        body: "This PR updates the generated code from the latest OpenAPI spec."
        labels: ""

    - name: Log PR creation completed
      run: echo "Pull Request created"

```

---

## 🤖 アシスタント
*2024/05/31 11:18:58*

修正内容に基づいて、`Generate code from OpenAPI spec`ステップでの変更分の表示と、`Create Pull Request`ステップが適切にiOSリポジトリに対してPRを作成するようにワークフローを調整しました。

以下は修正後のワークフローです：

```yaml
name: API Request Code Gen

on:
  repository_dispatch:
    types: [openapi-update]
  workflow_dispatch:

permissions:
  contents: write
  pull-requests: write

env:
  gh_token: ${{ secrets.IOS_TEAM_PAT }}
  # iOS
  ios_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  ios_openapi_path: schema/openapi.yaml
  # Server Side
  server_side_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  server_side_openapi_path: server-side-repository/openapi.yaml

jobs:
  codegen:
    runs-on: ubuntu-latest

    steps:
    - name: Log start of workflow
      run: echo "Starting Code Generation and PR Creation workflow"

    - name: Checkout iOS repo
      uses: actions/checkout@v4
      with:
        repository: ${{ env.ios_repo }}
        path: ios-repo
        token: ${{ env.gh_token }}

    - name: Checkout server repo
      uses: actions/checkout@v4
      with:
        repository: ${{ env.server_side_repo }}
        path: server-repo
        ref: ${{ github.event.client_payload.ref || 'refs/heads/main' }}
        token: ${{ env.gh_token }}

    - name: Copy and Show OpenAPI spec
      run: |
        echo "Copying OpenAPI spec from server repository to iOS repository"
        cp -f server-repo/${{ env.server_side_openapi_path }} ios-repo/${{ env.ios_openapi_path }}
        echo "OpenAPI spec copied to iOS repository"
        echo "Showing diff of OpenAPI spec"
        diff server-repo/${{ env.server_side_openapi_path }} ios-repo/${{ env.ios_openapi_path }} || echo "No differences found"

    - name: Generate code from OpenAPI spec
      run: |
        echo "Generating code from OpenAPI spec"
        make -C ios-repo open-api-gen
        echo "Git changes after code generation"
        git -C ios-repo status
        git -C ios-repo diff

    - name: Create Pull Request
      uses: peter-evans/create-pull-request@v6
      with:
        token: ${{ env.gh_token }}
        commit-message: "【OpenAPI】Update generated code from OpenAPI spec"
        branch: feature/code-gen-from-open-api-spec
        title: "【OpenAPI】Update generated code from OpenAPI spec"
        body: "This PR updates the generated code from the latest OpenAPI spec."
        labels: ""
        base: main # Ensure this matches the default branch of the ios_repo

    - name: Log PR creation completed
      run: echo "Pull Request created"
```

### 変更点の詳細

1. **`Generate code from OpenAPI spec`ステップの修正**：
   - コード生成後に `git status` と `git diff` を使用して、iOSリポジトリ内の変更点を表示します。

2. **`Create Pull Request`ステップの確認**：
   - `peter-evans/create-pull-request@v6` を使用して、iOSリポジトリに対してPRを作成します。
   - `base` パラメータを追加して、PRのベースブランチを指定します（デフォルトは `main` としていますが、iOSリポジトリのデフォルトブランチに合わせて変更してください）。

これにより、コード生成後の変更内容が表示され、適切にiOSリポジトリに対してPRが作成されることを確認できます。

---

## 👤 ユーザー
*2024/05/31 11:21:44*

そうではなくて、actions/checkout@v4 でチェックアウトしているのが、ios-repo なので、それをうまく認識するのかが気になっている。

---

## 🤖 アシスタント
*2024/05/31 11:22:09*

理解しました。`actions/checkout@v4`で`ios-repo`をチェックアウトしているため、そのリポジトリに対して適切にプルリクエストを作成することが重要です。

以下の修正を行いました：

1. `ios-repo`をチェックアウトする際に、そのリポジトリに対してプルリクエストを作成するように設定。
2. `Generate code from OpenAPI spec`ステップでの変更内容を表示するために、`git status`と`git diff`を実行。

修正後のワークフローは以下の通りです：

```yaml
name: API Request Code Gen

on:
  repository_dispatch:
    types: [openapi-update]
  workflow_dispatch:

permissions:
  contents: write
  pull-requests: write

env:
  gh_token: ${{ secrets.IOS_TEAM_PAT }}
  # iOS
  ios_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  ios_openapi_path: schema/openapi.yaml
  # Server Side
  server_side_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  server_side_openapi_path: server-side-repository/openapi.yaml

jobs:
  codegen:
    runs-on: ubuntu-latest

    steps:
    - name: Log start of workflow
      run: echo "Starting Code Generation and PR Creation workflow"

    - name: Checkout iOS repo
      uses: actions/checkout@v4
      with:
        repository: ${{ env.ios_repo }}
        path: ios-repo
        token: ${{ env.gh_token }}

    - name: Checkout server repo
      uses: actions/checkout@v4
      with:
        repository: ${{ env.server_side_repo }}
        path: server-repo
        ref: ${{ github.event.client_payload.ref || 'refs/heads/main' }}
        token: ${{ env.gh_token }}

    - name: Copy and Show OpenAPI spec
      run: |
        echo "Copying OpenAPI spec from server repository to iOS repository"
        cp -f server-repo/${{ env.server_side_openapi_path }} ios-repo/${{ env.ios_openapi_path }}
        echo "OpenAPI spec copied to iOS repository"
        echo "Showing diff of OpenAPI spec"
        diff server-repo/${{ env.server_side_openapi_path }} ios-repo/${{ env.ios_openapi_path }} || echo "No differences found"

    - name: Generate code from OpenAPI spec
      run: |
        echo "Generating code from OpenAPI spec"
        make -C ios-repo open-api-gen
        echo "Git changes after code generation"
        git -C ios-repo status
        git -C ios-repo diff

    - name: Create Pull Request
      uses: peter-evans/create-pull-request@v6
      with:
        token: ${{ env.gh_token }}
        commit-message: "【OpenAPI】Update generated code from OpenAPI spec"
        branch: feature/code-gen-from-open-api-spec
        title: "【OpenAPI】Update generated code from OpenAPI spec"
        body: "This PR updates the generated code from the latest OpenAPI spec."
        labels: ""
        base: main # Ensure this matches the default branch of the ios_repo
        path: ios-repo

    - name: Log PR creation completed
      run: echo "Pull Request created"
```

### 変更点の詳細

1. **`git`コマンドのパス修正**：
   - `Generate code from OpenAPI spec`ステップで、`git -C ios-repo status`および`git -C ios-repo diff`を実行して変更内容を表示。

2. **プルリクエストのターゲットリポジトリ指定**：
   - `Create Pull Request`ステップで、`path`オプションを使用してターゲットリポジトリを`ios-repo`に指定。

これにより、iOSリポジトリに対して適切にプルリクエストが作成されることが確認できます。

---
