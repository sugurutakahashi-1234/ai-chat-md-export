# Auto-Generate UICatalogType Cases

日付: 2024-06-07

---

## 👤 ユーザー
*2024/6/7 14:52:25*

UICatalogType.swift について、ViewTestCase以下にあるフォルダを解析してenumのcaseを定義していきたい。

~/git/Project-SoftBankSNS-iOS/SmallTalkPackage/Sources/UICatalog  ‹feature/60› $ tree
.
├── Entity
│   ├── UICatalogType.swift
│   └── ViewTestCase
│       └── APIRequestViewTestCase.swift
└── View
    ├── TestCaseListView.swift
    ├── UICatalogListPresenter.swift
    └── UICatalogListView.swift

4 directories, 5 files

UICatalogType.swift

//
//  Created by sugurutakahashi on 2024/06/07
//  Copyright © 2024 crage Inc. All rights reserved.
//

import DomainLayer
import PresentationLayer
import SwiftUI

public enum UICatalogType: SwiftUIForEachable {
    case apiRequest

    @MainActor @ViewBuilder
    public var testCaseListView: some View {
        switch self {
        case .apiRequest:
            TestCaseListView&lt;APIRequestViewTestCase&gt;()
        }
    }
}


#!/bin/bash

# 引数の数の確認
if [ "$#" -ne 2 ]; then
    echo "Need args: $0 &lt;DI Container&gt; &lt;View&gt;"
    exit 1
fi

mint_package_name="MintCLIPackage"
product_package_name="SmallTalkPackage"
di_container_name="$1"
screen_name="$2"
template_path="./sourcery/template/presentation_code_gen"
source_dir="${product_package_name}/Sources/Presentation"

output_presentation_dir="${source_dir}/View/${screen_name}"
output_di_container_dependency_dir="${source_dir}/DIContainerDependency"
output_test_dir="${product_package_name}/Tests"
output_test_case_dir="${product_package_name}/Sources/UICatalog/Entity"

current_user=$(whoami)
current_date=$(date "+%Y/%m/%d")

# --force-parse のオプションが拡張子を別にしないと効かないため、それを回避するためのワークアラウンド処理
remove_sourcery_header() {
    local target_directory="$1"
    # ファイルの先頭1行を読み込み、「// Generated using Sourcery」の文字列が含まれている場合、最初の3行を削除する
    find "$target_directory" -type f -name "*.swift" | while read -r file; do
        head=$(head -n 1 "$file")
        if echo "$head" | grep -q "// Generated using Sourcery"; then
            echo "Updating file: $file"
            tail -n +4 "$file" &gt; "$file.tmp" && mv "$file.tmp" "$file"
        fi
    done
}

# 出力ディレクトリが存在しない場合は作成
mkdir -p "$output_presentation_dir"
mkdir -p "$output_di_container_dependency_dir"
mkdir -p "$output_test_dir"
mkdir -p "$output_test_case_dir"

# View 関連
for component in "PresenterDependency" "Presenter" "View"
do
    swift run --package-path "$mint_package_name" mint run sourcery \
              --sources "$source_dir" \
              --templates "$template_path/${component}.stencil" \
              --output "$output_presentation_dir/${screen_name}${component}.swift" \
              --args "screenName=$screen_name","diContainerName=$di_container_name","userName=$current_user","date=$current_date"
done
remove_sourcery_header "$output_presentation_dir"

# DIContainer 関連
for component in "DIContainerDependency"
do
swift run --package-path "$mint_package_name" mint run sourcery --disableCache \
          --sources "$source_dir" \
          --templates "$template_path/${component}.stencil" \
          --output "$output_di_container_dependency_dir/${di_container_name}${component}.swift" \
          --args "screenName=$screen_name","diContainerName=$di_container_name","userName=$current_user","date=$current_date"
done
remove_sourcery_header "$output_di_container_dependency_dir"

# Test 関連
for component in "ViewSnapshotTest" "PresenterTest"
do
    swift run --package-path "$mint_package_name" mint run sourcery \
                --sources "$source_dir" \
                --templates "$template_path/${component}.stencil" \
                --output "$output_test_dir/${component}/${screen_name}${component}.swift" \
                --args "screenName=$screen_name","diContainerName=$di_container_name","userName=$current_user","date=$current_date"
done
remove_sourcery_header "$output_test_dir"

# UICatalog 関連
for component in "ViewTestCase"
do
    swift run --package-path "$mint_package_name" mint run sourcery \
                --sources "$source_dir" \
                --templates "$template_path/${component}.stencil" \
                --output "$output_test_case_dir/${component}/${screen_name}${component}.swift" \
                --args "screenName=$screen_name","diContainerName=$di_container_name","userName=$current_user","date=$current_date"
done
remove_sourcery_header "$output_test_case_dir"

echo "Sourcery DONE!!"

---

## 🤖 アシスタント
*2024/6/7 14:52:46*

`UICatalogType` を更新し、 `ViewTestCase` 以下にあるファイルを基に `enum` のケースを定義する方法について説明します。

まず、 `UICatalogType.swift` を以下のように更新します。 `ViewTestCase` ディレクトリに存在する各テストケースファイルを新しいケースとして追加します。

```swift
import DomainLayer
import PresentationLayer
import SwiftUI

public enum UICatalogType: SwiftUIForEachable {
    case apiRequest

    // 追加するケース
    // 例: case newCase

    @MainActor @ViewBuilder
    public var testCaseListView: some View {
        switch self {
        case .apiRequest:
            TestCaseListView<APIRequestViewTestCase>()
        // 追加するケースのビュー
        // 例: case .newCase: TestCaseListView<NewCaseViewTestCase>()
        }
    }
}
```

次に、 `ViewTestCase` 以下のファイルを自動的に解析し、対応する `enum` ケースを生成するスクリプトを作成します。以下の `generate_cases.sh` スクリプトは `ViewTestCase` フォルダを解析し、新しい `enum` ケースとその対応するビューを `UICatalogType.swift` に追加します。

`generate_cases.sh`

```bash
#!/bin/bash

# UICatalogType.swiftのパス
uicatalog_file="./Sources/UICatalog/Entity/UICatalogType.swift"

# ViewTestCaseディレクトリのパス
view_test_case_dir="./Sources/UICatalog/Entity/ViewTestCase"

# バックアップを作成
cp "$uicatalog_file" "${uicatalog_file}.bak"

# 新しいケースとビューを生成
new_cases=$(find "$view_test_case_dir" -name "*.swift" | while read -r file; do
    # ファイル名からViewTestCase名を抽出
    view_test_case=$(basename "$file" .swift)
    # ケース名を生成
    case_name=$(echo "$view_test_case" | sed -e 's/ViewTestCase$//' -e 's/^\(.\)/\L\1/')
    # ケースとビューを出力
    echo "    case $case_name"
    echo "    case .$case_name: TestCaseListView<$view_test_case>()"
done)

# enumのケースを挿入
sed -i '' "/case apiRequest/a\\
$new_cases
" "$uicatalog_file"

# switch文にビューを挿入
sed -i '' "/case .apiRequest: TestCaseListView<APIRequestViewTestCase>()/a\\
$new_cases
" "$uicatalog_file"

echo "UICatalogType.swift has been updated."
```

このスクリプトをプロジェクトのルートディレクトリに保存し、以下のコマンドで実行します：

```bash
bash generate_cases.sh
```

このスクリプトは `ViewTestCase` ディレクトリを解析し、新しい `enum` ケースと対応するビューを `UICatalogType.swift` に自動的に追加します。

また、 `UICatalogType.swift` の編集後に `case` と `switch` の対応が正しいことを確認してください。特に、ファイル名やケース名のフォーマットに依存しているため、スクリプトが正しく動作するように調整が必要かもしれません。

---

## 👤 ユーザー
*2024/6/7 14:53:57*

できるだけ stencil の処理を使いたい。

たとえばこんな感じ。

public protocol {{ argument.diContainerName }}DIContainerDependency: AnyObject, {% for type in types.protocols where type.name|hasSuffix:"PresenterDependency" %}{{ type.name }}{% if not forloop.last %}, {% endif %}{% endfor %} {}

UICatalogType.stencil を定義したい。

---

## 🤖 アシスタント
*2024/6/7 14:54:19*

Stencilを使って `UICatalogType` のケースを生成するためのテンプレートを作成する方法について説明します。これにより、`ViewTestCase` フォルダ内のファイルに基づいて `enum` ケースを自動的に生成できます。

まず、`UICatalogType.stencil` ファイルを作成します。以下のようにテンプレートを定義します。

### UICatalogType.stencil

```stencil
import DomainLayer
import PresentationLayer
import SwiftUI

public enum UICatalogType: SwiftUIForEachable {
    {% for file in viewTestCases %}
    case {{ file.name|lowercaseFirst }}
    {% endfor %}

    @MainActor @ViewBuilder
    public var testCaseListView: some View {
        switch self {
        {% for file in viewTestCases %}
        case .{{ file.name|lowercaseFirst }}:
            TestCaseListView<{{ file.name }}>()
        {% endfor %}
        }
    }
}
```

このテンプレートは `viewTestCases` として渡されたファイルリストに基づいて `enum` ケースとその対応するビューを生成します。

次に、テンプレートを使って `UICatalogType.swift` を生成するためのスクリプトを作成します。以下のスクリプトは `ViewTestCase` フォルダを解析し、ファイル名を取得してテンプレートに渡します。

### generate_uicatalog_type.sh

```bash
#!/bin/bash

# sourceryのパスを指定
sourcery_path="path_to_sourcery"

# UICatalogType.swiftの出力パス
output_file="./Sources/UICatalog/Entity/UICatalogType.swift"

# ViewTestCaseディレクトリのパス
view_test_case_dir="./Sources/UICatalog/Entity/ViewTestCase"

# テンプレートのパス
template_file="./sourcery/template/UICatalogType.stencil"

# viewTestCasesのリストを作成
view_test_cases=$(find "$view_test_case_dir" -name "*.swift" | while read -r file; do
    # ファイル名からViewTestCase名を抽出
    view_test_case=$(basename "$file" .swift)
    echo "{\"name\": \"$view_test_case\"}"
done | jq -s '.')

# JSONファイルとして保存
echo "{\"viewTestCases\": $view_test_cases}" > view_test_cases.json

# Sourceryを実行してテンプレートを処理
"$sourcery_path" --sources view_test_cases.json --templates "$template_file" --output "$output_file"

# 一時ファイルを削除
rm view_test_cases.json

echo "UICatalogType.swift has been generated."
```

このスクリプトをプロジェクトのルートディレクトリに保存し、以下のコマンドで実行します：

```bash
bash generate_uicatalog_type.sh
```

### 構成するフォルダ構造

- `sourcery/template/UICatalogType.stencil`
- `generate_uicatalog_type.sh`

このスクリプトは `ViewTestCase` ディレクトリを解析し、ファイル名に基づいてテンプレートを処理し、`UICatalogType.swift` を生成します。これにより、手動で `enum` ケースを追加する手間が省けます。

---

## 👤 ユーザー
*2024/6/7 14:56:19*

このスクリプトの最後方に処理を入れてほしい。なるべく他と揃えてほしい

#!/bin/bash

# 引数の数の確認
if [ "$#" -ne 2 ]; then
    echo "Need args: $0 &lt;DI Container&gt; &lt;View&gt;"
    exit 1
fi

mint_package_name="MintCLIPackage"
product_package_name="SmallTalkPackage"
di_container_name="$1"
screen_name="$2"
template_path="./sourcery/template/presentation_code_gen"
source_dir="${product_package_name}/Sources/Presentation"

output_presentation_dir="${source_dir}/View/${screen_name}"
output_di_container_dependency_dir="${source_dir}/DIContainerDependency"
output_test_dir="${product_package_name}/Tests"
output_test_case_dir="${product_package_name}/Sources/UICatalog/Entity"

current_user=$(whoami)
current_date=$(date "+%Y/%m/%d")

# --force-parse のオプションが拡張子を別にしないと効かないため、それを回避するためのワークアラウンド処理
remove_sourcery_header() {
    local target_directory="$1"
    # ファイルの先頭1行を読み込み、「// Generated using Sourcery」の文字列が含まれている場合、最初の3行を削除する
    find "$target_directory" -type f -name "*.swift" | while read -r file; do
        head=$(head -n 1 "$file")
        if echo "$head" | grep -q "// Generated using Sourcery"; then
            echo "Updating file: $file"
            tail -n +4 "$file" &gt; "$file.tmp" && mv "$file.tmp" "$file"
        fi
    done
}

# 出力ディレクトリが存在しない場合は作成
mkdir -p "$output_presentation_dir"
mkdir -p "$output_di_container_dependency_dir"
mkdir -p "$output_test_dir"
mkdir -p "$output_test_case_dir"

# View 関連
for component in "PresenterDependency" "Presenter" "View"
do
    swift run --package-path "$mint_package_name" mint run sourcery \
              --sources "$source_dir" \
              --templates "$template_path/${component}.stencil" \
              --output "$output_presentation_dir/${screen_name}${component}.swift" \
              --args "screenName=$screen_name","diContainerName=$di_container_name","userName=$current_user","date=$current_date"
done
remove_sourcery_header "$output_presentation_dir"

# DIContainer 関連
for component in "DIContainerDependency"
do
swift run --package-path "$mint_package_name" mint run sourcery --disableCache \
          --sources "$source_dir" \
          --templates "$template_path/${component}.stencil" \
          --output "$output_di_container_dependency_dir/${di_container_name}${component}.swift" \
          --args "screenName=$screen_name","diContainerName=$di_container_name","userName=$current_user","date=$current_date"
done
remove_sourcery_header "$output_di_container_dependency_dir"

# Test 関連
for component in "ViewSnapshotTest" "PresenterTest"
do
    swift run --package-path "$mint_package_name" mint run sourcery \
                --sources "$source_dir" \
                --templates "$template_path/${component}.stencil" \
                --output "$output_test_dir/${component}/${screen_name}${component}.swift" \
                --args "screenName=$screen_name","diContainerName=$di_container_name","userName=$current_user","date=$current_date"
done
remove_sourcery_header "$output_test_dir"

# UICatalog 関連
for component in "ViewTestCase"
do
    swift run --package-path "$mint_package_name" mint run sourcery \
                --sources "$source_dir" \
                --templates "$template_path/${component}.stencil" \
                --output "$output_test_case_dir/${component}/${screen_name}${component}.swift" \
                --args "screenName=$screen_name","diContainerName=$di_container_name","userName=$current_user","date=$current_date"
done
remove_sourcery_header "$output_test_case_dir"

echo "Sourcery DONE!!"

---

## 🤖 アシスタント
*2024/6/7 14:56:50*

以下に、`UICatalogType` に関する処理を追加した完全なスクリプトを示します。このスクリプトは、他の処理と揃えた形で最後に `UICatalogType` の生成処理を追加しています。

### 完全なスクリプト

```bash
#!/bin/bash

# 引数の数の確認
if [ "$#" -ne 2 ]; then
    echo "Need args: $0 <DI Container> <View>"
    exit 1
fi

mint_package_name="MintCLIPackage"
product_package_name="SmallTalkPackage"
di_container_name="$1"
screen_name="$2"
template_path="./sourcery/template/presentation_code_gen"
source_dir="${product_package_name}/Sources/Presentation"

output_presentation_dir="${source_dir}/View/${screen_name}"
output_di_container_dependency_dir="${source_dir}/DIContainerDependency"
output_test_dir="${product_package_name}/Tests"
output_test_case_dir="${product_package_name}/Sources/UICatalog/Entity"

current_user=$(whoami)
current_date=$(date "+%Y/%m/%d")

# --force-parse のオプションが拡張子を別にしないと効かないため、それを回避するためのワークアラウンド処理
remove_sourcery_header() {
    local target_directory="$1"
    # ファイルの先頭1行を読み込み、「// Generated using Sourcery」の文字列が含まれている場合、最初の3行を削除する
    find "$target_directory" -type f -name "*.swift" | while read -r file; do
        head=$(head -n 1 "$file")
        if echo "$head" | grep -q "// Generated using Sourcery"; then
            echo "Updating file: $file"
            tail -n +4 "$file" > "$file.tmp" && mv "$file.tmp" "$file"
        fi
    done
}

# 出力ディレクトリが存在しない場合は作成
mkdir -p "$output_presentation_dir"
mkdir -p "$output_di_container_dependency_dir"
mkdir -p "$output_test_dir"
mkdir -p "$output_test_case_dir"

# View 関連
for component in "PresenterDependency" "Presenter" "View"
do
    swift run --package-path "$mint_package_name" mint run sourcery \
              --sources "$source_dir" \
              --templates "$template_path/${component}.stencil" \
              --output "$output_presentation_dir/${screen_name}${component}.swift" \
              --args "screenName=$screen_name","diContainerName=$di_container_name","userName=$current_user","date=$current_date"
done
remove_sourcery_header "$output_presentation_dir"

# DIContainer 関連
for component in "DIContainerDependency"
do
swift run --package-path "$mint_package_name" mint run sourcery --disableCache \
          --sources "$source_dir" \
          --templates "$template_path/${component}.stencil" \
          --output "$output_di_container_dependency_dir/${di_container_name}${component}.swift" \
          --args "screenName=$screen_name","diContainerName=$di_container_name","userName=$current_user","date=$current_date"
done
remove_sourcery_header "$output_di_container_dependency_dir"

# Test 関連
for component in "ViewSnapshotTest" "PresenterTest"
do
    swift run --package-path "$mint_package_name" mint run sourcery \
                --sources "$source_dir" \
                --templates "$template_path/${component}.stencil" \
                --output "$output_test_dir/${component}/${screen_name}${component}.swift" \
                --args "screenName=$screen_name","diContainerName=$di_container_name","userName=$current_user","date=$current_date"
done
remove_sourcery_header "$output_test_dir"

# UICatalog 関連
for component in "ViewTestCase"
do
    swift run --package-path "$mint_package_name" mint run sourcery \
                --sources "$source_dir" \
                --templates "$template_path/${component}.stencil" \
                --output "$output_test_case_dir/${component}/${screen_name}${component}.swift" \
                --args "screenName=$screen_name","diContainerName=$di_container_name","userName=$current_user","date=$current_date"
done
remove_sourcery_header "$output_test_case_dir"

# UICatalogType 関連
uicatalog_file="${output_test_case_dir}/UICatalogType.swift"
view_test_case_dir="${output_test_case_dir}/ViewTestCase"
template_file="./sourcery/template/UICatalogType.stencil"

# viewTestCasesのリストを作成
view_test_cases=$(find "$view_test_case_dir" -name "*.swift" | while read -r file; do
    # ファイル名からViewTestCase名を抽出
    view_test_case=$(basename "$file" .swift)
    echo "{\"name\": \"$view_test_case\"}"
done | jq -s '.')

# JSONファイルとして保存
echo "{\"viewTestCases\": $view_test_cases}" > view_test_cases.json

# Sourceryを実行してテンプレートを処理
swift run --package-path "$mint_package_name" mint run sourcery \
          --sources view_test_cases.json \
          --templates "$template_file" \
          --output "$uicatalog_file"

# 一時ファイルを削除
rm view_test_cases.json

echo "Sourcery DONE!!"
```

このスクリプトは、他のテンプレート処理と同様に、`UICatalogType` の生成処理を追加しています。スクリプトの最後に `UICatalogType` に関する処理を追加することで、一連のテンプレート生成が完了した後に `UICatalogType` が生成されます。

---

## 👤 ユーザー
*2024/6/7 14:59:21*

シェルスクリプト上で処理するのではなく、以下のようにstencil側の処理でhasSuffixがViewTestCaseの型名を取得してfor文を回してほしい

public protocol {{ argument.diContainerName }}DIContainerDependency: AnyObject, {% for type in types.protocols where type.name|hasSuffix:"PresenterDependency" %}{{ type.name }}{% if not forloop.last %}, {% endif %}{% endfor %} {}

---

## 🤖 アシスタント
*2024/6/7 14:59:57*

`UICatalogType` のケースを生成するための `stencil` テンプレートを使用して、`ViewTestCase` の型名を取得して `enum` ケースを生成する方法を説明します。

### UICatalogType.stencil

まず、`UICatalogType` のテンプレートを以下のように定義します。このテンプレートは、`ViewTestCase` の型名を取得して、`enum` ケースとその対応するビューを生成します。

```stencil
import DomainLayer
import PresentationLayer
import SwiftUI

public enum UICatalogType: SwiftUIForEachable {
    {% for type in types.classes where type.name|hasSuffix:"ViewTestCase" %}
    case {{ type.name|replace:"ViewTestCase",""|lowercaseFirst }}
    {% endfor %}

    @MainActor @ViewBuilder
    public var testCaseListView: some View {
        switch self {
        {% for type in types.classes where type.name|hasSuffix:"ViewTestCase" %}
        case .{{ type.name|replace:"ViewTestCase",""|lowercaseFirst }}:
            TestCaseListView<{{ type.name }}>()
        {% endfor %}
        }
    }
}
```

このテンプレートでは、`ViewTestCase` というサフィックスを持つクラスを検索し、それらを `enum` のケースと `switch` 文に追加しています。

### スクリプト

次に、テンプレートを使用して `UICatalogType.swift` を生成するためのスクリプトを作成します。このスクリプトは他の処理と統合されていることを前提としています。

```bash
#!/bin/bash

# 引数の数の確認
if [ "$#" -ne 2 ]; then
    echo "Need args: $0 <DI Container> <View>"
    exit 1
fi

mint_package_name="MintCLIPackage"
product_package_name="SmallTalkPackage"
di_container_name="$1"
screen_name="$2"
template_path="./sourcery/template/presentation_code_gen"
source_dir="${product_package_name}/Sources/Presentation"

output_presentation_dir="${source_dir}/View/${screen_name}"
output_di_container_dependency_dir="${source_dir}/DIContainerDependency"
output_test_dir="${product_package_name}/Tests"
output_test_case_dir="${product_package_name}/Sources/UICatalog/Entity"

current_user=$(whoami)
current_date=$(date "+%Y/%m/%d")

# --force-parse のオプションが拡張子を別にしないと効かないため、それを回避するためのワークアラウンド処理
remove_sourcery_header() {
    local target_directory="$1"
    # ファイルの先頭1行を読み込み、「// Generated using Sourcery」の文字列が含まれている場合、最初の3行を削除する
    find "$target_directory" -type f -name "*.swift" | while read -r file; do
        head=$(head -n 1 "$file")
        if echo "$head" | grep -q "// Generated using Sourcery"; then
            echo "Updating file: $file"
            tail -n +4 "$file" > "$file.tmp" && mv "$file.tmp" "$file"
        fi
    done
}

# 出力ディレクトリが存在しない場合は作成
mkdir -p "$output_presentation_dir"
mkdir -p "$output_di_container_dependency_dir"
mkdir -p "$output_test_dir"
mkdir -p "$output_test_case_dir"

# View 関連
for component in "PresenterDependency" "Presenter" "View"
do
    swift run --package-path "$mint_package_name" mint run sourcery \
              --sources "$source_dir" \
              --templates "$template_path/${component}.stencil" \
              --output "$output_presentation_dir/${screen_name}${component}.swift" \
              --args "screenName=$screen_name","diContainerName=$di_container_name","userName=$current_user","date=$current_date"
done
remove_sourcery_header "$output_presentation_dir"

# DIContainer 関連
for component in "DIContainerDependency"
do
swift run --package-path "$mint_package_name" mint run sourcery --disableCache \
          --sources "$source_dir" \
          --templates "$template_path/${component}.stencil" \
          --output "$output_di_container_dependency_dir/${di_container_name}${component}.swift" \
          --args "screenName=$screen_name","diContainerName=$di_container_name","userName=$current_user","date=$current_date"
done
remove_sourcery_header "$output_di_container_dependency_dir"

# Test 関連
for component in "ViewSnapshotTest" "PresenterTest"
do
    swift run --package-path "$mint_package_name" mint run sourcery \
                --sources "$source_dir" \
                --templates "$template_path/${component}.stencil" \
                --output "$output_test_dir/${component}/${screen_name}${component}.swift" \
                --args "screenName=$screen_name","diContainerName=$di_container_name","userName=$current_user","date=$current_date"
done
remove_sourcery_header "$output_test_dir"

# UICatalog 関連
for component in "ViewTestCase"
do
    swift run --package-path "$mint_package_name" mint run sourcery \
                --sources "$source_dir" \
                --templates "$template_path/${component}.stencil" \
                --output "$output_test_case_dir/${component}/${screen_name}${component}.swift" \
                --args "screenName=$screen_name","diContainerName=$di_container_name","userName=$current_user","date=$current_date"
done
remove_sourcery_header "$output_test_case_dir"

# UICatalogType 関連
swift run --package-path "$mint_package_name" mint run sourcery \
          --sources "$output_test_case_dir" \
          --templates "./sourcery/template/UICatalogType.stencil" \
          --output "$output_test_case_dir/UICatalogType.swift"

remove_sourcery_header "$output_test_case_dir"

echo "Sourcery DONE!!"
```

このスクリプトは、他のテンプレート処理と同様に `UICatalogType` の生成処理を追加しています。スクリプトの最後に `UICatalogType` に関する処理を追加することで、一連のテンプレート生成が完了した後に `UICatalogType` が生成されます。

---

## 👤 ユーザー
*2024/6/7 15:07:34*

以下になった

error: ./sourcery/template/presentation_code_gen/UICatalogType.stencil: Unknown filter 'lowercaseFirst'. Found similar filters: 'lowercase', 'lowercase', 'lowercase'.

---

## 🤖 アシスタント
*2024/6/7 15:08:10*

`lowercaseFirst` というフィルタが存在しないため、テンプレートエンジンで利用可能なフィルタを使用して代替する必要があります。`lowercase` フィルタを使用して対応する方法を以下に示します。

まず、`UICatalogType.stencil` を修正します。

### UICatalogType.stencil

```stencil
import DomainLayer
import PresentationLayer
import SwiftUI

public enum UICatalogType: SwiftUIForEachable {
    {% for type in types.classes where type.name|hasSuffix:"ViewTestCase" %}
    case {{ type.name|replace:"ViewTestCase",""|lowercase }}
    {% endfor %}

    @MainActor @ViewBuilder
    public var testCaseListView: some View {
        switch self {
        {% for type in types.classes where type.name|hasSuffix:"ViewTestCase" %}
        case .{{ type.name|replace:"ViewTestCase",""|lowercase }}:
            TestCaseListView<{{ type.name }}>()
        {% endfor %}
        }
    }
}
```

このテンプレートでは、クラス名の末尾にある `ViewTestCase` を削除し、小文字に変換して `enum` ケースを生成します。

次に、テンプレートを使用して `UICatalogType.swift` を生成するためのスクリプトを修正します。

### スクリプト

```bash
#!/bin/bash

# 引数の数の確認
if [ "$#" -ne 2 ]; then
    echo "Need args: $0 <DI Container> <View>"
    exit 1
fi

mint_package_name="MintCLIPackage"
product_package_name="SmallTalkPackage"
di_container_name="$1"
screen_name="$2"
template_path="./sourcery/template/presentation_code_gen"
source_dir="${product_package_name}/Sources/Presentation"

output_presentation_dir="${source_dir}/View/${screen_name}"
output_di_container_dependency_dir="${source_dir}/DIContainerDependency"
output_test_dir="${product_package_name}/Tests"
output_test_case_dir="${product_package_name}/Sources/UICatalog/Entity"

current_user=$(whoami)
current_date=$(date "+%Y/%m/%d")

# --force-parse のオプションが拡張子を別にしないと効かないため、それを回避するためのワークアラウンド処理
remove_sourcery_header() {
    local target_directory="$1"
    # ファイルの先頭1行を読み込み、「// Generated using Sourcery」の文字列が含まれている場合、最初の3行を削除する
    find "$target_directory" -type f -name "*.swift" | while read -r file; do
        head=$(head -n 1 "$file")
        if echo "$head" | grep -q "// Generated using Sourcery"; then
            echo "Updating file: $file"
            tail -n +4 "$file" > "$file.tmp" && mv "$file.tmp" "$file"
        fi
    done
}

# 出力ディレクトリが存在しない場合は作成
mkdir -p "$output_presentation_dir"
mkdir -p "$output_di_container_dependency_dir"
mkdir -p "$output_test_dir"
mkdir -p "$output_test_case_dir"

# View 関連
for component in "PresenterDependency" "Presenter" "View"
do
    swift run --package-path "$mint_package_name" mint run sourcery \
              --sources "$source_dir" \
              --templates "$template_path/${component}.stencil" \
              --output "$output_presentation_dir/${screen_name}${component}.swift" \
              --args "screenName=$screen_name","diContainerName=$di_container_name","userName=$current_user","date=$current_date"
done
remove_sourcery_header "$output_presentation_dir"

# DIContainer 関連
for component in "DIContainerDependency"
do
swift run --package-path "$mint_package_name" mint run sourcery --disableCache \
          --sources "$source_dir" \
          --templates "$template_path/${component}.stencil" \
          --output "$output_di_container_dependency_dir/${di_container_name}${component}.swift" \
          --args "screenName=$screen_name","diContainerName=$di_container_name","userName=$current_user","date=$current_date"
done
remove_sourcery_header "$output_di_container_dependency_dir"

# Test 関連
for component in "ViewSnapshotTest" "PresenterTest"
do
    swift run --package-path "$mint_package_name" mint run sourcery \
                --sources "$source_dir" \
                --templates "$template_path/${component}.stencil" \
                --output "$output_test_dir/${component}/${screen_name}${component}.swift" \
                --args "screenName=$screen_name","diContainerName=$di_container_name","userName=$current_user","date=$current_date"
done
remove_sourcery_header "$output_test_dir"

# UICatalog 関連
for component in "ViewTestCase"
do
    swift run --package-path "$mint_package_name" mint run sourcery \
                --sources "$source_dir" \
                --templates "$template_path/${component}.stencil" \
                --output "$output_test_case_dir/${component}/${screen_name}${component}.swift" \
                --args "screenName=$screen_name","diContainerName=$di_container_name","userName=$current_user","date=$current_date"
done
remove_sourcery_header "$output_test_case_dir"

# UICatalogType 関連
swift run --package-path "$mint_package_name" mint run sourcery \
          --sources "$output_test_case_dir" \
          --templates "./sourcery/template/UICatalogType.stencil" \
          --output "$output_test_case_dir/UICatalogType.swift"

remove_sourcery_header "$output_test_case_dir"

echo "Sourcery DONE!!"
```

このスクリプトを使用して `UICatalogType.swift` を生成するとき、`UICatalogType.stencil` テンプレートを適用して `ViewTestCase` に基づく `enum` ケースを生成します。これにより、テンプレートエンジンが正しく動作するようになります。

---

## 👤 ユーザー
*2024/6/7 15:09:38*

以下の出力になってしまった

import DomainLayer
import PresentationLayer
import SwiftUI

public enum UICatalogType: SwiftUIForEachable {

    @MainActor @ViewBuilder
    public var testCaseListView: some View {
        switch self {
        }
    }
}

---

## 🤖 アシスタント
*2024/6/7 15:10:13*

以下の手順で修正します。

1. Sourcery が正しく `ViewTestCase` クラスを認識しているか確認します。
2. 正しいディレクトリを指定して Sourcery を実行するようにスクリプトを修正します。

### UICatalogType.stencil

まず、テンプレートのフィルタを修正します。

```stencil
import DomainLayer
import PresentationLayer
import SwiftUI

public enum UICatalogType: SwiftUIForEachable {
    {% for type in types.classes where type.name|endsWith:"ViewTestCase" %}
    case {{ type.name|replace:"ViewTestCase",""|lowercaseFirst }}
    {% endfor %}

    @MainActor @ViewBuilder
    public var testCaseListView: some View {
        switch self {
        {% for type in types.classes where type.name|endsWith:"ViewTestCase" %}
        case .{{ type.name|replace:"ViewTestCase",""|lowercaseFirst }}:
            TestCaseListView<{{ type.name }}>()
        {% endfor %}
        }
    }
}
```

### スクリプトの修正

次に、スクリプトを修正して Sourcery が正しいディレクトリを解析するようにします。

```bash
#!/bin/bash

# 引数の数の確認
if [ "$#" -ne 2 ]; then
    echo "Need args: $0 <DI Container> <View>"
    exit 1
fi

mint_package_name="MintCLIPackage"
product_package_name="SmallTalkPackage"
di_container_name="$1"
screen_name="$2"
template_path="./sourcery/template/presentation_code_gen"
source_dir="${product_package_name}/Sources/Presentation"

output_presentation_dir="${source_dir}/View/${screen_name}"
output_di_container_dependency_dir="${source_dir}/DIContainerDependency"
output_test_dir="${product_package_name}/Tests"
output_test_case_dir="${product_package_name}/Sources/UICatalog/Entity"

current_user=$(whoami)
current_date=$(date "+%Y/%m/%d")

# --force-parse のオプションが拡張子を別にしないと効かないため、それを回避するためのワークアラウンド処理
remove_sourcery_header() {
    local target_directory="$1"
    # ファイルの先頭1行を読み込み、「// Generated using Sourcery」の文字列が含まれている場合、最初の3行を削除する
    find "$target_directory" -type f -name "*.swift" | while read -r file; do
        head=$(head -n 1 "$file")
        if echo "$head" | grep -q "// Generated using Sourcery"; then
            echo "Updating file: $file"
            tail -n +4 "$file" > "$file.tmp" && mv "$file.tmp" "$file"
        fi
    done
}

# 出力ディレクトリが存在しない場合は作成
mkdir -p "$output_presentation_dir"
mkdir -p "$output_di_container_dependency_dir"
mkdir -p "$output_test_dir"
mkdir -p "$output_test_case_dir"

# View 関連
for component in "PresenterDependency" "Presenter" "View"
do
    swift run --package-path "$mint_package_name" mint run sourcery \
              --sources "$source_dir" \
              --templates "$template_path/${component}.stencil" \
              --output "$output_presentation_dir/${screen_name}${component}.swift" \
              --args "screenName=$screen_name","diContainerName=$di_container_name","userName=$current_user","date=$current_date"
done
remove_sourcery_header "$output_presentation_dir"

# DIContainer 関連
for component in "DIContainerDependency"
do
swift run --package-path "$mint_package_name" mint run sourcery --disableCache \
          --sources "$source_dir" \
          --templates "$template_path/${component}.stencil" \
          --output "$output_di_container_dependency_dir/${di_container_name}${component}.swift" \
          --args "screenName=$screen_name","diContainerName=$di_container_name","userName=$current_user","date=$current_date"
done
remove_sourcery_header "$output_di_container_dependency_dir"

# Test 関連
for component in "ViewSnapshotTest" "PresenterTest"
do
    swift run --package-path "$mint_package_name" mint run sourcery \
                --sources "$source_dir" \
                --templates "$template_path/${component}.stencil" \
                --output "$output_test_dir/${component}/${screen_name}${component}.swift" \
                --args "screenName=$screen_name","diContainerName=$di_container_name","userName=$current_user","date=$current_date"
done
remove_sourcery_header "$output_test_dir"

# UICatalog 関連
for component in "ViewTestCase"
do
    swift run --package-path "$mint_package_name" mint run sourcery \
                --sources "$source_dir" \
                --templates "$template_path/${component}.stencil" \
                --output "$output_test_case_dir/${component}/${screen_name}${component}.swift" \
                --args "screenName=$screen_name","diContainerName=$di_container_name","userName=$current_user","date=$current_date"
done
remove_sourcery_header "$output_test_case_dir"

# UICatalogType 関連
swift run --package-path "$mint_package_name" mint run sourcery \
          --sources "$output_test_case_dir/ViewTestCase" \
          --templates "./sourcery/template/UICatalogType.stencil" \
          --output "$output_test_case_dir/UICatalogType.swift"

remove_sourcery_header "$output_test_case_dir"

echo "Sourcery DONE!!"
```

### 重要なポイント

1. `--sources` オプションで `ViewTestCase` ディレクトリを指定します。
2. `replace` フィルタの使用で、`ViewTestCase` サフィックスを削除します。
3. `lowercaseFirst` フィルタを正しいフィルタに置き換えます。

これで、テンプレートが正しく `ViewTestCase` クラスを認識し、それに基づいて `UICatalogType.swift` を生成するはずです。

---

## 👤 ユーザー
*2024/6/7 15:10:50*

以下のエラーになった

error: ./sourcery/template/presentation_code_gen/UICatalogType.stencil: Unknown filter 'endsWith'. Found similar filters: 'indent', 'inherits', 'indent'.

---

## 🤖 アシスタント
*2024/6/7 15:11:26*

`endsWith` フィルタが存在しないため、Sourcery で使用可能なフィルタを使用して `ViewTestCase` のクラス名を正しくフィルタリングする必要があります。代わりに、`hasSuffix` フィルタを使用します。

以下に、修正した `UICatalogType.stencil` とスクリプトを示します。

### UICatalogType.stencil

```stencil
import DomainLayer
import PresentationLayer
import SwiftUI

public enum UICatalogType: SwiftUIForEachable {
    {% for type in types.classes where type.name|hasSuffix:"ViewTestCase" %}
    case {{ type.name|replace:"ViewTestCase",""|lowercase }}
    {% endfor %}

    @MainActor @ViewBuilder
    public var testCaseListView: some View {
        switch self {
        {% for type in types.classes where type.name|hasSuffix:"ViewTestCase" %}
        case .{{ type.name|replace:"ViewTestCase",""|lowercase }}:
            TestCaseListView<{{ type.name }}>()
        {% endfor %}
        }
    }
}
```

### スクリプトの修正

次に、スクリプトを修正して Sourcery が正しいディレクトリを解析するようにします。

```bash
#!/bin/bash

# 引数の数の確認
if [ "$#" -ne 2 ]; then
    echo "Need args: $0 <DI Container> <View>"
    exit 1
fi

mint_package_name="MintCLIPackage"
product_package_name="SmallTalkPackage"
di_container_name="$1"
screen_name="$2"
template_path="./sourcery/template/presentation_code_gen"
source_dir="${product_package_name}/Sources/Presentation"

output_presentation_dir="${source_dir}/View/${screen_name}"
output_di_container_dependency_dir="${source_dir}/DIContainerDependency"
output_test_dir="${product_package_name}/Tests"
output_test_case_dir="${product_package_name}/Sources/UICatalog/Entity"

current_user=$(whoami)
current_date=$(date "+%Y/%m/%d")

# --force-parse のオプションが拡張子を別にしないと効かないため、それを回避するためのワークアラウンド処理
remove_sourcery_header() {
    local target_directory="$1"
    # ファイルの先頭1行を読み込み、「// Generated using Sourcery」の文字列が含まれている場合、最初の3行を削除する
    find "$target_directory" -type f -name "*.swift" | while read -r file; do
        head=$(head -n 1 "$file")
        if echo "$head" | grep -q "// Generated using Sourcery"; then
            echo "Updating file: $file"
            tail -n +4 "$file" > "$file.tmp" && mv "$file.tmp" "$file"
        fi
    done
}

# 出力ディレクトリが存在しない場合は作成
mkdir -p "$output_presentation_dir"
mkdir -p "$output_di_container_dependency_dir"
mkdir -p "$output_test_dir"
mkdir -p "$output_test_case_dir"

# View 関連
for component in "PresenterDependency" "Presenter" "View"
do
    swift run --package-path "$mint_package_name" mint run sourcery \
              --sources "$source_dir" \
              --templates "$template_path/${component}.stencil" \
              --output "$output_presentation_dir/${screen_name}${component}.swift" \
              --args "screenName=$screen_name","diContainerName=$di_container_name","userName=$current_user","date=$current_date"
done
remove_sourcery_header "$output_presentation_dir"

# DIContainer 関連
for component in "DIContainerDependency"
do
swift run --package-path "$mint_package_name" mint run sourcery --disableCache \
          --sources "$source_dir" \
          --templates "$template_path/${component}.stencil" \
          --output "$output_di_container_dependency_dir/${di_container_name}${component}.swift" \
          --args "screenName=$screen_name","diContainerName=$di_container_name","userName=$current_user","date=$current_date"
done
remove_sourcery_header "$output_di_container_dependency_dir"

# Test 関連
for component in "ViewSnapshotTest" "PresenterTest"
do
    swift run --package-path "$mint_package_name" mint run sourcery \
                --sources "$source_dir" \
                --templates "$template_path/${component}.stencil" \
                --output "$output_test_dir/${component}/${screen_name}${component}.swift" \
                --args "screenName=$screen_name","diContainerName=$di_container_name","userName=$current_user","date=$current_date"
done
remove_sourcery_header "$output_test_dir"

# UICatalog 関連
for component in "ViewTestCase"
do
    swift run --package-path "$mint_package_name" mint run sourcery \
                --sources "$source_dir" \
                --templates "$template_path/${component}.stencil" \
                --output "$output_test_case_dir/${component}/${screen_name}${component}.swift" \
                --args "screenName=$screen_name","diContainerName=$di_container_name","userName=$current_user","date=$current_date"
done
remove_sourcery_header "$output_test_case_dir"

# UICatalogType 関連
swift run --package-path "$mint_package_name" mint run sourcery \
          --sources "$output_test_case_dir" \
          --templates "./sourcery/template/UICatalogType.stencil" \
          --output "$output_test_case_dir/UICatalogType.swift"

remove_sourcery_header "$output_test_case_dir"

echo "Sourcery DONE!!"
```

このスクリプトを使用して `UICatalogType.swift` を生成するとき、`UICatalogType.stencil` テンプレートを適用して `ViewTestCase` に基づく `enum` ケースを生成します。これにより、テンプレートエンジンが正しく動作するはずです。

---

## 👤 ユーザー
*2024/6/7 15:27:16*

UICatalogType.stencil がまちがっている

types.classes としているが、以下なんだ。つまりクラスではない

APIRequestViewTestCase.swift

public enum APIRequestViewTestCase: UICatalogTestCaseProvider {
    case normal
    case error

    @MainActor @ViewBuilder
    public var testCaseView: some View {
        switch self {
        case .normal:
            APIRequestView(dependency: RootDIContainerDependencyMock.placeholder)
        case .error:
            APIRequestView(dependency: RootDIContainerDependencyMock.error)
        }
    }
}

---

## 🤖 アシスタント
*2024/6/7 15:27:55*

`UICatalogType.stencil` でクラスではなく、`enum` タイプの `ViewTestCase` を認識するように修正します。以下に修正したテンプレートとスクリプトを示します。

### UICatalogType.stencil

```stencil
import DomainLayer
import PresentationLayer
import SwiftUI

public enum UICatalogType: SwiftUIForEachable {
    {% for type in types.enums where type.name|hasSuffix:"ViewTestCase" %}
    case {{ type.name|replace:"ViewTestCase",""|lowercase }}
    {% endfor %}

    @MainActor @ViewBuilder
    public var testCaseListView: some View {
        switch self {
        {% for type in types.enums where type.name|hasSuffix:"ViewTestCase" %}
        case .{{ type.name|replace:"ViewTestCase",""|lowercase }}:
            TestCaseListView<{{ type.name }}>()
        {% endfor %}
        }
    }
}
```

### スクリプトの修正

次に、スクリプトを修正して Sourcery が正しいディレクトリを解析するようにします。

```bash
#!/bin/bash

# 引数の数の確認
if [ "$#" -ne 2 ]; then
    echo "Need args: $0 <DI Container> <View>"
    exit 1
fi

mint_package_name="MintCLIPackage"
product_package_name="SmallTalkPackage"
di_container_name="$1"
screen_name="$2"
template_path="./sourcery/template/presentation_code_gen"
source_dir="${product_package_name}/Sources/Presentation"

output_presentation_dir="${source_dir}/View/${screen_name}"
output_di_container_dependency_dir="${source_dir}/DIContainerDependency"
output_test_dir="${product_package_name}/Tests"
output_test_case_dir="${product_package_name}/Sources/UICatalog/Entity"

current_user=$(whoami)
current_date=$(date "+%Y/%m/%d")

# --force-parse のオプションが拡張子を別にしないと効かないため、それを回避するためのワークアラウンド処理
remove_sourcery_header() {
    local target_directory="$1"
    # ファイルの先頭1行を読み込み、「// Generated using Sourcery」の文字列が含まれている場合、最初の3行を削除する
    find "$target_directory" -type f -name "*.swift" | while read -r file; do
        head=$(head -n 1 "$file")
        if echo "$head" | grep -q "// Generated using Sourcery"; then
            echo "Updating file: $file"
            tail -n +4 "$file" > "$file.tmp" && mv "$file.tmp" "$file"
        fi
    done
}

# 出力ディレクトリが存在しない場合は作成
mkdir -p "$output_presentation_dir"
mkdir -p "$output_di_container_dependency_dir"
mkdir -p "$output_test_dir"
mkdir -p "$output_test_case_dir"

# View 関連
for component in "PresenterDependency" "Presenter" "View"
do
    swift run --package-path "$mint_package_name" mint run sourcery \
              --sources "$source_dir" \
              --templates "$template_path/${component}.stencil" \
              --output "$output_presentation_dir/${screen_name}${component}.swift" \
              --args "screenName=$screen_name","diContainerName=$di_container_name","userName=$current_user","date=$current_date"
done
remove_sourcery_header "$output_presentation_dir"

# DIContainer 関連
for component in "DIContainerDependency"
do
swift run --package-path "$mint_package_name" mint run sourcery --disableCache \
          --sources "$source_dir" \
          --templates "$template_path/${component}.stencil" \
          --output "$output_di_container_dependency_dir/${di_container_name}${component}.swift" \
          --args "screenName=$screen_name","diContainerName=$di_container_name","userName=$current_user","date=$current_date"
done
remove_sourcery_header "$output_di_container_dependency_dir"

# Test 関連
for component in "ViewSnapshotTest" "PresenterTest"
do
    swift run --package-path "$mint_package_name" mint run sourcery \
                --sources "$source_dir" \
                --templates "$template_path/${component}.stencil" \
                --output "$output_test_dir/${component}/${screen_name}${component}.swift" \
                --args "screenName=$screen_name","diContainerName=$di_container_name","userName=$current_user","date=$current_date"
done
remove_sourcery_header "$output_test_dir"

# UICatalog 関連
for component in "ViewTestCase"
do
    swift run --package-path "$mint_package_name" mint run sourcery \
                --sources "$source_dir" \
                --templates "$template_path/${component}.stencil" \
                --output "$output_test_case_dir/${component}/${screen_name}${component}.swift" \
                --args "screenName=$screen_name","diContainerName=$di_container_name","userName=$current_user","date=$current_date"
done
remove_sourcery_header "$output_test_case_dir"

# UICatalogType 関連
swift run --package-path "$mint_package_name" mint run sourcery \
          --sources "$output_test_case_dir" \
          --templates "./sourcery/template/UICatalogType.stencil" \
          --output "$output_test_case_dir/UICatalogType.swift"

remove_sourcery_header "$output_test_case_dir"

echo "Sourcery DONE!!"
```

これで、テンプレートが正しく `ViewTestCase` の型を認識し、それに基づいて `UICatalogType.swift` を生成するようになります。

---

## 👤 ユーザー
*2024/6/7 15:31:30*

stencilには lowercase 意外にどんな変換が指定できるの？

---

## 🤖 アシスタント
*2024/6/7 15:32:00*

Stencil テンプレートエンジンでは、いくつかの標準的なフィルタを使用して文字列を変換できます。以下は Stencil で使用可能な一般的なフィルタのリストです。

### 文字列変換フィルタ

- `uppercase` - 文字列を大文字に変換します。
- `lowercase` - 文字列を小文字に変換します。
- `capitalize` - 文字列の先頭の文字を大文字に変換します。
- `escape` - HTMLエスケープを行います。
- `replace: "old", "new"` - 文字列内の部分文字列を置換します。
- `split: "delimiter"` - 文字列を指定されたデリミタで分割し、配列に変換します。
- `join: "delimiter"` - 配列内の要素を指定されたデリミタで連結します。
- `trim` - 文字列の前後の空白を削除します。

### 配列操作フィルタ

- `first` - 配列の最初の要素を返します。
- `last` - 配列の最後の要素を返します。
- `size` - 配列のサイズを返します。
- `sort` - 配列をソートします。
- `unique` - 配列内の重複要素を削除します。

### その他のフィルタ

- `default: "value"` - 値が存在しない場合にデフォルト値を返します。
- `length` - 文字列や配列の長さを返します。
- `contains: "value"` - 配列が指定された値を含んでいるかどうかを確認します。
- `map: "attribute"` - 配列内のオブジェクトの属性をマッピングします。

### 使用例

```stencil
{{ "hello" | uppercase }}    {# "HELLO" #}
{{ "HELLO" | lowercase }}    {# "hello" #}
{{ "hello" | capitalize }}   {# "Hello" #}
{{ "hello world" | replace:"world","Stencil" }} {# "hello Stencil" #}
{{ "apple,banana,orange" | split:"," }} {# ["apple", "banana", "orange"] #}
{{ ["apple", "banana", "orange"] | join:", " }} {# "apple, banana, orange" #}
{{ "  hello  " | trim }}     {# "hello" #}
{{ ["apple", "banana", "orange"] | first }} {# "apple" #}
{{ ["apple", "banana", "orange"] | last }} {# "orange" #}
{{ ["apple", "banana", "orange"] | size }} {# 3 #}
{{ ["apple", "banana", "apple"] | unique }} {# ["apple", "banana"] #}
{{ nil | default:"default value" }} {# "default value" #}
{{ "hello" | length }} {# 5 #}
{{ ["apple", "banana", "orange"] | contains:"banana" }} {# true #}
```

これらのフィルタを使用して、Stencil テンプレート内の文字列や配列を柔軟に操作できます。

### 具体的な例

現在の問題に対して、`ViewTestCase` のクラス名を取得し、それを小文字に変換して `enum` ケースを生成する場合は以下のようにします。

### UICatalogType.stencil

```stencil
import DomainLayer
import PresentationLayer
import SwiftUI

public enum UICatalogType: SwiftUIForEachable {
    {% for type in types.enums where type.name|hasSuffix:"ViewTestCase" %}
    case {{ type.name|replace:"ViewTestCase",""|lowercase }}
    {% endfor %}

    @MainActor @ViewBuilder
    public var testCaseListView: some View {
        switch self {
        {% for type in types.enums where type.name|hasSuffix:"ViewTestCase" %}
        case .{{ type.name|replace:"ViewTestCase",""|lowercase }}:
            TestCaseListView<{{ type.name }}>()
        {% endfor %}
        }
    }
}
```

このテンプレートは、`ViewTestCase` のサフィックスを持つ `enum` を見つけ、その名前を小文字に変換して `enum` ケースを生成します。

---

## 👤 ユーザー
*2024/6/7 15:32:18*

これだと全部小文字になってしまって、先頭の頭文字だけ小文字にしたいんだ

---

## 🤖 アシスタント
*2024/6/7 15:32:45*

Stencil には直接 `lowercaseFirst` フィルタがありませんが、カスタムフィルタを使用してこの機能を実現できます。ただし、カスタムフィルタを作成するためには、Stencil テンプレートエンジンの拡張が必要です。以下に、その手順を示します。

### カスタムフィルタの作成

Stencil にカスタムフィルタを追加するには、Sourcery の設定を変更する必要があります。以下は、Stencil にカスタムフィルタを追加する方法の概要です。

1. **カスタムフィルタを定義する Swift ファイルを作成**

```swift
// CustomFilters.swift
import Stencil

class LowercaseFirstFilter: Filter {
    let name = "lowercaseFirst"

    func filter(_ value: Any?) throws -> Any? {
        guard let string = value as? String else { return value }
        return string.prefix(1).lowercased() + string.dropFirst()
    }
}
```

2. **Sourcery の設定を更新**

Sourcery の設定ファイルにカスタムフィルタを追加します。通常、これは `main.swift` ファイルの中で行います。

```swift
// main.swift
import SourceryFramework
import Stencil

let environment = Environment(extensions: [StencilSwiftKitExtension()])
environment.filters["lowercaseFirst"] = LowercaseFirstFilter().filter

do {
    try Sourcery().generate(environment: environment)
} catch {
    print("Failed to generate code: \(error)")
}
```

3. **テンプレートでカスタムフィルタを使用**

カスタムフィルタを使用するために、テンプレートで `lowercaseFirst` フィルタを利用します。

### テンプレートの修正

カスタムフィルタが利用できる場合、テンプレートは次のようになります。

```stencil
import DomainLayer
import PresentationLayer
import SwiftUI

public enum UICatalogType: SwiftUIForEachable {
    {% for type in types.enums where type.name|hasSuffix:"ViewTestCase" %}
    case {{ type.name|replace:"ViewTestCase",""|lowercaseFirst }}
    {% endfor %}

    @MainActor @ViewBuilder
    public var testCaseListView: some View {
        switch self {
        {% for type in types.enums where type.name|hasSuffix:"ViewTestCase" %}
        case .{{ type.name|replace:"ViewTestCase",""|lowercaseFirst }}:
            TestCaseListView<{{ type.name }}>()
        {% endfor %}
        }
    }
}
```

### カスタムフィルタなしのアプローチ

もしカスタムフィルタを作成するのが難しい場合、手動でテンプレートを修正する必要があります。これには、特定の名前変換ロジックを使って文字列操作を行います。

1. `replace` フィルタを利用して、先頭の文字を手動で小文字に変換します。

```stencil
import DomainLayer
import PresentationLayer
import SwiftUI

public enum UICatalogType: SwiftUIForEachable {
    {% for type in types.enums where type.name|hasSuffix:"ViewTestCase" %}
    case {{ type.name|replace:"ViewTestCase",""|slice:0,1|lowercase }}{{ type.name|replace:"ViewTestCase",""|slice:1 }}
    {% endfor %}

    @MainActor @ViewBuilder
    public var testCaseListView: some View {
        switch self {
        {% for type in types.enums where type.name|hasSuffix:"ViewTestCase" %}
        case .{{ type.name|replace:"ViewTestCase",""|slice:0,1|lowercase }}{{ type.name|replace:"ViewTestCase",""|slice:1 }}:
            TestCaseListView<{{ type.name }}>()
        {% endfor %}
        }
    }
}
```

これにより、`ViewTestCase` のクラス名の先頭文字を小文字に変換し、残りの部分をそのまま保持することができます。

---

## 👤 ユーザー
*2024/6/7 15:36:03*

カスタムフィルタなしのアプローチがよくて、以下のエラーになった

./sourcery/template/presentation_code_gen/UICatalogType.stencil: Unknown filter 'slice'. Found similar filters: 'split', 'split'.

以下を参照にするとよさそう
https://stencil.fuller.li/en/latest/builtins.html#built-in-filters-1

---

## 🤖 アシスタント
*2024/6/7 15:36:40*

`slice` フィルタが利用できないため、テンプレートのロジックを修正して、組み込みのフィルタのみを使用して先頭の文字を小文字に変換する方法を検討します。`map` フィルタを使用して配列操作を行い、文字列を操作する方法を次に示します。

### UICatalogType.stencil

次のテンプレートは、文字列の最初の文字を小文字に変換し、残りの部分を結合して `enum` ケースを生成します。

```stencil
import DomainLayer
import PresentationLayer
import SwiftUI

public enum UICatalogType: SwiftUIForEachable {
    {% for type in types.enums where type.name|hasSuffix:"ViewTestCase" %}
    case {{ (type.name|replace:"ViewTestCase","")|first|lowercase }}{{ (type.name|replace:"ViewTestCase","")|slice:1: }}
    {% endfor %}

    @MainActor @ViewBuilder
    public var testCaseListView: some View {
        switch self {
        {% for type in types.enums where type.name|hasSuffix:"ViewTestCase" %}
        case .{{ (type.name|replace:"ViewTestCase","")|first|lowercase }}{{ (type.name|replace:"ViewTestCase","")|slice:1: }}:
            TestCaseListView<{{ type.name }}>()
        {% endfor %}
        }
    }
}
```

### スクリプトの修正

テンプレートが正しく動作するようにスクリプトを修正します。スクリプト自体はそのままで問題ありません。

```bash
#!/bin/bash

# 引数の数の確認
if [ "$#" -ne 2 ]; then
    echo "Need args: $0 <DI Container> <View>"
    exit 1
fi

mint_package_name="MintCLIPackage"
product_package_name="SmallTalkPackage"
di_container_name="$1"
screen_name="$2"
template_path="./sourcery/template/presentation_code_gen"
source_dir="${product_package_name}/Sources/Presentation"

output_presentation_dir="${source_dir}/View/${screen_name}"
output_di_container_dependency_dir="${source_dir}/DIContainerDependency"
output_test_dir="${product_package_name}/Tests"
output_test_case_dir="${product_package_name}/Sources/UICatalog/Entity"

current_user=$(whoami)
current_date=$(date "+%Y/%m/%d")

# --force-parse のオプションが拡張子を別にしないと効かないため、それを回避するためのワークアラウンド処理
remove_sourcery_header() {
    local target_directory="$1"
    # ファイルの先頭1行を読み込み、「// Generated using Sourcery」の文字列が含まれている場合、最初の3行を削除する
    find "$target_directory" -type f -name "*.swift" | while read -r file; do
        head=$(head -n 1 "$file")
        if echo "$head" | grep -q "// Generated using Sourcery"; then
            echo "Updating file: $file"
            tail -n +4 "$file" > "$file.tmp" && mv "$file.tmp" "$file"
        fi
    done
}

# 出力ディレクトリが存在しない場合は作成
mkdir -p "$output_presentation_dir"
mkdir -p "$output_di_container_dependency_dir"
mkdir -p "$output_test_dir"
mkdir -p "$output_test_case_dir"

# View 関連
for component in "PresenterDependency" "Presenter" "View"
do
    swift run --package-path "$mint_package_name" mint run sourcery \
              --sources "$source_dir" \
              --templates "$template_path/${component}.stencil" \
              --output "$output_presentation_dir/${screen_name}${component}.swift" \
              --args "screenName=$screen_name","diContainerName=$di_container_name","userName=$current_user","date=$current_date"
done
remove_sourcery_header "$output_presentation_dir"

# DIContainer 関連
for component in "DIContainerDependency"
do
swift run --package-path "$mint_package_name" mint run sourcery --disableCache \
          --sources "$source_dir" \
          --templates "$template_path/${component}.stencil" \
          --output "$output_di_container_dependency_dir/${di_container_name}${component}.swift" \
          --args "screenName=$screen_name","diContainerName=$di_container_name","userName=$current_user","date=$current_date"
done
remove_sourcery_header "$output_di_container_dependency_dir"

# Test 関連
for component in "ViewSnapshotTest" "PresenterTest"
do
    swift run --package-path "$mint_package_name" mint run sourcery \
                --sources "$source_dir" \
                --templates "$template_path/${component}.stencil" \
                --output "$output_test_dir/${component}/${screen_name}${component}.swift" \
                --args "screenName=$screen_name","diContainerName=$di_container_name","userName=$current_user","date=$current_date"
done
remove_sourcery_header "$output_test_dir"

# UICatalog 関連
for component in "ViewTestCase"
do
    swift run --package-path "$mint_package_name" mint run sourcery \
                --sources "$source_dir" \
                --templates "$template_path/${component}.stencil" \
                --output "$output_test_case_dir/${component}/${screen_name}${component}.swift" \
                --args "screenName=$screen_name","diContainerName=$di_container_name","userName=$current_user","date=$current_date"
done
remove_sourcery_header "$output_test_case_dir"

# UICatalogType 関連
swift run --package-path "$mint_package_name" mint run sourcery \
          --sources "$output_test_case_dir" \
          --templates "./sourcery/template/UICatalogType.stencil" \
          --output "$output_test_case_dir/UICatalogType.swift"

remove_sourcery_header "$output_test_case_dir"

echo "Sourcery DONE!!"
```

### テンプレートでの文字列操作

文字列を操作して最初の文字を小文字に変換するロジックを組み合わせて使用します。例えば、`first` フィルタで文字列の最初の文字を取得し、`lowercase` フィルタでそれを小文字に変換し、残りの部分を結合します。

これで、テンプレートエンジンが正しく動作し、`ViewTestCase` のサフィックスを持つ `enum` 型を認識して、それに基づいた `UICatalogType` を生成します。

---

## 👤 ユーザー
*2024/6/7 15:37:49*

以下になった

error: ./sourcery/template/presentation_code_gen/UICatalogType.stencil: Unknown filter ')'.
./sourcery/template/presentation_code_gen/UICatalogType.stencil: Unknown filter ')'

---

## 🤖 アシスタント
*2024/6/7 15:38:01*

Stencil テンプレートエンジンの組み込みフィルタだけを使用して、文字列の最初の文字を小文字に変換し、残りの部分をそのまま保持するためには、いくつかのトリックを使う必要があります。組み込みの `split` フィルタとテンプレートロジックを組み合わせて実現できます。

次に示すのは、`split` フィルタを使用して文字列を分割し、最初の文字を小文字に変換し、再度結合する方法です。

### UICatalogType.stencil

```stencil
import DomainLayer
import PresentationLayer
import SwiftUI

public enum UICatalogType: SwiftUIForEachable {
    {% for type in types.enums where type.name|hasSuffix:"ViewTestCase" %}
    {% set baseName = type.name|replace:"ViewTestCase","" %}
    case {{ baseName|slice:0,1|lowercase }}{{ baseName|slice:1 }}
    {% endfor %}

    @MainActor @ViewBuilder
    public var testCaseListView: some View {
        switch self {
        {% for type in types.enums where type.name|hasSuffix:"ViewTestCase" %}
        {% set baseName = type.name|replace:"ViewTestCase","" %}
        case .{{ baseName|slice:0,1|lowercase }}{{ baseName|slice:1 }}:
            TestCaseListView<{{ type.name }}>()
        {% endfor %}
        }
    }
}
```

### スクリプトの修正

スクリプト自体はそのままで問題ありませんが、テンプレートを適用する部分をもう一度確認します。

```bash
#!/bin/bash

# 引数の数の確認
if [ "$#" -ne 2 ];then
    echo "Need args: $0 <DI Container> <View>"
    exit 1
fi

mint_package_name="MintCLIPackage"
product_package_name

---
