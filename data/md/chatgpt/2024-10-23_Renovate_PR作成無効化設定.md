# Renovate PR作成無効化設定

日付: 2024-10-23

---

## 👤 ユーザー
*2024/10/23 13:01:03*

Renovate PR 作成しない設定

{
    // Ref: https://developer.mend.io/
    // Ref: https://docs.renovatebot.com/configuration-options

    // Renovateの設定スキーマへのURL
    "$schema": "https://docs.renovatebot.com/renovate-schema.json",

    // 基本設定を拡張
    "extends": \[
        "config:recommended"
    \],

    // タイムゾーンの設定
    "timezone": "Asia/Tokyo",

    // PRに自動で付けられるラベル
    "labels": \[\],

    // Renovate botを活性化
    "enabled": true,

    // 自動マージの無効化
    "automerge": false,

    // PR のタイトルと commit message の Prefix
    "commitMessageAction": "\[Renovate\]",

    // Xcode Cloud の CI の無効化
    "commitMessageSuffix": "\[ci skip\]",

    // スケジューリング
    // ref: https://docs.renovatebot.com/configuration-options/#schedule
    "schedule": \["after 10am and before 5pm every weekday"\],

    // 1時間あたりに作成されるPR数を無制限にする（0は無制限を表す）
    "prHourlyLimit": 0,

    // 同時に開けるPRの数を無制限にする（0は無制限を表す）
    "prConcurrentLimit": 0,

    // ブランチ名に使用されるプレフィックス
    "branchPrefix": "feature/renovate-",

    // 使用する基本ブランチ
    "baseBranches": \["$default"\],

    // ブランチ名に厳格な規則を適用
    "branchNameStrict": true,

    // PRタイトルに厳格な規則を適用
    "prTitleStrict": true,

    // "Dependency Dashboard" issueを作成
    "dependencyDashboard": true,

    // "Dependency Dashboard" issue のタイトル
    "dependencyDashboardTitle": "\[Renovate\] ライブラリのバージョンアップ状況の管理",

    // Dependency Dashboard に自動で付けられるラベル
    "dependencyDashboardLabels": \[\],

    // DraftのPRで作成
    "draftPR": true,

    // PR 自動作成の無効化
    "prCreation": "not-pending",
}

---

## 🤖 アシスタント
*2024/10/23 13:01:10*

この設定では、Renovateが新しいPRを自動的に作成しないようにするため、`"prCreation": "not-pending"`が指定されています。ただし、`"enabled": true`とあるため、Renovate自体は活性化されています。

もしPRの作成を完全に無効化したい場合は、以下のように設定を修正することで確実にPRが作成されなくなります：

### 設定の修正例

```json
{
    // 基本設定を拡張
    "extends": [
        "config:recommended"
    ],

    // タイムゾーンの設定
    "timezone": "Asia/Tokyo",

    // PRに自動で付けられるラベル
    "labels": [],

    // Renovate botを無効化
    "enabled": false,

    // 自動マージの無効化
    "automerge": false,

    // スケジューリング
    "schedule": ["after 10am and before 5pm every weekday"],

    // "Dependency Dashboard" issueを作成しない
    "dependencyDashboard": false,

    // PR 自動作成の無効化
    "prCreation": "disabled"
}
```

このように`"enabled": false`と`"prCreation": "disabled"`を指定することで、Renovateが完全に無効化され、PRが作成されることがありません。

---

## 👤 ユーザー
*2024/10/23 13:01:52*

訳してほしい

prCreation¶
When to create the PR for a branch.

Name	Value
type	string
allowedValues	immediate, not-pending, status-success, approval
default	"immediate"
cli	--pr-creation
env	RENOVATE\_PR\_CREATION
This setting tells Renovate when to create PRs:

immediate (default): Renovate creates PRs immediately after creating the corresponding branch
not-pending: Renovate waits until status checks have completed (passed or failed) before raising the PR
status-success: Renovate only creates PRs if/when the the test pass
approval: Renovate creates branches for updates immediately, but creates the PR after getting Dependency Dashboard approval
When prCreation is set to immediate, you'll get a Pull Request and possible associated notification right away when a new update is available. You'll have to wait until the checks have been performed, before you can decide if you want to merge the PR.

When prCreation is set to not-pending, Renovate creates the PR only once all tests have passed or failed. When you get the PR notification, you can take action immediately, as you have the full test results. If there are no checks associated, Renovate will create the PR once 24 hours have elapsed since creation of the commit.

When prCreation is set to status-success, Renovate creates the PR only if all tests have passed. When a branch remains without PR due to a failing test: select the corresponding PR from the Dependency Dashboard, and push your fixes to the branch.

When prCreation is set to approval, Renovate creates the PR only when approved via the Dependency Dashboard. Renovate still creates the branch immediately.

---

## 🤖 アシスタント
*2024/10/23 13:02:03*

\*\*prCreation¶\*\*  
ブランチに対してPRを作成するタイミングを設定します。

| 名前        | 値           |
|-------------|--------------|
| type        | string       |
| allowedValues | immediate, not-pending, status-success, approval |
| default     | "immediate"  |
| cli         | --pr-creation|
| env         | RENOVATE\_PR\_CREATION|

この設定は、RenovateがPRを作成するタイミングを指定します：

- \*\*immediate (デフォルト):\*\* Renovateは対応するブランチを作成した直後にPRを作成します。
- \*\*not-pending:\*\* ステータスチェックが完了する（成功または失敗）まで待ってからPRを作成します。
- \*\*status-success:\*\* テストが成功した場合にのみPRを作成します。
- \*\*approval:\*\* 更新のためのブランチはすぐに作成しますが、Dependency Dashboardの承認を得てからPRを作成します。

- \*\*immediate\*\* に設定されている場合、新しい更新が利用可能になるとすぐにPull Requestが作成され、関連する通知も送信されます。PRをマージするかどうかを決定する前に、チェックの完了を待つ必要があります。

- \*\*not-pending\*\* に設定されている場合、Renovateは全てのテストが成功または失敗するまでPRを作成しません。PRの通知を受け取ると、すぐにアクションを起こすことができ、完全なテスト結果が確認できます。関連するチェックがない場合、コミットの作成から24時間経過後にPRを作成します。

- \*\*status-success\*\* に設定されている場合、全てのテストが成功した場合にのみPRを作成します。テストが失敗してPRが作成されない場合は、Dependency Dashboardから対応するPRを選択し、ブランチに修正をプッシュします。

- \*\*approval\*\* に設定されている場合、Dependency Dashboardで承認された後にのみPRを作成しますが、ブランチ自体は即座に作成されます。

---

## 👤 ユーザー
*2024/10/23 13:02:58*

prCreation に disabledってあるの？

---

## 🤖 アシスタント
*2024/10/23 13:03:04*

summaryRenovateの設定オプションturn0search18

`prCreation`の設定には、`immediate`、`not-pending`、`status-success`、`approval`の4つのオプションがありますが、`disabled`は存在しません。 citeturn0search18

- **immediate（デフォルト）**: ブランチ作成後、すぐにPRを作成します。
- **not-pending**: ステータスチェックが完了するまで待ってからPRを作成します。
- **status-success**: テストが成功した場合にのみPRを作成します。
- **approval**: Dependency Dashboardでの承認を得てからPRを作成します。

PRの自動作成を無効化したい場合は、`prCreation`を`not-pending`に設定し、さらに`enabled`を`false`にすることで、RenovateがPRを作成しなくなります。

```json
{
  "prCreation": "not-pending",
  "enabled": false
}
```

この設定により、Renovateはブランチを作成しますが、PRは作成しません。 citeturn0search18

---

## 👤 ユーザー
*2024/10/23 13:03:26*

not-pending はどういうこと？

---

## 🤖 アシスタント
*2024/10/23 13:03:36*

`prCreation: "not-pending"`は、RenovateがPRを作成するタイミングを制御する設定で、以下のような動作になります：

- \*\*「not-pending」\*\*に設定した場合、Renovateはステータスチェックが完了するまで待ってからPRを作成します。  
  - ステータスチェックとは、CI（継続的インテグレーション）ツールやその他の検証プロセスが実行されることを指し、通常、テストの成功または失敗を含みます。
  - この設定では、ブランチはすぐに作成されますが、PRはその後に作成されます。具体的には、すべてのテストが完了（成功または失敗）するまでPRの作成が保留されます。

### 利点
- テスト結果を確認してからPRに対応できるので、テストが通らない場合のPRを見なくて済むようになります。
- 失敗したPRをレビューする時間を減らし、より効果的な修正対応が可能です。

### 注意点
- もしステータスチェックがない場合、Renovateはコミットが作成されてから24時間後にPRを作成します。

この設定は、テストやビルドが通過するか確認してからPRをレビューしたい場合に適しています。

---

## 👤 ユーザー
*2024/10/23 13:04:46*

ブランチは作成するけどprは作成しないような設定はできないのか？

---

## 🤖 アシスタント
*2024/10/23 13:04:54*

Renovateでブランチは作成するがPRは作成しないようにするには、以下のような設定を行うことで実現できます：

### 設定例

```json
{
  "enabled": true,
  "prCreation": "approval",
  "dependencyDashboard": true
}
```

### 設定の解説

- **`enabled: true`**  
  Renovate自体は有効になります。

- **`prCreation: "approval"`**  
  ブランチは自動的に作成されますが、Dependency Dashboardでの承認がない限りPRは作成されません。この設定によってPRの自動作成が抑制されます。

- **`dependencyDashboard: true`**  
  Dependency Dashboardを有効にして、ブランチの状況を手動で管理できるようにします。Dependency DashboardからPRを作成するかどうかを選択可能です。

この設定により、更新ブランチは自動的に作成されますが、PRは作成されず、Dependency Dashboardで手動承認を行うまでPRが作成されません。これが最も簡単な方法で、PRの作成を抑えつつブランチを作成することができます。

---
