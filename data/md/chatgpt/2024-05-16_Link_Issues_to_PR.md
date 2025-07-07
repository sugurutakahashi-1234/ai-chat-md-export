# Link Issues to PR

日付: 2024-05-16

---

## 👤 ユーザー
*2024/5/16 12:23:20*

commit メッセージに含まれる issue を PR にリンクする GitHub Actions

---

## 🤖 アシスタント
*2024/5/16 12:23:38*

To create a GitHub Action that links issues mentioned in commit messages to the corresponding pull request (PR), you can use the GitHub API to update the PR description with links to the issues. Here’s how you can set up a GitHub Action to achieve this:

1. **Create a GitHub Action Workflow File:**

Create a new workflow file in your repository at `.github/workflows/link-issues.yml`.

```yaml
name: Link Issues in Commit Messages to PR

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  link-issues:
    runs-on: ubuntu-latest
    steps:
      - name: Check out repository
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'

      - name: Link issues to PR
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          node -e "
          const { Octokit } = require('@octokit/rest');
          const core = require('@actions/core');
          const github = require('@actions/github');

          const token = process.env.GITHUB_TOKEN;
          const octokit = new Octokit({ auth: token });

          const { context } = github;
          const prNumber = context.payload.pull_request.number;
          const repo = context.repo.repo;
          const owner = context.repo.owner;

          const getCommitMessages = async () => {
            const { data: commits } = await octokit.pulls.listCommits({
              owner,
              repo,
              pull_number: prNumber,
            });
            return commits.map(commit => commit.commit.message);
          };

          const findIssues = (messages) => {
            const issueRegex = /#(\d+)/g;
            const issues = new Set();
            messages.forEach(message => {
              let match;
              while ((match = issueRegex.exec(message)) !== null) {
                issues.add(match[1]);
              }
            });
            return Array.from(issues);
          };

          const updatePrDescription = async (issues) => {
            if (issues.length === 0) return;

            const issueLinks = issues.map(issue => `- Closes #${issue}`).join('\\n');
            const { data: pr } = await octokit.pulls.get({
              owner,
              repo,
              pull_number: prNumber,
            });
            const newBody = `${pr.body}\\n\\n### Linked Issues\\n${issueLinks}`;

            await octokit.pulls.update({
              owner,
              repo,
              pull_number: prNumber,
              body: newBody,
            });
          };

          (async () => {
            const commitMessages = await getCommitMessages();
            const issues = findIssues(commitMessages);
            await updatePrDescription(issues);
          })().catch(error => core.setFailed(error.message));
          "
```

2. **Explanation:**

   - **Checkout repository**: Uses the `actions/checkout` action to check out your repository.
   - **Set up Node.js**: Sets up Node.js environment using the `actions/setup-node` action.
   - **Link issues to PR**: A script that:
     - Fetches commit messages from the PR.
     - Extracts issue numbers using a regular expression.
     - Updates the PR description with links to the issues.

3. **Commit and Push:**

   Commit and push this workflow file to your repository. The GitHub Action will run whenever a PR is opened or synchronized (e.g., when new commits are pushed to the PR branch).

4. **Secrets:**

   Ensure that you have the `GITHUB_TOKEN` secret available in your repository. GitHub automatically provides this token for actions to interact with the GitHub API.

With this setup, whenever a PR is opened or updated with new commits, the GitHub Action will extract issue numbers from the commit messages and update the PR description with links to those issues.

---

## 👤 ユーザー
*2024/5/16 12:23:59*

これを実行するパッケージは存在しないの？

---

## 🤖 アシスタント
*2024/5/16 12:24:17*

現時点では、GitHub Actions Marketplaceに特化したパッケージが存在しない可能性がありますが、次の方法で問題を解決できます。

1. **GitHub Actions Marketplaceで探す**:
   GitHub Actions Marketplaceにはさまざまなアクションがありますが、直接的に「コミットメッセージに含まれるissueをPRにリンクする」アクションは見つけにくいかもしれません。まず、Marketplaceで探してみましょう。

2. **カスタムアクションの作成**:
   必要に応じてカスタムアクションを作成することで、特定の要件に対応できます。以下のステップバイステップの例を参考にしてください。

### カスタムGitHub Actionの作成手順

1. **リポジトリのセットアップ**:
   リポジトリに以下のファイルを追加します。

2. **アクションのスクリプトファイル**:
   `.github/actions/link-issues/action.js`ファイルを作成し、以下のスクリプトを追加します。

   ```javascript
   const core = require('@actions/core');
   const github = require('@actions/github');

   async function run() {
       try {
           const token = core.getInput('GITHUB_TOKEN');
           const octokit = github.getOctokit(token);
           const context = github.context;

           const prNumber = context.payload.pull_request.number;
           const repo = context.repo.repo;
           const owner = context.repo.owner;

           const { data: commits } = await octokit.rest.pulls.listCommits({
               owner,
               repo,
               pull_number: prNumber,
           });

           const issueRegex = /#(\d+)/g;
           const issues = new Set();

           commits.forEach(commit => {
               let match;
               while ((match = issueRegex.exec(commit.commit.message)) !== null) {
                   issues.add(match[1]);
               }
           });

           if (issues.size > 0) {
               const issueLinks = Array.from(issues).map(issue => `- Closes #${issue}`).join('\n');
               const { data: pr } = await octokit.rest.pulls.get({
                   owner,
                   repo,
                   pull_number: prNumber,
               });
               const newBody = `${pr.body}\n\n### Linked Issues\n${issueLinks}`;

               await octokit.rest.pulls.update({
                   owner,
                   repo,
                   pull_number: prNumber,
                   body: newBody,
               });
           }
       } catch (error) {
           core.setFailed(error.message);
       }
   }

   run();
   ```

3. **アクションのメタデータファイル**:
   `.github/actions/link-issues/action.yml`ファイルを作成し、以下の内容を追加します。

   ```yaml
   name: 'Link Issues to PR'
   description: 'Link issues mentioned in commit messages to the PR'
   inputs:
     GITHUB_TOKEN:
       description: 'GitHub Token'
       required: true
   runs:
     using: 'node12'
     main: 'action.js'
   ```

4. **ワークフローファイル**:
   `.github/workflows/link-issues.yml`ファイルを作成し、以下の内容を追加します。

   ```yaml
   name: Link Issues in Commit Messages to PR

   on:
     pull_request:
       types: [opened, synchronize]

   jobs:
     link-issues:
       runs-on: ubuntu-latest
       steps:
         - name: Check out repository
           uses: actions/checkout@v3

         - name: Link issues to PR
           uses: ./.github/actions/link-issues
           with:
             GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
   ```

これで、プルリクエストが開かれたり更新されたりするたびに、コミットメッセージに含まれるissue番号がPRにリンクされるようになります。

### 既存のパッケージを探す

Marketplaceで既存のアクションを探す場合、次のキーワードで検索してみてください:

- "link issues to pull request"
- "reference issues in commit messages"
- "GitHub API actions"

探した結果、必要なアクションが見つからない場合は、上記のカスタムアクションを使用するのが最も柔軟で確実な方法です。

---

## 👤 ユーザー
*2024/5/16 13:03:26*

探してみてくれないかな？

---

## 🤖 アシスタント
*2024/5/16 13:03:37*

Yes, there are existing GitHub Actions that can help link issues mentioned in commit messages to the corresponding pull request.

1. **PR Commit Messages Action**:
   This action allows you to get commit messages from a pull request and can be used to identify issues referenced in those messages. You can then use this information to update the pull request description accordingly.
   - **Usage**: 
     ```yaml
     - name: pr-commit-messages-action
       uses: hojas/pr-commit-messages-action@v1.0.6
     ```
   - **Details**: [PR Commit Messages Action on GitHub Marketplace](https://github.com/marketplace/actions/pr-commit-messages-action)

2. **Opinionated Commit Message**:
   This action is primarily used to enforce a particular commit message style but also supports fetching commit messages from pull requests, which can then be processed to link issues.
   - **Usage**:
     ```yaml
     - name: Check commit message style
       uses: mristin/opinionated-commit-message@v3.1.1
       with:
         validate-pull-request-commits: 'true'
         github-token: ${{ secrets.GITHUB_TOKEN }}
     ```
   - **Details**: [Opinionated Commit Message on GitHub Marketplace](https://github.com/marketplace/actions/opinionated-commit-message)

3. **PR Commit Body Action**:
   This action adds commit history to the pull request body, which can include linked issues if mentioned in the commit messages.
   - **Usage**:
     ```yaml
     - name: Pull Request Body
       uses: technote-space/pr-commit-body-action@v1.7.3
     ```
   - **Details**: [PR Commit Body Action on GitHub Marketplace](https://github.com/marketplace/actions/pr-commit-body-action)

These actions can be integrated into your workflow to automate the process of linking issues to pull requests based on commit messages. Each of these actions provides different levels of customization and functionality, so you can choose the one that best fits your needs.

---
