# onPressedをref.listenに変更

日付: 2024-12-24

---

## 👤 ユーザー
*2024/12/24 14:59:50*

onPressed のstateのハンドリング処理をref.listenに書き換えて欲しい

import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:image_cropper/image_cropper.dart';
import 'package:image_picker/image_picker.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/guilds/create_guild.dart';
import 'package:snpit_guild_app/presentation/providers/on_created_guild.dart';

class GuildCreatePage extends HookConsumerWidget {
  const GuildCreatePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final imageFile = useState&lt;File?&gt;(null);
    final picker = useMemoized(ImagePicker.new);

    /// 写真を選択して円状にクロップする
    Future&lt;void&gt; pickAndCropImage() async {
      final pickedFile = await picker.pickImage(source: ImageSource.gallery);

      if (pickedFile != null) {
        final croppedFile = await ImageCropper().cropImage(
          sourcePath: pickedFile.path,
          aspectRatio: const CropAspectRatio(ratioX: 1, ratioY: 1), // 正方形にクロップ
          uiSettings: [
            AndroidUiSettings(
              hideBottomControls: true, // ボトムコントロール非表示
              lockAspectRatio: true, // アスペクト比を固定
            ),
            IOSUiSettings(
              aspectRatioLockEnabled: true, // アスペクト比を固定
            ),
          ],
        );

        if (croppedFile != null) {
          imageFile.value = File(croppedFile.path);
        } else {
          debugPrint('クロップがキャンセルされました');
        }
      } else {
        debugPrint('画像選択がキャンセルされました');
      }
    }

    /// 写真を削除
    void deleteImage() {
      imageFile.value = null;
      debugPrint('画像が削除されました');
    }

    return Scaffold(
      appBar: AppBar(title: const Text('GuildCreatePage')),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            imageFile.value != null
                ? Column(
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: Image.file(
                          imageFile.value!,
                          width: 150,
                          height: 150,
                          fit: BoxFit.cover,
                        ),
                      ),
                      const SizedBox(height: 10),
                      ElevatedButton(
                        onPressed: deleteImage,
                        child: const Text('画像を削除'),
                      ),
                    ],
                  )
                : const Text('画像が選択されていません'),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () async {
                final hasPermission = await hasPhotoPermission(context);
                if (hasPermission) {
                  await pickAndCropImage();
                }
              },
              child: const Text('ギルドアイコンを選択'),
            ),
            ElevatedButton(
              onPressed: () async {
                await ref
                    .read(createGuildNotifierProvider.notifier)
                    .executeRequest('TODO: ギルド名を入力');

                final state = ref.read(createGuildNotifierProvider);

                if (state is AsyncData) {
                  if (context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('ギルドが作成されました！')),
                    );
                    ref.read(onCreatedGuildNotifierProvider.notifier).trigger();
                    context.pop();
                  }
                } else if (state is AsyncError) {
                  if (context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('ギルドの作成に失敗しました。')),
                    );
                  }
                }
              },
              child: const Text('Create'),
            ),
          ],
        ),
      ),
    );
  }

  /// 写真の権限をチェックして、権限があれば true を返す
  Future&lt;bool&gt; hasPhotoPermission(BuildContext context) async {
    final status = await Permission.photos.request();

    switch (status) {
      case PermissionStatus.granted:
      case PermissionStatus.limited:
        // 許可済みの場合
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
            const SnackBar(content: Text('写真へのアクセスが許可されていません。')),
          );
        }
        return false;
    }
  }

  /// 設定ダイアログを表示
  void _showPermissionDialog(BuildContext context) {
    showDialog&lt;void&gt;(
      context: context,
      builder: (context) =&gt; AlertDialog(
        title: const Text('写真へのアクセス許可が必要です'),
        content: const Text('写真を選択するには、設定で写真へのアクセス許可をオンにしてください。'),
        actions: [
          TextButton(
            onPressed: () {
              context.pop();
            },
            child: const Text('キャンセル'),
          ),
          TextButton(
            onPressed: () async =&gt; openAppSettings(),
            child: const Text('設定を開く'),
          ),
        ],
      ),
    );
  }
}

---

## 🤖 アシスタント
*2024/12/24 15:00:29*

以下のように、`onPressed` のハンドリングを `ref.listen` を使用したコードに変更しました。この方法では、`createGuildNotifierProvider` の状態の変化をリッスンし、適切な UI の更新や操作を行います。

---

## 🤖 アシスタント
*2024/12/24 15:00:29*

{"name": "guild_create_ref_listen", "type": "code/dart", "content": "import 'dart:io';\n\nimport 'package:flutter/material.dart';\nimport 'package:flutter_hooks/flutter_hooks.dart';\nimport 'package:go_router/go_router.dart';\nimport 'package:hooks_riverpod/hooks_riverpod.dart';\nimport 'package:image_cropper/image_cropper.dart';\nimport 'package:image_picker/image_picker.dart';\nimport 'package:permission_handler/permission_handler.dart';\nimport 'package:snpit_guild_app/presentation/providers/api_client/guilds/create_guild.dart';\nimport 'package:snpit_guild_app/presentation/providers/on_created_guild.dart';\n\nclass GuildCreatePage extends HookConsumerWidget {\n  const GuildCreatePage({super.key});\n\n  @override\n  Widget build(BuildContext context, WidgetRef ref) {\n    final imageFile = useState&lt;File?&gt;(null);\n    final picker = useMemoized(ImagePicker.new);\n\n    /// 写真を選択して円状にクロップする\n    Future&lt;void&gt; pickAndCropImage() async {\n      final pickedFile = await picker.pickImage(source: ImageSource.gallery);\n\n      if (pickedFile != null) {\n        final croppedFile = await ImageCropper().cropImage(\n          sourcePath: pickedFile.path,\n          aspectRatio: const CropAspectRatio(ratioX: 1, ratioY: 1), // 正方形にクロップ\n          uiSettings: [\n            AndroidUiSettings(\n              hideBottomControls: true, // ボトムコントロール非表示\n              lockAspectRatio: true, // アスペクト比を固定\n            ),\n            IOSUiSettings(\n              aspectRatioLockEnabled: true, // アスペクト比を固定\n            ),\n          ],\n        );\n\n        if (croppedFile != null) {\n          imageFile.value = File(croppedFile.path);\n        } else {\n          debugPrint('クロップがキャンセルされました');\n        }\n      } else {\n        debugPrint('画像選択がキャンセルされました');\n      }\n    }\n\n    /// 写真を削除\n    void deleteImage() {\n      imageFile.value = null;\n      debugPrint('画像が削除されました');\n    }\n\n    ref.listen&lt;AsyncValue&gt;(createGuildNotifierProvider, (previous, next) {\n      if (next is AsyncData) {\n        if (context.mounted) {\n          ScaffoldMessenger.of(context).showSnackBar(\n            const SnackBar(content: Text('ギルドが作成されました！')),\n          );\n          ref.read(onCreatedGuildNotifierProvider.notifier).trigger();\n          context.pop();\n        }\n      } else if (next is AsyncError) {\n        if (context.mounted) {\n          ScaffoldMessenger.of(context).showSnackBar(\n            const SnackBar(content: Text('ギルドの作成に失敗しました。')),\n          );\n        }\n      }\n    });\n\n    return Scaffold(\n      appBar: AppBar(title: const Text('GuildCreatePage')),\n      body: Padding(\n        padding: const EdgeInsets.symmetric(horizontal: 24),\n        child: Column(\n          mainAxisAlignment: MainAxisAlignment.center,\n          children: [\n            imageFile.value != null\n                ? Column(\n                    children: [\n                      ClipRRect(\n                        borderRadius: BorderRadius.circular(8),\n                        child: Image.file(\n                          imageFile.value!,\n                          width: 150,\n                          height: 150,\n                          fit: BoxFit.cover,\n                        ),\n                      ),\n                      const SizedBox(height: 10),\n                      ElevatedButton(\n                        onPressed: deleteImage,\n                        child: const Text('画像を削除'),\n                      ),\n                    ],\n                  )\n                : const Text('画像が選択されていません'),\n            const SizedBox(height: 20),\n            ElevatedButton(\n              onPressed: () async {\n                final hasPermission = await hasPhotoPermission(context);\n                if (hasPermission) {\n                  await pickAndCropImage();\n                }\n              },\n              child: const Text('ギルドアイコンを選択'),\n            ),\n            ElevatedButton(\n              onPressed: () async {\n                await ref\n                    .read(createGuildNotifierProvider.notifier)\n                    .executeRequest('TODO: ギルド名を入力');\n              },\n              child: const Text('Create'),\n            ),\n          ],\n        ),\n      ),\n    );\n  }\n\n  /// 写真の権限をチェックして、権限があれば true を返す\n  Future&lt;bool&gt; hasPhotoPermission(BuildContext context) async {\n    final status = await Permission.photos.request();\n\n    switch (status) {\n      case PermissionStatus.granted:\n      case PermissionStatus.limited:\n        // 許可済みの場合\n        return true;\n\n      case PermissionStatus.permanentlyDenied:\n        // 永久に拒否されている場合\n        if (context.mounted) {\n          _showPermissionDialog(context);\n        }\n        return false;\n\n      case PermissionStatus.denied:\n      case PermissionStatus.restricted:\n      case PermissionStatus.provisional:\n        // その他の場合\n        if (context.mounted) {\n          ScaffoldMessenger.of(context).showSnackBar(\n            const SnackBar(content: Text('写真へのアクセスが許可されていません。')),\n          );\n        }\n        return false;\n    }\n  }\n\n  /// 設定ダイアログを表示\n  void _showPermissionDialog(BuildContext context) {\n    showDialog&lt;void&gt;(\n      context: context,\n      builder: (context) =&gt; AlertDialog(\n        title: const Text('写真へのアクセス許可が必要です'),\n        content: const Text('写真を選択するには、設定で写真へのアクセス許可をオンにしてください。'),\n        actions: [\n          TextButton(\n            onPressed: () {\n              context.pop();\n            },\n            child: const Text('キャンセル'),\n          ),\n          TextButton(\n            onPressed: () async =&gt; openAppSettings(),\n            child: const Text('設定を開く'),\n          ),\n        ],\n      ),\n    );\n  }\n}"}

---

## 🔧 ツール
*2024/12/24 15:00:29*

{"result": "Successfully created text document 'guild_create_ref_listen' which will be referenced in all future messages with the unique identifier textdoc_id: '676a4dfbc764819182b56dfba2784b1a'", "textdoc_id": "676a4dfbc764819182b56dfba2784b1a", "name": "guild_create_ref_listen"}

---

## 🤖 アシスタント
*2024/12/24 15:00:29*

このコードでは、`ref.listen` を利用して `createGuildNotifierProvider` の状態を監視しています。これにより、`onPressed` 内の状態判定ロジックが削除され、状態変化が UI に即時反映される設計となります。必要に応じて追加の変更や調整が可能です。

---
