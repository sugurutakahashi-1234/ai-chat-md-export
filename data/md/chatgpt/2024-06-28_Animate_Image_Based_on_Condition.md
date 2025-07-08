# Animate Image Based on Condition

日付: 2024-06-28

---

## 👤 ユーザー
*2024/06/28 12:43:40*

以下をisZero ではないときにずっと動かし続けたい

SFSymbols.waveform.image
                            .resizable()
                            .scaledToFit()
                            .frame(width: 100, height: 100)
                            .symbolEffect(.variableColor.iterative, value: !presenter.recordingVolumeLevel.isZero)

---

## 🤖 アシスタント
*2024/06/28 12:43:49*

`symbolEffect` modifier can be applied conditionally to the `Image` to animate it continuously when `isZero` is false. Here’s how you can achieve that:

1. Use the `.repeatForever` animation to ensure the animation continues indefinitely.
2. Use `onAppear` to start the animation conditionally.

Here's an example of how to do this:

```swift
@State private var animate = false

var body: some View {
    SFSymbols.waveform.image
        .resizable()
        .scaledToFit()
        .frame(width: 100, height: 100)
        .foregroundColor(animate ? .red : .blue) // Example of color change, you can change it based on your need
        .onAppear {
            withAnimation(.easeInOut(duration: 1).repeatForever()) {
                animate = !presenter.recordingVolumeLevel.isZero
            }
        }
        .onChange(of: presenter.recordingVolumeLevel) { newValue in
            withAnimation(.easeInOut(duration: 1).repeatForever()) {
                animate = !newValue.isZero
            }
        }
}
```

In this example:

- `@State private var animate` is used to control the animation state.
- `foregroundColor` is animated as an example, and you can replace it with any other property that you want to animate.
- `onAppear` starts the animation when the view appears.
- `onChange` detects changes in `recordingVolumeLevel` and updates the animation state accordingly.

You can adjust the animation and properties to fit your specific requirements.

---
