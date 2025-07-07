# TypeScript const Satisfies Record Pattern

日付: 2025-06-09

---

## 👤 ユーザー
*2025/6/9 18:21:50*

typescriptでas const satisfies Recordのような記述はどんなメリットがあるか？

---

## 🤖 アシスタント
*2025/6/9 18:22:12*

`as const satisfies Record` のような記述は、TypeScriptで**型の厳密性と型安全性を両立**させるパターンです。主なメリットを説明します。

## 1. リテラル型の保持と型制約の両立

```typescript
// as const のみの場合
const config1 = {
  api: "https://api.example.com",
  timeout: 5000,
  enableCache: true
} as const;
// 型: { readonly api: "https://api.example.com"; readonly timeout: 5000; readonly enableCache: true }

// satisfies Record<string, any> を追加
const config2 = {
  api: "https://api.example.com",
  timeout: 5000,
  enableCache: true
} as const satisfies Record<string, string | number | boolean>;
// 同じリテラル型を保持しつつ、値の型が制約される
```

## 2. 型エラーの早期発見

```typescript
// 型制約に違反するとコンパイルエラー
const config = {
  api: "https://api.example.com",
  timeout: 5000,
  data: { nested: "object" } // エラー: オブジェクトは許可されていない
} as const satisfies Record<string, string | number | boolean>;
```

## 3. 実用的な例：ルーティング設定

```typescript
type Route = {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
};

const routes = {
  users: { path: "/users", method: "GET" },
  createUser: { path: "/users", method: "POST" },
  updateUser: { path: "/users/:id", method: "PUT" }
} as const satisfies Record<string, Route>;

// 型推論により、routes.users.method は "GET" という文字列リテラル型になる
// かつ、すべての値がRoute型に準拠していることが保証される
```

## 4. 列挙型の代替として

```typescript
const Colors = {
  RED: "#FF0000",
  GREEN: "#00FF00",
  BLUE: "#0000FF"
} as const satisfies Record<string, string>;

// Colors.RED の型は "#FF0000" というリテラル型
// すべての値が文字列であることも保証される

// 使用例
function setColor(color: typeof Colors[keyof typeof Colors]) {
  // color は "#FF0000" | "#00FF00" | "#0000FF" のユニオン型
}
```

## まとめ

`as const satisfies Record` パターンの主なメリット：

1. **リテラル型の保持**: 値が具体的なリテラル型として推論される
2. **型安全性**: オブジェクトの構造が指定した型に準拠することを保証
3. **IntelliSenseの向上**: より正確な型情報により、エディタの補完が改善
4. **実行時エラーの防止**: コンパイル時に型の不整合を検出

このパターンは、設定オブジェクト、定数の定義、APIエンドポイントの管理など、値が固定されていて型安全性も必要な場面で特に有用です。

---

## 👤 ユーザー
*2025/6/9 18:23:40*

結構使われているのか また enumとの相性も教えてほしい

---

## 🤖 アシスタント
*2025/6/9 18:24:08*

## 実際の使用状況

`as const satisfies` パターンは、TypeScript 4.9（2022年11月リリース）で `satisfies` 演算子が導入されて以降、**急速に普及**しています。

### よく使われている場面

```typescript
// 1. 設定オブジェクト
const config = {
  apiUrl: "https://api.example.com",
  retryCount: 3,
  timeout: 5000
} as const satisfies Config;

// 2. テーマ定義
const theme = {
  colors: {
    primary: "#007bff",
    secondary: "#6c757d",
    danger: "#dc3545"
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 24
  }
} as const satisfies Theme;

// 3. APIエンドポイント
const endpoints = {
  users: "/api/users",
  posts: "/api/posts",
  comments: "/api/comments"
} as const satisfies Record<string, string>;
```

## Enumとの比較・相性

### 従来のEnum

```typescript
enum Status {
  Pending = "PENDING",
  Active = "ACTIVE",
  Inactive = "INACTIVE"
}

// 問題点：
// 1. ランタイムにコードが生成される
// 2. Tree-shakingが効きにくい
// 3. 型の拡張が難しい
```

### as const satisfiesパターン

```typescript
const Status = {
  Pending: "PENDING",
  Active: "ACTIVE",
  Inactive: "INACTIVE"
} as const satisfies Record<string, string>;

type Status = typeof Status[keyof typeof Status];
// type Status = "PENDING" | "ACTIVE" | "INACTIVE"
```

## Enumとの使い分け

### Enumが適している場合

```typescript
// 1. 数値の連番が必要な場合
enum Priority {
  Low,    // 0
  Medium, // 1
  High    // 2
}

// 2. ビットフラグとして使う場合
enum Permission {
  Read = 1 << 0,   // 1
  Write = 1 << 1,  // 2
  Delete = 1 << 2  // 4
}
```

### as const satisfiesが適している場合

```typescript
// 1. より複雑な構造を持つ場合
const HttpStatus = {
  OK: { code: 200, message: "OK" },
  NotFound: { code: 404, message: "Not Found" },
  ServerError: { code: 500, message: "Internal Server Error" }
} as const satisfies Record<string, { code: number; message: string }>;

// 2. 関連する情報をグループ化する場合
const UserRole = {
  Admin: {
    name: "admin",
    permissions: ["read", "write", "delete"],
    level: 3
  },
  User: {
    name: "user",
    permissions: ["read"],
    level: 1
  }
} as const satisfies Record<string, { name: string; permissions: string[]; level: number }>;
```

## 実践的な組み合わせパターン

```typescript
// Enumとas const satisfiesを組み合わせる
enum StatusCode {
  Success = 200,
  NotFound = 404,
  ServerError = 500
}

const StatusMessages = {
  [StatusCode.Success]: "Request successful",
  [StatusCode.NotFound]: "Resource not found",
  [StatusCode.ServerError]: "Internal server error"
} as const satisfies Record<StatusCode, string>;

// 型安全にメッセージを取得
function getStatusMessage(code: StatusCode): string {
  return StatusMessages[code];
}
```

## 移行パターン

```typescript
// Before: Enum
enum Color {
  Red = "#FF0000",
  Green = "#00FF00",
  Blue = "#0000FF"
}

// After: as const satisfies
const Color = {
  Red: "#FF0000",
  Green: "#00FF00",
  Blue: "#0000FF"
} as const satisfies Record<string, `#${string}`>;

type Color = typeof Color[keyof typeof Color];

// 使用方法はほぼ同じ
const myColor: Color = Color.Red;
```

## まとめ

**使用状況**：
- モダンなTypeScriptプロジェクトでは広く採用されている
- 特にNext.js、Remix、tRPCなどの最新フレームワークのコードベースでよく見かける
- Enumの代替として推奨されることが増えている

**Enumとの使い分け**：
- シンプルな列挙値 → どちらでもOK
- 複雑な構造・メタデータ → `as const satisfies`
- 数値の連番・ビットフラグ → Enum
- バンドルサイズを気にする → `as const satisfies`

多くのプロジェクトでは、新規コードでは `as const satisfies` を使い、既存のEnumは必要に応じて段階的に移行するアプローチが取られています。

---

## 👤 ユーザー
*2025/6/9 18:24:53*

enumとの組み合わせでそれが全てれっきょされていることを保証できるのか？

---

## 🤖 アシスタント
*2025/6/9 18:25:28*

はい、Enumと`as const satisfies`を組み合わせることで、**すべてのEnum値が網羅されていることを型レベルで保証**できます。いくつかの方法を紹介します。

## 1. 基本的な網羅性チェック

```typescript
enum Status {
  Pending = "PENDING",
  Active = "ACTIVE",
  Inactive = "INACTIVE"
}

// すべてのEnum値を必須にする
const StatusMessages = {
  [Status.Pending]: "処理中",
  [Status.Active]: "有効",
  [Status.Inactive]: "無効"
} as const satisfies Record<Status, string>;

// もし1つでも欠けているとエラー
const StatusMessagesError = {
  [Status.Pending]: "処理中",
  [Status.Active]: "有効"
  // Error: Property '[Status.Inactive]' is missing
} as const satisfies Record<Status, string>;
```

## 2. より厳密な型定義パターン

```typescript
enum UserRole {
  Admin = "ADMIN",
  User = "USER",
  Guest = "GUEST"
}

// 型ヘルパーを使った網羅性チェック
type EnumRecord<T extends string | number | symbol, V> = {
  [K in T]: V;
};

const RolePermissions = {
  [UserRole.Admin]: ["read", "write", "delete"],
  [UserRole.User]: ["read", "write"],
  [UserRole.Guest]: ["read"]
} as const satisfies EnumRecord<UserRole, readonly string[]>;
```

## 3. 実践的な例：エラーメッセージの網羅

```typescript
enum ErrorCode {
  NotFound = 404,
  Unauthorized = 401,
  ServerError = 500,
  BadRequest = 400
}

// インターフェースで詳細な型を定義
interface ErrorDetail {
  message: string;
  description: string;
  recoverable: boolean;
}

// すべてのErrorCodeに対してErrorDetailが必須
const ErrorMessages = {
  [ErrorCode.NotFound]: {
    message: "見つかりません",
    description: "リソースが存在しません",
    recoverable: true
  },
  [ErrorCode.Unauthorized]: {
    message: "認証エラー",
    description: "ログインが必要です",
    recoverable: true
  },
  [ErrorCode.ServerError]: {
    message: "サーバーエラー",
    description: "サーバー側で問題が発生しました",
    recoverable: false
  },
  [ErrorCode.BadRequest]: {
    message: "不正なリクエスト",
    description: "リクエストの形式が正しくありません",
    recoverable: true
  }
} as const satisfies Record<ErrorCode, ErrorDetail>;
```

## 4. switch文での網羅性チェックと組み合わせ

```typescript
enum Action {
  Create = "CREATE",
  Update = "UPDATE",
  Delete = "DELETE"
}

const ActionLabels = {
  [Action.Create]: "作成",
  [Action.Update]: "更新",
  [Action.Delete]: "削除"
} as const satisfies Record<Action, string>;

// switch文でも網羅性をチェック
function handleAction(action: Action): string {
  switch (action) {
    case Action.Create:
      return ActionLabels[action];
    case Action.Update:
      return ActionLabels[action];
    case Action.Delete:
      return ActionLabels[action];
    // default は不要 - すべてのケースが網羅されている
  }
}
```

## 5. 部分的な網羅が必要な場合

```typescript
enum Feature {
  Basic = "BASIC",
  Premium = "PREMIUM",
  Enterprise = "ENTERPRISE",
  Beta = "BETA"
}

// 一部のみ必須にしたい場合
type RequiredFeatures = Feature.Basic | Feature.Premium | Feature.Enterprise;

const FeaturePricing = {
  [Feature.Basic]: 0,
  [Feature.Premium]: 980,
  [Feature.Enterprise]: 4980
  // Feature.Beta は意図的に含めない
} as const satisfies Record<RequiredFeatures, number>;

// オプショナルも含めたい場合
const FeatureDescriptions = {
  [Feature.Basic]: "基本機能",
  [Feature.Premium]: "プレミアム機能",
  [Feature.Enterprise]: "エンタープライズ機能",
  [Feature.Beta]: "ベータ機能"
} as const satisfies Record<Feature, string> & {
  [Feature.Beta]?: string; // Betaはオプショナル
};
```

## 6. 実行時チェックも組み合わせる

```typescript
enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE"
}

const MethodConfigs = {
  [HttpMethod.GET]: { hasBody: false, idempotent: true },
  [HttpMethod.POST]: { hasBody: true, idempotent: false },
  [HttpMethod.PUT]: { hasBody: true, idempotent: true },
  [HttpMethod.DELETE]: { hasBody: false, idempotent: true }
} as const satisfies Record<HttpMethod, { hasBody: boolean; idempotent: boolean }>;

// 実行時の網羅性チェック関数
function assertExhaustive(value: never): never {
  throw new Error(`Unexpected value: ${value}`);
}

function processMethod(method: HttpMethod) {
  const config = MethodConfigs[method];
  if (!config) {
    assertExhaustive(method);
  }
  return config;
}
```

## まとめ

**網羅性を保証する方法**：
1. `Record<EnumType, ValueType>` を使用することで、すべてのEnum値に対する定義を強制
2. TypeScriptのコンパイラが欠けている値を検出してエラーを出す
3. 新しいEnum値を追加した際も、関連するオブジェクトの更新が強制される

**メリット**：
- コンパイル時に網羅性が保証される
- リファクタリング時の安全性が高い
- IDEの補完機能が効果的に働く
- メンテナンス性が向上

この組み合わせにより、Enumの型安全性と`as const`の柔軟性を両立させながら、確実な網羅性チェックが可能になります。

---

## 👤 ユーザー
*2025/6/9 18:25:41*

でもこれってswitch文で表現できるのでは？
差を教えてほしい

---

## 🤖 アシスタント
*2025/6/9 18:26:25*

その通りです！switch文でも網羅性チェックは可能です。それぞれの特徴と使い分けを詳しく説明します。

## switch文での網羅性チェック

```typescript
enum Status {
  Pending = "PENDING",
  Active = "ACTIVE",
  Inactive = "INACTIVE"
}

// switch文での実装
function getStatusMessage(status: Status): string {
  switch (status) {
    case Status.Pending:
      return "処理中";
    case Status.Active:
      return "有効";
    case Status.Inactive:
      return "無効";
    // exhaustive checkで網羅性を保証
    default:
      const _exhaustive: never = status;
      throw new Error(`Unhandled status: ${_exhaustive}`);
  }
}
```

## as const satisfiesでの実装

```typescript
const StatusMessages = {
  [Status.Pending]: "処理中",
  [Status.Active]: "有効",
  [Status.Inactive]: "無効"
} as const satisfies Record<Status, string>;

function getStatusMessage(status: Status): string {
  return StatusMessages[status];
}
```

## 主な違い

### 1. **データ構造 vs ロジック**

```typescript
// switch文：ロジックベース
function getStatusColor(status: Status): string {
  switch (status) {
    case Status.Pending:
      console.log("Pending status detected"); // 副作用を含められる
      return "#FFA500";
    case Status.Active:
      if (isDarkMode()) { // 条件分岐を含められる
        return "#00FF00";
      }
      return "#008000";
    case Status.Inactive:
      return "#808080";
  }
}

// as const：データベース
const StatusColors = {
  [Status.Pending]: "#FFA500",
  [Status.Active]: "#008000",  // 静的な値のみ
  [Status.Inactive]: "#808080"
} as const satisfies Record<Status, string>;
```

### 2. **複数の関連データの管理**

```typescript
// switch文：複数の関数が必要
function getStatusMessage(status: Status): string { /* ... */ }
function getStatusColor(status: Status): string { /* ... */ }
function getStatusIcon(status: Status): string { /* ... */ }

// as const：1つのオブジェクトで管理
const StatusConfig = {
  [Status.Pending]: {
    message: "処理中",
    color: "#FFA500",
    icon: "clock"
  },
  [Status.Active]: {
    message: "有効",
    color: "#008000",
    icon: "check"
  },
  [Status.Inactive]: {
    message: "無効",
    color: "#808080",
    icon: "x"
  }
} as const satisfies Record<Status, {
  message: string;
  color: string;
  icon: string;
}>;
```

### 3. **パフォーマンスと最適化**

```typescript
// switch文：毎回評価される
function processStatus(status: Status, count: number): string {
  switch (status) {
    case Status.Pending:
      return `${count}件処理中`;  // 動的な処理
    case Status.Active:
      return `${count}件有効`;
    case Status.Inactive:
      return `${count}件無効`;
  }
}

// as const：事前定義された静的データ
const StatusTemplates = {
  [Status.Pending]: "件処理中",
  [Status.Active]: "件有効",
  [Status.Inactive]: "件無効"
} as const satisfies Record<Status, string>;

// 使用時に組み合わせ
const message = `${count}${StatusTemplates[status]}`;
```

### 4. **テストのしやすさ**

```typescript
// switch文：関数単位でのテストが必要
describe('getStatusMessage', () => {
  it('should return correct message for Pending', () => {
    expect(getStatusMessage(Status.Pending)).toBe("処理中");
  });
  // 各ケースをテスト
});

// as const：データ構造のテスト
describe('StatusMessages', () => {
  it('should have all status messages defined', () => {
    expect(Object.keys(StatusMessages)).toHaveLength(3);
    expect(StatusMessages[Status.Pending]).toBeDefined();
  });
});
```

## 使い分けの指針

### switch文が適している場合

```typescript
// 1. 複雑なロジックが必要
function calculatePrice(userType: UserType): number {
  switch (userType) {
    case UserType.Free:
      return 0;
    case UserType.Premium:
      const basePrice = 980;
      const discount = getCurrentDiscount();
      return basePrice * (1 - discount);
    case UserType.Enterprise:
      return negotiatedPrice || 9800;
  }
}

// 2. 副作用を含む処理
function handleUserAction(action: Action): void {
  switch (action) {
    case Action.Login:
      analytics.track('user_login');
      redirectToDashboard();
      break;
    case Action.Logout:
      clearSession();
      redirectToHome();
      break;
  }
}
```

### as const satisfiesが適している場合

```typescript
// 1. 設定値やマッピング
const Routes = {
  [Page.Home]: "/",
  [Page.About]: "/about",
  [Page.Contact]: "/contact"
} as const satisfies Record<Page, string>;

// 2. 国際化（i18n）
const Translations = {
  [Language.EN]: {
    welcome: "Welcome",
    goodbye: "Goodbye"
  },
  [Language.JA]: {
    welcome: "ようこそ",
    goodbye: "さようなら"
  }
} as const satisfies Record<Language, {
  welcome: string;
  goodbye: string;
}>;

// 3. テーマ設定
const Themes = {
  [ThemeMode.Light]: {
    background: "#FFFFFF",
    text: "#000000",
    primary: "#0066CC"
  },
  [ThemeMode.Dark]: {
    background: "#000000",
    text: "#FFFFFF",
    primary: "#66B2FF"
  }
} as const satisfies Record<ThemeMode, Theme>;
```

## ハイブリッドアプローチ

```typescript
// データとロジックを分離
const StatusConfig = {
  [Status.Pending]: {
    message: "処理中",
    color: "#FFA500",
    canCancel: true
  },
  [Status.Active]: {
    message: "有効",
    color: "#008000",
    canCancel: false
  },
  [Status.Inactive]: {
    message: "無効",
    color: "#808080",
    canCancel: false
  }
} as const satisfies Record<Status, StatusConfig>;

// 複雑なロジックはswitch文で
function handleStatusChange(
  currentStatus: Status,
  newStatus: Status
): void {
  switch (newStatus) {
    case Status.Active:
      if (currentStatus === Status.Inactive) {
        notifyReactivation();
      }
      activateFeatures();
      break;
    case Status.Inactive:
      if (StatusConfig[currentStatus].canCancel) {
        saveProgress();
      }
      deactivateFeatures();
      break;
    case Status.Pending:
      startProcessing();
      break;
  }
}
```

## まとめ

**switch文**：
- ✅ 動的なロジック、条件分岐
- ✅ 副作用を含む処理
- ✅ 実行時の値に基づく処理
- ❌ 静的データの管理には冗長

**as const satisfies**：
- ✅ 静的なデータ、設定値
- ✅ 複数の関連データの一元管理
- ✅ 型推論の活用
- ❌ 動的なロジックには不向き

実際のプロジェクトでは、**データは`as const satisfies`で管理し、ロジックはswitch文で実装する**というハイブリッドアプローチが最も実用的です。

---

## 👤 ユーザー
*2025/6/9 18:32:13*

なるほど。初めのkeyとなるものは基本的にenumとするのもいいだろうか？
そこから派生する固定の定義はas const でビジネスロジックが挟めばswitch文という理解か

---

## 🤖 アシスタント
*2025/6/9 18:33:00*

まさにその理解で完璧です！これが現代的なTypeScriptでの実践的なパターンです。

## 基本構造：Enum → as const → switch

```typescript
// 1. 基準となる識別子はEnum
enum OrderStatus {
  Pending = "PENDING",
  Processing = "PROCESSING",
  Shipped = "SHIPPED",
  Delivered = "DELIVERED",
  Cancelled = "CANCELLED"
}

// 2. 静的なデータ・設定値はas const
const OrderStatusConfig = {
  [OrderStatus.Pending]: {
    label: "注文確認中",
    color: "#FFA500",
    icon: "clock",
    canCancel: true,
    canEdit: true
  },
  [OrderStatus.Processing]: {
    label: "処理中",
    color: "#0080FF",
    icon: "package",
    canCancel: true,
    canEdit: false
  },
  [OrderStatus.Shipped]: {
    label: "発送済み",
    color: "#4B0082",
    icon: "truck",
    canCancel: false,
    canEdit: false
  },
  [OrderStatus.Delivered]: {
    label: "配達完了",
    color: "#008000",
    icon: "check-circle",
    canCancel: false,
    canEdit: false
  },
  [OrderStatus.Cancelled]: {
    label: "キャンセル済み",
    color: "#DC143C",
    icon: "x-circle",
    canCancel: false,
    canEdit: false
  }
} as const satisfies Record<OrderStatus, {
  label: string;
  color: string;
  icon: string;
  canCancel: boolean;
  canEdit: boolean;
}>;

// 3. ビジネスロジックはswitch文
function handleStatusTransition(
  currentStatus: OrderStatus,
  newStatus: OrderStatus,
  order: Order
): void {
  switch (newStatus) {
    case OrderStatus.Processing:
      // 在庫確認などの複雑なロジック
      if (!checkInventory(order.items)) {
        throw new Error("在庫が不足しています");
      }
      chargePayment(order);
      notifyWarehouse(order);
      break;
      
    case OrderStatus.Shipped:
      const trackingNumber = generateTrackingNumber();
      sendShippingNotification(order, trackingNumber);
      updateInventory(order.items);
      break;
      
    case OrderStatus.Cancelled:
      if (!OrderStatusConfig[currentStatus].canCancel) {
        throw new Error("このステータスからはキャンセルできません");
      }
      refundPayment(order);
      restoreInventory(order.items);
      notifyCustomer(order, "キャンセル完了");
      break;
      
    default:
      // 他のケース
  }
}
```

## この構造のメリット

### 1. 責務の明確な分離

```typescript
// Enum: 何が存在するか（What）
enum UserRole {
  Admin = "ADMIN",
  Manager = "MANAGER",
  Employee = "EMPLOYEE",
  Guest = "GUEST"
}

// as const: それぞれの属性（Properties）
const RolePermissions = {
  [UserRole.Admin]: ["read", "write", "delete", "manage_users"],
  [UserRole.Manager]: ["read", "write", "delete"],
  [UserRole.Employee]: ["read", "write"],
  [UserRole.Guest]: ["read"]
} as const satisfies Record<UserRole, readonly string[]>;

// switch: どう振る舞うか（Behavior）
function handleUserAccess(role: UserRole, resource: Resource): boolean {
  switch (role) {
    case UserRole.Admin:
      return true; // 管理者は全てアクセス可能
      
    case UserRole.Manager:
      // 部門のリソースのみアクセス可能
      return resource.departmentId === getCurrentUser().departmentId;
      
    case UserRole.Employee:
      // 自分のリソースのみ
      return resource.ownerId === getCurrentUser().id;
      
    case UserRole.Guest:
      // 公開リソースのみ
      return resource.isPublic;
  }
}
```

### 2. 型安全性の階層

```typescript
// レベル1: Enumで基本の型安全性
enum PaymentMethod {
  CreditCard = "CREDIT_CARD",
  BankTransfer = "BANK_TRANSFER",
  PayPal = "PAYPAL",
  Cash = "CASH"
}

// レベル2: as constで詳細な型定義
const PaymentMethodConfig = {
  [PaymentMethod.CreditCard]: {
    displayName: "クレジットカード",
    fee: 0.03, // 3%
    instant: true,
    requiresVerification: true
  },
  [PaymentMethod.BankTransfer]: {
    displayName: "銀行振込",
    fee: 0,
    instant: false,
    requiresVerification: false
  },
  [PaymentMethod.PayPal]: {
    displayName: "PayPal",
    fee: 0.04,
    instant: true,
    requiresVerification: true
  },
  [PaymentMethod.Cash]: {
    displayName: "現金",
    fee: 0,
    instant: true,
    requiresVerification: false
  }
} as const satisfies Record<PaymentMethod, {
  displayName: string;
  fee: number;
  instant: boolean;
  requiresVerification: boolean;
}>;

// レベル3: switch文で実行時の型安全性
function processPayment(method: PaymentMethod, amount: number): PaymentResult {
  const config = PaymentMethodConfig[method];
  const finalAmount = amount * (1 + config.fee);
  
  switch (method) {
    case PaymentMethod.CreditCard:
      return processCreditCardPayment(finalAmount);
      
    case PaymentMethod.BankTransfer:
      return scheduleBankTransfer(finalAmount);
      
    case PaymentMethod.PayPal:
      return processPayPalPayment(finalAmount);
      
    case PaymentMethod.Cash:
      return recordCashPayment(finalAmount);
  }
}
```

## より実践的な例：機能フラグ管理

```typescript
// 1. Enumで機能を定義
enum Feature {
  DarkMode = "DARK_MODE",
  BetaUI = "BETA_UI",
  AdvancedAnalytics = "ADVANCED_ANALYTICS",
  AIAssistant = "AI_ASSISTANT"
}

// 2. as constで静的な設定
const FeatureConfig = {
  [Feature.DarkMode]: {
    name: "ダークモード",
    description: "目に優しい暗いテーマ",
    requiredPlan: "free",
    rolloutPercentage: 100
  },
  [Feature.BetaUI]: {
    name: "ベータ版UI",
    description: "新しいユーザーインターフェース",
    requiredPlan: "premium",
    rolloutPercentage: 50
  },
  [Feature.AdvancedAnalytics]: {
    name: "高度な分析",
    description: "詳細なデータ分析機能",
    requiredPlan: "enterprise",
    rolloutPercentage: 100
  },
  [Feature.AIAssistant]: {
    name: "AIアシスタント",
    description: "AI による作業支援",
    requiredPlan: "enterprise",
    rolloutPercentage: 20
  }
} as const satisfies Record<Feature, {
  name: string;
  description: string;
  requiredPlan: "free" | "premium" | "enterprise";
  rolloutPercentage: number;
}>;

// 3. switch文でビジネスロジック
function isFeatureEnabled(feature: Feature, user: User): boolean {
  const config = FeatureConfig[feature];
  
  // 共通のチェック
  if (!hasRequiredPlan(user, config.requiredPlan)) {
    return false;
  }
  
  if (!isInRolloutGroup(user, config.rolloutPercentage)) {
    return false;
  }
  
  // 機能固有のロジック
  switch (feature) {
    case Feature.DarkMode:
      // 特別な条件なし
      return true;
      
    case Feature.BetaUI:
      // ベータテスターのみ
      return user.isBetaTester || user.isEmployee;
      
    case Feature.AdvancedAnalytics:
      // データ量の確認
      return user.dataPoints > 10000;
      
    case Feature.AIAssistant:
      // 地域制限
      return ['US', 'JP', 'UK'].includes(user.country);
  }
}
```

## まとめ

あなたの理解は完璧です：

1. **Enum**: 識別子・キーとなる値の定義（型の基盤）
2. **as const satisfies**: 静的なデータ・設定値（データ層）
3. **switch文**: ビジネスロジック・動的な処理（ロジック層）

この3層構造により：
- **保守性**: それぞれの責務が明確
- **型安全性**: コンパイル時に問題を検出
- **拡張性**: 新しい値の追加が容易
- **テスタビリティ**: 各層を独立してテスト可能

これが現在のTypeScriptベストプラクティスとして広く採用されているパターンです。

---

## 👤 ユーザー
*2025/6/9 18:33:36*

エラーtypeをenumで文言とその引数をas const で定義する例がほしい

---

## 🤖 アシスタント
*2025/6/9 18:34:34*

エラー管理の実践的な例を紹介します。これは多くのプロダクションコードで使われているパターンです。

## 基本的なエラー管理システム

```typescript
// 1. エラータイプをEnumで定義
enum ErrorCode {
  // 認証関連
  AUTH_INVALID_CREDENTIALS = "AUTH_INVALID_CREDENTIALS",
  AUTH_TOKEN_EXPIRED = "AUTH_TOKEN_EXPIRED",
  AUTH_INSUFFICIENT_PERMISSIONS = "AUTH_INSUFFICIENT_PERMISSIONS",
  
  // バリデーション関連
  VALIDATION_REQUIRED_FIELD = "VALIDATION_REQUIRED_FIELD",
  VALIDATION_INVALID_FORMAT = "VALIDATION_INVALID_FORMAT",
  VALIDATION_OUT_OF_RANGE = "VALIDATION_OUT_OF_RANGE",
  
  // リソース関連
  RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND",
  RESOURCE_ALREADY_EXISTS = "RESOURCE_ALREADY_EXISTS",
  RESOURCE_LIMIT_EXCEEDED = "RESOURCE_LIMIT_EXCEEDED",
  
  // システム関連
  SYSTEM_INTERNAL_ERROR = "SYSTEM_INTERNAL_ERROR",
  SYSTEM_SERVICE_UNAVAILABLE = "SYSTEM_SERVICE_UNAVAILABLE",
  SYSTEM_RATE_LIMIT_EXCEEDED = "SYSTEM_RATE_LIMIT_EXCEEDED"
}

// 2. エラーの詳細設定をas constで定義
const ErrorDefinitions = {
  [ErrorCode.AUTH_INVALID_CREDENTIALS]: {
    message: "メールアドレスまたはパスワードが正しくありません",
    statusCode: 401,
    params: {} as {}
  },
  [ErrorCode.AUTH_TOKEN_EXPIRED]: {
    message: "認証トークンの有効期限が切れています",
    statusCode: 401,
    params: {} as { expiredAt: Date }
  },
  [ErrorCode.AUTH_INSUFFICIENT_PERMISSIONS]: {
    message: "{resource}へのアクセス権限がありません",
    statusCode: 403,
    params: {} as { resource: string; requiredRole: string }
  },
  
  [ErrorCode.VALIDATION_REQUIRED_FIELD]: {
    message: "{fieldName}は必須項目です",
    statusCode: 400,
    params: {} as { fieldName: string }
  },
  [ErrorCode.VALIDATION_INVALID_FORMAT]: {
    message: "{fieldName}の形式が正しくありません。{expectedFormat}の形式で入力してください",
    statusCode: 400,
    params: {} as { fieldName: string; expectedFormat: string }
  },
  [ErrorCode.VALIDATION_OUT_OF_RANGE]: {
    message: "{fieldName}は{min}から{max}の範囲で入力してください",
    statusCode: 400,
    params: {} as { fieldName: string; min: number; max: number }
  },
  
  [ErrorCode.RESOURCE_NOT_FOUND]: {
    message: "{resourceType} (ID: {resourceId}) が見つかりません",
    statusCode: 404,
    params: {} as { resourceType: string; resourceId: string }
  },
  [ErrorCode.RESOURCE_ALREADY_EXISTS]: {
    message: "{resourceType}は既に存在します: {identifier}",
    statusCode: 409,
    params: {} as { resourceType: string; identifier: string }
  },
  [ErrorCode.RESOURCE_LIMIT_EXCEEDED]: {
    message: "{resourceType}の上限（{limit}個）に達しています",
    statusCode: 429,
    params: {} as { resourceType: string; limit: number; current: number }
  },
  
  [ErrorCode.SYSTEM_INTERNAL_ERROR]: {
    message: "システムエラーが発生しました。しばらく経ってから再度お試しください",
    statusCode: 500,
    params: {} as { errorId: string; timestamp: Date }
  },
  [ErrorCode.SYSTEM_SERVICE_UNAVAILABLE]: {
    message: "{serviceName}サービスが一時的に利用できません",
    statusCode: 503,
    params: {} as { serviceName: string; retryAfter?: number }
  },
  [ErrorCode.SYSTEM_RATE_LIMIT_EXCEEDED]: {
    message: "リクエスト数が上限を超えました。{retryAfter}秒後に再度お試しください",
    statusCode: 429,
    params: {} as { retryAfter: number; limit: number }
  }
} as const satisfies Record<ErrorCode, {
  message: string;
  statusCode: number;
  params: Record<string, any>;
}>;
```

## エラークラスの実装

```typescript
// 型安全なエラーパラメータの抽出
type ErrorParams<T extends ErrorCode> = 
  (typeof ErrorDefinitions)[T]['params'];

// カスタムエラークラス
class AppError<T extends ErrorCode> extends Error {
  constructor(
    public readonly code: T,
    public readonly params: ErrorParams<T>,
    public readonly cause?: unknown
  ) {
    super(ErrorDefinitions[code].message);
    this.name = 'AppError';
  }
  
  get statusCode(): number {
    return ErrorDefinitions[this.code].statusCode;
  }
  
  // パラメータを使ってメッセージを生成
  getFormattedMessage(): string {
    let message = ErrorDefinitions[this.code].message;
    
    Object.entries(this.params).forEach(([key, value]) => {
      message = message.replace(`{${key}}`, String(value));
    });
    
    return message;
  }
  
  toJSON() {
    return {
      code: this.code,
      message: this.getFormattedMessage(),
      params: this.params,
      timestamp: new Date().toISOString()
    };
  }
}
```

## 使用例

```typescript
// 型安全にエラーを生成
function validateEmail(email: string): void {
  if (!email) {
    throw new AppError(
      ErrorCode.VALIDATION_REQUIRED_FIELD,
      { fieldName: "メールアドレス" }
    );
  }
  
  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    throw new AppError(
      ErrorCode.VALIDATION_INVALID_FORMAT,
      { 
        fieldName: "メールアドレス",
        expectedFormat: "example@domain.com"
      }
    );
  }
}

// リソース操作
async function getUser(userId: string): Promise<User> {
  const user = await db.users.findById(userId);
  
  if (!user) {
    throw new AppError(
      ErrorCode.RESOURCE_NOT_FOUND,
      { 
        resourceType: "ユーザー",
        resourceId: userId
      }
    );
  }
  
  return user;
}

// 権限チェック
function checkPermission(user: User, resource: string): void {
  if (!user.permissions.includes(resource)) {
    throw new AppError(
      ErrorCode.AUTH_INSUFFICIENT_PERMISSIONS,
      {
        resource: resource,
        requiredRole: "管理者"
      }
    );
  }
}
```

## エラーハンドリング

```typescript
// Express.jsでのエラーハンドラー例
function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.getFormattedMessage(),
        details: error.params
      }
    });
    return;
  }
  
  // 予期しないエラー
  const systemError = new AppError(
    ErrorCode.SYSTEM_INTERNAL_ERROR,
    {
      errorId: generateErrorId(),
      timestamp: new Date()
    }
  );
  
  // ログに記録
  logger.error('Unhandled error:', error);
  
  res.status(500).json(systemError.toJSON());
}
```

## より高度な例：多言語対応

```typescript
type Language = 'ja' | 'en';

// 多言語メッセージ定義
const ErrorMessages = {
  [ErrorCode.VALIDATION_REQUIRED_FIELD]: {
    ja: "{fieldName}は必須項目です",
    en: "{fieldName} is required"
  },
  [ErrorCode.RESOURCE_NOT_FOUND]: {
    ja: "{resourceType} (ID: {resourceId}) が見つかりません",
    en: "{resourceType} with ID {resourceId} was not found"
  },
  // ... 他のエラーメッセージ
} as const satisfies Record<ErrorCode, Record<Language, string>>;

// 言語別エラークラス
class LocalizedAppError<T extends ErrorCode> extends AppError<T> {
  constructor(
    code: T,
    params: ErrorParams<T>,
    private language: Language = 'ja'
  ) {
    super(code, params);
  }
  
  getFormattedMessage(): string {
    let message = ErrorMessages[this.code][this.language];
    
    Object.entries(this.params).forEach(([key, value]) => {
      message = message.replace(`{${key}}`, String(value));
    });
    
    return message;
  }
}
```

## ユーティリティ関数

```typescript
// エラーレスポンスのフォーマッター
function formatErrorResponse(error: AppError<any>) {
  return {
    error: {
      code: error.code,
      message: error.getFormattedMessage(),
      timestamp: new Date().toISOString(),
      requestId: getCurrentRequestId()
    }
  };
}

// 特定のエラータイプかチェック
function isAuthError(error: unknown): error is AppError<
  | ErrorCode.AUTH_INVALID_CREDENTIALS
  | ErrorCode.AUTH_TOKEN_EXPIRED
  | ErrorCode.AUTH_INSUFFICIENT_PERMISSIONS
> {
  return error instanceof AppError && 
    error.code.startsWith('AUTH_');
}

// リトライ可能なエラーかチェック
function isRetryableError(error: unknown): boolean {
  if (!(error instanceof AppError)) return false;
  
  switch (error.code) {
    case ErrorCode.SYSTEM_SERVICE_UNAVAILABLE:
    case ErrorCode.SYSTEM_RATE_LIMIT_EXCEEDED:
      return true;
    default:
      return false;
  }
}
```

## フロントエンドでの使用例

```typescript
// React Hookでのエラーハンドリング
function useApiCall<T>() {
  const [error, setError] = useState<AppError<any> | null>(null);
  const [loading, setLoading] = useState(false);
  
  const execute = async (apiCall: () => Promise<T>) => {
    try {
      setLoading(true);
      setError(null);
      return await apiCall();
    } catch (e) {
      if (e instanceof AppError) {
        setError(e);
        
        // エラータイプに応じた処理
        switch (e.code) {
          case ErrorCode.AUTH_TOKEN_EXPIRED:
            // 自動的に再ログイン画面へ
            router.push('/login');
            break;
          case ErrorCode.SYSTEM_RATE_LIMIT_EXCEEDED:
            // リトライ時間を表示
            const { retryAfter } = e.params;
            toast.error(`${retryAfter}秒後に再度お試しください`);
            break;
        }
      }
      throw e;
    } finally {
      setLoading(false);
    }
  };
  
  return { execute, error, loading };
}
```

## まとめ

このパターンのメリット：

1. **型安全性**: エラーコードとパラメータの型が一致
2. **一貫性**: すべてのエラーが統一されたフォーマット
3. **国際化対応**: 多言語メッセージの管理が容易
4. **保守性**: 新しいエラータイプの追加が簡単
5. **DX向上**: エディタの補完が効いて開発効率UP

エラー管理は、Enum + as const + 型推論の組み合わせが最も効果的に活用できる領域の一つです。

---

## 👤 ユーザー
*2025/6/9 18:35:17*

これってエラーtypeによってパラメーターの型補完は効くのか？

---

## 🤖 アシスタント
*2025/6/9 18:36:02*

はい、**完璧に型補完が効きます**！これがTypeScriptの型推論の素晴らしいところです。実際の動作を見てみましょう。

## 型補完の実例

```typescript
// エラーを投げる時、エラーコードに応じて必要なパラメータが自動補完される

// ✅ VALIDATION_REQUIRED_FIELD の場合
throw new AppError(
  ErrorCode.VALIDATION_REQUIRED_FIELD,
  {
    // fieldName のみが補完候補に表示される
    fieldName: "メールアドレス"
  }
);

// ✅ RESOURCE_NOT_FOUND の場合
throw new AppError(
  ErrorCode.RESOURCE_NOT_FOUND,
  {
    // resourceType と resourceId が補完候補に表示される
    resourceType: "ユーザー",
    resourceId: "user-123"
  }
);

// ✅ VALIDATION_OUT_OF_RANGE の場合
throw new AppError(
  ErrorCode.VALIDATION_OUT_OF_RANGE,
  {
    // fieldName, min, max がすべて必須として補完される
    fieldName: "年齢",
    min: 0,
    max: 120
  }
);

// ❌ 型エラー: 必須パラメータが不足
throw new AppError(
  ErrorCode.RESOURCE_NOT_FOUND,
  {
    resourceType: "ユーザー"
    // エラー: Property 'resourceId' is missing
  }
);

// ❌ 型エラー: 存在しないパラメータ
throw new AppError(
  ErrorCode.AUTH_TOKEN_EXPIRED,
  {
    expiredAt: new Date(),
    userId: "123" // エラー: 'userId' does not exist in type
  }
);
```

## VSCodeでの補完体験

```typescript
// 1. ErrorCodeを選択すると...
throw new AppError(
  ErrorCode.AUTH_INSUFFICIENT_PERMISSIONS,
  // 2. ここで Ctrl+Space を押すと、自動的に以下が提案される
  {
    resource: string,
    requiredRole: string
  }
);

// 3. 実際に入力
throw new AppError(
  ErrorCode.AUTH_INSUFFICIENT_PERMISSIONS,
  {
    res// ← "resource" が自動補完
    req// ← "requiredRole" が自動補完
  }
);
```

## より高度な型安全性の例

```typescript
// ヘルパー関数でも型推論が効く
function createValidationError<T extends ErrorCode>(
  code: T,
  params: ErrorParams<T>
): AppError<T> {
  return new AppError(code, params);
}

// 使用時も完全な型補完
const error1 = createValidationError(
  ErrorCode.VALIDATION_INVALID_FORMAT,
  {
    fieldName: "電話番号",
    expectedFormat: "090-0000-0000"
  }
);

// エラーハンドリング時も型が保持される
function handleError(error: AppError<any>) {
  if (error.code === ErrorCode.RESOURCE_LIMIT_EXCEEDED) {
    // error.params の型が自動的に絞り込まれる
    const { resourceType, limit, current } = error.params;
    //      ↑ これらすべて型補完が効く
    
    console.log(`${resourceType}の上限${limit}に達しています（現在: ${current}）`);
  }
}
```

## 条件付き型を使った更なる改善

```typescript
// パラメータが不要なエラーの場合、第2引数を省略可能にする
type ErrorParamsArg<T extends ErrorCode> = 
  keyof ErrorParams<T> extends never 
    ? [] // パラメータなし
    : [params: ErrorParams<T>]; // パラメータあり

class ImprovedAppError<T extends ErrorCode> extends Error {
  public readonly params: ErrorParams<T>;
  
  constructor(
    public readonly code: T,
    ...args: ErrorParamsArg<T>
  ) {
    super();
    this.params = args[0] ?? {} as ErrorParams<T>;
  }
}

// パラメータなしのエラーは第2引数不要
throw new ImprovedAppError(
  ErrorCode.SYSTEM_INTERNAL_ERROR
  // paramsは省略可能
);

// パラメータありのエラーは必須
throw new ImprovedAppError(
  ErrorCode.VALIDATION_REQUIRED_FIELD,
  { fieldName: "パスワード" } // 必須
);
```

## 実際のIDEでの体験

```typescript
// 1. エラーコードを入力
throw new AppError(ErrorCode.// ← ここで補完リストが表示

// 2. エラーコードを選択後、パラメータ入力
throw new AppError(
  ErrorCode.RESOURCE_NOT_FOUND,
  { // ← ここで { を入力すると、必要なパラメータが表示
    // IntelliSense:
    // resourceType: string
    // resourceId: string
  }
);

// 3. パラメータの型も厳密にチェック
throw new AppError(
  ErrorCode.VALIDATION_OUT_OF_RANGE,
  {
    fieldName: "年齢",
    min: "0", // ❌ Type 'string' is not assignable to type 'number'
    max: 120
  }
);
```

## ユーティリティ型でさらに便利に

```typescript
// エラー生成ヘルパー
const ErrorFactory = {
  // 各エラータイプ専用のファクトリーメソッド
  notFound: (resourceType: string, resourceId: string) => 
    new AppError(ErrorCode.RESOURCE_NOT_FOUND, { resourceType, resourceId }),
  
  requiredField: (fieldName: string) =>
    new AppError(ErrorCode.VALIDATION_REQUIRED_FIELD, { fieldName }),
  
  outOfRange: (fieldName: string, min: number, max: number) =>
    new AppError(ErrorCode.VALIDATION_OUT_OF_RANGE, { fieldName, min, max })
} as const;

// 使用時はさらにシンプル
throw ErrorFactory.notFound("ユーザー", userId);
throw ErrorFactory.requiredField("メールアドレス");
throw ErrorFactory.outOfRange("年齢", 0, 120);
```

## まとめ

**型補完が効く理由**：
1. `ErrorParams<T>` がジェネリクスでエラーコードの型を受け取る
2. インデックスアクセスで正確な型を抽出
3. TypeScriptの型推論により、IDEが必要なパラメータを認識

**開発体験の向上**：
- 必要なパラメータが自動提案される
- 型が合わない場合は即座にエラー
- リファクタリング時も安全
- ドキュメントを見なくても使える

これにより、エラー処理のミスを大幅に減らし、開発効率を向上させることができます！

---

## 👤 ユーザー
*2025/6/9 18:38:38*

これってzodを使った方がいいのか標準の方がいいのか教えてほしい
単純な型チェックだけあればいいんだ

---

## 🤖 アシスタント
*2025/6/9 18:39:20*

単純な型チェックだけなら、**標準のTypeScriptで十分**です。むしろ標準の方が良いケースが多いです。

## 標準TypeScript vs Zod の比較

### 標準TypeScriptで十分なケース（今回のエラー管理）

```typescript
// 標準TypeScript：シンプルで高速
const ErrorDefinitions = {
  [ErrorCode.VALIDATION_REQUIRED_FIELD]: {
    message: "{fieldName}は必須項目です",
    statusCode: 400,
    params: {} as { fieldName: string }
  },
  [ErrorCode.RESOURCE_NOT_FOUND]: {
    message: "{resourceType} (ID: {resourceId}) が見つかりません",
    statusCode: 404,
    params: {} as { resourceType: string; resourceId: string }
  }
} as const satisfies Record<ErrorCode, {
  message: string;
  statusCode: number;
  params: Record<string, any>;
}>;

// 型の抽出もシンプル
type ErrorParams<T extends ErrorCode> = 
  (typeof ErrorDefinitions)[T]['params'];
```

### Zodを使った場合（過剰）

```typescript
import { z } from 'zod';

// Zodでの実装：冗長で複雑
const ErrorSchemas = {
  [ErrorCode.VALIDATION_REQUIRED_FIELD]: z.object({
    fieldName: z.string()
  }),
  [ErrorCode.RESOURCE_NOT_FOUND]: z.object({
    resourceType: z.string(),
    resourceId: z.string()
  })
};

// 使用時に毎回パースが必要
const params = ErrorSchemas[ErrorCode.RESOURCE_NOT_FOUND].parse({
  resourceType: "ユーザー",
  resourceId: "123"
});
```

## なぜ標準TypeScriptで十分なのか

### 1. **コンパイル時の型チェックで完結**

```typescript
// 標準TypeScript：コンパイル時にエラー検出
throw new AppError(
  ErrorCode.RESOURCE_NOT_FOUND,
  {
    resourceType: "ユーザー"
    // ❌ コンパイルエラー：resourceId が不足
  }
);

// 実行時検証は不要
// なぜなら、開発者が直接書くコードだから
```

### 2. **パフォーマンスの優位性**

```typescript
// 標準TypeScript：ランタイムオーバーヘッドなし
class AppError<T extends ErrorCode> {
  constructor(
    public readonly code: T,
    public readonly params: ErrorParams<T>
  ) {
    // 型チェックは既に完了、実行時検証不要
  }
}

// Zod：毎回実行時にパース処理
class ZodAppError {
  constructor(code: ErrorCode, params: unknown) {
    // 実行時に検証が走る（遅い）
    const validated = ErrorSchemas[code].parse(params);
  }
}
```

### 3. **バンドルサイズ**

```typescript
// 標準TypeScript：追加ライブラリ不要
// ビルド後のJSには型情報は含まれない

// Zod：約12KB（minified + gzipped）のライブラリが追加
// 単純な型チェックには過剰
```

## Zodが必要になるケース

### 1. **外部入力の検証**

```typescript
// APIリクエストの検証にはZodが有効
const UserSchema = z.object({
  email: z.string().email(),
  age: z.number().min(0).max(120),
  name: z.string().min(1).max(100)
});

// 外部からの入力を検証
app.post('/users', (req, res) => {
  try {
    const validatedData = UserSchema.parse(req.body);
    // 安全に処理
  } catch (error) {
    // バリデーションエラー
  }
});
```

### 2. **フォームバリデーション**

```typescript
// React Hook Form + Zod
const FormSchema = z.object({
  username: z.string().min(3, "3文字以上入力してください"),
  password: z.string().min(8, "8文字以上入力してください"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "パスワードが一致しません",
  path: ["confirmPassword"]
});
```

## 実践的な使い分け

```typescript
// ✅ 標準TypeScriptで十分な例
// 1. 内部的なエラー定義
const ErrorDefinitions = { ... } as const;

// 2. 設定ファイル
const Config = {
  api: { url: "...", timeout: 5000 },
  features: { darkMode: true }
} as const satisfies AppConfig;

// 3. 定数定義
const Routes = {
  home: "/",
  about: "/about"
} as const satisfies Record<string, string>;

// ❌ Zodが必要な例
// 1. APIレスポンスの検証
const ApiResponseSchema = z.object({
  data: z.array(z.unknown()),
  meta: z.object({
    total: z.number(),
    page: z.number()
  })
});

// 2. 環境変数の検証
const EnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.string().regex(/^\d+$/).transform(Number),
  NODE_ENV: z.enum(["development", "production", "test"])
});

// 3. ユーザー入力の検証
const SearchParamsSchema = z.object({
  q: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20)
});
```

## 結論

**エラー管理には標準TypeScriptを推奨**する理由：

1. **型安全性が同じ**：コンパイル時の保証で十分
2. **パフォーマンス**：実行時オーバーヘッドなし
3. **シンプル**：追加の依存関係不要
4. **開発体験**：型補完・推論が自然に動作

**Zodを使うべき場面**：
- 外部APIからのデータ
- ユーザー入力
- 環境変数
- ファイル読み込み
- 実行時に型が不明なデータ

つまり、**信頼できないデータ源からの入力にはZod**、**開発者が制御するコードには標準TypeScript**という使い分けが最適です。

エラー定義は完全に開発者が制御するコードなので、標準TypeScriptで実装するのがベストプラクティスです。

---

## 👤 ユーザー
*2025/6/10 1:29:01*

ちょっとzodを使った場合の例をもう少し掘り下げてほしい

---

## 🤖 アシスタント
*2025/6/10 1:30:10*

Zodを使ったエラー管理システムの詳細な実装例を紹介します。

## Zodを使ったエラー管理の実装

```typescript
import { z } from 'zod';

// エラーコードの定義（Zodのenumを使用）
const ErrorCodeSchema = z.enum([
  "AUTH_INVALID_CREDENTIALS",
  "AUTH_TOKEN_EXPIRED",
  "AUTH_INSUFFICIENT_PERMISSIONS",
  "VALIDATION_REQUIRED_FIELD",
  "VALIDATION_INVALID_FORMAT",
  "VALIDATION_OUT_OF_RANGE",
  "RESOURCE_NOT_FOUND",
  "RESOURCE_ALREADY_EXISTS",
  "RESOURCE_LIMIT_EXCEEDED"
]);

type ErrorCode = z.infer<typeof ErrorCodeSchema>;

// 各エラーのパラメータスキーマを定義
const ErrorParamSchemas = {
  AUTH_INVALID_CREDENTIALS: z.object({}),
  
  AUTH_TOKEN_EXPIRED: z.object({
    expiredAt: z.date()
  }),
  
  AUTH_INSUFFICIENT_PERMISSIONS: z.object({
    resource: z.string(),
    requiredRole: z.string()
  }),
  
  VALIDATION_REQUIRED_FIELD: z.object({
    fieldName: z.string()
  }),
  
  VALIDATION_INVALID_FORMAT: z.object({
    fieldName: z.string(),
    expectedFormat: z.string(),
    actualValue: z.string().optional() // 実際の値（ログ用）
  }),
  
  VALIDATION_OUT_OF_RANGE: z.object({
    fieldName: z.string(),
    min: z.number(),
    max: z.number(),
    actual: z.number().optional()
  }),
  
  RESOURCE_NOT_FOUND: z.object({
    resourceType: z.string(),
    resourceId: z.string()
  }),
  
  RESOURCE_ALREADY_EXISTS: z.object({
    resourceType: z.string(),
    identifier: z.string()
  }),
  
  RESOURCE_LIMIT_EXCEEDED: z.object({
    resourceType: z.string(),
    limit: z.number().int().positive(),
    current: z.number().int().nonnegative()
  })
} as const;

// エラー定義（メッセージとステータスコード）
const ErrorDefinitions = {
  AUTH_INVALID_CREDENTIALS: {
    message: "メールアドレスまたはパスワードが正しくありません",
    statusCode: 401
  },
  AUTH_TOKEN_EXPIRED: {
    message: "認証トークンの有効期限が切れています",
    statusCode: 401
  },
  AUTH_INSUFFICIENT_PERMISSIONS: {
    message: "{resource}へのアクセス権限がありません",
    statusCode: 403
  },
  VALIDATION_REQUIRED_FIELD: {
    message: "{fieldName}は必須項目です",
    statusCode: 400
  },
  VALIDATION_INVALID_FORMAT: {
    message: "{fieldName}の形式が正しくありません。{expectedFormat}の形式で入力してください",
    statusCode: 400
  },
  VALIDATION_OUT_OF_RANGE: {
    message: "{fieldName}は{min}から{max}の範囲で入力してください",
    statusCode: 400
  },
  RESOURCE_NOT_FOUND: {
    message: "{resourceType} (ID: {resourceId}) が見つかりません",
    statusCode: 404
  },
  RESOURCE_ALREADY_EXISTS: {
    message: "{resourceType}は既に存在します: {identifier}",
    statusCode: 409
  },
  RESOURCE_LIMIT_EXCEEDED: {
    message: "{resourceType}の上限（{limit}個）に達しています",
    statusCode: 429
  }
} as const;
```

## Zodベースのエラークラス

```typescript
// 型ヘルパー
type ErrorParams<T extends ErrorCode> = z.infer<typeof ErrorParamSchemas[T]>;

class ZodAppError<T extends ErrorCode = ErrorCode> extends Error {
  public readonly code: T;
  public readonly params: ErrorParams<T>;
  public readonly statusCode: number;
  private readonly timestamp: Date;
  
  constructor(code: T, params: unknown) {
    super();
    this.name = 'AppError';
    this.code = code;
    this.timestamp = new Date();
    
    // Zodでパラメータを検証
    try {
      this.params = ErrorParamSchemas[code].parse(params) as ErrorParams<T>;
    } catch (zodError) {
      // パラメータ検証エラーの場合
      console.error(`Invalid error parameters for ${code}:`, zodError);
      throw new Error(`Invalid error parameters: ${zodError.message}`);
    }
    
    this.statusCode = ErrorDefinitions[code].statusCode;
    this.message = this.getFormattedMessage();
  }
  
  private getFormattedMessage(): string {
    let message = ErrorDefinitions[this.code].message;
    
    // パラメータを使ってメッセージを整形
    Object.entries(this.params).forEach(([key, value]) => {
      if (typeof value !== 'undefined') {
        message = message.replace(`{${key}}`, String(value));
      }
    });
    
    return message;
  }
  
  toJSON() {
    return {
      code: this.code,
      message: this.message,
      params: this.params,
      statusCode: this.statusCode,
      timestamp: this.timestamp.toISOString()
    };
  }
}
```

## Zodの高度な機能を活用

```typescript
// カスタムバリデーションルール
const AdvancedErrorSchemas = {
  VALIDATION_EMAIL: z.object({
    email: z.string().email("有効なメールアドレスを入力してください"),
    suggestion: z.string().optional()
  }),
  
  VALIDATION_PASSWORD: z.object({
    issues: z.array(z.enum([
      "TOO_SHORT",
      "NO_UPPERCASE",
      "NO_LOWERCASE",
      "NO_NUMBER",
      "NO_SPECIAL_CHAR"
    ])),
    minLength: z.number().default(8)
  }),
  
  VALIDATION_DATE_RANGE: z.object({
    startDate: z.date(),
    endDate: z.date(),
    fieldName: z.string()
  }).refine(data => data.startDate <= data.endDate, {
    message: "開始日は終了日以前である必要があります"
  }),
  
  API_RATE_LIMIT: z.object({
    limit: z.number(),
    window: z.enum(["second", "minute", "hour", "day"]),
    retryAfter: z.number(),
    endpoint: z.string().regex(/^\/api\/.*/)
  })
};

// 複合エラー情報
const DetailedErrorSchema = z.object({
  code: ErrorCodeSchema,
  params: z.record(z.unknown()),
  context: z.object({
    userId: z.string().optional(),
    requestId: z.string().uuid(),
    userAgent: z.string().optional(),
    ip: z.string().ip().optional()
  }).optional(),
  metadata: z.record(z.unknown()).optional()
});
```

## 実践的な使用例

```typescript
// 1. APIエンドポイントでの使用
const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(100),
  age: z.number().int().min(13).max(120)
});

async function createUser(data: unknown) {
  // 入力検証
  const result = CreateUserSchema.safeParse(data);
  
  if (!result.success) {
    // Zodのエラーから適切なAppErrorを生成
    const issue = result.error.issues[0];
    
    if (issue.code === 'too_small') {
      throw new ZodAppError('VALIDATION_OUT_OF_RANGE', {
        fieldName: issue.path.join('.'),
        min: issue.minimum,
        max: 120, // ageの場合
        actual: data[issue.path[0]]
      });
    }
    
    if (issue.code === 'invalid_type') {
      throw new ZodAppError('VALIDATION_REQUIRED_FIELD', {
        fieldName: issue.path.join('.')
      });
    }
  }
  
  // ビジネスロジック
  const exists = await checkUserExists(result.data.email);
  if (exists) {
    throw new ZodAppError('RESOURCE_ALREADY_EXISTS', {
      resourceType: 'ユーザー',
      identifier: result.data.email
    });
  }
}
```

## エラーファクトリーパターン

```typescript
// Zodスキーマを使った型安全なエラーファクトリー
class ErrorFactory {
  // メソッドごとに正確な型を提供
  static validationRequired(fieldName: string) {
    return new ZodAppError('VALIDATION_REQUIRED_FIELD', { fieldName });
  }
  
  static validationOutOfRange(
    fieldName: string,
    min: number,
    max: number,
    actual?: number
  ) {
    // Zodが自動的に型をチェック
    return new ZodAppError('VALIDATION_OUT_OF_RANGE', {
      fieldName,
      min,
      max,
      actual
    });
  }
  
  static fromZodError(zodError: z.ZodError): ZodAppError {
    const issue = zodError.issues[0];
    const fieldName = issue.path.join('.');
    
    switch (issue.code) {
      case 'too_small':
        return this.validationOutOfRange(
          fieldName,
          issue.minimum as number,
          Number.MAX_SAFE_INTEGER
        );
        
      case 'invalid_type':
        if (issue.expected === 'string' && issue.received === 'undefined') {
          return this.validationRequired(fieldName);
        }
        return new ZodAppError('VALIDATION_INVALID_FORMAT', {
          fieldName,
          expectedFormat: issue.expected,
          actualValue: String(issue.received)
        });
        
      default:
        // フォールバック
        return new ZodAppError('VALIDATION_INVALID_FORMAT', {
          fieldName,
          expectedFormat: 'valid input',
          actualValue: issue.message
        });
    }
  }
}
```

## 実行時の型変換と検証

```typescript
// 環境変数の検証とエラー処理
const EnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url().optional(),
  PORT: z.string().regex(/^\d+$/).transform(Number),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']),
  RATE_LIMIT: z.string().transform((val) => {
    const num = parseInt(val, 10);
    if (isNaN(num) || num <= 0) {
      throw new ZodAppError('VALIDATION_OUT_OF_RANGE', {
        fieldName: 'RATE_LIMIT',
        min: 1,
        max: 10000,
        actual: num
      });
    }
    return num;
  })
});

// 使用例
try {
  const env = EnvSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    const appError = ErrorFactory.fromZodError(error);
    console.error('環境変数の検証エラー:', appError.toJSON());
    process.exit(1);
  }
  throw error;
}
```

## Zodを使うメリット・デメリット

### メリット
```typescript
// 1. 実行時の型安全性
const untrustedData = JSON.parse(request.body);
const validated = ErrorParamSchemas.RESOURCE_NOT_FOUND.parse(untrustedData);
// ここで validated は完全に型安全

// 2. 詳細なエラー情報
try {
  schema.parse(data);
} catch (e) {
  if (e instanceof z.ZodError) {
    console.log(e.issues); // 全ての検証エラーを取得
  }
}

// 3. 変換機能
const PortSchema = z.string().transform(Number);
const port = PortSchema.parse("3000"); // number型の3000

// 4. 合成と再利用
const BaseUserSchema = z.object({ name: z.string() });
const AdminSchema = BaseUserSchema.extend({ role: z.literal('admin') });
```

### デメリット
```typescript
// 1. パフォーマンスオーバーヘッド
// 毎回parseが実行される

// 2. バンドルサイズ増加
// zodは約12KB追加

// 3. 型推論の制限
// 一部の複雑な型で推論が効かないことがある
```

## まとめ

**Zodを使うべきケース**：
- 外部APIとの通信
- フォームバリデーション
- 設定ファイルの読み込み
- 実行時の型変換が必要な場合

**標準TypeScriptで十分なケース**：
- 内部的なエラー定義
- 開発者が完全に制御するコード
- パフォーマンスが重要な箇所

エラー管理においては、**外部入力を扱う境界でZod**を使い、**内部的なエラー定義は標準TypeScript**という使い分けが理想的です。

---

## 👤 ユーザー
*2025/6/10 1:31:45*

as const satisfiesを使ってほしい
また宣言した変数には必ず型を定義してほしい

---

## 🤖 アシスタント
*2025/6/10 1:33:11*

as const satisfiesを使った、型定義を明確にしたエラー管理システムを実装します。

## Zodを使ったエラー管理（as const satisfies版）

```typescript
import { z } from 'zod';

// エラーコードの定義
const ErrorCodes = [
  "AUTH_INVALID_CREDENTIALS",
  "AUTH_TOKEN_EXPIRED",
  "AUTH_INSUFFICIENT_PERMISSIONS",
  "VALIDATION_REQUIRED_FIELD",
  "VALIDATION_INVALID_FORMAT",
  "VALIDATION_OUT_OF_RANGE",
  "RESOURCE_NOT_FOUND",
  "RESOURCE_ALREADY_EXISTS",
  "RESOURCE_LIMIT_EXCEEDED"
] as const satisfies readonly string[];

const ErrorCodeSchema: z.ZodEnum<typeof ErrorCodes> = z.enum(ErrorCodes);
type ErrorCode = z.infer<typeof ErrorCodeSchema>;

// 各エラーのパラメータスキーマを定義
const ErrorParamSchemas = {
  AUTH_INVALID_CREDENTIALS: z.object({}),
  
  AUTH_TOKEN_EXPIRED: z.object({
    expiredAt: z.date()
  }),
  
  AUTH_INSUFFICIENT_PERMISSIONS: z.object({
    resource: z.string(),
    requiredRole: z.string()
  }),
  
  VALIDATION_REQUIRED_FIELD: z.object({
    fieldName: z.string()
  }),
  
  VALIDATION_INVALID_FORMAT: z.object({
    fieldName: z.string(),
    expectedFormat: z.string(),
    actualValue: z.string().optional()
  }),
  
  VALIDATION_OUT_OF_RANGE: z.object({
    fieldName: z.string(),
    min: z.number(),
    max: z.number(),
    actual: z.number().optional()
  }),
  
  RESOURCE_NOT_FOUND: z.object({
    resourceType: z.string(),
    resourceId: z.string()
  }),
  
  RESOURCE_ALREADY_EXISTS: z.object({
    resourceType: z.string(),
    identifier: z.string()
  }),
  
  RESOURCE_LIMIT_EXCEEDED: z.object({
    resourceType: z.string(),
    limit: z.number().int().positive(),
    current: z.number().int().nonnegative()
  })
} as const satisfies Record<ErrorCode, z.ZodSchema>;

// エラー定義（メッセージとステータスコード）
const ErrorDefinitions = {
  AUTH_INVALID_CREDENTIALS: {
    message: "メールアドレスまたはパスワードが正しくありません",
    statusCode: 401,
    logLevel: "warn"
  },
  AUTH_TOKEN_EXPIRED: {
    message: "認証トークンの有効期限が切れています",
    statusCode: 401,
    logLevel: "info"
  },
  AUTH_INSUFFICIENT_PERMISSIONS: {
    message: "{resource}へのアクセス権限がありません",
    statusCode: 403,
    logLevel: "warn"
  },
  VALIDATION_REQUIRED_FIELD: {
    message: "{fieldName}は必須項目です",
    statusCode: 400,
    logLevel: "info"
  },
  VALIDATION_INVALID_FORMAT: {
    message: "{fieldName}の形式が正しくありません。{expectedFormat}の形式で入力してください",
    statusCode: 400,
    logLevel: "info"
  },
  VALIDATION_OUT_OF_RANGE: {
    message: "{fieldName}は{min}から{max}の範囲で入力してください",
    statusCode: 400,
    logLevel: "info"
  },
  RESOURCE_NOT_FOUND: {
    message: "{resourceType} (ID: {resourceId}) が見つかりません",
    statusCode: 404,
    logLevel: "info"
  },
  RESOURCE_ALREADY_EXISTS: {
    message: "{resourceType}は既に存在します: {identifier}",
    statusCode: 409,
    logLevel: "warn"
  },
  RESOURCE_LIMIT_EXCEEDED: {
    message: "{resourceType}の上限（{limit}個）に達しています",
    statusCode: 429,
    logLevel: "warn"
  }
} as const satisfies Record<ErrorCode, {
  message: string;
  statusCode: number;
  logLevel: "debug" | "info" | "warn" | "error";
}>;

// 型ヘルパー
type ErrorParams<T extends ErrorCode> = z.infer<typeof ErrorParamSchemas[T]>;
type ErrorDefinition<T extends ErrorCode> = typeof ErrorDefinitions[T];
```

## 高度なエラースキーマ定義

```typescript
// バリデーションルールの定義
const ValidationRules = {
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string()
    .min(8, "8文字以上入力してください")
    .regex(/[A-Z]/, "大文字を1文字以上含めてください")
    .regex(/[a-z]/, "小文字を1文字以上含めてください")
    .regex(/[0-9]/, "数字を1文字以上含めてください"),
  phoneNumber: z.string().regex(
    /^0\d{1,4}-\d{1,4}-\d{4}$/,
    "電話番号の形式が正しくありません"
  ),
  postalCode: z.string().regex(
    /^\d{3}-\d{4}$/,
    "郵便番号は123-4567の形式で入力してください"
  )
} as const satisfies Record<string, z.ZodSchema>;

// 複合エラー情報のスキーマ
const ErrorContextSchema = z.object({
  userId: z.string().uuid().optional(),
  requestId: z.string().uuid(),
  userAgent: z.string().optional(),
  ip: z.string().ip().optional(),
  timestamp: z.date()
}) satisfies z.ZodSchema;

const DetailedErrorSchema = z.object({
  code: ErrorCodeSchema,
  params: z.record(z.unknown()),
  context: ErrorContextSchema.optional(),
  metadata: z.record(z.unknown()).optional(),
  stack: z.string().optional()
}) satisfies z.ZodSchema;

type ErrorContext = z.infer<typeof ErrorContextSchema>;
type DetailedError = z.infer<typeof DetailedErrorSchema>;
```

## Zodベースのエラークラス（型定義を明確化）

```typescript
class ZodAppError<T extends ErrorCode = ErrorCode> extends Error {
  public readonly code: T;
  public readonly params: ErrorParams<T>;
  public readonly statusCode: number;
  public readonly logLevel: ErrorDefinition<T>["logLevel"];
  private readonly timestamp: Date;
  private readonly context?: ErrorContext;
  
  constructor(code: T, params: unknown, context?: unknown) {
    super();
    this.name = 'AppError';
    this.code = code;
    this.timestamp = new Date();
    
    // Zodでパラメータを検証
    const paramSchema: z.ZodSchema = ErrorParamSchemas[code];
    const parseResult: z.SafeParseReturnType<unknown, ErrorParams<T>> = 
      paramSchema.safeParse(params);
    
    if (!parseResult.success) {
      const errorMessage: string = `Invalid error parameters for ${code}: ${parseResult.error.message}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
    
    this.params = parseResult.data as ErrorParams<T>;
    
    // コンテキストの検証
    if (context) {
      const contextResult: z.SafeParseReturnType<unknown, ErrorContext> = 
        ErrorContextSchema.safeParse(context);
      if (contextResult.success) {
        this.context = contextResult.data;
      }
    }
    
    const definition: ErrorDefinition<T> = ErrorDefinitions[code];
    this.statusCode = definition.statusCode;
    this.logLevel = definition.logLevel;
    this.message = this.getFormattedMessage();
  }
  
  private getFormattedMessage(): string {
    let message: string = ErrorDefinitions[this.code].message;
    
    const params: Record<string, unknown> = this.params as Record<string, unknown>;
    Object.entries(params).forEach(([key, value]: [string, unknown]) => {
      if (value !== undefined) {
        message = message.replace(`{${key}}`, String(value));
      }
    });
    
    return message;
  }
  
  toJSON(): DetailedError {
    const json: DetailedError = {
      code: this.code,
      params: this.params as Record<string, unknown>,
      context: this.context,
      metadata: {
        statusCode: this.statusCode,
        logLevel: this.logLevel,
        timestamp: this.timestamp.toISOString()
      }
    };
    
    if (this.stack && process.env.NODE_ENV === 'development') {
      json.stack = this.stack;
    }
    
    return json;
  }
}
```

## 実践的なエラーファクトリー

```typescript
// エラー生成の設定
const ErrorFactoryConfig = {
  includeStack: process.env.NODE_ENV === 'development',
  defaultContext: {
    requestId: () => crypto.randomUUID(),
    timestamp: () => new Date()
  }
} as const satisfies {
  includeStack: boolean;
  defaultContext: Record<string, () => unknown>;
};

// 型安全なエラーファクトリー
class ErrorFactory {
  private static getDefaultContext(): Partial<ErrorContext> {
    const context: Partial<ErrorContext> = {
      requestId: ErrorFactoryConfig.defaultContext.requestId() as string,
      timestamp: ErrorFactoryConfig.defaultContext.timestamp() as Date
    };
    return context;
  }
  
  static validationRequired(fieldName: string, context?: Partial<ErrorContext>): ZodAppError<"VALIDATION_REQUIRED_FIELD"> {
    const params: ErrorParams<"VALIDATION_REQUIRED_FIELD"> = { fieldName };
    const fullContext: Partial<ErrorContext> = { ...this.getDefaultContext(), ...context };
    return new ZodAppError("VALIDATION_REQUIRED_FIELD", params, fullContext);
  }
  
  static validationOutOfRange(
    fieldName: string,
    min: number,
    max: number,
    actual?: number,
    context?: Partial<ErrorContext>
  ): ZodAppError<"VALIDATION_OUT_OF_RANGE"> {
    const params: ErrorParams<"VALIDATION_OUT_OF_RANGE"> = {
      fieldName,
      min,
      max,
      actual
    };
    const fullContext: Partial<ErrorContext> = { ...this.getDefaultContext(), ...context };
    return new ZodAppError("VALIDATION_OUT_OF_RANGE", params, fullContext);
  }
  
  static resourceNotFound(
    resourceType: string,
    resourceId: string,
    context?: Partial<ErrorContext>
  ): ZodAppError<"RESOURCE_NOT_FOUND"> {
    const params: ErrorParams<"RESOURCE_NOT_FOUND"> = {
      resourceType,
      resourceId
    };
    const fullContext: Partial<ErrorContext> = { ...this.getDefaultContext(), ...context };
    return new ZodAppError("RESOURCE_NOT_FOUND", params, fullContext);
  }
  
  static fromZodError(zodError: z.ZodError, context?: Partial<ErrorContext>): ZodAppError {
    const issue: z.ZodIssue = zodError.issues[0];
    const fieldName: string = issue.path.join('.');
    
    switch (issue.code) {
      case 'too_small': {
        const minValue: number = (issue as z.ZodIssueOptionalMessage & { minimum: number }).minimum;
        return this.validationOutOfRange(
          fieldName,
          minValue,
          Number.MAX_SAFE_INTEGER,
          undefined,
          context
        );
      }
        
      case 'invalid_type': {
        const typeIssue = issue as z.ZodInvalidTypeIssue;
        if (typeIssue.expected === 'string' && typeIssue.received === 'undefined') {
          return this.validationRequired(fieldName, context);
        }
        
        const params: ErrorParams<"VALIDATION_INVALID_FORMAT"> = {
          fieldName,
          expectedFormat: typeIssue.expected,
          actualValue: String(typeIssue.received)
        };
        return new ZodAppError("VALIDATION_INVALID_FORMAT", params, context);
      }
        
      default: {
        const params: ErrorParams<"VALIDATION_INVALID_FORMAT"> = {
          fieldName,
          expectedFormat: 'valid input',
          actualValue: issue.message
        };
        return new ZodAppError("VALIDATION_INVALID_FORMAT", params, context);
      }
    }
  }
}
```

## 実際の使用例

```typescript
// APIエンドポイントでの使用
const CreateUserSchema = z.object({
  email: ValidationRules.email,
  password: ValidationRules.password,
  name: z.string().min(1).max(100),
  age: z.number().int().min(13).max(120),
  phoneNumber: ValidationRules.phoneNumber.optional()
}) satisfies z.ZodSchema;

type CreateUserInput = z.infer<typeof CreateUserSchema>;

async function createUser(data: unknown, context: ErrorContext): Promise<User> {
  // 入力検証
  const parseResult: z.SafeParseReturnType<unknown, CreateUserInput> = 
    CreateUserSchema.safeParse(data);
  
  if (!parseResult.success) {
    throw ErrorFactory.fromZodError(parseResult.error, context);
  }
  
  const validatedData: CreateUserInput = parseResult.data;
  
  // ビジネスロジック
  const existingUser: User | null = await db.users.findByEmail(validatedData.email);
  if (existingUser) {
    throw new ZodAppError(
      "RESOURCE_ALREADY_EXISTS",
      {
        resourceType: "ユーザー",
        identifier: validatedData.email
      },
      context
    );
  }
  
  // ユーザー作成
  const newUser: User = await db.users.create(validatedData);
  return newUser;
}
```

## エラーハンドリングミドルウェア

```typescript
// Express用のエラーハンドラー
const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const context: ErrorContext = {
    requestId: req.id || crypto.randomUUID(),
    userId: req.user?.id,
    userAgent: req.headers['user-agent'],
    ip: req.ip,
    timestamp: new Date()
  };
  
  if (error instanceof ZodAppError) {
    const errorResponse: DetailedError = error.toJSON();
    
    // ログ出力
    const logData: Record<string, unknown> = {
      ...errorResponse,
      url: req.url,
      method: req.method,
      headers: req.headers
    };
    
    logger[error.logLevel](logData);
    
    res.status(error.statusCode).json({
      error: errorResponse
    });
    return;
  }
  
  // 予期しないエラー
  const systemError: ZodAppError<"SYSTEM_INTERNAL_ERROR"> = new ZodAppError(
    "SYSTEM_INTERNAL_ERROR",
    {
      errorId: context.requestId,
      timestamp: context.timestamp
    },
    context
  );
  
  logger.error('Unhandled error:', error);
  res.status(500).json({ error: systemError.toJSON() });
};
```

## 高度なバリデーションパターン

```typescript
// 複合バリデーション
const DateRangeSchema = z.object({
  startDate: z.date(),
  endDate: z.date()
}).refine(
  (data): boolean => data.startDate <= data.endDate,
  {
    message: "開始日は終了日以前である必要があります",
    path: ["endDate"]
  }
) satisfies z.ZodSchema;

// カスタムエラーマッピング
const ErrorMappingRules = {
  "email": {
    "invalid_string": "メールアドレスの形式が正しくありません",
    "too_small": "メールアドレスを入力してください"
  },
  "password": {
    "too_small": "パスワードは8文字以上で入力してください",
    "invalid_string": "パスワードの形式が正しくありません"
  }
} as const satisfies Record<string, Record<string, string>>;

// バリデーションヘルパー
function validateWithCustomErrors<T extends z.ZodSchema>(
  schema: T,
  data: unknown,
  fieldMappings: Record<string, string> = {}
): z.infer<T> {
  const result: z.SafeParseReturnType<unknown, z.infer<T>> = schema.safeParse(data);
  
  if (!result.success) {
    const issue: z.ZodIssue = result.error.issues[0];
    const fieldName: string = fieldMappings[issue.path[0]] || issue.path.join('.');
    const customMessage: string | undefined = 
      ErrorMappingRules[issue.path[0]]?.[issue.code];
    
    if (customMessage) {
      throw new ZodAppError("VALIDATION_INVALID_FORMAT", {
        fieldName,
        expectedFormat: customMessage,
        actualValue: String(data[issue.path[0]])
      });
    }
    
    throw ErrorFactory.fromZodError(result.error);
  }
  
  return result.data;
}
```

## まとめ

この実装では：

1. **as const satisfies**を全面的に使用して型安全性を確保
2. **すべての変数に明示的な型定義**を追加
3. **Zodのスキーマも型として定義**してから使用
4. **エラーコンテキストの追加**で詳細なエラー情報を提供
5. **ログレベルの管理**でエラーの重要度を制御

これにより、Zodの実行時検証の利点を活かしながら、TypeScriptの型システムも最大限に活用できます。

---

## 👤 ユーザー
*2025/6/10 1:33:31*

オリジナルクラスを生成する時はinitを使うべきか関数を生やすべきか？

---

## 🤖 アシスタント
*2025/6/10 1:34:29*

オリジナルクラスの生成方法について、それぞれのパターンとメリット・デメリットを詳しく説明します。

## 1. コンストラクタ（new）パターン

```typescript
// 基本的なコンストラクタパターン
class User {
  public readonly id: string;
  public readonly email: string;
  public readonly name: string;
  private readonly createdAt: Date;
  
  constructor(params: {
    id: string;
    email: string;
    name: string;
    createdAt?: Date;
  }) {
    this.id = params.id;
    this.email = params.email;
    this.name = params.name;
    this.createdAt = params.createdAt ?? new Date();
  }
}

// 使用例
const user: User = new User({
  id: "user-123",
  email: "test@example.com",
  name: "田中太郎"
});
```

## 2. 静的ファクトリーメソッドパターン

```typescript
class User {
  private constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    private readonly createdAt: Date
  ) {}
  
  // 基本的な生成メソッド
  static create(params: {
    email: string;
    name: string;
  }): User {
    const id: string = crypto.randomUUID();
    const createdAt: Date = new Date();
    
    return new User(id, params.email, params.name, createdAt);
  }
  
  // DBからの復元用
  static fromDatabase(data: {
    id: string;
    email: string;
    name: string;
    created_at: string;
  }): User {
    return new User(
      data.id,
      data.email,
      data.name,
      new Date(data.created_at)
    );
  }
  
  // JSONからの復元
  static fromJSON(json: string): User {
    const data = JSON.parse(json);
    return User.fromDatabase(data);
  }
}

// 使用例
const newUser: User = User.create({
  email: "test@example.com",
  name: "田中太郎"
});

const existingUser: User = User.fromDatabase({
  id: "user-123",
  email: "test@example.com",
  name: "田中太郎",
  created_at: "2024-01-01T00:00:00Z"
});
```

## 3. 非同期初期化が必要な場合

```typescript
class DatabaseConnection {
  private constructor(
    private readonly client: DatabaseClient,
    private readonly config: DatabaseConfig
  ) {}
  
  // 非同期の初期化が必要な場合は静的メソッドを使う
  static async create(config: DatabaseConfig): Promise<DatabaseConnection> {
    const client: DatabaseClient = new DatabaseClient(config);
    
    // 接続の確立
    await client.connect();
    
    // 接続テスト
    await client.query('SELECT 1');
    
    return new DatabaseConnection(client, config);
  }
  
  async close(): Promise<void> {
    await this.client.disconnect();
  }
}

// 使用例
const db: DatabaseConnection = await DatabaseConnection.create({
  host: "localhost",
  port: 5432,
  database: "myapp"
});
```

## 4. バリデーション付きファクトリーパターン

```typescript
// Result型の定義
type Result<T, E> = 
  | { success: true; value: T }
  | { success: false; error: E };

class Email {
  private constructor(public readonly value: string) {}
  
  // バリデーション付きファクトリー
  static create(value: string): Result<Email, string> {
    const trimmed: string = value.trim().toLowerCase();
    
    if (!trimmed) {
      return { success: false, error: "メールアドレスは必須です" };
    }
    
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return { success: false, error: "メールアドレスの形式が正しくありません" };
    }
    
    return { success: true, value: new Email(trimmed) };
  }
  
  // unsafe版（テスト用など）
  static unsafeCreate(value: string): Email {
    return new Email(value);
  }
}

// 使用例
const emailResult: Result<Email, string> = Email.create("test@example.com");
if (emailResult.success) {
  const email: Email = emailResult.value;
  console.log(email.value);
} else {
  console.error(emailResult.error);
}
```

## 5. ビルダーパターンとの組み合わせ

```typescript
class Order {
  private constructor(
    public readonly id: string,
    public readonly customerId: string,
    public readonly items: readonly OrderItem[],
    public readonly status: OrderStatus,
    public readonly createdAt: Date,
    public readonly metadata: Record<string, unknown>
  ) {}
  
  static builder(): OrderBuilder {
    return new OrderBuilder();
  }
}

class OrderBuilder {
  private id?: string;
  private customerId?: string;
  private items: OrderItem[] = [];
  private status: OrderStatus = OrderStatus.Pending;
  private metadata: Record<string, unknown> = {};
  
  setCustomerId(customerId: string): this {
    this.customerId = customerId;
    return this;
  }
  
  addItem(item: OrderItem): this {
    this.items.push(item);
    return this;
  }
  
  setMetadata(key: string, value: unknown): this {
    this.metadata[key] = value;
    return this;
  }
  
  build(): Result<Order, string[]> {
    const errors: string[] = [];
    
    if (!this.customerId) {
      errors.push("顧客IDは必須です");
    }
    
    if (this.items.length === 0) {
      errors.push("商品が選択されていません");
    }
    
    if (errors.length > 0) {
      return { success: false, error: errors };
    }
    
    const order: Order = new Order(
      this.id ?? crypto.randomUUID(),
      this.customerId!,
      Object.freeze(this.items),
      this.status,
      new Date(),
      Object.freeze(this.metadata)
    );
    
    return { success: true, value: order };
  }
}

// 使用例
const orderResult = Order.builder()
  .setCustomerId("customer-123")
  .addItem({ productId: "prod-1", quantity: 2, price: 1000 })
  .addItem({ productId: "prod-2", quantity: 1, price: 2000 })
  .setMetadata("source", "web")
  .build();
```

## 使い分けの指針

### コンストラクタ（new）を使うべき場合

```typescript
// 1. シンプルなデータホルダー
class Point {
  constructor(
    public readonly x: number,
    public readonly y: number
  ) {}
}

// 2. 依存性注入を使う場合
@Injectable()
class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService
  ) {}
}

// 3. フレームワークの規約に従う場合
class UserEntity extends Entity {
  constructor(props: UserProps) {
    super(props);
  }
}
```

### 静的ファクトリーメソッドを使うべき場合

```typescript
// 1. 複数の生成方法がある
class DateTime {
  private constructor(private readonly date: Date) {}
  
  static now(): DateTime {
    return new DateTime(new Date());
  }
  
  static fromTimestamp(timestamp: number): DateTime {
    return new DateTime(new Date(timestamp));
  }
  
  static fromISO(iso: string): DateTime {
    return new DateTime(new Date(iso));
  }
}

// 2. 生成時にバリデーションが必要
class Age {
  private constructor(private readonly value: number) {}
  
  static create(value: number): Result<Age, string> {
    if (value < 0 || value > 150) {
      return { success: false, error: "年齢は0〜150の範囲で入力してください" };
    }
    return { success: true, value: new Age(value) };
  }
}

// 3. 非同期初期化が必要
class FileReader {
  private constructor(private readonly handle: FileHandle) {}
  
  static async open(path: string): Promise<FileReader> {
    const handle: FileHandle = await fs.open(path, 'r');
    return new FileReader(handle);
  }
}

// 4. インスタンスのキャッシュが必要
class Color {
  private static cache = new Map<string, Color>();
  
  private constructor(private readonly hex: string) {}
  
  static fromHex(hex: string): Color {
    const normalized: string = hex.toLowerCase();
    
    if (!Color.cache.has(normalized)) {
      Color.cache.set(normalized, new Color(normalized));
    }
    
    return Color.cache.get(normalized)!;
  }
}
```

## 実践的な例：ドメインモデル

```typescript
// ユーザーエンティティの実装例
class User {
  private constructor(
    public readonly id: UserId,
    public readonly email: Email,
    public readonly name: UserName,
    public readonly status: UserStatus,
    private readonly hashedPassword: HashedPassword,
    private readonly createdAt: Date,
    private readonly updatedAt: Date
  ) {}
  
  // 新規作成
  static async create(params: {
    email: string;
    name: string;
    password: string;
  }): Promise<Result<User, string[]>> {
    const errors: string[] = [];
    
    // バリデーション
    const emailResult = Email.create(params.email);
    if (!emailResult.success) {
      errors.push(emailResult.error);
    }
    
    const nameResult = UserName.create(params.name);
    if (!nameResult.success) {
      errors.push(nameResult.error);
    }
    
    const passwordResult = await HashedPassword.create(params.password);
    if (!passwordResult.success) {
      errors.push(passwordResult.error);
    }
    
    if (errors.length > 0) {
      return { success: false, error: errors };
    }
    
    const now: Date = new Date();
    const user: User = new User(
      UserId.generate(),
      emailResult.value,
      nameResult.value,
      UserStatus.Active,
      passwordResult.value,
      now,
      now
    );
    
    return { success: true, value: user };
  }
  
  // 復元
  static reconstitute(data: {
    id: string;
    email: string;
    name: string;
    status: string;
    hashedPassword: string;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User(
      UserId.from(data.id),
      Email.unsafeCreate(data.email),
      UserName.unsafeCreate(data.name),
      data.status as UserStatus,
      HashedPassword.unsafeCreate(data.hashedPassword),
      data.createdAt,
      data.updatedAt
    );
  }
  
  // ビジネスロジック
  changeEmail(newEmail: Email): Result<User, string> {
    if (this.status !== UserStatus.Active) {
      return { success: false, error: "無効なユーザーはメールアドレスを変更できません" };
    }
    
    return {
      success: true,
      value: new User(
        this.id,
        newEmail,
        this.name,
        this.status,
        this.hashedPassword,
        this.createdAt,
        new Date()
      )
    };
  }
}
```

## まとめ

**コンストラクタを使う場合**：
- シンプルなデータクラス
- DIコンテナを使用
- フレームワークの規約

**静的ファクトリーメソッドを使う場合**：
- 複数の生成方法
- バリデーションが必要
- 非同期初期化
- インスタンスキャッシュ
- 生成ロジックが複雑

**一般的な推奨**：
- ドメインモデル → 静的ファクトリー
- DTOやエンティティ → コンストラクタ
- 値オブジェクト → 静的ファクトリー
- サービスクラス → コンストラクタ（DI）

重要なのは、**チーム内で一貫性を保つこと**と、**各パターンの利点を理解して適切に使い分けること**です。

---

## 👤 ユーザー
*2025/6/10 1:35:47*

Errorの拡張クラスの場合は？

---

## 🤖 アシスタント
*2025/6/10 1:36:49*

Error拡張クラスの場合は、**コンストラクタ（new）を使うのが標準的**です。ただし、用途に応じて静的ファクトリーメソッドも併用すると便利です。

## 基本的なError拡張パターン

```typescript
// 1. 基本的なコンストラクタパターン（推奨）
class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly timestamp: Date;
  
  constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR') {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.timestamp = new Date();
    
    // スタックトレースの修正（V8エンジン用）
    Error.captureStackTrace(this, this.constructor);
  }
}

// 使用例
throw new AppError('Something went wrong', 500, 'INTERNAL_ERROR');
```

## なぜErrorクラスはコンストラクタを使うべきか

### 1. **JavaScriptの慣習との一貫性**

```typescript
// 標準エラーもすべてnewで生成
throw new Error('Standard error');
throw new TypeError('Type error');
throw new RangeError('Range error');

// カスタムエラーも同じパターンに従うべき
throw new AppError('Custom error');
```

### 2. **スタックトレースの正確性**

```typescript
class ValidationError extends Error {
  constructor(public readonly field: string, message: string) {
    super(message);
    this.name = 'ValidationError';
    
    // コンストラクタ内でスタックトレースを設定
    // これにより正確なエラー発生箇所が記録される
    Error.captureStackTrace(this, ValidationError);
  }
}

// スタックトレースが正確に記録される
function validateEmail(email: string): void {
  if (!email.includes('@')) {
    throw new ValidationError('email', 'Invalid email format'); // ← この行が記録される
  }
}
```

## 実践的なError拡張パターン

### 1. **型安全なエラーシステム**

```typescript
// エラーコードの定義
const ErrorCodes = {
  // 認証系
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  
  // バリデーション系
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',
  
  // リソース系
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  
  // システム系
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE'
} as const;

type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];

// 基底エラークラス
class BaseError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly timestamp: Date;
  public readonly context?: Record<string, unknown>;
  
  constructor(
    message: string,
    code: ErrorCode,
    statusCode: number,
    context?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.timestamp = new Date();
    this.context = context;
    
    Error.captureStackTrace(this, this.constructor);
  }
  
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      timestamp: this.timestamp.toISOString(),
      context: this.context,
      ...(process.env.NODE_ENV === 'development' && { stack: this.stack })
    };
  }
}
```

### 2. **特化型エラークラス**

```typescript
// 認証エラー
class AuthenticationError extends BaseError {
  constructor(message: string = '認証に失敗しました', context?: Record<string, unknown>) {
    super(message, ErrorCodes.UNAUTHORIZED, 401, context);
  }
  
  // 静的ファクトリーメソッドで一般的なケースを提供
  static invalidCredentials(): AuthenticationError {
    return new AuthenticationError('メールアドレスまたはパスワードが正しくありません');
  }
  
  static tokenExpired(expiredAt: Date): AuthenticationError {
    return new AuthenticationError('認証トークンの有効期限が切れています', {
      expiredAt: expiredAt.toISOString()
    });
  }
}

// バリデーションエラー
class ValidationError extends BaseError {
  public readonly errors: ValidationErrorDetail[];
  
  constructor(errors: ValidationErrorDetail[], message?: string) {
    const errorMessage = message || `${errors.length}個のバリデーションエラーがあります`;
    super(errorMessage, ErrorCodes.VALIDATION_ERROR, 400, { errors });
    this.errors = errors;
  }
  
  // 単一フィールドのエラー用ファクトリー
  static field(field: string, message: string): ValidationError {
    return new ValidationError([{ field, message }]);
  }
  
  // 複数エラーの集約
  static combine(...errors: ValidationError[]): ValidationError {
    const allErrors: ValidationErrorDetail[] = errors.flatMap(e => e.errors);
    return new ValidationError(allErrors);
  }
}

interface ValidationErrorDetail {
  field: string;
  message: string;
  value?: unknown;
}
```

### 3. **リソースエラー**

```typescript
// リソース関連のエラー
class ResourceError extends BaseError {
  constructor(
    message: string,
    code: ErrorCode,
    public readonly resourceType: string,
    public readonly resourceId?: string
  ) {
    super(message, code, code === ErrorCodes.NOT_FOUND ? 404 : 409, {
      resourceType,
      resourceId
    });
  }
  
  static notFound(resourceType: string, resourceId: string): ResourceError {
    return new ResourceError(
      `${resourceType} (ID: ${resourceId}) が見つかりません`,
      ErrorCodes.NOT_FOUND,
      resourceType,
      resourceId
    );
  }
  
  static alreadyExists(resourceType: string, identifier: string): ResourceError {
    return new ResourceError(
      `${resourceType} は既に存在します: ${identifier}`,
      ErrorCodes.ALREADY_EXISTS,
      resourceType,
      identifier
    );
  }
}
```

### 4. **ビジネスロジックエラー**

```typescript
// ドメイン固有のエラー
class BusinessRuleError extends BaseError {
  constructor(
    message: string,
    public readonly rule: string,
    context?: Record<string, unknown>
  ) {
    super(message, ErrorCodes.VALIDATION_ERROR, 422, { ...context, rule });
  }
}

// 使用例
class InsufficientBalanceError extends BusinessRuleError {
  constructor(
    public readonly currentBalance: number,
    public readonly requiredAmount: number
  ) {
    super(
      `残高が不足しています。現在の残高: ${currentBalance}円, 必要額: ${requiredAmount}円`,
      'INSUFFICIENT_BALANCE',
      { currentBalance, requiredAmount }
    );
  }
}
```

## エラーハンドリングのベストプラクティス

```typescript
// エラーハンドリングユーティリティ
class ErrorHandler {
  // エラータイプの判定
  static isAuthError(error: unknown): error is AuthenticationError {
    return error instanceof AuthenticationError;
  }
  
  static isValidationError(error: unknown): error is ValidationError {
    return error instanceof ValidationError;
  }
  
  static isResourceError(error: unknown): error is ResourceError {
    return error instanceof ResourceError;
  }
  
  // HTTPレスポンスへの変換
  static toHttpResponse(error: unknown): {
    statusCode: number;
    body: Record<string, unknown>;
  } {
    if (error instanceof BaseError) {
      return {
        statusCode: error.statusCode,
        body: error.toJSON()
      };
    }
    
    // 予期しないエラー
    console.error('Unexpected error:', error);
    return {
      statusCode: 500,
      body: {
        code: ErrorCodes.INTERNAL_ERROR,
        message: 'Internal server error',
        timestamp: new Date().toISOString()
      }
    };
  }
}

// 使用例
try {
  await someOperation();
} catch (error) {
  if (ErrorHandler.isValidationError(error)) {
    // バリデーションエラー固有の処理
    console.log('Validation errors:', error.errors);
  }
  
  const response = ErrorHandler.toHttpResponse(error);
  res.status(response.statusCode).json(response.body);
}
```

## 非同期処理での注意点

```typescript
// 非同期エラーの適切な処理
class AsyncOperationError extends BaseError {
  constructor(
    message: string,
    public readonly operation: string,
    public readonly cause?: Error
  ) {
    super(
      message,
      ErrorCodes.INTERNAL_ERROR,
      500,
      { operation, cause: cause?.message }
    );
    
    // 元のエラーのスタックトレースを保持
    if (cause?.stack) {
      this.stack = `${this.stack}\nCaused by: ${cause.stack}`;
    }
  }
  
  // 非同期操作のラップ
  static async wrap<T>(
    operation: string,
    fn: () => Promise<T>
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      throw new AsyncOperationError(
        `非同期操作 '${operation}' が失敗しました`,
        operation,
        error as Error
      );
    }
  }
}

// 使用例
const result = await AsyncOperationError.wrap(
  'fetchUserData',
  async () => {
    const user = await api.getUser(userId);
    return user;
  }
);
```

## カスタムエラーのテスト

```typescript
// エラーのテスト例
describe('ValidationError', () => {
  it('should create error with single field', () => {
    const error = ValidationError.field('email', 'Invalid email format');
    
    expect(error).toBeInstanceOf(ValidationError);
    expect(error).toBeInstanceOf(Error);
    expect(error.code).toBe(ErrorCodes.VALIDATION_ERROR);
    expect(error.statusCode).toBe(400);
    expect(error.errors).toHaveLength(1);
    expect(error.errors[0]).toEqual({
      field: 'email',
      message: 'Invalid email format'
    });
  });
  
  it('should combine multiple errors', () => {
    const error1 = ValidationError.field('email', 'Invalid email');
    const error2 = ValidationError.field('password', 'Too short');
    
    const combined = ValidationError.combine(error1, error2);
    
    expect(combined.errors).toHaveLength(2);
  });
});
```

## まとめ

**Errorクラスの場合**：
1. **基本はコンストラクタ（new）を使用** - JavaScriptの慣習に従う
2. **静的ファクトリーメソッドは補助的に使用** - よくあるケースの簡略化
3. **Error.captureStackTraceを忘れずに** - 正確なスタックトレース
4. **instanceof が動作することを確認** - エラーハンドリングで重要
5. **toJSON メソッドを実装** - ログやAPIレスポンス用

この方式により、JavaScriptの標準的なエラーハンドリングパターンと一貫性を保ちながら、型安全で使いやすいエラーシステムを構築できます。

---

## 👤 ユーザー
*2025/6/10 1:38:04*

super messageはどういうことなの？
他はsuperではないの渡されたメッセージはどこに行ったの？
これは引救名と変数名が同じだからなの

---

## 🤖 アシスタント
*2025/6/10 1:38:46*

素晴らしい質問です！`super()`の動作と、プロパティの初期化について詳しく説明します。

## super()の基本的な動作

```typescript
class AppError extends Error {
  constructor(message: string) {
    super(message);  // ← これは親クラス(Error)のコンストラクタを呼んでいる
  }
}
```

`super(message)`は、親クラスである`Error`のコンストラクタに`message`を渡しています。

## messageプロパティの仕組み

```typescript
// Errorクラスの内部的な動作（簡略化）
class Error {
  public message: string;  // messageプロパティは親クラスで定義されている
  
  constructor(message?: string) {
    this.message = message || '';
  }
}

// 継承する場合
class AppError extends Error {
  public readonly code: string;
  
  constructor(message: string, code: string) {
    super(message);  // ← 親クラスのmessageプロパティに値を設定
    this.code = code;  // ← 子クラス独自のプロパティ
  }
}

const error = new AppError("エラーが発生しました", "E001");
console.log(error.message);  // "エラーが発生しました" ← 親クラスのプロパティ
console.log(error.code);     // "E001" ← 子クラスのプロパティ
```

## よくある誤解と正しい理解

```typescript
// ❌ 間違った理解
class WrongError extends Error {
  constructor(public message: string) {  // ← messageを再定義してはいけない！
    super(message);
  }
}

// ✅ 正しい実装
class CorrectError extends Error {
  constructor(message: string) {  // ← messageは引数名だけ
    super(message);  // ← 親クラスのmessageプロパティに設定される
  }
}
```

## 詳細な動作の解説

```typescript
class CustomError extends Error {
  public readonly timestamp: Date;
  public readonly code: string;
  
  constructor(
    message: string,      // ← これは単なる引数名
    code: string,
    public readonly userId?: string  // ← パラメータプロパティ
  ) {
    // 1. 親クラスのコンストラクタを呼ぶ
    super(message);  // Error.message = message となる
    
    // 2. 子クラス独自のプロパティを設定
    this.timestamp = new Date();
    this.code = code;
    // this.userId は自動的に設定される（パラメータプロパティのため）
  }
}

// 使用例
const error = new CustomError("ユーザーが見つかりません", "USER_NOT_FOUND", "user-123");

// プロパティの確認
console.log(error.message);    // "ユーザーが見つかりません" ← 親クラスから継承
console.log(error.timestamp);  // Date object ← 子クラスで追加
console.log(error.code);       // "USER_NOT_FOUND" ← 子クラスで追加
console.log(error.userId);     // "user-123" ← パラメータプロパティ
```

## パラメータプロパティの違い

```typescript
// パターン1: 通常の引数 + 手動でプロパティ設定
class Error1 extends Error {
  public readonly code: string;
  
  constructor(message: string, code: string) {
    super(message);  // messageは親クラスへ
    this.code = code;  // 手動で設定
  }
}

// パターン2: パラメータプロパティ（子クラスのプロパティのみ）
class Error2 extends Error {
  constructor(
    message: string,  // 通常の引数（親クラスへ渡す）
    public readonly code: string  // パラメータプロパティ（自動設定）
  ) {
    super(message);
  }
}

// パターン3: すべてパラメータプロパティ（間違い！）
class Error3 extends Error {
  constructor(
    public message: string,  // ❌ messageを再定義してしまう！
    public readonly code: string
  ) {
    super(message);
  }
}
```

## なぜmessageは特別なのか

```typescript
// Errorクラスの継承ツリー
class Error {
  message: string;  // すでに定義されている
  name: string;     // すでに定義されている
  stack?: string;   // すでに定義されている
}

class AppError extends Error {
  // message, name, stackは継承済み！
  // 新しいプロパティのみ追加する
  public readonly statusCode: number;
  public readonly timestamp: Date;
  
  constructor(message: string, statusCode: number) {
    super(message);  // 親のmessageプロパティに設定
    this.name = 'AppError';  // 親のnameプロパティを上書き
    this.statusCode = statusCode;  // 新規プロパティ
    this.timestamp = new Date();  // 新規プロパティ
  }
}
```

## 実際の動作確認

```typescript
class DetailedError extends Error {
  public readonly details: Record<string, unknown>;
  
  constructor(
    message: string,  // 引数名
    details: Record<string, unknown>
  ) {
    console.log('1. constructor開始');
    console.log('2. message引数:', message);
    
    super(message);  // 親クラスのコンストラクタ呼び出し
    
    console.log('3. super()の後');
    console.log('4. this.message:', this.message);  // 親から継承
    
    this.details = details;
    console.log('5. 初期化完了');
  }
}

const error = new DetailedError("エラーです", { code: "E001" });
// 出力:
// 1. constructor開始
// 2. message引数: エラーです
// 3. super()の後
// 4. this.message: エラーです
// 5. 初期化完了
```

## まとめ

1. **`super(message)`** は親クラス（Error）のコンストラクタを呼び出し、親クラスの`message`プロパティを設定する
2. **`message`は引数名** であり、新しいプロパティを作っているわけではない
3. **Errorクラスには既に`message`プロパティが存在** するので、再定義してはいけない
4. **子クラスでは新しいプロパティのみ追加** する

つまり、`message`という引数を受け取り、それを`super()`経由で親クラスに渡すことで、親クラスが持つ`message`プロパティに値が設定されるという仕組みです。

---

## 👤 ユーザー
*2025/6/10 1:39:12*

コンストラクタは1つまでなのか？
2つ定義できないのか？

---

## 🤖 アシスタント
*2025/6/10 1:45:32*

TypeScript（およびJavaScript）では、**コンストラクタは1つしか定義できません**。ただし、オーバーロードや他のパターンで複数の初期化方法を実現できます。

## 基本的な制限

```typescript
// ❌ これはエラーになる
class User {
  constructor(name: string) {
    // ...
  }
  
  constructor(name: string, age: number) {  // エラー: 複数のコンストラクタ実装
    // ...
  }
}
```

## 解決方法1: コンストラクタオーバーロード

```typescript
// ✅ オーバーロードシグネチャを使う
class User {
  public readonly name: string;
  public readonly age: number;
  public readonly email?: string;
  
  // オーバーロードシグネチャ（宣言のみ）
  constructor(name: string);
  constructor(name: string, age: number);
  constructor(name: string, age: number, email: string);
  
  // 実装（1つだけ）
  constructor(name: string, age?: number, email?: string) {
    this.name = name;
    this.age = age ?? 0;
    this.email = email;
  }
}

// 使用例
const user1 = new User("田中");
const user2 = new User("田中", 25);
const user3 = new User("田中", 25, "tanaka@example.com");
```

## 解決方法2: オプショナル引数とデフォルト値

```typescript
class Product {
  public readonly id: string;
  public readonly name: string;
  public readonly price: number;
  public readonly description: string;
  
  constructor(
    name: string,
    price: number = 0,
    description: string = "",
    id?: string
  ) {
    this.id = id ?? crypto.randomUUID();
    this.name = name;
    this.price = price;
    this.description = description;
  }
}

// 様々な使い方
const product1 = new Product("商品A");
const product2 = new Product("商品B", 1000);
const product3 = new Product("商品C", 2000, "説明文");
const product4 = new Product("商品D", 3000, "説明文", "custom-id");
```

## 解決方法3: オブジェクト引数パターン

```typescript
interface UserOptions {
  name: string;
  age?: number;
  email?: string;
  role?: "admin" | "user";
}

class User {
  public readonly name: string;
  public readonly age: number;
  public readonly email?: string;
  public readonly role: "admin" | "user";
  
  constructor(options: UserOptions) {
    this.name = options.name;
    this.age = options.age ?? 0;
    this.email = options.email;
    this.role = options.role ?? "user";
  }
}

// 使用例
const user1 = new User({ name: "田中" });
const user2 = new User({ name: "田中", age: 25 });
const user3 = new User({ 
  name: "田中", 
  age: 25, 
  email: "tanaka@example.com",
  role: "admin"
});
```

## 解決方法4: 静的ファクトリーメソッド

```typescript
class DateTime {
  private constructor(
    private readonly date: Date
  ) {}
  
  // 複数の生成方法を提供
  static now(): DateTime {
    return new DateTime(new Date());
  }
  
  static fromTimestamp(timestamp: number): DateTime {
    return new DateTime(new Date(timestamp));
  }
  
  static fromString(dateString: string): DateTime {
    return new DateTime(new Date(dateString));
  }
  
  static fromComponents(
    year: number,
    month: number,
    day: number,
    hour: number = 0,
    minute: number = 0,
    second: number = 0
  ): DateTime {
    return new DateTime(new Date(year, month - 1, day, hour, minute, second));
  }
}

// 使用例
const now = DateTime.now();
const fromTimestamp = DateTime.fromTimestamp(1234567890);
const fromString = DateTime.fromString("2024-01-01");
const fromComponents = DateTime.fromComponents(2024, 1, 1, 12, 30);
```

## 解決方法5: ビルダーパターン

```typescript
class EmailMessage {
  private constructor(
    public readonly to: string[],
    public readonly subject: string,
    public readonly body: string,
    public readonly cc?: string[],
    public readonly bcc?: string[],
    public readonly attachments?: string[]
  ) {}
  
  static builder(): EmailBuilder {
    return new EmailBuilder();
  }
}

class EmailBuilder {
  private to: string[] = [];
  private cc: string[] = [];
  private bcc: string[] = [];
  private subject: string = "";
  private body: string = "";
  private attachments: string[] = [];
  
  addTo(email: string): this {
    this.to.push(email);
    return this;
  }
  
  addCc(email: string): this {
    this.cc.push(email);
    return this;
  }
  
  setSubject(subject: string): this {
    this.subject = subject;
    return this;
  }
  
  setBody(body: string): this {
    this.body = body;
    return this;
  }
  
  addAttachment(path: string): this {
    this.attachments.push(path);
    return this;
  }
  
  build(): EmailMessage {
    if (this.to.length === 0) {
      throw new Error("宛先は必須です");
    }
    
    return new EmailMessage(
      this.to,
      this.subject,
      this.body,
      this.cc.length > 0 ? this.cc : undefined,
      this.bcc.length > 0 ? this.bcc : undefined,
      this.attachments.length > 0 ? this.attachments : undefined
    );
  }
}

// 使用例
const email = EmailMessage.builder()
  .addTo("user@example.com")
  .addTo("user2@example.com")
  .setSubject("重要なお知らせ")
  .setBody("本文です")
  .addCc("cc@example.com")
  .build();
```

## 実践的な例：複雑な初期化パターン

```typescript
// ユーザーエンティティの複数の初期化方法
class User {
  private constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly isActive: boolean
  ) {}
  
  // 新規作成
  static create(params: {
    email: string;
    name: string;
  }): User {
    const now = new Date();
    return new User(
      crypto.randomUUID(),
      params.email,
      params.name,
      now,
      now,
      true
    );
  }
  
  // DBからの復元
  static fromDatabase(record: {
    id: string;
    email: string;
    name: string;
    created_at: string;
    updated_at: string;
    is_active: boolean;
  }): User {
    return new User(
      record.id,
      record.email,
      record.name,
      new Date(record.created_at),
      new Date(record.updated_at),
      record.is_active
    );
  }
  
  // JSONからの復元
  static fromJSON(json: string): User {
    const data = JSON.parse(json);
    return User.fromDatabase(data);
  }
  
  // 部分的な情報から作成（テスト用）
  static createForTest(overrides?: Partial<{
    id: string;
    email: string;
    name: string;
  }>): User {
    const defaults = {
      id: "test-id",
      email: "test@example.com",
      name: "Test User"
    };
    
    const params = { ...defaults, ...overrides };
    const now = new Date();
    
    return new User(
      params.id,
      params.email,
      params.name,
      now,
      now,
      true
    );
  }
}

// 使用例
const newUser = User.create({
  email: "user@example.com",
  name: "新規ユーザー"
});

const existingUser = User.fromDatabase({
  id: "123",
  email: "existing@example.com",
  name: "既存ユーザー",
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-02T00:00:00Z",
  is_active: true
});

const testUser = User.createForTest({ name: "テストユーザー" });
```

## ユニオン型を使った高度なオーバーロード

```typescript
type CreateUserParams = 
  | { type: "new"; email: string; name: string; password: string }
  | { type: "oauth"; provider: string; providerId: string; email: string; name: string }
  | { type: "import"; data: any };

class User {
  private constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly authMethod: string
  ) {}
  
  static create(params: CreateUserParams): User {
    switch (params.type) {
      case "new":
        return new User(
          crypto.randomUUID(),
          params.email,
          params.name,
          "password"
        );
        
      case "oauth":
        return new User(
          crypto.randomUUID(),
          params.email,
          params.name,
          `oauth:${params.provider}`
        );
        
      case "import":
        return new User(
          params.data.id,
          params.data.email,
          params.data.name,
          params.data.authMethod
        );
    }
  }
}

// 使用例（型安全）
const user1 = User.create({
  type: "new",
  email: "user@example.com",
  name: "ユーザー",
  password: "password123"
});

const user2 = User.create({
  type: "oauth",
  provider: "google",
  providerId: "12345",
  email: "oauth@example.com",
  name: "OAuthユーザー"
});
```

## まとめ

**TypeScriptの制限**：
- コンストラクタの実装は1つのみ
- オーバーロードシグネチャは複数定義可能

**推奨パターン**：
1. **シンプルな場合** → オプショナル引数
2. **引数が多い場合** → オブジェクト引数
3. **初期化方法が異なる** → 静的ファクトリー
4. **複雑な構築** → ビルダーパターン
5. **型による分岐** → ユニオン型

これらのパターンを使い分けることで、実質的に複数のコンストラクタと同等の柔軟性を実現できます。

---
