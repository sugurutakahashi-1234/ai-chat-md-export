# LinearProgressIndicatorテーマ設定

日付: 2025-01-08

---

## 👤 ユーザー
*2025/1/8 18:13:48*

flutterでLinearProgressIndicatorのThemaを指定したい。

 LinearProgressIndicator(
            value: value / 100, // Max value is 100
            minHeight: 6,
            color: ColorToken.primary,
            backgroundColor: ColorToken.bg,
            borderRadius: BorderRadius.circular(2),
          ),

import 'package:flutter/material.dart';
import 'package:snpit_guild_app/presentation/design_token/color_pallet.dart';
import 'package:snpit_guild_app/presentation/design_token/color_token.dart';

final ThemeData appTheme = ThemeData(
  primaryColor: ColorToken.primary,
  scaffoldBackgroundColor:
      ColorPallet.gray800, // TODO: ColorPallet を指定しているのでColorToken で定義してもらう
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
        fontWeight: FontWeight.bold,
        fontSize: 16,
      ),
    ),
  ),
  outlinedButtonTheme: OutlinedButtonThemeData(
    style: OutlinedButton.styleFrom(
      foregroundColor: ColorToken.text,
      side: const BorderSide(color: ColorToken.borderDark),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(4),
      ),
      minimumSize: const Size.fromHeight(48),
      textStyle: const TextStyle(
        fontWeight: FontWeight.bold,
        fontSize: 16,
      ),
    ),
  ),
  bottomNavigationBarTheme: const BottomNavigationBarThemeData(
    selectedItemColor: ColorToken.primary,
    unselectedItemColor: ColorToken.text,
    backgroundColor:
        ColorPallet.gray1000, // TODO: ColorPallet を指定しているのでColorToken で定義してもらう
  ),
  floatingActionButtonTheme: const FloatingActionButtonThemeData(
    foregroundColor: ColorToken.secondaryDark,
    backgroundColor: ColorToken.bgWhite,
  ),
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
      color: ColorToken.text.withValues(alpha: 0.5),
      fontSize: 16,
    ),
    labelStyle: const TextStyle(
      fontSize: 16,
    ),
  ),
  textSelectionTheme: const TextSelectionThemeData(
    cursorColor: ColorToken.text,
  ),
  dialogTheme: const DialogTheme(
    backgroundColor: ColorToken.bgLight,
    titleTextStyle: TextStyle(
      color: ColorToken.text,
      fontSize: 18,
      fontWeight: FontWeight.bold,
    ),
    contentTextStyle: TextStyle(
      color: ColorToken.text,
      fontSize: 16,
    ),
  ),
  textButtonTheme: TextButtonThemeData(
    style: TextButton.styleFrom(
      foregroundColor: ColorToken.primary,
      textStyle: const TextStyle(
        fontSize: 16,
      ),
    ),
  ),
);

---

## 🤖 アシスタント
*2025/1/8 18:14:05*

`LinearProgressIndicator` をテーマ化するには、`ProgressIndicatorThemeData` を使用します。`ThemeData` にカスタム `ProgressIndicatorThemeData` を追加して、`LinearProgressIndicator` に対して一貫したスタイルを適用できます。以下に実装例を示します。

### カスタムテーマの追加

`appTheme` に `progressIndicatorTheme` を追加し、`LinearProgressIndicator` に適用するデフォルトのスタイルを指定します。

```dart
final ThemeData appTheme = ThemeData(
  primaryColor: ColorToken.primary,
  scaffoldBackgroundColor: ColorPallet.gray800,
  textTheme: const TextTheme(
    // Text styles...
  ),
  appBarTheme: const AppBarTheme(
    backgroundColor: ColorToken.bg,
    foregroundColor: ColorToken.text,
  ),
  // 他のテーマ...
  progressIndicatorTheme: ProgressIndicatorThemeData(
    color: ColorToken.primary, // プログレスインジケータの色
    linearTrackColor: ColorToken.bg, // 背景色
    minHeight: 6, // インジケータの高さ
  ),
);
```

---

### `LinearProgressIndicator` の使用

`LinearProgressIndicator` のスタイルがテーマによって指定されている場合、個別のプロパティを指定しなくても適用されます。必要に応じて、個別のプロパティでテーマを上書きすることも可能です。

```dart
LinearProgressIndicator(
  value: value / 100, // 進捗値 (0.0 ～ 1.0)
),
```

---

### 注意点

- `color` や `backgroundColor` を直接指定すると、テーマで設定されたスタイルを上書きします。
- 例えば、`borderRadius` のようなプロパティは `LinearProgressIndicator` のネイティブプロパティではないため、カスタムウィジェットを作成するか、デコレーションを適用するラップウィジェットを作成する必要があります。

---

### カスタムラップウィジェット例 (ボーダー付き)

`borderRadius` を適用したい場合は、`Container` でラップしてデコレーションを適用します。

```dart
Container(
  decoration: BoxDecoration(
    borderRadius: BorderRadius.circular(2),
    color: ColorToken.bg, // 背景色
  ),
  child: ClipRRect(
    borderRadius: BorderRadius.circular(2),
    child: LinearProgressIndicator(
      value: value / 100,
      color: ColorToken.primary,
    ),
  ),
)
```

この方法で、カスタムスタイルを柔軟に適用できます。

---
