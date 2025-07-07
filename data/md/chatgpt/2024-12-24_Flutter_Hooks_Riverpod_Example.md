# Flutter Hooks Riverpod Example

日付: 2024-12-24

---

## 👤 ユーザー
*2024/12/24 15:04:26*

hooksとリバーポッドを使って欲しい

import 'package:flutter/material.dart';

class WalletPage extends StatelessWidget {
  const WalletPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('WalletPage')),
      body: const Center(child: Text('WalletPage')),
    );
  }
}

---

## 🤖 アシスタント
*2024/12/24 15:04:37*

以下は、`flutter_hooks` と `riverpod` を使ったリファクタリング例です。`WalletPage` を `HookConsumerWidget` に変更し、プロバイダーの例を追加しています。

### リファクタリングコード

```dart
import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

/// プロバイダーの定義
final balanceProvider = StateProvider<int>((ref) => 0);

class WalletPage extends HookConsumerWidget {
  const WalletPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final balance = ref.watch(balanceProvider); // バランスの状態を監視
    final balanceNotifier = ref.read(balanceProvider.notifier); // 更新用

    return Scaffold(
      appBar: AppBar(title: const Text('WalletPage')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('Current Balance: $balance',
                style: const TextStyle(fontSize: 20)),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                balanceNotifier.state += 10; // バランスを10増やす
              },
              child: const Text('Add 10'),
            ),
            const SizedBox(height: 10),
            ElevatedButton(
              onPressed: () {
                balanceNotifier.state -= 10; // バランスを10減らす
              },
              child: const Text('Subtract 10'),
            ),
          ],
        ),
      ),
    );
  }
}
```

### 主な変更点
1. **`HookConsumerWidget`の利用**
   - 状態管理をシンプルにするために、`HookConsumerWidget` をベースクラスとして採用しました。
   
2. **Riverpodの利用**
   - `balanceProvider` を定義して、状態を管理。
   - `StateProvider` を使って簡単なカウンター機能を実装。

3. **状態の監視と更新**
   - `ref.watch()` を利用して状態を監視。
   - `ref.read()` を利用して状態を更新。

### 実行結果
- バランスが画面中央に表示され、ボタンで増減できます。
- `Hooks` と `Riverpod` のシンプルな使い方が含まれています。

必要に応じて、`balanceProvider` を外部ファイルに分割してスケーラブルな設計にすることも可能です！

---
