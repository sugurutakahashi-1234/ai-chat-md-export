# Add PNG Extension Swift

Date: 2024-07-09

---

## 👤 User
*2024-07-09 11:50:29*

拡張子がなければpng拡張子をつけるようなSwiftのコード

---

## 🤖 Assistant
*2024-07-09 11:50:40*

以下のSwiftコードは、ファイル名に拡張子がなければ、`.png`拡張子を付け加える関数を示しています：

```swift
import Foundation

func addPNGExtensionIfNeeded(to filename: String) -> String {
    // URLクラスを使用してファイル名の拡張子を取得
    let url = URL(fileURLWithPath: filename)
    let fileExtension = url.pathExtension
    
    // 拡張子がなければ、.pngを追加
    if fileExtension.isEmpty {
        return filename + ".png"
    }
    
    // 既に拡張子がある場合、そのままのファイル名を返す
    return filename
}

// 使用例
let filenames = ["image", "photo.jpg", "document.pdf", "icon"]

let updatedFilenames = filenames.map { addPNGExtensionIfNeeded(to: $0) }
print(updatedFilenames)  // ["image.png", "photo.jpg", "document.pdf", "icon.png"]
```

このコードでは、`URL`クラスを使用してファイル名の拡張子を取得し、もし拡張子が空であれば`.png`を追加します。既に拡張子がある場合は、そのままのファイル名を返します。例として、いくつかのファイル名に対してこの関数を適用しています。

---
