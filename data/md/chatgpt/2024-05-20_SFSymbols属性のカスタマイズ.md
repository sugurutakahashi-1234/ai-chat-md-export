# SFSymbols属性のカスタマイズ

日付: 2024-05-20

---

## 👤 ユーザー
*2024/05/20 19:42:52*

本当はHStack全体にかかるのではなくSFSymbolsRowView内にsymbolRenderingModeやforegroundStyleを指定したいどうすればできるのか？

struct SFSymbolsVariationView: View {
    var sfSymbol: SFSymbols
    
    var body: some View {
        SFSymbolsRowView(title: "monochrome", sfSymbol: sfSymbol)
            .symbolRenderingMode(.monochrome)
            .foregroundStyle(.gray)

        SFSymbolsRowView(title: "hierarchical", sfSymbol: sfSymbol)
            .symbolRenderingMode(.hierarchical)
            .foregroundStyle(.gray)

        SFSymbolsRowView(title: "palette", sfSymbol: sfSymbol)
            .symbolRenderingMode(.palette)
            .foregroundStyle(.gray, .blue)
        
        SFSymbolsRowView(title: "multicolor", sfSymbol: sfSymbol)
            .symbolRenderingMode(.multicolor)
    }
}

struct SFSymbolsRowView: View {
    var title: String
    var sfSymbol: SFSymbols
    
    var body: some View {
        HStack {
            Text(title)
            Spacer()
            sfSymbol.image
                .symbolRenderingMode(.xxx)
        }
    }
}

---

## 🤖 アシスタント
*2024/05/20 19:42:57*

`SFSymbolsRowView`を更新して、`symbolRenderingMode`や`foregroundStyle`を指定できるようにします。そのために、`symbolRenderingMode`と`foregroundStyle`を`SFSymbolsRowView`のプロパティとして受け取り、それらを適用します。以下がその方法です。

```swift
struct SFSymbolsVariationView: View {
    var sfSymbol: SFSymbols
    
    var body: some View {
        SFSymbolsRowView(title: "monochrome", sfSymbol: sfSymbol, symbolRenderingMode: .monochrome, foregroundStyle: .gray)

        SFSymbolsRowView(title: "hierarchical", sfSymbol: sfSymbol, symbolRenderingMode: .hierarchical, foregroundStyle: .gray)

        SFSymbolsRowView(title: "palette", sfSymbol: sfSymbol, symbolRenderingMode: .palette, foregroundStyle: .gray, .blue)
        
        SFSymbolsRowView(title: "multicolor", sfSymbol: sfSymbol, symbolRenderingMode: .multicolor)
    }
}

struct SFSymbolsRowView: View {
    var title: String
    var sfSymbol: SFSymbols
    var symbolRenderingMode: Image.SymbolRenderingMode?
    var foregroundStyle: ForegroundStyle?
    
    var body: some View {
        HStack {
            Text(title)
            Spacer()
            sfSymbol.image
                .symbolRenderingMode(symbolRenderingMode)
                .foregroundStyle(foregroundStyle)
        }
    }
}
```

これで、`SFSymbolsRowView`を使用する際に`symbolRenderingMode`と`foregroundStyle`を指定できます。

---

## 👤 ユーザー
*2024/05/20 19:43:47*

モディファイアみたく設定したい

---

## 🤖 アシスタント
*2024/05/20 19:43:54*

理解しました。`SFSymbolsRowView`内でモディファイアのように設定できるようにするために、関数型のモディファイアを定義します。これにより、`SFSymbolsRowView`のインスタンスに対して直接呼び出すことができます。以下がその方法です。

```swift
struct SFSymbolsVariationView: View {
    var sfSymbol: SFSymbols
    
    var body: some View {
        SFSymbolsRowView(title: "monochrome", sfSymbol: sfSymbol)
            .customize(symbolRenderingMode: .monochrome, foregroundStyle: .gray)

        SFSymbolsRowView(title: "hierarchical", sfSymbol: sfSymbol)
            .customize(symbolRenderingMode: .hierarchical, foregroundStyle: .gray)

        SFSymbolsRowView(title: "palette", sfSymbol: sfSymbol)
            .customize(symbolRenderingMode: .palette, foregroundStyle: .gray, .blue)
        
        SFSymbolsRowView(title: "multicolor", sfSymbol: sfSymbol)
            .customize(symbolRenderingMode: .multicolor)
    }
}

struct SFSymbolsRowView: View {
    var title: String
    var sfSymbol: SFSymbols
    @State private var symbolRenderingMode: Image.SymbolRenderingMode?
    @State private var foregroundStyle: ForegroundStyle?
    
    var body: some View {
        HStack {
            Text(title)
            Spacer()
            sfSymbol.image
                .symbolRenderingMode(symbolRenderingMode)
                .foregroundStyle(foregroundStyle)
        }
    }
    
    func customize(symbolRenderingMode: Image.SymbolRenderingMode? = nil, foregroundStyle: ForegroundStyle? = nil) -> Self {
        var view = self
        view.symbolRenderingMode = symbolRenderingMode
        view.foregroundStyle = foregroundStyle
        return view
    }
    
    func customize(symbolRenderingMode: Image.SymbolRenderingMode? = nil, _ foregroundStyles: ForegroundStyle...) -> Self {
        var view = self
        view.symbolRenderingMode = symbolRenderingMode
        view.foregroundStyle = foregroundStyles.reduce(nil, +)
        return view
    }
}
```

このようにすることで、`SFSymbolsRowView`のインスタンスに対して`.customize()`を呼び出し、`symbolRenderingMode`と`foregroundStyle`を設定できます。

---

## 👤 ユーザー
*2024/05/20 19:44:29*

わかりずらいから全部Hstackを複数回記述するようにしたい。
struct SFSymbolsVariationView: View {
    var sfSymbol: SFSymbols
    
    var body: some View {
        SFSymbolsRowView(title: "monochrome", sfSymbol: sfSymbol)
            .symbolRenderingMode(.monochrome)
            .foregroundStyle(.gray)

        SFSymbolsRowView(title: "hierarchical", sfSymbol: sfSymbol)
            .symbolRenderingMode(.hierarchical)
            .foregroundStyle(.gray)

        SFSymbolsRowView(title: "palette", sfSymbol: sfSymbol)
            .symbolRenderingMode(.palette)
            .foregroundStyle(.gray, .blue)
        
        SFSymbolsRowView(title: "multicolor", sfSymbol: sfSymbol)
            .symbolRenderingMode(.multicolor)
    }
}

struct SFSymbolsRowView: View {
    var title: String
    var sfSymbol: SFSymbols
    
    var body: some View {
        HStack {
            Text(title)
            Spacer()
            sfSymbol.image
        }
    }
}

---

## 🤖 アシスタント
*2024/05/20 19:44:34*

理解しました。各種の設定を適用するために、`SFSymbolsRowView`を複数回使用する方法を示します。

```swift
struct SFSymbolsVariationView: View {
    var sfSymbol: SFSymbols
    
    var body: some View {
        VStack {
            SFSymbolsRowView(title: "monochrome", sfSymbol: sfSymbol)
                .symbolRenderingMode(.monochrome)
                .foregroundStyle(.gray)

            SFSymbolsRowView(title: "hierarchical", sfSymbol: sfSymbol)
                .symbolRenderingMode(.hierarchical)
                .foregroundStyle(.gray)

            SFSymbolsRowView(title: "palette", sfSymbol: sfSymbol)
                .symbolRenderingMode(.palette)
                .foregroundStyle(.gray, .blue)
            
            SFSymbolsRowView(title: "multicolor", sfSymbol: sfSymbol)
                .symbolRenderingMode(.multicolor)
        }
    }
}

struct SFSymbolsRowView: View {
    var title: String
    var sfSymbol: SFSymbols
    
    var body: some View {
        HStack {
            Text(title)
            Spacer()
            sfSymbol.image
        }
    }
}
```

このようにすると、各設定を適用した`SFSymbolsRowView`が個別の`VStack`内に表示されます。それぞれの`SFSymbolsRowView`に対して、`symbolRenderingMode`や`foregroundStyle`を適用できます。

---
