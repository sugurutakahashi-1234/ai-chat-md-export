# SwiftUI MVVM API Pagination

日付: 2024-09-23

---

## 👤 ユーザー
*2024/9/23 9:34:20*

swiftのMVVMでAPIをコールしたいがlist形式で下までスクロールすると追加読み込みをする

APIはカーソルページネーションの思想で設計されている

実装例を教えて欲しい

なるべくiOS16以上の新しい機能を使って欲しい

---

## 🤖 アシスタント
*2024/9/23 9:35:14*

SwiftUIのMVVMでカーソルページネーションを使用したAPIコールを行い、スクロールした際に追加データを読み込む実装例を紹介します。ここでは、iOS 16以上の新しい機能も活用します。

### 概要
- ViewModelがAPIを呼び出してデータを管理し、カーソルを使用してページネーションを行う。
- スクロール時に下部に達すると、追加データを読み込む。
- `@Environment(\.isPresented)`や`Task`を活用し、APIの非同期コールを管理。

### 1. API レスポンスモデル
カーソルページネーションをサポートするAPIのレスポンスを想定したデータモデル。

```swift
struct PaginatedResponse<T: Decodable>: Decodable {
    let data: [T]
    let cursor: String?
}

struct Item: Identifiable, Decodable {
    let id: String
    let title: String
}
```

### 2. ViewModel の実装
- `@Published`を使ってデータの変更をViewに通知。
- カーソルを使って次のページをリクエストする。
- `Task`で非同期処理を行う。

```swift
import SwiftUI
import Combine

@MainActor
class ItemListViewModel: ObservableObject {
    @Published var items: [Item] = []
    @Published var isLoading = false
    @Published var hasMore = true
    
    private var cursor: String?
    
    func fetchItems() async {
        guard !isLoading, hasMore else { return }
        isLoading = true
        
        do {
            let response = try await loadItems(cursor: cursor)
            items.append(contentsOf: response.data)
            cursor = response.cursor
            hasMore = response.cursor != nil
        } catch {
            // エラーハンドリング
            print("Failed to load items:", error)
        }
        
        isLoading = false
    }
    
    private func loadItems(cursor: String?) async throws -> PaginatedResponse<Item> {
        // APIリクエストを非同期で行う
        let urlString = "https://example.com/api/items?cursor=\(cursor ?? "")"
        guard let url = URL(string: urlString) else {
            throw URLError(.badURL)
        }
        
        let (data, _) = try await URLSession.shared.data(from: url)
        return try JSONDecoder().decode(PaginatedResponse<Item>.self, from: data)
    }
}
```

### 3. View の実装
`onAppear`や`onScrollToEnd`で追加読み込みを行います。`LazyVStack`でリストを表示し、リストの一番下に到達した際に次のデータを読み込みます。

```swift
struct ItemListView: View {
    @StateObject private var viewModel = ItemListViewModel()
    
    var body: some View {
        ScrollView {
            LazyVStack {
                ForEach(viewModel.items) { item in
                    Text(item.title)
                        .padding()
                }
                
                if viewModel.isLoading {
                    ProgressView()
                }
            }
            .onAppear {
                Task {
                    await viewModel.fetchItems()
                }
            }
            .onScrollToEnd {
                Task {
                    await viewModel.fetchItems()
                }
            }
        }
    }
}

// スクロールして一番下に到達したときに呼び出すModifier
struct ScrollEndModifier: ViewModifier {
    let onEnd: () -> Void
    
    func body(content: Content) -> some View {
        GeometryReader { proxy in
            content
                .background(
                    GeometryReader { innerProxy in
                        Color.clear.onAppear {
                            let frame = proxy.frame(in: .global)
                            let bottomThreshold = innerProxy.frame(in: .global).maxY - frame.maxY
                            if bottomThreshold < 50 {
                                onEnd()
                            }
                        }
                    }
                )
        }
    }
}

extension View {
    func onScrollToEnd(perform: @escaping () -> Void) -> some View {
        modifier(ScrollEndModifier(onEnd: perform))
    }
}
```

### ポイント
1. **Task**: `iOS 15`以降で利用できる非同期処理のための`Task`を使い、`async/await`でAPIを呼び出しています。
2. **onScrollToEnd**: スクロールが終端に達したときに、追加データを読み込むカスタムModifierを作成しました。
3. **LazyVStack**: `LazyVStack`を使ってリストを表示し、効率的に要素をロードしています。
4. **isLoading**: 読み込み中に`ProgressView`を表示し、ユーザーにフィードバックを提供。

このように、SwiftUIの新しい機能を使ってシンプルかつ効率的にスクロールによるデータの追加読み込みを実装できます。

---

## 👤 ユーザー
*2024/9/23 9:37:02*

View側でTaskを使いたくないViewModel側でTaskを使ってほしい

UseCaseを作ってカーソルをViewModel側で意識したくない

---

## 🤖 アシスタント
*2024/9/23 9:37:44*

User prefers to handle `Task` in the ViewModel instead of the View and wants to implement a `UseCase` so that the ViewModel doesn't need to be aware of pagination cursors.

---

## 🔧 ツール
*2024/9/23 9:37:44*

Model set context updated.

---

## 🤖 アシスタント
*2024/9/23 9:37:44*

了解しました。それでは、`UseCase`を使ってカーソルの管理を抽象化し、`ViewModel`側では直接カーソルを意識しない設計に変更します。`Task`も`ViewModel`内で処理するようにします。

### 1. UseCaseの実装
`UseCase`は、API呼び出しとページネーションのカーソル管理を抽象化します。

```swift
protocol ItemFetchingUseCaseProtocol {
    func fetchItems(cursor: String?) async throws -> PaginatedResponse<Item>
}

class ItemFetchingUseCase: ItemFetchingUseCaseProtocol {
    func fetchItems(cursor: String?) async throws -> PaginatedResponse<Item> {
        let urlString = "https://example.com/api/items?cursor=\(cursor ?? "")"
        guard let url = URL(string: urlString) else {
            throw URLError(.badURL)
        }
        
        let (data, _) = try await URLSession.shared.data(from: url)
        return try JSONDecoder().decode(PaginatedResponse<Item>.self, from: data)
    }
}
```

### 2. ViewModelの実装
`ViewModel`では、`UseCase`を利用してデータを取得し、`Task`で非同期処理を実行します。`ViewModel`はカーソルに依存せず、UseCaseがページネーションを管理します。

```swift
import SwiftUI

@MainActor
class ItemListViewModel: ObservableObject {
    @Published var items: [Item] = []
    @Published var isLoading = false
    @Published var hasMore = true
    
    private let useCase: ItemFetchingUseCaseProtocol
    private var cursor: String?
    
    init(useCase: ItemFetchingUseCaseProtocol = ItemFetchingUseCase()) {
        self.useCase = useCase
    }
    
    func fetchItems() {
        guard !isLoading, hasMore else { return }
        
        isLoading = true
        Task {
            do {
                let response = try await useCase.fetchItems(cursor: cursor)
                items.append(contentsOf: response.data)
                cursor = response.cursor
                hasMore = response.cursor != nil
            } catch {
                print("Failed to load items:", error)
            }
            isLoading = false
        }
    }
}
```

### 3. Viewの実装
View側では、`Task`を直接使わず、`ViewModel`のメソッドを呼び出すだけで追加読み込みが実行されるようにします。

```swift
struct ItemListView: View {
    @StateObject private var viewModel = ItemListViewModel()
    
    var body: some View {
        ScrollView {
            LazyVStack {
                ForEach(viewModel.items) { item in
                    Text(item.title)
                        .padding()
                }
                
                if viewModel.isLoading {
                    ProgressView()
                }
            }
            .onAppear {
                viewModel.fetchItems() // 初回読み込み
            }
            .onScrollToEnd {
                viewModel.fetchItems() // 追加読み込み
            }
        }
    }
}
```

### ポイント
- **UseCase**: `ItemFetchingUseCase`はAPIコールやカーソルの管理を担当し、`ViewModel`側では直接カーソルを意識しない設計です。
- **Taskの管理**: `Task`は`ViewModel`内で管理し、`View`は非同期処理を意識せず`ViewModel`のメソッドを呼び出すだけです。
- **抽象化**: `UseCase`を使うことで、将来的にAPIの実装やページネーションの方法が変わっても、`ViewModel`には影響がない柔軟な設計です。

これにより、`View`はシンプルに保ちつつ、`ViewModel`での非同期処理やページネーションも抽象化された形で管理できます。

---

## 👤 ユーザー
*2024/9/23 9:37:51*

カーソルをViewModelで保持しないようにしてほしい

---

## 🤖 アシスタント
*2024/9/23 9:38:49*

カーソルを`ViewModel`で保持せず、`UseCase`側でページネーションに関するロジックをすべて管理するように変更します。`ViewModel`は、ページネーションの詳細を一切意識せず、データ取得の処理のみを行います。

### 1. UseCaseの改良
カーソルを`UseCase`で内部的に管理し、`ViewModel`からはカーソルを意識しない実装にします。`fetchNextPage`メソッドは、次のページをフェッチするために呼び出します。

```swift
protocol ItemFetchingUseCaseProtocol {
    func fetchNextPage() async throws -> [Item]
    var hasMore: Bool { get }
}

class ItemFetchingUseCase: ItemFetchingUseCaseProtocol {
    private var cursor: String?
    private(set) var hasMore: Bool = true
    
    func fetchNextPage() async throws -> [Item] {
        guard hasMore else { return [] }
        
        let urlString = "https://example.com/api/items?cursor=\(cursor ?? "")"
        guard let url = URL(string: urlString) else {
            throw URLError(.badURL)
        }
        
        let (data, _) = try await URLSession.shared.data(from: url)
        let response = try JSONDecoder().decode(PaginatedResponse<Item>.self, from: data)
        
        cursor = response.cursor
        hasMore = response.cursor != nil
        return response.data
    }
}
```

### 2. ViewModelの改良
`ViewModel`側では、`UseCase`を利用してデータを取得しますが、カーソルやページネーションのロジックには一切関与しません。`ViewModel`は`UseCase`がページネーションを管理しているため、ただデータをフェッチする役割を持つだけです。

```swift
import SwiftUI

@MainActor
class ItemListViewModel: ObservableObject {
    @Published var items: [Item] = []
    @Published var isLoading = false
    @Published var hasMore = true
    
    private let useCase: ItemFetchingUseCaseProtocol
    
    init(useCase: ItemFetchingUseCaseProtocol = ItemFetchingUseCase()) {
        self.useCase = useCase
    }
    
    func fetchItems() {
        guard !isLoading, hasMore else { return }
        
        isLoading = true
        Task {
            do {
                let newItems = try await useCase.fetchNextPage()
                items.append(contentsOf: newItems)
                hasMore = useCase.hasMore
            } catch {
                print("Failed to load items:", error)
            }
            isLoading = false
        }
    }
}
```

### 3. Viewの実装
View側では、`ViewModel`のメソッドを呼び出すだけで動作します。ページネーションやカーソルに関しては完全に隠蔽され、シンプルにデータ取得と表示を行うことができます。

```swift
struct ItemListView: View {
    @StateObject private var viewModel = ItemListViewModel()
    
    var body: some View {
        ScrollView {
            LazyVStack {
                ForEach(viewModel.items) { item in
                    Text(item.title)
                        .padding()
                }
                
                if viewModel.isLoading {
                    ProgressView()
                }
            }
            .onAppear {
                viewModel.fetchItems() // 初回読み込み
            }
            .onScrollToEnd {
                viewModel.fetchItems() // 追加読み込み
            }
        }
    }
}
```

### ポイント
1. **UseCaseがページネーションを管理**: `UseCase`でカーソルと`hasMore`を管理するため、`ViewModel`はその詳細を意識しません。
2. **Taskの利用**: `Task`を`ViewModel`内で使うことで、非同期処理がスムーズに行われます。
3. **Viewはシンプル**: `View`は`ViewModel`に依存してデータを取得し、ページネーションや追加読み込みを意識する必要がありません。

これにより、`ViewModel`はデータ取得だけに集中でき、`UseCase`がページネーションの管理を全て引き受けるシンプルで拡張性の高い設計になります。

---

## 👤 ユーザー
*2024/9/23 11:24:24*

hasMoreもUseCase側に隠蔽できないか？

---

## 🤖 アシスタント
*2024/9/23 11:25:24*

User prefers to hide `hasMore` in the UseCase as well.

---

## 🔧 ツール
*2024/9/23 11:25:24*

Model set context updated.

---

## 🤖 アシスタント
*2024/9/23 11:25:24*

`hasMore`も`UseCase`側に隠蔽し、`ViewModel`は完全にページネーションやカーソルの管理から解放されるように実装を改良します。これにより、`ViewModel`は単純にデータ取得をトリガーする役割に集中できます。

### 1. UseCaseの実装
`UseCase`が`hasMore`や`cursor`を内部で管理し、`ViewModel`はデータが取得できなくなるまで`UseCase`の`fetchNextPage`を呼び出すだけです。

```swift
protocol ItemFetchingUseCaseProtocol {
    func fetchNextPage() async throws -> [Item]?
}

class ItemFetchingUseCase: ItemFetchingUseCaseProtocol {
    private var cursor: String?
    private var hasMore: Bool = true
    
    func fetchNextPage() async throws -> [Item]? {
        guard hasMore else { return nil }
        
        let urlString = "https://example.com/api/items?cursor=\(cursor ?? "")"
        guard let url = URL(string: urlString) else {
            throw URLError(.badURL)
        }
        
        let (data, _) = try await URLSession.shared.data(from: url)
        let response = try JSONDecoder().decode(PaginatedResponse<Item>.self, from: data)
        
        cursor = response.cursor
        hasMore = response.cursor != nil
        return response.data
    }
}
```

### 2. ViewModelの改良
`ViewModel`は、データの取得だけに集中し、`UseCase`がページネーションの詳細をすべて隠蔽します。`fetchItems`メソッドは、`UseCase`からデータを取得し、`nil`が返ってきたら追加データがないと判断します。

```swift
import SwiftUI

@MainActor
class ItemListViewModel: ObservableObject {
    @Published var items: [Item] = []
    @Published var isLoading = false
    
    private let useCase: ItemFetchingUseCaseProtocol
    
    init(useCase: ItemFetchingUseCaseProtocol = ItemFetchingUseCase()) {
        self.useCase = useCase
    }
    
    func fetchItems() {
        guard !isLoading else { return }
        
        isLoading = true
        Task {
            do {
                if let newItems = try await useCase.fetchNextPage() {
                    items.append(contentsOf: newItems)
                }
            } catch {
                print("Failed to load items:", error)
            }
            isLoading = false
        }
    }
}
```

### 3. Viewの実装
View側では、これまでと同様にシンプルにデータ取得を行い、スクロール時に追加データを読み込む処理を実行します。

```swift
struct ItemListView: View {
    @StateObject private var viewModel = ItemListViewModel()
    
    var body: some View {
        ScrollView {
            LazyVStack {
                ForEach(viewModel.items) { item in
                    Text(item.title)
                        .padding()
                }
                
                if viewModel.isLoading {
                    ProgressView()
                }
            }
            .onAppear {
                viewModel.fetchItems() // 初回読み込み
            }
            .onScrollToEnd {
                viewModel.fetchItems() // 追加読み込み
            }
        }
    }
}
```

### ポイント
- **完全な抽象化**: `UseCase`が`cursor`と`hasMore`の管理を内部で行い、`ViewModel`はデータの取得のみを担当します。
- **簡素化された`ViewModel`**: `ViewModel`はページネーションの状態を一切気にすることなく、`UseCase`が提供するデータに依存するだけです。
- **nilを使った終了判定**: `UseCase`が`nil`を返すことで、データの終了を示します。

このようにすることで、`ViewModel`はシンプルで、`UseCase`が内部で全てのページネーションを処理する設計となり、保守性と拡張性が向上します。

---
