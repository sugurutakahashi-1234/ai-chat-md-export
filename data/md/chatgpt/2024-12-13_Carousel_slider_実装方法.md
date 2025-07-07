# Carousel_slider 実装方法

日付: 2024-12-13

---

## 👤 ユーザー
*2024/12/13 14:34:21*

{
  "content\_type": "image\_asset\_pointer",
  "asset\_pointer": "file-service://file-Q1qR1pQHcpAAhGaDrMVzYE",
  "size\_bytes": 68130,
  "width": 486,
  "height": 465,
  "fovea": null,
  "metadata": {
    "dalle": null,
    "gizmo": null,
    "generation": null,
    "container\_pixel\_height": null,
    "container\_pixel\_width": null,
    "emu\_omit\_glimpse\_image": null,
    "emu\_patches\_override": null,
    "sanitized": true,
    "asset\_pointer\_link": null,
    "watermarked\_asset\_pointer": null
  }
}
{
  "content\_type": "image\_asset\_pointer",
  "asset\_pointer": "file-service://file-PNrWQMN2s5gq3pgPhxmhvb",
  "size\_bytes": 71716,
  "width": 424,
  "height": 463,
  "fovea": null,
  "metadata": {
    "dalle": null,
    "gizmo": null,
    "generation": null,
    "container\_pixel\_height": null,
    "container\_pixel\_width": null,
    "emu\_omit\_glimpse\_image": null,
    "emu\_patches\_override": null,
    "sanitized": true,
    "asset\_pointer\_link": null,
    "watermarked\_asset\_pointer": null
  }
}
1枚目の写真のような実装にしたい。
今は2枚目の写真のような実装になっているんだ。
中のコンポーネントは横スクロール可能なんだ。
できることなら carousel\_slider をつかいたい。

---

## 🤖 アシスタント
*2024/12/13 14:34:24*

1枚目のようなデザインを実現するために、`carousel_slider`を使って実装する方法を説明します。このようなUIは、`carousel_slider`を活用し、Flutterのカスタムスタイリングを追加することで実現できます。

以下の手順で実装してみましょう：

---

### 1. 必要なパッケージをインストール
`carousel_slider`を使うため、`pubspec.yaml`に以下を追加します：

```yaml

---

## 👤 ユーザー
*2024/12/13 14:34:48*

現状のコードはこれです。

import 'package:flutter/material.dart';
import 'package:go\_router/go\_router.dart';
import 'package:snpit\_guild\_app/domain/screen.dart';

class SpotListPage extends StatelessWidget {
  const SpotListPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: const Text('SpotListPage'),
        actions: \[
          IconButton(
            icon: const Icon(Icons.close),
            onPressed: () {
              Navigator.of(context, rootNavigator: true).pop(); // ボトムシート全体を閉じる
            },
          ),
        \],
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
*2024/12/13 14:35:13*

現状のコードはリストビューを使用しており、2枚目のスクリーンに近い実装です。1枚目のようなデザインを作るには、`carousel_slider`を導入して横スクロール可能なスライダーを組み込みます。また、ボトムシート内で横スクロール可能なスライダーと「Start Explore」のようなボタンを追加する必要があります。

以下のコードで実装を調整してみましょう。

---

### 修正版のコード

```dart
import 'package:carousel_slider/carousel_slider.dart';
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
        title: const Text('Select Explorer'),
        actions: [
          IconButton(
            icon: const Icon(Icons.close),
            onPressed: () {
              Navigator.of(context, rootNavigator: true).pop(); // ボトムシート全体を閉じる
            },
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: CarouselSlider(
              options: CarouselOptions(
                height: 200.0,
                enableInfiniteScroll: true,
                enlargeCenterPage: true,
                viewportFraction: 0.8,
                aspectRatio: 16 / 9,
              ),
              items: List.generate(10, (index) {
                return Builder(
                  builder: (BuildContext context) {
                    return Container(
                      margin: const EdgeInsets.symmetric(horizontal: 8.0),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(16.0),
                        color: Colors.grey.shade200,
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.2),
                            blurRadius: 4,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.explore, size: 50, color: Colors.blue),
                          const SizedBox(height: 8),
                          Text(
                            'Explorer $index',
                            style: const TextStyle(
                                fontWeight: FontWeight.bold, fontSize: 16),
                          ),
                          const SizedBox(height: 4),
                          Text('Search range: ${10 * (index + 1)}km'),
                          const SizedBox(height: 4),
                          const Text(
                            'Explorer utility',
                            style: TextStyle(color: Colors.grey),
                          ),
                        ],
                      ),
                    );
                  },
                );
              }),
            ),
          ),
          const SizedBox(height: 16),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                minimumSize: const Size(double.infinity, 50),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
              ),
              onPressed: () {
                // ボタンを押したときの処理
                context.push(Screen.spotDetail.path);
              },
              child: const Text('Start explore'),
            ),
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}
```

---

### コードのポイント

1. **`CarouselSlider`の利用**:
   - 横スクロール可能なカードのリストを表示するために`carousel_slider`を使用。
   - `viewportFraction`を0.8にして隣接するカードを少し見せるデザインに。

2. **スライダーのアイテム**:
   - 各アイテムには`Icon`や`Text`を配置し、カード風のスタイルを適用。
   - `BoxDecoration`で背景色や影を設定して、1枚目の画像に近いデザインを実現。

3. **ボタンの配置**:
   - ボトムにフル幅のボタンを追加。
   - `ElevatedButton`をカスタマイズして、角丸スタイルを適用。

4. **モジュール性**:
   - カードのスタイルやデザインは調整しやすいように柔軟に定義。

---

### 実装後のスクリーンイメージ
- ボトムシートにスライダー形式の選択画面と「Start explore」ボタンが表示されます。
- スライダーは横スクロール可能で、隣接するカードが見える状態を維持します。

この実装で、1枚目のデザインに近いUIが完成します！

---
