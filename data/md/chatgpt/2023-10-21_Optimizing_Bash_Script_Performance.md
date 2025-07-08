# Optimizing Bash Script Performance

Date: 2023-10-21

---

## 👤 User
*2023-10-21 20:57:01*

このスクリプトの実行に時間がかかっている短縮する方法のアイディアはないかな？

#!/usr/bin/env bash

# Ref: SwiftFormatを導入してコード記法を統一化 - https://tech.mirrativ.stream/entry/2022/06/27/060850

# SwiftFormat のあるパッケージを指定する
tools_package="EmomilToolsPackage"

run_swiftformat() {
  command="swift run --package-path $tools_package swiftformat"
  command -v $command &gt;/dev/null 2&gt;&1
  if [ $? -gt 0 ]; then
    echo "😓 swiftformat コマンドが見つかりません。"
    exit 1
  fi
  $command "$@"
}

should_fail=false
staged_swift_files=$(git diff --diff-filter=d --staged --name-only | grep -e '\(.*\).swift$')

if [ -z "$staged_swift_files" ]; then
  # 変更された Swift ファイルが見つからない場合
  exit 0
fi

while read file; do
  # ステージングされていない変更のパッチを作成
  unstaged_patch=$(git diff "$file")
  if [ ! -z "$unstaged_patch" ]; then
    # ステージングされていない変更がある場合は削除
    git restore $file
  fi

  # SwiftFormat でステージングされた変更のみをチェック
  echo "👁 SwiftFormat: 確認中... $file"
  run_swiftformat --lint $file
  if [ $? -eq 0 ]; then
    if [ ! -z "$unstaged_patch" ]; then
      # パッチがある場合は適用して未ステージの変更を復元
      echo "$unstaged_patch" | git apply --whitespace=nowarn
    fi
    printf "\n"
    continue
  fi

  should_fail=true
  if [ ! -z "$unstaged_patch" ]; then
    # パッチがある場合は適用して未ステージの変更を復元
    echo "$unstaged_patch" | git apply --whitespace=nowarn
  fi

  # ファイルにSwiftFormatを適用（変更が適用されます）
  echo "🪬 SwiftFormat: 適用中... $file"
  run_swiftformat $file
  printf "\n"
done &lt;&lt;&lt; "$staged_swift_files"

if $should_fail; then
  echo "⛔️ SwiftFormatによってコードに変更が生じました。"
  echo "変更を取り入れるなどの対応をお願いします。"
  exit 1
fi

---

## 🤖 Assistant
*2023-10-21 20:57:36*

このスクリプトはGitのステージングされたSwiftファイルを検出し、それらにSwiftFormatを適用することを目的としています。パフォーマンスを改善するためのいくつかの一般的な提案は以下の通りです：

1. **並列処理の導入**:
   スクリプトは現在、一度に1つのファイルを処理しています。`xargs`や`parallel`などのツールを使って複数のファイルを並行して処理することで、パフォーマンスを向上させることができます。

   ```sh
   echo "$staged_swift_files" | xargs -I {} -P 4 bash -c 'your_function "{}"'
   ```
   ここで、`-P 4`は同時に実行されるプロセスの最大数を表しています。

2. **不要なGitコマンドの削減**:
   スクリプトは、各ファイルごとに複数のGitコマンドを実行しています。これには時間がかかる可能性があります。必要な情報を一度に取得し、それを変数に格納することで、コマンドの実行回数を減らすことができます。

3. **SwiftFormatコマンドの呼び出しの最適化**:
   `run_swiftformat`関数が各ファイルごとに新しいプロセスを起動しています。代わりに、複数のファイルを一度に処理するようにSwiftFormatを呼び出すことができます（もしSwiftFormatがそのような使用をサポートしている場合）。

4. **不要なエコーとプリントの削除**:
   これらはデバッグに役立つかもしれませんが、処理時間を増加させる可能性があります。特に、ループの中での出力は時間がかかる場合があります。

5. **条件分岐の最適化**:
   スクリプトの多くの部分で、同じ条件に基づいて複数のチェックが行われています。これらのチェックを単一の条件文に統合することで、スクリプトをシンプルに保ち、また少しのパフォーマンス向上が期待できます。

6. **事前チェックの導入**:
   スクリプトの早い段階で、必要なツールが利用可能かどうかをチェックし、そうでない場合は早期にスクリプトを終了させます。これにより、不必要な処理を避けることができます。

これらの変更を加えると、パフォーマンスが向上する可能性がありますが、具体的な改善点や最適化の度合いは、使用しているシステムやスクリプトが操作しているファイルの数など、さまざまな要因に依存します。変更を加える前に、現在のスクリプトのパフォーマンスをプロファイリングして、最も時間がかかっている部分を特定することをお勧めします。

---

## 👤 User
*2023-10-21 20:58:02*

具体的に教えて欲しい。なるべく変更の少ないものとかで改善できそうだったらそれを教えて欲しい、

---

## 🤖 Assistant
*2023-10-21 20:58:38*

了解しました。既存のコードに対する大規模な変更を避け、可能な限り単純な改善を行うことを念頭に置きます。以下に、パフォーマンス向上のためのいくつかの提案をします。

1. **`swiftformat` コマンドの確認を1回に限定**:
   現在、スクリプトは各ファイルを処理するたびに `swiftformat` コマンドが存在するかどうかを確認しています。これをスクリプトの開始時に1回だけ実行するように変更することで、少しの時間を節約できます。

   ```bash
   # スクリプトの開始部分でコマンドの存在をチェック
   command="swift run --package-path $tools_package swiftformat"
   command -v $command >/dev/null 2>&1
   if [ $? -gt 0 ]; then
     echo "😓 swiftformat コマンドが見つかりません。"
     exit 1
   fi

   run_swiftformat() {
     $command "$@"
   }
   ```

2. **ファイルへの `SwiftFormat` の適用をグループ化**:
   同時に複数のファイルに `SwiftFormat` を適用できる場合、処理を1回にまとめて実行時間を短縮できます。

   ```bash
   # すべてのステージングされたファイルに一括適用（もしSwiftFormatが複数ファイルをサポートしている場合）
   if [ -n "$staged_swift_files" ]; then
     echo "🪬 SwiftFormat: 適用中..."
     run_swiftformat $staged_swift_files
   fi
   ```

3. **不要なエコーの削除**:
   パフォーマンスへの影響は小さいかもしれませんが、不要なechoステートメントを削除することで、スクリプトの実行時間がわずかに短縮され、出力がクリーンになります。

これらの改善策は、既存のコード構造を大きく変更することなく、実行効率をいくらか向上させることを目指しています。しかし、これらの変更が顕著なパフォーマンス向上をもたらすかどうかは、実際の使用状況や処理されるファイルの数など、さまざまな要因に依存します。また、スクリプトの具体的な実行環境によっては、これらの提案が適切でない場合もありますので、変更を加える前に十分なテストを行うことをお勧めします。

---
