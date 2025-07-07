# Swift: Improve Code Readability

日付: 2023-07-12

---

## 👤 ユーザー
*2023/7/13 6:55:08*

Swiftの以下処理をもう少し可読性をあげたい

func webView(\_: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -&gt; Void) {
        guard let url = navigationAction.request.url,
              let urlScheme = url.scheme?.lowercased(),
              let urlHost = url.host?.lowercased()
        else {
            decisionHandler(.allow)
            return
        }

        // WebView内で遷移せずに処理されるスキーム
        // - http, https: 通常のウェブページを指すスキーム
        // - about: 特殊なページを指すスキーム ex) about:blank
        // - javascript: ブラウザ内でJavaScriptコードを実行するためのスキーム
        // - data: インラインデータを指すスキーム
        // - blob: ブラウザ内に生成された大きなデータオブジェクトを指すスキーム
        // - file: ローカルファイルシステム上のファイルを指すスキーム
        let nonTransitioningSchemes = \["http", "https", "about", "data", "blob", "file"\]

        if !nonTransitioningSchemes.contains(urlScheme) || urlHost.contains("apps.apple.com") {
            print(url)
            parent.presenter.pendingURL = url
            parent.presenter.showAlert = true
            decisionHandler(.cancel)
        } else {
            if parent.presenter.accessControlList.contains(url.absoluteString) {
                decisionHandler(.allow)
            } else {
                print(url)
                parent.presenter.pendingURL = url
                parent.presenter.showAlert = true
                decisionHandler(.cancel)
            }
        }
    }

---

## 🤖 アシスタント
*2023/7/13 6:55:56*

以下は、いくつかのヒントを用いてあなたのSwiftコードの可読性を向上させるための改善案です：

- コメント：具体的で説明的なコメントは、他の開発者にとって非常に有用です。ただし、過度に詳細なコメントはコードを読むのが難しくなる場合があります。そのため、非明示的な動作や独自の方法に対してのみコメントを使用しましょう。
- 関数の分割：ある機能を達成するためのコードのセクションを別々の関数に分割することで、コードの可読性と再利用性を向上させることができます。各関数は一つの特定のタスクを達成すべきです。
- 条件分岐：多くのif文やネストされたif文はコードを難解にする可能性があります。可能な限り単純な条件とするか、条件を関数に抽象化することで、この問題を緩和できます。

以下にコードの改善案を示します：

```swift
func webView(_: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
    guard let url = navigationAction.request.url else {
        decisionHandler(.allow)
        return
    }

    if shouldIntercept(url: url) {
        handleInterceptedURL(url)
        decisionHandler(.cancel)
    } else {
        handleAllowedURL(url)
        decisionHandler(.allow)
    }
}

private func shouldIntercept(url: URL) -> Bool {
    guard let urlScheme = url.scheme?.lowercased(),
          let urlHost = url.host?.lowercased()
    else {
        return false
    }
    let nonTransitioningSchemes = ["http", "https", "about", "data", "blob", "file"]
    let isNonTransitioningScheme = nonTransitioningSchemes.contains(urlScheme)
    let isAppleStore = urlHost.contains("apps.apple.com")

    return !isNonTransitioningScheme || isAppleStore || !parent.presenter.accessControlList.contains(url.absoluteString)
}

private func handleInterceptedURL(_ url: URL) {
    print(url)
    parent.presenter.pendingURL = url
    parent.presenter.showAlert = true
}

private func handleAllowedURL(_ url: URL) {
    if !parent.presenter.accessControlList.contains(url.absoluteString) {
        handleInterceptedURL(url)
    }
}
```

この改善案では、各関数が一つの明確な目的を持つようにコードを分割し、`shouldIntercept(url:)`、`handleInterceptedURL(_:)`、そして`handleAllowedURL(_:)`という関数を新たに定義しています。また、`shouldIntercept(url:)`関数内でURLがインターセプトされるべきか否かのロジックを一元化し、この結果を用いてインターセプトされたURLの処理または許可されたURLの処理を適切に行っています。これにより、各関数とその役割が明確化され、コード全体の可読性が向上します。

---

## 👤 ユーザー
*2023/7/13 6:57:25*

func webView(\_: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -&gt; Void) {
        guard let url = navigationAction.request.url,
              let urlScheme = url.scheme?.lowercased(),
              let urlHost = url.host?.lowercased()
        else {
            decisionHandler(.allow)
            return
        }

        // WebView内で遷移せずに処理されるスキーム
        // - http, https: 通常のウェブページを指すスキーム
        // - about: 特殊なページを指すスキーム ex) about:blank
        // - javascript: ブラウザ内でJavaScriptコードを実行するためのスキーム
        // - data: インラインデータを指すスキーム
        // - blob: ブラウザ内に生成された大きなデータオブジェクトを指すスキーム
        // - file: ローカルファイルシステム上のファイルを指すスキーム
        let nonTransitioningSchemes = \["http", "https", "about", "data", "blob", "file"\]

        if !nonTransitioningSchemes.contains(urlScheme) || urlHost.contains("apps.apple.com") {
            print(url)
            parent.presenter.pendingURL = url
            parent.presenter.showAlert = true
            decisionHandler(.cancel)
        } else {
            if parent.presenter.accessControlList.contains(url.absoluteString) {
                decisionHandler(.allow)
            } else {
                print(url)
                parent.presenter.pendingURL = url
                parent.presenter.showAlert = true
                decisionHandler(.cancel)
            }
        }
    }

---

## 🤖 アシスタント
*2023/7/13 6:57:58*

Swiftの可読性を向上させるためには、長い関数をより短い複数の関数に分けると良いです。それにより、それぞれの関数が特定の目的を持つようになり、全体のロジックが理解しやすくなります。

また、変数名や関数名に意味を持たせることで、どのような目的で作られているのかを明示的に示すことができます。

以下に改良例を示します：

```swift
func webView(_: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
    guard let url = navigationAction.request.url else {
        decisionHandler(.allow)
        return
    }

    if shouldOpenInExternalBrowser(url: url) {
        prepareForExternalOpening(url: url)
        decisionHandler(.cancel)
    } else if shouldOpenInWebView(url: url) {
        decisionHandler(.allow)
    } else {
        prepareForExternalOpening(url: url)
        decisionHandler(.cancel)
    }
}

private func shouldOpenInExternalBrowser(url: URL) -> Bool {
    guard let urlScheme = url.scheme?.lowercased(),
          let urlHost = url.host?.lowercased() else {
        return false
    }

    let nonTransitioningSchemes = ["http", "https", "about", "data", "blob", "file"]

    return !nonTransitioningSchemes.contains(urlScheme) || urlHost.contains("apps.apple.com")
}

private func shouldOpenInWebView(url: URL) -> Bool {
    return parent.presenter.accessControlList.contains(url.absoluteString)
}

private func prepareForExternalOpening(url: URL) {
    print(url)
    parent.presenter.pendingURL = url
    parent.presenter.showAlert = true
}
```
この改良例では、長い一つの関数を、特定の役割を持つ3つのプライベート関数に分割しました。これらは、URLが外部ブラウザで開かれるべきかどうか、WebViewで開かれるべきかどうかを判断し、外部で開くための準備をする役割を持っています。

それぞれの役割を明確にした関数に分割することで、コードの可読性が向上し、今後の

---
