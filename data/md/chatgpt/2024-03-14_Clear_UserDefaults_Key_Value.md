# Clear UserDefaults Key Value

Date: 2024-03-14

---

## 👤 User
*2024-03-14 15:19:50*

UserDefaultsDataStore のpublic func clear(key: UserDefaultsKey) からうまくそのキーのユーザーデフォルトの値を削除したい、そうすればいいか？

public enum UserDefaultsKey: String {
    case launchAppCount
}

public protocol PersistentDataStoreProtocol {}

public class UserDefaultsDataStore: PersistentDataStoreProtocol {
    @UserDefaultsWrapper(key: .launchAppCount, defaultValue: 0)
    public private(set) var launchAppCount: Int
    
    public func update(launchAppCount: Int) {
        self.launchAppCount = launchAppCount
    }
    
    public func clear(key: UserDefaultsKey) {
        switch key {
        case .launchAppCount:
        }
    }

    public func allClear() {
        guard let domain = Bundle.main.bundleIdentifier else {
            OSLogDriver.errorLog("Bundle.main.bundleIdentifier is nil", level: .fault)
            assertionFailure("Bundle.main.bundleIdentifier is nil")
            return
        }
        UserDefaults.standard.removePersistentDomain(forName: domain)
        OSLogDriver.errorLog("Completed: clear userDefaults")
    }
}

public protocol UserDefaultsCodable: Codable {
    static var decoder: JSONDecoder { get }
    static var encoder: JSONEncoder { get }
}

/// 必要に応じて、任意の decoder encoder を設定する場合は protocol の extension によるデフォルト実装を override して、使用してください
public extension UserDefaultsCodable {
    static var decoder: JSONDecoder {
        JSONDecoder()
    }

    static var encoder: JSONEncoder {
        JSONEncoder()
    }
}

extension Int: UserDefaultsCodable {}

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
                OSLogDriver.debugLog("Not found key in UserDefaults, key: \(key), return defaultValue: \(defaultValue)")
                return defaultValue
            }

            do {
                let decodedValue = try T.decoder.decode(T.self, from: data)
                OSLogDriver.debugLog("Return UserDefaults value, key: \(key), value: \(decodedValue)")
                return decodedValue
            } catch {
                OSLogDriver.errorLog("Failed to decode \(key): \(error), defaultValue: \(defaultValue)", level: .fault)
                assertionFailure("Failed to decode \(key): \(error), defaultValue: \(defaultValue)")
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
                OSLogDriver.errorLog("Failed to encode \(key): \(error), oldValue: \(oldValue), newValue: \(newValue)", level: .fault)
                assertionFailure("Failed to encode \(key): \(error), oldValue: \(oldValue), newValue: \(newValue)")
            }
        }
    }

    public func clear() {
        userDefaults.removeObject(forKey: key.rawValue)
        userDefaults.setValue(defaultValue, forKey: key.rawValue)
    }
}

public protocol ActionUserDefault {
    func clear()
}

---

## 🤖 Assistant
*2024-03-14 15:20:27*

To effectively remove a value associated with a specific `UserDefaultsKey` in your `UserDefaultsDataStore` class, you should leverage the `UserDefaultsWrapper`'s `clear` method. However, there seems to be a slight misalignment in how the `clear` method within your `UserDefaultsWrapper` is implemented and how it's intended to be used from your `UserDefaultsDataStore`.

In your current `UserDefaultsWrapper` implementation, the `clear` method not only removes the object for the specified key but also sets it back to its default value. This behavior may not always be what you want when you call `clear(key:)` on `UserDefaultsDataStore`, as you might expect it to simply remove the value, leaving it unset rather than resetting to a default.

Here's how you can adjust the `clear(key:)` method in `UserDefaultsDataStore` to utilize the `clear` method of `UserDefaultsWrapper`:

1. **Adjusting `UserDefaultsDataStore` to Clear the Key's Value:**

You currently have a placeholder switch statement in the `clear(key:)` method but no implementation to actually clear the value. Given that your `launchAppCount` property is managed by a `UserDefaultsWrapper`, you should directly call the `clear` method on this property. 

However, since `@propertyWrapper` does not expose its methods directly to the wrapped property, you would typically need a way to access the wrapper itself. Since direct access is not provided in your current setup, one approach is to extend `UserDefaultsDataStore` to explicitly clear the UserDefaults based on the key.

2. **Suggested Approach:**

You could modify your approach to allow `clear(key:)` to interact with the property wrapper. One way to do this, without changing your existing architecture significantly, is to indirectly access the wrapper through a protocol or by directly calling a method on the wrapper via a reference. But since direct manipulation seems off-limits due to the privacy and architecture, an adjustment in strategy is needed.

Considering your structure and the goal to use `UserDefaultsWrapper`'s `clear`, you might rethink how the `UserDefaultsWrapper` is used or directly interact with `UserDefaults` in `clear(key:)` method. Given the privacy of `launchAppCount`, direct interaction seems challenging without altering your design.

3. **Direct Clearing in `UserDefaultsDataStore`'s `clear(key:)`:**

For the purpose of this instruction and to align with your existing structure, here's a simplified example of how you might adjust `clear(key:)` to clear the UserDefaults directly, which is more in line with a direct manipulation approach:

```swift
public func clear(key: UserDefaultsKey) {
    UserDefaults.standard.removeObject(forKey: key.rawValue)
}
```

This method directly interacts with `UserDefaults` to remove the value associated with the given key, bypassing the need to interact through the property wrapper. This approach is more straightforward but deviates from using the wrapper's capabilities.

4. **Conclusion and Recommendation:**

Given the constraints and the setup you have, directly clearing the UserDefaults within `clear(key:)` is the most straightforward approach without significantly altering your architecture or privacy settings. If you wish to keep using the `UserDefaultsWrapper` and its features like encoding/decoding, consider redesigning the access level or the interaction pattern between your data store and the property wrappers.

---
