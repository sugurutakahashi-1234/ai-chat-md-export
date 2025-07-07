# whenOrNull vs useEffect

日付: 2025-01-11

---

## 👤 ユーザー
*2025/1/11 17:22:59*

accountState.whenOrNull(
      data: (data) {
        if (data != null) {
          WidgetsBinding.instance.addPostFrameCallback((\_) {
            context.go(Screen.map.path);
          });
        }
      },
    );
の処理はuseEffectでaccountStateを監視するのとどちらがいいのか？

import 'package:flutter/material.dart';
import 'package:flutter\_hooks/flutter\_hooks.dart';
import 'package:flutter\_svg/flutter\_svg.dart';
import 'package:go\_router/go\_router.dart';
import 'package:hooks\_riverpod/hooks\_riverpod.dart';
import 'package:snpit\_guild\_app/domain/screen.dart';
import 'package:snpit\_guild\_app/gen/assets.gen.dart';
import 'package:snpit\_guild\_app/presentation/design\_token/color\_token.dart';
import 'package:snpit\_guild\_app/presentation/providers/api\_client/accounts/get\_accounts\_info.dart';

class LoginPage extends HookConsumerWidget {
  const LoginPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final textEditingController = useTextEditingController();
    final accountState = ref.watch(getMyAccountNotifierProvider);

    useEffect(
      () {
        Future.microtask(() {
          ref.read(getMyAccountNotifierProvider.notifier).getMyAccount();
        });
        return null;
      },
      \[\],
    );

    accountState.whenOrNull(
      data: (data) {
        if (data != null) {
          WidgetsBinding.instance.addPostFrameCallback((\_) {
            context.go(Screen.map.path);
          });
        }
      },
    );

    return Scaffold(
      body: GestureDetector(
        onTap: () {
          FocusScope.of(context).unfocus();
        },
        child: Center(
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: \[
                  GestureDetector(
                    onLongPress: () {
                      // TODO: flavor が dev の場合のみの機能
                      context.push(Screen.debugMenu.path);
                    },
                    child: SvgPicture.asset(
                      Assets.images.logoLogin.path,
                    ),
                  ),
                  const SizedBox(height: 38),
                  Image.asset(
                    Assets.images.loginFig.path,
                  ),
                  const SizedBox(height: 54),
                  TextField(
                    controller: textEditingController,
                    decoration: const InputDecoration(
                      prefixIcon: Padding(
                        padding: EdgeInsets.all(12),
                        child: Icon(
                          Icons.email\_outlined,
                          color: ColorToken.text,
                          size: 24,
                        ),
                      ),
                      hintText: 'Enter your email',
                    ),
                  ),
                  const SizedBox(height: 24),
                  ElevatedButton(
                    onPressed: () {
                      // TODO: ログイン処理
                      context.push(Screen.verificationCode.path);
                    },
                    child: const Text('Login'),
                  ),
                \],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

---

## 🤖 アシスタント
*2025/1/11 17:23:12*

`accountState.whenOrNull` を用いてログイン状態を確認し、画面遷移する処理と、`useEffect` で `accountState` を監視して遷移する処理のどちらを選ぶべきかは、次のポイントに依存します。

---

### **現在の実装 (`whenOrNull` の利用) の利点**
- **シンプルさ**: `accountState` の変更が即座に反映され、特定の条件を満たした場合のみ処理が実行されるため、フラッターのリビルド時の挙動に直接依存しない。
- **制御の明示性**: `whenOrNull` を利用して非同期データの状態に応じた分岐をその場で記述でき、コードが読みやすい。

---

### **`useEffect` を用いた監視の利点**
- **リスナーとしての明示性**: `useEffect` は「特定の変数を監視する」という目的に明確に対応しており、非同期状態を監視する場合に直感的。
- **再利用性の向上**: 監視ロジックを分離することで、画面遷移ロジックが状態に依存して動くことが視覚的に明確になる。

---

### **`useEffect` を使ったサンプル実装**
以下は `useEffect` を用いて `accountState` を監視する場合の実装例です。

```dart
useEffect(
  () {
    if (accountState is AsyncData && accountState.value != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        context.go(Screen.map.path);
      });
    }
    return null;
  },
  [accountState],
);
```

このコードは、`accountState` の値が変化するたびに `useEffect` 内の処理が呼び出されます。

---

### **どちらを選ぶべきか？**
- **`whenOrNull` を推奨する場合**:
  - 状態の変更に対してリアクティブに処理を行いたい場合。
  - 状態が頻繁に変わることがない場合。
  - 単純な条件分岐で対応可能な場合。

- **`useEffect` を推奨する場合**:
  - 状態が頻繁に変化し、特定の状態に応じた副作用が必要な場合。
  - 監視対象が複数に増える可能性がある場合。
  - 状態遷移ロジックをより明確に分離して記述したい場合。

---

### **結論**
現在の実装は簡潔で適切なため、現状のまま `whenOrNull` を利用しても問題ありません。ただし、アプリの規模が大きくなるにつれて、複数の状態を監視したり、リスナーの責務を分離する必要が出てくる場合は、`useEffect` に移行する方が適切です。

---

## 👤 ユーザー
*2025/1/11 18:37:29*

これがある状態でログアウトするとクラッシュしてしまう。

useEffect(
  () {
    if (accountState is AsyncData && accountState.value != null) {
      WidgetsBinding.instance.addPostFrameCallback((\_) {
        context.go(Screen.map.path);
      });
    }
    return null;
  },
  \[accountState\],
);

---

## 🤖 アシスタント
*2025/1/11 18:37:42*

ログアウト時にクラッシュが発生する理由は、`useEffect` 内で `context.go` を呼び出しているタイミングで、`context` または `WidgetsBinding.instance` の状態が無効になっている可能性があります。たとえば、画面遷移中やウィジェットツリーが破棄されている際にこれが発生します。

以下に問題の原因と解決策を説明します。

---

### **問題の原因**
1. **`context` の有効性**:
   - `context` は `Widget` ツリーが有効である間のみ使用できます。
   - ログアウト時にウィジェットツリーがリビルドまたは破棄されると、`context.go` の呼び出し時に例外が発生します。

2. **`WidgetsBinding.instance.addPostFrameCallback` のタイミング**:
   - `addPostFrameCallback` は現在のフレームが終了した後に実行されます。
   - この間にウィジェットツリーが変更されると、`context` が無効になる可能性があります。

---

### **解決策**
以下のいずれかの方法で問題を解消できます。

---

#### **1. ウィジェットがマウントされているか確認**
`useEffect` の中でウィジェットがまだ有効であることを確認してから `context.go` を実行します。

```dart
useEffect(
  () {
    bool isMounted = true;

    if (accountState is AsyncData && accountState.value != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (isMounted) {
          context.go(Screen.map.path);
        }
      });
    }

    return () {
      isMounted = false; // クリーンアップ時にマウント状態を false に
    };
  },
  [accountState],
);
```

---

#### **2. 状態遷移のロジックを分離**
`context.go` の処理をビジネスロジック層に移動し、View (`LoginPage`) はその結果を監視するだけにします。

```dart
useEffect(
  () {
    if (accountState is AsyncData && accountState.value != null) {
      Future.microtask(() {
        context.go(Screen.map.path);
      });
    }
    return null;
  },
  [accountState],
);
```

---

#### **3. `useNavigate` を利用**
`useNavigate` を使うことで、遷移時に無効な `context` を扱うリスクを軽減できます。

```dart
final navigate = useNavigate();

useEffect(
  () {
    if (accountState is AsyncData && accountState.value != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        navigate(Screen.map.path);
      });
    }
    return null;
  },
  [accountState],
);
```

`useNavigate` は `context` を管理し、ウィジェットツリーが破棄された場合でも安全に動作します。

---

#### **4. ログアウト時の状態管理を明確にする**
ログアウト時に `accountState` をリセットし、余計な副作用が発生しないようにします。

- `getMyAccountNotifierProvider` の状態をログアウト時に `null` または初期状態に戻す。
- 遷移条件を厳密に指定。

```dart
if (accountState is AsyncData && accountState.value != null) {
  WidgetsBinding.instance.addPostFrameCallback((_) {
    if (mounted) {
      context.go(Screen.map.path);
    }
  });
}
```

---

### **おすすめの解決策**
1. **最優先**: マウント状態を確認 (`isMounted`)。
2. ビジネスロジック層で遷移を管理し、UI層は監視のみを行う。

これらを実施することで、ログアウト時のクラッシュを防ぎつつ、安全な状態遷移を実現できます。

---

## 👤 ユーザー
*2025/1/11 18:42:20*

isMounted ではだめだｔった

---

## 🤖 アシスタント
*2025/1/11 18:42:40*

`isMounted` が効果的でない場合、問題は別の箇所にある可能性があります。特に以下のようなケースが考えられます。

1. **`context.go` 呼び出しタイミング**  
   ログアウト処理中にウィジェットツリーが完全に破棄される前に `context.go` が呼び出されている可能性。

2. **`useEffect` の無限ループや不適切なクリーンアップ**  
   状態変更時に副作用が重複して実行され、予期しないタイミングでクラッシュしている可能性。

以下は、代替解決策のいくつかを試す方法です。

---

### **解決策 1: `Navigator.canPop` でルートの安全性を確認**
ログアウト処理や画面遷移中に無効な `context` を避けるため、遷移前に現在のルートがポップ可能かを確認します。

```dart
useEffect(
  () {
    if (accountState is AsyncData && accountState.value != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (Navigator.canPop(context)) {
          context.go(Screen.map.path);
        }
      });
    }
    return null;
  },
  [accountState],
);
```

`Navigator.canPop(context)` は現在のウィジェットツリーが有効であることを確認する簡単な方法です。

---

### **解決策 2: リダイレクトをロジック層に移動**
ビジネスロジック（`Notifier` など）に遷移の責務を移動し、`useEffect` 内で直接 `context.go` を呼び出さないようにします。

#### **Notifier 内で状態と遷移を管理**
```dart
class MyAccountNotifier extends StateNotifier<AsyncValue<Account?>> {
  MyAccountNotifier() : super(const AsyncValue.loading());

  Future<void> getMyAccount() async {
    final account = await fetchAccount();
    state = AsyncValue.data(account);
    if (account != null) {
      // 遷移をコントローラー層で直接管理
      navigatorKey.currentState?.pushReplacementNamed(Screen.map.path);
    }
  }
}
```

---

### **解決策 3: `WidgetsBinding` を使わないアプローチ**
`WidgetsBinding.instance.addPostFrameCallback` が不安定な場合、`Future.microtask` を使って非同期的に遷移を試みます。

```dart
useEffect(
  () {
    if (accountState is AsyncData && accountState.value != null) {
      Future.microtask(() {
        if (context.mounted) { // context の有効性を確認
          context.go(Screen.map.path);
        }
      });
    }
    return null;
  },
  [accountState],
);
```

`context.mounted` は `BuildContext` がまだ有効かを確認する方法として公式に推奨されています。

---

### **解決策 4: ログアウトフローの見直し**
ログアウト時に `accountState` が一時的に `null` または `AsyncError` 状態になる場合、それに応じた処理を追加する必要があります。

#### **ログアウト状態の監視**
```dart
accountState.when(
  data: (data) {
    if (data != null) {
      Future.microtask(() {
        if (context.mounted) {
          context.go(Screen.map.path);
        }
      });
    } else {
      // ログアウト時の処理
      Future.microtask(() {
        if (context.mounted) {
          context.go(Screen.login.path);
        }
      });
    }
  },
  loading: () {
    // 読み込み中の状態
  },
  error: (error, stack) {
    // エラー処理
  },
);
```

---

### **解決策 5: 安全な初期化タイミングの再検討**
`useEffect` を使用する代わりに、ウィジェットの `build` 内で `FutureBuilder` や `ProviderListener` を使用して、状態の変化に応じた遷移を安全に行います。

#### **ProviderListener を利用**
```dart
ProviderListener<AsyncValue<Account?>>(
  provider: getMyAccountNotifierProvider,
  onChange: (context, accountState) {
    if (accountState is AsyncData && accountState.value != null) {
      context.go(Screen.map.path);
    }
  },
  child: Scaffold(
    // ウィジェット構成
  ),
);
```

---

### **どの解決策を選ぶべきか？**
- **ログアウト時の処理も含めて状態管理を改善したい場合**: 解決策 2 または 4。
- **現状のアプローチを保ちながら安定性を高めたい場合**: 解決策 1 または 3。
- **状態変化の監視を分離したい場合**: 解決策 5。

ログアウト時のフローを含めて、ウィジェットのライフサイクルや非同期処理のタイミングを再確認するのが重要です。

---

## 👤 ユーザー
*2025/1/11 18:48:59*

なんかそもそもこの画面に戻ってきたときにいかのFuture.microtask(() {のブロックに入ってしまうのが問題な気がする

    useEffect(
      () {
        if (accountState is AsyncData && accountState.value != null) {
          Future.microtask(() {
            if (context.mounted) {
              context.go(Screen.map.path);
            }
          });
        }
        return null;
      },
      \[accountState\],
    );

---

## 🤖 アシスタント
*2025/1/11 18:49:17*

確かに、問題の本質は「戻ってきたときに `Future.microtask` のブロックが再び実行されてしまう」ことにある可能性があります。この挙動は、`useEffect` が `accountState` の変更をトリガーとして常に実行されるためです。

これを防ぐためには、`useEffect` 内で適切に条件を設定して、不要な遷移処理を抑制する必要があります。

---

### **解決策: 状態を監視し、リダイレクト済みかを追跡する**
画面遷移がすでに行われたことを追跡するためのフラグを導入します。

#### **リダイレクト済みフラグを導入**
`useState` を利用してリダイレクト済みかどうかを管理します。

```dart
final hasRedirected = useState(false);

useEffect(
  () {
    if (accountState is AsyncData && accountState.value != null && !hasRedirected.value) {
      Future.microtask(() {
        if (context.mounted) {
          hasRedirected.value = true; // フラグを更新
          context.go(Screen.map.path);
        }
      });
    }
    return null;
  },
  [accountState],
);
```

これにより、一度リダイレクトが行われた場合、それ以降は `Future.microtask` のブロックが再び実行されることを防げます。

---

### **解決策: ログイン画面への戻りを防ぐ**
`accountState` の状態が維持されているなら、ログイン画面への遷移そのものを防ぐアプローチも検討できます。以下のコードを `LoginPage` の先頭に追加することで、この画面へのアクセスを防ぐことができます。

```dart
if (accountState is AsyncData && accountState.value != null) {
  Future.microtask(() {
    if (context.mounted) {
      context.go(Screen.map.path); // すでにログイン済みなら即リダイレクト
    }
  });
  return const SizedBox.shrink(); // 画面の描画をスキップ
}
```

---

### **解決策: 状態のクリーンアップを適切に行う**
ログアウト後に `accountState` をリセットする処理がない場合、ログアウトしても以前の状態が残り、`AsyncData` による誤った遷移が発生する可能性があります。

#### **ログアウト時の状態リセット**
ログアウト処理の中で `accountState` をリセットするようにします。

```dart
ref.read(getMyAccountNotifierProvider.notifier).resetState();
```

または、リセット専用のメソッドを `Notifier` に追加します。

---

### **解決策: 状態遷移をビジネスロジックに移動**
`useEffect` の副作用で画面遷移を管理するのではなく、状態遷移のロジックを `Notifier` 側に移動します。これにより、ログイン状態が変更されたときにのみ明示的にリダイレクトされます。

#### **Notifier 内でリダイレクト処理を管理**
```dart
class MyAccountNotifier extends StateNotifier<AsyncValue<Account?>> {
  MyAccountNotifier() : super(const AsyncValue.loading());

  Future<void> getMyAccount() async {
    final account = await fetchAccount();
    state = AsyncValue.data(account);

    if (account != null) {
      navigatorKey.currentState?.pushReplacementNamed(Screen.map.path);
    }
  }

  void resetState() {
    state = const AsyncValue.loading(); // 状態をリセット
  }
}
```

---

### **結論: 最適なアプローチ**
1. **リダイレクト済みフラグを導入**: シンプルで最も適用しやすい。
2. **ログアウト時の状態リセット**: 状態が再利用されないようにする。
3. **ロジックをビジネス層に移動**: より堅牢で再利用性の高いアプローチ。

最もシンプルなアプローチとして、まずリダイレクト済みフラグ (`useState`) を導入することをおすすめします。これがうまくいかない場合は、状態のリセットやロジックの移動を検討してください。

---

## 👤 ユーザー
*2025/1/11 18:54:15*

resetState(); みたいない処理をさせたい

@Riverpod(keepAlive: true)
class GetMyAccountNotifier extends \_$GetMyAccountNotifier {
  @override
  Future&lt;AccountResponseDTOData?&gt; build() async =&gt; null;

  Future&lt;void&gt; getMyAccount() async {
    state = const AsyncValue.loading();
    try {
      final api = await ref.watch(accountsApiProvider.future);
      final response = await api.accountControllerGetCurrentUserAccounts();
      debugPrint('Response Body: ${response.data}');
      debugPrint('Response Body.data: ${response.data?.data}');
      state = AsyncValue.data(response.data?.data);
    } on Exception catch (e, stackTrace) {
      debugPrint('Error: $e');
      debugPrint('StackTrace: $stackTrace');
      state = AsyncValue.error(e, stackTrace);
    }
  }
}

---

## 🤖 アシスタント
*2025/1/11 18:54:22*

`resetState` メソッドを追加して `state` をリセットするように実装できます。このメソッドを使えば、ログアウト時などに `state` を初期化することができます。

以下のように実装してみてください。

### **`resetState` を追加した Notifier**
```dart
@Riverpod(keepAlive: true)
class GetMyAccountNotifier extends _$GetMyAccountNotifier {
  @override
  Future<AccountResponseDTOData?> build() async => null;

  Future<void> getMyAccount() async {
    state = const AsyncValue.loading();
    try {
      final api = await ref.watch(accountsApiProvider.future);
      final response = await api.accountControllerGetCurrentUserAccounts();
      debugPrint('Response Body: ${response.data}');
      debugPrint('Response Body.data: ${response.data?.data}');
      state = AsyncValue.data(response.data?.data);
    } on Exception catch (e, stackTrace) {
      debugPrint('Error: $e');
      debugPrint('StackTrace: $stackTrace');
      state = AsyncValue.error(e, stackTrace);
    }
  }

  void resetState() {
    state = const AsyncValue.data(null); // 初期状態にリセット
  }
}
```

---

### **使い方**
ログアウト処理などで `resetState()` を呼び出します。

#### **ログアウト処理の例**
```dart
final notifier = ref.read(getMyAccountNotifierProvider.notifier);
notifier.resetState();
```

これにより、`state` が `null` の状態にリセットされます。

---

### **注意点**
- `resetState` を呼び出すタイミングでは、リダイレクトや画面の再構築に依存しないように設計することが重要です。
- `resetState` を呼び出した後に再度 `getMyAccount` を呼び出すと、正常な状態遷移を確認できます。

---

### **補足**
`resetState` を使うことで、画面遷移時に意図しない状態が残る問題を解決できるだけでなく、他の箇所でも `state` をリセットする必要がある場合に簡単に対応できるようになります。

---
