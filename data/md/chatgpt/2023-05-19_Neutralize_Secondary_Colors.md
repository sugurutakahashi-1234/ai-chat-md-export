# Neutralize Secondary Colors

日付: 2023-05-19

---

## 👤 ユーザー
*2023/5/19 17:24:31*

以下のsecondary の部分を neutral に変換した文字列がほしい。1行でお願い。

secondary90, secondary80, secondary70, secondary60, secondary50, secondary40, secondary30, secondary20, secondary10, secondary5

---

## 🤖 アシスタント
*2023/5/19 17:24:32*

neutral90, neutral80, neutral70, neutral60, neutral50, neutral40, neutral30, neutral20, neutral10, neutral5

---

## 👤 ユーザー
*2023/5/19 18:07:58*

以下のコードで `Instance method 'listRowBackground' requires that 'some ShapeStyle' conform to 'View'` というエラーが出たんだけどなんで？

```swift
enum Hoge: String, CaseIterable, Identifiable {
    var id: Int {
        opacity
    }
    
    case primary100, primary90, primary80, primary70, primary60, primary50, primary40, primary30, primary20, primary10, primary5
    
    var opacity: Int {
        switch self {
        case .primary100:
            return 100
        case .primary90:
            return 90
        case .primary80:
            return 80
        case .primary70:
            return 70
        case .primary60:
            return 60
        case .primary50:
            return 50
        case .primary40:
            return 40
        case .primary30:
            return 30
        case .primary20:
            return 20
        case .primary10:
            return 10
        case .primary5:
            return 5
        }
    }

    var color: some ShapeStyle {
        LinearGradient(
            gradient: Gradient(colors: [
                ColorAssets.PrimaryBackground.leading.swiftUIColor.opacity(Double(opacity)/100),
                ColorAssets.PrimaryBackground.trailing.swiftUIColor.opacity(Double(opacity)/100),
            ]),
            startPoint: .leading,
            endPoint: .trailing
        )
        .opacity(Double(opacity)/100)
    }
}

struct ColorListView: View {
    private static let navigationTitle: String = "Color"

    var body: some View {
        SimpleCustomNavigationView {
            List {
                Section(header: Text("hoge")) {
                    ForEach(Hoge.allCases) { backgroundColor in
                        HStack {
                            Text(backgroundColor.rawValue)
                            Text("Opacity: \(backgroundColor.opacity)")
                        }
                        .listRowBackground(backgroundColor.color)
                    }
                }
            }
            .listStyle(.automatic)
            .navigationTitle(ColorListView.navigationTitle)
        }
    }
}
```

---

## 🤖 アシスタント
*2023/5/19 18:08:08*

このエラーは、`listRowBackground` メソッドに渡される引数である `backgroundColor.color` が `View` プロトコルに準拠していないため発生しています。

`listRowBackground` メソッドは、行の背景に適用するためにビューを受け取ります。しかし、`Hoge` 列挙型の `color` プロパティは `some ShapeStyle` 型を返しており、これは `View` プロトコルに直接準拠していません。

解決するためには、`color` プロパティを `View` に変換する必要があります。これを実現するには、`color` プロパティを返す代わりに、`LinearGradient` インスタンスを直接返すことができます。そして、そのインスタンスを `listRowBackground` メソッドに直接渡します。

修正したコードは以下のようになります：

```swift
enum Hoge: String, CaseIterable, Identifiable {
    var id: Int {
        opacity
    }
    
    case primary100, primary90, primary80, primary70, primary60, primary50, primary40, primary30, primary20, primary10, primary5
    
    var opacity: Int {
        switch self {
        case .primary100:
            return 100
        case .primary90:
            return 90
        case .primary80:
            return 80
        case .primary70:
            return 70
        case .primary60:
            return 60
        case .primary50:
            return 50
        case .primary40:
            return 40
        case .primary30:
            return 30
        case .primary20:
            return 20
        case .primary10:
            return 10
        case .primary5:
            return 5
        }
    }

    var color: LinearGradient {
        LinearGradient(
            gradient: Gradient(colors: [
                ColorAssets.PrimaryBackground.leading.swiftUIColor.opacity(Double(opacity)/100),
                ColorAssets.PrimaryBackground.trailing.swiftUIColor.opacity(Double(opacity)/100),
            ]),
            startPoint: .leading,
            endPoint: .trailing
        )
        .opacity(Double(opacity)/100)
    }
}
```

この修正により、`color` プロパティが直接 `LinearGradient` インスタンスを返すようになります。その結果、`listRowBackground` メソッドは正しく `LinearGradient` を受け取ることができ、エラーが解消されます。

---

## 👤 ユーザー
*2023/5/19 18:14:17*

そうすると以下のエラーが `.opacity(Double(opacity)/100)` ででてしまんだけど

```
No 'opacity' candidates produce the expected contextual result type 'LinearGradient'
```

---

## 🤖 アシスタント
*2023/5/19 18:14:22*

すみません、先ほどの回答に誤りがありました。`LinearGradient` 自体には `opacity` プロパティが存在しないため、エラーが発生しています。

`opacity` を適用するためには、`LinearGradient` を `opacity` メソッドで囲む必要があります。修正したコードは以下のようになります：

```swift
var color: some View {
    LinearGradient(
        gradient: Gradient(colors: [
            ColorAssets.PrimaryBackground.leading.swiftUIColor.opacity(Double(opacity)/100),
            ColorAssets.PrimaryBackground.trailing.swiftUIColor.opacity(Double(opacity)/100),
        ]),
        startPoint: .leading,
        endPoint: .trailing
    )
    .opacity(Double(opacity)/100)
}
```

`color` プロパティが `some View` を返すようになり、`listRowBackground` メソッドに渡すことができます。エラーが解消され、予期した動作が得られるはずです。申し訳ありませんでした。

---
