# ParentDataWidget エラー修正

日付: 2025-02-06

---

## 👤 ユーザー
*2025/2/6 14:21:55*

この画面で以下のエラーが出る。
おそらくフラグ周りの実装である。

════════ Exception caught by widgets library ═══════════════════════════════════


Incorrect use of ParentDataWidget.


════════════════════════════════════════════════════════════════════════════════
  
import 'package:cached\_network\_image/cached\_network\_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter\_hooks/flutter\_hooks.dart';
import 'package:go\_router/go\_router.dart';
import 'package:hooks\_riverpod/hooks\_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:snpit\_guild\_app/domain/design/color\_pallet.dart';
import 'package:snpit\_guild\_app/domain/design/color\_token.dart';
import 'package:snpit\_guild\_app/domain/rarity.dart';
import 'package:snpit\_guild\_app/domain/screen.dart';
import 'package:snpit\_guild\_app/gen/assets.gen.dart';
import 'package:snpit\_guild\_app/infrastructure/entities/extensions/convert\_to\_domain.dart';
import 'package:snpit\_guild\_app/infrastructure/snapit\_guild\_api/snapit\_guild\_api.openapi.dart';
import 'package:snpit\_guild\_app/presentation/providers/api\_client/guilds/get\_guild.dart';
import 'package:snpit\_guild\_app/presentation/providers/api\_client/guilds/spots/get\_guild\_spot.dart';
import 'package:snpit\_guild\_app/presentation/providers/show\_spot\_list.dart';
import 'package:snpit\_guild\_app/presentation/widgets/spot\_photo\_carousel.dart';
import 'package:snpit\_guild\_app/utils/snack\_bar\_utils.dart';

class OurSpotDetailPage extends HookConsumerWidget {
  const OurSpotDetailPage({super.key, required this.spotId});
  final String spotId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final myGuildName =
        ref.watch(getMyGuildNotifierProvider).value?.guildName ?? 'Unknown';
    final showSpotListStateValue = ref.watch(showSpotListNotifierProvider);
    final guildSpotAsyncValue = ref.watch(getGuildSpotNotifierProvider);

    Future&lt;void&gt; onRefresh() async {
      try {
        final myGuild =
            await ref.read(getMyGuildNotifierProvider.notifier).getMyGuild();

        final myGuildId = myGuild?.guildId;

        // ギルドに所属している場合のみこの画面に訪れることができるため以下のハンドリングが必要
        if (myGuildId != null) {
          await ref
              .read(getGuildSpotNotifierProvider.notifier)
              .getGuildSpot(myGuildId, spotId);
        }
      } on Exception catch (error) {
        if (context.mounted) {
          showErrorSnackBar(context, error);
        }
      }
    }

    Future&lt;void&gt; onTapFlag() async {
      await context.push(Screen.flagList.path, extra: spotId);

      // フラグを立てた後に SpotDetail を再取得する
      await onRefresh();
    }

    useEffect(
      () {
        Future.microtask(() async {
          await onRefresh();
        });
        return null;
      },
      \[\],
    );

    return Scaffold(
      appBar: AppBar(
        // SpotList 画面からの遷移時のみ戻るボタンを表示
        leading: showSpotListStateValue
            ? IconButton(
                icon: const Icon(Icons.arrow\_back),
                onPressed: () async {
                  context.pop();
                },
              )
            : null,
        title: const Text('Our spot'),
        actions: \[
          IconButton(
            icon: const Icon(Icons.close),
            onPressed: () async {
              // ボトムシート全体を閉じる
              Navigator.of(context, rootNavigator: true).pop();
            },
          ),
        \],
      ),
      body: guildSpotAsyncValue.when(
        loading: () {
          return const Center(child: CircularProgressIndicator());
        },
        error: (error, \_) {
          return Center(
            child: Text('Error: $error'),
          );
        },
        data: (guildSpot) {
          if (guildSpot == null) {
            return const Center(child: Text('No data'));
          }

          final spotPhotoItems = guildSpot.spotPhotos
                  ?.where((photo) =&gt; photo.photoUrl != null)
                  .map(
                    (photo) =&gt; SpotPhotoItem(
                      photoId: photo.photoId!,
                      spotPhotoUrl: photo.photoUrl!,
                      spotOwnership: SpotOwnership.owner,
                    ),
                  )
                  .toList() ??
              \[\];

          final autoIncomeLabel = guildSpot.autoIncome != null
              ? '${NumberFormat('#,###').format(guildSpot.autoIncome)} STP'
              : '0 STP';
          final rarityLabel = guildSpot.rarity?.domainRarity.label ?? '';
          final rarityColor =
              guildSpot.rarity?.domainRarity.color ?? ColorToken.border;
          final flag = guildSpot.flags?.firstOrNull;

          final items = \[
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Row(
                children: \[
                  const Expanded(
                    child: Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        'Production output',
                        style: TextStyle(fontSize: 14),
                      ),
                    ),
                  ),
                  Expanded(
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: \[
                        Column(
                          mainAxisSize: MainAxisSize.min,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: \[
                            Text(
                              autoIncomeLabel,
                              style: const TextStyle(fontSize: 14),
                            ),
                            const SizedBox(height: 4),
                            const Text(
                              'every 24 hours',
                              style: TextStyle(
                                fontSize: 12,
                                color: ColorToken.border,
                              ),
                            ),
                          \],
                        ),
                        CircleAvatar(
                          backgroundColor: ColorPallet.gray1000,
                          child: Text(
                            rarityLabel,
                            style: TextStyle(
                              fontSize: 18,
                              color: rarityColor,
                            ),
                          ),
                        ),
                      \],
                    ),
                  ),
                \],
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Row(
                children: \[
                  const Expanded(
                    child: Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        'Holder',
                        style: TextStyle(fontSize: 14),
                      ),
                    ),
                  ),
                  Expanded(
                    child: Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        myGuildName,
                        style: const TextStyle(fontSize: 14),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ),
                \],
              ),
            ),
          \];

          return SingleChildScrollView(
            padding: const EdgeInsets.symmetric(vertical: 16),
            child: Column(
              children: \[
                SpotPhotoCarousel(spotPhotoItems: spotPhotoItems),
                const SizedBox(height: 32),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: DecoratedBox(
                    decoration: BoxDecoration(
                      color: ColorToken.bg,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(
                        color: ColorToken.border,
                      ),
                    ),
                    child: SizedBox(
                      width: double.infinity,
                      height: 90,
                      child: Material(
                        color: Colors.transparent,
                        child: InkWell(
                          onTap: () async {
                            await onTapFlag();
                          },
                          child: Padding(
                            padding: const EdgeInsets.all(16),
                            child: flag == null
                                ? const NoFlagRow()
                                : FlagRow(flag: flag),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: DecoratedBox(
                    decoration: BoxDecoration(
                      color: ColorToken.bg,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(
                        color: ColorToken.border,
                      ),
                    ),
                    // ListView.separated() で実装すると最後の要素に謎の余白が生じたため Column で実装
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: List.generate(
                        items.length,
                        (index) =&gt; Column(
                          children: \[
                            SizedBox(
                              height: 64,
                              child: Center(child: items\[index\]),
                            ),
                            if (index &lt; items.length - 1)
                              Container(
                                height: 1,
                                color: ColorToken.border,
                              ),
                          \],
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 32),
              \],
            ),
          );
        },
      ),
    );
  }
}

class NoFlagRow extends StatelessWidget {
  const NoFlagRow({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return const Row(
      children: \[
        CircleAvatar(
          radius: 28,
          backgroundColor: ColorPallet.green500,
          child: Icon(
            Icons.flag,
            size: 24,
            color: ColorPallet.green100,
          ),
        ),
        SizedBox(width: 16),
        Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: \[
            Text(
              'No flag',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 4),
            Text(
              'Flag and defend your spot against'
              '\\nenemy attacks!',
              style: TextStyle(
                fontSize: 12,
              ),
            ),
          \],
        ),
        Spacer(),
        Icon(
          Icons.arrow\_forward,
          size: 24,
          color: ColorToken.text,
        ),
      \],
    );
  }
}

class FlagRow extends StatelessWidget {
  const FlagRow({
    super.key,
    required this.flag,
  });

  final FlagDTO flag;

  @override
  Widget build(BuildContext context) {
    final photoUrl = flag.flagImage;
    final endurance = flag.endurance ?? 0;
    final fullEndurance = flag.fullEndurance ?? 1;
    final income = flag.flagIncome ?? 0;

    return Expanded(
      child: Row(
        children: \[
          CircleAvatar(
            radius: 28,
            backgroundImage: photoUrl != null
                ? CachedNetworkImageProvider(photoUrl)
                : AssetImage(
                    Assets.images.defaultFlag.path,
                  ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: \[
                Row(
                  children: \[
                    const Text(
                      'Endurance remaining',
                      style: TextStyle(
                        fontSize: 14,
                      ),
                    ),
                    const Spacer(),
                    Row(
                      children: \[
                        Text(
                          NumberFormat('#,###').format(endurance),
                          style: const TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const Text(
                          '/',
                          style: TextStyle(
                            fontSize: 10,
                            color: ColorToken.border,
                          ),
                        ),
                        Text(
                          NumberFormat('#,###').format(fullEndurance),
                          style: const TextStyle(
                            fontSize: 10,
                            color: ColorToken.border,
                          ),
                        ),
                      \],
                    ),
                  \],
                ),
                const SizedBox(height: 4),
                LinearProgressIndicator(
                  value: endurance / fullEndurance,
                  borderRadius: BorderRadius.circular(8),
                  valueColor: const AlwaysStoppedAnimation&lt;Color&gt;(
                    ColorToken.primary,
                  ),
                  backgroundColor: ColorToken.bgDark,
                ),
                const SizedBox(height: 8),
                Row(
                  children: \[
                    const Text(
                      'Defensive incentives',
                      style: TextStyle(
                        fontSize: 12,
                        color: ColorToken.text,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      '${NumberFormat('#,###').format(income)} STP',
                      style: const TextStyle(
                        fontSize: 14,
                        color: ColorToken.text,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  \],
                ),
              \],
            ),
          ),
        \],
      ),
    );
  }
}

---

## 🔧 ツール
*2025/2/6 14:22:23*

\*\*修正を探る\*\*

`FlagRow`ウィジェット内の`Expanded`の使用は誤りで、親ウィジェットが`Row`または`Column`でないとエラーが発生している。親ウィジェットを修正する必要がある。

\*\*確認中の構造\*\*

`FlagRow`が`Padding`から`SizedBox`、`Material`、`InkWell`と内部にネストされている。親ウィジェットの修正を検討中。

\*\*修正を模索\*\*

`Expanded`を`Row`から外すか、親から`Row`を削除している。こんな感じで進めている。

\*\*修正を試みる\*\*

`FlagRow`及び`NoFlagRow`の修正方向を模索中。`Spacer()`の親も`Flex`容器である必要がある。

\*\*親の修正\*\*

`Spacer()`を使うために、`NoFlagRow`の親も`Flex`容器である必要がある。現在の親は`Padding`などだから、これを改善する方向で進めている。

\*\*親を見直し\*\*

`Spacer()`は`Flex`容器の親が必要だから、`Row`を使用しているのは良さそうだね。

\*\*確認中の問題\*\*

`Row`を使っているけど、エラーが発生している。`Expanded`の誤用が原因かもしれない。親の型にも注意が必要かもしれない。

\*\*見直している使用法\*\*

`FlagRow`で`Expanded`を使っているが、親の`Flex`がないためエラーが出ている。親を見直し、`Expanded`の使用を再考している。

\*\*親の見直しと修正\*\*

`FlagRow`の`Expanded`を削除し、`Row`を直接使用している。親の`Flex`がないため、`Row`を直接使う方が適切なのかもしれないね。

\*\*親を見直す\*\*

`Row`自体は`Spacer()`を扱えるが、親の`Flex`がないとエラーになる。親を見直し、`Row`を直接使用するのが適切かも。

\*\*確認中の使用法\*\*  
`Row`は`Spacer()`を扱えるが、親の`Flex`がないとエラーになる。親を見直し、`Row`を直接使用するのが適切かもしれない。

\*\*親子関係の確認\*\*  
`Row`は`Spacer()`を扱えるが、親の`Flex`がないとエラーになる。親を見直し、`Row`を直接使用するのが適切かも。

---

## 🤖 アシスタント
*2025/2/6 14:22:23*

「Incorrect use of ParentDataWidget.」のエラーが出るときは、  
**`Expanded` や `Spacer` といった、`Flex` 系ウィジェット専用の子ウィジェット**  
を、**`Row` や `Column`（`Flex` のサブクラス）以外の親のもとに置いている** ことがほとんどです。

今回のコードで問題になっているのは、`FlagRow` ウィジェットが

```dart
return Expanded(
  child: Row(
    ...
  ),
);
```

のかたちで `Expanded` を返していることです。  
`Expanded` は、**`Row` や `Column`** のような `Flex` ウィジェットの子要素としてのみ使えます。  
しかし `FlagRow` は、上位の階層を見るかぎり

```dart
InkWell(
  child: Padding(
    child: flag == null ? const NoFlagRow() : FlagRow(flag: flag),
  ),
)
```

という構造になっており、`InkWell` / `Padding` / `DecoratedBox` / `SizedBox` などは `Flex` ではないため、`Expanded` を子に置くことができません。

---

## 対応方法

### 1. `Expanded` を取り除く

`FlagRow` での `Expanded` を外して単に `Row` を返すようにします。たとえば以下のように修正してください。

```dart
class FlagRow extends StatelessWidget {
  const FlagRow({
    super.key,
    required this.flag,
  });

  final FlagDTO flag;

  @override
  Widget build(BuildContext context) {
    final photoUrl = flag.flagImage;
    final endurance = flag.endurance ?? 0;
    final fullEndurance = flag.fullEndurance ?? 1;
    final income = flag.flagIncome ?? 0;

    return Row(
      children: [
        CircleAvatar(
          radius: 28,
          backgroundImage: photoUrl != null
              ? CachedNetworkImageProvider(photoUrl)
              : AssetImage(
                  Assets.images.defaultFlag.path,
                ) as ImageProvider,
        ),
        const SizedBox(width: 16),
        Expanded( // ここなら Row (Flex) の子なので OK
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Row(
                children: [
                  const Text(
                    'Endurance remaining',
                    style: TextStyle(
                      fontSize: 14,
                    ),
                  ),
                  const Spacer(),
                  Row(
                    children: [
                      Text(
                        NumberFormat('#,###').format(endurance),
                        style: const TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const Text(
                        '/',
                        style: TextStyle(
                          fontSize: 10,
                          color: ColorToken.border,
                        ),
                      ),
                      Text(
                        NumberFormat('#,###').format(fullEndurance),
                        style: const TextStyle(
                          fontSize: 10,
                          color: ColorToken.border,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 4),
              LinearProgressIndicator(
                value: endurance / fullEndurance,
                borderRadius: BorderRadius.circular(8),
                valueColor: const AlwaysStoppedAnimation<Color>(
                  ColorToken.primary,
                ),
                backgroundColor: ColorToken.bgDark,
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  const Text(
                    'Defensive incentives',
                    style: TextStyle(
                      fontSize: 12,
                      color: ColorToken.text,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    '${NumberFormat('#,###').format(income)} STP',
                    style: const TextStyle(
                      fontSize: 14,
                      color: ColorToken.text,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }
}
```

もともとの実装では `FlagRow` が「自分自身」を `Expanded` で返しているため、  
さらにその親が `Row` や `Column` など **`Flex` を継承するウィジェット** でなければ、  
「`Expanded` を使う位置」が根本的に間違ってしまいます。  

上記のように書き換えれば、

- `Row` → その子要素のひとつとして `CircleAvatar`  
- `SizedBox(width: 16)`  
- `Expanded`（← ただし、これは `Row` の子なので OK）  
- `Column`（こちらは `Expanded` の子）  

という構造になるので、エラーは解消されるはずです。

### 2. `NoFlagRow` 側の `Spacer` など

`NoFlagRow` は

```dart
return const Row(
  children: [
    ...
    Spacer(),
    ...
  ],
);
```

となっていると思います。`Row` は `Flex` のサブクラスなので、そこに `Spacer` を直接置くのは問題ありません。  
（`Spacer` は内部的に `Expanded + SizedBox.shrink()` ですが、 親が `Row` なら OK です。）  

もしこの `NoFlagRow` が「さらに上位の `Column` や `Row` の子」でなく、  
単に `DecoratedBox` や `SizedBox` など（非 `Flex`）の中に置かれているだけであっても、  
**`Row` 自体が `Flex`** なので、行の中で `Spacer` が機能するのは正しいです。  
こちらは特にエラーにならなければ大丈夫です。

---

## まとめ

- 「`Incorrect use of ParentDataWidget.`」エラーが出たときは、  
  **`Expanded` など `Flex` 専用の子ウィジェットを、`Flex` でない親に置いていないか** を最初に疑う
- 修正としては、**`FlagRow` で `Expanded` を返すのをやめ**、  
  親が `Row` や `Column` の場合にのみ `Expanded` などを使うようにする  
- `NoFlagRow` はとりあえず `Row` + `Spacer` で問題ないが、  
  その `Row` の親が `Flex` ウィジェットではないとしても、`Row` 自体が `Flex` のサブクラスなので  
  そこは特に問題なし（エラーが出ていないならOK）

以上の修正によって、エラーは解消されるはずです。

---
