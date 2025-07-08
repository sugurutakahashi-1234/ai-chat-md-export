# GuildRequestPage 修正

日付: 2024-12-25

---

## 👤 ユーザー
*2024/12/25 12:43:23*

class化を間違えた
DecoratedBoxだけをclass化したかった。

Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [はGuildRequestPageに残しておいて欲しい

つまり、

Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
class化,
const SizedBox(height: 24),
requestState.when(),,
]
)

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_svg/svg.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:snpit_guild_app/gen/assets.gen.dart';
import 'package:snpit_guild_app/infrastructure/snapit_guild_api/snapit_guild_api.openapi.dart';
import 'package:snpit_guild_app/presentation/design_token/color_token.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/guilds/get_guild_info.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/guilds/update_guild_member.dart';

class GuildRequestPage extends HookConsumerWidget {
  const GuildRequestPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final requestState = ref.watch(requestGuildNotifierProvider);

    // APIから取得したギルド情報
    final guildInfoAsyncValue = ref.watch(getMyGuildNotifierProvider);

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
        child: guildInfoAsyncValue.when(
          data: (guildInfo) {
            if (guildInfo != null) {
              return GuildInfoWidget(guildInfo: guildInfo);
            } else {
              return const Center(
                child: Text('No guild information available.'),
              );
            }

            // return Column(
            //   crossAxisAlignment: CrossAxisAlignment.stretch,
            //   children: [
            //     DecoratedBox(
            //       decoration: BoxDecoration(
            //         borderRadius: BorderRadius.circular(8),
            //         border: Border.all(color: ColorToken.secondary),
            //       ),
            //       child: Column(
            //         children: [
            //           GestureDetector(
            //             onTap: () {
            //               Clipboard.setData(
            //                 ClipboardData(text: guildInfo.guildId ?? 'Unknown'),
            //               );
            //               ScaffoldMessenger.of(context).showSnackBar(
            //                 SnackBar(
            //                   content: Text(
            //                     'ID copied to clipboard: '
            //                     '${guildInfo.guildId ?? 'Unknown'}',
            //                   ),
            //                 ),
            //               );
            //             },
            //             child: Container(
            //               padding: const EdgeInsets.symmetric(
            //                 vertical: 12,
            //                 horizontal: 16,
            //               ),
            //               decoration: const BoxDecoration(
            //                 color: ColorToken.secondary,
            //                 borderRadius: BorderRadius.only(
            //                   bottomLeft: Radius.circular(12),
            //                   bottomRight: Radius.circular(12),
            //                 ),
            //               ),
            //               child: Row(
            //                 mainAxisSize: MainAxisSize.min,
            //                 children: [
            //                   SvgPicture.asset(
            //                     Assets.images.triangleDots.path,
            //                   ),
            //                   const SizedBox(width: 8),
            //                   Text(
            //                     guildInfo.guildId ?? 'Unknown',
            //                     style: const TextStyle(
            //                       fontSize: 14,
            //                     ),
            //                   ),
            //                 ],
            //               ),
            //             ),
            //           ),
            //           const SizedBox(height: 20),
            //           ClipRRect(
            //             borderRadius: BorderRadius.circular(8),
            //             child: guildInfo.guildAvatar != null
            //                 ? Image.network(
            //                     guildInfo.guildAvatar!,
            //                     width: 64,
            //                     height: 64,
            //                   )
            //                 : const Icon(
            //                     Icons.image,
            //                     size: 64,
            //                     color: ColorToken.text,
            //                   ),
            //           ),
            //           const SizedBox(height: 16),
            //           Text(
            //             guildInfo.guildName ?? 'Unknown Guild',
            //             style: const TextStyle(
            //               fontWeight: FontWeight.bold,
            //               fontSize: 18,
            //             ),
            //           ),
            //           const SizedBox(height: 8),
            //           Row(
            //             mainAxisAlignment: MainAxisAlignment.center,
            //             children: [
            //               const Icon(
            //                 Icons.people,
            //                 size: 24,
            //                 color: ColorToken.text,
            //               ),
            //               const SizedBox(width: 8),
            //               Text(
            //                 '${guildInfo.guildMembers?.length ?? 0}',
            //                 style: const TextStyle(
            //                   fontSize: 14,
            //                 ),
            //               ),
            //             ],
            //           ),
            //           const SizedBox(height: 24),
            //         ],
            //       ),
            //     ),
            //     const SizedBox(height: 24),
            //     requestState.when(
            //       data: (data) {
            //         if (data == null) {
            //           return ElevatedButton(
            //             onPressed: () async {
            //               final notifier =
            //                   ref.read(requestGuildNotifierProvider.notifier);

            //               // TODO: 自分のユーザーIDを取得する
            //               await notifier.requestGuild(
            //                 guildId: guildInfo.guildId ?? 'UnknownGuildId',
            //                 userId: 'exampleUserId',
            //               );
            //             },
            //             child: const Text(
            //               'Request to join this guild',
            //             ),
            //           );
            //         } else {
            //           return Container(
            //             alignment: Alignment.center,
            //             decoration: BoxDecoration(
            //               borderRadius: BorderRadius.circular(8),
            //               border: Border.all(color: ColorToken.secondary),
            //             ),
            //             child: const Padding(
            //               padding: EdgeInsets.all(16),
            //               child: Column(
            //                 children: [
            //                   Text(
            //                     'Request sent',
            //                     style: TextStyle(
            //                       fontSize: 18,
            //                       fontWeight: FontWeight.bold,
            //                     ),
            //                   ),
            //                   SizedBox(height: 16),
            //                   Text(
            //                     'Please wait a moment until it is approved',
            //                     textAlign: TextAlign.center,
            //                     style: TextStyle(fontSize: 16),
            //                   ),
            //                 ],
            //               ),
            //             ),
            //           );
            //         }
            //       },
            //       loading: () =&gt;
            //           const Center(child: CircularProgressIndicator()),
            //       error: (error, stack) {
            //         WidgetsBinding.instance.addPostFrameCallback((_) {
            //           if (context.mounted) {
            //             ScaffoldMessenger.of(context).showSnackBar(
            //               SnackBar(
            //                 content: Text('An error occurred: $error'),
            //               ),
            //             );
            //           }
            //         });
            //         return Center(child: Text('An error occurred: $error'));
            //       },
            //     ),
            //   ],
            // );
          },
          loading: () =&gt; const Center(child: CircularProgressIndicator()),
          error: (error, stack) =&gt; Center(
            child: Text('Failed to load guild information: $error'),
          ),
        ),
      ),
    );
  }
}

class GuildInfoWidget extends StatelessWidget {
  const GuildInfoWidget({super.key, required this.guildInfo});
  final GuildInfoResponseDtoData guildInfo;

  @override
  Widget build(BuildContext context) {
    return Column(
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
                    ClipboardData(text: guildInfo.guildId ?? 'Unknown'),
                  );
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(
                        'ID copied to clipboard: '
                        '${guildInfo.guildId ?? 'Unknown'}',
                      ),
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
                      Text(
                        guildInfo.guildId ?? 'Unknown',
                        style: const TextStyle(
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
                child: guildInfo.guildAvatar != null
                    ? Image.network(
                        guildInfo.guildAvatar!,
                        width: 64,
                        height: 64,
                      )
                    : const Icon(
                        Icons.image,
                        size: 64,
                        color: ColorToken.text,
                      ),
              ),
              const SizedBox(height: 16),
              Text(
                guildInfo.guildName ?? 'Unknown Guild',
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                ),
              ),
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(
                    Icons.people,
                    size: 24,
                    color: ColorToken.text,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    '${guildInfo.guildMembers?.length ?? 0}',
                    style: const TextStyle(
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ],
    );
  }
}

---

## 🤖 アシスタント
*2024/12/25 12:43:54*

以下のように修正することで、DecoratedBoxだけをクラス化し、`GuildRequestPage`には必要な部分を残す形を実現できます。

- `GuildInfoWidget`に`DecoratedBox`を保持し、それ以外の`Column`構成を`GuildRequestPage`内に残す。
- `GuildRequestPage`内でリスト構造を維持する。

修正版コードは以下のようになります。

### 修正版コード

```dart
class GuildRequestPage extends HookConsumerWidget {
  const GuildRequestPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final requestState = ref.watch(requestGuildNotifierProvider);

    // APIから取得したギルド情報
    final guildInfoAsyncValue = ref.watch(getMyGuildNotifierProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Join an existing guild'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {
            // ギルドの Top 画面に戻るため popUntil を使用
            Navigator.of(context).popUntil((route) => route.isFirst);
          },
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: guildInfoAsyncValue.when(
          data: (guildInfo) {
            if (guildInfo != null) {
              return Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  GuildInfoWidget(guildInfo: guildInfo),
                  const SizedBox(height: 24),
                  requestState.when(
                    data: (data) {
                      if (data == null) {
                        return ElevatedButton(
                          onPressed: () async {
                            final notifier =
                                ref.read(requestGuildNotifierProvider.notifier);

                            // TODO: 自分のユーザーIDを取得する
                            await notifier.requestGuild(
                              guildId: guildInfo.guildId ?? 'UnknownGuildId',
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
                    loading: () =>
                        const Center(child: CircularProgressIndicator()),
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
              );
            } else {
              return const Center(
                child: Text('No guild information available.'),
              );
            }
          },
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (error, stack) => Center(
            child: Text('Failed to load guild information: $error'),
          ),
        ),
      ),
    );
  }
}

class GuildInfoWidget extends StatelessWidget {
  const GuildInfoWidget({super.key, required this.guildInfo});
  final GuildInfoResponseDtoData guildInfo;

  @override
  Widget build(BuildContext context) {
    return DecoratedBox(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: ColorToken.secondary),
      ),
      child: Column(
        children: [
          GestureDetector(
            onTap: () {
              Clipboard.setData(
                ClipboardData(text: guildInfo.guildId ?? 'Unknown'),
              );
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(
                    'ID copied to clipboard: '
                    '${guildInfo.guildId ?? 'Unknown'}',
                  ),
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
                  Text(
                    guildInfo.guildId ?? 'Unknown',
                    style: const TextStyle(
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
            child: guildInfo.guildAvatar != null
                ? Image.network(
                    guildInfo.guildAvatar!,
                    width: 64,
                    height: 64,
                  )
                : const Icon(
                    Icons.image,
                    size: 64,
                    color: ColorToken.text,
                  ),
          ),
          const SizedBox(height: 16),
          Text(
            guildInfo.guildName ?? 'Unknown Guild',
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 18,
            ),
          ),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(
                Icons.people,
                size: 24,
                color: ColorToken.text,
              ),
              const SizedBox(width: 8),
              Text(
                '${guildInfo.guildMembers?.length ?? 0}',
                style: const TextStyle(
                  fontSize: 14,
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }
}
```

この修正により、`DecoratedBox`はクラス化され、`Column`内の他の要素は`GuildRequestPage`に残ります。

---
