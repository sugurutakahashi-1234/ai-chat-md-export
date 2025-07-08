# Bottom Sheet Push 遷移

Date: 2024-12-10

---

## 👤 User
*2024-12-10 16:57:50*

flutter でbottom sheet 上で push 遷移させたい

---

## 🤖 Assistant
*2024-12-10 16:58:11*

FlutterでBottom Sheet上で`push`遷移を実現するには、以下のようなアプローチが考えられます。特に、`showModalBottomSheet`や`PersistentBottomSheet`の上でさらにページを`Navigator`で`push`する場合を考慮しています。

---

### 方法 1: `showModalBottomSheet` 上で Navigator を分離

`showModalBottomSheet`内に新しい`Navigator`を埋め込むことで、Bottom Sheet上で`push`遷移を実現します。

#### サンプルコード

```dart
import 'package:flutter/material.dart';

class BottomSheetPushExample extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Bottom Sheet Push Example')),
      body: Center(
        child: ElevatedButton(
          onPressed: () {
            showModalBottomSheet(
              context: context,
              isScrollControlled: true, // Bottom Sheet全体を制御可能にする
              builder: (context) {
                return SizedBox(
                  height: MediaQuery.of(context).size.height * 0.8,
                  child: Navigator(
                    onGenerateRoute: (RouteSettings settings) {
                      // 初期の画面を設定
                      return MaterialPageRoute(
                        builder: (context) => BottomSheetHome(),
                      );
                    },
                  ),
                );
              },
            );
          },
          child: Text('Show Bottom Sheet'),
        ),
      ),
    );
  }
}

class BottomSheetHome extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: ElevatedButton(
          onPressed: () {
            Navigator.of(context).push(
              MaterialPageRoute(
                builder: (context) => BottomSheetDetail(),
              ),
            );
          },
          child: Text('Go to Detail'),
        ),
      ),
    );
  }
}

class BottomSheetDetail extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Detail Page')),
      body: Center(
        child: ElevatedButton(
          onPressed: () {
            Navigator.of(context).pop();
          },
          child: Text('Back'),
        ),
      ),
    );
  }
}

void main() {
  runApp(MaterialApp(
    home: BottomSheetPushExample(),
  ));
}
```

---

### 解説

1. **`Navigator`を分離**
   - Bottom Sheet内に`Navigator`を新規で配置することで、メインアプリのナビゲーションとは独立した遷移を実現。
   - `Navigator`がBottom Sheet内に閉じ込められるため、遷移が親ウィジェットに影響しません。

2. **`isScrollControlled`オプション**
   - Bottom Sheetが画面全体を占めるように設定できます。必要に応じて`height`を調整してください。

---

### 方法 2: `PersistentBottomSheet`を使った実装

Flutterの`ScaffoldState`の`showBottomSheet`を使う場合も、上記の`Navigator`埋め込みアプローチが有効です。同様の構造を適用してください。

---

この方法で、Bottom Sheet内でのページ遷移を直感的に管理できます。

---

## 👤 User
*2024-12-10 16:58:44*

それを go_routerで管理できないのか？

---

## 🤖 Assistant
*2024-12-10 16:59:17*

Flutterの`go_router`を使って、Bottom Sheet上での`push`遷移を管理することは可能です。`go_router`はルート管理を効率化するためのライブラリであり、Bottom Sheetを表示するルートを追加し、その中で遷移を定義することで対応できます。

以下に、`go_router`を用いたサンプル実装を示します。

---

### サンプルコード

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
      routerConfig: _router,
    );
  }
}

// GoRouterの設定
final GoRouter _router = GoRouter(
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => HomePage(),
    ),
    GoRoute(
      path: '/bottomSheet',
      builder: (context, state) => const SizedBox.shrink(), // Modal Bottom Sheetで表示するため空
      routes: [
        GoRoute(
          path: 'detail',
          builder: (context, state) => BottomSheetDetailPage(),
        ),
      ],
      pageBuilder: (context, state) => CustomTransitionPage<void>(
        child: BottomSheetNavigator(),
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          return SlideTransition(
            position: animation.drive(
              Tween(begin: const Offset(0, 1), end: Offset.zero).chain(
                CurveTween(curve: Curves.easeInOut),
              ),
            ),
            child: child,
          );
        },
      ),
    ),
  ],
);

// ホーム画面
class HomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('GoRouter Bottom Sheet Example')),
      body: Center(
        child: ElevatedButton(
          onPressed: () {
            context.push('/bottomSheet');
          },
          child: const Text('Show Bottom Sheet'),
        ),
      ),
    );
  }
}

// Bottom Sheet内のNavigator
class BottomSheetNavigator extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SizedBox(
        height: MediaQuery.of(context).size.height * 0.8,
        child: Column(
          children: [
            Expanded(
              child: Center(
                child: ElevatedButton(
                  onPressed: () {
                    context.push('/bottomSheet/detail');
                  },
                  child: const Text('Go to Detail Page'),
                ),
              ),
            ),
            TextButton(
              onPressed: () {
                context.pop();
              },
              child: const Text('Close'),
            ),
          ],
        ),
      ),
    );
  }
}

// Bottom Sheet内の詳細画面
class BottomSheetDetailPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Detail Page')),
      body: Center(
        child: ElevatedButton(
          onPressed: () {
            context.pop();
          },
          child: const Text('Back to Bottom Sheet'),
        ),
      ),
    );
  }
}
```

---

### 解説

1. **`go_router`でルートを定義**
   - `/`がホーム画面のルート。
   - `/bottomSheet`がBottom Sheetを表示するためのルート。
   - `/bottomSheet/detail`がBottom Sheet内の詳細ページのルート。

2. **`CustomTransitionPage`を使用**
   - Bottom Sheetの表示にカスタムアニメーションを適用。
   - `SlideTransition`を使用して、Bottom Sheetが下からスライドインするアニメーションを実現。

3. **Bottom Sheet内の`Navigator`管理**
   - Bottom Sheet内で`context.push('/bottomSheet/detail')`を呼び出すことで詳細ページに遷移。
   - 詳細ページから`context.pop()`を呼び出して戻る。

4. **高さの調整**
   - `SizedBox`でBottom Sheetの高さを調整可能。`MediaQuery`を利用して柔軟に高さを設定。

---

### この方法の利点

- **`go_router`で一元管理**
  - アプリ全体のルーティングを一箇所で管理でき、コードが整理される。
  
- **簡単なURLパス指定**
  - URLパスによってBottom Sheet内外の遷移を簡単に記述可能。

- **カスタムアニメーション**
  - `CustomTransitionPage`を利用して、好みに応じたアニメーションを設定可能。

これで、`go_router`を使ってBottom Sheet上での`push`遷移が可能になります！

---

## 👤 User
*2024-12-10 16:59:39*

それが書かれている記事や公式ドキュメントを教えてほしい

---

## 🤖 Assistant
*2024-12-10 16:59:48*

Flutterで`go_router`を使用してBottom Sheet上でのページ遷移を管理する方法について、参考になる記事や公式ドキュメントを以下にまとめました。

1. **[Flutter] go_routerでbottom navigationの出し入れをしてみる - Qiita**
   - **URL**: https://qiita.com/kurogoma939/items/988b252fd2c9584cf020
   - **概要**: `go_router`を用いて、BottomNavigationBarの表示・非表示を制御しながら画面遷移を行う方法について解説しています。Bottom Sheetの直接的な例ではありませんが、`go_router`でのナビゲーション制御の参考になります。

2. **[Flutter] go_routerでBottomNavigationBarの永続化に挑戦する - Qiita**
   - **URL**: https://qiita.com/heyhey1028/items/fbe24b0781b9245aff4d
   - **概要**: `go_router`を使用して、BottomNavigationBarの状態を保持しながら画面遷移を行う方法について詳しく解説しています。Bottom Sheetに関する直接的な情報は含まれていませんが、`go_router`での複雑なナビゲーション管理のヒントが得られます。

3. **go_routerパッケージの公式ドキュメント**
   - **URL**: https://pub.dev/documentation/go_router/latest/
   - **概要**: `go_router`の公式ドキュメントで、基本的な使い方や高度なナビゲーション手法について詳しく説明されています。特に、`CustomTransitionPage`や`navigatorBuilder`の使用方法は、Bottom Sheet上でのページ遷移を実装する際に役立ちます。

これらのリソースを参考に、`go_router`を活用したBottom Sheet上でのページ遷移の実装を検討してみてください。

---
