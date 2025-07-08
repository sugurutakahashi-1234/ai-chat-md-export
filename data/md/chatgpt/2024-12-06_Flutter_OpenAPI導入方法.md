# Flutter OpenAPI導入方法

Date: 2024-12-06

---

## 👤 User
*2024-12-06 17:09:54*

flutter open api gen を使う

---

## 🤖 Assistant
*2024-12-06 17:10:15*

FlutterでOpenAPI Generatorを使う方法について説明します。OpenAPI Generatorを使用すると、APIクライアントコードを自動生成でき、Flutterアプリケーションとバックエンド間の通信を簡素化できます。

---

### **手順: FlutterでOpenAPI Generatorを使用**

#### **1. OpenAPI Generatorのセットアップ**
OpenAPI Generatorを使うには、CLIまたはDockerを利用できます。

**CLIでのインストール**（推奨）
```bash
brew install openapi-generator
```

**Dockerを使う場合**
```bash
docker pull openapitools/openapi-generator-cli
```

#### **2. OpenAPI仕様書の準備**
API仕様書を `openapi.yaml` または `openapi.json` 形式で用意します。  
バックエンドチームから仕様書を取得するか、Swagger Editorなどを使って自分で作成します。

---

#### **3. Flutter用のコードを生成**
以下のコマンドを実行してFlutter用のクライアントコードを生成します。

**コマンド例**
```bash
openapi-generator-cli generate -i openapi.yaml -g dart-dio -o output_directory
```

- `-i`: 入力ファイル（`openapi.yaml` のパス）
- `-g`: 出力言語（Flutterの場合は `dart-dio` または `dart` を使用）
- `-o`: 出力先ディレクトリ

---

#### **4. 生成されたコードをFlutterプロジェクトに統合**
1. `output_directory` 内に生成されたコードをFlutterプロジェクトのディレクトリ（例: `lib/api`）にコピーします。
2. `pubspec.yaml`に必要な依存関係を追加します。

```yaml
dependencies:
  dio: ^5.0.0
  json_serializable: ^6.0.0
```

**依存関係をインストール**
```bash
flutter pub get
```

---

#### **5. 使用方法**
生成されたクライアントコードを使ってAPIを呼び出します。

**例:**
以下は、APIクライアントを初期化し、エンドポイントを呼び出すコードの例です。

```dart
import 'package:your_project/api/api.dart';

void main() async {
  final api = DefaultApi(
    ApiClient(basePath: 'https://api.example.com'),
  );

  try {
    final response = await api.getUserById('123'); // エンドポイントの例
    print(response);
  } catch (e) {
    print('API error: $e');
  }
}
```

---

#### **6. 自動生成のカスタマイズ**
生成されるコードをカスタマイズしたい場合は、設定ファイルを使用します。

**設定ファイル例: `config.yaml`**
```yaml
packageName: your_project
nullableFields: true
useEnumClass: true
```

**コマンド**
```bash
openapi-generator-cli generate -i openapi.yaml -g dart-dio -o output_directory -c config.yaml
```

---

### **ポイント**
- `dart-dio` を使うことで、非同期処理に優れた `Dio` ライブラリが利用できます。
- 必要に応じてテストやモックを追加して、信頼性を高めることができます。

--- 

わからない箇所があれば教えてください！

---
