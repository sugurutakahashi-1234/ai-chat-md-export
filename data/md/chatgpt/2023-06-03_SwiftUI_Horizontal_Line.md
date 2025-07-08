# SwiftUI Horizontal Line

日付: 2023-06-03

---

## 👤 ユーザー
*2023/06/04 00:07:49*

SwiftUI で横線のラインを引く場合はどうすればいいの？ドットの横線にしたいんだ

---

## 🤖 アシスタント
*2023/06/04 00:08:22*

SwiftUIで横線（ドット線）を引くためには、`overlay`や`background`といった修飾子を利用することができます。以下にその例を示します：

```swift
struct ContentView: View {
    var body: some View {
        VStack {
            Text("Hello, SwiftUI!")
                .padding()
                .overlay(
                    Divider()
                        .frame(height: 1)
                        .background(DottedLineStyle())
                        .padding(.horizontal)
                , alignment: .bottom)
        }
    }
}

struct DottedLineStyle: View {
    var body: some View {
        GeometryReader { geometry in
            Path { path in
                path.move(to: CGPoint(x: 0, y: 0))
                path.addLine(to: CGPoint(x: geometry.size.width, y: 0))
            }
            .stroke(style: StrokeStyle(dash: [5, 3]))
        }
    }
}
```

ここでは、新たに`DottedLineStyle`というViewを定義し、`GeometryReader`を利用してドット線の長さを決定しています。また、`StrokeStyle`を利用することで、線のスタイルを指定しています。`dash: [5, 3]`の部分でドットの間隔を調整することができます。

また、`overlay`の部分でテキストとの相対位置を指定しています。ここでは`.bottom`を指定しているため、テキストの直下に線が引かれます。この部分を変更することで、線の位置を調整することができます。

このコードはテキストの下にドット線を引く例ですが、必要に応じて修飾子を追加・変更して自由にカスタマイズしてみてください。

---

## 👤 ユーザー
*2023/06/04 00:09:02*

ドットの横線、テキスト、ドットの横線という順番にしたいんだ。テキストは中央

---

## 🤖 アシスタント
*2023/06/04 00:09:31*

テキストを中央に置き、その上下にドット線を引くには、次のようなコードを書くことができます：

```swift
struct ContentView: View {
    var body: some View {
        VStack {
            DottedLine()
            Text("Hello, SwiftUI!")
                .padding()
            DottedLine()
        }
    }
}

struct DottedLine: View {
    var body: some View {
        GeometryReader { geometry in
            Path { path in
                path.move(to: CGPoint(x: 0, y: geometry.size.height / 2))
                path.addLine(to: CGPoint(x: geometry.size.width, y: geometry.size.height / 2))
            }
            .stroke(style: StrokeStyle(dash: [5, 3]))
        }
        .frame(height: 1)
    }
}
```

ここでは、新たに`DottedLine`というViewを作成し、それをテキストの上下に配置しています。`DottedLine`の中で、`GeometryReader`を使ってドット線の長さを決定しています。また、`StrokeStyle`を使って線のスタイルを指定しています。ここでは、`dash: [5, 3]`と指定することで、ドットの間隔を調整しています。

そして、`VStack`を使って、ドット線、テキスト、ドット線を縦に並べて表示しています。`padding`を使ってテキストの周囲に余白を設けることもできます。このコードはテキストの上下にドット線を引く例ですが、必要に応じて修飾子を追加・変更して自由にカスタマイズしてみてください。

---

## 👤 ユーザー
*2023/06/04 00:09:55*

ドット線は上下じゃなくて、テキストを左右で挟んでほしい

---

## 🤖 アシスタント
*2023/06/04 00:10:22*

テキストを中央に置き、その左右にドット線を引くには、次のようなコードを書くことができます：

```swift
struct ContentView: View {
    var body: some View {
        HStack {
            DottedLine()
            Text("Hello, SwiftUI!")
                .padding()
            DottedLine()
        }
    }
}

struct DottedLine: View {
    var body: some View {
        GeometryReader { geometry in
            Path { path in
                path.move(to: CGPoint(x: 0, y: geometry.size.height / 2))
                path.addLine(to: CGPoint(x: geometry.size.width, y: geometry.size.height / 2))
            }
            .stroke(style: StrokeStyle(dash: [5, 3]))
        }
        .frame(height: 1)
    }
}
```

ここでは、新たに`DottedLine`というViewを作成し、それをテキストの左右に配置しています。`DottedLine`の中で、`GeometryReader`を使ってドット線の長さを決定しています。また、`StrokeStyle`を使って線のスタイルを指定しています。ここでは、`dash: [5, 3]`と指定することで、ドットの間隔を調整しています。

そして、`HStack`を使って、ドット線、テキスト、ドット線を横に並べて表示しています。`padding`を使ってテキストの周囲に余白を設けることもできます。このコードはテキストの左右にドット線を引く例ですが、必要に応じて修飾子を追加・変更して自由にカスタマイズしてみてください。

---

## 👤 ユーザー
*2023/06/04 00:11:38*

これを共通コンポーネントにしたい。またイニシャライザの引数として、テキストとテキストの位置を左か中央か右かしていできるようにしてほしい。

---

## 🤖 アシスタント
*2023/06/04 00:12:21*

SwiftUIでは、特定のViewを共通コンポーネントとして再利用することが可能です。以下に、テキストとテキスト位置をパラメータとする共通コンポーネントの例を示します：

```swift
struct ContentView: View {
    var body: some View {
        VStack {
            TextWithDottedLine(text: "Left aligned text", alignment: .leading)
            TextWithDottedLine(text: "Center aligned text", alignment: .center)
            TextWithDottedLine(text: "Right aligned text", alignment: .trailing)
        }
    }
}

struct TextWithDottedLine: View {
    var text: String
    var alignment: TextAlignment
    
    init(text: String, alignment: TextAlignment) {
        self.text = text
        self.alignment = alignment
    }
    
    var body: some View {
        HStack {
            if alignment != .leading {
                DottedLine()
            }
            
            Text(text)
                .frame(maxWidth: .infinity, alignment: alignment)
                .padding()
            
            if alignment != .trailing {
                DottedLine()
            }
        }
    }
}

struct DottedLine: View {
    var body: some View {
        GeometryReader { geometry in
            Path { path in
                path.move(to: CGPoint(x: 0, y: geometry.size.height / 2))
                path.addLine(to: CGPoint(x: geometry.size.width, y: geometry.size.height / 2))
            }
            .stroke(style: StrokeStyle(dash: [5, 3]))
        }
        .frame(height: 1)
    }
}
```

このコードでは、`TextWithDottedLine`という新しいViewを作成し、テキストとその位置を引数として渡せるようにしています。そして、テキスト位置に基づいてドット線を表示するかどうかを判断しています。

`HStack`の中で`Text`は最大幅を持つように指定しており、テキスト位置は`.frame`修飾子で調整しています。このことにより、テキストが左寄せ・中央寄せ・右寄せの場合にそれぞれ対応できます。

`ContentView`の中では、`TextWithDottedLine`を使って3つのテキストを作成しています。それぞれテキスト位置が左寄せ・中央寄せ・右寄せとなるようにしています。

このような共通コンポーネントを作成することにより、SwiftUIのViewの再利用性と保守性が向上します。

---

## 👤 ユーザー
*2023/06/04 00:25:08*

ドットとテキストの間は8ptにしてほしい。テキストを右寄せや左寄せにした場合でも、空白は作らずにドットでうめてほしい。また、ラインの高さは1.5pt、線と間隔は2にしてほしい。

---

## 🤖 アシスタント
*2023/06/04 00:25:46*

ご指定の要件に合わせてコードを修正しました。ドットとテキストの間隔は`Spacer`を使用し、その間隔は`frame`修飾子を用いて指定します。また、ラインの高さと線と間隔は`StrokeStyle`を用いて調整します。

```swift
struct ContentView: View {
    var body: some View {
        VStack {
            TextWithDottedLine(text: "Left aligned text", alignment: .leading)
            TextWithDottedLine(text: "Center aligned text", alignment: .center)
            TextWithDottedLine(text: "Right aligned text", alignment: .trailing)
        }
    }
}

struct TextWithDottedLine: View {
    var text: String
    var alignment: TextAlignment
    
    init(text: String, alignment: TextAlignment) {
        self.text = text
        self.alignment = alignment
    }
    
    var body: some View {
        HStack {
            DottedLine()
            Spacer().frame(width: 8)
            Text(text)
                .frame(maxWidth: .infinity, alignment: alignment)
                .padding(.horizontal, 8)
            Spacer().frame(width: 8)
            DottedLine()
        }
    }
}

struct DottedLine: View {
    var body: some View {
        GeometryReader { geometry in
            Path { path in
                path.move(to: CGPoint(x: 0, y: geometry.size.height / 2))
                path.addLine(to: CGPoint(x: geometry.size.width, y: geometry.size.height / 2))
            }
            .stroke(style: StrokeStyle(lineWidth: 1.5, dash: [2, 2]))
        }
        .frame(height: 1)
    }
}
```

テキストの左右に`Spacer().frame(width: 8)`を追加し、その間隔を8ptに設定しました。また、ラインの高さと線と間隔は`StrokeStyle(lineWidth: 1.5, dash: [2, 2])`を用いて調整しました。

これにより、テキストとドット線の間隔が8ptになり、ラインの高さが1.5pt、線と間隔が2になりました。そして、テキストが左寄せ・中央寄せ・右寄せの場合でも、ドット線が適切に表示されるようになりました。

---

## 👤 ユーザー
*2023/06/04 00:26:19*

TextAlignment という型はないんだけれども。ちなみにこのコードは左に画像があったりしたときに使えるの？

---

## 🤖 アシスタント
*2023/06/04 00:27:09*

すみません、SwiftUIにおいて、`TextAlignment`という型は存在しないので、その部分は修正が必要です。

左右のドット線の表示制御については、直接`HorizontalAlignment`を引数として受け取るよりも、特定の条件（例えば画像が存在するかどうか）を引数として受け取って制御する方がより汎用的で役立つかもしれません。

ここでは、左右に画像が存在するかどうかを表す`Bool`値を新たに引数として受け取り、それに基づいて左右のドット線を表示するかどうかを制御するコードを示します：

```swift
struct ContentView: View {
    var body: some View {
        VStack {
            TextWithDottedLine(text: "Left aligned text", showLeadingDots: false, showTrailingDots: true)
            TextWithDottedLine(text: "Center aligned text", showLeadingDots: true, showTrailingDots: true)
            TextWithDottedLine(text: "Right aligned text", showLeadingDots: true, showTrailingDots: false)
        }
    }
}

struct TextWithDottedLine: View {
    var text: String
    var showLeadingDots: Bool
    var showTrailingDots: Bool
    
    init(text: String, showLeadingDots: Bool, showTrailingDots: Bool) {
        self.text = text
        self.showLeadingDots = showLeadingDots
        self.showTrailingDots = showTrailingDots
    }
    
    var body: some View {
        HStack {
            if showLeadingDots {
                DottedLine()
                Spacer().frame(width: 8)
            }
            
            Text(text)
                .frame(maxWidth: .infinity)
                .padding(.horizontal, 8)
            
            if showTrailingDots {
                Spacer().frame(width: 8)
                DottedLine()
            }
        }
    }
}

struct DottedLine: View {
    var body: some View {
        GeometryReader { geometry in
            Path { path in
                path.move(to: CGPoint(x: 0, y: geometry.size.height / 2))
                path.addLine(to: CGPoint(x: geometry.size.width, y: geometry.size.height / 2))
            }
            .stroke(style: StrokeStyle(lineWidth: 1.5, dash: [2, 2]))
        }
        .frame(height: 1)
    }
}
```

このコードでは、`showLeadingDots`と`showTrailingDots`という新しい引数を追加しました。これらの引数はそれぞれ左右のドット線を表示するかどうかを制御します。もし、これを画像の有無など他の条件で制御したい場合は、これらの引数をその条件に合わせてセットします。

なお、テキストの位置は`.frame(maxWidth: .infinity)`によって自動的に中央に配置されますが、左寄せや右寄せを指定したい場合はこの部分を修正してください。

---

## 👤 ユーザー
*2023/06/04 00:27:36*

GeometryReader の .frame(height: 1) はどういう意味？

---

## 🤖 アシスタント
*2023/06/04 00:28:01*

`GeometryReader`の`.frame(height: 1)`は、GeometryReaderの高さを1ptに制限するものです。

`GeometryReader`は、その親ビューのサイズと位置を取得できる特殊なビューです。子ビューが親ビューのサイズや位置に依存するレイアウトを必要とする場合に、`GeometryReader`は非常に有用です。

しかし、`GeometryReader`自体のサイズは通常親ビューのサイズに依存します。つまり、指定しない場合、`GeometryReader`は可能な限り親ビューのスペースを埋めようとします。

`.frame(height: 1)`の指定により、`GeometryReader`の高さが1ptに制限され、結果的にその内部に描画される線（この場合はドット線）の高さも制御することができます。なお、指定した値（この場合は1pt）は線の太さや線のスタイルに依存するため、必要に応じて調整してください。

---

## 👤 ユーザー
*2023/06/04 00:30:55*

テキストが左の場合はテキストの先端は左端揃えで、右の場合は右端揃えにしてほしい。
また、空白が大きく、テキストとドットの幅の8pt以外はコンテンツが満たしている状態にして欲しい

---

## 🤖 アシスタント
*2023/06/04 00:31:39*

テキストの位置を指定したい場合は、HStack内のテキストビューの`.frame`修飾子で、`alignment`を指定します。さらに、ドットとテキスト間のスペースを確保するために、テキストビューの周囲に`.padding`修飾子を追加します。

以下のようにコードを修正します：

```swift
struct ContentView: View {
    var body: some View {
        VStack {
            TextWithDottedLine(text: "Left aligned text", alignment: .leading)
            TextWithDottedLine(text: "Center aligned text", alignment: .center)
            TextWithDottedLine(text: "Right aligned text", alignment: .trailing)
        }
    }
}

struct TextWithDottedLine: View {
    var text: String
    var alignment: HorizontalAlignment
    
    init(text: String, alignment: HorizontalAlignment) {
        self.text = text
        self.alignment = alignment
    }
    
    var body: some View {
        HStack {
            DottedLine()
            
            Text(text)
                .padding(.horizontal, 8)
                .frame(maxWidth: .infinity, alignment: alignment)
            
            DottedLine()
        }
    }
}

struct DottedLine: View {
    var body: some View {
        GeometryReader { geometry in
            Path { path in
                path.move(to: CGPoint(x: 0, y: geometry.size.height / 2))
                path.addLine(to: CGPoint(x: geometry.size.width, y: geometry.size.height / 2))
            }
            .stroke(style: StrokeStyle(lineWidth: 1.5, dash: [2, 2]))
        }
        .frame(height: 1.5)
    }
}
```

ここで、テキストビューの`.padding`修飾子を使用してテキストの左右にスペースを追加しています。また、テキストビューの`.frame`修飾子を使用してテキストの位置を制御しています。

なお、`DottedLine`の`.frame(height: 1.5)`は、ドット線の高さを1.5ptに制限します。これにより、ドット線の太さが確実に1.5ptになります。

この修正により、テキストの左右に8ptのスペースが確保され、また、テキストは指定した位置（左寄せ、中央寄せ、右寄せ）に配置されます。

---
