# SwiftUIでPhoneNumberKitの実装

日付: 2023-10-18

---

## 👤 ユーザー
*2023/10/18 15:25:29*

phonenumberkit を SwiftUIで実装してほしい。昨日は国を選択して、電話番号を入力するところです。

---

## 🤖 アシスタント
*2023/10/18 15:26:16*

`PhoneNumberKit`は、電話番号の解析、フォーマット、検証のためのSwiftフレームワークです。これをSwiftUIで使用するには、まずCocoaPodsやSwift Package Managerなどを使用してプロジェクトに`PhoneNumberKit`をインストールする必要があります。

以下は、`PhoneNumberKit`を使って国を選択し、その後に電話番号を入力する基本的なSwiftUIビューの例です。

まず、`PhoneNumberKit`をプロジェクトに追加します。Swift Package Managerを使用している場合は、Xcodeの"File" &gt; "Swift Packages" &gt; "Add Package Dependency"に進み、リポジトリのURL（https://github.com/marmelroy/PhoneNumberKit）を追加します。

その後、以下のコードスニペットをプロジェクトに追加してください。

```swift
import SwiftUI
import PhoneNumberKit

struct ContentView: View {
    @State private var selectedCountry = Country(code: "US", name: "United States", prefix: "+1")
    @State private var phoneNumber = ""
    @State private var formattedNumber = ""

    private var phoneNumberKit = PhoneNumberKit()

    var body: some View {
        VStack {
            // 国選択ピッカー
            Picker("Country", selection: $selectedCountry) {
                ForEach(countries, id: \.code) { country in
                    Text("\(country.flag) \(country.name)").tag(country)
                }
            }
            .pickerStyle(.menu)

            // 電話番号入力フィールド
            TextField("Phone Number", text: $phoneNumber)
                .keyboardType(.phonePad)
                .onChange(of: phoneNumber) { newValue in
                    formatNumber()
                }

            // フォーマット済み電話番号表示
            Text(formattedNumber)
        }
        .padding()
    }

    private func formatNumber() {
        do {
            let parsedNumber = try phoneNumberKit.parse(phoneNumber, withRegion: selectedCountry.code, ignoreType: true)
            formattedNumber = phoneNumberKit.format(parsedNumber, toType: .international)
        } catch {
            formattedNumber = "Invalid number"
        }
    }

    // ここに利用可能な国のリストを定義します。
    private var countries: [Country] {
        [
            Country(code: "US", name: "United States", prefix: "+1", flag: "🇺🇸"),
            // 他の国をここに追加...
        ]
    }
}

struct Country: Identifiable, Equatable {
    let id = UUID()
    let code: String
    let name: String
    let prefix: String
    let flag: String  // オプション: 国旗絵文字でビジュアルを強化
}
```

このコードは、SwiftUIの`Picker`を使用して国を選択し、選択された国に基づいて電話番号をフォーマットするものです。`countries`配列には、使用可能な国のリストが含まれており、これは実際のアプリケーションでは外部ソースから取得または拡張することができます。

また、このコードは入力された番号が変更されるたびに`formatNumber`関数をトリガーし、その番号を解析してフォーマットします。正しい番号が得られれば、それがユーザーに表示され、エラーが発生した場合は"Invalid number"と表示されます。

このサンプルコードは基本的なものですので、実際のプロジェクトに適合させるためには、エラーハンドリングの改善、ユーザーインターフェースの強化、国のリストの完全性など、さらに調整や拡張が必要になるでしょう。

---

## 👤 ユーザー
*2023/10/18 15:26:24*

Country の一覧は PhoneNumberKit を使って取得できないのか？

---

## 🤖 アシスタント
*2023/10/18 15:27:00*

はい、`PhoneNumberKit`には国のリストを取得する機能が組み込まれており、これを使用して国のコード、名前、そして電話の接頭辞を取得することができます。以下は、`PhoneNumberKit`を使用して国のリストを動的に取得し、それをSwiftUIのPickerで表示する方法です。

```swift
import SwiftUI
import PhoneNumberKit

struct ContentView: View {
    @State private var selectedCountryCode = "US"
    @State private var phoneNumber = ""
    @State private var formattedNumber = ""

    private var phoneNumberKit = PhoneNumberKit()
    
    // PhoneNumberKitを使用して国のリストを取得
    private var allCountries: [Country] {
        phoneNumberKit.allCountries().compactMap { code in
            if let countryName = (Locale.current as NSLocale).displayName(forKey: .countryCode, value: code),
               let prefix = phoneNumberKit.countryCode(for: code) {
                return Country(code: code, name: countryName, prefix: "+\(prefix)")
            }
            return nil
        }
    }

    var body: some View {
        VStack {
            // 国選択ピッカー
            Picker(selection: $selectedCountryCode, label: Text("Country")) {
                ForEach(allCountries, id: \.code) { country in
                    Text("\(country.name) (\(country.prefix))").tag(country.code)
                }
            }
            .pickerStyle(.menu)

            // 電話番号入力フィールド
            TextField("Phone Number", text: $phoneNumber)
                .keyboardType(.phonePad)
                .onChange(of: phoneNumber) { newValue in
                    formatNumber()
                }

            // フォーマット済み電話番号表示
            Text(formattedNumber)
        }
        .padding()
    }

    private func formatNumber() {
        do {
            let parsedNumber = try phoneNumberKit.parse(phoneNumber, withRegion: selectedCountryCode, ignoreType: true)
            formattedNumber = phoneNumberKit.format(parsedNumber, toType: .international)
        } catch {
            formattedNumber = "Invalid number"
        }
    }
}

struct Country: Identifiable {
    let code: String
    let name: String
    let prefix: String
    var id: String { code }  // 'code'をCountryの一意のIDとして使用
}
```

このコードでは、`PhoneNumberKit`の`allCountries`メソッドを使用して、利用可能なすべての国の国コードを取得します。それから、それぞれの国コードについて、現在のロケールに基づいて国の名前と電話の国番号接頭辞を取得します。

`Picker`は、これらの国を表示し、ユーザーが新しい国を選択すると、`selectedCountryCode`が更新されます。電話番号の入力とフォーマットの部分は前の例と同じですが、選択された国コードに基づいてパースとフォーマットが行われます。

このアプローチにより、アプリは動的にすべての利用可能な国を取得し、ユーザーに選択肢を提供できます。また、アプリのロケール設定に基づいて国名をローカライズする利点もあります。

---

## 👤 ユーザー
*2023/10/18 15:28:43*

formatNumber は何を行なっているのか？

---

## 🤖 アシスタント
*2023/10/18 15:29:22*

`formatNumber`関数は、ユーザーが入力フィールドに入力した生の電話番号を解析し、国際的な電話番号フォーマットに整形するプロセスを実行しています。以下は、この関数が行っている具体的なステップです：

1. **解析（Parsing）**: 
    - `phoneNumberKit.parse`メソッドを使用して、入力された生の電話番号文字列（`phoneNumber`）を解析します。このメソッドは、電話番号を`PhoneNumber`オブジェクトに変換しようと試みます。
    - 解析は、指定された国のコンテキスト（`withRegion`に渡される`selectedCountryCode`）で行われ、これが電話番号のフォーマットと解析の方法に影響を与えます。
    - `ignoreType: true`は、電話番号の種類（固定電話、モバイルなど）を無視して解析を行うことを指示します。これは、入力された番号がどの種類であっても解析を試みることを意味します。

2. **フォーマット（Formatting）**:
    - 解析に成功した場合（エラーが投げられなかった場合）、`phoneNumberKit.format`メソッドを使用して、解析された`PhoneNumber`オブジェクトを特定のフォーマットに変換します。
    - この例では、`.international`フォーマットが使用されています。これは、国際的なE.164標準に準拠した番号表記を生成するためのもので、国コードと国際的に認識される形式が含まれます。

3. **エラーハンドリング（Error Handling）**:
    - 解析プロセス中に何らかの問題が発生した場合（例えば、入力が実際の電話番号として認識できない場合）、`catch`ブロックがエラーを捕捉します。
    - この例では、エラーが発生すると、`formattedNumber`は"Invalid number"という文字列に設定され、これがユーザーに表示されます。

このプロセス全体は、電話番号が正しい構造とフォーマットに従っていることを確認し、アプリケーションのエンドユーザーに対して整った、国際的な形式で電話番号を提示することを目的としています。正確なフォーマットは、通信の際に正確性を保証するために重要です。また、ユーザーが異なる国の標準に従って電話番号を入力しても、統一されたフォーマットを提供することによって、ユーザー体験の一貫性を保つ助けにもなります。

---

## 👤 ユーザー
*2023/10/18 15:29:47*

例えば 日本だと +81 で始まる場合電話番号の先頭の0を省略しなければならないけどその辺はどこで処理されるの？

---

## 🤖 アシスタント
*2023/10/18 15:30:29*

`PhoneNumberKit`は、電話番号を解析しフォーマットする際に、国際的な電話番号の標準に従います。これには、各国の特有のフォーマット規則や国際電話のダイヤリング規則も含まれます。たとえば、多くの国では国内でダイヤルする際に特定の接頭辞（日本では`0`）を使用しますが、国際的にダイヤルする際にはこれを省略し、代わりに国コード（日本では`+81`）を使用します。

`PhoneNumberKit`の解析機能は、これらの規則を理解しており、適切なフォーマットに自動的に調整します。具体的には、以下のプロセスが行われます:

1. **解析（Parsing）**:
   - ユーザーが電話番号を入力すると、`PhoneNumberKit`はこの番号を解析し、有効な電話番号オブジェクトに変換しようと試みます。
   - このプロセスの一環として、ライブラリは入力された番号が国内フォーマット（例: 先頭に`0`が付いている）を使用しているか、または国際フォーマットを使用しているかを判断します。
   - 解析は、指定された国コード（このケースでは"JP"など）に基づいて行われ、国内のダイヤリング規則に従って適切な変換が適用されます。

2. **国内フォーマットの調整**:
   - もし電話番号が国内フォーマットで入力されている場合（つまり、先頭に`0`が付いているなど）、`PhoneNumberKit`はこの`0`を自動的に削除し、国際的なフォーマットに変換する際に国コード（`+81`）を追加します。
   - この変換は、国際的な通信標準に従って自動的に行われるため、開発者が明示的に処理を記述する必要はありません。

3. **フォーマット（Formatting）**:
   - 解析された電話番号は、その後特定のフォーマット（このケースでは国際フォーマット）に変換されます。
   - これにより、最終的に得られる番号は国際的なダイヤリングに適した形式（`+81`などの国コードで始まる）で表されます。

これらのプロセスは`PhoneNumberKit`ライブラリ内で自動的に行われるため、開発者は特にこれらの詳細について考慮する必要はありません。ただし、このライブラリを使用する際には、適切な国コードを設定し、そして適切なエラーハンドリングを行うことが重要です。これにより、さまざまなフォーマットの電話番号を適切に処理し、ユーザーに正しい情報を提供できます。

---

## 👤 ユーザー
*2023/10/18 16:51:04*

以下の感じにしたい。ただ、tryMapがないみたい

import PhoneNumberKit

public protocol PhoneNumberDriverProtocol: AnyObject {
    var allCountries: [Country] { get throws }
}

public final class PhoneNumberDriver: PhoneNumberDriverProtocol {
    private let phoneNumberKit = PhoneNumberKit()
    
    public init() {}
    
    public var allCountries: [Country] {
        get throws {
            phoneNumberKit.allCountries().tryMap { countryNmae in
                guard let countryCode = phoneNumberKit.countryCode(for: countryNmae) else {
                    throw AppError.unexpectedError
                }
                return Country(name: countryNmae, code: Int(countryCode))
            }
        }
    }
}


public struct Country: Identifiable {
    public let name: String
    public let code: Int
    
    public var id: String {
        "\(code)"
    }
    
    public var codeWithPlus: String {
        "+\(code)"
    }
    
    public init(name: String, code: Int) {
        self.name = name
        self.code = code
    }
}

---

## 🤖 アシスタント
*2023/10/18 16:51:36*

`tryMap`はSwiftの標準ライブラリには含まれていない関数ですが、エラーを投げることができるmapのような関数を実装することは可能です。しかし、その前に、`get throws`というプロパティはSwiftには存在しません。プロパティ自体はエラーを投げることができませんが、代わりにエラーを投げることができるメソッドを使用することができます。

以下に、あなたのニーズに合わせてコードを修正した例を示します。

```swift
import PhoneNumberKit

public protocol PhoneNumberDriverProtocol: AnyObject {
    func getAllCountries() throws -> [Country]
}

public final class PhoneNumberDriver: PhoneNumberDriverProtocol {
    private let phoneNumberKit = PhoneNumberKit()
    
    public init() {}
    
    public func getAllCountries() throws -> [Country] {
        try phoneNumberKit.allCountries().map { countryName in
            guard let countryCode = phoneNumberKit.countryCode(for: countryName) else {
                throw AppError.unexpectedError
            }
            return Country(name: countryName, code: Int(countryCode))
        }
    }
}

public struct Country: Identifiable {
    public let name: String
    public let code: Int
    
    public var id: String {
        "\(code)"
    }
    
    public var codeWithPlus: String {
        "+\(code)"
    }
    
    public init(name: String, code: Int) {
        self.name = name
        self.code = code
    }
}

enum AppError: Error {
    case unexpectedError
}
```

この変更では、`allCountries`プロパティを削除し、代わりに`getAllCountries()`メソッドを使用しています。このメソッドは、必要に応じてエラーを投げることができます。

また、`map`関数は配列の各要素に適用され、要素が`nil`でないことを確認し（このケースでは`countryCode`）、新しい`Country`オブジェクトを返します。もし`countryCode`が`nil`である場合、`AppError.unexpectedError`を投げます。

このアプローチは、各国の名前と国コードを安全に取得し、問題が発生した場合には適切にエラーを報告することができます。

---

## 👤 ユーザー
*2023/10/18 16:53:29*

codeWithPlus がしっくりきていない。他の候補も教えて欲しい

public struct Country: Identifiable {
    public let name: String
    public let code: Int
    
    public var id: String {
        "\(code)"
    }
    
    public var codeWithPlus: String {
        "+\(code)"
    }

    public init(name: String, code: Int) {
        self.name = name
        self.code = code
    }
}

---

## 🤖 アシスタント
*2023/10/18 16:53:59*

`codeWithPlus`プロパティの名称は、その機能を明確に表すものであるべきです。このプロパティは、国コードに"+"プレフィックスを付けた文字列を返すため、名前はこの動作を反映するものであると良いでしょう。以下に、いくつかの代替案を提案します。

1. **`internationalCode`**:
    国際的なコンテキストで使用されるため、`+`が付いた国コードを"international code"と呼ぶことができます。

    ```swift
    public var internationalCode: String {
        "+\(code)"
    }
    ```

2. **`fullDialingCode`**:
    これは、国コードが電話番号にダイヤルするための完全なコードであることを示します。

    ```swift
    public var fullDialingCode: String {
        "+\(code)"
    }
    ```

3. **`prefixedCode`**:
    単純にプレフィックスが付いていることを示しますが、どのようなプレフィックスかは明示していません。

    ```swift
    public var prefixedCode: String {
        "+\(code)"
    }
    ```

4. **`plusCode`**:
    `codeWithPlus`よりも短く、`+`が前に来ることを示しています。

    ```swift
    public var plusCode: String {
        "+\(code)"
    }
    ```

5. **`globalCode`**:
    このコードが世界中で使われることを示唆しています。

    ```swift
    public var globalCode: String {
        "+\(code)"
    }
    ```

これらの例の中から、そのプロパティがどのようなコンテキストで使用され、どのような情報を伝えるべきかに最も適していると思われるものを選択することができます。もちろん、これらの提案は出発点に過ぎず、最も適切で意味のある名前を選択するのは開発者の責任です。

---
