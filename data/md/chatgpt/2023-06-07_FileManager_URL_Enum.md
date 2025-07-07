# FileManager URL Enum

日付: 2023-06-07

---

## 👤 ユーザー
*2023/6/7 23:32:08*

Swift の FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first ようなファイルアクセスでよく指定するものをenumで定義して、urlを取得するようなコードを書きたい

---

## 🤖 アシスタント
*2023/6/7 23:32:50*

以下にそのためのコード例を書いてみます。この例では、SwiftのenumとFileManagerを使用して、指定したファイルディレクトリへのURLを取得するためのメソッドを定義しています。

```swift
import Foundation

enum Directory {
    case document
    case caches
    case temporary
    
    func url() -> URL? {
        let fileManager = FileManager.default
        var searchPathDirectory: FileManager.SearchPathDirectory
        
        switch self {
        case .document:
            searchPathDirectory = .documentDirectory
        case .caches:
            searchPathDirectory = .cachesDirectory
        case .temporary:
            searchPathDirectory = .temporaryDirectory
        }
        
        return fileManager.urls(for: searchPathDirectory, in: .userDomainMask).first
    }
}

// 使い方:
if let documentURL = Directory.document.url() {
    print("Document Directory URL: \(documentURL)")
}
```

このコードでは、`Directory`というenumを定義し、そのenumには`document`, `caches`, `temporary`の3つのケースがあります。それぞれのケースは、適切な`FileManager.SearchPathDirectory`を使用してURLを取得する`url()`メソッドを持っています。

使用する際には、以下のように指定します。

```swift
let url = Directory.document.url() // ドキュメントディレクトリへのURLを取得します
```

---

## 👤 ユーザー
*2023/6/7 23:33:07*

FileManager の extension として生やしたい。

---

## 🤖 アシスタント
*2023/6/7 23:33:44*

指定のディレクトリへのURLを取得するためのメソッドを`FileManager`の拡張として定義することも可能です。以下にその例を示します。

```swift
import Foundation

extension FileManager {
    enum Directory {
        case document
        case caches
        case temporary
    }

    func url(for directory: Directory) -> URL? {
        var searchPathDirectory: SearchPathDirectory

        switch directory {
        case .document:
            searchPathDirectory = .documentDirectory
        case .caches:
            searchPathDirectory = .cachesDirectory
        case .temporary:
            searchPathDirectory = .temporaryDirectory
        }

        return urls(for: searchPathDirectory, in: .userDomainMask).first
    }
}

// 使い方:
let fileManager = FileManager.default
if let documentURL = fileManager.url(for: .document) {
    print("Document Directory URL: \(documentURL)")
}
```

ここで定義した`FileManager.Directory`というenumと、そのenumを引数として使用する`FileManager`の`url(for:)`メソッドを使って、指定のディレクトリへのURLを取得できます。

この方法であれば、`FileManager`を通して直接目的のディレクトリへのURLを取得できるため、コードがより直感的になるでしょう。

---

## 👤 ユーザー
*2023/6/7 23:34:26*

URL? でなくてエラーをスローして欲しい

---

## 🤖 アシスタント
*2023/6/7 23:35:19*

Swiftでは、エラーをスローする関数は `throws` キーワードを使って宣言します。そして、呼び出し元は `try` キーワードを使ってその関数を呼び出します。

以下にそのためのコード例を示します:

```swift
import Foundation

extension FileManager {
    enum Directory {
        case document
        case caches
        case temporary
    }
    
    enum DirectoryError: Error {
        case urlNotFound
    }

    func url(for directory: Directory) throws -> URL {
        var searchPathDirectory: SearchPathDirectory

        switch directory {
        case .document:
            searchPathDirectory = .documentDirectory
        case .caches:
            searchPathDirectory = .cachesDirectory
        case .temporary:
            searchPathDirectory = .temporaryDirectory
        }

        guard let url = urls(for: searchPathDirectory, in: .userDomainMask).first else {
            throw DirectoryError.urlNotFound
        }
        
        return url
    }
}

// 使い方:
let fileManager = FileManager.default
do {
    let documentURL = try fileManager.url(for: .document)
    print("Document Directory URL: \(documentURL)")
} catch {
    print("Failed to get directory URL: \(error)")
}
```

このコードでは `url(for:)` メソッドが `DirectoryError.urlNotFound` エラーをスローする可能性があることを示しています。そして、ディレクトリへのURLが見つからない場合にそのエラーをスローします。

呼び出し元は `do-catch` ブロックを使ってエラーをハンドリングします。エラーが発生した場合には、そのエラーの詳細を表示します。

---
