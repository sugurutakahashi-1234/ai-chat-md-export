# Automate Release Notes

Date: 2023-08-15

---

## 👤 User
*2023-08-15 10:08:18*

リリースノートを自動化したいので、.github/release.ymlを生成してほしい。

---

## 🤖 Assistant
*2023-08-15 10:08:54*

リリースノートの自動生成を行うために、GitHub Actionsを活用すると、簡単に自動化できます。以下は、`release-drafter`というツールを利用して、リリースノートを自動生成するための`.github/release.yml`の例です。

```yaml
name: Release Drafter
on:
  push:
    # リリースノートの生成をトリガーするブランチを指定します。この場合、mainブランチです。
    branches:
      - main

jobs:
  update_release_draft:
    runs-on: ubuntu-latest
    steps:
      # release-drafter/release-drafterのGitHub Actionsを使用します。
      - uses: release-drafter/release-drafter@v5
        with:
          # GitHubトークンを設定します。これにより、Actionがリポジトリにアクセスできます。
          github-token: ${{ secrets.GITHUB_TOKEN }}
          # カスタム設定ファイルのパスを指定します。これは、リリースノートのフォーマットやカテゴリ分けの設定などを含みます。
          config-name: .github/release-drafter.yml
```

上記の設定に加えて、`.github/release-drafter.yml`という設定ファイルも作成する必要があります。以下はその例です：

```yaml
# リリースノートのテンプレートを設定します。
name-template: 'v$NEXT_PATCH_VERSION 🚀'
tag-template: 'v$NEXT_PATCH_VERSION'
categories:
  - title: '🚀 Features'
    labels:
      - 'feature'
  - title: '🐛 Bug Fixes'
    labels:
      - 'bug'
  - title: '📖 Documentation'
    labels:
      - 'documentation'
  - title: '🚧 Work In Progress'
    labels:
      - 'wip'
```

この設定を使用すると、PRがマージされるたびに、`release-drafter`がリリースノートのドラフトを更新します。それぞれのPRは、付与されたラベルに基づいてカテゴリに分類されます。

リリースを行う際には、手動でドラフトを確認し、適切なバージョン番号を設定して公開することができます。

---

## 👤 User
*2023-08-15 10:09:20*

Githubの公式の機能でこんなのがあるはずなんだけど

# .github/release.yml

changelog:
  exclude:
    labels:
      - ignore-for-release
    authors:
      - octocat
  categories:
    - title: Breaking Changes 🛠
      labels:
        - Semver-Major
        - breaking-change
    - title: Exciting New Features 🎉
      labels:
        - Semver-Minor
        - enhancement
    - title: Other Changes
      labels:
        - "*"

---

## 🤖 Assistant
*2023-08-15 10:09:42*

申し訳ございません、おっしゃるとおり、GitHubはリリースノートの自動生成をサポートする公式の機能を提供しています。

あなたが共有してくれた`.github/release.yml`の内容は、GitHubの公式の機能に基づいています。この機能を使うことで、GitHub Releasesに新しいリリースを作成する際、自動的にリリースノートが生成されます。

指定した内容に基づいて、この`release.yml`は以下の振る舞いをします：

- `ignore-for-release`ラベルが付いたPull Requestsや、`octocat`ユーザーによって作成されたPull Requestsは、リリースノートから除外されます。
- `Semver-Major`または`breaking-change`のラベルが付いたPull Requestsは、「Breaking Changes 🛠」カテゴリに分類されます。
- `Semver-Minor`または`enhancement`のラベルが付いたPull Requestsは、「Exciting New Features 🎉」カテゴリに分類されます。
- それ以外のすべてのPull Requestsは、「Other Changes」カテゴリに分類されます。

この設定ファイルをリポジトリの`.github`ディレクトリに配置するだけで、次回のGitHubリリース時に、この設定に基づいてリリースノートが自動的に生成されます。

---

## 👤 User
*2023-08-15 10:11:22*

デフォルトのラベルしかないけど、これらのラベルをもとに.github/release.ymlを生成してほしい。わざわざカテゴライズする必要がないものはOther Changesでいいよ

bug
documentation
duplicate
enhancement
good first issue
help wanted
invalid
question
wontfix

---

## 🤖 Assistant
*2023-08-15 10:11:44*

了解しました。GitHubのデフォルトラベルに基づいて`.github/release.yml`を生成します。以下がその内容です：

```yaml
changelog:
  exclude:
    labels:
      - duplicate
      - invalid
      - wontfix
  categories:
    - title: Bug Fixes 🐛
      labels:
        - bug
    - title: Documentation Updates 📖
      labels:
        - documentation
    - title: New Enhancements ✨
      labels:
        - enhancement
    - title: Good First Issues 🌱
      labels:
        - good first issue
    - title: Help Wanted 🤝
      labels:
        - help wanted
    - title: Questions & Discussions 💬
      labels:
        - question
    - title: Other Changes
      labels:
        - "*"
```

- `duplicate`, `invalid`, `wontfix`のラベルがついたPull Requestsはリリースノートから除外されます。
- 他のラベルは、それぞれのカテゴリにマッピングされます。
- どのラベルもマッチしないPull Requestsは「Other Changes」カテゴリに分類されます。

この設定ファイルを`.github`ディレクトリに追加することで、次回のリリース時にこれらの設定を元にリリースノートが自動生成されます。

---

## 👤 User
*2023-08-15 10:25:51*

クエリパラメータ付きのリリースフォームのための自動化にって、リリースノート作成を自動化したい。

tagとtitleは一致するようにして、prereleaseについてチェックをつけてほしい。

---

## 🤖 Assistant
*2023-08-15 10:26:18*

GitHub Actionsを使用して、クエリパラメータ付きのリリースフォームを自動的に生成することができます。以下の手順でこれを実現できます：

1. 新しいGitHub Actionsワークフローを`.github/workflows/release.yml`として作成します。
2. このワークフローは、新しいタグがpushされたときにトリガーされます。
3. ワークフローの中で、新しいリリースを作成し、`prerelease`をtrueに設定します。

以下は具体的なワークフローの例です：

```yaml
name: Automated Release

on:
  push:
    tags:
      - '*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - name: Create GitHub Release
        uses: actions/create-release@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          tag_name: ${{ github.ref }}
          release_name: ${{ github.ref }}
          prerelease: true
```

このワークフローは、新しいタグがpushされるたびに実行されます。そして、`actions/create-release@v1`を使って新しいリリースを作成します。作成されるリリースのタグ名とリリース名は、pushされたタグの名前になります。さらに、`prerelease`が`true`に設定されているので、新しいリリースはプレリリースとしてマークされます。

これで、リリースノートの自動生成と、プレリリースのマークが自動的に行われるようになりました。

---

## 👤 User
*2023-08-15 10:29:35*

GithubActionを使うのではなくて、	https://github.com/octo-org/octo-repo/releases/new?tag=v1.0.1 みたいな感じでクエリパラメーターで設定する公式の機能を使いたい

---

## 🤖 Assistant
*2023-08-15 10:30:10*

了解しました。GitHubは、リリースページにクエリパラメータを使って事前に情報を埋め込む機能を提供しています。以下の手順で、これを活用してリリースノートの作成を自動化できます。

1. リリースノートを自動生成するスクリプトやツールを利用して、次のリリースに関する情報を取得します。この情報には、タグ、タイトル、リリースノートの内容が含まれます。

2. この情報を元に、以下の形式のURLを生成します。

```
https://github.com/[ユーザー名]/[リポジトリ名]/releases/new?tag=[タグ]&title=[タイトル]&body=[リリースノートの内容]&prerelease=true
```

3. このURLを開くことで、GitHubのリリースページに遷移し、指定した情報が事前に埋め込まれた状態で表示されます。

具体的なステップ：

1. 例として、`generate-release-info.sh`というシェルスクリプトを使用してリリース情報を生成することを考えます。

```bash
#!/bin/bash

# この部分を編集して、実際のリリースノートの生成ロジックに置き換えます。
TAG="v1.0.2"
TITLE="$TAG"
BODY="Generated release notes for $TAG"

# URLを生成します。
URL="https://github.com/octo-org/octo-repo/releases/new?tag=$TAG&title=$TITLE&body=$BODY&prerelease=true"

# URLを出力します。
echo $URL
```

2. スクリプトを実行すると、生成されたURLが出力されます。

3. このURLをブラウザで開くと、指定した情報でGitHubのリリースページが事前に埋められた状態で表示されます。

このアプローチを使用すると、GitHub Actionsを使わずに、GitHubの公式の機能を利用してリリースノートの作成を自動化することができます。

---

## 👤 User
*2023-08-15 10:31:38*

bodyは設定しなくてい。
urlはhttps://github.com/Viagate/emomil-app-iosを

---

## 🤖 Assistant
*2023-08-15 10:31:55*

わかりました。`body`を設定しない場合、リリースの説明部分は空になります。

ご指定のURLに基づいて、次のリリースに関する情報を取得するシンプルなスクリプトの例を以下に示します。

```bash
#!/bin/bash

# こちらの部分を編集して、実際のリリース情報生成ロジックに置き換えてください。
TAG="v1.0.2"
TITLE="$TAG"

# URLを生成します。
URL="https://github.com/Viagate/emomil-app-ios/releases/new?tag=$TAG&title=$TITLE&prerelease=true"

# URLを出力します。
echo $URL
```

このスクリプトを実行すると、生成されたURLが出力されます。そして、このURLをブラウザで開くことで、GitHubのリリースページに遷移し、指定した情報で事前に埋め込まれた状態で表示されます。

このアプローチを使用することで、手動でリリースノートを入力しながらも、他のリリース情報を自動化することができます。

---

## 👤 User
*2023-08-15 10:35:41*

このURLを生成する機能を GitHub  Actions workflow_dispatch: でタグ名を入れるだけで生成してくれるもを

---

## 🤖 Assistant
*2023-08-15 10:36:15*

GitHub Actionsの`workflow_dispatch`イベントを利用すると、手動でワークフローをトリガーできる上、入力を受け取ることも可能です。

以下は、`workflow_dispatch`イベントを利用し、タグ名を入力として受け取り、対応するリリースページのURLを生成するワークフローの例です。

1. リポジトリの`.github/workflows`ディレクトリに、例えば`generate-release-url.yml`という名前で以下のワークフローを保存します。

```yaml
name: Generate Release URL

on:
  workflow_dispatch:
    inputs:
      tag:
        description: 'Tag name for the release (e.g., v1.0.2)'
        required: true

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
    - name: Print the release URL
      run: |
        echo "https://github.com/Viagate/emomil-app-ios/releases/new?tag=${{ github.event.inputs.tag }}&title=${{ github.event.inputs.tag }}&prerelease=true"
```

2. このワークフローを保存後、GitHubリポジトリの`Actions`タブからこの`Generate Release URL`ワークフローを選択します。

3. `Run workflow`ボタンをクリックすると、タグ名の入力ボックスが表示されます。

4. タグ名（例: `v1.0.3`）を入力し、ワークフローを実行します。

5. ワークフローのログに生成されたURLが表示されます。

6. このURLをコピーし、ブラウザで開くことで、指定したタグ名でGitHubのリリースページが事前に埋め込まれた状態で表示されます。

この設定を使用することで、手動でGitHub Actionsをトリガーし、簡単にリリースページのURLを生成できます。

---

## 👤 User
*2023-08-15 10:37:04*

ブランチを設定できるようにして、そのブランチ名をtarget=のクエリパラメーターに追加して欲しい

---

## 🤖 Assistant
*2023-08-15 10:37:43*

了解しました。`workflow_dispatch`イベントを利用し、ブランチ名を入力として受け取り、それを`target`のクエリパラメータとして追加するワークフローの例を以下に示します。

1. リポジトリの`.github/workflows`ディレクトリに、例えば`generate-release-url.yml`という名前で以下のワークフローを保存します。

```yaml
name: Generate Release URL

on:
  workflow_dispatch:
    inputs:
      tag:
        description: 'Tag name for the release (e.g., v1.0.2)'
        required: true
      branch:
        description: 'Target branch for the release (e.g., main)'
        required: true

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
    - name: Print the release URL
      run: |
        echo "https://github.com/Viagate/emomil-app-ios/releases/new?tag=${{ github.event.inputs.tag }}&title=${{ github.event.inputs.tag }}&target=${{ github.event.inputs.branch }}&prerelease=true"
```

2. このワークフローを保存後、GitHubリポジトリの`Actions`タブからこの`Generate Release URL`ワークフローを選択します。

3. `Run workflow`ボタンをクリックすると、タグ名とブランチ名の入力ボックスが表示されます。

4. タグ名（例: `v1.0.3`）とブランチ名（例: `main`）を入力し、ワークフローを実行します。

5. ワークフローのログに生成されたURLが表示されます。

6. このURLをコピーし、ブラウザで開くことで、指定したタグ名とブランチ名でGitHubのリリースページが事前に埋め込まれた状態で表示されます。

この設定を使用することで、手動でGitHub Actionsをトリガーし、タグとブランチ名を元にしたリリースページのURLを簡単に生成できます。

---

## 👤 User
*2023-08-15 10:37:58*

prerelease=trueではなくてprerelease=1らしい

---

## 🤖 Assistant
*2023-08-15 10:38:16*

了解しました。その情報を基に、`prerelease`のクエリパラメータを`1`に設定するようにワークフローを修正します。

以下が修正されたワークフローの例です：

```yaml
name: Generate Release URL

on:
  workflow_dispatch:
    inputs:
      tag:
        description: 'Tag name for the release (e.g., v1.0.2)'
        required: true
      branch:
        description: 'Target branch for the release (e.g., main)'
        required: true

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
    - name: Print the release URL
      run: |
        echo "https://github.com/Viagate/emomil-app-ios/releases/new?tag=${{ github.event.inputs.tag }}&title=${{ github.event.inputs.tag }}&target=${{ github.event.inputs.branch }}&prerelease=1"
```

この修正を適用すると、生成されるリリースページのURLの`prerelease`クエリパラメータは`1`に設定されるようになります。これで、リリースをプレリリースとしてマークする際の指定が正確に行われます。

---

## 👤 User
*2023-08-15 10:41:11*

e.g., v1.0.2 を e.g., 1.0.2+0、e.g., main を e.g., develop に修正して欲しい

---

## 🤖 Assistant
*2023-08-15 10:41:28*

承知しました。ご指定の内容に基づき、ワークフローを修正します。

以下が修正されたワークフローの例です：

```yaml
name: Generate Release URL

on:
  workflow_dispatch:
    inputs:
      tag:
        description: 'Tag name for the release (e.g., 1.0.2+0)'
        required: true
      branch:
        description: 'Target branch for the release (e.g., develop)'
        required: true

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
    - name: Print the release URL
      run: |
        echo "https://github.com/Viagate/emomil-app-ios/releases/new?tag=${{ github.event.inputs.tag }}&title=${{ github.event.inputs.tag }}&target=${{ github.event.inputs.branch }}&prerelease=1"
```

上記のワークフローでは、タグの例示として`1.0.2+0`を、ブランチの例示として`develop`を使用しています。

---

## 👤 User
*2023-08-15 10:41:59*

1.0.2+0, develop が設定されたとした出力を教えて欲しい

---

## 🤖 Assistant
*2023-08-15 10:42:12*

了解しました。`tag`を`1.0.2+0`、`branch`を`develop`として設定した場合、ワークフローのスクリプト部分での出力は次のURLとなります：

```
https://github.com/Viagate/emomil-app-ios/releases/new?tag=1.0.2+0&title=1.0.2+0&target=develop&prerelease=1
```

このURLをブラウザにペーストして開くことで、`Viagate/emomil-app-ios`リポジトリのリリースページが指定されたパラメータで事前に埋め込まれた状態で表示されます。

---

## 👤 User
*2023-08-15 10:44:17*

1.0.0-rc.1 の rc ってどういう意味？

---

## 🤖 Assistant
*2023-08-15 10:44:53*

`rc`は"Release Candidate"の略です。ソフトウェアのリリースプロセスにおける特定の段階を示すために使われることが多いです。以下にその詳細を説明します：

- **Release Candidate (RC)**: これはソフトウェアがプロダクション環境にデプロイされる準備がほぼ整っていることを示しています。つまり、主要なバグが修正され、新しい機能が完全に実装され、広範なテストが行われた後のリリースです。しかし、まだ微細なバグが存在する可能性があるため、最終的なリリース前の最後のテストフェーズとして利用されます。

    - 例：`1.0.0-rc.1` は、`1.0.0`のリリースの最初のリリース候補を示しています。もし新たな問題が見つかった場合、`1.0.0-rc.2`のように連番で新しいリリース候補が作成されることがあります。

- ソフトウェアのバージョン番号には、通常、`major.minor.patch`の3つの部分が含まれますが、`rc`などのサフィックス（接尾辞）は、そのリリースの状態や段階をより詳細に表現するために追加されることがあります。これはセマンティック バージョニング（SemVer）という標準に基づいています。

総じて、`rc`がバージョン番号に含まれる場合、それは該当のソフトウェアが安定してはいるものの、まだ正式リリース前の段階であり、最終的なテストやフィードバックを収集するためのものであることを意味しています。

---
