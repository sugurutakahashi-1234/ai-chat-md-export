# Enum para nombres de escenarios.

日付: 2024-02-20

---

## 👤 ユーザー
*2024/02/20 15:33:26*

シナリオ名をenumで定義したい。struct Scenarioはライブラリ製なので直接変更はできません。

struct LicenseListScenarios: ScenarioProvider {
    static func addScenarios(into playbook: Playbook) {
        playbook.addScenarios(of: "LicenseList") {
            Scenario("S", layout: .fill) {
                LicenseListView(router: UICatalogRouter.shared, dependency: StubDependencyInjector.sizeS)
            }

            Scenario("M", layout: .fill) {
                LicenseListView(router: UICatalogRouter.shared, dependency: StubDependencyInjector.sizeM)
            }

            Scenario("L", layout: .fill) {
                LicenseListView(router: UICatalogRouter.shared, dependency: StubDependencyInjector.sizeL)
            }
            
            Scenario("E", layout: .fill) {
                LicenseListView(router: UICatalogRouter.shared, dependency: StubDependencyInjector.empty)
            }
        }
    }
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

---

## 🤖 アシスタント
*2024/02/20 15:34:02*

シナリオ名を`enum`で定義するには、`ScenarioName`を文字列ではなく、`enum`の値として使用する方法を検討する必要があります。ただし、`Scenario`構造体はライブラリに含まれているため直接変更することはできませんが、`ScenarioName`を`enum`として扱うためには、間接的な方法を用いることができます。

以下に示すのは、`enum`を使用してシナリオ名を定義し、その値を`Scenario`の初期化に渡す方法の一例です。この方法では、シナリオ名を管理しやすくするために`enum`を使用し、`Scenario`の`name`パラメータには`enum`の`rawValue`（文字列型）を渡します。

```swift
enum LicenseListScenarioName: String {
    case small = "S"
    case medium = "M"
    case large = "L"
    case empty = "E"
}

struct LicenseListScenarios: ScenarioProvider {
    static func addScenarios(into playbook: Playbook) {
        playbook.addScenarios(of: "LicenseList") {
            Scenario(LicenseListScenarioName.small.rawValue, layout: .fill) {
                LicenseListView(router: UICatalogRouter.shared, dependency: StubDependencyInjector.sizeS)
            }

            Scenario(LicenseListScenarioName.medium.rawValue, layout: .fill) {
                LicenseListView(router: UICatalogRouter.shared, dependency: StubDependencyInjector.sizeM)
            }

            Scenario(LicenseListScenarioName.large.rawValue, layout: .fill) {
                LicenseListView(router: UICatalogRouter.shared, dependency: StubDependencyInjector.sizeL)
            }
            
            Scenario(LicenseListScenarioName.empty.rawValue, layout: .fill) {
                LicenseListView(router: UICatalogRouter.shared, dependency: StubDependencyInjector.empty)
            }
        }
    }
}
```

この方法により、`ScenarioName`を直接変更することなく、シナリオ名を`enum`で管理することができます。`enum`を使用することで、シナリオ名の値を型安全に管理し、コードの可読性と保守性を向上させることができます。

---

## 👤 ユーザー
*2024/02/20 15:34:30*

Scenarioのイニシャライザを増やす方法はないのか？LicenseListScenarioNameではなくて、ScenarioTypeとしてほしい。

---

## 🤖 アシスタント
*2024/02/20 15:35:18*

`Scenario`のイニシャライザを直接変更することはできませんが、`Scenario`の機能を拡張して、`enum`でシナリオタイプを指定できるようなイニシャライザを追加することは可能です。この方法では、拡張機能を使用して既存の`Scenario`構造体に新しいイニシャライザを追加し、`enum`で定義されたシナリオタイプを直接使用できるようにします。

以下の例では、`ScenarioType`という`enum`を定義し、`Scenario`構造体を拡張して、この`enum`を使用する新しいイニシャライザを追加します。これにより、`Scenario`の作成時に`ScenarioType`を直接渡すことができ、コードの可読性と保守性が向上します。

```swift
// ScenarioTypeを定義
enum ScenarioType: String {
    case small = "S"
    case medium = "M"
    case large = "L"
    case empty = "E"
}

// Scenario構造体を拡張して、ScenarioTypeを受け入れるイニシャライザを追加
extension Scenario {
    init(
        _ type: ScenarioType,
        layout: ScenarioLayout,
        file: StaticString = #file,
        line: UInt = #line,
        content: @escaping (ScenarioContext) -> ScenarioContent
    ) {
        self.init(
            type.rawValue,
            layout: layout,
            file: file,
            line: line,
            content: content
        )
    }
}

// LicenseListScenariosを定義
struct LicenseListScenarios: ScenarioProvider {
    static func addScenarios(into playbook: Playbook) {
        playbook.addScenarios(of: "LicenseList") {
            Scenario(ScenarioType.small, layout: .fill) {
                LicenseListView(router: UICatalogRouter.shared, dependency: StubDependencyInjector.sizeS)
            }

            Scenario(ScenarioType.medium, layout: .fill) {
                LicenseListView(router: UICatalogRouter.shared, dependency: StubDependencyInjector.sizeM)
            }

            Scenario(ScenarioType.large, layout: .fill) {
                LicenseListView(router: UICatalogRouter.shared, dependency: StubDependencyInjector.sizeL)
            }
            
            Scenario(ScenarioType.empty, layout: .fill) {
                LicenseListView(router: UICatalogRouter.shared, dependency: StubDependencyInjector.empty)
            }
        }
    }
}
```

このアプローチにより、`Scenario`の使用時に`ScenarioType` `enum`を直接利用することで、シナリオ名をより明確に管理し、タイプセーフな方法でシナリオを定義することができます。また、この方法は既存のライブラリを変更せずに、追加機能を実装する良い例です。

---

## 👤 ユーザー
*2024/02/20 15:40:43*

Contextual type for closure argument list expects 1 argument, which cannot be implicitly ignored

Cannot convert value of type 'LicenseListView' to closure result type 'any ScenarioContent'


struct LicenseListScenarios: ScenarioProvider {
    static func addScenarios(into playbook: Playbook) {
        playbook.addScenarios(of: "LicenseList") {
            Scenario(.small, layout: .fill) {
                LicenseListView(router: UICatalogRouter.shared, dependency: StubDependencyInjector.sizeS)
            }

            Scenario(.small, layout: .fill) {
                LicenseListView(router: UICatalogRouter.shared, dependency: StubDependencyInjector.sizeM)
            }

            Scenario(.small, layout: .fill) {
                LicenseListView(router: UICatalogRouter.shared, dependency: StubDependencyInjector.sizeL)
            }
            
            Scenario(.small, layout: .fill) {
                LicenseListView(router: UICatalogRouter.shared, dependency: StubDependencyInjector.empty)
            }
        }
    }
}

// ScenarioTypeを定義
enum ScenarioType: String {
    case small = "S"
    case medium = "M"
    case large = "L"
    case empty = "E"
}

// Scenario構造体を拡張して、ScenarioTypeを受け入れるイニシャライザを追加
extension Scenario {
    init(
        _ type: ScenarioType,
        layout: ScenarioLayout,
        file: StaticString = #file,
        line: UInt = #line,
        content: @escaping (ScenarioContext) -&gt; ScenarioContent
    ) {
        self.init(
            ScenarioName(rawValue: type.rawValue),
            layout: layout,
            file: file,
            line: line,
            content: content
        )
    }
}

---

## 🤖 アシスタント
*2024/02/20 15:42:05*

あなたが直面しているエラーは、主に2つの理由によるものです：

1. **クロージャの引数リストに関するエラー**: Swiftでは、クロージャが引数を必要とする場合、その引数を無視することはできません。`Scenario`の`content`クロージャは`(ScenarioContext) -> ScenarioContent`型であるため、`ScenarioContext`型の引数を受け取り、`ScenarioContent`型の値を返す必要があります。このエラーは、クロージャ内で引数を明示的に扱っていないことに起因します。

2. **型変換エラー**: `LicenseListView`を`ScenarioContent`に直接変換しようとしていますが、これは`ScenarioContent`型が期待する形式と一致しないためです。`ScenarioContent`はおそらくプロトコルまたは基底クラスであり、`LicenseListView`はその要件を満たしていない可能性があります。

これらの問題を解決するには、以下のステップを実行します：

1. **クロージャ内で引数を扱う**: クロージャが`ScenarioContext`型の引数を受け取ることを期待している場合、それを無視せずに適切に扱う必要があります。ただし、この引数を使用しない場合でも、`_`を使用して明示的に無視することができます。

2. **適切な型への変換を保証する**: `LicenseListView`が`ScenarioContent`型として受け入れられるように、必要に応じて型変換を行うか、`LicenseListView`が`ScenarioContent`プロトコルを満たしていることを確認します。これは、`LicenseListView`を拡張するか、`ScenarioContent`プロトコルを実装することで達成できます。

以下は、上記の問題を解決するための修正例です（`LicenseListView`が`ScenarioContent`プロトコルを満たしていることを前提としています）：

```swift
// ScenarioTypeを定義
enum ScenarioType: String {
    case small = "S"
    case medium = "M"
    case large = "L"
    case empty = "E"
}

// Scenario構造体を拡張して、ScenarioTypeを受け入れるイニシャライザを追加
extension Scenario {
    init(
        _ type: ScenarioType,
        layout: ScenarioLayout,
        file: StaticString = #file,
        line: UInt = #line,
        content: @escaping (ScenarioContext) -> ScenarioContent
    ) {
        self.init(
            type.rawValue, 
            layout: layout, 
            file: file, 
            line: line, 
            content: content
        )
    }
}

struct LicenseListScenarios: ScenarioProvider {
    static func addScenarios(into playbook: Playbook) {
        playbook.addScenarios(of: "LicenseList") {
            Scenario(.small, layout: .fill) { _ in // 引数を明示的に無視
                LicenseListView(router: UICatalogRouter.shared, dependency: StubDependencyInjector.sizeS) as ScenarioContent
            }

            // 他のシナリオも同様に修正...
        }
    }
}
```

このコードでは、クロージャ内で`_`を使用して`ScenarioContext`型の引数を明示的に無視しており、`LicenseListView`を`ScenarioContent`型としてキャストすることで型変換の問題を解決しています。ただし、`LicenseListView`が実際に`ScenarioContent`プロトコルを満たしているかどうかは、その実装に依存します。もし`LicenseListView`が`ScenarioContent`を満たしていない場合は、適

---

## 👤 ユーザー
*2024/02/20 16:58:15*

やりたいこととしては、以下の出力を同じにしたいんだ。

struct LicenseListScenarios: ScenarioProvider {
    static func addScenarios(into playbook: Playbook) {
        playbook.addScenarios(of: "LicenseList") {
            Scenario(type: .small, layout: .fill) {
                LicenseListView(router: UICatalogRouter.shared, dependency: StubDependencyInjector.sizeS)
            }

            Scenario(type: .medium, layout: .fill) {
                LicenseListView(router: UICatalogRouter.shared, dependency: StubDependencyInjector.sizeM)
            }

            Scenario(type: .large, layout: .fill) {
                LicenseListView(router: UICatalogRouter.shared, dependency: StubDependencyInjector.sizeL)
            }
            
            Scenario(type: .empty, layout: .fill) {
                LicenseListView(router: UICatalogRouter.shared, dependency: StubDependencyInjector.empty)
            }
        }
        
        playbook.addScenarios {
            Scenario(type: .small, layout: .fill) {
                LicenseListView(router: UICatalogRouter.shared, dependency: StubDependencyInjector.sizeS)
            }

            Scenario(type: .medium, layout: .fill) {
                LicenseListView(router: UICatalogRouter.shared, dependency: StubDependencyInjector.sizeM)
            }

            Scenario(type: .large, layout: .fill) {
                LicenseListView(router: UICatalogRouter.shared, dependency: StubDependencyInjector.sizeL)
            }
            
            Scenario(type: .empty, layout: .fill) {
                LicenseListView(router: UICatalogRouter.shared, dependency: StubDependencyInjector.empty)
            }
        }
    }
}

---

## 🤖 アシスタント
*2024/02/20 16:59:09*

理解しました。あなたが目指しているのは、`Scenario`の初期化時に`type`パラメータを用いて、シナリオタイプを指定しやすくすることのようです。これを実現するためには、`Scenario`の初期化メソッドをオーバーロードし、`ScenarioType`を直接引数として受け取ることができるようにする必要があります。しかし、`Scenario`構造体がライブラリに含まれており、直接変更できないため、`Scenario`を拡張して新しい初期化メソッドを追加することはできません。

その代わりに、`ScenarioType`を引数として受け取り、その`rawValue`を`Scenario`の`name`パラメータに渡すカスタムファクトリメソッドを作成することができます。これにより、期待される出力形式を達成しつつ、`Scenario`の使用を簡単にします。

以下のコードは、`Scenario`に`type`パラメータを追加するためのカスタムファクトリメソッドの実装例です。

```swift
enum ScenarioType: String {
    case small = "S"
    case medium = "M"
    case large = "L"
    case empty = "E"
}

extension Scenario {
    // ScenarioTypeを受け取るカスタムファクトリメソッド
    static func createScenario(type: ScenarioType, layout: ScenarioLayout, content: @escaping () -> ScenarioContent) -> Scenario {
        return Scenario(type.rawValue, layout: layout, content: content)
    }
}

struct LicenseListScenarios: ScenarioProvider {
    static func addScenarios(into playbook: Playbook) {
        playbook.addScenarios(of: "LicenseList") {
            Scenario.createScenario(type: .small, layout: .fill) {
                LicenseListView(router: UICatalogRouter.shared, dependency: StubDependencyInjector.sizeS)
            }

            Scenario.createScenario(type: .medium, layout: .fill) {
                LicenseListView(router: UICatalogRouter.shared, dependency: StubDependencyInjector.sizeM)
            }

            Scenario.createScenario(type: .large, layout: .fill) {
                LicenseListView(router: UICatalogRouter.shared, dependency: StubDependencyInjector.sizeL)
            }

            Scenario.createScenario(type: .empty, layout: .fill) {
                LicenseListView(router: UICatalogRouter.shared, dependency: StubDependencyInjector.empty)
            }
        }

        // 2番目のplaybook.addScenariosブロックも同様にScenario.createScenarioを使用
    }
}
```

この方法では、`Scenario`の初期化に必要な`name`パラメータに`ScenarioType`の`rawValue`を直接使用することで、目的の出力を達成しています。また、このアプローチにより、`Scenario`の初期化時に`type`パラメータを使うことができ、コードの可読性と使いやすさが向上します。

---
