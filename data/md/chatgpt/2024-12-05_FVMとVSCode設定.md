# FVMとVSCode設定

Date: 2024-12-05

---

## 👤 User
*2024-12-05 17:41:44*

fvmをVScodeにて運用したい

---

## 🤖 Assistant
*2024-12-05 17:42:11*

VSCodeでFlutterをFVM (Flutter Version Management) を使用して運用する方法を簡単に説明します。

---

### 必要な準備

1. **FVMのインストール**
   ```bash
   dart pub global activate fvm
   ```
   ※ `dart` コマンドが認識されない場合は、Dart SDKをインストールし、環境変数を設定してください。

2. **FlutterのバージョンをFVMで管理**
   プロジェクトに必要なFlutterバージョンをインストールします:
   ```bash
   fvm install <flutter_version>
   ```

3. **プロジェクトにFlutterバージョンを指定**
   FVMでプロジェクトに特定のFlutterバージョンを使用する設定を行います:
   ```bash
   fvm use <flutter_version> --pin
   ```

   プロジェクトのルートに`.fvm`フォルダと`fvm_config.json`ファイルが生成されます。

---

### VSCodeの設定

1. **Flutter拡張機能をインストール**
   VSCodeのマーケットプレイスから公式のFlutter拡張機能をインストールします。

2. **`settings.json`の設定**
   プロジェクトごとにFVMを使用するための設定を行います。

   - VSCodeの設定ファイルを開く:
     - メニューの「ファイル」 &gt; 「設定」 &gt; 「設定」 &gt; 右上のアイコンから「settings.json」を編集。
   - 次の設定を追加:
     ```json
     {
       "dart.flutterSdkPath": ".fvm/flutter_sdk"
     }
     ```

3. **デバッグ設定**
   FVMで管理されたFlutterを使うため、`.fvm/flutter_sdk`を参照する必要があります。プロジェクトにある`launch.json`を編集し、以下のように設定します:
   ```json
   {
       "configurations": [
           {
               "name": "Flutter",
               "request": "launch",
               "type": "dart",
               "flutterMode": "debug",
               "program": "lib/main.dart",
               "cwd": "${workspaceFolder}"
           }
       ]
   }
   ```

---

### FVMの動作確認

VSCodeのターミナルで以下を実行して、FVMが正しく設定されているか確認します:
```bash
fvm flutter doctor
```

正常に出力されればセットアップ完了です！

---

### ヒント
- プロジェクトで複数のFlutterバージョンを使い分けたい場合、`fvm global <version>` を使うことでデフォルトのFlutterバージョンを設定できます。
- FVMで運用する場合は、チームメンバーも同じ設定を共有するため、`.fvm`フォルダをプロジェクトに含めると便利です。

これでVSCode上でFVMを活用してFlutter開発が進められます！

---
