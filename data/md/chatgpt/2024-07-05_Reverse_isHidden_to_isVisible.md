# Reverse isHidden to isVisible

日付: 2024-07-05

---

## 👤 ユーザー
*2024/7/5 15:28:51*

isHidden の 逆を作って欲しい

public extension View {
    /// Hide or show the view based on a boolean value.
    ///
    /// Example for visibility:
    ///
    ///     Text("Label")
    ///         .isHidden(true)
    ///
    /// Example for complete removal:
    ///
    ///     Text("Label")
    ///         .isHidden(true, remove: true)
    ///
    /// - Parameters:
    ///   - hidden: Set to `false` to show the view. Set to `true` to hide the view.
    ///   - remove: Boolean value indicating whether or not to remove the view.
    ///
    /// - seeAlso: https://stackoverflow.com/questions/56490250/dynamically-hiding-view-in-swiftui
    @MainActor @ViewBuilder
    func isHidden(_ hidden: Bool, shouldRemove: Bool = false) -&gt; some View {
        if hidden {
            if !shouldRemove {
                self.hidden()
            }
        } else {
            self
        }
    }
}

---

## 🤖 アシスタント
*2024/7/5 15:29:02*

To create the reverse functionality of `isHidden`, which would be a `isVisible` modifier, you can use the same logic but with the condition reversed. Here is how you can implement it:

```swift
public extension View {
    /// Show or hide the view based on a boolean value.
    ///
    /// Example for visibility:
    ///
    ///     Text("Label")
    ///         .isVisible(true)
    ///
    /// Example for complete removal:
    ///
    ///     Text("Label")
    ///         .isVisible(true, remove: true)
    ///
    /// - Parameters:
    ///   - visible: Set to `true` to show the view. Set to `false` to hide the view.
    ///   - remove: Boolean value indicating whether or not to remove the view.
    ///
    @MainActor @ViewBuilder
    func isVisible(_ visible: Bool, shouldRemove: Bool = false) -> some View {
        if visible {
            self
        } else {
            if !shouldRemove {
                self.hidden()
            }
        }
    }
}
```

This `isVisible` extension will show or hide the view based on the `visible` boolean parameter. If `visible` is `true`, the view will be shown. If `visible` is `false`, the view will be hidden or removed based on the `shouldRemove` parameter.

---
