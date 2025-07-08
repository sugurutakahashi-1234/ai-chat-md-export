# WalletPage NFT Implementation

Date: 2025-01-28

---

## 👤 User
*2025-01-28 19:03:06*

{
  "content_type": "image_asset_pointer",
  "asset_pointer": "file-service://file-2eSBuiEjNfFoRCqx7tzAMH",
  "size_bytes": 36161,
  "width": 292,
  "height": 488,
  "fovea": null,
  "metadata": {
    "dalle": null,
    "gizmo": null,
    "generation": null,
    "container_pixel_height": null,
    "container_pixel_width": null,
    "emu_omit_glimpse_image": null,
    "emu_patches_override": null,
    "sanitized": true,
    "asset_pointer_link": null,
    "watermarked_asset_pointer": null
  }
}
添付した画像の画面を実装して欲しい。
与えたコードは実装済みで、WalletPageのみを出力して欲しい。

ExplorerDTOとFlagDTOを抽象化した NFTというクラスを定義して、explorersと flags をそのNFTに変換して、NFTのListを表示するようにしたい。

enum で NftType を定義して、explorerとflag としたい。

NFTというクラスには String nftId, String tokenId, String name, String imageUrl, NftType nftType としたい。
 
 また、NFTというクラスにはもともとのExplorerDTO or FlagDTOを保持するようにしたい。enumで連想値を持ってもいいし、ExplorerDTO? と FlagDTO? を持つようにして、片方だけ null ではないようにしてもいい。見通しがいい方がいい。

タップした時の処理はWidget build(BuildContext context, WidgetRef ref) {に onTapNft() として定義して欲しい。

import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/users/nfts/get_nfts.dart';

class WalletPage extends HookConsumerWidget {
  const WalletPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final getNftsStateAsyncValue = ref.watch(getNftsNotifierProvider);

    useEffect(
      () {
        Future.microtask(() async {
          await ref.watch(getNftsNotifierProvider.notifier).getNfts();
        });
        return null;
      },
      [],
    );

    return Scaffold(
      appBar: AppBar(title: const Text('Wallet')),
      body: getNftsStateAsyncValue.when(
        data: (nfts) {
          return const Text('hoge');
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



@freezed
class GetUserNftsResponseDTOData with _$GetUserNftsResponseDTOData {
  factory GetUserNftsResponseDTOData({
    @JsonKey(name: 'wallet') String? wallet,
    @JsonKey(name: 'stp') num? stp,
    @JsonKey(name: 'explorers') required List&lt;ExplorerDTO&gt;? explorers,
    @JsonKey(name: 'flags') required List&lt;FlagDTO&gt;? flags,
  }) = _GetUserNftsResponseDTOData;

  factory GetUserNftsResponseDTOData.fromJson(Map&lt;String, dynamic&gt; jsonMap) =&gt;
      _$GetUserNftsResponseDTODataFromJson(jsonMap);
}

@freezed
class ExplorerDTO with _$ExplorerDTO {
  factory ExplorerDTO({
    @JsonKey(name: 'explorerId') required String? explorerId,
    @JsonKey(name: 'tokenId') required String? tokenId,
    @JsonKey(name: 'explorerName') required String? explorerName,
    @JsonKey(name: 'explorerDescription') String? explorerDescription,
    @JsonKey(name: 'explorerImage') required String? explorerImage,
    @JsonKey(name: 'explorerCategory')
    required ExplorerDTOExplorerCategory? explorerCategory,
    @JsonKey(name: 'energy') required num? energy,
    @JsonKey(name: 'rarity') required ExplorerDTORarity? rarity,
    @JsonKey(name: 'energyConsumption') required num? energyConsumption,
    @JsonKey(name: 'range') required num? range,
    @JsonKey(name: 'decoyFinding') required bool? decoyFinding,
    @JsonKey(name: 'totalSearch') required num? totalSearch,
    @JsonKey(name: 'totalSpotFound') required num? totalSpotFound,
  }) = _ExplorerDTO;

  factory ExplorerDTO.fromJson(Map&lt;String, dynamic&gt; jsonMap) =&gt;
      _$ExplorerDTOFromJson(jsonMap);
}


@freezed
class FlagDTO with _$FlagDTO {
  factory FlagDTO({
    @JsonKey(name: 'flagId') required String? flagId,
    @JsonKey(name: 'tokenId') required String? tokenId,
    @JsonKey(name: 'flagName') required String? flagName,
    @JsonKey(name: 'flagDescription') String? flagDescription,
    @JsonKey(name: 'flagImage') required String? flagImage,
    @JsonKey(name: 'flagCategory') required FlagDTOFlagCategory? flagCategory,
    @JsonKey(name: 'flagStatus') required FlagDTOFlagStatus? flagStatus,
    @JsonKey(name: 'level') required num? level,
    @JsonKey(name: 'endurance') required num? endurance,
    @JsonKey(name: 'defended') required num? defended,
    @JsonKey(name: 'rarity') required FlagDTORarity? rarity,
    @JsonKey(name: 'flagIncome') required num? flagIncome,
    @JsonKey(name: 'leftHandId') String? leftHandId,
    @JsonKey(name: 'rightHand') String? rightHand,
  }) = _FlagDTO;

  factory FlagDTO.fromJson(Map&lt;String, dynamic&gt; jsonMap) =&gt;
      _$FlagDTOFromJson(jsonMap);
}


part 'get_nfts.g.dart';

@Riverpod(keepAlive: true)
class GetNftsNotifier extends _$GetNftsNotifier {
  @override
  Future&lt;GetUserNftsResponseDTOData?&gt; build() async =&gt; null;

  Future&lt;GetUserNftsResponseDTOData&gt; getNfts() async {
    state = const AsyncValue.loading();
    try {
      try {
        final api = await ref.watch(usersApiProvider.future);
        final response = await api.userControllerGetUserNfts();
        debugPrint('Response Body: ${response.data}');
        debugPrint('Response Body.data: ${response.data?.data}');
        checkForApiError(response.data);
        final data = response.data?.data;
        if (data == null) {
          throw Exception('No data found');
        }
        state = AsyncValue.data(data);
        return data;
      } on DioException catch (error) {
        debugPrintDioException(error);
        checkForApiError(error.response?.data);
        rethrow;
      } on Exception {
        rethrow;
      }
    } on ApiError catch (error, stackTrace) {
      debugPrintApiError(error);
      if (error.type.shouldLogout) {
        ref.read(shouldLogoutNotifierProvider.notifier).trigger();
      }
      state = AsyncValue.error(error, stackTrace);
      rethrow;
    } on Exception catch (error, stackTrace) {
      debugPrint('Error: $error');
      state = AsyncValue.error(error, stackTrace);
      rethrow;
    }
  }
}

---

## 🤖 Assistant
*2025-01-28 19:03:17*

Here is the `WalletPage` implementation based on your requirements. This implementation defines the `NFT` class to abstract `ExplorerDTO` and `FlagDTO`, including an `NftType` enum. It also displays the list of NFTs in the UI and defines an `onTapNft` function for handling taps.

```dart
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/users/nfts/get_nfts.dart';

// Enum to differentiate NFT types
enum NftType { explorer, flag }

// NFT class to unify ExplorerDTO and FlagDTO
class NFT {
  final String nftId;
  final String tokenId;
  final String name;
  final String imageUrl;
  final NftType nftType;
  final ExplorerDTO? explorer;
  final FlagDTO? flag;

  NFT({
    required this.nftId,
    required this.tokenId,
    required this.name,
    required this.imageUrl,
    required this.nftType,
    this.explorer,
    this.flag,
  });
}

class WalletPage extends HookConsumerWidget {
  const WalletPage({super.key});

  void onTapNft(NFT nft) {
    // Define what happens when an NFT is tapped
    debugPrint('Tapped on NFT: ${nft.name}');
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final getNftsStateAsyncValue = ref.watch(getNftsNotifierProvider);

    useEffect(() {
      Future.microtask(() async {
        await ref.watch(getNftsNotifierProvider.notifier).getNfts();
      });
      return null;
    }, []);

    return Scaffold(
      appBar: AppBar(title: const Text('Wallet')),
      body: getNftsStateAsyncValue.when(
        data: (nftsData) {
          if (nftsData == null) return const Center(child: Text('No data available'));

          final List<NFT> nftList = [
            ...?nftsData.explorers?.map(
              (e) => NFT(
                nftId: e.explorerId ?? '',
                tokenId: e.tokenId ?? '',
                name: e.explorerName ?? '',
                imageUrl: e.explorerImage ?? '',
                nftType: NftType.explorer,
                explorer: e,
              ),
            ),
            ...?nftsData.flags?.map(
              (f) => NFT(
                nftId: f.flagId ?? '',
                tokenId: f.tokenId ?? '',
                name: f.flagName ?? '',
                imageUrl: f.flagImage ?? '',
                nftType: NftType.flag,
                flag: f,
              ),
            ),
          ];

          return Column(
            children: [
              // Display Wallet Balance
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.grey[850],
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Column(
                  children: [
                    const Icon(Icons.account_balance_wallet, size: 40),
                    Text(
                      '${nftsData.stp?.toStringAsFixed(6) ?? '0.000000'} STP',
                      style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                    ),
                    Container(
                      margin: const EdgeInsets.only(top: 8),
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.green[700],
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        nftsData.wallet != null
                            ? '${nftsData.wallet!.substring(0, 6)}...${nftsData.wallet!.substring(nftsData.wallet!.length - 6)}'
                            : 'No Wallet',
                        style: const TextStyle(color: Colors.white),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              // NFT List
              Expanded(
                child: ListView.builder(
                  itemCount: nftList.length,
                  itemBuilder: (context, index) {
                    final nft = nftList[index];
                    return Card(
                      color: Colors.grey[900],
                      child: ListTile(
                        leading: Image.network(nft.imageUrl, width: 50, height: 50, fit: BoxFit.cover),
                        title: Text(nft.name, style: const TextStyle(color: Colors.white)),
                        subtitle: Text(
                          'TokenID ${nft.tokenId}',
                          style: TextStyle(color: Colors.grey[400]),
                        ),
                        trailing: const Icon(Icons.chevron_right, color: Colors.white),
                        onTap: () => onTapNft(nft),
                      ),
                    );
                  },
                ),
              ),
            ],
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, _) => Center(child: Text('Error: $error')),
      ),
    );
  }
}
```

### **Implementation Details**
1. **NFT Class**
   - Abstracts both `ExplorerDTO` and `FlagDTO` into a single `NFT` model.
   - Holds the original DTO instance (`ExplorerDTO? explorer` or `FlagDTO? flag`).

2. **NftType Enum**
   - Differentiates between `explorer` and `flag`.

3. **onTapNft() Method**
   - Prints the tapped NFT name for now, but can be modified to navigate or show details.

4. **UI Components**
   - **Wallet Balance Section**: Displays balance and truncated wallet address.
   - **NFT List**: Uses a `ListView.builder` to dynamically display NFTs.

Let me know if you need any refinements! 🚀

---
