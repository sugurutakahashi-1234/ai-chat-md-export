# User Request Summary

Date: 2024-05-08

---

## 👤 User
*2024-05-08 10:04:52*

ｆｆ

---

## 🤖 Assistant
*2024-05-08 10:04:54*

Hello! How can I assist you today?

---

## 👤 User
*2024-05-08 10:13:00*

クリーンアーキテクチャを採用している
これらの型はDomainEntityである

public enum AudioEncodeQuality: CaseIterable {
    case min
    case low
    case medium
    case high
    case max
}

public enum AudioSessionCategory: CaseIterable {
    case ambient
    case soloAmbient
    case playback
    case record
    case playAndRecord
    case multiRoute
}

public enum AudioSessionMode: CaseIterable {
    case `default`
    case voiceChat
    case gameChat
    case videoRecording
    case measurement
    case moviePlayback
    case videoChat
    case spokenAudio
    case voicePrompt
}

FrameworkEntityの extension init を作成することでDomainEntityをFrameworkEntityのAVAudioQuality, AVAudioSession.Mode, AVAudioSession.Category に変換するコードを書いてほしい

イメージは以下のようである

extension AVAudioQuality {
    init(from audioEncodeQuality: AudioEncodeQuality) {
        switch audioEncodeQuality {
        default:
            self = .high
        }
    }
}

---

## 🤖 Assistant
*2024-05-08 10:13:55*

Swift で `DomainEntity` の型を `FrameworkEntity` の型に変換するコードを書く際、Swift の強力な型システムを活用して、`AudioEncodeQuality`, `AudioSessionCategory`, `AudioSessionMode` それぞれに対する拡張を作成し、それらを AVFoundation の `AVAudioQuality`, `AVAudioSession.Category`, `AVAudioSession.Mode` に変換することができます。

以下のコードはそれぞれの enum に対する拡張として `init` を定義し、それぞれのケースに適切な AVFoundation の型を割り当てています。

```swift
import AVFoundation

public enum AudioEncodeQuality: CaseIterable {
    case min
    case low
    case medium
    case high
    case max
}

extension AVAudioQuality {
    init(from audioEncodeQuality: AudioEncodeQuality) {
        switch audioEncodeQuality {
        case .min:
            self = .min
        case .low:
            self = .low
        case .medium:
            self = .medium
        case .high:
            self = .high
        case .max:
            self = .max
        }
    }
}

public enum AudioSessionCategory: CaseIterable {
    case ambient
    case soloAmbient
    case playback
    case record
    case playAndRecord
    case multiRoute
}

extension AVAudioSession.Category {
    init(from audioSessionCategory: AudioSessionCategory) {
        switch audioSessionCategory {
        case .ambient:
            self = .ambient
        case .soloAmbient:
            self = .soloAmbient
        case .playback:
            self = .playback
        case .record:
            self = .record
        case .playAndRecord:
            self = .playAndRecord
        case .multiRoute:
            self = .multiRoute
        }
    }
}

public enum AudioSessionMode: CaseIterable {
    case `default`
    case voiceChat
    case gameChat
    case videoRecording
    case measurement
    case moviePlayback
    case videoChat
    case spokenAudio
    case voicePrompt
}

extension AVAudioSession.Mode {
    init(from audioSessionMode: AudioSessionMode) {
        switch audioSessionMode {
        case .`default`:
            self = .default
        case .voiceChat:
            self = .voiceChat
        case .gameChat:
            self = .gameChat
        case .videoRecording:
            self = .videoRecording
        case .measurement:
            self = .measurement
        case .moviePlayback:
            self = .moviePlayback
        case .videoChat:
            self = .videoChat
        case .spokenAudio:
            self = .spokenAudio
        case .voicePrompt:
            self = .voicePrompt
        }
    }
}
```

このコードは、Swift での enum の拡張機能を利用して `AVAudioQuality`, `AVAudioSession.Category`, `AVAudioSession.Mode` に簡単に変換する方法を示しています。これにより、`DomainEntity` から `FrameworkEntity` への変換がスムーズに行われます。

---
