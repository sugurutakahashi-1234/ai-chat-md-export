# Combine Multiple Protocols

日付: 2024-02-27

---

## 👤 ユーザー
*2024/2/27 17:58:29*

Sourcery で以下のようなファイルから。

```
//
//  Created by sugurutakahashi on 2024/02/27
//  Copyright sugurutakahashi. All rights reserved.
//

import Foundation
import DomainLayer

/// @mockable
public protocol SettingPresenterDependency {}
```

```
//
//  Created by sugurutakahashi on 2024/02/19
//  Copyright sugurutakahashi. All rights reserved.
//

import Foundation
import DomainLayer

/// @mockable
public protocol LicenseListPresenterDependency {
    var libraryLicenseDriver: LibraryLicenseDriverProtocol { get }
}
```

```
//
//  Created by sugurutakahashi on 2024/02/19
//  Copyright sugurutakahashi. All rights reserved.
//

import Foundation
import DomainLayer

/// @mockable
public protocol AppRootPresenterDependency {
    var osLogDriver: OSLogDriverProtocol { get }
    var firebaseSetupDriver: FirebaseSetupDriverProtocol { get }
}
```

以下のようなファイルを作成してほしい

```
import Foundation

/// @mockable
public protocol AppRootRouterDependency: AppRootPresenterDependency, LicenseListPresenterDependency, SettingPresenterDependency {}

```

---

## 🤖 アシスタント
*2024/2/27 17:58:58*

Sourceryを使用して、指定されたプロトコルを継承する新しいプロトコルを作成する場合、以下のようなファイルを作成することが求められています。このファイルは、`AppRootPresenterDependency`, `LicenseListPresenterDependency`, そして `SettingPresenterDependency` という3つの既存のプロトコルを継承する新しいプロトコル `AppRootRouterDependency` を定義します。これにより、`AppRootRouterDependency` を採用する任意の型は、これら3つのプロトコルの要件をすべて満たす必要があります。

以下は、要求に応じて作成するファイルの内容です。

```swift
import Foundation

/// @mockable
public protocol AppRootRouterDependency: AppRootPresenterDependency, LicenseListPresenterDependency, SettingPresenterDependency {}
```

このコードスニペットは、Swiftのプロトコル継承を利用して、複数のプロトコルを一つにまとめる方法を示しています。`@mockable`アノテーションは、テストのためにモックを簡単に生成できるようにするために使用されます。これは、特に大規模なプロジェクトや、依存性注入を多用するアーキテクチャで有用です。

この新しいプロトコルを定義することで、`AppRootRouterDependency`を採用するクラスや構造体は、`AppRootPresenterDependency`, `LicenseListPresenterDependency`, および `SettingPresenterDependency` に定義されているすべてのプロパティやメソッドを実装する必要があります。これにより、コードの再利用性が向上し、各プロトコルの要件を満たすことで、より整理されたコードベースを維持することができます。

---

## 👤 ユーザー
*2024/2/27 18:00:19*

これを作成できるような .stencil とスクリプトを作成してほしい。

---

## 🤖 アシスタント
*2024/2/27 18:00:50*

Sourceryを使用して、指定されたプロトコルを継承する新しいプロトコルを自動的に生成する`.stencil`テンプレートと、それを処理するためのスクリプトを作成する手順を説明します。このプロセスは、プロトコルの継承関係を自動化し、開発の効率化を図るのに役立ちます。

### ステップ 1: `.stencil` テンプレートの作成

まず、新しいプロトコルを定義するための`.stencil`テンプレートを作成します。このテンプレートは、指定されたプロトコルを継承する新しいプロトコルを生成するために使用されます。

`AppRootRouterDependency.stencil`:

```stencil
import Foundation

/// @mockable
public protocol AppRootRouterDependency: {% for protocol in protocols %}{{ protocol.name }}{% if not forloop.last %}, {% endif %}{% endfor %} {}
```

このテンプレートでは、`protocols`という変数をループして、指定されたすべてのプロトコル名を列挙し、新しいプロトコル`AppRootRouterDependency`の継承リストに追加しています。`{% if not forloop.last %}, {% endif %}`は、最後のプロトコル名の後にカンマを追加しないようにしています。

### ステップ 2: Sourceryの設定ファイルの作成

Sourceryを実行するには、設定ファイルが必要です。このファイルでは、Sourceryがどのソースファイルを読み込み、どのテンプレートを使用して、どこに出力を生成するかを指定します。

`.sourcery.yml`:

```yaml
sources:
  - ./Path/To/Your/Swift/Files
templates:
  - ./Path/To/Your/Templates/AppRootRouterDependency.stencil
output:
  ./Path/To/Your/Output/Directory
```

この設定ファイルでは、`sources`にソースファイルのパス、`templates`にテンプレートファイルのパス、`output`に生成されたコードの出力先を指定します。

### ステップ 3: スクリプトの作成

Sourceryを実行するスクリプトを作成します。このスクリプトは、コマンドラインからSourceryを実行し、設定ファイルに基づいてコード生成を行います。

`generate.sh`:

```bash
#!/bin/bash

# Sourceryのパスを指定
SOURCERY="/usr/local/bin/sourcery"

# 設定ファイルのパスを指定
CONFIG_PATH="./.sourcery.yml"

# Sourceryを実行
$SOURCERY --config $CONFIG_PATH

echo "Generation completed."
```

このスクリプトを実行する前に、実行権限を与える必要があります。ターミナルで以下のコマンドを実行してください：

```bash
chmod +x generate.sh
```

### ステップ 4: スクリプトの実行

すべての設定が完了したら、ターミナルで以下のコマンドを実行して、コード生成プロセスを開始します。

```bash
./generate.sh
```

このスクリプトは、指定されたソースファイルを読み込み、`.stencil`テンプレートに従って新しいプロトコルを定義するコードを生成し、指定された出力ディレクトリにファイルを作成します。

これで、指定されたプロトコルを継承する新しいプロトコルを自動的に生成するための設定が完了しました。必要に応じて、ソースファイルのパス、テンプレートの内容、および出力ディレクトリを調整してください。

---

## 👤 ユーザー
*2024/2/27 18:01:19*

スクリプトはこちらに合うように修正してほしい。

#!/bin/bash

# 引数の数を確認
if \[ "$#" -ne 1 \]; then
    echo "使用方法: $0 &lt;ModuleName&gt;"
    exit 1
fi

SOURCERY\_PACKAGE\_PATH="./DISampleAppPackage"
SCREEN\_NAME="$1"
TEMPLATE\_PATH="./Sourcery/Template"
SOURCE\_DIR="${SOURCERY\_PACKAGE\_PATH}/Sources/Presentation"
OUTPUT\_BASE\_DIR="${SOURCE\_DIR}/${SCREEN\_NAME}"
OUTPUT\_TEST\_DIR="${SOURCERY\_PACKAGE\_PATH}/Tests/PreviewSnapshotTest"

# 出力ディレクトリが存在しない場合は作成
mkdir -p "$OUTPUT\_BASE\_DIR"

# 各コンポーネントを生成
for COMPONENT in "PresenterDependency" "Presenter" "Wireframe" "View"
do
    swift run --package-path "$SOURCERY\_PACKAGE\_PATH" mint run sourcery \\
              --sources "$SOURCE\_DIR" \\
              --templates "$TEMPLATE\_PATH/${COMPONENT}.stencil" \\
              --output "$OUTPUT\_BASE\_DIR/${SCREEN\_NAME}${COMPONENT}.swift" \\
              --args "screenName=$SCREEN\_NAME"
done

# 各コンポーネントを生成（テスト）
for COMPONENT in "ViewTest"
do
    swift run --package-path "$SOURCERY\_PACKAGE\_PATH" mint run sourcery \\
                --sources "$SOURCE\_DIR" \\
                --templates "$TEMPLATE\_PATH/${COMPONENT}.stencil" \\
                --output "$OUTPUT\_TEST\_DIR/${SCREEN\_NAME}${COMPONENT}.swift" \\
                --args "screenName=$SCREEN\_NAME"
done

echo "コンポーネントの生成が完了しました"

---

## 🤖 アシスタント
*2024/2/27 18:02:16*

指定されたスクリプトを修正して、特定のモジュール名に基づいてSourceryを使用し、プロトコルやその他のコンポーネントを生成するようにします。このスクリプトは、コマンドライン引数としてモジュール名を受け取り、そのモジュール名を使用して特定のファイルを生成します。また、`mint`を使用してSourceryを実行することを前提としています。これは、プロジェクトの依存関係を簡単に管理するための方法です。

以下は、要求に応じて修正されたスクリプトです。

```bash
#!/bin/bash

# 引数の数を確認
if [ "$#" -ne 1 ]; then
    echo "使用方法: $0 <ModuleName>"
    exit 1
fi

SOURCERY_PACKAGE_PATH="./DISampleAppPackage"
SCREEN_NAME="$1"
TEMPLATE_PATH="./Sourcery/Template"
SOURCE_DIR="${SOURCERY_PACKAGE_PATH}/Sources/Presentation"
OUTPUT_BASE_DIR="${SOURCE_DIR}/${SCREEN_NAME}"
OUTPUT_TEST_DIR="${SOURCERY_PACKAGE_PATH}/Tests/PreviewSnapshotTest"

# 出力ディレクトリが存在しない場合は作成
mkdir -p "$OUTPUT_BASE_DIR"
mkdir -p "$OUTPUT_TEST_DIR" # テストディレクトリも確認して作成

# 各コンポーネントを生成
for COMPONENT in "PresenterDependency" "Presenter" "Wireframe" "View"
do
    swift run --package-path "$SOURCERY_PACKAGE_PATH" mint run sourcery \
              --sources "$SOURCE_DIR" \
              --templates "$TEMPLATE_PATH/${COMPONENT}.stencil" \
              --output "$OUTPUT_BASE_DIR/${SCREEN_NAME}${COMPONENT}.swift" \
              --args screenName="$SCREEN_NAME"
done

# 各コンポーネントを生成（テスト）
for COMPONENT in "ViewTest"
do
    swift run --package-path "$SOURCERY_PACKAGE_PATH" mint run sourcery \
                --sources "$SOURCE_DIR" \
                --templates "$TEMPLATE_PATH/${COMPONENT}.stencil" \
                --output "$OUTPUT_TEST_DIR/${SCREEN_NAME}${COMPONENT}.swift" \
                --args screenName="$SCREEN_NAME"
done

echo "コンポーネントの生成が完了しました"
```

このスクリプトは、指定されたモジュール名に基づいて、プレゼンターの依存関係、プレゼンター自体、ワイヤーフレーム、ビュー、およびビューのテストを生成します。各コンポーネントのテンプレートは、`$TEMPLATE_PATH`で指定されたディレクトリ内に存在する必要があります。また、`--args screenName="$SCREEN_NAME"`を使用して、テンプレート内で使用される変数に値を渡しています。

このスクリプトを実行する前に、SourceryとMintがインストールされていること、および必要なテンプレートファイルが適切なディレクトリに配置されていることを確認してください。また、`chmod +x`コマンドを使用して、スクリプトに実行権限を付与することを忘れないでください。

---

## 👤 ユーザー
*2024/2/27 18:04:38*

この中にAppRootRouterDependencyを生成するコードをymlを読み込まずに指定してほしい

---

## 🤖 アシスタント
*2024/2/27 18:05:33*

指定された要件に基づいて、`AppRootRouterDependency`を生成するためのコードを直接スクリプトに組み込む方法を説明します。このアプローチでは、`.yml`設定ファイルを読み込まずに、Sourceryのコマンドラインオプションを直接使用して必要な操作を実行します。以下のスクリプトは、`AppRootRouterDependency`を含む新しいプロトコルファイルを生成するために必要な変更を示しています。

```bash
#!/bin/bash

# 引数の数を確認
if [ "$#" -ne 1 ]; then
    echo "使用方法: $0 <ModuleName>"
    exit 1
fi

SOURCERY_PACKAGE_PATH="./DISampleAppPackage"
SCREEN_NAME="$1"
TEMPLATE_PATH="./Sourcery/Template"
SOURCE_DIR="${SOURCERY_PACKAGE_PATH}/Sources/Presentation"
OUTPUT_BASE_DIR="${SOURCE_DIR}/${SCREEN_NAME}"
OUTPUT_TEST_DIR="${SOURCERY_PACKAGE_PATH}/Tests/PreviewSnapshotTest"

# 出力ディレクトリが存在しない場合は作成
mkdir -p "$OUTPUT_BASE_DIR"
mkdir -p "$OUTPUT_TEST_DIR" # テストディレクトリも確認して作成

# AppRootRouterDependencyを生成
APP_ROOT_ROUTER_DEPENDENCY_TEMPLATE="${TEMPLATE_PATH}/AppRootRouterDependency.stencil"
APP_ROOT_ROUTER_DEPENDENCY_OUTPUT="${OUTPUT_BASE_DIR}/${SCREEN_NAME}AppRootRouterDependency.swift"
swift run --package-path "$SOURCERY_PACKAGE_PATH" mint run sourcery \
          --sources "$SOURCE_DIR" \
          --templates "$APP_ROOT_ROUTER_DEPENDENCY_TEMPLATE" \
          --output "$APP_ROOT_ROUTER_DEPENDENCY_OUTPUT" \
          --args screenName="$SCREEN_NAME"

# 各コンポーネントを生成
for COMPONENT in "PresenterDependency" "Presenter" "Wireframe" "View"
do
    swift run --package-path "$SOURCERY_PACKAGE_PATH" mint run sourcery \
              --sources "$SOURCE_DIR" \
              --templates "$TEMPLATE_PATH/${COMPONENT}.stencil" \
              --output "$OUTPUT_BASE_DIR/${SCREEN_NAME}${COMPONENT}.swift" \
              --args screenName="$SCREEN_NAME"
done

# 各コンポーネントを生成（テスト）
for COMPONENT in "ViewTest"
do
    swift run --package-path "$SOURCERY_PACKAGE_PATH" mint run sourcery \
                --sources "$SOURCE_DIR" \
                --templates "$TEMPLATE_PATH/${COMPONENT}.stencil" \
                --output "$OUTPUT_TEST_DIR/${SCREEN_NAME}${COMPONENT}.swift" \
                --args screenName="$SCREEN_NAME"
done

echo "コンポーネントの生成が完了しました"
```

このスクリプトは、`AppRootRouterDependency`の生成を含む、指定されたモジュール名に基づいて複数のコンポーネントを生成します。`AppRootRouterDependency`のテンプレートファイルパスと出力ファイルパスは、スクリプト内で直接指定されています。これにより、`.yml`設定ファイルを介さずに、必要なファイルを直接生成することができます。

このスクリプトを使用する前に、SourceryとMintが正しくインストールされていること、および必要なテンプレートファイルが指定されたパスに存在することを確認してください。また、スクリプトに実行権限が与えられていることも確認してください。

---

## 👤 ユーザー
*2024/2/28 0:34:04*

MogeRouterDependency を生成したら以下のようになった。

import Foundation

/// @mockable
public protocol MogeRouterDependency:  {}


.stencil が間違っているかも

import Foundation

/// @mockable
public protocol {{ argument.routerName }}RouterDependency: {% for protocol in protocols %}{{ protocol.name }}{% if not forloop.last %}, {% endif %}{% endfor %} {}

---

## 🤖 アシスタント
*2024/2/28 0:35:06*

指定された`.stencil`ファイルの内容を見ると、`protocols`という変数をループしていますが、この変数がSourceryのコマンドライン引数やテンプレート内でどのように定義されているかが不明です。また、`{{ argument.routerName }}`の部分は、スクリプトから渡される引数の使い方は正しいですが、`protocols`リストをどのように渡すかについての情報が不足しています。

もし`protocols`が動的に決定されるべきであれば、それらをコマンドライン引数として渡すか、あるいはソースコードから自動的に抽出する必要があります。しかし、Sourceryのコマンドライン引数を使って直接リストを渡すことはできません。代わりに、ソースコードからプロトコルを抽出するか、静的なリストをテンプレートにハードコードする必要があります。

### ソースコードからプロトコルを抽出する

もし`protocols`がソースコード内の既存のプロトコルから自動的に抽出されるべきであれば、Sourceryのメタプログラミング機能を使用して、ソースファイルからプロトコルのリストを動的に生成する必要があります。しかし、このアプローチは`.stencil`ファイル内で直接実装するよりも複雑で、特定のアノテーションやコメントをソースコードに追加して、どのプロトコルが対象かをSourceryに指示する必要があるかもしれません。

### 静的なリストを使用する

`protocols`のリストが既知で変更されない場合は、そのリストをテンプレートに直接ハードコードすることができます。例えば、`AppRootPresenterDependency`, `LicenseListPresenterDependency`, `SettingPresenterDependency`を継承する場合、テンプレートは以下のようになります：

```stencil
import Foundation

/// @mockable
public protocol {{ argument.routerName }}RouterDependency: AppRootPresenterDependency, LicenseListPresenterDependency, SettingPresenterDependency {}
```

### コマンドライン引数を修正する

`{{ argument.routerName }}`を正しく使用していますが、`protocols`リストをどのようにして渡すかについては、スクリプトや`.stencil`ファイルを修正する必要があります。現在のアプローチでは、`protocols`を動的に扱う方法が実装されていないようです。

### 結論

`.stencil`ファイルが期待通りに動作しない原因は、`protocols`変数がどのようにして定義・渡されるかについての明確な実装がないためです。解決策としては、プロトコルのリストを静的にハードコードするか、ソースコードからプロトコルを動的に抽出するロジックを実装する必要があります。どちらのアプローチを選択するかは、プロジェクトの要件と利用可能なリソースに依存します。

---

## 👤 ユーザー
*2024/2/28 0:35:36*

protocols を渡すようにシェルスクリプトかstencilを修正してほしい。

---

## 🤖 アシスタント
*2024/2/28 0:36:49*

プロトコルのリストを動的に`.stencil`テンプレートに渡すためには、シェルスクリプトでプロトコルのリストを生成し、それをSourceryの`--args`オプションを使用してテンプレートに渡す必要があります。ただし、Sourceryの`--args`は単純なキー=値のペアしか受け付けないため、リストを渡すには少し工夫が必要です。ここでは、プロトコル名をカンマ区切りの文字列として渡し、テンプレート内でそれを分割する方法を紹介します。

### ステップ 1: シェルスクリプトの修正

シェルスクリプトにプロトコルのリストを定義し、それをカンマ区切りの文字列として`--args`に渡します。この例では、`AppRootPresenterDependency`, `LicenseListPresenterDependency`, `SettingPresenterDependency`をプロトコルのリストとして使用します。

```bash
#!/bin/bash

# 引数の数を確認
if [ "$#" -ne 1 ]; then
    echo "使用方法: $0 <ModuleName>"
    exit 1
fi

SOURCERY_PACKAGE_PATH="./DISampleAppPackage"
SCREEN_NAME="$1"
TEMPLATE_PATH="./Sourcery/Template"
SOURCE_DIR="${SOURCERY_PACKAGE_PATH}/Sources/Presentation"
OUTPUT_BASE_DIR="${SOURCE_DIR}/${SCREEN_NAME}"
OUTPUT_TEST_DIR="${SOURCERY_PACKAGE_PATH}/Tests/PreviewSnapshotTest"

# プロトコルのリストをカンマ区切りの文字列として定義
PROTOCOLS="AppRootPresenterDependency,LicenseListPresenterDependency,SettingPresenterDependency"

# 出力ディレクトリが存在しない場合は作成
mkdir -p "$OUTPUT_BASE_DIR"
mkdir -p "$OUTPUT_TEST_DIR"

# AppRootRouterDependencyを生成
APP_ROOT_ROUTER_DEPENDENCY_TEMPLATE="${TEMPLATE_PATH}/AppRootRouterDependency.stencil"
APP_ROOT_ROUTER_DEPENDENCY_OUTPUT="${OUTPUT_BASE_DIR}/${SCREEN_NAME}AppRootRouterDependency.swift"
swift run --package-path "$SOURCERY_PACKAGE_PATH" mint run sourcery \
          --sources "$SOURCE_DIR" \
          --templates "$APP_ROOT_ROUTER_DEPENDENCY_TEMPLATE" \
          --output "$APP_ROOT_ROUTER_DEPENDENCY_OUTPUT" \
          --args screenName="$SCREEN_NAME,protocols=$PROTOCOLS"

echo "コンポーネントの生成が完了しました"
```

### ステップ 2: `.stencil` テンプレートの修正

テンプレート内でカンマ区切りの文字列を分割し、ループ処理を行うように修正します。Sourceryのテンプレート言語（Stencil）は直接文字列を分割する機能を持っていませんが、カスタムフィルタを使用してこれを実現できます。ただし、Sourceryのデフォルトのフィルタセットには文字列分割機能が含まれていないため、この機能を直接実現するのは難しいかもしれません。代わりに、プロトコルのリストを手動で分割する必要があります。

残念ながら、上記の方法で直接`.stencil`ファイル内で文字列を分割することはサポートされていません。代わりに、プロトコルのリストを静的に定義するか、Sourceryのカスタムスクリプトや拡張機能を使用して動的に処理する必要があります。

### 代替案

プロトコルのリストを動的に処理するための直接的な方法がSourceryとそのテンプレート言語でサポートされていないため、プロトコルを手動でテンプレートに追加するか、プログラム的にファイルを生成するためのカスタムスクリプトを書く必要があります。

この限界を克服するためには、Sourceryのカスタムプラグインや外部スクリプトを使用して、必要なプロトコルリストを生成し、それをテンプレートに渡す前処理ステップを実装することを検討してください。

---
