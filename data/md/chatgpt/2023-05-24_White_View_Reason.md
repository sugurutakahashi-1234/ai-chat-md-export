# White View Reason

Date: 2023-05-24

---

## 👤 User
*2023-05-24 13:55:51*

以下のViewが真っ白のViewになってしまう理由を教えて欲しい

```swift
struct TypographyListView: View {
    private static let navigationTitle: String = "Typography"
    private static let sampleText: String = "ABC 123 あいう 漢字\n2行目のテキスト"

    var body: some View {
        SimpleCustomNavigationView {
            ScrollView(.vertical, showsIndicators: false) {
                Section("テスト") {
                    ForEach(Typography.allCases) { typography in
                        List {
                            VStack {
                                Group {
                                    Text(typography.name)
                                    Text("Weight: \(typography.textStyle.weightType.description)")
                                    Text("Size: \(typography.textStyle.size.asInt) px")
                                    Text("Line Height: \(typography.textStyle.lineHeightType.description)")
                                    Text("Letter Spacing: \(typography.textStyle.kerningType.description)")
                                    Text("Family: \(typography.textStyle.fontType.description)")
                                }
                                .font(.footnote)

                                Text(TypographyListView.sampleText)
                                    .typographyStyle(typography)
                                    .multilineTextAlignment(.center)
                            }
                        }
                    }
                }
            }
            .navigationTitle(TypographyListView.navigationTitle)
        }
    }
}

```

---

## 🤖 Assistant
*2023-05-24 13:56:28*

コードを見てみると、`SimpleCustomNavigationView` や `typographyStyle(_:)` のようなカスタムビューやメソッドが使用されていることがわかります。これらは公式のSwiftUIには存在しないため、その具体的な動作がどのようになっているかによって結果が変わります。

しかし、可能性のある問題として以下の要素が考えられます。

1. **SimpleCustomNavigationViewの問題**：このビューが何を行っているかは、コードからは分かりません。もし何らかの問題があると、全体のビューが表示されなくなる可能性があります。

2. **typographyStyle(_:)メソッドの問題**：このメソッドがどのようにTextビューに影響を与えるかはコードからは分かりません。問題がある場合、このメソッドによってTextビューが表示されない可能性があります。

3. **ListとScrollViewの組み合わせ**：ScrollViewの中に直接Listを使用すると、一部の環境では表示が上手く行かないことがあります。具体的には、List自体がスクロール可能なビューであるため、ScrollView内で使用するとどちらのビューがスクロール操作を受け取るべきかが不明瞭になり、ビューが期待通りに表示されないことがあります。

4. **Typography.allCasesの問題**：`Typography.allCases`が何らかの理由で空の配列を返す、あるいは想定外の結果を返すと、ForEachループの中身が実行されず、表示するべきコンテンツが存在しなくなります。

上記の要素をチェックしてみてください。それでも解決しない場合、より具体的なエラーメッセージやデバッグ情報、カスタムビューやメソッドの定義などを提供いただければ、より具体的な解答が可能となります。

---

## 👤 User
*2023-05-24 13:57:51*

以下のように修正したら画面が表示された！
ただ、一つのrowのコンテンツが大きすぎてrowの内部でスクロールするようになっている。

```swift
struct TypographyListView: View {
    private static let navigationTitle: String = "Typography"
    private static let sampleText: String = "ABC 123 あいう 漢字\n2行目のテキスト"

    var body: some View {
        SimpleCustomNavigationView {
            Section("テスト") {
                ForEach(Typography.allCases) { typography in
                    List {
                        VStack {
                            Group {
                                Text(typography.name)
                                Text("Weight: \(typography.textStyle.weightType.description)")
                                Text("Size: \(typography.textStyle.size.asInt) px")
                                Text("Line Height: \(typography.textStyle.lineHeightType.description)")
                                Text("Letter Spacing: \(typography.textStyle.kerningType.description)")
                                Text("Family: \(typography.textStyle.fontType.description)")
                            }
                            .font(.footnote)
                            
                            Text(TypographyListView.sampleText)
                                .typographyStyle(typography)
                                .multilineTextAlignment(.center)
                        }
                    }
                }
            }
            .navigationTitle(TypographyListView.navigationTitle)
        }
    }
}
```

---

## 🤖 Assistant
*2023-05-24 13:58:29*

画面が表示されたとのことで良かったです。ただ、それぞれのRowが大きすぎて内部でスクロールしてしまっているとのことですね。

SwiftUIの`List`は自動的にビューのサイズを調整し、内容全体を表示しようとします。しかし、それぞれのRowの内容が大きすぎる場合、内容全体を表示するために自動的にスクロール可能な状態になります。

もし、それぞれのRowのサイズを一定に保ちつつ、その中でスクロールしないようにしたい場合は、以下のように `.fixedSize(horizontal: false, vertical: true)` を各RowのVStackに適用すると良いでしょう。

```swift
struct TypographyListView: View {
    private static let navigationTitle: String = "Typography"
    private static let sampleText: String = "ABC 123 あいう 漢字\n2行目のテキスト"

    var body: some View {
        SimpleCustomNavigationView {
            Section("テスト") {
                ForEach(Typography.allCases) { typography in
                    List {
                        VStack {
                            Group {
                                Text(typography.name)
                                Text("Weight: \(typography.textStyle.weightType.description)")
                                Text("Size: \(typography.textStyle.size.asInt) px")
                                Text("Line Height: \(typography.textStyle.lineHeightType.description)")
                                Text("Letter Spacing: \(typography.textStyle.kerningType.description)")
                                Text("Family: \(typography.textStyle.fontType.description)")
                            }
                            .font(.footnote)

                            Text(TypographyListView.sampleText)
                                .typographyStyle(typography)
                                .multilineTextAlignment(.center)
                        }
                        .fixedSize(horizontal: false, vertical: true)
                    }
                }
            }
            .navigationTitle(TypographyListView.navigationTitle)
        }
    }
}
```

この修正により、各Rowの高さが内容に応じて自動調整され、内部のスクロールが発生しなくなるはずです。ただし、内容がビューの高さを超える場合、一部が見切れることがあります。それを避けるためには、ビューのデザインを調整する必要があります。例えば、テキストのサイズを小さくする、余分な空白を取り除くなどの対応が考えられます。

---

## 👤 User
*2023-05-24 13:59:13*

これでも縦スクロールしてしまったのだけれど、、、

---

## 🤖 Assistant
*2023-05-24 13:59:50*

すみません、それでは一旦、このように`ScrollView`を使用する方法を試してみてはいかがでしょうか：

```swift
struct TypographyListView: View {
    private static let navigationTitle: String = "Typography"
    private static let sampleText: String = "ABC 123 あいう 漢字\n2行目のテキスト"

    var body: some View {
        SimpleCustomNavigationView {
            Section("テスト") {
                ScrollView {
                    ForEach(Typography.allCases) { typography in
                        VStack {
                            Group {
                                Text(typography.name)
                                Text("Weight: \(typography.textStyle.weightType.description)")
                                Text("Size: \(typography.textStyle.size.asInt) px")
                                Text("Line Height: \(typography.textStyle.lineHeightType.description)")
                                Text("Letter Spacing: \(typography.textStyle.kerningType.description)")
                                Text("Family: \(typography.textStyle.fontType.description)")
                            }
                            .font(.footnote)
                            
                            Text(TypographyListView.sampleText)
                                .typographyStyle(typography)
                                .multilineTextAlignment(.center)
                        }
                        .padding()
                        .frame(maxWidth: .infinity)
                    }
                }
            }
            .navigationTitle(TypographyListView.navigationTitle)
        }
    }
}
```

このコードでは、`List`ではなく`ScrollView`を使用しています。そして、各要素は`VStack`内に配置され、`ForEach`ループを通じて生成されます。この配置により、ビュー全体が縦にスクロール可能になり、各行が内部でスクロールすることはなくなります。

なお、上記のコードはサンプルコードであり、実際のプロジェクトに直接適用する前に調整が必要な場合があります。例えば、`.padding()`や`.frame(maxWidth: .infinity)`などの修飾子は、このサンプルコードで適切な見た目を得るために追加されましたが、あなたのプロジェクトで必要とされるスタイルによっては、異なる値や追加の修飾子が必要になるかもしれません。

---
