# Generic License List Presenter

Date: 2024-02-29

---

## 👤 User
*2024-02-29 16:08:35*

public protocol LibraryLicenseDriverProtocol {
    var licenseList: [License] { get }
}


public protocol LicenseListPresenterDependency {
    associatedtype LibraryLicenseDriverProtocolAT: LibraryLicenseDriverProtocol

    var libraryLicenseDriver: LibraryLicenseDriverProtocolAT { get }
}


@MainActor
final class LicenseListPresenter: ObservableObject {
    @Published private(set) var licenseList: [License] = []
    @Published var selectedLicense: License?

    private let libraryLicenseDriver: some LibraryLicenseDriverProtocol

    init(dependency: some LicenseListPresenterDependency) {
        LoggerContainer.initLog()
        libraryLicenseDriver = dependency.libraryLicenseDriver
    }

    deinit {
        LoggerContainer.deinitLog()
    }

    func onAppear() async {
        LoggerContainer.logOnAppear()
        licenseList = libraryLicenseDriver.licenseList
    }

    func onDisappear() {
        LoggerContainer.logOnDisappear()
    }

    func onTapLicense(license: License) {
        selectedLicense = license
    }
}

このとき以下のエラーが発生している。

Error: Property declares an opaque return type, but has no initializer expression from which to infer an underlying type
private let libraryLicenseDriver: some LibraryLicenseDriverProtocol 

Error: Cannot assign value of type '(some LicenseListPresenterDependency).LibraryLicenseDriverProtocolAT' to type 'some LibraryLicenseDriverProtocol'
libraryLicenseDriver = dependency.libraryLicenseDriver

どのように対応すればいいか教えて欲しい。anyは使いたくない。

---

## 🤖 Assistant
*2024-02-29 16:09:35*

Swiftの`some`キーワードは、コンパイル時に具体的な型を持つことを保証するために使用されますが、この場合、`LicenseListPresenter`クラスの`libraryLicenseDriver`プロパティが`some LibraryLicenseDriverProtocol`型で宣言されているため、具体的な型を推論することができません。これは、`some`キーワードが使用される場合、コンパイラがそのプロパティまたは変数の具体的な型を推論できる必要があるためですが、初期化時に依存性注入を通じて与えられる型は実行時まで不明です。

`any`キーワードの使用を避けたいという要望に応えるために、ジェネリクスを使用してこの問題を解決することができます。ジェネリクスを使用することで、`LicenseListPresenter`が任意の`LibraryLicenseDriverProtocol`を実装する型を受け入れられるようになり、かつその具体的な型を保持できるようになります。

以下のように`LicenseListPresenter`クラスをジェネリクスを使用して書き換えることで、この問題を解決できます。

```swift
@MainActor
final class LicenseListPresenter<Driver: LibraryLicenseDriverProtocol>: ObservableObject {
    @Published private(set) var licenseList: [License] = []
    @Published var selectedLicense: License?

    private let libraryLicenseDriver: Driver

    init(dependency: some LicenseListPresenterDependency) where dependency.LibraryLicenseDriverProtocolAT == Driver {
        LoggerContainer.initLog()
        self.libraryLicenseDriver = dependency.libraryLicenseDriver
    }

    deinit {
        LoggerContainer.deinitLog()
    }

    func onAppear() async {
        LoggerContainer.logOnAppear()
        licenseList = libraryLicenseDriver.licenseList
    }

    func onDisappear() {
        LoggerContainer.logOnDisappear()
    }

    func onTapLicense(license: License) {
        selectedLicense = license
    }
}
```

この変更により、`LicenseListPresenter`はジェネリッククラスになり、初期化時に任意の`LibraryLicenseDriverProtocol`を実装する型を受け入れることができます。`init`メソッドの`where`句は、依存性が提供する`LibraryLicenseDriverProtocolAT`型が`LicenseListPresenter`が期待する`Driver`型と一致することを保証します。

このアプローチにより、`any`を使用せずに型の安全性を保ちながら、柔軟性と再利用性を確保することができます。

---

## 👤 User
*2024-02-29 16:10:52*

where dependency.LibraryLicenseDriverProtocolAT == Driverのような指定位置はここであっているのか？

---

## 🤖 Assistant
*2024-02-29 16:11:14*

申し訳ありませんが、私の前の回答には誤りがありました。`init`メソッドのシグネチャに`where`句を直接記述する方法は正しくありませんでした。正確には、`LicenseListPresenter`クラス自体にジェネリック制約を適用する必要があります。`init`メソッドではなく、クラス定義に`where`句を使用して、依存性の型が期待する型と一致することを保証する正しい方法を示します。

以下は、修正されたコードの例です。この例では、`LicenseListPresenter`クラスがジェネリックパラメータ`D`を持ち、この`D`が`LibraryLicenseDriverProtocol`を満たす任意の型であることを示しています。そして、`LicenseListPresenterDependency`プロトコルの`LibraryLicenseDriverProtocolAT`型がこの`D`型と一致することを保証します。

```swift
public protocol LibraryLicenseDriverProtocol {
    var licenseList: [License] { get }
}

public protocol LicenseListPresenterDependency {
    associatedtype LibraryLicenseDriverProtocolAT: LibraryLicenseDriverProtocol
    var libraryLicenseDriver: LibraryLicenseDriverProtocolAT { get }
}

@MainActor
final class LicenseListPresenter<D>: ObservableObject where D: LibraryLicenseDriverProtocol {
    @Published private(set) var licenseList: [License] = []
    @Published var selectedLicense: License?

    private let libraryLicenseDriver: D

    init<T: LicenseListPresenterDependency>(dependency: T) where T.LibraryLicenseDriverProtocolAT == D {
        LoggerContainer.initLog()
        self.libraryLicenseDriver = dependency.libraryLicenseDriver
    }

    deinit {
        LoggerContainer.deinitLog()
    }

    func onAppear() async {
        LoggerContainer.logOnAppear()
        licenseList = libraryLicenseDriver.licenseList
    }

    func onDisappear() {
        LoggerContainer.logOnDisappear()
    }

    func onTapLicense(license: License) {
        selectedLicense = license
    }
}
```

この修正により、`LicenseListPresenter`はジェネリック型`D`を使用しており、この`D`は`LibraryLicenseDriverProtocol`を実装する任意の型である必要があります。`init`メソッドは、`LicenseListPresenterDependency`を実装する任意の型`T`を受け入れ、`T`の`LibraryLicenseDriverProtocolAT`が`D`と一致することを要求します。

この方法で、`LicenseListPresenter`は依存性注入を通じて受け取るライブラリライセンスドライバーの具体的な型を柔軟に扱いつつ、型安全を保持することができます。

---
