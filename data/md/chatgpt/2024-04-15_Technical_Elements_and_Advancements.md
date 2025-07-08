# Technical Elements and Advancements

日付: 2024-04-15

---

## 👤 ユーザー
*2024/04/15 13:45:48*

英語にしてほしい

### 技術要素

- アーキテクチャ
  - Clean Architecture の設計概念の適応
  - Swfit Package Manager によるマルチモジュール構成
- テスト
  - [swift-testing](https://github.com/apple/swift-testing) によるテストコードの記述
  - [Mockolo](https://github.com/uber/mockolo) でのテスト用 Mock の自動生成
  - [PreviewSnapshots](https://github.com/doordash-oss/swiftui-preview-snapshots) による SwiftUI Previews のスナップショットテスト
  - TestPlan による多言語テスト対応
  - XCUITest による UI テスト
- Swift 6 対応
  - Swift Concurrency Cheacking の Complete 対応
  - protocol の `any` / `some` 対応
    - `any protocol` は使わず、すべて `some protocol` として実装
- 新しい技術への挑戦
  - [Observation](https://developer.apple.com/documentation/observation) による Data Binding
  - [String Catalogs](https://developer.apple.com/documentation/xcode/localizing-and-varying-text-with-a-string-catalog) による多言語対応
- 開発体験向上
  - Xcode Cloud による CI/CD
  - [Sourcery](https://github.com/krzysztofzablocki/Sourcery) によるボイラープレートコードの自動生成
  - [Periphery](https://github.com/peripheryapp/periphery) による不要なコードの静的解析
  - [Renovate](https://github.com/renovatebot/renovate) によるライブラリのアップデートの管理（[ダッシュボード Issue](https://github.com/suguruTakahashi-1234/DISample/issues/38)）
  - [Swift-DocC](https://www.swift.org/documentation/docc/) による Documentation as Code の取り組み
  - GitHub Actions による [Swift-DocC](https://www.swift.org/documentation/docc/) の Hosting
- ライブラリ管理
  - Swfit Package Manager
  - [Mint](https://github.com/yonaskolb/Mint) (Swfit Package Manager 経由での導入)

---

## 🤖 アシスタント
*2024/04/15 13:46:20*

### Technical Elements

- **Architecture**
  - Adaptation of Clean Architecture design concepts
  - Multi-module configuration via Swift Package Manager
- **Testing**
  - Writing test code using [swift-testing](https://github.com/apple/swift-testing)
  - Automated generation of test mocks with [Mockolo](https://github.com/uber/mockolo)
  - Snapshot testing of SwiftUI Previews with [PreviewSnapshots](https://github.com/doordash-oss/swiftui-preview-snapshots)
  - Multilingual testing support with TestPlan
  - UI testing with XCUITest
- **Swift 6 Support**
  - Complete support for Swift Concurrency Checking
  - Implementation of protocols using `any`/`some`
    - No use of `any protocol`, implemented entirely with `some protocol`
- **Embracing New Technologies**
  - Data binding with [Observation](https://developer.apple.com/documentation/observation)
  - Multilingual support with [String Catalogs](https://developer.apple.com/documentation/xcode/localizing-and-varying-text-with-a-string-catalog)
- **Improving Development Experience**
  - CI/CD with Xcode Cloud
  - Automatic generation of boilerplate code with [Sourcery](https://github.com/krzysztofzablocki/Sourcery)
  - Static analysis of unused code with [Periphery](https://github.com/peripheryapp/periphery)
  - Management of library updates with [Renovate](https://github.com/renovatebot/renovate) ([Dashboard Issue](https://github.com/suguruTakahashi-1234/DISample/issues/38))
  - Documentation as Code initiative with [Swift-DocC](https://www.swift.org/documentation/docc/)
  - Hosting of [Swift-DocC](https://www.swift.org/documentation/docc/) with GitHub Actions
- **Library Management**
  - Swift Package Manager
  - [Mint](https://github.com/yonaskolb/Mint) (introduced via Swift Package Manager)

---

## 👤 ユーザー
*2024/04/15 13:46:33*

マークダウンファイルにしてほしい。

---

## 🤖 アシスタント
*2024/04/15 13:47:05*

Sure! Here's the content translated into English and formatted as a markdown file:

```markdown
# Technical Elements

## Architecture
- Adaptation of Clean Architecture design concepts
- Multi-module configuration via Swift Package Manager

## Testing
- Writing test code using [swift-testing](https://github.com/apple/swift-testing)
- Automated generation of test mocks with [Mockolo](https://github.com/uber/mockolo)
- Snapshot testing of SwiftUI Previews with [PreviewSnapshots](https://github.com/doordash-oss/swiftui-preview-snapshots)
- Multilingual testing support with TestPlan
- UI testing with XCUITest

## Swift 6 Support
- Complete support for Swift Concurrency Checking
- Implementation of protocols using `any`/`some`
  - No use of `any protocol`, implemented entirely with `some protocol`

## Embracing New Technologies
- Data binding with [Observation](https://developer.apple.com/documentation/observation)
- Multilingual support with [String Catalogs](https://developer.apple.com/documentation/xcode/localizing-and-varying-text-with-a-string-catalog)

## Improving Development Experience
- CI/CD with Xcode Cloud
- Automatic generation of boilerplate code with [Sourcery](https://github.com/krzysztofzablocki/Sourcery)
- Static analysis of unused code with [Periphery](https://github.com/peripheryapp/periphery)
- Management of library updates with [Renovate](https://github.com/renovatebot/renovate) ([Dashboard Issue](https://github.com/suguruTakahashi-1234/DISample/issues/38))
- Documentation as Code initiative with [Swift-DocC](https://www.swift.org/documentation/docc/)
- Hosting of [Swift-DocC](https://www.swift.org/documentation/docc/) with GitHub Actions

## Library Management
- Swift Package Manager
- [Mint](https://github.com/yonaskolb/Mint) (introduced via Swift Package Manager)
```

You can copy this content into a markdown file as needed. If you require any further customizations or additions, feel free to ask!

---
