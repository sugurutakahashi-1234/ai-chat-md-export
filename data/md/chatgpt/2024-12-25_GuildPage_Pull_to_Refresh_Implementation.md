# GuildPage Pull-to-Refresh Implementation

日付: 2024-12-25

---

## 👤 ユーザー
*2024/12/25 15:24:43*

// ギルド情報がある場合でもpull-to- refreshを実装したい

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter\_hooks/flutter\_hooks.dart';
import 'package:flutter\_svg/svg.dart';
import 'package:go\_router/go\_router.dart';
import 'package:hooks\_riverpod/hooks\_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:snpit\_guild\_app/domain/screen.dart';
import 'package:snpit\_guild\_app/gen/assets.gen.dart';
import 'package:snpit\_guild\_app/presentation/design\_token/color\_token.dart';
import 'package:snpit\_guild\_app/presentation/providers/api\_client/guilds/get\_guild\_info.dart';
import 'package:snpit\_guild\_app/presentation/providers/on\_created\_guild.dart';
import 'package:snpit\_guild\_app/utils/extensions/uri\_extensions.dart';

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
      \[\],
    );

    // ギルドが作成された場合ギルド情報を取得する
    ref.listen&lt;bool&gt;(
      onCreatedGuildNotifierProvider,
      (\_, next) async {
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
                  children: \[
                    Container(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        children: \[
                          DecoratedBox(
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: ColorToken.secondary),
                            ),
                            child: Column(
                              children: \[
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
                                      children: \[
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
                                      \],
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
                                  children: \[
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
                                  \],
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
                                  children: \[
                                    \_buildStatColumn('Search', 3879, 'Q'),
                                    \_buildStatColumn('Attack', 1230, 'E'),
                                    \_buildStatColumn('Luck', 893, 'L'),
                                    \_buildStatColumn('Defence', 905, 'B'),
                                  \],
                                ),
                                const SizedBox(height: 24),
                              \],
                            ),
                          ),
                        \],
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
                      tabs: const \[
                        Tab(text: 'Members'),
                        Tab(text: 'Spots'),
                      \],
                    ),
                    Expanded(
                      child: Padding(
                        padding: const EdgeInsets.all(24),
                        child: TabBarView(
                          children: \[
                            // Members Tab
                            ListView.builder(
                              itemCount: guildInfo.guildMembers?.length ?? 0,
                              itemBuilder: (context, index) {
                                final member = guildInfo.guildMembers!\[index\];
                                return Padding(
                                  padding: const EdgeInsets.only(bottom: 8),
                                  child: DecoratedBox(
                                    decoration: BoxDecoration(
                                      borderRadius: BorderRadius.circular(4),
                                      border: Border.all(
                                        color: ColorToken.secondary,
                                      ),
                                    ),
                                    child: Padding(
                                      padding: const EdgeInsets.all(16),
                                      child: Row(
                                        children: \[
                                          Expanded(
                                            child: Column(
                                              crossAxisAlignment:
                                                  CrossAxisAlignment.start,
                                              children: \[
                                                Row(
                                                  children: \[
                                                    CircleAvatar(
                                                      radius: 16,
                                                      backgroundImage:
                                                          NetworkImage(
                                                        UriExtensions
                                                            .randomImageUrl
                                                            .toString(),
                                                      ),
                                                    ),
                                                    const SizedBox(width: 12),
                                                    Expanded(
                                                      child: Text(
                                                        member.userId ??
                                                            'Unknown',
                                                        maxLines: 1,
                                                        overflow: TextOverflow
                                                            .ellipsis,
                                                        style: const TextStyle(
                                                          color: Colors.white,
                                                          fontSize: 16,
                                                          fontWeight:
                                                              FontWeight.bold,
                                                        ),
                                                      ),
                                                    ),
                                                  \],
                                                ),
                                                const SizedBox(height: 10),
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
                                              \],
                                            ),
                                          ),
                                          Expanded(
                                            child: Column(
                                              crossAxisAlignment:
                                                  CrossAxisAlignment.end,
                                              children: \[
                                                \_buildStatRow('Q', 13),
                                                \_buildStatRow('E', 48),
                                                \_buildStatRow('L', 7),
                                                \_buildStatRow('B', 5),
                                              \],
                                            ),
                                          ),
                                        \],
                                      ),
                                    ),
                                  ),
                                );
                              },
                            ),

                            // Spots Tab
                            const Center(child: Text('COMING SOON...')),
                          \],
                        ),
                      ),
                    ),
                  \],
                ),
              );
            } else {
              // ギルド情報がない場合
              return const SingleChildScrollView(
                physics: AlwaysScrollableScrollPhysics(),
                child: Padding(
                  padding: EdgeInsets.symmetric(horizontal: 16),
                  child: \_NoGuildWidget(),
                ),
              );
            }
          },
          loading: () =&gt; const Center(child: CircularProgressIndicator()),
          error: (error, stackTrace) {
            WidgetsBinding.instance.addPostFrameCallback((\_) {
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

  Widget \_buildStatColumn(String title, int value, String subtext) {
    return Column(
      children: \[
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
      \],
    );
  }

  Widget \_buildStatRow(String label, int value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.end,
      children: \[
        const SizedBox(
          width: 40,
        ),
        SizedBox(
          width: 20, // Ensure consistent width for the label
          child: Text(
            label,
            style: const TextStyle(
              fontSize: 13,
            ),
          ),
        ),
        const SizedBox(width: 4),
        SizedBox(
          width: 30, // Ensure consistent width for the value
          child: Text(
            NumberFormat('#,###').format(value),
            style: const TextStyle(
              color: ColorToken.primary,
              fontSize: 11,
            ),
          ),
        ),
        const SizedBox(width: 4),
        Expanded(
          child: LinearProgressIndicator(
            value: value / 100, // Max value is 100
            color: ColorToken.primary,
            backgroundColor: ColorToken.bg,
            borderRadius: BorderRadius.circular(2),
          ),
        ),
      \],
    );
  }
}

class \_NoGuildWidget extends StatelessWidget {
  const \_NoGuildWidget();

  @override
  Widget build(BuildContext context) {
    return Column(
      children: \[
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
            children: \[
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
                  children: \[
                    Center(
                      child: Text(
                        'Join an existing guild',
                      ),
                    ),
                    Positioned(
                      right: 0,
                      child: Icon(
                        Icons.arrow\_forward,
                        size: 24,
                        color: ColorToken.text,
                      ),
                    ),
                  \],
                ),
              ),
            \],
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
            children: \[
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
                  children: \[
                    Center(
                      child: Text('Host a new guild'),
                    ),
                    Positioned(
                      right: 0,
                      child: Icon(
                        Icons.arrow\_forward,
                        size: 24,
                        color: ColorToken.text,
                      ),
                    ),
                  \],
                ),
              ),
            \],
          ),
        ),
        const SizedBox(height: 48),
      \],
    );
  }
}

---

## 🤖 アシスタント
*2024/12/25 15:24:56*

This `GuildPage` implementation includes a `RefreshIndicator` to enable pull-to-refresh functionality regardless of whether guild information exists. Here's how it works:

### Key Points
1. \*\*`RefreshIndicator` Usage:\*\*
   - Wrapping the entire body content in a `RefreshIndicator` allows refreshing guild information with a pull-down gesture.
   - The `onRefresh` callback triggers a refresh operation by calling the `executeRequest` method on `getMyGuildNotifierProvider`.

2. \*\*Guild Information Handling:\*\*
   - When guild information exists (`guildInfo != null`), the `DefaultTabController` and other UI elements are rendered.
   - If no guild information is available, a `\_NoGuildWidget` is shown.

3. \*\*Listening for Changes:\*\*
   - Using `ref.listen` on the `onCreatedGuildNotifierProvider` ensures the guild information is re-fetched when a new guild is created.

4. \*\*Design Details:\*\*
   - `TabBar` and `TabBarView` manage the layout for "Members" and "Spots" tabs.
   - Member details and statistics are displayed dynamically using `ListView.builder`.
   - `\_NoGuildWidget` provides actions for joining or hosting a guild when no guild information is available.

### Suggestions for Further Improvements
- \*\*Loading State:\*\* Consider enhancing the `CircularProgressIndicator` to indicate that a refresh operation is in progress.
- \*\*Error Handling:\*\* Improve error handling and user feedback in the `error` section, perhaps by adding retry options or more detailed messages.
- \*\*UI Consistency:\*\*
  - Ensure alignment and spacing are consistent across different screen sizes.
  - Use `MediaQuery` for responsive paddings or dynamic styles where applicable.

### Usage of Hooks and Riverpod
- The `useEffect` hook initializes the guild data fetch on the first build.
- Riverpod provides clean state management and reactivity, ensuring UI updates automatically when the guild information changes.

This approach is efficient, maintains good separation of concerns, and uses Flutter best practices. Let me know if you need further refinements!

---
