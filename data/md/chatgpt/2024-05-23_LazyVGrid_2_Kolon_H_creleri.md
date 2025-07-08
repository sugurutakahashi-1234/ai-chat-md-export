# LazyVGrid 2 Kolon Hücreleri

日付: 2024-05-23

---

## 👤 ユーザー
*2024/05/23 12:21:30*

LazyVGrid で 以下の TalkBoxの配列を2列で表現したい

public struct TalkBox: Identifiable {
    public let id: String
    public let order: Int
    public let imageUrl: URL
    
    public init(id: String, order: Int, imageUrl: URL) {
        self.id = id
        self.order = order
        self.imageUrl = imageUrl
    }
}

extension TalkBox: RandomValueProvider {
    public static var random: TalkBox {
        .init(id: .uuid, order: .random, imageUrl: .randomImageUrl)
    }
}

---

## 🤖 アシスタント
*2024/05/23 12:21:48*

To display a `LazyVGrid` with `TalkBox` items in two columns, you can use SwiftUI's `LazyVGrid` and define a two-column grid layout. Below is an example implementation to help you achieve this:

First, ensure you have an array of `TalkBox` items to display. Then, define your `LazyVGrid` within a SwiftUI `View`. Here's how you can do it:

```swift
import SwiftUI

// Define the TalkBox structure
public struct TalkBox: Identifiable {
    public let id: String
    public let order: Int
    public let imageUrl: URL
    
    public init(id: String, order: Int, imageUrl: URL) {
        self.id = id
        self.order = order
        self.imageUrl = imageUrl
    }
}

extension TalkBox: RandomValueProvider {
    public static var random: TalkBox {
        .init(id: UUID().uuidString, order: Int.random(in: 1...100), imageUrl: URL(string: "https://via.placeholder.com/150")!)
    }
}

// Define the view to display TalkBox items in a LazyVGrid
struct TalkBoxGridView: View {
    let talkBoxes: [TalkBox]

    var body: some View {
        let columns = [
            GridItem(.flexible()),
            GridItem(.flexible())
        ]
        
        ScrollView {
            LazyVGrid(columns: columns, spacing: 20) {
                ForEach(talkBoxes) { talkBox in
                    VStack {
                        // Replace with your actual image fetching logic
                        AsyncImage(url: talkBox.imageUrl) { image in
                            image.resizable()
                                .aspectRatio(contentMode: .fill)
                                .frame(width: 100, height: 100)
                                .clipped()
                        } placeholder: {
                            ProgressView()
                        }
                        Text("Order: \(talkBox.order)")
                    }
                    .padding()
                    .background(Color.gray.opacity(0.2))
                    .cornerRadius(8)
                }
            }
            .padding()
        }
    }
}

// Preview for testing
struct TalkBoxGridView_Previews: PreviewProvider {
    static var previews: some View {
        TalkBoxGridView(talkBoxes: Array(repeating: TalkBox.random, count: 10))
    }
}
```

In this example, the `TalkBoxGridView` takes an array of `TalkBox` items and displays them in a `LazyVGrid` with two columns. The `AsyncImage` view is used to load images from URLs asynchronously (available in iOS 15 and later). You can replace the `AsyncImage` logic with your preferred image loading approach if needed.

This code will create a grid of `TalkBox` items with each item showing an image and the order number, arranged in two columns with flexible spacing.

---
