# Get AVPlayer Volume Swift

日付: 2024-06-20

---

## 👤 ユーザー
*2024/6/20 21:31:47*

AVPlayer を使って再生中の音量を取得したい。

---

## 🤖 アシスタント
*2024/6/20 21:32:11*

AVPlayer自体には直接再生中の音量を取得するメソッドはありませんが、再生中の音量は `AVAudioSession` や `MPVolumeView` を利用することで取得できます。以下に、`MPVolumeView` を使用してシステムの音量を取得する方法を示します。

```swift
import UIKit
import MediaPlayer

class VolumeViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()

        // MPVolumeViewのインスタンスを作成
        let volumeView = MPVolumeView(frame: CGRect(x: -2000, y: -2000, width: 0, height: 0))
        self.view.addSubview(volumeView)

        // ボリュームスライダーを取得
        if let volumeSlider = volumeView.subviews.first(where: { $0 is UISlider }) as? UISlider {
            // 現在のボリュームを取得
            let currentVolume = volumeSlider.value
            print("現在の音量: \(currentVolume)")
        }
    }
}
```

このコードでは、`MPVolumeView` を使用してシステムのボリュームスライダーにアクセスし、その値を取得しています。ただし、この方法はシステムの全体の音量を取得するため、`AVPlayer` のインスタンス自体の音量ではありません。`AVPlayer` のインスタンスに設定されている音量は、デフォルトではシステム音量に依存しますが、`AVPlayer` の `volume` プロパティを変更することで調整することもできます。

また、直接的なAVPlayerの音量調整と取得には以下のように行います。

```swift
import AVFoundation

class PlayerViewController: UIViewController {
    var player: AVPlayer?

    override func viewDidLoad() {
        super.viewDidLoad()

        // AVPlayerのインスタンスを作成
        if let url = URL(string: "https://path/to/your/media.mp4") {
            player = AVPlayer(url: url)
            player?.volume = 0.5 // 音量を設定
            player?.play()

            // 現在の音量を取得
            if let currentVolume = player?.volume {
                print("AVPlayerの音量: \(currentVolume)")
            }
        }
    }
}
```

このコードでは、`AVPlayer` の `volume` プロパティを使用してプレイヤーの音量を設定および取得しています。この音量は `AVPlayer` インスタンスの再生音量を意味しますが、システムの音量と合算されて最終的な出力音量になります。

---

## 👤 ユーザー
*2024/6/20 21:32:29*

再生コンテンツの音量を出したいんだ。

---

## 🤖 アシスタント
*2024/6/20 21:33:02*

AVPlayerで再生中のコンテンツの音量レベル（デシベルなど）を取得するには、音声信号の分析が必要です。これを行うためには、`AVAudioEngine` と `AVAudioPlayerNode` を使用して、再生中の音声信号を解析することができます。以下に、具体的な実装例を示します。

1. `AVPlayer` で再生するコンテンツを `AVAudioEngine` に接続します。
2. 音声信号を分析して音量レベルを取得します。

以下のコードは、これを実現する一例です。

```swift
import UIKit
import AVFoundation

class PlayerViewController: UIViewController {
    var player: AVPlayer!
    var playerItem: AVPlayerItem!
    var audioEngine: AVAudioEngine!
    var playerNode: AVAudioPlayerNode!
    var mixerNode: AVAudioMixerNode!

    override func viewDidLoad() {
        super.viewDidLoad()
        
        // AVPlayerの初期化
        guard let url = URL(string: "https://path/to/your/media.mp4") else { return }
        playerItem = AVPlayerItem(url: url)
        player = AVPlayer(playerItem: playerItem)

        // AVAudioEngineの初期化
        audioEngine = AVAudioEngine()
        playerNode = AVAudioPlayerNode()
        mixerNode = audioEngine.mainMixerNode

        // プレイヤーノードをエンジンに接続
        audioEngine.attach(playerNode)
        audioEngine.connect(playerNode, to: mixerNode, format: nil)

        // ノードのタップを設定してオーディオレベルを取得
        mixerNode.installTap(onBus: 0, bufferSize: 1024, format: mixerNode.outputFormat(forBus: 0)) { (buffer, when) in
            self.analyzeAudio(buffer: buffer)
        }

        // オーディオエンジンをスタート
        do {
            try audioEngine.start()
        } catch {
            print("Error starting audio engine: \(error)")
        }

        // AVPlayerで再生
        player.play()
        playerNode.play()
    }

    func analyzeAudio(buffer: AVAudioPCMBuffer) {
        guard let channelData = buffer.floatChannelData else { return }
        let channelDataValue = channelData.pointee
        let channelDataValueArray = stride(from: 0, to: Int(buffer.frameLength), by: buffer.stride).map { channelDataValue[$0] }
        
        // RMS (Root Mean Square) を計算して音量レベルを求める
        let rms = sqrt(channelDataValueArray.map { $0 * $0 }.reduce(0, +) / Float(buffer.frameLength))
        let avgPower = 20 * log10(rms)
        print("Average Power: \(avgPower) dB")
    }
}
```

このコードは次のように動作します：

1. `AVPlayer` を使用してコンテンツを再生します。
2. `AVAudioEngine` をセットアップし、`AVAudioPlayerNode` を使用してプレイヤーの音声をオーディオエンジンに接続します。
3. `AVAudioMixerNode` にタップをインストールし、オーディオバッファを取得して解析します。
4. 音声信号のRMS値を計算し、デシベル単位の平均パワーを算出して出力します。

この方法により、再生中のコンテンツの音量レベルをリアルタイムで取得することができます。

---
