# Dart SDK version issue

日付: 2024-12-18

---

## 👤 ユーザー
*2024/12/18 14:13:12*

$ make build                        
fvm flutter pub run build\_runner build --delete-conflicting-outputs
Deprecated. Use `dart run` instead.
Resolving dependencies... 
The current Dart SDK version is 3.5.4.

Because snpit\_guild\_app depends on json\_serializable &gt;=6.9.1 which requires SDK version &gt;=3.6.0 &lt;4.0.0, version solving failed.
make: \*\*\* \[build\] Error 1

---

## 🤖 アシスタント
*2024/12/18 14:13:18*

The error message you're encountering indicates that the `json_serializable` package you're using requires a Dart SDK version that is higher than the one you have installed. Specifically, it requires Dart SDK version `>=3.6.0 <4.0.0`, but you have version `3.5.4`.

To resolve this, you have a few options:

### Option 1: Upgrade Dart SDK
Upgrade your Dart SDK to version 3.6.0 or higher, as required by the `json_serializable` package.

1. If you're using **FVM (Flutter Version Manager)**, run:
   ```bash
   fvm flutter upgrade
   ```

2. Alternatively, if you're not using FVM, you can update your Dart SDK by updating Flutter:
   ```bash
   flutter upgrade
   ```

After upgrading, you can check the Dart version:
```bash
dart --version
```

### Option 2: Downgrade `json_serializable` version
If you don't want to upgrade your Dart SDK, you can downgrade the `json_serializable` package to a version that is compatible with your current Dart SDK version.

In your `pubspec.yaml`, modify the `json_serializable` dependency to a lower version (for example, `6.9.0` or below). Then run:
```bash
flutter pub get
```

Let me know if you need more help with either option!

---
