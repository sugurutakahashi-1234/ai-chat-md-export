# CarouselSlider レイアウト修正

Date: 2025-01-08

---

## 👤 User
*2025-01-08 18:01:03*

import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:snpit_guild_app/infrastructure/snapit_guild_api/snapit_guild_api.openapi.dart';
import 'package:snpit_guild_app/presentation/design_token/color_token.dart';
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
          side: const BorderSide(color: ColorToken.secondary),
        ),
        color: ColorToken.bg,
        elevation: 4,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: imageUrl != null
                        ? Image.network(
                            imageUrl,
                            height: 120,
                            width: 120,
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) {
                              return const Icon(
                                Icons.broken_image_outlined,
                                size: 120,
                                color: ColorToken.text,
                              );
                            },
                          )
                        : const Icon(
                            Icons.hide_image_outlined,
                            size: 120,
                            color: ColorToken.text,
                          ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Life',
                          style: TextStyle(
                            fontSize: 14,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Expanded(
                          child: LinearProgressIndicator(
                            value: (explorer.energy ?? 0) / 100,
                            color: ColorToken.primary,
                            backgroundColor: ColorToken.bg,
                            borderRadius: BorderRadius.circular(2),
                          ),
                        ),
                        const SizedBox(height: 12),
                        const Text(
                          'Search range',
                          style: TextStyle(
                            fontSize: 14,
                            color: ColorToken.border,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '${explorer.range ?? 0}km radius',
                          style: const TextStyle(
                            fontSize: 14,
                          ),
                        ),
                        const SizedBox(height: 12),
                        Text(
                          explorer.explorerDescription ?? 'No description',
                          style: const TextStyle(
                            fontSize: 12,
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
              Expanded(
                child: CarouselSlider(
                  options: CarouselOptions(),
                  items: (explorers ?? []).map(buildExplorerCard).toList(),
                ),
              ),
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
            child: const Text('Start explore'),
          ),
        ),
      ),
    );
  }
}

以下のエラーになった


════════ Exception caught by rendering library ═════════════════════════════════
The following assertion was thrown during performLayout():
RenderFlex children have non-zero flex but incoming height constraints are unbounded.
When a column is in a parent that does not provide a finite height constraint, for example if it is in a vertical scrollable, it will try to shrink-wrap its children along the vertical axis. Setting a flex on a child (e.g. using Expanded) indicates that the child is to expand to fill the remaining space in the vertical direction.
These two directives are mutually exclusive. If a parent is to shrink-wrap its child, the child cannot simultaneously expand to fit its parent.
Consider setting mainAxisSize to MainAxisSize.min and using FlexFit.loose fits for the flexible children (using Flexible rather than Expanded). This will allow the flexible children to size themselves to less than the infinite remaining space they would otherwise be forced to take, and then will cause the RenderFlex to shrink-wrap the children rather than expanding to fit the maximum constraints provided by the parent.
If this message did not help you determine the problem, consider using debugDumpRenderTree():
  https://flutter.dev/to/debug-render-layer
  https://api.flutter.dev/flutter/rendering/debugDumpRenderTree.html
The affected RenderFlex is: RenderFlex#bd693 relayoutBoundary=up12 NEEDS-LAYOUT NEEDS-PAINT NEEDS-COMPOSITING-BITS-UPDATE
    parentData: offset=Offset(0.0, 0.0); flex=1; fit=FlexFit.tight (can use size)

---

## 🤖 Assistant
*2025-01-08 18:01:15*

このエラーは、`RenderFlex`（FlutterでColumnやRowなどのFlexウィジェットが生成するもの）が高さの制約がない場合に発生します。`Expanded`や`Flexible`を使用する場合、親ウィジェットに有限の高さ制約が必要ですが、現在のコードではこれが満たされていないためエラーが発生しています。

`CarouselSlider`内で`buildExplorerCard`が返すウィジェットで、`Column`内に`Expanded`を使っているため、問題が発生しています。

### 解決方法

1. **`Expanded`を`Flexible`に変更し、`fit: FlexFit.loose`を指定**
   `Expanded`を`Flexible`に変更して、明示的に制約を緩和します。

```dart
Flexible(
  fit: FlexFit.loose,
  child: LinearProgressIndicator(
    value: (explorer.energy ?? 0) / 100,
    color: ColorToken.primary,
    backgroundColor: ColorToken.bg,
    borderRadius: BorderRadius.circular(2),
  ),
),
```

2. **親Columnに`mainAxisSize: MainAxisSize.min`を追加**
   `Column`がその子ウィジェットのサイズに合わせて縮小するように設定します。

```dart
Column(
  mainAxisSize: MainAxisSize.min, // 追加
  crossAxisAlignment: CrossAxisAlignment.start,
  children: [
    // 子ウィジェットたち
  ],
),
```

3. **`CarouselSlider`の高さを明示的に指定**
   `CarouselSlider`はその高さを明示的に持つ必要があります。`height`を設定します。

```dart
CarouselSlider(
  options: CarouselOptions(
    height: 400, // 明示的な高さを指定
  ),
  items: (explorers ?? []).map(buildExplorerCard).toList(),
),
```

4. **`buildExplorerCard`のウィジェットの高さを指定**
   カードの高さを固定または制約を持つように調整します。

```dart
Card(
  shape: RoundedRectangleBorder(
    borderRadius: BorderRadius.circular(16),
    side: const BorderSide(color: ColorToken.secondary),
  ),
  color: ColorToken.bg,
  elevation: 4,
  child: SizedBox(
    height: 200, // 必要な高さを指定
    child: Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 子ウィジェットたち
        ],
      ),
    ),
  ),
),
```

これらの変更を適用することで、エラーが解消されるはずです。`CarouselSlider`や`Card`のレイアウトの高さ制約を正しく設定することが重要です。

---
