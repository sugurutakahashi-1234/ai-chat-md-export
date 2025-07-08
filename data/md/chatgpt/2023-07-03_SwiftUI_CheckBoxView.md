# SwiftUI CheckBoxView

日付: 2023-07-03

---

## 👤 ユーザー
*2023/07/03 18:39:29*

SwiftUIでToggleStyleを作成いていたのだけれども、そもそもこれは一般的なViewとしてCheckBoxViewとして定義したほうがいいと思った。それを書いて欲しい

public struct CheckBoxToggleStyle: ToggleStyle {
    private static let iconLength: CGFloat = 24
    
    public init() {}

    public func makeBody(configuration: Configuration) -&gt; some View {
        SFSymbols.checkmarkCircle.image
            .resizable()
            .scaledToFit()
            .frame(width: Self.iconLength, height: Self.iconLength)
            .foregroundColor(configuration.isOn ? CoreAssets.Color.PrimaryBackgroundNoGradation.primaryBackgroundNoGradation100.swiftUIColor : CoreAssets.Color.Neutral.neutral30.swiftUIColor)
    }
}

---

## 🤖 アシスタント
*2023/07/03 18:40:22*

SwiftUIでCheckBoxViewを作成するためには、まずはUIViewRepresentableを使用してUIKitのUIControlを取り込むことから始めます。以下にその具体的な実装を示します。

```swift
import SwiftUI

struct CheckBoxView: UIViewRepresentable {
    @Binding var isChecked: Bool

    func makeUIView(context: UIViewRepresentableContext<CheckBoxView>) -> UIButton {
        let button = UIButton(type: .custom)
        button.setImage(UIImage(named: "uncheckedImage"), for: .normal)
        button.setImage(UIImage(named: "checkedImage"), for: .selected)
        button.addTarget(context.coordinator, action: #selector(Coordinator.toggle), for: .touchUpInside)
        return button
    }

    func updateUIView(_ uiView: UIButton, context: UIViewRepresentableContext<CheckBoxView>) {
        uiView.isSelected = isChecked
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    class Coordinator: NSObject {
        var checkBox: CheckBoxView

        init(_ checkBox: CheckBoxView) {
            self.checkBox = checkBox
        }

        @objc func toggle(_ sender: UIButton) {
            sender.isSelected.toggle()
            checkBox.isChecked = sender.isSelected
        }
    }
}
```

上記のコードではまず `UIViewRepresentable` を採用した新しい `CheckBoxView` を定義しました。そして、`makeUIView(context:)` メソッドでチェックボックスの状態を管理するための `UIButton` を作成し、それに対して画像を設定します。

`updateUIView(_:context:)` メソッドでは、ビューが更新されるたびに `UIButton` の `isSelected` プロパティを `isChecked` プロパティと同期します。

そして `Coordinator` クラスを作成し、ユーザーがボタンをタップしたときに `isChecked` の値を反転させます。

ただし、この実装では `uncheckedImage` と `checkedImage` という名前の画像がプロジェクトに存在することを前提としています。これらの画像はそれぞれチェックボックスが選択されていない状態と選択されている状態を表すものであるべきです。また、SwiftUIのビューでこの `CheckBoxView` を使用する際には、`@State` プロパティラッパーを用いて `isChecked` をバインドする必要があります。

---

## 👤 ユーザー
*2023/07/03 18:40:24*

UIKit ではなくて SwiftUIで実装して欲しい

---

## 🤖 アシスタント
*2023/07/03 18:40:55*

申し訳ありません、私の理解不足でした。SwiftUIでCheckBoxを実装する方法について修正します。以下にそれを示します。

```swift
import SwiftUI

struct CheckBoxView: View {
    @Binding var isChecked: Bool
    private static let iconLength: CGFloat = 24

    var body: some View {
        Button(action: {
            self.isChecked.toggle()
        }) {
            Image(systemName: self.isChecked ? "checkmark.circle" : "circle")
                .resizable()
                .scaledToFit()
                .frame(width: Self.iconLength, height: Self.iconLength)
                .foregroundColor(self.isChecked ? Color.green : Color.gray)
        }
    }
}
```

ここではSwiftUIの`Button`を使ってチェックボックスの動作を再現しています。`Image`はシステムアイコン（"checkmark.circle"または"circle"）を表示します。チェックボックスの状態(`isChecked`)に応じて、異なるアイコンを表示します。

この`CheckBoxView`は以下のように使用できます：

```swift
struct ContentView: View {
    @State private var isChecked: Bool = false

    var body: some View {
        VStack {
            CheckBoxView(isChecked: $isChecked)
            Text(isChecked ? "Checked" : "Not checked")
        }
    }
}
```

これで、`CheckBoxView`がタップされるとチェックマークが表示・非表示され、同時にテキストも更新されます。

---

## 👤 ユーザー
*2023/07/03 18:41:21*

CheckBoxView を使う側でタップしても何も反応しないようにしたいんだがどうすればいいかな？’

---

## 🤖 アシスタント
*2023/07/03 18:42:06*

`CheckBoxView`がタップされても何も反応しないようにするためには、`Button`のactionクロージャを空にすることができます。この場合、`CheckBoxView`はタップされたときに状態を変更しなくなります。

しかしこの状況では、ユーザーが`CheckBoxView`を操作できないため、チェックボックスの状態を管理するための外部のメカニズムが必要になるかもしれません。

以下にそのような状況を再現する例を示します:

```swift
struct CheckBoxView: View {
    @Binding var isChecked: Bool
    private static let iconLength: CGFloat = 24

    var body: some View {
        Button(action: {}) {
            Image(systemName: self.isChecked ? "checkmark.circle" : "circle")
                .resizable()
                .scaledToFit()
                .frame(width: Self.iconLength, height: Self.iconLength)
                .foregroundColor(self.isChecked ? Color.green : Color.gray)
        }
    }
}
```

そして、`CheckBoxView`の使用方法は以下のとおりです:

```swift
struct ContentView: View {
    @State private var isChecked: Bool = false

    var body: some View {
        VStack {
            CheckBoxView(isChecked: $isChecked)
            Button(action: {
                self.isChecked.toggle()
            }) {
                Text("Toggle")
            }
            Text(isChecked ? "Checked" : "Not checked")
        }
    }
}
```

この例では、新たに`Button`を追加して、それをタップすると`isChecked`の状態が切り替わるようになっています。この結果、`CheckBoxView`自体をタップしても状態は切り替わらず、代わりに`Button`をタップすると状態が切り替わります。

---
