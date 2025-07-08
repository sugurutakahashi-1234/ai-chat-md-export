# Resolving pnpm add dependency issues in a workspace

日付: 2025-05-22

---

## 👤 ユーザー
*2025/5/22 21:56:21*

serverディレクトリでライブラリを入れようとするとなぜかrootのpackagejsonに追加されてしまう
$ pwd                             
/Users/sugurutakahashi/git/hono-learning/packages/server
$ pnpm add -w hono zod zod-openapi

(3.13.2) ~/git/hono-learning  ‹main*› $ tree -aL 2
.
├── .git
│   ├── COMMIT_EDITMSG
│   ├── config
│   ├── description
│   ├── FETCH_HEAD
│   ├── HEAD
│   ├── hooks
│   ├── index
│   ├── info
│   ├── logs
│   ├── objects
│   ├── ORIG_HEAD
│   └── refs
├── .github
│   └── copilot-instructions.md
├── .gitignore
├── .husky
│   ├── _
│   └── pre-commit
├── .npmrc
├── .nvmrc
├── .vscode
│   ├── extensions.json
│   └── settings.json
├── biome.json
├── node_modules
│   ├── .bin
│   ├── .modules.yaml
│   ├── .pnpm
│   ├── .pnpm-workspace-state.json
│   ├── @biomejs
│   ├── hono -&gt; .pnpm/hono@4.7.10/node_modules/hono
│   ├── husky -&gt; .pnpm/husky@9.1.7/node_modules/husky
│   ├── typescript -&gt; .pnpm/typescript@5.8.3/node_modules/typescript
│   ├── zod -&gt; .pnpm/zod@3.25.20/node_modules/zod
│   └── zod-openapi -&gt; .pnpm/zod-openapi@4.2.4_zod@3.25.20/node_modules/zod-openapi
├── package.json
├── packages
│   ├── client
│   ├── server
│   └── shared
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── tsconfig.json
24 directories, 22 files
(3.13.2) ~/git/hono-learning  ‹main*› $

---

## 🤖 アシスタント
*2025/5/22 21:56:34*

この問題は、`pnpm add` コマンドに `-w` (または `--workspace-root`) フラグを付けているためです。

## 問題の原因

```bash
$ pnpm add -w hono zod zod-openapi
```

`-w` フラグは「ワークスペースのルートに依存関係を追加する」という意味です。つまり、どのディレクトリから実行しても、ルートの `package.json` に依存関係が追加されます。

## 解決方法

### 1. 特定のパッケージに依存関係を追加したい場合

```bash
# serverディレクトリ内で実行
$ cd packages/server
$ pnpm add hono zod zod-openapi
```

または、ルートディレクトリから：

```bash
# ルートディレクトリから特定のパッケージを指定
$ pnpm add --filter server hono zod zod-openapi
```

### 2. ワークスペース全体で共有したい場合

もし本当にワークスペース全体で共有したい依存関係であれば、`-w` フラグは正しい使い方です。

## pnpmワークスペースでの依存関係管理

- **`pnpm add`**: 現在のディレクトリのpackage.jsonに追加
- **`pnpm add -w`**: ワークスペースルートのpackage.jsonに追加
- **`pnpm add --filter <package-name>`**: 指定したパッケージのpackage.jsonに追加

今回の場合、`server` パッケージ固有の依存関係として追加したいなら、`-w` フラグを外して実行してください。

---
