# 検知UIActivity閉じられた

日付: 2023-09-28

---

## 👤 ユーザー
*2023/9/28 11:16:34*

SwiftUI UIActivity 閉じられたことを検知する

---

## 🤖 アシスタント
*2023/9/28 11:17:16*

`UIActivityViewController`をSwiftUIで使用する場合、通常はUIViewControllerRepresentableを使ってラップします。このUIActivityViewControllerが閉じられたかどうかを検知するには、`completionWithItemsHandler`を使用できます。

以下はSwiftUIで`UIActivityViewController`を使用して、ユーザーがそれを閉じた時に検知する例です。

```swift
import SwiftUI

struct ActivityViewController: UIViewControllerRepresentable {
    var activityItems: [Any]
    var applicationActivities: [UIActivity]? = nil
    @Binding var isPresented: Bool
    
    func makeUIViewController(context: Context) -> UIActivityViewController {
        let controller = UIActivityViewController(activityItems: activityItems, applicationActivities: applicationActivities)
        controller.completionWithItemsHandler = { (activityType, completed, returnedItems, error) in
            self.isPresented = false // ここでUIActivityViewControllerが閉じられたことを検知します
        }
        return controller
    }
    
    func updateUIViewController(_ uiViewController: UIActivityViewController, context: Context) {}
}

struct ContentView: View {
    @State private var isShareSheetPresented = false
    
    var body: some View {
        Button(action: {
            isShareSheetPresented = true
        }) {
            Text("Share")
        }
        .activitySheet(isPresented: $isShareSheetPresented, items: ["Hello, world!"])
    }
}

extension View {
    func activitySheet(isPresented: Binding<Bool>, items: [Any]) -> some View {
        return sheet(isPresented: isPresented) {
            ActivityViewController(activityItems: items, isPresented: isPresented)
        }
    }
}

@main
struct MyApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

上記のコードでは、ユーザーがシェアボタンをタップすると`UIActivityViewController`が表示され、ユーザーがそれを閉じると`isShareSheetPresented`が`false`に設定されます。

---
