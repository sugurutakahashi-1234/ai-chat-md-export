# TypeScript PostgreSQL ORM Alternatives

日付: 2025-06-08

---

## 👤 ユーザー
*2025/06/08 15:33:44*

TypeScriptでPrismaを使わないとなるとPostgresSQLの標準SDKを使うことになるのか？それはどれぐらい使いにくいのか？zodなどのコードを自動生成してくれたりするのか？

---

## 🤖 アシスタント
*2025/06/08 15:34:14*

TypeScriptでPrismaを使わない場合、いくつかの選択肢があります。主なものを使いやすさと機能の観点から説明します。

## 主な選択肢

### 1. node-postgres (pg)
最も基本的なPostgreSQLクライアントです。

```typescript
import { Client } from 'pg';

const client = new Client();
await client.connect();

// 生のSQLを書く必要がある
const res = await client.query('SELECT * FROM users WHERE id = $1', [userId]);
console.log(res.rows[0]);
```

**使いにくさ**：
- 生のSQLを書く必要がある
- 型安全性がない（結果は`any`型）
- SQLインジェクション対策を自分で行う必要がある
- マイグレーション機能なし

### 2. Kysely
型安全なクエリビルダーで、Prismaの代替として人気が高まっています。

```typescript
import { Kysely } from 'kysely';

const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool()
  })
});

// 型安全なクエリ
const users = await db
  .selectFrom('users')
  .where('id', '=', userId)
  .selectAll()
  .execute();
```

**特徴**：
- 完全な型安全性
- `kysely-codegen`でデータベースから型を自動生成
- Zodとの統合も可能
- SQLに近い記法で学習コストが低い

### 3. Drizzle ORM
新しい世代のORMで、Prismaの代替として注目されています。

```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
import { pgTable, serial, text } from 'drizzle-orm/pg-core';

const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});

const db = drizzle(client);
const allUsers = await db.select().from(users);
```

**特徴**：
- 型安全性
- `drizzle-kit`でマイグレーション管理
- Zodスキーマの自動生成対応
- Prismaより軽量で高速

### 4. TypeORM
従来からある成熟したORM。

```typescript
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}

const users = await userRepository.find({
  where: { id: userId }
});
```

## Zodとの統合について

**Kysely + Zod**:
```typescript
import { z } from 'zod';
import { Selectable } from 'kysely';

// データベースの型から自動生成されたものを元に
const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
});

// クエリ結果の検証
const users = await db.selectFrom('users').selectAll().execute();
const validatedUsers = z.array(UserSchema).parse(users);
```

**Drizzle + Zod**:
```typescript
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

// テーブル定義からZodスキーマを自動生成
const insertUserSchema = createInsertSchema(users);
const selectUserSchema = createSelectSchema(users);
```

## 推奨

Prismaを使わない場合の推奨順位：

1. **Drizzle ORM** - Prismaに最も近い開発体験、Zod統合も優秀
2. **Kysely** - より生のSQLに近く、完全な型安全性
3. **TypeORM** - エンタープライズ向けの機能が充実
4. **node-postgres (pg)** - 最大限の制御が必要な場合のみ

特に、Drizzle ORMやKyselyは、Prismaの利便性を保ちながら、より軽量で柔軟な選択肢として優れています。どちらもZodとの統合が可能で、型安全性を確保できます。

---
