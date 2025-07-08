# SwiftUIのEmptyViewのプレビューサンプル

Date: 2023-06-06

---

## 👤 User
*2023-06-07 00:43:35*

SwiftUIの空っぽのViewとプレビューサンプルがほしい

---

## 🤖 Assistant
*2023-06-07 00:43:53*

もちろんです。SwiftUIを使って空っぽのViewを作り、プレビューサンプルを表示する基本的なコードは以下のようになります：

```swift
import SwiftUI

struct ContentView: View {
    var body: some View {
        EmptyView()
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
```

このコードは、SwiftUIで空のViewを作成し、それをプレビューで表示するものです。この`ContentView`は何も表示しない`EmptyView`を返します。そして`ContentView_Previews`はプレビュープロバイダで、プレビュー画面でこの`ContentView`を表示します。

以上が空のViewを作成し、それをプレビューで表示する一番シンプルなSwiftUIのコードです。

---

## 👤 User
*2023-06-07 00:48:04*

GazeCalibrationの

---

## 🤖 Assistant
*2023-06-07 00:48:05*

AppleのCore MLフレ

---
