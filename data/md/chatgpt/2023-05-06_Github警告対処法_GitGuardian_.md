# Github警告対処法(GitGuardian)

Date: 2023-05-06

---

## 👤 User
*2023-05-06 14:51:34*

publicなGithubリポジトリにGoogleService-Info.plist をpushしたらgitguardianから警告がきた。
GoogleService-Info.plist  をpushするリスクと解決方法を教えて欲しい

---

## 🤖 Assistant
*2023-05-06 14:52:18*

`GoogleService-Info.plist` ファイルは、FirebaseやGoogleサービスを利用するiOSアプリで使用される設定ファイルです。このファイルには、APIキーやアプリIDなど、機密性のある情報が含まれているため、publicなGitHubリポジトリにpushすることはセキュリティ上のリスクがあります。GitGuardian は、このような機密情報の流出を検出し、アラートを送るセキュリティツールです。

リスク：
1. 不正アクセス: 悪意のあるユーザーが、この情報を使用してアプリやサービスへの不正アクセスを試みることがあります。
2. クレデンシャルの悪用: APIキーを使用して、制限を超えるリクエストや請求が発生する可能性があります。

解決方法：
1. 履歴から削除: `GoogleService-Info.plist` ファイルをGit履歴から完全に削除してください。これには、以下のコマンドを使用できます。

```
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch GoogleService-Info.plist" --prune-empty --tag-name-filter cat -- --all
```

2. `.gitignore` に追加: `GoogleService-Info.plist` ファイルを `.gitignore` ファイルに追加し、今後のコミットから除外してください。

```
echo "GoogleService-Info.plist" >> .gitignore
git add .gitignore
git commit -m "Add GoogleService-Info.plist to .gitignore"
```

3. プライベートな方法で共有: `GoogleService-Info.plist` ファイルは、チームメンバー間でプライベートな方法で共有してください。例えば、プライベートリポジトリやCI/CDシステムの秘密変数機能を使うなどです。

4. クレデンシャルの再生成: 既に公開された情報が悪用されるリスクを排除するため、FirebaseやGoogle Cloud Consoleで関連するクレデンシャルやAPIキーを再生成してください。

---

## 👤 User
*2023-05-06 14:53:38*

でもXcode CloudにてビルドやTestFlightにアップロードするときにGoogleService-Info.plist は読み込ませる必要があるんだけどどうすればいい？

---

## 🤖 Assistant
*2023-05-06 14:54:40*

Xcode Cloudを使用してビルドやTestFlightへのアップロードを行う場合、`GoogleService-Info.plist` をセキュアに扱う方法がいくつかあります。

1. Xcode Cloudの環境変数を使用する:
   Xcode Cloudでは、ビルド環境変数を使用してセキュアな情報をプロジェクトに渡すことができます。`GoogleService-Info.plist` の各キーを環境変数として設定し、ビルド時に動的にファイルを生成する方法です。

   ビルド前にスクリプトを実行して、環境変数から`GoogleService-Info.plist`を生成します。Xcode プロジェクトの **Build Phases** タブで、**New Run Script Phase** を追加し、以下のスクリプトを追加してください。

   ```sh
   #!/bin/sh
   echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>
   <!DOCTYPE plist PUBLIC \"-//Apple//DTD PLIST 1.0//EN\" \"http://www.apple.com/DTDs/PropertyList-1.0.dtd\">
   <plist version=\"1.0\">
   <dict>
   <key>API_KEY</key>
   <string>${API_KEY}</string>
   <key>CLIENT_ID</key>
   <string>${CLIENT_ID}</string>
   <!-- 他のキーも同様に追加 -->
   </dict>
   </plist>" > "${SRCROOT}/path/to/GoogleService-Info.plist"
   ```

   そして、Xcode Cloudのビルド設定で環境変数（API_KEY, CLIENT_ID など）を設定します。これにより、`GoogleService-Info.plist` はリポジトリに含めず、ビルド時に動的に生成されます。

2. Secure Filesを使用する:
   Xcode CloudのSecure Files機能を使用して、`GoogleService-Info.plist`をプロジェクトに追加することができます。Secure Filesは、リポジトリに含めずにファイルを管理できる機能です。まず、Xcode Cloudのビルド設定でSecure Filesをアップロードし、それをビルド環境に適用します。そして、ビルド前にスクリプトを実行して、Secure Fileをプロジェクトの適切な場所にコピーします。

   **Build Phases** タブで、**New Run Script Phase** を追加し、以下のスクリプトを追加してください。

   ```sh
   #!/bin/sh
   cp "${XCS_SECURE_FILE_DIR}/GoogleService-Info.plist" "${SRCROOT}/path/to/GoogleService-Info.plist"
   ```

   これらの方法を使用することで、`GoogleService-Info.plist`をセキュアに扱い、Xcode Cloudを使用したビルドやTestFlightへのアップロードを行うことが

---

## 👤 User
*2023-05-06 14:55:09*

つづき

---

## 🤖 Assistant
*2023-05-06 14:55:17*

できます。

これらの方法を使用することで、`GoogleService-Info.plist`をセキュアに扱い、Xcode Cloudを使用したビルドやTestFlightへのアップロードを行うことができます。公開リポジトリに機密情報を含めないように注意して、安全な開発環境を維持してください。

---
