# Handling URLSession Cancel Error

日付: 2024-07-04

---

## 👤 ユーザー
*2024/7/4 17:59:09*

キャンセルだった場合にエラーにしたくない

// エラー系などの検証をしない場合はこちらを使う。そうではない場合は DownloadDriver を使用する
public enum URLSessionDownloadDriver {
    public static func imageDownload(url: URL) async throws -&gt; UIImage {
        do {
            let (data, \_) = try await URLSession.shared.data(from: url)
            OSLogger.debugLog("Completed: Download")

            guard let image = UIImage(data: data) else {
                throw AppError.customError("Invalid image data")
            }

            return image
        } catch {
            OSLogger.errorLog("\\(error)")
            throw error
        }
    }

    public static func audioDownload(url: URL) async throws -&gt; Data {
        do {
            let (data, \_) = try await URLSession.shared.data(from: url)
            OSLogger.debugLog("Completed: Download")
            return data
        } catch {
            OSLogger.errorLog("\\(error)")
            throw error
        }
    }
}

---

## 🤖 アシスタント
*2024/7/4 17:59:25*

エラー系の検証を行わず、キャンセルされた場合にエラーをスローしないようにするためには、キャンセルエラーを捕捉し、その場合にはエラーをスローしないようにコードを変更する必要があります。以下のように修正できます：

```swift
import UIKit

public enum URLSessionDownloadDriver {
    public static func imageDownload(url: URL) async throws -> UIImage {
        do {
            let (data, _) = try await URLSession.shared.data(from: url)
            OSLogger.debugLog("Completed: Download")

            guard let image = UIImage(data: data) else {
                throw AppError.customError("Invalid image data")
            }

            return image
        } catch let error as URLError where error.code == .cancelled {
            OSLogger.debugLog("Download cancelled")
            // キャンセルの場合は何もせずに終了
            return UIImage()
        } catch {
            OSLogger.errorLog("\(error)")
            throw error
        }
    }

    public static func audioDownload(url: URL) async throws -> Data {
        do {
            let (data, _) = try await URLSession.shared.data(from: url)
            OSLogger.debugLog("Completed: Download")
            return data
        } catch let error as URLError where error.code == .cancelled {
            OSLogger.debugLog("Download cancelled")
            // キャンセルの場合は何もせずに終了
            return Data()
        } catch {
            OSLogger.errorLog("\(error)")
            throw error
        }
    }
}
```

この修正では、`URLError` がキャンセルエラーの場合には、エラーメッセージをログに出力し、空の`UIImage`や`Data`を返します。これにより、ダウンロードがキャンセルされた場合にエラーがスローされず、キャンセルの状況を適切に処理できます。

---

## 👤 ユーザー
*2024/7/4 18:01:20*

以下も同様にキャンセルの場合は別処理したい

    private func loadImage() async {
        // 一律で拡張子は取り除く（png で保存するため）
        let fileName = imageUrl.deletingPathExtension().lastPathComponent
        do {
            let cachedImage = try FileManageDriver.loadImageFromCache(fileName: fileName, directory: directory)
            uiImage = cachedImage
        } catch {
            do {
                let downloadedImage = try await URLSessionDownloadDriver.imageDownload(url: imageUrl)
                uiImage = downloadedImage
                try FileManageDriver.saveImageToCache(fileName: fileName, image: downloadedImage, directory: directory)
            } catch {
                OSLogger.errorLog(error.toAppError)
                appError = error.toAppError
            }
        }
    }

---

## 🤖 アシスタント
*2024/7/4 18:01:38*

キャンセルされた場合に別処理を行いたい場合、以下のようにコードを修正できます。具体的には、`URLError`のキャンセルエラーを捕捉し、その場合にはエラーとして扱わずに別の処理を行うようにします。

```swift
import UIKit

private func loadImage() async {
    // 一律で拡張子は取り除く（png で保存するため）
    let fileName = imageUrl.deletingPathExtension().lastPathComponent
    do {
        let cachedImage = try FileManageDriver.loadImageFromCache(fileName: fileName, directory: directory)
        uiImage = cachedImage
    } catch {
        do {
            let downloadedImage = try await URLSessionDownloadDriver.imageDownload(url: imageUrl)
            uiImage = downloadedImage
            try FileManageDriver.saveImageToCache(fileName: fileName, image: downloadedImage, directory: directory)
        } catch let error as URLError where error.code == .cancelled {
            OSLogger.debugLog("Image download cancelled")
            // キャンセルの場合は何もせずに終了
        } catch {
            OSLogger.errorLog(error.toAppError)
            appError = error.toAppError
        }
    }
}
```

この修正では、`URLSessionDownloadDriver.imageDownload(url:)` がキャンセルされた場合に、エラーメッセージをログに出力し、他の処理を行わずに終了します。キャンセル以外のエラーが発生した場合は、従来通りエラーメッセージをログに出力し、`appError` に設定します。

---

## 👤 ユーザー
*2024/7/4 18:05:36*

String(describing: oldValue) 文字列を先頭から10文字トリミングする方法

---

## 🤖 アシスタント
*2024/7/4 18:05:46*

文字列の先頭から10文字をトリミングするためには、`String`の`prefix`メソッドを使うと便利です。以下は、その方法を示すコード例です：

```swift
let oldValue = "Some long string value"
let trimmedValue = String(describing: oldValue).prefix(10)
print(trimmedValue)  // 出力: "Some long "
```

このコードでは、`prefix(10)`メソッドを使って、先頭から10文字だけを取得しています。

文字列を先頭から10文字トリミングするユーティリティ関数を作成する場合は、以下のように実装できます：

```swift
extension String {
    func trimmingToPrefix(_ length: Int) -> String {
        return String(self.prefix(length))
    }
}

let oldValue = "Some long string value"
let trimmedValue = String(describing: oldValue).trimmingToPrefix(10)
print(trimmedValue)  // 出力: "Some long "
```

この拡張メソッドを使うことで、どんな文字列でも簡単に先頭から指定した文字数にトリミングすることができます。

---
