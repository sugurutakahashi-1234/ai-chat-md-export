# Transcribe Audio File Async

日付: 2024-07-16

---

## 👤 ユーザー
*2024/07/16 18:49:44*

要約された文字列が返された

public func transcribe(audioUrl: URL) async throws -&gt; [String] {
        let recognizer = try await getRecognizer()
        let request = SFSpeechURLRecognitionRequest(url: audioUrl)

        return try await withCheckedThrowingContinuation { continuation in
            recognizer.recognitionTask(with: request) { result, error in
                if let error {
                    if error.localizedDescription == "No speech detected" {
                        continuation.resume(throwing: TranscriptionDriverError.noSpeechDetected)
                    } else {
                        continuation.resume(throwing: error)
                    }
                    return
                }

                if let result {
                    if result.isFinal {
                        continuation.resume(returning: [result.bestTranscription.formattedString])
                    }
                }
            }
        }
    }

---

## 🤖 アシスタント
*2024/07/16 18:49:54*

こちらは、音声ファイルのURLを受け取り、その音声を文字起こしする関数です。この関数は、`SFSpeechRecognizer`を使用して音声認識を行い、文字起こしの結果を配列として返します。途中でエラーが発生した場合は、そのエラーをスローします。以下に要約された内容を示します。

```swift
public func transcribe(audioUrl: URL) async throws -&gt; [String] {
    // 音声認識器を取得
    let recognizer = try await getRecognizer()
    // 音声URLを使用して認識リクエストを作成
    let request = SFSpeechURLRecognitionRequest(url: audioUrl)

    // 文字起こしタスクを非同期で実行
    return try await withCheckedThrowingContinuation { continuation in
        recognizer.recognitionTask(with: request) { result, error in
            if let error {
                // エラーが「No speech detected」の場合、特定のエラーをスロー
                if error.localized

---
