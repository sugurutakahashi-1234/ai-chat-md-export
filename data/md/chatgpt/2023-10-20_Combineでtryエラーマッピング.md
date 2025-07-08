# Combineでtryエラーマッピング

日付: 2023-10-20

---

## 👤 ユーザー
*2023/10/20 14:21:26*

SwiftのCombineでtryでエラーがあった場合にnilにmapしたい。

 $rawPhoneNumber
            .tryCompactMap { [weak self] rawPhoneNumber in
                guard let self else {
                    return nil
                }
                let partialFormattedPhoneNumber = self.phoneNumberDriver.formatAsPartial(country: self.phoneNumberDriver.japan, rawPhoneNumber: rawPhoneNumber)
                return try self.phoneNumberDriver.formatAsInternational(country: self.phoneNumberDriver.japan, partialFormattedPhoneNumber: partialFormattedPhoneNumber)
            }
            .assign(to: &$internationalFormattedPhoneNumber)

---

## 🤖 アシスタント
*2023/10/20 14:21:51*

SwiftのCombineフレームワークを使用して、`try`オペレーターがエラーをスローした場合に結果を`nil`にマッピングする方法を探しているようです。`tryCompactMap`はエラーをスローする可能性がある変換を行いますが、直接的にはエラーを`nil`に変換しません。そのため、`catch`オペレーターを使用してエラーを特定の値（この場合は`nil`）にマップする必要があります。

以下のコードスニペットでは、`tryCompactMap`の後に`catch`を使用して、エラーが発生した場合に`nil`を返すようにしています。さらに、`mapError`を使用してエラーを特定のエラータイプ（この場合は`Never`）に変換し、エラーがプロパゲートされないようにします。

```swift
import Combine

// ... 他のコード ...

$rawPhoneNumber
    .tryCompactMap { [weak self] rawPhoneNumber -> String? in
        guard let self = self else {
            return nil
        }
        let partialFormattedPhoneNumber = self.phoneNumberDriver.formatAsPartial(country: self.phoneNumberDriver.japan, rawPhoneNumber: rawPhoneNumber)
        return try self.phoneNumberDriver.formatAsInternational(country: self.phoneNumberDriver.japan, partialFormattedPhoneNumber: partialFormattedPhoneNumber)
    }
    .catch { _ in Just<String?>(nil) } // エラーが発生した場合にnilを返す
    .mapError { _ in Never.self } // エラーをNever型にマップして、後続のオペレータにエラーが伝播しないようにします。
    .assign(to: &$internationalFormattedPhoneNumber)
```

このアプローチでは、`tryCompactMap`がエラーをスローすると、`catch`オペレーターがそのエラーを`nil`に変換します。そして、`mapError`はエラーを`Never`に変換し、ストリームが完了せずに継続することを保証します。`assign`はエラーを受け取らないため、`mapError`でエラーを`Never`に変換することが重要です。

このコードは、`phoneNumberDriver`の`formatAsPartial`メソッドと`formatAsInternational`メソッドがエラーをスローする可能性があると仮定しています。これらのメソッドが実際にエラーをスローするか、または`nil`を返すかによって、アプローチを調整する必要があります。

---

## 👤 ユーザー
*2023/10/20 14:22:41*

汎用的にエラーがある場合にnilに変換するextensionを作れないかな？

---

## 🤖 アシスタント
*2023/10/20 14:23:02*

はい、CombineのPublisherにエラーを`nil`に変換する汎用的なextensionを作成することができます。これにより、任意のPublisherでエラーが発生した際に簡単に`nil`にマップできるようになります。以下にそのようなextensionの例を示します：

```swift
import Combine

extension Publisher {
    /// 失敗した場合に`nil`を出力し、成功した場合には元の出力をそのまま出力する`Publisher`を返します。
    func replaceErrorWithNil() -> AnyPublisher<Output?, Never> {
        self.map(Optional.some)
            .catch { _ in Just(nil) } // エラーが発生した場合には、`nil`を返します。
            .eraseToAnyPublisher() // 型をシンプルにするためにAnyPublisherに変換します。
    }
}

// 使用例
$rawPhoneNumber
    .tryCompactMap { [weak self] rawPhoneNumber -> String? in
        guard let self = self else {
            return nil
        }
        let partialFormattedPhoneNumber = self.phoneNumberDriver.formatAsPartial(country: self.phoneNumberDriver.japan, rawPhoneNumber: rawPhoneNumber)
        return try self.phoneNumberDriver.formatAsInternational(country: self.phoneNumberDriver.japan, partialFormattedPhoneNumber: partialFormattedPhoneNumber)
    }
    .replaceErrorWithNil() // ここでカスタム拡張を使用します。
    .assign(to: &$internationalFormattedPhoneNumber)
```

この`replaceErrorWithNil`拡張機能は、Publisherの出力をオプショナルにラップし（`map(Optional.some)`を使用）、エラーが発生した場合には`nil`を返します。`catch`オペレーターがエラーを`nil`に変換し、`eraseToAnyPublisher`が型を`AnyPublisher`に消去しています。

これにより、任意のPublisherのチェーンでこのメソッドを呼び出すだけで、エラーを`nil`に簡単に変換できるようになります。これはコードの再利用性を高め、各所でのエラーハンドリングをシンプルに保つのに役立ちます。

---

## 👤 ユーザー
*2023/10/20 14:23:37*

replaceErrorWithNil の命名にcatch, mapError, nil という単語をふくめるようにしてほしい。

---

## 🤖 アシスタント
*2023/10/20 14:24:00*

理解しました。`catch`, `mapError`, および`nil`を含めると、メソッドの目的がより明確になり、他の開発者がその機能をより容易に理解できるようになる可能性があります。以下に、その要件を満たすメソッド名の提案をいくつか示します。

1. `catchErrorMapToNil`
2. `catchAndReplaceErrorWithNil`
3. `mapErrorToNilWithCatch`

これらの名前は、メソッドがエラーをキャッチし(`catch`)、それを`nil`にマップ(`map`)すること、そしてその結果がエラーに関連している(`Error`)ことを示しています。

例えば、`catchErrorMapToNil`を使ったコードは以下のようになります:

```swift
import Combine

extension Publisher {
    /// エラーをキャッチし、それを`nil`にマップする。
    func catchErrorMapToNil() -> AnyPublisher<Output?, Never> {
        self.map(Optional.some)
            .catch { _ in Just(nil) } // エラーが発生した場合には、`nil`を返します。
            .eraseToAnyPublisher() // 型をシンプルにするためにAnyPublisherに変換します。
    }
}

// 使用例
$rawPhoneNumber
    .tryCompactMap { [weak self] rawPhoneNumber -> String? in
        guard let self = self else {
            return nil
        }
        let partialFormattedPhoneNumber = self.phoneNumberDriver.formatAsPartial(country: self.phoneNumberDriver.japan, rawPhoneNumber: rawPhoneNumber)
        return try self.phoneNumberDriver.formatAsInternational(country: self.phoneNumberDriver.japan, partialFormattedPhoneNumber: partialFormattedPhoneNumber)
    }
    .catchErrorMapToNil() // ここでカスタム拡張を使用します。
    .assign(to: &$internationalFormattedPhoneNumber)
```

このメソッド名は、関数が内部で何をしているのかを明確に示しているため、コードの読みやすさや保守性が向上します。どのメソッド名が最適かは、チームの命名規則や個人の好みによる部分もあるため、関係者と協議することが重要です。

---

## 👤 ユーザー
*2023/10/20 15:59:08*

specialCharactersRegexが以下であるように修正してほしい。

^ $ * . [ ] { } ( ) ? " ! @ # % & / \ , &gt; &lt; ' : ; | _ ~ ` = + -

---

## 🤖 アシスタント
*2023/10/20 15:59:29*

`specialCharactersRegex`を作成する際、特殊文字が正規表現の一部としてどのように解釈されるかに注意する必要があります。提供された文字列には、正規表現として解釈される特殊文字が含まれているため、それらをエスケープする必要があります。以下のコードは、これらの特殊文字のみを許可する正規表現を作成します：

```swift
let specialCharactersRegex = "[^\\^\\$\\*\\.\\[\\]\\{\\}\\(\\)\\?\"\\!\\@\\#\\%\\&\\/\\\\,\\>\\<\\'\\:\\;\\|\\_\\~\\`\\=\\+\\-]"
```

この正規表現パターンは、指定された特殊文字以外のすべてをマッチさせます（否定的な文字クラス）。このパターンを使用して特定の文字列からこれらの特殊文字以外のものを検索・置換することができます。

正規表現の特殊文字をリテラル文字として使用する場合、それらをエスケープ（前にバックスラッシュ`\`を置く）する必要があります。これにより、正規表現エンジンはこれらの文字を特殊文字ではなく、通常の文字として解釈します。

このコードを使用する際には、具体的な使用ケース（検証、検索、置換など）に合わせて適宜修正が必要になるかもしれません。正規表現は非常に強力ですが、複雑になりがちなため、目的に合わせて慎重にテストと調整を行うことが重要です。

---

## 👤 ユーザー
*2023/10/20 15:59:51*

可読性がわるい。

---

## 🤖 アシスタント
*2023/10/20 16:00:15*

正規表現はしばしば可読性が低くなりがちです。特に多くのエスケープ文字が必要な場合、それがさらに顕著になります。Swiftでは、生の文字列リテラルを使用して、エスケープシーケンスの前に追加のバックスラッシュを避けることができます。これにより、正規表現が少し読みやすくなります。

以下は、生の文字列リテラルを使用したコード例です：

```swift
let specialCharactersRegex = #"[\^\$\*\.\[\]\{\}\(\)\?"\!@#%&/\\,><':;\|_~`=\+-]"#
```

Swift 5で導入された生の文字列リテラルでは、`#`記号を使用して文字列を囲みます。これにより、文字列内のバックスラッシュがエスケープ文字として解釈されるのを防ぐことができます。その結果、正規表現内の特殊文字をエスケープする際にバックスラッシュを二重にする必要がなくなります。

しかし、正規表現の複雑さ自体はこれによって解消されるわけではありません。正規表現はその性質上、複雑で難解な場合が多いです。そのため、正規表現を使用するコードには、そのパターンが何を意味しているのかを説明するコメントを付け加えることが一般的に推奨されます。これにより、コードの保守性と他の開発者の理解が向上します。

---

## 👤 ユーザー
*2023/10/20 16:01:41*

^ $ * . [ ] { } ( ) ? " ! @ # % & / \ , &gt; &lt; ' : ; | _ ~ ` = + -  をそれぞれテストケースで追加して確認して欲しい。

---

## 🤖 アシスタント
*2023/10/20 16:02:12*

正規表現を使用する際には、テストケースを通じてその動作を確認することが重要です。以下に、特定の特殊文字を含む文字列を検証するテストケースの例を示します。この例では、各特殊文字が正規表現にマッチするかどうかをテストします。

まず、特殊文字それぞれをテストするための配列を作成します：

```swift
let testCases = ["^", "$", "*", ".", "[", "]", "{", "}", "(", ")", "?", "\"", "!", "@", "#", "%", "&", "/", "\\", ",", ">", "<", "'", ":", ";", "|", "_", "~", "`", "=", "+", "-"]
```

次に、これらの文字が指定された正規表現と一致することを確認するテストを書きます。以下は、XCTestを使用したテストケースのサンプルです：

```swift
import XCTest

class SpecialCharacterTests: XCTestCase {
    let specialCharactersRegex = #"[\^\$\*\.\[\]\{\}\(\)\?"\!@#%&/\\,><':;\|_~`=\+-]"#

    func testSpecialCharacters() {
        let testCases = ["^", "$", "*", ".", "[", "]", "{", "}", "(", ")", "?", "\"", "!", "@", "#", "%", "&", "/", "\\", ",", ">", "<", "'", ":", ";", "|", "_", "~", "`", "=", "+", "-"]

        for testCase in testCases {
            let doesMatch = testCase.range(of: specialCharactersRegex, options: .regularExpression) != nil
            XCTAssertTrue(doesMatch, "The regex did not match the special character: \(testCase)")
        }
    }
}
```

このテストは、各特殊文字を含む文字列が正規表現に一致することを確認します。`XCTAssertTrue`を使用して、もし特定の文字がパターンにマッチしない場合にはテストが失敗するようにしています。

正規表現が複雑になると、これらのテストは非常に重要です。これにより、想定外の動作や将来的な変更がコードのこの部分の動作にどのように影響するかを明確に把握できます。テストケースを通じて、実際のコードの動作を定期的に検証することが、安全で信頼性の高いコードベースの維持に不可欠です。

---

## 👤 ユーザー
*2023/10/20 16:02:25*

let specialCharacterTestCases = [
    ("NoSpecials", false),
    ("Special!", true)
]
のに追加するかたちにしてほしい。

---

## 🤖 アシスタント
*2023/10/20 16:02:55*

あなたが提供したテストケースの形式を使用して、特殊文字が含まれているかどうかをテストする方法を調整します。テストケースは、テストする文字列と、特殊文字が含まれているかどうかの期待値（`true`または`false`）を含むタプルの配列です。

以下は、追加のテストケースを含む更新されたテストです：

```swift
import XCTest

class SpecialCharacterTests: XCTestCase {
    let specialCharactersRegex = #"[\^\$\*\.\[\]\{\}\(\)\?"\!@#%&/\\,><':;\|_~`=\+-]"#

    func testSpecialCharacters() {
        // 既存のテストケース
        let specialCharacterTestCases = [
            ("NoSpecials", false), // 特殊文字を含まない
            ("Special!", true)     // 特殊文字を含む
        ]

        // 新しいテストケースを追加
        let newTestCases = ["^", "$", "*", ".", "[", "]", "{", "}", "(", ")", "?", "\"", "!", "@", "#", "%", "&", "/", "\\", ",", ">", "<", "'", ":", ";", "|", "_", "~", "`", "=", "+", "-"]
            .map { (String($0), true) } // これらの文字はすべて特殊文字であるため、期待値は`true`です。

        // すべてのテストケースを結合
        let allTestCases = specialCharacterTestCases + newTestCases

        // 各テストケースを評価
        for (testCase, expected) in allTestCases {
            let doesMatch = testCase.range(of: specialCharactersRegex, options: .regularExpression) != nil
            XCTAssertEqual(doesMatch, expected, "Expected \(expected) for special character: \(testCase), but got \(doesMatch).")
        }
    }
}
```

このテストメソッドでは、まず初めに既存のテストケースが定義されています。その後、新しいテストケースを作成し、それらを既存の配列に結合しています。そして、各テストケースについて、文字列が正規表現にマッチするかどうかをチェックし、期待される結果（`expected`）と一致するかどうかを`XCTAssertEqual`を使用して検証します。

これにより、さまざまなシナリオで正規表現が期待通りに機能することを確認できます。テストケースが失敗した場合、どの入力文字列が期待された結果と異なっていたかがわかるように、失敗メッセージにその情報が含まれています。

---

## 👤 ユーザー
*2023/10/20 16:03:15*

以下のspecialCharacterTestCasesのような形式で追加してほしいんだ、

struct PasswordValidationStatus {
    var isValidLength: Bool = false
    var containsNumber: Bool = false
    var containsSpecialCharacter: Bool = false
    var containsUppercase: Bool = false
    var containsLowercase: Bool = false
    
    var isFullyValid: Bool {
        return isValidLength && containsNumber && containsSpecialCharacter && containsUppercase && containsLowercase
    }
}

protocol PasswordValidateDriverProtocol {
    func validatePassword(password: String) -&gt; PasswordValidationStatus
}

class PasswordValidateDriver: PasswordValidateDriverProtocol {
    
    // https://docs.aws.amazon.com/ja_jp/cognito/latest/developerguide/user-pool-settings-policies.html
    private let specialCharactersRegex = #"[\^\$*\.[]\{\}\(\)\?"\!@#%&/\\,&gt;&lt;':;\|_~`=\+-]"#
    private let validPasswordLengthRange = 16...24
    
    func validatePassword(password: String) -&gt; PasswordValidationStatus {
        let isValidLength = validPasswordLengthRange.contains(password.count)
        let containsNumber = password.rangeOfCharacter(from: .decimalDigits) != nil
        let containsSpecialCharacter = password.range(of: specialCharactersRegex, options: .regularExpression) != nil
        let containsUppercase = password.rangeOfCharacter(from: .uppercaseLetters) != nil
        let containsLowercase = password.rangeOfCharacter(from: .lowercaseLetters) != nil
        
        return PasswordValidationStatus(
            isValidLength: isValidLength,
            containsNumber: containsNumber,
            containsSpecialCharacter: containsSpecialCharacter,
            containsUppercase: containsUppercase,
            containsLowercase: containsLowercase
        )
    }
}

let driver = PasswordValidateDriver()

// 各基準ごとのテストケース
let lengthTestCases = [
    ("123456789012345", false), // 15文字
    ("1234567890123456", true),  // 16文字
    ("123456789012345678901234", true), // 24文字
    ("1234567890123456789012345", false) // 25文字
]

let numberTestCases = [
    ("NoNumbersHere!", false),
    ("1NumberIncluded", true)
]

let specialCharacterTestCases = [
    ("NoSpecials", false),
    ("Special!", true)
]

let uppercaseTestCases = [
    ("nouppercase", false),
    ("SOMEUPPERCASE", true)
]

let lowercaseTestCases = [
    ("NOLOWERCASE", false),
    ("somelowercase", true)
]

let fullValidationTestCases = [
    ("Valid1Password!", false), // 基準を満たさない
    ("Valid1Password123!", true) // すべての基準を満たす
]

// 長さのテスト
for (password, expected) in lengthTestCases {
    let result = driver.validatePassword(password: password)
    assert(result.isValidLength == expected, "Length validation failed for \(password)")
}

// 数字のテスト
for (password, expected) in numberTestCases {
    let result = driver.validatePassword(password: password)
    assert(result.containsNumber == expected, "Number validation failed for \(password)")
}

// 特殊文字のテスト
for (password, expected) in specialCharacterTestCases {
    let result = driver.validatePassword(password: password)
    assert(result.containsSpecialCharacter == expected, "Special character validation failed for \(password)")
}

// 大文字のテスト
for (password, expected) in uppercaseTestCases {
    let result = driver.validatePassword(password: password)
    assert(result.containsUppercase == expected, "Uppercase validation failed for \(password)")
}

// 小文字のテスト
for (password, expected) in lowercaseTestCases {
    let result = driver.validatePassword(password: password)
    assert(result.containsLowercase == expected, "Lowercase validation failed for \(password)")
}

// isFullyValidのテスト
for (password, expected) in fullValidationTestCases {
    let result = driver.validatePassword(password: password)
    assert(result.isFullyValid == expected, "Full validation failed for \(password)")
}


print("All tests passed!")

---

## 🤖 アシスタント
*2023/10/20 16:03:43*

特殊文字に関するテストケースを拡張するには、既存の`specialCharacterTestCases`配列に新しいエントリを追加する必要があります。それぞれの特殊文字がパスワードとして機能するか（つまり、その特殊文字を含む文字列が正規表現にマッチするか）をテストします。

以下のコードスニペットは、`specialCharacterTestCases`配列に多数の新しいテストケースを追加する方法を示しています：

```swift
// 特殊文字のテストケースを追加
var specialCharacterTestCases = [
    ("NoSpecials", false),
    ("Special!", true)
]

// 新しいテストケースを生成
let additionalSpecialCharacters = ["^", "$", "*", ".", "[", "]", "{", "}", "(", ")", "?", "\"", "!", "@", "#", "%", "&", "/", "\\", ",", ">", "<", "'", ":", ";", "|", "_", "~", "`", "=", "+", "-"]
for character in additionalSpecialCharacters {
    specialCharacterTestCases.append(("Special\(character)", true))
}

// 略...

// 特殊文字のテスト
for (password, expected) in specialCharacterTestCases {
    let result = driver.validatePassword(password: password)
    assert(result.containsSpecialCharacter == expected, "Special character validation failed for \(password)")
}

// 略...
```

このコードは、各特殊文字を含む新しい文字列を`specialCharacterTestCases`配列に追加します。そして、各テストケースについて、`validatePassword(password:)`関数が期待される結果（このコンテキストでは`true`）を返すかどうかを確認します。

`assert`関数は、テストが失敗した場合（つまり、期待される値が得られなかった場合）にエラーメッセージを出力します。これにより、どの入力文字列で問題が発生したのかを簡単に特定できます。

---

## 👤 ユーザー
*2023/10/20 16:05:02*

以下の3つを比べては可不足ないか？

private let specialCharactersRegex = #"[\^\$*\.[]\{\}\(\)\?"\!@#%&/\\,&gt;&lt;':;\|_~`=\+-]"#

let additionalSpecialCharacters = ["^", "$", "*", ".", "[", "]", "{", "}", "(", ")", "?", "\"", "!", "@", "#", "%", "&", "/", "\\", ",", ">", "<", "'", ":", ";", "|", "_", "~", "`", "=", "+", "-"]

^ $ * . [ ] { } ( ) ? " ! @ # % & / \ , &gt; &lt; ' : ; | _ ~ ` = + -

---

## 🤖 アシスタント
*2023/10/20 16:05:28*

あなたが提供した3つのリソースを比較しましょう：

1. 正規表現パターン:
    ```
    private let specialCharactersRegex = #"[\^\$\*\.\[\]\{\}\(\)\?"\!@#%&/\\,><':;\|_~`=\+-]"#
    ```
   
2. 文字の配列:
    ```
    let additionalSpecialCharacters = ["^", "$", "*", ".", "[", "]", "{", "}", "(", ")", "?", "\"", "!", "@", "#", "%", "&", "/", "\\", ",", ">", "<", "'", ":", ";", "|", "_", "~", "`", "=", "+", "-"]
    ```
   
3. スペース区切りの文字リスト:
    ```
    ^ $ * . [ ] { } ( ) ? " ! @ # % & / \ , > < ' : ; | _ ~ ` = + - 
    ```

これらを要素ごとに比較すると、すべての特殊文字がそれぞれのリストや文字列に含まれていることがわかります。ただし、いくつかの記号は、正規表現パターン内で特別な意味を持つためエスケープされています（例：`\^`、`\$`、`\*`、`\.`など）。その一方で、`additionalSpecialCharacters`配列とスペース区切りのリストには、これらのエスケープシーケンスは使用されていません。

要素の数と内容を比較すると、これらのリストと正規表現パターンは、期待される特殊文字のセットをカバーしており、不足は見られません。ただし、これらが期待通りに機能するかどうかは、実際のテストケースや実装のコンテキストに大きく依存します。ですので、実際のアプリケーションやテスト環境でこれらの構成要素を適切にテストすることが重要です。

---

## 👤 ユーザー
*2023/10/20 16:06:53*

不足はないかもしれないが、逆に多すぎなことはないか？

---

## 🤖 アシスタント
*2023/10/20 16:07:28*

3つのリストを再確認して、不必要な重複または追加がないか確認しましょう。

1. 正規表現パターン:
    ```
    private let specialCharactersRegex = #"[\^\$\*\.\[\]\{\}\(\)\?"\!@#%&/\\,><':;\|_~`=\+-]"#
    ```
   
2. 文字の配列:
    ```
    let additionalSpecialCharacters = ["^", "$", "*", ".", "[", "]", "{", "}", "(", ")", "?", "\"", "!", "@", "#", "%", "&", "/", "\\", ",", ">", "<", "'", ":", ";", "|", "_", "~", "`", "=", "+", "-"]
    ```
   
3. スペース区切りの文字リスト:
    ```
    ^ $ * . [ ] { } ( ) ? " ! @ # % & / \ , > < ' : ; | _ ~ ` = + - 
    ```

これらの各リストは、特定の特殊文字を表していますが、それぞれのコンテキストで使われ方が異なります。正規表現パターンでは、特定の文字はエスケープする必要があります（`\`を前に付ける）。文字の配列とスペース区切りの文字リストでは、エスケープは必要ありません。

これらのリストを比較すると、各リストに同じ文字が含まれているように見え、特に冗長な文字や不要な追加は見当たりません。ただし、重要なのはこれらのリストがどのように使用されるかです。

- 正規表現は、文字列が特定のパターンに一致するかどうかを判定するために使用されます。
- 文字の配列は、プログラムで繰り返し処理を行ったり、特定の文字が含まれているかどうかをチェックするのに便利です。
- スペース区切りのリストは、人間が読みやすい形式で情報を提示する場合に有用です。

各リストが期待されるコンテキストで適切に機能する限り、冗長性や不必要な追加は問題にならないでしょう。ただし、これらのリストが異なる目的で使用される場合、それぞれの使用法に応じて適切に調整する必要があります。

---

## 👤 ユーザー
*2023/10/20 16:13:59*

ちなみに以下はどういう意味

password.range(of: specialCharactersRegex, options: .regularExpression)

---

## 🤖 アシスタント
*2023/10/20 16:14:15*

この

---
