# SwifUI VideoPlayer 余白非表示

日付: 2024-09-24

---

## 👤 ユーザー
*2024/09/24 12:20:59*

SwifUI VideoPlayer 横幅いっぱい 黒いところを非表示

---

## 🤖 アシスタント
*2024/09/24 12:21:10*

`SwiftUI` の `VideoPlayer` で動画を再生する際、横幅を画面いっぱいにし、上下の黒い部分（アスペクト比の違いによって表示される余白）を非表示にするためには、`VideoPlayer` のアスペクト比を調整する必要があります。

例えば、`VideoPlayer` のデフォルトでは、コンテンツのアスペクト比に基づいて黒い余白が追加されることがありますが、`VideoPlayer` を画面いっぱいに広げたい場合は、次のように `aspectRatio(.fill)` を使用してアスペクト比を調整できます。

```swift
import SwiftUI
import AVKit

struct FullWidthVideoPlayerView: View {
    let videoURL: URL

    var body: some View {
        VideoPlayer(player: AVPlayer(url: videoURL))
            .aspectRatio(contentMode: .fill) // アスペクト比をfillにして余白を非表示に
            .frame(width: UIScreen.main.bounds.width) // 横幅を画面いっぱいにする
            .clipped() // コンテンツを画面内に収める
    }
}
```

これにより、ビデオのアスペクト比が `fill` モードで表示され、黒い上下の余白が非表示になります。`clipped()` を使うことで、画面外に出る部分も切り取られるため、黒い余白が表示されなくなります。

他に調整が必要であれば、教えてください。

---

## 👤 ユーザー
*2024/09/24 12:22:19*

VideoPlayer の背景を黒ではなく別の色にしたい

---

## 🤖 アシスタント
*2024/09/24 12:22:32*

`SwiftUI` の `VideoPlayer` の背景をデフォルトの黒から別の色に変更したい場合、`VideoPlayer` 自体には直接背景色を変更するプロパティはないため、`ZStack` を使って `VideoPlayer` の背後に背景色を設定する方法があります。

以下はその実装例です：

```swift
import SwiftUI
import AVKit

struct CustomBackgroundVideoPlayerView: View {
    let videoURL: URL

    var body: some View {
        ZStack {
            Color.blue // 背景色を設定（ここでは青に設定しています）
                .edgesIgnoringSafeArea(.all) // 背景色を画面いっぱいに広げる

            VideoPlayer(player: AVPlayer(url: videoURL))
                .aspectRatio(contentMode: .fit) // アスペクト比はお好みで調整可能
                .frame(width: UIScreen.main.bounds.width)
        }
    }
}
```

`ZStack` によって、`VideoPlayer` の背後に任意の色を設定できます。この例では、背景色を `Color.blue` に設定していますが、好きな色に変更することができます。

`edgesIgnoringSafeArea(.all)` を使うことで、背景色を画面全体に広げています。

---
