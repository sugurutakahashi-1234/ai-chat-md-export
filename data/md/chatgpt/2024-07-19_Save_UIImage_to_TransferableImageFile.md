# Save UIImage to TransferableImageFile

日付: 2024-07-19

---

## 👤 ユーザー
*2024/07/19 20:09:27*

activityItem が UIImageの場合はテンポラリーに画像を保存してそのURLをTransferableImageFileに保存したい


    func onTapShowActivityController(activityItem: Any) {
        self.activityItem = activityItem
        showActivityController = true
    }

public struct TransferableImageFile: Transferable {
    public let imageUrl: URL
    
    public init(imageUrl: URL) {
        self.imageUrl = imageUrl
    }
    
    public static var transferRepresentation: some TransferRepresentation {
        ProxyRepresentation(exporting: \.imageUrl)
    }
}

---

## 🤖 アシスタント
*2024/07/19 20:09:45*

`activityItem` が `UIImage` の場合、一時的に画像を保存し、そのURLを `TransferableImageFile` に保存するコードを以下に示します。これには、画像を一時ファイルに保存する機能を追加し、そのURLを使って `TransferableImageFile` のインスタンスを作成する手順が含まれています。

まず、`UIImage` を一時ファイルに保存するためのヘルパーメソッドを作成します。

```swift
import SwiftUI
import Foundation
import UniformTypeIdentifiers

func saveImageToTemporaryDirectory(image: UIImage) -> URL? {
    let tempDirectory = FileManager.default.temporaryDirectory
    let fileName = UUID().uuidString + ".png"
    let fileURL = tempDirectory.appendingPathComponent(fileName)
    
    guard let data = image.pngData() else { return nil }
    
    do {
        try data.write(to: fileURL)
        return fileURL
    } catch {
        print("Error saving image to temporary directory: \(error)")
        return nil
    }
}

func onTapShowActivityController(activityItem: Any) {
    if let image = activityItem as? UIImage, let imageUrl = saveImageToTemporaryDirectory(image: image) {
        let transferableImageFile = TransferableImageFile(imageUrl: imageUrl)
        // Handle the transferableImageFile as needed
        // e.g., present activity view controller with transferableImageFile
    } else {
        // Handle other types of activityItem
        self.activityItem = activityItem
        showActivityController = true
    }
}

public struct TransferableImageFile: Transferable {
    public let imageUrl: URL
    
    public init(imageUrl: URL) {
        self.imageUrl = imageUrl
    }
    
    public static var transferRepresentation: some TransferRepresentation {
        ProxyRepresentation(exporting: \.imageUrl)
    }
}
```

上記のコードでは、`UIImage` を一時ファイルに保存し、そのファイルのURLを `TransferableImageFile` に渡しています。これにより、`TransferableImageFile` を用いた転送が可能になります。

`onTapShowActivityController` メソッドで、`activityItem` が `UIImage` であるかを確認し、そうであれば一時ファイルに保存し、そのURLを使って `TransferableImageFile` を作成します。その他の型の `activityItem` に対しては、従来の処理を実行します。

---

## 👤 ユーザー
*2024/07/19 20:10:49*

保存先のURLは引数で渡せるようにしたいのと、エラーをスローしたいのとFileManageStaticDriverの一つで定義したい

public enum FileManageStaticDriver {
    public static func createDirectoryIfNeeded(at url: URL) throws {
        if !FileManager.default.fileExists(atPath: url.path) {
            try FileManager.default.createDirectory(at: url, withIntermediateDirectories: true, attributes: nil)
        }
    }

    public static func getFiles(directory: URL, extensions: [FileExtension]) throws -&gt; [URL] {
        try FileManager.default.contentsOfDirectory(at: directory, includingPropertiesForKeys: nil).filter { fileUrl in
            extensions.contains { $0.rawValue == fileUrl.pathExtension }
        }
    }

    public static func removeItemIfExists(at url: URL) throws {
        if FileManager.default.fileExists(atPath: url.path) {
            try FileManager.default.removeItem(at: url)
        }
    }

    public static func clearDirectoryContents(directory: URL) throws {
        let contents = try FileManager.default.contentsOfDirectory(atPath: directory.path)
        try contents.forEach { content in
            try removeItemIfExists(at: directory.appendingPathComponent(content))
        }
    }

    public static func loadImage(fileName: String, directory: URL) throws(FileManageDriverError) -&gt; UIImage {
        let fileUrl = directory.appendingPathComponent(fileName)

        do {
            let data = try Data(contentsOf: fileUrl)

            guard let image = UIImage(data: data) else {
                OSLogger.errorLog(FileManageDriverError.unexpected.toAppError)
                throw FileManageDriverError.unexpected
            }

            OSLogger.debugLog("Completed: load image cache URL: \(fileUrl)")
            return image
        } catch {
            // OSLogger.errorLog(error.toAppError) 正常系のためエラーログは不要である
            throw FileManageDriverError.fileNotFound
        }
    }

    public static func saveImage(fileName: String, image: UIImage, directory: URL) throws(FileManageDriverError) {
        let fileUrl = directory.appendingPathComponent(fileName)

        guard let data = image.pngData() else {
            OSLogger.errorLog(FileManageDriverError.unexpected.toAppError)
            throw FileManageDriverError.unexpected
        }

        do {
            try data.write(to: fileUrl)
            OSLogger.debugLog("Completed: save image cache URL: \(fileUrl)")
        } catch {
            OSLogger.errorLog(error.toAppError)
            throw FileManageDriverError.unexpected
        }
    }

    public static func getDirectorySize(directory: URL) throws(FileManageDriverError) -&gt; Int {
        let fileManager = FileManager.default
        let resourceKeys: [URLResourceKey] = [.isRegularFileKey, .fileSizeKey]

        guard let enumerator = fileManager.enumerator(at: directory, includingPropertiesForKeys: resourceKeys) else {
            throw FileManageDriverError.unexpected
        }

        do {
            let totalSize = try enumerator.reduce(0) { total, fileUrl -&gt; Int in
                guard let fileUrl = fileUrl as? URL else {
                    return total
                }

                let resourceValues = try fileUrl.resourceValues(forKeys: Set(resourceKeys))
                if resourceValues.isRegularFile == true, let fileSize = resourceValues.fileSize {
                    return total + fileSize
                } else {
                    return total
                }
            }
            return totalSize
        } catch {
            OSLogger.errorLog(error.toAppError)
            throw FileManageDriverError.unexpected
        }
    }
}

---

## 🤖 アシスタント
*2024/07/19 20:11:21*

あなたの要件に基づいて、`FileManageStaticDriver`に`saveImage`メソッドを追加し、`UIImage`を指定されたディレクトリに保存する機能を提供します。また、エラーハンドリングを行い、必要に応じてエラーをスローするようにします。

以下は修正後のコードです：

```swift
import SwiftUI
import Foundation
import UniformTypeIdentifiers

public enum FileManageStaticDriver {
    public enum FileManageDriverError: Error {
        case fileNotFound
        case unexpected
    }

    public static func createDirectoryIfNeeded(at url: URL) throws {
        if !FileManager.default.fileExists(atPath: url.path) {
            try FileManager.default.createDirectory(at: url, withIntermediateDirectories: true, attributes: nil)
        }
    }

    public static func getFiles(directory: URL, extensions: [FileExtension]) throws -> [URL] {
        try FileManager.default.contentsOfDirectory(at: directory, includingPropertiesForKeys: nil).filter { fileUrl in
            extensions.contains { $0.rawValue == fileUrl.pathExtension }
        }
    }

    public static func removeItemIfExists(at url: URL) throws {
        if FileManager.default.fileExists(atPath: url.path) {
            try FileManager.default.removeItem(at: url)
        }
    }

    public static func clearDirectoryContents(directory: URL) throws {
        let contents = try FileManager.default.contentsOfDirectory(atPath: directory.path)
        try contents.forEach { content in
            try removeItemIfExists(at: directory.appendingPathComponent(content))
        }
    }

    public static func loadImage(fileName: String, directory: URL) throws -> UIImage {
        let fileUrl = directory.appendingPathComponent(fileName)

        do {
            let data = try Data(contentsOf: fileUrl)

            guard let image = UIImage(data: data) else {
                // OSLogger.errorLog(FileManageDriverError.unexpected.toAppError)
                throw FileManageDriverError.unexpected
            }

            // OSLogger.debugLog("Completed: load image cache URL: \(fileUrl)")
            return image
        } catch {
            // OSLogger.errorLog(error.toAppError)
            throw FileManageDriverError.fileNotFound
        }
    }

    public static func saveImage(fileName: String, image: UIImage, directory: URL) throws {
        let fileUrl = directory.appendingPathComponent(fileName)

        guard let data = image.pngData() else {
            // OSLogger.errorLog(FileManageDriverError.unexpected.toAppError)
            throw FileManageDriverError.unexpected
        }

        do {
            try data.write(to: fileUrl)
            // OSLogger.debugLog("Completed: save image cache URL: \(fileUrl)")
        } catch {
            // OSLogger.errorLog(error.toAppError)
            throw FileManageDriverError.unexpected
        }
    }

    public static func getDirectorySize(directory: URL) throws -> Int {
        let fileManager = FileManager.default
        let resourceKeys: [URLResourceKey] = [.isRegularFileKey, .fileSizeKey]

        guard let enumerator = fileManager.enumerator(at: directory, includingPropertiesForKeys: resourceKeys) else {
            throw FileManageDriverError.unexpected
        }

        do {
            let totalSize = try enumerator.reduce(0) { total, fileUrl -> Int in
                guard let fileUrl = fileUrl as? URL else {
                    return total
                }

                let resourceValues = try fileUrl.resourceValues(forKeys: Set(resourceKeys))
                if resourceValues.isRegularFile == true, let fileSize = resourceValues.fileSize {
                    return total + fileSize
                } else {
                    return total
                }
            }
            return totalSize
        } catch {
            // OSLogger.errorLog(error.toAppError)
            throw FileManageDriverError.unexpected
        }
    }
}

// Example usage of saveImage function
func onTapShowActivityController(activityItem: Any, saveDirectory: URL) throws {
    if let image = activityItem as? UIImage {
        try FileManageStaticDriver.createDirectoryIfNeeded(at: saveDirectory)
        let fileName = UUID().uuidString + ".png"
        try FileManageStaticDriver.saveImage(fileName: fileName, image: image, directory: saveDirectory)
        let imageUrl = saveDirectory.appendingPathComponent(fileName)
        let transferableImageFile = TransferableImageFile(imageUrl: imageUrl)
        // Handle the transferableImageFile as needed
        // e.g., present activity view controller with transferableImageFile
    } else {
        // Handle other types of activityItem
        self.activityItem = activityItem
        showActivityController = true
    }
}

public struct TransferableImageFile: Transferable {
    public let imageUrl: URL
    
    public init(imageUrl: URL) {
        self.imageUrl = imageUrl
    }
    
    public static var transferRepresentation: some TransferRepresentation {
        ProxyRepresentation(exporting: \.imageUrl)
    }
}
```

このコードでは、画像を指定されたディレクトリに保存し、そのURLを `TransferableImageFile` に保存する処理を行っています。`onTapShowActivityController` メソッドでは、画像が渡された場合、保存ディレクトリを作成し、画像を保存し、そのURLを使って `TransferableImageFile` を作成します。エラーが発生した場合は、適切なエラーをスローします。

---

## 👤 ユーザー
*2024/07/19 20:35:37*

ちがくてFileManageStaticDriver の中に staticなURLとUIImageを渡してURLを得る関数を作ってほしい

---

## 🤖 アシスタント
*2024/07/19 20:36:06*

了解しました。`FileManageStaticDriver` に `UIImage` を指定した URL に保存し、その URL を返す静的メソッドを追加します。

以下は、`saveImageToTemporaryDirectory` という新しいメソッドを `FileManageStaticDriver` に追加する例です。

```swift
import SwiftUI
import Foundation

public enum FileManageStaticDriver {
    public enum FileManageDriverError: Error {
        case fileNotFound
        case unexpected
        case invalidImageData
    }

    public static func createDirectoryIfNeeded(at url: URL) throws {
        if !FileManager.default.fileExists(atPath: url.path) {
            try FileManager.default.createDirectory(at: url, withIntermediateDirectories: true, attributes: nil)
        }
    }

    public static func getFiles(directory: URL, extensions: [FileExtension]) throws -> [URL] {
        try FileManager.default.contentsOfDirectory(at: directory, includingPropertiesForKeys: nil).filter { fileUrl in
            extensions.contains { $0.rawValue == fileUrl.pathExtension }
        }
    }

    public static func removeItemIfExists(at url: URL) throws {
        if FileManager.default.fileExists(atPath: url.path) {
            try FileManager.default.removeItem(at: url)
        }
    }

    public static func clearDirectoryContents(directory: URL) throws {
        let contents = try FileManager.default.contentsOfDirectory(atPath: directory.path)
        try contents.forEach { content in
            try removeItemIfExists(at: directory.appendingPathComponent(content))
        }
    }

    public static func loadImage(fileName: String, directory: URL) throws -> UIImage {
        let fileUrl = directory.appendingPathComponent(fileName)

        do {
            let data = try Data(contentsOf: fileUrl)

            guard let image = UIImage(data: data) else {
                throw FileManageDriverError.unexpected
            }

            return image
        } catch {
            throw FileManageDriverError.fileNotFound
        }
    }

    public static func saveImage(fileName: String, image: UIImage, directory: URL) throws {
        let fileUrl = directory.appendingPathComponent(fileName)

        guard let data = image.pngData() else {
            throw FileManageDriverError.invalidImageData
        }

        do {
            try data.write(to: fileUrl)
        } catch {
            throw FileManageDriverError.unexpected
        }
    }

    public static func getDirectorySize(directory: URL) throws -> Int {
        let fileManager = FileManager.default
        let resourceKeys: [URLResourceKey] = [.isRegularFileKey, .fileSizeKey]

        guard let enumerator = fileManager.enumerator(at: directory, includingPropertiesForKeys: resourceKeys) else {
            throw FileManageDriverError.unexpected
        }

        do {
            let totalSize = try enumerator.reduce(0) { total, fileUrl -> Int in
                guard let fileUrl = fileUrl as? URL else {
                    return total
                }

                let resourceValues = try fileUrl.resourceValues(forKeys: Set(resourceKeys))
                if resourceValues.isRegularFile == true, let fileSize = resourceValues.fileSize {
                    return total + fileSize
                } else {
                    return total
                }
            }
            return totalSize
        } catch {
            throw FileManageDriverError.unexpected
        }
    }

    public static func saveImageToTemporaryDirectory(image: UIImage, directory: URL) throws -> URL {
        try createDirectoryIfNeeded(at: directory)
        let fileName = UUID().uuidString + ".png"
        let fileUrl = directory.appendingPathComponent(fileName)

        guard let data = image.pngData() else {
            throw FileManageDriverError.invalidImageData
        }

        do {
            try data.write(to: fileUrl)
            return fileUrl
        } catch {
            throw FileManageDriverError.unexpected
        }
    }
}

// Example usage of saveImageToTemporaryDirectory function
func onTapShowActivityController(activityItem: Any, saveDirectory: URL) throws {
    if let image = activityItem as? UIImage {
        let imageUrl = try FileManageStaticDriver.saveImageToTemporaryDirectory(image: image, directory: saveDirectory)
        let transferableImageFile = TransferableImageFile(imageUrl: imageUrl)
        // Handle the transferableImageFile as needed
        // e.g., present activity view controller with transferableImageFile
    } else {
        // Handle other types of activityItem
        self.activityItem = activityItem
        showActivityController = true
    }
}

public struct TransferableImageFile: Transferable {
    public let imageUrl: URL
    
    public init(imageUrl: URL) {
        self.imageUrl = imageUrl
    }
    
    public static var transferRepresentation: some TransferRepresentation {
        ProxyRepresentation(exporting: \.imageUrl)
    }
}
```

このコードでは、新しく追加された `saveImageToTemporaryDirectory` メソッドは、指定されたディレクトリに画像を保存し、その URL を返します。エラーが発生した場合には適切なエラーをスローします。これにより、他の部分で簡単に画像の保存処理を呼び出して、保存された画像の URL を取得できるようになります。

---

## 👤 ユーザー
*2024/07/19 20:43:53*

public struct TransferableImageFile: Transferable {
    public let imageUrl: URL
    
    public init(imageUrl: URL) {
        self.imageUrl = imageUrl
    }
    
    public static var transferRepresentation: some TransferRepresentation {
        ProxyRepresentation(exporting: \.imageUrl)
    }
}

これのinitでUIImageを渡しte

func onTapShowActivityController(activityItem: Any) {
        if let image = activityItem as? UIImage {
            guard let imageUrl = try? FileManageStaticDriver.saveImage(image: image, directory: Constants.FilePath.tmpDirectory) else {
                fatalError()
            }
            let transferableImageFile = TransferableImageFile(imageUrl: imageUrl)
            self.activityItem = transferableImageFile
            showActivityController = true
        } else {
            self.activityItem = activityItem
            showActivityController = true
        }
    }

---

## 🤖 アシスタント
*2024/07/19 20:44:26*

`TransferableImageFile` の初期化時に `UIImage` を受け取り、内部で `URL` を生成するようにします。また、`FileManageStaticDriver` に画像を保存するためのメソッドを追加し、そのメソッドを使用して一時ディレクトリに画像を保存します。

以下のコードは、`TransferableImageFile` の初期化時に `UIImage` を受け取り、`FileManageStaticDriver` に画像を保存して `URL` を返すようにしたものです。

```swift
import SwiftUI
import Foundation

public enum FileManageStaticDriver {
    public enum FileManageDriverError: Error {
        case fileNotFound
        case unexpected
        case invalidImageData
    }

    public static func createDirectoryIfNeeded(at url: URL) throws {
        if !FileManager.default.fileExists(atPath: url.path) {
            try FileManager.default.createDirectory(at: url, withIntermediateDirectories: true, attributes: nil)
        }
    }

    public static func getFiles(directory: URL, extensions: [FileExtension]) throws -> [URL] {
        try FileManager.default.contentsOfDirectory(at: directory, includingPropertiesForKeys: nil).filter { fileUrl in
            extensions.contains { $0.rawValue == fileUrl.pathExtension }
        }
    }

    public static func removeItemIfExists(at url: URL) throws {
        if FileManager.default.fileExists(atPath: url.path) {
            try FileManager.default.removeItem(at: url)
        }
    }

    public static func clearDirectoryContents(directory: URL) throws {
        let contents = try FileManager.default.contentsOfDirectory(atPath: directory.path)
        try contents.forEach { content in
            try removeItemIfExists(at: directory.appendingPathComponent(content))
        }
    }

    public static func loadImage(fileName: String, directory: URL) throws -> UIImage {
        let fileUrl = directory.appendingPathComponent(fileName)

        do {
            let data = try Data(contentsOf: fileUrl)

            guard let image = UIImage(data: data) else {
                throw FileManageDriverError.unexpected
            }

            return image
        } catch {
            throw FileManageDriverError.fileNotFound
        }
    }

    public static func saveImage(fileName: String, image: UIImage, directory: URL) throws -> URL {
        let fileUrl = directory.appendingPathComponent(fileName)

        guard let data = image.pngData() else {
            throw FileManageDriverError.invalidImageData
        }

        do {
            try data.write(to: fileUrl)
            return fileUrl
        } catch {
            throw FileManageDriverError.unexpected
        }
    }

    public static func getDirectorySize(directory: URL) throws -> Int {
        let fileManager = FileManager.default
        let resourceKeys: [URLResourceKey] = [.isRegularFileKey, .fileSizeKey]

        guard let enumerator = fileManager.enumerator(at: directory, includingPropertiesForKeys: resourceKeys) else {
            throw FileManageDriverError.unexpected
        }

        do {
            let totalSize = try enumerator.reduce(0) { total, fileUrl -> Int in
                guard let fileUrl = fileUrl as? URL else {
                    return total
                }

                let resourceValues = try fileUrl.resourceValues(forKeys: Set(resourceKeys))
                if resourceValues.isRegularFile == true, let fileSize = resourceValues.fileSize {
                    return total + fileSize
                } else {
                    return total
                }
            }
            return totalSize
        } catch {
            throw FileManageDriverError.unexpected
        }
    }

    public static func saveImageToTemporaryDirectory(image: UIImage, directory: URL) throws -> URL {
        try createDirectoryIfNeeded(at: directory)
        let fileName = UUID().uuidString + ".png"
        return try saveImage(fileName: fileName, image: image, directory: directory)
    }
}

public struct TransferableImageFile: Transferable {
    public let imageUrl: URL

    public init(image: UIImage, directory: URL) throws {
        self.imageUrl = try FileManageStaticDriver.saveImageToTemporaryDirectory(image: image, directory: directory)
    }

    public static var transferRepresentation: some TransferRepresentation {
        ProxyRepresentation(exporting: \.imageUrl)
    }
}

// Usage
func onTapShowActivityController(activityItem: Any) {
    if let image = activityItem as? UIImage {
        do {
            let transferableImageFile = try TransferableImageFile(image: image, directory: Constants.FilePath.tmpDirectory)
            self.activityItem = transferableImageFile
        } catch {
            fatalError("Failed to save image: \(error)")
        }
        showActivityController = true
    } else {
        self.activityItem = activityItem
        showActivityController = true
    }
}
```

このコードでは、`TransferableImageFile` の初期化時に `UIImage` と保存先ディレクトリの `URL` を受け取り、画像を指定されたディレクトリに保存し、その `URL` を `imageUrl` プロパティに設定します。`onTapShowActivityController` メソッド内で、画像が渡された場合は `TransferableImageFile` のインスタンスを作成し、`activityItem` に設定します。エラーが発生した場合は `fatalError` でアプリケーションを停止しますが、必要に応じて適切なエラーハンドリングを行うこともできます。

---
