# GitHub PR Workflow Automation

日付: 2024-05-16

---

## 👤 ユーザー
*2024/5/16 11:56:58*

これのnameを考えてほしい。いくつか候補を上げて

name:  

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

## 🤖 アシスタント
*2024/5/16 11:57:00*

以下はGitHub Actionsワークフローのnameの候補です：

1. **"PR Issue Management Workflow"**
2. **"Pull Request Status Automation"**
3. **"Project Board PR Handler"**
4. **"Issue and PR Workflow Automation"**
5. **"PR Lifecycle Manager"**
6. **"Pull Request Board Updater"**
7. **"Automated PR Status Updates"**
8. **"PR and Issue State Synchronization"**

これらの名前は、ワークフローの目的や機能に基づいて選んだものです。ご希望に沿った名前を選んでください。

---

## 👤 ユーザー
*2024/5/16 11:57:35*

Kanban という名前を使ってほしい

---

## 🤖 アシスタント
*2024/5/16 11:57:39*

以下は「Kanban」を含むGitHub Actionsワークフローのnameの候補です：

1. **"Kanban PR Issue Management"**
2. **"Kanban Pull Request Automation"**
3. **"Kanban Project Board PR Handler"**
4. **"Kanban Issue and PR Workflow"**
5. **"Kanban PR Lifecycle Manager"**
6. **"Kanban Pull Request Updater"**
7. **"Kanban PR Status Automation"**
8. **"Kanban PR and Issue Synchronization"**

これらの名前は、Kanbanの概念に基づいてワークフローの目的を反映しています。ご希望に沿った名前を選んでください。

---
