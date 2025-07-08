# Ordering Internal Publisher Steps

日付: 2023-06-29

---

## 👤 ユーザー
*2023/6/29 20:21:35*

publisher内部の処理順を上から順にしたい。

NotificationCenter.default
            .publisher(for: .AVPlayerItemDidPlayToEndTime, object: avPlayer.currentItem).sink { [weak self] _ in
                guard let self else { return }
                self.anchorAndEmotionAnalysisInteractor.send(interaction: .init(eventType: .videoEnded(.init(source: "")))) // 本来 Web イベントのため空文字でよい
                Task {
                    await self.uploadAnalysisResults()
                }
                self.resultType = .didComplete
                self.videoPlayingStatus = .didEnd
            }
            .store(in: &cancellableSet)

    func uploadAnalysisResults() async {
        guard let userId = userDefaultsManager.appUserId.value else {
            assertionFailure("unexpected")
            return
        }
        do {
            try await anchorAndEmotionAnalysisInteractor.uploadAnalysisResults(measurementId: movie.id, userId: userId, sessionId: sessionId)
        } catch {
            appError = error.asAppError
        }
    }

---

## 🤖 アシスタント
*2023/6/29 20:22:36*

あなたが提示したコードは、`AVPlayerItemDidPlayToEndTime`イベントを処理するもので、このイベントが発生したときに`sink`の中で以下の処理が行われます：

1. `anchorAndEmotionAnalysisInteractor.send(interaction: .init(eventType: .videoEnded(.init(source: ""))))` : 分析インタラクタにビデオ終了イベントを送信します。
2. `uploadAnalysisResults()` : 分析結果をアップロードします。この関数は非同期で実行されます。
3. `resultType = .didComplete` : 結果タイプを`didComplete`に設定します。
4. `videoPlayingStatus = .didEnd` : ビデオ再生状態を`didEnd`に設定します。

ただし、`Task {}`は新しい非同期タスクを生成するので、その中で呼び出される`uploadAnalysisResults()`関数はその他の処理とは非同期に実行されます。そのため、すぐに次の`resultType = .didComplete`と`videoPlayingStatus = .didEnd`の行が実行され、それらの行は`uploadAnalysisResults()`の完了を待たないで実行されます。

もし、`uploadAnalysisResults()`が完了するまで待ち、その後に`resultType = .didComplete`と`videoPlayingStatus = .didEnd`を設定したい場合は、`Task {}`を使わずに直接`await`キーワードを使用することで非同期関数を同期的に実行することができます。その場合、コードは以下のようになります：

```swift
NotificationCenter.default
    .publisher(for: .AVPlayerItemDidPlayToEndTime, object: avPlayer.currentItem)
    .receive(on: DispatchQueue.main) // Ensure that changes to `resultType` and `videoPlayingStatus` are made on the main thread
    .sink { [weak self] _ in
        guard let self else { return }
        self.anchorAndEmotionAnalysisInteractor.send(interaction: .init(eventType: .videoEnded(.init(source: "")))) // 本来 Web イベントのため空文字でよい
        do {
            try await self.uploadAnalysisResults()
            self.resultType = .didComplete
            self.videoPlayingStatus = .didEnd
        } catch {
            print("Error in uploadAnalysisResults: \(error)")
        }
    }
    .store(in: &cancellableSet)
```

ただし、この変更により`.sink`が含まれる全体のコードが非同期になります。この変更が可能かどうかは、全体のアプリケーションのアーキテクチャと使用しているSwiftのバージョンによります。Swift 5.5以降が必要です。

---
