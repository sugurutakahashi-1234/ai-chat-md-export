# GoogleMap 中央表示方法

日付: 2025-02-05

---

## 👤 ユーザー
*2025/2/6 1:01:41*

GoogleMapのウィジェットが画面の中央真ん中から広がる様に描画されて欲しい。

StackをCenterにしているが他にやった方がいいことはあるのか？
  import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
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
import 'package:snpit\_guild\_app/presentation/providers/flavor\_provider.dart';
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
import 'package:snpit\_guild\_app/utils/location\_utils.dart';
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
    final flavor = ref.watch(flavorProvider);
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
        waitToRender: const Duration(milliseconds: 10),
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
        waitToRender: const Duration(milliseconds: 10),
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
        final currentLocation = await getCurrentLocation(flavor: flavor);

        if (googleMapControllerState.value == null) {
          return;
        }

        await googleMapControllerState.value?.animateCamera(
          CameraUpdate.newLatLng(currentLocation),
        );
      } on PlatformException catch (error) {
        // ハンドリング不能のためスルー
        debugPrint('Error: $error');
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

    Future&lt;void&gt; startExploring(OnExploringState exploringState) async {
      try {
        final currentLocation = await getCurrentLocation(flavor: flavor);

        // range は km 単位なので、メートルに換算（×1000）
        final explorerRangeKm = exploringState.explorer?.range ?? 0;
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
      } on PlatformException catch (error) {
        // ハンドリング不能のためスルー
        debugPrint('Error: $error');
      } on Exception catch (error) {
        if (context.mounted) {
          showErrorSnackBar(context, error);
        }
      }
    }

    Future&lt;void&gt; endExploring() async {
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
          await startExploring(next);
        } else {
          await endExploring();
        }
      });

    return Scaffold(
      body: currentLocationAsyncValue.when(
        data: (currentLocation) {
          return Center(
            child: Stack(
              children: \[
                GoogleMap(
                  initialCameraPosition: CameraPosition(
                    target: currentLocation,
                    zoom: 16,
                  ),
                  onMapCreated: (controller) {
                    if (context.mounted) {
                      googleMapControllerState.value = controller;
                    }
                  },
                  markers: markersState.value,
                  circles: circlesState.value,
                  myLocationEnabled: true,
                  myLocationButtonEnabled: false,
                  zoomControlsEnabled: false,
                  mapToolbarEnabled: false,
                  rotateGesturesEnabled: false,
                  compassEnabled: false,
                ),

                // ローディングはわずらわしいので、コメントアウト
                // if (isLoadingState.value)
                //   const Center(child: CircularProgressIndicator()),

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
                                                  padding:
                                                      const EdgeInsets.all(2),
                                                  child: ClipRRect(
                                                    borderRadius:
                                                        BorderRadius.circular(
                                                      4,
                                                    ),
                                                    child: SquareImage(
                                                      imageUrl:
                                                          displaySpotList\[i\]
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
          );
        },
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
*2025/2/6 1:02:52*

\*\*Googleマップの展開\*\*

GoogleMapウィジェットを画面の中央から広げる構造になっている。StackのCenterを使用しているが、全体のウィジェットを中央に配置する可能性がある。

\*\*画面の有効活用\*\*

GoogleMapを画面全体に拡大するには、Centerウィジェットを削除し対応する。中央から広げたい場合、Stackのalignmentプロパティを設定するか、ContainerやAlignウィジェットを使用して中央に配置する。

\*\*画面の活用\*\*

GoogleMapを画面全体に広げるには、Centerを外してStackを使い、Positioned.fillを設定する。通常はフルスクリーン表示が好ましい。

\*\*解決策を探る\*\*

GoogleMapを画面全体に広げるには、Centerを外してStackを使い、Positioned.fillを設定するのが標準的な方法ですね。

---

## 🤖 アシスタント
*2025/2/6 1:02:52*

まず前提として、`GoogleMap` はほとんどの場合、画面全体に対して「ピンチ・スワイプなどの操作」を行うためのウィジェットであり、フルスクリーンで使われることが多いです。  
今回「画面の中央真ん中から広がる様に描画されて欲しい」という意図にもよりますが、多くの場合は “画面全体をカバーしつつ中央を中心とした拡大・縮小” の挙動になるはずなので、以下のポイントを確認してみてください。

---

## 1. 不要な `Center` を取り除く（または `Stack` に `alignment: Alignment.center` を設定する）

もし “画面いっぱいのマップ” が欲しい場合は、`Scaffold` の `body` に直接 `Stack` を置き、そのなかに `Positioned.fill` などでマップを配置する方が一般的です。  
質問のコードでは、下記のように

```dart
Center(
  child: Stack(
    children: [
      GoogleMap(...),
      Positioned(...)
    ],
  ),
);
```

と書かれていますが、これだと `Stack` が「`Center` によってサイズが必要以上に制限」される場合があります。  
もし “フルスクリーンで `GoogleMap` を使いたい” のであれば、**`Center` を外して** 下記のように書くほうがベターです。

```dart
return Scaffold(
  body: Stack(
    // alignment: Alignment.center, // 必要なら
    children: [
      Positioned.fill(
        child: GoogleMap(
          // ...
        ),
      ),
      // ボタンやPositionedウィジェットなどを重ねる
      Positioned(
        bottom: 16,
        left: 16,
        right: 16,
        child: ...
      ),
    ],
  ),
);
```

### Stack の `alignment` を利用する場合

もし何らかの理由で「マップを画面中央に固定した大きさで表示したい」ケース（フルスクリーンでなく、あえて小さめに表示）ならば、`Stack` に `alignment: Alignment.center` を指定し、その中に `SizedBox` または `ConstrainedBox` 経由で大きさを決める、というパターンを取ります。

```dart
return Scaffold(
  body: Stack(
    alignment: Alignment.center,
    children: [
      // マップ自体のサイズを自分で決める
      SizedBox(
        width: 300,
        height: 300,
        child: GoogleMap(...),
      ),
      // 上に重ねるUIたち
      Positioned(...),
    ],
  ),
);
```

このようにすると、マップが「中央に固定された大きさ」で表示されます。

---

## 2. `StackFit.expand` / `Positioned.fill` の活用

「画面全体にフィットさせたいけど、`Center` ウィジェットは要らない」という場合、`Stack` の `fit` プロパティに `StackFit.expand` を指定するか、マップを `Positioned.fill` で包むのが定番です。

```dart
return Scaffold(
  body: Stack(
    fit: StackFit.expand,
    children: [
      GoogleMap(...),
      Positioned(
        bottom: 16,
        left: 16,
        right: 16,
        child: ...
      ),
    ],
  ),
);
```

あるいは

```dart
return Scaffold(
  body: Stack(
    children: [
      Positioned.fill(
        child: GoogleMap(...),
      ),
      Positioned(
        bottom: 16,
        left: 16,
        right: 16,
        child: ...
      ),
    ],
  ),
);
```

いずれの書き方でも “マップが画面いっぱいに表示される” という結果は同じになります。  
あとは好みやプロジェクトのコーディング規約でどちらを選ぶか決めてください。

---

## 3. そもそも “中央から広がる” 挙動はアニメーションをつけない限り見えない

「本当にアニメーションで中央から拡大されるように見せたい」という場合は、`AnimatedContainer` や `ScaleTransition` などを使って「マップが拡大されるアニメーション」を実装する必要があります。  

単に

> StackをCenterにしているが他にやった方がいいことはあるのか？

というレイアウト上の質問であれば、上記で述べたように **`Stack` に直接 `GoogleMap` を配置** してレイアウトしましょう、という答えになります。

---

## まとめ

- **フルスクリーンでマップを敷き詰めたい** → `Center` は外して `Stack` に直接 `GoogleMap` を配置し、`Positioned.fill` か `StackFit.expand` を使う。  
- **画面中央に小さくマップを置きたい** → `Stack` に `alignment: Alignment.center` をつけるか、`Center` ウィジェットでも良いのでサイズを決めた `SizedBox` などを使う。  
- **本当にアニメーションで“中央から拡大”させたい** → `ScaleTransition` / `AnimatedContainer` / `AnimatedSize` などを組み合わせる。

上記のポイントを踏まえると、通常は **「`Center` ウィジェットは不要」** であり、以下のようにするのがおすすめです。

```dart
@override
Widget build(BuildContext context, WidgetRef ref) {
  return Scaffold(
    body: Stack(
      children: [
        Positioned.fill(
          child: GoogleMap(
            initialCameraPosition: ...,
            // などなど
          ),
        ),
        // ボタンなど、マップの上に重ねたいUIは Positioned で配置
        Positioned(
          bottom: 16,
          left: 16,
          right: 16,
          child: ...
        ),
      ],
    ),
  );
}
```

以上を調整することで、意図したレイアウトにより近づけることができます。

---
