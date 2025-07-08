# Firebase Crashlytics スクリプト

日付: 2023-05-29

---

## 👤 ユーザー
*2023/5/29 10:29:44*

firebase Crashlytics スクリプトの Run scriptのオプションはどれをせっていすべきか？

---

## 🤖 アシスタント
*2023/5/29 10:30:10*

Firebase Crashlyticsを使用する際、XcodeでRun Scriptフェーズを設定する必要があります。具体的には、プロジェクトのBuild Phasesタブに移動し、＋ボタンをクリックしてNew Run Script Phaseを選択します。

その後、シェルスクリプトとして以下のFirebase Crashlyticsスクリプトを追加します：

```bash
${PODS_ROOT}/FirebaseCrashlytics/run
```

また、このスクリプトの下に`Input Files`というセクションがあると思います。ここに次の行を追加します：

```bash
$(SRCROOT)/$(BUILT_PRODUCTS_DIR)/$(INFOPLIST_PATH)
```

これは、アプリのビルド情報をCrashlyticsに渡すために必要です。また、この設定により、ビルドごとにCrashlyticsがシンボルファイルを自動的にアップロードすることが可能になります。

なお、Firebase Crashlytics SDKのバージョンやXcodeのバージョンにより、設定が異なる場合があるので、Firebaseの公式ドキュメントや最新の情報を確認してください。

---

## 👤 ユーザー
*2023/5/29 10:30:21*

for install builds only なのか based on dependency analysis なのか？

---

## 🤖 アシスタント
*2023/5/29 10:31:10*

XcodeにおけるRun Scriptフェーズの設定には、"Run script only when installing"と"Based on dependency analysis"という2つのチェックボックスがあります。Firebase Crashlyticsを設定する際、これらのオプションについては以下のように理解しておくと良いでしょう。

1. **Run script only when installing**: このオプションがチェックされている場合、スクリプトはアーカイブ操作（つまり、App Storeにアプリをデプロイするためのビルド）の際にのみ実行されます。これがチェックされていない場合、スクリプトはデバッグビルドとリリースビルドの両方で実行されます。Firebase Crashlyticsの目的（クラッシュレポートを収集して分析すること）を考えると、このオプションはチェックを外しておくのが一般的です。なぜなら、開発中のビルドでクラッシュが発生した場合にもそれをキャッチしたいからです。

2. **Based on dependency analysis**: このオプションがチェックされている場合、Xcodeはスクリプトが実行される前に、そのスクリプトが依存している他のタスクがすべて完了していることを確認します。これは、あるスクリプトが他のビルドフェーズの成果物に依存している場合に重要です。通常、Firebase Crashlyticsのスクリプトはこの設定に依存しないため、このオプションは通常チェックされたままになっています。

したがって、Firebase Crashlyticsのスクリプトの設定においては、通常は"Run script only when installing"はチェックを外し、"Based on dependency analysis"はチェックしたままにしておくのが推奨されます。ただし、これらの設定はプロジェクトの特定の要件により変わる可能性がありますので、その点をご理解いただければと思います。

---

## 👤 ユーザー
*2023/5/29 10:40:06*

スキーマを修正する必要はありますか？

---

## 🤖 アシスタント
*2023/5/29 10:40:28*

Firebase CrashlyticsのRun Scriptフェーズを設定した後、特別な理由がない限り、Xcodeのスキーマを修正する必要は通常ありません。

ただし、特定のビルド設定やビルドターゲットにFirebase Crashlyticsを制限したい場合、または特定のビルド設定でCrashlyticsを無効にしたい場合など、特別な要件がある場合は、スキーマやビルド設定を変更することが必要になる場合があります。

また、特定の設定でのみデバッグシンボル（dSYM）ファイルをアップロードしたい場合など、Crashlyticsの動作をさらに細かく制御したい場合も、スキーマを修正することで実現できます。

具体的な要件や目的によりますが、一般的には、デフォルトのスキーマとビルド設定でFirebase Crashlyticsを使用することができます。

---
