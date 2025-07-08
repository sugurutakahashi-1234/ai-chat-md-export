# Font Size iOS Swift

Date: 2024-03-03

---

## 👤 User
*2024-03-03 16:01:20*

デバイスのフォントサイズ設定 iOS Swift 取得方法

---

## 👤 User
*2024-03-03 16:08:15*

ダークモード設定を

---

## 👤 User
*2024-03-03 16:13:45*

SwiftUIではどうやってアクセスしたり更新したりするの？’

---

## 🤖 Assistant
*2024-03-03 16:13:59*

SwiftUIでダークモード設定にアクセスしたり、それに基づいてUIを更新したりするには、`Environment`プロパティラッパーを使用して`\.colorScheme`を監視します。これにより、現在のカラースキーム（ライトモードまたはダークモード）を取得し、それに応じてUIを調整することができます。

以下は、SwiftUIでダークモードの設定を取得し、それに基づいて異なるUIを表示する基本的な例です。

```swift
import SwiftUI

struct ContentView: View {
    // 現在のカラースキームを監視
    @Environment(\.colorScheme) var colorScheme

    var body: some View {
        // カラースキームに基づいて異なるビューを表示
        VStack {
            if colorScheme == .dark {
                // ダークモードの場合のビュー
                Text("ダークモードです")
                    .foregroundColor(.white)
                    .padding()
                    .background(Color.black)
            } else {
                // ライトモードの場合のビュー
                Text("ライトモードです")
                    .foregroundColor(.black)
                    .padding()
                    .background(Color.white)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .edgesIgnoringSafeArea(.all)
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
```

このコードは、現在のカラースキームを監視し、それがダークモードかライトモードかに応じて異なるテキストと背景色を表示します。`@Environment(\.colorScheme)`プロパティラッパーを使用することで、ユーザーがシステム設定を変更してカラースキームが変わった場合にも、自動的にビューが更新されるようになります。

SwiftUIでは、このように`Environment`プロパティを使用してシステム設定や環境情報にアクセスし、それに基づいてUIを動的に調整することができます。

---
