# SwiftUI Toast Management

日付: 2024-07-03

---

## 👤 ユーザー
*2024/07/03 15:42:02*

SwiftUIのアプリでトーストを一元管理したい。ToastTypeを enum で定義して、それぞれの options や content を定義していきたい。

public struct RootView&lt;Dependency: RootDIContainerDependency&gt;: View {
    private let dependency: Dependency
    @StateObject private var presenter: RootPresenter&lt;Dependency&gt;
    @Environment(\.scenePhase) private var scenePhase

    public init(dependency: Dependency) {
        self.dependency = dependency
        _presenter = .init(wrappedValue: RootPresenter(dependency: dependency))
    }

    public var body: some View {
        HomeTabView(dependency: dependency)
            .overlay {
                EmptyView()
                    .simpleToast(isPresented: .constant(true), options: SimpleToastOptions(alignment: .bottom, hideAfter: 1), content: {
                        Label {
                            Text("スタンプを送信しました")
                        } icon: {
                            SFSymbols.checkmarkCircle.image
                        }
                        .padding()
                        .background(Color.green.opacity(0.8))
                        .foregroundColor(Color.white)
                        .cornerRadius(12)
                        .padding(.top)
                    })
            }
            .task {
                await presenter.onAppear()
            }
            .onDisappear {
                presenter.onDisappear()
            }
            .onChange(of: scenePhase) { newScenePhase in
                presenter.onChangeScenePhage(scenePhase: newScenePhase)
            }
    }
}

---

## 🤖 アシスタント
*2024/07/03 15:42:39*

User wants to manage toasts centrally in their SwiftUI app by defining ToastType as an enum with respective options and content.

---

## 🔧 ツール
*2024/07/03 15:42:39*

Model set context updated.

---

## 🤖 アシスタント
*2024/07/03 15:42:39*

To centralize the management of toasts in your SwiftUI app, you can define a `ToastType` enum with associated options and content. You can then create a view modifier or an environment object to handle the presentation of these toasts. Here's a sample implementation:

### Step 1: Define the `ToastType` Enum

```swift
enum ToastType {
    case success(String)
    case error(String)
    case info(String)
    
    var content: some View {
        switch self {
        case .success(let message):
            return Label {
                Text(message)
            } icon: {
                Image(systemName: "checkmark.circle")
            }
            .padding()
            .background(Color.green.opacity(0.8))
            .foregroundColor(Color.white)
            .cornerRadius(12)
            .padding(.top)
        case .error(let message):
            return Label {
                Text(message)
            } icon: {
                Image(systemName: "xmark.circle")
            }
            .padding()
            .background(Color.red.opacity(0.8))
            .foregroundColor(Color.white)
            .cornerRadius(12)
            .padding(.top)
        case .info(let message):
            return Label {
                Text(message)
            } icon: {
                Image(systemName: "info.circle")
            }
            .padding()
            .background(Color.blue.opacity(0.8))
            .foregroundColor(Color.white)
            .cornerRadius(12)
            .padding(.top)
        }
    }
    
    var options: SimpleToastOptions {
        switch self {
        case .success, .info:
            return SimpleToastOptions(alignment: .bottom, hideAfter: 2)
        case .error:
            return SimpleToastOptions(alignment: .bottom, hideAfter: 3)
        }
    }
}
```

### Step 2: Create a `ToastManager` Class

```swift
class ToastManager: ObservableObject {
    @Published var isPresented: Bool = false
    @Published var currentToast: ToastType? = nil
    
    func showToast(_ toast: ToastType) {
        currentToast = toast
        isPresented = true
        
        DispatchQueue.main.asyncAfter(deadline: .now() + (toast.options.hideAfter ?? 2)) {
            self.isPresented = false
        }
    }
}
```

### Step 3: Use the `ToastManager` in Your `RootView`

Update your `RootView` to use the `ToastManager`:

```swift
public struct RootView<Dependency: RootDIContainerDependency>: View {
    private let dependency: Dependency
    @StateObject private var presenter: RootPresenter<Dependency>
    @StateObject private var toastManager = ToastManager()
    @Environment(\.scenePhase) private var scenePhase

    public init(dependency: Dependency) {
        self.dependency = dependency
        _presenter = .init(wrappedValue: RootPresenter(dependency: dependency))
    }

    public var body: some View {
        HomeTabView(dependency: dependency)
            .overlay {
                if toastManager.isPresented, let currentToast = toastManager.currentToast {
                    EmptyView()
                        .simpleToast(isPresented: $toastManager.isPresented, options: currentToast.options, content: {
                            currentToast.content
                        })
                }
            }
            .task {
                await presenter.onAppear()
            }
            .onDisappear {
                presenter.onDisappear()
            }
            .onChange(of: scenePhase) { newScenePhase in
                presenter.onChangeScenePhage(scenePhase: newScenePhase)
            }
            .environmentObject(toastManager) // Inject ToastManager into the environment
    }
}
```

### Step 4: Show Toasts from Presenter

You can now show toasts from anywhere in your view hierarchy by accessing the `ToastManager` environment object:

```swift
struct SomeView: View {
    @EnvironmentObject var toastManager: ToastManager

    var body: some View {
        Button("Show Success Toast") {
            toastManager.showToast(.success("スタンプを送信しました"))
        }
    }
}
```

This setup provides a centralized way to manage and display toasts throughout your SwiftUI app.

---
