# Create Various .apns Files

日付: 2024-07-10

---

## 👤 ユーザー
*2024/7/10 16:48:50*

いろんなパターンの.apnsのjsonファイルを作ってほしい

---

## 🤖 アシスタント
*2024/7/10 16:49:14*

様々なパターンの`.apns`ファイル（Apple Push Notification Service）を作成します。以下に、いくつかの異なる例を示します。

### 基本的な通知

```json
{
  "aps": {
    "alert": "Hello, world!",
    "badge": 1,
    "sound": "default"
  }
}
```

### カスタムサウンドとカテゴリーを含む通知

```json
{
  "aps": {
    "alert": {
      "title": "New Message",
      "body": "You have a new message from John"
    },
    "sound": "chime.aiff",
    "category": "MESSAGE_CATEGORY"
  },
  "customKey1": "customValue1",
  "customKey2": "customValue2"
}
```

### ミュート通知（サイレント通知）

```json
{
  "aps": {
    "content-available": 1
  },
  "customData": {
    "updateType": "background"
  }
}
```

### リッチ通知（画像付き）

```json
{
  "aps": {
    "alert": {
      "title": "Check this out!",
      "body": "Here's a cool image for you."
    },
    "mutable-content": 1
  },
  "media-url": "https://example.com/image.jpg"
}
```

### ローカライゼーションを含む通知

```json
{
  "aps": {
    "alert": {
      "title-loc-key": "GAME_PLAY_REQUEST_TITLE",
      "title-loc-args": ["John"],
      "loc-key": "GAME_PLAY_REQUEST_FORMAT",
      "loc-args": ["Five Card Draw"]
    },
    "badge": 5,
    "sound": "default"
  }
}
```

### アクションボタン付き通知

```json
{
  "aps": {
    "alert": {
      "title": "Event Reminder",
      "body": "Don't forget the meeting at 10 AM.",
      "action": "VIEW"
    },
    "category": "EVENT_INVITE"
  }
}
```

これらの例を元に、特定の要件に応じてさらにカスタマイズできます。各フィールドは、AppleのAPNsドキュメントに基づいて設定されています。必要に応じて、他のフィールドやカスタムデータを追加してください。

---

## 👤 ユーザー
*2024/7/10 16:54:48*

シンプルな画像付きのpushを用意したいhttps://placehold.jp/150x150.png

---

## 🤖 アシスタント
*2024/7/10 16:54:55*

シンプルな画像付きのPush通知の`.apns`ファイルを用意します。以下は、指定されたURLの画像を含むPush通知の例です。

```json
{
  "aps": {
    "alert": {
      "title": "New Image Available",
      "body": "Check out this new image!"
    },
    "mutable-content": 1
  },
  "media-url": "https://placehold.jp/150x150.png"
}
```

このファイルでは、`mutable-content`フィールドを1に設定することで、リッチ通知（画像付き通知）をサポートします。通知が届いた際に、指定されたURLの画像がユーザーに表示されます。

---

## 👤 ユーザー
*2024/7/10 16:55:39*

Simulator では画像はつけれれないのかな？

{
  "Simulator Target Bundle": "",
  "aps": {
    "alert": {
      "title": "New Image Available",
      "body": "Check out this new image!"
    },
    "mutable-content": 1
  },
  "media-url": "https://placehold.jp/150x150.png"
}

---

## 🤖 アシスタント
*2024/7/10 16:55:56*

iOS Simulatorでは画像付き通知をサポートしていますが、シミュレータ用に特別なフィールドを追加する必要があります。以下は、シミュレータで画像付き通知をテストするための完全な`.apns`ファイルの例です。

```json
{
  "Simulator Target Bundle": "com.yourcompany.yourapp",
  "aps": {
    "alert": {
      "title": "New Image Available",
      "body": "Check out this new image!"
    },
    "mutable-content": 1
  },
  "media-url": "https://placehold.jp/150x150.png"
}
```

- `"Simulator Target Bundle"`: これはあなたのアプリのバンドル識別子です。シミュレータがどのアプリに通知を送信するかを特定するために使用されます。`"com.yourcompany.yourapp"`をあなたのアプリのバンドル識別子に置き換えてください。
- `"mutable-content": 1`: これはリッチ通知をサポートするために必要です。

シミュレータでテストする際には、以下の手順を実行してください。

1. `.apns`ファイルを作成し、適切なバンドル識別子を設定します。
2. ターミナルを開き、以下のコマンドを実行して通知を送信します：

```sh
xcrun simctl push <device_id> <bundle_identifier> path/to/yourfile.apns
```

ここで、`<device_id>`はシミュレータのデバイスID（`xcrun simctl list`コマンドで確認できます）、`<bundle_identifier>`はアプリのバンドル識別子、`path/to/yourfile.apns`は作成した`.apns`ファイルのパスです。

これにより、シミュレータに画像付きのPush通知が送信され、画像が正しく表示されるはずです。

---

## 👤 ユーザー
*2024/7/10 17:02:34*

カスタムURLスキーマのようにしてアプリ内で遷移できるようにしたい

---

## 🤖 アシスタント
*2024/7/10 17:03:12*

アプリ内でカスタムURLスキーマを使用して遷移するために、以下のような`.apns`ファイルを作成できます。このファイルでは、通知をタップしたときに特定のURLスキーマを開くように設定します。

まず、`.apns`ファイルの例を以下に示します。

```json
{
  "Simulator Target Bundle": "com.yourcompany.yourapp",
  "aps": {
    "alert": {
      "title": "Special Offer",
      "body": "Check out this special offer now!"
    },
    "mutable-content": 1,
    "category": "CUSTOM_URL"
  },
  "media-url": "https://placehold.jp/150x150.png",
  "custom-url": "yourapp://special_offer"
}
```

この例では、通知にはカスタムURLスキーマ`yourapp://special_offer`が含まれています。

次に、アプリ内でカスタムURLスキーマを処理する方法を説明します。

1. **カスタムURLスキーマの設定**:

   Xcodeプロジェクトで、カスタムURLスキーマを設定します。

   - プロジェクトのターゲット設定に移動します。
   - 「Info」タブを選択します。
   - 「URL Types」を追加し、「URL Schemes」に`yourapp`を入力します。

2. **通知のカスタムアクションを設定**:

   アプリで通知を受け取ったときにカスタムURLを処理するために、AppDelegateやSceneDelegateにコードを追加します。

   ```swift
   import UIKit

   @main
   class AppDelegate: UIResponder, UIApplicationDelegate {

       func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
           // カスタム通知アクションを登録
           let customCategory = UNNotificationCategory(identifier: "CUSTOM_URL",
                                                       actions: [],
                                                       intentIdentifiers: [],
                                                       options: .customDismissAction)
           UNUserNotificationCenter.current().setNotificationCategories([customCategory])
           return true
       }

       func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable: Any], fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
           if let customURL = userInfo["custom-url"] as? String, let url = URL(string: customURL) {
               // カスタムURLを開く
               if application.canOpenURL(url) {
                   application.open(url, options: [:], completionHandler: nil)
               }
           }
           completionHandler(.newData)
       }
   }
   ```

3. **カスタムURLスキーマの処理**:

   カスタムURLスキーマを処理するために、`SceneDelegate`に以下のコードを追加します。

   ```swift
   import UIKit

   class SceneDelegate: UIResponder, UIWindowSceneDelegate {

       var window: UIWindow?

       func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
           guard let url = URLContexts.first?.url else { return }

           if url.scheme == "yourapp" {
               // カスタムURLスキーマを処理
               if url.host == "special_offer" {
                   // 特定の画面に遷移
                   let storyboard = UIStoryboard(name: "Main", bundle: nil)
                   if let viewController = storyboard.instantiateViewController(withIdentifier: "SpecialOfferViewController") as? SpecialOfferViewController {
                       window?.rootViewController?.present(viewController, animated: true, completion: nil)
                   }
               }
           }
       }
   }
   ```

これで、ユーザーが通知をタップしたときに、カスタムURLスキーマを使用して特定の画面に遷移できるようになります。必要に応じてカスタムURLのホストやパスを調整し、適切な画面に遷移するようにしてください。

---
