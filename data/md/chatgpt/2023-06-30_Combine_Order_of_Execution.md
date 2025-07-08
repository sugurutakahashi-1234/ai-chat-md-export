# Combine Order of Execution

日付: 2023-06-30

---

## 👤 ユーザー
*2023/06/30 19:02:21*

SwiftのCombineについての質問です。
passthroughsubjectに値をsendしてして、それをサブスクライブしている処理で、別の配列にappendしています。

このとき、全く別の処理でsend(completion: .finished) したとき、別の配列にappendする処理と .sink { [weak self] completion in } の .finished の処理はどっちが先に終えるのか？

sampleSubject
            .sink { [weak self] completion in
                switch completion {
                case .finished:

                case .failure(let error):
                    
                }
            } receiveValue: { [weak self] num in
                self?.array.append(num)
            }
            .store(in: &cancellableSet)

---

## 🤖 アシスタント
*2023/06/30 19:03:01*

Combineフレームワークでは、publisherがデータをemitするたびに、それに対応するsubscriberにそのデータが送信され、それぞれのsubscriberがデータを処理します。この処理は非同期に行われることが多いです。

しかし、`send(completion: .finished)`が呼ばれた場合、これはpublisherがもうこれ以上のデータを送信しないことを示す特別な信号であり、すべてのsubscriberへ送られます。

Combineはすべてのデータイベントが順序通りに送信されることを保証します。つまり、あるデータイベントが完了するまで、次のデータイベントは送信されません。したがって、`send(completion: .finished)`が呼び出されると、その時点で未処理のデータイベント（この場合、append操作を含む）はすべて完了してからでなければ、`.finished`イベントは送信されません。

したがって、全く別の処理で`send(completion: .finished)`が呼び出された場合でも、すでにqueueに入っている`append`操作はすべて完了し、その後で初めて`.finished`の処理が行われます。

このため、質問の回答としては、配列へのappend処理が完了した後に、`.sink`ブロック内の`.finished`の処理が実行されます。

---
