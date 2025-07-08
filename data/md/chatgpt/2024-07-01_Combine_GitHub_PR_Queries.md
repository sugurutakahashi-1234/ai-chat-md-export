# Combine GitHub PR Queries

Date: 2024-07-01

---

## 👤 User
*2024-07-01 15:38:48*

Query to find PRs created by user A and user B on github

---

## 🤖 Assistant
*2024-07-01 15:38:58*

To find PRs created by user A and user B on GitHub, you can use the following query syntax directly on the GitHub search bar:

```text
is:pr author:USER_A author:USER_B
```

However, GitHub's search doesn't support multiple `author:` filters directly in a single query. Instead, you need to use GitHub's advanced search features or make two separate searches and combine the results. Here’s how you can search for PRs by each user individually:

1. PRs created by User A:
```text
is:pr author:USER_A
```

2. PRs created by User B:
```text
is:pr author:USER_B
```

If you want to combine these results programmatically or visualize them together, you can use GitHub's API to fetch PRs by both users and combine the results.

### Using GitHub API

You can use the GitHub API to fetch PRs created by both users. Here's a script in Python using the `requests` library:

```python
import requests

def get_prs(user):
    url = f"https://api.github.com/search/issues?q=is:pr+author:{user}"
    response = requests.get(url)
    return response.json()

# Replace 'USER_A' and 'USER_B' with the actual GitHub usernames
prs_user_a = get_prs("USER_A")
prs_user_b = get_prs("USER_B")

# Combine the results
all_prs = prs_user_a['items'] + prs_user_b['items']

# Output PR titles and URLs
for pr in all_prs:
    print(f"Title: {pr['title']}, URL: {pr['html_url']}")
```

This script will fetch the PRs created by both users and combine them. You can customize it further to filter by repository, date, or other criteria as needed.

### Using GitHub's Advanced Search

For more complex queries and advanced search capabilities, you can use GitHub's advanced search options. Here's the URL format for advanced search:

1. PRs by User A:
```
https://github.com/search?q=is:pr+author:USER_A&type=issues
```

2. PRs by User B:
```
https://github.com/search?q=is:pr+author:USER_B&type=issues
```

You can then manually combine the results from these searches.

### Summary

While GitHub's search bar doesn't support multiple `author:` filters in a single query, you can achieve the desired results by either performing individual searches or using the GitHub API to programmatically combine results from multiple users.

---

## 👤 User
*2024-07-01 15:41:18*

これだとこの2つのauthorによって作成されたPRだけを表示したいがそうはならなかった
is:pr author:app/renovate  author:app/github-actions

---

## 🤖 Assistant
*2024-07-01 15:41:41*

確かに、GitHubの検索バーでは複数の`author:`フィルターを同時に使用できませんが、2つの異なるユーザーが作成したPRを表示するには、GitHubのAPIを使用するか、個別に検索して結果を手動で組み合わせる方法があります。

### GitHub APIを使用する方法

PythonでGitHub APIを使って、指定された2つのユーザーによって作成されたPRを検索し、組み合わせるスクリプトを以下に示します：

```python
import requests

def get_prs(user):
    url = f"https://api.github.com/search/issues?q=is:pr+author:{user}"
    headers = {"Accept": "application/vnd.github.v3+json"}
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()

# ユーザー名を適宜変更してください
user_a = "app/renovate"
user_b = "app/github-actions"

prs_user_a = get_prs(user_a)
prs_user_b = get_prs(user_b)

# 2つのリストを組み合わせる
all_prs = prs_user_a['items'] + prs_user_b['items']

# PRのタイトルとURLを出力
for pr in all_prs:
    print(f"Title: {pr['title']}, URL: {pr['html_url']}")
```

### GitHubの検索を使った方法

個別に検索して、手動で結果を組み合わせる必要があります。

1. User AによるPRの検索：
```
is:pr author:app/renovate
```

2. User BによるPRの検索：
```
is:pr author:app/github-actions
```

### GitHubの高度な検索

GitHubの高度な検索機能を使って、それぞれのユーザーによるPRを個別に検索し、結果を確認します。

1. User AによるPRの高度な検索：
```
https://github.com/search?q=is:pr+author:app/renovate&type=issues
```

2. User BによるPRの高度な検索：
```
https://github.com/search?q=is:pr+author:app/github-actions&type=issues
```

### まとめ

現状のGitHub検索の制限を考慮すると、最も効率的な方法はAPIを使ってPRを取得し、プログラム上で結果を組み合わせる方法です。また、GitHubの検索バーでは個別に検索して手動で結果を確認することも可能です。

---
