# Flutter GoogleFonts Lexend使用法

日付: 2025-01-25

---

## 👤 ユーザー
*2025/1/25 20:52:47*

FlutterでGoogleFonts.lexendを使いたい

---

## 🤖 アシスタント
*2025/1/25 20:53:16*

Flutterで`GoogleFonts.lexend`を使うには、`google_fonts`パッケージを使用します。このパッケージはGoogle Fontsのフォントを簡単にアプリに取り込むためのものです。以下はセットアップと使用方法の手順です。

---

### 1. **パッケージのインストール**
`pubspec.yaml`に以下を追加して、`google_fonts`パッケージをインストールします。

```yaml
dependencies:
  flutter:
    sdk: flutter
  google_fonts: ^5.0.0
```

その後、以下のコマンドを実行してパッケージをインストールします：

```bash
flutter pub get
```

---

### 2. **`GoogleFonts.lexend`を使う**
以下のように`GoogleFonts.lexend`を利用できます。`TextStyle`として直接使用することができます。

#### 基本的な例
```dart
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: Text(
            'GoogleFonts Example',
            style: GoogleFonts.lexend(
              textStyle: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),
        body: Center(
          child: Text(
            'Hello, Lexend!',
            style: GoogleFonts.lexend(
              textStyle: const TextStyle(
                fontSize: 24,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
```

---

### 3. **テーマ全体で`Lexend`を使用する**
アプリ全体で`Lexend`を使いたい場合、`theme`に設定することができます。

#### テーマで設定する例
```dart
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData(
        textTheme: GoogleFonts.lexendTextTheme(), // Lexendを全体のテキストテーマに適用
      ),
      home: Scaffold(
        appBar: AppBar(
          title: const Text('Lexend Theme Example'),
        ),
        body: Center(
          child: Text(
            'This is Lexend font!',
            style: Theme.of(context).textTheme.headline4, // アプリ全体のテーマを利用
          ),
        ),
      ),
    );
  }
}
```

---

### 4. **カスタマイズ**
`GoogleFonts.lexend`には、`fontWeight`や`fontSize`、`color`などのプロパティを指定できます。

```dart
Text(
  'Custom Lexend Font',
  style: GoogleFonts.lexend(
    textStyle: const TextStyle(
      fontSize: 30,
      fontWeight: FontWeight.w600,
      color: Colors.blue,
    ),
  ),
),
```

---

これで`Lexend`フォントをFlutterアプリで簡単に使用できます！ 🎉

---
