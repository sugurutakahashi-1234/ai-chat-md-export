# PDFをSwiftUIで表示

Date: 2023-10-10

---

## 👤 User
*2023-10-10 14:37:21*

PDF 表示 SwiftUI

---

## 🤖 Assistant
*2023-10-10 14:38:27*

SwiftUI には、直接 PDF を表示するための組み込みのコンポーネントは存在しないため、UIKit の `PDFKit` を SwiftUI にラップする必要があります。以下は、SwiftUI で PDF を表示するための基本的な手順です：

1. `PDFKit` をインポートするためにプロジェクトに `PDFKit` フレームワークを追加します。
2. SwiftUI から利用するための `UIViewRepresentable` ラッパーを作成します。

以下は、この手順を示すサンプルコードです：

```swift
import SwiftUI
import PDFKit

struct PDFViewRepresentable: UIViewRepresentable {
    let url: URL

    func makeUIView(context: UIViewRepresentableContext<PDFViewRepresentable>) -> PDFView {
        let pdfView = PDFView()
        pdfView.autoScales = true
        return pdfView
    }

    func updateUIView(_ uiView: PDFView, context: UIViewRepresentableContext<PDFViewRepresentable>) {
        uiView.document = PDFDocument(url: url)
    }
}

struct ContentView: View {
    var body: some View {
        // 例として、バンドル内の "sample.pdf" という名前のファイルを表示する
        if let pdfUrl = Bundle.main.url(forResource: "sample", withExtension: "pdf") {
            PDFViewRepresentable(url: pdfUrl)
                .edgesIgnoringSafeArea(.all)
        } else {
            Text("PDF ファイルが見つかりませんでした。")
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
```

このコードは、アプリケーションのバンドルに "sample.pdf" という名前の PDF ファイルが含まれていることを前提としています。このコードを使用して、SwiftUI ベースのアプリケーションで PDF ドキュメントを表示することができます。

---
