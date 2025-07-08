# Show Spot Detail Sheet

日付: 2024-12-20

---

## 👤 ユーザー
*2024/12/20 16:02:39*

以下を_showOurSpotDetailSheetとしてほしい。

void _showSpotListSheet(BuildContext context, WidgetRef ref) {
    // sheet が立ち上がるタイミングで最初の画面にリセットしないと、sheet を表示したときに前回閉じた画面が表示される
    spotListRouter.go(Screen.spotList.path);

    showModalBottomSheet&lt;void&gt;(
      context: context,
      isScrollControlled: true,
      builder: (context) {
        return FractionallySizedBox(
          heightFactor: 0.7,
          child: ClipRRect(
            borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
            child: MaterialApp.router(
              theme: appTheme,
              routerConfig: spotListRouter,
              debugShowCheckedModeBanner: false,
            ),
          ),
        );
      },
    ).then((_) {
      ref.read(showSpotListNotifierProvider.notifier).hide();
    });
  }

---

## 🤖 アシスタント
*2024/12/20 16:02:51*

以下は、`_showSpotListSheet` を `_showOurSpotDetailSheet` として変更したコードです。`spotListRouter` や `Screen.spotList.path` を適切な名前やパスに置き換える必要がある場合は、それに応じて修正してください。

```dart
void _showOurSpotDetailSheet(BuildContext context, WidgetRef ref) {
  // sheet が立ち上がるタイミングで最初の画面にリセットしないと、sheet を表示したときに前回閉じた画面が表示される
  spotDetailRouter.go(Screen.spotDetail.path);

  showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    builder: (context) {
      return FractionallySizedBox(
        heightFactor: 0.7,
        child: ClipRRect(
          borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
          child: MaterialApp.router(
            theme: appTheme,
            routerConfig: spotDetailRouter,
            debugShowCheckedModeBanner: false,
          ),
        ),
      );
    },
  ).then((_) {
    ref.read(showSpotDetailNotifierProvider.notifier).hide();
  });
}
```

変更点は以下の通りです：
1. 関数名を `_showOurSpotDetailSheet` に変更。
2. `spotListRouter` を `spotDetailRouter` に変更。
3. `Screen.spotList.path` を `Screen.spotDetail.path` に変更。
4. `showSpotListNotifierProvider` を `showSpotDetailNotifierProvider` に変更。

このコードを使用する際は、`spotDetailRouter` や関連するパス・プロバイダーが適切に定義されていることを確認してください。

---
