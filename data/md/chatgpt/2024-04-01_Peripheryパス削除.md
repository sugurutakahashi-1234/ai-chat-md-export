# Peripheryパス削除

日付: 2024-04-01

---

## 👤 ユーザー
*2024/4/1 13:13:29*

以下のスクリプトについて。xcodebuild -scheme する前にperiphery\_pathを削除してほしい。

#!/bin/bash

if \[ "$#" -ne 1 \]; then
    echo "Usage: $0 &lt;Root Path&gt;"
    exit 1
fi

di\_scheme="DependencyInjectionLayer"
root\_path=$1
periphery\_path="$root\_path/periphery"
periphery\_build\_path="$periphery\_path/build"
output\_file="$periphery\_path/result.txt"
index\_store\_path="$periphery\_build\_path/Index.noindex/DataStore/"
mint\_package\_path="$root\_path/DISampleAppPackage"

# periphery を実行すると MacOS でビルドを行うが、アプリ内部で UIKit など、iOS 依存なコードがあるとビルドできないため、一旦 xcodebuild コマンドでプラットフォームを指定して、ビルドする必要がある
# 失敗する場合は periphery/build ディレクトリを削除してから、また、make コマンドを実行してください
xcodebuild -scheme $di\_scheme -destination 'platform=iOS Simulator,OS=17.4,name=iPhone 15 Pro' -derivedDataPath $periphery\_build\_path clean build

# periphery の仕様なのか、ディレクトリを移動しないと SwiftPM マルチモジュール かつ Workspace で構成されるプロジェクト対応できない
cd "${mint\_package\_path}"

# Swift パッケージを指定したパスで実行し、periphery を使用してプロジェクトをスキャン
# --skip-build: ビルドプロセスをスキップ
# --index-store-path: ビルドプロセスをスキップしたので、xcodebuild でビルドしたindex-store-pathの指定
# --retain-swift-ui-previews: SwiftUI のプレビューはそのままにしておく
# --retain-public: 不要な Public 宣言はそのままにしておく
swift run --package-path $mint\_package\_path mint run periphery scan \\
    --skip-build --index-store-path $index\_store\_path \\
    --retain-swift-ui-previews \\
    --retain-public \\
    --targets "DomainLayer" "PresentationLayer" "DependencyInjectionLayer" "DeviceFramework" "FirebaseFramework" "LicenseFramework" \\
    &gt; $output\_file

# 出力に環境依存な root\_path が付与されるため、それを削除する
sed "s|${root\_path}/||g" $output\_file &gt; temp\_file && mv temp\_file $output\_file

echo "Periphery Scan Completed!!!!"

---

## 🤖 アシスタント
*2024/4/1 13:14:20*

スクリプトに `periphery_path` を `xcodebuild` を実行する前に削除するコードを追加したいとのことですね。`rm -rf` コマンドを使用して、`periphery_path` が存在する場合にそれを削除することができます。このコマンドは指定したディレクトリとその中身を再帰的に強制的に削除します。これを `xcodebuild` の実行前に追加することで、目的を達成できます。

以下のスクリプトは、あなたの要求に基づいて修正されたものです。`xcodebuild` を実行する直前に `periphery_path` を削除する行を追加しました。

```bash
#!/bin/bash

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <Root Path>"
    exit 1
fi

di_scheme="DependencyInjectionLayer"
root_path=$1
periphery_path="$root_path/periphery"
periphery_build_path="$periphery_path/build"
output_file="$periphery_path/result.txt"
index_store_path="$periphery_build_path/Index.noindex/DataStore/"
mint_package_path="$root_path/DISampleAppPackage"

# periphery_path が存在する場合、削除する
rm -rf "$periphery_path"

# periphery を実行すると MacOS でビルドを行うが、アプリ内部で UIKit など、iOS 依存なコードがあるとビルドできないため、一旦 xcodebuild コマンドでプラットフォームを指定して、ビルドする必要がある
# 失敗する場合は periphery/build ディレクトリを削除してから、また、make コマンドを実行してください
xcodebuild -scheme $di_scheme -destination 'platform=iOS Simulator,OS=17.4,name=iPhone 15 Pro' -derivedDataPath $periphery_build_path clean build

# periphery の仕様なのか、ディレクトリを移動しないと SwiftPM マルチモジュール かつ Workspace で構成されるプロジェクト対応できない
cd "${mint_package_path}"

# Swift パッケージを指定したパスで実行し、periphery を使用してプロジェクトをスキャン
# --skip-build: ビルドプロセスをスキップ
# --index-store-path: ビルドプロセスをスキップしたので、xcodebuild でビルドしたindex-store-pathの指定
# --retain-swift-ui-previews: SwiftUI のプレビューはそのままにしておく
# --retain-public: 不要な Public 宣言はそのままにしておく
swift run --package-path $mint_package_path mint run periphery scan \
    --skip-build --index-store-path $index_store_path \
    --retain-swift-ui-previews \
    --retain-public \
    --targets "DomainLayer" "PresentationLayer" "DependencyInjectionLayer" "DeviceFramework" "FirebaseFramework" "LicenseFramework" \
    > $output_file

# 出力に環境依存な root_path が付与されるため、それを削除する
sed "s|${root_path}/||g" $output_file > temp_file && mv temp_file $output_file

echo "Periphery Scan Completed!!!!"
```

この修正により、`xcodebuild` コマンドの実行前に `periphery_path` ディレクトリが存在する場合、それを削除してからビルドが開始されます。これにより、前回のビルド結果などが影響することなく、クリーンな状態でビルドおよびスキャンを行うことが可能になります。

---
