# 共通UserDefaultsコードラッパー

Date: 2024-03-14

---

## 👤 User
*2024-03-14 22:44:21*

@propertyWrapper
public struct UserDefaultsNilableWrapper&lt;T: JSONCodable&gt; {
    private let key: UserDefaultsKey
    private let defaultValue: T?
    private let userDefaults: UserDefaults
    
    public init(key: UserDefaultsKey, defaultValue: T?, userDefaults: UserDefaults = .standard) {
        self.key = key
        self.defaultValue = defaultValue
        self.userDefaults = userDefaults
    }

    public var wrappedValue: T? {
        get {
            guard let data = userDefaults.data(forKey: key.rawValue) else {
                // 未更新の key の場合はデフォルト値を返却する（準正常系）
                OSLogDriver.debugLog("Not found key in UserDefaults, key: \(key), return defaultValue: \(String(describing: defaultValue))")
                return defaultValue
            }

            do {
                let decodedValue = try T.decoder.decode(T.self, from: data)
                OSLogDriver.debugLog("Return UserDefaults value, key: \(key), value: \(decodedValue)")
                return decodedValue
            } catch {
                OSLogDriver.errorLog("Failed to decode \(key): \(error), defaultValue: \(String(describing: defaultValue))", level: .fault)
                assertionFailure("Failed to decode \(key): \(error), defaultValue: \(String(describing: defaultValue))")
                return defaultValue
            }
        }
        set {
            let oldValue = self.wrappedValue
            do {
                let encodedValue = try T.encoder.encode(newValue)
                userDefaults.set(encodedValue, forKey: key.rawValue)
                OSLogDriver.debugLog("Update UserDefaults key: \(key.rawValue), oldValue: \(String(describing: oldValue)), newValue: \(String(describing: newValue))")
            } catch {
                OSLogDriver.errorLog("Failed to encode \(key): \(error), oldValue: \(String(describing: oldValue)), newValue: \(String(describing: newValue))", level: .fault)
                assertionFailure("Failed to encode \(key): \(error), oldValue: \(String(describing: oldValue)), newValue: \(String(describing: newValue))")
            }
        }
    }
}


@propertyWrapper
public struct UserDefaultsWrapper&lt;T: JSONCodable&gt; {
    private let key: UserDefaultsKey
    private let defaultValue: T
    private let userDefaults: UserDefaults
    
    public init(key: UserDefaultsKey, defaultValue: T, userDefaults: UserDefaults = .standard) {
        self.key = key
        self.defaultValue = defaultValue
        self.userDefaults = userDefaults
    }

    public var wrappedValue: T {
        get {
            guard let data = userDefaults.data(forKey: key.rawValue) else {
                // 未更新の key の場合はデフォルト値を返却する（準正常系）
                OSLogDriver.debugLog("Not found key in UserDefaults, key: \(key), return defaultValue: \(String(describing: defaultValue))")
                return defaultValue
            }

            do {
                let decodedValue = try T.decoder.decode(T.self, from: data)
                OSLogDriver.debugLog("Return UserDefaults value, key: \(key), value: \(decodedValue)")
                return decodedValue
            } catch {
                OSLogDriver.errorLog("Failed to decode \(key): \(error), defaultValue: \(String(describing: defaultValue))", level: .fault)
                assertionFailure("Failed to decode \(key): \(error), defaultValue: \(String(describing: defaultValue))")
                return defaultValue
            }
        }
        set {
            let oldValue = self.wrappedValue
            do {
                let encodedValue = try T.encoder.encode(newValue)
                userDefaults.set(encodedValue, forKey: key.rawValue)
                OSLogDriver.debugLog("Update UserDefaults key: \(key.rawValue), oldValue: \(String(describing: oldValue)), newValue: \(String(describing: newValue))")
            } catch {
                OSLogDriver.errorLog("Failed to encode \(key): \(error), oldValue: \(String(describing: oldValue)), newValue: \(String(describing: newValue))", level: .fault)
                assertionFailure("Failed to encode \(key): \(error), oldValue: \(String(describing: oldValue)), newValue: \(String(describing: newValue))")
            }
        }
    }
}


これを共通化したい。@propertyWrapperも共通化できるのか？

---

## 🤖 Assistant
*2024-03-14 22:45:41*

Swiftの`@propertyWrapper`を使用して、共通の機能を持つコードを共通化することは可能です。`UserDefaultsNilableWrapper`と`UserDefaultsWrapper`の機能を見ると、主な違いはデフォルト値が`nil`を許容するかどうか、つまりオプショナル型かどうかです。これらの違いを統合するために、ジェネリックスとオプショナル型をうまく活用することで共通化が可能です。

以下のように共通の`@propertyWrapper`を定義して、オプショナルと非オプショナルの両方に対応させることができます：

```swift
import Foundation

@propertyWrapper
public struct UserDefaultsCodableWrapper<T> {
    private let key: UserDefaultsKey
    private let defaultValue: T
    private let userDefaults: UserDefaults
    
    public init(key: UserDefaultsKey, defaultValue: T, userDefaults: UserDefaults = .standard) {
        self.key = key
        self.defaultValue = defaultValue
        self.userDefaults = userDefaults
    }

    public var wrappedValue: T {
        get {
            guard let data = userDefaults.data(forKey: key.rawValue) else {
                OSLogDriver.debugLog("Not found key in UserDefaults, key: \(key), return defaultValue: \(String(describing: defaultValue))")
                return defaultValue
            }

            do {
                if let defaultValue = defaultValue as? _OptionalType, defaultValue.isNil {
                    // Handle nil default value for optional T
                    let decodedValue = try T.decoder.decode(T.self, from: data)
                    OSLogDriver.debugLog("Return UserDefaults value, key: \(key), value: \(decodedValue)")
                    return decodedValue
                } else {
                    // Handle non-optional T
                    let decodedValue = try T.decoder.decode(T.self, from: data)
                    OSLogDriver.debugLog("Return UserDefaults value, key: \(key), value: \(decodedValue)")
                    return decodedValue
                }
            } catch {
                OSLogDriver.errorLog("Failed to decode \(key): \(error), defaultValue: \(String(describing: defaultValue))", level: .fault)
                assertionFailure("Failed to decode \(key): \(error), defaultValue: \(String(describing: defaultValue))")
                return defaultValue
            }
        }
        set {
            do {
                let encodedValue = try T.encoder.encode(newValue)
                userDefaults.set(encodedValue, forKey: key.rawValue)
                OSLogDriver.debugLog("Update UserDefaults key: \(key.rawValue), newValue: \(String(describing: newValue))")
            } catch {
                OSLogDriver.errorLog("Failed to encode \(key): \(error), newValue: \(String(describing: newValue))", level: .fault)
                assertionFailure("Failed to encode \(key): \(error), newValue: \(String(describing: newValue))")
            }
        }
    }
}

protocol _OptionalType {
    var isNil: Bool { get }
}

extension Optional: _OptionalType {
    var isNil: Bool { self == nil }
}
```

このコードでは、`UserDefaultsCodableWrapper`がジェネリック型`T`を受け取ります。`T`がオプショナル型の場合でも非オプショナル型の場合でも対応できるようにしています。`_OptionalType`プロトコルを導入し、Swiftの`Optional`型を拡張して、実行時にオプショナル値かどうかを判断できるようにしています。これにより、`wrappedValue`のgetterとsetter内で、オプショナル型のデフォルト値が`nil`である場合に特別な処理を行うことができます。

この方法で、`UserDefaultsNilableWrapper`と`UserDefaultsWrapper`の機能を一つの`@propertyWrapper`に統合することができます。ただし、このコードは一例であり、プロジェクトの具体的な要件に応じて調整する必要があります。

---

## 👤 User
*2024-03-14 22:48:26*

でもこれだと、nil を set できないよね？

---

## 🤖 Assistant
*2024-03-14 22:49:36*

その通りです。提案したコードでは、`nil`を`wrappedValue`に`set`することが直接的には考慮されていませんでした。`UserDefaults`で`nil`をセットする場合は、実際にはそのキーを`UserDefaults`から削除することに相当します。これを可能にするためには、`wrappedValue`の`set`メソッド内で`newValue`が`nil`かどうかをチェックし、`nil`の場合は`UserDefaults`からそのキーを削除するように修正する必要があります。

以下に修正されたコードを示します。このバージョンでは、`nil`を許容するオプショナル型`T?`に対して`nil`をセットすることが可能です：

```swift
@propertyWrapper
public struct UserDefaultsCodableWrapper<T: Codable> {
    private let key: String
    private let defaultValue: T
    private let userDefaults: UserDefaults
    
    public init(key: String, defaultValue: T, userDefaults: UserDefaults = .standard) {
        self.key = key
        self.defaultValue = defaultValue
        self.userDefaults = userDefaults
    }

    public var wrappedValue: T {
        get {
            guard let data = userDefaults.data(forKey: key) else {
                // デフォルト値を返却する
                return defaultValue
            }

            do {
                // UserDefaultsからデコードして値を取得
                let decodedValue = try JSONDecoder().decode(T.self, from: data)
                return decodedValue
            } catch {
                // デコードに失敗した場合はデフォルト値を返却
                return defaultValue
            }
        }
        set(newValue) {
            if let newValue = newValue as? _OptionalType, newValue.isNil {
                // newValueがnil（オプショナルでnilが設定された）の場合、UserDefaultsからキーを削除
                userDefaults.removeObject(forKey: key)
            } else {
                do {
                    // newValueをUserDefaultsに保存
                    let encodedValue = try JSONEncoder().encode(newValue)
                    userDefaults.set(encodedValue, forKey: key)
                } catch {
                    // エンコードに失敗した場合の処理
                }
            }
        }
    }
}

protocol _OptionalType {
    var isNil: Bool { get }
}

extension Optional: _OptionalType {
    var isNil: Bool { self == nil }
}
```

このバージョンでは、`UserDefaultsCodableWrapper`を使用して`nil`をセットすると、`UserDefaults`から該当のキーが削除されるようになっています。これにより、`UserDefaultsNilableWrapper`と`UserDefaultsWrapper`の機能を共通化し、かつオプショナルな値を扱えるようになります。

このコードでは`Codable`プロトコルを使用していますが、元の質問のコードに合わせるために`JSONCodable`やカスタムのエンコーダー/デコーダーが必要であれば、それに応じて調整してください。また、`UserDefaultsCodableWrapper`のジェネリック型`T`がオプショナル型かどうかを判断し、処理を分岐するために`_OptionalType`プロトコルとその拡張を使用しています。

---

## 👤 User
*2024-03-14 22:51:09*

@propertyWrapper
public struct UserDefaultsNilableWrapper&lt;T: JSONCodable&gt; {
    private let key: UserDefaultsKey
    private let defaultValue: T?
    private let userDefaults: UserDefaults
    
    public init(key: UserDefaultsKey, defaultValue: T?, userDefaults: UserDefaults = .standard) {
        self.key = key
        self.defaultValue = defaultValue
        self.userDefaults = userDefaults
    }

    public var wrappedValue: T? {
        get {
            guard let data = userDefaults.data(forKey: key.rawValue) else {
                // 未更新の key の場合はデフォルト値を返却する（準正常系）
                OSLogDriver.debugLog("Not found key in UserDefaults, key: \(key), return defaultValue: \(String(describing: defaultValue))")
                return defaultValue
            }

            do {
                let decodedValue = try T.decoder.decode(T.self, from: data)
                OSLogDriver.debugLog("Return UserDefaults value, key: \(key), value: \(decodedValue)")
                return decodedValue
            } catch {
                OSLogDriver.errorLog("Failed to decode \(key): \(error), defaultValue: \(String(describing: defaultValue))", level: .fault)
                assertionFailure("Failed to decode \(key): \(error), defaultValue: \(String(describing: defaultValue))")
                return defaultValue
            }
        }
        set {
            let oldValue = self.wrappedValue
            do {
                let encodedValue = try T.encoder.encode(newValue)
                userDefaults.set(encodedValue, forKey: key.rawValue)
                OSLogDriver.debugLog("Update UserDefaults key: \(key.rawValue), oldValue: \(String(describing: oldValue)), newValue: \(String(describing: newValue))")
            } catch {
                OSLogDriver.errorLog("Failed to encode \(key): \(error), oldValue: \(String(describing: oldValue)), newValue: \(String(describing: newValue))", level: .fault)
                assertionFailure("Failed to encode \(key): \(error), oldValue: \(String(describing: oldValue)), newValue: \(String(describing: newValue))")
            }
        }
    }
}

@propertyWrapper
public struct UserDefaultsWrapper&lt;T: JSONCodable&gt; {
    private let key: UserDefaultsKey
    private let defaultValue: T
    private let userDefaults: UserDefaults
    
    public init(key: UserDefaultsKey, defaultValue: T, userDefaults: UserDefaults = .standard) {
        self.key = key
        self.defaultValue = defaultValue
        self.userDefaults = userDefaults
    }

    public var wrappedValue: T {
        get {
            guard let data = userDefaults.data(forKey: key.rawValue) else {
                // 未更新の key の場合はデフォルト値を返却する（準正常系）
                OSLogDriver.debugLog("Not found key in UserDefaults, key: \(key), return defaultValue: \(String(describing: defaultValue))")
                return defaultValue
            }

            do {
                let decodedValue = try T.decoder.decode(T.self, from: data)
                OSLogDriver.debugLog("Return UserDefaults value, key: \(key), value: \(decodedValue)")
                return decodedValue
            } catch {
                OSLogDriver.errorLog("Failed to decode \(key): \(error), defaultValue: \(String(describing: defaultValue))", level: .fault)
                assertionFailure("Failed to decode \(key): \(error), defaultValue: \(String(describing: defaultValue))")
                return defaultValue
            }
        }
        set {
            let oldValue = self.wrappedValue
            do {
                let encodedValue = try T.encoder.encode(newValue)
                userDefaults.set(encodedValue, forKey: key.rawValue)
                OSLogDriver.debugLog("Update UserDefaults key: \(key.rawValue), oldValue: \(String(describing: oldValue)), newValue: \(String(describing: newValue))")
            } catch {
                OSLogDriver.errorLog("Failed to encode \(key): \(error), oldValue: \(String(describing: oldValue)), newValue: \(String(describing: newValue))", level: .fault)
                assertionFailure("Failed to encode \(key): \(error), oldValue: \(String(describing: oldValue)), newValue: \(String(describing: newValue))")
            }
        }
    }
}

nilを許容するものとしないものを別々に定義したままにして、protocolのextension で処理を共通化することはできないのかな？

---
