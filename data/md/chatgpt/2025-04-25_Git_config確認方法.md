# Git config確認方法

日付: 2025-04-25

---

## 👤 ユーザー
*2025/4/25 23:39:53*

git config --global の確認

---

## 🤖 アシスタント
*2025/4/25 23:39:54*

`git config --global` で設定されている内容を確認したい場合は、以下のコマンドを使います：

```bash
git config --global --list
```

### 出力例:
```bash
user.name=Your Name
user.email=your.email@example.com
core.editor=vim
color.ui=auto
```

これで `--global` スコープに設定されている Git 設定（ホームディレクトリの `~/.gitconfig` に保存されている内容）が確認できます。

---

もし特定の設定値だけ確認したい場合は：

```bash
git config --global user.name
git config --global user.email
```

などと個別に確認できます。必要なら `--system` や `--local` の設定も調べることができます。興味ある？

---

## 👤 ユーザー
*2025/4/25 23:40:23*

git pull すると勝手にマージされてしまうのを止めたい

core.excludesfile=/Users/sugurutakahashi/.gitignore_global
difftool.sourcetree.cmd=opendiff "$LOCAL" "$REMOTE"
difftool.sourcetree.path=
mergetool.sourcetree.cmd=/Applications/Sourcetree.app/Contents/Resources/opendiff-w.sh "$LOCAL" "$REMOTE" -ancestor "$BASE" -merge "$MERGED"
mergetool.sourcetree.trustexitcode=true
user.name=suguruTakahashi-1234
user.email=samonikura100@gmail.com
commit.template=/Users/sugurutakahashi/.stCommitMsg
pull.rebase=false
pull.ff=false
merge.ff=false

---

## 🤖 アシスタント
*2025/4/25 23:40:24*

`git pull` すると「勝手にマージされてしまう」のを止めたい場合、以下のいずれかの挙動を期待している可能性があります：

---

### ✅ 1. **「マージせず、rebase もせず、まず `fetch` のみ行いたい」場合**

→ 明示的に `git fetch` を使いましょう。  
`git pull` は `git fetch` + `git merge/rebase` のセットなので、勝手に何か起きるのを避けたい場合は `git fetch` に分けるのが一番確実です。

```bash
git fetch origin
# 差分を見る
git log HEAD..origin/main --oneline
# 必要なら手動で merge や rebase
```

---

### ✅ 2. **`git pull` してもマージされず、警告だけ表示して止めたい**（＝安全にしたい）

これには `git pull` を明示的に禁止できる設定は **ありません**。  
ただし、エイリアスで `pull` を封印する手はあります：

```bash
git config --global alias.pull '!echo "⚠️ git pullは禁止。fetchして確認してから操作してください。" && exit 1'
```

---

### ✅ 3. **`git pull` したとき `マージコミット` を避けたい**

`merge.ff=false` や `pull.ff=false` を設定すると「Fast-forward マージができてもマージコミットを作る」動きになります。  
むしろこれは「勝手にマージコミットを作る」原因になります。

もしマージコミットが嫌な場合は、以下のように設定を変更してください：

```bash
git config --global pull.rebase true
```

これは「`git pull` のとき `rebase` にする」設定です。

---

### 🔧 今の設定の改善提案

今の状態だと：

```ini
pull.rebase=false
pull.ff=false
merge.ff=false
```

これは「常にマージを発生させる」構成です。

#### ✔️ 勝手にマージさせない方向にしたいなら：
```bash
git config --global pull.rebase false
git config --global pull.ff only
```

これにより、Fast-forward できるときのみマージなしで更新され、できないときは止まります（警告付き）。

---

### まとめ

| 方法 | 内容 |
|------|------|
| `git fetch` を使う | pull せず手動で差分確認・操作したい |
| `git pull` を封印 | エイリアスで禁止にする |
| マージコミット避ける | `pull.rebase true` にする |
| FF のみ許可 | `pull.ff only` にする |

---

どの方針が一番合いそう？それに合わせて `.gitconfig` 修正提案もできるよ。

---

## 👤 ユーザー
*2025/4/25 23:41:21*

git config --global pull.ff only とするのはどんな意味があるのか？

---

## 🤖 アシスタント
*2025/4/25 23:41:21*

`git config --global pull.ff only` の意味をわかりやすく説明すると：

---

### ✅ **意味：Fast-forward できるときだけ `git pull` を許可する**

つまり、

- **自分のローカルブランチにコミットがない**（＝何も変更してない）
- **リモートブランチが進んでいるだけ**

というときにしか `git pull` が成功しません。

---

### 🔒 **Fast-forward できない（＝マージが必要）場合はエラーになる**

```bash
fatal: Not possible to fast-forward, aborting.
```

これにより、**勝手にマージコミットが作られるのを防げます**。

---

### 📌 Fast-forward とは？

例えば：

- ローカルが `A → B` の状態
- リモートが `A → B → C → D` に進んでいる

このとき、ローカルに変更がなければ `B → C → D` とそのまま進むだけでマージ不要。これが **Fast-forward**。

---

### ⚠️ 一方でローカルにも変更があると…

```
local:   A → B → X
remote:  A → B → C → D
```

みたいにローカルで `X` という変更をしていたら、Fast-forward では対応できないので `pull` は **止まります（エラーになる）**。

---

### ✨ まとめ

| 設定                     | 意味                                                 |
|--------------------------|------------------------------------------------------|
| `git config pull.ff true`   | FF できるなら使う（できないときはマージ）           |
| `git config pull.ff false`  | 常にマージコミットを作る                            |
| `git config pull.ff only`   | **FF できないときは `pull` を止める（安全）**        |

---

実際に試すと納得できるので、興味あれば再現できる状況で試してみる？

---

## 👤 ユーザー
*2025/4/25 23:41:59*

デフォルトの設定にしたい

---

## 🤖 アシスタント
*2025/4/25 23:41:59*

Git の `pull` 関連の設定を **デフォルト状態** に戻すには、以下のコマンドを使ってグローバル設定を削除するのが一番確実です。

---

### 🔧 `git pull` に関する設定の削除

```bash
git config --global --unset pull.rebase
git config --global --unset pull.ff
git config --global --unset merge.ff
```

---

### 🔄 それぞれの意味（デフォルトに戻る）

| 設定         | 削除後のデフォルト値            |
|--------------|--------------------------------|
| `pull.rebase`| **未設定** → `merge` を使う     |
| `pull.ff`    | **未設定** → `merge.ff` の値に従う（通常は `true`）|
| `merge.ff`   | **未設定** → `true`（Fast-forward が可能ならマージコミットを作らない） |

---

### ✅ 結果としての `git pull` の挙動（デフォルト）

- ローカルに変更がなければ → **Fast-forward（マージなし）**
- ローカルに変更があれば → **マージコミットが作られる**
- `rebase` は行われない（指定しない限り）

---

### 📁 `.gitconfig` から手動で消す場合

`~/.gitconfig` を直接編集して、以下のようなセクションを削除してもOK：

```ini
[pull]
    rebase = false
    ff = false
[merge]
    ff = false
```

---

何か残しておきたい設定があるなら、それ以外を削除する形でも調整できるよ。必要なら `.gitconfig` の中身を一緒に見てもいいよ！

---
