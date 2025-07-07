# TypeScript ファイル コピー方法

日付: 2025-06-05

---

## 👤 ユーザー
*2025/6/5 18:23:03*

"build": "tsc -p . && cp -r src/generated dist/", このようなコピーをしているのだけれどもやってもいいものなのか？

TypeScriptコンパイラは基本的に.tsファイルを.jsと.d.tsにコンパイルしますが、src/generated/ディレク
  トリ内のファイルは元々がJavaScriptファイル（Prismaとzod-prisma-typesが生成したファイル）なので、TypeScriptコ
  ンパイラがそれらをdist/にコピーしてくれません。

他の方法と比較したい

---

## 🤖 アシスタント
*2025/6/5 18:23:04*

めちゃくちゃ「よくある」話ですし、  
そのまま `cp -r src/generated dist/` でコピーするのは普通に**アリ**です。  
でも、他にもよく使われる方法があるので、それぞれ比較します。

---

## 1. `cp -r` でコピー  
**パターン**  
```json
"build": "tsc -p . && cp -r src/generated dist/"
```

**メリット**  
- シンプルで確実  
- OSコマンドなので速い  
- npm script で簡単に書ける

**デメリット**  
- Windowsでは標準の `cp` コマンドが使えない（cross-platform非対応）  
- `src/generated` 以外にも増えたら手動で追加が必要

---

## 2. TypeScriptの `include` / `copyfiles` でコピー

### 2.1. [copyfiles](https://www.npmjs.com/package/copyfiles) でクロスプラットフォーム  
**パターン**  
```bash
npm install --save-dev copyfiles
```
```json
"build": "tsc -p . && copyfiles -u 1 src/generated/* dist/"
```

**メリット**  
- Windows, Mac, Linux どこでも動く  
- globで細かく制御できる  
- npm scriptsから直感的に使える

**デメリット**  
- 依存が増える  
- 複雑なパターンだとスクリプトがごちゃごちゃしやすい

---

## 3. tsc-aliasやpostbuildフックで移動

### 3.1. postbuildスクリプト  
```json
"build": "tsc -p .",
"postbuild": "cp -r src/generated dist/"
```
- tscのビルドが終わったあとに必ずコピーされる

---

## 4. Node.jsスクリプトでコピー

`scripts/copy-generated.js` を作る  
```js
import { copyFileSync, mkdirSync, readdirSync, statSync } from "fs";
import { join } from "path";

// 再帰コピー（単純例）
function copyRecursive(src, dest) {
  mkdirSync(dest, { recursive: true });
  for (const item of readdirSync(src)) {
    const srcPath = join(src, item);
    const destPath = join(dest, item);
    if (statSync(srcPath).isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}
copyRecursive("src/generated", "dist/generated");
```
```json
"build": "tsc -p . && node scripts/copy-generated.js"
```

**メリット**  
- Nodeプロジェクトなら依存不要で柔軟にカスタマイズ可能  
- OS問わず動く

**デメリット**  
- スクリプトの管理が必要  
- 単純なコピーだけならやや冗長

---

## 5. tsconfig.jsonの `include`/`exclude` でワークアラウンド

実は `.js` ファイルだけ `include` しても tsc はそれらを単にコピーしません。  
TypeScriptは **ソース（.ts/.tsx）しか outDir へ出力しない** ので、  
`cp` などのコピーはやっぱり必要。

---

## まとめ

| 方法                | クロスプラットフォーム | 依存      | 柔軟性       | 簡単さ   |
|---------------------|-----------------------|-----------|--------------|----------|
| cp -r               | ✕ (Win不可)           | なし      | △            | ◎        |
| copyfiles           | ○                     | あり      | ○            | ◎        |
| postbuildでcp       | ✕ (Win不可)           | なし      | △            | ◎        |
| Node.jsスクリプト   | ○                     | なし      | ◎            | ○        |

- **Win/Mac両対応したいなら `copyfiles` や Nodeスクリプトが無難**
- UNIX系だけ or 個人開発なら `cp -r` でも十分

---

## 補足: 公式の方法は？

**Prisma**や**zod-prisma-types**など生成系はたいてい「TypeScriptのsrc下に.jsや.d.tsで出力するだけ」なので、  
この「コピー問題」はTypeScriptプロジェクトでは半分「伝統芸」です。  
なので、あなたの書き方は全然おかしくないし、チームでもやってる人多いです。

---

### 他のパターン使いたい or 具体的なディレクトリ構成見せてくれたら、さらに最適解提案できます！

---
