# SwiftUI AVPlayer 字幕处理

日付: 2024-10-03

---

## 👤 ユーザー
*2024/10/3 16:09:31*

SwiftUI avplayer 字幕

---

## 🤖 アシスタント
*2024/10/3 16:09:46*

SwiftUI does not have a direct API for handling subtitles with `AVPlayer`. However, you can leverage `AVPlayer` and `AVPlayerLayer` from AVKit in combination with SwiftUI views to manage video playback with subtitles. Here's how you can display subtitles for a video using `AVPlayer` and `AVPlayerItemLegibleOutput` in SwiftUI.

Here is a sample approach to handling subtitles in SwiftUI:

### 1. Create a SwiftUI View that uses `AVPlayer`
You can create a custom `AVPlayer` wrapper in SwiftUI and handle the subtitles using `AVPlayerItemLegibleOutput`.

```swift
import SwiftUI
import AVKit

struct VideoPlayerWithSubtitlesView: UIViewControllerRepresentable {
    let player: AVPlayer
    @Binding var subtitle: String

    func makeUIViewController(context: Context) -> AVPlayerViewController {
        let playerViewController = AVPlayerViewController()
        playerViewController.player = player
        playerViewController.showsPlaybackControls = true
        playerViewController.player?.play()

        // Add legible output to handle subtitles
        let output = AVPlayerItemLegibleOutput()
        output.setDelegate(context.coordinator, queue: DispatchQueue.main)
        player.currentItem?.add(output)

        return playerViewController
    }

    func updateUIViewController(_ uiViewController: AVPlayerViewController, context: Context) {}

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    class Coordinator: NSObject, AVPlayerItemLegibleOutputPushDelegate {
        var parent: VideoPlayerWithSubtitlesView

        init(_ parent: VideoPlayerWithSubtitlesView) {
            self.parent = parent
        }

        // This method handles subtitle output
        func legibleOutput(_ output: AVPlayerItemLegibleOutput, didOutput attributedStrings: [NSAttributedString], nativeSampleBuffers: [Any]?, forItemTime itemTime: CMTime) {
            if let attributedString = attributedStrings.first {
                self.parent.subtitle = attributedString.string
            }
        }
    }
}
```

### 2. Using the View in SwiftUI
Now, you can create a SwiftUI view that plays the video and displays subtitles.

```swift
struct ContentView: View {
    @State private var subtitle: String = ""
    
    var body: some View {
        VStack {
            // Video player
            VideoPlayerWithSubtitlesView(player: AVPlayer(url: URL(string: "https://your-video-url.mp4")!), subtitle: $subtitle)
                .frame(height: 300)
            
            // Subtitle display
            Text(subtitle)
                .padding()
                .background(Color.black.opacity(0.7))
                .foregroundColor(.white)
                .cornerRadius(8)
                .padding()
        }
    }
}
```

### Key Steps:
1. **`AVPlayerItemLegibleOutput`**: This captures subtitles or closed captioning.
2. **Coordinator Pattern**: Used to handle delegate callbacks in SwiftUI.
3. **`legibleOutput(_:didOutput:)`**: Captures and displays the subtitle text.

With this setup, your `VideoPlayerWithSubtitlesView` will play a video using `AVPlayer`, and subtitles will be displayed below the video in real-time.

Let me know if you need further adjustments!

---
