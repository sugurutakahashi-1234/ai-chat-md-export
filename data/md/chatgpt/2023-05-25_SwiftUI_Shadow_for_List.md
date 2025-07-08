# SwiftUI Shadow for List

Date: 2023-05-25

---

## 👤 User
*2023-05-26 03:12:30*

SwiftUIでListのSectionにシャドウをかける方法

---

## 🤖 Assistant
*2023-05-26 03:13:09*

SwiftUIで直接ListまたはそのSectionにシャドウを適用するための組み込み方法はありません。しかし、視覚的な影響を再現するためのいくつかのアプローチがあります。ここに一つのアプローチを示します：

```swift
struct ContentView: View {
    var body: some View {
        ZStack {
            List {
                Section(header: Text("Header").padding().background(RoundedRectangle(cornerRadius: 5).fill(Color.white).shadow(radius: 5))) {
                    ForEach(0..<5) { item in
                        Text("Row \(item)")
                    }
                }
            }
            .listStyle(InsetGroupedListStyle())
        }
        .background(Color(.systemGroupedBackground))
    }
}
```

このコードでは、Sectionのヘッダーにパディングと背景を適用して、それをRoundedRectangleでラップします。そして、このRoundedRectangleにシャドウを適用します。最終的には、このパディングと背景があるテキストがシャドウを持つセクションヘッダーとして機能します。

また、`InsetGroupedListStyle()`を使用してListのスタイルを設定し、システムの背景色を使用して全体の背景を設定しています。これにより、シャドウが明確に見えるようになります。

しかし、Listの各項目やSection全体に直接影を付けることは、現在のところSwiftUIでは難しいです。必要な場合は、自分でカスタムビューを作成するか、UIKitを利用することを検討してみてください。

---

## 👤 User
*2023-05-26 05:09:32*

こうなったんだけど didFetchData も @Published にして、前提条件として、判定した方がいい気がするんだけどどうかな？

```swift
final class UserAttributeEditPresenter: ObservableObject {
    @MainActor @Published var userAttributesSelection = UserAttributesSelection()
    @MainActor @Published var inputtedUserAttributes = InputtedUserAttributes()
    // TODO: エラーハンドリングはあとで実装する
    @MainActor @Published var isError = false
    private let repository: UserAttributesRepositoryProtocol
    private var cancellableSet = Set<AnyCancellable>()
    private var didFetchData = false
    
    init(repository: UserAttributesRepositoryProtocol = UserAttributesRepository()) {
        self.repository = repository

        $inputtedUserAttributes
            .debounce(for: .seconds(0.5), scheduler: RunLoop.main)
            .sink { [weak self] _ in
                guard let self else { return }
                if self.didFetchData {
                    Task {
                        await self.save()
                    }
                }
            }
            .store(in: &cancellableSet)
    }
    
    func onAppear() async {
        do {
            async let fetchedUserAttributesSelectionTask = repository.fetchUserAttributesSelection()
            async let fetchedInputtedUserAttributesTask = repository.fetchInputtedUserAttributes()
            
            let fetchedUserAttributesSelection = try await fetchedUserAttributesSelectionTask
            
            // ここでは選択されている値よりも先に選択肢を更新するように考慮している
            Task { @MainActor in
                self.userAttributesSelection = fetchedUserAttributesSelection
            }
            
            let fetchedInputtedUserAttributes = try await fetchedInputtedUserAttributesTask
            
            Task { @MainActor in
                self.inputtedUserAttributes = fetchedInputtedUserAttributes
                self.didFetchData = true
            }
            
        } catch {
            await MainActor.run {
                self.isError = true
            }
        }
    }
    
    private func save() async {
        do {
            try await repository.saveInputtedUserAttributes(inputtedUserAttributes)
            print("aaa")
        } catch {
            Task { @MainActor in
                self.isError = true
            }
        }
    }
}

```

---

## 🤖 Assistant
*2023-05-26 05:10:01*

確かに、`didFetchData` を @Published とすることで、他の View などからこのフラグの変化を監視することが可能になります。しかし、このフラグが View に公開されることで、Presenter の内部状態が外部に漏れる可能性があります。このような内部状態は通常、Presenter や ViewModel の外部からはアクセスしないようにするべきです。

それに加えて、このコードでは `didFetchData` が主に内部ロジックで使用され、その状態変化が UI の更新に直接関与していないように見受けられます。そのため、このフラグを @Published とする恩恵は限定的であると思われます。

そのため、`didFetchData` を @Published として公開する必要は特にないと思います。しかし、どのように設計するかは、アプリ全体の設計方針やその他の要件にも左右されますので、それらも考慮に入れて判断を行ってください。

---
