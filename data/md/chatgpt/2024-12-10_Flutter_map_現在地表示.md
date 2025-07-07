# Flutter_map 現在地表示

日付: 2024-12-10

---

## 👤 ユーザー
*2024/12/10 12:34:39*

flutter\_map でマップと現在を表示したい。なるべく最新の情報で実装してほしい

---

## 🤖 アシスタント
*2024/12/10 12:34:58*

`flutter_map`パッケージは、Flutterアプリケーションで地図を表示するための強力なツールです。しかし、デフォルトではユーザーの現在地を表示する機能が含まれていません。そのため、現在地の取得には別途位置情報パッケージを組み合わせる必要があります。以下に、`flutter_map`と`geolocator`パッケージを使用して、地図上にユーザーの現在地を表示する方法を解説します。

**1. 必要なパッケージのインストール**

まず、`flutter_map`、`geolocator`、および`latlong2`パッケージをプロジェクトに追加します。

```yaml
dependencies:
  flutter:
    sdk: flutter
  flutter_map: ^4.0.0
  geolocator: ^10.0.0
  latlong2: ^0.8.1
```

その後、以下のコマンドを実行してパッケージをインストールします。

```bash
flutter pub get
```

**2. プラットフォームごとの設定**

位置情報を取得するためには、各プラットフォームでの設定が必要です。

- **iOSの場合**:
  `Info.plist`ファイルに以下のキーと説明文を追加します。

  ```xml
  <key>NSLocationWhenInUseUsageDescription</key>
  <string>このアプリは位置情報を使用します。</string>
  ```

- **Androidの場合**:
  `AndroidManifest.xml`ファイルに以下のパーミッションを追加します。

  ```xml
  <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
  ```

**3. コードの実装**

以下に、`flutter_map`と`geolocator`を組み合わせて現在地を表示するサンプルコードを示します。

```dart
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:geolocator/geolocator.dart';
import 'package:latlong2/latlong.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      home: MapScreen(),
    );
  }
}

class MapScreen extends StatefulWidget {
  const MapScreen({super.key});

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  LatLng? _currentPosition;
  final MapController _mapController = MapController();

  @override
  void initState() {
    super.initState();
    _determinePosition();
  }

  Future<void> _determinePosition() async {
    bool serviceEnabled;
    LocationPermission permission;

    // 位置情報サービスが有効か確認
    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      // サービスが無効の場合、エラーメッセージを表示
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('位置情報サービスが無効です。')),
      );
      return;
    }

    // 位置情報の権限を確認
    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        // 権限が拒否された場合、エラーメッセージを表示
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('位置情報の権限が拒否されました。')),
        );
        return;
      }
    }

    if (permission == LocationPermission.deniedForever) {
      // 永久に拒否された場合、エラーメッセージを表示
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('位置情報の権限が永久に拒否されています。')),
      );
      return;
    }

    // 現在地を取得
    Position position = await Geolocator.getCurrentPosition();
    setState(() {
      _currentPosition = LatLng(position.latitude, position.longitude);
      // 地図の中心を現在地に移動
      _mapController.move(_currentPosition!, 15.0);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('現在地表示マップ'),
      ),
      body: FlutterMap(
        mapController: _mapController,
        options: MapOptions(
          center: LatLng(35.681, 139.767), // 初期表示は東京駅
          zoom: 14.0,
        ),
        children: [
          TileLayer(
            urlTemplate: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            subdomains: ['a', 'b', 'c'],
          ),
          if (_currentPosition != null)
            MarkerLayer(
              markers: [
                Marker(
                  width: 80.0,
                  height: 80.0,
                  point: _currentPosition!,
                  builder: (ctx) => const Icon(
                    Icons.location_on,
                    color: Colors.red,
                    size: 40.0,
                  ),
                ),
              ],
            ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _determinePosition,
        child: const Icon(Icons.my_location),
      ),
    );
  }
}
```

**4. 補足情報**

`flutter_map`には現在地表示の機能がデフォルトで含まれていないため、`geolocator`などの位置情報パッケージと組み合わせて実装する必要があります。 citeturn0search0

また、`flutter_map`を使用する際、地図のタイルプロバイダとしてOpenStreetMapなどの無料サービスを利用できますが、商用利用や高トラフィックの場合は利用規約を確認し、必要に応じて適切なライセンスを取得してください。

上記の手順に従うことで、`flutter_map`と`geolocator`を組み合わせて、ユーザーの現在地を地図上に表示するFlutterアプリを構築できます。

---

## 👤 ユーザー
*2024/12/10 12:35:15*

現在地はいらないかな。もっとシンプルに実装してほしい

---

## 🤖 アシスタント
*2024/12/10 12:35:23*

`flutter_map`パッケージを使用すると、Flutterアプリケーション内で簡単に地図を表示できます。以下に、シンプルな地図表示の実装方法を説明します。

**1. パッケージのインストール**

`flutter_map`と`latlong2`パッケージをプロジェクトに追加します。

```yaml
dependencies:
  flutter:
    sdk: flutter
  flutter_map: ^4.0.0
  latlong2: ^0.8.1
```

その後、以下のコマンドを実行してパッケージをインストールします。

```bash
flutter pub get
```

**2. 地図表示の実装**

以下のコードは、`flutter_map`を使用してシンプルに地図を表示する例です。

```dart
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      home: MapScreen(),
    );
  }
}

class MapScreen extends StatelessWidget {
  const MapScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('シンプルな地図表示'),
      ),
      body: FlutterMap(
        options: MapOptions(
          center: LatLng(35.681, 139.767), // 東京駅の緯度経度
          zoom: 14.0,
        ),
        children: [
          TileLayer(
            urlTemplate: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            subdomains: ['a', 'b', 'c'],
          ),
        ],
      ),
    );
  }
}
```

**3. 補足情報**

`flutter_map`は、OpenStreetMapなどのタイルサーバーを利用して地図を表示します。上記の例では、OpenStreetMapのタイルを使用しています。商用利用や高トラフィックの場合は、利用規約を確認し、必要に応じて適切なライセンスを取得してください。

このコードにより、東京駅を中心としたシンプルな地図が表示されます。`flutter_map`はカスタマイズ性が高いため、マーカーの追加や地図の操作性の向上など、さまざまな機能を実装できます。

---
