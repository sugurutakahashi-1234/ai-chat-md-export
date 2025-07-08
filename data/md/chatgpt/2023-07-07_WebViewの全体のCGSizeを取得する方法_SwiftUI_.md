# WebViewの全体のCGSizeを取得する方法(SwiftUI)

日付: 2023-07-07

---

## 👤 ユーザー
*2023/07/07 16:07:53*

SwiftUIでWebViewを表示させたいのだけれども、そのWebページの全体のコンテンツのGCSizeってどうやったら取れるの？

---

## 🤖 アシスタント
*2023/07/07 16:08:43*

SwiftUIでWebViewを表示するためには、UIKitの `WKWebView` を `UIViewRepresentable` を使ってラップする必要があります。

しかし、WKWebViewのページの全体のコンテントのCGSizeを取得するにはJavaScriptを使用してHTML文書の高さと幅を取得する必要があります。この情報はWKWebViewがロードされた後でなければ取得できないため、そのコールバック内で取得します。

以下に、WKWebViewをラップして、ページの全体のコンテンツのCGSizeを取得するためのSwiftUIビューのサンプルを示します：

```swift
import SwiftUI
import WebKit

struct WebView: UIViewRepresentable {
    let url: URL
    @Binding var contentSize: CGSize

    func makeUIView(context: Context) -> WKWebView {
        let webView = WKWebView()
        webView.navigationDelegate = context.coordinator
        webView.load(URLRequest(url: url))
        return webView
    }

    func updateUIView(_ webView: WKWebView, context: Context) {}

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    class Coordinator: NSObject, WKNavigationDelegate {
        var parent: WebView

        init(_ parent: WebView) {
            self.parent = parent
        }

        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            webView.evaluateJavaScript("document.body.scrollWidth;") { (result, error) in
                if let error = error {
                    print("Error: \(error.localizedDescription)")
                    return
                }

                if let width = result as? CGFloat {
                    webView.evaluateJavaScript("document.body.scrollHeight;") { (result, error) in
                        if let error = error {
                            print("Error: \(error.localizedDescription)")
                            return
                        }

                        if let height = result as? CGFloat {
                            DispatchQueue.main.async {
                                self.parent.contentSize = CGSize(width: width, height: height)
                            }
                        }
                    }
                }
            }
        }
    }
}
```

このコードでは、WebViewのインスタンスがページのロードを完了した時に、`webView(_:didFinish:)` メソッドが呼ばれ、この中で `evaluateJavaScript(_:completionHandler:)` を使用して、ページの全体のコンテンツの幅と高さを取得しています。

これにより、親の `contentSize` バインディングが更新され、その他のSwiftUIビューで使用できます。

---

## 👤 ユーザー
*2023/07/07 16:09:05*

ちなみにアスペクト比もわかったりするのかな？

---

## 🤖 アシスタント
*2023/07/07 16:09:31*

アスペクト比は、通常、オブジェクトの幅と高さの比率を指すため、上記で得られたコンテンツサイズの `CGSize` から計算できます。

たとえば、以下のように `contentSize` を使用してアスペクト比を計算できます：

```swift
let aspectRatio = contentSize.width / contentSize.height
```

ただし、このコードは0での除算を防ぐため、 `contentSize.height` が0でないことを確認する必要があります。以下のように修正可能です：

```swift
let aspectRatio = contentSize.height != 0 ? contentSize.width / contentSize.height : 0
```

これで、ウェブページのコンテンツサイズに基づいたアスペクト比を得ることができます。ただし、ウェブページのコンテンツが変更された場合、このアスペクト比も変わる可能性があることに注意してください。このアスペクト比は、ページがロードされた時点でのものであり、後の動的な変更を反映しません。

---
