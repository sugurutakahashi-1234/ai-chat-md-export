# Swift WebViewでJavaScript注入

日付: 2023-06-11

---

## 👤 ユーザー
*2023/6/11 18:00:35*

Swift、WebViewにjavascriptを埋め込みたいのですが、css-selector-generatorのライブラリをインポートして埋め込むことなどできますか？

---

## 🤖 アシスタント
*2023/6/11 18:01:32*

もちろん、それは可能です。JavaScriptのCSS Selector GeneratorライブラリをWebViewに埋め込むには、いくつかの手順を踏む必要があります。

以下に、その基本的なステップを示します:

1. **ライブラリのインポート:** CSS Selector GeneratorライブラリのJavaScriptファイルをあなたのプロジェクトに追加します。そして、このファイルをあなたのアプリにバンドル（組み込む）します。

2. **JavaScriptの読み込み:** 次に、このJavaScriptファイルを読み込むSwiftのコードを作成します。一般的には、`Bundle.main.path(forResource:ofType:)`を使用してバンドルされたJavaScriptファイルのパスを取得し、`String(contentsOfFile:encoding:)`を使用してファイルの内容を読み込むことができます。

    ```swift
    guard let path = Bundle.main.path(forResource: "your_js_file", ofType: "js"),
        let jsSource = try? String(contentsOfFile: path, encoding: .utf8) else {
            return
    }
    ```

3. **WebViewへのJavaScriptの注入:** これで、読み込んだJavaScriptコードをWebViewに注入できます。WKWebViewの場合、`WKUserScript`を作成して`WKUserContentController`に追加することで、JavaScriptを注入することができます。

    ```swift
    let userScript = WKUserScript(source: jsSource, injectionTime: .atDocumentEnd, forMainFrameOnly: true)
    webView.configuration.userContentController.addUserScript(userScript)
    ```

4. **JavaScriptの実行:** 必要に応じて、Swiftから`evaluateJavaScript(_:completionHandler:)`を使ってJavaScriptを直接実行することもできます。

このような手法を用いることで、CSS Selector GeneratorライブラリをWebViewに注入し、その機能を活用することが可能です。ただし、JavaScriptコードはWebView内のページがロードされる度に再注入が必要となる点を注意してください。

また、ネイティブのSwiftコードとJavaScriptコードの間で通信を行いたい場合には、`WKScriptMessageHandler`プロトコルを使用することが推奨されています。これを用いると、JavaScriptからSwiftへのメッセージ送信が可能となります。

このプロセスはあくまで一例であり、具体的な要件によっては少々変わるかもしれません。そのため、詳細な要件に基づいて適切な実装を選択することが重要です。

---

## 👤 ユーザー
*2023/6/11 18:09:27*

mpm istall したライブラリとかもつかいたんだけど

---

## 🤖 アシスタント
*2023/6/11 18:10:19*

npmを通じてインストールしたライブラリを使用する場合は、それらのライブラリをアプリケーションにバンドルするために、webpackやrollupなどのモジュールバンドラを使用することを検討すると良いでしょう。

以下に大まかな手順を示します:

1. **ライブラリのインストール:** npmを使用してライブラリをインストールします。
    ```
    npm install css-selector-generator
    ```

2. **バンドルの作成:** webpackなどのモジュールバンドラを使用して、インストールしたライブラリを含むJavaScriptファイルをバンドルします。これは、特にライブラリがCommonJS、ES6モジュールなどの形式で提供されている場合に必要です。

    webpackを設定する基本的な`webpack.config.js`は以下のようになります:
    ```javascript
    const path = require('path');

    module.exports = {
      entry: './src/index.js', // 入力となるJavaScriptファイル
      output: {
        filename: 'main.js', // 出力となるバンドルファイル
        path: path.resolve(__dirname, 'dist'), // バンドルファイルの出力先
      },
    };
    ```
    そして、コマンドラインで`webpack`コマンドを実行してバンドルを作成します。

3. **バンドルファイルのインポート:** 作成したバンドルをあなたのiOSプロジェクトに追加します。そして、上記の手順と同じように、`Bundle.main.path(forResource:ofType:)`を使用してバンドルのパスを取得し、`String(contentsOfFile:encoding:)`を使用してファイルの内容を読み込みます。

4. **WebViewへのJavaScriptの注入:** 読み込んだバンドルをWebViewに注入します。これは上記と同様に、`WKUserScript`と`WKUserContentController`を使用します。

5. **JavaScriptの実行:** 必要に応じて、SwiftからJavaScriptを直接実行することもできます。

以上の手順により、npmを通じてインストールしたJavaScriptライブラリをWebViewに注入することが可能となります。

---

## 👤 ユーザー
*2023/6/11 18:31:50*

webView(_:didStartProvisionalNavigation:) が呼ばれる場合ってどういうとき？

---

## 🤖 アシスタント
*2023/6/11 18:32:17*

`webView(_:didStartProvisionalNavigation:)` は、WKNavigationDelegateプロトコルのメソッドで、WKWebViewがナビゲーションの開始を報告する際に呼び出されます。

具体的には以下のような状況で呼び出されます:

1. WebViewが新たにページを読み込み始めたとき。これは新しいURLに対する初期リクエスト、ページのリロード、履歴のバック・フォワード等によるナビゲーションで起こります。

2. リダイレクトの開始時にも呼び出されます。リダイレクトが行われるとき、まず`webView(_:didStartProvisionalNavigation:)`が呼び出され、その後で`webView(_:didReceiveServerRedirectForProvisionalNavigation:)`が呼び出されます。

重要な点として、このメソッドはページの読み込みが始まったことを示すだけであり、読み込みが正常に完了するかどうかを保証するものではありません。ページの読み込みが成功したかどうかを確認するには、`webView(_:didFinish:)`またはエラーが発生した場合は`webView(_:didFailProvisionalNavigation:withError:)`を使用することができます。

---

## 👤 ユーザー
*2023/6/11 18:35:17*

ページの読み込みが始まったことをもう少し具体的に教えて欲しい

---

## 🤖 アシスタント
*2023/6/11 18:35:59*

ページの読み込みが始まったとは、具体的には、ブラウザ（この場合はWebView）が新しいウェブページを表示するために、そのページのデータを取得し始めた瞬間を指します。これは通常、ユーザーが新しいURLをブラウザのアドレスバーに入力してEnterを押すとき、リンクをクリックするとき、JavaScriptからのページ遷移命令があるときなどに起こります。

以下に、いくつかの具体的なシナリオを示します：

1. **URLのロード:** ユーザーが新しいURLを入力または選択して、そのURLに対するリクエストを発行した時点で読み込みが始まります。

   ```swift
   let url = URL(string: "https://www.example.com")!
   let request = URLRequest(url: url)
   webView.load(request)
   ```

2. **リロード:** ユーザーが現在表示中のページをリロードしたときに読み込みが始まります。

   ```swift
   webView.reload()
   ```

3. **履歴のバック・フォワード:** ユーザーがブラウザの履歴を使って前後のページに移動したときに読み込みが始まります。

   ```swift
   webView.goBack() // 履歴の一つ前のページに移動
   webView.goForward() // 履歴の一つ後のページに移動
   ```

4. **JavaScriptによるページ遷移:** WebView内でJavaScriptが新しいページのロードをトリガーした場合も、ページの読み込みが始まります。

   ```swift
   webView.evaluateJavaScript("window.location.href = 'https://www.example.com';", completionHandler: nil)
   ```

これらのアクションはすべて、ページの読み込みの開始を引き起こします。そしてその時点で、WKWebViewのデリゲートメソッド`webView(_:didStartProvisionalNavigation:)`が呼び出されます。

---

## 👤 ユーザー
*2023/6/11 18:39:14*

WKNavigationDelegate のメソッドが実行されるタイミングについて詳しく教えて欲しい

---

## 🤖 アシスタント
*2023/6/11 18:40:06*

`WKNavigationDelegate`はWKWebViewのナビゲーションプロセスを追跡するためのプロトコルで、ナビゲーションの進行状況に応じて様々なメソッドが呼び出されます。

以下に、一部の主要なメソッドとそれらが呼び出されるタイミングを示します：

1. **`webView(_:decidePolicyFor:decisionHandler:)`** は、ナビゲーションアクションが行われる前に呼び出され、そのアクションを許可するかキャンセルするかを決定するのに使われます。

2. **`webView(_:didStartProvisionalNavigation:)`** は、ページの読み込みが開始されたときに呼び出されます。このメソッドは新しいページの読み込みが始まるたびに呼び出されます。

3. **`webView(_:didReceiveServerRedirectForProvisionalNavigation:)`** は、サーバからのリダイレクトが受け取られたときに呼び出されます。

4. **`webView(_:didFailProvisionalNavigation:withError:)`** は、ページの読み込み中にエラーが発生したときに呼び出されます。

5. **`webView(_:didCommit:)`** は、ウェブビューがコンテンツを受け取り始めたときに呼び出されます。これはページの読み込みが進行中で、データがWebViewに送信されていることを意味します。

6. **`webView(_:didFinish:)`** は、ページの読み込みが完了したときに呼び出されます。これは全てのコンテンツが読み込まれ、JavaScriptの読み込みも完了したことを示します。

7. **`webView(_:didFail:withError:)`** は、ナビゲーション中またはページの読み込み中にエラーが発生したときに呼び出されます。

以上がWKNavigationDelegateの主要なメソッドとその呼び出しタイミングになります。これらを用いることで、ページの読み込みやナビゲーションのプロセスを詳細に管理できます。なお、具体的な使用方法はアプリケーションの要件によります。

---

## 👤 ユーザー
*2023/6/11 18:40:27*

他にはないのか？

---

## 🤖 アシスタント
*2023/6/11 18:41:04*

`WKNavigationDelegate` には、さらにいくつかの他のメソッドがあります。それらは以下の通りです：

1. **`webView(_:decidePolicyFor:preferences:decisionHandler:)`**: 新しいウィンドウを開く要求が来たときに呼び出され、新しいウィンドウの表示に対する方針を決定します。

2. **`webViewWebContentProcessDidTerminate(_:)`**: WebビューのWebコンテンツプロセスがクラッシュしたときに呼び出されます。

3. **`webView(_:authenticationChallenge:shouldAllowDeprecatedTLSDecisionHandler:)`**: Webビューが非推奨のTLSプロトコルを使用して接続しようとするときに呼び出されます。

4. **`webView(_:didReceive:completionHandler:)`**: チャレンジに応答するために呼び出されます。

これらのメソッドは全てオプションであり、使用するかどうかはアプリケーションの要件によります。

それぞれのメソッドが呼び出されるタイミングは、そのメソッドが対応する特定のイベントまたは状況によります。例えば、`webView(_:decidePolicyFor:preferences:decisionHandler:)`は新しいウィンドウを開く要求が来たときに呼び出され、`webViewWebContentProcessDidTerminate(_:)`はWebビューのWebコンテンツプロセスがクラッシュしたときに呼び出されます。

---

## 👤 ユーザー
*2023/6/11 18:41:20*

時系列順になれべてほしい

---

## 🤖 アシスタント
*2023/6/11 18:42:16*

ウェブページのナビゲーションが開始されてから完了するまでの流れを表す一般的な `WKNavigationDelegate` のメソッドの呼び出し順序は次のようになります：

1. **`webView(_:decidePolicyFor:decisionHandler:)`**: ナビゲーションアクションが行われる前に呼び出されます。そのアクションを許可するかキャンセルするかを決定します。

2. **`webView(_:didStartProvisionalNavigation:)`**: ページの読み込みが開始されたときに呼び出されます。このメソッドは新しいページの読み込みが始まるたびに呼び出されます。

3. **`webView(_:didReceiveServerRedirectForProvisionalNavigation:)`**: サーバからのリダイレクトが受け取られたときに呼び出されます。

4. **`webView(_:didCommit:)`**: ウェブビューがコンテンツを受け取り始めたときに呼び出されます。これはページの読み込みが進行中で、データがWebViewに送信されていることを意味します。

5. **`webView(_:didFinish:)`**: ページの読み込みが完了したときに呼び出されます。これは全てのコンテンツが読み込まれ、JavaScriptの読み込みも完了したことを示します。

エラーが発生した場合、それぞれの段階で対応するエラーメソッドが呼び出されます:

- **`webView(_:didFailProvisionalNavigation:withError:)`**: ページの読み込みの開始段階でエラーが発生した場合に呼び出されます。

- **`webView(_:didFail:withError:)`**: ナビゲーション中またはページの読み込み中にエラーが発生した場合に呼び出されます。

また、以下のメソッドは特定のイベントに応じて呼び出されます：

- **`webView(_:decidePolicyFor:preferences:decisionHandler:)`**: 新しいウィンドウを開く要求が来たときに呼び出されます。

- **`webViewWebContentProcessDidTerminate(_:)`**: WebビューのWebコンテンツプロセスがクラッシュしたときに呼び出されます。

- **`webView(_:authenticationChallenge:shouldAllowDeprecatedTLSDecisionHandler:)`**: Webビューが非推奨のTLSプロトコルを使用して接続しようとするときに呼び出されます。

- **`webView(_:didReceive:completionHandler:)`**: 認証チャレンジに応答するた

---
