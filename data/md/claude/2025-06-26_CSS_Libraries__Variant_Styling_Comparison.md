# CSS Libraries: Variant Styling Comparison

日付: 2025-06-26

---

## 👤 ユーザー
*2025/6/26 13:59:39*

この3つの比較。 
vanilla-extract
tailwind variants
class-variance-authority

---

## 🤖 アシスタント
*2025/6/26 14:00:11*

これら3つのライブラリを比較してみます。

## vanilla-extract

CSSをTypeScriptで書くためのゼロランタイムスタイルシートライブラリです。

**特徴:**
- ビルド時にCSSファイルを生成（ランタイムコストなし）
- 完全な型安全性
- CSS変数やテーマの強力なサポート
- CSS ModulesやCSS-in-JSの良い部分を組み合わせたアプローチ

**使用例:**
```typescript
import { style } from '@vanilla-extract/css';

export const button = style({
  padding: 12,
  borderRadius: 8,
  backgroundColor: 'blue',
  ':hover': {
    backgroundColor: 'darkblue'
  }
});
```

## Tailwind Variants (tv)

Tailwind CSSのユーティリティクラスを使って、バリアント付きのコンポーネントスタイルを作成するライブラリです。

**特徴:**
- Tailwindクラスをベースにした構成
- バリアントの定義が直感的
- 軽量（約3KB）
- Tailwind IntelliSenseとの相性が良い

**使用例:**
```typescript
import { tv } from 'tailwind-variants';

const button = tv({
  base: 'px-4 py-2 rounded font-medium',
  variants: {
    color: {
      primary: 'bg-blue-500 text-white',
      secondary: 'bg-gray-200 text-gray-900'
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg'
    }
  }
});

// 使用: button({ color: 'primary', size: 'md' })
```

## Class Variance Authority (CVA)

クラス名ベースのバリアント管理に特化したライブラリです。Tailwindに限らず、あらゆるCSSフレームワークで使用可能です。

**特徴:**
- フレームワーク非依存
- 高度なバリアント合成ロジック
- 複合バリアントのサポート
- clsxやclassnamesとの統合が容易

**使用例:**
```typescript
import { cva } from 'class-variance-authority';

const button = cva('base-button', {
  variants: {
    intent: {
      primary: 'bg-blue-500 text-white',
      secondary: 'bg-gray-200 text-gray-900'
    },
    size: {
      small: 'text-sm py-1 px-2',
      medium: 'text-base py-2 px-4'
    }
  },
  compoundVariants: [
    {
      intent: 'primary',
      size: 'small',
      class: 'uppercase'
    }
  ]
});
```

## 比較まとめ

**パフォーマンス:**
- vanilla-extract: ビルド時生成で最速
- tv/cva: 軽量なランタイム処理

**型安全性:**
- vanilla-extract: 完全な型安全性
- tv/cva: バリアントの型安全性

**使いやすさ:**
- tv: Tailwindユーザーには最も直感的
- cva: 汎用的で柔軟
- vanilla-extract: 学習曲線は高めだが強力

**適した用途:**
- vanilla-extract: デザインシステム構築、大規模アプリ
- tv: Tailwindベースのプロジェクト
- cva: 複雑なバリアント管理が必要なコンポーネントライブラリ

プロジェクトの規模、チームのスキルセット、既存の技術スタックに応じて選択するのが良いでしょう。

---
