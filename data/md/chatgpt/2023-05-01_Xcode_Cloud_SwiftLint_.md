# Xcode Cloud SwiftLint.

日付: 2023-05-01

---

## 👤 ユーザー
*2023/5/1 12:13:20*

Xcode Cloud で "SwiftLintPlugin" is disabled というエラーが出たので対応したい

---

## 🤖 アシスタント
*2023/5/1 12:14:39*

"SwiftLintPlugin"が無効になっているエラーは、Xcode CloudでSwiftLintプラグインが有効になっていないことを示しています。SwiftLintはSwiftコードの品質を向上させるためのリンターで、Xcode Cloudではデフォルトで有効になっていません。このエラーを解決するには、SwiftLintプラグインを有効にして、プロジェクトに適用する必要があります。

以下の手順で対応してください。

1. SwiftLintをプロジェクトに追加する
まず、SwiftLintをプロジェクトに追加する必要があります。プロジェクトのルートディレクトリに`.swiftlint.yml`という名前の設定ファイルを作成し、適切な設定を追加してください。例えば、以下のような内容を含めることができます。

```yaml
included:
  - Source
excluded:
  - Carthage
  - Pods
  - Source/ExcludedFolder
  - Source/ExcludedFile.swift
opt_in_rules:
  - empty_count
  - missing_docs
  - private_outlet
  - sorted_imports
  - trailing_closure
```

2. Xcode Cloudのビルド設定を更新する
次に、Xcode Cloudのビルド設定でSwiftLintプラグインを有効にする必要があります。これは、Xcode Cloudで実行されるビルドスクリプトをカスタマイズすることで実現できます。

Xcode Cloudのプロジェクトページにアクセスし、左側のメニューから「Builds」を選択してください。ビルド設定ページで、「Environment」タブを開き、「Custom build script」を有効にします。そして、以下のようなビルドスクリプトを追加してください。

```bash
# SwiftLintをインストールする
if which swiftlint >/dev/null; then
  echo "SwiftLint already installed"
else
  echo "Installing SwiftLint"
  brew install swiftlint
fi

# SwiftLintを実行する
swiftlint
```

このスクリプトは、SwiftLintがインストールされていない場合にインストールし、プロジェクトに対して実行します。

3. ビルドを実行する
以上の手順で、Xcode CloudでSwiftLintが有効になりました。新しいビルドを実行して、エラーや警告が表示されることを確認してください。もし問題が解決されない場合は、SwiftLintの設定やビルドスクリプトを見直してください。

---
