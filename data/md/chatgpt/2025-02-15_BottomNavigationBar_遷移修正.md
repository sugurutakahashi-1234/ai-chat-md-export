# BottomNavigationBar 遷移修正

Date: 2025-02-15

---

## 👤 User
*2025-02-15 10:51:02*

画面遷移について修正したい。
BottomNavigationBarでguildタブにいるときにcontext.push(Screen.guildManage.path);
context.push(Screen.guildCode.path);context.push(Screen.guildCreate.path); でpush遷移させているがそのときにBottomNavigationBarを残したままタブ内でpush遷移させたい。

現状はBottomNavigationBarが残らない形でのpush遷移である。


import 'package:flutter/rendering.dart';
import 'package:go_router/go_router.dart';
import 'package:snpit_guild_app/domain/screen.dart';
import 'package:snpit_guild_app/presentation/pages/camera_list_page.dart';
import 'package:snpit_guild_app/presentation/pages/debug_device_info_page.dart';
import 'package:snpit_guild_app/presentation/pages/debug_localization_page.dart';
import 'package:snpit_guild_app/presentation/pages/debug_menu_page.dart';
import 'package:snpit_guild_app/presentation/pages/debug_utility_page.dart';
import 'package:snpit_guild_app/presentation/pages/deck_detail_page.dart';
import 'package:snpit_guild_app/presentation/pages/flag_list_page.dart';
import 'package:snpit_guild_app/presentation/pages/gpt_page.dart';
import 'package:snpit_guild_app/presentation/pages/guild_code_page.dart';
import 'package:snpit_guild_app/presentation/pages/guild_create_page.dart';
import 'package:snpit_guild_app/presentation/pages/guild_manage_page.dart';
import 'package:snpit_guild_app/presentation/pages/guild_page.dart';
import 'package:snpit_guild_app/presentation/pages/guild_request_page.dart';
import 'package:snpit_guild_app/presentation/pages/login_page.dart';
import 'package:snpit_guild_app/presentation/pages/map_page.dart';
import 'package:snpit_guild_app/presentation/pages/my_page.dart';
import 'package:snpit_guild_app/presentation/pages/notification_list_page.dart';
import 'package:snpit_guild_app/presentation/pages/setting_page.dart';
import 'package:snpit_guild_app/presentation/pages/shootable_spot_detail_page.dart';
import 'package:snpit_guild_app/presentation/pages/shooting_page.dart';
import 'package:snpit_guild_app/presentation/pages/spot_detail_page.dart';
import 'package:snpit_guild_app/presentation/pages/spot_list_page.dart';
import 'package:snpit_guild_app/presentation/pages/tab_page.dart';
import 'package:snpit_guild_app/presentation/pages/text_editing_page.dart';
import 'package:snpit_guild_app/presentation/pages/verification_code_page.dart';
import 'package:snpit_guild_app/presentation/pages/wallet_page.dart';
import 'package:snpit_guild_app/presentation/pages/weave_spot_page.dart';

class TextEditingPageArgs {
  TextEditingPageArgs({
    required this.title,
    required this.text,
    required this.hintText,
    required this.onSave,
  });

  final String title;
  final String text;
  final String hintText;
  final void Function(String updatedText) onSave;
}

final GoRouter router = GoRouter(
  initialLocation: Screen.login.path,
  routes: [
    GoRoute(
      path: Screen.debugMenu.path,
      builder: (context, state) =&gt; const DebugMenuPage(),
    ),
    GoRoute(
      path: Screen.debugUtility.path,
      builder: (context, state) =&gt; const DebugUtilityPage(),
    ),
    GoRoute(
      path: Screen.debugDeviceInfo.path,
      builder: (context, state) =&gt; const DebugDeviceInfoPage(),
    ),
    GoRoute(
      path: Screen.debugLocalization.path,
      builder: (context, state) =&gt; const DebugLocalizationPage(),
    ),
    GoRoute(
      path: Screen.textEditing.path,
      builder: (context, state) {
        final args = state.extra as TextEditingPageArgs? ??
            TextEditingPageArgs(
              title: '',
              text: '',
              hintText: '',
              onSave: (updatedText) {
                debugPrint(updatedText);
              },
            );
        return TextEditingPage(
          title: args.title,
          text: args.text,
          hintText: args.hintText,
          onSave: args.onSave,
        );
      },
    ),
    GoRoute(
      path: Screen.login.path,
      builder: (context, state) =&gt; const LoginPage(),
    ),
    GoRoute(
      path: Screen.verificationCode.path,
      builder: (context, state) {
        final email = state.extra as String? ?? '';
        return VerificationCodePage(email: email);
      },
    ),
    GoRoute(
      path: Screen.myPage.path,
      builder: (context, state) =&gt; const MyPage(),
    ),
    GoRoute(
      path: Screen.setting.path,
      builder: (context, state) =&gt; const SettingPage(),
    ),
    GoRoute(
      path: Screen.deckDetail.path,
      builder: (context, state) {
        final deckId = state.extra as String? ?? '';
        return DeckDetailPage(deckId: deckId);
      },
    ),
    GoRoute(
      path: Screen.cameraList.path,
      builder: (context, state) =&gt; const CameraListPage(),
    ),
    GoRoute(
      path: Screen.notificationList.path,
      builder: (context, state) =&gt; const NotificationListPage(),
    ),
    GoRoute(
      path: Screen.wallet.path,
      builder: (context, state) =&gt; const WalletPage(),
    ),
    GoRoute(
      path: Screen.gpt.path,
      builder: (context, state) =&gt; const GptPage(),
    ),
    GoRoute(
      path: Screen.spotList.path,
      builder: (context, state) =&gt; const SpotListPage(),
    ),
    GoRoute(
      path: Screen.spotDetail.path,
      builder: (context, state) {
        final spotId = state.extra as String? ?? '';
        return SpotDetailPage(spotId: spotId);
      },
    ),
    GoRoute(
      path: Screen.shootableSpotDetail.path,
      builder: (context, state) {
        final spotId = state.extra as String? ?? '';
        return ShootableSpotDetailPage(spotId: spotId);
      },
    ),
    GoRoute(
      path: Screen.shooting.path,
      builder: (context, state) =&gt; const ShootingPage(),
    ),
    GoRoute(
      path: Screen.weaveSpot.path,
      builder: (context, state) =&gt; const WeaveSpotPage(),
    ),
    GoRoute(
      path: Screen.flagList.path,
      builder: (context, state) {
        final spotId = state.extra as String? ?? '';
        return FlagListPage(spotId: spotId);
      },
    ),
    GoRoute(
      path: Screen.guildCreate.path,
      builder: (context, state) =&gt; const GuildCreatePage(),
    ),
    GoRoute(
      path: Screen.guildCode.path,
      builder: (context, state) =&gt; const GuildCodePage(),
    ),
    GoRoute(
      path: Screen.guildRequest.path,
      builder: (context, state) {
        final guildId = state.extra as String? ?? '';
        return GuildRequestPage(guildId: guildId);
      },
    ),
    GoRoute(
      path: Screen.guildManage.path,
      builder: (context, state) =&gt; const GuildManagePage(),
    ),
    StatefulShellRoute.indexedStack(
      builder: (context, state, navigationShell) =&gt;
          TabPage(navigationShell: navigationShell),
      branches: [
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: Screen.map.path,
              builder: (context, state) =&gt; const MapPage(),
            ),
          ],
        ),
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: Screen.guild.path,
              builder: (context, state) =&gt; const GuildPage(),
            ),
          ],
        ),
      ],
    ),
  ],
);

import 'package:snpit_guild_app/utils/extensions/string_extensions.dart';

enum Screen {
  debugMenu,
  debugUtility,
  debugDeviceInfo,
  debugLocalization,
  textEditing,
  login,
  verificationCode,
  myPage,
  setting,
  deckDetail,
  cameraList,
  notificationList,
  wallet,
  gpt,
  spotList,
  spotDetail,
  ourSpotDetail,
  flagList,
  shootableSpotDetail,
  shooting,
  weaveSpot,
  guildCreate,
  guildCode,
  guildRequest,
  guildManage,
  map,
  guild,
}

extension ScreenRouteExtension on Screen {
  // 表示名（スペース区切りのタイトルケース）
  String get displayName =&gt; name.toTitleCase();

  // パス（キャメルケースからアンダースコアに変換）
  String get path =&gt; '/${name.camelToSnakeCase()}';
}


import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:snpit_guild_app/domain/design/color_token.dart';
import 'package:snpit_guild_app/domain/screen.dart';
import 'package:snpit_guild_app/gen/assets.gen.dart';
import 'package:snpit_guild_app/presentation/extensions/font_weight_extensions.dart';
import 'package:snpit_guild_app/presentation/pages/explorer_list_page.dart';
import 'package:snpit_guild_app/presentation/pages/shootable_spot_detail_page.dart';
import 'package:snpit_guild_app/presentation/providers/access_token.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/wallet/get_wallet.dart';
import 'package:snpit_guild_app/presentation/providers/should_logout.dart';
import 'package:snpit_guild_app/presentation/providers/should_refresh_guild.dart';
import 'package:snpit_guild_app/presentation/providers/should_refresh_map_spot.dart';
import 'package:snpit_guild_app/presentation/providers/show_explorer_list.dart';
import 'package:snpit_guild_app/presentation/providers/show_force_update.dart';
import 'package:snpit_guild_app/presentation/providers/show_maintenance.dart';
import 'package:snpit_guild_app/presentation/providers/show_our_spot_detail.dart';
import 'package:snpit_guild_app/presentation/providers/show_shootable_spot_detail.dart';
import 'package:snpit_guild_app/presentation/providers/show_spot_list.dart';
import 'package:snpit_guild_app/presentation/router/spot_list_router.dart';
import 'package:snpit_guild_app/presentation/theme/app_theme.dart';
import 'package:snpit_guild_app/utils/show_dialog_utils.dart';
import 'package:snpit_guild_app/utils/snack_bar_utils.dart';

class TabPage extends HookConsumerWidget {
  const TabPage({required this.navigationShell, super.key});
  final StatefulNavigationShell navigationShell;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    void showShootableSpotDetailSheet(String spotId) {
      showModalBottomSheet&lt;void&gt;(
        context: context,
        isScrollControlled: true,
        builder: (context) {
          return FractionallySizedBox(
            heightFactor: 0.7,
            child: ClipRRect(
              borderRadius: const BorderRadius.vertical(
                top: Radius.circular(16),
              ),
              child: ShootableSpotDetailPage(
                spotId: spotId,
              ),
            ),
          );
        },
      ).then((_) {
        ref.read(showShootableSpotDetailNotifierProvider.notifier).hide();
      });
    }

    void showExploreListSheet() {
      showModalBottomSheet&lt;void&gt;(
        context: context,
        isScrollControlled: true,
        builder: (context) {
          return const FractionallySizedBox(
            heightFactor: 0.5,
            child: ClipRRect(
              borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
              child: ExplorerListPage(),
            ),
          );
        },
      ).then((_) {
        ref.read(showExplorerListNotifierProvider.notifier).hide();
      });
    }

    void showSpotListSheet() {
      // sheet が立ち上がるタイミングで最初の画面にリセットしないと、sheet を表示したときに前回閉じた画面が表示される
      spotListRouter.go(Screen.spotList.path);

      showModalBottomSheet&lt;void&gt;(
        context: context,
        isScrollControlled: true,
        builder: (context) {
          return FractionallySizedBox(
            heightFactor: 0.7,
            child: ClipRRect(
              borderRadius:
                  const BorderRadius.vertical(top: Radius.circular(16)),
              child: MaterialApp.router(
                theme: appTheme,
                routerConfig: spotListRouter,
                debugShowCheckedModeBanner: false,
              ),
            ),
          );
        },
      ).then((_) {
        ref.read(showSpotListNotifierProvider.notifier).hide();
      });
    }

    void showOurSpotDetailSheet(String spotId) {
      // sheet が立ち上がるタイミングで最初の画面にリセットしないと、sheet を表示したときに前回閉じた画面が表示される
      spotListRouter.go(
        Screen.ourSpotDetail.path,
        extra: spotId,
      );

      showModalBottomSheet&lt;void&gt;(
        context: context,
        isScrollControlled: true,
        builder: (context) {
          return FractionallySizedBox(
            heightFactor: 0.7,
            child: ClipRRect(
              borderRadius:
                  const BorderRadius.vertical(top: Radius.circular(16)),
              child: MaterialApp.router(
                theme: appTheme,
                routerConfig: spotListRouter,
                debugShowCheckedModeBanner: false,
              ),
            ),
          );
        },
      ).then((_) {
        ref.read(showOurSpotDetailNotifierProvider.notifier).hide();
      });
    }

    Future&lt;void&gt; showSessionExpiredDialog() async {
      Future&lt;void&gt; onTapOk() async {
        if (context.mounted) {
          context.go(Screen.login.path);
        }
      }

      return showDialog&lt;void&gt;(
        context: context,
        barrierDismissible: false,
        builder: (BuildContext context) {
          return AlertDialog(
            title: const Text('Session Expired'),
            content: const Text(
              'Your session has expired. Please log in again.',
            ),
            actions: &lt;Widget&gt;[
              TextButton(
                onPressed: () async {
                  await onTapOk();
                },
                child: const Text('OK'),
              ),
            ],
          );
        },
      );
    }

    ref
      ..listen&lt;int&gt;(shouldLogoutNotifierProvider, (previous, next) async {
        // アクセストークンを削除
        await ref.read(accessTokenNotifierProvider.notifier).delete();

        // ダイアログを出してログイン画面に遷移
        await showSessionExpiredDialog();
      })
      ..listen&lt;int&gt;(showMaintenanceNotifierProvider, (previous, next) async {
        showMaintenanceDialog(context);
      })
      ..listen&lt;int&gt;(showForceUpdateNotifierProvider, (previous, next) async {
        showForceUpdateDialog(context);
      })
      ..listen&lt;String?&gt;(showShootableSpotDetailNotifierProvider,
          (previous, next) {
        if (next != null) {
          showShootableSpotDetailSheet(next);
        }
      })
      ..listen&lt;bool&gt;(showExplorerListNotifierProvider, (previous, next) {
        if (next) {
          showExploreListSheet();
        }
      })
      ..listen&lt;bool&gt;(showSpotListNotifierProvider, (previous, next) {
        if (next) {
          showSpotListSheet();
        }
      })
      ..listen&lt;String?&gt;(showOurSpotDetailNotifierProvider, (previous, next) {
        if (next != null) {
          showOurSpotDetailSheet(next);
        }
      });

    final walletAsyncValue = ref.watch(getWalletNotifierProvider);

    useEffect(
      () {
        Future.microtask(() async {
          try {
            await ref.read(getWalletNotifierProvider.notifier).getWallet();
          } on Exception catch (error) {
            if (context.mounted) {
              showErrorSnackBar(context, error);
            }
          }
        });
        return null;
      },
      [],
    );

    return Scaffold(
      appBar: AppBar(
        leadingWidth: 100,
        leading: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            IconButton(
              icon: const Icon(Icons.person),
              onPressed: () {
                context.push(Screen.myPage.path);
              },
            ),
            // TODO: [フェーズ2] 通知機能の実装
            // IconButton(
            //   icon: const Icon(Icons.notifications),
            //   onPressed: () {
            //     context.push(Screen.notificationList.path);
            //   },
            // ),
          ],
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16),
            child: Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: () async {
                  await context.push(Screen.wallet.path);
                },
                borderRadius: BorderRadius.circular(4),
                child: Ink(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    color: ColorToken.bgLight,
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Row(
                    children: [
                      Image.asset(
                        Assets.images.stpCoinIcon.path,
                        width: 20,
                        height: 20,
                      ),
                      const SizedBox(width: 4),
                      walletAsyncValue.when(
                        data: (wallet) {
                          final stpValue = wallet?.stpAmount ?? 0;
                          return Text(
                            stpValue.toString(),
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeightX.semiBold,
                            ),
                          );
                        },
                        loading: () {
                          return Text(
                            '  ',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeightX.semiBold,
                            ),
                          );
                        },
                        error: (error, _) {
                          return Text(
                            '  ',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeightX.semiBold,
                            ),
                          );
                        },
                      ),
                      const SizedBox(width: 2),
                      const Text(
                        'STP',
                        style: TextStyle(fontSize: 10),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
      body: navigationShell,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: navigationShell.currentIndex,
        onTap: (index) {
          if (navigationShell.currentIndex == index) {
            // 同じタブをタップした場合はリフレッシュを行う
            if (index == 0) {
              // Map タブのタップをトリガーにマップの更新を行う
              ref.read(shouldRefreshMapSpotNotifierProvider.notifier).trigger();
            } else if (index == 1) {
              // Guild タブのタップをトリガーにギルドの更新を行う
              ref.read(shouldRefreshGuildNotifierProvider.notifier).trigger();
            }
          }
          navigationShell.goBranch(index);
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(
              Icons.public,
              size: 24,
            ),
            label: 'Map',
          ),
          BottomNavigationBarItem(
            icon: Icon(
              Icons.shield_outlined,
              size: 24,
            ),
            label: 'Guild',
          ),
        ],
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:snpit_guild_app/domain/design/color_pallet.dart';
import 'package:snpit_guild_app/domain/design/color_token.dart';
import 'package:snpit_guild_app/domain/screen.dart';
import 'package:snpit_guild_app/gen/assets.gen.dart';
import 'package:snpit_guild_app/infrastructure/entities/extensions/camera_dto_x.dart';
import 'package:snpit_guild_app/infrastructure/snapit_guild_api/snapit_guild_api.openapi.dart';
import 'package:snpit_guild_app/presentation/extensions/font_weight_extensions.dart';

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
    // TODO: [GPT] ギルドの所持GPTを表示する
    final gptValue = guild.guildMembersCount ?? 0;
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
                      gptValue: gptValue,
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
                        dividerColor: ColorToken.defaultBorder,
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
                        unselectedLabelColor: ColorToken.defaultBorder,
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
    required this.gptValue,
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
  final num gptValue;
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
                color: ColorToken.defaultBorder,
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
                      color: ColorToken.defaultBorder,
                      borderRadius: BorderRadius.only(
                        bottomLeft: Radius.circular(12),
                        bottomRight: Radius.circular(12),
                      ),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(
                          Icons.shield_outlined,
                          size: 24,
                          color: ColorToken.text,
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
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
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
                    const SizedBox(width: 32),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Image.asset(
                          Assets.images.gptCoinIcon.path,
                          height: 24,
                          width: 24,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          NumberFormat('#,###').format(gptValue),
                          style: const TextStyle(fontSize: 14),
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 16),
                  child: Divider(
                    color: ColorToken.defaultBorder,
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
                              style: TextStyle(
                                fontWeight: FontWeightX.semiBold,
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

    // +1 することで、末尾の一つを「フッター（ボタン置き場）」用として追加
    final itemCount = filteredGuildMemberList.length + 1;

    return ListView.builder(
      physics: const AlwaysScrollableScrollPhysics(),
      itemCount: itemCount,
      itemBuilder: (context, index) {
        if (index &lt; filteredGuildMemberList.length) {
          final guildMember = filteredGuildMemberList[index];
          final userName = guildMember.username ?? '';
          final isGuildOwner = guildMember.role == GuildMemberDtoRole.ADMIN ||
              guildMember.role == GuildMemberDtoRole.OWNER;
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
                  color: ColorToken.defaultBorder,
                ),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    Expanded(
                      child: GuildMemberColumn(
                        userName: userName,
                        isGuildOwner: isGuildOwner,
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
        } else {
          // Column で表現するとレイアウトが崩れるため else で分岐
          return Padding(
            padding: const EdgeInsets.only(top: 24, bottom: 24),
            child: OutlinedButton(
              onPressed: isLoadingState.value
                  ? null
                  : () async {
                      await onTapWithdrawGuild();
                    },
              child: const Text('Withdraw from the guild'),
            ),
          );
        }
      },
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
        Text(
          'No guild affiliation',
          style: TextStyle(
            fontSize: 28,
            fontWeight: FontWeightX.semiBold,
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
            border: Border.all(
              color: ColorToken.defaultBorder,
            ),
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
            border: Border.all(
              color: ColorToken.defaultBorder,
            ),
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

## 🔧 Tool
*2025-02-15 10:51:28*

**問題の発見と解決策の模索**

現在、`GoRouter` を使用しているが、"Guild" タブをカバーしながら、新しいルートを追加している。これにより、ユーザーはタブを失うことなく新しいページを見ている。

**ルートの修正を検討**

`StatefulShellBranch` を編集し、二つ目のタブのルート内にネストされたサブルートを追加。これにより、サブページがナビゲーションバーを保持するようになっている。

**ルート修正の必要性**

二つ目のタブのルート内にネストされたサブルートを追加し、ナビゲーションバーを保持する方法を見つけている。これにより、サブページのナビゲーションバーが維持される。

**ルートの最適化を模索中**

`GoRoute` を二つ目のタブ内に移動し、スクリーンやパスの定義を再評価して、サブルートとの競合を回避しつつ、ナビゲーションバーを維持している。

**ルートの整理とナビゲーションの工夫**

`'guild_manage'` パスを採用して、ルートを整理し、ナビゲーションバーを維持しつつ、サブルートとの競合を回避している。このアプローチは効果的に感じられる。

**ルートの整理とナビゲーションの工夫**

`StatefulShellBranch` 内にネストされたサブルートを定義し、`context.push('${Screen.guild.path}/manage')` を使って `GuildManagePage` にナビゲートし、ナビゲーションバーを維持している。

**ルートのネストを活用**

更新された `router` 定義を提示して、動的なルートの変更やナビゲーションバーの維持に関するステップバイステップの説明やコードスニペットを提供している。

---

## 🤖 Assistant
*2025-02-15 10:51:28*

Flutter/GoRouter で「BottomNavigationBar 付きのままタブ内でさらに画面遷移をしたい」場合、**ポイントは「タブ用の `StatefulShellRoute` の配下にサブルートとして画面を定義し、そこへ `context.push()` する」**ことです。

---

## なぜ BottomNavigationBar が消えるのか

現状、`/guildManage` や `/guildCode` 等をトップレベルの `GoRoute` として定義しているため、

```dart
GoRoute(
  path: Screen.guildManage.path, // -> '/guild_manage'
  builder: (context, state) => const GuildManagePage(),
),
...
```

`GuildPage`（タブページ）配下から `context.push('/guild_manage')` とすると、**「TabPage を含む `StatefulShellRoute` ごと新しいスタックに差し替わる」** ため、せっかくの `BottomNavigationBar` が消えてしまいます。

---

## 解決策：タブのサブルートとして定義する

ギルドタブ内の画面遷移（GuildManagePage・GuildCodePage・GuildCreatePage など）を「タブ 2 枚目 (Guild タブ) の配下」に組み込みましょう。  
具体的には、現在 `router` でやっている

```dart
StatefulShellRoute.indexedStack(
  builder: (context, state, navigationShell) => TabPage(navigationShell: navigationShell),
  branches: [
    // タブ1
    StatefulShellBranch(
      routes: [
        GoRoute(
          path: Screen.map.path, // => '/map'
          builder: (context, state) => const MapPage(),
        ),
      ],
    ),
    // タブ2
    StatefulShellBranch(
      routes: [
        GoRoute(
          path: Screen.guild.path, // => '/guild'
          builder: (context, state) => const GuildPage(),
        ),
      ],
    ),
  ],
);
```

ここの **「タブ2」の配下にサブルートを置く** ことで、`/guild/...` 以下の画面は「タブ2を維持したまま push できる」ようになります。

### 1. 不要になったトップレベルのルートを削除/移動

まずトップレベルに定義している

```dart
GoRoute(
  path: Screen.guildManage.path, // => '/guild_manage'
  builder: (context, state) => const GuildManagePage(),
),
GoRoute(
  path: Screen.guildCode.path, // => '/guild_code'
  builder: (context, state) => const GuildCodePage(),
),
GoRoute(
  path: Screen.guildCreate.path, // => '/guild_create'
  builder: (context, state) => const GuildCreatePage(),
),
```

などを削除します。  
(すでにタブ内部から `context.push(Screen.guildManage.path)` しているコードがある場合は、のちほどパスも修正します)

### 2. サブルートを定義する

削除した代わりに、**ギルドタブのブランチ (StatefulShellBranch) 内** で、`/guild` 配下のルートとして再定義します。  
例として以下のようにすると、最終的に

- `/guild/manage` → GuildManagePage
- `/guild/code` → GuildCodePage
- `/guild/create` → GuildCreatePage

という下層画面が「タブ2の配下で」表示できるようになります。

```dart
StatefulShellRoute.indexedStack(
  builder: (context, state, navigationShell) => TabPage(navigationShell: navigationShell),
  branches: [
    // ----- タブ1 -----
    StatefulShellBranch(
      routes: [
        GoRoute(
          path: Screen.map.path, // => '/map'
          builder: (context, state) => const MapPage(),
        ),
      ],
    ),
    // ----- タブ2 -----
    StatefulShellBranch(
      routes: [
        // ギルドのメインページ (タブ2のホーム)
        GoRoute(
          path: Screen.guild.path, // => '/guild'
          builder: (context, state) => const GuildPage(),
          routes: [
            // ここから先が「ギルドタブ配下のサブページ」
            GoRoute(
              path: 'manage', // 最終的なURLは '/guild/manage'
              builder: (context, state) => const GuildManagePage(),
            ),
            GoRoute(
              path: 'code',   // '/guild/code'
              builder: (context, state) => const GuildCodePage(),
            ),
            GoRoute(
              path: 'create', // '/guild/create'
              builder: (context, state) => const GuildCreatePage(),
            ),
          ],
        ),
      ],
    ),
  ],
);
```

### 3. 実際の画面遷移コードを修正

サブルート化した結果、`context.push(Screen.guildManage.path)` のように「パス自体が `/guild_manage`」のままではマッチしなくなるので、

```dart
// 変更前
context.push(Screen.guildManage.path); 
// => '/guild_manage'
```

を

```dart
// 変更後
context.push('${Screen.guild.path}/manage'); 
// => '/guild/manage'
```

のように修正してください（`guildCode` や `guildCreate` も同様）。  
こうすることで、**ギルドタブを保持したまま画面をプッシュ**し、BottomNavigationBar が残った状態で下層ページを遷移できるようになります。

---

## まとめ

- **タブを保持したまま画面遷移したい場合は、`StatefulShellRoute` のブランチ配下にサブルートを置く**  
- ルート定義も `子ルート (GoRoute.routes)` で指定する
- 実際の `push` パス指定も `'/guild/manage'` のように「親パス + 子パス」にあわせて修正する

このようにすれば、「ギルドタブ上で `context.push(...)` した場合でも `BottomNavigationBar` が消えずに画面を重ねる」挙動を実現できます。

---

## 👤 User
*2025-02-15 11:00:08*

文字列をtypoしないようにScreenで定義したい。

---

## 🔧 Tool
*2025-02-15 11:00:26*

**提案を検討中**

ユーザーは`Screen.guild.path + "/manage"`のままにしてタイプミスを防ぎたいと考えている。`Screen.guildManagePath`や`Screen.guildChild.manage.path`のようにサブパスを定義し、`'${Screen.guild.path}/${GuildSubScreen.manage.path}'`を使用する案を検討している。

**サブパスの作成**

ユーザーは`Screen`列挙型のサブパスを定義している。`ScreenRouteExtension`内で`guildSub`を使い、`GuildSub`列挙型の`path`を取得している。

**再定義している**

`Screen`の`managePath`, `createPath`, `codePath`を新しい拡張機能で定義し、`context.push(Screen.guild.managePath);`のように使用している。

---

## 🤖 Assistant
*2025-02-15 11:00:26*

BottomNavigationBar 付きのタブ配下にさらにサブルートを生やすとき、  
`context.push('${Screen.guild.path}/manage')` のような文字列結合だとタイポしやすくメンテナンスが大変です。  
**そこで「サブ画面のパス」も含めて `Screen` (もしくは拡張) に定義** しておくと、IDE補完が効いてタイポを防ぎやすくなります。

---

## 例1: `Screen.guild` に対して拡張メソッドでサブパスを生やす

`Screen` はすでに `extension ScreenRouteExtension on Screen { ... }` がありますので、  
同じ拡張の中に「`guild` 用のサブパス」を返すプロパティを追加しておく方法です。

```dart
enum Screen {
  // 既存
  guild,
  guildManage,
  guildCode,
  guildCreate,
  // ...
}

extension ScreenRouteExtension on Screen {
  // もともとのルート定義
  String get path => '/${name.camelToSnakeCase()}';

  /// 例: /guild/manage
  String get managePath {
    if (this != Screen.guild) {
      throw Exception('managePath は Screen.guild のためだけに使います');
    }
    return '$path/manage';
  }

  /// 例: /guild/code
  String get codePath {
    if (this != Screen.guild) {
      throw Exception('codePath は Screen.guild のためだけに使います');
    }
    return '$path/code';
  }

  /// 例: /guild/create
  String get createPath {
    if (this != Screen.guild) {
      throw Exception('createPath は Screen.guild のためだけに使います');
    }
    return '$path/create';
  }
}
```

こうしておけば、**`Screen.guild.managePath` などと書けば必ず `/guild/manage` が得られる** ため、単純な文字列結合よりタイポしづらくなります。

### 使い方

```dart
onPressed: () {
  context.push(Screen.guild.managePath);
  //       あるいは
  // context.push(Screen.guild.codePath);
  // context.push(Screen.guild.createPath);
}
```

---

## 例2: サブ画面を新しい enum で管理する

もし「ギルド配下のサブ画面が増えそう」「サブ画面同士で命名を整理したい」という場合は、  
`GuildSubScreen` などの enum を分けて管理する方法もあります。

```dart
/// ギルド配下専用のサブ画面を列挙
enum GuildSubScreen {
  manage,
  code,
  create,
}

/// それぞれのサブ画面パスを返す拡張
extension GuildSubScreenExtension on GuildSubScreen {
  String get path {
    switch (this) {
      case GuildSubScreen.manage:
        // Screen.guild.path == '/guild' を想定
        return '${Screen.guild.path}/manage';
      case GuildSubScreen.code:
        return '${Screen.guild.path}/code';
      case GuildSubScreen.create:
        return '${Screen.guild.path}/create';
    }
  }

  /// 画面タイトルなど他の付随情報もまとめる場合
  String get displayName {
    switch (this) {
      case GuildSubScreen.manage:
        return 'Manage Guild';
      case GuildSubScreen.code:
        return 'Join by Code';
      case GuildSubScreen.create:
        return 'Create Guild';
    }
  }
}
```

### 使い方

```dart
// ギルド管理画面へ
onPressed: () => context.push(GuildSubScreen.manage.path);

// ギルドコード入力画面へ
onPressed: () => context.push(GuildSubScreen.code.path);
```

こうすると、**enum としてサブ画面をひとまとめに管理**できるため、画面が増えても見通しが良くなります。

---

## まとめ

- **サブルートのパスを直接文字列結合する代わりに、`Screen` や専用 enum の拡張 (extension) でプロパティ化する**  
  - `Screen.guild.managePath` / `GuildSubScreen.manage.path` のように書け、**IDE 補完＆コンパイル時チェックが効いてタイポを防止**できる
- これにより、「`/guild/manage`」とハードコーディングするよりも安全・リファクタリングしやすいコードが書けます。

---

## 👤 User
*2025-02-15 11:07:21*

そうではなくて、String get path で nameを使わないように修正して、以下の4つだけswitch で適切な文字列を設定してあげれば、routerの定義でもpush時の指定でもtypoせずに済むのではないかな？

  guildCreate,
  guildCode,
  guildRequest,
  guildManage,


ちなみにdisplayNameはデバッグ時に使っているだけなので、今のままで良い。

extension ScreenRouteExtension on Screen {
  // 表示名（スペース区切りのタイトルケース）
  String get displayName =&gt; name.toTitleCase();

  // パス（キャメルケースからアンダースコアに変換）
  String get path =&gt; '/${name.camelToSnakeCase()}';
}

extension StringExtensions on String {
  // キャメルケースをアンダースコアに変換
  String camelToSnakeCase() {
    return replaceAllMapped(
      RegExp(r'([a-z])([A-Z])'),
      (match) =&gt; '${match.group(1)}_${match.group(2)?.toLowerCase()}',
    ).toLowerCase();
  }

  // キャメルケースをスペース区切りにし、タイトルケースに変換
  String toTitleCase() {
    final words = split(RegExp(r'(?=[A-Z])'));
    return words.map((word) =&gt; word.capitalize()).join(' ');
  }

  // 先頭文字を大文字にして残りを小文字にする
  String capitalize() {
    if (isEmpty) {
      return this;
    }
    return this[0].toUpperCase() + substring(1).toLowerCase();
  }
}

---

## 🔧 Tool
*2025-02-15 11:07:30*

**ルートの選択肢を絞る**

特定の4つのルートに絞り、残りは元のロジックを保持する方法を模索している。

---

## 🤖 Assistant
*2025-02-15 11:07:30*

もし特定のルート（`guildCreate`, `guildCode`, `guildRequest`, `guildManage` の4つ）だけはパスをベタ書きし、それ以外は `name.camelToSnakeCase()` による自動生成で良い、というのであれば、**`Screen` の拡張に `switch` を書いて分岐**させるのがシンプルです。

---

## 実装例

```dart
extension ScreenRouteExtension on Screen {
  String get path {
    switch (this) {
      case Screen.guildCreate:
        return '/guild/create';
      case Screen.guildCode:
        return '/guild/code';
      case Screen.guildRequest:
        return '/guild/request';
      case Screen.guildManage:
        return '/guild/manage';

      // 上記以外はこれまでのキャメル→スネークケース変換を使う
      default:
        return '/${name.camelToSnakeCase()}';
    }
  }

  // 表示名（デバッグ用などで利用）
  String get displayName => name.toTitleCase();
}
```

これで

- `Screen.guildCreate.path` → `'/guild/create'`
- `Screen.guildCode.path`   → `'/guild/code'`
- `Screen.guildRequest.path`→ `'/guild/request'`
- `Screen.guildManage.path` → `'/guild/manage'`

と、**4つだけ好きな文字列に固定**し、それ以外は既存ロジック（`'/${name.camelToSnakeCase()}'`）にフォールバックできます。

---

## 使い方

上記のように実装すれば、ルーター側でも `path: Screen.guildManage.path` のように書くことで**文字列の打ち間違いを防止**できますし、実際に画面を遷移するときにも

```dart
onPressed: () => context.push(Screen.guildManage.path);
```

のように書くだけで OK です。

---

## 👤 User
*2025-02-15 11:10:17*

guildCode から guildRequest へボトムのナビゲーションを残しながらpush遷移したいのだけれどもどうすればいいかな

---

## 🔧 Tool
*2025-02-15 11:10:39*

**ルートの選択肢を探る**

`guildCode` から `guildRequest` への遷移を検討している。`StatefulShellRoute.indexedStack`の子ルートとして保持し、ボトムナビゲーションを維持している。

**ナビゲーション選択肢の探求**

トップレベルのルートや他のブランチの場合、ボトムナビゲーションは維持できない。相対ナビゲーションを試みるが、ルートの構造に依存する。

**ルート構造を探る**

ユーザーが `GuildCodePage` にいる場合、ボトムナビゲーションを維持しつつ `GuildRequestPage` への遷移をどう実現するかを考慮中。

**ナビゲーション方法の工夫**

`relative navigation` で `code` と `request` の関係を保つか、`absolute path` で `guildRequestPage` への完全なルートを推奨する。

**特定のルートの確認**

`guildRequest` が `guild` ブランチの子ルートであることを確認し、`context.push(Screen.guildRequest.path)` を使用している。

**ステップを踏む**

`guildRequest` が `guildCode` と同じブランチの子ルートであることを確認し、`context.push('/guild/request')` でナビゲーションを行うことが推奨されている。

---

## 🤖 Assistant
*2025-02-15 11:10:39*

Flutter/GoRouter で「**`guildCode` 画面から `guildRequest` 画面へ、BottomNavigationBar を維持したまま push で遷移したい**」場合、  
**最も重要なのは**「`guildCode` と `guildRequest` が **同じ `StatefulShellBranch` 配下（同じタブ配下）** にある」ことです。

以下のように **タブ2** のルート定義（例）を見直し、

```dart
// 例: 2つのタブを持つ StatefulShellRoute
StatefulShellRoute.indexedStack(
  builder: (context, state, navigationShell) => TabPage(navigationShell: navigationShell),
  branches: [
    // --- タブ1 ---
    StatefulShellBranch(
      routes: [
        GoRoute(
          path: '/map',
          builder: (context, state) => const MapPage(),
        ),
      ],
    ),

    // --- タブ2 (guildタブ) ---
    StatefulShellBranch(
      routes: [
        GoRoute(
          path: '/guild',
          builder: (context, state) => const GuildPage(),
          routes: [
            GoRoute(
              path: 'code', // => '/guild/code'
              builder: (context, state) => const GuildCodePage(),
            ),
            GoRoute(
              path: 'request', // => '/guild/request'
              builder: (context, state) => const GuildRequestPage(),
            ),
            // 必要なら他にもサブ画面を置く
            GoRoute(
              path: 'create', // => '/guild/create'
              builder: (context, state) => const GuildCreatePage(),
            ),
            GoRoute(
              path: 'manage', // => '/guild/manage'
              builder: (context, state) => const GuildManagePage(),
            ),
          ],
        ),
      ],
    ),
  ],
);
```

上記のように**「`code` と `request` が、同じ `/guild` の子ルートとして定義」**されているなら、  
`guildCode` (=`/guild/code`) から `guildRequest` (=`/guild/request`) へ **同じタブ内で push** が可能になります。

```dart
// GuildCodePage などから push
onPressed: () {
  // Screen.guildRequest.path が '/guild/request' を返すようになっていればOK
  context.push(Screen.guildRequest.path);
}
```

これで、**BottomNavigationBar を残したまま** `/guild/code` → `/guild/request` へ画面遷移することが可能です。

---

## うまく行かない場合のチェックポイント

1. **`guildRequest` のルート定義がトップレベルにある**  
   ```dart
   // NG: こうしていると /guild_request がタブ外（トップ）扱いになる
   GoRoute(
     path: Screen.guildRequest.path, // => '/guild_request'
     builder: ...
   ),
   ```
   このようにタブとは無関係のトップルートだと、  
   `guildCode` から push しても「別の階層」に行ってしまい BottomNavigationBar が消えます。

2. **`Screen.guildRequest.path` が正しく `'/guild/request'` になっていない**  
   拡張メソッドや `switch` でパスを上書きしているなら、  
   そこを確認して **`/guild/request`** という文字列を返しているかをチェックしましょう。

以上を満たすことで、「**同じタブ配下の下層画面**」として遷移が行われ、  
BottomNavigationBar が残った状態で画面を重ねられるようになります。

---

## 👤 User
*2025-02-15 11:48:57*

{
  "content_type": "image_asset_pointer",
  "asset_pointer": "file-service://file-JkwBiMAUC3BP57oSZAnKX9",
  "size_bytes": 564703,
  "width": 740,
  "height": 1532,
  "fovea": null,
  "metadata": {
    "dalle": null,
    "gizmo": null,
    "generation": null,
    "container_pixel_height": null,
    "container_pixel_width": null,
    "emu_omit_glimpse_image": null,
    "emu_patches_override": null,
    "sanitized": true,
    "asset_pointer_link": null,
    "watermarked_asset_pointer": null
  }
}
このようにTabPageのヘッダーとGuildManagePageのヘッダーが2つとも残り続けてしまっている。
これが1つしか存在しない様にするにはどうすればいいのか？

import 'package:flutter/rendering.dart';
import 'package:go_router/go_router.dart';
import 'package:snpit_guild_app/domain/screen.dart';
import 'package:snpit_guild_app/presentation/pages/camera_list_page.dart';
import 'package:snpit_guild_app/presentation/pages/debug_device_info_page.dart';
import 'package:snpit_guild_app/presentation/pages/debug_localization_page.dart';
import 'package:snpit_guild_app/presentation/pages/debug_menu_page.dart';
import 'package:snpit_guild_app/presentation/pages/debug_utility_page.dart';
import 'package:snpit_guild_app/presentation/pages/deck_detail_page.dart';
import 'package:snpit_guild_app/presentation/pages/flag_list_page.dart';
import 'package:snpit_guild_app/presentation/pages/gpt_page.dart';
import 'package:snpit_guild_app/presentation/pages/guild_code_page.dart';
import 'package:snpit_guild_app/presentation/pages/guild_create_page.dart';
import 'package:snpit_guild_app/presentation/pages/guild_manage_page.dart';
import 'package:snpit_guild_app/presentation/pages/guild_page.dart';
import 'package:snpit_guild_app/presentation/pages/guild_request_page.dart';
import 'package:snpit_guild_app/presentation/pages/login_page.dart';
import 'package:snpit_guild_app/presentation/pages/map_page.dart';
import 'package:snpit_guild_app/presentation/pages/my_page.dart';
import 'package:snpit_guild_app/presentation/pages/notification_list_page.dart';
import 'package:snpit_guild_app/presentation/pages/setting_page.dart';
import 'package:snpit_guild_app/presentation/pages/shootable_spot_detail_page.dart';
import 'package:snpit_guild_app/presentation/pages/shooting_page.dart';
import 'package:snpit_guild_app/presentation/pages/spot_detail_page.dart';
import 'package:snpit_guild_app/presentation/pages/spot_list_page.dart';
import 'package:snpit_guild_app/presentation/pages/tab_page.dart';
import 'package:snpit_guild_app/presentation/pages/text_editing_page.dart';
import 'package:snpit_guild_app/presentation/pages/verification_code_page.dart';
import 'package:snpit_guild_app/presentation/pages/wallet_page.dart';
import 'package:snpit_guild_app/presentation/pages/weave_spot_page.dart';

class TextEditingPageArgs {
  TextEditingPageArgs({
    required this.title,
    required this.text,
    required this.hintText,
    required this.onSave,
  });

  final String title;
  final String text;
  final String hintText;
  final void Function(String updatedText) onSave;
}

final GoRouter router = GoRouter(
  initialLocation: Screen.login.path,
  routes: [
    GoRoute(
      path: Screen.debugMenu.path,
      builder: (context, state) =&gt; const DebugMenuPage(),
    ),
    GoRoute(
      path: Screen.debugUtility.path,
      builder: (context, state) =&gt; const DebugUtilityPage(),
    ),
    GoRoute(
      path: Screen.debugDeviceInfo.path,
      builder: (context, state) =&gt; const DebugDeviceInfoPage(),
    ),
    GoRoute(
      path: Screen.debugLocalization.path,
      builder: (context, state) =&gt; const DebugLocalizationPage(),
    ),
    GoRoute(
      path: Screen.textEditing.path,
      builder: (context, state) {
        final args = state.extra as TextEditingPageArgs? ??
            TextEditingPageArgs(
              title: '',
              text: '',
              hintText: '',
              onSave: (updatedText) {
                debugPrint(updatedText);
              },
            );
        return TextEditingPage(
          title: args.title,
          text: args.text,
          hintText: args.hintText,
          onSave: args.onSave,
        );
      },
    ),
    GoRoute(
      path: Screen.login.path,
      builder: (context, state) =&gt; const LoginPage(),
    ),
    GoRoute(
      path: Screen.verificationCode.path,
      builder: (context, state) {
        final email = state.extra as String? ?? '';
        return VerificationCodePage(email: email);
      },
    ),
    GoRoute(
      path: Screen.myPage.path,
      builder: (context, state) =&gt; const MyPage(),
    ),
    GoRoute(
      path: Screen.setting.path,
      builder: (context, state) =&gt; const SettingPage(),
    ),
    GoRoute(
      path: Screen.deckDetail.path,
      builder: (context, state) {
        final deckId = state.extra as String? ?? '';
        return DeckDetailPage(deckId: deckId);
      },
    ),
    GoRoute(
      path: Screen.cameraList.path,
      builder: (context, state) =&gt; const CameraListPage(),
    ),
    GoRoute(
      path: Screen.notificationList.path,
      builder: (context, state) =&gt; const NotificationListPage(),
    ),
    GoRoute(
      path: Screen.wallet.path,
      builder: (context, state) =&gt; const WalletPage(),
    ),
    GoRoute(
      path: Screen.gpt.path,
      builder: (context, state) =&gt; const GptPage(),
    ),
    GoRoute(
      path: Screen.spotList.path,
      builder: (context, state) =&gt; const SpotListPage(),
    ),
    GoRoute(
      path: Screen.spotDetail.path,
      builder: (context, state) {
        final spotId = state.extra as String? ?? '';
        return SpotDetailPage(spotId: spotId);
      },
    ),
    GoRoute(
      path: Screen.shootableSpotDetail.path,
      builder: (context, state) {
        final spotId = state.extra as String? ?? '';
        return ShootableSpotDetailPage(spotId: spotId);
      },
    ),
    GoRoute(
      path: Screen.shooting.path,
      builder: (context, state) =&gt; const ShootingPage(),
    ),
    GoRoute(
      path: Screen.weaveSpot.path,
      builder: (context, state) =&gt; const WeaveSpotPage(),
    ),
    GoRoute(
      path: Screen.flagList.path,
      builder: (context, state) {
        final spotId = state.extra as String? ?? '';
        return FlagListPage(spotId: spotId);
      },
    ),
    StatefulShellRoute.indexedStack(
      builder: (context, state, navigationShell) =&gt;
          TabPage(navigationShell: navigationShell),
      branches: [
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: Screen.map.path,
              builder: (context, state) =&gt; const MapPage(),
            ),
          ],
        ),
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: Screen.guild.path,
              builder: (context, state) =&gt; const GuildPage(),
              routes: [
                GoRoute(
                  path: Screen.guildManage.branch,
                  builder: (context, state) =&gt; const GuildManagePage(),
                ),
                GoRoute(
                  path: Screen.guildCreate.branch,
                  builder: (context, state) =&gt; const GuildCreatePage(),
                ),
                GoRoute(
                  path: Screen.guildCode.branch,
                  builder: (context, state) =&gt; const GuildCodePage(),
                ),
                GoRoute(
                  path: Screen.guildRequest.branch,
                  builder: (context, state) {
                    final guildId = state.extra as String? ?? '';
                    return GuildRequestPage(guildId: guildId);
                  },
                ),
              ],
            ),
          ],
        ),
      ],
    ),

    // 以下は実際の遷移ではなくデバッグ用の遷移
    GoRoute(
      path: Screen.guildManage.debugPath,
      builder: (context, state) =&gt; const GuildManagePage(),
    ),
    GoRoute(
      path: Screen.guildCreate.debugPath,
      builder: (context, state) =&gt; const GuildCreatePage(),
    ),
    GoRoute(
      path: Screen.guildCode.debugPath,
      builder: (context, state) =&gt; const GuildCodePage(),
    ),
    GoRoute(
      path: Screen.guildRequest.debugPath,
      builder: (context, state) {
        final guildId = state.extra as String? ?? '';
        return GuildRequestPage(guildId: guildId);
      },
    ),
  ],
);

---

## 🤖 Assistant
*2025-02-15 11:49:15*

「TabPage 側の AppBar と、GuildManagePage 側の AppBar が重複してしまっている」原因は、  
**親 (`TabPage`) の Scaffold でも AppBar を定義している一方で、子 (`GuildManagePage` など) も Scaffold + AppBar を使っている**  
からです。Flutter では、親子いずれも Scaffold.appBar を定義すると**2 重に AppBar が表示**されてしまいます。

---

## 解決策の方針

**「1 つの画面で Scaffold を 2 つ定義しない」** ことが基本的な解決策です。  
アプリ構成によっては以下の 2 パターンのいずれかを採用することが多いです。

### パターン A: **親の `TabPage` は BottomNavigationBar のみを持ち、AppBar は持たない**

- 親 (`TabPage`) の `Scaffold` では **AppBar を削除**し、代わりに **BottomNavigationBar だけ**を配置
- 子ページ (`GuildManagePage` など) では `Scaffold` を使い、自由に AppBar を定義する

こうすれば、「タブバーは常に残り、AppBar は遷移先の各ページに個別に付ける」という形になり、AppBar が二重になることはありません。

#### 実装例

```dart
// 親: TabPage
class TabPage extends HookConsumerWidget {
  const TabPage({required this.navigationShell, super.key});
  final StatefulNavigationShell navigationShell;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // ★ AppBar は定義しない
    return Scaffold(
      // appBar: AppBar(...), ← これを削除する
      body: navigationShell,
      bottomNavigationBar: BottomNavigationBar(
        // ... 略 ...
      ),
    );
  }
}

// 子: GuildManagePage
class GuildManagePage extends StatelessWidget {
  const GuildManagePage({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // ここは自由にアプリバーを定義
      appBar: AppBar(
        title: const Text('Guild Management'),
      ),
      body: ...,
    );
  }
}
```

### パターン B: **親が「常に表示する」AppBar も管理し、子は基本的に Scaffold を使わない**

- 親 (`TabPage`) の `Scaffold` を使い、**AppBar と BottomNavigationBar 両方を常に表示**する
- 子ページは「単なる `Widget` or `Page`」として**Scaffold を使わず**、親の body に埋め込まれるだけにする  
  - もし子ページで画面タイトルや戻るボタンが必要なら、親の AppBar を動的に差し替える／あるいは子ページ内で `PreferredSizeWidget` をカスタマイズして上書きする、といった実装になる

この方法は「親のヘッダーを常に使い回し、子ページでも同じ AppBar レイアウトを保つ」といった設計をしたい場合に使われます。  
しかし各ページが独自の AppBar を使いにくくなるため、柔軟性は A より少なめです。

---

## おすすめはパターン A

実際のアプリでは、**「タブバーが常に下に残る」「各ページはそれぞれ AppBar を持つ」** という構成が多いため、パターン A が一般的です。

1. `TabPage` 側では `appBar` を削除して `bottomNavigationBar` のみを維持
2. 遷移先ページ (GuildManagePage など) で必要に応じて `Scaffold(appBar: ...)` を定義

これで AppBar が二重表示される問題は解消されます。

---

## 👤 User
*2025-02-16 00:44:37*

ありがとううまくいった。今度は別の話題になる。

今は仕方がなくワークアラウンドで2つのrouterを定義して、TabPage内でMaterialApp.routerを宣言しているがそれを使わない様にしたい。

なぜ使っているかの理由は、showModalBottomSheetの中でpush遷移したく、たとえば直接 SpotListPageを立ち上げてから context.push(Screen.spotDetail.path, extra: spotId); をすると showModalBottomSheet ではなく、全体でpush遷移してしまうからだ。

そのshowModalBottomSheet内でpush 遷移させたい。


また、以下のように2パターンの遷移がある。

遷移1
TabPage → showModalBottomSheet で SpotListPage → SpotDetailPage
→ OurSpotDetailPage → FlagListPage

遷移2
TabPage → showModalBottomSheet で OurSpotDetailPage → FlagListPage

どうにか、今の体験を維持したままMaterialApp.routerの宣言をTabPage内で行わない様にしたい。

できることなら spotListRouterの宣言はやめて、routerの宣言は一つに統一したい。

以下はソースコードである。

import 'package:snpit_guild_app/utils/extensions/string_extensions.dart';

enum Screen {
  debugMenu,
  debugUtility,
  debugDeviceInfo,
  debugLocalization,
  textEditing,
  login,
  verificationCode,
  myPage,
  setting,
  deckDetail,
  cameraList,
  notificationList,
  wallet,
  gpt,
  spotList,
  spotDetail,
  ourSpotDetail,
  flagList,
  shootableSpotDetail,
  shooting,
  weaveSpot,
  guildCreate,
  guildCode,
  guildRequest,
  guildManage,
  map,
  guild,
}

extension ScreenRouteExtension on Screen {
  String get branch {
    switch (this) {
      case Screen.guildManage:
        return 'manage';
      case Screen.guildCreate:
        return 'create';
      case Screen.guildCode:
        return 'code';
      case Screen.guildRequest:
        return 'request';

      // ignore: no_default_cases
      default:
        return '';
    }
  }

  String get path {
    switch (this) {
      case Screen.guildManage:
      case Screen.guildCreate:
      case Screen.guildCode:
      case Screen.guildRequest:
        return '${Screen.guild.path}/$branch';

      // ignore: no_default_cases
      default:
        return '/${name.camelToSnakeCase()}';
    }
  }

  String get debugPath {
    switch (this) {
      case Screen.guildManage:
      case Screen.guildCreate:
      case Screen.guildCode:
      case Screen.guildRequest:
        return '/$branch';

      // ignore: no_default_cases
      default:
        return path;
    }
  }

  // 表示名（デバッグ用などで利用）
  String get debugDisplayName =&gt; name.toTitleCase();
}

import 'package:flutter/rendering.dart';
import 'package:go_router/go_router.dart';
import 'package:snpit_guild_app/domain/screen.dart';
import 'package:snpit_guild_app/presentation/pages/camera_list_page.dart';
import 'package:snpit_guild_app/presentation/pages/debug_device_info_page.dart';
import 'package:snpit_guild_app/presentation/pages/debug_localization_page.dart';
import 'package:snpit_guild_app/presentation/pages/debug_menu_page.dart';
import 'package:snpit_guild_app/presentation/pages/debug_utility_page.dart';
import 'package:snpit_guild_app/presentation/pages/deck_detail_page.dart';
import 'package:snpit_guild_app/presentation/pages/flag_list_page.dart';
import 'package:snpit_guild_app/presentation/pages/gpt_page.dart';
import 'package:snpit_guild_app/presentation/pages/guild_code_page.dart';
import 'package:snpit_guild_app/presentation/pages/guild_create_page.dart';
import 'package:snpit_guild_app/presentation/pages/guild_manage_page.dart';
import 'package:snpit_guild_app/presentation/pages/guild_page.dart';
import 'package:snpit_guild_app/presentation/pages/guild_request_page.dart';
import 'package:snpit_guild_app/presentation/pages/login_page.dart';
import 'package:snpit_guild_app/presentation/pages/map_page.dart';
import 'package:snpit_guild_app/presentation/pages/my_page.dart';
import 'package:snpit_guild_app/presentation/pages/notification_list_page.dart';
import 'package:snpit_guild_app/presentation/pages/setting_page.dart';
import 'package:snpit_guild_app/presentation/pages/shootable_spot_detail_page.dart';
import 'package:snpit_guild_app/presentation/pages/shooting_page.dart';
import 'package:snpit_guild_app/presentation/pages/spot_detail_page.dart';
import 'package:snpit_guild_app/presentation/pages/spot_list_page.dart';
import 'package:snpit_guild_app/presentation/pages/tab_page.dart';
import 'package:snpit_guild_app/presentation/pages/text_editing_page.dart';
import 'package:snpit_guild_app/presentation/pages/verification_code_page.dart';
import 'package:snpit_guild_app/presentation/pages/wallet_page.dart';
import 'package:snpit_guild_app/presentation/pages/weave_spot_page.dart';

class TextEditingPageArgs {
  TextEditingPageArgs({
    required this.title,
    required this.text,
    required this.hintText,
    required this.onSave,
  });

  final String title;
  final String text;
  final String hintText;
  final void Function(String updatedText) onSave;
}

final GoRouter router = GoRouter(
  initialLocation: Screen.login.path,
  routes: [
    GoRoute(
      path: Screen.debugMenu.path,
      builder: (context, state) =&gt; const DebugMenuPage(),
    ),
    GoRoute(
      path: Screen.debugUtility.path,
      builder: (context, state) =&gt; const DebugUtilityPage(),
    ),
    GoRoute(
      path: Screen.debugDeviceInfo.path,
      builder: (context, state) =&gt; const DebugDeviceInfoPage(),
    ),
    GoRoute(
      path: Screen.debugLocalization.path,
      builder: (context, state) =&gt; const DebugLocalizationPage(),
    ),
    GoRoute(
      path: Screen.textEditing.path,
      builder: (context, state) {
        final args = state.extra as TextEditingPageArgs? ??
            TextEditingPageArgs(
              title: '',
              text: '',
              hintText: '',
              onSave: (updatedText) {
                debugPrint(updatedText);
              },
            );
        return TextEditingPage(
          title: args.title,
          text: args.text,
          hintText: args.hintText,
          onSave: args.onSave,
        );
      },
    ),
    GoRoute(
      path: Screen.login.path,
      builder: (context, state) =&gt; const LoginPage(),
    ),
    GoRoute(
      path: Screen.verificationCode.path,
      builder: (context, state) {
        final email = state.extra as String? ?? '';
        return VerificationCodePage(email: email);
      },
    ),
    GoRoute(
      path: Screen.myPage.path,
      builder: (context, state) =&gt; const MyPage(),
    ),
    GoRoute(
      path: Screen.setting.path,
      builder: (context, state) =&gt; const SettingPage(),
    ),
    GoRoute(
      path: Screen.deckDetail.path,
      builder: (context, state) {
        final deckId = state.extra as String? ?? '';
        return DeckDetailPage(deckId: deckId);
      },
    ),
    GoRoute(
      path: Screen.cameraList.path,
      builder: (context, state) =&gt; const CameraListPage(),
    ),
    GoRoute(
      path: Screen.notificationList.path,
      builder: (context, state) =&gt; const NotificationListPage(),
    ),
    GoRoute(
      path: Screen.wallet.path,
      builder: (context, state) =&gt; const WalletPage(),
    ),
    GoRoute(
      path: Screen.gpt.path,
      builder: (context, state) =&gt; const GptPage(),
    ),
    GoRoute(
      path: Screen.spotList.path,
      builder: (context, state) =&gt; const SpotListPage(),
    ),
    GoRoute(
      path: Screen.spotDetail.path,
      builder: (context, state) {
        final spotId = state.extra as String? ?? '';
        return SpotDetailPage(spotId: spotId);
      },
    ),
    GoRoute(
      path: Screen.shootableSpotDetail.path,
      builder: (context, state) {
        final spotId = state.extra as String? ?? '';
        return ShootableSpotDetailPage(spotId: spotId);
      },
    ),
    GoRoute(
      path: Screen.shooting.path,
      builder: (context, state) =&gt; const ShootingPage(),
    ),
    GoRoute(
      path: Screen.weaveSpot.path,
      builder: (context, state) =&gt; const WeaveSpotPage(),
    ),
    GoRoute(
      path: Screen.flagList.path,
      builder: (context, state) {
        final spotId = state.extra as String? ?? '';
        return FlagListPage(spotId: spotId);
      },
    ),
    StatefulShellRoute.indexedStack(
      builder: (context, state, navigationShell) =&gt;
          TabPage(navigationShell: navigationShell),
      branches: [
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: Screen.map.path,
              builder: (context, state) =&gt; const MapPage(),
            ),
          ],
        ),
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: Screen.guild.path,
              builder: (context, state) =&gt; const GuildPage(),
              routes: [
                GoRoute(
                  path: Screen.guildManage.branch,
                  builder: (context, state) =&gt; const GuildManagePage(),
                ),
                GoRoute(
                  path: Screen.guildCreate.branch,
                  builder: (context, state) =&gt; const GuildCreatePage(),
                ),
                GoRoute(
                  path: Screen.guildCode.branch,
                  builder: (context, state) =&gt; const GuildCodePage(),
                ),
                GoRoute(
                  path: Screen.guildRequest.branch,
                  builder: (context, state) {
                    final guildId = state.extra as String? ?? '';
                    return GuildRequestPage(guildId: guildId);
                  },
                ),
              ],
            ),
          ],
        ),
      ],
    ),

    // 以下は実際の遷移ではなくデバッグ用の遷移
    GoRoute(
      path: Screen.guildManage.debugPath,
      builder: (context, state) =&gt; const GuildManagePage(),
    ),
    GoRoute(
      path: Screen.guildCreate.debugPath,
      builder: (context, state) =&gt; const GuildCreatePage(),
    ),
    GoRoute(
      path: Screen.guildCode.debugPath,
      builder: (context, state) =&gt; const GuildCodePage(),
    ),
    GoRoute(
      path: Screen.guildRequest.debugPath,
      builder: (context, state) {
        final guildId = state.extra as String? ?? '';
        return GuildRequestPage(guildId: guildId);
      },
    ),
  ],
);



import 'package:go_router/go_router.dart';
import 'package:snpit_guild_app/domain/screen.dart';
import 'package:snpit_guild_app/presentation/pages/flag_list_page.dart';
import 'package:snpit_guild_app/presentation/pages/our_spot_detail_page.dart';
import 'package:snpit_guild_app/presentation/pages/spot_detail_page.dart';
import 'package:snpit_guild_app/presentation/pages/spot_list_page.dart';

final GoRouter spotListRouter = GoRouter(
  initialLocation: Screen.spotList.path,
  routes: [
    GoRoute(
      path: Screen.spotList.path,
      builder: (context, state) =&gt; const SpotListPage(),
    ),
    GoRoute(
      path: Screen.spotDetail.path,
      builder: (context, state) {
        final spotId = state.extra as String? ?? 'defaultspotId';
        return SpotDetailPage(spotId: spotId);
      },
    ),
    GoRoute(
      path: Screen.ourSpotDetail.path,
      builder: (context, state) {
        final spotId = state.extra as String? ?? 'defaultspotId';
        return OurSpotDetailPage(spotId: spotId);
      },
    ),
    GoRoute(
      path: Screen.flagList.path,
      builder: (context, state) {
        final spotId = state.extra as String? ?? 'defaultspotId';
        return FlagListPage(spotId: spotId);
      },
    ),
  ],
);



import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:snpit_guild_app/domain/screen.dart';
import 'package:snpit_guild_app/presentation/pages/explorer_list_page.dart';
import 'package:snpit_guild_app/presentation/pages/shootable_spot_detail_page.dart';
import 'package:snpit_guild_app/presentation/providers/access_token.dart';
import 'package:snpit_guild_app/presentation/providers/should_logout.dart';
import 'package:snpit_guild_app/presentation/providers/should_refresh_guild.dart';
import 'package:snpit_guild_app/presentation/providers/should_refresh_map_spot.dart';
import 'package:snpit_guild_app/presentation/providers/show_explorer_list.dart';
import 'package:snpit_guild_app/presentation/providers/show_force_update.dart';
import 'package:snpit_guild_app/presentation/providers/show_maintenance.dart';
import 'package:snpit_guild_app/presentation/providers/show_our_spot_detail.dart';
import 'package:snpit_guild_app/presentation/providers/show_shootable_spot_detail.dart';
import 'package:snpit_guild_app/presentation/providers/show_spot_list.dart';
import 'package:snpit_guild_app/presentation/router/spot_list_router.dart';
import 'package:snpit_guild_app/presentation/theme/app_theme.dart';
import 'package:snpit_guild_app/utils/show_dialog_utils.dart';

class TabPage extends HookConsumerWidget {
  const TabPage({required this.navigationShell, super.key});
  final StatefulNavigationShell navigationShell;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    void showShootableSpotDetailSheet(String spotId) {
      showModalBottomSheet&lt;void&gt;(
        context: context,
        isScrollControlled: true,
        builder: (context) {
          return FractionallySizedBox(
            heightFactor: 0.7,
            child: ClipRRect(
              borderRadius: const BorderRadius.vertical(
                top: Radius.circular(16),
              ),
              child: ShootableSpotDetailPage(
                spotId: spotId,
              ),
            ),
          );
        },
      ).then((_) {
        ref.read(showShootableSpotDetailNotifierProvider.notifier).hide();
      });
    }

    void showExploreListSheet() {
      showModalBottomSheet&lt;void&gt;(
        context: context,
        isScrollControlled: true,
        builder: (context) {
          return const FractionallySizedBox(
            heightFactor: 0.5,
            child: ClipRRect(
              borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
              child: ExplorerListPage(),
            ),
          );
        },
      ).then((_) {
        ref.read(showExplorerListNotifierProvider.notifier).hide();
      });
    }

    void showSpotListSheet() {
      // sheet が立ち上がるタイミングで最初の画面にリセットしないと、sheet を表示したときに前回閉じた画面が表示される
      spotListRouter.go(Screen.spotList.path);

      showModalBottomSheet&lt;void&gt;(
        context: context,
        isScrollControlled: true,
        builder: (context) {
          return FractionallySizedBox(
            heightFactor: 0.7,
            child: ClipRRect(
              borderRadius:
                  const BorderRadius.vertical(top: Radius.circular(16)),
              child: MaterialApp.router(
                theme: appTheme,
                routerConfig: spotListRouter,
                debugShowCheckedModeBanner: false,
              ),
            ),
          );
        },
      ).then((_) {
        ref.read(showSpotListNotifierProvider.notifier).hide();
      });
    }

    void showOurSpotDetailSheet(String spotId) {
      // sheet が立ち上がるタイミングで最初の画面にリセットしないと、sheet を表示したときに前回閉じた画面が表示される
      spotListRouter.go(
        Screen.ourSpotDetail.path,
        extra: spotId,
      );

      showModalBottomSheet&lt;void&gt;(
        context: context,
        isScrollControlled: true,
        builder: (context) {
          return FractionallySizedBox(
            heightFactor: 0.7,
            child: ClipRRect(
              borderRadius:
                  const BorderRadius.vertical(top: Radius.circular(16)),
              child: MaterialApp.router(
                theme: appTheme,
                routerConfig: spotListRouter,
                debugShowCheckedModeBanner: false,
              ),
            ),
          );
        },
      ).then((_) {
        ref.read(showOurSpotDetailNotifierProvider.notifier).hide();
      });
    }

    Future&lt;void&gt; showSessionExpiredDialog() async {
      Future&lt;void&gt; onTapOk() async {
        if (context.mounted) {
          context.go(Screen.login.path);
        }
      }

      return showDialog&lt;void&gt;(
        context: context,
        barrierDismissible: false,
        builder: (BuildContext context) {
          return AlertDialog(
            title: const Text('Session Expired'),
            content: const Text(
              'Your session has expired. Please log in again.',
            ),
            actions: &lt;Widget&gt;[
              TextButton(
                onPressed: () async {
                  await onTapOk();
                },
                child: const Text('OK'),
              ),
            ],
          );
        },
      );
    }

    ref
      ..listen&lt;int&gt;(shouldLogoutNotifierProvider, (previous, next) async {
        // アクセストークンを削除
        await ref.read(accessTokenNotifierProvider.notifier).delete();

        // ダイアログを出してログイン画面に遷移
        await showSessionExpiredDialog();
      })
      ..listen&lt;int&gt;(showMaintenanceNotifierProvider, (previous, next) async {
        showMaintenanceDialog(context);
      })
      ..listen&lt;int&gt;(showForceUpdateNotifierProvider, (previous, next) async {
        showForceUpdateDialog(context);
      })
      ..listen&lt;String?&gt;(showShootableSpotDetailNotifierProvider,
          (previous, next) {
        if (next != null) {
          showShootableSpotDetailSheet(next);
        }
      })
      ..listen&lt;bool&gt;(showExplorerListNotifierProvider, (previous, next) {
        if (next) {
          showExploreListSheet();
        }
      })
      ..listen&lt;bool&gt;(showSpotListNotifierProvider, (previous, next) {
        if (next) {
          showSpotListSheet();
        }
      })
      ..listen&lt;String?&gt;(showOurSpotDetailNotifierProvider, (previous, next) {
        if (next != null) {
          showOurSpotDetailSheet(next);
        }
      });

    return Scaffold(
      body: navigationShell,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: navigationShell.currentIndex,
        onTap: (index) {
          if (navigationShell.currentIndex == index) {
            // 同じタブをタップした場合はリフレッシュを行う
            if (index == 0) {
              // Map タブのタップをトリガーにマップの更新を行う
              ref.read(shouldRefreshMapSpotNotifierProvider.notifier).trigger();
            } else if (index == 1) {
              // Guild タブのタップをトリガーにギルドの更新を行う
              ref.read(shouldRefreshGuildNotifierProvider.notifier).trigger();
            }
          }
          navigationShell.goBranch(index);
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(
              Icons.public,
              size: 24,
            ),
            label: 'Map',
          ),
          BottomNavigationBarItem(
            icon: Icon(
              Icons.shield_outlined,
              size: 24,
            ),
            label: 'Guild',
          ),
        ],
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:snpit_guild_app/domain/design/color_pallet.dart';
import 'package:snpit_guild_app/domain/design/color_token.dart';
import 'package:snpit_guild_app/domain/rarity.dart';
import 'package:snpit_guild_app/domain/screen.dart';
import 'package:snpit_guild_app/infrastructure/entities/extensions/convert_to_domain.dart';
import 'package:snpit_guild_app/presentation/extensions/font_weight_extensions.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/guilds/get_guild.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/spots/get_spot_list.dart';
import 'package:snpit_guild_app/presentation/providers/flavor_provider.dart';
import 'package:snpit_guild_app/presentation/widgets/square_image.dart';
import 'package:snpit_guild_app/utils/location_utils.dart';
import 'package:snpit_guild_app/utils/snack_bar_utils.dart';

class SpotListPage extends HookConsumerWidget {
  const SpotListPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final myGuildId = ref.watch(getMyGuildNotifierProvider).value?.guildId;
    final spotListAsyncValue = ref.watch(getSpotListNotifierProvider);

    Future&lt;void&gt; onTapSpot(String spotId) async {
      await context.push(Screen.spotDetail.path, extra: spotId);
    }

    Future&lt;void&gt; onRefresh() async {
      try {
        final flavor = ref.watch(flavorProvider);
        final location = await getCurrentLocation(flavor: flavor).timeout(
          const Duration(seconds: 5),
          onTimeout: () {
            throw Exception(
              // ignore: lines_longer_than_80_chars
              'Getting current location timed out. Please try again in an area with better signal.',
            );
          },
        );
        await ref
            .read(getSpotListNotifierProvider.notifier)
            .getAllSpotList(location);
      } on Exception catch (error) {
        if (context.mounted) {
          showErrorSnackBar(context, error);
        }
      }
    }

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
      appBar: AppBar(
        automaticallyImplyLeading: false,
        centerTitle: false,
        title: Text(
          'Spot list',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeightX.semiBold,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.close),
            onPressed: () async {
              // ボトムシート全体を閉じる
              Navigator.of(context, rootNavigator: true).pop();
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          await onRefresh();
        },
        color: ColorToken.primary,
        backgroundColor: ColorToken.bgLight,
        child: spotListAsyncValue.when(
          data: (spotList) {
            if (spotList == null || spotList.isEmpty) {
              return const SizedBox.shrink();
            }

            return SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              child: Column(
                children: [
                  const SizedBox(height: 8),
                  GridView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    padding: const EdgeInsets.all(16),
                    gridDelegate:
                        const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 3,
                      crossAxisSpacing: 16,
                      mainAxisSpacing: 16,
                    ),
                    itemCount: spotList.length,
                    itemBuilder: (context, index) {
                      final spot = spotList[index];
                      final spotId = spot.spotId ?? '';
                      final imageUrl = spot.photoUrl;
                      final rarity = spot.rarity;
                      final guildId = spot.guildId;

                      return GestureDetector(
                        onTap: () async {
                          await onTapSpot(spotId);
                        },
                        child: _SpotTile(
                          imageUrl: imageUrl,
                          rarity: rarity?.domainRarity,
                          guildId: guildId,
                          isMyGuild: guildId == myGuildId,
                        ),
                      );
                    },
                  ),
                  const SizedBox(height: 180),
                ],
              ),
            );
          },
          loading: () {
            return const Center(child: CircularProgressIndicator());
          },
          error: (error, _) {
            return Center(
              child: Text('Error: $error'),
            );
          },
        ),
      ),
    );
  }
}

class _SpotTile extends StatelessWidget {
  const _SpotTile({
    required this.imageUrl,
    required this.rarity,
    required this.guildId,
    required this.isMyGuild,
  });

  final String? imageUrl;
  final Rarity? rarity;
  final String? guildId;
  final bool isMyGuild;

  @override
  Widget build(BuildContext context) {
    return Stack(
      alignment: Alignment.bottomCenter,
      children: [
        // 枠線付きの画像
        DecoratedBox(
          decoration: BoxDecoration(
            border: Border.all(
              color: guildId == null ? ColorPallet.white : ColorPallet.black,
              width: 3,
            ),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Padding(
            padding: const EdgeInsets.all(2),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: SquareImage(
                imageUrl: imageUrl,
                size: double.infinity,
              ),
            ),
          ),
        ),

        // ギルド済みの場合は下部に影をかける
        if (guildId != null)
          Positioned.fill(
            child: Container(
              decoration: BoxDecoration(
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.25),
                    offset: const Offset(0, 12),
                    blurRadius: 24,
                  ),
                ],
              ),
            ),
          ),

        // ギルドラベル
        if (guildId != null)
          Positioned.fill(
            child: Align(
              child: _GuildLabel(isMyGuild: isMyGuild),
            ),
          ),

        // レアリティラベル
        if (rarity != null)
          Positioned(
            top: 8,
            left: 8,
            child: CircleAvatar(
              backgroundColor: ColorPallet.gray1000,
              radius: 10,
              child: Center(
                child: Text(
                  rarity!.label,
                  style: TextStyle(
                    color: rarity!.color,
                    fontSize: 12,
                  ),
                ),
              ),
            ),
          ),
      ],
    );
  }
}

class _GuildLabel extends StatelessWidget {
  const _GuildLabel({required this.isMyGuild});

  final bool isMyGuild;

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(
          Icons.flag,
          size: 32,
          color: isMyGuild ? ColorToken.owner : ColorToken.enemy,
        ),
        const SizedBox(width: 4),
        Text(
          isMyGuild ? 'your guild' : 'enemies',
          style: TextStyle(
            color: isMyGuild ? ColorToken.owner : ColorToken.enemy,
            fontSize: 10,
          ),
        ),
      ],
    );
  }
}

---

## 🤖 Assistant
*2025-02-16 00:45:52*

Flutter/GoRouter で「**1つのグローバルな GoRouter だけを使いつつ、下からせり上がる画面でさらに push 遷移を重ねたい**」という要件は、**実は標準の `showModalBottomSheet` だけでは実現が難しく**、下記のいずれかの方法をとる必要があります。

---

# 方法1: **`showModalBottomSheet` + 「ネストした Navigator (あるいはサブ Router)」を使う** (今のワークアラウンドと同様)

GoRouter とは別の **「小さな Navigator」** を BottomSheet 内だけに置き、そこでページスタックを管理します。  
これが、いま行っている

```dart
showModalBottomSheet(
  builder: (context) {
    return MaterialApp.router(
      routerConfig: spotListRouter, // サブのGoRouter
    );
  },
);
```

の仕組みです。

- メリット
  - 「実際に `showModalBottomSheet` を使った下からのシート」が簡単に実装できる
  - シート内でさらに `push` しても、シート外には影響しない (別 Navigator)

- デメリット
  - 「アプリ全体で 1つの GoRouter」を貫けず、**サブの Router や Navigator を定義**する必要がある
  - コードがやや分散する

もし **「どうしても `showModalBottomSheet` を使いつつ、下から部分的に覆う UI 内で複数画面遷移」** をしたいなら、  
「シート専用の Navigator (あるいはサブの Router)」を置く形が比較的シンプルで、実は一般的です。

---

# 方法2: **「カスタムページ遷移」で下からせり上がる画面を 1つの GoRouter のルートにしてしまう** (シート風に見せる)

もう1つのアプローチは、`showModalBottomSheet` を使わずに、**GoRouter の「1つのルート」として下からせり上がる画面を実装**する方法です。

GoRouter は、各ルートで `pageBuilder` を使えばカスタムアニメーションが可能です。  
以下のように、「画面高さを 70% にして、背面の画面がうっすら見える」ようなカスタム遷移を定義してやると、  
「見た目はモーダルシート」でも、実態は GoRouter の画面スタックの 1ページにすぎません。  
したがって、画面内部で `context.push(...)` としても、同じスタック内での遷移になります。

### サンプル実装（イメージ）

```dart
GoRoute(
  path: '/spotList',
  pageBuilder: (context, state) {
    return CustomTransitionPage(
      child: const SpotListPage(),
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        final offsetAnimation = Tween<Offset>(
          begin: const Offset(0, 1.0),
          end: Offset.zero,
        ).animate(animation);

        // 下からせり上がりつつ、画面の高さを制限してシートっぽく見せる
        return SlideTransition(
          position: offsetAnimation,
          child: Align(
            alignment: Alignment.bottomCenter,
            child: FractionallySizedBox(
              heightFactor: 0.7, // 7割程度の高さ
              child: child,
            ),
          ),
        );
      },
      // 画面タップ外を半透明にしたければ、ModalBarrier 的な実装を行うなど
    );
  },
  // さらに子ルートを定義しておけば push でページ重ねられる
  routes: [
    GoRoute(
      path: 'spotDetail',
      builder: (context, state) => SpotDetailPage(...),
    ),
    // ... 以下省略
  ],
);
```

これにより、

1. `context.push('/spotList')` で「下からせり上がるシート風画面」を開く  
2. `SpotListPage` の中でさらに `context.push('/spotList/spotDetail')` とすれば、同じスタック内で「シート上にさらに下層ページ」を重ねる  
3. 結果として「1つの GoRouter」で完結し、下から覆う UI の上でページ遷移を重ねられる  

という動きが可能になります。

- メリット
  - **アプリ全体で 1つの GoRouter** を使える
  - シート内外含めて完全に一続きの遷移スタックになる
- デメリット
  - 本物の `showModalBottomSheet` ではないので、例えばドラッグで閉じる挙動などを自前実装する必要がある  
  - （とはいえ `DraggableScrollableSheet` や `InteractiveViewer` などを駆使すれば、それっぽく作れます）

---

## どちらが良いか？

- **「ドラッグで閉じたい」「モーダルシートの既存挙動をそのまま活かしたい」**  
  → 方法1 のように「サブ Navigator (あるいはサブ router) + `showModalBottomSheet`」が簡単

- **「アプリ全体の遷移スタックを 1つに統一したい」「ルート URL が欲しい」**  
  → 方法2 のように「カスタム遷移でシートを再現」する

結論として、**`showModalBottomSheet` を使いながら 1つのグローバル GoRouter だけでネスト遷移する**のは難しく、  
いわゆる **「モーダル内にネストした Navigator (またはサブ Router) を置く」か、「カスタムページアニメーションでシート風 UI を実装する」** の2択になる、  
というのが現状の Flutter + GoRouter の設計です。

---

# まとめ

1. **「本物のモーダルシート」＋「シート専用の Navigator or サブ Router」**  
   - すでに採用している方法 (別 `MaterialApp.router`) と同じアプローチ  
   - `showModalBottomSheet` の便利な操作感をそのまま使える  
   - どうしても Router が 2つに分かれる

2. **「単一の GoRouter」＋「カスタム遷移」でシート風の画面をルートとして定義**  
   - 1つの Router で完結し、URL も統合管理できる  
   - シートのドラッグ操作や背景の挙動などは自作する必要がある  

どちらも一長一短なので、**「1つの Router にこだわりたいならカスタム遷移方式」「`showModalBottomSheet` の既存挙動を重視するならサブ Navigator (2つ目の Router)」**  
と考えるのが一般的です。

---

## 👤 User
*2025-02-16 00:48:31*

方法1としたときに、今、mainのMaterialApp.routerでは以下の様な宣言を行なっていて、その設定は引き継ぎたいんだ。どれを記述すべきなのか、それとも記述しないでもいいのかがわかっていない。

class App extends ConsumerWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currentLocale = ref.watch(localeNotifierProvider);

    return MaterialApp.router(
      // Design
      theme: appTheme,
      // router
      routerDelegate: router.routerDelegate,
      routeInformationParser: router.routeInformationParser,
      routeInformationProvider: router.routeInformationProvider,
      // slang
      locale: currentLocale.flutterLocale,
      supportedLocales: AppLocaleUtils.supportedLocales,
      localizationsDelegates: GlobalMaterialLocalizations.delegates,
    );
  }
}

---

## 🤖 Assistant
*2025-02-16 00:48:50*

「**サブの MaterialApp.router をどう設定すれば、本体と同じテーマ・ローカライズ・ロケールなどを引き継げるのか**」という話ですね。

---

## 結論

**親 `MaterialApp.router` に書いたテーマやローカライズなどの設定**は、  
サブで宣言する `MaterialApp.router` にも **同様に指定**する必要があります。

```dart
MaterialApp.router(
  theme: appTheme,
  locale: currentLocale.flutterLocale,
  supportedLocales: AppLocaleUtils.supportedLocales,
  localizationsDelegates: GlobalMaterialLocalizations.delegates,
  routerConfig: spotListRouter,     // <--- サブの GoRouter
  debugShowCheckedModeBanner: false,
  // ↓ routeInformationParser / routeInformationProvider は不要
  //   なぜなら、「外部からのURLを解析する」のはメインのルーターだけだから。
);
```

### なぜ `routeInformationParser` や `routeInformationProvider` はいらないの？

- **サブのルーター**は「`showModalBottomSheet` 内での画面遷移を管理する」ためだけのもの  
- アプリ全体としての**「外部 Deeplink やブラウザの URL」**は、メインの `GoRouter` が受け付けてくれれば十分です  
- したがって、サブのルーターには「外部からの URL を解釈するための `routeInformationParser`」等は不要で、**`routerConfig` があれば OK** です

---

## まとめ

1. 親 `MaterialApp.router` と同じ **theme / locale / localizations** をサブ `MaterialApp.router` へも設定  
   - Flutter は「`MaterialApp` ごとにテーマやロケール等を独立して管理」するので、サブ側でも同じ設定をしないと反映されません
2. **`routerConfig: spotListRouter`** だけ指定し、  
   `routeInformationParser` / `routeInformationProvider` / `routerDelegate` などは省略する  
   - サブ Router では「外部 URL を解析して画面を出す」想定はないため

こうすることで、「親と同じ見た目・翻訳設定」を維持しつつ、サブの `showModalBottomSheet` 内だけでページ遷移を管理できます。

---
