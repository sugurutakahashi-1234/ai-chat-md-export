# Markdown Table CLI Formatters

日付: 2025-06-11

---

## 👤 ユーザー
*2025/6/11 15:26:06*

マークダウンのテーブルのcliのフォーマッターは存在するか？

---

## 🤖 アシスタント
*2025/6/11 15:26:24*

はい、マークダウンテーブルのCLIフォーマッターはいくつか存在します。主なものを紹介します：

## 1. **markdown-table-prettify**
Node.js製のツールで、マークダウンテーブルを整形できます。
```bash
npm install -g markdown-table-prettify
markdown-table-prettify input.md
```

## 2. **mdformat**
Pythonベースの汎用マークダウンフォーマッターで、テーブルの整形にも対応しています。
```bash
pip install mdformat mdformat-tables
mdformat file.md
```

## 3. **prettier**
JavaScriptの有名なフォーマッターで、マークダウンファイル全体（テーブル含む）を整形できます。
```bash
npm install -g prettier
prettier --write file.md
```

## 4. **pandoc**
文書変換ツールですが、`--to markdown`オプションでマークダウンの整形も可能です。
```bash
pandoc input.md -t markdown -o output.md
```

## 5. **table-formatter** (Vim/Neovimプラグイン)
エディタ内で使える場合は、vim-table-modeなどのプラグインも便利です。

これらのツールは、以下のような整形を行います：

整形前：
```markdown
|名前|年齢|職業|
|---|---|---|
|田中|25|エンジニア|
|佐藤|30|デザイナー|
```

整形後：
```markdown
| 名前 | 年齢 | 職業       |
|------|------|------------|
| 田中 | 25   | エンジニア |
| 佐藤 | 30   | デザイナー |
```

用途に応じて選択すると良いでしょう。単純なテーブル整形だけならmarkdown-table-prettifyが軽量で使いやすく、プロジェクト全体のフォーマッターとして使うならprettierがおすすめです。

---

## 👤 ユーザー
*2025/6/11 15:26:51*

biome とかにマークダウンのフォーマットはあるか＞

---

## 🤖 アシスタント
*2025/6/11 15:27:11*

残念ながら、現時点でBiomeはマークダウンのフォーマットをサポートしていません。

BiomeがサポートしているのはJavaScript、TypeScript、JSX、JSON、CSS、GraphQLのみです。GitHubのIssue #3718でマークダウンサポートについてのタスクが作成されていますが、まだ実装されていない状況です。

2024年9月の記事でも「Biomeは執筆時点でマークダウンを全くサポートしていない」と記載されています。

そのため、マークダウンのフォーマットが必要な場合は、前述した以下のような他のツールを使用する必要があります：

- \*\*Prettier\*\* - マークダウンをサポートする最も人気のあるフォーマッター
- \*\*dprint\*\* - マークダウンプラグインが利用可能
- \*\*mdformat\*\* - マークダウン専用のフォーマッター
- \*\*markdownlint\*\* - マークダウンのリンターとフォーマッター

BiomeとPrettierを併用する場合は、それぞれの対象ファイルを設定で分けることで共存可能です。

---

## 👤 ユーザー
*2025/6/11 15:27:44*

この4つのcliの比較をしたい。github star のリンクを作って欲しい

---

## 🤖 アシスタント
*2025/6/11 15:27:55*

以下、4つのCLIツールのGitHubリポジトリとスター数を確認できるリンクです：

## 1. \*\*Prettier\*\*
🔗 https://github.com/prettier/prettier  
!\[GitHub stars\](https://img.shields.io/github/stars/prettier/prettier?style=social)

## 2. \*\*dprint\*\*
🔗 https://github.com/dprint/dprint  
!\[GitHub stars\](https://img.shields.io/github/stars/dprint/dprint?style=social)

## 3. \*\*mdformat\*\*
🔗 https://github.com/executablebooks/mdformat  
!\[GitHub stars\](https://img.shields.io/github/stars/executablebooks/mdformat?style=social)

## 4. \*\*markdownlint\*\*
🔗 https://github.com/DavidAnson/markdownlint  
!\[GitHub stars\](https://img.shields.io/github/stars/DavidAnson/markdownlint?style=social)

### 簡単な比較

| ツール | 言語 | 特徴 |
|--------|------|------|
| \*\*Prettier\*\* | JavaScript | 最も人気。多言語対応（JS/TS/CSS/HTML/MD等） |
| \*\*dprint\*\* | Rust | 高速。プラグインシステムで拡張可能 |
| \*\*mdformat\*\* | Python | マークダウン専用。CommonMark準拠 |
| \*\*markdownlint\*\* | JavaScript | リンター機能も持つ。ルールが豊富 |

各リンクをクリックすると、現在のスター数やプロジェクトの詳細を確認できます。

---
