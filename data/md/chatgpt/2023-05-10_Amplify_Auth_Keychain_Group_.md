# Amplify Auth Keychain Group.

日付: 2023-05-10

---

## 👤 ユーザー
*2023/5/10 23:52:43*

SwiftでAmplify Auth を使って開発するにはapplication target &gt; Signing & Capabilities &gt; + Capability, then select Keychain Sharing からキーチェーンの設定を有効にしないといけないみたいなんだけどその時に作成するキーチェーングループって命名はどうすればいいの？

---

## 🤖 アシスタント
*2023/5/10 23:55:31*

キーチェーングループの命名は、一般的には次のようなルールに従っています。

1. まず、リーディングに `com.apple.security.` を使用します。これはキーチェーンアクセスグループのデフォルトのプレフィックスです。
2. 次に、あなたのアプリケーションのBundle IDやOrganizational Identifierと組み合わせて、ユニークなキーチェーングループ名を作成します。たとえば、あなたのアプリケーションのBundle IDが `com.example.myapp` の場合、キーチェーングループ名は `com.apple.security.com.example.myapp` になります。

ただし、これは一例であり、あなたのプロジェクトや組織の要件に応じて、異なる命名規則を適用することもできます。キーチェーングループ名は、他のアプリケーションと重複しない限り、自由に命名できます。最も重要なのは、キーチェーングループ名が一意であることを確認することです。

Amplify Authを使ったプロジェクトでキーチェーン設定を有効にする方法は以下のとおりです。

1. Xcodeでプロジェクトを開きます。
2. 対象アプリのターゲットを選択し、左側のナビゲーションバーで「Signing & Capabilities」タブを開きます。
3. 画面上部にある「+ Capability」ボタンをクリックして、Capabilityリストから「Keychain Sharing」を選択します。
4. 「Keychain Groups」セクションに表示されるデフォルトのキーチェーングループ名が適切でない場合は、上記の命名規則に従って適切な名前に変更してください。

これで、Amplify Authを使ったプロジェクトでキーチェーン設定が有効になります。

---
