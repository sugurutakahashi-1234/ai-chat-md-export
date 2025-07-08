# TypeScript Custom Error Class Properties

日付: 2025-06-09

---

## 👤 ユーザー
*2025/06/09 14:05:56*

TypeScriptでexport class ApiError extends Error {のようなカスタムエラーを作ったときに、このnameやmessageやstack?は勝手にnewしたときに埋められるのか？

interface Error {
    name: string;
    message: string;
    stack?: string;
}

---

## 🤖 アシスタント
*2025/06/09 14:06:13*

はい、TypeScriptで`Error`クラスを継承してカスタムエラーを作成した場合、`name`、`message`、`stack`は基本的に自動的に設定されます。

## 自動的に設定される内容

```typescript
export class ApiError extends Error {
  constructor(message: string) {
    super(message);
  }
}

const error = new ApiError("APIエラーが発生しました");
```

この場合：

- **`message`**: コンストラクタに渡した文字列が自動的に設定されます
- **`stack`**: エラーがスローされた時点でのスタックトレースが自動的に設定されます
- **`name`**: デフォルトでは `"Error"` が設定されます（これは通常カスタマイズしたい部分です）

## より良い実装方法

カスタムエラークラスでは、通常`name`プロパティを明示的に設定します：

```typescript
export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError"; // クラス名を設定
    
    // V8エンジンのスタックトレースを正しく設定（省略可能）
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}

const error = new ApiError("APIエラーが発生しました");
console.log(error.name);    // "ApiError"
console.log(error.message); // "APIエラーが発生しました"
console.log(error.stack);   // スタックトレース（自動生成）
```

## より高度な実装例

```typescript
export class ApiError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = this.constructor.name; // 動的にクラス名を設定
    this.statusCode = statusCode;
    
    // TypeScriptのトランスパイル時の問題を回避
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

// 使用例
const error = new ApiError("認証エラー", 401);
console.log(error instanceof ApiError); // true
console.log(error instanceof Error);    // true
```

`Object.setPrototypeOf`の行は、TypeScriptでES5にトランスパイルする際のプロトタイプチェーンの問題を回避するためのものです。

---

## 👤 ユーザー
*2025/06/09 14:07:15*

super(message);の意味がわかっていない

---

## 🤖 アシスタント
*2025/06/09 14:07:37*

`super(message)`は、親クラス（この場合は`Error`クラス）のコンストラクタを呼び出すための構文です。詳しく説明します。

## superとは

`super`は親クラスを参照するキーワードで、コンストラクタ内で`super()`を呼ぶと親クラスのコンストラクタを実行します。

```typescript
// 親クラス
class Error {
  message: string;
  
  constructor(message: string) {
    this.message = message;
    // スタックトレースなどの初期化処理
  }
}

// 子クラス
export class ApiError extends Error {
  constructor(message: string) {
    super(message); // Error クラスのコンストラクタを呼び出す
    // ↑ これは Error(message) を実行するのと同じ
  }
}
```

## なぜsuperが必要か

JavaScriptでは、クラスを継承した場合、子クラスのコンストラクタで必ず`super()`を呼ぶ必要があります：

```typescript
// ❌ エラーになる
export class ApiError extends Error {
  constructor(message: string) {
    // superを呼ばずにthisを使おうとするとエラー
    this.name = "ApiError"; // エラー: 'super()' must be called before accessing 'this'
  }
}

// ✅ 正しい
export class ApiError extends Error {
  constructor(message: string) {
    super(message); // まず親クラスの初期化
    this.name = "ApiError"; // その後でthisを使える
  }
}
```

## 具体的に何が起きているか

```typescript
const error = new ApiError("APIエラーが発生しました");
```

この時の処理の流れ：

1. `ApiError`のコンストラクタが呼ばれる
2. `super(message)`で`Error`クラスのコンストラクタが実行される
   - `this.message = "APIエラーが発生しました"`が設定される
   - スタックトレースが生成される
   - その他のErrorクラスの初期化処理が行われる
3. `ApiError`のコンストラクタの残りの処理が実行される

## わかりやすい例

```typescript
class Animal {
  name: string;
  
  constructor(name: string) {
    console.log("Animalのコンストラクタが実行されました");
    this.name = name;
  }
}

class Dog extends Animal {
  breed: string;
  
  constructor(name: string, breed: string) {
    console.log("Dogのコンストラクタ開始");
    super(name); // Animalのコンストラクタを呼ぶ
    console.log("Animalの初期化完了");
    this.breed = breed;
  }
}

const myDog = new Dog("ポチ", "柴犬");
// 出力:
// Dogのコンストラクタ開始
// Animalのコンストラクタが実行されました
// Animalの初期化完了
```

つまり、`super(message)`は「親クラスであるErrorクラスに、messageを渡して初期化してもらう」という意味です。

---

## 👤 ユーザー
*2025/06/09 14:08:21*

どうして、super(name);ya

---

## 🤖 アシスタント
*2025/06/09 14:08:42*

すみません、質問が途中で切れているようですが、「どうして`super(name)`が必要なのか？」という質問として回答します。

## なぜsuperが必要なのか

### 1. 親クラスのプロパティを初期化するため

```typescript
class Animal {
  name: string;
  age: number;
  
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}

class Dog extends Animal {
  breed: string;
  
  constructor(name: string, age: number, breed: string) {
    // ❌ これだと親クラスのnameとageが初期化されない
    // this.breed = breed;
    
    // ✅ 親クラスのコンストラクタでnameとageを初期化
    super(name, age);
    this.breed = breed;
  }
}
```

### 2. JavaScriptの言語仕様で必須

継承したクラスでは、`this`を使う前に必ず`super()`を呼ぶ必要があります：

```typescript
class Dog extends Animal {
  constructor(name: string) {
    // ❌ エラー: 'super' must be called before accessing 'this'
    this.breed = "不明";
    super(name);
  }
}

class Dog extends Animal {
  constructor(name: string) {
    // ✅ 正しい順序
    super(name);
    this.breed = "不明";
  }
}
```

### 3. 親クラスの重要な初期化処理を実行するため

特に`Error`クラスの場合、スタックトレースの生成など重要な処理があります：

```typescript
// Errorクラスの内部的な動作（簡略化）
class Error {
  message: string;
  stack?: string;
  
  constructor(message: string) {
    this.message = message;
    this.stack = generateStackTrace(); // スタックトレースを生成
    // その他の重要な初期化処理
  }
}

// superを呼ばないと、これらの処理が実行されない
class ApiError extends Error {
  constructor(message: string) {
    super(message); // これがないとstackが生成されない
  }
}
```

## もしsuperを呼ばなかったら？

```typescript
// 仮にsuperが不要だとしたら（実際はエラーになります）
class ApiError extends Error {
  constructor(message: string) {
    // super(message); を呼ばない
    this.message = message; // 手動で設定？
    // でもstackはどうする？
    // 他の隠れた初期化処理は？
  }
}
```

親クラスの初期化処理を全て自分で再実装する必要が出てきて、非効率で危険です。

つまり、`super()`は「親クラスの初期化処理をちゃんと実行してもらう」ために必要不可欠なのです。

---
