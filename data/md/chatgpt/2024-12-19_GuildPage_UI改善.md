# GuildPage UI改善

日付: 2024-12-19

---

## 👤 ユーザー
*2024/12/19 22:06:36*

{
  "content\_type": "image\_asset\_pointer",
  "asset\_pointer": "file-service://file-5xKTAejDoik7h2GR5zEgEx",
  "size\_bytes": 126529,
  "width": 507,
  "height": 948,
  "fovea": null,
  "metadata": {
    "dalle": null,
    "gizmo": null,
    "generation": null,
    "container\_pixel\_height": null,
    "container\_pixel\_width": null,
    "emu\_omit\_glimpse\_image": null,
    "emu\_patches\_override": null,
    "sanitized": true,
    "asset\_pointer\_link": null,
    "watermarked\_asset\_pointer": null
  }
}
paddingはhorizonに24と絵は仮でよいので、実装を少し近づけて欲しい

import 'package:flutter/material.dart';
import 'package:flutter\_hooks/flutter\_hooks.dart';
import 'package:go\_router/go\_router.dart';
import 'package:hooks\_riverpod/hooks\_riverpod.dart';
import 'package:snpit\_guild\_app/domain/screen.dart';
import 'package:snpit\_guild\_app/presentation/providers/api\_client/guilds/get\_guild\_info.dart';

class GuildPage extends HookConsumerWidget {
  const GuildPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    useEffect(
      () {
        Future.microtask(() {
          ref.read(getGuildInfoNotifierProvider.notifier).executeRequest();
        });
        return null;
      },
      \[\],
    );

    final guildInfoAsync = ref.watch(getGuildInfoNotifierProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Guild Page')),
      body: guildInfoAsync.when(
        data: (guildInfo) =&gt; Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: \[
              if (guildInfo != null) Text('Guild Info: $guildInfo'),
              if (guildInfo == null)
                const Text(
                  'No guild affiliation \\nJoin a guild or create a new one!',
                ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () {
                  context.push(Screen.guildCode.path);
                },
                child: const Text('Join an existing guild'),
              ),
              ElevatedButton(
                onPressed: () {
                  context.push(Screen.guildCreate.path);
                },
                child: const Text('Host a new guild'),
              ),
            \],
          ),
        ),
        loading: () =&gt; const Center(child: CircularProgressIndicator()),
        error: (error, stackTrace) =&gt; Center(
          child: Text('Error: $error'),
        ),
      ),
    );
  }
}

---

## 🤖 アシスタント
*2024/12/19 22:06:43*

Here’s an updated implementation of your `GuildPage` that better aligns with the provided design:

### Key Adjustments:
1. \*\*Horizontal Padding:\*\* Set to `24` as requested.
2. \*\*Design Updates:\*\*
   -

---

## 👤 ユーザー
*2024/12/19 22:13:21*

{
  "content_type": "image_asset_pointer",
  "asset_pointer": "file-service://file-XAYr5Sb5foNE2Yjo6Hms43",
  "size_bytes": 1196761,
  "width": 896,
  "height": 1798,
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
現在の実装は1枚目。
2枚目は実装予定。

paddingはhorizonに24にして欲しいのと、2つの画像は仮でよいので、実装を少し近づけて欲しい。

```
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:snpit_guild_app/domain/screen.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/guilds/get_guild_info.dart';

class GuildPage extends HookConsumerWidget {
  const GuildPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    useEffect(
      () {
        Future.microtask(() {
          ref.read(getGuildInfoNotifierProvider.notifier).executeRequest();
        });
        return null;
      },
      [],
    );

    final guildInfoAsync = ref.watch(getGuildInfoNotifierProvider);

    return Scaffold(
      body: guildInfoAsync.when(
        data: (guildInfo) => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              if (guildInfo != null) Text('Guild Info: $guildInfo'),
              if (guildInfo == null)
                const Text(
                  'No guild affiliation \nJoin a guild or create a new one!',
                ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () {
                  context.push(Screen.guildCode.path);
                },
                child: const Text('Join an existing guild'),
              ),
              ElevatedButton(
                onPressed: () {
                  context.push(Screen.guildCreate.path);
                },
                child: const Text('Host a new guild'),
              ),
            ],
          ),
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stackTrace) => Center(
          child: Text('Error: $error'),
        ),
      ),
    );
  }
}
```

---

## 🤖 アシスタント
*2024/12/19 22:14:02*

Here is the updated implementation of your `GuildPage` that aligns more closely with the design in your second image, including horizontal padding set to `24` and placeholder images for the buttons:

```dart
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:snpit_guild_app/domain/screen.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/guilds/get_guild_info.dart';

class GuildPage extends HookConsumerWidget {
  const GuildPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    useEffect(
      () {
        Future.microtask(() {
          ref.read(getGuildInfoNotifierProvider.notifier).executeRequest();
        });
        return null;
      },
      [],
    );

    final guildInfoAsync = ref.watch(getGuildInfoNotifierProvider);

    return Scaffold(
      body: guildInfoAsync.when(
        data: (guildInfo) => Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              if (guildInfo == null)
                const Text(
                  'No guild affiliation\nJoin a guild or create a new one!',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              const SizedBox(height: 32),
              _GuildOptionButton(
                imagePath: 'assets/images/join_guild_placeholder.png', // Placeholder image
                label: 'Join an existing guild',
                onTap: () {
                  context.push(Screen.guildCode.path);
                },
              ),
              const SizedBox(height: 16),
              _GuildOptionButton(
                imagePath: 'assets/images/host_guild_placeholder.png', // Placeholder image
                label: 'Host a new guild',
                onTap: () {
                  context.push(Screen.guildCreate.path);
                },
              ),
            ],
          ),
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stackTrace) => Center(
          child: Text('Error: $error'),
        ),
      ),
    );
  }
}

class _GuildOptionButton extends StatelessWidget {
  final String imagePath;
  final String label;
  final VoidCallback onTap;

  const _GuildOptionButton({
    required this.imagePath,
    required this.label,
    required this.onTap,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: onTap,
      style: ElevatedButton.styleFrom(
        padding: EdgeInsets.zero,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(8),
          color: Theme.of(context).colorScheme.primaryContainer,
        ),
        child: Row(
          children: [
            Image.asset(
              imagePath,
              width: 48,
              height: 48,
              fit: BoxFit.cover,
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Text(
                label,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            const Icon(Icons.arrow_forward),
          ],
        ),
      ),
    );
  }
}
```

### Changes Made:
1. **Padding:** Added horizontal padding of 24 around the content.
2. **Design Refinement:**
   - `ElevatedButton` replaced with a custom-styled button to match the layout.
   - Added an image next to the button text (placeholder paths included).
   - Added an arrow icon (`Icons.arrow_forward`) to indicate navigation.
3. **Placeholder Images:** Used `Image.asset` for mock images to resemble the design.

Replace `assets/images/join_guild_placeholder.png` and `assets/images/host_guild_placeholder.png` with your actual image paths.

Let me know if you need further adjustments!

---

## 👤 ユーザー
*2024/12/19 22:17:13*

ボタンの領域は全体ではなくていいよ。
また、ElevatedButtonのフォントなどは指定されている。また関数化しないでいいよ。

import 'package:flutter/material.dart';
import 'package:snpit\_guild\_app/presentation/design\_token/color\_pallet.dart';
import 'package:snpit\_guild\_app/presentation/design\_token/color\_token.dart';

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
  bottomNavigationBarTheme: const BottomNavigationBarThemeData(
    selectedItemColor: ColorToken.primary,
    unselectedItemColor: ColorToken.text,
    backgroundColor: ColorPallet.gray1000, // TODO: ColorPallet を指定しているのでColorToken で定義してもらう
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
    cursorColor: ColorToken.text, // カーソルの色を白に設定
  ),
);

---

## 🤖 アシスタント
*2024/12/19 22:17:51*

以下は、指定されたデザインと要件を考慮した `GuildPage` の実装例です。

### 主な変更点:
1. **`ElevatedButton` スタイル:**
   - テーマ設定に従い、フォント、サイズ、背景色などを自動適用。
   - 最小サイズを全体幅から独立させ、必要なサイズのみを占めるように調整。
2. **水平パディング:**
   - 全体の水平パディングを 24 に設定。
3. **簡易的な仮画像を使用。**

以下がコードです：

```dart
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:snpit_guild_app/domain/screen.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/guilds/get_guild_info.dart';

class GuildPage extends HookConsumerWidget {
  const GuildPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    useEffect(() {
      Future.microtask(() {
        ref.read(getGuildInfoNotifierProvider.notifier).executeRequest();
      });
      return null;
    }, []);

    final guildInfoAsync = ref.watch(getGuildInfoNotifierProvider);

    return Scaffold(
      body: guildInfoAsync.when(
        data: (guildInfo) => Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              if (guildInfo == null) ...[
                const Text(
                  'No guild affiliation\nJoin a guild or create a new one!',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 32),
                ElevatedButton(
                  onPressed: () {
                    context.push(Screen.guildCode.path);
                  },
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Image.asset(
                        'assets/images/join_guild_placeholder.png', // 仮画像パス
                        width: 24,
                        height: 24,
                      ),
                      const SizedBox(width: 8),
                      const Text('Join an existing guild'),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () {
                    context.push(Screen.guildCreate.path);
                  },
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Image.asset(
                        'assets/images/host_guild_placeholder.png', // 仮画像パス
                        width: 24,
                        height: 24,
                      ),
                      const SizedBox(width: 8),
                      const Text('Host a new guild'),
                    ],
                  ),
                ),
              ],
              if (guildInfo != null) Text('Guild Info: $guildInfo'),
            ],
          ),
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stackTrace) => Center(
          child: Text('Error: $error'),
        ),
      ),
    );
  }
}
```

### 実装の詳細：
1. **`ElevatedButton` のカスタマイズ**:
   - 画像は `Image.asset` を利用し、仮のパスを設定しています。
   - ボタン内部に `Row` を使用して、画像とテキストを並べています。
   - `mainAxisSize: MainAxisSize.min` を指定してボタン幅がコンテンツに応じて変わるようにしています。

2. **テーマ反映**:
   - スタイルは `appTheme` によって自動で適用されます。

3. **柔軟なボタン配置**:
   - 必要以上にボタンの領域を広げず、コンテンツサイズに基づく最小幅を採用しています。

### 次のステップ：
- `assets/images/join_guild_placeholder.png` や `assets/images/host_guild_placeholder.png` を適切な画像ファイルに置き換えてください。
- 必要に応じて、`guildInfo` が表示されるレイアウトをさらに調整してください。

---
