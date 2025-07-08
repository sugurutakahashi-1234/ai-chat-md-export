# PreviewSnapshots Configuration Simplification

日付: 2024-02-21

---

## 👤 ユーザー
*2024/2/22 1:08:34*

以下の定義であるとき

public struct PreviewSnapshots&lt;State&gt; {
    /// Array of configurations to apply to the view for preview and snapshot testing.
    public let configurations: [Configuration]
    
    /// Function to configure the `View` being tested given a configuration state.
    public let configure: (State) -&gt; AnyView
    
    /// Create a `PreviewSnapshots` collection.
    ///
    /// - Parameters:
    ///   - configurations: The list of configurations to construct for previews and snapshot testing.
    ///   - configure: A closure that constructs the `View` to be previewed/tested given a configuration state.
    public init&lt;V: View&gt;(
        configurations: [Configuration],
        configure: @escaping (State) -&gt; V
    ) {
        self.configurations = configurations
        self.configure = { AnyView(configure($0)) }
    }
}

public extension PreviewSnapshots {
    /// A single configuration used for preview snapshotting.
    struct Configuration {
        /// The name of the configuration. Should be unique across an instance of `PreviewSnapshots`.
        public let name: String
        /// The state to render.
        public let state: State
        
        /// Create a `PreviewSnapshots.Configuration`.
        ///
        /// - Parameters:
        ///   - name: The name of the configuration.
        ///   - state: The state the configuration should render.
        public init(name: String, state: State) {
            self.name = name
            self.state = state
        }
    }
}

extension PreviewSnapshots.Configuration {
    init(type: PreviewType, state: State) {
        self.init(name: type.name, state: state)
    }
}

package enum PreviewType {
    case small
    case medium
    case large
    case empty
}

package extension PreviewType {
    var name: String {
        switch self {
        case .small:
            "S"
        case .medium:
            "M"
        case .large:
            "L"
        case .empty:
            "Empty"
        }
    }
    
    var di: NonFrameworkDependencyInjector {
        switch self {
        case .small:
            NonFrameworkDependencyInjector.sizeS
        case .medium:
            NonFrameworkDependencyInjector.sizeM
        case .large:
            NonFrameworkDependencyInjector.sizeL
        case .empty:
            NonFrameworkDependencyInjector.empty
        }
    }
}


public struct NonFrameworkDependencyInjector: AppRootRouterDependency {
    public let osLogDriver: OSLogDriverProtocol
    public let firebaseSetupDriver: FirebaseSetupDriverProtocol
    public let libraryLicenseDriver: LibraryLicenseDriverProtocol

    public init(
        osLogDriver: OSLogDriverProtocolMock = OSLogDriverProtocolMock(),
        firebaseSetupDriver: FirebaseSetupDriverProtocolMock = FirebaseSetupDriverProtocolMock(),
        libraryLicenseDriver: LibraryLicenseDriverProtocolMock = LibraryLicenseDriverProtocolMock()
    ) {
        self.osLogDriver = osLogDriver
        self.firebaseSetupDriver = firebaseSetupDriver
        self.libraryLicenseDriver = libraryLicenseDriver
    }

    public static var empty: Self {
        .init()
    }

    public static var random: Self {
        .init(
            libraryLicenseDriver: .init(licenseList: .randoms)
        )
    }
    
    public static var sizeS: Self {
        .init(
            libraryLicenseDriver: .init(licenseList: .multipleSizeS)
        )
    }
    
    public static var sizeM: Self {
        .init(
            libraryLicenseDriver: .init(licenseList: .multipleSizeM)
        )
    }
    
    public static var sizeL: Self {
        .init(
            libraryLicenseDriver: .init(licenseList: .multipleSizeL)
        )
    }
}

このとき


struct LicenseListView_Previews: PreviewProvider {
    static var previews: some View {
        snapshots.previews.previewLayout(.sizeThatFits)
    }

    static var snapshots: PreviewSnapshots&lt;AppRootRouterDependency&gt; {
        .init(
            configurations: [
                .init(type: .small, state: NonFrameworkDependencyInjector.sizeS),
                .init(type: .medium, state: NonFrameworkDependencyInjector.sizeM),
                .init(type: .large, state: NonFrameworkDependencyInjector.sizeL),
            ],
            configure: { state in
                LicenseListView(router: AppRootRouter.empty, dependency: state)
            }
        )
    }
}

を

            configurations: [
                .init(type: .small),
                .init(type: .medium),
                .init(type: .largeL),
            ],

もしくは

            configurations: [
                .init(NonFrameworkDependencyInjector.sizeS),
                .init(NonFrameworkDependencyInjector.sizeM),
                .init( NonFrameworkDependencyInjector.sizeL),
            ],

したい。


どうすればよいかはてな

---

## 🤖 アシスタント
*2024/2/22 1:09:45*

指定された`PreviewSnapshots`とその`Configuration`を初期化する際に、`type`や`NonFrameworkDependencyInjector`のインスタンスのみを使用して`Configuration`を構築する方法を模索しています。この要求を満たすために、`PreviewSnapshots.Configuration`の初期化方法を変更または拡張する必要があります。

現在の`PreviewSnapshots.Configuration`の初期化方法は、`name`と`state`を明示的に受け取ります。提案された変更では、`type`または`NonFrameworkDependencyInjector`のインスタンスから直接`Configuration`を生成することを望んでいます。

以下の2つのソリューションを検討します：

### ソリューション1: `PreviewType`を使用する

`PreviewSnapshots.Configuration`の初期化子を拡張して、`PreviewType`を直接受け取り、その`name`と関連する`NonFrameworkDependencyInjector`のインスタンスを使用して初期化します。

```swift
extension PreviewSnapshots.Configuration {
    init(type: PreviewType) {
        self.init(name: type.name, state: type.di)
    }
}
```

この方法では、`PreviewType`から直接`Configuration`を初期化できます。以下のように使用します：

```swift
configurations: [
    .init(type: .small),
    .init(type: .medium),
    .init(type: .large)
]
```

### ソリューション2: `NonFrameworkDependencyInjector`を使用する

`PreviewSnapshots.Configuration`に別の初期化子を追加して、`NonFrameworkDependencyInjector`のインスタンスを直接受け取ります。ただし、この方法では`name`を自動で設定できないため、別途`name`を決定するロジックが必要です（例: `state`の型に基づく、または`NonFrameworkDependencyInjector`内のプロパティをチェックする）。

```swift
extension PreviewSnapshots.Configuration {
    init(state: State, name: String) {
        self.init(name: name, state: state)
    }
}
```

ただし、`name`を決定する自動的な方法がないため、このアプローチは直接の要求には適合しません。`name`を適切に設定するために追加のロジックが必要です。

### 結論

最も簡単で直接的な方法はソリューション1です。`PreviewType`に基づいて`Configuration`を初期化することで、`type`から直接`name`と`state`を設定できます。これにより、コードをシンプルに保ちながら要求された機能を実装できます。

---

## 👤 ユーザー
*2024/2/22 1:10:23*

extension PreviewSnapshots.Configuration {
    init(type: PreviewType) {
        self.init(name: type.name, state: type.di)
    }
}
だと

Cannot convert value of type 'NonFrameworkDependencyInjector' to expected argument type 'State'

というエラーになった

---

## 🤖 アシスタント
*2024/2/22 1:12:36*

エラーメッセージ「Cannot convert value of type 'NonFrameworkDependencyInjector' to expected argument type 'State'」は、`type.di`が`NonFrameworkDependencyInjector`型を返すが、`state`パラメータとして期待されるのは`State`型であることを示しています。この場合、`State`は`AppRootRouterDependency`プロトコルを実装する型でなければなりません。`NonFrameworkDependencyInjector`はこのプロトコルを実装しているため、問題は型推論に関連している可能性があります。

Swiftコンパイラは、`PreviewSnapshots.Configuration`の初期化子で期待される`state`の型が`State`であることを正しく認識していません。これは、`State`型がジェネリックであり、その具体的な型が`NonFrameworkDependencyInjector`であると明示的に指定されていないために起こり得ます。

解決策として、`PreviewSnapshots`構造体の定義において`State`が`AppRootRouterDependency`に適合することを保証するために、型制約を加えることが考えられます。しかし、コードには既に`State`を`AppRootRouterDependency`の具体的な実装である`NonFrameworkDependencyInjector`に対応させることを試みている箇所が見られます。

問題の根本的な解決には、`PreviewSnapshots`のジェネリック`State`型を適切に扱っていることを確認し、コンパイラが`type.di`の結果を`State`型として受け入れるようにする必要があります。

以下のステップで問題を解決できるかもしれません：

1. **`PreviewSnapshots`の`State`型制約を確認する**: `PreviewSnapshots`で`State`型が`AppRootRouterDependency`に適合していることを保証します。これはジェネリック定義に型制約を追加することで達成できますが、既に`State`を`AppRootRouterDependency`の具体的な実装として使用しているので、このアプローチは適用できないかもしれません。

2. **明示的なキャストを使用する**: コンパイラが自動的に型を推論できない場合は、明示的に型をキャストすることで解決できる場合があります。ただし、このケースでは`type.di`が既に正しい型を返しているので、この方法は必要ありません。

3. **ジェネリック`State`の使用を再評価する**: もし`PreviewSnapshots`の`State`が常に`NonFrameworkDependencyInjector`型であるならば、ジェネリックを使用せずに直接この型を指定することで問題を回避できます。

このエラーは、`PreviewSnapshots.Configuration`の初期化子内で`State`型が`NonFrameworkDependencyInjector`に適切にマッピングされていないことに関連しています。提供されたコードスニペットからは、`State`型の全体的な使用方法とコンテキストを完全に理解するのが難しいため、具体的な修正方法を提案するのは難しいです。`PreviewSnapshots`や`Configuration`のジェネリック型を適切に扱い、期待される型に正しくマッピングすることが重要です。

---

## 👤 ユーザー
*2024/2/22 1:12:49*

1番の具体例をあげてほしい。

---

## 🤖 アシスタント
*2024/2/22 1:14:00*

`PreviewSnapshots`の`State`型に対して型制約を設定する方法を示します。この例では、`State`型が`AppRootRouterDependency`プロトコルに適合することを保証します。しかし、あなたのコードベースでは`State`は既に`AppRootRouterDependency`を実装している`NonFrameworkDependencyInjector`のインスタンスとして使用されています。そのため、このアプローチは直接適用可能ではないかもしれませんが、一般的なアイデアは以下のようになります。

### 現在の`PreviewSnapshots`定義

あなたの`PreviewSnapshots`はジェネリック型`State`を使用していますが、型制約が明示的に設定されていません。以下は現在の概要です（具体的な実装の詳細は省略）：

```swift
public struct PreviewSnapshots<State> {
    public let configurations: [Configuration]
    public let configure: (State) -> AnyView

    // ...
}
```

### 型制約を追加する

`State`が`AppRootRouterDependency`プロトコルに適合するように、型制約を追加します。これにより、`State`として使用されるすべての型が`AppRootRouterDependency`プロトコルを実装していることが保証されます。ただし、これは`PreviewSnapshots`の定義に直接適用するのではなく、理論的な例として考えてください。実際には、`PreviewSnapshots`自体やその使用方法を根本的に変更する必要があります。

```swift
public struct PreviewSnapshots<State: AppRootRouterDependency> {
    public let configurations: [Configuration]
    public let configure: (State) -> AnyView

    // ...
}
```

### 例

この型制約を追加した後、`State`として使用されるすべての型は`AppRootRouterDependency`プロトコルを満たす必要があります。これは`PreviewSnapshots`を使用する際に、`State`パラメータとして`NonFrameworkDependencyInjector`のような`AppRootRouterDependency`を実装する具体的な型のみを許可することを意味します。

### 注意

- この変更は`PreviewSnapshots`を使用する際に型安全を強化しますが、既存のコードやその使用方法によっては直接適用できない場合があります。
- 実際には、`PreviewSnapshots.Configuration`の初期化子内で遭遇した具体的な問題（`NonFrameworkDependencyInjector`を`State`型として扱う際の型不一致）を解決するために、ジェネリック`State`の使用方法や初期化子の定義を再検討する必要があります。
- エラーメッセージに対処するには、`State`型が期待されるコンテキストで`NonFrameworkDependencyInjector`型を正しく扱えているかを確認し、必要に応じてコードを調整することが重要です。

---

## 👤 ユーザー
*2024/2/22 1:14:19*

PreviewSnapshots&lt;State: AppRootRouterDependency&gt;専用のextensionはできないのか？

---

## 🤖 アシスタント
*2024/2/22 1:16:12*

Swiftでは、ジェネリック型の拡張において特定の型制約を持つ専用の拡張を定義することができます。これを利用して、`PreviewSnapshots`に`State: AppRootRouterDependency`という型制約を持つ専用の拡張を作成することが可能です。このアプローチは、特定の制約を満たす`State`に対してのみ利用可能なメソッドやプロパティを追加する場合に便利です。

以下に、`State`が`AppRootRouterDependency`プロトコルに適合している場合にのみ利用可能なメソッドやプロパティを追加するための専用の拡張の例を示します。

### `PreviewSnapshots`の型制約を持つ拡張例

```swift
extension PreviewSnapshots where State: AppRootRouterDependency {
    // この拡張内で定義されるメソッドやプロパティは、
    // StateがAppRootRouterDependencyに適合している場合にのみ利用できます。

    // 特定のStateに基づく追加の設定や機能をここに追加できます。
    // 例えば、特定の依存関係を持つConfigurationを簡単に生成するファクトリーメソッドなどです。
    
    /// 特定の依存関係設定を使用してPreviewSnapshotsを初期化する便利なメソッド
    static func createWithCommonConfigurations() -> PreviewSnapshots<State> {
        let configurations = [
            Configuration(name: "Default", state: .default),
            Configuration(name: "Test", state: .test)
        ]
        return PreviewSnapshots(configurations: configurations, configure: { state in
            // ここで、Stateに応じたViewを構成する
        })
    }
}
```

この例では、`State`型が`AppRootRouterDependency`プロトコルに適合する場合に限り、`createWithCommonConfigurations`という新しい静的メソッドを`PreviewSnapshots`に追加しています。これは、特定の依存関係の設定を持つ`PreviewSnapshots`インスタンスを簡単に生成するための便利な方法を提供します。

### 注意点

- この方法は`State`の型がコンパイル時に`AppRootRouterDependency`プロトコルに適合していることが確定している場合にのみ機能します。それ以外の場合、この拡張内のメソッドやプロパティは利用できません。
- 拡張内で使用される`Configuration`の初期化子や`configure`クロージャの実装は、具体的なコードベースや設計に応じて調整する必要があります。

このアプローチを通じて、ジェネリック型に対してより精密な制御を行い、特定の条件下でのみ利用可能な機能を提供することが可能になります。

---

## 👤 ユーザー
*2024/2/22 1:17:10*

イメージなのだが、こういうのはできないのか？

extension PreviewSnapshots.Configuration where State: AppRootRouterDependency {
    init(type: PreviewType) {
        self.init(name: type.name, state: type.di)
    }
}

---

## 🤖 アシスタント
*2024/2/22 1:18:19*

提案されたコードスニペットについて、Swiftの現在の言語機能では直接実装することができません。理由は、`PreviewSnapshots.Configuration`が`PreviewSnapshots`の内部型であるとしても、`PreviewSnapshots.Configuration`自体には`State`型が存在しないためです。`State`は`PreviewSnapshots`構造体のジェネリック型パラメータであり、そのスコープは`PreviewSnapshots`構造体に限定されます。したがって、`PreviewSnapshots.Configuration`型の拡張で`State`型に基づいた条件を指定することはできません。

ただし、あなたが意図している機能は、`PreviewSnapshots.Configuration`の初期化を簡素化し、`PreviewType`を基に自動的に`name`と`state`を設定することです。これを達成するための実現可能なアプローチは、`PreviewSnapshots`のコンテキスト内でヘルパーメソッドまたはファクトリーメソッドを定義することです。

### 代替案: ファクトリーメソッドの利用

`PreviewSnapshots`または`PreviewSnapshots.Configuration`に関連するファクトリーメソッドを定義することで、同様の結果を達成することができます。この方法では、ジェネリックのスコープと型制約の問題を回避し、`PreviewType`を基に`Configuration`インスタンスを簡単に作成できます。

以下は、`PreviewSnapshots`にファクトリーメソッドを追加する例です：

```swift
extension PreviewSnapshots where State: AppRootRouterDependency {
    static func configuration(from type: PreviewType) -> PreviewSnapshots.Configuration {
        return PreviewSnapshots.Configuration(name: type.name, state: type.di as! State)
    }
}
```

このメソッドは`State`が`AppRootRouterDependency`に適合する場合にのみ使用可能です。`type.di`の結果を`State`型にキャストしていますが、このキャストは安全であることが確実な場合にのみ使用してください。不確実な場合は、実行時エラーを避けるために適切なエラーハンドリングを行う必要があります。

### 注意

- 上記のコードは、`type.di`が`State`型に安全にキャストできることを前提としています。これが保証できない場合、より安全なアプローチを検討する必要があります。
- `as!`オペレーターを使用する際は、キャストが失敗するとランタイムエラーが発生するため、使用する際は注意が必要です。

この方法では、直接的には`PreviewSnapshots.Configuration`内でジェネリック型`State`に型制約を適用することはできませんが、`PreviewSnapshots`のコンテキスト内で目的の初期化ロジックを実装することが可能です。

---
