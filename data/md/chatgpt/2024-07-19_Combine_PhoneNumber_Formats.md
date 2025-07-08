# Combine PhoneNumber Formats

Date: 2024-07-19

---

## 👤 User
*2024-07-19 13:03:42*

この2行の処理をphoneNumberDriverの一つの関数にしてほしい

let partialFormattedPhoneNumber = self.dependency.phoneNumberDriver.formatAsPartial(country: .japan, rawPhoneNumber: rawPhoneNumber)
                return try? self.dependency.phoneNumberDriver.formatAsInternational(country: .japan, partialFormattedPhoneNumber: partialFormattedPhoneNumber) //

public final class PhoneNumberDriver: PhoneNumberDriverProtocol {
    private nonisolated(unsafe) let phoneNumberKit = PhoneNumberKit()

    public init() {
        OSLogger.initLog()
    }

    deinit {
        OSLogger.deinitLog()
    }

    public var allCountries: [Country] {
        get throws {
            try phoneNumberKit.allCountries().map { iso3166_1RegionCode in
                guard let countryCode = phoneNumberKit.countryCode(for: iso3166_1RegionCode) else {
                    OSLogger.errorLog(AppError.customError())
                    throw AppError.customError()
                }
                return Country(iso3166_1RegionCode: iso3166_1RegionCode, code: Int(countryCode))
            }
        }
    }

    public func formatAsPartial(country: Country, rawPhoneNumber: String) -&gt; String {
        // withPrefix: true にすると "+81 90-1234-5678" のような形式になる
        PartialFormatter(phoneNumberKit: phoneNumberKit, defaultRegion: country.iso3166_1RegionCode, withPrefix: false).formatPartial(rawPhoneNumber)
    }

    public func formatAsInternational(country: Country, partialFormattedPhoneNumber: String) throws -&gt; String {
        do {
            let parsedNumber = try phoneNumberKit.parse(partialFormattedPhoneNumber, withRegion: country.iso3166_1RegionCode)
            return phoneNumberKit.format(parsedNumber, toType: .e164, withPrefix: true)
        } catch {
            OSLogger.errorLog(error.toAppError)
            throw error
        }
    }
}

---

## 🤖 Assistant
*2024-07-19 13:03:55*

この2行の処理を一つの関数にまとめるために、`PhoneNumberDriver`クラスに新しいメソッドを追加します。この新しいメソッドは、部分的にフォーマットされた電話番号をフォーマットし、国際形式に変換します。

以下は、`PhoneNumberDriver`クラスに追加する新しいメソッドの例です：

```swift
public final class PhoneNumberDriver: PhoneNumberDriverProtocol {
    private nonisolated(unsafe) let phoneNumberKit = PhoneNumberKit()

    public init() {
        OSLogger.initLog()
    }

    deinit {
        OSLogger.deinitLog()
    }

    public var allCountries: [Country] {
        get throws {
            try phoneNumberKit.allCountries().map { iso3166_1RegionCode in
                guard let countryCode = phoneNumberKit.countryCode(for: iso3166_1RegionCode) else {
                    OSLogger.errorLog(AppError.customError())
                    throw AppError.customError()
                }
                return Country(iso3166_1RegionCode: iso3166_1RegionCode, code: Int(countryCode))
            }
        }
    }

    public func formatAsPartial(country: Country, rawPhoneNumber: String) -> String {
        // withPrefix: true にすると "+81 90-1234-5678" のような形式になる
        PartialFormatter(phoneNumberKit: phoneNumberKit, defaultRegion: country.iso3166_1RegionCode, withPrefix: false).formatPartial(rawPhoneNumber)
    }

    public func formatAsInternational(country: Country, partialFormattedPhoneNumber: String) throws -> String {
        do {
            let parsedNumber = try phoneNumberKit.parse(partialFormattedPhoneNumber, withRegion: country.iso3166_1RegionCode)
            return phoneNumberKit.format(parsedNumber, toType: .e164, withPrefix: true)
        } catch {
            OSLogger.errorLog(error.toAppError)
            throw error
        }
    }

    // 新しいメソッドを追加
    public func formatRawPhoneNumberAsInternational(country: Country, rawPhoneNumber: String) throws -> String {
        let partialFormattedPhoneNumber = self.formatAsPartial(country: country, rawPhoneNumber: rawPhoneNumber)
        return try self.formatAsInternational(country: country, partialFormattedPhoneNumber: partialFormattedPhoneNumber)
    }
}
```

これにより、`PhoneNumberDriver`の`formatRawPhoneNumberAsInternational`メソッドを使用して、2行の処理を1つの関数呼び出しにまとめることができます。次のように使用します：

```swift
do {
    let formattedPhoneNumber = try self.dependency.phoneNumberDriver.formatRawPhoneNumberAsInternational(country: .japan, rawPhoneNumber: rawPhoneNumber)
    return formattedPhoneNumber
} catch {
    // エラーハンドリング
    return nil
}
```

---

## 👤 User
*2024-07-19 13:05:44*

コメントを追記してほしい

public protocol PhoneNumberDriverProtocol: AnyObject, Sendable {
    /// 全ての Country 一覧
    var allCountries: [Country] { get throws }

    /// 分割した形式にフォーマットされた電話番号を返却する
    /// - Parameters:
    ///   - country: Country
    ///   - rawPhoneNumber: e.g. "9012345678", "09012345678", "+819012345678", "+81 9012345678"+81 90 3088 9652
    /// - Returns: "90-1234-5678" (ハイフン含む)
    func formatAsPartial(country: Country, rawPhoneNumber: String) -&gt; String

    /// 国際電話の形式にフォーマットされた電話番号を返却する
    /// - Parameters:
    ///   - country: Country
    ///   - partialFormattedPhoneNumber: e.g. "90 1234 5678", "090 1234 5678", "090-1234-5678", "90-1234-5678", "+81 90-1234-5678", "+81 90 1234 5678" ( PartialFormatter による formatAsPartial した値なら可)
    /// - Returns: e.g. "+819012345678"
    func formatAsInternational(country: Country, partialFormattedPhoneNumber: String) throws -&gt; String
}

---

## 🤖 Assistant
*2024-07-19 13:05:55*

コメントを追記した`PhoneNumberDriverProtocol`のコードは以下のようになります：

```swift
public protocol PhoneNumberDriverProtocol: AnyObject, Sendable {
    /// 全ての Country 一覧
    var allCountries: [Country] { get throws }

    /// 分割した形式にフォーマットされた電話番号を返却する
    /// - Parameters:
    ///   - country: Country
    ///   - rawPhoneNumber: e.g. "9012345678", "09012345678", "+819012345678", "+81 9012345678"+81 90 3088 9652
    /// - Returns: "90-1234-5678" (ハイフン含む)
    func formatAsPartial(country: Country, rawPhoneNumber: String) -> String

    /// 国際電話の形式にフォーマットされた電話番号を返却する
    /// - Parameters:
    ///   - country: Country
    ///   - partialFormattedPhoneNumber: e.g. "90 1234 5678", "090 1234 5678", "090-1234-5678", "90-1234-5678", "+81 90-1234-5678", "+81 90 1234 5678" ( PartialFormatter による formatAsPartial した値なら可)
    /// - Returns: e.g. "+819012345678"
    func formatAsInternational(country: Country, partialFormattedPhoneNumber: String) throws -> String

    /// 生の電話番号を国際電話の形式にフォーマットされた電話番号を返却する
    /// - Parameters:
    ///   - country: Country
    ///   - rawPhoneNumber: e.g. "9012345678", "09012345678", "+819012345678", "+81 9012345678"+81 90 3088 9652
    /// - Returns: e.g. "+819012345678"
    /// - Throws: フォーマット中に発生したエラー
    func formatRawPhoneNumberAsInternational(country: Country, rawPhoneNumber: String) throws -> String
}
```

これにより、`PhoneNumberDriver`の新しいメソッド`formatRawPhoneNumberAsInternational`もプロトコルに追加され、適切なコメントが付けられています。

---

## 👤 User
*2024-07-19 13:14:33*

電話番号が入力済みの状態で有効でない場合は以下のメッセージを出したい

Text("有効な電話番号ではないようです。正しい電話番号を入力してください。（仮文言）")

---

## 🤖 Assistant
*2024-07-19 13:14:54*

電話番号が無効な場合に特定のメッセージを表示するために、SwiftUIの`Text`ビューを使用してメッセージを表示するロジックを実装します。以下のように電話番号の有効性をチェックし、無効な場合にメッセージを表示するコードを追加します。

```swift
import SwiftUI
import PhoneNumberKit

struct ContentView: View {
    @State private var rawPhoneNumber: String = ""
    @State private var isPhoneNumberValid: Bool = true

    let phoneNumberDriver = PhoneNumberDriver()

    var body: some View {
        VStack {
            TextField("電話番号を入力してください", text: $rawPhoneNumber)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .padding()

            Button(action: validatePhoneNumber) {
                Text("電話番号を確認")
            }
            .padding()

            if !isPhoneNumberValid {
                Text("有効な電話番号ではないようです。正しい電話番号を入力してください。（仮文言）")
                    .foregroundColor(.red)
                    .padding()
            }
        }
        .padding()
    }

    private func validatePhoneNumber() {
        do {
            _ = try phoneNumberDriver.formatRawPhoneNumberAsInternational(country: .japan, rawPhoneNumber: rawPhoneNumber)
            isPhoneNumberValid = true
        } catch {
            isPhoneNumberValid = false
        }
    }
}

public struct Country {
    let iso3166_1RegionCode: String
    let code: Int

    static let japan = Country(iso3166_1RegionCode: "JP", code: 81)
}

public protocol PhoneNumberDriverProtocol: AnyObject, Sendable {
    var allCountries: [Country] { get throws }
    func formatAsPartial(country: Country, rawPhoneNumber: String) -> String
    func formatAsInternational(country: Country, partialFormattedPhoneNumber: String) throws -> String
    func formatRawPhoneNumberAsInternational(country: Country, rawPhoneNumber: String) throws -> String
}

public final class PhoneNumberDriver: PhoneNumberDriverProtocol {
    private nonisolated(unsafe) let phoneNumberKit = PhoneNumberKit()

    public init() {
        OSLogger.initLog()
    }

    deinit {
        OSLogger.deinitLog()
    }

    public var allCountries: [Country] {
        get throws {
            try phoneNumberKit.allCountries().map { iso3166_1RegionCode in
                guard let countryCode = phoneNumberKit.countryCode(for: iso3166_1RegionCode) else {
                    OSLogger.errorLog(AppError.customError())
                    throw AppError.customError()
                }
                return Country(iso3166_1RegionCode: iso3166_1RegionCode, code: Int(countryCode))
            }
        }
    }

    public func formatAsPartial(country: Country, rawPhoneNumber: String) -> String {
        PartialFormatter(phoneNumberKit: phoneNumberKit, defaultRegion: country.iso3166_1RegionCode, withPrefix: false).formatPartial(rawPhoneNumber)
    }

    public func formatAsInternational(country: Country, partialFormattedPhoneNumber: String) throws -> String {
        do {
            let parsedNumber = try phoneNumberKit.parse(partialFormattedPhoneNumber, withRegion: country.iso3166_1RegionCode)
            return phoneNumberKit.format(parsedNumber, toType: .e164, withPrefix: true)
        } catch {
            OSLogger.errorLog(error.toAppError)
            throw error
        }
    }

    public func formatRawPhoneNumberAsInternational(country: Country, rawPhoneNumber: String) throws -> String {
        let partialFormattedPhoneNumber = self.formatAsPartial(country: country, rawPhoneNumber: rawPhoneNumber)
        return try self.formatAsInternational(country: country, partialFormattedPhoneNumber: partialFormattedPhoneNumber)
    }
}

// 必要に応じて OSLogger と AppError を定義してください。
struct OSLogger {
    static func initLog() {}
    static func deinitLog() {}
    static func errorLog(_ error: Error) {}
}

struct AppError: Error {
    static func customError() -> AppError {
        return AppError()
    }
}

// 必要に応じて PartialFormatter と PhoneNumberKit を定義してください。
struct PartialFormatter {
    let phoneNumberKit: PhoneNumberKit
    let defaultRegion: String
    let withPrefix: Bool

    func formatPartial(_ rawPhoneNumber: String) -> String {
        // 仮の実装
        return rawPhoneNumber
    }
}

class PhoneNumberKit {
    func parse(_ phoneNumber: String, withRegion region: String) throws -> PhoneNumber {
        // 仮の実装
        return PhoneNumber()
    }

    func format(_ phoneNumber: PhoneNumber, toType type: PhoneNumberFormat, withPrefix: Bool) -> String {
        // 仮の実装
        return "+819012345678"
    }

    func allCountries() throws -> [String] {
        // 仮の実装
        return ["JP"]
    }

    func countryCode(for regionCode: String) -> Int? {
        // 仮の実装
        return 81
    }
}

struct PhoneNumber {}

enum PhoneNumberFormat {
    case e164
}
```

このコードでは、ユーザーが電話番号を入力し、ボタンをクリックして有効性を確認します。電話番号が無効な場合は、メッセージを表示します。

---

## 👤 User
*2024-07-19 13:15:57*

isPhoneNumberValidの初期状態をfalseにしたいんだ

---

## 🤖 Assistant
*2024-07-19 13:16:22*

`isPhoneNumberValid`の初期状態を`false`に変更し、`rawPhoneNumber`の入力時に電話番号の有効性を検証してメッセージを表示するように調整します。

以下は修正後のコードです：

```swift
import SwiftUI
import PhoneNumberKit

struct ContentView: View {
    @State private var rawPhoneNumber: String = ""
    @State private var isPhoneNumberValid: Bool = false

    let phoneNumberDriver = PhoneNumberDriver()

    var body: some View {
        VStack {
            TextField("電話番号を入力してください", text: $rawPhoneNumber, onCommit: validatePhoneNumber)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .padding()

            Button(action: validatePhoneNumber) {
                Text("電話番号を確認")
            }
            .padding()

            if !isPhoneNumberValid {
                Text("有効な電話番号ではないようです。正しい電話番号を入力してください。（仮文言）")
                    .foregroundColor(.red)
                    .padding()
            }
        }
        .padding()
    }

    private func validatePhoneNumber() {
        do {
            _ = try phoneNumberDriver.formatRawPhoneNumberAsInternational(country: .japan, rawPhoneNumber: rawPhoneNumber)
            isPhoneNumberValid = true
        } catch {
            isPhoneNumberValid = false
        }
    }
}

public struct Country {
    let iso3166_1RegionCode: String
    let code: Int

    static let japan = Country(iso3166_1RegionCode: "JP", code: 81)
}

public protocol PhoneNumberDriverProtocol: AnyObject, Sendable {
    var allCountries: [Country] { get throws }
    func formatAsPartial(country: Country, rawPhoneNumber: String) -> String
    func formatAsInternational(country: Country, partialFormattedPhoneNumber: String) throws -> String
    func formatRawPhoneNumberAsInternational(country: Country, rawPhoneNumber: String) throws -> String
}

public final class PhoneNumberDriver: PhoneNumberDriverProtocol {
    private nonisolated(unsafe) let phoneNumberKit = PhoneNumberKit()

    public init() {
        OSLogger.initLog()
    }

    deinit {
        OSLogger.deinitLog()
    }

    public var allCountries: [Country] {
        get throws {
            try phoneNumberKit.allCountries().map { iso3166_1RegionCode in
                guard let countryCode = phoneNumberKit.countryCode(for: iso3166_1RegionCode) else {
                    OSLogger.errorLog(AppError.customError())
                    throw AppError.customError()
                }
                return Country(iso3166_1RegionCode: iso3166_1RegionCode, code: Int(countryCode))
            }
        }
    }

    public func formatAsPartial(country: Country, rawPhoneNumber: String) -> String {
        PartialFormatter(phoneNumberKit: phoneNumberKit, defaultRegion: country.iso3166_1RegionCode, withPrefix: false).formatPartial(rawPhoneNumber)
    }

    public func formatAsInternational(country: Country, partialFormattedPhoneNumber: String) throws -> String {
        do {
            let parsedNumber = try phoneNumberKit.parse(partialFormattedPhoneNumber, withRegion: country.iso3166_1RegionCode)
            return phoneNumberKit.format(parsedNumber, toType: .e164, withPrefix: true)
        } catch {
            OSLogger.errorLog(error.toAppError)
            throw error
        }
    }

    public func formatRawPhoneNumberAsInternational(country: Country, rawPhoneNumber: String) throws -> String {
        let partialFormattedPhoneNumber = self.formatAsPartial(country: country, rawPhoneNumber: rawPhoneNumber)
        return try self.formatAsInternational(country: country, partialFormattedPhoneNumber: partialFormattedPhoneNumber)
    }
}

// 必要に応じて OSLogger と AppError を定義してください。
struct OSLogger {
    static func initLog() {}
    static func deinitLog() {}
    static func errorLog(_ error: Error) {}
}

struct AppError: Error {
    static func customError() -> AppError {
        return AppError()
    }
}

// 必要に応じて PartialFormatter と PhoneNumberKit を定義してください。
struct PartialFormatter {
    let phoneNumberKit: PhoneNumberKit
    let defaultRegion: String
    let withPrefix: Bool

    func formatPartial(_ rawPhoneNumber: String) -> String {
        // 仮の実装
        return rawPhoneNumber
    }
}

class PhoneNumberKit {
    func parse(_ phoneNumber: String, withRegion region: String) throws -> PhoneNumber {
        // 仮の実装
        return PhoneNumber()
    }

    func format(_ phoneNumber: PhoneNumber, toType type: PhoneNumberFormat, withPrefix: Bool) -> String {
        // 仮の実装
        return "+819012345678"
    }

    func allCountries() throws -> [String] {
        // 仮の実装
        return ["JP"]
    }

    func countryCode(for regionCode: String) -> Int? {
        // 仮の実装
        return 81
    }
}

struct PhoneNumber {}

enum PhoneNumberFormat {
    case e164
}
```

このコードでは、`isPhoneNumberValid`の初期値を`false`に設定し、ユーザーが電話番号を入力した後、または「電話番号を確認」ボタンを押したときに有効性を検証します。電話番号が無効な場合、メッセージが表示されます。

---

## 👤 User
*2024-07-19 13:16:26*

こうするとこの画面を表示したタイミングでこのアラートが表示されてしまう

---

## 🤖 Assistant
*2024-07-19 13:16:51*

`isPhoneNumberValid`の初期状態を`false`にする場合、画面を表示したタイミングでエラーメッセージが表示されないようにするには、最初に検証を行った後にのみエラーメッセージを表示するロジックを追加します。

これを実現するために、新しい状態変数`hasAttemptedValidation`を追加し、最初の検証が行われたかどうかを追跡します。

以下の修正されたコードを参考にしてください：

```swift
import SwiftUI
import PhoneNumberKit

struct ContentView: View {
    @State private var rawPhoneNumber: String = ""
    @State private var isPhoneNumberValid: Bool = false
    @State private var hasAttemptedValidation: Bool = false

    let phoneNumberDriver = PhoneNumberDriver()

    var body: some View {
        VStack {
            TextField("電話番号を入力してください", text: $rawPhoneNumber, onCommit: validatePhoneNumber)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .padding()

            Button(action: validatePhoneNumber) {
                Text("電話番号を確認")
            }
            .padding()

            if hasAttemptedValidation && !isPhoneNumberValid {
                Text("有効な電話番号ではないようです。正しい電話番号を入力してください。（仮文言）")
                    .foregroundColor(.red)
                    .padding()
            }
        }
        .padding()
    }

    private func validatePhoneNumber() {
        hasAttemptedValidation = true
        do {
            _ = try phoneNumberDriver.formatRawPhoneNumberAsInternational(country: .japan, rawPhoneNumber: rawPhoneNumber)
            isPhoneNumberValid = true
        } catch {
            isPhoneNumberValid = false
        }
    }
}

public struct Country {
    let iso3166_1RegionCode: String
    let code: Int

    static let japan = Country(iso3166_1RegionCode: "JP", code: 81)
}

public protocol PhoneNumberDriverProtocol: AnyObject, Sendable {
    var allCountries: [Country] { get throws }
    func formatAsPartial(country: Country, rawPhoneNumber: String) -> String
    func formatAsInternational(country: Country, partialFormattedPhoneNumber: String) throws -> String
    func formatRawPhoneNumberAsInternational(country: Country, rawPhoneNumber: String) throws -> String
}

public final class PhoneNumberDriver: PhoneNumberDriverProtocol {
    private nonisolated(unsafe) let phoneNumberKit = PhoneNumberKit()

    public init() {
        OSLogger.initLog()
    }

    deinit {
        OSLogger.deinitLog()
    }

    public var allCountries: [Country] {
        get throws {
            try phoneNumberKit.allCountries().map { iso3166_1RegionCode in
                guard let countryCode = phoneNumberKit.countryCode(for: iso3166_1RegionCode) else {
                    OSLogger.errorLog(AppError.customError())
                    throw AppError.customError()
                }
                return Country(iso3166_1RegionCode: iso3166_1RegionCode, code: Int(countryCode))
            }
        }
    }

    public func formatAsPartial(country: Country, rawPhoneNumber: String) -> String {
        PartialFormatter(phoneNumberKit: phoneNumberKit, defaultRegion: country.iso3166_1RegionCode, withPrefix: false).formatPartial(rawPhoneNumber)
    }

    public func formatAsInternational(country: Country, partialFormattedPhoneNumber: String) throws -> String {
        do {
            let parsedNumber = try phoneNumberKit.parse(partialFormattedPhoneNumber, withRegion: country.iso3166_1RegionCode)
            return phoneNumberKit.format(parsedNumber, toType: .e164, withPrefix: true)
        } catch {
            OSLogger.errorLog(error.toAppError)
            throw error
        }
    }

    public func formatRawPhoneNumberAsInternational(country: Country, rawPhoneNumber: String) throws -> String {
        let partialFormattedPhoneNumber = self.formatAsPartial(country: country, rawPhoneNumber: rawPhoneNumber)
        return try self.formatAsInternational(country: country, partialFormattedPhoneNumber: partialFormattedPhoneNumber)
    }
}

// 必要に応じて OSLogger と AppError を定義してください。
struct OSLogger {
    static func initLog() {}
    static func deinitLog() {}
    static func errorLog(_ error: Error) {}
}

struct AppError: Error {
    static func customError() -> AppError {
        return AppError()
    }
}

// 必要に応じて PartialFormatter と PhoneNumberKit を定義してください。
struct PartialFormatter {
    let phoneNumberKit: PhoneNumberKit
    let defaultRegion: String
    let withPrefix: Bool

    func formatPartial(_ rawPhoneNumber: String) -> String {
        // 仮の実装
        return rawPhoneNumber
    }
}

class PhoneNumberKit {
    func parse(_ phoneNumber: String, withRegion region: String) throws -> PhoneNumber {
        // 仮の実装
        return PhoneNumber()
    }

    func format(_ phoneNumber: PhoneNumber, toType type: PhoneNumberFormat, withPrefix: Bool) -> String {
        // 仮の実装
        return "+819012345678"
    }

    func allCountries() throws -> [String] {
        // 仮の実装
        return ["JP"]
    }

    func countryCode(for regionCode: String) -> Int? {
        // 仮の実装
        return 81
    }
}

struct PhoneNumber {}

enum PhoneNumberFormat {
    case e164
}
```

このコードでは、`hasAttemptedValidation`という新しい状態変数を追加し、検証が実行されたかどうかを追跡します。これにより、初回の画面表示時にはエラーメッセージが表示されず、ユーザーが電話番号を検証した後にのみエラーメッセージが表示されるようになります。

---
