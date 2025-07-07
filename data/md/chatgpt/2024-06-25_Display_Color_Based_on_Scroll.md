# Display Color Based on Scroll

日付: 2024-06-25

---

## 👤 ユーザー
*2024/6/25 10:11:27*

これは画面の幅の大部分をバナーなのようなコンテンツで表示するスクロールViewである。このときに画面の大部分を覆っているカラー名を表示させたい。

struct ScrollDesignViewItem: Identifiable, Hashable {
    let id: String = UUID().uuidString
    let color: Color
}

// MARK: - View

public struct ScrollDesignView: View {
    @State private var items: \[ScrollDesignViewItem\] = \[.red, .blue, .green, .yellow, .pink, .purple\].compactMap { ScrollDesignViewItem(color: $0) }

    public var body: some View {
        ScrollView(.vertical) {
            if #available(iOS 17.0, \*) {
                VStack(alignment: .leading) {
                    Text("Simple (Not Paging)")
                        .padding(.horizontal)
                    SimpleScrollDesignView(items: items)
                        .padding(.bottom)
                    }}}

public struct SimpleScrollDesignView: View {
    let items: \[ScrollDesignViewItem\]

    public var body: some View {
        GeometryReader { geometry in
            ScrollView(.horizontal) {
                LazyHStack(spacing: 15) {
                    ForEach(items) { item in
                        RoundedRectangle(cornerRadius: 16)
                            .fill(item.color.gradient)
                            .frame(width: geometry.size.width - 60)
                    }
                }
                .padding(.horizontal, 32)
            }
            .scrollIndicators(.hidden)
        }
        .frame(height: 100)
    }
}

---

## 🤖 アシスタント
*2024/6/25 10:11:54*

To display the name of the color covering the majority of the screen width, you can use the `GeometryReader` to detect the position of each item and find which one is in the center of the screen. Then, display the color name accordingly.

Below is the modified code with this functionality implemented:

```swift
import SwiftUI

struct ScrollDesignViewItem: Identifiable, Hashable {
    let id: String = UUID().uuidString
    let color: Color
    let name: String
}

// MARK: - View

public struct ScrollDesignView: View {
    @State private var items: [ScrollDesignViewItem] = [
        ScrollDesignViewItem(color: .red, name: "Red"),
        ScrollDesignViewItem(color: .blue, name: "Blue"),
        ScrollDesignViewItem(color: .green, name: "Green"),
        ScrollDesignViewItem(color: .yellow, name: "Yellow"),
        ScrollDesignViewItem(color: .pink, name: "Pink"),
        ScrollDesignViewItem(color: .purple, name: "Purple")
    ]

    @State private var displayedColorName: String = "Red"

    public var body: some View {
        VStack(alignment: .leading) {
            Text("Simple (Not Paging)")
                .padding(.horizontal)
            Text("Displayed Color: \(displayedColorName)")
                .font(.headline)
                .padding(.horizontal)
            SimpleScrollDesignView(items: items, displayedColorName: $displayedColorName)
                .padding(.bottom)
        }
    }
}

public struct SimpleScrollDesignView: View {
    let items: [ScrollDesignViewItem]
    @Binding var displayedColorName: String

    public var body: some View {
        GeometryReader { geometry in
            ScrollView(.horizontal) {
                LazyHStack(spacing: 15) {
                    ForEach(items) { item in
                        GeometryReader { itemGeometry in
                            RoundedRectangle(cornerRadius: 16)
                                .fill(item.color.gradient)
                                .frame(width: geometry.size.width - 60)
                                .onAppear {
                                    updateDisplayedColor(geometry: itemGeometry, containerWidth: geometry.size.width, item: item)
                                }
                                .onChange(of: itemGeometry.frame(in: .global)) { _ in
                                    updateDisplayedColor(geometry: itemGeometry, containerWidth: geometry.size.width, item: item)
                                }
                        }
                        .frame(width: geometry.size.width - 60)
                    }
                }
                .padding(.horizontal, 32)
            }
            .scrollIndicators(.hidden)
        }
        .frame(height: 100)
    }

    private func updateDisplayedColor(geometry: GeometryProxy, containerWidth: CGFloat, item: ScrollDesignViewItem) {
        let itemCenterX = geometry.frame(in: .global).midX
        let screenCenterX = containerWidth / 2
        if abs(itemCenterX - screenCenterX) < containerWidth / 2 {
            DispatchQueue.main.async {
                displayedColorName = item.name
            }
        }
    }
}
```

### Explanation
1. **ScrollDesignViewItem**: Added a `name` property to store the color name.
2. **ScrollDesignView**: Introduced a `displayedColorName` state to keep track of the currently displayed color name.
3. **SimpleScrollDesignView**: 
    - Added a `GeometryReader` inside the `ForEach` loop to get the position of each item.
    - Used `onAppear` and `onChange` modifiers to call `updateDisplayedColor` whenever the item's position changes.
    - The `updateDisplayedColor` function checks if the item is at the center of the screen and updates the `displayedColorName` accordingly.

With these changes, the color name covering the majority of the screen width will be displayed above the scroll view.

---

## 👤 ユーザー
*2024/6/25 10:57:13*

以下についてもなにをtab表示しているかを表示してほしい

public struct PositionPagingTabView: View {
    let items: \[ScrollDesignViewItem\]

    public var body: some View {
        TabView {
            ForEach(items, id: \\.self) { item in
                RoundedRectangle(cornerRadius: 16)
                    .fill(item.color.gradient)
                    .frame(height: 100)
                    .padding(.horizontal, 32)
            }
        }
        .tabViewStyle(PageTabViewStyle(indexDisplayMode: .never))
        .frame(height: 100)
    }
}

---

## 🤖 アシスタント
*2024/6/25 10:57:26*

To display the name of the currently visible tab in the `PositionPagingTabView`, you can use a state variable to keep track of the selected tab and display its name above the `TabView`.

Here is the modified `PositionPagingTabView` implementation:

```swift
import SwiftUI

public struct PositionPagingTabView: View {
    let items: [ScrollDesignViewItem]
    @State private var selectedIndex: Int = 0

    public var body: some View {
        VStack {
            Text("Displayed Tab: \(items[selectedIndex].name)")
                .font(.headline)
                .padding(.horizontal)
            TabView(selection: $selectedIndex) {
                ForEach(items.indices, id: \.self) { index in
                    RoundedRectangle(cornerRadius: 16)
                        .fill(items[index].color.gradient)
                        .frame(height: 100)
                        .padding(.horizontal, 32)
                        .tag(index)
                }
            }
            .tabViewStyle(PageTabViewStyle(indexDisplayMode: .never))
            .frame(height: 100)
        }
    }
}
```

### Explanation
1. **State Variable**: Added a `selectedIndex` state variable to keep track of the currently selected tab.
2. **Displayed Tab Text**: Added a `Text` view above the `TabView` to display the name of the currently visible tab.
3. **TabView Selection**: Set the `TabView` selection to bind with the `selectedIndex` state variable and tagged each tab with its index.

This will display the name of the currently visible tab above the `TabView`.

---

## 👤 ユーザー
*2024/6/25 11:02:08*

ちなみに TabViewの次のコンテンツを少しだけ表示されることは可能なのか？

---

## 🤖 アシスタント
*2024/6/25 11:02:44*

Yes, it is possible to slightly reveal the next tab in a `TabView` by customizing the `TabView` style. While `TabView` does not support this directly, you can achieve a similar effect by using a `ScrollView` with horizontal paging enabled and manually managing the snap points.

Here's an example of how you can create a custom paginated view that reveals a bit of the next tab:

```swift
import SwiftUI

struct PositionPagingTabView: View {
    let items: [ScrollDesignViewItem]
    @State private var displayedIndex: Int = 0

    public var body: some View {
        VStack {
            Text("Displayed Tab: \(items[displayedIndex].name)")
                .font(.headline)
                .padding(.horizontal)
            GeometryReader { geometry in
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 20) { // Adjust spacing to control how much of the next item is shown
                        ForEach(items.indices, id: \.self) { index in
                            GeometryReader { itemGeometry in
                                RoundedRectangle(cornerRadius: 16)
                                    .fill(items[index].color.gradient)
                                    .frame(width: geometry.size.width * 0.8) // Adjust width to show part of the next item
                                    .onAppear {
                                        updateDisplayedIndex(itemGeometry: itemGeometry, containerWidth: geometry.size.width, index: index)
                                    }
                                    .onChange(of: itemGeometry.frame(in: .global)) { _ in
                                        updateDisplayedIndex(itemGeometry: itemGeometry, containerWidth: geometry.size.width, index: index)
                                    }
                            }
                            .frame(width: geometry.size.width * 0.8) // Adjust width to show part of the next item
                        }
                    }
                    .padding(.horizontal, (geometry.size.width * 0.1) - 10) // Adjust padding to center the items
                }
                .content.offset(x: -CGFloat(displayedIndex) * geometry.size.width * 0.8) // Adjust offset to keep the centered item in view
                .gesture(
                    DragGesture()
                        .onEnded { value in
                            let threshold = geometry.size.width * 0.4
                            if value.translation.width < -threshold {
                                displayedIndex = min(displayedIndex + 1, items.count - 1)
                            } else if value.translation.width > threshold {
                                displayedIndex = max(displayedIndex - 1, 0)
                            }
                        }
                )
            }
            .frame(height: 100)
        }
    }

    private func updateDisplayedIndex(itemGeometry: GeometryProxy, containerWidth: CGFloat, index: Int) {
        let itemCenterX = itemGeometry.frame(in: .global).midX
        let screenCenterX = containerWidth / 2
        if abs(itemCenterX - screenCenterX) < containerWidth * 0.4 {
            DispatchQueue.main.async {
                displayedIndex = index
            }
        }
    }
}

struct ScrollDesignViewItem: Identifiable, Hashable {
    let id: String = UUID().uuidString
    let color: Color
    let name: String
}

struct ContentView: View {
    let items: [ScrollDesignViewItem] = [
        ScrollDesignViewItem(color: .red, name: "Red"),
        ScrollDesignViewItem(color: .blue, name: "Blue"),
        ScrollDesignViewItem(color: .green, name: "Green"),
        ScrollDesignViewItem(color: .yellow, name: "Yellow"),
        ScrollDesignViewItem(color: .pink, name: "Pink"),
        ScrollDesignViewItem(color: .purple, name: "Purple")
    ]

    var body: some View {
        PositionPagingTabView(items: items)
    }
}

@main
struct MyApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

### Explanation:
1. **GeometryReader and ScrollView**: We use a `GeometryReader` to determine the size of the container and a horizontal `ScrollView` to enable horizontal scrolling.
2. **HStack**: Inside the `ScrollView`, we use an `HStack` to arrange the items horizontally.
3. **Width and Padding Adjustments**: By adjusting the width of each item and adding padding to the `HStack`, we ensure that a part of the next item is always visible.
4. **Drag Gesture**: We add a `DragGesture` to handle manual paging, updating the `displayedIndex` based on the drag distance.
5. **updateDisplayedIndex**: This function updates the currently displayed index based on the item's position within the `GeometryReader`.

This setup achieves a paginated view that reveals a part of the next tab, giving a peek into the next item.

---
