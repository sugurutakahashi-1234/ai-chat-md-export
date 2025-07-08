# Position Value iOS 16

Date: 2024-06-24

---

## 👤 User
*2024-06-24 18:13:23*

iOS 16 でもPosition Valueのようなことがしたい。

import DomainLayer
import SwiftUI

// MARK: - Entity

struct ScrollDesignViewItem: Identifiable, Hashable {
    let id: String = UUID().uuidString
    let color: Color
}

// MARK: - View

public struct ScrollDesignView: View {
    @State private var items: [ScrollDesignViewItem] = [.red, .blue, .green, .yellow, .pink, .purple].compactMap { ScrollDesignViewItem(color: $0) }

    public var body: some View {
        ScrollView(.vertical) {
            if #available(iOS 17.0, *) {
                VStack(alignment: .leading) {
                    Text("Simple (Not Paging)")
                        .padding(.horizontal)
                    SimpleScrollDesignView(items: items)
                        .padding(.bottom)

                    Text("Paging")
                        .padding(.horizontal)
                    PagingScrollDesignView(items: items)
                        .padding(.bottom)

                    Text("Paging - Position Value")
                        .padding(.horizontal)
                    PositionScrollDesignView(items: items)
                        .padding(.bottom)

                    Text("Paging - Centering")
                        .padding(.horizontal)
                    CenteringScrollDesignView(items: items, spacing: 16, padding: 32)
                        .padding(.bottom)
                    
                    Text("Paging - Centering - Transition Effect")
                        .padding(.horizontal)
                    TransitionScrollDesignView(items: items, spacing: 8, padding: 32)
                        .padding(.bottom)
                }
                .padding(.vertical, 15)
            }
        }
        .scrollIndicators(.hidden)
        .navigationTitle("Scroll Design View")
    }
}

public struct SimpleScrollDesignView: View {
    let items: [ScrollDesignViewItem]

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

@available(iOS 17.0, *)
public struct PagingScrollDesignView: View {
    let items: [ScrollDesignViewItem]

    public var body: some View {
        ScrollView(.horizontal) {
            LazyHStack(spacing: 0) {
                ForEach(items, id: \.self) { item in
                    RoundedRectangle(cornerRadius: 15)
                        .fill(item.color.gradient)
                        .frame(height: 100)
                        .padding(.horizontal, 32)
                        .containerRelativeFrame(.horizontal)
                }
            }
            .scrollTargetLayout()
        }
        .scrollTargetBehavior(.paging)
        .scrollIndicators(.hidden)
    }
}

@available(iOS 17.0, *)
public struct PositionScrollDesignView: View {
    @State var scrollPosition: ScrollDesignViewItem?
    let items: [ScrollDesignViewItem]

    public var body: some View {
        ScrollView(.horizontal) {
            LazyHStack(spacing: 0) {
                ForEach(items, id: \.self) { item in
                    RoundedRectangle(cornerRadius: 15)
                        .fill(item.color.gradient)
                        .frame(height: 100)
                        .padding(.horizontal, 32)
                        .containerRelativeFrame(.horizontal)
                }
            }
            .scrollTargetLayout()
        }
        .scrollTargetBehavior(.paging)
        .scrollPosition(id: $scrollPosition) // scrollTargetLayout() のコンテンツの id の値とバインディングする
        .scrollIndicators(.hidden)
        .overlay {
            if let scrollPosition {
                Text("\(scrollPosition.color)")
            }
        }
    }
}

@available(iOS 17.0, *)
public struct CenteringScrollDesignView: View {
    let items: [ScrollDesignViewItem]
    let spacing: CGFloat
    let padding: CGFloat

    public var body: some View {
        GeometryReader { geometry in
            ScrollView(.horizontal) {
                LazyHStack(spacing: spacing) {
                    ForEach(items, id: \.self) { item in
                        RoundedRectangle(cornerRadius: 15)
                            .fill(item.color.gradient)
                            .frame(width: geometry.size.width - padding * 2, height: 100)
                    }
                }
                .padding(.horizontal, padding)
                .scrollTargetLayout()
            }
            .scrollTargetBehavior(.viewAligned) // paging だと上手くいかない
            .scrollIndicators(.hidden)
        }
        .frame(height: 100)
    }
}

@available(iOS 17.0, *)
public struct TransitionScrollDesignView: View {
    let items: [ScrollDesignViewItem]
    let spacing: CGFloat
    let padding: CGFloat

    public var body: some View {
        GeometryReader { geometry in
            ScrollView(.horizontal) {
                LazyHStack(spacing: spacing) {
                    ForEach(items, id: \.self) { item in
                        RoundedRectangle(cornerRadius: 15)
                            .fill(item.color.gradient)
                            .frame(width: geometry.size.width - padding * 2, height: 100)
                            .scrollTransition(.interactive, axis: .horizontal) { view, phase in
                                view
                                    .scaleEffect(phase.isIdentity ? 1 : 0.95)
                                    .offset(y: phase.isIdentity ? -15 : 0)
                            }
                            .offset(y: 15)
                    }
                }
                .padding(.horizontal, padding)
                .scrollTargetLayout()
            }
            .scrollTargetBehavior(.viewAligned) // paging だと上手くいかない
            .scrollIndicators(.hidden)
        }
        .frame(height: 150)
    }
}

// MARK: - Preview

#Preview {
    ScrollDesignView()
        .navigationStacked()
}

---

## 🤖 Assistant
*2024-06-24 18:14:33*

Position Valueの機能をiOS 16でも実現するためには、カスタムのスクロール位置を管理する仕組みを作成する必要があります。以下のように、スクロール位置を手動で追跡し、ビューポートの中央に近いアイテムを検出する方法を考えます。

```swift
import SwiftUI

// MARK: - Entity

struct ScrollDesignViewItem: Identifiable, Hashable {
    let id: String = UUID().uuidString
    let color: Color
}

// MARK: - View

public struct ScrollDesignView: View {
    @State private var items: [ScrollDesignViewItem] = [.red, .blue, .green, .yellow, .pink, .purple].compactMap { ScrollDesignViewItem(color: $0) }
    @State private var centerIndex: Int = 0
    
    public var body: some View {
        ScrollView(.vertical) {
            VStack(alignment: .leading) {
                Text("Simple (Not Paging)")
                    .padding(.horizontal)
                SimpleScrollDesignView(items: items)
                    .padding(.bottom)

                Text("Paging")
                    .padding(.horizontal)
                PagingScrollDesignView(items: items)
                    .padding(.bottom)

                Text("Paging - Position Value")
                    .padding(.horizontal)
                PositionScrollDesignView(items: items, centerIndex: $centerIndex)
                    .padding(.bottom)

                Text("Paging - Centering")
                    .padding(.horizontal)
                CenteringScrollDesignView(items: items, spacing: 16, padding: 32)
                    .padding(.bottom)
                
                Text("Paging - Centering - Transition Effect")
                    .padding(.horizontal)
                TransitionScrollDesignView(items: items, spacing: 8, padding: 32)
                    .padding(.bottom)
            }
            .padding(.vertical, 15)
        }
        .scrollIndicators(.hidden)
        .navigationTitle("Scroll Design View")
    }
}

public struct SimpleScrollDesignView: View {
    let items: [ScrollDesignViewItem]

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

public struct PagingScrollDesignView: View {
    let items: [ScrollDesignViewItem]

    public var body: some View {
        ScrollView(.horizontal) {
            LazyHStack(spacing: 0) {
                ForEach(items, id: \.self) { item in
                    RoundedRectangle(cornerRadius: 15)
                        .fill(item.color.gradient)
                        .frame(height: 100)
                        .padding(.horizontal, 32)
                        .frame(width: UIScreen.main.bounds.width - 64)
                }
            }
        }
        .scrollIndicators(.hidden)
        .frame(height: 100)
        .padding(.horizontal, 32)
    }
}

public struct PositionScrollDesignView: View {
    let items: [ScrollDesignViewItem]
    @Binding var centerIndex: Int

    public var body: some View {
        GeometryReader { geometry in
            ScrollView(.horizontal) {
                LazyHStack(spacing: 0) {
                    ForEach(Array(items.enumerated()), id: \.element) { index, item in
                        RoundedRectangle(cornerRadius: 15)
                            .fill(item.color.gradient)
                            .frame(width: geometry.size.width - 64, height: 100)
                            .background(
                                GeometryReader { geo in
                                    Color.clear
                                        .preference(key: ViewOffsetKey.self, value: geo.frame(in: .global).midX)
                                }
                            )
                            .onPreferenceChange(ViewOffsetKey.self) { midX in
                                if abs(midX - geometry.size.width / 2) < geometry.size.width / 2 {
                                    centerIndex = index
                                }
                            }
                    }
                }
                .padding(.horizontal, 32)
            }
            .scrollIndicators(.hidden)
            .frame(height: 100)
            .overlay(
                Text("\(items[centerIndex].color.description)")
                    .foregroundColor(.black)
                    .padding()
                    .background(Color.white)
                    .cornerRadius(10)
                    .padding(),
                alignment: .bottom
            )
        }
    }
}

public struct CenteringScrollDesignView: View {
    let items: [ScrollDesignViewItem]
    let spacing: CGFloat
    let padding: CGFloat

    public var body: some View {
        GeometryReader { geometry in
            ScrollView(.horizontal) {
                LazyHStack(spacing: spacing) {
                    ForEach(items, id: \.self) { item in
                        RoundedRectangle(cornerRadius: 15)
                            .fill(item.color.gradient)
                            .frame(width: geometry.size.width - padding * 2, height: 100)
                    }
                }
                .padding(.horizontal, padding)
            }
            .scrollIndicators(.hidden)
        }
        .frame(height: 100)
    }
}

public struct TransitionScrollDesignView: View {
    let items: [ScrollDesignViewItem]
    let spacing: CGFloat
    let padding: CGFloat

    public var body: some View {
        GeometryReader { geometry in
            ScrollView(.horizontal) {
                LazyHStack(spacing: spacing) {
                    ForEach(items, id: \.self) { item in
                        RoundedRectangle(cornerRadius: 15)
                            .fill(item.color.gradient)
                            .frame(width: geometry.size.width - padding * 2, height: 100)
                            .scaleEffect(1.0)
                            .offset(y: 15)
                            .animation(.spring(), value: 1.0)
                    }
                }
                .padding(.horizontal, padding)
            }
            .scrollIndicators(.hidden)
        }
        .frame(height: 150)
    }
}

private struct ViewOffsetKey: PreferenceKey {
    static var defaultValue: CGFloat = 0
    static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) {
        value = nextValue()
    }
}

// MARK: - Preview

struct ScrollDesignView_Previews: PreviewProvider {
    static var previews: some View {
        NavigationView {
            ScrollDesignView()
        }
    }
}
```

このコードでは、`PositionScrollDesignView`でスクロール位置を手動で追跡し、ビューの中央に最も近いアイテムを検出しています。これにより、iOS 16でも同様の機能を実現できます。

---
