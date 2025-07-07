# SwiftUIでToastの作成

日付: 2024-05-29

---

## 👤 ユーザー
*2024/5/29 13:56:52*

SwiftUIでtoastのような表示をしたい場合はどうすればいいか？

---

## 🤖 アシスタント
*2024/5/29 13:57:06*

SwiftUIでToastのような表示をする方法はいくつかありますが、カスタムビューを使って実装するのが一般的です。以下にシンプルな例を示します。

### Toast Viewの作成

まず、Toastを表示するためのカスタムビューを作成します。

```swift
import SwiftUI

struct ToastView: View {
    var message: String
    var body: some View {
        Text(message)
            .font(.body)
            .padding()
            .background(Color.black.opacity(0.8))
            .foregroundColor(Color.white)
            .cornerRadius(10)
            .padding(.horizontal, 20)
            .transition(.opacity)
    }
}
```

### トースト表示の状態管理

次に、トーストの表示状態を管理するための状態を用意します。

```swift
class ToastManager: ObservableObject {
    @Published var isShowing: Bool = false
    @Published var message: String = ""
    
    func show(message: String, duration: TimeInterval = 2.0) {
        self.message = message
        withAnimation {
            self.isShowing = true
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + duration) {
            withAnimation {
                self.isShowing = false
            }
        }
    }
}
```

### 親ビューでのトースト表示

最後に、親ビューでトーストを表示するための実装を行います。

```swift
struct ContentView: View {
    @StateObject private var toastManager = ToastManager()
    
    var body: some View {
        ZStack {
            VStack {
                // メインコンテンツ
                Button("Show Toast") {
                    toastManager.show(message: "This is a toast message!")
                }
            }
            if toastManager.isShowing {
                ToastView(message: toastManager.message)
                    .zIndex(1)  // トーストを最前面に表示する
            }
        }
        .environmentObject(toastManager)
    }
}
```

このコードでは、`ToastManager`クラスを使ってトーストの表示と非表示を管理し、`ContentView`内でトーストを表示するロジックを実装しています。トーストは一定期間表示された後、自動的に非表示になります。

これで、SwiftUIでToastのような表示ができるようになります。必要に応じて、デザインやアニメーションをカスタマイズしてください。

---
