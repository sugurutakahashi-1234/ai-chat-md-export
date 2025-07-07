# Swagger UI サーバーツール比較

日付: 2025-06-04

---

## 👤 ユーザー
*2025/6/5 1:07:48*

openapi.yaml から npm ツールで、swagger uiでのサーバーを建てられるツールの候補の比較をして欲しい

---

## 🤖 アシスタント
*2025/6/5 1:09:07*

以下では、**「既存の openapi.yaml を読み取り、Swagger UI つきの HTTP サーバーを npm だけで手早く立てられる代表的ツール」**を 5 つ選び、特徴・向き／不向き・メンテ状況を比較しました。  
──いずれも *npm install* だけで利用でき、「ブラウザで `/docs` 等にアクセスすると Swagger UI が表示され、そこから API を試せる」レベルまで最短数行で到達できます。

| ツール | タイプ | 1 行で起動例 | 主な強み | 注意点 | 最終リリース |
|-------|-------|-------------|---------|--------|-------------|
| **swagger-ui-express** | Express ミドルウェア | ```app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec))``` | - Express プロジェクトなら追加 3 行で導入可能<br>- ミドルウェアなので認証や CORS 設定も既存コードで一元管理 | Express 以外だと使いにくい | 「last year」＝ 1 年以上更新なし citeturn0search0 |
| **@fastify/swagger-ui** | Fastify プラグイン | ```await fastify.register(require('@fastify/swagger-ui'), {spec})``` | - Fastify v4/5 に公式に対応<br>- CDN ではなくローカルに UI を配備するのでオフラインでも動作 | Fastify 依存。プラグイン一式を `await` で登録する必要がある | 3 日前に更新（活発） citeturn0search3 |
| **@hono/swagger-ui** | Hono ミドルウェア | ```app.get('/docs/*', serveSwaggerUI({ spec }))``` | - Cloudflare Workers など Edge ランタイム向けフレームワーク Hono と親和性◎<br>- ほぼゼロ設定で UI 付き | Hono 専用。Node/Express の代替にはならない | 3 か月前に更新 citeturn0search4 |
| **swagger-ui-watcher** | スタンドアロン CLI | ```npx swagger-ui-watcher openapi.yaml``` | - **開発時に便利**：yaml を監視してホットリロード、ブラウザ自動オープン<br>- Express などのコードは一切不要 | 本番向け機能（認証・圧縮など）は自前で用意する必要 | `npm install -g` 方式。OAS 3対応 citeturn0search1 |
| **swagger-ui-dist (+ 任意の静的サーバー)** | 純粋な静的アセット | ```npx http-server ./node_modules/swagger-ui-dist``` | - 一番シンプル＆フレームワーク非依存<br>- HTML を直接編集すればテーマ変更も容易 | - yaml→json 変換や UI オプション注入は自分でスクリプトを書く必要<br>- ホットリロードなし | npm 公式配布モジュール citeturn2search4 |

---

### 選択ガイド

| 目的 / 制約 | おすすめ |
|-------------|----------|
| **既存の Express API に後付けで文書を付けたい** | **swagger-ui-express**：既存ミドルウェアチェーンに 3 行追加するだけ |
| **Fastify で API を書いている／v5 に移行予定** | **@fastify/swagger-ui**：公式プラグインなのでバージョン整合が取りやすい |
| **Cloudflare Workers / Bun / Edge ランタイム** | **@hono/swagger-ui**：軽量で ESM 前提。デプロイ先を選ばない |
| **ローカル編集中にとにかくすぐプレビューしたい** | **swagger-ui-watcher**：CLI ひとつでホットリロードまで完結 |
| **サーバー側で UI 以外のコードは要らない・静的ホスティングで済ませたい** | **swagger-ui-dist** + 好きな静的サーバー（Vercel／GitHub Pages など） |

---

### 比較ポイントの補足

1. **ホットリロード**  
   - swagger-ui-watcher が唯一標準搭載。ほかは nodemon などで再起動するか、ブラウザをリロードする運用になる。

2. **UI カスタマイズ**  
   - 5 ツールすべてで `swagger-ui` のオプション（`docExpansion`, `withCredentials` 等）を渡せるが、*swagger-ui-dist* は HTML を直編集するため自由度が最も高い。

3. **メンテナンス状況**  
   - Fastify 系・Hono 系は 2025 年も継続的にリリースされており、**TypeScript 型定義付き**。  
   - swagger-ui-express はダウンロード数こそ多いものの更新は緩慢なので、Express v5 以降で問題が起きたらフォークを検討。

4. **Production Ready**  
   - 実運用で UI も公開したい場合は **フレームワーク連携版（Express / Fastify / Hono）** が最も楽に認証・CORS を一元管理できます。  
   - CLI 版・静的版は Netlify/Vercel 等の**静的ホスティング**と組み合わせると CI/CD がシンプルです。

---

## まとめ

- **フレームワークをすでに選定済みなら、その公式プラグインが最短で安全**。  
- **仕様書だけサクッと共有したい開発初期**は *swagger-ui-watcher*。  
- **静的サイトでドキュメントだけ切り離したい**場合は *swagger-ui-dist* を GitHub Pages などに置くのが手軽です。  

用途に合わせて最小構成で始め、必要になった段階でプラグイン版へスムーズに移行できる構成を意識すると運用コストが抑えられます。

---

## 👤 ユーザー
*2025/6/5 1:10:13*

@hono/swagger-ui 使っている

---

## 🤖 アシスタント
*2025/6/5 1:10:14*

了解しました！  
では **既存の `openapi.yaml` を読み込み、`@hono/swagger-ui` で `/docs` 配下に Swagger UI を公開する最小～実運用向け構成** をサンプルコード付きで解説します。  
（コメントも含めすべて日本語にしています）

---

## 1. 依存関係

```bash
pnpm add hono @hono/node-server @hono/swagger-ui yaml
pnpm add -D typescript @types/node tsx
```

- **`yaml`** … `openapi.yaml` をオブジェクトへパース  
- **`@hono/node-server`** … Node.js 上で Hono を動かすときだけ必要  
  - Cloudflare Workers／Bun／Lambda など別ランタイムのときは不要

---

## 2. ディレクトリ例

```
project-root/
├─ src/
│  └─ server.ts     # Hono エントリ
├─ openapi.yaml     # 既に用意済みの API 定義
└─ tsconfig.json
```

---

## 3. `src/server.ts`

```ts
/* -------------------------------------------------
 * Hono + Swagger UI 最小実装
 * ------------------------------------------------- */

import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { serveSwaggerUI } from '@hono/swagger-ui'
import { readFile } from 'node:fs/promises'
import YAML from 'yaml'

async function main() {
  // openapi.yaml を読み込んで JS オブジェクト化
  const yamlText = await readFile('./openapi.yaml', 'utf8')
  const spec = YAML.parse(yamlText)

  const app = new Hono()

  // API 本体（例）
  app.get('/hello', (c) => c.json({ message: 'Hello Hono!' }))

  // Swagger UI を /docs/* にマウント
  // Cloudflare Workers など Edge でも動くよう ESM で import 推奨
  app.route('/docs', serveSwaggerUI({ spec }))

  // Node.js ローカル用サーバー起動
  serve({ fetch: app.fetch, port: 3000 })
  console.log('🚀  http://localhost:3000/docs で Swagger UI が開きます')
}

main().catch(console.error)
```

ポイント
1. **`YAML.parse` してから `spec` に渡す**  
   - `@hono/swagger-ui` 側は JS オブジェクトか JSON 文字列を期待するため  
   - YAML → JSON 変換処理を書けば CI で自動生成することも可能
2. **`app.route('/docs', …)`** にすると  
   - `/docs` に HTML、本体 JS/CSS が `/docs/static/～` で配信されます
3. **ファイル監視のホットリロードが欲しい場合**  
   - `tsx watch src/server.ts` でコード変更を即リスタート  
   - `openapi.yaml` の変更検知は `nodemon` などで追加監視可

---

## 4. パスやテーマのカスタマイズ

```ts
app.route('/api-docs', serveSwaggerUI({
  spec,
  /* Swagger UI オプション例 */
  swaggerUIOptions: {
    docExpansion: 'none',    // 初期状態でタグを閉じる
    displayRequestDuration: true,
    persistAuthorization: true
  },
  /* ページタイトルや CSS を変えるなら下記 */
  pageTitle: 'My Awesome API',
  customCss: '.swagger-ui .topbar { display: none }'
}))
```

---

## 5. CORS・認証をかける場合

```ts
// 全エンドポイントに CORS ヘッダー
app.use('*', (c, next) => {
  c.header('Access-Control-Allow-Origin', '*')
  return next()
})

// /docs だけ Basic 認証
app.use('/docs/*', async (c, next) => {
  const auth = c.req.header('Authorization')
  if (auth !== 'Basic ' + Buffer.from('user:pass').toString('base64')) {
    return c.text('Unauthorized', 401, { 'WWW-Authenticate': 'Basic realm="docs"' })
  }
  return next()
})
```

---

## 6. Cloudflare Workers など Edge へのデプロイ

Hono 本体は **`app.fetch`** さえ渡せばランタイム非依存で動作します。  
Workers 用エントリを作るなら:

```ts
import { Hono } from 'hono'
import { serveSwaggerUI } from '@hono/swagger-ui'
import spec from '../dist/openapi.json'  // ビルド時に YAML→JSON 化

const app = new Hono()
app.route('/docs', serveSwaggerUI({ spec }))

export default app
```

- `wrangler.toml` で `entry-point = "src/worker.ts"`  
- YAML 変換は Vite や esbuild のプラグインで OK

---

## 7. よくある落とし穴

| 症状 | 原因と対処 |
|------|-----------|
| **/docs が真っ白** | `spec` に `$schema: "http://json-schema.org/draft-07/schema"` が混入していると UI が解析できず落ちる → YAML 側で削除 or bundler で弾く |
| **大きな YAML の読み込みで cold start が遅い** | ビルド時に `openapi.yaml` → `openapi.json` へ変換し、ESM import でバンドルに含める |
| **Edge 環境で `fs` が使えない** | `YAML.parse(await fetch('…').text())` で KV / R2 / S3 などから取得するか、上記のバンドル方法に切り替える |

---

### まとめ

- **@hono/swagger-ui は “spec オブジェクトを渡すだけ” で最短**。  
- YAML をそのまま投げる場合は **`yaml` パッケージでパース**。  
- 認証や CORS、テーマ変更もミドルウェア／オプションで一元管理でき、Edge～Node どこへでもデプロイ可能です。  

これで「`openapi.yaml` → Swagger UI 付きサーバー」まで一気通貫で構築できます。試してみて詰まる点があればお知らせください！

---
