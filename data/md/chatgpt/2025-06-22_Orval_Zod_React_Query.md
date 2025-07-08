# Orval Zod React Query

日付: 2025-06-22

---

## 👤 ユーザー
*2025/06/22 10:24:17*

typescriptでyamlから clientコードを生成しようとしている。
orvalをつかって、zodとtanstack react queryのオプションで、クラインと実装をしようと思っている。

このライブラリーでの参考コードだったり、生成するための方法などを教えて欲しい。

---

## 🤖 アシスタント
*2025/06/22 10:24:38*

Below is a “happy-path” recipe that shows **(1) how to configure Orval so it produces Zod schemas *and* TanStack React Query hooks from one OpenAPI YAML file, and (2) how to consume the generated code inside a React app.**

---

## 1. Install the tooling

```bash
# runtime deps
pnpm add zod @tanstack/react-query

# dev-only deps
pnpm add -D orval @types/node typescript
```

If you prefer `fetch` instead of Axios, add nothing extra—Orval can emit fetch‐based code out-of-the-box; otherwise `pnpm add axios`.

---

## 2. Create `orval.config.ts`

```ts
// orval.config.ts
import { defineConfig } from 'orval';

export default defineConfig({
  // ──────────────────────────────────────
  // 1️⃣  React-Query client (type-safe hooks)
  // ──────────────────────────────────────
  petstore: {
    input: './openapi.yaml',          // ← your spec (YAML or JSON)
    output: {
      target: './src/generated/endpoints', //   /getPets.ts, /addPet.ts, …​
      client: 'react-query',          // generate TanStack hooks
      mode: 'tags-split',             // one file per tag; use 'single' if you prefer one file
      httpClient: 'fetch',            // or 'axios'
      schemas: './src/generated/model',// folder for TS interfaces
      reactQuery: {
        // optional tweaks
        queryOptions: { retry: 1 },
        mutator: {                    // share a custom fetch/axios instance
          path: './src/lib/fetcher.ts',
          name: 'fetcher',
        },
      },
    },
  },

  // ──────────────────────────────────────
  // 2️⃣  Zod schemas (runtime validation)
  //    ─ generated once, same spec
  // ──────────────────────────────────────
  petstoreZod: {
    input: './openapi.yaml',
    output: {
      // write *.zod.ts so names don’t clash with the files above
      target: './src/generated/endpoints',
      fileExtension: '.zod.ts',
      client: 'zod',                  // tell Orval we only want schemas
      mode: 'tags-split',
    },
  },
});
```

*Why two blocks?*  
`client: 'react-query'` can’t emit Zod; `client: 'zod'` can’t emit hooks. The official guide recommends a twin-output setup exactly like this.citeturn0search0turn0search2

---

## 3. Generate (watch mode while you work)

```bash
npx orval --config orval.config.ts --watch
```

File layout (after first run)

```
src/
  generated/
    endpoints/
      pets/
        showPetById.ts         ← fetch fn  + useShowPetByIdQuery()
        showPetById.zod.ts     ← export const ShowPetByIdSchema = z.object({ … })
      …
    model/
      index.ts                 ← TS interfaces for every schema
```

Orval automatically validates your spec before generation.citeturn1search0

---

## 4. Use the generated hooks + schemas

```tsx
// App.tsx (simplified)
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useShowPetByIdQuery } from '@/generated/endpoints/pets/showPetById';
import { ShowPetByIdSchema } from '@/generated/endpoints/pets/showPetById.zod';

const queryClient = new QueryClient();

export function PetPage({ id }: { id: string }) {
  const { data, error, isLoading } = useShowPetByIdQuery(id, {
    // any React-Query options here
    staleTime: 60_000,
  });

  if (isLoading) return <p>Loading…</p>;
  if (error)     return <p>Failed: {error.message}</p>;

  // runtime guarantee
  const pet = ShowPetByIdSchema.parse(data);
  return <pre>{JSON.stringify(pet, null, 2)}</pre>;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PetPage id="123" />
    </QueryClientProvider>
  );
}
```

---

## 5. Fine-tuning tips

| Need | Where to set it |
|------|-----------------|
| **Base URL changes per env** | Use `output.baseUrl` in the config, or inject a custom `fetcher`/`axios` mutator. |
| **Enable React-Query DevTools** | `pnpm add @tanstack/react-query-devtools`, then `<ReactQueryDevtools />` in your tree. |
| **MSW mocks for integration testing** | Add a third output with `client: 'msw'`. Orval produces handlers. |
| **Strict TypeScript flags (`isolatedDeclarations: true`)** | Generated files contain full types, so they compile cleanly; if the compiler still sees errors, exclude `src/generated/**` from `tsconfig.build.json`’s `isolatedDeclarations`. |
| **Code style / lint** | Use `hooks.afterAllFilesWrite: 'prettier --write'` or ESLint to auto-format. |

---

### Summary

1. **Install**: `orval`, `zod`, `@tanstack/react-query`  
2. **Config**: one block with `client: 'react-query'`, a second with `client: 'zod'`.  
3. **Generate**: `npx orval --watch` → type-safe hooks *plus* runtime validation.  
4. **Use**: import `useXxxQuery` hooks for data fetching and the companion `*.zod.ts` schema to `parse()` the response.

That’s the entire toolchain—no custom codegen scripts or hand-written adapters needed—all driven from your OpenAPI YAML. Happy coding!

---

## 👤 ユーザー
*2025/06/22 10:26:14*

日本語でお願いします。 MSWのモックの設定などもStrict TypeScript flags (isolatedDeclarations: true)
もEnable React-Query DevToolsもやってほしい

---

## 🤖 アシスタント
*2025/06/22 10:26:22*

以下は **「OpenAPI (YAML) → orval → Zod + TanStack React Query + MSW モック」** を  
**TypeScript strict（`isolatedDeclarations: true` 含む）** で動かすための最小構成です。  
そのままコピペして動作を確認できるレベルでまとめました。

---

## 1. 依存パッケージを追加

```bash
# ランタイム
pnpm add zod @tanstack/react-query

# Dev（コードジェネレータとモック）
pnpm add -D orval @tanstack/react-query-devtools msw

# fetch API をそのまま使う前提。Axios 派は `pnpm add axios` も
```

---

## 2. `orval.config.ts`

```ts
import { defineConfig } from 'orval';

/**
 * - petstore       : React-Query Hooks + MSW ハンドラ
 * - petstoreZod    : Zod スキーマ（runtime validation 用）
 *
 * 2ブロックに分ける理由:
 *   orval は 1ブロック内で “client: 'react-query'” と “client: 'zod'” を
 *   同時指定できないため。
 */
export default defineConfig({
  /* === ① React-Query Hooks + MSW ============================= */
  petstore: {
    input: './openapi.yaml',
    output: {
      target: './src/generated/endpoints',
      client: 'react-query',       // TanStack Query 用 Hooks
      mode: 'tags-split',          // タグ単位に分割
      httpClient: 'fetch',
      schemas: './src/generated/model',
      mock: true,                  // ← MSW ハンドラ .msw.ts を同時生成 citeturn0search0
      reactQuery: {
        queryOptions: { retry: 1 },      // デフォルトオプションを全 Hooks に適用
        mutator: {                       // 共通 fetcher（認証ヘッダーなどを集中管理）
          path: './src/lib/fetcher.ts',
          name: 'fetcher',
        },
      },
    },
  },

  /* === ② Zod スキーマのみ ==================================== */
  petstoreZod: {
    input: './openapi.yaml',
    output: {
      target: './src/generated/endpoints',
      fileExtension: '.zod.ts',    // *.zod.ts で Hooks と衝突しないように
      client: 'zod',               // Zod に特化 citeturn0search1
      mode: 'tags-split',
    },
  },
});
```

生成コマンド:

```bash
npx orval --config orval.config.ts --watch
```

---

## 3. Strict な `tsconfig.json`

```jsonc
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2022", "DOM"],
    "strict": true,
    "isolatedDeclarations": true,          // 🔑 すべての export に型注釈必須 citeturn0search2
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "skipLibCheck": false,
    "declaration": true,
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  },
  "include": ["src/**/*"],
  "exclude": [
    // 生成物で万一エラーになるようならここで除外
    // "src/generated/**/*.ts"
  ]
}
```

&gt; orval が出力するコードは `isolatedDeclarations` を満たす構造になっているため、  
&gt; 通常は `exclude` せずにビルドが通ります。

---

## 4. MSW モックの組み込み

### 4-1. ワーカー初期化ファイル

```ts
// src/mocks/browser.ts
import { setupWorker } from 'msw';
import { handlers as petHandlers } from '@/generated/endpoints/pets/pets.msw';

export const worker = setupWorker(...petHandlers);
```

### 4-2. 開発モードで起動

```ts
// src/main.tsx （Vite の entry 例）
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

if (import.meta.env.MODE === 'development') {
  (await import('./mocks/browser')).worker.start({ onUnhandledRequest: 'bypass' });
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
```

開発中は **ネットワーク通信なしで Hooks が動く** ので UI だけサクッと作れます。

---

## 5. React-Query DevTools を表示

```tsx
// src/App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';  // citeturn0search3
import { PetPage } from './pages/PetPage';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PetPage id="123" />
      {import.meta.env.MODE === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
```

---

## 6. Zod でレスポンスを安全にパース

```tsx
// pages/PetPage.tsx
import { useShowPetByIdQuery } from '@/generated/endpoints/pets/showPetById';
import { ShowPetByIdSchema } from '@/generated/endpoints/pets/showPetById.zod';

export function PetPage({ id }: { id: string }) {
  const { data, error, isLoading } = useShowPetByIdQuery(id, { staleTime: 60_000 });

  if (isLoading) return <p>Loading…</p>;
  if (error)     return <p>Error: {error.message}</p>;

  // 受信 JSON を runtime で検証
  const pet = ShowPetByIdSchema.parse(data);
  return <pre>{JSON.stringify(pet, null, 2)}</pre>;
}
```

---

## まとめ

| やること | ポイント |
|----------|----------|
| **コード生成** | `orval.config.ts` を 2ブロック（Hooks+MSW / Zod）で定義 |
| **strict TS** | `isolatedDeclarations: true` をグローバルで ON |
| **MSW** | `output.mock: true` → `*.msw.ts` が自動生成。`setupWorker` で統合 |
| **DevTools** | `@tanstack/react-query-devtools` を開発モードだけ描画 |
| **実行** | `npx orval --watch` → `pnpm dev` (Vite 等) |

これで **設計—実装—モック—検証—UIデバッグ** がすべて OpenAPI 定義一本で回る環境が整います。  
お試しください 🚀

---

## 👤 ユーザー
*2025/06/22 10:45:05*

MSWを搭載しているようなOpenAPIクライアントのジェネレーターって他に選択肢あるんだっけ?

---

## 🤖 アシスタント
*2025/06/22 10:45:40*

### MSW 連携まで自動で（またはほぼ自動で）用意できる主なツール・構成

| 種別 | ツール名 / 構成 | 生成できるもの | 特徴 | コメント |
|----|----|----|----|----|
| **オールインワン** | **Kubb** | TypeScript 型 / Axios or fetch クライアント / TanStack Query フック / Zod / Faker / **MSW ハンドラ** | OpenAPI 2.0・3.x・3.1 対応。プラグイン方式で React-Query/SWR/Vue Query 等にも対応。CLI でも Vite／webpack 用の unplugin でも動く。citeturn8view0 | Orval にかなり近い体験。React 以外の UI フレームワークも選択可 |
| | **nestia (@nestia/sdk)** | fetch SDK ＋ **Mockup Simulator**（バックエンドを擬似実行） | NestJS 想定のツールだが、Swagger/OpenAPI から単独でも SDK と “MSW 風” シミュレータを生成。E2E テストコードも自動生成できる。citeturn5search0 | MSW そのものではなく独自ランタイムだが、フロント開発中に実 API 不要という点は同じ |
| **クライアント＋モックを別ツールで合成** | **openapi-typescript ＋ mswjs/source** | openapi-typescript: 型・クライアント&lt;br&gt;mswjs/source: **fromOpenApi()** で MSW ハンドラ | _source_ は MSW 公式のハンドラ自動生成ライブラリ。OpenAPI 3 だけでなく 2.0 も OK。クライアントは好きなジェネレーターと組み合わせ可。citeturn0search1 | 「既存プロジェクトに後付け」で一番手軽 |
| | **openapi-to-msw** ＋ 任意のクライアント | CLI で OpenAPI → **MSW ハンドラ** / Storybook 用モック | Faker でランダム値を吐くモードあり。React 以外の UI テストにも使いやすい。citeturn3search1 | ハンドラ専用。クライアントは別途 orval / openapi-fetch などで生成 |
| | **@principlestudios/openapi-codegen-typescript-msw** | 上記ライブラリの MSW アダプタ | `openapi-codegen-typescript` で出力した fetch/Axios SDK を **型安全な MSW** でテスト可能にする薄いラッパー。citeturn2search7 | .NET ランタイム依存あり（実行環境注意） |
| **薄いラッパー** | **openapi-msw** | OpenAPI–TS の型をそのまま活かす小さな MSW ヘルパー | クライアントは別途 openapi-fetch などで生成した上で、「msw の `http.get()` を型安全化」するイメージ。citeturn6search0 | 既存の MSW ハンドラを改修するだけで導入できる |

&gt; 💡 **Hey API (openapi-ts) にも MSW プラグインの計画はありますが、執筆時点（2025-06-22）ではまだ “coming soon”** です。citeturn6search9

---

### どう選ぶ？

| こんな時 | 向いている選択肢 |
|---|---|
| **Orval とほぼ同じ DX で、でも次世代的なツールを試したい** | **Kubb**（React 以外にも展開可、Faker 連携も強力） |
| **NestJS をバックエンドに使い、E2E テストもまとめて自動化したい** | **nestia** |
| **既存プロジェクトに MSW だけ足したい／クライアントはもう生成済み** | `mswjs/source` または `openapi-msw` |
| **Storybook・UI テスト主体でランダムモックが欲しい** | `openapi-to-msw` |
| **.NET 環境でも使えて、クライアントとモックを同じ系でそろえたい** | `openapi-codegen-typescript` + その MSW アダプタ |

---

#### ワンポイント：MSW 生成の “質” はここを見る

1. **OpenAPI の例 (examples) / schema をどう扱うか**  
   - Kubb・nestia は `example` 値や Faker 用プリセットをそのまま返せる。  
2. **TypeScript 型安全**  
   - openapi-msw や nestia は “パス／レスポンス” までジェネリクスで保証。  
3. **ランタイムバリデーション**  
   - Orval/Kubb は Zod を同時生成できるので UI 層でも安全に parse 可能。  
4. **モックサーバー起動方法**  
   - MSW Worker（ブラウザ）／MSW Server（Node）どちらも生成してくれるか。  

---

## まとめ

- **Orval 以外にも**  
  - **Kubb**（React-Query + Zod + Faker + MSW）  
  - **nestia**（SDK + 自動モックシミュレータ）  
  - **mswjs/source** / **openapi-to-msw** / **openapi-msw** など “ハンドラ専用” ツール  
  - **openapi-codegen-typescript-msw**（クライアント＋MSW を .NET CLI で）  
- 目的が **「とにかく手軽に UI 開発を回したい」** なら `mswjs/source` + 任意のクライアントが最短。  
- Orval と同等以上の **「生成物ワンパッケージ完結」** を求めるなら **Kubb** が現状一番近い選択肢です。  

必要な DX・既存スタックとの親和性を見ながら取り込んでみてください 🚀

---

## 👤 ユーザー
*2025/06/22 10:52:23*

openapi-typescript で型生成してる場合はどれがいいか？

---

## 🤖 アシスタント
*2025/06/22 10:52:31*

### openapi-typescript で型を生成している場合の “MSW 連携” ベストチョイス

| シナリオ | 最有力候補 | ひとことで |
|----------|-----------|-----------|
| **ハンドラを自分で書くが、** &lt;br&gt;**OpenAPI の型ズレは絶対に起こしたくない** | **openapi-msw** | openapi-typescript が吐いた `paths` 型をそのまま流用し、&lt;br&gt;エンドポイント／レスポンスを _コンパイル時_ に検査できる超軽量ラッパー citeturn0search0 |
| **ゼロ行コーディングで “とりあえず全部モック”** | **@mswjs/source → `fromOpenApi()`** | OpenAPI ファイルを渡すだけで **RequestHandler[]** を自動生成。&lt;br&gt;型安全は薄いが最速。Faker でダミー値も出せる citeturn0search4 |
| **ランダムモック／Storybook 用に静的ファイルが欲しい** | **openapi-to-msw** | CLI 一発で `*-mock.ts` を吐き出す。&lt;br&gt;後は import するだけ citeturn3search1 |

&gt; **結論：**  
&gt; - **型安全ファーストなら _openapi-msw_**  
&gt; - **作業ゼロで即動かしたいなら _@mswjs/source_**  
&gt;   （両方併用しても OK。開発初期は source、細部調整は openapi-msw）

---

## 1. openapi-msw の具体例

1. **型だけ生成**

```bash
npx openapi-typescript openapi.yaml -o src/generated/schema.d.ts
```

2. **MSW ハンドラ**

```ts
// src/mocks/handlers.ts
import { createRouter } from 'openapi-msw';
import { paths } from '@/generated/schema';

const router = createRouter<paths>();

router.get('/pets', ({ res, ctx }) =>
  res(
    ctx.status(200),
    ctx.json([
      { id: 1, name: 'ポチ' },
      { id: 2, name: 'タマ' },
    ] satisfies paths['/pets']['get']['responses']['200']['content']['application/json']),
  ),
);

export const handlers = router.handlers;
```

* `/pets` のメソッド名やレスポンス型が OpenAPI と食い違うと **コンパイルエラー** になるので、  
  UI 側のモックも常に仕様と一致します。

---

## 2. @mswjs/source (`fromOpenApi`) の具体例

```ts
// src/mocks/browser.ts
import { setupWorker } from 'msw';
import { fromOpenApi } from '@mswjs/source/open-api';
import petstore from '@/openapi.yaml';

const handlers = await fromOpenApi(petstore, {
  validateResponses: true,  // schema に沿わないダミーは自動で 500
  pathRewrite: { '^/v1': '' }, // prefix 調整したい場合
});

export const worker = setupWorker(...handlers);
```

- **OpenAPI 2.0/3.x 対応**  
-  `example` があればそれを、無ければ Faker でランダム値を生成  
- **型検査は行わない** ので、開発後半に openapi-msw へ乗り換えるパターンが多いです。

---

## 3. 併用イメージ

```ts
// src/main.tsx
import { worker as auto } from '@/mocks/browser-auto';   // fromOpenApi
import { handlers as typed } from '@/mocks/handlers';     // openapi-msw

const worker = setupWorker(...auto, ...typed);
worker.start();
```

1. **開発初期**：auto だけ → 仕様が固まる  
2. **詳細UI 実装**：typed でピンポイントに上書き（auto の上位に配置）

---

## 4. openapi-typescript 製クライアントとの相性

| クライアント | 追加ライブラリ | 備考 |
|--------------|---------------|------|
| **openapi-fetch** | なし | `paths` 型を直接ジェネリック指定できる&lt;br&gt;→ openapi-msw の型と完全一致 |
| **openapi-zod-client** | zod | Zod で runtime 検証。MSW はどちらの方式でも使える |
| **自前 fetch/Axios ラッパー** | なし | openapi-typescript が出力する `operations` 型を活用 |

---

## まとめ

- **openapi-typescript を既に使っている**＝`paths` 型が手元にある  
  ⇒ **openapi-msw** が“一番ムダがない”  
- **とりあえず全部自動で出したい／早く UI を触りたい**  
  ⇒ **@mswjs/source** の `fromOpenApi()` を先に当てて走り出す  
- 必要に応じて **openapi-to-msw** や **msw-auto-mock** で Faker ランダム生成を追加

この方針であれば **型安全・モック自動化・開発スピード** のバランスを崩さずに済みます。  
用途とフェーズに合わせて選択・併用してみてください 🚀

---

## 👤 ユーザー
*2025/06/23 12:22:09*

httpClientをAxiosとfetchがどちらの方がいいか？

---

## 🤖 アシスタント
*2025/06/23 12:22:33*

以下は **「orval／openapi-typescript で生成したクライアントを使う場合、`httpClient` を `axios` にするか `fetch` にするか」** を判断するための早見表と、選択ごとの具体的な留意点・サンプルです。

---

## 1. ざっくり結論

| こんな要件なら | ベターな選択 |
|---------------|--------------|
| **バンドルサイズを極限まで削りたい**&lt;br&gt;（Edge Functions、モバイル向け PWA など） | **fetch** |
| **Next.js 14 / React Server Components / Node18+ の SSR**&lt;br&gt;（`cache`, `revalidate` も活かしたい） | **fetch** |
| **アップ／ダウンロード進捗・リトライ・自動 JSON 変換・XSRF 対策を標準で持たせたい** | **axios** |
| **旧ブラウザ（IE11 など）・旧 Node (&lt;18) をまだ切れない** | **axios**（または polyfill 付き fetch） |
| **チームに Axios カスタムインスタンスの資産が既にある** | **axios** |

&gt; 迷ったら **fetch をデフォルトにして、足りない機能だけ軽いラッパーを足す** のが 2025 年現在の主流です。citeturn3search2turn0search8

---

## 2. 比較ポイント詳細

| 観点 | fetch | axios |
|------|-------|-------|
| **依存サイズ** | 0 KB（ブラウザ／Node18+ はネイティブ） citeturn0search8 | 13〜22 KB gzip 程度 citeturn0search0 |
| **Node.js** | v18 以降は `globalThis.fetch` が標準搭載 citeturn2search1&lt;br&gt;※17 以下は `undici` or `node-fetch` が必要 | 追加なしで動く |
| **ストリーミング** | `ReadableStream` が標準 | ブラウザでは XHR ベースなので遅延ストリームに非対応 |
| **進捗イベント** | Upload: `onprogress` 未サポート&lt;br&gt;Download: StreamsAPI で実装可 | `onUploadProgress` / `onDownloadProgress` が即利用可 |
| **インターセプタ** | 自前でラップ（例: fetcher 関数） | `axios.interceptors` が標準装備 |
| **キャンセル** | `AbortController` （React Query がそのまま利用） | v1 から `AbortSignal` 対応。ただし旧 `CancelToken` と混在注意 |
| **RSC / Edge Runtime** | 最適化されており `fetch()` 自体がキャッシュキーになる | RSC 特有機能は手動実装 |
| **型定義のリッチさ** | orval の `fetch` クライアントは&lt;br&gt;**レスポンスの HTTP ステータスまで型に含む** citeturn3search3 | orval-axiosは AxiosResponse ラッパー |
| **移行コスト** | 新規なら低い。古い axios interceptors 資産があると書き換えが必要 | 既存 axios プロジェクトなら変更不要 |

---

## 3. orval + TanStack React Query でのサンプル実装

### 3-1. fetch 版（推奨デフォルト）

```ts
// orval.config.ts 抜粋
export default defineConfig({
  api: {
    input: './openapi.yaml',
    output: {
      target: './src/generated/endpoints',
      client: 'react-query',
      httpClient: 'fetch',            // ← ここだけ変える
      reactQuery: {
        // token 付与などは共通 fetcher に集約
        mutator: { path: './src/lib/fetcher.ts', name: 'fetcher' }
      }
    }
  }
});
```

```ts
// src/lib/fetcher.ts
export const fetcher = <T>(
  url: string,
  config: RequestInit & { signal?: AbortSignal }
): Promise<T> => {
  return fetch(url, {
    ...config,
    headers: {
      ...config.headers,
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  }).then(async r => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json() as Promise<T>;
  });
};
```

### 3-2. axios 版（インターセプタ重視）

```ts
// orval.config.ts
output: {
  client: 'react-query',
  httpClient: 'axios',
  reactQuery: {
    mutator: { path: './src/lib/axios-instance.ts', name: 'axiosInstance' }
  }
}
```

```ts
// src/lib/axios-instance.ts
import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_ORIGIN
});

axiosInstance.interceptors.request.use(cfg => {
  cfg.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  return cfg;
});

axiosInstance.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) logout();
    return Promise.reject(err);
  }
);
```

---

## 4. 判断フローチャート

1. **Node 18+ が前提 & RSC / Edge Functions を使う？**  
   → YES: `fetch`
2. **既に Axios インターセプタ（トークン更新など）の資産が多い？**  
   → YES: `axios`
3. **ファイルアップロードの進捗 UI が要る？**  
   → YES: `axios`（fetch の場合は XHR か Streams 手実装）
4. **成果物 50 KB 削減が意味を持つ PWA？**  
   → YES: `fetch`
5. **どちらでも良いが可読性を優先？**  
   → チーム好みで。fetch もラッパー関数を書けば Axios 並みの DX を再現可能。

---

## 5. まとめ

- **モダン環境（ブラウザ / Node18+）× 新規プロジェクトなら `fetch` が無難**  
  - ネイティブ実装 = 依存ゼロ・最小バンドル  
  - RSC/Edge のキャッシュ API と親和性が高い  
  - orval は `httpClient: 'fetch'` を正式サポート citeturn3search0
- **高度なインターセプタや進捗イベントが不可欠なら `axios`**  
  - とくにレガシー環境や大容量ファイル転送を扱う場合は楽
- **openapi-typescript の型を最大限に活かす** 意味では  
  どちらを選んでもジェネレータが型を付与するので安全性に差はありません。  
  ただし fetch 版は HTTP ステータスを型に含むためエラーハンドリングを細かく書きやすいのがメリットです。citeturn3search3

これらを指針に、**削りたいコスト or 欲しい機能** で決めてもらえれば OK です。

---
