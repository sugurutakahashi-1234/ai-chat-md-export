# SwiftUI Listのタップジェスチャー

Date: 2023-06-01

---

## 👤 User
*2023-06-01 09:32:51*

SwiftUI で List の中身が HStack であり、中身はImageとTextである。この一列全体をタップしたときにViewModelの関数を実行させたいのだけれどもどうすればいい？

---

## 🤖 Assistant
*2023-06-01 09:33:18*

SwiftUIの`List`を使って`HStack`内の`Image`と`Text`を含む行を作成し、それら全体にタップジェスチャーを適用するための基本的なコードを以下に示します。タップされたときに`ViewModel`の関数を実行させることができます。

まず、以下のようなViewModelを用意します：

```swift
class ViewModel: ObservableObject {
    func functionToExecute() {
        // function code here
    }
}
```

そして、次のようなSwiftUIのビューを作成します：

```swift
struct ContentView: View {
    @StateObject var viewModel = ViewModel()
    
    var body: some View {
        List {
            ForEach(0..<5) { _ in
                HStack {
                    Image(systemName: "photo")
                    Text("Hello, World!")
                }
                .contentShape(Rectangle()) // Make the entire row tappable
                .onTapGesture {
                    viewModel.functionToExecute()
                }
            }
        }
    }
}
```

このコードでは、まず`ViewModel`クラスのインスタンスを作成します。そして、List内でそれぞれの行（HStack）に対してタップジェスチャーを設定します。タップジェスチャーがトリガーされたとき（ユーザーが行をタップしたとき）、`viewModel.functionToExecute()`が呼び出されます。

この例では、`contentShape(Rectangle())`が追加されています。これにより、HStack全体（つまり、行全体）がタップ可能となります。これがないと、HStack内の空白部分はタップジェスチャーを無視する可能性があります。

このコードはシンプルな例なので、適切に変更してプロジェクトの要件を満たすようにしてください。

---

## 👤 User
*2023-06-01 10:29:22*

テキストとアイコンはタップできたのだけれどもセル全体はタップできなかった

---

## 🤖 Assistant
*2023-06-01 10:30:01*

その問題は、SwiftUIの`List`内の`HStack`の空白部分がタップイベントを取得しないために起こります。この問題を解決するためには、タップ可能な領域を全ての空間に広げるために`.contentShape(Rectangle())`を使用しますが、それだけでは足りない場合もあります。

この問題を解決するための一つの方法は、`HStack`を`Button`の中に入れて全体をタップ可能にすることです。以下に例を示します：

```swift
struct ContentView: View {
    @StateObject var viewModel = ViewModel()
    
    var body: some View {
        List {
            ForEach(0..<5) { _ in
                Button(action: {
                    viewModel.functionToExecute()
                }) {
                    HStack {
                        Image(systemName: "photo")
                        Text("Hello, World!")
                    }
                }
                .buttonStyle(PlainButtonStyle()) // to maintain the default List style
            }
        }
    }
}
```

この例では、`Button`ウィジェットが`HStack`全体をラップしています。これにより、`HStack`全体がタップ可能となります。また、ボタンに適用されるデフォルトのスタイルを防ぐために、`PlainButtonStyle()`が使用されています。

ただし、`Button`はデフォルトで押下時に色が変わるため、それが望ましくない場合は、カスタムビューを作成してそれを`.background`修飾子と共に使用することで解決できます。この修飾子は、タッチイベントを拾い上げるためのバックグラウンドレイヤーとして機能します。

以下にその方法を示します：

```swift
struct ContentView: View {
    @StateObject var viewModel = ViewModel()
    
    var body: some View {
        List {
            ForEach(0..<5) { _ in
                HStack {
                    Image(systemName: "photo")
                    Text("Hello, World!")
                }
                .contentShape(Rectangle()) // Make the entire row tappable
                .onTapGesture {
                    viewModel.functionToExecute()
                }
                .background(Rectangle().fill(Color.clear)) // Add an invisible background to capture taps on empty areas
            }
        }
    }
}
```

この例では、`.background(Rectangle().fill(Color.clear))`が追加されています。これにより、タップイベントは`HStack`の空白部分を含む全体をカバーします。

---

## 👤 User
*2023-06-01 10:31:24*

.background(Rectangle().fill(Color.clear)) ではうまくいかなかったもっと他の方法はないの？

---

## 🤖 Assistant
*2023-06-01 10:31:48*

すみませんが、そうした場合は`List`を使うのではなく、`ScrollView`と`VStack`を使うという選択肢もあります。こうすることで、より柔軟なコントロールが得られ、タップ領域も容易に調整できます。

以下にそのサンプルコードを示します：

```swift
struct ContentView: View {
    @StateObject var viewModel = ViewModel()
    
    var body: some View {
        ScrollView {
            VStack {
                ForEach(0..<5) { _ in
                    HStack {
                        Image(systemName: "photo")
                        Text("Hello, World!")
                    }
                    .frame(maxWidth: .infinity, minHeight: 44) // mimics a standard List row size
                    .background(Color.clear) // In case you want to change the row color
                    .onTapGesture {
                        viewModel.functionToExecute()
                    }
                }
            }
        }
    }
}
```

このコードでは、`ScrollView`と`VStack`を使って`List`の代わりを成すUIを作成しています。それぞれの`HStack`は無限の幅（`.infinity`）を持ち、最小限の高さが44ポイント（一般的なリストの行の高さ）に設定されています。この設定により、各行全体がタップ可能となります。

ただし、この方法を使うと`List`の自動セル再利用機能が利用できなくなるため、大量のデータを表示する場合にはパフォーマンスに影響が出るかもしれません。適切な選択を行ってください。

---
