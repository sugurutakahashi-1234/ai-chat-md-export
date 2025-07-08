# OutlinedButton テンプレート作成

Date: 2025-01-06

---

## 👤 User
*2025-01-06 16:09:37*

{
  "content_type": "image_asset_pointer",
  "asset_pointer": "file-service://file-AsJ62dvK3Q4825FquLpRa6",
  "size_bytes": 16834,
  "width": 441,
  "height": 93,
  "fovea": null,
  "metadata": {
    "dalle": null,
    "gizmo": null,
    "generation": null,
    "container_pixel_height": null,
    "container_pixel_width": null,
    "emu_omit_glimpse_image": null,
    "emu_patches_override": null,
    "sanitized": true,
    "asset_pointer_link": null,
    "watermarked_asset_pointer": null
  }
}
flutterで画像で添付したようなテンプレートをつくってほしい。
ElevatedButtonではなくてOutlinedButtonで設定したい。

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

---

## 🤖 Assistant
*2025-01-06 16:09:49*

以下は、Flutterでアウトラインボタン (`OutlinedButton`) を使用して、添付画像に近いデザインを作成するコード例です。`ButtonStyle` をカスタマイズして、ボーダーや背景色、テキストスタイルを調整しています。

```dart
import 'package:flutter/material.dart';

class GuildManagementButton extends StatelessWidget {
  final String title;
  final int notificationCount;

  const GuildManagementButton({
    Key? key,
    required this.title,
    required this.notificationCount,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return OutlinedButton(
      onPressed: () {
        // ボタンが押されたときの処理
      },
      style: OutlinedButton.styleFrom(
        foregroundColor: Colors.white,
        backgroundColor: const Color(0xFF202225), // 背景色
        side: const BorderSide(color: Color(0xFF5865F2)), // ボーダー色
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8), // ボタンの角丸
        ),
        minimumSize: const Size.fromHeight(48), // ボタンの高さ
        textStyle: const TextStyle(
          fontWeight: FontWeight.bold,
          fontSize: 16,
        ),
        padding: const EdgeInsets.symmetric(horizontal: 16),
      ),
      child: Stack(
        alignment: Alignment.centerRight,
        children: [
          Align(
            alignment: Alignment.centerLeft,
            child: Text(title),
          ),
          Container(
            padding: const EdgeInsets.all(8),
            decoration: const BoxDecoration(
              color: Color(0xFF43B581), // 緑の背景色
              shape: BoxShape.circle,
            ),
            child: Text(
              notificationCount.toString(),
              style: const TextStyle(
                color: Colors.white, // テキスト色
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

void main() {
  runApp(const MaterialApp(
    home: Scaffold(
      backgroundColor: Colors.black,
      body: Center(
        child: GuildManagementButton(
          title: "Manage this guild",
          notificationCount: 3,
        ),
      ),
    ),
  ));
}
```

### コードのポイント
1. **OutlinedButton**:
   - `OutlinedButton.styleFrom`を使用して、`borderRadius`、ボーダー、背景色などをカスタマイズしています。

2. **通知バッジ**:
   - `Stack`ウィジェットを使用して、右端に円形のバッジを配置しています。
   - `Container`に`BoxDecoration`を設定して、円形デザインを適用しました。

3. **可読性と再利用性**:
   - ボタンタイトルと通知数をパラメータとして受け取り、再利用可能なウィジェットとして作成しています。

実行すると、指定されたデザインに近いカスタムアウトラインボタンが表示されます。デザインや配色は適宜変更可能です！

---

## 👤 User
*2025-01-06 16:10:06*

ThemeDataで設定したい

---

## 🤖 Assistant
*2025-01-06 16:10:26*

`ThemeData`で`OutlinedButton`のスタイルを設定する方法を以下に示します。`OutlinedButtonThemeData`を使用して、アプリ全体で適用できるテーマを定義します。

### 実装コード

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData(
        outlinedButtonTheme: OutlinedButtonThemeData(
          style: OutlinedButton.styleFrom(
            foregroundColor: Colors.white,
            backgroundColor: const Color(0xFF202225), // 背景色
            side: const BorderSide(color: Color(0xFF5865F2)), // ボーダー色
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8), // ボタンの角丸
            ),
            minimumSize: const Size.fromHeight(48), // ボタンの高さ
            textStyle: const TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 16,
            ),
            padding: const EdgeInsets.symmetric(horizontal: 16),
          ),
        ),
      ),
      home: GuildManagementScreen(),
    );
  }
}

class GuildManagementScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Center(
        child: OutlinedButton(
          onPressed: () {
            // ボタンが押されたときの処理
          },
          child: Stack(
            alignment: Alignment.centerRight,
            children: [
              Align(
                alignment: Alignment.centerLeft,
                child: Text("Manage this guild"),
              ),
              Container(
                padding: const EdgeInsets.all(8),
                decoration: const BoxDecoration(
                  color: Color(0xFF43B581), // 緑の背景色
                  shape: BoxShape.circle,
                ),
                child: const Text(
                  "3",
                  style: TextStyle(
                    color: Colors.white, // テキスト色
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

---

### コードのポイント

1. **`outlinedButtonTheme`の設定**:
   - `ThemeData`に`OutlinedButtonThemeData`を設定することで、アプリ全体で共通の`OutlinedButton`スタイルを使用できます。
   - 背景色、ボーダー、角丸、テキストスタイルなどをカスタマイズしました。

2. **通知バッジの実装**:
   - ボタンの中で`Stack`を使用し、右端に円形のバッジを表示します。
   - バッジのスタイルは`Container`と`BoxDecoration`でカスタマイズしました。

3. **テーマの適用**:
   - `OutlinedButton`をそのまま使用するだけで、定義されたテーマが自動的に適用されます。

---

### 期待される結果

- アプリ全体で同じスタイルの`OutlinedButton`が利用可能になります。
- 添付画像に近いボタンデザインが再現されます。
- デザインの一元管理が可能になり、メンテナンス性が向上します。

必要に応じてテーマの色やスタイルを変更してください！

---

## 👤 User
*2025-01-06 16:21:59*

このボタンだけ32にしたい

                        OutlinedButton(
                          onPressed: () {
                            context.push(Screen.deckDetail.path);
                          },
                          child: const Text(
                            'Edit deck',
                            style: TextStyle(color: ColorToken.text),
                          ),
                        ),

---

## 🤖 Assistant
*2025-01-06 16:22:10*

特定のボタンにだけ高さ (`minimumSize`) を指定する場合は、`OutlinedButton.styleFrom` を使用して、そのボタンにスタイルを上書きできます。

以下は、`minimumSize` を `32` に設定する方法です。

### 修正後のコード例

```dart
OutlinedButton(
  onPressed: () {
    context.push(Screen.deckDetail.path);
  },
  style: OutlinedButton.styleFrom(
    minimumSize: const Size.fromHeight(32), // 高さを32に設定
    foregroundColor: ColorToken.text, // テキストの色
    side: BorderSide(color: ColorToken.primaryLight), // ボーダーの色
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(4), // ボタンの角丸
    ),
    padding: const EdgeInsets.symmetric(horizontal: 16), // 横方向の余白
  ),
  child: const Text(
    'Edit deck',
    style: TextStyle(color: ColorToken.text),
  ),
),
```

---

### ポイント解説

1. **`style`のローカル設定**:
   - `OutlinedButton.styleFrom` をボタンごとに直接指定することで、このボタンだけスタイルを変更できます。

2. **`minimumSize`**:
   - `minimumSize: const Size.fromHeight(32)` を指定してボタンの高さを固定しています。

3. **他のスタイルをテーマから継承する**:
   - 必要に応じて、`foregroundColor`, `side`, `shape` なども指定することで、テーマのスタイルを引き継ぎつつカスタマイズできます。

---

### この方法のメリット

- 他のボタンのスタイルには影響を与えず、このボタンだけ高さを変更できます。
- 既存のテーマ設定をオーバーライドする場合にも適用可能です。

### 注意点

- もしテーマ全体に依存したい場合は、テーマのパラメータを明示的に継承することで、他の部分との一貫性を保つことができます。

---
