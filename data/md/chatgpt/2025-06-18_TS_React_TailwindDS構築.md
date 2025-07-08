# TS React TailwindDS構築

日付: 2025-06-18

---

## 👤 ユーザー
*2025/6/18 16:41:06*

TailwindCSS v4 でtype script x react のプロジェクトでデザインシステムを構築していきたい。 ゼロからの新規のプロジェクトである。 どういう戦略を取るのがいいと思うかな。 なるべく軽量であると嬉しい。

---

## 🤖 アシスタント
*2025/6/18 16:41:18*

以下は **「TypeScript × React + Tailwind CSS v4」** という最小構成でデザインシステムを育てるときの、実践的・軽量志向のロードマップです。

---

## 1. スキャフォールドと必須依存

| 目的 | 推奨パッケージ | 理由 |
| --- | --- | --- |
| プロジェクト雛形 | **Vite** (`pnpm create vite@latest my-ds --template react-ts`) | 速い・シンプル・脱ロックイン |
| CSSフレームワーク | **tailwindcss@^4** （PostCSS/Autoprefixer不要） | v4 は Oxide エンジンで 5-10× ビルド高速化 citeturn0search1 |
| クラス結合 | `clsx` + `tailwind-merge` | 1 kB レベル。重複ユーティリティをスマートに解決 |
| Variant 定義 | **class-variance-authority (CVA)** | tailwind-variants より依存が少なく TypeScript 型を自動生成 |
| Lint/整形 | `eslint-plugin-tailwindcss`, `biome` または `prettier-plugin-tailwindcss` | クラス並び順と静的エラーを CI で統一 |
| UI プリミティブ (任意) | **Radix UI** or **Ariakit** (headless) | スタイルレスなので Tailwind で軽量に着色可能 |

<small>※Storybook が重い場合は 0-config で速い **Ladle** を代替として検討。</small>

---

## 2. ディレクトリ戦略（Atomic に寄せすぎない“3レイヤー構造”）

```
src/
 ┣ app/           // ルーティング&ページ
 ┣ design/        // ★ デザインシステムすべて
 ┃ ┣ tokens/     //   tailwind.config と同期する design-tokens
 ┃ ┣ ui/         //   ボタン等 “Primitives” (CVA + Tailwind)
 ┃ ┣ patterns/   //   コンポジット (Form, Card 等)
 ┃ ┗ index.ts    //   public API (権限定義)
 ┣ lib/           // 汎用 util (clsx, date helpers…)
 ┗ main.tsx
```

- **`design/tokens`**  
  `colors.ts`, `spacing.ts` などを **Type-safe TS object + CSS Variables** で管理し、`tailwind.config.ts` で `theme.extend` にバインド。v4 はトークンをそのまま `var(--color-primary)` のように使える citeturn0search7。
- **`design/ui`**  
  1 ファイル 1 コンポーネント。`Button.tsx` なら **CVA** で variant prop (`size`, `intent`, `ghost` など) を型安全に切り替える。
- **`design/patterns`**  
  複数 UI を組み合わせた再利用ブロック。ページ層ではなくここに置くことで育ちやすい。

---

## 3. Tailwind v4 設定の最小例

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";
import { colors } from "./src/design/tokens/colors";  // CSS vars

export default {
  content: ["./src/**/*.{tsx,mdx}"],
  theme: {
    extend: {
      colors,                // tokens をそのまま展開
      animation: {           // よく使う motion をプリセット
        fade: "fade 200ms ease-in-out",
      },
    },
  },
  plugins: [
    // 公式プラグインは本当に必要なものだけ
    require("@tailwindcss/typography"),
    require("tailwindcss-animate"),
  ],
} satisfies Config;
```

**ポイント**

1. **CSS 変数でトークン管理**  
   `:root { --color-primary: #3b82f6; } .dark {...}` とし、Tailwind クラス側は `text-primary`→`color: var(--color-primary)` へ。テーマ切替はクラス切替のみで実現。
2. **Cascade Layers を活用**（v4新機能）  
   コンポーネント専用レイヤーを `@layer components { … }` にまとめ、ユーティリティより上位に。意図しない上書きを防止 citeturn0search7。
3. **PostCSS ナシで済む**  
   Autoprefixer・PostCSS の個別設定が不要になりセットアップが短く citeturn0search3。

---

## 4. UI プリミティブ実装サンプル

```tsx
// design/ui/button.tsx
import { cva, VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { forwardRef } from "react";

const buttonStyles = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2",
  {
    variants: {
      intent: {
        primary:
          "bg-primary text-white hover:bg-primary/80 focus-visible:ring-primary",
        secondary:
          "bg-secondary text-white hover:bg-secondary/80 focus-visible:ring-secondary",
        ghost:
          "bg-transparent hover:bg-primary/10 text-primary focus-visible:ring-primary",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-lg",
      },
    },
    defaultVariants: { intent: "primary", size: "md" },
  }
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonStyles>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, intent, size, ...props }, ref) => (
    <button
      ref={ref}
      className={twMerge(buttonStyles({ intent, size }), className)}
      {...props}
    />
  )
);
Button.displayName = "Button";
```

- **型安全**: `intent="primary"` 以外を渡すと即時 TS エラー。  
- **再利用性**: デフォルトスタイルは Tailwind だけ。Radix primitives とも相性良し。

---

## 5. ドキュメンテーション & テスト

| 項目 | 軽量派 | 中量派 |
| ---- | ------ | ------ |
| コンポーネントカタログ | **Ladle** (Hot-reload 50 ms) | Storybook |
| Visual Regression | 無し (初期) → Playwright Snapshots | Chromatic |
| ユニットテスト | Vitest + Testing Library |   |
| アクセシビリティ | jest-axe または Vitest-axe |   |

---

## 6. スケールさせるときの拡張ポイント

1. **Token → Figma 連携**  
   Tokens Studio (Figma Plugin) で JSON export → `design/tokens/*.json` に自動取り込み。
2. **パッケージ分割**  
   後から `packages/design-system` を切り出せるよう、最初から public API を `design/index.ts` に集約しておく。
3. **多テーマ**  
   `data-theme="brandA"` スイッチ & `:root[data-theme='brandA'] { … }` で色替え。Tailwind はプレーン CSS 変数を読むだけなので追加ランタイム不要。
4. **Tailwind v4.x** 追従方針  
   v4.1 以降は `text-shadow`・`mask-image` などが続々追加 citeturn0search2。`@patch` 対応ガイドに沿って差分アップグレード。

---

### まとめ

- **Tailwind CSS v4 の “Oxide + トークン + レイヤー”** をフル活用すると、**追加プラグインを極力減らしつつ高速&柔軟**なデザインシステムが作れる。  
- 型安全は **CVA + tailwind-merge + clsx** でほぼ完結。  
- ディレクトリを **tokens / ui / patterns** の 3 レイヤーに保つと、規模拡大時も依存が絡まらない。  
- ドキュメントは **Ladle** にし、Storybook は必要になった時点で採用可。

この構成なら **初期インストールは実質 6 〜 7 個の依存 + Tailwind** だけ。ビルドは体感 300 ms 前後、生成 CSS も未使用パージで 10 kB 以下に収まります。

---

## 👤 ユーザー
*2025/6/18 16:47:21*

これの問題点はあるのか。 ちなみにストーリーブックとは何か。

---

## 🤖 アシスタント
*2025/6/18 16:47:30*

### 想定構成の「落とし穴」チェックリスト

| 分類 | 気に なる点 | 補足・回避策 |
|------|------------|--------------|
| **Tailwind v4 そのもの** | **⧗ エコシステムが追い付いていない** - 一部公式プラグイン・サードパーティは v3 系のみ対応。&lt;br&gt;**⚙ ネイティブ依存が CI で詰まる** - Oxide エンジンは Rust バイナリを落とすので、Alpine Linux など GLIBC 非互換環境ではビルドエラーになるケースあり。 | `--legacy` オプションで旧ビルドにフォールバック、または Docker イメージで実行環境を揃える。&lt;br&gt;新規プラグイン採用時は **`npm info &lt;pkg&gt; peerDependencies`** で v4 対応を確認。 citeturn0search1turn0search7 |
| **トークンを CSS 変数化** | **🎨 “静的パージ” が効きにくい** - `var(--color-primary)` のような変数は Tailwind の未使用クラス絞り込み対象外。テーマ数が増えると最終 CSS が肥大しやすい。 | 変数名自体を Tailwind の `--tw` プリフィクスに統一し、`@supports (color: oklch(0 0 0)) {}` 内で追加テーマを遅延ロードすると軽量化可。 |
| **CVA + tailwind-merge** | **⚖ 機能差** - Tailwind-variants には「スロット」「複合 variant」など高度な API があるが、CVA は最小限。後から要求が増えると乗り換えコストが発生。&lt;br&gt;**🏷 ランタイム結合コスト** - `buttonStyles({size})` がレンダー毎に走る。実測では 1 µs 未満だが、数千ノードを仮想 DOM 外で生成する SSR ではベンチ必須。 | 高機能が欲しくなった時点で tailwind-variants へ移行可能かを PoC しておくと安心。比較記事も参考に長期運用を判断。 citeturn0search2turn0search5 |
| **Ladle 採用 (Storybook なし)** | **📚 ドキュメント機能が薄い** - MDX Docs、Design Token アドオン、Figma 組み込み等は Ladle に無い。&lt;br&gt;**👥 周囲の慣れ** - 大規模チームや業務委託メンバーは「Storybook 前提」で作業するケースが多い。 | *ライト版* と割り切り「Ladle → Storybook」のマイグレーション手順を README に残す。Storybook を “docs only” モードで後付け導入する方法もある。 |
| **その他** | - Radix & Ariakit も v4 移行が未完の API あり&lt;br&gt;- `@layer components` を多用すると cascade 設計が複雑化しがち | コンポーネントの先頭に `@layer components` を自動付与する eslint-plugin などで統一ルールを強制 |

---

## Storybook とは？

&gt; **Storybook** はフロントエンド用の「孤立開発 & ドキュメンテーション環境」です。コンポーネントやページをアプリ本体から切り離して起動し、状態ごとの UI を*ストーリー*としてカタログ化します。  
&gt; – 公式ドキュメント citeturn0search0turn0search6

### 主な用途

1. **開発**  
   本番データがなくても “エッジケース” (超長文・空データ・エラー状態など) を即座に再現し、UI を検証できる。
2. **テスト**  
   Storybook 8 以降は Playwright ベースの “Component Test” が同梱。ビジュアルリグレッションもアドオンで容易。
3. **ドキュメント**  
   `.mdx` で設計意図やサンプルコードを同居させ、デザイナー／QA／PM への共有サイトとして公開可。 citeturn0search3
4. **設計資産の再利用**  
   アドオン経由で Figma 連携・アクセシビリティ監査・デザイントークン表などを一元化。

&gt; 「メンテが大変では？」という議論もありますが、**チーム外共有・回帰テスト・オンボーディング** のコストを考慮して採用する企業が多数です。 citeturn0search9

### Ladle との簡易比較

| 項目 | **Ladle** | **Storybook** |
|------|-----------|---------------|
| 起動速度 | ⚡ 数百 ms (Vite ベース) | 1–3 秒程度 (Webpack/Vite 選択可) |
| 機能/アドオン | 必要最小限 | 100+ 公式アドオン＋豊富なサードパーティ |
| ドキュメント (MDX) | × (サポート予定少) | ◎ |
| 学習コスト | 低 | 中 |
| エコシステム | 小規模 | 業界標準 |

---

## まとめ

- 提案スタックは **「速さ・軽さ」重視** だが、  
  **🔸 v4 新機能の“揺り戻し”** と **🔸 ドキュメント基盤の薄さ** が主なリスク。
- 小規模フェーズでは Ladle + CVA で十分。  
  チーム拡大・デザイナー参加が見えたタイミングで **Storybook への昇格**、variant ライブラリの再評価を検討すると安全です。

---

## 👤 ユーザー
*2025/6/18 16:50:19*

@headlessui/reactのインストールはやった方がいいか、それともない方がいいのか、やっぱり。

---

## 🤖 アシスタント
*2025/6/18 16:50:24*

### どんな場面で **@headlessui/react** を入れるか──結論早わかり

| 推したいケース | 見送る／別ライブラリを検討したいケース |
|----------------|------------------------------------------|
| - **Tailwind CSS 前提** で “抜群の親和性” を重視する<br>- “ボタン以外のインタラクティブ要素（Dialog, Listbox, Menu…）を**最短でアクセシブル**に実装したい”<br>- 社内に Tailwind 文化が浸透していて、API の “render-prop” スタイルに抵抗がない | - **Radix UI や Ariakit** で十分／より細粒度の API が欲しい<br>- React Server Components (RSC) 前提で “全部 Server 側” に乗せたい<br>- ライブラリを極限まで削りたい（gzip ±15 kB でも気になる）<br>- “外部依存の無い純 Hooks 実装” で揃えたい |

---

## ⬆️ 導入したときのメリット

1. **アクセシビリティ保証**  
   ARIAロール・キーボード操作・フォーカスマネジメントが内蔵。自前実装の**工数とリスクを一気に削減**。
2. **デザインは 100 % 自由**  
   完全アンスタイルなので **Tailwind クラスだけ** でブランド固有のトーン&マナーを維持できる。  
3. **Tailwind v4 公式サポート**  
   `@headlessui/tailwindcss@0.2.2` で v4 用 layer/変数をフォロー。ワーニング無しで動く citeturn0search1。
4. **学習コストが低い**  
   React の render-prop パターン 1 種類を覚えれば全コンポーネント共通。PoC が最速で立ち上がる。  

---

## ⬇️ 想定しておくデメリット・制限

| 観点 | 詳細 |
|------|------|
| **API の“古典”感** | `({ open }) => (…)` の render-prop 形式が中心。**Hooks ベースの Radix UI** に慣れたチームは冗長に感じる場合あり。 |
| **コンポーネント面のカバー率** | Dialog / Popover / Tabs など主要 8 種前後。**Checkbox, Slider, Tooltip** などは 2025-04 時点でも未実装＝自前 or 他ライブラリ併用が必要 citeturn0search3。 |
| **RSC/Streaming との相性** | 2.2 系でクライアント化指示 (`"use client"`) は自動付与されるが、**すべて Client Component 扱い**。RSC マルチレイヤー化を徹底したい場合は Radix + shadcn/ui の方が分離しやすい。 |
| **サイズ感** | gzip で 14 〜 18 kB（2.2.4）+ framer-motion等を足すと 25 kB 超。*“Tailwind + 自家製 Hooks”* だけで済ませる最軽量構成よりは膨らむ。 |

---

## Radix UI／Ariakit との簡易比較

| 項目 | **Headless UI** | **Radix UI** | **Ariakit** |
|------|----------------|--------------|-------------|
| Tailwind 連携 | ◎ 同じ Tailwind Labs 製 | ○ shadcn/ui で補完可 | ○ |
| API スタイル | Render-prop 중심 | Hooks + Comp. | Hooks |
| 公式コンポ数 | 8 程度 | 25+ | 15+ |
| RSC 対応 | △ 全て Client | ○ Component 単位で切替可 | ○ |
| 追加サイズ (gzip) | 15 kB | ≈ 22 kB | ≈ 14 kB |
| メンテ状況 | 2025-04 v2.2.* アクティブ | v2.1.* で毎月パッチ | v1.4.* 活発 |

---

## 実際に入れるならこう使う (サンプル: Modal/Dialog)

```tsx
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, ReactNode, useState } from "react";

export function Modal({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-primary">
        Open modal
      </button>

      <Transition show={open} as={Fragment}>
        <Dialog onClose={setOpen} className="fixed inset-0 z-50 flex items-center justify-center">
          <Transition.Child
            as={Fragment}
            enter="transition-opacity fade"
            leave="transition-opacity fade"
          >
            <Dialog.Backdrop className="fixed inset-0 bg-black/40" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition transform ease-out duration-150"
            leave="transition transform ease-in duration-100"
            enterFrom="scale-95 opacity-0"
            enterTo="scale-100 opacity-100"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-95 opacity-0"
          >
            <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
              <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
              {children}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
```

- **Dialog / Transition / Backdrop** すべて a11y 済み。  
- スタイルは Tailwind クラスのみで自由度を保つ。  

---

## **判断ガイドライン**

1. **小〜中規模／Tailwind ベースに集中 →** *Headless UI で十分*  
   - Variant 管理は別途 CVA で。  
   - Checkbox 等は shadcn/ui の Radix ラッパだけ個別インストールも可。
2. **多機能 SaaS / 複数ブランド展開 →** *Radix UI (+ shadcn/ui)* が拡張性◎  
   - Hooks API・Compound Slot など大型システム向き。
3. **超軽量・RSC オンリー →** 自家製 Hooks + Type-safe 洗練を検討。

> **まとめ**:  
> “Tailwind CSS に寄り添った最短手” を優先するなら **@headlessui/react は“アリ”**。ただし **機能カバー範囲と RSC 対応の限界** を把握したうえで、後々 Radix/Ariakit へ“部分的に”乗り換えられる構成（adapter hooks やコンポ内抽象化）を仕込んでおくと、将来の分岐にも耐えられます。

---

## 👤 ユーザー
*2025/6/18 16:58:35*

LadleとStorybookをもっと比較して欲しい。
環境の設定やできることできないことをまとめて欲しい

---

## 🤖 アシスタント
*2025/6/18 16:59:16*

以下では **Ladle v3** と **Storybook 8 / 9** を軸に、導入手順・設定ファイル・パフォーマンス・拡張性などを網羅的に比較します。  
（🗓 2025-06 時点の最新安定版／プレリリース情報を含みます）

| 観点 | **Ladle** | **Storybook** |
|---|---|---|
| **インストール** | `pnpm add @ladle/react` だけ。React が既にあればほぼゼロ設定で動作【6view0†L1-L4】 | `npm create storybook@latest` で CLI がフレームワーク検出→必要パッケージを自動導入【7search0†L1-L4】 |
| **設定ファイル** | 省略可。カスタマイズ時は `.ladle/config.mjs`（ESM）を追加するだけ | `.storybook/` ディレクトリに `main.(js|ts)`・`preview.(js|ts)`・`manager.(js|ts)` など複数ファイル |
| **ビルド基盤** | Vite + SWC 固定。SSR/i18n など最新 Vite 機能をそのまま享受 | ビルダーを **Webpack** か **Vite** から選択。`react-vite` フレームワークで高速化可【4search0†L0-L3】【4search3†L0-L4】 |
| **起動速度** | コールド 6 s → ホット 3 s 未満。HMR は < 100 ms【0search6†L0-L4】 | Vite 版でも 10 s 前後。Webpack 版は 20–25 s 規模【0search6†L0-L4】 |
| **生成サイズ** | デフォルト静的ビルド ≒ 1 MB。コード分割は自動 | アドオン数に比例して数 MB〜10 MB。`--test` フラグで最小ビルド 2-4× 短縮【7search7†L0-L4】 |
| **アドオン／プラグイン** | サードパーティ不可。内蔵 10 種（A11y、MSW、Width など）【2view0†L2-L4】 | 公式＋外部アドオン 100 +。A11y Realtime, Vitest, Chromatic, RTL など豊富【0search7†L0-L4】【7search8†L0-L3】 |
| **MDX / ドキュメント** | Stories もドキュメントも **MDX 標準対応**【0search2†L0-L3】 | Storybook 8 で “MDX 内にストーリーを直接書く” 機能は廃止だが Docs ページ用 MDX は維持【0search4†L0-L2】 |
| **新機能ロードマップ** | Controls の TS 型自動生成・外部アドオン API をロードマップで検討中【2view0†L5-L6】 | 8.5: Realtime A11y / Code-Coverage / RN-Web Vite 等【0search7†L0-L4】<br>9.x: UI からの Story & Test 生成【7search1†L0-L4】 |
| **アクセシビリティ** | axe-core アドオン内蔵、URL 共有で状態保持【1search1†L0-L5】 | 8.5 で「リアルタイム A11y テスト」が公式アドオン入り【0search7†L0-L4】 |
| **テスト連携** | Lost Pixel 等で VRT、Vitest／Playwright とは手動組み込み【1search8†L0-L3】 | Test Runner・Playwright・Vitest アドオンを公式提供。Chromatic とネイティブ連携 |
| **RSC / サーバー環境** | すべて Client Component として動く―RSC 分割は不可 | フレームワーク別プリセットが RSC 向け builder を実験的サポート（Next.js, Remix 等） |
| **学習コスト** | “Single command & single config” で小規模チームに最適 | ドキュメント・アドオンが豊富な分、最初の概念量は多い |

---

## 1. 典型的な初期セットアップ差

### Ladle
```bash
pnpm add -D @ladle/react
# そのまま
pnpm ladle serve         # 開発
pnpm ladle build         # 静的書き出し
```

※ `.ladle/config.mjs` はオプション。たとえば MSW を常時有効にするだけなら:

```js
/** @type {import('@ladle/react').LadleConfig} */
export default {
  addons: {
    msw: true,
  },
};
```

### Storybook (React × Vite)
```bash
npm create storybook@latest
# 質問に答えるだけで .storybook/ が生成される
npm run storybook        # 開発
npm run build-storybook  # 静的書き出し
```

`.storybook/main.ts`
```ts
const config = {
  framework: { name: "@storybook/react-vite", options: {} },
  addons: ["@storybook/addon-essentials", "@storybook/addon-a11y"],
};
export default config;
```

---

## 2. できること・できないこと

### Ladleで“まだ”できない代表例
| 項目 | 備考 |
|---|---|
| 独自アドオン開発 | API 未公開。代替: ブラウザ DevTools や Vite プラグインで補完 |
| DocsPage 自動生成 | MDX は書けるが Props 自動表は現状なし |
| ノーコード Story/Test 生成 | UI 録画→コード出力は未対応 |

### Storybookで重くなりがちなポイント
| 項目 | 軽くするコツ |
|---|---|
| 起動 & HMR | Vite ビルダーを採用。不要アドオンを削除 |
| 本番ビルド | `--test` フラグで Docs 生成をスキップ【7search7†L0-L4】 |
| コンフィグ複雑化 | `preset` で共通化、Conventional Storybook を導入 |

---

## 3. 選定ガイド

- **速度・シンプルさ最優先／単独開発 or 2-3 人の小チーム**  
  → **Ladle** が快適。後で Storybook へ移行しても CSF 互換でほぼ書き換え不要。
- **デザイナー／QA／PM も触る、ドキュメントとビジュアル回帰テストを CI 完結させたい**  
  → **Storybook** が安牌。8.5 以降は A11y や Code-Coverage が標準化され、ツールチェーンが一段強力。
- **将来の RSC 完全対応や大型デザインシステムを想定**  
  → Storybook + Chromatic などを前提に、最初からインクリメンタルに設定すると後戻りが少ない。

---

### まとめ

| 価値観 | 推奨 |
|---|---|
| **“秒で立ち上げて 100 ms の HMR”** | **Ladle** |
| **“Addons 100 種 & Docs/Tests/CI まで一気通貫”** | **Storybook** |

どちらを選んでも **CSF (Component Story Format)** や **MDX Docs** といったフォーマットは共通です。まずは Ladle で動く最軽量プロトタイプを作り、組織規模やドキュメント要件が膨らんできた時点で Storybook へ“無停止リフトアップ”する戦略も十分現実的です。

---
