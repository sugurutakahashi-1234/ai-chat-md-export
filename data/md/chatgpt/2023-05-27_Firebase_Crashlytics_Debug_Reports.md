# Firebase Crashlytics Debug Reports

日付: 2023-05-27

---

## 👤 ユーザー
*2023/5/27 20:34:35*

release版、degub版の両方でそれぞれFirebaseクラシュリティックスの報告を見る方法

---

## 🤖 アシスタント
*2023/5/27 20:35:20*

Firebase Crashlyticsは、デバッグビルドとリリースビルドの両方で動作しますが、デフォルトでは、リリースビルドのみがFirebaseに報告されます。デバッグビルドからのクラッシュレポートを送信するには、アプリをデバッグするときにFirebase Crashlyticsを有効にする設定を追加する必要があります。これは、AndroidやiOSの設定によります。

**Androidの場合**

1. `AndroidManifest.xml`に次の設定を追加します。

```xml
<meta-data
    android:name="firebase_crashlytics_collection_enabled"
    android:value="false" />
```

これにより、Firebase Crashlyticsの自動データ収集が無効化されます。

2. 次に、アプリをデバッグするときにFirebase Crashlyticsを手動で有効にします。

```java
if (BuildConfig.DEBUG) {
    FirebaseCrashlytics.getInstance().setCrashlyticsCollectionEnabled(true);
}
```

**iOSの場合**

1. `Info.plist`に次の設定を追加します。

```xml
<key>FirebaseCrashlyticsCollectionEnabled</key>
<string>false</string>
```

これにより、Firebase Crashlyticsの自動データ収集が無効化されます。

2. 次に、アプリをデバッグするときにFirebase Crashlyticsを手動で有効にします。

```swift
#if DEBUG
FirebaseCrashlytics.crashlytics().setCrashlyticsCollectionEnabled(true)
#endif
```

これらの設定により、リリース版とデバッグ版の両方でFirebase Crashlyticsが有効になります。

ただし、デバッグビルドとリリースビルドのエラーを区別するには、Firebase consoleで適切なフィルタリングを行う必要があります。特に、デバッグビルドとリリースビルドの違いを示すようなカスタムログをFirebase Crashlyticsに追加すると便利かもしれません。

**注意**：
デバッグビルドからのクラッシュレポートは、デバッグ目的にのみ使用するべきです。デバッグビルドは、アプリが本番環境で実際にどのように動作するかを反映していない可能性があるため、デバッグビルドからのデータをアプリのパフォーマンスを評価するために使用するべきではありません。

---
