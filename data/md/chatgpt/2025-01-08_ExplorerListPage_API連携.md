# ExplorerListPage API連携

Date: 2025-01-08

---

## 👤 User
*2025-01-08 15:43:53*

ExplorerListPage を表示したときに毎回取得APIをコールしてほしい。またリバーポッドとhooksを使ってほしい

import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter/material.dart';

class ExplorerListPage extends StatelessWidget {
  const ExplorerListPage({super.key});

  @override
  Widget build(BuildContext context) {
    final cards = List.generate(
      5,
      (index) =&gt; Card(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        elevation: 4,
        child: Center(child: Text('Card ${index + 1}')),
      ),
    );

    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: const Text('Select explorer'),
        actions: [
          IconButton(
            onPressed: () =&gt; Navigator.pop(context),
            icon: const Icon(Icons.close),
            tooltip: 'Close',
          ),
        ],
      ),
      body: Column(
        children: [
          const SizedBox(height: 16),
          Expanded(
            child: CarouselSlider(
              options: CarouselOptions(
                height: 250,
              ),
              items: cards,
            ),
          ),
          const SizedBox(height: 16),
        ],
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: ElevatedButton(
            onPressed: () {
              // TODO: ボタン押下時の処理 (API 通信など)
              Navigator.pop(context);
            },
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 16),
            ),
            child: const Text('Start explore'),
          ),
        ),
      ),
    );
  }
}

import 'package:flutter/foundation.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import 'package:snpit_guild_app/infrastructure/snapit_guild_api/snapit_guild_api.openapi.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/api_provider.dart';

part 'get_explorer_info.g.dart';

@riverpod
class GetExplorerNotifier extends _$GetExplorerNotifier {
  @override
  Future&lt;List&lt;ExplorerDTO&gt;?&gt; build() async =&gt; null;

  Future&lt;void&gt; executeRequest() async {
    state = const AsyncValue.loading();
    try {
      final api = await ref.watch(explorersApiProvider.future);
      final response = await api.explorerControllerGetAllExplorers();
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

---

## 🤖 Assistant
*2025-01-08 15:44:17*

リバーポッドを使って `ExplorerListPage` を実装し、ページが表示されるたびに取得APIを呼び出すようにするには、以下の手順で修正できます。

1. **Riverpodとhooksのセットアップ**: `flutter_hooks`と`hooks_riverpod`を利用して、ページの表示と同時にAPIリクエストを実行します。
2. **APIデータの状態管理**: `GetExplorerNotifier`を利用してAPIデータを取得し、結果を表示します。
3. **UIの更新**: `AsyncValue`の状態に応じてローディング、エラー、データ表示を分岐させます。

以下は修正版のコードです。

### 修正版のコード

```dart
import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'get_explorer_info.dart';

class ExplorerListPage extends HookConsumerWidget {
  const ExplorerListPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final explorerState = ref.watch(getExplorerNotifierProvider);

    // ページ表示時にAPIリクエストをトリガー
    useEffect(() {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        ref.read(getExplorerNotifierProvider.notifier).executeRequest();
      });
      return null;
    }, []);

    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: const Text('Select explorer'),
        actions: [
          IconButton(
            onPressed: () => Navigator.pop(context),
            icon: const Icon(Icons.close),
            tooltip: 'Close',
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(vertical: 16.0),
        child: explorerState.when(
          data: (explorers) {
            if (explorers == null || explorers.isEmpty) {
              return const Center(
                child: Text('No explorers available.'),
              );
            }

            // カードリストの生成
            final cards = explorers
                .map(
                  (explorer) => Card(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    elevation: 4,
                    child: Center(child: Text(explorer.name ?? 'Unknown')),
                  ),
                )
                .toList();

            return Column(
              children: [
                Expanded(
                  child: CarouselSlider(
                    options: CarouselOptions(
                      height: 250,
                    ),
                    items: cards,
                  ),
                ),
              ],
            );
          },
          loading: () => const Center(
            child: CircularProgressIndicator(),
          ),
          error: (error, stackTrace) => Center(
            child: Text('Error: $error'),
          ),
        ),
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: ElevatedButton(
            onPressed: () {
              // ボタン押下時の処理 (例: API通信)
              Navigator.pop(context);
            },
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 16),
            ),
            child: const Text('Start explore'),
          ),
        ),
      ),
    );
  }
}
```

### 主な変更点

1. **API呼び出しのトリガー**:
   - `useEffect`を利用して、ページの初回表示時に`executeRequest`を呼び出します。

2. **データの表示**:
   - `explorerState.when`を使用して、`AsyncValue`の状態に応じたUIを表示します。
     - `loading`: ローディングインジケータ。
     - `data`: 正常に取得した場合はスライダーを表示。
     - `error`: エラー時のメッセージ。

3. **ダイナミックなカード生成**:
   - APIから取得したデータを使い、カードリストを動的に生成。

これにより、`ExplorerListPage`が毎回表示されるたびにAPIが呼び出され、取得したデータを元にUIが更新されるようになります。

---

## 👤 User
*2025-01-08 17:19:50*

こういうエラーになった

════════ Exception caught by image resource service ════════════════════════════
The following SocketException was thrown resolving an image codec:
Failed host lookup: 'armani.name' (OS Error: nodename nor servname provided, or not known, errno = 8)

When the exception was thrown, this was the stack:
#0      _NativeSocket.startConnect (dart:io-patch/socket_patch.dart:721:35)
socket_patch.dart:721
#1      _RawSocket.startConnect (dart:io-patch/socket_patch.dart:1920:26)
socket_patch.dart:1920
#2      RawSocket.startConnect (dart:io-patch/socket_patch.dart:27:23)
socket_patch.dart:27
#3      Socket._startConnect (dart:io-patch/socket_patch.dart:2144:22)
socket_patch.dart:2144
#4      Socket.startConnect (dart:io/socket.dart:825:21)
socket.dart:825
#5      _ConnectionTarget.connect (dart:_http/http_impl.dart:2498:20)
http_impl.dart:2498
#6      _HttpClient._getConnection.connect (dart:_http/http_impl.dart:2937:12)
http_impl.dart:2937
#7      _HttpClient._getConnection (dart:_http/http_impl.dart:2942:12)
http_impl.dart:2942
#8      _HttpClient._openUrl (dart:_http/http_impl.dart:2797:12)
http_impl.dart:2797
#9      _HttpClient.getUrl (dart:_http/http_impl.dart:2639:48)
http_impl.dart:2639
#10     NetworkImage._loadAsync (package:flutter/src/painting/_network_image_io.dart:104:59)
_network_image_io.dart:104
#11     NetworkImage.loadImage (package:flutter/src/painting/_network_image_io.dart:66:14)
_network_image_io.dart:66
#12     ImageProvider.resolveStreamForKey.&lt;anonymous closure&gt; (package:flutter/src/painting/image_provider.dart:526:39)
image_provider.dart:526
#13     ImageCache.putIfAbsent (package:flutter/src/painting/image_cache.dart:383:22)
image_cache.dart:383
#14     ImageProvider.resolveStreamForKey (package:flutter/src/painting/image_provider.dart:523:81)
image_provider.dart:523
#15     ScrollAwareImageProvider.resolveStreamForKey (package:flutter/src/widgets/scroll_aware_image_provider.dart:107:19)
scroll_aware_image_provider.dart:107
#16     ImageProvider.resolve.&lt;anonymous closure&gt; (package:flutter/src/painting/image_provider.dart:372:9)
image_provider.dart:372
#17     ImageProvider._createErrorHandlerAndKey.&lt;anonymous closure&gt; (package:flutter/src/painting/image_provider.dart:485:24)
image_provider.dart:485
#18     SynchronousFuture.then (package:flutter/src/foundation/synchronous_future.dart:43:27)
synchronous_future.dart:43
#19     ImageProvider._createErrorHandlerAndKey (package:flutter/src/painting/image_provider.dart:482:9)
image_provider.dart:482
#20     ImageProvider.resolve (package:flutter/src/painting/image_provider.dart:369:5)
image_provider.dart:369
#21     _ImageState._resolveImage (package:flutter/src/widgets/image.dart:1135:16)
image.dart:1135
#22     _ImageState.didChangeDependencies (package:flutter/src/widgets/image.dart:1085:5)
image.dart:1085
#23     StatefulElement._firstBuild (package:flutter/src/widgets/framework.dart:5780:11)
framework.dart:5780
#24     ComponentElement.mount (package:flutter/src/widgets/framework.dart:5607:5)
framework.dart:5607
#25     Element.inflateWidget (package:flutter/src/widgets/framework.dart:4480:16)
framework.dart:4480
#26     MultiChildRenderObjectElement.inflateWidget (package:flutter/src/widgets/framework.dart:7049:36)
framework.dart:7049
#27     MultiChildRenderObjectElement.mount (package:flutter/src/widgets/framework.dart:7061:32)
framework.dart:7061
...     Normal element mounting (130 frames)
#157    Element.inflateWidget (package:flutter/src/widgets/framework.dart:4480:16)
framework.dart:4480
#158    Element.updateChild (package:flutter/src/widgets/framework.dart:3963:18)
framework.dart:3963
#159    SliverMultiBoxAdaptorElement.updateChild (package:flutter/src/widgets/sliver.dart:982:37)
sliver.dart:982
#160    SliverMultiBoxAdaptorElement.createChild.&lt;anonymous closure&gt; (package:flutter/src/widgets/sliver.dart:967:20)
sliver.dart:967
#161    BuildOwner.buildScope (package:flutter/src/widgets/framework.dart:3038:19)
framework.dart:3038
#162    SliverMultiBoxAdaptorElement.createChild (package:flutter/src/widgets/sliver.dart:959:12)
sliver.dart:959
#163    RenderSliverMultiBoxAdaptor._createOrObtainChild.&lt;anonymous closure&gt; (package:flutter/src/rendering/sliver_multi_box_adaptor.dart:367:23)
sliver_multi_box_adaptor.dart:367
#164    RenderObject.invokeLayoutCallback.&lt;anonymous closure&gt; (package:flutter/src/rendering/object.dart:2738:59)
object.dart:2738
#165    PipelineOwner._enableMutationsToDirtySubtrees (package:flutter/src/rendering/object.dart:1108:15)
object.dart:1108
#166    RenderObject.invokeLayoutCallback (package:flutter/src/rendering/object.dart:2738:14)
object.dart:2738
#167    RenderSliverMultiBoxAdaptor._createOrObtainChild (package:flutter/src/rendering/sliver_multi_box_adaptor.dart:356:5)
sliver_multi_box_adaptor.dart:356
#168    RenderSliverMultiBoxAdaptor.insertAndLayoutChild (package:flutter/src/rendering/sliver_multi_box_adaptor.dart:504:5)
s

import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:snpit_guild_app/infrastructure/snapit_guild_api/snapit_guild_api.openapi.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/explorers/get_explorer_info.dart';

class ExplorerListPage extends HookConsumerWidget {
  const ExplorerListPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final explorerState = ref.watch(getExplorerNotifierProvider);

    useEffect(
      () {
        WidgetsBinding.instance.addPostFrameCallback((_) {
          ref.read(getExplorerNotifierProvider.notifier).executeRequest();
        });
        return null;
      },
      [],
    );

    Widget buildExplorerCard(ExplorerDTO explorer) {
      return Card(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        elevation: 4,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (explorer.explorerImage != null)
              Image.network(
                explorer.explorerImage!,
                height: 100,
                width: 100,
                fit: BoxFit.cover,
              ),
            const SizedBox(height: 8),
            Text(
              explorer.explorerName ?? 'Unknown Explorer',
            ),
            const SizedBox(height: 4),
            Text(
              explorer.explorerDescription ?? 'No description available',
              textAlign: TextAlign.center,
            ),
          ],
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: const Text('Select explorer'),
        actions: [
          IconButton(
            onPressed: () =&gt; Navigator.pop(context),
            icon: const Icon(Icons.close),
            tooltip: 'Close',
          ),
        ],
      ),
      body: explorerState.when(
        data: (explorers) {
          if ((explorers ?? []).isEmpty) {
            return const Center(child: Text('No explorers available.'));
          }

          return Column(
            children: [
              const SizedBox(height: 16),
              Expanded(
                child: CarouselSlider(
                  options: CarouselOptions(
                    height: 250,
                    enableInfiniteScroll: false,
                    enlargeCenterPage: true,
                  ),
                  items: (explorers ?? []).map(buildExplorerCard).toList(),
                ),
              ),
              const SizedBox(height: 16),
            ],
          );
        },
        loading: () =&gt; const Center(child: CircularProgressIndicator()),
        error: (error, _) =&gt; Center(child: Text('Error: $error')),
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: ElevatedButton(
            onPressed: () {
              // TODO: ボタン押下時の処理 (API 通信など)
              Navigator.pop(context);
            },
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 16),
            ),
            child: const Text('Start explore'),
          ),
        ),
      ),
    );
  }
}

---

## 🤖 Assistant
*2025-01-08 17:20:17*

このエラーは、アプリがネットワーク画像をロードしようとして無効なドメイン（例: `armani.name`）にアクセスしようとしているために発生しています。以下の解決策を試してみてください。

---

### 解決策

#### 1. **無効なURLを検出してスキップ**
ネットワーク画像が存在しない場合のデフォルト画像を設定します。`Image.network`では、`errorBuilder`プロパティを使ってエラー時に代替画像を表示できます。

修正版：

```dart
Widget buildExplorerCard(ExplorerDTO explorer) {
  return Card(
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(12),
    ),
    elevation: 4,
    child: Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        if (explorer.explorerImage != null)
          Image.network(
            explorer.explorerImage!,
            height: 100,
            width: 100,
            fit: BoxFit.cover,
            errorBuilder: (context, error, stackTrace) {
              return const Icon(
                Icons.broken_image,
                size: 100,
                color: Colors.grey,
              );
            },
          ),
        const SizedBox(height: 8),
        Text(
          explorer.explorerName ?? 'Unknown Explorer',
        ),
        const SizedBox(height: 4),
        Text(
          explorer.explorerDescription ?? 'No description available',
          textAlign: TextAlign.center,
        ),
      ],
    ),
  );
}
```

#### 2. **バックエンドAPIのデータ検証**
APIが提供している`explorerImage`フィールドが有効なURLであることを確認してください。無効なURLが送信されている場合は、バックエンドの修正が必要です。

---

#### 3. **ネットワーク接続の確認**
アプリが正しいネットワークに接続されていることを確認します。開発中は、エミュレータやデバイスがインターネットに接続されているか確認してください。

---

#### 4. **デフォルト画像を使用**
バックエンドから画像URLが無効または空の場合にデフォルト画像を表示します。

修正版：

```dart
Widget buildExplorerCard(ExplorerDTO explorer) {
  final imageUrl = explorer.explorerImage?.isNotEmpty == true
      ? explorer.explorerImage!
      : 'https://via.placeholder.com/100';

  return Card(
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(12),
    ),
    elevation: 4,
    child: Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Image.network(
          imageUrl,
          height: 100,
          width: 100,
          fit: BoxFit.cover,
          errorBuilder: (context, error, stackTrace) {
            return const Icon(
              Icons.broken_image,
              size: 100,
              color: Colors.grey,
            );
          },
        ),
        const SizedBox(height: 8),
        Text(
          explorer.explorerName ?? 'Unknown Explorer',
        ),
        const SizedBox(height: 4),
        Text(
          explorer.explorerDescription ?? 'No description available',
          textAlign: TextAlign.center,
        ),
      ],
    ),
  );
}
```

---

### その他の考慮事項

- **APIのレスポンスデータをローカルで確認**: 取得したAPIレスポンスデータを`debugPrint`でログに出力し、画像URLが期待通りであることを確認します。
- **ネットワークエラーハンドリング**: `executeRequest`メソッドで、`explorer.explorerImage`が無効な場合にリストから除外するロジックを追加できます。

修正後、このエラーが解消することを確認してください。

---

## 👤 User
*2025-01-08 17:27:40*

{
  "content_type": "image_asset_pointer",
  "asset_pointer": "file-service://file-CPd5quDqiRK83LsenbqLYM",
  "size_bytes": 75252,
  "width": 516,
  "height": 469,
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
このようにしたい。ちょっと色々違うので修正してほしい。

@freezed
class ExplorerDTO with _$ExplorerDTO {
  factory ExplorerDTO({
    @JsonKey(name: 'explorerId') required String? explorerId,
    @JsonKey(name: 'tokenId') required String? tokenId,
    @JsonKey(name: 'explorerName') required String? explorerName,
    @JsonKey(name: 'explorerDescription') String? explorerDescription,
    @JsonKey(name: 'explorerImage') required String? explorerImage,
    @JsonKey(name: 'explorerCategory')
    required ExplorerDTOExplorerCategory? explorerCategory,
    @JsonKey(name: 'energy') required num? energy,
    @JsonKey(name: 'rarity') required ExplorerDTORarity? rarity,
    @JsonKey(name: 'energyConsumption') required num? energyConsumption,
    @JsonKey(name: 'range') required num? range,
    @JsonKey(name: 'decoyFinding') required bool? decoyFinding,
    @JsonKey(name: 'totalSearch') required num? totalSearch,
    @JsonKey(name: 'totalSpotFound') required num? totalSpotFound,
  }) = _ExplorerDTO;

  factory ExplorerDTO.fromJson(Map&lt;String, dynamic&gt; jsonMap) =&gt;
      _$ExplorerDTOFromJson(jsonMap);
}

import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:snpit_guild_app/infrastructure/snapit_guild_api/snapit_guild_api.openapi.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/explorers/get_explorer_info.dart';

class ExplorerListPage extends HookConsumerWidget {
  const ExplorerListPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final explorerState = ref.watch(getExplorerNotifierProvider);

    useEffect(
      () {
        WidgetsBinding.instance.addPostFrameCallback((_) {
          ref.read(getExplorerNotifierProvider.notifier).executeRequest();
        });
        return null;
      },
      [],
    );

    Widget buildExplorerCard(ExplorerDTO explorer) {
      final imageUrl = explorer.explorerImage?.isNotEmpty == true
          ? explorer.explorerImage!
          : null;

      return Card(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        elevation: 4,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            imageUrl != null
                ? Image.network(
                    imageUrl,
                    height: 100,
                    width: 100,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) {
                      return const Icon(
                        Icons.broken_image_outlined,
                        size: 100,
                      );
                    },
                  )
                : const Icon(
                    Icons.hide_image_outlined,
                    size: 100,
                  ),
            const SizedBox(height: 8),
            Text(
              explorer.explorerName ?? 'Unknown Explorer',
            ),
            const SizedBox(height: 4),
            Text(
              explorer.explorerDescription ?? 'No description available',
              textAlign: TextAlign.center,
            ),
          ],
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: const Text('Select explorer'),
        actions: [
          IconButton(
            onPressed: () =&gt; context.pop(),
            icon: const Icon(Icons.close),
          ),
        ],
      ),
      body: explorerState.when(
        data: (explorers) {
          if ((explorers ?? []).isEmpty) {
            return const Center(child: Text('No explorers available.'));
          }

          return Column(
            children: [
              const SizedBox(height: 16),
              Expanded(
                child: CarouselSlider(
                  options: CarouselOptions(
                    height: 250,
                    enableInfiniteScroll: false,
                    enlargeCenterPage: true,
                  ),
                  items: (explorers ?? []).map(buildExplorerCard).toList(),
                ),
              ),
              const SizedBox(height: 16),
            ],
          );
        },
        loading: () =&gt; const Center(child: CircularProgressIndicator()),
        error: (error, _) =&gt; Center(child: Text('Error: $error')),
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: ElevatedButton(
            onPressed: () {
              context.pop();
            },
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 16),
            ),
            child: const Text('Start explore'),
          ),
        ),
      ),
    );
  }
}

---

## 🤖 Assistant
*2025-01-08 17:28:28*

Thank you for sharing the updated details and design image. Here's how to refine the implementation to match the provided UI:

### Key Adjustments for the Design

1. **Card Layout**:
   - Add rounded corners and consistent spacing.
   - Align text and icons inside the card.

2. **UI Details**:
   - Use a horizontal progress bar for energy representation.
   - Display the explorer's range, name, and description inside the card in the specified format.

3. **Colors and Styling**:
   - Match button and card styling with the design.

4. **Carousel Behavior**:
   - Ensure the carousel aligns with the design layout.

---

### Updated Code

```dart
import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:snpit_guild_app/infrastructure/snapit_guild_api/snapit_guild_api.openapi.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/explorers/get_explorer_info.dart';

class ExplorerListPage extends HookConsumerWidget {
  const ExplorerListPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final explorerState = ref.watch(getExplorerNotifierProvider);

    useEffect(
      () {
        WidgetsBinding.instance.addPostFrameCallback((_) {
          ref.read(getExplorerNotifierProvider.notifier).executeRequest();
        });
        return null;
      },
      [],
    );

    Widget buildExplorerCard(ExplorerDTO explorer) {
      final imageUrl = explorer.explorerImage?.isNotEmpty == true
          ? explorer.explorerImage!
          : null;

      return Card(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        color: const Color(0xFF2B2B2B), // Card background color
        elevation: 4,
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  // Explorer Image
                  ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: imageUrl != null
                        ? Image.network(
                            imageUrl,
                            height: 80,
                            width: 80,
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) {
                              return const Icon(
                                Icons.broken_image_outlined,
                                size: 80,
                                color: Colors.grey,
                              );
                            },
                          )
                        : const Icon(
                            Icons.hide_image_outlined,
                            size: 80,
                            color: Colors.grey,
                          ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Explorer Name
                        Text(
                          explorer.explorerName ?? 'Unknown Explorer',
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 4),
                        // Energy Progress Bar
                        Row(
                          children: [
                            Expanded(
                              child: LinearProgressIndicator(
                                value: (explorer.energy ?? 0) / 100,
                                backgroundColor: Colors.grey[700],
                                valueColor: AlwaysStoppedAnimation<Color>(
                                  Colors.green,
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Text(
                              '${explorer.energy ?? 0}%',
                              style: const TextStyle(
                                fontSize: 14,
                                color: Colors.white,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        // Explorer Range
                        Text(
                          'Search range: ${explorer.range ?? 0} km',
                          style: const TextStyle(
                            fontSize: 14,
                            color: Colors.grey,
                          ),
                        ),
                        const SizedBox(height: 4),
                        // Explorer Description
                        Text(
                          explorer.explorerDescription ?? 'No description available',
                          style: const TextStyle(
                            fontSize: 12,
                            color: Colors.grey,
                          ),
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
    }

    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF1F1F1F),
        automaticallyImplyLeading: false,
        title: const Text(
          'Select explorer',
          style: TextStyle(color: Colors.white),
        ),
        actions: [
          IconButton(
            onPressed: () => context.pop(),
            icon: const Icon(Icons.close),
            color: Colors.white,
          ),
        ],
      ),
      backgroundColor: const Color(0xFF121212), // Page background color
      body: explorerState.when(
        data: (explorers) {
          if ((explorers ?? []).isEmpty) {
            return const Center(child: Text('No explorers available.'));
          }

          return Column(
            children: [
              const SizedBox(height: 16),
              Expanded(
                child: CarouselSlider(
                  options: CarouselOptions(
                    height: 200,
                    enableInfiniteScroll: false,
                    enlargeCenterPage: true,
                  ),
                  items: (explorers ?? []).map(buildExplorerCard).toList(),
                ),
              ),
              const SizedBox(height: 16),
            ],
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, _) => Center(
          child: Text(
            'Error: $error',
            style: const TextStyle(color: Colors.white),
          ),
        ),
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: ElevatedButton(
            onPressed: () {
              context.pop();
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF4CAF50), // Button color
              padding: const EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            child: const Text(
              'Start explore',
              style: TextStyle(fontSize: 16),
            ),
          ),
        ),
      ),
    );
  }
}
```

---

### Key Changes

1. **Card Layout**:
   - Included an image, energy progress bar, range, and description in the card.
   - Styled text, spacing, and alignment based on the provided design.

2. **Color Customizations**:
   - Applied custom colors for the card, button, and background to match the theme.

3. **Progress Bar**:
   - Added a `LinearProgressIndicator` to represent the energy level.

4. **Styling Consistency**:
   - Used consistent font sizes and colors for text.

Let me know if additional refinements are needed!

---
