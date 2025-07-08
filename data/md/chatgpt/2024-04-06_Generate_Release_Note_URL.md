# Generate Release Note URL

日付: 2024-04-06

---

## 👤 ユーザー
*2024/04/06 11:33:16*

Slack Notification on Success で release note のURLをメッセージに設定したい。
Generate Release Note URL and Validate Tagで作成したURLをstepを超えて変数を格納したい。

```
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
        echo "https://github.com/suguruTakahashi-1234/DISample/releases/new?tag=${{ github.event.inputs.tag }}&title=${{ github.event.inputs.tag }}&target=$BRANCH_NAME&prerelease=1"

    # Success
    - name: Slack Notification on Success
      uses: rtCamp/action-slack-notify@v2
      if: ${{ success() }}
      env:
        SLACK_TITLE: Generate Tag & Release Note / Success
        SLACK_COLOR: good
        SLACK_MESSAGE: "$(RELEASE_NOTE_URL)"

    # Failure
    - name: Slack Notification on Failure
      uses: rtCamp/action-slack-notify@v2
      if: ${{ failure() }}
      env:
        SLACK_TITLE: Generate Tag & Release Note / Failure
        SLACK_COLOR: danger
        SLACK_MESSAGE: Failure Generate Tag & Release Note

```

---

## 🤖 アシスタント
*2024/04/06 11:33:49*

To pass variables, such as your release note URL, between steps in a GitHub Actions workflow, you can use output parameters of a job or set environment variables. However, in the case of dynamically generated content that needs to be used in a different step within the same job, GitHub Actions provides a feature to create and use environment variables via the `echo` command and the `GITHUB_ENV` file.

In your scenario, after generating the release note URL, you'll want to store it in an environment variable so that it can be accessed by the Slack Notification step. Here's how you can modify your workflow to achieve this:

1. In the "Generate Release Note URL and Validate Tag" step, use the `echo "NAME=VALUE" >> $GITHUB_ENV` syntax to create a new environment variable. Let's name this variable `RELEASE_NOTE_URL`.

2. Modify the `SLACK_MESSAGE` environment variable in the "Slack Notification on Success" step to use this newly created `RELEASE_NOTE_URL` environment variable.

Here's the modified portion of your workflow:

```yaml
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
        
        # Generate the release note URL
        RELEASE_NOTE_URL="https://github.com/suguruTakahashi-1234/DISample/releases/new?tag=${{ github.event.inputs.tag }}&title=${{ github.event.inputs.tag }}&target=$BRANCH_NAME&prerelease=1"
        echo "RELEASE_NOTE_URL=$RELEASE_NOTE_URL" >> $GITHUB_ENV
        echo "Release note URL: $RELEASE_NOTE_URL"
      
    # Success
    - name: Slack Notification on Success
      uses: rtCamp/action-slack-notify@v2
      if: success()
      env:
        SLACK_TITLE: Generate Tag & Release Note / Success
        SLACK_COLOR: good
        SLACK_MESSAGE: "$RELEASE_NOTE_URL"

    # Failure
    - name: Slack Notification on Failure
      uses: rtCamp/action-slack-notify@v2
      if: failure()
      env:
        SLACK_TITLE: Generate Tag & Release Note / Failure
        SLACK_COLOR: danger
        SLACK_MESSAGE: "Failure Generate Tag & Release Note"
```

Note: Ensure that the `SLACK_MESSAGE` is correctly referencing the environment variable. Depending on the action `rtCamp/action-slack-notify@v2` you're using, you might need to ensure it supports using environment variables directly in the `SLACK_MESSAGE`. If direct variable substitution doesn't work as expected, you may need to use a step to explicitly set or modify the message content before invoking the Slack notification action.

---
