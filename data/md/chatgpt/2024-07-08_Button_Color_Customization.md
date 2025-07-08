# Button Color Customization

日付: 2024-07-08

---

## 👤 ユーザー
*2024/07/08 17:41:10*

SwiftUIでボタンの上の文字列が青くなってしまう

OS標準のカラーにしてほしい

---

## 🤖 アシスタント
*2024/07/08 17:41:22*

SwiftUIでボタンの上の文字列が青くなってしまうのは、デフォルトのスタイルが適用されているためです。OS標準のカラーに戻すためには、`ButtonStyle`をカスタマイズする必要があります。以下の例では、カスタムスタイルを作成して、標準のカラーを適用しています。

```swift
import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack {
            Button("Standard Button") {
                // ボタンのアクション
            }
            .buttonStyle(StandardButtonStyle())
        }
    }
}

struct StandardButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .foregroundColor(.primary) // 標準カラーを適用
            .padding()
            .background(Color.blue)
            .cornerRadius(8)
            .scaleEffect(configuration.isPressed ? 0.95 : 1.0)
            .animation(.spring(), value: configuration.isPressed)
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
```

このコードでは、`StandardButtonStyle`というカスタムのボタンスタイルを作成し、`foregroundColor(.primary)`を使用して標準の文字色を適用しています。これにより、ボタンの文字が青くならず、OS標準のカラーが適用されます。

---
