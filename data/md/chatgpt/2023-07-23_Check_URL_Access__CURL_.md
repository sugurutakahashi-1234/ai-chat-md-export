# Check URL Access (CURL)

Date: 2023-07-23

---

## 👤 User
*2023-07-23 17:34:17*

以下の関数はBoolを返すのだけど、もっとBoolが返却されることがわかるようにして欲しい。
アクセス可能なURLを判定したいんだ

func checkAccessUrl(navigationAction: WKNavigationAction) async -&gt; Bool {}

---

## 🤖 Assistant
*2023-07-23 17:34:40*

あなたが提供した関数は非常に抽象的なので、詳細な実装方法は特定できませんが、コードの可読性を高め、関数がBoolを返すことを明示するために、関数名やコメントを改良することができます。たとえば次のようにすることができます：

```swift
/// Checks if a given URL from a WKNavigationAction can be accessed.
/// 
/// - Parameter navigationAction: The navigation action containing the URL to be checked.
/// - Returns: A Boolean indicating whether the URL is accessible.
func isUrlAccessible(from navigationAction: WKNavigationAction) async -> Bool {
    // implementation goes here...
}
```
このようにすると、関数名とコメントがその機能を明確に示し、返されるのがBoolであることが明確になります。

ただし、具体的な実装は、あなたがどのようにURLのアクセス可能性を判断するかによります。特定のドメインに制限を設けるのか、リクエストを実行してレスポンスを確認するのか、その他の方法を使用するのかによります。

この関数を使うときは、Swift 5.5以降の `async/await` 構文を利用できます。例えば、次のようになります：

```swift
let canAccess = await isUrlAccessible(from: someNavigationAction)
```

このような非同期関数は、ネットワークリクエストなど時間のかかる処理を行う場合に特に有用です。ただし、この関数が非同期であることを呼び出し側は認識しておく必要があります。

---

## 👤 User
*2023-07-23 17:46:34*

以下の処理について、ある特定の場合では if で ture とする navigationType を .linkActivated と .formSubmitted に加えて other も増やしたい。それを関数の引数で設定したいのだけれどもどうするのが良いか？

if navigationAction.navigationType == .linkActivated || navigationAction.navigationType == .formSubmitted

func isUrlAccessible(navigationAction: WKNavigationAction) -&gt; Bool {
        guard let url = navigationAction.request.url,
              let urlScheme = url.scheme?.lowercased()
        else {
            return false
        }

        // 【navigationType rawValue】
        // .linkActivated: 0
        // .formSubmitted: 1
        // .backForward: 2
        // .reload: 3
        // .formResubmitted: 4
        // .other: 5
        AppLogger.debugLog("access url: \(url.absoluteString), navigationType: \(navigationAction.navigationType)")

        // WebView内で遷移せずに処理されるスキーム
        // - about: 特殊なページを指すスキーム ex) about:blank
        // - javascript: ブラウザ内でJavaScriptコードを実行するためのスキーム
        // - data: インラインデータを指すスキーム
        // - blob: ブラウザ内に生成された大きなデータオブジェクトを指すスキーム
        // - file: ローカルファイルシステム上のファイルを指すスキーム
        let nonTransitioningSchemes = ["about", "javascript", "data", "blob", "file"]
        if nonTransitioningSchemes.contains(urlScheme) {
            return true
        }

        // navigationAction.navigationType が .linkActivated または .formSubmitted の場合（リダイレクト、リロード、戻る操作を除く場合）、許可URLのチェックを行う
        if navigationAction.navigationType == .linkActivated || navigationAction.navigationType == .formSubmitted {
            AppLogger.debugLog("access url: \(url.absoluteString), acls: \(web.acls.map { $0.urlPattern })")
            let isUrlAllowed = web.acls.map { $0.urlPattern }.isEmpty || web.acls.map { $0.urlPattern }.contains(where: { url.absoluteString.hasPrefix($0) })
            guard isUrlAllowed else {
                AppLogger.debugLog("access control error url: \(url.absoluteString), acls: \(web.acls.map { $0.urlPattern }), site url: \(web.siteURL)", level: .error)
                anchorAndEmotionAnalysisInteractor.send(interaction: .init(eventType: .showAlert(.init(message: appError.localizedDescription))))
                appError = .websiteAccessControlError(url)
                shouldShowAccessControlErrorAlert = true
                return false
            }
        }

        return true
    }

---

## 🤖 Assistant
*2023-07-23 17:46:55*

関数の引数にWKNavigationTypeの配列を追加することで、許可されるnavigationTypeを設定できます。この配列は、関数が受け入れるべきnavigationTypeを定義します。以下に具体的な実装例を示します。

```swift
func isUrlAccessible(navigationAction: WKNavigationAction, acceptableNavigationTypes: [WKNavigationType]) -> Bool {
    guard let url = navigationAction.request.url,
          let urlScheme = url.scheme?.lowercased()
    else {
        return false
    }

    // ここに元のコード...

    // navigationAction.navigationType が acceptableNavigationTypes の一部である場合、許可URLのチェックを行う
    if acceptableNavigationTypes.contains(navigationAction.navigationType) {
        // ここに元のコード...
    }

    return true
}
```

そして、この関数を呼び出す時は以下のようにします：

```swift
let isAccessible = isUrlAccessible(navigationAction: someNavigationAction, acceptableNavigationTypes: [.linkActivated, .formSubmitted, .other])
```

この方法で、関数がどのnavigationTypeを受け入れるべきかを、関数を呼び出す時に制御することができます。また、呼び出し元が関数の振る舞いをより具体的に制御でき、より柔軟な設計が可能になります。

---

## 👤 User
*2023-07-23 17:47:28*

acceptableNavigationTypes の命名がちょっとあっていない気がする。

---

## 🤖 Assistant
*2023-07-23 17:47:45*

そのような場合、引数名を `allowedNavigationTypes` や `permittedNavigationTypes` に変更すると、意図がより明確に伝わるかもしれません。以下に実装例を示します。

```swift
func isUrlAccessible(navigationAction: WKNavigationAction, allowedNavigationTypes: [WKNavigationType]) -> Bool {
    guard let url = navigationAction.request.url,
          let urlScheme = url.scheme?.lowercased()
    else {
        return false
    }

    // ここに元のコード...

    // navigationAction.navigationType が allowedNavigationTypes の一部である場合、許可URLのチェックを行う
    if allowedNavigationTypes.contains(navigationAction.navigationType) {
        // ここに元のコード...
    }

    return true
}
```

そして、この関数を呼び出す時は以下のようにします：

```swift
let isAccessible = isUrlAccessible(navigationAction: someNavigationAction, allowedNavigationTypes: [.linkActivated, .formSubmitted, .other])
```

これで、`allowedNavigationTypes` の名前から、この配列が許可された `WKNavigationType` を定義することがより明確になります。

---

## 👤 User
*2023-07-23 17:48:28*

aclでチェックすべきNavigationTypeという意味を込めたい

---

## 🤖 Assistant
*2023-07-23 17:48:45*

その場合、`aclCheckedNavigationTypes` や `navigationTypesForAclCheck` といった名前が適切かもしれません。以下に実装例を示します。

```swift
func isUrlAccessible(navigationAction: WKNavigationAction, navigationTypesForAclCheck: [WKNavigationType]) -> Bool {
    guard let url = navigationAction.request.url,
          let urlScheme = url.scheme?.lowercased()
    else {
        return false
    }

    // ここに元のコード...

    // navigationAction.navigationType が navigationTypesForAclCheck の一部である場合、ACLによるURLのチェックを行う
    if navigationTypesForAclCheck.contains(navigationAction.navigationType) {
        // ここに元のコード...
    }

    return true
}
```

そして、この関数を呼び出す時は以下のようにします：

```swift
let isAccessible = isUrlAccessible(navigationAction: someNavigationAction, navigationTypesForAclCheck: [.linkActivated, .formSubmitted, .other])
```

このようにすることで、引数名がその用途を明確に示し、ACLによるチェックが適用される `WKNavigationType` を指定することができます。

---
