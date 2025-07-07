# Swift OpenAPI Generator Guide

日付: 2024-05-28

---

## 👤 ユーザー
*2024/5/28 12:35:56*

日本語で解説してほしい

Example configuration file contents:
```yaml
generate:
- types
- client
```

USAGE: swift-openapi-generator generate <doc-path> [--config <config>] [--mode <mode> ...] [--access-modifier <access-modifier>] [--additional-import <additional-import> ...] [--feature-flag <feature-flag> ...] [--diagnostics-output-path <diagnostics-output-path>] [--output-directory <output-directory>] [--plugin-source <plugin-source>] [--dry-run]

ARGUMENTS:
  <doc-path>              Path to the OpenAPI document, either in YAML or JSON.

OPTIONS:
  --config <config>       Path to a YAML configuration file.
  --mode <mode>           The Swift files to generate. Options: types, client, server. Note that 'client' and 'server' depend on declarations in 'types'. (values: types, client,
                          server)
  --access-modifier <access-modifier>
                          The access modifier to use for the API of generated code. Default: internal
  --additional-import <additional-import>
                          Additional import to add to all generated files.
  --feature-flag <feature-flag>
                          Pre-release feature to enable. Options: empty. (values: empty)
  --diagnostics-output-path <diagnostics-output-path>
                          When specified, writes out the diagnostics into a YAML file instead of emitting them to standard error.
  --output-directory <output-directory>
                          Output directory where the generated files are written. Warning: Replaces any existing files with the same filename. Reserved filenames: Types.swift,
                          Client.swift, Server.swift (default: file:///Users/sugurutakahashi/git/swift-openapi-gen-sample/)
  --plugin-source <plugin-source>
                          Source of invocation if by a plugin. The generator needs to produce all files when invoked as a build plugin, so non-requested modes produce empty files.
  --dry-run               Simulate the command and print the operations, without actually affecting the file system.
  -h, --help              Show help information.

---

## 🤖 アシスタント
*2024/5/28 12:36:22*

`swift-openapi-generator`の使い方と設定ファイルの内容について日本語で解説します。

### 設定ファイルの内容
以下は、YAML形式の設定ファイルの例です：

```yaml
generate:
- types
- client
```

この設定ファイルでは、`types`と`client`を生成するように指定されています。`types`はAPIの型定義を、`client`はクライアント用のコードを生成します。

### 使用方法
`swift-openapi-generator`コマンドは、OpenAPIドキュメントからSwiftコードを生成するためのツールです。以下のコマンド例とオプションの説明を参考にしてください。

```sh
swift-openapi-generator generate <doc-path> [--config <config>] [--mode <mode> ...] [--access-modifier <access-modifier>] [--additional-import <additional-import> ...] [--feature-flag <feature-flag> ...] [--diagnostics-output-path <diagnostics-output-path>] [--output-directory <output-directory>] [--plugin-source <plugin-source>] [--dry-run]
```

### 引数
- `<doc-path>`: OpenAPIドキュメントのパス。YAMLまたはJSON形式が使用できます。

### オプション
- `--config <config>`: YAML形式の設定ファイルのパス。
- `--mode <mode>`: 生成するSwiftファイルの種類。`types`（型定義）、`client`（クライアントコード）、`server`（サーバーコード）の中から選択。`client`と`server`は`types`に依存します。
- `--access-modifier <access-modifier>`: 生成されるコードのアクセス修飾子。デフォルトは`internal`。
- `--additional-import <additional-import>`: 生成される全てのファイルに追加されるインポート。
- `--feature-flag <feature-flag>`: 有効にするプレリリース機能。現在は`empty`のみ。
- `--diagnostics-output-path <diagnostics-output-path>`: 指定すると、診断情報を標準エラーではなくYAMLファイルに書き出します。
- `--output-directory <output-directory>`: 生成されたファイルが書き出される出力ディレクトリ。既存のファイルが同じファイル名であれば置き換えられるので注意が必要です。予約ファイル名：`Types.swift`、`Client.swift`、`Server.swift`（デフォルトは`file:///Users/sugurutakahashi/git/swift-openapi-gen-sample/`）。
- `--plugin-source <plugin-source>`: プラグインからの呼び出し元ソース。ビルドプラグインとして呼び出された場合、生成される全ファイルを生成する必要があるため、非リクエストモードは空のファイルを生成します。
- `--dry-run`: コマンドをシミュレートして操作内容を表示しますが、ファイルシステムには影響を与えません。
- `-h, --help`: ヘルプ情報を表示します。

このツールを使用することで、OpenAPIドキュメントから効率的にSwiftコードを生成し、APIクライアントやサーバーの実装を支援することができます。

---

## 👤 ユーザー
*2024/5/28 16:04:52*

以下について生成してみると、値が全てオプショナルであったり、client.get_sol_users() や client.get_sol_users_sol__lcub_id_rcub_() といった名前の関数しか用意されず、なにか変である。

```
openapi: 3.0.0
info:
  title: User API
  version: 1.0.0
servers:
  - url: https://jsonplaceholder.typicode.com
paths:
  /users:
    get:
      summary: Get a list of users
      responses:
        200:
          description: Success
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/User"
  /users/{id}:
    get:
      summary: Get a user by ID
      parameters:
        - in: path
          name: id
          schema:
            type: integer
          required: true
          description: The id of the user to retrieve
      responses:
        200:
          description: Success
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/User"
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: integer
        name:
          type: string
        username:
          type: string
        email:
          type: string
        address:
          type: object
          properties:
            street:
              type: string
            suite:
              type: string
            city:
              type: string
            zipcode:
              type: string
            geo:
              type: object
              properties:
                lat:
                  type: string
                lng:
                  type: string
        phone:
          type: string
        website:
          type: string
        company:
          type: object
          properties:
            name:
              type: string
            catchPhrase:
              type: string
            bs:
              type: string
```

---

## 🤖 アシスタント
*2024/5/28 16:05:28*

生成されたSwiftコードが意図通りにならない原因を探るため、いくつかのポイントを確認していきます。

### 生成されたコードがすべてオプショナルになる理由

OpenAPIドキュメントのスキーマ定義において、プロパティがオプショナルになるのは、スキーマのプロパティに`required`フィールドが指定されていない場合です。`required`フィールドが指定されていないプロパティは、デフォルトでオプショナルになります。

以下は、`User`スキーマに`required`フィールドを追加した例です：

```yaml
components:
  schemas:
    User:
      type: object
      required:
        - id
        - name
        - username
        - email
      properties:
        id:
          type: integer
        name:
          type: string
        username:
          type: string
        email:
          type: string
        address:
          type: object
          properties:
            street:
              type: string
            suite:
              type: string
            city:
              type: string
            zipcode:
              type: string
            geo:
              type: object
              properties:
                lat:
                  type: string
                lng:
                  type: string
        phone:
          type: string
        website:
          type: string
        company:
          type: object
          properties:
            name:
              type: string
            catchPhrase:
              type: string
            bs:
              type: string
```

この例では、`id`、`name`、`username`、`email`が必須プロパティとして指定されています。

### 生成された関数の名前が不適切な理由

関数名が意図しない形式で生成される原因として、スキーマやエンドポイントのパス定義が影響している可能性があります。`swift-openapi-generator`は、パスやパラメータの名前を元に関数名を生成します。以下に、パスやパラメータ名が適切に設定されているかどうかを確認するための手順を示します。

1. **パスの確認**:
    - `/users` エンドポイントと `/users/{id}` エンドポイントが正しく定義されているか確認します。

2. **パラメータの確認**:
    - パラメータ名や場所（`in: path`）が正しく定義されているか確認します。

以下は、修正後の例です：

```yaml
openapi: 3.0.0
info:
  title: User API
  version: 1.0.0
servers:
  - url: https://jsonplaceholder.typicode.com
paths:
  /users:
    get:
      summary: Get a list of users
      operationId: getUsers
      responses:
        200:
          description: Success
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/User"
  /users/{id}:
    get:
      summary: Get a user by ID
      operationId: getUserById
      parameters:
        - in: path
          name: id
          schema:
            type: integer
          required: true
          description: The id of the user to retrieve
      responses:
        200:
          description: Success
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/User"
components:
  schemas:
    User:
      type: object
      required:
        - id
        - name
        - username
        - email
      properties:
        id:
          type: integer
        name:
          type: string
        username:
          type: string
        email:
          type: string
        address:
          type: object
          properties:
            street:
              type: string
            suite:
              type: string
            city:
              type: string
            zipcode:
              type: string
            geo:
              type: object
              properties:
                lat:
                  type: string
                lng:
                  type: string
        phone:
          type: string
        website:
          type: string
        company:
          type: object
          properties:
            name:
              type: string
            catchPhrase:
              type: string
            bs:
              type: string
```

`operationId`フィールドを追加することで、生成される関数名がより意図したものに近くなります。

これらの変更を行った後に再度コードを生成し、結果を確認してください。それでも問題が解決しない場合は、ツールのバグや仕様の可能性も考慮し、ドキュメントやサポートを確認することをお勧めします。

---

## 👤 ユーザー
*2024/5/28 16:07:19*

全てのパラメーターをrequiredにしてほしい

---

## 🤖 アシスタント
*2024/5/28 16:07:40*

全てのパラメーターを必須にするために、`required`フィールドに全てのプロパティを追加します。以下は修正後のOpenAPIドキュメントです：

```yaml
openapi: 3.0.0
info:
  title: User API
  version: 1.0.0
servers:
  - url: https://jsonplaceholder.typicode.com
paths:
  /users:
    get:
      summary: Get a list of users
      operationId: getUsers
      responses:
        200:
          description: Success
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/User"
  /users/{id}:
    get:
      summary: Get a user by ID
      operationId: getUserById
      parameters:
        - in: path
          name: id
          schema:
            type: integer
          required: true
          description: The id of the user to retrieve
      responses:
        200:
          description: Success
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/User"
components:
  schemas:
    User:
      type: object
      required:
        - id
        - name
        - username
        - email
        - address
        - phone
        - website
        - company
      properties:
        id:
          type: integer
        name:
          type: string
        username:
          type: string
        email:
          type: string
        address:
          type: object
          required:
            - street
            - suite
            - city
            - zipcode
            - geo
          properties:
            street:
              type: string
            suite:
              type: string
            city:
              type: string
            zipcode:
              type: string
            geo:
              type: object
              required:
                - lat
                - lng
              properties:
                lat:
                  type: string
                lng:
                  type: string
        phone:
          type: string
        website:
          type: string
        company:
          type: object
          required:
            - name
            - catchPhrase
            - bs
          properties:
            name:
              type: string
            catchPhrase:
              type: string
            bs:
              type: string
```

この修正では、`User`スキーマの全てのプロパティとそのネストされたオブジェクト内のプロパティも必須として定義しています。

再度コードを生成して、結果が期待通りになるか確認してください。それでもうまくいかない場合は、生成ツールのバグの可能性も考慮し、適宜対応することをお勧めします。

---
