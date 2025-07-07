# Automating iOS App Store Deployment with Xcode Cloud

日付: 2025-04-13

---

## 👤 ユーザー
*2025/4/13 17:10:09*

iOSアプリのストア配信の自動化についていろいろ教えて欲しい。スクリーンショットや説明文などのテンプレートを作って自動化できないか検討したい。Xcode Cloudを用いたい。

---

## 🤖 アシスタント
*2025/4/13 17:10:26*

iOSアプリのストア配信の自動化についてご説明します。Xcode Cloudを中心に、スクリーンショットや説明文の自動化も含めてご紹介します。

## Xcode Cloudによる自動化

Xcode Cloudは、Apple提供のCI/CDシステムで、アプリのビルド、テスト、App Storeへの配信までを自動化できます。

### 基本的なワークフロー設定

1. **Xcode Cloud Workflowの設定**:
   - App Store Connectでプロジェクトを選択
   - 「ワークフロー」タブで新しいワークフローを作成
   - ビルド条件（特定のブランチへのコミット時など）を設定
   - テスト、アーカイブ、配布のステップを設定

2. **自動配信プロセス**:
   - テスト通過後に自動的にTestFlightへアップロード
   - App Storeへの配信も自動化可能（審査提出まで）

## スクリーンショットと説明文の自動化

### スクリーンショットの自動化

1. **Fastlaneを活用**:
   ```ruby
   lane :screenshots do
     capture_screenshots
     frame_screenshots
   end
   ```

2. **UIテストでスクリーンショット撮影**:
   ```swift
   func testTakeScreenshots() {
     let app = XCUIApplication()
     setupSnapshot(app)
     app.launch()
     
     // 画面遷移
     app.buttons["開始"].tap()
     
     // スクリーンショット撮影
     snapshot("01_main_screen")
     
     // 他の画面も同様に
   }
   ```

3. **Xcode Cloudとの連携**:
   - CI環境でUIテストの一部としてスクリーンショット撮影を実行
   - 結果をアーティファクトとして保存

### 説明文とメタデータの自動化

1. **メタデータのテンプレート化**:
   - `fastlane/metadata` ディレクトリに言語ごとにテンプレートを準備
   - プレースホルダーを使用して動的コンテンツを挿入

2. **Deliver設定例**:
   ```ruby
   lane :upload_metadata do
     deliver(
       skip_binary_upload: true,
       skip_screenshots: false,
       force: true
     )
   end
   ```

3. **変数を使った説明文の自動生成**:
   - バージョン番号、新機能リストなどを環境変数から挿入
   - Gitコミットメッセージから更新内容を自動抽出

## 完全自動化ワークフローの例

Xcode CloudとFastlaneを組み合わせた完全な自動化ワークフローを作成できます：

1. **リポジトリ構成**:
   - `fastlane/` ディレクトリ内に必要なスクリプト配置
   - `metadata/` ディレクトリに各言語のテンプレート配置
   - UIテストにスクリーンショット撮影コード追加

2. **自動実行スクリプト**:
   - リリース前にスクリーンショット撮影
   - メタデータの更新と生成
   - App Storeへのアップロード準備

3. **Xcode Cloud連携**:
   - Post-actions でFastlaneコマンドを実行
   - 成功時にSlackなどへの通知も設定可能

具体的な実装や設定方法について、さらに詳しく知りたい部分がありましたらお知らせください。

---

## 👤 ユーザー
*2025/4/13 17:10:52*

fastlane は使いたくないがどうだろう。

---

## 🤖 アシスタント
*2025/4/13 17:11:12*

Fastlaneを使わずにiOSアプリのストア配信を自動化する方法を検討しましょう。Xcode Cloudを中心とした代替アプローチをご紹介します。

## Xcode Cloud単体での自動化

Xcode Cloudだけでも、多くの自動化が可能です：

### ビルドと配布の自動化

1. **ワークフロー設定**:
   - App Store Connectでワークフローを作成
   - 特定のブランチへのプッシュやタグ付けをトリガーに設定
   - アーカイブとTestFlightへの自動配布を設定

2. **環境変数の活用**:
   - ビルド番号の自動インクリメント
   - バージョン情報の自動設定

3. **カスタムスクリプト**:
   - ビルド前/後に実行するシェルスクリプトを設定
   - アプリ情報の動的更新に利用可能

### スクリーンショットの自動化

Fastlaneなしでスクリーンショットを自動化するには、UIテストを直接使用します：

1. **UIテストを利用したスクリーンショット**:
   ```swift
   import XCTest

   class ScreenshotTests: XCTestCase {
       func testAppScreenshots() {
           let app = XCUIApplication()
           app.launch()
           
           // メイン画面
           takeScreenshot(named: "main_screen")
           
           // 他の画面への遷移
           app.buttons["設定"].tap()
           takeScreenshot(named: "settings_screen")
           
           // 他の画面も同様に
       }
       
       func takeScreenshot(named name: String) {
           let attachment = XCTAttachment(screenshot: XCUIScreen.main.screenshot())
           attachment.name = name
           attachment.lifetime = .keepAlways
           add(attachment)
       }
   }
   ```

2. **Xcode Cloudでの実行**:
   - テスト実行をワークフローに含める
   - 結果のスクリーンショットをアーティファクトとして保存

3. **カスタムスクリプトでの後処理**:
   - テスト後にスクリーンショットをApp Store用に整形するシェルスクリプト
   - 画像のリサイズや処理にImageMagickなどのツールを使用

### メタデータの自動化

1. **App Store Connect API**:
   - Apple提供のAPIを直接使用
   - アプリ情報の更新やメタデータのアップロードが可能

2. **テンプレートシステム**:
   - Jinja2やMustacheなどのテンプレートエンジンを使用
   - シェルスクリプトで処理を実装

3. **実装例**:
   ```bash
   #!/bin/bash
   
   # バージョン情報の取得
   VERSION=$(xcodebuild -showBuildSettings | grep MARKETING_VERSION | sed 's/.*= //')
   BUILD=$(xcodebuild -showBuildSettings | grep CURRENT_PROJECT_VERSION | sed 's/.*= //')
   
   # テンプレートからリリースノート生成
   cat templates/release_notes.tpl | sed "s/{{VERSION}}/$VERSION/g" > output/release_notes.txt
   
   # App Store Connect APIでアップロード
   xcrun altool --upload-app-metadata --type ios --file output/metadata.json --apiKey $API_KEY_ID --apiIssuer $API_ISSUER_ID
   ```

## Xcode Cloudとの統合例

1. **ワークフロー設定**:
   - プッシュ時に自動ビルドとテスト
   - タグ付け時にTestFlightへ配布
   - リリースブランチへのマージでApp Store審査提出準備

2. **ビルド前アクション**:
   - バージョン番号の更新
   - リソースファイルの処理
   - 設定ファイルの環境別切り替え

3. **ビルド後アクション**:
   - テスト結果の収集
   - スクリーンショットの処理
   - Slack/Teamsへの通知

Fastlaneなしでも、シェルスクリプトとXcode Cloud、App Store Connect APIを組み合わせることで、効率的な自動化が実現可能です。より具体的な部分について質問があれば、お気軽にどうぞ。

---
