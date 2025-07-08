# SwiftUI Alert with Image

Date: 2023-06-07

---

## 👤 User
*2023-06-07 13:28:35*

SwiftUI  alert 画像を組み込む

---

## 🤖 Assistant
*2023-06-07 13:29:04*

SwiftUIでは、直接的な方法でAlertに画像を組み込むことはできません。Alertはテキスト主体のUI要素で、主に情報を通知するためにデザインされています。しかし、カスタムビューを作成してそれに似たものを作ることは可能です。

以下に、カスタムビューを使ってアラート風のビューを作る方法を示します。

```swift
import SwiftUI

struct ContentView: View {
    @State private var showAlert = false

    var body: some View {
        Button(action: {
            showAlert = true
        }) {
            Text("Show Alert")
        }
        .alert(isPresented: $showAlert) { 
            Alert(
                title: Text("Alert"),
                message: CustomAlertView(),
                dismissButton: .default(Text("OK"))
            )
        }
    }
}

struct CustomAlertView: View {
    var body: some View {
        VStack {
            Image(systemName: "exclamationmark.triangle")
                .resizable()
                .frame(width: 50, height: 50)
                .foregroundColor(.red)
            Text("This is a custom alert message.")
        }
    }
}
```

このコードでは、`CustomAlertView`という新しいSwiftUIビューを作成し、その中にImageとTextを配置します。そして、これをAlertのmessageにセットします。ただし、通常のAlertと比べて見た目が異なる可能性があることに注意してください。これはあくまでAlert風のビューを作成する方法の一つであり、完全に同じ見た目を実現するためには、よりカスタム化したビューを作成する必要があります。

---
