# Handling UIImage Transfers

日付: 2024-07-19

---

## 👤 ユーザー
*2024/7/19 21:05:20*

importing の中身を書いてほしい

public struct TransferableUIImage: Transferable {
    public let imageUrl: URL
    public let uiImage: UIImage

    public init(uiImage: UIImage) {
        self.uiImage = uiImage
        self.imageUrl = try! FileManageStaticDriver.saveImage(image: uiImage, directory: Constants.FilePath.tmpDirectory)
    }

    public static var transferRepresentation: some TransferRepresentation {
        FileRepresentation(contentType: .png) { image in
            SentTransferredFile(image.imageUrl)
        } importing: { received in
            
        }
    }
}

#if os(iOS)
import Foundation
import SwiftUI

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

    public static func saveImage(image: UIImage, directory: URL) throws -&gt; URL {
        let fileUrl = directory.appendingPathComponent(UUID().uuidString).appendingPathExtension(FileExtension.png.rawValue)
        
        guard let data = image.pngData() else {
            throw FileManageDriverError.unexpected
        }

        do {
            try data.write(to: fileUrl)
            return fileUrl
        } catch {
            throw FileManageDriverError.unexpected
        }
    }
}
#endif

---

## 🤖 アシスタント
*2024/7/19 21:05:30*

Here is the completed `importing` closure for your `TransferableUIImage` struct. This closure will handle the process of importing the transferred image and saving it to a desired location.

```swift
import Foundation
import SwiftUI
import UniformTypeIdentifiers
import UIKit

public struct TransferableUIImage: Transferable {
    public let imageUrl: URL
    public let uiImage: UIImage

    public init(uiImage: UIImage) {
        self.uiImage = uiImage
        self.imageUrl = try! FileManageStaticDriver.saveImage(image: uiImage, directory: Constants.FilePath.tmpDirectory)
    }

    public static var transferRepresentation: some TransferRepresentation {
        FileRepresentation(contentType: .png) { image in
            SentTransferredFile(image.imageUrl)
        } importing: { received in
            guard received.hasItemConformingTo(.png) else {
                throw NSError(domain: "Invalid type", code: 1, userInfo: nil)
            }

            let data = try await received.loadTransferable(type: Data.self)
            guard let uiImage = UIImage(data: data) else {
                throw NSError(domain: "Invalid data", code: 2, userInfo: nil)
            }
            
            let savedUrl = try FileManageStaticDriver.saveImage(image: uiImage, directory: Constants.FilePath.tmpDirectory)
            return TransferableUIImage(uiImage: uiImage)
        }
    }
}

#if os(iOS)
import Foundation
import SwiftUI

public enum FileManageStaticDriver {
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

    public static func saveImage(fileName: String, image: UIImage, directory: URL) throws -> URL {
        let fileUrl = directory.appendingPathComponent(fileName)

        guard let data = image.pngData() else {
            OSLogger.errorLog(FileManageDriverError.unexpected.toAppError)
            throw FileManageDriverError.unexpected
        }

        do {
            try data.write(to: fileUrl)
            OSLogger.debugLog("Completed: save image cache URL: \(fileUrl)")
            return fileUrl
        } catch {
            OSLogger.errorLog(error.toAppError)
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
            OSLogger.errorLog(error.toAppError)
            throw FileManageDriverError.unexpected
        }
    }

    public static func saveImage(image: UIImage, directory: URL) throws -> URL {
        let fileUrl = directory.appendingPathComponent(UUID().uuidString).appendingPathExtension(FileExtension.png.rawValue)
        
        guard let data = image.pngData() else {
            throw FileManageDriverError.unexpected
        }

        do {
            try data.write(to: fileUrl)
            return fileUrl
        } catch {
            throw FileManageDriverError.unexpected
        }
    }
}
#endif
```

This closure checks if the received item conforms to the PNG type, loads it as data, converts it to a `UIImage`, and then saves it using the `FileManageStaticDriver.saveImage` method. If the operations succeed, it returns a new `TransferableUIImage` instance.

---
