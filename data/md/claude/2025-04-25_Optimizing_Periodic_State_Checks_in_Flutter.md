# Optimizing Periodic State Checks in Flutter

Date: 2025-04-25

---

## 👤 User
*2025-04-25 13:21:00*

以下の記述に違和感がある。Widget build(BuildContext context, WidgetRef ref) {のところにuseEffectはまとめたいが、定期的にbool値のチェックをしたいどうすればいいか？

useEffect(() {
                          if (invincibleUntil == null ||
                              !DateTime.now().isBefore(invincibleUntil)) {
                            invincible.value = false;
                            return null;
                          }

                          // 0.5秒ごとに無敵チェック。最大0.4秒程度のずれ
                          final timer = Timer.periodic(
                            const Duration(milliseconds: 500),
                            (timer) {
                              if (DateTime.now().isBefore(invincibleUntil)) {
                                invincible.value = true;
                              } else {
                                invincible.value = false;
                                timer.cancel();
                              }
                            },
                          );
                          return timer.cancel;
                        }, [invincibleUntil?.millisecondsSinceEpoch]);

---

## 🤖 Assistant
*2025-04-25 13:21:21*

こんにちは！コードの違和感について、確かにbuild関数内でuseEffectを使っている部分をより適切に整理したいということですね。HookBuilderで実装されている無敵時間チェックのロジックについて改善したいとのことですが、解決策を提案します。

現在の実装では、HookBuilder内で定期的なタイマーチェックをuseEffectを使って行っていますが、これをメインのbuild関数に移動させたいという問題ですね。

Flutterのフックを使う場合、定期的な値のチェックには以下のアプローチが考えられます：

1. グローバルなタイマー状態を管理するプロバイダーを作成する
2. useEffectの依存配列を適切に設定し、build関数の中で一度だけ初期化する

build関数内でuseEffectを利用する改善案を提案します：

```dart
@override
Widget build(BuildContext context, WidgetRef ref) {
  final canShootableRange = useState(false);
  final myGuildName =
      ref.watch(getMyGuildNotifierProvider).value?.guildName ?? 'Unknown';
  final myGuildId =
      ref.watch(getMyGuildNotifierProvider).value?.guildId ?? 'Unknown';
  final guildSpotDetailAsyncValue = ref.watch(getGuildSpotNotifierProvider);
  final guildAsyncValue = ref.watch(getGuildNotifierProvider);
  final isLoadingState = useState(false);
  
  // 無敵時間の状態管理を追加
  final invincible = useState<bool?>(null);
  
  // useEffectでスポット情報の取得とタイマーの初期化を一度に行う
  useEffect(() {
    Future.microtask(() async {
      try {
        isLoadingState.value = true;
        
        // スポット情報の取得ロジック（既存コード）
        ref.read(weaveConfigNotifierProvider.notifier).clear();
        
        final spotDetail = await ref
            .read(getGuildSpotNotifierProvider.notifier)
            .getGuildSpot(spotId);
            
        // 無敵時間の初期化
        final invincibleUntil = spotDetail.invincibleUntil;
        if (invincibleUntil == null ||
            !DateTime.now().isBefore(invincibleUntil)) {
          invincible.value = false;
        } else {
          invincible.value = true;
          // タイマーの設定
          Timer.periodic(
            const Duration(milliseconds: 500),
            (timer) {
              if (!context.mounted) {
                timer.cancel();
                return;
              }
              
              if (DateTime.now().isBefore(invincibleUntil)) {
                invincible.value = true;
              } else {
                invincible.value = false;
                timer.cancel();
              }
            },
          );
        }
        
        // ギルド情報取得や位置情報取得は既存コードと同様
        // ...
        
      } on Exception catch (error) {
        if (context.mounted) {
          showErrorSnackBar(context, error);
        }
      } finally {
        if (context.mounted) {
          isLoadingState.value = false;
        }
      }
    });
    
    return null;
  }, []);
  
  // 以下、既存のコード
  // ...
}
```

もう一つの方法として、Riverpodを活用した改善案もあります：

1. 無敵時間の状態を管理する専用のプロバイダーを作成する
2. useEffectの代わりにStreamProviderを使用してタイマーを管理する

```dart
// プロバイダーの定義（別ファイル）
final invincibleStateProvider = StateNotifierProvider.family<InvincibleNotifier, bool, DateTime?>((ref, invincibleUntil) {
  return InvincibleNotifier(invincibleUntil);
});

class InvincibleNotifier extends StateNotifier<bool> {
  Timer? _timer;
  
  InvincibleNotifier(DateTime? invincibleUntil) : super(false) {
    _checkInvincible(invincibleUntil);
  }
  
  void _checkInvincible(DateTime? invincibleUntil) {
    if (invincibleUntil == null || 
        !DateTime.now().isBefore(invincibleUntil)) {
      state = false;
      return;
    }
    
    state = true;
    _timer?.cancel();
    _timer = Timer.periodic(
      const Duration(milliseconds: 500),
      (timer) {
        if (DateTime.now().isBefore(invincibleUntil)) {
          state = true;
        } else {
          state = false;
          timer.cancel();
        }
      },
    );
  }
  
  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }
}

// 使用側（ShootableSpotDetailPage内）
// HookBuilderが不要になる
final isInvincible = ref.watch(invincibleStateProvider(spotDetail.invincibleUntil));

ElevatedButton(
  onPressed: canShootableRange.value &&
              !isLoadingState.value &&
              !isInvincible
      ? onTapAttack
      : null,
  child: Center(
    child: Text(
      isInvincible ? 'Still Invincible' : 'Attack',
    ),
  ),
)
```

これらのアプローチにより、HookBuilder内に閉じていた無敵時間の状態管理をより適切な場所に移動させ、コードの可読性と保守性を向上させることができます。特に2つ目のアプローチは状態管理をより適切に分離できるので、おすすめです。

---

## 👤 User
*2025-04-25 13:23:03*

Riverpodアノテーションを使っている。それを使うとどのような記述になるのか？

---

## 🤖 Assistant
*2025-04-25 13:23:21*

Riverpodアノテーションを使用すると、コードはよりクリーンになります。以下に、Riverpodアノテーションを使用した実装の例を示します：

まず、無敵状態を管理するためのプロバイダーを作成します：

```dart
// invincible_provider.dart
import 'dart:async';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'invincible_provider.g.dart';

@riverpod
class InvincibleState extends _$InvincibleState {
  Timer? _timer;

  @override
  bool build(DateTime? invincibleUntil) {
    ref.onDispose(() {
      _timer?.cancel();
    });
    
    _checkInvincible(invincibleUntil);
    return invincibleUntil != null && 
           DateTime.now().isBefore(invincibleUntil);
  }

  void _checkInvincible(DateTime? invincibleUntil) {
    if (invincibleUntil == null || 
        !DateTime.now().isBefore(invincibleUntil)) {
      state = false;
      return;
    }
    
    state = true;
    _timer?.cancel();
    _timer = Timer.periodic(
      const Duration(milliseconds: 500),
      (timer) {
        if (invincibleUntil != null && 
            DateTime.now().isBefore(invincibleUntil)) {
          state = true;
        } else {
          state = false;
          timer.cancel();
        }
      },
    );
  }
}
```

このコードを生成したら、`flutter pub run build_runner build` を実行して、`.g.dart` ファイルを生成する必要があります。

次に、ShootableSpotDetailPageでこのプロバイダーを使用します：

```dart
@override
Widget build(BuildContext context, WidgetRef ref) {
  final canShootableRange = useState(false);
  final myGuildName =
      ref.watch(getMyGuildNotifierProvider).value?.guildName ?? 'Unknown';
  final myGuildId =
      ref.watch(getMyGuildNotifierProvider).value?.guildId ?? 'Unknown';
  final guildSpotDetailAsyncValue = ref.watch(getGuildSpotNotifierProvider);
  final guildAsyncValue = ref.watch(getGuildNotifierProvider);
  final isLoadingState = useState(false);
  
  // メインのuseEffectでスポット情報を取得
  useEffect(() {
    Future.microtask(() async {
      try {
        isLoadingState.value = true;
        
        ref.read(weaveConfigNotifierProvider.notifier).clear();
        
        final spotDetail = await ref
            .read(getGuildSpotNotifierProvider.notifier)
            .getGuildSpot(spotId);
        
        // ギルド情報取得など（既存コード）
        // ...
        
      } catch (error) {
        if (context.mounted) {
          showErrorSnackBar(context, error);
        }
      } finally {
        if (context.mounted) {
          isLoadingState.value = false;
        }
      }
    });
    
    return null;
  }, []);
  
  // 以下、UI部分でプロバイダーを使用
  
  // ボトムナビゲーションバー部分の実装
  return Scaffold(
    // ...
    bottomNavigationBar: SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            guildSpotDetailAsyncValue.maybeWhen(
              data: (spotDetail) {
                if (spotDetail == null) {
                  return const SizedBox.shrink();
                }

                // Neutral spot case（既存コード）
                if (spotDetail.guildId == null) {
                  // ...
                }

                // Enemy spot case
                if (spotDetail.guildId != myGuildName) {
                  // HookBuilderが不要になる
                  final isInvincible = ref.watch(
                    invincibleStateProvider(spotDetail.invincibleUntil)
                  );
                  
                  return ElevatedButton(
                    onPressed:
                        canShootableRange.value &&
                                !isLoadingState.value &&
                                !isInvincible
                            ? onTapAttack
                            : null,
                    child: Center(
                      child: Text(
                        isInvincible ? 'Still Invincible' : 'Attack',
                      ),
                    ),
                  );
                }

                // Own guild's spot - no button shown（既存コード）
                return const SizedBox.shrink();
              },
              orElse: () => const SizedBox.shrink(),
            ),
            // ...
          ],
        ),
      ),
    ),
  );
}
```

このアプローチの利点：

1. HookBuilderが不要になり、コードが整理される
2. 無敵状態の管理ロジックが分離され、再利用可能になる
3. useEffectの重複が解消され、状態管理が明確になる
4. コンポーネントの再ビルド時に状態が適切に保持される

Riverpodアノテーションを使用することで、コードの可読性と保守性が大幅に向上し、Flutter Hooksとの組み合わせも自然になります。また、プロバイダーは自動的にdisposeされるため、メモリリークの心配も少なくなります。

---

## 👤 User
*2025-04-25 13:25:46*

このやり方は一般的か？

---

## 🤖 Assistant
*2025-04-25 13:25:55*

はい、Riverpodアノテーションを使用したアプローチは現代のFlutterアプリ開発では非常に一般的になってきています。特に状態管理を扱う複雑なアプリでは、この方法が推奨されることが多いです。

Riverpodアノテーションを使用する利点は以下の通りです：

1. コードの自動生成によりボイラープレートコードが削減される
2. 型安全性が向上し、コンパイル時のエラーチェックが強化される
3. プロバイダーの依存関係が明示的になり、メンテナンスしやすくなる
4. テスト容易性が向上する
5. IDEのサポートが良く、コード補完やリファクタリングが容易

多くの中〜大規模なFlutterプロジェクトでは、Riverpodアノテーションを使用することが標準的なプラクティスになりつつあります。特に、Flutter Hooksと組み合わせることで、React風の宣言的なコーディングスタイルを実現できます。

タイマーのような副作用を扱う場合、特にこのアプローチは効果的です。useEffectの中で行うよりも、専用のプロバイダーで管理することで、コードの責任分離が明確になり、再利用性も高まります。

大規模なFlutterアプリを開発している企業や、コミュニティ内の多くの著名な開発者も、このパターンを採用しています。

---

## 👤 User
*2025-04-25 13:26:43*

これってBoolをもつんだっけ？

final isInvincible = ref.watch( invincibleStateProvider(spotDetail.invincibleUntil) );

---

## 🤖 Assistant
*2025-04-25 13:26:51*

そうですね、`invincibleStateProvider`は`bool`を返すプロバイダーになります。コードの該当部分：

```dart
@riverpod
class InvincibleState extends _$InvincibleState {
  Timer? _timer;

  @override
  bool build(DateTime? invincibleUntil) {
    // ...
    return invincibleUntil != null && 
           DateTime.now().isBefore(invincibleUntil);
  }
  
  // ...
}
```

このプロバイダーから返される値は`bool`型で、スポットが無敵状態かどうかを表します：
- `true`: スポットは現在無敵状態
- `false`: スポットは攻撃可能な状態

そして、UIの部分では：

```dart
final isInvincible = ref.watch(invincibleStateProvider(spotDetail.invincibleUntil));
```

この`isInvincible`の値も`bool`型となります。このbool値を元に、ボタンのenabled状態や表示テキストを切り替えています。

このパターンは、状態が単純な場合（今回のようにbool値一つで状態を表現できる場合）に特に効果的で、Riverpodを使った状態管理の基本的な使い方として一般的です。

---

## 👤 User
*2025-04-25 13:30:18*

全然別のアプローチでタイマーで都度チェックしてboolを更新するuseEffectを最初に設置しておいて使うのはどうだろうか？

---

## 🤖 Assistant
*2025-04-25 13:30:38*

別のアプローチとして、タイマーで定期的に無敵状態をチェックするuseEffectを最初に設置する方法も有効です。このアプローチは、Riverpodプロバイダーを新たに作成せずに実装できるので、シンプルなケースではより直感的かもしれません。

以下に、このアプローチの実装例を示します：

```dart
@override
Widget build(BuildContext context, WidgetRef ref) {
  final canShootableRange = useState(false);
  final isLoadingState = useState(false);
  final myGuildName = ref.watch(getMyGuildNotifierProvider).value?.guildName ?? 'Unknown';
  final myGuildId = ref.watch(getMyGuildNotifierProvider).value?.guildId ?? 'Unknown';
  final guildSpotDetailAsyncValue = ref.watch(getGuildSpotNotifierProvider);
  final guildAsyncValue = ref.watch(getGuildNotifierProvider);
  
  // 無敵状態の管理用のstate
  final isInvincible = useState<bool>(false);
  
  // スポット情報の読み込みuseEffect
  useEffect(() {
    Future.microtask(() async {
      try {
        isLoadingState.value = true;
        
        // スポット情報の取得と他の初期化ロジック（既存コードと同じ）
        // ...
        
      } catch (error) {
        if (context.mounted) {
          showErrorSnackBar(context, error);
        }
      } finally {
        if (context.mounted) {
          isLoadingState.value = false;
        }
      }
    });
    
    return null;
  }, []);
  
  // 無敵状態チェック用のuseEffect
  useEffect(() {
    // スポット詳細がまだロードされていない場合は何もしない
    if (guildSpotDetailAsyncValue.value == null) return null;
    
    final spotDetail = guildSpotDetailAsyncValue.value!;
    final invincibleUntil = spotDetail.invincibleUntil;
    
    // 無敵時間が設定されていない、または既に無敵時間が切れている場合
    if (invincibleUntil == null || 
        !DateTime.now().isBefore(invincibleUntil)) {
      isInvincible.value = false;
      return null;
    }
    
    // 現在無敵状態の場合はタイマーをセットアップ
    isInvincible.value = true;
    final timer = Timer.periodic(
      const Duration(milliseconds: 500),
      (timer) {
        if (!context.mounted) {
          timer.cancel();
          return;
        }
        
        if (DateTime.now().isBefore(invincibleUntil)) {
          isInvincible.value = true;
        } else {
          isInvincible.value = false;
          timer.cancel();
        }
      },
    );
    
    // クリーンアップ関数
    return timer.cancel;
  }, [guildSpotDetailAsyncValue.value?.invincibleUntil?.millisecondsSinceEpoch]);
  
  // 以下、UI部分でisInvincible.valueを使用
  return Scaffold(
    // ...
    bottomNavigationBar: SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            guildSpotDetailAsyncValue.maybeWhen(
              data: (spotDetail) {
                if (spotDetail == null) {
                  return const SizedBox.shrink();
                }

                // Enemy spot case
                if (spotDetail.guildId != null && spotDetail.guildId != myGuildName) {
                  return ElevatedButton(
                    onPressed:
                        canShootableRange.value &&
                                !isLoadingState.value &&
                                !isInvincible.value
                            ? onTapAttack
                            : null,
                    child: Center(
                      child: Text(
                        isInvincible.value ? 'Still Invincible' : 'Attack',
                      ),
                    ),
                  );
                }
                
                // 他のケース（既存コードと同じ）
                // ...
              },
              orElse: () => const SizedBox.shrink(),
            ),
            // ...
          ],
        ),
      ),
    ),
  );
}
```

このアプローチの特徴：

1. **シンプルさ** - 新しいプロバイダーを作成せずに、既存のhooksの仕組みを活用できます。
2. **依存関係の明示** - useEffectの依存配列に`invincibleUntil`を指定することで、値が変わった時だけタイマーが再セットアップされます。
3. **スコープ** - 状態の管理がコンポーネント内に閉じているため、この機能が必要なのがこのコンポーネントだけの場合は適しています。

一般的に、このアプローチは以下のような場合に適しています：
- 機能が単一のコンポーネントに閉じている
- 状態管理が比較的シンプル
- 再利用性よりも実装の簡潔さを優先したい

ただし、複数の場所で同様の機能が必要になる場合や、アプリの状態管理を統一したい場合は、最初に提案したRiverpodアノテーションを使ったアプローチの方が適しています。

---

## 👤 User
*2025-04-25 13:31:39*

ちなみに, [guildSpotDetailAsyncValue.value?.invincibleUntil?.millisecondsSinceEpoch]);としている理由ってわかるかな？

---

## 🤖 Assistant
*2025-04-25 13:31:48*

guildSpotDetailAsyncValue.value?.invincibleUntil?.millisecondsSinceEpoch を依存配列に設定している理由は、無敵時間が更新されたときのみタイマーを再設定するためです。

この式の細かい部分を分析すると：

1. **nullセーフティ**: `?.` 演算子を使用することで、guildSpotDetailAsyncValueの値がnullでもエラーにならずに処理を続行できます。

2. **ミリ秒への変換**: `millisecondsSinceEpoch` プロパティを使用することで、DateTime型の比較ではなく整数値（ミリ秒）での比較になります。これにより、依存配列での比較がより効率的かつ正確になります。

3. **再レンダリングの最適化**: useEffectの依存配列に値としてDateTimeオブジェクト自体を渡すと、参照の比較になり、値が同じでも再レンダリングが発生する可能性があります。ミリ秒に変換すると純粋な数値の比較になるため、不要な再レンダリングを防げます。

Flutter Hooksにおいて、useEffectの依存配列には「値の変化を検知したい状態」を入れます。今回のケースでは、無敵時間（invincibleUntil）が変わった時だけタイマーを再設定すれば良いので、そのミリ秒値を依存配列に設定しています。

この方法は、React/Flutter Hooksを使用する際の標準的なプラクティスで、パフォーマンスと正確性の両方を考慮した実装方法です。

---

## 👤 User
*2025-04-25 20:14:38*

ちなみに今回のようなコードになることによって、パフォーマンスの差はあるか？つまり、前のコードではHookBuilder内のビルドで済んでいるが、今回変更によって再描画の範囲が全体になっているということはあるのあ？

---

## 🤖 Assistant
*2025-04-25 20:14:59*

パフォーマンスの観点から考えると、確かに変更によって再描画の範囲に影響があります。

前のコードと新しいアプローチを比較してみましょう：

**前のコード（HookBuilder使用）：**
HookBuilderを使用した場合、無敵状態のチェックとタイマーの管理は、HookBuilder内に閉じています。つまり、タイマーイベントによる状態更新は、HookBuilder内のサブツリーのみを再描画します。

**新しいアプローチ（トップレベルのuseEffect）：**
ShootableSpotDetailPageのbuild内でuseStateとuseEffectを使用した場合、タイマーによる状態更新（isInvincible.valueの変更）は、ShootableSpotDetailPage全体の再描画をトリガーする可能性があります。

パフォーマンスへの具体的な影響：

1. **再描画の範囲**：
   - 旧：HookBuilder内のウィジェットのみ（限定的）
   - 新：ShootableSpotDetailPage全体（より広範囲）

2. **再描画の頻度**：
   両方のアプローチでタイマーは500ms間隔で実行されますが、状態が変更された場合のみ再描画が発生します。無敵状態が変わるのは数秒おきなので、頻度自体は同じです。

3. **実際のパフォーマンス影響**：
   - 単純なUI（今回のようなボタン表示のみ）では、差はほとんど感じられないでしょう
   - 複雑なUIや大量のデータを扱う場合は、HookBuilderアプローチの方がパフォーマンスが良い可能性があります

パフォーマンス最適化の観点からは、再描画の範囲を必要最小限に抑えることが理想的です。もしパフォーマンスが懸念される場合、以下のようなアプローチも考えられます：

```dart
// ボタン部分を別コンポーネントに分離する
class AttackButton extends HookConsumerWidget {
  const AttackButton({
    required this.canAttack,
    required this.invincibleUntil,
    required this.onTapAttack,
  });

  final bool canAttack;
  final DateTime? invincibleUntil;
  final VoidCallback onTapAttack;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isInvincible = useState<bool>(false);
    
    useEffect(() {
      if (invincibleUntil == null || 
          !DateTime.now().isBefore(invincibleUntil)) {
        isInvincible.value = false;
        return null;
      }
      
      isInvincible.value = true;
      final timer = Timer.periodic(
        const Duration(milliseconds: 500),
        (timer) {
          if (!context.mounted) {
            timer.cancel();
            return;
          }
          
          if (DateTime.now().isBefore(invincibleUntil)) {
            isInvincible.value = true;
          } else {
            isInvincible.value = false;
            timer.cancel();
          }
        },
      );
      
      return timer.cancel;
    }, [invincibleUntil?.millisecondsSinceEpoch]);
    
    return ElevatedButton(
      onPressed: canAttack && !isInvincible.value
          ? onTapAttack
          : null,
      child: Center(
        child: Text(
          isInvincible.value ? 'Still Invincible' : 'Attack',
        ),
      ),
    );
  }
}
```

この方法なら、メイン画面と無敵状態のチェックロジックが分離され、タイマーによる状態更新は必要なコンポーネントだけに影響します。

実際のアプリの規模や複雑さによって最適なアプローチは変わりますが、単一機能のシンプルなUIであれば、コードの可読性と保守性を優先し、パフォーマンスに問題が生じた場合に最適化を検討するというアプローチが一般的です。

---

## 👤 User
*2025-04-25 20:17:35*

ちなみにどのタイミングで再描画がかかるのか？

---

## 🤖 Assistant
*2025-04-25 20:17:50*

Flutterにおける再描画のタイミングは、状態の変更によってトリガーされます。今回のケースでは以下のタイミングで再描画が発生します：

1. **useState/StateProviderの値が変更された時**：
   - `isInvincible.value = true/false` が実行されると、その状態を使用しているウィジェットの再描画がトリガーされます

2. **タイマーによる状態更新時**：
   - 0.5秒ごとに実行されるタイマーコールバック内で、`isInvincible.value` が変更された場合に再描画が発生します
   - ただし、値が実際に変わった時（例：trueからfalseに変わった時）のみ再描画されます。同じ値への更新（trueからtrueへの更新）では再描画は発生しません

3. **useEffectの依存配列の値が変わった時**：
   - `[guildSpotDetailAsyncValue.value?.invincibleUntil?.millisecondsSinceEpoch]` の値が変わると、useEffect内のコードが再実行され、タイマーがリセットされます

具体的な処理の流れは以下のようになります：

1. ShootableSpotDetailPageが初期表示される
2. useEffectが実行され、invincibleUntilの値に基づいてタイマーがセットアップされる
3. タイマーのコールバックが0.5秒ごとに実行される
4. タイマーコールバック内でisInvincible.valueが更新されると、それを使用しているウィジェット部分が再描画される
5. 無敵状態が終了すると、タイマーが自動的にキャンセルされる

ウィジェットツリーの再構築は、状態が変更されたコンポーネントから下流のウィジェットに対して発生します。HookBuilderを使っていた元のコードでは、再描画の範囲がHookBuilder内のサブツリーに限定されていました。一方、新しいアプローチではShootableSpotDetailPageレベルの状態なので、理論上はより広範囲の再描画が発生する可能性があります。

ただし、Flutterの再描画メカニズムは効率的に設計されており、実際のDOMの更新は変更がある部分のみに限定されます。そのため、小〜中規模のUIであれば、どちらのアプローチでも体感できるほどのパフォーマンス差はないでしょう。

HookBuilderアプローチと新しいuseEffectアプローチのどちらが優れているかは、アプリケーションの構造とパフォーマンス要件によります。コードの可読性と保守性を優先するなら新しいアプローチ、細かなパフォーマンス最適化を優先するならHookBuilder（または分離したコンポーネント）が適しています。

---
