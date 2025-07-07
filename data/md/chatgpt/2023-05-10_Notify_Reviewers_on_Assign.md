# Notify Reviewers on Assign

日付: 2023-05-10

---

## 👤 ユーザー
*2023/5/11 0:02:14*

name: Notify Reviewers on Assign

on:
  pull\_request:
    types:
      - review\_requested
  check\_suite:
    types:
      - completed

jobs:
  notify\_reviewers:
    runs-on: ubuntu-latest
    if: ${{ github.event.check\_suite.conclusion == 'success' }}

    steps:
    - name: Checkout repository
      uses: actions/checkout@v2

    - name: Notify Reviewers on Slack
      env:
        SLACK\_WEBHOOK\_URL: ${{ secrets.SLACK\_WEBHOOK\_URL }}
      run: |
        # Get pull request information from the check\_suite event
        PR\_URL="${{ github.event.pull\_request.html\_url }}"
        PR\_TITLE="${{ github.event.pull\_request.title }}"
        PR\_AUTHOR="${{ github.event.pull\_request.user.login }}"
        PR\_NUMBER="${{ github.event.pull\_request.number }}"

        # Fetch the reviewers who have not yet approved the pull request.
        echo "Fetching requested reviewers..."
        REVIEWERS=$(curl -s -H "Authorization: token ${{ secrets.GITHUB\_TOKEN }}" \\
          https://api.github.com/repos/${{ github.repository }}/pulls/$PR\_NUMBER/reviews \\
          | jq -r '.\[\] | select(.state!="APPROVED") | .user.login')

        if \[ -z "$REVIEWERS" \]; then
          echo "No reviewers found or all reviewers have approved."
          exit 0
        fi

        # Map the GitHub usernames to their corresponding Slack usernames.
        echo "Fetching slack usernames..."
        SLACK\_USERNAMES=""
        for REVIEWER in $REVIEWERS
        do
          SLACK\_USERNAME=$(jq -r --arg github\_user "$REVIEWER" '.\[$github\_user\]' .github/github\_to\_slack\_mapping.json)
          if \[ "$SLACK\_USERNAME" != "null" \]; then
            SLACK\_USERNAMES="$SLACK\_USERNAMES @$SLACK\_USERNAME"
          fi
        done

        if \[ -z "$SLACK\_USERNAMES" \]; then
          echo "No slack usernames found."
          exit 0
        fi

        # Prepare the message to be sent on Slack.
        MESSAGE="$SLACK\_USERNAMES レビューをお願いします。\\nPR の CI が通りました。\\n\\n$PR\_TITLE\\n$PR\_URL\\n\\nby @$PR\_AUTHOR"

        # Send the message to the Slack channel using Incoming Webhook.
        echo "Sending message to slack..."
        curl -X POST -H 'Content-type: application/json' --data "{'text':'$MESSAGE'}" $SLACK\_WEBHOOK\_URL


このGitHubワークフローで以下のようなエラーになったんだけど解決方法を教えて欲しい

Fetching requested reviewers...
jq: error (at &lt;stdin&gt;:4): Cannot index string with string "state"
Error: Process completed with exit code 5.

---

## 🤖 アシスタント
*2023/5/11 0:04:43*

このエラーは、jqコマンドが入力データを正しく処理できなかったことを示しています。エラーは、GitHub APIからのレスポンスを解析しようとするときに発生しているようです。

解決策として、まず `curl` コマンドを使って GitHub API からのレスポンスを確認してみましょう。以下のコマンドをワークフローの "Fetching requested reviewers..." のすぐ下に追加して、結果を確認してください。

```yaml
- name: Debug API response
  run: |
    curl -s -H "Authorization: token ${{ secrets.GITHUB_TOKEN }}" \
      https://api.github.com/repos/${{ github.repository }}/pulls/$PR_NUMBER/reviews \
      | jq
```

このデバッグステップを実行した結果から、入力データが想定通りの形式であることを確認しましょう。特に、`state` フィールドが存在するかどうかを確認してください。

もしレスポンスが想定通りであれば、次に jq コマンドの構文を確認してみましょう。現在の jq コマンドは以下のようになっています。

```bash
jq -r '.[] | select(.state!="APPROVED") | .user.login'
```

このエラーが発生している原因としては、GitHub APIからのレスポンスが配列ではなくオブジェクトである可能性があります。その場合、jqコマンドを以下のように変更してみてください。

```bash
jq -r '. | select(.state!="APPROVED") | .user.login'
```

上記の変更が問題を解決しない場合は、引き続きデバッグを行って、原因を特定してください。デバッグの結果から、適切な修正を行ってエラーを解決してください。

---

## 👤 ユーザー
*2023/5/11 0:05:23*

REVIEWERS=$(curl -s -H "Authorization: token ${{ secrets.GITHUB\_TOKEN }}" \\
          https://api.github.com/repos/${{ github.repository }}/pulls/$PR\_NUMBER/reviews \\
          | jq -r '.\[\] | select(.state!="APPROVED") | .user.login') 
これが正解？

---

## 🤖 アシスタント
*2023/5/11 0:06:51*

いいえ、すみません。私の説明が不十分でした。`jq`コマンドでレビュアーをフィルタリングする前に、まずGitHub APIからレビューリクエストを取得し、それをフィルタリングする必要があります。

現在のコードでは、すでに提出されたレビューをフィルタリングしていますが、実際にはレビューリクエストをフィルタリングする必要があります。

以下のようにコードを修正してください:

```yaml
REVIEWERS=$(curl -s -H "Authorization: token ${{ secrets.GITHUB_TOKEN }}" \
  https://api.github.com/repos/${{ github.repository }}/pulls/$PR_NUMBER \
  | jq -r '.requested_reviewers[].login')
```

上記のコードでは、`curl`コマンドでプルリクエストの詳細を取得し、その後`jq`コマンドでレビューリクエストされたユーザーのログイン名を抽出しています。

これで、ワークフローはレビューリクエストされたユーザーを正しく取得し、それをフィルタリングしてSlack通知を送ることができるはずです。

---

## 👤 ユーザー
*2023/5/11 0:07:40*

全文書いて欲しい。また、APPROVED のユーザーは通知対象からのぞいて欲しい

---

## 🤖 アシスタント
*2023/5/11 0:11:05*

了解しました。APPROVEDのユーザーを通知対象から外すために、以下のようにワークフローを修正してみてください。

```yaml
name: Notify Reviewers on Assign

on:
  pull_request:
    types:
      - review_requested
  check_suite:
    types:
      - completed

jobs:
  notify_reviewers:
    runs-on: ubuntu-latest
    if: ${{ github.event.check_suite.conclusion == 'success' }}

    steps:
    - name: Checkout repository
      uses: actions/checkout@v2

    - name: Fetch pull request details
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      run: |
        PR_URL="${{ github.event.pull_request.html_url }}"
        PR_TITLE="${{ github.event.pull_request.title }}"
        PR_AUTHOR="${{ github.event.pull_request.user.login }}"
        PR_NUMBER="${{ github.event.pull_request.number }}"

        # Fetch requested reviewers.
        echo "Fetching requested reviewers..."
        REVIEWERS=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
          https://api.github.com/repos/${{ github.repository }}/pulls/$PR_NUMBER \
          | jq -r '.requested_reviewers[].login')

        # Fetch reviewers who have approved the pull request.
        echo "Fetching approved reviewers..."
        APPROVED_REVIEWERS=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
          https://api.github.com/repos/${{ github.repository }}/pulls/$PR_NUMBER/reviews \
          | jq -r '.[] | select(.state=="APPROVED") | .user.login')

        # Remove approved reviewers from the list of reviewers.
        echo "Filtering out approved reviewers..."
        for APPROVED_REVIEWER in $APPROVED_REVIEWERS
        do
          REVIEWERS=$(echo "$REVIEWERS" | sed "/$APPROVED_REVIEWER/d")
        done

        echo "Final list of reviewers to be notified: $REVIEWERS"

        if [ -z "$REVIEWERS" ]; then
          echo "No reviewers found or all reviewers have approved."
          exit 0
        fi

        # Map the GitHub usernames to their corresponding Slack usernames.
        echo "Fetching slack usernames..."
        SLACK_USERNAMES=""
        for REVIEWER in $REVIEWERS
        do
          SLACK_USERNAME=$(jq -r --arg github_user "$REVIEWER" '.[$github_user]' .github/github_to_slack_mapping.json)
          if [ "$SLACK_USERNAME" != "null" ]; then
            SLACK_USERNAMES="$SLACK_USERNAMES @$SLACK_USERNAME"
          fi
        done

        if [ -z "$SLACK_USERNAMES" ]; then
          echo "No slack usernames found."
          exit 0
        fi

        # Prepare the message to be sent on Slack.
        MESSAGE="$SLACK_USERNAMES レビューをお願いします。\nPR の CI が通りました。\n\n$PR_TITLE\n$PR_URL\n\nby @$PR_AUTHOR"

        # Send the message to the Slack channel using Incoming Webhook.
        echo "Sending message to slack..."
        curl -X POST -H 'Content-type: application/json' --data "{'text':'$MESSAGE'}" $SLACK_WEBHOOK_URL
```

この修正で、ワークフローは以下の処理を行います:

1. レビューリクエストされたユーザーを取得します。
2. 承認

---

## 👤 ユーザー
*2023/5/11 0:14:06*

つづき

---

## 🤖 アシスタント
*2023/5/11 0:14:55*

承認されたレビュワーを取得します。
3. 承認されたレビュワーをレビュワーのリストから削除します。
4. 残りのレビュワーに対応するSlackユーザー名を取得します。
5. Slackに通知メッセージを送信します。

この修正により、承認済みのレビュワーは通知対象から外されるようになります。ワークフロー全体が正しく動作することを確認してください。もし何か問題があれば、デバッグを行って適切な修正を行ってください。

---

## 👤 ユーザー
*2023/5/11 0:14:58*

やっぱりAPPROVEDを除くのではなくて、未レビューのユーザーにのみ通知するように変更して欲しい。

---

## 🤖 アシスタント
*2023/5/11 0:18:19*

了解しました。未レビューのユーザーにのみ通知するようにワークフローを修正します。以下が修正されたワークフローです:

```yaml
name: Notify Reviewers on Assign

on:
  pull_request:
    types:
      - review_requested
  check_suite:
    types:
      - completed

jobs:
  notify_reviewers:
    runs-on: ubuntu-latest
    if: ${{ github.event.check_suite.conclusion == 'success' }}

    steps:
    - name: Checkout repository
      uses: actions/checkout@v2

    - name: Fetch pull request details
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      run: |
        PR_URL="${{ github.event.pull_request.html_url }}"
        PR_TITLE="${{ github.event.pull_request.title }}"
        PR_AUTHOR="${{ github.event.pull_request.user.login }}"
        PR_NUMBER="${{ github.event.pull_request.number }}"

        # Fetch requested reviewers.
        echo "Fetching requested reviewers..."
        REQUESTED_REVIEWERS=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
          https://api.github.com/repos/${{ github.repository }}/pulls/$PR_NUMBER \
          | jq -r '.requested_reviewers[].login')

        # Fetch reviewers who have submitted any review.
        echo "Fetching reviewers with any review..."
        REVIEWED_REVIEWERS=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
          https://api.github.com/repos/${{ github.repository }}/pulls/$PR_NUMBER/reviews \
          | jq -r 'group_by(.user.login) | .[] | .[0].user.login')

        # Filter out reviewers who have submitted any review.
        echo "Filtering out reviewers with any review..."
        UNREVIEWED_REVIEWERS=""
        for REQUESTED_REVIEWER in $REQUESTED_REVIEWERS
        do
          if [[ ! " $REVIEWED_REVIEWERS " =~ " $REQUESTED_REVIEWER " ]]; then
            UNREVIEWED_REVIEWERS+=" $REQUESTED_REVIEWER"
          fi
        done

        echo "Final list of unreviewed reviewers to be notified: $UNREVIEWED_REVIEWERS"

        if [ -z "$UNREVIEWED_REVIEWERS" ]; then
          echo "No unreviewed reviewers found."
          exit 0
        fi

        # Map the GitHub usernames to their corresponding Slack usernames.
        echo "Fetching slack usernames..."
        SLACK_USERNAMES=""
        for REVIEWER in $UNREVIEWED_REVIEWERS
        do
          SLACK_USERNAME=$(jq -r --arg github_user "$REVIEWER" '.[$github_user]' .github/github_to_slack_mapping.json)
          if [ "$SLACK_USERNAME" != "null" ]; then
            SLACK_USERNAMES="$SLACK_USERNAMES @$SLACK_USERNAME"
          fi
        done

        if [ -z "$SLACK_USERNAMES" ]; then
          echo "No slack usernames found."
          exit 0
        fi

        # Prepare the message to be sent on Slack.
        MESSAGE="$SLACK_USERNAMES レビューをお願いします。\nPR の CI が通りました。\n\n$PR_TITLE\n$PR_URL\n\nby @$PR_AUTHOR"

        # Send the message to the Slack channel using Incoming Webhook.
        echo "Sending message to slack..."
        curl -X POST -H 'Content-type: application/json' --data "{'text':'$MESSAGE'}" $SLACK_WEB

---

## 👤 ユーザー
*2023/5/11 0:19:31*

つづき

---

## 🤖 アシスタント
*2023/5/11 0:20:43*

HOOK\_URL

この修正により、未レビューのレビュワーにのみ通知が送信されるようになります。以下が修正されたワークフローの手順です：

1. レビューがリクエストされたユーザーを取得します。
2. すでにレビューを提出したレビュワーを取得します。
3. レビューがリクエストされたユーザーのリストから、すでにレビューを提出したレビュワーを削除します。
4. 残りの未レビューのレビュワーに対応するSlackユーザー名を取得します。
5. Slackに通知メッセージを送信します。

修正されたワークフローが正しく動作することを確認してください。もし何か問題があれば、デバッグを行って適切な修正を行ってください。

---

## 👤 ユーザー
*2023/5/11 0:20:48*

未レビュー状態ってもっと簡単に取得できないの？ステップ1と2がかなり似ている処理になっている気がする

---

## 🤖 アシスタント
*2023/5/11 0:25:01*

おっしゃる通り、ステップ1と2は似た処理をしています。未レビューのレビュワーを簡単に取得する方法を提案します。この方法では、GitHub APIからプルリクエストのレビューを取得し、レビューがリクエストされたユーザーと提出されたレビュワーを一度に抽出します。

以下に修正されたコードを示します:

```yaml
name: Notify Reviewers on Assign

on:
  pull_request:
    types:
      - review_requested
  check_suite:
    types:
      - completed

jobs:
  notify_reviewers:
    runs-on: ubuntu-latest
    if: ${{ github.event.check_suite.conclusion == 'success' }}

    steps:
    - name: Checkout repository
      uses: actions/checkout@v2

    - name: Fetch pull request details
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      run: |
        PR_URL="${{ github.event.pull_request.html_url }}"
        PR_TITLE="${{ github.event.pull_request.title }}"
        PR_AUTHOR="${{ github.event.pull_request.user.login }}"
        PR_NUMBER="${{ github.event.pull_request.number }}"

        # Fetch requested reviewers and submitted reviews.
        echo "Fetching requested reviewers and submitted reviews..."
        REVIEWS=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
          https://api.github.com/repos/${{ github.repository }}/pulls/$PR_NUMBER/reviews)

        REQUESTED_REVIEWERS=$(echo "$REVIEWS" | jq -r '.[] | select(.state=="REQUESTED") | .user.login')
        REVIEWED_REVIEWERS=$(echo "$REVIEWS" | jq -r 'group_by(.user.login) | .[] | .[0].user.login')

        # Filter out reviewers who have submitted any review.
        echo "Filtering out reviewers with any review..."
        UNREVIEWED_REVIEWERS=""
        for REQUESTED_REVIEWER in $REQUESTED_REVIEWERS
        do
          if [[ ! " $REVIEWED_REVIEWERS " =~ " $REQUESTED_REVIEWER " ]]; then
            UNREVIEWED_REVIEWERS+=" $REQUESTED_REVIEWER"
          fi
        done

        echo "Final list of unreviewed reviewers to be notified: $UNREVIEWED_REVIEWERS"

        if [ -z "$UNREVIEWED_REVIEWERS" ]; then
          echo "No unreviewed reviewers found."
          exit 0
        fi

        # Map the GitHub usernames to their corresponding Slack usernames.
        echo "Fetching slack usernames..."
        SLACK_USERNAMES=""
        for REVIEWER in $UNREVIEWED_REVIEWERS
        do
          SLACK_USERNAME=$(jq -r --arg github_user "$REVIEWER" '.[$github_user]' .github/github_to_slack_mapping.json)
          if [ "$SLACK_USERNAME" != "null" ]; then
            SLACK_USERNAMES="$SLACK_USERNAMES @$SLACK_USERNAME"
          fi
        done

        if [ -z "$SLACK_USERNAMES" ]; then
          echo "No slack usernames found."
          exit 0
        fi

        # Prepare the message to be sent on Slack.
        MESSAGE="$SLACK_USERNAMES レビューをお願いします。\nPR の CI が通りました。\n\n$PR_TITLE\n$PR_URL\n\nby @$PR_AUTHOR"

        #

---

## 👤 ユーザー
*2023/5/11 0:26:16*

ちなみに "REQUESTED" の他にどのような状態があるの？.state!="REQUESTED" で一発で未レビューユーザーを取得できないの？

---

## 🤖 アシスタント
*2023/5/11 0:27:54*

GitHub APIでレビューの状態を取得する際、次のようなステータスが返されることがあります:

- `COMMENTED`: レビュワーが一般的なコメントを提出した。
- `APPROVED`: レビュワーがプルリクエストを承認した。
- `CHANGES\_REQUESTED`: レビュワーが変更を要求した。
- `DISMISSED`: レビュワーのレビューが取り消された。
- `PENDING`: レビューがまだ提出されていない。

ただし、GitHub APIにはレビューがまだリクエストされていない状態のレビュワーをフィルタリングするための`.state`フィールドがありません。そのため、`.state!="REQUESTED"`を使って未レビューユーザーを一発で取得することはできません。レビュワーのリストをフィルタリングするために、まずリクエストされたレビュワーとすでにレビューを提出したレビュワーを取得し、それらの差分を計算する方法を使用しています。

---

## 👤 ユーザー
*2023/5/11 0:28:17*

REVIEWED\_REVIEWERS=$(echo "$REVIEWS" | jq -r 'group\_by(.user.login) | .\[\] | .\[0\].user.login') は何を取得しているの？

---

## 🤖 アシスタント
*2023/5/11 0:30:43*

このコマンドは、プルリクエストで提出されたレビューのうち、各レビュワーの最初のレビューを取得しています。

以下がコマンドの説明です:

1. `echo "$REVIEWS"`: `$REVIEWS`変数に格納されているJSONデータを出力します。
2. `jq -r 'group\_by(.user.login) | .\[\] | .\[0\].user.login'`: `jq`コマンドを使ってJSONデータを処理します。まず、`group\_by(.user.login)`でJSONデータを`.user.login`フィールド（レビュワーのGitHubユーザー名）でグループ化します。この操作により、各レビュワーごとにレビューがまとめられます。
3. `| .\[\]`: グループ化されたレビューを個別の要素に展開します。
4. `| .\[0\].user.login`: 展開された各グループから最初の要素（`.user.login`フィールド）を取得します。これにより、各レビュワーの最初のレビューが取得されます。これが実質的に各レビュワーのレビューの存在を確認する方法となります。

`REVIEWED\_REVIEWERS`変数には、プルリクエストで少なくとも1つのレビューを提出したレビュワーのGitHubユーザー名が格納されます。このリストを使って、レビューがまだリクエストされているが提出されていないレビュワーを特定できます。

---

## 👤 ユーザー
*2023/5/11 0:30:59*

未レビューという表現が誤っていたよ、ごめん。現在、COMMENTED, APPROVED, CHANGES\_REQUESTED のような状態以外のユーザーに通知したいという意味だったよ。それでコードを全部直してくれる？

---

## 🤖 アシスタント
*2023/5/11 0:32:05*

了解しました。現在のプルリクエストで`COMMENTED`、`APPROVED`、`CHANGES_REQUESTED`のいずれの状態でもないレビュワーに通知を送りたいということですね。その条件に合うコードを以下に示します:

```yaml
name: Notify Reviewers on Assign

on:
  pull_request:
    types:
      - review_requested
  check_suite:
    types:
      - completed

jobs:
  notify_reviewers:
    runs-on: ubuntu-latest
    if: ${{ github.event.check_suite.conclusion == 'success' }}

    steps:
    - name: Checkout repository
      uses: actions/checkout@v2

    - name: Fetch pull request details
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

---
