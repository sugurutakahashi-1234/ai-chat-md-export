# Dynamic ScenarioKind from ScenarioContent

日付: 2024-02-20

---

## 👤 ユーザー
*2024/2/20 16:54:04*

以下の実装を手伝ってほしい

ここにシナリオのViewの型名が入るようにしてほしい


extension Playbook {
    func addScenarios&lt;S: ScenariosBuildable&gt;(@ScenariosBuilder _ scenarios: () -&gt; S) -&gt; Self {
        self.addScenarios(of: ScenarioKind(rawValue: ここにシナリオのViewの型名が入るようにしてほしい), scenarios)
    }
}

他の定義は以下です。


/// Represents an instance that can build an array of scenarios.
public protocol ScenariosBuildable {
    /// Builds an array of scenarios.
    func buildScenarios() -&gt; [Scenario]
}

extension Scenario: ScenariosBuildable {
    /// Builds an array of scenarios containing only `self`.
    public func buildScenarios() -&gt; [Scenario] { [self] }
}

/// Represents part of the component state.
public struct Scenario {
    /// A unique name of scenario that describes component and its state.
    public var name: ScenarioName

    /// Represents how the component should be laid out.
    public var layout: ScenarioLayout

    /// A file path where defined this scenario.
    public var file: StaticString

    /// A line number where defined this scenario in file.
    public var line: UInt

    /// A closure that make a new content with passed context.
    public var content: (ScenarioContext) -&gt; ScenarioContent

    /// Creates a new scenario.
    ///
    /// - Parameters:
    ///   - name: A unique name of this scenario.
    ///   - layout: Represents how the component should be laid out.
    ///   - file: A file path where defined this scenario.
    ///   - line: A line number where defined this scenario in file.
    ///   - content: A closure that make a new content with passed context.
    public init(
        _ name: ScenarioName,
        layout: ScenarioLayout,
        file: StaticString = #file,
        line: UInt = #line,
        content: @escaping (ScenarioContext) -&gt; ScenarioContent
    ) {
        self.name = name
        self.layout = layout
        self.file = file
        self.line = line
        self.content = content
    }

    /// Creates a new scenario.
    ///
    /// - Parameters:
    ///   - name: A unique name of this scenario.
    ///   - layout: Represents how the component should be laid out.
    ///   - file: A file path where defined this scenario.
    ///   - line: A line number where defined this scenario in file.
    ///   - content: A closure that make a new content.
    public init(
        _ name: ScenarioName,
        layout: ScenarioLayout,
        file: StaticString = #file,
        line: UInt = #line,
        content: @escaping () -&gt; ScenarioContent
    ) {
        self.init(
            name,
            layout: layout,
            file: file,
            line: line,
            content: { _ in content() }
        )
    }
}


/// Represents a content of scenario.
public protocol ScenarioContent {
    /// Makes a new `UIViewController` instance thats wraps `self`.
    func makeUIViewController() -&gt; UIViewController
}

extension UIView: ScenarioContent {
    /// Makes a new `UIViewController` instance thats wraps `self`.
    public func makeUIViewController() -&gt; UIViewController {
        UIViewHostingController(view: self)
    }
}

extension UIViewController: ScenarioContent {
    /// Makes a new `UIViewController` instance thats wraps `self`.
    public func makeUIViewController() -&gt; UIViewController { self }
}

private final class UIViewHostingController: UIViewController {
    private let _view: UIView

    init(view: UIView) {
        self._view = view
        super.init(nibName: nil, bundle: nil)
    }

    @available(*, unavailable)
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override func loadView() {
        view = _view
    }
}

---

## 🤖 アシスタント
*2024/2/20 16:54:55*

このシナリオでは、`Playbook`の拡張機能内で`addScenarios`メソッドを定義し、それを用いて特定の型のシナリオを追加したいと考えています。ただし、その型を動的に指定する方法についての質問があります。提供されたコードを基に、この要件を満たす実装を提案します。

`Scenario`型のインスタンスは、その`content`クロージャを通じて`ScenarioContent`プロトコルに準拠するオブジェクトを生成します。`ScenarioContent`プロトコルは、それ自体を`UIViewController`にラップする能力を持つオブジェクトに適用されます。このプロトコルには`UIView`と`UIViewController`が準拠しています。

要望に応えるには、`Scenario`の`content`が生成する`ScenarioContent`の実際の型に基づいて`ScenarioKind`の値を動的に決定し、それを`addScenarios`メソッドに渡す必要があります。しかし、コードには`ScenarioKind`の定義が含まれていないため、この型が何を表すか、またどのようにしてその値を`ScenarioContent`の型から導出するかについての具体的な情報が不足しています。

代わりに、一般的なアプローチを提案します。`ScenarioContent`の型に基づいて`ScenarioKind`の値を動的に決定する具体的なメカニズムは、`ScenarioKind`の設計に依存しますが、一般的なアイデアは、`Scenario`の`content`から`ScenarioContent`の具体的な型を取得し、それを用いて`ScenarioKind`を決定することです。

```swift
extension Playbook {
    func addScenarios<S: ScenariosBuildable>(@ScenariosBuilder _ scenarios: () -> S) -> Self {
        // ここで ScenarioContent の型に基づいて ScenarioKind を動的に決定するロジックを実装します。
        // 例: `S` から `ScenarioContent` の型を特定し、それに基づいて適切な ScenarioKind を選択します。
        // 注意: 以下は擬似コードです。`S` から直接型情報を抽出する実際の方法は、`ScenarioKind` と `ScenarioContent` の設計に依存します。
        
        let scenarioKind = ScenarioKind(rawValue: "ここに動的に決定されたシナリオのViewの型名が入る")
        self.addScenarios(of: scenarioKind, scenarios)
    }
}
```

このアプローチのキーは、`ScenarioContent`から`ScenarioKind`へのマッピングをどのように定義するかです。もし`ScenarioKind`が`ScenarioContent`の型に基づいて決定される値を持っているなら、その型情報を利用して適切な`ScenarioKind`のインスタンスを生成するロジックを実装する必要があります。

しかし、コードの現状では`ScenarioKind`の具体的な実装や、どのようにして`ScenarioContent`の型から`ScenarioKind`を導出するかについての情報が不足しているため、より具体的なソリューションを提供することは難しいです。`ScenarioKind`の設計と、それを`ScenarioContent`の型にマッピングする方法についての追加情報があれば、より詳細な実装案を提供できるかもしれません。

---
