# ShowOurSpotDetail実装

日付: 2024-12-20

---

## 👤 ユーザー
*2024/12/20 15:59:40*

ShowOurSpotDetailを同じように作って欲しい

import 'package:riverpod\_annotation/riverpod\_annotation.dart';

part 'show\_explorer\_list.g.dart';

@riverpod
class ShowExplorerListNotifier extends \_$ShowExplorerListNotifier {
  @override
  bool build() =&gt; false;

  void show() =&gt; state = true;
  void hide() =&gt; state = false;
}

---

## 🤖 アシスタント
*2024/12/20 15:59:48*

以下は、`ShowOurSpotDetailNotifier` を `ShowExplorerListNotifier` と同様に作成したコード例です。

---

## 🤖 アシスタント
*2024/12/20 15:59:48*

{"name": "show\_our\_spot\_detail", "type": "code/dart", "content": "import 'package:riverpod\_annotation/riverpod\_annotation.dart';\\n\\npart 'show\_our\_spot\_detail.g.dart';\\n\\n@riverpod\\nclass ShowOurSpotDetailNotifier extends \_$ShowOurSpotDetailNotifier {\\n  @override\\n  bool build() =&gt; false;\\n\\n  void show() =&gt; state = true;\\n  void hide() =&gt; state = false;\\n}"}

---

## 🔧 ツール
*2024/12/20 15:59:48*

{"result": "Successfully created text document 'show\_our\_spot\_detail' which will be referenced in all future messages with the unique identifier textdoc\_id: '676515e246488191a0ae9e97e6c825d4'", "textdoc\_id": "676515e246488191a0ae9e97e6c825d4", "name": "show\_our\_spot\_detail"}

---

## 🤖 アシスタント
*2024/12/20 15:59:48*

このコードは、`ShowExplorerListNotifier` と同様の構造で `ShowOurSpotDetailNotifier` を実装しています。このクラスも `state` を `true` または `false` に切り替える簡単な通知モデルです。必要に応じてさらなる機能を追加できます。

---
