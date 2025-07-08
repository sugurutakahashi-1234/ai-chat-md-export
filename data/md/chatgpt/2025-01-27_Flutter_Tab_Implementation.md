# Flutter Tab Implementation

日付: 2025-01-27

---

## 👤 ユーザー
*2025/01/27 18:02:52*

{
  "content_type": "image_asset_pointer",
  "asset_pointer": "file-service://file-JKDz7FEJjmU4NA6DJ38o6F",
  "size_bytes": 34638,
  "width": 232,
  "height": 503,
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
{
  "content_type": "image_asset_pointer",
  "asset_pointer": "file-service://file-6BGBZXJGojJnTTKbSf9m58",
  "size_bytes": 27307,
  "width": 237,
  "height": 514,
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
{
  "content_type": "image_asset_pointer",
  "asset_pointer": "file-service://file-4Ev4viq4peg6i7sGyeZ54n",
  "size_bytes": 42750,
  "width": 219,
  "height": 271,
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
現在の実装に変更が入って、今の実装に新たにItemsタブを追加することになった。
目指す実装は添付した画像のとおりである。
また、これらは DefaultTabController、headerSliverBuilder、NestedScrollView、TabBarView などで実装して欲しい。

Decksのタブは今の実装のままでいい。1枚目の画像である。

items のタブの中身は現在、実装していないがそれも合わせて実装して欲しい。
２枚目の画像である。

Itemをタップした際は３枚目の画像のDialog()で表現して欲しい。

import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:snpit_guild_app/domain/design/color_pallet.dart';
import 'package:snpit_guild_app/domain/design/color_token.dart';
import 'package:snpit_guild_app/domain/screen.dart';
import 'package:snpit_guild_app/infrastructure/entities/extensions/camera_dto_x.dart';
import 'package:snpit_guild_app/infrastructure/snapit_guild_api/snapit_guild_api.openapi.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/users/get_user.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/users/items/get_user_item_list.dart';
import 'package:snpit_guild_app/presentation/providers/editing_camera_list.dart';
import 'package:snpit_guild_app/presentation/widgets/camera_row.dart';
import 'package:snpit_guild_app/presentation/widgets/total_parameters_row.dart';
import 'package:snpit_guild_app/utils/snack_bar_utils.dart';

class MyPage extends HookConsumerWidget {
  const MyPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final myUserAsyncValue = ref.watch(getMyUserNotifierProvider);
    final myItemListAsyncValue = ref.watch(getMyUserItemListNotifierProvider);

    Future&lt;void&gt; onTapCopyId(String id) async {
      await Clipboard.setData(ClipboardData(text: id));
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('ID: $id copied to clipboard'),
          ),
        );
      }
    }

    Future&lt;void&gt; onTapSettings() async {
      await context.push(Screen.profile.path);
    }

    Future&lt;void&gt; onTapEditDeck(
      String? deckId,
      List&lt;CameraDTO&gt; cameraList,
    ) async {
      ref
          .read(editingCameraListNotifierProvider.notifier)
          .setCameraList(cameraList);
      await context.push(Screen.deckDetail.path, extra: deckId);
    }

    useEffect(
      () {
        Future.microtask(() async {
          try {
            await ref.read(getMyUserNotifierProvider.notifier).getMyUser();
            await ref
                .read(getMyUserItemListNotifierProvider.notifier)
                .getMyUserItemList();
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
        title: const Text('My Page'),
      ),
      body: myUserAsyncValue.when(
        data: (myUser) {
          final id = myUser?.userId ?? '';
          final name = myUser?.username ?? '';
          final photoUrl = myUser?.profilePicture ?? '';
          final deck = myUser?.decks?.first;
          final deckId = deck?.deckId;
          final cameraList = deck?.deckCameras ?? [];

          return SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  // User
                  Row(
                    children: [
                      CircleAvatar(
                        radius: 28,
                        backgroundColor:
                            ColorPallet.white.withValues(alpha: 0.6),
                        child: CircleAvatar(
                          radius: 27,
                          backgroundImage: CachedNetworkImageProvider(photoUrl),
                        ),
                      ),
                      const SizedBox(width: 12),
                      SizedBox(
                        width: 182,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              name,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 8),
                            GestureDetector(
                              onTap: () async {
                                await onTapCopyId(id);
                              },
                              child: Row(
                                children: [
                                  Expanded(
                                    child: Text(
                                      'ID: $id',
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                      style: const TextStyle(
                                        fontSize: 12,
                                        color: ColorPallet.gray300,
                                      ),
                                    ),
                                  ),
                                  const Icon(
                                    Icons.copy,
                                    color: ColorToken.primary,
                                    size: 12,
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                      const Spacer(),
                      IconButton(
                        icon: const Icon(
                          Icons.settings_outlined,
                          size: 24,
                        ),
                        color: ColorToken.text,
                        onPressed: () async {
                          await onTapSettings();
                        },
                      ),
                    ],
                  ),

                  const SizedBox(height: 24),

                  // Deck
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          const Text(
                            'Decks',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const Spacer(),
                          Flexible(
                            child: OutlinedButton(
                              style: OutlinedButton.styleFrom(
                                minimumSize: const Size.fromHeight(32),
                              ),
                              child: const Text(
                                'Edit deck',
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              onPressed: () async {
                                await onTapEditDeck(deckId, cameraList);
                              },
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      // Deck
                      DecoratedBox(
                        decoration: BoxDecoration(
                          color: ColorToken.bg,
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(
                            color: ColorToken.border,
                          ),
                        ),
                        child: Column(
                          children: [
                            Padding(
                              padding: const EdgeInsets.all(16),
                              child: TotalParametersRow(
                                searchValue: deck?.searchQ ?? 0,
                                attackValue: deck?.attackE ?? 0,
                                luckValue: deck?.luckL ?? 0,
                                defenceValue: deck?.defenseB ?? 0,
                              ),
                            ),

                            // トータルパラメータとカメラ一覧の間に区切り線
                            Container(
                              height: 1,
                              color: ColorToken.border,
                            ),

                            // カメラ一覧
                            Column(
                              children: cameraList
                                  .sorted()
                                  .asMap()
                                  .entries
                                  .map((entry) {
                                final index = entry.key;
                                final camera = entry.value;

                                return Column(
                                  children: [
                                    CameraRow(camera: camera),
                                    if (index &lt; cameraList.length - 1)
                                      Container(
                                        height: 1,
                                        color: ColorToken.border,
                                      ),
                                  ],
                                );
                              }).toList(),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          );
        },
        loading: () {
          return const Center(child: CircularProgressIndicator());
        },
        error: (error, _) {
          return Center(child: Text('Error: $error'));
        },
      ),
    );
  }
}


@freezed
class ItemDTO with _$ItemDTO {
  factory ItemDTO({
    @JsonKey(name: 'itemId') required String? itemId,
    @JsonKey(name: 'itemName') required String? itemName,
    @JsonKey(name: 'itemDescription') String? itemDescription,
    @JsonKey(name: 'itemImage') String? itemImage,
    @JsonKey(name: 'itemPrice') required num? itemPrice,
    @JsonKey(name: 'itemStatus') required ItemDTOItemStatus? itemStatus,
    @JsonKey(name: 'itemCategory') required ItemDTOItemCategory? itemCategory,
  }) = _ItemDTO;

  factory ItemDTO.fromJson(Map&lt;String, dynamic&gt; jsonMap) =&gt;
      _$ItemDTOFromJson(jsonMap);
}

---

## 🤖 アシスタント
*2025/01/27 18:06:09*

以下は、`DefaultTabController`, `NestedScrollView`, `headerSliverBuilder`, `TabBarView` を用いたサンプル実装例です。  
ポイントとしては、

- **上部を SliverAppBar** として定義し、  
- **タブ部分（Decks / Items）を `TabBar`** に紐づけ、  
- **タブの中身を `TabBarView`** で切り替える  
- Items をタップしたら `Dialog` を表示する  

といった流れになります。  

元の `MyPage` をベースに、**Decksタブ**の中身は「いまの実装をほぼそのまま再利用」し、  
**Itemsタブ**の中身では `getMyUserItemListNotifierProvider` から取得したアイテムリストをリスト表示してタップ時に `Dialog` を表示するサンプルを示しています。

```dart
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:snpit_guild_app/domain/design/color_pallet.dart';
import 'package:snpit_guild_app/domain/design/color_token.dart';
import 'package:snpit_guild_app/domain/screen.dart';
import 'package:snpit_guild_app/infrastructure/entities/extensions/camera_dto_x.dart';
import 'package:snpit_guild_app/infrastructure/snapit_guild_api/snapit_guild_api.openapi.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/users/get_user.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/users/items/get_user_item_list.dart';
import 'package:snpit_guild_app/presentation/providers/editing_camera_list.dart';
import 'package:snpit_guild_app/presentation/widgets/camera_row.dart';
import 'package:snpit_guild_app/presentation/widgets/total_parameters_row.dart';
import 'package:snpit_guild_app/utils/snack_bar_utils.dart';

// freezed の生成に必要なパート
part 'item_dto.freezed.dart';
part 'item_dto.g.dart';

@freezed
class ItemDTO with _$ItemDTO {
  factory ItemDTO({
    @JsonKey(name: 'itemId') required String? itemId,
    @JsonKey(name: 'itemName') required String? itemName,
    @JsonKey(name: 'itemDescription') String? itemDescription,
    @JsonKey(name: 'itemImage') String? itemImage,
    @JsonKey(name: 'itemPrice') required num? itemPrice,
    @JsonKey(name: 'itemStatus') required ItemDTOItemStatus? itemStatus,
    @JsonKey(name: 'itemCategory') required ItemDTOItemCategory? itemCategory,
  }) = _ItemDTO;

  factory ItemDTO.fromJson(Map<String, dynamic> jsonMap) =>
      _$ItemDTOFromJson(jsonMap);
}

class MyPage extends HookConsumerWidget {
  const MyPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // 自分のユーザー情報
    final myUserAsyncValue = ref.watch(getMyUserNotifierProvider);
    // アイテムリスト
    final myItemListAsyncValue = ref.watch(getMyUserItemListNotifierProvider);

    // 画面 init 時にユーザー情報とアイテムリストを取得
    useEffect(() {
      Future.microtask(() async {
        try {
          await ref.read(getMyUserNotifierProvider.notifier).getMyUser();
          await ref
              .read(getMyUserItemListNotifierProvider.notifier)
              .getMyUserItemList();
        } on Exception catch (error) {
          if (context.mounted) {
            showErrorSnackBar(context, error);
          }
        }
      });
      return null;
    }, []);

    Future<void> onTapSettings() async {
      await context.push(Screen.profile.path);
    }

    Future<void> onTapCopyId(String id) async {
      await Clipboard.setData(ClipboardData(text: id));
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('ID: $id copied to clipboard'),
          ),
        );
      }
    }

    // デッキ編集ボタン押下時の処理
    Future<void> onTapEditDeck(String? deckId, List<CameraDTO> cameraList) async {
      ref.read(editingCameraListNotifierProvider.notifier)
          .setCameraList(cameraList);
      await context.push(Screen.deckDetail.path, extra: deckId);
    }

    // アイテムの Dialog を表示するサンプル
    Future<void> showItemDetailDialog(BuildContext context, ItemDTO item) async {
      await showDialog(
        context: context,
        builder: (_) {
          return Dialog(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
            backgroundColor: ColorToken.bg,
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // タイトル
                  Text(
                    item.itemName ?? '',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  // 画像
                  if (item.itemImage != null && item.itemImage!.isNotEmpty)
                    Image.network(
                      item.itemImage!,
                      height: 100,
                      fit: BoxFit.cover,
                    )
                  else
                    const FlutterLogo(size: 80),
                  const SizedBox(height: 8),
                  // 説明
                  Text(
                    item.itemDescription ?? 'No Description',
                    style: const TextStyle(fontSize: 14),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 16),
                  // 閉じるボタン
                  ElevatedButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text('Close'),
                  ),
                ],
              ),
            ),
          );
        },
      );
    }

    return DefaultTabController(
      length: 2, // Decks, Items の2タブ
      child: Scaffold(
        body: NestedScrollView(
          headerSliverBuilder: (context, innerBoxIsScrolled) {
            return [
              // タブ付きの SliverAppBar
              SliverAppBar(
                title: const Text('My Page'),
                pinned: true,
                floating: true,
                bottom: const TabBar(
                  tabs: [
                    Tab(text: 'Decks'),
                    Tab(text: 'Items'),
                  ],
                ),
              ),
            ];
          },
          // タブビューの中身
          body: TabBarView(
            children: [
              // --- 1つ目: Decksタブ ---
              myUserAsyncValue.when(
                data: (myUser) {
                  final id = myUser?.userId ?? '';
                  final name = myUser?.username ?? '';
                  final photoUrl = myUser?.profilePicture ?? '';
                  final deck = myUser?.decks?.first;
                  final deckId = deck?.deckId;
                  final cameraList = deck?.deckCameras ?? [];

                  return SingleChildScrollView(
                    child: Padding(
                      padding: const EdgeInsets.all(24),
                      child: Column(
                        children: [
                          // ユーザー情報
                          Row(
                            children: [
                              CircleAvatar(
                                radius: 28,
                                backgroundColor:
                                    ColorPallet.white.withValues(alpha: 0.6),
                                child: CircleAvatar(
                                  radius: 27,
                                  backgroundImage:
                                      CachedNetworkImageProvider(photoUrl),
                                ),
                              ),
                              const SizedBox(width: 12),
                              SizedBox(
                                width: 182,
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      name,
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                      style: const TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    const SizedBox(height: 8),
                                    GestureDetector(
                                      onTap: () async {
                                        await onTapCopyId(id);
                                      },
                                      child: Row(
                                        children: [
                                          Expanded(
                                            child: Text(
                                              'ID: $id',
                                              maxLines: 1,
                                              overflow: TextOverflow.ellipsis,
                                              style: const TextStyle(
                                                fontSize: 12,
                                                color: ColorPallet.gray300,
                                              ),
                                            ),
                                          ),
                                          const Icon(
                                            Icons.copy,
                                            color: ColorToken.primary,
                                            size: 12,
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              const Spacer(),
                              IconButton(
                                icon: const Icon(
                                  Icons.settings_outlined,
                                  size: 24,
                                ),
                                color: ColorToken.text,
                                onPressed: () async {
                                  await onTapSettings();
                                },
                              ),
                            ],
                          ),

                          const SizedBox(height: 24),

                          // Deck
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  const Text(
                                    'Decks',
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  const Spacer(),
                                  Flexible(
                                    child: OutlinedButton(
                                      style: OutlinedButton.styleFrom(
                                        minimumSize:
                                            const Size.fromHeight(32),
                                      ),
                                      child: const Text(
                                        'Edit deck',
                                        style: TextStyle(
                                          fontSize: 12,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                      onPressed: () async {
                                        await onTapEditDeck(deckId, cameraList);
                                      },
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 16),
                              DecoratedBox(
                                decoration: BoxDecoration(
                                  color: ColorToken.bg,
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(
                                    color: ColorToken.border,
                                  ),
                                ),
                                child: Column(
                                  children: [
                                    Padding(
                                      padding: const EdgeInsets.all(16),
                                      child: TotalParametersRow(
                                        searchValue: deck?.searchQ ?? 0,
                                        attackValue: deck?.attackE ?? 0,
                                        luckValue: deck?.luckL ?? 0,
                                        defenceValue: deck?.defenseB ?? 0,
                                      ),
                                    ),
                                    Container(
                                      height: 1,
                                      color: ColorToken.border,
                                    ),
                                    // カメラ一覧
                                    Column(
                                      children: cameraList
                                          .sorted()
                                          .asMap()
                                          .entries
                                          .map((entry) {
                                        final index = entry.key;
                                        final camera = entry.value;
                                        return Column(
                                          children: [
                                            CameraRow(camera: camera),
                                            if (index < cameraList.length - 1)
                                              Container(
                                                height: 1,
                                                color: ColorToken.border,
                                              ),
                                          ],
                                        );
                                      }).toList(),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  );
                },
                loading: () => const Center(child: CircularProgressIndicator()),
                error: (error, _) => Center(child: Text('Error: $error')),
              ),

              // --- 2つ目: Itemsタブ ---
              myItemListAsyncValue.when(
                data: (itemList) {
                  if (itemList.isEmpty) {
                    return const Center(child: Text('No Items'));
                  }

                  // ListView でアイテム一覧表示
                  return ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: itemList.length,
                    itemBuilder: (context, index) {
                      final item = itemList[index];
                      final imageUrl = item.itemImage ?? '';
                      final name = item.itemName ?? 'No Name';
                      // 今回のサンプルでは数量を 1 としています
                      final quantity = 1;

                      return Card(
                        child: ListTile(
                          leading: (imageUrl.isNotEmpty)
                              ? Image.network(imageUrl, width: 48, height: 48)
                              : const FlutterLogo(size: 40),
                          title: Text(name),
                          trailing: Text('$quantity'),
                          onTap: () async {
                            await showItemDetailDialog(context, item);
                          },
                        ),
                      );
                    },
                  );
                },
                loading: () => const Center(child: CircularProgressIndicator()),
                error: (error, _) => Center(child: Text('Error: $error')),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

---

### 実装上のポイント

1. **`DefaultTabController`**  
   - タブ数 (`length`) を指定し、`TabBar` と `TabBarView` の連動をまとめます。

2. **`NestedScrollView` + `SliverAppBar`**  
   - `headerSliverBuilder` の中に `SliverAppBar` を用意し、`pinned` や `floating` などの指定でスクロール時の挙動を制御します。  
   - `bottom` に `TabBar` を設定して、上部にタブを表示する構造にしています。

3. **`TabBarView`**  
   - `TabBar` のインデックスと連動するコンテンツを用意するために使います。  
   - 今回は「Decksタブ」「Itemsタブ」の2つに分割しました。

4. **Itemsリスト表示**  
   - リストアイテムをタップした時に `showItemDetailDialog` を呼び出し、 `Dialog` を表示するサンプルです。  

ご要望に合わせて、`Decks` タブは現在の実装をほぼそのまま利用しつつ、  
新たに `Items` タブを加え、タップ時に `Dialog` を表示する形にしてあります。  

適宜、レイアウトやデザイン、ステート管理の方法などをアプリ要件にあわせて調整してください。

---

## 👤 ユーザー
*2025/01/27 18:27:20*

SliverAppBarは使わずにユーザー情報の Rowは SliverToBoxAdapterでヘッダーとして欲しい。

ユーザー情報はDecksタブとItemsタブで共通の部分である。

ItemsタブについてCard と ListTile は使わないで欲しい。
Rowで表現して欲しい。
タップ時はリップルが出るようにして欲しい。
ItemsDTOではなくUserItemsDTOだった。
UserItemsDTOは別で定義しているからあらためて記述しないでいいよ。
quantity はUserItemsDTOには itemQuantityという変数があるのでそこから取得できるはず。

---

## 🤖 アシスタント
*2025/01/27 18:29:52*

以下のサンプルでは、

- **SliverAppBar を使わず**  
- **ユーザー情報（共通部分）を `SliverToBoxAdapter` でヘッダーとして定義**  
- **`TabBar` と `TabBarView`** で Decks / Items を切り替え  
- **Items は `Card` や `ListTile` を使わず、`InkWell` + `Row` でリップルつき**  
- **quantity は `userItemsDTO.itemQuantity` から取得**  

という要件に沿って実装しています。

```dart
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:snpit_guild_app/domain/design/color_pallet.dart';
import 'package:snpit_guild_app/domain/design/color_token.dart';
import 'package:snpit_guild_app/domain/screen.dart';
import 'package:snpit_guild_app/infrastructure/entities/extensions/camera_dto_x.dart';
import 'package:snpit_guild_app/infrastructure/snapit_guild_api/snapit_guild_api.openapi.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/users/get_user.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/users/items/get_user_item_list.dart';
import 'package:snpit_guild_app/presentation/providers/editing_camera_list.dart';
import 'package:snpit_guild_app/presentation/widgets/camera_row.dart';
import 'package:snpit_guild_app/presentation/widgets/total_parameters_row.dart';
import 'package:snpit_guild_app/utils/snack_bar_utils.dart';

class MyPage extends HookConsumerWidget {
  const MyPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // ユーザー情報
    final myUserAsyncValue = ref.watch(getMyUserNotifierProvider);
    // アイテムリスト
    final myItemListAsyncValue = ref.watch(getMyUserItemListNotifierProvider);

    // 初期処理：ユーザー情報・アイテム取得
    useEffect(() {
      Future.microtask(() async {
        try {
          await ref.read(getMyUserNotifierProvider.notifier).getMyUser();
          await ref
              .read(getMyUserItemListNotifierProvider.notifier)
              .getMyUserItemList();
        } on Exception catch (error) {
          if (context.mounted) {
            showErrorSnackBar(context, error);
          }
        }
      });
      return null;
    }, []);

    // ユーザーIDコピー
    Future<void> onTapCopyId(String id) async {
      await Clipboard.setData(ClipboardData(text: id));
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('ID: $id copied to clipboard'),
          ),
        );
      }
    }

    // 設定画面へ
    Future<void> onTapSettings() async {
      await context.push(Screen.profile.path);
    }

    // デッキ編集へ
    Future<void> onTapEditDeck(
      String? deckId,
      List<CameraDTO> cameraList,
    ) async {
      ref
          .read(editingCameraListNotifierProvider.notifier)
          .setCameraList(cameraList);
      await context.push(Screen.deckDetail.path, extra: deckId);
    }

    // アイテム詳細のダイアログ表示
    Future<void> showItemDetailDialog(BuildContext context, UserItemsDTO item) async {
      await showDialog(
        context: context,
        builder: (_) {
          return Dialog(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
            backgroundColor: ColorToken.bg,
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // タイトル
                  Text(
                    item.itemName ?? '',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  // 画像 (URL があれば表示)
                  if (item.itemImage != null && item.itemImage!.isNotEmpty)
                    Image.network(
                      item.itemImage!,
                      height: 100,
                      fit: BoxFit.cover,
                    )
                  else
                    const FlutterLogo(size: 80),
                  const SizedBox(height: 8),
                  // 説明
                  Text(
                    item.itemDescription ?? 'No Description',
                    style: const TextStyle(fontSize: 14),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text('Close'),
                  ),
                ],
              ),
            ),
          );
        },
      );
    }

    return DefaultTabController(
      length: 2, // Decks / Items の2タブ
      child: Scaffold(
        body: NestedScrollView(
          headerSliverBuilder: (context, innerBoxIsScrolled) {
            return [
              // SliverToBoxAdapter でユーザー情報 + タブバーをまとめる
              SliverToBoxAdapter(
                child: myUserAsyncValue.when(
                  data: (myUser) {
                    // ユーザー情報
                    final id = myUser?.userId ?? '';
                    final name = myUser?.username ?? '';
                    final photoUrl = myUser?.profilePicture ?? '';

                    return Column(
                      children: [
                        // -- ヘッダー部分（ユーザー情報）--
                        Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Row(
                            children: [
                              CircleAvatar(
                                radius: 28,
                                backgroundColor:
                                    ColorPallet.white.withValues(alpha: 0.6),
                                child: CircleAvatar(
                                  radius: 27,
                                  backgroundImage:
                                      CachedNetworkImageProvider(photoUrl),
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      name,
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                      style: const TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    GestureDetector(
                                      onTap: () async {
                                        await onTapCopyId(id);
                                      },
                                      child: Row(
                                        children: [
                                          Expanded(
                                            child: Text(
                                              'ID: $id',
                                              maxLines: 1,
                                              overflow: TextOverflow.ellipsis,
                                              style: const TextStyle(
                                                fontSize: 12,
                                                color: ColorPallet.gray300,
                                              ),
                                            ),
                                          ),
                                          const Icon(
                                            Icons.copy,
                                            color: ColorToken.primary,
                                            size: 12,
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              IconButton(
                                icon: const Icon(
                                  Icons.settings_outlined,
                                  size: 24,
                                ),
                                color: ColorToken.text,
                                onPressed: () async {
                                  await onTapSettings();
                                },
                              ),
                            ],
                          ),
                        ),

                        // -- タブバー --
                        const TabBar(
                          tabs: [
                            Tab(text: 'Decks'),
                            Tab(text: 'Items'),
                          ],
                        ),
                      ],
                    );
                  },
                  loading: () => const Center(
                    child: Padding(
                      padding: EdgeInsets.all(24),
                      child: CircularProgressIndicator(),
                    ),
                  ),
                  error: (error, _) => Center(
                    child: Text('Error: $error'),
                  ),
                ),
              ),
            ];
          },
          // タブの中身
          body: TabBarView(
            children: [
              // --- Decksタブ ---
              myUserAsyncValue.when(
                data: (myUser) {
                  if (myUser == null) {
                    return const Center(child: Text('No User Data'));
                  }

                  final deck = myUser.decks?.first;
                  final deckId = deck?.deckId;
                  final cameraList = deck?.deckCameras ?? [];

                  return SingleChildScrollView(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Decks heading & 編集ボタン
                        Row(
                          children: [
                            const Text(
                              'Decks',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const Spacer(),
                            OutlinedButton(
                              style: OutlinedButton.styleFrom(
                                minimumSize: const Size.fromHeight(32),
                              ),
                              onPressed: () async {
                                await onTapEditDeck(deckId, cameraList);
                              },
                              child: const Text(
                                'Edit deck',
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        // デッキの表示
                        DecoratedBox(
                          decoration: BoxDecoration(
                            color: ColorToken.bg,
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(
                              color: ColorToken.border,
                            ),
                          ),
                          child: Column(
                            children: [
                              // トータルパラメータ
                              Padding(
                                padding: const EdgeInsets.all(16),
                                child: TotalParametersRow(
                                  searchValue: deck?.searchQ ?? 0,
                                  attackValue: deck?.attackE ?? 0,
                                  luckValue: deck?.luckL ?? 0,
                                  defenceValue: deck?.defenseB ?? 0,
                                ),
                              ),
                              Container(
                                height: 1,
                                color: ColorToken.border,
                              ),
                              // カメラ一覧
                              Column(
                                children: cameraList
                                    .sorted()
                                    .asMap()
                                    .entries
                                    .map((entry) {
                                  final index = entry.key;
                                  final camera = entry.value;
                                  return Column(
                                    children: [
                                      CameraRow(camera: camera),
                                      if (index < cameraList.length - 1)
                                        Container(
                                          height: 1,
                                          color: ColorToken.border,
                                        ),
                                    ],
                                  );
                                }).toList(),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  );
                },
                loading: () => const Center(child: CircularProgressIndicator()),
                error: (error, _) => Center(child: Text('Error: $error')),
              ),

              // --- Itemsタブ ---
              myItemListAsyncValue.when(
                data: (items) {
                  if (items.isEmpty) {
                    return const Center(child: Text('No Items'));
                  }
                  // Row でリストを表示（リップルは InkWell などを使用）
                  return ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: items.length,
                    itemBuilder: (context, index) {
                      final item = items[index];
                      final imageUrl = item.itemImage ?? '';
                      final name = item.itemName ?? 'No Name';
                      final quantity = item.itemQuantity ?? 0;

                      return InkWell(
                        onTap: () async {
                          await showItemDetailDialog(context, item);
                        },
                        child: Padding(
                          padding: const EdgeInsets.symmetric(vertical: 8),
                          child: Row(
                            children: [
                              // 画像
                              if (imageUrl.isNotEmpty)
                                Image.network(
                                  imageUrl,
                                  width: 48,
                                  height: 48,
                                  fit: BoxFit.cover,
                                )
                              else
                                // プレースホルダーなど
                                Container(
                                  width: 48,
                                  height: 48,
                                  color: Colors.grey,
                                ),
                              const SizedBox(width: 12),
                              // アイテム名
                              Expanded(
                                child: Text(
                                  name,
                                  style: const TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                              // アイテム数
                              Text(
                                'x$quantity',
                                style: const TextStyle(
                                  fontSize: 14,
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  );
                },
                loading: () => const Center(child: CircularProgressIndicator()),
                error: (error, _) => Center(child: Text('Error: $error')),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

---

### 実装上のポイント

1. **`SliverToBoxAdapter` でヘッダー部分(ユーザー情報 + TabBar)をまとめる**  
   - `headerSliverBuilder` の戻り値に `SliverToBoxAdapter` を返して、そこにユーザー情報＋`TabBar` を含めています。  
   - これによって `SliverAppBar` は使わずに、タブ切り替えができる構成を実現しています。

2. **ユーザー情報は Decksタブ・Itemsタブ共通なので、ヘッダーにのみ実装**  
   - タブビュー部分に同じユーザー情報を重複して書かないようにしています。

3. **Decksタブ**  
   - これまでのデッキ表示（トータルパラメータやカメラ一覧）をほぼ流用。  
   - ユーザー情報を上部に表示する必要がなくなったため、単純化しています。

4. **Itemsタブ**  
   - `ListView.builder` の中で `InkWell + Row` でアイテムを表示。  
   - タップ時のリップル効果は `InkWell` によって実現。  
   - アイテム数は `item.itemQuantity` から取得しています。

5. **Dialog の表示**  
   - タップ時に `showItemDetailDialog` で `Dialog` を表示しています。  
   - 中身はサンプル実装ですので、必要に応じて UI を整えてください。  

これで「ユーザー情報はヘッダーにまとめつつ、タブ内容は Decks / Items で分割し、かつ SliverAppBar は使わずに SliverToBoxAdapter を利用した構成」が実現できます。

---

## 👤 ユーザー
*2025/01/27 18:31:57*

以下のようなエラーが発生した

例外が発生しました
FlutterError (BoxConstraints forces an infinite width.
These invalid constraints were provided to RenderPhysicalShape's layout() function by the following function, which probably computed the invalid constraints in question:
  RenderConstrainedBox.performLayout (package:flutter/src/rendering/proxy_box.dart:297:14)
The offending constraints were:
  BoxConstraints(w=Infinity, 32.0&lt;=h&lt;=Infinity))

---

## 🤖 アシスタント
*2025/01/27 18:32:44*

Flutter で「BoxConstraints forces an infinite width.」が出る典型的な原因は、

1. **親ウィジェットが横方向（width）の制約を与えていない状態で、子ウィジェットがサイズを埋めようとする**  
2. **スクロール系ウィジェット（ListView / SingleChildScrollViewなど）を入れ子にしており、どちらかが無限幅になってしまう**

などがあります。実行時に「`w=Infinity`」というエラー文言がある場合、横幅が無限大になっているのが原因です。

---

## よくある原因と対処例

### 1. `SingleChildScrollView` ＋ `Row` / `ListView` の組み合わせ

`SingleChildScrollView` が縦にスクロール可能な状態で、かつその中に `Row` や `ListView` を置くと、  
横幅が無限になりがちです。  
解決策としては、

- 不要であれば `SingleChildScrollView` を外す  
- または `SingleChildScrollView` を横方向ではなく縦方向だけに制限する  
- 中の `ListView` などに `shrinkWrap: true` を指定しつつ、なるべく親子でスクロールが競合しないようにする

などを検討します。

### 2. `ListView` が縦方向にスクロールする親ウィジェットの中で、横方向に無制限になっている

`ListView` はデフォルトでは主方向に無限大のサイズを取ろうとします。  
`NestedScrollView` や `Column` の中に `ListView` を置いている場合、

- その `ListView` に `shrinkWrap: true` と `physics: const NeverScrollableScrollPhysics()` を付与して、  
  さらに親側をスクロールさせる、など

が必要になるケースがあります。  

特に「`NestedScrollView` + `SingleChildScrollView` + `ListView`」といった多重構造は、  
どこかで無限大のサイズを許容してしまうと、同じエラーが出やすいです。

### 3. `Row` の中で横幅に制約がない子を配置している

`Row` は子ウィジェットを「横に並べる」だけで、  
横幅の制約までは行いません。  
もし子に `Expanded` や `SizedBox(width: ～)` などの明示的な制約がないと、  
無限大の幅を取ろうとしてエラーになる場合があります。

- 何らかの方法で「この子はどのくらいの幅を取れるのか」を限定してあげる必要があります。  
- たとえば「`Expanded` で Row 全体を埋める」のか、「`SizedBox(width: 100)` などで固定する」のか、といった方法です。

---

## 対処のヒント

- **不要な `SingleChildScrollView` を外してみる**  
  すでに `ListView` がスクロールを担っている場合、さらに `SingleChildScrollView` を被せると、  
  無限大の制約が発生しやすくなります。  
- **`ListView` の `shrinkWrap` や `physics` を調整する**  
  `shrinkWrap: true` は「子のサイズに応じて `ListView` 自体のサイズも決める」オプション。  
  ただし、親が別のスクロールを持つ場合は、スクロール競合を避けるために `physics: NeverScrollableScrollPhysics()` にし、  
  親側だけスクロールする作りにすることもあります。  
- **`Expanded` や `Flexible` でレイアウトをバランス良くまとめる**  
  親が `Row` や `Column` の場合、子を `Expanded` や `Flexible` でラップしておくと、  
  フレックスルールにしたがって適度に収まることが多いです。  
- **デバッグログを見ながら無限大になっている箇所を特定する**  
  場合によっては、一度レイアウトをシンプルなものに戻し、  
  徐々にウィジェットを追加していくことで、どこで無限大が発生しているのか確認しやすくなります。  

以上を参考に、まずは「多重スクロール」や「Row/Column内で幅が無限大になる要因」を取り除いてみてください。

---

## 👤 ユーザー
*2025/01/27 18:43:52*

以下を対応してほしい。

(1) Scaffold で AppBarを設定して欲しい。またRefreshIndicator も設定して、DefaultTabController を囲って欲しい。onRefreshも定義してほしい。  Scaffold(
      appBar: AppBar(
        title: const Text('My Page'),
      ),
      body: RefreshIndicator(
        onRefresh: () async {
 await onRefresh();
        },
        child: 
    DefaultTabController


(2) タブバーをスクロールしても残したいのでSliverPersistentHeaderを設定して欲しい。


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
                          Tab(text: 'Decks'),
                          Tab(text: 'Items'),
                        ],
                      ),
                    ),
                  ),



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

(3)
クラッシュした原因はどうやら--- Decksタブ ---であることはわかった。対応原因を探して対応してほしい。
SingleChildScrollViewは外していいと思う。

例外が発生しました
* 
FlutterError (BoxConstraints forces an infinite width.
These invalid constraints were provided to RenderPhysicalShape's layout() function by the following function, which probably computed the invalid constraints in question:
  RenderConstrainedBox.performLayout (package:flutter/src/rendering/proxy_box.dart:297:14)
The offending constraints were:
  BoxConstraints(w=Infinity, 32.0&lt;=h&lt;=Infinity))

---

## 🤖 アシスタント
*2025/01/27 18:45:36*

以下のサンプルは、

1. **Scaffold + AppBar** を設置し、  
2. **RefreshIndicator** を使って pull-to-refresh できるようにし、  
3. **DefaultTabController** を囲む構成とし、  
4. **TabBar** を **SliverPersistentHeader** でピン留め（スクロールしてもタブが残る）し、  
5. **Decksタブ** で発生していた無限幅エラーの原因である `SingleChildScrollView` を取り除く  

という内容を実装例として示したものです。

---

## 実装例

```dart
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:snpit_guild_app/domain/design/color_pallet.dart';
import 'package:snpit_guild_app/domain/design/color_token.dart';
import 'package:snpit_guild_app/domain/screen.dart';
import 'package:snpit_guild_app/infrastructure/entities/extensions/camera_dto_x.dart';
import 'package:snpit_guild_app/infrastructure/snapit_guild_api/snapit_guild_api.openapi.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/users/get_user.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/users/items/get_my_user_item_list.dart';
import 'package:snpit_guild_app/presentation/providers/editing_camera_list.dart';
import 'package:snpit_guild_app/presentation/widgets/camera_row.dart';
import 'package:snpit_guild_app/presentation/widgets/total_parameters_row.dart';
import 'package:snpit_guild_app/utils/snack_bar_utils.dart';

// --- SliverPersistentHeader で使うデリゲート ---
class _SliverTabBarDelegate extends SliverPersistentHeaderDelegate {
  _SliverTabBarDelegate(this.tabBar);

  final TabBar tabBar;

  @override
  double get minExtent => tabBar.preferredSize.height;
  @override
  double get maxExtent => tabBar.preferredSize.height;

  @override
  Widget build(
    BuildContext context,
    double shrinkOffset,
    bool overlapsContent,
  ) {
    // タブバーの背景を指定
    return ColoredBox(
      color: ColorPallet.gray800,
      child: tabBar,
    );
  }

  @override
  bool shouldRebuild(_SliverTabBarDelegate oldDelegate) {
    // ここではタブバーが変更されたら再ビルド
    return oldDelegate.tabBar != tabBar;
  }
}

class MyPage extends HookConsumerWidget {
  const MyPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // --- プロバイダからデータ取得 ---
    final myUserAsyncValue = ref.watch(getMyUserNotifierProvider);
    final myItemListAsyncValue = ref.watch(getMyUserItemListNotifierProvider);

    // --- 画面初期化で MyUser, Items を取得 ---
    useEffect(() {
      Future.microtask(() async {
        await onRefresh(ref, context);
      });
      return null;
    }, []);

    // --- Pull To Refresh / 手動更新 処理 ---
    Future<void> onRefresh(WidgetRef ref, BuildContext context) async {
      try {
        await ref.read(getMyUserNotifierProvider.notifier).getMyUser();
        await ref.read(getMyUserItemListNotifierProvider.notifier).getMyUserItemList();
      } catch (error) {
        if (context.mounted) {
          showErrorSnackBar(context, error);
        }
      }
    }

    // --- ユーザーIDコピー ---
    Future<void> onTapCopyId(String id) async {
      await Clipboard.setData(ClipboardData(text: id));
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('ID: $id copied to clipboard')),
        );
      }
    }

    // --- 設定画面へ移動 ---
    Future<void> onTapSettings(BuildContext context) async {
      await context.push(Screen.profile.path);
    }

    // --- デッキ編集 ---
    Future<void> onTapEditDeck(
      BuildContext context,
      WidgetRef ref,
      String? deckId,
      List<CameraDTO> cameraList,
    ) async {
      ref
          .read(editingCameraListNotifierProvider.notifier)
          .setCameraList(cameraList);
      await context.push(Screen.deckDetail.path, extra: deckId);
    }

    // --- アイテムダイアログ表示 ---
    Future<void> showItemDetailDialog(BuildContext context, UserItemsDTO item) async {
      await showDialog(
        context: context,
        builder: (_) {
          return Dialog(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
            backgroundColor: ColorToken.bg,
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // タイトル
                  Text(
                    item.itemName ?? '',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  // 画像
                  if (item.itemImage != null && item.itemImage!.isNotEmpty)
                    Image.network(
                      item.itemImage!,
                      height: 100,
                      fit: BoxFit.cover,
                    )
                  else
                    const FlutterLogo(size: 80),
                  const SizedBox(height: 8),
                  // 説明
                  Text(
                    item.itemDescription ?? 'No Description',
                    style: const TextStyle(fontSize: 14),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text('Close'),
                  ),
                ],
              ),
            ),
          );
        },
      );
    }

    return Scaffold(
      // (1) Scaffold で AppBar を設定
      appBar: AppBar(
        title: const Text('My Page'),
      ),
      // (1) RefreshIndicator を設定し、その中に DefaultTabController を置く
      body: RefreshIndicator(
        onRefresh: () async {
          await onRefresh(ref, context);
        },
        child: DefaultTabController(
          length: 2, // Decks, Items の2タブ
          child: NestedScrollView(
            headerSliverBuilder: (context, innerBoxIsScrolled) {
              return [
                // -- ユーザー情報 SliverToBoxAdapter --
                SliverToBoxAdapter(
                  child: myUserAsyncValue.when(
                    data: (myUser) {
                      final id = myUser?.userId ?? '';
                      final name = myUser?.username ?? '';
                      final photoUrl = myUser?.profilePicture ?? '';

                      return Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Row(
                          children: [
                            CircleAvatar(
                              radius: 28,
                              backgroundColor:
                                  ColorPallet.white.withValues(alpha: 0.6),
                              child: CircleAvatar(
                                radius: 27,
                                backgroundImage: CachedNetworkImageProvider(photoUrl),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    name,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  GestureDetector(
                                    onTap: () => onTapCopyId(id),
                                    child: Row(
                                      children: [
                                        Expanded(
                                          child: Text(
                                            'ID: $id',
                                            maxLines: 1,
                                            overflow: TextOverflow.ellipsis,
                                            style: const TextStyle(
                                              fontSize: 12,
                                              color: ColorPallet.gray300,
                                            ),
                                          ),
                                        ),
                                        const Icon(
                                          Icons.copy,
                                          color: ColorToken.primary,
                                          size: 12,
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            IconButton(
                              icon: const Icon(Icons.settings_outlined),
                              color: ColorToken.text,
                              onPressed: () => onTapSettings(context),
                            ),
                          ],
                        ),
                      );
                    },
                    loading: () => const SizedBox(
                      height: 100,
                      child: Center(child: CircularProgressIndicator()),
                    ),
                    error: (error, _) => SizedBox(
                      height: 100,
                      child: Center(child: Text('Error: $error')),
                    ),
                  ),
                ),

                // (2) SliverPersistentHeader で TabBar をピン留め
                SliverPersistentHeader(
                  pinned: true,
                  delegate: _SliverTabBarDelegate(
                    TabBar(
                      // デザイン例
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
                        Tab(text: 'Decks'),
                        Tab(text: 'Items'),
                      ],
                    ),
                  ),
                ),
              ];
            },
            // --- TabBarView (中身) ---
            body: TabBarView(
              children: [
                // --- Decksタブ ---
                myUserAsyncValue.when(
                  data: (myUser) {
                    if (myUser == null) {
                      return const Center(child: Text('No User Data'));
                    }
                    final deck = myUser.decks?.first;
                    final deckId = deck?.deckId;
                    final cameraList = deck?.deckCameras ?? [];

                    // (3) SingleChildScrollView を除去し、ListViewなどへ変更して無限幅エラーを回避
                    return ListView(
                      // NestedScrollView の body内ではListViewをスクロール競合しないように設定
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      padding: const EdgeInsets.all(16),
                      children: [
                        // Decks Heading & 編集ボタン
                        Row(
                          children: [
                            const Text(
                              'Decks',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const Spacer(),
                            OutlinedButton(
                              style: OutlinedButton.styleFrom(
                                minimumSize: const Size.fromHeight(32),
                              ),
                              onPressed: () async {
                                await onTapEditDeck(context, ref, deckId, cameraList);
                              },
                              child: const Text(
                                'Edit deck',
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),

                        // デッキ表示
                        DecoratedBox(
                          decoration: BoxDecoration(
                            color: ColorToken.bg,
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(
                              color: ColorToken.border,
                            ),
                          ),
                          child: Column(
                            children: [
                              // パラメータ行
                              Padding(
                                padding: const EdgeInsets.all(16),
                                child: TotalParametersRow(
                                  searchValue: deck?.searchQ ?? 0,
                                  attackValue: deck?.attackE ?? 0,
                                  luckValue: deck?.luckL ?? 0,
                                  defenceValue: deck?.defenseB ?? 0,
                                ),
                              ),
                              Container(
                                height: 1,
                                color: ColorToken.border,
                              ),
                              // カメラ一覧
                              Column(
                                children: cameraList
                                    .sorted()
                                    .asMap()
                                    .entries
                                    .map((entry) {
                                  final index = entry.key;
                                  final camera = entry.value;
                                  return Column(
                                    children: [
                                      CameraRow(camera: camera),
                                      if (index < cameraList.length - 1)
                                        Container(
                                          height: 1,
                                          color: ColorToken.border,
                                        ),
                                    ],
                                  );
                                }).toList(),
                              ),
                            ],
                          ),
                        ),
                      ],
                    );
                  },
                  loading: () => const Center(child: CircularProgressIndicator()),
                  error: (error, _) => Center(child: Text('Error: $error')),
                ),

                // --- Itemsタブ ---
                myItemListAsyncValue.when(
                  data: (items) {
                    if (items.isEmpty) {
                      return const Center(child: Text('No Items'));
                    }
                    // Row でアイテムを表示
                    return ListView.builder(
                      // 同様にスクロール競合を防ぐ
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      padding: const EdgeInsets.all(16),
                      itemCount: items.length,
                      itemBuilder: (context, index) {
                        final item = items[index];
                        final imageUrl = item.itemImage ?? '';
                        final name = item.itemName ?? 'No Name';
                        final quantity = item.itemQuantity ?? 0;

                        return InkWell(
                          onTap: () async {
                            await showItemDetailDialog(context, item);
                          },
                          child: Padding(
                            padding: const EdgeInsets.symmetric(vertical: 8),
                            child: Row(
                              children: [
                                // 画像
                                if (imageUrl.isNotEmpty)
                                  Image.network(
                                    imageUrl,
                                    width: 48,
                                    height: 48,
                                    fit: BoxFit.cover,
                                  )
                                else
                                  Container(
                                    width: 48,
                                    height: 48,
                                    color: Colors.grey,
                                  ),
                                const SizedBox(width: 12),
                                // アイテム名
                                Expanded(
                                  child: Text(
                                    name,
                                    style: const TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ),
                                // 個数
                                Text(
                                  'x$quantity',
                                  style: const TextStyle(fontSize: 14),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    );
                  },
                  loading: () => const Center(child: CircularProgressIndicator()),
                  error: (error, _) => Center(child: Text('Error: $error')),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
```

---

## ポイント解説

1. **Scaffold + AppBar ＋ RefreshIndicator**  
   - `AppBar` によるタイトルバーを表示し、コンテンツ部分を `RefreshIndicator` で包むことで、プルダウン更新の操作を実装しています。  
   - `onRefresh` 内で `getMyUser()` や `getMyUserItemList()` を再取得するようにしました。

2. **NestedScrollView + SliverPersistentHeader + TabBar**  
   - `NestedScrollView` の `headerSliverBuilder` で
     - `SliverToBoxAdapter`（ユーザー情報）  
     - `SliverPersistentHeader`（ピン留めするタブバー）  
     を順に配置。  
   - `TabBar` は `_SliverTabBarDelegate` を使って固定表示（`pinned: true`）することで、スクロールしてもタブを残せます。

3. **Decksタブ での無限幅エラー対処**  
   - 原因は `SingleChildScrollView` と `NestedScrollView` の多重スクロール、あるいは無制限な横幅指定が衝突していたことが考えられます。  
   - 今回は `SingleChildScrollView` を除去し、`ListView`（`shrinkWrap: true` と `physics: NeverScrollableScrollPhysics()`）を使うことで、縦スクロールを親（NestedScrollView）に任せて無限幅を回避しています。  
   - 同様に Itemsタブでもリスト表示は `ListView.builder` にし、同じくスクロール競合が起きないように設定しています。

4. **タブの中身 (TabBarView) のスクロール**  
   - `NestedScrollView` の中でタブを切り替える場合、子側 (`TabBarView` の各子) でスクロールを行うウィジェットは必ず `physics: NeverScrollableScrollPhysics()` と `shrinkWrap: true` を組み合わせるなど、  
     スクロールが競合しないようにするのが定番の対策です。

5. **Dialog**  
   - `Items` をタップした時に、`Dialog` を表示するサンプルです。  
   - 今回はシンプルに内容を表示し、「Close」ボタンで閉じるようにしています。

---

このように、  
- **AppBar** や **RefreshIndicator** を設置  
- **TabBar を SliverPersistentHeader でピン留め**  
- **Decksタブの `SingleChildScrollView` を除去**  

などを行うことで、無限幅エラーを回避しつつ要件を満たす形となります。必要に応じてデザインやレイアウトを微調整してみてください。

---

## 👤 ユーザー
*2025/01/27 19:44:28*

やはり、Decksタブでまたエラーになってしまった。ここを単純なTextにするとクラッシュしなくなった。もう一度見直して欲しい

---

## 🔧 ツール
*2025/01/27 19:47:01*

**Examining the layout**

I’m working through the `NestedScrollView` setup that includes `headerSliverBuilder` returning `[SliverToBoxAdapter, SliverPersistentHeader]`. The `body` has `TabBarView` with two `ListView` children, each with `shrinkWrap: true` and `physics: NeverScrollableScrollPhysics()`, and a "Decks" list including a row, `SizedBox`, `DecoratedBox`, columns, and `cameraList`.

**Evaluating layout strategies**

I’m examining the cause of infinite constraints, considering `Expanded` or `Flexible` misuse. Removing "ListView" and trying `SingleChildScrollView` with `BouncingScrollPhysics()` is worth noting.

**Emulating a simpler pattern**

I suggest using `SliverList` instead of `ListViews` within `CustomScrollView` for the `DECKS` and `ITEMS` tabs, ensuring each child has its own scroll. This aligns with the recommended nested scroll approach.

**Simplifying the structure**

I’m removing `physics: NeverScrollableScrollPhysics()` and `shrinkWrap: true`. The `Decks` tab will use a `CustomScrollView` with `SliverPadding` and `SliverList` for a more streamlined layout.

---

## 🤖 アシスタント
*2025/01/27 19:47:01*

以下のサンプルでは、以下のポイントを見直しています。

1. **NestedScrollView + SliverPersistentHeader** を使ってタブをピン留めする構成。  
2. **Decksタブ / Itemsタブ** それぞれ **`CustomScrollView`** を利用し、  
   - `SliverPadding` + `SliverList` (もしくは `SliverToBoxAdapter`) でレイアウトする。  
   - これにより `ListView` や `SingleChildScrollView` が不要になり、  
     NestedScrollView による無限幅エラー（`BoxConstraints(w=Infinity, ...)`）を回避できます。  
3. **Scaffold + AppBar + RefreshIndicator**  
   - Pull to refresh が可能なようにしつつ、タブ部分はスクロールしても残るように調整。  

Flutter で「NestedScrollView + pinned SliverPersistentHeader + TabBarView」を使う場合は、  
**TabBarView の各タブの中身も Sliverベース**（ `CustomScrollView` + `Sliver~` ）で構成するのがよくあるパターンです。  
`ListView` や `SingleChildScrollView` を直接入れると無限幅エラーが起きることが多いです。

---

## 実装例

```dart
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:snpit_guild_app/domain/design/color_pallet.dart';
import 'package:snpit_guild_app/domain/design/color_token.dart';
import 'package:snpit_guild_app/domain/screen.dart';
import 'package:snpit_guild_app/infrastructure/entities/extensions/camera_dto_x.dart';
import 'package:snpit_guild_app/infrastructure/snapit_guild_api/snapit_guild_api.openapi.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/users/get_user.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/users/items/get_my_user_item_list.dart';
import 'package:snpit_guild_app/presentation/providers/editing_camera_list.dart';
import 'package:snpit_guild_app/presentation/widgets/camera_row.dart';
import 'package:snpit_guild_app/presentation/widgets/total_parameters_row.dart';
import 'package:snpit_guild_app/utils/snack_bar_utils.dart';

// --- SliverPersistentHeader で使うデリゲート ---
class _SliverTabBarDelegate extends SliverPersistentHeaderDelegate {
  _SliverTabBarDelegate(this.tabBar);

  final TabBar tabBar;

  @override
  double get minExtent => tabBar.preferredSize.height;
  @override
  double get maxExtent => tabBar.preferredSize.height;

  @override
  Widget build(
      BuildContext context,
      double shrinkOffset,
      bool overlapsContent,
  ) {
    // タブバーの背景を指定
    return ColoredBox(
      color: ColorPallet.gray800,
      child: tabBar,
    );
  }

  @override
  bool shouldRebuild(_SliverTabBarDelegate oldDelegate) {
    // ここではタブバーが変更されたら再ビルド
    return oldDelegate.tabBar != tabBar;
  }
}

class MyPage extends HookConsumerWidget {
  const MyPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // --- プロバイダからデータ取得 ---
    final myUserAsyncValue = ref.watch(getMyUserNotifierProvider);
    final myItemListAsyncValue = ref.watch(getMyUserItemListNotifierProvider);

    // 初期処理：ユーザー情報・アイテム取得
    useEffect(() {
      Future.microtask(() async {
        await onRefresh(ref, context);
      });
      return null;
    }, []);

    // --- Pull To Refresh (手動更新) 処理 ---
    Future<void> onRefresh(WidgetRef ref, BuildContext context) async {
      try {
        await ref.read(getMyUserNotifierProvider.notifier).getMyUser();
        await ref.read(getMyUserItemListNotifierProvider.notifier).getMyUserItemList();
      } catch (error) {
        if (context.mounted) {
          showErrorSnackBar(context, error);
        }
      }
    }

    // ユーザーIDコピー
    Future<void> onTapCopyId(String id) async {
      await Clipboard.setData(ClipboardData(text: id));
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('ID: $id copied to clipboard'),
          ),
        );
      }
    }

    // 設定画面へ移動
    Future<void> onTapSettings(BuildContext context) async {
      await context.push(Screen.profile.path);
    }

    // デッキ編集
    Future<void> onTapEditDeck(
      BuildContext context,
      WidgetRef ref,
      String? deckId,
      List<CameraDTO> cameraList,
    ) async {
      ref
          .read(editingCameraListNotifierProvider.notifier)
          .setCameraList(cameraList);
      await context.push(Screen.deckDetail.path, extra: deckId);
    }

    // アイテムダイアログ表示
    Future<void> showItemDetailDialog(BuildContext context, UserItemsDTO item) async {
      await showDialog(
        context: context,
        builder: (_) {
          return Dialog(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
            backgroundColor: ColorToken.bg,
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // タイトル
                  Text(
                    item.itemName ?? '',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  // 画像
                  if (item.itemImage != null && item.itemImage!.isNotEmpty)
                    Image.network(
                      item.itemImage!,
                      height: 100,
                      fit: BoxFit.cover,
                    )
                  else
                    const FlutterLogo(size: 80),
                  const SizedBox(height: 8),
                  // 説明
                  Text(
                    item.itemDescription ?? 'No Description',
                    style: const TextStyle(fontSize: 14),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text('Close'),
                  ),
                ],
              ),
            ),
          );
        },
      );
    }

    return Scaffold(
      // AppBar
      appBar: AppBar(
        title: const Text('My Page'),
      ),
      // RefreshIndicator
      body: RefreshIndicator(
        onRefresh: () async {
          await onRefresh(ref, context);
        },
        // DefaultTabController
        child: DefaultTabController(
          length: 2, // Decks, Items の2タブ
          child: NestedScrollView(
            // これが親のスクロール
            headerSliverBuilder: (context, innerBoxIsScrolled) {
              return [
                // SliverToBoxAdapter: ユーザー情報
                SliverToBoxAdapter(
                  child: myUserAsyncValue.when(
                    data: (myUser) {
                      final id = myUser?.userId ?? '';
                      final name = myUser?.username ?? '';
                      final photoUrl = myUser?.profilePicture ?? '';

                      return Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Row(
                          children: [
                            CircleAvatar(
                              radius: 28,
                              backgroundColor:
                                  ColorPallet.white.withValues(alpha: 0.6),
                              child: CircleAvatar(
                                radius: 27,
                                backgroundImage: CachedNetworkImageProvider(photoUrl),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    name,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  GestureDetector(
                                    onTap: () => onTapCopyId(id),
                                    child: Row(
                                      children: [
                                        Expanded(
                                          child: Text(
                                            'ID: $id',
                                            maxLines: 1,
                                            overflow: TextOverflow.ellipsis,
                                            style: const TextStyle(
                                              fontSize: 12,
                                              color: ColorPallet.gray300,
                                            ),
                                          ),
                                        ),
                                        const Icon(
                                          Icons.copy,
                                          color: ColorToken.primary,
                                          size: 12,
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            IconButton(
                              icon: const Icon(Icons.settings_outlined),
                              color: ColorToken.text,
                              onPressed: () => onTapSettings(context),
                            ),
                          ],
                        ),
                      );
                    },
                    loading: () => const SizedBox(
                      height: 100,
                      child: Center(child: CircularProgressIndicator()),
                    ),
                    error: (error, _) => SizedBox(
                      height: 100,
                      child: Center(child: Text('Error: $error')),
                    ),
                  ),
                ),

                // SliverPersistentHeader で TabBar をピン留め
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
                        Tab(text: 'Decks'),
                        Tab(text: 'Items'),
                      ],
                    ),
                  ),
                ),
              ];
            },
            // タブの中身 (TabBarView)
            body: TabBarView(
              children: [
                // --- Decksタブ ---
                Builder(
                  builder: (context) {
                    // Sliverベースのスクロールを使う
                    return myUserAsyncValue.when(
                      data: (myUser) {
                        if (myUser == null) {
                          return const Center(child: Text('No User Data'));
                        }
                        final deck = myUser.decks?.first;
                        final deckId = deck?.deckId;
                        final cameraList = deck?.deckCameras ?? [];

                        return CustomScrollView(
                          // ここで別のスクロールを扱う
                          slivers: [
                            // パディング
                            SliverPadding(
                              padding: const EdgeInsets.all(16),
                              sliver: SliverList(
                                delegate: SliverChildListDelegate([
                                  // Row: Decks + Editボタン
                                  Row(
                                    children: [
                                      const Text(
                                        'Decks',
                                        style: TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                      const Spacer(),
                                      OutlinedButton(
                                        style: OutlinedButton.styleFrom(
                                          minimumSize: const Size.fromHeight(32),
                                        ),
                                        onPressed: () async {
                                          await onTapEditDeck(
                                            context,
                                            ref,
                                            deckId,
                                            cameraList,
                                          );
                                        },
                                        child: const Text(
                                          'Edit deck',
                                          style: TextStyle(
                                            fontSize: 12,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 16),
                                  // デッキの表示
                                  DecoratedBox(
                                    decoration: BoxDecoration(
                                      color: ColorToken.bg,
                                      borderRadius: BorderRadius.circular(8),
                                      border: Border.all(
                                        color: ColorToken.border,
                                      ),
                                    ),
                                    child: Column(
                                      children: [
                                        // パラメータ
                                        Padding(
                                          padding: const EdgeInsets.all(16),
                                          child: TotalParametersRow(
                                            searchValue: deck?.searchQ ?? 0,
                                            attackValue: deck?.attackE ?? 0,
                                            luckValue: deck?.luckL ?? 0,
                                            defenceValue: deck?.defenseB ?? 0,
                                          ),
                                        ),
                                        // 仕切り線
                                        Container(
                                          height: 1,
                                          color: ColorToken.border,
                                        ),
                                        // カメラ一覧
                                        ...cameraList
                                            .sorted()
                                            .asMap()
                                            .entries
                                            .expand((entry) {
                                          final index = entry.key;
                                          final camera = entry.value;
                                          return [
                                            CameraRow(camera: camera),
                                            if (index < cameraList.length - 1)
                                              Container(
                                                height: 1,
                                                color: ColorToken.border,
                                              ),
                                          ];
                                        }).toList(),
                                      ],
                                    ),
                                  ),
                                ]),
                              ),
                            ),
                          ],
                        );
                      },
                      loading: () => const Center(child: CircularProgressIndicator()),
                      error: (error, _) => Center(child: Text('Error: $error')),
                    );
                  },
                ),

                // --- Itemsタブ ---
                Builder(
                  builder: (context) {
                    // Sliverベースのスクロール
                    return myItemListAsyncValue.when(
                      data: (items) {
                        if (items.isEmpty) {
                          return const Center(child: Text('No Items'));
                        }
                        return CustomScrollView(
                          slivers: [
                            SliverPadding(
                              padding: const EdgeInsets.all(16),
                              sliver: SliverList(
                                delegate: SliverChildBuilderDelegate(
                                  (context, index) {
                                    final item = items[index];
                                    final imageUrl = item.itemImage ?? '';
                                    final name = item.itemName ?? 'No Name';
                                    final quantity = item.itemQuantity ?? 0;

                                    return InkWell(
                                      onTap: () async {
                                        await showItemDetailDialog(context, item);
                                      },
                                      child: Padding(
                                        padding: const EdgeInsets.symmetric(vertical: 8),
                                        child: Row(
                                          children: [
                                            // 画像
                                            if (imageUrl.isNotEmpty)
                                              Image.network(
                                                imageUrl,
                                                width: 48,
                                                height: 48,
                                                fit: BoxFit.cover,
                                              )
                                            else
                                              Container(
                                                width: 48,
                                                height: 48,
                                                color: Colors.grey,
                                              ),
                                            const SizedBox(width: 12),
                                            // アイテム名
                                            Expanded(
                                              child: Text(
                                                name,
                                                style: const TextStyle(
                                                  fontSize: 14,
                                                  fontWeight: FontWeight.w600,
                                                ),
                                              ),
                                            ),
                                            // 個数
                                            Text(
                                              'x$quantity',
                                              style: const TextStyle(fontSize: 14),
                                            ),
                                          ],
                                        ),
                                      ),
                                    );
                                  },
                                  childCount: items.length,
                                ),
                              ),
                            ),
                          ],
                        );
                      },
                      loading: () => const Center(child: CircularProgressIndicator()),
                      error: (error, _) => Center(child: Text('Error: $error')),
                    );
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
```

---

### 変更・見直しポイント

1. **Decksタブ**・**Itemsタブ**ともに、`TabBarView` 内で **`CustomScrollView`** を使うように変更。  
   - Flutter の `NestedScrollView` を使って Sliver をピン留めする場合、  
     **子（タブの中身）も同じく Sliverベースのスクロール**（`CustomScrollView` + `SliverList` など）にするのが定番です。  
   - これにより、従来 `SingleChildScrollView` や `ListView(shrinkWrap: true, physics: NeverScrollableScrollPhysics())` を使った際に起こりがちな  
     **無限幅エラー**（`BoxConstraints(w=Infinity) ...`）を回避できます。

2. **SliverToBoxAdapter** / **SliverList** / **SliverPadding** の使い分け  
   - 親 (`NestedScrollView`) の `headerSliverBuilder` には `SliverToBoxAdapter` でユーザー情報、  
   - その下に `SliverPersistentHeader` でピン留めした `TabBar`、  
   - 子 (`TabBarView`) の中身は `CustomScrollView` で、さらに `SliverPadding` や `SliverList` でリストレイアウト。  

3. **デッキ一覧のレイアウト**  
   - `SliverList` の `delegate` に `SliverChildListDelegate` あるいは `SliverChildBuilderDelegate` を使って、  
     各行（Row）や `DecoratedBox` などを並べていきます。  

4. **スクロールの一元化**  
   - 親 `NestedScrollView` のスクロールでタブ全体がスクロールし、  
   - タブ切り替え時にそれぞれの `CustomScrollView` が内容をスクロールしてくれます。  
   - これで多重スクロールの競合を避けやすい構成になります。

---

### これでもまだエラーが出る場合

- **`CameraRow` の中身に Row / Expanded / SizedBox(width: double.infinity)` など、幅無制限になりうるコード** が存在しないかご確認ください。  
  - とくに `CameraRow` 内で横幅が無制限に伸びてしまう実装になっているケースなどがあります。  
  - もし `CameraRow` が行方向に子ウィジェットを配置していて、かつどこかに無制限なサイズ指定があると問題が起きます。  
- **`TotalParametersRow`** など別ウィジェットの中身も同様にチェック**してください。  
  - Row + `Expanded` + `MainAxisSize.min` の組み合わせなどで意図しない無限幅が起こり得ます。  
- 一度 `CameraRow` の代わりに簡易的な `Text('test')` に置き換えて正常動作するか確認するのは有効です。  
  - その上で差し替えたときにまたエラーが出るかどうかで、`CameraRow` が原因か判別できます。

---

このように、

- **`NestedScrollView` + `SliverPersistentHeader` (pinned TabBar)**  
- **タブの中身 → `CustomScrollView` (SliverList / SliverToBoxAdapter...)**  

という形にすると、  
多重スクロールや無限幅エラーを回避しやすくなります。  

もしそれでもエラーが出る場合は、  
**`CameraRow` や `TotalParametersRow` の中に無限幅を誘発する要素** があるかもしれないので、  
レイアウトや `Row` / `Column` の使い方を再度チェックしてください。

---
