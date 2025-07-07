# TypeScriptの型システムについて

日付: 2025-01-07

---

## 👤 ユーザー
*2025/1/7 19:00:00*

TypeScriptの型推論について教えてください

---

## 🤖 アシスタント
*2025/1/7 19:01:00*

TypeScriptの型推論は、明示的に型を指定しなくても、コンパイラが自動的に型を判断する機能です。

主な型推論のパターン：

1. **変数の初期化時**
```typescript
let num = 42; // number型と推論
let str = "hello"; // string型と推論
```

2. **関数の戻り値**
```typescript
function add(a: number, b: number) {
  return a + b; // 戻り値はnumber型と推論
}
```

3. **配列やオブジェクト**
```typescript
const arr = [1, 2, 3]; // number[]型
const obj = { name: "John", age: 30 }; // { name: string; age: number }
```

型推論により、コードが簡潔になりつつ、型安全性が保たれます。

---

## 👤 ユーザー
*2025/1/7 19:02:00*

ジェネリクスはどういう時に使うべきですか？

---

## 🤖 アシスタント
*2025/1/7 19:03:00*

ジェネリクスは、型の再利用性を高めたい場合に使用します。

**使用すべきケース：**

1. **汎用的な関数やクラス**
```typescript
function identity<T>(arg: T): T {
  return arg;
}
```

2. **コレクション操作**
```typescript
class Stack<T> {
  private items: T[] = [];
  push(item: T): void { this.items.push(item); }
  pop(): T | undefined { return this.items.pop(); }
}
```

3. **APIレスポンスの型定義**
```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  error?: string;
}
```

ジェネリクスを使うことで、型安全性を保ちながら、柔軟で再利用可能なコードが書けます。

---
