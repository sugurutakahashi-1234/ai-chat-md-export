# SwiftライブラリMockoloのインストール

Date: 2023-05-06

---

## 👤 User
*2023-05-07 01:34:04*

以下のライブラリをSwiftで開発しているアプリで使いたいと思う。

https://github.com/uber/mockolo

以下のOption 3の方法で使おうと思うんだけど、どうすればいいかわからない。

https://github.com/uber/mockolo#build--install
Option 3: Use the binary
Go to the Release tab and download/install the binary directly.

やり方をおしえてほしい。

---

## 🤖 Assistant
*2023-05-07 01:35:00*

Option 3に従って、Mockoloのバイナリをダウンロードしてインストールする方法を説明します。

1. まず、MockoloのGitHubリポジトリのリリースページにアクセスしてください。以下のリンクからアクセスできます。
   https://github.com/uber/mockolo/releases

2. リリースページで最新のリリースバージョンを見つけてください。バージョン番号の横にある "Assets" をクリックし、`mockolo-x.x.x.zip` ファイルを見つけます。ここで、`x.x.x`はバージョン番号です。

3. `mockolo-x.x.x.zip` ファイルをクリックしてダウンロードします。ダウンロードが完了したら、zipファイルを解凍してください。

4. 解凍されたフォルダ内にある `mockolo` バイナリを、適切なディレクトリに移動させます。例えば、`/usr/local/bin` ディレクトリに移動させることで、コマンドラインからどこでも実行できるようになります。ターミナルで以下のコマンドを実行して、バイナリを移動させてください（ディレクトリ名は適宜変更してください）。

   ```
   $ mv /path/to/your/downloaded/mockolo /usr/local/bin
   ```

5. Mockoloのインストールが完了しました。ターミナルで `mockolo` コマンドを実行して、正常にインストールされていることを確認してください。以下のコマンドを実行し、Mockoloのヘルプ情報が表示されることを確認してください。

   ```
   $ mockolo -h
   ```

これで、Swiftで開発しているアプリでMockoloを使う準備が整いました。必要に応じて、ドキュメントを参照して、Mockoloの機能を活用してください。

---
