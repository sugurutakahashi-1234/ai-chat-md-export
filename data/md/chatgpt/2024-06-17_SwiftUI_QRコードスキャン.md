# SwiftUI QRコードスキャン

Date: 2024-06-17

---

## 👤 User
*2024-06-18 05:45:14*

swiftUIでQRコードをスキャンしたい なるべく最新のiOSでも使えるやつでやりたい

---

## 🤖 Assistant
*2024-06-18 05:45:31*

SwiftUIでQRコードをスキャンするには、`AVFoundation`を使ってカメラを制御し、QRコードの検出を行うことができます。iOS 16以降では、さらにシンプルに実装できる`DataScannerViewController`が使えます。以下に、iOS 16以降で利用可能な方法を示します。

### 1. DataScannerViewControllerの使用

iOS 16から導入された`DataScannerViewController`を使用することで、QRコードのスキャンを簡単に行えます。以下はその基本的な実装例です。

```swift
import SwiftUI
import VisionKit

struct QRScannerView: UIViewControllerRepresentable {
    class Coordinator: NSObject, DataScannerViewControllerDelegate {
        var parent: QRScannerView

        init(parent: QRScannerView) {
            self.parent = parent
        }

        func dataScanner(_ dataScanner: DataScannerViewController, didTapOn item: RecognizedItem) {
            switch item {
            case .text(let text):
                // Handle recognized text
                print("Recognized text: \(text.transcript)")
            case .barcode(let barcode):
                if let payload = barcode.payloadStringValue {
                    // Handle recognized QR code
                    print("Recognized QR code: \(payload)")
                    parent.didFindCode(payload)
                }
            default:
                break
            }
        }
    }

    @Binding var scannedCode: String?

    func makeCoordinator() -> Coordinator {
        return Coordinator(parent: self)
    }

    func makeUIViewController(context: Context) -> DataScannerViewController {
        let scanner = DataScannerViewController(recognizedDataTypes: [.barcode], qualityLevel: .accurate)
        scanner.delegate = context.coordinator
        return scanner
    }

    func updateUIViewController(_ uiViewController: DataScannerViewController, context: Context) {
        // Start scanning when the view appears
        try? uiViewController.startScanning()
    }

    func didFindCode(_ code: String) {
        scannedCode = code
    }
}

struct ContentView: View {
    @State private var scannedCode: String?

    var body: some View {
        VStack {
            if let code = scannedCode {
                Text("Scanned Code: \(code)")
            } else {
                QRScannerView(scannedCode: $scannedCode)
                    .edgesIgnoringSafeArea(.all)
            }
        }
    }
}
```

### ポイント
1. **UIViewControllerRepresentable**: SwiftUIからUIKitの`DataScannerViewController`を利用するためのブリッジ。
2. **Coordinator**: デリゲートメソッドを利用してQRコードのスキャン結果を受け取るためのコーディネータ。
3. **scannedCode**: スキャンされたQRコードの値を保持するためのバインディング。

### 2. iOS 15以前の対応
もしiOS 15以前のバージョンに対応する必要がある場合は、`AVCaptureSession`を使用したカスタムスキャンビューを作成する必要があります。その場合、少し複雑になりますが、必要に応じてサンプルコードを提供します。

これにより、最新のiOSで簡単にQRコードをスキャンできるようになります。

---

## 👤 User
*2024-06-18 05:47:23*

1番の方法でやりたい。MVPで実装したい。ビジネスロジックをViewから取り出したい。例えばQRを読み取って、特定のパターンのURLが出るまでスキャンし続けたい。

---

## 🤖 Assistant
*2024-06-18 05:47:40*

User wants to implement QR code scanning in SwiftUI using DataScannerViewController with MVP pattern, where the business logic is separated from the view, such as continuously scanning until a specific pattern of URL is detected.

---

## 🔧 Tool
*2024-06-18 05:47:40*

Model set context updated.

---

## 🤖 Assistant
*2024-06-18 05:47:40*

MVPパターンを使用して、SwiftUIでQRコードスキャンを実装する方法を示します。この例では、QRコードを読み取り、特定のパターンのURLが出るまでスキャンし続けます。

### 1. Model
モデルは特定のパターンを持つURLを検証するためのロジックを含みます。

```swift
struct QRScannerModel {
    func isValidURL(_ url: String) -> Bool {
        // ここで特定のパターンのURLを検証します
        // 例: "https://example.com" が含まれるURL
        return url.contains("https://example.com")
    }
}
```

### 2. Presenter
プレゼンターはモデルを使用して、ビジネスロジックを処理し、ビューに通知します。

```swift
class QRScannerPresenter: ObservableObject {
    @Published var scannedCode: String?
    private let model = QRScannerModel()

    func processScannedCode(_ code: String) {
        if model.isValidURL(code) {
            scannedCode = code
        }
    }
}
```

### 3. View
ビューはプレゼンターを使用して、スキャンされたコードを表示します。

```swift
import SwiftUI
import VisionKit

struct QRScannerView: UIViewControllerRepresentable {
    @ObservedObject var presenter: QRScannerPresenter

    class Coordinator: NSObject, DataScannerViewControllerDelegate {
        var parent: QRScannerView

        init(parent: QRScannerView) {
            self.parent = parent
        }

        func dataScanner(_ dataScanner: DataScannerViewController, didTapOn item: RecognizedItem) {
            switch item {
            case .barcode(let barcode):
                if let payload = barcode.payloadStringValue {
                    // Presenterにスキャンされたコードを処理させる
                    parent.presenter.processScannedCode(payload)
                }
            default:
                break
            }
        }
    }

    func makeCoordinator() -> Coordinator {
        return Coordinator(parent: self)
    }

    func makeUIViewController(context: Context) -> DataScannerViewController {
        let scanner = DataScannerViewController(recognizedDataTypes: [.barcode], qualityLevel: .accurate)
        scanner.delegate = context.coordinator
        return scanner
    }

    func updateUIViewController(_ uiViewController: DataScannerViewController, context: Context) {
        // スキャンを開始
        try? uiViewController.startScanning()
    }
}

struct ContentView: View {
    @StateObject private var presenter = QRScannerPresenter()

    var body: some View {
        VStack {
            if let code = presenter.scannedCode {
                Text("Scanned Code: \(code)")
            } else {
                QRScannerView(presenter: presenter)
                    .edgesIgnoringSafeArea(.all)
            }
        }
    }
}
```

### ポイント
1. **モデル**: URLのパターンを検証するロジックを含む。
2. **プレゼンター**: モデルを使用してスキャンされたコードを処理し、ビューに通知。
3. **ビュー**: `UIViewControllerRepresentable`を使用して`DataScannerViewController`をSwiftUIで使用し、プレゼンターを介してデータを表示。

これにより、QRコードを特定のパターンのURLが見つかるまでスキャンし続けるSwiftUIアプリをMVPパターンで実装できます。

---

## 👤 User
*2024-06-18 05:49:55*

タップではなくて、読み込んだQRを自動判定したい。今読み込んでるQRが特定のURLを含むパターンかそうでないパターンでViewを変えたい

---

## 🤖 Assistant
*2024-06-18 05:50:15*

QRコードを自動で判定し、特定のパターンのURLが含まれるかどうかでビューを変更する実装をMVPパターンで行います。以下にその実装方法を示します。

### 1. Model
モデルは特定のパターンを持つURLを検証するためのロジックを含みます。

```swift
struct QRScannerModel {
    func isValidURL(_ url: String) -> Bool {
        // ここで特定のパターンのURLを検証します
        // 例: "https://example.com" が含まれるURL
        return url.contains("https://example.com")
    }
}
```

### 2. Presenter
プレゼンターはモデルを使用して、ビジネスロジックを処理し、ビューに通知します。

```swift
class QRScannerPresenter: ObservableObject {
    @Published var scannedCode: String?
    @Published var isValid: Bool = false
    private let model = QRScannerModel()

    func processScannedCode(_ code: String) {
        scannedCode = code
        isValid = model.isValidURL(code)
    }
}
```

### 3. View
ビューはプレゼンターを使用して、スキャンされたコードを表示し、特定のパターンに応じてビューを変更します。

```swift
import SwiftUI
import VisionKit

struct QRScannerView: UIViewControllerRepresentable {
    @ObservedObject var presenter: QRScannerPresenter

    class Coordinator: NSObject, DataScannerViewControllerDelegate {
        var parent: QRScannerView

        init(parent: QRScannerView) {
            self.parent = parent
        }

        func dataScanner(_ dataScanner: DataScannerViewController, didRecognize items: [RecognizedItem]) {
            for item in items {
                switch item {
                case .barcode(let barcode):
                    if let payload = barcode.payloadStringValue {
                        // Presenterにスキャンされたコードを処理させる
                        parent.presenter.processScannedCode(payload)
                    }
                default:
                    break
                }
            }
        }
    }

    func makeCoordinator() -> Coordinator {
        return Coordinator(parent: self)
    }

    func makeUIViewController(context: Context) -> DataScannerViewController {
        let scanner = DataScannerViewController(recognizedDataTypes: [.barcode], qualityLevel: .accurate)
        scanner.delegate = context.coordinator
        return scanner
    }

    func updateUIViewController(_ uiViewController: DataScannerViewController, context: Context) {
        // スキャンを開始
        try? uiViewController.startScanning()
    }
}

struct ContentView: View {
    @StateObject private var presenter = QRScannerPresenter()

    var body: some View {
        VStack {
            if presenter.isValid {
                Text("Valid URL: \(presenter.scannedCode ?? "")")
            } else {
                QRScannerView(presenter: presenter)
                    .edgesIgnoringSafeArea(.all)
                if let code = presenter.scannedCode {
                    Text("Scanned Code: \(code)")
                }
            }
        }
    }
}
```

### ポイント
1. **モデル**: URLのパターンを検証するロジックを含む。
2. **プレゼンター**: モデルを使用してスキャンされたコードを処理し、結果をビューに通知。
3. **ビュー**: `UIViewControllerRepresentable`を使用して`DataScannerViewController`をSwiftUIで使用し、プレゼンターを介してデータを表示および更新。

これにより、QRコードを自動で判定し、特定のパターンのURLが含まれるかどうかでビューを変更するSwiftUIアプリをMVPパターンで実装できます。

---

## 👤 User
*2024-06-18 05:53:14*

StateObjectかobserved objectのどっちがいいんだっけ？

---

## 🤖 Assistant
*2024-06-18 05:53:30*

`@StateObject`と`@ObservedObject`の使い分けについては、以下のように考えると良いです。

- `@StateObject`: ビューが所有するオブジェクトに使用します。ビューが作成するオブジェクトで、そのライフサイクルを管理する場合に使います。これは、ビューが最初に作成されるときにインスタンス化され、その後ビューが再描画されても同じインスタンスが使われ続けます。

- `@ObservedObject`: 外部から渡されるオブジェクトに使用します。ビューが他のオブジェクトから渡されるオブジェクトを観察する場合に使います。ビュー自身がそのライフサイクルを管理しないオブジェクトに適しています。

今回のケースでは、`QRScannerPresenter`はビュー自身が所有するオブジェクトであり、そのライフサイクルを管理するために`@StateObject`を使用するのが適切です。

### 修正後のコード

```swift
import SwiftUI
import VisionKit

struct QRScannerView: UIViewControllerRepresentable {
    @ObservedObject var presenter: QRScannerPresenter

    class Coordinator: NSObject, DataScannerViewControllerDelegate {
        var parent: QRScannerView

        init(parent: QRScannerView) {
            self.parent = parent
        }

        func dataScanner(_ dataScanner: DataScannerViewController, didRecognize items: [RecognizedItem]) {
            for item in items {
                switch item {
                case .barcode(let barcode):
                    if let payload = barcode.payloadStringValue {
                        // Presenterにスキャンされたコードを処理させる
                        parent.presenter.processScannedCode(payload)
                    }
                default:
                    break
                }
            }
        }
    }

    func makeCoordinator() -> Coordinator {
        return Coordinator(parent: self)
    }

    func makeUIViewController(context: Context) -> DataScannerViewController {
        let scanner = DataScannerViewController(recognizedDataTypes: [.barcode], qualityLevel: .accurate)
        scanner.delegate = context.coordinator
        return scanner
    }

    func updateUIViewController(_ uiViewController: DataScannerViewController, context: Context) {
        // スキャンを開始
        try? uiViewController.startScanning()
    }
}

struct ContentView: View {
    @StateObject private var presenter = QRScannerPresenter()

    var body: some View {
        VStack {
            if presenter.isValid {
                Text("Valid URL: \(presenter.scannedCode ?? "")")
            } else {
                QRScannerView(presenter: presenter)
                    .edgesIgnoringSafeArea(.all)
                if let code = presenter.scannedCode {
                    Text("Scanned Code: \(code)")
                }
            }
        }
    }
}
```

### まとめ
- ビューが所有し、ライフサイクルを管理するオブジェクトには`@StateObject`を使用します。
- 外部から渡されるオブジェクトには`@ObservedObject`を使用します。

このようにして、`@StateObject`と`@ObservedObject`を適切に使い分けることで、ビューとデータの一貫性を保ちます。

---

## 👤 User
*2024-06-18 06:04:37*

ちなみにdidAdd addedItems: と didRecognize items: のどちらがいいと思う？

---

## 🤖 Assistant
*2024-06-18 06:05:01*

`DataScannerViewController`のデリゲートメソッドには、`didAdd`と`didRecognize`の2つがあります。用途に応じてどちらを選ぶかが決まりますが、以下のように使い分けると良いです。

1. **`didAdd addedItems:`**:
   - これは、新しい項目がスキャンされたときに呼び出されます。スキャンされた項目がリストに追加された瞬間を捉えるのに適しています。
   - スキャン結果の処理をリアルタイムで行いたい場合に適しています。

2. **`didRecognize items:`**:
   - これは、スキャンされたすべての項目が認識されたときに呼び出されます。複数のスキャン結果を一度に処理する場合に適しています。
   - スキャン結果の一括処理や後処理に適しています。

今回は、QRコードの読み取りと特定のパターンのURLを含むかどうかをリアルタイムで判断するため、`didAdd addedItems:`の方が適していると思います。

### `didAdd addedItems:`を使用した実装例

```swift
import SwiftUI
import VisionKit

struct QRScannerView: UIViewControllerRepresentable {
    @ObservedObject var presenter: QRScannerPresenter

    class Coordinator: NSObject, DataScannerViewControllerDelegate {
        var parent: QRScannerView

        init(parent: QRScannerView) {
            self.parent = parent
        }

        func dataScanner(_ dataScanner: DataScannerViewController, didAdd addedItems: [RecognizedItem]) {
            for item in addedItems {
                switch item {
                case .barcode(let barcode):
                    if let payload = barcode.payloadStringValue {
                        // Presenterにスキャンされたコードを処理させる
                        parent.presenter.processScannedCode(payload)
                    }
                default:
                    break
                }
            }
        }
    }

    func makeCoordinator() -> Coordinator {
        return Coordinator(parent: self)
    }

    func makeUIViewController(context: Context) -> DataScannerViewController {
        let scanner = DataScannerViewController(recognizedDataTypes: [.barcode], qualityLevel: .accurate)
        scanner.delegate = context.coordinator
        return scanner
    }

    func updateUIViewController(_ uiViewController: DataScannerViewController, context: Context) {
        // スキャンを開始
        try? uiViewController.startScanning()
    }
}

struct ContentView: View {
    @StateObject private var presenter = QRScannerPresenter()

    var body: some View {
        VStack {
            if presenter.isValid {
                Text("Valid URL: \(presenter.scannedCode ?? "")")
            } else {
                QRScannerView(presenter: presenter)
                    .edgesIgnoringSafeArea(.all)
                if let code = presenter.scannedCode {
                    Text("Scanned Code: \(code)")
                }
            }
        }
    }
}
```

### まとめ
- `didAdd addedItems:`は、新しい項目が追加されたときにリアルタイムで処理したい場合に適しています。
- `didRecognize items:`は、すべてのスキャン結果を一括して処理したい場合に適しています。

この実装では、`didAdd addedItems:`を使用して、QRコードのスキャン結果をリアルタイムで処理しています。

---

## 👤 User
*2024-06-18 06:28:42*

修正して以下のようになった。Presenter を修正して、https://www.google.com/ が先頭に含まれる場合は外部WebViewを開いて遷移してほしい。

struct QRCodeScanView: UIViewControllerRepresentable {
    @Binding var scannedCode: String

    class Coordinator: NSObject, DataScannerViewControllerDelegate {
        var parent: QRCodeScanView

        init(parent: QRCodeScanView) {
            self.parent = parent
        }
        
        func dataScanner (_ dataScanner: DataScannerViewController, didAdd addedItems: [RecognizedItem], allItems: [RecognizedItem]) {
            for item in addedItems {
                switch item {
                case .barcode(let barcode):
                    if let code = barcode.payloadStringValue {
                        parent.scannedCode = code
                    }
                default:
                    break
                }
            }
        }
    }

    func makeCoordinator() -&gt; Coordinator {
        Coordinator(parent: self)
    }

    func makeUIViewController(context: Context) -&gt; DataScannerViewController {
        let scannerViewController = DataScannerViewController(
            recognizedDataTypes: [.barcode()], // スキャン対象: バーコードのみ
            qualityLevel: .balanced, // 品質: バランス
            recognizesMultipleItems: false, // 複数のアイテムを認識するか: OFF
            isHighFrameRateTrackingEnabled: false, // フレームレートを高くするか: OFF
            isPinchToZoomEnabled: false, // ピンチでのズームを許可するか: OFF
            isGuidanceEnabled: true, // ガイドをオンにするか: ON
            isHighlightingEnabled: true // バーコードをハイライトにするか: ON
        )

        scannerViewController.delegate = context.coordinator
        return scannerViewController
    }

    func updateUIViewController(_ uiViewController: DataScannerViewController, context: Context) {
        do {
            try uiViewController.startScanning()
        } catch {
            uiViewController.stopScanning()
        }
    }
}

public struct QRCodeScannerView&lt;Dependency: RootDIContainerDependency&gt;: View {
    private let dependency: Dependency
    @StateObject private var presenter: QRCodeScannerPresenter&lt;Dependency&gt;

    public init(dependency: Dependency, isShowingScanner: Binding&lt;Bool&gt;) {
        self.dependency = dependency
        _presenter = .init(wrappedValue: QRCodeScannerPresenter(dependency: dependency, isShowingScanner: isShowingScanner))
    }

    public var body: some View {
        ZStack {
            QRCodeScanView(scannedCode: $presenter.scannedCode)
            Text(presenter.scannedCode)
        }
        .ignoresSafeArea(edges: .all) // カメラモードなのでセーフエリアの非表示
        .persistentSystemOverlays(.hidden) // ホームインジケーターの非表示
        .task {
            await presenter.onAppear()
        }
        .onDisappear {
            presenter.onDisappear()
        }
    }
}

@MainActor
final class QRCodeScannerPresenter&lt;Dependency: QRCodeScannerPresenterDependency&gt;: ObservableObject {
    @Published var scannedCode: String = ""
    @Binding var isShowingScanner: Bool
    private let dependency: Dependency

    init(dependency: Dependency, isShowingScanner: Binding&lt;Bool&gt;) {
        dependency.logDriver.initLog()

        self.dependency = dependency
        _isShowingScanner = isShowingScanner
        
        $scannedCode
            
    }

    deinit {
        OSLogger.deinitLog()
    }

    func onAppear() async {
        dependency.logDriver.onAppearLog()
    }

    func onDisappear() {
        dependency.logDriver.onDisappearLog()
    }
}

---

## 🤖 Assistant
*2024-06-18 06:29:11*

User wants to update the Presenter to open an external WebView and navigate when the scanned QR code starts with "https://www.google.com/".

---

## 🔧 Tool
*2024-06-18 06:29:11*

Model set context updated.

---

## 🤖 Assistant
*2024-06-18 06:29:11*

Presenterを修正して、特定のURLパターンにマッチした場合に外部WebViewを開くようにするには、以下のように実装を変更します。

### 修正後のコード

```swift
import SwiftUI
import VisionKit

// QRCodeScanView
struct QRCodeScanView: UIViewControllerRepresentable {
    @Binding var scannedCode: String

    class Coordinator: NSObject, DataScannerViewControllerDelegate {
        var parent: QRCodeScanView

        init(parent: QRCodeScanView) {
            self.parent = parent
        }

        func dataScanner(_ dataScanner: DataScannerViewController, didAdd addedItems: [RecognizedItem]) {
            for item in addedItems {
                switch item {
                case .barcode(let barcode):
                    if let code = barcode.payloadStringValue {
                        parent.scannedCode = code
                    }
                default:
                    break
                }
            }
        }
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(parent: self)
    }

    func makeUIViewController(context: Context) -> DataScannerViewController {
        let scannerViewController = DataScannerViewController(
            recognizedDataTypes: [.barcode()],
            qualityLevel: .balanced,
            recognizesMultipleItems: false,
            isHighFrameRateTrackingEnabled: false,
            isPinchToZoomEnabled: false,
            isGuidanceEnabled: true,
            isHighlightingEnabled: true
        )

        scannerViewController.delegate = context.coordinator
        return scannerViewController
    }

    func updateUIViewController(_ uiViewController: DataScannerViewController, context: Context) {
        do {
            try uiViewController.startScanning()
        } catch {
            uiViewController.stopScanning()
        }
    }
}

// QRCodeScannerView
public struct QRCodeScannerView<Dependency: RootDIContainerDependency>: View {
    private let dependency: Dependency
    @StateObject private var presenter: QRCodeScannerPresenter<Dependency>

    public init(dependency: Dependency, isShowingScanner: Binding<Bool>) {
        self.dependency = dependency
        _presenter = .init(wrappedValue: QRCodeScannerPresenter(dependency: dependency, isShowingScanner: isShowingScanner))
    }

    public var body: some View {
        ZStack {
            QRCodeScanView(scannedCode: $presenter.scannedCode)
            Text(presenter.scannedCode)
        }
        .ignoresSafeArea(edges: .all)
        .persistentSystemOverlays(.hidden)
        .task {
            await presenter.onAppear()
        }
        .onDisappear {
            presenter.onDisappear()
        }
        .onChange(of: presenter.scannedCode) { code in
            if presenter.isValidURL(code) {
                presenter.openURL(code)
            }
        }
    }
}

// QRCodeScannerPresenter
@MainActor
final class QRCodeScannerPresenter<Dependency: QRCodeScannerPresenterDependency>: ObservableObject {
    @Published var scannedCode: String = ""
    @Binding var isShowingScanner: Bool
    private let dependency: Dependency

    init(dependency: Dependency, isShowingScanner: Binding<Bool>) {
        dependency.logDriver.initLog()
        self.dependency = dependency
        _isShowingScanner = isShowingScanner
    }

    deinit {
        OSLogger.deinitLog()
    }

    func onAppear() async {
        dependency.logDriver.onAppearLog()
    }

    func onDisappear() {
        dependency.logDriver.onDisappearLog()
    }

    func isValidURL(_ url: String) -> Bool {
        return url.starts(with: "https://www.google.com/")
    }

    func openURL(_ url: String) {
        guard let url = URL(string: url) else { return }
        UIApplication.shared.open(url)
    }
}
```

### ポイント
1. **`QRCodeScanView`**:
   - `Coordinator`内でスキャンされたコードを`parent.scannedCode`に設定します。

2. **`QRCodeScannerView`**:
   - `presenter.scannedCode`が変更された際に、`onChange`モディファイアで検知します。
   - `isValidURL`メソッドでURLの検証を行い、特定のパターンに一致する場合は`openURL`メソッドを呼び出します。

3. **`QRCodeScannerPresenter`**:
   - `isValidURL`メソッドで特定のパターンのURLを検証します。
   - `openURL`メソッドでURLを開きます。

これにより、スキャンされたQRコードが特定のURLパターンに一致する場合に自動的に外部WebViewを開くことができます。

---

## 👤 User
*2024-06-18 06:30:12*

.onChange ではなくて presenter の init で Combineで処理してほしい

---

## 🤖 Assistant
*2024-06-18 06:30:53*

`Combine`を使って`QRCodeScannerPresenter`の初期化時にスキャンされたコードの変更を監視し、特定のパターンに一致する場合に外部WebViewを開くようにするには、`Combine`の`Publisher`を使用します。

以下にその実装を示します。

### 修正後のコード

```swift
import SwiftUI
import Combine
import VisionKit

// QRCodeScanView
struct QRCodeScanView: UIViewControllerRepresentable {
    @Binding var scannedCode: String

    class Coordinator: NSObject, DataScannerViewControllerDelegate {
        var parent: QRCodeScanView

        init(parent: QRCodeScanView) {
            self.parent = parent
        }

        func dataScanner(_ dataScanner: DataScannerViewController, didAdd addedItems: [RecognizedItem]) {
            for item in addedItems {
                switch item {
                case .barcode(let barcode):
                    if let code = barcode.payloadStringValue {
                        parent.scannedCode = code
                    }
                default:
                    break
                }
            }
        }
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(parent: self)
    }

    func makeUIViewController(context: Context) -> DataScannerViewController {
        let scannerViewController = DataScannerViewController(
            recognizedDataTypes: [.barcode()],
            qualityLevel: .balanced,
            recognizesMultipleItems: false,
            isHighFrameRateTrackingEnabled: false,
            isPinchToZoomEnabled: false,
            isGuidanceEnabled: true,
            isHighlightingEnabled: true
        )

        scannerViewController.delegate = context.coordinator
        return scannerViewController
    }

    func updateUIViewController(_ uiViewController: DataScannerViewController, context: Context) {
        do {
            try uiViewController.startScanning()
        } catch {
            uiViewController.stopScanning()
        }
    }
}

// QRCodeScannerView
public struct QRCodeScannerView<Dependency: RootDIContainerDependency>: View {
    private let dependency: Dependency
    @StateObject private var presenter: QRCodeScannerPresenter<Dependency>

    public init(dependency: Dependency, isShowingScanner: Binding<Bool>) {
        self.dependency = dependency
        _presenter = .init(wrappedValue: QRCodeScannerPresenter(dependency: dependency, isShowingScanner: isShowingScanner))
    }

    public var body: some View {
        ZStack {
            QRCodeScanView(scannedCode: $presenter.scannedCode)
            Text(presenter.scannedCode)
        }
        .ignoresSafeArea(edges: .all)
        .persistentSystemOverlays(.hidden)
        .task {
            await presenter.onAppear()
        }
        .onDisappear {
            presenter.onDisappear()
        }
    }
}

// QRCodeScannerPresenter
@MainActor
final class QRCodeScannerPresenter<Dependency: QRCodeScannerPresenterDependency>: ObservableObject {
    @Published var scannedCode: String = ""
    @Binding var isShowingScanner: Bool
    private let dependency: Dependency
    private var cancellables = Set<AnyCancellable>()

    init(dependency: Dependency, isShowingScanner: Binding<Bool>) {
        dependency.logDriver.initLog()
        self.dependency = dependency
        _isShowingScanner = isShowingScanner

        // Combineを使用してscannedCodeの変更を監視
        $scannedCode
            .filter { !$0.isEmpty } // 空でないコードのみ処理
            .sink { [weak self] code in
                self?.handleScannedCode(code)
            }
            .store(in: &cancellables)
    }

    deinit {
        OSLogger.deinitLog()
    }

    func onAppear() async {
        dependency.logDriver.onAppearLog()
    }

    func onDisappear() {
        dependency.logDriver.onDisappearLog()
    }

    private func handleScannedCode(_ code: String) {
        if isValidURL(code) {
            openURL(code)
        }
    }

    private func isValidURL(_ url: String) -> Bool {
        return url.starts(with: "https://www.google.com/")
    }

    private func openURL(_ url: String) {
        guard let url = URL(string: url) else { return }
        UIApplication.shared.open(url)
    }
}
```

### ポイント
1. **`Combine`の使用**: `@Published var scannedCode`の変更を`Combine`の`Publisher`を使用して監視し、変更があったときに処理を行います。
2. **`sink`オペレーター**: `scannedCode`が変更されたときに`handleScannedCode`メソッドを呼び出します。
3. **`handleScannedCode`メソッド**: `scannedCode`が特定のパターンに一致するかを確認し、一致する場合にURLを開きます。

これにより、`QRCodeScannerPresenter`の初期化時に`Combine`を使ってスキャンされたコードの変更を監視し、特定のパターンに一致する場合に外部WebViewを開く処理が行われます。

---

## 👤 User
*2024-06-18 06:43:00*

QRコードの読み込み画面によくあるガイドの枠線を実装してほしい。

import DomainLayer
import SwiftUI

public struct QRCodeScannerView&lt;Dependency: RootDIContainerDependency&gt;: View {
    private let dependency: Dependency
    @StateObject private var presenter: QRCodeScannerPresenter&lt;Dependency&gt;

    public init(dependency: Dependency) {
        self.dependency = dependency
        _presenter = .init(wrappedValue: QRCodeScannerPresenter(dependency: dependency))
    }

    public var body: some View {
        ZStack {
            QRCodeScanView(scannedCode: $presenter.scannedCode)
            Text(presenter.scannedCode)
        }
        .ignoresSafeArea(edges: .all) // カメラモードなのでセーフエリアの非表示
        .persistentSystemOverlays(.hidden) // ホームインジケーターの非表示
        .task {
            await presenter.onAppear()
        }
        .onDisappear {
            presenter.onDisappear()
        }
    }
}

---

## 🤖 Assistant
*2024-06-18 06:43:53*

QRコードの読み込み画面にガイドの枠線を追加するには、SwiftUIでオーバーレイとしてガイドラインを描画することができます。以下はその実装例です。

### QRCodeScannerViewにガイドの枠線を追加

以下のコードでは、ガイドの枠線を追加するためにオーバーレイを使っています。これにより、QRコードをスキャンする領域を強調表示できます。

```swift
import DomainLayer
import SwiftUI
import VisionKit

struct QRCodeScanView: UIViewControllerRepresentable {
    @Binding var scannedCode: String

    class Coordinator: NSObject, DataScannerViewControllerDelegate {
        var parent: QRCodeScanView

        init(parent: QRCodeScanView) {
            self.parent = parent
        }

        func dataScanner(_ dataScanner: DataScannerViewController, didAdd addedItems: [RecognizedItem]) {
            for item in addedItems {
                switch item {
                case .barcode(let barcode):
                    if let code = barcode.payloadStringValue {
                        parent.scannedCode = code
                    }
                default:
                    break
                }
            }
        }
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(parent: self)
    }

    func makeUIViewController(context: Context) -> DataScannerViewController {
        let scannerViewController = DataScannerViewController(
            recognizedDataTypes: [.barcode()],
            qualityLevel: .balanced,
            recognizesMultipleItems: false,
            isHighFrameRateTrackingEnabled: false,
            isPinchToZoomEnabled: false,
            isGuidanceEnabled: true,
            isHighlightingEnabled: true
        )

        scannerViewController.delegate = context.coordinator
        return scannerViewController
    }

    func updateUIViewController(_ uiViewController: DataScannerViewController, context: Context) {
        do {
            try uiViewController.startScanning()
        } catch {
            uiViewController.stopScanning()
        }
    }
}

public struct QRCodeScannerView<Dependency: RootDIContainerDependency>: View {
    private let dependency: Dependency
    @StateObject private var presenter: QRCodeScannerPresenter<Dependency>

    public init(dependency: Dependency) {
        self.dependency = dependency
        _presenter = .init(wrappedValue: QRCodeScannerPresenter(dependency: dependency))
    }

    public var body: some View {
        ZStack {
            QRCodeScanView(scannedCode: $presenter.scannedCode)
            // ガイドの枠線を追加
            GuideOverlayView()
            Text(presenter.scannedCode)
                .padding()
                .background(Color.black.opacity(0.7))
                .foregroundColor(.white)
                .cornerRadius(8)
        }
        .ignoresSafeArea(edges: .all) // カメラモードなのでセーフエリアの非表示
        .persistentSystemOverlays(.hidden) // ホームインジケーターの非表示
        .task {
            await presenter.onAppear()
        }
        .onDisappear {
            presenter.onDisappear()
        }
    }
}

struct GuideOverlayView: View {
    var body: some View {
        GeometryReader { geometry in
            let frameSize = min(geometry.size.width, geometry.size.height) * 0.7
            let frame = CGRect(x: (geometry.size.width - frameSize) / 2,
                               y: (geometry.size.height - frameSize) / 2,
                               width: frameSize,
                               height: frameSize)

            Path { path in
                path.addRect(frame)
            }
            .stroke(Color.green, lineWidth: 4)
            .background(Color.clear)
        }
    }
}

// QRCodeScannerPresenter
@MainActor
final class QRCodeScannerPresenter<Dependency: QRCodeScannerPresenterDependency>: ObservableObject {
    @Published var scannedCode: String = ""
    private let dependency: Dependency
    private var cancellables = Set<AnyCancellable>()

    init(dependency: Dependency) {
        dependency.logDriver.initLog()
        self.dependency = dependency

        // Combineを使用してscannedCodeの変更を監視
        $scannedCode
            .filter { !$0.isEmpty } // 空でないコードのみ処理
            .sink { [weak self] code in
                self?.handleScannedCode(code)
            }
            .store(in: &cancellables)
    }

    deinit {
        OSLogger.deinitLog()
    }

    func onAppear() async {
        dependency.logDriver.onAppearLog()
    }

    func onDisappear() {
        dependency.logDriver.onDisappearLog()
    }

    private func handleScannedCode(_ code: String) {
        if isValidURL(code) {
            openURL(code)
        }
    }

    private func isValidURL(_ url: String) -> Bool {
        return url.starts(with: "https://www.google.com/")
    }

    private func openURL(_ url: String) {
        guard let url = URL(string: url) else { return }
        UIApplication.shared.open(url)
    }
}
```

### ポイント
1. **`GuideOverlayView`**:
   - `GeometryReader`を使用してビューのサイズを取得し、中央にガイド枠を描画。
   - ガイド枠は緑色の線で描画され、透明な背景を持つ。

2. **`QRCodeScannerView`**:
   - `QRCodeScanView`の上に`GuideOverlayView`を追加し、ガイドの枠線を表示。
   - スキャンされたコードを表示するための`Text`ビューを追加し、見やすくするためのスタイルを適用。

このようにして、QRコードの読み込み画面にガイドの枠線を追加することで、スキャン領域をユーザーに明示できます。

---

## 👤 User
*2024-06-18 06:49:10*

角丸で枠外がグレーでカバーされているイメージ

---

## 🤖 Assistant
*2024-06-18 06:49:20*

角丸で枠外がグレーでカバーされているイメージを実現するには、`GuideOverlayView`内で`RoundedRectangle`を使って枠線を描画し、その外側にグレーのカバーを追加する方法が考えられます。以下に具体的なコードを示します。

### 修正後のコード

```swift
import DomainLayer
import SwiftUI
import VisionKit

struct QRCodeScanView: UIViewControllerRepresentable {
    @Binding var scannedCode: String

    class Coordinator: NSObject, DataScannerViewControllerDelegate {
        var parent: QRCodeScanView

        init(parent: QRCodeScanView) {
            self.parent = parent
        }

        func dataScanner(_ dataScanner: DataScannerViewController, didAdd addedItems: [RecognizedItem]) {
            for item in addedItems {
                switch item {
                case .barcode(let barcode):
                    if let code = barcode.payloadStringValue {
                        parent.scannedCode = code
                    }
                default:
                    break
                }
            }
        }
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(parent: self)
    }

    func makeUIViewController(context: Context) -> DataScannerViewController {
        let scannerViewController = DataScannerViewController(
            recognizedDataTypes: [.barcode()],
            qualityLevel: .balanced,
            recognizesMultipleItems: false,
            isHighFrameRateTrackingEnabled: false,
            isPinchToZoomEnabled: false,
            isGuidanceEnabled: true,
            isHighlightingEnabled: true
        )

        scannerViewController.delegate = context.coordinator
        return scannerViewController
    }

    func updateUIViewController(_ uiViewController: DataScannerViewController, context: Context) {
        do {
            try uiViewController.startScanning()
        } catch {
            uiViewController.stopScanning()
        }
    }
}

public struct QRCodeScannerView<Dependency: RootDIContainerDependency>: View {
    private let dependency: Dependency
    @StateObject private var presenter: QRCodeScannerPresenter<Dependency>

    public init(dependency: Dependency) {
        self.dependency = dependency
        _presenter = .init(wrappedValue: QRCodeScannerPresenter(dependency: dependency))
    }

    public var body: some View {
        ZStack {
            QRCodeScanView(scannedCode: $presenter.scannedCode)
            GuideOverlayView()
            Text(presenter.scannedCode)
                .padding()
                .background(Color.black.opacity(0.7))
                .foregroundColor(.white)
                .cornerRadius(8)
                .padding()
        }
        .ignoresSafeArea(edges: .all)
        .persistentSystemOverlays(.hidden)
        .task {
            await presenter.onAppear()
        }
        .onDisappear {
            presenter.onDisappear()
        }
    }
}

struct GuideOverlayView: View {
    var body: some View {
        GeometryReader { geometry in
            let frameSize = min(geometry.size.width, geometry.size.height) * 0.7
            let frame = CGRect(x: (geometry.size.width - frameSize) / 2,
                               y: (geometry.size.height - frameSize) / 2,
                               width: frameSize,
                               height: frameSize)
            
            ZStack {
                RoundedRectangle(cornerRadius: 20)
                    .stroke(Color.green, lineWidth: 4)
                    .frame(width: frame.width, height: frame.height)
                
                RoundedRectangle(cornerRadius: 20)
                    .fill(Color.gray.opacity(0.5))
                    .frame(width: geometry.size.width, height: geometry.size.height)
                    .mask(RoundedRectangle(cornerRadius: 20).frame(width: frame.width, height: frame.height))
            }
            .position(x: geometry.size.width / 2, y: geometry.size.height / 2)
        }
    }
}

// QRCodeScannerPresenter
@MainActor
final class QRCodeScannerPresenter<Dependency: QRCodeScannerPresenterDependency>: ObservableObject {
    @Published var scannedCode: String = ""
    private let dependency: Dependency
    private var cancellables = Set<AnyCancellable>()

    init(dependency: Dependency) {
        dependency.logDriver.initLog()
        self.dependency = dependency

        $scannedCode
            .filter { !$0.isEmpty }
            .sink { [weak self] code in
                self?.handleScannedCode(code)
            }
            .store(in: &cancellables)
    }

    deinit {
        OSLogger.deinitLog()
    }

    func onAppear() async {
        dependency.logDriver.onAppearLog()
    }

    func onDisappear() {
        dependency.logDriver.onDisappearLog()
    }

    private func handleScannedCode(_ code: String) {
        if isValidURL(code) {
            openURL(code)
        }
    }

    private func isValidURL(_ url: String) -> Bool {
        return url.starts(with: "https://www.google.com/")
    }

    private func openURL(_ url: String) {
        guard let url = URL(string: url) else { return }
        UIApplication.shared.open(url)
    }
}
```

### ポイント
1. **`GuideOverlayView`の修正**:
   - `GeometryReader`を使用してビューのサイズを取得し、中央に角丸の枠線を描画。
   - `RoundedRectangle`を使い、枠線部分に緑色の線を設定。
   - `fill`と`mask`を使用して枠外をグレーでカバーするエフェクトを追加。

2. **`QRCodeScannerView`の更新**:
   - `GuideOverlayView`をZStackの中に追加して、QRコードスキャン領域にガイド枠線を表示。
   - スキャン結果の表示部分に背景色と角丸を追加して、視認性を高めています。

この実装により、QRコードスキャン画面に角丸の枠線と外側のグレーのカバーが表示されるようになります。

---
