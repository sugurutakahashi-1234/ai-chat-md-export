# AVPlayer サブスクライブ currentTime()

Date: 2023-10-27

---

## 👤 User
*2023-10-27 20:52:30*

avplayer currentTime() seconds サブスクライブ

---

## 🤖 Assistant
*2023-10-27 20:53:13*

It seems like you're asking how to subscribe (or observe) the `currentTime()` of an `AVPlayer` instance in Swift. You can use `AVPlayer`'s `addPeriodicTimeObserver(forInterval:queue:using:)` method to periodically observe the current time of the player.

Here's a simple example using Swift and the `AVFoundation` framework:

```swift
import AVFoundation

class PlayerObserver {

    private var player: AVPlayer!
    private var timeObserverToken: Any?

    init(url: URL) {
        player = AVPlayer(url: url)
    }

    func play() {
        player.play()
    }

    func subscribeToCurrentTime() {
        // The interval at which you want to be notified
        let interval = CMTime(seconds: 0.5, preferredTimescale: CMTimeScale(NSEC_PER_SEC))
        
        // Use `addPeriodicTimeObserver(forInterval:queue:using:)`
        timeObserverToken = player.addPeriodicTimeObserver(forInterval: interval, queue: DispatchQueue.main) { [weak self] time in
            let timeInSeconds = CMTimeGetSeconds(time)
            print("Current Time: \(timeInSeconds) seconds")
        }
    }

    func unsubscribeFromCurrentTime() {
        if let timeObserverToken = timeObserverToken {
            player.removeTimeObserver(timeObserverToken)
            self.timeObserverToken = nil
        }
    }

    deinit {
        unsubscribeFromCurrentTime()
    }
}
```

In this example, `subscribeToCurrentTime()` sets up a periodic observer that will print the current playback time every half second. When you're done with the observer or no longer need it, you should call `unsubscribeFromCurrentTime()` to remove it and free up resources.

---
