# Flexible Mock Initialization

日付: 2024-02-29

---

## 👤 ユーザー
*2024/02/29 15:10:30*

このとき、 static func convenienceInit の別の書き方がないか知りたい。


public final class AppRootRouterDependencyMock: AppRootRouterDependency {
    public init() { }
    public init(libraryLicenseDriver: LibraryLicenseDriverProtocolAT, osLogDriver: OSLogDriverProtocolAT, firebaseSetupDriver: FirebaseSetupDriverProtocolAT) {
        self._libraryLicenseDriver = libraryLicenseDriver
        self._osLogDriver = osLogDriver
        self._firebaseSetupDriver = firebaseSetupDriver
    }

    public typealias LibraryLicenseDriverProtocolAT = LibraryLicenseDriverProtocolMock
    public typealias OSLogDriverProtocolAT = OSLogDriverProtocolMock

    public private(set) var libraryLicenseDriverSetCallCount = 0
    private var _libraryLicenseDriver: LibraryLicenseDriverProtocolAT!  { didSet { libraryLicenseDriverSetCallCount += 1 } }
    public var libraryLicenseDriver: LibraryLicenseDriverProtocolAT {
        get { return _libraryLicenseDriver }
        set { _libraryLicenseDriver = newValue }
    }
    public typealias FirebaseSetupDriverProtocolAT = FirebaseSetupDriverProtocolMock

    public private(set) var osLogDriverSetCallCount = 0
    private var _osLogDriver: OSLogDriverProtocolAT!  { didSet { osLogDriverSetCallCount += 1 } }
    public var osLogDriver: OSLogDriverProtocolAT {
        get { return _osLogDriver }
        set { _osLogDriver = newValue }
    }

    public private(set) var firebaseSetupDriverSetCallCount = 0
    private var _firebaseSetupDriver: FirebaseSetupDriverProtocolAT!  { didSet { firebaseSetupDriverSetCallCount += 1 } }
    public var firebaseSetupDriver: FirebaseSetupDriverProtocolAT {
        get { return _firebaseSetupDriver }
        set { _firebaseSetupDriver = newValue }
    }
}


public extension AppRootRouterDependencyMock {
    static func convenienceInit(
        libraryLicenseDriver: some LibraryLicenseDriverProtocolMock = LibraryLicenseDriverProtocolMock(),
        osLogDriver: some OSLogDriverProtocolMock = OSLogDriverProtocolMock(),
        firebaseSetupDriver: some FirebaseSetupDriverProtocolMock = FirebaseSetupDriverProtocolMock()
    ) -&gt; Self {
        .init(
            libraryLicenseDriver: libraryLicenseDriver,
            osLogDriver: osLogDriver,
            firebaseSetupDriver: firebaseSetupDriver
        )
    }
    
    static var empty: Self {
        .init(
            libraryLicenseDriver: LibraryLicenseDriverProtocolMock(),
            osLogDriver: OSLogDriverProtocolMock(),
            firebaseSetupDriver: FirebaseSetupDriverProtocolMock()
        )
    }

    static var random: Self {
        .init(
            libraryLicenseDriver: LibraryLicenseDriverProtocolMock(licenseList: .randoms), osLogDriver: OSLogDriverProtocolMock(),
            firebaseSetupDriver: FirebaseSetupDriverProtocolMock()
        )
    }

    static var sizeS: Self {
        .init(
            libraryLicenseDriver: LibraryLicenseDriverProtocolMock(licenseList: .multipleSizeS), osLogDriver: OSLogDriverProtocolMock(),
            firebaseSetupDriver: FirebaseSetupDriverProtocolMock()
        )
    }

    static var sizeM: Self {
        .init(
            libraryLicenseDriver: LibraryLicenseDriverProtocolMock(licenseList: .multipleSizeM), osLogDriver: OSLogDriverProtocolMock(),
            firebaseSetupDriver: FirebaseSetupDriverProtocolMock()
        )
    }

    static var sizeL: Self {
        .init(
            libraryLicenseDriver: LibraryLicenseDriverProtocolMock(licenseList: .multipleSizeL), osLogDriver: OSLogDriverProtocolMock(),
            firebaseSetupDriver: FirebaseSetupDriverProtocolMock()
        )
    }
}

---

## 👤 ユーザー
*2024/02/29 15:11:57*

やっていることはほとんどinitに近いのでinitをオーバーライドすることはできないのか？

---

## 🤖 アシスタント
*2024/02/29 15:13:13*

Swiftでは、クラスの`init`メソッドをオーバーライドすることは可能ですが、`static`メソッドやクラスファクトリーメソッドをオーバーライドすることはできません。しかし、あなたが示したコードのコンテキストでは、`convenienceInit`という名前の`static`メソッドを提供しており、これはSwiftの言語機能としての`init`オーバーライドとは異なります。`init`メソッドを直接オーバーライドする代わりに、異なるパラメータを持つ複数の`init`メソッドを提供することで、似たような結果を達成できます。

あなたのケースでは、`AppRootRouterDependencyMock`クラスには既に2つの`init`メソッドが定義されています。1つはデフォルトの`init()`で、もう1つは3つの依存関係を受け取るカスタム`init(libraryLicenseDriver:osLogDriver:firebaseSetupDriver:)`です。`convenienceInit`という`static`メソッドは、実質的には便利なファクトリーメソッドとして機能しており、特定のデフォルト値やランダム、サイズ指定の値を持つインスタンスを生成するために使用されています。

Swiftの`init`メソッドをオーバーライドすることは、サブクラスがスーパークラスの初期化処理をカスタマイズする必要がある場合に行います。あなたの例では、`AppRootRouterDependencyMock`は既に最終クラス(`final`)であり、サブクラス化されることは想定されていません。そのため、`init`メソッドのオーバーライドではなく、異なる初期化パターンを提供するために`static`メソッドを使用しています。

もし`init`メソッドを"オーバーライド"するような振る舞いを模倣したい場合は、代わりに複数の`convenience init`を使用することができます。ただし、`final class`であるため、サブクラスによるオーバーライドは考慮する必要がありません。代わりに、異なる初期化オプションを提供したい場合は、複数の`convenience init`をクラス内に定義することが可能です。これにより、異なる初期化パラメータを持つインスタンスを柔軟に生成できるようになります。

例えば、以下のように`convenience init`を定義することができます：

```swift
public final class AppRootRouterDependencyMock: AppRootRouterDependency {
    // 既存のinitメソッド...

    // convenience initを追加
    public convenience init(random: Bool) {
        if random {
            self.init(
                libraryLicenseDriver: LibraryLicenseDriverProtocolMock(licenseList: .randoms),
                osLogDriver: OSLogDriverProtocolMock(),
                firebaseSetupDriver: FirebaseSetupDriverProtocolMock()
            )
        } else {
            self.init()
        }
    }
}
```

この方法では、新しいインスタンスを生成する際に、異なる初期化ロジックを適用することができます。しかし、元の質問のコンテキストにおいては、`static`メソッドを使用している理由は、特定の初期化パターンに名前を付け、それをクラスレベルで簡単にアクセスできるようにするためであり、これは`init`メソッドのオーバーライドとは異なる目的を持っています。

---

## 👤 ユーザー
*2024/02/29 15:13:21*

final を外したらconvenience initだったり、initをオーバーライドできるのか？

---

## 🤖 アシスタント
*2024/02/29 15:14:45*

はい、`final`キーワードをクラス定義から取り除くことで、そのクラスは継承可能になり、サブクラスで`init`メソッドをオーバーライドすることができるようになります。Swiftでは、サブクラスがスーパークラスの特定のイニシャライザ（`init`メソッド）をオーバーライドすることを許可しており、これによりサブクラスはスーパークラスの初期化プロセスをカスタマイズできます。

### `init`のオーバーライド

スーパークラスに定義された`init`メソッドをサブクラスでオーバーライドするには、`override`キーワードを使用します。これは、サブクラスがスーパークラスの初期化処理を置き換える、または拡張する場合に行います。

```swift
class SuperClass {
    init() {
        // スーパークラスの初期化処理
    }
}

class SubClass: SuperClass {
    override init() {
        // サブクラス固有の初期化処理
        super.init() // スーパークラスのinitを呼び出す
    }
}
```

### `convenience init`の使用

`convenience init`は、補助的なイニシャライザであり、クラスに複数の初期化オプションを提供するために使用されます。`convenience init`は、同じクラス内の別のイニシャライザ（`self.init`を通じて）を必ず呼び出す必要があります。これにより、初期化コードの重複を避けることができます。

```swift
class MyClass {
    var property: Int

    init(property: Int) {
        self.property = property
    }

    convenience init() {
        self.init(property: 0) // デフォルト値でメインイニシャライザを呼び出す
    }
}
```

### 継承と`convenience init`

`final`を取り除いた後、サブクラスでは`convenience init`を自由に追加できますが、これらはオーバーライドではなく、新たな初期化オプションを提供するものです。`convenience init`は、基本的にはそのクラス固有のイニシャライザを通じて、最終的にはいずれかの`designated init`（指定イニシャライザ）を呼び出す必要があります。

サブクラスでスーパークラスの`convenience init`を直接オーバーライドすることはできませんが、サブクラス固有の`convenience init`を定義して、サブクラスのニーズに合わせた初期化処理を実装することが可能です。

```swift
class SubClass: SuperClass {
    var anotherProperty: Int

    init(property: Int, anotherProperty: Int) {
        self.anotherProperty = anotherProperty
        super.init(property: property)
    }

    convenience init(anotherProperty: Int) {
        self.init(property: 0, anotherProperty: anotherProperty) // デフォルト値と共にサブクラスのdesignated initを呼び出す
    }
}
```

このように、`final`を取り除くことで、クラスはより柔軟に継承と初期化のカスタマイズが可能になります。

---
