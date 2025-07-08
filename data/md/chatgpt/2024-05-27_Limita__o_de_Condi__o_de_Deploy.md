# Limitação de Condição de Deploy

日付: 2024-05-27

---

## 👤 ユーザー
*2024/5/27 17:18:01*

以下は tbls_gen_docs が更新された時を限定にしたい

name: mkdocs deploy

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: write
  pages: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    timeout-minutes: 300
    steps:
    - name: Checkout repository
      uses: actions/checkout@v4

    - name: Set up Python
      uses: actions/setup-python@v5
      with:
        python-version: '3.x'

    - name: Install mkdocs and plugins
      run: |
        pip install -r requirements.txt

    - name: Build MkDocs site
      run: |
        mkdocs gh-deploy --force

---

## 🤖 アシスタント
*2024/5/27 17:18:20*

tbls_gen_docsが更新された時に限定するためには、GitHub Actionsのワークフローに条件付きのステップを追加することができます。以下のように、`if`ステートメントを使用して、`tbls_gen_docs`ディレクトリが変更された場合にのみデプロイのステップが実行されるように設定します。

```yaml
name: mkdocs deploy

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: write
  pages: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    timeout-minutes: 300
    steps:
    - name: Checkout repository
      uses: actions/checkout@v4

    - name: Set up Python
      uses: actions/setup-python@v5
      with:
        python-version: '3.x'

    - name: Install mkdocs and plugins
      run: |
        pip install -r requirements.txt

    - name: Check if tbls_gen_docs is updated
      id: check_files
      run: |
        if git diff --name-only HEAD^ HEAD | grep -q '^tbls_gen_docs/'; then
          echo "tbls_gen_docs updated"
          echo "::set-output name=updated::true"
        else
          echo "tbls_gen_docs not updated"
          echo "::set-output name=updated::false"
        fi

    - name: Build MkDocs site
      if: steps.check_files.outputs.updated == 'true'
      run: |
        mkdocs gh-deploy --force
```

この設定では、`tbls_gen_docs`ディレクトリ内のファイルが更新された場合にのみ、MkDocsサイトのビルドとデプロイが実行されます。`check_files`ステップでディレクトリの変更を確認し、その結果に基づいてデプロイステップを条件付きで実行します。

---

## 👤 ユーザー
*2024/5/27 17:18:24*

on で設定できないのか？

---

## 🤖 アシスタント
*2024/5/27 17:18:34*

`on`で直接特定のディレクトリやファイルの変更をトリガーに設定することはできません。ただし、`paths`を使って特定のパスの変更に反応するように設定することができます。以下のように、`paths`を使用して`tbls_gen_docs`ディレクトリ内の変更に限定することができます。

```yaml
name: mkdocs deploy

on:
  push:
    branches:
      - main
    paths:
      - 'tbls_gen_docs/**'
  workflow_dispatch:

permissions:
  contents: write
  pages: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    timeout-minutes: 300
    steps:
    - name: Checkout repository
      uses: actions/checkout@v4

    - name: Set up Python
      uses: actions/setup-python@v5
      with:
        python-version: '3.x'

    - name: Install mkdocs and plugins
      run: |
        pip install -r requirements.txt

    - name: Build MkDocs site
      run: |
        mkdocs gh-deploy --force
```

この設定では、`main`ブランチへのプッシュが`tbls_gen_docs`ディレクトリ内のファイルの変更を含んでいる場合にのみワークフローがトリガーされます。`workflow_dispatch`は手動トリガーのために残しています。

---
