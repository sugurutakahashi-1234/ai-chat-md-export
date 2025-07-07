# Disable Sheet Swipe Close

日付: 2024-08-20

---

## 👤 ユーザー
*2024/8/20 16:56:01*

SwiftUIでsheetの下スワイプで閉じる機能を無効化したい

---

## 🤖 アシスタント
*2024/8/20 16:56:16*

SwiftUIで`sheet`の下スワイプで閉じる機能を無効化するには、`isModalInPresentation`プロパティを使用します。ただし、このプロパティはUIKitの`UIViewController`をラップする必要があります。以下にその方法を示します。

まず、カスタムの`UIViewController`をラップしたSwiftUIのViewを作成します。

```swift
import SwiftUI

struct NonDismissableSheet<Content: View>: UIViewControllerRepresentable {
    let content: Content

    init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }

    func makeUIViewController(context: Context) -> UIViewController {
        let controller = UIViewController()
        let hostingController = UIHostingController(rootView: content)
        controller.addChild(hostingController)
        controller.view.addSubview(hostingController.view)
        hostingController.view.frame = controller.view.bounds
        hostingController.view.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        hostingController.didMove(toParent: controller)
        controller.isModalInPresentation = true
        return controller
    }

    func updateUIViewController(_ uiViewController: UIViewController, context: Context) {}
}
```

次に、このカスタムViewを使用して、`sheet`内で表示するViewをラップします。

```swift
struct ContentView: View {
    @State private var isSheetPresented = false

    var body: some View {
        Button("Show Sheet") {
            isSheetPresented = true
        }
        .sheet(isPresented: $isSheetPresented) {
            NonDismissableSheet {
                VStack {
                    Text("This is a non-dismissable sheet")
                    Button("Close") {
                        isSheetPresented = false
                    }
                }
                .padding()
            }
        }
    }
}
```

このコードでは、`NonDismissableSheet`を使用して表示されるシートは、下にスワイプしても閉じることができなくなり、閉じるためには明示的に「Close」ボタンなどを使う必要があります。

この方法で、ユーザーが下スワイプしてシートを閉じるのを防ぐことができます。

---

## 👤 ユーザー
*2024/8/20 16:56:32*

ネイティブなSwiftUIではできないのか？最新でも。

---

## 🤖 アシスタント
*2024/8/20 16:56:39*

User prefers to use native SwiftUI solutions where possible.

---

## 🔧 ツール
*2024/8/20 16:56:39*

Model set context updated.

---

## 🤖 アシスタント
*2024/8/20 16:56:39*

ネイティブなSwiftUIで直接シートの下スワイプによる閉じる機能を無効化することは、現時点（iOS 17時点）では標準ではサポートされていません。

ただし、今後のアップデートで追加される可能性がありますので、Appleのドキュメントやリリースノートを確認することをお勧めします。

現時点で完全にネイティブなSwiftUIで実現する方法がないため、もし必要であれば前述のUIKitを使ったラップを考慮に入れてください。今後のバージョンでこの機能がサポートされた場合は、そちらを活用できるようにしておくと良いでしょう。

---
