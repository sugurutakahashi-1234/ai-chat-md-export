# SwiftUI SFSymbols Slider 示例

日付: 2024-05-21

---

## 👤 ユーザー
*2024/05/21 14:38:21*

SwiftUI の SFSymbols で　variableValue とスライダーを使ったサンプル

---

## 🤖 アシスタント
*2024/05/21 14:38:40*

以下は、SwiftUI で `SFSymbols` の `variableValue` とスライダーを使ったサンプルコードです。このコードでは、スライダーの値に応じて `SFSymbols` のアイコンが変化する様子を示しています。

```swift
import SwiftUI

struct ContentView: View {
    @State private var sliderValue: Double = 0.0

    var body: some View {
        VStack {
            Image(systemName: "thermometer")
                .symbolVariant(.fill)
                .symbolRenderingMode(.palette)
                .foregroundStyle(.red, .gray)
                .imageScale(.large)
                .font(.system(size: 100))
                .variableValue(sliderValue)
                .padding()

            Slider(value: $sliderValue, in: 0...1)
                .padding()
        }
    }
}

@main
struct VariableValueApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

### 説明
1. **`Image` View**: `SFSymbols` のアイコンを表示します。ここでは `thermometer` アイコンを使用しています。
    - `.symbolVariant(.fill)`: アイコンを塗りつぶしバージョンにします。
    - `.symbolRenderingMode(.palette)`: パレットレンダリングモードを使用し、複数の色を設定可能にします。
    - `.foregroundStyle(.red, .gray)`: アイコンの前景色を赤と灰色に設定します。
    - `.imageScale(.large)`: アイコンのスケールを大きくします。
    - `.font(.system(size: 100))`: アイコンのサイズを指定します。
    - `.variableValue(sliderValue)`: スライダーの値に基づいてアイコンの変化を制御します。

2. **`Slider` View**: スライダーを表示し、その値を `sliderValue` にバインドします。
    - `value: $sliderValue`: スライダーの値を `sliderValue` にバインドします。
    - `in: 0...1`: スライダーの範囲を 0 から 1 に設定します。
    - `.padding()`: スライダーにパディングを追加します。

このサンプルでは、スライダーを動かすと `thermometer` アイコンの状態が変化します。他の `SFSymbols` のアイコンも同様に使用できます。

---

## 👤 ユーザー
*2024/05/21 14:39:23*

variableValue はそこであっている？iOS17の情報を取得してほしい

---

## 🤖 アシスタント
*2024/05/21 14:39:38*

In iOS 17, SwiftUI introduced new features for working with SF Symbols, including enhanced support for variable values and symbol effects. Here's an updated example demonstrating how to use a slider to control an SF Symbol's variable value:

```swift
import SwiftUI

struct ContentView: View {
    @State private var sliderValue: Double = 0.0

    var body: some View {
        VStack {
            Image(systemName: "wifi")
                .symbolRenderingMode(.palette)
                .foregroundStyle(.blue, .gray)
                .imageScale(.large)
                .font(.system(size: 100))
                .symbolEffect(.variableValue, value: sliderValue)
                .padding()

            Slider(value: $sliderValue, in: 0...1)
                .padding()
        }
    }
}

@main
struct VariableValueApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

### Explanation
1. **`Image` View**: This displays the SF Symbol. The `symbolEffect` modifier with the `.variableValue` effect is used to animate the symbol based on the slider value.
    - `.symbolRenderingMode(.palette)`: Enables multi-color rendering for the symbol.
    - `.foregroundStyle(.blue, .gray)`: Sets the foreground colors.
    - `.symbolEffect(.variableValue, value: sliderValue)`: Animates the symbol based on the `sliderValue`.

2. **`Slider` View**: The slider's value is bound to `sliderValue`, which controls the variable value of the symbol.

### Additional Enhancements
- **Symbol Effects**: iOS 17 introduces various built-in symbol effects such as Bounce, Pulse, and Variable Color. You can use these effects to add animations to your symbols (e.g., `.symbolEffect(.bounce, value: animate)` for a bounce effect)【8†source】【9†source】.

By leveraging these new features, you can create more dynamic and visually appealing interfaces in your SwiftUI applications. For more detailed information, you can refer to the official Apple documentation and relevant tutorials on SwiftUI symbol effects.

---
