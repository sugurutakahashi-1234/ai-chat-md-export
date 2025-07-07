# APNS Token Missing Error

日付: 2024-07-10

---

## 👤 ユーザー
*2024/7/10 14:27:20*

⚠️ Error(appError: DomainLayer.AppError.customError("Error Domain=com.google.fcm Code=505 \\"No APNS token specified before fetching FCM Token\\" UserInfo={NSLocalizedFailureReason=No APNS token specified before fetching FCM Token}"), errorName: "customError(\\"Error Domain=com.google.fcm Code=505 \\\\\\"No APNS token specified before fetching FCM Token\\\\\\" UserInfo={NSLocalizedFailureReason=No APNS token specified before fetching FCM Token}\\")"), file: AppRootDIContainer.swift, function: init(buildScheme:), line: 122

---

## 🤖 アシスタント
*2024/7/10 14:27:46*

The error message indicates that there's an issue with fetching the FCM (Firebase Cloud Messaging) token due to the absence of an APNS (Apple Push Notification Service) token. Here are steps to troubleshoot and resolve this issue:

1. **Register for Remote Notifications**:
   Ensure your app registers for remote notifications and retrieves an APNS token from Apple. This is typically done in the AppDelegate or SceneDelegate, depending on your app's structure.

   ```swift
   import UIKit
   import Firebase

   @UIApplicationMain
   class AppDelegate: UIResponder, UIApplicationDelegate {
   
       func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
           FirebaseApp.configure()
           UNUserNotificationCenter.current().delegate = self
           application.registerForRemoteNotifications()
           return true
       }

       func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
           Messaging.messaging().apnsToken = deviceToken
       }
   
       func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
           print("Failed to register for remote notifications: \(error.localizedDescription)")
       }
   }

   @available(iOS 10, *)
   extension AppDelegate: UNUserNotificationCenterDelegate {
       func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
           completionHandler([.alert, .badge, .sound])
       }
   }
   ```

2. **Ensure Firebase is Properly Configured**:
   Ensure that Firebase is properly configured in your app. Check that you have added the `GoogleService-Info.plist` file to your project and initialized Firebase correctly in your `AppDelegate`.

3. **Check APNS Token Retrieval**:
   Verify that your app successfully retrieves an APNS token by adding some debugging statements in the `didRegisterForRemoteNotificationsWithDeviceToken` method.

   ```swift
   func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
       print("APNS token retrieved: \(deviceToken.map { String(format: "%02.2hhx", $0) }.joined())")
       Messaging.messaging().apnsToken = deviceToken
   }
   ```

4. **Ensure APNS Token is Set Before Fetching FCM Token**:
   Make sure that the APNS token is set on the `Messaging` instance before attempting to fetch the FCM token.

   ```swift
   Messaging.messaging().token { token, error in
       if let error = error {
           print("Error fetching FCM token: \(error)")
       } else if let token = token {
           print("FCM token: \(token)")
       }
   }
   ```

5. **Check Firebase Console**:
   Verify that your app's push notification settings are correctly configured in the Firebase Console.

6. **Handle Initialization Timing**:
   Ensure that the initialization of Firebase and the registration for remote notifications are properly sequenced. Firebase should be configured before attempting to register for remote notifications.

By following these steps, you should be able to resolve the issue related to the missing APNS token when fetching the FCM token. If the problem persists, consider reviewing the detailed Firebase and APNS integration guides provided by Google and Apple.

---
