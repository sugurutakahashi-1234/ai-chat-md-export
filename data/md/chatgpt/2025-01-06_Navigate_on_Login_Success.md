# Navigate on Login Success

日付: 2025-01-06

---

## 👤 ユーザー
*2025/1/6 21:19:47*

LoginPage に入った瞬間に GetMyAccountNotifier でリクエストに成功したら、context.go(Screen.map.path); で mapに飛んでほしい

import 'package:flutter/material.dart';
import 'package:flutter\_hooks/flutter\_hooks.dart';
import 'package:flutter\_svg/flutter\_svg.dart';
import 'package:go\_router/go\_router.dart';
import 'package:hooks\_riverpod/hooks\_riverpod.dart';
import 'package:snpit\_guild\_app/domain/screen.dart';
import 'package:snpit\_guild\_app/gen/assets.gen.dart';
import 'package:snpit\_guild\_app/presentation/design\_token/color\_token.dart';

class LoginPage extends HookConsumerWidget {
  const LoginPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final textEditingController = useTextEditingController();

    return Scaffold(
      body: GestureDetector(
        onTap: () {
          FocusScope.of(context).unfocus();
        },
        child: Center(
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: \[
                  GestureDetector(
                    onLongPress: () {
                      // TODO: flavor が dev の場合のみの機能
                      context.push(Screen.debugMenu.path);
                    },
                    child: SvgPicture.asset(
                      Assets.images.logoLogin.path,
                    ),
                  ),
                  const SizedBox(height: 38),
                  Image.asset(
                    Assets.images.loginFig.path,
                  ),
                  const SizedBox(height: 54),
                  TextField(
                    controller: textEditingController,
                    decoration: const InputDecoration(
                      prefixIcon: Padding(
                        padding: EdgeInsets.all(12),
                        child: Icon(
                          Icons.email\_outlined,
                          color: ColorToken.text,
                          size: 24,
                        ),
                      ),
                      hintText: 'Enter your email',
                    ),
                  ),
                  const SizedBox(height: 24),
                  ElevatedButton(
                    onPressed: () {
                      // TODO: ログイン処理
                      context.push(Screen.verificationCode.path);
                    },
                    child: const Text('Login'),
                  ),
                \],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

import 'package:flutter/foundation.dart';
import 'package:riverpod\_annotation/riverpod\_annotation.dart';

import 'package:snpit\_guild\_app/infrastructure/snapit\_guild\_api/snapit\_guild\_api.openapi.dart';
import 'package:snpit\_guild\_app/presentation/providers/api\_client/api\_provider.dart';

part 'get\_ accounts\_info.g.dart';

@Riverpod(keepAlive: true)
class GetMyAccountNotifier extends \_$GetMyAccountNotifier {
  @override
  Future&lt;AccountResponseDTOData?&gt; build() async =&gt; null;

  Future&lt;void&gt; executeRequest() async {
    state = const AsyncValue.loading();
    try {
      final api = await ref.watch(accountsApiProvider.future);
      final response = await api.accountControllerGetCurrentUserAccounts();
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
}

---

## 🤖 アシスタント
*2025/1/6 21:20:14*

To implement the desired behavior of navigating to the map screen upon successful completion of the `GetMyAccountNotifier` request when entering the `LoginPage`, you can use the following approach:

### Updated Code

Here are the changes required:

1. **Watch the `GetMyAccountNotifier` state**: Use `ref.watch` to monitor the notifier's state in the `LoginPage`.
2. **Navigate to the `map` screen on success**: When the state changes to `AsyncValue.data`, check if the data exists and navigate accordingly.
3. **Trigger the request**: Ensure the notifier request is executed when the page is built.

Here's the updated `LoginPage`:

```dart
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:snpit_guild_app/domain/screen.dart';
import 'package:snpit_guild_app/gen/assets.gen.dart';
import 'package:snpit_guild_app/presentation/design_token/color_token.dart';
import 'package:snpit_guild_app/presentation/providers/get_accounts_info.dart'; // Import your provider.

class LoginPage extends HookConsumerWidget {
  const LoginPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final textEditingController = useTextEditingController();

    // Watch the notifier state.
    final accountState = ref.watch(getMyAccountNotifierProvider);

    useEffect(() {
      // Execute the request when the page builds.
      Future.microtask(() {
        ref.read(getMyAccountNotifierProvider.notifier).executeRequest();
      });
      return null;
    }, []);

    // Handle navigation on success.
    accountState.whenOrNull(
      data: (data) {
        if (data != null) {
          WidgetsBinding.instance.addPostFrameCallback((_) {
            context.go(Screen.map.path); // Navigate to the map screen.
          });
        }
      },
    );

    return Scaffold(
      body: GestureDetector(
        onTap: () {
          FocusScope.of(context).unfocus();
        },
        child: Center(
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  GestureDetector(
                    onLongPress: () {
                      // TODO: flavor が dev の場合のみの機能
                      context.push(Screen.debugMenu.path);
                    },
                    child: SvgPicture.asset(
                      Assets.images.logoLogin.path,
                    ),
                  ),
                  const SizedBox(height: 38),
                  Image.asset(
                    Assets.images.loginFig.path,
                  ),
                  const SizedBox(height: 54),
                  TextField(
                    controller: textEditingController,
                    decoration: const InputDecoration(
                      prefixIcon: Padding(
                        padding: EdgeInsets.all(12),
                        child: Icon(
                          Icons.email_outlined,
                          color: ColorToken.text,
                          size: 24,
                        ),
                      ),
                      hintText: 'Enter your email',
                    ),
                  ),
                  const SizedBox(height: 24),
                  ElevatedButton(
                    onPressed: () {
                      // TODO: ログイン処理
                      context.push(Screen.verificationCode.path);
                    },
                    child: const Text('Login'),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
```

### Key Points

1. **Watching State**: `ref.watch(getMyAccountNotifierProvider)` observes the notifier's state. The `whenOrNull` method helps to handle the `data` state without affecting loading or error states.
2. **Navigation on Success**: `WidgetsBinding.instance.addPostFrameCallback` ensures navigation occurs after the current frame to avoid context-related errors.
3. **Request Execution**: `useEffect` triggers the `executeRequest` method only once when the widget builds.

This implementation ensures the user is redirected to the `map` screen when the account information is successfully retrieved.

---

## 👤 ユーザー
*2025/1/6 21:44:37*

この画面で 'Manage this guild',のボタンについて、GetMyAccountNotifier のもっている account情報のuserIdが、GetMyGuildNotifierのguildMembersで同じuserIdのroleがadminもしくはownerの場合のみに表示してほしい

/// The account details
@freezed
class AccountResponseDTOData with \_$AccountResponseDTOData {
  factory AccountResponseDTOData({
    @JsonKey(name: 'userId') required String? userId,
    @JsonKey(name: 'username') required String? username,
    @JsonKey(name: 'email') required String? email,
    @JsonKey(name: 'sNPITToken') required String? sNPITToken,
    @JsonKey(name: 'walletAddress') String? walletAddress,
    @JsonKey(name: 'avatar') String? avatar,
    @JsonKey(name: 'profilePicture') String? profilePicture,
    @JsonKey(name: 'guildId') String? guildId,
    @JsonKey(name: 'userRole') required AccountDtoUserRole? userRole,
    @JsonKey(name: 'userStatus') required AccountDtoUserStatus? userStatus,
    @JsonKey(name: 'loginStatus') required AccountDtoLoginStatus? loginStatus,
  }) = \_AccountResponseDTOData;

  factory AccountResponseDTOData.fromJson(Map&lt;String, dynamic&gt; jsonMap) =&gt;
      \_$AccountResponseDTODataFromJson(jsonMap);
}

@Riverpod(keepAlive: true)
class GetMyGuildNotifier extends \_$GetMyGuildNotifier {
  @override
  Future&lt;GuildInfoResponseDtoData?&gt; build() async =&gt; null;

  Future&lt;void&gt; executeRequest() async {
    state = const AsyncValue.loading();
    try {
      final api = await ref.watch(guildsApiProvider.future);
      final response = await api.guildControllerGetGuildInfoOfUser();
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

/// Guild information.
@freezed
class GuildInfoResponseDtoData with \_$GuildInfoResponseDtoData {
  factory GuildInfoResponseDtoData({
    @JsonKey(name: 'guildId') required String? guildId,
    @JsonKey(name: 'guildName') required String? guildName,
    @JsonKey(name: 'guildDescription') String? guildDescription,
    @JsonKey(name: 'guildOwner') required String? guildOwner,
    @JsonKey(name: 'guildStatus') required GuildDtoGuildStatus? guildStatus,
    @JsonKey(name: 'guildAvatar') String? guildAvatar,
    @JsonKey(name: 'guildBanner') String? guildBanner,
    @JsonKey(name: 'guildMembers') required List&lt;GuildMemberDto&gt;? guildMembers,
  }) = \_GuildInfoResponseDtoData;

  factory GuildInfoResponseDtoData.fromJson(Map&lt;String, dynamic&gt; jsonMap) =&gt;
      \_$GuildInfoResponseDtoDataFromJson(jsonMap);
}

@freezed
class GuildMemberDto with \_$GuildMemberDto {
  factory GuildMemberDto({
    @JsonKey(name: 'userId') required String? userId,
    @JsonKey(name: 'username') required String? username,
    @JsonKey(name: 'avatar') required String? avatar,
    @JsonKey(name: 'role') required GuildMemberDtoRole? role,
    @JsonKey(name: 'memberStatus')
    required GuildMemberDtoMemberStatus? memberStatus,
    @JsonKey(name: 'teamId') String? teamId,
  }) = \_GuildMemberDto;

  factory GuildMemberDto.fromJson(Map&lt;String, dynamic&gt; jsonMap) =&gt;
      \_$GuildMemberDtoFromJson(jsonMap);
}


enum GuildMemberDtoRole {
  @JsonValue('OWNER')
  OWNER,
  @JsonValue('ADMIN')
  ADMIN,
  @JsonValue('MEMBER')
  MEMBER,
}


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
                      padding: const EdgeInsets.symmetric(horizontal: 24),
                      child: Column(
                        children: \[
                          const SizedBox(height: 24),
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
                                          'Guild Code Copied To Clipboard: '
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
                          const SizedBox(height: 24),
                          OutlinedButton(
                            onPressed: () {
                              context.push(Screen.guildManage.path);
                            },
                            child: const Stack(
                              alignment: Alignment.center,
                              children: \[
                                Center(
                                  child: Text(
                                    'Manage this guild',
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
                            RefreshIndicator(
                              onRefresh: () async {
                                await ref
                                    .read(getMyGuildNotifierProvider.notifier)
                                    .executeRequest();
                              },
                              child: ListView.builder(
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
                                                          style:
                                                              const TextStyle(
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
                                                            const EdgeInsets
                                                                .only(
                                                          right: 4,
                                                        ),
                                                        child: ClipRRect(
                                                          borderRadius:
                                                              BorderRadius
                                                                  .circular(4),
                                                          child: SizedBox(
                                                            width: 28,
                                                            height: 28,
                                                            child:
                                                                Image.network(
                                                              UriExtensions
                                                                  .random
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
*2025/1/6 21:45:19*

To display the "Manage this guild" button only if the `GetMyAccountNotifier`'s `userId` matches a `GetMyGuildNotifier` guild member's `userId` with a role of `ADMIN` or `OWNER`, you can follow these steps:

### Implementation Steps

1. **Watch the State of Both Notifiers**:
   Use `ref.watch` to observe the state of `GetMyAccountNotifier` and `GetMyGuildNotifier`.

2. **Check the Conditions**:
   Verify that:
   - `GetMyAccountNotifier` provides a valid `userId`.
   - `GetMyGuildNotifier` contains the guild members.
   - At least one member matches the `userId` and has the required role.

3. **Control the Visibility of the Button**:
   Use a conditional check to determine whether to show the button.

Here is the updated `GuildPage`:

### Updated Code

```dart
class GuildPage extends HookConsumerWidget {
  const GuildPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Watch account and guild states
    final accountState = ref.watch(getMyAccountNotifierProvider);
    final guildInfoAsync = ref.watch(getMyGuildNotifierProvider);

    useEffect(() {
      // Fetch guild info on widget load
      Future.microtask(() {
        ref.read(getMyGuildNotifierProvider.notifier).executeRequest();
      });
      return null;
    }, []);

    // Fetch guild info again if a guild is created
    ref.listen<bool>(
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
              // Check if the user is an admin or owner
              final userId = accountState.maybeWhen(
                data: (account) => account?.userId,
                orElse: () => null,
              );

              final isAdminOrOwner = guildInfo.guildMembers?.any((member) {
                    return member.userId == userId &&
                        (member.role == GuildMemberDtoRole.ADMIN ||
                            member.role == GuildMemberDtoRole.OWNER);
                  }) ??
                  false;

              return DefaultTabController(
                length: 2,
                child: Column(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 24),
                      child: Column(
                        children: [
                          const SizedBox(height: 24),
                          DecoratedBox(
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: ColorToken.secondary),
                            ),
                            child: Column(
                              children: [
                                // Guild info and stats UI...
                              ],
                            ),
                          ),
                          const SizedBox(height: 24),

                          // Show the button only if the user is an admin or owner
                          if (isAdminOrOwner)
                            OutlinedButton(
                              onPressed: () {
                                context.push(Screen.guildManage.path);
                              },
                              child: const Stack(
                                alignment: Alignment.center,
                                children: [
                                  Center(
                                    child: Text(
                                      'Manage this guild',
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

                    // TabBar and other UI...
                  ],
                ),
              );
            } else {
              // No guild info available
              return const Center(
                child: Text('No guild information available.'),
              );
            }
          },
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (error, stackTrace) {
            WidgetsBinding.instance.addPostFrameCallback((_) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Error: $error')),
              );
            });
            return Center(child: Text('An error occurred: $error'));
          },
        ),
      ),
    );
  }
}
```

### Key Changes

1. **State Observing**:
   - `accountState.maybeWhen` is used to extract the `userId` from `GetMyAccountNotifier`.
   - `guildInfo.guildMembers?.any` checks for a match with the required roles.

2. **Conditional Button Display**:
   The `isAdminOrOwner` variable determines whether the button is displayed.

3. **Robust Handling**:
   Ensures no errors occur when states are null or incomplete.

This ensures the "Manage this guild" button is shown only to users with the appropriate permissions.

---
