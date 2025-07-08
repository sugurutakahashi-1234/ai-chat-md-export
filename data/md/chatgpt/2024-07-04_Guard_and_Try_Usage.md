# Guard and Try Usage

日付: 2024-07-04

---

## 👤 ユーザー
*2024/7/4 14:11:30*

guard文にするのと try? を try に買えてほしい

public final class CacheFileDriver: CacheFileDriverProtocol {
    public init() {
        OSLogger.initLog()
    }

    deinit {
        OSLogger.deinitLog()
    }

    public func loadImageFromCache(fileName: String, localDirectoryType: LocalDirectoryType = .caches) throws -&gt; UIImage {
        let cacheDirectory = localDirectoryType.directoryUrl
        let fileURL = cacheDirectory.appendingPathComponent(fileName)
        if let data = try? Data(contentsOf: fileURL), let image = UIImage(data: data) {
            return image
        }
        throw AppError.customError()
    }

    public func saveImageToCache(fileName: String, image: UIImage, localDirectoryType: LocalDirectoryType = .caches) throws {
        let cacheDirectory = localDirectoryType.directoryUrl
        let fileURL = cacheDirectory.appendingPathComponent(fileName)
        if let data = image.pngData() {
            do {
                try data.write(to: fileURL)
                print("Image saved to cache: \(fileURL)")
            } catch {
                throw AppError.customError()
            }
        } else {
            throw AppError.customError()
        }
    }
}

---

## 🤖 アシスタント
*2024/7/4 14:11:43*

Here is your updated `CacheFileDriver` class with `guard` statements and `try?` replaced with `try`.

```swift
public final class CacheFileDriver: CacheFileDriverProtocol {
    public init() {
        OSLogger.initLog()
    }

    deinit {
        OSLogger.deinitLog()
    }

    public func loadImageFromCache(fileName: String, localDirectoryType: LocalDirectoryType = .caches) throws -> UIImage {
        let cacheDirectory = localDirectoryType.directoryUrl
        let fileURL = cacheDirectory.appendingPathComponent(fileName)
        
        let data = try Data(contentsOf: fileURL)
        guard let image = UIImage(data: data) else {
            throw AppError.customError()
        }
        
        return image
    }

    public func saveImageToCache(fileName: String, image: UIImage, localDirectoryType: LocalDirectoryType = .caches) throws {
        let cacheDirectory = localDirectoryType.directoryUrl
        let fileURL = cacheDirectory.appendingPathComponent(fileName)
        
        guard let data = image.pngData() else {
            throw AppError.customError()
        }
        
        do {
            try data.write(to: fileURL)
            print("Image saved to cache: \(fileURL)")
        } catch {
            throw AppError.customError()
        }
    }
}
```

### Changes Made:
1. Replaced `if let data = try? Data(contentsOf: fileURL), let image = UIImage(data: data)` with `let data = try Data(contentsOf: fileURL)` and a `guard` statement to check for `UIImage(data: data)`.
2. Used `guard` statements for better readability and error handling.
3. Replaced `try?` with `try` for the `Data(contentsOf: fileURL)` function call.

---
