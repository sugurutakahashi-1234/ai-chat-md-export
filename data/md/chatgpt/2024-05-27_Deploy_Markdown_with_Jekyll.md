# Deploy Markdown with Jekyll

日付: 2024-05-27

---

## 👤 ユーザー
*2024/05/27 16:22:29*

特定のフォルダのマークダウンファイルをJekyllを使ってGitHub Pages にデプロイしたい。GitHub Actions で行いたい

---

## 🤖 アシスタント
*2024/05/27 16:22:57*

GitHub Actions を使って特定のフォルダのマークダウンファイルを Jekyll を使用して GitHub Pages にデプロイするには、以下の手順を実行します。

1. **GitHub Repository のセットアップ:**
   - Jekyll サイトのルートディレクトリに `_config.yml` ファイルを作成します。このファイルには、Jekyll の設定を記述します。
   - Jekyll のテンプレートファイル、レイアウト、インクルード、データファイル、およびアセットを配置します。

2. **GitHub Actions Workflow の作成:**
   - `.github/workflows` フォルダに新しい YAML ファイルを作成します。たとえば `deploy.yml` とします。

以下は、GitHub Actions Workflow の例です。この例では、`docs` フォルダ内のマークダウンファイルをデプロイします。

```yaml
name: Deploy Jekyll site to GitHub Pages

on:
  push:
    branches:
      - main  # mainブランチにpushされた場合にトリガーされます

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout repository
      uses: actions/checkout@v2
      
    - name: Setup Ruby
      uses: ruby/setup-ruby@v1
      with:
        ruby-version: '2.7'  # 使用するRubyのバージョン

    - name: Install Jekyll and Bundler
      run: gem install jekyll bundler

    - name: Build Jekyll site
      run: bundle exec jekyll build --source docs --destination _site

    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: _site
```

3. **GitHub Pages の設定:**
   - GitHub リポジトリの `Settings` タブに移動し、`Pages` セクションでデプロイするブランチ（通常は `gh-pages`）とフォルダを指定します。

4. **Jekyll サイトの設定:**
   - `_config.yml` ファイルに Jekyll サイトの設定を記述します。たとえば、以下のように記述します：

```yaml
title: My Jekyll Site
description: A simple Jekyll site deployed with GitHub Actions
baseurl: "" # the subpath of your site, e.g. /blog
url: "https://yourusername.github.io" # the base hostname & protocol for your site
```

5. **Jekyll の依存関係の管理:**
   - `Gemfile` に Jekyll とその他の依存関係を記述します。以下は例です：

```ruby
source 'https://rubygems.org'
gem 'jekyll'
gem 'jekyll-paginate'
gem 'jekyll-sitemap'
gem 'jekyll-seo-tag'
```

これらの設定を行うことで、特定のフォルダのマークダウンファイルを Jekyll を使って GitHub Pages にデプロイするための GitHub Actions ワークフローを構築できます。

---
