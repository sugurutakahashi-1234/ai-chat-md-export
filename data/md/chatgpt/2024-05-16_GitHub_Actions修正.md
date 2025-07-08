# GitHub Actions修正

Date: 2024-05-16

---

## 👤 User
*2024-05-16 12:02:12*

いかのjobが上から順に実行されるように修正したい


name: Project Board PR Handler

on:
  pull_request:
    types:
      - opened
      - reopened
      - ready_for_review
      - closed

env:
  gh_token: ${{ secrets.IOS_TEAM_PAT }} # IOS_TEAM_PAT: project, read:org, repo
  gh_organization: suguruTakahashi-1234
  project_id: 1
  in_review_issue: In Review (Issue)
  in_review_pr: 👀 In Review (PR)
  qa_accept: QA Accept
  done: ✅ Done

jobs:
  move_issue_on_pr_open:
    name: move_issue_on_pr_open
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request' && (github.event.action == 'opened' || github.event.action == 'reopened' || github.event.action == 'ready_for_review')
    steps:
      - name: Move to ${{ env.in_review_issue }}
        uses: leonsteinhaeuser/project-beta-automations@v2.1.0
        with:
          gh_token: ${{ env.gh_token }}
          user: ${{ env.gh_organization }}
          # organization: ${{ env.gh_organization }}
          project_id:  ${{ env.project_id }}
          resource_node_id: ${{ github.event.pull_request.node_id }}
          status_value: ${{ env.in_review_issue }}
          move_related_issues: true

  move_pr_on_pr_open:
    name: move_pr_on_pr_open
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request' && (github.event.action == 'opened' || github.event.action == 'reopened' || github.event.action == 'ready_for_review')
    steps:
      - name: Move to ${{ env.in_review_pr }}
        uses: leonsteinhaeuser/project-beta-automations@v2.1.0
        with:
          gh_token: ${{ env.gh_token }}
          user: ${{ env.gh_organization }}
          # organization: ${{ env.gh_organization }}
          project_id:  ${{ env.project_id }}
          resource_node_id: ${{ github.event.pull_request.node_id }}
          status_value: ${{ env.in_review_pr }}
          move_related_issues: false

  move_issue_on_pr_closed:
    name: move_issue_on_pr_closed
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request' && (github.event.action == 'closed')
    steps:
      - name: Move to ${{ env.qa_accept }}
        uses: leonsteinhaeuser/project-beta-automations@v2.1.0
        with:
          gh_token: ${{ env.gh_token }}
          user: ${{ env.gh_organization }}
          # organization: ${{ env.gh_organization }}
          project_id:  ${{ env.project_id }}
          resource_node_id: ${{ github.event.pull_request.node_id }}
          status_value: ${{ env.qa_accept }}
          move_related_issues: true

  move_pr_on_pr_closed:
    name: move_pr_on_pr_closed
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request' && (github.event.action == 'closed')
    steps:
      - name: Move to ${{ env.done }}
        uses: leonsteinhaeuser/project-beta-automations@v2.1.0
        with:
          gh_token: ${{ env.gh_token }}
          user: ${{ env.gh_organization }}
          # organization: ${{ env.gh_organization }}
          project_id:  ${{ env.project_id }}
          resource_node_id: ${{ github.event.pull_request.node_id }}
          status_value: ${{ env.done }}
          move_related_issues: false

---

## 🤖 Assistant
*2024-05-16 12:02:27*

GitHub Actionsでは、jobsの順番を保証するために依存関係を明示的に指定する必要があります。`needs`キーワードを使用してジョブが順番に実行されるように設定できます。以下に、指定された順番でジョブが実行されるように修正した例を示します：

```yaml
name: Project Board PR Handler

on:
  pull_request:
    types:
      - opened
      - reopened
      - ready_for_review
      - closed

env:
  gh_token: ${{ secrets.IOS_TEAM_PAT }} # IOS_TEAM_PAT: project, read:org, repo
  gh_organization: suguruTakahashi-1234
  project_id: 1
  in_review_issue: In Review (Issue)
  in_review_pr: 👀 In Review (PR)
  qa_accept: QA Accept
  done: ✅ Done

jobs:
  move_issue_on_pr_open:
    name: move_issue_on_pr_open
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request' && (github.event.action == 'opened' || github.event.action == 'reopened' || github.event.action == 'ready_for_review')
    steps:
      - name: Move to ${{ env.in_review_issue }}
        uses: leonsteinhaeuser/project-beta-automations@v2.1.0
        with:
          gh_token: ${{ env.gh_token }}
          user: ${{ env.gh_organization }}
          project_id:  ${{ env.project_id }}
          resource_node_id: ${{ github.event.pull_request.node_id }}
          status_value: ${{ env.in_review_issue }}
          move_related_issues: true

  move_pr_on_pr_open:
    name: move_pr_on_pr_open
    runs-on: ubuntu-latest
    needs: move_issue_on_pr_open
    if: github.event_name == 'pull_request' && (github.event.action == 'opened' || github.event.action == 'reopened' || github.event.action == 'ready_for_review')
    steps:
      - name: Move to ${{ env.in_review_pr }}
        uses: leonsteinhaeuser/project-beta-automations@v2.1.0
        with:
          gh_token: ${{ env.gh_token }}
          user: ${{ env.gh_organization }}
          project_id:  ${{ env.project_id }}
          resource_node_id: ${{ github.event.pull_request.node_id }}
          status_value: ${{ env.in_review_pr }}
          move_related_issues: false

  move_issue_on_pr_closed:
    name: move_issue_on_pr_closed
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request' && (github.event.action == 'closed')
    steps:
      - name: Move to ${{ env.qa_accept }}
        uses: leonsteinhaeuser.project-beta-automations@v2.1.0
        with:
          gh_token: ${{ env.gh_token }}
          user: ${{ env.gh_organization }}
          project_id:  ${{ env.project_id }}
          resource_node_id: ${{ github.event.pull_request.node_id }}
          status_value: ${{ env.qa_accept }}
          move_related_issues: true

  move_pr_on_pr_closed:
    name: move_pr_on_pr_closed
    runs-on: ubuntu-latest
    needs: move_issue_on_pr_closed
    if: github.event_name == 'pull_request' && (github.event.action == 'closed')
    steps:
      - name: Move to ${{ env.done }}
        uses: leonsteinhaeuser/project-beta-automations@v2.1.0
        with:
          gh_token: ${{ env.gh_token }}
          user: ${{ env.gh_organization }}
          project_id:  ${{ env.project_id }}
          resource_node_id: ${{ github.event.pull_request.node_id }}
          status_value: ${{ env.done }}
          move_related_issues: false
```

これにより、ジョブが指定された順番で確実に実行されるようになります。`needs`キーワードを使って、前のジョブが成功した後に次のジョブが実行されるようにしています。

---

## 👤 User
*2024-05-16 12:03:55*

move_pr_on_pr_open のあとにmove_issue_on_pr_closed

move_issue_on_pr_closedのあとにmove_pr_on_pr_closed という2つのルールだけでいいよ

---

## 🤖 Assistant
*2024-05-16 12:04:10*

了解しました。2つのルールを設定するために、依存関係を以下のように設定します。

```yaml
name: Project Board PR Handler

on:
  pull_request:
    types:
      - opened
      - reopened
      - ready_for_review
      - closed

env:
  gh_token: ${{ secrets.IOS_TEAM_PAT }} # IOS_TEAM_PAT: project, read:org, repo
  gh_organization: suguruTakahashi-1234
  project_id: 1
  in_review_issue: In Review (Issue)
  in_review_pr: 👀 In Review (PR)
  qa_accept: QA Accept
  done: ✅ Done

jobs:
  move_issue_on_pr_open:
    name: move_issue_on_pr_open
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request' && (github.event.action == 'opened' || github.event.action == 'reopened' || github.event.action == 'ready_for_review')
    steps:
      - name: Move to ${{ env.in_review_issue }}
        uses: leonsteinhaeuser/project-beta-automations@v2.1.0
        with:
          gh_token: ${{ env.gh_token }}
          user: ${{ env.gh_organization }}
          project_id:  ${{ env.project_id }}
          resource_node_id: ${{ github.event.pull_request.node_id }}
          status_value: ${{ env.in_review_issue }}
          move_related_issues: true

  move_pr_on_pr_open:
    name: move_pr_on_pr_open
    runs-on: ubuntu-latest
    needs: move_issue_on_pr_open
    if: github.event_name == 'pull_request' && (github.event.action == 'opened' || github.event.action == 'reopened' || github.event.action == 'ready_for_review')
    steps:
      - name: Move to ${{ env.in_review_pr }}
        uses: leonsteinhaeuser/project-beta-automations@v2.1.0
        with:
          gh_token: ${{ env.gh_token }}
          user: ${{ env.gh_organization }}
          project_id:  ${{ env.project_id }}
          resource_node_id: ${{ github.event.pull_request.node_id }}
          status_value: ${{ env.in_review_pr }}
          move_related_issues: false

  move_issue_on_pr_closed:
    name: move_issue_on_pr_closed
    runs-on: ubuntu-latest
    needs: move_pr_on_pr_open
    if: github.event_name == 'pull_request' && (github.event.action == 'closed')
    steps:
      - name: Move to ${{ env.qa_accept }}
        uses: leonsteinhaeuser/project-beta-automations@v2.1.0
        with:
          gh_token: ${{ env.gh_token }}
          user: ${{ env.gh_organization }}
          project_id:  ${{ env.project_id }}
          resource_node_id: ${{ github.event.pull_request.node_id }}
          status_value: ${{ env.qa_accept }}
          move_related_issues: true

  move_pr_on_pr_closed:
    name: move_pr_on_pr_closed
    runs-on: ubuntu-latest
    needs: move_issue_on_pr_closed
    if: github.event_name == 'pull_request' && (github.event.action == 'closed')
    steps:
      - name: Move to ${{ env.done }}
        uses: leonsteinhaeuser.project-beta-automations@v2.1.0
        with:
          gh_token: ${{ env.gh_token }}
          user: ${{ env.gh_organization }}
          project_id:  ${{ env.project_id }}
          resource_node_id: ${{ github.event.pull_request.node_id }}
          status_value: ${{ env.done }}
          move_related_issues: false
```

この設定では、以下の順序でジョブが実行されます：

1. `move_issue_on_pr_open`
2. `move_pr_on_pr_open` （`move_issue_on_pr_open`が完了した後）
3. `move_issue_on_pr_closed` （`move_pr_on_pr_open`が完了した後）
4. `move_pr_on_pr_closed` （`move_issue_on_pr_closed`が完了した後）

---
