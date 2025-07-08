# NavigationViewラッパー

日付: 2023-04-29

---

## 👤 ユーザー
*2023/04/29 15:58:23*

SwiftUI で作成されるアプリで iOS16からは NavigationView が非推奨になって、NavigationStackView を使うようになったが、iOS15とiOS16の両方に対応できるようなラッパーするコードを作成してほしい

---

## 🤖 アシスタント
*2023/04/29 15:58:36*

iOS15とiOS16の両方に対応するためには、動的に使用する View の種類を切り替える必要があります。以下のようなコードを使用して、iOS15の場合は `NavigationView` を、iOS16の場合は `NavigationStackView` を使用することができます。

```swift
import SwiftUI

@available(iOS, deprecated: 100000, message: "Use NavigationStackView instead")
struct LegacyNavigationView<Content: View>: View {
    let content: () -> Content
    
    @ViewBuilder
    var body: some View {
        if #available(iOS 16.0, *) {
            NavigationStackView {
                content()
            }
        } else {
            NavigationView {
                content()
            }
        }
    }
}
```

このようにラッパーすることで、iOS16から非推奨になった `NavigationView` を使い続けることができますが、将来的には `NavigationStackView` を使用することを推奨します。

---

## 👤 ユーザー
*2023/04/29 15:59:00*

それにpush遷移するように記述してみて

---

## 🤖 アシスタント
*2023/04/29 15:59:15*

ラッパーした `LegacyNavigationView` を使用して、`push` 遷移を行う例を以下に示します。

```swift
import SwiftUI

struct ContentView: View {
    var body: some View {
        LegacyNavigationView {
            List(1...10, id: \.self) { index in
                NavigationLink(destination: DetailView(index: index)) {
                    Text("Item \(index)")
                }
            }
            .navigationTitle("List")
        }
    }
}

struct DetailView: View {
    let index: Int
    
    var body: some View {
        Text("Detail \(index)")
            .navigationTitle("Detail \(index)")
    }
}
```

この例では、`LegacyNavigationView` の中に `List` を配置し、各項目に対して `NavigationLink` を設定しています。`NavigationLink` の `destination` には、詳細画面として `DetailView` を指定しています。

`DetailView` では、`navigationTitle` を使用して、画面タイトルを設定しています。

このコードは、iOS15では `NavigationView` を使用し、iOS16以降では `NavigationStackView` を使用するため、どちらのバージョンでも正常に動作します。

---
