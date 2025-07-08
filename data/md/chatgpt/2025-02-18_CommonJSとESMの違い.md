# CommonJSとESMの違い

日付: 2025-02-18

---

## 👤 ユーザー
*2025/02/18 23:06:57*

common jsって何？

---

## 🤖 アシスタント
*2025/02/18 23:07:47*

CommonJS（コモンJS）は、**JavaScriptのモジュールシステム**の1つで、特にNode.js環境で広く使用されています。CommonJSの目的は、**サーバーサイドでモジュール管理を簡単にする**ことでした。

### **特徴**
1. **`require` を使ってモジュールをインポート**
   ```js
   const fs = require('fs'); // Node.jsのファイルシステムモジュールを読み込む
   ```

2. **`module.exports` を使ってモジュールをエクスポート**
   ```js
   module.exports = {
     greet: function() {
       console.log("Hello, CommonJS!");
     }
   };
   ```

3. **同期的なモジュール読み込み**
   - `require()` を呼び出すと、モジュールが**即時に読み込まれ、評価される**ため、非同期処理には向いていない。

4. **主にNode.jsで使われる**
   - ブラウザ環境では`ES Modules（ESM）`が主流。

---

### **CommonJS vs ES Modules（ESM）**
| 比較項目      | CommonJS (`require`) | ES Modules (`import/export`) |
|-------------|----------------|------------------|
| インポート | `require('module')` | `import module from 'module'` |
| エクスポート | `module.exports = {...}` | `export default ...` or `export {...}` |
| 実行方式 | **同期的** | **非同期的** |
| 主な用途 | **Node.js**（サーバー） | **ブラウザ** & Node.js |
| `.mjs` 拡張子 | 不要 | 必要な場合あり |

---

### **CommonJSはまだ必要？**
- **Node.js の古いプロジェクトやライブラリ**では今も使われている。
- **ES Modulesが標準化**され、最近のNode.js（v12以降）では`import/export`が使える。
- **ブラウザではES Modulesが主流**なので、新規プロジェクトでは基本的にESMを使うのが推奨される。

もしNode.jsでモジュールを作る場合でも、将来的な互換性を考えると**ESMの使用を検討するのがベスト**。

---

## 👤 ユーザー
*2025/02/18 23:08:33*

いわゆる簡易的な jsコードを書いてコマンドラインから実行するスクリプト的に使いたい場合はどちらか？

---

## 🤖 アシスタント
*2025/02/18 23:09:22*

簡易的なJSコードを**コマンドラインから実行するスクリプト的な用途**で使いたい場合、**CommonJS（`require`）を使う方が手軽**です。

### **理由**
1. **Node.jsのデフォルトがCommonJS**
   - `node` コマンドでJSファイルを直接実行すると、デフォルトでは**CommonJSとして解釈**される。
   - `require()` を使ったコードはそのまま動く。

2. **ES Modules（ESM）はデフォルトで無効**
   - ESM（`import/export`）を使うには、拡張子を `.mjs` にするか、`package.json` に `"type": "module"` を追加する必要がある。
   - 簡易的なスクリプトには設定が面倒。

---

### **スクリプト例（CommonJS）**
```js
// script.js
const fs = require('fs');

console.log("Hello, CommonJS!");
fs.writeFileSync('test.txt', 'This is a test file.');
```

#### **実行方法**
```sh
node script.js
```
この方法なら**特別な設定なしでそのまま動く**。

---

### **ES Modulesで実行する場合**
ESM（`import`）を使いたいなら、次のどちらかが必要。

#### **方法1: `.mjs` 拡張子を使う**
```js
// script.mjs
import fs from 'fs';

console.log("Hello, ESM!");
await fs.promises.writeFile('test.txt', 'This is a test file.');
```
**実行**
```sh
node script.mjs
```

#### **方法2: `package.json` に `type: "module"` を追加**
```json
{
  "type": "module"
}
```
すると `.js` ファイルでも `import` を使えるが、**CommonJSの `require` は使えなくなる**。

---

### **結論**
**手軽に実行したいならCommonJS（`require`）が便利**。  
ただし、新しいプロジェクトで**将来性を考えるならESM（`import/export`）を使うのもアリ**。

---

## 👤 ユーザー
*2025/02/18 23:09:57*

mjsとタイプスクリプトの関係性

---

## 🤖 アシスタント
*2025/02/18 23:11:39*

`.mjs`（ES Modules）と**TypeScript**の関係性について説明します。

---

### **1. `.mjs` とは？**
`.mjs` は **ES Modules (ECMAScript Modules, ESM)** を使う際にNode.jsで推奨される拡張子の1つです。

- `import/export` を使用する。
- `require()` は使用できない。
- `package.json` に `"type": "module"` を指定すると、 `.js` でもESMとして動作する。

---

### **2. TypeScriptと `.mjs` の関係**
TypeScript では、 `.mjs` を直接書くことは**あまり一般的ではない**ですが、 **ES Modules としてトランスパイル（コンパイル）する際に `.mjs` を出力する** ことができます。

#### **(1) TypeScript で ES Modules を有効にする**
TypeScript で ESM を使うには、`tsconfig.json` の `module` 設定を `ESNext` や `ES6` にします。

```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "Node"
  }
}
```

---

#### **(2) `.mjs` を出力する**
TypeScript の `.ts` ファイルを `.mjs` にコンパイルするには、`outDir` を指定し、`module` を `ESNext` にします。

```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "Node",
    "outDir": "dist",
    "declaration": true
  }
}
```

これで、以下のような `.ts` ファイルが `.mjs` に変換されます。

```ts
// src/index.ts
export const greet = () => {
  console.log("Hello from TypeScript!");
};
```

**トランスパイル後（`dist/index.mjs`）**
```js
// dist/index.mjs
export const greet = () => {
  console.log("Hello from TypeScript!");
};
```

---

#### **(3) TypeScript + CommonJS の場合**
もし `.mjs` ではなく、`require()` を使いたいなら `module` を `CommonJS` にする。

```json
{
  "compilerOptions": {
    "module": "CommonJS"
  }
}
```

**トランスパイル後（`dist/index.js`）**
```js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.greet = void 0;
const greet = () => {
    console.log("Hello from TypeScript!");
};
exports.greet = greet;
```
（`"use strict";` などが追加され、`exports.greet = ...` の形になる。）

---

### **3. `.mjs` を使うべきか？**
✅ **`.mjs` を使うべき場合**
- Node.js で **ES Modules (import/export)** を使いたい場合
- TypeScript で **ESMとして出力** したい場合
- `.cjs`（CommonJS）と併用したい場合（拡張子で区別できる）

❌ **`.mjs` を使わない方がいい場合**
- TypeScript の型定義（`.d.ts`）と併用するとき（互換性の問題が起こることがある）
- CommonJS (`require`) を使う場合
- `package.json` に `"type": "module"` を設定して `.js` で統一する場合

---

### **4. まとめ**
| 比較項目      | `.mjs` (ESM) | `.cjs` (CommonJS) | TypeScript (`.ts`) |
|-------------|-------------|-----------------|------------------|
| 使う環境   | Node.js, TypeScript | Node.js | TypeScript |
| インポート | `import { x } from './module.mjs'` | `const x = require('./module.cjs')` | `import { x } from './module'` |
| 出力形式 | `export` / `import` | `module.exports` / `require()` | `.ts` を `.mjs` か `.js` にコンパイル |

TypeScript で ESM を使うなら `.mjs` も出力できるが、プロジェクトによっては `.js` でも十分です。**Node.js で ESM を明示的に使う場合に `.mjs` を選ぶと便利**です！

---
