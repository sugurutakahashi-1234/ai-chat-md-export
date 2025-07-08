# Managing Server and Frontend in a Monorepo with pnpm

日付: 2025-03-09

---

## 👤 ユーザー
*2025/03/09 19:43:12*

pnpmについてサーバーサイドと画面を一緒のリポジトリで作成したい

---

## 🤖 アシスタント
*2025/03/09 19:43:25*

pnpmを使って、サーバーサイドとフロントエンド（画面）を一緒のリポジトリで管理するモノレポ構成について説明します。

モノレポ（monorepo）アプローチは、複数のプロジェクトやパッケージを1つのリポジトリで管理する方法で、pnpmはこれを効率的に実現できます。

## pnpmでモノレポを構築する方法

1. まず、ルートディレクトリを作成してpnpmを初期化します:

```bash
mkdir my-fullstack-app
cd my-fullstack-app
pnpm init
```

2. pnpm-workspace.yamlファイルを作成してワークスペースを設定します:

```yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

3. ディレクトリ構造を以下のように設定できます:

```
my-fullstack-app/
├── pnpm-workspace.yaml
├── package.json
├── apps/
│   ├── frontend/       # フロントエンドアプリ
│   │   └── package.json
│   └── backend/        # バックエンドアプリ
│       └── package.json
└── packages/           # 共有パッケージ
    ├── ui-components/  # 共通UIコンポーネント
    │   └── package.json
    └── shared-utils/   # 共通ユーティリティ
        └── package.json
```

4. 各パッケージ/アプリでpnpmを初期化します:

```bash
cd apps/frontend
pnpm init

cd ../backend
pnpm init

cd ../../packages/ui-components
pnpm init

cd ../shared-utils
pnpm init
```

5. 依存関係の管理:
   - 共有パッケージを別のパッケージから参照するには:
   
```bash
# frontendからui-componentsを参照
cd apps/frontend
pnpm add @my-scope/ui-components@workspace:*

# backendからshared-utilsを参照
cd ../backend
pnpm add @my-scope/shared-utils@workspace:*
```

6. ルートpackage.jsonにスクリプトを追加して、全体を管理しやすくします:

```json
{
  "name": "my-fullstack-app",
  "scripts": {
    "dev": "pnpm -r run dev",
    "build": "pnpm -r run build",
    "test": "pnpm -r run test"
  }
}
```

## メリット

- 共通コードを共有パッケージで管理できる
- 依存関係を効率的に管理（pnpmは重複パッケージをハードリンクで管理）
- ビルド・テストなどを一元管理できる
- 変更が他のパッケージに与える影響を把握しやすい

このように、pnpmのワークスペース機能を使うことで、サーバーサイドとフロントエンドを一つのリポジトリで効率的に管理できます。

---

## 👤 ユーザー
*2025/03/09 19:43:44*

nestのサーバーを立てたいんだい

---

## 🤖 アシスタント
*2025/03/09 19:44:00*

NestJSでサーバーを立てる方法を説明します。pnpmを使ったモノレポ構成の中でNestJSサーバーを構築する手順は以下の通りです。

## NestJSサーバーをセットアップする手順

1. **NestJS CLIをインストール**:

```bash
pnpm add -g @nestjs/cli
```

2. **バックエンドプロジェクトを作成**:
   先ほど説明したモノレポ構造の中で、apps/backendディレクトリにNestJSプロジェクトを作成します:

```bash
cd apps
nest new backend --package-manager pnpm
```

3. **NestJSプロジェクトを起動**:

```bash
cd backend
pnpm run start:dev
```

これでデフォルトで `http://localhost:3000` でNestJSサーバーが起動します。

## NestJSの基本構造

NestJSは以下のような構成要素で構築されています:

- **コントローラー**: HTTP リクエストを処理し、クライアントにレスポンスを返します
- **サービス**: ビジネスロジックを含む
- **モジュール**: アプリケーションの構造を整理する

## 簡単なAPIエンドポイントの作成例

例えば、シンプルなAPIエンドポイントを作成してみましょう:

1. **ユーザーモジュールの生成**:

```bash
cd apps/backend
nest generate module users
nest generate controller users
nest generate service users
```

2. **コントローラーの実装**:
   `src/users/users.controller.ts`

```typescript
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Post()
  create(@Body() userData: any) {
    return this.usersService.create(userData);
  }
}
```

3. **サービスの実装**:
   `src/users/users.service.ts`

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users = [
    { id: 1, name: '田中太郎' },
    { id: 2, name: '山田花子' },
  ];

  findAll() {
    return this.users;
  }

  findOne(id: number) {
    return this.users.find(user => user.id === id);
  }

  create(userData: any) {
    const newUser = {
      id: this.users.length + 1,
      ...userData,
    };
    this.users.push(newUser);
    return newUser;
  }
}
```

## モノレポ構成でのルートスクリプト設定

ルートの`package.json`にバックエンドサーバーを簡単に起動できるスクリプトを追加しましょう:

```json
{
  "scripts": {
    "dev:backend": "pnpm --filter backend run start:dev",
    "build:backend": "pnpm --filter backend run build",
    "test:backend": "pnpm --filter backend run test"
  }
}
```

これで、リポジトリのルートディレクトリから`pnpm run dev:backend`を実行するだけでNestJSサーバーを起動できます。

NestJSはTypeScriptを完全サポートしており、依存性注入やモジュール化されたアーキテクチャを採用しているため、大規模なアプリケーション開発に非常に適しています。また、GraphQL、WebSockets、マイクロサービスなど、さまざまな拡張機能も提供しています。

---
