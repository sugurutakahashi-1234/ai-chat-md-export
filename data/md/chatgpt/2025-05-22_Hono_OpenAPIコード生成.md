# Hono OpenAPIコード生成

日付: 2025-05-22

---

## 👤 ユーザー
*2025/05/22 17:11:37*

hono を使っていて、OpenAPIでのコード生成をしたい
以下のライブラリのどれを使うと良さそうか？

https://github.com/honojs/middleware/tree/main/packages/zod-openapi
https://github.com/rhinobase/hono-openapi
https://github.com/openapi-ts/openapi-typescript
https://github.com/hey-api/openapi-ts

今から新規に開発するとする。
クライアント側にコードを提供するのと、型安全だったり、APIのテストの用意製だったりを比較したい

---

## 🤖 アシスタント
*2025/05/22 17:13:06*

**概要（TL;DR）**  
- **サーバ側で OpenAPI を“書かずに”自動生成したい**場合は **@hono/zod-openapi**（最小構成）か **hono-openapi**（複数バリデータ対応）を選ぶ。  
- **生成した OpenAPI ⽂書からクライアント／SDK／型を作り込みたい**場合は  
  - 軽量で TypeScript 型だけ欲しい → **openapi-typescript**（+ openapi-fetch 等）  
  - SDK・Zod などもまとめて欲しい → **@hey-api/openapi-ts**。  
- 典型的な構成は「**hono-openapi → openapi-typescript / hey-api**」の 2 ステップ。  
- どちらも使わず **hono だけ**で完結させたい場合は **@hono/zod-openapi** が最もシンプル。  

---

## 1. サーバ側で OpenAPI を生成する選択肢

### 1.1 `@hono/zod-openapi`
| 項目 | 内容 |
|---|---|
| 主な役割 | Zod スキーマ＋Hono ルーティング → OpenAPI 3.0 JSON を生成し `/doc` に Swagger UI をホストciteturn5view0 |
| 型安全 | ルート定義と同時に Zod でバリデーション。`c.req.valid()` の戻り値も型安全citeturn5view0 |
| テスト準備 | 生成された spec を Schemathesis 等にそのまま渡せるが、モック／SDKは別途生成が必要 |
| 現状と課題 | 本家 mono-repo の 1 パッケージ。バグ報告やパラメータ推論の欠落 Issue が散見citeturn7search6turn7search3 |

### 1.2 `hono-openapi` (rhinobase)
| 項目 | 内容 |
|---|---|
| 主な役割 | Zod／Valibot／ArkType／TypeBox／Effect など多様なバリデータ → OpenAPI 生成（Swagger UI 同梱）citeturn8view0 |
| 型安全 | 好みのバリデータを選べるため既存コードを移行しやすい |
| テスト準備 | spec 生成まで。MSW モックや SDK は下流ツールを組み合わせる |
| 活発度 | ★549・コミット継続中（2025-04 以降も Release あり）citeturn0search5turn8view0 |
| 注意点 | “still in development” と明記されており API が揺れる可能性citeturn8view0 |

---

## 2. OpenAPI からクライアント／型を生成する選択肢

### 2.1 `openapi-typescript` (+ `openapi-fetch` など)
| 項目 | 内容 |
|---|---|
| 主な役割 | OpenAPI 3.x/3.1 → TypeScript 型 (`paths`, `components`) を 0 依存・0 ランタイムで生成citeturn1view0 |
| 補助ライブラリ | `openapi-fetch`（型安全な fetch ラッパ、6 kB）citeturn4search0、React Query/SWR ラッパなど複数citeturn4search2turn4search6 |
| テスト | `openapi-msw` により MSW のハンドラを型安全に生成可citeturn11search0 |
| 特色 | ★6.9k、Used by 142k+ パッケージ。CLI 一発で型だけ得られるため最軽量citeturn1view0 |

### 2.2 `@hey-api/openapi-ts`
| 項目 | 内容 |
|---|---|
| 主な役割 | プラグイン方式で **型・SDK・バリデータ・JSON Schema・モック** 等を一括生成citeturn9view0 |
| 生成物 | `types.gen.ts`, `sdk.gen.ts`, `client.gen.ts`, `schemas.gen.ts` などフォルダごと出力citeturn10search2 |
| バリデータ | Zod プラグイン β 版あり。SDK 内でレスポンス検証も可能citeturn10search0 |
| クライアント | Fetch / Axios / Next / Nuxt 用クライアントを自動生成citeturn10search5 |
| テスト | 近日 MSW・Faker・Supertest 等プラグイン予定（Roadmap に記載）citeturn10search1 |
| 特色 | ★2.5k。設定項目は多いが「全部入り」が欲しい場合に便利 |

---

## 3. 比較サマリ

| 目的/観点 | @hono/zod-openapi | hono-openapi | openapi-typescript | @hey-api/openapi-ts |
|---|---|---|---|---|
| **用途** | Hono ルート → spec | マルチバリデータ → spec | spec → 型 | spec → 型+SDK+検証 |
| **依存** | Zod | 任意 (5種) | 0 (CLI 時のみ) | plugin 次第 |
| **クライアント生成** | なし | なし | 別途 openapi-fetch 等 | SDK 自動生成 |
| **テスト支援** | spec まで | spec まで | openapi-msw 等 | SDK 内部検証、将来 MSW |
| **学習コスト** | 低 | 中 | 低 | 中〜高 |
| **成熟度** | 本家公式 ext. | 新興・開発中 | 非常に成熟 | 急成長中 |
| **推奨シナリオ** | 小規模・Zod 固定 | バリデータを選びたい | 軽量フロント・型だけ | フルスタック・SDK/モック一括 |

---

## 4. 具体的な開発フロー例

### A. 軽量フロント向け
```text
Hono (hono-openapi) ──> openapi.json
                     └─> npx openapi-typescript openapi.json -o src/api/types.d.ts
                     └─> openapi-fetch で型安全呼び出し
```
- MSW での結合テストも `openapi-msw` で即導入可。

### B. SDK 配布 & 高い DX が必要
```text
Hono (hono-openapi or @hono/zod-openapi) ──> openapi.json
                                           └─> pnpm openapi-ts --config openapi.config.mjs
```
- `plugins: ['@hey-api/client-fetch', 'zod']` などを設定すれば  
  Zod 付き SDK が `src/client` に生成され、外部クライアントにもそのまま配布可能。

---

## 5. 補足: 代替ツール
- **orval**: React/Vue/Svelte Query フックや MSW モックもまとめて生成（★4k）citeturn11search9。  
- **Speakeasy** など SaaS 連動型のコードジェンもあるが、OSS ベースで完結したい場合は上記 4 つが定番。

---

### 結論
1. **Hono のルートをそのまま OpenAPI にしたい** → まずは **@hono/zod-openapi** で検証し、Zod に縛られたくない場合は **hono-openapi**。  
2. **クライアント側へ型 or SDK を配布したい** →  
   - 軽量志向なら `openapi-typescript + openapi-fetch`。  
   - SDK・バリデーション・将来のモック生成まで一括なら `@hey-api/openapi-ts`。  
3. 迷ったら **「hono-openapi + openapi-typescript」**が学習コストと拡張性のバランスが取れていて、将来 @hey-api へ乗り換えることも容易です。

---

## 👤 ユーザー
*2025/05/22 17:33:50*

PrismaやZodの役割を追加で聴きたい。いわゆるopenapi.yamlの生成はどのツールが行うのかも気になる

---

## 🤖 アシスタント
*2025/05/22 17:34:33*

**まとめ**  
- **Zod = APIリクエスト/レスポンスを“型＋実行時バリデーション”で表現する層**。`@hono/zod-openapi` や `hono-openapi` が Zod スキーマを拾って OpenAPI 3.0/3.1 の **components/schema** を生成し、`app.doc()` や CLI で `openapi.yaml|json` を出力する仕組みです【turn0search6】【turn2search2】。  
- **Prisma = DB モデル→型安全クエリを作る ORM**。OpenAPI 生成には直接関与しないが、**Prisma→Zod** へスキーマを自動生成するジェネレータがあり（`prisma-zod-generator` など）、この Zod をそのまま API バリデーション & OpenAPI に流用できるため “DB→API→フロント” を 1 本の型で貫通できます【turn1view3】【turn0search9】。  
- **openapi.yaml の生成元**  
  | 生成ツール | 出力責務 | コマンド/呼び出し例 |
  |------------|-----------|--------------------|
  | **@hono/zod-openapi** | Zod 付き Hono ルート → `openapi.{json|yaml}` | `app.doc('/doc', …)` または `npx zod-openapi export -o spec.yaml`【turn0search6】【turn2search1】 |
  | **hono-openapi** | 任意バリデータ対応ミドルウェア → spec | `npx hono-openapi ./src/**/*.ts --output spec.yaml`【turn2search2】【turn2search9】 |
  | **zod-openapi (純粋ライブラリ)** | Zod スキーマ → spec (Hono 無しでも可) | `generateSchema()` API【turn0search5】 |
  | **Prisma** | OpenAPI 生成機能は公式に無し（issue #5757）【turn0search4】 |
  | **openapi-typescript / @hey-api/openapi-ts** | **既存** spec を消費して TypeScript 型や SDK を生成する。spec を作る機能は持たない【turn0search1】【turn0search2】 |

---

## 1. Zod の役割と流れ

### 1.1 実行時バリデーション + 型宣言
Zod は `z.object({ ... })` でスキーマを宣言し、同時に TypeScript 型を推論するため **型安全** と **ランタイム検証** を両立します【turn0search11】。

### 1.2 OpenAPI への橋渡し
`@hono/zod-openapi` や `hono-openapi` は  
```ts
const route = createRoute({ request: { body: UserSchema }, ... })
```
のように **Zod スキーマに `.openapi()` メタデータ** を埋め込み、ルート登録と同時に OpenAPI の paths/components を生成します【turn1view0】【turn2search2】。

### 1.3 フロント側にも再利用
生成された spec は `openapi-typescript` で **型だけ** を、`@hey-api/openapi-ts` で **型+SDK+Zod バリデータ** を取り出せるため、Zod → OpenAPI → Zod という往復が可能です【turn0search1】【turn0search2】。

---

## 2. Prisma の役割と流れ

### 2.1 DB モデル定義
Prisma の `schema.prisma` はテーブル/リレーションを宣言し、`prisma generate` で型安全クライアントを作ります【turn0search10】。

### 2.2 Zod との連携
- **`prisma-zod-generator`** や **`zod-prisma-types`** を `generator` ブロックに追加すると、モデルごとに `UserSchema`, `PostCreateSchema` などの **Zod スキーマが自動生成** されます【turn1view3】【turn0search9】。  
- これらをそのまま Hono ルートの `request`/`responses` に渡せば、**DB→API→OpenAPI→フロント** まで型が一気通貫します。

### 2.3 OpenAPI 直接生成は未対応
Prisma から直接 OpenAPI を吐く公式機能はなく、GitHub Discussion でも “別途ジェネレータを書くしかない” と明言されています【turn0search4】。

---

## 3. openapi.yaml を誰が作るか

1. **Hono でルートを書く → (`@hono/zod-openapi` or `hono-openapi`) が⾃動で spec を組み立てる**  
   - 開発中は `/doc` に Swagger UI、リリース時は `npx zod-openapi export -o openapi.yaml` や `hono-openapi` CLI でファイルを書き出す。  
2. **spec を渡してクライアント側を生成**  
   - `openapi-typescript` → typings + `openapi-fetch` で軽量 call【turn0search1】  
   - `@hey-api/openapi-ts` → typings + SDK + Zod schemas【turn0search2】  
3. **テスト/モック**  
   - spec を `schemathesis` でプロパティテスト、`openapi-msw` で MSW モック生成【turn0search0】。

---

## 4. 選択ガイド（Prisma & Zod 活用前提）

| 規模 / 要件 | 推奨構成 |
|-------------|-----------|
| **小規模 or 新規で Zod 固定** | `@hono/zod-openapi` → `openapi-typescript` |
| **既存 Hono に後付け・バリデータ混在** | `hono-openapi` (Zod/Valibot など) → `openapi-typescript` |
| **SDK / バリデーションも配布したい** | `hono-openapi` → `@hey-api/openapi-ts (plugins: client-fetch, zod)` |
| **DB モデルと API 型を 100% 揃えたい** | Prisma + `prisma-zod-generator` → Zod → `hono-openapi` → spec |

このように **Zod が API 型の“ハブ”**、**Prisma が DB 型の“ソース”**、そして **spec 生成の主役は Hono 側ミドルウェア** という役割分担が最もメンテしやすい構成になります。

---

## 👤 ユーザー
*2025/05/22 17:39:41*

prismaはいらなそうだね。

以下の記述がどういうことだか分からない。最小の具体例がほしい
生成された spec は openapi-typescript で 型だけ を、@hey-api/openapi-ts で 型+SDK+Zod バリデータ を取り出せるため

---

## 🤖 アシスタント
*2025/05/22 17:40:16*

**要点まとめ**  
OpenAPI → TypeScript のコード生成は **2 段階**に分けて考えると分かりやすいです。  
1) **spec を食べて型だけ欲しい**なら `openapi-typescript`。  
2) **型 + SDK + Zod バリデータも欲しい**なら `@hey-api/openapi-ts`。  
以下では **最小 25 行の `openapi.yaml`** を用意し、両ツールで生成物と使い方を比較します。

---

## 1. 準備：極小 `openapi.yaml`

```yaml
openapi: 3.1.0
info:
  title: Todo API
  version: 1.0.0
paths:
  /todos:
    get:
      summary: List todos
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: array
                items: { $ref: '#/components/schemas/Todo' }
    post:
      summary: Create todo
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/NewTodo' }
      responses:
        '201':
          description: Created
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Todo' }
components:
  schemas:
    Todo:
      type: object
      required: [id, title, completed]
      properties: { id: { type: integer }, title: { type: string }, completed: { type: boolean } }
    NewTodo:
      type: object
      required: [title]
      properties: { title: { type: string }, completed: { type: boolean } }
```

---

## 2. 型「だけ」が欲しい場合 — **openapi-typescript**

### 2-1 インストール & 生成
```bash
pnpm add -D openapi-typescript           # 1.7 MB 依存ゼロ
npx openapi-typescript openapi.yaml -o src/api/types.ts
```  
`openapi-typescript` は YAML/JSON/リモート URL も直接読めますciteturn0search0turn0search3。

### 2-2 中身（自動生成された一部）
```ts
export interface paths {
  '/todos': {
    get: { responses: { 200: { content: { 'application/json': components['schemas']['Todo'][] } } } };
    post: {
      requestBody: { content: { 'application/json': components['schemas']['NewTodo'] } };
      responses: { 201: { content: { 'application/json': components['schemas']['Todo'] } } };
    };
  };
}

export interface components {
  schemas: {
    Todo: { id: number; title: string; completed: boolean };
    NewTodo: { title: string; completed?: boolean };
  };
}
```

### 2-3 呼び出し例（`openapi-fetch` を併用）
```ts
import createClient from 'openapi-fetch';
import type { paths } from './api/types';

const client = createClient<paths>({ baseUrl: 'https://api.example.com' });
const { data } = await client.GET('/todos'); // data は Todo[] と推論
```  
`openapi-fetch` は 6 kB・依存 1 つで型安全フェッチを提供しますciteturn2search3turn2search7。

&gt; **ここまでの生成物**は *pure TS 型のみ*。SDK もバリデータも付きません。

---

## 3. 型 + SDK + Zod が欲しい場合 — **@hey-api/openapi-ts**

### 3-1 インストール
```bash
pnpm add -D @hey-api/openapi-ts @hey-api/plugin-client-fetch
```

### 3-2 設定ファイル `openapi-ts.config.ts`
```ts
import { defineConfig, defaultPlugins } from '@hey-api/openapi-ts';

export default defineConfig({
  input: './openapi.yaml',
  output: './src/client',
  plugins: [
    ...defaultPlugins,      // = types.gen.ts, sdk.gen.ts など
    '@hey-api/client-fetch',// fetch ベース SDK
    'zod',                  // Zod スキーマ生成
  ],
});
```  
plugin 方式で好きな生成物を足し引きできますciteturn0search4turn1search0。

### 3-3 生成コマンド
```bash
pnpm openapi-ts
```  
CLI は spec を読み取り **`types.gen.ts` / `sdk.gen.ts` / `client.gen.ts` / `schemas.gen.ts`** を吐きますciteturn0search1turn0search7turn1search3。

### 3-4 使い方（SDK + Zod）
```ts
import { getTodos } from './client/sdk.gen';
import { TodoSchema } from './client/schemas.gen';

const todos = await getTodos();          // → Todo[]
TodoSchema.array().parse(todos);         // ランタイム検証も一行
```

&gt; - **`types.gen.ts`** … `openapi-typescript` 相当の型  
&gt; - **`sdk.gen.ts`** … 認証ヘッダや baseURL がまとめられた高レベル関数群  
&gt; - **`schemas.gen.ts`** … Zod で request/response/Component をすべてスキーマ化  
&gt; - 必要な plugin だけ残せば生成物は自由に減らせますciteturn1search1turn1search8。

---

## 4. 何を選べばいい？

| 欲しいもの | ツール | 生成物 | 特徴 |
|------------|--------|--------|------|
| **型だけ**                | openapi-typescript | `types.ts` | 依存ゼロ・超軽量citeturn0search5 |
| **型 + 型安全 fetch**     | openapi-typescript + openapi-fetch | `types.ts` | fetch ラッパ 6 kBciteturn2search1turn2search3 |
| **型 + SDK + Zod**        | @hey-api/openapi-ts (plugins: client-fetch, zod) | `types.gen.ts`, `sdk.gen.ts`, `schemas.gen.ts` | plugin で拡張自由、実行時検証も自動citeturn1search0turn1search3 |

**迷ったら**：まず `openapi-typescript` だけで使い始め、  
「SDK が欲しい」「Zod も配りたい」と思った時点で `@hey-api/openapi-ts` に乗り換えても、spec はそのまま流用できます。

---

## 👤 ユーザー
*2025/05/22 17:43:02*

型と呼び出しのクライアントコードだけ生成したい。クライアント側はなるべく簡素にAPIコールしたいんだ。

---

## 🤖 アシスタント
*2025/05/22 17:43:39*

Here’s the most painless path today for **“types + tiny client”** generation:

- **Run one CLI command** to turn your `openapi.yaml` into TypeScript types with **openapi-typescript**.citeturn1view0
- **Add a 6 kB wrapper** called **openapi-fetch** that understands those types and gives you autocompleted `.GET()`, `.POST()` helpers.citeturn2view0  
  *Nothing else to configure, no codegen step for the client itself.*

If you’d rather have **ready-made SDK functions** (one function per endpoint) instead of the generic `.GET()` syntax, swap in **@hey-api/openapi-ts** with the `@hey-api/client-fetch` plugin.citeturn5view0turn3view0

Below are the two minimal workflows side-by-side.

---

## 1. Super-light: *openapi-typescript + openapi-fetch*

### 1-A  Install & generate

```bash
# dev-deps
pnpm add -D openapi-typescript
# tiny runtime client
pnpm add openapi-fetch

# one-liner: spec → types
npx openapi-typescript openapi.yaml -o src/api/types.d.ts
```
`openapi-typescript` only emits a single `.d.ts`; no runtime code, zero dependencies.citeturn4view0

### 1-B  Use in your app (7 lines)

```ts
import createClient from 'openapi-fetch';
import type { paths } from '@/api/types';

const client = createClient<paths>({ baseUrl: '/api' });

const { data } = await client.GET('/todos');          // data: Todo[]
await client.POST('/todos', { body: { title: 'new' }});
```
`createClient` infers methods, params and responses straight from the types—no manual generics.citeturn2view0  
The whole library is ~6 kB gzipped and adds “virtually zero runtime”.citeturn2view0

---

## 2. Still simple, but with generated SDK helpers

### 2-A  Install

```bash
pnpm add -D @hey-api/openapi-ts @hey-api/client-fetch
```

### 2-B  Config (`openapi-ts.config.ts`)

```ts
import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: './openapi.yaml',
  output: './src/client',
  plugins: ['@hey-api/client-fetch'],   // adds fetch-based SDK
});
```

### 2-C  Generate & call

```bash
pnpm openapi-ts        # emits types.gen.ts + client.gen.ts + sdk.gen.ts
```

```ts
import { getTodos } from '@/client/sdk.gen';

const todos = await getTodos();  // typed Todo[]
```

- `types.gen.ts` = same structural types as openapi-typescript.  
- `client.gen.ts` = a pre-configured fetch wrapper with interceptors, baseURL, auth helpers, etc.citeturn3view0  
- `sdk.gen.ts` = one function per endpoint (e.g. `getTodos`, `createTodo`).  

This gives you convenience while keeping runtime weight low (each file is tree-shakable).citeturn5view0

---

## 3. Why these two beat heavier alternatives

| Tool | What you get | Runtime size | Notes |
|------|--------------|--------------|-------|
| **openapi-typescript** + **openapi-fetch** | `.d.ts` types + generic typed client | **6 kB** client only | Fastest build, no extra codegen.citeturn2view0turn0search7 |
| **@hey-api/openapi-ts** (`client-fetch`) | Types + per-endpoint SDK + typed fetch | ~15–20 kB for client/SDK | Adds interceptors & auth helpers.citeturn3view0 |
| **orval** | Types + React Query/SWR hooks | 40 kB+ | Great for React Query stacks, heavier setup.citeturn0search4turn0search9 |

Both suggested paths avoid the 300 kB+ payload of older codegen solutions like `openapi-typescript-codegen`.citeturn2view0

---

## 4. Choosing quickly

- **You just need types & a tiny, fluent client** ➜ **openapi-typescript + openapi-fetch**.  
  - One CLI run, one import, done.  
- **You prefer “call functions, not URLs”** and maybe interceptors/auth built-in ➜ **@hey-api/openapi-ts** with `client-fetch`.  
  - Still minimal, but gives you an SDK layer for free.

Either route keeps your client-side codebase lean, fully typed, and virtually maintenance-free.

---

## 👤 ユーザー
*2025/05/22 17:44:33*

英語になってしまっている。

---

## 🤖 アシスタント
*2025/05/22 17:44:33*

以下では **「型だけ」＋** できるだけ軽量な **API クライアント** を生成する最短ルートを、すべて日本語で整理します。  

---

## 1. 超軽量ルート  
### ツール  
- **openapi-typescript** … OpenAPI → TypeScript 型（`.d.ts` のみ）  
- **openapi-fetch** … その型を理解して `client.GET()` / `client.POST()` などを提供する 6 kB ランタイム  

### 手順

```bash
# 開発依存
pnpm add -D openapi-typescript
# 実行時クライアント
pnpm add openapi-fetch

# spec → 型（.d.ts）
npx openapi-typescript openapi.yaml -o src/api/types.d.ts
```

### 使い方例（わずか 6 行）

```ts
import createClient from 'openapi-fetch';
import type { paths } from '@/api/types';

const api = createClient<paths>({ baseUrl: '/api' });

// GET /todos → Todo[]
const { data: todos } = await api.GET('/todos');

// POST /todos
await api.POST('/todos', { body: { title: 'new todo' } });
```

&gt; - 生成物は **型ファイル 1 つ**だけ。  
&gt; - openapi-fetch はインターセプターやリトライなど最低限の機能に絞られており、ランタイム負荷がほぼありません。

---

## 2. SDK 関数も欲しい場合（それでも簡素）

### ツール  
- **@hey-api/openapi-ts**  
  - plugin 方式で「型」「fetch ベース SDK」「Zod バリデータ」などを必要なぶんだけ出力  
- **@hey-api/plugin-client-fetch** … fetch ラッパ付き SDK を生成  

### 手順

```bash
pnpm add -D @hey-api/openapi-ts @hey-api/plugin-client-fetch

# openapi-ts.config.ts
import { defineConfig } from '@hey-api/openapi-ts';
export default defineConfig({
  input: './openapi.yaml',
  output: './src/client',
  plugins: ['@hey-api/client-fetch'], // SDK だけ欲しい
});

# 生成
pnpm openapi-ts
```

生成物（例）  
```
src/client/
├─ types.gen.ts   // openapi-typescript 相当
├─ client.gen.ts  // 共通 fetch ラッパ
└─ sdk.gen.ts     // getTodos(), createTodo() など*1 関数
```

### 呼び出し例

```ts
import { getTodos, createTodo } from '@/client/sdk.gen';

const todos = await getTodos();                 // Todo[]
await createTodo({ body: { title: 'new todo' }});
```

*1: エンドポイントごとに 1 関数。ベース URL・認証ヘッダ設定もラッパ内に集約。

---

## 3. どちらを選ぶ？  

| 欲しいレベル | 推奨構成 | 特徴 |
|--------------|----------|------|
| **型 + 最小クライアント** | openapi-typescript + openapi-fetch | コマンド 1 回、依存ほぼゼロ、導入最速 |
| **型 + SDK 関数** | @hey-api/openapi-ts + client-fetch | エンドポイントごとに関数／共通 fetch 設定も自動生成 |

&gt; **迷ったら**まず *openapi-typescript + openapi-fetch* から始め、  
&gt; 「関数呼び出しの SDK が欲しい」と思った時点で *@hey-api/openapi-ts* に乗り換えても `openapi.yaml` はそのまま使えます。

---

## 👤 ユーザー
*2025/05/22 17:46:41*

interceptorでAccesstokenを追加したり、共通のヘッダーを付けたりしたい場合のコードの差を教えて欲しい

---

## 👤 ユーザー
*2025/05/22 17:47:33*

interceptorでAccesstokenを追加したり、共通のヘッダーを付けたりしたい場合のコードの差を教えて欲しい。また、リクエスト時とレスポンスに型が指定されている例にしてほしい

---

## 🤖 アシスタント
*2025/05/22 17:47:53*

### 前提

- **OpenAPI 定義は先ほどの最小 `openapi.yaml`**（`/todos` の *GET* / *POST*）を想定  
- 生成物  
  - **openapi-typescript** → `src/api/types.d.ts` に `paths` 型  
  - **@hey-api/openapi-ts + client-fetch** →  
    `src/client/types.gen.ts`, `client.gen.ts`, `sdk.gen.ts`

---

## 1. openapi-fetch（openapi-typescript の組み合わせ）

```ts
// src/lib/api.ts
import createClient, { type Middleware } from 'openapi-fetch';
import type { paths } from '@/api/types';

// ❶ アクセストークンと共通ヘッダーを付与するミドルウェア
const authMiddleware: Middleware = {
  async onRequest({ request }) {
    const token = localStorage.getItem('accessToken');
    request.headers.set('Authorization', `Bearer ${token}`);
    request.headers.set('X-App-Version', '1.2.3');
    return request;                       // ← 必ず返す
  },
};

export const api = createClient<paths>({
  baseUrl: '/api',
});

// ミドルウェアを登録
api.use(authMiddleware);
```

### 1-A. 型付きリクエスト／レスポンス例

```ts
// Todo を 1 件登録
const res = await api.POST('/todos', {
  body: { title: '買い物', completed: false }, // 型: components['schemas']['NewTodo']
});
/* res.data の推論型
 * └ components['schemas']['Todo'] つまり
 *    { id: number; title: string; completed: boolean }
 */
console.log(res.data.id);
```

&gt; `api.POST` の **第 2 引数**で `body` を渡すと自動で `Content-Type: application/json` が付きます。  
&gt; ミドルウェアは `client.use()` で**複数登録**可。順序は登録順に実行されますciteturn1view0。

---

## 2. @hey-api/openapi-ts（client-fetch プラグイン）

```ts
// 生成済みの client.gen.ts からインポート
import { client } from '@/client/client.gen';

// ❶ 一括設定：共通ヘッダー & 動的トークン
client.setConfig({
  baseUrl: '/api',
  headers: { 'X-App-Version': '1.2.3' },
  auth: () => `Bearer ${localStorage.getItem('accessToken')}`, // 認証用
});
```

&gt; `auth` に関数を渡すと、**各リクエスト前に実行され Authorization ヘッダーが注入**されますciteturn2view0。

### 2-A. SDK 関数の呼び出し（型自動付与）

```ts
import { createTodo, getTodos } from '@/client/sdk.gen';

// Todo 作成（リクエスト型は自動補完）
const todo = await createTodo({
  body: { title: '散歩', completed: false },  // 型: NewTodo
});
todo.id; // number 型

// 一覧取得（レスポンス型は Todo[]）
const todos = await getTodos();
```

### 2-B. インターセプターで追加制御したい場合

```ts
// リクエストインターセプター
client.interceptors.request.use((request) => {
  request.headers.set('X-Trace-Id', crypto.randomUUID());
  return request;
});

// レスポンスインターセプター
client.interceptors.response.use(async (response) => {
  if (response.status === 401) {
    // 例: トークンリフレッシュやリダイレクト処理
  }
  return response;
});
```

&gt; `interceptors.request.use()` / `response.use()` で **ミドルウェア的に追加処理**が可能ですciteturn2view0。  

---

## 3. コードの差分まとめ

| 観点 | openapi-fetch | @hey-api/client-fetch |
|------|---------------|-----------------------|
| **ヘッダー追加** | `client.use({ onRequest })` で `Request` を直接編集 | `client.setConfig({ headers, auth })` で静的／動的に付与 |
| **アクセストークン** | ミドルウェア内で `headers.set('Authorization', \`Bearer ${token}`)` | `auth: () => 'Bearer ' + token`（必要なエンドポイントだけ自動付与） |
| **レスポンス処理** | `onResponse` で共通ハンドリング | `interceptors.response.use()` |
| **型付き呼び出し** | `api.GET('/path')`, `api.POST('/path', { body })` | `getFoo()`, `createBar()` などエンドポイント名関数 |
| **SDK 生成** | なし（汎用 GET/POST 呼び出しのみ） | あり（1 関数 = 1 エンドポイント） |
| **ランタイムサイズ** | ~6 kB | ~15–20 kB（SDK 分を含む） |

**選び方の目安**

- **とにかく最小構成**：`openapi-typescript + openapi-fetch`（ヘッダーも Middleware で OK）  
- **エンドポイント関数が欲しい・認証フラグを spec に書いている**：`@hey-api/openapi-ts + client-fetch`

どちらも **リクエスト／レスポンス型は自動で推論**されるため、型注釈なしで IDE 補完が効き、安心して API コールを記述できます。

---

## 👤 ユーザー
*2025/05/22 17:49:30*

リクエストにも型定義があるとして欲しい。

---

## 🤖 アシスタント
*2025/05/22 17:49:31*

以下では **「リクエスト本体にも型が付く」** ことをコードでハッキリ示します。  
（OpenAPI = 前回の `/todos` エンドポイントを想定）

---

## 1. openapi-typescript + openapi-fetch

### 1-A. 型はどこにある？

```ts
// openapi-typescript が自動生成した型ファイルから
import type {
  // ↓ POST /todos のリクエスト本文型（application/json）
  paths,
  components,
} from '@/api/types';

// 取り出し例（どちらでも同じ型）
type NewTodo = components['schemas']['NewTodo'];
//   or
type NewTodoAlt =
  paths['/todos']['post']['requestBody']['content']['application/json'];
```

### 1-B. 実際の呼び出し

```ts
import createClient from 'openapi-fetch';
import type { paths } from '@/api/types';

const api = createClient<paths>({ baseUrl: '/api' });

const body: NewTodo = { title: '掃除', completed: false }; // 型チェック OK

const { data } = await api.POST('/todos', { body }); // body の型ミスマッチは即エラー
// data の型 = components['schemas']['Todo']
```

**ポイント**

- **リクエスト本文も完全に型安全**：間違ったプロパティや型はコンパイルで検出。  
- openapi-fetch は `body` の型情報を読んで `Content-Type` を自動設定。  

---

## 2. @hey-api/openapi-ts (+ client-fetch プラグイン)

&gt; 生成物：`types.gen.ts`（型） / `sdk.gen.ts`（SDK 関数） / `client.gen.ts`（fetch ラッパ）

### 2-A. 型の取り出し

```ts
import type {
  components,
  operations,
} from '@/client/types.gen'; // 自動生成

type NewTodo = components['schemas']['NewTodo'];

// operations からも取得可（“operationId” ベース）
type CreateTodoRequest =
  operations['createTodo']['requestBody']['content']['application/json'];
```

### 2-B. 呼び出し（SDK 関数版）

```ts
import { client } from '@/client/client.gen';
import { createTodo } from '@/client/sdk.gen';

client.setConfig({
  baseUrl: '/api',
  auth: () => `Bearer ${localStorage.getItem('accessToken')}`,
});

// 型付きリクエスト
const body: NewTodo = { title: 'ランニング', completed: false };
const todo = await createTodo({ body }); // body 型が違えばコンパイルエラー

todo.id; // number 型
```

### 2-C. Zod 検証を追加する場合（任意）

`plugins: ['@hey-api/client-fetch', 'zod']` を追加すると  
`schemas.gen.ts` が生成され、ランタイムチェックもワンライナー。

```ts
import { NewTodoSchema } from '@/client/schemas.gen';

NewTodoSchema.parse(body); // 実行時にも形を保証
```

---

## 3. 違いをもう一度整理

|              | openapi-typescript + openapi-fetch | @hey-api/openapi-ts (client-fetch) |
|--------------|-------------------------------------|------------------------------------|
| **リクエスト型取得** | `components['schemas']['Foo']` または `paths['/route']['post']['requestBody']...` | 同様に `components` / `operations` から取得 |
| **呼び出し方法** | `api.POST('/route', { body })` | `createFoo({ body })` など関数形式 |
| **本文の型チェック** | TS コンパイル時に保証 | TS コンパイル時に保証 |
| **実行時検証** | なし（必要なら手動で Zod 自作） | Zod プラグイン追加で自動生成 |
| **コード量 / 依存** | 最小（型 + 6 kB クライアント） | SDK 分だけやや増（～15 kB） |

**まとめ**  

- **型だけで十分／自前の fetch ラッパで良い** → *openapi-typescript + openapi-fetch*  
- **関数 SDK や Zod 実行時検証も欲しい** → *@hey-api/openapi-ts*（client-fetch + zod プラグイン）  

どちらのルートでも **リクエストもレスポンスも完全に型定義される** ため、  
開発中に “渡す JSON の形が違う” といったバグを未然に防げます。

---

## 👤 ユーザー
*2025/05/22 17:50:54*

関数 SDK や Zod 実行時検証とはどういうことか？ openapi-typescript + openapi-fetchでは得られない恩恵としてどのようなものがあるのか？

---

## 🤖 アシスタント
*2025/05/22 17:50:55*

### 1. “関数 SDK” とは？

|  | openapi-fetch | **`@hey-api/client-fetch` が生成する SDK** |
|---|---|---|
| 呼び出し方 | `client.GET('/todos', { query, body })` | `getTodos({ query })`&lt;br&gt;`createTodo({ body })` |
| ルート | 文字列で指定（`'/todos'`） | **関数名にエンドポイントが埋め込まれている**&lt;br&gt;（書き間違いの余地ゼロ） |
| 共通設定 | `client = createClient({ baseUrl })`&lt;br&gt;ミドルウェアで拡張 | 生成済みの `client.gen.ts` に&lt;br&gt;`setConfig({ baseUrl, headers, auth…})` |
| 追加機能 | onRequest / onResponse ミドルウェア | 上記＋&lt;br&gt;‐ 自動リトライ・タイムアウト&lt;br&gt;‐ 401 ⇒ トークン再取得フック&lt;br&gt;‐ `operationId` を使った&lt;strong&gt;名前付きエラー&lt;/strong&gt;型 |

&gt; **メリット**  
&gt; - **文字列ルートが消える**→打ち間違えを 100 % 防止。  
&gt; - 共通処理（認証ヘッダ・リトライ等）が **コード生成時点**で埋め込まれるので、呼び出し側は「関数を呼ぶだけ」。  
&gt; - API 変更時は `pnpm openapi-ts` を再実行すれば、**関数リストが自動同期**。存在しないエンドポイントはビルドで即エラー。

---

### 2. “Zod 実行時検証” とは？

|  | **コンパイル時** | **実行時（ランタイム）** |
|---|---|---|
| openapi-typescript | 型チェック ✅ | **なし**：サーバーが仕様と違う JSON を返しても、型だけを信じてそのまま使う |
| **`@hey-api/openapi-ts` + `zod` プラグイン** | 型チェック ✅ | **Zod スキーマで `.parse()`** → 仕様と違えば即例外 → バグを早期検知 |

#### 2-A. コード例

```ts
import { getTodos } from '@/client/sdk.gen';
import { TodoArraySchema } from '@/client/schemas.gen'; // Zod

// サーバー応答を取得
const todos = await getTodos();      // 型: Todo[]

// ランタイムでも保証
TodoArraySchema.parse(todos);        // shape が違えばここで throw
```

**こうなると：**

| ケース | openapi-fetch だけ | SDK + Zod |
|---|---|---|
| サーバーが `id` を string で返した | ❌ フロントで気づかず run-time error | ✅ `.parse()` が例外を投げてバグを即発見 |
| フロントの Form でも同じ検証を使いたい | 手書き | `TodoSchema` を再利用するだけ |
| E2E テストでモックを自動生成 | 自前で MSW 定義 | MSW プラグイン追加で&lt;br&gt;**型安全モック自動生成**（β） |

---

### 3. まとめ ― openapi-fetch で十分？ それとも SDK＋Zod？

| 観点 | **openapi-typescript + openapi-fetch** | **@hey-api/openapi-ts (+ client-fetch, zod)** |
|------|----------------------------------------|----------------------------------------------|
| ファイル数 / サイズ | `.d.ts`1 枚 + 6 kB ランタイム | 型 + SDK + (Zod) ≈ 15 kB〜 |
| 呼び出しの簡潔さ | URL + メソッドを毎回書く | エンドポイント名関数を呼ぶだけ |
| 共通処理 | Middleware 手作業 | `setConfig()` や生成済み interceptors |
| 仕様ズレ検知 | **コンパイル時のみ** | **コンパイル＋実行時** |
| モック / テスト自動化 | 別ツールを手動連携 | プラグインで自動生成可 |
| おすすめ用途 | **最小構成・個人開発**&lt;br&gt;ランタイム検証は不要 | **チーム開発・API が変わりやすい**&lt;br&gt;実行時保証と自動 SDK が欲しい |

&gt; **結論**  
&gt; - **小規模で「とにかく軽く」**：`openapi-typescript + openapi-fetch`  
&gt; - **型安全だけでなく“実行時保証”も欲しい／複数開発者で API が揺れる**：`@hey-api/openapi-ts` + `client-fetch` + `zod` プラグイン  

どちらも同じ `openapi.yaml` を入力にできるので、**まず軽量構成で始め → 将来 SDK＋Zod に乗り換え**という段階的採用も簡単です。

---

## 👤 ユーザー
*2025/05/22 18:54:50*

なるほどこうなると@hey-api/openapi-ts (+ client-fetch, zod)
が良さそうである、

では最初のyamlファイルを生成するライブラリはどれがいいのだろうか？最小コードで比較して欲しい

---

## 🤖 アシスタント
*2025/05/22 18:56:14*

**Hono で *openapi.yaml* を“自動生成”する最短サンプル２種**  
（どちらも *25 行前後*。生成された spec は `@hey-api/openapi-ts` 側にそのまま渡せます）

|                     | **@hono/zod-openapi**&lt;br&gt;(Zod 専用・公式サブパッケージ) | **hono-openapi**&lt;br&gt;(複数バリデータ対応・コミュニティ製) |
|---------------------|---------------------------------------------------------|-----------------------------------------------------------|
| バリデータ          | **Zod 固定**                                           | Zod / Valibot / ArkType / TypeBox / Effect から選択 |
| ルート記述          | `createRoute()` で **宣言的**                             | `describeRoute()` で宣言的＋通常の Hono ミドルウェア |
| spec 配信           | `app.doc('/doc')` → `/doc` で JSON + Swagger UI        | `openAPISpecs()`→`/openapi` で JSON (UI はお好みで) |
| ファイル出力        | `curl http://.../doc > openapi.json` などで保存        | `generateSpecs(app, opts)` で **コード内で書き出し**citeturn8view0 |
| 特徴               | 公式・最小構成／Zod に統一済みなら一番手軽             | バリデータ混在プロジェクトでも移行しやすい／応用機能多 |

---

## 1. **@hono/zod-openapi** – 22 行

```ts
// src/server.ts
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'

const Todo = z.object({
  id: z.number(),
  title: z.string(),
  completed: z.boolean(),
}).openapi('Todo')

const NewTodo = Todo.omit({ id: true }).openapi('NewTodo')

const createTodo = createRoute({
  method: 'post',
  path: '/todos',
  request: {
    body: {
      content: { 'application/json': { schema: NewTodo } },
    },
  },
  responses: {
    201: {
      content: { 'application/json': { schema: Todo } },
      description: 'Created',
    },
  },
})

const app = new OpenAPIHono()

app.openapi(createTodo, (c) => {
  const body = c.req.valid('json')
  return c.json({ ...body, id: 1 }, 201)
})

// /doc で Swagger UI + JSON spec
app.doc('/doc', { openapi: '3.1.0', info: { title: 'Todo', version: '1.0.0' } })

export default app
```
- **保存したいとき**：`curl http://localhost:8787/doc > openapi.yaml` などで取得可。  
- 依存は `hono`, `zod`, `@hono/zod-openapi` の３つだけ。citeturn2view0

---

## 2. **hono-openapi**（Zod 使用例） – 24 行

```ts
// src/server.ts
import { Hono } from 'hono'
import { describeRoute, openAPISpecs } from 'hono-openapi'
import { resolver, validator as zV } from 'hono-openapi/zod'
import { z } from 'zod'
import 'zod-openapi/extend'          // ← .openapi() を使う場合に追加

const Todo = z.object({
  id: z.number(),
  title: z.string(),
  completed: z.boolean(),
}).openapi('Todo')

const NewTodo = Todo.omit({ id: true }).openapi('NewTodo')

const app = new Hono()

app.post(
  '/todos',
  describeRoute({
    summary: 'Create Todo',
    requestBody: {
      content: { 'application/json': { schema: resolver(NewTodo) } },
    },
    responses: {
      201: { content: { 'application/json': { schema: resolver(Todo) } } },
    },
  }),
  zV('json', NewTodo),
  (c) => c.json({ ...(c.req.valid('json')), id: 1 }, 201),
)

// /openapi で JSON spec を返す
app.get('/openapi', openAPISpecs(app, {
  documentation: { info: { title: 'Todo', version: '1.0.0' } },
}))

export default app
```
- **ファイル出力**：  

  ```ts
  import { generateSpecs } from 'hono-openapi'
  await generateSpecs(app).then(spec =>
    Bun.write('openapi.yaml', JSON.stringify(spec, null, 2)))
  ```  
  JSON → YAML 変換は yq などでワンライナー。citeturn9view0
- Zod 以外のバリデータに差し替える場合は `hono-openapi/{valibot|arktype...}` を import するだけ。citeturn1view0

---

## 3. どちらを選ぶ？

| プロジェクト状況 | ベターな選択 |
|------------------|--------------|
| **最初から Zod 一本で行く／公式エコシステムに寄せたい** | **@hono/zod-openapi** |
| **既に複数バリデータを混在／Zod 以外も検討したい** | **hono-openapi** |
| **将来 spec をコード内で自動保存したい** | hono-openapi（`generateSpecs()` が便利） |

どちらで生成した YAML/JSON も、  
```bash
pnpm openapi-ts            # @hey-api/openapi-ts
```
に渡せば **型＋SDK＋Zod 検証付きクライアント**がワンコマンドで手に入ります。

---

## 👤 ユーザー
*2025/05/22 19:00:21*

Zod 以外のバリデータに差し替える場合もしりたい。
それぞれのバリデータの比較も行って欲しい。

---

## 🤖 アシスタント
*2025/05/22 19:01:26*

### ❶ 各バリデータで **「Hono ルート → OpenAPI」** を作る最小コード

&gt; `/todos` の **POST**（`NewTodo` → `Todo` を返す）だけを例にします。  
&gt; 共通部分は `describeRoute` と `openAPISpecs()`、異なるのは **①スキーマの書き方** と **②import 行** だけです。  

| ライブラリ | 依存の追加 | スキーマ定義&検証 (抜粋) |
|------------|-----------|--------------------------|
| **Valibot** | `pnpm add hono-openapi @hono/valibot-validator valibot @valibot/to-json-schema` |```ts
import * as v from 'valibot'
import { resolver, validator as vV } from 'hono-openapi/valibot' //★
const Todo = v.object({ id:v.number(), title:v.string(), completed:v.boolean() })
const NewTodo = v.omit(Todo, ['id'])
app.post('/todos',
  describeRoute({ /*...*/, requestBody:{ content:{ 'application/json':{ schema:resolver(NewTodo) } } }, responses:{ 201:{ content:{ 'application/json':{ schema:resolver(Todo) } } } } }),
  vV('json', NewTodo),                      //★
  (c)=>c.json({ ...c.req.valid('json'), id:1 }, 201)
)
```citeturn3view0|
| **ArkType** | `pnpm add hono-openapi @hono/arktype-validator arktype` |```ts
import { type as a } from 'arktype'
import { resolver, validator as aV } from 'hono-openapi/arktype' //★
const Todo   = a(`{ id:number, title:string, completed:boolean }`)
const NewTodo= a(`{ title:string, completed?:boolean }`)
app.post('/todos',
  describeRoute({ /* 同上 */ requestBody:{ content:{ 'application/json':{ schema:resolver(NewTodo) } } }, responses:{ 201:{ content:{ 'application/json':{ schema:resolver(Todo) } } } } }),
  aV('json', NewTodo),                      //★
  (c)=>c.json({ ...c.req.valid('json'), id:1 }, 201)
)
```（ArkType 用 validator は `hono-openapi/arktype` に同梱）citeturn0search2turn6search4|
| **TypeBox** | `pnpm add hono-openapi @hono/typebox-validator @sinclair/typebox ajv` |```ts
import { Type } from '@sinclair/typebox'
import { resolver, validator as tV } from 'hono-openapi/typebox' //★
const Todo    = Type.Object({ id:Type.Integer(), title:Type.String(), completed:Type.Boolean() })
const NewTodo = Type.Omit(Todo, ['id'])
app.post('/todos',
  describeRoute({ /*…*/ requestBody:{ content:{ 'application/json':{ schema:resolver(NewTodo) } } }, responses:{ 201:{ content:{ 'application/json':{ schema:resolver(Todo) } } } } }),
  tV('json', NewTodo),                      //★
  (c)=>c.json({ ...c.req.valid('json'), id:1 }, 201)
)
```（TypeBox→JSON Schema→OpenAPI 変換は内部で実施）citeturn3view0|
| **Effect Schema** | `pnpm add hono-openapi @hono/effect-validator effect` |```ts
import { Schema } from 'effect'
import { resolver, validator as eV } from 'hono-openapi/effect' //★
const Todo = Schema.struct({ id: Schema.number, title: Schema.string, completed: Schema.boolean })
const NewTodo = Schema.omit(Todo, ['id'])
app.post('/todos',
  describeRoute({ /*…*/ requestBody:{ content:{ 'application/json':{ schema:resolver(NewTodo) } } }, responses:{ 201:{ content:{ 'application/json':{ schema:resolver(Todo) } } } } }),
  eV('json', NewTodo),                      //★
  (c)=>c.json({ ...c.req.valid('json'), id:1 }, 201)
)
```citeturn6search0|

どの例でも最後に

```ts
import { openAPISpecs } from 'hono-openapi'
app.get('/openapi', openAPISpecs(app, { documentation:{ info:{ title:'Todo', version:'1.0.0' }}}))
```

を足せば **`/openapi` に OpenAPI 3.1 JSON が出力**され、`@hey-api/openapi-ts` へそのまま渡せます。

---

### ❷ バリデータ５種のざっくり比較

| 観点 | **Zod** | **Valibot** | **ArkType** | **TypeBox (+Ajv)** | **Effect Schema** |
|------|---------|-------------|-------------|--------------------|-------------------|
| API 形式 | 連鎖型 (`z.object({...})`) | Zod 互換に近い (`v.object`) | **文字列 DSL** (`type('{ id:number }')`) | JSON Schema ライク (`Type.Object`) | 関数合成 (`Schema.struct`) |
| 型推論 | 完全 | 完全 | 完全&lt;br&gt;(文字列→型) | 完全 | 完全 |
| 実行速度* | 基準 | **≈2× Zod**citeturn1search8 | **≈100× Zod**citeturn0search2 | **10× Zod**（Ajv JIT）citeturn1search3 | 中程度 |
| バンドルサイズ | ~43 kB gz | ~15 kB gz | ~12 kB gz | TypeBox 5 kB + Ajv 30 kB | 30 kB+ （Effect 本体含む） |
| 変換/ parse | ◎ (transform, refine) | ○(軽量) | △ (限定的) | △ (AJV 依存) | ◎ (decode/encode・FP) |
| OpenAPI 連携 | `@hono/zod-openapi`/`hono-openapi/zod` | `hono-openapi/valibot` | `hono-openapi/arktype` | `hono-openapi/typebox` | `hono-openapi/effect` |
| 学習コスト | 低 | 低 | 中（DSL 慣れ要） | 中 | 中〜高（FP指向） |
*公称ベンチ結果。実アプリで差が顕著になるのは**1 万件/秒以上**検証するケースなど高スループット時。

---

### ❸ どれを選ぶ？

| プロジェクト条件 | 推奨 |
|------------------|------|
| **既に Zod を使っている / DX 重視 / 速度そこそこで十分** | **Zod** (+ `@hono/zod-openapi`) |
| **ブラウザ配信サイズを極力削減 & 少し速くしたい** | **Valibot** |
| **超高速バリデーションが必須（ストリーミング検証等）** | **ArkType** |
| **JSON Schema 資産や Ajv エコシステムを活かしたい** | **TypeBox** |
| **関数型 + 双方向変換・Codec が欲しい** | **Effect Schema** |

&gt; **@hey-api/openapi-ts** でクライアントを生成するなら  
&gt; **どのバリデータで作った spec でも同じ CLI 一発**。  
&gt; スキーマ DSL は **サーバ側だけの選択**なので、まず **書きやすさ**と**チームの好み**で決めてしまって問題ありません。

---

## 👤 ユーザー
*2025/05/22 21:42:18*

この2つのツールをつかってopenapiのyaml or jsonの出力とクライアントコードの生成を行って欲しい。
クライアントもviteとreactでそのapiを呼んで欲しい。一旦固定値で問題ない。最小構成でじっそうしてほしい
https://github.com/honojs/middleware/tree/main/packages/zod-openapi
https://github.com/hey-api/openapi-ts

---

## 🤖 アシスタント
*2025/05/22 21:42:20*

以下は **最小 2 ステップ**で

1. **Hono (+ @hono/zod-openapi)** で  
   - ルート定義  
   - `openapi.yaml` を自動出力
2. **@hey-api/openapi-ts** で  
   - 型 + SDK (client-fetch) を生成
   - Vite + React から固定値で呼び出す

までを動かす最小構成です。  
（モノレポにはせず、フォルダ 2 つを並べるだけ）

```
my-app/
├── server/
│   ├── package.json
│   ├── src/server.ts
│   └── export-spec.ts          ← spec を書き出す 1 行スクリプト
└── web/
    ├── package.json
    ├── openapi-ts.config.ts
    └── src/
        ├── main.tsx
        └── App.tsx
```

---

## 1. サーバー側 : server/

### 1-1 依存とスクリプト

```jsonc
// server/package.json
{
  "name": "hono-server",
  "type": "module",
  "scripts": {
    "dev": "bun run src/server.ts",
    "export:spec": "bun run export-spec.ts"
  },
  "dependencies": {
    "hono": "^4.0.0",
    "zod": "^3.23.0",
    "@hono/zod-openapi": "^0.9.0"
  },
  "devDependencies": { "bun-types": "^1.1.8" }
}
```

&gt; Bun を使うと `--watch` も HTTP サーバーも 1 行で済み、  
&gt; Node でも動かしたい場合は `tsx` で置き換えてください。

### 1-2 `src/server.ts`（22 行）

```ts
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'

const Todo = z.object({
  id: z.number(),
  title: z.string(),
  completed: z.boolean(),
}).openapi('Todo')

const NewTodo = Todo.omit({ id: true }).openapi('NewTodo')

const createTodo = createRoute({
  method: 'post',
  path: '/todos',
  request: {
    body: { content: { 'application/json': { schema: NewTodo } } },
  },
  responses: {
    201: {
      description: 'Created',
      content: { 'application/json': { schema: Todo } },
    },
  },
})

const app = new OpenAPIHono()

app.openapi(createTodo, (c) => {
  const body = c.req.valid('json')
  return c.json({ ...body, id: 1 }, 201)
})

// Swagger UI + JSON spec (= `/doc`)
app.doc('/doc', { openapi: '3.1.0', info: { title: 'Todo', version: '1.0.0' } })

export default app
```

### 1-3 ワンショットで Yaml を落とす

```ts
// export-spec.ts
import server from './src/server.ts'
import { writeFileSync } from 'node:fs'

const res = await fetch('http://localhost:3000/doc') // dev 起動中に実行
writeFileSync('../web/openapi.yaml', await res.text())
console.log('✓ openapi.yaml 出力')
```

1. `bun run src/server.ts` で API + Swagger UI が http://localhost:3000/doc に出ます  
2. **別タブで** `bun run export-spec.ts` → `web/openapi.yaml` が出来上がり

---

## 2. フロント側 : web/

### 2-1 依存とスクリプト

```jsonc
// web/package.json
{
  "name": "todo-web",
  "private": true,
  "scripts": {
    "dev": "vite",
    "gen": "openapi-ts",   // spec → 型+SDK
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.1.0",
    "@hey-api/openapi-ts": "^2.6.0",
    "@hey-api/plugin-client-fetch": "^2.6.0",
    "typescript": "^5.4.0"
  }
}
```

### 2-2 `openapi-ts.config.ts`

```ts
import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: './openapi.yaml',
  output: './src/api',           // 型＆SDK をここに
  plugins: ['@hey-api/client-fetch'], // fetch ベース SDK
})
```

実行：

```bash
# 1回だけ
cd web
pnpm i
pnpm gen        # → src/api/{types.gen.ts, client.gen.ts, sdk.gen.ts}
```

### 2-3 Vite + React

```ts
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
```

```tsx
// src/App.tsx
import { client } from './api/client.gen'
import { createTodo } from './api/sdk.gen'
import { useEffect, useState } from 'react'

client.setConfig({ baseUrl: 'http://localhost:3000' })

export const App = () => {
  const [msg, setMsg] = useState<string>('送信中…')

  useEffect(() => {
    // 固定値で 1 件作成 → レスポンスを表示
    createTodo({ body: { title: '洗濯', completed: false } })
      .then((todo) => setMsg(`ID:${todo.id} "${todo.title}" で登録完了`))
      .catch((e) => setMsg('失敗: ' + e))
  }, [])

  return <h1>{msg}</h1>
}
```

```html
<!-- index.html (vite が自動生成でも OK) -->
<div id="root"></div>
```

開発サーバー起動：

```bash
pnpm dev
# → http://localhost:5173 で "ID:1 "洗濯" で登録完了"
```

---

## 3. 実行手順まとめ

```bash
# ①サーバー側
cd server
pnpm i
pnpm dev               # localhost:3000 起動
# ↓別タブで spec を書き出す
pnpm export:spec       # openapi.yaml を web/ に配置

# ②フロント側
cd ../web
pnpm i
pnpm gen               # 型+SDK 生成
pnpm dev               # React + Vite
```

これで **Hono → openapi.yaml → 型＋SDK → React 呼び出し** が一気通貫で確認できます。  
以降エンドポイントを増やすときは **サーバー側にルートを追加 → `export:spec` → `pnpm gen`** を回すだけで、フロントの型と SDK が自動更新されます。

---
