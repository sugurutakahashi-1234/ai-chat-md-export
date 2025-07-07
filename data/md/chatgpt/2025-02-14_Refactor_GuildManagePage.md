# Refactor GuildManagePage

日付: 2025-02-14

---

## 👤 ユーザー
*2025/2/14 15:42:02*

\_buildRequestedMembersと \_buildGuildManagementContent は別ウィジェットに分けるのではなく、GuildManagePageに分けずに書いていきたい。
  import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter\_hooks/flutter\_hooks.dart';
import 'package:go\_router/go\_router.dart';
import 'package:hooks\_riverpod/hooks\_riverpod.dart';
import 'package:image\_cropper/image\_cropper.dart';
import 'package:image\_picker/image\_picker.dart';
import 'package:permission\_handler/permission\_handler.dart';
import 'package:snpit\_guild\_app/domain/design/color\_pallet.dart';
import 'package:snpit\_guild\_app/domain/design/color\_token.dart';
import 'package:snpit\_guild\_app/domain/screen.dart';
import 'package:snpit\_guild\_app/infrastructure/entities/extensions/camera\_dto\_x.dart';
import 'package:snpit\_guild\_app/infrastructure/snapit\_guild\_api/snapit\_guild\_api.openapi.dart';
import 'package:snpit\_guild\_app/presentation/providers/api\_client/guilds/delete\_guild.dart';
import 'package:snpit\_guild\_app/presentation/providers/api\_client/guilds/get\_guild.dart';
import 'package:snpit\_guild\_app/presentation/providers/api\_client/guilds/update\_guild.dart';
import 'package:snpit\_guild\_app/presentation/providers/api\_client/guilds/update\_guild\_member.dart';
import 'package:snpit\_guild\_app/presentation/router/router.dart';
import 'package:snpit\_guild\_app/presentation/widgets/dialogs/delete\_guild\_dialog.dart';
import 'package:snpit\_guild\_app/presentation/widgets/guild\_icon.dart';
import 'package:snpit\_guild\_app/presentation/widgets/guild\_member\_column.dart';
import 'package:snpit\_guild\_app/presentation/widgets/parameters\_bar\_column.dart';
import 'package:snpit\_guild\_app/utils/extensions/uri\_extensions.dart';
import 'package:snpit\_guild\_app/utils/snack\_bar\_utils.dart';

class GuildManagePage extends HookConsumerWidget {
  const GuildManagePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final picker = useMemoized(ImagePicker.new);
    final imageFileState = useState&lt;File?&gt;(null);
    final myGuildAsyncValue = ref.watch(getMyGuildNotifierProvider);
    final isLoadingState = useState(false);

    Future&lt;void&gt; onRefresh() async {
      try {
        await ref.read(getMyGuildNotifierProvider.notifier).getMyGuild();
      } on Exception catch (error) {
        if (context.mounted) {
          showErrorSnackBar(context, error);
        }
      }
    }

    Future&lt;void&gt; onTapDeleteGuild() async {
      final confirm = await showDialog&lt;bool&gt;(
        context: context,
        builder: (context) =&gt; const DeleteGuildDialog(),
      );

      if (confirm != true) {
        return;
      }

      try {
        await ref.read(deleteGuildNotifierProvider.notifier).deleteGuild();
        await onRefresh();

        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Guild deleted successfully.'),
            ),
          );
        }

        if (context.mounted) {
          context.pop();
        }
      } on Exception catch (error) {
        if (context.mounted) {
          showErrorSnackBar(context, error);
        }
      }
    }

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

      if (!context.mounted) {
        return;
      }

      imageFileState.value = File(croppedFile.path);
      debugPrint('Cropped image path: ${imageFileState.value!.path}');

      try {
        // TODO: \[フェーズ2\] 画像アップロードなど適切な API 呼び出し
        await ref.read(updateGuildNotifierProvider.notifier).updateGuildAvatar(
              UriExtensions.randomImageUrlWithTitle(
                // ignore: use\_build\_context\_synchronously
                TimeOfDay.now().format(context),
              ).toString(),
            );

        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Updated Successfully'),
            ),
          );
        }

        await onRefresh();
      } on Exception catch (error) {
        if (context.mounted) {
          showErrorSnackBar(context, error);
        }
      }
    }

    Future&lt;void&gt; onTapGuildPhoto() async {
      await showDialog&lt;void&gt;(
        context: context,
        builder: (context) =&gt; AlertDialog(
          insetPadding: const EdgeInsets.symmetric(horizontal: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
          backgroundColor: ColorPallet.gray800,
          title: const Text('Guild Icon Editor'),
          content: const Text(
            'Coming Soon!',
          ),
          actions: \[
            TextButton(
              onPressed: () =&gt; context.pop(),
              child: const Text('OK'),
            ),
          \],
        ),
      );

      return;

      // TODO: \[フェーズ2\] 画像アップロード機能を実装する
      // ignore: dead\_code, use\_build\_context\_synchronously
      final hasPermission = await \_hasPhotoPermission(context);
      if (hasPermission) {
        await pickAndCropImage();
      }
    }

    Future&lt;void&gt; onTapSave(String updatedText, String guildName) async {
      try {
        if (updatedText.isNotEmpty && updatedText != guildName) {
          await ref
              .read(updateGuildNotifierProvider.notifier)
              .updateGuildName(updatedText);

          // Refresh guild information
          await onRefresh();

          // show snackbar
          if (context.mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text('Guild name updated to $updatedText'),
              ),
            );
          }
        }
      } on Exception catch (error) {
        if (context.mounted) {
          showErrorSnackBar(context, error);
        }
      }
    }

    Future&lt;void&gt; onTapReject({
      required String guildId,
      required String userId,
      required String userName,
    }) async {
      try {
        await ref
            .read(rejectGuildNotifierProvider.notifier)
            .rejectGuild(guildId: guildId, userId: userId);

        // ギルド情報をリフレッシュ
        await onRefresh();

        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Rejected $userName'),
            ),
          );
        }
      } on Exception catch (error) {
        if (context.mounted) {
          showErrorSnackBar(context, error);
        }
      }
    }

    Future&lt;void&gt; onTapApprove({
      required String guildId,
      required String userId,
      required String userName,
    }) async {
      try {
        await ref
            .read(approveGuildNotifierProvider.notifier)
            .approveGuild(guildId: guildId, userId: userId);

        // ギルド情報をリフレッシュ
        await onRefresh();

        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Approved $userName'),
            ),
          );
        }
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
      \[\],
    );

    return Scaffold(
      appBar: AppBar(
        title: const Text('Guild management'),
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          await onRefresh();
        },
        color: ColorToken.primary,
        backgroundColor: ColorToken.bgLight,
        child: myGuildAsyncValue.when(
          data: (guild) {
            if (guild == null) {
              return const SizedBox.shrink();
            }

            final guildId = guild.guildId ?? 'Unknown';
            final guildName = guild.guildName ?? 'No Name';
            final guildAvatar = guild.guildAvatar ?? '';
            final guildMembers = guild.guildMembers ?? &lt;GuildMemberDto&gt;\[\];

            return SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: \_buildGuildManagementContent(
                  context: context,
                  ref: ref,
                  guildId: guildId,
                  guildName: guildName,
                  guildAvatar: guildAvatar,
                  guildMembers: guildMembers,
                  pickAndCropImage: pickAndCropImage,
                  onTapSave: onTapSave,
                  onTapGuildPhoto: onTapGuildPhoto,
                  onTapReject: onTapReject,
                  onTapApprove: onTapApprove,
                ),
              ),
            );
          },
          loading: () {
            return const Center(child: CircularProgressIndicator());
          },
          error: (error, \_) {
            return Center(child: Text('Error: $error'));
          },
        ),
      ),
    );
  }

  /// GuildInfoResponseDtoData の中の必要データを非オプショナルで受け取り、安全なデフォルトを使う
  Widget \_buildGuildManagementContent({
    required BuildContext context,
    required WidgetRef ref,
    required String guildId,
    required String guildName,
    required String guildAvatar,
    required List&lt;GuildMemberDto&gt; guildMembers,
    required Future&lt;void&gt; Function() pickAndCropImage,
    required Future&lt;void&gt; Function(String updatedText, String guildName)
        onTapSave,
    required Future&lt;void&gt; Function() onTapGuildPhoto,
    required Future&lt;void&gt; Function({
      required String guildId,
      required String userId,
      required String userName,
    }) onTapReject,
    required Future&lt;void&gt; Function({
      required String guildId,
      required String userId,
      required String userName,
    }) onTapApprove,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: \[
        const SizedBox(height: 32),
        // ギルドのアバター(写真)
        Center(
          child: GestureDetector(
            onTap: () async {
              await onTapGuildPhoto();
            },
            child: Stack(
              alignment: Alignment.center,
              children: \[
                GuildIcon(
                  guildId: guildId,
                  guildAvatar: guildAvatar,
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
                    await onTapSave(updatedText, guildName);
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
                      color: ColorPallet.gray300,
                    ),
                  ),
                  const SizedBox(
                    width: 8,
                  ),
                  Flexible(
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: \[
                        Flexible(
                          child: Text(
                            guildName,
                            style: const TextStyle(fontSize: 16),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const SizedBox(width: 8),
                        const Icon(
                          Icons.chevron\_right,
                          color: ColorToken.text,
                          size: 20,
                        ),
                      \],
                    ),
                  ),
                \],
              ),
            ),
          ),
        ),
        const SizedBox(height: 32),
        const Divider(
          color: ColorToken.secondary,
        ),
        const SizedBox(height: 32),
        // メンバー申請一覧
        \_buildRequestedMembers(
          context: context,
          ref: ref,
          guildId: guildId,
          guildMembers: guildMembers,
          onTapReject: onTapReject,
          onTapApprove: onTapApprove,
        ),

        // Padding(
        //   padding: const EdgeInsets.only(top: 24, bottom: 24),
        //   child: OutlinedButton(
        //     onPressed: isLoadingState.value
        //         ? null
        //         : () async {
        //             await onTapDeleteGuild();
        //           },
        //     child: const Text('Delete this guild'),
        //   ),
        // ),
      \],
    );
  }

  /// 申請中メンバー一覧表示
  Widget \_buildRequestedMembers({
    required BuildContext context,
    required WidgetRef ref,
    required String guildId,
    required List&lt;GuildMemberDto&gt; guildMembers,
    required Future&lt;void&gt; Function({
      required String guildId,
      required String userId,
      required String userName,
    }) onTapReject,
    required Future&lt;void&gt; Function({
      required String guildId,
      required String userId,
      required String userName,
    }) onTapApprove,
  }) {
    // guildMembers の中で、`memberStatus` が REQUESTED のものだけを抽出
    final requestedMembers = guildMembers
        .where(
          (member) =&gt;
              member.memberStatus == GuildMemberDtoMemberStatus.REQUESTED,
        )
        .toList();

    // 申請中メンバーがいない場合
    if (requestedMembers.isEmpty) {
      return const Center(
        child: Padding(
          // pulll-to-refresh でスクロールするための余白を追加
          padding: EdgeInsets.only(bottom: 180),
          child: Text('No members requesting to join.'),
        ),
      );
    }

    return Padding(
      // pulll-to-refresh でスクロールするための余白を追加
      padding: const EdgeInsets.only(bottom: 180),
      child: ListView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        itemCount: requestedMembers.length,
        itemBuilder: (context, index) {
          final member = requestedMembers\[index\];
          final userId = member.userId ?? '';
          final userName = member.username ?? '';
          final avatarUrl = member.avatar;
          final cameraList =
              member.decks?.firstOrNull?.deckCameras?.sorted() ?? \[\];

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
                child: Column(
                  children: \[
                    // ユーザー情報部分
                    Row(
                      children: \[
                        // 左側：アバター + ユーザー名
                        Expanded(
                          child: GuildMemberColumn(
                            userName: userName,
                            isGuildOwner: false,
                            userPhotoUrl: avatarUrl,
                            cameraList: cameraList,
                          ),
                        ),
                        // 右側：各種ステータス (Q, E, L, B など)
                        Expanded(
                          child: ParametersBarColumn(
                            searchQ: member.decks?.firstOrNull?.searchQ ?? 0,
                            attackE: member.decks?.firstOrNull?.attackE ?? 0,
                            luckL: member.decks?.firstOrNull?.luckL ?? 0,
                            defenseB: member.decks?.firstOrNull?.defenseB ?? 0,
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
                              await onTapReject(
                                guildId: guildId,
                                userId: userId,
                                userName: userName,
                              );
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
                              await onTapApprove(
                                guildId: guildId,
                                userId: userId,
                                userName: userName,
                              );
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
      ),
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
        insetPadding: const EdgeInsets.symmetric(horizontal: 16),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        backgroundColor: ColorPallet.gray800,
        title: const Text(
          'Permission to access photos is required',
        ),
        content: const Text(
          'Enable photo access in settings to select a photo.',
        ),
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
*2025/2/14 15:42:56*

\*\*整理中\*\*

ユーザーは`\_buildRequestedMembers`と`\_buildGuildManagementContent`を同じファイル内に残したいと考えていますが、別々のウィジェットとしてではなく、`GuildManagePage`内に残す方法を模索中です。

\*\*探る選択肢\*\*

`\_buildRequestedMembers`と`\_buildGuildManagementContent`をトップレベルのプライベート関数またはプライベート拡張メソッドとして定義する方法を模索中。

\*\*トップレベルのプライベート関数として保存\*\*

ユーザーが`\_buildRequestedMembers`と`\_buildGuildManagementContent`をファイル内に保つ方法を探る中で、これらをトップレベルのプライベート関数として記述することが有効だと気づく。

\*\*トップレベルのプライベート関数を探る\*\*

`\_buildGuildManagementContent`と`\_buildRequestedMembers`をファイル内のトップレベルのプライベート関数として定義し、`GuildManagePage.build`メソッドから呼び出す方法を検討している。

\*\*トップレベルのプライベート関数を使用\*\*

`GuildManagePage`クラス内の`\_buildGuildManagementContent`と`\_buildRequestedMembers`を外し、ファイル内のトップレベルのプライベート関数として定義する進展を見ている。

---

## 🤖 アシスタント
*2025/2/14 15:42:56*

以下のサンプルのように **トップレベル関数**として `_buildGuildManagementContent` と `_buildRequestedMembers` を切り出す方法が最もシンプルかと思います。  
「別ウィジェット（クラス）として切り出す」わけではなく、「`GuildManagePage` クラスの中から切り出す」だけなので、**同じファイル**にトップレベル関数として置いておき、`GuildManagePage.build` の中で呼び出すようにすればOKです。

```dart
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:image_cropper/image_cropper.dart';
import 'package:image_picker/image_picker.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:snpit_guild_app/domain/design/color_pallet.dart';
import 'package:snpit_guild_app/domain/design/color_token.dart';
import 'package:snpit_guild_app/domain/screen.dart';
import 'package:snpit_guild_app/infrastructure/entities/extensions/camera_dto_x.dart';
import 'package:snpit_guild_app/infrastructure/snapit_guild_api/snapit_guild_api.openapi.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/guilds/delete_guild.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/guilds/get_guild.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/guilds/update_guild.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/guilds/update_guild_member.dart';
import 'package:snpit_guild_app/presentation/router/router.dart';
import 'package:snpit_guild_app/presentation/widgets/dialogs/delete_guild_dialog.dart';
import 'package:snpit_guild_app/presentation/widgets/guild_icon.dart';
import 'package:snpit_guild_app/presentation/widgets/guild_member_column.dart';
import 'package:snpit_guild_app/presentation/widgets/parameters_bar_column.dart';
import 'package:snpit_guild_app/utils/extensions/uri_extensions.dart';
import 'package:snpit_guild_app/utils/snack_bar_utils.dart';

class GuildManagePage extends HookConsumerWidget {
  const GuildManagePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final picker = useMemoized(ImagePicker.new);
    final imageFileState = useState<File?>(null);
    final myGuildAsyncValue = ref.watch(getMyGuildNotifierProvider);
    final isLoadingState = useState(false);

    Future<void> onRefresh() async {
      try {
        await ref.read(getMyGuildNotifierProvider.notifier).getMyGuild();
      } on Exception catch (error) {
        if (context.mounted) {
          showErrorSnackBar(context, error);
        }
      }
    }

    Future<void> onTapDeleteGuild() async {
      final confirm = await showDialog<bool>(
        context: context,
        builder: (context) => const DeleteGuildDialog(),
      );

      if (confirm != true) {
        return;
      }

      try {
        await ref.read(deleteGuildNotifierProvider.notifier).deleteGuild();
        await onRefresh();

        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Guild deleted successfully.'),
            ),
          );
          context.pop();
        }
      } on Exception catch (error) {
        if (context.mounted) {
          showErrorSnackBar(context, error);
        }
      }
    }

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

      if (!context.mounted) {
        return;
      }

      imageFileState.value = File(croppedFile.path);
      debugPrint('Cropped image path: ${imageFileState.value!.path}');

      try {
        // TODO: [フェーズ2] 画像アップロードなど適切な API 呼び出し
        await ref.read(updateGuildNotifierProvider.notifier).updateGuildAvatar(
              UriExtensions.randomImageUrlWithTitle(
                TimeOfDay.now().format(context),
              ).toString(),
            );

        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Updated Successfully'),
            ),
          );
        }

        await onRefresh();
      } on Exception catch (error) {
        if (context.mounted) {
          showErrorSnackBar(context, error);
        }
      }
    }

    Future<void> onTapGuildPhoto() async {
      await showDialog<void>(
        context: context,
        builder: (context) => AlertDialog(
          insetPadding: const EdgeInsets.symmetric(horizontal: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
          backgroundColor: ColorPallet.gray800,
          title: const Text('Guild Icon Editor'),
          content: const Text(
            'Coming Soon!',
          ),
          actions: [
            TextButton(
              onPressed: () => context.pop(),
              child: const Text('OK'),
            ),
          ],
        ),
      );

      return;

      // TODO: [フェーズ2] 画像アップロード機能を実装する
      // ignore: dead_code, use_build_context_synchronously
      final hasPermission = await _hasPhotoPermission(context);
      if (hasPermission) {
        await pickAndCropImage();
      }
    }

    Future<void> onTapSave(String updatedText, String guildName) async {
      try {
        if (updatedText.isNotEmpty && updatedText != guildName) {
          await ref
              .read(updateGuildNotifierProvider.notifier)
              .updateGuildName(updatedText);

          // Refresh guild information
          await onRefresh();

          // show snackbar
          if (context.mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text('Guild name updated to $updatedText'),
              ),
            );
          }
        }
      } on Exception catch (error) {
        if (context.mounted) {
          showErrorSnackBar(context, error);
        }
      }
    }

    Future<void> onTapReject({
      required String guildId,
      required String userId,
      required String userName,
    }) async {
      try {
        await ref
            .read(rejectGuildNotifierProvider.notifier)
            .rejectGuild(guildId: guildId, userId: userId);

        await onRefresh();
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Rejected $userName'),
            ),
          );
        }
      } on Exception catch (error) {
        if (context.mounted) {
          showErrorSnackBar(context, error);
        }
      }
    }

    Future<void> onTapApprove({
      required String guildId,
      required String userId,
      required String userName,
    }) async {
      try {
        await ref
            .read(approveGuildNotifierProvider.notifier)
            .approveGuild(guildId: guildId, userId: userId);

        await onRefresh();
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Approved $userName'),
            ),
          );
        }
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
        title: const Text('Guild management'),
      ),
      body: RefreshIndicator(
        onRefresh: onRefresh,
        color: ColorToken.primary,
        backgroundColor: ColorToken.bgLight,
        child: myGuildAsyncValue.when(
          data: (guild) {
            if (guild == null) {
              return const SizedBox.shrink();
            }

            final guildId = guild.guildId ?? 'Unknown';
            final guildName = guild.guildName ?? 'No Name';
            final guildAvatar = guild.guildAvatar ?? '';
            final guildMembers = guild.guildMembers ?? <GuildMemberDto>[];

            // ─────────────────────────────────────────
            // ここでトップレベル関数を呼び出す
            // ─────────────────────────────────────────
            return SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: _buildGuildManagementContent(
                  context: context,
                  ref: ref,
                  guildId: guildId,
                  guildName: guildName,
                  guildAvatar: guildAvatar,
                  guildMembers: guildMembers,
                  onTapGuildPhoto: onTapGuildPhoto,
                  pickAndCropImage: pickAndCropImage,
                  onTapSave: onTapSave,
                  onTapReject: onTapReject,
                  onTapApprove: onTapApprove,
                ),
              ),
            );
          },
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (error, _) => Center(child: Text('Error: $error')),
        ),
      ),
    );
  }

  /// 写真の権限をチェックして、権限があれば true を返す
  Future<bool> _hasPhotoPermission(BuildContext context) async {
    final status = await Permission.photos.request();

    switch (status) {
      case PermissionStatus.granted:
      case PermissionStatus.limited:
        // 許可済み
        return true;
      case PermissionStatus.permanentlyDenied:
        // 永久に拒否されている場合
        if (context.mounted) {
          _showPermissionDialog(context);
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
  void _showPermissionDialog(BuildContext context) {
    showDialog<void>(
      context: context,
      builder: (context) => AlertDialog(
        insetPadding: const EdgeInsets.symmetric(horizontal: 16),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        backgroundColor: ColorPallet.gray800,
        title: const Text(
          'Permission to access photos is required',
        ),
        content: const Text(
          'Enable photo access in settings to select a photo.',
        ),
        actions: [
          TextButton(
            onPressed: () => context.pop(),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () async {
              await openAppSettings();
            },
            child: const Text('Open Settings'),
          ),
        ],
      ),
    );
  }
}

///
/// トップレベル関数として切り出した例
/// 

/// ギルド管理UI全体をビルドする関数
Widget _buildGuildManagementContent({
  required BuildContext context,
  required WidgetRef ref,
  required String guildId,
  required String guildName,
  required String guildAvatar,
  required List<GuildMemberDto> guildMembers,
  required Future<void> Function() pickAndCropImage,
  required Future<void> Function(String updatedText, String guildName) onTapSave,
  required Future<void> Function() onTapGuildPhoto,
  required Future<void> Function({
    required String guildId,
    required String userId,
    required String userName,
  }) onTapReject,
  required Future<void> Function({
    required String guildId,
    required String userId,
    required String userName,
  }) onTapApprove,
}) {
  return Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      const SizedBox(height: 32),
      // ギルドのアバター
      Center(
        child: GestureDetector(
          onTap: onTapGuildPhoto,
          child: Stack(
            alignment: Alignment.center,
            children: [
              GuildIcon(
                guildId: guildId,
                guildAvatar: guildAvatar,
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
                Icons.camera_alt,
                size: 24,
                color: Colors.white,
              ),
            ],
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
                  await onTapSave(updatedText, guildName);
                },
              ),
            );
          },
          borderRadius: BorderRadius.circular(8),
          child: Container(
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Name',
                  style: TextStyle(
                    fontSize: 16,
                    color: ColorPallet.gray300,
                  ),
                ),
                const SizedBox(width: 8),
                Flexible(
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Flexible(
                        child: Text(
                          guildName,
                          style: const TextStyle(fontSize: 16),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      const SizedBox(width: 8),
                      const Icon(
                        Icons.chevron_right,
                        color: ColorToken.text,
                        size: 20,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
      const SizedBox(height: 32),
      const Divider(color: ColorToken.secondary),
      const SizedBox(height: 32),
      // 申請中メンバー表示
      _buildRequestedMembers(
        context: context,
        guildId: guildId,
        guildMembers: guildMembers,
        onTapReject: onTapReject,
        onTapApprove: onTapApprove,
      ),
      // ギルド削除ボタンなど必要があれば追加...
      // 例:
      // Padding(
      //   padding: const EdgeInsets.only(top: 24, bottom: 24),
      //   child: OutlinedButton(
      //     onPressed: () => ...
      //     child: const Text('Delete this guild'),
      //   ),
      // ),
    ],
  );
}

/// 申請中メンバー一覧表示用の関数
Widget _buildRequestedMembers({
  required BuildContext context,
  required String guildId,
  required List<GuildMemberDto> guildMembers,
  required Future<void> Function({
    required String guildId,
    required String userId,
    required String userName,
  }) onTapReject,
  required Future<void> Function({
    required String guildId,
    required String userId,
    required String userName,
  }) onTapApprove,
}) {
  final requestedMembers = guildMembers
      .where(
        (member) =>
            member.memberStatus == GuildMemberDtoMemberStatus.REQUESTED,
      )
      .toList();

  if (requestedMembers.isEmpty) {
    return const Center(
      child: Padding(
        padding: EdgeInsets.only(bottom: 180),
        child: Text('No members requesting to join.'),
      ),
    );
  }

  return Padding(
    padding: const EdgeInsets.only(bottom: 180),
    child: ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: requestedMembers.length,
      itemBuilder: (context, index) {
        final member = requestedMembers[index];
        final userId = member.userId ?? '';
        final userName = member.username ?? '';
        final avatarUrl = member.avatar;
        final cameraList = member.decks?.firstOrNull?.deckCameras?.sorted() ?? [];

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
              child: Column(
                children: [
                  // ユーザー情報部分
                  Row(
                    children: [
                      Expanded(
                        child: GuildMemberColumn(
                          userName: userName,
                          isGuildOwner: false,
                          userPhotoUrl: avatarUrl,
                          cameraList: cameraList,
                        ),
                      ),
                      Expanded(
                        child: ParametersBarColumn(
                          searchQ: member.decks?.firstOrNull?.searchQ ?? 0,
                          attackE: member.decks?.firstOrNull?.attackE ?? 0,
                          luckL: member.decks?.firstOrNull?.luckL ?? 0,
                          defenseB: member.decks?.firstOrNull?.defenseB ?? 0,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  // 承認・却下ボタン
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Flexible(
                        child: OutlinedButton(
                          onPressed: () async {
                            await onTapReject(
                              guildId: guildId,
                              userId: userId,
                              userName: userName,
                            );
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
                            await onTapApprove(
                              guildId: guildId,
                              userId: userId,
                              userName: userName,
                            );
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
                    ],
                  ),
                ],
              ),
            ),
          ),
        );
      },
    ),
  );
}
```

---

### ポイント

1. `GuildManagePage` クラスの中にあった `_buildXXX` 系メソッドを、**クラス外のトップレベル関数**（同ファイル内）として移動しています。  
   - 引数に `BuildContext` や必要なパラメータを渡し、戻り値として `Widget` を返すかたちにするとシンプルです。
   - 今回は「別ウィジェットのクラスを作る」わけではなく、あくまで関数として UI を組み立てています。

2. `GuildManagePage` クラスからは、
   ```dart
   child: _buildGuildManagementContent(
     context: context,
     ref: ref,
     guildId: guildId,
     ...
   )
   ```
   といった形で呼び出すだけにすることで、`GuildManagePage` の `build` がすっきりします。

3. 完全に「別ファイル」に切り出したい場合でも、やり方はほぼ同じです。  
   - ただし別ファイルに移動するときは、関数やクラスがアクセスするプロパティの可視性（public/private）に気をつけてください。
   - 「同ファイルでよい」のであればそのままトップレベル関数として置いておくのが手軽です。

これにより、**「別ウィジェットとしてクラスを分割はせず」かつ「`GuildManagePage` の中には書かずに外に出しておく」**という要望を満たしつつ、コードの見通しを良くできます。

---
