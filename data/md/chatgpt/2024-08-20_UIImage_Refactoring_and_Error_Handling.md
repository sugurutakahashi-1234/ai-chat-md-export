# UIImage Refactoring and Error Handling

日付: 2024-08-20

---

## 👤 ユーザー
*2024/8/20 16:23:29*

リファクタリングしてほしい。エラーをスローして欲しい

extension UIImage {
    public convenience init(imageUrl: String) {
        do {
            let data = try Data(contentsOf: URL(string: imageUrl)!)
            self.init(data: data)!
            return
        } catch let err {
            print("Error : \\(err.localizedDescription)")
        }
        self.init()
    }
}

---

## 🤖 アシスタント
*2024/8/20 16:23:40*

以下のようにリファクタリングし、エラーをスローするように変更しました。

```swift
import UIKit

extension UIImage {
    public convenience init(imageUrl: String) throws {
        guard let url = URL(string: imageUrl) else {
            throw URLError(.badURL)
        }
        
        do {
            let data = try Data(contentsOf: url)
            guard let image = UIImage(data: data) else {
                throw NSError(domain: "UIImageErrorDomain", code: 0, userInfo: [NSLocalizedDescriptionKey: "Unable to create UIImage from data."])
            }
            self.init(data: data)!
        } catch {
            throw error
        }
    }
}
```

### 変更点
1. `URL(string: imageUrl)` の結果が `nil` の場合に `URLError` をスロー。
2. `Data(contentsOf:)` からの `data` を使って `UIImage` を生成できない場合に、カスタムエラーをスロー。
3. `catch` ブロックでエラーを再スローし、呼び出し元でエラーハンドリングができるようにしました。

この実装では、エラーが発生した場合にそのエラーをスローするため、呼び出し元で `try` を使用してエラーハンドリングを行う必要があります。

---

## 👤 ユーザー
*2024/8/20 16:24:35*

imageUrl: URLとしてほしい

---

## 🤖 アシスタント
*2024/8/20 16:24:42*

`imageUrl` を `URL` 型に変更したバージョンを以下に示します。

```swift
import UIKit

extension UIImage {
    public convenience init(imageUrl: URL) throws {
        do {
            let data = try Data(contentsOf: imageUrl)
            guard let image = UIImage(data: data) else {
                throw NSError(domain: "UIImageErrorDomain", code: 0, userInfo: [NSLocalizedDescriptionKey: "Unable to create UIImage from data."])
            }
            self.init(data: data)!
        } catch {
            throw error
        }
    }
}
```

### 変更点
- `imageUrl` パラメータを `String` から `URL` に変更しました。
- これにより、URL のバリデーションを行う必要がなくなり、エラーハンドリングがシンプルになりました。

このリファクタリングによって、呼び出し元で `URL` 型の引数を渡す必要があります。

---
