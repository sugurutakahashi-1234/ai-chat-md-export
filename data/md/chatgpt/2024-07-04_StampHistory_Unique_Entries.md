# StampHistory Unique Entries

日付: 2024-07-04

---

## 👤 ユーザー
*2024/7/4 10:43:38*

StampHistory の配列に stamp を追加していく処理で同じstampを持つもので振るものは非表示にしたい。

public struct StampHistory: Codable {
    public let stamp: Stamp
    public let postedAt: Date
    
    public init(stamp: Stamp, postedAt: Date) {
        self.stamp = stamp
        self.postedAt = postedAt
    }
}



public struct Stamp: Sendable, Codable, Identifiable, Hashable, Equatable {
    public let id: String
    public let name: String
    public let imageUrl: URL
    public let type: StampType

    public init(id: String, name: String, imageUrl: URL, type: StampType) {
        self.id = id
        self.name = name
        self.imageUrl = imageUrl
        self.type = type
    }
}

---

## 🤖 アシスタント
*2024/7/4 10:43:59*

To achieve the goal of adding a new stamp to a `StampHistory` array while ensuring that only the most recent entry for each unique stamp is visible, you can use a dictionary to keep track of the most recent `StampHistory` for each `Stamp`. Here's how you can implement this:

1. Create a dictionary to store the latest `StampHistory` for each unique `Stamp`.
2. Add the new `StampHistory` to the dictionary, which will overwrite any existing entry with the same `Stamp`.
3. Convert the dictionary values back into an array to get the final list of `StampHistory` items, ensuring only the most recent entries are present.

Here is the implementation in Swift:

```swift
public struct StampHistory: Codable {
    public let stamp: Stamp
    public let postedAt: Date
    
    public init(stamp: Stamp, postedAt: Date) {
        self.stamp = stamp
        self.postedAt = postedAt
    }
}

public struct Stamp: Sendable, Codable, Identifiable, Hashable, Equatable {
    public let id: String
    public let name: String
    public let imageUrl: URL
    public let type: StampType

    public init(id: String, name: String, imageUrl: URL, type: StampType) {
        self.id = id
        self.name = name
        self.imageUrl = imageUrl
        self.type = type
    }
}

var stampHistories: [StampHistory] = []

func addStampHistory(_ newHistory: StampHistory) {
    var latestHistories = [Stamp: StampHistory]()

    // Add existing histories to the dictionary
    for history in stampHistories {
        latestHistories[history.stamp] = history
    }

    // Add or update the new history in the dictionary
    latestHistories[newHistory.stamp] = newHistory

    // Convert the dictionary values back to an array
    stampHistories = Array(latestHistories.values)
}

// Example usage
let stamp1 = Stamp(id: "1", name: "Stamp1", imageUrl: URL(string: "http://example.com/stamp1.png")!, type: .someType)
let stamp2 = Stamp(id: "2", name: "Stamp2", imageUrl: URL(string: "http://example.com/stamp2.png")!, type: .someType)

addStampHistory(StampHistory(stamp: stamp1, postedAt: Date()))
addStampHistory(StampHistory(stamp: stamp2, postedAt: Date()))
addStampHistory(StampHistory(stamp: stamp1, postedAt: Date().addingTimeInterval(60)))

print(stampHistories) // This will print the most recent entries for each stamp
```

In this code:

- `latestHistories` is a dictionary that maps each unique `Stamp` to the most recent `StampHistory`.
- When a new `StampHistory` is added, it updates the dictionary, ensuring only the most recent entry for each `Stamp` is kept.
- Finally, the dictionary values are converted back to an array to update the `stampHistories` array.

This approach ensures that duplicate stamps are replaced with their most recent history entry.

---
