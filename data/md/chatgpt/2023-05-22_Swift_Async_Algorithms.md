# Swift Async Algorithms

日付: 2023-05-22

---

## 👤 ユーザー
*2023/5/23 0:58:11*

以下を要点をまとめて解説して欲しい

♪ instrumental hip hop music ♪ Hi, my name's Philippe. Swift has a growing catalog of open source packages. I am pleased to introduce you to one of the newest additions: Swift Async Algorithms. This package is alongside the other packages, like Swift Collections and Swift Algorithms. The Swift Async Algorithms package is a set of algorithms specifically focused on processing values over time using AsyncSequence. But before we get into it, let's take a brief moment to recap AsyncSequence. AsyncSequence is a protocol that lets you describe values produced asynchronously. Basically, it's just like Sequence, but has two key differences. The next function from its iterator is asynchronous, being that it can deliver values using Swift concurrency. It also lets you handle any potential failures using Swift's throw effect. And just like sequence, you can iterate it, using the for-await-in syntax. In short, if you know how to use Sequence, you already know how to use AsyncSequence. Now, when AsyncSequence was introduced, we added in almost all the tools you would expect to find with Sequence right there with the async versions. You have algorithms like map, filter, reduce, and more. The Swift Async Algorithms package takes this a step further by incorporating more advanced algorithms, as well as interoperating with clocks to give you some really powerful stuff. This is an open source package of AsyncSequence algorithms that augment Swift concurrency. Last year we introduced the Swift Algorithms package. To demonstrate the uses of those algorithms, we made a messaging app. This was a great example of some of the rich and powerful things you can do with that package. We decided there were a number of really good opportunities to take advantage of migrating the app to use Swift concurrency. To highlight just a few of the asynchronous algorithms, I'm gonna take you through some of the things that we used and how they work. First off, we have a family of algorithms for working with multiple input AsyncSequences. These are algorithms focused on combining AsyncSequences together in different ways. But they all share one characteristic: They take multiple input AsyncSequences and produce one output AsyncSequence.

One you might already be familiar with is Zip. The Zip algorithm takes multiple inputs and iterates them such that it produces a tuple of the results from each of the bases. Each of the inputs to Zip are the bases that the Zip is constructed from. The asynchronous Zip algorithm works just like the Zip algorithm in the standard library, but it iterates each of the bases concurrently and rethrows errors if a failure occurs on iterating any of them. Now, accomplishing that concurrent iteration with rethrowing errors can be rather involved. But the Swift Async Algorithms package took care of all of that for us in our messaging app. We previously had a lot of code coordinating asynchronously generating previews of video recordings and transcoding video into multiple sizes for efficient storage and transmission. By using Zip we can ensure that the transcoded video gets a preview when we send it off to the server. Since Zip is concurrent, neither the transcoding or the preview will delay each other. But this goes a bit further. Zip itself has no preference on which side produced a value first or not, so a video could be produced first or a preview, and no matter which side it is, it will await for the other to send a complete tuple. We can await the pairs such that they can be uploaded together because Zip awaits each side concurrently to construct a tuple of the values. We came to the conclusion that modeling our incoming messages as an AsyncSequence made a lot of sense. So we decided to use AsyncStream to handle those messages since it preserves order and turns our callbacks into an AsyncSequence of messages. One of the requested features we needed to tackle is that we wanted to support multiple accounts. So each account creates an AsyncStream of incoming messages, but when implementing this, we need to handle them all together as one singular AsyncSequence. This means we needed an algorithm for merging those AsyncSequences together. Thankfully the Swift Async Algorithms package has an algorithm for exactly that, aptly named "Merge." It works similarly to Zip in the regards that it concurrently iterates multiple AsyncSequences. But instead of creating paired tuples, it requires the bases to share the same element type and merges the base AsyncSequences into one singular AsyncSequence of those elements. Merge works by taking the first element produced by any of the sides when iterated. It keeps iterating until there are no more values that could be produced, specifically when all base AsyncSequences return nil from their iterator. If any of the bases produces an error, the other iterations are cancelled. This lets us take the AsyncSequences of messages and merge them. These combining algorithms work concurrently on when values are produced, but sometimes it is useful to actually interact with time itself. The Swift Async Algorithms package brings in a family of algorithms to work with time by leveraging the new Clock API in Swift. Time itself can be a really complex subject, and new in Swift (5.7) are a set of APIs to make that safe and consistent: Clock, Instant, and Duration.

The Clock protocol defines two primitives, a way to wake up after a given instant and a way to produce a concept of now. There are a few built in clocks. Two of the more common ones are the ContinuousClock and the SuspendingClock. You can use the ContinuousClock to measure time just like a stopwatch, where time progresses no matter the state of the thing being measured. The SuspendingClock, on the other hand, does what its name implies; it suspends when the machine is put to sleep. We used the new clock API in our app to migrate from existing callback events to clock sleep function to handle dismissing alerts after a deadline. We were able to create the deadline by adding a duration value that indicated specifically the number of seconds we wanted to delay. Clock also has some handy methods to measure the elapsed duration of execution of work. Here we have those two common clocks I mentioned earlier, the SuspendingClock and ContinuousClock.

Below are displays showing the potential elapsed duration of work being measured. The key difference between these two clocks comes from its behavior when the machine is asleep.

For long running work like these, the work can be paused, just as we did here, but when we resume the execution, the ContinuousClock has progressed while the machine was asleep, but the SuspendingClock did not. Commonly, this difference can be the key detail to make sure things like animations work as expected by suspending the timing of the execution. If you need to interact with time in relation to the machine, like for animations, use the SuspendingClock.

Measuring tasks in relation to the human in front of the device is better suited for the ContinuousClock. So if you need to delay by an absolute duration, something relative to humans, use the ContinuousClock. The Swift Async Algorithms package uses these new Clock, Instant, and Duration types to build generic algorithms for dealing with many of the concepts of how events are processed with regards to time. In our messaging app, we found these really helpful for providing precise control over events. It let us rate limit interactions and efficiently buffer messages.

Perhaps the most prominent area that we utilized time was searching messages. We created a controller that manages a channel of results. The channel marshals search results from the search task back to our UI. The search task itself needed to have some specific characteristics with regards to time. We wanted to make sure to rate limit searching sent messages on the server.

The algorithm Debounce awaits a quiescence period before it emits the next values when iterated. It means that events can come in fast, but we want to make sure to wait for a quiet period before dealing with values. When user input from a search field is changed rapidly, we don't want the search controller to fire off a search request for each change. Instead, we want to make sure to wait for a quiet period when we're certain typing was likely to be done. By default, the Debounce algorithm will use the ContinuousClock. In this case, we can debounce the input such that it awaits a specified duration while nothing has occurred. Clocks and durations are not just used for debouncing, but they're used for other algorithms too. One area that we found that was really useful was sending batches of messages to the server. In the Swift algorithms package, there's a set of algorithms to chunk values. The Swift Async Algorithms package offers those, but also adds a set of versions that interoperate with clocks and durations. The family of chunking algorithms allow for control over chunks by count, by time, or by content. If an error occurs in any of these, that error is rethrown, so our code is safe when it comes to failures.

We used the "chunked(by:)" API to ensure that chunks of messages are serialized and sent off by a certain elapsed duration. That way, our server gets efficient packets sent from the clients. We were able to use this API to build batches of messages every 500 milliseconds. That way, if someone's really excited and typing really fast, the requests sent to the server are grouped up. When working with collections and sequence, it's often useful and performant to lazily process elements. AsyncSequence works much like how the lazy algorithms work in the Swift standard library. But just like those lazy algorithms, there are often times where you need to move back into the world of collections. The Swift Async Algorithms package offers a set of initializers for constructing collections using AsyncSequence. These let you build up dictionaries, sets, or arrays with input AsyncSequences that are known to be finite. The collection initializers let us build in conversions right into our initialization of messages and keep our data types as Array. This was really useful since we had numerous features that really could use some updating to use Swift concurrency. And by keeping our existing data structures, we can migrate parts of our app incrementally and where it makes sense. So far, we've just gone over just a handful of the highlights of Swift Async Algorithms package. There are a whole lot more than just what we've covered today. We have algorithms ranging from combining multiple AsyncSequences, rate limiting by time, breaking things into chunks, but those were just the highlights that we ended up using extensively in our app. This package has a lot more than just those. It ranges from buffering, reducing, joining, to injecting values intermittently, and more. The Swift Async Algorithms package takes the set of algorithms for dealing with things over time and expands it to a wide range of advanced functionality that can help you in your apps. Try it out. We're really excited to discover what you build with these, and that excitement is shared. This package is being developed in the open with you. Thanks for watching, and enjoy the rest of the conference. ♪ instrumental hip hop music ♪

---

## 🤖 アシスタント
*2023/5/23 0:59:37*

Philippeは、Swiftの新しいパッケージ、Swift Async Algorithmsの紹介を行います。これはSwiftのオープンソースパッケージ群に新たに加わったもので、Swift CollectionsやSwift Algorithmsと並んでいます。Swift Async Algorithmsパッケージは、AsyncSequenceを使って時間経過で値を処理するためのアルゴリズムのセットに特化しています。

AsyncSequenceは、非同期に生成される値を記述するためのプロトコルで、基本的にはSequenceと同じですが、イテレーターのnext関数が非同期であり、Swiftの並行性を使用して値を配信できるという2つの重要な違いがあります。また、Swiftのthrow効果を使用して潜在的な失敗を処理することもできます。そしてSequenceと同様に、for-await-in構文を使用して反復処理が可能です。

AsyncSequenceが導入された際に、SwiftはSequenceと同等のツールを非同期バージョンとして提供しました。これにはmap、filter、reduceなどのアルゴリズムが含まれています。Swift Async Algorithmsパッケージは、より高度なアルゴリズムを取り入れ、さらに時計との相互運用性を提供することで、これを一歩進めています。

Philippeは、複数の入力AsyncSequencesを処理するためのアルゴリズム群や、Swiftの新しいClock APIを活用した時間を扱うためのアルゴリズム群など、Swift Async Algorithmsパッケージが提供する主要な機能を紹介しています。特に、非同期Zipアルゴリズムは、複数の入力を同時に反復処理し、各入力からの結果のタプルを生成します。また、Mergeアルゴリズムは、同じ要素型を共有する複数のAsyncSequencesを一つのAsyncSequenceにマージします。

Swiftの新しいClock APIは、時間を扱うための安全で一貫性のあるセットのAPIを提供します。これにはClock、Instant、Durationが含まれています。Philippeは、アプリケーションでClock APIを使用して、アラートの解除を期限後に処理するためのスリープ機能への移行を行ったことを紹介しています。

Swift Async Algorithmsパッケージは、Clock、Instant、Durationタイプを使用して、時間に関連するイベントの処理方法に関する一般的なアルゴリズムを構築します。メッセージの検索では、ユーザーの入力が急速に変

---

## 👤 ユーザー
*2023/5/23 1:01:02*

つづき

---

## 🤖 アシスタント
*2023/5/23 1:02:06*

わると、検索コントローラーが各変更ごとに検索リクエストを発行するのではなく、タイピングが終了したと考えられる静止期間を待つようにしたいと述べています。これは、Debounceアルゴリズムを用いて、指定した期間何も起きない場合に待機するという動作を実現しています。

また、Swift Async Algorithmsパッケージでは、値の塊を作るためのアルゴリズムも提供されています。これにより、一定の時間が経過したらメッセージの塊をシリアライズして送信することができます。これにより、クライアントからサーバーへ効率的にパケットが送信されます。

さらに、Swift Async Algorithmsパッケージは、有限のAsyncSequencesを入力としてコレクションを構築するための一連の初期化子も提供しています。これにより、メッセージの初期化に変換を組み込んで、データ型をArrayとして保持することができます。これは非常に便利で、既存のデータ構造を維持しながら、アプリケーションの一部を段階的にSwiftの並行性を使用するように移行できます。

Swift Async Algorithmsパッケージには、さまざまな機能がありますが、Philippeはその一部だけを紹介しています。他にも、バッファリング、リデュース、ジョイニング、間隔的な値の注入など、多岐にわたる高度な機能を提供しています。これらの機能を使って、あなたのアプリケーションに役立てることができます。

最後にPhilippeは、このパッケージがオープンソースで開発されており、皆さんの参加を歓迎していることを強調しています。彼は皆さんがこれらの機能を使って何を構築するか、非常に興奮していると言っています。

---
