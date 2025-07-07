# SwiftUIでPicker作成

日付: 2023-06-13

---

## 👤 ユーザー
*2023/6/13 12:43:21*

SwiftUIで文字列の入った配列を選択できるようなPickerって作ることはできる？文字列は一応同じものは入っていないらしい

---

## 🤖 アシスタント
*2023/6/13 12:43:48*

もちろんです、SwiftUIを使って文字列の入った配列から選択するためのPickerを作成することが可能です。以下に基本的な例を示します。

```swift
import SwiftUI

struct ContentView: View {
    @State private var selectedString = ""
    let stringArray = ["文字列1", "文字列2", "文字列3", "文字列4"]
    
    var body: some View {
        NavigationView {
            Form {
                Picker("文字列を選択", selection: $selectedString) {
                    ForEach(stringArray, id: \.self) { string in
                        Text(string).tag(string)
                    }
                }
            }
            .navigationBarTitle("Pickerの例")
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
```

この例では、`stringArray` という文字列の配列からPickerで選択することができます。選択した文字列は `selectedString` という変数に格納されます。

ただし、これはあくまで基本的なPickerの作り方の例であり、より具体的な要件や挙動が求められる場合は、それに応じてコードを調整する必要があります。また、このコードはiOS 13以上が対象となっております。

---

## 👤 ユーザー
*2023/6/13 12:44:55*

リストの順番はどうなるの？

---

## 🤖 アシスタント
*2023/6/13 12:45:15*

SwiftUIの`Picker`では、`ForEach`ループを使用して表示するリスト項目を設定します。`ForEach`は配列の順番に従って要素をループするので、リストの順番は元の配列（この場合は`stringArray`）の順番と同じになります。

つまり、以下のコードでは：

```swift
let stringArray = ["文字列1", "文字列2", "文字列3", "文字列4"]
```

Pickerのリスト項目は "文字列1"、"文字列2"、"文字列3"、"文字列4" の順番で表示されます。

もし特定の順序でリストを表示したい場合は、配列を適切な順序に並べ替えるか、またはカスタムの並べ替えルールを定義する必要があります。これは配列のソートや、カスタムの比較関数などを使用して行うことができます。

---

## 👤 ユーザー
*2023/6/13 12:45:50*

もしろわざわざ id と name struct を定義して、UUIDなIDをつけたほうが良かったりしますでしょうか？

---

## 🤖 アシスタント
*2023/6/13 12:46:43*

SwiftUI の `Picker` において、各選択肢を一意に識別するための `id` を使用することは良いアイデアです。それは特に、選択肢の内容が変わる可能性があるときや、選択肢の表示名が一意でない場合に有用です。

UUID を使用して各選択肢に一意な ID を付けることで、SwiftUI の diffing アルゴリズムが効率的にビューの更新を行えるようになります。これは、画面上に表示する選択肢のリストが大きい場合や、リストが動的に変更される可能性がある場合に特に有用です。

以下に、`id` と `name` のフィールドを持つ `Choice` という `struct` を用いた `Picker` の例を示します。

```swift
import SwiftUI

struct Choice: Identifiable {
    let id: UUID
    let name: String
}

struct ContentView: View {
    @State private var selectedChoice: UUID?
    let choices: [Choice] = [
        Choice(id: UUID(), name: "選択肢1"),
        Choice(id: UUID(), name: "選択肢2"),
        Choice(id: UUID(), name: "選択肢3"),
        // etc...
    ]

    var body: some View {
        NavigationView {
            Form {
                Picker("選択肢を選んでください", selection: $selectedChoice) {
                    ForEach(choices) { choice in
                        Text(choice.name).tag(choice.id)
                    }
                }
            }
            .navigationBarTitle("Pickerの例")
        }
    }
}
```

このコードでは、`Picker` の各選択肢は `Choice` インスタンスの `id` で一意に識別されます。そして、`selectedChoice` は選択された選択肢の `id` を保持します。選択肢が選ばれると、その選択肢の `id` が `selectedChoice` に設定されます。

ただし、これが必要になるのは、選択肢のリストが大規模であったり、動的に変わる可能性がある場合です。選択肢が少数で、静的で、そして一意である場合は、そのまま文字列を使用しても問題ありません。

---

## 👤 ユーザー
*2023/6/13 12:47:09*

namesという 選択肢の文字列の配列を用意して、それをChoiceに変換するような流れで、choicesを生成して欲しい。

---

## 🤖 アシスタント
*2023/6/13 12:47:35*

それはもちろん可能です。以下に示すのは、`names`という文字列の配列から`choices`配列を生成するためのコードです。

```swift
import SwiftUI

struct Choice: Identifiable {
    let id: UUID
    let name: String
}

struct ContentView: View {
    @State private var selectedChoice: UUID?
    let names = ["選択肢1", "選択肢2", "選択肢3"]
    lazy var choices: [Choice] = {
        names.map { Choice(id: UUID(), name: $0) }
    }()

    var body: some View {
        NavigationView {
            Form {
                Picker("選択肢を選んでください", selection: $selectedChoice) {
                    ForEach(choices) { choice in
                        Text(choice.name).tag(choice.id)
                    }
                }
            }
            .navigationBarTitle("Pickerの例")
        }
    }
}
```

このコードでは、`names`配列の各要素に対して`map`関数を使用して、それぞれの名前をもつ新しい`Choice`インスタンスを作成します。それらのインスタンスは`choices`配列にまとめられます。`lazy`キーワードを使用して`choices`配列を遅延評価していることに注意してください。これにより、`names`配列が変更されると`choices`配列も適宜更新されます。

---
