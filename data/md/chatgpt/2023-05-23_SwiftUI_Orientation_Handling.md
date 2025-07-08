# SwiftUI Orientation Handling

日付: 2023-05-23

---

## 👤 ユーザー
*2023/05/23 10:00:48*

SwiftUI 画面横向き

---

## 🤖 アシスタント
*2023/05/23 10:00:53*

在SwiftUI中，你可以通过使用`@Environment`和`ViewModifier`来处理横向和纵向布局。下面是一个示例，展示如何在横向和纵向之间切换视图布局。

首先，你需要创建一个自定义的`ViewModifier`，用于在横向和纵向之间切换布局。这个`ViewModifier`会根据屏幕的宽度和高度决定应该使用哪种布局。

```swift
struct OrientationModifier: ViewModifier {
    @Environment(\.horizontalSizeClass) var horizontalSizeClass

    func body(content: Content) -> some View {
        content
            .rotationEffect(.degrees(horizontalSizeClass == .compact ? 90 : 0))
            .frame(width: UIScreen.main.bounds.width)
    }
}
```

接下来，在你的视图中应用这个`ViewModifier`。例如，你可以在主视图中使用`NavigationView`，并将其修饰为横向布局。

```swift
struct ContentView: View {
    var body: some View {
        NavigationView {
            VStack {
                Text("Hello, World!")
                    .font(.largeTitle)
                    .padding()
            }
            .navigationBarTitle("SwiftUI Demo")
        }
        .modifier(OrientationModifier())
    }
}
```

当设备处于横向模式时，视图会旋转90度并填满屏幕的宽度，实现横向布局。在纵向模式下，视图将保持原样。

---
