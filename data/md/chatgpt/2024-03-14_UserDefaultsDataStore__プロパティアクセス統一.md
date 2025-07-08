# UserDefaultsDataStore: プロパティアクセス統一

日付: 2024-03-14

---

## 👤 ユーザー
*2024/03/14 16:38:11*

以下のようになっているときに、UserDefaultsKey をうまく拡張して、    var launchAppCount: Int { get } var isFirstLaunch: Bool { get } func update(launchAppCount: Int) func update(isFirstLaunch: Bool) を廃止して、func get(key: UserDefaultsKey) func set(key: UserDefaultsKey) に統一したい。どうすればよいか？


public enum UserDefaultsKey: String {
    case launchAppCount
    case isFirstLaunch
}

public protocol PersistentDataStoreProtocol {
    var launchAppCount: Int { get }
    var isFirstLaunch: Bool { get }

    func update(launchAppCount: Int)
    func update(isFirstLaunch: Bool)
    
    func get(key: UserDefaultsKey)
    func set(key: UserDefaultsKey)
    
    func clear(key: UserDefaultsKey)
    func allClear()
}

public class UserDefaultsDataStore: PersistentDataStoreProtocol {
    @UserDefaultsWrapper(key: .launchAppCount, defaultValue: 0)
    public private(set) var launchAppCount: Int
    
    @UserDefaultsWrapper(key: .launchAppCount, defaultValue: true)
    public var isFirstLaunch: Bool
    
    public init(){}
    
    public func update(launchAppCount: Int) {
        self.launchAppCount = launchAppCount
    }
    
    public func update(isFirstLaunch: Bool) {
        self.isFirstLaunch = isFirstLaunch
    }
    
    public func get(key: UserDefaultsKey) {
        // TODO:
    }
    
    public func set(key: UserDefaultsKey) {
        // TODO:
    }
    
    public func clear(key: UserDefaultsKey) {
        UserDefaults.standard.removeObject(forKey: key.rawValue)
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
extension Bool: UserDefaultsCodable {}

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
}

---

## 🤖 アシスタント
*2024/03/14 16:39:22*

あなたの要求に応えるために、`UserDefaultsDataStore`内の`get`と`set`メソッドを拡張して、`launchAppCount`と`isFirstLaunch`のプロパティアクセスを`get(key:)`と`set(key:value:)`メソッドに統一することが可能です。`UserDefaultsWrapper`プロパティラッパーを使用していますが、これを直接利用する形で`get`と`set`メソッドを実装することは難しいため、`UserDefaultsDataStore`内で直接`UserDefaults`を利用する形に変更し、型安全性を確保しつつ`UserDefaults`へのアクセスを抽象化します。

以下のステップに従って、この変更を行います。

1. `PersistentDataStoreProtocol`プロトコルを修正し、`set`メソッドに`value: Any`パラメータを追加します。
2. `UserDefaultsDataStore`クラス内の`get`と`set`メソッドを具体的に実装します。
3. `launchAppCount`と`isFirstLaunch`のプロパティアクセスを新しい`get`と`set`メソッドを通じて行うように変更します。

### ステップ 1: プロトコルの修正

まず、`PersistentDataStoreProtocol`を以下のように修正します。

```swift
public protocol PersistentDataStoreProtocol {
    func get(key: UserDefaultsKey) -> Any?
    func set(key: UserDefaultsKey, value: Any)
    func clear(key: UserDefaultsKey)
    func allClear()
}
```

### ステップ 2: `UserDefaultsDataStore`の実装

次に、`UserDefaultsDataStore`内の`get`と`set`メソッドを具体的に実装します。

```swift
public class UserDefaultsDataStore: PersistentDataStoreProtocol {
    // ... 既存の実装 ...
    
    public func get(key: UserDefaultsKey) -> Any? {
        switch key {
        case .launchAppCount:
            return UserDefaults.standard.integer(forKey: key.rawValue)
        case .isFirstLaunch:
            return UserDefaults.standard.bool(forKey: key.rawValue)
        }
    }
    
    public func set(key: UserDefaultsKey, value: Any) {
        switch key {
        case .launchAppCount:
            guard let intValue = value as? Int else { return }
            UserDefaults.standard.set(intValue, forKey: key.rawValue)
        case .isFirstLaunch:
            guard let boolValue = value as? Bool else { return }
            UserDefaults.standard.set(boolValue, forKey: key.rawValue)
        }
    }
    
    // ... clear および allClear メソッドの実装 ...
}
```

### ステップ 3: プロパティアクセスの変更

最後に、`launchAppCount`と`isFirstLaunch`の既存のプロパティアクセスを、新しい`get`と`set`メソッドを使ったアクセスに置き換えます。ただし、これらのプロパティは`UserDefaultsWrapper`を使用して自動的に処理されているため、直接的な変更は必要ありません。ただし、`update(launchAppCount:)`や`update(isFirstLaunch:)`メソッドを使用していた箇所は、新しい`set`メソッドを使用する形に更新する必要があります。

この変更により、`UserDefaultsDataStore`は`UserDefaultsKey`を用いて、より一般的な方法でUserDefaultsの値を取得・設定することができるようになります。さらに、この方法は型安全でありながらも、UserDefaultsの値へのアクセスを抽象化し、拡張性とメンテナンスの容易さを提供します。

---
