# iOS Android デバイス情報

日付: 2025-03-07

---

## 👤 ユーザー
*2025/03/07 17:05:07*

いかが正しくないコードである。
iOS や Android でなるべくそれらのOSやOSバージョン、そのデバイスを取得するようにしてほしい

 final systemName = deviceInfo.operatingSystem;
  final systemVersion = deviceInfo.version;
  final deviceName = deviceInfo.packageName;


import 'package:device_info_plus/device_info_plus.dart';
import 'package:dio/dio.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:package_info_plus/package_info_plus.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:snpit_guild_app/presentation/providers/access_token.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/base_uri_provider.dart';

part 'dio_provider.g.dart';

@Riverpod(keepAlive: true)
Future&lt;Dio&gt; dio(Ref ref) async {
  final packageInfo = await PackageInfo.fromPlatform();
  final deviceInfoPlugin = DeviceInfoPlugin();
  final deviceInfo = await deviceInfoPlugin.deviceInfo;
  final systemName = deviceInfo.operatingSystem;
  final systemVersion = deviceInfo.version;
  final deviceName = deviceInfo.packageName;

  final baseUri = await ref.watch(baseUriProvider.future);

  final dio = Dio(
    BaseOptions(
      baseUrl: baseUri.toString(),
      headers: {
        'Content-Type': 'application/json',
        'package_name': packageInfo.packageName, // ae.zealnova.snpitguild
        'app_version': packageInfo.version, // 0.0.1
        'build_number': packageInfo.buildNumber, // 1
        'system_name': systemName, // iOS, Android
        'system_version': systemVersion, // 18.4, 34
        'device_name': deviceName // iPhone 16 Pro, Redmi 14C
      },
      connectTimeout: const Duration(seconds: 30),
      sendTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
    ),
  );

  dio.interceptors.add(
    InterceptorsWrapper(
      onRequest: (options, handler) async {
        final accessToken = await ref.read(accessTokenNotifierProvider.future);

        if (accessToken != null) {
          options.headers['access_token'] = accessToken;
        }

        return handler.next(options);
      },
      onError: (e, handler) {
        return handler.next(e);
      },
      onResponse: (response, handler) {
        return handler.next(response);
      },
    ),
  );

  dio.interceptors.add(
    LogInterceptor(
      requestBody: true,
      responseBody: true,
    ),
  );

  return dio;
}

---

## 🔧 ツール
*2025/03/07 17:05:08*

### デバイス情報の取得に失敗している

デバイス名、OSバージョンが適切に取得できていない。iOSやAndroidのフィールド取得が正しくない。

### アプローチを模索中

AndroidとiOSではデバイス情報の取得方法が異なる。プラットフォームを判別し、各プラットフォームに合わせた情報取得方法を検討している段階だ。

### デバイス情報を取得して設定する

Platformの条件に応じてデバイス情報を取得し、systemName、systemVersion、deviceNameを設定している。その他のプラットフォームについては、iOSとAndroidに焦点を当てている。

---

## 🤖 アシスタント
*2025/03/07 17:05:08*

`device_info_plus` の `deviceInfo` から一括で `operatingSystem` や `version`、`packageName` を参照しようとしても、実は iOS / Android それぞれ取得先のプロパティが異なるため、正しく値が取れません。  
以下のように `Platform.isAndroid` / `Platform.isIOS` で分岐して、それぞれのデバイス情報を取得する必要があります。

```dart
import 'dart:io' show Platform;
import 'package:device_info_plus/device_info_plus.dart';
import 'package:dio/dio.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:package_info_plus/package_info_plus.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:snpit_guild_app/presentation/providers/access_token.dart';
import 'package:snpit_guild_app/presentation/providers/api_client/base_uri_provider.dart';

part 'dio_provider.g.dart';

@Riverpod(keepAlive: true)
Future<Dio> dio(Ref ref) async {
  final packageInfo = await PackageInfo.fromPlatform();
  final deviceInfoPlugin = DeviceInfoPlugin();

  // OS / OSバージョン / デバイス名を取得する
  String systemName = '';
  String systemVersion = '';
  String deviceName = '';

  if (Platform.isAndroid) {
    final androidInfo = await deviceInfoPlugin.androidInfo;
    systemName = 'Android';
    systemVersion = androidInfo.version.release ?? 'Unknown';
    deviceName = androidInfo.model ?? 'Unknown';
  } else if (Platform.isIOS) {
    final iosInfo = await deviceInfoPlugin.iosInfo;
    systemName = 'iOS';
    systemVersion = iosInfo.systemVersion ?? 'Unknown';
    deviceName = iosInfo.name ?? 'Unknown';
  } else {
    // iOS / Android 以外の場合は必要に応じて分岐
    systemName = 'Unknown';
    systemVersion = 'Unknown';
    deviceName = 'Unknown';
  }

  final baseUri = await ref.watch(baseUriProvider.future);

  final dio = Dio(
    BaseOptions(
      baseUrl: baseUri.toString(),
      headers: {
        'Content-Type': 'application/json',
        'package_name': packageInfo.packageName, // ae.zealnova.snpitguild
        'app_version': packageInfo.version,       // 0.0.1
        'build_number': packageInfo.buildNumber,  // 1
        'system_name': systemName,                // iOS, Android
        'system_version': systemVersion,          // 16.0, 13 など
        'device_name': deviceName,                // iPhone 12 Pro, Redmi 14C など
      },
      connectTimeout: const Duration(seconds: 30),
      sendTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
    ),
  );

  dio.interceptors.add(
    InterceptorsWrapper(
      onRequest: (options, handler) async {
        final accessToken = await ref.read(accessTokenNotifierProvider.future);

        if (accessToken != null) {
          options.headers['access_token'] = accessToken;
        }

        return handler.next(options);
      },
      onError: (e, handler) {
        return handler.next(e);
      },
      onResponse: (response, handler) {
        return handler.next(response);
      },
    ),
  );

  dio.interceptors.add(
    LogInterceptor(
      requestBody: true,
      responseBody: true,
    ),
  );

  return dio;
}
```

- **Android** では、`androidInfo.version.release` が Android の OS バージョンになります。  
- **iOS** では、`iosInfo.systemVersion` が iOS の OS バージョンになります。  
- **デバイス名** も Android / iOS で取得先が異なります。Android は `model`、iOS は `name` が一般的です。  
- `Platform.isAndroid` / `Platform.isIOS` で分岐する方法が推奨されます。

---
