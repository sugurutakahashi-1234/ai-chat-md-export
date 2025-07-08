# SwiftLint: 除外ディレクトリ設定

日付: 2023-06-18

---

## 👤 ユーザー
*2023/06/19 03:47:13*

SwiftLintで除外ディレクトリの設定方法を教えて

.swiftlint.yml
```
# Pluginの場合は、excluded/includedが反映されないので、Lintを適用しないファイルは`EmomilNonLintPackage`で管理する
line_length: 150
nesting:
  type_level: 3
custom_rules:
  disable_print:
    included: ".*\\.swift"
    name: "print usage"
    regex: "((\\bprint)|(Swift\\.print))\\s*\\("
    message: "Prefer Logger over print"
    severity: warning
  disable_environment_object:
    included: ".*\\.swift"
    name: "print usage"
    regex: \b.environmentObject\b
    message: "Don't add EnvironmentObject"
    severity: warning
disabled_rules:
  - identifier_name
```

---

## 🤖 アシスタント
*2023/06/19 03:47:42*

SwiftLintでは、`.swiftlint.yml` ファイルに `excluded` キーを使用して除外したいディレクトリを指定することができます。 `excluded` キーの値は、除外したいディレクトリのリストとなります。

例えば、 `Tests` および `Pods` ディレクトリを SwiftLint から除外したい場合、以下のように設定できます：

```yaml
excluded: 
  - Tests
  - Pods
```

あなたの `.swiftlint.yml` ファイルに `excluded` キーを追加すると以下のようになります：

```yaml
# Pluginの場合は、excluded/includedが反映されないので、Lintを適用しないファイルは`EmomilNonLintPackage`で管理する
excluded: 
  - YOUR_DIRECTORY_TO_EXCLUDE
line_length: 150
nesting:
  type_level: 3
custom_rules:
  disable_print:
    included: ".*\\.swift"
    name: "print usage"
    regex: "((\\bprint)|(Swift\\.print))\\s*\\("
    message: "Prefer Logger over print"
    severity: warning
  disable_environment_object:
    included: ".*\\.swift"
    name: "print usage"
    regex: \b.environmentObject\b
    message: "Don't add EnvironmentObject"
    severity: warning
disabled_rules:
  - identifier_name
```

`YOUR_DIRECTORY_TO_EXCLUDE` を除外したいディレクトリ名に置き換えてください。これで、指定したディレクトリは SwiftLint の対象から除外されます。

---
