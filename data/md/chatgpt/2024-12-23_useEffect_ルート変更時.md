# useEffect ルート変更時

Date: 2024-12-23

---

## 👤 User
*2024-12-23 20:48:03*

この画面でpopだったり、訪れるたびにuseEffectの処理を行いたい

import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:snpit_guild_app/domain/screen.dart';
import 'package:snpit_guild_app/gen/assets.gen.dart';
import 'package:snpit_guild_app/presentation/design_token/color_token.dart';
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
        data: (guildInfo) {
          if (guildInfo != null) {
            return Center(
              child: Text('Guild Info: $guildInfo'),
            );
          } else {
            return const Padding(
              padding: EdgeInsets.symmetric(horizontal: 16),
              child: SingleChildScrollView(
                child: _NoGuildWidget(),
              ),
            );
          }
        },
        loading: () =&gt; const Center(child: CircularProgressIndicator()),
        error: (error, stackTrace) {
          WidgetsBinding.instance.addPostFrameCallback((_) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Error: $error')),
            );
          });
          return Center(child: Text('An error occurred: $error'));
        },
      ),
    );
  }
}

class _NoGuildWidget extends StatelessWidget {
  const _NoGuildWidget();

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const SizedBox(height: 48),
        const Text(
          'No guild affiliation',
          style: TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.bold,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 20),
        const Text(
          'Join a guild or create a new one!',
          style: TextStyle(fontSize: 16),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 56),
        Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: ColorToken.secondary),
          ),
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              Image.asset(
                // TODO: 画像を差し替える
                Assets.images.animalsLogin.path,
                width: 213,
                height: 70,
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () {
                  context.push(Screen.guildCode.path);
                },
                child: const Stack(
                  alignment: Alignment.center,
                  children: [
                    Center(
                      child: Text(
                        'Join an existing guild',
                      ),
                    ),
                    Positioned(
                      right: 0,
                      child: Icon(
                        Icons.arrow_forward,
                        size: 24,
                        color: ColorToken.text,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: ColorToken.secondary),
          ),
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              Image.asset(
                // TODO: 画像を差し替える
                Assets.images.animalsLogin.path,
                width: 213,
                height: 70,
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () {
                  context.push(Screen.guildCreate.path);
                },
                child: const Stack(
                  alignment: Alignment.center,
                  children: [
                    Center(
                      child: Text('Host a new guild'),
                    ),
                    Positioned(
                      right: 0,
                      child: Icon(
                        Icons.arrow_forward,
                        size: 24,
                        color: ColorToken.text,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 48),
      ],
    );
  }
}

---

## 🤖 Assistant
*2024-12-23 20:48:48*

訪れるたびに `useEffect` の処理を行うには、画面が表示されるたびに実行する仕組みを作る必要があります。この場合、`GoRouter` のリスナーやページスタックの管理を活用して、ページが `pop` されたり、再訪問されたタイミングで `useEffect` をトリガーする方法が考えられます。

以下のように実装できます：

### 変更点

1. **`useEffect` の依存関係を管理**: 依存関係に `GoRouter` のリスナーを追加して、画面が再訪問された際に処理を再実行するように設定します。
2. **`GoRouter` のリスナーを使用**: 現在のルートがこのページに一致した際に `useEffect` をトリガーします。

以下は修正後のコード例です：

```dart
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:snpit_guild_app/domain/screen.dart';
import 'package:snpit_guild_app/gen/assets.gen.dart';
import 'package:snpit_guild_app/presentation/design_token/color_token.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/guilds/get_guild_info.dart';

class GuildPage extends HookConsumerWidget {
  const GuildPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final goRouter = GoRouter.of(context);

    useEffect(
      () {
        void handleRouteChange() {
          if (goRouter.location == Screen.guild.path) {
            // ページが訪問されるたびに再実行
            ref.read(getGuildInfoNotifierProvider.notifier).executeRequest();
          }
        }

        // 初回実行
        handleRouteChange();

        // GoRouter のリスナーを追加
        goRouter.addListener(handleRouteChange);

        // クリーンアップ: リスナーを削除
        return () => goRouter.removeListener(handleRouteChange);
      },
      [goRouter.location], // 現在のルートが変更されたときに再実行
    );

    final guildInfoAsync = ref.watch(getGuildInfoNotifierProvider);

    return Scaffold(
      body: guildInfoAsync.when(
        data: (guildInfo) {
          if (guildInfo != null) {
            return Center(
              child: Text('Guild Info: $guildInfo'),
            );
          } else {
            return const Padding(
              padding: EdgeInsets.symmetric(horizontal: 16),
              child: SingleChildScrollView(
                child: _NoGuildWidget(),
              ),
            );
          }
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stackTrace) {
          WidgetsBinding.instance.addPostFrameCallback((_) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Error: $error')),
            );
          });
          return Center(child: Text('An error occurred: $error'));
        },
      ),
    );
  }
}

class _NoGuildWidget extends StatelessWidget {
  const _NoGuildWidget();

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const SizedBox(height: 48),
        const Text(
          'No guild affiliation',
          style: TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.bold,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 20),
        const Text(
          'Join a guild or create a new one!',
          style: TextStyle(fontSize: 16),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 56),
        Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: ColorToken.secondary),
          ),
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              Image.asset(
                // TODO: 画像を差し替える
                Assets.images.animalsLogin.path,
                width: 213,
                height: 70,
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () {
                  context.push(Screen.guildCode.path);
                },
                child: const Stack(
                  alignment: Alignment.center,
                  children: [
                    Center(
                      child: Text(
                        'Join an existing guild',
                      ),
                    ),
                    Positioned(
                      right: 0,
                      child: Icon(
                        Icons.arrow_forward,
                        size: 24,
                        color: ColorToken.text,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: ColorToken.secondary),
          ),
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              Image.asset(
                // TODO: 画像を差し替える
                Assets.images.animalsLogin.path,
                width: 213,
                height: 70,
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () {
                  context.push(Screen.guildCreate.path);
                },
                child: const Stack(
                  alignment: Alignment.center,
                  children: [
                    Center(
                      child: Text('Host a new guild'),
                    ),
                    Positioned(
                      right: 0,
                      child: Icon(
                        Icons.arrow_forward,
                        size: 24,
                        color: ColorToken.text,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 48),
      ],
    );
  }
}
```

### この修正のポイント
1. **`useEffect` 内で GoRouter のリスナーを追加**:
   - ルートが変更されるたびに処理を確認し、必要に応じて再実行。
2. **`goRouter.location` を依存関係に追加**:
   - ルート変更時にリスナーをトリガー。

これで `GuildPage` に訪れるたびに `useEffect` が正しく動作します。

---

## 👤 User
*2024-12-23 20:49:27*

goRouter に location もaddListener もない・。

---

## 🤖 Assistant
*2024-12-23 20:50:04*

`GoRouter` に直接 `location` や `addListener` がない場合は、Flutter Hooks を活用して画面遷移やリビジット時の処理を管理する方法に変更する必要があります。

以下は `NavigatorObserver` を使用し、画面の訪問を検知して `useEffect` の処理を行う方法です。

---

### 修正後のコード

```dart
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:snpit_guild_app/domain/screen.dart';
import 'package:snpit_guild_app/gen/assets.gen.dart';
import 'package:snpit_guild_app/presentation/design_token/color_token.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/guilds/get_guild_info.dart';

class GuildPage extends HookConsumerWidget {
  const GuildPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final navigatorObserver = useMemoized(() => _GuildNavigatorObserver(onVisit: () {
          ref.read(getGuildInfoNotifierProvider.notifier).executeRequest();
        }));

    // 初回実行
    useEffect(() {
      Future.microtask(() {
        ref.read(getGuildInfoNotifierProvider.notifier).executeRequest();
      });
      return null;
    }, []);

    final guildInfoAsync = ref.watch(getGuildInfoNotifierProvider);

    return Navigator(
      observers: [navigatorObserver],
      onGenerateRoute: (settings) => MaterialPageRoute(
        builder: (context) => Scaffold(
          body: guildInfoAsync.when(
            data: (guildInfo) {
              if (guildInfo != null) {
                return Center(
                  child: Text('Guild Info: $guildInfo'),
                );
              } else {
                return const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 16),
                  child: SingleChildScrollView(
                    child: _NoGuildWidget(),
                  ),
                );
              }
            },
            loading: () => const Center(child: CircularProgressIndicator()),
            error: (error, stackTrace) {
              WidgetsBinding.instance.addPostFrameCallback((_) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Error: $error')),
                );
              });
              return Center(child: Text('An error occurred: $error'));
            },
          ),
        ),
      ),
    );
  }
}

class _GuildNavigatorObserver extends NavigatorObserver {
  final VoidCallback onVisit;

  _GuildNavigatorObserver({required this.onVisit});

  @override
  void didPush(Route<dynamic> route, Route<dynamic>? previousRoute) {
    super.didPush(route, previousRoute);
    onVisit();
  }

  @override
  void didPop(Route<dynamic> route, Route<dynamic>? previousRoute) {
    super.didPop(route, previousRoute);
    onVisit();
  }
}

class _NoGuildWidget extends StatelessWidget {
  const _NoGuildWidget();

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const SizedBox(height: 48),
        const Text(
          'No guild affiliation',
          style: TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.bold,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 20),
        const Text(
          'Join a guild or create a new one!',
          style: TextStyle(fontSize: 16),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 56),
        Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: ColorToken.secondary),
          ),
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              Image.asset(
                // TODO: 画像を差し替える
                Assets.images.animalsLogin.path,
                width: 213,
                height: 70,
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () {
                  context.push(Screen.guildCode.path);
                },
                child: const Stack(
                  alignment: Alignment.center,
                  children: [
                    Center(
                      child: Text(
                        'Join an existing guild',
                      ),
                    ),
                    Positioned(
                      right: 0,
                      child: Icon(
                        Icons.arrow_forward,
                        size: 24,
                        color: ColorToken.text,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: ColorToken.secondary),
          ),
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              Image.asset(
                // TODO: 画像を差し替える
                Assets.images.animalsLogin.path,
                width: 213,
                height: 70,
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () {
                  context.push(Screen.guildCreate.path);
                },
                child: const Stack(
                  alignment: Alignment.center,
                  children: [
                    Center(
                      child: Text('Host a new guild'),
                    ),
                    Positioned(
                      right: 0,
                      child: Icon(
                        Icons.arrow_forward,
                        size: 24,
                        color: ColorToken.text,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 48),
      ],
    );
  }
}
```

---

### 修正ポイント

1. **`NavigatorObserver` を活用**: 
   - `NavigatorObserver` をカスタマイズし、`didPush` や `didPop` イベントでページの訪問を検知。
2. **`useMemoized` としてリスナーを管理**:
   - `useEffect` とリスナーを組み合わせて効率的にリソースを管理。

---

この方法で、`GuildPage` に戻るたびに処理を実行するようになります。

---
