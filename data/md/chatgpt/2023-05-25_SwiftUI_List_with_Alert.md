# SwiftUI List with Alert

Date: 2023-05-25

---

## 👤 User
*2023-05-25 14:16:56*

SwiftUI で List を使って複数行のアイテムを並べようとしている。
また、List の要素をタップすると、ユーザーにリストの要素のアラートを表示させる
そして、タップしたときにユーザーにタップされた領域がタップされたことがわかるようにさせたい。
そのようなコードを教えて欲しい。

---

## 🤖 Assistant
*2023-05-25 14:17:23*

以下の例では、SwiftUI の List を使用して、複数の行を持つリストを作成し、各リストのアイテムがタップされるとアラートが表示され、その項目がタップされたことをユーザーに示します。

```swift
import SwiftUI

struct ContentView: View {
    @State private var selectedItem: String? = nil
    @State private var showAlert: Bool = false
    let items = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"]
    
    var body: some View {
        List(items, id: \.self) { item in
            Text(item)
                .padding()
                .background(Color.green.opacity(selectedItem == item ? 0.5 : 0))
                .onTapGesture {
                    selectedItem = item
                    showAlert = true
                }
        }
        .alert(isPresented: $showAlert) {
            Alert(
                title: Text("Selected Item"),
                message: Text("\(selectedItem ?? "") was tapped!"),
                dismissButton: .default(Text("OK")) {
                    showAlert = false
                    selectedItem = nil
                }
            )
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
```

このコードでは、リストアイテムがタップされたときに`selectedItem`を更新しています。そして、`background`を使って選択された項目の背景色を変更しています。また、選択された項目がタップされたときにはアラートが表示されます。

---

## 👤 User
*2023-05-25 14:18:24*

これだとタップされたあともopacityが0.5になったままなので、その辺を変えて欲しい。

---

## 🤖 Assistant
*2023-05-25 14:19:18*

理解しました、タップした後にすぐにオパシティをリセットしたい場合、以下のように修正できます。

```swift
import SwiftUI

struct ContentView: View {
    @State private var selectedItem: String? = nil
    let items = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"]

    var body: some View {
        List(items, id: \.self) { item in
            Text(item)
                .padding()
                .background(Color.green.opacity(selectedItem == item ? 0.5 : 0))
                .onTapGesture {
                    selectedItem = item
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) {
                        selectedItem = nil
                    }
                    showItemAlert(item)
                }
        }
    }

    private func showItemAlert(_ item: String) {
        let alert = Alert(
            title: Text("Selected Item"),
            message: Text("\(item) was tapped!"),
            dismissButton: .default(Text("OK"))
        )
        UIApplication.shared.windows.first?.rootViewController?.present(alert, animated: true)
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
```

このコードでは、アイテムがタップされたらすぐに`selectedItem`をリセットします。そのため、タップされたアイテムはすぐに元の状態（オパシティが0）に戻ります。ただし、これによりタップ反応が視覚的にわかりにくくなる可能性があるため、`DispatchQueue.main.asyncAfter`を使って少しの遅延（ここでは0.2秒）を設けています。この遅延を変更することで、ユーザーがタップを認識する時間を調節できます。

なお、アラートの表示にはUIKitのメソッドを使っています。SwiftUIのAlertは`isPresented`の変更をトリガーに表示されるため、選択されたアイテムのオパシティをリセットすると同時にアラートを表示するのは難しいです。この問題を回避するために、UIKitの`present(alert:animated:)`メソッドを使ってアラートを表示しています。これはSwiftUIのViewから呼び出すことができます。

しかし、この方法はSwiftUIのアーキテクチャに完全にはフィットしないため、場合によっては別の解決策を検討することをお勧めします。例えば、リストアイテムをタップした時に別のViewにナビゲートして、そのViewでタップされたアイテムの詳細を表示する、といった方法もあります。

---

## 👤 User
*2023-05-25 14:20:28*

今って無理やり、opacity をコントロールすることでタップされたことを表現しているけど、SwiftUIの標準機能でそのような反応をするようにはできないの？たとてば、push遷移するListなどは自動的に選択された要素のopacityが変化すると思う

---

## 🤖 Assistant
*2023-05-25 14:21:14*

SwiftUIでは、ListとNavigationLinkを組み合わせて、タップしたアイテムの視覚的なフィードバックを得ることができます。NavigationLinkはタップされたアイテムの背景を自動的にハイライトします。ただし、この方法では遷移先のViewを設定する必要があります。

もし遷移先がなく、タップの視覚的なフィードバックだけを得たい場合、一時的なダミーの遷移先を設定することでこの問題を回避できます。例えば、以下のようにすることができます。

```swift
import SwiftUI

struct ContentView: View {
    @State private var selectedItem: String? = nil
    let items = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"]

    var body: some View {
        NavigationView {
            List(items, id: \.self) { item in
                NavigationLink(destination: Text("")) {
                    Text(item)
                }
                .simultaneousGesture(TapGesture().onEnded {
                    self.selectedItem = item
                    showItemAlert(item)
                })
            }
        }
    }

    private func showItemAlert(_ item: String) {
        let alert = Alert(
            title: Text("Selected Item"),
            message: Text("\(item) was tapped!"),
            dismissButton: .default(Text("OK"))
        )
        UIApplication.shared.windows.first?.rootViewController?.present(alert, animated: true)
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
```

この例では、NavigationLinkの遷移先をダミーの空のTextとしています。また、`.simultaneousGesture`を使って、Listのアイテムがタップされたときにアラートを表示します。

ただし、この方法も完全な解決策とは言えません。NavigationLinkを使うと、実際には遷移しないにも関わらず、ナビゲーションの状態が変わることがあります。この問題を完全に解決するには、リストアイテムがタップされたときに明示的な視覚的フィードバックを提供するカスタムビューを作成するか、Appleが新たな解決策を提供するまで待つ必要があるかもしれません。

---
