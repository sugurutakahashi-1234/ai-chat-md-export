# OpenAPI Path Conversion

日付: 2024-05-30

---

## 👤 ユーザー
*2024/5/30 17:44:06*

以下を小文字変換

  CLIENT\_OPENAPI\_PATH: client-repo/path/to/openapi.yaml
  SERVER\_OPENAPI\_PATH: server-repo/path/to/openapi.yaml

---

## 🤖 アシスタント
*2024/5/30 17:44:08*

```
client_openapi_path: client-repo/path/to/openapi.yaml
server_openapi_path: server-repo/path/to/openapi.yaml
```

---

## 👤 ユーザー
*2024/5/30 17:48:31*

こういうことってできないの？

name: API Request Code Gen

on:
  repository\_dispatch:
    types: \[openapi-update\]
  workflow\_dispatch:

env:
  # iOS
  ios\_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  ios\_openapi\_path: ${{ env.ios\_repo }}/schema/openapi.yaml
  # Server Side
  server\_side\_repo: suguruTakahashi-1234/swift-openapi-gen-sample
  server\_side\_openapi\_path: ${{ env.server\_side\_repo }}/server-side-repository/openapi.yaml

---

## 🤖 アシスタント
*2024/5/30 17:48:46*

You can use environment variables in a GitHub Actions workflow file, but you need to reference them correctly within the workflow. Here's an example of how you can define and use environment variables in your workflow:

```yaml
name: API Request Code Gen

on:
  repository_dispatch:
    types: [openapi-update]
  workflow_dispatch:

env:
  # iOS
  IOS_REPO: suguruTakahashi-1234/swift-openapi-gen-sample
  # Server Side
  SERVER_SIDE_REPO: suguruTakahashi-1234/swift-openapi-gen-sample

jobs:
  generate-code:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Set iOS OpenAPI path
        run: echo "IOS_OPENAPI_PATH=${{ env.IOS_REPO }}/schema/openapi.yaml" >> $GITHUB_ENV

      - name: Set Server Side OpenAPI path
        run: echo "SERVER_SIDE_OPENAPI_PATH=${{ env.SERVER_SIDE_REPO }}/server-side-repository/openapi.yaml" >> $GITHUB_ENV

      - name: Display paths
        run: |
          echo "iOS OpenAPI path: ${{ env.IOS_OPENAPI_PATH }}"
          echo "Server Side OpenAPI path: ${{ env.SERVER_SIDE_OPENAPI_PATH }}"
```

In this example, `IOS_REPO` and `SERVER_SIDE_REPO` are defined as environment variables. Then, we use steps to set `IOS_OPENAPI_PATH` and `SERVER_SIDE_OPENAPI_PATH` and add them to the environment using `echo` and `>> $GITHUB_ENV`. Finally, we display the paths to verify they are set correctly.

Make sure to replace `actions/checkout@v2` with the appropriate action version or step you need for your workflow.

---

## 👤 ユーザー
*2024/5/30 17:50:08*

GitHubActionsでactions/checkout@v4して作られるディレクトリ構成は？

---

## 🤖 アシスタント
*2024/5/30 17:50:29*

`actions/checkout@v4` はリポジトリのコードをクローンして、デフォルトでは GitHub Actions runner のルートディレクトリに配置します。具体的なディレクトリ構成は、通常次のようになります。

- `${GITHUB_WORKSPACE}`: GitHub Actions runner のルートディレクトリ。デフォルトでは `/home/runner/work/<repository>/<repository>` になります。

リポジトリの内容が `${GITHUB_WORKSPACE}` に配置されるため、リポジトリのルートディレクトリ構成はリポジトリの構造に依存します。例えば、リポジトリが以下のような構成であるとします：

```
.
├── .github
│   └── workflows
│       └── my-workflow.yml
├── src
│   └── main.swift
├── schema
│   └── openapi.yaml
└── README.md
```

`actions/checkout@v4` が実行されると、GitHub Actions runner の `${GITHUB_WORKSPACE}` に同じディレクトリ構成が作成されます：

```
/home/runner/work/<repository>/<repository>
├── .github
│   └── workflows
│       └── my-workflow.yml
├── src
│   └── main.swift
├── schema
│   └── openapi.yaml
└── README.md
```

デフォルトでは、`actions/checkout` はリポジトリのルートディレクトリをチェックアウトします。特定のサブディレクトリにチェックアウトする場合は、`path` オプションを指定できます。

例：

```yaml
- name: Checkout repository
  uses: actions/checkout@v4
  with:
    path: my-subdirectory
```

この設定により、リポジトリの内容は `${GITHUB_WORKSPACE}/my-subdirectory` に配置されます。

以下は、基本的な`actions/checkout@v4`を使用したGitHub Actionsの例です：

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: List directory contents
        run: ls -R
```

このワークフローは、リポジトリの全てのファイルをチェックアウトし、ディレクトリの内容を一覧表示します。

---
