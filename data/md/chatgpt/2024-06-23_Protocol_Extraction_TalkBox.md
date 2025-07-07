# Protocol Extraction TalkBox

日付: 2024-06-23

---

## 👤 ユーザー
*2024/6/23 13:37:39*

protocolのみ抽出して欲しい

    public func getTalkBox() async throws -&gt; \[TalkBox\] {
        (0...Int.random(in: 19...21)).map { \_ in
            let lastPostedAt: Date = .random
            return TalkBox(id: .uuid, imageUrl: .placeholderImageUrl(title: "\\(lastPostedAt.toString(.MMdd))"), lastPostedAt: lastPostedAt, hasUnreadThread: .random, isBookmarked: .random, isMuted: .random, threads: .randoms)
        }
    }

    public func postTalkBox(talkBox \_: TalkBox) async throws -&gt; TalkBox {
        let lastPostedAt: Date = .random
        return TalkBox(id: .uuid, imageUrl: .placeholderImageUrl(title: "\\(lastPostedAt.toString(.MMdd))"), lastPostedAt: lastPostedAt, hasUnreadThread: .random, isBookmarked: .random, isMuted: .random, threads: .randoms)
    }

    public func putTalkBox(talkBox: TalkBox) async throws -&gt; TalkBox {
        TalkBox(id: talkBox.id, imageUrl: talkBox.imageUrl, lastPostedAt: talkBox.lastPostedAt, hasUnreadThread: .random, isBookmarked: .random, isMuted: .random, threads: .randoms)
    }

    public func leaveTalkBox(talkBox \_: TalkBox) async throws {}

---

## 🤖 アシスタント
*2024/6/23 13:37:42*

Here is the protocol extracted from the given functions:

```swift
protocol TalkBoxService {
    func getTalkBox() async throws -> [TalkBox]
    func postTalkBox(talkBox: TalkBox) async throws -> TalkBox
    func putTalkBox(talkBox: TalkBox) async throws -> TalkBox
    func leaveTalkBox(talkBox: TalkBox) async throws
}
```

---
