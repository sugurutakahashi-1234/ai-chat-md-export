# TypeScript Clean Architecture Dependencies

日付: 2025-06-16

---

## 👤 ユーザー
*2025/06/16 11:56:01*

タイプスクリプトのサーバーサイドのプロジェクトで、クリーンアーキテクチャを採用したいと思っている。この際にクリーンアーキテクチャとして依存性の逆転まで行うべきなのか、それとも依存の方向だけをきっちり守るのか、どちらにした方がいいのか、それともどういうのが一般的なのか教えてほしい。

---

## 🤖 アシスタント
*2025/06/16 11:56:30*

TypeScriptのサーバーサイドプロジェクトでクリーンアーキテクチャを採用する際の依存性管理について、実践的な観点から説明します。

## 依存性の逆転（DIP）を完全に実装する場合

**メリット：**
- ドメイン層が完全に独立し、ビジネスロジックが技術的な詳細から分離される
- テストが容易（モックの作成が簡単）
- 技術的な変更（DBやフレームワークの変更）の影響を最小化できる

**デメリット：**
- インターフェースの定義が増え、コードベースが複雑になる
- 小規模プロジェクトでは過剰設計になりやすい
- 開発速度が低下する可能性がある

## 依存の方向だけを守る場合

**メリット：**
- シンプルで理解しやすい構造
- 開発速度が速い
- TypeScriptの型システムである程度の安全性は確保できる

**デメリット：**
- ドメイン層が技術的な詳細に依存してしまう
- テストでの柔軟性が低下
- 将来の技術変更時のコストが高くなる

## 実践的な推奨アプローチ

多くのTypeScriptプロジェクトでは、以下のような段階的アプローチが採用されています：

### 1. コアドメインには依存性の逆転を適用
```typescript
// domain/repository/UserRepository.ts
export interface UserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
}

// infrastructure/repository/UserRepositoryImpl.ts
export class UserRepositoryImpl implements UserRepository {
  // 実装
}
```

### 2. 単純なCRUDや技術的な処理では緩和
```typescript
// 単純なデータ取得などは直接依存も許容
export class GetUserListUseCase {
  constructor(private prisma: PrismaClient) {} // 直接依存
}
```

### 3. プロジェクトの成長に応じて段階的に適用
- 初期：依存の方向のみ守る
- 中期：重要なビジネスロジックに依存性の逆転を適用
- 成熟期：必要に応じて全体に拡大

## 一般的な実践パターン

TypeScriptコミュニティでは以下のようなパターンがよく見られます：

1. **Ports & Adaptersパターン**の採用（ヘキサゴナルアーキテクチャ）
2. **依存性注入コンテナ**（InversifyJS、tsyringe等）の活用
3. **インターフェースの選択的適用**（重要な境界のみ）

プロジェクトの規模、チームの経験、将来の拡張性を考慮して、適切なレベルを選択することが重要です。多くの場合、「完全なクリーンアーキテクチャ」よりも「実用的なクリーンアーキテクチャ」の方が良い結果をもたらします。

---

## 👤 ユーザー
*2025/06/16 11:57:20*

インターフェースを定義することで、何かいいことあるのか、結局依存性の逆転を使わないのだったらインターフェースの定義する必要ってあんまりないのではないか。ちょっと教えてほしい。

---

## 🤖 アシスタント
*2025/06/16 11:57:48*

その疑問はとても的を射ています。確かに、依存性の逆転を使わないならインターフェースの意味は薄れます。具体的に見ていきましょう。

## インターフェースが本当に価値を発揮する場合

### 1. 依存性の逆転と組み合わせた場合
```typescript
// ドメイン層でインターフェースを定義
interface UserRepository {
  findById(id: string): Promise<User | null>;
}

// インフラ層で実装
class PrismaUserRepository implements UserRepository {
  findById(id: string) { /* Prisma実装 */ }
}

// ユースケース層
class GetUserUseCase {
  // インターフェースに依存（実装に依存しない）
  constructor(private repo: UserRepository) {}
}
```

これにより：
- テスト時にモックを簡単に差し替えられる
- DBを変更してもドメインロジックは変更不要

### 2. 複数の実装を切り替える場合
```typescript
interface PaymentGateway {
  charge(amount: number): Promise<Result>;
}

class StripeGateway implements PaymentGateway { }
class PayPalGateway implements PaymentGateway { }

// 環境によって切り替え
const gateway = process.env.PAYMENT === 'stripe' 
  ? new StripeGateway() 
  : new PayPalGateway();
```

## インターフェースが不要な場合

### 依存の方向だけ守る場合
```typescript
// インターフェースなしで直接依存
class GetUserUseCase {
  constructor(private prisma: PrismaClient) {}
  
  async execute(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
```

この場合、インターフェースを作っても：
- 実装が1つしかない
- テストでもPrismaClientを直接モックする
- 結局、具象クラスに依存している

## 実践的な判断基準

インターフェースを定義すべきかの判断：

### 定義すべき場合
- 複数の実装が想定される（本番/テスト/開発環境で異なる実装）
- 外部サービスとの統合（変更の可能性が高い）
- チーム開発で境界を明確にしたい

### 不要な場合
- 実装が1つで変更の予定がない
- シンプルなCRUD操作
- TypeScriptの型推論で十分な場合

## TypeScript特有の考慮点

TypeScriptでは、クラスそのものが型として機能するため：

```typescript
// クラスを直接型として使える
class UserService {
  getUser(id: string): User { }
}

// わざわざインターフェースを作らなくても型安全
function useUserService(service: UserService) { }

// テスト時は型だけ合わせたモックを作れる
const mockService: UserService = {
  getUser: jest.fn()
} as any;
```

## 結論

依存性の逆転を使わないなら、インターフェースの必要性は大幅に低下します。以下の方針が実用的です：

1. **最初はインターフェースなしで開始**
2. **必要になったら抽出**（YAGNI原則）
3. **外部サービスとの境界では検討**

多くのTypeScriptプロジェクトでは、過度なインターフェース定義は避け、本当に抽象化が必要な箇所にのみ適用する傾向があります。

---

## 👤 ユーザー
*2025/06/16 11:59:00*

クラスは作った方がいいのかImport*AsPatternで結構実装しているが、それだとテストが知りにくかったりあるのか。

---

## 🤖 アシスタント
*2025/06/16 11:59:30*

`import * as` パターンとクラスベースの実装、それぞれの特徴とテストのしやすさについて詳しく説明します。

## import * as パターンの特徴

```typescript
// userService.ts
export const findById = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  return user;
};

export const create = async (data: CreateUserDto) => {
  return await prisma.user.create({ data });
};

// 使用側
import * as userService from './userService';
await userService.findById('123');
```

### メリット
- シンプルで関数型プログラミングに近い
- 不要なインスタンス化が不要
- ツリーシェイキングが効きやすい

### デメリット（特にテスト時）
- モック化が面倒
- 依存性注入が困難
- 状態管理ができない

## テストの難しさの比較

### import * as パターンのテスト
```typescript
// テストが複雑になりやすい
jest.mock('./userService', () => ({
  findById: jest.fn(),
  create: jest.fn()
}));

// または
import * as userService from './userService';
jest.spyOn(userService, 'findById').mockResolvedValue(mockUser);

// 問題点：
// - モジュール全体をモックする必要がある
// - 部分的なモックが難しい
// - テスト間で状態がリセットされない場合がある
```

### クラスベースのテスト
```typescript
class UserService {
  constructor(private prisma: PrismaClient) {}
  
  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}

// テストが簡潔
const mockPrisma = { user: { findUnique: jest.fn() } };
const service = new UserService(mockPrisma as any);
```

## 実践的なハイブリッドアプローチ

多くのプロジェクトでは、以下のような使い分けが効果的です：

### 1. 純粋関数は import * as パターン
```typescript
// utils/validation.ts
export const isValidEmail = (email: string) => { };
export const sanitizeInput = (input: string) => { };

// これらは状態を持たないのでクラスは不要
import * as validation from './utils/validation';
```

### 2. 依存性があるものはクラス
```typescript
// services/UserService.ts
export class UserService {
  constructor(
    private prisma: PrismaClient,
    private emailService: EmailService
  ) {}
  
  async createUser(data: CreateUserDto) {
    const user = await this.prisma.user.create({ data });
    await this.emailService.sendWelcome(user.email);
    return user;
  }
}
```

### 3. ファサードパターンで両方の利点を活用
```typescript
// repositories/userRepository.ts
class UserRepository {
  constructor(private prisma: PrismaClient) {}
  
  findById = async (id: string) => {
    return this.prisma.user.findUnique({ where: { id } });
  }
}

// デフォルトインスタンスをエクスポート
export const userRepository = new UserRepository(prisma);

// 関数として直接エクスポートも可能
export const findById = userRepository.findById;

// 使用側は好きな方を選べる
import { findById } from './userRepository';
// または
import { userRepository } from './userRepository';
```

## 判断基準

### クラスを使うべき場合
- 複数の依存性がある
- 状態を保持する必要がある
- テストで依存性を差し替えたい
- 初期化処理が必要

### import * as で十分な場合
- 純粋関数の集まり
- ユーティリティ関数
- 依存性が少ない、または固定
- 関数型プログラミングスタイルを好む

## 結論

テストのしやすさを重視するなら、依存性があるサービス層はクラスベースにすることをお勧めします。一方で、ユーティリティや純粋な変換処理は `import * as` パターンで問題ありません。

プロジェクトの性質に応じて使い分けることが重要です。

---

## 👤 ユーザー
*2025/06/16 11:59:38*

インターフェースを定義することで、Mockを使ったテストとかがやりやすいのか。

---

## 🤖 アシスタント
*2025/06/16 12:00:14*

はい、インターフェースを定義することでモックを使ったテストは確実にやりやすくなります。具体的な例で見ていきましょう。

## インターフェースありの場合

### 1. 型安全なモックの作成
```typescript
// インターフェース定義
interface UserRepository {
  findById(id: string): Promise<User | null>;
  create(data: CreateUserDto): Promise<User>;
  update(id: string, data: UpdateUserDto): Promise<User>;
}

// テストでのモック作成
const mockUserRepo: UserRepository = {
  findById: jest.fn().mockResolvedValue({ id: '1', name: 'Test' }),
  create: jest.fn(),
  update: jest.fn()
};

// TypeScriptが必要なメソッドの実装を強制してくれる
// もしメソッドが足りなければコンパイルエラー
```

### 2. 部分的なモックの作成
```typescript
// 必要なメソッドだけをモック化
type MockUserRepository = jest.Mocked<UserRepository>;

const createMockUserRepo = (): MockUserRepository => {
  return {
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
  };
};

// 使用例
test('ユーザー取得のテスト', async () => {
  const mockRepo = createMockUserRepo();
  mockRepo.findById.mockResolvedValue({ id: '1', name: 'Test' });
  
  const useCase = new GetUserUseCase(mockRepo);
  const result = await useCase.execute('1');
  
  expect(mockRepo.findById).toHaveBeenCalledWith('1');
  expect(result.name).toBe('Test');
});
```

## インターフェースなしの場合の問題

### 1. クラスを直接モックする場合
```typescript
// 実装クラス
class PrismaUserRepository {
  constructor(private prisma: PrismaClient) {}
  
  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }
  
  // 他にも多くのメソッドがある...
}

// テストでのモック - 面倒
const mockRepo = {
  findById: jest.fn(),
  // 全てのメソッドを手動で定義する必要がある
  // TypeScriptの型チェックが効きにくい
} as unknown as PrismaUserRepository;
```

### 2. jest.mockの問題
```typescript
// モジュール全体をモックする必要がある
jest.mock('./PrismaUserRepository');

// 型情報が失われやすい
const MockedPrismaUserRepository = PrismaUserRepository as jest.MockedClass<
  typeof PrismaUserRepository
>;
```

## インターフェースを使った高度なテストパターン

### 1. テスト用の実装を簡単に作成
```typescript
// メモリ内実装をテスト用に作成
class InMemoryUserRepository implements UserRepository {
  private users: Map<string, User> = new Map();
  
  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }
  
  async create(data: CreateUserDto): Promise<User> {
    const user = { ...data, id: generateId() };
    this.users.set(user.id, user);
    return user;
  }
}

// 統合テストで実際のDBの代わりに使用
```

### 2. スパイとスタブの使い分け
```typescript
interface EmailService {
  sendWelcome(email: string): Promise<void>;
  sendPasswordReset(email: string, token: string): Promise<void>;
}

// 特定のメソッドだけをスパイ
const emailService: EmailService = {
  sendWelcome: jest.fn(),
  sendPasswordReset: async () => {} // 実際の処理
};
```

## TypeScript特有の利点

### 1. 自動補完とリファクタリング
```typescript
// インターフェースがあれば、IDEが全てのメソッドを提案
const mockRepo: UserRepository = {
  // IDEが必要なメソッドを自動補完
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn()
};
```

### 2. 型の整合性チェック
```typescript
// インターフェースが変更されたら、モックも更新が必要
// コンパイル時にエラーで気づける
interface UserRepository {
  findById(id: string): Promise<User | null>;
  delete(id: string): Promise<void>; // 新しく追加
}

// 既存のモックはコンパイルエラーになる
```

## 実践的な推奨事項

1. **外部依存を持つサービスには必ずインターフェースを定義**
   - DB、API、ファイルシステムなど

2. **ドメインロジックのテストでは特に重要**
   ```typescript
   // ドメイン層
   interface OrderRepository {
     save(order: Order): Promise<void>;
   }
   
   // テストが簡単
   const mockRepo: OrderRepository = {
     save: jest.fn()
   };
   ```

3. **ファクトリー関数でモック作成を標準化**
   ```typescript
   export const createMockUserRepository = (): jest.Mocked<UserRepository> => ({
     findById: jest.fn(),
     create: jest.fn(),
     update: jest.fn()
   });
   ```

インターフェースは最初は面倒に感じるかもしれませんが、テストの書きやすさと保守性の向上という大きなメリットをもたらします。

---

## 👤 ユーザー
*2025/06/16 12:12:06*

でもこれって、ユースケースの生成時にリポジトリを使うような形を作ることが前提になってるよね。

---

## 🤖 アシスタント
*2025/06/16 12:12:40*

まさにその通りです！鋭い指摘ですね。インターフェースの利点は、依存性注入（DI）を前提としています。依存性注入を使わない場合の現実を見てみましょう。

## 依存性注入を使わない一般的なパターン

### 1. 直接インポートして使用
```typescript
// userRepository.ts
export class UserRepository {
  async findById(id: string) {
    return await prisma.user.findUnique({ where: { id } });
  }
}

export const userRepository = new UserRepository();

// useCase.ts
import { userRepository } from './userRepository';

export class GetUserUseCase {
  async execute(id: string) {
    // 直接使用 - DIなし
    return await userRepository.findById(id);
  }
}
```

この場合、インターフェースを定義しても：
- モックの差し替えが困難
- テスト時は結局 `jest.mock()` を使う
- インターフェースの意味がない

### 2. テストの現実
```typescript
// DIなしでのテスト
jest.mock('./userRepository', () => ({
  userRepository: {
    findById: jest.fn()
  }
}));

import { userRepository } from './userRepository';
import { GetUserUseCase } from './GetUserUseCase';

test('ユーザー取得', async () => {
  (userRepository.findById as jest.Mock).mockResolvedValue({ id: '1' });
  
  const useCase = new GetUserUseCase();
  await useCase.execute('1');
});
```

## DIを使わない場合の選択肢

### 1. シンプルに関数で実装
```typescript
// userService.ts
import { prisma } from './prisma';

export async function findUserById(id: string) {
  return await prisma.user.findUnique({ where: { id } });
}

// useCase.ts
import { findUserById } from './userService';

export async function getUserUseCase(id: string) {
  const user = await findUserById(id);
  if (!user) throw new NotFoundError();
  return user;
}
```

### 2. 環境変数やコンテキストで切り替え
```typescript
// repository.ts
const createRepository = () => {
  if (process.env.NODE_ENV === 'test') {
    return new MockUserRepository();
  }
  return new PrismaUserRepository();
};

export const userRepository = createRepository();
```

### 3. 高階関数パターン
```typescript
// DIっぽいけどDIコンテナは使わない
export const createGetUserUseCase = (repo: UserRepository) => {
  return async (id: string) => {
    return await repo.findById(id);
  };
};

// 本番環境
export const getUserUseCase = createGetUserUseCase(prodRepository);

// テスト環境
const testUseCase = createGetUserUseCase(mockRepository);
```

## 現実的な判断基準

### インターフェース + DIが必要な場合
- 大規模プロジェクト
- 複数の実装の切り替えが頻繁
- チーム開発で境界を明確にしたい
- ドメイン駆動設計を徹底したい

### シンプルな実装で十分な場合
- 小〜中規模プロジェクト
- 実装の変更が稀
- 開発速度重視
- `jest.mock()` で十分テストできる

## 多くのTypeScriptプロジェクトの実態

```typescript
// 実際によく見るパターン
// services/user.service.ts
export class UserService {
  // 直接依存 - DIなし
  async getUser(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundError();
    return user;
  }
}

export const userService = new UserService();

// controllers/user.controller.ts
import { userService } from '../services/user.service';

export const getUser = async (req, res) => {
  const user = await userService.getUser(req.params.id);
  res.json(user);
};

// テストは jest.mock で対応
```

## 結論

インターフェースの価値は、確かにDIと密接に結びついています。DIを使わないなら：

1. **インターフェースは基本的に不要**
2. **`jest.mock()` でテストは書ける**
3. **シンプルな実装で十分なことが多い**

ただし、プロジェクトが成長して以下のような要求が出てきたら、DIの導入を検討：
- テストが複雑になってきた
- 実装の切り替えが必要になった
- チームが大きくなって境界が曖昧になった

最初からフルスペックのクリーンアーキテクチャを実装するより、必要に応じて段階的に導入する方が現実的です。

---
