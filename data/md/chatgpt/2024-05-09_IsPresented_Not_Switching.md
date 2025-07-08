# IsPresented Not Switching

Date: 2024-05-09

---

## 👤 User
*2024-05-09 15:47:16*

以下のisPresentedが切り替わらないどうして？

#Preview {
    @State var isPresented: Bool = true

    return VStack {
        Toggle("", isOn: $isPresented)
            .labelsHidden()
        LoadingView()
        Button {
            isPresented.toggle()
        } label: {
            Text("Button")
        }
        Text("overlayLoading")
            .overlayLoading(isPresented: $isPresented, isGestureAllowed: false)
    }
}

---

## 🤖 Assistant
*2024-05-09 15:47:56*

SwiftUIの`isPresented`変数が期待通りに切り替わらない場合、いくつかの理由が考えられます。問題の解析と解決のために以下の点を確認してみてください：

1. **Viewの更新確認**：
   SwiftUIでは、State変数の値が変更されると関連するViewが更新されます。`isPresented`の値が`Button`をタップすることで`toggle()`メソッドを通じて変更されているか、デバッグ出力で確認してみてください。

   ```swift
   Button {
       isPresented.toggle()
       print("isPresented is now \(isPresented)")
   } label: {
       Text("Button")
   }
   ```

2. **`overlayLoading`の定義確認**：
   `overlayLoading`がカスタムビュー修飾子である場合、その内部で`isPresented`が適切に使用されているか確認が必要です。例えば、`overlayLoading`内で何らかの条件で`isPresented`の値が意図せず変更されていないか、または無視されていないか等です。

3. **Viewの再構築**：
   `VStack`全体が`@State`変数の変更によって再構築されるべきですが、何らかの理由で再構築が起こっていない可能性があります。この場合、異なる方法でViewを強制的に更新するか、他のUI要素との相互作用を検討してみてください。

4. **他のビューとの競合**：
   `isPresented`が他の場所、特に外部から渡されたり共有されたりしている場合、その値が他のビューによって影響を受けている可能性があります。この変数が他のビューにも影響されていないか確認してみてください。

5. **環境の問題**：
   特にPreview環境で問題が発生している場合は、Xcodeのバージョンや設定が影響している可能性があります。アプリを実際のデバイスまたはシミュレータでテストして、問題が続くかどうかを確認してみてください。

上記のステップを踏まえても解決しない場合は、さらにコードの詳細を共有いただければ、もっと具体的なアドバイスができるかもしれません。

---

## 👤 User
*2024-05-09 15:50:13*

SwiftUIのPreviewで簡単にトグルの切り替えを確認できるコードを教えてほし

---

## 🤖 Assistant
*2024-05-09 15:50:42*

SwiftUIでプレビューを使用してトグルの切り替えを簡単に確認できるサンプルコードを以下に示します。この例では、`@State`を使用してトグルの状態を管理し、その状態に基づいて異なるテキストを表示するシンプルなUIを構築しています。

```swift
import SwiftUI

struct TogglePreviewView: View {
    @State private var isToggled: Bool = false

    var body: some View {
        VStack {
            Toggle("Toggle Switch", isOn: $isToggled)
                .padding()
            Text(isToggled ? "Toggle is ON" : "Toggle is OFF")
        }
    }
}

struct TogglePreviewView_Previews: PreviewProvider {
    static var previews: some View {
        TogglePreviewView()
    }
}
```

### コードの説明:
- `TogglePreviewView`: このビューがトグルとテキストを含むメインのビューです。
- `@State private var isToggled`: トグルの状態を保持するためのState変数です。これにより、トグルの値が変更されるたびにビューが更新されます。
- `Toggle("Toggle Switch", isOn: $isToggled)`: ユーザーがトグルを操作できるUI要素です。`$isToggled`にバインドされているため、このトグルの状態は`isToggled`変数に反映されます。
- `Text(isToggled ? "Toggle is ON" : "Toggle is OFF")`: トグルの状態に基づいて異なるテキストを表示します。

このコードをXcodeのSwiftUIプレビューで実行することで、トグルのON/OFFをリアルタイムで視覚的に確認することができます。

---

## 👤 User
*2024-05-09 15:51:26*

TogglePreviewView の生成時に外川渡すようにしてほしい

---

## 🤖 Assistant
*2024-05-09 15:51:55*

`TogglePreviewView`を外部から初期値を渡せるように変更するには、イニシャライザを利用して外部からの値を受け取るように設定します。以下のコードは`TogglePreviewView`に初期トグル状態を外部から設定する方法を示しています：

```swift
import SwiftUI

struct TogglePreviewView: View {
    @State private var isToggled: Bool

    // 外部から初期値を受け取るイニシャライザ
    init(isToggled: Bool) {
        _isToggled = State(initialValue: isToggled)
    }

    var body: some View {
        VStack {
            Toggle("Toggle Switch", isOn: $isToggled)
                .padding()
            Text(isToggled ? "Toggle is ON" : "Toggle is OFF")
        }
    }
}

struct TogglePreviewView_Previews: PreviewProvider {
    static var previews: some View {
        TogglePreviewView(isToggled: true) // 初期値を true として渡す
    }
}
```

### コードの変更点
- `@State private var isToggled: Bool`の定義に変更はありませんが、イニシャライザ`init(isToggled: Bool)`を追加しています。これにより、ビューが生成される際に外部から初期状態を設定できます。
- `_isToggled = State(initialValue: isToggled)`とすることで、外部から渡された値を`State`の初期値として設定しています。

### プレビューの利用
- `TogglePreviewView_Previews`では、`TogglePreviewView`に対して`true`という初期値を渡しています。プレビューでこのビューを確認すると、トグルがONの状態で表示されます。

この変更により、`TogglePreviewView`を利用する際に柔軟に初期値を設定できるようになり、異なるシナリオでの挙動を簡単にテストできます。

---

## 👤 User
*2024-05-09 15:52:37*

もうひとつトグルを作ってそれが連動するようにしてほしい

---

## 🤖 Assistant
*2024-05-09 15:53:10*

２つのトグルが連動するように`TogglePreviewView`を変更するには、両方のトグルが同じ`@State`変数を参照するように設定します。こうすることで、どちらかのトグルが切り替わった時にもう一方も同時に更新されるようになります。以下のコードはそのための修正を加えたものです：

```swift
import SwiftUI

struct TogglePreviewView: View {
    @State private var isToggled: Bool

    // 外部から初期値を受け取るイニシャライザ
    init(isToggled: Bool) {
        _isToggled = State(initialValue: isToggled)
    }

    var body: some View {
        VStack {
            Toggle("Toggle Switch 1", isOn: $isToggled)
                .padding()
            Toggle("Toggle Switch 2", isOn: $isToggled)
                .padding()
            Text(isToggled ? "Toggles are ON" : "Toggles are OFF")
        }
    }
}

struct TogglePreviewView_Previews: PreviewProvider {
    static var previews: some View {
        TogglePreviewView(isToggled: false) // 初期値を false として渡す
    }
}
```

### コードの説明:
- ２つの`Toggle`ビューが追加されています。両方とも`isOn`バインディングで同じ`$isToggled`変数を使用しています。これにより、一方のトグルの状態が変わるともう一方のトグルも自動的に更新されます。
- `Text`ビューは両方のトグルの状態を表示しますが、両方が常に同じ状態なので、単一の状態表記を使います。

### 利用シナリオ:
このコードは、例えば設定画面で同じカテゴリの異なるオプションが同じ設定値に依存する場合に便利です。また、一方の操作が他方に影響を与えるべき状況で役立ちます。プレビューを使用して実際

---

## 👤 User
*2024-05-09 15:53:11*

違うそれをTogglePreviewView_Previews内で実装してほしいんだ

---

## 🤖 Assistant
*2024-05-09 15:53:48*

`TogglePreviewView_Previews`内で2つの異なる`TogglePreviewView`インスタンスを連動させたい場合、外部から管理される`@State`または`@Binding`変数を使ってプレビューでそれを制御することができます。これにより、プレビュー内で2つのトグルが同じ状態を共有し、連動するように設定できます。

以下のコードは、プレビューでトグルの状態を共有する方法を示しています：

```swift
import SwiftUI

struct TogglePreviewView: View {
    @Binding var isToggled: Bool  // Bindingを使用

    var body: some View {
        VStack {
            Toggle("Toggle Switch", isOn: $isToggled)
                .padding()
            Text(isToggled ? "Toggle is ON" : "Toggle is OFF")
        }
    }
}

struct TogglePreviewView_Previews: PreviewProvider {
    @State static var isToggled = false  // Preview内でStateを定義

    static var previews: some View {
        Group {
            TogglePreviewView(isToggled: $isToggled) // 初めのTogglePreviewView
            TogglePreviewView(isToggled: $isToggled) // ２番目のTogglePreviewView
        }
    }
}
```

### コードの変更点:
- `TogglePreviewView`の定義では、`@State`ではなく`@Binding`を使用しています。これにより、このビューは外部から渡されたバインディング変数に依存するようになります。
- `TogglePreviewView_Previews`では、`@State static var isToggled`を使用してプレビュー内でトグル状態を管理し、この状態を`TogglePreviewView`に渡しています。

### 利用シナリオ:
このアプローチは、複数のビューが同じ状態を共有する必要があるときや、特にプレビューで異なるビューコンポーネント間での状態の共有を簡単に示したい場合に便利です。プレビューでのみこのように設定することで、アプリケーションの他の部分に影響を与えることなく、ビューの動作を確認できます。

---

## 👤 User
*2024-05-09 15:54:14*

このときトグルが動かないんだ

---

## 🤖 Assistant
*2024-05-09 15:54:52*

SwiftUIのプレビューで状態を管理するために`@State`を使用して連動するトグルを実装しようとした際に、トグルが動かない問題が発生しているようです。これは、プレビュー内で`@State`を直接使用することができないために起こります。`@State`はプレビューの外部で管理する必要がありますが、プレビューではこれを直接使うことが推奨されていません。

この問題を解決するためには、外部から状態を注入する代わりに、プレビュー内でビューを包含するコンテナビューを用いて状態を管理する方法が考えられます。以下にその実装例を示します：

```swift
import SwiftUI

struct TogglePreviewView: View {
    @Binding var isToggled: Bool  // Bindingを使用

    var body: some View {
        VStack {
            Toggle("Toggle Switch", isOn: $isToggled)
                .padding()
            Text(isToggled ? "Toggle is ON" : "Toggle is OFF")
        }
    }
}

struct PreviewWrapperView: View {
    @State private var isToggled: Bool = false  // Stateをこのビューで管理

    var body: some View {
        VStack {
            TogglePreviewView(isToggled: $isToggled) // １つ目のトグル
            TogglePreviewView(isToggled: $isToggled) // ２つ目のトグル
        }
    }
}

struct TogglePreviewView_Previews: PreviewProvider {
    static var previews: some View {
        PreviewWrapperView() // PreviewWrapperViewをプレビューする
    }
}
```

### 解決策の説明:
- 新しく`PreviewWrapperView`というビューを追加しました。このビュー内で`@State`を使用してトグルの状態を管理し、その状態を`TogglePreviewView`に`@Binding`を通じて渡しています。
- この方法により、プレビュー内での状態の更新が可能になり、トグルの連動が正常に動作するようになります。

このコード変更により、プレビューでトグルの連動を確認できるはずです。ビューの階層が適切に設計されており、`@State`と`@Binding`が正しいスコープで使用されているため、期待通りに動作するようになります。

---
