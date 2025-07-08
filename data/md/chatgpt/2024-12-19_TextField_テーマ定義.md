# TextField テーマ定義

日付: 2024-12-19

---

## 👤 ユーザー
*2024/12/19 17:06:44*

TextField のテーマを抽出して定義してほしい

TextField(
                            style: const TextStyle(
                              color: Colors.white,
                            ),
                            controller: textEditingController,
                            decoration: InputDecoration(
                              fillColor:
                                  const Color.fromARGB(255, 94, 114, 119),
                              contentPadding: const EdgeInsets.only(top: 16),
                              prefixIcon: Padding(
                                padding: const EdgeInsets.all(12),
                                child: SvgPicture.asset(
                                  Assets.icons.email.path,
                                ),
                              ),
                              filled: true,
                              focusedBorder: const OutlineInputBorder(
                                borderSide: BorderSide(width: 0),
                              ),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(4),
                              ),
                              hintText: 'Enter your email',
                              hintStyle: TextStyle(
                                color: Colors.white..withValues(alpha: (0.5)),
                              ),
                            ),
                          ),



import 'package:flutter/material.dart';
import 'package:snpit_guild_app/presentation/design_token/color_token.dart';

final ThemeData appTheme = ThemeData(
  primaryColor: ColorToken.primary,
  scaffoldBackgroundColor: ColorToken.bgDark,
  textTheme: const TextTheme(
    displayLarge: TextStyle(color: ColorToken.text), // 57 px
    displayMedium: TextStyle(color: ColorToken.text), // 45 px
    displaySmall: TextStyle(color: ColorToken.text), // 36 px
    headlineLarge: TextStyle(color: ColorToken.text), // 32 px
    headlineMedium: TextStyle(color: ColorToken.text), // 28 px
    headlineSmall: TextStyle(color: ColorToken.text), // 24 px
    titleLarge: TextStyle(color: ColorToken.text), // 22 px
    titleMedium: TextStyle(color: ColorToken.text), // 16 px
    titleSmall: TextStyle(color: ColorToken.text), // 14 px
    bodyLarge: TextStyle(color: ColorToken.text), // 16 px
    bodyMedium: TextStyle(color: ColorToken.text), // 14 px
    bodySmall: TextStyle(color: ColorToken.text), // 12 px
    labelLarge: TextStyle(color: ColorToken.text), // 14 px
    labelMedium: TextStyle(color: ColorToken.text), // 12 px
    labelSmall: TextStyle(color: ColorToken.text), // 11 px
  ),
  appBarTheme: const AppBarTheme(
    backgroundColor: ColorToken.bg,
    foregroundColor: ColorToken.text,
  ),
  listTileTheme: const ListTileThemeData(
    textColor: ColorToken.text,
  ),
  elevatedButtonTheme: ElevatedButtonThemeData(
    style: ElevatedButton.styleFrom(
      foregroundColor: ColorToken.text,
      backgroundColor: ColorToken.primaryDark,
      side: const BorderSide(color: ColorToken.primaryLight),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(4),
      ),
      minimumSize: const Size.fromHeight(48),
      textStyle: const TextStyle(
        fontWeight: FontWeight.bold, // 太字
        color: Colors.white, // テキストの色
        fontSize: 16, // フォントサイズ
      ),
    ),
  ),
  bottomNavigationBarTheme: const BottomNavigationBarThemeData(
    selectedItemColor: ColorToken.primary,
    unselectedItemColor: ColorToken.text,
    backgroundColor: ColorToken.bg,
  ),
  floatingActionButtonTheme: const FloatingActionButtonThemeData(
    foregroundColor: ColorToken.secondaryDark,
    backgroundColor: ColorToken.bgWhite,
  ),
);

---

## 🤖 アシスタント
*2024/12/19 17:07:13*

以下のように `TextField` のスタイルを抽出して `InputDecorationTheme` として `appTheme` に追加することができます。また、カスタムなスタイルが必要な場合には、`TextField` を使う際にテーマを適用することで再利用性が向上します。

```dart
import 'package:flutter/material.dart';
import 'package:snpit_guild_app/presentation/design_token/color_token.dart';

final ThemeData appTheme = ThemeData(
  primaryColor: ColorToken.primary,
  scaffoldBackgroundColor: ColorToken.bgDark,
  textTheme: const TextTheme(
    displayLarge: TextStyle(color: ColorToken.text),
    displayMedium: TextStyle(color: ColorToken.text),
    displaySmall: TextStyle(color: ColorToken.text),
    headlineLarge: TextStyle(color: ColorToken.text),
    headlineMedium: TextStyle(color: ColorToken.text),
    headlineSmall: TextStyle(color: ColorToken.text),
    titleLarge: TextStyle(color: ColorToken.text),
    titleMedium: TextStyle(color: ColorToken.text),
    titleSmall: TextStyle(color: ColorToken.text),
    bodyLarge: TextStyle(color: ColorToken.text),
    bodyMedium: TextStyle(color: ColorToken.text),
    bodySmall: TextStyle(color: ColorToken.text),
    labelLarge: TextStyle(color: ColorToken.text),
    labelMedium: TextStyle(color: ColorToken.text),
    labelSmall: TextStyle(color: ColorToken.text),
  ),
  appBarTheme: const AppBarTheme(
    backgroundColor: ColorToken.bg,
    foregroundColor: ColorToken.text,
  ),
  listTileTheme: const ListTileThemeData(
    textColor: ColorToken.text,
  ),
  elevatedButtonTheme: ElevatedButtonThemeData(
    style: ElevatedButton.styleFrom(
      foregroundColor: ColorToken.text,
      backgroundColor: ColorToken.primaryDark,
      side: const BorderSide(color: ColorToken.primaryLight),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(4),
      ),
      minimumSize: const Size.fromHeight(48),
      textStyle: const TextStyle(
        fontWeight: FontWeight.bold,
        color: Colors.white,
        fontSize: 16,
      ),
    ),
  ),
  bottomNavigationBarTheme: const BottomNavigationBarThemeData(
    selectedItemColor: ColorToken.primary,
    unselectedItemColor: ColorToken.text,
    backgroundColor: ColorToken.bg,
  ),
  floatingActionButtonTheme: const FloatingActionButtonThemeData(
    foregroundColor: ColorToken.secondaryDark,
    backgroundColor: ColorToken.bgWhite,
  ),
  inputDecorationTheme: InputDecorationTheme(
    filled: true,
    fillColor: const Color.fromARGB(255, 94, 114, 119),
    contentPadding: const EdgeInsets.only(top: 16),
    prefixIconConstraints: const BoxConstraints(
      minWidth: 40,
      minHeight: 40,
    ),
    prefixIcon: Padding(
      padding: const EdgeInsets.all(12),
      child: Icon(Icons.email, color: Colors.white),
    ),
    focusedBorder: const OutlineInputBorder(
      borderSide: BorderSide(width: 0, color: Colors.transparent),
    ),
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(4),
    ),
    hintStyle: TextStyle(
      color: Colors.white.withOpacity(0.5),
    ),
  ),
);
```

### カスタム TextField の使用例
テーマを適用した TextField を次のようにシンプルに使用できます:

```dart
TextField(
  style: const TextStyle(
    color: Colors.white,
  ),
  controller: textEditingController,
  decoration: InputDecoration(
    hintText: 'Enter your email',
  ),
);
```

これにより、スタイルが統一され、コードの保守性が向上します。また、`InputDecorationTheme` を拡張する場合は、さらにカスタマイズが可能です。

---

## 👤 ユーザー
*2024/12/19 17:08:34*

prefix という定義はないらしい

inputDecorationTheme: InputDecorationTheme(
    filled: true,
    fillColor: const Color.fromARGB(255, 94, 114, 119),
    contentPadding: const EdgeInsets.only(top: 16),
    prefixIconConstraints: const BoxConstraints(
      minWidth: 40,
      minHeight: 40,
    ),
    prefix: const Padding(
      padding: EdgeInsets.all(12),
      child: Icon(Icons.email, color: Colors.white),
    ),
    focusedBorder: const OutlineInputBorder(
      borderSide: BorderSide(width: 0, color: Colors.transparent),
    ),
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(4),
    ),
    hintStyle: TextStyle(
      color: Colors.white.withOpacity(0.5),
    ),
  ),

---

## 🤖 アシスタント
*2024/12/19 17:08:44*

確かに、`InputDecorationTheme` に `prefix` というプロパティはありません。正しいプロパティは `prefixIcon` です。`prefixIcon` はアイコンやウィジェットを TextField の左側に配置するために使用します。

修正後のコードは以下のようになります:

```dart
inputDecorationTheme: InputDecorationTheme(
  filled: true,
  fillColor: const Color.fromARGB(255, 94, 114, 119),
  contentPadding: const EdgeInsets.only(top: 16),
  prefixIconConstraints: const BoxConstraints(
    minWidth: 40,
    minHeight: 40,
  ),
  prefixIcon: Padding(
    padding: const EdgeInsets.all(12),
    child: Icon(Icons.email, color: Colors.white),
  ),
  focusedBorder: const OutlineInputBorder(
    borderSide: BorderSide(width: 0, color: Colors.transparent),
  ),
  border: OutlineInputBorder(
    borderRadius: BorderRadius.circular(4),
  ),
  hintStyle: TextStyle(
    color: Colors.white.withOpacity(0.5),
  ),
),
```

これにより、`prefixIcon` に正しい定義を適用し、エラーを回避できます。もしカスタムウィジェットをアイコン部分に挿入したい場合でも、この方法で対応できます。

---

## 👤 ユーザー
*2024/12/19 17:15:27*

カーソルの色を白にしたい

inputDecorationTheme: InputDecorationTheme(
    filled: true,
    fillColor: ColorToken.bgLight,
    contentPadding: const EdgeInsets.only(top: 16),
    prefixIconConstraints: const BoxConstraints(
      minWidth: 40,
      minHeight: 40,
    ),
    focusedBorder: const OutlineInputBorder(
      borderSide: BorderSide(width: 0),
    ),
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(4),
    ),
    hintStyle: TextStyle(
      color: Colors.white.withOpacity(0.5),
    ),
  ),

---

## 🤖 アシスタント
*2024/12/19 17:15:41*

カーソルの色を変更するには、`TextField` または `TextFormField` の `cursorColor` プロパティを使用します。テーマに基づいて統一する場合は、`ThemeData` の `textSelectionTheme` を使用します。

以下のように、`appTheme` に `textSelectionTheme` を追加してカーソルの色を白に設定できます。

### 修正コード
```dart
final ThemeData appTheme = ThemeData(
  primaryColor: ColorToken.primary,
  scaffoldBackgroundColor: ColorToken.bgDark,
  inputDecorationTheme: InputDecorationTheme(
    filled: true,
    fillColor: ColorToken.bgLight,
    contentPadding: const EdgeInsets.only(top: 16),
    prefixIconConstraints: const BoxConstraints(
      minWidth: 40,
      minHeight: 40,
    ),
    focusedBorder: const OutlineInputBorder(
      borderSide: BorderSide(width: 0),
    ),
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(4),
    ),
    hintStyle: TextStyle(
      color: Colors.white.withOpacity(0.5),
    ),
  ),
  textSelectionTheme: const TextSelectionThemeData(
    cursorColor: Colors.white, // カーソルの色を白に設定
  ),
);
```

### 使用例
これで、`TextField` を以下のように使用すれば、カーソルの色はテーマから適用されます。

```dart
TextField(
  style: const TextStyle(
    color: Colors.white,
  ),
  decoration: InputDecoration(
    hintText: 'Enter your text',
  ),
);
```

`textSelectionTheme` に設定することで、すべての `TextField` や `TextFormField` に統一されたカーソルの色が適用され、再利用性が向上します。

---
