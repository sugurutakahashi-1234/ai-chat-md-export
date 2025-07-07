# Transkripsi WhisperKit & SpeechFramework

日付: 2024-05-17

---

## 👤 ユーザー
*2024/5/17 18:54:46*

この画面でWhisperKitによる文字起こしと、Apple の Speech Framework による文字起こしを比較できるような画面を作ってほしい。

Apple の Speech Framework による文字起こし未実装でありSpeechFrameworkranscriptionDriverとして、実装してほしい

import Combine
import Foundation
@preconcurrency import WhisperKit

extension TranscriptionResult: Identifiable {
    public var id: String {
        timings.pipelineStart.description
    }
}

@MainActor
final class TranscriptionPresenter: ObservableObject {
    @Published var transcriptionResults: \[TranscriptionResult\] = \[\]
    @Published var isLoading: Bool = false
    @Published var appError: AppError?
    @Published var showAlert: Bool = false
    
    let audioUrl: URL
    
    private let transcriptionDriver: TranscriptionDriver = TranscriptionDriver()

    init(audioUrl: URL) {
        self.audioUrl = audioUrl
    }

    func onApper() {}
    
    func onTapTranscribe() async {
        isLoading = true
        defer {
            isLoading = false
        }

        do {
            transcriptionResults = try await transcriptionDriver.transcribe(audioUrl: audioUrl)
        } catch {
            OSLogger.errorLog("Failed to read audio files: \\(error)")
            appError = error.toAppError
            showAlert = true
        }
    }
}
 import SwiftUI

@MainActor
struct TranscriptionView: View {
    @StateObject private var presenter: TranscriptionPresenter

    init(audioUrl: URL) {
        \_presenter = .init(wrappedValue: .init(audioUrl: audioUrl))
    }
    
    var body: some View {
        VStack {
            Button {
                Task {
                    await presenter.onTapTranscribe()
                }
                
            } label: {
                Text("翻訳する")
            }
            
            List(presenter.transcriptionResults) { result in
                Text(result.text)
            }
        }
        .navigationTitle("文字起こし")
        .overlayLoading(isPresented: $presenter.isLoading, isGestureReactable: true)
        .onAppear {
            presenter.onApper()
        }
    }
}


final class TranscriptionDriver: Sendable {
    // WhisperKit の生成に時間がかかるかもしれないので使い回そうとしているが不要かもしれない
    nonisolated(unsafe) private static var sharedWhisperKit: WhisperKit?

    init() {
        Task {
            do {
                OSLogger.debugLog("init WhisperKit")
                TranscriptionDriver.sharedWhisperKit = try await WhisperKit()
                OSLogger.debugLog("create WhisperKit")
            } catch {
                OSLogger.debugLog("Failed to initialize WhisperKit: \\(error)")
            }
        }
    }
    
    private func getWhisperKit() async throws -&gt; WhisperKit {
        if let whisper = TranscriptionDriver.sharedWhisperKit {
            return whisper
        } else {
            let whisper = try await WhisperKit()
            TranscriptionDriver.sharedWhisperKit = whisper
            return whisper
        }
    }

    // TODO: TranscriptionResult の抽象化
    func transcribe(audioUrl: URL) async throws -&gt; \[TranscriptionResult\] {
        OSLogger.debugLog("start transcribe")
        let whisper = try await getWhisperKit()
        let transcriptionResults: \[TranscriptionResult\] = try await whisper.transcribe(audioPath: audioUrl.path, decodeOptions:DecodingOptions.init(language: "ja"))
        OSLogger.debugLog("language: \\(transcriptionResults.first!.language)")
        OSLogger.debugLog("text: \\(transcriptionResults.first!.text)")
        OSLogger.debugLog("allWords: \\(transcriptionResults.first!.allWords)")
        OSLogger.debugLog("segments: \\(transcriptionResults.first!.segments)")
        OSLogger.debugLog("timings: \\(transcriptionResults.first!.timings)")
        OSLogger.debugLog("fullPipeline: \\(transcriptionResults.first!.timings.fullPipeline)")
        return transcriptionResults
    }
}

---

## 🤖 アシスタント
*2024/5/17 18:55:13*

User wants to create a screen to compare transcriptions using WhisperKit and Apple's Speech Framework, and they need an implementation for SpeechFrameworkranscriptionDriver to handle transcriptions with the Apple Speech Framework.

---

## 🔧 ツール
*2024/5/17 18:55:13*

Model set context updated.

---

## 🤖 アシスタント
*2024/5/17 18:55:13*

To implement a screen that allows comparing transcriptions using WhisperKit and Apple's Speech Framework, you need to create a `SpeechFrameworkTranscriptionDriver` and modify your `TranscriptionPresenter` and `TranscriptionView` to handle both transcription methods. Here’s how you can do it:

1. **Implement `SpeechFrameworkTranscriptionDriver`:**

```swift
import Foundation
import Speech

final class SpeechFrameworkTranscriptionDriver: Sendable {
    func transcribe(audioUrl: URL) async throws -> [TranscriptionResult] {
        let recognizer = SFSpeechRecognizer(locale: Locale(identifier: "ja-JP"))!
        let request = SFSpeechURLRecognitionRequest(url: audioUrl)
        
        return try await withCheckedThrowingContinuation { continuation in
            recognizer.recognitionTask(with: request) { result, error in
                if let error = error {
                    continuation.resume(throwing: error)
                    return
                }
                
                if let result = result {
                    let transcriptionResult = TranscriptionResult(
                        text: result.bestTranscription.formattedString,
                        // Assuming you have the necessary details to populate these fields
                        language: "ja",
                        allWords: result.bestTranscription.segments.map { $0.substring },
                        segments: [], // Populate with necessary segments data
                        timings: Timings(pipelineStart: Date(), fullPipeline: Date())
                    )
                    continuation.resume(returning: [transcriptionResult])
                }
            }
        }
    }
}
```

2. **Update `TranscriptionPresenter` to handle both drivers:**

```swift
@MainActor
final class TranscriptionPresenter: ObservableObject {
    @Published var whisperTranscriptionResults: [TranscriptionResult] = []
    @Published var speechFrameworkTranscriptionResults: [TranscriptionResult] = []
    @Published var isLoading: Bool = false
    @Published var appError: AppError?
    @Published var showAlert: Bool = false
    
    let audioUrl: URL
    
    private let whisperTranscriptionDriver = TranscriptionDriver()
    private let speechFrameworkTranscriptionDriver = SpeechFrameworkTranscriptionDriver()

    init(audioUrl: URL) {
        self.audioUrl = audioUrl
    }

    func onApper() {}
    
    func onTapTranscribe() async {
        isLoading = true
        defer {
            isLoading = false
        }

        do {
            async let whisperResults = whisperTranscriptionDriver.transcribe(audioUrl: audioUrl)
            async let speechFrameworkResults = speechFrameworkTranscriptionDriver.transcribe(audioUrl: audioUrl)
            
            whisperTranscriptionResults = try await whisperResults
            speechFrameworkTranscriptionResults = try await speechFrameworkResults
        } catch {
            OSLogger.errorLog("Failed to transcribe audio files: \(error)")
            appError = error.toAppError
            showAlert = true
        }
    }
}
```

3. **Update `TranscriptionView` to display results from both drivers:**

```swift
import SwiftUI

@MainActor
struct TranscriptionView: View {
    @StateObject private var presenter: TranscriptionPresenter

    init(audioUrl: URL) {
        _presenter = .init(wrappedValue: .init(audioUrl: audioUrl))
    }
    
    var body: some View {
        VStack {
            Button {
                Task {
                    await presenter.onTapTranscribe()
                }
                
            } label: {
                Text("翻訳する")
            }
            
            List {
                Section(header: Text("WhisperKit Transcriptions")) {
                    ForEach(presenter.whisperTranscriptionResults) { result in
                        Text(result.text)
                    }
                }
                Section(header: Text("Speech Framework Transcriptions")) {
                    ForEach(presenter.speechFrameworkTranscriptionResults) { result in
                        Text(result.text)
                    }
                }
            }
        }
        .navigationTitle("文字起こし")
        .overlayLoading(isPresented: $presenter.isLoading, isGestureReactable: true)
        .onAppear {
            presenter.onApper()
        }
    }
}
```

This implementation will allow you to compare the transcriptions from WhisperKit and Apple's Speech Framework side by side. Make sure you have the necessary error handling and UI adjustments to fit your needs.

---

## 👤 ユーザー
*2024/5/17 19:02:36*

SpeechFrameworkTranscriptionDriver は func transcribe(audioUrl: URL) async throws -&gt; SFSpeechRecognitionRequest のインターフェースで一旦大丈夫

---

## 🤖 アシスタント
*2024/5/17 19:02:54*

了解しました。では、`SpeechFrameworkTranscriptionDriver` をシンプルにして、`SFSpeechRecognitionRequest` を返すように変更します。また、`TranscriptionPresenter` と `TranscriptionView` を対応させます。

### SpeechFrameworkTranscriptionDriver

```swift
import Foundation
import Speech

final class SpeechFrameworkTranscriptionDriver: Sendable {
    func transcribe(audioUrl: URL) async throws -> SFSpeechRecognitionRequest {
        let request = SFSpeechURLRecognitionRequest(url: audioUrl)
        return request
    }
}
```

### TranscriptionPresenter の更新

```swift
@MainActor
final class TranscriptionPresenter: ObservableObject {
    @Published var whisperTranscriptionResults: [TranscriptionResult] = []
    @Published var speechFrameworkTranscriptionRequest: SFSpeechRecognitionRequest?
    @Published var isLoading: Bool = false
    @Published var appError: AppError?
    @Published var showAlert: Bool = false
    
    let audioUrl: URL
    
    private let whisperTranscriptionDriver = TranscriptionDriver()
    private let speechFrameworkTranscriptionDriver = SpeechFrameworkTranscriptionDriver()

    init(audioUrl: URL) {
        self.audioUrl = audioUrl
    }

    func onApper() {}
    
    func onTapTranscribe() async {
        isLoading = true
        defer {
            isLoading = false
        }

        do {
            async let whisperResults = whisperTranscriptionDriver.transcribe(audioUrl: audioUrl)
            async let speechFrameworkRequest = speechFrameworkTranscriptionDriver.transcribe(audioUrl: audioUrl)
            
            whisperTranscriptionResults = try await whisperResults
            speechFrameworkTranscriptionRequest = try await speechFrameworkRequest
        } catch {
            OSLogger.errorLog("Failed to transcribe audio files: \(error)")
            appError = error.toAppError
            showAlert = true
        }
    }
}
```

### TranscriptionView の更新

```swift
import SwiftUI

@MainActor
struct TranscriptionView: View {
    @StateObject private var presenter: TranscriptionPresenter

    init(audioUrl: URL) {
        _presenter = .init(wrappedValue: .init(audioUrl: audioUrl))
    }
    
    var body: some View {
        VStack {
            Button {
                Task {
                    await presenter.onTapTranscribe()
                }
                
            } label: {
                Text("翻訳する")
            }
            
            List {
                Section(header: Text("WhisperKit Transcriptions")) {
                    ForEach(presenter.whisperTranscriptionResults) { result in
                        Text(result.text)
                    }
                }
                Section(header: Text("Speech Framework Transcriptions")) {
                    if let request = presenter.speechFrameworkTranscriptionRequest {
                        // Assuming you handle the Speech Framework transcription display logic here
                        Text("Speech Framework Request ready for processing")
                    } else {
                        Text("No transcriptions available")
                    }
                }
            }
        }
        .navigationTitle("文字起こし")
        .overlayLoading(isPresented: $presenter.isLoading, isGestureReactable: true)
        .onAppear {
            presenter.onApper()
        }
    }
}
```

この変更により、`SpeechFrameworkTranscriptionDriver` は `SFSpeechRecognitionRequest` を返すようになり、`TranscriptionPresenter` と `TranscriptionView` はこれを受け取って適切に表示します。 `Speech Framework` の文字起こし結果の表示ロジックは、さらに追加する必要があります。

---
