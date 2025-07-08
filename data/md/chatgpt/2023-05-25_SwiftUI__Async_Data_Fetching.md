# SwiftUI: Async Data Fetching

日付: 2023-05-25

---

## 👤 ユーザー
*2023/05/26 08:46:50*

以下の条件でコーディングして欲しい

1. SwiftUIの最新系をつかってアプリ開発をしている。acync/await をつかってほしい。
2. AとBの2つViewを作成している。
3. AのViewとBのViewはそれぞれ、異なるViewModelを保持している。
4. AのViewを開いたときに、情報を取得して、Viewに描画する。
5. AのViewからBのViewへ、右上の編集ボタンをタップするとBの画面にsheetで遷移する
6. BのViewは左上にsheetを閉じるボタンと右上に保存ボタンが存在する。左上の閉じるボタンを押すと、シートは閉じる。右上の保存ボタンをタップすると、保存処理に成功したら、シートを閉じる。保存処理に失敗したら、アラートを表示する。
7. BのViewを閉じた際に、保存処理に成功して、シートが閉じられた場合は、AのViewを開いた時の、情報取得処理を行う。左上のボタンを閉じた場合や、スワイプによってsheetを閉じた場合は取得処理は行わない。
8. 情報の取得処理や保存処理はコメントのみで問題ない

---

## 🤖 アシスタント
*2023/05/26 08:47:45*

以下は、指定された条件に基づいて作成したSwiftUIとasync/awaitを使用したコードです。ViewModelとして`ObservableObject`を使用し、`@Published`プロパティラッパーを通じてViewの更新を管理します。ここでは、仮の情報取得と保存処理をコメントで示します。

```swift
import SwiftUI

class ViewModelA: ObservableObject {
    @Published var data: String = "Default Data"
    
    func fetchData() async {
        // Perform your data fetching logic here
        // e.g., from network, database etc.
        // Update 'data' accordingly
        let newData = "Fetched Data"
        DispatchQueue.main.async {
            self.data = newData
        }
    }
}

class ViewModelB: ObservableObject {
    @Published var saveSuccessful: Bool = false
    
    func saveData() async -> Bool {
        // Perform your data saving logic here
        // If success, return true
        // If failure, return false
        return true
    }
}

struct ViewA: View {
    @StateObject var viewModelA = ViewModelA()
    @State var isSheetPresented = false
    
    var body: some View {
        VStack {
            Text(viewModelA.data)
        }
        .task {
            await viewModelA.fetchData()
        }
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Button("Edit") {
                    isSheetPresented = true
                }
            }
        }
        .sheet(isPresented: $isSheetPresented) {
            ViewB(viewModelB: ViewModelB(), closeAction: {
                isSheetPresented = false
                Task {
                    await viewModelA.fetchData()
                }
            })
        }
    }
}

struct ViewB: View {
    @ObservedObject var viewModelB: ViewModelB
    @State var showAlert = false
    let closeAction: () -> Void
    
    var body: some View {
        VStack {
            // Your view content here
        }
        .toolbar {
            ToolbarItem(placement: .navigationBarLeading) {
                Button("Close") {
                    closeAction()
                }
            }
            ToolbarItem(placement: .navigationBarTrailing) {
                Button("Save") {
                    Task {
                        let result = await viewModelB.saveData()
                        if result {
                            closeAction()
                        } else {
                            showAlert = true
                        }
                    }
                }
            }
        }
        .alert(isPresented: $showAlert) {
            Alert(title: Text("Error"), message: Text("Save operation failed. Please try again."))
        }
    }
}
```

このコードでは、ViewAが表示されたときに情報取得処理を実行します。その後、"Edit"ボタンを押すとViewBがモーダルシートとして表示されます。ViewBには、"Close"ボタンと"Save"ボタンがあり、"Close"ボタンを押すとシートが閉じますが、情報の取得処理は実行されません。一方、"Save"ボタンを押すと保存処理が行われ、保存が成功すればシートが閉じ、保存が失敗すればアラートが表示されます。また、保存に成功してシートが閉じられた場合は、再び情報の取得処理が行われ

---

## 👤 ユーザー
*2023/05/26 08:48:59*

つづき

---

## 🤖 アシスタント
*2023/05/26 08:49:22*

すみません、メッセージが途中で切れてしまいました。以下が続きです。

保存に成功してシートが閉じられた場合は、再び情報の取得処理が行われます。

このコードは基本的な概念を示していますが、実際の取得と保存処理はあなたのアプリの要件によります。async/awaitを使用して非同期の操作を行っていますが、その詳細なロジックはあなたが記述する必要があります。例えば、外部APIを呼び出す、データベースにアクセスするなどの操作が可能です。

また、このコードは、ViewAからViewBに遷移するときに、ViewModelBの新しいインスタンスを作成しています。これはデモンストレーションのためのもので、実際のプロジェクトではViewModelBを適切に管理して、情報の一貫性とデータの流れを保つ必要があります。

このコードがあなたの要求を満たすことを願っています。何か他に質問があればお知らせください。

---

## 👤 ユーザー
*2023/05/26 08:51:36*

isSheetPresented や showAlert はViewModelに記述して欲しい。Bの左上のボタンで画面を閉じてもAが画面で情報を取得しているように思えるけど問題ないのか？

---

## 🤖 アシスタント
*2023/05/26 08:53:04*

指摘ありがとうございます。ViewModel内で状態を管理するのはより一貫性があり、適切なアーキテクチャです。また、Bの左上のボタンで画面を閉じたときの挙動も、再度情報を取得しないように修正するべきです。

そのため、以下に修正したコードを提供します。

```swift
import SwiftUI

class ViewModelA: ObservableObject {
    @Published var data: String = "Default Data"
    @Published var isSheetPresented: Bool = false
    @Published var shouldFetchData: Bool = false

    func fetchData() async {
        // Perform your data fetching logic here
        let newData = "Fetched Data"
        DispatchQueue.main.async {
            self.data = newData
        }
    }
}

class ViewModelB: ObservableObject {
    @Published var showAlert: Bool = false

    func saveData() async -> Bool {
        // Perform your data saving logic here
        return true
    }
}

struct ViewA: View {
    @StateObject var viewModelA = ViewModelA()

    var body: some View {
        VStack {
            Text(viewModelA.data)
        }
        .task {
            if viewModelA.shouldFetchData {
                await viewModelA.fetchData()
            }
        }
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Button("Edit") {
                    viewModelA.isSheetPresented = true
                }
            }
        }
        .sheet(isPresented: $viewModelA.isSheetPresented) {
            ViewB(viewModelB: ViewModelB(), closeAction: {
                viewModelA.isSheetPresented = false
                viewModelA.shouldFetchData = false
            }, saveAction: {
                viewModelA.isSheetPresented = false
                viewModelA.shouldFetchData = true
            })
        }
    }
}

struct ViewB: View {
    @ObservedObject var viewModelB: ViewModelB
    let closeAction: () -> Void
    let saveAction: () -> Void
    
    var body: some View {
        VStack {
            // Your view content here
        }
        .toolbar {
            ToolbarItem(placement: .navigationBarLeading) {
                Button("Close") {
                    closeAction()
                }
            }
            ToolbarItem(placement: .navigationBarTrailing) {
                Button("Save") {
                    Task {
                        let result = await viewModelB.saveData()
                        if result {
                            saveAction()
                        } else {
                            viewModelB.showAlert = true
                        }
                    }
                }
            }
        }
        .alert(isPresented: $viewModelB.showAlert) {
            Alert(title: Text("Error"), message: Text("Save operation failed. Please try again."))
        }
    }
}
```

ここで行った修正点を以下にまとめます。

1. `isSheetPresented`と`showAlert`をそれぞれのViewModelに移動しました。
2. `ViewModelA`に`shouldFetchData`フラグを追加し、BのViewが保存成功時にのみ再取得を行うようにしました。
3. `ViewB`に`saveAction`を追加し、保存成功時に`shouldFetchData`フラグを更新します。

これで指定の要件を満たせるはずです。何か他に質問があればお知らせください。

---

## 👤 ユーザー
*2023/05/26 08:54:28*

A画面の onDismiss 時に一律で情報を取得するようにした場合はもっと簡単に書けるのかな？

---

## 🤖 アシスタント
*2023/05/26 08:55:19*

はい、もしご希望があれば`onDismiss`を使用することで、`sheet`が閉じられる度に情報を取得するようにコードを簡略化することができます。ただし、この方法では保存成功時にのみ情報を再取得するという要件は満たせません。

以下にその実装例を示します。

```swift
import SwiftUI

class ViewModelA: ObservableObject {
    @Published var data: String = "Default Data"
    @Published var isSheetPresented: Bool = false

    func fetchData() async {
        // Perform your data fetching logic here
        let newData = "Fetched Data"
        DispatchQueue.main.async {
            self.data = newData
        }
    }
}

class ViewModelB: ObservableObject {
    @Published var showAlert: Bool = false

    func saveData() async -> Bool {
        // Perform your data saving logic here
        return true
    }
}

struct ViewA: View {
    @StateObject var viewModelA = ViewModelA()

    var body: some View {
        VStack {
            Text(viewModelA.data)
        }
        .task {
            await viewModelA.fetchData()
        }
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Button("Edit") {
                    viewModelA.isSheetPresented = true
                }
            }
        }
        .sheet(isPresented: $viewModelA.isSheetPresented, onDismiss: {
            Task {
                await viewModelA.fetchData()
            }
        }) {
            ViewB(viewModelB: ViewModelB(), closeAction: {
                viewModelA.isSheetPresented = false
            })
        }
    }
}

struct ViewB: View {
    @ObservedObject var viewModelB: ViewModelB
    let closeAction: () -> Void
    
    var body: some View {
        VStack {
            // Your view content here
        }
        .toolbar {
            ToolbarItem(placement: .navigationBarLeading) {
                Button("Close") {
                    closeAction()
                }
            }
            ToolbarItem(placement: .navigationBarTrailing) {
                Button("Save") {
                    Task {
                        let result = await viewModelB.saveData()
                        if !result {
                            viewModelB.showAlert = true
                        }
                    }
                    closeAction()
                }
            }
        }
        .alert(isPresented: $viewModelB.showAlert) {
            Alert(title: Text("Error"), message: Text("Save operation failed. Please try again."))
        }
    }
}
```

この例では、`ViewA`の`.sheet`メソッドに`onDismiss`パラメータを追加し、`sheet`が閉じられた時（"Close"ボタンや"Save"ボタンを押した時、またはスワイプで閉じた時）に情報を再取得します。これにより、`ViewModelA`の`shouldFetchData`フラグや`ViewB`の`saveAction`が不要となり、コードがシンプルになります。

---

## 👤 ユーザー
*2023/05/26 08:55:34*

closeAction() のようなものを使いたくないんだけどどうすればいい？

---

## 🤖 アシスタント
*2023/05/26 08:56:17*

`sheet`の`onDismiss`を利用し、`ViewB`から直接閉じる代わりにViewModelでsheetの表示状態を管理することで`closeAction`のようなものを削除できます。そのため、以下のようにコードを修正できます。

```swift
import SwiftUI

class ViewModelA: ObservableObject {
    @Published var data: String = "Default Data"
    @Published var isSheetPresented: Bool = false

    func fetchData() async {
        // Perform your data fetching logic here
        let newData = "Fetched Data"
        DispatchQueue.main.async {
            self.data = newData
        }
    }
}

class ViewModelB: ObservableObject {
    @Published var showAlert: Bool = false

    func saveData() async -> Bool {
        // Perform your data saving logic here
        return true
    }
}

struct ViewA: View {
    @StateObject var viewModelA = ViewModelA()

    var body: some View {
        VStack {
            Text(viewModelA.data)
        }
        .task {
            await viewModelA.fetchData()
        }
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Button("Edit") {
                    viewModelA.isSheetPresented = true
                }
            }
        }
        .sheet(isPresented: $viewModelA.isSheetPresented, onDismiss: {
            Task {
                await viewModelA.fetchData()
            }
        }) {
            ViewB(viewModelA: viewModelA, viewModelB: ViewModelB())
        }
    }
}

struct ViewB: View {
    @ObservedObject var viewModelA: ViewModelA
    @ObservedObject var viewModelB: ViewModelB
    
    var body: some View {
        VStack {
            // Your view content here
        }
        .toolbar {
            ToolbarItem(placement: .navigationBarLeading) {
                Button("Close") {
                    viewModelA.isSheetPresented = false
                }
            }
            ToolbarItem(placement: .navigationBarTrailing) {
                Button("Save") {
                    Task {
                        let result = await viewModelB.saveData()
                        if !result {
                            viewModelB.showAlert = true
                        }
                    }
                    viewModelA.isSheetPresented = false
                }
            }
        }
        .alert(isPresented: $viewModelB.showAlert) {
            Alert(title: Text("Error"), message: Text("Save operation failed. Please try again."))
        }
    }
}
```

ここで行った変更は、`ViewB`が`ViewModelA`の参照を持つようにし、それを使ってsheetの表示状態を制御するようにした点です。これにより、`closeAction`のようなコールバックを渡す必要がなくなりました。

---

## 👤 ユーザー
*2023/05/26 08:57:06*

ViewModelAの全部ではなくて、isSheetPresentedの値だけを取り回せばいいのでは？

---

## 🤖 アシスタント
*2023/05/26 08:58:10*

はい、その通りです。 `Binding`を用いて`isSheetPresented`プロパティのみを`ViewB`に渡すことができます。その結果、`ViewModelA`全体を参照する必要はなくなります。以下にその実装を示します。

```swift
import SwiftUI

class ViewModelA: ObservableObject {
    @Published var data: String = "Default Data"
    @Published var isSheetPresented: Bool = false

    func fetchData() async {
        // Perform your data fetching logic here
        let newData = "Fetched Data"
        DispatchQueue.main.async {
            self.data = newData
        }
    }
}

class ViewModelB: ObservableObject {
    @Published var showAlert: Bool = false

    func saveData() async -> Bool {
        // Perform your data saving logic here
        return true
    }
}

struct ViewA: View {
    @StateObject var viewModelA = ViewModelA()

    var body: some View {
        VStack {
            Text(viewModelA.data)
        }
        .task {
            await viewModelA.fetchData()
        }
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Button("Edit") {
                    viewModelA.isSheetPresented = true
                }
            }
        }
        .sheet(isPresented: $viewModelA.isSheetPresented, onDismiss: {
            Task {
                await viewModelA.fetchData()
            }
        }) {
            ViewB(isSheetPresented: $viewModelA.isSheetPresented, viewModelB: ViewModelB())
        }
    }
}

struct ViewB: View {
    @Binding var isSheetPresented: Bool
    @ObservedObject var viewModelB: ViewModelB
    
    var body: some View {
        VStack {
            // Your view content here
        }
        .toolbar {
            ToolbarItem(placement: .navigationBarLeading) {
                Button("Close") {
                    isSheetPresented = false
                }
            }
            ToolbarItem(placement: .navigationBarTrailing) {
                Button("Save") {
                    Task {
                        let result = await viewModelB.saveData()
                        if !result {
                            viewModelB.showAlert = true
                        }
                    }
                    isSheetPresented = false
                }
            }
        }
        .alert(isPresented: $viewModelB.showAlert) {
            Alert(title: Text("Error"), message: Text("Save operation failed. Please try again."))
        }
    }
}
```
この変更では、`ViewModelA`全体ではなく`isSheetPresented`のみを`ViewB`に渡します。そして、`ViewB`の中でそれを`@Binding`として受け取り、sheetの表示状態を直接制御します。これにより、ViewModel全体を不必要に渡すことなく、特定の状態だけを共有することができます。

---

## 👤 ユーザー
*2023/05/26 08:59:33*

ViewModelB の初期化の引数に、ViewModelA の isSheetPresented の値をbindingして渡すことはできないの？

---

## 🤖 アシスタント
*2023/05/26 09:00:17*

はい、それも可能です。その場合、ViewModelBを以下のように修正します。

```swift
class ViewModelB: ObservableObject {
    @Published var showAlert: Bool = false
    @Binding var isSheetPresented: Bool

    init(isSheetPresented: Binding<Bool>) {
        _isSheetPresented = isSheetPresented
    }

    func saveData() async -> Bool {
        // Perform your data saving logic here
        return true
    }
}
```

そして、それぞれのViewを以下のように修正します。

```swift
struct ViewA: View {
    @StateObject var viewModelA = ViewModelA()

    var body: some View {
        VStack {
            Text(viewModelA.data)
        }
        .task {
            await viewModelA.fetchData()
        }
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Button("Edit") {
                    viewModelA.isSheetPresented = true
                }
            }
        }
        .sheet(isPresented: $viewModelA.isSheetPresented, onDismiss: {
            Task {
                await viewModelA.fetchData()
            }
        }) {
            ViewB(viewModelB: ViewModelB(isSheetPresented: $viewModelA.isSheetPresented))
        }
    }
}

struct ViewB: View {
    @ObservedObject var viewModelB: ViewModelB
    
    var body: some View {
        VStack {
            // Your view content here
        }
        .toolbar {
            ToolbarItem(placement: .navigationBarLeading) {
                Button("Close") {
                    viewModelB.isSheetPresented = false
                }
            }
            ToolbarItem(placement: .navigationBarTrailing) {
                Button("Save") {
                    Task {
                        let result = await viewModelB.saveData()
                        if !result {
                            viewModelB.showAlert = true
                        }
                    }
                    viewModelB.isSheetPresented = false
                }
            }
        }
        .alert(isPresented: $viewModelB.showAlert) {
            Alert(title: Text("Error"), message: Text("Save operation failed. Please try again."))
        }
    }
}
```

これにより、`isSheetPresented`の値を`ViewB`から`ViewModelB`に直接バインドでき、ボタンから直接ViewModelB内の`isSheetPresented`を変更できます。ただし、この方式ではViewModel間で状態を共有するため、ViewModelの役割や責任が混ざる可能性があることに注意が必要です。

---

## 👤 ユーザー
*2023/05/26 09:02:04*

ViewModel の値の代入をView側で行なっているが、それをViewModelの関数経由で行なって、できるだけ、ViewModel側の変数をprivate(set) var にしたい。
関数名はボタンをタップしたことを表すような命名にしてほしい。

---

## 🤖 アシスタント
*2023/05/26 09:03:05*

指定いただいた通りに、ViewModel内で関数を定義し、それを通じてViewModel内部のプロパティを更新します。以下にコードの変更点を示します。

```swift
import SwiftUI

class ViewModelA: ObservableObject {
    @Published private(set) var data: String = "Default Data"
    @Published private(set) var isSheetPresented: Bool = false

    func fetchData() async {
        // Perform your data fetching logic here
        let newData = "Fetched Data"
        DispatchQueue.main.async {
            self.data = newData
        }
    }

    func presentSheet() {
        isSheetPresented = true
    }

    func hideSheet() {
        isSheetPresented = false
    }
}

class ViewModelB: ObservableObject {
    @Published private(set) var showAlert: Bool = false
    @Binding private var isSheetPresented: Bool

    init(isSheetPresented: Binding<Bool>) {
        _isSheetPresented = isSheetPresented
    }

    func saveData() async {
        // Perform your data saving logic here
        let saveSucceeded = true // replace this with actual save operation result

        if saveSucceeded {
            hideSheet()
        } else {
            showAlert = true
        }
    }

    func hideSheet() {
        isSheetPresented = false
    }
}

struct ViewA: View {
    @StateObject var viewModelA = ViewModelA()

    var body: some View {
        VStack {
            Text(viewModelA.data)
        }
        .task {
            await viewModelA.fetchData()
        }
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Button("Edit") {
                    viewModelA.presentSheet()
                }
            }
        }
        .sheet(isPresented: $viewModelA.isSheetPresented, onDismiss: {
            Task {
                await viewModelA.fetchData()
            }
        }) {
            ViewB(viewModelB: ViewModelB(isSheetPresented: $viewModelA.isSheetPresented))
        }
    }
}

struct ViewB: View {
    @ObservedObject var viewModelB: ViewModelB
    
    var body: some View {
        VStack {
            // Your view content here
        }
        .toolbar {
            ToolbarItem(placement: .navigationBarLeading) {
                Button("Close") {
                    viewModelB.hideSheet()
                }
            }
            ToolbarItem(placement: .navigationBarTrailing) {
                Button("Save") {
                    Task {
                        await viewModelB.saveData()
                    }
                }
            }
        }
        .alert(isPresented: $viewModelB.showAlert) {
            Alert(title: Text("Error"), message: Text("Save operation failed. Please try again."))
        }
    }
}
```

この変更では、`ViewModelA`と`ViewModelB`にそれぞれ`presentSheet`と`hideSheet`という新しい関数を追加しました。これらの関数はそれぞれ、sheetの表示と非表示を制御します。これにより、ViewModel内部のプロパティを直接変更することなく、ViewModel内部の状態を制御できます。

また、`ViewModelB`の`saveData`関数は、保存処理が成功したかどうかに応じてsheetを非表示にするか、アラートを表示するかを制御します。

---

## 👤 ユーザー
*2023/05/26 09:03:37*

それぞれの PreviewProvider のサンプルを記述して欲しい

---

## 🤖 アシスタント
*2023/05/26 09:04:34*

それぞれのViewに対応する`PreviewProvider`を追加します。これにより、SwiftUIのPreviewでViewの見た目を確認することができます。

```swift
import SwiftUI

class ViewModelA: ObservableObject {
    @Published private(set) var data: String = "Default Data"
    @Published private(set) var isSheetPresented: Bool = false

    func fetchData() async {
        // Perform your data fetching logic here
        let newData = "Fetched Data"
        DispatchQueue.main.async {
            self.data = newData
        }
    }

    func presentSheet() {
        isSheetPresented = true
    }

    func hideSheet() {
        isSheetPresented = false
    }
}

class ViewModelB: ObservableObject {
    @Published private(set) var showAlert: Bool = false
    @Binding private var isSheetPresented: Bool

    init(isSheetPresented: Binding<Bool>) {
        _isSheetPresented = isSheetPresented
    }

    func saveData() async {
        // Perform your data saving logic here
        let saveSucceeded = true // replace this with actual save operation result

        if saveSucceeded {
            hideSheet()
        } else {
            showAlert = true
        }
    }

    func hideSheet() {
        isSheetPresented = false
    }
}

struct ViewA: View {
    @StateObject var viewModelA = ViewModelA()

    var body: some View {
        VStack {
            Text(viewModelA.data)
        }
        .task {
            await viewModelA.fetchData()
        }
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Button("Edit") {
                    viewModelA.presentSheet()
                }
            }
        }
        .sheet(isPresented: $viewModelA.isSheetPresented, onDismiss: {
            Task {
                await viewModelA.fetchData()
            }
        }) {
            ViewB(viewModelB: ViewModelB(isSheetPresented: $viewModelA.isSheetPresented))
        }
    }
}

struct ViewA_Previews: PreviewProvider {
    static var previews: some View {
        ViewA()
    }
}

struct ViewB: View {
    @ObservedObject var viewModelB: ViewModelB
    
    var body: some View {
        VStack {
            // Your view content here
        }
        .toolbar {
            ToolbarItem(placement: .navigationBarLeading) {
                Button("Close") {
                    viewModelB.hideSheet()
                }
            }
            ToolbarItem(placement: .navigationBarTrailing) {
                Button("Save") {
                    Task {
                        await viewModelB.saveData()
                    }
                }
            }
        }
        .alert(isPresented: $viewModelB.showAlert) {
            Alert(title: Text("Error"), message: Text("Save operation failed. Please try again."))
        }
    }
}

struct ViewB_Previews: PreviewProvider {
    static var previews: some View {
        ViewB(viewModelB: ViewModelB(isSheetPresented: .constant(false)))
    }
}
```

`ViewA_Previews`および`ViewB_Previews`は、それぞれ`ViewA`と`ViewB`のプレビューを提供します。`ViewB_Previews`の場合、プレビューのために一時的な`isSheetPresented`のバインディングを作成します（`.constant(false)`）。これはプレビューのコンテクスト内でのみ使用され、実際のアプリケーションの

---

## 👤 ユーザー
*2023/05/26 09:09:30*

つづき

---

## 🤖 アシスタント
*2023/05/26 09:09:48*

実行時には使用されません。これにより、プレビュー画面でViewBの見た目を確認することができます。

ここでは、`ViewModelA`と`ViewModelB`の初期化をそのまま行っていますが、実際のアプリケーションにおいては、ViewModelの初期化に依存関係が存在する場合があります（例えば、データソースやAPIクライアントなど）。そのような依存関係を持つViewModelを初期化する際には、適切なモックオブジェクトを用意するか、または必要に応じてプレビュー専用のViewModelを用意することも一考に値します。

---

## 👤 ユーザー
*2023/05/26 09:10:24*

ViewModelB は ViewModelAとは関係場合で使用されることもあるのだけれどもそういう場合はどうすればよいか？

---

## 🤖 アシスタント
*2023/05/26 09:11:14*

ViewModelBがViewModelAとは独立して使われる場合でも、ViewModelBがシートの表示状態を制御する必要があるのであれば、それに応じてViewModelBの設計を変更する必要があります。

具体的には、ViewModelBが自身の`isSheetPresented`プロパティを自己管理できるように変更します。この場合、ViewModelBの初期化では`isSheetPresented`のバインディングを取らず、`isSheetPresented`を単なるPublishedプロパティとして定義します。そして、ViewModelBがシートを表示する場合と非表示にする場合で適切なメソッドを提供します。

以下にそのようなViewModelBのコードを示します：

```swift
class ViewModelB: ObservableObject {
    @Published private(set) var showAlert: Bool = false
    @Published private(set) var isSheetPresented: Bool = false

    func saveData() async {
        // Perform your data saving logic here
        let saveSucceeded = true // replace this with actual save operation result

        if saveSucceeded {
            hideSheet()
        } else {
            showAlert = true
        }
    }

    func presentSheet() {
        isSheetPresented = true
    }

    func hideSheet() {
        isSheetPresented = false
    }
}
```

そして、ViewBのコードは以下のようになります：

```swift
struct ViewB: View {
    @ObservedObject var viewModelB: ViewModelB
    
    var body: some View {
        VStack {
            // Your view content here
        }
        .toolbar {
            ToolbarItem(placement: .navigationBarLeading) {
                Button("Close") {
                    viewModelB.hideSheet()
                }
            }
            ToolbarItem(placement: .navigationBarTrailing) {
                Button("Save") {
                    Task {
                        await viewModelB.saveData()
                    }
                }
            }
        }
        .alert(isPresented: $viewModelB.showAlert) {
            Alert(title: Text("Error"), message: Text("Save operation failed. Please try again."))
        }
    }
}
```

これでViewModelBが独立して使用できます。ただし、ViewAからViewModelBを使用する場合には、ViewAの`isSheetPresented`の状態とViewModelBの`isSheetPresented`の状態を同期する必要があります。そのため、どちらの状態が変化したときもそれに応じてもう一方を更新するロジックを考える必要があります。

---

## 👤 ユーザー
*2023/05/26 09:12:31*

単純にViewModelBの初期化の引数のisSheetPresentedをnil許容にすることで解決したりしないの？

---

## 🤖 アシスタント
*2023/05/26 09:13:08*

`ViewModelB`の初期化時に`isSheetPresented`のバインディングをオプショナルにするという方法も考えられますが、SwiftUIの`Binding`はオプショナルをサポートしていないため、それが原因で複雑さが増す可能性があります。また、この方法では`ViewModelB`が`isSheetPresented`の状態を自己管理する必要があります。

その代わりに、以下のように`ViewModelB`を設計することも可能です。この場合、`isSheetPresented`は非オプショナルのバインディングとして受け取りますが、バインディングを使わずに`ViewModelB`を使う場合にはダミーのバインディングを提供します。

```swift
class ViewModelB: ObservableObject {
    @Published private(set) var showAlert: Bool = false
    @Binding private var isSheetPresented: Bool

    init(isSheetPresented: Binding<Bool> = .constant(false)) {
        _isSheetPresented = isSheetPresented
    }

    func saveData() async {
        // Perform your data saving logic here
        let saveSucceeded = true // replace this with actual save operation result

        if saveSucceeded {
            hideSheet()
        } else {
            showAlert = true
        }
    }

    func hideSheet() {
        isSheetPresented = false
    }
}
```

この設計により、`ViewModelB`は以下の2つの方法で使用できます。

1. バインディングを通じてシートの表示状態を制御する（例えば、`ViewA`から呼び出される場合）。
2. 自己管理する（`isSheetPresented`のバインディングを提供しない場合）。

このように、`ViewModelB`を設計することで、その使用方法が柔軟になり、さまざまなシナリオに対応できるようになります。ただし、これはあくまで一つの方法であり、アプリケーションの要件や設計原則によっては、他の方法が適切な場合もあります。

---

## 👤 ユーザー
*2023/05/26 09:36:16*

ViewModelB側では変数目が自分自身のシートのisSheetPresentedだとわかるようにしたいのだけどどうすればいい？ViewModelAとViewModelBでは同じ変数名ではなくて、それぞれ適切な変数名がいい

---

## 🤖 アシスタント
*2023/05/26 09:37:03*

それぞれのViewModelが自身のシートの表示状態を管理するためには、それぞれのViewModelで異なる変数名を使用することが可能です。この場合、`ViewModelB`の`isSheetPresented`を`isOwnSheetPresented`などのようにリネームすることで、`ViewModelB`が自身のシートの表示状態を管理していることが明確になります。

以下に、そのような変数名の変更を反映した`ViewModelB`のコードを示します：

```swift
class ViewModelB: ObservableObject {
    @Published private(set) var showAlert: Bool = false
    @Published private(set) var isOwnSheetPresented: Bool = false

    func saveData() async {
        // Perform your data saving logic here
        let saveSucceeded = true // replace this with actual save operation result

        if saveSucceeded {
            hideOwnSheet()
        } else {
            showAlert = true
        }
    }

    func presentOwnSheet() {
        isOwnSheetPresented = true
    }

    func hideOwnSheet() {
        isOwnSheetPresented = false
    }
}
```

同様に、`ViewB`でもこの変更を反映する必要があります：

```swift
struct ViewB: View {
    @ObservedObject var viewModelB: ViewModelB
    
    var body: some View {
        VStack {
            // Your view content here
        }
        .toolbar {
            ToolbarItem(placement: .navigationBarLeading) {
                Button("Close") {
                    viewModelB.hideOwnSheet()
                }
            }
            ToolbarItem(placement: .navigationBarTrailing) {
                Button("Save") {
                    Task {
                        await viewModelB.saveData()
                    }
                }
            }
        }
        .alert(isPresented: $viewModelB.showAlert) {
            Alert(title: Text("Error"), message: Text("Save operation failed. Please try again."))
        }
    }
}
```

これにより、`ViewModelA`と`ViewModelB`はそれぞれ異なる変数名（`isSheetPresented`と`isOwnSheetPresented`）を使用してシートの表示状態を管理します。これにより、それぞれのViewModelが自身のシートの表示状態を管理していることが明確になります。

---

## 👤 ユーザー
*2023/05/26 09:47:29*

ナビゲーションバーのタイトルやtoolbarが表示されなかったんだけどどうすればいい？

---

## 🤖 アシスタント
*2023/05/26 09:48:08*

SwiftUIでナビゲーションバーのタイトルやツールバーを表示するには、ビューを`NavigationView`でラップする必要があります。以下に、それぞれのビューで`NavigationView`を使用する例を示します。

まず、ViewAのコードは以下のようになります：

```swift
struct ViewA: View {
    @ObservedObject var viewModelA: ViewModelA
    @ObservedObject var viewModelB: ViewModelB

    var body: some View {
        NavigationView {
            VStack {
                // Your view content here
            }
            .navigationTitle("View A")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Edit") {
                        viewModelA.presentSheet()
                    }
                }
            }
            .sheet(isPresented: $viewModelA.isSheetPresented) {
                ViewB(viewModelB: viewModelB)
            }
        }
    }
}
```

次に、ViewBのコードは以下のようになります：

```swift
struct ViewB: View {
    @ObservedObject var viewModelB: ViewModelB

    var body: some View {
        NavigationView {
            VStack {
                // Your view content here
            }
            .navigationTitle("View B")
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Close") {
                        viewModelB.hideOwnSheet()
                    }
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Save") {
                        Task {
                            await viewModelB.saveData()
                        }
                    }
                }
            }
            .alert(isPresented: $viewModelB.showAlert) {
                Alert(title: Text("Error"), message: Text("Save operation failed. Please try again."))
            }
        }
    }
}
```

ここで、`NavigationView`は各ビューをラップしており、`.navigationTitle()`を使用してナビゲーションバーのタイトルを設定しています。そして、`.toolbar`と`ToolbarItem`を使用してツールバーを表示しています。

---
