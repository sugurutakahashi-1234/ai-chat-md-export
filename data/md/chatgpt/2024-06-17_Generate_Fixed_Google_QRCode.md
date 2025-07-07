# Generate Fixed Google QRCode

日付: 2024-06-17

---

## 👤 ユーザー
*2024/6/17 15:52:13*

このスタブでGoogleのホームページのQRCodeを固定で返却するようにしたい。

public final class QRCodeDriverProtocolMock: QRCodeDriverProtocol {
    public init() { }


    public private(set) var generateQRCodeCallCount = 0
    public var generateQRCodeHandler: ((String, QRCorrectionLevel) throws -&gt; (CIImage))?
    public func generateQRCode(text: String, correctionLevel: QRCorrectionLevel) throws -&gt; CIImage {
        generateQRCodeCallCount += 1
        if let generateQRCodeHandler = generateQRCodeHandler {
            return try generateQRCodeHandler(text, correctionLevel)
        }
        fatalError("generateQRCodeHandler returns can't have a default value thus its handler must be set")
    }
}

---

## 🤖 アシスタント
*2024/6/17 15:52:27*

以下のコードを使って、QRCodeDriverProtocolMockのgenerateQRCodeメソッドがGoogleのホームページのQRCodeを固定で返却するようにすることができます。`CIImage`を生成するために`CoreImage`をインポートし、スタブ内で固定のQRCode画像を返すように設定します。

```swift
import CoreImage

public final class QRCodeDriverProtocolMock: QRCodeDriverProtocol {
    public init() { }

    public private(set) var generateQRCodeCallCount = 0
    public var generateQRCodeHandler: ((String, QRCorrectionLevel) throws -> (CIImage))?

    public func generateQRCode(text: String, correctionLevel: QRCorrectionLevel) throws -> CIImage {
        generateQRCodeCallCount += 1
        if let generateQRCodeHandler = generateQRCodeHandler {
            return try generateQRCodeHandler(text, correctionLevel)
        }
        return generateGoogleQRCode()
    }

    private func generateGoogleQRCode() -> CIImage {
        let googleURL = "https://www.google.com"
        let data = googleURL.data(using: String.Encoding.ascii)

        guard let filter = CIFilter(name: "CIQRCodeGenerator") else {
            fatalError("Failed to create QRCode filter")
        }

        filter.setValue(data, forKey: "inputMessage")
        filter.setValue("H", forKey: "inputCorrectionLevel")

        guard let ciImage = filter.outputImage else {
            fatalError("Failed to generate QRCode image")
        }

        return ciImage
    }
}
```

このコードのポイントは以下の通りです：

1. `generateQRCode`メソッド内で`generateQRCodeHandler`が設定されていない場合に`generateGoogleQRCode`メソッドを呼び出します。
2. `generateGoogleQRCode`メソッドで、GoogleのホームページのURLをQRコード化し、`CIImage`を生成して返します。

これにより、`generateQRCodeHandler`が設定されていない場合でも常にGoogleのホームページのQRCodeを返却するようになります。

---

## 👤 ユーザー
*2024/6/17 15:52:46*

QRCodeDriverProtocolMock の内容を変えるのではなく、外から設定したい。

---

## 🤖 アシスタント
*2024/6/17 15:53:03*

外部から設定するために、`QRCodeDriverProtocolMock`の`generateQRCodeHandler`に固定のGoogle QRコードを返すクロージャを設定することができます。以下のように使用するコード例を示します。

```swift
import CoreImage

// QRCodeDriverProtocolMockの定義はそのまま
public final class QRCodeDriverProtocolMock: QRCodeDriverProtocol {
    public init() { }

    public private(set) var generateQRCodeCallCount = 0
    public var generateQRCodeHandler: ((String, QRCorrectionLevel) throws -> (CIImage))?
    public func generateQRCode(text: String, correctionLevel: QRCorrectionLevel) throws -> CIImage {
        generateQRCodeCallCount += 1
        if let generateQRCodeHandler = generateQRCodeHandler {
            return try generateQRCodeHandler(text, correctionLevel)
        }
        fatalError("generateQRCodeHandler returns can't have a default value thus its handler must be set")
    }
}

// 固定のGoogle QRコードを生成するヘルパー関数
func generateGoogleQRCode() -> CIImage {
    let googleURL = "https://www.google.com"
    let data = googleURL.data(using: String.Encoding.ascii)

    guard let filter = CIFilter(name: "CIQRCodeGenerator") else {
        fatalError("Failed to create QRCode filter")
    }

    filter.setValue(data, forKey: "inputMessage")
    filter.setValue("H", forKey: "inputCorrectionLevel")

    guard let ciImage = filter.outputImage else {
        fatalError("Failed to generate QRCode image")
    }

    return ciImage
}

// QRCodeDriverProtocolMockのインスタンスを作成
let mock = QRCodeDriverProtocolMock()

// generateQRCodeHandlerに固定のGoogle QRコードを返すクロージャを設定
mock.generateQRCodeHandler = { text, correctionLevel in
    return generateGoogleQRCode()
}

// テスト実行例
do {
    let qrCodeImage = try mock.generateQRCode(text: "dummy text", correctionLevel: .medium)
    // ここでqrCodeImageを使ったテストを行う
    print("QRCode generated successfully")
} catch {
    print("Failed to generate QRCode: \(error)")
}
```

この例では、`QRCodeDriverProtocolMock`の`generateQRCodeHandler`にクロージャを設定して、固定のGoogle QRコードを返すようにしています。この方法で、`QRCodeDriverProtocolMock`の内容を変更せずに外部から設定できます。

---
