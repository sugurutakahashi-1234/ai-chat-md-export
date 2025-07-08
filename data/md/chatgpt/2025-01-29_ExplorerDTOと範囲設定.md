# ExplorerDTOと範囲設定

日付: 2025-01-29

---

## 👤 ユーザー
*2025/01/29 16:15:43*

onExploringNotifierProvider について、bool でコントロールしていたが、ExplorerDTOも持たせて、そのrangeをinal circle = Circle(のradiusに指定したい。rangeはKmなので、m変換してほしい。つまり1000倍です。


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



@riverpod
class OnExploringNotifier extends _$OnExploringNotifier {
  @override
  bool build() =&gt; false;

  void show() {
    state = true;
    // 8 秒は仮の値です
    Timer(const Duration(seconds: 5), () {
      state = false;
    });
  }

  void hide() =&gt; state = false;
}


      ref.listen&lt;bool&gt;(onExploringNotifierProvider, (previous, next) async {
        if (next) {
          try {
            final currentLocation = await ref
                .watch(currentLocationNotifierProvider.notifier)
                .getCurrentLocation();

            final circle = Circle(
              circleId: const CircleId('explorerCircle'),
              center: currentLocation,
              radius: 100,
              strokeColor: const Color(0xFF004DFF), // ブルー
              strokeWidth: 1,
              fillColor: const Color(0x40004DFF), // 25%ぐらい透過のブルー
            );

            circlesState.value = {circle};

            await googleMapControllerState.value?.animateCamera(
              CameraUpdate.newLatLng(currentLocation),
            );
          } on Exception catch (error) {
            if (context.mounted) {
              showErrorSnackBar(context, error);
            }
          }
        } else {
          circlesState.value = {};
          final explodedSpotList = ref.read(explodedSpotListNotifierProvider);

          final spotPhotoItems = explodedSpotList
                  ?.where((spot) =&gt; spot.photoUrl != null)
                  .map(
                    (spot) =&gt; SpotPhotoItem(
                      photoId: spot.photoId ?? '',
                      spotPhotoUrl: spot.photoUrl ?? '',
                      spotOwnership: spot.guildId == null
                          ? SpotOwnership.neutral
                          : spot.guildId == myGuildIdState.value
                              ? SpotOwnership.owner
                              : SpotOwnership.enemy,
                    ),
                  )
                  .toList() ??
              [];

          ref.read(shouldRefreshMapSpotNotifierProvider.notifier).trigger();

          await showDialog&lt;void&gt;(
            context: context,
            builder: (_) =&gt; ExploredResultDialog(
              spotPhotoItemList: spotPhotoItems,
            ),
          );

          ref.read(explodedSpotListNotifierProvider.notifier).clear();
        }
      });

---

## 🔧 ツール
*2025/01/29 16:16:50*

It's clear the user is working through how to store and update the ExplorerDTO within OnExploringNotifier. Their goal is to adjust the circle's radius to match the ExplorerDTO's range (converted to meters).

**Defining a new approach**

I'm assembling a new provider to manage the selected ExplorerDTO. The goal is to utilize a listener method to dynamically adjust the circle's radius based on the ExplorerDTO's range.

**Refining the approach**

I'm rethinking the Circle creation method, suggesting a state model with both exploration status and ExplorerDTO. This might streamline radius adjustments and offer a more cohesive solution.

**Revisiting state management**

I'm exploring the use of a state model with exploration status and ExplorerDTO, allowing for dynamic radius adjustments in the listener based on the ExplorerDTO's range, converted to kilometers.

**Balancing options**

I'm weighing whether to keep the Notifier's state inclusive of both flags and DTO, or to separate the DTO into its own provider and adjust the listener accordingly for radius adjustments.

**Implementing state separation**

I’m working through a state separation method, with the Notifier managing flags and DTOs, and the listener adjusting the circle's radius based on the transformed range.

---

## 🤖 アシスタント
*2025/01/29 16:16:50*

下記のように、「探索中かどうか」という `bool` 状態だけでなく、実際に使用する `ExplorerDTO` も一緒に持てるような状態クラス (`OnExploringState`) と、それを操作する Notifier (`OnExploringNotifier`) を用意するとスムーズに管理できます。`range` は km 単位なので、実際に `Circle` の radius に反映するときはメートル換算 (×1000) して使います。

## サンプル実装例

```dart
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

// ****************
// ExplorerDTO 定義
// ****************
part 'explorer_dto.freezed.dart';
part 'explorer_dto.g.dart';

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
    @JsonKey(name: 'range') required num? range, // km 単位
    @JsonKey(name: 'decoyFinding') required bool? decoyFinding,
    @JsonKey(name: 'totalSearch') required num? totalSearch,
    @JsonKey(name: 'totalSpotFound') required num? totalSpotFound,
  }) = _ExplorerDTO;

  factory ExplorerDTO.fromJson(Map<String, dynamic> json) =>
      _$ExplorerDTOFromJson(json);
}

// 例：列挙型のダミー定義（実装プロジェクトに合わせて書き換えてください）
enum ExplorerDTOExplorerCategory { normal, special }
enum ExplorerDTORarity { normal, rare }

// ************************
// OnExploringState の定義
// ************************
part 'on_exploring_state.freezed.dart';

@freezed
class OnExploringState with _$OnExploringState {
  const factory OnExploringState({
    @Default(false) bool isExploring,
    ExplorerDTO? explorer,
  }) = _OnExploringState;
}

// ************************
// OnExploringNotifier の定義
// ************************
@riverpod
class OnExploringNotifier extends _$OnExploringNotifier {
  @override
  OnExploringState build() {
    // デフォルトは isExploring=false, explorer=null の状態で開始
    return const OnExploringState();
  }

  /// 探索開始(= true) にしつつ、どの ExplorerDTO を使うかを登録する
  void show(ExplorerDTO explorer) {
    state = state.copyWith(
      isExploring: true,
      explorer: explorer,
    );

    // ここはサンプルとして 5 秒後に自動的に探索を終了している例
    // 実装に合わせてタイマーや終了条件は調整してください
    Timer(const Duration(seconds: 5), () {
      hide();
    });
  }

  /// 探索終了(= false) にする
  void hide() {
    state = state.copyWith(
      isExploring: false,
      explorer: null,
    );
  }
}
```

## `ref.listen` 側の利用例

`ref.listen<OnExploringState>(onExploringNotifierProvider, ...)` で状態が変わったときに処理を走らせます。`isExploring == true` になったときに `explorer.range` を km → m に変換して、`Circle` の半径に指定します。

```dart
ref.listen<OnExploringState>(
  onExploringNotifierProvider,
  (previous, next) async {
    // 探索中になったタイミング
    if (next.isExploring) {
      try {
        final currentLocation = await ref
            .watch(currentLocationNotifierProvider.notifier)
            .getCurrentLocation();

        // range は km 単位なので、メートルに換算（×1000）
        final explorerRangeKm = next.explorer?.range ?? 0;
        final rangeInMeters = explorerRangeKm * 1000.0;

        final circle = Circle(
          circleId: const CircleId('explorerCircle'),
          center: currentLocation,
          radius: rangeInMeters,
          strokeColor: const Color(0xFF004DFF), // ブルー
          strokeWidth: 1,
          fillColor: const Color(0x40004DFF), // 25%ぐらい透過のブルー
        );

        circlesState.value = {circle};

        await googleMapControllerState.value?.animateCamera(
          CameraUpdate.newLatLng(currentLocation),
        );
      } on Exception catch (error) {
        if (context.mounted) {
          showErrorSnackBar(context, error);
        }
      }
    } else {
      // 探索が終わったタイミング
      circlesState.value = {};
      final explodedSpotList = ref.read(explodedSpotListNotifierProvider);

      final spotPhotoItems = explodedSpotList
              ?.where((spot) => spot.photoUrl != null)
              .map(
                (spot) => SpotPhotoItem(
                  photoId: spot.photoId ?? '',
                  spotPhotoUrl: spot.photoUrl ?? '',
                  spotOwnership: spot.guildId == null
                      ? SpotOwnership.neutral
                      : spot.guildId == myGuildIdState.value
                          ? SpotOwnership.owner
                          : SpotOwnership.enemy,
                ),
              )
              .toList() ??
          [];

      ref.read(shouldRefreshMapSpotNotifierProvider.notifier).trigger();

      await showDialog<void>(
        context: context,
        builder: (_) => ExploredResultDialog(
          spotPhotoItemList: spotPhotoItems,
        ),
      );

      ref.read(explodedSpotListNotifierProvider.notifier).clear();
    }
  },
);
```

あとは、実際に「探索を開始したい（= サークルを表示したい）」ときに

```dart
final explorerDto = ExplorerDTO(
  explorerId: 'ex01',
  tokenId: 'tk01',
  explorerName: 'Test Explorer',
  explorerImage: 'https://...',
  explorerCategory: ExplorerDTOExplorerCategory.normal,
  energy: 100,
  rarity: ExplorerDTORarity.normal,
  energyConsumption: 10,
  range: 0.1,  // 100m のイメージで 0.1km
  decoyFinding: false,
  totalSearch: 0,
  totalSpotFound: 0,
);

// ボタンなどから呼び出し
ref.read(onExploringNotifierProvider.notifier).show(explorerDto);
```

のように `show(explorerDto)` を呼び出すと、5 秒間だけ探索状態になり、リスナー内でサークルが表示される仕組みになります。`range` は km なので、サークル用の半径として指定する際は `* 1000` してメートルに変換して使用している点がポイントです。

---
