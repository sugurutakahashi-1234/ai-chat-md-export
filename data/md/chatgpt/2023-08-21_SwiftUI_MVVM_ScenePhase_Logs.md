# SwiftUI MVVM ScenePhase Logs

Date: 2023-08-21

---

## 👤 User
*2023-08-21 23:46:39*

SwiftUIのMVVMでscenePhageの変更を検知して、oldScenePhase: ScenePhase, newScenePhase: ScenePhase のようなログの出力をしたい。出力はVMで行って欲しい。

---

## 🤖 Assistant
*2023-08-21 23:47:39*

SwiftUIの`MVVM`アーキテクチャで、`scenePhase`の変更を検知してログ出力を行うには、以下の手順を試してください。

まず、ViewModelを設定します:

```swift
class ScenePhaseViewModel: ObservableObject {
    @Published var scenePhase: ScenePhase = .active
    
    private var cancellables = Set<AnyCancellable>()
    
    init() {
        $scenePhase
            .sink { [weak self] newPhase in
                if let oldPhase = self?.scenePhase {
                    print("oldScenePhase: \(oldPhase), newScenePhase: \(newPhase)")
                }
                self?.scenePhase = newPhase
            }
            .store(in: &cancellables)
    }
}
```

このViewModelでは、`scenePhase`の変更を監視し、新旧の`scenePhase`をログとして出力します。

次に、`ScenePhaseViewModel`を利用するSwiftUIビューを作成します:

```swift
struct ScenePhaseView: View {
    @Environment(\.scenePhase) private var scenePhase: ScenePhase
    @ObservedObject var viewModel: ScenePhaseViewModel
    
    var body: some View {
        // ここにビューのコンテンツを記述
        
        Text("Current scene phase: \(scenePhase.rawValue)")
            .onReceive(Just(scenePhase), perform: { newPhase in
                viewModel.scenePhase = newPhase
            })
    }
}
```

ここでは、ビューが表示されると、`scenePhase`が変更されるたびに、その新しい値を`ScenePhaseViewModel`の`scenePhase`に設定します。それにより、ViewModelの`scenePhase`の変更がトリガーされ、ログが出力されます。

この方法を使用すると、`scenePhase`の変更を検知して、その変更をログとしてViewModelから出力することができます。

---

## 👤 User
*2023-08-21 23:48:21*

ScenePhaseManagerのようなものを置いてそこでoldPhaseを保持させたい。
VMは値の更新だけするようにしてほしい。

public class ScenePhaseManager: ScenePhaseManagerProtocol {
    // TODO: 現状、各画面での ScenePhase の変更を検知しようとするとうまくいかないので、BaseView の更新を shared を使うことで共有しているが、共有する範囲を明確にしたい（rename or シングルトンをやめたい）
    public static let shared = ScenePhaseManager()

    private init() {}

    private let scenePhaseSubject = PassthroughSubject&lt;ScenePhase, Never&gt;()
    public var scenePhasePublisher: AnyPublisher&lt;ScenePhase, Never&gt; {
        scenePhaseSubject.eraseToAnyPublisher()
    }

    // TODO: 扱う ScenePhase を (oldScenePhase: ScenePhase, newScenePhase: ScenePhase) のタプルにする。初期値は　(oldScenePhase: .active, newScenePhase: .active) とすると都合がよさそう？
    // Ref: https://github.com/Viagate/emomil-app-ios/issues/517
    public func scenePhageChanged(scenePhase: ScenePhase) {
        scenePhaseSubject.send(scenePhase)
        LoggerContainer.debugLog("newScenePhase: \(scenePhase)")
    }
}

---

## 🤖 Assistant
*2023-08-21 23:49:50*

了解しました。以下の手順で、`ScenePhaseManager`をリファクタリングして、oldPhaseとnewPhaseのタプルを扱い、共有の範囲を明確にする方法を示します。

1. **ScenePhaseManagerの変更**

   まず、`ScenePhaseManager`にoldPhaseとnewPhaseのタプルを追加します。

```swift
public class ScenePhaseManager: ScenePhaseManagerProtocol {
    public static let shared = ScenePhaseManager()

    private init() {
        // 初期値を設定
        currentScenePhase = (.active, .active)
    }

    private let scenePhaseSubject = PassthroughSubject<(ScenePhase, ScenePhase), Never>()
    public var scenePhasePublisher: AnyPublisher<(ScenePhase, ScenePhase), Never> {
        scenePhaseSubject.eraseToAnyPublisher()
    }

    // 現在のScenePhaseのタプルを保持
    private var currentScenePhase: (oldScenePhase: ScenePhase, newScenePhase: ScenePhase) {
        didSet {
            scenePhaseSubject.send(currentScenePhase)
            LoggerContainer.debugLog("oldScenePhase: \(currentScenePhase.oldScenePhase), newScenePhase: \(currentScenePhase.newScenePhase)")
        }
    }

    public func scenePhaseChanged(scenePhase: ScenePhase) {
        let oldPhase = currentScenePhase.newScenePhase // 現在のnewPhaseを次のoldPhaseとして使う
        currentScenePhase = (oldPhase, scenePhase)
    }
}
```

2. **ViewModelの変更**

   ViewModelで`ScenePhaseManager`からの変更を購読する必要があります。

```swift
class ScenePhaseViewModel: ObservableObject {
    @Published var scenePhase: (ScenePhase, ScenePhase) = (.active, .active)
    private var cancellables = Set<AnyCancellable>()

    init() {
        ScenePhaseManager.shared.scenePhasePublisher
            .sink { [weak self] newPhaseTuple in
                self?.scenePhase = newPhaseTuple
            }
            .store(in: &cancellables)
    }
}
```

3. **SwiftUIのビューの変更**

   ViewModelの変更を受け取り、その変更に基づいてUIを更新する必要があります。

```swift
struct ScenePhaseView: View {
    @Environment(\.scenePhase) private var environmentScenePhase: ScenePhase
    @ObservedObject var viewModel: ScenePhaseViewModel

    var body: some View {
        Text("Old scene phase: \(viewModel.scenePhase.0.rawValue), New scene phase: \(viewModel.scenePhase.1.rawValue)")
            .onReceive(Just(environmentScenePhase), perform: { newPhase in
                ScenePhaseManager.shared.scenePhaseChanged(scenePhase: newPhase)
            })
    }
}
```

このアーキテクチャにより、`ScenePhaseManager`が現在のシーンフェーズの変更を中心に処理し、その変更をViewModelを介してUIに伝えることができます。

---

## 👤 User
*2023-08-21 23:51:04*

タプルで保持する必要なさそうだわ。あとScenePhaseViewModelではscenePhaseは保持しなくていいよ。

---

## 🤖 Assistant
*2023-08-21 23:52:10*

了解しました。指摘に基づき、`ScenePhaseManager`と`ScenePhaseViewModel`を再設計します。

1. **ScenePhaseManagerの変更**

   `ScenePhaseManager`では、`oldScenePhase`と`newScenePhase`の代わりに、単に`newScenePhase`だけを扱います。

```swift
public class ScenePhaseManager: ScenePhaseManagerProtocol {
    public static let shared = ScenePhaseManager()

    private let scenePhaseSubject = PassthroughSubject<ScenePhase, Never>()
    public var scenePhasePublisher: AnyPublisher<ScenePhase, Never> {
        scenePhaseSubject.eraseToAnyPublisher()
    }

    public func scenePhaseChanged(scenePhase: ScenePhase) {
        scenePhaseSubject.send(scenePhase)
        LoggerContainer.debugLog("newScenePhase: \(scenePhase)")
    }
}
```

2. **ViewModelの変更**

   `ScenePhaseViewModel`では、`scenePhase`を保持しないことになりますが、`scenePhaseChanged`を呼び出すための処理を追加します。

```swift
class ScenePhaseViewModel: ObservableObject {
    private var cancellables = Set<AnyCancellable>()

    init() {
        // ここでは特に何もしませんが、今後の拡張のためにViewModelを保持しています。
    }
    
    func updateScenePhase(with phase: ScenePhase) {
        ScenePhaseManager.shared.scenePhaseChanged(scenePhase: phase)
    }
}
```

3. **SwiftUIのビューの変更**

   ViewModelを使用して`ScenePhaseManager`の`scenePhaseChanged`を呼び出します。

```swift
struct ScenePhaseView: View {
    @Environment(\.scenePhase) private var environmentScenePhase: ScenePhase
    @ObservedObject var viewModel: ScenePhaseViewModel

    var body: some View {
        Text("Environment scene phase: \(environmentScenePhase.rawValue)")
            .onReceive(Just(environmentScenePhase), perform: viewModel.updateScenePhase)
    }
}
```

この方法で、`ScenePhaseManager`が新しい`scenePhase`の変更を中心に処理し、その変更をViewModelを介して適切にハンドルします。

---
