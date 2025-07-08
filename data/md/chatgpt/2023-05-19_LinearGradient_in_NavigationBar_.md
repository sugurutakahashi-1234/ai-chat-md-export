# LinearGradient in NavigationBar.

日付: 2023-05-19

---

## 👤 ユーザー
*2023/05/20 01:33:53*

I want to set a LinearGradient gradient as the background of the navigation bar in my SwiftUI app.

---

## 🤖 アシスタント
*2023/05/20 01:34:35*

In SwiftUI, as of my knowledge cutoff in September 2021, you can't directly apply a gradient background to a `NavigationView` or `NavigationBar`. However, you can use some workarounds to achieve this effect.

Here is an example using a `ZStack`:

```swift
import SwiftUI

struct ContentView: View {
    var body: some View {
        ZStack {
            LinearGradient(gradient: Gradient(colors: [.red, .blue]), startPoint: .top, endPoint: .bottom)
                .edgesIgnoringSafeArea(.all)

            NavigationView {
                ScrollView {
                    ForEach(0..<100) { i in
                        Text("Item \(i)")
                    }
                }
                .navigationBarTitle("Gradient Navigation Bar", displayMode: .inline)
                .background(Color.clear) // Important
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

In this code:

1. We create a `ZStack` that layers views on top of each other. 

2. We use `LinearGradient` to create a gradient from red to blue, starting from the top and ending at the bottom of the screen. We make this gradient ignore all safe areas to ensure it covers the entire screen.

3. We then create a `NavigationView` with a `ScrollView` that lists some items.

4. The `.background(Color.clear)` modifier is important here because it makes the background of the `NavigationView` transparent, allowing the gradient to show through.

Remember that this is a workaround and might not work in all cases. In future versions of SwiftUI, Apple might provide a more straightforward way to change the navigation bar background. Always refer to the latest SwiftUI documentation to stay up to date.

---
