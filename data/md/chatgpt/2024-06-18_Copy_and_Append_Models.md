# Copy and Append Models

日付: 2024-06-18

---

## 👤 ユーザー
*2024/6/18 14:59:50*

asset/mermaid/my_targets.mmd を asset/mermaid/my_targets_with_app.mmd にコピーして以下の内容をファイルの下に追記する処理をスクリプトファイルに書いてほしい。

```
    UICatalogLayer-->PresentationLayer
    DevelopmentApp([Development App])-->PresentationLayer
    StagingApp([Staging App])-->PresentationLayer
    StagingApp([Staging App])-->DependencyInjectionLayer
    ProductionApp([Production App])-->PresentationLayer
    ProductionApp([Production App])-->DependencyInjectionLayer
    UICatalogApp([UICatalog App])-->UICatalogLayer
```


```
#!/bin/bash

tools_package="./SmallTalkPackage"
mermaid_output_path="./asset/mermaid"
image_output_path="./asset/image"

generate_diagram() {
    local input_options=$1
    local output_base=$2 # ファイル名の基本部分を保持する変数
    local output_file_mmd="$mermaid_output_path/${output_base}.mmd" # .mmd ファイルのフルパス
    local output_file_svg="$image_output_path/${output_base}.svg" # .svg ファイルのフルパス

    # Swift Package Plugin を使って mermaid ファイルを生成
    swift package --package-path $tools_package plugin depermaid $input_options > "$output_file_mmd"

    # 最初の1行と最後の2行を削除
    sed -i '' '1d' "$output_file_mmd"
    sed -i '' '$d' "$output_file_mmd"
    sed -i '' '$d' "$output_file_mmd"

    # Mermaid CLI を使って SVG 画像を生成(本来は README.md に直接埋め込みたいがいいやり方が思いつかなかったためこのようにしている)
    npx @mermaid-js/mermaid-cli -i "$output_file_mmd" -o "$output_file_svg"
}

generate_diagram "--direction TD" "my_targets"
generate_diagram "--direction TD --test" "test_targets"
generate_diagram "--direction TD --product" "library_targets"
generate_diagram "--direction TD --test --product" "all_targets"
```

---

## 🤖 アシスタント
*2024/6/18 15:00:14*

以下は指定された処理を行うスクリプトです。このスクリプトは `asset/mermaid/my_targets.mmd` を `asset/mermaid/my_targets_with_app.mmd` にコピーし、指定された内容をファイルの下に追記します。

```bash
#!/bin/bash

# ファイルパスの定義
source_file="asset/mermaid/my_targets.mmd"
destination_file="asset/mermaid/my_targets_with_app.mmd"

# 追記する内容
append_content="
    UICatalogLayer-->PresentationLayer
    DevelopmentApp([Development App])-->PresentationLayer
    StagingApp([Staging App])-->PresentationLayer
    StagingApp([Staging App])-->DependencyInjectionLayer
    ProductionApp([Production App])-->PresentationLayer
    ProductionApp([Production App])-->DependencyInjectionLayer
    UICatalogApp([UICatalog App])-->UICatalogLayer
"

# コピー処理
cp "$source_file" "$destination_file"

# ファイルの下に追記
echo "$append_content" >> "$destination_file"

# Mermaidダイアグラム生成用関数
tools_package="./SmallTalkPackage"
mermaid_output_path="./asset/mermaid"
image_output_path="./asset/image"

generate_diagram() {
    local input_options=$1
    local output_base=$2
    local output_file_mmd="$mermaid_output_path/${output_base}.mmd"
    local output_file_svg="$image_output_path/${output_base}.svg"

    # Swift Package Plugin を使って mermaid ファイルを生成
    swift package --package-path $tools_package plugin depermaid $input_options > "$output_file_mmd"

    # 最初の1行と最後の2行を削除
    sed -i '' '1d' "$output_file_mmd"
    sed -i '' '$d' "$output_file_mmd"
    sed -i '' '$d' "$output_file_mmd"

    # Mermaid CLI を使って SVG 画像を生成
    npx @mermaid-js/mermaid-cli -i "$output_file_mmd" -o "$output_file_svg"
}

# ダイアグラム生成の呼び出し
generate_diagram "--direction TD" "my_targets"
generate_diagram "--direction TD --test" "test_targets"
generate_diagram "--direction TD --product" "library_targets"
generate_diagram "--direction TD --test --product" "all_targets"
```

このスクリプトを実行すると、指定の内容が `asset/mermaid/my_targets_with_app.mmd` に追記され、その後、元の `generate_diagram` 関数を使用して必要なダイアグラムが生成されます。

---

## 👤 ユーザー
*2024/6/18 15:00:31*

順番的には generate_diagram "--direction TD --test --product" "all_targets" の後に実行してほしい

---

## 🤖 アシスタント
*2024/6/18 15:00:49*

以下は、指定された順番で処理を行うスクリプトです。`generate_diagram "--direction TD --test --product" "all_targets"` の後にファイルのコピーと追記を実行します。

```bash
#!/bin/bash

# Mermaidダイアグラム生成用関数
tools_package="./SmallTalkPackage"
mermaid_output_path="./asset/mermaid"
image_output_path="./asset/image"

generate_diagram() {
    local input_options=$1
    local output_base=$2
    local output_file_mmd="$mermaid_output_path/${output_base}.mmd"
    local output_file_svg="$image_output_path/${output_base}.svg"

    # Swift Package Plugin を使って mermaid ファイルを生成
    swift package --package-path $tools_package plugin depermaid $input_options > "$output_file_mmd"

    # 最初の1行と最後の2行を削除
    sed -i '' '1d' "$output_file_mmd"
    sed -i '' '$d' "$output_file_mmd"
    sed -i '' '$d' "$output_file_mmd"

    # Mermaid CLI を使って SVG 画像を生成
    npx @mermaid-js/mermaid-cli -i "$output_file_mmd" -o "$output_file_svg"
}

# ダイアグラム生成の呼び出し
generate_diagram "--direction TD" "my_targets"
generate_diagram "--direction TD --test" "test_targets"
generate_diagram "--direction TD --product" "library_targets"
generate_diagram "--direction TD --test --product" "all_targets"

# ここからファイルコピーと追記の処理

# ファイルパスの定義
source_file="asset/mermaid/my_targets.mmd"
destination_file="asset/mermaid/my_targets_with_app.mmd"

# 追記する内容
append_content="
    UICatalogLayer-->PresentationLayer
    DevelopmentApp([Development App])-->PresentationLayer
    StagingApp([Staging App])-->PresentationLayer
    StagingApp([Staging App])-->DependencyInjectionLayer
    ProductionApp([Production App])-->PresentationLayer
    ProductionApp([Production App])-->DependencyInjectionLayer
    UICatalogApp([UICatalog App])-->UICatalogLayer
"

# コピー処理
cp "$source_file" "$destination_file"

# ファイルの下に追記
echo "$append_content" >> "$destination_file"
```

このスクリプトを実行すると、`generate_diagram "--direction TD --test --product" "all_targets"` の後に `asset/mermaid/my_targets.mmd` を `asset/mermaid/my_targets_with_app.mmd` にコピーし、指定の内容が追記されます。

---

## 👤 ユーザー
*2024/6/18 15:02:54*

以下は mermaid_output_path の変数を使ってほしい。

source_file="asset/mermaid/my_targets.mmd"
destination_file="asset/mermaid/my_targets_with_app.mmd"

また、Mermaid CLI を使って SVG 画像を生成してほしい。できれば generate_diagram に swift package --package-path $tools_package plugin depermaid $input_options &gt; "$output_file_mmd" を実行するかしないかのフラグを渡して、うまく共通化したい。

---

## 🤖 アシスタント
*2024/6/18 15:03:20*

以下は、要求された変更を反映させたスクリプトです。`generate_diagram` 関数にフラグを追加し、`swift package` コマンドの実行を制御し、ファイルのコピーと追記後にMermaid CLIを使ってSVG画像を生成します。

```bash
#!/bin/bash

# Mermaidダイアグラム生成用関数
tools_package="./SmallTalkPackage"
mermaid_output_path="./asset/mermaid"
image_output_path="./asset/image"

generate_diagram() {
    local input_options=$1
    local output_base=$2
    local generate_mermaid=$3
    local output_file_mmd="$mermaid_output_path/${output_base}.mmd"
    local output_file_svg="$image_output_path/${output_base}.svg"

    if [ "$generate_mermaid" = true ]; then
        # Swift Package Plugin を使って mermaid ファイルを生成
        swift package --package-path $tools_package plugin depermaid $input_options > "$output_file_mmd"

        # 最初の1行と最後の2行を削除
        sed -i '' '1d' "$output_file_mmd"
        sed -i '' '$d' "$output_file_mmd"
        sed -i '' '$d' "$output_file_mmd"
    fi

    # Mermaid CLI を使って SVG 画像を生成
    npx @mermaid-js/mermaid-cli -i "$output_file_mmd" -o "$output_file_svg"
}

# ダイアグラム生成の呼び出し
generate_diagram "--direction TD" "my_targets" true
generate_diagram "--direction TD --test" "test_targets" true
generate_diagram "--direction TD --product" "library_targets" true
generate_diagram "--direction TD --test --product" "all_targets" true

# ここからファイルコピーと追記の処理

# ファイルパスの定義
source_file="$mermaid_output_path/my_targets.mmd"
destination_file="$mermaid_output_path/my_targets_with_app.mmd"

# 追記する内容
append_content="
    UICatalogLayer-->PresentationLayer
    DevelopmentApp([Development App])-->PresentationLayer
    StagingApp([Staging App])-->PresentationLayer
    StagingApp([Staging App])-->DependencyInjectionLayer
    ProductionApp([Production App])-->PresentationLayer
    ProductionApp([Production App])-->DependencyInjectionLayer
    UICatalogApp([UICatalog App])-->UICatalogLayer
"

# コピー処理
cp "$source_file" "$destination_file"

# ファイルの下に追記
echo "$append_content" >> "$destination_file"

# コピー後のファイルに対して Mermaid CLI を使って SVG 画像を生成
generate_diagram "" "my_targets_with_app" false
```

このスクリプトでは、`generate_diagram` 関数に `generate_mermaid` フラグを追加し、`swift package` コマンドの実行を制御しています。また、`mermaid_output_path` 変数を使用してファイルパスを定義し、コピーおよび追記後にMermaid CLIを使ってSVG画像を生成しています。

---

## 👤 ユーザー
*2024/6/18 15:03:56*

デフォルト引数や引数名の設定などはできないか？少し可読性が悪い。

---

## 🤖 アシスタント
*2024/6/18 15:04:34*

以下は、デフォルト引数を使用して可読性を向上させたスクリプトです。これにより、関数呼び出し時の可読性が向上します。

```bash
#!/bin/bash

# Mermaidダイアグラム生成用関数
tools_package="./SmallTalkPackage"
mermaid_output_path="./asset/mermaid"
image_output_path="./asset/image"

generate_diagram() {
    local input_options=${1:-}
    local output_base=${2}
    local generate_mermaid=${3:-true}
    local output_file_mmd="$mermaid_output_path/${output_base}.mmd"
    local output_file_svg="$image_output_path/${output_base}.svg"

    if [ "$generate_mermaid" = true ]; then
        # Swift Package Plugin を使って mermaid ファイルを生成
        swift package --package-path $tools_package plugin depermaid $input_options > "$output_file_mmd"

        # 最初の1行と最後の2行を削除
        sed -i '' '1d' "$output_file_mmd"
        sed -i '' '$d' "$output_file_mmd"
        sed -i '' '$d' "$output_file_mmd"
    fi

    # Mermaid CLI を使って SVG 画像を生成
    npx @mermaid-js/mermaid-cli -i "$output_file_mmd" -o "$output_file_svg"
}

# ダイアグラム生成の呼び出し
generate_diagram "--direction TD" "my_targets"
generate_diagram "--direction TD --test" "test_targets"
generate_diagram "--direction TD --product" "library_targets"
generate_diagram "--direction TD --test --product" "all_targets"

# ここからファイルコピーと追記の処理

# ファイルパスの定義
source_file="$mermaid_output_path/my_targets.mmd"
destination_file="$mermaid_output_path/my_targets_with_app.mmd"

# 追記する内容
append_content="
    UICatalogLayer-->PresentationLayer
    DevelopmentApp([Development App])-->PresentationLayer
    StagingApp([Staging App])-->PresentationLayer
    StagingApp([Staging App])-->DependencyInjectionLayer
    ProductionApp([Production App])-->PresentationLayer
    ProductionApp([Production App])-->DependencyInjectionLayer
    UICatalogApp([UICatalog App])-->UICatalogLayer
"

# コピー処理
cp "$source_file" "$destination_file"

# ファイルの下に追記
echo "$append_content" >> "$destination_file"

# コピー後のファイルに対して Mermaid CLI を使って SVG 画像を生成
generate_diagram "" "my_targets_with_app" false
```

このスクリプトでは、`generate_diagram` 関数のデフォルト引数を使用して、`generate_mermaid` のデフォルト値を `true` に設定し、必要に応じてオプションを省略できるようにしました。これにより、関数呼び出し時の可読性が向上しています。

---

## 👤 ユーザー
*2024/6/18 15:05:15*

引数名の設定はできないのか？

---

## 🤖 アシスタント
*2024/6/18 15:05:39*

引数名を指定して関数を呼び出すことで、可読性を向上させる方法をご提案します。以下のスクリプトでは、`generate_diagram` 関数を名前付き引数として呼び出すように変更しています。

```bash
#!/bin/bash

# Mermaidダイアグラム生成用関数
tools_package="./SmallTalkPackage"
mermaid_output_path="./asset/mermaid"
image_output_path="./asset/image"

generate_diagram() {
    local input_options="${1:-}"
    local output_base="${2}"
    local generate_mermaid="${3:-true}"
    local output_file_mmd="$mermaid_output_path/${output_base}.mmd"
    local output_file_svg="$image_output_path/${output_base}.svg"

    if [ "$generate_mermaid" = true ]; then
        # Swift Package Plugin を使って mermaid ファイルを生成
        swift package --package-path $tools_package plugin depermaid $input_options > "$output_file_mmd"

        # 最初の1行と最後の2行を削除
        sed -i '' '1d' "$output_file_mmd"
        sed -i '' '$d' "$output_file_mmd"
        sed -i '' '$d' "$output_file_mmd"
    fi

    # Mermaid CLI を使って SVG 画像を生成
    npx @mermaid-js/mermaid-cli -i "$output_file_mmd" -o "$output_file_svg"
}

# ダイアグラム生成の呼び出し
generate_diagram input_options="--direction TD" output_base="my_targets"
generate_diagram input_options="--direction TD --test" output_base="test_targets"
generate_diagram input_options="--direction TD --product" output_base="library_targets"
generate_diagram input_options="--direction TD --test --product" output_base="all_targets"

# ここからファイルコピーと追記の処理

# ファイルパスの定義
source_file="$mermaid_output_path/my_targets.mmd"
destination_file="$mermaid_output_path/my_targets_with_app.mmd"

# 追記する内容
append_content="
    UICatalogLayer-->PresentationLayer
    DevelopmentApp([Development App])-->PresentationLayer
    StagingApp([Staging App])-->PresentationLayer
    StagingApp([Staging App])-->DependencyInjectionLayer
    ProductionApp([Production App])-->PresentationLayer
    ProductionApp([Production App])-->DependencyInjectionLayer
    UICatalogApp([UICatalog App])-->UICatalogLayer
"

# コピー処理
cp "$source_file" "$destination_file"

# ファイルの下に追記
echo "$append_content" >> "$destination_file"

# コピー後のファイルに対して Mermaid CLI を使って SVG 画像を生成
generate_diagram output_base="my_targets_with_app" generate_mermaid=false
```

このスクリプトでは、`generate_diagram` 関数の引数を名前付き引数として渡すことで、可読性を向上させています。これにより、各引数が何を意味するのかが明確になり、スクリプトの可読性が向上します。

---

## 👤 ユーザー
*2024/6/18 15:06:35*

やっぱりデフォルト引数は使わなくていいや

---

## 🤖 アシスタント
*2024/6/18 15:06:58*

了解しました。以下は、デフォルト引数を使わず、引数名を設定して可読性を向上させたスクリプトです。

```bash
#!/bin/bash

# Mermaidダイアグラム生成用関数
tools_package="./SmallTalkPackage"
mermaid_output_path="./asset/mermaid"
image_output_path="./asset/image"

generate_diagram() {
    local input_options=$1
    local output_base=$2
    local generate_mermaid=$3
    local output_file_mmd="$mermaid_output_path/${output_base}.mmd"
    local output_file_svg="$image_output_path/${output_base}.svg"

    if [ "$generate_mermaid" = true ]; then
        # Swift Package Plugin を使って mermaid ファイルを生成
        swift package --package-path $tools_package plugin depermaid $input_options > "$output_file_mmd"

        # 最初の1行と最後の2行を削除
        sed -i '' '1d' "$output_file_mmd"
        sed -i '' '$d' "$output_file_mmd"
        sed -i '' '$d' "$output_file_mmd"
    fi

    # Mermaid CLI を使って SVG 画像を生成
    npx @mermaid-js/mermaid-cli -i "$output_file_mmd" -o "$output_file_svg"
}

# ダイアグラム生成の呼び出し
generate_diagram "--direction TD" "my_targets" true
generate_diagram "--direction TD --test" "test_targets" true
generate_diagram "--direction TD --product" "library_targets" true
generate_diagram "--direction TD --test --product" "all_targets" true

# ここからファイルコピーと追記の処理

# ファイルパスの定義
source_file="$mermaid_output_path/my_targets.mmd"
destination_file="$mermaid_output_path/my_targets_with_app.mmd"

# 追記する内容
append_content="
    UICatalogLayer-->PresentationLayer
    DevelopmentApp([Development App])-->PresentationLayer
    StagingApp([Staging App])-->PresentationLayer
    StagingApp([Staging App])-->DependencyInjectionLayer
    ProductionApp([Production App])-->PresentationLayer
    ProductionApp([Production App])-->DependencyInjectionLayer
    UICatalogApp([UICatalog App])-->UICatalogLayer
"

# コピー処理
cp "$source_file" "$destination_file"

# ファイルの下に追記
echo "$append_content" >> "$destination_file"

# コピー後のファイルに対して Mermaid CLI を使って SVG 画像を生成
generate_diagram "" "my_targets_with_app" false
```

このスクリプトでは、`generate_diagram` 関数の引数名を明示的に設定し、可読性を向上させています。デフォルト引数は使用せず、すべての引数を関数呼び出し時に渡しています。

---

## 👤 ユーザー
*2024/6/18 15:07:16*

引数名の設定だけしたい。

---

## 🤖 アシスタント
*2024/6/18 15:07:44*

了解しました。以下のスクリプトでは、引数名を設定して関数を呼び出しています。

```bash
#!/bin/bash

# Mermaidダイアグラム生成用関数
tools_package="./SmallTalkPackage"
mermaid_output_path="./asset/mermaid"
image_output_path="./asset/image"

generate_diagram() {
    local input_options=$1
    local output_base=$2
    local generate_mermaid=$3
    local output_file_mmd="$mermaid_output_path/${output_base}.mmd"
    local output_file_svg="$image_output_path/${output_base}.svg"

    if [ "$generate_mermaid" = true ]; then
        # Swift Package Plugin を使って mermaid ファイルを生成
        swift package --package-path $tools_package plugin depermaid $input_options > "$output_file_mmd"

        # 最初の1行と最後の2行を削除
        sed -i '' '1d' "$output_file_mmd"
        sed -i '' '$d' "$output_file_mmd"
        sed -i '' '$d' "$output_file_mmd"
    fi

    # Mermaid CLI を使って SVG 画像を生成
    npx @mermaid-js/mermaid-cli -i "$output_file_mmd" -o "$output_file_svg"
}

# ダイアグラム生成の呼び出し
generate_diagram input_options="--direction TD" output_base="my_targets" generate_mermaid=true
generate_diagram input_options="--direction TD --test" output_base="test_targets" generate_mermaid=true
generate_diagram input_options="--direction TD --product" output_base="library_targets" generate_mermaid=true
generate_diagram input_options="--direction TD --test --product" output_base="all_targets" generate_mermaid=true

# ここからファイルコピーと追記の処理

# ファイルパスの定義
source_file="$mermaid_output_path/my_targets.mmd"
destination_file="$mermaid_output_path/my_targets_with_app.mmd"

# 追記する内容
append_content="
    UICatalogLayer-->PresentationLayer
    DevelopmentApp([Development App])-->PresentationLayer
    StagingApp([Staging App])-->PresentationLayer
    StagingApp([Staging App])-->DependencyInjectionLayer
    ProductionApp([Production App])-->PresentationLayer
    ProductionApp([Production App])-->DependencyInjectionLayer
    UICatalogApp([UICatalog App])-->UICatalogLayer
"

# コピー処理
cp "$source_file" "$destination_file"

# ファイルの下に追記
echo "$append_content" >> "$destination_file"

# コピー後のファイルに対して Mermaid CLI を使って SVG 画像を生成
generate_diagram input_options="" output_base="my_targets_with_app" generate_mermaid=false
```

このスクリプトでは、`generate_diagram` 関数を名前付き引数で呼び出すようにしました。これにより、各引数が何を意味するのかが明確になり、スクリプトの可読性が向上します。

---

## 👤 ユーザー
*2024/6/18 15:18:04*

これだと改行が入ってしまう

# 追記する内容
append_content="
    UICatalogLayer--&gt;PresentationLayer
    DevelopmentApp([Development App])--&gt;PresentationLayer
    StagingApp([Staging App])--&gt;PresentationLayer
    StagingApp([Staging App])--&gt;DependencyInjectionLayer
    ProductionApp([Production App])--&gt;PresentationLayer
    ProductionApp([Production App])--&gt;DependencyInjectionLayer
    UICatalogApp([UICatalog App])--&gt;UICatalogLayer
"

---

## 🤖 アシスタント
*2024/6/18 15:18:28*

改行が入らないようにするために、`append_content` を単一行で定義します。以下のスクリプトは、引数名を設定し、改行が入らないように `append_content` を修正しています。

```bash
#!/bin/bash

# Mermaidダイアグラム生成用関数
tools_package="./SmallTalkPackage"
mermaid_output_path="./asset/mermaid"
image_output_path="./asset/image"

generate_diagram() {
    local input_options=$1
    local output_base=$2
    local generate_mermaid=$3
    local output_file_mmd="$mermaid_output_path/${output_base}.mmd"
    local output_file_svg="$image_output_path/${output_base}.svg"

    if [ "$generate_mermaid" = true ]; then
        # Swift Package Plugin を使って mermaid ファイルを生成
        swift package --package-path $tools_package plugin depermaid $input_options > "$output_file_mmd"

        # 最初の1行と最後の2行を削除
        sed -i '' '1d' "$output_file_mmd"
        sed -i '' '$d' "$output_file_mmd"
        sed -i '' '$d' "$output_file_mmd"
    fi

    # Mermaid CLI を使って SVG 画像を生成
    npx @mermaid-js/mermaid-cli -i "$output_file_mmd" -o "$output_file_svg"
}

# ダイアグラム生成の呼び出し
generate_diagram input_options="--direction TD" output_base="my_targets" generate_mermaid=true
generate_diagram input_options="--direction TD --test" output_base="test_targets" generate_mermaid=true
generate_diagram input_options="--direction TD --product" output_base="library_targets" generate_mermaid=true
generate_diagram input_options="--direction TD --test --product" output_base="all_targets" generate_mermaid=true

# ここからファイルコピーと追記の処理

# ファイルパスの定義
source_file="$mermaid_output_path/my_targets.mmd"
destination_file="$mermaid_output_path/my_targets_with_app.mmd"

# 追記する内容
append_content="    UICatalogLayer-->PresentationLayer
    DevelopmentApp([Development App])-->PresentationLayer
    StagingApp([Staging App])-->PresentationLayer
    StagingApp([Staging App])-->DependencyInjectionLayer
    ProductionApp([Production App])-->PresentationLayer
    ProductionApp([Production App])-->DependencyInjectionLayer
    UICatalogApp([UICatalog App])-->UICatalogLayer
"

# コピー処理
cp "$source_file" "$destination_file"

# ファイルの下に追記
echo "$append_content" >> "$destination_file"

# コピー後のファイルに対して Mermaid CLI を使って SVG 画像を生成
generate_diagram input_options="" output_base="my_targets_with_app" generate_mermaid=false
```

このスクリプトでは、`append_content` を単一行で定義し、追記する内容が改行なしで `destination_file` に追加されるようにしています。

---

## 👤 ユーザー
*2024/6/18 15:18:34*

もっとスマートな書き方ないの？

---

## 🤖 アシスタント
*2024/6/18 15:19:00*

もっとスマートに書くために、スクリプトの構成を簡潔にし、可読性を高める方法をご提案します。`append_content` をスマートに追加し、冗長な部分を減らしました。

```bash
#!/bin/bash

# Mermaidダイアグラム生成用関数
tools_package="./SmallTalkPackage"
mermaid_output_path="./asset/mermaid"
image_output_path="./asset/image"

generate_diagram() {
    local input_options=$1
    local output_base=$2
    local generate_mermaid=$3
    local output_file_mmd="$mermaid_output_path/${output_base}.mmd"
    local output_file_svg="$image_output_path/${output_base}.svg"

    if [ "$generate_mermaid" = true ]; then
        # Swift Package Plugin を使って mermaid ファイルを生成
        swift package --package-path $tools_package plugin depermaid "$input_options" > "$output_file_mmd"

        # 最初の1行と最後の2行を削除
        sed -i '' '1d;$d;$d' "$output_file_mmd"
    fi

    # Mermaid CLI を使って SVG 画像を生成
    npx @mermaid-js/mermaid-cli -i "$output_file_mmd" -o "$output_file_svg"
}

# ダイアグラム生成の呼び出し
generate_diagram "--direction TD" "my_targets" true
generate_diagram "--direction TD --test" "test_targets" true
generate_diagram "--direction TD --product" "library_targets" true
generate_diagram "--direction TD --test --product" "all_targets" true

# ファイルパスの定義
source_file="$mermaid_output_path/my_targets.mmd"
destination_file="$mermaid_output_path/my_targets_with_app.mmd"

# 追記する内容
append_content=$(
    cat <<'EOF'
    UICatalogLayer-->PresentationLayer
    DevelopmentApp([Development App])-->PresentationLayer
    StagingApp([Staging App])-->PresentationLayer
    StagingApp([Staging App])-->DependencyInjectionLayer
    ProductionApp([Production App])-->PresentationLayer
    ProductionApp([Production App])-->DependencyInjectionLayer
    UICatalogApp([UICatalog App])-->UICatalogLayer
EOF
)

# コピー処理と追記
cp "$source_file" "$destination_file"
echo "$append_content" >> "$destination_file"

# コピー後のファイルに対して Mermaid CLI を使って SVG 画像を生成
generate_diagram "" "my_targets_with_app" false
```

### 説明

1. **`generate_diagram` 関数**:
   - `input_options`, `output_base`, `generate_mermaid` の引数を受け取ります。
   - `swift package` コマンドの実行を制御し、`sed` コマンドを一行にまとめました。

2. **内容を追加する部分**:
   - `append_content` をスマートに追加するために、ヒアドキュメントを使用しました。これにより、改行を含む文字列を簡潔に定義できます。

3. **ファイル操作**:
   - ファイルのコピーと追記をシンプルに行います。

このスクリプトにより、可読性が向上し、冗長な部分が削減されます。

---

## 👤 ユーザー
*2024/6/18 15:24:30*

my_targets.mmd で my_targets_with_app.mmd を行なったのと同様に
library_targets で　library_targets_with_app を行いたい。そしてなるべく処理を共通化したい。

#!/bin/bash

tools_package="./SmallTalkPackage"
mermaid_output_path="./asset/mermaid"
image_output_path="./asset/image"

generate_diagram() {
    local input_options=$1
    local output_base=$2
    local generate_mermaid=$3

    local output_file_mmd="$mermaid_output_path/${output_base}.mmd"
    local output_file_svg="$image_output_path/${output_base}.svg"

    if [ "$generate_mermaid" = true ]; then
        # Swift Package Plugin を使って mermaid ファイルを生成
        swift package --package-path $tools_package plugin depermaid $input_options &gt; "$output_file_mmd"

        # 最初の1行と最後の2行を削除
        sed -i '' '1d' "$output_file_mmd"
        sed -i '' '$d' "$output_file_mmd"
        sed -i '' '$d' "$output_file_mmd"
    fi

    # Mermaid CLI を使って SVG 画像を生成
    npx @mermaid-js/mermaid-cli -i "$output_file_mmd" -o "$output_file_svg"
}

# ダイアグラム生成の呼び出し
generate_diagram "--direction TD" "my_targets" true
generate_diagram "--direction TD --test" "test_targets" true
generate_diagram "--direction TD --product" "library_targets" true
generate_diagram "--direction TD --test --product" "all_targets" true

# ここからファイルコピーと追記の処理

# ファイルパスの定義
source_file="$mermaid_output_path/my_targets.mmd"
destination_file="$mermaid_output_path/my_targets_with_app.mmd"

# 追記する内容
append_content="    UICatalogLayer--&gt;PresentationLayer
    DevelopmentApp([Development App])--&gt;PresentationLayer
    StagingApp([Staging App])--&gt;PresentationLayer
    StagingApp([Staging App])--&gt;DependencyInjectionLayer
    ProductionApp([Production App])--&gt;PresentationLayer
    ProductionApp([Production App])--&gt;DependencyInjectionLayer
    UICatalogApp([UICatalog App])--&gt;UICatalogLayer
"

# コピー処理
cp -p "$source_file" "$destination_file"

# ファイルの下に追記
echo "$append_content" &gt;&gt; "$destination_file"
sed -i '' '$d' "$destination_file"

# コピー後のファイルに対して Mermaid CLI を使って SVG 画像を生成
generate_diagram "" "my_targets_with_app" false

---

## 🤖 アシスタント
*2024/6/18 15:25:04*

以下は、`my_targets` と `library_targets` の両方で同様の操作を行い、処理を共通化したスクリプトです。このスクリプトは、共通部分を関数にまとめ、再利用可能なコードにしています。

```bash
#!/bin/bash

tools_package="./SmallTalkPackage"
mermaid_output_path="./asset/mermaid"
image_output_path="./asset/image"

generate_diagram() {
    local input_options=$1
    local output_base=$2
    local generate_mermaid=$3

    local output_file_mmd="$mermaid_output_path/${output_base}.mmd"
    local output_file_svg="$image_output_path/${output_base}.svg"

    if [ "$generate_mermaid" = true ]; then
        # Swift Package Plugin を使って mermaid ファイルを生成
        swift package --package-path $tools_package plugin depermaid $input_options > "$output_file_mmd"

        # 最初の1行と最後の2行を削除
        sed -i '' '1d' "$output_file_mmd"
        sed -i '' '$d' "$output_file_mmd"
        sed -i '' '$d' "$output_file_mmd"
    fi

    # Mermaid CLI を使って SVG 画像を生成
    npx @mermaid-js/mermaid-cli -i "$output_file_mmd" -o "$output_file_svg"
}

copy_and_append() {
    local source_file=$1
    local destination_file=$2

    # 追記する内容
    local append_content="    UICatalogLayer-->PresentationLayer
    DevelopmentApp([Development App])-->PresentationLayer
    StagingApp([Staging App])-->PresentationLayer
    StagingApp([Staging App])-->DependencyInjectionLayer
    ProductionApp([Production App])-->PresentationLayer
    ProductionApp([Production App])-->DependencyInjectionLayer
    UICatalogApp([UICatalog App])-->UICatalogLayer
    "

    # コピー処理
    cp -p "$source_file" "$destination_file"

    # ファイルの下に追記
    echo "$append_content" >> "$destination_file"
}

# ダイアグラム生成の呼び出し
generate_diagram "--direction TD" "my_targets" true
generate_diagram "--direction TD --test" "test_targets" true
generate_diagram "--direction TD --product" "library_targets" true
generate_diagram "--direction TD --test --product" "all_targets" true

# my_targets.mmd のコピーと追記
copy_and_append "$mermaid_output_path/my_targets.mmd" "$mermaid_output_path/my_targets_with_app.mmd"

# my_targets_with_app.mmd に対して Mermaid CLI を使って SVG 画像を生成
generate_diagram "" "my_targets_with_app" false

# library_targets.mmd のコピーと追記
copy_and_append "$mermaid_output_path/library_targets.mmd" "$mermaid_output_path/library_targets_with_app.mmd"

# library_targets_with_app.mmd に対して Mermaid CLI を使って SVG 画像を生成
generate_diagram "" "library_targets_with_app" false
```

### 説明

1. **`generate_diagram` 関数**:
   - 指定されたオプションでMermaidファイルを生成し、SVG画像を作成します。

2. **`copy_and_append` 関数**:
   - ファイルをコピーし、指定された内容をファイルの末尾に追記します。

3. **メインの処理**:
   - `generate_diagram` 関数を使ってダイアグラムを生成します。
   - `my_targets.mmd` と `library_targets.mmd` をそれぞれ `my_targets_with_app.mmd` および `library_targets_with_app.mmd` にコピーし、内容を追記します。
   - コピーおよび追記後のファイルに対して再度Mermaid CLIを使ってSVG画像を生成します。

このスクリプトにより、処理が共通化され、重複を避けてコードの可読性と保守性が向上します。

---

## 👤 ユーザー
*2024/6/18 15:25:34*

generate_diagram の処理も共通化できないのか？

---
