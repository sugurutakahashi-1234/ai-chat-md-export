# Next.js サーバーアクション vs SSR

日付: 2025-06-25

---

## 👤 ユーザー
*2025/06/25 18:35:26*

nextjs のサーバーアクションとサーバーサイドレンダリングの違いがよくわかってない
実装例を交えて教えてほしい

---

## 🤖 アシスタント
*2025/06/25 18:35:52*

Next.jsのサーバーアクションとサーバーサイドレンダリング（SSR）の違いについて、実装例を交えて説明します。

## サーバーサイドレンダリング（SSR）

SSRは、ページの初回読み込み時にサーバー側でHTMLを生成する仕組みです。ユーザーがページにアクセスすると、サーバーでReactコンポーネントをHTMLに変換してからブラウザに送信します。

### SSRの実装例

```javascript
// app/products/page.js
async function getProducts() {
  const res = await fetch('https://api.example.com/products', {
    cache: 'no-store' // 常に最新データを取得
  });
  return res.json();
}

export default async function ProductsPage() {
  const products = await getProducts();
  
  return (
    <div>
      <h1>商品一覧</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - ¥{product.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

この例では、ページにアクセスするたびにサーバー側でAPIを呼び出し、商品データを取得してHTMLを生成します。

## サーバーアクション

サーバーアクションは、クライアント側からサーバー側の関数を直接呼び出せる機能です。フォーム送信やボタンクリックなどのユーザーアクションに応じて、サーバー側で処理を実行できます。

### サーバーアクションの実装例

```javascript
// app/products/actions.js
'use server';

import { revalidatePath } from 'next/cache';

export async function createProduct(formData) {
  const name = formData.get('name');
  const price = formData.get('price');
  
  // データベースに商品を追加
  await fetch('https://api.example.com/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, price })
  });
  
  // ページを再検証して最新データを表示
  revalidatePath('/products');
}

export async function deleteProduct(productId) {
  await fetch(`https://api.example.com/products/${productId}`, {
    method: 'DELETE'
  });
  
  revalidatePath('/products');
}
```

```javascript
// app/products/page.js
import { createProduct, deleteProduct } from './actions';

export default async function ProductsPage() {
  const products = await getProducts();
  
  return (
    <div>
      <h1>商品管理</h1>
      
      {/* フォームでサーバーアクションを使用 */}
      <form action={createProduct}>
        <input name="name" placeholder="商品名" required />
        <input name="price" type="number" placeholder="価格" required />
        <button type="submit">商品を追加</button>
      </form>
      
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - ¥{product.price}
            {/* ボタンでサーバーアクションを使用 */}
            <form action={deleteProduct.bind(null, product.id)}>
              <button type="submit">削除</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## 主な違い

**実行タイミング**
- SSR: ページの初回読み込み時に実行
- サーバーアクション: ユーザーのアクション（フォーム送信、ボタンクリックなど）時に実行

**用途**
- SSR: ページの初期表示データを準備
- サーバーアクション: データの作成・更新・削除などの操作

**実装方法**
- SSR: コンポーネント内で直接async/awaitを使用
- サーバーアクション: 'use server'ディレクティブを使い、専用の関数として定義

**レスポンス**
- SSR: HTMLページ全体を返す
- サーバーアクション: 処理結果を返し、必要に応じてページを再検証

両者を組み合わせることで、初期表示は高速に行い（SSR）、その後のユーザー操作はページ遷移なしでサーバー側で処理（サーバーアクション）という、優れたユーザー体験を実現できます。

---

## 👤 ユーザー
*2025/06/25 19:04:05*

テキストJSON 使わずにサーバーサイドレンダリングするって結構大変なのか な。最新のビート リアリティを使ってるん

---

## 🤖 アシスタント
*2025/06/25 19:04:33*

Next.jsではJSONを使わずにサーバーサイドレンダリングすることも可能ですが、確かにいくつか考慮点があります。最新のNext.js（App Router）でのパターンをいくつか紹介します。

## 1. データベース直接接続パターン

```javascript
// app/posts/page.js
import { sql } from '@vercel/postgres';

export default async function PostsPage() {
  // データベースから直接データを取得
  const { rows } = await sql`SELECT * FROM posts ORDER BY created_at DESC`;
  
  return (
    <div>
      <h1>ブログ記事</h1>
      {rows.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </article>
      ))}
    </div>
  );
}
```

## 2. ORMを使用したパターン（Prisma）

```javascript
// lib/prisma.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export default prisma;
```

```javascript
// app/users/page.js
import prisma from '@/lib/prisma';

export default async function UsersPage() {
  // Prismaで直接データベースからデータを取得
  const users = await prisma.user.findMany({
    include: {
      posts: true
    }
  });
  
  return (
    <div>
      <h1>ユーザー一覧</h1>
      {users.map((user) => (
        <div key={user.id}>
          <h2>{user.name}</h2>
          <p>投稿数: {user.posts.length}</p>
        </div>
      ))}
    </div>
  );
}
```

## 3. GraphQLを使用したパターン

```javascript
// app/products/page.js
import { gql } from '@apollo/client';
import { getClient } from '@/lib/apollo-client';

const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      price
      category {
        name
      }
    }
  }
`;

export default async function ProductsPage() {
  const client = getClient();
  const { data } = await client.query({ query: GET_PRODUCTS });
  
  return (
    <div>
      <h1>商品カタログ</h1>
      {data.products.map((product) => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>価格: ¥{product.price}</p>
          <p>カテゴリ: {product.category.name}</p>
        </div>
      ))}
    </div>
  );
}
```

## メリット・デメリット

**JSONを使わない場合のメリット:**
- APIエンドポイントを作る必要がない
- データ取得が1ステップで済む
- 型安全性が保ちやすい（TypeScript使用時）
- レスポンスが速い（APIサーバーを経由しない）

**デメリット:**
- クライアント側からのデータ取得には別途APIが必要
- データベース接続情報をサーバー側で管理する必要がある
- 外部サービスとの連携が複雑になる場合がある

## 最新のベストプラクティス

Next.js 14以降では、以下のようなアプローチが推奨されています：

```javascript
// app/dashboard/page.js
import { Suspense } from 'react';

// データ取得を分割してストリーミング
async function UserInfo() {
  const user = await prisma.user.findUnique({ where: { id: 1 } });
  return <div>ようこそ、{user.name}さん</div>;
}

async function RecentPosts() {
  const posts = await prisma.post.findMany({ take: 5 });
  return (
    <ul>
      {posts.map(post => <li key={post.id}>{post.title}</li>)}
    </ul>
  );
}

export default function DashboardPage() {
  return (
    <div>
      <h1>ダッシュボード</h1>
      
      <Suspense fallback={<div>ユーザー情報を読み込み中...</div>}>
        <UserInfo />
      </Suspense>
      
      <Suspense fallback={<div>最近の投稿を読み込み中...</div>}>
        <RecentPosts />
      </Suspense>
    </div>
  );
}
```

このように、Next.jsの最新版では：
- React Server Componentsを活用
- Suspenseでストリーミングレンダリング
- 必要に応じて部分的にデータを取得
- エラーバウンダリーで適切にエラーハンドリング

という形で、JSONを介さずに効率的なSSRが実現できるようになっています。

---
