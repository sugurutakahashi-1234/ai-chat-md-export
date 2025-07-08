# Pull-to-refresh 実装方法

日付: 2024-12-23

---

## 👤 ユーザー
*2024/12/23 21:37:37*

ref.read(getGuildInfoNotifierProvider.notifier).executeRequest();
をpull to refreshで実行したい

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

## 🤖 アシスタント
*2024/12/23 21:37:49*

`Pull-to-refresh` 機能を実現するには、Flutter の `RefreshIndicator` を使用します。以下は、`GuildPage` に `RefreshIndicator` を組み込んで、`ref.read(getGuildInfoNotifierProvider.notifier).executeRequest();` を `onRefresh` に指定する例です。

修正版のコード:

```dart
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
      body: RefreshIndicator(
        onRefresh: () async {
          // Pull-to-refresh時にリクエストを実行
          await ref.read(getGuildInfoNotifierProvider.notifier).executeRequest();
        },
        child: guildInfoAsync.when(
          data: (guildInfo) {
            if (guildInfo != null) {
              return Center(
                child: Text('Guild Info: $guildInfo'),
              );
            } else {
              return const Padding(
                padding: EdgeInsets.symmetric(horizontal: 16),
                child: SingleChildScrollView(
                  physics: AlwaysScrollableScrollPhysics(),
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
    );
  }
}
```

### 修正ポイント
1. **`RefreshIndicator` の追加**:
   - `RefreshIndicator` を追加し、`onRefresh` に `executeRequest` を非同期で呼び出すように設定。
   - Pull-to-refresh を使用するためには、`child` にスクロール可能なウィジェットを指定する必要があります。

2. **`AlwaysScrollableScrollPhysics` の追加**:
   - 空のリストや内容が少ない場合でもスクロールが可能にするため、`SingleChildScrollView` に `AlwaysScrollableScrollPhysics` を追加しました。

これで、Pull-to-refresh が機能し、ユーザーが画面をスワイプして最新データを取得できるようになります。

---

## 👤 ユーザー
*2024/12/23 21:40:36*

一回エラーになったらpullto refreshできなかったんだが

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
        // Future.microtask(() {
        //   ref.read(getGuildInfoNotifierProvider.notifier).executeRequest();
        // });
        return null;
      },
      [],
    );

    final guildInfoAsync = ref.watch(getGuildInfoNotifierProvider);

    return Scaffold(
      body: RefreshIndicator(
        onRefresh: () async {
          await ref
              .read(getGuildInfoNotifierProvider.notifier)
              .executeRequest();
        },
        child: guildInfoAsync.when(
          data: (guildInfo) {
            if (guildInfo != null) {
              return Center(
                child: Text('Guild Info: $guildInfo'),
              );
            } else {
              return const Padding(
                padding: EdgeInsets.symmetric(horizontal: 16),
                child: SingleChildScrollView(
                  physics: AlwaysScrollableScrollPhysics(),
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

## 🤖 アシスタント
*2024/12/23 21:40:56*

`Pull-to-refresh` 機能がエラー時に機能しない問題を解決するためには、`RefreshIndicator` の `child` にスクロール可能なウィジェットを正しく配置する必要があります。また、エラー時の状態でもスクロールが有効になるように、`SingleChildScrollView` を適切に設定することが重要です。

以下は修正版のコードです：

### 修正版コード

```dart
class GuildPage extends HookConsumerWidget {
  const GuildPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final guildInfoAsync = ref.watch(getGuildInfoNotifierProvider);

    return Scaffold(
      body: RefreshIndicator(
        onRefresh: () async {
          // Pull-to-refreshでデータを再取得
          await ref
              .read(getGuildInfoNotifierProvider.notifier)
              .executeRequest();
        },
        child: guildInfoAsync.when(
          data: (guildInfo) {
            if (guildInfo != null) {
              return ListView(
                physics: const AlwaysScrollableScrollPhysics(),
                children: [
                  Center(
                    child: Text('Guild Info: $guildInfo'),
                  ),
                ],
              );
            } else {
              return SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                child: const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 16),
                  child: _NoGuildWidget(),
                ),
              );
            }
          },
          loading: () => ListView(
            physics: const AlwaysScrollableScrollPhysics(),
            children: const [
              Center(child: CircularProgressIndicator()),
            ],
          ),
          error: (error, stackTrace) {
            WidgetsBinding.instance.addPostFrameCallback((_) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Error: $error')),
              );
            });
            return SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              child: Center(
                child: Text('An error occurred: $error'),
              ),
            );
          },
        ),
      ),
    );
  }
}
```

### 主な修正ポイント
1. **`ListView` と `SingleChildScrollView` の適切な使用**:
   - エラー時やデータがない場合でもスクロールを可能にするため、`AlwaysScrollableScrollPhysics` を使用。
   - データがある場合は `ListView` を使用し、スクロールの一貫性を保つ。

2. **エラー状態でのスクロールの対応**:
   - `error` 状態でも `SingleChildScrollView` をラップして、ユーザーがリフレッシュ操作を実行できるようにしました。

3. **`AlwaysScrollableScrollPhysics` の明示的な指定**:
   - スクロール可能領域が少ない場合やエラー時にもスクロールが機能するように物理特性を設定。

これにより、エラー時でも `Pull-to-refresh` 機能が有効になり、ユーザーがデータの再取得を試みることができるようになります。

---

## 👤 ユーザー
*2024/12/23 21:41:39*

うまく引っ張れなかった。

---

## 🤖 アシスタント
*2024/12/23 21:42:03*

引っ張る操作が機能しない場合、以下のポイントを確認してコードを修正します。

1. **`RefreshIndicator` の `child` に正しいスクロール可能ウィジェットが設定されていることを確認**:
   `RefreshIndicator` の子ウィジェットはスクロール可能である必要があります。`ListView` や `SingleChildScrollView` を使用する際に注意が必要です。

2. **スクロール可能領域が小さい場合でもスクロールを有効にする設定**:
   `AlwaysScrollableScrollPhysics` を指定することで、コンテンツが画面に収まる場合でもスクロールが可能になります。

3. **`Scaffold` 内で他のウィジェットが `RefreshIndicator` の機能を妨げていないか確認**:
   他のウィジェットがタッチ操作を妨げていないか確認します。

修正版コードは以下のようになります：

### 修正版コード

```dart
class GuildPage extends HookConsumerWidget {
  const GuildPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final guildInfoAsync = ref.watch(getGuildInfoNotifierProvider);

    return Scaffold(
      body: RefreshIndicator(
        onRefresh: () async {
          // Pull-to-refresh でデータを再取得
          await ref
              .read(getGuildInfoNotifierProvider.notifier)
              .executeRequest();
        },
        child: CustomScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          slivers: [
            SliverFillRemaining(
              hasScrollBody: false,
              child: guildInfoAsync.when(
                data: (guildInfo) {
                  if (guildInfo != null) {
                    return Center(
                      child: Text('Guild Info: $guildInfo'),
                    );
                  } else {
                    return const Padding(
                      padding: EdgeInsets.symmetric(horizontal: 16),
                      child: _NoGuildWidget(),
                    );
                  }
                },
                loading: () => const Center(
                  child: CircularProgressIndicator(),
                ),
                error: (error, stackTrace) {
                  WidgetsBinding.instance.addPostFrameCallback((_) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Error: $error')),
                    );
                  });
                  return Center(
                    child: Text('An error occurred: $error'),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
```

### 修正ポイント
1. **`CustomScrollView` の使用**:
   `CustomScrollView` を使用し、`physics: AlwaysScrollableScrollPhysics()` を指定して、内容が少なくても引っ張れるようにします。

2. **`SliverFillRemaining` の設定**:
   コンテンツが画面全体を埋めない場合でもスクロールが可能になるように `SliverFillRemaining` を使用します。`hasScrollBody: false` を設定することで、内容が少ないときでもスクロール可能になります。

3. **`RefreshIndicator` の `child` を適切に指定**:
   `CustomScrollView` を `RefreshIndicator` の子ウィジェットとして使用することで、引っ張り操作が有効になります。

4. **エラー時の対応**:
   エラー時も `CustomScrollView` 内で表示を管理し、引っ張り動作を妨げないようにしました。

### 動作確認
- データがない場合でもスワイプで更新が可能です。
- エラー時にもスワイプ動作が有効です。
- コンテンツが少ない場合でも画面を引っ張る動作ができることを確認してください。

---
