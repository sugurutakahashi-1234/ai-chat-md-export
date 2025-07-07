# React Router v7 vs Next.js

日付: 2025-05-22

---

## 👤 ユーザー
*2025/5/22 19:29:14*

TypeScriptでのフロントエンド開発について質問がある。

以下の認識である。

- React Router v7 （React + Vite + SSR等が統合） 
- Next.js （React + Webpack + SSR等が統合）

React Router v7とNext.js の比較を行って欲しい。
また、今現在新規に開発するとしたらどのような場合にどちらのケースがおすすめなのかを知りたい。

---

## 🤖 アシスタント
*2025/5/22 19:30:04*

### ざっくり⽐較 ― 概念の違い
| 項目 | \*\*React Router v7（RR v7）\*\* | \*\*Next.js 15.x\*\* |
|---|---|---|
| 性格 | ルーティング\*\*ライブラリ\*\*＋“Framework mode”で SSR/SSG を追加できる | フルスタック\*\*メタフレームワーク\*\*（ルーティング・SSR・バンドラー・API まで同梱） |
| デフォルトバンドラー | \*\*Vite\*\*（公式プラグイン入りで HMR 超高速）citeturn0search0turn7view0 | \*\*Webpack → Turbopack\*\*（dev は stable／build は α）、Rspack 実験的サポートciteturn4view0turn5view0 |
| ルーティング方式 | オブジェクト／JSX ルート定義 ＋ Framework mode で \*\*ファイルベース\*\*も選択可 | \*\*ファイルベース\*\*（`app/` & `pages/`）固定 |
| データ取得 | `loader` / `action`／React18 Suspense & Await | \*\*React Server Components\*\*・`fetch()`キャッシュ・Server Actions |
| SSR/SSG | `ssr: true` と `prerender()` 設定で実装。サーバーは自前で用意 | `next build` で SSG、ISR、PPR を自動処理 |
| API 層 | なし（別途 Hono/Express などを組み合わせ） | \*\*Route Handlers\*\* で API／ミドルウェアを同居 |
| 型安全 | v7.6.0 で \*\*“Automatic Types for Future Flags”\*\*、TypeScript 補完を改善citeturn3view0 | 独自 TS LSP プラグイン（15.3 で 60% 速く）citeturn5view0 |
| 主な強み | 最⼩限・柔軟・Vite の爆速 DX／Electron・Tauri SPA にも最適 | 充実機能を“ほぼ設定ゼロ”で使用、SEO & 量産実績豊富、Vercel 連携 |

---

### それぞれを選ぶシチュエーション

| あなたが… | おすすめ |
|---|---|
| \*\*Vite の開発速度を最優先\*\*し、既存 SPA/Electron/Tauri に段階的 SSR を導入したい | \*\*React Router v7\*\*&lt;br&gt;Framework mode で SSR だけ＋α を追加し、他スタック（Hono/Express、tRPC 等）は自由に組み合わせ。Vercel へのロックインも無し。 |
| \*\*ブログ・マーケティングサイト・プロダクトサイト\*\*など SEO 必須で、Image 最適化・Edge Functions・API Routes をワンストップで使いたい | \*\*Next.js\*\*&lt;br&gt;ISR や PPR、Image などのバッテリー同梱機能と Vercel の CDN 最適化がそのまま使える。 |
| \*\*社内向けダッシュボード\*\*で規模が中〜⼤、RSC/Server Actions を活かしたい | \*\*Next.js (App Router)\*\*&lt;br&gt;React19 対応済みで将来の React Compiler にもスムーズ。 |
| \*\*スタートアップの MVP\*\*で “⼿数最小＋自由度最⼤” を取りたい | \*\*RR v7 + Vite + 任意バックエンド\*\*&lt;br&gt;ビルドもデプロイも軽く、将来 Remix/Next への移行コストも小さい。 |
| \*\*大規模チーム\*\*で共通パターン・ドキュメントが重要 | \*\*Next.js\*\*（既製の慣習・ツールチェーンが豊富） |
| \*\*マイクロフロントエンド\*\*や \*\*複数ランタイム（Web + モバイル WebView など）\*\*を同じルーティング API で動かしたい | \*\*RR v7\*\*（`createMemoryRouter`/`createHashRouter` など多様なランタイムに最適化） |

---

### 補足で押さえておきたい最新トピック

\* \*\*RR v7.6.0（2025-05-08）\*\*  
  \* `routeDiscovery` オプションで\*\*Lazy ルートマニフェスト\*\*を細かく制御できるciteturn3view0  
  \* Framework mode の `react-router.config.ts` に `ssr` や `appDirectory` を書くだけで \*\*ファイルベース + Vite SSR\*\* が有効に。citeturn7view0  

\* \*\*Next.js 15.x\*\*  
  \* \*\*React19 対応\*\*と \*\*Async Request API\*\*（`cookies()`, `headers()` が async 化）など破壊的変更あり。公式 codemod で自動移行が推奨。citeturn4view0  
  \* 15.3 で \*\*Turbopack build (α)\*\* や \*\*Navigation Hooks\*\*、\*\*instrumentation-client\*\* が追加。citeturn5view0  

---

## まとめ

\* \*\*フル機能をすぐ使いたい／SEO が命\*\* → \*Next.js\*  
\* \*\*自分でスタックを組みたい／Vite の高速 DX を最重視\*\* → \*React Router v7\*  

どちらも TypeScript ファーストで React19 に追随しています。  
「SSR ありきのプロダクトか」「Vercel 連携の有無」「開発速度 vs. バッテリー同梱」の天秤で選択するのが、2025 年春時点の⾏き先です。

---

## 👤 ユーザー
*2025/5/22 19:38:29*

SSRは難しいのか？また実装するコードも変わってくるのか？SEO対応もReact Routerでは大変なのか？ 実装したことがないのでその辺も教えてほしい

---

## 🤖 アシスタント
*2025/5/22 19:38:56*

## 1. まず「SSR は何が増えるのか？」

| 役割 | CSR (従来) | SSR を足すと増えるもの |
|---|---|---|
| **実行場所** | すべてブラウザ | ①**Node/Edge サーバー**で `renderToPipeableStream()` などを実行 |
| **ビルド** | `vite build` → 静的 bundle | ②**サーバーエントリ**（`entry-server.tsx` など）と<br>③**クライアントエントリ**（`entry-client.tsx`）を出力 |
| **データ取得** | `useEffect` / SWR | ④**リクエスト時データ取得 API**<br>　Next: `getServerSideProps()` / RSC<br>　RR v7: `loader()` |
| **HTML テンプレート** | `index.html` だけ | ⑤サーバー側で HTML をストリーム生成し <br>　クライアントで **hydration** |

SSR の「難しさ」は、①〜⑤を自前で配線するか、フレームワークが肩代わりしてくれるかで決まります。

---

## 2. Next.js の場合 ― “全部入り”で **簡単**

```tsx
// app/page.tsx  (App Router)
export default async function Page() {
  const posts = await fetch("https://api.example.com/posts").then(r => r.json());
  return <PostList posts={posts} />;
}
```

* ページを **フォルダに置くだけ**で自動 SSR。  
* SEO は `export const metadata = { title: "トップ", description: "…" }` の 1 行で `<title>` や `<meta>` が HTML に直書きされる。  
* デプロイは `next build && next start`、または Vercel に push するだけ。  

> “SSR が難しい” という作業は Next がすでに隠蔽しており、コードは通常の React 関数コンポーネントとほぼ同じです。citeturn0search2

---

## 3. React Router v7 + Vite の場合 ― **組み立て式**だが v7 でかなり楽に

### 3-1. ルート定義（Framework mode）

```ts
// react-router.config.ts
import { Route } from "react-router";

export const routes: Route[] = [
  {
    path: "/",
    element: <Home />,
    loader: async () => ({ posts: await api.getPosts() }),
    ssr: true,          // ← これで当該ルートをサーバー描画
    meta: () => [{ name: "description", content: "ホーム" }],
  },
];
```

### 3-2. エントリ―

```tsx
// entry-server.tsx
import { renderToPipeableStream } from "react-dom/server";
import { RouterProvider, createStaticHandler } from "react-router";
import routes from "./react-router.config";

export default function handleRequest(req, res) {
  const handler = createStaticHandler(routes);
  const { pipe } = await handler.query(req.url);
  res.setHeader("Content-Type", "text/html");
  pipe(res);   // ストリーミング
}
```

```tsx
// entry-client.tsx
import { hydrateRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "react-router";
import routes from "./react-router.config";

hydrateRoot(
  document,
  <RouterProvider router={createRouter(routes)} />
);
```

### 3-3. Vite 設定 (抜粋)

```ts
export default defineConfig({
  plugins: [react(), reactRouter()],
  build: { ssr: "entry-server.tsx" }
});
```

* **v7 Framework mode** では `ssr: true` と Vite プラグインだけで
  - HTML テンプレート注入
  - ルートごとの data pre-fetch (`loader`)
  - ストリーミング out
  が済むため、従来より圧倒的に手順が少ない。citeturn0search0turn0search4
* とはいえ **サーバー起動コード（Express/Hono など）** は自分で書く必要がある。  
* SEO 向け `<meta>` は `meta()` プロパティか **react-helmet-async** を組み合わせる。後者は下記の 1 行で利用可。citeturn0search11  

```tsx
import { Helmet } from "react-helmet-async";
<Helmet>
  <title>ホーム</title>
  <meta name="description" content="ホーム" />
</Helmet>
```

---

## 4. SEO の労力比較

| 項目 | **Next.js** | **React Router v7 + SSR** |
|---|---|---|
| `<title>` / `<meta>` | `export const metadata = …` に集約 | `meta()` か react-helmet 系を個別に設置 |
| OG 画像の自動生成 | `generateImageMetadata()` API あり | 別途ライブラリ / 手動 |
| Image 最適化 | `<Image>` コンポーネント + CDN | 手動または Vite Plugin |
| Sitemap / robots.txt | `next-sitemap` プラグイン多数 | `vite-plugin-pages-sitemap` 等を自前導入 |
| CLS, LCP 最適化 | Vercel 分析ツールをワンクリック | Lighthouse など外部導入 |

> **結論**:  
> *「SEO 設定 → ビルド → 配信」までをワンストップで済ませたい場合は Next.js が圧倒的に楽*。  
> React Router でも全て可能ですが、**プラグイン選定とサーバー設定**を自分で行う必要があります。

---

## 5. まとめ — “難しさ” の正体

| 観点 | **Next.js** | **React Router v7 + Vite** |
|---|---|---|
| SSR 導入 | `app/` フォルダに置くだけ | Vite SSR + エントリ 2 本 + サーバーコード |
| コードの変化量 | ページ内に `metadata` を追加する程度 | ルートファイル＋サーバーエントリを追加 |
| SEO 作業量 | 最小（公式 API & Vercel） | ヘッダ管理・SiteMap 生成を自前で構成 |

> *「SSR ＝難しい」というよりは、**Next.js がそれを代行している**か、  
> **自分でレイヤーを積み上げるか**の違い*です。  
> Vite×React Router の Framework mode なら **以前ほどは大変ではない**ものの、  
> **“なんでも自分で選びたい or Vercel ロックインを避けたい”** 場合に向いています。

---

## 👤 ユーザー
*2025/5/22 19:44:09*

NextjsもVercelを採用しないとその辺の恩恵を得られないのか？ React  Router も何か恩恵を受けられるサービスはあるのか？

---

## 🤖 アシスタント
*2025/5/22 19:45:21*

### 1. Next.js × ホスティングサービスの関係

| 機能 | \*\*ローカル／自前 Node でも可\*\* | \*\*Vercel で“簡単”になる部分\*\* | \*\*他サービスでの代替\*\* |
|---|---|---|---|
| SSR / RSC / Server Actions / ISR / PPR | すべてフレームワーク本体に含まれるため self-host 可 | クリック 1 回のデプロイ・自動 Edge 配置・`next.config` 不要 | Cloudflare \*\*OpenNext アダプタ\*\*や Netlify \*\*Next Runtime v5\*\* が同等機能をカバー【turn3view0】・【turn4search0】 |
| 画像最適化 (`next/image`) | 手動で Image CDN を設定すれば可 | \*\*Vercel Image Optimization\*\* がグローバル CDN と自動連携【turn0search5】 | Cloudflare Images + OpenNext アダプタで類似機能【turn3view0-L10】 |
| 動的 OG 画像 | 自前 API Route でも可能 | `@vercel/og` で 1 行、キャッシュも自動【turn0search2】【turn0search8】 | Cloudflare Functions にも `vercel/og` 互換プラグインあり【turn1view0-L7】 |
| Edge Middleware | Cloudflare Workers / Netlify Edge Functions でも動くがビルド調整が必要 | 追加設定ゼロ・自動で Edge Network に配置 | OpenNext が Cloudflare Workers で Edge Middleware をサポート【turn3view0-L8〜L11】 |

&gt; \*\*結論\*\* – \*\*Next.js は Vercel“専用”ではない\*\*。  
&gt; ただし \*「設定ゼロで即使える便利機能」\* の多くが Vercel に最適化されており、他プロバイダーでは \*\*OpenNext / Netlify Runtime などのアダプタを噛ませる\*\*か、自前で CDN 設定を行う手間が増えます。

---

### 2. React Router v7（Framework Mode）× ホスティングサービス

| サービス | 主なサポート内容 | 補足 |
|---|---|---|
| \*\*Vercel\*\* | 公式 \*\*React Router Preset\*\* で&lt;br&gt; ・SSR/SSG ルート自動関数化&lt;br&gt; ・バンドル分割&lt;br&gt; ・Fluid Compute (Edge ⇔ Lambda 自動切替)【turn2search0】【turn2search2】 | `react-router.config.ts` に `presets:\[vercelPreset()\]` を追加するだけ |
| \*\*Netlify\*\* | `@netlify/vite-plugin-react-router` で&lt;br&gt; ・Functions/Edge Functions への自動マッピング&lt;br&gt; ・`netlify.toml` 雛形と CLI 検出【turn5view0】 | 2025-4 時点で \*Edge SSR は準備中\*（origin SSR は可） |
| \*\*Cloudflare Workers / Pages\*\* | `C3` テンプレート `--framework=react-router` で&lt;br&gt; ・Edge SSR&lt;br&gt; ・Workers KV を使ったキャッシュ&lt;br&gt; ・Tailwind など同梱【turn6search1】【turn6search2】 | Wrangler 1 コマンドでデプロイ。βだが GA 発表済み（2025-04） |
| \*\*その他\*\* | Fly.io・Render などでは Vite SSR 出力を Node サーバとして起動 | 404 ハンドリングやヘッダ生成は自力実装が必要 |

&gt; \*\*ポイント\*\* – React Router でも \*\*Vercel/Netlify/Cloudflare が“プリセット”を用意\*\*しており、Next.js 同様に “デプロイすると自動で SSR & CDN 化” まで面倒を見てくれます。従来の「自前 Express で SSR 配線」が必須という状況ではありません。

---

### 3. どこまでサービス依存になるのか？

| 依存度 | Next.js | React Router |
|---|---|---|
| \*\*0 %（完全自前）\*\* | Node サーバ or Edge Runtime にビルド artefact を置けば動く | Vite SSR 出力 ＋ 任意サーバ（Hono など） |
| \*\*中（アダプタ利用）\*\* | OpenNext (AWS Lambda/S3, Cloudflare, Netlify)【turn3view0】【turn4search0】 | Netlify / Cloudflare の Vite Plugin が SSR, Functions を自動生成 |
| \*\*高（プラットフォーム機能活用）\*\* | Vercel の OG 生成・Analytics・画像最適化など | Vercel Preset の Fluid Compute、Edge Config、Image CDN |

&gt; \*どちらも「コードはオープン、運用はサービスでラクに」という 3 段階から選択可能\*  
&gt; ただし \*\*Next.js は Vercel でしか使えない付加価値（Analytics, Speed Insights など）が多い\*\*一方、React Router はまだ「コア機能＋α」を各社が追随中という構図です。

---

### 4. 選択ガイド

| 判断軸 | おすすめ |
|---|---|
| \*\*セットアップを最小化し、画像最適化や OG 生成もワンクリックで欲しい\*\* | \*\*\*Next.js + Vercel\*\*\* |
| \*\*ベンダーロックインを避けつつ Edge SSR も使いたい\*\* | \*Next.js + OpenNext (Netlify/Cloudflare)\* |
| \*\*ルータだけでなく API も自由に組み、Vite の高速 DX を保ちたい\*\* | \*React Router v7 + 任意ホスト\* |
| \*\*将来 RSC/Server Actions に頼らず、React 本来の DSL で開発したい\*\* | \*React Router v7\* |

---

## TL;DR

\* \*\*Next.js の機能は本体に実装されているので他社ホストでも動く\*\*。  
  ただし Vercel 上なら \*「設定レス」「CDN 最適化済み」\* で使えるボーナスが多数。  
\* \*\*React Router v7 も Vercel/Netlify/Cloudflare が専用プリセットを提供\*\*し、SSR & CDN 化を簡略化。  
  まだ新しいため、Edge SSR や画像最適化などはサービスによって対応状況が異なる。  
\* \*\*選択は“DX の手軽さ vs. インフラ自由度”\*\*。  
  \*手間を減らしたいなら Vercel + Next.js、一方でスタックをフルカスタムしたいなら React Router + 任意ホスト\* が現時点（2025-05）のベストバランスです。

---

## 👤 ユーザー
*2025/5/22 19:51:30*

Nextjsを採用する明確なデメリットは？

---

## 🤖 アシスタント
*2025/5/22 19:53:03*

### Next .js を採用する前に知っておきたい “ハッキリした” デメリット

| 分類 | 具体的な痛点 | なぜ問題になるか |
|---|---|---|
| \*\*ベンダーロックイン傾向\*\* | \*公式には「どこでも動く」と言うが\* \*\*ビルド成果物が Vercel 固有形式\*\*。他ホストは undocumented API を逆解析 or OpenNext などで追随するしかない。 | アダプタ不在・Build Output API 未対応のため移行コストが高い。citeturn9view0 |
| \*\*学習コスト／複雑さ\*\* | App Router + RSC + Middleware + Edge Functions… \*\*「単なるルーター」では無い巨大フレームワーク\*\*。 | 初学者は「クライアントかサーバか」「キャッシュの境界」など決断が増え、デバッグ難度も上がる。citeturn2view0 |
| \*\*RSC・Server Actions の“精神的コスト”\*\* | コンポーネントに `use server` / `use client` 境界を意識させられる。 | コード分離に慣れた React/Vite 開発者ほど負荷が大きい、というコミュニティの声。citeturn7view0 |
| \*\*ビルド／ツール鎮痛期\*\* | Turbopack は dev 用は stable だが \*\*`next build --turbopack` はまだ α\*\*。Webpack↔Turbopack間で挙動差が残る。 | 大規模モノレポや CI で \*\*ビルド時間・互換性問題\*\* が発生しやすい。citeturn5view0 |
| \*\*パフォーマンスの振れ幅\*\* | RSC/Hydration の負荷・Edge / Lambda コールドスタート。 | 「小規模 SPA なのに JS バンドルが肥大」「SSR が逆に遅い」ケースが報告多数。citeturn2view0 |
| \*\*運用コストと価格\*\* | Vercel Pro は \*\*1Seat 20 USD/月 + 実行量課金\*\*。ISR・画像最適化・Functions も従量課金。 | SEO 不要の社内ツールなどだと\*\*オーバースペック＆割高\*\*。コミュニティでも価格高騰リスクを警戒する声。citeturn4view0 |
| \*\*ポータビリティ不足\*\* | 公式サーバレスモード廃止、Edge 最適化フラグは Vercel 専用分岐。 | 「どこでも動く」は“理屈上”だが、\*\*他クラウドで同等性能を得るには逆解析が必要\*\*。citeturn9view0 |
| \*\*リリースサイクルの速さと破壊的変更\*\* | v14→15 でも `partial prerendering` API 変更、React 19 対応でメタデータ API の async 化など。 | 企業利用では \*\*長期運用でのアップグレード工数\*\* が想定以上に膨らむ。 |
| \*\*セキュリティ&ガバナンス懸念\*\* | 2025 Q1 の \*\*Middleware Bypass CVE\*\* と公開プロセスの不透明さが議論に。 | フレームワークとホスティングの同一企業支配が「単一障害点」になり得る、との指摘。citeturn9view0 |

---

#### ざっくりまとめ

\* \*\*「SEO が生命線」「画像最適化も OG 生成もワンクリックで欲しい」\*\* — 依然として \*Next .js + Vercel\* が最短ルート。  
\* しかし \*\*“フルセット前提” の設計が重荷になる場面\*\*（社内 SaaS、PWA、Electron／Tauri など）では、  
  \*React Router v7 ＋ Vite\* や \*\*Remix / Astro / TanStack Start\*\* のほうが&lt;br&gt; 📦 軽量 🧩 自由 💰 低コスト という場合が増えています。

&gt; 要は \*\*「バッテリー同梱の便利さ」⇔「制御不能な重さ」\*\* のトレードオフ。  
&gt; Next .js を選ぶなら、  
&gt; \*ベンダーロック・学習コスト・長期運用コスト\* の３点をあらかじめ許容できるかをチェックしておくと安心です。

---
