# Hono Remix Vite API

日付: 2025-02-20

---

## 👤 ユーザー
*2025/2/20 19:27:45*

hono rimix vite でサーバーサイドのAPI開発とそのデータを管理するプロジェクトを考えたい

---

## 🤖 アシスタント
*2025/2/20 19:28:38*

Hono (Remix + Vite) を使ってサーバーサイド API を開発し、そのデータを管理するプロジェクトを考えます。

## プロジェクト概要
**プロジェクト名:** `TaskFlow`  
**概要:**  
タスク管理アプリのバックエンドを **Hono** で構築し、フロントエンドには **Remix + Vite** を使用。データの管理には **SQLite** または **PostgreSQL** を採用し、ORM には **Drizzle ORM** を使用。  

## 技術スタック
| **用途**         | **技術**                |
|----------------|----------------------|
| フレームワーク | Hono (サーバー)       |
| フロントエンド | Remix + Vite         |
| データベース   | SQLite / PostgreSQL  |
| ORM           | Drizzle ORM          |
| 認証          | Clerk / Auth.js       |
| デプロイ      | Fly.io / Vercel       |
| CI/CD        | GitHub Actions       |

---

## プロジェクト構成

```
taskflow/
│── apps/
│   │── api/          # Hono のサーバーサイド
│   │── web/          # Remix + Vite のフロントエンド
│── packages/
│   │── db/           # Drizzle ORM スキーマ定義
│── .github/          # GitHub Actions の設定
│── docker-compose.yml
│── README.md
```

### Hono サーバー (apps/api)
#### インストール
```sh
mkdir apps/api && cd apps/api
npm init -y
npm install hono drizzle-orm better-sqlite3 dotenv
```

#### API 実装 (`apps/api/index.ts`)
```ts
import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import { tasks } from '../../packages/db/schema'

const db = drizzle(new Database('data.db'))
const app = new Hono()

app.get('/tasks', async (c) => {
  const result = await db.select().from(tasks)
  return c.json(result)
})

app.post('/tasks', async (c) => {
  const body = await c.req.json()
  await db.insert(tasks).values({ title: body.title })
  return c.text('Task added!')
})

export default app
```

---

### データベーススキーマ (`packages/db/schema.ts`)
```ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const tasks = sqliteTable('tasks', {
  id: integer('id').primaryKey().autoincrement(),
  title: text('title').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow(),
})
```

---

### フロントエンド (apps/web)
#### インストール
```sh
mkdir apps/web && cd apps/web
npx create-remix@latest .
npm install @hono/remix-router
```

#### API 呼び出し (apps/web/routes/tasks.tsx)
```tsx
import { json, useLoaderData } from "@remix-run/react";

export async function loader() {
  const res = await fetch("http://localhost:3000/tasks");
  return json(await res.json());
}

export default function Tasks() {
  const tasks = useLoaderData();
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>{task.title}</li>
      ))}
    </ul>
  );
}
```

---

### デプロイ
#### **Fly.io (Hono API)**
```sh
fly launch --name taskflow-api
fly deploy
```

#### **Vercel (Remix + Vite)**
```sh
vercel
```

---

## まとめ
- Hono を使って軽量 API サーバーを構築
- Drizzle ORM でデータ管理
- Remix + Vite をフロントエンドとして活用
- GitHub Actions で CI/CD
- Fly.io / Vercel にデプロイ

この構成なら、サーバーサイドとフロントエンドの開発をスムーズに進められます！

---
