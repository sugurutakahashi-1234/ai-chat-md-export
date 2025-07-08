# UserDefaults Wrapper

Date: 2023-06-22

---

## 👤 User
*2023-06-22 11:01:09*

以下のコードについてまずは読んで欲しい。


public struct UserDefaultsManager: UserDefaultsManagerProtocol {
    private let isLoginSessionValidSubject = PassthroughSubject&lt;Bool, Never&gt;()
    private let isAppIntroductionShownSubject = PassthroughSubject&lt;Bool, Never&gt;()
    private let isUserAttributesRegisteredSubject = PassthroughSubject&lt;Bool, Never&gt;()
    private let isDeviceAccessRequestShownSubject = PassthroughSubject&lt;Bool, Never&gt;()
    private let portraitCalibrationDataSubject = PassthroughSubject&lt;[Double]?, Never&gt;()
    private let landscapeLeftCalibrationDataSubject = PassthroughSubject&lt;[Double]?, Never&gt;()
    private let isGazeCalibrationDoneSubject = PassthroughSubject&lt;Bool, Never&gt;()
    private let isEnableAppLogAnalyticsSubject = PassthroughSubject&lt;Bool, Never&gt;()

    public var isLoginSessionValidPublisher: AnyPublisher&lt;Bool, Never&gt; {
        isLoginSessionValidSubject.eraseToAnyPublisher()
    }

    public var isAppIntroductionShownPublisher: AnyPublisher&lt;Bool, Never&gt; {
        isAppIntroductionShownSubject.eraseToAnyPublisher()
    }

    public var isUserAttributesRegisteredPublisher: AnyPublisher&lt;Bool, Never&gt; {
        isUserAttributesRegisteredSubject.eraseToAnyPublisher()
    }

    public var isDeviceAccessRequestShownPublisher: AnyPublisher&lt;Bool, Never&gt; {
        isDeviceAccessRequestShownSubject.eraseToAnyPublisher()
    }

    public var isGazeCalibrationDonePublisher: AnyPublisher&lt;Bool, Never&gt; {
        isGazeCalibrationDoneSubject.eraseToAnyPublisher()
    }

    public var portraitCalibrationDataPublisher: AnyPublisher&lt;[Double]?, Never&gt; {
        portraitCalibrationDataSubject.eraseToAnyPublisher()
    }

    public var landscapeLeftCalibrationDataPublisher: AnyPublisher&lt;[Double]?, Never&gt; {
        landscapeLeftCalibrationDataSubject.eraseToAnyPublisher()
    }

    public var isEnableAppLogAnalyticsPublisher: AnyPublisher&lt;Bool, Never&gt; {
        isEnableAppLogAnalyticsSubject.eraseToAnyPublisher()
    }

    @UserDefaultsWrapper(key: .authorizationIdToken, defaultValue: nil)
    public var authorizationIdToken: String?

    @UserDefaultsWrapper(key: .isLoginSessionValid, defaultValue: false)
    public var isLoginSessionValid: Bool {
        didSet {
            isLoginSessionValidSubject.send(isLoginSessionValid)
        }
    }

    @UserDefaultsWrapper(key: .isAppIntroductionShown, defaultValue: false)
    public var isAppIntroductionShown: Bool {
        didSet {
            isAppIntroductionShownSubject.send(isAppIntroductionShown)
        }
    }

    @UserDefaultsWrapper(key: .isUserAttributesRegistered, defaultValue: false)
    public var isUserAttributesRegistered: Bool {
        didSet {
            isUserAttributesRegisteredSubject.send(isUserAttributesRegistered)
        }
    }

    @UserDefaultsWrapper(key: .isDeviceAccessRequestShown, defaultValue: false)
    public var isDeviceAccessRequestShown: Bool {
        didSet {
            isDeviceAccessRequestShownSubject.send(isDeviceAccessRequestShown)
        }
    }

    @UserDefaultsWrapper(key: .isGazeCalibrationDone, defaultValue: false)
    public var isGazeCalibrationDone: Bool {
        didSet {
            isGazeCalibrationDoneSubject.send(isGazeCalibrationDone)
        }
    }

    @UserDefaultsWrapper(key: .portraitCalibrationData, defaultValue: nil)
    public var portraitCalibrationData: [Double]? {
        didSet {
            portraitCalibrationDataSubject.send(portraitCalibrationData)
        }
    }

    @UserDefaultsWrapper(key: .landscapeRightCalibrationData, defaultValue: nil)
    public var landscapeRightCalibrationData: [Double]? {
        didSet {
            landscapeLeftCalibrationDataSubject.send(landscapeRightCalibrationData)
        }
    }

    // TODO: テストマーケ版ではアプリ外で承諾を行っているのでデフォルト true であるが、オープンベータではデフォルト false とする
    @UserDefaultsWrapper(key: .isEnableAppLogAnalytics, defaultValue: true)
    public var isEnableAppLogAnalytics: Bool {
        didSet {
            isEnableAppLogAnalyticsSubject.send(isEnableAppLogAnalytics)
        }
    }

    @UserDefaultsWrapper(key: .isEnableJSONEncode, defaultValue: false)
    public var isEnableJSONEncode: Bool

    @UserDefaultsWrapper(key: .isEnableLocalBackup, defaultValue: false)
    public var isEnableLocalBackup: Bool

    @UserDefaultsWrapper(key: .isEnableSavingImagesWhileCapturing, defaultValue: false)
    public var isEnableSavingImagesWhileCapturing: Bool

    @UserDefaultsWrapper(key: .enableCameraCaptureDebugView, defaultValue: false)
    public var isEnableCameraCaptureDebugView: Bool

    // 簡易アクセス用（Debug用）
    public static var sharedStandard = UserDefaultsManager(userDefaults: .standard)

    public init(userDefaults: UserDefaults = .standard) {
        // UserDefaults を .standard に入れ替えられるようにをどの UserDefaults をつかえるようにするか再設定している

        _authorizationIdToken = UserDefaultsWrapper(key: .authorizationIdToken, defaultValue: nil)
        _authorizationIdToken.updateUserDefaults(userDefaults)
        
        _isLoginSessionValid = UserDefaultsWrapper(key: .isLoginSessionValid, defaultValue: false)
        _isLoginSessionValid.updateUserDefaults(userDefaults)

        _isAppIntroductionShown = UserDefaultsWrapper(key: .isAppIntroductionShown, defaultValue: false)
        _isAppIntroductionShown.updateUserDefaults(userDefaults)

        _isUserAttributesRegistered = UserDefaultsWrapper(key: .isUserAttributesRegistered, defaultValue: false)
        _isUserAttributesRegistered.updateUserDefaults(userDefaults)

        _isDeviceAccessRequestShown = UserDefaultsWrapper(key: .isDeviceAccessRequestShown, defaultValue: false)
        _isDeviceAccessRequestShown.updateUserDefaults(userDefaults)

        _isGazeCalibrationDone = UserDefaultsWrapper(key: .isGazeCalibrationDone, defaultValue: false)
        _isGazeCalibrationDone.updateUserDefaults(userDefaults)

        _portraitCalibrationData = UserDefaultsWrapper(key: .portraitCalibrationData, defaultValue: nil)
        _portraitCalibrationData.updateUserDefaults(userDefaults)

        _landscapeRightCalibrationData = UserDefaultsWrapper(key: .landscapeRightCalibrationData, defaultValue: nil)
        _landscapeRightCalibrationData.updateUserDefaults(userDefaults)

        // TODO: テストマーケ版ではアプリ外で承諾を行っているのでデフォルト true であるが、オープンベータではデフォルト false とする
        _isEnableAppLogAnalytics = UserDefaultsWrapper(key: .isEnableAppLogAnalytics, defaultValue: true)
        _isEnableAppLogAnalytics.updateUserDefaults(userDefaults)

        _isEnableJSONEncode = UserDefaultsWrapper(key: .isEnableJSONEncode, defaultValue: false)
        _isEnableJSONEncode.updateUserDefaults(userDefaults)

        _isEnableLocalBackup = UserDefaultsWrapper(key: .isEnableLocalBackup, defaultValue: false)
        _isEnableLocalBackup.updateUserDefaults(userDefaults)

        _isEnableSavingImagesWhileCapturing = UserDefaultsWrapper(key: .isEnableSavingImagesWhileCapturing, defaultValue: false)
        _isEnableSavingImagesWhileCapturing.updateUserDefaults(userDefaults)

        _isEnableCameraCaptureDebugView = UserDefaultsWrapper(key: .enableCameraCaptureDebugView, defaultValue: false)
        _isEnableCameraCaptureDebugView.updateUserDefaults(userDefaults)
    }
}

extension String?: UserDefaultsCodable {}
extension Bool: UserDefaultsCodable {}
extension [Double]?: UserDefaultsCodable {}


public protocol UserDefaultsCodable: Codable {
    static var decoder: JSONDecoder { get }
    static var encoder: JSONEncoder { get }
}

// 必要に応じて、任意の decoder encoder を設定する場合は protocol の extension によるデフォルト実装を override して、使用してください
public extension UserDefaultsCodable {
    static var decoder: JSONDecoder {
        JSONDecoder()
    }

    static var encoder: JSONEncoder {
        JSONEncoder()
    }
}

@propertyWrapper
public struct UserDefaultsWrapper&lt;T: UserDefaultsCodable&gt; {
    private let key: UserDefaultsKeys
    private let defaultValue: T
    private var userDefaults: UserDefaults?

    public init(key: UserDefaultsKeys, defaultValue: T) {
        self.key = key
        self.defaultValue = defaultValue
    }

    public mutating func updateUserDefaults(_ userDefaults: UserDefaults) {
        self.userDefaults = userDefaults
    }

    public var wrappedValue: T {
        get {
            guard let userDefaults else {
                assertionFailure("Unset UserDefaults \(key)")
                return defaultValue
            }
            guard let data = userDefaults.data(forKey: key.rawValue) else {
                return defaultValue
            }
            do {
                let decodedValue = try T.decoder.decode(T.self, from: data)
                return decodedValue
            } catch {
                assertionFailure("Failed to decode \(key): \(error)")
                return defaultValue
            }
        }
        set {
            do {
                guard let userDefaults else {
                    assertionFailure("Unset UserDefaults \(key)")
                    return
                }
                let encodedValue = try T.encoder.encode(newValue)
                userDefaults.set(encodedValue, forKey: key.rawValue)
            } catch {
                assertionFailure("Failed to encode \(key): \(error)")
            }
        }
    }
}

---

## 🤖 Assistant
*2023-06-22 11:01:54*

このコードは、Swiftで書かれたコードで、主にUserDefaultsの操作を管理する機能を提供します。以下に主要な部分の説明をします。

1. **UserDefaultsManager**:
この構造体は、UserDefaultsの特定のキーに対応する値の管理を担当します。各キーにはその値の変更を監視するための`PassthroughSubject`が用意されており、それらの値のPublisherが公開されています。これにより、これらの値の変更を監視するCombineフレームワークを使った非同期処理が可能となります。

2. **UserDefaultsCodable**:
このプロトコルは、UserDefaultsに格納できる型を定義します。これらの型はCodableプロトコルに準拠する必要があり、それぞれのデコーダとエンコーダを提供します。これにより、UserDefaultsに非プリミティブなデータ型を保存できます。

3. **UserDefaultsWrapper**:
これはproperty wrapperとして動作し、UserDefaultsに対する値の読み書きを容易にします。このラッパーを用いることで、UserDefaultsに格納するデータのエンコーディングとデコーディングが自動化され、それぞれのキーに対するデフォルト値も設定可能になります。

4. **UserDefaultsKeys**:
このコードでは見えませんが、この型はおそらくUserDefaultsの各キーを定義しているenumでしょう。

このコード全体としては、SwiftのCombineフレームワーク、property wrapper、Codableフレームワーク、UserDefaultsをうまく組み合わせて、アプリケーションの状態管理を効率化し、より堅牢にするための良い例を示しています。このコードがあることで、UserDefaultsに保存されている値の変更を監視し、その変更を他のコードに反映させるための非同期処理を容易に実装できます。

---

## 👤 User
*2023-06-22 11:02:17*

extension [Double]?: UserDefaultsCodable {} のところで以下のエラーが表示されているのでどうしたらいいか教えて欲しい

Conflicting conformance of 'Optional&lt;Wrapped&gt;' to protocol 'UserDefaultsCodable'; there cannot be more than one conformance, even with different conditional bounds

---

## 🤖 Assistant
*2023-06-22 11:02:51*

Swiftでは、同じ型（ここではOptional）が同じプロトコル（ここではUserDefaultsCodable）に複数回準拠することはできません。そのため、Swiftがエラーをスローしています。

特定のOptional型、例えば`[Double]?`を`UserDefaultsCodable`に適合させたいのであれば、`[Double]?`の代わりに新しい型を作成して、その新しい型をプロトコルに準拠させることができます。その新しい型はOptionalの`[Double]?`をラップします。

以下に一例を示します：

```swift
public struct OptionalDoubleArray: UserDefaultsCodable {
    var array: [Double]?
    // add necessary initializers and methods
}

extension OptionalDoubleArray: Codable {
    public init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        self.array = try container.decode([Double]?.self)
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        try container.encode(self.array)
    }
}
```

ここで作成した`OptionalDoubleArray`は`UserDefaultsCodable`と`Codable`の両方に準拠しているので、そのまま`UserDefaultsWrapper`で使用することができます。

```swift
@UserDefaultsWrapper(key: .optionalDoubleArrayKey, defaultValue: OptionalDoubleArray(array: nil))
public var optionalDoubleArray: OptionalDoubleArray
```

この方法では、特定のOptional型を明示的にUserDefaultsに保存できます。ただし、他のOptional型に対しても同じことをしたい場合は、それぞれに対して新しい型を作成する必要があります。また、新しい型を作成することで、コードが少し複雑になるという欠点もあります。

---

## 👤 User
*2023-06-22 11:03:07*

extension String?: UserDefaultsCodable {} も同様なことをした方がいいのかな？

---

## 🤖 Assistant
*2023-06-22 11:03:31*

はい、その通りです。あなたが`String?`を`UserDefaultsCodable`に準拠させたいのであれば、上記の`[Double]?`と同様に、新しい型を作成し、その新しい型を`UserDefaultsCodable`に準拠させる必要があります。

以下にその一例を示します：

```swift
public struct OptionalString: UserDefaultsCodable {
    var string: String?
    // add necessary initializers and methods
}

extension OptionalString: Codable {
    public init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        self.string = try container.decode(String?.self)
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        try container.encode(self.string)
    }
}
```

そして、その新しい型（`OptionalString`）をUserDefaultsWrapperで使用します：

```swift
@UserDefaultsWrapper(key: .optionalStringKey, defaultValue: OptionalString(string: nil))
public var optionalString: OptionalString
```

これにより、特定のOptional型（この場合は`String?`）をUserDefaultsに保存することができます。ただし、他のOptional型に対しても同じことをしたい場合は、それぞれに対して新しい型を作成する必要があります。また、新しい型を作成することで、コードが少し複雑になるという欠点もあります。

---

## 👤 User
*2023-06-22 11:03:49*

それを解決する方法はあるの？

---

## 🤖 Assistant
*2023-06-22 11:04:17*

Swiftでは現状、特定のOptional型を直接プロトコルに準拠させることはできません。そのため、既述したような型のラッピングが必要になります。それが、言語設計上の制約からくる現状最良の解決策となります。

Swiftのジェネリクスとプロトコル準拠のシステムは強力で柔軟性がありますが、特定のジェネリック型（この場合、特定のOptional型）に対してのみプロトコル準拠を実装するということは、現在のところサポートされていません。これは、ジェネリクスの型パラメータ（この場合、Optionalの中の`Wrapped`）がプロトコルに準拠することを要求するときに特に顕著となります。

あるいは、システムのアーキテクチャを再検討して、Optionalな値をUserDefaultsに保存する必要性を避けることも考えられます。例えば、Optionalな値ではなく、特定の「デフォルト」値または「無効」を示す値を使用することも可能です。このアプローチは、アプリケーションの要件と設計によります。

---
