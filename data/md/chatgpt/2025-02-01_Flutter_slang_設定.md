# Flutter slang 設定

Date: 2025-02-01

---

## 👤 User
*2025-02-01 22:40:20*

Flutterでslangを導入してみたい。
行う設定だったり、以下を試してみたいので、それを検証する方法だったりを教えて欲しい。
デフォルトはenでjaも対応したい。
結構詳しく書いて。
Flutterのプロジェクトはすでに作成済みである

en.i18n.json
{
  "hello": "Hello $name",
  "save": "Save",
  "login": {
    "success": "Logged in successfully",
    "fail": "Logged in failed"
  }
}

jp.i18n.json
{
  "hello": "こんにちは $name",
  "save": "保存",
  "login": {
    "success": "ログイン成功",
    "fail": "ログイン失敗"
  }
}

---

## 🤖 Assistant
*2025-02-01 22:40:56*

### Flutter に `slang` を導入し、多言語対応 (en, ja) を設定する方法

#### 1. `slang` パッケージの導入
Flutter プロジェクトが既に作成済みとのことなので、以下のコマンドで `slang` を導入します。

```sh
flutter pub add slang slang_flutter
```

また、dev_dependencies に `slang_build_runner` を追加します。

```sh
flutter pub add --dev slang_build_runner
```

#### 2. 言語ファイルの配置
次に、`assets/i18n/` ディレクトリを作成し、以下のように JSON ファイルを配置します。

```
/assets/i18n/
  ├── en.i18n.json
  ├── jp.i18n.json
```

内容は以下の通り：

**`en.i18n.json`**
```json
{
  "hello": "Hello $name",
  "save": "Save",
  "login": {
    "success": "Logged in successfully",
    "fail": "Logged in failed"
  }
}
```

**`jp.i18n.json`**
```json
{
  "hello": "こんにちは $name",
  "save": "保存",
  "login": {
    "success": "ログイン成功",
    "fail": "ログイン失敗"
  }
}
```

#### 3. `slang` の設定ファイル `build.yaml` の作成
Flutter の `slang` は `build_runner` を使ってコード生成を行うため、プロジェクトのルートに `build.yaml` を作成し、以下の内容を記述します。

**`build.yaml`**
```yaml
targets:
  $default:
    builders:
      slang_build_runner:
        options:
          base_locale: en
          input_directory: assets/i18n
          output_file_name: translations.g.dart
          fallback_strategy: base_locale
```

この設定により：
- `en` をデフォルトの言語に設定
- `assets/i18n/` ディレクトリの JSON ファイルを対象とする
- `translations.g.dart` にコードを生成
- `fallback_strategy: base_locale` により、翻訳が見つからない場合は `en` にフォールバック

#### 4. `pubspec.yaml` で `assets` の設定
JSON ファイルをアセットとして利用するため、`pubspec.yaml` に以下を追加。

```yaml
flutter:
  assets:
    - assets/i18n/
```

#### 5. コード生成
以下のコマンドで翻訳データを Dart コードに変換します。

```sh
flutter pub run build_runner build
```

成功すると、`lib/generated/translations.g.dart` が生成されます。

#### 6. 翻訳の利用
次に `MaterialApp` で `slang_flutter` の `TranslationProvider` をセットアップします。

**`main.dart`**
```dart
import 'package:flutter/material.dart';
import 'package:slang_flutter/slang_flutter.dart';
import 'package:my_app/generated/translations.g.dart'; // 生成された翻訳ファイルをインポート

void main() {
  runApp(
    TranslationProvider(
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Slang Demo',
      debugShowCheckedModeBanner: false,
      localizationsDelegates: GlobalMaterialLocalizations.delegates,
      supportedLocales: AppLocaleUtils.supportedLocales,
      locale: TranslationProvider.of(context).flutterLocale, // 現在のロケール
      home: const HomeScreen(),
    );
  }
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(t.hello(name: 'Taro'))), // 翻訳適用
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(t.login.success), // "ログイン成功" (ja) / "Logged in successfully" (en)
            ElevatedButton(
              onPressed: () {
                TranslationProvider.of(context).setLocale(AppLocale.jp);
              },
              child: Text(t.save), // "保存" (ja) / "Save" (en)
            ),
          ],
        ),
      ),
    );
  }
}
```

#### 7. 言語の切り替え
`TranslationProvider.of(context).setLocale(AppLocale.jp);` を呼び出すことで、日本語に切り替えられます。

---

### ✅ 検証方法
1. アプリを起動し、初期状態で英語 (`en`) で表示されることを確認する。
2. ボタンを押して `setLocale(AppLocale.jp);` を実行し、日本語 (`ja`) に切り替わることを確認する。
3. デバイスの言語設定を `ja` に変更し、アプリが `ja` をデフォルトで使用するか確認する。
4. `assets/i18n/jp.i18n.json` の内容を変更し、`flutter pub run build_runner build` を再実行後、翻訳が正しく反映されるか確認する。

### まとめ
- `slang` は `build_runner` を利用して翻訳ファイルを Dart コードに変換。
- `TranslationProvider` を使って言語の切り替えが可能。
- `t.hello(name: 'Taro')` のように簡単に翻訳を利用できる。
- `flutter pub run build_runner build` で翻訳データを更新。

これで `slang` を使った Flutter の多言語対応が実装できます！ 🚀

---
