# SwiftUI Firebase Crashlytics dSYM

日付: 2023-05-06

---

## 👤 ユーザー
*2023/05/06 14:20:34*

SwiftUIで使っているiOSアプリでFirebase Crashlytics を使いたいんだけど dSYM ファイルを自動的にアップロードする方法を教えて欲しい。

---

## 🤖 アシスタント
*2023/05/06 14:21:19*

Firebase Crashlytics を SwiftUI の iOS アプリで使用し、dSYM ファイルを自動的にアップロードする方法は次のようになります。

まず、Firebase Crashlytics をプロジェクトに導入してください。以下の手順に従って行ってください。

1. Firebase コンソールで新しいプロジェクトを作成します。
2. Firebase Crashlytics を有効にします。
3. Firebase に iOS アプリを追加し、GoogleService-Info.plist をダウンロードしてプロジェクトに追加します。

次に、プロジェクトに Firebase Crashlytics の SDK を追加します。以下の手順を行ってください。

1. Xcode でプロジェクトを開きます。
2. Swift Package Manager を使用して、`FirebaseCrashlytics` パッケージをプロジェクトに追加します。リポジトリURLは `https://github.com/firebase/firebase-ios-sdk` です。

次に、dSYM ファイルを Firebase Crashlytics に自動的にアップロードする方法です。

1. Xcode のナビゲーターエリアで、ターゲットを選択して、ターゲットの設定ページを開きます。
2. 左側のメニューで「Build Phases」タブを開きます。
3. 左下の「＋」ボタンをクリックし、「New Run Script Phase」を選択します。
4. 新しい Run Script フェーズに名前を付け、次のコマンドをスクリプト領域に貼り付けます。

```
"${PODS_ROOT}/FirebaseCrashlytics/run"
```

5. 「Input Files」セクションを展開し、「＋」ボタンをクリックして次のパスを追加します。

```
${DWARF_DSYM_FOLDER_PATH}/${DWARF_DSYM_FILE_NAME}/Contents/Resources/DWARF/${TARGET_NAME}
```

これで、ビルド時に dSYM ファイルが Firebase Crashlytics に自動的にアップロードされるようになります。これにより、Firebase Crashlytics でクラッシュレポートを解析する際に、dSYM ファイルが利用可能になります。

---

## 👤 ユーザー
*2023/05/06 14:22:17*

${PODS_ROOT} 、${DWARF_DSYM_FOLDER_PATH}、${DWARF_DSYM_FILE_NAME} ってなんですか？

---

## 🤖 アシスタント
*2023/05/06 14:22:47*

これらの変数は Xcode の環境変数で、ビルドプロセスの中で使用されます。それぞれの変数の意味は以下の通りです。

1. `${PODS_ROOT}`: CocoaPods を使用してプロジェクトに追加された依存関係のファイルが配置されているディレクトリへのパスを表します。Firebase Crashlytics を CocoaPods で導入した場合に使用します。ただし、Swift Package Manager を使用している場合は、次のパスに変更してください。

```
"${BUILD_DIR%Build/*}SourcePackages/checkouts/firebase-ios-sdk/Crashlytics/run"
```

2. `${DWARF_DSYM_FOLDER_PATH}`: ビルド時に生成された dSYM ファイルが格納されているディレクトリへのパスを表します。dSYM ファイルはデバッグ情報を含むファイルで、クラッシュレポートの解析に使用されます。

3. `${DWARF_DSYM_FILE_NAME}`: ビルド時に生成された dSYM ファイルの名前を表します。これは通常、プロジェクト名とバイナリ名が組み合わされたものになります。

これらの環境変数を使用することで、dSYM ファイルを特定し、Firebase Crashlytics のスクリプトが正しいファイルを自動的にアップロードできるようになります。

---

## 👤 ユーザー
*2023/05/06 14:24:03*

Swift Package Manager を使っているんだけど独自の Package を作成している場合でもそのスクリプトで大丈夫？

また、DWARF_DSYM_FOLDER_PATHやDWARF_DSYM_FILE_NAME はどこかで宣言する必要はある？

---

## 🤖 アシスタント
*2023/05/06 14:24:37*

Swift Package Manager を使用していて、独自の Package を作成している場合でも、先ほどのスクリプトは機能しますが、FirebaseCrashlytics の run スクリプトのパスを Swift Package Manager の形式に変更する必要があります。

以下のスクリプトを Run Script フェーズに貼り付けてください:

```
"${BUILD_DIR%Build/*}SourcePackages/checkouts/firebase-ios-sdk/Crashlytics/run"
```

そして、以下のパスを「Input Files」に追加します:

```
${DWARF_DSYM_FOLDER_PATH}/${DWARF_DSYM_FILE_NAME}/Contents/Resources/DWARF/${TARGET_NAME}
```

この設定により、独自の Package を作成している場合でも、dSYM ファイルが Firebase Crashlytics に正しくアップロードされるようになります。

`DWARF_DSYM_FOLDER_PATH` や `DWARF_DSYM_FILE_NAME` は Xcode がビルドプロセス中に自動的に設定する環境変数です。これらの変数を明示的に宣言する必要はありません。Xcode はこれらの変数を適切な値に設定し、ビルドフェーズのスクリプトで利用できるようにします。

---

## 👤 ユーザー
*2023/05/06 14:35:34*

公式ドキュメントを見ると以下のようなことが書いてあったけどどういうこと？

プロジェクトの dSYM ファイルの場所を指定すると、Crashlytics は大規模なアプリの dSYM をより迅速に処理できます。
プロジェクトのビルド済み Info.plist ファイルの場所。  $(SRCROOT)/$(BUILT_PRODUCTS_DIR)/$(INFOPLIST_PATH)  プロジェクトのビルド済み Info.plist ファイルの場所を指定すると、Crashlytics はアプリのバージョンを dSYM に関連付けることができます。

---

## 🤖 アシスタント
*2023/05/06 14:36:33*

公式ドキュメントで言及されている内容は、Crashlytics が dSYM ファイルをより迅速に処理し、アプリのバージョンを dSYM に関連付ける方法に関するものです。これを実現するために、プロジェクトのビルド済み Info.plist ファイルの場所をスクリプトに渡すことが推奨されています。

以下の手順で、Run Script フェーズにビルド済み Info.plist ファイルの場所を追加します。

1. Xcode のナビゲーターエリアでターゲットを選択し、ターゲットの設定ページを開きます。
2. 左側のメニューで「Build Phases」タブを開きます。
3. 既存の Run Script フェーズを展開し、先ほど入力したスクリプトの下に次の行を追加します。

```
--build-phase \
--dsym-path "${DWARF_DSYM_FOLDER_PATH}/${DWARF_DSYM_FILE_NAME}" \
--plist-path "${SRCROOT}/${BUILT_PRODUCTS_DIR}/${INFOPLIST_PATH}"
```

このようにすると、以下の完全なスクリプトになります。

```
"${BUILD_DIR%Build/*}SourcePackages/checkouts/firebase-ios-sdk/Crashlytics/run" \
--build-phase \
--dsym-path "${DWARF_DSYM_FOLDER_PATH}/${DWARF_DSYM_FILE_NAME}" \
--plist-path "${SRCROOT}/${BUILT_PRODUCTS_DIR}/${INFOPLIST_PATH}"
```

これで、Crashlytics は dSYM ファイルをより迅速に処理し、アプリのバージョン情報を dSYM に関連付けることができます。これにより、クラッシュレポートの解析と管理がより効率的に行えるようになります。

---
