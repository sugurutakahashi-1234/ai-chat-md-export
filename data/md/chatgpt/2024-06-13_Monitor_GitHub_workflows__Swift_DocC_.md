# Monitor GitHub workflows, Swift-DocC.

日付: 2024-06-13

---

## 👤 ユーザー
*2024/6/13 10:26:44*

複数の名前のワークフローを検知したい。Swift-DocC Hostも咥えたい

/github subscribe crage-inc/Project-SoftBankSNS-iOS issues, pulls, commits:'*', releases, deployments, reviews, branches, comments, workflows:{event:"workflow_dispatch", name:"OpenAPI Spec To Code Gen"}, discussions

---

## 🤖 アシスタント
*2024/6/13 10:26:49*

User wants to detect multiple workflow names and include Swift-DocC Host in the monitoring.

---

## 🔧 ツール
*2024/6/13 10:26:49*

Model set context updated.

---

## 🤖 アシスタント
*2024/6/13 10:26:49*

To set up the GitHub subscription to monitor multiple workflows, including the Swift-DocC Host, you can use the following GitHub CLI command:

```bash
/github subscribe crage-inc/Project-SoftBankSNS-iOS issues, pulls, commits:'*', releases, deployments, reviews, branches, comments, workflows:{event:"workflow_dispatch", name:"OpenAPI Spec To Code Gen", name:"Swift-DocC Host"}, discussions
```

This command subscribes to the specified repository (`crage-inc/Project-SoftBankSNS-iOS`) and includes the desired events, including multiple workflows with their specific names. Make sure to run this command in your GitHub bot or tool that integrates with the GitHub CLI.

---

## 👤 ユーザー
*2024/6/13 10:33:28*

nameを複数書く場合その記述で合ってるの？

---

## 🤖 アシスタント
*2024/6/13 10:33:34*

複数のワークフロー名を記述する場合、フォーマットが正しいかどうかを確認する必要があります。通常、GitHub CLIや統合ツールのドキュメントを確認するのがベストですが、一般的な構文を基に以下のように修正してみてください。

```bash
/github subscribe crage-inc/Project-SoftBankSNS-iOS issues, pulls, commits:'*', releases, deployments, reviews, branches, comments, workflows:{event:"workflow_dispatch", name:"OpenAPI Spec To Code Gen"}, workflows:{event:"workflow_dispatch", name:"Swift-DocC Host"}, discussions
```

このように、`workflows`のセクションを個別に追加することで複数のワークフロー名を指定します。

もしこの方法が正しくない場合は、GitHub CLIのドキュメントやサポートに問い合わせて、正確な構文を確認するのが確実です。

---
