# Scaffold UI 最適化

日付: 2025-01-09

---

## 👤 ユーザー
*2025/1/9 21:20:09*

Widget child = の定義とfinal items = \[の定義を分割せずにScaffoldのところに直接書いてほしい

import 'package:flutter/material.dart';
import 'package:flutter\_hooks/flutter\_hooks.dart';
import 'package:go\_router/go\_router.dart';
import 'package:hooks\_riverpod/hooks\_riverpod.dart';
import 'package:snpit\_guild\_app/domain/screen.dart';
import 'package:snpit\_guild\_app/infrastructure/snapit\_guild\_api/snapit\_guild\_api.openapi.dart';
import 'package:snpit\_guild\_app/presentation/design\_token/color\_pallet.dart';
import 'package:snpit\_guild\_app/presentation/design\_token/color\_token.dart';
import 'package:snpit\_guild\_app/presentation/entities/extensions/spot\_detail\_dto\_rarity\_x.dart';
import 'package:snpit\_guild\_app/presentation/providers/api\_client/spots/get\_spot\_detail\_info.dart';

class SpotDetailPage extends HookConsumerWidget {
  const SpotDetailPage({super.key, required this.spotId});
  final String spotId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // ① SpotDetailNotifier の状態を監視
    final spotDetailState = ref.watch(getSpotDetailNotifierProvider);

    // ② マウント時または spotId が変わるたびに API をコール
    useEffect(() {
      WidgetsBinding.instance.addPostFrameCallback((\_) {
        ref.read(getSpotDetailNotifierProvider.notifier).getSpotDetail(spotId);
      });
      return null; // cleanup は不要
    }, \[spotId\]);

    // ③ spotDetailState の状態に応じて UI を分岐
    Widget child = const SizedBox.shrink();
    spotDetailState.when(
      loading: () {
        child = const Center(child: CircularProgressIndicator());
      },
      error: (err, stack) {
        child = Center(
          child: Text('Error: $err'),
        );
      },
      data: (spotDetail) {
        // spotDetail が null の可能性を考慮
        if (spotDetail == null) {
          return const Center(child: Text('No data'));
        }

        final adminPhotoUrl = () {
          final photos = spotDetail.spotPhotos ?? \[\];
          final adminPhotos = photos.where(
            (photo) =&gt; photo.photoType == SpotPhotoDTOPhotoType.ADMIN\_PHOTOS,
          );
          return adminPhotos.isNotEmpty ? adminPhotos.first.photoUrl : null;
        }();

        // 難易度などの例
        final rarityLabel = spotDetail.rarity?.label ?? '';
        final rarityColor = spotDetail.rarity?.color ?? ColorToken.border;
        final holder = spotDetail.guildId ?? 'No Guild';

        // ListTile の文字列を差し替えたりなど
        final items = \[
          ListTile(
            contentPadding: const EdgeInsets.symmetric(horizontal: 16),
            title: const Text('Difficulty level'),
            trailing: CircleAvatar(
              backgroundColor: ColorPallet.gray1000,
              child: Text(
                rarityLabel,
                style: TextStyle(
                  fontSize: 18,
                  color: rarityColor,
                ),
              ),
            ),
          ),
          ListTile(
            contentPadding: const EdgeInsets.symmetric(horizontal: 16),
            title: const Text(
              'Holder',
              style: TextStyle(fontSize: 14),
            ),
            trailing: Row(
              mainAxisSize: MainAxisSize.min,
              children: \[
                Text(
                  holder,
                  style: const TextStyle(fontSize: 14),
                ),
                const SizedBox(width: 8),
                const Icon(
                  Icons.arrow\_forward\_ios,
                  size: 16,
                  color: ColorToken.text,
                ),
              \],
            ),
            onTap: () {
              // TODO: spotId を付与する
              context.push(Screen.ourSpotDetail.path);
            },
          ),
        \];

        child = SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: \[
              AspectRatio(
                aspectRatio: 1,
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: Stack(
                    fit: StackFit.expand,
                    children: \[
                      // 角丸にボーダーを入れるには Container + Padding を使う
                      Container(
                        decoration: BoxDecoration(
                          border: Border.all(
                            color: Colors.white,
                            width: 2,
                          ),
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.all(2),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: Image.network(
                            adminPhotoUrl!, // TODO: null safety
                            fit: BoxFit.cover,
                            loadingBuilder: (context, child, loadingProgress) {
                              if (loadingProgress == null) {
                                return child;
                              }
                              return const Center(
                                child: CircularProgressIndicator(),
                              );
                            },
                            errorBuilder: (context, error, stackTrace) {
                              debugPrint('Image loading error: $error');
                              return const Center(
                                child: Icon(
                                  Icons.error,
                                  color: ColorToken.error,
                                ),
                              );
                            },
                          ),
                        ),
                      ),
                    \],
                  ),
                ),
              ),
              const SizedBox(height: 16),
              DecoratedBox(
                decoration: BoxDecoration(
                  color: ColorToken.bg,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                    color: ColorToken.border,
                    width: 0.5,
                  ),
                ),
                // ListView.separated() で実装すると最後の要素に謎の余白が生じたため Column で実装
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: List.generate(
                    items.length,
                    (index) =&gt; Column(
                      children: \[
                        items\[index\],
                        if (index &lt; items.length - 1)
                          Container(
                            height: 0.5,
                            color: ColorToken.border,
                          ),
                      \],
                    ),
                  ),
                ),
              ),
            \],
          ),
        );
        return child;
      },
    );

    return Scaffold(
      appBar: AppBar(
        title: const Text('Detail'),
        leading: IconButton(
          icon: const Icon(Icons.arrow\_back),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
        actions: \[
          IconButton(
            icon: const Icon(Icons.close),
            onPressed: () {
              // ボトムシート全体を閉じる
              Navigator.of(context, rootNavigator: true).pop();
            },
          ),
        \],
      ),
      body: child,
    );
  }
}

---

## 🔧 ツール
*2025/1/9 21:21:03*

\*\*Placing widget definitions\*\*

Hmm, I’m trying to integrate definitions for `child` and `items` directly within the `Scaffold` in a Flutter snippet. This task involves removing existing definitions and ensuring the logical flow remains clear.

\*\*Streamlining the integration\*\*

I’m focusing on streamlining widget definitions within a Flutter `Scaffold`. By directly placing `child` and `items` definitions inside the `body`, it enhances clarity and avoids external dependencies.

\*\*Consolidating code elements\*\*

I’m integrating everything into the `Scaffold`'s `body` in `spotDetailState.when()`, eliminating external definitions of `child` and `items` for a more streamlined and cohesive structure.

---

## 🤖 アシスタント
*2025/1/9 21:21:03*

下記のように `child` と `items` を分割せずに、`Scaffold` の `body` 直下の `when` ブロック内で定義するとスッキリ書けます。参考にしてみてください。

```dart
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:snpit_guild_app/domain/screen.dart';
import 'package:snpit_guild_app/infrastructure/snapit_guild_api/snapit_guild_api.openapi.dart';
import 'package:snpit_guild_app/presentation/design_token/color_pallet.dart';
import 'package:snpit_guild_app/presentation/design_token/color_token.dart';
import 'package:snpit_guild_app/presentation/entities/extensions/spot_detail_dto_rarity_x.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/spots/get_spot_detail_info.dart';

class SpotDetailPage extends HookConsumerWidget {
  const SpotDetailPage({super.key, required this.spotId});
  final String spotId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // ① SpotDetailNotifier の状態を監視
    final spotDetailState = ref.watch(getSpotDetailNotifierProvider);

    // ② マウント時または spotId が変わるたびに API をコール
    useEffect(() {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        ref.read(getSpotDetailNotifierProvider.notifier).getSpotDetail(spotId);
      });
      return null; // cleanup は不要
    }, [spotId]);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Detail'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.close),
            onPressed: () {
              // ボトムシート全体を閉じる
              Navigator.of(context, rootNavigator: true).pop();
            },
          ),
        ],
      ),
      body: spotDetailState.when(
        loading: () {
          return const Center(child: CircularProgressIndicator());
        },
        error: (err, stack) {
          return Center(
            child: Text('Error: $err'),
          );
        },
        data: (spotDetail) {
          // spotDetail が null の可能性を考慮
          if (spotDetail == null) {
            return const Center(child: Text('No data'));
          }

          final adminPhotoUrl = () {
            final photos = spotDetail.spotPhotos ?? [];
            final adminPhotos = photos.where(
              (photo) => photo.photoType == SpotPhotoDTOPhotoType.ADMIN_PHOTOS,
            );
            return adminPhotos.isNotEmpty ? adminPhotos.first.photoUrl : null;
          }();

          // 難易度などの例
          final rarityLabel = spotDetail.rarity?.label ?? '';
          final rarityColor = spotDetail.rarity?.color ?? ColorToken.border;
          final holder = spotDetail.guildId ?? 'No Guild';

          // ListTile の文字列を差し替えたりなど
          final items = [
            ListTile(
              contentPadding: const EdgeInsets.symmetric(horizontal: 16),
              title: const Text('Difficulty level'),
              trailing: CircleAvatar(
                backgroundColor: ColorPallet.gray1000,
                child: Text(
                  rarityLabel,
                  style: TextStyle(
                    fontSize: 18,
                    color: rarityColor,
                  ),
                ),
              ),
            ),
            ListTile(
              contentPadding: const EdgeInsets.symmetric(horizontal: 16),
              title: const Text(
                'Holder',
                style: TextStyle(fontSize: 14),
              ),
              trailing: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    holder,
                    style: const TextStyle(fontSize: 14),
                  ),
                  const SizedBox(width: 8),
                  const Icon(
                    Icons.arrow_forward_ios,
                    size: 16,
                    color: ColorToken.text,
                  ),
                ],
              ),
              onTap: () {
                // TODO: spotId を付与する
                context.push(Screen.ourSpotDetail.path);
              },
            ),
          ];

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                AspectRatio(
                  aspectRatio: 1,
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: Stack(
                      fit: StackFit.expand,
                      children: [
                        Container(
                          decoration: BoxDecoration(
                            border: Border.all(
                              color: Colors.white,
                              width: 2,
                            ),
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.all(2),
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(8),
                            child: Image.network(
                              adminPhotoUrl!, // TODO: null safety
                              fit: BoxFit.cover,
                              loadingBuilder: (context, child, loadingProgress) {
                                if (loadingProgress == null) {
                                  return child;
                                }
                                return const Center(
                                  child: CircularProgressIndicator(),
                                );
                              },
                              errorBuilder: (context, error, stackTrace) {
                                debugPrint('Image loading error: $error');
                                return const Center(
                                  child: Icon(
                                    Icons.error,
                                    color: ColorToken.error,
                                  ),
                                );
                              },
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                DecoratedBox(
                  decoration: BoxDecoration(
                    color: ColorToken.bg,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color: ColorToken.border,
                      width: 0.5,
                    ),
                  ),
                  // ListView.separated() で実装すると最後の要素に謎の余白が生じたため Column で実装
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: List.generate(
                      items.length,
                      (index) => Column(
                        children: [
                          items[index],
                          if (index < items.length - 1)
                            Container(
                              height: 0.5,
                              color: ColorToken.border,
                            ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
```

---
