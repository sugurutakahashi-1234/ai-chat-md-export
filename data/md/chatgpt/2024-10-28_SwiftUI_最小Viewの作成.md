# SwiftUI 最小Viewの作成

Date: 2024-10-28

---

## 👤 User
*2024-10-28 19:11:36*

SwiftUI で最小単位のViewはどうやって作るの？
EmptyViewだとonAppearが動かなかった

---

## 🤖 Assistant
*2024-10-28 19:11:38*

`EmptyView` では `onAppear` が動作しないため、代わりにカスタムの最小単位の `View` を作成することができます。例えば、`Color.clear` や `Rectangle().fill(Color.clear)` を使用すると、透明な領域を持つ `View` を作成でき、これに `onAppear` を付与することが可能です。

以下に例を示します：

```swift
import SwiftUI

struct MinimalView: View {
    var body: some View {
        Color.clear
            .frame(width: 0, height: 0) // 最小のフレームサイズ
            .onAppear {
                // onAppearでの処理
                print("View appeared!")
            }
    }
}
```

このようにすることで、最小サイズの透明な `View` を作成し、`onAppear` などのモディファイアが適用されるようにできます。

---
