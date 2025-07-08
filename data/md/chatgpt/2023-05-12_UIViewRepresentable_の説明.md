# UIViewRepresentable の説明

Date: 2023-05-12

---

## 👤 User
*2023-05-12 10:27:00*

UIViewRepresentable とは

---

## 🤖 Assistant
*2023-05-12 10:28:04*

UIViewRepresentable は、SwiftUI で UIKit ベースのビューと相互運用するためのプロトコルです。SwiftUI は、Apple の iOS、macOS、watchOS、および tvOS 用の新しい UI フレームワークで、Swift 言語で記述されます。しかし、現在のプロジェクトやライブラリでは、UIKit（iOS）や AppKit（macOS）のコンポーネントがまだ広く使用されています。

UIViewRepresentable プロトコルを実装することで、SwiftUI と UIKit の間の橋渡しを行い、既存の UIKit コンポーネントを SwiftUI のビュー構造に組み込むことができます。このプロトコルを適用するには、次の 2 つのメソッドを実装する必要があります。

1. `makeUIView(context:)` : ここでは、新しい UIKit ベースのビューを作成し、初期化します。このメソッドは、ビューが最初に作成されるときに一度だけ呼び出されます。

2. `updateUIView(_:context:)` : ここでは、UIKit ベースのビューの状態を更新します。このメソッドは、ビューのプロパティが変更されるたびに呼び出されます。

UIViewRepresentable プロトコルを使用することで、SwiftUI のプロジェクトに UIKit ベースのビューを簡単に統合でき、徐々に SwiftUI への移行を進めることができます。

---

## 👤 User
*2023-05-12 10:28:54*

UIViewRepresentable でも ViewModel みたいなものとつなげることはできる？

---

## 🤖 Assistant
*2023-05-12 10:30:18*

はい、UIViewRepresentable を使って ViewModel と連携することは可能です。ViewModel は、ビューに表示されるデータとビジネスロジックを管理する役割を担っています。SwiftUI では、データのバインディングと状態の管理が簡単に行えるため、UIViewRepresentable と ViewModel を組み合わせることで、UIKit ベースのビューも SwiftUI のデータフローに統合できます。

UIViewRepresentable の実装に ViewModel を組み込むためには、次の手順を実行します。

1. ViewModel を作成します。通常は、ObservableObject プロトコルに準拠したクラスとして実装します。このプロトコルを適用することで、データの変更を SwiftUI に通知できます。

2. UIViewRepresentable を実装する SwiftUI ビューに、作成した ViewModel をプロパティとして追加します。ViewModel を状態オブジェクト（@StateObject）や環境オブジェクト（@EnvironmentObject）として宣言することが一般的です。

3. `makeUIView(context:)` および `updateUIView(_:context:)` メソッドの中で、ViewModel のデータにアクセスして UIKit ベースのビューを更新します。

4. 必要に応じて、UIKit ベースのビューから ViewModel にコールバックを送信することもできます。これには、UIViewRepresentable の Coordinator を使用します。Coordinator を使って UIKit のデリゲートメソッドやターゲットアクションをキャプチャし、それらを ViewModel のメソッドに転送します。

これらの手順により、UIViewRepresentable を使って ViewModel と連携することができます。これにより、UIKit ベースのビューと SwiftUI のデータフローを統合し、より簡単にコードの再利用やテストが可能になります。

---

## 👤 User
*2023-05-12 14:13:17*

UIViewRepresentable 側で宣言している @State や @Binding の変数を更新するとどうなるの？

---

## 🤖 Assistant
*2023-05-12 14:14:41*

UIViewRepresentable を実装する際に、@State や @Binding などの SwiftUI のプロパティラッパーを使用することができます。これらのプロパティラッパーは、ビューの状態を管理するための仕組みを提供します。

- @State: ビューの内部状態を管理するために使用されます。@State プロパティが変更されると、SwiftUI はビューを自動的に再描画します。
- @Binding: 親ビューまたは他のビューと状態を共有するために使用されます。@Binding プロパティが変更されると、関連するすべてのビューが再描画されます。

UIViewRepresentable の実装において、@State や @Binding の変数が更新されると、以下の効果があります。

1. 変数が更新されると、SwiftUI はビューの再描画をトリガーします。このプロセスの一環として、`updateUIView(_:context:)` メソッドが呼び出されます。このメソッド内で、更新された変数の値に基づいて UIKit ベースのビューを更新することができます。

2. @Binding を使用している場合、関連するすべてのビューに変更が伝播されます。これにより、他のビューも変更に応じて再描画されます。

UIViewRepresentable を使用する際に @State や @Binding の変数を更新することで、UIKit ベースのビューと SwiftUI のビューの状態を同期させることができます。これにより、ネイティブな SwiftUI コンポーネントと同じように、UIKit ベースのビューもデータフローに組み込むことができます。

---

## 👤 User
*2023-05-12 14:16:46*

Combine ストリームで流れてくる値でUIViewRepresentableで宣言された@Binding な変数を更新するコード

---

## 🤖 Assistant
*2023-05-12 14:18:33*

Combine ストリームを使用して UIViewRepresentable で宣言された @Binding プロパティを更新するには、次の手順を実行します。

1. ViewModel で Combine ストリームを作成し、データの変更を監視します。
2. SwiftUI ビューで @Binding プロパティを宣言し、それを UIViewRepresentable に渡します。
3. ViewModel から SwiftUI ビューにイベントを伝達するために、closure を使用します。

以下に、この手順を実装したサンプルコードを示します。

ViewModel:

```swift
import Combine
import SwiftUI

class MyViewModel: ObservableObject {
    @Published var valueFromStream: String = ""
    private var cancellables = Set<AnyCancellable>()

    init() {
        setupDataStream()
    }

    private func setupDataStream() {
        // データストリームの作成と購読
        let dataStream = PassthroughSubject<String, Never>()
        dataStream
            .assign(to: &$valueFromStream)
        
        // データストリームに値を送信
        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
            dataStream.send("New Value")
        }
    }
}
```

SwiftUI ビュー:

```swift
import SwiftUI

struct ContentView: View {
    @StateObject private var viewModel = MyViewModel()
    @State private var text: String = ""

    var body: some View {
        VStack {
            // UIKitベースのビューを使用する場合
            MyUIViewRepresentable(text: $text)
                .onReceive(viewModel.$valueFromStream) { newValue in
                    text = newValue
                }
        }
    }
}
```

UIViewRepresentable:

```swift
import SwiftUI
import UIKit

struct MyUIViewRepresentable: UIViewRepresentable {
    @Binding var text: String

    func makeUIView(context: Context) -> UITextField {
        let textField = UITextField()
        return textField
    }

    func updateUIView(_ textField: UITextField, context: Context) {
        textField.text = text
    }
}
```

このサンプルでは、`MyViewModel` で Combine ストリームが作成され、データの変更を監視しています。そして、`ContentView` で @Binding プロパティ `text` を宣言し、それを `MyUIViewRepresentable` に渡しています。最後に、`onReceive` メソッドを使用して、ViewModel のデータストリームからイベントを受け取り、@Binding プロパティ `text` を更新しています。これにより、UIKit ベースのビュー（この例では UITextField）も SwiftUI と同じデータフローに組み込むことができます。

---
