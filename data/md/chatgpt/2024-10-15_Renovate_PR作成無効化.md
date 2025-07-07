# Renovate PR作成無効化

日付: 2024-10-15

---

## 👤 ユーザー
*2024/10/15 14:22:14*

renovate.json PR 作成の無効化

---

## 🤖 アシスタント
*2024/10/15 14:22:21*

Renovateの自動PR作成を無効化するには、`renovate.json`ファイル内で以下のように設定することができます。

1. `prCreation` オプションを `not-pending` に設定することで、PRが自動的に作成されないようにすることができます。`renovate.json` の設定例は以下の通りです。

```json
{
  "extends": ["config:base"],
  "prCreation": "not-pending"
}
```

この設定により、Renovateは依存関係の更新を検出してもPRを作成せず、手動で実行する必要があります。

また、特定のパッケージや更新タイプごとにPRの作成を無効化する場合は、さらに細かい設定が可能ですので、必要に応じて調整してください。

---

## 👤 ユーザー
*2024/10/15 14:22:55*

dependencyDashboard のみを使いたく、branch や prは作成してほしくないんだ。

---

## 🤖 アシスタント
*2024/10/15 14:23:06*

Renovateで`Dependency Dashboard`のみを使用し、ブランチやPRを作成せずに管理したい場合は、以下のように`renovate.json`を設定することができます。

1. `automerge` を無効化し、PR作成を無効にするために `prCreation` を `not-pending` に設定します。
2. `dependencyDashboard` を有効にし、依存関係の更新をダッシュボード上で管理できるようにします。

設定例:

```json
{
  "extends": ["config:base"],
  "prCreation": "not-pending",
  "dependencyDashboard": true,
  "branchConcurrentLimit": 0,
  "updateNotScheduled": true
}
```

### 設定内容の説明:

- `prCreation: "not-pending"`: PRは自動で作成されず、依存関係の更新はダッシュボードにリストされます。
- `dependencyDashboard: true`: Dependency Dashboardの機能を有効化します。
- `branchConcurrentLimit: 0`: ブランチの作成も無効化します。
- `updateNotScheduled: true`: スケジュールされた更新を無効化します。

これにより、Dependency Dashboardのみを使って依存関係の更新を確認し、手動で進めることができます。

---

## 👤 ユーザー
*2024/10/15 14:25:28*

"branchConcurrentLimit": 0, は意味あるの？

---

## 🤖 アシスタント
*2024/10/15 14:25:35*

`"branchConcurrentLimit": 0` は、Renovateが同時に作成できるブランチの数を制限する設定です。しかし、PRやブランチを完全に作成させたくない場合、この設定は実際には意味がありません。なぜなら、`"prCreation": "not-pending"` を設定している場合、PRは作成されず、そのためブランチも作成されません。

つまり、あなたの要望である「Dependency Dashboardのみを使いたく、ブランチやPRは作成しない」という場合、`"branchConcurrentLimit": 0` は不要です。

最終的な設定は以下のようにシンプルにできます：

```json
{
  "extends": ["config:base"],
  "prCreation": "not-pending",
  "dependencyDashboard": true
}
```

この設定で、PRやブランチが作成されず、Dependency Dashboardにのみ更新情報が表示されます。

---
