# Add Shields.io Badges

日付: 2023-08-12

---

## 👤 ユーザー
*2023/08/12 23:59:47*

以下のリポジトリについて、Shields.ioで情報をなるべくいっぱい追加したいのだけれどもどうすればいいのか教えて欲しい

https://github.com/Viagate/emomil-app-ios のページです。

# emomil-app-ios

エモミルの iOS アプリのリポジトリです。

## 運用

- [iOSチーム 運用ルール](https://www.notion.so/viagate/iOS-dbc7686e505e470bbd25daa0ee8f03fd)

## 環境構築

- [環境構築](./Docs/setup.md)
- [SwiftFormatの設定](./Docs/swiftformat.md)

## 資料

- [アーキテクチャ図](./Docs/architecture.md)

---

## 🤖 アシスタント
*2023/08/13 00:00:46*

[Shields.io](https://shields.io/) を使用してリポジトリにバッジを追加することで、一目でリポジトリの状態や情報を確認することができます。以下は、GitHubのリポジトリに追加できる一般的なバッジと、それを追加するための方法です。

1. **リポジトリのステータスバッジ**:
   - `last commit`、`commit activity`、`issues`、`pull requests` など、リポジトリのアクティビティに関する情報を表示します。
   - 例:
     ```
     ![GitHub last commit](https://img.shields.io/github/last-commit/Viagate/emomil-app-ios)
     ```

2. **ライセンスバッジ**:
   - もしリポジトリに `LICENSE` ファイルがあれば、ライセンスの種類をバッジで表示することができます。
   - 例:
     ```
     ![GitHub](https://img.shields.io/github/license/Viagate/emomil-app-ios)
     ```

3. **スター数、フォーク数バッジ**:
   - これらのバッジは、リポジトリの人気や活発さを示すものです。
   - 例:
     ```
     ![GitHub stars](https://img.shields.io/github/stars/Viagate/emomil-app-ios)
     ![GitHub forks](https://img.shields.io/github/forks/Viagate/emomil-app-ios)
     ```

4. **使用言語のバッジ**:
   - リポジトリの主要なプログラミング言語を示すバッジ。
   - 例:
     ```
     ![GitHub top language](https://img.shields.io/github/languages/top/Viagate/emomil-app-ios)
     ```

5. **コードサイズ、リポジトリサイズ**:
   - これらのバッジは、コードの規模やリポジトリの大きさを示します。
   - 例:
     ```
     ![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/Viagate/emomil-app-ios)
     ![GitHub repo size](https://img.shields.io/github/repo-size/Viagate/emomil-app-ios)
     ```

これらのバッジを追加するためには、README.md ファイルを編集して、上記の Markdown コードを貼り付けます。その後、コミットしてプッシュすれば、GitHubのREADMEにバッジが表示されます。

追加したいバッジが特定のサービスやツールに関連している場合（例: Travis CI、Codecov など）、Shields.io の公式サイトを参照して、該当するバッジの生成方法を探してください。

---

## 👤 ユーザー
*2023/08/13 00:01:26*

Swift package manager で Shields.io を生成するようなライブラリはないか？

---

## 🤖 アシスタント
*2023/08/13 00:01:58*

Swiftのエコシステム内でShields.ioのバッジを自動的に生成する専用のライブラリが存在するかは、私の最後のトレーニングデータ（2021年9月のカットオフ）までの情報では明確ではありません。

しかし、バッジを生成するためのライブラリがなかったとしても、Shields.ioのAPIを利用することで、自分自身で簡単にSwiftのツールやスクリプトを作成してバッジを生成することは可能です。

Swiftでの簡単な例を以下に示します：

```swift
import Foundation

struct BadgeGenerator {
    let repoOwner: String
    let repoName: String
    
    func generateLastCommitBadge() -> String {
        return "![GitHub last commit](https://img.shields.io/github/last-commit/\(repoOwner)/\(repoName))"
    }
    
    // 他のバッジも同様に追加できます
}

let generator = BadgeGenerator(repoOwner: "Viagate", repoName: "emomil-app-ios")
print(generator.generateLastCommitBadge())
```

このスクリプトはShields.ioのURLスキームを利用してバッジのMarkdownコードを生成します。必要に応じて、他のバッジの生成メソッドを追加することができます。

もちろん、これは基本的な例です。実際には、CLIツールやGUIアプリケーションを作成して、さらに多くのオプションやカスタマイズを提供することも可能です。

もし具体的な機能や要件があれば、もう少し詳しくお知らせください。そして、Swift Package Managerで利用可能な新しいライブラリがあるかどうかは、[Swift Package Index](https://swiftpackageindex.com/) などのサイトで検索してみると良いでしょう。

---
