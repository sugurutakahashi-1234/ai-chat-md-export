# STAGING_RELEASE not working

日付: 2023-05-30

---

## 👤 ユーザー
*2023/05/30 18:44:33*

SwiftでiOSアプリを書いている。以下の記述でSTAGING_RELEASEの設定のはずなのに動かなかった。
原因を調べたり、おかしいところを教えて欲しい

```
let licenseKey: String
        #if PRODUCTION_RELEASE
        licenseKey = "prod_z"
        #elseif STAGING_RELEASE
        licenseKey = "prod_n"
        #else
        licenseKey = "dev_"
        #endif
        print(licenseKey)
```

---

## 🤖 アシスタント
*2023/05/30 18:45:33*

提供いただいたコードは、特定のビルド設定（ここでは `PRODUCTION_RELEASE` と `STAGING_RELEASE`）が定義されているかどうかに基づいて、`licenseKey` 変数の値を設定するものです。

まず、Swiftの `#if`, `#elseif`, `#else`, `#endif` といったプリプロセッサディレクティブは、コードがコンパイルされる際に特定のコードブロックが含まれるかどうかを決定します。そして、これらのディレクティブはビルド設定やコンパイラフラグなどによって制御されます。

したがって、あなたが期待する `STAGING_RELEASE` の設定が反映されない理由は、おそらく `STAGING_RELEASE` が適切に定義されていないか、もしくは定義されていないことが考えられます。

解決方法としては以下のステップを試すことをお勧めします。

1. ビルド設定を確認してみてください。Xcodeの "Build Settings" タブで "Swift Compiler - Custom Flags" または "Preprocessor Macros" セクションを探し、`STAGING_RELEASE` が適切に設定されているかどうか確認します。通常は `STAGING_RELEASE=1` のように設定します。

2. ビルド設定が正しいにも関わらず問題が発生する場合は、ビルドをクリーンし（Cmd+Shift+K）、プロジェクトを再ビルド（Cmd+B）してみてください。これにより、ビルドのキャッシュがクリアされ、ビルド設定の変更が正しく反映される可能性があります。

これらのステップにも関わらず問題が解決しない場合は、他の可能性も考慮に入れる必要があります。例えば、コードの他の部分で `licenseKey` が上書きされていないかどうか、またはビルドターゲットが間違っていないかどうかなどを確認してみてください。

---

## 👤 ユーザー
*2023/05/30 18:45:44*

STAGING_RELEASE=1 のような =1 はどういういみなの？

---

## 🤖 アシスタント
*2023/05/30 18:46:24*

ビルド設定で `STAGING_RELEASE=1` のように設定する場合、`STAGING_RELEASE`という名前のフラグ（もしくは定義）が存在することを示します。そして、その値は `1` に設定されます。これは通常、CやC++といった言語のプリプロセッサでよく用いられる方法です。

しかし、Swiftでは通常、値 `1` は特別な意味を持たないので、単に `STAGING_RELEASE` とだけ定義することも可能です。その場合、`STAGING_RELEASE`が定義されているかどうかだけが問題となります。つまり、`STAGING_RELEASE`が存在する（定義されている）なら `#if STAGING_RELEASE` のブロックが評価されます。

Xcodeのビルド設定において、`-D STAGING_RELEASE`のように`-D`フラグを用いて`STAGING_RELEASE`を定義することもよく行われます。これはSwiftのコンパイラフラグにおいて、指定したシンボル（この場合は`STAGING_RELEASE`）を定義することを意味します。この定義が存在する場合、`#if STAGING_RELEASE` ブロック内のコードがコンパイルされ、そうでない場合は無視されます。

---

## 👤 ユーザー
*2023/05/30 18:48:27*

Swift Compiler - Custom Flags の Activr Compliation Conditions と Other Swift Flag のどちらに記述すべきなの？

---

## 🤖 アシスタント
*2023/05/30 18:49:02*

Swiftにおいて、コンパイラに条件付きのコンパイルフラグを渡す場合、通常は "Swift Compiler - Custom Flags" の "Active Compilation Conditions" を使用します。

具体的には、`STAGING_RELEASE` の場合、"Active Compilation Conditions"に `STAGING_RELEASE` を追加します。これにより、Swiftの `#if STAGING_RELEASE`、`#elseif STAGING_RELEASE`、`#endif` などの条件付きコンパイルディレクティブは `STAGING_RELEASE` が定義されているかどうかにより評価されます。

一方、"Other Swift Flags" は、Swiftコンパイラに追加のフラグを渡すために使用されますが、これは通常、コンパイラの挙動を制御するためのものであり、条件付きコンパイルフラグを定義するためのものではありません。

したがって、通常は "Active Compilation Conditions" を使用して `STAGING_RELEASE` のような条件付きコンパイルフラグを定義します。

---

## 👤 ユーザー
*2023/05/30 18:49:42*

xcconfigに定義する方法とかもあるよね？

---

## 🤖 アシスタント
*2023/05/30 18:50:25*

はい、その通りです。Xcode Configuration（xcconfig）ファイルを使用してビルド設定を管理することも可能です。これは、ビルド設定を一元管理し、複数のプロジェクトやターゲット間で設定を共有するのに便利です。

xcconfigファイルを使用して `STAGING_RELEASE` を定義するには、次のようにします：

1. 新しい `.xcconfig` ファイルを作成または既存のものを開きます。

2. このファイルに以下の行を追加します：

   ```
   SWIFT_ACTIVE_COMPILATION_CONDITIONS = $(inherited) STAGING_RELEASE
   ```

   `$(inherited)` は既存の設定を継承するためのもので、この行は `STAGING_RELEASE` をActive Compilation Conditionsに追加することを意味します。

3. Xcodeのプロジェクト設定に移動し、"Info" タブを開きます。

4. "Configurations" セクションに移動し、各ビルド設定（通常は "Debug" と "Release"）の横にある下向き矢印をクリックします。

5. 対応する `.xcconfig` ファイルを各設定に対して選択します。

このように設定することで、 `#if STAGING_RELEASE`、`#elseif STAGING_RELEASE`、`#endif` などの条件付きコンパイルディレクティブは、xcconfigファイルに `STAGING_RELEASE` が定義されているかどうかに基づいて評価されます。

---

## 👤 ユーザー
*2023/05/30 23:37:32*

Debug と Releaseで設定を分けたい場合はどうすればいいの？また、2つのアプリのターゲットがあるので、それぞれがDebug と Releaseをもっているんだ

---

## 🤖 アシスタント
*2023/05/30 23:38:47*

DebugとReleaseで異なる設定を行いたい場合、または複数のターゲットがあり、それぞれにDebugとReleaseの設定が必要な場合は、それぞれの設定を別々の`.xcconfig`ファイルに定義すると便利です。

以下に、具体的な手順を示します：

1. 各ビルド設定とターゲットに対して個別の `.xcconfig` ファイルを作成します。例えば、ターゲットが "App1" と "App2" で、それぞれに "Debug" と "Release" の設定がある場合、以下の4つのファイルが必要になるでしょう：

   - App1-Debug.xcconfig
   - App1-Release.xcconfig
   - App2-Debug.xcconfig
   - App2-Release.xcconfig

2. 各 `.xcconfig` ファイルに適切な設定を追加します。たとえば、App1のDebugビルドに `STAGING_RELEASE` を定義する場合、"App1-Debug.xcconfig" ファイルに以下の行を追加します：

   ```
   SWIFT_ACTIVE_COMPILATION_CONDITIONS = $(inherited) STAGING_RELEASE
   ```

   他のファイルには、そのビルド設定やターゲットに応じた設定を追加します。

3. Xcodeのプロジェクト設定に移動し、"Info" タブを開きます。

4. "Configurations" セクションに移動し、各ビルド設定（"Debug" と "Release"）の横にある下向き矢印をクリックします。

5. 各設定（"Debug" と "Release"）とターゲット（"App1" と "App2"）に対応する `.xcconfig` ファイルを選択します。

これにより、各ターゲットとビルド設定はそれぞれ独自の設定を持つことができ、条件付きコンパイルディレクティブは各 `.xcconfig` ファイルに定義されている設定に基づいて評価されます。

---

## 👤 ユーザー
*2023/05/30 23:41:48*

$(inherited) はどういう意味なの？

---

## 🤖 アシスタント
*2023/05/30 23:43:06*

Xcodeのビルド設定で `$(inherited)` という記法を見ることがあります。これは、ビルド設定の継承を表す特殊な記法で、現在の設定が上位レベル（または "親"）の設定から設定値を引き継ぐことを意味します。

たとえば、プロジェクトレベルである設定を定義し、それをターゲットレベルでも使用したい場合に `$(inherited)` を使用します。この場合、ターゲットレベルの設定は `$(inherited)` を使ってプロジェクトレベルの設定を継承できます。

`.xcconfig`ファイルにおける `$(inherited)` の使用例は次の通りです：

```
SWIFT_ACTIVE_COMPILATION_CONDITIONS = $(inherited) STAGING_RELEASE
```

この設定行では、 `STAGING_RELEASE` を既存の `SWIFT_ACTIVE_COMPILATION_CONDITIONS` の設定（すなわち、`$(inherited)`）に追加しています。これにより、他の場所で定義された `SWIFT_ACTIVE_COMPILATION_CONDITIONS` の値（例えば、プロジェクトレベルまたは他の `.xcconfig` ファイルで定義された値）を継承し、それに `STAGING_RELEASE` を追加しています。

したがって、 `$(inherited)` は、現在の設定が親の設定を継承することを示し、設定の再利用と整理を助ける重要なツールです。

---

## 👤 ユーザー
*2023/05/30 23:45:48*

App1 の Debug と Release で共通の設定がある場合などの $(inherited) を含めた設定方法を教えて欲しい。また、プロジェクトにもすでにDEBUGが登録されていて、それも踏まえてどうするべきかおするべきかおしえてほしい

---

## 🤖 アシスタント
*2023/05/30 23:47:33*

もしApp1のDebugとReleaseで共通の設定がある場合、またはすでにプロジェクトレベルでDEBUGが定義されている場合に、ビルド設定を効率的に管理するためには、以下のようなアプローチを取ることが推奨されます。

1. App1のための共通設定を `.xcconfig` ファイルに定義します。このファイルを "App1-Common.xcconfig" と名付けます。共通設定（たとえば、`COMMON_SETTING = value`）をこのファイルに追加します。

2. DebugとReleaseのための個別の `.xcconfig` ファイルを作成します。これらを "App1-Debug.xcconfig" と "App1-Release.xcconfig" と名付けます。そして、これらのファイルの上部に以下の行を追加します：

   ```
   #include "App1-Common.xcconfig"
   ```

   これにより、DebugとReleaseの両方の設定が "App1-Common.xcconfig" から共通設定を継承します。

3. "App1-Debug.xcconfig" と "App1-Release.xcconfig" のそれぞれに、DebugとReleaseに特有の設定を追加します。

   たとえば、すでにプロジェクトレベルで `DEBUG` が定義されている場合、"App1-Debug.xcconfig" ファイルに以下のように追加します：

   ```
   SWIFT_ACTIVE_COMPILATION_CONDITIONS = $(inherited) DEBUG
   ```

4. 最後に、Xcodeのプロジェクト設定内で、各ターゲットとビルド設定に対応する `.xcconfig` ファイルを選択します。

以上のように設定することで、各ターゲットとビルド設定はそれぞれの `.xcconfig` ファイルに定義された設定を使用します。そして、`$(inherited)` を使用することで、既存の設定を上書きすることなく、既存の設定を継承し、新たな設定を追加することができます。これにより、ビルド設定の管理が効率的になります。

---

## 👤 ユーザー
*2023/05/30 23:47:51*

App1-Common.xcconfig に SWIFT_ACTIVE_COMPILATION_CONDITIONS の設定したい場合はどうすればいい？

---

## 🤖 アシスタント
*2023/05/30 23:48:54*

もしApp1に対する共通設定として `SWIFT_ACTIVE_COMPILATION_CONDITIONS` を設定したい場合、"App1-Common.xcconfig" ファイルにその設定を追加します。例えば、`COMMON_SETTING` をこの設定に追加したい場合、以下のように書くことができます：

```
SWIFT_ACTIVE_COMPILATION_CONDITIONS = $(inherited) COMMON_SETTING
```

この設定行では、`$(inherited)` を使用して既存の `SWIFT_ACTIVE_COMPILATION_CONDITIONS` の設定を継承し、その上で `COMMON_SETTING` を追加しています。

この後、"App1-Debug.xcconfig" や "App1-Release.xcconfig" ファイルでは、以下のように特定のビルド設定を追加することができます：

```
#include "App1-Common.xcconfig"
SWIFT_ACTIVE_COMPILATION_CONDITIONS = $(inherited) DEBUG
```

この設定では、まず "App1-Common.xcconfig" ファイルをインクルードして共通設定を継承し、その後で `DEBUG` を `SWIFT_ACTIVE_COMPILATION_CONDITIONS` に追加しています。この場合、`$(inherited)` は "App1-Common.xcconfig" ファイルに定義されている `SWIFT_ACTIVE_COMPILATION_CONDITIONS` の設定を含みます。

つまり、この設定では、`SWIFT_ACTIVE_COMPILATION_CONDITIONS` には既存の設定に加えて `COMMON_SETTING` と `DEBUG` が含まれることになります。

---

## 👤 ユーザー
*2023/05/30 23:52:18*

すでに DEBUG の設定があるので、 DEBUG の設定が2重になったりしないの？

---

## 🤖 アシスタント
*2023/05/30 23:53:36*

`$(inherited)` という記法があるため、`DEBUG` の設定が2重になることは通常ありません。 `$(inherited)` は、現在のレベルよりも1つ上のレベルで設定されている値を引き継ぎます。したがって、あるレベルで `DEBUG` が設定されている場合、それはそのレベルのみで有効となります。

具体的には、もし "App1-Common.xcconfig" ファイルで `SWIFT_ACTIVE_COMPILATION_CONDITIONS = $(inherited) DEBUG` が設定されており、さらに "App1-Debug.xcconfig" ファイルでも `SWIFT_ACTIVE_COMPILATION_CONDITIONS = $(inherited) DEBUG` が設定されている場合、最終的な `SWIFT_ACTIVE_COMPILATION_CONDITIONS` の値に `DEBUG` が2回含まれることはありません。それぞれの `$(inherited)` が1つ上のレベルの設定を参照するためです。

ただし、もし同一レベルで `DEBUG` を複数回設定してしまった場合、それは意図した結果にならないかもしれません。例えば、同じ `.xcconfig` ファイル内で `SWIFT_ACTIVE_COMPILATION_CONDITIONS` を2回定義し、それぞれに `DEBUG` を含めてしまった場合、最終的な設定に `DEBUG` が2回含まれる可能性があります。ですので、 `.xcconfig` ファイル内での重複設定は避けるべきです。

具体的な設定方法や影響は、あなたのプロジェクトのビルド設定の階層構造や、どの `.xcconfig` ファイルがどのレベルで使用されているかによるため、その点を確認してみてください。

---

## 👤 ユーザー
*2023/05/31 00:36:07*

正直うまくいっていない。どこを確認した負がいいか教えて欲しい

---

## 🤖 アシスタント
*2023/05/31 00:37:27*

それは残念ですが、解決に向けて以下の確認事項を提案します：

1. **ビルド設定の確認**: まず、プロジェクト、ターゲット、そして各ビルド設定（Debug、Releaseなど）で正しい `.xcconfig` ファイルが指定されているか確認してください。これはXcodeのプロジェクト設定ページの"Info"タブ内の"Configurations"セクションで確認できます。

2. **.xcconfigファイルの確認**: 次に、それぞれの `.xcconfig` ファイルに正しい設定が記述されているか確認してください。設定が継承されているか、または正しい形式で指定されているかを見てください。

3. **プリプロセッサマクロの確認**: Swiftコード内の`#if/#elseif/#else/#endif`ディレクティブを使用している場合、これらが正しく設定されているか確認してください。特に、定義したマクロ名（例えば`STAGING_RELEASE`）がSwiftコード内でも同じ綴りで使用されているかどうかを確認してください。

4. **ビルドログの確認**: ビルド時にエラーや警告が出ていないか確認してください。特に `.xcconfig` ファイルやコンパイル条件に関連する問題がないか見てください。

5. **クリーンビルドの試行**: こうした問題が発生する時、Xcodeが古いビルドキャッシュを使用している可能性があります。`Product > Clean Build Folder` を使用してビルドフォルダをクリーンにした後、もう一度ビルドしてみてください。

6. **スキーマの設定確認**: 適切なスキーマが選択されていることを確認してください。特に、スキーマが正しいビルド設定（Debug、Releaseなど）を使っているかどうかを見てください。

これらの確認事項が全て正しいにも関わらず問題が解決しない場合、プロジェクトの設定や具体的なエラーについて詳しく教えていただければ、さらなるアドバイスが可能かもしれません。

---
