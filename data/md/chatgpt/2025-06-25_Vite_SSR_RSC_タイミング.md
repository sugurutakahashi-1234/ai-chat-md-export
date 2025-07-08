# Vite SSR RSC タイミング

日付: 2025-06-25

---

## 👤 ユーザー
*2025/06/25 22:01:04*

Nextjsを使わずにシンプルなViteでのReactでTanStack QueryでAPIリクエストをするとして簡単なhooksを定義してSSRやRSCをする価値は実装コストとなどを考えたときにする必要はありそうか？
全部最新のSDkとして考えて欲しい

---

## 🤖 アシスタント
*2025/06/25 22:01:23*

### 結論（TL;DR）

- **SEO／初期表示を重視するページが少ない or 企業内ツールのようにログイン後しか見えない SPA なら、クライアント専用で十分**。SSR/RSC を入れても効果は薄く、セットアップと保守の手間が増えるだけ。  
- **マーケ系 LP やパブリックな記事一覧など――限定的な画面だけでも高速な初期描画やクローラ対策が欲しい場合は SSR（Vite-SSR）を検討**。導入コストは “Node サーバー + QueryClient のデハイドレート” 程度で済む。  
- **「全部 RSC」の構成を Vite 単独で安定運用するのは 2025-06 時点でもまだ実験的**。Next.js や Waku ほど完成度の高い DX が得られず、業務プロジェクトでの採用は慎重に。  

---

## 1. SSR / RSC を入れると得られるもの

| 効果 | SSR | RSC |
| ---- | --- | --- |
| SEO クローラが HTML を読める | ◎ | ◎ |
| TTFB/LCP 改善（HTML 先出し）| ◎ | ◎ (ストリーミングでさらに良) |
| Hydration コスト削減 | △（JS は結局全送信） | ◎（Server Only なら JS 0 byte） |
| 使い慣れたクライアント API（TanStack Query の hook 等） | ◎ | △（サーバ部は `useQuery` ではなく `queryClient.fetchQuery` を直接呼ぶなど工夫が必要） |
| 実装安定度・エコシステム | ◎（Vite 公式ガイド） | ▲（Vite-plugin-react-server はまだ experimental） |

---

## 2. Vite + SSR の現状と実装コスト

- **公式ガイドと `create-vite-extra` に React 用 SSR テンプレートあり**。エントリーポイントを `server.js` と `index.html` に分け、`render(url, { queryClient })` で HTML を返す形が基本。 citeturn0search1  
- **必要な追加作業**  
  1. Node(Edge) サーバーを 1 枚置く（Express、Fastify ほか何でも）  
  2. サーバー側で `queryClient.prefetchQuery(...)` → `dehydrate(queryClient)`  
  3. クライアント側で `<HydrationBoundary state={dehydratedState}>` で復元 citeturn1search0  
- **実装コスト感**：ファイル 2〜3 枚増える程度。Vite プラグインは不要。CSR→SSR への移行負荷は低め。

---

## 3. Vite + React Server Components (RSC) の現状と実装コスト

- **React 19 で RSC が Stable になったとはいえ、Next.js 以外のエコシステムは発展途上**。 citeturn0search3turn0search6  
- Vite には「vite-plugin-react-server」が登場したばかり（3 週間前）。依存する `react-server-dom-esm` はまだ experimental。バグ報告も多く、ドキュメントも最小限。 citeturn0search2  
- **実装コスト**  
  1. ルートを `app/` ディレクトリに置き、`.server.jsx / .client.jsx` を明示  
  2. Webpack とは異なる RSC 専用ランタイムのバンドル設定が必要（プラグイン任せだが内部実装を追うことになる）  
  3. TanStack Query は **サーバ側では hook が使えない**ため、`queryClient.fetchQuery()` と `dehydrate` を自前で組み合わせる必要がある  
- **結論**：RSC を Vite 単独で本番運用するのは、現在は PoC レベルが無難。SEO・パフォーマンスだけが目的なら、成熟した SSR で十分。

---

## 4. TanStack Query 5 と SSR/RSC の組み合わせ

```ts
// src/hooks/usePosts.ts
import { useQuery } from '@tanstack/react-query'
import { getPosts } from '../api'

export const usePosts = () =>
  useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
  })
```

### SSR 版（抜粋）

```ts
// server.ts (Node エントリ)
import express from 'express'
import { renderToString } from 'react-dom/server'
import { QueryClient, dehydrate } from '@tanstack/react-query'
import { App } from './src/App'

const app = express()

app.get('*', async (req, res) => {
  const queryClient = new QueryClient()

  // 必要なクエリをまとめてプリフェッチ
  await queryClient.prefetchQuery({ queryKey: ['posts'], queryFn: getPosts })

  const dehydrated = dehydrate(queryClient)
  const html = renderToString(<App dehydratedState={dehydrated} />)

  res.send(`
    <!DOCTYPE html>
    <html><head></head>
    <body>
      <div id="root">${html}</div>
      <script>window.__REACT_QUERY_STATE__=${JSON.stringify(dehydrated)}</script>
      <script type="module" src="/src/main.tsx"></script>
    </body></html>
  `)
})

app.listen(5173)
```

- クライアント側は v5 から `HydrationBoundary` に変更。 citeturn1search8  
- **RSC パターン**：サーバ・クライアントでキャッシュを共有する２通り  
  - *Initial-data pattern*（HTML に埋め込む）  
  - *Hydration-Boundary pattern*（従来と同じ）  
  どちらも公式ガイドに例あり。 citeturn1search6  

---

## 5. 採用判断の指針

| シナリオ | おすすめ |
|----------|----------|
| **SEO が不要、社内ツール／SPA** | CSR のみ（Vite + TanStack Query） |
| **一部ページだけ SEO/高速初期表示が欲しい** | Vite 公式 SSR を追加し、そのページだけ `prefetchQuery` |
| **全ページでストリーミング + JS 送信削減まで徹底したい** | Next.js App Router or Waku など RSC フルサポート枠を採用 |
| **Vite で RSC を試したい／個人開発でリスク許容** | `vite-plugin-react-server` + TanStack Query initial-data pattern |

---

### まとめ

- **「やる意義＝SEO・パフォーマンスをどれだけ重視するか」**。ニーズが限定的なら SSR/RSC に振り切るコストは回収しにくい。  
- **SSR は “やろうと思えばすぐ出来る” レベルで枯れている**ので、ピンポイントに導入するのはアリ。  
- **RSC は Vite 単独だとまだ実験段階**。本番で安定を求めるなら 2025-06 現在は Next.js が無難。  

これで疑問点があれば、具体的なプロジェクト規模や SEO 要件を教えてもらえれば、さらに踏み込んだ設計案を提案できます！

---

## 👤 ユーザー
*2025/06/25 22:07:55*

SEOやらないとどうなるのか？

---

## 🤖 アシスタント
*2025/06/25 22:08:07*

## “SEO をやらない”と起こること

| 影響領域 | 具体的な症状 | なぜ起こるか |
| --- | --- | --- |
| **検索流入がほぼ来ない** | 新規ユーザーの大半が検索から辿り着けない。業界平均で **全トラフィックの 50 % 以上が検索由来** と言われるため、その分がゼロに近づく。 | 検索結果に露出しない／下位に沈むため。citeturn0search11 |
| **収益・問い合わせ減少** | EC なら売上、SaaS ならトライアル申し込みが鈍化。 | 見込み客との最初の接点を失う。広告や SNS で穴埋めすると CAC が上がる。 |
| **競合にシェアを奪われる** | 同じキーワードで競合だけが表示され、ブランド想起でも後れをとる。 | SERP は相対評価。自社がやらなければ他社が上がるだけ。 |
| **アルゴリズム更新で“突然死”リスク** | 2025 年 3 月コアアップデートでは一部サイトで **可視性 30 % 以上減** の例も。対策ゼロだと影響をモロに受ける。 | コアアップデートは品質シグナルが弱いページを大きく下げる傾向。citeturn0search1turn0search5 |
| **JavaScript SPA 特有の落とし穴** | - Google は二段階レンダリング（HTML クロール → JS 実行）なので **インデックス反映が遅延**。&lt;br&gt;- Bing/Yahoo!（JP）は JS 実行がさらに弱い → **まったく表示されない**ケースも。 | SSR や Dynamic Rendering なしだと crawler が主要コンテンツを取得できない。citeturn0search2turn0search6 |
| **ブランド信頼性の低下** | ユーザーが社名＋製品名で検索しても 1 位に出ない → 「この会社大丈夫？」感。 | エンティティ情報（構造化データ・被リンク）が不足。 |
| **シェア／プレビュー崩れ** | Twitter / Slack で URL を貼ったときにタイトル・OGP が出ずクリック率低下。 | メタタグ整備も広義の SEO。 |

---

### 「検索に頼らないサービス」でも最低限は必要

- **社内ツール**のようにログイン壁の内側しかない場合でも、トップページやリクルート記事が検索不可視だと採用広報で不利。  
- **モバイルアプリ中心サービス**でも、公式サイトが検索で見つからないとストア遷移率が落ちる。  
- **広告依存**に切り替えると、クリック単価上昇 × コンバージョン率低下で LTV／CAC バランスが崩壊しやすい。

---

### JavaScript SPA が SEO を疎かにしたときの実例

| 事例 | 結果 |
| ---- | ---- |
| HubSpot（2025 年初頭） | コアアップデート後、月間オーガニック流入が **約 2,400 万 → 1,600 万** へ急落。CTR も大幅低下。citeturn0search8 |
| 複数メディア系 SPA | JS レンダリング遅延で AMP を停止した結果、インデックス登録率が 60 %→20 % 台まで落ち込むケース多数（フォーラム報告）。 |

---

## いつ “本当に” SEO を捨ててもいいか？

| OK なケース | 理由 |
| --- | --- |
| **完全クローズド BtoB SaaS／社内業務アプリ** | 顧客獲得が営業やパートナー経由で、検索流入が KPI でない。 |
| **イベント LP で広告のみ集客、寿命 1 〜 2 か月** | 時間的にインデックス待ちより広告最適化が速い。 |
| **ステージング／プライベートβ** | robots.txt でブロックするので SEO 不要。 |

それ以外（公開 Web サービス・コンテンツビジネス・採用サイト等）は、**最低限のテクニカル SEO（メタタグ・サイトマップ・構造化データ）と、JS SPA なら SSR か静的生成の導入**が“保険”としてほぼ必須です。

---

### まとめ

1. **検索シェア 50 % 以上**という事実から、SEO を無視すると潜在顧客の半分を失う。  
2. JS SPA で SSR せず放置 → Google 以外は拾わない、Google でも遅延・欠落が起きる。  
3. 今すぐフルスケールの SEO 部門を作る必要はなくても、**基礎対策＋クローラが読める HTML** まではやらないと、後でスケールした瞬間に「入口がない」状態になり、広告依存のコスト増で苦しむ。  

&gt; **結論**: “SEO をやらない自由” はあるが、その選択肢は **検索流入ゼロ前提のビジネスモデルを組めるか**どうかに尽きます。ほとんどの公開 Web プロダクトでは、そのリスクは大きすぎる――というのが 2025 年時点での現実です。

---

## 👤 ユーザー
*2025/06/25 22:10:13*

ViteSSRはTan Stack Queryと相性いいのか？
またTan StackStartという選択肢もあるのか？

---

## 🤖 アシスタント
*2025/06/25 22:10:32*

### 1. Vite SSR × TanStack Query ― 相性は “◎”

| 評価軸 | 結論 | 根拠／コメント |
|--------|------|----------------|
| **公式サポート** | 問題なく動く | TanStack Query v5 が用意する `queryClient.prefetchQuery` + `dehydrate()` → `<HydrationBoundary>` という **SSR/Hydration API はフレームワーク非依存**。Vite 公式 SSR ガイドの「React テンプレート」にそのまま組み込める。citeturn0search0turn0search10 |
| **実装コスト** | 低い | 追加ファイルは最大 3 つ程度（`server.ts`, `entry-client.tsx`, `entry-server.tsx`）。TanStack Query のみでキャッシュ共有が完結し、Redux などを別途導入する必要もない。チュートリアル例も豊富。citeturn0search2 |
| **落とし穴** | ほぼなし | Hydration mismatch は **「ルーティングをサーバ側でも完全決定しておく」**ことで解消可。TanStack Router を組み合わせる場合は `router.load()` を server で await してから `renderToString` すれば OK。Stack Overflow でもこの手順が推奨。citeturn0search3 |

&gt; **まとめ**: Vite SSR と TanStack Query は公式の Next.js サポートと同等レベルで噛み合う。**“自前で SSR を書きたい派” には一番コスパが良い組み合わせ**です。

---

### 2. 「TanStack Start」というもう一つの選択肢

| 特徴 | 内容 |
|------|------|
| **フルスタック・メタフレームワーク** | Vite + Nitro ランタイム上に、TanStack Router/Query/Server Functions を統合。ファイルベースのルーティングと型安全な RPC も同梱。citeturn0search1 |
| **SSR・ストリーミング・RSC** | ルートごとに `data$`（サーバ関数）を宣言 → 自動で `prefetchQuery` & `dehydrate`。React 19 の RSC ストリーミングもオプションで有効。公式 Examples に「Start + React Query」が用意済み。citeturn1search0turn1search7 |
| **DX** | `npm create tanstack` で雛形生成 → すぐ Netlify/Vercel/Nitro へデプロイ可能。Query Devtools がレイアウトに組込済み。 |
| **成熟度 (2025-06)** | **β → RC 段階**。本番運用事例は少数だが、公式ドキュメントとコミュニティが急速に拡大中。LogRocket など技術ブログでも “Next.js の対抗馬” と注目。citeturn0search7 |

&gt; **まとめ**: **“TanStack 製品で統一して、RSC まで一気に乗りたい”**なら Start が最短ルート。逆に「既存 SPA を段階的に SSR 化したい」なら、無駄なく Vite SSR を足した方がシンプルです。

---

### 3. 採用判断の目安

| プロジェクト像 | ベストチョイス |
|----------------|----------------|
| 既存 Vite SPA／SSR だけ追加したい | **Vite SSR + TanStack Query**&lt;br&gt;（Query の de/hydrate を 2〜3 ファイル追加するだけ） |
| これから新規 & “TanStack 一色” で行く／RSC に本気 | **TanStack Start** |
| 小規模・SEO 不要（社内ツール等） | **CSR のみ**：SSR コストは回収しづらい |

---

### 4. 最低限の実装スケッチ（Vite SSR 版）

```ts
// server.ts
import express from 'express'
import { renderToString } from 'react-dom/server'
import { QueryClient, dehydrate } from '@tanstack/react-query'
import App from './src/App'
import { getPosts } from './src/api'

const app = express()

app.get('*', async (req, res) => {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({ queryKey: ['posts'], queryFn: getPosts })

  const html = renderToString(
    <App dehydratedState={dehydrate(queryClient)} />
  )

  res.end(`<!DOCTYPE html>
  <html><body>
    <div id="root">${html}</div>
    <script>window.__TANSTACK_STATE__=${JSON.stringify(
      dehydrate(queryClient)
    )}</script>
    <script type="module" src="/src/entry-client.tsx"></script>
  </body></html>`)
})

app.listen(5173)
```

クライアント側は `createRoot(HydrationBoundary …)` で完了。公式の Next.js 用サンプルと 100 % 同じ API なので学習コストは最小です。citeturn0search0

---

## 結論

- **Vite SSR + TanStack Query**  
  - ✔ 相性抜群、ファイル数もわずか、既存 SPA の延命に最適  
- **TanStack Start**  
  - ✔ Router／Query／Server Functions の統合 & RSC 対応  
  - ⚠ まだ RC フェーズ。ドキュメント充実＆コア作者がメンテ中で将来は有望

**「SSR だけ欲しい」なら Vite SSR で十分。  
「TanStack で統一し、フルスタックや RSC も攻めたい」なら Start を検討**—この二択で考えると失敗しにくいです。

---

## 👤 ユーザー
*2025/06/25 22:12:32*

TanStack Start はSSRメインなのかRSCメインなのかSEO対策はどちらが効くか？

---

## 🤖 アシスタント
*2025/06/25 22:12:54*

### TanStack Start の立ち位置  
| 視点 | 現状 (2025-06) | 典拠 |
|------|----------------|------|
| **アプリの基盤** | **フルドキュメント SSR がデフォルト**。初期 HTML をまるごと生成し、必要に応じてストリーミング配信。 | citeturn0search1 |
| **RSC 対応** | “オプション扱い”。`examples/start-basic-rsc` のように **RSC も組み込める**が、プラグインや型定義は still RC。 | citeturn0search6 |
| **開発フロー** | `npm create tanstack` で生成されるプロジェクトは SSR 構成が標準。RSC を使う場合は `router/react/examples` 系サンプルを手動で移植。 | citeturn0search1turn0search6 |

&gt; **結論:** TanStack Start は **SSR がメインストリーム**。RSC は「試したい人向けの追加ギア」という位置づけです。

---

### SEO 効果は SSR vs. RSC どちらが強い？

| 比較項目 | SSR (標準) | RSC (ストリーミング) | 備考 |
|-----------|-----------|----------------------|------|
| **Google/Bing へのインデックス** | ◎ ほぼ確実 | ◎ ストリームでも HTML が届けばインデックス可 | Google はストリーミング対応済み citeturn1search5 |
| **クロール完了までの安定性** | ◎ 実運用例が多く安全 | ▲ RSC 部分のマークアップが “後流し” になるため、実装ミスで空 HTML を返すと未インデックスリスク | ― |
| **LCP/TTFB などパフォーマンス指標** | ◯ 初期 HTML 送信で高速だが、JS 量は多め | ◎ JS 0 byte の「Server Only」領域を作れる | パフォ改善が検索順位に間接効果 |
| **メタタグ挿入の容易さ** | ◎ `serverFn` で自由に `<head>` 生成 | ◎ 同様 | ― |
| **開発・運用安定度** | ◎ 枯れている | ▲ まだ RC／バグ報告あり | citeturn0search6turn0search8 |

#### まとめ
- **SEO 目的で確実に成果を出すなら** TanStack Start 標準の **SSR が鉄板**。  
- **RSC でも SEO 効能は同等**（HTML を返す限り）は得られるが、**運用コストとリスクが上がる**。RSC 採用理由が「JS 削減」や「最新技術への先行投資」でなければ、SEO だけを理由に選ぶ必要はない。

---

### 実装指針

1. **まず SSR 版で投入**  
   - `data$` サーバ関数で `queryClient.prefetchQuery()` → `dehydrate()` し、`<HydrationBoundary>` へ。  
2. 将来 **RSC へ段階移行**したくなったら、  
   - ページ/ルート単位で `.server.tsx` → `.client.tsx` に分割。  
   - SSR と RSC を同居させつつ KPI を比較（LCP/CLS・クロール完了率など）。  

---

### 要点

- **TanStack Start = SSR が標準、RSC は選択的機能**。  
- **SEO 観点では SSR が“安全牌”**。RSC も効果は同じだが、現状の実装安定度を考えると実務では SSR 優先が無難。  

これで方向性が決まりそうでしょうか？ さらに具体的なスターターテンプレートや KPI 計測のセットアップが必要ならお知らせください！

---
