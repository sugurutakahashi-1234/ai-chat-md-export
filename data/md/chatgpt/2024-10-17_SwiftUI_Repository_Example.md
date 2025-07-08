# SwiftUI Repository Example

日付: 2024-10-17

---

## 👤 ユーザー
*2024/10/17 15:08:22*

playground で両方動かしたい

import SwiftUI

// MARK: - Domain Protocol

protocol HogeViewModelDependency {
    var hogeRepository: HogeRepository { get }
    var mogeRepository: MogeRepository { get }
}

protocol HogeRepository {
    func fetchHello() async throws -&gt; String
}

protocol MogeRepository {
    func fetchWorld() async throws -&gt; String
}

// MARK: - UI

struct HogeView {
    @StateObject private var viewModel: HogeViewModel
    
    init(dependency: HogeViewModelDependency = HogeViewModelDependencyInjectorImpl()) {
        _viewModel = .init(wrappedValue: .init(dependency: dependency))
    }
    
    var body: some View {
        Text("\(viewModel.text)")
            .onAppear {
                viewModel.onAppear()
            }
    }
}

final class HogeViewModel: ObservableObject {
    @Published var text = ""
    private let dependency: HogeViewModelDependency

    init(dependency: HogeViewModelDependency) {
        self.dependency = dependency
    }

    func onAppear() {
        Task {
            do {
                let helloStr = try await dependency.hogeRepository.fetchHello()
                let worldStr = try await dependency.mogeRepository.fetchWorld()
                
                text = "\(helloStr) \(worldStr) !"
            } catch {
                print(error)
            }
        }
    }
}

// MARK: - Repository Impl

class HogeRepositoryImpl: HogeRepository {
    func fetchHello() async throws -&gt; String {
        "Hello"
    }
}

class MogeRepositoryImpl: MogeRepository {
    func fetchWorld() async throws -&gt; String {
        "World"
    }
}

// MARK: - Repository Error

enum AppError: Error {
    case hogeError
}

class HogeRepositoryError: HogeRepository {
    func fetchHello() async throws -&gt; String {
        throw AppError.hogeError
    }
}

class MogeRepositoryError: MogeRepository {
    func fetchWorld() async throws -&gt; String {
        throw AppError.hogeError
    }
}

// MARK: - DI Container

class HogeViewModelDependencyInjectorImpl: HogeViewModelDependency {
    let hogeRepository: HogeRepository = HogeRepositoryImpl()
    let mogeRepository: MogeRepository = MogeRepositoryImpl()
}

class HogeViewModelDependencyInjectorError: HogeViewModelDependency {
    let hogeRepository: HogeRepository = HogeRepositoryError()
    let mogeRepository: MogeRepository = MogeRepositoryError()
}

---

## 🤖 アシスタント
*2024/10/17 15:08:47*

Here's how you can modify your code to work in a Swift Playground by using `HogeView` with either a successful or error-prone repository setup. The key modification is adding a `View` wrapper for testing both scenarios and updating how `HogeView` is called.

```swift
import SwiftUI
import PlaygroundSupport

// MARK: - Domain Protocol

protocol HogeViewModelDependency {
    var hogeRepository: HogeRepository { get }
    var mogeRepository: MogeRepository { get }
}

protocol HogeRepository {
    func fetchHello() async throws -> String
}

protocol MogeRepository {
    func fetchWorld() async throws -> String
}

// MARK: - UI

struct HogeView: View {
    @StateObject private var viewModel: HogeViewModel
    
    init(dependency: HogeViewModelDependency = HogeViewModelDependencyInjectorImpl()) {
        _viewModel = .init(wrappedValue: .init(dependency: dependency))
    }
    
    var body: some View {
        Text("\(viewModel.text)")
            .onAppear {
                viewModel.onAppear()
            }
    }
}

final class HogeViewModel: ObservableObject {
    @Published var text = ""
    private let dependency: HogeViewModelDependency

    init(dependency: HogeViewModelDependency) {
        self.dependency = dependency
    }

    func onAppear() {
        Task {
            do {
                let helloStr = try await dependency.hogeRepository.fetchHello()
                let worldStr = try await dependency.mogeRepository.fetchWorld()
                
                text = "\(helloStr) \(worldStr) !"
            } catch {
                text = "Error fetching data"
                print(error)
            }
        }
    }
}

// MARK: - Repository Impl

class HogeRepositoryImpl: HogeRepository {
    func fetchHello() async throws -> String {
        "Hello"
    }
}

class MogeRepositoryImpl: MogeRepository {
    func fetchWorld() async throws -> String {
        "World"
    }
}

// MARK: - Repository Error

enum AppError: Error {
    case hogeError
}

class HogeRepositoryError: HogeRepository {
    func fetchHello() async throws -> String {
        throw AppError.hogeError
    }
}

class MogeRepositoryError: MogeRepository {
    func fetchWorld() async throws -> String {
        throw AppError.hogeError
    }
}

// MARK: - DI Container

class HogeViewModelDependencyInjectorImpl: HogeViewModelDependency {
    let hogeRepository: HogeRepository = HogeRepositoryImpl()
    let mogeRepository: MogeRepository = MogeRepositoryImpl()
}

class HogeViewModelDependencyInjectorError: HogeViewModelDependency {
    let hogeRepository: HogeRepository = HogeRepositoryError()
    let mogeRepository: MogeRepository = MogeRepositoryError()
}

// MARK: - Playground Setup

struct ContentView: View {
    var body: some View {
        VStack {
            Text("Successful Fetch:")
            HogeView(dependency: HogeViewModelDependencyInjectorImpl())
                .padding()
            
            Text("Error Fetch:")
            HogeView(dependency: HogeViewModelDependencyInjectorError())
                .padding()
        }
    }
}

// Display in playground live view
PlaygroundPage.current.setLiveView(ContentView())
```

### Explanation:
- I added a `ContentView` that contains both the success and error versions of `HogeView` so you can see both outcomes side by side.
- `PlaygroundPage.current.setLiveView(ContentView())` is used to render the SwiftUI view in the Swift Playground's live view.
- When running the playground, you will see the results of both a successful and failed data fetch in `HogeView`.

---
