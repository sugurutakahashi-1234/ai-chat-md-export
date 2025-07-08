# Fixing License List Error

日付: 2023-08-11

---

## 👤 ユーザー
*2023/8/11 11:01:56*

以下のコードでCannot convert return expression of type '()' to return type '[License]'というエラーになる

final public class LibraryLicenseDriver: LibraryLicenseDriverProtocol {
    public init() {}
    
    public var licenseList: [License] {
        LicensesPlugin.licenses.map { License(from: $0) }.filter { !$0.text.isEmpty }.append(contentsOf: NonSPMLibrary.allCases.map { License(from: $0) })
    }
}

extension License {
    init(from licensesPluginLicense: LicensesPlugin.License) {
        self.init(id: licensesPluginLicense.id, name: licensesPluginLicense.name, text: licensesPluginLicense.licenseText ?? "")
    }
}

---

## 🤖 アシスタント
*2023/8/11 11:02:32*

`Cannot convert return expression of type '()' to return type '[License]'` エラーは、`licenseList` という computed property が `[License]` タイプを返すべきなのに、それとは異なるタイプを返そうとしている場合に発生します。

問題は `append(contentsOf:)` メソッドです。このメソッドは `[License]` の配列を返すのではなく、元の配列を変更（変数に状態を持たせる）します。このため、`append(contentsOf:)` が呼び出された後、その戻り値は `Void` (または `()`) となります。

解決策としては、結果として得たい配列を作成するために、2つの配列を結合する操作を別の方法で行うことが考えられます。

以下のように修正できます：

```swift
final public class LibraryLicenseDriver: LibraryLicenseDriverProtocol {
    public init() {}
    
    public var licenseList: [License] {
        let filteredLicenses = LicensesPlugin.licenses.map { License(from: $0) }.filter { !$0.text.isEmpty }
        let nonSPMLicenses = NonSPMLibrary.allCases.map { License(from: $0) }
        return filteredLicenses + nonSPMLicenses
    }
}

extension License {
    init(from licensesPluginLicense: LicensesPlugin.License) {
        self.init(id: licensesPluginLicense.id, name: licensesPluginLicense.name, text: licensesPluginLicense.licenseText ?? "")
    }
}
```

ここでは、2つの配列 `filteredLicenses` と `nonSPMLicenses` を作成し、最後にそれらを結合しています。これにより、期待される `[License]` タイプが正しく返されるようになります。

---
