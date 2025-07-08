# Binding isValid Property

Date: 2024-08-27

---

## 👤 User
*2024-08-27 19:32:34*

@Published var nickname: String = ""
    @Published var mailAddress: String = ""
    @Published var phoneNumber: String = ""
の3つについてもisValidにバインドさせたい

final class InquiryPresenter: ObservableObject {
    @Published var nickname: String = ""
    @Published var mailAddress: String = ""
    @Published var phoneNumber: String = ""
    @Published var selectedInquiryType: InquiryType = .noSelect
    @Published var inquiryDetailText: String = ""
    @Published var showInquirySendView: Bool = false

    @Published var isValid: Bool = false
    @Published var shouldDismiss: Bool = false

    private let logDriver: any LogDriverProtocol

    init(logDriver: any LogDriverProtocol = LogDriver()) {
        self.logDriver = logDriver

        logDriver.initLog()

        $selectedInquiryType
            .combineLatest($inquiryDetailText)
            .map { selectedInquiryType, inquiryDetailText in
                selectedInquiryType != .noSelect && inquiryDetailText.isNotEmpty
            }
            .assign(to: &$isValid)
    }

---

## 🤖 Assistant
*2024-08-27 19:32:47*

To bind the `isValid` property to the validity of the `nickname`, `mailAddress`, and `phoneNumber` as well, you can update the initialization code to include those fields in the validation check. Here's the updated version of the `InquiryPresenter` class:

```swift
final class InquiryPresenter: ObservableObject {
    @Published var nickname: String = ""
    @Published var mailAddress: String = ""
    @Published var phoneNumber: String = ""
    @Published var selectedInquiryType: InquiryType = .noSelect
    @Published var inquiryDetailText: String = ""
    @Published var showInquirySendView: Bool = false

    @Published var isValid: Bool = false
    @Published var shouldDismiss: Bool = false

    private let logDriver: any LogDriverProtocol

    init(logDriver: any LogDriverProtocol = LogDriver()) {
        self.logDriver = logDriver

        logDriver.initLog()

        // Combine the validation checks for all relevant fields
        $nickname
            .combineLatest($mailAddress, $phoneNumber, $selectedInquiryType, $inquiryDetailText)
            .map { nickname, mailAddress, phoneNumber, selectedInquiryType, inquiryDetailText in
                return !nickname.isEmpty && !mailAddress.isEmpty && !phoneNumber.isEmpty &&
                       selectedInquiryType != .noSelect && inquiryDetailText.isNotEmpty
            }
            .assign(to: &$isValid)
    }
}
```

This code snippet updates the validation logic to include checks for `nickname`, `mailAddress`, and `phoneNumber`, ensuring that `isValid` will only be true when all these fields are non-empty and other conditions are met.

---

## 👤 User
*2024-08-27 19:33:10*

combineLatest は

---

## 🤖 Assistant
*2024-08-27 19:33:13*

`combineLatest` は、複数の `Publisher` の最新の値を結合し、すべての `Publisher` が値を発行するたびに

---
