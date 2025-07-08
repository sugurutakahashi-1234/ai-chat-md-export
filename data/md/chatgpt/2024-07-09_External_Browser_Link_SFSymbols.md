# External Browser Link SFSymbols

日付: 2024-07-09

---

## 👤 ユーザー
*2024/07/09 14:28:55*

外部ブラウザを開くリンクのSFSYmbols

---

## 🤖 アシスタント
*2024/07/09 14:29:14*

外部ブラウザを開くためのリンクに関連するSFSymbolsのアイコンとしては、以下のものが適しています：

1. `safari` - Safariブラウザのアイコン。
2. `globe` - 地球儀のアイコン。
3. `link` - リンクのアイコン。

これらのアイコンは、リンクを示すのに適しており、ユーザーに対して外部ブラウザを開くことを直感的に示すことができます。例えば、`Button`にこれらのアイコンを設定して使用することができます。

以下は、SwiftUIでこれらのアイコンをボタンに設定するコード例です：

```swift
import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack {
            Button(action: {
                // 外部ブラウザを開くアクション
                if let url = URL(string: "https://www.example.com") {
                    UIApplication.shared.open(url)
                }
            }) {
                Label("Open in Safari", systemImage: "safari")
            }
            .padding()

            Button(action: {
                // 外部ブラウザを開くアクション
                if let url = URL(string: "https://www.example.com") {
                    UIApplication.shared.open(url)
                }
            }) {
                Label("Open Link", systemImage: "link")
            }
            .padding()

            Button(action: {
                // 外部ブラウザを開くアクション
                if let url = URL(string: "https://www.example.com") {
                    UIApplication.shared.open(url)
                }
            }) {
                Label("Open Website", systemImage: "globe")
            }
            .padding()
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
```

このコードでは、3つのボタンがそれぞれ異なるアイコンを使用して外部ブラウザを開くリンクを提供しています。ユーザーは、ボタンをタップすることで指定されたURLを外部ブラウザで開くことができます。

---

## 👤 ユーザー
*2024/07/09 14:31:21*

SwiftUI iOS16 でもっとかんたんに外部リンクって開けなかったっけ？

---

## 🤖 アシスタント
*2024/07/09 14:31:33*

確かに、iOS 16 以降では SwiftUI で `Link` を使用して簡単に外部リンクを開くことができます。`Link` はラベルとURLを指定するだけで、外部ブラウザを開くことができます。

以下に `Link` を使用したシンプルな例を示します：

```swift
import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack {
            Link(destination: URL(string: "https://www.example.com")!) {
                Label("Open in Safari", systemImage: "safari")
            }
            .padding()

            Link(destination: URL(string: "https://www.example.com")!) {
                Label("Open Link", systemImage: "link")
            }
            .padding()

            Link(destination: URL(string: "https://www.example.com")!) {
                Label("Open Website", systemImage: "globe")
            }
            .padding()
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
```

このコードでは、`Link` を使用して、3つの異なるアイコン付きのリンクを作成しています。`Link` を使用することで、外部ブラウザを開くアクションを簡単に実装できます。また、`Link` はタップされると指定したURLを開くため、追加のアクションハンドラを記述する必要がありません。

---
