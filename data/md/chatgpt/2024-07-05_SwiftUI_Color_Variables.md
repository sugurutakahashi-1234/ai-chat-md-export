# SwiftUI Color Variables

日付: 2024-07-05

---

## 👤 ユーザー
*2024/07/05 19:19:37*

SwiftUIでシステムに合わせた色にしたいそして、基本は白の色の変数名は？

---

## 🤖 アシスタント
*2024/07/05 19:19:45*

SwiftUIでシステムの色に合わせて基本的に白を使用する色の変数名として、次のような名前が考えられます：

```swift
let systemAdaptiveWhite: Color = .white
```

この名前は、システムに適応し、基本的には白を表すことを示しています。また、システムモード（ライトモードやダークモード）に応じて色を変更する場合には、次のようにすることもできます：

```swift
let systemAdaptiveColor: Color = Color(UIColor { traitCollection in
    traitCollection.userInterfaceStyle == .dark ? .black : .white
})
```

このようにすると、システムモードに合わせて白または黒に色を適応させることができます。

---

## 👤 ユーザー
*2024/07/05 19:19:55*

標準で用意されていないの？

---

## 🤖 アシスタント
*2024/07/05 19:20:09*

はい、SwiftUIにはシステムのカラーに合わせて自動的に適応する色がいくつか用意されています。標準で提供されている色を使用することで、システムのライトモードとダークモードに対応することができます。例えば、次のような色が標準で用意されています：

- `Color.primary`: システムの主要なテキスト色（ライトモードでは黒、ダークモードでは白）
- `Color.secondary`: システムの二次テキスト色
- `Color.accentColor`: アクセントカラー
- `Color(UIColor.systemBackground)`: システムの背景色（ライトモードでは白、ダークモードでは黒）

もし、基本的に白を使用し、システムのモードに適応する場合、`Color(UIColor.systemBackground)` が便利です。これは、システムのモードに応じて背景色を自動的に調整します。

具体的な例として、背景色を設定する場合は次のようにできます：

```swift
let adaptiveBackgroundColor: Color = Color(UIColor.systemBackground)
```

この色は、システムのライトモードでは白、ダークモードでは黒に適応します。他の標準色も同様に使用することができます。

```swift
let primaryColor: Color = .primary
let secondaryColor: Color = .secondary
```

これにより、システムに合わせた色の適応が簡単にできます。

---

## 👤 ユーザー
*2024/07/05 19:22:59*

.background(.systemBackground) こんな感じで使いたい

---

## 🤖 アシスタント
*2024/07/05 19:23:12*

SwiftUIでは、`Color`に対するシステムの背景色を使う場合、直接`.background`に設定することができます。以下のように記述します：

```swift
.background(Color(UIColor.systemBackground))
```

例えば、以下のように使用できます：

```swift
import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack {
            Text("Hello, World!")
                .padding()
                .background(Color(UIColor.systemBackground))
        }
        .background(Color(UIColor.systemBackground))
        .edgesIgnoringSafeArea(.all)
    }
}
```

このコードでは、`VStack`とその内部の`Text`の背景色をシステムの背景色に設定しています。このようにすることで、ライトモードでは白、ダークモードでは黒に適応する背景色を簡単に適用できます。

他の例として、カスタムのビュー修飾子を作成して再利用することもできます：

```swift
import SwiftUI

extension View {
    func systemBackground() -> some View {
        self.background(Color(UIColor.systemBackground))
    }
}

struct ContentView: View {
    var body: some View {
        VStack {
            Text("Hello, World!")
                .padding()
                .systemBackground()
        }
        .systemBackground()
        .edgesIgnoringSafeArea(.all)
    }
}
```

このカスタム修飾子を使用することで、コードの再利用性が向上し、システムの背景色を簡単に設定できます。

---
