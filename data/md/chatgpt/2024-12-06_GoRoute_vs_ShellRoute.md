# GoRoute vs ShellRoute

Date: 2024-12-06

---

## 👤 User
*2024-12-06 15:00:33*

import 'package:go_router/go_router.dart';
のShellRouteとRouteの違いを教えてほしい

---

## 🤖 Assistant
*2024-12-06 15:00:56*

`ShellRoute`と`GoRoute`（一般的にRouteとして言及されることがあります）は、`go_router`パッケージでルート管理に使用されます。それぞれ異なる役割を持ち、以下のように特徴が分かれます。

---

### 1. **`GoRoute`**
`GoRoute`は通常のページ遷移に使用されるルート定義です。各ページや画面に対応し、アプリケーションの階層構造をシンプルに構築するのに役立ちます。

#### 特徴
- 単一のページや画面を表現するために使用します。
- パスに応じたウィジェットを返します。
- ネストしたサブルートもサポートします。

#### 例
```dart
final GoRouter router = GoRouter(
  routes: [
    GoRoute(
      path: '/home',
      builder: (context, state) => HomePage(),
    ),
    GoRoute(
      path: '/profile',
      builder: (context, state) => ProfilePage(),
    ),
  ],
);
```

---

### 2. **`ShellRoute`**
`ShellRoute`はナビゲーションバーやタブバーなどの**共有されたレイアウトを持つルート**を作成するために使用されます。`ShellRoute`の直下に定義された子ルートは、この共通レイアウトの中で表示されます。

#### 特徴
- 共通のウィジェット（例: BottomNavigationBar）を提供します。
- 子ルートごとに異なる画面を表示しつつ、共有レイアウトを維持できます。
- 子ルートを簡単に切り替えられるため、タブベースのアプリに適しています。

#### 例
```dart
final GoRouter router = GoRouter(
  routes: [
    ShellRoute(
      builder: (context, state, child) {
        return Scaffold(
          body: child, // 各タブの画面をここに表示
          bottomNavigationBar: BottomNavigationBar(
            currentIndex: _getIndex(state.location), // 現在のタブのインデックスを計算
            onTap: (index) {
              if (index == 0) {
                context.go('/home');
              } else if (index == 1) {
                context.go('/profile');
              }
            },
            items: const [
              BottomNavigationBarItem(label: 'Home', icon: Icon(Icons.home)),
              BottomNavigationBarItem(label: 'Profile', icon: Icon(Icons.person)),
            ],
          ),
        );
      },
      routes: [
        GoRoute(
          path: '/home',
          builder: (context, state) => HomePage(),
        ),
        GoRoute(
          path: '/profile',
          builder: (context, state) => ProfilePage(),
        ),
      ],
    ),
  ],
);
```

---

### **違いを整理**
| 特徴            | `GoRoute`                             | `ShellRoute`                        |
|----------------|-------------------------------------|------------------------------------|
| 主な目的         | 単一ページや画面のルートを定義            | 共有レイアウトを持つルートを定義           |
| 子ルートのサポート | サポート（ネストされたルートを定義可能）      | 必須（子ルートを共有レイアウト内で切り替え） |
| 使いどころ        | ページ単位のルート管理                    | タブバーやサイドバー付きのナビゲーション構造 |
| レイアウトの提供    | 提供しない（直接ページをレンダリング）        | 提供する（Scaffoldなどで共通部分を定義）     |

---

### **使用するシナリオ**
- **`GoRoute`**: 単純なページ遷移が必要な場合（例: ログイン画面や詳細ページ）。
- **`ShellRoute`**: タブバーや共有レイアウトを使用したアプリケーションで必要。

`ShellRoute`は、特定の親ルートの下にある子ルート間でスムーズにレイアウトを維持するのに便利です。

---
