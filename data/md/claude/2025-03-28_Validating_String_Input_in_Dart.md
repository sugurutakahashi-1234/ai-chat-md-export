# Validating String Input in Dart

日付: 2025-03-28

---

## 👤 ユーザー
*2025/3/28 15:32:09*

文字列のバリデーションに引っかかってエラーになっている。
どうすればいいか？

import 'dart:io';
import 'package:device\_info\_plus/device\_info\_plus.dart';
import 'package:dio/dio.dart';
import 'package:hooks\_riverpod/hooks\_riverpod.dart';
import 'package:package\_info\_plus/package\_info\_plus.dart';
import 'package:riverpod\_annotation/riverpod\_annotation.dart';
import 'package:snpit\_guild\_app/presentation/providers/api\_client/base\_uri\_provider.dart';
import 'package:snpit\_guild\_app/presentation/providers/secure\_storage/access\_token.dart';

part 'dio\_provider.g.dart';

@Riverpod(keepAlive: true)
Future&lt;Dio&gt; dio(Ref ref) async {
  final packageInfo = await PackageInfo.fromPlatform();
  final deviceInfoPlugin = DeviceInfoPlugin();

  String systemName;
  String systemVersion;
  String systemInfo;
  String modelName;

  if (Platform.isAndroid) {
    final androidInfo = await deviceInfoPlugin.androidInfo;
    systemName = 'Android';
    systemVersion = androidInfo.version.sdkInt.toString();
    modelName = androidInfo.name;
    systemInfo = androidInfo.toString();
  } else if (Platform.isIOS) {
    final iosInfo = await deviceInfoPlugin.iosInfo;
    systemName = 'iOS';
    systemVersion = iosInfo.systemVersion;
    modelName = iosInfo.modelName;
    systemInfo = iosInfo.toString();
  } else {
    // iOS / Android 以外の場合は必要に応じて分岐
    systemName = 'Unknown';
    systemVersion = 'Unknown';
    systemInfo = 'Unknown';
    modelName = 'Unknown';
  }

  final baseUri = await ref.watch(baseUriProvider.future);

  final dio = Dio(
    BaseOptions(
      baseUrl: baseUri.toString(),
      headers: {
        'Content-Type': 'application/json',
        'package\_name': packageInfo.packageName, // ae.zealnova.snpitguild
        'app\_version': packageInfo.version, // 0.0.1
        'build\_number': packageInfo.buildNumber, // 1
        'system\_name': systemName, // iOS or Android
        'system\_version': systemVersion, // 18.4 or 34
        'model\_name': modelName, // iPhone 16 Pro or Redmi 14C
        'system\_info': systemInfo, // 全情報
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
        options.headers\['access\_token'\] = accessToken;

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

  dio.interceptors.add(LogInterceptor(requestBody: true, responseBody: true));

  return dio;
}


https://github.com/dart-lang/sdk/issues/53914

---

## 🤖 アシスタント
*2025/3/28 15:32:20*

エラーの原因は、`systemInfo`に含まれる文字列が長すぎたり、特殊文字を含んでいることでHTTPヘッダー値として適切でないためだと思われます。GitHub Issueからも、Dartの`toString()`メソッドからの出力をそのままHTTPヘッダーに使用することで問題が発生しているようですね。

解決策としては、以下の方法があります：

1. `systemInfo`をヘッダーから完全に除外する
2. `systemInfo`の値を限定された安全な情報だけに制限する

コードを修正してみましょう：

```dart
// systemInfoを安全な形式に変換する方法
if (Platform.isAndroid) {
  final androidInfo = await deviceInfoPlugin.androidInfo;
  systemName = 'Android';
  systemVersion = androidInfo.version.sdkInt.toString();
  modelName = androidInfo.name;
  // 安全なフォーマットに制限
  systemInfo = 'Android ${androidInfo.version.sdkInt} ${androidInfo.name}';
} else if (Platform.isIOS) {
  final iosInfo = await deviceInfoPlugin.iosInfo;
  systemName = 'iOS';
  systemVersion = iosInfo.systemVersion;
  modelName = iosInfo.modelName;
  // 安全なフォーマットに制限
  systemInfo = 'iOS ${iosInfo.systemVersion} ${iosInfo.modelName}';
} else {
  // iOS / Android 以外の場合は必要に応じて分岐
  systemName = 'Unknown';
  systemVersion = 'Unknown';
  systemInfo = 'Unknown';
  modelName = 'Unknown';
}
```

もしくは、`system_info`ヘッダーを完全に削除する方法：

```dart
final dio = Dio(
  BaseOptions(
    baseUrl: baseUri.toString(),
    headers: {
      'Content-Type': 'application/json',
      'package_name': packageInfo.packageName,
      'app_version': packageInfo.version,
      'build_number': packageInfo.buildNumber,
      'system_name': systemName,
      'system_version': systemVersion,
      'model_name': modelName,
      // system_infoヘッダーを削除
    },
    connectTimeout: const Duration(seconds: 30),
    sendTimeout: const Duration(seconds: 30),
    receiveTimeout: const Duration(seconds: 30),
  ),
);
```

この問題は、`toString()`の出力がHTTPヘッダーの制約（特殊文字の制限や長さ制限）に適合しないために発生しています。HTTPヘッダーの値は基本的に単純なテキスト文字列であるべきで、複雑なオブジェクトの`toString()`出力をそのまま使用するのは避けた方が良いでしょう。

---

## 👤 ユーザー
*2025/3/28 15:33:07*

ひらながとか絵文字が入ってるといけないかもしれない。

---

## 🤖 アシスタント
*2025/3/28 15:33:15*

そうですね、HTTP ヘッダーの値には制限があり、ひらがなや絵文字などの非ASCII文字が問題を引き起こす可能性があります。HTTP ヘッダーは基本的に ASCII 文字セットに準拠することが求められますので、国際文字（非ASCII文字）を含める場合は適切なエンコードが必要です。

以下の対策が考えられます：

1. **Base64エンコードを使用する**：
```dart
import 'dart:convert';

// systemInfoをBase64エンコードしてヘッダーに設定
systemInfo = base64Encode(utf8.encode(androidInfo.toString()));
```

2. **安全な文字のみに制限する**：
```dart
// 英数字と基本記号のみに制限する関数
String sanitizeHeaderValue(String value) {
  // ASCII文字のみに制限し、長さも制限する
  return value.replaceAll(RegExp(r'[^\x20-\x7E]'), '')
      .substring(0, min(value.length, 1000));
}

// 使用例
systemInfo = sanitizeHeaderValue(androidInfo.toString());
```

3. **必要な情報のみを抽出して整形する**：
```dart
if (Platform.isAndroid) {
  final androidInfo = await deviceInfoPlugin.androidInfo;
  systemName = 'Android';
  systemVersion = androidInfo.version.sdkInt.toString();
  modelName = androidInfo.name;
  // 必要な情報だけを英数字で整形
  systemInfo = 'Android-${androidInfo.version.sdkInt}-${androidInfo.brand}-${androidInfo.model}';
}
```

`system_info`ヘッダーがどうしても必要なら、これらの方法で安全な値に変換することをお勧めします。APIサーバー側でその情報が必須でなければ、最も安全な選択肢はこのヘッダーを完全に削除することでしょう。

---

## 👤 ユーザー
*2025/3/28 15:33:50*

base64Encodeするとどうなるのか
たとえば abcdあいうえ123😄 とかはどうなるのか？

---

## 🤖 アシスタント
*2025/3/28 15:34:02*

Base64エンコードを行うと、任意のバイナリデータを ASCII 文字（A-Z, a-z, 0-9, +, /）のみで表現できるようになります。

具体的に `abcdあいうえ123😄` という文字列をBase64エンコードした場合の例を示します：
```
Analysis Tool outputs from the web feature preview aren’t yet supported on mobile.
```



例として `abcdあいうえ123😄` をBase64エンコードすると、`YWJjZOOBguOBhOOBhuOBiDEyM/CfmIQ=` という文字列になります。

このBase64エンコードの特徴は：

1. すべて ASCII 文字のみで構成されるため、HTTPヘッダーなどで安全に使用できます
2. エンコードすると元の文字列よりも長くなります（この例では元の14文字が32文字になっています）
3. `=` 記号がパディングとして末尾に付くことがあります
4. どんな文字（ひらがな、絵文字、特殊文字など）でもエンコードできます

Dartでは以下のようにBase64エンコードを行います：

```dart
import 'dart:convert';

// エンコード
String deviceInfoBase64 = base64Encode(utf8.encode(androidInfo.toString()));

// ヘッダーに設定
headers: {
  // ...他のヘッダー
  'system_info': deviceInfoBase64,
}
```

このようにすれば、どのような文字が含まれていても安全にHTTPヘッダーで送信できるようになります。ただし、サーバー側でもBase64デコードの処理が必要になることに注意してください。

---

## 👤 ユーザー
*2025/3/28 15:34:17*

もうすこし人間が読めるようにしたい。

---

## 🤖 アシスタント
*2025/3/28 15:34:29*

人間が読めるようにしつつも、HTTP ヘッダーとして安全に使えるようにするには、以下のような方法があります：

1. **危険な文字だけを置換する方法**：
   - 日本語や絵文字だけを除外し、英数字や基本的な記号は残す
   - スペースやタブなどの制御文字を安全な表現に置き換える

2. **JSON 形式でキー情報のみを抽出する方法**：
   - デバイス情報から必要なキー情報だけを抽出してJSON形式にする
   - 値を英数字に限定する

例えば、以下のようなコードでデバイス情報を人間が読める形式にしつつ、安全にヘッダーに含められます：

```dart
// 安全な文字のみを残す関数
String makeSafeForHeader(String input) {
  // ASCII印字可能文字(スペース~チルダ)のみを残す正規表現
  return input.replaceAll(RegExp(r'[^\x20-\x7E]'), '_')
      .substring(0, min(input.length, 200)); // 長さも制限
}

// Androidの例
if (Platform.isAndroid) {
  final androidInfo = await deviceInfoPlugin.androidInfo;
  // 重要な情報だけを抽出して整形
  final Map<String, String> safeInfo = {
    'brand': makeSafeForHeader(androidInfo.brand),
    'device': makeSafeForHeader(androidInfo.device),
    'model': makeSafeForHeader(androidInfo.model),
    'manufacturer': makeSafeForHeader(androidInfo.manufacturer),
    'sdk': androidInfo.version.sdkInt.toString(),
    'release': makeSafeForHeader(androidInfo.version.release),
  };
  
  // JSONに変換（コンパクトに）
  systemInfo = jsonEncode(safeInfo);
}
```

このようにすれば、ヘッダーには例えば次のように含まれます：
```
system_info: {"brand":"Google","device":"pixel","model":"Pixel 6","manufacturer":"Google","sdk":"33","release":"13"}
```

これなら人間が読めて、かつHTTPヘッダーとしても安全です。JSONエンコードすることで、構造化された情報を送れますし、サーバー側でも簡単にパースできます。

また、非ASCII文字を含む可能性がある値には `makeSafeForHeader` 関数を適用して安全な文字だけに置き換えています。

---

## 👤 ユーザー
*2025/3/28 15:35:59*

ASCII 文字であれば送れるのか？

---

## 🤖 アシスタント
*2025/3/28 15:36:07*

はい、基本的に HTTP ヘッダーは ASCII 文字であれば問題なく送信できます。特に以下の点に注意すると安全です：

1. ASCII の印字可能文字（0x20〜0x7E、つまりスペースから `~` までの文字）を使用する
2. 制御文字（0x00〜0x1F）は避ける
3. ヘッダー名と値の間を区切るコロン（:）は値の中に入れても問題ないが、特殊な意味を持つ文字（改行、キャリッジリターンなど）は避ける
4. ヘッダーの長さにも制限がある場合があるので、あまりに長い値は避ける（サーバーによって異なるが、数KB以内が安全）

つまり、以下のような処理を行えば安全です：

```dart
// ASCII印字可能文字（スペースから~まで）のみを残し、他は置換する
String sanitizeForHeader(String input) {
  if (input == null) return '';
  return input.replaceAll(RegExp(r'[^\x20-\x7E]'), '_')
      .substring(0, min(input.length, 1000));  // 長さも制限
}

// 使用例
systemInfo = sanitizeForHeader(androidInfo.toString());
```

これにより、非 ASCII 文字（日本語や絵文字など）は全て `_` に置き換えられ、HTTP ヘッダーとして安全に送信できるようになります。

ただし、サーバー側の実装によっては特定のヘッダーフォーマットを期待している場合もあるので、サーバー側の仕様に合わせることも重要です。

---

## 👤 ユーザー
*2025/3/28 15:37:52*

これをStringの拡張にできないか

String makeSafeForHeader(String input) {
  // ASCII印字可能文字(スペース~チルダ)のみを残す正規表現
  return input.replaceAll(RegExp(r'\[^\\x20-\\x7E\]'), '\_')
      .substring(0, min(input.length, 200));
}

---

## 🤖 アシスタント
*2025/3/28 15:38:04*

Dartでは拡張メソッドを使ってStringクラスに機能を追加できます。以下のように実装できます：
```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```



この拡張メソッドを使用するには、まずファイル（例えば `string_extensions.dart`）を作成して上記のコードを配置し、使いたい場所でインポートします：

```dart
import 'package:your_app/utils/string_extensions.dart';

// 使用例
if (Platform.isAndroid) {
  final androidInfo = await deviceInfoPlugin.androidInfo;
  systemName = 'Android';
  systemVersion = androidInfo.version.sdkInt.toString();
  modelName = androidInfo.name;
  // 拡張メソッドを使用
  systemInfo = androidInfo.toString().toSafeHeader();
}
```

あるいは、JSONデータを使う場合の例：

```dart
if (Platform.isAndroid) {
  final androidInfo = await deviceInfoPlugin.androidInfo;
  final Map<String, String> safeInfo = {
    'brand': androidInfo.brand.toSafeHeader(),
    'device': androidInfo.device.toSafeHeader(),
    'model': androidInfo.model.toSafeHeader(),
    'manufacturer': androidInfo.manufacturer.toSafeHeader(),
    'sdk': androidInfo.version.sdkInt.toString(),
    'release': androidInfo.version.release.toSafeHeader(),
  };
  
  systemInfo = jsonEncode(safeInfo);
}
```

これで任意の文字列に `.toSafeHeader()` メソッドを使って、HTTP ヘッダーとして安全な文字列に変換できます。オプションとして最大長も指定できます（例：`.toSafeHeader(500)`）。

---

## 👤 ユーザー
*2025/3/28 16:05:15*

ここの処理ってmodelName = androidInfo.name;ではないほうがいいかな？

  if (Platform.isAndroid) {
    final androidInfo = await deviceInfoPlugin.androidInfo;
    systemName = 'Android';
    systemVersion = androidInfo.version.sdkInt.toString();
    modelName = androidInfo.name;
  } else if (Platform.isIOS) {
    final iosInfo = await deviceInfoPlugin.iosInfo;
    systemName = 'iOS';
    systemVersion = iosInfo.systemVersion;
    modelName = iosInfo.modelName;
  } else {
    // iOS / Android 以外の場合は必要に応じて分岐
    systemName = 'Unknown';
    systemVersion = 'Unknown';
    modelName = 'Unknown';
  }

---

## 🤖 アシスタント
*2025/3/28 16:05:24*

Android デバイスの場合、確かに `androidInfo.name` よりも詳細な情報が含まれる他のプロパティを使うほうが適切かもしれません。Android の場合、デバイス名として一般的に使用されるのは `model` プロパティです。

修正案は以下の通りです：

```dart
if (Platform.isAndroid) {
  final androidInfo = await deviceInfoPlugin.androidInfo;
  systemName = 'Android';
  systemVersion = androidInfo.version.sdkInt.toString();
  modelName = androidInfo.model; // .name の代わりに .model を使用
} else if (Platform.isIOS) {
  final iosInfo = await deviceInfoPlugin.iosInfo;
  systemName = 'iOS';
  systemVersion = iosInfo.systemVersion;
  modelName = iosInfo.modelName;
} else {
  // iOS / Android 以外の場合は必要に応じて分岐
  systemName = 'Unknown';
  systemVersion = 'Unknown';
  modelName = 'Unknown';
}
```

Androidの `AndroidDeviceInfo` クラスでは、デバイスモデル名を表すのに `model` プロパティが一般的に使われます。これはメーカーが定義した実際のデバイスモデル名（例: "Pixel 6", "Galaxy S22"など）を返します。

`name` プロパティはあまり一般的ではなく、場合によっては期待通りの値を返さないことがあります。

また、より詳細な情報が必要であれば、以下のような情報も利用できます：
- `manufacturer`: デバイスメーカー（例: "Samsung", "Google"）
- `brand`: ブランド名
- `product`: 製品名

これらを組み合わせることで、より詳細なデバイス情報を取得できます。

---
