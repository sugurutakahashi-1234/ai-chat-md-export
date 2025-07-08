# Java Gradle互換性エラー

日付: 2024-12-05

---

## 👤 ユーザー
*2024/12/5 15:58:10*

Flutter でビルドが失敗した。

Launching lib/main.dart on sdk gphone64 arm64 in debug mode...

FAILURE: Build failed with an exception.

* What went wrong:
Could not open cp_settings generic class cache for settings file '/Users/sugurutakahashi/git/gallusys/snpit_guild_app/android/settings.gradle' (/Users/sugurutakahashi/.gradle/caches/7.6.3/scripts/digrbcejqtzh2o323b6w8i67r).
&gt; BUG! exception in phase 'semantic analysis' in source unit '_BuildScript_' Unsupported class file major version 65

* Try:
&gt; Run with --stacktrace option to get the stack trace.
&gt; Run with --info or --debug option to get more log output.
&gt; Run with --scan to get full insights.

* Get more help at https://help.gradle.org

BUILD FAILED in 284ms

┌─ Flutter Fix ────────────────────────────────────────────────────────────────────────────────────┐
│ [!] Your project's Gradle version is incompatible with the Java version that Flutter is using    │
│ for Gradle.                                                                                      │
│                                                                                                  │
│ If you recently upgraded Android Studio, consult the migration guide at                          │
│ https://flutter.dev/to/to/java-gradle-incompatibility.                                           │
│                                                                                                  │
│ Otherwise, to fix this issue, first, check the Java version used by Flutter by running `flutter  │
│ doctor --verbose`.                                                                               │
│                                                                                                  │
│ Then, update the Gradle version specified in                                                     │
│ /Users/sugurutakahashi/git/gallusys/snpit_guild_app/android/gradle/wrapper/gradle-wrapper.proper │
│ ties to be compatible with that Java version. See the link below for more information on         │
│ compatible Java/Gradle versions:                                                                 │
│ https://docs.gradle.org/current/userguide/compatibility.html#java                                │
2
│                                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
Error: Gradle task assembleDebug failed with exit code 1

Exited (1).

---

## 🤖 アシスタント
*2024/12/5 15:58:22*

このエラーは、Gradle と Java のバージョンの互換性に問題があることが原因です。以下の手順で解決できます：

---

### 1. **Javaのバージョンを確認**
現在Flutterが使用しているJavaのバージョンを確認します。
```bash
flutter doctor --verbose
```
このコマンドの出力を確認し、使用中のJavaバージョンを探します。

- エラーには「Unsupported class file major version 65」とあり、Java 17が使用されている可能性が高いです。
- GradleがJava 17と互換性があるバージョンを必要とします。

---

### 2. **Gradleバージョンを確認**
プロジェクトの`gradle-wrapper.properties`を確認し、使用しているGradleのバージョンを確認します。

ファイルのパス:
```
/android/gradle/wrapper/gradle-wrapper.properties
```

例:
```properties
distributionUrl=https\://services.gradle.org/distributions/gradle-6.7-all.zip
```

GradleのバージョンがJava 17に対応しているか確認します。
- [Gradle公式のJava対応表](https://docs.gradle.org/current/userguide/compatibility.html#java) を参照してください。
- Java 17の場合、**Gradle 7.3以上**が必要です。

---

### 3. **Gradleをアップデート**
`gradle-wrapper.properties`の`distributionUrl`を変更して、対応するGradleのバージョンにアップデートします。

例: Gradle 7.6.3を使用する場合
```properties
distributionUrl=https\://services.gradle.org/distributions/gradle-7.6.3-all.zip
```

---

### 4. **プロジェクトのGradle設定を更新**
`android/build.gradle`で使用しているGradle Pluginのバージョンも確認します。この設定が古い場合、アップデートが必要です。

ファイル内の`com.android.tools.build:gradle`のバージョンを更新します。

例:
```gradle
dependencies {
    classpath 'com.android.tools.build:gradle:8.0.0'
}
```

[Gradle PluginとGradleの互換性表](https://developer.android.com/studio/releases/gradle-plugin?hl=ja#updating-gradle) を参照して、正しいバージョンを選択してください。

---

### 5. **Flutterキャッシュをクリア**
変更後、Flutterのキャッシュをクリアして再ビルドします。
```bash
flutter clean
flutter pub get
```

---

### 6. **再ビルド**
変更後、アプリを再ビルドします。
```bash
flutter run
```

---

### もし解決しない場合
- `flutter doctor -v` と `gradle-wrapper.properties` の内容を確認し、JavaとGradleのバージョンを再確認してください。
- 他の依存関係が問題を引き起こしている可能性もあるため、`android/build.gradle`での設定を確認してください。

---

## 👤 ユーザー
*2024/12/5 16:07:03*

こうであった

 $ flutter doctor -v
[✓] Flutter (Channel stable, 3.24.5, on macOS 15.2 24C5089c darwin-arm64, locale en-JP)
    • Flutter version 3.24.5 on channel stable at /Users/sugurutakahashi/development/flutter
    • Upstream repository https://github.com/flutter/flutter.git
    • Framework revision dec2ee5c1f (3 weeks ago), 2024-11-13 11:13:06 -0800
    • Engine revision a18df97ca5
    • Dart version 3.5.4
    • DevTools version 2.37.3

[✓] Android toolchain - develop for Android devices (Android SDK version 35.0.0)
    • Android SDK at /Users/sugurutakahashi/Library/Android/sdk
    • Platform android-35, build-tools 35.0.0
    • Java binary at: /Applications/Android Studio.app/Contents/jbr/Contents/Home/bin/java
    • Java version OpenJDK Runtime Environment (build 21.0.3+-79915917-b509.11)
    • All Android licenses accepted.

[✓] Xcode - develop for iOS and macOS (Xcode 16.2)
    • Xcode at /Applications/Xcode_16.2_beta_3.app/Contents/Developer
    • Build 16C5023f
    • CocoaPods version 1.16.2

[✓] Chrome - develop for the web
    • Chrome at /Applications/Google Chrome.app/Contents/MacOS/Google Chrome

[✓] Android Studio (version 2024.2)
    • Android Studio at /Applications/Android Studio.app/Contents
    • Flutter plugin can be installed from:
      🔨 https://plugins.jetbrains.com/plugin/9212-flutter
    • Dart plugin can be installed from:
      🔨 https://plugins.jetbrains.com/plugin/6351-dart
    • Java version OpenJDK Runtime Environment (build 21.0.3+-79915917-b509.11)

[✓] VS Code (version 1.95.3)
    • VS Code at /Applications/Visual Studio Code.app/Contents
    • Flutter extension version 3.102.0

[✓] Connected device (7 available)
    • sdk gphone64 arm64 (mobile)       • emulator-5554                        • android-arm64  • Android 14 (API 34) (emulator)
    • sdk gphone64 arm64 (mobile)       • emulator-5556                        • android-arm64  • Android 15 (API 35) (emulator)
    • SuguruTakahashi-iPhone16 (mobile) • 00008140-001C085E142B001C            • ios            • iOS 18.2 22C5142a
    • iPhone 16 (mobile)                • 45797DF9-7D24-451E-B3C9-06A4D259CCE4 • ios            • com.apple.CoreSimulator.SimRuntime.iOS-18-2 (simulator)
    • macOS (desktop)                   • macos                                • darwin-arm64   • macOS 15.2 24C5089c darwin-arm64
    • Mac Designed for iPad (desktop)   • mac-designed-for-ipad                • darwin         • macOS 15.2 24C5089c darwin-arm64
    • Chrome (web)                      • chrome                               • web-javascript • Google Chrome 131.0.6778.108
    ! Error: Browsing on the local area network for SuguruTakahashi-iPadPro12.9-2ndGen. Ensure the device is unlocked and attached with a cable or associated with the
      same local area network as this Mac.
      The device must be opted into Developer Mode to connect wirelessly. (code -27)

[✓] Network resources
    • All expected network resources are available.

• No issues found!

---

## 🤖 アシスタント
*2024/12/5 16:07:19*

Flutterの`doctor`の出力を見ると、問題はJavaのバージョン（**Java 21**）に関連しています。GradleはJava 21に完全対応していない可能性があります。

以下の手順で問題を解決してください：

---

### 1. **Javaのバージョンダウングレード**
GradleがサポートするJavaのバージョンに変更します。
- 推奨バージョンは **Java 17** です。
- macOSで複数のJavaバージョンを管理するには`jenv`が便利です。

**インストール手順：**
```bash
brew install jenv
```

Java 17をインストール：
```bash
brew install openjdk@17
```

`jenv`にJava 17を追加：
```bash
jenv add /usr/local/opt/openjdk@17
jenv global 17
```

正しいバージョンに切り替わったか確認：
```bash
java -version
```

---

### 2. **Gradleバージョンをアップデート**
プロジェクトの`gradle-wrapper.properties`でGradleバージョンを確認してください。

ファイルパス：
```
/android/gradle/wrapper/gradle-wrapper.properties
```

`distributionUrl`を以下のように修正します：
```properties
distributionUrl=https\://services.gradle.org/distributions/gradle-8.3-all.zip
```

Gradle 8.3はJava 21と互換性があるため、これで新しいJavaもサポート可能です。

---

### 3. **Flutterキャッシュをクリア**
以下のコマンドを実行してキャッシュをクリアします：
```bash
flutter clean
flutter pub get
```

---

### 4. **ビルドを再実行**
以下のコマンドでビルドを再試行します：
```bash
flutter run
```

---

### 注意点
- GradleとJavaの互換性について詳しくは、[Gradle公式サイトの互換性ガイド](https://docs.gradle.org/current/userguide/compatibility.html)を確認してください。
- Android Studioの設定でJavaのバージョンを変更する必要がある場合があります。`Preferences > Build, Execution, Deployment > Build Tools > Gradle`からJavaのパスを確認・修正してください。

上記の手順を実行しても解決しない場合は、再度エラーメッセージを確認し、詳細な対応をお伝えします！

---

## 👤 ユーザー
*2024/12/5 16:21:42*

JDK 17 or higher is required. Please set a valid Java home path to 'java.jdt.ls.java.home' setting or JAVA_HOME environment variable. Or ensure a valid Java executable is in your PATH.

---

## 🤖 アシスタント
*2024/12/5 16:22:12*

このエラーは、現在使用しているJavaバージョンが適切に設定されていない、または環境変数が正しく構成されていないことを示しています。以下の手順で解決してください：

---

### 1. **JDK 17以上をインストール**
既にインストールしている場合はスキップできますが、念のためJavaのバージョンを確認してください。

**Javaのバージョン確認:**
```bash
java -version
```

**Java 17のインストール (Homebrew):**
```bash
brew install openjdk@17
```

---

### 2. **JAVA_HOME環境変数を設定**
インストール後、環境変数`JAVA_HOME`が正しいJavaのパスを指していることを確認します。

**Javaのパスを確認:**
```bash
/usr/libexec/java_home -v 17
```

出力例:
```
/Library/Java/JavaVirtualMachines/openjdk-17.jdk/Contents/Home
```

**環境変数に設定 (zshの場合):**
```bash
echo 'export JAVA_HOME=$(/usr/libexec/java_home -v 17)' >> ~/.zshrc
echo 'export PATH=$JAVA_HOME/bin:$PATH' >> ~/.zshrc
source ~/.zshrc
```

**設定が適用されたか確認:**
```bash
echo $JAVA_HOME
java -version
```

---

### 3. **VS Codeでの設定**
VS Codeを使用している場合、適切なJavaパスを設定します。

**手順:**
1. VS Codeを開く。
2. 設定 (`Cmd + ,`) を開く。
3. 検索バーに`java.jdt.ls.java.home`を入力。
4. 設定に以下のパスを追加します（環境に合わせて調整してください）：
   ```json
   "java.jdt.ls.java.home": "/Library/Java/JavaVirtualMachines/openjdk-17.jdk/Contents/Home"
   ```

---

### 4. **Flutterプロジェクトでビルドの確認**
以下のコマンドを実行して再ビルドします:
```bash
flutter clean
flutter pub get
flutter run
```

---

### 5. **Android StudioのJava設定を確認**
Android Studioを使用している場合、`Preferences > Build, Execution, Deployment > Build Tools > Gradle`でJavaの設定を確認してください。`Gradle JDK`を`17`に設定します。

---

これで問題が解決しない場合は、エラーメッセージと現在の環境設定を再度確認しますので、結果を教えてください！

---
