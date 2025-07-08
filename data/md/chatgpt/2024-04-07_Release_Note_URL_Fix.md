# Release Note URL Fix

日付: 2024-04-07

---

## 👤 ユーザー
*2024/4/7 12:15:03*

Slackの通知で$(RELEASE_NOTE_URL) が解決されなかった。

name: Generate Tag & Release Note

on:
  workflow_dispatch:
    inputs:
      tag:
        description: 'Tag name (e.g., 1.0.2, 1.0.2-rc.1)'
        required: true
        default: '0.0.0'

env:
  SLACK_USERNAME: DeployBot
  SLACK_ICON: https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png
  SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK_URL }}

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:

    # Generate Tag & Release Note
    - name: Generate Release Note URL and Validate Tag
      run: |
        # Check tag format
        TAG_FORMAT="^([0-9]+\.[0-9]+\.[0-9]+(-rc\.[0-9]+)?)$"
        if [[ ! "${{ github.event.inputs.tag }}" =~ $TAG_FORMAT ]]; then
          echo "Error: Invalid tag format!"
          exit 1
        fi
        
        # Extract branch name from github.ref
        BRANCH_NAME=$(echo ${{ github.ref }} | sed 's/refs\/heads\///')
        
        # Print the release note URL
        RELEASE_NOTE_URL="https://github.com/suguruTakahashi-1234/DISample/releases/new?tag=${{ github.event.inputs.tag }}&title=${{ github.event.inputs.tag }}&target=$BRANCH_NAME&prerelease=1"
        echo "RELEASE_NOTE_URL=$RELEASE_NOTE_URL" &gt;&gt; $GITHUB_ENV
        echo "Release note URL: $RELEASE_NOTE_URL"
    # Success
    - name: Slack Notification on Success
      uses: rtCamp/action-slack-notify@v2
      if: success()
      env:
        SLACK_TITLE: Generate Tag & Release Note / Success
        SLACK_COLOR: good
        SLACK_MESSAGE: "$(RELEASE_NOTE_URL)"

    # Failure
    - name: Slack Notification on Failure
      uses: rtCamp/action-slack-notify@v2
      if: failure()
      env:
        SLACK_TITLE: Generate Tag & Release Note / Failure
        SLACK_COLOR: danger
        SLACK_MESSAGE: Failure Generate Tag & Release Note

---

## 🤖 アシスタント
*2024/4/7 12:15:29*

The issue you're encountering with the `$(RELEASE_NOTE_URL)` not being resolved in your Slack notification step seems to be due to the way environment variables are referenced within the GitHub Actions workflow, especially when used with external actions like `rtCamp/action-slack-notify`.

In GitHub Actions, environment variables are made accessible to steps via the `env` context, and you correctly appended the `RELEASE_NOTE_URL` to the `$GITHUB_ENV` to make it available as an environment variable for subsequent steps. However, when you attempt to use this variable in the `SLACK_MESSAGE` field of the `rtCamp/action-slack-notify` action, the syntax `$(RELEASE_NOTE_URL)` is not the correct way to reference environment variables within this context.

Instead, you should use the `${{ env.RELEASE_NOTE_URL }}` syntax to reference environment variables. This is the proper way to interpolate environment variables within the GitHub Actions environment, particularly in action parameters.

Here's the corrected snippet for your Slack notification steps:

```yaml
    # Success
    - name: Slack Notification on Success
      uses: rtCamp/action-slack-notify@v2
      if: success()
      env:
        SLACK_TITLE: Generate Tag & Release Note / Success
        SLACK_COLOR: good
        SLACK_MESSAGE: "${{ env.RELEASE_NOTE_URL }}" # Corrected line

    # Failure
    - name: Slack Notification on Failure
      uses: rtCamp/action-slack-notify@v2
      if: failure()
      env:
        SLACK_TITLE: Generate Tag & Release Note / Failure
        SLACK_COLOR: danger
        SLACK_MESSAGE: "Failure Generate Tag & Release Note"
```

In this correction, `SLACK_MESSAGE: "${{ env.RELEASE_NOTE_URL }}"` properly references the `RELEASE_NOTE_URL` environment variable set earlier in your workflow. This change should resolve the issue and correctly display the release note URL in your Slack notifications.

---

## 👤 ユーザー
*2024/4/7 12:18:22*

env を使わない方法はあるのか？

---

## 🤖 アシスタント
*2024/4/7 12:19:00*

`env`を使わない方法として、直接`steps`の出力を利用して環境変数のような値を参照する方法があります。GitHub Actionsでは、あるステップの出力を後続のステップで使用することが可能です。この機能を利用して、`RELEASE_NOTE_URL`をステップの出力として設定し、それをSlack通知ステップで使用することができます。

以下はその方法を適用した例です：

```yaml
jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
    - name: Generate Release Note URL and Validate Tag
      id: generate_release_note
      run: |
        # Check tag format and other commands...

        # Calculate the release note URL
        RELEASE_NOTE_URL="https://github.com/suguruTakahashi-1234/DISample/releases/new?tag=${{ github.event.inputs.tag }}&title=${{ github.event.inputs.tag }}&target=$BRANCH_NAME&prerelease=1"
        
        # Use this command to set the output
        echo "::set-output name=release_note_url::$RELEASE_NOTE_URL"
      # Other required fields...
      
    - name: Slack Notification on Success
      uses: rtCamp/action-slack-notify@v2
      if: success()
      with:
        SLACK_TITLE: Generate Tag & Release Note / Success
        SLACK_COLOR: good
        # Use the output from the previous step here
        SLACK_MESSAGE: "${{ steps.generate_release_note.outputs.release_note_url }}"
```

この変更により、`env`を使わずに`RELEASE_NOTE_URL`をSlack通知ステップで使用することが可能になります。`id`を設定したステップで`echo "::set-output name=release_note_url::$RELEASE_NOTE_URL"`コマンドを使って出力を設定し、その後`steps.<step_id>.outputs.<output_name>`の形式で参照しています。

この方法は、特定の情報を複数のステップ間で共有する必要があるが、全ジョブやワークフロー全体で環境変数として設定するまでもない場合に便利です。

---

## 👤 ユーザー
*2024/4/7 12:19:19*

どちらの記述の方が一般的？

---

## 🤖 アシスタント
*2024/4/7 12:20:04*

GitHub Actionsで情報をステップ間で共有する方法としては、`env`（環境変数）を使う方法と`outputs`（ステップの出力）を使う方法の二つがありますが、どちらが一般的かは、使用するシナリオによって異なります。それぞれの方法には利点と適用シナリオがあります。

### 環境変数 (`env`) を使う方法
- **一般性：** 環境変数を使う方法は非常に一般的です。環境変数は、OSレベルで広く使用されるため、ほとんどの開発者が馴染みがあります。
- **利点：** ジョブ内のすべてのステップで容易にアクセス可能であり、シェルスクリプトやアプリケーションが期待する標準的な方法で値を渡せます。
- **適用シナリオ：** ジョブ全体を通じて一貫して利用される設定や、外部サービスのAPIキーのような機密情報を渡す場合に適しています。

### ステップの出力 (`outputs`) を使う方法
- **一般性：** ステップの出力を使う方法もGitHub Actions内で広く使用されていますが、環境変数ほどの普遍性はありません。主にGitHub Actionsのコンテキスト内での情報の受け渡しに特化しています。
- **利点：** 特定のステップから直接情報を受け取ることができるため、情報のソースが明確です。また、ステップ間での依存関係が明確に表現されるため、ワークフローの可読性と管理性が向上します。
- **適用シナリオ：** ステップ間で動的に生成されたデータを共有する場合や、あるステップの出力が後続の特定のステップでのみ必要な場合に適しています。

### 結論
- **より一般的なのは？** 環境変数を使用する方法は、より広い文脈（OSレベルでの設定含む）で一般的であり、直感的にも理解しやすいでしょう。しかし、GitHub Actionsの文脈では、`outputs`を使用する方法も同様に一般的です。
- **どちらを使うべきか？** 使用する情報の種類やスコープ、ワークフローの複雑性に応じて選択します。ジョブ全体で広く使われる固定値や機密情報は`env`で、ステップ間で特定の情報を渡す場合は`outputs`が適しています。

最終的には、ワークフローの可読性、管理のしやすさ、およびセキュリティの観点から最適な方法を選ぶことが重要です。

---
