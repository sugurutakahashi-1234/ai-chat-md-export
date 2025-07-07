# Localhost API Request

日付: 2024-12-18

---

## 👤 ユーザー
*2024/12/18 15:04:30*

localhost:3002/v1/guildsにリクエストするようにしてほしい

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:go\_router/go\_router.dart';
import 'package:hooks\_riverpod/hooks\_riverpod.dart';
import 'package:snpit\_guild\_app/domain/screen.dart';
import 'package:snpit\_guild\_app/lib/infrastructure/snapit\_guild\_api/snapit\_guild\_api.openapi.dart';

// API Client Provider
final guildApiProvider = Provider&lt;GuildApi&gt;((ref) {
  return GuildApi(
    Dio(),
    Uri.parse('https://virtserver.swaggerhub.com/hpoul/Testapi/1.0.0'),
  );
});

// Guild Info Future Provider
final guildInfoProvider = FutureProvider((ref) async {
  final client = ref.read(guildApiProvider);
  final guildInfo = await client.guildControllerGetGuildInfo();
  return guildInfo.data;
});

class GuildPage extends HookConsumerWidget {
  const GuildPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final guildInfoAsync = ref.watch(guildInfoProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Guild Page')),
      body: guildInfoAsync.when(
        data: (guildInfo) =&gt; Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: \[
              Text('Guild Info: $guildInfo'),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () {
                  context.push(Screen.guildCode.path);
                },
                child: const Text('Go To Guild Code'),
              ),
              ElevatedButton(
                onPressed: () {
                  context.push(Screen.guildCreate.path);
                },
                child: const Text('Go To Guild Create'),
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
*2024/12/18 15:04:46*

以下の変更を加えることで、`localhost:3002/v1/guilds`にリクエストを送信できるようにします。

1. `guildApiProvider`で`GuildApi`を初期化するときに、`baseUrl`を`localhost:3002/v1`に変更します。
2. `Dio`を初期化する際に、ローカルホスト環境でCORSの問題を回避するための適切なオプションを設定する場合があります。

以下のようにコードを修正してください。

```dart
// API Client Provider
final guildApiProvider = Provider<GuildApi>((ref) {
  final dio = Dio();
  dio.options.baseUrl = 'http://localhost:3002/v1'; // ローカルホストのURL
  return GuildApi(dio);
});

// Guild Info Future Provider
final guildInfoProvider = FutureProvider((ref) async {
  final client = ref.read(guildApiProvider);
  final guildInfo = await client.guildControllerGetGuildInfo();
  return guildInfo.data;
});

class GuildPage extends HookConsumerWidget {
  const GuildPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final guildInfoAsync = ref.watch(guildInfoProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Guild Page')),
      body: guildInfoAsync.when(
        data: (guildInfo) => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text('Guild Info: $guildInfo'),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () {
                  context.push(Screen.guildCode.path);
                },
                child: const Text('Go To Guild Code'),
              ),
              ElevatedButton(
                onPressed: () {
                  context.push(Screen.guildCreate.path);
                },
                child: const Text('Go To Guild Create'),
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

### 修正ポイント
1. **`dio.options.baseUrl`**:
   - `Dio`の`baseUrl`オプションを`http://localhost:3002/v1`に設定しました。
   - これにより、すべてのリクエストはこのベースURLを使用します。

2. **HTTPS→HTTP**:
   - ローカルホストのため、`http`プロトコルを使用しています。

3. **CORS問題の対処**:
   - 必要に応じて、サーバー側でCORSを許可してください（例: `Access-Control-Allow-Origin`ヘッダーの設定）。

この変更により、`localhost:3002/v1/guilds`をベースにAPIリクエストを送信できるようになります。

---
