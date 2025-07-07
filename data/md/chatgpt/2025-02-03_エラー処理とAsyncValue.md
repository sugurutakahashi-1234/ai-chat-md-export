# エラー処理とAsyncValue

日付: 2025-02-03

---

## 👤 ユーザー
*2025/2/3 15:01:12*

これってエラー時に初期値nullにしたほうがいいかな？

  import 'dart:io';
import 'package:device\_info\_plus/device\_info\_plus.dart';
import 'package:flutter/foundation.dart';
import 'package:geolocator/geolocator.dart';
import 'package:google\_maps\_flutter/google\_maps\_flutter.dart';
import 'package:riverpod\_annotation/riverpod\_annotation.dart';
import 'package:snpit\_guild\_app/domain/flavor.dart';
import 'package:snpit\_guild\_app/presentation/providers/flavor\_provider.dart';

part 'current\_location.g.dart';

@riverpod
class CurrentLocationNotifier extends \_$CurrentLocationNotifier {
  @override
  Future&lt;LatLng&gt; build() async {
    return getCurrentLocation();
  }

  Future&lt;LatLng&gt; getCurrentLocation() async {
    final flavor = ref.watch(flavorProvider);

    final serviceEnabled = await Geolocator.isLocationServiceEnabled();

    if (!serviceEnabled) {
      await Geolocator.openLocationSettings();
      throw Exception('Location services are disabled');
    }

    var permission = await Geolocator.checkPermission();

    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        throw Exception('Location permissions are denied');
      }
    }

    if (permission == LocationPermission.deniedForever) {
      throw Exception('Location permissions are permanently denied');
    }

    LocationSettings locationSettings;
    if (Platform.isAndroid) {
      locationSettings = AndroidSettings();
    } else if (Platform.isIOS || Platform.isMacOS) {
      locationSettings = AppleSettings();
    } else {
      locationSettings = const LocationSettings();
    }

    final position = await Geolocator.getCurrentPosition(
      locationSettings: locationSettings,
    ).timeout(
      const Duration(seconds: 10),
      onTimeout: () {
        throw Exception('Getting current location timed out');
      },
    );

    if (position.isMocked) {
      switch (flavor) {
        case Flavor.prd:
          throw Exception('Location is mocked');
        case Flavor.stg:
        case Flavor.dev:
          final deviceInfo = DeviceInfoPlugin();
          if (Platform.isIOS) {
            final iosInfo = await deviceInfo.iosInfo;
            if (iosInfo.isPhysicalDevice) {
              throw Exception('Location is mocked');
            }
          } else if (Platform.isAndroid) {
            final androidInfo = await deviceInfo.androidInfo;
            if (androidInfo.isPhysicalDevice) {
              throw Exception('Location is mocked');
            }
          }
      }
    }

    final currentLocation = LatLng(position.latitude, position.longitude);
    debugPrint('Current Location: $currentLocation');
    state = AsyncValue.data(currentLocation);
    return currentLocation;
  }
}

---

## 🔧 ツール
*2025/2/3 15:01:29*

\*\*Evaluating error handling\*\*

I'm thinking through whether to set an initial value of null on error. The code uses Riverpod to fetch and store location data, potentially setting null on failure. The current setup throws an exception, raising the question of a more graceful failure.

\*\*Breaking down the options\*\*

I’m considering whether to return a null LatLng or handle errors in Riverpod using AsyncValue.error(...). Letting the error bubble up distinguishes between success and failure better.

\*\*Navigating best practices\*\*

Using AsyncValue with states, optionally adding a fallback, is optimal. Avoid returning null for LatLng to prevent errors or null pointer exceptions, as it might cause issues for users relying on valid data.

\*\*Evaluating approaches\*\*

I'm leaning towards letting errors bubble up for clarity, instead of setting the initial location to null or storing a fallback location.

\*\*Prioritizing error handling\*\*

I’m emphasizing managing errors via Riverpod's AsyncValue.error(...) over returning null to avoid widespread null checks and ensure clear, effective error handling.

---

## 🤖 アシスタント
*2025/2/3 15:01:29*

Riverpod の非同期処理の場合、基本的には「例外を投げて `AsyncValue.error` の形でエラーステートを持つ」アプローチが推奨です。  
なので「エラー時に `null` を返却してしまう」というよりは「エラーを投げた結果、Provider 側の `AsyncValue` が `error` ステートになる」方が望ましいです。

---

### なぜ `null` より `AsyncValue.error` が推奨されるのか

1. **状態管理フローがわかりやすい**  
   例外を投げると、Riverpod が自動的に「エラーが発生した状態 (`AsyncValue.error`)」を把握してくれます。UI 側で `when` や `maybeWhen` を使って、`loading / data / error` をハンドリングするのが容易になるため、ステート管理がシンプルにまとまります。

2. **“null” をハンドリングする必要がなくなる**  
   戻り値を `LatLng?` にしてしまうと、「`null` が返ってくるパターン」もUIコード側で考慮しなければなりません。結果的に if 文や早期 return が増えてしまいがちです。  
   しかし非同期エラーは「例外として明示的に扱う」ほうが、UI 側にとっても「エラーになった(=位置情報取得不可だった)」という状態を扱いやすくなります。  
   （また、`LatLng` は座標を表すドメインオブジェクトなので `null` が返ってくるのは不自然とも言えます。）

3. **Riverpod の `AsyncValue` を活かせる**  
   `AsyncValue` は `data / error / loading` の3つの状態を自然に取り扱える仕組みを持っています。  
   - データ取得待ち: `loading`
   - データ取得完了: `data(...)`
   - データ取得エラー: `error(...)`  
   こうした非同期の3状態をそのままUIに反映することで、状態管理が見通しよくなります。

---

### 実装パターン

もし「例外を投げるだけだと、そのまま UI がクラッシュしかねない」という心配がある場合は、以下のように Provider 側で `AsyncValue.error` を明示的にセットしてあげる方法があります。

```dart
Future<LatLng> getCurrentLocation() async {
  try {
    ...
    final currentLocation = LatLng(position.latitude, position.longitude);
    state = AsyncValue.data(currentLocation);
    return currentLocation;
  } catch (e, st) {
    // ここで AsyncValue.error をセットして state を更新
    state = AsyncValue.error(e, st);
    rethrow; // もしくは return fallbackLocation; 等でも可
  }
}
```

これで UI 側では

```dart
ref.watch(currentLocationNotifierProvider).when(
  data: (latLng) => ...,
  error: (err, st) => ..., 
  loading: () => ...
)
```

のように明示的に `error` ステートをハンドリングできます。

---

### まとめ

- **結論**: Riverpod では「エラー時に `null` を返す」より「throw して `AsyncValue.error` として扱う」ほうがベター  
- UI は `AsyncValue` の `error` ステートを見てエラーメッセージを表示する、再試行ボタンを出す、などのハンドリングを行う  
- どうしてもデフォルト座標を用意したいなら「例外をキャッチして、ログを出したうえでデフォルト座標を返す」などの実装でもOK(ただし運用方針による)

こうした流れで、「エラー時に `null` を返す」ではなく、「例外を投げて `AsyncValue.error` (エラー状態) で扱う」形にするのが一般的なやり方です。

---

## 👤 ユーザー
*2025/2/3 15:02:18*

じゃあうまくFuture&lt;LatLng&gt; getCurrentLocation() async { を修正してほしい

---

## 🔧 ツール
*2025/2/3 15:02:37*

\*\*Exception handling strategy\*\*

OK, let me see. This approach involves catching exceptions, updating the state to represent an error (like `AsyncValue.error`), and subsequently rethrowing the exception or returning a fallback value. It's a balanced approach to error management.

\*\*Enhancing location handling\*\*

Wrapping the location retrieval in a `try-catch` block to manage exceptions effectively. This ensures a more robust handling of errors, leading to improved overall functionality.

\*\*Polishing the process\*\*

Wrapping the location retrieval in a `try-catch` block smartly manages any exceptions, ensuring state updates to reflect errors or proceed with the current location, leading to a smoother experience.

---

## 🤖 アシスタント
*2025/2/3 15:02:37*

以下のように `try-catch` ブロックを挟み、エラー発生時に `AsyncValue.error` をセットした上で `rethrow` する例を示します。  
これにより、UI 側で `.when(error: ...)` を通じてエラー表示やリトライ操作を行えるようになります。

```dart
Future<LatLng> getCurrentLocation() async {
  try {
    final flavor = ref.watch(flavorProvider);

    final serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      await Geolocator.openLocationSettings();
      throw Exception('Location services are disabled');
    }

    var permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        throw Exception('Location permissions are denied');
      }
    }

    if (permission == LocationPermission.deniedForever) {
      throw Exception('Location permissions are permanently denied');
    }

    LocationSettings locationSettings;
    if (Platform.isAndroid) {
      locationSettings = AndroidSettings();
    } else if (Platform.isIOS || Platform.isMacOS) {
      locationSettings = AppleSettings();
    } else {
      locationSettings = const LocationSettings();
    }

    final position = await Geolocator.getCurrentPosition(
      locationSettings: locationSettings,
    ).timeout(
      const Duration(seconds: 10),
      onTimeout: () {
        throw Exception('Getting current location timed out');
      },
    );

    // Mock(偽装)かどうかチェック
    if (position.isMocked) {
      switch (flavor) {
        case Flavor.prd:
          throw Exception('Location is mocked');
        case Flavor.stg:
        case Flavor.dev:
          final deviceInfo = DeviceInfoPlugin();
          if (Platform.isIOS) {
            final iosInfo = await deviceInfo.iosInfo;
            if (iosInfo.isPhysicalDevice) {
              throw Exception('Location is mocked');
            }
          } else if (Platform.isAndroid) {
            final androidInfo = await deviceInfo.androidInfo;
            if (androidInfo.isPhysicalDevice) {
              throw Exception('Location is mocked');
            }
          }
      }
    }

    final currentLocation = LatLng(position.latitude, position.longitude);
    debugPrint('Current Location: $currentLocation');

    // 成功時は data ステートを更新
    state = AsyncValue.data(currentLocation);
    return currentLocation;

  } catch (e, st) {
    // エラーをキャッチしたら AsyncValue.error に更新した上で再度例外を投げる
    state = AsyncValue.error(e, st);
    rethrow;
  }
}
```

#### UI 側でのハンドリング

`AsyncValue` は `data / loading / error` の3つを簡単に扱えます。たとえば `currentLocationNotifierProvider` を watch して以下のように書くことができます。

```dart
final locationAsyncValue = ref.watch(currentLocationNotifierProvider);
return locationAsyncValue.when(
  data: (location) => Text('位置情報: $location'),
  loading: () => const CircularProgressIndicator(),
  error: (err, st) {
    return Column(
      children: [
        Text('エラーが発生しました: $err'),
        ElevatedButton(
          onPressed: () => ref.refresh(currentLocationNotifierProvider),
          child: const Text('リトライ'),
        ),
      ],
    );
  },
);
```

こうするとエラー時(`AsyncValue.error`)にはエラーメッセージと「リトライボタン」が表示され、ユーザーがもう一度押下することで `ref.refresh(...)` により再取得できます。

---

## 👤 ユーザー
*2025/2/3 15:03:28*

state = const AsyncValue.loading();入らないの？

---

## 🤖 アシスタント
*2025/2/3 15:04:14*

確かに、`state = const AsyncValue.loading();` を明示的にセットすることで、`getCurrentLocation()` の実行が開始されたタイミングで UI 側に「今ロード中である」ことを確実に伝えることができます。

しかし、Riverpod の `build` メソッド自体が `Future` を返す場合、最初は自動的に `AsyncValue.loading()` 状態になります。そのため、必ずしも `state = const AsyncValue.loading();` を手動でセットする必要はありませんが、明示的に設定することで `getCurrentLocation()` を直接呼び出した際にも `loading` を表示できるようになります。

---

### `state = const AsyncValue.loading();` を追加した実装
```dart
Future<LatLng> getCurrentLocation() async {
  try {
    // 明示的に loading 状態をセット
    state = const AsyncValue.loading();

    final flavor = ref.watch(flavorProvider);

    final serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      await Geolocator.openLocationSettings();
      throw Exception('Location services are disabled');
    }

    var permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        throw Exception('Location permissions are denied');
      }
    }

    if (permission == LocationPermission.deniedForever) {
      throw Exception('Location permissions are permanently denied');
    }

    LocationSettings locationSettings;
    if (Platform.isAndroid) {
      locationSettings = AndroidSettings();
    } else if (Platform.isIOS || Platform.isMacOS) {
      locationSettings = AppleSettings();
    } else {
      locationSettings = const LocationSettings();
    }

    final position = await Geolocator.getCurrentPosition(
      locationSettings: locationSettings,
    ).timeout(
      const Duration(seconds: 10),
      onTimeout: () {
        throw Exception('Getting current location timed out');
      },
    );

    // Mock(偽装)かどうかチェック
    if (position.isMocked) {
      switch (flavor) {
        case Flavor.prd:
          throw Exception('Location is mocked');
        case Flavor.stg:
        case Flavor.dev:
          final deviceInfo = DeviceInfoPlugin();
          if (Platform.isIOS) {
            final iosInfo = await deviceInfo.iosInfo;
            if (iosInfo.isPhysicalDevice) {
              throw Exception('Location is mocked');
            }
          } else if (Platform.isAndroid) {
            final androidInfo = await deviceInfo.androidInfo;
            if (androidInfo.isPhysicalDevice) {
              throw Exception('Location is mocked');
            }
          }
      }
    }

    final currentLocation = LatLng(position.latitude, position.longitude);
    debugPrint('Current Location: $currentLocation');

    // 成功時は data ステートを更新
    state = AsyncValue.data(currentLocation);
    return currentLocation;

  } catch (e, st) {
    // エラーをキャッチしたら AsyncValue.error に更新した上で再度例外を投げる
    state = AsyncValue.error(e, st);
    rethrow;
  }
}
```

---

### `state = const AsyncValue.loading();` を入れるべきケース

1. **`getCurrentLocation()` を `build()` 以外から直接呼ぶケースがある場合**  
   `build()` の初回実行時は `AsyncValue.loading()` が自動的に設定されますが、例えば UI から `getCurrentLocation()` を再実行する場合などに `loading` 状態が明示されず、前の `data` や `error` の状態が UI に残ってしまうことがあります。その場合、明示的に `loading` を設定することで UI の一貫性を保てます。

2. **複数回 `getCurrentLocation()` を呼び出す場合**  
   例えば、ユーザーが「現在地を更新」ボタンを押すたびに `getCurrentLocation()` を呼ぶようなケースでは、`loading` を明示的に設定しないと、「前の値が残ったままロードが始まっているのか分からない」状態になります。  

---

### `state = const AsyncValue.loading();` を入れなくても良いケース

1. **`build()` のみで `getCurrentLocation()` が実行される場合**  
   `build()` の実行開始時点で `AsyncValue.loading()` になるため、明示的に設定しなくても UI は `loading` 状態を表示できます。

2. **ユーザーが `error` 状態のままにしておきたいケース**  
   例えば、位置情報の取得に失敗した後、ボタンを押して再試行する場合に `error` を残したままにして、リトライ完了後にのみ `data` を更新するという設計にしたい場合は、`state = const AsyncValue.loading();` を入れない方が良いこともあります。

---

### **結論**
- **`state = const AsyncValue.loading();` を追加するのは、明示的に「再試行時の状態を UI に反映したい場合」に有効**  
- **ただし `build()` 内でしか呼ばれないなら、入れなくても `AsyncValue.loading()` が自動適用されるため不要**
- **複数回呼ぶ場合や `getCurrentLocation()` を UI から手動で呼ぶ場合には入れたほうが良い**

実際のアプリの挙動を考慮しながら、必要に応じて `loading` の明示設定を加えるのが良いですね！

---
