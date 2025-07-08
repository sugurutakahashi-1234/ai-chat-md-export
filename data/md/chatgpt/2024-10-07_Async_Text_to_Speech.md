# Async Text to Speech

日付: 2024-10-07

---

## 👤 ユーザー
*2024/10/07 13:32:24*

func startTextToSpeech(speechText: SpeechText, speed: SpeechSpeed, speaker: Speaker) async throws { にしたい。

```swift
    func startTextToSpeech(speechText: SpeechText, speed: SpeechSpeed, speaker: Speaker, completion: @escaping (Result<Void, Error>) -> Void) {
        Task {
            do {
                if token == nil || region == nil {
                    let response = try await api.getToken()
                    token = response.token
                    region = response.region
                }

                guard let token = token, let region = region else { return }
                let speechConfig = try SPXSpeechConfiguration(authorizationToken: token, region: region)
                // NOTE: https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/2150
                speechConfig.setPropertyTo("false", by: SPXPropertyId.speechServiceConnectionSynthesisEnableCompressedAudioTransmission)
                let synthesizer = try SPXSpeechSynthesizer(speechConfig)
                self.synthesizer = synthesizer

                let result = try synthesizer.speakSsml(
                    createSsml(
                        text: speechText.formattedForTTS,
                        speaker: speaker,
                        speed: speed
                    )
                )

                if result.reason == .synthesizingAudioCompleted {
                    completion(.success(()))
                }
                if result.reason == SPXResultReason.canceled {
                    guard let cancellationDetails = try? SPXSpeechSynthesisCancellationDetails(fromCanceledSynthesisResult: result) else { return }
                    print("[text to speech] errorCode: \(cancellationDetails.errorCode)")
                    switch cancellationDetails.errorCode {
                    case SPXCancellationErrorCode.noError:
                        break
                    case SPXCancellationErrorCode.connectionFailure:
                        completion(.failure(SpeechError.connection))
                    case SPXCancellationErrorCode.authenticationFailure:
                        self.token = nil
                        self.region = nil
                        self.startTextToSpeech(speechText: speechText, speed: speed, speaker: speaker, completion: completion)
                    default:
                        completion(.failure(SpeechError.unknown))
                    }
                }
            } catch {
                print("[text to speech] error: \(error)")
                completion(.failure(SpeechError.unknown))
            }
        }
    }
```

---

## 🤖 アシスタント
*2024/10/07 13:32:40*

To convert the `startTextToSpeech` method into an `async throws` function, you need to adapt the existing code to remove the `completion` block and instead handle success and error cases using Swift's `async` and `throws` mechanisms. Here's how you can modify the function:

```swift
func startTextToSpeech(speechText: SpeechText, speed: SpeechSpeed, speaker: Speaker) async throws {
    if token == nil || region == nil {
        let response = try await api.getToken()
        token = response.token
        region = response.region
    }

    guard let token = token, let region = region else { return }
    let speechConfig = try SPXSpeechConfiguration(authorizationToken: token, region: region)
    
    // NOTE: https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/2150
    speechConfig.setPropertyTo("false", by: SPXPropertyId.speechServiceConnectionSynthesisEnableCompressedAudioTransmission)
    let synthesizer = try SPXSpeechSynthesizer(speechConfig)
    self.synthesizer = synthesizer

    let result = try synthesizer.speakSsml(
        createSsml(
            text: speechText.formattedForTTS,
            speaker: speaker,
            speed: speed
        )
    )

    if result.reason == .synthesizingAudioCompleted {
        return // Successful synthesis, no need to return anything
    }
    
    if result.reason == SPXResultReason.canceled {
        guard let cancellationDetails = try? SPXSpeechSynthesisCancellationDetails(fromCanceledSynthesisResult: result) else {
            throw SpeechError.unknown
        }
        print("[text to speech] errorCode: \(cancellationDetails.errorCode)")
        switch cancellationDetails.errorCode {
        case SPXCancellationErrorCode.noError:
            break
        case SPXCancellationErrorCode.connectionFailure:
            throw SpeechError.connection
        case SPXCancellationErrorCode.authenticationFailure:
            self.token = nil
            self.region = nil
            // Retry the request after resetting token and region
            try await startTextToSpeech(speechText: speechText, speed: speed, speaker: speaker)
        default:
            throw SpeechError.unknown
        }
    }
}
```

### Key Changes:
1. **Async Function**: Removed `completion` block and replaced it with `async throws` to manage the result using Swift concurrency.
2. **Throws Errors**: If an error occurs, the function throws `SpeechError` instead of calling the `completion(.failure(...))`.
3. **Retry Logic**: When authentication fails, it retries by calling `await` recursively.

This makes the function work in an async-await context and conforms to modern Swift concurrency patterns.

---

## 👤 ユーザー
*2024/10/07 13:33:26*

try await api.getToken() は Task ブロックでないと呼べないのでは？

---

## 🤖 アシスタント
*2024/10/07 13:33:44*

You're correct! Since `try await` can only be used inside an asynchronous context like a `Task` block or within an `async` function, and the Azure SDK you're working with might require running certain tasks on the main thread, you’ll need to properly manage the context. If `api.getToken()` or other async functions require being called in a separate task, here’s how you can adjust the code:

You can keep the main `startTextToSpeech` function `async throws` and ensure the API call is done within the async context without needing a `Task` block. Since `startTextToSpeech` is already an `async` function, you can directly use `await` in it without any issues.

Here’s the corrected version of your function:

```swift
func startTextToSpeech(speechText: SpeechText, speed: SpeechSpeed, speaker: Speaker) async throws {
    // No need for Task block as the function is already async
    if token == nil || region == nil {
        // This can be awaited directly since the function is async
        let response = try await api.getToken()
        token = response.token
        region = response.region
    }

    guard let token = token, let region = region else { return }
    let speechConfig = try SPXSpeechConfiguration(authorizationToken: token, region: region)
    
    // NOTE: https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/2150
    speechConfig.setPropertyTo("false", by: SPXPropertyId.speechServiceConnectionSynthesisEnableCompressedAudioTransmission)
    let synthesizer = try SPXSpeechSynthesizer(speechConfig)
    self.synthesizer = synthesizer

    let result = try synthesizer.speakSsml(
        createSsml(
            text: speechText.formattedForTTS,
            speaker: speaker,
            speed: speed
        )
    )

    if result.reason == .synthesizingAudioCompleted {
        return // Successful synthesis, no need to return anything
    }
    
    if result.reason == SPXResultReason.canceled {
        guard let cancellationDetails = try? SPXSpeechSynthesisCancellationDetails(fromCanceledSynthesisResult: result) else {
            throw SpeechError.unknown
        }
        print("[text to speech] errorCode: \(cancellationDetails.errorCode)")
        switch cancellationDetails.errorCode {
        case SPXCancellationErrorCode.noError:
            break
        case SPXCancellationErrorCode.connectionFailure:
            throw SpeechError.connection
        case SPXCancellationErrorCode.authenticationFailure:
            self.token = nil
            self.region = nil
            // Retry the request after resetting token and region
            try await startTextToSpeech(speechText: speechText, speed: speed, speaker: speaker)
        default:
            throw SpeechError.unknown
        }
    }
}
```

### Explanation:
- **`await` inside the async function**: Since `startTextToSpeech` is now an `async` function, you can call `try await api.getToken()` directly without wrapping it in a `Task` block. The `async` context handles asynchronous execution for you.
- The rest of the logic remains largely the same, and the function handles both success and error scenarios using `throws`.

Let me know if you need further clarification!

---
