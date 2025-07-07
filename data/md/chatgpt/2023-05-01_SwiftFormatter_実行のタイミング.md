# SwiftFormatter 実行のタイミング

日付: 2023-05-01

---

## 👤 ユーザー
*2023/5/1 11:01:44*

SwiftFormatter はいつRunするのがいい？

---

## 🤖 アシスタント
*2023/5/1 11:01:49*

SwiftFormatterは、コードをフォーマットして整形するためのツールであり、コードのスタイルや規約に従ってコードを整えることができます。SwiftFormatterは、通常、コードがバージョン管理システムにコミットされる前に自動的に実行されることが推奨されます。これにより、コードのスタイルや規約に従って一貫性が保たれ、コードレビューの効率が向上する可能性があります。

また、開発環境にSwiftFormatterを統合して、保存時に自動的に実行することもできます。これにより、コードを手動で整形する必要がなくなり、開発者はコードの品質に集中することができます。

ただし、SwiftFormatterが自動的に実行される場合でも、必ずしもすべてのコードに対して適用されるわけではありません。特に、既存のコードに対してSwiftFormatterを実行する場合は、影響を受けるコードの範囲を十分に理解したうえで実行する必要があります。

---

## 👤 ユーザー
*2023/5/1 11:02:25*

SwiftFormatter をdevelopブランチにマージされる前に実行するにはどうすればいい？

---

## 🤖 アシスタント
*2023/5/1 11:02:31*

SwiftFormatterをdevelopブランチにマージする前に実行するには、次の手順に従うことができます。

1. SwiftFormatterをプロジェクトに統合する。SwiftFormatterには、CocoaPodsやCarthageなどの依存関係マネージャーを使用して統合することができます。また、SwiftPackageManagerを使用することもできます。

2. pre-commit hookを設定する。pre-commit hookは、git commitコマンドを実行する前に自動的に実行されるスクリプトです。SwiftFormatterをpre-commit hookに設定することで、コミット前にコードがフォーマットされるようになります。以下は、pre-commit hookを設定する方法の例です。

```
#!/bin/sh

if git rev-parse --verify HEAD >/dev/null 2>&1 ; then
    against=HEAD
else
    # Initial commit: diff against an empty tree object
    against=$(git hash-object -t tree /dev/null)
fi

# Use SwiftFormatter to format the staged files
swiftformat --config .swiftformat --lint --verbose --cache ignore --ignore comments --filelist "$(git diff --cached --name-only --diff-filter=ACM -- '*.swift')" -- "$@"

# Add the formatted files to the staging area
git add .
```

上記のスクリプトでは、git diffコマンドを使用して、ステージングエリアに追加された.swiftファイルのみをフォーマットします。--configオプションを使用して、SwiftFormatterの設定ファイルを指定し、--lintオプションを使用して、フォーマットエラーがある場合に警告を表示します。

3. developブランチにマージする前に、コードをフォーマットするためのスクリプトを実行します。これにより、すべてのコミットがフォーマットされ、開発ブランチにマージされる前にコードが整形されます。

以上の手順に従うことで、SwiftFormatterを使用して、開発ブランチにマージされる前にコードをフォーマットすることができます。

---

## 👤 ユーザー
*2023/5/1 11:05:05*

SwiftPackageManager で SwiftFormatter  を導入しているんだけど pre-commit hook をGithub Actions に設定するにはどうしたらいいの？

---

## 🤖 アシスタント
*2023/5/1 11:05:12*

GitHub Actionsを使用してpre-commit hookを設定するには、以下の手順に従ってください。

1. GitHubリポジトリで、.github/workflowsディレクトリを作成します。

2. .github/workflowsディレクトリ内に、pre-commit.ymlなどの名前のファイルを作成します。

3. 作成したファイルに、次のような内容を記述します。

```
name: pre-commit

on: [push]

jobs:
  pre-commit:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@v2
    - name: Setup Swift
      uses: actions/setup-swift@v2
      with:
        swift-version: '5.5'
    - name: Install SwiftFormat
      run: swift package resolve
    - name: Run SwiftFormat
      run: swift run swiftformat .
```

上記のYAMLファイルでは、GitHub Actionsを使用して、pushイベントがトリガーされたときに、SwiftPackageManagerを使用してSwiftFormatをインストールし、プロジェクトのルートディレクトリ内のすべての.swiftファイルをフォーマットします。

4. GitHubリポジトリのSettingsページで、Secretsを設定します。以下のような名前で、GitHub Actionsで使用するためのパーソナルアクセストークンを追加します。

```
Name: SWIFT_ACCESS_TOKEN
Value: {Personal Access Token}
```

5. GitHubリポジトリで、pre-commit hookをトリガーするための.git/hooks/pre-commitファイルを作成します。

```
#!/bin/bash

SWIFT_ACCESS_TOKEN=${SWIFT_ACCESS_TOKEN:-''}
if [ -z "$SWIFT_ACCESS_TOKEN" ]; then
  echo "SWIFT_ACCESS_TOKEN is not set."
  exit 1
fi

swift package update
swift run swiftformat --lint --config .swiftformat --cache ignore --ignore comments --swiftversion 5.5 --filelist $(git diff --cached --name-only --diff-filter=ACM -- '*.swift')
```

6. pre-commitファイルを実行可能にします。

```
chmod +x .git/hooks/pre-commit
```

以上の手順に従うことで、GitHub Actionsを使用してpre-commit hookを設定し、SwiftPackageManagerでSwiftFormatを使用して、コードをフォーマットすることができます。

---

## 👤 ユーザー
*2023/5/1 11:08:27*

SWIFT\_ACCESS\_TOKEN ってなに？

---

## 🤖 アシスタント
*2023/5/1 11:08:31*

SWIFT\_ACCESS\_TOKENは、SwiftPackageManagerがGitHubから依存関係をダウンロードするために必要な、GitHubのパーソナルアクセストークンです。SwiftPackageManagerは、パッケージをダウンロードするために、GitHubのAPIを使用します。パーソナルアクセストークンを使用すると、API制限を回避し、プライベートリポジトリからのパッケージのダウンロードも可能になります。

GitHubからパーソナルアクセストークンを生成するには、次の手順に従います。

1. GitHubのSettingsページを開き、左側のメニューからDeveloper settingsをクリックします。

2. Personal access tokensを選択します。

3. Generate new tokenをクリックします。

4. トークンに名前を付け、必要な権限を付与します。

5. トークンを生成する前に、scopesセクションでrepoスコープを選択し、依存関係をダウンロードするために必要な権限を付与します。

6. トークンを生成します。

7. 生成されたトークンをSWIFT\_ACCESS\_TOKENという名前でGitHub ActionsのSecretsに追加します。

SWIFT\_ACCESS\_TOKENを設定することで、SwiftPackageManagerがGitHubから依存関係をダウンロードする際に、トークンを使用してAPI制限を回避することができます。

---
