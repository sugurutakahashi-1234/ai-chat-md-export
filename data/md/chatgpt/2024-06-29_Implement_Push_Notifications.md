# Implement Push Notifications

日付: 2024-06-29

---

## 👤 ユーザー
*2024/6/29 10:54:12*

Swiftでpush通知を実装したい

---

## 🤖 アシスタント
*2024/6/29 10:54:37*

Swiftでのプッシュ通知の実装は、以下の手順で行います。ここでは、ユーザーがプッシュ通知を受信するために必要な主要な手順を示します。

### 1. App StoreでAPNs証明書を作成

1. **Apple Developerアカウントにログイン**:
   - [Apple Developer](https://developer.apple.com/account/)にログインします。

2. **証明書作成**:
   - 証明書、識別子、およびプロファイルに移動し、新しいAPNs証明書を作成します。

### 2. プロジェクト設定

1. **Capabilitiesの設定**:
   - Xcodeでプロジェクトを開き、プロジェクト設定の「Signing & Capabilities」タブに移動します。
   - `Push Notifications`と`Background Modes`を有効にし、`Remote notifications`を選択します。

2. **App IDの設定**:
   - プロビジョニングプロファイルがAPNsの設定と一致するように、App IDを設定します。

### 3. アプリケーションコードの設定

1. **AppDelegate.swift**で通知の登録を行います。

```swift
import UIKit
import UserNotifications

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        
        // 通知の許可をユーザーに求める
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .badge, .sound]) { (granted, error) in
            print("Permission granted: \(granted)")
        }
        
        application.registerForRemoteNotifications()
        
        return true
    }

    // デバイストークンの取得成功時に呼ばれる
    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        let tokenParts = deviceToken.map { data in String(format: "%02.2hhx", data) }
        let token = tokenParts.joined()
        print("Device Token: \(token)")
    }

    // デバイストークンの取得失敗時に呼ばれる
    func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
        print("Failed to register: \(error)")
    }
}
```

2. **通知の受信を設定**:
   通知を受け取るために`UNUserNotificationCenterDelegate`を設定します。

```swift
import UIKit
import UserNotifications

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate, UNUserNotificationCenterDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        
        // 通知の許可をユーザーに求める
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .badge, .sound]) { (granted, error) in
            print("Permission granted: \(granted)")
        }
        
        UNUserNotificationCenter.current().delegate = self
        
        application.registerForRemoteNotifications()
        
        return true
    }

    // デバイストークンの取得成功時に呼ばれる
    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        let tokenParts = deviceToken.map { data in String(format: "%02.2hhx", data) }
        let token = tokenParts.joined()
        print("Device Token: \(token)")
    }

    // デバイストークンの取得失敗時に呼ばれる
    func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
        print("Failed to register: \(error)")
    }
    
    // アプリがフォアグラウンドにいるときに通知を受信
    func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        completionHandler([.alert, .badge, .sound])
    }
}
```

### 4. サーバー側の設定

プッシュ通知を送信するためには、サーバー側でも設定が必要です。APNsを利用して通知を送信するサーバーを設定し、デバイストークンを使用して通知を送信します。

### 5. テスト

アプリが正しく通知を受信することを確認します。Xcodeのシミュレータではプッシュ通知をテストできないため、実際のデバイスでテストする必要があります。

以上がSwiftでプッシュ通知を実装する基本的な手順です。具体的なサーバー側の実装は使用するバックエンドの技術に依存します。

---

## 👤 ユーザー
*2024/6/29 10:55:07*

サーバー側の設定だったり証明書の設定だったりを教えてほしい

---

## 🤖 アシスタント
*2024/6/29 10:55:34*

### サーバー側の設定

プッシュ通知を送信するためには、Apple Push Notification Service (APNs)に通知を送信するサーバーを設定する必要があります。以下はその手順です。

#### 1. APNs証明書の作成

1. **Apple Developerアカウントにログイン**:
   - [Apple Developer](https://developer.apple.com/account/)にログインします。

2. **証明書、識別子、およびプロファイルに移動**:
   - 「Certificates, Identifiers & Profiles」に移動します。

3. **証明書の作成**:
   - 左側の「Certificates」を選択し、右上の「+」ボタンをクリックして新しい証明書を作成します。
   - 「Apple Push Notification service SSL (Sandbox & Production)」を選択し、続行します。

4. **App IDの選択**:
   - プッシュ通知を有効にするアプリのApp IDを選択し、続行します。

5. **CSRファイルの作成**:
   - Macのキーチェーンアクセスで「証明書アシスタント」を使ってCSR (Certificate Signing Request) ファイルを作成します。
   - 作成したCSRファイルをApple Developerサイトにアップロードします。

6. **証明書のダウンロード**:
   - APNs証明書が生成されたら、ダウンロードしてダブルクリックしてキーチェーンに追加します。

7. **P12ファイルの作成**:
   - キーチェーンアクセスで追加した証明書を右クリックし、「書き出す」を選択してP12ファイルを作成します。パスワードを設定します。

#### 2. サーバー側の設定

サーバー側の実装は使用するプラットフォームに依存しますが、ここではNode.jsの例を示します。

1. **必要なライブラリのインストール**:
   - `apn`ライブラリをインストールします。

```bash
npm install apn
```

2. **サンプルコード**:
   - 以下のようにAPNsに接続して通知を送信します。

```javascript
const apn = require('apn');

const options = {
  token: {
    key: "path/to/AuthKey_XXXXXXXXXX.p8",
    keyId: "your-key-id",
    teamId: "your-team-id"
  },
  production: false // Sandbox: false, Production: true
};

const apnProvider = new apn.Provider(options);

let deviceToken = "your-device-token";

let notification = new apn.Notification();
notification.alert = "Hello, this is a push notification!";
notification.sound = "ping.aiff";
notification.topic = "your.app.bundle.id";

apnProvider.send(notification, deviceToken).then((result) => {
  console.log(result);
});

// アプリケーション終了時にAPNプロバイダをシャットダウン
apnProvider.shutdown();
```

#### 3. トークンベースの認証

新しいAPNsのトークンベースの認証を使用する場合、`.p8`ファイルを使用します。これには、Apple Developerアカウントから生成されたAPNs Keyが必要です。

1. **Apple DeveloperアカウントでAPNs Keyの作成**:
   - 「Keys」セクションに移動し、新しいキーを作成します。
   - 「Apple Push Notification service (APNs)」を選択し、キーを生成します。
   - `.p8`ファイルをダウンロードします。

2. **サンプルコードの設定**:
   - 上記のNode.jsサンプルコードの`options`オブジェクトで`.p8`ファイル、keyId、teamIdを設定します。

### 証明書の設定

1. **P12ファイルの変換**:
   - サーバー側で使用する場合、P12ファイルをPEM形式に変換することもあります。

```bash
openssl pkcs12 -in path/to/certificate.p12 -out path/to/certificate.pem -nodes -clcerts
```

2. **証明書ファイルの配置**:
   - サーバーにPEMファイルを配置し、通知送信コードで使用します。

### 注意点

- **プロビジョニングプロファイル**:
  - Xcodeのプロジェクト設定で、APNsの証明書に一致するプロビジョニングプロファイルを使用する必要があります。

- **開発環境と本番環境**:
  - 開発環境（Sandbox）と本番環境（Production）で異なるAPNs証明書が必要になるため、適切な証明書を使用します。

- **セキュリティ**:
  - サーバー上の証明書やトークン情報は適切に保護し、セキュリティ対策を講じます。

以上が、Swiftでプッシュ通知を実装するためのサーバー側の設定および証明書の設定の詳細です。プッシュ通知を適切に設定することで、ユーザーに効果的に情報を提供することができます。

---
