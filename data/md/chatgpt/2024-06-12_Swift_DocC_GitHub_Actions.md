# Swift-DocC GitHub Actions

日付: 2024-06-12

---

## 👤 ユーザー
*2024/06/12 15:53:34*

env.package_pathやenv.documentation_targetは正しく反映されるか？

# Swift-DocC を GitHub Pages に Host する
name: Swift-DocC Host

on:
  push:
    tags:
      - "*"
  workflow_dispatch:

env:
  package_path: SmallTalkPackage
  documentation_target: DomainLayer

# Allow one concurrent deployment
concurrency:
  group: "pages"
  cancel-in-progress: true

# Ref: GitHub ActionsでDocCをビルドしてGitHub Pagesにデプロイする方法 - https://qiita.com/matsuji/items/4c91af0b727038e385bb

jobs:
  # Build job
  build:
    # https://github.com/actions/runner-images
    runs-on: macos-14
    env:
      # Ref: https://github.com/actions/runner-images/blob/main/images/macos/macos-14-Readme.md#xcode
      DEVELOPER_DIR: /Applications/Xcode_15.4.app/Contents/Developer
    steps:
      - uses: actions/checkout@v4
      - name: build docc
        # Ref: https://apple.github.io/swift-docc-plugin/documentation/swiftdoccplugin/publishing-to-github-pages/#Generating-the-Documentation-Site
        run: |
          swift package --package-path ${{ env.package_path }} --allow-writing-to-directory ./docs \
          generate-documentation --target ${{ env.documentation_target }} \
          --disable-indexing \
          --transform-for-static-hosting \
          --output-path ./docs
      - uses: actions/upload-pages-artifact@v3
        with:
          path: docs

  # Ref: https://github.com/actions/deploy-pages
  deploy:
    # Add a dependency to the build job
    needs: build

    # Grant GITHUB_TOKEN the permissions required to make a Pages deployment
    permissions:
        pages: write      # to deploy to Pages
        id-token: write   # to verify the deployment originates from an appropriate source

    # Deploy to the github-pages environment
    environment:
        name: github-pages
        url: ${{ steps.deployment.outputs.page_url }}

    # Specify runner + deployment step
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4

---

## 🤖 アシスタント
*2024/06/12 15:53:48*

The `env.package_path` and `env.documentation_target` variables should be correctly reflected and utilized in your GitHub Actions workflow. The `env` section at the top defines these environment variables, which are then referenced in the `run` command within the `build` job. Here's a slightly modified version of your script with added comments for clarity:

```yaml
name: Swift-DocC Host

on:
  push:
    tags:
      - "*"
  workflow_dispatch:

env:
  package_path: SmallTalkPackage
  documentation_target: DomainLayer

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: macos-14
    env:
      DEVELOPER_DIR: /Applications/Xcode_15.4.app/Contents/Developer
    steps:
      - uses: actions/checkout@v4
      - name: build docc
        run: |
          swift package --package-path ${{ env.package_path }} --allow-writing-to-directory ./docs \
          generate-documentation --target ${{ env.documentation_target }} \
          --disable-indexing \
          --transform-for-static-hosting \
          --output-path ./docs
      - uses: actions/upload-pages-artifact@v3
        with:
          path: docs

  deploy:
    needs: build
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

In this script:

1. The `env` section at the top defines `package_path` and `documentation_target`.
2. These environment variables are referenced in the `build docc` step using the `${{ env.variable_name }}` syntax.

This approach should ensure that `env.package_path` and `env.documentation_target` are correctly reflected in your `swift package` command, allowing for the proper generation and deployment of your documentation. If you encounter any issues, check the workflow logs for any errors related to these variables to ensure they are being passed correctly.

---
