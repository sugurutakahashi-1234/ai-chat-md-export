# Singleton WhisperKit解決

日付: 2024-05-15

---

## 👤 ユーザー
*2024/05/15 17:06:32*

let whisper = try await WhisperKit() の初期化に時間がかかっていることが判明した。
シングルトンをうまく使って解消したい。

final class TranscriptionDriver: Sendable {
    func transcribe(audioUrl: URL) async throws -&gt; [TranscriptionResult] {
        let whisper = try await WhisperKit()
        return try await whisper.transcribe(audioPath: audioUrl.path, decodeOptions:DecodingOptions.init(language: "ja"))
    }

    @available(*, deprecated, message: "Subject to removal in a future version. Use `transcribe(audioUrl: URL) async throws -> [TranscriptionResult]` instead.")
    func transcribe(audioUrl: URL) async throws -&gt; TranscriptionResult {
        let whisper = try await WhisperKit()
        guard let transcriptionResult = try await whisper.transcribe(audioPath: audioUrl.path, decodeOptions:DecodingOptions.init(language: "ja")) else {
            throw AppError.customError("unexpected")
        }
        return transcriptionResult
    }
}

---

## 🤖 アシスタント
*2024/05/15 17:06:43*

`WhisperKit` の初期化に時間がかかる場合、シングルトンパターンを使ってインスタンスを一度だけ生成し、それを再利用する方法が有効です。以下のように `WhisperKit` のインスタンスをシングルトンとして管理するように `TranscriptionDriver` クラスを変更できます。

```swift
final class TranscriptionDriver: Sendable {
    private static var sharedWhisperKit: WhisperKit?
    
    private func getWhisperKit() async throws -> WhisperKit {
        if let whisper = TranscriptionDriver.sharedWhisperKit {
            return whisper
        } else {
            let whisper = try await WhisperKit()
            TranscriptionDriver.sharedWhisperKit = whisper
            return whisper
        }
    }

    func transcribe(audioUrl: URL) async throws -> [TranscriptionResult] {
        let whisper = try await getWhisperKit()
        return try await whisper.transcribe(audioPath: audioUrl.path, decodeOptions: DecodingOptions(language: "ja"))
    }

    @available(*, deprecated, message: "Subject to removal in a future version. Use `transcribe(audioUrl: URL) async throws -> [TranscriptionResult]` instead.")
    func transcribe(audioUrl: URL) async throws -> TranscriptionResult {
        let whisper = try await getWhisperKit()
        guard let transcriptionResult = try await whisper.transcribe(audioPath: audioUrl.path, decodeOptions: DecodingOptions(language: "ja")) else {
            throw AppError.customError("unexpected")
        }
        return transcriptionResult
    }
}
```

このコードでは、`TranscriptionDriver` クラスに `sharedWhisperKit` という静的プロパティを追加しました。`getWhisperKit` メソッドで `WhisperKit` のインスタンスを取得し、まだ生成されていない場合は新しく生成してキャッシュするようにしています。これにより、`WhisperKit` の初期化が複数回行われることを防ぎ、初期化にかかる時間を最小限に抑えられます。

---

## 👤 ユーザー
*2024/05/15 17:07:59*

アプリ生成時に作成しておいてほしいんだ。。

---

## 🤖 アシスタント
*2024/05/15 17:08:16*

アプリの起動時に `WhisperKit` のインスタンスを生成しておき、後でそれを使用するように変更することができます。以下のように `TranscriptionDriver` クラスを更新し、`WhisperKit` のインスタンスをアプリの起動時に生成する方法を示します。

まず、`TranscriptionDriver` クラスをシングルトンとして実装し、`WhisperKit` のインスタンスを初期化します。

```swift
import Foundation

final class TranscriptionDriver: Sendable {
    static let shared = TranscriptionDriver()
    
    private var whisper: WhisperKit?
    
    private init() {
        Task {
            do {
                self.whisper = try await WhisperKit()
            } catch {
                print("Failed to initialize WhisperKit: \(error)")
            }
        }
    }
    
    private func getWhisperKit() async throws -> WhisperKit {
        while whisper == nil {
            try await Task.sleep(nanoseconds: 100_000_000) // 100ms
        }
        return whisper!
    }
    
    func transcribe(audioUrl: URL) async throws -> [TranscriptionResult] {
        let whisper = try await getWhisperKit()
        return try await whisper.transcribe(audioPath: audioUrl.path, decodeOptions: DecodingOptions(language: "ja"))
    }

    @available(*, deprecated, message: "Subject to removal in a future version. Use `transcribe(audioUrl: URL) async throws -> [TranscriptionResult]` instead.")
    func transcribe(audioUrl: URL) async throws -> TranscriptionResult {
        let whisper = try await getWhisperKit()
        guard let transcriptionResult = try await whisper.transcribe(audioPath: audioUrl.path, decodeOptions: DecodingOptions(language: "ja")) else {
            throw AppError.customError("unexpected")
        }
        return transcriptionResult
    }
}
```

このコードでは、`TranscriptionDriver` クラスをシングルトンとして定義し、そのインスタンスが生成されたときに `WhisperKit` のインスタンスを初期化します。初期化が完了するまで `getWhisperKit` メソッドは待機し、`WhisperKit` が利用可能になったらそれを返します。

次に、アプリの起動時に `TranscriptionDriver.shared` を初期化しておく必要があります。AppDelegate や SceneDelegate でこれを行うことができます。

```swift
import UIKit

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
    
    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Initialize TranscriptionDriver shared instance
        _ = TranscriptionDriver.shared
        
        return true
    }
}
```

このコードを追加することで、アプリの起動時に `TranscriptionDriver` のシングルトンインスタンスが初期化され、`WhisperKit` も同時に初期化されます。これにより、後で `TranscriptionDriver` を使用するときに初期化遅延を回避できます。

---

## 👤 ユーザー
*2024/05/15 17:08:34*

TranscriptionDriver をシングルトンにする必要はなくてWhisperKitだけでいいんだ

---

## 🤖 アシスタント
*2024/05/15 17:08:54*

User wants to use WhisperKit as a singleton, not TranscriptionDriver.

---

## 🔧 ツール
*2024/05/15 17:08:54*

Model set context updated.

---

## 🤖 アシスタント
*2024/05/15 17:08:54*

`WhisperKit` をシングルトンにする場合は、以下のように `WhisperKit` のシングルトンクラスを実装し、`TranscriptionDriver` でそのシングルトンインスタンスを使用するように変更できます。

まず、`WhisperKit` クラスをシングルトンとして定義します。

```swift
final class WhisperKit {
    static let shared = WhisperKit()
    
    private init() {}
    
    static func initialize() async throws {
        let instance = WhisperKit()
        // Assuming WhisperKit() is an async initializer, store the initialized instance
        WhisperKit.shared = instance
    }
    
    func transcribe(audioPath: String, decodeOptions: DecodingOptions) async throws -> [TranscriptionResult] {
        // Implement the actual transcription logic here
    }
}
```

次に、`TranscriptionDriver` クラスでこのシングルトンインスタンスを使用するように変更します。

```swift
final class TranscriptionDriver: Sendable {
    
    func transcribe(audioUrl: URL) async throws -> [TranscriptionResult] {
        let whisper = WhisperKit.shared
        return try await whisper.transcribe(audioPath: audioUrl.path, decodeOptions: DecodingOptions(language: "ja"))
    }

    @available(*, deprecated, message: "Subject to removal in a future version. Use `transcribe(audioUrl: URL) async throws -> [TranscriptionResult]` instead.")
    func transcribe(audioUrl: URL) async throws -> TranscriptionResult {
        let whisper = WhisperKit.shared
        guard let transcriptionResult = try await whisper.transcribe(audioPath: audioUrl.path, decodeOptions: DecodingOptions(language: "ja")) else {
            throw AppError.customError("unexpected")
        }
        return transcriptionResult
    }
}
```

最後に、アプリの起動時に `WhisperKit` の初期化を行います。

```swift
import UIKit

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
    
    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Initialize WhisperKit singleton
        Task {
            do {
                try await WhisperKit.initialize()
            } catch {
                print("Failed to initialize WhisperKit: \(error)")
            }
        }
        
        return true
    }
}
```

これにより、`WhisperKit` がアプリの起動時に一度だけ初期化され、`TranscriptionDriver` はそのシングルトンインスタンスを使用して音声の転記を行います。この方法で、`WhisperKit` の初期化にかかる時間を最小限に抑えることができます。

---

## 👤 ユーザー
*2024/05/15 17:10:29*

実行時ではなくinit時に生成しておきたい

final class TranscriptionDriver: Sendable {
    // 生成にとても時間がかかるので使い回す
    private static var sharedWhisperKit: WhisperKit?
    
    private func getWhisperKit() async throws -&gt; WhisperKit {
        if let whisper = TranscriptionDriver.sharedWhisperKit {
            return whisper
        } else {
            let whisper = try await WhisperKit()
            TranscriptionDriver.sharedWhisperKit = whisper
            return whisper
        }
    }

    func transcribe(audioUrl: URL) async throws -&gt; [TranscriptionResult] {
        let whisper = try await getWhisperKit()
        return try await whisper.transcribe(audioPath: audioUrl.path, decodeOptions:DecodingOptions.init(language: "ja"))
    }

    @available(*, deprecated, message: "Subject to removal in a future version. Use `transcribe(audioUrl: URL) async throws -> [TranscriptionResult]` instead.")
    func transcribe(audioUrl: URL) async throws -&gt; TranscriptionResult {
        let whisper = try await getWhisperKit()
        guard let transcriptionResult = try await whisper.transcribe(audioPath: audioUrl.path, decodeOptions:DecodingOptions.init(language: "ja")) else {
            throw AppError.customError("unexpected")
        }
        return transcriptionResult
    }
}

---

## 🤖 アシスタント
*2024/05/15 17:10:49*

`WhisperKit` のインスタンスをアプリの初期化時に生成し、`TranscriptionDriver` でそれを使用するように変更します。これにより、`WhisperKit` の初期化が遅延することを防ぎます。以下のようにコードを変更してください。

まず、`WhisperKit` をシングルトンとして定義し、初期化時に生成するようにします。

```swift
final class WhisperKit {
    static var shared: WhisperKit?
    
    private init() {}
    
    static func initialize() async throws {
        let instance = try await WhisperKit()
        WhisperKit.shared = instance
    }
    
    func transcribe(audioPath: String, decodeOptions: DecodingOptions) async throws -> [TranscriptionResult] {
        // 実際の転記ロジックをここに実装
    }
}
```

次に、`TranscriptionDriver` クラスを `WhisperKit.shared` を使用するように変更します。

```swift
final class TranscriptionDriver: Sendable {
    private func getWhisperKit() async throws -> WhisperKit {
        guard let whisper = WhisperKit.shared else {
            throw AppError.customError("WhisperKit is not initialized")
        }
        return whisper
    }

    func transcribe(audioUrl: URL) async throws -> [TranscriptionResult] {
        let whisper = try await getWhisperKit()
        return try await whisper.transcribe(audioPath: audioUrl.path, decodeOptions: DecodingOptions(language: "ja"))
    }

    @available(*, deprecated, message: "Subject to removal in a future version. Use `transcribe(audioUrl: URL) async throws -> [TranscriptionResult]` instead.")
    func transcribe(audioUrl: URL) async throws -> TranscriptionResult {
        let whisper = try await getWhisperKit()
        guard let transcriptionResult = try await whisper.transcribe(audioPath: audioUrl.path, decodeOptions: DecodingOptions(language: "ja")) else {
            throw AppError.customError("unexpected")
        }
        return transcriptionResult
    }
}
```

最後に、アプリの起動時に `WhisperKit` の初期化を行います。`AppDelegate` の `didFinishLaunchingWithOptions` メソッドで初期化を行います。

```swift
import UIKit

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
    
    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Initialize WhisperKit singleton
        Task {
            do {
                try await WhisperKit.initialize()
            } catch {
                print("Failed to initialize WhisperKit: \(error)")
            }
        }
        
        return true
    }
}
```

これにより、`WhisperKit` のインスタンスはアプリの起動時に生成され、その後 `TranscriptionDriver` によって使用されます。`WhisperKit` の初期化が一度だけ行われ、そのインスタンスが再利用されるため、初期化の遅延を防ぐことができます。

---
