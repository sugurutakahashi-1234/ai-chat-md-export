# Guild Member Tile Widget

Date: 2024-12-25

---

## 👤 User
*2024-12-25 14:16:42*

_GuildMemberTile を定義してほしい

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_svg/svg.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:snpit_guild_app/domain/screen.dart';
import 'package:snpit_guild_app/gen/assets.gen.dart';
import 'package:snpit_guild_app/presentation/design_token/color_token.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/guilds/get_guild_info.dart';
import 'package:snpit_guild_app/presentation/providers/on_created_guild.dart';
import 'package:snpit_guild_app/utils/extensions/uri_extensions.dart';

class GuildPage extends HookConsumerWidget {
  const GuildPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final guildInfoAsync = ref.watch(getMyGuildNotifierProvider);

    useEffect(
      () {
        Future.microtask(() {
          ref.read(getMyGuildNotifierProvider.notifier).executeRequest();
        });
        return null;
      },
      [],
    );

    // ギルドが作成された場合ギルド情報を取得する
    ref.listen&lt;bool&gt;(
      onCreatedGuildNotifierProvider,
      (_, next) async {
        if (next) {
          await ref.read(getMyGuildNotifierProvider.notifier).executeRequest();
        }
      },
    );

    return Scaffold(
      body: RefreshIndicator(
        onRefresh: () async {
          await ref.read(getMyGuildNotifierProvider.notifier).executeRequest();
        },
        child: guildInfoAsync.when(
          data: (guildInfo) {
            if (guildInfo != null) {
              // ギルド情報がある場合
              return DefaultTabController(
                length: 2, // Tabの数
                child: Column(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(16),
                      child: Column(
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
                                      ClipboardData(
                                        text: guildInfo.guildId ?? 'Unknown',
                                      ),
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
                                const Padding(
                                  padding: EdgeInsets.symmetric(horizontal: 16),
                                  child: Divider(
                                    color: ColorToken.secondary,
                                    height: 0,
                                  ),
                                ),
                                const SizedBox(height: 24),
                                Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceEvenly,
                                  children: [
                                    _buildStatColumn('Search', 3879, 'Q'),
                                    _buildStatColumn('Attack', 1230, 'E'),
                                    _buildStatColumn('Luck', 893, 'L'),
                                    _buildStatColumn('Defence', 905, 'B'),
                                  ],
                                ),
                                const SizedBox(height: 24),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    TabBar(
                      dividerColor: ColorToken.secondary,
                      indicator: UnderlineTabIndicator(
                        borderSide: const BorderSide(
                          color: ColorToken.primary,
                          width: 4,
                        ),
                        insets: EdgeInsets.symmetric(
                          horizontal: MediaQuery.of(context).size.width / 4,
                        ),
                      ),
                      labelColor: ColorToken.text,
                      unselectedLabelColor: ColorToken.secondary,
                      tabs: const [
                        Tab(text: 'Members'),
                        Tab(text: 'Spots'),
                      ],
                    ),
                    Expanded(
                      child: Padding(
                        padding: const EdgeInsets.all(24),
                        child: TabBarView(
                          children: [
                            // Members Tab
                            ListView.builder(
                              itemCount: guildInfo.guildMembers?.length ?? 0,
                              itemBuilder: (context, index) {
                                final member = guildInfo.guildMembers![index];
                                return Padding(
                                  padding: const EdgeInsets.symmetric(
                                    vertical: 8,
                                    horizontal: 16,
                                  ),
                                  child: DecoratedBox(
                                    decoration: BoxDecoration(
                                      borderRadius: BorderRadius.circular(4),
                                      border: Border.all(
                                        color: ColorToken.secondary,
                                      ),
                                    ),
                                    child: Padding(
                                      padding: const EdgeInsets.all(12),
                                      child: Row(
                                        children: [
                                          CircleAvatar(
                                            radius: 16,
                                            backgroundImage: NetworkImage(
                                              UriExtensions.randomImageUrl
                                                  .toString(),
                                            ),
                                          ),
                                          const SizedBox(width: 12),
                                          Expanded(
                                            child: Column(
                                              crossAxisAlignment:
                                                  CrossAxisAlignment.start,
                                              children: [
                                                Text(
                                                  maxLines: 1,
                                                  overflow:
                                                      TextOverflow.ellipsis,
                                                  member.userId ?? 'Unknown',
                                                  style: const TextStyle(
                                                    color: Colors.white,
                                                    fontSize: 16,
                                                    fontWeight: FontWeight.bold,
                                                  ),
                                                ),
                                                const SizedBox(height: 8),
                                                Row(
                                                  children: List.generate(
                                                    4,
                                                    (badgeIndex) =&gt; Padding(
                                                      padding:
                                                          const EdgeInsets.only(
                                                        right: 4,
                                                      ),
                                                      child: ClipRRect(
                                                        borderRadius:
                                                            BorderRadius
                                                                .circular(4),
                                                        child: SizedBox(
                                                          width: 28,
                                                          height: 28,
                                                          child: Image.network(
                                                            UriExtensions
                                                                .randomImageUrl
                                                                .toString(),
                                                            fit: BoxFit.cover,
                                                          ),
                                                        ),
                                                      ),
                                                    ),
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ),
                                          const SizedBox(width: 12),
                                          Column(
                                            crossAxisAlignment:
                                                CrossAxisAlignment.end,
                                            children: [
                                              _buildStatRow('Q', 13),
                                              _buildStatRow('E', 48),
                                              _buildStatRow('L', 7),
                                              _buildStatRow('B', 5),
                                            ],
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                );
                              },
                            ),

                            // Spots Tab
                            const Center(child: Text('COMING SOON...')),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              );
            } else {
              // ギルド情報がない場合
              return const SingleChildScrollView(
                physics: AlwaysScrollableScrollPhysics(),
                child: Padding(
                  padding: EdgeInsets.symmetric(horizontal: 16),
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
            return SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              child: Center(child: Text('An error occurred: $error')),
            );
          },
        ),
      ),
    );
  }

  Widget _buildStatColumn(String title, int value, String subtext) {
    return Column(
      children: [
        Text(
          title,
          style: const TextStyle(
            fontSize: 13,
          ),
        ),
        Text(
          NumberFormat('#,###').format(value),
          style: const TextStyle(
            fontSize: 16,
            color: ColorToken.primary,
          ),
        ),
        Text(
          '($subtext)',
          style: const TextStyle(
            fontSize: 12,
            color: ColorToken.secondary,
          ),
        ),
      ],
    );
  }

  Widget _buildStatRow(String label, int value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Text(
            label,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 14,
            ),
          ),
          const SizedBox(width: 4),
          Text(
            NumberFormat('#,###').format(value),
            style: const TextStyle(
              color: Colors.white,
              fontSize: 14,
            ),
          ),
          const SizedBox(width: 4),
          SizedBox(
            width: 50,
            child: LinearProgressIndicator(
              value: value / 100, // Max value is 100
              color: ColorToken.primary,
              backgroundColor: ColorToken.bg,
            ),
          ),
        ],
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
                Assets.images.joinGuildFig.path,
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
                Assets.images.createGuildFig.path,
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
*2024-12-25 14:17:01*

Here's the implementation for `_GuildMemberTile`, following the conventions and design patterns in your existing code:

---

## 🤖 Assistant
*2024-12-25 14:17:01*

{"name": "guild_member_tile", "type": "code/dart", "content": "import 'package:flutter/material.dart';\nimport 'package:flutter_hooks/flutter_hooks.dart';\nimport 'package:flutter_svg/svg.dart';\nimport 'package:snpit_guild_app/presentation/design_token/color_token.dart';\nimport 'package:snpit_guild_app/utils/extensions/uri_extensions.dart';\n\nclass GuildMemberTile extends StatelessWidget {\n  final String userId;\n  final String avatarUrl;\n  final Map&lt;String, int&gt; stats;\n\n  const GuildMemberTile({\n    Key? key,\n    required this.userId,\n    required this.avatarUrl,\n    required this.stats,\n  }) : super(key: key);\n\n  @override\n  Widget build(BuildContext context) {\n    return Padding(\n      padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),\n      child: DecoratedBox(\n        decoration: BoxDecoration(\n          borderRadius: BorderRadius.circular(4),\n          border: Border.all(color: ColorToken.secondary),\n        ),\n        child: Padding(\n          padding: const EdgeInsets.all(12),\n          child: Row(\n            children: [\n              CircleAvatar(\n                radius: 16,\n                backgroundImage: NetworkImage(avatarUrl),\n              ),\n              const SizedBox(width: 12),\n              Expanded(\n                child: Column(\n                  crossAxisAlignment: CrossAxisAlignment.start,\n                  children: [\n                    Text(\n                      userId,\n                      maxLines: 1,\n                      overflow: TextOverflow.ellipsis,\n                      style: const TextStyle(\n                        color: Colors.white,\n                        fontSize: 16,\n                        fontWeight: FontWeight.bold,\n                      ),\n                    ),\n                    const SizedBox(height: 8),\n                    Row(\n                      children: List.generate(\n                        4,\n                        (badgeIndex) =&gt; Padding(\n                          padding: const EdgeInsets.only(right: 4),\n                          child: ClipRRect(\n                            borderRadius: BorderRadius.circular(4),\n                            child: SizedBox(\n                              width: 28,\n                              height: 28,\n                              child: Image.network(\n                                UriExtensions.randomImageUrl.toString(),\n                                fit: BoxFit.cover,\n                              ),\n                            ),\n                          ),\n                        ),\n                      ),\n                    ),\n                  ],\n                ),\n              ),\n              const SizedBox(width: 12),\n              Column(\n                crossAxisAlignment: CrossAxisAlignment.end,\n                children: stats.entries\n                    .map((entry) =&gt; _buildStatRow(entry.key, entry.value))\n                    .toList(),\n              ),\n            ],\n          ),\n        ),\n      ),\n    );\n  }\n\n  Widget _buildStatRow(String label, int value) {\n    return Padding(\n      padding: const EdgeInsets.symmetric(vertical: 4),\n      child: Row(\n        children: [\n          Text(\n            label,\n            style: const TextStyle(\n              color: Colors.white,\n              fontSize: 14,\n            ),\n          ),\n          const SizedBox(width: 4),\n          Text(\n            value.toString(),\n            style: const TextStyle(\n              color: Colors.white,\n              fontSize: 14,\n            ),\n          ),\n          const SizedBox(width: 4),\n          SizedBox(\n            width: 50,\n            child: LinearProgressIndicator(\n              value: value / 100,\n              color: ColorToken.primary,\n              backgroundColor: ColorToken.bg,\n            ),\n          ),\n        ],\n      ),\n    );\n  }\n}"}

---

## 🔧 Tool
*2024-12-25 14:17:01*

{"result": "Successfully created text document 'guild_member_tile' which will be referenced in all future messages with the unique identifier textdoc_id: '676b954907bc8191b0ce02888962c41c'", "textdoc_id": "676b954907bc8191b0ce02888962c41c", "name": "guild_member_tile"}

---

## 🤖 Assistant
*2024-12-25 14:17:01*

### Usage
You can use the `_GuildMemberTile` within your `ListView.builder` as follows:

```dart
ListView.builder(
  itemCount: guildInfo.guildMembers?.length ?? 0,
  itemBuilder: (context, index) {
    final member = guildInfo.guildMembers![index];
    return GuildMemberTile(
      userId: member.userId ?? 'Unknown',
      avatarUrl: UriExtensions.randomImageUrl.toString(),
      stats: {
        'Q': 13,
        'E': 48,
        'L': 7,
        'B': 5,
      },
    );
  },
);
```

### Features
- Displays a user's avatar and ID.
- Shows badges as a row of images.
- Displays stats in a column with labels, values, and progress bars.
- Follows consistent styling and design patterns from the existing project.

---
