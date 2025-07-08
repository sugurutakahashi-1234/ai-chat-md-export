# GoogleMap レイアウト修正

日付: 2024-12-12

---

## 👤 ユーザー
*2024/12/12 16:45:34*

GoogleMap のところでラーになっているらしい

例外が発生しました
FlutterError (RenderConstrainedBox object was given an infinite size during layout.
This probably means that it is a render object that tries to be as big as possible, but it was put inside another render object that allows its children to pick their own size.
The nearest ancestor providing an unbounded width constraint is: RenderFlex#b23f7 relayoutBoundary=up2 NEEDS-LAYOUT NEEDS-PAINT NEEDS-COMPOSITING-BITS-UPDATE:
  creator: Row ← Positioned ← Stack ← KeyedSubtree-[GlobalKey#f9d12] ← _BodyBuilder ← MediaQuery ← LayoutId-[&lt;_ScaffoldSlot.body&gt;] ← CustomMultiChildLayout ← _ActionsScope ← Actions ← AnimatedBuilder ← DefaultTextStyle ← ⋯
  parentData: right=16.0; bottom=16.0; left=16.0; offset=Offset(0.0, 0.0) (can use size)
  constraints: BoxConstraints(w=361.0, 0.0&lt;=h&lt;=Infinity)
  size: MISSING
  direction: horizontal
  mainAxisAlignment: spaceBetween
  mainAxisSize: max
  crossAxisAlignment: center
  textDirection: ltr
  verticalDirection: down
The nearest ancestor providing an unbounded height constraint is: RenderStack#0ab06 relayoutBoundary=up1 NEEDS-LAYOUT NEEDS-PAINT NEEDS-COMPOSITING-BITS-UPDATE:
  creator: Stack ← KeyedSubtree-[GlobalKey#f9d12] ← _BodyBuilder ← MediaQuery ← LayoutId-[&lt;_ScaffoldSlot.body&gt;] ← CustomMultiChildLayout ← _ActionsScope ← Actions ← AnimatedBuilder ← DefaultTextStyle ← AnimatedDefaultTextStyle ← _InkFeatures-[GlobalKey#b6c31 ink renderer] ← ⋯
  parentData: offset=Offset(0.0, 0.0); id=_ScaffoldSlot.body (can use size)
  constraints: BoxConstraints(0.0&lt;=w&lt;=393.0, 0.0&lt;=h&lt;=645.0)
  size: Size(393.0, 645.0)
  alignment: AlignmentDirectional.topStart
  textDirection: ltr
  fit: loose
The constraints that applied to the RenderConstrainedBox were:
  BoxConstraints(unconstrained)
The exact size it was given was:
  Size(Infinity, Infinity)
See https://flutter.dev/to/unbounded-constraints for more information.)



import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:snpit_guild_app/domain/screen.dart';
import 'package:snpit_guild_app/presentation/pages/explorer_list_page.dart';

class MapPage extends HookConsumerWidget {
  const MapPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      body: Stack(
        children: [
          Center(
            child: ElevatedButton(
              onPressed: () {
                context.push(Screen.shooting.path);
              },
              child: const Icon(Icons.camera_alt),
            ),
          ),
          Positioned(
            bottom: 16,
            left: 16,
            right: 16,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const GoogleMap(
                  initialCameraPosition: CameraPosition(
                    target: LatLng(45.521563, -122.677433),
                    zoom: 11,
                  ),
                ),
                ElevatedButton(
                  onPressed: () {
                    debugPrint('TODO: My Location');
                  },
                  child: const Icon(Icons.my_location),
                ),
                ElevatedButton(
                  onPressed: () {
                    // TODO: この画面から showModalBottomSheet すると
                    // タブバーの上から表示されてしまうので、タブバーの下から表示するように修正する
                    showModalBottomSheet&lt;void&gt;(
                      context: context,
                      isScrollControlled: true,
                      shape: const RoundedRectangleBorder(
                        borderRadius:
                            BorderRadius.vertical(top: Radius.circular(16)),
                      ),
                      builder: (context) {
                        return SizedBox(
                          height: MediaQuery.of(context).size.height * 0.5,
                          child: const ExplorerListPage(),
                        );
                      },
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                    padding: const EdgeInsets.symmetric(
                      horizontal: 24,
                      vertical: 12,
                    ),
                  ),
                  child: const Row(
                    children: [
                      Icon(Icons.explore),
                      SizedBox(width: 8),
                      Text('Explore'),
                    ],
                  ),
                ),
                ElevatedButton(
                  onPressed: () {
                    context.push(Screen.spotList.path);
                  },
                  child: const Icon(Icons.photo),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

---

## 🤖 アシスタント
*2024/12/12 16:46:00*

このコードの問題は、`GoogleMap`ウィジェットが`Row`内に配置されており、`Row`が子要素に無限の幅または高さの制約を与えていることです。`GoogleMap`は制約のない状態では正しくレイアウトできず、例外が発生します。

以下のようにコードを修正すると、この問題を解決できます。

### 修正版

```dart
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:snpit_guild_app/domain/screen.dart';
import 'package:snpit_guild_app/presentation/pages/explorer_list_page.dart';

class MapPage extends HookConsumerWidget {
  const MapPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      body: Stack(
        children: [
          const GoogleMap(
            initialCameraPosition: CameraPosition(
              target: LatLng(45.521563, -122.677433),
              zoom: 11,
            ),
          ),
          Center(
            child: ElevatedButton(
              onPressed: () {
                context.push(Screen.shooting.path);
              },
              child: const Icon(Icons.camera_alt),
            ),
          ),
          Positioned(
            bottom: 16,
            left: 16,
            right: 16,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                ElevatedButton(
                  onPressed: () {
                    debugPrint('TODO: My Location');
                  },
                  child: const Icon(Icons.my_location),
                ),
                ElevatedButton(
                  onPressed: () {
                    // TODO: この画面から showModalBottomSheet すると
                    // タブバーの上から表示されてしまうので、タブバーの下から表示するように修正する
                    showModalBottomSheet<void>(
                      context: context,
                      isScrollControlled: true,
                      shape: const RoundedRectangleBorder(
                        borderRadius:
                            BorderRadius.vertical(top: Radius.circular(16)),
                      ),
                      builder: (context) {
                        return SizedBox(
                          height: MediaQuery.of(context).size.height * 0.5,
                          child: const ExplorerListPage(),
                        );
                      },
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                    padding: const EdgeInsets.symmetric(
                      horizontal: 24,
                      vertical: 12,
                    ),
                  ),
                  child: const Row(
                    children: [
                      Icon(Icons.explore),
                      SizedBox(width: 8),
                      Text('Explore'),
                    ],
                  ),
                ),
                ElevatedButton(
                  onPressed: () {
                    context.push(Screen.spotList.path);
                  },
                  child: const Icon(Icons.photo),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
```

### 修正点の概要

1. **`GoogleMap`を`Row`から取り出す**  
   - `GoogleMap`は`Row`内に置かれていると無制限の制約を受けて例外が発生するため、`Stack`の最下層に移動しました。

2. **`GoogleMap`に制約を明示的に与えない**  
   - `Stack`内に直接配置すると、親の制約に従い問題なくレンダリングされます。

これで例外が発生しなくなるはずです。必要に応じて他の部分も調整してください。

---
