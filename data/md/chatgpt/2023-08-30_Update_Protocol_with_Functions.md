# Update Protocol with Functions

日付: 2023-08-30

---

## 👤 ユーザー
*2023/08/30 11:17:50*

func update(appUserId: OptionalString) のように変数について、launchAppCount以下の変数にupdate関数をつけて、setのprotocolを排除して欲しい


public protocol UserDefaultsManagerProtocol: AnyObject {
    var isLoginSessionValidPublisher: AnyPublisher&lt;Bool, Never&gt; { get }
    var isAppIntroductionShownPublisher: AnyPublisher&lt;Bool, Never&gt; { get }
    var isUserAttributesRegisteredPublisher: AnyPublisher&lt;Bool, Never&gt; { get }
    var isDeviceAccessRequestShownPublisher: AnyPublisher&lt;Bool, Never&gt; { get }
    var isGazeCalibrationDonePublisher: AnyPublisher&lt;Bool, Never&gt; { get }
    var portraitCalibrationDataPublisher: AnyPublisher&lt;OptionalDoubleArray, Never&gt; { get }
    var landscapeLeftCalibrationDataPublisher: AnyPublisher&lt;OptionalDoubleArray, Never&gt; { get }
    var isEnableAppLogAnalyticsPublisher: AnyPublisher&lt;Bool, Never&gt; { get }

    var launchAppCount: Int { get set }
    var appUserId: OptionalString { get }
    var isLoginSessionValid: Bool { get set }
    var isAppIntroductionShown: Bool { get set }
    var isUserAttributesRegistered: Bool { get set }
    var isDeviceAccessRequestShown: Bool { get set }
    var isGazeCalibrationDone: Bool { get set }
    var portraitCalibrationData: OptionalDoubleArray { get set }
    var landscapeRightCalibrationData: OptionalDoubleArray { get set }
    var isEnableAppLogAnalytics: Bool { get set }

    /// 以下は debug 時のみ使用している
    var isEnableJSONEncode: Bool { get set }
    var isEnableLocalBackup: Bool { get set }
    var isEnableSavingImagesWhileCapturing: Bool { get set }
    var isEnableAnchorDebugView: Bool { get set }
    var isEnableEmotionDebugView: Bool { get set }
    var isEnableInteractionDebugView: Bool { get set }
    
    func update(appUserId: OptionalString)
}

---

## 🤖 アシスタント
*2023/08/30 11:18:33*

Based on your request, I will make the following changes to the protocol:

1. Remove the `set` access from all properties except for `launchAppCount`.
2. Add `update` functions for each of the properties that previously had `set` access.

Here's the modified protocol:

```swift
public protocol UserDefaultsManagerProtocol: AnyObject {
    var isLoginSessionValidPublisher: AnyPublisher<Bool, Never> { get }
    var isAppIntroductionShownPublisher: AnyPublisher<Bool, Never> { get }
    var isUserAttributesRegisteredPublisher: AnyPublisher<Bool, Never> { get }
    var isDeviceAccessRequestShownPublisher: AnyPublisher<Bool, Never> { get }
    var isGazeCalibrationDonePublisher: AnyPublisher<Bool, Never> { get }
    var portraitCalibrationDataPublisher: AnyPublisher<OptionalDoubleArray, Never> { get }
    var landscapeLeftCalibrationDataPublisher: AnyPublisher<OptionalDoubleArray, Never> { get }
    var isEnableAppLogAnalyticsPublisher: AnyPublisher<Bool, Never> { get }

    var launchAppCount: Int { get set } // This remains unchanged as per your request.
    var appUserId: OptionalString { get }
    var isLoginSessionValid: Bool { get }
    var isAppIntroductionShown: Bool { get }
    var isUserAttributesRegistered: Bool { get }
    var isDeviceAccessRequestShown: Bool { get }
    var isGazeCalibrationDone: Bool { get }
    var portraitCalibrationData: OptionalDoubleArray { get }
    var landscapeRightCalibrationData: OptionalDoubleArray { get }
    var isEnableAppLogAnalytics: Bool { get }

    /// For debug use only
    var isEnableJSONEncode: Bool { get }
    var isEnableLocalBackup: Bool { get }
    var isEnableSavingImagesWhileCapturing: Bool { get }
    var isEnableAnchorDebugView: Bool { get }
    var isEnableEmotionDebugView: Bool { get }
    var isEnableInteractionDebugView: Bool { get }
    
    // Update functions for each property
    func update(appUserId: OptionalString)
    func update(isLoginSessionValid: Bool)
    func update(isAppIntroductionShown: Bool)
    func update(isUserAttributesRegistered: Bool)
    func update(isDeviceAccessRequestShown: Bool)
    func update(isGazeCalibrationDone: Bool)
    func update(portraitCalibrationData: OptionalDoubleArray)
    func update(landscapeRightCalibrationData: OptionalDoubleArray)
    func update(isEnableAppLogAnalytics: Bool)
    func update(isEnableJSONEncode: Bool)
    func update(isEnableLocalBackup: Bool)
    func update(isEnableSavingImagesWhileCapturing: Bool)
    func update(isEnableAnchorDebugView: Bool)
    func update(isEnableEmotionDebugView: Bool)
    func update(isEnableInteractionDebugView: Bool)
}
```

This revised protocol meets your requirement of having `update` functions for the properties instead of direct setters (with the exception of `launchAppCount`).

---

## 👤 ユーザー
*2023/08/31 17:42:38*

func update(launchAppCount: Int) のように他の関数も全部保管して欲しい

public class UserDefaultsManager: UserDefaultsManagerProtocol {
    public func update(launchAppCount: Int) {
        self.launchAppCount = launchAppCount
    }
    
    public func update(appUserId: OptionalString) {
        &lt;#code#&gt;
    }
    
    public func update(isLoginSessionValid: Bool) {
        &lt;#code#&gt;
    }
    
    public func update(isAppIntroductionShown: Bool) {
        &lt;#code#&gt;
    }
    
    public func update(isUserAttributesRegistered: Bool) {
        &lt;#code#&gt;
    }
    
    public func update(isDeviceAccessRequestShown: Bool) {
        &lt;#code#&gt;
    }
    
    public func update(isGazeCalibrationDone: Bool) {
        &lt;#code#&gt;
    }
    
    public func update(portraitCalibrationData: OptionalDoubleArray) {
        &lt;#code#&gt;
    }
    
    public func update(landscapeRightCalibrationData: OptionalDoubleArray) {
        &lt;#code#&gt;
    }
    
    public func update(isEnableAppLogAnalytics: Bool) {
        &lt;#code#&gt;
    }
    
    public func update(isEnableJSONEncode: Bool) {
        &lt;#code#&gt;
    }
    
    public func update(isEnableLocalBackup: Bool) {
        &lt;#code#&gt;
    }
    
    public func update(isEnableSavingImagesWhileCapturing: Bool) {
        &lt;#code#&gt;
    }
    
    public func update(isEnableAnchorDebugView: Bool) {
        &lt;#code#&gt;
    }
    
    public func update(isEnableEmotionDebugView: Bool) {
        &lt;#code#&gt;
    }
    
    public func update(isEnableInteractionDebugView: Bool) {
        &lt;#code#&gt;
    }
    }

---

## 🤖 アシスタント
*2023/08/31 17:43:29*

Based on your requirement, I understand that you want to implement the `update` functions in the `UserDefaultsManager` class for each property. Here's how you can do it:

```swift
public class UserDefaultsManager: UserDefaultsManagerProtocol {

    // Assuming you have properties declared for each of these as per the protocol. 
    // E.g.:
    // public var launchAppCount: Int = 0
    // ... (and so on for other properties)

    public func update(launchAppCount: Int) {
        self.launchAppCount = launchAppCount
    }
    
    public func update(appUserId: OptionalString) {
        self.appUserId = appUserId
    }
    
    public func update(isLoginSessionValid: Bool) {
        self.isLoginSessionValid = isLoginSessionValid
    }
    
    public func update(isAppIntroductionShown: Bool) {
        self.isAppIntroductionShown = isAppIntroductionShown
    }
    
    public func update(isUserAttributesRegistered: Bool) {
        self.isUserAttributesRegistered = isUserAttributesRegistered
    }
    
    public func update(isDeviceAccessRequestShown: Bool) {
        self.isDeviceAccessRequestShown = isDeviceAccessRequestShown
    }
    
    public func update(isGazeCalibrationDone: Bool) {
        self.isGazeCalibrationDone = isGazeCalibrationDone
    }
    
    public func update(portraitCalibrationData: OptionalDoubleArray) {
        self.portraitCalibrationData = portraitCalibrationData
    }
    
    public func update(landscapeRightCalibrationData: OptionalDoubleArray) {
        self.landscapeRightCalibrationData = landscapeRightCalibrationData
    }
    
    public func update(isEnableAppLogAnalytics: Bool) {
        self.isEnableAppLogAnalytics = isEnableAppLogAnalytics
    }
    
    public func update(isEnableJSONEncode: Bool) {
        self.isEnableJSONEncode = isEnableJSONEncode
    }
    
    public func update(isEnableLocalBackup: Bool) {
        self.isEnableLocalBackup = isEnableLocalBackup
    }
    
    public func update(isEnableSavingImagesWhileCapturing: Bool) {
        self.isEnableSavingImagesWhileCapturing = isEnableSavingImagesWhileCapturing
    }
    
    public func update(isEnableAnchorDebugView: Bool) {
        self.isEnableAnchorDebugView = isEnableAnchorDebugView
    }
    
    public func update(isEnableEmotionDebugView: Bool) {
        self.isEnableEmotionDebugView = isEnableEmotionDebugView
    }
    
    public func update(isEnableInteractionDebugView: Bool) {
        self.isEnableInteractionDebugView = isEnableInteractionDebugView
    }
}
```

Make sure that you have the appropriate property declarations for each of the properties in the `UserDefaultsManager` class, as mentioned in the comment.

---
