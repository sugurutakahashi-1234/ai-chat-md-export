# FutureOrとFutureの違い

日付: 2024-12-12

---

## 👤 ユーザー
*2024/12/12 13:14:45*

FutureOr と Future の違い

import 'package:geolocator/geolocator.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'current_location.g.dart';

@riverpod
class CurrentLocationNotifier extends _$CurrentLocationNotifier {
  @override
  FutureOr&lt;LatLng&gt; build() async {
    return await _getCurrentLocation();
  }

  Future&lt;LatLng&gt; _getCurrentLocation() async {
    final serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      await Geolocator.openLocationSettings();
      throw Exception('位置情報サービスが無効です');
    }

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

    final position = await Geolocator.getCurrentPosition(
      locationSettings: const LocationSettings(
        accuracy: LocationAccuracy.high,
      ),
    );

    return LatLng(position.latitude, position.longitude);
  }
}

---

## 🤖 アシスタント
*2024/12/12 13:15:05*

`FutureOr` と `Future` の違いを理解することは、Dart プログラミングで非同期処理を効果的に扱う上で重要です。

### **`Future` の基本**
- `Future` は非同期操作を表します。
- `Future` を返す関数は、将来値が利用可能になるか、エラーが発生するかを示します。
- `async` 修飾子を使用する関数は常に `Future` を返します。

```dart
Future<String> fetchData() async {
  return 'データ';
}
```

上記の例では、関数は常に非同期的に実行され、`Future<String>` を返します。

---

### **`FutureOr` の基本**
- `FutureOr<T>` は、**`T` か `Future<T>` のいずれか** を表します。
- つまり、戻り値が同期処理 (`T`) の結果でも、非同期処理 (`Future<T>`) の結果でも構いません。

例:
```dart
FutureOr<String> fetchData() {
  if (shouldFetchSynchronously) {
    return '同期データ'; // String
  } else {
    return Future.value('非同期データ'); // Future<String>
  }
}
```

`FutureOr` を使うことで、同期処理と非同期処理の両方を柔軟にサポートできます。

---

### **`FutureOr` を使用する理由**
- Riverpod の `build` メソッドは `FutureOr` を返すように設計されています。
  - 同期的に値をすぐに返す (`T`) 場合。
  - 非同期的に値を取得する (`Future<T>`) 場合。
- この柔軟性により、プロバイダーのデータを扱う際の効率性と使いやすさが向上します。

例:
```dart
@override
FutureOr<LatLng> build() async {
  return await _getCurrentLocation();
}
```

この場合、`build` メソッド内で `await` を使用して非同期処理を行っていますが、もし同期的に位置情報をすでに取得済みなら、すぐに値を返すことも可能です。

---

### **このコードにおける `FutureOr` の役割**
1. **`FutureOr` を使うことで柔軟性を確保**  
   現在のコードでは常に非同期 (`Future<LatLng>`) の操作が行われています。しかし、将来的に同期的なデータが利用可能になった場合にも対応できます。

2. **Riverpod の設計との整合性**  
   Riverpod の `@riverpod` アノテーションと `build` メソッドは `FutureOr` をサポートしており、プロバイダーの状態管理において効率的です。

---

### **まとめ**
- `Future` は常に非同期操作を表す。
- `FutureOr` は同期 (`T`) と非同期 (`Future<T>`) の両方を扱える。
- このコードでは `FutureOr` を使用していますが、現在は非同期 (`Future`) のみに依存しています。
- `FutureOr` を使う理由は、同期/非同期の両方をサポートする柔軟性を持たせるためです。

---
