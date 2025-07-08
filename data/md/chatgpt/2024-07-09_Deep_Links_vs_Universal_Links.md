# Deep Links vs Universal Links

日付: 2024-07-09

---

## 👤 ユーザー
*2024/07/09 16:34:54*

ユニバーサルリンク、ディープリンク、カスタムURLスキームの違い

---

## 🤖 アシスタント
*2024/07/09 16:35:25*

ユニバーサルリンク、ディープリンク、カスタムURLスキームは、アプリ内の特定のコンテンツや機能に直接アクセスするための技術ですが、それぞれの実装方法や特性に違いがあります。

### ユニバーサルリンク（Universal Links）
- **概要**: iOS 9以降で導入された技術。特定のURLをクリックしたときに、アプリがインストールされていればアプリ内の対応するコンテンツに直接遷移し、インストールされていなければWebサイトが開く。
- **利点**:
  - ユーザーエクスペリエンスの向上: アプリがインストールされていない場合でも、同じURLでWebサイトに誘導できる。
  - セキュリティ: Appleのドメイン認証に基づいて動作するため、セキュリティが高い。
  - 柔軟性: 同じリンクがアプリとWebの両方に対応する。
- **設定**:
  - Apple-app-site-associationファイルをWebサーバーのルートに配置。
  - アプリで対応するアプリリンクを設定（Xcodeの設定やInfo.plistの編集）。

### ディープリンク（Deep Links）
- **概要**: アプリ内の特定の場所やコンテンツに直接遷移するリンクの総称。ユニバーサルリンクやカスタムURLスキームのどちらも含むが、一般的にはカスタムURLスキームを指すことが多い。
- **利点**:
  - 直接的なナビゲーション: アプリ内の特定の機能やコンテンツに一発でアクセスできる。
  - プロモーションやマーケティングに利用できる。
- **設定**:
  - ユニバーサルリンクやカスタムURLスキームを使用して実装。

### カスタムURLスキーム（Custom URL Schemes）
- **概要**: iOSの初期から存在する技術。特定のカスタムURLスキーム（例えば、myapp://）を使ってアプリを起動し、特定の機能やコンテンツに遷移させる。
- **利点**:
  - シンプル: 簡単に実装できる。
  - 高い互換性: すべてのiOSバージョンで動作。
- **欠点**:
  - ユーザーエクスペリエンスの一貫性に欠ける: アプリがインストールされていない場合、何も起こらない。
  - URLの競合: 他のアプリが同じカスタムURLスキームを使用していると競合する可能性がある。
- **設定**:
  - Info.plistファイルにカスタムURLスキームを追加。

### 比較まとめ
- **ユーザーエクスペリエンス**: ユニバーサルリンク &gt; ディープリンク（カスタムURLスキーム） 
- **実装の容易さ**: カスタムURLスキーム &gt; ユニバーサルリンク
- **柔軟性**: ユニバーサルリンク &gt; カスタムURLスキーム
- **セキュリティ**: ユニバーサルリンク &gt; カスタムURLスキーム

これらの技術を選ぶ際には、アプリの使用ケース、ユーザーエクスペリエンス、実装のコストなどを考慮して最適な方法を選ぶことが重要です。

---

## 👤 ユーザー
*2024/07/09 16:36:05*

いわゆる引数を設定してAPIを読んで特定の画面に遷移させたい。iOS16以降で実装してほしい。

---

## 🤖 アシスタント
*2024/07/09 16:36:36*

iOS 16以降で、特定の引数を持つURLを処理し、アプリ内の特定の画面に遷移させる方法は、ユニバーサルリンクとSceneDelegateを組み合わせて実現できます。以下に具体的な手順を示します。

### ステップ1: ユニバーサルリンクの設定
1. **Apple-app-site-associationファイルの作成**:
    - サーバーのルートに`apple-app-site-association`ファイルを配置します。ファイルには以下のような内容が含まれます。

    ```json
    {
      "applinks": {
        "apps": [],
        "details": [
          {
            "appIDs": ["<your_app_prefix>.<your_app_bundle_id>"],
            "paths": ["*"]
          }
        ]
      }
    }
    ```

2. **AppDelegateの設定**:
    - ユニバーサルリンクを処理するために`AppDelegate`の`application(_:continue:restorationHandler:)`メソッドを実装します。

    ```swift
    import UIKit

    @UIApplicationMain
    class AppDelegate: UIResponder, UIApplicationDelegate {

        var window: UIWindow?

        func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
            guard userActivity.activityType == NSUserActivityTypeBrowsingWeb,
                  let url = userActivity.webpageURL else {
                return false
            }
            
            // URLの解析と画面遷移ロジックを実装
            handleUniversalLink(url)
            
            return true
        }
        
        private func handleUniversalLink(_ url: URL) {
            // ここでURLを解析し、引数を取り出します
            let components = URLComponents(url: url, resolvingAgainstBaseURL: false)
            let params = components?.queryItems?.reduce(into: [String: String]()) { result, item in
                result[item.name] = item.value
            }
            
            // SceneDelegateを取得し、特定の画面に遷移
            if let sceneDelegate = UIApplication.shared.connectedScenes.first?.delegate as? SceneDelegate {
                sceneDelegate.navigateToSpecificView(with: params)
            }
        }
    }
    ```

### ステップ2: SceneDelegateの設定
3. **SceneDelegateで画面遷移を実装**:
    - SceneDelegateで特定の引数に基づいて適切な画面に遷移するロジックを実装します。

    ```swift
    import UIKit

    class SceneDelegate: UIResponder, UIWindowSceneDelegate {

        var window: UIWindow?

        func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
            guard let _ = (scene as? UIWindowScene) else { return }
        }
        
        func navigateToSpecificView(with params: [String: String]?) {
            // 引数に基づいて画面遷移を実装
            guard let window = window,
                  let rootViewController = window.rootViewController as? UINavigationController else {
                return
            }
            
            if let viewController = createViewController(from: params) {
                rootViewController.pushViewController(viewController, animated: true)
            }
        }
        
        private func createViewController(from params: [String: String]?) -&gt; UIViewController? {
            // パラメ

---
