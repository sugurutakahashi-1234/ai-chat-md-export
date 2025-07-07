# Android ID取得方法

日付: 2024-12-12

---

## 👤 ユーザー
*2024/12/12 16:03:37*

Flutter でAndroidの idを取得したい

---

## 🤖 アシスタント
*2024/12/12 16:04:02*

Flutter で Android デバイスの ID（例えば Android ID）を取得するには、[**`device_info_plus`**](https://pub.dev/packages/device_info_plus) パッケージを使うのが一般的です。このパッケージはデバイスの情報を簡単に取得できるようにする便利な API を提供しています。

以下は、Flutter アプリで Android の ID を取得する方法の例です。

---

### **手順**

1. **パッケージをインストール**
   `pubspec.yaml` に以下を追加して、`device_info_plus` をインストールします。

   ```yaml
   dependencies:
     device_info_plus: ^10.4.0 # 最新バージョンを使用
   ```

   その後、ターミナルで `flutter pub get` を実行します。

2. **コードを記述**
   Android の ID を取得するには、以下のコードを使用します。

   ```dart
   import 'package:flutter/material.dart';
   import 'package:device_info_plus/device_info_plus.dart';

   class DeviceIdPage extends StatelessWidget {
     const DeviceIdPage({super.key});

     Future<String?> getAndroidId() async {
       final deviceInfo = DeviceInfoPlugin();
       final androidInfo = await deviceInfo.androidInfo;

       // Android ID を取得
       return androidInfo.id;
     }

     @override
     Widget build(BuildContext context) {
       return Scaffold(
         appBar: AppBar(
           title: const Text('Android ID取得'),
         ),
         body: FutureBuilder<String?>(
           future: getAndroidId(),
           builder: (context, snapshot) {
             if (snapshot.connectionState == ConnectionState.waiting) {
               return const Center(child: CircularProgressIndicator());
             } else if (snapshot.hasError) {
               return Center(child: Text('エラー: ${snapshot.error}'));
             } else if (snapshot.hasData) {
               return Center(child: Text('Android ID: ${snapshot.data}'));
             } else {
               return const Center(child: Text('Android IDを取得できませんでした'));
             }
           },
         ),
       );
     }
   }
   ```

3. **Android パーミッションの追加**
   Android ID を取得するためには追加のパーミッションは必要ありませんが、より多くのデバイス情報を取得する場合には以下を `AndroidManifest.xml` に追加する必要があります。

   ```xml
   <uses-permission android:name="android.permission.READ_PHONE_STATE" />
   ```

   ただし、Android ID はパーミッションなしで取得可能です。

4. **実行**
   アプリを実行して、Android デバイスで表示される ID を確認してください。

---

### **補足**
- **Android ID とは？**
  - Android ID (`Settings.Secure.ANDROID_ID`) は、デバイス固有の識別子で、一部の状況ではリセットされることがあります（例: デバイスの初期化）。
  - ユニークですが、公式のドキュメントではトラッキングなどの目的には使用しないことが推奨されています。

- **プライバシーとセキュリティ**
  - Android ID は個人情報に該当する可能性があるため、収集・利用時にはプライバシーポリシーに従うようにしてください。

このコードを使えば、簡単に Android ID を取得できます！何か他にお困りのことがあれば教えてください。 😊

---
