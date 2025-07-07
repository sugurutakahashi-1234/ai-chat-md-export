# SwiftUIでUIInterfaceOrientation管理

日付: 2023-06-27

---

## 👤 ユーザー
*2023/6/27 18:49:46*

SwiftUIでUIInterfaceOrientationを管理する方法ってあるの？

---

## 🤖 アシスタント
*2023/6/27 18:50:27*

SwiftUIでデバイスの向きを取得または管理するには、まだ標準的な手段がないことをお伝えしておきたいです（少なくとも私の知識の更新が終わった2021年9月まででは）。ただし、UIKitのAPIを使って間接的に対応することは可能です。以下にその一例を示します：

```swift
import SwiftUI
import UIKit

struct ContentView: View {
    @State private var orientation = UIApplication.shared.windows.first?.windowScene?.interfaceOrientation

    var body: some View {
        VStack {
            if orientation?.isPortrait == true {
                Text("Portrait")
            } else {
                Text("Landscape")
            }
        }
        .onReceive(NotificationCenter.default.publisher(for: UIDevice.orientationDidChangeNotification)) { _ in
            self.orientation = UIApplication.shared.windows.first?.windowScene?.interfaceOrientation
        }
    }
}
```

この例では、`UIDevice.orientationDidChangeNotification`の通知を購読して、デバイスの向きが変わるたびに`orientation`ステートを更新しています。そして、それを元にVStack内でPortraitかLandscapeかを表示しています。

ただし、SwiftUIのフレームワーク自体が向きに対応しているので、特定の向きを強制するようなケース以外では、基本的には各ビューが適切にレスポンシブに動作することを期待してデザインするのが良いでしょう。具体的な要件によりますが、SwiftUIのレイアウトシステムと組み合わせることで十分対応可能なケースも多いと思います。

---
