# GitHub Metrics Setup Guide

日付: 2024-06-14

---

## 👤 ユーザー
*2024/6/14 10:24:12*

github/issue-metrics を使って GitHub Actions を設置してメトリクスを計測したい。以下のサンプルのどれを使ったら良さそうか教えてほしい。

https://github.com/github/issue-metrics/tree/a22b9da19a49939fe2d000cfe2e7f8caca7d1fa0/docs

---

## 🤖 アシスタント
*2024/6/14 10:24:30*

User wants to use GitHub Actions with `github/issue-metrics` to measure metrics.

---

## 🔧 ツール
*2024/6/14 10:24:30*

Model set context updated.

---

## 🤖 アシスタント
*2024/6/14 10:24:30*

To use `github/issue-metrics` for setting up GitHub Actions to measure metrics, you can follow the example provided in the repository documentation. Here's a step-by-step guide based on the information from the sources:

1. **Create a Workflow File**:
   Create a workflow file named `.github/workflows/issue-metrics.yml` in your repository.

2. **Define the Workflow**:
   Use the following example to define your workflow. This setup runs the action monthly to report metrics for issues created in the last month:

    ```yaml
    name: Monthly issue metrics
    on:
      workflow_dispatch:
      schedule:
        - cron: '3 2 1 * *'

    permissions:
      contents: read

    jobs:
      build:
        name: issue metrics
        runs-on: ubuntu-latest
        permissions:
          issues: write
          pull-requests: read
        steps:
        - name: Get dates for last month
          shell: bash
          run: |
            # Calculate the first day of the previous month
            first_day=$(date -d "last month" +%Y-%m-01)

            # Calculate the last day of the previous month
            last_day=$(date -d "$first_day +1 month -1 day" +%Y-%m-%d)

            # Set an environment variable with the date range
            echo "last_month=$first_day..$last_day" >> "$GITHUB_ENV"

        - name: Run issue-metrics tool
          uses: github/issue-metrics@v3
          env:
            GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
            SEARCH_QUERY: 'repo:owner/repo is:issue created:${{ env.last_month }} -reason:"not planned"'

        - name: Create issue
          uses: peter-evans/create-issue-from-file@v5
          with:
            title: Monthly issue metrics report
            token: ${{ secrets.GITHUB_TOKEN }}
            content-filepath: ./issue_metrics.md
    ```

3. **Customize the Workflow**:
   - Replace `repo:owner/repo` in `SEARCH_QUERY` with your repository details.
   - Ensure that you have a GitHub token stored as a secret in your repository (`GH_TOKEN`).

4. **Run the Action**:
   The action will run based on the defined schedule or can be manually triggered via the GitHub Actions tab in your repository.

5. **Review the Metrics**:
   The action will generate a report and create an issue in your repository with the metrics for the specified period.

For more detailed information, refer to the [issue-metrics GitHub repository](https://github.com/github/issue-metrics) and the [example workflow documentation](https://github.com/github/issue-metrics/blob/main/docs/issue-metrics.md)【8†source】【9†source】【10†source】.

---

## 👤 ユーザー
*2024/6/14 10:24:39*

日本語でお願い。

---

## 🤖 アシスタント
*2024/6/14 10:24:56*

`github/issue-metrics` を使用して GitHub Actions を設置し、メトリクスを計測する方法について日本語で説明します。

### 手順

1. **ワークフローファイルを作成する**:
   リポジトリ内に `.github/workflows/issue-metrics.yml` という名前のワークフローファイルを作成します。

2. **ワークフローの定義**:
   以下の例を使用してワークフローを定義します。この設定は、毎月実行され、前月に作成されたイシューのメトリクスを報告します。

    ```yaml
    name: Monthly issue metrics
    on:
      workflow_dispatch:
      schedule:
        - cron: '3 2 1 * *'

    permissions:
      contents: read

    jobs:
      build:
        name: issue metrics
        runs-on: ubuntu-latest
        permissions:
          issues: write
          pull-requests: read
        steps:
        - name: Get dates for last month
          shell: bash
          run: |
            # 先月の初日を計算
            first_day=$(date -d "last month" +%Y-%m-01)

            # 先月の最終日を計算
            last_day=$(date -d "$first_day +1 month -1 day" +%Y-%m-%d)

            # 環境変数に日付範囲を設定
            echo "last_month=$first_day..$last_day" >> "$GITHUB_ENV"

        - name: Run issue-metrics tool
          uses: github/issue-metrics@v3
          env:
            GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
            SEARCH_QUERY: 'repo:owner/repo is:issue created:${{ env.last_month }} -reason:"not planned"'

        - name: Create issue
          uses: peter-evans/create-issue-from-file@v5
          with:
            title: Monthly issue metrics report
            token: ${{ secrets.GITHUB_TOKEN }}
            content-filepath: ./issue_metrics.md
    ```

3. **ワークフローのカスタマイズ**:
   - `SEARCH_QUERY` 内の `repo:owner/repo` を自分のリポジトリの詳細に置き換えます。
   - GitHub のトークンをリポジトリのシークレットとして保存します（`GH_TOKEN`）。

4. **アクションの実行**:
   定義されたスケジュールに基づいてアクションが実行されるか、リポジトリの GitHub Actions タブから手動でトリガーできます。

5. **メトリクスの確認**:
   アクションはレポートを生成し、指定された期間のメトリクスを含むイシューをリポジトリに作成します。

詳細については、[issue-metrics GitHub リポジトリ](https://github.com/github/issue-metrics)および[サンプルワークフロードキュメント](https://github.com/github/issue-metrics/blob/main/docs/issue-metrics.md)を参照してください【8†source】【9†source】【10†source】。

---

## 👤 ユーザー
*2024/6/14 10:30:27*

例えば以下のリポジトリだったらどうなる？

https://github.com/suguruTakahashi-1234/fia-practical-sample

---

## 🤖 アシスタント
*2024/6/14 10:30:49*

`github/issue-metrics` を使用して `suguruTakahashi-1234/fia-practical-sample` リポジトリのメトリクスを計測する GitHub Actions を設定するための手順を以下に示します。

### 手順

1. **ワークフローファイルを作成する**:
   リポジトリ内に `.github/workflows/issue-metrics.yml` という名前のワークフローファイルを作成します。

2. **ワークフローの定義**:
   以下の内容でワークフローファイルを設定します。この設定は毎月実行され、前月に作成されたイシューのメトリクスを報告します。

    ```yaml
    name: Monthly issue metrics
    on:
      workflow_dispatch:
      schedule:
        - cron: '3 2 1 * *'

    permissions:
      contents: read

    jobs:
      build:
        name: issue metrics
        runs-on: ubuntu-latest
        permissions:
          issues: write
          pull-requests: read
        steps:
        - name: Get dates for last month
          shell: bash
          run: |
            # 先月の初日を計算
            first_day=$(date -d "last month" +%Y-%m-01)

            # 先月の最終日を計算
            last_day=$(date -d "$first_day +1 month -1 day" +%Y-%m-%d)

            # 環境変数に日付範囲を設定
            echo "last_month=$first_day..$last_day" >> "$GITHUB_ENV"

        - name: Run issue-metrics tool
          uses: github/issue-metrics@v3
          env:
            GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
            SEARCH_QUERY: 'repo:suguruTakahashi-1234/fia-practical-sample is:issue created:${{ env.last_month }} -reason:"not planned"'

        - name: Create issue
          uses: peter-evans/create-issue-from-file@v5
          with:
            title: Monthly issue metrics report
            token: ${{ secrets.GITHUB_TOKEN }}
            content-filepath: ./issue_metrics.md
    ```

3. **ワークフローのカスタマイズ**:
   - `SEARCH_QUERY` 内の `repo:suguruTakahashi-1234/fia-practical-sample` が正しいことを確認します。
   - GitHub のトークンをリポジトリのシークレットとして保存します（`GH_TOKEN`）。

4. **アクションの実行**:
   定義されたスケジュールに基づいてアクションが実行されるか、リポジトリの GitHub Actions タブから手動でトリガーできます。

5. **メトリクスの確認**:
   アクションはレポートを生成し、指定された期間のメトリクスを含むイシューをリポジトリに作成します。

これにより、 `suguruTakahashi-1234/fia-practical-sample` リポジトリに関するイシューのメトリクスを定期的に取得し、プロジェクト管理に役立てることができます。詳細については、[issue-metrics GitHub リポジトリ](https://github.com/github/issue-metrics)および[サンプルワークフロードキュメント](https://github.com/github/issue-metrics/blob/main/docs/issue-metrics.md)を参照してください【8†source】【9†source】【10†source】。

---

## 👤 ユーザー
*2024/6/14 10:33:50*

ちなみに cron: '3 2 1 \* \*' はどう言う意味

---

## 🤖 アシスタント
*2024/6/14 10:33:57*

`cron: '3 2 1 * *'` は、cron スケジュール表記を使用して、特定の時間にジョブを実行するための設定です。この例の意味を分解すると以下のようになります：

- `3` - 分 (minute)
- `2` - 時 (hour)
- `1` - 月の第1日目 (day of month)
- `*` - 月 (month)
- `*` - 曜日 (day of week)

この設定は、毎月1日の午前2時3分にジョブが実行されることを意味します。

具体的には、以下のように解釈されます：
- 毎月の1日
- 午前2時3分に

したがって、この cron スケジュールは、毎月1日の午前2時3分に GitHub Actions を実行することを指定しています。

### 例
以下のスケジュール設定では、毎月1日の午前2時3分にジョブが実行されます：
```yaml
schedule:
  - cron: '3 2 1 * *'
```

cron のスケジュール表記についての詳細は [Crontab.guru](https://crontab.guru/) などのサイトで確認できます。

---

## 👤 ユーザー
*2024/6/14 10:34:12*

毎月1日に実行する場合はどうするの

---

## 🤖 アシスタント
*2024/6/14 10:34:29*

毎月1日に実行する場合、cron スケジュールを以下のように設定します：

```yaml
schedule:
  - cron: '0 0 1 * *'
```

この設定は、以下の意味になります：
- `0` - 分 (minute): 0分に実行
- `0` - 時 (hour): 0時に実行（午前0時）
- `1` - 月の第1日目 (day of month): 毎月の1日
- `*` - 月 (month): 毎月
- `*` - 曜日 (day of week): 毎日

したがって、この設定は毎月1日の午前0時にジョブが実行されることを意味します。

### 例
以下は、毎月1日の午前0時にジョブを実行するワークフローファイルの例です：

```yaml
name: Monthly issue metrics
on:
  workflow_dispatch:
  schedule:
    - cron: '0 0 1 * *'

permissions:
  contents: read

jobs:
  build:
    name: issue metrics
    runs-on: ubuntu-latest
    permissions:
      issues: write
      pull-requests: read
    steps:
    - name: Get dates for last month
      shell: bash
      run: |
        # 先月の初日を計算
        first_day=$(date -d "last month" +%Y-%m-01)

        # 先月の最終日を計算
        last_day=$(date -d "$first_day +1 month -1 day" +%Y-%m-%d)

        # 環境変数に日付範囲を設定
        echo "last_month=$first_day..$last_day" >> "$GITHUB_ENV"

    - name: Run issue-metrics tool
      uses: github/issue-metrics@v3
      env:
        GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        SEARCH_QUERY: 'repo:suguruTakahashi-1234/fia-practical-sample is:issue created:${{ env.last_month }} -reason:"not planned"'

    - name: Create issue
      uses: peter-evans/create-issue-from-file@v5
      with:
        title: Monthly issue metrics report
        token: ${{ secrets.GITHUB_TOKEN }}
        content-filepath: ./issue_metrics.md
```

この設定により、毎月1日の午前0時に `suguruTakahashi-1234/fia-practical-sample` リポジトリのメトリクスを計測し、レポートが生成されます。

---

## 👤 ユーザー
*2024/6/14 10:35:16*

content-filepath: ./issue\_metrics.md はどう言う意味？

---

## 🤖 アシスタント
*2024/6/14 10:35:39*

`content-filepath: ./issue_metrics.md` は、GitHub Actions ワークフローの中で生成されたレポートの内容を指定されたファイルパスから読み込むことを意味します。具体的には、次のような手順で使用されます。

### 詳細

1. **レポート生成**:
   アクションのステップで、イシューのメトリクスを計測し、その結果をファイルに保存します。この例では、`issue_metrics.md` というファイルにレポートを保存します。

2. **レポートのファイルパス指定**:
   `content-filepath: ./issue_metrics.md` は、生成されたレポートが保存されているファイルのパスを示します。このファイルの内容を新しいイシューとして GitHub リポジトリに投稿するために使用されます。

3. **イシューの作成**:
   `peter-evans/create-issue-from-file@v5` アクションは、指定されたファイル (`./issue_metrics.md`) の内容を読み込み、その内容をもとに新しいイシューを作成します。`title` パラメータで指定されたタイトルと、`content-filepath` パラメータで指定されたファイルの内容を使用します。

### 例
以下は、レポートファイル `issue_metrics.md` を使用してイシューを作成する部分のコード例です。

```yaml
- name: Create issue
  uses: peter-evans/create-issue-from-file@v5
  with:
    title: Monthly issue metrics report
    token: ${{ secrets.GITHUB_TOKEN }}
    content-filepath: ./issue_metrics.md
```

この設定により、`./issue_metrics.md` ファイルに保存されたメトリクスレポートが新しいイシューとして作成されます。ファイルの内容がそのままイシューの本文として使用されるため、事前にファイルの内容を適切にフォーマットしておく必要があります。

### ワークフロー全体の例

再度全体のワークフローの例を示すと、以下のようになります：

```yaml
name: Monthly issue metrics
on:
  workflow_dispatch:
  schedule:
    - cron: '0 0 1 * *'

permissions:
  contents: read

jobs:
  build:
    name: issue metrics
    runs-on: ubuntu-latest
    permissions:
      issues: write
      pull-requests: read
    steps:
    - name: Get dates for last month
      shell: bash
      run: |
        # 先月の初日を計算
        first_day=$(date -d "last month" +%Y-%m-01)

        # 先月の最終日を計算
        last_day=$(date -d "$first_day +1 month -1 day" +%Y-%m-%d)

        # 環境変数に日付範囲を設定
        echo "last_month=$first_day..$last_day" >> "$GITHUB_ENV"

    - name: Run issue-metrics tool
      uses: github/issue-metrics@v3
      env:
        GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        SEARCH_QUERY: 'repo:suguruTakahashi-1234/fia-practical-sample is:issue created:${{ env.last_month }} -reason:"not planned"'

    - name: Create issue
      uses: peter-evans/create-issue-from-file@v5
      with:
        title: Monthly issue metrics report
        token: ${{ secrets.GITHUB_TOKEN }}
        content-filepath: ./issue_metrics.md
```

この設定により、毎月1日に `suguruTakahashi-1234/fia-practical-sample` リポジトリのイシューのメトリクスが計測され、`issue_metrics.md` に保存されたレポートが新しいイシューとして投稿されます。

---

## 👤 ユーザー
*2024/6/14 10:36:39*

repo 名を env を定義したい。

---

## 🤖 アシスタント
*2024/6/14 10:36:56*

`repo` 名を環境変数として定義することで、ワークフローの柔軟性を向上させることができます。これを実現するためには、GitHub Actions の環境変数を使用します。

### 手順

1. **リポジトリ名の環境変数を定義**:
   `env` キーワードを使用して、リポジトリ名を環境変数として設定します。

2. **環境変数を使用**:
   設定した環境変数をワークフロー内で使用します。

### ワークフローファイルの例

以下の例では、`REPO_NAME` という環境変数を定義し、その変数を使用して `SEARCH_QUERY` を設定しています。

```yaml
name: Monthly issue metrics
on:
  workflow_dispatch:
  schedule:
    - cron: '0 0 1 * *'

permissions:
  contents: read

env:
  REPO_NAME: suguruTakahashi-1234/fia-practical-sample

jobs:
  build:
    name: issue metrics
    runs-on: ubuntu-latest
    permissions:
      issues: write
      pull-requests: read
    steps:
    - name: Get dates for last month
      shell: bash
      run: |
        # 先月の初日を計算
        first_day=$(date -d "last month" +%Y-%m-01)

        # 先月の最終日を計算
        last_day=$(date -d "$first_day +1 month -1 day" +%Y-%m-%d)

        # 環境変数に日付範囲を設定
        echo "last_month=$first_day..$last_day" >> "$GITHUB_ENV"

    - name: Run issue-metrics tool
      uses: github/issue-metrics@v3
      env:
        GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        SEARCH_QUERY: 'repo:${{ env.REPO_NAME }} is:issue created:${{ env.last_month }} -reason:"not planned"'

    - name: Create issue
      uses: peter-evans/create-issue-from-file@v5
      with:
        title: Monthly issue metrics report
        token: ${{ secrets.GITHUB_TOKEN }}
        content-filepath: ./issue_metrics.md
```

### 説明

- `env` セクションで `REPO_NAME` 環境変数を定義しています。
- `SEARCH_QUERY` では、リポジトリ名の部分に `${{ env.REPO_NAME }}` を使用して、環境変数を参照しています。
- この方法により、リポジトリ名を一箇所で定義し、他の部分で再利用できるため、メンテナンスが容易になります。

この設定により、`suguruTakahashi-1234/fia-practical-sample` リポジトリのメトリクスが毎月1日に計測され、レポートが新しいイシューとして投稿されます。

---

## 👤 ユーザー
*2024/6/14 11:43:46*

以下になった。issue のタイトルに集計期間をつけたい

# 月間の Issue Metrics の計測を行う
name: Issue Metrics

on:
  workflow\_dispatch:
  schedule:
    - cron: '0 0 1 \* \*'

permissions:
  contents: read

env:
  gh\_token: ${{ secrets.IOS\_TEAM\_PAT }} # IOS\_TEAM\_PAT: project, read:org, repo
  repo: suguruTakahashi-1234/swiftui-sample-app

jobs:
  build:
    name: issue metrics
    runs-on: ubuntu-latest
    permissions:
      issues: write
      pull-requests: read
    steps:
    - name: Get dates for last month
      shell: bash
      run: |
        # Calculate the first day of the previous month
        first\_day=$(date -d "last month" +%Y-%m-01)

        # Calculate the last day of the previous month
        last\_day=$(date -d "$first\_day +1 month -1 day" +%Y-%m-%d)

        #Set an environment variable with the date range
        echo "$first\_day..$last\_day"
        echo "last\_month=$first\_day..$last\_day" &gt;&gt; "$GITHUB\_ENV"

    - name: Run issue-metrics tool
      uses: github/issue-metrics@v3
      env:
        GH\_TOKEN: ${{ env.gh\_token }}
        SEARCH\_QUERY: 'repo:${{ env.repo }} is:issue created:${{ env.last\_month }} -reason:"not planned"'

    - name: Create issue
      uses: peter-evans/create-issue-from-file@v5
      with:
        title: 【Report】Monthly issue metrics
        token: ${{ secrets.GITHUB\_TOKEN }}
        content-filepath: ./issue\_metrics.md
        labels: |
          report

---

## 🤖 アシスタント
*2024/6/14 11:44:06*

issue のタイトルに集計期間を付けるためには、環境変数を使用して集計期間を生成し、その値をタイトルに追加することができます。以下のように設定を修正します。

### 修正したワークフローファイル

```yaml
# 月間の Issue Metrics の計測を行う
name: Issue Metrics

on:
  workflow_dispatch:
  schedule:
    - cron: '0 0 1 * *'

permissions:
  contents: read

env:
  gh_token: ${{ secrets.IOS_TEAM_PAT }} # IOS_TEAM_PAT: project, read:org, repo
  repo: suguruTakahashi-1234/swiftui-sample-app

jobs:
  build:
    name: issue metrics
    runs-on: ubuntu-latest
    permissions:
      issues: write
      pull-requests: read
    steps:
    - name: Get dates for last month
      shell: bash
      run: |
        # 先月の初日を計算
        first_day=$(date -d "last month" +%Y-%m-01)

        # 先月の最終日を計算
        last_day=$(date -d "$first_day +1 month -1 day" +%Y-%m-%d)

        # 環境変数に日付範囲を設定
        echo "last_month=$first_day..$last_day" >> "$GITHUB_ENV"
        echo "month=$(date -d "last month" +'%Y-%m')" >> "$GITHUB_ENV"

    - name: Run issue-metrics tool
      uses: github/issue-metrics@v3
      env:
        GH_TOKEN: ${{ env.gh_token }}
        SEARCH_QUERY: 'repo:${{ env.repo }} is:issue created:${{ env.last_month }} -reason:"not planned"'

    - name: Create issue
      uses: peter-evans/create-issue-from-file@v5
      with:
        title: "【Report】Monthly issue metrics for ${{ env.month }}"
        token: ${{ secrets.GITHUB_TOKEN }}
        content-filepath: ./issue_metrics.md
        labels: |
          report
```

### 変更点の説明

1. **日付範囲の設定**:
   - `echo "month=$(date -d "last month" +'%Y-%m')" >> "$GITHUB_ENV"` により、先月の年月（`YYYY-MM`）を計算して環境変数 `month` に設定します。

2. **タイトルに集計期間を追加**:
   - `title: "【Report】Monthly issue metrics for ${{ env.month }}"` により、タイトルに先月の年月を含めるようにします。

これにより、毎月1日に実行されるジョブが、先月のメトリクスを集計し、タイトルにその集計期間を含めたイシューを作成します。

---

## 👤 ユーザー
*2024/6/14 11:44:53*

どんなタイトルになりそうですか？

---

## 🤖 アシスタント
*2024/6/14 11:44:59*

修正されたワークフローファイルを実行すると、例えば2024年6月1日にジョブが実行される場合、タイトルは以下のようになります：

```
【Report】Monthly issue metrics for 2024-05
```

ここで、「2024-05」は先月（2024年5月）の集計期間を示しています。毎月1日に実行されるたびに、タイトルにその前月の年月が含まれたイシューが作成されます。

### タイトルの例
- 2024年7月1日に実行される場合：
  ```
  【Report】Monthly issue metrics for 2024-06
  ```
- 2024年8月1日に実行される場合：
  ```
  【Report】Monthly issue metrics for 2024-07
  ```

---

## 👤 ユーザー
*2024/6/14 11:51:50*

issue だけではなくて、prだけ集計したい場合はどうすればいいの？

---

## 🤖 アシスタント
*2024/6/14 11:52:08*

Pull requests (PR) のみを集計する場合、`SEARCH_QUERY` を変更して PR に絞り込むことができます。以下のようにワークフローファイルを修正します。

### 修正したワークフローファイル

```yaml
# 月間の Pull Request Metrics の計測を行う
name: Pull Request Metrics

on:
  workflow_dispatch:
  schedule:
    - cron: '0 0 1 * *'

permissions:
  contents: read

env:
  gh_token: ${{ secrets.IOS_TEAM_PAT }} # IOS_TEAM_PAT: project, read:org, repo
  repo: suguruTakahashi-1234/swiftui-sample-app

jobs:
  build:
    name: pull request metrics
    runs-on: ubuntu-latest
    permissions:
      issues: write
      pull-requests: read
    steps:
    - name: Get dates for last month
      shell: bash
      run: |
        # 先月の初日を計算
        first_day=$(date -d "last month" +%Y-%m-01)

        # 先月の最終日を計算
        last_day=$(date -d "$first_day +1 month -1 day" +%Y-%m-%d)

        # 環境変数に日付範囲を設定
        echo "last_month=$first_day..$last_day" >> "$GITHUB_ENV"
        echo "month=$(date -d "last month" +'%Y-%m')" >> "$GITHUB_ENV"

    - name: Run issue-metrics tool
      uses: github/issue-metrics@v3
      env:
        GH_TOKEN: ${{ env.gh_token }}
        SEARCH_QUERY: 'repo:${{ env.repo }} is:pr created:${{ env.last_month }} -reason:"not planned"'

    - name: Create issue
      uses: peter-evans/create-issue-from-file@v5
      with:
        title: "【Report】Monthly pull request metrics for ${{ env.month }}"
        token: ${{ secrets.GITHUB_TOKEN }}
        content-filepath: ./issue_metrics.md
        labels: |
          report
```

### 変更点の説明

1. **ジョブの名前の変更**:
   `jobs` セクションの `name` を "pull request metrics" に変更しました。

2. **SEARCH_QUERY の変更**:
   `SEARCH_QUERY` を `is:pr` に変更し、PR のみを対象とするようにしました。
   ```yaml
   SEARCH_QUERY: 'repo:${{ env.repo }} is:pr created:${{ env.last_month }} -reason:"not planned"'
   ```

3. **タイトルの変更**:
   タイトルを "Monthly pull request metrics" に変更しました。
   ```yaml
   title: "【Report】Monthly pull request metrics for ${{ env.month }}"
   ```

これにより、毎月1日に実行されるジョブが、先月の PR のメトリクスを集計し、タイトルにその集計期間を含めたイシューを作成します。

---
