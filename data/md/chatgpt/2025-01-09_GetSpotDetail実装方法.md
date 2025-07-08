# GetSpotDetail実装方法

日付: 2025-01-09

---

## 👤 ユーザー
*2025/1/9 19:40:20*

getSpotDetail を使うように変更してほしい

import 'package:flutter/foundation.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import 'package:snpit_guild_app/infrastructure/snapit_guild_api/snapit_guild_api.openapi.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/api_provider.dart';

part 'get_spot_detail_info.g.dart';

@Riverpod(keepAlive: true)
class GetSpotDetailNotifier extends _$GetSpotDetailNotifier {
  @override
  Future&lt;SpotDetailResponseDTOData?&gt; build() async =&gt; null;

  Future&lt;void&gt; getSpotDetail(String spotId) async {
    state = const AsyncValue.loading();
    try {
      final api = await ref.watch(spotsApiProvider.future);
      final response = await api.spotControllerGetSpot(spotId: spotId);
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

import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:snpit_guild_app/domain/screen.dart';
import 'package:snpit_guild_app/presentation/design_token/color_token.dart';
import 'package:snpit_guild_app/utils/extensions/uri_extensions.dart';

class SpotDetailPage extends HookConsumerWidget {
  const SpotDetailPage({super.key, required this.spotId});
  final String spotId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // TODO: API 疎通 or 前画面からもってくる
    final imageUrl = useState(UriExtensions.randomImageUrl.toString());

    // TODO: 仮実装
    final items = [
      const ListTile(
        contentPadding: EdgeInsets.symmetric(horizontal: 16),
        title: Text('Difficulty level'),
        trailing: CircleAvatar(
          backgroundColor: ColorToken.rarityCommon,
          child: Text('D'),
        ),
      ),
      ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16),
        title: const Text(
          'Holder',
          style: TextStyle(fontSize: 14),
        ),
        trailing: const Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Your Guild',
              style: TextStyle(
                fontSize: 14,
              ),
            ),
            SizedBox(width: 8),
            Icon(
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
      body: SingleChildScrollView(
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
                    // 角丸にボーダー を入れるには Container x Padding を使う
                    Container(
                      decoration: BoxDecoration(
                        border: Border.all(color: Colors.white, width: 2),
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(2),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: Image.network(
                          imageUrl.value,
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
                  (index) =&gt; Column(
                    children: [
                      items[index],
                      if (index &lt; items.length - 1) // 最後のアイテムには線を追加しない
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
      ),
    );
  }
}

---

## 🔧 ツール
*2025/1/9 19:41:51*

**Pulling data**

I’m working through fetching spot details using getSpotDetail from the server in a Flutter app's "SpotDetailPage" widget. Considering FutureBuilder or ref.listen for data management.

**Implementing with Riverpod**

I’m using Riverpod to fetch spot details by calling getSpotDetail and subscribing to spotDetailNotifierProvider. Progress is steady, and I explored efficient methods for data retrieval.

**Crafting the provider**

OK, I’m thinking about forming a Riverpod AutoDisposeNotifier provider for getSpotDetailNotifier. This involves using generated code and a useEffect method in SpotDetailPage to manage the UI state.

**Pulling data**

Kicking off by watching getSpotDetailNotifierProvider, then calling getSpotDetail in useEffect. Handling UI states—data, loading, error—while showcasing image and name processing.

**Fetching and highlighting**

I'm piecing together how to fetch data using getSpotDetail in SpotDetailPage, focusing on a random image from spotDetail?.imageUrl, with an option to set a default image.

---

## 🤖 アシスタント
*2025/1/9 19:41:51*

下記の例のように **SpotDetailPage** で **getSpotDetail** を呼び出し、取得したデータを UI に反映するように変更してみてください。  
Riverpod + hooks で非同期データを呼び出す際は、以下のように **useEffect** フックを使って、初回描画時 (または spotId が変わったとき) に `getSpotDetail` を呼び出すパターンがよく使われます。

## 1. Notifier（get_spot_detail_info.dart）はそのままで OK

```dart
import 'package:flutter/foundation.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import 'package:snpit_guild_app/infrastructure/snapit_guild_api/snapit_guild_api.openapi.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/api_provider.dart';

part 'get_spot_detail_info.g.dart';

@Riverpod(keepAlive: true)
class GetSpotDetailNotifier extends _$GetSpotDetailNotifier {
  @override
  Future<SpotDetailResponseDTOData?> build() async => null;

  Future<void> getSpotDetail(String spotId) async {
    state = const AsyncValue.loading();
    try {
      final api = await ref.watch(spotsApiProvider.future);
      final response = await api.spotControllerGetSpot(spotId: spotId);
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
```

## 2. SpotDetailPage（SpotDetailPage.dart）で `getSpotDetail` を呼び出す

```dart
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:snpit_guild_app/domain/screen.dart';
import 'package:snpit_guild_app/presentation/design_token/color_token.dart';
import 'package:snpit_guild_app/utils/extensions/uri_extensions.dart';

// 追記: GetSpotDetailNotifier の provider をインポート
import 'package:snpit_guild_app/presentation/providers/get_spot_detail_info.dart';

class SpotDetailPage extends HookConsumerWidget {
  const SpotDetailPage({super.key, required this.spotId});
  final String spotId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // ① イメージ URL の state（仮: ランダム画像）
    final imageUrl = useState(UriExtensions.randomImageUrl.toString());

    // ② SpotDetailNotifier の状態を監視
    final spotDetailState = ref.watch(getSpotDetailNotifierProvider);

    // ③ マウント時または spotId が変わるたびに API をコール
    useEffect(() {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        ref.read(getSpotDetailNotifierProvider.notifier).getSpotDetail(spotId);
      });
      return null; // cleanup は不要
    }, [spotId]);

    // ④ spotDetailState の状態に応じて UI を分岐
    Widget child;
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
        // 取得した spotDetail の内容を使って表示などを行う例
        // ここではダミーで spotDetail?.name を表示するなど
        final difficultyText = spotDetail?.difficultyLevel ?? 'unknown';
        final holder = spotDetail?.holder ?? 'N/A';

        // ListTile の文字列を差し替えたりできます
        final items = [
          ListTile(
            contentPadding: const EdgeInsets.symmetric(horizontal: 16),
            title: const Text('Difficulty level'),
            trailing: CircleAvatar(
              backgroundColor: ColorToken.rarityCommon,
              child: Text(difficultyText),
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
                  style: const TextStyle(
                    fontSize: 14,
                  ),
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

        child = SingleChildScrollView(
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
                      // 角丸にボーダーを入れるには Container + Padding を使う
                      Container(
                        decoration: BoxDecoration(
                          border: Border.all(color: Colors.white, width: 2),
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.all(2),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: Image.network(
                            imageUrl.value,
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
    );

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
      body: child,
    );
  }
}
```

### ポイント

1. **useEffect**  
   - Flutter Hooks で「初回描画時」「依存する変数が更新された時」などに一度だけ実行したい処理がある場合に使います。  
   - 上記コードでは `spotId` が変化したら再取得するようにしています。

2. **ref.watch と ref.read の使い分け**  
   - `ref.watch(getSpotDetailNotifierProvider)` は Notifier の **状態** (AsyncValue) を監視して UI をリビルドするために使います。  
   - `ref.read(getSpotDetailNotifierProvider.notifier)` は **Notifier 本体** を取得して、メソッドを呼び出したり、明示的に state を変更するときに使います。

3. **when**  
   - `AsyncValue<T>` を `when` を使って `loading / error / data` の 3 つに分岐すると、ローディング・エラー・正常系の UI をそれぞれ記述できます。

これで、SpotDetailPage が表示されたときに自動的に `getSpotDetail(spotId)` が呼ばれ、データを取得して画面に反映する実装になります。

---

## 👤 ユーザー
*2025/1/9 20:13:36*

imageUrl は getSpotDetailNotifierProvider のADMIN_PHOTOSな photoUrl なんだ。複数ある可能性があるけど、最初に見つかったphotoUrlをそれにしてほしい。

/// Detail information of the spot.
@freezed
class SpotDetailResponseDTOData with _$SpotDetailResponseDTOData {
  factory SpotDetailResponseDTOData({
    @JsonKey(name: 'spotId') required String? spotId,
    @JsonKey(name: 'guildId') String? guildId,
    @JsonKey(name: 'spotName') required String? spotName,
    @JsonKey(name: 'spotStatus') required SpotDetailDTOSpotStatus? spotStatus,
    @JsonKey(name: 'rarity') required SpotDetailDTORarity? rarity,
    @JsonKey(name: 'spotLongitude') required num? spotLongitude,
    @JsonKey(name: 'spotLatitude') required num? spotLatitude,
    @JsonKey(name: 'spotAddress') required String? spotAddress,
    @JsonKey(name: 'createdAt') required DateTime? createdAt,
    @JsonKey(name: 'spotDescription') String? spotDescription,
    @JsonKey(name: 'autoIncome') required num? autoIncome,
    @JsonKey(name: 'attackIncome') required num? attackIncome,
    @JsonKey(name: 'spotPhotos') required List&lt;SpotPhotoDTO&gt;? spotPhotos,
  }) = _SpotDetailResponseDTOData;

  factory SpotDetailResponseDTOData.fromJson(Map&lt;String, dynamic&gt; jsonMap) =&gt;
      _$SpotDetailResponseDTODataFromJson(jsonMap);
}

@freezed
class SpotPhotoDTO with _$SpotPhotoDTO {
  factory SpotPhotoDTO({
    @JsonKey(name: 'photoHash') required String? photoHash,
    @JsonKey(name: 'photoName') required String? photoName,
    @JsonKey(name: 'photoDescription') String? photoDescription,
    @JsonKey(name: 'photoUrl') required String? photoUrl,
    @JsonKey(name: 'photoType') required SpotPhotoDTOPhotoType? photoType,
    @JsonKey(name: 'photoStatus') required SpotPhotoDTOPhotoStatus? photoStatus,
  }) = _SpotPhotoDTO;

  factory SpotPhotoDTO.fromJson(Map&lt;String, dynamic&gt; jsonMap) =&gt;
      _$SpotPhotoDTOFromJson(jsonMap);
}


enum SpotPhotoDTOPhotoType {
  @JsonValue('ADMIN_PHOTOS')
  ADMIN_PHOTOS,
  @JsonValue('USER_PHOTOS')
  USER_PHOTOS,
  @JsonValue('DECOY_PHOTOS')
  DECOY_PHOTOS,
}

---

## 🔧 ツール
*2025/1/9 20:14:22*

**Locating admin photo URL**

I’m mapping out how to identify the first `photoUrl` in `SpotDetailPage` with a `photoType` of `ADMIN_PHOTOS`. This involves filtering and retrieving the photo from the data, and setting it in the widget state.

---

## 🤖 アシスタント
*2025/1/9 20:14:22*

以下のように **SpotDetailPage** の `spotDetailState.when(data: ...)` ブロックで `spotDetail.spotPhotos` の中から `ADMIN_PHOTOS` タイプのものを探索し、最初に見つかった `photoUrl` を UI に反映するように変更してみてください。もし該当の `photoUrl` が見つからなかった場合は fallback で `UriExtensions.randomImageUrl.toString()` を使っています。

```dart
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:snpit_guild_app/domain/screen.dart';
import 'package:snpit_guild_app/presentation/design_token/color_token.dart';
import 'package:snpit_guild_app/utils/extensions/uri_extensions.dart';

// ★ GetSpotDetailNotifier の provider をインポート
import 'package:snpit_guild_app/presentation/providers/get_spot_detail_info.dart';

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

    // ③ spotDetailState の状態に応じて UI を分岐
    Widget child;
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

        // ----------------------------------------------------------------
        // ADMIN_PHOTOS タイプの写真のうち最初の1枚を取得
        // ----------------------------------------------------------------
        final adminPhotoUrl = () {
          // spotPhotos が null / 空 の可能性もあるため安全に取り出す
          final photos = spotDetail.spotPhotos ?? [];
          final adminPhotos = photos.where(
            (photo) => photo.photoType == SpotPhotoDTOPhotoType.ADMIN_PHOTOS,
          );
          // 最初に見つかったphotoUrl を返す。見つからなかったらランダム画像。
          return adminPhotos.isNotEmpty
              ? adminPhotos.first.photoUrl ?? UriExtensions.randomImageUrl.toString()
              : UriExtensions.randomImageUrl.toString();
        }();

        // 難易度などの例
        final difficultyText = spotDetail.rarity?.name ?? 'unknown';
        final holder = spotDetail.guildId ?? 'N/A';

        // ListTile の文字列を差し替えたりなど
        final items = [
          ListTile(
            contentPadding: const EdgeInsets.symmetric(horizontal: 16),
            title: const Text('Difficulty level'),
            trailing: CircleAvatar(
              backgroundColor: ColorToken.rarityCommon,
              child: Text(difficultyText),
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

        child = SingleChildScrollView(
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
                      // 角丸にボーダーを入れるには Container + Padding を使う
                      Container(
                        decoration: BoxDecoration(
                          border: Border.all(color: Colors.white, width: 2),
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.all(2),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: Image.network(
                            adminPhotoUrl,
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
        return child;
      },
    );

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
      body: child,
    );
  }
}
```

### ポイント

- **`spotDetail.spotPhotos`** の中から `photoType == SpotPhotoDTOPhotoType.ADMIN_PHOTOS` のものを `where(...)` で絞り込み、先頭の要素 (`adminPhotos.first`) の `photoUrl` を使用しています。  
- もし該当の `ADMIN_PHOTOS` が一つも無い場合や `photoUrl` が null の場合は、fallback で `UriExtensions.randomImageUrl.toString()` を返すようにしています。  
- これにより最初の `ADMIN_PHOTOS` の画像があればそれを表示し、なければランダム画像を表示します。

---

## 👤 ユーザー
*2025/1/9 20:19:50*

こういうのを定義してて、どこか別のファイルで定義して、どこでも使えるようにしたい。ここでも使いたい

extension SpotDTORarityX on SpotDTORarity {
  String get label {
    switch (this) {
      case SpotDTORarity.EPIC:
        return 'S';
      case SpotDTORarity.RARE:
        return 'A';
      case SpotDTORarity.UNCOMMON:
        return 'B';
      case SpotDTORarity.COMMON:
        return 'C';
    }
  }

  Color get color {
    switch (this) {
      case SpotDTORarity.EPIC:
        return ColorToken.rarityEpic;
      case SpotDTORarity.RARE:
        return ColorToken.rarityRare;
      case SpotDTORarity.UNCOMMON:
        return ColorToken.rarityUncommon;
      case SpotDTORarity.COMMON:
        return ColorToken.rarityCommon;
    }
  }
}

---

## 🤖 アシスタント
*2025/1/9 20:20:13*

Flutter/Dart では拡張メソッドを共通で使いたい場合、**別ファイルで定義** して、**必要な箇所でインポート** するようにするとよいです。たとえば以下のような構成が考えられます。

---

## 1. 拡張メソッド用ファイルを用意

プロジェクト構成の例として、以下のように `lib/domain/extensions/spot_dto_rarity_x.dart` のファイルを作成し、先ほどの拡張メソッドを定義します。（実際の配置はアプリの設計に合わせて変更してください）
  
```dart
// lib/domain/extensions/spot_dto_rarity_x.dart

import 'package:flutter/material.dart';
import 'package:snpit_guild_app/infrastructure/snapit_guild_api/snapit_guild_api.openapi.dart';
// ↑ SpotDTORarity が定義されているファイルをインポートする
import 'package:snpit_guild_app/presentation/design_token/color_token.dart';
// ↑ ColorToken が定義されているファイルをインポートする

extension SpotDTORarityX on SpotDTORarity {
  String get label {
    switch (this) {
      case SpotDTORarity.EPIC:
        return 'S';
      case SpotDTORarity.RARE:
        return 'A';
      case SpotDTORarity.UNCOMMON:
        return 'B';
      case SpotDTORarity.COMMON:
        return 'C';
    }
  }

  Color get color {
    switch (this) {
      case SpotDTORarity.EPIC:
        return ColorToken.rarityEpic;
      case SpotDTORarity.RARE:
        return ColorToken.rarityRare;
      case SpotDTORarity.UNCOMMON:
        return ColorToken.rarityUncommon;
      case SpotDTORarity.COMMON:
        return ColorToken.rarityCommon;
    }
  }
}
```

---

## 2. 拡張メソッドを使いたいファイルでインポート

たとえば先ほどの `SpotDetailPage` など、拡張メソッドを使いたいファイルで、上記ファイルをインポートすれば使えるようになります。  

```dart
// lib/presentation/pages/spot_detail_page.dart

import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:snpit_guild_app/domain/screen.dart';
import 'package:snpit_guild_app/presentation/design_token/color_token.dart';
import 'package:snpit_guild_app/utils/extensions/uri_extensions.dart';
// ★ 拡張メソッドのファイルをインポート
import 'package:snpit_guild_app/domain/extensions/spot_dto_rarity_x.dart';

import 'package:snpit_guild_app/presentation/providers/get_spot_detail_info.dart';

class SpotDetailPage extends HookConsumerWidget {
  // ...
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // ...
    spotDetailState.when(
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (err, stack) => Center(child: Text('Error: $err')),
      data: (spotDetail) {
        if (spotDetail == null) {
          return const Center(child: Text('No data'));
        }
        // spotDetail.rarity が拡張メソッドからlabel/color取得可能
        final rarityLabel = spotDetail.rarity?.label ?? '';
        final rarityColor = spotDetail.rarity?.color ?? ColorToken.border;

        // ...
      },
    );
    // ...
  }
}
```

このようにすることで、`SpotDTORarity` に対して `rarity.label` や `rarity.color` のように呼び出せるようになります。  

---

## 注意点

- **拡張メソッドの重複**  
  同じシンボル名（例えば `SpotDTORarityX`）の拡張を複数ファイルで定義すると競合を起こす場合があるので、命名に気をつけましょう。  
- **インポートのパス**  
  実際のファイルパスやプロジェクト構成によって `import 'package:～'` の記述は変わってくるため、アプリに合わせて修正してください。  

このように、拡張メソッドを**共通ファイルに切り出し**、**どのファイルからでもインポート**できるようにすることで、再利用性が高く、見通しの良いコードになります。

---
