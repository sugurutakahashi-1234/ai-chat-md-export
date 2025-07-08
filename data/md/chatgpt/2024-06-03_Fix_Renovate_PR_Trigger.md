# Fix Renovate PR Trigger

Date: 2024-06-03

---

## 👤 User
*2024-06-03 20:04:59*

renovateで生成されたPRでも以下のワークフローで反応させたい。on条件が足りないみたいんだけどどうしてだかわかる？

name: Move Issue And PR

on:
  pull_request:
    types:
      - opened
      - reopened
      - ready_for_review
      - closed
      - synchronize

---

## 🤖 Assistant
*2024-06-03 20:05:23*

`Renovate`によって生成されたPRは、デフォルトでは通常のPRとは異なるイベントやタイプでトリガーされる可能性があります。おそらく`Renovate`のPRは、以下の設定でカバーされていないイベントによって作成されているか、特定のフィルタが不足している可能性があります。

まず、`Renovate`のPRが`pull_request`イベントを適切にトリガーするか確認しましょう。次に、ワークフローの`on`条件を見直してみます。`pull_request`イベント自体は、`Renovate`によって生成されたPRに対してもトリガーされるべきですが、`types`に対して不足があるかもしれません。

試してみるべき追加の`types`は以下の通りです：
- `edited`：PRが編集されたときにトリガーされる
- `assigned`：PRがアサインされたときにトリガーされる
- `unassigned`：PRがアサイン解除されたときにトリガーされる
- `labeled`：PRにラベルが追加されたときにトリガーされる
- `unlabeled`：PRからラベルが削除されたときにトリガーされる

以下のように`types`を追加してみてください：

```yaml
name: Move Issue And PR

on:
  pull_request:
    types:
      - opened
      - reopened
      - ready_for_review
      - closed
      - synchronize
      - edited
      - assigned
      - unassigned
      - labeled
      - unlabeled
```

これでもうまくいかない場合、`Renovate`のPRがトリガーするイベントの特定が必要になるかもしれません。`Renovate`のドキュメントや、実際のPRイベントログを確認して、追加する必要のあるイベントタイプを特定することが有用です。

---

## 👤 User
*2024-06-04 10:05:45*

自動生成されたPRについて動いていないみたい。

---

## 🤖 Assistant
*2024-06-04 10:05:59*

`Renovate`のPRに対して特定のトリガーが動作していない場合、`pull_request_target`イベントを試すと解決する場合があります。`pull_request_target`イベントは、他のリポジトリからのPRにも対応するため、`Renovate`によって生成されたPRにも適用される可能性があります。

以下のように`pull_request_target`イベントを追加してみてください：

```yaml
name: Move Issue And PR

on:
  pull_request:
    types:
      - opened
      - reopened
      - ready_for_review
      - closed
      - synchronize
      - edited
      - assigned
      - unassigned
      - labeled
      - unlabeled
  pull_request_target:
    types:
      - opened
      - reopened
      - ready_for_review
      - closed
      - synchronize
      - edited
      - assigned
      - unassigned
      - labeled
      - unlabeled
```

これにより、通常のPRと同様に`Renovate`のPRでもワークフローがトリガーされるはずです。

また、`Renovate`のPRが実際にどのイベントでトリガーされているかを確認するために、以下のようにデバッグ用のワークフローを追加して、イベントログを確認するのも良いでしょう：

```yaml
name: Debug Events

on:
  pull_request:
    types: [opened, reopened, ready_for_review, closed, synchronize, edited, assigned, unassigned, labeled, unlabeled]
  pull_request_target:
    types: [opened, reopened, ready_for_review, closed, synchronize, edited, assigned, unassigned, labeled, unlabeled]

jobs:
  log-events:
    runs-on: ubuntu-latest
    steps:
      - name: Log Event Payload
        run: echo "${{ toJson(github.event) }}"
```

このデバッグワークフローで`Renovate`のPRに関連するイベントがどのようにトリガーされているかを確認し、その情報を基に適切なイベントを追加することができます。

---

## 👤 User
*2024-06-04 10:10:53*

pull_request_target と pull_request の使い分けがわからない。

---

## 🤖 Assistant
*2024-06-04 10:11:10*

`pull_request` と `pull_request_target` の違いはセキュリティと権限の面で重要です。具体的には、以下のような違いがあります。

### `pull_request` イベント

- **セキュリティ制約が厳しい**: 外部からのPR（例えばフォークされたリポジトリからのPR）では、秘密情報（シークレット）や書き込み権限のあるGITHUB_TOKENは提供されません。
- **基本的なイベント**: ほとんどのPRに対して動作しますが、セキュリティ制約のために一部の動作が制限される場合があります。

### `pull_request_target` イベント

- **広範な権限**: `pull_request_target` イベントは、PRのターゲットとなっているリポジトリのコンテキストで実行されます。そのため、GITHUB_TOKENは書き込み権限を持ち、シークレットも使用可能です。
- **高い柔軟性**: セキュリティリスクを管理しつつ、外部からのPRにも対応する必要がある場合に使われます。

### 使い分けの指針

1. **外部からのPRに対する動作が必要な場合**: `pull_request_target` を使用します。これにより、外部のコントリビューターからのPRでもシークレットや書き込み権限を使用するアクションを実行できます。
2. **内部のPRに対する基本的なチェック**: セキュリティ制約が少ないシナリオでは、`pull_request` を使用します。

以下に、`pull_request` と `pull_request_target` を併用するワークフローの例を示します。この方法で、両方のケースに対応できます。

```yaml
name: Move Issue And PR

on:
  pull_request:
    types:
      - opened
      - reopened
      - ready_for_review
      - closed
      - synchronize
      - edited
      - assigned
      - unassigned
      - labeled
      - unlabeled
  pull_request_target:
    types:
      - opened
      - reopened
      - ready_for_review
      - closed
      - synchronize
      - edited
      - assigned
      - unassigned
      - labeled
      - unlabeled

jobs:
  move-issue-pr:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      # 他のジョブステップをここに追加
      - name: Example step
        run: echo "This is a step that will run for both pull_request and pull_request_target events"
```

この設定により、`pull_request` と `pull_request_target` の両方のイベントに対してワークフローが実行され、内部および外部のPR両方に対応できます。

`Renovate`によって生成されたPRに対して動作しない理由は、イベントが適切にトリガーされていないか、追加の権限が必要なためと考えられます。そのため、`pull_request_target` を併用することで問題が解決する可能性が高いです。

---

## 👤 User
*2024-06-04 10:12:01*

以下は pull_request_target に変えて問題ないですか？

name: Auto Assign Reviewers

on:
  pull_request:
    types: [opened, ready_for_review, reopened]

jobs:
  add-reviews:
    runs-on: ubuntu-latest
    steps:
      # Ref: https://github.com/marketplace/actions/auto-assign-action
      - uses: kentaro-m/auto-assign-action@v2.0.0
        with:
          configuration-path: '.github/auto_assign.yml'

---

## 🤖 Assistant
*2024-06-04 10:12:11*

`pull_request` イベントから `pull_request_target` イベントに変更しても問題ない場合がありますが、特に外部からのPRに対してセキュリティ上の考慮が必要な場合には注意が必要です。基本的には、外部からのPRに対しても自動アサインが必要であり、かつシークレットや追加の権限が必要であれば `pull_request_target` を使用することが適しています。

以下に、`pull_request_target` イベントを使用するように変更した例を示します：

```yaml
name: Auto Assign Reviewers

on:
  pull_request_target:
    types: [opened, ready_for_review, reopened]

jobs:
  add-reviews:
    runs-on: ubuntu-latest
    steps:
      # Ref: https://github.com/marketplace/actions/auto-assign-action
      - uses: kentaro-m/auto-assign-action@v2.0.0
        with:
          configuration-path: '.github/auto_assign.yml'
```

この設定により、`pull_request_target` イベントがトリガーされ、外部からのPRにも対応できるようになります。ただし、以下の点に注意してください：

1. **セキュリティリスク**: `pull_request_target` イベントはターゲットリポジトリのコンテキストで実行されるため、悪意のあるPRがシークレットや書き込み権限を利用するリスクがあります。このリスクを理解し、管理する必要があります。
2. **レビューアサインの動作確認**: `kentaro-m/auto-assign-action@v2.0.0` が`pull_request_target` イベントで期待通りに動作するか確認する必要があります。

`pull_request_target` イベントが正しい選択であるかどうかは、あなたのプロジェクトのセキュリティポリシーや具体的なニーズによります。必要に応じて、セキュリティ担当者と相談することもお勧めします。

---

## 👤 User
*2024-06-04 10:17:58*

これは、自分が作ったPRでもディペンボットなどがPRの両方で反応するの？

---

## 🤖 Assistant
*2024-06-04 10:18:10*

`pull_request_target` イベントは、リポジトリのコンテキストで実行されるため、外部のコントリビューターからのPRだけでなく、内部のコントリビューターやDependabotなどのボットからのPRにも反応します。ただし、両方のタイプのPRで意図した通りに動作することを確認するためには、実際にテストすることが重要です。

以下に示すように、`pull_request` と `pull_request_target` の両方を使用することで、すべてのPRに対応することができます。これにより、内部および外部のコントリビューターやDependabotからのPRに対してもワークフローがトリガーされるようになります。

```yaml
name: Auto Assign Reviewers

on:
  pull_request:
    types: [opened, ready_for_review, reopened]
  pull_request_target:
    types: [opened, ready_for_review, reopened]

jobs:
  add-reviews:
    runs-on: ubuntu-latest
    steps:
      # Ref: https://github.com/marketplace/actions/auto-assign-action
      - uses: kentaro-m/auto-assign-action@v2.0.0
        with:
          configuration-path: '.github/auto_assign.yml'
```

### 確認するポイント
1. **内部からのPR**: 自分や他の内部コントリビューターによるPRが期待通りにトリガーされることを確認してください。
2. **外部からのPR**: 外部のコントリビューターによるPRやフォークされたリポジトリからのPRが期待通りにトリガーされることを確認してください。
3. **DependabotやRenovateなどのボットからのPR**: DependabotやRenovateによる自動生成PRが期待通りにトリガーされることを確認してください。

これにより、あらゆるタイプのPRに対してワークフローが動作することを確認できるはずです。必要に応じて、ワークフローのログを確認し、期待通りに動作しているかどうかをテストしてください。

---

## 👤 User
*2024-06-04 10:19:02*

以下はどうだと思う？

name: Auto Set Label

on:
  pull_request:
    types: [opened]
  issues:
    types: [opened]

jobs:
  set-label:
    runs-on: ubuntu-latest
    steps:
      # Ref: github-script https://github.com/actions/github-script
      - uses: actions/github-script@v7
        with:
          script: |
            const isPullRequest = !!context.payload.pull_request;
            const number = isPullRequest ? context.payload.pull_request.number : context.payload.issue.number;

            // 既存のラベルを取得
            const currentIssueOrPR = await github.rest.issues.get({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: number
            });

            if (currentIssueOrPR.data.labels && currentIssueOrPR.data.labels.length &gt; 0) {
              console.log('Labels are already set.');
              return;
            }

            const title = isPullRequest ? context.payload.pull_request.title.toLowerCase() : context.payload.issue.title.toLowerCase();  // 大文字・小文字の区別をしない

            // キーワードとラベルのマッピングを配列で保持
            const keywordMapping = [
              { keywords: ['バグ', '不具合', 'hotfix'], label: 'bug' },
              { keywords: ['開発issue', '運用改善', 'github', 'xcode', '開発改善'], label: 'DX' },
              { keywords: ['技術', '調査', '検証'], label: 'tech research' },
              { keywords: ['ドキュメン', 'readme', 'issue template', 'issue テンプレート'], label: 'documentation' }
            ];

            let labelToApply = 'enhancement';  // デフォルトのラベル

            // キーワードを検査して該当するラベルを見つける
            for (const mapping of keywordMapping) {
              if (mapping.keywords.some(keyword =&gt; title.includes(keyword.toLowerCase()))) {  // 大文字・小文字の区別をしない
                labelToApply = mapping.label;
                break;
              }
            }

            // ラベルを付与
            github.rest.issues.addLabels({
              issue_number: number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              labels: [labelToApply]
            });

---

## 🤖 Assistant
*2024-06-04 10:19:07*

あなたの提案するワークフローは、PRとIssueのタイトルに基づいて適切なラベルを自動で設定するためのものです。以下に示すように、現状でも十分機能すると思われますが、いくつかの改良点と確認事項を追加します。

### 改良点
1. **ラベルが既に設定されているかの確認をシンプルに**: 既存のラベルがある場合のチェックを少し簡素化します。
2. **ラベルの追加処理をより明確に**: `addLabels`の結果をログに出力して、デバッグしやすくします。

以下は改良版のワークフローです：

```yaml
name: Auto Set Label

on:
  pull_request:
    types: [opened]
  issues:

---
