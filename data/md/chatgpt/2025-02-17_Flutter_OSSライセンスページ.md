# Flutter OSSライセンスページ

日付: 2025-02-17

---

## 👤 ユーザー
*2025/02/18 01:05:49*

flutter oss license ページ作成

---

## 🤖 アシスタント
*2025/02/18 01:06:59*

Flutterアプリでオープンソースライセンスを表示するページを作成する方法はいくつかありますが、最も一般的なのは以下の方法です。

### 方法1: `flutter_license_page` パッケージを使用する
このパッケージを使うと、簡単にライセンスページを追加できます。

#### 1. パッケージを追加
```sh
flutter pub add flutter_license_page
```

#### 2. ライセンスページを表示
```dart
import 'package:flutter/material.dart';
import 'package:flutter_license_page/flutter_license_page.dart';

class OssLicensePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return LicensePage(
      applicationName: 'Your App Name',
      applicationVersion: '1.0.0',
      applicationLegalese: '© 2024 Your Company',
    );
  }
}
```

ナビゲーションに追加するには、`Navigator.push` で `OssLicensePage` を開くようにします。

### 方法2: `showLicensePage` を使う
Flutterには `showLicensePage` という組み込みの方法もあります。

```dart
import 'package:flutter/material.dart';

class SettingsPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Settings")),
      body: ListView(
        children: [
          ListTile(
            title: Text("Open Source Licenses"),
            onTap: () {
              showLicensePage(
                context: context,
                applicationName: 'Your App Name',
                applicationVersion: '1.0.0',
              );
            },
          ),
        ],
      ),
    );
  }
}
```

### 方法3: `flutter_oss_licenses` を使う（手動リスト生成）
この方法は、ライセンス情報をJSONファイルに出力し、カスタムページで表示するアプローチです。

#### 1. パッケージを追加
```sh
flutter pub add flutter_oss_licenses
```

#### 2. ライセンスデータを生成
```sh
flutter pub run flutter_oss_licenses:generate.dart
```

#### 3. カスタムページを作成
```dart
import 'package:flutter/material.dart';
import 'package:flutter_oss_licenses/flutter_oss_licenses.dart';

class OssLicensePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Open Source Licenses')),
      body: FutureBuilder<List<PackageLicense>>(
        future: FlutterOssLicenses.getLicenses(),
        builder: (context, snapshot) {
          if (!snapshot.hasData) return Center(child: CircularProgressIndicator());
          return ListView(
            children: snapshot.data!.map((license) {
              return ListTile(
                title: Text(license.name),
                subtitle: Text(license.license),
                onTap: () {
                  showDialog(
                    context: context,
                    builder: (context) => AlertDialog(
                      title: Text(license.name),
                      content: SingleChildScrollView(child: Text(license.license)),
                      actions: [
                        TextButton(onPressed: () => Navigator.pop(context), child: Text('OK'))
                      ],
                    ),
                  );
                },
              );
            }).toList(),
          );
        },
      ),
    );
  }
}
```

### どの方法を選ぶべきか？
- **シンプルに済ませたい** → `showLicensePage`
- **カスタマイズしたい** → `flutter_license_page`
- **手動でリストを管理したい** → `flutter_oss_licenses`

どの方法を採用するか決まったら、カスタマイズを進めていきましょう！

---
