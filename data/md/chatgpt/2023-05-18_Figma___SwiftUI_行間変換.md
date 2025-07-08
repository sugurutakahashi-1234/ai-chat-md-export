# Figma ↔ SwiftUI 行間変換

Date: 2023-05-18

---

## 👤 User
*2023-05-18 11:38:16*

Figma 上の LineHeight の値を SwiftUI で linespacing() を使って表現するにはどんな処理が必要かな？

---

## 🤖 Assistant
*2023-05-18 11:39:16*

FigmaとSwiftUIでのLineHeight（行の高さ）の管理は異なります。

FigmaでのLineHeightは、テキストのベースライン間の距離を指します。一方、SwiftUIでの`.lineSpacing()`は、テキスト行間の追加の空白を指します。

FigmaとSwiftUIのLineHeightを一致させるためには、以下のステップをたどることが役立つかもしれません。

1. まず、Figmaで設定したフォントサイズをSwiftUIで使用します。
2. Figmaで設定したLineHeightからそのフォントサイズを引きます。これにより、行間の余白が計算されます。
3. その余白を2で割ります。なぜなら、行間の余白はテキストの上部と下部に均等に分配されるからです。
4. その値をSwiftUIの`.lineSpacing()`メソッドに渡します。

以下にその変換を行うSwiftUIのコードを示します:

```swift
// Figmaの設定
let figmaFontSize: CGFloat = 16
let figmaLineHeight: CGFloat = 22

// 行間の計算
let lineSpacing: CGFloat = (figmaLineHeight - figmaFontSize) / 2

// SwiftUIでの適用
Text("Your text here")
    .font(.system(size: figmaFontSize))
    .lineSpacing(lineSpacing)
```

ただし、これは完全な対応ではなく、さまざまなフォントで微妙な差異が生じる可能性があります。

---

## 👤 User
*2023-05-18 11:41:04*

その対応について、以下のようなコードを書いている人もいたんだけど、上のコードと何が違うの？

```
struct FontWithLineHeight: ViewModifier {
    let font: UIFont
    let lineHeight: CGFloat

    func body(content: Content) -> some View {
        content
            .font(Font(font))
            .lineSpacing(lineHeight - font.lineHeight)
            .padding(.vertical, (lineHeight - font.lineHeight) / 2)
    }
}
```

---

## 🤖 Assistant
*2023-05-18 11:42:27*

このコードはFigmaのLineHeightとSwiftUIの`.lineSpacing()`の間の差異を考慮に入れ、より正確な表現を試みています。

具体的には、この`FontWithLineHeight`ビューモディファイヤは以下のことを行っています:

1. テキストのフォントを指定します。
2. FigmaのLineHeightとSwiftUIのフォントの自然な行高さとの差を使って、行間スペーシングを計算します。
3. `.padding(.vertical, (lineHeight - font.lineHeight) / 2)` この部分はテキストの上部と下部にパディングを追加することで、テキストの上下に均等に余白を加え、FigmaのLineHeightの効果をエミュレートします。

つまり、このコードはFigmaのLineHeightをより正確に再現しようとしています。テキスト行間のスペースだけでなく、テキストボックス全体の高さもFigmaの設定に合わせようとするものです。なお、このコードは`UIFont`の`.lineHeight`プロパティを使用していますが、これはフォントが自然に持つ行高さを指すもので、この情報を用いることで計算がより正確になります。

ただし、このようなアプローチにもかかわらず、完全な一致を保証するものではありません。なぜなら、レンダリングエンジンの違いやフォントメトリクスの解釈の違いなど、さまざまな要素が影響を与える可能性があるからです。また、パディングを追加すると、テキストビューの全体的なサイズと配置に影響を与える可能性がありますので、それを考慮する必要があります。

---

## 👤 User
*2023-05-18 11:43:21*

ちなみにSwiftUIの標準のAPIにLineHeightを直接指定できるようなコードはないの？

---

## 🤖 Assistant
*2023-05-18 11:44:26*

SwiftUIのAPI（2021年の情報までのもの）には、直接LineHeightを指定するメソッドは存在しません。代わりに、`.lineSpacing()`メソッドを使用して行間の追加のスペースを設定することができます。

一方、UIKitでは`NSAttributedString.Key.paragraphStyle`を用いて直接行高を設定することが可能です。ただし、UIKitとSwiftUIは異なるフレームワークであり、それぞれ異なるテキストレイアウトエンジンを使用しています。したがって、UIKitの`NSAttributedString`を使用して行高を設定しても、完全にFigmaのLineHeightと一致するとは限りません。

このような違いを考慮に入れると、SwiftUIでFigmaのLineHeightを最もよく模倣するには、上述のように`.lineSpacing()`メソッドを使用し、必要に応じて上下のパディングを追加することが推奨されます。

---

## 👤 User
*2023-05-18 11:45:15*

ちなみに、以下のコードについて、LineHeghtの倍率がFigma上で指定されている場合はどのように修正すればいいかな。どちらでも指定される可能性があるんだ

```
struct FontWithLineHeight: ViewModifier {
    let font: UIFont
    let lineHeight: CGFloat

    func body(content: Content) -&gt; some View {
        content
            .font(Font(font))
            .lineSpacing(lineHeight - font.lineHeight)
            .padding(.vertical, (lineHeight - font.lineHeight) / 2)
    }
}

---

## 🤖 Assistant
*2023-05-18 11:46:05*

Figmaでは、行高を特定のピクセル値ではなく、フォントサイズの倍率で指定することもできます。その場合、その倍率を使用して行高を計算し、その計算結果を用いて`lineSpacing`とパディングを設定することが可能です。

以下にその修正版を示します：

```swift
struct FontWithLineHeight: ViewModifier {
    let font: UIFont
    let lineHeightMultiplier: CGFloat

    func body(content: Content) -> some View {
        let calculatedLineHeight = font.pointSize * lineHeightMultiplier
        let calculatedLineSpacing = calculatedLineHeight - font.lineHeight
        return content
            .font(Font(font))
            .lineSpacing(calculatedLineSpacing)
            .padding(.vertical, calculatedLineSpacing / 2)
    }
}
```

このコードでは、`lineHeightMultiplier`パラメーターを追加し、それを使用して行高を計算しています。そして、その計算結果を使用して行間スペーシングとパディングを設定しています。

この修正により、Figmaでフォントサイズの倍率を使用して行高を指定した場合でも、その効果をSwiftUIで再現することができます。

---

## 👤 User
*2023-05-18 11:58:07*

これってViewModifier にする必要ってあるんだっけ？

---

## 🤖 Assistant
*2023-05-18 11:59:02*

SwiftUIでの`ViewModifier`は、一つ以上のビューに対して一貫した修正を適用するために使用されます。特定のスタイルやレイアウトの修正を複数のビューで再利用したい場合には、その修正を`ViewModifier`として定義するのが理想的です。

しかしながら、その修正が一つのビューだけに適用されるのであれば、`ViewModifier`を使う必要は必ずしもありません。そのような場合には、その修正を直接ビューに適用することができます。

以下に、行高を調整する修正を直接テキストビューに適用する例を示します:

```swift
let font: UIFont = .systemFont(ofSize: 16)
let lineHeightMultiplier: CGFloat = 1.5

let calculatedLineHeight = font.pointSize * lineHeightMultiplier
let calculatedLineSpacing = calculatedLineHeight - font.lineHeight

Text("Your text here")
    .font(Font(font))
    .lineSpacing(calculatedLineSpacing)
    .padding(.vertical, calculatedLineSpacing / 2)
```

このコードは、上記の`ViewModifier`と同じ修正を行いますが、その修正が直接テキストビューに適用されています。したがって、この修正を他のビューで再利用する必要がない場合には、`ViewModifier`を使用せずにこのように直接修正を適用することも可能です。

---

## 👤 User
*2023-05-18 12:23:53*

そう言う意味じゃなくてextension View {} で定義するのはだめなんだっけ？

---

## 🤖 Assistant
*2023-05-18 12:24:56*

なるほど、理解しました。あなたの意図はSwiftUIのビューに対して直接メソッドを追加することですね。その場合、`extension View`を使用して行うことが可能です。以下にその例を示します：

```swift
extension View {
    func fontWithLineHeight(font: UIFont, lineHeightMultiplier: CGFloat) -> some View {
        let calculatedLineHeight = font.pointSize * lineHeightMultiplier
        let calculatedLineSpacing = calculatedLineHeight - font.lineHeight
        return self
            .font(Font(font))
            .lineSpacing(calculatedLineSpacing)
            .padding(.vertical, calculatedLineSpacing / 2)
    }
}
```

このコードでは、`fontWithLineHeight(font:lineHeightMultiplier:)`メソッドを`View`に追加しています。このメソッドは、指定したフォントと行高の倍率を使用して、行高を調整したビューを返します。

これにより、任意のビューに対して以下のようにしてこのメソッドを呼び出すことが可能となります：

```swift
Text("Your text here")
    .fontWithLineHeight(font: UIFont.systemFont(ofSize: 16), lineHeightMultiplier: 1.5)
```

これは`ViewModifier`を使用する代わりのアプローチであり、ビューに直接新しいメソッドを追加することにより、コードの読みやすさと再利用性を向上させることができます。ただし、ビューの拡張には注意が必要で、複雑なロジックや状態の管理を拡張内に含めることは推奨されていません。そのような場合には、ビューモデルやカスタムビューを使用するべきです。

---

## 👤 User
*2023-05-18 12:25:21*

UIFont はあまりつかいたくないんだけど同じようなことはできないの？

---

## 🤖 Assistant
*2023-05-18 12:26:27*

もちろんです。`UIFont`の代わりにSwiftUIの`Font`を使用することも可能です。しかし、その場合に問題となるのは、SwiftUIの`Font`はフォントの高さ（`lineHeight`や`pointSize`）に直接アクセスする方法を提供していない点です。

しかし、解決策として、指定されたフォントサイズと行高の倍率を使用して行間スペーシングとパディングを計算することができます。具体的には以下のようなコードになります：

```swift
extension View {
    func fontWithLineHeight(fontSize: CGFloat, lineHeightMultiplier: CGFloat) -> some View {
        let calculatedLineHeight = fontSize * lineHeightMultiplier
        let calculatedLineSpacing = calculatedLineHeight - fontSize
        return self
            .font(.system(size: fontSize))
            .lineSpacing(calculatedLineSpacing)
            .padding(.vertical, calculatedLineSpacing / 2)
    }
}
```

このコードでは、フォントサイズと行高の倍率を引数として受け取り、その値を使用して行間スペーシングとパディングを計算しています。その結果を`lineSpacing`と`padding`に設定しています。

ただし、これはあくまで近似的な対応であり、実際のフォントのメトリクスにはより複雑な要素が含まれているため、完全にFigmaのLineHeightを再現することは難しいかもしれません。この点についてはご理解いただければと思います。

---

## 👤 User
*2023-05-18 12:28:48*

UIFontの代わりにSwiftUIのFontを使用することも可能です。しかし、その場合に問題となるのは、SwiftUIのFontはフォントの高さ（lineHeightやpointSize）に直接アクセスする方法を提供していない点です。

しかし、解決策として、指定されたフォントサイズと行高の倍率を使用して行間スペーシングとパディングを計算することができます。

上記についてどのぐらいズレがあるの？

---

## 🤖 Assistant
*2023-05-18 12:29:54*

`UIFont`とSwiftUIの`Font`の間の差異については、レンダリングエンジンの違いやフォントメトリクスの解釈の違いなど、さまざまな要素が影響を与える可能性があります。そのため、そのズレの正確な程度を定量的に示すことは難しいです。

具体的には、`UIFont`の`lineHeight`プロパティはフォントデザイナーが指定した自然な行高（ベースラインからベースラインまでの距離）を示しています。これはフォントサイズ（`pointSize`）だけでなく、行間（行の上部と下部の空白スペース）も含んでいます。

一方、SwiftUIの`Font`は`lineHeight`や`pointSize`に直接アクセスする方法を提供していないため、その代わりにフォントサイズを直接使用して行高を計算しています。これはフォントデザイナーが指定した自然な行高とは一致しない場合があります。

したがって、`UIFont`を使用して計算した行高と、SwiftUIの`Font`を使用して計算した行高との間には、一部のフォントでは顕著なズレが生じる可能性があります。具体的なズレの程度は、使用しているフォントやそのメトリクスによります。

また、このズレは主にビジュアルなものであり、大抵のケースでユーザー体験に大きな影響を与えるものではないと考えられます。ただし、特定のデザイン要件がある場合や、ピクセルパーフェクトなレンダリングが必要な場合には、このズレを考慮に入れる必要があります。

---

## 👤 User
*2023-05-18 12:31:11*

2つのどちらがより正確かな？

```
// Figmaの設定
let figmaFontSize: CGFloat = 16
let figmaLineHeight: CGFloat = 22

// 行間の計算
let lineSpacing: CGFloat = (figmaLineHeight - figmaFontSize) / 2

// SwiftUIでの適用
Text("Your text here")
    .font(.system(size: figmaFontSize))
    .lineSpacing(lineSpacing)
```
と

```
extension View {
    func fontWithLineHeight(fontSize: CGFloat, lineHeightMultiplier: CGFloat) -> some View {
        let calculatedLineHeight = fontSize * lineHeightMultiplier
        let calculatedLineSpacing = calculatedLineHeight - fontSize
        return self
            .font(.system(size: fontSize))
            .lineSpacing(calculatedLineSpacing)
            .padding(.vertical, calculatedLineSpacing / 2)
    }
}
```

---

## 🤖 Assistant
*2023-05-18 12:32:17*

2つのコードは、行間を計算する方法が少し異なりますが、どちらも同様の効果を持つと考えられます。具体的には、テキスト行間のスペースを制御するために行間距離を調整しています。

1つ目のコードでは、Figmaで指定したフォントサイズと行高を使用して行間距離を計算しています。これはFigmaのデザインを直接再現することを意図しています。

2つ目のコードでは、行高をフォントサイズの倍率として計算し、その結果を使用して行間距離を調整しています。また、上下にパディングを追加することで行高を制御しています。

どちらの方法がより「正確」であるかは、具体的なデザイン要件や期待される結果によります。

- あなたがFigmaのデザインを正確に再現したいと考えているのであれば、1つ目のコードがより適しているかもしれません。これは、Figmaで指定した具体的なフォントサイズと行高を使用して行間距離を計算します。
  
- しかし、あなたが行高をフォントサイズの倍率として指定することを好む場合や、Figmaのデザインを一部調整することが容認できるのであれば、2つ目のコードを使用することができます。これにより、任意のフォントサイズに対して一貫した行高を維持することが可能となります。

したがって、どちらの方法が「より正確」であるかは、あなたの具体的なニーズによると言えるでしょう。

---

## 👤 User
*2023-05-18 12:32:47*

というよりかは  .padding(.vertical, calculatedLineSpacing / 2) の有無によってどれぐらいの差が生まれるか気になております

---

## 🤖 Assistant
*2023-05-18 12:33:53*

なるほど、理解しました。ここでの`.padding(.vertical, calculatedLineSpacing / 2)`は、ビューの上部と下部にパディングを追加することで、行の「可視」高さを増やそうとしています。これは、行間のスペースだけでなく、テキストの上部と下部のスペースも増やす効果があります。

しかし、このパディングは行間のスペースを直接制御するものではなく、ビュー全体の高さを増やすだけです。そのため、これによって生じるビジュアルな差は、行間距離（`lineSpacing`）を直接変更することとは異なります。

具体的には、`.padding(.vertical, calculatedLineSpacing / 2)`を追加すると、テキストの上部と下部に空白が追加され、ビュー全体としての行高が増えます。しかし、各テキスト行間のスペースは、`lineSpacing`の値によってのみ制御されます。

したがって、`.padding(.vertical, calculatedLineSpacing / 2)`の有無による差は、テキストの上部と下部の余白の有無、およびビュー全体としての行高に影響を与えます。しかし、各テキスト行間のスペースには影響を与えません。

どちらの方法を選択するかは、具体的なデザイン要件や期待される結果によります。テキストの上部と下部に余白を追加することが望ましいのであれば、`.padding(.vertical, calculatedLineSpacing / 2)`を追加することを検討してみてください。それ以外の場合、または行間のスペースだけを制御したい場合には、`.lineSpacing(calculatedLineSpacing)`のみを使用することを検討してみてください。

---

## 👤 User
*2023-05-18 12:35:32*

以下のコードについて、fontSize を引数に渡しているけど、これってselfから取れるような値じゃないの？

```
extension View {
    func fontWithLineHeight(fontSize: CGFloat, lineHeightMultiplier: CGFloat) -> some View {
        let calculatedLineHeight = fontSize * lineHeightMultiplier
        let calculatedLineSpacing = calculatedLineHeight - fontSize
        return self
            .lineSpacing(calculatedLineSpacing)
            .padding(.vertical, calculatedLineSpacing / 2)
    }
}
```

---

## 🤖 Assistant
*2023-05-18 12:36:27*

SwiftUI のビューは、現在のフォントサイズやその他のスタイル設定を直接照会するAPIを提供していません。これは SwiftUI の宣言的なデザイン原則によるもので、ビュー自体がそのスタイル状態を保持しないためです。

そのため、この場合には、`fontSize`を引数として渡す必要があります。この設計により、ビューはどのように表示されるべきかを宣言するだけで良く、具体的な表示状態（フォントサイズなど）を管理する必要はありません。

上記のコードにおいて、`fontSize`と`lineHeightMultiplier`の両方をパラメータとして取り、それらを用いて行間スペーシングとパディングを計算することで、行高を制御しています。そして、これらの計算結果を元に`lineSpacing`と`padding`を設定しています。

ですので、現時点でのSwiftUIの設計上、ビュー自身からフォントサイズを直接取得することはできません。そのため、このように明示的にパラメータとしてフォントサイズを渡す必要があるというわけです。

---
