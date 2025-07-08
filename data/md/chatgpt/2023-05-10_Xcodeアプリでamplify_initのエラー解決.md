# Xcodeアプリでamplify initのエラー解決

Date: 2023-05-10

---

## 👤 User
*2023-05-10 19:23:30*

Xcode で作るSwiftアプリでamplify init のコマンドを実行したら以下のエラーが出力された。どうすればいい？

🛑 Creating a nested amplify project is not supported
Project root detected in: /Users/sugurutakahashi

Resolution: Rename or move the existing 'amplify' directory from: /Users/sugurutakahashi
Learn more at: https://docs.amplify.aws/cli/project/troubleshooting/

Session Identifier: d824628f-002c-441e-857f-abff36b2efe7

---

## 🤖 Assistant
*2023-05-10 19:23:34*

このエラーは、既に存在する 'amplify' ディレクトリに対して 'amplify init' コマンドを実行しようとしているために発生しています。Amplify CLI は、ネストされたプロジェクトを作成することをサポートしていないため、このエラーが発生しています。

解決策としては、指定されたディレクトリ `/Users/sugurutakahashi` 内にある既存の 'amplify' ディレクトリを別の名前に変更するか、別の場所に移動する必要があります。これにより、Amplify CLIが新しいプロジェクトを作成するために必要なディレクトリ階層を作成することができます。

移動や名前変更が済んだら、再度 'amplify init' コマンドを実行してください。そうすれば、新しいプロジェクトの初期設定を開始することができます。

---
