# Workflow Subscription Request

Date: 2024-06-04

---

## 👤 User
*2024-06-04 11:02:43*

ワークフロー名を指定したい

/github subscribe org/repo issues, pulls, commits:'*', releases, deployments, reviews, branches, comments, workflows:{event:"pull_request","workflow_dispatch"}, discussions

---

## 🤖 Assistant
*2024-06-04 11:02:45*

こちらのように指定できます：

```
/github subscribe org/repo issues, pulls, commits:'*', releases, deployments, reviews, branches, comments, workflows:{event:"pull_request","workflow_dispatch"}, discussions
```

もし何か追加の指定や変更が必要であれば、教えてください。

---

## 👤 User
*2024-06-04 11:06:16*

OpenAPI Spec To Code Gen というワークフローのみを登録したい

---

## 🤖 Assistant
*2024-06-04 11:06:18*

以下のように特定のワークフロー名を指定して登録することができます：

```plaintext
/github subscribe org/repo workflows:{name:"OpenAPI Spec To Code Gen"}
```

これで、"OpenAPI Spec To Code Gen" ワークフローの実行に関する通知のみが購読されるようになります。他の質問や設定についても、何かあれば教えてください。

---

## 👤 User
*2024-06-04 11:06:30*

先ほどのの記述に追加して欲しい

---

## 🤖 Assistant
*2024-06-04 11:06:33*

先ほどの記述に「OpenAPI Spec To Code Gen」ワークフローを追加する場合、次のように指定できます：

```plaintext
/github subscribe org/repo issues, pulls, commits:'*', releases, deployments, reviews, branches, comments, workflows:{event:"pull_request","workflow_dispatch", name:"OpenAPI Spec To Code Gen"}, discussions
```

これで、「OpenAPI Spec To Code Gen」ワークフローの通知も含めた購読ができます。他に必要な設定があれば教えてください。

---

## 👤 User
*2024-06-04 11:06:57*

workflows の記述は or 条件なの？

---

## 🤖 Assistant
*2024-06-04 11:07:02*

`workflows` の記述において、複数の条件は OR 条件として扱われます。そのため、指定されたイベントや名前のいずれかに該当するワークフローの通知がすべて購読されます。

例えば、以下のように指定すると：

```plaintext
/github subscribe org/repo workflows:{event:"pull_request","workflow_dispatch", name:"OpenAPI Spec To Code Gen"}
```

これは、「pull_request」イベント、「workflow_dispatch」イベント、または「OpenAPI Spec To Code Gen」という名前のいずれかに該当するワークフローの通知を購読することになります。

他に特定の条件や設定が必要であれば教えてください。

---

## 👤 User
*2024-06-04 11:07:17*

pull_request イベントは外して欲しい

---

## 🤖 Assistant
*2024-06-04 11:07:20*

`pull_request`イベントを外し、「workflow_dispatch」イベントと「OpenAPI Spec To Code Gen」という名前のワークフローのみを購読するには、次のように指定できます：

```plaintext
/github subscribe org/repo issues, pulls, commits:'*', releases, deployments, reviews, branches, comments, workflows:{event:"workflow_dispatch", name:"OpenAPI Spec To Code Gen"}, discussions
```

これで、「workflow_dispatch」イベントと「OpenAPI Spec To Code Gen」という名前のワークフローの通知のみが購読されます。他に追加や変更があれば教えてください。

---
