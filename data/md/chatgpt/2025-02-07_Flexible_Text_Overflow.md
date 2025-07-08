# Flexible Text Overflow

日付: 2025-02-07

---

## 👤 ユーザー
*2025/02/07 13:10:37*

以下の部分でnft.nameの部分が今だと半分の表示になってしまうが、これをconst SizedBox(width: 4),と  nft.number,が収まる形で最大限広がって治らない部分はnft.nameを省略したい

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
                                                  nft.number,
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


import 'package:auto_size_text/auto_size_text.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:snpit_guild_app/domain/design/color_pallet.dart';
import 'package:snpit_guild_app/domain/design/color_token.dart';
import 'package:snpit_guild_app/domain/nft.dart';
import 'package:snpit_guild_app/domain/nft_type.dart';
import 'package:snpit_guild_app/gen/assets.gen.dart';
import 'package:snpit_guild_app/infrastructure/snapit_guild_api/snapit_guild_api.openapi.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/users/nfts/get_nfts.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/wallet/get_wallet.dart';
import 'package:snpit_guild_app/presentation/widgets/square_image.dart';
import 'package:snpit_guild_app/utils/snack_bar_utils.dart';

final combinedDataProvider = FutureProvider.autoDispose&lt;
    (
      WalletBalanceResponseDTOData?,
      GetUserNftsResponseDTOData?,
    )&gt;((ref) async {
  final wallet = await ref.watch(getWalletNotifierProvider.future);
  final nfts = await ref.watch(getNftsNotifierProvider.future);

  return (wallet, nfts);
});

class WalletPage extends HookConsumerWidget {
  const WalletPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    Future&lt;void&gt; onTapNft(Nft nft) async {
      // TODO: [フェーズ2] NFT 詳細画面への遷移
    }

    Future&lt;void&gt; onTapWalletAddress(String walletAddress) async {
      await Clipboard.setData(ClipboardData(text: walletAddress));

      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('$walletAddress copied to clipboard')),
        );
      }
    }

    final combinedData = ref.watch(combinedDataProvider);

    useEffect(
      () {
        Future.microtask(() async {
          try {
            await ref.read(getNftsNotifierProvider.notifier).getNfts();
            await ref.read(getWalletNotifierProvider.notifier).getWallet();
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

    return Scaffold(
      appBar: AppBar(title: const Text('Wallet')),
      body: combinedData.when(
        data: (data) {
          final walletDate = data.$1;
          final nftsData = data.$2;
          if (nftsData == null || walletDate == null) {
            return const SizedBox.shrink();
          }

          final stpValue = walletDate.stpAmount ?? 0;
          final tmpWalletAddress = walletDate.walletAddress ?? '';
          final walletAddress =
              (tmpWalletAddress.isNotEmpty) ? tmpWalletAddress : 'No Address';

          final explorers = nftsData.explorers ?? [];
          final flags = nftsData.flags ?? [];

          final explorerNfts = explorers.map((explorer) {
            final nameParts = explorer.explorerName?.split(' #') ?? ['', ''];
            final name = nameParts[0];
            final number = nameParts.length &gt; 1 ? '#${nameParts[1]}' : '';

            return Nft(
              nftId: explorer.explorerId ?? '',
              tokenId: explorer.tokenId ?? '',
              name: name,
              number: number,
              imageUrl: explorer.explorerImage ?? '',
              nftType: NftType.explorer,
              explorer: explorer,
            );
          }).toList();

          final flagNfts = flags.map((flag) {
            final nameParts = flag.flagName?.split(' #') ?? ['', ''];
            final name = nameParts[0];
            final number = nameParts.length &gt; 1 ? '#${nameParts[1]}' : '';

            return Nft(
              nftId: flag.flagId ?? '',
              tokenId: flag.tokenId ?? '',
              name: name,
              number: number,
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
                                crossAxisAlignment: CrossAxisAlignment.baseline,
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
                                  await onTapWalletAddress(walletAddress);
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
                                    walletAddress,
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
                                                  nft.number,
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

## 🔧 ツール
*2025/02/07 13:10:55*

**結合する要素を考慮**

テキスト「nft.name」を半分に切らずに`const SizedBox(width: 4)`と`nft.number`を結合し、スタイルを調整して折り返さずに表示する方法を探っている。

**最適なレイアウトを模索**

テキスト「nft.name」を最大限広く、番号を完全に表示するために、`Flexible`や`LayoutBuilder`を活用し、名前が収まらない場合は略称を使用している。

**番号を保護する方法を模索中**

番号を切り捨てずに、名前が切り捨てられるレイアウトを検討している。番号を`Flexible`に配置し、名前を収めるスペースを広げる方法を探っている。

**番号の配置方法を探る**

名前を収めるスペースを広げ、番号を足りない分圧縮している。名前が収まらない時に番号を圧縮して表示する方法を模索中。

**調整する方法を考え中**

Row内で名前を広げ、番号を最小限のスペースにする。名前が収まらないときは、番号を圧縮して表示し、溢れてエラーを防ぐ方法を試している。

**簡素化した方法を模索中**

名前を`Expanded`で広げ、番号を`SizedBox`で最小限に抑える。名前が収まらないときは番号を圧縮して表示し、溢れを防ぐ方法を考えている。

**名前と番号の配置**

名前を`Expanded`で広げ、番号を`SizedBox`で縮めている。これにより、名前が収まらないときに番号を圧縮して表示し、溢れを防ぐ効果が期待される。

---

## 🤖 アシスタント
*2025/02/07 13:10:55*

行全体の幅が限られている場合、`nft.name` 側だけを可変にして「番号」の方はできる限り切らずに表示したい、という場合は、以下のように `nft.name` 側を `Expanded`（もしくは `Flexible`）で包むのがシンプルかつ一般的です。

```dart
Row(
  children: [
    // こちらが可変領域になる
    Expanded(
      child: Text(
        nft.name,
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
        style: const TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.bold,
        ),
      ),
    ),
    const SizedBox(width: 4),
    // こちらは基本的に切り捨てしない想定
    Text(
      nft.number,
      maxLines: 1,
      overflow: TextOverflow.ellipsis,
      style: const TextStyle(
        fontSize: 12,
        fontWeight: FontWeight.bold,
        color: ColorPallet.gray300,
      ),
    ),
  ],
);
```

- **ポイント**  
  - 先頭のテキスト（`nft.name`）を `Expanded`（または `Flexible`）で包むことで、画面幅が不足する場合は `nft.name` だけが自動的に省略表示 (`overflow: TextOverflow.ellipsis`) されるようになります。  
  - 「番号」の方（`nft.number`）は通常の `Text` ウィジェットにし、必要であれば `maxLines: 1, overflow: TextOverflow.ellipsis` を指定しておくことで、万が一想定以上に長い文字列が来ても行のオーバーフローを防ぎます。  
  - 文字同士の間隔は `const SizedBox(width: 4)` のみを挟み、あまりにも横幅が狭くて潰れすぎるようであれば、`nft.number` の方にも（デザインに応じて）`SizedBox` などで最小幅を確保するなど調整するとよいでしょう。

これで「番号」をできる限り切らずに、`nft.name` 側を必要に応じて省略表示させることができます。

---
