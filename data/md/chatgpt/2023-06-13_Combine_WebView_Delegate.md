# Combine WebView Delegate

Date: 2023-06-13

---

## 👤 User
*2023-06-14 02:27:41*

以下のコードをCombine主流に書き直してほしい。
delegateもなるべくすぐにCobineストリームに直して処理したい

import Foundation
import WebKit

protocol TrackingWebViewDelegate: AnyObject {
    func viewDidLayoutSubviews(
        navigationBarFrame: CGRect,
        webViewFrame: CGRect,
        documentSize: CGSize
    )
    func didFinishLoadingInitialURL()
    func onTrackingEvent(_ event: TrackingWebEvent)
    func visibleElementsDetected(_ elements: VisibleElements)
    func windowScrollPosition(_ windowScrollPosition: WindowScrollPosition)
}

private let javascript = """
function isElementVisible(rect) {
  if (rect.width === 0 || rect.height === 0) {
    return false;
  }
  var windowHeight =
    window.innerHeight || document.documentElement.clientHeight;
  var windowWidth = window.innerWidth || document.documentElement.clientWidth;
  var vertInView = rect.top &lt;= windowHeight && rect.top + rect.height &gt;= 0;
  var horInView = rect.left &lt;= windowWidth && rect.left + rect.width &gt;= 0;
  return vertInView && horInView;
}

function rectObject(rect) {
  return {
    x: rect.x,
    y: rect.y,
    top: rect.top,
    left: rect.left,
    right: rect.right,
    bottom: rect.bottom,
    width: rect.width,
    height: rect.height,
  };
}

var visibleElementsTimer = null
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() =&gt; {
        var windowWidth = window.innerWidth || document.documentElement.clientWidth;
        var windowHeight = window.innerHeight || document.documentElement.clientHeight;
        window.webkit.messageHandlers.jsMessenger.postMessage({
            type: "document_size",
            width: windowWidth,
            height: windowHeight,
        })

        if (visibleElementsTimer !== null) {
            clearInterval(visibleElementsTimer)
        }
        visibleElementsTimer = setInterval(() =&gt; {
            var elements = [];
            Array.from(document.body.querySelectorAll("[id]")).forEach((el) =&gt; {
              let rect = el.getBoundingClientRect();
              if (isElementVisible(rect)) {
                elements.push({
                  id: el.id,
                  boundingClientRect: rectObject(rect),
                });
              }
            });
            if (elements.length &gt; 0) {
                window.webkit.messageHandlers.jsMessenger.postMessage({
                    type: "visible_elements",
                    elements: elements,
                })
            }
        }, 100);
        Array.from(document.body.getElementsByTagName("video")).forEach((video) =&gt; {
            var source = video.getAttribute('src') ?? video.currentSrc
            video.addEventListener("play", () =&gt; {
                window.webkit.messageHandlers.jsMessenger.postMessage({
                    type: "event",
                    event_type: "video_play",
                    source: source
                });
            });
            video.addEventListener("pause", () =&gt; {
                window.webkit.messageHandlers.jsMessenger.postMessage({
                    type: "event",
                    event_type: "video_pause",
                    source: source
                });
            });
            video.addEventListener("ended", () =&gt; {
                window.webkit.messageHandlers.jsMessenger.postMessage({
                    type: "event",
                    event_type: "video_ended",
                    source: source
                });
            });
        })
    }, 50);
})

setInterval(() =&gt; {
    window.webkit.messageHandlers.jsMessenger.postMessage({
        type: "window_scroll_position",
        scrollLeft: window.scrollX,
        scrollTop: window.scrollY,
    })
}, 100);

document.addEventListener("click", function(e) {
    var tagClicked = document.elementFromPoint(e.clientX, e.clientY);
    window.webkit.messageHandlers.jsMessenger.postMessage({
        type: "event",
        event_type: "click",
        x: e.clientX,
        y: e.clientY,
        targetOuterHTML: tagClicked.outerHTML.toString(),
        targetBoundingClientRect: rectObject(tagClicked.getBoundingClientRect()),
    });
});

var scrollEndTimer = null
document.addEventListener("scroll", function(e) {
    let data = {
      type: "event",
      targetId: e.target.id,
      targetTagName: e.target.tagName,
      targetBoundingClientRect: typeof e.target.getBoundingClientRect === "function" ? rectObject(e.target.getBoundingClientRect()) : null,
      scrollLeft: e.target.scrollLeft ?? window.scrollX,
      scrollTop: e.target.scrollTop ?? window.scrollY,
    };
    if (scrollEndTimer === null) {
        window.webkit.messageHandlers.jsMessenger.postMessage({ event_type: "scroll_begin", ...data });
    }
    clearTimeout(scrollEndTimer)
    scrollEndTimer = setTimeout(() =&gt; {
        window.webkit.messageHandlers.jsMessenger.postMessage({ event_type: "scroll_end", ...data });
        scrollEndTimer = null;
    }, 100);
}, true);
"""

final class TrackingWebPresenter: NSObject, ObservableObject {
    let url: URL
    weak var delegate: TrackingWebViewDelegate?
    private var offsetY = 0.0
    private var observers: [NSKeyValueObservation] = []
    let webView = WKWebView()
    @Published var isReady = false

    var navigationBarHeight: Double? { didSet { viewDidLayoutSubviews() } }
    var frame: CGRect? { didSet { viewDidLayoutSubviews() } }
    var documentSize: CGSize? { didSet { viewDidLayoutSubviews() } }

    init(url: URL, delegate: TrackingWebViewDelegate? = nil) {
        self.url = url
        self.delegate = delegate
        super.init()
        webView.uiDelegate = self
        webView.navigationDelegate = self
        setupObservers()

        // WEBサイトの更新が反映されないことがあった為、キャッシュクリア
        WKWebsiteDataStore.default().removeData(
            ofTypes: [WKWebsiteDataTypeDiskCache, WKWebsiteDataTypeMemoryCache],
            modifiedSince: Date(timeIntervalSince1970: 0),
            completionHandler: {}
        )

        let userScript = WKUserScript(
            source: javascript,
            injectionTime: .atDocumentStart,
            forMainFrameOnly: true
        )
        webView.configuration.userContentController.addUserScript(userScript)
    }

    private func setupObservers() {
        func subscriber(for keyPath: KeyPath&lt;WKWebView, some Any&gt;) -&gt; NSKeyValueObservation {
            webView.observe(keyPath, options: [.prior]) { [weak self] _, change in
                if change.isPrior {
                    self?.objectWillChange.send()
                }
            }
        }
        // Setup observers for all KVO compliant properties
        observers = [
            subscriber(for: \.title),
            subscriber(for: \.url),
            subscriber(for: \.isLoading),
            subscriber(for: \.estimatedProgress),
            subscriber(for: \.hasOnlySecureContent),
            subscriber(for: \.serverTrust),
            subscriber(for: \.canGoBack),
            subscriber(for: \.canGoForward),
            subscriber(for: \.themeColor),
            subscriber(for: \.underPageBackgroundColor),
            subscriber(for: \.microphoneCaptureState),
            subscriber(for: \.cameraCaptureState),
        ]
        if #available(iOS 16.0, *) {
            observers.append(subscriber(for: \.fullscreenState))
        }
        // 6月リリースのテストマーケ版ではiOS16以上を対応するので一旦、iOS16未満は無視する
    }

    var title: String? {
        webView.title
    }

    var canGoBack: Bool {
        webView.canGoBack
    }

    var canGoForward: Bool {
        webView.canGoForward
    }

    func onAppear() {
        addUserScript()
        webView.load(URLRequest(url: url))
    }

    private func addUserScript() {
        webView.configuration.userContentController.add(self, name: "jsMessenger")
    }

    func onDisappear() {
        webView.configuration.userContentController
            .removeScriptMessageHandler(forName: "jsMessenger")
    }

    func goBack() {
        webView.goBack()
        trackPageView(url: webView.url)
    }

    func goForward() {
        webView.goForward()
        trackPageView(url: webView.url)
    }

    private func trackPageView(url: URL?) {
        guard let url else { return }
        delegate?.onTrackingEvent(PageView(datetime: Date(), url: url))
    }

    private func viewDidLayoutSubviews() {
        guard let navigationBarHeight,
              let frame,
              let documentSize
        else {
            return
        }
        let navigationBarFrame = CGRect(
            origin: frame.origin,
            size: CGSize(width: frame.size.width, height: navigationBarHeight)
        )
        let webViewFrame = CGRect(
            x: frame.origin.x,
            y: frame.origin.y + navigationBarHeight,
            width: frame.size.width,
            height: frame.size.height - navigationBarHeight
        )
        delegate?.viewDidLayoutSubviews(
            navigationBarFrame: navigationBarFrame,
            webViewFrame: webViewFrame,
            documentSize: documentSize
        )
    }

    private func handleEvent(_ dict: [String: Any]) {
        guard let event_type = dict["event_type"] as? String else {
            return
        }
        switch event_type {
        case "click":
            guard let x = dict["x"] as? Double,
                  let y = dict["y"] as? Double
            else {
                return
            }
            let targetOuterHTML = dict["targetOuterHTML"] as? String ?? nil
            var domRect: DOMRect? = nil
            if let rect = dict["targetBoundingClientRect"] as? [String: Double] {
                domRect = DOMRect.from(dict: rect)
            }
            delegate?.onTrackingEvent(
                Click(datetime: Date(), x: x, y: y, targetOuterHTML: targetOuterHTML, targetBoundingClientRect: domRect))
        case "scroll_begin", "scroll_end":
            guard let scrollLeft = dict["scrollLeft"] as? Double,
                  let scrollTop = dict["scrollTop"] as? Double
            else {
                return
            }
            let isBegin = event_type == "scroll_begin"
            let targetId = dict["targetId"] as? String
            let targetTagName = dict["targetTagName"] as? String
            var domRect: DOMRect? = nil
            if let rect = dict["targetBoundingClientRect"] as? [String: Double] {
                domRect = DOMRect.from(dict: rect)
            }
            let scroll = Scroll(
                type: isBegin ? .scrollBegin : .scrollEnd,
                datetime: Date(),
                scrollLeft: scrollLeft,
                scrollTop: scrollTop,
                targetId: targetId,
                targetTagName: targetTagName,
                targetBoundingClientRect: domRect
            )
            delegate?.onTrackingEvent(scroll)
        case "video_play":
            let event = VideoPlay(datetime: Date(), source: dict["source"] as? String)
            delegate?.onTrackingEvent(event)
        case "video_pause":
            let event = VideoPause(datetime: Date(), source: dict["source"] as? String)
            delegate?.onTrackingEvent(event)
        case "video_ended":
            let event = VideoEnded(datetime: Date(), source: dict["source"] as? String)
            delegate?.onTrackingEvent(event)
        default:
            break
        }
    }

    private func handleDocumentSize(_ dict: [String: Any]) {
        guard let width = dict["width"] as? Double,
              let height = dict["height"] as? Double
        else {
            return
        }
        documentSize = CGSize(width: width, height: height)
    }

    private func handleVisibleElements(_ dict: [String: Any]) {
        guard let elements = dict["elements"] as? [[String: Any]] else {
            return
        }
        let _elements: [VisibleElement] = elements.compactMap {
            guard let id = $0["id"] as? String,
                  let rect = $0["boundingClientRect"] as? [String: Double],
                  let domRect = DOMRect.from(dict: rect)
            else {
                return nil
            }
            return VisibleElement(
                id: id,
                boundingClientRect: domRect
            )
        }
        delegate?.visibleElementsDetected(VisibleElements(
            elements: _elements,
            datetime: Date()
        ))
    }

    private func handleWindowScrollPosition(_ dict: [String: Any]) {
        guard let scrollLeft = dict["scrollLeft"] as? Double,
              let scrollTop = dict["scrollTop"] as? Double
        else {
            return
        }
        delegate?.windowScrollPosition(WindowScrollPosition(
            scrollLeft: scrollLeft,
            scrollTop: scrollTop,
            datetime: Date()
        ))
    }
}

extension TrackingWebPresenter: WKNavigationDelegate {
    func webView(_ webView: WKWebView, didStartProvisionalNavigation _: WKNavigation!) {
        trackPageView(url: webView.url)
    }

    func webView(_: WKWebView, didFinish _: WKNavigation!) {
        if isReady {
            return
        }
        isReady = true
        delegate?.didFinishLoadingInitialURL()
    }
}

extension TrackingWebPresenter: WKUIDelegate {
    func webView(_ webView: WKWebView, createWebViewWith _: WKWebViewConfiguration, for navigationAction: WKNavigationAction, windowFeatures _: WKWindowFeatures) -&gt; WKWebView? {
        if navigationAction.targetFrame?.isMainFrame != true {
            webView.load(navigationAction.request)
        }
        return nil
    }
}

extension TrackingWebPresenter: WKScriptMessageHandler {
    func userContentController(_: WKUserContentController, didReceive message: WKScriptMessage) {
        guard let dict = message.body as? [String: Any],
              let type = dict["type"] as? String
        else {
            return
        }

        switch type {
        case "event":
            handleEvent(dict)
        case "document_size":
            handleDocumentSize(dict)
        case "visible_elements":
            handleVisibleElements(dict)
        case "window_scroll_position":
            handleWindowScrollPosition(dict)
        default:
            break
        }
    }
}

---

## 🤖 Assistant
*2023-06-14 02:29:01*

SwiftUIとCombineを使ってイベントをストリーム化することで、デリゲートを使用しない形に書き換えることが可能です。以下にその例を示します。

```swift
import Foundation
import WebKit
import Combine

final class TrackingWebPresenter: NSObject, ObservableObject {
    let url: URL
    private var offsetY = 0.0
    private var observers: [NSKeyValueObservation] = []
    let webView = WKWebView()
    @Published var isReady = false

    // CombineのPassthroughSubjectを使用してイベントをストリーム化
    let viewDidLayoutSubviewsPublisher = PassthroughSubject<(navigationBarFrame: CGRect, webViewFrame: CGRect, documentSize: CGSize), Never>()
    let didFinishLoadingInitialURLPublisher = PassthroughSubject<Void, Never>()
    let onTrackingEventPublisher = PassthroughSubject<TrackingWebEvent, Never>()
    let visibleElementsDetectedPublisher = PassthroughSubject<VisibleElements, Never>()
    let windowScrollPositionPublisher = PassthroughSubject<WindowScrollPosition, Never>()

    var navigationBarHeight: Double? { didSet { viewDidLayoutSubviews() } }
    var frame: CGRect? { didSet { viewDidLayoutSubviews() } }
    var documentSize: CGSize? { didSet { viewDidLayoutSubviews() } }

    // 同じ機能を持つ他のコードは同じように更新する
    // 例: handleEventの中で、delegate?.onTrackingEvent(event)の部分をonTrackingEventPublisher.send(event)に書き換える

    // すべてのデリゲート呼び出しをPassthroughSubjectのsendメソッドの呼び出しに置き換える
    // 例: delegate?.didFinishLoadingInitialURL() → didFinishLoadingInitialURLPublisher.send()
}
```

この書き換えにより、各イベントはPassthroughSubjectによってストリーム化され、購読者がそのイベントを購読することが可能となります。これにより、SwiftUIのビューや他のCombineのオペレーターでこれらのイベントを使用することが容易になります。

CombineはiOS 13以降で利用可能なフレームワークで、非同期処理とイベントの処理を扱うための強力な道具です。SwiftUIとの親和性が高く、データの流れをより明示的に表現することができます。

---

## 👤 User
*2023-06-14 02:30:10*

もう少し具体的に続きをかいてほしい。

---

## 🤖 Assistant
*2023-06-14 02:31:55*

すみませんが、記載されているコードのどの部分をCombineを使用して書き直したいかを具体的に教えていただけますか？DelegateのパターンをCombineに移行する場合、それぞれのDelegateメソッドを特定のPublisherに変換することになります。

ただし、これはSwiftUIとCombineを使用したアーキテクチャの変更であり、大規模なリファクタリングを必要とするかもしれません。あなたがどの部分をCombineで書き直したいかによります。

例えば、以下のように`TrackingWebViewDelegate`を置き換えるためのPublisherを作成することができます。

```swift
import Combine
import Foundation

final class TrackingWebPresenter: NSObject, ObservableObject {
    // ... some code omitted ...

    // Publisherを追加
    private let viewDidLayoutSubviewsSubject = PassthroughSubject<(navigationBarFrame: CGRect, webViewFrame: CGRect, documentSize: CGSize), Never>()
    private let didFinishLoadingInitialURLSubject = PassthroughSubject<Void, Never>()
    private let onTrackingEventSubject = PassthroughSubject<TrackingWebEvent, Never>()
    private let visibleElementsDetectedSubject = PassthroughSubject<VisibleElements, Never>()
    private let windowScrollPositionSubject = PassthroughSubject<WindowScrollPosition, Never>()

    var viewDidLayoutSubviewsPublisher: AnyPublisher<(navigationBarFrame: CGRect, webViewFrame: CGRect, documentSize: CGSize), Never> {
        viewDidLayoutSubviewsSubject.eraseToAnyPublisher()
    }
    var didFinishLoadingInitialURLPublisher: AnyPublisher<Void, Never> {
        didFinishLoadingInitialURLSubject.eraseToAnyPublisher()
    }
    var onTrackingEventPublisher: AnyPublisher<TrackingWebEvent, Never> {
        onTrackingEventSubject.eraseToAnyPublisher()
    }
    var visibleElementsDetectedPublisher: AnyPublisher<VisibleElements, Never> {
        visibleElementsDetectedSubject.eraseToAnyPublisher()
    }
    var windowScrollPositionPublisher: AnyPublisher<WindowScrollPosition, Never> {
        windowScrollPositionSubject.eraseToAnyPublisher()
    }
  
    // ... some code omitted ...

    // 例えば、ここでdelegateメソッドを呼び出す代わりに、Subjectのsendメソッドを使用します。
    private func viewDidLayoutSubviews() {
        guard let navigationBarHeight,
              let frame,
              let documentSize
        else {
            return
        }
        let navigationBarFrame = CGRect(
            origin: frame.origin,
            size: CGSize(width: frame.size.width, height: navigationBarHeight)
        )
        let webViewFrame = CGRect(
            x: frame.origin.x,
            y: frame.origin.y + navigationBarHeight,
            width: frame.size.width,
            height: frame.size.height - navigationBarHeight
        )
        viewDidLayoutSubviewsSubject.send(
            (
                navigationBarFrame: navigationBarFrame,
                webViewFrame: webViewFrame,
                documentSize: documentSize
            )
        )
    }

    // その他のdelegateメソッドも同様に、Subjectのsendメソッドを使用して書き換えます。
    // 例：delegate?.onTrackingEvent(event) -> onTrackingEventSubject.send(event)
}
```

このように、各PublisherをSubscribeすること

---

## 👤 User
*2023-06-14 02:32:17*

つづき

---

## 🤖 Assistant
*2023-06-14 02:33:13*

各PublisherをSubscribeすることで、それぞれのイベントに対応した処理を行うことができます。例えば、あるイベントが発生したときに特定のUIの更新を行う、などです。以下にその一例を示します：

```swift
class SomeViewModel: ObservableObject {
    private var cancellables: Set<AnyCancellable> = []
    private let presenter: TrackingWebPresenter

    init(presenter: TrackingWebPresenter) {
        self.presenter = presenter

        presenter.viewDidLayoutSubviewsPublisher
            .sink { [weak self] (navigationBarFrame, webViewFrame, documentSize) in
                //ここでnavigationBarFrame, webViewFrame, documentSizeに基づいて何らかの処理を行う
                //たとえば、UIの更新など
            }
            .store(in: &cancellables)

        presenter.didFinishLoadingInitialURLPublisher
            .sink { [weak self] in
                //初期URLのロードが完了したときの処理をここに書く
            }
            .store(in: &cancellables)

        // 他のPublisherについても同様に処理を書くことができます
    }

    // 他のViewModelのロジック
}
```

このように、Combineを使用して非同期イベントを処理することで、Delegateパターンを使用したときと比べてコードがシンプルになり、データフローがより直感的に理解できるようになります。

ただし、この移行は完全にアーキテクチャの変更を伴うため、一度にすべての部分を変更するのではなく、小さな部分から始めて徐々に拡大していくことをお勧めします。また、全体的なアプリのアーキテクチャと合わせて、どの程度Combineを採用するかを考えることも重要です。

---

## 👤 User
*2023-06-14 02:35:25*

以下のようになっていることがわかってこの辺も含めてリファクタリングできるかな？

struct TrackingWebEvents: Encodable {
    var start: Date?
    var end: Date?
    var screenSize: CGSize?
    var navigationBarFrame: CGRect?
    var webViewFrame: CGRect?
    var documentSize: CGSize?
    var events = [TrackingWebEvent]()
    var visibleElements = [VisibleElements]()
    var windowScrollPositions = [WindowScrollPosition]()
}

extension WebViewTrackerRootPresenter: TrackingWebViewDelegate {
    private var tracker = TrackingWebEvents(
        screenSize: UIScreen.main.bounds.size
    )
    
    func viewDidLayoutSubviews(
        navigationBarFrame: CGRect,
        webViewFrame: CGRect,
        documentSize: CGSize
    ) {
        tracker.navigationBarFrame = navigationBarFrame
        tracker.webViewFrame = webViewFrame
        tracker.documentSize = documentSize
    }

    func didFinishLoadingInitialURL() {}

    func onTrackingEvent(_ event: TrackingWebEvent) {
        tracker.events.append(event)
    }

    func visibleElementsDetected(_ elements: VisibleElements) {
        tracker.visibleElements.append(elements)
    }

    func windowScrollPosition(_ windowScrollPosition: WindowScrollPosition) {
        tracker.windowScrollPositions.append(windowScrollPosition)
    }
}

---

## 🤖 Assistant
*2023-06-14 02:36:29*

TrackingWebEventsがすべてのイベントを記録しているようですので、これらのイベントをPublishersに変換することで、これらのイベントを触れる他の部分のコードも一貫性を持たせてリファクタリングできます。次にその例を示します：

```swift
class TrackingWebEvents: ObservableObject {
    @Published var start: Date?
    @Published var end: Date?
    @Published var screenSize: CGSize?
    @Published var navigationBarFrame: CGRect?
    @Published var webViewFrame: CGRect?
    @Published var documentSize: CGSize?
    @Published var events = [TrackingWebEvent]()
    @Published var visibleElements = [VisibleElements]()
    @Published var windowScrollPositions = [WindowScrollPosition]()
}

class WebViewTrackerRootPresenter {
    @ObservedObject var tracker: TrackingWebEvents = TrackingWebEvents(
        screenSize: UIScreen.main.bounds.size
    )
    
    func viewDidLayoutSubviews(
        navigationBarFrame: CGRect,
        webViewFrame: CGRect,
        documentSize: CGSize
    ) {
        tracker.navigationBarFrame = navigationBarFrame
        tracker.webViewFrame = webViewFrame
        tracker.documentSize = documentSize
    }

    func didFinishLoadingInitialURL() {}

    func onTrackingEvent(_ event: TrackingWebEvent) {
        tracker.events.append(event)
    }

    func visibleElementsDetected(_ elements: VisibleElements) {
        tracker.visibleElements.append(elements)
    }

    func windowScrollPosition(_ windowScrollPosition: WindowScrollPosition) {
        tracker.windowScrollPositions.append(windowScrollPosition)
    }
}
```

これにより、WebViewTrackerRootPresenterがトラッキングイベントを発行したときに、そのイベントを購読している他のクラスやビューは自動的に更新されます。

ただし、この方法はトラッキングイベントが発行されたときにすべての購読者に対して更新を行うため、パフォーマンスに影響を及ぼす可能性があります。これは、特に大量のイベントが発行される場合や、多くの購読者がいる場合に問題となります。

この問題を解決するためには、購読者が必要なイベントだけを購読するように設計するか、またはトラッキングイベントをバッファリングして一定間隔で発行するなどの方法が考えられます。これらの解決策はアプリケーションの具体的な要件によりますので、慎重に選択してください。

---

## 👤 User
*2023-06-14 02:39:40*

import SwiftUI

ちょっと多くのコードを渡すので、全体的にどこを改善して、どうな教えていくべきなのかを教えて欲しい。最終的にTrackingWebEventsをアップデートさせていくことが目的なコードなんだけど、それの見通しをよくしたいだけなんだ。

public struct WebViewTrackerRootView: View {
    private let url = URL(string: "https://www.viagate.com/")!
    let presenter = WebViewTrackerRootPresenter()

    public init() {}

    public var body: some View {
        Group {
            switch presenter.state {
            case .webBrowsing:
                TrackingWebView(presenter: TrackingWebPresenter(url: url, delegate: presenter))
            case .error:
                Text("エラーが発生しました")
            }
        }
        .onDisappear {
            presenter.saveTrackingWebEvents()
        }
    }
}


class WebViewTrackerRootPresenter: ObservableObject {
    @Published var state = State.webBrowsing
    private let webEventsURL = FileManager.default.directoryURL(directory: .document)
        .appendingPathComponent("web_events.json")

    enum State {
        case webBrowsing
        case error
    }

    init() {
        tracker.start = Date()
    }

    private var tracker = TrackingWebEvents(
        screenSize: UIScreen.main.bounds.size
    )

    func saveTrackingWebEvents() {
        if state == .error {
            return
        }
        tracker.end = Date()
        do {
            if let json = try tracker.asJson {
                try json.write(to: webEventsURL, atomically: true, encoding: .utf8)
                return
            }
        } catch {
            state = .error
        }
    }
}

extension WebViewTrackerRootPresenter: TrackingWebViewDelegate {
    func viewDidLayoutSubviews(
        navigationBarFrame: CGRect,
        webViewFrame: CGRect,
        documentSize: CGSize
    ) {
        tracker.navigationBarFrame = navigationBarFrame
        tracker.webViewFrame = webViewFrame
        tracker.documentSize = documentSize
    }

    func didFinishLoadingInitialURL() {}

    func onTrackingEvent(_ event: TrackingWebEvent) {
        tracker.events.append(event)
    }

    func visibleElementsDetected(_ elements: VisibleElements) {
        tracker.visibleElements.append(elements)
    }

    func windowScrollPosition(_ windowScrollPosition: WindowScrollPosition) {
        tracker.windowScrollPositions.append(windowScrollPosition)
    }
}

public struct WebView: View, UIViewRepresentable {
    public let webView: WKWebView

    public init(webView: WKWebView) {
        self.webView = webView
    }

    public func makeUIView(context _: UIViewRepresentableContext&lt;WebView&gt;) -&gt; WKWebView {
        webView
    }

    public func updateUIView(_: WKWebView, context _: UIViewRepresentableContext&lt;WebView&gt;) {}
}


struct TrackingWebView: View {
    @StateObject var presenter: TrackingWebPresenter

    var webView: some View {
        WebView(webView: presenter.webView)
            .navigationBarTitle(Text(verbatim: presenter.title ?? ""), displayMode: .inline)
            .navigationBarItems(trailing: HStack {
                Button(action: presenter.goBack) {
                    Image(systemName: "chevron.left")
                        .imageScale(.large)
                        .aspectRatio(contentMode: .fit)
                        .frame(width: 32, height: 32)
                }
                .disabled(!presenter.canGoBack)
                Button(action: presenter.goForward) {
                    Image(systemName: "chevron.right")
                        .imageScale(.large)
                        .aspectRatio(contentMode: .fit)
                        .frame(width: 32, height: 32)
                }
                .disabled(!presenter.canGoForward)
            })
    }

    var body: some View {
        NavigationView {
            if !presenter.isReady {
                ProgressView("読込中...")
            } else {
                ZStack {
                    NavigationBarAccessor { navBar in
                        presenter.navigationBarHeight = navBar.frame.size.height
                    }
                    GeometryReader { geometry in
                        webView.onAppear {
                            presenter.frame = geometry.frame(in: .global)
                        }
                    }
                }
            }
        }
        .onAppear(perform: presenter.onAppear)
        .onDisappear(perform: presenter.onDisappear)
    }
}

struct AppWebView_Previews: PreviewProvider {
    static var previews: some View {
        TrackingWebView(presenter: TrackingWebPresenter(
            url: URL(string: "https://amazon.co.jp")!
        ))
    }
}

protocol TrackingWebViewDelegate: AnyObject {
    func viewDidLayoutSubviews(
        navigationBarFrame: CGRect,
        webViewFrame: CGRect,
        documentSize: CGSize
    )
    func didFinishLoadingInitialURL()
    func onTrackingEvent(_ event: TrackingWebEvent)
    func visibleElementsDetected(_ elements: VisibleElements)
    func windowScrollPosition(_ windowScrollPosition: WindowScrollPosition)
}

final class TrackingWebPresenter: NSObject, ObservableObject {
    let url: URL
    weak var delegate: TrackingWebViewDelegate?
    private var offsetY = 0.0
    private var observers: [NSKeyValueObservation] = []
    let webView = WKWebView()
    @Published var isReady = false

    var navigationBarHeight: Double? { didSet { viewDidLayoutSubviews() } }
    var frame: CGRect? { didSet { viewDidLayoutSubviews() } }
    var documentSize: CGSize? { didSet { viewDidLayoutSubviews() } }

    init(url: URL, delegate: TrackingWebViewDelegate? = nil) {
        self.url = url
        self.delegate = delegate
        super.init()
        webView.uiDelegate = self
        webView.navigationDelegate = self
        setupObservers()

        // WEBサイトの更新が反映されないことがあった為、キャッシュクリア
        WKWebsiteDataStore.default().removeData(
            ofTypes: [WKWebsiteDataTypeDiskCache, WKWebsiteDataTypeMemoryCache],
            modifiedSince: Date(timeIntervalSince1970: 0),
            completionHandler: {}
        )

        let userScript = WKUserScript(
            source: javascript,
            injectionTime: .atDocumentStart,
            forMainFrameOnly: true
        )
        webView.configuration.userContentController.addUserScript(userScript)
    }

    private func setupObservers() {
        func subscriber(for keyPath: KeyPath&lt;WKWebView, some Any&gt;) -&gt; NSKeyValueObservation {
            webView.observe(keyPath, options: [.prior]) { [weak self] _, change in
                if change.isPrior {
                    self?.objectWillChange.send()
                }
            }
        }
        // Setup observers for all KVO compliant properties
        observers = [
            subscriber(for: \.title),
            subscriber(for: \.url),
            subscriber(for: \.isLoading),
            subscriber(for: \.estimatedProgress),
            subscriber(for: \.hasOnlySecureContent),
            subscriber(for: \.serverTrust),
            subscriber(for: \.canGoBack),
            subscriber(for: \.canGoForward),
            subscriber(for: \.themeColor),
            subscriber(for: \.underPageBackgroundColor),
            subscriber(for: \.microphoneCaptureState),
            subscriber(for: \.cameraCaptureState),
        ]
        if #available(iOS 16.0, *) {
            observers.append(subscriber(for: \.fullscreenState))
        }
        // 6月リリースのテストマーケ版ではiOS16以上を対応するので一旦、iOS16未満は無視する
    }

    var title: String? {
        webView.title
    }

    var canGoBack: Bool {
        webView.canGoBack
    }

    var canGoForward: Bool {
        webView.canGoForward
    }

    func onAppear() {
        addUserScript()
        webView.load(URLRequest(url: url))
    }

    private func addUserScript() {
        webView.configuration.userContentController.add(self, name: "jsMessenger")
    }

    func onDisappear() {
        webView.configuration.userContentController
            .removeScriptMessageHandler(forName: "jsMessenger")
    }

    func goBack() {
        webView.goBack()
        trackPageView(url: webView.url)
    }

    func goForward() {
        webView.goForward()
        trackPageView(url: webView.url)
    }

    private func trackPageView(url: URL?) {
        guard let url else { return }
        delegate?.onTrackingEvent(PageView(datetime: Date(), url: url))
    }

    private func viewDidLayoutSubviews() {
        guard let navigationBarHeight,
              let frame,
              let documentSize
        else {
            return
        }
        let navigationBarFrame = CGRect(
            origin: frame.origin,
            size: CGSize(width: frame.size.width, height: navigationBarHeight)
        )
        let webViewFrame = CGRect(
            x: frame.origin.x,
            y: frame.origin.y + navigationBarHeight,
            width: frame.size.width,
            height: frame.size.height - navigationBarHeight
        )
        delegate?.viewDidLayoutSubviews(
            navigationBarFrame: navigationBarFrame,
            webViewFrame: webViewFrame,
            documentSize: documentSize
        )
    }

    private func handleEvent(_ dict: [String: Any]) {
        guard let event_type = dict["event_type"] as? String else {
            return
        }
        switch event_type {
        case "click":
            guard let x = dict["x"] as? Double,
                  let y = dict["y"] as? Double
            else {
                return
            }
            let targetOuterHTML = dict["targetOuterHTML"] as? String ?? nil
            var domRect: DOMRect? = nil
            if let rect = dict["targetBoundingClientRect"] as? [String: Double] {
                domRect = DOMRect.from(dict: rect)
            }
            delegate?.onTrackingEvent(
                Click(datetime: Date(), x: x, y: y, targetOuterHTML: targetOuterHTML, targetBoundingClientRect: domRect))
        case "scroll_begin", "scroll_end":
            guard let scrollLeft = dict["scrollLeft"] as? Double,
                  let scrollTop = dict["scrollTop"] as? Double
            else {
                return
            }
            let isBegin = event_type == "scroll_begin"
            let targetId = dict["targetId"] as? String
            let targetTagName = dict["targetTagName"] as? String
            var domRect: DOMRect? = nil
            if let rect = dict["targetBoundingClientRect"] as? [String: Double] {
                domRect = DOMRect.from(dict: rect)
            }
            let scroll = Scroll(
                type: isBegin ? .scrollBegin : .scrollEnd,
                datetime: Date(),
                scrollLeft: scrollLeft,
                scrollTop: scrollTop,
                targetId: targetId,
                targetTagName: targetTagName,
                targetBoundingClientRect: domRect
            )
            delegate?.onTrackingEvent(scroll)
        case "video_play":
            let event = VideoPlay(datetime: Date(), source: dict["source"] as? String)
            delegate?.onTrackingEvent(event)
        case "video_pause":
            let event = VideoPause(datetime: Date(), source: dict["source"] as? String)
            delegate?.onTrackingEvent(event)
        case "video_ended":
            let event = VideoEnded(datetime: Date(), source: dict["source"] as? String)
            delegate?.onTrackingEvent(event)
        default:
            break
        }
    }

    private func handleDocumentSize(_ dict: [String: Any]) {
        guard let width = dict["width"] as? Double,
              let height = dict["height"] as? Double
        else {
            return
        }
        documentSize = CGSize(width: width, height: height)
    }

    private func handleVisibleElements(_ dict: [String: Any]) {
        guard let elements = dict["elements"] as? [[String: Any]] else {
            return
        }
        let _elements: [VisibleElement] = elements.compactMap {
            guard let id = $0["id"] as? String,
                  let rect = $0["boundingClientRect"] as? [String: Double],
                  let domRect = DOMRect.from(dict: rect)
            else {
                return nil
            }
            return VisibleElement(
                id: id,
                boundingClientRect: domRect
            )
        }
        delegate?.visibleElementsDetected(VisibleElements(
            elements: _elements,
            datetime: Date()
        ))
    }

    private func handleWindowScrollPosition(_ dict: [String: Any]) {
        guard let scrollLeft = dict["scrollLeft"] as? Double,
              let scrollTop = dict["scrollTop"] as? Double
        else {
            return
        }
        delegate?.windowScrollPosition(WindowScrollPosition(
            scrollLeft: scrollLeft,
            scrollTop: scrollTop,
            datetime: Date()
        ))
    }
}

extension TrackingWebPresenter: WKNavigationDelegate {
    func webView(_ webView: WKWebView, didStartProvisionalNavigation _: WKNavigation!) {
        trackPageView(url: webView.url)
    }

    func webView(_: WKWebView, didFinish _: WKNavigation!) {
        if isReady {
            return
        }
        isReady = true
        delegate?.didFinishLoadingInitialURL()
    }
}

extension TrackingWebPresenter: WKUIDelegate {
    func webView(_ webView: WKWebView, createWebViewWith _: WKWebViewConfiguration, for navigationAction: WKNavigationAction, windowFeatures _: WKWindowFeatures) -&gt; WKWebView? {
        if navigationAction.targetFrame?.isMainFrame != true {
            webView.load(navigationAction.request)
        }
        return nil
    }
}

extension TrackingWebPresenter: WKScriptMessageHandler {
    func userContentController(_: WKUserContentController, didReceive message: WKScriptMessage) {
        guard let dict = message.body as? [String: Any],
              let type = dict["type"] as? String
        else {
            return
        }

        switch type {
        case "event":
            handleEvent(dict)
        case "document_size":
            handleDocumentSize(dict)
        case "visible_elements":
            handleVisibleElements(dict)
        case "window_scroll_position":
            handleWindowScrollPosition(dict)
        default:
            break
        }
    }
}


struct TrackingWebEvents: Encodable {
    var start: Date?
    var end: Date?
    var screenSize: CGSize?
    var navigationBarFrame: CGRect?
    var webViewFrame: CGRect?
    var documentSize: CGSize?
    var events = [TrackingWebEvent]()
    var visibleElements = [VisibleElements]()
    var windowScrollPositions = [WindowScrollPosition]()
}

---

## 🤖 Assistant
*2023-06-14 02:44:59*

コード全体を見て、以下の提案をします：

1. **Error Handling:** 現在、コード内でエラーを検出したときには、`WebViewTrackerRootPresenter` の `state` にエラーが設定されますが、これはエラーメッセージの詳細を提供するのに十分ではないかもしれません。エラーハンドリングを改善するために、より具体的なエラー情報（エラーメッセージやエラーコードなど）を `state` に含めるようにすると良いでしょう。

2. **Separation of Concerns (関心の分離):** いくつかのクラスや構造体が、特定の責任を持ちすぎているように見えます。例えば、`TrackingWebPresenter` クラスは WebView の管理、イベントトラッキング、そしてデータ変換も行っています。これらの役割をより特化したクラスや関数に分割することで、コードの再利用性とテストの容易さを向上させることができます。

3. **Code Comments (コードコメント):** コード内には多くの複雑なロジックが含まれていますが、それらの説明や目的を理解するためのコメントが少ないです。コードが何を行っているのか、なぜそのような設計がなされたのかを理解するためには、適切なコメントが役立つでしょう。

4. **Strong Typing (強い型付け):** JavaScript からのメッセージをハンドリングする際に、任意の辞書をパースしています。これは型安全性を損ない、ランタイムエラーの可能性を高めます。JavaScriptからのメッセージを明確に定義した構造体にデコードすることを検討してみてください。

5. **User Interface (ユーザーインターフェース):** エラーが発生した場合には、シンプルなエラーメッセージを表示しています。しかし、ユーザーがアクションを再試行したり、エラー情報を共有したりするためのインターフェースを提供することで、よりユーザーフレンドリーなアプリになります。

6. **Code Duplication (コードの重複):** いくつかの場所でコードの重複が見受けられます。例えば、`handleEvent` メソッド内の各イベントタイプの処理は非常に似ています。これらのコードを一般化して共通の関数に抽

---

## 🤖 Assistant
*2023-06-14 02:46:17*

.anchor-bot&lt;|im_sep|&gt;このコードのレビューに基づき、いくつかの改善の提案をします。

1. データ処理の分離:
   `WebViewTrackerRootPresenter` クラスはデータの保存に関しては責任を負っていますが、その部分を別のデータ管理クラスに分離することをお勧めします。これにより、Presenterはビジネスロジックに専念でき、データ管理とビジネスロジックの間のクリーンな境界が形成されます。

2. エラーハンドリングの改善:
   何か問題が発生した場合に、現在は `state` を `.error` に設定していますが、これだとエラーの詳細を伝えることが難しくなります。代わりに、エラーオブジェクトを保存し、それを使用して具体的なエラーメッセージを表示できるようにすると良いでしょう。

3. コードの再利用性を向上させる:
   現在は、特定のウェブサイト（"https://www.viagate.com/"）での追跡のみをサポートしていますが、異なるURLを追跡できるようにするとコードの再利用性が向上します。

4. カプセル化の改善:
   一部のプロパティ（例えば `webView`）は外部から直接アクセス可能ですが、これはカプセル化を破壊します。これらのプロパティをプライベートにし、必要に応じてパブリックなゲッターやセッターを提供することを検討してみてください。

5. レイアウトの最適化:
   `TrackingWebView` のレイアウトは非常に複雑になっています。ナビゲーションバーのアクセサーやジオメトリリーダーを使用していますが、これらを簡素化するか、他の方法でレイアウト情報を取得すると、コードが読みやすくなります。

6. `WKWebView` でキャッシュをクリアしていますが、これはユーザーの体験を損なう可能性があります。必要な場合のみキャッシュをクリアするか、またはキャッシュクリアのオプションをユーザーに提供すると良いでしょう。

7. `TrackingWebPresenter` において、`title`, `canGoBack`, `canGoForward` などのプロパティを直接公開する代わりに、それらの値の変更を監視するための

---

## 👤 User
*2023-06-14 02:46:21*

これらの処理はTrackingWebEventsにデータを収集することでdelegate経由で行なっていて、見通しが悪いので改善したい。それぞれを別の変数で宣言しておいて、最後にTrackingWebEventsを作成してもいいのかなとも思っている。

---

## 🤖 Assistant
*2023-06-14 02:47:16*

データを収集するために各処理を行い、その後で `TrackingWebEvents` を作成するアプローチは合理的であり、実際にはソフトウェア開発の一般的なパターンでもあります。特に、処理が複雑で、その過程で複数の値が作成される場合、このようなアプローチが有効です。

具体的な手順は以下の通りです：

1. まず、各処理を行い、その結果をそれぞれの変数に保存します。例えば、`event1Result`, `event2Result` などといった変数を用意します。

2. すべての処理が終わった後で、これらの結果をまとめて `TrackingWebEvents` のインスタンスを作成します。

この方法の利点は、各処理が独立して行われ、その結果が明確に分かるということです。それぞれの処理が何を行い、どのような結果を生成するのかが一目でわかるため、コードの読みやすさと保守性が向上します。

また、各処理が独立しているため、テストも容易になります。特定の処理が意図した通りに機能しているかを単独で検証することができます。

ただし、注意すべき点は、各処理が互いに依存していないこと、または依存関係が明確に管理されていることです。処理の間に依存関係がある場合、その順序を正しく管理する必要があります。

---

## 👤 User
*2023-06-14 02:47:34*

上記の方針で、delegate経由で行なっていている処理をやめたい

---

## 🤖 Assistant
*2023-06-14 02:48:53*

delegate経由で行なっている処理を止めたいということは、あなたがコードの見通しを改善し、テストのしやすさを向上させたいという意味だと理解しました。

あなたが delegate パターンを使っているということは、特定のオブジェクトがその処理を他のオブジェクトに委譲しているということです。これは一般的に、特定のオブジェクトがあまりにも多くの責任を持っている場合、または処理があまりにも複雑である場合に使用されます。しかし、使い方によっては見通しが悪くなり、コードが理解しづらくなる場合もあります。

具体的な解決策を提案するには、現在のコードや設計の具体的な内容について更に情報が必要ですが、一般的なアプローチとしては以下のようなものがあります：

- **処理をより小さな部品に分解する**：各部品が一つの特定のタスクを担当するようにします。これにより、各部品をテストしやすくなり、問題が発生したときに特定の部品を修正することができます。
- **Factoryパターンを使用する**：Factoryパターンを使用して、特定のオブジェクトの作成を抽象化します。これにより、オブジェクトの生成が他のオブジェクトから独立して行われ、見通しの改善に役立つ可能性があります。
- **依存関係の注入**：依存関係の注入を使用して、特定のオブジェクトに必要な依存オブジェクトを外部から供給します。これにより、特定のオブジェクトが特定の処理を自身で行うのではなく、それが供給されるため、オブジェクト間の疎結合性が保たれ、見通しが改善されます。

具体的な解決策を提案するためには、具体的なコードや設計について更に情報が必要です。どのような処理を delegate 経由で行っているのか、それらの処理がどのように関連しているのかなど、より詳細な情報を提供していただけると、より具体的なアドバイスが可能となります。

---

## 👤 User
*2023-06-14 02:50:10*

class WebViewTrackerRootPresenter: ObservableObject {
    @Published var state = State.webBrowsing
    private let webEventsURL = FileManager.default.directoryURL(directory: .document)
        .appendingPathComponent("web_events.json")

    enum State {
        case webBrowsing
        case error
    }

    init() {
        tracker.start = Date()
    }

    private var tracker = TrackingWebEvents(
        screenSize: UIScreen.main.bounds.size
    )

    func saveTrackingWebEvents() {
        if state == .error {
            return
        }
        tracker.end = Date()
        do {
            if let json = try tracker.asJson {
                try json.write(to: webEventsURL, atomically: true, encoding: .utf8)
                return
            }
        } catch {
            state = .error
        }
    }
}

extension WebViewTrackerRootPresenter: TrackingWebViewDelegate {
    func viewDidLayoutSubviews(
        navigationBarFrame: CGRect,
        webViewFrame: CGRect,
        documentSize: CGSize
    ) {
        tracker.navigationBarFrame = navigationBarFrame
        tracker.webViewFrame = webViewFrame
        tracker.documentSize = documentSize
    }

    func didFinishLoadingInitialURL() {}

    func onTrackingEvent(_ event: TrackingWebEvent) {
        tracker.events.append(event)
    }

    func visibleElementsDetected(_ elements: VisibleElements) {
        tracker.visibleElements.append(elements)
    }

    func windowScrollPosition(_ windowScrollPosition: WindowScrollPosition) {
        tracker.windowScrollPositions.append(windowScrollPosition)
    }
}

final class TrackingWebPresenter: NSObject, ObservableObject {
    let url: URL
    weak var delegate: TrackingWebViewDelegate?
    private var offsetY = 0.0
    private var observers: [NSKeyValueObservation] = []
    let webView = WKWebView()
    @Published var isReady = false

    var navigationBarHeight: Double? { didSet { viewDidLayoutSubviews() } }
    var frame: CGRect? { didSet { viewDidLayoutSubviews() } }
    var documentSize: CGSize? { didSet { viewDidLayoutSubviews() } }

    init(url: URL, delegate: TrackingWebViewDelegate? = nil) {
        self.url = url
        self.delegate = delegate
        super.init()
        webView.uiDelegate = self
        webView.navigationDelegate = self
        setupObservers()

        // WEBサイトの更新が反映されないことがあった為、キャッシュクリア
        WKWebsiteDataStore.default().removeData(
            ofTypes: [WKWebsiteDataTypeDiskCache, WKWebsiteDataTypeMemoryCache],
            modifiedSince: Date(timeIntervalSince1970: 0),
            completionHandler: {}
        )

        let userScript = WKUserScript(
            source: javascript,
            injectionTime: .atDocumentStart,
            forMainFrameOnly: true
        )
        webView.configuration.userContentController.addUserScript(userScript)
    }

    private func setupObservers() {
        func subscriber(for keyPath: KeyPath&lt;WKWebView, some Any&gt;) -&gt; NSKeyValueObservation {
            webView.observe(keyPath, options: [.prior]) { [weak self] _, change in
                if change.isPrior {
                    self?.objectWillChange.send()
                }
            }
        }
        // Setup observers for all KVO compliant properties
        observers = [
            subscriber(for: \.title),
            subscriber(for: \.url),
            subscriber(for: \.isLoading),
            subscriber(for: \.estimatedProgress),
            subscriber(for: \.hasOnlySecureContent),
            subscriber(for: \.serverTrust),
            subscriber(for: \.canGoBack),
            subscriber(for: \.canGoForward),
            subscriber(for: \.themeColor),
            subscriber(for: \.underPageBackgroundColor),
            subscriber(for: \.microphoneCaptureState),
            subscriber(for: \.cameraCaptureState),
        ]
        if #available(iOS 16.0, *) {
            observers.append(subscriber(for: \.fullscreenState))
        }
        // 6月リリースのテストマーケ版ではiOS16以上を対応するので一旦、iOS16未満は無視する
    }

    var title: String? {
        webView.title
    }

    var canGoBack: Bool {
        webView.canGoBack
    }

    var canGoForward: Bool {
        webView.canGoForward
    }

    func onAppear() {
        addUserScript()
        webView.load(URLRequest(url: url))
    }

    private func addUserScript() {
        webView.configuration.userContentController.add(self, name: "jsMessenger")
    }

    func onDisappear() {
        webView.configuration.userContentController
            .removeScriptMessageHandler(forName: "jsMessenger")
    }

    func goBack() {
        webView.goBack()
        trackPageView(url: webView.url)
    }

    func goForward() {
        webView.goForward()
        trackPageView(url: webView.url)
    }

    private func trackPageView(url: URL?) {
        guard let url else { return }
        delegate?.onTrackingEvent(PageView(datetime: Date(), url: url))
    }

    private func viewDidLayoutSubviews() {
        guard let navigationBarHeight,
              let frame,
              let documentSize
        else {
            return
        }
        let navigationBarFrame = CGRect(
            origin: frame.origin,
            size: CGSize(width: frame.size.width, height: navigationBarHeight)
        )
        let webViewFrame = CGRect(
            x: frame.origin.x,
            y: frame.origin.y + navigationBarHeight,
            width: frame.size.width,
            height: frame.size.height - navigationBarHeight
        )
        delegate?.viewDidLayoutSubviews(
            navigationBarFrame: navigationBarFrame,
            webViewFrame: webViewFrame,
            documentSize: documentSize
        )
    }

    private func handleEvent(_ dict: [String: Any]) {
        guard let event_type = dict["event_type"] as? String else {
            return
        }
        switch event_type {
        case "click":
            guard let x = dict["x"] as? Double,
                  let y = dict["y"] as? Double
            else {
                return
            }
            let targetOuterHTML = dict["targetOuterHTML"] as? String ?? nil
            var domRect: DOMRect? = nil
            if let rect = dict["targetBoundingClientRect"] as? [String: Double] {
                domRect = DOMRect.from(dict: rect)
            }
            delegate?.onTrackingEvent(
                Click(datetime: Date(), x: x, y: y, targetOuterHTML: targetOuterHTML, targetBoundingClientRect: domRect))
        case "scroll_begin", "scroll_end":
            guard let scrollLeft = dict["scrollLeft"] as? Double,
                  let scrollTop = dict["scrollTop"] as? Double
            else {
                return
            }
            let isBegin = event_type == "scroll_begin"
            let targetId = dict["targetId"] as? String
            let targetTagName = dict["targetTagName"] as? String
            var domRect: DOMRect? = nil
            if let rect = dict["targetBoundingClientRect"] as? [String: Double] {
                domRect = DOMRect.from(dict: rect)
            }
            let scroll = Scroll(
                type: isBegin ? .scrollBegin : .scrollEnd,
                datetime: Date(),
                scrollLeft: scrollLeft,
                scrollTop: scrollTop,
                targetId: targetId,
                targetTagName: targetTagName,
                targetBoundingClientRect: domRect
            )
            delegate?.onTrackingEvent(scroll)
        case "video_play":
            let event = VideoPlay(datetime: Date(), source: dict["source"] as? String)
            delegate?.onTrackingEvent(event)
        case "video_pause":
            let event = VideoPause(datetime: Date(), source: dict["source"] as? String)
            delegate?.onTrackingEvent(event)
        case "video_ended":
            let event = VideoEnded(datetime: Date(), source: dict["source"] as? String)
            delegate?.onTrackingEvent(event)
        default:
            break
        }
    }

    private func handleDocumentSize(_ dict: [String: Any]) {
        guard let width = dict["width"] as? Double,
              let height = dict["height"] as? Double
        else {
            return
        }
        documentSize = CGSize(width: width, height: height)
    }

    private func handleVisibleElements(_ dict: [String: Any]) {
        guard let elements = dict["elements"] as? [[String: Any]] else {
            return
        }
        let _elements: [VisibleElement] = elements.compactMap {
            guard let id = $0["id"] as? String,
                  let rect = $0["boundingClientRect"] as? [String: Double],
                  let domRect = DOMRect.from(dict: rect)
            else {
                return nil
            }
            return VisibleElement(
                id: id,
                boundingClientRect: domRect
            )
        }
        delegate?.visibleElementsDetected(VisibleElements(
            elements: _elements,
            datetime: Date()
        ))
    }

    private func handleWindowScrollPosition(_ dict: [String: Any]) {
        guard let scrollLeft = dict["scrollLeft"] as? Double,
              let scrollTop = dict["scrollTop"] as? Double
        else {
            return
        }
        delegate?.windowScrollPosition(WindowScrollPosition(
            scrollLeft: scrollLeft,
            scrollTop: scrollTop,
            datetime: Date()
        ))
    }
}

extension TrackingWebPresenter: WKNavigationDelegate {
    func webView(_ webView: WKWebView, didStartProvisionalNavigation _: WKNavigation!) {
        trackPageView(url: webView.url)
    }

    func webView(_: WKWebView, didFinish _: WKNavigation!) {
        if isReady {
            return
        }
        isReady = true
        delegate?.didFinishLoadingInitialURL()
    }
}

extension TrackingWebPresenter: WKUIDelegate {
    func webView(_ webView: WKWebView, createWebViewWith _: WKWebViewConfiguration, for navigationAction: WKNavigationAction, windowFeatures _: WKWindowFeatures) -&gt; WKWebView? {
        if navigationAction.targetFrame?.isMainFrame != true {
            webView.load(navigationAction.request)
        }
        return nil
    }
}

extension TrackingWebPresenter: WKScriptMessageHandler {
    func userContentController(_: WKUserContentController, didReceive message: WKScriptMessage) {
        guard let dict = message.body as? [String: Any],
              let type = dict["type"] as? String
        else {
            return
        }

        switch type {
        case "event":
            handleEvent(dict)
        case "document_size":
            handleDocumentSize(dict)
        case "visible_elements":
            handleVisibleElements(dict)
        case "window_scroll_position":
            handleWindowScrollPosition(dict)
        default:
            break
        }
    }
}
protocol TrackingWebViewDelegate: AnyObject {
    func viewDidLayoutSubviews(
        navigationBarFrame: CGRect,
        webViewFrame: CGRect,
        documentSize: CGSize
    )
    func didFinishLoadingInitialURL()
    func onTrackingEvent(_ event: TrackingWebEvent)
    func visibleElementsDetected(_ elements: VisibleElements)
    func windowScrollPosition(_ windowScrollPosition: WindowScrollPosition)
}

---

## 🤖 Assistant
*2023-06-14 02:51:34*

ありがとうございます。提供していただいたコードから、WebViewのイベントをトラッキングし、それらをデータとして保存するというシステムを理解しました。現在、イベントの詳細は`delegate`パターンを使って処理されているようですが、これをやめて直接`WebViewTrackerRootPresenter`内で管理したい、とのことですね。

以下に一例を提示します。ただし、Swiftの強力なタイプシステムや機能を最大限に活用するため、一部コードのリファクタリングが必要となります。

まず、`TrackingWebPresenter`から`TrackingWebViewDelegate`を削除し、イベントを直接`WebViewTrackerRootPresenter`に渡すようにします。そのためには、`TrackingWebPresenter`のイニシャライザで`WebViewTrackerRootPresenter`を渡すようにします。

```swift
final class TrackingWebPresenter: NSObject, ObservableObject {
    let url: URL
    weak var rootPresenter: WebViewTrackerRootPresenter?  // Update this line

    ...

    init(url: URL, rootPresenter: WebViewTrackerRootPresenter? = nil) {  // Update this line
        self.url = url
        self.rootPresenter = rootPresenter  // And this line
        super.init()

        ...
    }

    ...
}
```

次に、`TrackingWebPresenter`のメソッドを更新して、直接`rootPresenter`にイベントを送信します。例えば：

```swift
private func trackPageView(url: URL?) {
    guard let url else { return }
    rootPresenter?.onTrackingEvent(PageView(datetime: Date(), url: url))
}
```

`delegate`パターンを使用していた他の部分も同様に更新します。つまり、`delegate?`の代わりに`rootPresenter?`を使用します。

最後に、`WebViewTrackerRootPresenter`で`TrackingWebViewDelegate`の代わりに各イベントハンドラメソッドを直接実装します。

```swift
class WebViewTrackerRootPresenter: ObservableObject {
    ...

    // Update the following lines
    func viewDidLayoutSubviews(
        navigationBarFrame: CGRect,
        webViewFrame: CGRect,
        documentSize: CGSize
    ) {
        tracker.navigationBarFrame = navigationBarFrame
        tracker.webViewFrame = webViewFrame
        tracker.documentSize = documentSize
    }

    func onTrackingEvent(_ event: TrackingWebEvent) {
        tracker.events.append(event)
    }

    func visibleElementsDetected(_ elements: VisibleElements) {
        tracker.visibleElements.append(elements)
    }

    func windowScrollPosition(_ windowScrollPosition: WindowScrollPosition) {
        tracker.windowScrollPositions.append(windowScrollPosition)
    }

    ...
}
```

注意: この変更はイベントを直接的に、かつタイプセーフな方法で`WebViewTrackerRootPresenter`に渡すためのものです。しかし、その結果として`TrackingWebPresenter`が`WebViewTrackerRootPresenter`に依存する形になるため、これら2つのクラスが密結合になってしまいます

---

## 👤 User
*2023-06-14 02:54:18*

いっそのこと、WebViewTrackerRootPresenterで必要なパラメータだけをTrackingWebPresenterに引数で渡して、バラバラの変数をTrackingWebPresenterで更新して、最後にTrackingWebEventsを生成するのはどう？。TrackingWebEventsはべつにWebViewTrackerRootPresenter持つ必要がない気がする

---

## 🤖 Assistant
*2023-06-14 02:55:33*

提案されている方法も、十分有効です。これにより、`TrackingWebPresenter`と`WebViewTrackerRootPresenter`の間の結合を少なくすることができます。

このパターンを適用するためには、まず`WebViewTrackerRootPresenter`で`TrackingWebPresenter`を生成する際に必要な初期パラメータを渡します。そして、`TrackingWebPresenter`内で直接パラメータを更新し、最後に`TrackingWebEvents`を生成します。

```swift
final class TrackingWebPresenter: NSObject, ObservableObject {
    let url: URL
    var trackingWebEvents: TrackingWebEvents?  // Add this line

    ...

    init(url: URL, screenSize: CGSize, start: Date) {  // Update this line
        self.url = url
        self.trackingWebEvents = TrackingWebEvents(screenSize: screenSize, start: start)
        super.init()

        ...
    }

    ...

    func saveTrackingWebEvents() {
        if state == .error {
            return
        }
        trackingWebEvents?.end = Date()
        do {
            if let json = try trackingWebEvents?.asJson {
                try json.write(to: webEventsURL, atomically: true, encoding: .utf8)
                return
            }
        } catch {
            state = .error
        }
    }

    ...
}
```

`WebViewTrackerRootPresenter`の側では、`TrackingWebPresenter`を作成する際に必要なパラメータを渡すだけでよくなります。

```swift
class WebViewTrackerRootPresenter: ObservableObject {
    @Published var state = State.webBrowsing
    private let webEventsURL = FileManager.default.directoryURL(directory: .document)
        .appendingPathComponent("web_events.json")

    enum State {
        case webBrowsing
        case error
    }

    var trackingWebPresenter: TrackingWebPresenter?  // Add this line

    init() {
        trackingWebPresenter = TrackingWebPresenter(
            url: yourUrl,
            screenSize: UIScreen.main.bounds.size,
            start: Date()
        )  // Update this line
    }

    ...
}
```

このようにすることで、各イベントの処理と`TrackingWebEvents`の生成・保存が`TrackingWebPresenter`内に閉じ込められ、より疎結合な設計が可能になります。ただし、この変更により、`WebViewTrackerRootPresenter`は`TrackingWebPresenter`のイベントに直接反応できなくなるため、両者の間で状態を同期する必要がある場合には追加の方法を検討する必要があります。

---

## 👤 User
*2023-06-14 02:56:54*

その方向性でTrackingWebEventsの生成に必要なeventsやnavigationBarFrameやwindowScrollPositionsを追加していく処理をTrackingWebPresenterにかいてほしい。

struct TrackingWebEvents: Encodable {
    var start: Date?
    var end: Date?
    var screenSize: CGSize?
    var navigationBarFrame: CGRect?
    var webViewFrame: CGRect?
    var documentSize: CGSize?
    var events = [TrackingWebEvent]()
    var visibleElements = [VisibleElements]()
    var windowScrollPositions = [WindowScrollPosition]()
}

---

## 🤖 Assistant
*2023-06-14 02:58:03*

承知しました。`TrackingWebPresenter`で各パラメータを更新し、`TrackingWebEvents`を生成する方法は以下の通りです。

まず、`TrackingWebPresenter`に`TrackingWebEvents`を保持するプロパティを追加します。

```swift
final class TrackingWebPresenter: NSObject, ObservableObject {
    ...
    private var tracker = TrackingWebEvents(
        start: Date(),
        screenSize: UIScreen.main.bounds.size
    )
    ...
}
```

次に、`TrackingWebViewDelegate`メソッドを実装します。これらのメソッドは、各種ウェブイベントの情報を収集し、`TrackingWebEvents`オブジェクトの対応するフィールドを更新します。

```swift
extension TrackingWebPresenter: TrackingWebViewDelegate {
    func viewDidLayoutSubviews(
        navigationBarFrame: CGRect,
        webViewFrame: CGRect,
        documentSize: CGSize
    ) {
        tracker.navigationBarFrame = navigationBarFrame
        tracker.webViewFrame = webViewFrame
        tracker.documentSize = documentSize
    }

    func didFinishLoadingInitialURL() {}

    func onTrackingEvent(_ event: TrackingWebEvent) {
        tracker.events.append(event)
    }

    func visibleElementsDetected(_ elements: VisibleElements) {
        tracker.visibleElements.append(elements)
    }

    func windowScrollPosition(_ windowScrollPosition: WindowScrollPosition) {
        tracker.windowScrollPositions.append(windowScrollPosition)
    }
}
```

最後に、`saveTrackingWebEvents`メソッドを`TrackingWebPresenter`に追加します。このメソッドは、`TrackingWebEvents`の終了日時を設定し、イベントの追跡データをJSON形式で保存します。

```swift
final class TrackingWebPresenter: NSObject, ObservableObject {
    ...
    private let webEventsURL = FileManager.default.directoryURL(directory: .document)
        .appendingPathComponent("web_events.json")

    ...

    func saveTrackingWebEvents() {
        tracker.end = Date()
        do {
            if let json = try tracker.asJson {
                try json.write(to: webEventsURL, atomically: true, encoding: .utf8)
                return
            }
        } catch {
            state = .error
        }
    }
    ...
}
```

これにより、`TrackingWebEvents`の生成と保存が`TrackingWebPresenter`に完全に閉じ込められ、より疎結合な設計が可能になります。

---

## 👤 User
*2023-06-14 02:59:18*

ちょっとまって、TrackingWebViewDelegateはつかわなくてもできるんじゃないの？直接TrackingWebPresenterで実行しているところで更新すればいいじゃん

---

## 🤖 Assistant
*2023-06-14 03:00:22*

おっしゃる通り、`TrackingWebPresenter`で直接必要な情報を収集し、`TrackingWebEvents`オブジェクトを更新することは可能です。これにより、デリゲートパターンを使う必要がなくなり、コードがさらにシンプルになります。

以下にその方法を示します：

```swift
final class TrackingWebPresenter: NSObject, ObservableObject {
    ...
    private var tracker = TrackingWebEvents(
        start: Date(),
        screenSize: UIScreen.main.bounds.size
    )
    ...

    private func viewDidLayoutSubviews() {
        guard let navigationBarHeight,
              let frame,
              let documentSize = self.documentSize
        else {
            return
        }
        let navigationBarFrame = CGRect(
            origin: frame.origin,
            size: CGSize(width: frame.size.width, height: navigationBarHeight)
        )
        let webViewFrame = CGRect(
            x: frame.origin.x,
            y: frame.origin.y + navigationBarHeight,
            width: frame.size.width,
            height: frame.size.height - navigationBarHeight
        )
        tracker.navigationBarFrame = navigationBarFrame
        tracker.webViewFrame = webViewFrame
        tracker.documentSize = documentSize
    }

    private func handleEvent(_ dict: [String: Any]) {
        ...
        switch event_type {
        ...
        case "click":
            ...
            tracker.events.append(Click(datetime: Date(), x: x, y: y, targetOuterHTML: targetOuterHTML, targetBoundingClientRect: domRect))
        case "scroll_begin", "scroll_end":
            ...
            tracker.events.append(scroll)
        case "video_play":
            ...
            tracker.events.append(event)
        case "video_pause":
            ...
            tracker.events.append(event)
        case "video_ended":
            ...
            tracker.events.append(event)
        default:
            break
        }
    }

    private func handleVisibleElements(_ dict: [String: Any]) {
        ...
        tracker.visibleElements.append(VisibleElements(elements: _elements, datetime: Date()))
    }

    private func handleWindowScrollPosition(_ dict: [String: Any]) {
        ...
        tracker.windowScrollPositions.append(WindowScrollPosition(scrollLeft: scrollLeft, scrollTop: scrollTop, datetime: Date()))
    }

    ...
}
```

以上のように、`handleEvent`、`handleVisibleElements`、`handleWindowScrollPosition`メソッドでイベントがトリガされた時に直接`tracker`を更新します。同様に、`viewDidLayoutSubviews`メソッドでも`tracker`を直接更新します。これで`TrackingWebViewDelegate`を使う必要がなくなりました。

---

## 👤 User
*2023-06-14 03:02:36*

実はイベントは以下のような定義になっていて、protocolの型にまとめるのは最後のsave処理が呼ばれるらしいのでその時の処理でまとめればよくて、それぞれのeventの型を別々の変数でTrackingWebPresenter側に宣言して、そこに追加していくようにしてほしいけどできるかな？

protocol TrackingWebEvent: Encodable {
    var type: TrackingWebEventType { get }
    var datetime: Date { get }
}

typealias EncodableTrackingWebEvent = TrackingWebEvent & Encodable

enum TrackingWebEventType: String {
    case pageView = "page_view"
    case click
    case scrollBegin = "scroll_begin"
    case scrollEnd = "scroll_end"
    case videoPlay = "video_play"
    case videoPause = "video_pause"
    case videoEnded = "video_ended"
}

struct PageView: EncodableTrackingWebEvent {
    var type: TrackingWebEventType { .pageView }
    var datetime: Date
    var url: URL

    enum CodingKeys: String, CodingKey {
        case type
        case datetime
        case url
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(type.rawValue, forKey: .type)
        try container.encode(
            datetime.asISO8601WithFractionalSeconds,
            forKey: .datetime
        )
        try container.encode(url.absoluteString, forKey: .url)
    }
}

struct Click: EncodableTrackingWebEvent {
    var type: TrackingWebEventType { .click }
    var datetime: Date
    var x: Double
    var y: Double
    var targetOuterHTML: String?
    var targetBoundingClientRect: DOMRect?

    enum CodingKeys: String, CodingKey {
        case type
        case datetime
        case x
        case y
        case targetOuterHTML
        case targetBoundingClientRect
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(type.rawValue, forKey: .type)
        try container.encode(
            datetime.asISO8601WithFractionalSeconds,
            forKey: .datetime
        )
        try container.encode(x, forKey: .x)
        try container.encode(y, forKey: .y)
        try container.encode(targetOuterHTML, forKey: .targetOuterHTML)
        try container.encode(targetBoundingClientRect, forKey: .targetBoundingClientRect)
    }
}

struct Scroll: EncodableTrackingWebEvent {
    var type: TrackingWebEventType
    var datetime: Date
    var scrollLeft: Double
    var scrollTop: Double
    var targetId: String?
    var targetTagName: String?
    var targetBoundingClientRect: DOMRect?

    enum CodingKeys: String, CodingKey {
        case type
        case datetime
        case scrollLeft
        case scrollTop
        case targetId
        case targetTagName
        case targetBoundingClientRect
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(type.rawValue, forKey: .type)
        try container.encode(datetime.asISO8601WithFractionalSeconds, forKey: .datetime)
        try container.encode(scrollLeft, forKey: .scrollLeft)
        try container.encode(scrollTop, forKey: .scrollTop)
        try container.encode(targetId, forKey: .targetId)
        try container.encode(targetTagName, forKey: .targetTagName)
        try container.encode(targetBoundingClientRect, forKey: .targetBoundingClientRect)
    }
}

struct VideoPlay: EncodableTrackingWebEvent {
    var type: TrackingWebEventType { .videoPlay }
    var datetime: Date
    var source: String?

    enum CodingKeys: String, CodingKey {
        case type
        case datetime
        case source
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(type.rawValue, forKey: .type)
        try container.encode(
            datetime.asISO8601WithFractionalSeconds,
            forKey: .datetime
        )
        try container.encode(source, forKey: .source)
    }
}

struct VideoPause: EncodableTrackingWebEvent {
    var type: TrackingWebEventType { .videoPause }
    var datetime: Date
    var source: String?

    enum CodingKeys: String, CodingKey {
        case type
        case datetime
        case source
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(type.rawValue, forKey: .type)
        try container.encode(
            datetime.asISO8601WithFractionalSeconds,
            forKey: .datetime
        )
        try container.encode(source, forKey: .source)
    }
}

struct VideoEnded: EncodableTrackingWebEvent {
    var type: TrackingWebEventType { .videoEnded }
    var datetime: Date
    var source: String?

    enum CodingKeys: String, CodingKey {
        case type
        case datetime
        case source
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(type.rawValue, forKey: .type)
        try container.encode(
            datetime.asISO8601WithFractionalSeconds,
            forKey: .datetime
        )
        try container.encode(source, forKey: .source)
    }
}

---

## 🤖 Assistant
*2023-06-14 03:03:56*

はい、それは可能です。具体的には、各イベントの型ごとに、それを格納するための配列を`TrackingWebPresenter`に追加します。その後、それぞれの`handle...`メソッドが呼び出された時に、対応する配列にイベントを追加します。そして、最後にすべての配列を`save`メソッドで結合し、それらを`TrackingWebEvents`の`events`フィールドに追加します。

ここにそのような設計の一例を示します：

```swift
final class TrackingWebPresenter: NSObject, ObservableObject {
    ...
    private var tracker = TrackingWebEvents(
        start: Date(),
        screenSize: UIScreen.main.bounds.size
    )
    private var pageViewEvents = [PageView]()
    private var clickEvents = [Click]()
    private var scrollEvents = [Scroll]()
    private var videoPlayEvents = [VideoPlay]()
    private var videoPauseEvents = [VideoPause]()
    private var videoEndedEvents = [VideoEnded]()
    ...

    private func handleEvent(_ dict: [String: Any]) {
        ...
        switch event_type {
        ...
        case "page_view":
            ...
            pageViewEvents.append(PageView(datetime: Date(), url: url))
        case "click":
            ...
            clickEvents.append(Click(datetime: Date(), x: x, y: y, targetOuterHTML: targetOuterHTML, targetBoundingClientRect: domRect))
        case "scroll_begin":
            ...
            scrollEvents.append(Scroll(type: .scrollBegin, datetime: Date(), scrollLeft: scrollLeft, scrollTop: scrollTop, targetId: targetId, targetTagName: targetTagName, targetBoundingClientRect: domRect))
        case "scroll_end":
            ...
            scrollEvents.append(Scroll(type: .scrollEnd, datetime: Date(), scrollLeft: scrollLeft, scrollTop: scrollTop, targetId: targetId, targetTagName: targetTagName, targetBoundingClientRect: domRect))
        case "video_play":
            ...
            videoPlayEvents.append(VideoPlay(datetime: Date(), source: source))
        case "video_pause":
            ...
            videoPauseEvents.append(VideoPause(datetime: Date(), source: source))
        case "video_ended":
            ...
            videoEndedEvents.append(VideoEnded(datetime: Date(), source: source))
        default:
            break
        }
    }
    
    private func save() {
        ...
        tracker.events = pageViewEvents + clickEvents + scrollEvents + videoPlayEvents + videoPauseEvents + videoEndedEvents
        ...
    }

    ...
}
```

以上のように、`handleEvent`メソッドで各種イベントがトリガされた時に、対応する配列にイベントを追加します。そして、`save`メソッドですべての配列を結合し、それらを`TrackingWebEvents`の`events`フィールドに追加します。

---

## 👤 User
*2023-06-14 03:04:18*

全体的にこの修正についてどう思う？

---

## 🤖 Assistant
*2023-06-14 03:05:13*

全体的に見ると、この修正はアプリケーションの可読性とメンテナンス性を向上させると思います。それぞれのイベントタイプが異なる配列で管理されているため、どのイベントがどこで追加されるのかが一目瞭然となります。そして、それぞれの配列が特定のイベントタイプのインスタンスのみを含むため、型安全性も向上します。

また、`TrackingWebPresenter`が直接イベントの生成と追加を担当することで、コードの抽象度が下がり、各部分がどのように動作するのかがより明確になります。これにより、新しい開発者がコードを理解するのが容易になり、また既存の開発者がバグを見つけて修正するのもより簡単になるでしょう。

ただし、この設計では`TrackingWebPresenter`が多くの責任を担っています。各種イベントの生成、管理、最終的な結合という、様々な役割を持っています。一部の開発者は、これらの責任を分割することを推奨するかもしれません。例えば、各イベントタイプの配列の管理を別のクラスや構造体に委任することが考えられます。しかし、そのようなリファクタリングが必要になるかどうかは、アプリケーションの全体的な設計と、それがどの程度複雑であるかによります。

それを考慮に入れれば、提案された変更は全体的に良いと思います。もちろん、実装を始める前に設計をよく考え、可能なリファクタリングを考慮に入れることが重要です。

---

## 👤 User
*2023-06-14 03:19:50*

最終的に以下のSwiftProtoBufで作られるイベントに集約されるのだけれども、どの値をどうマッピングすればいいかおしえてほしい。

syntax = "proto3";

import "google/protobuf/timestamp.proto";

message Interaction {
  google.protobuf.Timestamp timestamp = 0;
  oneof event {
    PageViewEvent page_view = 1;
    ClickEvent click = 2;
    ScrollEvent scroll = 3;
  }
}

message PageViewEvent {
  string url = 0;
}

message ClickEvent {
  string target = 0;
  double left = 1;
  double top = 2;
}

message ScrollEvent {
  string target = 0;
  double left = 1;
  double top = 2;
}

---

## 🤖 Assistant
*2023-06-14 03:20:35*

Swiftの構造体とProtobufのメッセージを対応させると次のようになります。

**PageView**:
Swiftの`PageView`の中にある`url`は、`PageViewEvent`の`url`としてマッピングされます。

**Click**:
Swiftの`Click`の中にある`x`は、`ClickEvent`の`left`としてマッピングされます。同様に、`y`は`top`としてマッピングされます。`targetOuterHTML`は、`ClickEvent`の`target`としてマッピングされます。

**Scroll**:
Swiftの`Scroll`の中にある`scrollLeft`は、`ScrollEvent`の`left`としてマッピングされます。同様に、`scrollTop`は`top`としてマッピングされます。`targetId`または`targetTagName`（どちらが適切な情報を提供するかによる）は、`ScrollEvent`の`target`としてマッピングされます。

そして、それぞれのSwiftのイベント構造体の`datetime`は、Protobufの`Interaction`の`timestamp`としてマッピングされます。

このマッピングが適用されるコードを作成する際には、それぞれのSwiftのイベント構造体からProtobufのメッセージへの変換関数を作成し、それを適切なタイミングで呼び出すと良いでしょう。これにより、アプリケーションの他の部分から見たときにこの変換プロセスは透明になります。

---

## 👤 User
*2023-06-14 03:20:38*

コンバーターをつくってみてほしい。

---

## 🤖 Assistant
*2023-06-14 03:21:45*

はい、それぞれのSwiftのイベント構造体からProtobufのメッセージへの変換関数を作成します。まずは、`Google.Protobuf.Timestamp`への変換のための便利な関数を定義します：

```swift
import Foundation
import Google_Protobuf

extension Date {
    func toProtoTimestamp() -> Google_Protobuf_Timestamp {
        let timeInterval = self.timeIntervalSince1970
        let seconds = Int64(timeInterval)
        let nanos = Int32((timeInterval - Double(seconds)) * 1_000_000_000)
        return Google_Protobuf_Timestamp(seconds: seconds, nanos: nanos)
    }
}
```

次に、それぞれのイベントに対応するコンバーター関数を作成します：

```swift
extension PageView {
    func toProtoEvent() -> Interaction {
        var interaction = Interaction()
        interaction.timestamp = datetime.toProtoTimestamp()

        var pageViewEvent = PageViewEvent()
        pageViewEvent.url = url.absoluteString

        interaction.event = .pageView(pageViewEvent)
        return interaction
    }
}

extension Click {
    func toProtoEvent() -> Interaction {
        var interaction = Interaction()
        interaction.timestamp = datetime.toProtoTimestamp()

        var clickEvent = ClickEvent()
        clickEvent.target = targetOuterHTML ?? ""
        clickEvent.left = x
        clickEvent.top = y

        interaction.event = .click(clickEvent)
        return interaction
    }
}

extension Scroll {
    func toProtoEvent() -> Interaction {
        var interaction = Interaction()
        interaction.timestamp = datetime.toProtoTimestamp()

        var scrollEvent = ScrollEvent()
        scrollEvent.target = targetId ?? targetTagName ?? ""
        scrollEvent.left = scrollLeft
        scrollEvent.top = scrollTop

        interaction.event = .scroll(scrollEvent)
        return interaction
    }
}
```

これで、それぞれのイベントが適切なProtobufメッセージに変換できます。これらの関数を使ってイベントリストをProtobufメッセージのリストに変換するためのロジックを実装することが可能です。ただし、この変換処理は `VideoPlay`, `VideoPause`, `VideoEnded` イベントについては考慮していません。これらのイベントについても変換が必要な場合は、それぞれに対応するコンバーター関数を同様に作成してください。

---

## 👤 User
*2023-06-14 03:25:33*

saveの処理で、それぞれコンバーターに渡して、全部を合わせた最終的なInteractionの配列生成する処理をかいてほしい。

---

## 🤖 Assistant
*2023-06-14 03:26:21*

最後にすべてを統合するためのコンバーター関数を以下のように定義します。

まず、それぞれのイベント型の配列を保持する`TrackingWebPresenter`を更新します：

```swift
class TrackingWebPresenter {
    ...
    var pageViewEvents = [PageView]()
    var clickEvents = [Click]()
    var scrollEvents = [Scroll]()
    ...
}
```

その後、それぞれのイベントの配列を`Interaction`の配列に変換する`save`関数を定義します：

```swift
extension TrackingWebPresenter {
    func save() -> [Interaction] {
        let pageViewInteractions = pageViewEvents.map { $0.toProtoEvent() }
        let clickInteractions = clickEvents.map { $0.toProtoEvent() }
        let scrollInteractions = scrollEvents.map { $0.toProtoEvent() }
        
        return pageViewInteractions + clickInteractions + scrollInteractions
    }
}
```

これにより、保存の処理を呼び出すと、全てのイベントがProtobuf形式に変換され、一つの配列に集められます。これが`TrackingWebPresenter`の全てのイベントを追跡し、それを最終的な形式に変換するための処理です。

なお、他のイベントタイプ（`VideoPlay`など）も同様に扱うことが可能です。それぞれについて適切なコンバーター関数を定義し、上記の`save`関数にその変換結果を追加してください。

---
