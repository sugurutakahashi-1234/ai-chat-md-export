# Protocol-based ViewModel Design

日付: 2023-06-17

---

## 👤 ユーザー
*2023/6/17 23:10:40*

Swiftで以下のような設計を考えているんだけど、なるべくprotocolの型指定をすることでパフォーマンスを上げたいのだけれどもどう実装すればいい？

// Repository
protocol SomeRepositoryProtocol {}

class SomeRepository: SomeRepositoryProtocol {}

// ViewModels
class FirstViewModel {
    let repository: SomeRepositoryProtocol

    init(repository: SomeRepositoryProtocol) {
        self.repository = repository
    }
}

class SecondViewModel {
    let repository: SomeRepositoryProtocol

    init(repository: SomeRepositoryProtocol) {
        self.repository = repository
    }
}

class ThirdViewModel {
    let repository: SomeRepositoryProtocol

    init(repository: SomeRepositoryProtocol) {
        self.repository = repository
    }
}

// View Destination Protocols
protocol FirstViewDestinationProtocol {
    func createSecondView() -&gt; SecondView
}

protocol SecondViewDestinationProtocol {
    func createThirdView() -&gt; ThirdView
}

// View Factory
class ViewFactory: FirstViewDestinationProtocol, SecondViewDestinationProtocol {
    let repository = SomeRepository()

    func createFirstView() -&gt; FirstView {
        let viewModel = FirstViewModel(repository: repository)
        return FirstView(factory: self, viewModel: viewModel)
    }

    func createSecondView() -&gt; SecondView {
        let viewModel = SecondViewModel(repository: repository)
        return SecondView(factory: self, viewModel: viewModel)
    }

    func createThirdView() -&gt; ThirdView {
        let viewModel = ThirdViewModel(repository: repository)
        return ThirdView(viewModel: viewModel)
    }
}

// Views
struct FirstView: View {
    @State private var isLinkActive = false
    let viewFactory: FirstViewDestinationProtocol
    let viewModel: FirstViewModel

    var body: some View {
        NavigationView {
            Button("Go to SecondView") {
                self.isLinkActive = true
            }
            .background(
                NavigationLink(
                    destination: viewFactory.createSecondView(),
                    isActive: $isLinkActive,
                    label: {
                        EmptyView()
                    }
                )
            )
        }
    }
}

struct SecondView: View {
    @State private var isLinkActive = false
    let viewFactory: SecondViewDestinationProtocol
    let viewModel: SecondViewModel

    var body: some View {
        NavigationView {
            Button("Go to ThirdView") {
                self.isLinkActive = true
            }
            .background(
                NavigationLink(
                    destination: viewFactory.createThirdView(),
                    isActive: $isLinkActive,
                    label: {
                        EmptyView()
                    }
                )
            )
        }
    }
}

struct ThirdView: View {
    let viewModel: ThirdViewModel

    var body: some View {
        // design your view...
        Text("Third View")
    }
}

// Main entry
@main
struct MyApp: App {
    var body: some Scene {
        WindowGroup {
            let factory = ViewFactory()
            factory.createFirstView()
        }
    }
}

// Previews
struct FirstView\_Previews: PreviewProvider {
    static var previews: some View {
        let dummyRepo = DummyRepository()
        let dummyVM = FirstViewModel(repository: dummyRepo)
        return FirstView(viewFactory: DummyFirstViewDestination(), viewModel: dummyVM)
    }

    struct DummyFirstViewDestination: FirstViewDestinationProtocol {
        func createSecondView() -&gt; SecondView {
            let dummyRepo = DummyRepository()
            let dummyVM = SecondViewModel(repository: dummyRepo)
            return SecondView(viewFactory: DummySecondViewDestination(), viewModel: dummyVM)
        }
    }
}

struct SecondView\_Previews: PreviewProvider {
    static var previews: some View {
        let dummyRepo = DummyRepository()
        let dummyVM = SecondViewModel(repository: dummyRepo)
        return SecondView(viewFactory: DummySecondViewDestination(), viewModel: dummyVM)
    }

    struct DummySecondViewDestination: SecondViewDestinationProtocol {
        func createThirdView() -&gt; ThirdView {
            let dummyVM = ThirdViewModel
            return ThirdView(viewModel: dummyVM)
        }
    }
}

---

## 🤖 アシスタント
*2023/6/17 23:11:43*

Swiftにおけるプロトコル指定は、クラスや構造体が実装しなければならない特定のメソッドやプロパティを定義することで、柔軟で再利用可能なコードを書くことが可能になります。ただし、パフォーマンス向上にはそれほど寄与しないかもしれません。Swiftのパフォーマンスは主にアルゴリズムやデータ構造の選択、メモリ管理、非同期処理などに依存します。

それにもかかわらず、プロトコルを利用した設計を適切に行うことで、コードの可読性、保守性、テスト可能性を向上させることができます。

あなたの設計はMVVM (Model-View-ViewModel) パターンに基づいているようで、それぞれのビューモデルがリポジトリとして働くプロトコルに依存しています。これにより、異なるリポジトリの実装をビューモデルに簡単に注入することが可能になり、テスト時にはモックのリポジトリを使用することができます。

また、ビューがプロトコル経由でビューモデルと通信することで、ビューモデルとビューの分離を保証しています。

ただし、`SomeRepositoryProtocol`が空であることは気になります。リポジトリがどのような動作をするべきかを定義するためのメソッドやプロパティが必要です。それによって、具体的なリポジトリクラスがこのプロトコルに従うことを保証することができます。

また、ビューを作成するためのメソッドを持つプロトコル(`FirstViewDestinationProtocol`と`SecondViewDestinationProtocol`)も良い設計と言えます。これにより、ビューの作成方法を抽象化し、異なる種類のビューを作成するための新しいファクトリを簡単に作成することができます。ビューの作成に必要な依存関係を注入することで、ビューが自分自身を作成する必要がなくなり、ビューとビューモデルの関連性をより明確にすることができます。

以上が設計に対する一般的なフィードバックですが、これに対する具体的な改善策や他の具体的な問題があれば、より詳

---

## 🤖 アシスタント
*2023/6/17 23:11:47*

細なフィードバックを提供できます。

---
