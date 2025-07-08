# Splash Screen SwiftUI

Date: 2024-07-17

---

## 👤 User
*2024-07-17 15:33:34*

SwiftUIでスプラッシュ画面を立ち上げる方法

---

## 🤖 Assistant
*2024-07-17 15:33:44*

SwiftUIでスプラッシュ画面を実装する方法はいくつかありますが、基本的なアプローチとしては、アプリの起動時にスプラッシュ画面を表示し、一定時間後にメインコンテンツに遷移する方法です。以下はその一例です。

1. **スプラッシュ画面のビューを作成**：
   スプラッシュ画面として表示するカスタムビューを作成します。

```swift
import SwiftUI

struct SplashScreenView: View {
    var body: some View {
        VStack {
            Image(systemName: "star.fill")
                .resizable()
                .frame(width: 100, height: 100)
                .foregroundColor(.yellow)
            Text("Welcome to MyApp")
                .font(.largeTitle)
                .fontWeight(.bold)
                .padding()
        }
        .background(Color.blue)
        .edgesIgnoringSafeArea(.all)
    }
}
```

2. **スプラッシュ画面を表示するロジック**：
   アプリの起動時にスプラッシュ画面を表示し、一定時間後にメインコンテンツに遷移するロジックを実装します。

```swift
import SwiftUI

@main
struct MyApp: App {
    @State private var showSplash = true

    var body: some Scene {
        WindowGroup {
            if showSplash {
                SplashScreenView()
                    .onAppear {
                        DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
                            withAnimation {
                                showSplash = false
                            }
                        }
                    }
            } else {
                ContentView()
            }
        }
    }
}
```

この例では、`showSplash`という状態変数を使用して、スプラッシュ画面を表示するかメインコンテンツを表示するかを制御しています。`DispatchQueue.main.asyncAfter`を使用して、2秒後にスプラッシュ画面からメインコンテンツに遷移します。また、`withAnimation`を使用して遷移にアニメーション効果を加えています。

3. **メインコンテンツのビュー**：
   メインコンテンツのビューも定義します。

```swift
import SwiftUI

struct ContentView: View {
    var body: some View {
        Text("This is the main content of the app.")
            .padding()
    }
}
```

このようにすることで、アプリの起動時にスプラッシュ画面を表示し、一定時間後にメインコンテンツに遷移するシンプルな実装ができます。必要に応じて、スプラッシュ画面のデザインや表示時間、遷移アニメーションをカスタマイズしてください。

---
