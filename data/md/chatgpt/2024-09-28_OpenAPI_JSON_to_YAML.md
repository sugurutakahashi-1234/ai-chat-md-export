# OpenAPI JSON to YAML

日付: 2024-09-28

---

## 👤 ユーザー
*2024/9/28 11:37:46*

openapi json を ymlに変換するワンライナー npx使ってほしい

---

## 🤖 アシスタント
*2024/9/28 11:37:48*

以下のワンライナーで、OpenAPI JSONファイルをYAML形式に変換できます。`npx`を使って、`@openapitools/openapi-generator-cli`を実行します。

```bash
npx @openapitools/openapi-generator-cli generate -i openapi.json -g openapi-yaml -o .
```

このコマンドでは、`openapi.json`を`openapi.yaml`に変換し、カレントディレクトリに出力します。

---

## 👤 ユーザー
*2024/9/28 11:37:58*

その他の選択肢は？

---

## 🤖 アシスタント
*2024/9/28 11:38:03*

他にもいくつか選択肢があります。`npx`を使って、OpenAPI JSONをYAMLに変換する方法として、以下のツールやアプローチが考えられます。

### 1. `npx swagger-cli`を使用
`swagger-cli`は、OpenAPIの操作に使われるツールです。これを使って、JSONをYAMLに変換することができます。

```bash
npx swagger-cli bundle openapi.json --outfile openapi.yaml --type yaml
```

### 2. `npx @redocly/cli`を使用
`redocly`はドキュメント生成にも使われる強力なCLIツールです。`bundle`コマンドでJSONからYAMLへの変換が可能です。

```bash
npx @redocly/cli bundle openapi.json -o openapi.yaml
```

### 3. `npx openapi-generator-cli`を使用して別の方法
同じ`@openapitools/openapi-generator-cli`ですが、JSONからYAML形式に変換する際に別のテンプレートを指定することもできます。

```bash
npx @openapitools/openapi-generator-cli generate -i openapi.json -g openapi-yaml -o .
```

### 4. `npx oas-normalize`を使用
`oas-normalize`はOpenAPIの仕様を正規化するツールで、YAMLへの変換にも使えます。

```bash
npx oas-normalize openapi.json --format yaml > openapi.yaml
```

これらのツールを使うことで、簡単にOpenAPIのJSONファイルをYAML形式に変換できます。状況に応じて、使いやすいものを選んでください。

---

## 👤 ユーザー
*2024/9/30 10:05:38*

こういうエラーになった。これを直すコマンドラインはあるか？

warning: Schema "null" is not supported, reason: "schema type", skipping \[context: foundIn=Operations.list\_v1\_message\_threads\_get.Input.Query (#/paths/api/v1/message\_threads/GET/query)/cursor\]warning: Schema "null" is not supported, reason: "schema type", skipping \[context: foundIn=Operations.list\_v1\_message\_threads\_get.Input.Query (#/paths/api/v1/message\_threads/GET/query)/cursor\]warning: Schema "null" is not supported, reason: "schema type", skipping \[context: foundIn=Operations.get\_memories\_v1\_memories\_get.Input.Query (#/paths/api/v1/memories/GET/query)/message\_thread\_id\]warning: Schema "null" is not supported, reason: "schema type", skipping \[context: foundIn=Operations.get\_memories\_v1\_memories\_get.Input.Query (#/paths/api/v1/memories/GET/query)/cursor\]warning: Schema "null" is not supported, reason: "schema type", skipping \[context: foundIn=Operations.get\_expression\_stocks\_v1\_expression\_stocks\_get.Input.Query (#/paths/api/v1/expression\_stocks/GET/query)/cursor\]warning: Schema "null" is not supported, reason: "schema type", skipping \[context: foundIn=Operations.get\_memories\_v1\_memories\_get.Input.Query (#/paths/api/v1/memories/GET/query)/message\_thread\_id\]warning: Schema "null" is not supported, reason: "schema type", skipping \[context: foundIn=Operations.get\_memories\_v1\_memories\_get.Input.Query (#/paths/api/v1/memories/GET/query)/cursor\]warning: Schema "null" is not supported, reason: "schema type", skipping \[context: foundIn=Operations.get\_expression\_stocks\_v1\_expression\_stocks\_get.Input.Query (#/paths/api/v1/expression\_stocks/GET/query)/cursor\]Writing data to file Client.swift...
warning: Schema "null" is not supported, reason: "schema type", skipping \[context: foundIn=Components.Schemas.Message (#/components/schemas/Message)/id\]warning: Schema "null" is not supported, reason: "schema type", skipping \[context: foundIn=Components.Schemas.MessageRequest (#/components/schemas/MessageRequest)/content\]warning: Schema "null" is not supported, reason: "schema type", skipping \[context: foundIn=Components.Schemas.MessageThread (#/components/schemas/MessageThread)/finished\_at\]warning: Schema "null" is not supported, reason: "schema type", skipping \[context: foundIn=Components.Schemas.Question (#/components/schemas/Question)/speech\_bubble\_text\]warning: Schema "null" is not supported, reason: "schema type", skipping \[context: foundIn=Components.Schemas.Question (#/components/schemas/Question)/normal\_radio\_button\_options\]warning: Schema "null" is not supported, reason: "schema type", skipping \[context: foundIn=Components.Schemas.Question (#/components/schemas/Question)/heading\_radio\_button\_options\]warning: Schema "null" is not supported, reason: "schema type", skipping \[context: foundIn=Components.Schemas.StudentCredit (#/components/schemas/StudentCredit)/next\_charge\_datetime\]warning: Schema "null" is not supported, reason: "schema type", skipping \[context: foundIn=Components.Schemas.StudentProfile (#/components/schemas/StudentProfile)/nickname\]warning: Schema "null" is not supported, reason: "schema type", skipping \[context: foundIn=Components.Schemas.TotalCursorPage\_ExpressionStock\_ (#/components/schemas/TotalCursorPage\_ExpressionStock\_)/total\]warning: Schema "null" is not supported, reason: "schema type", skipping \[context: foundIn=Components.Schemas.TotalCursorPage\_ExpressionStock\_ (#/components/schemas/TotalCursorPage\_ExpressionStock\_)/current\_page\]warning: Schema "null" is not supported, reason: "schema type", skipping \[context: foundIn=Components.Schemas.TotalCursorPage\_ExpressionStock\_ (#/components/schemas/TotalCursorPage\_ExpressionStock\_)/current\_page\_backwards\]warning: Schema "null" is not supported, reason: "schema type", skipping \[context: foundIn=Components.Schemas.TotalCursorPage\_ExpressionStock\_ (#/components/schemas/TotalCursorPage\_ExpressionStock\_)/previous\_page\]warning: Schema "null" is not supported, reason: "schema type", skipping \[context: foundIn=Components.Schemas.TotalCursorPage\_ExpressionStock\_ (#/components/schemas/TotalCursorPage\_ExpressionStock\_)/next\_page\]warning: Schema "null" is not supported, reason: "schema type", skipping \[context: foundIn=Components.Schemas.TotalCursorPage\_Memory\_ (#/components/schemas/TotalCursorPage\_Memory\_)/total\]warning: Schema "null" is not supported, reason: "schema type", skipping \[context: foundIn=Components.Schemas.TotalCursorPage\_Memory\_ (#/components/schemas/TotalCursorPage\_Memory\_)/current\_page\]warning: Schema "null" is not supported, reason: "schema type", skipping \[context: foundIn=Components.Schemas.TotalCursorPage\_Memory\_ (#/components/schemas/TotalCursorPage\_Memory\_)/current\_page\_backwards\]warning: Schema "null" is not supported, reason: "schema type", skipping \[context: foundIn=Components.Schemas.TotalCursorPage\_Memory\_ (#/components/schemas/TotalCursorPage\_Memory\_)/previous\_page\]warning: Schema "null" is not supported, reason: "schema type", skipping \[context: foundIn=Components.Schemas.TotalCursorPage\_Memory\_ (#/components/schemas/TotalCursorPage\_Memory\_)/next\_page\]warning: Schema "null" is not supported, reason: "schema type", skipping \[context: foundIn=Components.Schemas.TotalCursorPage\_MessageThread\_ (#/components/schemas/TotalCursorPage\_MessageThread\_)/total\]warning: Schema "null" is not supported, reason: "schema type", skipping \[context: foundIn=Components.Schemas.TotalCursorPage\_MessageThread\_ (#/components/schemas/TotalCursorPage\_MessageThread\_)/current\_page\]warning: Schema "null" is not supported, reason: "schema type", skipping \[context: foundIn=Components.Schemas.TotalCursorPage\_MessageThread\_ (#/components/schemas/TotalCursorPage\_MessageThread\_)/current\_page\_backwards\]warning: Schema "null" is not supported, reason: "schema type", skipping \[context: foundIn=Components.Schemas.TotalCursorPage\_MessageThread\_ (#/components/schemas/TotalCursorPage\_MessageThread\_)/previous\_page\]warning: Schema "null" is not supported, reason: "schema type", skipping \[context: foundIn=Components.Schemas.TotalCursorPage\_MessageThread\_ (#/components/schemas/TotalCursorPage\_MessageThread\_)/next\_page\]warning: Schema "null" is not supported, reason: "schema type", skipping \[context: foundIn=Operations.list\_v1\_message\_threads\_get.Input.Query (#/paths/api/v1/message\_threads/GET/query)/cursor\]warning: Schema "null" is not supported, reason: "schema type", skipping \[context: foundIn=Operations.get\_memories\_v1\_memories\_get.Input.Query (#/paths/api/v1/memories/GET/query)/message\_thread\_id\]warning: Schema "null" is not supported, reason: "schema type", skipping \[context: foundIn=Operations.get\_memories\_v1\_memories\_get.Input.Query (#/paths/api/v1/memories/GET/query)/cursor\]warning: Schema "null" is not supported, reason: "schema type", skipping \[context: foundIn=Operations.get\_expression\_stocks\_v1\_expression\_stocks\_get.Input.Query (#/paths/api/v1/expression\_stocks/GET/query)/cursor\]Writing data to file Types.swift...

---

## 🤖 アシスタント
*2024/9/30 10:05:51*

このエラーは、OpenAPIドキュメント内で`null`型がサポートされていない場合に発生するもので、特にスキーマ定義で`null`が使われている箇所に関連しています。OpenAPI 3.0では`null`型はサポートされておらず、`nullable: true`で`null`許容を指定する必要があります。

この問題を解決するための具体的なコマンドラインはありませんが、以下の方法で問題を解消できる可能性があります。

### 1. OpenAPI定義を修正する
`null`が使われている部分を、`nullable: true`に置き換えるため、OpenAPI定義を直接修正します。

```yaml
# 修正前
type: null

# 修正後
type: string  # 適切な型を指定
nullable: true
```

もしOpenAPI定義が非常に大きい場合、自動的に`null`を`nullable: true`に置き換えるスクリプトやツールを使うのも一つの方法です。

### 2. `openapi-generator-cli`に`--skip-validate-spec`オプションを追加
一時的な解決策として、OpenAPIドキュメントのバリデーションをスキップすることが可能です。この方法では、エラーメッセージを無視してコード生成を実行できます。

```bash
npx @openapitools/openapi-generator-cli generate -i openapi.json -g swift5 -o . --skip-validate-spec
```

### 3. `swagger-cli`で事前にドキュメントをバリデート
`npx swagger-cli`を使って、事前にドキュメントをバリデートし、修正箇所を確認できます。

```bash
npx swagger-cli validate openapi.json
```

これにより、問題のあるスキーマ定義を洗い出し、`null`を`nullable: true`に修正できます。

### 4. スクリプトで修正
もし多数の`null`定義が存在する場合、以下のようなスクリプトで自動的に置き換えることが可能です（例：`sed`コマンドを使う）。

```bash
sed -i '' 's/type: null/type: string\nnullable: true/g' openapi.json
```

このコマンドは、`type: null`を`type: string\nnullable: true`に置き換えます。

---

## 👤 ユーザー
*2024/9/30 10:06:46*

そもそも3.1.0版を使っているんだ

---

## 🤖 アシスタント
*2024/9/30 10:06:55*

User is using OpenAPI 3.1.0.

---

## 🔧 ツール
*2024/9/30 10:06:55*

Model set context updated.

---

## 🤖 アシスタント
*2024/9/30 10:06:55*

OpenAPI 3.1.0では、`null`が正式にサポートされているため、以前のように`nullable: true`を使用する必要はなく、`null`型を直接使用できるはずです。しかし、ツールによってはまだ3.1.0の`null`型を正しく処理できない場合があります。

この問題を解決するためには、以下のいくつかのアプローチがあります：

### 1. ツールのアップデート
もし使用している`openapi-generator`や他のツールが古いバージョンであれば、最新のバージョンにアップデートすることで、OpenAPI 3.1.0の`null`サポートが改善されるかもしれません。

```bash
npx @openapitools/openapi-generator-cli version-manager set 6.0.0
```
上記のコマンドで、ツールを最新バージョン（または指定バージョン）にアップデートできます。

### 2. 互換性モードの使用
もしツールが3.1.0を完全にサポートしていない場合、3.0.x互換モードでツールを実行することもできます。具体的には、3.0.xでの互換性を保つように、OpenAPI 3.0.3などの形式でエクスポートすることを検討できます。

### 3. カスタム設定の適用
エラーや警告が出ている場合、ツールに対してカスタムの設定を適用して、`null`型の警告を無視するように指示することも可能です。たとえば、警告メッセージを無視してコード生成を行う場合：

```bash
npx @openapitools/openapi-generator-cli generate -i openapi.json -g swift5 -o . --skip-validate-spec
```

これにより、エラーメッセージを無視してコード生成が進行できます。

---
