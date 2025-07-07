# Redocly CLI 代替ツール

日付: 2024-10-16

---

## 👤 ユーザー
*2024/10/16 18:43:04*

redocly-cli の代わり

---

## 🤖 アシスタント
*2024/10/16 18:43:36*

Redocly CLI の代わりとして利用できるオープンソースのツールには、以下のものがあります。これらは OpenAPI ドキュメントの生成、バリデーション、レンダリング、またはホスティングをサポートするものです。

1. \*\*Swagger Codegen\*\*  
   - \*\*概要\*\*: Swagger Codegen は、OpenAPI ドキュメントからクライアントやサーバーのコードを生成するためのツールです。
   - \*\*代替機能\*\*: Redocly のように API ドキュメントを生成する機能は直接的には持っていませんが、Swagger Editor と併用することで OpenAPI ドキュメントの編集やプレビューをサポートします。
   - \*\*リンク\*\*: \[Swagger Codegen\](https://github.com/swagger-api/swagger-codegen)

2. \*\*OpenAPI Generator\*\*  
   - \*\*概要\*\*: Swagger Codegen のフォーク版で、OpenAPI のさまざまなバージョンに対応しています。クライアントやサーバーのコード生成に加えて、OpenAPI ドキュメントの生成・バリデーションも行えます。
   - \*\*代替機能\*\*: コード生成に加えて、API ドキュメントの静的な HTML 生成が可能です。
   - \*\*リンク\*\*: \[OpenAPI Generator\](https://openapi-generator.tech/)

3. \*\*Spectral\*\*  
   - \*\*概要\*\*: Spectral は、OpenAPI などの API ドキュメントのバリデーションや linting を行うためのルールベースのツールです。
   - \*\*代替機能\*\*: Redocly のバリデーション機能の代替として利用できます。独自のルールを設定し、API ドキュメントの品質チェックが行えます。
   - \*\*リンク\*\*: \[Spectral\](https://github.com/stoplightio/spectral)

4. \*\*Swagger UI\*\*  
   - \*\*概要\*\*: Swagger UI は、OpenAPI ドキュメントを動的に読み込み、Web 上で視覚化するためのツールです。HTML と JavaScript のパッケージとして提供されており、Redoc の代替としてドキュメントをホスティングできます。
   - \*\*代替機能\*\*: Redoc のように API ドキュメントを表示するためのインターフェースを提供します。
   - \*\*リンク\*\*: \[Swagger UI\](https://swagger.io/tools/swagger-ui/)

5. \*\*Docusaurus\*\* + \*\*Swagger UI\*\* または \*\*Redoc\*\*  
   - \*\*概要\*\*: Docusaurus は、静的サイトジェネレーターで、API ドキュメントのホスティングやカスタマイズされたドキュメントページの作成に便利です。これに Swagger UI や Redoc を組み合わせることで、完全なドキュメントポータルを構築できます。
   - \*\*代替機能\*\*: Redocly のような柔軟な API ドキュメントポータルを作成できます。
   - \*\*リンク\*\*: \[Docusaurus\](https://docusaurus.io/)

これらのツールは、Redocly CLI の代替や補完として使用でき、プロジェクトに合わせて適切なツールを選択することができます。

---

## 👤 ユーザー
*2024/10/16 18:43:39*

yarn redocly bundle ./openapi/index.yml --output ./openapi/index.json --lint の代わりとなるもの

---

## 🤖 アシスタント
*2024/10/16 18:43:52*

`yarn redocly bundle ./openapi/index.yml --output ./openapi/index.json --lint` に代わるコマンドを以下のツールで実行できます。目的は、OpenAPI ドキュメントをバンドルし、JSON に変換し、lint することです。

### 1. **OpenAPI Generator**
- **インストール**:  
  ```bash
  yarn add @openapitools/openapi-generator-cli
  ```

- **バンドル**（JSON への変換）:
  ```bash
  yarn openapi-generator-cli generate -i ./openapi/index.yml -g openapi -o ./openapi/index.json
  ```

- **Lint 機能の代わり**: OpenAPI Generator は直接 lint 機能を提供していないため、lint の代替には次の Spectral を利用します。

### 2. **Spectral**（Lint の代替）
- **インストール**:  
  ```bash
  yarn add @stoplight/spectral-cli
  ```

- **Lint 実行**:  
  ```bash
  yarn spectral lint ./openapi/index.yml
  ```

この組み合わせにより、Redocly CLI のバンドル・出力・lint の処理を代替できます。

---

## 👤 ユーザー
*2024/10/16 18:44:13*

他の選択肢は

---

## 🤖 アシスタント
*2024/10/16 18:44:43*

Redocly CLI の `bundle` や `lint` コマンドの代替となる他の選択肢もいくつかあります。以下は、その目的に応じた別のツールの選択肢です。

### 1. **Swagger Codegen** + **Spectral**
- **概要**: Swagger Codegen は OpenAPI ドキュメントをコードや他のフォーマットに変換するためのツールで、Spectral は lint ツールです。

- **バンドル**:
  Swagger Codegen は `openapi.yml` を他のフォーマットに変換する際に JSON 形式も対応しています。

  - **インストール**:  
    ```bash
    yarn add swagger-codegen-cli
    ```

  - **実行**:  
    ```bash
    yarn swagger-codegen-cli generate -i ./openapi/index.yml -l openapi -o ./openapi/index.json
    ```

- **Lint 実行**（Spectral 使用）:  
  ```bash
  yarn spectral lint ./openapi/index.yml
  ```

### 2. **OpenAPI CLI**  
- **概要**: Stoplight 社が提供する OpenAPI CLI は、バリデーションやバンドルなど OpenAPI ドキュメントの操作を行うためのツールです。`redocly` の代替として特に lint とバンドルの機能が充実しています。

- **インストール**:  
  ```bash
  yarn add @stoplight/openapi-cli
  ```

- **バンドル実行**:  
  ```bash
  yarn openapi-cli bundle ./openapi/index.yml --output ./openapi/index.json
  ```

- **Lint 実行**:  
  ```bash
  yarn openapi-cli lint ./openapi/index.yml
  ```

### 3. **Swagger Editor** + **Swagger Parser**
- **概要**: Swagger Editor は、ブラウザベースの OpenAPI ドキュメントのエディタであり、Swagger Parser は OpenAPI ドキュメントをパースして処理するための Node.js モジュールです。

- **Swagger Parser の使用例**:
  - **インストール**:  
    ```bash
    yarn add swagger-parser
    ```

  - **実行**:
    ```javascript
    const SwaggerParser = require("swagger-parser");
    const fs = require("fs");

    async function bundleOpenAPI() {
      const api = await SwaggerParser.bundle("./openapi/index.yml");
      fs.writeFileSync("./openapi/index.json", JSON.stringify(api, null, 2));
    }

    bundleOpenAPI();
    ```

- **Lint 実行**:  
  Swagger Parser 自体には lint 機能がないため、lint の代替として Spectral を使用します。

  ```bash
  yarn spectral lint ./openapi/index.yml
  ```

### 4. **oas-tools**
- **概要**: `oas-tools` は、OpenAPI ドキュメントの lint やテスト、バンドルをサポートするツールです。

- **インストール**:  
  ```bash
  yarn add oas-tools
  ```

- **Lint 実行**:  
  ```bash
  yarn oas-tools lint ./openapi/index.yml
  ```

### まとめ

- **バンドル機能**としては、`OpenAPI CLI`、`Swagger Codegen`、`Swagger Parser` などが有力です。
- **Lint 機能**には `Spectral` や `OpenAPI CLI` を利用するのがオススメです。

どのツールを選ぶかは、プロジェクトのニーズに応じて決定すると良いでしょう。

---
