# Incorrect ParentDataWidget Usage

Date: 2025-02-01

---

## 👤 User
*2025-02-01 15:07:43*

以下の画面を表示したときに以下のエラーになる

════════ Exception caught by widgets library ═══════════════════════════════════


Incorrect use of ParentDataWidget.


════════════════════════════════════════════════════════════════════════════════


import 'package:auto_size_text/auto_size_text.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:snpit_guild_app/domain/design/color_pallet.dart';
import 'package:snpit_guild_app/domain/design/color_token.dart';
import 'package:snpit_guild_app/gen/assets.gen.dart';
import 'package:snpit_guild_app/infrastructure/snapit_guild_api/snapit_guild_api.openapi.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/users/nfts/get_nfts.dart';
import 'package:snpit_guild_app/presentation/widgets/square_image.dart';

enum NftType {
  explorer,
  flag,
}

class NFT {
  NFT({
    required this.nftId,
    required this.tokenId,
    required this.name,
    required this.imageUrl,
    required this.nftType,
    this.explorer,
    this.flag,
  });

  final String nftId;
  final String tokenId;
  final String name;
  final String imageUrl;
  final NftType nftType;

  final ExplorerDTO? explorer;
  final FlagDTO? flag;
}

class WalletPage extends HookConsumerWidget {
  const WalletPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    Future&lt;void&gt; onTapNft(NFT nft) async {
      // TODO: [フェーズ2] NFT 詳細画面への遷移
    }

    Future&lt;void&gt; onTapWalletId(String walletId) async {
      await Clipboard.setData(ClipboardData(text: walletId));

      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('$walletId copied to clipboard')),
        );
      }
    }

    final getNftsStateAsyncValue = ref.watch(getNftsNotifierProvider);

    useEffect(
      () {
        Future.microtask(() async {
          await ref.read(getNftsNotifierProvider.notifier).getNfts();
        });
        return null;
      },
      [],
    );

    return Scaffold(
      appBar: AppBar(title: const Text('Wallet')),
      body: getNftsStateAsyncValue.when(
        data: (data) {
          if (data == null) {
            return const Center(child: Text('No data available'));
          }

          final stpValue = data.stp ?? 0;
          final walletId = data.wallet ?? '';

          final explorers = data.explorers ?? [];
          final flags = data.flags ?? [];

          final explorerNfts = explorers.map((explorer) {
            return NFT(
              nftId: explorer.explorerId ?? '',
              tokenId: explorer.tokenId ?? '',
              name: explorer.explorerName ?? '',
              imageUrl: explorer.explorerImage ?? '',
              nftType: NftType.explorer,
              explorer: explorer,
            );
          }).toList();

          final flagNfts = flags.map((flag) {
            return NFT(
              nftId: flag.flagId ?? '',
              tokenId: flag.tokenId ?? '',
              name: flag.flagName ?? '',
              imageUrl: flag.flagImage ?? '',
              nftType: NftType.flag,
              flag: flag,
            );
          }).toList();

          final allNfts = [
            ...explorerNfts,
            ...flagNfts,
          ];

          return SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Column(
                    children: [
                      DecoratedBox(
                        decoration: BoxDecoration(
                          color: ColorToken.bg,
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(
                            color: ColorToken.border,
                          ),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(24),
                          child: Expanded(
                            child: Column(
                              children: [
                                Image.asset(
                                  Assets.images.stpCoinIcon.path,
                                  width: 32,
                                  height: 32,
                                ),
                                const SizedBox(height: 14),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  crossAxisAlignment:
                                      CrossAxisAlignment.baseline,
                                  textBaseline: TextBaseline.alphabetic,
                                  children: [
                                    Flexible(
                                      child: AutoSizeText(
                                        stpValue.toString(),
                                        style: const TextStyle(
                                          fontSize: 32,
                                          fontWeight: FontWeight.bold,
                                        ),
                                        maxLines: 1,
                                        minFontSize: 1,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ),
                                    const SizedBox(width: 6),
                                    const Text(
                                      'STP',
                                      style: TextStyle(
                                        fontSize: 16,
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 24),
                                GestureDetector(
                                  onTap: () async {
                                    await onTapWalletId(walletId);
                                  },
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 10,
                                      vertical: 5,
                                    ),
                                    decoration: BoxDecoration(
                                      color: ColorPallet.gray800,
                                      borderRadius: BorderRadius.circular(4),
                                    ),
                                    child: Text(
                                      walletId,
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                      style: const TextStyle(
                                        fontSize: 13,
                                        color: ColorToken.primaryDark,
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // NFTs
                  const Text(
                    'NFTs',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),

                  if (allNfts.isEmpty)
                    const Center(child: Text('No NFTs owned')),

                  Column(
                    children: allNfts.map((nft) {
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          // TODO: [フェーズ2] NFT 詳細画面への遷移（リップルに変更する）
                          // child: Ink(
                          child: DecoratedBox(
                            decoration: BoxDecoration(
                              color: ColorToken.bg,
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(
                                color: ColorToken.border,
                              ),
                            ),
                            child: InkWell(
                              borderRadius: BorderRadius.circular(8),
                              onTap: () async {
                                await onTapNft(nft);
                              },
                              child: Padding(
                                padding: const EdgeInsets.all(16),
                                child: Row(
                                  children: [
                                    ClipRRect(
                                      borderRadius: BorderRadius.circular(4),
                                      child: SquareImage(
                                        imageUrl: nft.imageUrl,
                                        size: 56,
                                      ),
                                    ),
                                    const SizedBox(width: 16),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Row(
                                            children: [
                                              Flexible(
                                                child: Text(
                                                  nft.name,
                                                  maxLines: 1,
                                                  overflow:
                                                      TextOverflow.ellipsis,
                                                  style: const TextStyle(
                                                    fontSize: 14,
                                                    fontWeight: FontWeight.bold,
                                                  ),
                                                ),
                                              ),
                                              const SizedBox(width: 4),
                                              Flexible(
                                                child: Text(
                                                  '#${nft.nftId}',
                                                  maxLines: 1,
                                                  overflow:
                                                      TextOverflow.ellipsis,
                                                  style: const TextStyle(
                                                    fontSize: 12,
                                                    fontWeight: FontWeight.bold,
                                                    color: ColorPallet.gray300,
                                                  ),
                                                ),
                                              ),
                                            ],
                                          ),
                                          const SizedBox(height: 12),
                                          Text(
                                            'TokenID: ${nft.tokenId}',
                                            maxLines: 1,
                                            overflow: TextOverflow.ellipsis,
                                            style: const TextStyle(
                                              fontSize: 12,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    // TODO: [フェーズ2] NFT 詳細画面への遷移
                                    // const Icon(
                                    //   Icons.chevron_right,
                                    //   size: 32,
                                    //   color: ColorToken.text,
                                    // ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 24),
                ],
              ),
            ),
          );
        },
        loading: () {
          return const Center(
            child: CircularProgressIndicator(),
          );
        },
        error: (error, _) {
          return Center(
            child: Text('Error: $error'),
          );
        },
      ),
    );
  }
}

---

## 🔧 Tool
*2025-02-01 15:07:56*

**Diagnosing expansion misuse**

I noticed that `Expanded` is being used outside of a `Flex` widget, like `Padding` or `DecoratedBox`, which is causing the "Incorrect use of ParentDataWidget" error. Replacing or removing it seems essential.

**Noticing misplaced expansion**

I observed that the `Expanded` widget is nested within a `Padding`, which is incorrect since it must be a child of a `Flex` widget. The immediate solution is to either remove or relocate it.

**Reordering elements**

I'm thinking about the widget hierarchy: `Column`, `DecoratedBox`, `Padding`, `Expanded`, and another `Column`. The `Expanded` widget directly belongs to a `Flex` widget's parent, not `Padding` or `DecoratedBox`.

**Evaluating fix options**

I’m considering removing the `Expanded` widget or enveloping the parent with a `Row` or `Column` to ensure the `DecoratedBox` handles horizontal space expansion correctly.

**Mapping dependencies**

I’m analyzing the structure: a `Column` containing another `Column`, which includes a `DecoratedBox`, a `Padding`, and an `Expanded` widget with a `Column` child. The `Expanded` widget seems misplaced under `DecoratedBox`.

---

## 🤖 Assistant
*2025-02-01 15:07:56*

「Incorrect use of ParentDataWidget.」というエラーは、主に **`Expanded` ウィジェットを `Row` や `Column` など適切な親（Flex系のウィジェット）の直下で使っていない** ことが原因で発生します。

現状のコードでは、以下の箇所に問題があります（抜粋）:

```dart
DecoratedBox(
  decoration: BoxDecoration(
    ...
  ),
  child: Padding(
    padding: const EdgeInsets.all(24),
    child: Expanded(       // ← DecoratedBox → Padding → Expanded という階層が原因
      child: Column(
        ...
      ),
    ),
  ),
),
```

`Expanded` は、`Row` や `Column` / `Flex` ウィジェットの直下でのみ有効です。ところが、現在は `Expanded` の親が `Padding`（さらにその親が `DecoratedBox`）になっており、Flex系ウィジェットの直接の子ではありません。そのため「Incorrect use of ParentDataWidget.」というエラーが出ています。

## 修正例

### 方法1: `Expanded` を削除する

もし「単にコンテンツを縦に並べたいだけ」であれば、`Expanded` は不要です。`Expanded` を取り除いても縦方向に自動で拡張されます。

```dart
DecoratedBox(
  decoration: BoxDecoration(
    color: ColorToken.bg,
    borderRadius: BorderRadius.circular(8),
    border: Border.all(
      color: ColorToken.border,
    ),
  ),
  child: Padding(
    padding: const EdgeInsets.all(24),
    child: Column(
      children: [
        Image.asset(
          Assets.images.stpCoinIcon.path,
          width: 32,
          height: 32,
        ),
        const SizedBox(height: 14),
        Row(
          ...
        ),
        // 省略
      ],
    ),
  ),
),
```

### 方法2: 親を `Column`/`Row` にする

もし画面全体の中で「特定の領域だけを `Expanded` させたい」などレイアウト上の理由がある場合は、`Expanded` の親を `Column` か `Row`（または `Flex`）にする必要があります。たとえば、以下のように「外側を `Column` にして、その子に `Expanded` がある」構造ならエラーは起きません。

```dart
// 親が Column になっている例
Column(
  children: [
    DecoratedBox(
      decoration: BoxDecoration(
        ...
      ),
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            ...
          ],
        ),
      ),
    ),
    // Expanded で包みたいウィジェットを Column の直接の子として置く
    Expanded(
      child: Container(
        color: Colors.red,
        // ...
      ),
    ),
  ],
);
```

---

いずれにせよ「**`Expanded` は Flex (`Row`, `Column`, `Flex` など) の直下に置く必要がある**」という点が重要です。今回のケースでは、単純に `Expanded` を外してしまうか、レイアウトの意図に合わせて親を `Column`/`Row` に修正することでエラーを解消できます。

---
