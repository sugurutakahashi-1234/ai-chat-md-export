# OnCreatedGuildNotifier 実装

日付: 2024-12-23

---

## 👤 ユーザー
*2024/12/23 22:00:00*

on_created_guild を作って欲しい

import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'on_pop_snap_confirm.g.dart';

// pop で画面を戻った際にもカメラを通知するためのフラグ
@riverpod
class OnPopSnapConfirmNotifier extends _$OnPopSnapConfirmNotifier {
  @override
  bool build() =&gt; state = false;

  void trigger() =&gt; state = true;
  void reset() =&gt; state = false;
}

---

## 🤖 アシスタント
*2024/12/23 22:00:12*

`on_created_guild` の作成は、現在の `on_pop_snap_confirm` に似たパターンで作成できます。以下は、Riverpodの `OnCreatedGuildNotifier` を定義する例です。

このクラスは、`on_created_guild` のフラグを管理し、トリガーやリセットを行うものです。

### 実装例

```dart
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'on_created_guild.g.dart';

// ギルドが作成された際に通知するためのフラグ
@riverpod
class OnCreatedGuildNotifier extends _$OnCreatedGuildNotifier {
  @override
  bool build() => state = false;

  void trigger() => state = true; // ギルド作成時にフラグを有効化
  void reset() => state = false;  // フラグをリセット
}
```

### 解説
1. **目的**
   - ギルドが作成された際に他の部分に通知するフラグを管理。
   - 状態の変更 (`trigger` と `reset`) を容易に操作可能。

2. **メソッド**
   - `build`: 初期状態を `false` に設定。
   - `trigger`: フラグを `true` に設定して通知。
   - `reset`: フラグを `false` に戻してリセット。

3. **生成されるファイル**
   - このコードをビルドすると、自動生成されたファイル `on_created_guild.g.dart` が作成されます。

### 注意
このクラスを利用する際は、以下のようにプロバイダーを使用できます。

```dart
final onCreatedGuildProvider = OnCreatedGuildNotifierProvider();

void someFunction() {
  final notifier = ref.read(onCreatedGuildProvider.notifier);
  notifier.trigger(); // ギルド作成を通知
  notifier.reset();   // 通知をリセット
}
```

---
