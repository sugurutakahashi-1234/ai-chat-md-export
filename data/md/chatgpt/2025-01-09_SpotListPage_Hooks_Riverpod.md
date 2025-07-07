# SpotListPage Hooks Riverpod

日付: 2025-01-09

---

## 👤 ユーザー
*2025/1/9 16:31:21*

SpotListPage について hooksとRiverpodで getAllSpot を使って描画してほしい

@freezed
class SpotDTO with \_$SpotDTO {
  factory SpotDTO({
    @JsonKey(name: 'spotId') required String? spotId,
    @JsonKey(name: 'guildId') String? guildId,
    @JsonKey(name: 'spotName') required String? spotName,
    @JsonKey(name: 'spotStatus') required SpotDTOSpotStatus? spotStatus,
    @JsonKey(name: 'rarity') required SpotDTORarity? rarity,
    @JsonKey(name: 'photoHash') required String? photoHash,
    @JsonKey(name: 'photoUrl') required String? photoUrl,
    @JsonKey(name: 'spotLongitude') required num? spotLongitude,
    @JsonKey(name: 'spotLatitude') required num? spotLatitude,
    @JsonKey(name: 'spotAddress') required String? spotAddress,
    @JsonKey(name: 'createdAt') required DateTime? createdAt,
  }) = \_SpotDTO;

  factory SpotDTO.fromJson(Map&lt;String, dynamic&gt; jsonMap) =&gt;
      \_$SpotDTOFromJson(jsonMap);
}

import 'package:flutter/foundation.dart';
import 'package:riverpod\_annotation/riverpod\_annotation.dart';

import 'package:snpit\_guild\_app/infrastructure/snapit\_guild\_api/snapit\_guild\_api.openapi.dart';
import 'package:snpit\_guild\_app/presentation/providers/api\_client/api\_provider.dart';

part 'get\_spot\_info.g.dart';

@riverpod
class GetSpotNotifier extends \_$GetSpotNotifier {
  @override
  Future&lt;List&lt;SpotDTO&gt;?&gt; build() async =&gt; null;

  Future&lt;void&gt; getAllSpot() async {
    state = const AsyncValue.loading();
    try {
      final api = await ref.watch(spotsApiProvider.future);
      final response = await api.spotControllerGetAllSpots();
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
import 'package:go\_router/go\_router.dart';
import 'package:snpit\_guild\_app/domain/screen.dart';
import 'package:snpit\_guild\_app/presentation/design\_token/color\_pallet.dart';
import 'package:snpit\_guild\_app/presentation/design\_token/color\_token.dart';
import 'package:snpit\_guild\_app/utils/extensions/uri\_extensions.dart';

class SpotListPage extends StatelessWidget {
  const SpotListPage({super.key});

  @override
  Widget build(BuildContext context) {
    final spotList = List.generate(
      12,
      (index) =&gt; {
        'imageUrl': UriExtensions.randomImageUrl.toString(),
        'label': String.fromCharCode(65 + index),
      },
    );

    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: const Text('Spot list'),
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
      body: GridView.builder(
        padding: const EdgeInsets.all(16),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 3,
          crossAxisSpacing: 8,
          mainAxisSpacing: 8,
        ),
        itemCount: spotList.length,
        itemBuilder: (context, index) {
          final spot = spotList\[index\];
          final imageUrl = spot\['imageUrl'\]!;
          final label = spot\['label'\]!;

          return GestureDetector(
            onTap: () {
              context.push(Screen.spotDetail.path);
            },
            child: Stack(
              alignment: Alignment.bottomCenter,
              children: \[
                DecoratedBox(
                  decoration: BoxDecoration(
                    border: Border.all(
                      color: ColorPallet.white,
                    ),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Padding(
                    // 角丸にボーダーのために Padding を使う
                    padding: const EdgeInsets.all(1),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: Image.network(
                        imageUrl,
                        fit: BoxFit.cover,
                        width: double.infinity,
                        height: double.infinity,
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
                ),
                Positioned(
                  top: 8,
                  left: 8,
                  child: Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.black.withValues(alpha: 0.5),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      label,
                      style: const TextStyle(color: Colors.white, fontSize: 12),
                    ),
                  ),
                ),
              \],
            ),
          );
        },
      ),
    );
  }
}

---

## 🔧 ツール
*2025/1/9 16:31:47*

\*\*Integrating Riverpod\*\*

Considering how to link SpotListPage with Riverpod, potentially utilizing Riverpod Hook for GetSpotNotifier or calling getAllSpot to retrieve spots dynamically.

\*\*Integrating hooks and Riverpod\*\*

We'll use flutter\_hooks with `useProvider` to connect to GetSpotNotifier and `getAllSpot()`. This method ensures seamless rendering of spots within the SpotListPage UI.

\*\*Integrating data retrieval\*\*

I'm thinking through how the SpotListPage class uses `HookConsumerWidget` to link with GetSpotNotifier. The `useEffect` method calls `getAllSpot()` to fetch spots, then UI elements show spot data.

---

## 🤖 アシスタント
*2025/1/9 16:31:47*

以下は、`hooks` と `Riverpod` を使って `getAllSpot` の結果を描画するサンプル実装例です。  
`SpotListPage` を `HookConsumerWidget` に変更し、`useEffect` で画面表示時に `getAllSpot()` を呼び出して取得したデータを描画しています。

```dart
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:snpit_guild_app/presentation/design_token/color_pallet.dart';
import 'package:snpit_guild_app/presentation/design_token/color_token.dart';
import 'package:snpit_guild_app/presentation/providers/get_spot_info.dart';
import 'package:snpit_guild_app/utils/extensions/uri_extensions.dart';
import 'package:snpit_guild_app/domain/screen.dart';

class SpotListPage extends HookConsumerWidget {
  const SpotListPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // GetSpotNotifier の state を監視
    final spotState = ref.watch(getSpotNotifierProvider);
    // Notifier（操作用）を取得
    final spotNotifier = ref.read(getSpotNotifierProvider.notifier);

    // 画面表示時に一度だけ getAllSpot() を実行
    useEffect(() {
      spotNotifier.getAllSpot();
      return null;
    }, []);

    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: const Text('Spot list'),
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
      // spotState が AsyncValue なので .when(...) を使って状態に応じて描画を分ける
      body: spotState.when(
        data: (spotList) {
          // spotList が null or 空配列の場合の考慮
          if (spotList == null || spotList.isEmpty) {
            return const Center(child: Text('データがありません'));
          }

          return GridView.builder(
            padding: const EdgeInsets.all(16),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 3,
              crossAxisSpacing: 8,
              mainAxisSpacing: 8,
            ),
            itemCount: spotList.length,
            itemBuilder: (context, index) {
              final spot = spotList[index];
              final imageUrl = spot.photoUrl ?? UriExtensions.randomImageUrl;
              final label = spot.spotName ?? 'No Name';

              return GestureDetector(
                onTap: () {
                  context.push(Screen.spotDetail.path);
                },
                child: Stack(
                  alignment: Alignment.bottomCenter,
                  children: [
                    DecoratedBox(
                      decoration: BoxDecoration(
                        border: Border.all(
                          color: ColorPallet.white,
                        ),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Padding(
                        // 角丸とボーダーのために Padding を使う
                        padding: const EdgeInsets.all(1),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: Image.network(
                            imageUrl,
                            fit: BoxFit.cover,
                            width: double.infinity,
                            height: double.infinity,
                            loadingBuilder: (context, child, loadingProgress) {
                              if (loadingProgress == null) {
                                return child;
                              }
                              return const Center(
                                child: CircularProgressIndicator(),
                              );
                            },
                            errorBuilder: (context, error, stackTrace) {
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
                    ),
                    Positioned(
                      top: 8,
                      left: 8,
                      child: Container(
                        padding:
                            const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.black.withAlpha(130),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          label,
                          style: const TextStyle(color: Colors.white, fontSize: 12),
                        ),
                      ),
                    ),
                  ],
                ),
              );
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stackTrace) {
          return Center(
            child: Text('エラーが発生しました: $error'),
          );
        },
      ),
    );
  }
}
```

- **HookConsumerWidget**  
  Riverpod + Hooks を使う場合は、`StatelessWidget` ではなく `HookConsumerWidget` を継承することで、  
  `WidgetRef` と Hooks の機能を同時に使えます。

- **useEffect**  
  `useEffect` は依存配列が空の場合、初回 build 時（マウント時）のみ実行されます。  
  ここで `spotNotifier.getAllSpot()` を呼び出すことで、ページ読み込み時に API からスポットリストを取得します。

- **ref.watch(getSpotNotifierProvider)**  
  `GetSpotNotifier` の `state`（`AsyncValue<List<SpotDTO>?>`）を監視しています。  
  この `state` を `.when(...)` で受け取り、`data / loading / error` の状態ごとに画面を分けています。

- **spotList が null / 空 の場合**  
  データが取得できていない、もしくは 0 件の場合はメッセージを表示しています。

- **GridView.builder**  
  実際のスポットリストをグリッド表示しています。スポットの `photoUrl` がない場合はサンプルとして  
  `UriExtensions.randomImageUrl` を使う例にしています。

以上のように書き換えることで、Hooks + Riverpod で取得したデータをもとに `SpotListPage` の描画ができるようになります。

---

## 👤 ユーザー
*2025/1/9 16:36:57*

useEffect で Future.microtask(() { もしくは WidgetsBinding.instance.addPostFrameCallback((\_) { で囲う場合とそうでない場合の違い

---

## 🔧 ツール
*2025/1/9 16:37:27*

\*\*Assessing callback methods\*\*

I’m looking into the difference between using 'useEffect' to delay execution with Future.microtask or WidgetsBinding.instance.addPostFrameCallback, which ensures tasks run after the current frame is rendered, avoiding potential immediate state changes and subsequent rebuilds.

\*\*Eliminating build errors\*\*

I’m positioning Future.microtask within 'useEffect' to preempt errors like "changing state during build" or "unnecessary rebuild" by ensuring the task runs after the current frame is rendered.

\*\*Ensuring UI stability\*\*

I’m emphasizing the utility of addPostFrameCallback for tasks like size measurements or accessing RenderBox properties after rendering, improving UI stability before conflicts arise or API calls are made.

---

## 🤖 アシスタント
*2025/1/9 16:37:27*

`useEffect` 内で非同期処理（例: API コールや state の更新など）を行う際、  
「そのまま実行する」パターンと「`Future.microtask` や `WidgetsBinding.instance.addPostFrameCallback` でラップする」パターンでは、  
それが **いつ** 実行されるか（＝**タイミング**）に違いがあります。  

---

## 結論を先に

1. **そのまま実行**  
   - `useEffect(() { spotNotifier.getAllSpot(); }, []);`  
   - **画面のビルド中**（厳密には build メソッドによるウィジェットツリー再構築後）にそのまま実行される。  
   - もしここで `setState`（または Riverpod の `state` 書き換え）を呼ぶと、  
     「ビルド中にもう一度ビルドを呼び出した」という警告が出る可能性がある。  

2. **`Future.microtask` で実行**  
   - `useEffect(() { Future.microtask(() => spotNotifier.getAllSpot()); }, []);`  
   - **現在のイベントループのタスクが完了した“直後”**（マイクロタスクキュー）が実行タイミング。  
   - 画面ビルドが終わったあとのマイクロタスクとして実行されるので、  
     ビルド中に状態を変更してしまうリスクを下げる。  

3. **`WidgetsBinding.instance.addPostFrameCallback` で実行**  
   - `useEffect(() { WidgetsBinding.instance.addPostFrameCallback((_) => spotNotifier.getAllSpot()); }, []);`  
   - **フレーム描画が完了した“直後”** に実行される。  
   - ビルド -> レイアウト -> ペイント まで終わったあとに呼ばれるため、  
     UI が完全に描画されたあとで何かしら処理したい場合に適している。  

---

## それぞれの詳細

### 1. そのまま実行する

```dart
useEffect(() {
  spotNotifier.getAllSpot();
  return null;
}, []);
```

- `useEffect` はビルド完了後に呼ばれますが、  
  **「ビルドが完了した直後(同フレーム内)に同期的に」** 実行されるイメージです。  
- このタイミングで、すぐに `spotNotifier.getAllSpot()` の中で状態変更が起こると、  
  そのまま **「ビルド中に再度ビルドを要求する」** と判断され、警告が出るケースがある。  
  - Riverpod の `state` を変更して即座に再ビルドが入ると、  
    「すでにビルドプロセス中なのにまたビルドが走る」となるためです。  

### 2. `Future.microtask` を使う

```dart
useEffect(() {
  Future.microtask(() {
    spotNotifier.getAllSpot();
  });
  return null;
}, []);
```

- `Future.microtask` は現在のイベントループを一旦抜けて、  
  **次のマイクロタスクキュー** で非同期的に実行されます。  
- つまり **「ビルドが終わったあと」** に処理が実行されるため、  
  「ビルド中に状態を変更してしまう」リスクを避けやすい。  
- なお「マイクロタスク」と「イベントループ」について正確に踏み込むとややこしいですが、  
  フレームの描画結果が確定する前でも動き得るため、  
  「UI が完全に描画された後にやりたい」ケースでは **まだタイミングが早い** こともあります。  

### 3. `WidgetsBinding.instance.addPostFrameCallback` を使う

```dart
useEffect(() {
  WidgetsBinding.instance.addPostFrameCallback((_) {
    spotNotifier.getAllSpot();
  });
  return null;
}, []);
```

- Flutter でよく使われる「1フレーム描画が完了した“後”に呼びたい」というときのテクニック。  
- ビルド -> レイアウト -> ペイント のすべてが終わったあとに呼ばれるため、  
  画面に描画されてから何か処理をしたいときに最適です。  
- 例えば、「ウィジェットのサイズや位置を正確に測ってから API コールをしたい」などの用途に向いています。  

---

## どの場合にどれを使う？

1. **単純な API コールや State 更新だけなら、`Future.microtask` や `addPostFrameCallback` は必須でない**  
   - まずはそのまま `useEffect` 内で実行して問題なければそれで OK。  
   - 警告やバグが起きたら、タイミングをズラす手段として検討。

2. **「ビルドが走る直後に状態更新すると不具合・警告が出る」場合に `Future.microtask`**  
   - ほぼ同じフレーム内だけど、少しだけタイミングを後ろにずらして実行したいとき。

3. **「ウィジェットが描画完了してから」でないといけないケースは `addPostFrameCallback`**  
   - 例えば、ウィジェットのサイズを取得してから次の動作に進みたい、  
     レイアウト後の情報が必要、など UI が確定していないと困る場合。  

---

## まとめ

- **実行タイミングが異なる** ことで、副作用による再ビルドやレイアウト計測などを  
  「いつ処理したいのか？」を明示的にコントロールできるようになります。  
- **とりあえず API コールくらいなら普通に `useEffect` で呼ぶ** → 問題があるならタイミング調整、  
  というフローを覚えておくと良いでしょう。

---
