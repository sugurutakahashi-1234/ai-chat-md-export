# Flutter OSSライセンス表示

日付: 2025-02-18

---

## 👤 ユーザー
*2025/02/18 13:31:02*

Flutter で シンプルな使用してる OSS ライブラリーを表示する様な画面を作成したい。
flutter_oss_licensesを使う方針で実装して欲しい。

---

## 🔧 ツール
*2025/02/18 13:31:21*

**追加して表示**

flutter_oss_licensesを`pubspec.yaml`に追加し、LicenseListPageを使用してアイコンを表示している。自動生成とカスタマイズの設定も行。

`flutter_oss_licenses`を`pubspec.yaml`に追加し、LicenseListPageを使ってアイコンを表示している。自動生成とカスタマイズの設定を進めているところ。

**ルート設定の追加**

MaterialAppにルートを追加し、オンタップでNavigator.pushNamedを使ってLSライセンスページを表示している。pubspec.yamlに依存関係を追加し、"generate"ステップをdev_dependenciesに追加してbuild_runnerを実行中。

---

## 🤖 アシスタント
*2025/02/18 13:31:21*

以下の手順で、OSSライブラリーのライセンス一覧を表示する画面を作成できます。  
`flutter_oss_licenses` は手動・自動で OSS ライセンス一覧を生成し、そのデータを簡単に表示できるライブラリーです。

---

## 1. 依存関係の追加

まず、`pubspec.yaml` の `dependencies`（または `dev_dependencies`）に以下を追加してください。

```yaml
dev_dependencies:
  build_runner: ^2.3.3
  flutter_oss_licenses: ^2.0.2
```

バージョンは例です。実際は [pub.dev](https://pub.dev/packages/flutter_oss_licenses) や `pubspec.yaml` を確認して、最新版を使ってください。

---

## 2. ライセンス情報の自動生成

`flutter_oss_licenses` はビルド時に解析を行い、OSS ライセンス一覧を自動生成します。

以下のコマンドを実行してください。

```bash
flutter pub run build_runner build --delete-conflicting-outputs
```

もし途中で衝突するファイル（`*.g.dart` など）がある場合は、`--delete-conflicting-outputs` をつけることで削除して再生成します。  
ビルドが完了すると、`lib/flutter_oss_licenses.dart` というファイルが生成され、中に OSS ライセンス情報が埋め込まれます。

---

## 3. ライセンス一覧ページの表示方法

### 3-1. シンプルに標準のリスト表示

`package:flutter_oss_licenses/flutter_oss_licenses.dart` が提供する `OSSLicensePage`（あるいは `OSSLicenseListPage`）ウィジェットを使います。  
たとえば、以下のように `MaterialApp` のルートとして登録し、画面遷移して表示する例です。

```dart
import 'package:flutter/material.dart';
import 'package:flutter_oss_licenses/flutter_oss_licenses.dart';

void main() {
  // 生成されたライセンスを初期化する（必須）
  // アプリの起動時などに一度だけ呼び出しておくとよいです
  FlutterOssLicenses.initialize();

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'OSS Licenses Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      // OSSライセンスの画面をルート登録
      routes: {
        '/oss-licenses': (context) => const OSSLicensePage(),
      },
      home: const HomePage(),
    );
  }
}

class HomePage extends StatelessWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('ホーム画面'),
      ),
      body: Center(
        child: ElevatedButton(
          child: const Text('OSSライセンス一覧を開く'),
          onPressed: () {
            Navigator.pushNamed(context, '/oss-licenses');
          },
        ),
      ),
    );
  }
}
```

以上で、`OSSライセンス一覧を開く` ボタンをタップすると、OSS ライセンス一覧が表示されるようになります。

### 3-2. タイトルやスタイルをカスタマイズする

デフォルトではアプリバーのタイトルが `"OSS Licenses"` の英語表記になります。  
もし日本語などに変更したい場合は、`AppBar` をカスタマイズできるコンストラクタとして `OSSLicensePage()` ではなく `OSSLicenseListPage()` を利用し、自前で画面を組み立てることができます。

```dart
import 'package:flutter/material.dart';
import 'package:flutter_oss_licenses/flutter_oss_licenses.dart';

class CustomOssLicensePage extends StatelessWidget {
  const CustomOssLicensePage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('OSSライセンス'),
      ),
      body: const OSSLicenseListPage(),
    );
  }
}
```

これをルート登録して遷移すれば、自由なアプリバータイトルやテーマなどを適用できます。

---

## 4. 注意点 / 補足

1. **ライセンス情報更新時**  
   新しいパッケージを追加したり、バージョンを変更したりした場合、再度下記コマンドを実行してライセンス情報を再生成してください。  
   ```bash
   flutter pub run build_runner build --delete-conflicting-outputs
   ```

2. **ライブラリーのバージョン**  
   `flutter_oss_licenses` はバージョンによって使い方が変わる可能性があります。常に `pubspec.yaml` のバージョンをチェックし、[公式ドキュメント](https://pub.dev/packages/flutter_oss_licenses)も参照してください。

3. **iOS/Android 実機で確認する**  
   実際にビルド後、実機やシミュレーター・エミュレーターでライセンスページが期待通り表示されるか確認してください。

---

上記手順で簡単に OSS ライセンスの一覧画面を作成できます。  
デフォルトの `OSSLicensePage` を使うだけなら非常にシンプルに導入できるのでぜひお試しください。

---

## 👤 ユーザー
*2025/02/18 14:28:54*

{
  "content_type": "image_asset_pointer",
  "asset_pointer": "file-service://file-KQniTLJAf5dLnFwm9z6jKu",
  "size_bytes": 752997,
  "width": 776,
  "height": 1552,
  "fovea": null,
  "metadata": {
    "dalle": null,
    "gizmo": null,
    "generation": null,
    "container_pixel_height": null,
    "container_pixel_width": null,
    "emu_omit_glimpse_image": null,
    "emu_patches_override": null,
    "sanitized": true,
    "asset_pointer_link": null,
    "watermarked_asset_pointer": null
  }
}
公式のサンプルコードを参照にしたら以下のようになった。
表示されすぎな気がしていて、もっと常識的に必要最低限の表示でいい気がしている。

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:snpit_guild_app/infrastructure/flutter_oss_licenses/oss_licenses.dart';
import 'package:url_launcher/url_launcher_string.dart';

class OssLicenseListPage extends StatelessWidget {
  const OssLicenseListPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const OssLicensesPage();
  }
}

class OssLicensesPage extends StatelessWidget {
  const OssLicensesPage({super.key});

  static Future&lt;List&lt;Package&gt;&gt; loadLicenses() async {
    final lm = &lt;String, List&lt;String&gt;&gt;{};
    await for (final l in LicenseRegistry.licenses) {
      for (final p in l.packages) {
        lm
            .putIfAbsent(p, () =&gt; [])
            .addAll(l.paragraphs.map((paragraph) =&gt; paragraph.text));
      }
    }
    final licenses = dependencies.toList();
    for (final key in lm.keys) {
      licenses.add(
        Package(
          name: key,
          description: '',
          authors: [],
          version: '',
          license: lm[key]!.join('\n\n'),
          isMarkdown: false,
          isSdk: false,
          dependencies: [],
        ),
      );
    }
    licenses.sort((a, b) =&gt; a.name.compareTo(b.name));
    return licenses;
  }

  static final _licenses = loadLicenses();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Open Source Licenses'),
      ),
      body: FutureBuilder&lt;List&lt;Package&gt;&gt;(
        future: _licenses,
        initialData: const [],
        builder: (context, snapshot) {
          return ListView.separated(
            padding: EdgeInsets.zero,
            itemCount: snapshot.data?.length ?? 0,
            itemBuilder: (context, index) {
              final package = snapshot.data![index];
              return ListTile(
                title: Text('${package.name} ${package.version}'),
                subtitle: package.description.isNotEmpty
                    ? Text(package.description)
                    : null,
                trailing: const Icon(Icons.chevron_right),
                onTap: () =&gt; Navigator.of(context).push(
                  MaterialPageRoute&lt;Widget&gt;(
                    builder: (context) =&gt;
                        MiscOssLicenseSingle(package: package),
                  ),
                ),
              );
            },
            separatorBuilder: (context, index) =&gt; const Divider(),
          );
        },
      ),
    );
  }
}

class MiscOssLicenseSingle extends StatelessWidget {
  const MiscOssLicenseSingle({super.key, required this.package});
  final Package package;

  String _bodyText() {
    return package.license!.split('\n').map((line) {
      if (line.startsWith('//')) {
        line = line.substring(2);
      }
      return line.trim();
    }).join('\n');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('${package.name} ${package.version}')),
      body: ListView(
        children: &lt;Widget&gt;[
          if (package.description.isNotEmpty)
            Padding(
              padding: const EdgeInsets.only(
                top: 12,
                left: 12,
                right: 12,
              ),
              child: Text(
                package.description,
                style: Theme.of(context).textTheme.bodyMedium!.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),
            ),
          if (package.homepage != null)
            Padding(
              padding: const EdgeInsets.only(
                top: 12,
                left: 12,
                right: 12,
              ),
              child: InkWell(
                child: Text(
                  package.homepage!,
                  style: const TextStyle(
                    color: Colors.blue,
                    decoration: TextDecoration.underline,
                  ),
                ),
                onTap: () =&gt; launchUrlString(package.homepage!),
              ),
            ),
          if (package.description.isNotEmpty || package.homepage != null)
            const Divider(),
          Padding(
            padding: const EdgeInsets.only(
              top: 12,
              left: 12,
              right: 12,
            ),
            child: Text(
              _bodyText(),
              style: Theme.of(context).textTheme.bodyMedium,
            ),
          ),
        ],
      ),
    );
  }
}

---

## 🤖 アシスタント
*2025/02/18 14:29:34*

Flutter の `LicenseRegistry` をそのまま使うと、Dart/Flutter の内部パッケージやビルド時の開発用ライブラリなども含めて大量に表示されることがあります。  
「自分のアプリが直接依存しているパッケージだけ」を常識的に表示したいのであれば、表示をフィルタリングする方法がおすすめです。

以下では大きく2つの方針を紹介します。

1. **そもそも `LicenseRegistry` を直接使わず**、`flutter_oss_licenses` が提供する自動生成機能＋`OSSLicensePage`ウィジェットだけで済ませる  
2. **上記のように `LicenseRegistry` を自前で処理する場合**に、不要なパッケージを弾くフィルタリングを加える  

---

## 1. `flutter_oss_licenses` の標準機能だけで済ませる方法

最も簡単なのは、`flutter_oss_licenses` が提供する以下のような利用方法です。

1. `pubspec.yaml` の `dev_dependencies` に以下を追加
   ```yaml
   dev_dependencies:
     build_runner: any
     flutter_oss_licenses: any
   ```
2. コマンドを実行してライセンス情報を自動生成
   ```bash
   flutter pub run build_runner build --delete-conflicting-outputs
   ```
   実行後、`lib/flutter_oss_licenses.dart` が生成されます。
3. 以下のようにアプリ起動時に初期化し、専用の画面を用意
   ```dart
   import 'package:flutter/material.dart';
   import 'package:flutter_oss_licenses/flutter_oss_licenses.dart';

   void main() {
     // ライセンス情報の初期化
     FlutterOssLicenses.initialize();
     runApp(const MyApp());
   }

   class MyApp extends StatelessWidget {
     const MyApp({Key? key}) : super(key: key);

     @override
     Widget build(BuildContext context) {
       return MaterialApp(
         title: 'OSS License Example',
         home: Scaffold(
           appBar: AppBar(title: const Text('Home')),
           body: Center(
             child: ElevatedButton(
               onPressed: () {
                 Navigator.of(context).push(MaterialPageRoute(
                   builder: (_) => const OSSLicensePage(),
                 ));
               },
               child: const Text('Show OSS Licenses'),
             ),
           ),
         ),
       );
     }
   }
   ```
4. これだけで、`pubspec.yaml` に書かれたパッケージのライセンス情報を表示できる  

`flutter_oss_licenses` は内部的に依存関係を解析し、**「アプリの実際の依存パッケージ」**だけを抽出してくれます。  
したがって `_fe_analyzer_shared` や `_macros` など SDK 内部のライブラリは基本的に表示されず、比較的「最小限」の一覧になります。

---

## 2. 自前で `LicenseRegistry` を使っている場合のフィルタリング方法

### 2-1. フィルタの基本方針

`LicenseRegistry` を使うと、Dart/Flutter の内部ライブラリや、ビルドの段階で使われている開発用ライブラリまで取得できます。そこで例えば次のような基準で除外する方法があります。

- **パッケージ名がアンダースコア（`_`）ではじまる場合**（`_fe_analyzer_shared`、`_macros` など）を除外  
- **自分の `pubspec.yaml` の `dependencies` や `dev_dependencies` に明示的に書いていないライブラリ**は除外  

### 2-2. コード例

たとえば、先ほどの `loadLicenses` にフィルタを追加して、不要なライブラリを弾くにはこんな書き方ができます。

```dart
static Future<List<Package>> loadLicenses() async {
  // pubspec.yaml の dependencies, dev_dependencies などから
  // 「表示したいパッケージ名の一覧」を用意すると良い
  // あるいは flutter_oss_licenses が生成する
  // 'dependencies' リストを使ってもOK
  final allowedPackageNames = <String>{
    'intl',
    'path_provider',
    'http',
    // ...など、自分が使っているライブラリのみ
  };

  // Flutter SDK で内部的に使うものや解析用ライブラリなど
  // 除外したいパッケージ名のルールを用意する例
  bool shouldExcludePackage(String packageName) {
    // 1) アンダースコアで始まるなら除外
    if (packageName.startsWith('_')) {
      return true;
    }
    // 2) 自分が管理している（allowed に入れた）もの以外は除外
    if (!allowedPackageNames.contains(packageName)) {
      return true;
    }
    return false;
  }

  // すべてのライセンス情報を拾い上げる
  final lm = <String, List<String>>{};
  await for (final l in LicenseRegistry.licenses) {
    for (final p in l.packages) {
      // フィルタの条件にマッチしたら除外
      if (shouldExcludePackage(p)) {
        continue;
      }
      lm.putIfAbsent(p, () => [])
        .addAll(l.paragraphs.map((paragraph) => paragraph.text));
    }
  }

  // パッケージオブジェクトを組み立てる
  final licenses = <Package>[];
  for (final key in lm.keys) {
    licenses.add(
      Package(
        name: key,
        description: '',    // 必要なら pubspec から引けるようにしてもOK
        authors: [],
        version: '',        // 同上
        license: lm[key]!.join('\n\n'),
        isMarkdown: false,
        isSdk: false,
        dependencies: [],
      ),
    );
  }

  licenses.sort((a, b) => a.name.compareTo(b.name));
  return licenses;
}
```

このように **「自分のアプリが本当に使っているパッケージだけを `allowedPackageNames`（あるいは外部の `dependencies` リスト）として明示し、それ以外は弾く」** というのがシンプルです。  
特定のパッケージ名だけ除外・あるいは特定の条件に合うパッケージだけ残す、といった形でカスタマイズしてください。

---

## まとめ

- **簡単に最小限のライセンスリストを用意したい**なら、`flutter_oss_licenses` の自動生成＋`OSSLicensePage` を使うのが手軽です。  
  - 公式の `build_runner` ビルドによって、自分のアプリに実際に入っている OSS だけを抽出してくれるので、 `_fe_analyzer_shared` などの内部ライブラリは基本的に含まれません。
- **`LicenseRegistry` を直接使いたい理由がある**場合は、上記のようにパッケージ名でフィルタリングして、不要なライブラリを除外するのがおすすめです。  

いずれの方法でも、「常識的に必要なライセンスだけ」を比較的シンプルな形で表示できるようになります。ぜひ試してみてください。

---
