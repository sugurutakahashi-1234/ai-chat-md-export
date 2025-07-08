# TanStack Query Suspense実装

日付: 2025-06-28

---

## 👤 ユーザー
*2025/06/28 12:47:59*

TanStack QueryxRouterのSuspenceという機能について調べてほしい

実装方法も教えてほしい

---

## 🤖 アシスタント
*2025/06/28 12:48:38*

### 「Suspense」とは？

| ライブラリ | Suspenseの役割 | 公式ドキュメントの要点 |
|------------|----------------|------------------------|
| **TanStack Query** | `useSuspenseQuery`（v5～）または`useQuery({ suspense:true })`（v4）で、データ取得中は `React.Suspense` に「待機」を委譲する。ローディング UI は最寄りの `<Suspense fallback>` が受け持ち、失敗は ErrorBoundary に伝播する。citeturn0search2 |
| **TanStack Router** | ルートの `loader` が Promise を返すと内部で自動的に Suspense を使い、データ取得完了までルート描画を停止。1 秒を超えると `pendingComponent` を表示するなどの制御も可能。citeturn4view0 |

&gt; つまり **Query が「データ取得を止める仕組み」を提供し、Router が「ルート遷移全体を止める仕組み」を担う**――この 2 つを組み合わせることで、ページ遷移とデータフェッチを“まとめて”Suspense に任せられます。

---

## 実装ステップ（React 18 + TypeScript）

&gt; ※以下は **TanStack Query v5** を前提にした最小構成例です（v4 を使う場合は `useQuery({ suspense:true })` を使用）。

### 1. プロバイダのセットアップ

```tsx
// main.tsx
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import {
  QueryClient,
  QueryClientProvider,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  RouterProvider,
  createRouter,
  createRootRouteWithContext,
} from "@tanstack/react-router";

// ① QueryClient を作成（エラーバウンダリに投げる設定推奨）
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 5 * 60_000,
      staleTime: 30_000,
      placeholderData: keepPreviousData,
    },
  },
});

// ② ルートコンテキストで QueryClient を渡す
const rootRoute = createRootRouteWithContext<{ queryClient: QueryClient }>()();

const routeTree = rootRoute.addChildren([
  /* 後述の postsRoute など */
]);

const router = createRouter({
  routeTree,
  context: { queryClient },
});

// ③ Suspense + ErrorBoundary で Router をラップ
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<Spinner />}>
        <RouterProvider router={router} />
      </Suspense>
    </QueryClientProvider>
  );
}

ReactDOM.createRoot(document.getElementById("app")!).render(<App />);
```

### 2. ルート定義と **loader + Query 連携**

```tsx
// routes/posts.tsx
import { createFileRoute } from "@tanstack/react-router";
import { fetchPosts } from "../api";
import { QueryClient } from "@tanstack/react-query";

export const PostsRoute = createFileRoute("/posts")({
  // loader は Router が遷移前に実行
  loader: ({ context }) =>
    context.queryClient.ensureQueryData({
      queryKey: ["posts"],
      queryFn: fetchPosts,
    }),
  pendingComponent: () => <LoadingOverlay />,
  component: PostsPage, // ↓で定義
});
```

- `ensureQueryData` は **キャッシュに無ければ取得して解決後に返す** Utility。  
  ここで取得したデータは Query のキャッシュにも保存されるので、ページ描画時に再フェッチを行わずサクッと表示できます。

### 3. コンポーネント側で `useSuspenseQuery`

```tsx
// routes/PostsPage.tsx
import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchPosts } from "../api";

export default function PostsPage() {
  // useSuspenseQuery は data が必ず defined
  const { data: posts } = useSuspenseQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  return (
    <ul>
      {posts.map((p) => (
        <li key={p.id}>{p.title}</li>
      ))}
    </ul>
  );
}
```

### 4. エラーハンドリング

```tsx
// ErrorBoundary.tsx
export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div>
      <p>エラーが発生しました: {error.message}</p>
      <button onClick={resetErrorBoundary}>再試行</button>
    </div>
  );
}
```

- `Suspense` と組み合わせる場合、**Query のエラーも Router の loader エラーも**最終的に ErrorBoundary に流れます。  
- Router 側の `errorComponent` をルート単位でオーバーライドすることも可能。

---

## よくある疑問 Q&A

| Q | A |
|---|---|
| **`useSuspenseQuery` には `enabled` が無い？** | v5 から `enabled` を使いたい場合は `useQuery` + `placeholderData` で代替、またはルートを条件に応じて分割するのが推奨です。|
| **`ensureQueryData` だけで購読は十分？** | いいえ。`ensureQueryData` はあくまで「取得＋キャッシュ保存」専用です。実際の再取得・更新通知は `useSuspenseQuery` / `useQuery` が担当します。citeturn7search0 |
| **ローディングのチラつきが気になる** | Router の `pendingMs` / `pendingMinMs` オプションで「○ms 以上かかった場合だけスピナーを出す」といった制御が可能です。citeturn4view0 |
| **公式のサンプルを見たい** | TanStack Router の「Basic + React Query」例がそのまま Suspense 対応の実装になっています。citeturn6view0 |

---

## まとめ

1. **Query 側**は `useSuspenseQuery`（または `suspense:true`）で「データが来るまで throw」  
2. **Router 側**は `loader` が Promise を返し、遷移全体を Suspense に委譲  
3. 両者を **`<Suspense>` + ErrorBoundary** で囲めば、  
   - ルート遷移開始 → データ取得 → 完了まで **一度のローディング表示で済む**  
   - キャッシュがあれば **瞬間表示＋バックグラウンド再検証** が可能

これで「ルートもデータもまとめて潔く待つ」、スッキリした UX を実装できます。

---

## 👤 ユーザー
*2025/06/28 12:51:32*

これはSSRなのか？また別の技術なのか？

---

## 🤖 アシスタント
*2025/06/28 12:51:59*

### TL;DR  
- **React Suspense** は「コンポーネントの描画を一時停止する仕組み」で、クライアント／サーバどちらでも動く **“振る舞い”**。  
- **SSR (Server-Side Rendering)** は「HTML をサーバで先に描くビルド手法」＝ **“レンダリング戦略”**。  
- 2 つは別物だが相性抜群。SSR 中に Suspense 境界が現れると、サーバはまず *fallback* をストリームし、Promise が解決した段階で本コンテンツを追加ストリームする仕掛けになる（React 18 の *streaming*）。  
- **TanStack Query／Router** は両者を橋渡しするユーティリティを用意しており、`loader` や `ensureQueryData` で「SSR 時のデータ先取り → クライアントでの hydrate」を自動化できる。citeturn0search1turn0search2  

---

## 1. 用語を整理

| 用語 | 何をする? | いつ起きる? | 代表 API |
|------|-----------|-------------|----------|
| **Suspense** | “まだ準備できていない”ときに *throw Promise* し、描画を止める。fallback UI は最近接の `<Suspense fallback>` が担当 | クライアント描画中でも SSR 中でも | `React.Suspense`, `useSuspenseQuery`, `router.loader` など |
| **SSR** | URL への初回リクエストで HTML を **サーバが** 描画して返す。クライアントはその静的 HTML を *hydrate* して React アプリとして再開 | ページ初期ロード時 | `renderToString` / `renderToPipeableStream` など |
| **Streaming SSR** | React 18 以降の強化版 SSR。`<Suspense>` の *fallback* を先に送り、Promise 解決後に差分をストリーム | 同上 | `renderToPipeableStream` |
| **TanStack Query Hydration** | サーバでフェッチ済みキャッシュを JSON として HTML に埋め込み、クライアント側 `hydrate()` で復元 | SSR 時 | `dehydrate`, `hydrate` |
| **TanStack Router Hydration** | ルートの `loader` 結果や遷移状態を同様に埋め込み／復元 | SSR 時 | `router.dehydrate()`, `router.hydrate()` |

---

## 2. いま説明した “Suspense + Router + Query” は **CSR** だけでも動く

先のコード例は **クライアントサイドのみ** を前提にしていました。  
データ取得を Promise 化 (`loader` / `useSuspenseQuery`) しているので、

1. ルート遷移が始まる  
2. Promise が未解決 → Suspense が throw  
3. `<Suspense fallback>` がローディングを表示  
4. Promise 解決後に本 UI が描画される  

ここではサーバは介在しておらず **SSR ではない**、という点をまず押さえてください。

---

## 3. もし SSR したい場合は “もう 1 ファイル” 追加

&gt; Vite + Express ライクな Node 環境を想定した **最小構成** 例を示します。  
&gt; - **Non-Streaming SSR**（全部描画してから返す）と  
&gt; - **Streaming SSR**（fallback を送りながら順次埋める）  
&gt; の 2 パターンを対比します。

### 3-1 サーバエントリ (non-streaming)

```ts
// server/entry.tsx
import express from "express";
import { createServer } from "http";
import React from "react";
import { renderToString } from "react-dom/server";
import {
  createRouter,
  createMemoryHistory,
  RouterProvider,
} from "@tanstack/react-router";
import {
  QueryClient,
  dehydrate,
  Hydrate,
} from "@tanstack/react-query";
import routes from "../src/routes"; // ← file-based でも OK

const app = express();

app.get("*", async (req, res) => {
  const queryClient = new QueryClient();
  const router = createRouter({
    history: createMemoryHistory({ initialEntries: [req.url] }),
    routeTree: routes,
    context: { queryClient },
  });

  // ① ルートの loader を全部走らせる
  await router.load();

  // ② Query キャッシュと Router 状態を JSON 化
  const dehydratedState = dehydrate(queryClient);
  const dehydratedRouter = router.dehydrate();

  // ③ HTML 文字列を生成
  const html = renderToString(
    <QueryClientProvider client={queryClient}>
      <Hydrate state={dehydratedState}>
        <RouterProvider router={router} />
      </Hydrate>
    </QueryClientProvider>,
  );

  // ④ 埋め込んで返却
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head><meta charset="utf-8" /></head>
      <body>
        <div id="app">${html}</div>
        <script>
          window.__TANSTACK_QUERY_STATE__=${JSON.stringify(dehydratedState)};
          window.__TANSTACK_ROUTER_STATE__=${JSON.stringify(dehydratedRouter)};
        </script>
        <script type="module" src="/src/main.tsx"></script>
      </body>
    </html>
  `);
});

createServer(app).listen(5173);
```

### 3-2 クライアントエントリ (hydrate)

```tsx
// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import {
  QueryClient,
  QueryClientProvider,
  hydrate,
} from "@tanstack/react-query";
import {
  RouterProvider,
  createRouter,
  createHistory,
} from "@tanstack/react-router";
import routes from "./routes";

const queryClient = new QueryClient();
hydrate(queryClient, window.__TANSTACK_QUERY_STATE__);

const router = createRouter({
  history: createHistory(), // ブラウザ history
  routeTree: routes,
  context: { queryClient },
});
router.hydrate(window.__TANSTACK_ROUTER_STATE__);

ReactDOM.hydrateRoot(
  document.getElementById("app")!,
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>,
);
```

### 3-3 Streaming SSR へ切り替える場合

```ts
import { renderToPipeableStream } from "react-dom/server";

const stream = renderToPipeableStream(
  /* さきほどと同じ JSX */,
  {
    bootstrapScripts: ["/src/main.tsx"],
    onShellReady() {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      stream.pipe(res);
    },
  },
);
```

`<Suspense fallback>` が現れるたびに  
1. *fallback* → 先にクライアントへ送信  
2. Promise 解決 → その差分を `stream.push()`  

という形で *段階的に* HTML が届くため、遅い API でも初期表示が速くなります。  
（TanStack Router の公式 *Basic + SSR Streaming* サンプルがこの構成です）citeturn0search1

---

## 4. まとめ

| 質問 | 答え |
|------|------|
| **「Suspense は SSR ですか？」** | **いいえ。** Suspense は “描画を止める” React の機能で、SSR は “どこで描画するか” というレンダリング戦略。別物だが併用すると UX が向上します。 |
| **CSR コードをそのまま SSR に転用できる？** | 可能。`router.load()` で Promise を事前決着させ、`dehydrate/hydrate` でキャッシュを埋め込むだけでよい。citeturn0search2 |
| **Streaming SSR の利点は？** | Suspense 境界単位で HTML をリアルタイム送信でき、ローディング状態でも即座にファーストバイトを返せる。 |

&gt; 💡 **覚え方**  
&gt; - **Suspense**: “待ってね”  
&gt; - **SSR**: “書いとくね”  
&gt; 別々の技術だけど、一緒に使うと「書いたけどまだ待ってね」を流れるように実現できます。

---
