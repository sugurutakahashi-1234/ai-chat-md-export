# Google Maps エラー対処法

日付: 2025-02-04

---

## 👤 ユーザー
*2025/2/4 16:25:47*

lutterのgoogleMapを使ったアプリを開発しているが以下のようなエラーがどこかで発生している理由はなんだと思いますか？

Error: PlatformException(channel-error,
Unable to establish connection on channel: "d ev.flutter.pigeon.google\_maps\_flutter\_ios.Ma psApi.animateCamera.1"., null, null)

import 'package:flutter/material.dart';
import 'package:flutter\_hooks/flutter\_hooks.dart';
import 'package:google\_maps\_flutter/google\_maps\_flutter.dart';
import 'package:hooks\_riverpod/hooks\_riverpod.dart';
import 'package:snpit\_guild\_app/domain/design/color\_pallet.dart';
import 'package:snpit\_guild\_app/domain/design/color\_token.dart';
import 'package:snpit\_guild\_app/domain/spot\_type.dart';
import 'package:snpit\_guild\_app/gen/assets.gen.dart';
import 'package:snpit\_guild\_app/infrastructure/entities/extensions/convert\_to\_domain.dart';
import 'package:snpit\_guild\_app/infrastructure/snapit\_guild\_api/snapit\_guild\_api.openapi.dart';
import 'package:snpit\_guild\_app/presentation/providers/api\_client/guilds/get\_guild.dart';
import 'package:snpit\_guild\_app/presentation/providers/api\_client/guilds/spots/get\_guild\_spot\_list.dart';
import 'package:snpit\_guild\_app/presentation/providers/api\_client/item\_boxes/get\_item\_box\_list.dart';
import 'package:snpit\_guild\_app/presentation/providers/api\_client/spots/get\_spot\_list.dart';
import 'package:snpit\_guild\_app/presentation/providers/api\_client/users/get\_user.dart';
import 'package:snpit\_guild\_app/presentation/providers/current\_location.dart';
import 'package:snpit\_guild\_app/presentation/providers/exploded\_spot\_list.dart';
import 'package:snpit\_guild\_app/presentation/providers/on\_exploring.dart';
import 'package:snpit\_guild\_app/presentation/providers/should\_refresh\_map\_spot.dart';
import 'package:snpit\_guild\_app/presentation/providers/show\_explorer\_list.dart';
import 'package:snpit\_guild\_app/presentation/providers/show\_our\_spot\_detail.dart';
import 'package:snpit\_guild\_app/presentation/providers/show\_shootable\_spot\_detail.dart';
import 'package:snpit\_guild\_app/presentation/providers/show\_spot\_list.dart';
import 'package:snpit\_guild\_app/presentation/widgets/dialogs/explored\_result\_dialog.dart';
import 'package:snpit\_guild\_app/presentation/widgets/dialogs/item\_box\_dialog.dart';
import 'package:snpit\_guild\_app/presentation/widgets/dialogs/location\_access\_dialog.dart';
import 'package:snpit\_guild\_app/presentation/widgets/item\_box\_icon.dart';
import 'package:snpit\_guild\_app/presentation/widgets/spot\_icon.dart';
import 'package:snpit\_guild\_app/presentation/widgets/spot\_photo\_carousel.dart';
import 'package:snpit\_guild\_app/presentation/widgets/square\_image.dart';
import 'package:snpit\_guild\_app/utils/snack\_bar\_utils.dart';
import 'package:widget\_to\_marker/widget\_to\_marker.dart';

/// 逆三角形を描画するシンプルな Painter
class TrianglePainter extends CustomPainter {
  TrianglePainter({required this.color});
  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = color;
    final path = Path()
      ..moveTo(0, 0) // 左上
      ..lineTo(size.width, 0) // 右上
      ..lineTo(size.width / 2, size.height) // 底辺の中央
      ..close();
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(TrianglePainter oldDelegate) =&gt; false;
}

class MapPage extends HookConsumerWidget {
  const MapPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currentLocationAsyncValue =
        ref.watch(currentLocationNotifierProvider);
    final spotListAsyncValue = ref.watch(getSpotListNotifierProvider);
    final onExploringStateValue = ref.watch(onExploringNotifierProvider);
    final googleMapControllerState = useState&lt;GoogleMapController?&gt;(null);
    final myGuildIdState = useState&lt;String?&gt;(null);
    final markersState = useState&lt;Set&lt;Marker&gt;&gt;({});
    final circlesState = useState&lt;Set&lt;Circle&gt;&gt;({});
    final isLoadingState = useState(false);

    Future&lt;void&gt; zoomToFitCircle({
      required LatLng center,
      required double radiusMeters,
    }) async {
      // 1km ≈ 0.009度 (厳密でなくてOK)
      // 今回は 1~10km 程度なのでこれで十分
      final radiusKm = radiusMeters / 1000.0;
      final delta = 0.009 \* radiusKm;

      // 南西端と北東端をざっくり決める
      final southwest = LatLng(
        center.latitude - delta,
        center.longitude - delta,
      );
      final northeast = LatLng(
        center.latitude + delta,
        center.longitude + delta,
      );

      // LatLngBounds を作成
      final bounds = LatLngBounds(southwest: southwest, northeast: northeast);

      const padding = 72.0; // 画面四隅との余白
      final cameraUpdate = CameraUpdate.newLatLngBounds(bounds, padding);

      if (!context.mounted) {
        return;
      }

      await googleMapControllerState.value?.animateCamera(cameraUpdate);
    }

    Future&lt;void&gt; onTapSpotMarker(String spotId, SpotType spotType) async {
      switch (spotType) {
        case SpotType.noneGuild:
          ref
              .read(showShootableSpotDetailNotifierProvider.notifier)
              .show(spotId);

        case SpotType.myGuild:
          ref.read(showOurSpotDetailNotifierProvider.notifier).show(spotId);

        case SpotType.enemyGuild:
          ref
              .read(showShootableSpotDetailNotifierProvider.notifier)
              .show(spotId);
      }
    }

    Future&lt;void&gt; onTapItemBoxMarker(ItemBoxDTO itemBox) async {
      await showDialog&lt;void&gt;(
        context: context,
        builder: (\_) {
          return ItemBoxDialog(itemBox: itemBox);
        },
      );
    }

    SpotType getSpotType(String? spotGuildId, String? myGuildId) {
      if (spotGuildId == null) {
        return SpotType.noneGuild;
      } else if (spotGuildId == myGuildId) {
        return SpotType.myGuild;
      } else {
        return SpotType.enemyGuild;
      }
    }

    // Widget buildSpotMarkerWidget(SpotType spotType, String? photoUrl) {
    Widget buildSpotMarkerWidget(GuildSpotDTO spot, String? myGuildId) {
      final spotType = getSpotType(spot.guildId, myGuildId);

      return Padding(
        padding: const EdgeInsets.all(8),
        child: DecoratedBox(
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            boxShadow: \[
              BoxShadow(
                blurRadius: 8,
                color: ColorToken.bgBlack.withAlpha(50),
                spreadRadius: 2,
                offset: const Offset(0, 2),
              ),
            \],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: \[
              SpotIcon(spotType: spotType),
              Transform.translate(
                offset: const Offset(0, -4),
                child: CustomPaint(
                  size: const Size(12, 12),
                  painter: TrianglePainter(color: ColorToken.bgWhite),
                ),
              ),
            \],
          ),
        ),
      );
    }

    Widget buildItemBoxMarkerWidget(ItemBoxDTO itemBox) {
      final rarity = itemBox.rarity?.domainRarity;

      return Padding(
        padding: const EdgeInsets.all(8),
        child: DecoratedBox(
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            boxShadow: \[
              BoxShadow(
                blurRadius: 8,
                color: ColorToken.bgBlack.withAlpha(50),
                spreadRadius: 2,
                offset: const Offset(0, 2),
              ),
            \],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: \[
              DecoratedBox(
                decoration: BoxDecoration(
                  border: Border.all(
                    color: ColorPallet.white,
                    width: 4,
                  ),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(4),
                  child: ColoredBox(
                    color: ColorToken.bgWhite,
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: ItemBoxIcon(
                        rarity: rarity,
                        size: 64,
                      ),
                    ),
                  ),
                ),
              ),
              Transform.translate(
                offset: const Offset(0, -4),
                child: CustomPaint(
                  size: const Size(12, 12),
                  painter: TrianglePainter(color: ColorToken.bgWhite),
                ),
              ),
            \],
          ),
        ),
      );
    }

    Future&lt;Marker&gt; buildSpotMarker({
      required GuildSpotDTO spot,
      required String? myGuildId,
      required Future&lt;void&gt; Function(String spotId, SpotType spotType)
          onTapSpotMarker,
    }) async {
      final lat = spot.spotLatitude?.toDouble() ?? 0;
      final lng = spot.spotLongitude?.toDouble() ?? 0;
      final spotId = spot.spotId ?? '';
      final spotType = getSpotType(spot.guildId, myGuildId);
      final widget = buildSpotMarkerWidget(spot, myGuildId);

      final iconDescriptor = await widget.toBitmapDescriptor(
        logicalSize: const Size(88, 100),
        imageSize: const Size(242, 275),
        waitToRender: const Duration(milliseconds: 100),
      );

      return Marker(
        markerId: MarkerId('spot\_$spotId'),
        position: LatLng(lat, lng),
        icon: iconDescriptor,
        onTap: () async {
          await onTapSpotMarker(spotId, spotType);
        },
      );
    }

    Future&lt;Marker&gt; buildItemBoxMarker({
      required ItemBoxDTO itemBox,
      required Future&lt;void&gt; Function(ItemBoxDTO itemBox) onTapItemBoxMarker,
    }) async {
      final lat = itemBox.itemBoxLatitude?.toDouble() ?? 0;
      final lng = itemBox.itemBoxLongitude?.toDouble() ?? 0;
      final itemBoxId = itemBox.itemBoxId ?? '';
      final widget = buildItemBoxMarkerWidget(itemBox);

      final iconDescriptor = await widget.toBitmapDescriptor(
        logicalSize: const Size(88, 100),
        imageSize: const Size(198, 225),
        waitToRender: const Duration(milliseconds: 100),
      );

      return Marker(
        markerId: MarkerId('itemBox\_$itemBoxId'),
        position: LatLng(lat, lng),
        icon: iconDescriptor,
        onTap: () async {
          await onTapItemBoxMarker(itemBox);
        },
      );
    }

    Future&lt;void&gt; refreshAllMarkers({
      required List&lt;GuildSpotDTO&gt; newSpotList,
      required List&lt;ItemBoxDTO&gt; newItemBoxList,
      required String? myGuildId,
    }) async {
      final currentMarkers = markersState.value.toSet();

      final neededMarkerIds = &lt;String&gt;{};
      for (final spot in newSpotList) {
        final spotId = spot.spotId ?? '';
        neededMarkerIds.add('spot\_$spotId');
      }
      for (final box in newItemBoxList) {
        final boxId = box.itemBoxId ?? '';
        neededMarkerIds.add('itemBox\_$boxId');
      }

      // 既存マーカーから「不要になったもの」を削除する
      currentMarkers.removeWhere(
        (marker) =&gt; !neededMarkerIds.contains(marker.markerId.value),
      );

      if (!context.mounted) {
        return;
      }

      // いったん削除結果を反映(不要マーカーが消える)
      markersState.value = {...currentMarkers};

      // Spot のリストを順に処理し、1つずつ再描画して反映
      for (final spot in newSpotList) {
        final markerId = MarkerId('spot\_${spot.spotId}');
        // buildSpotMarker (必ず再生成して再描画する)
        final newMarker = await buildSpotMarker(
          spot: spot,
          myGuildId: myGuildId,
          onTapSpotMarker: (spotId, spotType) async {
            await onTapSpotMarker(spotId, spotType);
          },
        );

        // 既存に同じ ID のマーカーがあれば削除してから追加
        currentMarkers
          ..removeWhere((marker) =&gt; marker.markerId == markerId)
          ..add(newMarker);

        if (!context.mounted) {
          return;
        }

        // 新たに追加される or 更新されたマーカーをすぐ反映
        markersState.value = {...currentMarkers};

        // UI をブロックしにくくするために少し待機
        await Future&lt;void&gt;.delayed(Duration.zero);
      }

      // ItemBox も同様に処理
      for (final itemBox in newItemBoxList) {
        final markerId = MarkerId('itemBox\_${itemBox.itemBoxId}');
        final newMarker = await buildItemBoxMarker(
          itemBox: itemBox,
          onTapItemBoxMarker: (box) async {
            await onTapItemBoxMarker(box);
          },
        );

        currentMarkers
          ..removeWhere((marker) =&gt; marker.markerId == markerId)
          ..add(newMarker);

        if (!context.mounted) {
          return;
        }

        markersState.value = {...currentMarkers};

        await Future&lt;void&gt;.delayed(Duration.zero);
      }
    }

    Future&lt;void&gt; onTapNearMe() async {
      try {
        final refreshedLocation = await ref
            .read(currentLocationNotifierProvider.notifier)
            .updateCurrentLocation();

        await googleMapControllerState.value?.animateCamera(
          CameraUpdate.newLatLng(refreshedLocation),
        );
      } on Exception catch (error) {
        if (context.mounted) {
          showErrorSnackBar(context, error);
        }
      }
    }

    Future&lt;void&gt; onTapExplorer() async {
      ref.read(showExplorerListNotifierProvider.notifier).show();
    }

    Future&lt;void&gt; onTapSpotList() async {
      ref.read(showSpotListNotifierProvider.notifier).show();
    }

    Future&lt;void&gt; onRefresh() async {
      try {
        if (!context.mounted) {
          return;
        }

        isLoadingState.value = true;

        await ref.read(getSpotListNotifierProvider.notifier).getAllSpotList();

        await ref.read(getMyGuildNotifierProvider.notifier).getMyGuild();

        final myUser =
            await ref.read(getMyUserNotifierProvider.notifier).getMyUser();

        if (!context.mounted) {
          return;
        }

        myGuildIdState.value = myUser.guildId;

        final itemBoxList = await ref
            .read(getItemBoxListNotifierProvider.notifier)
            .getItemBoxList();

        final myGuildId = myGuildIdState.value;
        if (myGuildId != null) {
          final spotList = await ref
              .read(getGuildSpotListNotifierProvider.notifier)
              .getGuildSpotList(myGuildId);

          await refreshAllMarkers(
            newSpotList: spotList,
            newItemBoxList: itemBoxList,
            myGuildId: myGuildId,
          );
        }
      } on Exception catch (error) {
        if (context.mounted) {
          showErrorSnackBar(context, error);
        }
      } finally {
        if (context.mounted) {
          isLoadingState.value = false;
        }
      }
    }

    useEffect(
      () {
        Future.microtask(() async {
          await onRefresh();
        });
        // フォアグラウンド復帰で位置情報再取得
        final observer = \_LifecycleObserver(
          onResume: () async {
            final refreshedLocation =
                ref.refresh(currentLocationNotifierProvider);
            debugPrint('Location refreshed: $refreshedLocation');
          },
        );
        WidgetsBinding.instance.addObserver(observer);
        return () =&gt; WidgetsBinding.instance.removeObserver(observer);
      },
      \[\],
    );

    ref
      ..listen&lt;int&gt;(shouldRefreshMapSpotNotifierProvider,
          (previous, next) async {
        // マーカーの更新中はスキップ
        if (!isLoadingState.value) {
          // マーカーの更新
          await onRefresh();
        }
      })
      ..listen&lt;OnExploringState&gt;(onExploringNotifierProvider,
          (previous, next) async {
        if (next.isExploring) {
          try {
            final currentLocation = await ref
                .watch(currentLocationNotifierProvider.notifier)
                .updateCurrentLocation();

            // range は km 単位なので、メートルに換算（×1000）
            final explorerRangeKm = next.explorer?.range ?? 0;
            final rangeInMeters = explorerRangeKm \* 1000.0;

            final circle = Circle(
              circleId: const CircleId('explorerCircle'),
              center: currentLocation,
              radius: rangeInMeters,
              strokeColor: const Color(0xFF004DFF), // ブルー
              strokeWidth: 1,
              fillColor: const Color(0x40004DFF), // 25%ぐらい透過のブルー
            );

            if (!context.mounted) {
              return;
            }

            circlesState.value = {circle};

            await zoomToFitCircle(
              center: currentLocation,
              radiusMeters: rangeInMeters,
            );
          } on Exception catch (error) {
            if (context.mounted) {
              showErrorSnackBar(context, error);
            }
          }
        } else {
          if (!context.mounted) {
            return;
          }

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
              \[\];

          ref.read(shouldRefreshMapSpotNotifierProvider.notifier).trigger();

          await showDialog&lt;void&gt;(
            context: context,
            builder: (\_) =&gt; ExploredResultDialog(
              spotPhotoItemList: spotPhotoItems,
            ),
          );

          ref.read(explodedSpotListNotifierProvider.notifier).clear();
        }
      });

    return Scaffold(
      body: currentLocationAsyncValue.when(
        data: (currentLocation) =&gt; Stack(
          children: \[
            GoogleMap(
              initialCameraPosition: CameraPosition(
                target: currentLocation,
                zoom: 17,
              ),
              myLocationEnabled: true,
              myLocationButtonEnabled: false,
              onMapCreated: (controller) {
                if (context.mounted) {
                  googleMapControllerState.value = controller;
                }
              },
              markers: markersState.value,
              circles: circlesState.value,
            ),
            if (isLoadingState.value)
              const Center(child: CircularProgressIndicator()),
            Positioned(
              bottom: 16,
              left: 16,
              right: 16,
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 8),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: \[
                    // 現在地へ戻るボタン
                    SizedBox(
                      width: 48,
                      height: 48,
                      child: FloatingActionButton(
                        heroTag: 'CurrentLocationButton',
                        onPressed: () async {
                          await onTapNearMe();
                        },
                        child: const Icon(
                          Icons.near\_me,
                          size: 24,
                          color: ColorToken.secondaryDark,
                        ),
                      ),
                    ),
                    // Explore リスト
                    SizedBox(
                      width: 138,
                      height: 48,
                      child: FloatingActionButton(
                        heroTag: 'ShowExploreListButton',
                        onPressed: onExploringStateValue.isExploring
                            ? null
                            : () async {
                                await onTapExplorer();
                              },
                        backgroundColor: onExploringStateValue.isExploring
                            ? ColorPallet.gray800.withValues(alpha: 0.8)
                            : Theme.of(context)
                                .floatingActionButtonTheme
                                .backgroundColor,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(40),
                          side: BorderSide(
                            color: onExploringStateValue.isExploring
                                ? Colors.transparent
                                : ColorToken.secondaryLight,
                          ),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: \[
                            Padding(
                              padding: const EdgeInsets.only(left: 4),
                              child: onExploringStateValue.isExploring
                                  ? Transform.translate(
                                      offset: const Offset(4, 0),
                                      child: const SizedBox(
                                        width: 24,
                                        height: 24,
                                        child: CircularProgressIndicator(
                                          strokeWidth: 2,
                                        ),
                                      ),
                                    )
                                  : Image.asset(
                                      Assets.images.explorerIconFig.path,
                                      width: 40,
                                      height: 40,
                                    ),
                            ),
                            const Spacer(),
                            Text(
                              onExploringStateValue.isExploring
                                  ? 'Exploring...'
                                  : 'Explore',
                              style: TextStyle(
                                fontSize: 16,
                                color: onExploringStateValue.isExploring
                                    ? ColorToken.text
                                    : ColorToken.secondaryDark,
                              ),
                            ),
                            const Spacer(),
                          \],
                        ),
                      ),
                    ),
                    // Spot リスト
                    spotListAsyncValue.when(
                      data: (spotList) {
                        // 上位2つを取り出し、順序を逆にする
                        final displaySpotList =
                            (spotList?.take(2).toList() ?? \[\])
                                .reversed
                                .toList();
                        return SizedBox(
                          width: 48,
                          height: 48,
                          child: FloatingActionButton(
                            backgroundColor: Colors.transparent,
                            shape: const RoundedRectangleBorder(
                              side: BorderSide(
                                color: Colors.transparent,
                              ),
                            ),
                            onPressed: () async {
                              await onTapSpotList();
                            },
                            child: Transform.translate(
                              offset: const Offset(4, 4),
                              child: Stack(
                                clipBehavior: Clip.none,
                                alignment: Alignment.bottomRight,
                                children: \[
                                  for (var i = 0; i &lt; 2; i++)
                                    if (i &lt; displaySpotList.length)
                                      Positioned(
                                        left: i \* -4.0,
                                        top: i \* -4.0,
                                        child: SizedBox(
                                          width: 44,
                                          height: 44,
                                          child: DecoratedBox(
                                            decoration: BoxDecoration(
                                              border: Border.all(
                                                color: ColorToken.bgWhite,
                                                width: 2,
                                              ),
                                              borderRadius:
                                                  BorderRadius.circular(4),
                                            ),
                                            child: Padding(
                                              padding: const EdgeInsets.all(2),
                                              child: ClipRRect(
                                                borderRadius:
                                                    BorderRadius.circular(4),
                                                child: SquareImage(
                                                  imageUrl: displaySpotList\[i\]
                                                      .photoUrl,
                                                  size: 44,
                                                ),
                                              ),
                                            ),
                                          ),
                                        ),
                                      ),
                                \],
                              ),
                            ),
                          ),
                        );
                      },
                      loading: () {
                        return const SizedBox.shrink();
                      },
                      error: (error, \_) {
                        return SizedBox(
                          width: 48,
                          height: 48,
                          child: FloatingActionButton(
                            heroTag: 'ErrorShowSpotListButton',
                            onPressed: () async {
                              await onTapSpotList();
                            },
                            child: const Icon(
                              Icons.photo,
                              size: 24,
                              color: ColorToken.secondaryDark,
                            ),
                          ),
                        );
                      },
                    ),
                  \],
                ),
              ),
            ),
          \],
        ),
        loading: () {
          return const Center(child: CircularProgressIndicator());
        },
        error: (error, \_) {
          return Padding(
            padding: const EdgeInsets.all(24),
            child: Center(
              child: ElevatedButton(
                onPressed: () async {
                  await showDialog&lt;void&gt;(
                    context: context,
                    builder: (\_) {
                      return const LocationAccessDialog();
                    },
                  );
                },
                child: const Text(
                  'Please enable location access',
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

class \_LifecycleObserver extends WidgetsBindingObserver {
  \_LifecycleObserver({this.onResume});
  final VoidCallback? onResume;

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      onResume?.call();
    }
  }
}

---

## 🔧 ツール
*2025/2/4 16:26:17*

\*\*Piecing together cause of error\*\*

The error likely stems from trying to animate the camera on an unloaded or invisible map or issues with the GoogleMapController's setup or state.

\*\*Tracing concurrency errors\*\*

There's a strong possibility that the animateCamera function is being called from an isolate or an unmounted widget, potentially causing concurrency issues when the map isn't fully loaded or visible.

\*\*Possible causes\*\*

The error might result from an incomplete GoogleMap setup, the absence of Google services in the iOS simulator, or executing camera updates when the map isn't in or removed from the widget tree.

\*\*Examining GoogleMapController\*\*

I’m analyzing scenarios where the GoogleMapController might be disposed or detached, or where lifecycle issues could cause animateCamera to be called before the map is initialized, potentially harming the plugin.

\*\*Investigating context validity\*\*

I'm gathering info on whether the animateCamera function is called after the context is invalid, which might cause issues with the controller's validity. This could be due to context changes or view manipulations.

\*\*Validating LatLngBounds\*\*

I’m mapping out invalid LatLngBounds parameters, ensuring northeast coordinates are not less than southwest coordinates, and considering iOS simulator limitations. This seems to be developing with exploration.

\*\*Ensuring map usage\*\*

I’m examining scenarios where animateCamera is called after the map is disposed, possibly due to asynchronous operations like user navigation and device resume, leading to concurrency or lifecycle issues.

\*\*Troubleshooting errors\*\*

I’m identifying a known issue where calling googleMapController.animateCamera() on iOS while the page is inactive leads to errors, as the iOS platform channel disconnects and the map is detached.

\*\*Preventing errors\*\*

To avoid errors, I’m ensuring the map is loaded and in the widget tree before calling animateCamera. This involves checking if googleMapControllerState is null or if the page is mounted and active.

---

## 🤖 アシスタント
*2025/2/4 16:26:17*

Google Map プラグインでは、iOS 側の「platform channel」が何らかの理由で無効になった（マップが破棄されている／まだ初期化されていない等）状態で `animateCamera` が呼ばれると、このようなエラーが出ることがあります。  
特に以下のようなケースが多いです。

1. **画面から離れた（あるいは破棄された）あとに `animateCamera` が呼ばれている**  
   - 画面遷移やウィジェットの dispose 後など、すでに `GoogleMapController` が無効になった状態で `controller.animateCamera()` を呼び出すと、iOS 側のチャネルが「切れて」おりエラーになります。

2. **マップがまだ初期化されていないうちに `animateCamera` を呼んでいる**  
   - `onMapCreated` が完了し、コントローラをセットする前に `animateCamera` を呼ぶと、内部的にまだネイティブ側と接続が完了しておらず、チャネルが確立されていないためエラーになります。

3. **アプリがバックグラウンド中に `animateCamera` が実行されている**  
   - iOS のライフサイクルでバックグラウンドに入るとネイティブのチャネルが一時的に無効化されることがあり、フォアグラウンド復帰までに `animateCamera` すると同様のエラーが出ることがあります。

---

### コード上で気をつけるポイント

- **`onMapCreated`（もしくは `onMapCreated` 内でコントローラを受け取るフック）以降にしか `animateCamera` を呼ばないようにする。**  
  たとえば  
  ```dart
  onMapCreated: (controller) {
    // controller を state に保持する
    googleMapControllerState.value = controller;
    // ここですぐにカメラ操作をしたい場合は、このタイミングでやる
    controller.animateCamera(/* ... */);
  }
  ```
  のように実装するか、  
  「`googleMapControllerState.value` が `null` ではない」かつ「ウィジェットが `mounted` している」ことを必ず確認してからカメラを操作するようにします。

- **画面が dispose されたあとに `animateCamera` しないようにする。**  
  - `Navigator` で別ページに遷移したり、`pop` したりするときに、非同期で残っている処理が `animateCamera` を呼ばないよう `if (!mounted) return;` を挟むなど、ライフサイクル管理を厳密に行います。

- **バックグラウンドに入る際や、フォアグラウンドに復帰した際の処理で `animateCamera` を呼ぶ場合の注意**  
  - Flutter はバックグラウンドに入るとネイティブ側とのチャネルが一時的に無効になる場合があるため、`AppLifecycleState.resumed` で復帰した直後に処理を走らせるとエラーになることがあります。  
  - 復帰時にすぐ呼ぶのではなく、ほんの少し待機 (`Future.delayed(...)`) させてから呼ぶなどの工夫が必要な場合もあります。

---

### まとめ

「`PlatformException(channel-error, Unable to establish connection on channel: “…animateCamera…” )`」は、**iOS 側の Google Map ネイティブチャネルがまだ（あるいはもう）有効でない状態で `animateCamera` が呼ばれた** ことが原因です。  
解決策としては、

- **マップが正しく初期化されたかどうかをチェックしてからカメラ操作する**  
- **ウィジェットが破棄（dispose）されたあとのタイミングで呼ばないようにする**  
- **アプリのライフサイクル（バックグラウンド→フォアグラウンド）を跨ぐ処理なら、復帰後の安全なタイミングで呼ぶようにする**

といった点に注意するとエラーが解消されることが多いです。

---

## 👤 ユーザー
*2025/2/4 16:35:42*

onTapNearMe を実施したときに発生していることがわかった。

以下追加情報です。

// State を更新せずに現在の位置情報を取得する
Future&lt;LatLng&gt; getCurrentLocation({required Flavor flavor}) async {
  try {
    final serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      await Geolocator.openLocationSettings();
      throw Exception('Location services are disabled');
    }

    var permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        throw Exception('Location permissions are denied');
      }
    }

    if (permission == LocationPermission.deniedForever) {
      throw Exception('Location permissions are permanently denied');
    }

    LocationSettings locationSettings;
    if (Platform.isAndroid) {
      locationSettings = AndroidSettings();
    } else if (Platform.isIOS || Platform.isMacOS) {
      locationSettings = AppleSettings();
    } else {
      locationSettings = const LocationSettings();
    }

    final position = await Geolocator.getCurrentPosition(
      locationSettings: locationSettings,
    );

    // Mock(偽装)かどうかチェック
    if (position.isMocked) {
      switch (flavor) {
        case Flavor.prd:
          throw Exception('Location is mocked');
        case Flavor.stg:
        case Flavor.dev:
          final deviceInfo = DeviceInfoPlugin();
          if (Platform.isIOS) {
            final iosInfo = await deviceInfo.iosInfo;
            if (iosInfo.isPhysicalDevice) {
              throw Exception('Location is mocked');
            }
          } else if (Platform.isAndroid) {
            final androidInfo = await deviceInfo.androidInfo;
            if (androidInfo.isPhysicalDevice) {
              throw Exception('Location is mocked');
            }
          }
      }
    }

    final currentLocation = LatLng(position.latitude, position.longitude);
    debugPrint('Current Location: $currentLocation');

    return currentLocation;
  } on Exception catch (error) {
    debugPrint('Error: $error');
    rethrow;
  }
}

---

## 🔧 ツール
*2025/2/4 16:36:06*

\*\*Pinpointing the problem\*\*

I’m examining potential causes, like the map not loading or the native channel being lost, which might explain the error during camera animation.

\*\*Weighing the possibilities\*\*

Considering the impact of the app running in the background or the map context being unmounted when the "animateCamera" function is invoked.

\*\*Identifying potential issues\*\*

I’m piecing together that the user might invoke "animateCamera" while the app is in the background or the map context is unmounted, possibly causing channel errors.

\*\*Handling platform channel connections\*\*

Considering the app may go to the background with "openLocationSettings()", risking the map's re-initialization. Careful handling is required. Alternatively, "animateCamera" might be called without a ready map.

---

## 🤖 アシスタント
*2025/2/4 16:36:06*

iOS の Google Maps は、\*\*「ネイティブのマップチャネルが有効でないタイミングで `animateCamera` が呼ばれる」\*\* と `PlatformException(channel-error, Unable to establish connection...)` が発生しがちです。  
とくに現在のコードだと、`onTapNearMe` 内で

1. `Geolocator` が位置情報設定ダイアログ（システムの設定画面）を開く  
2. その間に Flutter アプリがバックグラウンド状態（または “中断” 状態）になる  
3. ユーザーが設定画面を閉じて復帰すると、ネイティブチャネルが張り直される前 or ウィジェットが dispose 済みのタイミングで `animateCamera` が走る  

といった流れで、\*\*チャネルが切れた状態で `animateCamera` が呼ばれる\*\* 可能性が高いです。

---

## 原因になりやすいケース

1. \*\*設定画面を開いたあと、アプリに戻るまでにタイムラグがある\*\*  
   - `Geolocator.openLocationSettings()` により、アプリはフォアグラウンドから離れます。  
   - 設定から戻ってくるとアプリは再度フォアグラウンドに復帰しますが、地図ウィジェットが再描画される／iOS ネイティブチャネルが再確立される前に `animateCamera` してしまうとエラーになることがあります。

2. \*\*ウィジェットが dispose されたり、新たに作られたりして `googleMapController` が無効化された\*\*  
   - 例えば「位置情報許可ダイアログの結果を受け取るまでに、ユーザーが別画面に遷移してしまった」などで、Map ウィジェット自体が破棄されている状態。

3. \*\*`onMapCreated` が完了していない or 復帰後にまだ再初期化が完了していない\*\*  
   - `googleMapControllerState.value` が `null` の段階、あるいは iOS 側のネイティブマップが再生成途上で `animateCamera` を呼ぶと失敗します。

---

## 対処方法・確認ポイント

1. \*\*MapController が有効かを必ずチェックする\*\*  
   - `onMapCreated` で受け取った `controller` をステートに保存する際、`null` ではないことを確認。  
   - `await Geolocator.openLocationSettings()` でシステム画面を開く処理の後で `animateCamera` するときは、  
     - 復帰後にまだコントローラが有効か (`if (googleMapControllerState.value != null)`)  
     - ウィジェットが `mounted` か (`if (!context.mounted) return;`)  
     を確認してから呼ぶようにする。

2. \*\*バックグラウンドからの復帰タイミングをハンドリングする\*\*  
   - アプリが `resumed` になる際に `onMapCreated` 相当の再初期化や、再描画完了を待ってから `animateCamera` を呼び出すようにする。  
   - 何らかの `Future.delayed(...)` で少し待機し、ネイティブチャネルが再確立されるのを待ってからカメラ操作を行う方法もあります。

3. \*\*設定画面を開いたあとに自動で `animateCamera` を走らせない\*\*  
   - 位置情報が有効になったかどうか確認してから、改めて「現在地を取得」→「カメラを移動」のフローをユーザー主導で実行するほうが安全です。  
   - 「設定後に戻ってきた瞬間に即 `animateCamera`」だと、ネイティブ側がまだ初期化中の場合があるため。

---

### まとめ

- `onTapNearMe` で `Geolocator.openLocationSettings()` → `設定に飛んだあとに戻る` → `animateCamera` の流れが、ネイティブマップチャネル未接続の状態で呼ばれているのが原因と推測されます。  
- \*\*アプリがバックグラウンドに移る／復帰する\*\*、または \*\*ウィジェットが破棄される／再生成される\*\* 際のライフサイクル管理が不十分だと起こりがちなので、  
  - `if (context.mounted && googleMapControllerState.value != null) { ... }` のようにガードを挟む  
  - 復帰処理や設定反映のあとに少し待ってから `animateCamera` する  
などを意識してみてください。

---

## 👤 ユーザー
*2025/2/4 16:36:51*

どうもopenLocationSettingsにはいっていないんだ、。普通に許可している時でも発生する。

---

## 🔧 ツール
*2025/2/4 16:37:13*

\*\*Analyzing the error\*\*

I’m piecing together the issue: `openLocationSettings` isn't affected, but other errors persist. The `animateCamera` call might lead to channel failure or a background update, possibly compounded by user interaction or permission dialogs.

\*\*Analyzing system dialogs\*\*

I'm thinking through how iOS triggers a system dialog for permission, possibly breaking the channel. Even with granted permissions, the error might stem from specific `getCurrentPosition` settings or known iOS issues.

\*\*Examining issues\*\*

I’m mapping out concurrency or race conditions where `onTapNearMe` fires too soon, `animateCamera` is called on unready or destroyed widgets, or the map context changes abruptly.

\*\*Adjusting my approach\*\*

I’m suggesting small delays post `getCurrentLocation`, ensuring the widget is mounted for `setState`, and accounting for iOS ephemeral interruptions or partial re-renders/hot reloads.

\*\*Tracing possible faults\*\*

OK, let's figure these out: `animateCamera` might be called too early, the map's out of scope, app reconfiguration disrupts things, `onTapNearMe` triggers multiple requests, or an iOS permission prompt jumps in.

---

## 🤖 アシスタント
*2025/2/4 16:37:13*

実はこのエラーは「位置設定画面に遷移する・しない」に限らず、「iOS 側の Google Maps ネイティブチャネルが無効になっているタイミングで `animateCamera` が呼ばれる」場合に起こるものです。  
ユーザーが `openLocationSettings()` に飛んでいない場合でも、**何かしらのタイミングでネイティブマップが無効化 or 再初期化中**になっている可能性があります。  

以下に、設定画面に遷移しなくても起きやすいケースや確認すべきポイントをまとめます。

---

## 1. 「iOS の位置情報許可ダイアログ」表示時のアプリライフサイクル

初回起動などで位置情報許可ダイアログが OS 側で表示された場合、フルスクリーンのモーダル（システムダイアログ）扱いでアプリが一時 “中断” 状態になるケースがあります。  
その結果、「ダイアログを閉じてアプリに戻るまでに、ネイティブマップが再初期化中 → そこへ `animateCamera`」が走り、`PlatformException(channel-error...)` が出る場合があります。

- **対策**: ダイアログを閉じてアプリに復帰してから、少し待機して（または `onMapCreated` が再呼び出しされたあとに）`animateCamera` を呼ぶようにする。  
  - 具体的には
    ```dart
    // iOSダイアログ→許可されたあと戻ってきたタイミング
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      // googleMapControllerState.value が null じゃないか、widgetがmountedかなどをチェック
      if (!mounted || googleMapControllerState.value == null) return;
      await googleMapControllerState.value!.animateCamera(...);
    });
    ```
    のように、**必ずウィジェットが `mounted` かと MapController が null でないこと**を確認してから呼び出してください。

---

## 2. ホットリロード（Hot Reload / Hot Restart）によるチャネル切断

開発中にホットリロードやホットリスタートをすると、一時的にネイティブとのバインディングがリセットされます。  
その直後に `animateCamera` を呼ぶと「まだ接続完了していない → channel-error」が起こり得ます。

- **対策**:  
  - ホットリロード直後で再描画が完了していないときは、`onMapCreated` などでコントローラを受け取ってから動かすようにします。
  - 開発中だけ発生し、本番ビルドでは問題が出ないことも多いので、まずは「実機ビルドや TestFlight ビルドで再現するか」を確かめると切り分けになることがあります。

---

## 3. ウィジェット（MapPage）が `dispose` されたあとに呼ばれている

ユーザーが画面を切り替えている最中に非同期処理が走って、**マップがもう破棄されているのに `animateCamera`** が呼ばれると同様のエラーが出ます。  
とくに `async` 関数内で位置情報を取得 → 返ってきたらすぐカメラ操作、というフローで、画面遷移や pop を挟むとこうなりがちです。

- **対策**: 位置取得完了後や `onTapNearMe` ボタンタップ後などで  
  ```dart
  if (!mounted) return;
  if (googleMapControllerState.value == null) return;
  ```
  のようなガードを入れて、**「そもそもまだ（あるいはもう）マップが存在していないならカメラを動かさない」** ようにします。

---

## 4. 単に「iOS のネイティブマップがまだ初期化完了前」の可能性

`onMapCreated` でコントローラを受け取る前に `animateCamera` を呼んでしまうと、ネイティブチャネルが作られていないためこの例外になることがあります。  
また、同じように、別のライフサイクル（アプリが一瞬サスペンドした等）後にマップの再初期化が走っている最中にコールされる場合もあり得ます。

- **対策**:  
  - `onMapCreated: (controller) => googleMapControllerState.value = controller;` のようにちゃんとステートに入れ、`controller` が null でないことをチェックしてから `animateCamera`。
  - iOS では表示直後など、内部的にローディングが走っている場合があるので、どうしてもエラーが出るなら少し遅延 (`Future.delayed(...)`) を挟む方法もあります。

---

### まとめ

- **この `PlatformException(channel-error, Unable to establish connection...)` は、文字通り「ネイティブのマップチャネルがまだ（あるいはもう）有効でない」状態で `animateCamera` が呼ばれるときに起こる。**  
- 位置情報ダイアログを OS がフルスクリーンモーダルで出したり、ホットリロード／ライフサイクル切り替えでマップが再初期化されているタイミングで呼んだりしていると非常に起きやすいです。  
- **対策としては「ウィジェットがまだ `mounted` で、`googleMapControllerState.value` が `null` ではないか」を都度チェックする**、あるいは**復帰直後に少し遅延してからカメラ操作する**、といったライフサイクル管理が鍵になります。  

基本的には「アプリやウィジェットがちゃんとマップを保持している状態か」をしっかりガードしたうえで `animateCamera` などのカメラ操作を呼び出す、という方針でエラーを回避できます。

---
