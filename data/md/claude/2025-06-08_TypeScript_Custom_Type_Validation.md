# TypeScript Custom Type Validation

日付: 2025-06-08

---

## 👤 ユーザー
*2025/6/8 19:00:22*

typescriptで自分が定義した型であるかどうかのboolを返す関数を作ってほしい

---

## 🤖 アシスタント
*2025/6/8 19:00:45*

TypeScriptで特定の型かどうかを判定する関数（型ガード関数）を作成する方法をいくつか紹介します。

## 1. 基本的な型ガード関数

```typescript
// ユーザー定義型
interface User {
  id: number;
  name: string;
  email: string;
}

// 型ガード関数
function isUser(obj: any): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    'email' in obj &&
    typeof obj.id === 'number' &&
    typeof obj.name === 'string' &&
    typeof obj.email === 'string'
  );
}

// 使用例
const data: unknown = { id: 1, name: "田中", email: "tanaka@example.com" };

if (isUser(data)) {
  // この中ではdataはUser型として扱われる
  console.log(data.name); // 型安全にアクセス可能
}
```

## 2. より厳密な型ガード関数

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
}

function isProduct(obj: any): obj is Product {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'number' &&
    typeof obj.name === 'string' &&
    typeof obj.price === 'number' &&
    typeof obj.inStock === 'boolean' &&
    Object.keys(obj).length === 4 // 余分なプロパティを許可しない
  );
}
```

## 3. 汎用的な型ガードヘルパー

```typescript
// プロパティの型をチェックするヘルパー関数
function hasProperty<T extends object, K extends PropertyKey>(
  obj: T,
  key: K,
  type: string
): obj is T & Record<K, any> {
  return key in obj && typeof (obj as any)[key] === type;
}

// 複数の型に対応した例
interface Admin {
  role: 'admin';
  permissions: string[];
}

interface Guest {
  role: 'guest';
  temporaryId: string;
}

function isAdmin(obj: any): obj is Admin {
  return (
    hasProperty(obj, 'role', 'string') &&
    obj.role === 'admin' &&
    Array.isArray(obj.permissions) &&
    obj.permissions.every((p: any) => typeof p === 'string')
  );
}

function isGuest(obj: any): obj is Guest {
  return (
    hasProperty(obj, 'role', 'string') &&
    obj.role === 'guest' &&
    hasProperty(obj, 'temporaryId', 'string')
  );
}
```

## 4. クラスベースの型ガード

```typescript
class Employee {
  constructor(
    public id: number,
    public name: string,
    public department: string
  ) {}
}

// instanceofを使った型ガード
function isEmployee(obj: any): obj is Employee {
  return obj instanceof Employee;
}

// プロパティベースの型ガード（インスタンスでなくても判定可能）
function isEmployeeLike(obj: any): obj is Employee {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'number' &&
    typeof obj.name === 'string' &&
    typeof obj.department === 'string'
  );
}
```

## 5. ネストした型の型ガード

```typescript
interface Address {
  street: string;
  city: string;
  zipCode: string;
}

interface Customer {
  id: number;
  name: string;
  address: Address;
  orders: Order[];
}

interface Order {
  orderId: number;
  amount: number;
}

function isAddress(obj: any): obj is Address {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.street === 'string' &&
    typeof obj.city === 'string' &&
    typeof obj.zipCode === 'string'
  );
}

function isOrder(obj: any): obj is Order {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.orderId === 'number' &&
    typeof obj.amount === 'number'
  );
}

function isCustomer(obj: any): obj is Customer {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'number' &&
    typeof obj.name === 'string' &&
    isAddress(obj.address) &&
    Array.isArray(obj.orders) &&
    obj.orders.every(isOrder)
  );
}
```

これらの型ガード関数を使用することで、実行時に型の安全性を確保しながら、TypeScriptの型システムと連携して型安全なコードを書くことができます。

---

## 👤 ユーザー
*2025/6/8 19:02:01*

最初に軽く3つの型かどうかを判定してからそのあとしっかり型ガードするのはどう書くのか？エラーハンドリングを想定している

---

## 🤖 アシスタント
*2025/6/8 19:02:43*

エラーハンドリングを考慮した段階的な型ガードの実装例を紹介します。最初に軽い判定を行い、その後詳細な検証を行うパターンです。

## 1. 基本的な段階的型ガード

```typescript
// 3つの型定義
interface User {
  type: 'user';
  id: number;
  name: string;
  email: string;
}

interface Product {
  type: 'product';
  id: number;
  name: string;
  price: number;
  stock: number;
}

interface Order {
  type: 'order';
  orderId: string;
  userId: number;
  items: Array<{ productId: number; quantity: number }>;
  totalAmount: number;
}

type Entity = User | Product | Order;

// エラー結果の型
type ValidationResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

// 軽い判定（discriminatorのチェック）
function getEntityType(obj: unknown): 'user' | 'product' | 'order' | null {
  if (typeof obj !== 'object' || obj === null) {
    return null;
  }
  
  const maybeEntity = obj as Record<string, unknown>;
  if (maybeEntity.type === 'user') return 'user';
  if (maybeEntity.type === 'product') return 'product';
  if (maybeEntity.type === 'order') return 'order';
  
  return null;
}

// 詳細な型ガード関数
function validateUser(obj: unknown): ValidationResult<User> {
  try {
    if (typeof obj !== 'object' || obj === null) {
      return { success: false, error: 'User must be an object' };
    }
    
    const user = obj as Record<string, unknown>;
    
    if (user.type !== 'user') {
      return { success: false, error: 'Invalid type: expected "user"' };
    }
    
    if (typeof user.id !== 'number') {
      return { success: false, error: 'User.id must be a number' };
    }
    
    if (typeof user.name !== 'string' || user.name.length === 0) {
      return { success: false, error: 'User.name must be a non-empty string' };
    }
    
    if (typeof user.email !== 'string' || !user.email.includes('@')) {
      return { success: false, error: 'User.email must be a valid email' };
    }
    
    return { success: true, data: user as User };
  } catch (error) {
    return { success: false, error: `Unexpected error validating user: ${error}` };
  }
}

function validateProduct(obj: unknown): ValidationResult<Product> {
  try {
    if (typeof obj !== 'object' || obj === null) {
      return { success: false, error: 'Product must be an object' };
    }
    
    const product = obj as Record<string, unknown>;
    
    if (product.type !== 'product') {
      return { success: false, error: 'Invalid type: expected "product"' };
    }
    
    if (typeof product.id !== 'number') {
      return { success: false, error: 'Product.id must be a number' };
    }
    
    if (typeof product.name !== 'string' || product.name.length === 0) {
      return { success: false, error: 'Product.name must be a non-empty string' };
    }
    
    if (typeof product.price !== 'number' || product.price < 0) {
      return { success: false, error: 'Product.price must be a non-negative number' };
    }
    
    if (typeof product.stock !== 'number' || product.stock < 0 || !Number.isInteger(product.stock)) {
      return { success: false, error: 'Product.stock must be a non-negative integer' };
    }
    
    return { success: true, data: product as Product };
  } catch (error) {
    return { success: false, error: `Unexpected error validating product: ${error}` };
  }
}

function validateOrder(obj: unknown): ValidationResult<Order> {
  try {
    if (typeof obj !== 'object' || obj === null) {
      return { success: false, error: 'Order must be an object' };
    }
    
    const order = obj as Record<string, unknown>;
    
    if (order.type !== 'order') {
      return { success: false, error: 'Invalid type: expected "order"' };
    }
    
    if (typeof order.orderId !== 'string' || order.orderId.length === 0) {
      return { success: false, error: 'Order.orderId must be a non-empty string' };
    }
    
    if (typeof order.userId !== 'number') {
      return { success: false, error: 'Order.userId must be a number' };
    }
    
    if (!Array.isArray(order.items)) {
      return { success: false, error: 'Order.items must be an array' };
    }
    
    for (let i = 0; i < order.items.length; i++) {
      const item = order.items[i] as Record<string, unknown>;
      if (typeof item.productId !== 'number') {
        return { success: false, error: `Order.items[${i}].productId must be a number` };
      }
      if (typeof item.quantity !== 'number' || item.quantity <= 0) {
        return { success: false, error: `Order.items[${i}].quantity must be a positive number` };
      }
    }
    
    if (typeof order.totalAmount !== 'number' || order.totalAmount < 0) {
      return { success: false, error: 'Order.totalAmount must be a non-negative number' };
    }
    
    return { success: true, data: order as Order };
  } catch (error) {
    return { success: false, error: `Unexpected error validating order: ${error}` };
  }
}

// メインの検証関数
function validateEntity(obj: unknown): ValidationResult<Entity> {
  // Step 1: 軽い判定
  const entityType = getEntityType(obj);
  
  if (!entityType) {
    return { 
      success: false, 
      error: 'Unknown entity type. Expected "user", "product", or "order"' 
    };
  }
  
  // Step 2: 型に応じた詳細な検証
  switch (entityType) {
    case 'user':
      return validateUser(obj);
    case 'product':
      return validateProduct(obj);
    case 'order':
      return validateOrder(obj);
    default:
      return { success: false, error: 'Invalid entity type' };
  }
}
```

## 2. 使用例

```typescript
// 成功例
const validUser = {
  type: 'user',
  id: 1,
  name: '田中太郎',
  email: 'tanaka@example.com'
};

const result1 = validateEntity(validUser);
if (result1.success) {
  console.log('Valid user:', result1.data.name);
} else {
  console.error('Validation error:', result1.error);
}

// エラー例
const invalidProduct = {
  type: 'product',
  id: '123', // 型が違う
  name: 'テスト商品',
  price: -100, // 負の値
  stock: 10
};

const result2 = validateEntity(invalidProduct);
if (!result2.success) {
  console.error('Validation error:', result2.error);
  // "Product.id must be a number"
}

// 不明な型
const unknownEntity = {
  type: 'unknown',
  data: 'something'
};

const result3 = validateEntity(unknownEntity);
if (!result3.success) {
  console.error('Validation error:', result3.error);
  // "Unknown entity type. Expected "user", "product", or "order""
}
```

## 3. より高度なエラーハンドリング

```typescript
// 複数のエラーを収集するバージョン
interface ValidationError {
  field: string;
  message: string;
}

type DetailedValidationResult<T> = 
  | { success: true; data: T }
  | { success: false; errors: ValidationError[] };

function validateUserDetailed(obj: unknown): DetailedValidationResult<User> {
  const errors: ValidationError[] = [];
  
  if (typeof obj !== 'object' || obj === null) {
    return { success: false, errors: [{ field: 'root', message: 'Must be an object' }] };
  }
  
  const user = obj as Record<string, unknown>;
  
  if (user.type !== 'user') {
    errors.push({ field: 'type', message: 'Must be "user"' });
  }
  
  if (typeof user.id !== 'number') {
    errors.push({ field: 'id', message: 'Must be a number' });
  }
  
  if (typeof user.name !== 'string' || user.name.length === 0) {
    errors.push({ field: 'name', message: 'Must be a non-empty string' });
  }
  
  if (typeof user.email !== 'string' || !user.email.includes('@')) {
    errors.push({ field: 'email', message: 'Must be a valid email' });
  }
  
  if (errors.length > 0) {
    return { success: false, errors };
  }
  
  return { success: true, data: user as User };
}

// バッチ処理用の関数
function validateEntities(objects: unknown[]): {
  valid: Entity[];
  invalid: Array<{ index: number; error: string }>;
} {
  const valid: Entity[] = [];
  const invalid: Array<{ index: number; error: string }> = [];
  
  objects.forEach((obj, index) => {
    const result = validateEntity(obj);
    if (result.success) {
      valid.push(result.data);
    } else {
      invalid.push({ index, error: result.error });
    }
  });
  
  return { valid, invalid };
}
```

この段階的なアプローチにより、パフォーマンスを意識しつつ、詳細なエラーメッセージを提供できます。最初の軽い判定で大まかな型を特定し、その後で詳細な検証を行うことで、効率的かつ安全な型チェックが可能になります。

---

## 👤 ユーザー
*2025/6/8 19:04:01*

こうするのと型チェックを3つやってそれ以外だったらリスローする関数を定義して tyr catchのcatch区でまたtry catchするのはどう思うか

---

## 🤖 アシスタント
*2025/6/8 19:04:41*

ご提案のtry-catch入れ子パターンについて、メリット・デメリットを比較してみましょう。

## 1. Try-Catch入れ子パターン

```typescript
// 型ガード関数（エラーをスローする）
function assertUser(obj: unknown): asserts obj is User {
  if (typeof obj !== 'object' || obj === null) {
    throw new Error('User must be an object');
  }
  const user = obj as Record<string, unknown>;
  
  if (user.type !== 'user') throw new Error('Invalid type: expected "user"');
  if (typeof user.id !== 'number') throw new Error('User.id must be a number');
  if (typeof user.name !== 'string') throw new Error('User.name must be a non-empty string');
  if (typeof user.email !== 'string' || !user.email.includes('@')) {
    throw new Error('User.email must be a valid email');
  }
}

function assertProduct(obj: unknown): asserts obj is Product {
  if (typeof obj !== 'object' || obj === null) {
    throw new Error('Product must be an object');
  }
  const product = obj as Record<string, unknown>;
  
  if (product.type !== 'product') throw new Error('Invalid type: expected "product"');
  if (typeof product.id !== 'number') throw new Error('Product.id must be a number');
  if (typeof product.price !== 'number' || product.price < 0) {
    throw new Error('Product.price must be non-negative');
  }
  if (typeof product.stock !== 'number' || !Number.isInteger(product.stock)) {
    throw new Error('Product.stock must be an integer');
  }
}

function assertOrder(obj: unknown): asserts obj is Order {
  // 同様の実装...
  throw new Error('Order validation not implemented');
}

// Try-Catch入れ子パターンの実装
function parseEntity(obj: unknown): Entity {
  try {
    assertUser(obj);
    return obj;
  } catch (userError) {
    try {
      assertProduct(obj);
      return obj;
    } catch (productError) {
      try {
        assertOrder(obj);
        return obj;
      } catch (orderError) {
        // すべて失敗した場合
        throw new Error(
          `Invalid entity. Failed validations:\n` +
          `- User: ${userError instanceof Error ? userError.message : 'Unknown error'}\n` +
          `- Product: ${productError instanceof Error ? productError.message : 'Unknown error'}\n` +
          `- Order: ${orderError instanceof Error ? orderError.message : 'Unknown error'}`
        );
      }
    }
  }
}
```

## 2. 両パターンの比較

### Try-Catch入れ子パターンの問題点：

```typescript
// ❌ パフォーマンスの問題
// 各型チェックで例外をスローするため、正常系でも例外処理のオーバーヘッドが発生
const data = { type: 'order', orderId: 'ORD123', userId: 1, items: [], totalAmount: 100 };
// Userチェックで例外 → Productチェックで例外 → やっとOrderでパス

// ❌ 可読性の問題
function parseEntityNested(obj: unknown): Entity {
  try {
    assertUser(obj);
    return obj;
  } catch {
    try {
      assertProduct(obj);
      return obj;
    } catch {
      try {
        assertOrder(obj);
        return obj;
      } catch {
        throw new Error('Unknown entity type');
      }
    }
  }
}

// ❌ デバッグの困難さ
// スタックトレースが複雑になり、どこで失敗したか追跡しづらい
```

### 推奨パターンの利点：

```typescript
// ✅ パフォーマンスが良い
function validateEntityOptimized(obj: unknown): ValidationResult<Entity> {
  // 軽い判定で型を特定（例外を投げない）
  const entityType = getEntityType(obj);
  
  if (!entityType) {
    return { success: false, error: 'Unknown entity type' };
  }
  
  // 該当する型のみを検証
  switch (entityType) {
    case 'user':
      return validateUser(obj);
    case 'product':
      return validateProduct(obj);
    case 'order':
      return validateOrder(obj);
  }
}

// ✅ エラーハンドリングが明確
const result = validateEntityOptimized(data);
if (result.success) {
  // 型安全にアクセス
  handleEntity(result.data);
} else {
  console.error(`Validation failed: ${result.error}`);
}
```

## 3. Try-Catchを使うべき場面

```typescript
// 外部APIからのデータパースなど、本当に例外的な状況での使用
async function fetchAndParseEntity(id: string): Promise<Entity> {
  try {
    const response = await fetch(`/api/entities/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // ここでは検証結果を使用
    const result = validateEntity(data);
    
    if (!result.success) {
      throw new Error(`Invalid entity data: ${result.error}`);
    }
    
    return result.data;
    
  } catch (error) {
    // ネットワークエラー、JSONパースエラー、検証エラーをまとめて処理
    console.error('Failed to fetch entity:', error);
    throw error;
  }
}
```

## 4. ハイブリッドアプローチ

```typescript
// 必要に応じて例外を投げるオプション付き
function parseEntityWithOptions(
  obj: unknown, 
  options?: { throwOnError?: boolean }
): Entity | ValidationResult<Entity> {
  const result = validateEntity(obj);
  
  if (options?.throwOnError && !result.success) {
    throw new Error(result.error);
  }
  
  return options?.throwOnError ? result.data! : result;
}

// 通常の使用（例外を投げない）
const result1 = parseEntityWithOptions(data) as ValidationResult<Entity>;
if (result1.success) {
  console.log(result1.data);
}

// 例外を投げる必要がある場合
try {
  const entity = parseEntityWithOptions(data, { throwOnError: true }) as Entity;
  console.log(entity);
} catch (error) {
  console.error(error);
}
```

## 結論

Try-Catch入れ子パターンは以下の理由で推奨しません：

1. **パフォーマンス**: 正常系でも例外処理のコストがかかる
2. **可読性**: 入れ子が深くなり、コードが読みづらい
3. **保守性**: エラーの種類や原因が分かりづらい
4. **型安全性**: TypeScriptの型推論が効きにくい

代わりに、discriminated unionやResult型パターンを使った明示的なエラーハンドリングを推奨します。例外は本当に例外的な状況（ネットワークエラー、予期しないランタイムエラー等）に限定すべきです。

---

## 👤 ユーザー
*2025/6/8 19:06:51*

discriminated unionとは？

---

## 🤖 アシスタント
*2025/6/8 19:07:31*

**Discriminated Union**（判別可能なユニオン型）は、TypeScriptで複数の型を安全に扱うための強力なパターンです。各型に共通の「判別子」（discriminator）プロパティを持たせることで、型を明確に区別できます。

## 1. 基本的なDiscriminated Union

```typescript
// 各型に共通の'type'プロパティ（判別子）を持たせる
interface Circle {
  type: 'circle';  // 判別子
  radius: number;
}

interface Rectangle {
  type: 'rectangle';  // 判別子
  width: number;
  height: number;
}

interface Triangle {
  type: 'triangle';  // 判別子
  base: number;
  height: number;
}

// ユニオン型として定義
type Shape = Circle | Rectangle | Triangle;

// 型安全な処理
function calculateArea(shape: Shape): number {
  switch (shape.type) {  // 判別子で分岐
    case 'circle':
      // この中ではshapeはCircle型として推論される
      return Math.PI * shape.radius ** 2;
    
    case 'rectangle':
      // この中ではshapeはRectangle型として推論される
      return shape.width * shape.height;
    
    case 'triangle':
      // この中ではshapeはTriangle型として推論される
      return (shape.base * shape.height) / 2;
    
    // defaultケースは不要（全ての型を網羅している）
  }
}
```

## 2. 実践的な例：APIレスポンス

```typescript
// 成功/エラーのレスポンスを表現
interface SuccessResponse {
  status: 'success';
  data: {
    id: number;
    name: string;
  };
}

interface ErrorResponse {
  status: 'error';
  error: {
    code: string;
    message: string;
  };
}

interface LoadingResponse {
  status: 'loading';
}

type ApiResponse = SuccessResponse | ErrorResponse | LoadingResponse;

// 使用例
function handleResponse(response: ApiResponse) {
  switch (response.status) {
    case 'success':
      console.log('データ:', response.data.name);
      break;
    
    case 'error':
      console.error('エラー:', response.error.message);
      break;
    
    case 'loading':
      console.log('読み込み中...');
      break;
  }
}
```

## 3. 複数の判別子を使う例

```typescript
// アクションタイプの定義
interface AddTodoAction {
  type: 'todo';
  action: 'add';
  payload: {
    text: string;
  };
}

interface RemoveTodoAction {
  type: 'todo';
  action: 'remove';
  payload: {
    id: number;
  };
}

interface SetUserAction {
  type: 'user';
  action: 'set';
  payload: {
    name: string;
    email: string;
  };
}

interface ClearUserAction {
  type: 'user';
  action: 'clear';
}

type Action = AddTodoAction | RemoveTodoAction | SetUserAction | ClearUserAction;

// 2つの判別子を使った処理
function reducer(action: Action) {
  switch (action.type) {
    case 'todo':
      switch (action.action) {
        case 'add':
          console.log('Todo追加:', action.payload.text);
          break;
        case 'remove':
          console.log('Todo削除:', action.payload.id);
          break;
      }
      break;
    
    case 'user':
      switch (action.action) {
        case 'set':
          console.log('ユーザー設定:', action.payload.name);
          break;
        case 'clear':
          console.log('ユーザークリア');
          break;
      }
      break;
  }
}
```

## 4. Exhaustiveness Check（網羅性チェック）

```typescript
type Status = 'pending' | 'success' | 'error' | 'cancelled';

interface Task {
  id: number;
  status: Status;
}

// 全てのケースを網羅していることを保証
function getStatusMessage(status: Status): string {
  switch (status) {
    case 'pending':
      return '処理中';
    case 'success':
      return '完了';
    case 'error':
      return 'エラー';
    case 'cancelled':
      return 'キャンセル';
    default:
      // もし新しいstatusが追加されてケースを追加し忘れると
      // ここでコンパイルエラーになる
      const _exhaustiveCheck: never = status;
      throw new Error(`未処理のステータス: ${status}`);
  }
}
```

## 5. 型ガードとの組み合わせ

```typescript
interface Dog {
  kind: 'dog';
  breed: string;
  bark(): void;
}

interface Cat {
  kind: 'cat';
  color: string;
  meow(): void;
}

interface Bird {
  kind: 'bird';
  wingspan: number;
  fly(): void;
}

type Animal = Dog | Cat | Bird;

// 型ガード関数
function isDog(animal: Animal): animal is Dog {
  return animal.kind === 'dog';
}

function isCat(animal: Animal): animal is Cat {
  return animal.kind === 'cat';
}

// 使用例
function handleAnimal(animal: Animal) {
  if (isDog(animal)) {
    animal.bark();
    console.log(`犬種: ${animal.breed}`);
  } else if (isCat(animal)) {
    animal.meow();
    console.log(`毛色: ${animal.color}`);
  } else {
    // animalはBird型として推論される
    animal.fly();
    console.log(`翼幅: ${animal.wingspan}cm`);
  }
}
```

## 6. エンティティ判別の例（元の質問に関連）

```typescript
interface User {
  type: 'user';
  id: number;
  name: string;
  email: string;
}

interface Product {
  type: 'product';
  id: number;
  name: string;
  price: number;
}

interface Order {
  type: 'order';
  orderId: string;
  userId: number;
  totalAmount: number;
}

type Entity = User | Product | Order;

// 判別子を使った型安全な処理
function processEntity(entity: Entity) {
  switch (entity.type) {
    case 'user':
      // entityは自動的にUser型として推論される
      sendEmail(entity.email);
      break;
    
    case 'product':
      // entityは自動的にProduct型として推論される
      updatePrice(entity.id, entity.price);
      break;
    
    case 'order':
      // entityは自動的にOrder型として推論される
      processPayment(entity.orderId, entity.totalAmount);
      break;
  }
}
```

## Discriminated Unionの利点

1. **型安全性**: コンパイル時に型が保証される
2. **IntelliSense**: IDEが適切な補完を提供
3. **リファクタリング**: 型を追加/変更した際にコンパイラが教えてくれる
4. **可読性**: コードの意図が明確
5. **パフォーマンス**: 実行時の型チェックが最小限

このパターンは、TypeScriptで複数の関連する型を扱う際の標準的なアプローチとなっています。

---

## 👤 ユーザー
*2025/6/8 19:13:22*

まずエラーを拡張したインターフェース（プロトコル）を定義してそれを適応したエラー型を3つ定義してまず初めにインターフェースが適応されているかどうかを型ガードしてそのあと細かく型ガードするという記述はどうだと思うか

---

## 🤖 アシスタント
*2025/6/8 19:14:09*

その設計アプローチは非常に良いと思います！エラーハンドリングの階層的な設計として優れています。実装例を示しながら、メリット・デメリットを解説します。

## 1. エラープロトコルの定義と実装

```typescript
// エラープロトコル（インターフェース）の定義
interface ValidationError {
  readonly errorType: 'validation';
  readonly code: string;
  readonly message: string;
  readonly timestamp: Date;
  validate(): boolean;
}

// 具体的なエラー型の定義
class UserValidationError implements ValidationError {
  readonly errorType = 'validation' as const;
  readonly entityType = 'user' as const;
  
  constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly field?: string,
    public readonly value?: unknown
  ) {}
  
  get timestamp(): Date {
    return new Date();
  }
  
  validate(): boolean {
    return this.code.startsWith('USER_');
  }
}

class ProductValidationError implements ValidationError {
  readonly errorType = 'validation' as const;
  readonly entityType = 'product' as const;
  
  constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly constraints?: {
      min?: number;
      max?: number;
    }
  ) {}
  
  get timestamp(): Date {
    return new Date();
  }
  
  validate(): boolean {
    return this.code.startsWith('PRODUCT_');
  }
}

class OrderValidationError implements ValidationError {
  readonly errorType = 'validation' as const;
  readonly entityType = 'order' as const;
  
  constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly relatedOrders?: string[]
  ) {}
  
  get timestamp(): Date {
    return new Date();
  }
  
  validate(): boolean {
    return this.code.startsWith('ORDER_');
  }
}

// 型ガード関数
function isValidationError(error: unknown): error is ValidationError {
  return (
    error !== null &&
    typeof error === 'object' &&
    'errorType' in error &&
    error.errorType === 'validation' &&
    'code' in error &&
    'message' in error &&
    'timestamp' in error &&
    'validate' in error &&
    typeof (error as any).validate === 'function'
  );
}

function isUserValidationError(error: ValidationError): error is UserValidationError {
  return 'entityType' in error && (error as any).entityType === 'user';
}

function isProductValidationError(error: ValidationError): error is ProductValidationError {
  return 'entityType' in error && (error as any).entityType === 'product';
}

function isOrderValidationError(error: ValidationError): error is OrderValidationError {
  return 'entityType' in error && (error as any).entityType === 'order';
}
```

## 2. 階層的エラーハンドリング

```typescript
// エラーハンドリング関数
function handleError(error: unknown): string {
  // Step 1: まずValidationErrorプロトコルに準拠しているかチェック
  if (!isValidationError(error)) {
    // 標準エラーやその他の例外を処理
    if (error instanceof Error) {
      return `System error: ${error.message}`;
    }
    return 'Unknown error occurred';
  }
  
  // Step 2: 詳細な型判定
  if (isUserValidationError(error)) {
    return handleUserError(error);
  }
  
  if (isProductValidationError(error)) {
    return handleProductError(error);
  }
  
  if (isOrderValidationError(error)) {
    return handleOrderError(error);
  }
  
  // フォールバック（新しいValidationError実装が追加された場合）
  return `Validation error: ${error.code} - ${error.message}`;
}

function handleUserError(error: UserValidationError): string {
  if (error.field === 'email') {
    return `メールアドレスが無効です: ${error.value}`;
  }
  if (error.field === 'password') {
    return 'パスワードが要件を満たしていません';
  }
  return `ユーザー検証エラー: ${error.message}`;
}

function handleProductError(error: ProductValidationError): string {
  if (error.code === 'PRODUCT_PRICE_RANGE' && error.constraints) {
    return `価格は${error.constraints.min}円から${error.constraints.max}円の間で設定してください`;
  }
  return `商品検証エラー: ${error.message}`;
}

function handleOrderError(error: OrderValidationError): string {
  if (error.relatedOrders && error.relatedOrders.length > 0) {
    return `注文エラー: ${error.message} (関連注文: ${error.relatedOrders.join(', ')})`;
  }
  return `注文検証エラー: ${error.message}`;
}
```

## 3. 実際の使用例

```typescript
// バリデーション関数
function validateUser(data: unknown): void {
  if (typeof data !== 'object' || data === null) {
    throw new UserValidationError(
      'USER_INVALID_FORMAT',
      'User data must be an object'
    );
  }
  
  const user = data as Record<string, unknown>;
  
  if (!user.email || typeof user.email !== 'string') {
    throw new UserValidationError(
      'USER_INVALID_EMAIL',
      'Invalid email format',
      'email',
      user.email
    );
  }
  
  // その他のバリデーション...
}

// 使用例
try {
  validateUser({ name: 'John' });  // emailがない
} catch (error) {
  const message = handleError(error);
  console.error(message);  // "メールアドレスが無効です: undefined"
}
```

## 4. このアプローチのメリット

```typescript
// ✅ 拡張性が高い
// 新しいエラー型を追加しても、既存のコードへの影響が最小限

class InventoryValidationError implements ValidationError {
  readonly errorType = 'validation' as const;
  readonly entityType = 'inventory' as const;
  
  constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly stockLevel?: number
  ) {}
  
  get timestamp(): Date {
    return new Date();
  }
  
  validate(): boolean {
    return this.code.startsWith('INVENTORY_');
  }
}

// ✅ テストが書きやすい
describe('Error Handling', () => {
  it('should handle UserValidationError correctly', () => {
    const error = new UserValidationError(
      'USER_INVALID_EMAIL',
      'Invalid email',
      'email',
      'not-an-email'
    );
    
    expect(isValidationError(error)).toBe(true);
    expect(isUserValidationError(error)).toBe(true);
    expect(handleError(error)).toBe('メールアドレスが無効です: not-an-email');
  });
});

// ✅ ログ集約がしやすい
function logError(error: unknown): void {
  if (isValidationError(error)) {
    logger.warn({
      type: 'validation_error',
      code: error.code,
      message: error.message,
      timestamp: error.timestamp,
      valid: error.validate()
    });
  } else {
    logger.error({
      type: 'unknown_error',
      error: String(error)
    });
  }
}
```

## 5. さらなる改善案

```typescript
// Result型との組み合わせ
type Result<T, E extends ValidationError = ValidationError> = 
  | { success: true; value: T }
  | { success: false; error: E };

function validateEntity(data: unknown): Result<Entity, ValidationError> {
  try {
    // バリデーションロジック
    const entity = parseAndValidate(data);
    return { success: true, value: entity };
  } catch (error) {
    if (isValidationError(error)) {
      return { success: false, error };
    }
    // 予期しないエラーをValidationErrorでラップ
    return {
      success: false,
      error: new UserValidationError(
        'UNEXPECTED_ERROR',
        error instanceof Error ? error.message : 'Unknown error'
      )
    };
  }
}
```

## 結論

このアプローチの**良い点**:
1. **段階的な型チェック**で効率的
2. **プロトコル準拠**により拡張性が高い
3. **型安全性**を保ちながら柔軟
4. **エラーの分類と処理**が明確
5. **テスタビリティ**が高い

**注意点**:
1. 初期実装がやや複雑
2. すべてのエラーがプロトコルに準拠する必要がある
3. 階層が深くなりすぎないよう注意

総じて、中〜大規模なアプリケーションでは非常に有効な設計パターンだと思います。特に、エラーハンドリングが重要なドメイン（金融、医療など）では、この程度の厳密さは適切です。

---

## 👤 ユーザー
*2025/6/8 19:17:41*

予期しないエラーはリスローした方がいいのか

---

## 🤖 アシスタント
*2025/6/8 19:18:30*

予期しないエラーの扱いは、**アプリケーションのコンテキストによって異なります**。それぞれのアプローチのメリット・デメリットと、適切な使い分けを解説します。

## 1. リスローすべきケース

```typescript
// ✅ インフラ層やクリティカルなシステムエラー
async function connectToDatabase(): Promise<Connection> {
  try {
    return await createConnection(config);
  } catch (error) {
    // データベース接続エラーは回復不可能なので、そのままリスロー
    logger.fatal('Database connection failed', error);
    throw error;  // アプリケーションを停止させるべき
  }
}

// ✅ ライブラリやフレームワークの内部エラー
function processData(data: unknown): ProcessedData {
  try {
    return transform(data);
  } catch (error) {
    if (isValidationError(error)) {
      // 期待されるエラーは処理
      return handleValidationError(error);
    }
    
    // メモリ不足やスタックオーバーフローなど
    // 予期しないエラーはそのままリスロー
    logger.error('Unexpected error in processData', error);
    throw error;
  }
}

// ✅ トランザクション処理
async function transferMoney(from: string, to: string, amount: number): Promise<void> {
  const transaction = await startTransaction();
  
  try {
    await debit(from, amount);
    await credit(to, amount);
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    
    if (isBusinessError(error)) {
      // ビジネスエラーは適切に処理
      throw new TransferError(error.message);
    }
    
    // システムエラーは必ずリスロー（データ整合性のため）
    throw error;
  }
}
```

## 2. ラップすべきケース

```typescript
// ✅ APIエンドポイントやユーザー向けインターフェース
async function handleUserRequest(req: Request): Promise<Response> {
  try {
    const result = await processUserData(req.body);
    return { status: 200, data: result };
  } catch (error) {
    // すべてのエラーを統一的なフォーマットに変換
    if (isValidationError(error)) {
      return { status: 400, error: error.message };
    }
    
    // 予期しないエラーも安全な形でラップ
    logger.error('Unexpected error in API', error);
    return { 
      status: 500, 
      error: 'Internal server error',  // 詳細を隠蔽
      errorId: generateErrorId()  // トラッキング用
    };
  }
}

// ✅ バッチ処理や継続的な処理
async function processBatch(items: Item[]): Promise<BatchResult> {
  const results: ProcessResult[] = [];
  const errors: BatchError[] = [];
  
  for (const item of items) {
    try {
      const result = await processItem(item);
      results.push(result);
    } catch (error) {
      // エラーをラップして処理を継続
      errors.push({
        itemId: item.id,
        error: isValidationError(error) 
          ? error 
          : new UnexpectedError(`Failed to process item ${item.id}`, error)
      });
    }
  }
  
  return { results, errors };
}
```

## 3. ハイブリッドアプローチ（推奨）

```typescript
// エラーの重要度を分類
enum ErrorSeverity {
  RECOVERABLE = 'recoverable',      // 処理継続可能
  CRITICAL = 'critical',            // 処理停止が必要
  FATAL = 'fatal'                   // システム停止が必要
}

interface SystemError extends ValidationError {
  severity: ErrorSeverity;
  originalError?: unknown;
}

class UnexpectedError implements SystemError {
  readonly errorType = 'validation' as const;
  readonly code = 'UNEXPECTED_ERROR';
  readonly timestamp = new Date();
  
  constructor(
    public readonly message: string,
    public readonly originalError: unknown,
    public readonly severity: ErrorSeverity = ErrorSeverity.CRITICAL
  ) {}
  
  validate(): boolean {
    return true;
  }
  
  shouldRethrow(): boolean {
    return this.severity === ErrorSeverity.FATAL;
  }
}

// 統一的なエラーハンドリング
function handleErrorWithContext(
  error: unknown,
  context: string
): Result<never, SystemError> {
  // 既知のエラー
  if (isValidationError(error)) {
    return { success: false, error };
  }
  
  // システムレベルのエラーチェック
  if (error instanceof Error) {
    // メモリ不足、スタックオーバーフローなど
    if (isSystemCriticalError(error)) {
      logger.fatal(`Fatal error in ${context}`, error);
      throw error;  // リスロー
    }
    
    // ネットワークエラーなど回復可能なエラー
    if (isRecoverableError(error)) {
      return {
        success: false,
        error: new UnexpectedError(
          error.message,
          error,
          ErrorSeverity.RECOVERABLE
        )
      };
    }
  }
  
  // その他の予期しないエラー
  const wrappedError = new UnexpectedError(
    `Unexpected error in ${context}`,
    error,
    ErrorSeverity.CRITICAL
  );
  
  if (wrappedError.shouldRethrow()) {
    throw error;
  }
  
  return { success: false, error: wrappedError };
}

// ヘルパー関数
function isSystemCriticalError(error: Error): boolean {
  return (
    error.name === 'RangeError' ||  // スタックオーバーフロー
    error.message.includes('out of memory') ||
    error.message.includes('Maximum call stack')
  );
}

function isRecoverableError(error: Error): boolean {
  return (
    error.name === 'NetworkError' ||
    error.name === 'TimeoutError' ||
    error.message.includes('ECONNREFUSED')
  );
}
```

## 4. レイヤー別の推奨アプローチ

```typescript
// 🔵 プレゼンテーション層：必ずラップ
class UserController {
  async createUser(req: Request): Promise<Response> {
    try {
      const user = await this.userService.create(req.body);
      return { status: 201, data: user };
    } catch (error) {
      // ユーザーに安全なエラーメッセージを返す
      return this.errorHandler.handle(error);
    }
  }
}

// 🟡 ビジネスロジック層：コンテキストによる
class UserService {
  async create(data: unknown): Promise<User> {
    try {
      const validated = await this.validator.validate(data);
      return await this.repository.save(validated);
    } catch (error) {
      if (isValidationError(error) || isBusinessError(error)) {
        throw error;  // 期待されるエラーはそのまま
      }
      
      // 予期しないエラーは詳細をログに記録してラップ
      this.logger.error('Unexpected error in UserService.create', error);
      throw new ServiceError('Failed to create user', error);
    }
  }
}

// 🔴 インフラ層：基本的にリスロー
class UserRepository {
  async save(user: User): Promise<User> {
    try {
      return await this.db.insert(user);
    } catch (error) {
      // データベースエラーは基本的にそのままリスロー
      this.logger.error('Database error', error);
      throw error;
    }
  }
}
```

## 結論

**リスローすべき場合**：
- システムクリティカルなエラー（メモリ不足、スタックオーバーフロー）
- データ整合性に関わるエラー
- インフラ層の致命的エラー
- フレームワークに処理を委ねるべきエラー

**ラップすべき場合**：
- ユーザー向けAPIのエラー
- バッチ処理で継続が必要な場合
- エラーの詳細を隠蔽すべき場合
- 統一的なエラーフォーマットが必要な場合

最も重要なのは、**アプリケーション全体で一貫したエラーハンドリング戦略を持つこと**です。チーム内でガイドラインを共有し、各レイヤーでの責任を明確にすることが大切です。

---
