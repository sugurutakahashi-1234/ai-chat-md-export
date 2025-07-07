# SwiftUI AsyncImage Retry

日付: 2024-06-25

---

## 👤 ユーザー
*2024/6/25 17:42:13*

swiftuiでAsyncImage でリトライの機能をつけたい

---

## 🤖 アシスタント
*2024/6/25 17:42:37*

SwiftUIで`AsyncImage`にリトライ機能を追加するには、カスタムビューを作成することで実現できます。以下は、画像の読み込みに失敗した場合にリトライボタンを表示する例です。

```swift
import SwiftUI

struct RetryAsyncImage: View {
    @State private var retryCount = 0
    let url: URL
    
    var body: some View {
        VStack {
            AsyncImage(url: url, transaction: Transaction(animation: .default)) { phase in
                switch phase {
                case .empty:
                    ProgressView()
                case .success(let image):
                    image
                        .resizable()
                        .scaledToFit()
                case .failure:
                    VStack {
                        Image(systemName: "exclamationmark.triangle")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 50, height: 50)
                        Text("Failed to load image")
                        Button(action: {
                            retryCount += 1
                        }) {
                            Text("Retry")
                        }
                    }
                @unknown default:
                    EmptyView()
                }
            }
            .id(retryCount)
        }
    }
}

struct ContentView: View {
    var body: some View {
        RetryAsyncImage(url: URL(string: "https://example.com/image.jpg")!)
            .frame(width: 300, height: 300)
    }
}

@main
struct YourApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

### 説明
1. **`RetryAsyncImage`カスタムビュー**:
   - `url`は読み込む画像のURLです。
   - `retryCount`を`@State`で管理し、リトライボタンが押されたときに増加させます。
   - `AsyncImage`の`id`に`retryCount`を渡すことで、リトライボタンが押されたときに画像の読み込みを再試行します。

2. **`AsyncImage`のフェーズ管理**:
   - `empty`: 画像がまだ読み込まれていない状態。
   - `success`: 画像の読み込みが成功した状態。
   - `failure`: 画像の読み込みが失敗した状態。リトライボタンを表示します。

3. **`ContentView`**:
   - `RetryAsyncImage`を表示するビューです。

このようにすることで、画像の読み込みに失敗した場合にリトライボタンを表示し、ユーザーが再試行できるようになります。

---
