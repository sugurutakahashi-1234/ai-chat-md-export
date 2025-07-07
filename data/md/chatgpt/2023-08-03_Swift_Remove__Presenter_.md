# Swift Remove "Presenter"

日付: 2023-08-03

---

## 👤 ユーザー
*2023/8/3 21:32:54*

Swiftで文字列から"Presenter"という文字列を削除してほしい

---

## 🤖 アシスタント
*2023/8/3 21:33:17*

もちろんです！Swiftで指定した文字列を削除することは簡単にできます。"Presenter"という文字列を削除したい場合、以下のように書くことができます。

```swift
var myString = "I am the Presenter of this event"
myString = myString.replacingOccurrences(of: "Presenter", with: "")
print(myString) // "I am the  of this event"
```

このコードでは、`replacingOccurrences(of:with:)`メソッドを使用して、`myString`から"Presenter"という文字列を削除しています。結果として印刷される文字列は、"Presenter"が削除されたものとなります。もし単語として完全に削除したい場合、スペースも考慮するとよいでしょう。

```swift
var myString = "I am the Presenter of this event"
myString = myString.replacingOccurrences(of: "Presenter ", with: "")
print(myString) // "I am the of this event"
```

この例では、"Presenter"の後にあるスペースも削除しています。

---

## 👤 ユーザー
*2023/8/3 22:13:38*

"/Users/sugurutakahashi/git/emomil-app-ios-Xcode\_14.2/EmomilPackage/Sources/EmomilResearch/Presentation/ResearchDetail/ResearchDetailPresenter.swift"

以下から "ResearchDetailPresenter.swift" のみを取り出して欲しい

---

## 🤖 アシスタント
*2023/8/3 22:13:53*

指定された文字列からファイル名 `"ResearchDetailPresenter.swift"` を取り出すためには、以下のようなコードを使用することができます。

```swift
let path = "/Users/sugurutakahashi/git/emomil-app-ios-Xcode_14.2/EmomilPackage/Sources/EmomilResearch/Presentation/ResearchDetail/ResearchDetailPresenter.swift"
let fileName = (path as NSString).lastPathComponent
print(fileName) // "ResearchDetailPresenter.swift"
```

このコードは、`NSString` の `lastPathComponent` プロパティを使用して、指定されたパスからファイル名を取り出します。結果は `"ResearchDetailPresenter.swift"` となります。

---

## 👤 ユーザー
*2023/8/3 22:14:23*

NSString を使わないとどうやれば取得できますか？StringのExtensionで定義したい

---

## 🤖 アシスタント
*2023/8/3 22:14:41*

もちろん、`NSString` を使用せずに、Swift の標準 `String` を拡張してファイル名を取り出す方法もあります。以下は、その一例です。

```swift
extension String {
    var lastPathComponent: String {
        return self.split(separator: "/").last?.description ?? ""
    }
}

let path = "/Users/sugurutakahashi/git/emomil-app-ios-Xcode_14.2/EmomilPackage/Sources/EmomilResearch/Presentation/ResearchDetail/ResearchDetailPresenter.swift"
let fileName = path.lastPathComponent
print(fileName) // "ResearchDetailPresenter.swift"
```

この拡張は、文字列をスラッシュ（`/`）で分割し、最後の要素を取得しています。この結果としてファイル名 `"ResearchDetailPresenter.swift"` が取得できます。

---

## 👤 ユーザー
*2023/8/3 23:26:43*

拡張子以下を除く処理もどうやって書けばいいの？

---

## 🤖 アシスタント
*2023/8/3 23:27:08*

拡張子を除いたファイル名を取得するために、さらに文字列を拡張することができます。以下はその例です。

```swift
extension String {
    var fileNameWithoutExtension: String {
        let fileName = self.split(separator: "/").last?.description ?? ""
        let components = fileName.split(separator: ".")
        return components.dropLast().joined(separator: ".")
    }
}

let path = "/Users/sugurutakahashi/git/emomil-app-ios-Xcode_14.2/EmomilPackage/Sources/EmomilResearch/Presentation/ResearchDetail/ResearchDetailPresenter.swift"
let fileName = path.fileNameWithoutExtension
print(fileName) // "ResearchDetailPresenter"
```

この拡張では、まずファイル名を取得した後、ピリオド（`.`）で分割し、最後の要素（拡張子）を除いています。結果として、拡張子を除いたファイル名 `"ResearchDetailPresenter"` が取得できます。

---

## 👤 ユーザー
*2023/8/3 23:28:27*

もっといい感じに直せない？

---

## 🤖 アシスタント
*2023/8/3 23:29:03*

もちろん、コードを整理して、さらに直感的にすることができます。以下の拡張は、ファイル名を取得し、オプションで拡張子を除くことができる方法を提供します。

```swift
extension String {
    func fileName(withExtension: Bool = true) -> String {
        guard let fileName = self.split(separator: "/").last else { return "" }
        if withExtension {
            return fileName.description
        } else {
            return fileName.split(separator: ".").dropLast().joined(separator: ".")
        }
    }
}

let path = "/Users/sugurutakahashi/git/emomil-app-ios-Xcode_14.2/EmomilPackage/Sources/EmomilResearch/Presentation/ResearchDetail/ResearchDetailPresenter.swift"
let fileNameWithExtension = path.fileName() // "ResearchDetailPresenter.swift"
let fileNameWithoutExtension = path.fileName(withExtension: false) // "ResearchDetailPresenter"

print(fileNameWithExtension)
print(fileNameWithoutExtension)
```

この拡張は、新しいメソッド `fileName(withExtension:)` を提供し、拡張子を含めるかどうかを指定することができます。デフォルトでは、拡張子を含めるようになっています。このコードは、使いやすく、より直感的になっていると思います。

---
