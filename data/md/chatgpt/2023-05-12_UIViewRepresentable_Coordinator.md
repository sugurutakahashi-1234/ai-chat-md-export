# UIViewRepresentable Coordinator

日付: 2023-05-12

---

## 👤 ユーザー
*2023/5/12 14:35:16*

UIViewRepresentable Representable.Coordinator ってなんですか？

---

## 🤖 アシスタント
*2023/5/12 14:36:29*

`UIViewRepresentable` は、SwiftUI と UIKit を組み合わせて使用する際に役立つプロトコルです。SwiftUI は主に Apple の新しいフレームワークであり、UIKit は従来の iOS フレームワークです。`UIViewRepresentable` を使用することで、UIKit のビューとコントローラを SwiftUI で利用できます。

`Representable.Coordinator` は、`UIViewRepresentable` プロトコルにおいて、SwiftUI と UIKit コンポーネント間の調整を担当するクラスです。これにより、SwiftUI の状態変更やアクションを UIKit コンポーネントに伝えることができます。Coordinator クラスは、通常、`UIViewRepresentable` の実装内にネストされます。

`UIViewRepresentable` プロトコルには、次の 3 つのメソッドが必要です。

1. `makeCoordinator()`: SwiftUI に Coordinator インスタンスを作成する方法を指示します。
2. `makeUIView(context: Context)`: 与えられたコンテキストを使用して、UIKit ビューのインスタンスを作成します。
3. `updateUIView(\_ uiView: UIViewType, context: Context)`: SwiftUI からの状態変更やビューの再構築が発生した際に、UIKit ビューを更新します。

`Representable.Coordinator` を使用することで、SwiftUI と UIKit の機能を効果的に組み合わせることができます。例えば、SwiftUI でカスタムの UIKit ベースのマップビューやテキストフィールドを表示・操作することが可能です。

---

## 👤 ユーザー
*2023/5/12 14:39:54*

UIViewRepresentableなViewを呼び出している側から、UIViewRepresentable側の処理を呼び出したのだけどもどうすればいい？

---

## 🤖 アシスタント
*2023/5/12 14:41:29*

`UIViewRepresentable`側の処理を呼び出すには、`UIViewRepresentable`プロトコルを実装したビューに関数を追加し、そのビューを使用しているSwiftUIビューから関数を呼び出す方法があります。次に、簡単な例を示します。

まず、`UIViewRepresentable`プロトコルを実装したビューを定義します。この例では、カスタムテキストフィールドを作成しています。

```swift
import SwiftUI
import UIKit

struct CustomTextField: UIViewRepresentable {
    @Binding var text: String
    var onCommit: (() -> Void)?

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    func makeUIView(context: Context) -> UITextField {
        let textField = UITextField()
        textField.delegate = context.coordinator
        return textField
    }

    func updateUIView(_ uiView: UITextField, context: Context) {
        uiView.text = text
    }

    class Coordinator: NSObject, UITextFieldDelegate {
        var parent: CustomTextField

        init(_ parent: CustomTextField) {
            self.parent = parent
        }

        func textFieldDidChangeSelection(_ textField: UITextField) {
            parent.text = textField.text ?? ""
        }

        func textFieldShouldReturn(_ textField: UITextField) -> Bool {
            parent.onCommit?()
            return true
        }
    }

    // カスタム関数を追加
    func customFunction() {
        // ここでカスタムの処理を実行
    }
}
```

次に、SwiftUIビューで`CustomTextField`を使用し、カスタム関数を呼び出す方法を示します。

```swift
import SwiftUI

struct ContentView: View {
    @State private var text: String = ""

    var body: some View {
        VStack {
            CustomTextField(text: $text, onCommit: {
                print("onCommit called")
            })
            .frame(height: 40)
            .border(Color.gray)

            Button(action: {
                // CustomTextFieldのカスタム関数を呼び出す
            }) {
                Text("Call custom function")
            }
        }
        .padding()
    }
}
```

ただし、上記の方法では`CustomTextField`内の`customFunction()`を直接呼び出すことができません。この問題を解決するには、`EnvironmentObject`を使用して共有データやアクションを提供することができます。

他のアプローチとしては、`Combine`フレームワークの`PassthroughSubject`や`CurrentValueSubject`を使用して、イベントを送信し、それらをリッスンして`UIViewRepresentable`内の処理を呼び出すこともできます。この方法では、データやアクションが適切にカプセル化され、コンポーネント間で簡単に共有できます。

---

## 👤 ユーザー
*2023/5/12 14:42:11*

Delegate とか使いたくないんだけど

---

## 🤖 アシスタント
*2023/5/12 14:43:55*

Delegateを使わずに、`UIViewRepresentable`とSwiftUI View間でデータやイベントをやり取りする方法として、Combineフレームワークを利用することができます。この例では、`PassthroughSubject`を使用してイベントを送信し、それらをリッスンして処理を実行します。

まず、Combineフレームワークをインポートし、`PassthroughSubject`を定義します。

```swift
import SwiftUI
import UIKit
import Combine

struct CustomTextField: UIViewRepresentable {
    @Binding var text: String
    var onCommit: (() -> Void)?
    var textFieldChanged: PassthroughSubject<String, Never> // イベントを送信するためのPassthroughSubject

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    func makeUIView(context: Context) -> UITextField {
        let textField = UITextField()
        textField.addTarget(context.coordinator, action: #selector(Coordinator.textFieldChanged(_:)), for: .editingChanged)
        textField.addTarget(context.coordinator, action: #selector(Coordinator.textFieldShouldReturn(_:)), for: .editingDidEndOnExit)
        return textField
    }

    func updateUIView(_ uiView: UITextField, context: Context) {
        uiView.text = text
    }

    class Coordinator {
        var parent: CustomTextField

        init(_ parent: CustomTextField) {
            self.parent = parent
        }

        @objc func textFieldChanged(_ textField: UITextField) {
            let newText = textField.text ?? ""
            parent.text = newText
            parent.textFieldChanged.send(newText) // イベントを送信
        }

        @objc func textFieldShouldReturn(_ textField: UITextField) -> Bool {
            parent.onCommit?()
            return true
        }
    }
}
```

次に、SwiftUIビューで`CustomTextField`を使用し、イベントをリッスンして処理を実行する方法を示します。

```swift
import SwiftUI
import Combine

struct ContentView: View {
    @State private var text: String = ""
    private var textFieldChanged = PassthroughSubject<String, Never>() // イベントをリッスンするためのPassthroughSubject
    private var cancellables = Set<AnyCancellable>() // イベントの購読をキャンセルするためのSet

    init() {
        textFieldChanged
            .sink { newText in
                // ここでテキストが変更されたときの処理を実行
                print("Text changed: \(newText)")
            }
            .store(in: &cancellables)
    }

    var body: some View {
        VStack {
            CustomTextField(text: $text, onCommit: {
                print("onCommit called")
            }, textFieldChanged: textFieldChanged)
            .frame(height: 40)
            .border(Color.gray)
        }
        .padding()
    }
}
```

この方法では、Delegateを使わずに`UIViewRepresentable`とSwiftUI View間でデータやイベントをやり取りすることができます。ただし、Combineフレームワークを使用するため、アプリケーションの全体的なアーキテクチャに影響を与える可能性があります。このため、

---

## 👤 ユーザー
*2023/5/12 14:44:13*

トリガーをtextFieldChanged ではなくてonAppearやonDisappear

---

## 🤖 アシスタント
*2023/5/12 14:45:59*

`onAppear`や`onDisappear`を使って、`UIViewRepresentable`内の処理をトリガーすることもできます。この方法では、SwiftUIビューが表示されたり消えたりするときに、特定の処理が実行されます。

`UIViewRepresentable`内に`onAppear`と`onDisappear`イベントを追加するには、次のようにします。

```swift
import SwiftUI
import UIKit

struct CustomTextField: UIViewRepresentable {
    @Binding var text: String
    var onAppear: (() -> Void)?
    var onDisappear: (() -> Void)?
    
    // ... 他のメソッド
    
    func makeUIView(context: Context) -> UITextField {
        let textField = UITextField()
        textField.delegate = context.coordinator
        return textField
    }
    
    // ... 他のメソッド
    
    func onAppear(_ action: (() -> Void)?) -> Self {
        var result = self
        result.onAppear = action
        return result
    }
    
    func onDisappear(_ action: (() -> Void)?) -> Self {
        var result = self
        result.onDisappear = action
        return result
    }
}
```

そして、SwiftUIビュー内で`CustomTextField`を使用して、`onAppear`と`onDisappear`のイベントを追加します。

```swift
import SwiftUI

struct ContentView: View {
    @State private var text: String = ""
    
    var body: some View {
        VStack {
            CustomTextField(text: $text)
                .frame(height: 40)
                .border(Color.gray)
                .onAppear {
                    print("CustomTextField appeared")
                }
                .onDisappear {
                    print("CustomTextField disappeared")
                }
        }
        .padding()
    }
}
```

この方法では、`CustomTextField`が表示されるときに`onAppear`イベントが実行され、`CustomTextField`が消えるときに`onDisappear`イベントが実行されます。ただし、これらのイベントはSwiftUIビューに対して適用されるため、`UIViewRepresentable`内の状態や処理に直接アクセスすることはできません。

この方法を選択する場合、`onAppear`や`onDisappear`イベントで実行する処理を状態変数やバインディングを使って共有することで、`UIViewRepresentable`内の処理に影響を与えることができます。

---

## 👤 ユーザー
*2023/5/12 14:54:37*

UIViewRepresentable を継承したViewにViewModelを導入してほしい

---

## 🤖 アシスタント
*2023/5/12 14:56:14*

`UIViewRepresentable`を使用したViewでViewModelを導入するには、`ObservableObject`プロトコルを実装したViewModelを作成し、それを`EnvironmentObject`または`ObservedObject`として使用します。これにより、SwiftUIとUIKitの間でデータやイベントの共有が容易になります。

次に、ViewModelを導入した`UIViewRepresentable`を使用する例を示します。この例では、カスタムテキストフィールドを作成し、ViewModelを使用してテキストの変更を監視しています。

まず、ViewModelを作成します。

```swift
import Combine
import SwiftUI

class CustomTextFieldViewModel: ObservableObject {
    @Published var text: String = ""
}
```

次に、`UIViewRepresentable`を使用してカスタムテキストフィールドを作成し、ViewModelをバインディングします。

```swift
import SwiftUI
import UIKit

struct CustomTextField: UIViewRepresentable {
    @EnvironmentObject var viewModel: CustomTextFieldViewModel

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    func makeUIView(context: Context) -> UITextField {
        let textField = UITextField()
        textField.delegate = context.coordinator
        return textField
    }

    func updateUIView(_ uiView: UITextField, context: Context) {
        uiView.text = viewModel.text
    }

    class Coordinator: NSObject, UITextFieldDelegate {
        var parent: CustomTextField

        init(_ parent: CustomTextField) {
            self.parent = parent
        }

        func textFieldDidChangeSelection(_ textField: UITextField) {
            parent.viewModel.text = textField.text ?? ""
        }

        func textFieldShouldReturn(_ textField: UITextField) -> Bool {
            textField.resignFirstResponder()
            return true
        }
    }
}
```

最後に、SwiftUIビューで`CustomTextField`を使用し、ViewModelを提供します。

```swift
import SwiftUI

struct ContentView: View {
    @StateObject private var textFieldViewModel = CustomTextFieldViewModel()

    var body: some View {
        VStack {
            CustomTextField()
                .environmentObject(textFieldViewModel)
                .frame(height: 40)
                .border(Color.gray)

            Text("Typed text: \(textFieldViewModel.text)")
        }
        .padding()
    }
}
```

これで、`UIViewRepresentable`を継承したViewにViewModelを導入し、SwiftUIとUIKitの間でデータやイベントを共有できるようになります。ViewModelを使用することで、ビューのロジックを分離し、再利用性とテストの容易性が向上します。

---

## 👤 ユーザー
*2023/5/12 14:57:08*

CustomTextFieldViewModel に関数を作って、CustomTextField が描画されたタイミングで読んでほし、

---

## 🤖 アシスタント
*2023/5/12 14:58:33*

`CustomTextFieldViewModel`に関数を追加し、`CustomTextField`が描画されたタイミングでそれを呼び出すには、`onAppear`イベントを利用します。以下の手順で実装できます。

1. `CustomTextFieldViewModel`に関数を追加します。

```swift
import Combine
import SwiftUI

class CustomTextFieldViewModel: ObservableObject {
    @Published var text: String = ""

    func customFunction() {
        // ここに処理を記述
        print("Custom function called")
    }
}
```

2. `CustomTextField`に`onAppear`イベントを追加する関数を定義します。

```swift
import SwiftUI
import UIKit

struct CustomTextField: UIViewRepresentable {
    @EnvironmentObject var viewModel: CustomTextFieldViewModel

    // ... 他のメソッド

    func onAppear(_ action: @escaping () -> Void) -> some View {
        self.onAppear(perform: action)
    }
}
```

3. SwiftUIビューで`CustomTextField`を使用し、`onAppear`イベントでViewModelの関数を呼び出します。

```swift
import SwiftUI

struct ContentView: View {
    @StateObject private var textFieldViewModel = CustomTextFieldViewModel()

    var body: some View {
        VStack {
            CustomTextField()
                .environmentObject(textFieldViewModel)
                .frame(height: 40)
                .border(Color.gray)
                .onAppear {
                    textFieldViewModel.customFunction()
                }

            Text("Typed text: \(textFieldViewModel.text)")
        }
        .padding()
    }
}
```

これで、`CustomTextField`が描画されたタイミングで`CustomTextFieldViewModel`の`customFunction`が呼び出されます。`onAppear`イベントを利用することで、ビューが表示されたタイミングで任意の処理を実行できます。

---

## 👤 ユーザー
*2023/5/12 14:59:16*

environmentObject を使うのはやめてほしい

---

## 🤖 アシスタント
*2023/5/12 15:00:28*

了解しました。`EnvironmentObject`を使用せずに、`ObservedObject`を使用して`CustomTextFieldViewModel`を渡す方法を示します。この方法では、`CustomTextField`のイニシャライザに`CustomTextFieldViewModel`を渡します。

1. まず`CustomTextField`を以下のように変更します。

```swift
import SwiftUI
import UIKit

struct CustomTextField: UIViewRepresentable {
    @ObservedObject var viewModel: CustomTextFieldViewModel

    // ... 他のメソッド

    func onAppear(_ action: @escaping () -> Void) -> some View {
        self.onAppear(perform: action)
    }
}
```

2. 次に、SwiftUIビューで`CustomTextField`を使用し、`onAppear`イベントでViewModelの関数を呼び出すように変更します。

```swift
import SwiftUI

struct ContentView: View {
    @StateObject private var textFieldViewModel = CustomTextFieldViewModel()

    var body: some View {
        VStack {
            CustomTextField(viewModel: textFieldViewModel) // viewModelを直接渡す
                .frame(height: 40)
                .border(Color.gray)
                .onAppear {
                    textFieldViewModel.customFunction()
                }

            Text("Typed text: \(textFieldViewModel.text)")
        }
        .padding()
    }
}
```

これで、`EnvironmentObject`を使わずに`CustomTextFieldViewModel`を渡すことができ、`CustomTextField`が描画されたタイミングで`customFunction`が呼び出されます。`ObservedObject`を使うことで、ViewModelを個々のインスタンスに紐付けることができます。

---

## 👤 ユーザー
*2023/5/12 15:01:11*

関数名がonAppearじゃなくていいものは変えて欲しい

---

## 🤖 アシスタント
*2023/5/12 15:02:12*

了解しました。関数名を`onTextFieldAppear`に変更します。

1. まず`CustomTextField`を以下のように変更します。

```swift
import SwiftUI
import UIKit

struct CustomTextField: UIViewRepresentable {
    @ObservedObject var viewModel: CustomTextFieldViewModel

    // ... 他のメソッド

    func onTextFieldAppear(_ action: @escaping () -> Void) -> some View {
        self.onAppear(perform: action)
    }
}
```

2. 次に、SwiftUIビューで`CustomTextField`を使用し、`onTextFieldAppear`イベントでViewModelの関数を呼び出すように変更します。

```swift
import SwiftUI

struct ContentView: View {
    @StateObject private var textFieldViewModel = CustomTextFieldViewModel()

    var body: some View {
        VStack {
            CustomTextField(viewModel: textFieldViewModel) // viewModelを直接渡す
                .frame(height: 40)
                .border(Color.gray)
                .onTextFieldAppear { // 関数名を変更
                    textFieldViewModel.customFunction()
                }

            Text("Typed text: \(textFieldViewModel.text)")
        }
        .padding()
    }
}
```

これで、関数名が`onAppear`から`onTextFieldAppear`に変更されました。`CustomTextField`が描画されたタイミングで`customFunction`が呼び出されます。関数名を変更することで、役割がより明確になり、可読性が向上します。

---

## 👤 ユーザー
*2023/5/12 15:02:23*

func onTextFieldAppear(\_ action: @escaping () -&gt; Void) -&gt; some View {
        self.onAppear(perform: action)
    }
こんなことできるの？

---

## 🤖 アシスタント
*2023/5/12 15:03:39*

すみません、私の説明が間違っていました。`UIViewRepresentable`内で直接`onAppear`や`onDisappear`を定義することはできません。この代わりに、ビューの外側で`onAppear`や`onDisappear`を使用してください。以下の例で修正します。

1. まず`CustomTextField`の定義を修正します。

```swift
import SwiftUI
import UIKit

struct CustomTextField: UIViewRepresentable {
    @ObservedObject var viewModel: CustomTextFieldViewModel

    // ... 他のメソッド
}
```

この定義では、`onTextFieldAppear`関数を削除しました。

2. 次に、SwiftUIビューで`CustomTextField`を使用し、`onAppear`イベントでViewModelの関数を呼び出すように変更します。

```swift
import SwiftUI

struct ContentView: View {
    @StateObject private var textFieldViewModel = CustomTextFieldViewModel()

    var body: some View {
        VStack {
            CustomTextField(viewModel: textFieldViewModel) // viewModelを直接渡す
                .frame(height: 40)
                .border(Color.gray)
                .onAppear { // 関数名を変更
                    textFieldViewModel.customFunction()
                }

            Text("Typed text: \(textFieldViewModel.text)")
        }
        .padding()
    }
}
```

これで、`CustomTextField`が描画されたタイミングで`customFunction`が呼び出されます。`onAppear`イベントはSwiftUIビューに直接適用されるため、この方法でViewModelの関数を呼び出すことができます。

---

## 👤 ユーザー
*2023/5/12 15:04:47*

CustomTextFieldViewModel では、CustomTextField の中で表示されている文字列と同じ変数を共有していて、それをcustomFunction() ではそれを適当な文字列に変更する処理を書きたい

---

## 🤖 アシスタント
*2023/5/12 15:08:06*

`CustomTextFieldViewModel`で`CustomTextField`内の文字列と同じ変数を共有し、`customFunction()`でその文字列を変更する処理を追加するには、以下の手順を実行します。

1. `CustomTextFieldViewModel`に`customFunction()`を追加し、適当な文字列に変更する処理を記述します。

```swift
import Combine
import SwiftUI

class CustomTextFieldViewModel: ObservableObject {
    @Published var text: String = ""

    func customFunction() {
        // ここで適当な文字列に変更する処理を記述
        text = "New text"
        print("Custom function called")
    }
}
```

2. `CustomTextField`内で、`UITextField`の値が変更されるたびに`CustomTextFieldViewModel`の`text`プロパティを更新するようにします。

```swift
import SwiftUI
import UIKit

struct CustomTextField: UIViewRepresentable {
    @ObservedObject var viewModel: CustomTextFieldViewModel

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    func makeUIView(context: Context) -> UITextField {
        let textField = UITextField()
        textField.delegate = context.coordinator
        textField.addTarget(context.coordinator, action: #selector(Coordinator.textFieldDidChange(_:)), for: .editingChanged)
        return textField
    }

    func updateUIView(_ uiView: UITextField, context: Context) {
        uiView.text = viewModel.text
    }

    class Coordinator: NSObject, UITextFieldDelegate {
        var parent: CustomTextField

        init(_ parent: CustomTextField) {
            self.parent = parent
        }

        @objc func textFieldDidChange(_ textField: UITextField) {
            parent.viewModel.text = textField.text ?? ""
        }

        func textFieldShouldReturn(_ textField: UITextField) -> Bool {
            textField.resignFirstResponder()
            return true
        }
    }
}
```

3. SwiftUIビューで`CustomTextField`を使用し、`onAppear`イベントでViewModelの`customFunction()`を呼び出します。

```swift
import SwiftUI

struct ContentView: View {
    @StateObject private var textFieldViewModel = CustomTextFieldViewModel()

    var body: some View {
        VStack {
            CustomTextField(viewModel: textFieldViewModel)
                .frame(height: 40)
                .border(Color.gray)
                .onAppear {
                    textFieldViewModel.customFunction()
                }

            Text("Typed text: \(textFieldViewModel.text)")
        }
        .padding()
    }
}
```

これで、`CustomTextField`が描画されたタイミングで`CustomTextField

---

## 👤 ユーザー
*2023/5/12 15:09:37*

つづき

---
