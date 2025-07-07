# Replace List with State

日付: 2025-01-08

---

## 👤 ユーザー
*2025/1/8 15:47:22*

final cards = List.generateを消してexplorerStateを使ってほしい。

@freezed
class ExplorerDTO with \_$ExplorerDTO {
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
  }) = \_ExplorerDTO;

  factory ExplorerDTO.fromJson(Map&lt;String, dynamic&gt; jsonMap) =&gt;
      \_$ExplorerDTOFromJson(jsonMap);
}

import 'package:carousel\_slider/carousel\_slider.dart';
import 'package:flutter/material.dart';
import 'package:flutter\_hooks/flutter\_hooks.dart';
import 'package:hooks\_riverpod/hooks\_riverpod.dart';
import 'package:snpit\_guild\_app/presentation/providers/api\_client/explorers/get\_explorer\_info.dart';

class ExplorerListPage extends HookConsumerWidget {
  const ExplorerListPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final explorerState = ref.watch(getExplorerNotifierProvider);

    useEffect(
      () {
        WidgetsBinding.instance.addPostFrameCallback((\_) {
          ref.read(getExplorerNotifierProvider.notifier).executeRequest();
        });
        return null;
      },
      \[\],
    );

    // 仮データ（削除してexplorerStateに置き換えたい）
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
        actions: \[
          IconButton(
            onPressed: () =&gt; Navigator.pop(context),
            icon: const Icon(Icons.close),
            tooltip: 'Close',
          ),
        \],
      ),
      body: Column(
        children: \[
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
        \],
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

## 🤖 アシスタント
*2025/1/8 15:47:44*

To replace the `List.generate` logic with `explorerState`, you can dynamically generate the carousel items based on the data fetched from the `getExplorerNotifierProvider`. Below is the updated implementation: 

### Updated Code

```dart
import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
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
              style: Theme.of(context).textTheme.subtitle1,
            ),
            const SizedBox(height: 4),
            Text(
              explorer.explorerDescription ?? 'No description available',
              style: Theme.of(context).textTheme.bodyText2,
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
            onPressed: () => Navigator.pop(context),
            icon: const Icon(Icons.close),
            tooltip: 'Close',
          ),
        ],
      ),
      body: explorerState.when(
        data: (explorers) {
          if (explorers.isEmpty) {
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
                  items: explorers.map(buildExplorerCard).toList(),
                ),
              ),
              const SizedBox(height: 16),
            ],
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, _) => Center(child: Text('Error: $error')),
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
```

### Changes Made
1. **Replace `cards`**:
   - Removed the `List.generate` method and replaced it with a mapping of `explorerState` data to build `Card` widgets dynamically.
   - Added a `buildExplorerCard` helper method for better readability and to encapsulate card construction logic.

2. **Handle API State**:
   - Used the `when` method on `explorerState` to handle `data`, `loading`, and `error` states properly.
   - Showed a loading spinner during the API call and an error message if the API call fails.

3. **Dynamic Content**:
   - Populated the `CarouselSlider` with items from `explorerState.data` by mapping `ExplorerDTO` objects to card widgets.

4. **Infinite Scroll Disabled**:
   - Configured `CarouselOptions` to disable infinite scroll for better user experience.

### Notes
- Ensure that `explorerState` provides a list of `ExplorerDTO` objects correctly.
- Update image URLs and fallback logic as needed to handle invalid or null data gracefully.

---

## 👤 ユーザー
*2025/1/8 15:49:24*

The method 'map' can't be unconditionally invoked because the receiver can be 'null'.
Try making the call conditional (using '?.') or adding a null check to the target ('!').dartunchecked\_use\_of\_nullable\_value

items: explorers.map(buildExplorerCard).toList(),

---

## 🤖 アシスタント
*2025/1/8 15:49:29*

To handle the nullable nature of the `explorers` list, you should ensure it is non-null before mapping its contents. You can achieve this by using a null-aware operator (`?.`) and providing an empty list as a fallback if `explorers` is `null`.

Here's the corrected code snippet for your case:

### Updated Snippet

```dart
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
```

### Explanation
- **Null-Aware Operator (`??`)**:
  - If `explorers` is `null`, the fallback value `[]` (an empty list) is used to avoid a runtime error.
  
- **Ensures Safe Mapping**:
  - This approach guarantees that `.map()` is called only on a valid, non-null list.

This will resolve the error while ensuring the app remains robust against null data.

---

## 👤 ユーザー
*2025/1/8 15:50:05*

if (explorers.isEmpty) {

The property 'isEmpty' can't be unconditionally accessed because the receiver can be 'null'.
Try making the access conditional (using '?.') or adding a null check to the target ('!').dartunchecked\_use\_of\_nullable\_valueThe property 'isEmpty' can't be unconditionally accessed because the receiver can be 'null'.
Try making the access conditional (using '?.') or adding a null check to the target ('!').dartunchecked\_use\_of\_nullable\_value

---

## 🤖 アシスタント
*2025/1/8 15:50:16*

To address the nullable `explorers` issue when checking `isEmpty`, you can use a null-aware operator (`??`) to provide a fallback value. Here's how you can handle it safely:

### Updated Code

Replace:

```dart
if (explorers.isEmpty) {
```

With:

```dart
if ((explorers ?? []).isEmpty) {
```

### Explanation:
- **Null-Coalescing Operator (`??`)**:
  - If `explorers` is `null`, the fallback value `[]` (an empty list) is used.
  - This ensures that the `isEmpty` property is accessed only on a valid, non-null list.

### Full Example

Here's how it fits in your `explorerState` handling:

```dart
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
  loading: () => const Center(child: CircularProgressIndicator()),
  error: (error, _) => Center(child: Text('Error: $error')),
),
```

### Notes:
- The fallback value (`[]`) ensures the code won't break even if `explorers` is `null`.
- This keeps your app resilient against unexpected `null` states.

---
