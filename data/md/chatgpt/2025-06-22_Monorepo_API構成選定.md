# Monorepo API構成選定

日付: 2025-06-22

---

## 👤 ユーザー
*2025/6/22 16:30:13*

以下の私の要望文をうまくまとめて、もっと分かりやすいように変更してほしい。 

以下です。

pnpmでmonorepo構成にしたい。
monorepoだけどそれぞれは依存しないようにしたい。
共通のopenapi.yamlから別々のライブラリを使って生成されるコードで実装したい 
共通のtsconfig.base.json を作ってそれぞれでそれを継承したtsconfig.json で必要な設定をコントロールするpackage.jsonを作りたい。
それぞれの画面で、viteでreactを使ってAPIコールをして画面更新をするような画面を作る。
@tanstack/react-query を使って、useQueryと use mutationする実装を行う。
この5つのAPIを使うようなシンプルな画面を実装して欲しい。

"get","/api/posts",
"get", "/api/posts/{id}
"post", "/api/posts"
"put", "/api/posts/{id}"
"delete", "/api/posts/{id}

行いたいことは5点です。

openapiから生成したコードで clientコードを用いた型安全なリクエスト
react-queryでのカスタムhookの作成
zodでのリクエスト前のバリデーション
mswでインターセプト
fakerでのダミーデータ作成

これらを順に行っていきたい。 

選定するライブラリの選択肢の組み合わせは以下の3つです。
つまり、3つのパッケージを作るイメージです。

(1)
hey-api をベースで hey-api/client-fetchとzod と react-query のプラグインを使用する。mswとfakerの導入は後で検討。

(2)
openapi-typescriptをベースに openapi-fetch とopenapi-react-queryを用いる。
zodのスキームはhttps://github.com/astahmer/openapi-zod-client で zod スキーマだけを用いる。
https://www.npmjs.com/package/openapi-msw で MSW対応して、fakerをどう繋ぐかは後で検討する。

(3)
Orval をベースにこれのコンフィグでreact-query、zod、mockでMSW（それと自動でfakerでの生成）を対応する。
もしかするとreact-queryとzodはコンフィグを分けないといけないかもしれないが、それはうまく対応する

サーバーは立っていないので、一旦、prism でmockサーバーを立てて通信するイメージです。

---

## 🤖 アシスタント
*2025/6/22 16:30:15*

## 目的  
単一の **openapi.yaml** をもとに、_3 通り_ のクライアント生成スタックを比較できる **pnpm monorepo** を構築する。各パッケージは相互依存させず、共通設定だけを共有する。

---

### 1. ルート構成
| ディレクトリ | 役割 |
|-------------|------|
| `packages/stack-heyapi` | **hey-api** + client-fetch + TanStack Query + Zod |
| `packages/stack-oats`   | **openapi-typescript** + openapi-fetch + openapi-react-query + openapi-zod-client |
| `packages/stack-orval`  | **Orval** (react-query / Zod / MSW+Faker) |
| `openapi.yaml`          | 共通 API 定義（CRUD: `/api/posts` 系5本） |
| `tsconfig.base.json`    | ベース設定（各パッケージの `tsconfig.json` が継承） |
| `prism`                 | モックサーバー起動用スクリプト |

---

### 2. 共通開発ガイドライン

1. **pnpm workspace**  
   - 各スタックを独立パッケージ化し、依存はルートの devDependencies のみ共有。  
2. **TypeScript**  
   - ルートに `tsconfig.base.json` を置き、`strict` 系オプションはここで一括管理。  
3. **Vite + React**  
   - 各パッケージに `vite.config.ts` を配置し、画面は TanStack Query でデータ取得・更新を行う。  
4. **画面要件**（全スタック共通）  
   - 一覧・詳細・作成・更新・削除を行うシンプル UI。  
   - CRUD すべて `useQuery` / `useMutation` で実装。  
5. **テスト & モック**  
   - `prism mock openapi.yaml` でローカル API を提供。  
   - MSW を使うスタックでは通信をインターセプトし、Faker でダミー応答を生成。

---

### 3. 各スタックで実現すること

| 項目 | hey-api | openapi-typescript 系 | Orval |
|------|---------|-----------------------|-------|
| 型安全クライアント生成 | client-fetch | openapi-fetch | Orval client |
| TanStack Query 用フック | @tanstack/react-query プラグイン | openapi-react-query | Orval react-query |
| Zod スキーマ | `zod` プラグイン | openapi-zod-client | Orval zod |
| MSW 連携 | 手動設定予定 | openapi-msw | Orval mock (MSW+Faker) |
| Faker ダミーデータ | 後で検討 | 後で検討 | 自動生成 |

---

### 4. 実装ステップ（全スタック共通）

1. **コード生成**  
   ```bash
   # 例: hey-api
   npx hey-api openapi-ts -i ../../openapi.yaml -o src/generated --plugins=@hey-api/client-fetch,@tanstack/react-query,zod
   ```
2. **型安全リクエスト**  
   - 生成クライアントをラップして `api.ts` を用意。  
3. **カスタム React Query フック**  
   - `usePosts()` / `usePost(id)` / `useCreatePost()` … を実装。  
4. **Zod バリデーション**  
   - 送信前に入力データを `schema.parse` で検証。  
5. **MSW + Faker**  
   - モックレスポンスをスキーマに沿って自動 or 手動生成。  

---

これで、**同じ API 定義・同じ UI 要件** のもとで 3 種類のライブラリ構成を比較できる、整理された monorepo 設計となります。

---
