# Phone Number Struct Definition

日付: 2024-07-22

---

## 👤 ユーザー
*2024/7/22 17:52:52*

public struct PhoneNumber {} を定義して、そこに生の値とバリデーションした値を持ちたい

@MainActor
final class PhoneNumberInputPresenter&lt;Dependency: PhoneNumberInputPresenterDependency&gt;: ObservableObject {
    @Published var rawPhoneNumber: String = ""
    @Published private(set) var isValidPhoneNumber: Bool = false
    @Published var showConfirmationCodeInput: Bool = false
    @Published private(set) var showInvalidMessage: Bool = false

    /// 内部のみで使用
    @Published private var validatedPhoneNumber: String?

    private let dependency: Dependency

    init(dependency: Dependency) {
        dependency.logDriver.initLog()

        self.dependency = dependency

        // 電話番号のフォーマット
        $rawPhoneNumber
            .debounce(for: 0.2, scheduler: RunLoop.main) // ユーザー入力後、少し待機する
            .removeDuplicates() // 重複値を削除
            .map { [weak self] rawPhoneNumber in
                // 国際電話番号に変換できない形式であれば nil とする
                try? self?.dependency.phoneNumberDriver.formatRawPhoneNumberAsInternational(country: .japan, rawPhoneNumber: rawPhoneNumber)
            }
            .assign(to: &$validatedPhoneNumber)

        // 電話番号のバリデーションのフラグの切り替え
        $validatedPhoneNumber
            .map { $0.isNotNil }
            .assign(to: &$isValidPhoneNumber)

        // 不正な電話番号入力メッセージの表示の切り替え
        $rawPhoneNumber
            .combineLatest($isValidPhoneNumber)
            .map { rawPhoneNumber, isValidPhoneNumber in
                // ワンライナーでかけるが混乱するので switch 文で書いている
                switch (rawPhoneNumber.isEmpty, isValidPhoneNumber) {
                case (true, true): // 電話番号が未入力、電話番号が有効
                    false // 電話番号が未入力のため消す

                case (true, false): // 電話番号が未入力、電話番号が不正
                    false // 電話番号が未入力のため消す

                case (false, true): // 電話番号が入力済み、電話番号が有効
                    false // 電話番号が有効なため消す

                case (false, false): // 電話番号が入力済み、電話番号が不正
                    true // 電話番号が無効なため表示する
                }
            }
            .assign(to: &$showInvalidMessage)
    }
}

---

## 🤖 アシスタント
*2024/7/22 17:53:03*

`PhoneNumber` 構造体を定義して、生の値とバリデーションした値を持つようにするために、以下のように実装できます。また、`PhoneNumberInputPresenter` クラスの中でこの `PhoneNumber` 構造体を使用するようにします。

まず、`PhoneNumber` 構造体を定義します。この構造体は生の電話番号と、バリデーションされた電話番号を保持します。

```swift
public struct PhoneNumber {
    let rawValue: String
    let validatedValue: String?

    init(rawValue: String, validatedValue: String?) {
        self.rawValue = rawValue
        self.validatedValue = validatedValue
    }

    var isValid: Bool {
        return validatedValue != nil
    }
}
```

次に、`PhoneNumberInputPresenter` クラスを更新して、この `PhoneNumber` 構造体を使用するようにします。

```swift
@MainActor
final class PhoneNumberInputPresenter<Dependency: PhoneNumberInputPresenterDependency>: ObservableObject {
    @Published var rawPhoneNumber: String = ""
    @Published private(set) var isValidPhoneNumber: Bool = false
    @Published var showConfirmationCodeInput: Bool = false
    @Published private(set) var showInvalidMessage: Bool = false

    @Published private var phoneNumber: PhoneNumber? {
        didSet {
            isValidPhoneNumber = phoneNumber?.isValid ?? false
        }
    }

    private let dependency: Dependency

    init(dependency: Dependency) {
        dependency.logDriver.initLog()

        self.dependency = dependency

        // 電話番号のフォーマットとバリデーション
        $rawPhoneNumber
            .debounce(for: 0.2, scheduler: RunLoop.main) // ユーザー入力後、少し待機する
            .removeDuplicates() // 重複値を削除
            .map { [weak self] rawPhoneNumber in
                guard let self = self else { return nil }
                let validatedValue = try? self.dependency.phoneNumberDriver.formatRawPhoneNumberAsInternational(country: .japan, rawPhoneNumber: rawPhoneNumber)
                return PhoneNumber(rawValue: rawPhoneNumber, validatedValue: validatedValue)
            }
            .assign(to: &$phoneNumber)

        // 不正な電話番号入力メッセージの表示の切り替え
        $rawPhoneNumber
            .combineLatest($isValidPhoneNumber)
            .map { rawPhoneNumber, isValidPhoneNumber in
                // ワンライナーでかけるが混乱するので switch 文で書いている
                switch (rawPhoneNumber.isEmpty, isValidPhoneNumber) {
                case (true, true): // 電話番号が未入力、電話番号が有効
                    false // 電話番号が未入力のため消す

                case (true, false): // 電話番号が未入力、電話番号が不正
                    false // 電話番号が未入力のため消す

                case (false, true): // 電話番号が入力済み、電話番号が有効
                    false // 電話番号が有効なため消す

                case (false, false): // 電話番号が入力済み、電話番号が不正
                    true // 電話番号が無効なため表示する
                }
            }
            .assign(to: &$showInvalidMessage)
    }
}
```

このようにすることで、`PhoneNumber` 構造体を使用して生の電話番号とバリデーション済みの電話番号を管理し、`PhoneNumberInputPresenter` クラスのロジックを整理しやすくします。また、`isValidPhoneNumber` プロパティを `phoneNumber` の `isValid` プロパティに基づいて更新するようにしました。

---
