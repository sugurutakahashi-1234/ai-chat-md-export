# Mermaid拡大OFF:カスタムCSS

日付: 2024-06-10

---

## 👤 ユーザー
*2024/06/10 12:12:11*

マーメイド 拡大 機能 OFFにする方法 Github

---

## 🤖 アシスタント
*2024/06/10 12:12:31*

GitHubでマーメイド（Mermaid）ダイアグラムの拡大機能をオフにする具体的な方法は公式には提供されていませんが、カスタムCSSを使用して拡大機能を制限することができます。GitHubはマーメイドダイアグラムのレンダリングにMermaid.jsを使用していますので、以下の方法で試してみてください。

### カスタムCSSを使用する方法

1. **カスタムCSSを作成する**

   拡大機能をオフにするために、以下のようなカスタムCSSを作成します。

   ```css
   .mermaid {
       pointer-events: none;
   }
   ```

   このCSSは、マーメイドダイアグラムのクリックイベントを無効にします。

2. **カスタムCSSをGitHubに適用する**

   GitHubのユーザー設定で直接カスタムCSSを適用することはできませんが、ブラウザ拡張機能を使用してカスタムCSSを適用することができます。

   - **Stylus拡張機能を使用する**

     1. ブラウザに[Stylus](https://addons.mozilla.org/firefox/addon/styl-us/)(Firefox) または[Stylus](https://chrome.google.com/webstore/detail/stylus/clngdbkpkpeebahjckkjfobafhncgmne)(Chrome)をインストールします。
     2. Stylusをインストール後、拡張機能のオプションから新しいスタイルを追加します。
     3. 新しいスタイルに上記のカスタムCSSを貼り付け、対象のサイトを`github.com`に設定します。

これで、GitHub上のマーメイドダイアグラムに拡大機能が無効になります。

### GitHub Pagesを使用する場合

もしGitHub Pagesを使用している場合は、カスタムCSSを適用するのがもう少し簡単になります。次のようにします。

1. **GitHub PagesリポジトリにCSSファイルを追加する**

   例えば、`assets/css/custom.css`という名前でCSSファイルを作成し、次の内容を追加します。

   ```css
   .mermaid {
       pointer-events: none;
   }
   ```

2. **HTMLファイルでCSSファイルを読み込む**

   GitHub Pagesで使用しているHTMLテンプレートに、上記のCSSファイルを読み込むように追加します。

   ```html
   <link rel="stylesheet" href="assets/css/custom.css">
   ```

これにより、GitHub Pagesにホストされたページ上でマーメイドダイアグラムの拡大機能が無効になります。

上記の方法を試して、うまくいかない場合は詳細を教えていただければ、さらに具体的なサポートを提供できます。

---
