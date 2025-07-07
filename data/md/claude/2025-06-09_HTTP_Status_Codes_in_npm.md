# HTTP Status Codes in npm

日付: 2025-06-09

---

## 👤 ユーザー
*2025/6/9 10:28:22*

npm で enum でステータスコードを扱いたい
https://github.com/prettymuchbryce/http-status-codes

---

## 🤖 アシスタント
*2025/6/9 10:28:43*

`http-status-codes`パッケージは、HTTPステータスコードを扱うのに便利なnpmパッケージです。enumのような形でステータスコードを管理できます。

## インストール

```bash
npm install http-status-codes
```

## 基本的な使い方

```javascript
import { StatusCodes, ReasonPhrases, getStatusCode, getReasonPhrase } from 'http-status-codes';

// ステータスコードの使用
console.log(StatusCodes.OK); // 200
console.log(StatusCodes.NOT_FOUND); // 404
console.log(StatusCodes.INTERNAL_SERVER_ERROR); // 500

// 理由フレーズの取得
console.log(ReasonPhrases.OK); // "OK"
console.log(ReasonPhrases.NOT_FOUND); // "Not Found"

// ステータスコードから理由フレーズを取得
console.log(getReasonPhrase(200)); // "OK"
console.log(getReasonPhrase(404)); // "Not Found"

// 理由フレーズからステータスコードを取得
console.log(getStatusCode('OK')); // 200
console.log(getStatusCode('Not Found')); // 404
```

## Express.jsでの使用例

```javascript
import express from 'express';
import { StatusCodes } from 'http-status-codes';

const app = express();

app.get('/users/:id', (req, res) => {
  const user = findUserById(req.params.id);
  
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: 'User not found'
    });
  }
  
  res.status(StatusCodes.OK).json(user);
});

app.post('/users', (req, res) => {
  try {
    const newUser = createUser(req.body);
    res.status(StatusCodes.CREATED).json(newUser);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      error: error.message
    });
  }
});

// エラーハンドリング
app.use((err, req, res, next) => {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    error: 'Something went wrong!'
  });
});
```

## TypeScriptでの型安全な使用

TypeScriptを使用している場合、このパッケージは型定義が含まれているため、型安全に使用できます：

```typescript
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

// 型安全なステータスコード
const successCode: number = StatusCodes.OK;
const errorCode: number = StatusCodes.BAD_REQUEST;

// カスタムエラーレスポンス型
interface ErrorResponse {
  status: number;
  message: string;
}

function createErrorResponse(code: StatusCodes): ErrorResponse {
  return {
    status: code,
    message: getReasonPhrase(code)
  };
}

// 使用例
const notFoundError = createErrorResponse(StatusCodes.NOT_FOUND);
// { status: 404, message: "Not Found" }
```

## よく使うステータスコード

```javascript
// 成功系
StatusCodes.OK                    // 200
StatusCodes.CREATED              // 201
StatusCodes.ACCEPTED             // 202
StatusCodes.NO_CONTENT           // 204

// リダイレクト系
StatusCodes.MOVED_PERMANENTLY    // 301
StatusCodes.FOUND               // 302
StatusCodes.NOT_MODIFIED        // 304

// クライアントエラー系
StatusCodes.BAD_REQUEST         // 400
StatusCodes.UNAUTHORIZED        // 401
StatusCodes.FORBIDDEN           // 403
StatusCodes.NOT_FOUND           // 404
StatusCodes.CONFLICT            // 409

// サーバーエラー系
StatusCodes.INTERNAL_SERVER_ERROR  // 500
StatusCodes.BAD_GATEWAY           // 502
StatusCodes.SERVICE_UNAVAILABLE   // 503
```

このパッケージを使うことで、マジックナンバーを避けて、可読性の高いコードを書くことができます。

---

## 👤 ユーザー
*2025/6/9 10:29:09*

他の軽量なnpmのパッケージの選択肢はあるか？

---

## 🤖 アシスタント
*2025/6/9 10:29:33*

はい、HTTPステータスコードを扱う軽量なnpmパッケージがいくつかあります。以下に主な選択肢を紹介します：

## 1. **http-status** (最も軽量)
```bash
npm install http-status
```

```javascript
import httpStatus from 'http-status';

// 使用例
console.log(httpStatus.OK); // 200
console.log(httpStatus.NOT_FOUND); // 404
console.log(httpStatus['404']); // "Not Found"
console.log(httpStatus[404]); // "Not Found"

// Express.jsでの使用
res.status(httpStatus.OK).json({ message: 'Success' });
```

**特徴:**
- サイズ: ~3KB
- シンプルなオブジェクト構造
- 双方向マッピング（コード↔メッセージ）

## 2. **statuses** (Node.js公式チームメンテナンス)
```bash
npm install statuses
```

```javascript
import status from 'statuses';

// 使用例
console.log(status(404)); // "Not Found"
console.log(status('Not Found')); // 404
console.log(status.message[404]); // "Not Found"
console.log(status.code['Not Found']); // 404

// ステータスコードの検証
console.log(status.redirect[301]); // true
console.log(status.empty[204]); // true
console.log(status.retry[503]); // true
```

**特徴:**
- サイズ: ~5KB
- Express.jsチームがメンテナンス
- ステータスコードの分類機能付き

## 3. **自作の軽量enum**
最も軽量にしたい場合は、自作することも可能です：

```javascript
// statusCodes.js
export const StatusCodes = Object.freeze({
  // 2xx Success
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  
  // 3xx Redirection
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  NOT_MODIFIED: 304,
  
  // 4xx Client Error
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  
  // 5xx Server Error
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
});

// TypeScript版
export enum StatusCodes {
  // 2xx Success
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  
  // 4xx Client Error
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  
  // 5xx Server Error
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503
}
```

## パッケージサイズ比較

| パッケージ | サイズ | 週間ダウンロード数 | 特徴 |
|-----------|--------|------------------|------|
| http-status | ~3KB | 200k+ | 最も軽量、シンプル |
| statuses | ~5KB | 40M+ | Express公式、高機能 |
| http-status-codes | ~40KB | 2M+ | TypeScript対応、機能豊富 |

## 選択の指針

1. **最小サイズ重視** → `http-status` または自作
2. **Express.js使用** → `statuses`（Expressに内蔵）
3. **TypeScript + 機能性** → `http-status-codes`
4. **必要最小限のコードのみ** → 自作enum

軽量性を重視する場合は、`http-status`か`statuses`がおすすめです。特に`statuses`はExpress.jsに既に含まれているため、Express使用時は追加インストール不要です。

---
