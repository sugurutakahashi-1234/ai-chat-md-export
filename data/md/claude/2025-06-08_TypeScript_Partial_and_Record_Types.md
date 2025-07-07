# TypeScript Partial and Record Types

日付: 2025-06-08

---

## 👤 ユーザー
*2025/6/8 18:29:44*

TypeScriptのPartialとRecordの型について教えて欲しい

const prismaErrorMapping: Partial&lt;Record&lt;PrismaErrorCode, ApiErrorType&gt;&gt; = {
  \[PrismaErrorCode.UniqueConstraintViolation\]: ApiErrorType.Conflict,
  \[PrismaErrorCode.RecordNotFoundOrAccessDenied\]: ApiErrorType.NotFound,
  \[PrismaErrorCode.ForeignKeyConstraintViolation\]: ApiErrorType.BadRequest,
  \[PrismaErrorCode.ValueTooLong\]: ApiErrorType.BadRequest,
  \[PrismaErrorCode.RecordNotFound\]: ApiErrorType.NotFound,
  \[PrismaErrorCode.ConstraintViolation\]: ApiErrorType.BadRequest,
  \[PrismaErrorCode.InvalidValue\]: ApiErrorType.BadRequest,
  \[PrismaErrorCode.DataValidationError\]: ApiErrorType.BadRequest,
  \[PrismaErrorCode.NullConstraintViolation\]: ApiErrorType.BadRequest,
  \[PrismaErrorCode.MissingRequiredValue\]: ApiErrorType.BadRequest,
  \[PrismaErrorCode.MissingRequiredArgument\]: ApiErrorType.BadRequest,
  \[PrismaErrorCode.RequiredRelationViolation\]: ApiErrorType.BadRequest,
  \[PrismaErrorCode.RelatedRecordNotFound\]: ApiErrorType.NotFound,
  \[PrismaErrorCode.TransactionConflict\]: ApiErrorType.Conflict,
};

---

## 🤖 アシスタント
*2025/6/8 18:30:05*

TypeScriptの`Partial`と`Record`型について、コード例を交えて説明します。

## Record型

`Record<K, T>`は、キーの型`K`と値の型`T`を指定してオブジェクト型を作成するユーティリティ型です。

```typescript
// Record<キーの型, 値の型>
type ApiErrors = Record<string, number>;
// これは { [key: string]: number } と同じ

// 具体的な例
type HttpStatusCodes = Record<'success' | 'notFound' | 'serverError', number>;
// 結果: {
//   success: number;
//   notFound: number;
//   serverError: number;
// }
```

## Partial型

`Partial<T>`は、型`T`のすべてのプロパティをオプショナル（省略可能）にする型です。

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

type PartialUser = Partial<User>;
// 結果: {
//   id?: number;
//   name?: string;
//   email?: string;
// }
```

## Partial<Record<K, T>>の組み合わせ

あなたのコードでは、この2つを組み合わせています：

```typescript
const prismaErrorMapping: Partial<Record<PrismaErrorCode, ApiErrorType>> = {
  // ...
};
```

これは以下のような意味になります：

1. `Record<PrismaErrorCode, ApiErrorType>` - すべての`PrismaErrorCode`をキーとし、`ApiErrorType`を値とするオブジェクト型
2. `Partial<...>` - そのオブジェクトのすべてのプロパティをオプショナルにする

つまり、**すべての`PrismaErrorCode`に対してマッピングを定義する必要がなく、必要なものだけを定義できる**ということです。

```typescript
// もしPartialを使わない場合
const errorMapping: Record<PrismaErrorCode, ApiErrorType> = {
  // すべてのPrismaErrorCodeに対してマッピングを定義する必要がある
  [PrismaErrorCode.UniqueConstraintViolation]: ApiErrorType.Conflict,
  [PrismaErrorCode.RecordNotFoundOrAccessDenied]: ApiErrorType.NotFound,
  // ... 他のすべてのPrismaErrorCodeも定義が必須
};

// Partialを使うことで
const errorMapping: Partial<Record<PrismaErrorCode, ApiErrorType>> = {
  // 必要なものだけ定義すればOK
  [PrismaErrorCode.UniqueConstraintViolation]: ApiErrorType.Conflict,
  [PrismaErrorCode.RecordNotFoundOrAccessDenied]: ApiErrorType.NotFound,
  // 他は省略可能
};
```

この設計により、エラーコードの一部だけをマッピングしたい場合に柔軟に対応できます。実際の使用時は、マッピングが存在しない場合のデフォルト処理を考慮する必要があります：

```typescript
function getApiErrorType(prismaError: PrismaErrorCode): ApiErrorType {
  return prismaErrorMapping[prismaError] ?? ApiErrorType.InternalServerError;
  // マッピングがない場合はデフォルト値を返す
}
```

---
