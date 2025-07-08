# Detect AVAudioPlayer Playback

日付: 2024-06-21

---

## 👤 ユーザー
*2024/06/21 10:15:31*

AVAudioPlayer が再生可能になったことを検知する

---

## 🤖 アシスタント
*2024/06/21 10:15:45*

`AVAudioPlayer` が再生可能になったことを検知するためには、`AVAudioPlayerDelegate` を使用します。`audioPlayerDidFinishPlaying(_:successfully:)` メソッドや `audioPlayerDecodeErrorDidOccur(_:error:)` メソッドを実装することで、再生の開始、終了、エラーなどのイベントを検知できます。以下は具体的な実装例です。

```swift
import AVFoundation

class AudioPlayerManager: NSObject, AVAudioPlayerDelegate {
    var audioPlayer: AVAudioPlayer?

    func prepareAudioPlayer(with url: URL) {
        do {
            audioPlayer = try AVAudioPlayer(contentsOf: url)
            audioPlayer?.delegate = self
            audioPlayer?.prepareToPlay()
        } catch {
            print("Error initializing AVAudioPlayer: \(error.localizedDescription)")
        }
    }

    // 再生可能になったことを検知するメソッド
    func audioPlayerDidFinishPlaying(_ player: AVAudioPlayer, successfully flag: Bool) {
        if flag {
            print("Audio finished playing successfully.")
        } else {
            print("Audio did not finish playing successfully.")
        }
    }

    // デコードエラーを検知するメソッド
    func audioPlayerDecodeErrorDidOccur(_ player: AVAudioPlayer, error: Error?) {
        if let error = error {
            print("Audio Player Decode Error: \(error.localizedDescription)")
        }
    }

    // 再生の準備ができたときに呼ばれるメソッド
    func audioPlayerBeginInterruption(_ player: AVAudioPlayer) {
        print("Audio Player Begin Interruption")
    }

    func audioPlayerEndInterruption(_ player: AVAudioPlayer, withOptions flags: Int) {
        print("Audio Player End Interruption")
    }
}

// 使用例
let audioPlayerManager = AudioPlayerManager()
if let url = Bundle.main.url(forResource: "audiofile", withExtension: "mp3") {
    audioPlayerManager.prepareAudioPlayer(with: url)
}
```

このコードでは、`AudioPlayerManager` クラスが `AVAudioPlayerDelegate` プロトコルに準拠しており、オーディオの再生状況やエラーを検知するためのメソッドを実装しています。`prepareAudioPlayer(with:)` メソッドでオーディオプレーヤーを初期化し、再生準備が整うと自動的にデリゲートメソッドが呼び出されます。

---
