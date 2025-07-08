# Create SwiftUI WebView View

Date: 2024-07-18

---

## 👤 User
*2024-07-18 18:15:31*

これをラップした。左上に×ボタンを設置して、dismissで消すようなViewを作成したい

public struct SimpleWebView: UIViewRepresentable {
    private let url: URL
    @Binding var isLoading: Bool

    public init(url: URL, isLoading: Binding&lt;Bool&gt;) {
        self.url = url
        _isLoading = isLoading
    }

    public func makeUIView(context: Context) -&gt; WKWebView {
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

    public func makeCoordinator() -&gt; Coordinator {
        Coordinator(self)
    }

    @MainActor
    public class Coordinator: NSObject, WKNavigationDelegate {
        private let parent: SimpleWebView

        public init(_ parent: SimpleWebView) {
            self.parent = parent
            super.init()
        }

        public nonisolated func webView(_: WKWebView, didStartProvisionalNavigation _: WKNavigation!) {
            Task { @MainActor in
                parent.isLoading = true
            }
        }

        public nonisolated func webView(_: WKWebView, didFinish _: WKNavigation!) {
            Task { @MainActor in
                parent.isLoading = false
            }
        }
    }
}

#Preview {
    SimpleWebView(url: .placeholder, isLoading: .constant(true))
        .navigationStacked()
}

---

## 🤖 Assistant
*2024-07-18 18:16:04*

`SimpleWebView`をラップし、左上に×ボタンを配置して、ボタンをタップすると`dismiss`で消すようなSwiftUIのビューを作成するには、`SimpleWebView`を使って新しいSwiftUIビューを作成し、その中に×ボタンと`SimpleWebView`を配置する方法を取ります。以下はそのサンプルコードです。

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

        public nonisolated func webView(_: WKWebView, didStartProvisionalNavigation _: WKNavigation!) {
            Task { @MainActor in
                parent.isLoading = true
            }
        }

        public nonisolated func webView(_: WKWebView, didFinish _: WKNavigation!) {
            Task { @MainActor in
                parent.isLoading = false
            }
        }
    }
}

struct WebViewWrapper: View {
    @State private var isLoading = true
    @Environment(\.dismiss) private var dismiss
    let url: URL

    var body: some View {
        NavigationStack {
            VStack {
                SimpleWebView(url: url, isLoading: $isLoading)
                    .edgesIgnoringSafeArea(.all)
            }
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button(action: {
                        dismiss()
                    }) {
                        Image(systemName: "xmark")
                            .foregroundColor(.black)
                    }
                }
            }
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

#Preview {
    WebViewWrapper(url: URL(string: "https://www.example.com")!)
}
```

このコードでは、`WebViewWrapper`という新しいSwiftUIビューを作成し、その中に`SimpleWebView`を配置しています。`NavigationStack`を使用してツールバーに×ボタンを追加し、ボタンが押されたときにビューを閉じる（`dismiss`する）ようにしています。

`WebViewWrapper`は`NavigationStack`の中にあるため、×ボタンはナビゲーションバーの左上に表示されます。ボタンを押すと、`dismiss`関数が呼ばれてビューが閉じられます。

---
