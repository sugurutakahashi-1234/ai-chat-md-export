# Bottom Buttons追加方法

Date: 2024-12-13

---

## 👤 User
*2024-12-13 16:43:59*

{
  "content_type": "image_asset_pointer",
  "asset_pointer": "file-service://file-UY9VT32vvqqiyGC1P4h9vB",
  "size_bytes": 284664,
  "width": 442,
  "height": 905,
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
色は気にせずにとりあえず、ScaffoldのBottomにボタンを2つ追加してほしい

import 'package:flutter/material.dart';

class SnapConfirmPage extends StatelessWidget {
  const SnapConfirmPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('SnapConfirmPage')),
      body: const Center(child: Text('SnapConfirmPage')),
    );
  }
}

---

## 🤖 Assistant
*2024-12-13 16:44:08*

以下のコードは、Scaffoldのボトムにボタンを2つ追加した例です。色にはこだわらず、単純にボタンを配置しています。

```dart
import 'package:flutter/material.dart';

class SnapConfirmPage extends StatelessWidget {
  const SnapConfirmPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('SnapConfirmPage')),
      body: const Center(child: Text('SnapConfirmPage')),
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          children: [
            Expanded(
              child: ElevatedButton(
                onPressed: () {
                  // キャンセルボタンの処理
                  Navigator.pop(context);
                },
                child: const Text('Cancel'),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: ElevatedButton(
                onPressed: () {
                  // 確定ボタンの処理
                  // ここに必要なロジックを追加してください
                },
                child: const Text('Got it'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
```

### 主なポイント:
1. **`bottomNavigationBar`**: Scaffoldのプロパティを使ってボタンを画面下部に固定。
2. **`Row`と`Expanded`**: ボタンを横並びにし、均等にスペースを割り当て。
3. **`Padding`と`SizedBox`**: ボタンの間隔や周囲の余白を調整。

これで、画面下部に「Cancel」と「Got it」の2つのボタンが表示されるはずです。

---

## 👤 User
*2024-12-13 16:44:43*

セーフエリアを考慮して欲しい

---

## 🤖 Assistant
*2024-12-13 16:44:55*

セーフエリアを考慮してボトムにボタンを配置するには、`SafeArea`ウィジェットを追加することで解決できます。以下のコードはその実装例です：

```dart
import 'package:flutter/material.dart';

class SnapConfirmPage extends StatelessWidget {
  const SnapConfirmPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('SnapConfirmPage')),
      body: const Center(child: Text('SnapConfirmPage')),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Row(
            children: [
              Expanded(
                child: ElevatedButton(
                  onPressed: () {
                    // キャンセルボタンの処理
                    Navigator.pop(context);
                  },
                  child: const Text('Cancel'),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: ElevatedButton(
                  onPressed: () {
                    // 確定ボタンの処理
                  },
                  child: const Text('Got it'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

### 主な変更点:
1. **`SafeArea`**: `bottomNavigationBar`内を`SafeArea`でラップすることで、セーフエリア（例えばiPhoneのホームバー部分）を考慮。
2. **`Padding`**: ボタンの周囲に余白を確保するために追加。

これで、セーフエリア内にボタンが正しく配置され、ホームバーやその他のシステムUI要素と重ならないようになります。

---

## 👤 User
*2024-12-13 16:45:34*

Text('Got it') の処理は2回一気にpopして欲しい

---

## 🤖 Assistant
*2024-12-13 16:45:44*

`Got it` ボタンを押したときに2回連続で `Navigator.pop` を呼び出すことで、スタックから2つの画面をポップできます。以下はその処理を追加したコードです：

```dart
import 'package:flutter/material.dart';

class SnapConfirmPage extends StatelessWidget {
  const SnapConfirmPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('SnapConfirmPage')),
      body: const Center(child: Text('SnapConfirmPage')),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Row(
            children: [
              Expanded(
                child: ElevatedButton(
                  onPressed: () {
                    // キャンセルボタンの処理
                    Navigator.pop(context);
                  },
                  child: const Text('Cancel'),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: ElevatedButton(
                  onPressed: () {
                    // Got itボタンの処理: 2画面分pop
                    Navigator.pop(context);
                    Navigator.pop(context);
                  },
                  child: const Text('Got it'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

### `Navigator.pop` を2回呼び出す理由
- 1回目の `Navigator.pop(context)` は現在の画面をポップします。
- 2回目の `Navigator.pop(context)` は1つ前の画面をポップします。

これにより、`Got it` ボタンを押すと画面スタックから2画面分が削除されます。画面スタックを2回以上ポップする必要がある場合、この実装がシンプルで適しています。

---
