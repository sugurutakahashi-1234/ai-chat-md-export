# TypeScript Error Handling Types

日付: 2025-06-10

---

## 👤 ユーザー
*2025/6/10 14:27:08*

TypeScriptってtry-catchブロックにError型以外のものは入ってこれるのかunknownなのか？

---

## 🤖 アシスタント
*2025/6/10 14:27:27*

TypeScriptのtry-catchブロックでキャッチされるエラーは`unknown`型として扱われます。これはTypeScript 4.0以降の仕様です。

```typescript
try {
  // 何かの処理
} catch (e) {
  // e は unknown 型
  console.log(e); // OK
  console.log(e.message); // エラー: 'unknown'型のプロパティ'message'にアクセスできない
}
```

## なぜ`unknown`型なのか

JavaScriptでは、`throw`文で任意の値を投げることができるため、Error型以外のものも投げられます：

```typescript
throw new Error("エラー");     // Error型
throw "文字列エラー";          // string型
throw 42;                      // number型
throw { msg: "オブジェクト" }; // object型
throw null;                    // null
throw undefined;               // undefined
```

このため、TypeScriptは安全性を重視して`unknown`型としています。

## 型ガードを使った対処法

```typescript
try {
  // 何かの処理
} catch (e) {
  if (e instanceof Error) {
    // ここでeはError型として扱える
    console.log(e.message);
    console.log(e.stack);
  } else if (typeof e === 'string') {
    // 文字列として扱う
    console.log(`エラー: ${e}`);
  } else {
    // その他の場合
    console.log('不明なエラー:', e);
  }
}
```

## 型注釈を使う場合（TypeScript 4.4以前）

古いバージョンのTypeScriptでは、明示的に型注釈を付けることができました：

```typescript
try {
  // 何かの処理
} catch (e: any) { // または catch (e: Error) など
  // ただし、これは型安全性を損なう可能性がある
}
```

しかし、TypeScript 4.0以降では`catch`節のパラメータに型注釈を付けることはできなくなり、常に`unknown`型として扱われるようになりました。これにより、より型安全なコードを書くことが推奨されています。

---

## 👤 ユーザー
*2025/6/10 14:27:57*

TypeScriptプロジェクトなのでError型ときめうちはできないか？

---

## 🤖 アシスタント
*2025/6/10 14:28:15*

TypeScriptプロジェクトでも、残念ながらError型と決め打ちすることはできません。理由は以下の通りです：

## 1. JavaScriptランタイムの制約

TypeScriptは最終的にJavaScriptにコンパイルされ、JavaScriptランタイムで実行されます。JavaScriptでは任意の値を`throw`できるため、型安全性を保証できません：

```typescript
// TypeScriptコード内でも...
function riskyFunction() {
  if (Math.random() > 0.5) {
    throw new Error("正常なエラー");
  } else {
    throw "文字列エラー"; // これも有効
  }
}

// サードパーティライブラリが以下のようなコードを含む可能性
function externalLibFunction() {
  throw { code: 404, message: "Not found" }; // Error型ではない
}
```

## 2. 実用的な対処法

### ユーティリティ関数を作る

```typescript
function assertError(error: unknown): asserts error is Error {
  if (!(error instanceof Error)) {
    throw new Error(`Unexpected error type: ${typeof error}`);
  }
}

try {
  // 何かの処理
} catch (e) {
  assertError(e);
  // ここからeはError型として扱える
  console.log(e.message);
  console.log(e.stack);
}
```

### カスタムエラーハンドラー

```typescript
function handleError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return String(error);
}

try {
  // 何かの処理
} catch (e) {
  const message = handleError(e);
  console.error(`エラーが発生しました: ${message}`);
}
```

### プロジェクト内ルールとして

プロジェクト内で「必ずError型を投げる」というルールを設定し、ESLintルールで強制することは可能です：

```typescript
// .eslintrc.json
{
  "rules": {
    "no-throw-literal": "error" // Error以外のthrowを禁止
  }
}
```

ただし、これはあくまで自分のコードに対してのみで、外部ライブラリやブラウザAPIなどからの例外は制御できません。

## まとめ

TypeScriptプロジェクトであっても、完全にError型のみと決め打ちすることは型安全性の観点から推奨されません。`unknown`型として扱い、適切な型ガードを使用することが、より堅牢なエラーハンドリングにつながります。

---
