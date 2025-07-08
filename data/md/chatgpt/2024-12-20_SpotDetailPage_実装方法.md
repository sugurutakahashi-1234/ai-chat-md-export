# SpotDetailPage 実装方法

Date: 2024-12-20

---

## 👤 User
*2024-12-20 14:19:15*

{
  "content_type": "image_asset_pointer",
  "asset_pointer": "file-service://file-VUqSD4JQFSLqDTErYkqAfJ",
  "size_bytes": 160325,
  "width": 347,
  "height": 539,
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
import 'package:flutter/material.dart';

class SpotDetailPage extends StatelessWidget {
  const SpotDetailPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('SpotDetailPage'),
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
      body: const Center(child: Text('SpotDetailPage')),
    );
  }
}

画像は以下を使って欲しい。

imageUrlは UriExtensions.randomImageUrl.toString()で取得できる。
Image.network(
                      imageUrl,
                      fit: BoxFit.cover,
                      width: double.infinity,
                      height: double.infinity,
                      loadingBuilder: (context, child, loadingProgress) {
                        if (loadingProgress == null) {
                          return child;
                        }
                        // TODO: なぜかローディングが表示されない
                        return const Center(
                          child: CircularProgressIndicator(),
                        );
                      },
                      errorBuilder: (context, error, stackTrace) {
                        debugPrint('Image loading error: $error');
                        return const Center(
                          child: Icon(Icons.error, color: Colors.red),
                        );
                      },
                    ),

Hooksやリバーポッドは導入済みだと思って欲しい。

---

## 🤖 Assistant
*2024-12-20 14:19:31*

以下のコードは、提供されたデザインに基づいて `SpotDetailPage` を実装するサンプルです。この例では `Flutter Hooks` と `Riverpod` を使用しています。また、指定された画像ローディングロジックを含めています。

```dart
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

// ランダム画像 URL を生成する仮の拡張メソッド
extension UriExtensions on Uri {
  static String get randomImageUrl => 'https://picsum.photos/400/300';
}

class SpotDetailPage extends HookConsumerWidget {
  const SpotDetailPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final imageUrl = useState(UriExtensions.randomImageUrl);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Detail'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
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
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // 画像表示エリア
          Expanded(
            flex: 3,
            child: Stack(
              fit: StackFit.expand,
              children: [
                Image.network(
                  imageUrl.value,
                  fit: BoxFit.cover,
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
                      child: Icon(Icons.error, color: Colors.red),
                    );
                  },
                ),
                Positioned(
                  bottom: 16,
                  right: 16,
                  child: Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: Colors.black54,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      'Difficulty level: D',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          // 詳細情報エリア
          Expanded(
            flex: 1,
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Text(
                        'Difficulty level',
                        style: TextStyle(fontSize: 16),
                      ),
                      const Spacer(),
                      CircleAvatar(
                        backgroundColor: Colors.grey.shade300,
                        child: const Text(
                          'D',
                          style: TextStyle(fontSize: 16, color: Colors.black),
                        ),
                      ),
                    ],
                  ),
                  const Divider(),
                  GestureDetector(
                    onTap: () {
                      // ギルド詳細ページへの遷移などをここに実装
                      debugPrint('Navigate to Guild Detail');
                    },
                    child: Row(
                      children: [
                        const Text(
                          'Holder',
                          style: TextStyle(fontSize: 16),
                        ),
                        const Spacer(),
                        Row(
                          children: const [
                            Text(
                              'Your Guild',
                              style: TextStyle(
                                fontSize: 16,
                                color: Colors.blue,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Icon(Icons.arrow_forward_ios, size: 16),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
```

### 実装のポイント
1. **画像ローディング**:
   - 指定されたローディングロジック (`CircularProgressIndicator`) とエラーハンドリング (`Icon(Icons.error)`) を利用。
2. **RiverpodとHooksの使用**:
   - `useState` を使って、画像 URL を動的に管理。
3. **UI設計**:
   - 画像エリアと詳細エリアを `Expanded` で分割。
   - デザインに基づいてレイアウトを構築。
4. **インタラクション**:
   - ギルド詳細への遷移を可能にする `GestureDetector` を追加。

もしさらなるカスタマイズや機能追加が必要であればお知らせください！

---

## 👤 User
*2024-12-20 14:22:46*

GestureDetector は使わなくていいよ。
Divider は使って欲しくない。Listをうまくつかってレイアウトして欲しい。

import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:snpit_guild_app/utils/extensions/uri_extensions.dart';

class SpotDetailPage extends HookConsumerWidget {
  const SpotDetailPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final imageUrl = useState(UriExtensions.randomImageUrl).toString();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Detail'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
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
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // 画像表示エリア
          Expanded(
            flex: 3,
            child: Stack(
              fit: StackFit.expand,
              children: [
                Image.network(
                  imageUrl,
                  fit: BoxFit.cover,
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
                      child: Icon(Icons.error, color: Colors.red),
                    );
                  },
                ),
                Positioned(
                  bottom: 16,
                  right: 16,
                  child: Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: Colors.black54,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Text(
                      'Difficulty level: D',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          // 詳細情報エリア
          Expanded(
            flex: 1,
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Text(
                        'Difficulty level',
                        style: TextStyle(fontSize: 16),
                      ),
                      const Spacer(),
                      CircleAvatar(
                        backgroundColor: Colors.grey.shade300,
                        child: const Text(
                          'D',
                          style: TextStyle(fontSize: 16, color: Colors.black),
                        ),
                      ),
                    ],
                  ),
                  const Divider(),
                  GestureDetector(
                    onTap: () {
                      // ギルド詳細ページへの遷移などをここに実装
                      debugPrint('Navigate to Guild Detail');
                    },
                    child: Row(
                      children: [
                        const Text(
                          'Holder',
                          style: TextStyle(fontSize: 16),
                        ),
                        const Spacer(),
                        Row(
                          children: const [
                            Text(
                              'Your Guild',
                              style: TextStyle(
                                fontSize: 16,
                                color: Colors.blue,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Icon(Icons.arrow_forward_ios, size: 16),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

---

## 🤖 Assistant
*2024-12-20 14:23:01*

以下は修正後のコードです。`GestureDetector` を削除し、`Divider` を使わずに `ListView` を使用してレイアウトを作成しました。

```dart
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:snpit_guild_app/utils/extensions/uri_extensions.dart';

class SpotDetailPage extends HookConsumerWidget {
  const SpotDetailPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final imageUrl = useState(UriExtensions.randomImageUrl);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Detail'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
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
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // 画像表示エリア
          Expanded(
            flex: 3,
            child: Stack(
              fit: StackFit.expand,
              children: [
                Image.network(
                  imageUrl.value,
                  fit: BoxFit.cover,
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
                      child: Icon(Icons.error, color: Colors.red),
                    );
                  },
                ),
                Positioned(
                  bottom: 16,
                  right: 16,
                  child: Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: Colors.black54,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Text(
                      'Difficulty level: D',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          // 詳細情報エリア
          Expanded(
            flex: 1,
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  title: const Text(
                    'Difficulty level',
                    style: TextStyle(fontSize: 16),
                  ),
                  trailing: CircleAvatar(
                    backgroundColor: Colors.grey.shade300,
                    child: const Text(
                      'D',
                      style: TextStyle(fontSize: 16, color: Colors.black),
                    ),
                  ),
                ),
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  title: const Text(
                    'Holder',
                    style: TextStyle(fontSize: 16),
                  ),
                  trailing: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: const [
                      Text(
                        'Your Guild',
                        style: TextStyle(
                          fontSize: 16,
                          color: Colors.blue,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Icon(Icons.arrow_forward_ios, size: 16),
                    ],
                  ),
                  onTap: () {
                    // ギルド詳細ページへの遷移などをここに実装
                    debugPrint('Navigate to Guild Detail');
                  },
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

### 修正ポイント
1. **`GestureDetector` の削除**:
   - `ListTile` の `onTap` を利用してインタラクションを実装。

---
