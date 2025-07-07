# SwiftUI AsyncImageErrorView Instructions

日付: 2024-07-04

---

## 👤 ユーザー
*2024/7/4 16:39:15*

struct AsyncImageErrorView: View {
    let retryAction: (() -&gt; Void)? = nil

    var body: some View {
        Rectangle()
            .fill(Color.gray.opacity(0.5))
            .overlay {
                VStack(spacing: 8) {
                    Label {
                        Text("取得エラー")
                    } icon: {
                        SFSymbols.exclamationmarkTriangleFill.image
                    }

                    if let retryAction = retryAction {
                        Button {
                            retryAction()
                        } label: {
                            Label {
                                Text("リトライ")
                            } icon: {
                                // Previewでは確認できるが実機だとアイコンが消える（なぞ）
                                SFSymbols.arrowClockwise.image
                            }
                        }
                    }
                }
                .padding()
            }
            .clipped()
    }
}
使い方を教えてほしい

---

## 🤖 アシスタント
*2024/7/4 16:39:41*

`AsyncImageErrorView` is a SwiftUI view component designed to display an error message when an image fails to load. It includes an optional retry button that executes a given action when pressed. Below is an example of how to use this view in a SwiftUI application:

1. **Define the Retry Action:**
   Create a function that will handle the retry logic. This could be a network request to fetch the image again.

2. **Use `AsyncImageErrorView` in Your View:**
   Incorporate the `AsyncImageErrorView` into your existing SwiftUI view hierarchy, passing the retry action if needed.

Here's a complete example of how you might use `AsyncImageErrorView`:

```swift
import SwiftUI

struct ContentView: View {
    @State private var showError = false

    var body: some View {
        VStack {
            if showError {
                AsyncImageErrorView(retryAction: retryFetchImage)
            } else {
                // Replace with your image view
                Text("Image successfully loaded")
                    .onAppear(perform: fetchImage)
            }
        }
        .padding()
    }

    func fetchImage() {
        // Simulate an image fetch that fails
        DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
            self.showError = true
        }
    }

    func retryFetchImage() {
        // Simulate retry logic
        self.showError = false
        fetchImage()
    }
}

struct AsyncImageErrorView: View {
    let retryAction: (() -> Void)?

    var body: some View {
        Rectangle()
            .fill(Color.gray.opacity(0.5))
            .overlay {
                VStack(spacing: 8) {
                    Label {
                        Text("取得エラー")
                    } icon: {
                        Image(systemName: "exclamationmark.triangle.fill")
                            .foregroundColor(.red)
                    }

                    if let retryAction = retryAction {
                        Button {
                            retryAction()
                        } label: {
                            Label {
                                Text("リトライ")
                            } icon: {
                                Image(systemName: "arrow.clockwise")
                            }
                        }
                    }
                }
                .padding()
            }
            .clipped()
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
```

### Explanation:
1. **ContentView:**
   - This is the main view where the error view might be used.
   - It uses a state variable `showError` to determine whether to show the error view or the actual content.
   - The `fetchImage` function simulates an image fetch process that fails after 2 seconds.
   - The `retryFetchImage` function resets the error state and attempts to fetch the image again.

2. **AsyncImageErrorView:**
   - A custom view that displays an error message and an optional retry button.
   - If a `retryAction` is provided, it shows the button and binds the action to it.

This setup ensures that your error view is displayed when an image fetch fails and provides a way to retry the action.

---

## 👤 ユーザー
*2024/7/4 16:41:47*

AsyncImageErrorView { \_ in } だったり書けない

---

## 🤖 アシスタント
*2024/7/4 16:42:10*

To make `AsyncImageErrorView` more flexible and allow usage like `AsyncImageErrorView { }`, you can update the initializer to accept a closure for the retry action. Here is the revised `AsyncImageErrorView` and an example of its usage:

### Revised `AsyncImageErrorView`

```swift
struct AsyncImageErrorView: View {
    let retryAction: (() -> Void)?

    init(retryAction: (() -> Void)? = nil) {
        self.retryAction = retryAction
    }

    var body: some View {
        Rectangle()
            .fill(Color.gray.opacity(0.5))
            .overlay {
                VStack(spacing: 8) {
                    Label {
                        Text("取得エラー")
                    } icon: {
                        Image(systemName: "exclamationmark.triangle.fill")
                            .foregroundColor(.red)
                    }

                    if let retryAction = retryAction {
                        Button {
                            retryAction()
                        } label: {
                            Label {
                                Text("リトライ")
                            } icon: {
                                Image(systemName: "arrow.clockwise")
                            }
                        }
                    }
                }
                .padding()
            }
            .clipped()
    }
}
```

### Usage Example

Here's how you can use the updated `AsyncImageErrorView`:

```swift
import SwiftUI

struct ContentView: View {
    @State private var showError = false

    var body: some View {
        VStack {
            if showError {
                AsyncImageErrorView(retryAction: retryFetchImage)
            } else {
                // Replace with your image view
                Text("Image successfully loaded")
                    .onAppear(perform: fetchImage)
            }
        }
        .padding()
    }

    func fetchImage() {
        // Simulate an image fetch that fails
        DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
            self.showError = true
        }
    }

    func retryFetchImage() {
        // Simulate retry logic
        self.showError = false
        fetchImage()
    }
}

struct AsyncImageErrorView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
```

### Usage with Empty Closure

You can now instantiate `AsyncImageErrorView` with an empty closure or without a closure at all:

```swift
struct AnotherView: View {
    var body: some View {
        AsyncImageErrorView {
            // Empty closure, do nothing
        }
    }
}

struct YetAnotherView: View {
    var body: some View {
        AsyncImageErrorView()
    }
}
```

This approach allows for flexibility in providing the retry action as needed.

---
