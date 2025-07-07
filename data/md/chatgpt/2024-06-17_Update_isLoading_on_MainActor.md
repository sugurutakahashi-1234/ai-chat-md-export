# Update isLoading on MainActor

日付: 2024-06-17

---

## 👤 ユーザー
*2024/6/17 11:26:51*

parent.isLoading = true
Main actor-isolated property 'isLoading' can not be mutated from a non-isolated context; this is an error in the Swift 6 language mode

import SwiftUI
import WebKit

public struct SimpleWebView: UIViewRepresentable {
    private let url: URL
    @Binding var isLoading: Bool

    public init(url: URL, isLoading: Binding&lt;Bool&gt;) {
        self.url = url
        \_isLoading = isLoading
    }

    public func makeUIView(context: Context) -&gt; WKWebView {
        let webView = WKWebView()
        webView.navigationDelegate = context.coordinator
        let request = URLRequest(url: url)
        webView.load(request)
        return webView
    }

    public func updateUIView(\_ webView: WKWebView, context \_: Context) {
        if url != webView.url {
            let request = URLRequest(url: url)
            webView.load(request)
        }
    }

    public func makeCoordinator() -&gt; Coordinator {
        Coordinator(self)
    }

    @MainActor
    public class Coordinator: NSObject, WKNavigationDelegate {
        private let parent: SimpleWebView

        public init(\_ parent: SimpleWebView) {
            self.parent = parent
            super.init()
        }

        nonisolated public func webView(\_: WKWebView, didStartProvisionalNavigation \_: WKNavigation!) {
            parent.isLoading = true
        }

        nonisolated public func webView(\_: WKWebView, didFinish \_: WKNavigation!) {
            parent.isLoading = false
        }
    }
}

#Preview {
    SimpleWebView(url: .placeholder, isLoading: .constant(true))
}

---

## 🤖 アシスタント
*2024/6/17 11:27:05*

The error occurs because the `isLoading` property is a `@Binding` and is actor-isolated to the `MainActor`, while the `webView(_:didStartProvisionalNavigation:)` and `webView(_:didFinish:)` methods are nonisolated. To fix this, you need to ensure that the access to `isLoading` happens on the main actor. You can do this by using `DispatchQueue.main.async` or by making the functions isolated to `MainActor`.

Here is the updated code:

```swift
import SwiftUI
import WebKit

public struct SimpleWebView: UIViewRepresentable {
    private let url: URL
    @Binding var isLoading: Bool

    public init(url: URL, isLoading: Binding<Bool>) {
        self.url = url
        _isLoading = isLoading
    }

    public func makeUIView(context: Context) -> WKWebView {
        let webView = WKWebView()
        webView.navigationDelegate = context.coordinator
        let request = URLRequest(url: url)
        webView.load(request)
        return webView
    }

    public func updateUIView(_ webView: WKWebView, context _: Context) {
        if url != webView.url {
            let request = URLRequest(url: url)
            webView.load(request)
        }
    }

    public func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    @MainActor
    public class Coordinator: NSObject, WKNavigationDelegate {
        private let parent: SimpleWebView

        public init(_ parent: SimpleWebView) {
            self.parent = parent
            super.init()
        }

        public func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
            DispatchQueue.main.async {
                self.parent.isLoading = true
            }
        }

        public func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            DispatchQueue.main.async {
                self.parent.isLoading = false
            }
        }
    }
}

#Preview {
    SimpleWebView(url: .placeholder, isLoading: .constant(true))
}
```

In this updated code, I've wrapped the assignments to `isLoading` in `DispatchQueue.main.async` to ensure that they happen on the main actor. This resolves the actor isolation issue and ensures that the `isLoading` property is updated correctly.

---
