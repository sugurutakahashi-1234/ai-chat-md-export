# Flutter URL Extension

日付: 2024-12-13

---

## 👤 ユーザー
*2024/12/13 15:35:26*

Flutter でこのような URL の extension を定義したい。


import Foundation

extension URL {
    public static var random: URL {
        .randomImageUrl
    }

    public static var randomImageUrl: URL {
        let width: String = "\(Int.random(in: 200...640))"
        let height: String = "\(Int.random(in: 200...640))"
        return URL(string: "https://picsum.photos/\(width)/\(height)")!
    }

    public static func randomImageUrl(title: String) -&gt; URL {
        let width: String = "\(Int.random(in: 1...16))00"
        let height: String = "\(Int.random(in: 1...16))00"
        return URL(string: "https://placehold.jp/444444/FFFFFF/\(width)x\(height).jpg?text=\(title)")!
    }

    public static var placeholderImageUrl: URL {
        URL(string: "https://placehold.jp/444444/FFFFFF/160x90.jpg")!
    }

    public static func placeholderImageUrl(title: String) -&gt; URL {
        URL(string: "https://placehold.jp/444444/FFFFFF/160x90.jpg?text=\(title)")!
    }
}

---

## 🤖 アシスタント
*2024/12/13 15:35:41*

Flutter で同様の URL の extension を定義するには、Dart の `Uri` クラスを拡張する形で実装できます。以下のコードは、Flutter/Dart での実装例です：

```dart
import 'dart:math';

extension RandomImageUrl on Uri {
  // ランダムな画像のURL
  static Uri get random {
    return randomImageUrl;
  }

  static Uri get randomImageUrl {
    final width = Random().nextInt(441) + 200; // 200～640の範囲
    final height = Random().nextInt(441) + 200; // 200～640の範囲
    return Uri.parse("https://picsum.photos/$width/$height");
  }

  static Uri randomImageUrlWithTitle(String title) {
    final width = (Random().nextInt(16) + 1) * 100; // 100～1600の範囲
    final height = (Random().nextInt(16) + 1) * 100; // 100～1600の範囲
    return Uri.parse(
        "https://placehold.jp/444444/FFFFFF/${width}x${height}.jpg?text=${Uri.encodeComponent(title)}");
  }

  static Uri get placeholderImageUrl {
    return Uri.parse("https://placehold.jp/444444/FFFFFF/160x90.jpg");
  }

  static Uri placeholderImageUrlWithTitle(String title) {
    return Uri.parse(
        "https://placehold.jp/444444/FFFFFF/160x90.jpg?text=${Uri.encodeComponent(title)}");
  }
}
```

### 使用例
以下のように使用できます。

```dart
void main() {
  print(Uri.random); // ランダムなサイズの画像URL
  print(Uri.randomImageUrlWithTitle("Hello")); // タイトル付きランダム画像
  print(Uri.placeholderImageUrl); // 固定サイズのプレースホルダー画像
  print(Uri.placeholderImageUrlWithTitle("Sample")); // タイトル付きプレースホルダー画像
}
```

### 説明
- `Uri.parse` を使用して文字列を `Uri` オブジェクトに変換。
- `Random` クラスを用いてランダムな数値を生成。
- `Uri.encodeComponent` を使って URL エンコード処理を実施。
- Dart の拡張メソッドで静的メソッドを追加。

これで Flutter プロジェクトでも簡単にランダム画像やプレースホルダー画像 URL を生成できます！

---

## 👤 ユーザー
*2024/12/13 15:39:54*

{
  "content_type": "image_asset_pointer",
  "asset_pointer": "file-service://file-9W3m2gpaeZoYM7hex3PHek",
  "size_bytes": 477841,
  "width": 569,
  "height": 908,
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
添付した画像のような 画像のListを表示したい。
画像はurlからネットワークから取ってくるようにしてほしい
その際に先ほどの randomImageUrl を使って欲しい

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:snpit_guild_app/domain/screen.dart';

class SpotListPage extends StatelessWidget {
  const SpotListPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: const Text('SpotListPage'),
        actions: [
          IconButton(
            icon: const Icon(Icons.close),
            onPressed: () {
              Navigator.of(context, rootNavigator: true).pop(); // ボトムシート全体を閉じる
            },
          ),
        ],
      ),
      body: ListView.builder(
        itemCount: 10,
        itemBuilder: (context, index) {
          return ListTile(
            title: Text('Spot $index'),
            onTap: () {
              context.push(Screen.spotDetail.path);
            },
          );
        },
      ),
    );
  }
}

---

## 🤖 アシスタント
*2024/12/13 15:40:21*

以下のようにコードを更新して、画像のリストを表示し、画像をネットワークから取得するようにします。また、先ほどの `randomImageUrl` を使用してランダムな画像 URL を生成します。

### 完成コード例

```dart
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class SpotListPage extends StatelessWidget {
  const SpotListPage({super.key});

  // ランダムな画像のURLを生成する関数
  Uri randomImageUrl() {
    final width = Random().nextInt(441) + 200; // 200〜640の範囲
    final height = Random().nextInt(441) + 200; // 200〜640の範囲
    return Uri.parse("https://picsum.photos/$width/$height");
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: const Text('Spot list'),
        actions: [
          IconButton(
            icon: const Icon(Icons.close),
            onPressed: () {
              Navigator.of(context, rootNavigator: true).pop(); // ボトムシート全体を閉じる
            },
          ),
        ],
      ),
      body: GridView.builder(
        padding: const EdgeInsets.all(16),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 3, // 3列
          crossAxisSpacing: 8,
          mainAxisSpacing: 8,
        ),
        itemCount: 12, // 表示するスポット数
        itemBuilder: (context, index) {
          final imageUrl = randomImageUrl(); // ランダムな画像URLを取得
          return GestureDetector(
            onTap: () {
              context.push('/spotDetail'); // 詳細画面に遷移
            },
            child: Stack(
              alignment: Alignment.bottomCenter,
              children: [
                // 画像
                ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: Image.network(
                    imageUrl.toString(),
                    fit: BoxFit.cover,
                    width: double.infinity,
                    height: double.infinity,
                    loadingBuilder: (context, child, loadingProgress) {
                      if (loadingProgress == null) {
                        return child;
                      }
                      return const Center(
                        child: CircularProgressIndicator(), // 読み込み中のインジケーター
                      );
                    },
                    errorBuilder: (context, error, stackTrace) {
                      return const Center(
                        child: Icon(Icons.error, color: Colors.red),
                      );
                    },
                  ),
                ),
                // ラベル (例: ランダムな文字)
                Positioned(
                  bottom: 8,
                  child: Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.black.withOpacity(0.5),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      'Spot ${String.fromCharCode(65 + index)}', // ラベル A, B, C...
                      style: const TextStyle(color: Colors.white, fontSize: 12),
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
```

### 変更点
1. **GridViewの使用**:
   - `GridView.builder` を使用して 3 列のグリッド表示を作成しました。
   - 各画像に一定の余白を設けています。

2. **画像の読み込み**:
   - `Image.network` を使用して画像をネットワークから表示します。
   - 読み込み中には `CircularProgressIndicator` を表示し、エラー時にはエラーメッセージを表示。

3. **ラベルの追加**:
   - ランダムなスポット名（例: "Spot A", "Spot B"...）を下部に表示します。
   - 黒い背景と白いテキストで見やすくしています。

4. **タップ可能**:
   - 各画像がタップ可能で、タップすると `/spotDetail` に遷移します。

これで、画像リストが画像付きのグリッド形式で表示され、ネットワークからランダム画像を取得できます！

---

## 👤 ユーザー
*2024/12/13 15:40:56*

Uri randomImageUrl() { ja

---

## 🤖 アシスタント
*2024/12/13 15:40:59*

以下は、Flutter/Dart で `randomImageUrl` を定義する例です。この関数はランダムな画像 URL を生成します。

```dart
import 'dart:math';

Uri randomImageUrl() {
  final width = Random().nextInt(441) + 200; // 200〜640の範囲
  final height = Random().nextInt(441) + 200; // 200〜640の範

---
