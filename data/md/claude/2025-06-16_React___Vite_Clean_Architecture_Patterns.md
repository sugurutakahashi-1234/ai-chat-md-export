# React + Vite Clean Architecture Patterns

日付: 2025-06-16

---

## 👤 ユーザー
*2025/06/16 18:00:27*

react+viteでシンプルな実装をしている。
APIを呼び出すような画面で、画面にあまりビジネスロジックを混ぜたくない、 
どういった実装をするのが良いか、またシンプルなアーキテクチャパターンなどがあれば教えてほしい。 
ネクストJSはあまり使いたくない。 
あとリアクトルーターは使っている。

---

## 🤖 アシスタント
*2025/06/16 18:00:51*

APIを呼び出す画面でビジネスロジックを分離するためのシンプルで効果的なアーキテクチャパターンについて、いくつかの推奨アプローチを紹介します。

&lt;artifact type="text/markdown"&gt;
# React + Viteでのクリーンなアーキテクチャパターン

## 推奨アーキテクチャ構成

```
src/
│
├── components/           # 再利用可能なUI コンポーネント
│   └── UIComponents/
│
├── features/             # 機能単位のディレクトリ
│   └── users/
│       ├── components/   # 機能固有のコンポーネント
│       ├── hooks/        # カスタムフック
│       └── services/     # APIコール、データ変換ロジック
│
├── services/             # 共通のサービスレイヤー
│   └── api/
│       ├── client.ts     # Axiosなどのhttp clientの設定
│       └── endpoints.ts  # APIエンドポイントの定義
│
├── hooks/                # 共通のカスタムフック
│   └── useDataFetching.ts
│
└── utils/                # ユーティリティ関数
    └── dataTransformers.ts
```

## サービスレイヤーの実装例

### `services/api/client.ts`
```typescript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 共通のリクエスト/レスポンスインターセプター
apiClient.interceptors.request.use(
  (config) => {
    // 認証トークンの追加など
    return config;
  },
  (error) => Promise.reject(error)
);
```

### `services/api/endpoints.ts`
```typescript
import { apiClient } from './client';

export const userService = {
  getUsers: () => apiClient.get('/users'),
  getUserById: (id: string) => apiClient.get(`/users/${id}`),
  createUser: (userData) => apiClient.post('/users', userData),
};
```

### カスタムフックの実装例 `hooks/useDataFetching.ts`
```typescript
import { useState, useEffect } from 'react';

export const useDataFetching = <T>(
  fetchFunction: () => Promise<{ data: T }>, 
  initialData: T | null = null
) => {
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchFunction();
        setData(response.data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchFunction]);

  return { data, loading, error };
};
```

### コンポーネントでの使用例
```typescript
import React from 'react';
import { userService } from '../services/api/endpoints';
import { useDataFetching } from '../hooks/useDataFetching';

const UserList: React.FC = () => {
  const { 
    data: users, 
    loading, 
    error 
  } = useDataFetching(() => userService.getUsers());

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {users?.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
};

export default UserList;
```

## メリット
- ビジネスロジックの分離
- 再利用可能なコンポーネントとフック
- APIコールの一元管理
- テスタビリティの向上
- 保守性の高いコード構造

## 追加のベストプラクティス
1. TypeScriptの活用
2. 環境変数の適切な管理
3. エラーハンドリングの統一
4. キャッシュ戦略の検討
5. 型安全性の確保
```

このアプローチのポイントは以下の通りです：

1. **サービスレイヤーの分離**: APIコールを専用のサービスに集中させる
2. **カスタムフックの活用**: データフェッチングのロジックを抽象化
3. **コンポーネントの責務を最小限に**: UIのレンダリングに集中
4. **型安全性**: TypeScriptによる型定義

特に`useDataFetching`のようなカスタムフックは、複数のコンポーネントで再利用可能で、ローディング状態やエラー処理を共通化できます。

追加で推奨するライブラリ：
- データ取得: React Query / SWR
- 状態管理: Zustand (Reduxより軽量)
- HTTP Client: Axios / Ky

このアプローチにより、コンポーネントはデータの取得や変換といった副次的な処理から解放され、純粋にUIのレンダリングに集中できます。

---
