# Mock作成: CloudStorage & DeviceInfo

日付: 2023-10-02

---

## 👤 ユーザー
*2023/10/2 15:19:08*

CloudStorageManagerProtocolとDeviceInfoManagerProtocolのMockを作ってほしい何も動作しなくていいんだ。

import Foundation

enum SampleError: Error {
    case sampleError
}

struct Version: Comparable {
    let major: Int
    let minor: Int
    let patch: Int

    public init(major: Int, minor: Int, patch: Int) {
        self.major = major
        self.minor = minor
        self.patch = patch
    }

    public init(_ version: String) throws {
        var numbers: [Int] = []
        for str in version.split(separator: ".") {
            if let number = Int(str) {
                numbers.append(number)
            } else {
                throw SampleError.sampleError
            }
        }
        guard numbers.count == 3 else {
            throw SampleError.sampleError
        }
        major = numbers[0]
        minor = numbers[1]
        patch = numbers[2]
    }

    public static func &lt; (lhs: Version, rhs: Version) -&gt; Bool {
        if lhs.major != rhs.major {
            return lhs.major &lt; rhs.major
        }
        if lhs.minor != rhs.minor {
            return lhs.minor &lt; rhs.minor
        }
        return lhs.patch &lt; rhs.patch
    }

    public static func == (lhs: Version, rhs: Version) -&gt; Bool {
        lhs.major == rhs.major && lhs.minor == rhs.minor && lhs.patch == rhs.patch
    }
}


protocol CloudStorageManagerProtocol: AnyObject {
    func downloadAndParseJson&lt;T: Decodable&gt;(key: String) async throws -&gt; T
}

public protocol DeviceInfoManagerProtocol: AnyObject {
    /// Bundle.main.infoDictionary["CFBundleShortVersionString"]
    /// ex) 1.2.3
    var appVersion: String { get }
}

public struct ServiceStatus: Codable {
    public let appUpdateInfo: AppUpdateInfo
    public let maintenanceInfo: MaintenanceInfo
}

public struct AppUpdateInfo: Codable {
    public let minimumRequiredAppVersion: String
    public let updateUrl: String
}

public struct MaintenanceInfo: Codable {
    public let isMaintenance: Bool
    public let alertTitle: String
    public let alertMessage: String
}

enum ServiceStatusRespondAction {
    case noAction
    case enterMaintenanceMode(alertTitle: String, alertMessage: String)
    case requireAppUpdate(updateUrlString: String)
}

protocol ServiceStatusUseCase: AnyObject {
    func fetchServiceStatus() async throws -&gt; ServiceStatus
    func determineServiceStatusRespondAction(serviceStatus: ServiceStatus) async throws -&gt; ServiceStatusRespondAction
}

final class ServiceStatusInteractor: ServiceStatusUseCase {
    private let cloudStorageManager: CloudStorageManagerProtocol
    private let deviceInfoManager: DeviceInfoManagerProtocol
    
    init(cloudStorageManager: CloudStorageManagerProtocol, deviceInfoManager: DeviceInfoManagerProtocol) {
        self.cloudStorageManager = cloudStorageManager
        self.deviceInfoManager = deviceInfoManager
    }
    
    func fetchServiceStatus() async throws -&gt; ServiceStatus {
        try await cloudStorageManager.downloadAndParseJson(key: "Constants.S3Paths.appConfigJsonFile") // TODO: 本当は文字列ではない
    }
    
    func determineServiceStatusRespondAction(serviceStatus: ServiceStatus) async throws -&gt; ServiceStatusRespondAction {
        if serviceStatus.maintenanceInfo.isMaintenance {
            print("enter maintenance mode")
            return .enterMaintenanceMode(alertTitle: serviceStatus.maintenanceInfo.alertTitle, alertMessage: serviceStatus.maintenanceInfo.alertMessage)
        }

        // アップデートステータスをチェックする
        let currentVersion = try Version(deviceInfoManager.appVersion)
        let newVersion = try Version(serviceStatus.appUpdateInfo.minimumRequiredAppVersion)

        print("currentVersion: \(currentVersion), newVersion: \(newVersion)")

        if currentVersion &lt; newVersion {
            print("requireAppUpdate, updateUrlString: \(serviceStatus.appUpdateInfo.updateUrl)")
            return .requireAppUpdate(updateUrlString: serviceStatus.appUpdateInfo.updateUrl)
        }

        return .noAction
    }
}

---

## 🤖 アシスタント
*2023/10/2 15:19:39*

あなたが求めている`CloudStorageManagerProtocol`と`DeviceInfoManagerProtocol`のMockクラスは以下の通りです。

CloudStorageManagerのMock:

```swift
class CloudStorageManagerMock: CloudStorageManagerProtocol {
    func downloadAndParseJson<T: Decodable>(key: String) async throws -> T {
        // ここで適切なダミーのレスポンスを返します。例えば、ServiceStatusのダミーインスタンスを返す場合：
        if T.self == ServiceStatus.self {
            let appUpdateInfo = AppUpdateInfo(minimumRequiredAppVersion: "1.0.0", updateUrl: "http://example.com/update")
            let maintenanceInfo = MaintenanceInfo(isMaintenance: false, alertTitle: "Maintenance", alertMessage: "Under maintenance")
            let serviceStatus = ServiceStatus(appUpdateInfo: appUpdateInfo, maintenanceInfo: maintenanceInfo)
            return serviceStatus as! T
        }
        throw SampleError.sampleError
    }
}
```

DeviceInfoManagerのMock:

```swift
class DeviceInfoManagerMock: DeviceInfoManagerProtocol {
    var appVersion: String {
        return "1.0.0" // ここで適切なバージョン番号を設定します。
    }
}
```

そして、これらのMockを使用してServiceStatusInteractorのインスタンスを作成できます。

```swift
let serviceStatusInteractor = ServiceStatusInteractor(
    cloudStorageManager: CloudStorageManagerMock(), 
    deviceInfoManager: DeviceInfoManagerMock()
)
```

これで、CloudStorageManagerProtocolとDeviceInfoManagerProtocolに関してMockが作成され、テストなどで利用することができます。

---

## 👤 ユーザー
*2023/10/2 15:20:15*

ServiceStatusInteractor の挙動をテストする実装を書いてほしい

---

## 🤖 アシスタント
*2023/10/2 15:21:23*

`ServiceStatusInteractor`の挙動をテストするために、`XCTest`フレームワークを使用してテストケースを作成できます。以下は、その例です。

まずは、テスト対象の`ServiceStatusInteractor`を`@testable`でインポートします。また、各テストケースで使用するMockクラスをセットアップします。

```swift
import XCTest
@testable import YourModuleName // テスト対象のモジュール名を正確に指定してください。

class ServiceStatusInteractorTests: XCTestCase {
    
    var interactor: ServiceStatusInteractor!
    var cloudStorageManagerMock: CloudStorageManagerMock!
    var deviceInfoManagerMock: DeviceInfoManagerMock!
    
    override func setUp() {
        super.setUp()
        
        cloudStorageManagerMock = CloudStorageManagerMock()
        deviceInfoManagerMock = DeviceInfoManagerMock()
        interactor = ServiceStatusInteractor(cloudStorageManager: cloudStorageManagerMock, deviceInfoManager: deviceInfoManagerMock)
    }
    
    override func tearDown() {
        interactor = nil
        cloudStorageManagerMock = nil
        deviceInfoManagerMock = nil
        
        super.tearDown()
    }
    
    func testFetchServiceStatus() async throws {
        // このテストでは、ServiceStatusをフェッチできるかテストします。
        _ = try await interactor.fetchServiceStatus() // ここでは単純に呼び出しエラーがないかをテストしています。
    }
    
    func testDetermineServiceStatusRespondAction_noAction() async throws {
        // このテストでは、アプリのバージョンが新しい場合、.noActionが返ることを確認します。
        deviceInfoManagerMock.appVersion = "1.0.0"
        
        let action = try await interactor.determineServiceStatusRespondAction(serviceStatus: await getSampleServiceStatus())
        
        XCTAssertEqual(action, .noAction)
    }
    
    func testDetermineServiceStatusRespondAction_requireAppUpdate() async throws {
        // このテストでは、アプリのバージョンが古い場合、.requireAppUpdateが返ることを確認します。
        deviceInfoManagerMock.appVersion = "0.9.0"
        
        let action = try await interactor.determineServiceStatusRespondAction(serviceStatus: await getSampleServiceStatus())
        
        if case let .requireAppUpdate(updateUrlString) = action {
            XCTAssertEqual(updateUrlString, "http://example.com/update")
        } else {
            XCTFail("Expected .requireAppUpdate, but got \(action)")
        }
    }
    
    // その他のテストケースも同様に追加します。
    
    func getSampleServiceStatus() async -> ServiceStatus {
        let appUpdateInfo = AppUpdateInfo(minimumRequiredAppVersion: "1.0.0", updateUrl: "http://example.com/update")
        let maintenanceInfo = MaintenanceInfo(isMaintenance: false, alertTitle: "Maintenance", alertMessage: "Under maintenance")
        return ServiceStatus(appUpdateInfo: appUpdateInfo, maintenanceInfo: maintenanceInfo)
    }
}
```

このテストクラスでは、それぞれのテストメソッドで`ServiceStatusInteractor`の異なるメソッドをテストします。テストケースには、正常なケースだけでなく、エラーケースも含めることが重要です。

また、`@testable import YourModuleName`の`YourModuleName`は、テスト対象のモジュール名に変更してください。

---
