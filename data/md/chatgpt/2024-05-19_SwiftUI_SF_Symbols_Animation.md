# SwiftUI SF Symbols Animation

Date: 2024-05-19

---

## 👤 User
*2024-05-19 11:12:01*

SwiftでSFシンボルはSwiftUIの機能でアニメーションなどがあるという

それを実装してほしい

---

## 🤖 Assistant
*2024-05-19 11:12:17*

SwiftUIでは、SF Symbols（San Francisco Symbols）を使ってアニメーションを実装することができます。以下は、SF Symbolsを使用してアイコンをアニメーションする簡単な例です。

この例では、ハートのアイコンがタップされると、サイズが変わるアニメーションを実装します。

```swift
import SwiftUI

struct ContentView: View {
    @State private var isAnimating = false

    var body: some View {
        VStack {
            Image(systemName: isAnimating ? "heart.fill" : "heart")
                .font(.system(size: 100))
                .foregroundColor(isAnimating ? .red : .gray)
                .scaleEffect(isAnimating ? 1.5 : 1.0)
                .animation(.easeInOut(duration: 0.5), value: isAnimating)
                .onTapGesture {
                    isAnimating.toggle()
                }
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
```

### 解説

1. **`@State` プロパティ**:
    - `@State`プロパティラッパーを使って、アニメーションのトリガーとして使用する`isAnimating`という状態変数を定義します。

2. **`Image(systemName:)`**:
    - `Image`ビューを使ってSF Symbolsのアイコンを表示します。`systemName`パラメータにはSF Symbolsの名前を指定します。

3. **アニメーションのパラメータ**:
    - `font(.system(size: 100))`: アイコンのサイズを指定します。
    - `foregroundColor(isAnimating ? .red : .gray)`: アイコンの色を状態に応じて変更します。
    - `scaleEffect(isAnimating ? 1.5 : 1.0)`: アイコンのスケールを状態に応じて変更します。
    - `animation(.easeInOut(duration: 0.5), value: isAnimating)`: アニメーションの種類と持続時間を指定し、`isAnimating`変数の値の変化に基づいてアニメーションをトリガーします。

4. **`onTapGesture` モディファイア**:
    - `onTapGesture`モディファイアを使って、アイコンがタップされたときに`isAnimating`変数の値をトグルします。

このコードをSwiftUIプロジェクトに追加すると、ハートのアイコンをタップすることで、アニメーションが実行されることを確認できます。必要に応じて、他のSF Symbolsやアニメーション効果も同様の方法で実装できます。

---
