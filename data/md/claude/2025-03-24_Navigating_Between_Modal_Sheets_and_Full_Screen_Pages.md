# Navigating Between Modal Sheets and Full-Screen Pages

日付: 2025-03-24

---

## 👤 ユーザー
*2025/3/24 22:13:04*

もしかして、ShootingPageとWeaveSpotPageの遷移はtabPageからもともとのルーターのpush遷移させるようにすれば、shootableSpotDetailRouterからはShootingPageとWeaveSpotPageの記述は削除できるのかな

---

## 👤 ユーザー
*2025/3/24 22:07:36*

ShootableSpotDetailPage と AttackerListPage は

void showShootableSpotDetailSheet(String spotId) {
      // sheet が立ち上がるタイミングで最初の画面にリセットしないと、sheet を表示したときに前回閉じた画面が表示される
      shootableSpotDetailRouter.go(
        Screen.shootableSpotDetail.path,
        extra: spotId,
      );

      showModalBottomSheet&lt;void&gt;(
        context: context,
        isScrollControlled: true,
        builder: (context) {
          return FractionallySizedBox(
            heightFactor: 0.7,
            child: ClipRRect(
              borderRadius: const BorderRadius.vertical(
                top: Radius.circular(16),
              ),
              // child: ShootableSpotDetailPage(spotId: spotId),
              child: MaterialApp.router(
                debugShowCheckedModeBanner: false,
                // Design
                theme: appTheme,
                // router
                routerConfig: shootableSpotDetailRouter,
                // slang
                locale: currentLocale.flutterLocale,
                supportedLocales: AppLocaleUtils.supportedLocales,
                localizationsDelegates: GlobalMaterialLocalizations.delegates,
              ),
            ),
          );
        },
      ).then((_) {
        ref.read(showShootableSpotDetailNotifierProvider.notifier).hide();
      });
    }

でshowModalBottomSheetで遷移させたいが、ShootingPage と　WeaveSpotPage は 全画面で遷移させたい。どうすればいいか？

final shootableSpotDetailRouter = GoRouter(
  initialLocation: Screen.shootableSpotDetail.path,
  routes: [
    GoRoute(
      path: Screen.shootableSpotDetail.path,
      builder: (context, state) {
        final spotId = state.extra as String? ?? '';
        return ShootableSpotDetailPage(spotId: spotId);
      },
    ),
    GoRoute(
      path: Screen.attackerList.path,
      builder: (context, state) =&gt; const AttackerListPage(),
    ),
    GoRoute(
      path: Screen.shooting.path,
      builder: (context, state) =&gt; const ShootingPage(),
    ),
    GoRoute(
      path: Screen.weaveSpot.path,
      builder: (context, state) =&gt; const WeaveSpotPage(),
    ),
  ],
);

---

## 🤖 アシスタント
*2025/3/24 22:08:01*

I see you're trying to implement a navigation flow where `ShootableSpotDetailPage` and `AttackerListPage` should appear in a modal bottom sheet, while `ShootingPage` and `WeaveSpotPage` should navigate as full-screen pages. Here's how you can modify your approach to achieve this.

The main issue is that you're using a single router for both modal sheet navigation and full-screen navigation. Let's separate the concerns by modifying your code:

```dart
// First, let's create a function to determine if a route should be shown in full screen
bool isFullScreenRoute(String path) {
  return path == Screen.shooting.path || path == Screen.weaveSpot.path;
}

void showShootableSpotDetailSheet(String spotId) {
  // Reset to initial route
  shootableSpotDetailRouter.go(
    Screen.shootableSpotDetail.path,
    extra: spotId,
  );

  showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    builder: (context) {
      return FractionallySizedBox(
        heightFactor: 0.7,
        child: ClipRRect(
          borderRadius: const BorderRadius.vertical(
            top: Radius.circular(16),
          ),
          child: MaterialApp.router(
            debugShowCheckedModeBanner: false,
            theme: appTheme,
            routerConfig: shootableSpotDetailRouter,
            locale: currentLocale.flutterLocale,
            supportedLocales: AppLocaleUtils.supportedLocales,
            localizationsDelegates: GlobalMaterialLocalizations.delegates,
            // Add a navigator observer to handle full-screen navigation
            builder: (context, child) {
              return Navigator(
                onGenerateRoute: (settings) {
                  // Handle navigation here
                  return MaterialPageRoute(
                    builder: (context) => child!,
                  );
                },
              );
            },
          ),
        ),
      );
    },
  ).then((_) {
    ref.read(showShootableSpotDetailNotifierProvider.notifier).hide();
  });
}

// Modify your GoRouter to handle these different navigation styles
final shootableSpotDetailRouter = GoRouter(
  initialLocation: Screen.shootableSpotDetail.path,
  routes: [
    GoRoute(
      path: Screen.shootableSpotDetail.path,
      builder: (context, state) {
        final spotId = state.extra as String? ?? '';
        return ShootableSpotDetailPage(spotId: spotId);
      },
    ),
    GoRoute(
      path: Screen.attackerList.path,
      builder: (context, state) => const AttackerListPage(),
    ),
    GoRoute(
      path: Screen.shooting.path,
      pageBuilder: (context, state) {
        // For full-screen routes, close the sheet and navigate to the page
        WidgetsBinding.instance.addPostFrameCallback((_) {
          Navigator.of(context, rootNavigator: true).pop(); // Close the sheet
          
          // Navigate to full screen page using your main app router
          // You'll need a way to reference your main app router here
          // e.g., mainAppRouter.go(Screen.shooting.path);
          
          // Or use a provider to trigger the navigation
          ref.read(navigationProvider.notifier).navigateToFullScreen(Screen.shooting.path);
        });
        
        // Return an empty container while transitioning
        return const NoTransitionPage(child: SizedBox.shrink());
      },
    ),
    GoRoute(
      path: Screen.weaveSpot.path,
      pageBuilder: (context, state) {
        // Same approach as above
        WidgetsBinding.instance.addPostFrameCallback((_) {
          Navigator.of(context, rootNavigator: true).pop();
          ref.read(navigationProvider.notifier).navigateToFullScreen(Screen.weaveSpot.path);
        });
        return const NoTransitionPage(child: SizedBox.shrink());
      },
    ),
  ],
);
```

You'll need to create a navigation provider to handle the full-screen navigation:

```dart
class NavigationNotifier extends StateNotifier<void> {
  NavigationNotifier(this.ref) : super(null);
  final Ref ref;

  void navigateToFullScreen(String path) {
    // Access your main app router and navigate
    // For example:
    final router = ref.read(mainRouterProvider);
    router.go(path);
  }
}

final navigationProvider = StateNotifierProvider<NavigationNotifier, void>((ref) {
  return NavigationNotifier(ref);
});
```

This approach:
1. Uses a sheet for `ShootableSpotDetailPage` and `AttackerListPage`
2. When navigating to `ShootingPage` or `WeaveSpotPage`, it closes the sheet and triggers navigation in the main app router
3. Keeps the concerns separated between bottom sheet navigation and full-screen navigation

Another alternative approach would be to modify how you detect navigation within the bottom sheet:

```dart
// Inside your MaterialApp.router in the showModalBottomSheet builder:
navigatorObservers: [
  RouteObserver<PageRoute>(),
  MyNavigatorObserver((String routeName) {
    if (isFullScreenRoute(routeName)) {
      Navigator.of(context, rootNavigator: true).pop(); // Close the sheet
      // Then navigate to the full screen page in your main app
      mainAppRouter.go(routeName);
    }
  }),
],
```

Where `MyNavigatorObserver` is a custom observer that detects route changes and calls your callback.

---

## 👤 ユーザー
*2025/3/24 22:08:51*

日本語で

---

## 🤖 アシスタント
*2025/3/24 22:09:15*

ShootableSpotDetailPageとAttackerListPageをモーダルボトムシートで表示し、ShootingPageとWeaveSpotPageを全画面で表示したい問題について解決策をご説明します。

現在の問題点は、モーダルシート用のナビゲーションと全画面ナビゲーションに同じルーターを使用していることです。これを分けて実装すると良いでしょう：

```dart
// まず、全画面表示するべきルートかどうかを判断する関数を作成します
bool isFullScreenRoute(String path) {
  return path == Screen.shooting.path || path == Screen.weaveSpot.path;
}

void showShootableSpotDetailSheet(String spotId) {
  // 初期ルートにリセット
  shootableSpotDetailRouter.go(
    Screen.shootableSpotDetail.path,
    extra: spotId,
  );

  showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    builder: (context) {
      return FractionallySizedBox(
        heightFactor: 0.7,
        child: ClipRRect(
          borderRadius: const BorderRadius.vertical(
            top: Radius.circular(16),
          ),
          child: MaterialApp.router(
            debugShowCheckedModeBanner: false,
            theme: appTheme,
            routerConfig: shootableSpotDetailRouter,
            locale: currentLocale.flutterLocale,
            supportedLocales: AppLocaleUtils.supportedLocales,
            localizationsDelegates: GlobalMaterialLocalizations.delegates,
          ),
        ),
      );
    },
  ).then((_) {
    ref.read(showShootableSpotDetailNotifierProvider.notifier).hide();
  });
}

// GoRouterを修正して異なるナビゲーションスタイルを処理します
final shootableSpotDetailRouter = GoRouter(
  initialLocation: Screen.shootableSpotDetail.path,
  routes: [
    GoRoute(
      path: Screen.shootableSpotDetail.path,
      builder: (context, state) {
        final spotId = state.extra as String? ?? '';
        return ShootableSpotDetailPage(spotId: spotId);
      },
    ),
    GoRoute(
      path: Screen.attackerList.path,
      builder: (context, state) => const AttackerListPage(),
    ),
    GoRoute(
      path: Screen.shooting.path,
      pageBuilder: (context, state) {
        // 全画面ルートの場合、シートを閉じてページに移動
        WidgetsBinding.instance.addPostFrameCallback((_) {
          // シートを閉じる
          Navigator.of(context, rootNavigator: true).pop();
          
          // メインアプリのルーターを使って全画面に移動
          // ここでメインアプリのルーターを参照する方法が必要
          // 例: mainAppRouter.go(Screen.shooting.path);
          
          // あるいはプロバイダーを使用してナビゲーションをトリガー
          ref.read(navigationProvider.notifier).navigateToFullScreen(Screen.shooting.path);
        });
        
        // 遷移中は空のコンテナを返す
        return const NoTransitionPage(child: SizedBox.shrink());
      },
    ),
    GoRoute(
      path: Screen.weaveSpot.path,
      pageBuilder: (context, state) {
        // 上と同じアプローチ
        WidgetsBinding.instance.addPostFrameCallback((_) {
          Navigator.of(context, rootNavigator: true).pop();
          ref.read(navigationProvider.notifier).navigateToFullScreen(Screen.weaveSpot.path);
        });
        return const NoTransitionPage(child: SizedBox.shrink());
      },
    ),
  ],
);
```

全画面ナビゲーションを処理するためのナビゲーションプロバイダーを作成する必要があります：

```dart
class NavigationNotifier extends StateNotifier<void> {
  NavigationNotifier(this.ref) : super(null);
  final Ref ref;

  void navigateToFullScreen(String path) {
    // メインアプリのルーターにアクセスして移動
    // 例：
    final router = ref.read(mainRouterProvider);
    router.go(path);
  }
}

final navigationProvider = StateNotifierProvider<NavigationNotifier, void>((ref) {
  return NavigationNotifier(ref);
});
```

このアプローチの特徴：
1. ShootableSpotDetailPageとAttackerListPageにはシートを使用
2. ShootingPageまたはWeaveSpotPageに移動する場合、シートを閉じてメインアプリのルーターでナビゲーションをトリガー
3. ボトムシートナビゲーションと全画面ナビゲーションの関心事を分離

もう一つの方法として、ボトムシート内のナビゲーションを検出する方法を変更することも可能です：

```dart
// showModalBottomSheetのbuilder内のMaterialApp.routerに以下を追加：
navigatorObservers: [
  RouteObserver<PageRoute>(),
  MyNavigatorObserver((String routeName) {
    if (isFullScreenRoute(routeName)) {
      Navigator.of(context, rootNavigator: true).pop(); // シートを閉じる
      // メインアプリで全画面ページに移動
      mainAppRouter.go(routeName);
    }
  }),
],
```

この場合、`MyNavigatorObserver`はルート変更を検出してコールバックを呼び出すカスタムオブザーバーです。

---

## 🤖 アシスタント
*2025/3/24 22:13:18*

そうですね、その考え方は正解です。ShootingPageとWeaveSpotPageはモーダルボトムシートから全画面遷移させるのが目的であれば、shootableSpotDetailRouterからそれらの記述を削除し、代わりにメインルーター（router）を使って遷移させる方法が効果的です。

以下の修正方法を試してみてください：

1. まず、shootableSpotDetailRouterからShootingPageとWeaveSpotPageのルート定義を削除します。

2. ShootableSpotDetailPageの中からShootingPageやWeaveSpotPageに遷移するときは、コンテキストを使ってモーダルを閉じた後にメインルーターで遷移させます。

具体的な実装例：

```dart
// ShootableSpotDetailPage内の遷移処理例
void navigateToShootingPage(BuildContext context, WidgetRef ref) {
  // まずボトムシートを閉じる
  Navigator.of(context).pop();
  
  // メインルーターを使って全画面遷移
  // もしextraデータがあれば第二引数として渡せます
  ref.read(routerProvider).go(Screen.shooting.path);
}

void navigateToWeaveSpotPage(BuildContext context, WidgetRef ref) {
  // まずボトムシートを閉じる
  Navigator.of(context).pop();
  
  // メインルーターを使って全画面遷移
  ref.read(routerProvider).go(Screen.weaveSpot.path);
}
```

3. routerProviderが存在しない場合は、メインルーターを提供するプロバイダーを作成します：

```dart
final routerProvider = Provider<GoRouter>((ref) => router);
```

この修正により、shootableSpotDetailRouterはモーダルボトムシート内での遷移（ShootableSpotDetailPageとAttackerListPage）だけを扱うようになり、全画面遷移はメインルーターが担当するようになります。これにより、責任の分離がより明確になります。

あるいは、ボトムシート内のページからの遷移処理を簡素化するために、グローバルにアクセス可能なナビゲーション関数を作成する方法もあります：

```dart
// MainAppに保持するグローバルキー
final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

// どこからでも呼び出せるユーティリティ関数
void navigateToFullScreen(String path, {Object? extra}) {
  // モーダルが表示されている場合は閉じる
  if (navigatorKey.currentState?.canPop() ?? false) {
    navigatorKey.currentState?.pop();
  }
  
  // メインルーターで遷移
  router.go(path, extra: extra);
}
```

この関数をShootableSpotDetailPageから呼び出すことで、ボトムシートを閉じて全画面遷移を一連の処理として実行できます。

---
