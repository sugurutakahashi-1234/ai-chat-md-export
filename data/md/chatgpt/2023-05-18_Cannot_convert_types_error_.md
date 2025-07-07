# Cannot convert types error.

日付: 2023-05-18

---

## 👤 ユーザー
*2023/5/18 13:45:30*

どうして、Cannot convert value of type '[OpenPageType]' to expected argument type 'Binding<C>' や Generic parameter 'C' could not be inferred や Cannot assign value of type 'Binding<_>' to type 'OpenPageType' のようなエラーがでるの？

```
protocol DebugMenuTypeProtocol: Identifiable, CaseIterable where Self: RawRepresentable, Self.RawValue == String {
    var id: String { get }
    var menuName: String { get }
}

extension DebugMenuTypeProtocol {
    var id: String {
        rawValue
    }

    var menuName: String {
        rawValue.fromLowerToUpperCamelCaseConverted
    }
}

enum OpenPageType: String, DebugMenuTypeProtocol {
    case typography

    @ViewBuilder
    var view: some View {
        switch self {
        case .typography: TypographyListView()
        }
    }
}

struct OpenPageView: View {
    @State private var selectedOpenPageType: OpenPageType?

    var body: some View {
        CustomSimpleNavigationView {
            Section {
                List {
                    ForEach(OpenPageType.allCases) { type in
                        Button(type.meneName) {
                            selectedOpenPageType = type
                        }
                    }
                    .sheet(item: $selectedOpenPageType) { type in
                        CoverScreenView(currentItem: .constant(nil)) {
                            type.view
                        }
                    }
                    
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .navigationTitle("Open Page")
        }
    }
}
```

---

## 🤖 アシスタント
*2023/5/18 13:47:11*

このエラーはSwiftの型システムとSwiftUIのビュービルダーの仕組みに関連しています。

まず、「Cannot convert value of type '[OpenPageType]' to expected argument type 'Binding<C>'」というエラーは、ForEachの中で、Binding型を期待している箇所に非Binding型が渡されているために発生している可能性があります。

次に、「Generic parameter 'C' could not be inferred」というエラーは、Swiftがジェネリックパラメータ 'C' を推論できないということを意味します。これは、コンパイラが特定のコードの意図を正確に理解できず、適切な型を決定できない場合に発生します。

また、「Cannot assign value of type 'Binding<_>' to type 'OpenPageType'」というエラーは、Binding型の値をOpenPageType型の変数に代入しようとしたときに発生します。これはSwiftが強く型付けされている言語であるため、一方の型から他方の型への暗黙的な変換は許可されていません。

ソースコードを見たところ、エラーが発生する原因は.sheet()メソッドを使っている部分にあるようです。以下のように修正してみてください：

```swift
struct OpenPageView: View {
    @State private var selectedOpenPageType: OpenPageType?

    var body: some View {
        CustomSimpleNavigationView {
            Section {
                List {
                    ForEach(OpenPageType.allCases, id: \.self) { type in
                        Button(type.menuName) {
                            selectedOpenPageType = type
                        }
                    }
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .navigationTitle("Open Page")
            .sheet(item: $selectedOpenPageType) { type in
                CoverScreenView(currentItem: .constant(nil)) {
                    type.view
                }
            }
        }
    }
}
```

.sheet()メソッドはビュー本体の外部に移動させ、ForEachの内部ではなくビュー全体に適用されるようにしました。これにより、selectedOpenPageTypeがnilでないときにシートが表示されます。また、ForEachにidパラメータを追加し、それぞれのtypeが一意であることを保証しています。

ただし、この修正が全ての問題を解決するわけではありません。CoverScreenViewのcurrentItemがどのように動作するかにより、さらなる修正が必要になるかもしれません。

---
