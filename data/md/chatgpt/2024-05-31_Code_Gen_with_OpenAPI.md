# Code Gen with OpenAPI

日付: 2024-05-31

---

## 👤 ユーザー
*2024/05/31 16:10:17*

exit 0 とした以降の処理はやってほしくない。

name: Code Gen From OpenAPI Spec

on:
  repository_dispatch:
    types: [update-open-api-spec]
  workflow_dispatch:

permissions:
  contents: write
  pull-requests: write

env:
  # gh_token: ${{ secrets.IOS_TEAM_PAT }} # IOS_TEAM_PAT: project, read:org, repo
  # iOS
  ios_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  ios_openapi_path: schema/openapi.yaml
  # Server Side
  server_side_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  server_side_openapi_path: server-side-repository/openapi.yaml

jobs:
  code-gen-from-open-api-spec:
    # Ref: https://github.com/actions/runner-images
    runs-on: macos-14
    env:
      # Ref: https://github.com/actions/runner-images/blob/main/images/macos/macos-14-Readme.md#xcode
      DEVELOPER_DIR: /Applications/Xcode_15.4.app/Contents/Developer

    timeout-minutes: 300

    steps:
    - name: Checkout iOS repo
      uses: actions/checkout@v4
      with:
        repository: ${{ env.ios_repo }}
        path: ios-repo
        # token: ${{ env.gh_token }}

    - name: Checkout Server Side repo
      uses: actions/checkout@v4
      with:
        repository: ${{ env.server_side_repo }}
        path: server-repo
        ref: ${{ github.event.client_payload.ref || 'refs/heads/main' }}
        # token: ${{ env.gh_token }}

    - name: Check for differences in OpenAPI spec
      id: check_diff
      run: |
        if diff server-repo/${{ env.server_side_openapi_path }} ios-repo/${{ env.ios_openapi_path }}; then
          echo "No changes in OpenAPI spec."
          exit 0
        else
          echo "Changes detected in OpenAPI spec."
          cp -f server-repo/${{ env.server_side_openapi_path }} ios-repo/${{ env.ios_openapi_path }}
        fi

    - name: Generate code from OpenAPI spec
      if: success()
      run: |
        make -C ios-repo open-api-gen
        git -C ios-repo status
        git -C ios-repo diff

    - name: Create Pull Request
      if: success()
      uses: peter-evans/create-pull-request@v6
      with:
        # token: ${{ secrets.IOS_TEAM_PAT }}
        commit-message: 【OpenAPI】Update generated code from OpenAPI spec [ci skip]
        branch: feature/code-gen-from-open-api-spec
        title: 【OpenAPI】Update generated code from OpenAPI spec
        body: This PR updates the generated code from the latest OpenAPI spec.
        labels: "enhancement"
        path: ios-repo

---

## 🤖 アシスタント
*2024/05/31 16:10:38*

`exit 0`を使用した後、以降の処理を実行させないようにするために、`continue-on-error: false`を設定することができます。ただし、GitHub Actionsの`if`条件を活用して、特定のステップを実行するかどうかを制御する方が一般的です。

以下は、`exit 0`の後の処理を実行させないようにする修正例です。

```yaml
name: Code Gen From OpenAPI Spec

on:
  repository_dispatch:
    types: [update-open-api-spec]
  workflow_dispatch:

permissions:
  contents: write
  pull-requests: write

env:
  # gh_token: ${{ secrets.IOS_TEAM_PAT }} # IOS_TEAM_PAT: project, read:org, repo
  # iOS
  ios_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  ios_openapi_path: schema/openapi.yaml
  # Server Side
  server_side_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  server_side_openapi_path: server-side-repository/openapi.yaml

jobs:
  code-gen-from-open-api-spec:
    # Ref: https://github.com/actions/runner-images
    runs-on: macos-14
    env:
      # Ref: https://github.com/actions/runner-images/blob/main/images/macos/macos-14-Readme.md#xcode
      DEVELOPER_DIR: /Applications/Xcode_15.4.app/Contents/Developer

    timeout-minutes: 300

    steps:
    - name: Checkout iOS repo
      uses: actions/checkout@v4
      with:
        repository: ${{ env.ios_repo }}
        path: ios-repo
        # token: ${{ env.gh_token }}

    - name: Checkout Server Side repo
      uses: actions/checkout@v4
      with:
        repository: ${{ env.server_side_repo }}
        path: server-repo
        ref: ${{ github.event.client_payload.ref || 'refs/heads/main' }}
        # token: ${{ env.gh_token }}

    - name: Check for differences in OpenAPI spec
      id: check_diff
      run: |
        if diff server-repo/${{ env.server_side_openapi_path }} ios-repo/${{ env.ios_openapi_path }}; then
          echo "No changes in OpenAPI spec."
          echo "changes_detected=false" >> $GITHUB_ENV
          exit 0
        else
          echo "Changes detected in OpenAPI spec."
          echo "changes_detected=true" >> $GITHUB_ENV
          cp -f server-repo/${{ env.server_side_openapi_path }} ios-repo/${{ env.ios_openapi_path }}
        fi

    - name: Generate code from OpenAPI spec
      if: env.changes_detected == 'true'
      run: |
        make -C ios-repo open-api-gen
        git -C ios-repo status
        git -C ios-repo diff

    - name: Create Pull Request
      if: env.changes_detected == 'true'
      uses: peter-evans/create-pull-request@v6
      with:
        # token: ${{ secrets.IOS_TEAM_PAT }}
        commit-message: 【OpenAPI】Update generated code from OpenAPI spec [ci skip]
        branch: feature/code-gen-from-open-api-spec
        title: 【OpenAPI】Update generated code from OpenAPI spec
        body: This PR updates the generated code from the latest OpenAPI spec.
        labels: "enhancement"
        path: ios-repo
```

この修正では、`Check for differences in OpenAPI spec`ステップで環境変数`changes_detected`を設定し、変更が検出された場合にのみ後続のステップが実行されるようにしています。これにより、`exit 0`が実行された場合に後続のステップがスキップされるようになります。

---

## 👤 ユーザー
*2024/05/31 16:11:55*

ちゃんと outputとして定義した方が綺麗ないのでは？
またもう exit 0 とする必要はなさそうだね。

---

## 🤖 アシスタント
*2024/05/31 16:12:19*

確かに、`output`として定義する方が綺麗であり、より柔軟性があります。また、`exit 0`は不要となります。以下はその修正例です。

```yaml
name: Code Gen From OpenAPI Spec

on:
  repository_dispatch:
    types: [update-open-api-spec]
  workflow_dispatch:

permissions:
  contents: write
  pull-requests: write

env:
  # gh_token: ${{ secrets.IOS_TEAM_PAT }} # IOS_TEAM_PAT: project, read:org, repo
  # iOS
  ios_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  ios_openapi_path: schema/openapi.yaml
  # Server Side
  server_side_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  server_side_openapi_path: server-side-repository/openapi.yaml

jobs:
  code-gen-from-open-api-spec:
    # Ref: https://github.com/actions/runner-images
    runs-on: macos-14
    env:
      # Ref: https://github.com/actions/runner-images/blob/main/images/macos/macos-14-Readme.md#xcode
      DEVELOPER_DIR: /Applications/Xcode_15.4.app/Contents/Developer

    timeout-minutes: 300

    steps:
    - name: Checkout iOS repo
      uses: actions/checkout@v4
      with:
        repository: ${{ env.ios_repo }}
        path: ios-repo
        # token: ${{ env.gh_token }}

    - name: Checkout Server Side repo
      uses: actions/checkout@v4
      with:
        repository: ${{ env.server_side_repo }}
        path: server-repo
        ref: ${{ github.event.client_payload.ref || 'refs/heads/main' }}
        # token: ${{ env.gh_token }}

    - name: Check for differences in OpenAPI spec
      id: check_diff
      run: |
        if diff server-repo/${{ env.server_side_openapi_path }} ios-repo/${{ env.ios_openapi_path }}; then
          echo "No changes in OpenAPI spec."
          echo "::set-output name=changes_detected::false"
        else
          echo "Changes detected in OpenAPI spec."
          echo "::set-output name=changes_detected::true"
          cp -f server-repo/${{ env.server_side_openapi_path }} ios-repo/${{ env.ios_openapi_path }}
        fi

    - name: Generate code from OpenAPI spec
      if: steps.check_diff.outputs.changes_detected == 'true'
      run: |
        make -C ios-repo open-api-gen
        git -C ios-repo status
        git -C ios-repo diff

    - name: Create Pull Request
      if: steps.check_diff.outputs.changes_detected == 'true'
      uses: peter-evans/create-pull-request@v6
      with:
        # token: ${{ secrets.IOS_TEAM_PAT }}
        commit-message: 【OpenAPI】Update generated code from OpenAPI spec [ci skip]
        branch: feature/code-gen-from-open-api-spec
        title: 【OpenAPI】Update generated code from OpenAPI spec
        body: This PR updates the generated code from the latest OpenAPI spec.
        labels: "enhancement"
        path: ios-repo
```

この修正では、`Check for differences in OpenAPI spec`ステップで出力（output）として`changes_detected`を設定し、それを後続のステップで条件として使用しています。これにより、処理の流れがより明確になります。

---

## 👤 ユーザー
*2024/05/31 16:12:32*

::set-output は非推奨だった気がする。

---

## 🤖 アシスタント
*2024/05/31 16:12:48*

おっしゃる通りです。GitHub Actionsでは`::set-output`が非推奨となっており、代わりに`GITHUB_OUTPUT`環境変数を使用することが推奨されています。以下はその修正例です。

```yaml
name: Code Gen From OpenAPI Spec

on:
  repository_dispatch:
    types: [update-open-api-spec]
  workflow_dispatch:

permissions:
  contents: write
  pull-requests: write

env:
  # gh_token: ${{ secrets.IOS_TEAM_PAT }} # IOS_TEAM_PAT: project, read:org, repo
  # iOS
  ios_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  ios_openapi_path: schema/openapi.yaml
  # Server Side
  server_side_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  server_side_openapi_path: server-side-repository/openapi.yaml

jobs:
  code-gen-from-open-api-spec:
    # Ref: https://github.com/actions/runner-images
    runs-on: macos-14
    env:
      # Ref: https://github.com/actions/runner-images/blob/main/images/macos/macos-14-Readme.md#xcode
      DEVELOPER_DIR: /Applications/Xcode_15.4.app/Contents/Developer

    timeout-minutes: 300

    steps:
    - name: Checkout iOS repo
      uses: actions/checkout@v4
      with:
        repository: ${{ env.ios_repo }}
        path: ios-repo
        # token: ${{ env.gh_token }}

    - name: Checkout Server Side repo
      uses: actions/checkout@v4
      with:
        repository: ${{ env.server_side_repo }}
        path: server-repo
        ref: ${{ github.event.client_payload.ref || 'refs/heads/main' }}
        # token: ${{ env.gh_token }}

    - name: Check for differences in OpenAPI spec
      id: check_diff
      run: |
        if diff server-repo/${{ env.server_side_openapi_path }} ios-repo/${{ env.ios_openapi_path }}; then
          echo "changes_detected=false" >> $GITHUB_OUTPUT
        else
          echo "changes_detected=true" >> $GITHUB_OUTPUT
          cp -f server-repo/${{ env.server_side_openapi_path }} ios-repo/${{ env.ios_openapi_path }}
        fi

    - name: Generate code from OpenAPI spec
      if: steps.check_diff.outputs.changes_detected == 'true'
      run: |
        make -C ios-repo open-api-gen
        git -C ios-repo status
        git -C ios-repo diff

    - name: Create Pull Request
      if: steps.check_diff.outputs.changes_detected == 'true'
      uses: peter-evans/create-pull-request@v6
      with:
        # token: ${{ secrets.IOS_TEAM_PAT }}
        commit-message: 【OpenAPI】Update generated code from OpenAPI spec [ci skip]
        branch: feature/code-gen-from-open-api-spec
        title: 【OpenAPI】Update generated code from OpenAPI spec
        body: This PR updates the generated code from the latest OpenAPI spec.
        labels: "enhancement"
        path: ios-repo
```

この修正では、`GITHUB_OUTPUT`環境変数を使用して出力を設定し、それを後続のステップで条件として使用しています。これにより、`::set-output`の非推奨に対応しています。

---

## 👤 ユーザー
*2024/05/31 16:14:39*

echo "changes_detected=false" &gt;&gt; $GITHUB_OUTPUT とした後に終了する旨のechoをした方がいい気がする、また、明示的にここで終わりということを示すために exit 0 などがあった方がいい気がしてきた

---

## 🤖 アシスタント
*2024/05/31 16:15:03*

確かに、出力設定後に終了メッセージを表示し、処理を明示的に終了するために `exit 0` を追加することは良い方法です。以下はその修正例です。

```yaml
name: Code Gen From OpenAPI Spec

on:
  repository_dispatch:
    types: [update-open-api-spec]
  workflow_dispatch:

permissions:
  contents: write
  pull-requests: write

env:
  # gh_token: ${{ secrets.IOS_TEAM_PAT }} # IOS_TEAM_PAT: project, read:org, repo
  # iOS
  ios_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  ios_openapi_path: schema/openapi.yaml
  # Server Side
  server_side_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  server_side_openapi_path: server-side-repository/openapi.yaml

jobs:
  code-gen-from-open-api-spec:
    # Ref: https://github.com/actions/runner-images
    runs-on: macos-14
    env:
      # Ref: https://github.com/actions/runner-images/blob/main/images/macos/macos-14-Readme.md#xcode
      DEVELOPER_DIR: /Applications/Xcode_15.4.app/Contents/Developer

    timeout-minutes: 300

    steps:
    - name: Checkout iOS repo
      uses: actions/checkout@v4
      with:
        repository: ${{ env.ios_repo }}
        path: ios-repo
        # token: ${{ env.gh_token }}

    - name: Checkout Server Side repo
      uses: actions/checkout@v4
      with:
        repository: ${{ env.server_side_repo }}
        path: server-repo
        ref: ${{ github.event.client_payload.ref || 'refs/heads/main' }}
        # token: ${{ env.gh_token }}

    - name: Check for differences in OpenAPI spec
      id: check_diff
      run: |
        if diff server-repo/${{ env.server_side_openapi_path }} ios-repo/${{ env.ios_openapi_path }}; then
          echo "changes_detected=false" >> $GITHUB_OUTPUT
          echo "No changes in OpenAPI spec. Exiting."
          exit 0
        else
          echo "changes_detected=true" >> $GITHUB_OUTPUT
          echo "Changes detected in OpenAPI spec. Proceeding with code generation."
          cp -f server-repo/${{ env.server_side_openapi_path }} ios-repo/${{ env.ios_openapi_path }}
        fi

    - name: Generate code from OpenAPI spec
      if: steps.check_diff.outputs.changes_detected == 'true'
      run: |
        make -C ios-repo open-api-gen
        git -C ios-repo status
        git -C ios-repo diff

    - name: Create Pull Request
      if: steps.check_diff.outputs.changes_detected == 'true'
      uses: peter-evans/create-pull-request@v6
      with:
        # token: ${{ secrets.IOS_TEAM_PAT }}
        commit-message: 【OpenAPI】Update generated code from OpenAPI spec [ci skip]
        branch: feature/code-gen-from-open-api-spec
        title: 【OpenAPI】Update generated code from OpenAPI spec
        body: This PR updates the generated code from the latest OpenAPI spec.
        labels: "enhancement"
        path: ios-repo
```

この修正では、`changes_detected`が`false`の場合、適切なメッセージを表示し、明示的に`exit 0`で終了しています。変更が検出された場合のみ、後続のステップが実行されます。

---

## 👤 ユーザー
*2024/05/31 16:18:35*

Trigger update-open-api-spec によってCode Gen From OpenAPI Specを実行するとGitHub Actions 上で毎回「update-open-api-spec」というタイトルになってしまう。何か情報を載せたい

name: Trigger update-open-api-spec

on:
  push:
    branches:
      - main
    paths:
      - server-side-repository/openapi.yaml
  workflow_dispatch:

env:
  ios_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  event_type: update-open-api-spec

jobs:
  trigger-codegen:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger iOS repo workflow
        uses: peter-evans/repository-dispatch@v3
        with:
          token: ${{ secrets.IOS_TEAM_PAT }} # Permission: repo, read:org, project
          repository: ${{ env.ios_repo }}
          event-type: ${{ env.event_type }}
          client-payload: '{"ref": "${{ github.ref }}", "sha": "${{ github.sha }}"}'



name: Code Gen From OpenAPI Spec

on:
  repository_dispatch:
    types: [update-open-api-spec]
  workflow_dispatch:

permissions:
  contents: write
  pull-requests: write

env:
  # gh_token: ${{ secrets.IOS_TEAM_PAT }} # IOS_TEAM_PAT: project, read:org, repo
  # iOS
  ios_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  ios_openapi_path: schema/openapi.yaml
  # Server Side
  server_side_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  server_side_openapi_path: server-side-repository/openapi.yaml

jobs:
  code-gen-from-open-api-spec:
    # Ref: https://github.com/actions/runner-images
    runs-on: macos-14
    env:
      # Ref: https://github.com/actions/runner-images/blob/main/images/macos/macos-14-Readme.md#xcode
      DEVELOPER_DIR: /Applications/Xcode_15.4.app/Contents/Developer

    timeout-minutes: 300

    steps:
    - name: Checkout iOS repo
      uses: actions/checkout@v4
      with:
        repository: ${{ env.ios_repo }}
        path: ios-repo
        # token: ${{ env.gh_token }}

    - name: Checkout Server Side repo
      uses: actions/checkout@v4
      with:
        repository: ${{ env.server_side_repo }}
        path: server-repo
        ref: ${{ github.event.client_payload.ref || 'refs/heads/main' }}
        # token: ${{ env.gh_token }}

    - name: Check for differences in OpenAPI spec
      id: check_diff
      run: |
        if diff server-repo/${{ env.server_side_openapi_path }} ios-repo/${{ env.ios_openapi_path }}; then
          echo "changes_detected=false" &gt;&gt; $GITHUB_OUTPUT
          echo "No changes in OpenAPI spec. Exiting."
          exit 0
        else
          echo "changes_detected=true" &gt;&gt; $GITHUB_OUTPUT
          echo "Changes detected in OpenAPI spec. Proceeding with code generation."
          cp -f server-repo/${{ env.server_side_openapi_path }} ios-repo/${{ env.ios_openapi_path }}
        fi

    - name: Generate code from OpenAPI spec
      if: steps.check_diff.outputs.changes_detected == 'true'
      run: |
        make -C ios-repo open-api-gen
        git -C ios-repo status
        git -C ios-repo diff

    - name: Create Pull Request
      if: steps.check_diff.outputs.changes_detected == 'true'
      uses: peter-evans/create-pull-request@v6
      with:
        # token: ${{ secrets.IOS_TEAM_PAT }}
        commit-message: 【OpenAPI】Update generated code from OpenAPI spec [ci skip]
        branch: feature/code-gen-from-open-api-spec
        title: 【OpenAPI】Update generated code from OpenAPI spec
        body: This PR updates the generated code from the latest OpenAPI spec.
        labels: "enhancement"
        path: ios-repo

---

## 🤖 アシスタント
*2024/05/31 16:19:06*

GitHub Actionsの`repository_dispatch`イベントをトリガーするときに追加情報を含めることができます。これにより、タイトルにその情報を反映させることが可能です。例えば、コミットSHAやブランチ名などを追加できます。

以下に、`client-payload`に追加情報を含める方法と、その情報を使用してPRのタイトルを動的に設定する方法を示します。

### トリガーワークフロー

```yaml
name: Trigger update-open-api-spec

on:
  push:
    branches:
      - main
    paths:
      - server-side-repository/openapi.yaml
  workflow_dispatch:

env:
  ios_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  event_type: update-open-api-spec

jobs:
  trigger-codegen:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger iOS repo workflow
        uses: peter-evans/repository-dispatch@v3
        with:
          token: ${{ secrets.IOS_TEAM_PAT }} # Permission: repo, read:org, project
          repository: ${{ env.ios_repo }}
          event-type: ${{ env.event_type }}
          client-payload: '{"ref": "${{ github.ref }}", "sha": "${{ github.sha }}", "branch": "${{ github.ref_name }}"}'
```

### 実行ワークフロー

```yaml
name: Code Gen From OpenAPI Spec

on:
  repository_dispatch:
    types: [update-open-api-spec]
  workflow_dispatch:

permissions:
  contents: write
  pull-requests: write

env:
  # gh_token: ${{ secrets.IOS_TEAM_PAT }} # IOS_TEAM_PAT: project, read:org, repo
  # iOS
  ios_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  ios_openapi_path: schema/openapi.yaml
  # Server Side
  server_side_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  server_side_openapi_path: server-side-repository/openapi.yaml

jobs:
  code-gen-from-open-api-spec:
    # Ref: https://github.com/actions/runner-images
    runs-on: macos-14
    env:
      # Ref: https://github.com/actions/runner-images/blob/main/images/macos/macos-14-Readme.md#xcode
      DEVELOPER_DIR: /Applications/Xcode_15.4.app/Contents/Developer

    timeout-minutes: 300

    steps:
    - name: Checkout iOS repo
      uses: actions/checkout@v4
      with:
        repository: ${{ env.ios_repo }}
        path: ios-repo
        # token: ${{ env.gh_token }}

    - name: Checkout Server Side repo
      uses: actions/checkout@v4
      with:
        repository: ${{ env.server_side_repo }}
        path: server-repo
        ref: ${{ github.event.client_payload.ref || 'refs/heads/main' }}
        # token: ${{ env.gh_token }}

    - name: Check for differences in OpenAPI spec
      id: check_diff
      run: |
        if diff server-repo/${{ env.server_side_openapi_path }} ios-repo/${{ env.ios_openapi_path }}; then
          echo "changes_detected=false" >> $GITHUB_OUTPUT
          echo "No changes in OpenAPI spec. Exiting."
          exit 0
        else
          echo "changes_detected=true" >> $GITHUB_OUTPUT
          echo "Changes detected in OpenAPI spec. Proceeding with code generation."
          cp -f server-repo/${{ env.server_side_openapi_path }} ios-repo/${{ env.ios_openapi_path }}
        fi

    - name: Generate code from OpenAPI spec
      if: steps.check_diff.outputs.changes_detected == 'true'
      run: |
        make -C ios-repo open-api-gen
        git -C ios-repo status
        git -C ios-repo diff

    - name: Create Pull Request
      if: steps.check_diff.outputs.changes_detected == 'true'
      uses: peter-evans/create-pull-request@v6
      with:
        # token: ${{ secrets.IOS_TEAM_PAT }}
        commit-message: "【OpenAPI】Update generated code from OpenAPI spec [ci skip]"
        branch: feature/code-gen-from-open-api-spec
        title: "【OpenAPI】Update generated code from OpenAPI spec - ${{
          github.event.client_payload.ref_name
        }} - ${{ github.event.client_payload.sha }}"
        body: This PR updates the generated code from the latest OpenAPI spec.
        labels: "enhancement"
        path: ios-repo
```

これにより、プルリクエストのタイトルにブランチ名とコミットSHAが含まれるようになり、どの変更に対するプルリクエストであるかがわかりやすくなります。

---

## 👤 ユーザー
*2024/05/31 16:21:44*

以下のような改行はしてほしくない。
client_payloadのコミットメッセージが含まれるのがいい気がしている。

title: "【OpenAPI】Update generated code from OpenAPI spec - ${{
          github.event.client_payload.ref_name

---

## 🤖 アシスタント
*2024/05/31 16:22:13*

コミットメッセージを含めてPRのタイトルにする方法を実装するために、`client-payload`にコミットメッセージを追加し、それをタイトルに使用するように変更します。改行を避け、必要な情報を含むように修正します。

以下のように修正します。

### トリガーワークフロー

```yaml
name: Trigger update-open-api-spec

on:
  push:
    branches:
      - main
    paths:
      - server-side-repository/openapi.yaml
  workflow_dispatch:

env:
  ios_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  event_type: update-open-api-spec

jobs:
  trigger-codegen:
    runs-on: ubuntu-latest
    steps:
      - name: Get commit message
        id: get_commit_message
        run: echo "commit_message=$(git log -1 --pretty=format:'%s')" >> $GITHUB_ENV

      - name: Trigger iOS repo workflow
        uses: peter-evans/repository-dispatch@v3
        with:
          token: ${{ secrets.IOS_TEAM_PAT }} # Permission: repo, read:org, project
          repository: ${{ env.ios_repo }}
          event-type: ${{ env.event_type }}
          client-payload: '{"ref": "${{ github.ref }}", "sha": "${{ github.sha }}", "branch": "${{ github.ref_name }}", "commit_message": "${{ env.commit_message }}"}'
```

### 実行ワークフロー

```yaml
name: Code Gen From OpenAPI Spec

on:
  repository_dispatch:
    types: [update-open-api-spec]
  workflow_dispatch:

permissions:
  contents: write
  pull-requests: write

env:
  # gh_token: ${{ secrets.IOS_TEAM_PAT }} # IOS_TEAM_PAT: project, read:org, repo
  # iOS
  ios_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  ios_openapi_path: schema/openapi.yaml
  # Server Side
  server_side_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  server_side_openapi_path: server-side-repository/openapi.yaml

jobs:
  code-gen-from-open-api-spec:
    # Ref: https://github.com/actions/runner-images
    runs-on: macos-14
    env:
      # Ref: https://github.com/actions/runner-images/blob/main/images/macos/macos-14-Readme.md#xcode
      DEVELOPER_DIR: /Applications/Xcode_15.4.app/Contents/Developer

    timeout-minutes: 300

    steps:
    - name: Checkout iOS repo
      uses: actions/checkout@v4
      with:
        repository: ${{ env.ios_repo }}
        path: ios-repo
        # token: ${{ env.gh_token }}

    - name: Checkout Server Side repo
      uses: actions/checkout@v4
      with:
        repository: ${{ env.server_side_repo }}
        path: server-repo
        ref: ${{ github.event.client_payload.ref || 'refs/heads/main' }}
        # token: ${{ env.gh_token }}

    - name: Check for differences in OpenAPI spec
      id: check_diff
      run: |
        if diff server-repo/${{ env.server_side_openapi_path }} ios-repo/${{ env.ios_openapi_path }}; then
          echo "changes_detected=false" >> $GITHUB_OUTPUT
          echo "No changes in OpenAPI spec. Exiting."
          exit 0
        else
          echo "changes_detected=true" >> $GITHUB_OUTPUT
          echo "Changes detected in OpenAPI spec. Proceeding with code generation."
          cp -f server-repo/${{ env.server_side_openapi_path }} ios-repo/${{ env.ios_openapi_path }}
        fi

    - name: Generate code from OpenAPI spec
      if: steps.check_diff.outputs.changes_detected == 'true'
      run: |
        make -C ios-repo open-api-gen
        git -C ios-repo status
        git -C ios-repo diff

    - name: Create Pull Request
      if: steps.check_diff.outputs.changes_detected == 'true'
      uses: peter-evans/create-pull-request@v6
      with:
        # token: ${{ secrets.IOS_TEAM_PAT }}
        commit-message: "【OpenAPI】Update generated code from OpenAPI spec [ci skip]"
        branch: feature/code-gen-from-open-api-spec
        title: "【OpenAPI】Update generated code from OpenAPI spec - ${{ github.event.client_payload.commit_message }}"
        body: This PR updates the generated code from the latest OpenAPI spec.
        labels: "enhancement"
        path: ios-repo
```

これにより、コミットメッセージを含むPRのタイトルが設定され、適切な情報がタイトルに反映されるようになります。

---

## 👤 ユーザー
*2024/05/31 16:22:57*

GITHUB_ENV より OUTPUTのほうがよくないか？

---

## 🤖 アシスタント
*2024/05/31 16:23:26*

`GITHUB_ENV`を使わずに、`OUTPUT`を使ってデータを渡す方法は確かにきれいです。以下のように修正します。

### トリガーワークフロー

```yaml
name: Trigger update-open-api-spec

on:
  push:
    branches:
      - main
    paths:
      - server-side-repository/openapi.yaml
  workflow_dispatch:

env:
  ios_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  event_type: update-open-api-spec

jobs:
  trigger-codegen:
    runs-on: ubuntu-latest

    steps:
      - name: Get commit message
        id: get_commit_message
        run: echo "commit_message=$(git log -1 --pretty=format:'%s')" >> $GITHUB_OUTPUT

      - name: Trigger iOS repo workflow
        uses: peter-evans/repository-dispatch@v3
        with:
          token: ${{ secrets.IOS_TEAM_PAT }} # Permission: repo, read:org, project
          repository: ${{ env.ios_repo }}
          event-type: ${{ env.event_type }}
          client-payload: '{"ref": "${{ github.ref }}", "sha": "${{ github.sha }}", "branch": "${{ github.ref_name }}", "commit_message": "${{ steps.get_commit_message.outputs.commit_message }}"}'
```

### 実行ワークフロー

```yaml
name: Code Gen From OpenAPI Spec

on:
  repository_dispatch:
    types: [update-open-api-spec]
  workflow_dispatch:

permissions:
  contents: write
  pull-requests: write

env:
  # gh_token: ${{ secrets.IOS_TEAM_PAT }} # IOS_TEAM_PAT: project, read:org, repo
  # iOS
  ios_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  ios_openapi_path: schema/openapi.yaml
  # Server Side
  server_side_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  server_side_openapi_path: server-side-repository/openapi.yaml

jobs:
  code-gen-from-open-api-spec:
    # Ref: https://github.com/actions/runner-images
    runs-on: macos-14
    env:
      # Ref: https://github.com/actions/runner-images/blob/main/images/macos/macos-14-Readme.md#xcode
      DEVELOPER_DIR: /Applications/Xcode_15.4.app/Contents/Developer

    timeout-minutes: 300

    steps:
    - name: Checkout iOS repo
      uses: actions/checkout@v4
      with:
        repository: ${{ env.ios_repo }}
        path: ios-repo
        # token: ${{ env.gh_token }}

    - name: Checkout Server Side repo
      uses: actions/checkout@v4
      with:
        repository: ${{ env.server_side_repo }}
        path: server-repo
        ref: ${{ github.event.client_payload.ref || 'refs/heads/main' }}
        # token: ${{ env.gh_token }}

    - name: Check for differences in OpenAPI spec
      id: check_diff
      run: |
        if diff server-repo/${{ env.server_side_openapi_path }} ios-repo/${{ env.ios_openapi_path }}; then
          echo "changes_detected=false" >> $GITHUB_OUTPUT
          echo "No changes in OpenAPI spec. Exiting."
          exit 0
        else
          echo "changes_detected=true" >> $GITHUB_OUTPUT
          echo "Changes detected in OpenAPI spec. Proceeding with code generation."
          cp -f server-repo/${{ env.server_side_openapi_path }} ios-repo/${{ env.ios_openapi_path }}
        fi

    - name: Generate code from OpenAPI spec
      if: steps.check_diff.outputs.changes_detected == 'true'
      run: |
        make -C ios-repo open-api-gen
        git -C ios-repo status
        git -C ios-repo diff

    - name: Create Pull Request
      if: steps.check_diff.outputs.changes_detected == 'true'
      uses: peter-evans/create-pull-request@v6
      with:
        # token: ${{ secrets.IOS_TEAM_PAT }}
        commit-message: "【OpenAPI】Update generated code from OpenAPI spec [ci skip]"
        branch: feature/code-gen-from-open-api-spec
        title: "【OpenAPI】Update generated code from OpenAPI spec - ${{ github.event.client_payload.commit_message }}"
        body: This PR updates the generated code from the latest OpenAPI spec.
        labels: "enhancement"
        path: ios-repo
```

これにより、コミットメッセージを含むPRのタイトルが設定され、適切な情報がタイトルに反映されるようになります。

---

## 👤 ユーザー
*2024/05/31 16:29:07*

こうなった

Run echo "commit_message=$(git log -1 --pretty=format:'%s')" &gt;&gt; $GITHUB_OUTPUT
fatal: not a git repository (or any of the parent directories): .git

---

## 🤖 アシスタント
*2024/05/31 16:29:47*

このエラーは、`git log`を実行するディレクトリがGitリポジトリではないことを示しています。`actions/checkout`を使用してリポジトリをクローンする必要があります。以下に修正例を示します。

### トリガーワークフロー

```yaml
name: Trigger update-open-api-spec

on:
  push:
    branches:
      - main
    paths:
      - server-side-repository/openapi.yaml
  workflow_dispatch:

env:
  ios_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  event_type: update-open-api-spec

jobs:
  trigger-codegen:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Server Side repo
        uses: actions/checkout@v4
        with:
          path: server-repo

      - name: Get commit message
        id: get_commit_message
        run: echo "commit_message=$(git log -1 --pretty=format:'%s')" >> $GITHUB_OUTPUT
        working-directory: server-repo

      - name: Trigger iOS repo workflow
        uses: peter-evans/repository-dispatch@v3
        with:
          token: ${{ secrets.IOS_TEAM_PAT }} # Permission: repo, read:org, project
          repository: ${{ env.ios_repo }}
          event-type: ${{ env.event_type }}
          client-payload: '{"ref": "${{ github.ref }}", "sha": "${{ github.sha }}", "branch": "${{ github.ref_name }}", "commit_message": "${{ steps.get_commit_message.outputs.commit_message }}"}'
```

### 実行ワークフロー

```yaml
name: Code Gen From OpenAPI Spec

on:
  repository_dispatch:
    types: [update-open-api-spec]
  workflow_dispatch:

permissions:
  contents: write
  pull-requests: write

env:
  # gh_token: ${{ secrets.IOS_TEAM_PAT }} # IOS_TEAM_PAT: project, read:org, repo
  # iOS
  ios_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  ios_openapi_path: schema/openapi.yaml
  # Server Side
  server_side_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  server_side_openapi_path: server-side-repository/openapi.yaml

jobs:
  code-gen-from-open-api-spec:
    # Ref: https://github.com/actions/runner-images
    runs-on: macos-14
    env:
      # Ref: https://github.com/actions/runner-images/blob/main/images/macos/macos-14-Readme.md#xcode
      DEVELOPER_DIR: /Applications/Xcode_15.4.app/Contents/Developer

    timeout-minutes: 300

    steps:
    - name: Checkout iOS repo
      uses: actions/checkout@v4
      with:
        repository: ${{ env.ios_repo }}
        path: ios-repo
        # token: ${{ env.gh_token }}

    - name: Checkout Server Side repo
      uses: actions/checkout@v4
      with:
        repository: ${{ env.server_side_repo }}
        path: server-repo
        ref: ${{ github.event.client_payload.ref || 'refs/heads/main' }}
        # token: ${{ env.gh_token }}

    - name: Check for differences in OpenAPI spec
      id: check_diff
      run: |
        if diff server-repo/${{ env.server_side_openapi_path }} ios-repo/${{ env.ios_openapi_path }}; then
          echo "changes_detected=false" >> $GITHUB_OUTPUT
          echo "No changes in OpenAPI spec. Exiting."
          exit 0
        else
          echo "changes_detected=true" >> $GITHUB_OUTPUT
          echo "Changes detected in OpenAPI spec. Proceeding with code generation."
          cp -f server-repo/${{ env.server_side_openapi_path }} ios-repo/${{ env.ios_openapi_path }}
        fi

    - name: Generate code from OpenAPI spec
      if: steps.check_diff.outputs.changes_detected == 'true'
      run: |
        make -C ios-repo open-api-gen
        git -C ios-repo status
        git -C ios-repo diff

    - name: Create Pull Request
      if: steps.check_diff.outputs.changes_detected == 'true'
      uses: peter-evans/create-pull-request@v6
      with:
        # token: ${{ secrets.IOS_TEAM_PAT }}
        commit-message: "【OpenAPI】Update generated code from OpenAPI spec [ci skip]"
        branch: feature/code-gen-from-open-api-spec
        title: "【OpenAPI】Update generated code from OpenAPI spec - ${{ github.event.client_payload.commit_message }}"
        body: This PR updates the generated code from the latest OpenAPI spec.
        labels: "enhancement"
        path: ios-repo
```

これにより、`server-repo`ディレクトリに移動してからコミットメッセージを取得し、そのメッセージを`client-payload`に含めて渡すことができます。

---

## 👤 ユーザー
*2024/05/31 16:31:09*

ちなみに別リポジトリの以下のイベントは取得可能なのか？

on:
  push:
    branches:
      - main
    paths:
      - server-side-repository/openapi.yaml

---

## 🤖 アシスタント
*2024/05/31 16:31:36*

`push`イベントでの情報を`repository_dispatch`イベントに渡すことで、別リポジトリでもその情報を取得することができます。`repository_dispatch`イベントは、別リポジトリに対してイベントをトリガーし、ペイロード情報を渡すために使用されます。以下は、その情報を取得して渡す方法の例です。

### トリガーワークフロー

このワークフローは、`server-side-repository/openapi.yaml`に変更があったときに実行されます。そして、`repository_dispatch`イベントを使って別リポジトリのワークフローをトリガーします。

```yaml
name: Trigger update-open-api-spec

on:
  push:
    branches:
      - main
    paths:
      - server-side-repository/openapi.yaml
  workflow_dispatch:

env:
  ios_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  event_type: update-open-api-spec

jobs:
  trigger-codegen:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Server Side repo
        uses: actions/checkout@v4

      - name: Get commit message
        id: get_commit_message
        run: echo "commit_message=$(git log -1 --pretty=format:'%s')" >> $GITHUB_OUTPUT

      - name: Trigger iOS repo workflow
        uses: peter-evans/repository-dispatch@v3
        with:
          token: ${{ secrets.IOS_TEAM_PAT }} # Permission: repo, read:org, project
          repository: ${{ env.ios_repo }}
          event-type: ${{ env.event_type }}
          client-payload: '{"ref": "${{ github.ref }}", "sha": "${{ github.sha }}", "branch": "${{ github.ref_name }}", "commit_message": "${{ steps.get_commit_message.outputs.commit_message }}"}'
```

### 実行ワークフロー

このワークフローは、`repository_dispatch`イベントを受け取り、コミットメッセージを含むペイロードを使って処理を行います。

```yaml
name: Code Gen From OpenAPI Spec

on:
  repository_dispatch:
    types: [update-open-api-spec]
  workflow_dispatch:

permissions:
  contents: write
  pull-requests: write

env:
  ios_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  ios_openapi_path: schema/openapi.yaml
  server_side_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  server_side_openapi_path: server-side-repository/openapi.yaml

jobs:
  code-gen-from-open-api-spec:
    runs-on: macos-14
    env:
      DEVELOPER_DIR: /Applications/Xcode_15.4.app/Contents/Developer

    timeout-minutes: 300

    steps:
    - name: Checkout iOS repo
      uses: actions/checkout@v4
      with:
        repository: ${{ env.ios_repo }}
        path: ios-repo

    - name: Checkout Server Side repo
      uses: actions/checkout@v4
      with:
        repository: ${{ env.server_side_repo }}
        path: server-repo
        ref: ${{ github.event.client_payload.ref || 'refs/heads/main' }}

    - name: Check for differences in OpenAPI spec
      id: check_diff
      run: |
        if diff server-repo/${{ env.server_side_openapi_path }} ios-repo/${{ env.ios_openapi_path }}; then
          echo "changes_detected=false" &gt;&gt;

---
