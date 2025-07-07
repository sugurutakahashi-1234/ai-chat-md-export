# getResearch using Amplify

日付: 2023-08-16

---

## 👤 ユーザー
*2023/8/16 17:07:44*

for in でうまく書きたい。（日本語でお願い）

    public func getResearches(measurementType: EmomilCore.MeasurementType?) async throws -&gt; \[EmomilCore.Research\] {
        let request: GraphQLRequest = .listResearches(measurement\_type: MeasurementType(from: measurementType))

        LoggerContainer.requestLog(request: request)
        // measurement\_type が nil の場合は全件取得になる
        let result = try await Amplify.API.query(request: request)

        switch result {
        case .success(let resultData):
            LoggerContainer.responseLog(request: request, response: resultData)
            return try await resultData.map { convertToDomainEntity(amplifyResearch: $0) }

        case .failure(let error):
            LoggerContainer.logError(ApiRequestManagerError.requestError(error.toString).toAppError)
            throw error
        }
    }

    func convertToDomainEntity(amplifyResearch: Research) async throws -&gt; EmomilCore.Research {
        await .init(
            id: amplifyResearch.id,
            title: amplifyResearch.title,
            openingAt: amplifyResearch.opening\_at.foundationDate,
            closingAt: amplifyResearch.closing\_at.foundationDate,
            imageUrl: try amplifyStorageManager.getURL(key: amplifyResearch.image\_uri),
            instructions: amplifyResearch.instructions,
            rewardPoints: amplifyResearch.reward\_points,
            orgName: amplifyResearch.org\_name,
            duration: amplifyResearch.duration,
            isCompleted: amplifyResearch.success,
            measurements: amplifyResearch.measurements.map { EmomilCore.Measurement(from: $0) }
        )
    }

---

## 🤖 アシスタント
*2023/8/16 17:08:02*

お示しいただいたコードは、指定された`measurementType`に基づいてリサーチを取得する関数と、Amplifyから返されたリサーチをドメインエンティティに変換する関数の2つを含むものと思われます。こちらは現状、非常にきれいに書かれています。

もしこの中で`for in`を使って何か特定の操作をしたい場合、具体的な要件や目的を教えていただけますか？ それに基づき、より効率的なコードの提案や改善案を提供できるかと思います。

---

## 👤 ユーザー
*2023/8/16 17:09:44*

resultData.map { convertToDomainEntity(amplifyResearch: $0) } のところがエラーになっている。
AsyncSequence をつかいたいんだ＼

---

## 🤖 アシスタント
*2023/8/16 17:10:22*

了解しました。非同期での操作を行う場合、Swift 5.5以降の新しい非同期APIを利用して`AsyncSequence`を使います。

`resultData`が非同期のシーケンスである場合、その内容を非同期にマップするには以下の方法を試してみてください：

```swift
public func getResearches(measurementType: EmomilCore.MeasurementType?) async throws -> [EmomilCore.Research] {
    let request: GraphQLRequest = .listResearches(measurement_type: MeasurementType(from: measurementType))

    LoggerContainer.requestLog(request: request)
    // measurement_type が nil の場合は全件取得になる
    let result = try await Amplify.API.query(request: request)

    switch result {
    case .success(let resultData):
        LoggerContainer.responseLog(request: request, response: resultData)
        
        // 非同期マッピング
        var domainResearches: [EmomilCore.Research] = []
        for try await amplifyResearch in resultData {
            let domainResearch = try await convertToDomainEntity(amplifyResearch: amplifyResearch)
            domainResearches.append(domainResearch)
        }
        return domainResearches

    case .failure(let error):
        LoggerContainer.logError(ApiRequestManagerError.requestError(error.toString).toAppError)
        throw error
    }
}
```

上記の変更では、`for try await`ループを使って、非同期のシーケンスからデータを一つずつ取得して`convertToDomainEntity`関数を呼び出し、その結果を`domainResearches`配列に追加しています。

---

## 👤 ユーザー
*2023/8/16 17:12:28*

ThrowingTaskGroup だともっと綺麗に書けないかな？

---

## 🤖 アシスタント
*2023/8/16 17:13:16*

もちろん、`ThrowingTaskGroup`を使用すると、非同期のタスクを並行して実行しながら結果を集めることができます。これにより、全ての`amplifyResearch`要素に対して`convertToDomainEntity`関数を同時に実行し、結果をより迅速に得ることができる可能性があります。

以下は`ThrowingTaskGroup`を使用して書き換えたコードの例です：

```swift
public func getResearches(measurementType: EmomilCore.MeasurementType?) async throws -> [EmomilCore.Research] {
    let request: GraphQLRequest = .listResearches(measurement_type: MeasurementType(from: measurementType))

    LoggerContainer.requestLog(request: request)
    // measurement_type が nil の場合は全件取得になる
    let result = try await Amplify.API.query(request: request)

    switch result {
    case .success(let resultData):
        LoggerContainer.responseLog(request: request, response: resultData)

        return try await withThrowingTaskGroup(of: EmomilCore.Research.self) { group in
            // 非同期マッピング
            for amplifyResearch in resultData {
                group.addTask {
                    return try await convertToDomainEntity(amplifyResearch: amplifyResearch)
                }
            }
            var domainResearches: [EmomilCore.Research] = []
            for try await domainResearch in group {
                domainResearches.append(domainResearch)
            }
            return domainResearches
        }

    case .failure(let error):
        LoggerContainer.logError(ApiRequestManagerError.requestError(error.toString).toAppError)
        throw error
    }
}
```

上記のコードでは、`withThrowingTaskGroup`内で各`amplifyResearch`要素に対してタスクを追加しています。これにより、各タスクが並行して実行され、結果は`domainResearches`配列に集められます。

---

## 👤 ユーザー
*2023/8/16 17:46:08*

try await convertToDomainEntity(amplifyResearch: amplifyResearch) について、selfがないと怒られたのだが、これは今日参照にならないのか？

---

## 🤖 アシスタント
*2023/8/16 17:46:58*

はい、`withThrowingTaskGroup` や `TaskGroup` の中のクロージャでは、明示的に `self` を参照する必要があります。これはクロージャが `self` をキャプチャするかどうかを明確にするためです。クロージャ内で `self` を明示的に使用することで、メモリリークや循環参照を防ぐための意識を高めることができます。

以下のように、クロージャの中でメソッドやプロパティを使用する場合、`self` を明示的に参照する必要があります。

```swift
group.addTask {
    return try await self.convertToDomainEntity(amplifyResearch: amplifyResearch)
}
```

しかし、このままだと `self` が循環参照を引き起こす可能性があります。そのため、クロージャ内で `self` をキャプチャする際には、 `[weak self]` または `[unowned self]` を使用してメモリリークを防ぐことが推奨されます。

以下は `[weak self]` を使用した例です：

```swift
group.addTask { [weak self] in
    guard let self = self else { throw SomeError() } // エラーの型は適切なものに変更してください
    return try await self.convertToDomainEntity(amplifyResearch: amplifyResearch)
}
```

この方法で、循環参照のリスクを回避しつつ、クロージャ内でクラスのメソッドやプロパティを安全に使用することができます。

---
