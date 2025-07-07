# Async Let for Multiple Tasks

日付: 2023-08-19

---

## 👤 ユーザー
*2023/8/19 12:13:59*

以下をasync letで書き換えて欲しい


    func onAppear() async {
        do {
            user = try await apiRequestManager.getUser()
            userAttributeContents = try await apiRequestManager.getUserAttributeContents()
            userAttributes = try await apiRequestManager.getUserAttributes()
            pointHistories = try await apiRequestManager.getPoints()
            researches = try await apiRequestManager.getResearches(measurementType: nil)
            measurements = try await getMeasurementDetails(researches: researches)
        } catch {
            LoggerContainer.logError(error.toAppError)
            isShownAlert = true
        }
    }

---

## 🤖 アシスタント
*2023/8/19 12:14:22*

`async let`を使用すると、複数の非同期タスクを同時に開始し、後で結果を待機することができます。これにより、非同期タスクの実行時間を短縮できる可能性があります。以下が`async let`を使用して書き換えた`onAppear`関数の例です。

```swift
func onAppear() async {
    do {
        async let userResponse = apiRequestManager.getUser()
        async let userAttributeContentsResponse = apiRequestManager.getUserAttributeContents()
        async let userAttributesResponse = apiRequestManager.getUserAttributes()
        async let pointHistoriesResponse = apiRequestManager.getPoints()
        async let researchesResponse = apiRequestManager.getResearches(measurementType: nil)

        // Await all the results
        user = try await userResponse
        userAttributeContents = try await userAttributeContentsResponse
        userAttributes = try await userAttributesResponse
        pointHistories = try await pointHistoriesResponse
        let researches = try await researchesResponse

        // Fetch measurements after researches have been fetched
        measurements = try await getMeasurementDetails(researches: researches)
    } catch {
        LoggerContainer.logError(error.toAppError)
        isShownAlert = true
    }
}
```

このように書くことで、最初の5つのAPIリクエストは同時に実行され、それぞれの結果を後で取得します。ただし、`getMeasurementDetails`関数は`researches`の取得が完了した後にのみ実行されるようにしています。

---
