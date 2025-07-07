# Nil可透過UserDefaultsWrapper

日付: 2024-03-14

---

## 👤 ユーザー
*2024/3/14 17:19:11*

以下のnilを許容するものを作ってほしい。

@propertyWrapper
public struct UserDefaultsWrapper&lt;T: UserDefaultsCodable&gt; {
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
                OSLogDriver.debugLog("Not found key in UserDefaults, key: \\(key), return defaultValue: \\(defaultValue)")
                return defaultValue
            }

            do {
                let decodedValue = try T.decoder.decode(T.self, from: data)
                OSLogDriver.debugLog("Return UserDefaults value, key: \\(key), value: \\(decodedValue)")
                return decodedValue
            } catch {
                OSLogDriver.errorLog("Failed to decode \\(key): \\(error), defaultValue: \\(defaultValue)", level: .fault)
                assertionFailure("Failed to decode \\(key): \\(error), defaultValue: \\(defaultValue)")
                return defaultValue
            }
        }
        set {
            let oldValue = self.wrappedValue
            do {
                let encodedValue = try T.encoder.encode(newValue)
                userDefaults.set(encodedValue, forKey: key.rawValue)
                OSLogDriver.debugLog("Update UserDefaults key: \\(key.rawValue), oldValue: \\(String(describing: oldValue)), newValue: \\(String(describing: newValue))")
            } catch {
                OSLogDriver.errorLog("Failed to encode \\(key): \\(error), oldValue: \\(oldValue), newValue: \\(newValue)", level: .fault)
                assertionFailure("Failed to encode \\(key): \\(error), oldValue: \\(oldValue), newValue: \\(newValue)")
            }
        }
    }
}

---

## 🤖 アシスタント
*2024/3/14 17:20:07*

このプロパティラッパーを変更して、`nil` 値を許容するバージョンにするには、いくつかの変更が必要です。最初に、`defaultValue` の型を `T?` にすることで、デフォルト値として `nil` を許容できるようにします。次に、`wrappedValue` の型も `T?` に変更し、`nil` 値が設定された場合、UserDefaults からそのキーを削除するようにします。これにより、デフォルト値が `nil` の場合、またはユーザーが明示的に `nil` を設定した場合に、その振る舞いをサポートできます。

以下に、`nil` を許容するように変更した `UserDefaultsWrapper` の実装を示します。

```swift
@propertyWrapper
public struct UserDefaultsWrapper<T: UserDefaultsCodable> {
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
                OSLogDriver.debugLog("Not found key in UserDefaults, key: \(key), return defaultValue: \(String(describing: defaultValue))")
                return defaultValue
            }

            do {
                let decodedValue = try T.decoder.decode(T.self, from: data)
                OSLogDriver.debugLog("Return UserDefaults value, key: \(key), value: \(String(describing: decodedValue))")
                return decodedValue
            } catch {
                OSLogDriver.errorLog("Failed to decode \(key): \(error), defaultValue: \(String(describing: defaultValue))", level: .fault)
                assertionFailure("Failed to decode \(key): \(error), defaultValue: \(String(describing: defaultValue))")
                return defaultValue
            }
        }
        set {
            let oldValue = self.wrappedValue
            if let newValue = newValue {
                do {
                    let encodedValue = try T.encoder.encode(newValue)
                    userDefaults.set(encodedValue, forKey: key.rawValue)
                    OSLogDriver.debugLog("Update UserDefaults key: \(key.rawValue), oldValue: \(String(describing: oldValue)), newValue: \(String(describing: newValue))")
                } catch {
                    OSLogDriver.errorLog("Failed to encode \(key): \(error), oldValue: \(String(describing: oldValue)), newValue: \(String(describing: newValue))", level: .fault)
                    assertionFailure("Failed to encode \(key): \(error), oldValue: \(String(describing: oldValue)), newValue: \(String(describing: newValue))")
                }
            } else {
                userDefaults.removeObject(forKey: key.rawValue)
                OSLogDriver.debugLog("Removed UserDefaults key: \(key.rawValue), oldValue: \(String(describing: oldValue)), due to nil newValue")
            }
        }
    }
}
```

この変更により、`UserDefaultsWrapper` は `nil` をデフォルト値として持つことができ、また `nil` を設定することで UserDefaults から該当のキーを削除することができるようになります。これにより、UserDefaults を使用して `nil` 値を適切に扱うことが可能になります。

---
