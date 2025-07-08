# Go_routerでpopUntil実現

日付: 2024-12-17

---

## 👤 ユーザー
*2024/12/17 21:56:15*

Navigator を使わずにgo_routerで書けないかな？

                    Navigator.of(context).popUntil(
                      (route) =&gt;
                          route.settings.name ==
                          Screen.shootableSpotDetail.path,
                    );

---

## 🤖 アシスタント
*2024/12/17 21:56:35*

`go_router` を使用して `Navigator` の代わりに `popUntil` の動作を実現するには、`go_router` の `pop()` と `canPop()` を活用しつつ、画面の条件を確認する形で書けます。

### 方法
`popUntil` と似た動作をする `pop` を `while` ループで繰り返し、`route` の条件が一致するまで戻ります。

以下のコードで実現できます。

### 実装例
```dart
import 'package:go_router/go_router.dart';

void popUntilShootableSpotDetail(BuildContext context) {
  while (context.canPop()) {
    final currentRoute = GoRouter.of(context).routeInformationProvider.value.uri.path;

    // 目的の画面に到達したらループを終了
    if (currentRoute == Screen.shootableSpotDetail.path) {
      break;
    }

    // 次の画面へ戻る
    context.pop();
  }
}
```

### 解説
1. **`context.canPop()`**  
   まだ前の画面に戻れる場合は `true` を返します。これをループの条件に使用します。

2. **`GoRouter.of(context).routeInformationProvider.value.uri.path`**  
   現在の `path` を取得して、目的の画面 (`shootableSpotDetail`) と比較します。

3. **`context.pop()`**  
   `go_router` では `Navigator.pop()` の代わりに `context.pop()` を使用します。

---

### 使用方法
画面遷移の中で `popUntil` に該当する処理を実行する場合、次のように呼び出します。

```dart
popUntilShootableSpotDetail(context);
```

これで `Navigator` を直接使用せず、`go_router` の機能のみを使って `popUntil` と同等の動作を実現できます！

---
