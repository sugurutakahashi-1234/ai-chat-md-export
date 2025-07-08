# SheetからPush遷移後の閉じ方

Date: 2024-08-19

---

## 👤 User
*2024-08-19 15:10:24*

swiftUIでsheetを立ち上げてそこからpush遷移させてOKボタンを押すと一つ前に戻るのではなく、sheetを閉じるようにしたい。

---

## 🤖 Assistant
*2024-08-19 15:10:40*

SwiftUIでSheetからPush遷移した後、OKボタンを押すとSheet全体を閉じるようにするためには、`@Environment(\.dismiss)`を利用してSheetを閉じる操作を行います。

以下にその実装方法を示します。

```swift
import SwiftUI

struct ContentView: View {
    @State private var isSheetPresented = false

    var body: some View {
        Button("Show Sheet") {
            isSheetPresented = true
        }
        .sheet(isPresented: $isSheetPresented) {
            NavigationView {
                FirstView()
            }
        }
    }
}

struct FirstView: View {
    var body: some View {
        NavigationLink("Go to Next View", destination: SecondView())
            .navigationTitle("First View")
            .navigationBarTitleDisplayMode(.inline)
    }
}

struct SecondView: View {
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        VStack {
            Text("Second View")
            Button("OK") {
                dismiss()
            }
        }
        .navigationTitle("Second View")
        .navigationBarTitleDisplayMode(.inline)
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
```

### 実装のポイント
1. **Sheetを表示する**: `sheet(isPresented:)`でSheetを表示します。
2. **Push遷移**: `NavigationLink`を使ってPush遷移を実装します。
3. **Sheetを閉じる**: `SecondView`内で`@Environment(\.dismiss)`を利用し、`dismiss()`メソッドを呼び出すことでSheetを閉じます。

この方法により、`OK`ボタンを押すと、Push遷移先のViewではなく、Sheet全体が閉じられる動作になります。

---

## 👤 User
*2024-08-19 15:10:52*

これだと一つ前のpush元に戻ってしまう

---

## 🤖 Assistant
*2024-08-19 15:11:13*

User wants to close the sheet entirely, even when navigating through push transitions within the sheet, without returning to the previous push view.

---

## 🔧 Tool
*2024-08-19 15:11:13*

Model set context updated.

---

## 🤖 Assistant
*2024-08-19 15:11:13*

Sheet内でPush遷移を行った後、OKボタンを押した際に、一つ前の画面に戻るのではなく、Sheet全体を閉じたい場合、Sheet内のビュー階層の状態を管理する必要があります。

この問題を解決するためには、`@Environment(\.dismiss)`をPush遷移の一番最初のView（`FirstView`）まで伝播させて、どの画面からでもSheet全体を閉じることができるようにします。

以下のように、`dismiss`を`EnvironmentObject`や`@Binding`を使って伝播させる方法があります。

### 実装例
```swift
import SwiftUI

struct ContentView: View {
    @State private var isSheetPresented = false

    var body: some View {
        Button("Show Sheet") {
            isSheetPresented = true
        }
        .sheet(isPresented: $isSheetPresented) {
            NavigationView {
                FirstView()
            }
        }
    }
}

struct FirstView: View {
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationLink("Go to Next View", destination: SecondView(dismissAction: dismiss))
            .navigationTitle("First View")
            .navigationBarTitleDisplayMode(.inline)
    }
}

struct SecondView: View {
    var dismissAction: DismissAction

    var body: some View {
        VStack {
            Text("Second View")
            Button("OK") {
                dismissAction()
            }
        }
        .navigationTitle("Second View")
        .navigationBarTitleDisplayMode(.inline)
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
```

### ポイント

1. **FirstViewでdismissを取得**: `@Environment(\.dismiss)`を使って、`FirstView`でdismiss操作を取得します。
2. **dismissを次のViewに渡す**: `dismiss`を次のView (`SecondView`) にプロパティとして渡します。
3. **OKボタンでSheet全体を閉じる**: `SecondView`では、渡された`dismissAction`を使ってSheet全体を閉じることができます。

これにより、OKボタンを押すと、PushされたViewから戻るのではなく、Sheet全体が閉じられる動作になります。

---
