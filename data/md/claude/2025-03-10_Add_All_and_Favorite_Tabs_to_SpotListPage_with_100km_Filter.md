# Add All and Favorite Tabs to SpotListPage with 100km Filter

日付: 2025-03-10

---

## 👤 ユーザー
*2025/03/10 19:20:55*

今のSpotListPageの画面にallタブとお気に入りタブを追加したい。お気に入りタブの中身はカミングスーンと文字を置くだけで実装しなくていい。

allタブには Within 100km radiusのフィルター機能があって、IsSpotFilterModeNotifierを使ってそのOn/offを切り替えてほしい。

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

  Future&lt;BuiltList&lt;SpotDTO&gt;&gt; getAllSpotList(
    LatLng location, [
    num range = 3000,
  ]) async {
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
          favorite: false,
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

---

## 🤖 アシスタント
*2025/03/10 19:21:52*

I'll help you implement the tab layout for your SpotListPage with the All and Favorite tabs, along with the filter functionality using the IsSpotFilterModeNotifier. Here's how we'll modify your code:
```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```



I've updated the SpotListPage component to include tabs for 'All' and 'Favorite' as requested. Here are the key changes I made:

1. **Added TabController and TabBar**:
   - Used `useTabController` hook to manage the tabs
   - Created a TabBar with 'All' and 'Favorite' tabs in the AppBar

2. **Implemented the Tab Views**:
   - The 'All' tab contains the original spot list functionality
   - The 'Favorite' tab just shows a "Coming soon" message as requested

3. **Added Filter Functionality**:
   - Created a filter button that toggles the `isSpotFilterMode` state
   - Connected to the `IsSpotFilterModeNotifier` to persist the filter state
   - Modified the `getAllSpotList` call to use a range of 100km when filter is active (3000km otherwise)
   - Added visual indication when the filter is active

4. **Improved Code Organization**:
   - Created a separate `_AllSpotsTab` widget for better code structure
   - Extracted common parameters to pass down to the tab component

The filter toggles between showing spots within 100km or the default 3000km range, persisting the user's preference using the IsSpotFilterModeNotifier as required.

Would you like me to explain any specific part of the implementation in more detail?

---

## 👤 ユーザー
*2025/03/10 19:28:12*

日本語にしてほしいのと、色はこちらにしてほしい。toggleFilterModeもonTapXXXのような命名にしてほしい。_AllSpotsTabも同じclassないで実装してほしい。理由はメソッドを引数にすると可読性が悪いためである。StatelessWidgetで外に切り出しているのは別に問題ないが、メソッドを引数にするのはやめてほしい。refが使いづらいためである。
また、spotListAsyncValue がdynamic

labelColor: ColorToken.text,
          unselectedLabelColor: ColorToken.defaultBorder,

---

## 🤖 アシスタント
*2025/03/10 19:29:20*

理解しました。リクエストに従って修正します：

1. 日本語に変更
2. 指定された色を使用
3. メソッド名を `onTapXXX` の形式に変更
4. `_AllSpotsTab` を同じクラス内に実装し、メソッドを引数として渡すことを避ける
5. 型の問題を修正
```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```


```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```


```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```



変更点は以下のとおりです：

1. **テキストを日本語に変更**：
   - エラーメッセージやUIテキストを日本語に変更しました
   - タイトルを「スポットリスト」に変更しました
   - フィルターボタンのテキストを「半径100km以内」に変更しました
   - 「準備中」のメッセージを追加しました

2. **指定された色の設定**：
   - TabBarの色を指定通りに変更しました
   ```dart
   labelColor: ColorToken.text,
   unselectedLabelColor: ColorToken.defaultBorder,
   ```

3. **メソッド名の変更**：
   - `toggleFilterMode` を `onTapFilterMode` に変更しました

4. **コード構造の改善**：
   - 別のクラスだった `_AllSpotsTab` を削除し、同じクラス内にメソッド `buildAllTabContent()` として実装しました
   - 同様に、お気に入りタブのコンテンツも `buildFavoriteTabContent()` メソッドとして実装しました
   - メソッドを引数として渡す構造を排除し、直接refを使用できるようにしました

5. **型の修正**：
   - spotListAsyncValueの型を明示的に指定し、dynamicエラーを修正しました
   ```dart
   data: (BuiltList<SpotDTO>? spotList) {
   ```
   - 必要なimportも追加しました

これらの変更により、指定された要件をすべて満たし、メンテナンス性と可読性が向上したコードになりました。

---
