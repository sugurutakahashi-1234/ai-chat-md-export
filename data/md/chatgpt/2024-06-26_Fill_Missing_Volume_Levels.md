# Fill Missing Volume Levels

Date: 2024-06-26

---

## 👤 User
*2024-06-26 16:46:04*

maxColumnCount がある場合に、volumeLevels が maxColumnCount に達していなければ、前方に 0 で埋めてあげてほしい

struct WaveformView: View {
    let volumeLevels: [Double]

    init(volumeLevels: [Double], isRandomized: Bool = false, maxColumnCount: Int? = nil) {
        if isRandomized {
            self.volumeLevels = volumeLevels.shuffled()
        } else {
            self.volumeLevels = volumeLevels
        }
    }

    var body: some View {
        GeometryReader { geometry in
            // バーの間隔がバー幅の 1/2 にするように計算
            let totalWidth = geometry.size.width
            let rectangleWidth = totalWidth / (CGFloat(volumeLevels.count) + CGFloat(volumeLevels.count - 1) / 2)
            let spacing = rectangleWidth / 2

            HStack(spacing: spacing) {
                ForEach(0..&lt;volumeLevels.count, id: \.self) { index in
                    VStack {
                        Spacer()
                        Rectangle()
                            .fill(Color.accentColor)
                            .frame(width: rectangleWidth, height: volumeLevels[index] * 100)
                            .cornerRadius(8)
                        Spacer()
                    }
                }
            }
            .frame(height: 100)
        }
    }
}

---

## 🤖 Assistant
*2024-06-26 16:46:23*

`maxColumnCount`が指定されている場合、`volumeLevels`が`maxColumnCount`に達していない場合は、`volumeLevels`の前方を0で埋めるようにするために、次のように`init`メソッドを修正します。

```swift
struct WaveformView: View {
    let volumeLevels: [Double]

    init(volumeLevels: [Double], isRandomized: Bool = false, maxColumnCount: Int? = nil) {
        var levels = volumeLevels
        if let maxColumnCount = maxColumnCount, levels.count < maxColumnCount {
            let paddingCount = maxColumnCount - levels.count
            levels = Array(repeating: 0.0, count: paddingCount) + levels
        }
        if isRandomized {
            self.volumeLevels = levels.shuffled()
        } else {
            self.volumeLevels = levels
        }
    }

    var body: some View {
        GeometryReader { geometry in
            let totalWidth = geometry.size.width
            let rectangleWidth = totalWidth / (CGFloat(volumeLevels.count) + CGFloat(volumeLevels.count - 1) / 2)
            let spacing = rectangleWidth / 2

            HStack(spacing: spacing) {
                ForEach(0..<volumeLevels.count, id: \.self) { index in
                    VStack {
                        Spacer()
                        Rectangle()
                            .fill(Color.accentColor)
                            .frame(width: rectangleWidth, height: volumeLevels[index] * 100)
                            .cornerRadius(8)
                        Spacer()
                    }
                }
            }
            .frame(height: 100)
        }
    }
}
```

これで、`maxColumnCount`が指定されていて、`volumeLevels`の要素数が`maxColumnCount`に達していない場合に、`volumeLevels`の前方に0が追加されるようになります。

---
