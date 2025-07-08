# GitHub Actions 動作確認

Date: 2025-02-21

---

## 👤 User
*2025-02-21 16:12:15*

どういうことかわかる？

GitHub Actionsは非常に便利ですが、何かと歯がゆい部分もいくつかあります。

個人的にかなり困ったのが、ワークフローの動作確認がしづらいこと。

ワークフローのトリガーとなるイベントの一覧が こちら に掲載されていますが、その多くに「このイベントは、ワークフローのファイルがデフォルトブランチに配置されていないとワークフローをトリガーしない」という旨の注意書きがしてあります。
Issueやラベル、workflow_dispatchなんかがこれに該当します。

つまり、これらのイベントをトリガーとするワークフローに関しては、事前に動作確認をすることができないわけですね。
とはいえ、動くかどうかわからないワークフローをデフォルトブランチに混ぜ込むのはそれなりに抵抗があるものです...

GitHub Actionsをローカルで実行できる act もすばらしい選択肢のひとつですが、ちょいちょい GitHub Actionsと異なる挙動をすることがあることと、リポジトリのSecretやGitHub Environmentsの恩恵を受けようとすると設定が面倒だったり、残念ポイントも少なからずあります。


そこで、やや強引ではありますが、GitHub Actionsの「workflow_dispatchをトリガーとするワークフローのファイルがデフォルトブランチにある場合、別ブランチにある同じファイル名のworkflow_dispatchをトリガーとするワークフローも実行することができる」という仕様を利用して、デフォルトブランチ以外に置かれているワークフローの動作確認をする方法をまとめておきます。

注
この方法では、対象のワークフローのトリガーをworkflow_dispatchに書き換える必要があるため、トリガー部分の動作確認をすることはできません。
あくまでジョブ部分の動作確認のみになります。

ざっくりとした解説
やることは、

デフォルトブランチに workflow_dispatchをトリガーとするダミーのワークフローファイル を配置する
別ブランチのダミーのワークフローファイルを編集し、動作確認したいワークフローの内容に書き換える
書き換えたダミーのワークフローを手動で実行する
という流れ。

ただ、2.において以下の2点に気をつける必要があります:

ワークフローの nameを変えない こと
トリガーを workflow_dispatchにする こと

(ジョブの中でトリガーイベントの値を使用する場合は、workflow_dispatchのinputsで手動で入力するようにする)
(実はファイル名さえ同じであればnameは合わせなくても動かせます。
ただ、GitHub Actionsの仕様上、面倒なことになるので合わせておいた方が吉です)

具体例
下記のワークフロー (参考元) の動作確認をする例を書いてみます。
任意のIssueに help-wanted というラベルが貼られるとコメントをするワークフローです:

add-comment.yaml
name: Add comment

on:
  issues:
    types: [ labeled ]

jobs:
  add-comment:
    if: github.event.label.name == 'help-wanted'
    runs-on: ubuntu-latest
    steps:
      - name: Add comment
        uses: peter-evans/create-or-update-comment@v1
        with:
          issue-number: ${{ github.event.issue.number }}
          body: |
            This issue is available for anyone to work on. **Make sure to reference this issue in your pull request.** :sparkles: Thank you for your contribution! :sparkles:
1. デフォルトブランチにworkflow_dispatchをトリガーとするダミーのワークフローファイルを配置する
下記の dummy.yamlをデフォルトブランチに配置します:

dummy.yaml
name: Dummy for test

on:
  workflow_dispatch:

jobs:
  dummy:
    if: ${{ false }}
    runs-on: ubuntu-latest
    steps:
      - run: ""
if: ${{ false }} なのでジョブはかならずスキップされます。もし実行してしまっても一切お財布に影響を与えないはず。

2. 別ブランチのダミーのワークフローファイルを編集し、動作確認したいワークフローの内容に書き換える
別ブランチのdummy.yamlを編集し、以下のとおりに書き換えます:

dummy.yaml
name: Dummy for test  # ここはダミーのままにしておく

on:
  workflow_dispatch:
    inputs:           # イベントの値を手入力するようにする
      issue-number:
        description: issue number
        required: true
      label-name:
        description: label name
        required: true

jobs:
  add-comment:
    if: github.event.inputs.label-name == 'help-wanted'          # 変数名を変える
    runs-on: ubuntu-latest
    steps:
      - name: Add comment
        uses: peter-evans/create-or-update-comment@v1
        with:
          issue-number: ${{ github.event.inputs.issue-number }}  # 変数名を変える
          body: |
            This issue is available for anyone to work on. **Make sure to reference this issue in your pull request.** :sparkles: Thank you for your contribution! :sparkles:
本来 github.event.issue.number とかで取得したい値を、代わりにworkflow_dispatchを経由して入力するようにします。
このやり方であればいろいろなパターンを気軽に試せるので、動作確認にもってこい。

3. 書き換えたダミーのワークフローを手動で実行する
あとは、Dummy for test ワークフローを ブランチを切り替えて手動実行するだけ！

---

## 🤖 Assistant
*2025-02-21 16:12:35*

要するに、GitHub Actionsのワークフローを**デフォルトブランチ以外で動作確認する方法**について説明している。

GitHub Actionsでは、`workflow_dispatch` 以外の多くのトリガー（例えば `issues` や `label` など）が、デフォルトブランチにワークフローファイルがないと動作しない。そのため、**動作確認がしづらい** という問題がある。

### 解決策：
1. **デフォルトブランチに `workflow_dispatch` をトリガーとするダミーのワークフローファイルを配置**
   - `dummy.yaml` を作成し、`workflow_dispatch` だけを定義
   - `if: ${{ false }}` を入れて、実行されないようにする

2. **別ブランチで `dummy.yaml` を編集し、動作確認したいワークフローの内容に書き換える**
   - `workflow_dispatch` で `inputs` を受け取るように変更
   - 本来 `github.event.issue.number` で取得する情報を `inputs` 経由にする

3. **ブランチを切り替えて手動実行**
   - GitHub Actionsのワークフロー実行画面から、該当ブランチの `workflow_dispatch` を実行する

### ポイント：
- `name` は変えない（GitHub Actionsの仕様上、合わせておくのが無難）
- `github.event.issue.number` などのイベントデータを `workflow_dispatch.inputs` で手入力できるようにする
- こうすることで **デフォルトブランチにワークフローファイルを置かなくても、別ブランチのワークフローをテストできる**

この方法を使えば、動作が確実でないワークフローをデフォルトブランチに混ぜるリスクを減らしながら、ジョブ部分のテストができる。

---

## 👤 User
*2025-02-21 16:12:41*

めっちゃなるほどです！

---

## 🤖 Assistant
*2025-02-21 16:12:51*

そう言ってもらえて嬉しいです！😆✨  
GitHub Actionsは便利だけど、こういう動作確認のしづらさが歯がゆいですよね。  
この方法なら安全に試せるので、ぜひ活用してみてください！💪🚀

---
