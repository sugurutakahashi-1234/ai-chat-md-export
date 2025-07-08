# Implementing Push Notifications

日付: 2024-07-04

---

## 👤 ユーザー
*2024/07/05 00:05:04*

Swiftでpush通知をしたい
SNSアプリで例えばTwitterのようにユーザーがツイートしたらフォローしているユーザー全員に通知を飛ばしたい

---

## 🤖 アシスタント
*2024/07/05 00:05:47*

Swiftでプッシュ通知を実装するには、以下のステップを踏む必要があります。SNSアプリにおいて、ユーザーがツイートしたときにフォロワー全員に通知を送るための流れを示します。

### 1. **APNs (Apple Push Notification service) 設定**

- **Apple Developer アカウントの設定**:
  1. Apple Developer アカウントにログインします。
  2. アプリの証明書とプロビジョニングプロファイルを作成し、APNsの設定を有効にします。

- **APNs 証明書の取得**:
  1. Certificates, Identifiers & Profiles セクションに移動します。
  2. "Keys" を選択し、新しいキーを作成し、APNsを有効にします。
  3. キーIDとキーを保存しておきます。

### 2. **サーバーサイドの設定**

プッシュ通知を送信するためのサーバーサイドコードを用意します。ここでは、Node.jsを使った例を示しますが、任意のバックエンド技術を使用できます。

- **Node.js の例**:

```javascript
const apn = require('apn');

let options = {
  token: {
    key: "path/to/AuthKey_XXXXXXXXXX.p8",
    keyId: "your-key-id",
    teamId: "your-team-id"
  },
  production: false // 本番環境の場合は true に設定
};

let apnProvider = new apn.Provider(options);

let deviceToken = "user-device-token"; // フォロワーのデバイストークン

let notification = new apn.Notification();
notification.topic = "com.yourapp.bundleid"; // あなたのアプリのバンドルID
notification.expiry = Math.floor(Date.now() / 1000) + 3600; // 有効期限
notification.sound = "ping.aiff";
notification.alert = "ユーザーが新しいツイートを投稿しました！";
notification.payload = { id: 123 };

apnProvider.send(notification, deviceToken).then(result => {
  console.log(result);
});
```

### 3. **iOS アプリの設定**

- **プッシュ通知の登録**:
  AppDelegate.swift にコードを追加して、プッシュ通知を登録します。

```swift
import UIKit
import UserNotifications

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
  
  var window: UIWindow?

  func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    // プッシュ通知の登録
    UNUserNotificationCenter.current().delegate = self
    UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .badge, .sound]) { granted, error in
      guard granted else { return }
      DispatchQueue.main.async {
        application.registerForRemoteNotifications()
      }
    }
    return true
  }

  func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
    let tokenParts = deviceToken.map { data in String(format: "%02.2hhx", data) }
    let token = tokenParts.joined()
    print("Device Token: \(token)")
    // デバイストークンをサーバーに送信
  }

  func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
    print("Failed to register: \(error)")
  }
}

extension AppDelegate: UNUserNotificationCenterDelegate {
  func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
    completionHandler([.alert, .badge, .sound])
  }
}
```

### 4. **通知の送信ロジック**

ユーザーがツイートを投稿した際に、フォロワーのデバイストークンを取得し、サーバーサイドで通知を送信します。

- **フォロワーへの通知**:
  1. ユーザーがツイートするたびに、フォロワーのデバイストークンをデータベースから取得。
  2. 上記のサーバーサイドコードを使って、フォロワー全員に通知を送信。

この流れでプッシュ通知を実装し、ユーザーがツイートした際にフォロワー全員に通知を送ることができます。

---

## 👤 ユーザー
*2024/07/05 00:06:26*

デバイストークンをサーバー側が紛失したときはどうすればいいか？

---

## 🤖 アシスタント
*2024/07/05 00:07:19*

デバイストークンをサーバー側で紛失した場合の対策として、以下のようなアプローチを取ることができます。

### 1. **デバイストークンの再取得と再送信**

アプリ起動時や定期的なイベント時に、デバイストークンを再度取得してサーバーに送信する機能を実装します。これにより、デバイストークンが変更された場合や紛失した場合でも、最新のトークンをサーバーに保持できます。

```swift
import UIKit
import UserNotifications

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
  
  var window: UIWindow?

  func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    // プッシュ通知の登録
    UNUserNotificationCenter.current().delegate = self
    UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .badge, .sound]) { granted, error in
      guard granted else { return }
      DispatchQueue.main.async {
        application.registerForRemoteNotifications()
      }
    }
    return true
  }

  func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
    let tokenParts = deviceToken.map { data in String(format: "%02.2hhx", data) }
    let token = tokenParts.joined()
    print("Device Token: \(token)")
    sendDeviceTokenToServer(token)
  }

  func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
    print("Failed to register: \(error)")
  }

  func sendDeviceTokenToServer(_ token: String) {
    // サーバーにデバイストークンを送信する処理
    // 例: URLSessionを使ってHTTPリクエストを送信
    guard let url = URL(string: "https://yourserver.com/api/device_token") else { return }
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    let body: [String: Any] = ["token": token, "userId": "current_user_id"]
    request.httpBody = try? JSONSerialization.data(withJSONObject: body, options: [])
    let task = URLSession.shared.dataTask(with: request) { data, response, error in
      if let error = error {
        print("Failed to send token: \(error)")
        return
      }
      print("Token sent successfully")
    }
    task.resume()
  }
}

extension AppDelegate: UNUserNotificationCenterDelegate {
  func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
    completionHandler([.alert, .badge, .sound])
  }
}
```

### 2. **サーバーサイドでのエラーハンドリングと再試行**

サーバーサイドでも、デバイストークンの送信に失敗した場合のエラーハンドリングを強化し、再試行やエラーログの記録を行うようにします。

- **再試行ロジック**:

```javascript
const apn = require('apn');

let options = {
  token: {
    key: "path/to/AuthKey_XXXXXXXXXX.p8",
    keyId: "your-key-id",
    teamId: "your-team-id"
  },
  production: false
};

let apnProvider = new apn.Provider(options);

async function sendNotification(deviceToken, notification) {
  try {
    let result = await apnProvider.send(notification, deviceToken);
    console.log(result);
    if (result.failed.length > 0) {
      // 失敗した場合の処理 (例: エラーログの記録や再試行)
      console.error("Failed to send notification:", result.failed);
      // 再試行ロジック (例: 一定の時間間隔で再試行)
    }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
}

// 通知の送信
let deviceToken = "user-device-token";
let notification = new apn.Notification();
notification.topic = "com.yourapp.bundleid";
notification.expiry = Math.floor(Date.now() / 1000) + 3600;
notification.sound = "ping.aiff";
notification.alert = "ユーザーが新しいツイートを投稿しました！";
notification.payload = { id: 123 };

sendNotification(deviceToken, notification);
```

### 3. **データベースのバックアップとリストア**

データベースのバックアップとリストアの手順を整備し、万が一のデータ紛失時に迅速に対応できるようにします。例えば、定期的なバックアップスクリプトを用意し、重要なデータ（デバイストークンなど）が失われないようにします。

### 4. **ユーザーインタラクション**

必要に応じて、ユーザーに再登録を促すインターフェースを用意します。ユーザーがアプリを再インストールした際や、トークンが失われたときに再度デバイストークンをサーバーに送信できるようにします。

これらの対策を組み合わせることで、デバイストークンの紛失に備え、安定したプッシュ通知の配信が可能になります。

---

## 👤 ユーザー
*2024/07/05 00:07:58*

サーバー側はユーザーidに対してデバイストークンをDBで管理するものなの？

---

## 🤖 アシスタント
*2024/07/05 00:08:39*

はい、サーバー側では通常、ユーザーIDに対してデバイストークンをデータベースで管理します。これにより、ユーザーが複数のデバイスを使用している場合でも、それぞれのデバイスに対して適切にプッシュ通知を送信することが可能になります。

### データベーススキーマの例

ここでは、ユーザーとデバイストークンを管理するためのシンプルなデータベーススキーマの例を示します。

#### テーブル構造
1. **users テーブル**
    - `id`: ユーザーID
    - `username`: ユーザー名

2. **device_tokens テーブル**
    - `id`: デバイストークンのユニークID
    - `user_id`: ユーザーID (users テーブルへの外部キー)
    - `device_token`: デバイストークン
    - `created_at`: トークンの登録日時
    - `updated_at`: トークンの最終更新日時

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL
);

CREATE TABLE device_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    device_token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### サーバー側での管理

#### デバイストークンの登録

ユーザーがアプリをインストールしてデバイストークンを取得したとき、サーバーにトークンを登録します。

```python
import psycopg2
from datetime import datetime

def register_device_token(user_id, device_token):
    conn = psycopg2.connect("dbname=yourdbname user=yourdbuser password=yourdbpassword host=yourdbhost")
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO device_tokens (user_id, device_token, created_at, updated_at)
        VALUES (%s, %s, %s, %s)
        ON CONFLICT (device_token) DO UPDATE 
        SET updated_at = %s
    """, (user_id, device_token, datetime.now(), datetime.now(), datetime.now()))
    conn.commit()
    cur.close()
    conn.close()
```

#### プッシュ通知の送信

ユーザーがツイートした際に、そのユーザーのフォロワーのデバイストークンを取得し、通知を送信します。

```python
import psycopg2
from apns2.client import APNsClient
from apns2.payload import Payload

def send_notification_to_followers(user_id, message):
    conn = psycopg2.connect("dbname=yourdbname user=yourdbuser password=yourdbpassword host=yourdbhost")
    cur = conn.cursor()
    
    # フォロワーのデバイストークンを取得 (ここでは仮にfollowersテーブルがあると仮定)
    cur.execute("""
        SELECT dt.device_token
        FROM device_tokens dt
        JOIN followers f ON dt.user_id = f.follower_id
        WHERE f.followed_id = %s
    """, (user_id,))
    
    device_tokens = cur.fetchall()
    conn.close()
    
    # APNsクライアントの初期化
    client = APNsClient('path/to/AuthKey_XXXXXXXXXX.p8', use_sandbox=True, team_id='your-team-id', key_id='your-key-id')
    payload = Payload(alert=message, sound="default", badge=1)
    
    for token in device_tokens:
        client.send_notification(token[0], payload, topic='com.yourapp.bundleid')

# 例として、ユーザーID 1 のユーザーがツイートしたとき
send_notification_to_followers(1, "ユーザーが新しいツイートを投稿しました！")
```

このようにして、ユーザーIDに対してデバイストークンをデータベースで管理し、プッシュ通知を適切に送信することができます。これにより、ユーザーが異なるデバイスを使用している場合でも、すべてのデバイスに対して通知を送信することが可能になります。

---

## 👤 ユーザー
*2024/07/05 00:09:01*

でも未ログインでも通知の許可が得られたり、同じ端末で複数アカウントにログインできたりするよね

---

## 🤖 アシスタント
*2024/07/05 00:09:46*

未ログイン状態でも通知の許可が得られる場合や、同じ端末で複数アカウントにログインできる場合を考慮して、デバイストークンの管理と通知送信ロジックを調整する必要があります。以下のような方法を取ると良いでしょう。

### デバイストークンの管理

#### 1. **デバイストークンとユーザーアカウントの多対多関係**

デバイストークンとユーザーアカウントの多対多関係を管理するために、中間テーブルを用意します。これにより、同じデバイストークンが複数のユーザーアカウントに関連付けられるようにします。

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL
);

CREATE TABLE device_tokens (
    id SERIAL PRIMARY KEY,
    device_token VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_device_tokens (
    user_id INTEGER NOT NULL REFERENCES users(id),
    device_token_id INTEGER NOT NULL REFERENCES device_tokens(id),
    PRIMARY KEY (user_id, device_token_id)
);
```

#### 2. **デバイストークンの登録と更新**

アプリ起動時やユーザーがログインするたびにデバイストークンをサーバーに送信し、データベースを更新します。

```python
import psycopg2
from datetime import datetime

def register_device_token(user_id, device_token):
    conn = psycopg2.connect("dbname=yourdbname user=yourdbuser password=yourdbpassword host=yourdbhost")
    cur = conn.cursor()
    
    # デバイストークンをdevice_tokensテーブルに挿入または更新
    cur.execute("""
        INSERT INTO device_tokens (device_token, created_at, updated_at)
        VALUES (%s, %s, %s)
        ON CONFLICT (device_token) DO UPDATE 
        SET updated_at = %s
        RETURNING id
    """, (device_token, datetime.now(), datetime.now(), datetime.now()))
    device_token_id = cur.fetchone()[0]
    
    # user_device_tokensテーブルに関連を挿入
    cur.execute("""
        INSERT INTO user_device_tokens (user_id, device_token_id)
        VALUES (%s, %s)
        ON CONFLICT (user_id, device_token_id) DO NOTHING
    """, (user_id, device_token_id))
    
    conn.commit()
    cur.close()
    conn.close()
```

### プッシュ通知の送信

ユーザーがツイートした際に、そのユーザーのフォロワーのすべてのデバイストークンを取得し、通知を送信します。

```python
import psycopg2
from apns2.client import APNsClient
from apns2.payload import Payload

def send_notification_to_followers(user_id, message):
    conn = psycopg2.connect("dbname=yourdbname user=yourdbuser password=yourdbpassword host=yourdbhost")
    cur = conn.cursor()
    
    # フォロワーのデバイストークンを取得
    cur.execute("""
        SELECT dt.device_token
        FROM device_tokens dt
        JOIN user_device_tokens udt ON dt.id = udt.device_token_id
        JOIN followers f ON udt.user_id = f.follower_id
        WHERE f.followed_id = %s
    """, (user_id,))
    
    device_tokens = cur.fetchall()
    conn.close()
    
    # APNsクライアントの初期化
    client = APNsClient('path/to/AuthKey_XXXXXXXXXX.p8', use_sandbox=True, team_id='your-team-id', key_id='your-key-id')
    payload = Payload(alert=message, sound="default", badge=1)
    
    for token in device_tokens:
        client.send_notification(token[0], payload, topic='com.yourapp.bundleid')

# 例として、ユーザーID 1 のユーザーがツイートしたとき
send_notification_to_followers(1, "ユーザーが新しいツイートを投稿しました！")
```

### 未ログインユーザーへの対応

未ログインユーザーの場合も、デバイストークンを管理し、必要に応じて通知を送信するための仕組みを用意します。例えば、アプリが初回起動された際にデバイストークンを取得し、ユーザーがログインした場合にそのトークンをユーザーアカウントに関連付けるなどの方法です。

これにより、未ログイン状態でも通知を受け取ることができ、同じデバイスで複数のアカウントにログインしている場合でも、各アカウントに適切に通知を送ることが可能になります。

---

## 👤 ユーザー
*2024/07/05 00:09:53*

図で説明してほしい

---

## 🤖 アシスタント
*2024/07/05 00:10:28*

{
  "prompt": "A diagram explaining the management of device tokens for push notifications in an SNS app. The diagram includes the following elements:

1. A user with a mobile device.
2. The device sending a push notification request with the device token to the server.
3. The server storing the device token in a database table called 'device_tokens'.
4. Another table called 'users' containing user information.
5. A many-to-many relationship table called 'user_device_tokens' linking 'users' and 'device_tokens'.
6. The process of a user tweeting, triggering a query to get the followers' device tokens.
7. The server sending push notifications to the devices of all followers.

The diagram should include arrows to indicate the flow of data between these elements."
}

---

## 🔧 ツール
*2024/07/05 00:10:28*

An error has occurred and we were unable to generate images. Please try again later.

---

## 🤖 アシスタント
*2024/07/05 00:10:28*

Certainly! Here's a textual representation of the diagram:

### Diagram Explanation: Device Token Management for Push Notifications

```
  +---------+                +----------------+                +--------------------+
  |  User   |   Request      |  Application   |   Store Token  |    Database        |
  |  with   +--------------> |    Server      +--------------> |    device_tokens   |
  |  Mobile |  Device Token  |                |  +---------+   |  +-----------------+
  | Device  |                |                |  |token_id |   |  | token_id        |
  +---------+                +----------------+  |device_token|   | device_token     |
                               Store User Info   +---------+   |  +-----------------+
                                                   ^           |
                                                   |           |
                                                   |           |   +----------------+
                                                   |           |   |   users        |
                                                   |           |   | +----------+   |
                                                   |           |   | | user_id  |   |
                                                 +---------+  |   | | username |   |
                                                 |user_id  |  |   | +----------+   |
                                                 +---------+  |   +----------------+
                                                      ^       |
                                                      |       |
                                                      |       |   +--------------------+
                                                      +------>|   user_device_tokens  |
                                                              |   +-------------+      |
                                                              |   | user_id     |      |
                                                              |   | token_id    |      |
                                                              |   +-------------+      |
                                                              +-----------------------+

```

### Flow Description

1. **User with Mobile Device**:
   - The user uses the mobile device to interact with the SNS app.

2. **Sending Device Token**:
   - The device sends a push notification request, including the device token, to the application server.

3. **Application Server**:
   - The server receives the device token and stores it in the `device_tokens` table.
   - The server also stores user information in the `users` table.

4. **Database**:
   - The `device_tokens` table holds device tokens with a unique `token_id`.
   - The `users` table holds user information with a unique `user_id`.
   - The `user_device_tokens` table manages the many-to-many relationship between users and device tokens, linking `user_id` and `token_id`.

5. **User Tweets**:
   - When a user tweets, the server queries the `user_device_tokens` table to get the device tokens of all followers.

6. **Sending Push Notifications**:
   - The server sends push notifications to the devices of all followers using their respective device tokens.

This diagram and description outline how device tokens are managed and how notifications are sent in an SNS app.

---
