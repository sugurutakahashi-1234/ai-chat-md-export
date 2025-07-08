# Git Pull Fast-Forward Configuration.

日付: 2023-05-10

---

## 👤 ユーザー
*2023/05/10 12:17:54*

`git config --global pull.ff only`と実行したんだけど解除した

---

## 🤖 アシスタント
*2023/05/10 12:18:17*

`git config --global pull.ff only` は、git pull コマンドを実行する際に、fast-forward（高速転送）のみを許可するように設定します。これにより、履歴がリポジトリで分岐している場合、git pull が失敗するようになります。

この設定を解除するには、`git config` コマンドを使って、`pull.ff` をデフォルト値に戻す必要があります。デフォルトでは、`git pull` は fast-forward とマージが可能な場合にマージを行います。この設定を解除するには、次のコマンドを実行してください：

```
git config --global --unset pull.ff
```

これで、`pull.ff` の設定が解除され、デフォルトの挙動に戻ります。

---

## 👤 ユーザー
*2023/05/10 12:19:17*

From github.com:Viagate/emomil-app-ios
 * branch            feature/2-swift-format -&gt; FETCH_HEAD
hint: You have divergent branches and need to specify how to reconcile them.
hint: You can do so by running one of the following commands sometime before
hint: your next pull:
hint:
hint:   git config pull.rebase false  # merge
hint:   git config pull.rebase true   # rebase
hint:   git config pull.ff only       # fast-forward only
hint:
hint: You can replace "git config" with "git config --global" to set a default
hint: preference for all repositories. You can also pass --rebase, --no-rebase,
hint: or --ff-only on the command line to override the configured default per
hint: invocation.
fatal: Need to specify how to reconcile divergent branches.
というエラーが出たんだけどどうすればいい？

---

## 🤖 アシスタント
*2023/05/10 12:20:07*

このエラーメッセージは、ローカルブランチとリモートブランチが分岐しており、どのようにそれらを統合するか指定する必要があることを示しています。git がどの方法を使用してブランチを統合するかを設定するには、次の3つのオプションがあります。

1. マージ（merge）
2. リベース（rebase）
3. 高速転送（fast-forward only）

エラーメッセージで示されているように、git の設定を変更して、ブランチの統合方法を指定することができます。どの方法を選ぶかは、あなたの好みや開発チームのポリシーによって異なります。

1. マージを選ぶ場合:
```
git config pull.rebase false
```

2. リベースを選ぶ場合:
```
git config pull.rebase true
```

3. 高速転送のみを選ぶ場合:
```
git config pull.ff only
```

また、`--global` オプションを使用して、すべてのリポジトリに対するデフォルト設定を変更することもできます。たとえば、すべてのリポジトリでマージをデフォルトにするには、次のコマンドを実行します。

```
git config --global pull.rebase false
```

設定を変更した後、再度 `git pull` を実行して、ブランチを統合してください。また、`git pull` コマンドの際に `--rebase`, `--no-rebase`, または `--ff-only` オプションを使って、その時だけ設定を上書きすることもできます。

---
