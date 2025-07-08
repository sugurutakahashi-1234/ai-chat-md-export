# Merging CORS Security Best Practices

日付: 2025-05-27

---

## 👤 ユーザー
*2025/5/27 19:34:33*

```
# CORS設定ベストプラクティス 2025年5月版

## 📋 エグゼクティブサマリー

### 重要な原則
1. **明示的な許可リスト**: ワイルドカード（`*`）は本番環境で絶対に使用しない
2. **環境別設定**: 開発・ステージング・本番で異なるCORS設定を使用
3. **最小権限の原則**: 必要最小限のオリジン・メソッド・ヘッダーのみ許可
4. **認証情報の保護**: `credentials: true`とワイルドカードの組み合わせは厳禁

### 推奨実装パターン

```typescript
// ✅ 推奨: 環境別の安全な設定
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://app.example.com'] // 本番は明示的なドメインのみ
    : ['http://localhost:5173'],   // 開発はlocalhostのみ
  credentials: true,
  maxAge: 600, // Safariの上限（10分）
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['X-Request-ID', 'X-Total-Count']
}
```

## 🚨 セキュリティリスクと対策

### 主要な脅威（2025年）
1. **CORS設定ミス**: API侵害の90%がCORS設定ミスに起因
2. **認証情報の漏洩**: ワイルドカード使用による機密データ露出
3. **CSRF攻撃**: 不適切な設定によるクロスサイトリクエストフォージェリ

### 絶対に避けるべきアンチパターン

```typescript
// ❌ 危険: 本番環境でのワイルドカード
app.use(cors({ origin: '*' }))

// ❌ 致命的: 認証情報付きワイルドカード
app.use(cors({ 
  origin: '*', 
  credentials: true // 絶対にNG
}))

// ❌ 危険: 全メソッド無条件許可
app.use(cors({
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']
}))
```

## 🏗️ Hono実装ガイド

### 基本実装

```typescript
import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

// 環境変数から設定を読み込み
const getAllowedOrigins = () => {
  const origins = process.env.CORS_ORIGINS?.split(',') || []
  return process.env.NODE_ENV === 'production'
    ? origins
    : ['http://localhost:5173', ...origins]
}

// グローバルCORS設定
app.use('*', cors({
  origin: getAllowedOrigins(),
  credentials: true,
  maxAge: 600,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['X-Request-ID', 'X-Total-Count']
}))
```

### 動的オリジン検証（サブドメイン対応）

```typescript
app.use('*', cors({
  origin: (origin) => {
    if (!origin) return null // 同一オリジンを許可
    
    // 本番環境でのドメイン検証
    if (process.env.NODE_ENV === 'production') {
      const allowedPattern = /^https:\/\/([\w-]+\.)?example\.com$/
      return allowedPattern.test(origin) ? origin : false
    }
    
    // 開発環境
    return origin.startsWith('http://localhost:') ? origin : false
  },
  credentials: true
}))
```

## ⚡ パフォーマンス最適化

### プリフライトリクエストの削減

```typescript
// ✅ シンプルリクエストの条件を満たす設定
const optimizedCors = cors({
  origin: 'https://app.example.com',
  allowMethods: ['GET', 'POST'], // PUTやDELETEはプリフライト必須
  allowHeaders: ['Content-Type'], // カスタムヘッダーを避ける
  maxAge: 7200 // Chrome/Edgeの上限（2時間）
})
```

### ブラウザ別のmaxAge上限
- Firefox: 86400秒（24時間）
- Chrome/Edge: 7200秒（2時間）
- Safari: 600秒（10分）👈 **最も厳しい制限**

## 🧪 テスト戦略

### ユニットテスト例（Vitest）

```typescript
describe('CORS設定', () => {
  it('許可されたオリジンからのリクエストを受け入れる', async () => {
    const res = await app.request('/api/test', {
      headers: { Origin: 'https://app.example.com' }
    })
    
    expect(res.headers.get('Access-Control-Allow-Origin'))
      .toBe('https://app.example.com')
  })
  
  it('不正なオリジンからのリクエストを拒否する', async () => {
    const res = await app.request('/api/test', {
      headers: { Origin: 'https://evil.com' }
    })
    
    expect(res.headers.get('Access-Control-Allow-Origin'))
      .toBeNull()
  })
})
```

### セキュリティ監査チェックリスト
- [ ] 本番環境でワイルドカードを使用していない
- [ ] 認証情報付きでワイルドカードを使用していない
- [ ] 必要最小限のメソッドのみ許可している
- [ ] 環境別の設定が正しく機能している
- [ ] エラーハンドリングが適切に実装されている

## 📝 実装チェックリスト

### Phase 1: 基本セキュリティ（必須）
- [ ] ワイルドカードの削除
- [ ] 明示的なオリジンリストの設定
- [ ] 環境変数による設定管理

### Phase 2: 高度な設定（推奨）
- [ ] 動的オリジン検証の実装
- [ ] プリフライト最適化
- [ ] エラーハンドリングの実装

### Phase 3: 監視とテスト（ベストプラクティス）
- [ ] CORSエラーのロギング
- [ ] E2Eテストの実装
- [ ] セキュリティ監査の定期実行

## 🔗 参考資料
- [MDN: Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [OWASP: CORS Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Origin_Resource_Sharing_Cheat_Sheet.html)
- [Hono CORS Middleware Documentation](https://hono.dev/middleware/builtin/cors)

---
*最終更新: 2025年5月27日*
```


2つ目は添付された

```

```

---

## 👤 ユーザー
*2025/5/27 19:33:31*

この2つの内容をマージしてほしい。内容が競合していたら、私に確認させてほしい

# CORS設定ベストプラクティス 2025年5月版

## 📋 エグゼクティブサマリー

### 重要な原則
1. **明示的な許可リスト**: ワイルドカード（`*`）は本番環境で絶対に使用しない
2. **環境別設定**: 開発・ステージング・本番で異なるCORS設定を使用
3. **最小権限の原則**: 必要最小限のオリジン・メソッド・ヘッダーのみ許可
4. **認証情報の保護**: `credentials: true`とワイルドカードの組み合わせは厳禁

### 推奨実装パターン

```typescript
// ✅ 推奨: 環境別の安全な設定
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://app.example.com'] // 本番は明示的なドメインのみ
    : ['http://localhost:5173'],   // 開発はlocalhostのみ
  credentials: true,
  maxAge: 600, // Safariの上限（10分）
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['X-Request-ID', 'X-Total-Count']
}
```

## 🚨 セキュリティリスクと対策

### 主要な脅威（2025年）
1. **CORS設定ミス**: API侵害の90%がCORS設定ミスに起因
2. **認証情報の漏洩**: ワイルドカード使用による機密データ露出
3. **CSRF攻撃**: 不適切な設定によるクロスサイトリクエストフォージェリ

### 絶対に避けるべきアンチパターン

```typescript
// ❌ 危険: 本番環境でのワイルドカード
app.use(cors({ origin: '*' }))

// ❌ 致命的: 認証情報付きワイルドカード
app.use(cors({ 
  origin: '*', 
  credentials: true // 絶対にNG
}))

// ❌ 危険: 全メソッド無条件許可
app.use(cors({
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']
}))
```

## 🏗️ Hono実装ガイド

### 基本実装

```typescript
import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

// 環境変数から設定を読み込み
const getAllowedOrigins = () => {
  const origins = process.env.CORS_ORIGINS?.split(',') || []
  return process.env.NODE_ENV === 'production'
    ? origins
    : ['http://localhost:5173', ...origins]
}

// グローバルCORS設定
app.use('*', cors({
  origin: getAllowedOrigins(),
  credentials: true,
  maxAge: 600,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['X-Request-ID', 'X-Total-Count']
}))
```

### 動的オリジン検証（サブドメイン対応）

```typescript
app.use('*', cors({
  origin: (origin) => {
    if (!origin) return null // 同一オリジンを許可
    
    // 本番環境でのドメイン検証
    if (process.env.NODE_ENV === 'production') {
      const allowedPattern = /^https:\/\/([\w-]+\.)?example\.com$/
      return allowedPattern.test(origin) ? origin : false
    }
    
    // 開発環境
    return origin.startsWith('http://localhost:') ? origin : false
  },
  credentials: true
}))
```

## ⚡ パフォーマンス最適化

### プリフライトリクエストの削減

```typescript
// ✅ シンプルリクエストの条件を満たす設定
const optimizedCors = cors({
  origin: 'https://app.example.com',
  allowMethods: ['GET', 'POST'], // PUTやDELETEはプリフライト必須
  allowHeaders: ['Content-Type'], // カスタムヘッダーを避ける
  maxAge: 7200 // Chrome/Edgeの上限（2時間）
})
```

### ブラウザ別のmaxAge上限
- Firefox: 86400秒（24時間）
- Chrome/Edge: 7200秒（2時間）
- Safari: 600秒（10分）👈 **最も厳しい制限**

## 🧪 テスト戦略

### ユニットテスト例（Vitest）

```typescript
describe('CORS設定', () => {
  it('許可されたオリジンからのリクエストを受け入れる', async () => {
    const res = await app.request('/api/test', {
      headers: { Origin: 'https://app.example.com' }
    })
    
    expect(res.headers.get('Access-Control-Allow-Origin'))
      .toBe('https://app.example.com')
  })
  
  it('不正なオリジンからのリクエストを拒否する', async () => {
    const res = await app.request('/api/test', {
      headers: { Origin: 'https://evil.com' }
    })
    
    expect(res.headers.get('Access-Control-Allow-Origin'))
      .toBeNull()
  })
})
```

### セキュリティ監査チェックリスト
- [ ] 本番環境でワイルドカードを使用していない
- [ ] 認証情報付きでワイルドカードを使用していない
- [ ] 必要最小限のメソッドのみ許可している
- [ ] 環境別の設定が正しく機能している
- [ ] エラーハンドリングが適切に実装されている

## 📝 実装チェックリスト

### Phase 1: 基本セキュリティ（必須）
- [ ] ワイルドカードの削除
- [ ] 明示的なオリジンリストの設定
- [ ] 環境変数による設定管理

### Phase 2: 高度な設定（推奨）
- [ ] 動的オリジン検証の実装
- [ ] プリフライト最適化
- [ ] エラーハンドリングの実装

### Phase 3: 監視とテスト（ベストプラクティス）
- [ ] CORSエラーのロギング
- [ ] E2Eテストの実装
- [ ] セキュリティ監査の定期実行

## 🔗 参考資料
- [MDN: Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [OWASP: CORS Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Origin_Resource_Sharing_Cheat_Sheet.html)
- [Hono CORS Middleware Documentation](https://hono.dev/middleware/builtin/cors)

---
*最終更新: 2025年5月27日*

---

## 🤖 アシスタント
*2025/5/27 19:33:41*

2つの内容を確認しましたが、実際には1つのドキュメントのみが提供されています。提供されたドキュメントは「CORS（Cross-Origin Resource Sharing）セキュリティベストプラクティス（調査日: 2025/05/27）」です。

マージするために、以下の点を確認させてください：

1. **2つ目のドキュメントはどこにありますか？** 
   - 別のファイルとして提供していただくか
   - テキストとして直接貼り付けていただけますでしょうか

2. **マージの方針について：**
   - どのような形式で統合したいですか？（例：セクション別、重要度別など）
   - 内容が重複している場合の優先順位はありますか？

現在提供されているドキュメントには以下の内容が含まれています：
- 基本原則とセキュリティベストプラクティス
- Hono.jsでの実装例
- ブラウザ別の制限事項
- 2025年のセキュリティトレンド
- チェックリストとトラブルシューティング

2つ目のドキュメントを提供していただければ、内容の競合部分を特定し、適切な統合案を提示いたします。

---

## 🤖 アシスタント
*2025/5/27 19:34:46*

2つのドキュメントを確認しました。実は、両方とも**全く同じ内容**でした！競合する部分はありません。

現在提供いただいた内容と、私が先ほど作成した統合版を比較すると、以下の違いがあります：

## 📊 内容の差分

### 現在のドキュメントにある内容
- 基本原則とHono.js実装例
- 2025年のセキュリティトレンド（Zero Trust CORS、CSP連携）
- 環境変数設定例
- テスト方法（curl、ブラウザ）
- トラブルシューティング

### 私の統合版で追加した内容
- エグゼクティブサマリー
- セキュリティリスク分析
- ユニットテスト例（Vitest）
- 段階的実装チェックリスト
- より構造化されたドキュメント形式

## 🤔 統合方針の確認

どちらの方向性をお望みでしょうか？

### オプション A: 元のドキュメントベース
- 現在のシンプルで実用的な構成を維持
- 技術的な詳細に重点を置いた内容

### オプション B: 私の統合版ベース
- より包括的で企業向けの構成
- セキュリティリスクやテスト戦略を含む

### オプション C: ハイブリッド版
- 元のドキュメントの実用性を保ちつつ
- 必要最小限の追加情報を統合

どの方向性がお好みか教えていただけますでしょうか？また、特に重視したい要素（実用性、包括性、簡潔性など）があれば、それも併せてお聞かせください。

---

## 👤 ユーザー
*2025/5/27 19:35:14*

オプション C: ハイブリッド版
* 元のドキュメントの実用性を保ちつつ
* 必要最小限の追加情報を統合

---

## 🤖 アシスタント
*2025/5/27 19:35:49*

# CORS（Cross-Origin Resource Sharing）セキュリティベストプラクティス（2025年5月27日版）

## 基本原則
1. **明示的な許可リスト**: 本番環境でワイルドカード（`*`）は絶対に使用しない
2. **環境別設定**: 開発・本番で異なる設定を使用
3. **最小権限**: 必要最小限のオリジン・メソッド・ヘッダーのみ許可
4. **認証情報の保護**: `credentials: true`とワイルドカードの組み合わせは厳禁

## 推奨実装（Hono.js）
```typescript
// packages/server/src/app.ts
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? (process.env.CORS_ORIGINS?.split(',') || ['https://app.example.com'])
    : ['http://localhost:5173'],
  credentials: true,
  maxAge: 600, // Safariの上限
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['X-Request-ID', 'X-Total-Count']
}

app.use('*', cors(corsOptions))
```

## ブラウザ別maxAge上限
- Safari: 600秒（10分）⚠️ 最も厳しい
- Chrome/Edge: 7200秒（2時間）
- Firefox: 86400秒（24時間）

## 2025年のセキュリティトレンド

### 1. Zero Trust CORS設定
```typescript
// 動的オリジン検証
const corsOptions = {
  origin: (origin: string | undefined) => {
    // 同一オリジンリクエスト（originがundefined）を許可
    if (!origin) return null;
    
    // ホワイトリストベースの検証
    const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || [];
    if (allowedOrigins.includes(origin)) {
      return origin;
    }
    
    // サブドメインのパターンマッチング
    const allowedPattern = /^https:\/\/[\w-]+\.example\.com$/;
    if (allowedPattern.test(origin)) {
      return origin;
    }
    
    throw new Error('Not allowed by CORS');
  }
}
```

### 2. CORS + CSP（Content Security Policy）の組み合わせ
```typescript
// CORSとCSPを併用してセキュリティを強化
app.use('*', cors(corsOptions));
app.use('*', async (c, next) => {
  await next();
  c.header('Content-Security-Policy', 
    "default-src 'self'; " +
    "connect-src 'self' https://api.example.com; " +
    "frame-ancestors 'none';"
  );
});
```

### 3. 環境変数による柔軟な設定
```typescript
// .env.production
CORS_ORIGINS=https://app.example.com,https://mobile.example.com
CORS_MAX_AGE=600
CORS_ALLOW_CREDENTIALS=true

// .env.development
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
CORS_MAX_AGE=3600
CORS_ALLOW_CREDENTIALS=true
```

## よくある間違いと対策

### 1. 開発環境の設定を本番に持ち込む
```typescript
// ❌ 悪い例
app.use('*', cors({
  origin: '*',
  credentials: true // エラーになる組み合わせ
}));

// ✅ 良い例
app.use('*', cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://app.example.com']
    : ['http://localhost:5173'],
  credentials: true
}));
```

### 2. プリフライトリクエストの最適化不足
```typescript
// ✅ プリフライトリクエストを減らす設定
const corsOptions = {
  origin: allowedOrigins,
  maxAge: 600, // プリフライトキャッシュ時間
  // シンプルなリクエストで済むように設定
  allowHeaders: ['Content-Type'], // 最小限に
  allowMethods: ['GET', 'POST'] // 必要なものだけ
}
```

### 3. エラーハンドリングの欠如
```typescript
// ✅ エラーハンドリング付きCORS
app.use('*', async (c, next) => {
  try {
    const corsMiddleware = cors(corsOptions);
    return await corsMiddleware(c, next);
  } catch (error) {
    console.error('CORS error:', error);
    return c.json({ error: 'CORS policy violation' }, 403);
  }
});
```

## セキュリティチェックリスト

### ✅ 必須項目（Phase 1）
- [ ] 本番環境でワイルドカード（`*`）を使用していない
- [ ] `credentials: true`の場合、originが明示的に設定されている
- [ ] 必要最小限のHTTPメソッドのみ許可
- [ ] 機密性の高いヘッダーはexposeHeadersに含めない
- [ ] maxAgeがブラウザの制限内（Safariの600秒）

### ⚠️ 推奨項目（Phase 2）
- [ ] オリジンのホワイトリスト管理
- [ ] 環境変数による設定の外部化
- [ ] CSPとの併用
- [ ] エラーハンドリングの実装
- [ ] ログ記録とモニタリング

## テスト方法

### 1. CORSヘッダーの確認
```bash
# プリフライトリクエストのテスト
curl -X OPTIONS http://localhost:3000/api/users \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v

# 実際のリクエストのテスト
curl -X POST http://localhost:3000/api/users \
  -H "Origin: http://localhost:5173" \
  -H "Content-Type: application/json" \
  -d '{"name":"test"}' \
  -v
```

### 2. ブラウザでの確認
```javascript
// DevToolsのConsoleで実行
fetch('http://localhost:3000/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include',
  body: JSON.stringify({ name: 'test' })
})
.then(res => res.json())
.then(console.log)
.catch(console.error);
```

### 3. 自動テスト例
```typescript
// 基本的なCORSテスト
describe('CORS設定', () => {
  it('許可されたオリジンを受け入れる', async () => {
    const res = await app.request('/api/test', {
      headers: { Origin: 'https://app.example.com' }
    })
    expect(res.headers.get('Access-Control-Allow-Origin'))
      .toBe('https://app.example.com')
  })
})
```

## トラブルシューティング

### 問題1: "CORS policy: No 'Access-Control-Allow-Origin'"
- **原因**: オリジンが許可リストにない
- **対策**: CORS_ORIGINSに追加するか、origin関数で動的に許可

### 問題2: "CORS policy: credentials flag is true"
- **原因**: credentialsとワイルドカードの併用
- **対策**: 明示的なオリジンリストを設定

### 問題3: プリフライトリクエストが多すぎる
- **原因**: maxAgeが短い、または複雑なヘッダー
- **対策**: maxAgeを適切に設定、シンプルなリクエストに最適化

### 問題4: 本番環境でのCORSエラー
- **チェックポイント**: 
  - 環境変数が正しく設定されているか
  - HTTPSを使用しているか（本番環境）
  - サブドメインの設定が正しいか

## 参考リンク
- [MDN: Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [OWASP: Cross-Origin Resource Sharing](https://owasp.org/www-community/attacks/CORS_OriginHeaderScrutiny)
- [Hono CORS Middleware](https://hono.dev/docs/middleware/builtin/cors)

---
*最終更新: 2025年5月27日*

このハイブリッド版では、元のドキュメントの実用的な構成を維持しつつ、以下の最小限の追加を行いました：

**追加した要素**
- Phase 1/2のチェックリスト分類
- 自動テストの基本例
- 本番環境向けトラブルシューティング項目
- 文書構造の軽微な改善

**維持した要素**
- 元の技術的な詳細とコード例
- 実用的なトラブルシューティング
- シンプルで読みやすい構成

---
