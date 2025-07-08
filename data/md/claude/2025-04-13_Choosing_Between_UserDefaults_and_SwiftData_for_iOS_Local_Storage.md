# Choosing Between UserDefaults and SwiftData for iOS Local Storage

Date: 2025-04-13

---

## 👤 User
*2025-04-13 20:04:43*

iOSのローカルストレージの使い方について相談があります。ユーザーデフォルトを使うべきかSwiftDataを使うべきかよくわかっていない

---

## 🤖 Assistant
*2025-04-13 20:04:57*

ご質問ありがとうございます。iOSのローカルストレージについてのご相談ですね。UserDefaults（ユーザーデフォルト）とSwiftDataの使い分けについて説明します。

## UserDefaults
UserDefaultsは軽量のキーバリュー型ストレージで、以下のような用途に適しています：
- 小さな設定データの保存（テーマ設定、言語設定など）
- ブール値、数値、文字列などの単純なデータ型
- アプリの起動回数など統計情報の保存
- ユーザーの簡単な設定の永続化

```swift
// 保存の例
UserDefaults.standard.set(true, forKey: "isFirstLaunch")
UserDefaults.standard.set("日本語", forKey: "selectedLanguage")

// 読み込みの例
let isFirstLaunch = UserDefaults.standard.bool(forKey: "isFirstLaunch")
let language = UserDefaults.standard.string(forKey: "selectedLanguage")
```

## SwiftData
SwiftDataはSwift UI専用に設計された新しいデータ永続化フレームワークで、iOS 17以降で利用可能です。以下のような用途に適しています：
- 複雑なデータモデルやオブジェクトグラフの保存
- リレーショナルデータの管理
- 大量のデータを扱うアプリケーション
- クエリ、フィルタリング、ソートなど高度なデータ操作が必要な場合

```swift
// モデル定義の例
@Model
class Task {
    var title: String
    var isCompleted: Bool
    var createdAt: Date
    
    init(title: String, isCompleted: Bool = false) {
        self.title = title
        self.isCompleted = isCompleted
        self.createdAt = Date()
    }
}

// SwiftUIでのコンテキスト利用例
struct ContentView: View {
    @Environment(\.modelContext) private var context
    @Query private var tasks: [Task]
    
    var body: some View {
        List {
            ForEach(tasks) { task in
                Text(task.title)
            }
        }
        .toolbar {
            Button("Add") {
                let newTask = Task(title: "New Task")
                context.insert(newTask)
            }
        }
    }
}
```

## 選択の基準

以下のような基準で選択することをお勧めします：

1. **データの複雑さ**: 単純なキーバリューならUserDefaults、オブジェクトや関連性のあるデータならSwiftData
2. **データ量**: 少量ならUserDefaults、大量ならSwiftData
3. **操作の複雑さ**: 単純な読み書きならUserDefaults、複雑なクエリやフィルタリングが必要ならSwiftData
4. **iOS対応バージョン**: iOS 17未満をサポートする必要があればSwiftDataは使えません

もし詳しい情報が必要であれば、具体的なアプリケーションの用途や保存したいデータの種類について教えていただければ、より詳細なアドバイスができます。

---

## 👤 User
*2025-04-13 20:05:45*

このデータが削除されたりすることはあるのか？またテスト時にダミーデータを入れたい場合などについても知りたい。また、キャッシュとして残してどう設計するのかも考慮して欲しい

---

## 🤖 Assistant
*2025-04-13 20:06:12*

データの削除可能性とテストデータ、キャッシュ設計について追加情報をご説明します。

## データの削除可能性

### UserDefaults
- **アプリ削除時**: アプリをアンインストールするとUserDefaultsのデータは削除されます
- **設定アプリからの削除**: iOSの設定アプリから「ストレージ」→「アプリ名」→「データを削除」を選択した場合も削除されます
- **プログラムでの削除**: `removeObject(forKey:)`や`reset()`で削除可能です
- **OSによる削除**: iOSのストレージ容量が極端に不足した場合、システムが自動的に削除することがあります（稀です）

### SwiftData
- **アプリ削除時**: アプリをアンインストールするとSwiftDataのデータベースも削除されます
- **プログラムでの削除**: コンテキストを通じてエンティティの削除が可能です
- **永続性**: UserDefaultsよりも耐久性が高く、システムによる自動削除はほぼありません

## テスト用ダミーデータの挿入

### UserDefaults
```swift
// テスト環境でのダミーデータ設定
if ProcessInfo.processInfo.environment["XCTestConfigurationFilePath"] != nil {
    let defaults = UserDefaults.standard
    defaults.set("テストユーザー", forKey: "username")
    defaults.set(5, forKey: "loginCount")
}

// または別のUserDefaultsインスタンスを使用
let testDefaults = UserDefaults(suiteName: "test")
testDefaults?.set("テストデータ", forKey: "testKey")
```

### SwiftData
```swift
// テスト環境でのSwiftDataセットアップとダミーデータ挿入
@MainActor
func setupTestDatabase() {
    let config = ModelConfiguration(isStoredInMemoryOnly: true)
    let container = try! ModelContainer(for: Task.self, configurations: config)
    
    let context = container.mainContext
    
    // ダミーデータ挿入
    let task1 = Task(title: "テストタスク1")
    let task2 = Task(title: "テストタスク2", isCompleted: true)
    
    context.insert(task1)
    context.insert(task2)
    
    try? context.save()
    
    // テスト用のViewでこのコンテナを使用
    MyTestView().modelContainer(container)
}
```

## キャッシュ設計の考慮事項

### キャッシュ層の設計パターン
1. **リポジトリパターン**:
```swift
// キャッシュとローカルストレージを抽象化するリポジトリ
class UserRepository {
    private let cache = NSCache<NSString, AnyObject>()
    
    func getUser(id: String) async throws -> User {
        // 1. キャッシュをチェック
        if let cachedUser = cache.object(forKey: id as NSString) as? User {
            return cachedUser
        }
        
        // 2. SwiftDataから取得
        let user = try await fetchUserFromSwiftData(id: id)
        
        // 3. キャッシュに保存
        cache.setObject(user, forKey: id as NSString)
        
        return user
    }
    
    // SwiftDataアクセスメソッド...
}
```

2. **有効期限付きキャッシュ**:
```swift
struct CachedItem<T> {
    let item: T
    let timestamp: Date
    let expirationTime: TimeInterval
    
    var isValid: Bool {
        Date().timeIntervalSince(timestamp) < expirationTime
    }
}

class CacheManager {
    private var cache = [String: CachedItem<Any>]()
    
    func set<T>(key: String, value: T, expirationTime: TimeInterval = 3600) {
        let cachedItem = CachedItem(item: value, timestamp: Date(), expirationTime: expirationTime)
        cache[key] = cachedItem as? CachedItem<Any>
    }
    
    func get<T>(key: String) -> T? {
        guard let cachedItem = cache[key] as? CachedItem<T>, 
              cachedItem.isValid else {
            return nil
        }
        return cachedItem.item
    }
}
```

### データの種類別キャッシュ戦略

1. **頻繁に変更されないデータ（設定、ユーザー情報など）**:
   - UserDefaultsに保存し、メモリ内キャッシュとしてアプリセッション中保持

2. **一時的なデータ（検索結果、最近表示したアイテムなど）**:
   - NSCacheまたはカスタムキャッシュクラスでメモリに保持
   - オプションでSwiftDataに永続化し、キャッシュヒットしない場合に読み込み

3. **大量のデータ（画像、メディアなど）**:
   - ファイルシステム（FileManager）にキャッシュ
   - メタデータをSwiftDataで管理

4. **オフライン対応が必要なデータ**:
   - SwiftDataに完全保存
   - 同期状態の管理フラグを設定（「同期済み」「未同期」など）

### キャッシュ無効化戦略

```swift
// 更新イベントに基づくキャッシュ無効化
func updateUserProfile(user: User) async throws {
    try await apiService.updateUser(user)
    
    // SwiftDataを更新
    try await updateUserInSwiftData(user)
    
    // キャッシュを無効化
    cache.removeObject(forKey: user.id as NSString)
    
    // または最新データで更新
    cache.setObject(user, forKey: user.id as NSString)
    
    // 通知を送信
    NotificationCenter.default.post(name: .userProfileUpdated, object: user)
}
```

実際の設計では、アプリの規模、データ量、更新頻度、オフラインサポートの要件などに基づいて最適な戦略を選択することをお勧めします。具体的なアプリケーションの要件があれば、さらに詳細なアドバイスが可能です。

---
