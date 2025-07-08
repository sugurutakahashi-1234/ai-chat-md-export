# iOS SwiftUI 遷移処理

Date: 2023-06-04

---

## 👤 User
*2023-06-05 01:47:35*

あなたはiOSの優秀なエンジニアです。

以下の条件で実装して欲しい。

SwiftUIでアプリを作成している。
async/awaitをつかってほしい。
エラーはthrowして欲しい。
エラーがある場合はアラートをあげてほしい。
DispatchQueue をつかわずに Swift Concurrencyをつかってほしい。

AView-&gt;BView-&gt;CView-&gt;DView-&gt;EView

という画面遷移するとする。
画面遷移する際は

ユーザーデフォルトに以下のフラグがあるとする
doneBTask: Bool
doneCTask: Bool
doneDTask: Bool

BからCに遷移したタイミングでdoneBTaskは true となり、次にアプリを起動したときは、そのフラグがtrueになっていれば。Bの画面は表示しないようにする。

doneCTaskとdoneDTaskはdoneBTaskと同様の振る舞いを各画面で行う。

AView-&gt;BViewの遷移はAViewがBViewの上にある状態で、だんだんと透明になるようにきえてほしい。

BView-&gt;CViewの遷移はpush遷移であるが戻れないようにして欲しい

CView-&gt;DViewの遷移はpush遷移であるが戻れないようにして欲しい

DView-&gt;EViewの遷移はDViewがEViewの上にある状態で、だんだんと透明になるようにきえてほしい。

そして、doneBTask: Bool、doneCTask: Bool、doneDTask: Boolがすべてtrueの場合は、AView-&gt;EViewの遷移はAViewがEViewの上にある状態で、だんだんと透明になるようにきえてほしい。

---

## 🤖 Assistant
*2023-06-05 01:48:38*

SwiftUIとSwift Concurrencyを使って、あなたの要求を満たすようなコードを書くことはできます。

ただし、実際のコードの構造は、実際のアプリの詳細な内容やその他の要求によって変わるかもしれませんので、これは一例です。

```swift
enum TransitionError: Error {
    case failed(String)
}

enum Task: String {
    case doneBTask, doneCTask, doneDTask
}

struct AView: View {
    @StateObject private var viewModel = ViewModel()

    var body: some View {
        VStack {
            // Add your views here

            NavigationLink(
                destination: BView(),
                isActive: $viewModel.shouldNavigateToB,
                label: {
                    EmptyView()
                }
            )
        }
        .alert(isPresented: $viewModel.hasError, content: {
            Alert(title: Text("Error"), message: Text(viewModel.error?.localizedDescription ?? "Unknown error"))
        })
        .onAppear {
            viewModel.checkTaskCompletion()
        }
    }

    class ViewModel: ObservableObject {
        @Published var shouldNavigateToB = false
        @Published var hasError = false
        @Published var error: Error?

        func checkTaskCompletion() async {
            do {
                try await verifyTaskCompletion()
                shouldNavigateToB = true
            } catch {
                self.error = error
                hasError = true
            }
        }

        func verifyTaskCompletion() async throws {
            guard let doneBTask = UserDefaults.standard.object(forKey: Task.doneBTask.rawValue) as? Bool else {
                throw TransitionError.failed("Task not found.")
            }

            if !doneBTask {
                shouldNavigateToB = true
            } else {
                // Add your logic here for the transition to EView
            }
        }
    }
}

struct BView: View {
    // BView definition
    // You should define similar ViewModel and transitions to CView if doneCTask is not completed.
}

struct CView: View {
    // CView definition
    // You should define similar ViewModel and transitions to DView if doneDTask is not completed.
}

struct DView: View {
    // DView definition
    // You should define similar ViewModel and transitions to EView.
}

struct EView: View {
    // EView definition
}
```
このコードは以下の通りです：

1. `AView`はアプリケーションの起動時に表示され、`BView`への遷移を制御します。
2. `AView`のViewModelは非同期的に`doneBTask`が完了したかどうかを確認します。
3. もし`doneBTask`が未完了なら、ViewModelは`shouldNavigateToB`をtrueに設定し、それが`NavigationLink`の`isActive`にバインドされているため、`BView`へ遷移します。
4. もし`doneBTask`がすでに完了していたら、`EView`への遷移ロジックを追加します（現在は未実装）。
5. `BView`、`CView`、そして`DView`でも同様の処理を行います。ただし、それぞれのViewに対応

---

## 👤 User
*2023-06-05 01:48:47*

つづき

---

## 🤖 Assistant
*2023-06-05 01:49:40*

するタスクをチェックします（`doneCTask`と`doneDTask`）。

コードの一部は省略されていますが、それぞれのViewで似たようなViewModelと遷移を定義します。以下に`BView`の一例を示します。

```swift
struct BView: View {
    @StateObject private var viewModel = ViewModel()
    
    var body: some View {
        VStack {
            // Add your views here
            NavigationLink(
                destination: CView(),
                isActive: $viewModel.shouldNavigateToC,
                label: {
                    EmptyView()
                }
            )
        }
        .navigationBarBackButtonHidden(true)
        .alert(isPresented: $viewModel.hasError, content: {
            Alert(title: Text("Error"), message: Text(viewModel.error?.localizedDescription ?? "Unknown error"))
        })
        .onAppear {
            viewModel.checkTaskCompletion()
        }
    }
    
    class ViewModel: ObservableObject {
        @Published var shouldNavigateToC = false
        @Published var hasError = false
        @Published var error: Error?
        
        func checkTaskCompletion() async {
            do {
                try await verifyTaskCompletion()
                shouldNavigateToC = true
            } catch {
                self.error = error
                hasError = true
            }
        }
        
        func verifyTaskCompletion() async throws {
            guard let doneCTask = UserDefaults.standard.object(forKey: Task.doneCTask.rawValue) as? Bool else {
                throw TransitionError.failed("Task not found.")
            }
            
            if !doneCTask {
                shouldNavigateToC = true
            } else {
                // Add your logic here for the transition to the next view.
            }
        }
    }
}
```

`CView`と`DView`も同様に作成します。ただし、遷移するViewとチェックするタスクをそれぞれのViewに合わせて変更します。

この設定では、各Viewの遷移はそのViewが表示されたときに制御されます。タスクが完了していなければ次のViewへ遷移し、タスクがすでに完了していたらそのViewはスキップします（ただし、そのスキップロジックはまだ定義されていません）。 

また、あなたの要求により、BView-&gt;CViewとCView-&gt;DViewの遷移においては、`navigationBarBackButtonHidden(true)`を使用して戻るボタンを隠しています。これにより、ユーザーが前の画面に戻ることを防ぐことができます。

遷移のアニメーションについては、SwiftUIではNavigationLinkを使った画面遷移のアニメーションをカスタマイズするのは難しいです。そのため、あなたの要求に完全に合致するアニメーションを実装するためには、カスタムトランジションを使用するか、あるいはUIKitの`UINavigationController`を使用するなど、他の方法を検討する必要があるかもしれません。

---

## 👤 User
*2023-06-05 01:52:20*

EViewも記述してほしい。はAView-&gt;EViewの遷移はAViewがEViewの上にある状態で、だんだんと透明になるようにきえてほしい。

---
