# Display App in iOS.

Date: 2024-06-17

---

## 👤 User
*2024-06-17 17:27:57*

2つ教えてほしい。
1. iPhoneでシェアしようとするときに、今から開発するアプリがその候補になる方法
2. 今から開発するアプリでShareLinkの機能でインスタグラムなどをシェアする候補に表示する方法。

---

## 🤖 Assistant
*2024-06-17 17:28:07*

### 1. アプリをシェア候補に表示する方法

iPhoneでアプリをシェア候補に表示するためには、アプリがシステム共有シートに対応している必要があります。以下の手順で実装できます。

#### Info.plistの設定
まず、`Info.plist`ファイルに以下のキーを追加します。

```xml
<key>CFBundleDocumentTypes</key>
<array>
    <dict>
        <key>CFBundleTypeName</key>
        <string>Your Custom Document Type</string>
        <key>LSHandlerRank</key>
        <string>Owner</string>
        <key>LSItemContentTypes</key>
        <array>
            <string>public.content</string>
        </array>
    </dict>
</array>
```

#### AppDelegate.swiftの設定
`AppDelegate.swift`でシェアされるデータを受け取る処理を実装します。

```swift
import UIKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -&gt; Bool {
        // URLを受け取り、適切に処理する
        handleIncomingURL(url)
        return true
    }

    private func handleIncomingURL(_ url: URL) {
        //

---
