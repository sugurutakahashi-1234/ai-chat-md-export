# Add Debug Output

日付: 2023-08-09

---

## 👤 ユーザー
*2023/08/09 11:12:54*

以下のコードにて、変更時に変更される前の値と変更後の値をデバッグのために出力するにしたい


import Foundation

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

## 🤖 アシスタント
*2023/08/09 11:13:22*

変更時に変更される前の値と変更後の値をデバッグのために出力するには、`wrappedValue` の setter 内で出力を追加します。以下の方法でコードを変更できます。

```swift
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
        let oldValue = self.wrappedValue
        do {
            guard let userDefaults else {
                assertionFailure("Unset UserDefaults \(key)")
                return
            }
            let encodedValue = try T.encoder.encode(newValue)
            userDefaults.set(encodedValue, forKey: key.rawValue)
            print("Value for key \(key) changed from \(oldValue) to \(newValue)")  // 追加
        } catch {
            assertionFailure("Failed to encode \(key): \(error)")
        }
    }
}
```

上記のコードでは、`wrappedValue` の setter が呼ばれる度に、古い値（`oldValue`）と新しい値（`newValue`）がデバッグ出力されます。

この変更で、`UserDefaultsWrapper` を使ってプロパティが更新されるたびに、デバッグコンソールに変更の前後の値が表示されるようになります。

---
