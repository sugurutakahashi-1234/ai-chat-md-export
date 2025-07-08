# Vitest Playwright 設定と違い

Date: 2025-06-19

---

## 👤 User
*2025-06-19 10:59:18*

ストーリーブックを導入したら、 vitest.shims.d.tsというファイル名で、 いかが記述されたファイルが作られた。 
```
/// <reference types="@vitest/browser/providers/playwright" />
```

ストーリーブック導入前からBテストを使っていたので、設定ファイルはあったが、いろいろ追記されてこのような形になった。 |

/// &lt;reference types="vitest/config" /&gt;

import path from "node:path";
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: "jsdom",
    css: true,
    // CSSの処理を有効化
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["**/*.config.*", "**/src/generated/**", "**/src/test/**"],
    },
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, ".storybook"),
          }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: "playwright",
            instances: [
              {
                browser: "chromium",
              },
            ],
          },
          setupFiles: [".storybook/vitest.setup.ts"],
        },
      },
    ],
  },
});


ここで質問なのが、 vitest.shims.d.ts は何のために存在するのか。 
 また。、playwright と vitestそれぞれ何が得意で何が不得意なのか。 
教えてほしい。 

もしかするとまだ、 playwright の設定は行ってないかもしれない。設定ファイルすらない。 

ちなみに今このようなテストを書いている。 
const meta: Meta&lt;
  ForwardRefExoticComponent&lt;ButtonProps & RefAttributes&lt;HTMLButtonElement&gt;&gt;
&gt; = {
  title: "Design System/UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["primary", "secondary", "ghost"],
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
    },
    fullWidth: {
      control: { type: "boolean" },
    },
    loading: {
      control: { type: "boolean" },
    },
    disabled: {
      control: { type: "boolean" },
    },
  },
} satisfies Meta&lt;typeof Button&gt;;

export default meta;
type Story = StoryObj&lt;typeof meta&gt;;

// 基本的なボタン
export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Primary Button",
  },
};

---

## 🤖 Assistant
*2025-06-19 10:59:35*

### なぜ *vitest.shims.d.ts* が作られたのか

```ts
/// <reference types="@vitest/browser/providers/playwright" />
```

* **役割**  
  *TypeScript* は `vitest` の **ブラウザモード**（`test.browser`）で追加される _Playwright プロバイダー_ の API を標準では認識できません。  
  `@vitest/browser/providers/playwright` 型定義を “明示的に読み込む” ことで、  
  * `browser`, `page`, `expect.extend` など Playwright 由来のグローバル* に対する型安全・補完を有効にします。  
  Vitest 公式ガイドでも、`tsconfig.json` に追加するか **shim ファイル**を置く 2 つの方法が紹介されています。citeturn0search7

* **生成タイミング**  
  Storybook の `@storybook/addon-vitest` が  
  1. `vitest` に **ブラウザプロジェクト**（`provider: "playwright"`）を追加  
  2. 上記型への参照を含む `vitest.shims.d.ts` を作成  
  というセットを自動で行います。citeturn0search2  
  したがって *tsconfig* を手で編集する必要はありませんし、削除すると型エラーが出ます。

---

### Vitest と Playwright ― それぞれの得意分野

|            | **Vitest** | **Playwright (＋Playwright Test)** |
|------------|-----------|------------------------------------|
| **主用途** | ユニット／コンポーネント／軽量結合テスト | E2E／UI 回帰／クロスブラウザ自動化 |
| **実行速度** | **非常に高速**（Vite の HMR ＋ JSDOM） | ページロードが入る分やや遅い |
| **ブラウザ制御** | JSDOM または *Vitest Browser* 経由で実ブラウザ（内部で Playwright を使用） | Chromium / Firefox / WebKit を直接操作 |
| **デバッグ体験** | ソースマップ＋ watch が強力 | DevTools & Tracing で画面遷移を詳細分析 |
| **モジュールモック** | `vi.mock` が標準で強力 | 基本はブラックボックス、モックは MSW 等と併用 |
| **弱点** | 本物のブラウザ API 差異・レスポンシブ検証は不得手 | 細かいユニットテストにはオーバーキル、実行コスト高 |
| **典型例** | React コンポーネントのクリック動作、関数の戻り値検証 | サインアップ→ログイン→ダッシュボード表示の一連フロー |

&gt; **ポイント**  
&gt; *Storybook × Vitest* の “ブラウザプロジェクト” は  
&gt; **「ランナー＝Vitest」「ブラウザ起動＝Playwright」** というハイブリッド構成です。  
&gt; Playwright 独自の *playwright.config.ts* が無くても、Vitest 側の `test.browser` 設定（質問文にある `provider:"playwright"` ブロック）だけで動きます。citeturn0search0turn0search8

---

### まとめと次の一手

1. **`vitest.shims.d.ts` はそのまま残す**  
   - 型補完が効く → Playwright API を使ったテストでもコンパイルエラーが出ない。  
2. **今の設定で最低限の Playwright 実行環境は完成**  
   - `vitest run --browser` または通常の `vitest` 実行で Storybook の各 Story が実ブラウザ上でテストされます。  
3. **E2E も書きたい場合**  
   - 画面全体のフロー検証や視覚回帰テストは Playwright Test を“単独”で追加するか、Vitest のブラウザプロジェクト内で `page.goto()` などを活用すると良いでしょう。  

Vitest ＝高速なユニット／コンポーネントテスト、  
Playwright ＝信頼性の高い E2E／クロスブラウザ検証、  
──と覚えておけば役割分担がクリアになります。

---
