# Bundle.moduleデフォルト化

日付: 2024-03-27

---

## 👤 ユーザー
*2024/3/27 10:57:34*

Swiftでbundle: .moduleを指定するのが面倒なのですべての設定においてbundle: .moduleをデフォルトで指定する方法はないのか？

---

## 🤖 アシスタント
*2024/3/27 10:58:25*

Swiftで`Bundle.module`を頻繁に指定する必要があるのは、Swift Package Manager (SPM) を使用してリソースをパッケージに組み込む場合が多いです。この設定は、テストやフレームワーク内でリソースファイルにアクセスする際に必要となります。しかし、残念ながら、SwiftやSwift Package Managerの現在のバージョンでは、`bundle: .module`をデフォルトで設定する直接的な方法は提供されていません。

`Bundle.module`を繰り返し指定するのが面倒である場合、コードの重複を減らすためにいくつかのアプローチが考えられますが、これらはあくまでワークアラウンドです：

### ヘルパーメソッドの利用
共通のアクセスパターンがある場合（例えば、特定のタイプのリソースファイルに対してのみ`Bundle.module`を使用する場合）、そのパターンに合わせたヘルパーメソッドを定義することで、`bundle: .module`の指定を隠蔽できます。

```swift
extension Bundle {
    static func loadResource<T>(name: String, ofType type: String) -> T {
        guard let path = Bundle.module.path(forResource: name, ofType: type),
              let resource = // リソースをロードする適切な処理
        else {
            fatalError("Resource \(name).\(type) not found.")
        }
        return resource
    }
}
```

### プリプロセッサやコード生成
より高度なケースでは、ビルドスクリプトや外部ツールを使用して、必要なコード（`Bundle.module`を含む）を自動生成することが考えられます。例えば、リソースへのアクセスを抽象化するコードを生成するスクリプトを作成し、ビルドプロセスに組み込むことが可能です。

### SwiftGenなどのツールの利用
[SwiftGen](https://github.com/SwiftGen/SwiftGen)などのコード生成ツールを利用して、リソースにアクセスするための型安全なコードを自動生成することもできます。これらのツールは、リソースファイル（画像、文字列、フォントなど）へのアクセスに対するボイラープレートコードを削減し、開発の効率化を図ることができます。

### まとめ
直接的な設定変更で`bundle: .module`をデフォルトとするオプションは現在のところありませんが、ヘルパーメソッドの利用、コード生成のアプローチ、またはSwiftGenのようなツールを使用することで、コードの重複を減らし、開発の効率化を図ることが可能です。

---

## 👤 ユーザー
*2024/3/27 14:10:30*

こういうことがしたいが、Value of type 'String' has no member 'localized'のようなエラーになった

"チュートリアル".localized

extension String.LocalizationValue {
    var localized: String {
        String(localized: self, bundle: .module)
    }
}

---

## 👤 ユーザー
*2024/3/27 14:11:27*

LocalizationValue は存在する型です。

---
