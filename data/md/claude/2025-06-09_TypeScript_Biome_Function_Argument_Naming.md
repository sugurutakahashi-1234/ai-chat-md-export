# TypeScript Biome Function Argument Naming

日付: 2025-06-09

---

## 👤 ユーザー
*2025/6/9 11:02:17*

TypeScript 関数呼び出し 引数名の省略不可のbiomeでの設定方法

---

## 🤖 アシスタント
*2025/6/9 11:02:45*

Biomeで TypeScript の関数呼び出し時の引数名を省略不可にする設定について説明します。

この機能は Biome の `noConfusingVoidType` や `useExhaustiveDependencies` のようなルールではなく、より具体的には **名前付き引数（labeled arguments）** や **オブジェクトパラメータ** を強制する設定を指していると思われます。

残念ながら、Biome には関数呼び出し時に引数名を明示的に必須とする直接的なルールは現在ありません。しかし、以下のようなアプローチで似た効果を得ることができます：

## 1. オブジェクトパラメータを使用する設計パターン

```typescript
// ❌ 位置引数だと意味が不明瞭
function createUser(name: string, age: number, email: string) {
  // ...
}
createUser("John", 25, "john@example.com");

// ✅ オブジェクトパラメータで引数名が明確
function createUser(params: {
  name: string;
  age: number;
  email: string;
}) {
  // ...
}
createUser({ name: "John", age: 25, email: "john@example.com" });
```

## 2. Biome の設定で関連するルール

`biome.json` で以下のようなルールを有効にすることで、コードの可読性を向上させることができます：

```json
{
  "linter": {
    "enabled": true,
    "rules": {
      "complexity": {
        "noExcessiveCognitiveComplexity": "error",
        "useArrowFunction": "error"
      },
      "style": {
        "useNamingConvention": {
          "level": "error",
          "options": {
            "strictCase": true
          }
        }
      }
    }
  }
}
```

## 3. カスタムルールの作成（将来的な対応）

Biome はカスタムルールの作成をサポートする予定があるため、将来的には独自のルールを作成できる可能性があります。

## 4. 代替案：ESLint プラグインの使用

もし Biome と ESLint を併用している場合は、ESLint のカスタムルールやプラグインを使用することも検討できます：

```javascript
// .eslintrc.js
module.exports = {
  rules: {
    // カスタムルールで引数が多い関数をオブジェクトパラメータに強制
    'prefer-object-params': ['error', { maxParams: 2 }]
  }
};
```

## まとめ

現時点では Biome に直接的な「引数名省略不可」のルールはありませんが、オブジェクトパラメータパターンを採用することで、実質的に引数名を明示的にすることができます。また、Biome の開発は活発なので、将来的にこのような機能が追加される可能性もあります。

---

## 👤 ユーザー
*2025/6/9 11:05:22*

オブジェクトパラメータの引数名と変数名が一致しているときに省略が可能なのか？これも小御略不可にしたい

---

## 🤖 アシスタント
*2025/6/9 11:05:43*

TypeScriptでオブジェクトのプロパティ名を省略できるショートハンド記法を禁止したいということですね。これは Biome の `useShorthandFunctionType` ではなく、**オブジェクトリテラルのショートハンドプロパティ** に関する設定です。

## Biome での設定方法

Biome には `noShorthandPropertyOverrides` というルールがありますが、これは既存のプロパティをオーバーライドする場合のみを対象としています。一般的なショートハンドプロパティを禁止する直接的なルールは現在ありません。

```typescript
// ショートハンドプロパティの例
const name = "John";
const age = 25;

// ❌ ショートハンド記法（これを禁止したい）
const user = { name, age };

// ✅ 明示的な記法（これを強制したい）
const user = { name: name, age: age };
```

## 代替案

### 1. ESLint を併用する場合

ESLint には `object-shorthand` ルールがあり、これを使用してショートハンド記法を禁止できます：

```json
// .eslintrc.json
{
  "rules": {
    "object-shorthand": ["error", "never"]
  }
}
```

### 2. コーディング規約として定める

チーム内でコーディング規約として明文化し、コードレビューで確認する方法：

```typescript
// ❌ 避けるべきパターン
function createUser({ name, email }) {
  return { name, email };
}

// ✅ 推奨パターン
function createUser({ name, email }: { name: string; email: string }) {
  return { name: name, email: email };
}
```

### 3. Biome へのフィーチャーリクエスト

この機能が必要な場合は、Biome の GitHub リポジトリにフィーチャーリクエストとして提案することをお勧めします。Biome は活発に開発されているため、有用なルールは将来的に追加される可能性があります。

## 現在の Biome.json での最善の設定

```json
{
  "linter": {
    "enabled": true,
    "rules": {
      "style": {
        "noShorthandPropertyOverrides": "error"
      },
      "complexity": {
        "noUselessRename": "error"
      }
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2
  }
}
```

現時点では、Biome 単体では完全にショートハンドプロパティを禁止することはできませんが、コーディング規約と他のツールを組み合わせることで目的を達成できます。

---
