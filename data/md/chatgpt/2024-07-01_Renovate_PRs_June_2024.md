# Renovate PRs June 2024

Date: 2024-07-01

---

## 👤 User
*2024-07-01 09:40:45*

author:app/renovate を否定系にしたい

is:pr created:2024-06-01..2024-06-30 -reason:"not planned" author:app/renovate

---

## 🤖 Assistant
*2024-07-01 09:40:49*

To achieve the goal of creating a GitHub query that finds all pull requests created by `app/renovate` in June 2024 but excludes those with the reason "not planned," you can use the following search query:

```
author:app/renovate created:2024-06-01..2024-06-30 -reason:"not planned"
```

This query specifies:
- `author:app/renovate` to filter PRs created by `app/renovate`
- `created:2024-06-01..2024-06-30` to filter PRs created within June 2024
- `-reason:"not planned"` to exclude PRs with the reason "not planned"

---

## 👤 User
*2024-07-01 09:41:05*

author:app/renovate  が含まれないようにしたい

---

## 🤖 Assistant
*2024-07-01 09:41:11*

To exclude pull requests created by `app/renovate` in your GitHub query, you can use the `-author` filter. Here's how you can adjust the query to exclude PRs by `app/renovate`:

```
-created:2024-06-01..2024-06-30 -author:app/renovate
```

This query specifies:
- `created:2024-06-01..2024-06-30` to filter PRs created within June 2024
- `-author:app/renovate` to exclude PRs created by `app/renovate`

---

## 👤 User
*2024-07-01 09:43:29*

追加でapp/github-actions も含めたくない

---

## 🤖 Assistant
*2024-07-01 09:43:35*

To exclude pull requests created by both `app/renovate` and `app/github-actions` within June 2024, you can adjust the query as follows:

```
created:2024-06-01..2024-06-30 -author:app/renovate -author:app/github-actions
```

This query specifies:
- `created:2024-06-01..2024-06-30` to filter PRs created within June 2024
- `-author:app/renovate` to exclude PRs created by `app/renovate`
- `-author:app/github-actions` to exclude PRs created by `app/github-actions`

---

## 👤 User
*2024-07-01 09:45:09*

最初に書いた一つしか反映されない

---

## 🤖 Assistant
*2024-07-01 09:45:17*

GitHub's search query syntax allows combining multiple exclusions. To exclude pull requests created by both `app/renovate` and `app/github-actions` within June 2024, you can combine the conditions correctly:

```
created:2024-06-01..2024-06-30 -author:app/renovate -author:app/github-actions
```

This query should exclude PRs from both `app/renovate` and `app/github-actions`. If only one exclusion is being applied, ensure that you are using the correct syntax and format in the GitHub search bar.

If this still doesn't work, try breaking down the query to ensure each part works independently:

1. Check if `created:2024-06-01..2024-06-30 -author:app/renovate` returns the expected results.
2. Check if `created:2024-06-01..2024-06-30 -author:app/github-actions` returns the expected results.

If both work individually, they should work together in the combined query. If there is still an issue, it might be worth checking GitHub's documentation or support for any syntax updates or limitations.

---
