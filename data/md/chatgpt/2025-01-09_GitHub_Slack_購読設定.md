# GitHub Slack 購読設定

日付: 2025-01-09

---

## 👤 ユーザー
*2025/01/09 13:05:12*

slack での github の /github subscribe 設定確認

---

## 🔧 ツール
*2025/01/09 13:05:27*

**Confirming subscription settings**

I'm thinking about how to check the Slack channel's subscription settings for GitHub repos using the "/github subscribe" command, ensuring it’s effectively working.

**Validating subscription**

I'm working out how to confirm existing GitHub Slack integration. The feasible options include using `/github subscribe list` or checking the GitHub Slack official documentation.

**Confirming subscription options**

OK, let me see: you can check subscription settings with commands like `/github subscribe [repo]` or `/github unsubscribe [repo]`. For organization-wide subscriptions, use `/github subscribe [owner]`.

**Figuring out subscription commands**

Turns out, the GitHub Slack integration might have features like "manage subscription" and slash commands like `/github subscription list`. The UI also offers a "Manage Subscriptions" option.

**Validating commands**

OK, let me see: using `/github subscriptions` to view current repository subscriptions, or commands like `/github subscribe help` or `/github subscribe [owner/repo]` for more specific settings.

---

## 🤖 アシスタント
*2025/01/09 13:05:27*

Slack の GitHub アプリでは、特定のチャンネルがどのリポジトリに対してどのイベントを購読しているかを、次のような手順で確認できます。

---

## 1. GitHub アプリが導入されていることを確認する

まずは、ワークスペースに公式の [GitHub for Slack](https://github.com/integrations/slack) アプリがインストールされていることを確認してください。  
すでに導入済みの場合は、チャンネルで `/github` コマンドが使えるはずです。

---

## 2. チャンネルでコマンドを実行する

Slack の該当チャンネルに移動し、次のいずれかのコマンドを入力します。

### 2-1. `/github subscribe` コマンドのヘルプ表示
```
/github subscribe help
```
ヘルプ内容が表示され、購読設定に関するオプション一覧を確認できます。

### 2-2. `/github subscribe list` （または似たコマンド）を試す
Slack の GitHub アプリのバージョンや設定によっては、下記のようなコマンドが利用可能な場合があります。

```
/github subscribe list
```
もしこのコマンドが利用可能であれば、現在のチャンネルがサブスクライブしているリポジトリとイベントの一覧が表示されます。

&gt; **補足:**  
&gt; バージョンやワークスペースごとのカスタマイズ状況によっては、上記コマンドではなく `/github subscriptions` や `/github settings` など別のコマンドを使う場合もあります。  
&gt; `/github help` を入力すると対応しているコマンドの一覧が表示されるので、まずそちらを確認してください。

---

## 3. 個別リポジトリの購読状況を確認する

特定のリポジトリの購読設定を確認したい場合は、以下のように `/github subscribe` コマンドを使います。

```
/github subscribe <organization>/<repository>
```

チャンネルがすでに購読している場合は、どのイベント（Issue、Pull Request、Push など）を購読しているかが返答メッセージに表示されます。  
もしまだ購読していない場合は、「新たに購読します」という趣旨のメッセージが返ってきます。

---

## 4. イベントの種類を絞った購読を確認・設定する

GitHub の Slack アプリでは、以下のように購読するイベントを細かく指定・除外できます。

```
/github subscribe <organization>/<repository> [issues, pulls, commits, releases, comments, reviews, etc.]
```

たとえば Issue と Pull Request イベントのみ購読したい場合:
```
/github subscribe octocat/Hello-World issues pulls
```

また、特定のイベントを購読停止する（除外する）場合は次のように行います:
```
/github subscribe octocat/Hello-World -comments
```

---

## 5. 購読を解除したい場合

もし不要になった購読がある場合は、以下のように `/github unsubscribe` コマンドを使います。

```
/github unsubscribe <organization>/<repository>
```

これでチャンネルがそのリポジトリから受け取っている更新通知を解除できます。

---

## まとめ

1. Slack に GitHub アプリが正しくインストールされていることを確認する  
2. 該当チャンネルで `/github help` を入力し、利用可能なコマンドを確認  
3. `/github subscribe list` や類似コマンドで現在の購読状況を一覧表示  
4. `/github subscribe <owner>/<repo>` などで個別リポジトリの購読設定確認・更新  
5. 必要に応じて購読の追加／除外／解除を行う  

上記の手順で、Slack チャンネルごとの GitHub 購読設定を確認・管理できます。もしコマンドが反応しない場合は、GitHub アプリのバージョンやインストール状態、権限などを再度ご確認ください。

---

## 👤 ユーザー
*2025/01/09 13:06:04*

/github subscribe list の詳細をしりたい

---

## 🔧 ツール
*2025/01/09 13:06:22*

**Gathering information**

I’m outlining Slack's GitHub slash command "subscribe list," explaining its functionality to view subscriptions within a Slack channel. This involves exploring command variations and potential integration details from official sources like the GitHub blog or documentation.

**Navigating Slack commands**

I’m noting the need for precise syntax and considering alternative commands if issues arise. Also, exploring options related to repository subscriptions and event toggling in Slack's GitHub integration.

**Understanding subscription visibility**

I’m explaining that the default list command shows channel-specific subscriptions and specific events, not workspace-wide. Subscription details for a particular repository across multiple channels cannot be viewed from Slack.

---

## 🤖 アシスタント
*2025/01/09 13:06:22*

Slack の GitHub アプリにおける **`/github subscribe list`** コマンドは、**「いまこのチャンネルでどのリポジトリを購読しているか、その購読内容を一覧で確認する」**ためのコマンドです。  
このコマンドを実行すると、以下のような情報が表示されます（バージョン・設定によって多少異なります）。

1. **購読中のリポジトリ一覧**  
   - 例: `octocat/Hello-World`  
   - チャンネルが購読しているすべてのリポジトリが表示されます。

2. **購読中のイベント種別**  
   - 例: `issues, pulls, commits`  
   - どのイベント（Issue, Pull Request, Commit, Comment, Release など）を購読しているかが表示される場合があります。

3. **購読の除外指定**  
   - 例: `-comments`  
   - もし特定のイベントを明示的に「除外」している場合、その情報も表示されます。

4. **購読がない場合**  
   - もし購読が一切ないチャンネルで実行した場合は、`No subscriptions found in this channel` のようなメッセージが表示されることがあります。

---

## よくある注意点

- **バージョンによってコマンド名が異なる場合がある**  
  `list` コマンドがサポートされていないバージョンのアプリや、ワークスペース固有のカスタマイズがある場合は、`/github help` を実行し、実際に利用できるコマンド一覧を確認してください。

- **チャンネルの権限や GitHub アプリの権限設定**  
  コマンドが正しく動作しない場合は、GitHub アプリがそのチャンネルで適切な権限を持っているかをチェックしてください。ワークスペースオーナーまたはアプリ管理者の設定によっては制限されている場合があります。

- **「このチャンネルが購読しているリポジトリ」を知るための機能**  
  `/github subscribe list` は「このチャンネル」に限定した購読状況を確認するコマンドです。ほかのチャンネルが購読している内容は一覧に含まれません。

- **購読の追加・変更は `/github subscribe` コマンドで**  
  イベント種別の追加や削除など、購読設定を変更したい場合は、改めて `/github subscribe <owner>/<repo> [イベント指定]` などを実行して設定を上書きするか、`/github unsubscribe <owner>/<repo>` で購読解除を行い再設定するのが一般的です。

---

### 例: `/github subscribe list` 実行結果のイメージ

```
You are currently subscribed to the following repositories in this channel:
• octocat/Hello-World
  - Subscribed events: issues, pulls, commits
  - Excluded events: comments

• your-org/awesome-repo
  - Subscribed events: issues, pulls
  (No events excluded)
```

上記のように、購読しているリポジトリと、購読しているイベント・除外しているイベントが一覧表示されます。

---

## まとめ

- **`/github subscribe list`** は「チャンネルが現在購読しているリポジトリやイベント」を一覧表示するコマンド。  
- 実行すると、購読中リポジトリのリストやイベント種別（Issues, Pulls, Commits など）、除外設定があればその内容が返ってくる。  
- バージョンによってはこのコマンドが利用できない場合もあるため、その場合は **`/github help`** で利用可能なコマンドを確認するとよい。

---
