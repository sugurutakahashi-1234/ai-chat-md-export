# SwiftFormat ファイル変更回避

日付: 2023-05-03

---

## 👤 ユーザー
*2023/5/4 2:26:03*

https://github.com/nicklockwood/SwiftFormat のツールを使うとファイルが変更されてしまうが、変更をかけずに、変更対象のファイルを知る方法をおしえてほしい

---

## 🤖 アシスタント
*2023/5/4 2:27:05*

SwiftFormatは、Swiftコードを自動的に整形してくれるツールです。デフォルトでは、実際にファイルを変更しますが、変更をかけずに変更対象のファイルを知りたい場合は、コマンドラインオプションを使って動作を変更できます。

次の手順で、変更が必要なファイルのリストを取得できます。

1. ターミナルを開きます。
2. SwiftFormatをインストールしていない場合は、次のコマンドでインストールしてください。
```
brew install swiftformat
```

3. コマンドラインオプション `--dryrun` を使用して、実際に変更を加えずに変更が必要なファイルを知ることができます。以下のコマンドを実行してください。
```
swiftformat --dryrun /path/to/your/swift/project
```

このコマンドは、整形が必要なファイルを列挙して、ターミナルに表示します。`/path/to/your/swift/project`は、実際のプロジェクトのパスに置き換えてください。

`--dryrun`オプションを使用すると、SwiftFormatは実際にファイルを変更せずに、どのファイルが変更されるかを知ることができます。これにより、事前にファイルの変更範囲を確認できます。

---

## 👤 ユーザー
*2023/5/4 2:28:24*

それをgithook の pre-commit 時に dryrun を実行して、変更が必要なファイルを出力したいんだけどどんなスクリプトを書けばいい

---

## 🤖 アシスタント
*2023/5/4 2:29:29*

Gitのpre-commitフックを使って、コミット時にSwiftFormatのdryrunを実行し、変更が必要なファイルを出力するには、以下の手順でpre-commitフックスクリプトを作成します。

1. ターミナルを開き、プロジェクトのルートディレクトリに移動します。
2. 次のコマンドを実行して、pre-commitフック用のファイルを作成します。
```
touch .git/hooks/pre-commit
```

3. 作成した`pre-commit`ファイルに実行権限を与えます。
```
chmod +x .git/hooks/pre-commit
```

4. お好みのテキストエディタで`.git/hooks/pre-commit`ファイルを開き、以下のスクリプトを貼り付けます。
```bash
#!/bin/sh

# Run SwiftFormat in dryrun mode
output=$(swiftformat --dryrun --verbose /path/to/your/swift/project)

# Check if any files need formatting
if [ -n "$output" ]; then
  echo "SwiftFormat: Some files need formatting:"
  echo "$output"
  echo "Please format your code using SwiftFormat before committing."
  exit 1
fi

# No issues, allow the commit
exit 0
```
このスクリプトでは、`/path/to/your/swift/project`を実際のプロジェクトのパスに置き換えてください。

5. 保存してファイルを閉じます。

これで、コミット時にpre-commitフックが実行され、SwiftFormatのdryrunが実行されます。もし変更が必要なファイルがある場合、コミットは中断され、ターミナルに該当ファイルのリストが表示されます。ファイルを修正して再度コミットを試みてください。

---

## 👤 ユーザー
*2023/5/4 2:30:04*

これをpost-commitでやるとどうなるの？

---

## 🤖 アシスタント
*2023/5/4 2:31:25*

post-commitフックを使用してSwiftFormatのdryrunを実行すると、コミットが完了した後にフォーマットが必要なファイルがあるかどうかをチェックします。ただし、post-commitフックではコミットを中断できないため、フォーマットが必要なファイルがある場合でも、そのままコミットが完了してしまいます。

それでもpost-commitフックでチェックしたい場合は、以下の手順で行ってください。

1. ターミナルを開き、プロジェクトのルートディレクトリに移動します。
2. 次のコマンドを実行して、post-commitフック用のファイルを作成します。
```
touch .git/hooks/post-commit
```

3. 作成した`post-commit`ファイルに実行権限を与えます。
```
chmod +x .git/hooks/post-commit
```

4. お好みのテキストエディタで`.git/hooks/post-commit`ファイルを開き、以下のスクリプトを貼り付けます。
```bash
#!/bin/sh

# Run SwiftFormat in dryrun mode
output=$(swiftformat --dryrun --verbose /path/to/your/swift/project)

# Check if any files need formatting
if [ -n "$output" ]; then
  echo "SwiftFormat: Some files need formatting:"
  echo "$output"
  echo "Please format your code using SwiftFormat and create a new commit."
fi
```
このスクリプトでは、`/path/to/your/swift/project`を実際のプロジェクトのパスに置き換えてください。

5. 保存してファイルを閉じます。

これで、コミット後にpost-commitフックが実行され、SwiftFormatのdryrunが実行されます。フォーマットが必要なファイルがある場合、ターミナルに該当ファイルのリストが表示されますが、コミットはそのまま完了してしまいます。そのため、フォーマットが必要なファイルがある場合は、手動で修正し、再度コミットを行う必要があります。

---
