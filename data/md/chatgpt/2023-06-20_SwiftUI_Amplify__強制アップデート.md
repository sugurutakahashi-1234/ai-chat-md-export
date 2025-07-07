# SwiftUI+Amplify: 強制アップデート

日付: 2023-06-20

---

## 👤 ユーザー
*2023/6/20 15:01:30*

SwiftUIでAmplifyでリモートコンフィグを見て強制アップデートするような実装をやりたい。Amplifyは導入済みです。

---

## 🤖 アシスタント
*2023/6/20 15:02:33*

AWS Amplifyでリモートコンフィグを管理し、その値を基にアプリ内で強制アップデートを行う実装をしたいとのことですね。まず、この場合はAmplifyの一部であるAWS AppSyncを使用してリモートでの設定値管理を行い、その値を取得してアプリ内でアップデートの有無を決定します。

まず、AppSyncのGraphQLスキーマを作成します。ここでは、`AppConfig`という型を定義し、`forceUpdate`というフィールドを持たせます。このフィールドは強制アップデートが必要かどうかを表します。

```graphql
type AppConfig @model {
  id: ID!
  forceUpdate: Boolean!
}
```

次に、SwiftUIでアプリの起動時に上記の設定値を取得し、それに基づいてアップデートの有無を判断します。Amplifyを使用してAppSyncからデータを取得するためには、Amplify DataStoreまたはAmplify APIを使用します。

以下はAmplify DataStoreを使用した例です：

```swift
import SwiftUI
import Amplify
import AmplifyPlugins

@main
struct MyApp: App {
    @StateObject private var appState = AppState()
    
    init() {
        configureAmplify()
        fetchAppConfig()
    }
    
    var body: some Scene {
        WindowGroup {
            if appState.requiresForceUpdate {
                UpdateView()
            } else {
                ContentView()
            }
        }
    }
    
    private func configureAmplify() {
        do {
            try Amplify.add(plugin: AWSDataStorePlugin(modelRegistration: AmplifyModels()))
            try Amplify.configure()
        } catch {
            print("Failed to initialize Amplify with \(error)")
        }
    }
    
    private func fetchAppConfig() {
        Amplify.DataStore.query(AppConfig.self) { result in
            switch result {
            case .success(let appConfig):
                DispatchQueue.main.async {
                    appState.requiresForceUpdate = appConfig.forceUpdate
                }
            case .failure(let error):
                print("Could not query DataStore: \(error)")
            }
        }
    }
}

class AppState: ObservableObject {
    @Published var requiresForceUpdate: Bool = false
}

struct UpdateView: View {
    var body: some View {
        Text("An update is required. Please update the app.")
            .padding()
    }
}
```

この例では、アプリの起動時にAmplify DataStoreを使用して`AppConfig`データを取得し、その結果に基づいて強制アップデートが必要かどうかを決定します。強制アップデートが必要な場合は、`UpdateView`を表示します。それ以外の場合は、通常の`ContentView`を表示します。

なお、これは単純な例であり、実際の実装ではバージョン管理など、さらに詳細な設定が必要となる可能性があります。例えば、`AppConfig`に`minimumRequiredVersion`などの

---

## 👤 ユーザー
*2023/6/20 15:04:38*

現在のアプリバージョンとAppConfigに設定している強制アップデートバージョンが必要ならばアップデートするようにしたい。

---

## 🤖 アシスタント
*2023/6/20 15:05:32*

理解しました。その場合、AppConfigに`minimumRequiredVersion`フィールドを追加し、それをアプリの現在のバージョンと比較してアップデートが必要か判断します。また、アプリのバージョンはBundleから取得します。以下にその方法を示します。

まず、GraphQLスキーマを以下のように変更します：

```graphql
type AppConfig @model {
  id: ID!
  minimumRequiredVersion: String!
}
```

その後、SwiftUIでこの値を取得して比較します：

```swift
import SwiftUI
import Amplify
import AmplifyPlugins

@main
struct MyApp: App {
    @StateObject private var appState = AppState()
    
    init() {
        configureAmplify()
        fetchAppConfig()
    }
    
    var body: some Scene {
        WindowGroup {
            if appState.requiresForceUpdate {
                UpdateView()
            } else {
                ContentView()
            }
        }
    }
    
    private func configureAmplify() {
        do {
            try Amplify.add(plugin: AWSDataStorePlugin(modelRegistration: AmplifyModels()))
            try Amplify.configure()
        } catch {
            print("Failed to initialize Amplify with \(error)")
        }
    }
    
    private func fetchAppConfig() {
        Amplify.DataStore.query(AppConfig.self) { result in
            switch result {
            case .success(let appConfig):
                DispatchQueue.main.async {
                    appState.requiresForceUpdate = shouldForceUpdate(currentVersion: getCurrentAppVersion(), minimumRequiredVersion: appConfig.minimumRequiredVersion)
                }
            case .failure(let error):
                print("Could not query DataStore: \(error)")
            }
        }
    }
    
    private func getCurrentAppVersion() -> String {
        return Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String ?? "Unknown"
    }
    
    private func shouldForceUpdate(currentVersion: String, minimumRequiredVersion: String) -> Bool {
        return currentVersion.compare(minimumRequiredVersion, options: .numeric) == .orderedAscending
    }
}

class AppState: ObservableObject {
    @Published var requiresForceUpdate: Bool = false
}

struct UpdateView: View {
    var body: some View {
        Text("An update is required. Please update the app.")
            .padding()
    }
}
```

このコードでは、`minimumRequiredVersion`が現在のアプリバージョンよりも高い場合、強制アップデートが必要と判断します。アプリのバージョンは`CFBundleShortVersionString`キーを使用して取得します。

なお、バージョン比較のために`compare(_:options:)`メソッドを使用していますが、これは単純な数値比較を行うため、バージョンがセマンティックバージョニング（例：1.2.3）として表現されている場合でも正常に動作します。

このロジックは、アプリが起動したときに1回だけ実行されます。定期的にチェックを行う必要がある場合は、適切な場所で`fetchAppConfig`メソッドを呼び出してください。

---
