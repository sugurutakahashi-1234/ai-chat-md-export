# MaterialApp 重複使用の必要性

日付: 2024-12-10

---

## 👤 ユーザー
*2024/12/10 17:36:27*

flutter で MaterialApp をアプリ内に2つ書く必要はあるのか?

---

## 🤖 アシスタント
*2024/12/10 17:36:56*

通常、Flutter アプリ内で `MaterialApp` を2つ書く必要は **ありません**。`MaterialApp` はアプリ全体のルート、テーマ、ローカライゼーションなどを管理する **トップレベルのウィジェット** です。通常、1つのアプリには1つの `MaterialApp` があれば十分です。

### なぜ2つの `MaterialApp` を書くべきではないのか？
1. **状態の分離による複雑化**:
   - 複数の `MaterialApp` を使用すると、各 `MaterialApp` 内で状態やナビゲーションが独立してしまい、アプリ全体で一貫性を保つのが難しくなります。

2. **テーマやローカライゼーションの一貫性**:
   - `MaterialApp` はアプリ全体のテーマやローカライゼーション設定を管理します。複数の `MaterialApp` を使うと、それらが分離され、一貫した見た目や動作が失われる可能性があります。

3. **ナビゲーションの混乱**:
   - Flutter のナビゲーションは通常、1つの `Navigator` を使って管理します。複数の `MaterialApp` を使用すると、それぞれが独自の `Navigator` を持つため、ナビゲーションが複雑になります。

### 例外的に2つの `MaterialApp` を使う場合
もし特定の理由で2つの `MaterialApp` を使いたい場合は、以下のような状況が考えられます。

1. **完全に別のアプリケーション部分を動的に切り替えたい場合**:
   - 例えば、アプリの中で「別の独立したサブアプリ」を表示したい場合。ただし、この場合でも、通常は `MaterialApp` を使用せずに、テーマやナビゲーションをカスタマイズしたウィジェットを使う方が望ましいです。

2. **開発・デバッグ用途**:
   - 開発中に異なる `MaterialApp` の設定やテーマを比較するため、一時的に使うことがあります。

### 適切な設計方法
複数のテーマやナビゲーションを切り替えたい場合は、以下のアプローチを検討してください。

- **`ThemeData` の動的切り替え**:
  ```dart
  MaterialApp(
    theme: lightTheme,
    darkTheme: darkTheme,
    themeMode: ThemeMode.system, // 動的にテーマを切り替え
  );
  ```

- **`Navigator` を分ける**:
  アプリの特定部分に別のナビゲーションスタックを持たせる場合は、`Navigator` を直接使用することができます。
  ```dart
  Navigator(
    pages: [
      MaterialPage(child: FirstPage()),
      if (showSecondPage) MaterialPage(child: SecondPage()),
    ],
    onPopPage: (route, result) => route.didPop(result),
  );
  ```

もし特定のユースケースで2つの `MaterialApp` を使おうとしているなら、その理由を詳しく教えていただければ、代替案を提案します！

---

## 👤 ユーザー
*2024/12/10 17:38:00*

以下の実装で2つMaterialAppを宣言しているのを止める方法が知りたい。
ボトムシートで独立した遷移がしたいためで別のrouterに切り替える必要があるんだ。

import 'package:flutter/material.dart';
import 'package:go\_router/go\_router.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      routerConfig: mainRouter, // メインアプリ用 GoRouter
    );
  }

  /// メインアプリ用 GoRouter
  final GoRouter mainRouter = GoRouter(
    routes: \[
      GoRoute(
        path: '/',
        builder: (context, state) =&gt; HomePage(),
      ),
    \],
  );
}

/// メインアプリのホーム画面
class HomePage extends StatelessWidget {
  void \_showBottomSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) {
        // 新しい GoRouter インスタンスを作成
        final GoRouter bottomSheetRouter = GoRouter(
          initialLocation: '/home',
          routes: \[
            GoRoute(
              path: '/home',
              builder: (context, state) =&gt; BottomSheetHomePage(),
            ),
            GoRoute(
              path: '/second',
              builder: (context, state) =&gt; BottomSheetSecondPage(),
            ),
          \],
        );

        return SizedBox(
          height: MediaQuery.of(context).size.height \* 0.8,
          child: ClipRRect(
            borderRadius: BorderRadius.vertical(top: Radius.circular(16.0)),
            child: MaterialApp.router(
              routerConfig: bottomSheetRouter, // 新しい GoRouter を使用
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Main App')),
      body: Center(
        child: ElevatedButton(
          onPressed: () =&gt; \_showBottomSheet(context),
          child: Text('Show Bottom Sheet'),
        ),
      ),
    );
  }
}

/// ボトムシートの最初のページ
class BottomSheetHomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: Text('Bottom Sheet Home'),
        actions: \[
          IconButton(
            icon: Icon(Icons.close),
            onPressed: () {
              // ボトムシート全体を閉じる
              Navigator.of(context, rootNavigator: true).pop();
            },
          ),
        \],
      ),
      body: Center(
        child: ElevatedButton(
          onPressed: () {
            context.push('/second'); // ボトムシート内での遷移
          },
          child: Text('Go to Second Page'),
        ),
      ),
    );
  }
}

/// ボトムシートの2番目のページ
class BottomSheetSecondPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: Text('Second Page'),
        actions: \[
          IconButton(
            icon: Icon(Icons.close),
            onPressed: () {
              // ボトムシート全体を閉じる
              Navigator.of(context, rootNavigator: true).pop();
            },
          ),
        \],
      ),
      body: Center(
        child: Text('This is the second page in the bottom sheet.'),
      ),
    );
  }
}

---

## 🤖 アシスタント
*2024/12/10 17:38:41*

この実装では、ボトムシート内の遷移を独立させるために別の `MaterialApp.router` を使用していますが、これを **1つの `MaterialApp.router` に統一**する方法を解説します。

GoRouter の機能を活用して、ボトムシート専用のルートをメインルーターに統合できます。以下の手順で修正します。

---

### 修正ポイント
1. **メインの `GoRouter` にボトムシート専用のルートを追加**:
   ボトムシート内のページ遷移もメインルーターで管理します。

2. **ボトムシートの表示を `Navigator` の `builder` を活用して制御**:
   ボトムシートを表示する際に独自のナビゲーションスタックを作成します。

---

### 修正版コード
```dart
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      routerConfig: mainRouter,
    );
  }

  /// メインアプリ用 GoRouter
  final GoRouter mainRouter = GoRouter(
    routes: [
      GoRoute(
        path: '/',
        builder: (context, state) => HomePage(),
      ),
      // ボトムシート用ルート
      GoRoute(
        path: '/bottomsheet',
        builder: (context, state) => BottomSheetWrapper(),
      ),
    ],
  );
}

/// メインアプリのホーム画面
class HomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Main App')),
      body: Center(
        child: ElevatedButton(
          onPressed: () {
            // ボトムシートを開く
            context.push('/bottomsheet');
          },
          child: Text('Show Bottom Sheet'),
        ),
      ),
    );
  }
}

/// ボトムシートのラッパー
class BottomSheetWrapper extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return DraggableScrollableSheet(
      initialChildSize: 0.8,
      maxChildSize: 0.8,
      minChildSize: 0.6,
      builder: (context, scrollController) {
        return ClipRRect(
          borderRadius: BorderRadius.vertical(top: Radius.circular(16.0)),
          child: Navigator(
            onGenerateRoute: (settings) {
              Widget page;
              switch (settings.name) {
                case '/second':
                  page = BottomSheetSecondPage();
                  break;
                case '/':
                default:
                  page = BottomSheetHomePage();
              }
              return MaterialPageRoute(builder: (_) => page);
            },
          ),
        );
      },
    );
  }
}

/// ボトムシートの最初のページ
class BottomSheetHomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: Text('Bottom Sheet Home'),
        actions: [
          IconButton(
            icon: Icon(Icons.close),
            onPressed: () {
              Navigator.of(context).pop();
            },
          ),
        ],
      ),
      body: Center(
        child: ElevatedButton(
          onPressed: () {
            Navigator.of(context).pushNamed('/second'); // ボトムシート内での遷移
          },
          child: Text('Go to Second Page'),
        ),
      ),
    );
  }
}

/// ボトムシートの2番目のページ
class BottomSheetSecondPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: Text('Second Page'),
        actions: [
          IconButton(
            icon: Icon(Icons.close),
            onPressed: () {
              Navigator.of(context).pop();
            },
          ),
        ],
      ),
      body: Center(
        child: Text('This is the second page in the bottom sheet.'),
      ),
    );
  }
}
```

---

### 主な変更点
1. **`/bottomsheet` をメインの `GoRouter` に追加**:
   - ボトムシートを表示する際のエントリーポイントとして `/bottomsheet` を設定しました。

2. **`Navigator` を使用してボトムシート内のページ遷移を実現**:
   - ボトムシート専用の `Navigator` を使用し、ボトムシート内の独立した遷移を実現しました。

3. **`DraggableScrollableSheet` でボトムシートを自然に表示**:
   - ボトムシートが画面全体の一部として機能するように設定。

---

### メリット
- `MaterialApp` を1つに統一。
- GoRouter の構成を複雑にせず、メインのルーター内で完結。
- ボトムシート内の遷移が他の部分と独立しつつ統一的に管理可能。

この方法で、コードを簡潔かつメンテナブルに保つことができます。

---
