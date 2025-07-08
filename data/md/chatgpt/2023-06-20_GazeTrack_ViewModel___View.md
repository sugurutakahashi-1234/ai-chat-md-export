# GazeTrack ViewModel & View

Date: 2023-06-20

---

## 👤 User
*2023-06-20 11:22:04*

このインタラクターを使うViewModelとViewのサンプルコード作成してほしい

// TODO: 仮であるがアプリ内ではこの2つしか場合分けがないので、この2つに集約するようなOrientationを表す型があるとよい
public enum Orientation {
    case portrait
    case landscape
}

public protocol GazeTrackCalibrationInteractorProtocol: AnyObject {
    var calibrationNextPointPublisher: AnyPublisher&lt;(x: Double, y: Double), Never&gt; { get }
    var progressPublisher: AnyPublisher&lt;Double, Never&gt; { get }
    var errorPublisher: AnyPublisher&lt;Error, Never&gt; { get }

    func startCalibration() throws
}

// TODO: 適切な場所に移動する（Mission or ここでもよさそう）
public final class GazeTrackCalibrationInteractor: GazeTrackCalibrationInteractorProtocol {
    private let calibrationNextPointSubject = PassthroughSubject&lt;(x: Double, y: Double), Never&gt;()
    private let progressSubject = PassthroughSubject&lt;Double, Never&gt;()
    private let errorSubject = PassthroughSubject&lt;Error, Never&gt;()
    private let orientation: Orientation
    private let gazeTrackManager: GazeTrackManagerProtocol
    private var userDefaultsManager: UserDefaultsManagerProtocol
    private var cancellableSet = Set&lt;AnyCancellable&gt;()

    public var calibrationNextPointPublisher: AnyPublisher&lt;(x: Double, y: Double), Never&gt; {
        calibrationNextPointSubject.eraseToAnyPublisher()
    }

    public var progressPublisher: AnyPublisher&lt;Double, Never&gt; {
        progressSubject.eraseToAnyPublisher()
    }

    public var errorPublisher: AnyPublisher&lt;Error, Never&gt; {
        errorSubject.eraseToAnyPublisher()
    }

    public init(
        orientation: Orientation,
        gazeTrackManager: GazeTrackManagerProtocol = SeeSoGazeTrackManager(),
        userDefaultsManager: UserDefaultsManagerProtocol = UserDefaultsManager()
    ) {
        self.orientation = orientation
        self.gazeTrackManager = gazeTrackManager
        self.userDefaultsManager = userDefaultsManager

        gazeTrackManager
            .gazeTrackEventPublisher
            .sink { [weak self] event in
                guard let self else { return }

                switch event {
                case .initialized(let trackerVoid, let error):
                    AppLogger.debugLog("Event: \(event), TrackerVoid: \(String(describing: trackerVoid)), Error: \(error)")

                    self.errorSubject.send(error)

                case .started:
                    AppLogger.debugLog("Event: \(event)")

                case .stopped(let error):
                    AppLogger.debugLog("Event: \(event), Error: \(error)", level: .error)

                    self.errorSubject.send(error)

                case .gaze(let gazeInformation):
                    AppLogger.debugLog("Event: \(event), Gaze Information: \(gazeInformation)")

                case .calibrationNextPoint(let x, let y):
                    AppLogger.debugLog("Event: \(event), X: \(x), Y: \(y)")

                    do {
                        try self.gazeTrackManager.startCalibrationCollectSamples()
                    } catch {
                        self.errorSubject.send(error)
                    }

                case .calibrationProgress(let progress):
                    AppLogger.debugLog("Event: \(event), Progress: \(progress)")
                    
                    self.progressSubject.send(progress)

                case .calibrationFinished(let calibrationData):
                    AppLogger.debugLog("Event: \(event), Calibration Data: \(calibrationData)")

                    switch orientation {
                    case .portrait:
                        self.userDefaultsManager.portraitCalibrationData = calibrationData
                    case .landscape:
                        self.userDefaultsManager.landscapeLeftCalibrationData = calibrationData
                    }

                    self.calibrationNextPointSubject.send(completion: .finished)

                case .image(let timestamp, let image):
                    AppLogger.debugLog("Event: \(event), Timestamp: \(timestamp), Image: \(image)")

                case .attention(let timestampBegin, let timestampEnd, let score):
                    AppLogger.debugLog("Event: \(event), Timestamp Begin: \(timestampBegin), Timestamp End: \(timestampEnd), Score: \(score)")

                case .blink(let timestamp, let isBlinkLeft, let isBlinkRight, let isBlink, let eyeOpenness):
                    AppLogger.debugLog("Event: \(event), Timestamp: \(timestamp), Is Blink Left: \(isBlinkLeft), Is Blink Right: \(isBlinkRight), Is Blink: \(isBlink), Eye Openness: \(eyeOpenness)")

                case .drowsiness(let timestamp, let isDrowsiness):
                    AppLogger.debugLog("Event: \(event), Timestamp: \(timestamp), Is Drowsiness: \(isDrowsiness)")
                }
            }
            .store(in: &cancellableSet)
    }

    public func startCalibration() throws {
        try gazeTrackManager.startCalibration()
    }
}

---

## 🤖 Assistant
*2023-06-20 11:23:02*

あなたの要求に基づいて、これがあなたのInteractorと対応するViewとViewModelの一部として適用できるコードの一部です。

まず、ViewModelを定義しましょう。これはInteractorを使用してViewと通信します。なお、すべてのPublisherの出力を@Publishedでラップすることを強く推奨します。これにより、SwiftUIのViewは値が変更されるたびに更新できます。

```swift
import Combine
import SwiftUI

class GazeTrackCalibrationViewModel: ObservableObject {
    private var interactor: GazeTrackCalibrationInteractorProtocol
    private var cancellables = Set<AnyCancellable>()

    @Published var calibrationPoint: (x: Double, y: Double)?
    @Published var progress: Double = 0.0
    @Published var error: Error?

    init(interactor: GazeTrackCalibrationInteractorProtocol) {
        self.interactor = interactor

        interactor.calibrationNextPointPublisher
            .assign(to: \.calibrationPoint, on: self)
            .store(in: &cancellables)

        interactor.progressPublisher
            .assign(to: \.progress, on: self)
            .store(in: &cancellables)

        interactor.errorPublisher
            .assign(to: \.error, on: self)
            .store(in: &cancellables)
    }

    func startCalibration() {
        do {
            try interactor.startCalibration()
        } catch {
            self.error = error
        }
    }
}
```

そして、Viewを作成します。このViewはViewModelを通じてInteractorと対話します。

```swift
struct GazeTrackCalibrationView: View {
    @ObservedObject var viewModel: GazeTrackCalibrationViewModel

    var body: some View {
        VStack {
            Text("Calibration Progress: \(viewModel.progress)")
            Text("Calibration Point: \(viewModel.calibrationPoint?.x ?? 0.0), \(viewModel.calibrationPoint?.y ?? 0.0)")
            if let error = viewModel.error {
                Text("Error: \(error.localizedDescription)")
            }
            Button("Start Calibration") {
                viewModel.startCalibration()
            }
        }
    }
}
```

ここでは、`ObservableObject`プロトコルを実装した`GazeTrackCalibrationViewModel`を`GazeTrackCalibrationView`の`@ObservedObject`として使用します。これにより、ViewはViewModelの状態の変更を自動的に検出し、反映します。

なお、具体的な実装はあなたのプロジェクトの詳細によって異なるため、上記のコードは参考の一部として使ってください。

---

## 👤 User
*2023-06-20 11:24:24*

cancellablesの変数がなくても実装できないかな？

---

## 🤖 Assistant
*2023-06-20 11:25:06*

SwiftUIの`@Published`を使うと、ViewModelが更新されたときにViewが更新されるように、PublisherとSubscriberの接続を自動的に管理します。そのため、明示的にCancellableを管理する必要はありません。

ただし、Combineフレームワークでは、Subscriberが解放されると同時にSubscriptionも解放されます。したがって、Cancellablesを管理しない場合、Subscriptionは直ちに解放されてしまい、値の更新が受け取れなくなります。したがって、通常はCancellablesを管理するための変数を持つことが一般的です。

しかし、`assign(to:on:)`を使って直接プロパティに値を割り当てると、Cancellableを管理する必要がなくなります。これは自動的にCancellableを管理し、対象のオブジェクトが解放されるときに自動的に解放されます。

そのため、次のようにViewModelを書き換えることができます：

```swift
class GazeTrackCalibrationViewModel: ObservableObject {
    private var interactor: GazeTrackCalibrationInteractorProtocol

    @Published var calibrationPoint: (x: Double, y: Double)?
    @Published var progress: Double = 0.0
    @Published var error: Error?

    init(interactor: GazeTrackCalibrationInteractorProtocol) {
        self.interactor = interactor

        interactor.calibrationNextPointPublisher
            .assign(to: &$calibrationPoint)

        interactor.progressPublisher
            .assign(to: &$progress)

        interactor.errorPublisher
            .assign(to: &$error)
    }

    func startCalibration() {
        do {
            try interactor.startCalibration()
        } catch {
            self.error = error
        }
    }
}
```

ここで、`assign(to: &$property)`という新しい構文を使っています。これにより、`assign(to: on:)`で返されるCancellableが自動的に管理され、対象のオブジェクトが解放されるときに自動的に解放されます。

---

## 👤 User
*2023-06-20 11:26:55*

showAlertのようなものをViewModelで管理して、アラートを上げたい
また、calibrationNextPointPublisherのcompletionを条件に自動的に次の画面に遷移したい

---

## 🤖 Assistant
*2023-06-20 11:27:47*

すべての状態をViewModelに集約し、Viewを宣言的に作成するために、あなたの要求に基づいてViewModelとViewを更新しました。

まず、アラートの表示と画面遷移のトリガーをViewModelで管理するように更新します。

```swift
class GazeTrackCalibrationViewModel: ObservableObject {
    private var interactor: GazeTrackCalibrationInteractorProtocol

    @Published var calibrationPoint: (x: Double, y: Double)?
    @Published var progress: Double = 0.0
    @Published var error: Error?
    @Published var showAlert: Bool = false
    @Published var navigateToNextScreen: Bool = false

    init(interactor: GazeTrackCalibrationInteractorProtocol) {
        self.interactor = interactor

        interactor.calibrationNextPointPublisher
            .sink { [weak self] _ in
                self?.navigateToNextScreen = true
            } receiveValue: { [weak self] point in
                self?.calibrationPoint = point
            }
            .store(in: &cancellables)

        interactor.progressPublisher
            .assign(to: &$progress)

        interactor.errorPublisher
            .sink { [weak self] error in
                self?.error = error
                self?.showAlert = true
            }
            .store(in: &cancellables)
    }

    func startCalibration() {
        do {
            try interactor.startCalibration()
        } catch {
            self.error = error
            self.showAlert = true
        }
    }
}
```

次に、SwiftUI Viewを更新します。アラートを表示し、画面遷移を実装します。

```swift
struct GazeTrackCalibrationView: View {
    @ObservedObject var viewModel: GazeTrackCalibrationViewModel

    var body: some View {
        VStack {
            Text("Calibration Progress: \(viewModel.progress)")
            Text("Calibration Point: \(viewModel.calibrationPoint?.x ?? 0.0), \(viewModel.calibrationPoint?.y ?? 0.0)")
            Button("Start Calibration") {
                viewModel.startCalibration()
            }
        }
        .alert(isPresented: $viewModel.showAlert) {
            Alert(title: Text("Error"),
                  message: Text(viewModel.error?.localizedDescription ?? "Unknown Error"),
                  dismissButton: .default(Text("OK")))
        }
        .fullScreenCover(isPresented: $viewModel.navigateToNextScreen) {
            // Your next screen view here
            Text("Next Screen")
        }
    }
}
```

この`GazeTrackCalibrationView`では、`showAlert`と`navigateToNextScreen`が`true`になると、それぞれアラートが表示され、次の画面に遷移します。なお、具体的な画面遷移先（`fullScreenCover`内のView）は、あなたのプロジェクトの詳細に基づいて適切に設定してください。

---

## 👤 User
*2023-06-20 11:29:48*

2つのフラグshouldShowXXX に変えて欲しいのと統一のためにprogressPublisherも.store(in: &cancellables)してほしいのとcancellables を cancellableSet にrenameしてほしい

---

## 🤖 Assistant
*2023-06-20 11:30:41*

ご指示の通りに修正します。新しい`GazeTrackCalibrationViewModel`と`GazeTrackCalibrationView`の実装は以下のとおりです。

ViewModel:

```swift
class GazeTrackCalibrationViewModel: ObservableObject {
    private var interactor: GazeTrackCalibrationInteractorProtocol
    private var cancellableSet = Set<AnyCancellable>()

    @Published var calibrationPoint: (x: Double, y: Double)?
    @Published var progress: Double = 0.0
    @Published var error: Error?
    @Published var shouldShowAlert: Bool = false
    @Published var shouldShowNextScreen: Bool = false

    init(interactor: GazeTrackCalibrationInteractorProtocol) {
        self.interactor = interactor

        interactor.calibrationNextPointPublisher
            .sink { [weak self] _ in
                self?.shouldShowNextScreen = true
            } receiveValue: { [weak self] point in
                self?.calibrationPoint = point
            }
            .store(in: &cancellableSet)

        interactor.progressPublisher
            .sink { [weak self] progress in
                self?.progress = progress
            }
            .store(in: &cancellableSet)

        interactor.errorPublisher
            .sink { [weak self] error in
                self?.error = error
                self?.shouldShowAlert = true
            }
            .store(in: &cancellableSet)
    }

    func startCalibration() {
        do {
            try interactor.startCalibration()
        } catch {
            self.error = error
            self.shouldShowAlert = true
        }
    }
}
```

View:

```swift
struct GazeTrackCalibrationView: View {
    @ObservedObject var viewModel: GazeTrackCalibrationViewModel

    var body: some View {
        VStack {
            Text("Calibration Progress: \(viewModel.progress)")
            Text("Calibration Point: \(viewModel.calibrationPoint?.x ?? 0.0), \(viewModel.calibrationPoint?.y ?? 0.0)")
            Button("Start Calibration") {
                viewModel.startCalibration()
            }
        }
        .alert(isPresented: $viewModel.shouldShowAlert) {
            Alert(title: Text("Error"),
                  message: Text(viewModel.error?.localizedDescription ?? "Unknown Error"),
                  dismissButton: .default(Text("OK")))
        }
        .fullScreenCover(isPresented: $viewModel.shouldShowNextScreen) {
            // Your next screen view here
            Text("Next Screen")
        }
    }
}
```

ここでは、`assign(to: &$progress)`を`interactor.progressPublisher.sink { [weak self] progress in self?.progress = progress }`に置き換えています。そして、Cancellableは`cancellableSet`に保存します。

また、`showAlert`と`navigateToNextScreen`を`shouldShowAlert`と`shouldShowNextScreen`にリネームしました。これにより、各フラグの役割が明確になります。

---

## 👤 User
*2023-06-20 12:37:00*

calibrationPoint と progressの初期値はnilにしてほしい。また、calibrationPoint == nil の場合では、準備中の画面を表示したい。

そのフラグをViewModelに設置したい。それをViewで用いたい。

---

## 🤖 Assistant
*2023-06-20 12:37:53*

ご指定通り、`calibrationPoint`と`progress`の初期値を`nil`に変更し、新たなフラグ`isPreparing`を追加しました。これを使って、`calibrationPoint`が`nil`の場合に「準備中」の画面を表示します。

まずはViewModelの更新を行います。

```swift
class GazeTrackCalibrationViewModel: ObservableObject {
    private var interactor: GazeTrackCalibrationInteractorProtocol
    private var cancellableSet = Set<AnyCancellable>()

    @Published var calibrationPoint: (x: Double, y: Double)? = nil
    @Published var progress: Double? = nil
    @Published var error: Error?
    @Published var shouldShowAlert: Bool = false
    @Published var shouldShowNextScreen: Bool = false
    @Published var isPreparing: Bool = true

    init(interactor: GazeTrackCalibrationInteractorProtocol) {
        self.interactor = interactor

        interactor.calibrationNextPointPublisher
            .sink { [weak self] _ in
                self?.shouldShowNextScreen = true
            } receiveValue: { [weak self] point in
                self?.calibrationPoint = point
                self?.isPreparing = false
            }
            .store(in: &cancellableSet)

        interactor.progressPublisher
            .sink { [weak self] progress in
                self?.progress = progress
            }
            .store(in: &cancellableSet)

        interactor.errorPublisher
            .sink { [weak self] error in
                self?.error = error
                self?.shouldShowAlert = true
            }
            .store(in: &cancellableSet)
    }

    func startCalibration() {
        do {
            try interactor.startCalibration()
        } catch {
            self.error = error
            self.shouldShowAlert = true
        }
    }
}
```

次に、これらの変更をViewに反映します。

```swift
struct GazeTrackCalibrationView: View {
    @ObservedObject var viewModel: GazeTrackCalibrationViewModel

    var body: some View {
        if viewModel.isPreparing {
            Text("Preparing...")
        } else {
            VStack {
                Text("Calibration Progress: \(viewModel.progress ?? 0.0)")
                Text("Calibration Point: \(viewModel.calibrationPoint?.x ?? 0.0), \(viewModel.calibrationPoint?.y ?? 0.0)")
                Button("Start Calibration") {
                    viewModel.startCalibration()
                }
            }
            .alert(isPresented: $viewModel.shouldShowAlert) {
                Alert(title: Text("Error"),
                      message: Text(viewModel.error?.localizedDescription ?? "Unknown Error"),
                      dismissButton: .default(Text("OK")))
            }
            .fullScreenCover(isPresented: $viewModel.shouldShowNextScreen) {
                // Your next screen view here
                Text("Next Screen")
            }
        }
    }
}
```

ここで、Viewのbody内で`viewModel.isPreparing`をチェックしています。このフラグが`true`（準備中）である場合、"Preparing..."と表示します。それ以外の場合、通常のUIが表示されます。

---

## 👤 User
*2023-06-20 12:39:39*

isPreparing をもっと具体的な命名にしたい。候補をあげて欲しい。キャリブレーションの準備中というような意味だったり、初期化中のような意味が伝わると良い

---

## 🤖 Assistant
*2023-06-20 12:39:55*

わかりました、いくつかの選択肢を提供します：

1. `isCalibrationBeingSetUp`: これはキャリブレーションが設定中であることを明示的に示します。
2. `isCalibrationInitializing`: この名前は、キャリブレーションが初期化中であることを示します。
3. `isPreparingCalibration`: これもキャリブレーションの準備が行われていることを示しますが、より簡潔に表現しています。

上記のいずれかを選択するか、またはこれらを参考に適切な名前を選択することができます。それぞれが意図した状態を適切に表していると思います。

---

## 👤 User
*2023-06-20 12:46:50*

Viewについて以下のように修正してほしい

24ptのサークルをcalibrationPoint.x と alibrationPoint.y を使って移動して欲しい。

そのサークルの中にprogressの数値をいれてほしい。

左上に閉じるボタンを設置して欲しい

---

## 🤖 Assistant
*2023-06-20 12:47:47*

ご指定の通りにViewを修正します。ただし、以下のコードはサンプルコードで、レイアウトや視覚的な詳細は実際のアプリケーションの要件によります。また、calibrationPoint.xとcalibrationPoint.yの値は正規化されていると仮定しています（つまり、0.0から1.0の範囲内）。それらの値を画面の座標にマッピングする方法は、特定のレイアウトとデバイスによります。

```swift
struct GazeTrackCalibrationView: View {
    @ObservedObject var viewModel: GazeTrackCalibrationViewModel
    let circleDiameter: CGFloat = 24

    var body: some View {
        ZStack {
            if viewModel.isCalibrationInitializing {
                Text("Initializing...")
            } else {
                Circle()
                    .fill(Color.red)
                    .frame(width: circleDiameter, height: circleDiameter)
                    .position(
                        x: CGFloat(viewModel.calibrationPoint?.x ?? 0.5) * UIScreen.main.bounds.width,
                        y: CGFloat(viewModel.calibrationPoint?.y ?? 0.5) * UIScreen.main.bounds.height
                    )
                Text("\(viewModel.progress ?? 0.0)")
                    .position(
                        x: CGFloat(viewModel.calibrationPoint?.x ?? 0.5) * UIScreen.main.bounds.width,
                        y: CGFloat(viewModel.calibrationPoint?.y ?? 0.5) * UIScreen.main.bounds.height
                    )
                VStack {
                    HStack {
                        Button(action: {
                            // Close button action
                        }) {
                            Image(systemName: "xmark")
                                .font(.title)
                                .foregroundColor(.white)
                                .padding()
                                .background(Color.black.opacity(0.6))
                                .clipShape(Circle())
                        }
                        .padding()
                        Spacer()
                    }
                    Spacer()
                }
            }
        }
        .alert(isPresented: $viewModel.shouldShowAlert) {
            Alert(title: Text("Error"),
                  message: Text(viewModel.error?.localizedDescription ?? "Unknown Error"),
                  dismissButton: .default(Text("OK")))
        }
        .fullScreenCover(isPresented: $viewModel.shouldShowNextScreen) {
            // Your next screen view here
            Text("Next Screen")
        }
        .edgesIgnoringSafeArea(.all)
    }
}
```

上記のViewでは、`Circle`を使用して24ptの赤い円を描画し、その中に進行状況を表すテキストを表示しています。この円の位置は、`calibrationPoint`の`x`および`y`座標を使用して設定します。画面の左上には閉じるボタンがあります。画面全体をカバーするように配置するために、`.edgesIgnoringSafeArea(.all)`を使用しています。

このサンプルコードは単純化されており、実際のアプリケーションでは更に詳細なレイアウトや視覚的な調整が必要となるでしょう。例えば、進行状況のテキストは、円内にきちんとフィットするように

---

## 🤖 Assistant
*2023-06-20 12:48:30*

サイズやフォントを調整する必要があります。また、閉じるボタンのアクションはアプリケーションの要件によって異なります。

---

## 👤 User
*2023-06-20 12:48:58*

Circle() と Text が一緒になっているViewを作った方がうまくいかない？

---

## 🤖 Assistant
*2023-06-20 12:49:41*

はい、そのようなアプローチは整理がされ、再利用も容易になります。以下に、`ProgressCircle`というカスタムビューを作成し、それを`GazeTrackCalibrationView`で使用するサンプルを示します。

まずは`ProgressCircle`です。

```swift
struct ProgressCircle: View {
    var progress: Double?
    var position: CGPoint
    let circleDiameter: CGFloat = 24

    var body: some View {
        ZStack {
            Circle()
                .fill(Color.red)
                .frame(width: circleDiameter, height: circleDiameter)
            Text("\(progress ?? 0.0)")
        }
        .position(position)
    }
}
```

そして、`ProgressCircle`を`GazeTrackCalibrationView`で使用する様子です。

```swift
struct GazeTrackCalibrationView: View {
    @ObservedObject var viewModel: GazeTrackCalibrationViewModel

    var body: some View {
        ZStack {
            if viewModel.isCalibrationInitializing {
                Text("Initializing...")
            } else {
                ProgressCircle(
                    progress: viewModel.progress,
                    position: CGPoint(
                        x: CGFloat(viewModel.calibrationPoint?.x ?? 0.5) * UIScreen.main.bounds.width,
                        y: CGFloat(viewModel.calibrationPoint?.y ?? 0.5) * UIScreen.main.bounds.height
                    )
                )
                VStack {
                    HStack {
                        Button(action: {
                            // Close button action
                        }) {
                            Image(systemName: "xmark")
                                .font(.title)
                                .foregroundColor(.white)
                                .padding()
                                .background(Color.black.opacity(0.6))
                                .clipShape(Circle())
                        }
                        .padding()
                        Spacer()
                    }
                    Spacer()
                }
            }
        }
        .alert(isPresented: $viewModel.shouldShowAlert) {
            Alert(title: Text("Error"),
                  message: Text(viewModel.error?.localizedDescription ?? "Unknown Error"),
                  dismissButton: .default(Text("OK")))
        }
        .fullScreenCover(isPresented: $viewModel.shouldShowNextScreen) {
            // Your next screen view here
            Text("Next Screen")
        }
        .edgesIgnoringSafeArea(.all)
    }
}
```

`ProgressCircle`は進行状況とポジションを受け取り、それに基づいて円と進行状況のテキストを配置します。このようにすることで、このビューは再利用可能になり、それぞれのビューの責任が明確になります。

---

## 👤 User
*2023-06-20 12:50:06*

ProgressCircle は @Stateな変数じゃなくていいんだっけ？

---

## 🤖 Assistant
*2023-06-20 12:50:32*

`ProgressCircle`のプロパティ`progress`と`position`は、元の`GazeTrackCalibrationView`の`viewModel`から直接値を取得します。`ProgressCircle`自体が値を変更したり、内部での状態の変化を管理したりするわけではないので、`@State`プロパティラッパーは不要です。

SwiftUIでは、`@State`プロパティラッパーは、そのView自体が所有し、更新する必要がある状態に使用されます。この状態の変更はそのViewの再描画を引き起こします。しかし、`ProgressCircle`は単に与えられた`progress`と`position`プロパティを表示するだけで、これらの値の管理や更新は行わず、値の変化に応じて自動的に再描画されます。したがって、`@State`は不要です。

その代わりに、元の`GazeTrackCalibrationView`では、`@ObservedObject`プロパティラッパーを使用して`viewModel`を監視しています。これにより、`viewModel`内の`@Published`プロパティが変更されたときに、Viewが再描画されます。

---

## 👤 User
*2023-06-20 12:52:52*

ProgressCircleは各所で使いまわしたいのでプレビューを作成してほしい。progressはprogressPercentageに変更して、IntにしてほしいのとprogressPercentageの後ろに"%"wo

---

## 🤖 Assistant
*2023-06-20 12:53:08*

`ProgressCircle`を以下のように更新し、プレビューを作成します。`progressPercentage`は`Int`とし、表示するテキストには"%"を追加します。

```swift
struct ProgressCircle: View {
    var progressPercentage: Int?
    var position: CGPoint
    let circleDiameter: CGFloat = 24

    var body: some View {
        ZStack {
            Circle()
                .fill(Color.red)
                .frame(width: circleDiameter, height: circleDiameter)
            Text("\(progressPercentage ?? 0)%")
        }
        .position(position)
    }
}

struct ProgressCircle_Previews: PreviewProvider {
    static var previews: some View {
        ProgressCircle(progressPercentage: 50, position: CGPoint(x: 100, y: 100))
    }
}
```

ここでは、プレビューでは50％の進行状況と特定のポジションで`ProgressCircle`を表示します。

---

## 👤 User
*2023-06-20 12:53:35*

progressPercentageがnilの場合はText("\(progressPercentage ?? 0)%")ごと削除してほしい

---

## 🤖 Assistant
*2023-06-20 12:53:48*

進行状況が`nil`の場合にテキストを表示しないように`ProgressCircle`を更新します。

```swift
struct ProgressCircle: View {
    var progressPercentage: Int?
    var position: CGPoint
    let circleDiameter: CGFloat = 24

    var body: some View {
        ZStack {
            Circle()
                .fill(Color.red)
                .frame(width: circleDiameter, height: circleDiameter)
            if let progressPercentage = progressPercentage {
                Text("\(progressPercentage)%")
            }
        }
        .position(position)
    }
}
```

ここでは、`progressPercentage`が`nil`でない場合にのみテキストを表示します。このようにすることで、進行状況が未定義の場合には何も表示されません。

---

## 👤 User
*2023-06-20 12:59:13*

以下のように修正したんだけど、positionのデフォルト値を画面の中央にして欲しい

public struct ProgressCircle: View {
    private static let circleDiameter: CGFloat = 24
    public var progressPercentage: Int?
    public var position: CGPoint?

    public var body: some View {
        ZStack {
            Circle()
                .fill(CoreAssets.Color.PrimaryBackgroundNoGradation.primaryBackgroundNoGradation100.swiftUIColor)
                .frame(width: Self.circleDiameter, height: Self.circleDiameter)
            if let progressPercentage = progressPercentage {
                Text("\(progressPercentage)%")
                    .typographyStyle(.caption2)
                    .foregroundColor(CoreAssets.Color.Neutral.white.swiftUIColor)
            }
        }
        .position(position ?? &lt;#default value#&gt;)
    }
}

---

## 🤖 Assistant
*2023-06-20 12:59:54*

デフォルトの位置を画面の中央に設定するには、`UIScreen.main.bounds`を使用して画面の幅と高さの半分を計算します。以下にその方法を示します。

```swift
public struct ProgressCircle: View {
    private static let circleDiameter: CGFloat = 24
    public var progressPercentage: Int?
    public var position: CGPoint?

    public var body: some View {
        ZStack {
            Circle()
                .fill(CoreAssets.Color.PrimaryBackgroundNoGradation.primaryBackgroundNoGradation100.swiftUIColor)
                .frame(width: Self.circleDiameter, height: Self.circleDiameter)
            if let progressPercentage = progressPercentage {
                Text("\(progressPercentage)%")
                    .typographyStyle(.caption2)
                    .foregroundColor(CoreAssets.Color.Neutral.white.swiftUIColor)
            }
        }
        .position(position ?? CGPoint(x: UIScreen.main.bounds.width/2, y: UIScreen.main.bounds.height/2))
    }
}
```
これにより、`position`が設定されていない場合（`nil`の場合）、`ProgressCircle`はデフォルトで画面の中央に配置されます。

---

## 👤 User
*2023-06-20 13:19:21*

この画面をフルスクリーンカバーで出そうとしているので、左上に中断するボタンがほしい

---

## 🤖 Assistant
*2023-06-20 13:19:49*

フルスクリーンカバーに対応するために、左上に中断ボタンを追加し、そのボタンを押すとこの画面が閉じるようにします。以下にその方法を示します。この例では、`presentationMode`を使用して、ビューが表示されているプレゼンテーションを管理します。

まず、`GazeTrackCalibrationView`の変更点です：

```swift
struct GazeTrackCalibrationView: View {
    @ObservedObject var viewModel: GazeTrackCalibrationViewModel
    @Environment(\.presentationMode) var presentationMode

    var body: some View {
        ZStack {
            // ... その他のビューコンポーネント

            // 中断ボタンを追加
            VStack {
                HStack {
                    Button(action: {
                        // ボタンが押されたときにビューを閉じる
                        presentationMode.wrappedValue.dismiss()
                    }) {
                        Image(systemName: "xmark")
                            .foregroundColor(.black)
                            .padding()
                    }
                    Spacer()
                }
                Spacer()
            }
        }
    }
}
```
このコードでは、システムイメージ`xmark`を使用して中断ボタンを作成します。このボタンが押されると、現在のビューが閉じられます。`presentationMode.wrappedValue.dismiss()`を使用してビューを閉じます。

このボタンは`ZStack`の最上部にあり、その結果、他の全てのビューコンポーネントの上に表示されます。`VStack`と`HStack`は、ボタンを左上の角に配置するために使用します。

---

## 👤 User
*2023-06-20 13:20:09*

ナビゲーションViewを使う方法はないの？

---

## 🤖 Assistant
*2023-06-20 13:20:39*

はい、`NavigationView`を使うと`navigationBarItems`を使って左上にボタンを配置できます。ただし、フルスクリーンカバーとして表示されるときは通常、`NavigationView`のナビゲーションバーは表示されません。そこで、明示的に`navigationBarHidden(false)`を設定してナビゲーションバーを表示します。

以下にその方法を示します：

```swift
struct GazeTrackCalibrationView: View {
    @ObservedObject var viewModel: GazeTrackCalibrationViewModel
    @Environment(\.presentationMode) var presentationMode

    var body: some View {
        NavigationView {
            ZStack {
                // ... その他のビューコンポーネント
            }
            .navigationBarTitle("", displayMode: .inline)
            .navigationBarHidden(false)
            .navigationBarItems(leading: Button(action: {
                // ボタンが押されたときにビューを閉じる
                presentationMode.wrappedValue.dismiss()
            }) {
                Image(systemName: "xmark")
                    .foregroundColor(.black)
            })
        }
    }
}
```

ここで、`navigationBarTitle`を空文字列に設定し、`displayMode`を`.inline`に設定しています。これにより、ナビゲーションバーがコンパクトな形で表示され、`navigationBarItems`で追加した項目だけが表示されます。

また、`navigationBarHidden(false)`を明示的に設定することで、フルスクリーン表示でもナビゲーションバーが表示されます。

最後に、`navigationBarItems`を使用して、左上に中断ボタンを配置します。

---

## 👤 User
*2023-06-20 13:24:22*

.position(position) って円の中心を設定してくれているの？それとも円の左下なの？

---

## 🤖 Assistant
*2023-06-20 13:24:37*

SwiftUIの `.position(_:)` メソッドは、Viewの中心点を指定した座標に配置します。したがって、`ProgressCircle`の場合、座標`(position.x, position.y)`は円の中心を指しています。

また、基本的に座標系は左上が原点で、x座標は左から右に増加し、y座標は上から下に増加します。つまり、座標(0,0)は画面の左上隅を指します。

---

## 👤 User
*2023-06-20 13:34:56*

"スマートフォンを顔から30cmほどはなして、\n画面上の赤い丸を見続けてください" を画面中央から70pt下げて欲しい

@MainActor
final class PortraitGazeTrackCalibrationPresenter: ObservableObject {
    @Published private(set) var isPreparingCalibration: Bool = true
    @Published private(set) var calibrationPoint: CGPoint?
    @Published private(set) var progressPercentage: Int?
    @Published private(set) var error: Error?
    @Published var shouldShowAlert: Bool = false
    @Published var shouldShowNextScreen: Bool = false
    private var gazeTrackCalibrationInteractor: GazeTrackCalibrationInteractorProtocol
    private var cancellableSet = Set&lt;AnyCancellable&gt;()
    
    init(gazeTrackCalibrationInteractor: GazeTrackCalibrationInteractorProtocol = GazeTrackCalibrationInteractor(orientation: .portrait)) {
        self.gazeTrackCalibrationInteractor = gazeTrackCalibrationInteractor
        
        gazeTrackCalibrationInteractor.calibrationNextPointPublisher
            .map { x, y -&gt; CGPoint in
                CGPoint(x: x, y: y)
            }
            .sink { [weak self] _ in
                self?.shouldShowNextScreen = true
            } receiveValue: { [weak self] point in
                self?.calibrationPoint = point
            }
            .store(in: &cancellableSet)
        
        gazeTrackCalibrationInteractor.progressPublisher
            .map { Int($0 * 100) }
            .assign(to: &$progressPercentage)
        
        gazeTrackCalibrationInteractor.errorPublisher
            .sink { [weak self] error in
                self?.error = error
                self?.shouldShowAlert = true
            }
            .store(in: &cancellableSet)
        
        $progressPercentage
            .map { $0.isNil }
            .assign(to: &$isPreparingCalibration)
    }
    
    func startCalibration() {
        do {
            try gazeTrackCalibrationInteractor.startCalibration()
        } catch {
            self.error = error
            self.shouldShowAlert = true
        }
    }
}

public struct PortraitGazeTrackCalibrationView: View {
    @Environment(\.dismiss) private var dismiss
    @StateObject private var presenter = PortraitGazeTrackCalibrationPresenter()
    

    public var body: some View {
        ZStack {
            CoreAssets.Color.Neutral.black.swiftUIColor
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            
            if presenter.isPreparingCalibration {
                Text("スマートフォンを顔から30cmほどはなして、\n画面上の赤い丸を見続けてください")
                    .typographyStyle(.body2)
                    .foregroundColor(CoreAssets.Color.Neutral.white.swiftUIColor)
            }

            ProgressCircle(progressPercentage: presenter.progressPercentage, position: presenter.calibrationPoint)
                .isHidden(presenter.shouldShowNextScreen)

            // 閉じるボタン
            VStack {
                HStack {
                    CloseButton()
                    Spacer()
                }
                Spacer()
            }
        }
        .alert(isPresented: $presenter.shouldShowAlert) {
            // TODO: エラー設計
            Alert(title: Text("Error"),
                  message: Text(presenter.error?.localizedDescription ?? "Unknown Error"),
                  dismissButton: .default(Text("OK")))
        }
        .fullScreenCover(isPresented: $presenter.shouldShowNextScreen) {
            // Your next screen view here
            Text("Next Screen")
        }
        .edgesIgnoringSafeArea(.all)
    }
}

---

## 🤖 Assistant
*2023-06-20 13:35:31*

テキストを画面中央から70pt下に配置するには、以下のように修正します。

```swift
public struct PortraitGazeTrackCalibrationView: View {
    @Environment(\.dismiss) private var dismiss
    @StateObject private var presenter = PortraitGazeTrackCalibrationPresenter()
    
    public var body: some View {
        ZStack {
            CoreAssets.Color.Neutral.black.swiftUIColor
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            
            VStack {
                Spacer()
                
                Text("スマートフォンを顔から30cmほどはなして、\n画面上の赤い丸を見続けてください")
                    .typographyStyle(.body2)
                    .foregroundColor(CoreAssets.Color.Neutral.white.swiftUIColor)
                    .padding(.top, 70)
                
                Spacer()
            }
            .isHidden(!presenter.isPreparingCalibration)

            ProgressCircle(progressPercentage: presenter.progressPercentage, position: presenter.calibrationPoint)
                .isHidden(presenter.shouldShowNextScreen)

            // 閉じるボタン
            VStack {
                HStack {
                    CloseButton()
                    Spacer()
                }
                Spacer()
            }
        }
        .alert(isPresented: $presenter.shouldShowAlert) {
            // TODO: エラー設計
            Alert(title: Text("Error"),
                  message: Text(presenter.error?.localizedDescription ?? "Unknown Error"),
                  dismissButton: .default(Text("OK")))
        }
        .fullScreenCover(isPresented: $presenter.shouldShowNextScreen) {
            // Your next screen view here
            Text("Next Screen")
        }
        .edgesIgnoringSafeArea(.all)
    }
}
```

この修正により、テキストは画面中央から70pt下に配置されます。注意点として、`.isHidden(_:)` メソッドは存在しないので、SwiftUIで表示/非表示を切り替えるには、通常条件付きでビューを描画します。この例では、`presenter.isPreparingCalibration` が`true`の場合にのみテキストを描画します。

---

## 👤 User
*2023-06-20 18:19:46*

以下について、.sink { [weak self] _ in
                self?.shouldShowNextScreen = true
            } をちゃんとハンドリングしてほしい。成功の場合のみshouldShowNextScreen = trueとしてほしい

 gazeTrackCalibrationInteractor.calibrationNextPointPublisher
            .map { x, y -&gt; CGPoint in
                CGPoint(x: x, y: y)
            }
            .sink { [weak self] _ in
                self?.shouldShowNextScreen = true
            } receiveValue: { [weak self] point in
                self?.calibrationPoint = point
            }
            .store(in: &cancellableSet)

---

## 🤖 Assistant
*2023-06-20 18:20:22*

現状のコードだと、`calibrationNextPointPublisher`が何らかの理由で完了した場合に`shouldShowNextScreen = true`となってしまいます。ここで本当に必要なのは、キャリブレーションが正常に終了した場合だけに`shouldShowNextScreen = true`を行うことだと思われます。

通常、キャリブレーションの結果を知るためには、エラー発生時もしくはキャリブレーション成功時に何らかのフラグを立てるか、成功の場合に限定した専用のPublisherを作成するのが一般的です。これにより、キャリブレーションが成功したかどうかを明示的に知ることができます。

現状の`calibrationNextPointPublisher`の終了条件やキャリブレーションが成功した際のフラグ等の情報がないため、具体的なコードを提示することは難しいですが、キャリブレーション結果を管理するフラグを立てたり、キャリブレーションが成功した際に専用のPublisherを使って通知することを検討してみてください。

---
