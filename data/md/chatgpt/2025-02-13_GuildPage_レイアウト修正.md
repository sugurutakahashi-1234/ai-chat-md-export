# GuildPage レイアウト修正

日付: 2025-02-13

---

## 👤 ユーザー
*2025/2/13 21:31:19*

本当はコメントアウトしている Withdraw from the guild の OutlinedButton をcolumnで入れたいが、あるとレイアウトが壊れてエラーになる

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_svg/svg.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:snpit_guild_app/domain/design/color_pallet.dart';
import 'package:snpit_guild_app/domain/design/color_token.dart';
import 'package:snpit_guild_app/domain/screen.dart';
import 'package:snpit_guild_app/gen/assets.gen.dart';
import 'package:snpit_guild_app/infrastructure/entities/extensions/camera_dto_x.dart';
import 'package:snpit_guild_app/infrastructure/snapit_guild_api/snapit_guild_api.openapi.dart';

import 'package:snpit_guild_app/presentation/providers/api_client/guilds/get_guild.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/guilds/update_guild_member.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/users/get_user.dart';
import 'package:snpit_guild_app/presentation/providers/should_refresh_guild.dart';
import 'package:snpit_guild_app/presentation/providers/should_refresh_map_spot.dart';
import 'package:snpit_guild_app/presentation/widgets/dialogs/withdraw_dialog.dart';
import 'package:snpit_guild_app/presentation/widgets/guild_icon.dart';
import 'package:snpit_guild_app/presentation/widgets/guild_member_column.dart';
import 'package:snpit_guild_app/presentation/widgets/parameters_bar_column.dart';
import 'package:snpit_guild_app/presentation/widgets/total_parameters_row.dart';
import 'package:snpit_guild_app/utils/snack_bar_utils.dart';

class GuildPage extends HookConsumerWidget {
  const GuildPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // 同期の齟齬が発生する少し危険な書き方であるが combine するのは大変なのでこのままにしている
    final myUserId = ref.watch(getMyUserNotifierProvider).value?.userId;
    final myGuildAsyncValue = ref.watch(getMyGuildNotifierProvider);
    final isLoadingState = useState(false);

    Future&lt;void&gt; onRefresh() async {
      try {
        if (!context.mounted) {
          return;
        }

        isLoadingState.value = true;

        await ref.read(getMyGuildNotifierProvider.notifier).getMyGuild();
      } on Exception catch (error) {
        if (context.mounted) {
          showErrorSnackBar(context, error);
        }
      } finally {
        if (context.mounted) {
          isLoadingState.value = false;
        }
      }
    }

    ref.listen&lt;int&gt;(shouldRefreshGuildNotifierProvider, (previous, next) async {
      // 更新中はスキップ
      if (!isLoadingState.value) {
        // ギルド情報の更新
        await onRefresh();
      }
    });

    useEffect(
      () {
        Future.microtask(() async {
          await onRefresh();
        });
        return null;
      },
      [],
    );

    return Scaffold(
      body: RefreshIndicator(
        // NestedScrollView を組み合わせた時の refreshIndicator をトリガーさせるための実装
        notificationPredicate: (notification) =&gt;
            notification.metrics.axisDirection == AxisDirection.down,
        onRefresh: () async {
          await onRefresh();
        },
        color: ColorToken.primary,
        backgroundColor: ColorToken.bgLight,
        child: myGuildAsyncValue.when(
          data: (guild) {
            if (guild != null) {
              // ギルド情報に所属している場合
              return _GuildContent(
                guild: guild,
                myUserId: myUserId,
                onRefresh: onRefresh,
              );
            } else {
              // ギルド情報に所属していない場合
              return const SingleChildScrollView(
                physics: AlwaysScrollableScrollPhysics(),
                child: Padding(
                  padding: EdgeInsets.symmetric(horizontal: 16),
                  child: _NoGuildWidget(),
                ),
              );
            }
          },
          loading: () {
            return const Center(child: CircularProgressIndicator());
          },
          error: (error, _) {
            return Center(child: Text('Error: $error'));
          },
        ),
      ),
    );
  }
}

/// ギルド情報がある場合のコンテンツをまとめたWidget
class _GuildContent extends HookConsumerWidget {
  const _GuildContent({
    required this.guild,
    required this.myUserId,
    required this.onRefresh,
  });

  final GuildInfoResponseDtoData guild;
  final String? myUserId;
  final Future&lt;void&gt; Function() onRefresh;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final guildId = guild.guildId ?? '';
    final guildName = guild.guildName ?? '';
    final guildMembersCount = guild.guildMembersCount ?? 0;
    final requestedMembersCount = guild.guildMembers
            ?.where(
              (member) =&gt;
                  member.memberStatus == GuildMemberDtoMemberStatus.REQUESTED,
            )
            .length ??
        0;
    final isAdminOrOwner = guild.guildMembers?.any(
          (member) =&gt;
              member.userId == myUserId &&
              (member.role == GuildMemberDtoRole.ADMIN ||
                  member.role == GuildMemberDtoRole.OWNER),
        ) ??
        false;

    final searchQ = guild.searchQ ?? 0;
    final attackE = guild.attackE ?? 0;
    final luckL = guild.luckL ?? 0;
    final defenseB = guild.defenseB ?? 0;

    final guildMemberList = guild.guildMembers ?? [];

    return DefaultTabController(
      length: 2, // Tabの数
      child: Column(
        children: [
          Expanded(
            child: NestedScrollView(
              physics: const BouncingScrollPhysics(),
              headerSliverBuilder: (context, innerBoxIsScrolled) {
                return [
                  // ギルドヘッダー部分
                  SliverToBoxAdapter(
                    child: _GuildHeader(
                      guildId: guildId,
                      guildName: guildName,
                      guildAvatar: guild.guildAvatar,
                      guildMembersCount: guildMembersCount,
                      requestedMembersCount: requestedMembersCount,
                      isAdminOrOwner: isAdminOrOwner,
                      searchQ: searchQ,
                      attackE: attackE,
                      luckL: luckL,
                      defenseB: defenseB,
                    ),
                  ),
                  // タブ部分（固定ヘッダー）
                  SliverPersistentHeader(
                    pinned: true,
                    delegate: _SliverTabBarDelegate(
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
                    ),
                  ),
                ];
              },
              // タブビュー
              body: Padding(
                padding: const EdgeInsets.only(
                  left: 24,
                  right: 24,
                  top: 24,
                ),
                child: TabBarView(
                  children: [
                    // Members Tab
                    _GuildMembersTab(
                      guildId: guildId,
                      guildMemberList: guildMemberList,
                      onRefresh: onRefresh,
                    ),
                    // Spots Tab
                    const _SpotsTab(),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// ギルドのヘッダー部分（ギルド名やギルドIDなどの表示）
class _GuildHeader extends StatelessWidget {
  const _GuildHeader({
    required this.guildId,
    required this.guildName,
    required this.guildAvatar,
    required this.guildMembersCount,
    required this.requestedMembersCount,
    required this.isAdminOrOwner,
    required this.searchQ,
    required this.attackE,
    required this.luckL,
    required this.defenseB,
  });

  final String guildId;
  final String guildName;
  final String? guildAvatar;
  final num guildMembersCount;
  final num requestedMembersCount;
  final bool isAdminOrOwner;
  final num searchQ;
  final num attackE;
  final num luckL;
  final num defenseB;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        children: [
          const SizedBox(height: 24),
          DecoratedBox(
            decoration: BoxDecoration(
              color: ColorToken.bg,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(
                color: ColorToken.secondary,
              ),
            ),
            child: Column(
              children: [
                GestureDetector(
                  onTap: () {
                    Clipboard.setData(
                      ClipboardData(text: guildId),
                    );
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Copied: $guildId'),
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
                          guildId,
                          style: const TextStyle(fontSize: 14),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                GuildIcon(
                  guildId: guildId,
                  guildAvatar: guildAvatar,
                ),
                const SizedBox(height: 16),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Text(
                    guildName,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 18,
                    ),
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
                      '$guildMembersCount',
                      style: const TextStyle(fontSize: 14),
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
                TotalParametersRow(
                  searchValue: searchQ,
                  attackValue: attackE,
                  luckValue: luckL,
                  defenceValue: defenseB,
                ),
                const SizedBox(height: 24),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // ギルドの管理者または所有者の場合のみ管理者画面への導線を表示
          if (isAdminOrOwner) ...[
            OutlinedButton(
              onPressed: () {
                context.push(Screen.guildManage.path);
              },
              child: Stack(
                alignment: Alignment.centerRight,
                children: [
                  const Center(
                    child: Text('Manage this guild'),
                  ),
                  Positioned(
                    child: requestedMembersCount != 0
                        ? Container(
                            padding: const EdgeInsets.all(8),
                            decoration: const BoxDecoration(
                              color: ColorToken.primary,
                              shape: BoxShape.circle,
                            ),
                            child: Text(
                              '$requestedMembersCount',
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 15,
                              ),
                            ),
                          )
                        : const Icon(
                            Icons.arrow_forward,
                            size: 24,
                            color: ColorToken.text,
                          ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 8),
          ],
        ],
      ),
    );
  }
}

/// Membersタブのリスト部分
class _GuildMembersTab extends HookConsumerWidget {
  const _GuildMembersTab({
    required this.guildId,
    required this.guildMemberList,
    required this.onRefresh,
  });

  final String guildId;
  final List&lt;GuildMemberDto&gt; guildMemberList;
  final Future&lt;void&gt; Function() onRefresh;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isLoadingState = useState(false);

    Future&lt;void&gt; onTapWithdrawGuild() async {
      final confirm = await showDialog&lt;bool&gt;(
        context: context,
        builder: (context) {
          return const WithdrawDialog();
        },
      );

      if (confirm != true) {
        return;
      }

      try {
        if (!context.mounted) {
          return;
        }
        isLoadingState.value = true;

        final myUser =
            await ref.read(getMyUserNotifierProvider.notifier).getMyUser();
        final myUserId = myUser.userId;
        if (myUserId == null) {
          throw Exception('Unexpected');
        }

        await ref.read(leaveGuildNotifierProvider.notifier).leaveGuild(
              guildId: guildId,
              userId: myUserId,
            );

        // 自分の所属のギルドの更新
        await ref.read(getMyUserNotifierProvider.notifier).getMyUser();
        ref.read(shouldRefreshMapSpotNotifierProvider.notifier).trigger();

        await onRefresh();
      } on Exception catch (error) {
        if (context.mounted) {
          showErrorSnackBar(context, error);
        }
      } finally {
        if (context.mounted) {
          isLoadingState.value = false;
        }
      }
    }

    final filteredGuildMemberList = guildMemberList
        .where(
          (guildMember) =&gt;
              guildMember.memberStatus == GuildMemberDtoMemberStatus.JOINED ||
              guildMember.memberStatus == GuildMemberDtoMemberStatus.INVITED,
        )
        .toList();

    return 
    // Column(
    //   children: [
        ListView.builder(
          itemCount: filteredGuildMemberList.length,
          itemBuilder: (context, index) {

            final guildMember = filteredGuildMemberList[index];
            final userName = guildMember.username ?? '';
            final userPhotoUrl = guildMember.avatar;
            final searchQ = guildMember.decks?.firstOrNull?.searchQ ?? 0;
            final attackE = guildMember.decks?.firstOrNull?.attackE ?? 0;
            final luckL = guildMember.decks?.firstOrNull?.luckL ?? 0;
            final defenseB = guildMember.decks?.firstOrNull?.defenseB ?? 0;
            final cameraList =
                guildMember.decks?.firstOrNull?.deckCameras?.sorted() ?? [];

            return Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: DecoratedBox(
                decoration: BoxDecoration(
                  color: ColorToken.bg,
                  borderRadius: BorderRadius.circular(4),
                  border: Border.all(
                    color: ColorToken.secondary,
                  ),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    children: [
                      Expanded(
                        child: GuildMemberColumn(
                          userName: userName,
                          userPhotoUrl: userPhotoUrl,
                          cameraList: cameraList,
                        ),
                      ),
                      Expanded(
                        child: ParametersBarColumn(
                          searchQ: searchQ,
                          attackE: attackE,
                          luckL: luckL,
                          defenseB: defenseB,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
      //   ),
      //   const SizedBox(height: 32),
      //   Expanded(
      //     child: OutlinedButton(
      //       onPressed: isLoadingState.value
      //           ? null
      //           : () async {
      //               await onTapWithdrawGuild();
      //             },
      //       child: const Text('Withdraw from the guild'),
      //     ),
      //   ),
      //   const SizedBox(height: 24),
      // ],
    );
  }
}

/// ギルド未所属の場合に表示されるWidget
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
                      child: Text('Join an existing guild'),
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
                    Center(child: Text('Host a new guild')),
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

// Spotsタブ
class _SpotsTab extends HookConsumerWidget {
  const _SpotsTab();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return const SingleChildScrollView(
      child: Column(
        children: [
          SizedBox(height: 24),
          Text('Coming Soon!'),
          SizedBox(height: 24),
        ],
      ),
    );
  }
}

/// タブバーを SliverPersistentHeader として使うためのデリゲート
class _SliverTabBarDelegate extends SliverPersistentHeaderDelegate {
  _SliverTabBarDelegate(this.tabBar);

  final TabBar tabBar;

  @override
  double get minExtent =&gt; tabBar.preferredSize.height;
  @override
  double get maxExtent =&gt; tabBar.preferredSize.height;

  @override
  Widget build(
    BuildContext context,
    double shrinkOffset,
    bool overlapsContent,
  ) {
    return ColoredBox(
      color: ColorPallet.gray800,
      child: tabBar,
    );
  }

  @override
  bool shouldRebuild(_SliverTabBarDelegate oldDelegate) {
    return oldDelegate.tabBar != tabBar;
  }
}

---

## 🔧 ツール
*2025/2/13 21:32:25*

**新しい試みを検討中**

`_GuildMembersTab` コードを見ていると、`ListView.builder` の後にコメントアウトされた `OutlinedButton` が見つかる。これを `column` に追加したいけど、レイアウトが崩れてエラーになるのが現状。

**レイアウトの修正を模索中**

`ListView.builder` にコメントアウトされた `OutlinedButton` を追加しようとしているが、レイアウトが崩れてエラーが発生している。

**レイアウトを修正する**

`ListView` を `Column` 内に配置し、`Expanded` 使用を改善する方法を模索中。`SingleChildScrollView` も検討し、`RefreshIndicator` の動作を維持したい。

**最適な方法を探る**

`ListView` と `OutlinedButton` のレイアウトを検討し、`Expanded` の使用を見直す。スムーズなスクロールを維持しつつ、デザインを改善する方法を探っている。

**探究している方法**

小さなアイテム数に限定していると、スクロールが難しい。全画面をNestedScrollViewにし、TabBarViewの子をSingleChildScrollViewやCustomScrollViewにする方法を模索中。

**考えているスケール**

`ListView.builder`のアイテム数を`RefreshIndicator`に合わせ、短い内容でも、継続的にスクロール可能にする`physics`を追加している。

**スクロール制御を追加する方法を探る**

`ListView.builder`を`RefreshIndicator`で包み、`AlwaysScrollableScrollPhysics`を追加することで、短いコンテンツでもスクロール可能にする方法を探っている。

**スクロールとボタンの位置調整**

スクロール可能な`ListView`とともに`OutlinedButton`を配置し、ボタンを画面下部に固定する方法を模索中。_flutter_sticky_headerライブラリの`StickyHeaderBuilder`を使用するのはどうだろう。

**スクロールとボタンの調整**

単一スクロールビューとカラムを使って、リストとボタンを配置し、リストが短いときはリストビューを使う方法を模索している。

**対話している異なる概念**

RefreshIndicatorやNestedScrollViewを活用し、TabBarViewの各子にCustomScrollViewやSliverListを使う方法を検討中。カラムとExpandedの制約のミスマッチがエラーを引き起こす可能性についても言及している。

**リスト構造を組み立てる**

Expandedを外し、リスト内の各アイテムを管理する方法を検討している。最後のアイテムはボタンで、スクロール可能な単一リストにまとめている。

---

## 🤖 アシスタント
*2025/2/13 21:32:25*

Flutter では「スクロール可能な親 (ListView など) の直下にさらに無制限に伸びようとする子 (Expanded など) を入れる」構造にしてしまうと、しばしば **RenderFlex children have non-zero flex but incoming height constraints are unbounded** といったエラーが出ることがあります。  
今回の場合、もともと `ListView.builder` 単体で返していた箇所を「`Column` にまとめて、その下にボタンを置く」ように変更すると、ちょうどこのパターンに当てはまりやすいです。

## 主な解決方法

### 1. ListView を 1 つだけにしてフッターとしてボタンを追加する
「スクロール全体を `ListView` が引き受ける形」にするのが最も簡単で、かつ推奨される方法です。  
`ListView.builder` の `itemCount` をひとつ増やし、最終行だけ「ボタンを置く行」にするイメージです。こうすることで「スクロール要素」はひとつにまとまり、レイアウトの衝突が発生しづらくなります。
  
```dart
class _GuildMembersTab extends HookConsumerWidget {
  const _GuildMembersTab({
    required this.guildId,
    required this.guildMemberList,
    required this.onRefresh,
  });

  final String guildId;
  final List<GuildMemberDto> guildMemberList;
  final Future<void> Function() onRefresh;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isLoadingState = useState(false);

    // ギルド脱退処理
    Future<void> onTapWithdrawGuild() async {
      final confirm = await showDialog<bool>(
        context: context,
        builder: (context) => const WithdrawDialog(),
      );
      if (confirm != true) {
        return;
      }

      try {
        // 省略...
      } catch (error) {
        // エラー処理省略...
      } finally {
        // 後始末...
      }
    }

    // 実際にリスト表示するメンバーだけをフィルタリング
    final filteredGuildMemberList = guildMemberList
        .where((guildMember) =>
            guildMember.memberStatus == GuildMemberDtoMemberStatus.JOINED ||
            guildMember.memberStatus == GuildMemberDtoMemberStatus.INVITED)
        .toList();

    // +1 することで、末尾の一つを「フッター（ボタン置き場）」用にします
    final itemCount = filteredGuildMemberList.length + 1;

    return ListView.builder(
      itemCount: itemCount,
      // 常に下方向へ引っ張って RefreshIndicator を出したいなら:
      physics: const AlwaysScrollableScrollPhysics(),
      itemBuilder: (context, index) {
        if (index < filteredGuildMemberList.length) {
          // メンバー表示の部分
          final guildMember = filteredGuildMemberList[index];
          // ここにパラメータ系の表示処理を書いていく
          return Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: DecoratedBox(
              decoration: BoxDecoration(
                color: ColorToken.bg,
                borderRadius: BorderRadius.circular(4),
                border: Border.all(color: ColorToken.secondary),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    Expanded(
                      child: GuildMemberColumn(
                        userName: guildMember.username ?? '',
                        userPhotoUrl: guildMember.avatar,
                        cameraList: guildMember.decks
                                ?.firstOrNull
                                ?.deckCameras
                                ?.sorted() ??
                            [],
                      ),
                    ),
                    Expanded(
                      child: ParametersBarColumn(
                        searchQ: guildMember.decks?.firstOrNull?.searchQ ?? 0,
                        attackE: guildMember.decks?.firstOrNull?.attackE ?? 0,
                        luckL: guildMember.decks?.firstOrNull?.luckL ?? 0,
                        defenseB: guildMember.decks?.firstOrNull?.defenseB ?? 0,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        } else {
          // 最後の行だけ「ギルド脱退ボタン行」にする
          return Padding(
            padding: const EdgeInsets.only(top: 16, bottom: 24),
            child: OutlinedButton(
              onPressed: isLoadingState.value ? null : onTapWithdrawGuild,
              child: const Text('Withdraw from the guild'),
            ),
          );
        }
      },
    );
  }
}
```

- `ListView` にフッター代わりにボタンを描画しているので、画面全体が 1 つのスクロール領域になります。
- `ListView.builder` の最終行（`index == itemCount - 1`）だけ別のウィジェットを返すようにして、ボタンを配置しています。
- こうすれば、`Column` + `Expanded` の取り合わせによるレイアウト衝突が起きません。

### 2. Column 内で ListView を shrinkWrap して使う
もしどうしても `Column` の中にボタンとリストを分けたい、かつ「全体を一括でスクロールさせたい」という場合は、`SingleChildScrollView` + `Column` 内で `ListView` を `shrinkWrap: true` + `physics: NeverScrollableScrollPhysics()` とする方法があります。

```dart
return SingleChildScrollView(
  child: Column(
    children: [
      // メンバーリスト部分
      ListView.builder(
        shrinkWrap: true,
        // ListView 自体のスクロールは無効化し、SingleChildScrollView に任せる
        physics: const NeverScrollableScrollPhysics(),
        itemCount: filteredGuildMemberList.length,
        itemBuilder: (context, index) {
          final guildMember = filteredGuildMemberList[index];
          return ...; // メンバー表示
        },
      ),

      const SizedBox(height: 16),
      OutlinedButton(
        onPressed: isLoadingState.value ? null : onTapWithdrawGuild,
        child: const Text('Withdraw from the guild'),
      ),
      const SizedBox(height: 24),
    ],
  ),
);
```

- この場合、`ListView` が自前でスクロールを持たず、`SingleChildScrollView` 側が全体を一括でスクロールします。
- `ListView` の引数で `shrinkWrap: true` としているのは「内部要素の高さに応じて ListView のサイズをきっちり計算してほしい」ためです。
- `physics: NeverScrollableScrollPhysics()` を指定することで、ListView 側のスクロールが無効になり、外側の `SingleChildScrollView` に全体のスクロールを任せることができます。

### 3. Sliver 系ウィジェットを使う
`NestedScrollView` や複数の `Sliver...` を組み合わせている場合は、`SliverList` + `SliverToBoxAdapter` などでメンバーのリスト部分とボタン部分を分ける方法もよく使われます。公式ドキュメントや Flutter サンプルを参照すると、Sliver 系の活用例が多く掲載されています。

---

## まとめ

- **ListView 1 つにまとめてしまう** (最もシンプルかつ衝突が少ない)
- どうしても `Column` 配下に置きたい場合は、**`shrinkWrap: true` + `NeverScrollableScrollPhysics()`** を使い、外側の `SingleChildScrollView` がスクロールを担当する
- より高度なカスタマイズが必要なら **Sliver 系ウィジェット** を組み合わせる

上記いずれかを行うことで、「レイアウトが壊れる / エラーが出る」状態を回避しつつ、ギルド脱退ボタンをリスト下部や画面下部に配置できるようになります。

---
