# defaultPluginsの意味

日付: 2025-06-04

---

## 👤 ユーザー
*2025/6/5 1:55:00*

...defaultPlugins, の意味についてよくわかっていない。教えて欲しい

import { defaultPlugins, defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
	input: "./openapi.json",
	output: "src/generated/backend-client",
	plugins: [
		...defaultPlugins,
		"@hey-api/schemas",
		{
			name: "@hey-api/client-next",
			runtimeConfigPath: "./src/hey-api.ts",
		},
		"@tanstack/react-query",
		"zod",
		{
			name: "@hey-api/sdk",
			validator: true,
		},
	],
});

import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "../docs/openapi.json",
  output: "src/client",
  plugins: [
    "@hey-api/client-fetch",
    "@tanstack/react-query",
    "zod",
    {
      name: "@hey-api/sdk",
      validator: true,
    },
  ],
});

---

## 🤖 アシスタント
*2025/6/5 1:55:55*

### `defaultPlugins` とは？

`@hey-api/openapi-ts` では **プラグイン** が OpenAPI スキーマから生成物（型定義・SDK など）を作ります。  
何も設定しなくても **TypeScript 用の型 (`types.gen.ts`) と SDK (`sdk.gen.ts`)** を出力してくれるのは、ライブラリ内部で次の 2 つのプラグインを自動で読み込むためです。

| 内部名 | 役割 |
| ------ | ---- |
| `@hey-api/typescript` | モデル／エンム／インターフェースなど **型定義** を生成 |
| `@hey-api/sdk` | fetch ベースの **SDK（API 呼び出し関数群）** を生成 |

この「標準セット」を配列にまとめてエクスポートしたのが **`defaultPlugins`** です。ドキュメントでは「デフォルト出力を維持したいなら `...defaultPlugins` を指定してね」と繰り返し示されています。citeturn5search3turn7search2

> **補足**  
> 以前のバージョン (v0.57 以前) では `@hey-api/schemas` も標準に含まれていましたが、v0.58.0 で外されました。必要なら自分で追加します。citeturn5search7

---

### 2 つの設定例の違い

| 設定 | `plugins` 配列の中身 | 生成される主なファイル |
|------|---------------------|------------------------|
| **例①** `...defaultPlugins` を展開 | `@hey-api/typescript` + `@hey-api/sdk` **に加えて**<br>`@hey-api/schemas`, `@hey-api/client-next`, `@tanstack/react-query`, `zod` など | - `types.gen.ts`<br>- `sdk.gen.ts`<br>- `schemas.gen.ts`<br>- Next.js 用クライアントコード など |
| **例②** 明示的に並べる | `@hey-api/client-fetch`, `@tanstack/react-query`, `zod`, `@hey-api/sdk` … **のみ**<br>（`@hey-api/typescript` がない） | - `sdk.gen.ts` のみ<br>（型ファイル `types.gen.ts` は出ない） |

つまり **`defaultPlugins` を外すと標準の型定義が生成されなくなる** ので、  

*「SDK だけ欲しい」→ `defaultPlugins` は不要  
*「型も SDK も欲しい」→ `...defaultPlugins` を入れる  

というイメージです。

---

### どう書けば良いか？

```ts
import { defineConfig, defaultPlugins } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "./openapi.json",
  output: "src/generated/backend-client",
  plugins: [
    // 標準の型 & SDK
    ...defaultPlugins,

    // ↓ここから用途に応じて追加
    "@hey-api/schemas",
    {
      name: "@hey-api/client-next",
      runtimeConfigPath: "./src/hey-api.ts",
    },
    "@tanstack/react-query",
    "zod",
  ],
});
```

* **基本的に `...defaultPlugins` を先頭に展開** → 型と SDK を確保  
* 標準出力を削りたい場合だけ、`defaultPlugins` を使わずに必要なプラグインを列挙  

というルールで覚えておくと混乱しません。

---

#### よくある疑問

| 疑問 | 答え |
| ---- | ---- |
| **順番は重要？** | はい。`defaultPlugins` は依存される側なので **なるべく配列の先頭** に置き、後続のプラグイン（React Query など）がそれを再利用できるようにします。 |
| **`defaultPlugins` の中身をカスタマイズしたい** | `defaultPlugins` を展開せず、自分で `@hey-api/typescript` と `@hey-api/sdk` をオブジェクト形式で書き直せば個別オプションを渡せます。 |
| **型ファイルは要らないが SDK だけ欲しい** | `plugins: ["@hey-api/sdk"]` のように `@hey-api/typescript` を省けば OK です。 |

これで `defaultPlugins` の役割と使いどころのイメージが掴めるはずです。

---
