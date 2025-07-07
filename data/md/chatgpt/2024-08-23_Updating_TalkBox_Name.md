# Updating TalkBox Name

日付: 2024-08-23

---

## 👤 ユーザー
*2024/8/23 16:48:33*

public struct TalkBox: Sendable, Identifiable, Hashable {
    public let id: String
    public let name: String
    public let imageUrl: URL
    public let lastPostedAt: Date
    public let hasUnreadThread: Bool
    public let isBookmarked: Bool
    public let isMuted: Bool
    public let threads: \[TalkThread\]
    public let accounts: \[Account\]
}

extension TalkBox {
    func updatedName(\_ newName: String) -&gt; TalkBox {
        
    }
}

---

## 🤖 アシスタント
*2024/8/23 16:48:45*

To implement the `updatedName` method in the `TalkBox` struct, you can create a new instance of `TalkBox` with the updated name while keeping the rest of the properties unchanged. Here's how you can do it:

```swift
extension TalkBox {
    func updatedName(_ newName: String) -> TalkBox {
        return TalkBox(
            id: self.id,
            name: newName,
            imageUrl: self.imageUrl,
            lastPostedAt: self.lastPostedAt,
            hasUnreadThread: self.hasUnreadThread,
            isBookmarked: self.isBookmarked,
            isMuted: self.isMuted,
            threads: self.threads,
            accounts: self.accounts
        )
    }
}
```

This method returns a new `TalkBox` instance with the `name` updated to `newName`, while all other properties remain the same.

---

## 👤 ユーザー
*2024/8/23 16:57:14*

func updatedIsMuted(\_ newIsMuted: Bool) -&gt; TalkBox {}

---

## 🤖 アシスタント
*2024/8/23 16:57:23*

To implement the `updatedIsMuted` method in the `TalkBox` struct, you can follow a similar approach to the `updatedName` method. Here's how you can do it:

```swift
extension TalkBox {
    func updatedIsMuted(_ newIsMuted: Bool) -> TalkBox {
        return TalkBox(
            id: self.id,
            name: self.name,
            imageUrl: self.imageUrl,
            lastPostedAt: self.lastPostedAt,
            hasUnreadThread: self.hasUnreadThread,
            isBookmarked: self.isBookmarked,
            isMuted: newIsMuted,
            threads: self.threads,
            accounts: self.accounts
        )
    }
}
```

This method returns a new `TalkBox` instance with the `isMuted` property updated to `newIsMuted`, while all other properties remain the same.

---
