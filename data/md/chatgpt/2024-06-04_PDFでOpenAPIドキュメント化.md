# PDFでOpenAPIドキュメント化

日付: 2024-06-04

---

## 👤 ユーザー
*2024/06/04 18:32:14*

OpneAPIドキュメントをPDF化する方法。yamlファイルは持っている。

---

## 🤖 アシスタント
*2024/06/04 18:32:38*

OpenAPIドキュメントをPDF化するには、いくつかの方法があります。以下にその手順を説明します：

### 1. [Swagger Codegen](https://github.com/swagger-api/swagger-codegen)を使用する方法

Swagger Codegenを使って、OpenAPIのyamlファイルからPDFドキュメントを生成できます。

#### 必要なもの
- Java 8+
- Swagger Codegen CLI

#### 手順
1. Swagger Codegen CLIをインストールします。

   ```bash
   brew install swagger-codegen
   ```

2. yamlファイルを持っているディレクトリに移動します。

3. 以下のコマンドを実行して、PDFドキュメントを生成します。

   ```bash
   swagger-codegen generate -i openapi.yaml -l html2
   ```

   このコマンドはHTML形式のドキュメントを生成します。PDFに変換するためには、次のステップに進みます。

4. 生成されたHTMLファイルをPDFに変換します。これは、ブラウザの印刷機能を使用して手動で行うか、以下のようなツールを使用します：

   ```bash
   wkhtmltopdf index.html output.pdf
   ```

   `wkhtmltopdf`はHTMLファイルをPDFに変換するツールです。

### 2. [Redoc](https://github.com/Redocly/redoc)を使用する方法

RedocはOpenAPIドキュメントを美しくレンダリングするためのツールであり、これをPDFに変換する方法もあります。

#### 必要なもの
- Node.js
- Redoc CLI

#### 手順
1. Node.jsをインストールします（未インストールの場合）。

2. Redoc CLIをインストールします。

   ```bash
   npm install -g redoc-cli
   ```

3. yamlファイルを持っているディレクトリに移動します。

4. 以下のコマンドを実行して、HTMLファイルを生成します。

   ```bash
   redoc-cli bundle openapi.yaml
   ```

5. 生成されたHTMLファイルをPDFに変換します。これも、ブラウザの印刷機能を使用して手動で行うか、以下のようなツールを使用します：

   ```bash
   wkhtmltopdf redoc-static.html output.pdf
   ```

### 3. [SwaggerHub](https://swagger.io/tools/swaggerhub/)を使用する方法

SwaggerHubは、オンラインでOpenAPIドキュメントを編集・表示できるツールです。SwaggerHubの有料プランでは、PDFエクスポート機能も提供されています。

#### 手順
1. SwaggerHubにサインインします。

2. yamlファイルをSwaggerHubにアップロードします。

3. SwaggerHubのインターフェースからPDFエクスポートオプションを使用してPDFを生成します。

これらの方法のいずれかを使用して、OpenAPIドキュメントをPDF化できます。最も適した方法を選んでください。

---

## 👤 ユーザー
*2024/06/04 18:33:18*

wkhtmltopdf サービスが終了して使えない。node 環境で使えるものがいい npx で実行したい。

---

## 🤖 アシスタント
*2024/06/04 18:33:33*

Node.js環境で使えるツールとして、`puppeteer`を使用してHTMLファイルをPDFに変換する方法があります。`puppeteer`はヘッドレスChromeブラウザを操作するためのライブラリで、HTMLをPDFに変換するのに非常に便利です。

以下の手順で、`puppeteer`を使用してHTMLファイルをPDFに変換するスクリプトを作成し、`npx`で実行します。

### 手順

1. 必要なパッケージをインストールします。

   ```bash
   npm install puppeteer
   ```

2. 変換スクリプト `convertToPdf.js` を作成します。

   ```javascript
   // convertToPdf.js
   const puppeteer = require('puppeteer');
   const fs = require('fs');
   const path = require('path');

   const htmlFilePath = process.argv[2];
   const pdfFilePath = process.argv[3] || 'output.pdf';

   if (!htmlFilePath) {
       console.error('Usage: node convertToPdf.js <input.html> [output.pdf]');
       process.exit(1);
   }

   (async () => {
       const browser = await puppeteer.launch();
       const page = await browser.newPage();
       const htmlContent = fs.readFileSync(path.resolve(htmlFilePath), 'utf8');

       await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
       await page.pdf({ path: pdfFilePath, format: 'A4' });

       await browser.close();
       console.log(`PDF generated: ${pdfFilePath}`);
   })();
   ```

3. OpenAPI YAMLファイルからHTMLファイルを生成します。前述の方法で`redoc-cli`を使用します。

   ```bash
   npm install -g redoc-cli
   redoc-cli bundle openapi.yaml
   ```

4. `npx`を使用してHTMLファイルをPDFに変換します。

   ```bash
   npx node convertToPdf.js redoc-static.html output.pdf
   ```

この手順に従うことで、`puppeteer`を使用してOpenAPIドキュメントのHTMLファイルをPDFに変換することができます。`npx`を使うことで、追加のセットアップなしにスクリプトを実行できるので便利です。

---

## 👤 ユーザー
*2024/06/04 18:33:54*

convertToPdf.js など書きたくない。

---

## 🤖 アシスタント
*2024/06/04 18:34:04*

スクリプトを書かずに、Node.js環境で実行可能なツールとして、`redoc-cli`と`puppeteer-cli`を組み合わせて使用できます。以下はその手順です。

### 手順

1. 必要なパッケージをインストールします。

   ```bash
   npm install -g redoc-cli puppeteer-cli
   ```

2. `redoc-cli`を使用してOpenAPI YAMLファイルからHTMLファイルを生成します。

   ```bash
   npx redoc-cli bundle openapi.yaml
   ```

3. `puppeteer-cli`を使用してHTMLファイルをPDFに変換します。

   ```bash
   npx puppeteer-cli https://localhost:3000/redoc-static.html --print-to-pdf=output.pdf
   ```

   ※ 上記コマンドで、`localhost:3000` はHTMLファイルをホストしているサーバーのURLに置き換えてください。ローカルファイルを直接PDFに変換するためには、以下のようにします。

4. `serve`パッケージをインストールして、ローカルサーバーを起動します。

   ```bash
   npm install -g serve
   serve -s .  # HTMLファイルが存在するディレクトリで実行
   ```

5. `puppeteer-cli`でローカルサーバー上のHTMLファイルをPDFに変換します。

   ```bash
   npx puppeteer-cli http://localhost:5000/redoc-static.html --print-to-pdf=output.pdf
   ```

これで、スクリプトを書かずに`npx`を使用して、OpenAPIのYAMLファイルから生成したHTMLをPDFに変換できます。`serve`コマンドでローカルサーバーを起動し、そのURLを`puppeteer-cli`で指定することで、PDFの生成が完了します。

---

## 👤 ユーザー
*2024/06/04 18:34:43*

グローバルにインストールしたくない npm init から記述してほしい。

---

## 🤖 アシスタント
*2024/06/04 18:34:59*

グローバルにインストールせずに、プロジェクトローカルで実行する方法を説明します。以下の手順に従って、`npm init`から始めて、必要なパッケージをインストールし、OpenAPIのYAMLファイルからHTMLを生成し、PDFに変換するまでを行います。

### 手順

1. プロジェクトの初期化

   ```bash
   mkdir openapi-to-pdf
   cd openapi-to-pdf
   npm init -y
   ```

2. 必要なパッケージのインストール

   ```bash
   npm install redoc-cli puppeteer serve
   ```

3. `package.json`にスクリプトを追加

   `package.json`を編集して、以下のようにスクリプトを追加します。

   ```json
   {
     "name": "openapi-to-pdf",
     "version": "1.0.0",
     "description": "",
     "main": "index.js",
     "scripts": {
       "generate-html": "redoc-cli bundle openapi.yaml -o redoc-static.html",
       "start-server": "serve -s .",
       "generate-pdf": "npx puppeteer https://localhost:5000/redoc-static.html --print-to-pdf=output.pdf",
       "convert": "npm run generate-html && npm run start-server & npm run generate-pdf"
     },
     "author": "",
     "license": "ISC",
     "dependencies": {
       "puppeteer": "^13.0.0",
       "redoc-cli": "^0.12.0",
       "serve": "^13.0.0"
     }
   }
   ```

4. `openapi.yaml`ファイルをプロジェクトディレクトリに配置

   プロジェクトルートに`openapi.yaml`ファイルを置きます。

5. スクリプトの実行

   以下のコマンドを実行して、OpenAPIのYAMLファイルからHTMLを生成し、PDFに変換します。

   ```bash
   npm run convert
   ```

このスクリプトは以下の順序で処理を行います：
- `generate-html`: OpenAPIのYAMLファイルからHTMLファイルを生成します。
- `start-server`: `serve`を使ってローカルサーバーを起動します。
- `generate-pdf`: Puppeteerを使ってHTMLファイルをPDFに変換します。

これにより、`openapi-to-pdf`ディレクトリ内に`output.pdf`が生成されます。

---

## 👤 ユーザー
*2024/06/04 18:36:34*

AsciiDoc を経由するやり方はどうだろうか？

---

## 🤖 アシスタント
*2024/06/04 18:36:49*

AsciiDocを経由してOpenAPIドキュメントをPDF化する方法もあります。以下に、AsciiDocを使用してOpenAPIドキュメントをPDFに変換する手順を説明します。

### 手順

1. プロジェクトの初期化

   ```bash
   mkdir openapi-to-pdf
   cd openapi-to-pdf
   npm init -y
   ```

2. 必要なパッケージのインストール

   ```bash
   npm install @openapitools/openapi-generator-cli asciidoctor asciidoctor-pdf
   ```

3. `package.json`にスクリプトを追加

   `package.json`を編集して、以下のスクリプトを追加します。

   ```json
   {
     "name": "openapi-to-pdf",
     "version": "1.0.0",
     "description": "",
     "main": "index.js",
     "scripts": {
       "generate-asciidoc": "openapi-generator-cli generate -i openapi.yaml -g asciidoc -o ./docs",
       "generate-pdf": "asciidoctor-pdf ./docs/openapi.adoc -o output.pdf",
       "convert": "npm run generate-asciidoc && npm run generate-pdf"
     },
     "author": "",
     "license": "ISC",
     "dependencies": {
       "@openapitools/openapi-generator-cli": "^2.4.24",
       "asciidoctor": "^2.2.0",
       "asciidoctor-pdf": "^1.5.0"
     }
   }
   ```

4. `openapi.yaml`ファイルをプロジェクトディレクトリに配置

   プロジェクトルートに`openapi.yaml`ファイルを置きます。

5. スクリプトの実行

   以下のコマンドを実行して、OpenAPIのYAMLファイルからAsciiDocを生成し、PDFに変換します。

   ```bash
   npm run convert
   ```

このスクリプトは以下の順序で処理を行います：
- `generate-asciidoc`: OpenAPIのYAMLファイルからAsciiDocファイル（`openapi.adoc`）を生成します。
- `generate-pdf`: Asciidoctorを使って、AsciiDocファイルをPDFに変換します。

これにより、`openapi-to-pdf`ディレクトリ内に`output.pdf`が生成されます。

### 注意点

- `openapi-generator-cli`は、OpenAPIドキュメントからさまざまな形式のファイルを生成できるツールです。今回はAsciiDoc形式を生成するために使用しています。
- `asciidoctor`と`asciidoctor-pdf`は、AsciiDocファイルをPDFに変換するためのツールです。

この手順に従えば、AsciiDocを経由してOpenAPIドキュメントをPDFに変換することができます。

---

## 👤 ユーザー
*2024/06/04 18:37:18*

html経由とAsciiDoc経由はどっちがいいと思う？

---

## 🤖 アシスタント
*2024/06/04 18:37:33*

HTML経由とAsciiDoc経由の両方にはそれぞれの利点と欠点があります。以下に、それぞれの方法についての利点と欠点を示しますので、用途に合わせてどちらが適しているかを判断するのに役立ててください。

### HTML経由

#### 利点
1. **ビジュアルのカスタマイズ**: HTMLとCSSを使って詳細なスタイリングやレイアウトのカスタマイズが可能です。
2. **ツールの利用**: `redoc-cli`や`puppeteer`などのツールを使用することで、視覚的に豊かなドキュメントを生成できます。
3. **ブラウザでのプレビュー**: 生成されたHTMLをブラウザで簡単にプレビューし、必要に応じて修正できます。

#### 欠点
1. **手順が複雑**: HTMLファイルを生成してからPDFに変換する手順がやや複雑です。
2. **依存関係**: 複数のツール（`redoc-cli`、`serve`、`puppeteer`）に依存するため、環境設定が少し煩雑になることがあります。

### AsciiDoc経由

#### 利点
1. **シンプルな手順**: OpenAPIドキュメントから直接AsciiDocを生成し、それをPDFに変換するシンプルな手順です。
2. **軽量な依存関係**: AsciiDocとAsciidoctorだけを使用するため、必要なツールが少なく、環境設定が比較的簡単です。
3. **テキストベース**: AsciiDocはテキストベースのマークアップ言語であるため、バージョン管理システムと相性が良いです。

#### 欠点
1. **ビジュアルのカスタマイズが制限される**: HTMLやCSSほど詳細なスタイリングやレイアウトのカスタマイズが難しいです。
2. **生成の柔軟性が低い**: AsciiDocの生成やPDF変換の過程での柔軟性がHTML経由に比べて低い場合があります。

### 推奨

**ビジュアル重視**: 見た目やレイアウトのカスタマイズが重要な場合、HTML経由の方法が適しています。特に、ビジュアルを重視するドキュメントや、カスタムスタイルを適用したい場合に向いています。

**シンプルさ重視**: 簡潔で軽量なプロセスを求める場合、AsciiDoc経由の方法が適しています。テキストベースでバージョン管理しやすく、簡単にセットアップできるのが魅力です。

あなたの特定のニーズに基づいて、どちらのアプローチが最も適しているかを判断することが重要です。

---
