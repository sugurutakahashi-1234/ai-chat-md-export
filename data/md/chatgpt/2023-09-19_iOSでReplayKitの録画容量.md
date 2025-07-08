# iOSでReplayKitの録画容量

日付: 2023-09-19

---

## 👤 ユーザー
*2023/9/19 15:32:54*

iOSでReplayKitで録画時にデータ容量を抑えたいどうすればいいか

---

## 🤖 アシスタント
*2023/9/19 15:34:10*

ReplayKit は iOS のスクリーン録画とゲームプレイの録画をサポートするフレームワークです。ReplayKit で録画したコンテンツのデータ容量を抑えるためには、直接的な設定は存在しませんが、以下のようなアプローチで容量を節約することができます。

1. **録画の解像度やフレームレートを下げる**: ReplayKit 自体には解像度やフレームレートを直接設定するオプションはありませんが、アプリケーション側での表示解像度やフレームレートを変更することで、間接的に録画される内容の質を調整することができます。

2. **後処理による圧縮**: 録画が完了した後、`AVAssetExportSession` や他の動画処理ライブラリを使用して動画の圧縮を行うことができます。これにより、動画のビットレートを下げたり、解像度を落としたりして、ファイルサイズを削減することができます。

3. **外部ライブラリの利用**: サードパーティの動画エンコードライブラリやツールを利用して、録画後の動画をさらに効率的に圧縮することも考慮することができます。

4. **録画の時間を短くする**: 必要な部分だけを録画することで、全体のデータ容量を抑えることができます。

5. **録画内容を最適化**: 画面上の動きが少ない場面や、単色の背景などは動画として圧縮しやすい内容となります。可能であれば、録画する内容自体を最適化することで、ファイルサイズを削減できる場合があります。

ReplayKit には多くの高度な設定オプションがないため、データ容量を抑えるための調整は主に録画後の処理や、アプリケーションの設定を通じて行われることになります。

---

## 👤 ユーザー
*2023/9/23 13:25:19*

AVAssetExportSession を使って具体的にデータ容量を下げる方法を教えて欲しい

---

## 🤖 アシスタント
*2023/9/23 13:25:51*

`AVAssetExportSession` を使って、動画のデータ容量を下げるには、出力の解像度、ビットレート、フレームレートを調整します。以下は、Swiftで`AVAssetExportSession`を使った例です。

### ステップバイステップのガイダンス

1. **`AVAsset`の作成**
   動画ファイルから`AVAsset`オブジェクトを作成します。

   ```swift
   let asset = AVAsset(url: videoURL)
   ```

2. **`AVAssetExportSession`の作成**
   `AVAsset`とプリセットを指定して`AVAssetExportSession`オブジェクトを作成します。

   ```swift
   guard let exportSession = AVAssetExportSession(asset: asset, presetName: AVAssetExportPresetMediumQuality) else { return }
   ```

3. **出力パスの設定**
   エクスポートする動画の出力パスを設定します。

   ```swift
   let outputPath = NSTemporaryDirectory() + "output.mp4"
   let outputURL = URL(fileURLWithPath: outputPath)
   exportSession.outputURL = outputURL
   ```

4. **出力フォーマットの設定**
   出力する動画のフォーマットを設定します。

   ```swift
   exportSession.outputFileType = .mp4
   ```

5. **エクスポートの開始**
   エクスポートセッションを開始します。

   ```swift
   exportSession.exportAsynchronously {
       switch exportSession.status {
       case .completed:
           print("Exported successfully to \(outputURL)")
       case .failed:
           print("Export failed: \(String(describing: exportSession.error))")
       case .cancelled:
           print("Export cancelled")
       default:
           break
       }
   }
   ```

### より具体的な設定

上記のコードは基本的な例ですが、より具体的な設定を行いたい場合は、`AVVideoCompressionPropertiesKey`を用いて、ビットレートや解像度を設定することができます。

例えば、ビットレートを調整したい場合は以下のようにします。

```swift
exportSession.videoSettings = [
    AVVideoCodecKey: AVVideoCodecType.h264,
    AVVideoCompressionPropertiesKey: [
        AVVideoAverageBitRateKey: NSNumber(value: desiredBitrate)
    ]
]
```

これらの設定を通じて、`AVAssetExportSession`を利用して動画のデータ容量を抑えることができます。適切なビットレートや解像度をテストし、品質とファイルサイズのバランスを見つけることが重要です。

---

## 👤 ユーザー
*2023/9/23 13:27:42*

ReplayKit でstartRecordingで録画した画面を.stopRecording(withOutput: url)して、それのデータ容量を抑える方法を教えて欲しい

---

## 🤖 アシスタント
*2023/9/23 13:28:13*

ReplayKitで録画した後、`AVAssetExportSession`を使用して出力動画のデータ容量を抑えるには、以下のような手順をとります。

### 1. ReplayKitで録画開始
```swift
import ReplayKit

let recorder = RPScreenRecorder.shared()

recorder.startRecording { (error) in
    if let error = error {
        print("Failed to start recording: \(error.localizedDescription)")
    }
}
```

### 2. ReplayKitで録画停止
```swift
recorder.stopRecording { (previewController, error) in
    if let error = error {
        print("Failed to stop recording: \(error.localizedDescription)")
    }
    
    guard let previewController = previewController else { return }
    
    // 下記で、previewController の videoURL を取得します。
    let selector = NSSelectorFromString("videoURL")
    if previewController.responds(to: selector), let url = previewController.perform(selector).takeUnretainedValue() as? URL {
        self.compressVideo(inputURL: url)
    }
}
```

### 3. AVAssetExportSessionを使用して動画を圧縮
```swift
import AVFoundation

func compressVideo(inputURL: URL) {
    let outputURL = URL(fileURLWithPath: NSTemporaryDirectory() + "compressed.mp4")
    
    guard let asset = AVAsset(url: inputURL) as? AVURLAsset else {
        print("Could not load asset")
        return
    }
    
    guard let exportSession = AVAssetExportSession(asset: asset, presetName: AVAssetExportPresetMediumQuality) else {
        print("Could not create export session")
        return
    }
    
    exportSession.outputURL = outputURL
    exportSession.outputFileType = .mp4
    exportSession.shouldOptimizeForNetworkUse = true
    
    exportSession.exportAsynchronously {
        switch exportSession.status {
        case .completed:
            print("Video exported successfully to \(outputURL)")
        case .failed, .cancelled:
            print("Failed to compress the video")
        default:
            break
        }
    }
}
```

上記のコード例では、`AVAssetExportPresetMediumQuality` プリセットを使用して動画を圧縮していますが、要求されたビデオ品質によっては、他のプリセットを使用することもできます。

- `AVAssetExportPresetLowQuality`: 低品質のビデオ
- `AVAssetExportPresetHighestQuality`: 高品質のビデオ

また、特定のビットレートや解像度を指定したい場合は、`AVVideoCompressionPropertiesKey` を使用してカスタムのエクスポート設定を作成できます。

---

## 👤 ユーザー
*2023/9/23 13:48:00*

outputURL, outputFileType, shouldOptimizeForNetworkUse, exportAsynchronously とか他にも設定したほうがいいパラメーターについて解説して欲しい

---

## 🤖 アシスタント
*2023/9/23 13:48:36*

`AVAssetExportSession`でビデオのエクスポートを行う際に設定する主要なパラメーターには、以下のものがあります。これらのパラメーターを適切に設定することで、出力ビデオの品質やサイズをコントロールできます。

### 1. `outputURL`

`outputURL`はエクスポートされるビデオファイルの保存先を指定します。通常は一時ディレクトリに保存するのが一般的です。

```swift
exportSession.outputURL = URL(fileURLWithPath: NSTemporaryDirectory() + "output.mp4")
```

### 2. `outputFileType`

`outputFileType`はエクスポートするファイルの形式を指定します。一般には.mp4フォーマットが利用されますが、他にも.movや.m4vなどが利用可能です。

```swift
exportSession.outputFileType = .mp4
```

### 3. `shouldOptimizeForNetworkUse`

`shouldOptimizeForNetworkUse`はビデオをネットワークで送信する際に最適化するかどうかを指定します。これを`true`に設定すると、ビデオはストリーミング配信に適したフォーマットで出力されます。

```swift
exportSession.shouldOptimizeForNetworkUse = true
```

### 4. `exportAsynchronously`

`exportAsynchronously`メソッドはエクスポートプロセスを非同期で開始します。このメソッドは、エクスポートが完了、失敗、またはキャンセルされたときに処理を行うためのクロージャを受け取ります。

```swift
exportSession.exportAsynchronously {
    switch exportSession.status {
    case .completed:
        print("Exported successfully to \(outputURL)")
    // ...
    }
}
```

### 5. カスタムエクスポート設定

ビットレート、解像度、フレームレートなど、特定のパラメーターをカスタマイズしたい場合は、`videoSettings`と`audioSettings`を利用します。

```swift
exportSession.videoSettings = [
    AVVideoCodecKey: AVVideoCodecType.h264,
    AVVideoWidthKey: NSNumber(value: 640),
    AVVideoHeightKey: NSNumber(value: 480),
    AVVideoCompressionPropertiesKey: [
        AVVideoAverageBitRateKey: NSNumber(value: 1_000_000)
    ]
]

exportSession.audioSettings = [
    AVFormatIDKey: NSNumber(value: kAudioFormatMPEG4AAC),
    AVNumberOfChannelsKey: NSNumber(value: 2),
    AVEncoderBitRateKey: NSNumber(value: 128_000)
]
```

これらのパラメーターを適切に設定して利用することで、出力ビデオの品質やサイズ、及びパフォーマンスを最適化することができます。

---

## 👤 ユーザー
*2023/9/23 13:58:28*

mp4でもなくてもいい、パフォーマンスが出るようにして欲しい。また、videoSettings もなるべくパフォーマンスがでる感じにしてほしい。ただ、アスペクト比は維持しておいて欲しい。shouldOptimizeForNetworkUse はfalseにしてほうがパフォーマンスがでるならfalseでもいい。

---

## 🤖 アシスタント
*2023/9/23 13:59:20*

出力動画のパフォーマンスを向上させつつ、アスペクト比を維持し、ファイルサイズも抑えるための設定について考えます。`shouldOptimizeForNetworkUse`が`false`であることがよいかどうかは、ユースケースによるので、必要に応じて調整してください。

以下は、これらの要件を満たすための一例です。

### 1. `AVAssetExportSession`の設定
```swift
import AVFoundation

func compressVideo(inputURL: URL) {
    let outputURL = URL(fileURLWithPath: NSTemporaryDirectory() + "compressed.mp4")
    
    guard let asset = AVAsset(url: inputURL) as? AVURLAsset else {
        print("Could not load asset")
        return
    }
    
    guard let exportSession = AVAssetExportSession(asset: asset, presetName: AVAssetExportPresetMediumQuality) else {
        print("Could not create export session")
        return
    }
    
    let videoTrack = asset.tracks(withMediaType: AVMediaType.video).first!
    let assetInfo = orientationFromTransform(transform: videoTrack.preferredTransform)
    
    var videoSettings: [String: Any] = [
        AVVideoCodecKey: AVVideoCodecType.h264,
        AVVideoCompressionPropertiesKey: [AVVideoAverageBitRateKey: NSNumber(value: 1_000_000)]
    ]
    
    let width = videoTrack.naturalSize.width
    let height = videoTrack.naturalSize.height
    let aspectRatio = width / height
    let adjustedWidth: CGFloat = 640.0
    let adjustedHeight = adjustedWidth / aspectRatio
    
    videoSettings[AVVideoWidthKey] = NSNumber(value: Float(adjustedWidth))
    videoSettings[AVVideoHeightKey] = NSNumber(value: Float(adjustedHeight))
    
    exportSession.outputURL = outputURL
    exportSession.outputFileType = .mp4
    exportSession.videoSettings = videoSettings
    exportSession.shouldOptimizeForNetworkUse = false
    
    exportSession.exportAsynchronously {
        switch exportSession.status {
        case .completed:
            print("Video exported successfully to \(outputURL)")
        case .failed, .cancelled:
            print("Failed to compress the video")
        default:
            break
        }
    }
}

func orientationFromTransform(transform: CGAffineTransform) -> (orientation: UIImage.Orientation, isPortrait: Bool) {
    var assetOrientation = UIImage.Orientation.up
    var isPortrait = false
    if transform.a == 0 && transform.b == 1.0 && transform.c == -1.0 && transform.d == 0 {
        assetOrientation = .right
        isPortrait = true
    } else if transform.a == 0 && transform.b == -1.0 && transform.c == 1.0 && transform.d == 0 {
        assetOrientation = .left
        isPortrait = true
    } else if transform.a == 1.0 && transform.b == 0 && transform.c == 0 && transform.d == 1.0 {
        assetOrientation = .up
    } else if transform.a == -1.0 && transform.b == 0 && transform.c == 0 && transform.d == -1.0 {
        assetOrientation = .down
    }
    return (assetOrientation, isPortrait)
}
```

### 説明
1. `AVVideoCodecType.h264`は、ビデオの圧縮に広く使用されるコーデックです。良好な圧縮率と互換性を提供します。
2. `AVVideoAverageBitRateKey`でビットレートを設定することで、動画の品質とサイズをバランス良く調整できます。
3. `AVVideoWidthKey` と `AVVideoHeightKey` で出力動画の解像度を調整し、アスペクト比を維持します。
4. `shouldOptimizeForNetworkUse`を`false`に設定していますが、これはネットワークでのストリーミングが主な目的でない場合に適しています。

最終的に、これらのパラメーターはユースケースによって調整する必要があります。適切なバランスを見つけるために、異なる設定でテストを行ってください。

---

## 👤 ユーザー
*2023/9/23 14:00:42*

以下の処理は何をやっているの？
    let videoTrack = asset.tracks(withMediaType: AVMediaType.video).first!
    let assetInfo = orientationFromTransform(transform: videoTrack.preferredTransform)

---

## 🤖 アシスタント
*2023/9/23 14:01:09*

このコードは、`AVAsset`から最初のビデオトラックを取得し、そのトラックの`preferredTransform`を使用してビデオの向きを判断しています。

詳細に分解してみましょう。

### 1. ビデオトラックの取得
```swift
let videoTrack = asset.tracks(withMediaType: AVMediaType.video).first!
```
この行では、`asset`オブジェクトから`AVMediaType.video`タイプのメディアトラック（ビデオトラック）を検索しています。`.first!`を使用して最初のビデオトラックを強制アンラップして取得しています。

### 2. ビデオの向きの取得
```swift
let assetInfo = orientationFromTransform(transform: videoTrack.preferredTransform)
```
ここでは、取得したビデオトラックの`preferredTransform`プロパティを用いて、ビデオの向き（オリエンテーション）情報を得ています。`preferredTransform`は、ビデオの表示向きを決定するためのアフィン変換（CGAffineTransform）を提供します。

### 3. orientationFromTransform関数
この関数は、アフィン変換を解析してUIImage.Orientation型のオリエンテーション情報と、ビデオがポートレートモードかどうかのBoolean値を返します。これにより、ビデオの向きとポートレート／ランドスケープモードの判定ができます。

この情報を利用することで、ビデオの向きに応じた処理や、アスペクト比の維持などが可能になります。

---

## 👤 ユーザー
*2023/9/23 14:01:39*

この処理をやらないとどうなるの？

---

## 🤖 アシスタント
*2023/9/23 14:02:08*

`videoTrack` から `preferredTransform` を取得し、それを利用してビデオのオリエンテーションを判定するこの処理を行わないと、ビデオのオリエンテーションやアスペクト比が正しくない可能性があります。これは、以下のような問題を引き起こす可能性があります。

### 1. **ビデオの向きが不正確**
ビデオの向きが正しく判定できないと、ランドスケープモードで撮影されたビデオがポートレートモードで表示されたり、逆にポートレートモードで撮影されたビデオがランドスケープモードで表示される可能性があります。これは、ビデオが見づらくなるだけでなく、ユーザーエクスペリエンスも悪化します。

### 2. **アスペクト比の不整合**
ビデオのオリエンテーションが正しく判定できないと、ビデオのアスペクト比を正しく維持するのが困難になります。アスペクト比が正しく維持できないと、ビデオが伸びたり縮んだりし、ビデオコンテンツの一部が見切れたりする可能性があります。

### 3. **編集の困難**
オリエンテーションとアスペクト比の不整合は、ビデオの後編集作業を困難にする可能性があります。例えば、トリミングやスケーリングを正しく行うためには、元のビデオのオリエンテーションとアスペクト比の情報が必要となります。

このような問題を避けるために、ビデオを操作または変換する際には、`preferredTransform`を利用して正確なオリエンテーションとアスペクト比の情報を取得することが重要です。

---

## 👤 ユーザー
*2023/9/23 14:02:35*

AVVideoWidthKeyやAVVideoHeightKeyをせっていしなかったらいらない処理？であればやらなくていいよ。

---

## 🤖 アシスタント
*2023/9/23 14:02:54*

`AVVideoWidthKey` や `AVVideoHeightKey` を設定しなかった場合、出力ビデオの解像度はデフォルトで入力ビデオの解像度と同じになります。したがって、出力ビデオの解像度を入力ビデオと同じに保ちたい場合、または解像度について特に変更の要求がない場合には、これらのキーを設定する必要はありません。

一方で、これらのキーを利用して明示的に解像度を設定することで、出力ビデオの品質とファイルサイズを調整することができます。例えば、より低い解像度を設定することで、ファイルサイズを小さくできます。

ビデオのオリエンテーションやアスペクト比の情報取得については、これらの解像度の設定とは直接関連がないため、解像度の設定が不要であれば、オリエンテーションやアスペクト比の処理を省略しても問題はないでしょう。ただし、ビデオの向きやアスペクト比を保持する必要がある他の処理や、特定のオリエンテーションでのみビデオを表示したい場合には、相応の処理が必要になります。

---
