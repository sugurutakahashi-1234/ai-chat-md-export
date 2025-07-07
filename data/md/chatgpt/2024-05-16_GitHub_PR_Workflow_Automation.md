# GitHub PR Workflow Automation

日付: 2024-05-16

---

## 👤 ユーザー
*2024/5/16 11:56:58*

これのnameを考えてほしい。いくつか候補を上げて

name:  

on:
  pull\_request:
    types:
      - opened
      - reopened
      - ready\_for\_review
      - closed

env:
  gh\_token: ${{ secrets.IOS\_TEAM\_PAT }} # IOS\_TEAM\_PAT: project, read:org, repo
  gh\_organization: suguruTakahashi-1234
  project\_id: 1
  in\_review\_issue: In Review (Issue)
  in\_review\_pr: 👀 In Review (PR)
  qa\_accept: QA Accept
  done: ✅ Done

jobs:
  move\_issue\_on\_pr\_open:
    name: move\_issue\_on\_pr\_open
    runs-on: ubuntu-latest
    if: github.event\_name == 'pull\_request' && (github.event.action == 'opened' || github.event.action == 'reopened' || github.event.action == 'ready\_for\_review')
    steps:
      - name: Move to ${{ env.in\_review\_issue }}
        uses: leonsteinhaeuser/project-beta-automations@v2.1.0
        with:
          gh\_token: ${{ env.gh\_token }}
          user: ${{ env.gh\_organization }}
          # organization: ${{ env.gh\_organization }}
          project\_id:  ${{ env.project\_id }}
          resource\_node\_id: ${{ github.event.pull\_request.node\_id }}
          status\_value: ${{ env.in\_review\_issue }}
          move\_related\_issues: true

  move\_pr\_on\_pr\_open:
    name: move\_pr\_on\_pr\_open
    runs-on: ubuntu-latest
    if: github.event\_name == 'pull\_request' && (github.event.action == 'opened' || github.event.action == 'reopened' || github.event.action == 'ready\_for\_review')
    steps:
      - name: Move to ${{ env.in\_review\_pr }}
        uses: leonsteinhaeuser/project-beta-automations@v2.1.0
        with:
          gh\_token: ${{ env.gh\_token }}
          user: ${{ env.gh\_organization }}
          # organization: ${{ env.gh\_organization }}
          project\_id:  ${{ env.project\_id }}
          resource\_node\_id: ${{ github.event.pull\_request.node\_id }}
          status\_value: ${{ env.in\_review\_pr }}
          move\_related\_issues: false

  move\_issue\_on\_pr\_closed:
    name: move\_issue\_on\_pr\_closed
    runs-on: ubuntu-latest
    if: github.event\_name == 'pull\_request' && (github.event.action == 'closed')
    steps:
      - name: Move to ${{ env.qa\_accept }}
        uses: leonsteinhaeuser/project-beta-automations@v2.1.0
        with:
          gh\_token: ${{ env.gh\_token }}
          user: ${{ env.gh\_organization }}
          # organization: ${{ env.gh\_organization }}
          project\_id:  ${{ env.project\_id }}
          resource\_node\_id: ${{ github.event.pull\_request.node\_id }}
          status\_value: ${{ env.qa\_accept }}
          move\_related\_issues: true

  move\_pr\_on\_pr\_closed:
    name: move\_pr\_on\_pr\_closed
    runs-on: ubuntu-latest
    if: github.event\_name == 'pull\_request' && (github.event.action == 'closed')
    steps:
      - name: Move to ${{ env.done }}
        uses: leonsteinhaeuser/project-beta-automations@v2.1.0
        with:
          gh\_token: ${{ env.gh\_token }}
          user: ${{ env.gh\_organization }}
          # organization: ${{ env.gh\_organization }}
          project\_id:  ${{ env.project\_id }}
          resource\_node\_id: ${{ github.event.pull\_request.node\_id }}
          status\_value: ${{ env.done }}
          move\_related\_issues: false

---

## 🤖 アシスタント
*2024/5/16 11:57:00*

以下はGitHub Actionsワークフローのnameの候補です：

1. \*\*"PR Issue Management Workflow"\*\*
2. \*\*"Pull Request Status Automation"\*\*
3. \*\*"Project Board PR Handler"\*\*
4. \*\*"Issue and PR Workflow Automation"\*\*
5. \*\*"PR Lifecycle Manager"\*\*
6. \*\*"Pull Request Board Updater"\*\*
7. \*\*"Automated PR Status Updates"\*\*
8. \*\*"PR and Issue State Synchronization"\*\*

これらの名前は、ワークフローの目的や機能に基づいて選んだものです。ご希望に沿った名前を選んでください。

---

## 👤 ユーザー
*2024/5/16 11:57:35*

Kanban という名前を使ってほしい

---

## 🤖 アシスタント
*2024/5/16 11:57:39*

以下は「Kanban」を含むGitHub Actionsワークフローのnameの候補です：

1. \*\*"Kanban PR Issue Management"\*\*
2. \*\*"Kanban Pull Request Automation"\*\*
3. \*\*"Kanban Project Board PR Handler"\*\*
4. \*\*"Kanban Issue and PR Workflow"\*\*
5. \*\*"Kanban PR Lifecycle Manager"\*\*
6. \*\*"Kanban Pull Request Updater"\*\*
7. \*\*"Kanban PR Status Automation"\*\*
8. \*\*"Kanban PR and Issue Synchronization"\*\*

これらの名前は、Kanbanの概念に基づいてワークフローの目的を反映しています。ご希望に沿った名前を選んでください。

---
