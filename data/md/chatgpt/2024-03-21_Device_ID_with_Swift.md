# Device ID with Swift

Date: 2024-03-21

---

## 👤 User
*2024-03-21 13:57:23*

SwiftでiPhone端末固有のIDを取得したい

---

## 🤖 Assistant
*2024-03-21 13:57:49*

iPhone端末固有のIDを取得するには、主に`UIDevice`クラスの`identifierForVendor`プロパティを使用します。このプロパティは、アプリのベンダー（開発者）ごとに端末に固有のIDを提供します。このIDは、ユーザーがそのベンダーの全てのアプリを端末から削除するまで同じ値を保持します。ただし、全てのアプリを削除後に再インストールすると、新しいIDが生成されます。

`identifierForVendor`は`UUID`型で値を返すので、`UUID`を`String`型に変換することがよくあります。以下はその実装例です。

```swift
import UIKit

class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        
        if let uniqueDeviceID = UIDevice.current.identifierForVendor?.uuidString {
            print("端末固有のID: \(uniqueDeviceID)")
        }
    }
}
```

このコードは、アプリのどこか（例えばビューコントローラの`viewDidLoad`メソッド内）で使用できます。`UIDevice.current.identifierForVendor?.uuidString`で端末固有のID（文字列）を取得し、それを印刷または必要に応じて使用します。

注意点として、このIDはユーザーのプライバシー保護のため、アプリを跨いだトラッキング目的での使用が制限されています。また、App Storeの審査ガイドラインに違反する使用方法は避ける必要があります。適切な使用法については、Appleのドキュメントやガイドラインを確認してください。

---

## 👤 User
*2024-03-21 13:59:25*

他に使えそうなIDはないか？

---

## 🤖 Assistant
*2024-03-21 14:00:03*

iOSでアプリ開発をする際、端末固有のIDを利用する理由は様々ありますが、ユーザーのプライバシー保護のためにAppleはそのようなIDの利用に厳しい制限を設けています。`identifierForVendor`以外に考えられる選択肢をいくつか紹介しますが、それぞれに適した使用シナリオがあり、利用には注意が必要です。

### 1. `identifierForVendor`
- 既に説明した通り、これはアプリのベンダー（開発者）によって提供される端末固有のIDです。アプリを削除して再インストールすると変わる可能性があります。

### 2. 広告識別子（IDFA: Identifier for Advertisers）
- これはユーザーがアプリ内で行う広告に関連したアクティビティを追跡するために使用されます。iOS 14以降、このIDを取得するためにはユーザーの許可が必要です（App Tracking Transparencyフレームワークを使用）。広告以外の目的での使用は推奨されません。

### 3. Keychainを使用したカスタムID
- アプリ固有のカスタムIDを生成し、それをiOSのKeychainサービスに保存する方法です。これにより、アプリを削除してもIDが保持され、同じ端末上であれば再インストール後も同じIDを保つことができます。セキュリティが高い反面、実装が複雑になる可能性があります。

### 4. iCloud Key-Value Storage
- ユーザーがiCloudを使用している場合、iCloud Key-Value Storageを利用してデバイス間でIDを共有することも可能です。しかし、これはユーザーが異なるデバイス間でアプリを使用しているシナリオ向けです。

### 注意点
- `UIDevice`の`uniqueIdentifier`（UDID）はiOS 5以降非推奨となり、アプリストアでの審査を通過できなくなりました。
- ユーザーのプライバシーに関わる情報を取り扱う場合は、常にユーザーの許可を得ること、そして用途を明確に説明することが重要です。また、取得した情報の保管と利用に関しても、適切なセキュリティ対策を講じる必要があります。

各IDの利用目的や制限をよく理解し、目的に合ったものを選択してください。また、Appleのプライバシーポリシーやガイドラインの変更にも注意して、常に最新の情報に基づいた開発を行うようにしてください。

---
