# Applying Dart Fix and Formatting with Analysis Options

日付: 2025-03-12

---

## 👤 ユーザー
*2025/3/12 16:37:48*

dart fix --apply lib
	find lib -type f -name "*.dart" ! -path "lib/gen/*" ! -path "lib/infrastructure/snpit_guild_api/snpit_guild_api_openapi_config.dart" ! -path "lib/guild_api/*" | xargs dart format

を実行しているのだけれども以下のファイルの設定を読み込みながらすることはできないのか？

analysis_options.yaml

---

## 🤖 アシスタント
*2025/3/12 16:37:55*

現在のコマンドは Fix の適用と Dart ファイルのフォーマットを行っていますが、analysis_options.yaml の設定を読み込んで実行することも可能です。

`dart fix` コマンドと `dart format` コマンドは、デフォルトで analysis_options.yaml の設定を読み込みます。プロジェクトのルートディレクトリにこのファイルがあれば、自動的に設定が適用されます。

特に指定する必要がある場合は、以下のように `--options` フラグを使用できます：

```bash
# dart fix で options を指定
dart fix --apply --options=analysis_options.yaml lib

# dart format で options を指定
find lib -type f -name "*.dart" ! -path "lib/gen/*" ! -path "lib/infrastructure/snpit_guild_api/snpit_guild_api_openapi_config.dart" ! -path "lib/guild_api/*" | xargs dart format --options=analysis_options.yaml
```

通常、これらのコマンドはカレントディレクトリの analysis_options.yaml を自動的に検出しますが、上記のように明示的に指定することもできます。

特定の設定だけを適用したい場合は、一時的な analysis_options.yaml ファイルを作成して、そのファイルを指定することも可能です。

---

## 👤 ユーザー
*2025/3/12 16:39:09*

$ find lib -type f -name "*.dart" ! -path "lib/gen/*" ! -path "lib/infrastructure/snpit_guild_api/snpit_guild_api_openapi_config.dart" ! -path "lib/guild_api/*" | xargs dart format --options=analysis_options.yaml
Could not find an option named "--options".
Usage: dart format [options...] &lt;files or directories...&gt;
-h, --help                     Print this usage information.
-v, --verbose                  Show all options and flags with --help.
-o, --output                   Set where to write formatted output.
          [json]               Print code and selection as JSON.
          [none]               Discard output.
          [show]               Print code to terminal.
          [write] (default)    Overwrite formatted files on disk.
    --set-exit-if-changed      Return exit code 1 if there are any formatting changes.
Run "dart help" to see global options.
~/git/gallusys/snpit_guild_app  ‹feature/246-2*› $ dart fix --apply --options=analysis_options.yaml lib                1 ↵
Could not find an option named "--options".
Usage: dart fix [arguments]
-h, --help                      Print this usage information.
-n, --dry-run                   Preview the proposed changes but make no changes.
    --apply                     Apply the proposed changes.
    --code=&lt;code1,code2,...&gt;    Apply fixes for one (or more) diagnostic codes.
Run "dart help" to see global options.
~/git/gallusys/snpit_guild_app  ‹feature/246-2*› $

---

## 🤖 アシスタント
*2025/3/12 16:39:17*

申し訳ありません、私の情報が古かったようです。`dart format` と `dart fix` コマンドには `--options` フラグがないようですね。

実際には、Dart の解析ツールは自動的にプロジェクトルートの `analysis_options.yaml` ファイルを読み込みます。明示的に指定するオプションはないものの、カレントディレクトリまたはプロジェクトルートにある `analysis_options.yaml` は自動的に適用されます。

現在のコマンドをそのまま実行すれば、プロジェクトの `analysis_options.yaml` の設定が適用されるはずです：

```bash
# dart fix の実行
dart fix --apply lib

# dart format の実行
find lib -type f -name "*.dart" ! -path "lib/gen/*" ! -path "lib/infrastructure/snpit_guild_api/snpit_guild_api_openapi_config.dart" ! -path "lib/guild_api/*" | xargs dart format
```

もし特定の設定を適用したい場合は、プロジェクトの `analysis_options.yaml` を一時的に変更するか、あるいは別のディレクトリで一時的なプロジェクト構造を作成して、そこで実行するという方法も考えられます。

---

## 👤 ユーザー
*2025/3/12 16:42:21*

わかったlefthook.ymlで実行するときにanalysis_options.yamlが読み込まれていないように思える

pre-commit:
  commands:
    analyzer:
      run: fvm flutter analyze
    linter:
      run: dart fix --apply lib
    formatter:
      run: find lib -type f -name "*.dart" ! -path "lib/gen/*" ! -path "lib/infrastructure/snpit_guild_api/snpit_guild_api_openapi_config.dart" ! -path "lib/guild_api/*" | xargs dart format

---

## 🤖 アシスタント
*2025/3/12 16:42:29*

なるほど、lefthook.yml での実行時に analysis_options.yaml の設定が読み込まれていない問題ですね。

lefthook はフックを実行する際に、カレントディレクトリがプロジェクトルートとは異なる場所になっている可能性があります。そのため、Dart ツールが analysis_options.yaml ファイルを見つけられていない可能性があります。

以下のように lefthook.yml を修正して、明示的にプロジェクトルートからコマンドを実行するようにしてみましょう：

```yaml
pre-commit:
  commands:
    analyzer:
      run: cd $(git rev-parse --show-toplevel) && fvm flutter analyze
    linter:
      run: cd $(git rev-parse --show-toplevel) && dart fix --apply lib
    formatter:
      run: cd $(git rev-parse --show-toplevel) && find lib -type f -name "*.dart" ! -path "lib/gen/*" ! -path "lib/infrastructure/snpit_guild_api/snpit_guild_api_openapi_config.dart" ! -path "lib/guild_api/*" | xargs dart format
```

`$(git rev-parse --show-toplevel)` はリポジトリのルートディレクトリのパスを返すので、これによりコマンドは常にプロジェクトのルートディレクトリから実行されるようになります。これで analysis_options.yaml が確実に読み込まれるはずです。

もし問題が解決しない場合は、各コマンドの実行前に環境変数 PWD を出力して、実際の作業ディレクトリを確認するデバッグステップを追加してみてください：

```yaml
linter:
  run: echo "Current directory: $PWD" && cd $(git rev-parse --show-toplevel) && dart fix --apply lib
```

---

## 👤 ユーザー
*2025/3/12 17:03:06*

そもそもdart formatってanalysis_options.yaml の設定を読み込むのか？

---

## 🤖 アシスタント
*2025/3/12 17:03:14*

実際のところ、`dart format` コマンドは `analysis_options.yaml` ファイルから設定を読み込みません。

Dart のフォーマッティングツールである `dart format`（以前の `dartfmt`）は独自の設定方式を持っており、`analysis_options.yaml` ファイルの設定には依存していません。`dart format` は基本的に Dart の公式スタイルガイドに従った一貫したフォーマットを適用します。

一方、`dart fix` と `flutter analyze` は `analysis_options.yaml` ファイルの設定を読み込みます。これらは静的解析ツールであり、コードの質やスタイルに関するルールをカスタマイズするために設定ファイルを参照します。

もし特定のフォーマットルールを設定したい場合は、Dart 2.18以降では `dart format` に限定的なオプションがあります：

- ラインの長さ（`--line-length=N`）

ただし、スペースやインデントなどの詳細なフォーマットルールをカスタマイズするオプションはありません。Dart のフォーマットは意図的に厳格で一貫性を持たせるために設計されています。

lefthook.yml の問題については、コマンドの実行場所を確認する必要はありますが、`dart format` 自体は `analysis_options.yaml` の設定を参照しないという点を理解しておくと良いでしょう。

---

## 👤 ユーザー
*2025/3/12 17:06:40*

このファイルのexcludeをしていしたい

# https://pub.dev/packages/pedantic_mono
include: package:pedantic_mono/analysis_options.yaml

analyzer:
  errors:
    sort_pub_dependencies: ignore # Want to arrange in meaningful units
    flutter_style_todos: ignore # Want to use TODOs in the code
  exclude:
    - '**.g.dart'
    - '**.freezed.dart'
    - '**.openapi.dart'
    - '**.gen.dart'
    - guild_api/**
    - lib/infrastructure/snpit_guild_api/snpit_guild_api_openapi_config.dart

linter:
  # The lint rules applied to this project can be customized in the
  # section below to disable rules from the `package:flutter_lints/flutter.yaml`
  # included above or to enable additional rules. A list of all available lints
  # and their documentation is published at https://dart.dev/lints.
  #
  # Instead of disabling a lint rule for the entire project in the
  # section below, it can also be suppressed for a single line of code
  # or a specific dart file by using the `// ignore: name_of_lint` and
  # `// ignore_for_file: name_of_lint` syntax on the line or in the file
  # producing the lint.
  rules:
    # avoid_print: false  # Uncomment to disable the `avoid_print` rule
    # prefer_single_quotes: true  # Uncomment to enable the `prefer_single_quotes` rule

# Additional information about this file can be found at
# https://dart.dev/guides/language/analysis-options

---

## 🤖 アシスタント
*2025/3/12 17:06:49*

ご理解していただきたいのは、`dart format` コマンドは `analysis_options.yaml` の `exclude` 設定を読み込みません。

`dart format` がファイルをフォーマットしないようにするには、コマンドライン側でファイルを除外する必要があります。現在の `find` コマンドで行っているように、特定のパスを除外する方法が適切です：

```bash
find lib -type f -name "*.dart" ! -path "lib/gen/*" ! -path "lib/infrastructure/snpit_guild_api/snpit_guild_api_openapi_config.dart" ! -path "lib/guild_api/*" | xargs dart format
```

あなたの `analysis_options.yaml` ファイルに設定されている除外パターンをすべて `find` コマンドに反映させたい場合は、次のように `find` コマンドを拡張できます：

```bash
find lib -type f -name "*.dart" \
! -name "*.g.dart" \
! -name "*.freezed.dart" \
! -name "*.openapi.dart" \
! -name "*.gen.dart" \
! -path "guild_api/*" \
! -path "lib/infrastructure/snpit_guild_api/snpit_guild_api_openapi_config.dart" \
| xargs dart format
```

`dart fix` コマンドについては、`analysis_options.yaml` の `exclude` 設定を読み込みます。そのため、`dart fix --apply lib` を実行すると、`analysis_options.yaml` で除外されたファイルは処理されません。

lefthook.yml での実行時には、プロジェクトルートからコマンドが実行されていることを確認するため、前述の通り `cd $(git rev-parse --show-toplevel) &&` をコマンドの前に追加することをお勧めします。

---
