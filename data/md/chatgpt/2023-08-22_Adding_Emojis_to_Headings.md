# Adding Emojis to Headings

Date: 2023-08-22

---

## 👤 User
*2023-08-22 22:57:13*

見出しに絵文字を付与して欲しい

### 概要

- xxx すると yyy となる

### 期待値の挙動

- zzz になること

### スクリーンショット or 動画（あれば）



### 再現手順

1. xxx

### 再現確率

- 毎回発生 or n回かに1回発生 or ごく稀に発生 

### アプリ端末情報

- アプリのバージョン：
- 端末名：
- iOS のバージョン：

### 補足情報

- とくになし

---

## 🤖 Assistant
*2023-08-22 22:57:54*

絵文字を見出しに追加すると以下のようになります。各見出しに合わせて適切な絵文字を選んでみました。

📝 **概要**

- xxx すると yyy となる

🚀 **期待値の挙動**

- zzz になること

🖼️ **スクリーンショット or 動画（あれば）**



🔍 **再現手順**

1. xxx

📊 **再現確率**

- 毎回発生 or n回かに1回発生 or ごく稀に発生 

📱 **アプリ端末情報**

- アプリのバージョン：
- 端末名：
- iOS のバージョン：

ℹ️ **補足情報**

- とくになし

絵文字は目を引きやすいので、文書の見出しに使用すると、読み手にとってわかりやすくなることがあります。ただし、過度な使用や不適切な絵文字の使用は避けるようにしましょう。

---

## 👤 User
*2023-08-22 22:57:57*

.md ファイルで出力してほしい

---

## 🤖 Assistant
*2023-08-22 22:58:30*

了解しました。Markdown形式（.mdファイル）での見出しと内容を以下のように出力します：

```markdown
# 📝 概要

- xxx すると yyy となる

# 🚀 期待値の挙動

- zzz になること

# 🖼️ スクリーンショット or 動画（あれば）

(こちらにリンクや画像を挿入)

# 🔍 再現手順

1. xxx

# 📊 再現確率

- 毎回発生 or n回かに1回発生 or ごく稀に発生 

# 📱 アプリ端末情報

- アプリのバージョン：
- 端末名：
- iOS のバージョン：

# ℹ️ 補足情報

- とくになし
```

このフォーマットをお使いの.mdファイルにコピー&ペーストすることで、内容を編集して使用することができます。

---

## 👤 User
*2023-08-22 22:58:41*

以下についてもお願い
.mdで出力して欲しい

```

### やりたいこと・背景

- タイトルの通り

### 備考・関連リンク

- なし

```

---

## 🤖 Assistant
*2023-08-22 22:59:06*

了解しました。指定された内容をMarkdown形式（.mdファイル）での見出しと内容に変換します：

```markdown
# 🎯 やりたいこと・背景

- タイトルの通り

# 📎 備考・関連リンク

- なし
```

このフォーマットをお使いの.mdファイルにコピー&ペーストすることで、内容を編集して使用することができます。

---

## 👤 User
*2023-08-22 23:00:26*

同様に以下もお願い。.mdで。また # の数は変えないでいいよ

```
### issue

- #issue

### 対応した内容

- タイトルの通り

### スクリーンショット・動画（あれば）



### チェックリスト

- [ ] テストコード
- [ ] 動作確認

### 備考・関連リンク

- なし

```

---

## 🤖 Assistant
*2023-08-22 23:00:52*

了解しました。指定された内容をMarkdown形式（.mdファイル）での見出しと内容に変換します：

```markdown
### 📋 issue

- #issue

### ✅ 対応した内容

- タイトルの通り

### 🖼️ スクリーンショット・動画（あれば）

(こちらにリンクや画像を挿入)

### 📝 チェックリスト

- [ ] テストコード
- [ ] 動作確認

### 📎 備考・関連リンク

- なし
```

このフォーマットをお使いの.mdファイルにコピー&ペーストすることで、内容を編集して使用することができます。

---

## 👤 User
*2023-08-22 23:03:11*

yamlなんだけど、以下のtitleの左側に絵文字をつけてほしい

# Ref: https://docs.github.com/ja/repositories/releasing-projects-on-github/automatically-generated-release-notes

changelog:
  exclude:
    labels:
      - ignore-for-release
    authors:
      - octocat
  # Ref: https://github.com/Viagate/emomil-app-ios/labels
  categories:
    - title: New Enhancements
      labels:
        - enhancement
    - title: Bug Fixes
      labels:
        - bug
    - title: Documentation Updates
      labels:
        - documentation
    - title: Other Changes
      labels:
        - "*"

---

## 🤖 Assistant
*2023-08-22 23:03:43*

了解しました。以下のように`title`の左側に適切な絵文字を付与しました。

```yaml
# Ref: https://docs.github.com/ja/repositories/releasing-projects-on-github/automatically-generated-release-notes

changelog:
  exclude:
    labels:
      - ignore-for-release
    authors:
      - octocat
  # Ref: https://github.com/Viagate/emomil-app-ios/labels
  categories:
    - title: 🌟 New Enhancements
      labels:
        - enhancement
    - title: 🐛 Bug Fixes
      labels:
        - bug
    - title: 📖 Documentation Updates
      labels:
        - documentation
    - title: 🔄 Other Changes
      labels:
        - "*"
```

絵文字は可読性を高めるために役立つことがありますが、YAMLファイルの構文として問題がないか、適切にパースされるかなど、動作確認をしっかり行うことをおすすめします。

---

## 👤 User
*2023-08-22 23:03:53*

Bug Fixes と Other Changes は別のに変えて欲しい

---

## 🤖 Assistant
*2023-08-22 23:04:21*

了解しました。それぞれのタイトルに合わせて絵文字を変更します。

```yaml
# Ref: https://docs.github.com/ja/repositories/releasing-projects-on-github/automatically-generated-release-notes

changelog:
  exclude:
    labels:
      - ignore-for-release
    authors:
      - octocat
  # Ref: https://github.com/Viagate/emomil-app-ios/labels
  categories:
    - title: 🌟 New Enhancements
      labels:
        - enhancement
    - title: 🐞 Bug Fixes
      labels:
        - bug
    - title: 📖 Documentation Updates
      labels:
        - documentation
    - title: 🔧 Other Changes
      labels:
        - "*"
```

こちらで`Bug Fixes`には🐞を、`Other Changes`には🔧を使用しました。これにより、各カテゴリーの内容を一目でわかりやすく表現しています。

---
