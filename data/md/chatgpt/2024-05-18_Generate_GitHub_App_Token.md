# Generate GitHub App Token

日付: 2024-05-18

---

## 👤 ユーザー
*2024/5/18 12:44:45*

以下を使った
https://github.com/actions/create-github-app-token

---

## 🤖 アシスタント
*2024/5/18 12:44:48*

To use the `actions/create-github-app-token` GitHub Action, follow these steps to generate a GitHub App Installation Access Token for your workflows:

1. **Register a GitHub App**:

---

## 👤 ユーザー
*2024/5/18 12:44:49*

ｋ

---

## 🤖 アシスタント
*2024/5/18 12:45:06*

To use the `actions/create-github-app-token` GitHub Action for generating a GitHub App Installation Access Token in your workflows, follow these steps:

1. **Register a GitHub App**: 
   - Go to your GitHub account settings and navigate to **Developer settings** > **GitHub Apps**.
   - Click on **New GitHub App** and fill in the required details.
   - Set the necessary permissions for your app to access the required resources.
   - Generate a private key for your app and download it.

2. **Store the App ID and Private Key**:
   - In your repository, go to **Settings** > **Secrets and variables** > **Actions**.
   - Add a new secret with the name `PRIVATE_KEY` and paste the contents of the private key file (including the `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----` lines).
   - Add a new repository variable with the name `APP_ID` and enter the App ID from the GitHub App settings page.

3. **Create the GitHub Actions Workflow**:
   - In your repository, create a new workflow YAML file (e.g., `.github/workflows/app-token.yml`).
   - Use the following example to configure the workflow to generate a GitHub App Installation Access Token:

```yaml
name: Generate GitHub App Token

on:
  push:
    branches:
      - main

jobs:
  create-token:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/create-github-app-token@v1
        id: app-token
        with:
          app-id: ${{ vars.APP_ID }}
          private-key: ${{ secrets.PRIVATE_KEY }}
      - run: echo "The created token is masked: ${{ steps.app-token.outputs.token }}"
```

4. **Use the Generated Token**:
   - You can now use the generated token in subsequent steps of your workflow. For example, to check out a repository using the generated token:

```yaml
jobs:
  checkout-repo:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/create-github-app-token@v1
        id: app-token
        with:
          app-id: ${{ vars.APP_ID }}
          private-key: ${{ secrets.PRIVATE_KEY }}
      - uses: actions/checkout@v4
        with:
          token: ${{ steps.app-token.outputs.token }}
          ref: ${{ github.head_ref }}
          persist-credentials: false
```

This setup ensures that you can generate and use GitHub App Installation Access Tokens securely in your workflows, allowing for authenticated API requests and access to other repositories or organizational resources.

For more details, refer to the official documentation:
- [GitHub - actions/create-github-app-token](https://github.com/actions/create-github-app-token)
- [Making authenticated API requests with a GitHub App in a GitHub Actions workflow](https://docs.github.com/en/actions/deployment/authenticating-with-the-github_token)

---
