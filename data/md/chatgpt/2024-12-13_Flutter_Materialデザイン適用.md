# Flutter Materialデザイン適用

日付: 2024-12-13

---

## 👤 ユーザー
*2024/12/13 18:37:11*

Flutter でmaterialデザインのカラーパレットを適応させたい

---

## 🤖 アシスタント
*2024/12/13 18:37:23*

FlutterでMaterialデザインのカラーパレットを適用するには、`ThemeData`をカスタマイズしてカラーパレットを指定します。以下の手順で実装できます。

---

### 1. **カラーパレットを定義する**
Flutterの`ColorScheme`を使用して、Material Design 3（M3）に準拠した色のセットを作成します。

```dart
final ColorScheme colorScheme = ColorScheme.fromSeed(
  seedColor: Colors.blue, // 基本となる色
  brightness: Brightness.light, // 明るいテーマ or 暗いテーマ
);
```

---

### 2. **`ThemeData`を設定する**
`ThemeData`で`colorScheme`を適用します。

```dart
final ThemeData themeData = ThemeData(
  colorScheme: colorScheme,
  useMaterial3: true, // Material Design 3を有効化
  appBarTheme: AppBarTheme(
    backgroundColor: colorScheme.primary, // AppBarの色を設定
  ),
  elevatedButtonTheme: ElevatedButtonThemeData(
    style: ElevatedButton.styleFrom(
      backgroundColor: colorScheme.secondary, // ボタンの色を設定
    ),
  ),
);
```

---

### 3. **`MaterialApp`に適用する**
`MaterialApp`の`theme`プロパティにカスタマイズした`ThemeData`を設定します。

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Material Design',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.blue, // 基本色
          brightness: Brightness.light, // 明るいテーマ
        ),
        useMaterial3: true, // Material Design 3を使用
      ),
      home: MyHomePage(),
    );
  }
}

class MyHomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Material Design Example'),
      ),
      body: Center(
        child: ElevatedButton(
          onPressed: () {},
          child: Text('Button'),
        ),
      ),
    );
  }
}
```

---

### 4. **カスタム色を指定する場合**
Material Designのカラーパレットを完全に自分で定義することも可能です。

```dart
final customColorScheme = ColorScheme(
  brightness: Brightness.light,
  primary: Colors.teal,
  onPrimary: Colors.white,
  secondary: Colors.amber,
  onSecondary: Colors.black,
  error: Colors.red,
  onError: Colors.white,
  background: Colors.grey.shade100,
  onBackground: Colors.black,
  surface: Colors.white,
  onSurface: Colors.black,
);
```

この`customColorScheme`を`ThemeData`の`colorScheme`に設定します。

---

### 5. **暗いテーマのサポート**
暗いテーマをサポートする場合は、`darkTheme`プロパティを設定します。

```dart
return MaterialApp(
  theme: ThemeData(
    colorScheme: ColorScheme.fromSeed(
      seedColor: Colors.blue,
      brightness: Brightness.light,
    ),
    useMaterial3: true,
  ),
  darkTheme: ThemeData(
    colorScheme: ColorScheme.fromSeed(
      seedColor: Colors.blue,
      brightness: Brightness.dark,
    ),
    useMaterial3: true,
  ),
  themeMode: ThemeMode.system, // システムのテーマに従う
  home: MyHomePage(),
);
```

---

### 補足
- **Material Design 3**の使用を有効化するには、`useMaterial3: true`を指定します。
- **色のガイドライン**は[Material Designの公式サイト](https://m3.material.io/)で確認できます。

必要に応じてカラーパレットをカスタマイズしてください！ 😊

---

## 👤 ユーザー
*2024/12/13 18:37:54*

ColorScheme 型のドキュメントがあれば教えてほしい

---

## 🤖 アシスタント
*2024/12/13 18:38:01*

summaryColorScheme クラス - material ライブラリ - Dart APIturn0search0
`ColorScheme` クラスは、Flutter アプリ全体のカラーパレットを定義するためのクラスで、Material Design のガイドラインに基づいています。これにより、アプリ内の各 UI コンポーネントに一貫した色を適用できます。

`ColorScheme` の公式ドキュメントは以下のリンクから参照できます。

このドキュメントでは、`ColorScheme` クラスの各プロパティや使用方法について詳しく説明されています。特に、`primary` や `secondary` などの主要な色プロパティや、それらに対応する `onPrimary`、`onSecondary` などのテキストやアイコンの色に関するプロパティについて理解することが重要です。

また、`ColorScheme` を使用してアプリ全体のテーマを設定する方法については、以下の日本語記事が参考になります。

- [Flutterでカラーテーマーを管理するColorSchemeの設定と、現在のColorSchemeを取得する方法](https://www.sukerou.com/2024/07/fluttercolorschemecolorscheme.html)
- [Flutter / ColorSchemeの設定方法](https://zenn.dev/gen_kk/articles/cc538ffa392922)

これらの記事では、`ColorScheme` を用いたテーマ設定の具体的な手順や、各プロパティの詳細について解説されています。特に、`ColorScheme` を `ThemeData` に適用し、`MaterialApp` に設定する方法など、実際のコード例を交えて説明されています。

`ColorScheme` を適切に活用することで、アプリ全体のデザインに統一感を持たせることができます。公式ドキュメントや上記の記事を参考に、効果的なカラーテーマの設定を行ってみてください。

---
