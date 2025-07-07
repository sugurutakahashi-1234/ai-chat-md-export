# GuildPageリファクタリング

日付: 2024-12-18

---

## 👤 ユーザー
*2024/12/18 16:12:38*

GuildPageをgetGuildInfoNotifierProviderを使うようにして書き換えて欲しい

import 'package:flutter/foundation.dart';
import 'package:riverpod\_annotation/riverpod\_annotation.dart';

import 'package:snpit\_guild\_app/lib/infrastructure/snapit\_guild\_api/snapit\_guild\_api.openapi.dart';
import 'package:snpit\_guild\_app/presentation/providers/api\_client/guild\_api\_provider.dart';

part 'get\_guild\_info.g.dart';

@riverpod
class GetGuildInfoNotifier extends \_$GetGuildInfoNotifier {
  @override
  Future&lt;GuildInfoResponseDtoData?&gt; build() async =&gt; null;

  Future&lt;void&gt; executeRequest() async {
    state = const AsyncValue.loading();
    try {
      final api = ref.read(guildApiProvider);
      final response = await api.guildControllerGetGuildInfo();
      debugPrint('Guild Info: $response');
      state = AsyncValue.data(response.data?.data);
    } on Exception catch (e, stackTrace) {
      debugPrint('Error in GetGuildInfoNotifier: $e');
      debugPrint('StackTrace: $stackTrace');
      state = AsyncValue.error(e, stackTrace);
    }
  }
}

import 'package:flutter/material.dart';
import 'package:go\_router/go\_router.dart';
import 'package:hooks\_riverpod/hooks\_riverpod.dart';
import 'package:snpit\_guild\_app/domain/screen.dart';
import 'package:snpit\_guild\_app/presentation/providers/api\_client/guild\_api\_provider.dart';

// Guild Info Future Provider
final guildInfoProvider = FutureProvider((ref) async {
  final client = ref.read(guildApiProvider);
  try {
    final guildInfo = await client.guildControllerGetGuildInfo();
    debugPrint('Guild Info: $guildInfo');
    return guildInfo.data;
  } catch (error, stackTrace) {
    debugPrint('Error fetching Guild Info: $error');
    debugPrint('StackTrace: $stackTrace');
    rethrow; // 再度エラーをスローしてViewで表示する
  }
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
*2024/12/18 16:13:00*

以下は `GuildPage` を `GetGuildInfoNotifierProvider` を使用して書き換えたコードです。

---

## 🤖 アシスタント
*2024/12/18 16:13:00*

{"name": "guild\_page\_refactor", "type": "code/dart", "content": "import 'package:flutter/material.dart';\\nimport 'package:go\_router/go\_router.dart';\\nimport 'package:hooks\_riverpod/hooks\_riverpod.dart';\\nimport 'package:snpit\_guild\_app/domain/screen.dart';\\nimport 'package:snpit\_guild\_app/presentation/providers/get\_guild\_info\_notifier\_provider.dart';\\n\\nclass GuildPage extends HookConsumerWidget {\\n  const GuildPage({super.key});\\n\\n  @override\\n  Widget build(BuildContext context, WidgetRef ref) {\\n    final guildInfoAsync = ref.watch(getGuildInfoNotifierProvider);\\n\\n    return Scaffold(\\n      appBar: AppBar(title: const Text('Guild Page')),\\n      body: guildInfoAsync.when(\\n        data: (guildInfo) =&gt; Center(\\n          child: Column(\\n            mainAxisAlignment: MainAxisAlignment.center,\\n            children: \[\\n              if (guildInfo != null)\\n                Text('Guild Info: ${guildInfo.name ?? \\"No Name\\"}'),\\n              const SizedBox(height: 16),\\n              ElevatedButton(\\n                onPressed: () {\\n                  context.push(Screen.guildCode.path);\\n                },\\n                child: const Text('Go To Guild Code'),\\n              ),\\n              ElevatedButton(\\n                onPressed: () {\\n                  context.push(Screen.guildCreate.path);\\n                },\\n                child: const Text('Go To Guild Create'),\\n              ),\\n            \],\\n          ),\\n        ),\\n        loading: () =&gt; const Center(child: CircularProgressIndicator()),\\n        error: (error, stackTrace) =&gt; Center(\\n          child: Column(\\n            mainAxisAlignment: MainAxisAlignment.center,\\n            children: \[\\n              Text('Error: $error'),\\n              const SizedBox(height: 16),\\n              ElevatedButton(\\n                onPressed: () =&gt; ref.read(getGuildInfoNotifierProvider.notifier).executeRequest(),\\n                child: const Text('Retry'),\\n              ),\\n            \],\\n          ),\\n        ),\\n      ),\\n    );\\n  }\\n}"}

---

## 🔧 ツール
*2024/12/18 16:13:00*

{"result": "Successfully created text document 'guild\_page\_refactor' which will be referenced in all future messages with the unique identifier textdoc\_id: '676275f4d0b481918822abdfdc824702'", "textdoc\_id": "676275f4d0b481918822abdfdc824702", "name": "guild\_page\_refactor"}

---

## 🤖 アシスタント
*2024/12/18 16:13:00*

### 主な変更点
1. \*\*`GetGuildInfoNotifier` の利用\*\*:
   - `guildInfoProvider` を削除し、`getGuildInfoNotifierProvider` を使用。
   - データのフェッチ、エラー処理を `GetGuildInfoNotifier` に任せる。

2. \*\*エラー時のリトライ\*\*:
   - エラー時に「Retry」ボタンを追加し、`executeRequest` を再実行可能に。

3. \*\*`guildInfo` 表示\*\*:
   - `guildInfo` の名前 (`name`) を表示するようにし、null チェックを追加。

これで `GetGuildInfoNotifier` を活用し、データフェッチの責務がより明確に分離されました。質問があれば教えてください！

---
