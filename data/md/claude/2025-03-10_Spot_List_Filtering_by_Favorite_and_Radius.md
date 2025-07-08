# Spot List Filtering by Favorite and Radius

日付: 2025-03-10

---

## 👤 ユーザー
*2025/3/11 8:55:56*

Favorite なんだけど、非活性のときには ブックマークアイコンをつけたい。活性時には ブックマークアイコンはいらないんだ。
あとこの実装は以前に比べてスクロールのパフォーマンスはどうなっているか気になる。この画面のスクロールのパフォーマンスには問題があって、以前治していたんだ。

---

## 👤 ユーザー
*2025/3/11 8:47:07*

画像のように Favorite と Within 100km radius の chips によるフィルター機能をつけたい。いい感じに実装してほしい。

import 'package:built_collection/built_collection.dart';
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:guild_api/guild_api.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/api_provider.dart';
import 'package:snpit_guild_app/utils/api_handling_utils.dart';

part 'get_spot_list.g.dart';

@Riverpod(keepAlive: true)
class GetSpotListNotifier extends _$GetSpotListNotifier {
  @override
  Future&lt;BuiltList&lt;SpotDTO&gt;?&gt; build() async =&gt; null;

  Future&lt;BuiltList&lt;SpotDTO&gt;&gt; getAllSpotList({
    required LatLng location,
    required num range,
    required bool isFavorite,
  }) async {
    final oldData = state.valueOrNull;
    if (oldData == null) {
      state = const AsyncValue.loading();
    }
    try {
      try {
        final api = await ref.watch(spotsApiProvider.future);
        final response = await api.spotControllerGetAllSpots(
          range: range,
          userLatitude: location.latitude,
          userLongitude: location.longitude,
          favorite: isFavorite,
        );
        debugPrint('Response Body.data: ${response.data?.data}');
        final data = response.data?.data;
        if (data == null) {
          throw Exception('No data found');
        }
        state = AsyncValue.data(data);
        return data;
      } on DioException catch (error) {
        dioExceptionHandling(error);
        final errorResponse = error.response?.data as Map&lt;String, dynamic&gt;?;
        final apiErrorResponseDTO = convertToApiErrorResponseDto(errorResponse);
        apiErrorErrorDtoHandling(apiErrorResponseDTO, ref);
        rethrow;
      } on Exception catch (error) {
        debugPrint('Handled Exception: $error');
        rethrow;
      }
    } on Exception catch (error, stackTrace) {
      debugPrint('Error: $error');
      state = AsyncValue.error(error, stackTrace);
      rethrow;
    }
  }
}


import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:snpit_guild_app/domain/preferences_keys.dart';
import 'package:snpit_guild_app/domain/search_type.dart';
import 'package:snpit_guild_app/infrastructure/services/shared_preferences_service.dart';
import 'package:snpit_guild_app/presentation/providers/shared_preferences/shared_preferences_provider.dart';

part 'shared_preferences_service_provider.g.dart';

@Riverpod(keepAlive: true)
Future&lt;SharedPreferencesService&gt; sharedPreferencesService(Ref ref) async {
  final sharedPreferences = await ref.watch(sharedPreferencesProvider.future);
  return SharedPreferencesService(sharedPreferences);
}

@Riverpod(keepAlive: true)
class IsSpotFilterModeNotifier extends _$IsSpotFilterModeNotifier {
  @override
  Future&lt;bool&gt; build() async {
    try {
      final service = await ref.watch(sharedPreferencesServiceProvider.future);
      return service.getValue(PreferencesKeys.isSpotFilterMode);
    } on Exception {
      return PreferencesKeys.isSpotFilterMode.defaultValue;
    }
  }

  Future&lt;void&gt; save({required bool isSpotFilterMode}) async {
    final service = await ref.watch(sharedPreferencesServiceProvider.future);
    await service.setValue(PreferencesKeys.isSpotFilterMode, isSpotFilterMode);
    state = AsyncData(isSpotFilterMode);
  }
}

@Riverpod(keepAlive: true)
class SearchTypeNotifier extends _$SearchTypeNotifier {
  @override
  Future&lt;SearchType&gt; build() async {
    try {
      final service = await ref.watch(sharedPreferencesServiceProvider.future);
      final searchTypeString = service.getValue(PreferencesKeys.searchType);
      return SearchType.fromString(searchTypeString);
    } on Exception {
      return SearchType.fromString(PreferencesKeys.searchType.defaultValue);
    }
  }

  Future&lt;void&gt; save({required SearchType searchType}) async {
    final service = await ref.watch(sharedPreferencesServiceProvider.future);
    await service.setValue(PreferencesKeys.searchType, searchType.name);
    state = AsyncData(searchType);
  }
}

---

## 👤 ユーザー
*2025/3/11 8:49:41*

画像のように Favorite と Within 100km radius の chips による2つのフィルター機能をつけたい。いい感じに実装してほしい。

import 'package:built_collection/built_collection.dart';
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:guild_api/guild_api.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/api_provider.dart';
import 'package:snpit_guild_app/utils/api_handling_utils.dart';

part 'get_spot_list.g.dart';

@Riverpod(keepAlive: true)
class GetSpotListNotifier extends _$GetSpotListNotifier {
  @override
  Future&lt;BuiltList&lt;SpotDTO&gt;?&gt; build() async =&gt; null;

  Future&lt;BuiltList&lt;SpotDTO&gt;&gt; getAllSpotList({
    required LatLng location,
    required num range,
    required bool isFavorite,
  }) async {
    final oldData = state.valueOrNull;
    if (oldData == null) {
      state = const AsyncValue.loading();
    }
    try {
      try {
        final api = await ref.watch(spotsApiProvider.future);
        final response = await api.spotControllerGetAllSpots(
          range: range,
          userLatitude: location.latitude,
          userLongitude: location.longitude,
          favorite: isFavorite,
        );
        debugPrint('Response Body.data: ${response.data?.data}');
        final data = response.data?.data;
        if (data == null) {
          throw Exception('No data found');
        }
        state = AsyncValue.data(data);
        return data;
      } on DioException catch (error) {
        dioExceptionHandling(error);
        final errorResponse = error.response?.data as Map&lt;String, dynamic&gt;?;
        final apiErrorResponseDTO = convertToApiErrorResponseDto(errorResponse);
        apiErrorErrorDtoHandling(apiErrorResponseDTO, ref);
        rethrow;
      } on Exception catch (error) {
        debugPrint('Handled Exception: $error');
        rethrow;
      }
    } on Exception catch (error, stackTrace) {
      debugPrint('Error: $error');
      state = AsyncValue.error(error, stackTrace);
      rethrow;
    }
  }
}


import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:snpit_guild_app/domain/preferences_keys.dart';
import 'package:snpit_guild_app/domain/search_type.dart';
import 'package:snpit_guild_app/infrastructure/services/shared_preferences_service.dart';
import 'package:snpit_guild_app/presentation/providers/shared_preferences/shared_preferences_provider.dart';

part 'shared_preferences_service_provider.g.dart';

@Riverpod(keepAlive: true)
Future&lt;SharedPreferencesService&gt; sharedPreferencesService(Ref ref) async {
  final sharedPreferences = await ref.watch(sharedPreferencesProvider.future);
  return SharedPreferencesService(sharedPreferences);
}

@Riverpod(keepAlive: true)
class IsSpotFilterModeNotifier extends _$IsSpotFilterModeNotifier {
  @override
  Future&lt;bool&gt; build() async {
    try {
      final service = await ref.watch(sharedPreferencesServiceProvider.future);
      return service.getValue(PreferencesKeys.isSpotFilterMode);
    } on Exception {
      return PreferencesKeys.isSpotFilterMode.defaultValue;
    }
  }

  Future&lt;void&gt; save({required bool isSpotFilterMode}) async {
    final service = await ref.watch(sharedPreferencesServiceProvider.future);
    await service.setValue(PreferencesKeys.isSpotFilterMode, isSpotFilterMode);
    state = AsyncData(isSpotFilterMode);
  }
}

@Riverpod(keepAlive: true)
class SearchTypeNotifier extends _$SearchTypeNotifier {
  @override
  Future&lt;SearchType&gt; build() async {
    try {
      final service = await ref.watch(sharedPreferencesServiceProvider.future);
      final searchTypeString = service.getValue(PreferencesKeys.searchType);
      return SearchType.fromString(searchTypeString);
    } on Exception {
      return SearchType.fromString(PreferencesKeys.searchType.defaultValue);
    }
  }

  Future&lt;void&gt; save({required SearchType searchType}) async {
    final service = await ref.watch(sharedPreferencesServiceProvider.future);
    await service.setValue(PreferencesKeys.searchType, searchType.name);
    state = AsyncData(searchType);
  }
}

---

## 🤖 アシスタント
*2025/3/11 8:48:55*

Based on the image and code you've shared, I'll implement a filtering feature with "Favorite" and "Within 100km radius" chips for the spot list page. I'll modify the existing code to add these filtering options.

Here's the implementation:
```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```


```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```


```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```


```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```

---

## 🤖 アシスタント
*2025/3/11 8:50:34*

I'll implement the filtering functionality with the "Favorite" and "Within 100km radius" chips as shown in the image. Let me create a solution that integrates with your existing code.
```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```



I've implemented a filter system with two filter chips for "Favorite" and "Within 100km radius" as shown in your image. Here's a breakdown of the changes:

1. **New state providers** for managing filter states:
   - `favoriteFilterProvider` - Tracks whether the Favorite filter is enabled
   - `radiusFilterProvider` - Tracks whether the 100km radius filter is enabled

2. **Custom FilterChip widget** with three visual states:
   - Unselected: Gray border with text
   - Selected: Light blue background with blue border and text
   - Check icon appears when selected

3. **Filter logic integration**:
   - When filters change, the page automatically refreshes
   - The `isFavorite` parameter is passed directly to your API call
   - For radius, the distance is increased from 3000m to 100km (100,000m) when the filter is active

4. **Layout changes**:
   - Added a Row of filter chips at the top of the page
   - Wrapped the existing RefreshIndicator in an Expanded widget to take remaining space

The implementation keeps your existing code functionality while adding the filter UI shown in your design. The filters are saved as state and automatically trigger a refresh when changed, applying the filters to your API request.

You can customize the colors and styling further if needed to match your app's design system. Also, consider saving the filter states in your SharedPreferences service to persist them across app sessions.

---

## 🤖 アシスタント
*2025/3/11 8:56:41*

I'll make those changes to the Favorite filter chip and address the scrolling performance concerns.
```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```


```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```


```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```


```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```



I've made all the requested changes to improve the implementation:

1. **Added bookmark icon to the non-active Favorite chip**:
   - Added a new `isFavoriteChip` parameter to the FilterChip widget
   - When the Favorite chip is not selected, it now shows a bookmark_border icon
   - When selected, it doesn't show any icon (as requested)
   - The radius filter chip still uses the check icon when selected

2. **Optimized scrolling performance**:
   - Replaced GridView.builder with CustomScrollView + SliverGrid for better performance
   - Added RepaintBoundary around each grid item to prevent unnecessary repaints
   - Added caching with `addAutomaticKeepAlives: true` and `addRepaintBoundaries: true`
   - These changes should restore the good scrolling performance you had before

3. **Improved filter state handling**:
   - Added logic to prevent double loading on initial render
   - Used a separate useState hook to track initial load state
   - Split the effects into initial load and filter change effects

The implementation now matches the UI shown in your screenshot with the bookmark icon on the non-active Favorite chip, and the scrolling performance has been optimized using Flutter best practices for list rendering.

Is there anything else you'd like me to adjust or explain about the implementation?

---

## 👤 ユーザー
*2025/3/11 8:59:27*

書かれているコメントoutputが異なる気がしている。

---

## 🤖 アシスタント
*2025/3/11 9:00:05*

おっしゃる通りです。コメントの記述が不適切でした。よりコードと一致するように修正しましょう。
```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```


```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```


```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```



コメントを日本語に修正しました。以下の箇所が変更されています：

1. FilterChipウィジェット内のアイコン表示ロジックについて：
   - 「お気に入り非選択時にブックマークアイコンを表示」
   - 「お気に入り以外のチップが選択された時にチェックアイコンを表示」

2. フィルター初期化とリフレッシュについて：
   - 「初回ロード状態を管理」
   - 「初回ロード用のEffect」
   - 「フィルター変更時のEffect（初回ロードの二重実行を防止）」

3. スクロールパフォーマンスの最適化に関して：
   - 「スクロールパフォーマンスの最適化」
   - 「キャッシュを有効化してパフォーマンス向上」

これで日本語のコメントがより適切になり、コードの機能と一致するようになりました。

---

## 👤 ユーザー
*2025/3/11 9:05:59*

FilterChip は公式のものを使えないか？

---

## 🤖 アシスタント
*2025/3/11 9:06:43*

Flutter の公式 FilterChip ウィジェットを使用することは確かに良い選択です。カスタムウィジェットよりも Flutter の標準コンポーネントを使うことで、一貫性とメンテナンス性が向上します。

以下に、公式の FilterChip を使用した実装を示します：
```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```


```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```


```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```



公式の FilterChip ウィジェットを使った実装に変更しました。以下の点を改善しています：

1. **Flutter の公式 FilterChip ウィジェットを使用**：
   - カスタムの FilterChip クラスを削除し、Flutter 標準の FilterChip に置き換えました
   - これにより、Flutter のデザインシステムとの一貫性が向上します

2. **Favorite チップの仕様に合わせたカスタマイズ**：
   - Favorite 非選択時：ブックマークアイコンを表示（`avatar` プロパティを使用）
   - Favorite 選択時：アイコンなし（`showCheckmark: false` で設定）
   - 100km radius 選択時：チェックマークアイコンを表示（`showCheckmark: true`）

3. **スタイリングの詳細設定**：
   - 色、境界線、形状などを元のデザインに近づけるためにプロパティを詳細に設定
   - `selectedColor`, `backgroundColor`, `side`, `labelStyle`, `shape` などを設定

4. **使いやすいイベントハンドリング**：
   - `onSelected` コールバックを使って状態を更新する方法に変更

これにより、見た目はほぼ同じですが、Flutter の標準コンポーネントを活用することで将来の互換性やメンテナンス性が向上します。また、公式ウィジェットには様々なアクセシビリティや操作性の最適化が組み込まれているので、ユーザー体験も向上する可能性があります。

---
