# Detecting WebView Scroll Position

Date: 2023-09-04

---

## 👤 User
*2023-09-04 14:46:13*

SwiftUIでWebViewのスクロールで一番下までスクロールしたことを検知できますか？

---

## 🤖 Assistant
*2023-09-04 14:46:58*

SwiftUIの`WebView`は、実際には`WebKit`の`WKWebView`をラッピングしたものを使用します。`WKWebView`のスクロールを検知して一番下までスクロールしたことを判断するには、`UIScrollViewDelegate`のメソッドやJavaScriptのヘルパーを使用する必要があります。

以下は、SwiftUIでWebViewのスクロールを検知する一例です：

1. 最初に`WKWebView`のラッピングを行うSwiftUIビューを定義します。

```swift
import SwiftUI
import WebKit

struct WebView: UIViewRepresentable {
    let urlString: String
    let onScrollToBottom: (() -> Void)?
    
    func makeUIView(context: Context) -> WKWebView {
        let webView = WKWebView()
        webView.navigationDelegate = context.coordinator
        webView.scrollView.delegate = context.coordinator
        return webView
    }
    
    func updateUIView(_ uiView: WKWebView, context: Context) {
        if let url = URL(string: urlString) {
            let request = URLRequest(url: url)
            uiView.load(request)
        }
    }
    
    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }
    
    class Coordinator: NSObject, WKNavigationDelegate, UIScrollViewDelegate {
        var parent: WebView
        
        init(_ parent: WebView) {
            self.parent = parent
        }
        
        func scrollViewDidScroll(_ scrollView: UIScrollView) {
            let offsetY = scrollView.contentOffset.y
            let contentHeight = scrollView.contentSize.height
            let frameHeight = scrollView.frame.size.height
            
            if offsetY + frameHeight >= contentHeight {
                parent.onScrollToBottom?()
            }
        }
    }
}
```

このコードでは、`WebView`はURLの文字列とスクロールが底に達したときに呼び出すクロージャを受け入れます。`Coordinator`クラスは、スクロールが底に達したときにそのクロージャを実行するための`UIScrollViewDelegate`として機能します。

2. この`WebView`を使用して、スクロールが底に達したときに何らかのアクションを実行します。

```swift
struct ContentView: View {
    var body: some View {
        WebView(urlString: "https://example.com") {
            print("スクロールが底に達しました！")
        }
    }
}
```

この方法で、WebViewのスクロールが底に達したときにアクションを実行することができます。

---

## 👤 User
*2023-09-04 14:47:27*

JavaScriptのヘルパーを使用したい

---

## 🤖 Assistant
*2023-09-04 14:48:14*

了解しました。JavaScriptのヘルパーを使用してWebViewのスクロールが底に達したことを検知する方法について説明します。

以下の手順を参考にしてください：

1. まず、`WKWebView`をラッピングするSwiftUIの`WebView`を定義します。この`WebView`は、スクロールの底を検知するJavaScriptを実行するメソッドも持っています。

```swift
import SwiftUI
import WebKit

struct WebView: UIViewRepresentable {
    let urlString: String
    let onScrollToBottom: (() -> Void)?

    func makeUIView(context: Context) -> WKWebView {
        let webView = WKWebView()
        webView.navigationDelegate = context.coordinator
        return webView
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {
        if let url = URL(string: urlString) {
            let request = URLRequest(url: url)
            uiView.load(request)
        }
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    class Coordinator: NSObject, WKNavigationDelegate {
        var parent: WebView

        init(_ parent: WebView) {
            self.parent = parent
        }

        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            webView.evaluateJavaScript("window.onscroll = function() { if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) { window.webkit.messageHandlers.scrollBottom.postMessage('BottomReached') }}", completionHandler: nil)

            webView.configuration.userContentController.add(self, name: "scrollBottom")
        }
    }
}

extension WebView.Coordinator: WKScriptMessageHandler {
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        if message.name == "scrollBottom", let _ = message.body as? String {
            parent.onScrollToBottom?()
        }
    }
}
```

このコードでは、`WKWebView`の`navigationDelegate`メソッドである`webView(_:didFinish:)`を使用して、ページの読み込みが完了したときにJavaScriptを注入しています。このJavaScriptは、ページが底にスクロールされたときに特定のメッセージをWebKitに送信します。

2. この`WebView`を使用して、スクロールが底に達したときに何らかのアクションを実行します。

```swift
struct ContentView: View {
    var body: some View {
        WebView(urlString: "https://example.com") {
            print("スクロールが底に達しました！")
        }
    }
}
```

これで、JavaScriptのヘルパーを使用して、WebViewのスクロールが底に達したことを検知することができます。

---
