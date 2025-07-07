# ISO8601DateFormatterを使用した日付の変換

日付: 2023-06-07

---

## 👤 ユーザー
*2023/6/7 23:46:56*

以下のコードについてどうもう？


extension Date {
    // "2023-06-07T14:46:01.455Z"
    var jsonString: String {
        ISO8601Format(Date.ISO8601FormatStyle(includingFractionalSeconds: true))
    }
}

let date1: Date = .init()

date1.jsonString

---

## 🤖 アシスタント
*2023/6/7 23:47:45*

あなたが提示したSwiftコードには何人かのエラーがあります。まず、 `ISO8601Format`は `Date` のメソッドではありません。また、 `Date.ISO8601FormatStyle(includingFractionalSeconds: true)` というメソッドやプロパティも存在しません。これらはSwift標準ライブラリには含まれていません。

あなたが意図しているのは、ISO8601形式の文字列に日付を変換することだと思います。その場合、Swiftでは `ISO8601DateFormatter` を使って実現できます。以下のように書くことができます：

```swift
extension Date {
    var jsonString: String {
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return formatter.string(from: self)
    }
}

let date1: Date = .init()

print(date1.jsonString)  // "2023-06-07T14:46:01.455Z"
```

このコードでは、まず新しい `ISO8601DateFormatter` を作成し、その `formatOptions` を設定してから、 `self`（つまり `Date` インスタンス）から文字列を生成します。`.withInternetDateTime` と `.withFractionalSeconds` を設定することで、ISO 8601の完全な日付と時間形式（タイムゾーンと小数秒を含む）が得られます。

---

## 👤 ユーザー
*2023/6/7 23:49:53*

Date型をISO8601のミリ秒表記に変換するような処理の変数名をどうすればいい？
// "2023-06-07T14:46:01.455Z"
    var jsonString: String {
        ISO8601Format(Date.ISO8601FormatStyle(includingFractionalSeconds: true))
    }

---

## 🤖 アシスタント
*2023/6/7 23:50:51*

あなたが提供したコードスニペットについて説明する前に、Swiftにおける`Date`型のISO8601形式（ミリ秒表記を含む）への変換方法について再確認しましょう。

Swiftでは、`ISO8601DateFormatter`を使用して、日付をISO8601形式の文字列に変換できます。以下に、その方法を示します。

```swift
extension Date {
    var iso8601WithMilliseconds: String {
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return formatter.string(from: self)
    }
}

let date1: Date = .init()

print(date1.iso8601WithMilliseconds)  // "2023-06-07T14:46:01.455Z"
```

このコードでは、`Date`型に対して`iso8601WithMilliseconds`という名前のプロパティを新たに追加しています。この名前は、「ISO 8601形式の文字列をミリ秒まで含む」ことを意味しているため、機能と一致しています。このプロパティは、ISO8601形式の文字列を生成するために`ISO8601DateFormatter`を使用します。

このプロパティ名は、必ずしもこれに限定されるものではありません。もし他の名前をつけたいのであれば、その名前がコードを読む人にプロパティの目的と機能を明確に示すものであればよいです。たとえば、`iso8601StringWithFractionalSeconds`、`iso8601FullString`なども考えられます。

---

## 👤 ユーザー
*2023/6/8 0:04:39*

Intのミリ秒をDate型に変換するIntのextensionを書いて欲しい

---

## 🤖 アシスタント
*2023/6/8 0:05:15*

`Int`をUnixエポックからのミリ秒とみなして、それを`Date`に変換する`Int`のextensionを作成することが可能です。ここでは、Swiftによるその実装を示します：

```swift
extension Int {
    var dateFromMilliseconds: Date {
        return Date(timeIntervalSince1970: TimeInterval(self) / 1000)
    }
}

let intMilliseconds: Int = 1609459200000  // e.g., Jan 1, 2021 00:00:00 GMT in milliseconds

let date = intMilliseconds.dateFromMilliseconds

print(date)  // "2021-01-01 00:00:00 +0000\n"
```

このコードは`Int`型に`dateFromMilliseconds`という新しいcomputed propertyを追加しています。このプロパティは、その整数値をUnixエポックからのミリ秒と解釈し、それを`Date`型に変換します。

この変換では、ミリ秒単位の整数を秒単位の浮動小数点数に変換（1000で除算）してから、`Date`の初期化子に渡しています。その結果、この整数値が表すミリ秒単位のUnixエポックからの時間を表す新しい`Date`インスタンスが生成されます。

なお、Unixエポックは1970年1月1日 00:00:00 UTCと定義されています。

---

## 👤 ユーザー
*2023/6/8 0:11:00*

Date型をミリ秒まで表示して欲しい

---

## 🤖 アシスタント
*2023/6/8 0:11:28*

Swiftの`Date`オブジェクトをUNIX時間（エポックからのミリ秒）に変換するための拡張関数を以下に示します。これは、`Date`からエポック秒を取得し、それをミリ秒に変換します。

```swift
extension Date {
    var millisecondsSince1970: Int {
        return Int((self.timeIntervalSince1970 * 1000.0).rounded())
    }
}

let date = Date()

print(date.millisecondsSince1970) // e.g. "1609459200000"
```

このコードでは、`Date`型に`millisecondsSince1970`という新しいcomputed propertyを追加しています。このプロパティは、その`Date`オブジェクトが表す時間をUnixエポックからのミリ秒で返します。この変換は、`Date`の`timeIntervalSince1970`プロパティ（エポック秒）を1000倍してミリ秒に変換し、その結果を四捨五入して整数にしています。

---

## 👤 ユーザー
*2023/6/8 0:12:24*

違くてiso8601でミリビョウ表記してほしい

---

## 🤖 アシスタント
*2023/6/8 0:13:00*

ISO 8601形式で日付を表現し、さらに小数秒（ミリ秒）を含めたい場合、以下のように`ISO8601DateFormatter`を使用して、小数秒を含むオプションを設定できます。

```swift
extension Date {
    var iso8601WithFractionalSeconds: String {
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return formatter.string(from: self)
    }
}

let date = Date()

print(date.iso8601WithFractionalSeconds)  // "2023-06-07T14:46:01.455Z"
```

このコードでは、`Date`型に対して新たに`iso8601WithFractionalSeconds`というcomputed propertyを追加しています。このプロパティはISO8601形式の文字列を生成し、小数秒（ミリ秒）までの精度を含みます。

なお、`ISO8601DateFormatter`の`formatOptions`プロパティに`.withInternetDateTime`と`.withFractionalSeconds`を設定することで、日付と時間のフルフォーマット（タイムゾーンを含む）と、小数秒を含めることができます。

---
