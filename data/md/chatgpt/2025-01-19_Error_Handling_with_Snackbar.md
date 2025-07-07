# Error Handling with Snackbar

日付: 2025-01-19

---

## 👤 ユーザー
*2025/1/19 17:07:07*

Future onTapReject() async {}

    Future onTapApprove() async {}

を実装してほしい。
また、内部の処理を try で囲って エラーの場合はスナックバーを表示してほしい
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter\_hooks/flutter\_hooks.dart';
import 'package:go\_router/go\_router.dart';
import 'package:hooks\_riverpod/hooks\_riverpod.dart';
import 'package:image\_cropper/image\_cropper.dart';
import 'package:image\_picker/image\_picker.dart';
import 'package:intl/intl.dart';
import 'package:permission\_handler/permission\_handler.dart';
import 'package:snpit\_guild\_app/domain/design/color\_token.dart';
import 'package:snpit\_guild\_app/domain/screen.dart';
import 'package:snpit\_guild\_app/gen/assets.gen.dart';
import 'package:snpit\_guild\_app/infrastructure/snapit\_guild\_api/snapit\_guild\_api.openapi.dart';
import 'package:snpit\_guild\_app/presentation/providers/api\_client/guilds/get\_guild.dart';
import 'package:snpit\_guild\_app/presentation/providers/api\_client/guilds/update\_guild.dart';
import 'package:snpit\_guild\_app/presentation/providers/api\_client/guilds/update\_guild\_member.dart';
import 'package:snpit\_guild\_app/presentation/router/router.dart';
import 'package:snpit\_guild\_app/utils/extensions/uri\_extensions.dart';

class GuildManagePage extends HookConsumerWidget {
  const GuildManagePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final imageFile = useState&lt;File?&gt;(null);
    final picker = useMemoized(ImagePicker.new);
    final guildInfoState = ref.watch(getMyGuildNotifierProvider);

    Future&lt;void&gt; pickAndCropImage() async {
      final pickedFile = await picker.pickImage(source: ImageSource.gallery);
      if (pickedFile == null) {
        debugPrint('Image selection cancelled');
        return;
      }

      final croppedFile = await ImageCropper().cropImage(
        sourcePath: pickedFile.path,
        aspectRatio: const CropAspectRatio(ratioX: 1, ratioY: 1),
        uiSettings: \[
          AndroidUiSettings(
            hideBottomControls: true,
            lockAspectRatio: true,
          ),
          IOSUiSettings(
            aspectRatioLockEnabled: true,
          ),
        \],
      );

      if (croppedFile == null) {
        debugPrint('Cropping cancelled');
        return;
      }

      imageFile.value = File(croppedFile.path);
      debugPrint('Cropped image path: ${imageFile.value!.path}');

      // TODO: \[Photo\] 画像アップロードなど適切な API 呼び出し
      await ref.read(updateGuildNotifierProvider.notifier).updateGuildAvatar(
            UriExtensions.randomImageUrlWithTitle(
              // ignore: use\_build\_context\_synchronously
              TimeOfDay.now().format(context),
            ).toString(),
          );

      // show snackbar
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Updated Successfully'),
          ),
        );
      }

      // Refresh guild information
      await ref.read(getMyGuildNotifierProvider.notifier).getMyGuild();
    }

    Future onTapReject() async {}

    Future onTapApprove() async {}

    return Scaffold(
      appBar: AppBar(title: const Text('Guild management')),
      body: guildInfoState.when(
        loading: () =&gt; const Center(child: CircularProgressIndicator()),
        error: (error, stackTrace) =&gt; Center(child: Text('Error: $error')),
        data: (guildInfo) {
          if (guildInfo == null) {
            return const Center(child: Text('No guild info available.'));
          }

          final guildId = guildInfo.guildId ?? 'Unknown';
          final guildName = guildInfo.guildName ?? 'No Name';
          final guildAvatar = guildInfo.guildAvatar ?? '';
          final guildMembers = guildInfo.guildMembers ?? &lt;GuildMemberDto&gt;\[\];

          return \_buildGuildManagementContent(
            context: context,
            ref: ref,
            pickAndCropImage: pickAndCropImage,
            guildId: guildId,
            guildName: guildName,
            guildAvatar: guildAvatar,
            guildMembers: guildMembers,
          );
        },
      ),
    );
  }

  /// GuildInfoResponseDtoData の中の必要データを非オプショナルで受け取り、安全なデフォルトを使う
  Widget \_buildGuildManagementContent({
    required BuildContext context,
    required WidgetRef ref,
    required Future&lt;void&gt; Function() pickAndCropImage,
    required String guildId,
    required String guildName,
    required String guildAvatar,
    required List&lt;GuildMemberDto&gt; guildMembers,
  }) {
    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: \[
            const SizedBox(height: 32),
            // ギルドのアバター(写真)
            Center(
              child: GestureDetector(
                onTap: () async {
                  final hasPermission = await \_hasPhotoPermission(context);
                  if (hasPermission) {
                    await pickAndCropImage();
                  }
                },
                child: Stack(
                  alignment: Alignment.center,
                  children: \[
                    ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: guildAvatar.isNotEmpty
                          ? Image.network(
                              guildAvatar,
                              width: 64,
                              height: 64,
                              fit: BoxFit.cover,
                            )
                          : Container(
                              width: 64,
                              height: 64,
                              color: ColorToken.bgDark,
                              child: const Icon(
                                Icons.hide\_image\_outlined,
                                size: 48,
                                color: ColorToken.text,
                              ),
                            ),
                    ),
                    Container(
                      width: 64,
                      height: 64,
                      decoration: BoxDecoration(
                        color: Colors.black.withAlpha(180),
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    const Icon(
                      Icons.camera\_alt,
                      size: 24,
                      color: Colors.white,
                    ),
                  \],
                ),
              ),
            ),
            const SizedBox(height: 32),
            // ギルド名編集部分
            Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: () {
                  context.push(
                    Screen.textEditing.path,
                    extra: TextEditingPageArgs(
                      title: 'Name',
                      text: guildName,
                      hintText: 'Enter guild name',
                      onSave: (updatedText) async {
                        if (updatedText.isNotEmpty &&
                            updatedText != guildName) {
                          await ref
                              .read(updateGuildNotifierProvider.notifier)
                              .updateGuildName(updatedText);

                          // Refresh guild information
                          await ref
                              .read(getMyGuildNotifierProvider.notifier)
                              .getMyGuild();

                          // show snackbar
                          if (context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content:
                                    Text('Guild name updated to $updatedText'),
                              ),
                            );
                          }
                        }
                      },
                    ),
                  );
                },
                borderRadius: BorderRadius.circular(8),
                child: Container(
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: \[
                      const Text(
                        'Name',
                        style: TextStyle(
                          fontSize: 16,
                          color: ColorToken.border,
                        ),
                      ),
                      Row(
                        children: \[
                          Text(
                            guildName,
                            style: const TextStyle(fontSize: 16),
                          ),
                          const SizedBox(width: 8),
                          const Icon(
                            Icons.chevron\_right,
                            color: ColorToken.text,
                            size: 20,
                          ),
                        \],
                      ),
                    \],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 32),
            const Divider(color: ColorToken.secondary, thickness: 1),
            const SizedBox(height: 32),
            // メンバー申請一覧
            \_buildRequestedMembers(
              context: context,
              ref: ref,
              guildId: guildId,
              guildMembers: guildMembers,
            ),
          \],
        ),
      ),
    );
  }

  /// 申請中メンバー一覧表示
  Widget \_buildRequestedMembers({
    required BuildContext context,
    required WidgetRef ref,
    required String guildId,
    required List&lt;GuildMemberDto&gt; guildMembers,
  }) {
    // guildMembers の中で、`memberStatus` が REQUESTED のものだけを抽出
    final requestedMembers = guildMembers
        .where(
          (member) =&gt;
              member.memberStatus == GuildMemberDtoMemberStatus.REQUESTED,
        )
        .toList();

    if (requestedMembers.isEmpty) {
      return const SizedBox.shrink();
    }

    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: requestedMembers.length,
      itemBuilder: (context, index) {
        final member = requestedMembers\[index\];
        final userId = member.userId ?? 'UnknownUserId';
        final userName = member.username ?? 'UnknownUserName';
        final avatarUrl = member.avatar ?? '';

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
              child: Column(
                children: \[
                  // ユーザー情報部分
                  Row(
                    children: \[
                      // 左側：アバター + ユーザー名
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: \[
                            Row(
                              children: \[
                                CircleAvatar(
                                  radius: 16,
                                  backgroundImage: avatarUrl.isNotEmpty
                                      ? NetworkImage(avatarUrl)
                                      : AssetImage(
                                          Assets
                                              .images.defaultGuildProfile.path,
                                        ) as ImageProvider,
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Text(
                                    userName,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                              \],
                            ),
                            const SizedBox(height: 10),
                            // バッジなど（例としてダミー4個）
                            Row(
                              children: List.generate(
                                4,
                                (badgeIndex) =&gt; Padding(
                                  padding: const EdgeInsets.only(right: 4),
                                  child: ClipRRect(
                                    borderRadius: BorderRadius.circular(4),
                                    child: SizedBox(
                                      width: 28,
                                      height: 28,
                                      child: Image.network(
                                        UriExtensions.random.toString(),
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
                      // 右側：各種ステータス (Q, E, L, B など)
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
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
                  const SizedBox(height: 16),
                  // 承認・却下ボタン
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: \[
                      Flexible(
                        child: OutlinedButton(
                          onPressed: () async {
                            await ref
                                .watch(rejectGuildNotifierProvider.notifier)
                                .rejectGuild(guildId: guildId, userId: userId);

                            // Refresh
                            await ref
                                .read(getMyGuildNotifierProvider.notifier)
                                .getMyGuild();

                            if (context.mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text('You have rejected $userName'),
                                ),
                              );
                            }
                          },
                          style: OutlinedButton.styleFrom(
                            minimumSize: const Size.fromHeight(32),
                          ),
                          child: const Text(
                            'Reject',
                            style: TextStyle(fontSize: 12),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Flexible(
                        child: ElevatedButton(
                          onPressed: () async {
                            await ref
                                .watch(approveGuildNotifierProvider.notifier)
                                .approveGuild(guildId: guildId, userId: userId);

                            // Refresh
                            await ref
                                .read(getMyGuildNotifierProvider.notifier)
                                .getMyGuild();

                            if (context.mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text('You have approved $userName'),
                                ),
                              );
                            }
                          },
                          style: OutlinedButton.styleFrom(
                            minimumSize: const Size.fromHeight(32),
                          ),
                          child: const Text(
                            'Approve',
                            style: TextStyle(fontSize: 12),
                          ),
                        ),
                      ),
                    \],
                  ),
                \],
              ),
            ),
          ),
        );
      },
    );
  }

  /// 各種ステータス表示用のウィジェット
  Widget \_buildStatRow(String label, int value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.end,
      children: \[
        const SizedBox(width: 40),
        SizedBox(
          width: 20,
          child: Text(
            label,
            style: const TextStyle(fontSize: 13),
          ),
        ),
        const SizedBox(width: 4),
        SizedBox(
          width: 30,
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
            borderRadius: BorderRadius.circular(8),
          ),
        ),
      \],
    );
  }

  /// 写真の権限をチェックして、権限があれば true を返す
  Future&lt;bool&gt; \_hasPhotoPermission(BuildContext context) async {
    final status = await Permission.photos.request();

    switch (status) {
      case PermissionStatus.granted:
      case PermissionStatus.limited:
        // 許可済み
        return true;
      case PermissionStatus.permanentlyDenied:
        // 永久に拒否されている場合
        if (context.mounted) {
          \_showPermissionDialog(context);
        }
        return false;
      case PermissionStatus.denied:
      case PermissionStatus.restricted:
      case PermissionStatus.provisional:
        // その他の場合
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Access to photos is not granted.')),
          );
        }
        return false;
    }
  }

  /// 設定画面へ遷移させるダイアログを表示
  void \_showPermissionDialog(BuildContext context) {
    showDialog&lt;void&gt;(
      context: context,
      builder: (context) =&gt; AlertDialog(
        title: const Text('Permission to access photos is required'),
        content:
            const Text('Enable photo access in settings to select a photo.'),
        actions: \[
          TextButton(
            onPressed: () async {
              context.pop();
            },
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () async {
              await openAppSettings();
            },
            child: const Text('Open Settings'),
          ),
        \],
      ),
    );
  }
}

---

## 🔧 ツール
*2025/1/19 17:07:22*

\*\*Creating async methods\*\*

I'm working on `onTapReject` and `onTapApprove` to handle errors with `try/catch`, showing a snackbar if something goes wrong. Progress is steady, aiming for robust error handling.

\*\*Thinking through context\*\*

I'm considering how to handle async methods `onTapReject` and `onTapApprove`, ensuring they access necessary arguments like context or userId for error handling or displaying snack bars.

\*\*Mapping the logic\*\*

I'm considering adapting the inline logic to `onTapReject` and `onTapApprove`, possibly passing context or userId as arguments to ensure error handling and updating necessary data.

\*\*Adjusting my strategy\*\*

I'm thinking through adding parameters for context, ref, guildId, userId, and userName to `onTapReject` and `onTapApprove`, aligning with the user's request for error handling and snackbar display.

\*\*Error handling strategy\*\*

I'm figuring out how to cover errors efficiently in `onTapReject` and `onTapApprove` by adding `try/catch` blocks and a snackbar for error messages. Progress is steady and logical.

\*\*Enhancing error handling\*\*

I'm adding `try/catch` blocks to `onTapReject` and `onTapApprove`, and planning to replicate `\_buildRequestedMembers` logic within these methods for consistent error handling and snackbar display.

\*\*Adding context variables\*\*

I’m noting the potential to include context variables like `guildId` or `userId` in `onTapReject` and `onTapApprove`. This might align with `\_buildRequestedMembers`' logic, but we'll keep it simple for now.

\*\*Mapping out changes\*\*

I’m planning to replace calls in `\_buildRequestedMembers` with `onTapReject` and `onTapApprove`, enhancing them with error handling and snackbar display, while considering relevant context variables.

\*\*Implementing error handling\*\*

I’m integrating `onTapReject` and `onTapApprove` methods with error handling and snackbars, aligning them with `\_buildRequestedMembers` to ensure consistent functionality.

---

## 🤖 アシスタント
*2025/1/19 17:07:48*

以下のサンプルでは、`onTapReject` と `onTapApprove` を try-catch でラップし、エラー時にスナックバーを表示する実装例を示します。  
同時に、既存の `_buildRequestedMembers` 内の承認/却下ボタンで呼び出す部分を、作成したメソッドに置き換えています。

```dart
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:image_cropper/image_cropper.dart';
import 'package:image_picker/image_picker.dart';
import 'package:intl/intl.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:snpit_guild_app/domain/design/color_token.dart';
import 'package:snpit_guild_app/domain/screen.dart';
import 'package:snpit_guild_app/gen/assets.gen.dart';
import 'package:snpit_guild_app/infrastructure/snapit_guild_api/snapit_guild_api.openapi.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/guilds/get_guild.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/guilds/update_guild.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/guilds/update_guild_member.dart';
import 'package:snpit_guild_app/presentation/router/router.dart';
import 'package:snpit_guild_app/utils/extensions/uri_extensions.dart';

class GuildManagePage extends HookConsumerWidget {
  const GuildManagePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final imageFile = useState<File?>(null);
    final picker = useMemoized(ImagePicker.new);
    final guildInfoState = ref.watch(getMyGuildNotifierProvider);

    Future<void> pickAndCropImage() async {
      final pickedFile = await picker.pickImage(source: ImageSource.gallery);
      if (pickedFile == null) {
        debugPrint('Image selection cancelled');
        return;
      }

      final croppedFile = await ImageCropper().cropImage(
        sourcePath: pickedFile.path,
        aspectRatio: const CropAspectRatio(ratioX: 1, ratioY: 1),
        uiSettings: [
          AndroidUiSettings(
            hideBottomControls: true,
            lockAspectRatio: true,
          ),
          IOSUiSettings(
            aspectRatioLockEnabled: true,
          ),
        ],
      );

      if (croppedFile == null) {
        debugPrint('Cropping cancelled');
        return;
      }

      imageFile.value = File(croppedFile.path);
      debugPrint('Cropped image path: ${imageFile.value!.path}');

      // TODO: [Photo] 画像アップロードなど適切な API 呼び出し
      await ref.read(updateGuildNotifierProvider.notifier).updateGuildAvatar(
            UriExtensions.randomImageUrlWithTitle(
              // ignore: use_build_context_synchronously
              TimeOfDay.now().format(context),
            ).toString(),
          );

      // show snackbar
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Updated Successfully'),
          ),
        );
      }

      // Refresh guild information
      await ref.read(getMyGuildNotifierProvider.notifier).getMyGuild();
    }

    /// --- ここから追加/修正部分 ---

    /// 申請を却下する際の処理
    Future<void> onTapReject(
      BuildContext context,
      WidgetRef ref, {
      required String guildId,
      required String userId,
      required String userName,
    }) async {
      try {
        await ref
            .watch(rejectGuildNotifierProvider.notifier)
            .rejectGuild(guildId: guildId, userId: userId);

        // 更新
        await ref.read(getMyGuildNotifierProvider.notifier).getMyGuild();

        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('You have rejected $userName'),
            ),
          );
        }
      } catch (e, st) {
        debugPrint('Error rejecting guild member: $e\n$st');
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Error rejecting $userName: $e'),
            ),
          );
        }
      }
    }

    /// 申請を承認する際の処理
    Future<void> onTapApprove(
      BuildContext context,
      WidgetRef ref, {
      required String guildId,
      required String userId,
      required String userName,
    }) async {
      try {
        await ref
            .watch(approveGuildNotifierProvider.notifier)
            .approveGuild(guildId: guildId, userId: userId);

        // 更新
        await ref.read(getMyGuildNotifierProvider.notifier).getMyGuild();

        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('You have approved $userName'),
            ),
          );
        }
      } catch (e, st) {
        debugPrint('Error approving guild member: $e\n$st');
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Error approving $userName: $e'),
            ),
          );
        }
      }
    }

    /// --- ここまで追加/修正部分 ---

    return Scaffold(
      appBar: AppBar(title: const Text('Guild management')),
      body: guildInfoState.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stackTrace) => Center(child: Text('Error: $error')),
        data: (guildInfo) {
          if (guildInfo == null) {
            return const Center(child: Text('No guild info available.'));
          }

          final guildId = guildInfo.guildId ?? 'Unknown';
          final guildName = guildInfo.guildName ?? 'No Name';
          final guildAvatar = guildInfo.guildAvatar ?? '';
          final guildMembers = guildInfo.guildMembers ?? <GuildMemberDto>[];

          return _buildGuildManagementContent(
            context: context,
            ref: ref,
            pickAndCropImage: pickAndCropImage,
            guildId: guildId,
            guildName: guildName,
            guildAvatar: guildAvatar,
            guildMembers: guildMembers,
            // 追加した onTapReject, onTapApprove を渡す
            onTapReject: onTapReject,
            onTapApprove: onTapApprove,
          );
        },
      ),
    );
  }

  /// GuildInfoResponseDtoData の中の必要データを非オプショナルで受け取り、安全なデフォルトを使う
  Widget _buildGuildManagementContent({
    required BuildContext context,
    required WidgetRef ref,
    required Future<void> Function() pickAndCropImage,
    required String guildId,
    required String guildName,
    required String guildAvatar,
    required List<GuildMemberDto> guildMembers,
    required Future<void> Function(
      BuildContext context,
      WidgetRef ref, {
      required String guildId,
      required String userId,
      required String userName,
    })
        onTapReject,
    required Future<void> Function(
      BuildContext context,
      WidgetRef ref, {
      required String guildId,
      required String userId,
      required String userName,
    })
        onTapApprove,
  }) {
    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 32),
            // ギルドのアバター(写真)
            Center(
              child: GestureDetector(
                onTap: () async {
                  final hasPermission = await _hasPhotoPermission(context);
                  if (hasPermission) {
                    await pickAndCropImage();
                  }
                },
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: guildAvatar.isNotEmpty
                          ? Image.network(
                              guildAvatar,
                              width: 64,
                              height:

---
