# Swift Refactor CIImage

日付: 2023-05-26

---

## 👤 ユーザー
*2023/05/26 16:26:27*

以下の処理をリファクタしてほしい

言語はSwift

if let orientation {
            if let orientedImage = CIImage(cvImageBuffer: imageBuffer).resized(size: bufferSize)?
                .oriented(orientation)
            {
                ciImage = orientedImage
            } else {
                throw EmotionAnalysisError.failedToResizeCIImage
            }
        } else {
            if let resizedImage = CIImage(cvImageBuffer: imageBuffer).resized(size: bufferSize) {
                ciImage = resizedImage
            } else {
                throw EmotionAnalysisError.failedToResizeCIImage
            }
        }

---

## 🤖 アシスタント
*2023/05/26 16:26:58*

コードが冗長なので、これをリファクタリングします。次のコードでは、`CIImage`のインスタンスを生成し、必要に応じてリサイズと方向調整を行います。最後に、これらの処理が正常に行われなかった場合はエラーをスローします。

```swift
guard let baseImage = CIImage(cvImageBuffer: imageBuffer).resized(size: bufferSize) else {
    throw EmotionAnalysisError.failedToResizeCIImage
}

ciImage = orientation.map { baseImage.oriented($0) } ?? baseImage
```

ここで、まず`CIImage`のインスタンス生成とリサイズを一度で行っています。`guard`を使って、この操作が成功しなかった場合にエラーをスローします。

次に、方向情報が存在する場合(`map`関数を使用)に方向を調整し、存在しない場合は基本の画像をそのまま使用します(`??`演算子を使用)。こうすることで、冗長なif-let構文を排除し、コードの読みやすさと保守性を向上させています。

---

## 👤 ユーザー
*2023/05/26 16:27:06*

ごめんこっちだった

let ciImage: CIImage
        if let orientation {
            if let orientedImage = CIImage(cvImageBuffer: imageBuffer).resized(size: bufferSize)?
                .oriented(orientation)
            {
                ciImage = orientedImage
            } else {
                throw EmotionAnalysisError.failedToResizeCIImage
            }
        } else {
            if let resizedImage = CIImage(cvImageBuffer: imageBuffer).resized(size: bufferSize) {
                ciImage = resizedImage
            } else {
                throw EmotionAnalysisError.failedToResizeCIImage
            }
        }

---

## 🤖 アシスタント
*2023/05/26 16:27:38*

ありがとうございます。ローカル変数`ciImage`の定義部分が含まれていることを確認しました。以下にリファクタリングしたコードを示します。

```swift
let baseImage = CIImage(cvImageBuffer: imageBuffer).resized(size: bufferSize)

guard let preparedImage = baseImage else {
    throw EmotionAnalysisError.failedToResizeCIImage
}

let ciImage = orientation.map { preparedImage.oriented($0) } ?? preparedImage
```

このリファクタリングでは、まず`CIImage`のインスタンス生成とリサイズを試み、結果を`baseImage`に格納します。次に`guard let`を使って、その操作が成功したかどうかを確認し、失敗した場合はエラーをスローします。

最後に、方向情報が存在する場合はその方向に画像を向け（`oriented`関数）、存在しない場合は`baseImage`をそのまま`ciImage`に格納します。この流れは元のコードと同じですが、冗長なif-let構文を排除し、より読みやすくなっています。

---

## 👤 ユーザー
*2023/05/26 16:28:22*

以下がわかりづらいのでわかりやすく書けない？

let ciImage = orientation.map { preparedImage.oriented($0) } ?? preparedImage

---

## 🤖 アシスタント
*2023/05/26 16:29:08*

もちろんです、以下のようにコードを分解して記述することも可能です。これにより、どのステップで何をしているのかがより明確になるでしょう。

```swift
let ciImage: CIImage
if let givenOrientation = orientation {
    if let orientedImage = preparedImage.oriented(givenOrientation) {
        ciImage = orientedImage
    } else {
        throw EmotionAnalysisError.failedToOrientCIImage
    }
} else {
    ciImage = preparedImage
}
```

このコードでは、まず`orientation`が存在するかどうかをチェックしています。存在する場合、その方向に`preparedImage`を向ける処理を試み、この処理が成功したらその画像を`ciImage`に格納します。それ以外の場合はエラーをスローします。`orientation`が存在しない場合は、`preparedImage`をそのまま`ciImage`に格納します。

ただし、この形式では、`preparedImage.oriented(givenOrientation)`が失敗する可能性があると想定しています。もし`oriented()`メソッドが失敗しないと確信があるなら、エラーをスローする部分は不要で、次のようになります。

```swift
let ciImage: CIImage
if let givenOrientation = orientation {
    ciImage = preparedImage.oriented(givenOrientation)
} else {
    ciImage = preparedImage
}
```

ここでは、画像の方向調整は必ず成功し、その結果を`ciImage`に格納すると想定しています。もし方向情報が存在しない場合、`preparedImage`をそのまま`ciImage`に格納します。

---
