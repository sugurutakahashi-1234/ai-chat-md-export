# Biome CSS and Tailwind Configuration

Date: 2025-06-16

---

## 👤 User
*2025-06-17 01:21:56*

「biomeのCSSの設定」に「TailwindのCSSの設定」はあるか。

---

## 🤖 Assistant
*2025-06-17 01:22:25*

Biome の CSS 設定に Tailwind CSS 専用の設定があるかを調べてみます。
*[Tool Use: Unsupported Block]*


*[Tool Use: Unsupported Block]*

検索結果から、Biome の CSS 設定における Tailwind CSS のサポート状況について分かりました：

**はい、Biome には Tailwind CSS に関連する設定があります。**

主な Tailwind CSS 関連機能：

## 1. **`useSortedClasses` ルール**
- Tailwind CSS のユーティリティクラスを自動でソートするリンタールール
- デフォルトで有効になっている Tailwind CSS プリセットが含まれている
- 現在はフォーマッタではなく、リンタールールとして実装されている（自動修正付き）

## 2. **制限事項**
現在のバージョンでは以下の制限があります：
- スクリーンバリアント（`md:`、`max-lg:` など）のソートは未対応
- カスタムユーティリティとバリアント（Tailwind CSS プラグイン由来）は未対応
- デフォルトの Tailwind CSS 設定のみサポート
- `tailwind.config.js` ファイルの実行はできない

## 3. **CSS パーサーでの Tailwind サポート**
- `@apply` ディレクティブの解析対応
- `@tailwind` ディレクティブは正常に動作
- Tailwind v4 の新しい構文（`@theme` など）についても議論中

## 4. **設定例**
```json
{
  "linter": {
    "rules": {
      "nursery": {
        "useSortedClasses": "error"
      }
    }
  }
}
```

ただし、完全な Tailwind CSS サポートはまだ開発中で、Prettier の Tailwind プラグインと比べると機能が限定的です。現在は Issue #1274 で開発が進められています。

---
