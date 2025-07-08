# showModalBottomSheet エラー対策

日付: 2025-02-08

---

## 👤 ユーザー
*2025/2/8 13:02:26*

showModalBottomSheetで表示できる画面で、ローディングにshowModalBottomSheetを閉じて、エラーが発生した場合に、以下のエラーが発生している。
どちらかの方針を取りたい。
(1) ローディング中はshowModalBottomSheetを閉じられなくする
(2) このエラーの発生を伏せず。  例外が発生しました
* 
StateError (Bad state: Cannot use "ref" after the widget was disposed.)

 import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:snpit_guild_app/domain/design/color_token.dart';
import 'package:snpit_guild_app/infrastructure/snapit_guild_api/snapit_guild_api.openapi.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/explorers/get_explorer_list.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/explorers/update_explorer.dart';
import 'package:snpit_guild_app/presentation/providers/flavor_provider.dart';
import 'package:snpit_guild_app/presentation/providers/on_exploring.dart';
import 'package:snpit_guild_app/presentation/widgets/square_image.dart';
import 'package:snpit_guild_app/utils/location_utils.dart';
import 'package:snpit_guild_app/utils/snack_bar_utils.dart';

class ExplorerListPage extends HookConsumerWidget {
  const ExplorerListPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedExplorerIndexState = useState(0);
    final explorerListAsyncValue = ref.watch(getExplorerListNotifierProvider);
    final isExploring = ref.watch(onExploringNotifierProvider).isExploring;

    Future&lt;void&gt; onTapStartExplore() async {
      try {
        ref.read(onExploringNotifierProvider.notifier).startLoading();

        final explorerList = explorerListAsyncValue.value;

        if (explorerList == null || explorerList.isEmpty) {
          throw Exception('You do not have any explorers.');
        }

        final selectedExplorer = explorerList[selectedExplorerIndexState.value];
        final explorerId = selectedExplorer.explorerId;

        if (explorerId == null) {
          throw Exception('Unexpected error occurred.');
        }

        final flavor = ref.watch(flavorProvider);
        final currentLocation =
            await getCurrentLocation(flavor: flavor).timeout(
          const Duration(seconds: 5),
          onTimeout: () {
            throw Exception(
              // ignore: lines_longer_than_80_chars
              'Getting current location timed out. Please try again in an area with better signal.',
            );
          },
        );

        final exploredSpotList =
            await ref.read(updateExplorerNotifierProvider.notifier).explore(
                  explorerId,
                  currentLocation,
                );

        ref.read(onExploringNotifierProvider.notifier).startExploring(
              selectedExplorer,
              exploredSpotList,
            );

        if (context.mounted) {
          context.pop();
        }
      } on Exception catch (error) {
        if (context.mounted) {
          ref.read(onExploringNotifierProvider.notifier).clear();
          showErrorSnackBar(context, error);
        }
      }
    }

    useEffect(
      () {
        Future.microtask(() async {
          try {
            await ref
                .read(getExplorerListNotifierProvider.notifier)
                .getExplorerList();
          } on Exception catch (error) {
            if (context.mounted) {
              showErrorSnackBar(context, error);
            }
          }
        });
        return null;
      },
      [],
    );

    Widget buildExplorerCard(ExplorerDTO explorer, {required bool isSelected}) {
      final imageUrl = explorer.explorerImage?.isNotEmpty == true
          ? explorer.explorerImage
          : null;
      final energy = explorer.energy ?? 0;
      final fullEnergy = explorer.fullEnergy ?? 1;
      final energyRatio = energy / fullEnergy;
      final range = explorer.range ?? 0;
      final description = explorer.explorerDescription ?? '';

      return Center(
        child: Card(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
            side: BorderSide(
              color: isSelected ? ColorToken.primary : ColorToken.secondary,
            ),
          ),
          color: ColorToken.bg,
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: SquareImage(
                    imageUrl: imageUrl,
                    size: 120,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Life',
                        style: TextStyle(
                          fontSize: 14,
                          color: ColorToken.border,
                        ),
                      ),
                      const SizedBox(height: 4),
                      LinearProgressIndicator(
                        value: energyRatio,
                        borderRadius: BorderRadius.circular(8),
                        valueColor: const AlwaysStoppedAnimation&lt;Color&gt;(
                          ColorToken.primary,
                        ),
                        backgroundColor: ColorToken.bgDark,
                      ),
                      const SizedBox(height: 12),
                      const Text(
                        'Search range',
                        style: TextStyle(
                          fontSize: 14,
                          color: ColorToken.border,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${range}km radius',
                        style: const TextStyle(
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        description,
                        style: const TextStyle(
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: const Text('Select explorer'),
        actions: [
          IconButton(
            onPressed: () {
              context.pop();
            },
            icon: const Icon(Icons.close),
          ),
        ],
      ),
      body: explorerListAsyncValue.when(
        data: (tmpExplorerList) {
          final explorerList = tmpExplorerList ?? [];

          if (explorerList.isEmpty) {
            return const Center(child: Text('You do not have any explorers.'));
          }

          return Stack(
            children: [
              Column(
                children: [
                  Expanded(
                    child: CarouselSlider.builder(
                      options: CarouselOptions(
                        onPageChanged: (index, reason) {
                          selectedExplorerIndexState.value = index;
                        },
                        viewportFraction: 0.85,
                      ),
                      itemCount: explorerList.length,
                      itemBuilder: (context, index, realIndex) {
                        final explorer = explorerList[index];
                        final isSelected =
                            index == selectedExplorerIndexState.value;

                        return Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 8),
                          child: buildExplorerCard(
                            explorer,
                            isSelected: isSelected,
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
              if (isExploring)
                const Center(
                  child: CircularProgressIndicator(),
                ),
            ],
          );
        },
        loading: () {
          return const Center(child: CircularProgressIndicator());
        },
        error: (error, _) {
          return Center(child: Text('Error: $error'));
        },
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: ElevatedButton(
            onPressed: (explorerListAsyncValue.value?.isNotEmpty == true &&
                    !isExploring)
                ? () async {
                    await onTapStartExplore();
                  }
                : null,
            child: const Text('Start explore'),
          ),
        ),
      ),
    );
  }
}

---

## 🔧 ツール
*2025/2/8 13:02:45*

コンテキストとrefの参照がウィジェットの状態変更と関係しているため、エラーが発生している可能性があります。この問題には、ローディング状態中のボトムシートの閉じるボタンを無効にする、もしくはボトムシートを完全に閉じられないようにする方法が考えられます。

**ウィジェット管理の工夫**

`context.mounted`を使って、何かを参照する前にコンテキストがアタッチされているかチェックしている。非同期操作中でもrefへの参照を管理する方法だね。

手動でボトムシートを閉じる動作を防ぐ方法について考えている。「isDismissible: false」と「enableDrag: false」を使うか、closeボタンを削除または無効にする方法だね。

---

## 🤖 アシスタント
*2025/2/8 13:02:45*

問題の原因は、**非同期処理が完了する前にBottomSheetを閉じてしまい、`ref` や `context` を参照しようとしている**ことです。  
そのため、ウィジェットが破棄された後 (disposeされた後) に `ref.read(...)` あるいは `context.mounted` を呼び出してしまい、`Bad state: Cannot use "ref" after the widget was disposed.` が発生しています。  

## 解決策の候補

### (1) ローディング中はBottomSheetを閉じられなくする
- `showModalBottomSheet` の引数である `isDismissible` を `false`、`enableDrag` を `false` にすると、ユーザーがスワイプやタップなどで勝手に閉じることをできなくします。
- さらに、AppBar の close ボタン（`IconButton`）も無効化しておき、**ローディングが完了するまで閉じられない**ようにすることで、ウィジェットがdisposeされるタイミングを制御できます。

#### サンプル
```dart
await showModalBottomSheet(
  context: context,
  isDismissible: false, // スワイプでの閉じる操作を無効
  enableDrag: false,    // 下方向スワイプでのドラッグ動作を無効
  builder: (context) {
    return ExplorerListPage();
  },
);
```

- `ExplorerListPage` の中の AppBar の close ボタンの `onPressed` も、`isExploring` の状態を見て
  ```dart
  IconButton(
    onPressed: isExploring ? null : () => context.pop(),
    icon: const Icon(Icons.close),
  ),
  ```
  のように、ロード中は `null` にして押せなくしておくとさらに安全です。

### (2) エラーを伏せず、そもそもエラーが発生しないようにガードする
こちらは、「ウィジェットがdisposeされていても読んだ時点でクラッシュしないようにする」ためのガード処理を追加するアプローチです。  

Flutter Hooks / Riverpodでは `context.mounted` のように簡易的にウィジェットのマウント状態をチェックする手段は用意されていますが、`ref` のdispose状態まで丁寧に確認する方法はありません。Riverpodの設計的にも**Widgetがdisposeされたあとの `ref` の呼び出しは想定していない**ため、基本的には避ける方がベターです。

それでも、どうしても強引に対処するならば

- 非同期処理を開始する時点で「Future完了時に`context.mounted`を再度チェック」  
- もしくは**ウィジェットとは無関係のところ**(つまりUI層でなくUseCase層やRepository層) でデータ処理を完結させ、完了時にUIへ通知する際に「まだUIがmountedであればUIへ反映」とする

といったパターンが多いです。  
例としては `onTapStartExplore()` の末尾付近で、UIを書き換える直前に `if (!context.mounted) return;` を差し込むなどが挙げられます。

```dart
Future<void> onTapStartExplore() async {
  try {
    ref.read(onExploringNotifierProvider.notifier).startLoading();
    // ---- 中略 ----

    final exploredSpotList =
        await ref.read(updateExplorerNotifierProvider.notifier).explore(
          explorerId,
          currentLocation,
        );

    // ここでいったんチェック
    if (!context.mounted) {
      // 画面が既にdisposeされているなら処理せず終了
      return;
    }

    // まだmountedなら状態更新やUI操作へ進む
    ref.read(onExploringNotifierProvider.notifier).startExploring(
          selectedExplorer,
          exploredSpotList,
        );

    context.pop(); // ここで閉じる

  } on Exception catch (error) {
    if (context.mounted) {
      // ...
    }
  }
}
```

これでユーザーにエラーが見えなくなるわけではありませんが、  
**「disposeされた後に `ref` を呼び出してクラッシュする状態」を回避**できるようになります。

## どちらを選ぶべきか？

### (1) ローディング中は閉じられなくする場合
- **ユーザー体験的に、「途中でやめたいのにやめられない」** という状況が発生する  
- ただし、確実にdisposeされる前に非同期処理が終わるので、今回のエラーは起きなくなる

### (2) ガード処理やUI層以外での処理分離で対策する場合
- ローディング中にユーザーが画面を閉じられるが、その場合でも安全に処理をキャンセルまたはUI反映をスキップできる  
- 「ユーザーはいつでも好きにやめられる」ため、操作性が高い  
- その代わり実装コストはやや増える

**結論**:  
ユーザーに「待たされる」時間がどうしても短い(ほぼ一瞬)なら(1)でもいいですが、  
5秒などタイムアウトがある処理をユーザーがキャンセルする可能性があるなら(2)のほうがおすすめです。

---

## 実装例

もし「ローディングが一瞬で終わる」前提で、**画面を閉じられないようにしたい**場合の実装例です。

**呼び出し元** (`showModalBottomSheet`) で:
```dart
showModalBottomSheet(
  context: context,
  isDismissible: false,
  enableDrag: false,
  builder: (context) {
    return const ExplorerListPage();
  },
);
```

**ExplorerListPage** 側でAppBarのcloseボタンを `isExploring` 中は無効にする:

```dart
AppBar(
  automaticallyImplyLeading: false,
  title: const Text('Select explorer'),
  actions: [
    IconButton(
      // isExploring なら押せないようにする
      onPressed: isExploring
          ? null  // 押せない
          : () {
              context.pop();
            },
      icon: const Icon(Icons.close),
    ),
  ],
),
```

これにより、**ユーザーがバックボタンやスワイプなどで途中キャンセルできないようになる**ため、  
「実行中の `ref.read(...)` が破棄後に実行される」問題が起きにくくなります。

---

## まとめ
- **根本原因**は、ウィジェットdispose後に `ref` や `context` を使っている点
- これを回避するには
  1. **ユーザーが閉じる(破棄)操作をできないようにする**(簡単だがUXは悪くなりがち)  
  2. **クローズやdisposeされたらUI更新をキャンセル**するロジックを入れる(実装コストは上がるがUXは保ちやすい)  

アプリの要件とユーザー体験を踏まえて、(1) か (2) を選ぶとよいでしょう。

---

## 👤 ユーザー
*2025/2/8 13:06:14*

showModalBottomSheetが閉じたとしても残りの処理は全部やりきってほしいんだ。

---

## 🔧 ツール
*2025/2/8 13:06:48*

ユーザーは、ボトムシートが閉じられても非同期処理を続行し、後で結果を得たいと考えています。

**背景でのアクティブ**

ボトムシートが閉じても背景プロセスが動作し、結果はRiverpodで管理される。幾らかの操作の後、非同期処理は続行される。

**非同期の流れ**

NotiferはUIの外で動作し、ストアを更新。結果は非同期に提供され、後でUIが状態を読み取る。UIは結果を待たずに他の操作を進める。

**バッカーグラウンドの進行**

UIが閉じても背景プロセスは続行中。グローバルプロバイダーかウィジェットのトップレベルプロバイダーで管理し、`context.mounted`のチェックでユーザーのスクリーン維持を確認する。

**プロバイダーでの処理**

ボトムシートが閉じても、プロバイダー内で処理を継続中。`context`は渡さず、必要なものだけを渡している。

**背景の持続**

ユーザーが「開始」をタップし、プロセスがスタート。ボトムシートは閉じるかもしれないが、ノティファイアは処理を続けている。最終状態を設定し、メッセージを表示するかもしれない。

**エラーハンドリングの方法**

ボトムシートが閉じても、グローバルなスキャフォールドメッセンジャーか、トップレベルのロジックを使ってエラーステートを処理している。

**エラーハンドリングの検討**

エラーステートをノティファイアで管理し、次の画面に進むための方法を模索中。これにより、ユーザーはボトムシートが閉じてもスムーズに次の操作ができる。

**プロセスの持続性**  
ユーザーの問いは、ボトムシートが閉じてもプロセスが進む方法です。プロバイダーを活用し、関連する引数を渡して非同期ロジックを管理しています。

**プロセスの委任操作**

ロジックをプロバイダーに委任し、非同期処理を管理。コンテキストやウィジェットには余計な干渉をせず、完了またはエラーをプロバイダーで処理する方法を探っている。

---

## 🤖 アシスタント
*2025/2/8 13:06:48*

`showModalBottomSheet` が閉じられた（画面がdisposeされた）あとでも、**非同期処理を途中でキャンセルせずに最後まで続行させたい**場合、  
**「処理の実装をウィジェット側から切り離す」** ことが大きなポイントです。

- ウィジェット（＝`showModalBottomSheet` で表示される画面）は、途中でユーザーに閉じられる (disposeされる) 可能性がある  
- しかし「処理だけは最後まで走らせたい」のであれば、**ウィジェットのライフサイクルに依存しない場所**（UseCase層・Repository層、もしくはRiverpodのStateNotifierなど）へ処理を移し、ウィジェットは単に「処理開始のトリガー」として使う  
- ウィジェットが閉じても、バックグラウンドで処理が走り続け、完了後にStateNotifierやRepositoryが状態を更新する  
- ウィジェット側は、もしまだ表示されていればその状態を購読し、UIに反映するし、既に閉じていれば何も起きない

これにより、**「ウィジェットが消えたタイミングで `ref` や `context` を触る→エラーになる」** のを回避できます。  

以下では「Riverpod（StateNotifier）で処理をウィジェットから分離する」例を示します。

---

## 実装方針

1. **バックグラウンド処理用の `StateNotifier` を作る**  
   - 例：`ExplorerUseCaseNotifier` (仮称)
   - 非同期処理（`updateExplorerNotifierProvider.notifier.explore(...)` など）をここで呼び出す  
   - 結果や進捗を `state` に格納する  

2. **BottomSheet側（ウィジェット）** では  
   - `ExplorerUseCaseNotifier` に「探索処理を開始する」メソッドを呼び出すだけ  
   - **画面を閉じる/閉じないは自由**。閉じても `ExplorerUseCaseNotifier` 側の処理は継続する  
   - 処理結果をUIで反映したい場合は `ref.watch(...)` して購読しておく。ただしウィジェットがdisposeされれば購読は終わるが、処理自体は継続する  

### サンプルコード

#### 1. StateNotifierの例

```dart
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:snpit_guild_app/infrastructure/snapit_guild_api/snapit_guild_api.openapi.dart';
// 他必要なimport

/// Stateの定義: 調査中かどうか、結果、エラーなど
class ExplorerUseCaseState {
  final bool isLoading;
  final dynamic error;
  // たとえば探索後の結果リストなど
  final List<SpotDTO> exploredSpotList;

  ExplorerUseCaseState({
    required this.isLoading,
    this.error,
    required this.exploredSpotList,
  });

  ExplorerUseCaseState copyWith({
    bool? isLoading,
    dynamic error,
    List<SpotDTO>? exploredSpotList,
  }) {
    return ExplorerUseCaseState(
      isLoading: isLoading ?? this.isLoading,
      error: error,
      exploredSpotList: exploredSpotList ?? this.exploredSpotList,
    );
  }
}

class ExplorerUseCaseNotifier extends StateNotifier<ExplorerUseCaseState> {
  ExplorerUseCaseNotifier(this.ref)
      : super(ExplorerUseCaseState(isLoading: false, exploredSpotList: []));

  final Ref ref;

  /// 探索開始メソッド
  Future<void> startExplore({
    required int explorerId,
    required LocationDTO currentLocation,
    required ExplorerDTO selectedExplorer,
  }) async {
    // ローディング開始
    state = state.copyWith(isLoading: true, error: null);

    try {
      // 何らかのAPIコールなど。例:
      final exploredSpotList = await ref
          .read(updateExplorerNotifierProvider.notifier)
          .explore(explorerId, currentLocation);

      // 結果をstateに反映
      state = state.copyWith(
        isLoading: false,
        exploredSpotList: exploredSpotList,
      );

      // ここでさらに他のStateNotifierやRepositoryを更新してもOK
      // 例えば:
      ref.read(onExploringNotifierProvider.notifier).startExploring(
        selectedExplorer,
        exploredSpotList,
      );

    } catch (e) {
      state = state.copyWith(isLoading: false, error: e);
    }
  }
}

/// Provider定義
final explorerUseCaseNotifierProvider = StateNotifierProvider<
    ExplorerUseCaseNotifier, ExplorerUseCaseState>((ref) {
  return ExplorerUseCaseNotifier(ref);
});
```

これで、**探索処理はUIのライフサイクルと切り離された場所**（StateNotifier）で実行されるようになります。  
`state.isLoading` が `true` の間は処理中であり、ウィジェットがdisposeされても処理は継続します。

---

#### 2. BottomSheet側のウィジェット例

```dart
class ExplorerListPage extends HookConsumerWidget {
  const ExplorerListPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedExplorerIndexState = useState(0);

    // ① ExplorerUseCaseNotifierのstateを購読
    final explorerUseCaseState = ref.watch(explorerUseCaseNotifierProvider);
    // 既存のonExploring状態も購読
    final isExploring = ref.watch(onExploringNotifierProvider).isExploring;

    // ② ボタン押下時の処理
    Future<void> onTapStartExplore() async {
      // 画面を閉じられても継続したい処理をStateNotifierへ委譲
      // ---- まず必要な情報を取得
      final explorerList = ref.watch(getExplorerListNotifierProvider).value;
      if (explorerList == null || explorerList.isEmpty) {
        // ここでエラー表示 or SnackBarなど
        return;
      }

      final selectedExplorer = explorerList[selectedExplorerIndexState.value];
      final explorerId = selectedExplorer.explorerId;
      if (explorerId == null) {
        // ここでエラー表示 or SnackBarなど
        return;
      }

      // 現在地取得
      // ※ウィジェットがdisposeされても処理を続けたい場合、
      //   この取得処理までNotifierに移す手もある。
      try {
        final flavor = ref.watch(flavorProvider);
        final currentLocation = await getCurrentLocation(flavor: flavor);

        // Notifierに探索処理の開始を指示
        await ref
            .read(explorerUseCaseNotifierProvider.notifier)
            .startExplore(
              explorerId: explorerId,
              currentLocation: currentLocation,
              selectedExplorer: selectedExplorer,
            );
      } catch (e) {
        // エラー処理など
      }

      // ここでBottomSheetを閉じる。→ウィジェットはdisposeされる
      if (context.mounted) {
        context.pop();
      }

      // 画面閉じても、ExplorerUseCaseNotifierは処理を進行中 (または完了している)
    }

    // ③ `explorerUseCaseState` が更新されたらUI表示を切り替えるなどの例
    final isNotifierLoading = explorerUseCaseState.isLoading;
    final notifierError = explorerUseCaseState.error;

    // 既存の画面構造はそのまま。サンプルとして一部抜粋
    return Scaffold(
      appBar: AppBar(
        title: const Text('Select explorer'),
        actions: [
          IconButton(
            onPressed: () {
              // ローディング中だけ閉じられないようにしたいなら
              // onPressed: isNotifierLoading ? null : () => context.pop();
              context.pop();
            },
            icon: const Icon(Icons.close),
          ),
        ],
      ),
      body: Center(
        child: isNotifierLoading
            ? const CircularProgressIndicator()
            : notifierError != null
                ? Text('Error: $notifierError')
                : const Text('BottomSheet内容'),
      ),
      bottomNavigationBar: SafeArea(
        child: ElevatedButton(
          onPressed: isNotifierLoading ? null : onTapStartExplore,
          child: const Text('Start Explore'),
        ),
      ),
    );
  }
}
```

### 仕組み
1. **ユーザーがボタンをタップ** → `onTapStartExplore()` が呼ばれる  
2. `onTapStartExplore()` で
   1. 必要情報を取得 (`explorerId`, `currentLocation` など)  
   2. **`ref.read(explorerUseCaseNotifierProvider.notifier).startExplore(...)` を呼んで非同期処理を開始**  
   3. `context.pop()` でBottomSheetを閉じる  
3. `ExplorerUseCaseNotifier` の中で探索処理が続行  
4. UI (BottomSheet) は `pop()` されたのでdisposeされるが、  
   **`ExplorerUseCaseNotifier` の処理はそのまま継続**し、完了したら `state` を更新  

もしユーザーがまだ画面を閉じていなければ `explorerUseCaseState` の更新がUIに反映されるし、  
ユーザーが画面を閉じてしまった場合でも、処理自体は最後まで走り続けるため、「中断される」ことはありません。

---

## まとめ

- **バックグラウンドで完了させたい非同期処理**は、ウィジェット依存の `ref` や `context` の外（StateNotifierや別クラス）で扱う  
- ウィジェットは「開始ボタンを押す / パラメータを取得する / 結果を受け取ってUIに反映するだけ」の役割にする  
- こうすることで、  
  - BottomSheet（ウィジェット）が消えても処理は**中断されず**に続行できる  
  - `StateError (Bad state: Cannot use "ref" after the widget was disposed.)` のようなエラーも避けられる  

以上で、**「showModalBottomSheetが閉じたとしても残りの処理は全部やりきる」** 実装パターンが実現できます。

---

## 👤 ユーザー
*2025/2/8 13:09:30*

やっぱり、ローディング中はshowModalBottomSheetを閉じられなくしたい。showModalBottomSheet の isDismissible: false, // スワイプでの閉じる操作を無効
  enableDrag: false,    // 下方向スワイプでのドラッグ動作を無効などをローディング中は止めることはできないのか？UXの観点で基本的にはできるようにしておいて、ローディング中のみ向こうにしたい

---

## 🔧 ツール
*2025/2/8 13:10:12*

**設定の工夫を探る**

showModalBottomSheetのisDismissibleとenableDragを動的に切り替える方法を模索中。WillPopScopeを活用し、isLoadingがtrueなら未来の値をfalse、falseならtrueにしている。その方法は少し複雑ですが、少しずつ解決策が見えてきている。

**探索中の解決策**

WillPopScopeを活用し、表示中のshowModalBottomSheetのisDismissible属性を動的に変える方法を模索中。手作業での操作や別のオーバーレイを利用するアプローチも検討中。

**進行中の対応策模索**

isLoadingがfalseならデフォルト設定で表示し、trueならWillPopScopeでポップ操作を取り扱い、ドラッグジェスチャーを無効にしている。こうやってUXを損なわないようにしているんだ。

**工夫を凝らす**

isLoadingがtrueのときはAbsorbPointerを使ってユーザー入力をブロックし、WillPopScopeでシステムバックボタンを抑制中。ドラッグの取り扱いも工夫しているところだ。

**カスタム囚人範囲の作成**

isLoadingがfalseのときにのみスワイプでシートを閉じるには、カスタムのページルートを作成するか、アニメーションを上書きする方法を検討している。

**複数の方法を探る**

isLoadingがtrueのときWillPopScopeを活用し、スワイプを無効にするか、ポインターイベントをブロックする方法を模索している。

**スクリーンショットの提案**

問題を整理し、`isDismissible`を`false`にし、`enableDrag`も`false`にすると良い。子ウィジェットのビルドメソッドで、非読み込み時にクローズボタンを表示。

**簡単な解決策を見つける**

isLoadingがfalseのときにのみクローズボタンを表示し、trueなら無効にする方法が、一番シンプルかつユーザーのリクエストに一致している。

**試してみるのが面白い**

isLoadingがfalseのときにのみクローズボタンを表示し、ポインターイベントをブロックする方法を検討中。テストしながら答えを探しているところ。

**アプローチを模索する**

isLoadingがfalseのときにのみクローズボタンを表示し、trueのときは無効にする方法を検討中。これが最もシンプルでユーザーのリクエストに適合している。

**スワイプを無効化している**

isLoadingがtrueのときはスワイプを無効化し、falseになったらWebViewを再読み込みしている。これで効率的にスワイプ操作が制御できる。

**スワイプ操作の制御**

`isDismissible`と`enableDrag`を`true`に設定し、`isLoading`が`true`のときに`WillPopScope`でポップを制限している。

---

## 🤖 アシスタント
*2025/2/8 13:10:12*

結論から言うと、**Flutter標準の `showModalBottomSheet` で `isDismissible` や `enableDrag` を、**  
**「表示後に動的に切り替える」ことはサポートされていません。**  
そのため、単純に「ロード中だけ `isDismissible: false` / `enableDrag: false` にして、ロード完了後は `true` に戻す」といったことは、**標準APIでは実現が難しい**です。

---

# なぜ動的切り替えできない？
- `showModalBottomSheet` は **`ModalBottomSheetRoute`** という `Route` を生成していますが、`isDismissible` や `enableDrag` は  
  **「その `Route` を生成するときのパラメータ」** として渡され、  
  **表示後に更新する仕組みは用意されていません**。  
- `setState` で `true/false` を切り替えても、**すでに作られたRouteの設定を動的に書き換えることはできない** 仕様になっています。

---

# 一般的な対処パターン

## パターンA: 常に `isDismissible: false` / `enableDrag: false` にして、ボタンで閉じる
もっとも単純なのは、**BottomSheet全体を「スワイプで閉じられない」** 設定にしてしまい、  
代わりに上部の×ボタン（Closeボタン）でユーザーに閉じてもらう形です。

- `showModalBottomSheet` 側では：
  ```dart
  showModalBottomSheet(
    context: context,
    isDismissible: false,
    enableDrag: false,
    builder: (context) {
      return const MyBottomSheetContent();
    },
  );
  ```
- BottomSheet内部のAppBarなどにあるCloseボタンで `context.pop()` を呼ぶ。  
- 「ロード中だけはボタンを無効にする」(onPressedを `null` にする) ことで、ロード中は閉じられないようにする

```dart
AppBar(
  title: const Text('Title'),
  actions: [
    IconButton(
      onPressed: isLoading
          ? null       // ローディング中なら押せない
          : () => context.pop(),
      icon: const Icon(Icons.close),
    ),
  ],
),
```

### メリット
- 実装が非常にシンプル。  
- ユーザーが「スワイプ」で閉じる操作を行わないため、ロード中だけ別途制御する必要がない。

### デメリット
- ローディング中以外でも、**ユーザーがスワイプで閉じる** UI操作に対応できない。  
- UX面で「スワイプで閉じたい派」のユーザーを逃してしまうかもしれない。

---

## パターンB: カスタム実装 or サードパーティ`modal_bottom_sheet`パッケージを使う
もし「通常時はスワイプで閉じられるが、ロード中は閉じられない」動きをしたい場合、  
- **Flutter標準ではなく、カスタムRoute実装** もしくは
- `modal_bottom_sheet` パッケージなどサードパーティ実装

を利用する必要があります。

### 1. `modal_bottom_sheet` パッケージ利用
`modal_bottom_sheet` (https://pub.dev/packages/modal_bottom_sheet) は、  
標準の `showModalBottomSheet` より細かいカスタマイズが可能なライブラリです。  

たとえば `showCupertinoModalBottomSheet` や `showMaterialModalBottomSheet` などで「ドラッグ許可/不許可」「戻るボタンの挙動」などを細かく制御できます。  
`isDraggable: false` を動的に切り替えたい、といった実装をする際には、このパッケージの`ModalBottomSheetRoute`を継承し、`setState` でフラグを切り替える実装を自作する…といった形が（やや高度ですが）可能になります。

### 2. 独自の `PageRoute` を自作
- `ModalBottomSheetRoute` を参考に、**独自のPageRouteを作る**  
- 「スワイプで閉じる」かどうかを、`GestureDetector` 等で動的に制御できるように実装する  
- ローディング時だけ`onVerticalDragUpdate`を無効化したり、`Navigator.pop`をブロックしたりする  

標準の仕組みから外れるため、**それなりにコード量も多く、メンテナンスが大変** になります。

---

## まとめ: 一番シンプルな実現方法
「通常はスワイプで閉じられるが、ロード中だけ閉じられないようにしたい」という場合に、**標準の`showModalBottomSheet`では**基本的に実現が難しいです。  

最も簡単な設計は

1.  **常に `isDismissible: false` / `enableDrag: false`**  
2.  **ロード中以外はCloseボタンを使ってユーザーが手動で閉じられる**  
   - ロード中は `onPressed: null` にして無効化

というアプローチです。これなら

- **ロード中は絶対閉じられない**  
- **ロード完了後だけ、明示的にボタンで閉じられる**  

という要件が満たせます（ただしスワイプはできない）。

もし「ローディングが終わった後は、スワイプ閉じ対応にしたい！」というUXを強く求めるなら、下記のどちらかになります：

- **(a)** 「ロード完了後にいったんBottomSheetを閉じて、新しいBottomSheetを`isDismissible: true` / `enableDrag: true`で開く」  
- **(b)** `modal_bottom_sheet` パッケージや独自Routeを作り、**表示中に動的にドラッグ可否を切り替えられるようにカスタマイズ**する

標準機能だけでは `(a)` のように**いったん閉じて作り直す**か、あるいは「最初から最後まで `isDismissible: false` でボタン閉じのみ」にするか、の2択が最もシンプルな実装パターンです。

---

## 👤 ユーザー
*2025/2/8 16:14:23*

ExplorerUseCaseNotifierを作りたい。リバーポッドアノテーションがよい

---

## 🔧 ツール
*2025/2/8 16:14:58*

**Riverpodの利用確認**

Riverpod Annotationsを使って`ExplorerUseCaseNotifier`を作成する方法を探し中。`Notifier`と`AsyncNotifier`の違いを検討し、`ExplorerUseCaseState`の定義を指定している。

**状態管理の定義**

`ExplorerUseCaseState`を定義し、`isLoading`、`error`、`exploredSpotList`の状態を管理。`copyWith`メソッドを使って状態の更新を行っている。

**エクスプローラの開始をサポート**

`ExplorerUseCaseNotifier`を`@riverpod`アノテーションを使って定義し、`startExplore`メソッドでエクスプローラの開始をサポートしている。

**エクスプローラの進行状況を管理**

`ExplorerUseCaseState`クラスは、ロード状態、エラー、エクスプローラされたスポットリストの3つの主要属性を持ち、状態の更新が容易に行える。

**エクスプローラの状態管理**

`ExplorerUseCaseNotifier`は`ExplorerUseCaseState`を使用してエクスプローラの状態を管理し、`startExplore`メソッドでエクスプローラの開始をサポートしている。

**エクスプローラの状態管理**

`AutoDisposeNotifierProvider`で`ExplorerUseCaseNotifier`の状態を管理し、`@riverpod`アノテーションを使って`explorerUseCaseNotifierProvider`を定義している。

---

## 🤖 アシスタント
*2025/2/8 16:14:58*

以下は、**Riverpod Annotations (Riverpod Generator)** を使って `ExplorerUseCaseNotifier` を実装する例です。  
`onExploringNotifierProvider` などの既存プロバイダとの連携もしやすく、**BottomSheet(Widget) と処理実装を分離** しやすくなります。

---

## 1. ファイル構成例

例えば次のようにファイルを分けるとスッキリします。

```
lib/
  presentation/
    pages/
      explorer_list_page.dart    // BottomSheetなどの画面
    providers/
      explorer_use_case_notifier.dart // 以下のコード例 (Riverpodアノテーション)
      explorer_use_case_notifier.g.dart
    // 他...
  // 他のドメイン層, インフラ層, utilsなど
```

---

## 2. `explorer_use_case_notifier.dart` のサンプルコード

```dart
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:snpit_guild_app/infrastructure/snapit_guild_api/snapit_guild_api.openapi.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/explorers/update_explorer.dart';
import 'package:snpit_guild_app/presentation/providers/on_exploring.dart';

// Riverpod Generatorで必要
part 'explorer_use_case_notifier.g.dart';

/// 探索処理の状態を保持するクラス
/// - [isLoading]: ローディング中かどうか
/// - [error]: エラーがある場合 (nullでなければエラー状態)
/// - [exploredSpotList]: 探索後に取得するスポット情報など
class ExplorerUseCaseState {
  final bool isLoading;
  final Object? error;
  final List<SpotDTO> exploredSpotList;

  const ExplorerUseCaseState({
    required this.isLoading,
    this.error,
    required this.exploredSpotList,
  });

  ExplorerUseCaseState copyWith({
    bool? isLoading,
    Object? error,
    List<SpotDTO>? exploredSpotList,
  }) {
    return ExplorerUseCaseState(
      isLoading: isLoading ?? this.isLoading,
      // errorはnullで上書きしたいケースもあるので、呼び出し側で必要に応じてnullを渡せるようにする
      error: error,
      exploredSpotList: exploredSpotList ?? this.exploredSpotList,
    );
  }
}

///
/// Riverpodアノテーションで Notifierクラスを宣言
///
/// 生成後に `explorerUseCaseNotifierProvider` というプロバイダが使えるようになります。
///
@riverpod
class ExplorerUseCaseNotifier extends _$ExplorerUseCaseNotifier {
  /// 初期状態 (buildメソッドで定義)
  @override
  ExplorerUseCaseState build() {
    return const ExplorerUseCaseState(
      isLoading: false,
      exploredSpotList: [],
    );
  }

  ///
  /// 探索処理開始
  ///
  /// - [explorerId], [currentLocation], [selectedExplorer] あたりを受け取って処理する例
  ///
  Future<void> startExplore({
    required int explorerId,
    required LocationDTO currentLocation,
    required ExplorerDTO selectedExplorer,
  }) async {
    // ローディング開始
    state = state.copyWith(isLoading: true, error: null);

    try {
      // 任意の処理 (APIコールなど)
      final exploredSpotList = await ref
          .read(updateExplorerNotifierProvider.notifier)
          .explore(explorerId, currentLocation);

      // 結果を state に反映
      state = state.copyWith(
        isLoading: false,
        exploredSpotList: exploredSpotList,
      );

      // onExploringNotifierProvider で探索開始のステート更新
      ref.read(onExploringNotifierProvider.notifier).startExploring(
        selectedExplorer,
        exploredSpotList,
      );
    } catch (e) {
      // エラー時
      state = state.copyWith(
        isLoading: false,
        error: e, // エラー情報を持たせる
      );
    }
  }

  ///
  /// エラーをクリアなど、状態をリセットしたいメソッドがあれば定義
  ///
  void clearError() {
    state = state.copyWith(error: null);
  }
}
```

### ビルドスクリプトの実行

`@riverpod` アノテーションを使うので、以下のコマンドでコード生成が必要です。

```bash
flutter pub run build_runner build --delete-conflicting-outputs
```

これにより `explorer_use_case_notifier.g.dart` が生成され、  
`explorerUseCaseNotifierProvider` という **`AutoDisposeNotifierProvider<ExplorerUseCaseNotifier, ExplorerUseCaseState>`** が使えるようになります。

---

## 3. 使う側（例：BottomSheetの画面）での利用

```dart
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

// 先ほど作ったexplorer_use_case_notifier.dart をimport
import 'package:snpit_guild_app/presentation/providers/explorer_use_case_notifier.dart';
import 'package:snpit_guild_app/utils/snack_bar_utils.dart';
// その他必要なimport...

class ExplorerListPage extends HookConsumerWidget {
  const ExplorerListPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // ① ExplorerUseCaseのstateを購読
    final explorerUseCaseState = ref.watch(explorerUseCaseNotifierProvider);
    // ローディング中かどうか
    final isLoading = explorerUseCaseState.isLoading;
    final error = explorerUseCaseState.error;

    // ② onExploring の isExploring 状態も必要なら購読
    final isExploring = ref.watch(onExploringNotifierProvider).isExploring;

    // ... 画面UI (CarouselSliderなど) は省略 ...

    Future<void> onTapStartExplore() async {
      try {
        // ここで必須情報を取得 (ex: 選択中ExplorerId, 位置情報など)
        final explorerId = 123; // 適宜取得
        final currentLocation = ...;
        final selectedExplorer = ...;

        // ExplorerUseCaseNotifier へ探索処理を依頼
        await ref
            .read(explorerUseCaseNotifierProvider.notifier)
            .startExplore(
              explorerId: explorerId,
              currentLocation: currentLocation,
              selectedExplorer: selectedExplorer,
            );

        // 処理が完了したらBottomSheetを閉じる (ロード終わるまで閉じられないようにするなら後述のAppBar制御)
        if (context.mounted) {
          context.pop();
        }
      } catch (e) {
        // 位置情報取得やその他で例外が出た場合
        if (context.mounted) {
          showErrorSnackBar(context, e);
        }
      }
    }

    // ③ エラーがあるならSnackBarなどで表示 (タイミングは適宜)
    useEffect(() {
      if (error != null && context.mounted) {
        showErrorSnackBar(context, error);
        // 必要ならclear
        ref.read(explorerUseCaseNotifierProvider.notifier).clearError();
      }
      return;
    }, [error]);

    return Scaffold(
      appBar: AppBar(
        // ---- ローディング中は閉じられないようにする
        automaticallyImplyLeading: false,
        title: const Text('Select explorer'),
        actions: [
          IconButton(
            onPressed: isLoading
                ? null // ロード中は無効にする
                : () => context.pop(),
            icon: const Icon(Icons.close),
          ),
        ],
      ),
      body: Stack(
        children: [
          // 実際のリストUIなど
          const Center(child: Text('Content...')),
          // ロード中ならインジケータ表示など
          if (isLoading) const Center(child: CircularProgressIndicator()),
        ],
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: ElevatedButton(
            onPressed: isLoading
                ? null // ローディング中は押せない
                : onTapStartExplore,
            child: const Text('Start explore'),
          ),
        ),
      ),
    );
  }
}
```

### ポイント

1. **`explorerUseCaseNotifierProvider`** (自動生成されたプロバイダ) を `ref.watch(...)` して現在の`ExplorerUseCaseState`を取得  
2. `startExplore` メソッドを呼び出すと非同期処理が始まり、`isLoading: true` になってUI反映  
3. ロード中はボタンやCloseボタンを無効にしておく→**ユーザーが BottomSheet を閉じれない**  
   - `context.pop()` は **ロード完了後** のタイミングで行う  
4. エラーがあれば `error` が更新されるので、UI側でSnackBarなどを表示

---

## 4. `showModalBottomSheet` の設定でローディング中は閉じられなくする

### 常に `isDismissible: false, enableDrag: false` にする場合

```dart
await showModalBottomSheet(
  context: context,
  isDismissible: false, // スワイプ操作を無効
  enableDrag: false,    // ドラッグによるスワイプ閉じを無効
  builder: (context) {
    return const ExplorerListPage();
  },
);
```

そして `ExplorerListPage` の `AppBar` のCloseボタン押下で `context.pop()`。  
「ローディング中だけは onPressed を `null` にする」ことで、**ロード中は絶対に閉じられない** 形になります。

### 通常はスワイプ閉じOK、ロード中だけダメ
- 残念ながら、**標準の `showModalBottomSheet` では後から `isDismissible` や `enableDrag` を動的に切り替えることはできません**。  
- 「ロード中はダメ、ロード完了後はOK」にしたいなら、サードパーティ(`modal_bottom_sheet`パッケージ)を使うか、  
  あるいは最初から**スワイプ閉じはさせず、Closeボタン経由のみ**という設計が最もシンプルです。

---

# まとめ

- **Riverpod Annotations** を使うと、`@riverpod` 付けた Notifierクラスを定義 → `flutter pub run build_runner build` で自動生成されたプロバイダを使えるようになります。  
- `ExplorerUseCaseNotifier` に探索処理のロジックを集約し、UI（BottomSheetなど）からは「ボタン押下で処理開始」「StateをwatchしてUI反映」というシンプルな形にできる。  
- 「ロード中は `showModalBottomSheet` を閉じられなくする」には、  
  - **`isDismissible: false`, `enableDrag: false`** でスワイプ閉じを無効化し、  
  - **ロード中はCloseボタンも押せなくする**  
  という方法がもっとも実装が簡単で確実です。  

このように**UIロジックと非同期処理(UseCase)を分離**して管理することで、可読性・拡張性の高いコードになります。ぜひ参考にしてみてください。

---
