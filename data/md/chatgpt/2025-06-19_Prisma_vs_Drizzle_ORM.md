# Prisma vs Drizzle ORM

日付: 2025-06-19

---

## 👤 ユーザー
*2025/6/19 18:56:54*

TypeScriptで開発していて、 Drizzle と Prisma の どっちらのORM を使用すべきか迷っている。 
それぞれでできることできないことについて教えてほしい。 
型安全な開発にとても取り組んでいる。

---

## 🤖 アシスタント
*2025/6/19 18:57:06*

以下は \*\*Prisma v6 系\*\*（2025-06 時点）と \*\*Drizzle ORM v1.x\*\* を、特に “型安全” を重視する視点で整理した対比です。  

| 観点 | \*\*Prisma\*\* | \*\*Drizzle\*\* |
|---|---|---|
| \*\*モデル定義\*\* | 独自 DSL (`schema.prisma`) を書く → `prisma generate` で型付きクライアントを生成 | \*\*TypeScript コード\*\*でテーブル定義。`drizzle-kit` が SQL & 型を生成 |
| \*\*型安全性\*\* | 生成クライアントが戻り値・引数を完全型付け。v6.6 から ESM 対応の新ジェネレーターも提供 citeturn0search7 | DSL を使わず \*\*コード直接\*\*なので “型の出自が 100 % TypeScript”。SQL テンプレート (`sql\\`\\``) やビルダー API どちらでも型推論が効く citeturn0search2turn0search6 |
| \*\*DB 対応状況\*\* | Postgres / MySQL / MariaDB / SQL Server / SQLite / MongoDB / CockroachDB / Cloudflare D1 など (v6.6 で D1・Turso Preview) citeturn0search7 | Postgres / MySQL / SQLite / libSQL (Turso) / Aurora / (β) MSSQL・CockroachDB citeturn0search2 |
| \*\*クエリ表現\*\* | リポジトリ・サービス層に近い「モデル指向 API」。リレーションの `include / select` が強力 | \*\*SQL ライク\*\* or \*\*関数ビルダー\*\*。複雑 JOIN でも型が壊れにくい。関数合成で動的クエリを書きやすい citeturn0search4 |
| \*\*マイグレーション\*\* | `prisma migrate` がスキーマ差分を自動生成。CLI も GUI も成熟 | `drizzle-kit push` が TypeScript 定義 → SQL を静的生成。ダウンマイグレーションも SQL ファイルで管理 |
| \*\*実行エンジン\*\* | 従来は Rust バイナリ。v6.0+ で \*\*JS ネイティブドライバ\*\*を選択可能 (Rust→JS 切替で Cold-start が改善) citeturn0search3 | ドライバは pg / mysql2 など \*\*純 JS\*\*。クライアントサイズは &lt;10 kB。Serverless 環境でオーバーヘッドが小さい |
| \*\*エコシステム\*\* | Prisma Studio、Data Platform、Accelerate(キャッシュ)、Migrate UI、AI-MCP 連携ロードマップなどが揃う citeturn0search9 | Drizzle Studio (シンプルな GUI)。コミュニティ製 OSS が急増中だが、公式拡張サービスは少なめ |
| \*\*既存 DB の取り込み\*\* | `prisma db pull` で完全インポート (複雑なリレーション・コメントも反映) | `drizzle-kit introspect` はプレビュー段階でリレーション自動生成は限定的 |
| \*\*高度機能\*\* | トランザクション with interactive transactions、Field-level Encryption (Preview)、MongoDB ネイティブ API など | SQL 由来の機能は “書ければ使える” が、Prisma のようなラッパーは未実装 (例: フィールド暗号化) |

---

## 型安全という観点での「できる／できない」

### Prisma が得意
\* \*\*リレーションをまたぐ深いネスト\*\*が自動型付けで安全。  
  例: `include: { posts: { select: { comments: true } }}` でも推論が崩れない。
\* \*\*スキーマから UI・ドキュメント生成\*\*（Prisma Studio・ER 図など）まで一貫。
\* \*\*複数 DB サポートが幅広い\*\*ため「1 社 1 DB」戦略を採らない場合も安心。
\* \*\*“アプリ側に SQL を置かない”\*\*ポリシーでも困らない。複雑クエリでもクライアント API で表現可能（足りない場合は `queryRaw`）。

### Drizzle が得意
\* \*\*フルコードファースト\*\*なので VSCode 上でリネームや型リファクターが即座に反映。
\* \*\*SQL を書いても型が壊れない\*\* (`sql\\`SELECT \* FROM users WHERE id = ${id}\\``) — プリコンパイルされても型保持。
\* \*\*Serverless／Edge\*\* でのコールドスタートがごく小さい（バイナリ無し・ESM ネイティブ）。
\* \*\*動的にカラムを組み立てるメタプログラミング\*\*が DSL 制約なく実装できる。

### 逆に “難しいこと”
| | Prisma | Drizzle |
|---|---|---|
| \*\*自由度の高い動的 SQL\*\* | 複雑な部分は `queryRaw` (アンタイプ)。ORM の恩恵が薄れる | 可能だが \*\*N+1\*\*・パフォーマンスの責任が開発者側に寄る |
| \*\*マルチスキーマ DB\*\* | 公式でサポート (`schema "tenant1" { ... }`) | 同一プロジェクト内でスキーマ切替は手動管理 |
| \*\*MongoDB\*\* | ネイティブサポート | 未対応 |
| \*\*GUI レベルの移行管理\*\* | Prisma Studio 完備 | CLI 中心 (Drizzle Studio は限定機能) |
| \*\*生成物のサイズ\*\* | v6.6 で縮小したが still 数 MB | 数十 kB 以内 |

---

## 選択の目安

| あなたが重視すること | 向いている ORM |
|---|---|
| \*\*巨大プロジェクト・複雑リレーション・GraphQL/Nexus 連携\*\* | Prisma |
| \*\*Edge / Cloudflare Workers / AWS Lambda でのレスポンス\*\* | Drizzle |
| \*\*MongoDB を同時に扱う\*\* | Prisma |
| \*\*SQL を書きながら “型安全” を享受したい\*\* | Drizzle |
| \*\*データアクセス層を DSL で統制しチームのルールを強制\*\* | Prisma |
| \*\*生成物サイズ・Cold Start を最小化したい\*\* | Drizzle |

---

### 補足ヒント

\* \*\*移行コスト\*\*  
  Prisma ⇄ Drizzle はマイグレーション・クエリ API が根本的に異なるためワンクリック移行は不可。プロジェクト初期に選定するのが無難です。  
\* \*\*ハイブリッド戦略\*\*  
  2025 年は “90 % Prisma, 10 % Drizzle” のように \*\*機能別に二刀流\*\*する例もあります。リポジトリをモノレポ化し、共通型だけ共有すれば併用も現実的です。  
\* \*\*将来性\*\*  
  Prisma は AI MCP サーバーなど “フルマネージド・クラウドサービス” 方向に、Drizzle は “軽量・DB ネイティブ” 方向に伸びています。組織カルチャーと運用体制に合わせてご検討ください。

---

### まとめ

\* \*\*タイプセーフ\*\*さだけで見れば \*\*両者とも最上位クラス\*\*。  
\* \*\*記述スタイル・ランタイム特性・対応 DB\*\* が大きな分岐点。  
\* \*\*Serverless／Edge\*\* 中心なら \*\*Drizzle\*\*、  
  \*\*統合プラットフォーム・複雑リレーション\*\* を重視するなら \*\*Prisma\*\* が定番です。  

どちらを選んでも型安全開発は実現できますが、\*\*「チームの規模・運用ポリシー・将来の SaaS 連携」\*\* を軸に見比べてみてください。

---

## 👤 ユーザー
*2025/6/19 19:00:33*

つまりプリズマが有料化する可能性が高いということであっているかだろうか。 
 isolatedDeclarationsの設定の相性の差も知りたい。

---

## 🤖 アシスタント
*2025/6/19 19:02:09*

### Prisma が「有料化」する可能性について

|  | ライセンス | 現状の課金ポイント | 将来のリスク |
|---|---|---|---|
| \*\*Prisma ORM 本体\*\* | \*\*Apache-2.0\*\*（完全 OSS）citeturn14view0 | なし（npm でインストールしてローカル実行するぶんには無料） | 公式に「コアは OSS のまま」と明言しており、\*\*自前ホスト分が突然有料になる計画は公表されていません\*\*。VC バックの企業なので “100 % 永久無料” と断言はできませんが、少なくとも \*\*有料化する前に OSS コミュニティへ影響が及ぶ\*\*場合はライセンス変更告知 → 移行猶予期間が必要になります。 |
| \*\*Prisma Data Platform / Accelerate\*\* | 商用 SaaS | クエリ数・ストレージ量ベースの従量課金（無料枠あり）citeturn0search1turn0search4turn0search7 | こちらが Prisma の収益源。\*\*プラットフォーム側を強化してマネタイズする戦略\*\*なので、ORM 本体をクローズにするインセンティブは薄いと言われています。 |

&gt; \*\*結論\*\*  
&gt; - \*\*「Prisma を npm install して自分のサーバーで動かす」 = 今後も基本無料\*\*  
&gt; - 料金が発生するのは \*クラウド機能\*（Accelerate など）を使ったとき  
&gt; - OSS 部分を突然有料に切替える公式ロードマップは出ていない

---

### `isolatedDeclarations` との相性

`isolatedDeclarations` は TypeScript 5.5 で追加されたオプションで、\*\*各ファイルが単体で `.d.ts` を生成できるよう十分に型注釈が入っているか\*\*を厳しくチェックしますciteturn22search0turn22search3。

|  | Prisma | Drizzle |
|---|---|---|
| \*\*生成物の形式\*\* | `@prisma/client` は \*\*JS + 事前生成 `.d.ts`\*\*。あなたのアプリ側では “読むだけ” なので `isolatedDeclarations` の影響をほぼ受けません。 | \*\*スキーマを TypeScript コードで直接書く\*\*ため、そのファイル自体が `isolatedDeclarations` の対象になります。 |
| \*\*よくある症状\*\* | - ほぼ無し&lt;br&gt;- `export const prisma = new PrismaClient()` を \*\*外部へ再エクスポート\*\*する際に戻り値型を省略すると警告される程度 | - `pgTable()` などの戻り値をそのまま `export const users = …` とすると「型注釈が足りない」とエラー&lt;br&gt;- `InferModel&lt;typeof users&gt;` を別ファイルへ再エクスポートしたときの循環参照警告 |
| \*\*対処パターン\*\* | - 戻り値に明示型を書く: `export const prisma: PrismaClient = new PrismaClient()` | 1. \*\*スキーマ・型と実装ファイルを分ける\*\*&lt;br&gt;   `schema.ts` は `isolatedDeclarations` 対応用に明示型を付ける&lt;br&gt;2. \*\*ビルド時だけ除外\*\*: `tsconfig.build.json` で `exclude: \["./db/schema.ts"\]`&lt;br&gt;3. `drizzle-kit generate --declarations` で \*\*自動 `.d.ts` 出力\*\* → アプリ側はそれを参照 |

&gt; \*\*実務 tip\*\*  
&gt; - \*\*Prisma\*\* を採用している大半のプロジェクトは `isolatedDeclarations: true` をそのままオンにしてもビルドが通ります。  
&gt; - \*\*Drizzle\*\* では \*\*スキーマ定義ファイルに戻り値型を付ける\*\*か、ビルド対象から外すケースが多いです。プロジェクトルートの `tsconfig.json` は開発体験優先でゆるくし、`tsconfig.build.json`（CI 用）だけ `isolatedDeclarations` を厳格にする構成も定番です。

---

### まとめ

\* \*\*Prisma が近い将来「完全有料化」するという見立ては現状根拠が薄い\*\*  
  \* コアは Apache-2.0 で、収益は PaaS サービス側から得るモデル  
\* `isolatedDeclarations` との付き合い方  
  \* \*\*Prisma\*\*: ほぼ手間なし（生成クライアントが型を持っている）  
  \* \*\*Drizzle\*\*: スキーマがコードなので “export には明示型” などの追加作業が必要  

「型安全ファースト & ライセンスリスク最小」という観点なら、\*\*OSS コア + クラウド機能で課金\*\*という Prisma のビジネスモデルは比較的安心して採用できます。isolatedDeclarations をバリバリ使っていく場合は、\*\*Prisma のほうが手離れが良い\*\*というのが実務での肌感です。

---

## 👤 ユーザー
*2025/6/19 19:03:58*

モノレポでAPAパッケージとDBパッケージを分けている その場合、 Drizzleのパッケージだけ その設定をオフにすればいいのか。

---

## 🤖 アシスタント
*2025/6/19 19:03:59*

### 結論だけ先に
* **モノレポなら “DB パッケージだけ `isolatedDeclarations` をオフ” にする方法が一番シンプル**です。  
* ただし **`db` パッケージが他パッケージへ型をエクスポートする**場合は  
  1) **Drizzle の `.d.ts` 自動生成**を併用するか、  
  2) スキーマ定義ファイルをビルド対象から外す――など、  
  _「宣言ファイルをどう供給するか」_ を決めておく必要があります。

---

## 典型的なディレクトリ構成

```
repo/
├─ packages/
│  ├─ api/        ← Express／Hono など (Prisma or fetch client)
│  └─ db/         ← Drizzle (スキーマ & マイグレーション)
├─ tsconfig.base.json
└─ pnpm-workspace.yaml / package.json
```

### `tsconfig.base.json`（ルート）

```jsonc
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "isolatedDeclarations": true,    // 👈 デフォルトは “厳格”
    "composite": true,               // パッケージ間参照のため
    "declaration": true,
    "declarationMap": true,
    "outDir": "dist",
    "rootDir": "src",
    "types": []
  },
  "exclude": ["node_modules", "dist"]
}
```

### `packages/db/tsconfig.json`

```jsonc
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    // 👇 Drizzle スキーマが isolatedDeclarations に引っかかるなら false
    "isolatedDeclarations": false
  },
  // スキーマ定義ファイルが原因なら build から除外するのも可
  "exclude": ["./src/schema/**/*"]
}
```

### `packages/api/tsconfig.json`

```jsonc
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    // API パッケージは厳格に
    "isolatedDeclarations": true
  },
  // DB パッケージの型を参照
  "references": [{ "path": "../db" }]
}
```

---

## ポイントと補足

| 注意点 | 解説 |
|---|---|
| **宣言ファイルの供給** | `isolatedDeclarations:false` にすると **`tsc -b` でも `.d.ts` が出ません**。<br>→ 他パッケージで `import { users } from "@repo/db"` のように **直接スキーマを参照すると型が欠落**します。 |
| **対策 ① drizzle-kit で `.d.ts`** | `drizzle-kit generate --declarations` をビルド前に走らせ、<br>`src/schema.d.ts` を作るよう `package.json` に script を追加。<br>→ DB パッケージ自身は `isolatedDeclarations:false` でも **エクスポート側に .d.ts が存在**するので、依存側は型安全。 |
| **対策 ② スキーマだけ除外** | `exclude:["src/schema/**/*"]`＋`generate` で SQL/Migration だけ生成すれば、アプリの型参照は `InferModel` など _抽象化された型_ だけになるため `.d.ts` 不足問題を回避できます。 |
| **対策 ③ スキーマにだけ型注釈** | `export const users: PgTable<...>= pgTable(...)` のように明示型を付ければ `isolatedDeclarations:true` のままでも OK。<br>ただし _毎テーブルに型を書く手間_ が増えます。 |
| **CI／本番ビルド** | ルート `turbo run build --filter=...` や `pnpm -r run build` など “ワークスペースごとビルド” するときは、それぞれの tsconfig が尊重されるので **パッケージ単位でオン／オフを切替える設計で問題なし** です。 |

---

## まとめ

* **モノレポの tsconfig は _“base で厳格、db パッケージだけ緩める”_** が一般的な落としどころ。  
* ただし _型の受け渡し_ が発生するなら **`drizzle-kit --declarations` で .d.ts を生成**しておくと後工程が楽です。  
* 厳格運用を保ちたいなら `PgTable<...>` などの明示型でスキーマファイルを“静的化”するのも一手。  

このあたりを押さえておけば、**API パッケージは `isolatedDeclarations:true` で型安全を保ちつつ、Drizzle の柔軟性も活かせる**構成になります。

---

## 👤 ユーザー
*2025/6/19 19:05:50*

drizzle-kit generate --declarations これをしたジェネレートファイルをビルドするイメージであっているのか。 それともそれはもうビルド済みということなのか。

---

## 🤖 アシスタント
*2025/6/19 19:06:48*

### `drizzle-kit generate --declarations` の出力イメージ

| 生成物 | 中身 | その後にやること |
|---|---|---|
| `drizzle/schema.d.ts` など | **TypeScript 宣言ファイルだけ**（テーブル／モデル型・`InferModel` 型など） | 追加ビルド **不要**。コンパイラがそのまま読むだけなので “ビルド済み” 扱い |
| `drizzle/*.sql` & `_meta/*` | SQL マイグレーションとスナップショット | DB 反映時に `drizzle-kit migrate` や `migrate()` を実行 |
| `drizzle/schema.json` (dialect により) | スキーマ差分比較用スナップショット | drizzle-kit が内部で利用。アプリ側ビルドとは無関係 |

> `--declarations` は **「型情報をスタンドアロンで配布したい人向け」** の追加出力フラグです。  
> 生成された `.d.ts` は純粋に型注釈だけを含むため、**JS へのトランスパイルや minify は不要**。  
> CI では **① `drizzle-kit generate --declarations` → ② `tsc -b`** の順で回せば OK です。  
> （`tsc` は `.d.ts` をコピーするだけで再生成しません）

---

#### なぜ「ビルド済み」と言えるのか？

* TypeScript は **`.d.ts` を読むだけで型解決**し、ランタイム JS を生成しません。  
  つまり `.d.ts` に対して “さらに compile” する工程は存在しません。  
* アプリ実行時に必要な **ランタイム JS は元の `schema.ts` → `tsc` で生成**されるので、  
  `.d.ts` が JS 化されなくても動作には影響しません。

---

### モノレポでの典型フロー（db パッケージだけ `isolatedDeclarations:false` の場合）

```bash
# packages/db にて
pnpm db:generate   # = drizzle-kit generate --declarations
pnpm build         # = tsc -p .
```

```jsonc
// packages/db/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "isolatedDeclarations": false   // schema.ts は厳格チェックから除外
  },
  "include": ["src/**/*", "drizzle/**/*.d.ts"] // <-- 生成 d.ts を型解決に含める
}
```

これで

1. **型解決** … 他パッケージは `import * as schema from "@repo/db/drizzle/schema"` で  
   生成済み `.d.ts` をそのまま参照。
2. **ビルド** … `schema.ts` が JS 化される一方、`.d.ts` はコピーのみ。  
   追加コンパイルは発生しません。

---

### まとめ

* `drizzle-kit generate --declarations` が吐く `.d.ts` は **すでに“完成品”の型定義**。  
  追加のバンドルやトランスパイルは不要で、そのままコミット／ publish 可。  
* ランタイム JS は通常通り `tsc` が吐くので、 **「生成 → tsc」** の順序だけ守れば OK。  
* モノレポでは **db パッケージだけ `isolatedDeclarations` をオフ**し、  
  生成 `.d.ts` を含むよう `include` パスを調整するのが最小コストの運用です。  

この構成なら、API パッケージ側は厳格型チェックを維持しつつ、Drizzle の柔軟性も活かせます。

---
