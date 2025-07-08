# Swift Package Scan Script

日付: 2024-06-04

---

## 👤 ユーザー
*2024/6/4 11:47:13*

以下を変数宣言したい
"DomainLayer" "PresentationLayer" "DependencyInjectionLayer" "DeviceFramework" "FirebaseFramework" "LicenseFramework"

#!/bin/bash

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 &lt;Root Path&gt;"
    exit 1
fi

mint_package_name="MintCLIPackage"
di_scheme="SmallTalkPackage"

root_path=$1
mint_package_path="$root_path/$mint_package_name"
periphery_path="$root_path/periphery"
periphery_build_path="$root_path/build_for_periphery" # periphery/ 配下に build_path を設定 かつ Xcode で参照フォルダにするとなぜかビルドに失敗するので、ルート直下に配置している
output_file="$periphery_path/result.txt"
index_store_path="$periphery_build_path/Index.noindex/DataStore/"

# periphery_build_path が存在する場合、削除する（速度的には遅くなるがschemeを増やしたときに periphery が失敗して、原因究明に時間がかかるので毎回削除するようにしている）
rm -rf "$periphery_build_path"

# periphery を実行すると MacOS でビルドを行うが、アプリ内部で UIKit など、iOS 依存なコードがあるとビルドできないため、一旦 xcodebuild コマンドでプラットフォームを指定して、ビルドする必要がある
# 失敗する場合は periphery/build ディレクトリを削除してから、また、make コマンドを実行してください
xcodebuild -scheme $di_scheme -destination 'platform=iOS Simulator,name=iPhone 15 Pro' -derivedDataPath $periphery_build_path clean build

# periphery の仕様なのか、Package.swift が存在するディレクトリを移動しないと SwiftPM マルチモジュール かつ Workspace で構成されるプロジェクトで periphery scan がうまく動いてくれない
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
    | tee $output_file

# 出力に環境依存な root_path がoutputファイルに付与されるため、それを削除する
sed -i '' "s|${root_path}/||g" $output_file

# 毎回完全にclean buildしたいため、削除する、また削除しないと Xcode で検索かけたときに一致する対象が増えてしまうため
rm -rf "$periphery_build_path"

echo "Periphery Scan Completed!!!!"

---

## 🤖 アシスタント
*2024/6/4 11:47:36*

以下のスクリプトは、変数宣言を追加し、指定されたターゲットのビルドとスキャンを行うスクリプトです。

```bash
#!/bin/bash

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <Root Path>"
    exit 1
fi

mint_package_name="MintCLIPackage"
di_scheme="SmallTalkPackage"

root_path=$1
mint_package_path="$root_path/$mint_package_name"
periphery_path="$root_path/periphery"
periphery_build_path="$root_path/build_for_periphery" # periphery/ 配下に build_path を設定 かつ Xcode で参照フォルダにするとなぜかビルドに失敗するので、ルート直下に配置している
output_file="$periphery_path/result.txt"
index_store_path="$periphery_build_path/Index.noindex/DataStore/"

# ターゲットの変数宣言
domain_layer="DomainLayer"
presentation_layer="PresentationLayer"
dependency_injection_layer="DependencyInjectionLayer"
device_framework="DeviceFramework"
firebase_framework="FirebaseFramework"
license_framework="LicenseFramework"

# periphery_build_path が存在する場合、削除する（速度的には遅くなるがschemeを増やしたときに periphery が失敗して、原因究明に時間がかかるので毎回削除するようにしている）
rm -rf "$periphery_build_path"

# periphery を実行すると MacOS でビルドを行うが、アプリ内部で UIKit など、iOS 依存なコードがあるとビルドできないため、一旦 xcodebuild コマンドでプラットフォームを指定して、ビルドする必要がある
# 失敗する場合は periphery/build ディレクトリを削除してから、また、make コマンドを実行してください
xcodebuild -scheme $di_scheme -destination 'platform=iOS Simulator,name=iPhone 15 Pro' -derivedDataPath $periphery_build_path clean build

# periphery の仕様なのか、Package.swift が存在するディレクトリを移動しないと SwiftPM マルチモジュール かつ Workspace で構成されるプロジェクトで periphery scan がうまく動いてくれない
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
    --targets "$domain_layer" "$presentation_layer" "$dependency_injection_layer" "$device_framework" "$firebase_framework" "$license_framework" \
    | tee $output_file

# 出力に環境依存な root_path がoutputファイルに付与されるため、それを削除する
sed -i '' "s|${root_path}/||g" $output_file

# 毎回完全にclean buildしたいため、削除する、また削除しないと Xcode で検索かけたときに一致する対象が増えてしまうため
rm -rf "$periphery_build_path"

echo "Periphery Scan Completed!!!!"
```

これにより、ターゲットの名前が変数として宣言され、スクリプトの他の部分でこれらの変数を使用するようになりました。

---

## 👤 ユーザー
*2024/6/4 11:47:48*

そうではなくて、一つの変数としたいんだ

---

## 🤖 アシスタント
*2024/6/4 11:48:11*

了解しました。一つの変数にターゲットをまとめて宣言します。

```bash
#!/bin/bash

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <Root Path>"
    exit 1
fi

mint_package_name="MintCLIPackage"
di_scheme="SmallTalkPackage"

root_path=$1
mint_package_path="$root_path/$mint_package_name"
periphery_path="$root_path/periphery"
periphery_build_path="$root_path/build_for_periphery" # periphery/ 配下に build_path を設定 かつ Xcode で参照フォルダにするとなぜかビルドに失敗するので、ルート直下に配置している
output_file="$periphery_path/result.txt"
index_store_path="$periphery_build_path/Index.noindex/DataStore/"

# ターゲットの変数宣言
targets="DomainLayer PresentationLayer DependencyInjectionLayer DeviceFramework FirebaseFramework LicenseFramework"

# periphery_build_path が存在する場合、削除する（速度的には遅くなるがschemeを増やしたときに periphery が失敗して、原因究明に時間がかかるので毎回削除するようにしている）
rm -rf "$periphery_build_path"

# periphery を実行すると MacOS でビルドを行うが、アプリ内部で UIKit など、iOS 依存なコードがあるとビルドできないため、一旦 xcodebuild コマンドでプラットフォームを指定して、ビルドする必要がある
# 失敗する場合は periphery/build ディレクトリを削除してから、また、make コマンドを実行してください
xcodebuild -scheme $di_scheme -destination 'platform=iOS Simulator,name=iPhone 15 Pro' -derivedDataPath $periphery_build_path clean build

# periphery の仕様なのか、Package.swift が存在するディレクトリを移動しないと SwiftPM マルチモジュール かつ Workspace で構成されるプロジェクトで periphery scan がうまく動いてくれない
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
    --targets $targets \
    | tee $output_file

# 出力に環境依存な root_path がoutputファイルに付与されるため、それを削除する
sed -i '' "s|${root_path}/||g" $output_file

# 毎回完全にclean buildしたいため、削除する、また削除しないと Xcode で検索かけたときに一致する対象が増えてしまうため
rm -rf "$periphery_build_path"

echo "Periphery Scan Completed!!!!"
```

これにより、ターゲットは一つの変数 `targets` にまとめて宣言され、スクリプト内で使用されるようになりました。

---
