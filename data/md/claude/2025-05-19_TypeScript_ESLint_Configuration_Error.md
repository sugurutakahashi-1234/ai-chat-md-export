# TypeScript ESLint Configuration Error

日付: 2025-05-19

---

## 👤 ユーザー
*2025/5/19 21:07:46*

何がおかしいのか？

import \* as tseslint from "typescript-eslint";
// import unicornPlugin from "eslint-plugin-unicorn";
// import sonarjsPlugin from "eslint-plugin-sonarjs";
// import prettierConfig from "eslint-config-prettier";

export default tseslint.config(
  // TypeScript の推奨設定
  tseslint.configs.strictTypeChecked,
  // 各種プラグインとルール
  {
    ignores: \["dist/\*\*", "node\_modules/\*\*"\],
  }
);


$ pnpm lint:fix                                                                                                                               2 ↵
&gt; typescript-learning@1.0.0 lint:fix /Users/sugurutakahashi/git/typescript-learning
&gt; eslint . --fix
Oops! Something went wrong! :(
ESLint: 9.27.0
Error: Error while loading rule '@typescript-eslint/await-thenable': You have used a rule which requires type information, but don't have parserOptions set to generate type information for this file. See https://typescript-eslint.io/getting-started/typed-linting for enabling linting with type information.
Parser: typescript-eslint/parser
Occurred while linting /Users/sugurutakahashi/git/typescript-learning/eslint.config.ts
    at throwError (/Users/sugurutakahashi/git/typescript-learning/node\_modules/.pnpm/@typescript-eslint+utils@8.32.1\_eslint@9.27.0\_jiti@2.4.2\_\_typescript@5.8.3/node\_modules/@typescript-eslint/utils/dist/eslint-utils/getParserServices.js:38:11)
    at getParserServices (/Users/sugurutakahashi/git/typescript-learning/node\_modules/.pnpm/@typescript-eslint+utils@8.32.1\_eslint@9.27.0\_jiti@2.4.2\_\_typescript@5.8.3/node\_modules/@typescript-eslint/utils/dist/eslint-utils/getParserServices.js:27:9)
    at create (/Users/sugurutakahashi/git/typescript-learning/node\_modules/.pnpm/@typescript-eslint+eslint-plugin@8.32.1\_@typescript-eslint+parser@8.32.1\_eslint@9.27.0\_\_52a6b238ce47455b8bfba127112fa932/node\_modules/@typescript-eslint/eslint-plugin/dist/rules/await-thenable.js:60:55)
    at Object.create (/Users/sugurutakahashi/git/typescript-learning/node\_modules/.pnpm/@typescript-eslint+utils@8.32.1\_eslint@9.27.0\_jiti@2.4.2\_\_typescript@5.8.3/node\_modules/@typescript-eslint/utils/dist/eslint-utils/RuleCreator.js:31:20)
    at createRuleListeners (/Users/sugurutakahashi/git/typescript-learning/node\_modules/.pnpm/eslint@9.27.0\_jiti@2.4.2/node\_modules/eslint/lib/linter/linter.js:1134:15)
    at /Users/sugurutakahashi/git/typescript-learning/node\_modules/.pnpm/eslint@9.27.0\_jiti@2.4.2/node\_modules/eslint/lib/linter/linter.js:1287:7
    at Array.forEach (&lt;anonymous&gt;)
    at runRules (/Users/sugurutakahashi/git/typescript-learning/node\_modules/.pnpm/eslint@9.27.0\_jiti@2.4.2/node\_modules/eslint/lib/linter/linter.js:1203:31)
    at #flatVerifyWithoutProcessors (/Users/sugurutakahashi/git/typescript-learning/node\_modules/.pnpm/eslint@9.27.0\_jiti@2.4.2/node\_modules/eslint/lib/linter/linter.js:2282:22)
    at Linter.\_verifyWithFlatConfigArrayAndWithoutProcessors (/Users/sugurutakahashi/git/typescript-learning/node\_modules/.pnpm/eslint@9.27.0\_jiti@2.4.2/node\_modules/eslint/lib/linter/linter.js:2373:43)
    at Linter.\_verifyWithFlatConfigArray (/Users/sugurutakahashi/git/typescript-learning/node\_modules/.pnpm/eslint@9.27.0\_jiti@2.4.2/node\_modules/eslint/lib/linter/linter.js:2476:15)
    at Linter.verify (/Users/sugurutakahashi/git/typescript-learning/node\_modules/.pnpm/eslint@9.27.0\_jiti@2.4.2/node\_modules/eslint/lib/linter/linter.js:1838:10)
    at Linter.verifyAndFix (/Users/sugurutakahashi/git/typescript-learning/node\_modules/.pnpm/eslint@9.27.0\_jiti@2.4.2/node\_modules/eslint/lib/linter/linter.js:2741:20)
    at verifyText (/Users/sugurutakahashi/git/typescript-learning/node\_modules/.pnpm/eslint@9.27.0\_jiti@2.4.2/node\_modules/eslint/lib/eslint/eslint.js:301:45)
    at /Users/sugurutakahashi/git/typescript-learning/node\_modules/.pnpm/eslint@9.27.0\_jiti@2.4.2/node\_modules/eslint/lib/eslint/eslint.js:818

---

## 🤖 アシスタント
*2025/5/19 21:08:03*

ESLintでエラーが発生しているようですね。問題は、TypeScriptの型情報を必要とするルール（`@typescript-eslint/await-thenable`）を使用していますが、そのための設定が不足していることです。

エラーメッセージが示す通り、型情報を生成するためのparserOptionsが設定されていません。このエラーを修正するには、ESLint構成ファイルに型チェック用の設定を追加する必要があります。

以下のように`eslint.config.ts`を修正してみましょう：

```typescript
import * as tseslint from "typescript-eslint";
// import unicornPlugin from "eslint-plugin-unicorn";
// import sonarjsPlugin from "eslint-plugin-sonarjs";
// import prettierConfig from "eslint-config-prettier";

export default tseslint.config(
  // TypeScript の推奨設定
  tseslint.configs.strictTypeChecked,
  // 型情報を使用するための設定を追加
  {
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json", // プロジェクトのtsconfig.jsonへのパス
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  // 各種プラグインとルール
  {
    ignores: ["dist/**", "node_modules/**"],
  }
);
```

この修正では以下の点が重要です：

1. `languageOptions.parserOptions.project` に `tsconfig.json` へのパスを指定し、TypeScriptの型情報を利用できるようにしています
2. `tsconfigRootDir` に正しいルートディレクトリのパスを指定しています

また、プロジェクトに有効な `tsconfig.json` が存在することを確認してください。存在しない場合は、以下のような基本的な設定ファイルを作成することをお勧めします：

```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    "eslint.config.ts"
  ]
}
```

これらの変更を行った後、再度 `pnpm lint:fix` を実行してみてください。

---

## 👤 ユーザー
*2025/5/19 21:08:41*

ちなみに以下である

$ tree -aL 2     
.
├── .git
│   ├── COMMIT\_EDITMSG
│   ├── config
│   ├── description
│   ├── FETCH\_HEAD
│   ├── HEAD
│   ├── hooks
│   ├── index
│   ├── info
│   ├── logs
│   ├── objects
│   ├── ORIG\_HEAD
│   └── refs
├── .gitignore
├── .npmrc
├── .nvmrc
├── dist
│   ├── index.js
│   └── utils
├── eslint.config.ts
├── node\_modules
│   ├── .bin
│   ├── .modules.yaml
│   ├── .pnpm
│   ├── .pnpm-workspace-state.json
│   ├── @eslint
│   ├── @types
│   ├── eslint -&gt; .pnpm/eslint@9.27.0\_jiti@2.4.2/node\_modules/eslint
│   ├── eslint-config-prettier -&gt; .pnpm/eslint-config-prettier@10.1.5\_eslint@9.27.0\_jiti@2.4.2\_/node\_modules/eslint-config-prettier
│   ├── eslint-plugin-import -&gt; .pnpm/eslint-plugin-import@2.31.0\_@typescript-eslint+parser@8.32.1\_eslint@9.27.0\_jiti@2.4.2\_\_\_10016e8bc489fbf6ad153fdbf1313af0/node\_modules/eslint-plugin-import
│   ├── eslint-plugin-sonarjs -&gt; .pnpm/eslint-plugin-sonarjs@3.0.2\_eslint@9.27.0\_jiti@2.4.2\_/node\_modules/eslint-plugin-sonarjs
│   ├── eslint-plugin-unicorn -&gt; .pnpm/eslint-plugin-unicorn@59.0.1\_eslint@9.27.0\_jiti@2.4.2\_/node\_modules/eslint-plugin-unicorn
│   ├── globals -&gt; .pnpm/globals@16.1.0/node\_modules/globals
│   ├── jiti -&gt; .pnpm/jiti@2.4.2/node\_modules/jiti
│   ├── prettier -&gt; .pnpm/prettier@3.5.3/node\_modules/prettier
│   ├── tsx -&gt; .pnpm/tsx@4.19.4/node\_modules/tsx
│   ├── typescript -&gt; .pnpm/typescript@5.8.3/node\_modules/typescript
│   └── typescript-eslint -&gt; .pnpm/typescript-eslint@8.32.1\_eslint@9.27.0\_jiti@2.4.2\_\_typescript@5.8.3/node\_modules/typescript-eslint
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── README.md
├── src
│   ├── index.ts
│   └── utils
└── tsconfig.json
27 directories, 20 files

{
  "compilerOptions": {
    "target": "ES2024" /\* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. \*/,
    "module": "NodeNext" /\* Specify what module code is generated. \*/,
    "moduleResolution": "NodeNext" /\* Specify how modules are resolved. \*/,
    "esModuleInterop": true /\* Emit additional JavaScript to ease support for importing CommonJS modules. This enables 'allowSyntheticDefaultImports' for type compatibility. \*/,
    "forceConsistentCasingInFileNames": true /\* Ensure that casing is correct in imports. \*/,
    "strict": true /\* Enable all strict type-checking options. \*/,
    "skipLibCheck": true,
    "outDir": "dist" /\* 追加: 出力ディレクトリを指定 \*/,
    "rootDir": "." /\* 追加: 入力ディレクトリを指定 \*/,
    "rewriteRelativeImportExtensions": true
  },
  "include": \["src/\*\*/\*", "eslint.config.ts"\] /\* eslint.config.tsを含める \*/
}

---

## 🤖 アシスタント
*2025/5/19 21:08:57*

tsconfig.jsonが既に存在していて、`eslint.config.ts`も`include`に含まれていますね。しかし、まだエラーが発生しているようです。

問題を解決するために、以下のように`eslint.config.ts`を修正してみましょう：

```typescript
import * as tseslint from "typescript-eslint";
// import unicornPlugin from "eslint-plugin-unicorn";
// import sonarjsPlugin from "eslint-plugin-sonarjs";
// import prettierConfig from "eslint-config-prettier";

export default tseslint.config(
  // TypeScript の推奨設定
  // strictTypeCheckedではなく、recommendedを使用
  tseslint.configs.recommended,
  // 型情報を利用する設定を追加
  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  // 各種プラグインとルール
  {
    ignores: ["dist/**", "node_modules/**"],
  }
);
```

ここでの主な変更点：

1. `strictTypeChecked`の代わりに`recommended`を使用することで、型情報が必要なルールをすべて含むのではなく、基本的な推奨ルールのみを使用するようにしています。
2. `parser: tseslint.parser`を明示的に指定して、TypeScriptパーサーを使用することを確認しています。

もし型情報を利用するルールを使いたい場合は、以下のように設定を分けることもできます：

```typescript
import * as tseslint from "typescript-eslint";

export default tseslint.config(
  // 基本設定（型チェックなし）
  tseslint.configs.recommended,
  
  // 型情報を利用するルールの設定
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // 型情報を必要とするルールを個別に有効化できます
      "@typescript-eslint/await-thenable": "error",
      // その他の型情報を利用するルールを必要に応じて追加
    },
  },
  
  // 共通の設定
  {
    ignores: ["dist/**", "node_modules/**"],
  }
);
```

別の解決方法として、`strictTypeChecked`を使いたい場合は、eslintコマンドの実行方法を変更して、`eslint.config.ts`自体がLintの対象外になるようにすることも検討できます。`package.json`の`lint:fix`スクリプトを以下のように変更します：

```json
"lint:fix": "eslint \"src/**/*.ts\" --fix"
```

これにより、`src`ディレクトリ内のTypeScriptファイルのみをLintの対象とし、`eslint.config.ts`自体は対象外になります。

どちらのアプローチも効果があるはずですので、お試しください。

---

## 👤 ユーザー
*2025/5/19 21:12:04*

どうしてだろう？

import importPlugin from "eslint-plugin-import";

モジュール 'eslint-plugin-import' の宣言ファイルが見つかりませんでした。'/Users/sugurutakahashi/git/typescript-learning/node\_modules/.pnpm/eslint-plugin-import@2.31.0\_@typescript-eslint+parser@8.32.1\_eslint@9.27.0\_jiti@2.4.2\_\_\_10016e8bc489fbf6ad153fdbf1313af0/node\_modules/eslint-plugin-import/lib/index.js' は暗黙的に 'any' 型になります。存在する場合は `npm i --save-dev @types/eslint-plugin-import` を試すか、`declare module 'eslint-plugin-import';` を含む新しい宣言 (.d.ts) ファイルを追加しますts(7016)

---

## 🤖 アシスタント
*2025/5/19 21:12:15*

型定義ファイルがないモジュールをインポートしているためのエラーですね。`eslint-plugin-import`パッケージには型定義（`.d.ts`ファイル）が含まれていないようです。

このエラーを解決するには、以下のいずれかの方法を試すことができます：

### 1. 型定義パッケージをインストールする

エラーメッセージにも示されているように、`@types/eslint-plugin-import`パッケージをインストールしてみましょう：

```bash
pnpm add -D @types/eslint-plugin-import
```

### 2. モジュール宣言ファイルを作成する

`@types/eslint-plugin-import`パッケージが存在しない場合や、うまくインストールできない場合は、独自のモジュール宣言ファイルを作成できます。以下の内容で`src/types/eslint-plugin-import.d.ts`というファイルを作成します：

```typescript
declare module 'eslint-plugin-import';
```

そして、`tsconfig.json`の`include`セクションでこのファイルを含めるようにします：

```json
"include": ["src/**/*", "eslint.config.ts", "src/types/*.d.ts"]
```

### 3. `any`型のアサーションを使用する

もう一つの方法として、インポート時に`any`型としてアサーションするアプローチもあります：

```typescript
import importPlugin from "eslint-plugin-import" as any;
```

### 4. `noImplicitAny`を一時的に無効にする

`tsconfig.json`の`compilerOptions`に以下を追加することで、暗黙的な`any`型の警告を無効にできます：

```json
"noImplicitAny": false
```

ただし、これはTypeScriptの型安全性を低下させるため、一時的な対応としてのみお勧めします。

### 5. `require`を使用してインポートする

TypeScriptの型チェックを回避するために、`require`を使用してモジュールをインポートすることもできます：

```typescript
const importPlugin = require("eslint-plugin-import");
```

これらの選択肢のうち、最初の2つが最も型安全性を維持する方法です。特に、モジュール宣言ファイルを作成する方法は、外部パッケージに依存せずに問題を解決できるため、便利なアプローチです。

---

## 👤 ユーザー
*2025/5/19 21:12:37*

$ pnpm add -D @types/eslint-plugin-import                                                                                                     1 ↵
 ERR\_PNPM\_FETCH\_404  GET https://registry.npmjs.org/@types%2Feslint-plugin-import: Not Found - 404
This error happened while installing a direct dependency of /Users/sugurutakahashi/git/typescript-learning
@types/eslint-plugin-import is not in the npm registry, or you have no permission to fetch it.
No authorization header was set for the request.
Progress: resolved 13, reused 13, downloaded 0, added 0

---

## 🤖 アシスタント
*2025/5/19 21:12:49*

`@types/eslint-plugin-import`パッケージは存在しないようですね。この場合、独自の型定義を作成する方法が最適です。以下の手順で対応しましょう：

### 1. 型定義ファイルの作成

`src/types`ディレクトリを作成し、その中に`eslint-plugin-import.d.ts`ファイルを作成します：

```bash
mkdir -p src/types
```

次に、以下の内容で`src/types/eslint-plugin-import.d.ts`ファイルを作成します：

```typescript
declare module 'eslint-plugin-import';
```

### 2. tsconfig.jsonの更新

次に、`tsconfig.json`を更新して、新しい型定義ファイルを含めるようにします：

```json
{
  "compilerOptions": {
    "target": "ES2024",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "rootDir": ".",
    "rewriteRelativeImportExtensions": true
  },
  "include": ["src/**/*", "eslint.config.ts", "src/types/*.d.ts"]
}
```

これにより、`eslint-plugin-import`モジュールに対する型定義が提供され、TypeScriptエラーが解消されるはずです。

### 3. 同様の問題のある他のモジュールについても対応

同様の問題が`eslint-plugin-sonarjs`や`eslint-config-prettier`など他のESLintプラグインでも発生する可能性があります。これらについても、同様に型定義ファイルを作成することで対応できます：

`src/types/eslint-plugin-sonarjs.d.ts`:
```typescript
declare module 'eslint-plugin-sonarjs';
```

`src/types/eslint-config-prettier.d.ts`:
```typescript
declare module 'eslint-config-prettier';
```

`src/types/eslint-plugin-unicorn.d.ts`:
```typescript
declare module 'eslint-plugin-unicorn';
```

このアプローチは、型安全性を完全に維持するわけではありませんが、コンパイルエラーを解消し、開発を続行するための実用的な解決策です。モジュールの具体的なAPIを型付けしたい場合は、より詳細な型定義を作成することも可能ですが、それは必要に応じて後で対応できます。

---

## 👤 ユーザー
*2025/5/19 21:16:47*

こう書いてあった

**TypeScript**
You may use the following snippet or assemble your own config using the granular settings described below it.
Make sure you have installed `@typescript-eslint/parser` and `eslint-import-resolver-typescript` which are used in the following configuration.

```
{
  "extends": [
    "eslint:recommended",
    "plugin:import/recommended",
// the following lines do the trick
    "plugin:import/typescript",
  ],
  "settings": {
    "import/resolver": {
      // You will also need to install and configure the TypeScript resolver
      // See also https://github.com/import-js/eslint-import-resolver-typescript#configuration
      "typescript": true,
      "node": true,
    },
  },
}
```

**Config - Flat with **`config()` in `typescript-eslint`
If you are using the `config` method from `typescript-eslint`, ensure that the `flatConfig` is included within the `extends` array.

```
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import js from '@eslint/js';

export default tseslint.config(
  js.configs.recommended,
  // other configs...
  {
    files: ['**/*.{ts,tsx}'],
    extends: [importPlugin.flatConfigs.recommended, importPlugin.flatConfigs.typescript],
    // other configs...
  }
);
```

---

## 🤖 アシスタント
*2025/5/19 21:16:59*

ありがとうございます。それは`eslint-plugin-import`の設定ドキュメントですね。TypeScriptでのフラットな設定方法が記載されています。

ではその情報を元に、`eslint.config.ts`ファイルを修正してみましょう。以下のように更新することで、型定義の問題を解決しつつ、正しく設定することができます：

```typescript
import * as tseslint from "typescript-eslint";
import js from "@eslint/js";
// eslint-plugin-importのインポート
// as anyを使用して型エラーを回避
const importPlugin = await import("eslint-plugin-import") as any;
// 必要に応じて他のプラグインも同様に
// const unicornPlugin = await import("eslint-plugin-unicorn") as any;
// const sonarjsPlugin = await import("eslint-plugin-sonarjs") as any;
// const prettierConfig = await import("eslint-config-prettier") as any;

export default tseslint.config(
  // JavaScript推奨設定
  js.configs.recommended,
  // TypeScript推奨設定
  tseslint.configs.recommended,
  // eslint-plugin-importの設定
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  
  // 型情報を利用する設定
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      // eslint-import-resolver-typescriptの設定
      "import/resolver": {
        typescript: true,
        node: true,
      },
    },
  },
  
  // ファイル無視設定
  {
    ignores: ["dist/**", "node_modules/**"],
  }
);
```

この設定では：

1. `as any`を使用して型エラーを回避しています（モジュール宣言ファイルを作成する代わりに）
2. `importPlugin.flatConfigs.recommended`と`importPlugin.flatConfigs.typescript`を使用して、import関連の推奨設定とTypeScript固有の設定を適用しています
3. `settings`セクションで`import/resolver`の設定を行っています

また、この設定を使用するには、`eslint-import-resolver-typescript`パッケージをインストールする必要があるかもしれません：

```bash
pnpm add -D eslint-import-resolver-typescript
```

このアプローチは、プロジェクトに適切なESLint設定を適用しつつ、型定義の問題を回避するのに役立つはずです。もし他のESLintプラグインも使用したい場合は、同様の方法でインポートして設定に追加できます。

---
