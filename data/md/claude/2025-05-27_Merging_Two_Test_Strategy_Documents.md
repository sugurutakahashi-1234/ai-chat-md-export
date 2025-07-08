# Merging Two Test Strategy Documents

Date: 2025-05-27

---

## 👤 User
*2025-05-27 19:28:19*

2つのファイルの内容をマージしてほしい。競合する部分があれば私に質問して、精査させて欲しい

---

## 👤 User
*2025-05-27 19:32:22*

これも同様にマージしてほしい

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

## 🤖 Assistant
*2025-05-27 19:28:41*

2つのテスト戦略文書を確認しました。全体的に内容は一貫していて、同じ方向性を向いていますが、いくつか詳細レベルで競合や重複があります。マージする前に、以下の点について確認させてください：

## 1. テストの配分比率について

**ファイル1（テスト戦略 2025年ベストプラクティス）**：
- 統合テスト（45%）
- ユニットテスト（30%）
- E2Eテスト（15%）
- 静的解析（10%）

**ファイル2（JavaScript/TypeScriptテストのベストプラクティス）**：
- 統合テスト（45%）
- ユニットテスト（15%）
- E2Eテスト（20%）
- 静的解析（20%）

どちらの配分比率を採用しますか？

## 2. スナップショットテストの扱い

**ファイル1**では積極的に推奨していますが、**ファイル2**では限定的な使用を推奨しています。どちらのスタンスを取りますか？

## 3. ツールスタックの詳細度

**ファイル1**は実装に特化した具体的な内容、**ファイル2**はより一般的なベストプラクティス集になっています。マージ後の文書は：
- より実装寄りの詳細な文書にしますか？
- それとも一般的な指針も含む包括的な文書にしますか？

## 4. 構成について

どちらの文書構成をベースにしますか？
- **ファイル1**の番号付きセクション構成
- **ファイル2**の機能別構成

これらの点について方針を教えていただければ、適切にマージした文書を作成します。

---

## 👤 User
*2025-05-27 19:29:34*

1. テストの配分比率について
**ファイル2（JavaScript/TypeScriptテストのベストプラクティス）**：

2
積極的に推奨していますが


より実装寄りの詳細な文書にしますか？


**ファイル2**の機能別構成

---

## 🤖 Assistant
*2025-05-27 19:30:52*

ありがとうございます。以下の方針でマージします：

1. **テスト配分比率**: ファイル2の比率（統合45%、ユニット15%、E2E20%、静的解析20%）
2. **スナップショットテスト**: 積極的推奨のスタンス
3. **詳細度**: より実装寄りの詳細な文書
4. **構成**: ファイル2の機能別構成をベース

それでは、マージした文書を作成いたします。
```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```



2つのファイルをマージして、統合されたテスト戦略文書を作成しました。主な特徴は以下の通りです：

## マージで統合された内容

1. **テスト配分比率**: ファイル2の比率を採用（統合45%、ユニット15%、E2E20%、静的解析20%）

2. **スナップショットテスト**: 積極的推奨のスタンスで、具体的な実装方法も含めて詳細化

3. **実装重視**: より具体的なコード例、設定例、CI/CD統合例を豊富に含めた実践的な文書

4. **機能別構成**: ファイル2の構成をベースに、ファイル1の詳細な実装例を統合

## 特に強化された部分

- **Schemathesis**の具体的な実装方法とCI/CD統合
- **スナップショットテスト**の詳細なベストプラクティス
- **ビジュアルリグレッションテスト**の実装例
- **テスト命名規約**などの実践的なガイドライン
- **環境別テスト戦略**の具体的な設定例

この統合文書により、2025年のモダンなテスト戦略を実践的に導入できるガイドが完成しました。何か追加や修正が必要な部分があれば、お知らせください。

---

## 🤖 Assistant
*2025-05-27 19:32:31*

新しいCORS設定のベストプラクティス文書を既存のテスト戦略文書にマージいたします。CORSは主にAPIテストやセキュリティに関わる内容なので、テスト戦略文書の適切なセクションに統合します。
```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```

---
