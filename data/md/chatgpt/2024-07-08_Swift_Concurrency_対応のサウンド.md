# Swift Concurrency 対応のサウンド

日付: 2024-07-08

---

## 👤 ユーザー
*2024/7/8 12:08:13*

AudioServicesPlaySystemSoundWithCompletion を swift Concurrency 対応に

---

## 🤖 アシスタント
*2024/7/8 12:08:29*

`AudioServicesPlaySystemSoundWithCompletion` は、特定のシステムサウンドを再生した後にコールバックを実行するための関数です。これを Swift Concurrency に対応させるために、`async`/`await` を利用する方法を考えます。`async` 関数としてラップすることで、コールバックを `await` を使って待機できるようになります。

以下にその実装例を示します：

```swift
import AudioToolbox
import Foundation

func playSystemSoundWithCompletion(_ soundID: SystemSoundID) async {
    await withCheckedContinuation { continuation in
        AudioServicesPlaySystemSoundWithCompletion(soundID) {
            continuation.resume()
        }
    }
}
```

この関数を使用する方法は以下の通りです：

```swift
@MainActor
func playSound() async {
    let soundID: SystemSoundID = 1007 // 任意のサウンドIDを指定
    await playSystemSoundWithCompletion(soundID)
    // サウンド再生後に行いたい処理をここに記述
}
```

### 詳細説明
1. **`playSystemSoundWithCompletion` 関数の定義**
   - `withCheckedContinuation` を使用して、サウンド再生が完了するまでの非同期操作をラップしています。
   - サウンド再生が完了した際に、`continuation.resume()` を呼び出して continuation を再開します。

2. **サウンド再生の呼び出し**
   - `playSound` 関数内で、`await playSystemSoundWithCompletion(soundID)` を呼び出してサウンドの再生を待機します。
   - 再生が完了したら、その後の処理を実行します。

この方法を使うと、従来のコールバックを使用した方法よりも直感的に非同期処理を記述することができ、Swift Concurrency を活用したコードを書くことができます。

---

## 👤 ユーザー
*2024/7/8 12:09:00*

SystemSoundDriver という enum に static で定義してほしい

---

## 🤖 アシスタント
*2024/7/8 12:09:14*

`SystemSoundDriver` という enum に `AudioServicesPlaySystemSoundWithCompletion` を `static` メソッドとして定義する方法を以下に示します。

```swift
import AudioToolbox
import Foundation

enum SystemSoundDriver {
    static func playSystemSound(with soundID: SystemSoundID) async {
        await withCheckedContinuation { continuation in
            AudioServicesPlaySystemSoundWithCompletion(soundID) {
                continuation.resume()
            }
        }
    }
}

// 使用例
@MainActor
func playSound() async {
    let soundID: SystemSoundID = 1007 // 任意のサウンドIDを指定
    await SystemSoundDriver.playSystemSound(with: soundID)
    // サウンド再生後に行いたい処理をここに記述
}
```

### 詳細説明
1. **`SystemSoundDriver` Enum の定義**
   - `SystemSoundDriver` という enum を作成し、その中に `static` メソッドとして `playSystemSound` を定義します。
   - このメソッドは `withCheckedContinuation` を使用して、サウンド再生の完了を待機します。

2. **サウンド再生の呼び出し**
   - `@MainActor` 属性を持つ `playSound` 関数内で、`await SystemSoundDriver.playSystemSound(with: soundID)` を呼び出してサウンドの再生を待機します。
   - 再生が完了したら、その後の処理を実行します。

この方法により、`SystemSoundDriver` enum による一貫したインターフェースを提供しつつ、非同期処理を簡潔に行うことができます。

---

## 👤 ユーザー
*2024/7/8 12:09:30*

soundID: Int を引数にして欲しい

---

## 🤖 アシスタント
*2024/7/8 12:09:45*

`SystemSoundDriver` enum の `playSystemSound` メソッドを `soundID: Int` を引数に取るように変更し、内部で `SystemSoundID` 型に変換するようにします。以下にその実装を示します。

```swift
import AudioToolbox
import Foundation

enum SystemSoundDriver {
    static func playSystemSound(with soundID: Int) async {
        let systemSoundID = SystemSoundID(soundID)
        await withCheckedContinuation { continuation in
            AudioServicesPlaySystemSoundWithCompletion(systemSoundID) {
                continuation.resume()
            }
        }
    }
}

// 使用例
@MainActor
func playSound() async {
    let soundID = 1007 // 任意のサウンドIDを指定
    await SystemSoundDriver.playSystemSound(with: soundID)
    // サウンド再生後に行いたい処理をここに記述
}
```

### 詳細説明
1. **`SystemSoundDriver` Enum の定義**
   - `SystemSoundDriver` enum 内に `static func playSystemSound(with soundID: Int) async` メソッドを定義します。
   - このメソッドは `soundID` を `SystemSoundID` に変換し、非同期でサウンド再生を行います。
   - `withCheckedContinuation` を使用して、サウンド再生の完了を待機します。

2. **サウンド再生の呼び出し**
   - `@MainActor` 属性を持つ `playSound` 関数内で、`await SystemSoundDriver.playSystemSound(with: soundID)` を呼び出してサウンドの再生を待機します。
   - 再生が完了したら、その後の処理を実行します。

この変更により、`soundID` を `Int` 型として渡すことができ、シンプルなインターフェースを提供しながら、非同期処理を簡潔に行うことができます。

---

## 👤 ユーザー
*2024/7/8 12:10:38*

static func play(systemSoundType: SystemSoundType) に買えてほしい

public enum SystemSoundType: Int, CaseIterable {
    case newMail = 1000 // 新しいメールのサウンドID
    case mailReceived = 1001 // メールの受信サウンドID
    case mailSent = 1002 // メールの送信サウンドID
    case smsReceived = 1003 // SMSの受信サウンドID
    case smsSent = 1004 // SMSの送信サウンドID
    case calendarAlert = 1005 // カレンダーの通知サウンドID
    case reminderAlert = 1006 // リマインダーの通知サウンドID
    case mailSentAlt = 1007 // メール送信のサウンドID
    case messageSent = 1008 // メッセージ送信のサウンドID
    case voicemailAlert = 1010 // Voicemailの通知サウンドID
    case cameraShutter = 1100 // カメラシャッターのサウンドID
    case burstCameraShutter = 1101 // カメラシャッター（バースト）のサウンドID
    case screenshot = 1102 // スクリーンショットのサウンドID
    case startRecording = 1113 // 開始録音のサウンドID
    case stopRecording = 1114 // 停止録音のサウンドID
    case tableDrum = 1200 // テーブルのドラムサウンドID
    case phoneNumberComplete = 1201 // 電話番号入力の完了サウンドID
    case safariPageComplete = 1202 // サファリページ読み込み完了のサウンドID
    case lowPower = 1203 // 低バッテリーの警告サウンドID
    case safariPageFail = 1204 // サファリページ読み込み失敗のサウンドID
    case cameraZoom = 1205 // カメラのズームサウンドID
    case timerComplete = 1206 // タイマーの終了サウンドID
    case keyPressClick = 1207 // キー入力のクリックサウンドID
    case lock = 1300 // ロックのサウンドID
    case unlock = 1301 // ロック解除のサウンドID
    case batteryConnected = 1302 // バッテリー接続のサウンドID
    case chargingStarted = 1303 // 充電開始のサウンドID
    case chargingComplete = 1304 // 充電完了のサウンドID
    case shakeStart = 1400 // シェイク開始のサウンドID
    case shakeEnd = 1401 // シェイク終了のサウンドID
    case wifiConnected = 1402 // WiFi接続のサウンドID
    case wifiDisconnected = 1403 // WiFi切断のサウンドID
    case bluetoothConnected = 1404 // Bluetooth接続のサウンドID
    case bluetoothDisconnected = 1405 // Bluetooth切断のサウンドID
    case mailSent2 = 1500 // メール送信のサウンドID
    case mailReceived2 = 1501 // メール受信のサウンドID
    case messageSent2 = 1502 // メッセージ送信のサウンドID
    case messageReceived2 = 1503 // メッセージ受信のサウンドID
    case reminderAlert2 = 1504 // リマインダー通知のサウンドID
    case calendarAlert2 = 1505 // カレンダー通知のサウンドID
    case voicemailAlert2 = 1506 // Voicemail通知のサウンドID
    case airdropSent = 1507 // エアドロップ送信のサウンドID
    case airdropReceived = 1508 // エアドロップ受信のサウンドID
}

---

## 🤖 アシスタント
*2024/7/8 12:11:19*

`SystemSoundDriver` enum を更新し、`SystemSoundType` を引数に取る `play` メソッドを定義します。以下のコードはその実装例です：

```swift
import AudioToolbox
import Foundation

public enum SystemSoundType: Int, CaseIterable {
    case newMail = 1000 // 新しいメールのサウンドID
    case mailReceived = 1001 // メールの受信サウンドID
    case mailSent = 1002 // メールの送信サウンドID
    case smsReceived = 1003 // SMSの受信サウンドID
    case smsSent = 1004 // SMSの送信サウンドID
    case calendarAlert = 1005 // カレンダーの通知サウンドID
    case reminderAlert = 1006 // リマインダーの通知サウンドID
    case mailSentAlt = 1007 // メール送信のサウンドID
    case messageSent = 1008 // メッセージ送信のサウンドID
    case voicemailAlert = 1010 // Voicemailの通知サウンドID
    case cameraShutter = 1100 // カメラシャッターのサウンドID
    case burstCameraShutter = 1101 // カメラシャッター（バースト）のサウンドID
    case screenshot = 1102 // スクリーンショットのサウンドID
    case startRecording = 1113 // 開始録音のサウンドID
    case stopRecording = 1114 // 停止録音のサウンドID
    case tableDrum = 1200 // テーブルのドラムサウンドID
    case phoneNumberComplete = 1201 // 電話番号入力の完了サウンドID
    case safariPageComplete = 1202 // サファリページ読み込み完了のサウンドID
    case lowPower = 1203 // 低バッテリーの警告サウンドID
    case safariPageFail = 1204 // サファリページ読み込み失敗のサウンドID
    case cameraZoom = 1205 // カメラのズームサウンドID
    case timerComplete = 1206 // タイマーの終了サウンドID
    case keyPressClick = 1207 // キー入力のクリックサウンドID
    case lock = 1300 // ロックのサウンドID
    case unlock = 1301 // ロック解除のサウンドID
    case batteryConnected = 1302 // バッテリー接続のサウンドID
    case chargingStarted = 1303 // 充電開始のサウンドID
    case chargingComplete = 1304 // 充電完了のサウンドID
    case shakeStart = 1400 // シェイク開始のサウンドID
    case shakeEnd = 1401 // シェイク終了のサウンドID
    case wifiConnected = 1402 // WiFi接続のサウンドID
    case wifiDisconnected = 1403 // WiFi切断のサウンドID
    case bluetoothConnected = 1404 // Bluetooth接続のサウンドID
    case bluetoothDisconnected = 1405 // Bluetooth切断のサウンドID
    case mailSent2 = 1500 // メール送信のサウンドID
    case mailReceived2 = 1501 // メール受信のサウンドID
    case messageSent2 = 1502 // メッセージ送信のサウンドID
    case messageReceived2 = 1503 // メッセージ受信のサウンドID
    case reminderAlert2 = 1504 // リマインダー通知のサウンドID
    case calendarAlert2 = 1505 // カレンダー通知のサウンドID
    case voicemailAlert2 = 1506 // Voicemail通知のサウンドID
    case airdropSent = 1507 // エアドロップ送信のサウンドID
    case airdropReceived = 1508 // エアドロップ受信のサウンドID
}

enum SystemSoundDriver {
    static func play(systemSoundType: SystemSoundType) async {
        let systemSoundID = SystemSoundID(systemSoundType.rawValue)
        await withCheckedContinuation { continuation in
            AudioServicesPlaySystemSoundWithCompletion(systemSoundID) {
                continuation.resume()
            }
        }
    }
}

// 使用例
@MainActor
func playSound() async {
    await SystemSoundDriver.play(systemSoundType: .cameraShutter)
    // サウンド再生後に行いたい処理をここに記述
}
```

### 詳細説明
1. **`SystemSoundType` Enum の定義**
   - `SystemSoundType` enum にサウンドの種類ごとの ID を定義します。この enum は `Int` を基にしており、全てのケースがその ID を持っています。

2. **`SystemSoundDriver` Enum の定義**
   - `SystemSoundDriver` enum 内に `static func play(systemSoundType: SystemSoundType) async` メソッドを定義します。
   - このメソッドは `systemSoundType` を引数に取り、その `rawValue` を `SystemSoundID` に変換してサウンドを再生します。
   - 非同期処理を `withCheckedContinuation` を使って待機します。

3. **サウンド再生の呼び出し**
   - `@MainActor` 属性を持つ `playSound` 関数内で、`await SystemSoundDriver.play(systemSoundType: .cameraShutter)` を呼び出してサウンドの再生を待機します。
   - 再生が完了したら、その後の処理を実行します。

この実装により、簡潔かつ型安全にシステムサウンドを再生できるようになります。

---
