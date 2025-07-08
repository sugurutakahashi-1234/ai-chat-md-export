# エラー: fullScreenCover

Date: 2023-06-20

---

## 👤 User
*2023-06-21 02:06:04*

以下のコードについてfullScreenCoverの部分処理で、orientationの値によって挙動を変えたいがエラーになってしまっている。どうすればいいか案を推して欲しい、


public struct GazeTrackCalibrationView: View {
    @Environment(\.dismiss) private var dismiss
    @StateObject private var presenter: GazeTrackCalibrationPresenter

    public init(orientation: AppUIInterfaceOrientation) {
        _presenter = StateObject(wrappedValue: GazeTrackCalibrationPresenter(orientation: orientation))
    }

    public var body: some View {
        ZStack {
            CoreAssets.Color.Neutral.black.swiftUIColor
                .frame(maxWidth: .infinity, maxHeight: .infinity)

            VStack {
                // TODO: Spacer()によらない高さ調整（横画面対応も考えると難しかも？）
                Spacer()
                Spacer()
                Text("スマートフォンを顔から30cmほどはなして、\n画面上の赤い丸を見続けてください")
                    .typographyStyle(.body2)
                    .foregroundColor(CoreAssets.Color.Neutral.white.swiftUIColor)
                    .multilineTextAlignment(.center)
                Spacer()
                Button {
                    presenter.calibrationStartButtonTapped()
                } label: {
                    Text("キャリブレーションを開始する")
                }
                .buttonStyle(CustomButtonStyle(.primary))
                .disabled(!presenter.canStartCalibration)
                .padding(.horizontal, 24)
                .padding(.bottom, 42)
            }
            .isHidden(presenter.isCalibrating, remove: true)

            ProgressCircle(progressPercentage: presenter.progressPercentage, position: presenter.calibrationPoint)
        }
        .edgesIgnoringSafeArea(.all)
        .alert(isPresented: $presenter.shouldShowAlert) {
            // TODO: エラー設計
            Alert(title: Text("Error"),
                  message: Text(presenter.error?.localizedDescription ?? "Unknown Error"),
                  dismissButton: .default(Text("OK")))
        }
        .fullScreenCover(isPresented: $presenter.shouldShowNextScreen) {
            if presenter.orientation == .portrait {
                GazeTrackCalibrationView(orientation: .landscapeLeft)
            } else {
                dismiss.callAsFunction()
            }
        }
        .onAppear {
            presenter.onAppear()
        }
        .onDisappear {
            presenter.onDisappear()
        }
    }
}


final class GazeTrackCalibrationPresenter: ObservableObject {
    @Published private(set) var canStartCalibration = false
    @Published private(set) var isCalibrating = false
    @Published private(set) var calibrationPoint: CGPoint?
    @Published private(set) var progressPercentage: Int?
    @Published private(set) var error: Error?
    @Published var shouldShowAlert = false
    @Published var shouldShowNextScreen = false
    let orientation: AppUIInterfaceOrientation
    private var gazeTrackCalibrationInteractor: GazeTrackCalibrationInteractorProtocol
    private var userDefaultsManager: UserDefaultsManagerProtocol
    private var cancellableSet = Set&lt;AnyCancellable&gt;()

    init(
        orientation: AppUIInterfaceOrientation,
        gazeTrackCalibrationInteractor: GazeTrackCalibrationInteractorProtocol = GazeTrackCalibrationInteractor(),
        userDefaultsManager: UserDefaultsManagerProtocol = UserDefaultsManager()
    ) {
        self.orientation = orientation
        self.gazeTrackCalibrationInteractor = gazeTrackCalibrationInteractor
        self.userDefaultsManager = userDefaultsManager

        gazeTrackCalibrationInteractor.initializedTrackerPublisher
            .map { true }
            .assign(to: &$canStartCalibration)

        gazeTrackCalibrationInteractor.calibrationNextPointPublisher
            .map { x, y -&gt; CGPoint in
                CGPoint(x: x, y: y)
            }
            .assign(to: &$calibrationPoint)

        gazeTrackCalibrationInteractor.progressPublisher
            .map { Int($0 * 100) }
            .assign(to: &$progressPercentage)

        gazeTrackCalibrationInteractor.completedCalibrationPublisher
            .sink { [weak self] calibrationData in
                self?.completedCalibration(calibrationData: calibrationData)
            }
            .store(in: &cancellableSet)

        gazeTrackCalibrationInteractor.errorPublisher
            .sink { [weak self] error in
                AppLogger.debugLog("gaze track calibration interactor error: \(error)", level: .error)
                self?.error = error
                self?.shouldShowAlert = true
            }
            .store(in: &cancellableSet)
    }

    func calibrationStartButtonTapped() {
        do {
            try gazeTrackCalibrationInteractor.startCalibration()
            isCalibrating = true
        } catch {
            AppLogger.debugLog("start calibration error: \(error)", level: .error)
            self.error = error
            shouldShowAlert = true
        }
    }

    func onAppear() {
        AppOrientationManager.updateUserInterfaceOrientationMask(appUIInterfaceOrientation: orientation)
    }

    func onDisappear() {
        AppOrientationManager.updateUserInterfaceOrientationMask(appUIInterfaceOrientation: .portrait)
    }
}

private extension GazeTrackCalibrationPresenter {
    func completedCalibration(calibrationData: [Double]) {
        switch orientation {
        case .portrait:
            userDefaultsManager.portraitCalibrationData = calibrationData
        case .landscapeLeft:
            userDefaultsManager.landscapeLeftCalibrationData = calibrationData
        }

        do {
            try gazeTrackCalibrationInteractor.endCalibration()
        } catch {
            AppLogger.debugLog("end calibration error: \(error)", level: .error)
            self.error = error
            shouldShowAlert = true
        }

        shouldShowNextScreen = true
    }
}

---

## 🤖 Assistant
*2023-06-21 02:06:53*

このコードで発生している問題は、`fullScreenCover`内部のロジックが `View` プロトコルを適用したボディの一部として見られているため、ビルド時に条件分岐が行えないことに起因しています。

SwiftUIの`View`プロトコルは、`some View`として表現される、一種の不透明タイプを返す必要があります。これにより、全ての制御パスが同じ具体的な`View`タイプを返すことが保証されます。このコードでは、`if`と`else`の両方のパスで異なるタイプの`View`（一方は`GazeTrackCalibrationView`、他方は何も返さない）を返そうとしているため、エラーが発生します。

これを解決するための一つの方法は、`AnyView`タイプを使用して、具体的な`View`タイプを抽象化することです。以下のように変更することで、ビルドエラーを解消できます：

```swift
.fullScreenCover(isPresented: $presenter.shouldShowNextScreen) {
    if presenter.orientation == .portrait {
        AnyView(GazeTrackCalibrationView(orientation: .landscapeLeft))
    } else {
        AnyView(EmptyView())
    }
}
```

この変更により、`if`と`else`の両方のパスが同じタイプ（具体的には`AnyView`）を返すようになり、エラーは解消されます。ただし、`AnyView`はビュー階層をラップするため、ビューの再揎画が頻繁に起こる場合にはパフォーマンスに影響を及ぼす可能性があります。そのため、これが最善の解決策であるかどうかは、アプリケーションの具体的な要件とパフォーマンス要件によります。

---

## 👤 User
*2023-06-21 02:08:10*

なるほど、presenter.orientation == .portrait でなかったらこのViewをdismiss.callAsFunction()したいんだけどそれはできないのかな？

---

## 🤖 Assistant
*2023-06-21 02:57:14*

`dismiss`を`fullScreenCover`内部で呼び出すことはできますが、その場合も引き続き何らかのViewを返す必要があります。`dismiss.callAsFunction()`は`View`を返さないため、直接的にそれを使用することはできません。

解決策の一つとして、次のように`DispatchQueue.main.async`を使用して非同期的にdismissを呼び出すことができます。そして、具体的な`View`としては`EmptyView()`を返します：

```swift
.fullScreenCover(isPresented: $presenter.shouldShowNextScreen) {
    if presenter.orientation == .portrait {
        AnyView(GazeTrackCalibrationView(orientation: .landscapeLeft))
    } else {
        DispatchQueue.main.async {
            dismiss.callAsFunction()
        }
        return AnyView(EmptyView())
    }
}
```

これにより、必要なViewが返されつつ、非同期的に`dismiss`が呼び出されます。ただし、この方法も`AnyView`を使用しているため、上記のパフォーマンスに関する注意点は適用されます。

---
