# Switching to CurrentValueSubject

日付: 2024-08-08

---

## 👤 ユーザー
*2024/08/08 13:03:16*

launchAppCountPublisher によって showIntroduction を trueにしたい。これだと初期値が launchAppCount = 0 であり、sendがないため falseにならない。showIntroductionのデフォルトfalseでlaunchAppCount = 0 のときに send するような仕組みはどうすれば実現できるのか？PassthroughSubjectではなくて、CurrentValueSubjectのほうがよかったりするのか教えて欲しい

/// PropertyWrapper を Sendable 対応する方法がわからず @unchecked Sendable としている
public final class LocalDataStoreDriver: LocalDataStoreDriverProtocol, @unchecked Sendable {
    private nonisolated(unsafe) let isCompletedOnboardingSubject = PassthroughSubject&lt;Bool, Never&gt;()
    private nonisolated(unsafe) let launchAppCountSubject = PassthroughSubject&lt;Int, Never&gt;()

    public var isCompletedOnboardingPublisher: AnyPublisher&lt;Bool, Never&gt; {
        isCompletedOnboardingSubject.eraseToAnyPublisher()
    }
    
    public var launchAppCountPublisher: AnyPublisher&lt;Int, Never&gt; {
        launchAppCountSubject.eraseToAnyPublisher()
    }

    @UserDefaultsWrapper(key: .launchAppCount, defaultValue: 0)
    public var launchAppCount: Int {
        didSet {
            launchAppCountSubject.send(launchAppCount)
        }
    }

    @UserDefaultsWrapper(key: .isCompletedOnboarding, defaultValue: false)
    public var isCompletedOnboarding: Bool {
        didSet {
            isCompletedOnboardingSubject.send(isCompletedOnboarding)
        }
    }

    @UserDefaultsWrapperNilable(key: .apnsToken, defaultValue: nil)
    public var apnsToken: Data?

    @UserDefaultsWrapper(key: .stampHistorys, defaultValue: [StampHistory]())
    public var stampHistorys: [StampHistory]

    /// あまりしたくないが Combine が伝搬されないのでシングルトンにしている。 状態は LocalDataStoreDriver に持たせるのではなくて別の状態を持つ Driver に任せた方がいいかもしれない
    public static let shared = LocalDataStoreDriver()

    private init() {
        OSLogger.initLog()
    }

    deinit {
        OSLogger.deinitLog()
    }

    public func allClear() {
        guard let domain = Bundle.main.bundleIdentifier else {
            OSLogger.errorLog("Bundle.main.bundleIdentifier is nil", level: .fault)
            assertionFailure("Bundle.main.bundleIdentifier is nil")
            return
        }
        UserDefaults.standard.removePersistentDomain(forName: domain)
        OSLogger.debugLog("Completed: clear UserDefaults")
    }

    /// コマンドライン引数で初回起動UIテストモードが有効であれば UserDefaults をクリアにする
    public static func allClearForFirstLaunchUITest() {
        if ProcessInfo.processInfo.arguments.contains(Constants.Arguments.firstLaunchUITest) {
            guard let domain = Bundle.main.bundleIdentifier else {
                OSLogger.errorLog("Bundle.main.bundleIdentifier is nil", level: .fault)
                fatalError("Bundle.main.bundleIdentifier is nil")
            }
            UserDefaults.standard.removePersistentDomain(forName: domain)
            OSLogger.debugLog("Completed: clear UserDefaults for first launch UI Test")
        }
    }
}


@MainActor
final class RootPresenter: ObservableObject {
    @Published var showDebugMenu: Bool = false
    @Published var showIntroduction: Bool = false

    private var cancellables = Set&lt;AnyCancellable&gt;()

    private let localDataStoreDriver: any LocalDataStoreDriverProtocol
    private let logDriver: any LogDriverProtocol
    private let scenePhaseDriver: any ScenePhaseDriverProtocol
    private let pushNotificationDriver: any PushNotificationDriverProtocol

    init(localDataStoreDriver: any LocalDataStoreDriverProtocol = LocalDataStoreDriver.shared, logDriver: any LogDriverProtocol = LogDriver(), scenePhaseDriver: any ScenePhaseDriverProtocol = ScenePhaseDriver(), pushNotificationDriver: any PushNotificationDriverProtocol = FirebasePushNotificationDriver()) {
        self.localDataStoreDriver = localDataStoreDriver
        self.logDriver = logDriver
        self.scenePhaseDriver = scenePhaseDriver
        self.pushNotificationDriver = pushNotificationDriver

        logDriver.initLog()

        AppDelegateNotificationStaticDriver.didRegisterForRemoteNotificationsWithDeviceToken
            .sink { [weak self] deviceToken in
                guard let self else {
                    return
                }
                self.logDriver.debugLog("deviceToken: \(deviceToken.deviceTokenHexString)")
                self.pushNotificationDriver.setApnsToken(apnsToken: deviceToken)
                self.localDataStoreDriver.apnsToken = deviceToken
            }
            .store(in: &cancellables)

        UserNotificationCenterDelegateNotificationStaticDriver.userNotificationCenterDidReceive
            .sink { [weak self] url in
                self?.logDriver.debugLog("Receive URL: \(url.absoluteString)")
                UIApplication.shared.open(url)
            }
            .store(in: &cancellables)

        localDataStoreDriver.launchAppCountPublisher
            .receive(on: DispatchQueue.main)
            .map { launchAppCount in
                print(launchAppCount)
                print(launchAppCount == 0)
                return launchAppCount == 0
            }
            .assign(to: &$showIntroduction)
    }

    deinit {
        logDriver.deinitLog()
    }

    func onAppear() async {
        logDriver.onAppearLog()
    }

    func onDisappear() {
        logDriver.onDisappearLog()
    }

    func onChangeScenePhage(scenePhase: ScenePhase) {
        scenePhaseDriver.changeScenePhase(scenePhase: scenePhase)
    }

    func onOpenUrl(url: URL) {
        logDriver.debugLog("Open Url: \(url.absoluteString)")

        let customUrlSchema = CustomUrlSchema(url: url)
        logDriver.debugLog("CustomUrlSchema: \(customUrlSchema)")

        AppStateSingletonDriver.shared.update(customUrlSchema: customUrlSchema)
    }

    func onShake() {
        showDebugMenu = true
    }
}

---

## 🤖 アシスタント
*2024/08/08 13:03:41*

`PassthroughSubject` では、初期値を設定することができないため、初期値を使いたい場合には `CurrentValueSubject` を使うのが適切です。`CurrentValueSubject` は、初期値を持ち、購読時に最新の値をすぐに取得できます。

`CurrentValueSubject` を使用することで、`launchAppCount` の初期値を設定し、その初期値を `showIntroduction` に反映することができます。以下のように実装を変更できます。

### LocalDataStoreDriverの修正
```swift
public final class LocalDataStoreDriver: LocalDataStoreDriverProtocol, @unchecked Sendable {
    private nonisolated(unsafe) let isCompletedOnboardingSubject = CurrentValueSubject<Bool, Never>(false)
    private nonisolated(unsafe) let launchAppCountSubject = CurrentValueSubject<Int, Never>(0)

    public var isCompletedOnboardingPublisher: AnyPublisher<Bool, Never> {
        isCompletedOnboardingSubject.eraseToAnyPublisher()
    }
    
    public var launchAppCountPublisher: AnyPublisher<Int, Never> {
        launchAppCountSubject.eraseToAnyPublisher()
    }

    @UserDefaultsWrapper(key: .launchAppCount, defaultValue: 0)
    public var launchAppCount: Int {
        didSet {
            launchAppCountSubject.send(launchAppCount)
        }
    }

    @UserDefaultsWrapper(key: .isCompletedOnboarding, defaultValue: false)
    public var isCompletedOnboarding: Bool {
        didSet {
            isCompletedOnboardingSubject.send(isCompletedOnboarding)
        }
    }

    @UserDefaultsWrapperNilable(key: .apnsToken, defaultValue: nil)
    public var apnsToken: Data?

    @UserDefaultsWrapper(key: .stampHistorys, defaultValue: [StampHistory]())
    public var stampHistorys: [StampHistory]

    public static let shared = LocalDataStoreDriver()

    private init() {
        OSLogger.initLog()
        launchAppCountSubject.send(launchAppCount)
        isCompletedOnboardingSubject.send(isCompletedOnboarding)
    }

    deinit {
        OSLogger.deinitLog()
    }

    public func allClear() {
        guard let domain = Bundle.main.bundleIdentifier else {
            OSLogger.errorLog("Bundle.main.bundleIdentifier is nil", level: .fault)
            assertionFailure("Bundle.main.bundleIdentifier is nil")
            return
        }
        UserDefaults.standard.removePersistentDomain(forName: domain)
        OSLogger.debugLog("Completed: clear UserDefaults")
    }

    public static func allClearForFirstLaunchUITest() {
        if ProcessInfo.processInfo.arguments.contains(Constants.Arguments.firstLaunchUITest) {
            guard let domain = Bundle.main.bundleIdentifier else {
                OSLogger.errorLog("Bundle.main.bundleIdentifier is nil", level: .fault)
                fatalError("Bundle.main.bundleIdentifier is nil")
            }
            UserDefaults.standard.removePersistentDomain(forName: domain)
            OSLogger.debugLog("Completed: clear UserDefaults for first launch UI Test")
        }
    }
}
```

### RootPresenterの修正
```swift
@MainActor
final class RootPresenter: ObservableObject {
    @Published var showDebugMenu: Bool = false
    @Published var showIntroduction: Bool = false

    private var cancellables = Set<AnyCancellable>()

    private let localDataStoreDriver: any LocalDataStoreDriverProtocol
    private let logDriver: any LogDriverProtocol
    private let scenePhaseDriver: any ScenePhaseDriverProtocol
    private let pushNotificationDriver: any PushNotificationDriverProtocol

    init(localDataStoreDriver: any LocalDataStoreDriverProtocol = LocalDataStoreDriver.shared, logDriver: any LogDriverProtocol = LogDriver(), scenePhaseDriver: any ScenePhaseDriverProtocol = ScenePhaseDriver(), pushNotificationDriver: any PushNotificationDriverProtocol = FirebasePushNotificationDriver()) {
        self.localDataStoreDriver = localDataStoreDriver
        self.logDriver = logDriver
        self.scenePhaseDriver = scenePhaseDriver
        self.pushNotificationDriver = pushNotificationDriver

        logDriver.initLog()

        AppDelegateNotificationStaticDriver.didRegisterForRemoteNotificationsWithDeviceToken
            .sink { [weak self] deviceToken in
                guard let self else {
                    return
                }
                self.logDriver.debugLog("deviceToken: \(deviceToken.deviceTokenHexString)")
                self.pushNotificationDriver.setApnsToken(apnsToken: deviceToken)
                self.localDataStoreDriver.apnsToken = deviceToken
            }
            .store(in: &cancellables)

        UserNotificationCenterDelegateNotificationStaticDriver.userNotificationCenterDidReceive
            .sink { [weak self] url in
                self?.logDriver.debugLog("Receive URL: \(url.absoluteString)")
                UIApplication.shared.open(url)
            }
            .store(in: &cancellables)

        localDataStoreDriver.launchAppCountPublisher
            .receive(on: DispatchQueue.main)
            .map { launchAppCount in
                return launchAppCount == 0
            }
            .assign(to: &$showIntroduction)
    }

    deinit {
        logDriver.deinitLog()
    }

    func onAppear() async {
        logDriver.onAppearLog()
    }

    func onDisappear() {
        logDriver.onDisappearLog()
    }

    func onChangeScenePhage(scenePhase: ScenePhase) {
        scenePhaseDriver.changeScenePhase(scenePhase: scenePhase)
    }

    func onOpenUrl(url: URL) {
        logDriver.debugLog("Open Url: \(url.absoluteString)")

        let customUrlSchema = CustomUrlSchema(url: url)
        logDriver.debugLog("CustomUrlSchema: \(customUrlSchema)")

        AppStateSingletonDriver.shared.update(customUrlSchema: customUrlSchema)
    }

    func onShake() {
        showDebugMenu = true
    }
}
```

これで、アプリ起動時に `launchAppCount` の初期値が `launchAppCountPublisher` に送信され、 `showIntroduction` が適切に更新されるようになります。

---

## 👤 ユーザー
*2024/08/08 13:05:06*

ちょっと微妙かもしれない。

RootPresenter の initの最後に最新の値をsendするように指示してもいいかもしれない。

---

## 🤖 アシスタント
*2024/08/08 13:05:32*

確かに、`RootPresenter` の初期化時に `launchAppCount` の最新値を明示的に `send` する方法も有効です。これにより、初期化時に最新の値が確実に反映されます。以下にその方法を示します。

### LocalDataStoreDriverの修正（PassthroughSubjectを使用）
```swift
public final class LocalDataStoreDriver: LocalDataStoreDriverProtocol, @unchecked Sendable {
    private nonisolated(unsafe) let isCompletedOnboardingSubject = PassthroughSubject<Bool, Never>()
    private nonisolated(unsafe) let launchAppCountSubject = PassthroughSubject<Int, Never>()

    public var isCompletedOnboardingPublisher: AnyPublisher<Bool, Never> {
        isCompletedOnboardingSubject.eraseToAnyPublisher()
    }
    
    public var launchAppCountPublisher: AnyPublisher<Int, Never> {
        launchAppCountSubject.eraseToAnyPublisher()
    }

    @UserDefaultsWrapper(key: .launchAppCount, defaultValue: 0)
    public var launchAppCount: Int {
        didSet {
            launchAppCountSubject.send(launchAppCount)
        }
    }

    @UserDefaultsWrapper(key: .isCompletedOnboarding, defaultValue: false)
    public var isCompletedOnboarding: Bool {
        didSet {
            isCompletedOnboardingSubject.send(isCompletedOnboarding)
        }
    }

    @UserDefaultsWrapperNilable(key: .apnsToken, defaultValue: nil)
    public var apnsToken: Data?

    @UserDefaultsWrapper(key: .stampHistorys, defaultValue: [StampHistory]())
    public var stampHistorys: [StampHistory]

    public static let shared = LocalDataStoreDriver()

    private init() {
        OSLogger.initLog()
    }

    deinit {
        OSLogger.deinitLog()
    }

    public func allClear() {
        guard let domain = Bundle.main.bundleIdentifier else {
            OSLogger.errorLog("Bundle.main.bundleIdentifier is nil", level: .fault)
            assertionFailure("Bundle.main.bundleIdentifier is nil")
            return
        }
        UserDefaults.standard.removePersistentDomain(forName: domain)
        OSLogger.debugLog("Completed: clear UserDefaults")
    }

    public static func allClearForFirstLaunchUITest() {
        if ProcessInfo.processInfo.arguments.contains(Constants.Arguments.firstLaunchUITest) {
            guard let domain = Bundle.main.bundleIdentifier else {
                OSLogger.errorLog("Bundle.main.bundleIdentifier is nil", level: .fault)
                fatalError("Bundle.main.bundleIdentifier is nil")
            }
            UserDefaults.standard.removePersistentDomain(forName: domain)
            OSLogger.debugLog("Completed: clear UserDefaults for first launch UI Test")
        }
    }
}
```

### RootPresenterの修正
```swift
@MainActor
final class RootPresenter: ObservableObject {
    @Published var showDebugMenu: Bool = false
    @Published var showIntroduction: Bool = false

    private var cancellables = Set<AnyCancellable>()

    private let localDataStoreDriver: any LocalDataStoreDriverProtocol
    private let logDriver: any LogDriverProtocol
    private let scenePhaseDriver: any ScenePhaseDriverProtocol
    private let pushNotificationDriver: any PushNotificationDriverProtocol

    init(localDataStoreDriver: any LocalDataStoreDriverProtocol = LocalDataStoreDriver.shared, logDriver: any LogDriverProtocol = LogDriver(), scenePhaseDriver: any ScenePhaseDriverProtocol = ScenePhaseDriver(), pushNotificationDriver: any PushNotificationDriverProtocol = FirebasePushNotificationDriver()) {
        self.localDataStoreDriver = localDataStoreDriver
        self.logDriver = logDriver
        self.scenePhaseDriver = scenePhaseDriver
        self.pushNotificationDriver = pushNotificationDriver

        logDriver.initLog()

        AppDelegateNotificationStaticDriver.didRegisterForRemoteNotificationsWithDeviceToken
            .sink { [weak self] deviceToken in
                guard let self else {
                    return
                }
                self.logDriver.debugLog("deviceToken: \(deviceToken.deviceTokenHexString)")
                self.pushNotificationDriver.setApnsToken(apnsToken: deviceToken)
                self.localDataStoreDriver.apnsToken = deviceToken
            }
            .store(in: &cancellables)

        UserNotificationCenterDelegateNotificationStaticDriver.userNotificationCenterDidReceive
            .sink { [weak self] url in
                self?.logDriver.debugLog("Receive URL: \(url.absoluteString)")
                UIApplication.shared.open(url)
            }
            .store(in: &cancellables)

        localDataStoreDriver.launchAppCountPublisher
            .receive(on: DispatchQueue.main)
            .map { launchAppCount in
                return launchAppCount == 0
            }
            .assign(to: &$showIntroduction)

        // 初期化時に最新の値を送信
        localDataStoreDriver.launchAppCountSubject.send(localDataStoreDriver.launchAppCount)
    }

    deinit {
        logDriver.deinitLog()
    }

    func onAppear() async {
        logDriver.onAppearLog()
    }

    func onDisappear() {
        logDriver.onDisappearLog()
    }

    func onChangeScenePhage(scenePhase: ScenePhase) {
        scenePhaseDriver.changeScenePhase(scenePhase: scenePhase)
    }

    func onOpenUrl(url: URL) {
        logDriver.debugLog("Open Url: \(url.absoluteString)")

        let customUrlSchema = CustomUrlSchema(url: url)
        logDriver.debugLog("CustomUrlSchema: \(customUrlSchema)")

        AppStateSingletonDriver.shared.update(customUrlSchema: customUrlSchema)
    }

    func onShake() {
        showDebugMenu = true
    }
}
```

これで、`RootPresenter` の初期化時に `launchAppCount` の最新の値が送信され、`showIntroduction` が適切に更新されるようになります。

---

## 👤 ユーザー
*2024/08/08 13:05:54*

違う違う。LocalDataStoreDriver に最新のパブリッシュを更新するようなメソッドを追加して欲しいんだ。

---

## 🤖 アシスタント
*2024/08/08 13:06:21*

了解しました。`LocalDataStoreDriver` に最新の値をパブリッシュするメソッドを追加します。`RootPresenter` の初期化時にそのメソッドを呼び出すことで、最新の値が確実にパブリッシュされるようにします。

以下にその修正を示します。

### LocalDataStoreDriverの修正
```swift
public final class LocalDataStoreDriver: LocalDataStoreDriverProtocol, @unchecked Sendable {
    private nonisolated(unsafe) let isCompletedOnboardingSubject = PassthroughSubject<Bool, Never>()
    private nonisolated(unsafe) let launchAppCountSubject = PassthroughSubject<Int, Never>()

    public var isCompletedOnboardingPublisher: AnyPublisher<Bool, Never> {
        isCompletedOnboardingSubject.eraseToAnyPublisher()
    }
    
    public var launchAppCountPublisher: AnyPublisher<Int, Never> {
        launchAppCountSubject.eraseToAnyPublisher()
    }

    @UserDefaultsWrapper(key: .launchAppCount, defaultValue: 0)
    public var launchAppCount: Int {
        didSet {
            launchAppCountSubject.send(launchAppCount)
        }
    }

    @UserDefaultsWrapper(key: .isCompletedOnboarding, defaultValue: false)
    public var isCompletedOnboarding: Bool {
        didSet {
            isCompletedOnboardingSubject.send(isCompletedOnboarding)
        }
    }

    @UserDefaultsWrapperNilable(key: .apnsToken, defaultValue: nil)
    public var apnsToken: Data?

    @UserDefaultsWrapper(key: .stampHistorys, defaultValue: [StampHistory]())
    public var stampHistorys: [StampHistory]

    public static let shared = LocalDataStoreDriver()

    private init() {
        OSLogger.initLog()
    }

    deinit {
        OSLogger.deinitLog()
    }

    public func allClear() {
        guard let domain = Bundle.main.bundleIdentifier else {
            OSLogger.errorLog("Bundle.main.bundleIdentifier is nil", level: .fault)
            assertionFailure("Bundle.main.bundleIdentifier is nil")
            return
        }
        UserDefaults.standard.removePersistentDomain(forName: domain)
        OSLogger.debugLog("Completed: clear UserDefaults")
    }

    public static func allClearForFirstLaunchUITest() {
        if ProcessInfo.processInfo.arguments.contains(Constants.Arguments.firstLaunchUITest) {
            guard let domain = Bundle.main.bundleIdentifier else {
                OSLogger.errorLog("Bundle.main.bundleIdentifier is nil", level: .fault)
                fatalError("Bundle.main.bundleIdentifier is nil")
            }
            UserDefaults.standard.removePersistentDomain(forName: domain)
            OSLogger.debugLog("Completed: clear UserDefaults for first launch UI Test")
        }
    }

    // 最新の値を送信するメソッドを追加
    public func publishCurrentValues() {
        launchAppCountSubject.send(launchAppCount)
        isCompletedOnboardingSubject.send(isCompletedOnboarding)
    }
}
```

### RootPresenterの修正
```swift
@MainActor
final class RootPresenter: ObservableObject {
    @Published var showDebugMenu: Bool = false
    @Published var showIntroduction: Bool = false

    private var cancellables = Set<AnyCancellable>()

    private let localDataStoreDriver: any LocalDataStoreDriverProtocol
    private let logDriver: any LogDriverProtocol
    private let scenePhaseDriver: any ScenePhaseDriverProtocol
    private let pushNotificationDriver: any PushNotificationDriverProtocol

    init(localDataStoreDriver: any LocalDataStoreDriverProtocol = LocalDataStoreDriver.shared, logDriver: any LogDriverProtocol = LogDriver(), scenePhaseDriver: any ScenePhaseDriverProtocol = ScenePhaseDriver(), pushNotificationDriver: any PushNotificationDriverProtocol = FirebasePushNotificationDriver()) {
        self.localDataStoreDriver = localDataStoreDriver
        self.logDriver = logDriver
        self.scenePhaseDriver = scenePhaseDriver
        self.pushNotificationDriver = pushNotificationDriver

        logDriver.initLog()

        AppDelegateNotificationStaticDriver.didRegisterForRemoteNotificationsWithDeviceToken
            .sink { [weak self] deviceToken in
                guard let self else {
                    return
                }
                self.logDriver.debugLog("deviceToken: \(deviceToken.deviceTokenHexString)")
                self.pushNotificationDriver.setApnsToken(apnsToken: deviceToken)
                self.localDataStoreDriver.apnsToken = deviceToken
            }
            .store(in: &cancellables)

        UserNotificationCenterDelegateNotificationStaticDriver.userNotificationCenterDidReceive
            .sink { [weak self] url in
                self?.logDriver.debugLog("Receive URL: \(url.absoluteString)")
                UIApplication.shared.open(url)
            }
            .store(in: &cancellables)

        localDataStoreDriver.launchAppCountPublisher
            .receive(on: DispatchQueue.main)
            .map { launchAppCount in
                return launchAppCount == 0
            }
            .assign(to: &$showIntroduction)

        // 初期化時に最新の値を送信
        localDataStoreDriver.publishCurrentValues()
    }

    deinit {
        logDriver.deinitLog()
    }

    func onAppear() async {
        logDriver.onAppearLog()
    }

    func onDisappear() {
        logDriver.onDisappearLog()
    }

    func onChangeScenePhage(scenePhase: ScenePhase) {
        scenePhaseDriver.changeScenePhase(scenePhase: scenePhase)
    }

    func onOpenUrl(url: URL) {
        logDriver.debugLog("Open Url: \(url.absoluteString)")

        let customUrlSchema = CustomUrlSchema(url: url)
        logDriver.debugLog("CustomUrlSchema: \(customUrlSchema)")

        AppStateSingletonDriver.shared.update(customUrlSchema: customUrlSchema)
    }

    func onShake() {
        showDebugMenu = true
    }
}
```

これで、`RootPresenter` の初期化時に `LocalDataStoreDriver` の `publishCurrentValues` メソッドを呼び出し、最新の値がパブリッシュされるようになります。

---

## 👤 ユーザー
*2024/08/08 13:06:43*

関数の候補名をいくつか挙げて欲しい

publishCurrentValues

---

## 🤖 アシスタント
*2024/08/08 13:06:46*

`publishCurrentValues` の他に、いくつかの候補名を挙げます。

1. `sendInitialValues`
2. `broadcastCurrentState`
3. `emitStoredValues`
4. `dispatchCurrentValues`
5. `notifyInitialValues`
6. `updatePublishers`
7. `syncCurrentValues`
8. `pushStoredValues`
9. `triggerInitialPublish`
10. `initializePublishers`

これらの名前は、関数の意図（現在の値を送信すること）を明確に示しています。選択する際には、プロジェクト内での一貫性や命名規則に従うことをお勧めします。

---
