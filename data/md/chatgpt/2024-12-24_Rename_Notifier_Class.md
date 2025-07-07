# Rename Notifier Class

日付: 2024-12-24

---

## 👤 ユーザー
*2024/12/24 15:19:56*

GetMyGuildNotifier にrenameしてほしい

import 'package:flutter/foundation.dart';
import 'package:riverpod\_annotation/riverpod\_annotation.dart';

import 'package:snpit\_guild\_app/infrastructure/snapit\_guild\_api/snapit\_guild\_api.openapi.dart';
import 'package:snpit\_guild\_app/presentation/providers/api\_client/guild\_api\_provider.dart';

part 'get\_guild\_info.g.dart';

@riverpod
class GetGuildInfoNotifier extends \_$GetGuildInfoNotifier {
  @override
  Future&lt;GuildInfoResponseDtoData?&gt; build() async =&gt; null;

  Future&lt;void&gt; executeRequest() async {
    state = const AsyncValue.loading();
    try {
      final api = await ref.watch(guildApiProvider.future);
      final response = await api.guildControllerGetGuildInfo();
      debugPrint('Response Body: ${response.data}');
      debugPrint('Response Body.data: ${response.data?.data}');
      state = AsyncValue.data(response.data?.data);
    } on Exception catch (e, stackTrace) {
      debugPrint('Error in GetGuildInfoNotifier: $e');
      debugPrint('StackTrace: $stackTrace');
      state = AsyncValue.error(e, stackTrace);
    }
  }
}

---

## 🤖 アシスタント
*2024/12/24 15:20:05*

{"name": "get\_my\_guild\_notifier", "type": "code/dart", "content": "import 'package:flutter/foundation.dart';\\nimport 'package:riverpod\_annotation/riverpod\_annotation.dart';\\n\\nimport 'package:snpit\_guild\_app/infrastructure/snapit\_guild\_api/snapit\_guild\_api.openapi.dart';\\nimport 'package:snpit\_guild\_app/presentation/providers/api\_client/guild\_api\_provider.dart';\\n\\npart 'get\_my\_guild\_notifier.g.dart';\\n\\n@riverpod\\nclass GetMyGuildNotifier extends \_$GetMyGuildNotifier {\\n  @override\\n  Future&lt;GuildInfoResponseDtoData?&gt; build() async =&gt; null;\\n\\n  Future&lt;void&gt; executeRequest() async {\\n    state = const AsyncValue.loading();\\n    try {\\n      final api = await ref.watch(guildApiProvider.future);\\n      final response = await api.guildControllerGetGuildInfo();\\n      debugPrint('Response Body: ${response.data}');\\n      debugPrint('Response Body.data: ${response.data?.data}');\\n      state = AsyncValue.data(response.data?.data);\\n    } on Exception catch (e, stackTrace) {\\n      debugPrint('Error in GetMyGuildNotifier: $e');\\n      debugPrint('StackTrace: $stackTrace');\\n      state = AsyncValue.error(e, stackTrace);\\n    }\\n  }\\n}"}

---

## 🔧 ツール
*2024/12/24 15:20:05*

{"result": "Successfully created text document 'get\_my\_guild\_notifier' which will be referenced in all future messages with the unique identifier textdoc\_id: '676a5294205081919af271e658f3e1cd'", "textdoc\_id": "676a5294205081919af271e658f3e1cd", "name": "get\_my\_guild\_notifier"}

---

## 🤖 アシスタント
*2024/12/24 15:20:05*

I have renamed the class to `GetMyGuildNotifier` and updated the file name to `get\_my\_guild\_notifier.g.dart`. Let me know if further adjustments are needed!

---
