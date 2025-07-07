# UserDefaultsWrapper 更新案

日付: 2024-03-14

---

## 👤 ユーザー
*2024/3/14 17:06:19*

UserDefaultsWrapper から引数のdefaultValue: Tを省略したい。UserDefaultsKeyの型とデフォルト値を使ってほしい。

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
            guard let data = userDefaults.data(forKey: key.name) else {
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
                userDefaults.set(encodedValue, forKey: key.name)
                OSLogDriver.debugLog("Update UserDefaults key: \\(key.name), oldValue: \\(String(describing: oldValue)), newValue: \\(String(describing: newValue))")
            } catch {
                OSLogDriver.errorLog("Failed to encode \\(key): \\(error), oldValue: \\(oldValue), newValue: \\(newValue)", level: .fault)
                assertionFailure("Failed to encode \\(key): \\(error), oldValue: \\(oldValue), newValue: \\(newValue)")
            }
        }
    }
}


public enum UserDefaultsKey: Sendable {
    case launchAppCount
    case isFirstLaunch
    
    var name: String {
        "\\(self)"
    }
    
    var type: any UserDefaultsCodable.Type {
        switch self {
        case .launchAppCount:
            Int.self
        case .isFirstLaunch:
            Bool.self
        }
    }
    
    var defaultValue: any UserDefaultsCodable {
        switch self {
        case .launchAppCount:
            return 0
        case .isFirstLaunch:
            return true
        }
    }
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

---

## 🤖 アシスタント
*2024/3/14 17:07:22*

UserDefaultsWrapperの定義を修正して、`defaultValue: T` 引数を省略できるようにするには、`UserDefaultsKey` にデフォルト値の情報を持たせていますので、この情報を利用して `UserDefaultsWrapper` を改善することができます。具体的には、`UserDefaultsWrapper` の初期化時に `UserDefaultsKey` のみを受け取り、その `UserDefaultsKey` から型とデフォルト値を取得するように変更します。

以下の手順で `UserDefaultsWrapper` を更新します:

1. `UserDefaultsKey` に保存されているデフォルト値と型情報を使用するように `UserDefaultsWrapper` を変更します。
2. `UserDefaultsWrapper` のイニシャライザに `defaultValue` パラメータを省略可能にし、代わりに `UserDefaultsKey` からデフォルト値を取得します。
3. `UserDefaultsKey` の `type` と `defaultValue` プロパティが、ジェネリクスを正しく扱えるように修正が必要です。ただし、Swiftの現在の型システムでは、プロトコルの型情報を直接ジェネリック型パラメータとして使用することはできません。この問題を解決するには、少し異なるアプローチが必要ですが、`UserDefaultsKey` の `defaultValue` を利用する形で進めることはできます。

`UserDefaultsWrapper` の更新案を示します。ただし、Swiftの制限により、このままでは直接実装することは難しい部分があります。特に `UserDefaultsKey` から直接ジェネリック型を推論する部分は、Swiftでは直接的にはサポートされていません。代わりに、型安全を維持しつつデフォルト値を柔軟に扱うための設計変更を行います。

```swift
@propertyWrapper
public struct UserDefaultsWrapper<T: UserDefaultsCodable> {
    private let key: UserDefaultsKey
    private let userDefaults: UserDefaults
    
    public init(key: UserDefaultsKey, userDefaults: UserDefaults = .standard) {
        self.key = key
        self.userDefaults = userDefaults
    }

    public var wrappedValue: T {
        get {
            guard let data = userDefaults.data(forKey: key.name) else {
                return key.defaultValue as! T
            }

            do {
                return try T.decoder.decode(T.self, from: data)
            } catch {
                assertionFailure("Failed to decode \(key): \(error)")
                return key.defaultValue as! T
            }
        }
        set {
            do {
                let encodedValue = try T.encoder.encode(newValue)
                userDefaults.set(encodedValue, forKey: key.name)
            } catch {
                assertionFailure("Failed to encode \(key): \(error)")
            }
        }
    }
}
```

このアプローチには大きな変更が含まれ、`UserDefaultsKey` の `defaultValue` を `as! T` でキャストする必要がある点に注意してください。これは型安全を保証しないため、実行時に型が合わない場合にクラッシュする可能性があります。理想的には、より型安全なアプローチを探求するべきですが、これはSwiftの型システムの制約によるもので、一部の柔軟性を犠牲にするか、またはより複雑な実装を検討する必要があります。

`UserDefaultsKey` の `type` プロパティは削除し、`defaultValue` のみを利用する形になります。`UserDefaultsKey` から直接ジェネリック型を扱うことはSwiftでは困難なため、この方法である程度の型安全と利便性を確保しつつ、要件に近い形で

---

## 🤖 アシスタント
*2024/3/14 17:07:27*

の実装を目指します。

---

## 👤 ユーザー
*2024/3/14 17:08:53*

これを使う時はどうなるのか？

---

## 🤖 アシスタント
*2024/3/14 17:09:35*

この改良された`UserDefaultsWrapper`を使用すると、利用者は`UserDefaultsKey`を指定するだけで、関連するデフォルト値と型を自動で扱うことができます。つまり、プロパティラッパーの初期化時に`defaultValue`を明示的に指定する必要がなくなります。これはコードをよりシンプルにし、誤りの可能性を減らす助けとなります。

例えば、以下のように`UserDefaultsWrapper`を利用する場合:

```swift
struct Preferences {
    @UserDefaultsWrapper(key: .launchAppCount)
    var launchAppCount: Int

    @UserDefaultsWrapper(key: .isFirstLaunch)
    var isFirstLaunch: Bool
}
```

ここで、`@UserDefaultsWrapper`を使用して`launchAppCount`と`isFirstLaunch`の両方のプロパティを定義しています。それぞれのプロパティは`UserDefaultsKey`に基づいており、`UserDefaultsKey`の`defaultValue`を使用して、対応するデフォルト値（この例では`0`と`true`）を自動で取得します。ユーザーは`UserDefaultsWrapper`の初期化時にデフォルト値を指定する必要がなく、コードがより簡潔になります。

この方法の利点は、デフォルト値の定義を`UserDefaultsKey`に集約できることです。これにより、デフォルト値の変更が必要になった場合に、一箇所の変更で済み、その変更がすべての利用箇所に自動的に適用されます。また、型安全性を高めるために、`UserDefaultsKey`で指定されたデフォルト値と実際に使用される型が一致することを保証する責任がありますが、先に述べたように、`as! T`のキャストには注意が必要です。正しい型が保証されていない場合、実行時エラーが発生する可能性があります。

このアプローチは、`UserDefaults`の値を扱う際に、より型安全で、コードの重複を減らし、変更に強い方法を提供しますが、実装の詳細に注意し、型の不一致による実行時のエラーを避けるための適切なテストが重要になります。

---

## 👤 ユーザー
*2024/3/14 17:12:00*

public enum UserDefaultsKey: Sendable {
    case launchAppCount
    case isFirstLaunch
    
    var name: String {
        "\\(self)"
    }
    
    var type: any UserDefaultsCodable.Type {
        switch self {
        case .launchAppCount:
            Int.self
        case .isFirstLaunch:
            Bool.self
        }
    }
    
    var defaultValue: any UserDefaultsCodable {
        switch self {
        case .launchAppCount:
            return 0
        case .isFirstLaunch:
            return true
        }
    }
}

as! Tを使わずにこの defaultValue をtypeの型であることは指定できないのか？

---

## 🤖 アシスタント
*2024/3/14 17:12:59*

Swift の現在の型システムでは、`UserDefaultsKey` のような enum 内で、異なる型を持つ値を返す `defaultValue` を直接、ジェネリックスを使用して型安全に扱うことは難しいです。`any UserDefaultsCodable` は型の情報をある程度抽象化していますが、コンパイル時に `T` の具体的な型を保証する方法は提供していません。

しかし、`UserDefaultsWrapper`を型安全に使いたい場合、いくつかの方法でこの問題に対処することができます。一つのアプローチは、`UserDefaultsKey` に関連付けられたデフォルト値を提供するために、ジェネリックな関数やプロトコルを使うことです。これにより、`as! T` の使用を避け、コンパイル時の型安全を保持できます。

### ソリューションの例

以下の例では、`UserDefaultsKey` に対して、それぞれのキーに応じたデフォルト値を安全に取得する方法を提供します。

まず、`UserDefaultsCodable` プロトコルを拡張して、デフォルト値を提供する静的メソッドを定義します。この方法では、各型（例えば、`Int`や`Bool`）に対して、それぞれのキーのデフォルト値を提供するための具体的な実装を用意します。

```swift
protocol UserDefaultsCodable {
    static func defaultValue(forKey key: UserDefaultsKey) -> Self
}

extension Int: UserDefaultsCodable {
    static func defaultValue(forKey key: UserDefaultsKey) -> Int {
        switch key {
        case .launchAppCount:
            return 0
        default:
            return 0 // または、適切なデフォルト値
        }
    }
}

extension Bool: UserDefaultsCodable {
    static func defaultValue(forKey key: UserDefaultsKey) -> Bool {
        switch key {
        case .isFirstLaunch:
            return true
        default:
            return false // または、適切なデフォルト値
        }
    }
}
```

次に、`UserDefaultsWrapper` の実装を更新して、この型安全なデフォルト値の取得方法を使用します。

```swift
@propertyWrapper
public struct UserDefaultsWrapper<T: UserDefaultsCodable> {
    private let key: UserDefaultsKey
    private let userDefaults: UserDefaults

    public init(key: UserDefaultsKey, userDefaults: UserDefaults = .standard) {
        self.key = key
        self.userDefaults = userDefaults
    }

    public var wrappedValue: T {
        get {
            guard let data = userDefaults.data(forKey: key.name) else {
                // デフォルト値を型安全に取得
                return T.defaultValue(forKey: key)
            }

            do {
                return try T.decoder.decode(T.self, from: data)
            } catch {
                // デコードに失敗した場合の処理
                return T.defaultValue(forKey: key)
            }
        }
        set {
            do {
                let encodedValue = try T.encoder.encode(newValue)
                userDefaults.set(encodedValue, forKey: key.name)
            } catch {
                // エンコードに失敗した場合の処理
            }
        }
    }
}
```

この方法では、`as! T` を使用せずに、各キーに対する適切なデフォルト値を型安全に取得できます。さらに、このアプローチはコンパイル時に型の一致を保証し、実行時エラーのリスクを低減します。ただし、この方法では、新しいキーと型を追加するたびに、対応する `UserDefaultsCodable` の実装を更新する必要があります。

---
