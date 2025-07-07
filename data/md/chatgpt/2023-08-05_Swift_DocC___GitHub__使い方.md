# Swift-DocC & GitHub: 使い方

日付: 2023-08-05

---

## 👤 ユーザー
*2023/8/5 20:10:00*

SwiftでiOSのアプリを開発している

Swift-DocC plugin for SwiftPM をつかってみたいので、使い方をおしえてほしい。
また、生成したドキュメントをprivateなgithub上で公開したい

---

## 🤖 アシスタント
*2023/8/5 20:11:58*

もちろん、Swift-DocCとSwiftPMの使い方をご説明します。以下は、Swift-DocCプラグインを使用してドキュメントを生成し、プライベートなGitHubリポジトリで公開する手順です。

### 1. Swift-DocCのインストール

Swift-DocCはSwift 5.5以降で利用可能です。プロジェクトで適切なバージョンを使用していることを確認してください。

### 2. ドキュメントの生成

#### Package.swiftの設定

プロジェクトの`Package.swift`ファイルを開いて、ドキュメント生成を設定する必要があります。例えば:

```swift
let package = Package(
    name: "YourPackage",
    products: [...],
    dependencies: [...],
    targets: [...],
    swiftLanguageVersions: [.v5_5],
    // 以下の行を追加
    doccDocumentation: [
        "YourPackageDocumentation", // ここにドキュメントのターゲット名を記述
    ]
)
```

#### ドキュメントのターゲットを作成

次に、`Package.swift`ファイルに記述したターゲットを作成する必要があります。以下のように設定できます:

```swift
.target(
    name: "YourPackageDocumentation",
    dependencies: [],
    path: "Documentation",
    exclude: ["README.md"]
)
```

この設定では、`Documentation`フォルダ内のファイルがドキュメント生成の対象となります。

#### ドキュメントの生成

コマンドラインから以下のコマンドを実行して、ドキュメントを生成します:

```bash
swift docc YourPackageDocumentation
```

### 3. GitHubでの公開

#### リポジトリの作成

プライベートリポジトリを作成し、ドキュメントを公開する準備をします。

#### ドキュメントの追加とコミット

生成したドキュメントファイルをリポジトリに追加し、コミットしてプッシュします:

```bash
git add path/to/your/generated/documentation
git commit -m "Add generated documentation"
git push origin main
```

#### GitHub Pagesの設定

プライベートリポジトリでGitHub Pagesを使用する場合、リポジトリの設定ページで「GitHub Pages」セクションを見つけ、適切なブランチとフォルダを指定してください。

これで、プライベートなGitHubリポジトリでSwiftプロジェクトのドキュメントが公開されるようになります。

以上がSwift-DocCとSwiftPMを使用したドキュメントの生成とプライベートなGitHub上での公開方法です。何か不明点があればお知らせください。

---
