# Improving Documentation Structure

日付: 2024-04-24

---

## 👤 ユーザー
*2024/04/24 16:04:08*

段落の構成だったりに違和感があれば教えてほしい。

gifではアニメーションでこれから紹介するサンプルコードで作成されるアプリなんだけどそれを説明する文章が必要かもしれない。

```
## Architecture Detail

FIA の実装における詳細なアーキテクチャは以下の図に示されています。

<div align="center">
<img src="./assets/drawio/architecture_detail.drawio.svg"/>
</div>

この図に示されている構成は一例に過ぎず、プロジェクトの要件に応じてカスタマイズが可能です。また、実際にこれから紹介するコードは、このリポジトリのコードを一部改変したものですが、基本的な構成は同じです。

### Sample App

<div align="center">
<img src="./assets/animations/demo.gif" width="240">
</div>

### Sample Code

<details><summary>Package.swift</summary>

#### Package.swift

```swift
let package = Package(
    // ... omitted ...
    dependencies: [
        // sample third party library
        .package(url: "https://github.com/maiyama18/LicensesPlugin", from: "0.1.6"),
    ],
    targets: [
        .target(
            name: "DependencyInjectionLayer",
            dependencies: ["FrameworkLayer", "PresentationLayer"]
        ),
        .target(
            name: "DomainLayer"
        ),
        .target(
            name: "FrameworkLayer",
            dependencies: ["DomainLayer"],
            plugins: [.plugin(name: "LicensesPlugin", package: "LicensesPlugin")]
        ),
        .target(
            name: "PresentationLayer",
            dependencies: ["DomainLayer"]
        )
    ]
)
```

#### Dependency Diagram

```mermaid
graph TD;
    DependencyInjectionLayer--&gt;FrameworkLayer;
    DependencyInjectionLayer--&gt;PresentationLayer;
    PresentationLayer--&gt;DomainLayer;
    FrameworkLayer--&gt;DomainLayer;
    FrameworkLayer--&gt;LicensesPlugin;
```

</details>

<details><summary>Domain layer</summary>

#### Entity

```swift
public struct License: Identifiable, Equatable {
    public let id: String
    public let name: String
    public let body: String
    
    public init(id: String, name: String, body: String) {
        self.id = id
        self.name = name
        self.body = body
    }
}
```

#### Driver Protocol

```swift
public protocol LicenseDriverProtocol {
    func getLicenses() -&gt; [License]
}
```

</details>

<details><summary>Presentation layer</summary>

#### View

```swift
public struct LicenseListView&lt;DIContainer: DIContainerDependency&gt;: View {
    private let diContainer: DIContainer
    @State private var presenter: LicenseListPresenter&lt;DIContainer&gt;

    public init(diContainer: DIContainer) {
        self.diContainer = diContainer
        presenter = LicenseListPresenter(diContainer: diContainer)
    }
    
    public var body: some View {
        List {
            ForEach(presenter.licenses) { license in
                Button {
                    presenter.onTapLicense(license)
                } label: {
                    Text(license.name)
                }
            }
        }
        .navigationTitle("Licenses")
        .sheet(item: $presenter.selectedLicense, content: { license in
            NavigationStack {
                ScrollView {
                    Text(license.body).padding()
                }
                .navigationTitle(license.name)
            }
        })
        .onAppear {
            presenter.onAppear()
        }
    }
}
```

#### Presenter Dependency

```swift
public protocol LicenseListPresenterDependency {
    associatedtype LicenseDriverProtocolAssocType: LicenseDriverProtocol

    var licenseDriver: LicenseDriverProtocolAssocType { get }
}
```

#### Presenter

```swift
@Observable
final class LicenseListPresenter&lt;DIContainer: LicenseListPresenterDependency&gt; {
    private(set) var licenses: [License] = []
    var selectedLicense: License?
    
    private let diContainer: DIContainer
    
    init(diContainer: DIContainer) {
        self.diContainer = diContainer
    }

    func onAppear() {
        licenses = diContainer.licenseDriver.getLicenses()
    }

    func onTapLicense(_ license: License) {
        selectedLicense = license
    }
}
```

#### DI Container Dependency

```swift
public protocol DIContainerDependency: LicenseListPresenterDependency {}
```

#### Mock DI Container

```swift
public final class MockDIContainer&lt;LicenseDriver: LicenseDriverProtocol&gt;: DIContainerDependency {
    public let licenseDriver: LicenseDriver
    
    public init(licenseDriver: LicenseDriver = MockLicenseDriver(getLicenses: [
        License(id: UUID().uuidString, name: "Sample License 1", body: "Sample License Body 1"),
        License(id: UUID().uuidString, name: "Sample License 2", body: "Sample License Body 2"),
        License(id: UUID().uuidString, name: "Sample License 3", body: "Sample License Body 3"),
    ])) {
        self.licenseDriver = licenseDriver
    }
}

public final class MockLicenseDriver: LicenseDriverProtocol {
    private let _getLicenses: [License]
    
    public init(getLicenses: [License] = []) {
        self._getLicenses = getLicenses
    }

    public func getLicenses() -&gt; [License] {
        return _getLicenses
    }
}
```

</details>

<details><summary>Framework Layer</summary>

#### Driver

```swift
public class LicenseDriver: LicenseDriverProtocol {
    public init() {}
    
    public func getLicenses() -&gt; [DomainLayer.License] {
        LicensesPlugin.licenses.map { library in
            License(from: library)
        }
    }
}

extension DomainLayer.License {
    // Convert Framework Entity to Domain Entity 
    init(from licensesPluginLicense: LicensesPlugin.License) {
        self.init(id: licensesPluginLicense.id, name: licensesPluginLicense.name, body: licensesPluginLicense.licenseText ?? "")
    }
}
```

※ UseCase, Interactor は Presenter での複雑な処理をまとめる用途で用いられます。今回のケースでは UseCase, Interactor は採用していないため、[こちら](https://github.com/suguruTakahashi-1234/framework-independent-architecture)のより実践的なサンプルプロジェクトで確認してください。

</details>

<details><summary>DI Layer</summary>

#### DI Container

```swift
public final class DIContainer&lt;LicenseDriver: LicenseDriverProtocol&gt;: DIContainerDependency {
    public let licenseDriver: LicenseDriver
    
    public init(licenseDriver: LicenseDriver = FrameworkLayer.LicenseDriver()) {
        self.licenseDriver = licenseDriver
    }
}
```

</details>

<details><summary>Application layer (Entry Point)</summary>

#### Development App

```swift
@main
struct DevelopmentApp: App {
    var body: some Scene {
        WindowGroup {
            NavigationStack {
                // Mock DI Container
                LicenseListView(diContainer: MockDIContainer())
            }
        }
    }
}
```

#### Production App

```swift
@main
struct ProductionApp: App {
    var body: some Scene {
        WindowGroup {
            NavigationStack {
                // Actual DI Container
                LicenseListView(diContainer: DIContainer())
            }
        }
    }
}
```

</details>

```

---

## 🤖 アシスタント
*2024/04/24 16:05:00*

全体的には、章の内容と構造が明確で整理されていますが、いくつかの改善点があります。以下、段落構成や説明に関しての提案です：

1. **アーキテクチャの詳細**:
    - 「FIA の実装における詳細なアーキテクチャは以下の図に示されています。」の前に、FIAが何を意味するのか、またそれがどのような問題を解決するのかについての簡潔な説明を追加すると良いでしょう。これにより、読者が図を見る前に文脈を理解するのに役立ちます。

2. **サンプルアプリの説明**:
    - 「Sample App」のセクションに、GIFを通して示されるアプリの簡潔な説明を追加すると良いでしょう。たとえば、「以下のGIFは、本章で紹介するサンプルコードによって作成されたアプリケーションのデモです。このアプリは、ライセンス情報を表示するシンプルなリストビューを提供します。」のような説明が適切です。

3. **コードの説明**:
    - 各コードブロックの前に短い説明を追加すると、コードの目的やその部分が何を達成するためにあるのかが明確になります。たとえば、`Package.swift`の詳細を説明する前に、「こちらの`Package.swift`ファイルは、プロジェクトの依存関係とターゲットを定義しています。」のような一文を追加すると良いでしょう。

4. **依存関係図**:
    - 「Dependency Diagram」セクションにおいて、MermaidJSの図を用いるのは良いアプローチですが、図の簡潔な説明を追加して、何を示しているのかを明確にすると良いでしょう。

これらの点を改善することで、文書の流れがよりスムーズになり、読者が提供される情報をより容易に理解できるようになります。

---
