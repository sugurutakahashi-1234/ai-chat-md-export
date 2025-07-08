# SF Symbols グリッド選択

Date: 2024-05-21

---

## 👤 User
*2024-05-21 11:52:29*

この SF Symbols をグリッド状にならべて選択する画面を作りたい

// MARK: - Entity

public enum SFSymbols: String {
    /// アルファベット順に整列させておくと管理しやすい
    case archivebox
    case bell
    case clock
    case ellipsisCircle
    case gearshape
    case goforward15
    case gobackward15
    case heart
    case house
    case ladybug
    case mic
    case musicNoteList
    case pauseFill
    case personCropCircle
    case playFill
    case plusCircle
    case recordCircle
    case rectangleAndPencilAndEllipsis
    case squareAndArrowUp
    case squareGrid2x2
    case swatchpalette
    case trash
    case xmark
    case waveform

    public var name: String {
        // SFSymbols の数字の区切りが一定ではないので数字が含まれるものは定義したほうが混乱を防げます
        switch self {
        case .goforward15:
            "goforward.15"
        case .gobackward15:
            "gobackward.15"
        case .squareGrid2x2:
            "square.grid.2x2"
        default:
            rawValue.toDotSeparatedLowercase
        }
    }

    public var image: Image {
        Image(systemName: name)
    }
}

---

## 🤖 Assistant
*2024-05-21 11:52:57*

SF Symbolsをグリッド状に並べて選択する画面を作成するために、SwiftUIを使用します。この例では、`LazyVGrid`を使用してグリッドレイアウトを作成し、各シンボルを表示するためのアイテムを生成します。

以下はその実装例です。

```swift
import SwiftUI

// MARK: - Entity

public enum SFSymbols: String, CaseIterable {
    case archivebox
    case bell
    case clock
    case ellipsisCircle
    case gearshape
    case goforward15
    case gobackward15
    case heart
    case house
    case ladybug
    case mic
    case musicNoteList
    case pauseFill
    case personCropCircle
    case playFill
    case plusCircle
    case recordCircle
    case rectangleAndPencilAndEllipsis
    case squareAndArrowUp
    case squareGrid2x2
    case swatchpalette
    case trash
    case xmark
    case waveform

    public var name: String {
        switch self {
        case .goforward15:
            return "goforward.15"
        case .gobackward15:
            return "gobackward.15"
        case .squareGrid2x2:
            return "square.grid.2x2"
        default:
            return rawValue.toDotSeparatedLowercase
        }
    }

    public var image: Image {
        Image(systemName: name)
    }
}

extension String {
    var toDotSeparatedLowercase: String {
        return self.splitBefore { $0.isUppercase }.joined(separator: ".").lowercased()
    }

    private func splitBefore(separator: (Character) -> Bool) -> [Substring] {
        var result: [Substring] = []
        var substringStart = startIndex

        for i in indices {
            if i != startIndex && separator(self[i]) {
                result.append(self[substringStart..<i])
                substringStart = i
            }
        }

        result.append(self[substringStart..<endIndex])
        return result
    }
}

struct ContentView: View {
    let columns = [
        GridItem(.flexible()),
        GridItem(.flexible()),
        GridItem(.flexible())
    ]
    
    var body: some View {
        ScrollView {
            LazyVGrid(columns: columns, spacing: 20) {
                ForEach(SFSymbols.allCases, id: \.self) { symbol in
                    symbol.image
                        .resizable()
                        .scaledToFit()
                        .frame(width: 50, height: 50)
                        .padding()
                        .background(Color.gray.opacity(0.2))
                        .cornerRadius(10)
                }
            }
            .padding()
        }
        .navigationTitle("SF Symbols")
    }
}

@main
struct MyApp: App {
    var body: some Scene {
        WindowGroup {
            NavigationView {
                ContentView()
            }
        }
    }
}
```

### 説明

1. `SFSymbols` enumに`CaseIterable`を適用し、すべてのケースを列挙できるようにします。
2. `ContentView`で`LazyVGrid`を使用してグリッドレイアウトを作成します。
3. `ForEach`で`SFSymbols.allCases`を繰り返し、各シンボルを表示します。
4. 各シンボルのイメージを調整し、グリッドアイテムのスタイルを設定します。
5. `MyApp`構造体の`WindowGroup`内で`NavigationView`を使用してアプリのナビゲーションを設定します。

このコードを実行すると、SF Symbolsがグリッド状に並べられ、各シンボルをタップして選択することができます。

---

## 👤 User
*2024-05-21 11:53:48*

もっと最新のSwiftUIのAPIを使ってシンプルに表現したい。

---

## 🤖 Assistant
*2024-05-21 11:54:17*

最新のSwiftUIのAPIを使用して、さらにシンプルにSF Symbolsをグリッド状に並べる方法を紹介します。`LazyVGrid`や新しいレイアウトAPIを活用してコードを簡潔にします。

以下はその実装例です。

```swift
import SwiftUI

// MARK: - Entity

public enum SFSymbols: String, CaseIterable {
    case archivebox
    case bell
    case clock
    case ellipsisCircle
    case gearshape
    case goforward15
    case gobackward15
    case heart
    case house
    case ladybug
    case mic
    case musicNoteList
    case pauseFill
    case personCropCircle
    case playFill
    case plusCircle
    case recordCircle
    case rectangleAndPencilAndEllipsis
    case squareAndArrowUp
    case squareGrid2x2
    case swatchpalette
    case trash
    case xmark
    case waveform

    public var name: String {
        switch self {
        case .goforward15:
            return "goforward.15"
        case .gobackward15:
            return "gobackward.15"
        case .squareGrid2x2:
            return "square.grid.2x2"
        default:
            return rawValue.splitBefore(separator: { $0.isUppercase }).joined(separator: ".").lowercased()
        }
    }

    public var image: Image {
        Image(systemName: name)
    }
}

extension String {
    func splitBefore(separator: (Character) -> Bool) -> [String] {
        var result: [String] = []
        var current = ""

        for char in self {
            if separator(char) && !current.isEmpty {
                result.append(current)
                current = ""
            }
            current.append(char)
        }

        if !current.isEmpty {
            result.append(current)
        }

        return result
    }
}

struct ContentView: View {
    let columns = [GridItem(.adaptive(minimum: 80))]

    var body: some View {
        ScrollView {
            LazyVGrid(columns: columns, spacing: 20) {
                ForEach(SFSymbols.allCases, id: \.self) { symbol in
                    symbol.image
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: 50, height: 50)
                        .padding()
                        .background(Color.gray.opacity(0.2))
                        .cornerRadius(10)
                }
            }
            .padding()
        }
        .navigationTitle("SF Symbols")
    }
}

@main
struct MyApp: App {
    var body: some Scene {
        WindowGroup {
            NavigationView {
                ContentView()
            }
        }
    }
}
```

### 説明

1. `SFSymbols` enumに`CaseIterable`を適用し、すべてのケースを列挙できるようにします。
2. `ContentView`で`LazyVGrid`を使用してグリッドレイアウトを作成します。`GridItem`の`.adaptive(minimum:)`を使用して、柔軟なレイアウトを設定します。
3. `ForEach`で`SFSymbols.allCases`を繰り返し、各シンボルを表示します。
4. 各シンボルのイメージを調整し、グリッドアイテムのスタイルを設定します。
5. `MyApp`構造体の`WindowGroup`内で`NavigationView`を使用してアプリのナビゲーションを設定します。

このコードを実行すると、SF Symbolsがグリッド状に並べられ、各シンボルをタップして選択することができます。最新のSwiftUI APIを使用してシンプルかつ柔軟なレイアウトを実現しています。

---

## 👤 User
*2024-05-21 11:55:11*

通常のGrid を使うケースとLazyVGridを使うケースのどちらがいいのか？

---

## 🤖 Assistant
*2024-05-21 11:55:37*

`Grid`と`LazyVGrid`の違いとそれぞれの使用ケースについて説明します。

### Grid vs. LazyVGrid

#### Grid
- **概要**: `Grid`はiOS 16以降で利用可能な新しいレイアウトシステムの一部です。通常の`Grid`は全ての子ビューを一度にレイアウトし、表示します。
- **特徴**:
  - 小規模なデータセットや静的なレイアウトに向いています。
  - スクロールが必要ない場合や、少量のアイテムを表示する場合に適しています。

#### LazyVGrid
- **概要**: `LazyVGrid`は`LazyHGrid`とともに、iOS 14以降で利用可能です。これらはスクロール可能なコンテナで、アイテムを遅延読み込みすることでパフォーマンスを向上させます。
- **特徴**:
  - 大規模なデータセットやスクロールが必要なレイアウトに向いています。
  - アイテムが画面に表示される直前にのみ読み込まれるため、メモリ使用量が少なく、パフォーマンスが向上します。

### 使用ケース

#### Gridを使うケース
- アイテム数が少なく、静的なレイアウトの場合。
- スクロールが必要ない固定サイズのコンテンツの場合。
- パフォーマンスに大きな影響がない場合。

#### LazyVGridを使うケース
- アイテム数が多い場合。
- スクロールが必要なレイアウトの場合。
- パフォーマンスを重視し、メモリ使用量を抑えたい場合。

### 例

#### Gridを使った例

```swift
import SwiftUI

struct GridView: View {
    let items = Array(1...20).map { "Item \($0)" }
    let columns = [GridItem(.adaptive(minimum: 80))]

    var body: some View {
        Grid {
            ForEach(items, id: \.self) { item in
                Text(item)
                    .frame(width: 50, height: 50)
                    .background(Color.gray.opacity(0.2))
                    .cornerRadius(10)
            }
        }
        .padding()
    }
}

struct GridView_Previews: PreviewProvider {
    static var previews: some View {
        GridView()
    }
}
```

#### LazyVGridを使った例

```swift
import SwiftUI

struct LazyVGridView: View {
    let items = Array(1...100).map { "Item \($0)" }
    let columns = [GridItem(.adaptive(minimum: 80))]

    var body: some View {
        ScrollView {
            LazyVGrid(columns: columns, spacing: 20) {
                ForEach(items, id: \.self) { item in
                    Text(item)
                        .frame(width: 50, height: 50)
                        .background(Color.gray.opacity(0.2))
                        .cornerRadius(10)
                }
            }
            .padding()
        }
    }
}

struct LazyVGridView_Previews: PreviewProvider {
    static var previews: some View {
        LazyVGridView()
    }
}
```

### 結論

- **少数のアイテム**や**静的なレイアウト**では、`Grid`が適しています。
- **多数のアイテム**や**スクロール可能なレイアウト**では、`LazyVGrid`が適しています。

あなたの具体的な用途（SF Symbolsのグリッド表示）では、アイテム数が多くなる可能性があるため、パフォーマンス面で優れている`LazyVGrid`の使用をお勧めします。

---
