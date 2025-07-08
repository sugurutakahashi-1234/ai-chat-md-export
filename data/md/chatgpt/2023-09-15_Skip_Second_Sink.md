# Skip Second Sink

Date: 2023-09-15

---

## 👤 User
*2023-09-15 20:30:47*

以下の処理で、
.sink { [weak self] _ in
                LoggerContainer.log(.fulfillAllInteractionConditionRequirement(.init()))
                self?.enableSessionEndedButton()
            }
のブロックに来た時に、
.sink { [weak self] interactionCondition in
                LoggerContainer.log(.matchInteractionCondition(.init(interactionConditionId: interactionCondition.id)))
                self?.handleTimeSeriesDataUseCase.send(interaction: .init(eventType: .conditionPartCompleted(.init(id: interactionCondition.id, eventType: interactionCondition.eventTypeName, parameters: "\(interactionCondition.parameters)"))))
            }
を実行しないように制御する方法を教えて欲しい。

        interactionConditionMatchingDriver.matchedInteractionConditionPublisher
            .sink { [weak self] interactionCondition in
                LoggerContainer.log(.matchInteractionCondition(.init(interactionConditionId: interactionCondition.id)))
                self?.handleTimeSeriesDataUseCase.send(interaction: .init(eventType: .conditionPartCompleted(.init(id: interactionCondition.id, eventType: interactionCondition.eventTypeName, parameters: "\(interactionCondition.parameters)"))))
            }
            .store(in: &cancellables)

        interactionConditionMatchingDriver.matchedInteractionConditionIdsPublisher
            .compactMap { [weak self] matchedInteractionConditionIds in
                guard let self, let requirementType = self.websiteMeasurement.requirementType else {
                    return nil
                }
                return self.interactionConditionMatchingDriver.allRequirementsFulfilled(requirementType: requirementType, matchedInteractionConditionIds: matchedInteractionConditionIds)
            }
            .filter { $0 }
            .first() // filter -&gt; first で条件を満たした場合の一度しか処理が通過しないようにする
            .sink { [weak self] _ in
                LoggerContainer.log(.fulfillAllInteractionConditionRequirement(.init()))
                self?.enableSessionEndedButton()
            }
            .store(in: &cancellables)

---

## 🤖 Assistant
*2023-09-15 20:31:59*

指定された処理に基づいて、`.sink` ブロックが一度呼び出された後に、他の `.sink` ブロックを実行しないようにする方法を示します。

この制御を行うための一般的な方法は、状態変数を使用して実行状態を追跡することです。この変数をチェックして、必要に応じて特定の `.sink` ブロックをスキップすることができます。

具体的なステップは以下のとおりです。

1. 状態変数を追加します。この変数は、最初の `.sink` ブロックがすでに実行されたかどうかを示します。
2. 最初の `.sink` ブロックの実行時に、この変数を更新します。
3. ２番目の `.sink` ブロックの最初に、この変数をチェックして、ブロックの残りの部分を実行するかどうかを決定します。

コードは以下のようになります。

```swift
// 1. 状態変数を追加します
var isPrimarySinkExecuted = false

interactionConditionMatchingDriver.matchedInteractionConditionPublisher
    .sink { [weak self] interactionCondition in
        // 3. ２番目の `.sink` ブロックの最初に、この変数をチェックします
        guard !isPrimarySinkExecuted else { return }
        
        LoggerContainer.log(.matchInteractionCondition(.init(interactionConditionId: interactionCondition.id)))
        self?.handleTimeSeriesDataUseCase.send(interaction: .init(eventType: .conditionPartCompleted(.init(id: interactionCondition.id, eventType: interactionCondition.eventTypeName, parameters: "\(interactionCondition.parameters)"))))
    }
    .store(in: &cancellables)

interactionConditionMatchingDriver.matchedInteractionConditionIdsPublisher
    .compactMap { [weak self] matchedInteractionConditionIds in
        guard let self, let requirementType = self.websiteMeasurement.requirementType else {
            return nil
        }
        return self.interactionConditionMatchingDriver.allRequirementsFulfilled(requirementType: requirementType, matchedInteractionConditionIds: matchedInteractionConditionIds)
    }
    .filter { $0 }
    .first() // filter -> first で条件を満たした場合の一度しか処理が通過しないようにする
    .sink { [weak self] _ in
        LoggerContainer.log(.fulfillAllInteractionConditionRequirement(.init()))
        self?.enableSessionEndedButton()
        
        // 2. 最初の `.sink` ブロックの実行時に、この変数を更新します
        isPrimarySinkExecuted = true
    }
    .store(in: &cancellables)
```

これにより、`isPrimarySinkExecuted` が `true` の場合、２番目の `.sink` ブロックの内容は実行されません。

---

## 👤 User
*2023-09-15 20:32:04*

状態変数を使わずにうまくCombineの仕組みを使って制御したい。
たとえば、.prefix(untilOutputFrom:) だったり、他にもいい方法があればそれを使って欲しい。

---

## 🤖 Assistant
*2023-09-15 20:32:54*

Combineフレームワークを使用して状態変数を使わずに制御を行いたい場合、`.prefix(untilOutputFrom:)` を使って特定のイベントが発生するまで他のストリームからの出力を制限することができます。

あなたの例で考えると、`matchedInteractionConditionIdsPublisher` からの出力に基づいて `matchedInteractionConditionPublisher` の出力を制限したいと思われるので、以下のように実装できます。

```swift
let fulfillAllInteractionSignal = interactionConditionMatchingDriver.matchedInteractionConditionIdsPublisher
    .compactMap { [weak self] matchedInteractionConditionIds in
        guard let self, let requirementType = self.websiteMeasurement.requirementType else {
            return nil
        }
        return self.interactionConditionMatchingDriver.allRequirementsFulfilled(requirementType: requirementType, matchedInteractionConditionIds: matchedInteractionConditionIds)
    }
    .filter { $0 }
    .first()

interactionConditionMatchingDriver.matchedInteractionConditionPublisher
    .prefix(untilOutputFrom: fulfillAllInteractionSignal)
    .sink { [weak self] interactionCondition in
        LoggerContainer.log(.matchInteractionCondition(.init(interactionConditionId: interactionCondition.id)))
        self?.handleTimeSeriesDataUseCase.send(interaction: .init(eventType: .conditionPartCompleted(.init(id: interactionCondition.id, eventType: interactionCondition.eventTypeName, parameters: "\(interactionCondition.parameters)"))))
    }
    .store(in: &cancellables)

fulfillAllInteractionSignal
    .sink { [weak self] _ in
        LoggerContainer.log(.fulfillAllInteractionConditionRequirement(.init()))
        self?.enableSessionEndedButton()
    }
    .store(in: &cancellables)
```

このコードは、`matchedInteractionConditionPublisher` のストリームが `fulfillAllInteractionSignal` からの出力を受け取るまで、`.sink` ブロックを実行します。一度 `fulfillAllInteractionSignal` から出力があると、`matchedInteractionConditionPublisher` のストリームの `.sink` ブロックの実行はストップします。

---
