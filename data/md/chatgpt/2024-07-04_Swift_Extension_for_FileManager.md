# Swift Extension for FileManager

日付: 2024-07-04

---

## 👤 ユーザー
*2024/7/4 14:01:13*

public enum FileManageDriver {
    public static func getDirectoryUrl(directoryType: LocalDiskDirectoryType) -&gt; URL {
        switch directoryType {
        case .documents:
            FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
        case .caches:
            FileManager.default.urls(for: .cachesDirectory, in: .userDomainMask).first!
        case .tmp:
            URL(fileURLWithPath: NSTemporaryDirectory(), isDirectory: true)
        }
    }


public enum LocalDiskDirectoryType {
    case documents
    case caches
    case tmp
}
 enum 側のextensionにしてほしい

---

## 🤖 アシスタント
*2024/7/4 14:01:21*

Certainly! To follow your request, I'll move the `getDirectoryUrl` method into an extension of `FileManageDriver` enum. Additionally, I'll provide the implementation for the `LocalDiskDirectoryType` enum. Here's the revised code:

```swift
public enum LocalDiskDirectoryType {
    case documents
    case caches
    case tmp
}

public enum FileManageDriver {}

public extension FileManageDriver {
    static func getDirectoryUrl(directoryType: LocalDiskDirectoryType) -> URL {
        switch directoryType {
        case .documents:
            return FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
        case .caches:
            return FileManager.default.urls(for: .cachesDirectory, in: .userDomainMask).first!
        case .tmp:
            return URL(fileURLWithPath: NSTemporaryDirectory(), isDirectory: true)
        }
    }
}
```

This setup places the `getDirectoryUrl` function within an extension of `FileManageDriver`, keeping your code organized and modular.

---

## 👤 ユーザー
*2024/7/4 14:01:57*

public enum LocalDiskDirectoryType {
    case documents
    case caches
    case tmp
    
    var directoryUrl: URL
}

---

## 🤖 アシスタント
*2024/7/4 14:02:06*

Certainly! You can add a computed property `directoryUrl` to the `LocalDiskDirectoryType` enum to return the appropriate URL for each case. Here's how you can do it:

```swift
public enum LocalDiskDirectoryType {
    case documents
    case caches
    case tmp
    
    var directoryUrl: URL {
        switch self {
        case .documents:
            return FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
        case .caches:
            return FileManager.default.urls(for: .cachesDirectory, in: .userDomainMask).first!
        case .tmp:
            return URL(fileURLWithPath: NSTemporaryDirectory(), isDirectory: true)
        }
    }
}

// Example usage
let documentsUrl = LocalDiskDirectoryType.documents.directoryUrl
let cachesUrl = LocalDiskDirectoryType.caches.directoryUrl
let tmpUrl = LocalDiskDirectoryType.tmp.directoryUrl
```

In this implementation, the `directoryUrl` computed property in the `LocalDiskDirectoryType` enum returns the appropriate URL based on the case. This approach encapsulates the logic within the enum, making it more cohesive and easier to use.

---
