# SwiftUI Animation Infinite Loop

日付: 2024-06-28

---

## 👤 ユーザー
*2024/6/28 12:37:03*

これの無限リピート

sfSymbol.image.symbolEffect(.variableColor.iterative, value: isActiveEffect)

---

## 🤖 アシスタント
*2024/6/28 12:37:11*

SwiftUI で無限リピート効果を実現するために、`withAnimation`を使って、条件が変わるたびにアニメーションをトリガーする方法があります。以下はその一例です：

```swift
import SwiftUI

struct ContentView: View {
    @State private var isActiveEffect = false

    var body: some View {
        VStack {
            Image(systemName: "star.fill")
                .symbolEffect(.variableColor.iterative, value: isActiveEffect)
                .onAppear {
                    withAnimation(Animation.linear(duration: 1.0).repeatForever(autoreverses: true)) {
                        isActiveEffect.toggle()
                    }
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

この例では、`isActiveEffect`を使ってアニメーションのトリガーを行い、`onAppear`で無限リピートアニメーションを設定しています。`Animation.linear(duration: 1.0).repeatForever(autoreverses: true)`でアニメーションが自動的に繰り返されるように設定されています。これにより、指定した効果が無限にリピートされます。

---

## 👤 ユーザー
*2024/6/28 12:37:26*

symbolEffect に repeatの項目はないの？

---

## 🤖 アシスタント
*2024/6/28 12:37:33*

`symbolEffect` に直接リピートのオプションはありませんが、`Animation` と状態変数を組み合わせることで同様の効果を得ることができます。以下はその実装例です：

```swift
import SwiftUI

struct ContentView: View {
    @State private var isActiveEffect = false

    var body: some View {
        VStack {
            Image(systemName: "star.fill")
                .symbolEffect(.variableColor.iterative, value: isActiveEffect)
                .onAppear {
                    withAnimation(Animation.linear(duration: 1.0).repeatForever(autoreverses: true)) {
                        isActiveEffect.toggle()
                    }
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

この例では、`isActiveEffect`を使ってアニメーションのトリガーを行い、`onAppear`で無限リピートアニメーションを設定しています。`Animation.linear(duration: 1.0).repeatForever(autoreverses: true)`でアニメーションが自動的に繰り返されるように設定されています。

もし、シンボル効果にリピートオプションがあるかを公式ドキュメントやリリースノートで確認したい場合は、Apple の最新のドキュメントや SwiftUI リリースノートを参照することをお勧めします。

---
