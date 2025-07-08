# WKWebView URL判定修正

日付: 2023-07-19

---

## 👤 ユーザー
*2023/07/19 15:36:55*

以下のfunc webView(_: WKWebView, decidePolicyFor navigationAction: WKNavigationAction) async -&gt; WKNavigationActionPolicyの処理でparent.presenter.isUrlAllowedByAcls(url: url) でurlが許可されているものかそうでないかを確認しているが、これだとリダイレクトurlなどについても判定してしまう。

extension AnalysisWebViewCoordinator: WKNavigationDelegate {
    @MainActor
    func webView(_ webView: WKWebView, didCommit _: WKNavigation!) {
        parent.presenter.updateCanGoBack(webView.canGoBack)
        parent.presenter.updateCanGoForward(webView.canGoForward)
    }

    @MainActor
    func webView(_: WKWebView, decidePolicyFor navigationAction: WKNavigationAction) async -&gt; WKNavigationActionPolicy {
        guard let url = navigationAction.request.url,
              let urlScheme = url.scheme?.lowercased()
        else {
            return .cancel
        }

        // WebView内で遷移せずに処理されるスキーム
        // - about: 特殊なページを指すスキーム ex) about:blank
        // - javascript: ブラウザ内でJavaScriptコードを実行するためのスキーム
        // - data: インラインデータを指すスキーム
        // - blob: ブラウザ内に生成された大きなデータオブジェクトを指すスキーム
        // - file: ローカルファイルシステム上のファイルを指すスキーム
        let nonTransitioningSchemes = ["about", "javascript", "data", "blob", "file"]
        if nonTransitioningSchemes.contains(urlScheme) {
            return .allow
        }

        // 許可URLのみアクセスできる
        guard parent.presenter.isUrlAllowedByAcls(url: url) else {
            parent.presenter.showAccessControlErrorAlert(url: url)
            return .cancel
        }

        return .allow
    }
}

---

## 🤖 アシスタント
*2023/07/19 15:37:25*

`WKNavigationAction`のプロパティにはリクエストの種類を示す`navigationType`があります。この値は`.linkActivated`、`.formSubmitted`、`.backForward`、`.reload`、`.formResubmitted`、または`.other`のいずれかで、それぞれが異なる種類のナビゲーションアクションを示します。

問題として挙げられているリダイレクトURLの検証については、navigationTypeが`.other`の場合に発生します。そのため、ACL（アクセス制御リスト）によるURLの許可チェックを`.other`の場合には行わないようにすれば、リダイレクトURLの許可チェックを避けることができます。

以下に、そのように修正したメソッドを示します：

```swift
@MainActor
func webView(_: WKWebView, decidePolicyFor navigationAction: WKNavigationAction) async -> WKNavigationActionPolicy {
    guard let url = navigationAction.request.url,
          let urlScheme = url.scheme?.lowercased()
    else {
        return .cancel
    }

    let nonTransitioningSchemes = ["about", "javascript", "data", "blob", "file"]
    if nonTransitioningSchemes.contains(urlScheme) {
        return .allow
    }

    if navigationAction.navigationType != .other {
        // 許可URLのみアクセスできる
        guard parent.presenter.isUrlAllowedByAcls(url: url) else {
            parent.presenter.showAccessControlErrorAlert(url: url)
            return .cancel
        }
    }

    return .allow
}
```

ただし、注意が必要な点としては、この変更により、JavaScriptなどからのリダイレクトによるアクセスが可能になる可能性があることです。このアクセスを許可するかどうかは、あなたのアプリのセキュリティポリシーや要件によるため、その点を確認することをお勧めします。

---

## 👤 ユーザー
*2023/07/19 15:38:11*

それぞれ教えて欲しい。いわゆるブラウザのURLを入力したときのものだけにisUrlAllowedByAclsをかけたい。

.linkActivated、.formSubmitted、.backForward、.reload、.formResubmitted、または.otherの

---

## 🤖 アシスタント
*2023/07/19 15:38:58*

Swiftの`WKNavigationType`の各値は、以下のような意味を持っています：

1. `.linkActivated`: ユーザがリンクをクリックした場合や、JavaScriptのwindow.open()メソッドを呼び出した場合など、リンクがアクティベートされたときに起こります。

2. `.formSubmitted`: ユーザがフォームを送信した場合に発生します。例えば、HTMLの`<form>`タグで作成されたフォームの送信ボタンがクリックされたときなどです。

3. `.backForward`: ユーザがブラウザの戻る/進むボタンを使用した場合に発生します。

4. `.reload`: ユーザがページをリロードした場合に発生します。

5. `.formResubmitted`: ユーザがすでに送信したフォームを再送信した場合に発生します。

6. `.other`: 上記のいずれにも当てはまらない場合に発生します。例えば、リダイレクトやフレームのロードなど、プログラムによるページのロードは通常ここに分類されます。

「ブラウザのURLを入力したときのものだけにisUrlAllowedByAclsをかけたい」とのことですが、それは通常`.linkActivated`または`.formSubmitted`としてクラシファイドされます。なお、ここでの`.linkActivated`はユーザがリンクをクリックしたときも含むため、具体的な要件によりますが、`.formSubmitted`だけを対象にするのが適切かもしれません。

したがって、次のように修正するとよいでしょう：

```swift
@MainActor
func webView(_: WKWebView, decidePolicyFor navigationAction: WKNavigationAction) async -> WKNavigationActionPolicy {
    guard let url = navigationAction.request.url,
          let urlScheme = url.scheme?.lowercased()
    else {
        return .cancel
    }

    let nonTransitioningSchemes = ["about", "javascript", "data", "blob", "file"]
    if nonTransitioningSchemes.contains(urlScheme) {
        return .allow
    }

    if navigationAction.navigationType == .formSubmitted {
        // 許可URLのみアクセスできる
        guard parent.presenter.isUrlAllowedByAcls(url: url) else {
            parent.presenter.showAccessControlErrorAlert(url: url)
            return .cancel
        }
    }

    return .allow
}
```

この変更により、URLバーにURLを直接入力した場合、またはフォームを介してページがロードされた場合だけに、ACLによるURLの許可チェックが行われます。

---

## 👤 ユーザー
*2023/07/19 15:39:15*

.other 以外というフィリタリングだとどう思う？

---

## 🤖 アシスタント
*2023/07/19 15:39:45*

`.other`以外というフィルタリングは、実際の要件によりますが、可能なオプションです。このオプションを選ぶことで、直接URLを入力した場合や、リンクをクリックした場合、フォームを送信した場合、戻る/進むボタンを押した場合、ページをリロードした場合など、ユーザが直接アクションを起こした場合のみURLがACLによって許可されるかチェックされます。それ以外の自動的なリダイレクトなどは許可チェックを受けません。

したがって、この要件があなたのアプリのセキュリティポリシーやユーザビリティの要件と一致している場合、以下のように実装できます：

```swift
@MainActor
func webView(_: WKWebView, decidePolicyFor navigationAction: WKNavigationAction) async -> WKNavigationActionPolicy {
    guard let url = navigationAction.request.url,
          let urlScheme = url.scheme?.lowercased()
    else {
        return .cancel
    }

    let nonTransitioningSchemes = ["about", "javascript", "data", "blob", "file"]
    if nonTransitioningSchemes.contains(urlScheme) {
        return .allow
    }

    if navigationAction.navigationType != .other {
        // 許可URLのみアクセスできる
        guard parent.presenter.isUrlAllowedByAcls(url: url) else {
            parent.presenter.showAccessControlErrorAlert(url: url)
            return .cancel
        }
    }

    return .allow
}
```

この修正では、`navigationType`が`.other`でない場合（つまり、ユーザが直接アクションを起こした場合）だけACLによるURLの許可チェックが行われます。

---

## 👤 ユーザー
*2023/07/19 15:40:25*

たとえば、広告のurlなどはどのnavigationTypeか分かる？

https://rcm-fe.amazon-adsystem.com/e/cm?ref=tf_til&t=ipairs-22&m=amazon&o=9&p=8&l=as1&IS1=1&detail=1&asins=B07HCLNKYF&linkId=682e3875a81ea920f972d81d46bb36a0&bc1=000000&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr

---

## 🤖 アシスタント
*2023/07/19 15:40:39*

Amazonのアフィリエイトリンク（広告URL）や他の外部リンクをクリックした場合、通常は`WKNavigationType.linkActivated`として分類されます。

ただし、そのURLがリダイレクトを引き起こす場合、リダイレクトは`WKNavigationType.other`として扱われます。リダイレクトは通常、サーバーがクライアントに別のURLに移動するように指示するときに起こります。この動作は、主にURLの短縮、URLの変更の追跡、またはユーザを異なるURLにリダイレクトするために使用されます。

したがって、上記の例のようなアフィリエイトリンクをクリックした結果としてリダイレクトが行われる場合、そのリダイレクト自体は`WKNavigationType.other`に分類され、`WKNavigationType.linkActivated`の扱いはされません。

---

## 👤 ユーザー
*2023/07/19 15:49:38*

guard 文にまとめてほしい

---

## 🤖 アシスタント
*2023/07/19 15:50:05*

ご希望に応じて、以下のように`guard`文を使って一連の条件をまとめてみました：

```swift
@MainActor
func webView(_: WKWebView, decidePolicyFor navigationAction: WKNavigationAction) async -> WKNavigationActionPolicy {
    guard let url = navigationAction.request.url,
          let urlScheme = url.scheme?.lowercased(),
          ["about", "javascript", "data", "blob", "file"].contains(urlScheme) || navigationAction.navigationType != .other
    else {
        return .cancel
    }

    guard parent.presenter.isUrlAllowedByAcls(url: url) else {
        parent.presenter.showAccessControlErrorAlert(url: url)
        return .cancel
    }

    return .allow
}
```

このコードでは、最初の`guard`文で以下の条件をすべて満たす必要があります：

1. URLとそのスキームが存在し、
2. スキームが特定のリストに含まれているか、`navigationType`が`.other`でないこと

これらの条件を満たさない場合は、`WKNavigationActionPolicy.cancel`が返され、ナビゲーションがキャンセルされます。

次に、`isUrlAllowedByAcls(url:)`メソッドを使用してURLが許可されているかどうかをチェックします。これが`false`を返す場合、エラーアラートが表示されてナビゲーションがキャンセルされます。

これらの条件をすべて満たすときだけ、`WKNavigationActionPolicy.allow`が返され、ナビゲーションが許可されます。

---

## 👤 ユーザー
*2023/07/19 15:51:09*

navigationAction.navigationType != .other の処理だけでいいよ

---

## 🤖 アシスタント
*2023/07/19 15:51:28*

ご指定の条件だけでフィルタリングするには、以下のように書くことができます：

```swift
@MainActor
func webView(_: WKWebView, decidePolicyFor navigationAction: WKNavigationAction) async -> WKNavigationActionPolicy {
    guard let url = navigationAction.request.url,
          let urlScheme = url.scheme?.lowercased(),
          navigationAction.navigationType != .other
    else {
        return .cancel
    }

    // 許可URLのみアクセスできる
    guard parent.presenter.isUrlAllowedByAcls(url: url) else {
        parent.presenter.showAccessControlErrorAlert(url: url)
        return .cancel
    }

    return .allow
}
```

このコードは、`.other`以外の`navigationType`に対する要求のみがACLによる許可チェックを行います。すなわち、ユーザが直接アクションを起こした場合（リンクのクリック、フォームの送信、戻る/進むボタンの使用、ページのリロードなど）のみが許可チェックを受け、リダイレクトなどの自動的な操作は許可チェックを受けません。

---

## 👤 ユーザー
*2023/07/19 15:51:50*

以下はまずいんだっけ？

// 許可URLのみアクセスできる
        guard navigationAction.navigationType != .other && parent.presenter.isUrlAllowedByAcls(url: url) else {
            parent.presenter.showAccessControlErrorAlert(url: url)
            return .cancel
        }

---

## 🤖 アシスタント
*2023/07/19 15:52:24*

あなたのコードは機能的には大丈夫ですが、一つ注意すべき点があります。そのコードでは、navigationTypeが.otherである場合やACLによる許可が得られなかった場合に、どちらの場合でもアクセス制御エラーアラートを表示します。

しかしこれは、.otherの場合（つまり自動的なリダイレクトなどの場合）にエラーアラートが表示されると、ユーザに混乱を与える可能性があります。なぜなら、これらのリダイレクトはユーザが直接起こしたアクションではないからです。そのため、このような挙動はユーザにとって不適切に感じられる可能性があります。

そのため、エラーアラートを表示する前に、navigationTypeが.otherでないことを確認することをお勧めします。

以下のように修正することをお勧めします：

```swift
// 許可URLのみアクセスできる
guard navigationAction.navigationType != .other else {
    return .allow
}

guard parent.presenter.isUrlAllowedByAcls(url: url) else {
    parent.presenter.showAccessControlErrorAlert(url: url)
    return .cancel
}
```

この修正では、まず.navigationTypeが.otherでないことを確認します。もし.otherであれば、即座に.allowを返して処理を続行します。その後、URLがACLにより許可されているかチェックします。もし許可されていなければ、エラーアラートを表示し、.cancelを返して処理を中止します。

---

## 👤 ユーザー
*2023/07/19 15:52:37*

if navigationAction.navigationType != .other {
        // 許可URLのみアクセスできる
        guard parent.presenter.isUrlAllowedByAcls(url: url) else {
            parent.presenter.showAccessControlErrorAlert(url: url)
            return .cancel
        }
    } はどう？

---

## 🤖 アシスタント
*2023/07/19 15:53:00*

提案いただいたコードは期待通りに機能します。それは、ナビゲーションアクションの種類が `.other` でない場合にだけ、URLの許可チェックを行います。そして、URLが許可されていない場合に限り、アクセス制御エラーアラートを表示し、アクションをキャンセルします。このコードは以下のように全体のコンテキストに組み込むことができます：

```swift
@MainActor
func webView(_: WKWebView, decidePolicyFor navigationAction: WKNavigationAction) async -> WKNavigationActionPolicy {
    guard let url = navigationAction.request.url,
          let urlScheme = url.scheme?.lowercased()
    else {
        return .cancel
    }

    let nonTransitioningSchemes = ["about", "javascript", "data", "blob", "file"]
    if nonTransitioningSchemes.contains(urlScheme) {
        return .allow
    }

    if navigationAction.navigationType != .other {
        // 許可URLのみアクセスできる
        guard parent.presenter.isUrlAllowedByAcls(url: url) else {
            parent.presenter.showAccessControlErrorAlert(url: url)
            return .cancel
        }
    }

    return .allow
}
```

このコードは期待通りに動作し、指定の条件を満たしています。

---

## 👤 ユーザー
*2023/07/19 16:35:48*

WKNavigationType(rawValue: -1) ってなに？

---

## 🤖 アシスタント
*2023/07/19 16:36:05*

`WKNavigationType(rawValue: -1)`は、WKNavigationTypeの列挙体で定義されていない値を指しています。

`WKNavigationType`は、WebKitフレームワーク内でナビゲーションアクションの種類を表す列挙体です。これは整数値を元にしていますが、具体的な値は次のとおりです：

- .linkActivated: 0
- .formSubmitted: 1
- .backForward: 2
- .reload: 3
- .formResubmitted: 4
- .other: 5

したがって、`rawValue: -1`は、上記のいずれの値も表さないものであり、そのためWebKitフレームワークでは認識されません。具体的な意味を持つわけではないので、コード内でこれを使用すると意図しない結果を生じる可能性があります。使用する場合は注意が必要です。

---

## 👤 ユーザー
*2023/07/19 17:18:52*

また、以下のようなurlでアクセスするとWebViewからViewが切り替わったり、内部埋め込みの動画などを再生すると動画がViewの上にかぶさってプレイヤーが勝手に立ち上げるのを防ぎたい

https://twitter.com/intent/tweet?text=%E3%83%A2%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%97%E3%83%81%E3%83%A3%E3%83%BC%E5%8F%8E%E9%8C%B2%E3%82%B5%E3%83%BC%E3%83%93%E3%82%B9%20%7C%20%E3%82%A2%E3%82%A4%E3%83%BB%E3%83%9A%E3%82%A2%E3%83%BC%E3%82%BA%E6%A0%AA%E5%BC%8F%E4%BC%9A%E7%A4%BE&url=https://i-pairs.co.jp/service/mocap/

---

## 🤖 アシスタント
*2023/07/19 17:19:31*

WKWebViewでは、特定のURLに対する動作をカスタマイズするために、WKNavigationDelegateを使うことが一般的です。WebView内で開くべきでない特定のURLが開かれようとするときに、その操作をキャンセルしたり、別の操作を実行したりできます。

今回のケースでは、Twitterのツイート投稿ページや、内部で再生される動画などのURLを判定して、それらをWKWebViewの外で開くようにすることが考えられます。以下にそのためのサンプルコードを示します。

```swift
@MainActor
func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction) async -> WKNavigationActionPolicy {
    guard let url = navigationAction.request.url,
          let urlScheme = url.scheme?.lowercased()
    else {
        return .cancel
    }

    // 特定のURLを判定して外部で開く
    if url.absoluteString.contains("twitter.com/intent/tweet") ||
       url.absoluteString.contains("i-pairs.co.jp/service/mocap") {
        UIApplication.shared.open(url)
        return .cancel
    }

    let nonTransitioningSchemes = ["about", "javascript", "data", "blob", "file"]
    if nonTransitioningSchemes.contains(urlScheme) {
        return .allow
    }

    if navigationAction.navigationType != .other {
        // 許可URLのみアクセスできる
        guard parent.presenter.isUrlAllowedByAcls(url: url) else {
            parent.presenter.showAccessControlErrorAlert(url: url)
            return .cancel
        }
    }

    return .allow
}
```
上記のコードでは、Twitterの投稿ページやi-Pairsの特定のページにアクセスしようとすると、それらのURLをWKWebViewの外で開きます。そのため、WebViewからViewが切り替わったり、動画がViewの上に被さって再生されることを防ぐことができます。ただし、これはあくまで一例であり、判定するURLはアプリケーションの要件に応じて変更する必要があります。

---

## 👤 ユーザー
*2023/07/19 17:20:14*

外部リンクで開いて欲しくなくて、動画のプレイヤーも立ち上がらないように制御したいんだ

---

## 🤖 アシスタント
*2023/07/19 17:20:55*

WebViewの中で再生される動画が新たなビューやフルスクリーンで開かれるのを防ぐために、HTML側での制御が必要になることが多いです。特に、動画を再生するタグに対してプレイヤーの設定を調整することが求められます。例えば、HTML内の`<video>`タグに`playsinline`属性を付けることで、iOSのWebViewでの動画再生がインライン（つまり、フルスクリーンでない形式）で行われるようになります。

しかし、WebViewで表示しているページのHTMLを直接コントロールできない場合もあります。そのような場合は、WKWebViewの設定で動画の再生に関する挙動を制御することが可能です。`WKWebViewConfiguration`の`allowsInlineMediaPlayback`プロパティを`true`に設定すると、インラインでのメディア再生が可能になります。

以下はそのサンプルコードです：

```swift
let webViewConfiguration = WKWebViewConfiguration()
webViewConfiguration.allowsInlineMediaPlayback = true

let webView = WKWebView(frame: .zero, configuration: webViewConfiguration)
```

この設定により、可能な限り動画はインラインで再生され、フルスクリーンのプレイヤーが開くのを防ぐことができます。ただし、動画自体が強制的にフルスクリーン再生を要求する場合や、一部の広告などはこの設定を無視することがありますので、完全に制御するのは難しいかもしれません。

また、WebViewからViewが切り替わる問題については、ナビゲーションのポリシーを設定することで制御可能です。特定のURLへのアクセスをキャンセルすることで、新たなビューが開くのを防ぐことができます。

---

## 👤 ユーザー
*2023/07/19 17:49:55*

frame: .zero である必要はあるのでしょうか？

---

## 🤖 アシスタント
*2023/07/19 17:50:25*

`frame: .zero`を指定することで、WKWebViewのインスタンスが生成された時点ではビューのサイズが(0, 0)となります。つまり、ビューは見えない状態になります。これは、初期化時点では具体的なサイズや位置を決定できない場合や、レイアウトの制約が後から追加される場合などによく使用されます。

しかし、WKWebViewのインスタンスを作成する際に具体的なフレーム（位置とサイズ）を指定することも可能です。具体的なフレームを指定すると、インスタンスが生成された時点でそのフレームが適用されます。

以下に具体的なフレームを指定した例を示します：

```swift
let webViewConfiguration = WKWebViewConfiguration()
webViewConfiguration.allowsInlineMediaPlayback = true

let frame = CGRect(x: 0, y: 0, width: 100, height: 100)
let webView = WKWebView(frame: frame, configuration: webViewConfiguration)
```

上記の例では、WKWebViewのインスタンスが生成された時点で、ビューの位置は(0, 0)、サイズは(100, 100)となります。

したがって、`frame: .zero`を指定するかどうかは、アプリケーションの要件やレイアウトの設定方法によります。後から制約を追加してビューのサイズと位置を調整する場合や、初期状態でビューが見えない状態にしたい場合は`frame: .zero`を指定すると良いでしょう。

---

## 👤 ユーザー
*2023/07/19 17:50:34*

frame を指定しないこともできますでしょうか？

---

## 🤖 アシスタント
*2023/07/19 17:50:56*

はい、WKWebViewを作成する際に、フレームを指定しないことも可能です。これは通常、Auto Layout制約を使用してビューのサイズと位置を設定する場合に有用です。

以下に、フレームを指定せずにWKWebViewを作成する例を示します：

```swift
let webViewConfiguration = WKWebViewConfiguration()
webViewConfiguration.allowsInlineMediaPlayback = true

let webView = WKWebView(configuration: webViewConfiguration)
```

このコードはWKWebViewの新しいインスタンスを作成しますが、フレームを指定していません。代わりに、Auto Layout制約を使用してビューのサイズと位置を設定します。以下は、制約を追加する基本的なコードの例です：

```swift
webView.translatesAutoresizingMaskIntoConstraints = false
NSLayoutConstraint.activate([
    webView.topAnchor.constraint(equalTo: view.topAnchor),
    webView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
    webView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
    webView.trailingAnchor.constraint(equalTo: view.trailingAnchor)
])
```

上記のコードは、WKWebViewのトップ、ボトム、リーディング、トレーリングのエッジを親ビューの対応するエッジに一致させる制約を追加します。これにより、WKWebViewは

---

## 👤 ユーザー
*2023/07/19 17:50:59*

また、webViewにあとからconfigurationを設定するｋとは可能でしょうか？

---

## 🤖 アシスタント
*2023/07/19 17:51:26*

`WKWebView`の`configuration`は読み取り専用のプロパティであり、`WKWebView`のインスタンスが初期化された後に変更することはできません。したがって、新しい設定を適用するためには新たな`WKWebView`インスタンスを作成する必要があります。

WKWebViewの初期化時に`WKWebViewConfiguration`オブジェクトを提供することで、その設定が適用されます。一度初期化された後では、既存の`WKWebView`に対して新たに設定を適用することはできません。

これは、Webビューのセキュリティとパフォーマンスに関する問題を防ぐための設計となっています。例えば、ページの読み込み中に突然JavaScriptが有効化されると、それがユーザーの意図しない動作を引き起こす可能性があります。また、ビューの設定を動的に変更できると、それにより性能が低下する可能性もあります。

そのため、`WKWebView`の設定はインスタンス作成時に固定され、それ以降は変更できないようになっています。

---

## 👤 ユーザー
*2023/07/19 17:52:26*

これは大丈夫でしょうか？

let webView: WKWebView = {
        let webViewConfiguration = WKWebViewConfiguration()
        webViewConfiguration.allowsInlineMediaPlayback = true
        let webView = WKWebView(frame: .zero, configuration: webViewConfiguration)
        return webView
    }()

---

## 🤖 アシスタント
*2023/07/19 17:52:51*

はい、そのコードは正しいです。このコードはWKWebViewのインスタンスを生成し、その際にWKWebViewConfigurationを用いて設定を行っています。この方法で生成したWKWebViewインスタンスはallowsInlineMediaPlaybackが有効化されています。

このようにフレームと設定を用いてWKWebViewのインスタンスを生成する場合、最初にWKWebViewConfigurationインスタンスを作成し、その設定を用いてWKWebViewを初期化します。このWKWebViewインスタンスはフレームが`.zero`なので、初めて表示する際に適切なサイズに調整する必要があります。

また、このコードはWKWebViewを遅延初期化（Lazy Initialization）しています。つまり、`webView`プロパティが初めて参照された時点でWKWebViewのインスタンスが生成されます。この方法は、初期化に時間がかかるオブジェクトや、初期化時に大量のメモリを消費するオブジェクトを扱う場合に特に有用です。

そのため、このコードはSwiftでの一般的なWKWebViewの初期化方法に従ったものと言えます。

---
