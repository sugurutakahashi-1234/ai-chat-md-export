# Flutter Google Playリンク

日付: 2025-01-12

---

## 👤 ユーザー
*2025/1/12 23:02:45*

FlutterからAndroid端末からstoreページを立ち上げる
https://play.google.com/store/apps/details?id=com.snapitonline.snap\_it

---

## 🤖 アシスタント
*2025/1/12 23:03:00*

FlutterアプリからAndroid端末で指定されたGoogle Playストアのページを立ち上げるには、`url_launcher` パッケージを使用できます。以下の手順で実装できます。

### 1. `url_launcher` パッケージの追加
まず、`pubspec.yaml`に以下のように記述して、`url_launcher` パッケージを追加します。

```yaml
dependencies:
  url_launcher: ^6.0.20
```

次に、`flutter pub get` コマンドを実行して依存関係を取得します。

---

### 2. AndroidManifest.xml の設定
Androidでは外部URLを開くためにインターネットパーミッションが必要になる場合があります。以下を `AndroidManifest.xml` に追加してください。

```xml
<uses-permission android:name="android.permission.INTERNET"/>
```

---

### 3. URLを開くコードの実装
以下は、指定されたGoogle PlayストアのURLを開くFlutterコード例です。

```dart
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class OpenStorePage extends StatelessWidget {
  final String _storeUrl =
      "https://play.google.com/store/apps/details?id=com.snapitonline.snap_it";

  Future<void> _launchStorePage() async {
    final Uri url = Uri.parse(_storeUrl);

    if (await canLaunchUrl(url)) {
      await launchUrl(
        url,
        mode: LaunchMode.externalApplication,
      );
    } else {
      // URLが開けなかった場合のエラーハンドリング
      throw 'Could not launch $_storeUrl';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Open Store Page"),
      ),
      body: Center(
        child: ElevatedButton(
          onPressed: _launchStorePage,
          child: Text("Open Google Play Store"),
        ),
      ),
    );
  }
}

void main() {
  runApp(MaterialApp(
    home: OpenStorePage(),
  ));
}
```

---

### コードの説明
1. **`url_launcher` の使い方**
   - `canLaunchUrl` を使って、指定したURLが開けるか確認します。
   - `launchUrl` で指定したURLを開きます。`LaunchMode.externalApplication` を指定することで、デフォルトのブラウザやアプリで開くようにしています。

2. **エラーハンドリング**
   - URLが開けなかった場合にエラーを投げる処理を追加しています。

3. **PlayストアのURL**
   - URLの形式は `https://play.google.com/store/apps/details?id=<アプリのパッケージ名>` です。今回は指定された `com.snapitonline.snap_it` を使用しています。

---

これでボタンを押すと、Google Playストアの該当ページが開くようになります。

---
