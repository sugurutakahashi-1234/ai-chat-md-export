# TypeScript: undefined vs null

日付: 2025-06-09

---

## 👤 ユーザー
*2025/06/09 13:55:40*

TypeScriptではundefinedとnullのどちらを使うべきか?

---

## 🤖 アシスタント
*2025/06/09 13:56:07*

TypeScriptにおける`undefined`と`null`の使い分けは、プロジェクトやチームの方針によって異なりますが、一般的な指針をご紹介します。

## 現代的な推奨事項

**基本的には`undefined`を使用し、`null`は避ける**ことが推奨されています。

### 理由

1. **JavaScriptの自然な動作との一致**
   - 初期化されていない変数は`undefined`
   - 存在しないオブジェクトプロパティは`undefined`
   - 関数の戻り値がない場合は`undefined`

2. **TypeScriptの型システムとの相性**
   - オプショナルプロパティ（`?`）は`undefined`を許可
   - `strictNullChecks`を有効にすると、両方を明示的に扱う必要があり、複雑になる

### 実践的な使い方

```typescript
// 推奨：undefinedを使用
interface User {
  name: string;
  email?: string; // string | undefined
}

// 値が存在しない場合
let value: string | undefined;
if (condition) {
  value = "something";
}
// valueはundefinedまたはstring

// 関数の戻り値
function findUser(id: string): User | undefined {
  const user = users.find(u => u.id === id);
  return user; // 見つからない場合はundefined
}
```

### nullを使う例外的なケース

1. **APIとの互換性**：外部APIが`null`を返す場合
2. **JSONとの互換性**：`JSON.stringify`は`undefined`を無視するが、`null`は保持する
3. **明示的なリセット**：値を意図的に「空」にする場合

```typescript
// APIレスポンスの例
interface ApiResponse {
  data: string | null; // APIがnullを返す可能性がある
}

// 明示的なリセット
let userSelection: User | null = getUser();
// ユーザーが選択を解除
userSelection = null; // 明示的に「選択なし」を表現
```

### 設定の推奨

```json
// tsconfig.json
{
  "compilerOptions": {
    "strictNullChecks": true,
    "exactOptionalPropertyTypes": true // オプショナルプロパティでundefinedのみ許可
  }
}
```

### ESLintルール

```json
{
  "rules": {
    "@typescript-eslint/no-unnecessary-condition": "error",
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    "@typescript-eslint/prefer-optional-chain": "error"
  }
}
```

## まとめ

- デフォルトでは`undefined`を使用
- `null`は外部システムとの互換性が必要な場合のみ使用
- プロジェクト全体で一貫性を保つことが最も重要
- `strictNullChecks`を有効にして、両方を明示的に扱う

この方針により、コードベースがシンプルになり、JavaScriptの自然な動作と調和したTypeScriptコードを書くことができます。

---

## 👤 ユーザー
*2025/06/09 13:56:38*

型安全なのはどちらか?

---

## 🤖 アシスタント
*2025/06/09 13:57:09*

型安全性の観点では、**どちらも同じレベルで型安全**です。重要なのは、TypeScriptの`strictNullChecks`を有効にしているかどうかです。

## strictNullChecksの影響

### strictNullChecks: true の場合（推奨）
両方とも完全に型安全です：

```typescript
// null も undefined も型として明示的に扱われる
let value1: string | null = null;
let value2: string | undefined = undefined;

// エラー：nullの可能性を考慮していない
console.log(value1.length); // ❌ エラー

// 正しい：nullチェックが必要
if (value1 !== null) {
  console.log(value1.length); // ✅ OK
}

// undefinedも同様に型安全
console.log(value2.length); // ❌ エラー
if (value2 !== undefined) {
  console.log(value2.length); // ✅ OK
}
```

### strictNullChecks: false の場合（非推奨）
どちらも型安全ではありません：

```typescript
// null も undefined も任意の型に代入可能
let value: string = null; // ⚠️ エラーにならない
let value2: string = undefined; // ⚠️ エラーにならない

// 実行時エラーのリスク
console.log(value.length); // 💥 実行時エラー
```

## 型安全性の実践的な違い

### 1. オプショナルプロパティとの一貫性

```typescript
// TypeScriptのオプショナルプロパティはundefinedを使用
interface User {
  name: string;
  email?: string; // string | undefined（nullは含まれない）
}

// undefinedを使うと一貫性がある
const user: User = {
  name: "Alice",
  // emailは省略可能（undefined）
};

// nullを使うと型の不一致
const user2: User = {
  name: "Bob",
  email: null // ❌ エラー：型 'null' を型 'string | undefined' に割り当てることはできません
};
```

### 2. 型ガードの簡潔性

```typescript
// undefined の場合
function processValue(value: string | undefined) {
  // 簡潔な型ガード
  if (value) {
    console.log(value.length); // 自動的に string 型
  }
  
  // または
  console.log(value?.length); // オプショナルチェーン
}

// null の場合
function processValueNull(value: string | null) {
  // 明示的なnullチェックが必要
  if (value !== null) {
    console.log(value.length);
  }
  
  // オプショナルチェーンは null にも対応
  console.log(value?.length);
}
```

### 3. デフォルト値の扱い

```typescript
// undefined は || や ?? で扱いやすい
function greet(name?: string) {
  const displayName = name ?? "Guest"; // undefined の場合 "Guest"
  return `Hello, ${displayName}`;
}

// null の場合、明示的な型注釈が必要なことがある
function greetNull(name: string | null) {
  const displayName = name ?? "Guest"; // null の場合も "Guest"
  return `Hello, ${displayName}`;
}
```

## 結論

**型安全性のレベルは同じ**ですが、実践的な観点では：

1. **`undefined`の方が型システムとの統合が良い**
   - オプショナルプロパティとの一貫性
   - TypeScriptのデフォルト動作との調和
   - 型推論が効きやすい

2. **必須条件：`strictNullChecks: true`**
   - これを有効にしない限り、どちらも型安全ではない
   - 現代のTypeScriptプロジェクトでは必須の設定

3. **実用的な型安全性**
   ```typescript
   // 最も型安全なアプローチ
   type Result<T> = { success: true; value: T } | { success: false; error: Error };
   
   // undefined/null より明示的で安全
   function safeDivide(a: number, b: number): Result<number> {
     if (b === 0) {
       return { success: false, error: new Error("Division by zero") };
     }
     return { success: true, value: a / b };
   }
   ```

つまり、型安全性の観点では同等ですが、TypeScriptのエコシステムとの調和を考えると`undefined`の方が実践的に扱いやすいと言えます。

---
