# Storybook パッケージ分離案

日付: 2025-06-20

---

## 👤 ユーザー
*2025/6/20 11:02:55*

TypeScriptでモノレポを採用しているこの際に、Webクライアントのパッケージとサーバーのパッケージと共通項目のパッケージに分かれている。そして今、storybookのSDKを入れようとしているこのSDKについて別パッケージに分けるべきか、それともWebクライアントと同じパッケージに一緒に入れておくべきか、意見を聞かせてほしい。ちなみにできればパッケージを分離したいんだ。その時にCSSの共有などはどうやって行えばいいのか教えてほしい。

---

## 🤖 アシスタント
*2025/6/20 11:03:04*

### 1. “別パッケージに切り出す”か“Web クライアントと同居”か

|  | まとめて入れる（`packages/web` 内） | 切り出す（例 `packages/storybook`） |
|---|---|---|
| **初期セットアップの手軽さ** | ✅　`pnpm add -D @storybook/react` で完結 | ⬜　新しい `package.json` と workspace 設定が必要 |
| **依存の分離** | ⬜　Web 本番ビルドにも Storybook の巨大な devDeps が入る | ✅　Storybook 専用 deps だけを持てる |
| **キャッシュ効率 (Turbo / Nx)** | ⬜　アプリ改修＝Web も Storybook も毎回リビルド | ✅　変更が Storybook に関係ない場合はスキップ可 |
| **将来の多アプリ対応** | ⬜　Web だけにストーリーが縛られる | ✅　モバイルや UI ライブラリのストーリーも統合しやすい |
| **DX (VSCode で story ファイル補完など)** | ✅　設定がひと目で分かる | ⬜　package を跨ぐ import パスがやや長くなる |

Storybook チームや Turborepo/Nx のコミュニティでは「**独立した “docs アプリ” として Storybook を持つ方が中長期で管理が楽**」という声が優勢です citeturn0search0turn0search2。  
あなたも **「将来ほかの UI パッケージも増えるかもしれない」「依存をスリムに保ちたい」** という意図であれば、`packages/storybook` の分離構成を強くお勧めします。

---

### 2. 推奨ディレクトリ構成（pnpm workspaces 例）

```text
root/
├─ package.json          # dev スクリプトのみ (lint, format など)
├─ turbo.json / nx.json  # 任意
├─ packages/
│  ├─ web/               # Next.js / Vite Web クライアント
│  ├─ server/            # Hono / Express など
│  ├─ shared/            # 型定義・hooks・tailwind config など
│  └─ storybook/         # 👈 ここが新規
│      ├─ .storybook/
│      ├─ package.json
│      └─ stories/       # 各パッケージから import
```

ポイント

1. **`packages/storybook/package.json`** に Storybook 本体とアドオンを *devDependencies* としてだけ持たせる。
2. **`stories` 配列** にはワイルドカードで他パッケージを解決します。

```ts
// packages/storybook/.storybook/main.ts
export default {
  framework: '@storybook/react-vite',
  stories: [
    '../../web/src/**/*.stories.@(tsx|mdx)',
    '../../shared/src/**/*.stories.@(tsx|mdx)',
  ],
  addons: ['@storybook/addon-essentials'],
};
```

Storybook 9 以降は CLI がマルチパッケージ検索を公式サポートしているため、グロブだけで認識できます citeturn0search7。

---

### 3. CSS／デザイントークンの共有方法

| アプローチ | 仕組み | Web からの使い方 | Storybook からの使い方 |
|------------|--------|------------------|-----------------------|
| **① `@myorg/tailwind-config`** | `tailwind.config.ts` と PostCSS プラグインを共有パッケージ化 | `tailwind.config.js` で `extends: require('@myorg/tailwind-config')` | `.storybook/main.ts` の `viteFinal` で同様に `tailwindcss()` を注入 |
| **② CSS-in-JS / vanilla-extract** | `shared` に design tokens・utility 関数を置く | `import { sprinkles } from '@myorg/shared/styles'` | stories でも同じ import |
| **③ プレーン CSS / SCSS** | `shared/styles/*.scss` を公開 | Web の `entry.tsx` で `import '@myorg/shared/styles/main.scss'` | Storybook の `preview.ts` で `import '@myorg/shared/styles/main.scss'` |

要は **“スタイルをコードとして publish する”** だけで十分です。Storybook 側の Vite/Webpack 設定にその loader を追加すれば、同一パッケージでも別パッケージでも動作に差はありません。大型プロジェクトでは **Tailwind config をパッケージ化** する ① がもっともメンテしやすいです citeturn0search4。

---

### 4. ビルド & CI の流れ（Turbo 例）

```jsonc
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "storybook:build": {
      "dependsOn": ["web#build", "shared#build"],
      "outputs": ["packages/storybook/build/**"]
    }
  }
}
```

- `pnpm turbo run build` : サーバー / Web / shared を通常ビルド  
- `pnpm turbo run storybook:build` : 変更が `packages/storybook/**` と依存の “affected” なパッケージに限定されるため、高速

---

### 5. 結論

- **将来の拡張性・依存のスリム化・CI パイプライン最適化** を考慮すると **Storybook 用パッケージを独立させる** 方がメリット大。  
- CSS は **“スタイル専用または design-token パッケージ”** に切り出し、Web と Storybook から同じ import で利用する。  
- Storybook 9 以降の **グロブ探索と Vite ベースの柔軟な loader** を使えば、別パッケージでも設定はシンプル。  

この構成であれば **モノレポの恩恵 (コード共有・キャッシュ効率) を最大限使いながら、Storybook をプロダクション依存から完全に切り離せます**。

---

## 👤 ユーザー
*2025/6/20 11:09:21*

&gt;Storybook 9 以降の グロブ探索と Vite ベースの柔軟な loader を使えば、別パッケージでも設定はシンプル。

こちらについてよくわかっていない。
すでにwebパッケージがある状態でどんな手順で作ればいいか教えて欲しい
Storybook v9を新規に始める際にどこに気をつければいいか教えて欲しい。ちなみにwebはviteを使っている

---

## 🤖 アシスタント
*2025/6/20 11:09:30*

以下は **「すでに `packages/web` (Vite) があるモノレポ」に Storybook v9 を“専用パッケージ”として追加する** 最短ルートと、ハマりやすいポイントです。

---

## 0. 前提バージョン

| ツール | 推奨 |
|--------|------|
| Node   | ≥ 18 |
| pnpm   | ≥ 8 |
| Vite   | ≥ 5 |
| Storybook | 9.0 以上 (2025-06 GA) citeturn0search1 |

---

## 1. パッケージを作る

```bash
# ルートで
pnpm dlx create-storybook@latest \
  --framework react-vite \
  --type ts \
  --story-format csf \
  packages/storybook   # <-- 新パッケージ名
```

> `create-storybook`（v9 から CLI 名が変わりました）を **ターゲットフォルダを指定して実行** すれば、そこに  
> `package.json` と `.storybook/` 以下が生成されます。  
> CLI は `@storybook/react-vite` を自動インストールするので追加で `builder-vite` を入れる必要はありません citeturn1search0。

---

## 2. `.storybook/main.ts` を修正（ストーリー探索 & Vite 拡張）

```ts
import { mergeConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const root = new URL('../../', import.meta.url).pathname; // モノレポ root

export default {
  framework: '@storybook/react-vite',          // ← Vite ビルダー
  stories: [
    `${root}packages/web/src/**/*.stories.@(tsx|mdx)`,
    `${root}packages/shared/src/**/*.stories.@(tsx|mdx)`,
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    // 必要なら '@storybook/test', '@storybook/addon-a11y', など
  ],
  viteFinal: (config) =>
    mergeConfig(config, {
      plugins: [tsconfigPaths()],
      // @myorg/* の alias は tsconfig から自動で解決
      optimizeDeps: { include: ['@myorg/shared'] },
    }),
};
```

### ✔️ ここがポイント

1. **`stories` に他パッケージへのワイルドカードを直接書ける**  
   v9 ではパスの外だろうとグロブをそのまま列挙するだけで認識されます citeturn0search7。

2. **`viteFinal` でルート側の設定をマージ**  
   - `tsconfigPaths()` を入れておくと `paths` alias や `baseUrl` がそのまま効きます。  
   - `optimizeDeps.include` でワークスペースの依存をプリバンドルに含めると、初回 dev 起動が高速。

---

## 3. CSS / Tailwind を読み込む

### 共有 `tailwind.config` パッケージを使っている場合

```ts
// .storybook/main.ts の viteFinal に追記
import tailwindcss from 'tailwindcss';
import tailwindConfig from '@myorg/tailwind-config';

mergeConfig(config, {
  css: {
    postcss: {
      plugins: [tailwindcss(tailwindConfig)],
    },
  },
});
```

### プレーン CSS/SCSS を共有している場合

```ts
// .storybook/preview.ts
import '@myorg/shared/styles/main.scss';
```

> **Vite ベースなので loader 追加は Vite プラグイン or `css.postcss` に書くだけ**。  
> Web 側と Storybook 側で設定を共通ファイルにしておくと管理がブレません。

---

## 4. `packages/storybook/package.json` にスクリプト追加

```jsonc
{
  "name": "@myorg/storybook",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "dev": "storybook dev -p 6006",
    "build": "storybook build"
  },
  "devDependencies": {
    // CLI が自動で入れたもの
    "@storybook/react-vite": "^9.0.0"
  }
}
```

---

## 5. CI / タスクランナー (Turborepo 例)

```jsonc
// turbo.json
{
  "pipeline": {
    "build": { "outputs": ["dist/**"] },
    "storybook:build": {
      "dependsOn": ["web#build", "shared#build"],
      "outputs": ["packages/storybook/storybook-static/**"]
    }
  }
}
```

---

## 6. ハマりやすい罠 🪤

| 症状 | 原因 / 回避策 |
|------|---------------|
| **`pnpm` で React が二重に入る** | `storybook` パッケージ側では `react` を *peer* にし、実体は root `package.json` にだけ置く |
| **`ERR_MODULE_NOT_FOUND` (Vite)** | `stories` に書いたグロブが **ESM を import** していると Vite が最初の依存解決時にコケることがある → `viteFinal > optimizeDeps.include` に追加 |
| **Tailwind クラスが効かない** | Storybook の iframe が `@tailwind base` などを読めていない → `preview.ts` でグローバル CSS を import する or PostCSS プラグインを追加 |
| **TypeScript のパス alias が解決されない** | `vite-tsconfig-paths` を忘れている or `root` を誤指定。CLI 生成だと alias が無効なので手動で入れる |
| **Mono-repo 外エラー warning** | `.storybook/main.ts` の `stories` パスを `path.resolve` で絶対パスにするか、上記の URL 解決を採用 |

---

## まとめ

1. **`packages/storybook`** を `create-storybook@latest` で生成  
2. `.storybook/main.ts` に **他パッケージへのグロブ** と **Vite 拡張** を書くだけで OK  
3. **CSS/Tailwind は Vite プラグイン or `preview.ts` import** で共通化  
4. React・Tailwind・パス alias など **peer/loader の依存位置** だけ気をつければ、ビルドキャッシュも効いて快適に運用できます。

これで **Web クライアントと完全に独立した Storybook v9 パッケージ** が出来上がり。開発フローも CI もスリムになります。Enjoy!

---

## 👤 ユーザー
*2025/6/20 11:14:46*

pnpmを使っていてTailwind CSS V4に一本化している。tailwind.configは存在しないんだ。
どれをどうすれば共有できるのかな

---

## 🤖 アシスタント
*2025/6/20 11:15:18*

### Tailwind CSS v4 を **1 本の共有設定** にする 2 通りのやり方
Tailwind v4 では **「CSS ファースト」方式** が正式に入り、従来の `tailwind.config.js` も **preset** としてパッケージ化できます。  
どちらでもモノレポ（pnpm workspaces）で安全に共用できます。

---

## ① CSS ファースト + `@config` ディレクティブ（もっとも v4 っぽい）

```
root/
├─ packages/
│  ├─ web/
│  │   └─ src/style.css      ← @import / @config を書く
│  ├─ storybook/
│  │   └─ preview.css        ← 同じく
│  └─ tailwind-config/       ← 共有トークンだけを持つ
│      └─ index.js
```

1. **共有パッケージを作成**

   ```bash
   pnpm create -y       # or 手動で
   cd packages/tailwind-config
   pnpm add -w -D tailwindcss@4
   ```

   **`packages/tailwind-config/index.js`**

   ```js
   /** @type {import('tailwindcss').Config} */
   export default {
     theme: {
       colors: {
         brand: {
           DEFAULT: '#2d6cdf',
           light: '#5288e6',
         },
       },
       fontFamily: {
         sans: ['Inter', 'system-ui', 'sans-serif'],
       },
     },
   }
   ```

   > 共有側では **content 配列は不要** — v4 は自動検出します【turn1view0†L19-L21】。

2. **各 CSS エントリで参照する**

   ```css
   /* packages/web/src/style.css */
   @config "@myorg/tailwind-config";   /* ← これ一行で設定合流 */
   @import "tailwindcss";              /* v4 では 1 行 import だけ */

   /* 以下は自由に CSS を書く */
   ```

   `@config` の値は **npm スコープ** か **相対パス** のどちらでも OK。  
   v4 から追加されたディレクティブで、JS ファイルを丸ごと preset として取り込みます【turn5view0†L12-L13】。

3. **Vite / Storybook 側に Tailwind プラグインを差すだけ**

   ```ts
   // packages/web/vite.config.ts
   import { defineConfig } from 'vite';
   import tailwindcss from '@tailwindcss/vite';

   export default defineConfig({
     plugins: [tailwindcss()],
   });
   ```

   Storybook の `.storybook/main.ts` で `viteFinal` に `@tailwindcss/vite` を追加するのも同じ。

### ✨ メリット
* 「設定ファイル要らず」で **v4 の新思想に完全準拠**  
* 新しい `@theme` / `@plugin` など CSS 直書き API もそのまま使える

### ⚠️ 注意
* **VS Code の IntelliSense** が従来ほど賢く補完してくれない場合がある  
  → JS 方式が良ければ次のプリセット方式を使う

---

## ② 旧来型 `tailwind.config.ts` を **preset** として共有

Tailwind 3 と同じ書き味を保ちたいならこちら。

```
packages/tailwind-config/tailwind.preset.ts
```

```ts
import { type Config } from 'tailwindcss';

export default <Omit<Config,'content'>>{
  theme: {
    extend: {
      spacing: { 128: '32rem' },
      // …共通トークン
    },
  },
  plugins: [],
};
```

各パッケージ側:

```ts
// packages/web/tailwind.config.ts
import preset from '@myorg/tailwind-config';

export default {
  presets: [preset],           // ← ドキュメントどおり presets で継承【turn0search0†L0-L4】
  content: ['src/**/*.{ts,tsx,html}'], // v3 互換で書く場合
};
```

> v4 でも **`presets` は存続** しているので安心です。

### ✨ メリット
* 既存 v2/v3 の型注釈・Lint & IntelliSense がそのまま動く  
* テストや Storybook で **直に JS オブジェクトを import** できる  
  ```ts
  import tailwindPreset from '@myorg/tailwind-config';
  tailwindcss(tailwindPreset);
  ```

### ⚠️ 注意
* `corePlugins` / `safelist` / `separator` など一部オプションは v4 で非推奨 or 削除【turn5view0†L12-L13】  
* `content` 配列を置くと **自動検出が無効** になるので基本は空にしておくと v4 らしい運用になる

---

## 共有パッケージの `package.json` 例

```jsonc
{
  "name": "@myorg/tailwind-config",
  "version": "0.0.0",
  "private": true,
  "main": "index.js",       // preset なら "tailwind.preset.ts" をビルドしても可
  "peerDependencies": {
    "tailwindcss": "^4.0.0"
  }
}
```

> `tailwindcss` を **peerDependencies** にしておくと、  
> どのアプリ側でもバージョンを揃えやすくなります。

---

## どちらを選ぶ？

| 基準 | CSS ファースト (`@config`) | JS プレセット (`presets`) |
|------|---------------------------|---------------------------|
| **v4 の新機能を最大活用** | ◎ | △ |
| **既存 v3 プロジェクトからの移行** | △ (書き直し必要) | ◎ |
| **IDE 補完の充実度** | △ | ◎ |
| **他ツール（PostCSS/Linters）との親和性** | ◎ | ◎ |

> “**今ゼロから v4 に統一**” なら `@config` がシンプル。  
> “**既存コードも v4 に上げたい**” 場合は preset 方式で滑らかに移行するのがおすすめです。

どちらの方式でも **pnpm + Vite + Storybook** の全パッケージで **1 本のデザインシステムを完全に共有** できます。好きな構成でどうぞ!

---

## 👤 ユーザー
*2025/6/20 11:19:11*

今web パッケージの ソースのルートにある index.css では以下の記述しかない。 
この場合どうすればいいのか？

```
/* デザインシステムをインポート */
@import "./design-system/index.css";
```

これをストーリーブックから直接参照するのは良くないのか? 
よくわかってない。 


最終的にストーリーブックはデプロイする予定である。

---

## 🤖 アシスタント
*2025/6/20 11:19:11*

### 1️⃣ いまの状態を整理  
```
packages/
├─ web/
│   └─ src/index.css          ← これしか触っていない
│             └─ @import "./design-system/index.css";
├─ storybook/                 ← これから作る (または作った)
└─ shared/ or design-system/  ← 共通のトークン & CSS
```

- **Tailwind v4** は “CSS ファースト” なので **`index.css` がビルドの入口**。  
- `design-system/index.css` に `@config` や `@tailwind` が書いてあれば、  
  そこが **Tailwind の設定＋トークン＋ユーティリティ生成場所** になります。

---

## 2️⃣ Storybook にそのまま読ませても問題ない？  

### 直接 `packages/web/src/index.css` を import する場合
```ts
// packages/storybook/.storybook/preview.ts
import '../web/src/index.css';
```
✔️ **利点**  
* とにかく一行で済む。  
* Web と 100 % 同じ見た目になる。

❌ **欠点**  
| 課題 | 影響 |
|------|------|
| **他のアプリが増えたとき** | モバイル用 Storybook を作るときに `web` に依存してしまう |
| **不要な Web 固有スタイルが混ざる** | reset、layout 用クラスなど Storybook には不要なものもビルドされる |
| **ビルドキャッシュが効きにくい** | `web/src/**` を触るたび Storybook の再ビルドが走る |

> **「最小限のドキュメンテーション専用 UI」** にしたいなら、  
> **“デザインシステムだけ” を import** した方がスリムです。

---

## 3️⃣ 推奨：デザインシステムをパッケージ化して Storybook も直接 import

### (A) 共有パッケージ名を決める
```
packages/design-system/           ← 既にあるならそのまま
│  ├─ index.css
│  └─ tailwind.config.js (または index.js preset)
```
`package.json` 例:
```jsonc
{
  "name": "@myorg/design-system",
  "version": "0.0.0",
  "private": true,
  "main": "index.css",
  "files": ["index.css", "tailwind.config.js"],
  "peerDependencies": { "tailwindcss": "^4" }
}
```

### (B) Web と Storybook 両方で同じ import
```css
/* packages/web/src/index.css */
@import "@myorg/design-system/index.css";
```
```ts
// packages/storybook/.storybook/preview.ts
import '@myorg/design-system/index.css';
```

### (C) Storybook Vite 設定
```ts
// packages/storybook/.storybook/main.ts
import { mergeConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default {
  framework: '@storybook/react-vite',
  viteFinal: (config) =>
    mergeConfig(config, { plugins: [tailwindcss()] }),
};
```
これで **Web も Storybook も 1 本の CSS/トークン** を見るだけになります。

---

## 4️⃣ デプロイ時の静的ビルド (`storybook build`)
1. Storybook (Vite ビルダー) が `@import "@myorg/design-system/index.css";` を解析  
2. `design-system` パッケージの Tailwind 設定を読み込み → 必要なクラスだけ生成  
3. `storybook-static/` に **最適化された単一 CSS** とバンドル済み JS が出力  
   → GitHub Pages / Netlify などにそのままアップロードすれば OK

> **Tailwind v4 は “content 自動検出”** なので `content` 配列を空にしておけば  
> Storybook が生成 JS/MDX もスキャンし、**不要クラスを自動で tree-shake** してくれます。

---

## 5️⃣ まとめ & “やることリスト”

| 手順 | 内容 |
|-----|------|
| 1 | **`packages/design-system`** を workspace に昇格（なければ作成） |
| 2 | `index.css` ＋ Tailwind preset(`tailwind.config.js` or `index.js`) を置く |
| 3 | `web/src/index.css` と `storybook/preview.ts` から **同じパスで import** |
| 4 | Storybook の `viteFinal` に `@tailwindcss/vite` を足す |
| 5 | `pnpm storybook dev` → UI が崩れていないか確認 |
| 6 | `pnpm storybook build` して `storybook-static` をホスティングへ |

こうしておけば

* **依存が完全に 1 箇所**  
* **Web 変更 ≠ Storybook 再ビルド**（デザインシステムが変わらない限り）  
* 将来 **別 UI パッケージ** が増えても同じデザインを適用可能

…という三拍子そろった構成になります。

---

## 👤 ユーザー
*2025/6/20 11:22:15*

ちょっとよくわかっていないのはストーリーブックで確認したいのは、デザインシステムで作ったものだけなんだ。 この中で このコンポーネントでは Tailwind CSS を使っているんだけれども、それでもインデックスCSSの情報は渡さないといけないんだっけ? 
ストーリーブック上であまり、テールウィンドCSSを使うような予定はない。 
デザインシステムのもののUIを確認したいだけなんだ。 

packages/web-client/src/design-system/index.ts

```
/**
 * デザインシステムのパブリックAPI
 * すべてのコンポーネント・トークン・ユーティリティのエクスポート
 */

export type { ButtonProps } from "./ui/Button";
export { Button } from "./ui/Button";
export type { SpinnerProps } from "./ui/Spinner";
export { Spinner } from "./ui/Spinner";
```

---

## 🤖 アシスタント
*2025/6/20 11:22:16*

#### まず結論だけ先に
- **Tailwind のユーティリティで描画される以上，Storybook 側にも *必ず* Tailwind がビルドされた CSS を読み込ませる必要があります。**  
  「Storybook でクラスを書かない」＝「Tailwind の CSS が要らない」ではありません。  
  Button や Spinner が `class="flex gap-2 bg-brand"` などを持っているなら，それを解釈できる CSS が Storybook に届いていなければ見た目は壊れます。

---

## なぜ “index.css を渡す or 生成” が要るのか？

| 役割 | どこで必要？ |
|------|--------------|
| `@tailwind base` など **プリフライト** | コンポーネントのリセットスタイルが効くように |
| `@tailwind utilities` で生成される **ユーティリティ全部** | `class="flex gap-2"` などを解決 |
| **あなたのカスタムトークン**（`--color-brand` など） | デザインシステム固有の色・間隔 |

> これらは **“どこかで 1 回だけ” Tailwind CLI / Vite プラグインを通して CSS を生成** し，その出力を Storybook に読み込ませれば OK。  
> `index.css` に入っているのがそれなら「渡す」のが手っ取り早いし，  
> もっとミニマルにしたければ **Storybook 専用の CSS を 3 行で用意してビルド** しても良い，という選択肢になります。

---

## 最小パターン ① : 既存 `index.css` をそのまま読む

```ts
// packages/storybook/.storybook/preview.ts
import '../web-client/src/index.css';   // ← これだけ
```

### いつ向く？
- Web と見た目を **1px たりとも変えたくない** とき
- デザインシステムが Web 固有の CSS と物理的に混在しておらず，肥大化しても気にしないとき

### デメリット
- `web-client/src` に触れるたび Storybook のキャッシュが失効する  
- 将来，モバイルアプリ向け Storybook などを作るときに横依存が邪魔になる

---

## 推奨パターン ② : Storybook 用に “3 行だけ” の CSS を置く  

1. **Storybook パッケージに空ファイルを用意**  
   ```
   packages/storybook/preview.css
   ```
   ```css
   @config "@myorg/design-system/tailwind.config.js";   /* ← 共有設定を参照 */
   @tailwind base;
   @tailwind utilities;
   /* components を入れたければ @tailwind components; */
   ```

2. **Storybook 設定で読み込む**
   ```ts
   // .storybook/preview.ts
   import './preview.css';
   ```

3. **`.storybook/main.ts` に Vite プラグイン**
   ```ts
   import { mergeConfig } from 'vite';
   import tailwindcss from '@tailwindcss/vite';

   export default {
     framework: '@storybook/react-vite',
     viteFinal: (config) =>
       mergeConfig(config, { plugins: [tailwindcss()] }),
   };
   ```

### メリット
| | |
|-|-|
| **読み込む CSS が最小限** | Storybook がビルド時にコンポーネント&storiesだけをスキャンし，本当に使われるユーティリティしか生成しない |
| **web-client に依存しない** | デザインシステムをネイティブアプリ/別 Web アプリでも再利用しやすい |
| **キャッシュ効率が良い** | デザインシステムに変更が無い限り Storybook ビルドはスキップ可能 |

---

## よくある疑問 Q&A

| Q | A |
|---|---|
| **コンポーネント内で `clsx()` など動的にクラスを組み立てるけど自動検出に引っかかる？** | v4 の JIT は静的解析が前提。動的生成が多いなら <br>① safelist を preset に書く ② `@apply` で事前抽出する — のどちらかで対応 |
| **Tailwind を Storybook に peerDependency で持たせるべき？** | `@myorg/design-system` を peer にしておき，Tailwind は <br>**root だけ** に 1 本入れておくのが衝突が少ない |
| **デプロイ時のサイズが気になる** | パターン②なら Storybook ビルドの post-CSS で <br>不要クラスを落とすため，本番ホスティング用 CSS はかなり小さくなる |

---

## まとめ ― どちらを採る？

| 要件 | 取るべき手段 |
|------|--------------|
| **“Web 完全コピー” が最優先** | パターン①：index.css を直接 import |
| **Storybook を <br>デザインシステムのドキュメンテーション専用にしたい** | パターン②：3 行 CSS (+ Tailwind プラグイン) |

**“デザインシステムだけ見たい”** という今回の目的なら、  
> **パターン②：Storybook 用 preview.css に @config + @tailwind だけ書く**  
がもっともシンプルでメンテしやすい構成になります。

---

## 👤 ユーザー
*2025/6/20 15:27:00*

ちなみにこれはどのくらいデメリットなのか。 モバイルアプリ向けのストーリーブックも同じストーリーブックでやりたい。 

デメリット
	•	web-client/src に触れるたび Storybook のキャッシュが失効する
	•	将来，モバイルアプリ向け Storybook などを作るときに横依存が邪魔になる

---

## 🤖 アシスタント
*2025/6/20 15:27:19*

### デメリットの“重さ”をもう少し定量化すると…

| デメリット | 症状が起きるタイミング | 具体的な影響度 | 回避策 |
|------------|----------------------|---------------|--------|
| **① web-client にさわるたび Storybook のキャッシュが失効** | `packages/web-client/src/**` の **JS/TS/CSS を編集 → 保存** | Vite ビルダーの場合、**依存グラフを再計算 → 再バンドル**。<br>経験値ベースですが *300〜500 モジュール* 規模で **5〜10 秒**、*1000+* で **15 秒超** になるケースも。<br>開発者 5 人×1 日 100 ビルド ⇒ 数十分が待ち時間になる | - Storybook v9 で CPU キャッシュは 48 % 軽量化されたが、それでもフル再バンドルは走る citeturn0search2。<br>- `optimizeDeps.include` を細く絞る or そもそも **web 専用ファイルを外部参照にしない** |
| **② モバイル向け Storybook と横依存が発生** | React Native / Expo 用 Storybook を同じビルドで回そうとした時 | - **CSS が衝突**: Web 用リセットや `flex` 方向のデフォルトがネイティブのコンポーネント表現を壊す<br>- **ビルダー非対応**: 1 つの Storybook では *異なるフレームワーク混在* が公式にサポートされていない（React Native は専用パッケージ）citeturn0search1turn0search12 | - **Storybook Composition** を使い、<br>  「Web 用 Storybook」「RN 用 Storybook」を**別々にビルドし、URL で合体**させる citeturn1search0 <br>- 共有したいのは **デザインシステムの Story だけ** に絞る |

> **結論**  
> *Web の `index.css` を丸ごと import する方式* は **小規模・単一ターゲット** なら大した負担ではありません。  
> しかし **「将来モバイル Storybook も同居」「開発人数・モジュール数が増える」** なら、  
> **キャッシュ無効化による待ち時間 + CSS 衝突** がじわじわ効いてきます。

---

## “同じ Storybook 画面で Web & モバイルを並べたい”場合の最適解

### 1. 各ターゲットごとに **ビルドを分離**  
| ビルド | フレームワーク | 出力 | 役割 |
|--------|---------------|------|------|
| `packages/storybook-web`   | `@storybook/react-vite` | `web-static/` | Web コンポーネント用 |
| `packages/storybook-mobile`| `@storybook/react-native` (`storybook start` on-device) + `@storybook/react-vite` (ドキュメント用) | `mobile-static/` | React Native コンポーネント用 |

*React Native* は **on-device 開発用** と **静的ドキュメント用** の 2 モードがありますが、後者 (`storybook export`) で静的 HTML を吐き出せば **URL で参照可能** になります。

### 2. **Storybook Composition** でひとつに統合  
ホスト側（例: `packages/storybook-web`）の `.storybook/main.ts`:

```ts
export default {
  refs: {
    mobile: {
      title: '📱 Mobile Components',
      url: 'https://example.com/mobile-static',  // ← CI で公開した URL
    },
  },
};
```

これで **サイドバーに “Mobile Components” が合流**。  
ビルドもキャッシュも **Web とモバイルが完全に独立** しつつ、閲覧は 1 画面で済みます。

### 3. デザインシステムだけを共通化  
- `@myorg/design-system`（UI Kit + Tailwind preset）を **peerDependency** に  
- 各 Storybook の preview で **同じ CSS** (`@config "@myorg/design-system/tailwind"`) を読み込む  
- Story は **design-system のみ** を import（各アプリ固有 UI は読み込まない）

---

## いつ “index.css 直接 import” で済ませても構わないか？

1. **チーム人数が少なく（≲3）リビルド待ちが気にならない**  
2. **Web 優先** でモバイル Storybook を *当面* 運用しないまたは別リポジトリ  
3. **CSS 衝突の可能性がゼロ**（design-system が完璧にフレームワーク非依存なら）

この条件なら **実害は小さく**、導入コストが低い方法です。

---

## まとめ

| シナリオ | 推奨構成 |
|----------|----------|
| **当面は Web だけ**、スピード重視 | `index.css` を直接 preview へ import |
| **数ヶ月以内にモバイル Storybook も同居予定**<br>or **モジュール数が多くてビルドが重い** | - Web / モバイル Storybook を *別々にビルド*<br>- **Storybook Composition** で 1 画面に統合<br>- 共有 Tailwind preset を peerDependency にして最小 CSS だけ読む |

> **デザインシステムだけ確認したい** という現在の目的に加えて  
> **未来のモバイル展開** を見据えるなら、  
> **「ビルド分離 + Composition」** が最もコストパフォーマンスの良い選択になります。

---

## 👤 ユーザー
*2025/6/20 15:29:24*

ちなみに、ReactプログラムとReact Nativeプログラムは、 ある程度共通化した方がいいのか、それともそれぞれ独立に作った方が、多少重なるコンポーネントもあるが、効率的な開発ができるのか。

---

## 🤖 アシスタント
*2025/6/20 15:29:25*

### “どこまで共通化するか” は **3 層** で分けて考えると判断しやすい

| 層 | 共有しやすさ | 具体例 | コメント |
|----|---------------|-------|----------|
| **1. ドメインロジック／ユーティリティ** | ★★★★★（必ず共有） | API クライアント、バリデーション、型定義、日付・数値フォーマッタ、Zod スキーマ、ステート管理 hooks など | 画面に依存しないので **100 % 共通パッケージ** に切り出す一択 |
| **2. デザイントークン／スタイルシステム** | ★★★★☆（基本共有） | Tailwind preset・tokens、color scheme、spacing scale、テーマ切替 hook | すでに `@myorg/design-system` を作っているので **Web/RN 双方で同じ値を読む**。<br>Tailwind v4 なら NativeWind や Tamagui 経由で RN 側にも流用可能 |
| **3. 表示コンポーネント** | ★★☆☆☆（状況次第） | `<Button>`, `<Input>`, `<Modal>` など UI | **共通化の手間 ↔ 重複の許容度** を天秤にかける層 |

---

## 3 層目（UI コンポーネント）を “どこまで” 共通化するかの判断基準

| 判断軸 | 共通化 **する** と良いのは… | 共通化 **しない** (別実装) がラクなのは… |
|--------|-----------------------------|-------------------------------------------|
| **画面仕様の一致度** | デスクトップとモバイルで**ほぼ同じレイアウト/挙動**<br>例: Admin パネルを PWA としても配布 | ネイティブ特有 UI が多く**挙動が違う**<br>例: <br>- スワイプジェスチャ / Haptic<br>- iOS/Android で別 OS API を叩く |
| **チーム構成** | 同じ開発者が両ターゲットを担当<br>→ “一筆書き” した方が速い | Web・モバイルで **担当チームが分かれる**<br>→ 依存を切って並行開発しやすい |
| **デザイナーの指示** | **統一ガイドライン** が厳密：ピクセル一致が要求される | プラットフォームの **ネイティブ感** を優先 |
| **技術スタック** | - `react-native-web`/Expo Router で **単一コードベース** を狙う<br>- Tailwind 互換の **NativeWind/Tamagui** を採用 | - Web は **Vite/React で SSR**<br>- モバイルは **純 Expo** + OS ブリッジ<br>→ ランタイム／ビルドツール差が大きい |

---

## 具体的なおすすめ構成（“いいとこ取り”）

```
packages/
├ ui-web/           ← Web 専用プレゼンテーション層
├ ui-native/        ← React Native 用
├ design-system/    ← tokens + Tailwind preset (v4)
├ hooks/            ← ビジネスロジック・API クライアントなど
└ app/
    ├ web-client/
    └ mobile-client/
```

1. **ロジック & トークンは 100 % 共有**  
   - `hooks/` で API, Zustand/React-Query hooks を共通化  
   - `design-system/` でカラーパレット・spacing・tailwind preset を共通
2. **UI は “薄いラッパー” で 2 実装**  
   - 共通 Props *interface*（例: `ButtonProps`）だけを `ui-shared/` に置く  
   - 実体は `ui-web/Button.tsx`, `ui-native/Button.tsx`
3. **Storybook も二段構え**（前回案）  
   - `storybook-web`：`ui-web` + `design-system`  
   - `storybook-native`：`ui-native`（NativeWind/Tamagui で Tailwind トークンを解決）  
   - **Composition** で 1 URL に統合

> **メリット**  
> - 共通ロジックは 1 実装なのでバグが片方だけ直らない問題が減る  
> - UI はプラットフォーム最適化を犠牲にしない  
> - 各チームが **独立 CI/CD** → リリース速度を落とさない

---

## “ほぼ全部共通にしたい” 場合の現実的な上限

- **`react-native-web` が許容できるレイアウト制約**（例: 一部 CSS プロパティ非対応）  
- **依存ライブラリがクロスプラットフォーム対応しているか**（e.g. Recharts, Mapbox GL などは別物）  
- **パフォーマンス**：重い Web ライブラリを RN Bundle に含めると 10 MB 超えは珍しくない  
- **ストア審査**：iOS/Android 向けはパッケージサイズ 200 MB が目安。Web 資産を過度に抱えると超過リスク

---

## まとめ

| 方向性 | こんなとき採用 |
|--------|---------------|
| **ロジック・トークンだけ共有 + UI は別実装**（多くの企業がここ） | - Web とネイティブで UX が結構違う<br>- チームも分かれる or 今後拡大予定 |
| **`react-native-web` でフル共通** | - 社内に RN スペシャリストがいて、全プラットフォーム同時リリースが KPI<br>- UI/UX をかなり揃えたい <br>（＝“モバイルファースト Web” が主眼） |

いずれにしても **「まず共通パッケージ化するのはトークン・ロジック」→ UI は“必要に応じて” 近づける** のが、大規模化しても後戻りしやすく、最終的に開発効率が高いアプローチです。

---
