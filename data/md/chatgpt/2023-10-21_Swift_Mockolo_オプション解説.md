# Swift Mockolo オプション解説

日付: 2023-10-21

---

## 👤 ユーザー
*2023/10/21 12:23:06*

SwiftのMockoloを使おうと思う。以下のようなコマンドなんだけど、オプションをもっといっぱい指定したい。指定できるオプションについて解説して欲しい。

mockolo -s ./ -d ./EmomilPackage/Sources/EmomilCore/Domain/Protocol/Mock/Mockolo.swift -x Images Strings --mock-final

---

## 🤖 アシスタント
*2023/10/21 12:23:34*

Mockoloは、Swiftのプロジェクトでモックオブジェクトのコード生成を自動化するためのツールです。コマンドラインからさまざまなオプションを使用して、カスタマイズされたモックの生成を制御できます。あなたが提示したコマンドにはいくつかの基本的なオプションが含まれていますが、Mockoloは他にも多くのオプションを提供しています。

以下は、Mockoloを使用する際に利用可能な主なオプションの解説です：

1. `-s` または `--srcs`: スキャンするソースファイルまたはディレクトリのパス。複数指定可能です。

2. `-d` または `--dest`: モック出力ファイルのパス。

3. `-x` または `--exclude`: モック生成から除外する型の名前。これは、モックを生成したくない特定のクラスやプロトコルに便利です。

4. `--mock-final`: finalクラスのモックを生成するかどうかを指定します。

5. `--testable-imports`: モックファイルの先頭に追加する`@testable import`のフレームワーク名。テストターゲットのモジュール名が異なる場合に有用です。

6. `--import`: モックファイルの先頭に追加する通常の`import`ステートメント。

7. `--annotation`: モックを生成するためのカスタムアノテーション名。デフォルトは`mockable`です。

8. `--macro`: コンパイル時に解決する必要がある追加の条件付きコンパイルマクロ。

9. `--exclude-suffixes`: モック生成から除外するファイル名のサフィックス。

10. `--exclude-protocols`: モック生成から除外するプロトコル名。デフォルトは空です。

11. `--exclude-classes`: モック生成から除外するクラス名。デフォルトは空です。

12. `--template`: モックの生成に使用するカスタムテンプレートファイルへのパス。

13. `--header`: 出力ファイルの先頭に追加するカスタムヘッダー。

14. `--retain-objc-annotated`: `@objc`アノテーションが付いているメソッド/プロパティをモックで保持するかどうか。

これらのオプションを適切に使用することで、あなたのニーズに合わせてモックの生成をより細かくコントロールできます。それぞれのプロジェクトの要件に応じて、これらのオプションを組み合わせて使用してください。

---

## 👤 ユーザー
*2023/10/21 12:24:31*

importで依存にないものを生成したりするので、こちら側で指定したい。また、--template で指定できるテンプレートが気になる

---

## 🤖 アシスタント
*2023/10/21 12:24:55*

Mockoloでは、`--import`オプションを使用して、生成されたモックファイルの先頭に特定のimportステートメントを追加できます。これは、プロジェクトの依存関係や特定のフレームワークに基づいてカスタマイズされる必要がある場合に便利です。

例えば、特定のモジュールやフレームワークをimportする必要がある場合、次のようにコマンドを使用します：

```bash
mockolo --import "SomeFramework" --import "AnotherModule" -s ./ -d ./OutputPath/Mockolo.swift
```

このコマンドは、"SomeFramework"と"AnotherModule"の2つのimportステートメントを生成されたモックファイルの先頭に追加します。

`--template`オプションについては、Mockoloが生成するモックのコード構造をカスタマイズするためのテンプレートファイルのパスを指定します。これにより、モックの生成プロセスをより細かく制御し、プロジェクトの特定のスタイルや要件に合わせてモックをカスタマイズできます。

テンプレートは、特定のプレースホルダーを使用して、必要なコード構造を定義する独自のテンプレート言語を使用します。これらのプレースホルダーは、生成プロセス中に対応する値やコードスニペットに置き換えられます。

テンプレートファイルを作成する際には、Mockoloのドキュメントや既存のテンプレートを参考に、利用可能なプレースホルダーとその使用方法を確認してください。テンプレート言語の構文やプレースホルダーの詳細については、Mockoloの公式ドキュメントやGitHubのリポジトリを参照してください。それらは具体的な例や詳細な説明を提供している場合が多いです。

---

## 👤 ユーザー
*2023/10/21 12:34:23*

以下らしい。解説して欲しい。

./mockolo -h  // or --help

OVERVIEW: Mockolo: Swift mock generator.

USAGE: mockolo [&lt;options&gt;] --destination &lt;destination&gt;

OPTIONS:
  --allow-set-call-count  If set, generated *CallCount vars will be allowed to set manually.
  --annotation &lt;annotation&gt;
                          A custom annotation string used to indicate if a type should be mocked (default = @mockable). (default: @mockable)
  -j, --concurrency-limit &lt;n&gt;
                          Maximum number of threads to execute concurrently (default = number of cores on the running machine).
  --custom-imports &lt;custom-imports&gt;
                          If set, custom module imports (separated by a space) will be added to the final import statement list.
  --enable-args-history   Whether to enable args history for all functions (default = false). To enable history per function, use the 'history' keyword in the annotation argument.
  --disable-combine-default-values
                          Whether to disable generating Combine streams in mocks (default = false). Set this to true to control how your streams are created in your mocks.
  --exclude-imports &lt;exclude-imports&gt;
                          If set, listed modules (separated by a space) will be excluded from the import statements in the mock output.
  -x, --exclude-suffixes &lt;exclude-suffixes&gt;
                          List of filename suffix(es) without the file extensions to exclude from parsing (separated by a space).
  --header &lt;header&gt;       A custom header documentation to be added to the beginning of a generated mock file.
  -l, --logging-level &lt;n&gt; The logging level to use. Default is set to 0 (info only). Set 1 for verbose, 2 for warning, and 3 for error. (default: 0)
  --macro &lt;macro&gt;         If set, #if [macro] / #endif will be added to the generated mock file content to guard compilation.
  --mock-all              If set, it will mock all types (protocols and classes) with a mock annotation (default is set to false and only mocks protocols with a mock annotation).
  --mock-filelist &lt;mock-filelist&gt;
                          Path to a file containing a list of dependent files (separated by a new line) of modules this target depends on.
  --mock-final            If set, generated mock classes will have the 'final' attributes (default is set to false).
  -mocks, --mockfiles &lt;mocks&gt;
                          List of mock files (separated by a space) from modules this target depends on. If the --mock-filelist value exists, this will be ignored.
  -d, --destination &lt;destination&gt;
                          Output file path containing the generated Swift mock classes. If no value is given, the program will exit.
  -s, --sourcedirs &lt;sourcedirs&gt;
                          Paths to the directories containing source files to generate mocks for (separated by a space). If the --filelist or --sourcefiles values exist, they will be ignored.
  -f, --filelist &lt;filelist&gt;
                          Path to a file containing a list of source file paths (delimited by a new line). If the --sourcedirs value exists, this will be ignored.
  -srcs, --sourcefiles &lt;srcs&gt;
                          List of source files (separated by a space) to generate mocks for. If the --sourcedirs or --filelist value exists, this will be ignored.
  -i, --testable-imports &lt;testable-imports&gt;
                          If set, @testable import statements will be added for each module name in this list (separated by a space).
  --use-mock-observable   If set, a property wrapper will be used to mock RxSwift Observable variables (default is set to false).
  --use-template-func     If set, a common template function will be called from all functions in mock classes (default is set to false).
  -h, --help              Show help information.

---

## 🤖 アシスタント
*2023/10/21 12:35:29*

この出力は、Mockoloのコマンドラインツールがサポートするさまざまなオプションの概要を示しています。以下、各オプションの詳細な説明です：

1. `--allow-set-call-count`: このオプションを設定すると、生成された*CallCount変数を手動で設定できるようになります。これにより、テスト中にメソッドが呼び出された回数をカスタマイズできます。

2. `--annotation &lt;annotation&gt;`: モック化する型を示すために使用されるカスタムアノテーション文字列。デフォルトは`@mockable`です。

3. `-j, --concurrency-limit &lt;n&gt;`: 同時に実行できるスレッドの最大数。デフォルトは実行マシンのコア数です。

4. `--custom-imports &lt;custom-imports&gt;`: 設定されている場合、カスタムモジュールのインポート（スペースで区切られている）が最終的なimport文リストに追加されます。

5. `--enable-args-history`: すべての関数の引数履歴を有効にするかどうか。関数ごとに履歴を有効にするには、アノテーション引数で`history`キーワードを使用します。

6. `--disable-combine-default-values`: Combineストリームの生成をモックで無効にするかどうか。モック内のストリームの作成方法を制御するためにこの設定をtrueにします。

7. `--exclude-imports &lt;exclude-imports&gt;`: 設定すると、リストされたモジュール（スペースで区切られている）がモック出力のimport文から除外されます。

8. `-x, --exclude-suffixes &lt;exclude-suffixes&gt;`: パースから除外するファイル名のサフィックスのリスト（スペースで区切る）。拡張子は含まれません。

9. `--header &lt;header&gt;`: 生成されたモックファイルの始めに追加されるカスタムヘッダードキュメント。

10. `-l, --logging-level &lt;n&gt;`: 使用するログレベル。デフォルトは0（情報のみ）です。1は詳細、2は警告、3はエラーです。

11. `--macro &lt;macro&gt;`: 設定すると、生成されたモックファイルの内容を守るために、`#if [macro] / #endif`が追加されます。

12. `--mock-all`: 設定すると、すべての型（プロトコルとクラス）がモックアノテーションと共にモックされます（デフォルトはfalseで、モックアノテーションと共にプロトコルのみがモックされます）。

13. `--mock-filelist &lt;mock-filelist&gt;`: このターゲットが依存するモジュールの依存ファイルのリスト（新しい行で区切られている）が含まれるファイルへのパス。

14. `--mock-final`: 設定すると、生成されたモッククラスに`final`属性が付与されます（デフォルトはfalseです）。

15. `-mocks, --mockfiles &lt;mocks&gt;`: このターゲットが依存するモジュールからのモックファイルのリスト（スペースで区切る）。`--mock-filelist`値が存在する場合、これは無視されます。

16. `-d, --destination &lt;destination&gt;`: 生成されたSwiftモッククラスを含む出力ファイルのパス。値が与えられない場合、プログラムは終了します。

17. `-s, --sourcedirs &lt;sourcedirs&gt;`: モックを生成するためのソースファイルが含まれるディレクトリへのパス（スペースで区切る）。`--filelist`または`--sourcefiles`の値が存在する場合、それらは無視されます。

18. `-f, --filelist &lt;filelist&gt;`: ソースファイルパスのリストを含むファイルへのパス（新しい行で区切る）。`--sourcedirs`値が存在する場合、これは無視されます。

19. `-srcs, --sourcefiles &lt;srcs&gt;`: モックを生成するためのソースファイルのリスト（スペースで区切る）。`--sourcedirs`または`--filelist`の値が存在する場合、これは無視されます。

20. `-i, --testable-imports &lt;testable-imports&gt;`: 設定されている場合、このリストの各モジュール名に対して`@testable import`文が追加されます（スペースで区切る）。

21. `--use-mock-observable`: 設定すると、プロパティラッパーがRxSwift Observable変数をモックするために使用されます（デフォルトはfalseです）。

22. `--use-template-func`: 設定すると、モッククラス内のすべての関数から共通のテンプレート関数が呼び出されます（デフォルトはfalseです）。

23. `-h, --help`: ヘルプ情報を表示します。

これらのオプションを使用することで、モックの生成プロセスを細かく制御し、プロジェクトの特定のニ

---

## 👤 ユーザー
*2023/10/21 12:41:10*

Swift ビルドフェーズ スクリプト実行する方法を教えて欲しい。この Mock 生成コマンドをビルドフェーズで実行したい。

---

## 🤖 アシスタント
*2023/10/21 12:43:52*

Xcodeプロジェクトでビルドプロセス中にスクリプトを実行するには、カスタムビルドフェーズをプロジェクトに追加する必要があります。これにより、Mockoloなどのコマンドをプロジェクトのビルドプロセスの一部として自動的に実行できます。以下に、その手順を示します。

1. **Xcodeを開く**: まず、Xcodeでプロジェクトを開きます。

2. **プロジェクト設定に移動**: Xcodeのナビゲーションバーでプロジェクト名をクリックしてプロジェクト設定にアクセスします。

3. **ターゲットを選択**: ビルドフェーズを追加したいターゲットを選択します。

4. **ビルドフェーズタブに移動**: ターゲット設定の上部にあるタブの中から「Build Phases」を選択します。

5. **新しいビルドフェーズを追加**: 「Build Phases」セクションの右上隅にある「+」ボタンをクリックして、「New Run Script Phase」を選択します。これにより新しいセクションがビルドフェーズリストに追加されます。

6. **スクリプトを追加**: 新しく作成された「Run Script」セクションを展開し、シェルスクリプトコマンドを「Shell」テキストボックスに入力します。Mockoloを実行するためのコマンドをここに追加します。例えば：
    ```
    /path/to/mockolo -s $SRCROOT/... -d $SRCROOT/... --...（その他のオプション）
    ```
    `$SRCROOT` は、プロジェクトのルートディレクトリへのパスを表す環境変数です。

7. **ビルドフェーズの順序を調整** (オプショナル): 必要に応じて、スクリプトフェーズが実行される順序をドラッグアンドドロップで調整できます。通常、ソースコードのコンパイル前にモックを生成するため、Run ScriptフェーズをCompile Sourcesフェーズの前に配置します。

8. **保存して終了**: 設定が完了したら、Xcodeのプロジェクト設定を閉じて変更を保存します。

これで、プロジェクトをビルドするたびに、指定されたスクリプトが自動的に実行されます。この機能は、ソースコードに変更があった場合に自動的にモックを再生成するのに便利です。

---

## 👤 ユーザー
*2023/10/21 12:46:31*

こんな感じで、Makefile に実行コマンドを記述していて、make mockolo-run を実行したいんだ。

$ ls                                                                             ?[feature/819-mock]
Configs                         EmomilAppProduction             EmomilToolsPackage              Mintfile                        Scripts
Docs                            EmomilAppStaging                EmotionAnalysisApp              Periphery                       Swift-DocC
EmomilApp.xcworkspace           EmomilBinaryTargetPackage       EmotionAnalysisPackage          PlaygroundPackage               ci_scripts
EmomilAppDevelop                EmomilPackage                   Makefile

---

## 🤖 アシスタント
*2023/10/21 12:47:08*

Xcodeのビルドフェーズで外部のスクリプトやコマンドを実行するためには、"Run Script" ビルドフェーズを使用して、そのスクリプトやコマンドを呼び出すことができます。あなたのケースでは、`make mockolo-run` コマンドをMakefileから呼び出したいとのことですので、以下の手順で設定できます。

1. **Xcodeを開く**: まず、Xcodeでプロジェクトを開きます。

2. **プロジェクト設定に移動**: Xcodeのナビゲーションバーでプロジェクト名をクリックしてプロジェクト設定にアクセスします。

3. **ターゲットを選択**: ビルドフェーズを追加したいターゲットを選択します。

4. **ビルドフェーズタブに移動**: ターゲット設定の上部にあるタブの中から「Build Phases」を選択します。

5. **新しいビルドフェーズを追加**: 「Build Phases」セクションの右上隅にある「+」ボタンをクリックして、「New Run Script Phase」を選択します。これにより新しいセクションがビルドフェーズリストに追加されます。

6. **スクリプトを追加**: 新しく作成された「Run Script」セクションを展開し、シェルスクリプトコマンドを「Shell」テキストボックスに入力します。`make mockolo-run` コマンドを実行するため、以下のコマンドを入力します：
    ```
    make mockolo-run
    ```
    ただし、これが機能するためには、`Makefile` がプロジェクトのルートディレクトリに存在し、適切なターゲット（この場合は `mockolo-run`）が `Makefile` に定義されている必要があります。

7. **ビルドフェーズの順序を調整** (オプショナル): 必要に応じて、スクリプトフェーズが実行される順序をドラッグアンドドロップで調整できます。通常、ソースコードのコンパイル前にモックを生成するため、Run ScriptフェーズをCompile Sourcesフェーズの前に配置します。

8. **保存して終了**: 設定が完了したら、Xcodeのプロジェクト設定を閉じて変更を保存します。

これで、Xcodeでプロジェクトをビルドするたびに `make mockolo-run` が自動的に実行されるようになります。

---

## 👤 ユーザー
*2023/10/21 12:47:36*

どうやらうまくいかなかった。ディレクトリを移動する必要があるかもしれない。

---

## 🤖 アシスタント
*2023/10/21 12:47:54*

もし`make mockolo-run`コマンドが特定のディレクトリで実行される必要がある場合、またはMakefileがプロジェクトのルートディレクトリにない場合は、スクリプト内でディレクトリを変更する必要があります。

"Run Script"のセクションで、実行するシェルコマンドの前に`cd`コマンドを使って適切なディレクトリに移動することができます。例えば、もしMakefileがプロジェクトのサブディレクトリにある場合は、次のようにします：

```bash
cd path/to/Makefile_directory
make mockolo-run
```

`path/to/Makefile_directory`は、プロジェクト内のMakefileが存在するディレクトリへの相対パスまたは絶対パスに置き換えてください。相対パスを使用する場合、`$SRCROOT`を使用してプロジェクトのルートディレクトリからのパスを解決することが推奨されます。

```bash
cd $SRCROOT/path/to/Makefile_directory
make mockolo-run
```

これにより、スクリプトはまず指定されたディレクトリに移動してから`make mockolo-run`コマンドを実行します。これで、`make mockolo-run`が適切なディレクトリコンテキストで実行されるようになり、問題が解決するはずです。

---

## 👤 ユーザー
*2023/10/21 12:49:26*

こんな感じのエラーになった

'emomiltoolspackage': Invalid manifest (compiled with: ["/Applications/Xcode_15.0.1.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/swiftc", "-vfsoverlay", "/var/folders/mx/7cxmh1mn3r130jwl9l2pfgph0000gn/T/TemporaryDirectory.8nQ03q/vfs.yaml", "-L", "/Applications/Xcode_15.0.1.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/lib/swift/pm/ManifestAPI", "-lPackageDescription", "-Xlinker", "-rpath", "-Xlinker", "/Applications/Xcode_15.0.1.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/lib/swift/pm/ManifestAPI", "-target", "arm64-apple-macosx13.0", "-sdk", "/Applications/Xcode_15.0.1.app/Contents/Developer/Platforms/iPhoneSimulator.platform/Developer/SDKs/iPhoneSimulator17.0.sdk", "-F", "/Applications/Xcode_15.0.1.app/Contents/Developer/Platforms/MacOSX.platform/Developer/Library/Frameworks", "-I", "/Applications/Xcode_15.0.1.app/Contents/Developer/Platforms/MacOSX.platform/Developer/usr/lib", "-L", "/Applications/Xcode_15.0.1.app/Contents/Developer/Platforms/MacOSX.platform/Developer/usr/lib", "-swift-version", "5", "-I", "/Applications/Xcode_15.0.1.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/lib/swift/pm/ManifestAPI", "-sdk", "/Applications/Xcode_15.0.1.app/Contents/Developer/Platforms/iPhoneSimulator.platform/Developer/SDKs/iPhoneSimulator17.0.sdk", "-package-description-version", "5.9.0", "/Users/sugurutakahashi/git/emomil-app-ios-xcode-14.2/EmomilToolsPackage/Package.swift", "-Xfrontend", "-disable-implicit-concurrency-module-import", "-Xfrontend", "-disable-implicit-string-processing-module-import", "-o", "/var/folders/mx/7cxmh1mn3r130jwl9l2pfgph0000gn/T/TemporaryDirectory.kjFlOD/emomiltoolspackage-manifest"])

---

## 🤖 アシスタント
*2023/10/21 12:50:13*

エラーメッセージから、問題は `EmomilToolsPackage` の Swift パッケージマニフェストファイル（`Package.swift`）のコンパイルに関連しているようです。この問題は、Swiftのバージョンの非互換性、または特定のXcodeバージョンの使用に関連する可能性があります。

いくつかの解決策を提案しますが、これらは環境やプロジェクトの設定によって異なる場合があります：

1. **Swiftのバージョンを確認する**:
   - `Package.swift`が予期せず新しい機能を使用しているか、または現在の環境でサポートされていないSwiftのバージョンを要求している可能性があります。`Package.swift`ファイル内のSwiftのバージョンを確認し、使用しているXcodeのバージョンと互換性があることを確認してください。

2. **Xcodeのコマンドラインツールを確認/設定する**:
   - Xcodeのコマンドラインツールが正しく設定されていることを確認してください。これを確認するには、ターミナルで以下のコマンドを実行します:
     ```
     xcode-select -p
     ```
   - もし間違ったパスが表示される、またはXcodeのインストールに関連するパスが表示されない場合は、以下のコマンドで正しいパスを設定します（通常、Xcode.appの場所は `/Applications` ディレクトリです）:
     ```
     sudo xcode-select -s /Applications/Xcode.app
     ```

3. **Xcodeを最新バージョンに更新する**:
   - XcodeやSwiftのバージョンがプロジェクトの要件と一致していることを確認してください。必要に応じて、Xcodeを最新バージョンに更新します。

4. **プロジェクトのクリーンと再ビルド**:
   - 時には、Xcodeのキャッシュや一時ファイルが原因で問題が発生することがあります。プロジェクトをクリーンし（`Cmd + Shift + K`）、再ビルドしてください。

5. **パッケージの依存関係を確認する**:
   - もしプロジェクトが外部依存関係を持っている場合、それらが全て現在のXcodeバージョンと互換性があることを確認してください。

6. **シミュレータのターゲットを確認する**:
   - エラーメッセージには、`iPhoneSimulator.platform`に関する情報が含まれていますが、これが本当に意図したターゲットプラットフォームか確認してください。必要に応じて、プロジェクト設定やビルドスクリプトでターゲットプラットフォームを変更してください。

これらのステップを試しても問題が解決しない場合、エラーメッセージに提供された情報に基づいてさらに詳細なトラブルシューティングが必要になるかもしれません。特に、コンパイルプロセスに渡される特定のフラグやパラメータが原因で問題が発生している可能性があります。

---
