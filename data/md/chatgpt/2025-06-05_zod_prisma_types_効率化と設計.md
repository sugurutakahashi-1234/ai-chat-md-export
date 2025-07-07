# zod-prisma-types 効率化と設計

日付: 2025-06-05

---

## 👤 ユーザー
*2025/6/5 17:15:25*

https://github.com/chrishoermann/zod-prisma-types について、どう思うか？過剰設計か？それとも開発の効率化が見込めるか？

---

## 🤖 アシスタント
*2025/6/5 17:16:23*

### 一言で — **Prisma を「唯一の真実のソース」にしたいなら *zod-prisma-types* は“効率化”、そうでなければ “ちょっと大げさ”**  

---

## ライブラリの概要と特徴
| 項目 | 内容 |
|------|------|
| 機能 | Prisma **model / enum / input / arg / filter** すべての Zod スキーマを自動生成し、Prisma のリッチコメントから `@zod.string.min(3)` などの **バリデータも抽出**【turn8view0】【turn9view0】 |
| 対応 Prisma 版 | 4 – 6 系【turn9view0】 |
| 週次 DL | 約 **7.5 万** (2025-06 時点)【turn9view0】 |
| Star / Issue | ★ 793・Open Issue 92 件（活動中）【turn1view0】【turn0search2】 |
| 競合 | `zod-prisma` (DL 1 万)【turn11search1】、`prisma-zod-generator` (DL 5 千)【turn12view0】 |

### 何が便利か
* **重複定義ゼロ**  
  Prisma スキーマ → Zod → `zod-to-openapi` などで OpenAPI も作れ、_DB · 型 · バリデーション · API_ を完全に一筆書きにできる。  
* **実運用で欲しい生成物が多い**  
  `UserFindManyArgsSchema` など **arg/filter スキーマ**まで出るので tRPC / TanStack Query での入力チェックが楽。  
* **リッチコメントでバリデーション宣言**  
  「nullable だけど文字数 3〜10」などを Prisma ファイル内で完結させ、設計意図が散逸しない。  

---

## 効率化になるケース
| 典型シナリオ | 期待できる効果 |
|--------------|---------------|
| **Prisma がシステムの中心** (DDD の Entity ≒ Prisma Model) | FE/BE 共通型・入力検証を完全自動化。型ズレバグのクラスごと消える |
| **tRPC / Hono + Zod で API 作成** | 生成された *ArgsSchema* をそのまま `procedure.input()` へ渡すだけ |
| **大量モデル** (≈30↑) やマルチチーム | 手書き Zod 保守コスト >> 生成ステップ追加コスト |

> **貴社スタックとの相性**  
> Hono + `@hey-api/openapi-ts` で *OpenAPI ↔︎ Client* はもう自動化されていますよね。  
> もし **Prisma → Zod → Zod-to-OpenAPI → openapi-ts** というパイプラインに寄せられれば、  
> “DB 定義を直せば全レイヤーに型が伝搬” という理想にかなり近づきます。

---

## 過剰設計になり得るポイント

| リスク | 説明 / 回避策 |
|--------|---------------|
| **生成ステップが重い** | 大型スキーマで `ERR_WORKER_OUT_OF_MEMORY` 報告あり【turn0search2】。`useMultipleFiles=false` でメモリ削減、CI マシンの heap 拡張などが必要になる場合も。 |
| **メンテナー = 個人** | 4 カ月前に v3.2.4 リリースと比較的活発だが、Issue は 90+ 件。Critical なバグは自力パッチ前提になるかもしれない。 |
| **学習コスト** | Prisma コメントで Zod バリデータを書く独自 DSL に慣れる必要。小規模案件だと“書いた方が早い”ことも。 |
| **ソースオブトゥルース競合** | 既に *OpenAPI → Zod* で回しているなら、“Prisma と OpenAPI のどちらを真実とするか” で設計がぶれる。 |

---

## 他ツールとの比較 (機能差分早見表)

| 機能 | **zod-prisma-types** | prisma-zod-generator | zod-prisma |
|------|----------------------|----------------------|------------|
| model schema | ✅ | ✅ | ✅ |
| **input / arg / filter** schema | ✅ | △ (select/include だけ) | ❌ |
| Prisma コメントでバリデーション | ✅ | ❌ | ✅(簡易) |
| Weekly DL | **75k**【turn9view0】 | 5k【turn12view0】 | 10k【turn11search1】 |
| 最終更新 | 4 ヶ月前 | 2 年前 | 9 ヶ月前 |
| 活動度 | ⭐ 793 / Issue 92 | ⭐ 360 / Issue 40 | ⭐ 540 / Issue 30 |

---

## 結論 & おすすめ判断フロー

1. **Prisma を“契約書”にしたいか？**  
   *Yes* → *zod-prisma-types* を導入し、OpenAPI も Zod から起こす構成に移行検討  
   *No* → 既存 OpenAPI 主導で十分。Zod スキーマ生成は `openapi-ts` が賄うので不要

2. **モデル数・開発人数が多いか？**  
   *多い* → 重複削減メリットが勝つ  
   *少ない* → 手書き／軽量ジェネレータで OK

3. **CI で `prisma generate` が遅くても許容？**  
   *許容*＋メモリ調整可能 → OK  
   *厳しい* → シンプルな `prisma-zod-generator` などで最小限に

---

### 使う場合の最小設定例

```prisma
generator zod {
  provider = "zod-prisma-types"
  output   = "./generated/zod"
  // チーム事情で必要なものだけ true にすると生成量を抑えられます
  createInputTypes  = true
  createModelTypes  = true
  addInputTypeValidation = false
}
```

---

## TL;DR

* **中〜大規模で Prisma 駆動なら “効率化”**。  
* **小規模 or OpenAPI 主導なら “過剰”**。  
* 採用するなら、  
  * Prisma を最上流に置くアーキテクチャへ舵を切る  
  * CI メモリと `prisma generate` 時間の監視を忘れない  
  * “自分でフォークして直す”覚悟があると安心です。

---

## 👤 ユーザー
*2025/6/5 17:25:22*

今はhonoの定義から、@hono/zod-openapi" で yaml を生成して、そのyamlから@hey-api/openapi-tsのpluginsの@hey-api/client-fetchと"zod"とクライアントのコードを生成しているが、zod-prisma-typesはどこに関わってくるだろうか？

import { swaggerUI } from "@hono/swagger-ui";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import type { User } from "@myapp/database";
import {
  type DatabaseErrorInfo,
  formatDateTime,
  getStatusCodeFromErrorType,
  logger as sharedLogger,
} from "@myapp/shared";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { env } from "./env.js";
import { handlePrismaError } from "./errors/prisma-handlers.js";
import { getUserService } from "./services/user.service.js";

/\*\*
 \* APIパスとHTTPメソッドから一意なoperationIdを生成する
 \*
 \* @param method - HTTPメソッド (get, post, put, delete など)
 \* @param path - APIパス (/api/users/{id} など)
 \* @returns 生成されたoperationId
 \*
 \* 命名規則:
 \* - GET /api/users -&gt; getUsersApi
 \* - GET /api/users/{id} -&gt; getUserByIdApi
 \* - POST /api/users -&gt; postUsersApi
 \* - PUT /api/users/{id} -&gt; putUserByIdApi
 \* - DELETE /api/users/{id} -&gt; deleteUserByIdApi
 \*/
function generateOperationId(method: string, path: string): string {
  // パスを正規化（先頭の/api/を除去、{id}などのパラメータを処理）
  const normalizedPath = path
    .replace(/^\\/api\\//, "") // /api/ を除去
    .replace(/\\{(\\w+)\\}/g, (\_, param) =&gt; {
      // {id} -&gt; ById, {userId} -&gt; ByUserId（パラメータ名をPascalCaseに変換）
      return `By${param.charAt(0).toUpperCase() + param.slice(1)}`;
    })
    .split("/")
    .filter(Boolean)
    .map((segment, index) =&gt; {
      // 最初のセグメント以外はPascalCase
      if (index === 0) {
        return segment;
      }
      return segment.charAt(0).toUpperCase() + segment.slice(1);
    })
    .join("");

  // HTTPメソッドを小文字にして結合
  const operationId = `${method.toLowerCase()}${normalizedPath.charAt(0).toUpperCase() + normalizedPath.slice(1)}Api`;

  return operationId;
}

// Zodスキーマ定義（@hono/zod-openapiからzをインポート）
const UserDataSchema = z
  .object({
    id: z.string().openapi({
      example: "abc12345",
      description: "ユーザーID",
    }),
    name: z.string().openapi({
      example: "田中太郎",
      description: "ユーザー名",
    }),
    email: z.string().email().openapi({
      example: "tanaka@example.com",
      description: "メールアドレス",
    }),
    createdAt: z.string().openapi({
      example: "2024-01-15 10:30:00",
      description: "作成日時",
    }),
  })
  .openapi("User");

const CreateUserRequestSchema = z
  .object({
    name: z.string().min(1).openapi({
      example: "田中太郎",
      description: "ユーザー名",
    }),
    email: z.string().email().openapi({
      example: "tanaka@example.com",
      description: "メールアドレス",
    }),
  })
  .openapi("CreateUserRequest");

const ApiResponseSchema = &lt;T extends z.ZodTypeAny&gt;(dataSchema: T) =&gt;
  z.object({
    data: dataSchema,
    status: z.enum(\["success", "error"\]).openapi({
      example: "success",
    }),
    message: z.string().optional().openapi({
      example: "操作が成功しました",
    }),
  });

const ErrorResponseSchema = z
  .object({
    data: z.null(),
    status: z.literal("error"),
    message: z.string().openapi({
      example: "エラーが発生しました",
    }),
  })
  .openapi("ErrorResponse");

// OpenAPIHonoアプリを作成
const app: OpenAPIHono = new OpenAPIHono();

// ミドルウェアを設定
app.use("\*", logger());

// CORS設定（t3-env検証済み環境変数を使用）
const getCorsOrigins = (): string\[\] =&gt; {
  sharedLogger.info(
    `Environment: ${env.APP\_ENV}, CORS Origins: ${env.CORS\_ORIGINS}`,
  );
  return env.CORS\_ORIGINS;
};

app.use(
  "/api/\*",
  cors({
    origin: (origin, \_c) =&gt; {
      const allowedOrigins = getCorsOrigins();

      // 同一オリジンリクエスト（originがundefined）を許可
      if (!origin) return null;

      // 許可リストに含まれているかチェック
      if (allowedOrigins.includes(origin)) {
        return origin;
      }

      // 本番環境でサブドメイン対応が必要な場合の例（コメントアウト）
      // if (process.env\["NODE\_ENV"\] === 'production' && origin.endsWith('.example.com')) {
      //   return origin;
      // }

      return null; // 拒否
    },
    credentials: true,
    maxAge: 600, // Safariの上限（10分）
    allowMethods: \["GET", "POST", "PUT", "DELETE"\] as const,
    allowHeaders: \["Content-Type", "Authorization"\],
    exposeHeaders: \["X-Request-ID", "X-Total-Count"\],
  }),
);

// OpenAPI仕様とSwagger UIの設定
app.doc31("/doc", {
  openapi: "3.1.0",
  servers: \[
    {
      url: "https://api.hono-learning.example",
      description: "Production server",
    },
    {
      url: "https://staging-api.hono-learning.example",
      description: "Staging server",
    },
  \],
  info: {
    title: "MyApp API",
    version: "1.0.0",
    description: "ユーザー管理API",
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },
});

app.get("/swagger", swaggerUI({ url: "/doc" }));

// ユーザーAPI - ルート定義
const getUsersRoute = createRoute({
  method: "get",
  path: "/api/users",
  operationId: generateOperationId("get", "/api/users"),
  summary: "全ユーザーを取得",
  description: "システムに登録されているすべてのユーザーを取得します",
  security: \[\], // 認証不要を明示
  responses: {
    200: {
      content: {
        "application/json": {
          schema: ApiResponseSchema(z.array(UserDataSchema)),
        },
      },
      description: "ユーザー一覧",
    },
    400: {
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
      description: "不正なリクエスト",
    },
    500: {
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
      description: "サーバーエラー",
    },
  },
});

const getUserByIdRoute = createRoute({
  method: "get",
  path: "/api/users/{id}",
  operationId: generateOperationId("get", "/api/users/{id}"),
  summary: "特定のユーザーを取得",
  description: "指定されたIDのユーザー情報を取得します",
  security: \[\], // 認証不要を明示
  request: {
    params: z.object({
      id: z.string().openapi({
        param: {
          name: "id",
          in: "path",
        },
        example: "abc12345",
        description: "ユーザーID",
      }),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: ApiResponseSchema(UserDataSchema),
        },
      },
      description: "ユーザー情報",
    },
    404: {
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
      description: "ユーザーが見つからない",
    },
    500: {
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
      description: "サーバーエラー",
    },
  },
});

const createUserRoute = createRoute({
  method: "post",
  path: "/api/users",
  operationId: generateOperationId("post", "/api/users"),
  summary: "新規ユーザーを作成",
  description: "新しいユーザーをシステムに登録します",
  security: \[\], // 認証不要を明示
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateUserRequestSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: ApiResponseSchema(UserDataSchema),
        },
      },
      description: "作成されたユーザー",
    },
    400: {
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
      description: "不正なリクエスト",
    },
    409: {
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
      description: "既に存在するユーザー",
    },
    500: {
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
      description: "サーバーエラー",
    },
  },
});

// ユーザーAPI - ハンドラー実装
app.openapi(getUsersRoute, async (c) =&gt; {
  try {
    sharedLogger.info("All users requested");
    const userService = getUserService();
    const users = await userService.findAll();

    // Prismaの日時をフォーマット済み文字列に変換
    const formattedUsers = users.map(
      (user: User): z.infer&lt;typeof UserDataSchema&gt; =&gt; ({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: formatDateTime(user.createdAt),
      }),
    );

    return c.json(
      {
        data: formattedUsers,
        status: "success" as const,
      },
      200,
    );
  } catch (error) {
    sharedLogger.error("Error fetching users:", error as Error);
    const dbError: DatabaseErrorInfo = handlePrismaError(error);

    return c.json(
      {
        data: null,
        status: "error" as const,
        message: dbError.message,
      },
      500,
    );
  }
});

app.openapi(getUserByIdRoute, async (c) =&gt; {
  const { id } = c.req.valid("param");

  try {
    const userService = getUserService();
    const user = await userService.findById(id);

    if (!user) {
      sharedLogger.warn(`User not found: ${id}`);
      return c.json(
        {
          data: null,
          status: "error" as const,
          message: "ユーザーが見つかりません",
        },
        404,
      );
    }

    sharedLogger.info(`User requested: ${id}`);
    const formattedUser: z.infer&lt;typeof UserDataSchema&gt; = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: formatDateTime(user.createdAt),
    };
    return c.json(
      {
        data: formattedUser,
        status: "success" as const,
      },
      200,
    );
  } catch (error) {
    sharedLogger.error(`Error fetching user ${id}:`, error as Error);
    const dbError: DatabaseErrorInfo = handlePrismaError(error);
    const statusCode = getStatusCodeFromErrorType(dbError.type);

    return c.json(
      {
        data: null,
        status: "error" as const,
        message: dbError.message,
      },
      statusCode === 404 ? 404 : 500,
    );
  }
});

app.openapi(createUserRoute, async (c) =&gt; {
  const body = c.req.valid("json");

  try {
    const userService = getUserService();

    // メールアドレスの重複チェック
    const existingUser = await userService.findByEmail(body.email);
    if (existingUser) {
      return c.json(
        {
          data: null,
          status: "error" as const,
          message: "このメールアドレスは既に登録されています",
        },
        409,
      );
    }

    // ユーザー作成
    const newUser = await userService.create({
      name: body.name,
      email: body.email,
    });

    sharedLogger.info(`New user created: ${newUser.id} (${newUser.name})`);

    const formattedUser: z.infer&lt;typeof UserDataSchema&gt; = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      createdAt: formatDateTime(newUser.createdAt),
    };
    return c.json(
      {
        data: formattedUser,
        status: "success" as const,
        message: "ユーザーが正常に作成されました",
      },
      201,
    );
  } catch (error) {
    sharedLogger.error("Error creating user:", error as Error);
    const dbError: DatabaseErrorInfo = handlePrismaError(error);
    const statusCode = getStatusCodeFromErrorType(dbError.type);

    // createUserでは404は起きないので、400、409、500のいずれかを返す
    const responseStatus =
      statusCode === 409 ? 409 : statusCode === 400 ? 400 : 500;

    return c.json(
      {
        data: null,
        status: "error" as const,
        message: dbError.message,
      },
      responseStatus,
    );
  }
});

export default app;

---

## 🤖 アシスタント
*2025/6/5 17:25:49*

### いまのパイプラインを図にすると

```
┌────────┐   ①Hono + zod-openapi           ┌─────────────┐   ②openapi-ts plugins
│  API   │ ───────────────────────────▶ │  openapi.yaml │ ─────────────────▶ typed client
└────────┘                                └─────────────┘
```

これに **zod-prisma-types** を加えるなら、**①の「Zod スキーマを書く工程」を Prisma schema から自動生成に置き換える** 形になります。

```
┌──────────────┐  prisma generate   ┌────────┐                 ┌─────────────┐
│ Prisma schema│ ─────────────────▶ │ Zod    │ (import)        │ openapi.yaml│
└──────────────┘   (zod-prisma-types)│schemas │──┐Hono routes──▶│ (同じ)      │
                                      └────────┘  └───────▶ (以降は今まで通り)
```

---

## 具体的な組み込みポイント

| 置き換えるもの | いま手書きしている例 | 生成物を使うと… |
|---------------|--------------------|----------------|
| **出力 DTO**  | `UserDataSchema`   | `UserModelSchema`（※1） |
| **入力 DTO**  | `CreateUserRequestSchema` | `UserCreateInputSchema`（※2） |
| **検索 / ページング** | 自作 or Prisma 型 | `UserFindManyArgsSchema`, `UserWhereInputSchema` など |

> ※1/※2 どのスキーマが出るかは Prisma モデル名と generator オプション次第です。  
> `generator zod { … }` で `createInputTypes = true` 等を有効にしてください。

### 使い方サンプル

```ts
// 生成物を import
import {
  UserModelSchema,          // モデル全体
  UserCreateInputSchema,    // create 用 input
} from "@myapp/prisma-zod";

import { z } from "@hono/zod-openapi";

// OpenAPI 用メタデータだけ後付け
const UserDataSchema = UserModelSchema.openapi("User");
const CreateUserRequestSchema = UserCreateInputSchema.openapi("CreateUserRequest");
```

あとは既存の `createRoute` 定義にそのまま差し替えれば  
**Prisma → Zod → OpenAPI → Client** が 100 % 一致します。

---

## 導入時に気を付けること

| 課題 | 対応策 |
|------|--------|
| **openapi メタデータが無い** | 上記のように `schema.openapi("Name")` を後付け。<br>Issue #287 で「hono 対応オプションが欲しい」要望あり citeturn1view0 |
| **生成量が多い・重い** | `omitInputTypes`, `useMultipleFiles` など generator オプションで絞る。 |
| **Prisma スキーマが SoT になる** | 既存の “API 定義が真実” という設計と衝突しないか要検討。<br>API 専用フィールド（例: `password` を隠す等）は `.omit()` や `.pick()` で派生スキーマを作る。 |
| **未対応型 / バグ** | 個人メンテなのでフォーク前提が安心。スター数・Issue 数は活発 citeturn0search0 |

---

## 結論

1. **Prisma モデルをソース・オブ・トゥルースに据えたい → 採用◎**  
   *Zod 手書きが消え、型ずれバグも減少。*

2. **今後も Hono ルート定義を中心に回す → 部分採用**  
   *サービス層の入力検証だけ zod-prisma-types を使い、OpenAPI 用スキーマは手書き継続* でも OK。

3. **すでに OpenAPI → Prisma の流れが固い → 不要**  
   *重複よりフロー簡素さを優先して現状維持。*

導入するなら **「生成スキーマに `.openapi()` を後付けするユーティリティ」を1つ作る** と、既存コードの差し替えが最小で済みます。

---
