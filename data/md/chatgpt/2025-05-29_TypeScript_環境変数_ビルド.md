# TypeScript 環境変数 ビルド

Date: 2025-05-29

---

## 👤 User
*2025-05-29 11:23:42*

TypeScriptのことがよくわかっていないのだけれども、ビルドしたら、環境変数の値もコンパイルされて dist に入るのか？それとも別々に  │
│   読み込まれるのか？ビルドしてデプロイされている時はどういう形で環境変数を取得して動くのか？つまり、パスが維持されているのか知りたい

---

## 🤖 Assistant
*2025-05-29 11:23:43*

### TL;DR  
- **TypeScript を `tsc` でコンパイルしただけなら**、`process.env.FOO` などは *そのまま文字列として残り*、本番サーバーが起動したときに OS から値が注入されます。  
- **フロントエンド用のバンドラ（Vite、Webpack など）でビルドする場合**は、設定次第で `.env` の値を JavaScript に *埋め込んで* しまうことが多いです（＝dist に値が焼き込まれる）。  
- デプロイ時は「**いつ値を解決するか**」でルールが変わります。  
  - **サーバーサイド／CLI** → *実行時* に OS・コンテナ・PaaS が `process.env` に載せる。  
  - **ブラウザに配る JS** → *ビルド時* に “公開してもいい変数” だけを置換するのが普通。  

---

## 1. tsc だけの世界（純粋な Node.js/CLI アプリ）

```ts
// src/index.ts
console.log("API key:", process.env.API_KEY);
```

1. `tsc` は **シンタックスだけを JS に変換**し、`process.env.API_KEY` には触りません。  
2. 出力先 `dist/index.js` はこんな感じになります。

```js
"use strict";
console.log("API key:", process.env.API_KEY);
```

3. 本番で `node dist/index.js` を起動するとき、たとえば Linux なら  

```bash
API_KEY=supersecret node dist/index.js
```  

   という形で **実行時に OS が差し込む**── dist には値は含まれていません。

### まとめ  
- dist フォルダには *キー名* だけ残り、**値は入らない**。  
- したがって `.env` ファイルをリポジトリに入れず、本番では PaaS（Railway、Render、Fly.io など）の UI や `docker run -e` でセットするのが定石です。

---

## 2. バンドラを使うフロントエンド (Vite / Webpack / Next.js など)

### 2-1. ビルド時に値を焼き込む

```ts
// src/App.tsx
console.log("API endpoint:", import.meta.env.VITE_API_BASE);
```

- **Vite** は `.env.production` を読み、`import.meta.env.VITE_API_BASE` を **文字列リテラルに置換**してからバンドルします。  
- したがって `dist/assets/*.js` には `https://api.example.com` のような **値が直接書き込まれる**。

&gt; ⚠️ 秘密情報（API キーなど）は絶対に埋め込まないこと。ブラウザに配る JS は誰でも読めます。

### 2-2. 実行時に値を差し替えるパターン

- Next.js で `process.env.NEXT_PUBLIC_*` を参照する場合もビルド時置換。  
- ただし **Edge Functions / Server Components** ではサーバー起動時の `process.env` が使えるので、クライアントへ漏らさずに済みます。

---

## 3. デプロイ時の「パス（場所）の保持」について

| フェーズ          | 何がどこに残るか | どこで値が決まるか | よく使う仕組み |
|------------------|-----------------|--------------------|----------------|
| **tsc + Node**   | dist に *キー名* | コンテナ / OS の環境変数 | `.env`, Docker `-e`, PaaS UI |
| **Vite / Webpack** | dist に *値そのもの* | ビルドパイプライン          | `.env.production`, `DefinePlugin` |
| **Next.js (API Route)** | dist に *キー名* | 実行時 (Server)     | Vercel / Fly.io の Env |
| **Docker Compose** | 変数は image に含めず bind | `docker-compose.yml` の `environment:` | `.env` ファイル読み込み |

- **パスが維持されるか？**  
  - Node アプリ: 実行ファイルのパスはビルド場所に固定されますが、環境変数は *どこで起動しても* 同じキー名で取れます。  
  - フロントエンド資産: CDN に配置しても値はすでに置換済みなので「どのパスに置いても」動きます。

---

## 4. ベストプラクティス

1. **秘密情報は必ずランタイム注入**（サーバー側 `process.env`）。  
2. **公開していい定数だけビルド時置換**（`VITE_PUBLIC_*` などプレフィックスで管理）。  
3. **CI/CD では二段階**  
   - テスト用 `.env.test` を読み込んでユニットテスト実施  
   - 本番ビルド用には Secrets Manager / PaaS UI で値を渡す  
4. **Docker** なら  
   ```yaml
   services:
     app:
       build: .
       env_file:
         - .env.production
       environment:
         - NODE_ENV=production
   ```  
   で「イメージ → 値を含まず」「コンテナ起動時 → 値をマウント」する。

---

### まとめ

- **サーバーアプリ**: dist には値が入らず、**実行時に注入**。  
- **ブラウザ向け**: 多くの場合 **ビルド時に埋め込む**（＝dist に値が入る）。  
- パス（ファイル配置先）はどちらでも問題にならず、「*いつ・どこから値を流し込むか*」を設計すれば OK です。

---
