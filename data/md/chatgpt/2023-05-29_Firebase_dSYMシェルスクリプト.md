# Firebase dSYMシェルスクリプト

日付: 2023-05-29

---

## 👤 ユーザー
*2023/05/29 10:17:13*

Swift で iOSアプリを スイフトでiOSアプリを開発していて、FirebaseのアナリティックスでsSYMファイルを ビルドフェイズでアップロードしようとしているけど、それをシェルスクリプトで描きたい

---

## 🤖 アシスタント
*2023/05/29 10:17:56*

Firebaseのアナリティックスを使用してアプリのクラッシュレポートを取得するためには、ビルド時にdSYMファイルをFirebaseにアップロードすることが推奨されます。これにより、クラッシュ時のスタックトレースをデコードすることができます。

Firebase SDKを使ってdSYMファイルをアップロードするためのシェルスクリプトは次のようになります。このスクリプトは、あなたのプロジェクトの「Build Phases」セクションに追加できます。

```shell
# 環境に依存しますが、Firebase CLIのパスが異なる場合があります
FIREBASE_CLI="/usr/local/bin/firebase"

# プロジェクトのGoogleService-Info.plistから取得
GOOGLE_APP_ID=1:1234567890:ios:abcd1234abcd1234

# パスはdSYMファイルがある場所によります
DSYM_PATH=${DWARF_DSYM_FOLDER_PATH}/${DWARF_DSYM_FILE_NAME}

# Firebase CLIがインストールされているか確認
if [ -f "$FIREBASE_CLI" ]; then
    echo "Firebase CLI is installed"
else
    echo "Firebase CLI is not installed. Please install it first."
    exit 1
fi

# ビルドしたdSYMが存在するか確認
if [ -d "$DSYM_PATH" ]; then
    echo "dSYM file exists. Uploading..."
    $FIREBASE_CLI appdistribution:distribute --app $GOOGLE_APP_ID $DSYM_PATH
    echo "Upload completed."
else
    echo "dSYM file does not exist. Please make sure it's generated after the build."
    exit 1
fi
```

このスクリプトは、Firebase CLIがインストールされていることと、ビルド時にdSYMファイルが生成されていることを確認します。これらが満たされている場合には、生成されたdSYMファイルがFirebaseにアップロードされます。

なお、`GOOGLE_APP_ID`はご自身のアプリの`GoogleService-Info.plist`から取得できます。

もしFirebase CLIがインストールされていない場合は、以下のコマンドでインストールすることができます（node.jsとnpmが必要です）:

```shell
npm install -g firebase-tools
```

このシェルスクリプトは一例であり、ビルド環境によりますので適宜修正してご使用ください。

---
