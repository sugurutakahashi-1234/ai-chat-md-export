# ForEach Requires RandomAccessCollection

日付: 2023-05-19

---

## 👤 ユーザー
*2023/5/19 21:11:13*

以下のコードで `Generic struct 'ForEach' requires that 'BackgroundColorAssets.AllCases' conform to 'RandomAccessCollection'` というエラーになる

```swift
protocol BackgroundColorAssetsListable: CaseIterable, Identifiable, RawRepresentable {
    associatedtype BackgroundColor: View
    static var name: String { get }
    var name: String { get }
    var color: BackgroundColor { get }
}


struct BackgroundColorSectionView<BackgroundColorAssets: BackgroundColorAssetsListable>: View {
    var body: some View {
        Section(header: Text(BackgroundColorAssets.name)) {
            ForEach(BackgroundColorAssets.allCases) { backgroundColor in
                HStack {
                    Text(backgroundColor.name)
                        .fontWeight(.bold)
                    Spacer()
                    Text("Opacity: \(backgroundColor.opacity)")
                    Spacer()
                }
                .listRowBackground(backgroundColor.color)
            }
        }
    }
}
```

---

## 🤖 アシスタント
*2023/5/19 21:12:01*

SwiftUIの`ForEach`は、その初期化子が`RandomAccessCollection`に適合することを要求しています。`CaseIterable`プロトコルは、そのすべてのケースを表現する静的プロパティ`allCases`を提供しますが、このプロパティは通常の`Collection`であり、`RandomAccessCollection`ではないため、この問題が発生します。

この問題を解決するために、まず`CaseIterable`が適合するためのプロトコルを作成し、その`AllCases`型が`RandomAccessCollection`を満たすようにします。そのためには、新たにプロトコルを定義し、このプロトコルが`CaseIterable`と`RandomAccessCollection`を満たすようにします。こうすることで、`BackgroundColorAssetsListable`がこの新たなプロトコルに満たすことを要求することができます。

```swift
protocol RandomAccessCaseIterable: CaseIterable where AllCases: RandomAccessCollection { }

extension RandomAccessCaseIterable where Self: Hashable {
    static var allCases: [Self] {
        return Array(Self.self)
    }
}

protocol BackgroundColorAssetsListable: RandomAccessCaseIterable, Identifiable, RawRepresentable {
    associatedtype BackgroundColor: View
    static var name: String { get }
    var name: String { get }
    var color: BackgroundColor { get }
}
```

このコードでは、`RandomAccessCaseIterable`プロトコルが新たに作成されており、このプロトコルは`CaseIterable`を満たすもので、その`AllCases`型が`RandomAccessCollection`を満たすものと定義されています。さらに、`RandomAccessCaseIterable`にデフォルトの実装を提供しています。これは`Hashable`に満たすものに対してのみ有効で、全てのケースを配列として返すようにしています。この配列は`RandomAccessCollection`を満たすため、これにより問題が解決されます。

次に、`BackgroundColorAssetsListable`プロトコルが新たに作成した`RandomAccessCaseIterable`プロトコルを満たすようにします。こうすることで、`ForEach`の初期化子が要求する`RandomAccessCollection`の要件を満たすことができるようになります。

---

## 👤 ユーザー
*2023/5/19 21:12:52*

protcol はそのままで ForEach の方を変えるアプローチはない？

---

## 🤖 アシスタント
*2023/5/19 21:13:21*

はい、そのアプローチも可能です。ForEachの初期化子はSequenceを受け取るバージョンもありますので、それを使用することでCaseIterableとしてのallCasesを直接使用できます。以下のようにコードを変更することができます。

```swift
struct BackgroundColorSectionView<BackgroundColorAssets: BackgroundColorAssetsListable>: View {
    var body: some View {
        Section(header: Text(BackgroundColorAssets.name)) {
            ForEach(BackgroundColorAssets.allCases, id: \.self) { backgroundColor in
                HStack {
                    Text(backgroundColor.name)
                        .fontWeight(.bold)
                    Spacer()
                    Text("Opacity: \(backgroundColor.opacity)")
                    Spacer()
                }
                .listRowBackground(backgroundColor.color)
            }
        }
    }
}
```

この変更でForEachの初期化子はCaseIterableとしてのallCasesを受け取ります。ただし、ここでは明示的にidを指定しています。このid: \.selfは、allCasesの各要素が一意であり、そのためにIdentifiableプロトコルを満たすことを示しています。

なお、上記コードでbackgroundColor.opacityが未定義となるエラーが出る場合、適切なプロパティ名に置き換えてください。

---

## 👤 ユーザー
*2023/5/19 21:13:47*

Generic struct 'ForEach' requires that 'BackgroundColorAssets' conform to 'Hashable' と怒られた

---

## 🤖 アシスタント
*2023/5/19 21:14:34*

`ForEach`が`CaseIterable`の`allCases`を利用するには、その要素が`Hashable`を満たす必要があります。`Hashable`は要素が一意に識別可能であることを保証するプロトコルです。これは`ForEach`が各要素を一意に識別できるようにするためです。

したがって、`BackgroundColorAssetsListable`プロトコルが`Hashable`を満たすことを要求する必要があります。以下にその変更を示します。

```swift
protocol BackgroundColorAssetsListable: CaseIterable, Identifiable, RawRepresentable, Hashable {
    associatedtype BackgroundColor: View
    static var name: String { get }
    var name: String { get }
    var color: BackgroundColor { get }
}

struct BackgroundColorSectionView<BackgroundColorAssets: BackgroundColorAssetsListable>: View {
    var body: some View {
        Section(header: Text(BackgroundColorAssets.name)) {
            ForEach(BackgroundColorAssets.allCases, id: \.self) { backgroundColor in
                HStack {
                    Text(backgroundColor.name)
                        .fontWeight(.bold)
                    Spacer()
                    // Ensure you have a way to represent opacity
                    Text("Opacity: ???")
                    Spacer()
                }
                .listRowBackground(backgroundColor.color)
            }
        }
    }
}
```

この変更により、`BackgroundColorAssetsListable`が`Hashable`を満たすようになり、それによってその`allCases`の各要素も`Hashable`を満たすようになります。その結果、`ForEach`はこれらの要素を一意に識別することができます。

なお、上記のコードでは`backgroundColor.opacity`が定義されていません。`BackgroundColorAssetsListable`に`opacity`のプロパティがある場合はそれを使用してください。もし無い場合は適切なものに置き換えてください。

---

## 👤 ユーザー
*2023/5/19 21:15:11*

やはり Hashable しても Generic struct 'ForEach' requires that 'BackgroundColorAssets.AllCases' conform to 'RandomAccessCollection' と怒られてしまった

---

## 🤖 アシスタント
*2023/5/19 21:15:40*

すみません、私の説明が間違っていました。Swiftの`ForEach`はSequenceを受け取るバージョンもありますが、それは実際にはViewBuilder内で直接列挙可能なデータを扱うもので、その`CaseIterable`などから直接生成されるデータに対しては適用できません。そのため、`CaseIterable`の`allCases`を直接使おうとすると、RandomAccessCollectionを要求されるエラーが出ます。

これを解決するためには、`allCases`をArrayに変換することでRandomAccessCollectionを満たすようにすることができます。以下にその変更を示します：

```swift
struct BackgroundColorSectionView<BackgroundColorAssets: BackgroundColorAssetsListable>: View {
    var body: some View {
        Section(header: Text(BackgroundColorAssets.name)) {
            ForEach(Array(BackgroundColorAssets.allCases), id: \.self) { backgroundColor in
                HStack {
                    Text(backgroundColor.name)
                        .fontWeight(.bold)
                    Spacer()
                    // Ensure you have a way to represent opacity
                    Text("Opacity: ???")
                    Spacer()
                }
                .listRowBackground(backgroundColor.color)
            }
        }
    }
}
```

ここでは、`BackgroundColorAssets.allCases`を`Array`に変換しています。この`Array`は`RandomAccessCollection`を満たすため、これにより問題が解決します。

---
