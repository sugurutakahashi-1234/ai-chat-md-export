# ListView.builder エラー解決

Date: 2025-01-07

---

## 👤 User
*2025-01-07 18:06:28*

エラーになっている。
ListView.builder(の部分が怪しい

import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:image_cropper/image_cropper.dart';
import 'package:image_picker/image_picker.dart';
import 'package:intl/intl.dart';
import 'package:snpit_guild_app/domain/screen.dart';
import 'package:snpit_guild_app/presentation/design_token/color_token.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/guilds/get_guild_info.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/guilds/update_guild.dart';
import 'package:snpit_guild_app/presentation/router/router.dart';
import 'package:snpit_guild_app/utils/extensions/uri_extensions.dart';

class GuildManagePage extends HookConsumerWidget {
  const GuildManagePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final imageFile = useState&lt;File?&gt;(null);
    final picker = useMemoized(ImagePicker.new);

    final guildInfoAsyncValue = ref.watch(getMyGuildNotifierProvider);

    Future&lt;void&gt; pickAndCropImage() async {
      final pickedFile = await picker.pickImage(source: ImageSource.gallery);

      if (pickedFile != null) {
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

        if (croppedFile != null) {
          imageFile.value = File(croppedFile.path);
          debugPrint('Cropped image path: ${imageFile.value!.path}');

          // TODO: 画像を保存するAPIを呼び出す
          await ref
              .read(updateGuildNotifierProvider.notifier)
              .updateGuildAvatar(
                UriExtensions.randomImageUrlWithTitle(
                  // ignore: use_build_context_synchronously
                  TimeOfDay.now().format(context),
                ).toString(),
              );

          // Refresh guild information.
          await ref.read(getMyGuildNotifierProvider.notifier).executeRequest();
        } else {
          debugPrint('Cropping cancelled');
        }
      } else {
        debugPrint('Image selection cancelled');
      }
    }

    return Scaffold(
      appBar: AppBar(title: const Text('Guild management')),
      body: guildInfoAsyncValue.when(
        loading: () =&gt; const Center(child: CircularProgressIndicator()),
        error: (error, stackTrace) =&gt; Center(child: Text('Error: $error')),
        data: (guildInfo) {
          final guildName = guildInfo?.guildName ?? 'No Name';
          // TODO: 画像が取得できるようになったらコメントアウトを外す
          // final guildAvatar = guildInfo?.guildAvatar;
          final String? guildAvatar =
              guildInfo?.guildAvatar ?? UriExtensions.random.toString();

          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 32),
                Center(
                  child: GestureDetector(
                    onTap: pickAndCropImage,
                    child: Stack(
                      alignment: Alignment.center,
                      children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: guildAvatar != null
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
                                    Icons.hide_image_outlined,
                                    size: 48,
                                    color: ColorToken.text,
                                  ),
                                ),
                        ),
                        Container(
                          width: 64,
                          height: 64,
                          decoration: BoxDecoration(
                            color: Colors.black.withValues(alpha: 0.7),
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

                              await ref
                                  .read(getMyGuildNotifierProvider.notifier)
                                  .executeRequest();
                            }
                          },
                        ),
                      );
                    },
                    borderRadius: BorderRadius.circular(8),
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        vertical: 8,
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Name',
                            style: TextStyle(
                              fontSize: 16,
                              color: ColorToken.border,
                            ),
                          ),
                          Row(
                            children: [
                              Text(
                                guildName,
                                style: const TextStyle(
                                  fontSize: 16,
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
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 32),
                const Divider(
                  color: ColorToken.secondary,
                  thickness: 1,
                ),
                const SizedBox(height: 32),
                ListView.builder(
                  itemCount: guildInfo?.guildMembers?.length ?? 0,
                  itemBuilder: (context, index) {
                    final member = guildInfo?.guildMembers![index];
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
                            children: [
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: [
                                        CircleAvatar(
                                          radius: 16,
                                          backgroundImage: NetworkImage(
                                            UriExtensions.randomImageUrl
                                                .toString(),
                                          ),
                                        ),
                                        const SizedBox(
                                          width: 12,
                                        ),
                                        Expanded(
                                          child: Text(
                                            member?.userId ?? 'Unknown',
                                            maxLines: 1,
                                            overflow: TextOverflow.ellipsis,
                                            style: const TextStyle(
                                              color: Colors.white,
                                              fontSize: 16,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 10),
                                    Row(
                                      children: List.generate(
                                        4,
                                        (badgeIndex) =&gt; Padding(
                                          padding: const EdgeInsets.only(
                                            right: 4,
                                          ),
                                          child: ClipRRect(
                                            borderRadius: BorderRadius.circular(
                                              4,
                                            ),
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
                                  ],
                                ),
                              ),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.end,
                                  children: [
                                    _buildStatRow('Q', 13),
                                    _buildStatRow('E', 48),
                                    _buildStatRow('L', 7),
                                    _buildStatRow('B', 5),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildStatRow(String label, int value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.end,
      children: [
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
      ],
    );
  }
}

---

## 🤖 Assistant
*2025-01-07 18:07:08*

`ListView.builder`を使用する場合、いくつかの注意点をチェックしてエラーの原因を特定できます。このコードで問題が発生する可能性が高い点を以下に列挙します。

---

### 問題の可能性

1. **`ListView.builder`が`Column`内で直接使用されている**
   - `Column`内に`ListView.builder`を直接入れると、スクロールが適切に機能しない場合があります。
   - `ListView.builder`はスクロール可能なウィジェットであるため、`Column`と競合する可能性があります。

   **解決策:**
   - `ListView.builder`を`Expanded`または`Flexible`でラップしてください。

   ```dart
   Expanded(
     child: ListView.builder(
       itemCount: guildInfo?.guildMembers?.length ?? 0,
       itemBuilder: (context, index) {
         final member = guildInfo?.guildMembers![index];
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
                 children: [
                   Expanded(
                     child: Column(
                       crossAxisAlignment: CrossAxisAlignment.start,
                       children: [
                         Row(
                           children: [
                             CircleAvatar(
                               radius: 16,
                               backgroundImage: NetworkImage(
                                 UriExtensions.randomImageUrl.toString(),
                               ),
                             ),
                             const SizedBox(width: 12),
                             Expanded(
                               child: Text(
                                 member?.userId ?? 'Unknown',
                                 maxLines: 1,
                                 overflow: TextOverflow.ellipsis,
                                 style: const TextStyle(
                                   color: Colors.white,
                                   fontSize: 16,
                                   fontWeight: FontWeight.bold,
                                 ),
                               ),
                             ),
                           ],
                         ),
                         const SizedBox(height: 10),
                         Row(
                           children: List.generate(
                             4,
                             (badgeIndex) => Padding(
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
                       ],
                     ),
                   ),
                   Expanded(
                     child: Column(
                       crossAxisAlignment: CrossAxisAlignment.end,
                       children: [
                         _buildStatRow('Q', 13),
                         _buildStatRow('E', 48),
                         _buildStatRow('L', 7),
                         _buildStatRow('B', 5),
                       ],
                     ),
                   ),
                 ],
               ),
             ),
           ),
         );
       },
     ),
   )
   ```

2. **`guildMembers`が`null`の可能性**
   - `guildInfo?.guildMembers`が`null`の場合、`ListView.builder`でエラーが発生する可能性があります。

   **解決策:**
   - 空リストを使用するようにデフォルト値を設定します。

   ```dart
   itemCount: guildInfo?.guildMembers?.length ?? 0,
   ```

3. **`_buildStatRow`のエラー**
   - `LinearProgressIndicator`内の`borderRadius`が原因でエラーになる場合があります（非標準のプロパティなど）。
   - この部分を確認してください。

4. **`guildAvatar`が`null`で`Image.network`に渡される**
   - `guildAvatar`が`null`の場合、`Image.network`でエラーが発生します。

   **解決策:**
   - `guildAvatar`が`null`の場合のデフォルト画像を指定します。

   ```dart
   guildAvatar != null
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
           Icons.hide_image_outlined,
           size: 48,
           color: ColorToken.text,
         ),
       ),
   ```

---

これらの修正を行うことで、エラーが解消する可能性があります。試してみてください！

---
