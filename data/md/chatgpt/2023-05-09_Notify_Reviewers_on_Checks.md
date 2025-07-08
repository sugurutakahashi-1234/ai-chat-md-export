# Notify Reviewers on Checks

日付: 2023-05-09

---

## 👤 ユーザー
*2023/05/09 12:12:54*

name: Notify Reviewers on Successful Checks

on:
  check_suite:
    types:
      - completed

jobs:
  notify_reviewers:
    runs-on: ubuntu-latest
    # Execute the job only if the check_suite event is related to a pull request and all checks are successful
    if: ${{ github.event.check_suite.conclusion == 'success' && github.event.check_suite.pull_requests[0] }}

    steps:
    - name: Checkout repository
      uses: actions/checkout@v2

    - name: Notify Reviewers on Slack
      env:
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
      run: |
        # Get pull request information from the check_suite event
        PR_URL="${{ github.event.check_suite.pull_requests[0].html_url }}"
        PR_TITLE="${{ github.event.check_suite.pull_requests[0].title }}"
        PR_AUTHOR="${{ github.event.check_suite.pull_requests[0].user.login }}"
        PR_NUMBER="${{ github.event.check_suite.pull_requests[0].number }}"

        # Fetch the requested reviewers who have not yet approved the pull request
        echo "Fetching requested reviewers..."
        REVIEWERS=$(curl -s -H "Authorization: token ${{ secrets.GITHUB_TOKEN }}" \
          https://api.github.com/repos/${{ github.repository }}/pulls/$PR_NUMBER/reviews \
          | jq -r '.[] | select(.state!="APPROVED") | .user.login')

        # Exit early if there are no reviewers or all reviewers have approved
        if [ -z "$REVIEWERS" ]; then
          echo "No reviewers found or all reviewers have approved."
          exit 0
        fi

        # Fetch the Slack usernames for the GitHub reviewers using the mapping file
        echo "Fetching slack usernames..."
        SLACK_USERNAMES=""
        for REVIEWER in $REVIEWERS
        do
          SLACK_USERNAME=$(jq -r --arg github_user "$REVIEWER" '.[$github_user]' .github/github_to_slack_mapping.json)
          if [ "$SLACK_USERNAME" != "null" ]; then
            SLACK_USERNAMES="$SLACK_USERNAMES @$SLACK_USERNAME"
          fi
        done

        # Exit early if there are no corresponding Slack usernames
        if [ -z "$SLACK_USERNAMES" ]; then
          echo "No slack usernames found."
          exit 0
        fi

        # Create the message to be sent to Slack
        MESSAGE="$SLACK_USERNAMES レビューをお願いします。\nPR の CI が通りました。\n\n$PR_TITLE\n$PR_URL\n\nby @$PR_AUTHOR"

        # Send the message to Slack
        echo "Sending message to slack..."
        curl -X POST -H 'Content-type: application/json' --data "{'text':'$MESSAGE'}" $SLACK_WEBHOOK_URL

これで、if: ${{ github.event.check_suite.conclusion == 'success' && github.event.check_suite.pull_requests[0] }} とするのではなくて別の方法を取りたい

---

## 🤖 アシスタント
*2023/05/09 12:13:02*

If you want to trigger the job in a different way than using the `check_suite` event with a successful conclusion and a pull request, you can modify the `on` section of your workflow YAML file. 

For example, you can use the `pull_request` event to trigger the job when a pull request is opened or updated, and check if all the required checks have passed before notifying the reviewers. You can use the `jobs.<job_id>.if` syntax to conditionally run the job based on specific criteria.

Here is an example of how to modify the `on` and `if` sections of the workflow YAML file to use the `pull_request` event:

```
name: Notify Reviewers on Successful Checks

on:
  pull_request:
    types:
      - opened
      - synchronize

jobs:
  notify_reviewers:
    runs-on: ubuntu-latest
    if: ${{ github.event.pull_request.head.repo.full_name == github.repository && github.event.pull_request.head.repo.owner.login != github.event.pull_request.base.repo.owner.login && github.event.pull_request.draft == false && github.event.pull_request.mergeable == true }}

    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Notify Reviewers on Slack
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
        run: |
          # Get pull request information from the pull_request event
          PR_URL="${{ github.event.pull_request.html_url }}"
          PR_TITLE="${{ github.event.pull_request.title }}"
          PR_AUTHOR="${{ github.event.pull_request.user.login }}"
          PR_NUMBER="${{ github.event.pull_request.number }}"

          # Fetch the requested reviewers who have not yet approved the pull request
          echo "Fetching requested reviewers..."
          REVIEWERS=$(curl -s -H "Authorization: token ${{ secrets.GITHUB_TOKEN }}" \
            https://api.github.com/repos/${{ github.repository }}/pulls/$PR_NUMBER/reviews \
            | jq -r '.[] | select(.state!="APPROVED") | .user.login')

          # Exit early if there are no reviewers or all reviewers have approved
          if [ -z "$REVIEWERS" ]; then
            echo "No reviewers found or all reviewers have approved."
            exit 0
          fi

          # Fetch the Slack usernames for the GitHub reviewers using the mapping file
          echo "Fetching slack usernames..."
          SLACK_USERNAMES=""
          for REVIEWER in $REVIEWERS
          do
            SLACK_USERNAME=$(jq -r --arg github_user "$REVIEWER" '.[$github_user]' .github/github_to_slack_mapping.json)
            if [ "$SLACK_USERNAME" != "null" ]; then
              SLACK_USERNAMES="$SLACK_USERNAMES @$SLACK_USERNAME"
            fi
          done

          # Exit early if there are no corresponding Slack usernames
          if [ -z "$SLACK_USERNAMES" ]; then
            echo "No slack usernames found."
            exit 0
          fi

          # Check if all the required checks have passed
          echo "Checking if all checks have passed..."
          CHECKS_STATUS=$(curl -s -H "Authorization: token ${{ secrets.GITHUB_TOKEN }}" \
            https://api.github.com/repos/${{ github.repository }}/commits/${{ github.event.pull_request.head.sha }}/check-suites \
            | jq -r '.check_suites[].conclusion' \
            | grep -vE 'success|neutral' \
            || true)

          # Exit early if there are failing checks
          if [ -n "$CHECKS_STATUS" ]; then
            echo "There are failing checks: $CHECK

---

## 👤 ユーザー
*2023/05/09 12:13:11*

つづき

---

## 🤖 アシスタント
*2023/05/09 12:13:15*

STATUS"
            exit 0
          fi

          # Create the message to be sent to Slack
          MESSAGE="$SLACK_USERNAMES レビューをお願いします。\nPR の CI が通りました。\n\n$PR_TITLE\n$PR_URL\n\nby @$PR_AUTHOR"

          # Send the message to Slack
          echo "Sending message to slack..."
          curl -X POST -H 'Content-type: application/json' --data "{'text':'$MESSAGE'}" $SLACK_WEBHOOK_URL
```

In this example, the `on` section specifies that the job should run when a pull request is opened or updated. The `if` section checks that the pull request comes from a fork, is not a draft, is mergeable, and is not owned by the same user as the repository. You can adjust the criteria based on your needs.

The job then performs the same steps as before, with an additional check to ensure that all the required checks have passed before notifying the reviewers.

Note that the `pull_request` event doesn't provide information on the pull request's merge status, so this workflow only checks if the pull request is mergeable. If you want to ensure that the pull request can be merged, you can use the `pull_request_review` or `status` events instead.

---
