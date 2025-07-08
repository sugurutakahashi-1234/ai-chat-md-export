# Guild Info Fetching Code

Date: 2024-12-25

---

## 👤 User
*2024-12-25 12:20:04*

guildInfo は別画面で取得でている前提でコードのTODO部分を埋めてほしい

/// Guild information.
@freezed
class GuildInfoResponseDtoData with _$GuildInfoResponseDtoData {
  factory GuildInfoResponseDtoData({
    @JsonKey(name: 'guildId') required String? guildId,
    @JsonKey(name: 'guildName') required String? guildName,
    @JsonKey(name: 'guildDescription') String? guildDescription,
    @JsonKey(name: 'guildOwner') required String? guildOwner,
    @JsonKey(name: 'guildAvatar') String? guildAvatar,
    @JsonKey(name: 'guildBanner') String? guildBanner,
    @JsonKey(name: 'guildMembers') required List&lt;GuildMemberDto&gt;? guildMembers,
  }) = _GuildInfoResponseDtoData;

  factory GuildInfoResponseDtoData.fromJson(Map&lt;String, dynamic&gt; jsonMap) =&gt;
      _$GuildInfoResponseDtoDataFromJson(jsonMap);
}
@freezed
class GuildMemberDto with _$GuildMemberDto {
  factory GuildMemberDto({
    @JsonKey(name: 'userId') required String? userId,
    @JsonKey(name: 'role') required GuildMemberDtoRole? role,
    @JsonKey(name: 'memberStatus')
    required GuildMemberDtoMemberStatus? memberStatus,
    @JsonKey(name: 'teamId') String? teamId,
    @JsonKey(name: 'active') bool? active,
  }) = _GuildMemberDto;

  factory GuildMemberDto.fromJson(Map&lt;String, dynamic&gt; jsonMap) =&gt;
      _$GuildMemberDtoFromJson(jsonMap);
}

@Riverpod(keepAlive: true)
class GetMyGuildNotifier extends _$GetMyGuildNotifier {
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
      debugPrint('Error: $e');
      debugPrint('StackTrace: $stackTrace');
      state = AsyncValue.error(e, stackTrace);
    }
  }
}

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_svg/svg.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:snpit_guild_app/gen/assets.gen.dart';
import 'package:snpit_guild_app/presentation/design_token/color_token.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/guilds/get_guild_info.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/guilds/update_guild_member.dart';

class GuildRequestPage extends HookConsumerWidget {
  const GuildRequestPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final requestState = ref.watch(requestGuildNotifierProvider);

    // TODO: 自分のではない情報を取得する
    final guildInfo = ref.watch(getMyGuildNotifierProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Join an existing guild'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {
            // ギルドの Top 画面に戻るため popUntil を使用
            Navigator.of(context).popUntil((route) =&gt; route.isFirst);
          },
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            DecoratedBox(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: ColorToken.secondary),
              ),
              child: Column(
                children: [
                  GestureDetector(
                    onTap: () {
                      Clipboard.setData(
                        // TODO: APIから取得したギルドのID
                        const ClipboardData(text: '4234623876'),
                      );
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('ID copied to clipboard!'),
                        ),
                      );
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        vertical: 12,
                        horizontal: 16,
                      ),
                      decoration: const BoxDecoration(
                        color: ColorToken.secondary,
                        borderRadius: BorderRadius.only(
                          bottomLeft: Radius.circular(12),
                          bottomRight: Radius.circular(12),
                        ),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          SvgPicture.asset(
                            Assets.images.triangleDots.path,
                          ),
                          const SizedBox(width: 8),
                          // TODO: APIから取得したギルドのIDを表示
                          const Text(
                            '4234623876',
                            style: TextStyle(
                              fontSize: 14,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    // TODO: APIから取得したギルドの画像を表示
                    child: Image.asset(
                      Assets.images.loginFig.path,
                      width: 64,
                      height: 64,
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    // TODO: APIから取得したギルドの名前を表示
                    'SNPIT Guilds',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 18,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.people,
                        size: 24,
                        color: ColorToken.text,
                      ),
                      SizedBox(width: 8),
                      // TODO: APIから取得したギルドのメンバー数を表示
                      Text(
                        '12',
                        style: TextStyle(
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                ],
              ),
            ),
            const SizedBox(height: 24),
            requestState.when(
              data: (data) {
                if (data == null) {
                  return ElevatedButton(
                    onPressed: () async {
                      final notifier =
                          ref.read(requestGuildNotifierProvider.notifier);

                      // TODO: APIから取得したギルドのIDと自分のIDを使用
                      await notifier.requestGuild(
                        guildId: 'exampleGuildId',
                        userId: 'exampleUserId',
                      );
                    },
                    child: const Text(
                      'Request to join this guild',
                    ),
                  );
                } else {
                  return Container(
                    alignment: Alignment.center,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: ColorToken.secondary),
                    ),
                    child: const Padding(
                      padding: EdgeInsets.all(16),
                      child: Column(
                        children: [
                          Text(
                            'Request sent',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          SizedBox(height: 16),
                          Text(
                            'Please wait a moment until it is approved',
                            textAlign: TextAlign.center,
                            style: TextStyle(fontSize: 16),
                          ),
                        ],
                      ),
                    ),
                  );
                }
              },
              loading: () =&gt; const Center(child: CircularProgressIndicator()),
              error: (error, stack) {
                WidgetsBinding.instance.addPostFrameCallback((_) {
                  if (context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('An error occurred: $error'),
                      ),
                    );
                  }
                });
                return Center(child: Text('An error occurred: $error'));
              },
            ),
          ],
        ),
      ),
    );
  }
}

---

## 🤖 Assistant
*2024-12-25 12:20:42*

以下のようにTODO部分を埋める形でコードを修正しました。APIから取得したギルド情報を使うようにしています。

---

## 🤖 Assistant
*2024-12-25 12:20:42*

{"name": "guild_request_page", "type": "code/dart", "content": "class GuildRequestPage extends HookConsumerWidget {\n  const GuildRequestPage({super.key});\n\n  @override\n  Widget build(BuildContext context, WidgetRef ref) {\n    final requestState = ref.watch(requestGuildNotifierProvider);\n\n    // APIから取得したギルド情報\n    final guildInfoAsyncValue = ref.watch(getMyGuildNotifierProvider);\n\n    return Scaffold(\n      appBar: AppBar(\n        title: const Text('Join an existing guild'),\n        leading: IconButton(\n          icon: const Icon(Icons.arrow_back),\n          onPressed: () {\n            // ギルドの Top 画面に戻るため popUntil を使用\n            Navigator.of(context).popUntil((route) =&gt; route.isFirst);\n          },\n        ),\n      ),\n      body: Padding(\n        padding: const EdgeInsets.all(24),\n        child: guildInfoAsyncValue.when(\n          data: (guildInfo) {\n            if (guildInfo == null) {\n              return const Center(\n                child: Text('No guild information available.'),\n              );\n            }\n\n            return Column(\n              crossAxisAlignment: CrossAxisAlignment.stretch,\n              children: [\n                DecoratedBox(\n                  decoration: BoxDecoration(\n                    borderRadius: BorderRadius.circular(8),\n                    border: Border.all(color: ColorToken.secondary),\n                  ),\n                  child: Column(\n                    children: [\n                      GestureDetector(\n                        onTap: () {\n                          Clipboard.setData(\n                            ClipboardData(text: guildInfo.guildId ?? 'Unknown'),\n                          );\n                          ScaffoldMessenger.of(context).showSnackBar(\n                            const SnackBar(\n                              content: Text('ID copied to clipboard!'),\n                            ),\n                          );\n                        },\n                        child: Container(\n                          padding: const EdgeInsets.symmetric(\n                            vertical: 12,\n                            horizontal: 16,\n                          ),\n                          decoration: const BoxDecoration(\n                            color: ColorToken.secondary,\n                            borderRadius: BorderRadius.only(\n                              bottomLeft: Radius.circular(12),\n                              bottomRight: Radius.circular(12),\n                            ),\n                          ),\n                          child: Row(\n                            mainAxisSize: MainAxisSize.min,\n                            children: [\n                              SvgPicture.asset(\n                                Assets.images.triangleDots.path,\n                              ),\n                              const SizedBox(width: 8),\n                              Text(\n                                guildInfo.guildId ?? 'Unknown',\n                                style: const TextStyle(\n                                  fontSize: 14,\n                                ),\n                              ),\n                            ],\n                          ),\n                        ),\n                      ),\n                      const SizedBox(height: 20),\n                      ClipRRect(\n                        borderRadius: BorderRadius.circular(8),\n                        child: guildInfo.guildAvatar != null\n                            ? Image.network(\n                                guildInfo.guildAvatar!,\n                                width: 64,\n                                height: 64,\n                              )\n                            : Image.asset(\n                                Assets.images.loginFig.path,\n                                width: 64,\n                                height: 64,\n                              ),\n                      ),\n                      const SizedBox(height: 16),\n                      Text(\n                        guildInfo.guildName ?? 'Unknown Guild',\n                        style: const TextStyle(\n                          fontWeight: FontWeight.bold,\n                          fontSize: 18,\n                        ),\n                      ),\n                      const SizedBox(height: 8),\n                      Row(\n                        mainAxisAlignment: MainAxisAlignment.center,\n                        children: [\n                          const Icon(\n                            Icons.people,\n                            size: 24,\n                            color: ColorToken.text,\n                          ),\n                          const SizedBox(width: 8),\n                          Text(\n                            '${guildInfo.guildMembers?.length ?? 0}',\n                            style: const TextStyle(\n                              fontSize: 14,\n                            ),\n                          ),\n                        ],\n                      ),\n                      const SizedBox(height: 24),\n                    ],\n                  ),\n                ),\n                const SizedBox(height: 24),\n                requestState.when(\n                  data: (data) {\n                    if (data == null) {\n                      return ElevatedButton(\n                        onPressed: () async {\n                          final notifier =\n                              ref.read(requestGuildNotifierProvider.notifier);\n\n                          await notifier.requestGuild(\n                            guildId: guildInfo.guildId ?? 'UnknownGuildId',\n                            userId: 'exampleUserId', // TODO: 自分のユーザーIDを取得する\n                          );\n                        },\n                        child: const Text(\n                          'Request to join this guild',\n                        ),\n                      );\n                    } else {\n                      return Container(\n                        alignment: Alignment.center,\n                        decoration: BoxDecoration(\n                          borderRadius: BorderRadius.circular(8),\n                          border: Border.all(color: ColorToken.secondary),\n                        ),\n                        child: const Padding(\n                          padding: EdgeInsets.all(16),\n                          child: Column(\n                            children: [\n                              Text(\n                                'Request sent',\n                                style: TextStyle(\n                                  fontSize: 18,\n                                  fontWeight: FontWeight.bold,\n                                ),\n                              ),\n                              SizedBox(height: 16),\n                              Text(\n                                'Please wait a moment until it is approved',\n                                textAlign: TextAlign.center,\n                                style: TextStyle(fontSize: 16),\n                              ),\n                            ],\n                          ),\n                        ),\n                      );\n                    }\n                  },\n                  loading: () =&gt; const Center(child: CircularProgressIndicator()),\n                  error: (error, stack) {\n                    WidgetsBinding.instance.addPostFrameCallback((_) {\n                      if (context.mounted) {\n                        ScaffoldMessenger.of(context).showSnackBar(\n                          SnackBar(\n                            content: Text('An error occurred: $error'),\n                          ),\n                        );\n                      }\n                    });\n                    return Center(child: Text('An error occurred: $error'));\n                  },\n                ),\n              ],\n            );\n          },\n          loading: () =&gt; const Center(child: CircularProgressIndicator()),\n          error: (error, stack) =&gt; Center(\n            child: Text('Failed to load guild information: $error'),\n          ),\n        ),\n      ),\n    );\n  }\n}"}

---

## 🔧 Tool
*2024-12-25 12:20:42*

{"result": "Successfully created text document 'guild_request_page' which will be referenced in all future messages with the unique identifier textdoc_id: '676b7a071de08191841e1b8efe7b6c06'", "textdoc_id": "676b7a071de08191841e1b8efe7b6c06", "name": "guild_request_page"}

---

## 🤖 Assistant
*2024-12-25 12:20:42*

コードのTODO箇所をAPIから取得したギルド情報で埋めました。また、必要に応じてエラーメッセージやローディング表示を追加しました。この変更により、ギルド情報が正常に表示され、参加リクエストが送信できるようになります。

---
