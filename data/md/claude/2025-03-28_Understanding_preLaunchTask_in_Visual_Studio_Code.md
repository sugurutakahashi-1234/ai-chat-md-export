# Understanding preLaunchTask in Visual Studio Code

日付: 2025-03-28

---

## 👤 ユーザー
*2025/3/28 14:38:22*

preLaunchTask とは？

{
    "version": "0.2.0",
    "configurations": \[
        {
            "name": "local",
            "request": "launch",
            "type": "dart",
            "flutterMode": "debug",
            "program": "lib/main.dart",
            "args": \[
                "--flavor",
                "local"
            \],
            "preLaunchTask": "generate-env-local"
        },
        {
            "name": "dev",
            "request": "launch",
            "type": "dart",
            "flutterMode": "debug",
            "program": "lib/main.dart",
            "args": \[
                "--flavor",
                "dev"
            \],
            "preLaunchTask": "generate-env-dev"
        },
        {
            "name": "stage",
            "request": "launch",
            "type": "dart",
            "flutterMode": "debug",
            "program": "lib/main.dart",
            "args": \[
                "--flavor",
                "stage"
            \],
            "preLaunchTask": "generate-env-stage"
        },
        {
            "name": "prod",
            "request": "launch",
            "type": "dart",
            "flutterMode": "debug",
            "program": "lib/main.dart",
            "args": \[
                "--flavor",
                "prod"
            \],
            "preLaunchTask": "generate-env-prod"
        }
    \]
}

---

## 🤖 アシスタント
*2025/3/28 14:38:28*

`preLaunchTask`は、Visual Studio CodeのLaunch設定（launch.json）で使用されるプロパティで、デバッグセッションが開始される前に実行されるタスクを指定するものです。

あなたが共有したlaunch.jsonでは、Flutterアプリケーションをデバッグ実行する前に環境変数を生成するタスクを実行するように設定されています。具体的には：

- `"generate-env-local"` - ローカル環境用
- `"generate-env-dev"` - 開発環境用
- `"generate-env-stage"` - ステージング環境用
- `"generate-env-prod"` - 本番環境用

これらのタスクは別途tasks.jsonファイルで定義されており、それぞれの環境に応じた設定ファイルや環境変数を生成していると思われます。

例えば、"local"構成を選択してデバッグを開始すると：
1. まず`generate-env-local`タスクが実行され、ローカル環境用の設定ファイルが生成される
2. その後、Flutterアプリが`--flavor local`引数付きで起動される

このような設定により、開発者は異なる環境（開発、ステージング、本番など）向けに同じコードベースから異なる設定でアプリを実行できます。

---

## 👤 ユーザー
*2025/3/28 14:38:52*

./scripts/generate\_env.sh dev や ./scripts/generate\_env.sh prod などを実行させたいんだ

---

## 🤖 アシスタント
*2025/3/28 14:39:05*

なるほど、tasks.jsonファイルに`./scripts/generate\_env.sh`スクリプトを環境ごとに実行するためのタスク定義を作成すればいいですね。以下のようにtasks.jsonファイルを作成または編集してみてください：


このtasks.jsonファイルをプロジェクトの`.vscode`ディレクトリ内に配置してください（既に存在する場合は内容を更新）。これにより：

1. あなたが共有したlaunch.jsonの各構成で指定されている`preLaunchTask`（例：`generate-env-dev`）が実行されると
2. 対応するタスクが起動し、正しい引数（例：`dev`）を渡して`./scripts/generate\_env.sh`スクリプトを実行します

各タスクでは:
- `"reveal": "silent"`はタスク実行時にターミナルを表示しないようにします
- `"panel": "shared"`は複数のタスクが同じターミナルを共有するようにします

これで、デバッグを開始するとVS Codeが自動的に対応する環境用のスクリプトを実行してから、Flutterアプリを起動します。

---
