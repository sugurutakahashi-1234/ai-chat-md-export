# Refactoring Amplify API Requests

日付: 2023-09-17

---

## 👤 ユーザー
*2023/09/17 22:32:09*

繰り返しの処理がある気がしている。
うまくまとめられないのか？

public final class AmplifyApiRequestManager: ApiRequestManagerProtocol {
    private let amplifyStorageManager = AmplifyStorageManager()
    
    public init() {}
    
    public func getUser() async throws -&gt; EmomilCore.User {
        let request: GraphQLRequest = .getUser()
        
        LoggerContainer.requestLog(request: request)
        let result = try await Amplify.API.query(request: request)
        
        switch result {
        case .success(let resultData):
            LoggerContainer.responseLog(request: request, response: resultData)
            return .init(from: resultData)
            
        case .failure(let error):
            LoggerContainer.logError(ApiRequestManagerError.requestError(error.toString).toAppError)
            throw error
        }
    }

    public func getResearches(measurementType: EmomilCore.MeasurementType?) async throws -&gt; [EmomilCore.Research] {
        let request: GraphQLRequest = .listResearches(measurement_type: MeasurementType(from: measurementType))

        LoggerContainer.requestLog(request: request)
        // measurement_type が nil の場合は全件取得になる
        let result = try await Amplify.API.query(request: request)

        switch result {
        case .success(let resultData):
            LoggerContainer.responseLog(request: request, response: resultData)
            return try await convertToDomainEntity(amplifyResearchs: resultData)

        case .failure(let error):
            LoggerContainer.logError(ApiRequestManagerError.requestError(error.toString).toAppError)
            throw error
        }
    }

    public func getResearch(id: String) async throws -&gt; EmomilCore.Research {
        let request: GraphQLRequest = .getResearch(id: id)

        LoggerContainer.requestLog(request: request)
        let result = try await Amplify.API.query(request: request)

        switch result {
        case .success(let resultData):
            LoggerContainer.responseLog(request: request, response: resultData)
            return try await convertToDomainEntity(amplifyResearch: resultData)

        case .failure(let error):
            LoggerContainer.logError(ApiRequestManagerError.requestError(error.toString).toAppError)
            throw error
        }
    }

    public func getOrCreateDevice(device: EmomilCore.DeviceInfo) async throws -&gt; EmomilCore.DomainDevice {
        let request: GraphQLRequest = .getOrCreateDevice(
            name: device.modelIdentifier,
            screen_width: device.screenWidth,
            screen_height: device.screenHeight,
            pixels_per_point: device.pixelsPerPoint ?? 0 // TODO: Amplify Deviceモデルにこのパラーメーターがないため、暫定的にアンラップしている
        )

        LoggerContainer.requestLog(request: request)
        let result = try await Amplify.API.mutate(request: request)

        switch result {
        case .success(let resultData):
            LoggerContainer.responseLog(request: request, response: resultData)
            return .init(from: resultData)

        case .failure(let error):
            LoggerContainer.logError(ApiRequestManagerError.requestError(error.toString).toAppError)
            throw error
        }
    }
}

private extension LoggerContainer {
    static func requestLog(request: GraphQLRequest&lt;some Decodable&gt;, level: EmomilCore.LogLevel = .notice, file: String = #file, function: String = #function, line: Int = #line) {
        LoggerContainer.log(.requestApiServer(.init(request: String(describing: request))), level: level, file: file, function: function, line: line)
    }

    static func responseLog&lt;R: Decodable&gt;(request: GraphQLRequest&lt;R&gt;, response: R, level: EmomilCore.LogLevel = .notice, file: String = #file, function: String = #function, line: Int = #line) {
        LoggerContainer.log(.responseApiServer(.init(request: String(describing: request), response: String(describing: response))), level: level, file: file, function: function, line: line)
    }
}

---

## 🤖 アシスタント
*2023/09/17 22:33:11*

あなたが挙げたコードには、APIリクエストを行い、結果をロギングする繰り返しのパターンが見受けられます。この処理をまとめるために、汎用的な関数を導入して冗長性を減らすことができます。

以下はその一例です：

```swift
public final class AmplifyApiRequestManager: ApiRequestManagerProtocol {
    private let amplifyStorageManager = AmplifyStorageManager()
    
    public init() {}

    // この関数を通してAPIのクエリー処理とエラーハンドリングを一括で行います
    private func performRequest<T: Decodable>(_ request: GraphQLRequest<T>) async throws -> T {
        LoggerContainer.requestLog(request: request)
        
        let result = try await Amplify.API.query(request: request)
        
        switch result {
        case .success(let resultData):
            LoggerContainer.responseLog(request: request, response: resultData)
            return resultData
            
        case .failure(let error):
            LoggerContainer.logError(ApiRequestManagerError.requestError(error.toString).toAppError)
            throw error
        }
    }

    public func getUser() async throws -> EmomilCore.User {
        let request: GraphQLRequest = .getUser()
        let resultData: YourExpectedResponseType = try await performRequest(request) // YourExpectedResponseType は適切な型に置き換えてください
        return .init(from: resultData)
    }

    public func getResearches(measurementType: EmomilCore.MeasurementType?) async throws -> [EmomilCore.Research] {
        let request: GraphQLRequest = .listResearches(measurement_type: MeasurementType(from: measurementType))
        let resultData: YourExpectedResponseType = try await performRequest(request) // YourExpectedResponseType は適切な型に置き換えてください
        return try await convertToDomainEntity(amplifyResearchs: resultData)
    }

    // ... (他のメソッドも同様にリファクタリングします)

    // LoggerContainer はそのまま維持
}
```

このリファクタリングにより、`performRequest`という汎用的な関数を通じてAPIリクエストを行うことができ、各メソッド内の繰り返しを大幅に減らすことができます。ただし、具体的な返却型（上記の`YourExpectedResponseType`）や他の詳細は、実際のAPIや環境に合わせて調整する必要があります。

---
