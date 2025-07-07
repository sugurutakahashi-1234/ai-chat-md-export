# JSON to Computed Property

日付: 2023-06-09

---

## 👤 ユーザー
*2023/6/9 20:20:33*

以下をコンピューテッドプロパティーにして欲しい

func toJson() throws -&gt; String? {
        let encoder = JSONEncoder()
        // encoder.outputFormatting = .prettyPrinted
        return try String(data: encoder.encode(self), encoding: .utf8)
    }

---

## 🤖 アシスタント
*2023/6/9 20:21:16*

Swiftでは、プロパティは実際の値を保持するか、あるいは計算によって生成されます。計算されるプロパティは値を取得するためのコードを提供しますが、それらを値として保持することはありません。計算プロパティはしばしば`get`と`set`キーワードを使用しますが、読み取り専用の場合は`get`だけを使用します。

Swiftでは、値の取得に例外をスローする方法はありません。つまり、計算プロパティが`throws`キーワードを使ってエラーをスローすることはできません。しかし、結果をラップするエラー処理型を使用することでこれを回避することができます。

以下に、コンピューテッドプロパティーとしてあなたの機能を実装する方法を示します。ここでは`Result`型を使用してエラーをラップします。

```swift
var json: Result<String, Error> {
    let encoder = JSONEncoder()
    // encoder.outputFormatting = .prettyPrinted
    return Result {
        try String(data: encoder.encode(self), encoding: .utf8) ?? ""
    }
}
```

上記のコードでは、`json`という新しい計算プロパティを作成します。このプロパティは`Result<String, Error>`型を返します。`Result`型は、成功の場合は結果を、失敗の場合はエラーを保持します。`Result`は、処理が成功したかどうかを判断し、成功した場合に結果を、失敗した場合にエラーを取得するのに便利です。

---

## 👤 ユーザー
*2023/6/9 20:21:50*

get throw { とかでコンピューテッドプロパティーもエラーにできないっけ？

---

## 🤖 アシスタント
*2023/6/9 20:22:14*

Swiftでは、コンピューテッドプロパティの取得や設定を試みる際に例外をスローする機能はありません。これはSwiftの設計上の決定で、計算型プロパティの`get`や`set`ブロック内で`throws`キーワードを使用することはできません。

つまり、以下のようなコードはSwiftでは許可されていません。

```swift
var json: String {
    get throws { // throwsはここでは使用できない
        let encoder = JSONEncoder()
        return try String(data: encoder.encode(self), encoding: .utf8) ?? ""
    }
}
```

例外をスローする操作を行う必要がある場合は、メソッドを使用するべきです。上記の質問に対する私の最初の回答で示したように、あるいは、`Result`型を使用して成功かエラーかをラップすることも可能です。これはエラーをハンドリングするための一般的なアプローチです。

---
