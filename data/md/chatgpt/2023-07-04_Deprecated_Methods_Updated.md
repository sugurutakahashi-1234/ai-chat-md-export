# Deprecated Methods Updated

日付: 2023-07-04

---

## 👤 ユーザー
*2023/7/4 20:31:46*

'tracks(withMediaType:)' was deprecated in iOS 16.0: Use loadTracks(withMediaType:) instead
'naturalSize' was deprecated in iOS 16.0: Use load(.naturalSize) instead


func updateVideoPlayerViewSize(videoPlayerViewSize: CGSize) {
        guard let videoTrack = avPlayer.currentItem?.asset.tracks(withMediaType: .video).first else {
            AppLogger.debugLog("video track not found", level: .error)
            return
        }

        let videoSize = videoTrack.naturalSize
        let videoAspect = videoSize.width / videoSize.height

        // 相対座標計算のためのパラメータの設定
        anchorAndEmotionAnalysisInteractor.updateMovieTrack(videoPlayerViewSize: videoPlayerViewSize, videoAspect: videoAspect)
    }

---

## 🤖 アシスタント
*2023/7/4 20:32:36*

Your existing code uses the deprecated methods `tracks(withMediaType:)` and `naturalSize`. To address these deprecation warnings, we can refactor the code as follows, using the new `loadTracks(withMediaType:)` and `load(.naturalSize)` methods as indicated:

```swift
func updateVideoPlayerViewSize(videoPlayerViewSize: CGSize) {
    guard let asset = avPlayer.currentItem?.asset else {
        AppLogger.debugLog("Asset not found", level: .error)
        return
    }

    // Create a DispatchGroup to manage multiple asynchronous operations
    let dispatchGroup = DispatchGroup()

    // Load video tracks
    dispatchGroup.enter()
    var videoTracks: [AVAssetTrack] = []
    asset.loadTracks(withMediaType: .video) { tracks, error in
        if let error = error {
            AppLogger.debugLog("Error loading tracks: \(error)", level: .error)
        } else {
            videoTracks = tracks
        }
        dispatchGroup.leave()
    }

    // Load naturalSize
    dispatchGroup.enter()
    var naturalSize: CGSize = .zero
    asset.load(.naturalSize) { size, error in
        if let error = error {
            AppLogger.debugLog("Error loading natural size: \(error)", level: .error)
        } else {
            naturalSize = size
        }
        dispatchGroup.leave()
    }

    // When all the loading is done
    dispatchGroup.notify(queue: .main) {
        guard let videoTrack = videoTracks.first else {
            AppLogger.debugLog("Video track not found", level: .error)
            return
        }

        let videoSize = naturalSize
        let videoAspect = videoSize.width / videoSize.height

        // Update relative coordinates
        anchorAndEmotionAnalysisInteractor.updateMovieTrack(videoPlayerViewSize: videoPlayerViewSize, videoAspect: videoAspect)
    }
}
```

Please note that both `loadTracks(withMediaType:)` and `load(.naturalSize)` are asynchronous operations, so a `DispatchGroup` is used to manage them. When all the loading operations are finished, the group's `notify(queue:)` closure is called, where we can safely use the loaded tracks and natural size.

Also, ensure that the `loadTracks(withMediaType:)` and `load(.naturalSize)` methods are available and functioning as expected in your environment. The iOS SDK does not contain these methods as of my knowledge cut-off in September 2021, so they might be custom extensions in your codebase or part of newer iOS SDKs.

---

## 👤 ユーザー
*2023/7/4 20:32:49*

DispatchGroup を使わないでもっとシンプルに取得できないのか？

---

## 🤖 アシスタント
*2023/7/4 20:33:21*

`loadTracks(withMediaType:)` と `load(.naturalSize)` の具体的な動作やこれらが非同期処理を行っているかどうかは、iOS 16.0以降での変更に依存します。僕の知識は2021年9月までのもので、それ以降の変更については調査が必要です。

しかし、2021年9月までの情報に基づいていえば、通常AVAssetのプロパティは非同期にロードされます。したがって、DispatchGroupを使用せずにこれらの情報を取得するシンプルな方法はありません。

もし非同期処理を避けたい場合、事前に全てのメディアアセットをロードしておくという手段が考えられます。しかし、これは全てのアセットが利用可能になるまでユーザーが待つことを意味します。さらに、メモリを大量に消費する可能性があるため、アプリケーションのパフォーマンスに影響を与えるかもしれません。

したがって、非同期処理を適切に管理することは、一般的には良いプラクティスとされています。

---
