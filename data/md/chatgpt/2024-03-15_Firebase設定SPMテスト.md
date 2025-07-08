# Firebase設定SPMテスト

Date: 2024-03-15

---

## 👤 User
*2024-03-15 15:28:26*

FirebaseApp.configure() で 環境に合わせて GoogleService-Info.plist だったりそれに相当する情報を与えたい。

ただ、SPMのテストターゲットで実行しているのでアプリフォルダ直下に置いている GoogleService-Info.plistを読み込むことはできない。

public enum BuildScheme: Sendable {
    case mock
    case staging
    case production
}

FirebaseApp.configure()

---

## 🤖 Assistant
*2024-03-15 15:29:44*

Swift Package Manager (SPM) のテストターゲットで `FirebaseApp.configure()` を使用して環境に応じた設定（`GoogleService-Info.plist`）をロードする方法は少し工夫が必要です。テストターゲットではアプリケーションのフォルダ構成とは異なるため、`GoogleService-Info.plist` ファイルを直接読み込むことができないのです。以下に、この問題を解決する方法を提案します。

### 1. リソースとして `GoogleService-Info.plist` を追加

テストターゲットに `GoogleService-Info.plist` をリソースとして追加します。これにより、テストの実行時にファイルにアクセスできるようになります。Xcode のプロジェクトナビゲータでテストターゲットを選択し、"Build Phases" &gt; "Copy Bundle Resources" にファイルを追加してください。

### 2. 環境に応じた設定の選択

`BuildScheme` 列挙型を使用して、環境に応じた設定ファイル（例: `GoogleService-Info-Mock.plist`, `GoogleService-Info-Staging.plist`, `GoogleService-Info-Production.plist`）を切り替えられます。これらのファイルもテストターゲットのリソースとして追加してください。

### 3. FirebaseApp.configure() の実装

テストの実行前に `FirebaseApp.configure()` を適切な設定で呼び出す必要があります。これを行うには、テストセットアップの一部として、以下のような関数を実装することができます。

```swift
func configureFirebase(forBuildScheme buildScheme: BuildScheme) {
    let plistFileName: String
    switch buildScheme {
    case .mock:
        plistFileName = "GoogleService-Info-Mock"
    case .staging:
        plistFileName = "GoogleService-Info-Staging"
    case .production:
        plistFileName = "GoogleService-Info-Production"
    }

    guard let filePath = Bundle(for: type(of: self)).path(forResource: plistFileName, ofType: "plist"),
          let options = FirebaseOptions(contentsOfFile: filePath) else {
        fatalError("Unable to find \(plistFileName).plist in the bundle.")
    }

    FirebaseApp.configure(options: options)
}
```

この関数をテストのセットアップで呼び出してください。例えば、XCTestCase の `setUpWithError()` メソッド内で使用できます。

### 注意事項

- `FirebaseApp.configure()` はアプリケーションのライフサイクル内で一度だけ呼び出す必要があります。テストの間、Firebase のインスタンスを複数回初期化しようとすると問題が発生する可能性があります。Firebase のインスタンスをクリアするための公式な方法は提供されていないため、テストごとに別のプロセスで実行するか、環境ごとに異なるテストスイートを構成することを検討してください。
- 上記のコード例では `Bundle(for: type(of: self))` を使用していますが、これはテストクラス内で定義されていることを前提としています。もしそれが異なる場合は、適切なバンドルを指定する必要があります。

---
