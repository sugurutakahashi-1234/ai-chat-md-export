# GuildPage Riverpod Hook Integration

日付: 2024-12-18

---

## 👤 ユーザー
*2024/12/18 15:02:17*

hooksとリバーポッドを使って欲しい

import 'package:dio/dio.dart';

import 'package:flutter/material.dart';
import 'package:go\_router/go\_router.dart';
import 'package:snpit\_guild\_app/domain/screen.dart';
import 'package:snpit\_guild\_app/lib/infrastructure/snapit\_guild\_api/snapit\_guild\_api.openapi.dart';

class GuildPage extends StatelessWidget {
  const GuildPage({super.key});

  @override
  Widget build(BuildContext context) {
  final client = GuildApi(
    Dio(),
    Uri.parse('https://virtserver.swaggerhub.com/hpoul/Testapi/1.0.0'),
  );
  final guildInfo = await client.guildControllerGetGuildInfo();
  debugPrint(guildInfo.data.toString());

  return Scaffold(
      appBar: AppBar(title: const Text('Guild Page')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: \[
            ElevatedButton(
              onPressed: () {
                context.push(Screen.guildCode.path);
              },
              child: const Text('Go To GuildCode'),
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
    );
  }
}

---

## 🤖 アシスタント
*2024/12/18 15:02:41*

`hooks` と `Riverpod` を利用したリファクタリングを行います。以下のコードは `flutter\_hooks` を使って `HookConsumerWidget` をベースにし、API コールを非同期で行うように変更します。また、状態管理には `Riverpod` を使用します。

`GuildApi` の呼び出しを `Provider` に移動し、必要に応じて UI を更新できるようにします。

---

## 🤖 アシスタント
*2024/12/18 15:02:41*

{"name": "guild\_page\_hooks\_riverpod", "type": "code/dart", "content": "import 'package:dio/dio.dart';\\nimport 'package:flutter/material.dart';\\nimport 'package:flutter\_hooks/flutter\_hooks.dart';\\nimport 'package:go\_router/go\_router.dart';\\nimport 'package:hooks\_riverpod/hooks\_riverpod.dart';\\nimport 'package:snpit\_guild\_app/domain/screen.dart';\\nimport 'package:snpit\_guild\_app/lib/infrastructure/snapit\_guild\_api/snapit\_guild\_api.openapi.dart';\\n\\n// API Client Provider\\nfinal guildApiProvider = Provider&lt;GuildApi&gt;((ref) {\\n  return GuildApi(\\n    Dio(),\\n    Uri.parse('https://virtserver.swaggerhub.com/hpoul/Testapi/1.0.0'),\\n  );\\n});\\n\\n// Guild Info Future Provider\\nfinal guildInfoProvider = FutureProvider((ref) async {\\n  final client = ref.read(guildApiProvider);\\n  final guildInfo = await client.guildControllerGetGuildInfo();\\n  return guildInfo.data;\\n});\\n\\nclass GuildPage extends HookConsumerWidget {\\n  const GuildPage({Key? key}) : super(key: key);\\n\\n  @override\\n  Widget build(BuildContext context, WidgetRef ref) {\\n    final guildInfoAsync = ref.watch(guildInfoProvider);\\n\\n    return Scaffold(\\n      appBar: AppBar(title: const Text('Guild Page')),\\n      body: guildInfoAsync.when(\\n        data: (guildInfo) =&gt; Center(\\n          child: Column(\\n            mainAxisAlignment: MainAxisAlignment.center,\\n            children: \[\\n              Text('Guild Info: $guildInfo'),\\n              const SizedBox(height: 16),\\n              ElevatedButton(\\n                onPressed: () {\\n                  context.push(Screen.guildCode.path);\\n                },\\n                child: const Text('Go To Guild Code'),\\n              ),\\n              ElevatedButton(\\n                onPressed: () {\\n                  context.push(Screen.guildCreate.path);\\n                },\\n                child: const Text('Go To Guild Create'),\\n              ),\\n            \],\\n          ),\\n        ),\\n        loading: () =&gt; const Center(child: CircularProgressIndicator()),\\n        error: (error, stackTrace) =&gt; Center(\\n          child: Text('Error: $error'),\\n        ),\\n      ),\\n    );\\n  }\\n}"}

---

## 🔧 ツール
*2024/12/18 15:02:41*

{"result": "Successfully created text document 'guild\_page\_hooks\_riverpod' which will be referenced in all future messages with the unique identifier textdoc\_id: '67626578f4448191a0b5c32855bcc75b'", "textdoc\_id": "67626578f4448191a0b5c32855bcc75b", "name": "guild\_page\_hooks\_riverpod"}

---

## 🤖 アシスタント
*2024/12/18 15:02:41*

このコードでは以下の変更を行いました：

1. \*\*`Provider` の利用\*\*:
   - `guildApiProvider` を作成し、`GuildApi` を管理。
   - 非同期データ (`guildInfo`) を管理するための `FutureProvider` を追加。

2. \*\*非同期データの取り扱い\*\*:
   - `guildInfoProvider` を使用して非同期で `guildControllerGetGuildInfo` を呼び出し、`guildInfo` を取得。
   - UI にデータが読み込まれるまでローディングインジケーターを表示し、エラー時にはエラーメッセージを表示。

3. \*\*`HookConsumerWidget` の利用\*\*:
   - `HookConsumerWidget` を使って `Riverpod` のプロバイダーを利用しながら UI を構築。

この設計により、状態管理が簡素化され、API 呼び出しのテストや管理が容易になります。質問や追加の改善点があれば教えてください！

---
