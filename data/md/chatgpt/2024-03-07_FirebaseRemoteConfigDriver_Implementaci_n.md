# FirebaseRemoteConfigDriver Implementación

日付: 2024-03-07

---

## 👤 ユーザー
*2024/3/7 23:12:36*

FirebaseRemoteConfigDriver の setDefaults と getValue を実装してほしい。setDefaults は RemoteConfigType の allCase で実装してほしい。


import FirebaseRemoteConfig

public struct FirebaseRemoteConfigDriver: FirebaseRemoteConfigDriverProtocol {
    private let remoteConfig = {
        // https://firebase.google.com/docs/remote-config/get-started?platform=ios&hl=ja
        let remoteConfig = RemoteConfig.remoteConfig()
        let settings = RemoteConfigSettings()
        settings.minimumFetchInterval = 0
        remoteConfig.configSettings = settings
        
        return remoteConfig
    }()
    
    public init() {
        LogDriver.initLog()
    }
    
    public func fetch() async {
        do {
            try remoteConfig.setDefaults(from: RemoteConfigType.appInfo.defaultValue)
            try await remoteConfig.fetchAndActivate()
        }
        catch {
            print("Config not fetched")
            print("Error: \(error.localizedDescription)")
        }
        
        do {
            let data = self.remoteConfig.configValue(forKey: RemoteConfigType.appInfo.keyName).dataValue
            print(data)
            let decoder = JSONDecoder()
            let hoge = try decoder.decode(MaintenanceInfo.self, from: data)
            print(hoge)
        } catch {
            print("decoder error")
            print("Error: \(error.localizedDescription)")
        }
    }

    public func setDefaults() throws {
        try remoteConfig.setDefaults(from: MaintenanceInfo(isMaintenance: false, maintenanceAlertTitle: "", maintenanceAlertMessage: ""))
    }
    

    public func setDefaults() {
        // ここを実装してほしい
    }
    
    public getValue(_ remoteConfigType: RemoteConfigType) -&gt; any RemoteConfigable {
        // ここを実装してほしい
    }
}

public enum RemoteConfigType: CaseIterable {
    case variantTest
    case appInfo
    
    var keyName: String {
        "\(self)".toSnakeCase
    }
    
    var defaultValue: any RemoteConfigable {
        switch self {
        case .variantTest:
            VariantTest.defaultValue
        case .appInfo:
            AppInfo.defaultValue
        }
    }
}

public protocol RemoteConfigable: Codable {
    static var defaultValue: Self { get }
}

public struct VariantTest: RemoteConfigable {
    public let isEnabledNewFeature: Bool
}

public extension VariantTest {
    static var defaultValue: Self {
        VariantTest(isEnabledNewFeature: false)
    }
}

public struct AppInfo: RemoteConfigable {
    public let appUpdateInfo: AppUpdateInfo
    public let maintenanceInfo: MaintenanceInfo
}

public extension AppInfo {
    static var defaultValue: Self {
        AppInfo(appUpdateInfo: AppUpdateInfo.defaultValue, maintenanceInfo: MaintenanceInfo.defaultValue)
    }
}

public struct AppUpdateInfo: RemoteConfigable {
    public let minimumRequiredAppVersion: String
    public let appUpdateUrl: String
}



public extension AppUpdateInfo {
    static var defaultValue: Self {
        AppUpdateInfo(minimumRequiredAppVersion: "0.0.0", appUpdateUrl: "")
    }
}

public struct MaintenanceInfo: RemoteConfigable {
    public let isMaintenance: Bool
    public let maintenanceAlertTitle: String
    public let maintenanceAlertMessage: String
}

public extension MaintenanceInfo {
    static var defaultValue: Self {
        MaintenanceInfo(isMaintenance: false, maintenanceAlertTitle: "", maintenanceAlertMessage: "")
    }
}

---

## 🤖 アシスタント
*2024/3/7 23:14:22*

To implement the `setDefaults` and `getValue` methods in `FirebaseRemoteConfigDriver` as requested, we need to adjust the implementation to work with the `RemoteConfigType` enum and its associated values. The `setDefaults` method should iterate over all cases of `RemoteConfigType` and set the default values accordingly. The `getValue` method should retrieve and return the value for a given `RemoteConfigType`.

Here's how you can implement these methods:

```swift
import FirebaseRemoteConfig

public struct FirebaseRemoteConfigDriver: FirebaseRemoteConfigDriverProtocol {
    private let remoteConfig = {
        let remoteConfig = RemoteConfig.remoteConfig()
        let settings = RemoteConfigSettings()
        settings.minimumFetchInterval = 0
        remoteConfig.configSettings = settings
        
        return remoteConfig
    }()
    
    public init() {
        LogDriver.initLog()
    }
    
    public func fetch() async {
        do {
            try await remoteConfig.fetchAndActivate()
        }
        catch {
            print("Config not fetched")
            print("Error: \(error.localizedDescription)")
        }
    }

    public func setDefaults() {
        let defaults = RemoteConfigType.allCases.reduce(into: [String: NSObject]()) { result, configType in
            switch configType.defaultValue {
            case let value as VariantTest:
                if let data = try? JSONEncoder().encode(value),
                   let json = try? JSONSerialization.jsonObject(with: data, options: .allowFragments) as? [String: Any] {
                    result[configType.keyName] = json as NSObject
                }
            case let value as AppInfo:
                if let data = try? JSONEncoder().encode(value),
                   let json = try? JSONSerialization.jsonObject(with: data, options: .allowFragments) as? [String: Any] {
                    result[configType.keyName] = json as NSObject
                }
            default:
                break
            }
        }
        
        remoteConfig.setDefaults(defaults)
    }
    
    public func getValue<T: RemoteConfigable>(_ remoteConfigType: RemoteConfigType) -> T? {
        guard let jsonData = remoteConfig.configValue(forKey: remoteConfigType.keyName).dataValue else { return nil }
        let decoder = JSONDecoder()
        do {
            let value = try decoder.decode(T.self, from: jsonData)
            return value
        } catch {
            print("Error decoding remote config value: \(error.localizedDescription)")
            return nil
        }
    }
}
```

### Explanation:

- **setDefaults Method**: This method iterates over all cases of `RemoteConfigType`, encoding the default values to JSON and setting them in Firebase Remote Config. This approach assumes that the default values can be serialized to JSON directly. If the structure of your default values is not compatible with direct JSON serialization (e.g., if it contains complex types that JSONEncoder cannot handle by default), you might need to adjust the serialization logic accordingly.

- **getValue Method**: This generic method attempts to decode the value for a specified `RemoteConfigType` key into the expected type `T`. It uses `JSONDecoder` to decode the data from Firebase Remote Config. This method returns `nil` if it fails to retrieve or decode the value, which could be due to the value not existing or a mismatch between the expected type and the actual data stored in Firebase Remote Config.

This implementation assumes that your remote config values are stored as JSON strings that can be directly decoded into your Swift types. If your remote config values are stored in a different format, you may need to adjust the decoding logic in `getValue` accordingly.

---

## 👤 ユーザー
*2024/3/7 23:19:18*

RemoteConfigable という名前を変えたい。
もっといい名前の候補を教えてほしい。日本語で回答してほしい。

---

## 🤖 アシスタント
*2024/3/7 23:20:39*

`RemoteConfigable` という名前を変更したい場合、そのプロトコルが何を表しているのか、その目的や使用方法に基づいて、より適切または分かりやすい名前を考えることが重要です。このプロトコルは、Firebase Remote Configから取得した設定値をデコードするためのデフォルト値を提供することが目的です。以下、いくつかの名前の候補を挙げます：

1. **設定可能**: 直訳すると「Configurable」になりますが、このコンテキストでは「Firebase Remote Configからの設定を適用可能な」という意味合いで使います。

2. **遠隔設定対応**: 「Remote Config Support」という意味で、Firebase Remote Configを通じて設定を受け取ることができるクラスや構造体に対して使います。

3. **設定項目**: 「ConfigItem」に相当します。Firebase Remote Configから取得する各設定項目を表すクラスや構造体に適用する場合に使うと良いでしょう。

4. **適用設定型**: 「ApplicableConfigType」という意味で、Firebase Remote Configから取得した設定を適用するための型であることを示します。

5. **設定反映型**: 「ConfigReflectable」に相当し、Firebase Remote Configからの設定を反映できる型であることを示します。

6. **設定受信型**: 「ConfigReceivable」という意味で、Firebase Remote Configから設定を受け取る能力がある型を指します。

選択する名前は、そのプロトコルがどのような役割を持ち、どのように使用されるかによって異なります。プロジェクトのコンテキストや既存の命名規則に合わせて、最も適切と思われる名前を選んでください。

---
