# Run Xcode tests & check snapshots

日付: 2024-07-17

---

## 👤 ユーザー
*2024/7/17 13:12:05*

以下のディレクトリを削除して、

./SmallTalkPackage/Tests/ViewSnapshotTest/\_\_Snapshots\_\_

xcodebuild test -scheme ViewSnapshotTest -destination 'platform=iOS Simulator,name=iPhone 15'

の実行を行い

以下のディレクトリについて、git上での変更がないか調べて

./SmallTalkPackage/Tests/ViewSnapshotTest/\_\_Snapshots\_\_

変更があれば、それを、なければ成功のようなスクリプトを書いてほしい

---

## 🤖 アシスタント
*2024/7/17 13:12:16*

以下のスクリプトは、指定されたディレクトリを削除し、Xcodeのテストを実行し、変更があるかどうかをチェックして、結果を出力します。

```bash
#!/bin/bash

# 指定されたディレクトリを削除
SNAPSHOTS_DIR="./SmallTalkPackage/Tests/ViewSnapshotTest/__Snapshots__"
if [ -d "$SNAPSHOTS_DIR" ]; then
  rm -rf "$SNAPSHOTS_DIR"
  echo "Deleted directory: $SNAPSHOTS_DIR"
else
  echo "Directory not found: $SNAPSHOTS_DIR"
fi

# Xcodeのテストを実行
xcodebuild test -scheme ViewSnapshotTest -destination 'platform=iOS Simulator,name=iPhone 15'
if [ $? -ne 0 ]; then
  echo "Xcode tests failed."
  exit 1
fi

# gitのステータスを確認して変更があるかどうかをチェック
git_status=$(git status --porcelain "$SNAPSHOTS_DIR")

if [ -n "$git_status" ]; then
  echo "There are changes in the snapshots directory:"
  echo "$git_status"
else
  echo "No changes detected. Tests successful."
fi
```

このスクリプトを以下のように保存して実行してください。

1. スクリプトを `run_tests.sh` という名前で保存します。
2. ターミナルを開いてスクリプトのあるディレクトリに移動します。
3. スクリプトに実行権限を付与します。
   ```bash
   chmod +x run_tests.sh
   ```
4. スクリプトを実行します。
   ```bash
   ./run_tests.sh
   ```

スクリプトが正常に動作する場合、指定されたディレクトリが削除され、Xcodeのテストが実行され、スナップショットディレクトリに変更があるかどうかがチェックされます。変更があれば、その内容が表示され、なければ成功メッセージが表示されます。

---

## 👤 ユーザー
*2024/7/17 13:12:32*

SNAPSHOTS\_DIR は 小文字にしてほしい

---

## 🤖 アシスタント
*2024/7/17 13:12:38*

以下のスクリプトでは、`SNAPSHOTS_DIR` を小文字に変更しました。

```bash
#!/bin/bash

# 指定されたディレクトリを削除
snapshots_dir="./SmallTalkPackage/Tests/ViewSnapshotTest/__Snapshots__"
if [ -d "$snapshots_dir" ]; then
  rm -rf "$snapshots_dir"
  echo "Deleted directory: $snapshots_dir"
else
  echo "Directory not found: $snapshots_dir"
fi

# Xcodeのテストを実行
xcodebuild test -scheme ViewSnapshotTest -destination 'platform=iOS Simulator,name=iPhone 15'
if [ $? -ne 0 ]; then
  echo "Xcode tests failed."
  exit 1
fi

# gitのステータスを確認して変更があるかどうかをチェック
git_status=$(git status --porcelain "$snapshots_dir")

if [ -n "$git_status" ]; then
  echo "There are changes in the snapshots directory:"
  echo "$git_status"
else
  echo "No changes detected. Tests successful."
fi
```

このスクリプトを再度実行する手順は前回と同様です。 `run_tests.sh` という名前で保存し、ターミナルで実行権限を付与した後、実行してください。

---

## 👤 ユーザー
*2024/7/17 13:14:57*

以下のコマンドの出力を少なくしたい

xcodebuild test -scheme ViewSnapshotTest -destination 'platform=iOS Simulator,name=iPhone 15'

---

## 🤖 アシスタント
*2024/7/17 13:15:07*

`xcodebuild` コマンドの出力を少なくするには、`-quiet` フラグを使用してビルドの出力を抑制することができます。また、特定の部分だけを表示するようにフィルタリングすることもできます。以下はそのためのスクリプトです。

```bash
#!/bin/bash

# 指定されたディレクトリを削除
snapshots_dir="./SmallTalkPackage/Tests/ViewSnapshotTest/__Snapshots__"
if [ -d "$snapshots_dir" ]; then
  rm -rf "$snapshots_dir"
  echo "Deleted directory: $snapshots_dir"
else
  echo "Directory not found: $snapshots_dir"
fi

# Xcodeのテストを実行して出力を抑制
xcodebuild test -scheme ViewSnapshotTest -destination 'platform=iOS Simulator,name=iPhone 15' -quiet | grep -E "Test (Suite|Case)|error:"

# テストの終了ステータスを確認
if [ $? -ne 0 ]; then
  echo "Xcode tests failed."
  exit 1
fi

# gitのステータスを確認して変更があるかどうかをチェック
git_status=$(git status --porcelain "$snapshots_dir")

if [ -n "$git_status" ]; then
  echo "There are changes in the snapshots directory:"
  echo "$git_status"
else
  echo "No changes detected. Tests successful."
fi
```

このスクリプトでは、`xcodebuild` コマンドの出力を `-quiet` フラグで抑制し、`grep` を使って必要な情報だけを表示するようにしています。この方法で、テストの実行結果に関する必要最低限の情報だけを出力することができます。

---

## 👤 ユーザー
*2024/7/17 13:18:10*

インデントを4にしてほしい

#!/bin/sh

# 指定されたディレクトリを削除
snapshots\_dir="./SmallTalkPackage/Tests/ViewSnapshotTest/\_\_Snapshots\_\_"

if \[ -d "$snapshots\_dir" \]; then
  rm -rf "$snapshots\_dir"
  echo "Deleted directory: $snapshots\_dir"
else
  echo "Directory not found: $snapshots\_dir"
fi

# Xcodeのテストを実行して出力を抑制
xcodebuild test -scheme ViewSnapshotTest -destination 'platform=iOS Simulator,name=iPhone 15' -quiet | grep -E "Test (Suite|Case)|error:"

# テストの終了ステータスを確認
if \[ $? -ne 0 \]; then
  echo "Xcode tests failed."
  exit 1
fi

# gitのステータスを確認して変更があるかどうかをチェック
git\_status=$(git status --porcelain "$snapshots\_dir")

if \[ -n "$git\_status" \]; then
  echo "There are changes in the snapshots directory:"
  echo "$git\_status"
else
  echo "No changes detected. Tests successful."
fi

---

## 🤖 アシスタント
*2024/7/17 13:18:16*

インデントを4にしたスクリプトは以下の通りです。

```sh
#!/bin/sh

# 指定されたディレクトリを削除
snapshots_dir="./SmallTalkPackage/Tests/ViewSnapshotTest/__Snapshots__"

if [ -d "$snapshots_dir" ]; then
    rm -rf "$snapshots_dir"
    echo "Deleted directory: $snapshots_dir"
else
    echo "Directory not found: $snapshots_dir"
fi

# Xcodeのテストを実行して出力を抑制
xcodebuild test -scheme ViewSnapshotTest -destination 'platform=iOS Simulator,name=iPhone 15' -quiet | grep -E "Test (Suite|Case)|error:"

# テストの終了ステータスを確認
if [ $? -ne 0 ]; then
    echo "Xcode tests failed."
    exit 1
fi

# gitのステータスを確認して変更があるかどうかをチェック
git_status=$(git status --porcelain "$snapshots_dir")

if [ -n "$git_status" ]; then
    echo "There are changes in the snapshots directory:"
    echo "$git_status"
else
    echo "No changes detected. Tests successful."
fi
```

---

## 👤 ユーザー
*2024/7/17 13:21:59*

ちなみにエラーの場合と成功の場合で何かわかりやすくアイコンを設定してほしい

#!/bin/sh

# 指定されたディレクトリを削除
snapshots\_dir="./SmallTalkPackage/Tests/ViewSnapshotTest/\_\_Snapshots\_\_"

if \[ -d "$snapshots\_dir" \]; then
    rm -rf "$snapshots\_dir"
    echo "Deleted directory: $snapshots\_dir"
else
    echo "Directory not found: $snapshots\_dir"
fi

# Xcodeのテストを実行して出力を抑制
xcodebuild test -scheme ViewSnapshotTest -destination 'platform=iOS Simulator,name=iPhone 15' -quiet

# テストの終了ステータスを確認
if \[ $? -ne 0 \]; then
    echo "Xcode tests failed."
    exit 1
fi

# gitのステータスを確認して変更があるかどうかをチェック
git\_status=$(git status --porcelain "$snapshots\_dir")

if \[ -n "$git\_status" \]; then
    echo "There are changes in the snapshots directory:"
    echo "$git\_status"
else
    echo "No changes detected. Tests successful."
fi

---

## 🤖 アシスタント
*2024/7/17 13:22:06*

エラーの場合と成功の場合でわかりやすくアイコンを表示するようにスクリプトを修正しました。

```sh
#!/bin/sh

# 指定されたディレクトリを削除
snapshots_dir="./SmallTalkPackage/Tests/ViewSnapshotTest/__Snapshots__"

if [ -d "$snapshots_dir" ]; then
    rm -rf "$snapshots_dir"
    echo "🗑️ Deleted directory: $snapshots_dir"
else
    echo "❌ Directory not found: $snapshots_dir"
fi

# Xcodeのテストを実行して出力を抑制
xcodebuild test -scheme ViewSnapshotTest -destination 'platform=iOS Simulator,name=iPhone 15' -quiet

# テストの終了ステータスを確認
if [ $? -ne 0 ]; then
    echo "❌ Xcode tests failed."
    exit 1
fi

# gitのステータスを確認して変更があるかどうかをチェック
git_status=$(git status --porcelain "$snapshots_dir")

if [ -n "$git_status" ]; then
    echo "⚠️ There are changes in the snapshots directory:"
    echo "$git_status"
else
    echo "✅ No changes detected. Tests successful."
fi
```

このスクリプトでは、削除やエラー、成功の各ステップで対応するアイコンが表示されます。

---
