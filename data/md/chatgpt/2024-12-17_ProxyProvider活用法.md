# ProxyProvider活用法

日付: 2024-12-17

---

## 👤 ユーザー
*2024/12/17 22:28:06*

ref
      ..listen&lt;bool&gt;(showShootableSpotDetailNotifierProvider, (previous, next) {
        if (next) {
          \_showShootableSpotDetailSheet(context, ref);
        }
      })
      ..listen&lt;bool&gt;(showExplorerListNotifierProvider, (previous, next) {
        if (next) {
          \_showExploreListSheet(context, ref);
        }
      })
      ..listen&lt;bool&gt;(showSpotListNotifierProvider, (previous, next) {
        if (next) {
          \_showSpotListSheet(context, ref);
        }
      });

これってProxyProviderでまとめるといいことが起きないかな？

---

## 🤖 アシスタント
*2024/12/17 22:28:38*

`ProxyProvider` を使うことによって、複数の `Provider` の状態をまとめて効率的に管理し、コードの再利用性と可読性を向上させることができます。

このケースでは、複数の `listen` で似たような `Notifier` を監視しています。`ProxyProvider` を利用することで、以下のメリットが考えられます。

---

### 1. **依存関係の管理**
複数の `Notifier` の状態を1つの共通 `ProxyProvider` でまとめることで、依存関係がシンプルになります。

例えば、`showShootableSpotDetailNotifierProvider`、`showExplorerListNotifierProvider`、`showSpotListNotifierProvider` をまとめて、`CombinedStateNotifierProvider` のようなものを作成できます。

---

### 2. **コードの共通化**
`ProxyProvider` を使って、複数の `Notifier` の状態を1つの新しい状態やクラスにまとめることで、`listen` を1箇所に集約できます。

#### 例: `CombinedStateNotifierProvider`
```dart
final combinedNotifierProvider = ProxyProvider3<
    bool, // showShootableSpotDetailNotifierProvider の状態
    bool, // showExplorerListNotifierProvider の状態
    bool, // showSpotListNotifierProvider の状態
    CombinedState>(
  update: (context, showShootable, showExplorer, showSpot, previous) {
    return CombinedState(
      showShootable: showShootable,
      showExplorer: showExplorer,
      showSpot: showSpot,
    );
  },
);

class CombinedState {
  final bool showShootable;
  final bool showExplorer;
  final bool showSpot;

  CombinedState({
    required this.showShootable,
    required this.showExplorer,
    required this.showSpot,
  });
}
```

---

### 3. **`listen` のシンプル化**
1つの `CombinedState` を `listen` で監視し、その中の状態に応じて挙動を分岐することで、冗長なコードを減らせます。

#### 改善後の `listen`
```dart
ref.listen<CombinedState>(combinedNotifierProvider, (previous, next) {
  if (next.showShootable) {
    _showShootableSpotDetailSheet(context, ref);
  } else if (next.showExplorer) {
    _showExploreListSheet(context, ref);
  } else if (next.showSpot) {
    _showSpotListSheet(context, ref);
  }
});
```

---

### 4. **パフォーマンスの向上**
- 複数のリスナーがバラバラに状態変更を検知するよりも、1つの `CombinedState` に集約してリッスンすることで、不要なリビルドや通知を減らせる場合があります。

---

### まとめ
`ProxyProvider` を利用することで、複数の `Notifier` の状態をまとめ、管理の一元化、コードの共通化、パフォーマンス向上が期待できます。  
特に状態が関連している場合や処理が似ている場合には、**ProxyProvider** の導入を検討すると良いでしょう！

---
