# Swift Enum to TypeScript Zod Conversion

Date: 2025-06-09

---

## 👤 User
*2025-06-09 14:48:29*

Swiftの連想型enumをtypescriptの zodで表現できるか？

---

## 🤖 Assistant
*2025-06-09 14:48:52*

はい、SwiftのAssociated Values（連想値）を持つenumは、TypeScriptのZodで表現できます。いくつかのアプローチがあります。

## 1. discriminated unionを使う方法

Swiftのenumをdiscriminated unionパターンで表現する方法が最も一般的です：

```typescript
import { z } from 'zod';

// Swiftの例:
// enum Result<T, E> {
//     case success(T)
//     case failure(E)
// }

const ResultSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('success'),
    value: z.string(), // T相当
  }),
  z.object({
    type: z.literal('failure'),
    error: z.string(), // E相当
  }),
]);

type Result = z.infer<typeof ResultSchema>;
```

## 2. より複雑な例

```typescript
// Swiftの例:
// enum PaymentMethod {
//     case creditCard(number: String, cvv: String)
//     case bankTransfer(accountNumber: String, routingNumber: String)
//     case paypal(email: String)
//     case cash
// }

const PaymentMethodSchema = z.discriminatedUnion('method', [
  z.object({
    method: z.literal('creditCard'),
    number: z.string(),
    cvv: z.string(),
  }),
  z.object({
    method: z.literal('bankTransfer'),
    accountNumber: z.string(),
    routingNumber: z.string(),
  }),
  z.object({
    method: z.literal('paypal'),
    email: z.string().email(),
  }),
  z.object({
    method: z.literal('cash'),
  }),
]);

type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
```

## 3. ジェネリックを含む場合

```typescript
// ジェネリックな結果型
function createResultSchema<T extends z.ZodType, E extends z.ZodType>(
  successSchema: T,
  errorSchema: E
) {
  return z.discriminatedUnion('status', [
    z.object({
      status: z.literal('success'),
      data: successSchema,
    }),
    z.object({
      status: z.literal('error'),
      error: errorSchema,
    }),
  ]);
}

// 使用例
const UserResultSchema = createResultSchema(
  z.object({ id: z.string(), name: z.string() }),
  z.object({ code: z.number(), message: z.string() })
);
```

## 4. タプルスタイルの連想値

```typescript
// Swiftの例:
// enum Event {
//     case click(x: Int, y: Int)
//     case keyPress(Character)
// }

const EventSchema = z.union([
  z.object({
    type: z.literal('click'),
    payload: z.tuple([z.number(), z.number()]), // [x, y]
  }),
  z.object({
    type: z.literal('keyPress'),
    payload: z.string().length(1), // Character
  }),
]);
```

## 使用例とバリデーション

```typescript
// パース例
const payment = PaymentMethodSchema.parse({
  method: 'creditCard',
  number: '1234-5678-9012-3456',
  cvv: '123',
});

// 型安全なパターンマッチング風の処理
function processPayment(payment: PaymentMethod): string {
  switch (payment.method) {
    case 'creditCard':
      return `Credit card ending in ${payment.number.slice(-4)}`;
    case 'bankTransfer':
      return `Bank transfer to ${payment.accountNumber}`;
    case 'paypal':
      return `PayPal payment to ${payment.email}`;
    case 'cash':
      return 'Cash payment';
  }
}
```

Zodのdiscriminated unionやunionを使うことで、Swiftの連想型enumとほぼ同等の型安全性とバリデーション機能を実現できます。discriminatorフィールド（上記の例では`type`や`method`）を使うことで、TypeScriptの型推論も効果的に機能します。

---

## 👤 User
*2025-06-09 14:49:53*

2番の例だ
使い方やアクセスの仕方を教えてほしい

---

## 🤖 Assistant
*2025-06-09 14:50:40*

2番の`PaymentMethod`の例について、具体的な使い方とアクセス方法を詳しく説明します。

## 1. 基本的な使い方

```typescript
import { z } from 'zod';

// スキーマ定義（先ほどの例）
const PaymentMethodSchema = z.discriminatedUnion('method', [
  z.object({
    method: z.literal('creditCard'),
    number: z.string(),
    cvv: z.string(),
  }),
  z.object({
    method: z.literal('bankTransfer'),
    accountNumber: z.string(),
    routingNumber: z.string(),
  }),
  z.object({
    method: z.literal('paypal'),
    email: z.string().email(),
  }),
  z.object({
    method: z.literal('cash'),
  }),
]);

type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
```

## 2. オブジェクトの作成とバリデーション

```typescript
// 正しいデータの例
const creditCardPayment = PaymentMethodSchema.parse({
  method: 'creditCard',
  number: '1234-5678-9012-3456',
  cvv: '123',
});

const bankTransferPayment = PaymentMethodSchema.parse({
  method: 'bankTransfer',
  accountNumber: '123456789',
  routingNumber: '987654321',
});

const paypalPayment = PaymentMethodSchema.parse({
  method: 'paypal',
  email: 'user@example.com',
});

const cashPayment = PaymentMethodSchema.parse({
  method: 'cash',
});

// エラーになる例
try {
  const invalidPayment = PaymentMethodSchema.parse({
    method: 'creditCard',
    // numberとcvvが不足
  });
} catch (error) {
  console.error('Validation error:', error);
}
```

## 3. 型安全なアクセスとパターンマッチング

```typescript
function processPayment(payment: PaymentMethod): void {
  // switchで分岐
  switch (payment.method) {
    case 'creditCard':
      // TypeScriptがpaymentの型を自動的に絞り込む
      console.log(`クレジットカード番号: ${payment.number}`);
      console.log(`CVV: ${payment.cvv}`);
      // payment.accountNumber はここではアクセスできない（型エラー）
      break;
      
    case 'bankTransfer':
      console.log(`口座番号: ${payment.accountNumber}`);
      console.log(`ルーティング番号: ${payment.routingNumber}`);
      break;
      
    case 'paypal':
      console.log(`PayPalメール: ${payment.email}`);
      break;
      
    case 'cash':
      console.log('現金支払い');
      // cashには追加のプロパティがない
      break;
  }
}
```

## 4. 条件分岐による型ガード

```typescript
function getPaymentDescription(payment: PaymentMethod): string {
  if (payment.method === 'creditCard') {
    // この条件ブロック内では、paymentは自動的にcreditCard型として推論される
    return `カード番号 ${payment.number.slice(-4)} で支払い`;
  }
  
  if (payment.method === 'bankTransfer') {
    return `口座 ${payment.accountNumber} から振込`;
  }
  
  if (payment.method === 'paypal') {
    return `PayPal (${payment.email})`;
  }
  
  // payment.method === 'cash'
  return '現金払い';
}
```

## 5. 実用的な例

```typescript
// APIレスポンスの処理
async function handlePaymentRequest(requestData: unknown) {
  try {
    // 未知のデータをバリデーション
    const payment = PaymentMethodSchema.parse(requestData);
    
    // 支払い方法ごとの処理
    switch (payment.method) {
      case 'creditCard':
        await processCreditCard(payment.number, payment.cvv);
        break;
        
      case 'bankTransfer':
        await processBankTransfer(
          payment.accountNumber, 
          payment.routingNumber
        );
        break;
        
      case 'paypal':
        await processPayPal(payment.email);
        break;
        
      case 'cash':
        await recordCashPayment();
        break;
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Invalid payment data:', error.errors);
    }
    throw error;
  }
}
```

## 6. ヘルパー関数の作成

```typescript
// 型ガード関数
function isCreditCard(payment: PaymentMethod): payment is Extract<PaymentMethod, { method: 'creditCard' }> {
  return payment.method === 'creditCard';
}

// 使用例
function validateCVV(payment: PaymentMethod): boolean {
  if (isCreditCard(payment)) {
    // paymentは確実にcreditCard型
    return payment.cvv.length === 3 || payment.cvv.length === 4;
  }
  return true; // 他の支払い方法ではCVVチェック不要
}

// 各支払い方法の作成ヘルパー
const createCreditCardPayment = (number: string, cvv: string): PaymentMethod => ({
  method: 'creditCard',
  number,
  cvv,
});

const createBankTransferPayment = (
  accountNumber: string, 
  routingNumber: string
): PaymentMethod => ({
  method: 'bankTransfer',
  accountNumber,
  routingNumber,
});
```

## 7. Reactコンポーネントでの使用例

```typescript
function PaymentMethodDisplay({ payment }: { payment: PaymentMethod }) {
  switch (payment.method) {
    case 'creditCard':
      return (
        <div>
          <p>クレジットカード</p>
          <p>番号: **** {payment.number.slice(-4)}</p>
        </div>
      );
      
    case 'bankTransfer':
      return (
        <div>
          <p>銀行振込</p>
          <p>口座番号: {payment.accountNumber}</p>
        </div>
      );
      
    case 'paypal':
      return (
        <div>
          <p>PayPal</p>
          <p>メール: {payment.email}</p>
        </div>
      );
      
    case 'cash':
      return <p>現金払い</p>;
  }
}
```

discriminated unionの利点は、`method`フィールドの値によってTypeScriptが自動的に型を絞り込んでくれることです。これにより、各ケースで利用可能なプロパティに対して完全な型安全性が保証されます。

---

## 👤 User
*2025-06-09 14:52:34*

そもそもこの4つのパターンしかないことをenumで定義できないのか

---

## 🤖 Assistant
*2025-06-09 14:53:04*

はい、できます！enumを使って4つのパターンを定義してからZodスキーマに組み込む方法があります。これにより、より型安全で保守しやすいコードになります。

## 1. enumを使った定義

```typescript
import { z } from 'zod';

// まずenumで支払い方法を定義
enum PaymentMethodType {
  CreditCard = 'creditCard',
  BankTransfer = 'bankTransfer',
  PayPal = 'paypal',
  Cash = 'cash',
}

// enumを使ったZodスキーマ
const PaymentMethodSchema = z.discriminatedUnion('method', [
  z.object({
    method: z.literal(PaymentMethodType.CreditCard),
    number: z.string(),
    cvv: z.string(),
  }),
  z.object({
    method: z.literal(PaymentMethodType.BankTransfer),
    accountNumber: z.string(),
    routingNumber: z.string(),
  }),
  z.object({
    method: z.literal(PaymentMethodType.PayPal),
    email: z.string().email(),
  }),
  z.object({
    method: z.literal(PaymentMethodType.Cash),
  }),
]);

type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
```

## 2. z.nativeEnum()を使った方法

```typescript
// z.nativeEnum()を使ってenumを直接Zodスキーマに変換
const PaymentMethodTypeSchema = z.nativeEnum(PaymentMethodType);

// これにより、以下のような使い方ができる
const methodType = PaymentMethodTypeSchema.parse('creditCard'); // OK
// const invalid = PaymentMethodTypeSchema.parse('invalid'); // エラー
```

## 3. より実用的な構造

```typescript
// 各支払い方法のデータを個別に定義
const CreditCardSchema = z.object({
  method: z.literal(PaymentMethodType.CreditCard),
  number: z.string(),
  cvv: z.string(),
});

const BankTransferSchema = z.object({
  method: z.literal(PaymentMethodType.BankTransfer),
  accountNumber: z.string(),
  routingNumber: z.string(),
});

const PayPalSchema = z.object({
  method: z.literal(PaymentMethodType.PayPal),
  email: z.string().email(),
});

const CashSchema = z.object({
  method: z.literal(PaymentMethodType.Cash),
});

// 統合
const PaymentMethodSchema = z.discriminatedUnion('method', [
  CreditCardSchema,
  BankTransferSchema,
  PayPalSchema,
  CashSchema,
]);
```

## 4. enumを使った型安全な処理

```typescript
function processPayment(payment: PaymentMethod): void {
  switch (payment.method) {
    case PaymentMethodType.CreditCard:
      console.log(`Credit card: ${payment.number}`);
      break;
      
    case PaymentMethodType.BankTransfer:
      console.log(`Bank transfer: ${payment.accountNumber}`);
      break;
      
    case PaymentMethodType.PayPal:
      console.log(`PayPal: ${payment.email}`);
      break;
      
    case PaymentMethodType.Cash:
      console.log('Cash payment');
      break;
      
    // enumを使うことで、全てのケースを網羅しているかチェックできる
    default:
      const _exhaustive: never = payment;
      throw new Error(`Unhandled payment method: ${_exhaustive}`);
  }
}
```

## 5. const assertionを使った別の方法

```typescript
// enumの代わりにconst assertionを使うこともできる
const PAYMENT_METHODS = {
  CREDIT_CARD: 'creditCard',
  BANK_TRANSFER: 'bankTransfer',
  PAYPAL: 'paypal',
  CASH: 'cash',
} as const;

type PaymentMethodType = typeof PAYMENT_METHODS[keyof typeof PAYMENT_METHODS];

// Zodでの使用
const PaymentMethodSchema = z.discriminatedUnion('method', [
  z.object({
    method: z.literal(PAYMENT_METHODS.CREDIT_CARD),
    number: z.string(),
    cvv: z.string(),
  }),
  z.object({
    method: z.literal(PAYMENT_METHODS.BANK_TRANSFER),
    accountNumber: z.string(),
    routingNumber: z.string(),
  }),
  z.object({
    method: z.literal(PAYMENT_METHODS.PAYPAL),
    email: z.string().email(),
  }),
  z.object({
    method: z.literal(PAYMENT_METHODS.CASH),
  }),
]);
```

## 6. ヘルパー関数とユーティリティ

```typescript
// 使用可能な支払い方法の一覧を取得
function getAvailablePaymentMethods(): PaymentMethodType[] {
  return Object.values(PaymentMethodType);
}

// 支払い方法の表示名を取得
function getPaymentMethodDisplayName(method: PaymentMethodType): string {
  const displayNames: Record<PaymentMethodType, string> = {
    [PaymentMethodType.CreditCard]: 'クレジットカード',
    [PaymentMethodType.BankTransfer]: '銀行振込',
    [PaymentMethodType.PayPal]: 'PayPal',
    [PaymentMethodType.Cash]: '現金',
  };
  return displayNames[method];
}

// 使用例
const methods = getAvailablePaymentMethods();
console.log(methods); // ['creditCard', 'bankTransfer', 'paypal', 'cash']

const displayName = getPaymentMethodDisplayName(PaymentMethodType.CreditCard);
console.log(displayName); // 'クレジットカード'
```

## 7. フォームでの使用例

```tsx
function PaymentMethodSelect() {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>(
    PaymentMethodType.CreditCard
  );

  return (
    <select 
      value={selectedMethod} 
      onChange={(e) => setSelectedMethod(e.target.value as PaymentMethodType)}
    >
      {Object.values(PaymentMethodType).map((method) => (
        <option key={method} value={method}>
          {getPaymentMethodDisplayName(method)}
        </option>
      ))}
    </select>
  );
}
```

enumを使うことで以下の利点があります：
- 支払い方法の種類が一箇所で管理される
- IDEの自動補完が効く
- タイポを防げる
- リファクタリングが容易
- 全ケースの網羅性チェックができる

---

## 👤 User
*2025-06-09 14:54:03*

こうするのは一般的か？

---

## 🤖 Assistant
*2025-06-09 14:54:37*

はい、このアプローチは**一般的で推奨されるパターン**です。ただし、状況によって使い分けがあります。

## 一般的に使われるケース

### 1. **大規模なアプリケーション**
```typescript
// 支払い方法が複数の場所で参照される場合
enum PaymentMethodType {
  CreditCard = 'creditCard',
  BankTransfer = 'bankTransfer',
  // ...
}

// API、UI、ビジネスロジックなど複数の層で再利用
```

### 2. **チーム開発**
```typescript
// チーム全体で共有する定数として
// src/constants/payment.ts
export enum PaymentMethodType {
  CreditCard = 'creditCard',
  BankTransfer = 'bankTransfer',
  PayPal = 'paypal',
  Cash = 'cash',
}

// 他のファイルでインポートして使用
import { PaymentMethodType } from '@/constants/payment';
```

## よく見る代替パターン

### 1. **const assertionパターン（最も人気）**
```typescript
// enumよりもこちらの方が最近は人気
const PaymentMethod = {
  CreditCard: 'creditCard',
  BankTransfer: 'bankTransfer',
  PayPal: 'paypal',
  Cash: 'cash',
} as const;

type PaymentMethodType = typeof PaymentMethod[keyof typeof PaymentMethod];
```

### 2. **Union Type直接定義（シンプルな場合）**
```typescript
// 小規模なプロジェクトではこれで十分なことも
type PaymentMethodType = 'creditCard' | 'bankTransfer' | 'paypal' | 'cash';

const PaymentMethodSchema = z.discriminatedUnion('method', [
  z.object({
    method: z.literal('creditCard'),
    // ...
  }),
  // ...
]);
```

### 3. **Zodから型を生成（Zod中心の開発）**
```typescript
// Zodスキーマを先に定義して、そこから型を抽出
const PaymentMethodSchema = z.discriminatedUnion('method', [
  z.object({ method: z.literal('creditCard'), number: z.string(), cvv: z.string() }),
  z.object({ method: z.literal('bankTransfer'), accountNumber: z.string(), routingNumber: z.string() }),
  z.object({ method: z.literal('paypal'), email: z.string().email() }),
  z.object({ method: z.literal('cash') }),
]);

type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
type PaymentMethodType = PaymentMethod['method']; // 'creditCard' | 'bankTransfer' | ...
```

## 実際のプロジェクトでの選択基準

### enumを使うべき場合：
- ✅ 値が多くの場所で参照される
- ✅ IDEの自動補完を最大限活用したい
- ✅ JavaやC#などから来た開発者が多い
- ✅ 数値enumが必要（例：`enum Status { Active = 1, Inactive = 0 }`）

### const assertionを使うべき場合：
- ✅ よりJavaScript的なコードを書きたい
- ✅ Tree-shakingを意識している
- ✅ enumの奇妙な動作を避けたい
- ✅ 最新のTypeScriptベストプラクティスに従いたい

### 直接Union Typeを使うべき場合：
- ✅ 値が2-3個程度で単純
- ✅ 一箇所でしか使わない
- ✅ プロトタイピング段階

## 実際のコード例

```typescript
// 現代的なアプローチ（const assertion + Zod）
const PAYMENT_METHODS = {
  CREDIT_CARD: 'creditCard',
  BANK_TRANSFER: 'bankTransfer',
  PAYPAL: 'paypal',
  CASH: 'cash',
} as const;

// Zodスキーマ生成を自動化
const createPaymentSchema = <T extends string>(method: T) => {
  const schemas = {
    creditCard: z.object({
      method: z.literal(method),
      number: z.string(),
      cvv: z.string(),
    }),
    bankTransfer: z.object({
      method: z.literal(method),
      accountNumber: z.string(),
      routingNumber: z.string(),
    }),
    paypal: z.object({
      method: z.literal(method),
      email: z.string().email(),
    }),
    cash: z.object({
      method: z.literal(method),
    }),
  };
  
  return schemas[method as keyof typeof schemas] || schemas.cash;
};

// 使用
const PaymentMethodSchema = z.discriminatedUnion('method', 
  Object.values(PAYMENT_METHODS).map(createPaymentSchema)
);
```

**結論**: enumやconst assertionを使って値を一元管理するのは**一般的で良いプラクティス**です。特に中〜大規模プロジェクトでは必須と言えます。ただし、最近のトレンドとしてはenumよりもconst assertionが好まれる傾向にあります。

---

## 👤 User
*2025-06-09 14:56:10*

zodではnative enumが良いと聞いてるが実際にはどうだろうか？

---

## 🤖 Assistant
*2025-06-09 14:56:46*

`z.nativeEnum()`についての実際の使用感をお伝えします。確かにZodのドキュメントでは推奨されていますが、実際には**ケースバイケース**です。

## z.nativeEnum()の利点と欠点

### ✅ 利点
```typescript
enum PaymentMethodType {
  CreditCard = 'creditCard',
  BankTransfer = 'bankTransfer',
  PayPal = 'paypal',
  Cash = 'cash',
}

// シンプルに書ける
const PaymentMethodTypeSchema = z.nativeEnum(PaymentMethodType);

// 型安全性が保たれる
type Method = z.infer<typeof PaymentMethodTypeSchema>; // PaymentMethodType
```

### ❌ 欠点
```typescript
// 1. 数値enumでの予期しない動作
enum NumericStatus {
  Active = 1,
  Inactive = 0,
}

const schema = z.nativeEnum(NumericStatus);
schema.parse(1); // OK
schema.parse("1"); // エラー！文字列は受け付けない
```

## 実際のプロジェクトでの使い分け

### 1. **z.nativeEnum()が適している場合**
```typescript
// シンプルな文字列enumで、他に付随データがない場合
enum UserRole {
  Admin = 'admin',
  User = 'user',
  Guest = 'guest',
}

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.nativeEnum(UserRole), // ← これはOK
});
```

### 2. **discriminated unionの方が適している場合**
```typescript
// 各タイプに付随データがある場合（元の質問のケース）
enum PaymentMethodType {
  CreditCard = 'creditCard',
  BankTransfer = 'bankTransfer',
  PayPal = 'paypal',
  Cash = 'cash',
}

// これは不可能
// const schema = z.nativeEnum(PaymentMethodType).and(???) 

// discriminated unionが必要
const PaymentMethodSchema = z.discriminatedUnion('method', [
  z.object({
    method: z.literal(PaymentMethodType.CreditCard),
    number: z.string(),
    cvv: z.string(),
  }),
  // ...
]);
```

## 実践的な組み合わせパターン

### パターン1: enumとdiscriminated unionの併用
```typescript
enum PaymentMethodType {
  CreditCard = 'creditCard',
  BankTransfer = 'bankTransfer',
  PayPal = 'paypal',
  Cash = 'cash',
}

// enumの値を検証するスキーマ
const PaymentMethodTypeSchema = z.nativeEnum(PaymentMethodType);

// 完全なスキーマ
const PaymentMethodSchema = z.discriminatedUnion('method', [
  z.object({
    method: z.literal(PaymentMethodType.CreditCard),
    number: z.string(),
    cvv: z.string(),
  }),
  z.object({
    method: z.literal(PaymentMethodType.BankTransfer),
    accountNumber: z.string(),
    routingNumber: z.string(),
  }),
  // ...
]);

// 使用例：methodフィールドだけを検証
const methodOnly = PaymentMethodTypeSchema.parse('creditCard'); // OK
```

### パターン2: const + z.enum()の組み合わせ（現代的）
```typescript
// enumの代わりにconst配列
const PAYMENT_METHODS = ['creditCard', 'bankTransfer', 'paypal', 'cash'] as const;

// z.enum()を使用（z.nativeEnum()ではない）
const PaymentMethodTypeSchema = z.enum(PAYMENT_METHODS);

type PaymentMethodType = z.infer<typeof PaymentMethodTypeSchema>;

// discriminated unionと組み合わせ
const PaymentMethodSchema = z.discriminatedUnion('method', [
  z.object({
    method: z.literal('creditCard'),
    number: z.string(),
    cvv: z.string(),
  }),
  // ...
]);
```

## APIレスポンスでの実例

```typescript
// バックエンドから来るデータの検証
enum OrderStatus {
  Pending = 'pending',
  Processing = 'processing',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

// シンプルなenumフィールドにはz.nativeEnum()が便利
const OrderSchema = z.object({
  id: z.string(),
  status: z.nativeEnum(OrderStatus), // ← これは良い使い方
  amount: z.number(),
  createdAt: z.string().datetime(),
});

// でも支払い方法のような複雑な構造には向かない
const OrderWithPaymentSchema = z.object({
  id: z.string(),
  status: z.nativeEnum(OrderStatus),
  // payment: z.nativeEnum(PaymentMethodType), // ← これでは不十分
  payment: PaymentMethodSchema, // ← discriminated unionが必要
});
```

## 推奨される使い分け

```typescript
// ✅ z.nativeEnum()を使う：単純な列挙値
enum Priority { Low = 'low', Medium = 'medium', High = 'high' }
const prioritySchema = z.nativeEnum(Priority);

// ✅ z.enum()を使う：const assertionと組み合わせ
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
const sizeSchema = z.enum(SIZES);

// ✅ discriminated unionを使う：付随データがある場合
const PaymentMethodSchema = z.discriminatedUnion('method', [
  z.object({ method: z.literal('creditCard'), number: z.string(), cvv: z.string() }),
  // ...
]);

// ✅ 組み合わせて使う：複雑なビジネスロジック
enum EntityType { User = 'user', Company = 'company' }
const EntityTypeSchema = z.nativeEnum(EntityType);

const EntitySchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal(EntityType.User),
    firstName: z.string(),
    lastName: z.string(),
  }),
  z.object({
    type: z.literal(EntityType.Company),
    companyName: z.string(),
    taxId: z.string(),
  }),
]);
```

**結論**: `z.nativeEnum()`は単純な列挙値には良いですが、Swiftの連想型enumのような複雑な構造にはdiscriminated unionの方が適しています。両方を適材適所で使い分けるのがベストプラクティスです。

---

## 👤 User
*2025-06-09 14:58:03*

エラータイプとエラー文言とその文言のパラメーターを管理したいと思っているんだ

どのパターンが安全なのか

---

## 🤖 Assistant
*2025-06-09 14:58:54*

エラータイプ、エラー文言、パラメーターを型安全に管理する方法をいくつか紹介します。これはSwiftの連想型enumの典型的なユースケースですね。

## 1. 基本的なdiscriminated unionパターン

```typescript
import { z } from 'zod';

// エラータイプの定義
const ErrorSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('validation'),
    field: z.string(),
    message: z.literal('FIELD_REQUIRED'),
  }),
  z.object({
    type: z.literal('auth'),
    message: z.literal('INVALID_CREDENTIALS'),
  }),
  z.object({
    type: z.literal('rateLimit'),
    message: z.literal('RATE_LIMIT_EXCEEDED'),
    retryAfter: z.number(), // 秒数
  }),
  z.object({
    type: z.literal('notFound'),
    message: z.literal('RESOURCE_NOT_FOUND'),
    resource: z.string(),
    id: z.string(),
  }),
]);

type AppError = z.infer<typeof ErrorSchema>;

// エラーメッセージを生成する関数
function getErrorMessage(error: AppError): string {
  switch (error.type) {
    case 'validation':
      return `${error.field}は必須項目です`;
    case 'auth':
      return '認証情報が無効です';
    case 'rateLimit':
      return `リクエスト制限に達しました。${error.retryAfter}秒後に再試行してください`;
    case 'notFound':
      return `${error.resource} (ID: ${error.id}) が見つかりません`;
  }
}
```

## 2. より構造化されたパターン（推奨）

```typescript
// エラーコードの定義
const ErrorCode = {
  // Validation errors
  FIELD_REQUIRED: 'FIELD_REQUIRED',
  FIELD_INVALID: 'FIELD_INVALID',
  FIELD_TOO_LONG: 'FIELD_TOO_LONG',
  
  // Auth errors
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  
  // Resource errors
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS: 'RESOURCE_ALREADY_EXISTS',
  
  // Rate limiting
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
} as const;

type ErrorCode = typeof ErrorCode[keyof typeof ErrorCode];

// エラーの型定義
const AppErrorSchema = z.discriminatedUnion('code', [
  // Validation errors
  z.object({
    code: z.literal(ErrorCode.FIELD_REQUIRED),
    field: z.string(),
  }),
  z.object({
    code: z.literal(ErrorCode.FIELD_INVALID),
    field: z.string(),
    value: z.unknown(),
  }),
  z.object({
    code: z.literal(ErrorCode.FIELD_TOO_LONG),
    field: z.string(),
    maxLength: z.number(),
    actualLength: z.number(),
  }),
  
  // Auth errors
  z.object({
    code: z.literal(ErrorCode.INVALID_CREDENTIALS),
  }),
  z.object({
    code: z.literal(ErrorCode.TOKEN_EXPIRED),
    expiredAt: z.string().datetime(),
  }),
  z.object({
    code: z.literal(ErrorCode.INSUFFICIENT_PERMISSIONS),
    requiredPermission: z.string(),
  }),
  
  // Resource errors
  z.object({
    code: z.literal(ErrorCode.RESOURCE_NOT_FOUND),
    resourceType: z.string(),
    resourceId: z.string(),
  }),
  z.object({
    code: z.literal(ErrorCode.RESOURCE_ALREADY_EXISTS),
    resourceType: z.string(),
    conflictingId: z.string(),
  }),
  
  // Rate limiting
  z.object({
    code: z.literal(ErrorCode.RATE_LIMIT_EXCEEDED),
    retryAfter: z.number(),
    limit: z.number(),
  }),
]);

type AppError = z.infer<typeof AppErrorSchema>;

// メッセージテンプレート
const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.FIELD_REQUIRED]: '{field}は必須項目です',
  [ErrorCode.FIELD_INVALID]: '{field}の値が無効です',
  [ErrorCode.FIELD_TOO_LONG]: '{field}が長すぎます（最大{maxLength}文字、現在{actualLength}文字）',
  [ErrorCode.INVALID_CREDENTIALS]: 'メールアドレスまたはパスワードが正しくありません',
  [ErrorCode.TOKEN_EXPIRED]: 'セッションの有効期限が切れました（{expiredAt}に期限切れ）',
  [ErrorCode.INSUFFICIENT_PERMISSIONS]: '{requiredPermission}の権限が必要です',
  [ErrorCode.RESOURCE_NOT_FOUND]: '{resourceType}（ID: {resourceId}）が見つかりません',
  [ErrorCode.RESOURCE_ALREADY_EXISTS]: '{resourceType}（ID: {conflictingId}）は既に存在します',
  [ErrorCode.RATE_LIMIT_EXCEEDED]: 'リクエスト制限に達しました（制限: {limit}回、{retryAfter}秒後に再試行）',
};

// エラーメッセージを生成する関数
function formatErrorMessage(error: AppError): string {
  const template = ERROR_MESSAGES[error.code];
  
  // テンプレート内の{param}を実際の値に置換
  return template.replace(/{(\w+)}/g, (match, key) => {
    const value = (error as any)[key];
    return value !== undefined ? String(value) : match;
  });
}
```

## 3. クラスベースのアプローチ（より高度）

```typescript
// エラーファクトリークラス
class AppError<T extends z.ZodType> {
  constructor(
    public readonly schema: T,
    public readonly template: string
  ) {}
  
  create(params: z.infer<T>): ErrorInstance<T> {
    return new ErrorInstance(this.schema.parse(params), this.template);
  }
}

class ErrorInstance<T extends z.ZodType> {
  constructor(
    public readonly data: z.infer<T>,
    private readonly template: string
  ) {}
  
  get message(): string {
    return this.template.replace(/{(\w+)}/g, (match, key) => {
      const value = (this.data as any)[key];
      return value !== undefined ? String(value) : match;
    });
  }
  
  toJSON() {
    return {
      ...this.data,
      message: this.message,
    };
  }
}

// エラー定義
const Errors = {
  fieldRequired: new AppError(
    z.object({
      code: z.literal('FIELD_REQUIRED'),
      field: z.string(),
    }),
    '{field}は必須項目です'
  ),
  
  fieldTooLong: new AppError(
    z.object({
      code: z.literal('FIELD_TOO_LONG'),
      field: z.string(),
      maxLength: z.number(),
      actualLength: z.number(),
    }),
    '{field}が長すぎます（最大{maxLength}文字、現在{actualLength}文字）'
  ),
  
  resourceNotFound: new AppError(
    z.object({
      code: z.literal('RESOURCE_NOT_FOUND'),
      resourceType: z.string(),
      resourceId: z.string(),
    }),
    '{resourceType}（ID: {resourceId}）が見つかりません'
  ),
};

// 使用例
const error1 = Errors.fieldRequired.create({ 
  code: 'FIELD_REQUIRED', 
  field: 'email' 
});
console.log(error1.message); // "emailは必須項目です"

const error2 = Errors.fieldTooLong.create({
  code: 'FIELD_TOO_LONG',
  field: 'username',
  maxLength: 20,
  actualLength: 25,
});
console.log(error2.message); // "usernameが長すぎます（最大20文字、現在25文字）"
```

## 4. 多言語対応版

```typescript
type Language = 'ja' | 'en';

const ERROR_MESSAGES: Record<Language, Record<ErrorCode, string>> = {
  ja: {
    [ErrorCode.FIELD_REQUIRED]: '{field}は必須項目です',
    [ErrorCode.RESOURCE_NOT_FOUND]: '{resourceType}（ID: {resourceId}）が見つかりません',
    // ...
  },
  en: {
    [ErrorCode.FIELD_REQUIRED]: '{field} is required',
    [ErrorCode.RESOURCE_NOT_FOUND]: '{resourceType} with ID {resourceId} not found',
    // ...
  },
};

function formatErrorMessage(error: AppError, lang: Language = 'ja'): string {
  const template = ERROR_MESSAGES[lang][error.code];
  return template.replace(/{(\w+)}/g, (match, key) => {
    const value = (error as any)[key];
    return value !== undefined ? String(value) : match;
  });
}
```

## 5. 実際の使用例（API統合）

```typescript
// APIレスポンスの型
interface ApiErrorResponse {
  error: AppError;
  timestamp: string;
  requestId: string;
}

// エラーハンドリング
async function handleApiRequest<T>(
  request: () => Promise<T>
): Promise<{ data?: T; error?: ApiErrorResponse }> {
  try {
    const data = await request();
    return { data };
  } catch (e) {
    if (e instanceof Error) {
      // バリデーションエラーの例
      const error = AppErrorSchema.parse({
        code: ErrorCode.FIELD_REQUIRED,
        field: 'email',
      });
      
      return {
        error: {
          error,
          timestamp: new Date().toISOString(),
          requestId: crypto.randomUUID(),
        },
      };
    }
    throw e;
  }
}

// Reactでの表示
function ErrorDisplay({ error }: { error: AppError }) {
  const message = formatErrorMessage(error);
  
  return (
    <div className="error-message">
      <p>{message}</p>
      {error.code === ErrorCode.RATE_LIMIT_EXCEEDED && (
        <p>再試行まで: {error.retryAfter}秒</p>
      )}
    </div>
  );
}
```

## 推奨パターン

**パターン2（構造化されたパターン）**が最もバランスが良く、以下の理由で推奨されます：

1. **型安全性**: エラーコードとパラメーターの組み合わせが保証される
2. **保守性**: エラーメッセージが一箇所で管理される
3. **拡張性**: 新しいエラータイプの追加が容易
4. **IDE支援**: 自動補完が効く
5. **実行時検証**: Zodによるバリデーション

このパターンは、Swiftの連想型enumに最も近い型安全性を提供しつつ、TypeScript/JavaScriptのエコシステムに適合しています。

---

## 👤 User
*2025-06-09 15:01:28*

codeのタイポの可能性はないのか？

---

## 🤖 Assistant
*2025-06-09 15:02:17*

良い指摘です！確かに`code`のタイポの可能性があります。より型安全な方法をいくつか紹介します。

## 1. 型から自動的にcodeを導出する方法（最も安全）

```typescript
import { z } from 'zod';

// まず各エラーの構造を定義（codeなし）
const ErrorSchemas = {
  FIELD_REQUIRED: z.object({
    field: z.string(),
  }),
  FIELD_INVALID: z.object({
    field: z.string(),
    value: z.unknown(),
  }),
  FIELD_TOO_LONG: z.object({
    field: z.string(),
    maxLength: z.number(),
    actualLength: z.number(),
  }),
  RESOURCE_NOT_FOUND: z.object({
    resourceType: z.string(),
    resourceId: z.string(),
  }),
  RATE_LIMIT_EXCEEDED: z.object({
    retryAfter: z.number(),
    limit: z.number(),
  }),
} as const;

// codeを自動的に追加する型
type ErrorWithCode<K extends keyof typeof ErrorSchemas> = z.infer<typeof ErrorSchemas[K]> & {
  code: K;
};

// Union型を生成
type AppError = {
  [K in keyof typeof ErrorSchemas]: ErrorWithCode<K>;
}[keyof typeof ErrorSchemas];

// エラー作成のヘルパー関数（タイポ不可能）
function createError<K extends keyof typeof ErrorSchemas>(
  code: K,
  params: z.infer<typeof ErrorSchemas[K]>
): ErrorWithCode<K> {
  const validated = ErrorSchemas[code].parse(params);
  return {
    ...validated,
    code,
  } as ErrorWithCode<K>;
}

// 使用例
const error1 = createError('FIELD_REQUIRED', { field: 'email' });
// error1.code は自動的に 'FIELD_REQUIRED' になる

const error2 = createError('FIELD_TOO_LONG', {
  field: 'username',
  maxLength: 20,
  actualLength: 25,
});

// タイポは不可能 - TypeScriptがエラーを出す
// const error3 = createError('FIELD_REQUIREDD', { field: 'email' }); // エラー！
```

## 2. クラスベースの型安全なアプローチ

```typescript
// エラークラスの基底
abstract class BaseError<T extends string, P> {
  abstract readonly code: T;
  constructor(public readonly params: P) {}
  
  toJSON() {
    return {
      code: this.code,
      ...this.params,
    };
  }
}

// 各エラーの実装
class FieldRequiredError extends BaseError<'FIELD_REQUIRED', { field: string }> {
  readonly code = 'FIELD_REQUIRED' as const;
}

class FieldTooLongError extends BaseError<'FIELD_TOO_LONG', {
  field: string;
  maxLength: number;
  actualLength: number;
}> {
  readonly code = 'FIELD_TOO_LONG' as const;
}

class ResourceNotFoundError extends BaseError<'RESOURCE_NOT_FOUND', {
  resourceType: string;
  resourceId: string;
}> {
  readonly code = 'RESOURCE_NOT_FOUND' as const;
}

// Union型
type AppError = FieldRequiredError | FieldTooLongError | ResourceNotFoundError;

// 使用例（codeは自動的に設定される）
const error1 = new FieldRequiredError({ field: 'email' });
console.log(error1.code); // 'FIELD_REQUIRED' - タイポ不可能

// メッセージマッピング
const ERROR_MESSAGES: { [K in AppError['code']]: string } = {
  FIELD_REQUIRED: '{field}は必須項目です',
  FIELD_TOO_LONG: '{field}が長すぎます（最大{maxLength}文字）',
  RESOURCE_NOT_FOUND: '{resourceType}（ID: {resourceId}）が見つかりません',
};
```

## 3. ファクトリーパターンで完全に型安全に

```typescript
// エラー定義の型
interface ErrorDefinition<TCode extends string, TParams> {
  code: TCode;
  schema: z.ZodType<TParams>;
  message: string;
}

// エラー定義を作成するヘルパー
function defineError<TCode extends string, TParams>(
  code: TCode,
  schema: z.ZodType<TParams>,
  message: string
): ErrorDefinition<TCode, TParams> {
  return { code, schema, message };
}

// エラー定義
const ErrorDefinitions = {
  FIELD_REQUIRED: defineError(
    'FIELD_REQUIRED',
    z.object({ field: z.string() }),
    '{field}は必須項目です'
  ),
  FIELD_TOO_LONG: defineError(
    'FIELD_TOO_LONG',
    z.object({
      field: z.string(),
      maxLength: z.number(),
      actualLength: z.number(),
    }),
    '{field}が長すぎます（最大{maxLength}文字、現在{actualLength}文字）'
  ),
  RESOURCE_NOT_FOUND: defineError(
    'RESOURCE_NOT_FOUND',
    z.object({
      resourceType: z.string(),
      resourceId: z.string(),
    }),
    '{resourceType}（ID: {resourceId}）が見つかりません'
  ),
} as const;

// エラーインスタンスの型
type ErrorInstance<K extends keyof typeof ErrorDefinitions> = 
  z.infer<typeof ErrorDefinitions[K]['schema']> & {
    code: K;
    message: string;
  };

// エラーを作成する関数
function createError<K extends keyof typeof ErrorDefinitions>(
  type: K,
  params: z.infer<typeof ErrorDefinitions[K]['schema']>
): ErrorInstance<K> {
  const definition = ErrorDefinitions[type];
  const validated = definition.schema.parse(params);
  
  // メッセージを生成
  const message = definition.message.replace(/{(\w+)}/g, (match, key) => {
    const value = (validated as any)[key];
    return value !== undefined ? String(value) : match;
  });
  
  return {
    ...validated,
    code: type,
    message,
  } as ErrorInstance<K>;
}

// 使用例
const error = createError('FIELD_REQUIRED', { field: 'email' });
// error.code は 'FIELD_REQUIRED' で、タイポは不可能
// error.message は "emailは必須項目です"
```

## 4. Zodスキーマで完結させる方法

```typescript
// codeを含めた完全なスキーマを生成する関数
function createErrorSchema<TCode extends string, TParams extends z.ZodRawShape>(
  code: TCode,
  params: TParams
) {
  return z.object({
    code: z.literal(code),
    ...params,
  });
}

// エラースキーマの定義
const AppErrorSchema = z.discriminatedUnion('code', [
  createErrorSchema('FIELD_REQUIRED', {
    field: z.string(),
  }),
  createErrorSchema('FIELD_TOO_LONG', {
    field: z.string(),
    maxLength: z.number(),
    actualLength: z.number(),
  }),
  createErrorSchema('RESOURCE_NOT_FOUND', {
    resourceType: z.string(),
    resourceId: z.string(),
  }),
]);

type AppError = z.infer<typeof AppErrorSchema>;

// パース時にcodeが自動的に検証される
const error = AppErrorSchema.parse({
  code: 'FIELD_REQUIRED',
  field: 'email',
});
```

## 推奨: シンプルで型安全な方法

```typescript
// エラーコードを定数として定義
const ErrorCode = {
  FIELD_REQUIRED: 'FIELD_REQUIRED',
  FIELD_TOO_LONG: 'FIELD_TOO_LONG',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
} as const;

type ErrorCode = typeof ErrorCode[keyof typeof ErrorCode];

// エラー作成関数（型推論を活用）
const Errors = {
  fieldRequired: (field: string) => ({
    code: ErrorCode.FIELD_REQUIRED,
    field,
  } as const),
  
  fieldTooLong: (field: string, maxLength: number, actualLength: number) => ({
    code: ErrorCode.FIELD_TOO_LONG,
    field,
    maxLength,
    actualLength,
  } as const),
  
  resourceNotFound: (resourceType: string, resourceId: string) => ({
    code: ErrorCode.RESOURCE_NOT_FOUND,
    resourceType,
    resourceId,
  } as const),
} as const;

// 使用例 - codeのタイポは不可能
const error1 = Errors.fieldRequired('email');
const error2 = Errors.fieldTooLong('username', 20, 25);

// Union型
type AppError = ReturnType<typeof Errors[keyof typeof Errors]>;
```

**結論**: 方法1（型から自動的にcodeを導出）か、最後のシンプルな方法が最も実用的です。これらの方法では：
- codeのタイポが構造的に不可能
- IDEの自動補完が完璧に機能
- 新しいエラーの追加が簡単
- 実行時のオーバーヘッドが最小限

---

## 👤 User
*2025-06-09 15:02:48*

ネイティブenumで定義してしまうのはどうだろうか？

---

## 🤖 Assistant
*2025-06-09 15:03:40*

ネイティブenumでエラーコードを定義するアプローチは実際によく使われます。メリット・デメリットと実装例を見てみましょう。

## 1. 基本的なenum + discriminated unionパターン

```typescript
import { z } from 'zod';

// エラーコードをenumで定義
enum ErrorCode {
  // Validation
  FIELD_REQUIRED = 'FIELD_REQUIRED',
  FIELD_INVALID = 'FIELD_INVALID',
  FIELD_TOO_LONG = 'FIELD_TOO_LONG',
  
  // Auth
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  
  // Resource
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS = 'RESOURCE_ALREADY_EXISTS',
  
  // Rate limit
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}

// Zodスキーマでdiscriminated union
const AppErrorSchema = z.discriminatedUnion('code', [
  z.object({
    code: z.literal(ErrorCode.FIELD_REQUIRED),
    field: z.string(),
  }),
  z.object({
    code: z.literal(ErrorCode.FIELD_INVALID),
    field: z.string(),
    value: z.unknown(),
  }),
  z.object({
    code: z.literal(ErrorCode.FIELD_TOO_LONG),
    field: z.string(),
    maxLength: z.number(),
    actualLength: z.number(),
  }),
  z.object({
    code: z.literal(ErrorCode.INVALID_CREDENTIALS),
  }),
  z.object({
    code: z.literal(ErrorCode.TOKEN_EXPIRED),
    expiredAt: z.string().datetime(),
  }),
  z.object({
    code: z.literal(ErrorCode.RESOURCE_NOT_FOUND),
    resourceType: z.string(),
    resourceId: z.string(),
  }),
  z.object({
    code: z.literal(ErrorCode.RATE_LIMIT_EXCEEDED),
    retryAfter: z.number(),
    limit: z.number(),
  }),
]);

type AppError = z.infer<typeof AppErrorSchema>;
```

## 2. enum + ヘルパー関数で型安全に

```typescript
enum ErrorCode {
  FIELD_REQUIRED = 'FIELD_REQUIRED',
  FIELD_TOO_LONG = 'FIELD_TOO_LONG',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}

// エラー作成のヘルパー関数
const createError = {
  fieldRequired: (field: string) => ({
    code: ErrorCode.FIELD_REQUIRED,
    field,
  }),
  
  fieldTooLong: (field: string, maxLength: number, actualLength: number) => ({
    code: ErrorCode.FIELD_TOO_LONG,
    field,
    maxLength,
    actualLength,
  }),
  
  resourceNotFound: (resourceType: string, resourceId: string) => ({
    code: ErrorCode.RESOURCE_NOT_FOUND,
    resourceType,
    resourceId,
  }),
  
  rateLimitExceeded: (retryAfter: number, limit: number) => ({
    code: ErrorCode.RATE_LIMIT_EXCEEDED,
    retryAfter,
    limit,
  }),
} as const;

// 型を導出
type AppError = ReturnType<typeof createError[keyof typeof createError]>;

// 使用例 - enumを使うことでタイポを防げる
const error1 = createError.fieldRequired('email');
const error2 = { code: ErrorCode.FIELD_REQUIRED, field: 'password' }; // 直接作成も可能
```

## 3. enum + メッセージマッピング

```typescript
enum ErrorCode {
  FIELD_REQUIRED = 'FIELD_REQUIRED',
  FIELD_TOO_LONG = 'FIELD_TOO_LONG',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}

// enumの全ての値に対してメッセージを定義（型安全）
const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.FIELD_REQUIRED]: '{field}は必須項目です',
  [ErrorCode.FIELD_TOO_LONG]: '{field}が長すぎます（最大{maxLength}文字）',
  [ErrorCode.RESOURCE_NOT_FOUND]: '{resourceType}（ID: {resourceId}）が見つかりません',
  [ErrorCode.RATE_LIMIT_EXCEEDED]: 'リクエスト制限に達しました（{retryAfter}秒後に再試行）',
};

// メッセージフォーマット関数
function formatErrorMessage(error: AppError): string {
  const template = ERROR_MESSAGES[error.code];
  if (!template) {
    return `Unknown error: ${error.code}`;
  }
  
  return template.replace(/{(\w+)}/g, (match, key) => {
    const value = (error as any)[key];
    return value !== undefined ? String(value) : match;
  });
}
```

## 4. より高度なパターン（enum + 型マッピング）

```typescript
enum ErrorCode {
  FIELD_REQUIRED = 'FIELD_REQUIRED',
  FIELD_TOO_LONG = 'FIELD_TOO_LONG',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}

// 各エラーコードに対応するパラメータの型を定義
interface ErrorParams {
  [ErrorCode.FIELD_REQUIRED]: {
    field: string;
  };
  [ErrorCode.FIELD_TOO_LONG]: {
    field: string;
    maxLength: number;
    actualLength: number;
  };
  [ErrorCode.RESOURCE_NOT_FOUND]: {
    resourceType: string;
    resourceId: string;
  };
  [ErrorCode.RATE_LIMIT_EXCEEDED]: {
    retryAfter: number;
    limit: number;
  };
}

// エラーの型
type AppError<T extends ErrorCode = ErrorCode> = {
  code: T;
} & ErrorParams[T];

// 型安全なエラー作成関数
function createError<T extends ErrorCode>(
  code: T,
  params: ErrorParams[T]
): AppError<T> {
  return {
    code,
    ...params,
  } as AppError<T>;
}

// 使用例
const error1 = createError(ErrorCode.FIELD_REQUIRED, { field: 'email' });
const error2 = createError(ErrorCode.FIELD_TOO_LONG, {
  field: 'username',
  maxLength: 20,
  actualLength: 25,
});

// 型推論が完璧に機能
if (error1.code === ErrorCode.FIELD_REQUIRED) {
  console.log(error1.field); // fieldにアクセス可能
}
```

## 5. 実用例：APIエラーハンドリング

```typescript
enum ErrorCode {
  FIELD_REQUIRED = 'FIELD_REQUIRED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

// HTTPステータスコードのマッピング
const ERROR_STATUS_CODES: Record<ErrorCode, number> = {
  [ErrorCode.FIELD_REQUIRED]: 400,
  [ErrorCode.UNAUTHORIZED]: 401,
  [ErrorCode.FORBIDDEN]: 403,
  [ErrorCode.NOT_FOUND]: 404,
  [ErrorCode.INTERNAL_ERROR]: 500,
};

// エラーレスポンスクラス
class ApiError extends Error {
  constructor(
    public readonly code: ErrorCode,
    public readonly details: Record<string, any> = {},
    message?: string
  ) {
    super(message || ERROR_MESSAGES[code] || code);
  }
  
  get statusCode(): number {
    return ERROR_STATUS_CODES[this.code] || 500;
  }
  
  toJSON() {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
    };
  }
}

// 使用例
throw new ApiError(ErrorCode.FIELD_REQUIRED, { field: 'email' });
```

## enumを使うメリット・デメリット

### ✅ メリット
- **IDE支援**: 自動補完、リファクタリング、使用箇所の検索が完璧
- **タイポ防止**: コンパイル時にエラーを検出
- **一元管理**: エラーコードが一箇所にまとまる
- **可読性**: `ErrorCode.FIELD_REQUIRED`は意図が明確

### ❌ デメリット
- **バンドルサイズ**: enumは実行時にオブジェクトになる
- **Tree-shaking**: 使用していないenumメンバーも含まれる可能性
- **数値enum**: 数値enumは予期しない動作をすることがある

## 推奨

**ネイティブenumを使うアプローチは十分に実用的**です。特に：

1. **中〜大規模プロジェクト**では、enumの型安全性とIDE支援が大きなメリット
2. **エラーコードが多い場合**（10個以上）は、enumの方が管理しやすい
3. **チーム開発**では、enumの方が意図が明確で理解しやすい

最も実用的なのは「enum + 型マッピング」（パターン4）のアプローチです。これにより：
- エラーコードのタイポが不可能
- 各エラーに必要なパラメータが型で保証される
- IDEの支援が最大限に活用できる

```typescript
// 実際のプロジェクトでよく見るパターン
enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTH_ERROR = 'AUTH_ERROR',
  NOT_FOUND = 'NOT_FOUND',
}

const error = {
  code: ErrorCode.VALIDATION_ERROR,  // タイポ不可能
  field: 'email',
  message: 'Email is required',
};
```

---

## 👤 User
*2025-06-09 15:09:42*

もしかしてvalibotのほうが簡素にかけたりするのか？

---

## 🤖 Assistant
*2025-06-09 15:10:25*

良い着眼点です！Valibotは確かにより簡潔に書ける場合があります。比較してみましょう。

## Valibot vs Zod の比較

### 1. 基本的なdiscriminated union

```typescript
// Zod版
import { z } from 'zod';

const AppErrorZod = z.discriminatedUnion('code', [
  z.object({
    code: z.literal('FIELD_REQUIRED'),
    field: z.string(),
  }),
  z.object({
    code: z.literal('FIELD_TOO_LONG'),
    field: z.string(),
    maxLength: z.number(),
    actualLength: z.number(),
  }),
]);

// Valibot版
import { union, object, literal, string, number } from 'valibot';

const AppErrorValibot = union([
  object({
    code: literal('FIELD_REQUIRED'),
    field: string(),
  }),
  object({
    code: literal('FIELD_TOO_LONG'),
    field: string(),
    maxLength: number(),
    actualLength: number(),
  }),
]);
```

### 2. Valibotのvariant（discriminated union専用）

```typescript
import { variant, object, string, number } from 'valibot';

// Valibotのvariantを使うとより簡潔に
const AppError = variant('code', [
  object({
    code: literal('FIELD_REQUIRED'),
    field: string(),
  }),
  object({
    code: literal('FIELD_TOO_LONG'),
    field: string(),
    maxLength: number(),
    actualLength: number(),
  }),
  object({
    code: literal('RESOURCE_NOT_FOUND'),
    resourceType: string(),
    resourceId: string(),
  }),
]);
```

### 3. enum統合パターンの比較

```typescript
// 共通のenum定義
enum ErrorCode {
  FIELD_REQUIRED = 'FIELD_REQUIRED',
  FIELD_TOO_LONG = 'FIELD_TOO_LONG',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
}

// Zod版
const AppErrorZod = z.discriminatedUnion('code', [
  z.object({
    code: z.literal(ErrorCode.FIELD_REQUIRED),
    field: z.string(),
  }),
  z.object({
    code: z.literal(ErrorCode.FIELD_TOO_LONG),
    field: z.string(),
    maxLength: z.number(),
    actualLength: z.number(),
  }),
]);

// Valibot版 - enumを直接使える
import { enum_, variant } from 'valibot';

const AppErrorValibot = variant('code', [
  object({
    code: literal(ErrorCode.FIELD_REQUIRED),
    field: string(),
  }),
  object({
    code: literal(ErrorCode.FIELD_TOO_LONG),
    field: string(),
    maxLength: number(),
    actualLength: number(),
  }),
]);
```

### 4. Valibotの高度なパターン

```typescript
import { 
  variant, object, literal, string, number, 
  pipe, transform, type Input, type Output 
} from 'valibot';

// エラー定義とメッセージを一体化
const createErrorSchema = <T extends string>(
  code: T,
  schema: any,
  getMessage: (data: any) => string
) => pipe(
  object({
    code: literal(code),
    ...schema,
  }),
  transform((data) => ({
    ...data,
    message: getMessage(data),
  }))
);

const AppError = variant('code', [
  createErrorSchema(
    'FIELD_REQUIRED',
    { field: string() },
    (data) => `${data.field}は必須項目です`
  ),
  createErrorSchema(
    'FIELD_TOO_LONG',
    {
      field: string(),
      maxLength: number(),
      actualLength: number(),
    },
    (data) => `${data.field}が長すぎます（最大${data.maxLength}文字）`
  ),
]);

// 使用時にmessageが自動生成される
const error = parse(AppError, {
  code: 'FIELD_REQUIRED',
  field: 'email',
});
console.log(error.message); // "emailは必須項目です"
```

### 5. Valibotのカスタムエラーメッセージ

```typescript
import { object, string, minLength, email, pipe } from 'valibot';

// Valibotはエラーメッセージをスキーマに直接組み込める
const UserSchema = object({
  email: pipe(
    string('メールアドレスを入力してください'),
    email('有効なメールアドレスではありません')
  ),
  password: pipe(
    string('パスワードを入力してください'),
    minLength(8, 'パスワードは8文字以上である必要があります')
  ),
});

// エラーハンドリングもシンプル
import { safeParse, flatten } from 'valibot';

const result = safeParse(UserSchema, data);
if (!result.success) {
  const errors = flatten(result.issues);
  console.log(errors.nested); // { email: ['有効なメールアドレスではありません'] }
}
```

### 6. バンドルサイズの比較

```typescript
// Valibotの方が軽量
// Zod: ~12.5kb (minified + gzipped)
// Valibot: ~7kb (minified + gzipped)

// さらにValibotはtree-shakableなので、使用する機能だけをインポート
import { object, string, number } from 'valibot'; // 必要な分だけ
```

## 実践的な比較例

```typescript
// === Zod版 ===
import { z } from 'zod';

enum ErrorCode {
  FIELD_REQUIRED = 'FIELD_REQUIRED',
  RATE_LIMIT = 'RATE_LIMIT',
}

const ErrorSchemaZod = z.discriminatedUnion('code', [
  z.object({
    code: z.literal(ErrorCode.FIELD_REQUIRED),
    field: z.string(),
  }),
  z.object({
    code: z.literal(ErrorCode.RATE_LIMIT),
    retryAfter: z.number(),
  }),
]);

// === Valibot版 ===
import { variant, object, literal, string, number } from 'valibot';

const ErrorSchemaValibot = variant('code', [
  object({
    code: literal(ErrorCode.FIELD_REQUIRED),
    field: string(),
  }),
  object({
    code: literal(ErrorCode.RATE_LIMIT),
    retryAfter: number(),
  }),
]);

// Valibot版の方が少し簡潔
```

## Valibotの利点

1. **軽量**: バンドルサイズが小さい
2. **Tree-shakable**: 使用する機能だけインポート
3. **variant**: discriminated union専用のAPI
4. **transform/pipe**: データ変換が組み込みやすい
5. **エラーメッセージ**: スキーマに直接組み込める

## Zodの利点

1. **エコシステム**: より広く使われている
2. **ドキュメント**: より充実
3. **コミュニティ**: より大きい
4. **安定性**: より長い実績

## 結論

**エラー管理においては、Valibotの方が若干簡潔**に書けます。特に：
- `variant`がdiscriminated union専用で分かりやすい
- transformで自動的にメッセージを生成できる
- バンドルサイズが気になる場合は有利

ただし、プロジェクト全体でZodを使っているなら、統一性のためにZodを使い続ける方が良いでしょう。新規プロジェクトでバンドルサイズを重視するなら、Valibotは良い選択肢です。

---
