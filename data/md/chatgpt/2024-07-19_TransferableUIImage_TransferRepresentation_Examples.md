# TransferableUIImage TransferRepresentation Examples

日付: 2024-07-19

---

## 👤 ユーザー
*2024/7/19 20:55:06*

public struct TransferableUIImage: Transferable {
    public let imageUrl: URL

    public init(uiImage: UIImage) {
        self.imageUrl = try! FileManageStaticDriver.saveImage(image: uiImage, directory: Constants.FilePath.tmpDirectory)
    }

    public static var transferRepresentation: some TransferRepresentation {
        ProxyRepresentation(exporting: \\.imageUrl)
    }
}

FileRepresentation など他のTransferRepresentationをいくつか試してほしい

---

## 🤖 アシスタント
*2024/7/19 20:55:20*

`TransferableUIImage`構造体で異なる`TransferRepresentation`を試すために、以下にいくつかの例を示します。それぞれの例では、`ProxyRepresentation`以外の異なる`TransferRepresentation`を使用しています。

### 1. `FileRepresentation`

```swift
public struct TransferableUIImage: Transferable {
    public let imageUrl: URL

    public init(uiImage: UIImage) {
        self.imageUrl = try! FileManageStaticDriver.saveImage(image: uiImage, directory: Constants.FilePath.tmpDirectory)
    }

    public static var transferRepresentation: some TransferRepresentation {
        FileRepresentation(contentType: .image) { transferable in
            return transferable.imageUrl
        }
    }
}
```

### 2. `DataRepresentation`

```swift
public struct TransferableUIImage: Transferable {
    public let imageData: Data

    public init(uiImage: UIImage) {
        if let data = uiImage.pngData() {
            self.imageData = data
        } else {
            fatalError("Failed to convert UIImage to Data")
        }
    }

    public static var transferRepresentation: some TransferRepresentation {
        DataRepresentation(exporting: \.imageData)
    }
}
```

### 3. `CopyRepresentation`

```swift
public struct TransferableUIImage: Transferable {
    public let imageUrl: URL

    public init(uiImage: UIImage) {
        self.imageUrl = try! FileManageStaticDriver.saveImage(image: uiImage, directory: Constants.FilePath.tmpDirectory)
    }

    public static var transferRepresentation: some TransferRepresentation {
        CopyRepresentation { transferable in
            transferable.imageUrl
        }
    }
}
```

これらの異なる`TransferRepresentation`の例を試して、各々の動作を確認してみてください。それぞれの`TransferRepresentation`は異なる方法でデータを転送しますので、ユースケースに応じて最適なものを選択することができます。

---
