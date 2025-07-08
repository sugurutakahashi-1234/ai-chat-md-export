# Flutter Googleマップ ピン留め

日付: 2024-12-12

---

## 👤 ユーザー
*2024/12/12 11:17:28*

flutterでGoogleマップを連携して地図を表示したい

そして外部ApIで取得した座標のListをピン留めしたい

リバーポッドアノテーションでノティファイアプロバイダーを作ってhooksとかもうまく利用してほしい

---

## 🤖 アシスタント
*2024/12/12 11:18:18*

以下は、FlutterでGoogleマップを利用して地図を表示し、外部APIから取得した座標のリストをピン留めする方法の実装例です。この例では、Riverpodのアノテーションを使って`NotifierProvider`を定義し、Flutter Hooksを活用してUIの管理を簡潔にしています。

### 必要なパッケージ
以下のパッケージを`pubspec.yaml`に追加してください。

```yaml
dependencies:
  flutter:
    sdk: flutter
  google_maps_flutter: ^2.2.0
  flutter_hooks: ^0.18.0
  riverpod_annotation: ^2.1.0
  riverpod: ^2.1.0

dev_dependencies:
  build_runner: ^2.3.0
  riverpod_generator: ^2.1.0
```

---

### APIレスポンス用モデル
外部APIから取得する座標リストのデータを扱うためのモデルを作成します。

```dart
class Coordinate {
  final double latitude;
  final double longitude;

  Coordinate({required this.latitude, required this.longitude});
}
```

---

### ノティファイアプロバイダー
ピンを管理するための`Notifier`を定義します。

```dart
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'coordinate.dart';

part 'map_pins_provider.g.dart';

@riverpod
class MapPins extends _$MapPins {
  @override
  List<Coordinate> build() {
    // 初期値は空リスト
    return [];
  }

  Future<void> fetchCoordinates() async {
    // 外部APIから座標データを取得
    final response = await Future.delayed(
      Duration(seconds: 1),
      () => [
        Coordinate(latitude: 35.6895, longitude: 139.6917), // 東京
        Coordinate(latitude: 34.6937, longitude: 135.5023), // 大阪
      ],
    );
    state = response;
  }
}
```

---

### 地図画面のUI
`HookConsumerWidget`を使って地図とピンを表示するウィジェットを作成します。

```dart
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'map_pins_provider.dart';

class MapScreen extends HookConsumerWidget {
  const MapScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final mapPins = ref.watch(mapPinsProvider);
    final mapPinsNotifier = ref.read(mapPinsProvider.notifier);

    // GoogleMapコントローラーのHook
    final googleMapController = useState<GoogleMapController?>(null);

    // 初期化時に座標を取得
    useEffect(() {
      mapPinsNotifier.fetchCoordinates();
      return null;
    }, []);

    // ピンのセット
    final markers = mapPins
        .map(
          (pin) => Marker(
            markerId: MarkerId('${pin.latitude},${pin.longitude}'),
            position: LatLng(pin.latitude, pin.longitude),
          ),
        )
        .toSet();

    return Scaffold(
      appBar: AppBar(
        title: Text('Googleマップ'),
      ),
      body: GoogleMap(
        initialCameraPosition: CameraPosition(
          target: LatLng(35.6895, 139.6917), // 初期位置：東京
          zoom: 10,
        ),
        markers: markers,
        onMapCreated: (controller) {
          googleMapController.value = controller;
        },
      ),
    );
  }
}
```

---

### アプリのエントリーポイント
`ProviderScope`でアプリ全体をラップします。

```dart
import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'map_screen.dart';

void main() {
  runApp(ProviderScope(child: MyApp()));
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: MapScreen(),
    );
  }
}
```

---

### 実行結果
1. Googleマップが表示されます。
2. 外部APIから取得した座標のピンが表示されます。
3. ピンをタップするとその場所の情報を表示可能です（カスタムで追加可能）。

### 補足
- Google Maps APIキーを`Android`や`iOS`のプロジェクト設定に追加してください。
- ピン留め以外にも`onTap`や`InfoWindow`を利用してよりリッチな機能を実装できます。

何か追加の要件があれば教えてください！

---

## 👤 ユーザー
*2024/12/12 12:35:24*

一旦、以下の実装で適当な緯度経度を設定しているが、現在地を表示するようにして欲しい

import 'package:flutter/material.dart';

// Package imports:
import 'package:hooks_riverpod/hooks_riverpod.dart';

// Project imports:
import 'package:flutter_sample_app/providers/current_user.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

class MapPage extends HookConsumerWidget {
  const MapPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currentUser = ref.watch(currentUserNotifierProvider);
    debugPrint(
        'Current user in MapPage: ${currentUser?.name}, ID: ${currentUser?.id}',);

    return const GoogleMap(initialCameraPosition: CameraPosition(
      target: LatLng(37.42796133580664, -122.085749655962),
      zoom: 14.4746,
    ),); 
  }
}

---

## 🤖 アシスタント
*2024/12/12 12:35:51*

以下のように、現在地を取得して表示する方法を実装します。`geolocator`パッケージを使用してデバイスの位置情報を取得し、Googleマップの初期位置を現在地に変更します。

---

### 必要なパッケージ
`pubspec.yaml`に以下を追加します。

```yaml
dependencies:
  geolocator: ^10.0.0
  google_maps_flutter: ^2.2.0
  hooks_riverpod: ^2.1.0
```

---

### 現在地の取得方法
位置情報の許可をリクエストし、現在地を取得するコードを追加します。

---

### 更新後のコード
以下のように`MapPage`を修正します。

```dart
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:geolocator/geolocator.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

class MapPage extends HookConsumerWidget {
  const MapPage({super.key});

  Future<LatLng> _getCurrentLocation() async {
    // 位置情報の許可をリクエスト
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      await Geolocator.openLocationSettings();
      throw Exception('位置情報サービスが無効です');
    }

    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        throw Exception('位置情報の権限が拒否されました');
      }
    }

    if (permission == LocationPermission.deniedForever) {
      throw Exception('位置情報の権限が永久に拒否されています');
    }

    // 現在地を取得
    Position position = await Geolocator.getCurrentPosition(
      desiredAccuracy: LocationAccuracy.high,
    );

    return LatLng(position.latitude, position.longitude);
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currentUser = ref.watch(currentUserNotifierProvider);
    debugPrint(
        'Current user in MapPage: ${currentUser?.name}, ID: ${currentUser?.id}',);

    return FutureBuilder<LatLng>(
      future: _getCurrentLocation(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          // ローディング中の表示
          return const Center(child: CircularProgressIndicator());
        } else if (snapshot.hasError) {
          // エラー時の表示
          return Center(
            child: Text('現在地を取得できませんでした: ${snapshot.error}'),
          );
        } else {
          final currentLocation = snapshot.data!;
          return GoogleMap(
            initialCameraPosition: CameraPosition(
              target: currentLocation,
              zoom: 14.4746,
            ),
            myLocationEnabled: true, // 現在地ボタンを有効にする
            myLocationButtonEnabled: true,
          );
        }
      },
    );
  }
}
```

---

### 主なポイント
1. **`_getCurrentLocation`メソッド**:
   - 位置情報のサービスや権限を確認し、現在地を取得します。
   - 必要に応じてユーザーに許可を求めます。

2. **`FutureBuilder`**:
   - 非同期で現在地を取得し、取得結果に応じてGoogleマップを表示します。
   - ローディング中、エラー時、成功時のそれぞれに対応。

3. **`myLocationEnabled`**:
   - 現在地をマップ上に表示します。

4. **`myLocationButtonEnabled`**:
   - 現在地ボタンを有効にします。

---

### 必要な設定
iOSとAndroidで位置情報を利用するための設定を追加する必要があります。

#### Android
`AndroidManifest.xml`に以下を追加します。

```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

#### iOS
`Info.plist`に以下を追加します。

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>位置情報を利用する理由を記述してください</string>
```

---

### 実行結果
- アプリ起動時に位置情報の許可を求められます。
- 許可後、現在地を中心にGoogleマップが表示されます。
- 現在地ボタンを押すと現在地に移動します。

何か追加の要望があればお知らせください！

---

## 👤 ユーザー
*2024/12/12 12:47:53*

FutureBuilder ではなく、Riverpodやhooksをうまく使って欲しい

---

## 🤖 アシスタント
*2024/12/12 12:48:19*

`FutureBuilder`を使わずに、RiverpodとFlutter Hooksを組み合わせた実装を提供します。この方法では、非同期処理をRiverpodの`AsyncNotifier`に委ね、UIロジックをシンプルに保ちます。

---

### 実装

以下は、現在地の取得にRiverpodとFlutter Hooksを利用した実装例です。

#### プロバイダーの定義
現在地を非同期で取得するために`AsyncNotifier`を使用します。

```dart
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:geolocator/geolocator.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

part 'current_location_provider.g.dart';

@riverpod
class CurrentLocation extends _$CurrentLocation {
  @override
  FutureOr<LatLng> build() async {
    return await _getCurrentLocation();
  }

  Future<LatLng> _getCurrentLocation() async {
    // 位置情報サービスの確認
    final serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      throw Exception('位置情報サービスが無効です');
    }

    // 位置情報権限の確認
    var permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        throw Exception('位置情報の権限が拒否されました');
      }
    }

    if (permission == LocationPermission.deniedForever) {
      throw Exception('位置情報の権限が永久に拒否されています');
    }

    // 現在地の取得
    final position = await Geolocator.getCurrentPosition(
      desiredAccuracy: LocationAccuracy.high,
    );

    return LatLng(position.latitude, position.longitude);
  }
}
```

---

#### `MapPage`の実装
RiverpodとFlutter Hooksを使って現在地を取得し、Googleマップを表示します。

```dart
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'current_location_provider.dart';

class MapPage extends HookConsumerWidget {
  const MapPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currentLocation = ref.watch(currentLocationProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Googleマップ'),
      ),
      body: currentLocation.when(
        data: (location) => GoogleMap(
          initialCameraPosition: CameraPosition(
            target: location,
            zoom: 14.4746,
          ),
          myLocationEnabled: true,
          myLocationButtonEnabled: true,
        ),
        loading: () => const Center(
          child: CircularProgressIndicator(),
        ),
        error: (err, stack) => Center(
          child: Text('エラー: $err'),
        ),
      ),
    );
  }
}
```

---

### 主なポイント

1. **`AsyncNotifier`**:
   - 非同期データ（現在地）を管理します。
   - 権限のリクエストやエラー処理をプロバイダー内にカプセル化。

2. **`ref.watch`**:
   - Riverpodのプロバイダーを購読し、現在の状態（ロード中、成功、エラー）に応じてUIを更新。

3. **`when`メソッド**:
   - `currentLocationProvider`の状態に応じたUIを簡潔に記述。

4. **ロジックとUIの分離**:
   - 非同期ロジックはRiverpodに移動し、UIは状態に応じた描画だけを担当。

---

### 必要な設定
- AndroidとiOSで位置情報の利用設定を行う必要があります。
- 前述の通り、`AndroidManifest.xml`と`Info.plist`に必要な権限を追加してください。

---

### 実行結果
- アプリ起動時に位置情報の許可を求められます。
- 許可後、現在地を中心にGoogleマップが表示されます。
- 状態管理にRiverpodを使用することで、コードがシンプルになります。

何か他にカスタマイズや追加の要望があれば教えてください！

---
