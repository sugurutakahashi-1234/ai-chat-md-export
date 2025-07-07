# UpdateGuildMemberRequestDto変更

日付: 2024-12-23

---

## 👤 ユーザー
*2024/12/23 16:48:24*

UpdateGuildMemberRequestDtoMemberStatus を渡せるように変えて欲しい


@riverpod
class UpdateGuildMemberNotifier extends \_$UpdateGuildMemberNotifier {
  @override
  Future&lt;String?&gt; build() async =&gt; null;

  Future&lt;void&gt; executeRequest({
    required String guildId,
    required String userId,
  }) async {
    state = const AsyncValue.loading();
    try {
      final api = await ref.watch(guildApiProvider.future);
      final response = await api.guildControllerUpdateGuildMember(
        UpdateGuildMemberRequestDto(
          updateStatus: true,
          memberStatus: UpdateGuildMemberRequestDtoMemberStatus.REQUESTED,
        ),
        guildId: guildId,
        userId: userId,
      );
      debugPrint('Response Body: ${response.data}');
      debugPrint('Response Body.data: ${response.data?.data}');
      state = AsyncValue.data(response.data?.data);
    } on Exception catch (e, stackTrace) {
      debugPrint('Error in UpdateGuildMemberNotifier: $e');
      debugPrint('StackTrace: $stackTrace');
      state = AsyncValue.error(e, stackTrace);
    }
  }
}

---

## 🤖 アシスタント
*2024/12/23 16:48:37*

`UpdateGuildMemberRequestDtoMemberStatus` を外部から渡せるようにするために、`executeRequest` メソッドの引数として追加します。以下は更新後のコードです。

---

## 🤖 アシスタント
*2024/12/23 16:48:37*

{"name": "update\_guild\_member", "type": "code/dart", "content": "@riverpod\\nclass UpdateGuildMemberNotifier extends \_$UpdateGuildMemberNotifier {\\n  @override\\n  Future&lt;String?&gt; build() async =&gt; null;\\n\\n  Future&lt;void&gt; executeRequest({\\n    required String guildId,\\n    required String userId,\\n    required UpdateGuildMemberRequestDtoMemberStatus memberStatus,\\n  }) async {\\n    state = const AsyncValue.loading();\\n    try {\\n      final api = await ref.watch(guildApiProvider.future);\\n      final response = await api.guildControllerUpdateGuildMember(\\n        UpdateGuildMemberRequestDto(\\n          updateStatus: true,\\n          memberStatus: memberStatus,\\n        ),\\n        guildId: guildId,\\n        userId: userId,\\n      );\\n      debugPrint('Response Body: ${response.data}');\\n      debugPrint('Response Body.data: ${response.data?.data}');\\n      state = AsyncValue.data(response.data?.data);\\n    } on Exception catch (e, stackTrace) {\\n      debugPrint('Error in UpdateGuildMemberNotifier: $e');\\n      debugPrint('StackTrace: $stackTrace');\\n      state = AsyncValue.error(e, stackTrace);\\n    }\\n  }\\n}"}

---

## 🔧 ツール
*2024/12/23 16:48:37*

{"result": "Successfully created text document 'update\_guild\_member' which will be referenced in all future messages with the unique identifier textdoc\_id: '676915d21f0c8191a670f1db77dff876'", "textdoc\_id": "676915d21f0c8191a670f1db77dff876", "name": "update\_guild\_member"}

---

## 🤖 アシスタント
*2024/12/23 16:48:37*

変更内容:
1. `executeRequest` メソッドの引数に `required UpdateGuildMemberRequestDtoMemberStatus memberStatus` を追加。
2. `UpdateGuildMemberRequestDto` の `memberStatus` プロパティに外部から渡された `memberStatus` を使用。

これにより、`memberStatus` を実行時に柔軟に指定できるようになりました。

---
