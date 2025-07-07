# Securely storing encryption keys in Flutter apps

日付: 2025-03-17

---

## 👤 ユーザー
*2025/3/17 13:25:55*

flutterで書いているコードにセキュアな暗号文字列を文字列で持たせたい
これがバレる可能性はあるのか？
用途はAPiリクエスト時の位置情報を暗号化するために使う

---

## 🤖 アシスタント
*2025/3/17 13:26:05*

フラッターアプリで暗号文字列をコード内に直接持たせる場合、いくつかのセキュリティリスクがあります。

アプリ内に直接暗号文字列（暗号化キーなど）を保持する主なリスク：

1. アプリのリバースエンジニアリングによる露出
   - APKやiPAファイルは比較的簡単に解析できます
   - 特にAndroidでは、APKを展開して内部のコードやリソースを見ることが可能です

2. セキュリティ対策として検討できる方法：

- キーのオブスケーション（難読化）
  - 文字列を複数の部分に分割して保存
  - 実行時に組み立てる方法を使う

- キーのエンコーディング
  - Base64やその他のエンコード手法で隠す
  - ただし、これだけでは十分なセキュリティにならない

- ネイティブコードの活用
  - Dart FFIを使ってC/C++でキーを保持
  - これにより解析がやや困難になる

- サーバーサイドでの暗号化
  - 可能であれば、クライアント側で暗号化せず、サーバー側で行う
  - クライアントからは暗号化キーにアクセスできない構成が理想的

位置情報の暗号化という用途であれば、完全なセキュリティよりも「適度な保護」が目的であれば、アプリ内での暗号化も実用的な選択肢かもしれません。絶対的なセキュリティが必要な場合は、サーバーサイドでの処理をお勧めします。

なにか具体的な実装方法についてご質問があればお答えします。

---

## 👤 ユーザー
*2025/3/17 13:26:38*

リバースエンジニアリングはそんな簡単に可能なのか？

---

## 🤖 アシスタント
*2025/3/17 13:26:51*

リバースエンジニアリングの難易度についてですが、実際には想像されるよりも比較的容易な場合が多いです：

### モバイルアプリのリバースエンジニアリング状況

#### Androidの場合
- APKファイルは本質的に圧縮ファイルであり、解凍して中身を見ることが可能
- `jadx`や`apktool`などの無料ツールで、Javaやkotlinのコードを可読形式に逆コンパイル可能
- FlutterアプリのDartコードは`libapp.so`内にあるが、これも`flutter\_tools`などでデコンパイル可能
- 文字列はバイナリファイル内で比較的簡単に見つけられる

#### iOSの場合
- 脱獄済みデバイスがあれば、アプリのバイナリを抽出可能
- `Hopper`や`IDA Pro`などのツールでバイナリを解析
- Flutterアプリの場合も同様に解析可能

### 保護メカニズム

アプリに組み込まれた暗号文字列の保護難易度は以下の要素で変わります：

1. \*\*コードの難読化レベル\*\*
   - Flutterでは`flutter\_obfuscate`などのツールで難読化可能だがDartコードの完全な保護は難しい

2. \*\*使用している保護メカニズム\*\*
   - 単純な文字列としてハードコードされている場合は非常に見つけやすい
   - バイナリレベルでの操作やエンコーディングを組み合わせると難度は上がる

3. \*\*攻撃者のスキルと目的\*\*
   - 興味本位のアマチュアと、目的を持ったプロフェッショナルでは成功率が大きく異なる
   - 高価値なアプリほど高度な攻撃の標的になりやすい

一般的なアプリなら基本的な難読化と分割保存でも十分な場合もありますが、金融アプリやセキュリティの高いアプリでは、クライアント側に機密情報を保存すること自体がリスクと考えられています。そのため、可能であればサーバー側で処理することが推奨されます。

---

## 👤 ユーザー
*2025/3/17 13:28:52*

位置情報を使うゲームで位置情報のリクエストを改ざんしてリクエストされないようにする仕組みを考えたい

---

## 🤖 アシスタント
*2025/3/17 13:29:07*

位置情報ゲームでの不正リクエスト防止の仕組みについて、効果的な方法をいくつかご紹介します。

## 位置情報の保護と不正防止のアプローチ

### 1. 署名ベースの検証
```
クライアント側：
- 位置情報 + タイムスタンプ + ユーザーID + 秘密鍵でHMACを生成
- サーバーに位置情報、タイムスタンプ、ユーザーID、署名を送信

サーバー側：
- 同じ秘密鍵を使って署名を再計算
- クライアントからの署名と比較して検証
```

### 2. デバイス情報の活用
```
- 位置情報リクエストにデバイスの固有識別子を含める
- センサー情報（加速度計、ジャイロスコープ）も検証データとして活用
- 不自然な移動パターンを検出する仕組みを実装
```

### 3. サーバーサイドでの検証ロジック
```
- 前回の位置との距離と経過時間から物理的に移動可能かを検証
- 位置情報の精度（accuracy）も検証（精度が極端に低い場合は不審）
- IPアドレスと位置情報の整合性チェック（大まかな地域レベル）
```

### 4. 多層的なセキュリティ
```
- SSL証明書ピンニングでMITM攻撃を防止
- APIリクエストに有効期限（短時間）を設ける
- サーバー側で位置履歴の異常検知アルゴリズムを実装
```

### 5. 実装のポイント

```dart
// クライアント側での署名生成例（Flutter）
import 'package:crypto/crypto.dart';
import 'dart:convert';

String generateLocationSignature(double lat, double lng, String userId) {
  final timestamp = DateTime.now().millisecondsSinceEpoch.toString();
  // 秘密鍵は複数の部分に分割して保存し、実行時に組み立てる
  final key1 = "pa"; final key2 = "rt1"; final key3 = "ofk"; final key4 = "ey";
  final secretKey = key1 + key2 + key3 + key4;
  
  final dataToSign = "$lat,$lng,$timestamp,$userId";
  final hmacSha256 = Hmac(sha256, utf8.encode(secretKey));
  final signature = hmacSha256.convert(utf8.encode(dataToSign)).toString();
  
  return {
    'lat': lat,
    'lng': lng,
    'timestamp': timestamp,
    'userId': userId,
    'signature': signature
  };
}
```

位置情報の不正を完全に防ぐことは難しいですが、これらの対策を組み合わせることで、一般的な不正手法に対する耐性を高めることができます。サーバー側での検証が特に重要で、クライアント側のコードはどんなに保護しても最終的には解析される可能性があることを前提に設計するのが良いでしょう。

---

## 👤 ユーザー
*2025/3/17 13:32:10*

この文字列の組み立て方法がリバースエンジニアリングでバレてしまうリスクはどれぐらいあるのか？

---

## 🤖 アシスタント
*2025/3/17 13:32:28*

この文字列の組み立て方法がリバースエンジニアリングで発見されるリスクは、かなり高いと考えるべきです。

### リスク評価

1. **コード内の分割文字列の発見**
   - Dartコードがデコンパイルされると、`key1 = "pa"`などの文字列定義は容易に見つかります
   - 変数名（key1, key2など）が連番になっていることで関連性が明白

2. **組み立てロジックの解析**
   - `key1 + key2 + key3 + key4`という組み立て部分も単純な文字列結合
   - デコンパイルされたコードでこのパターンは識別しやすい

3. **使用パターンからの推測**
   - secretKeyという変数名自体が用途を示唆している
   - HMAC生成に使われていることでその重要性が明らか

### 現実的なシナリオ

熟練したリバースエンジニアであれば、数時間から1日程度でこの手法を解析できる可能性が高いです。自動化ツールを使えば、アプリ内の全文字列を抽出して関連性を見つけることも容易です。

### より強固な手法の例

```dart
// より強固な秘密鍵の保護例
import 'package:crypto/crypto.dart';
import 'dart:convert';

String generateLocationSignature(double lat, double lng, String userId) {
  final timestamp = DateTime.now().millisecondsSinceEpoch.toString();
  
  // 文字列を直接記述せず、バイト配列やXOR操作で構築
  final keyParts = [
    [112 ^ 7, 97 ^ 13], // "pa" をXORでマスク
    [114 ^ 22, 116 ^ 9], // "rt" をXORでマスク
    [111 ^ 5, 102 ^ 17], // "of" をXORでマスク
    [107 ^ 31, 101 ^ 11], // "ke" をXORでマスク
    [121 ^ 41] // "y" をXORでマスク
  ];
  
  // 実行時に複合
  String assembleKey() {
    var result = "";
    for (var part in keyParts) {
      for (var masked in part) {
        // マスク解除の方法も複雑化（例：部分ごとに異なるXOR値）
        if (part == keyParts[0]) result += String.fromCharCode(masked ^ 7);
        else if (part == keyParts[1]) result += String.fromCharCode(masked ^ 22);
        else if (part == keyParts[2]) result += String.fromCharCode(masked ^ 5);
        else if (part == keyParts[3]) result += String.fromCharCode(masked ^ 31);
        else result += String.fromCharCode(masked ^ 41);
      }
    }
    return result;
  }
  
  // さらに追加のスクランブルを適用
  final secretKey = assembleKey().split('').reversed.join();
  
  // データ署名部分は同じ
  final dataToSign = "$lat,$lng,$timestamp,$userId";
  final hmacSha256 = Hmac(sha256, utf8.encode(secretKey));
  final signature = hmacSha256.convert(utf8.encode(dataToSign)).toString();
  
  return {
    'lat': lat,
    'lng': lng,
    'timestamp': timestamp,
    'userId': userId,
    'signature': signature
  };
}
```

この方法でもリバースエンジニアリングから完全に保護することはできませんが、解析の難易度と時間コストを大幅に上げることができます。それでも、最も安全なアプローチは依然としてサーバー側で主要な検証を行うことです。

---

## 👤 ユーザー
*2025/3/17 13:33:41*

リバースエンジニアリングってそんな簡単なのか？

---

## 🤖 アシスタント
*2025/3/17 13:33:55*

リバースエンジニアリングの実態についてお話しします：

実際のところ、モバイルアプリのリバースエンジニアリングは専門知識を持った人にとっては比較的容易な作業です。ただし、「簡単」の定義は対象者のスキルレベルによって大きく異なります。

### 現実的な観点から見たリバースエンジニアリング

#### 一般的な難易度
- \*\*初心者にとって\*\*: 難しい、特殊なツールと知識が必要
- \*\*中級者にとって\*\*: 基本的なことは数日の学習で可能
- \*\*上級者/セキュリティ専門家にとって\*\*: 日常的な作業

#### 具体的なプロセス（AndroidのFlutterアプリの場合）
1. APKファイルの入手（Google Playからダウンロード）
2. `apktool`でAPKを解凍（コマンド1つで可能）
3. `libapp.so`ファイルの特定（Flutterアプリの主要コード）
4. `flutter\_deobfuscate`などのツールでDartコードを読める形に復元
5. 文字列検索や関数解析（自動化ツールで効率化可能）

#### 実際の時間コスト
- アプリ解析の準備: 30分〜1時間
- 基本的な文字列や定数の検出: 数分〜数時間
- アルゴリズムの完全な理解: 数時間〜数日（複雑さによる）

#### 具体例
最近のモバイルゲームでは、リリース後数時間〜数日で改造版やチート方法が出回ることが珍しくありません。これは専門家がリバースエンジニアリングを効率的に行っている証拠です。

### リバースエンジニアリングへの対策

100%の保護は現実的ではありませんが、防御層を増やすことでコストを上げることは可能です：

1. \*\*コードの難読化\*\* - 変数名や制御フローを複雑化
2. \*\*ネイティブコード\*\* - 重要な処理をC/C++で実装
3. \*\*動的な値生成\*\* - 鍵を直接保存せず計算で生成
4. \*\*サーバー検証\*\* - クライアント側は信頼せず、常にサーバー側で検証

実用的な観点では「破られないようにする」より「破られるコストを上げる」「破られても影響を最小化する」設計が重要です。位置情報ゲームであれば、サーバー側での移動パターン分析や異常検知が効果的な対策になります。

---

## 👤 ユーザー
*2025/3/17 13:37:33*

リバースエンジニアリングされることを前提としてコスパ良く実装したい

---

## 🤖 アシスタント
*2025/3/17 13:38:00*

リバースエンジニアリングを前提としたコスパの良い実装アプローチを紹介します。時間対効果を重視した現実的な対策です。

## コスパ重視のセキュリティ実装

### 1. 多層防御の原則で実装する

```dart
// Flutter側の実装例
import 'package:crypto/crypto.dart';
import 'dart:convert';
import 'package:device_info_plus/device_info_plus.dart';

Future<Map<String, dynamic>> prepareLocationRequest(double lat, double lng) async {
  // 基本的なリクエストデータ
  final timestamp = DateTime.now().millisecondsSinceEpoch;
  final userId = await _getUserId(); // 保存済みのユーザーID
  
  // デバイス情報の取得（コスパ良く不正検知の材料を増やす）
  final deviceInfo = await DeviceInfoPlugin().androidInfo;
  final deviceId = deviceInfo.androidId;
  
  // 動的なソルト生成（時間ベース - 解析されてもすぐに使えない）
  final salt = _generateTimeSalt(timestamp);
  
  // 署名生成（単純だが効果的）
  final dataToSign = "$lat,$lng,$timestamp,$userId,$deviceId,$salt";
  final signature = sha256.convert(utf8.encode(dataToSign)).toString();
  
  return {
    'lat': lat,
    'lng': lng,
    'timestamp': timestamp,
    'user_id': userId,
    'device_id': deviceId,
    'signature': signature
  };
}

// 時間ベースのソルト生成（毎時変化する仕組み）
String _generateTimeSalt(int timestamp) {
  final hourTimestamp = timestamp ~/ 3600000 * 3600000; // 1時間単位に切り捨て
  return sha256.convert(utf8.encode('$hourTimestamp')).toString().substring(0, 10);
}
```

### 2. サーバー側での実装（ここが最重要）

```javascript
// Node.js でのサーバー側実装例
function validateLocationRequest(req, res) {
  const { lat, lng, timestamp, user_id, device_id, signature } = req.body;
  
  // 1. タイムスタンプの鮮度確認（5分以内のリクエストのみ受付）
  const currentTime = Date.now();
  if (currentTime - timestamp > 5 * 60 * 1000) {
    return res.status(400).json({ error: 'Request expired' });
  }
  
  // 2. ユーザーの前回位置との整合性チェック
  const lastLocation = getUserLastLocation(user_id);
  if (lastLocation && isImpossibleTravel(lastLocation, { lat, lng }, timestamp - lastLocation.timestamp)) {
    logSuspiciousActivity(user_id, 'impossible_travel');
    // 即座にブロックせず、不審行動ポイントを加算（コスパ良く）
    incrementSuspiciousPoints(user_id, 10);
  }
  
  // 3. デバイスIDの一貫性チェック
  const knownDevices = getUserKnownDevices(user_id);
  if (!knownDevices.includes(device_id)) {
    // 新しいデバイスからのアクセス - 記録して監視
    addNewDeviceForUser(user_id, device_id);
    incrementSuspiciousPoints(user_id, 5);
  }
  
  // 4. 署名の検証（簡易版）
  const salt = generateTimeSalt(timestamp);
  const expectedData = `${lat},${lng},${timestamp},${user_id},${device_id},${salt}`;
  const expectedSignature = crypto.createHash('sha256').update(expectedData).digest('hex');
  
  if (signature !== expectedSignature) {
    incrementSuspiciousPoints(user_id, 25);
    return res.status(403).json({ error: 'Invalid signature' });
  }
  
  // 不審ポイントが閾値を超えたら制限を適用
  if (getUserSuspiciousPoints(user_id) > 50) {
    applyRateLimit(user_id);
  }
  
  // 正常なリクエストとして処理続行
  updateUserLocation(user_id, { lat, lng, timestamp });
  return res.json({ success: true });
}

// 物理的に不可能な移動を検出
function isImpossibleTravel(lastPos, newPos, timeDiffMs) {
  const distanceKm = calculateDistance(lastPos.lat, lastPos.lng, newPos.lat, newPos.lng);
  const timeHours = timeDiffMs / (1000 * 60 * 60);
  const speedKmh = distanceKm / timeHours;
  
  // 人間の移動として異常な速度（例: 500km/h以上）
  return speedKmh > 500;
}
```

### 3. 実装のポイント（コスパの良い対策）

1. **複雑な暗号化より行動分析**
   - 位置情報の不正は通常パターンから検出できる
   - 過度な暗号化よりも行動パターンの分析が効果的

2. **疑わしい行動の蓄積型検出**
   - 一発で不正判定せず、不審ポイントを蓄積
   - 誤検知のリスクを下げつつ、継続的な不正を検出

3. **サーバー側でのビジネスロジック**
   - 重要な判定ロジックはすべてサーバー側に
   - クライアント側は最小限の処理だけに留める

4. **デバイス情報の活用**
   - 位置情報だけでなく、デバイス情報も検証
   - アカウント共有や不正ツール使用の検出に役立つ

5. **段階的な制限**
   - 即座にBANせず、まず行動制限を適用
   - 誤検知の場合も影響を最小化

このアプローチは、「完全な防御」ではなく「コスト対効果の高い検出と緩和」を目指しています。リバースエンジニアリングされても即座に悪用できない仕組みと、サーバー側での多層的な検証が鍵となります。

---

## 👤 ユーザー
*2025/3/17 14:27:50*

iOSはリバースエンジニアリングはあまりされないのか？

---

## 🤖 アシスタント
*2025/3/17 14:28:06*

iOSのリバースエンジニアリングはAndroidと比較して確かに難易度が高いですが、「されない」というわけではありません。実際には、価値のあるアプリであれば解析の対象になっています。

### iOSアプリのリバースエンジニアリングの現状

1. \*\*障壁の高さ\*\*
   - Appleのセキュリティモデルはより閉鎖的
   - アプリはコード署名があり、バイナリ形式で配布される
   - App Storeのレビュープロセスが比較的厳格

2. \*\*実際の解析方法\*\*
   - 脱獄デバイスを使用した解析
   - IDA Pro、Hopperなどの高度な逆アセンブラ
   - Frida、Cydia Substratなどのフックツール
   - 特にFlutterアプリは`.app`内の`App`バイナリやFrameworks内のファイルを解析

3. \*\*比較的安全な理由\*\*
   - Swiftコードは逆コンパイルが難しい（ただし不可能ではない）
   - バイナリレベルの解析が必要で専門知識を要する
   - デバイスの脱獄自体のハードルが高い

### 業界の実態

実際には、多くの人気ゲームやセキュリティ重視のアプリは、リリース後数日〜数週間以内にリバースエンジニアリングされています。特に：

- 課金システムを持つゲーム
- ユーザー認証メカニズムを持つアプリ
- 位置情報ベースのサービス

これらは高い価値を持つため、専門家によるリバースエンジニアリングの標的になりやすいです。

### 現実的な対応方針

iOSの方がAndroidよりもリバースエンジニアリングの難易度は高いですが、それに依存したセキュリティは危険です。適切なアプローチは：

1. \*\*クロスプラットフォームの一貫したセキュリティ\*\*
   - AndroidとiOSで同等のセキュリティ対策を実装
   - プラットフォーム間の差異に依存しない設計

2. \*\*サーバーサイド検証の重視\*\*
   - クライアント側の防御はあくまで第一層と考える
   - 重要な検証ロジックはすべてサーバー側に実装

3. \*\*脅威モデルの現実的な評価\*\*
   - アプリの価値と攻撃者の動機を考慮
   - 完全防御より、不正検知と影響の最小化を重視

結論として、iOS独自のセキュリティ上の利点はありますが、価値のあるアプリはプラットフォームに関わらずリバースエンジニアリングのリスクに備えるべきです。

---
