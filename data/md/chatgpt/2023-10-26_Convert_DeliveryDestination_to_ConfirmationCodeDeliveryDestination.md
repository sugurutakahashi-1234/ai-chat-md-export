# Convert DeliveryDestination to ConfirmationCodeDeliveryDestination

Date: 2023-10-26

---

## 👤 User
*2023-10-26 11:48:36*

ConfirmationCodeDeliveryDestination の extension の init で DeliveryDestination を引数にとって変換する処理を書いて欲しい。
sms を phoneNumber、emailをemailAddress にしてほしい。それ以外はthrowするようにしてほしい。
enum ConfirmationCodeDeliveryDestination {
    case emailAddress
    case phoneNumber
}

public typealias Destination = String

/// Destination to where an item (e.g., confirmation code) was delivered
public enum DeliveryDestination {

    /// Email destination with optional associated value containing the email info
    case email(Destination?)

    /// Phone destination with optional associated value containing the phone number info
    case phone(Destination?)

    /// SMS destination with optional associated value containing the number info
    case sms(Destination?)

    /// Unknown destination with optional associated value destination detail
    case unknown(Destination?)
}

---

## 🤖 Assistant
*2023-10-26 11:49:05*

To convert from `DeliveryDestination` to `ConfirmationCodeDeliveryDestination`, we need to handle different cases and throw an error if the provided `DeliveryDestination` is not among the allowed cases (`sms` or `email`). Here's the implementation:

```swift
enum ConversionError: Error {
    case unsupportedDestination
}

extension ConfirmationCodeDeliveryDestination {
    init(from deliveryDestination: DeliveryDestination) throws {
        switch deliveryDestination {
        case .email(let emailAddress):
            guard let _ = emailAddress else {
                throw ConversionError.unsupportedDestination
            }
            self = .emailAddress
        case .sms(let phoneNumber):
            guard let _ = phoneNumber else {
                throw ConversionError.unsupportedDestination
            }
            self = .phoneNumber
        default:
            throw ConversionError.unsupportedDestination
        }
    }
}

// Usage:
do {
    let deliveryDest: DeliveryDestination = .sms("123-456-7890")
    let confirmationDest = try ConfirmationCodeDeliveryDestination(from: deliveryDest)
    print(confirmationDest)
} catch {
    print("Error: \(error)")
}
```

With the above implementation:

- If the provided `DeliveryDestination` is `.email` with an email address, it will be converted to `.emailAddress` in `ConfirmationCodeDeliveryDestination`.
  
- If the provided `DeliveryDestination` is `.sms` with a phone number, it will be converted to `.phoneNumber` in `ConfirmationCodeDeliveryDestination`.

- In any other case or if the associated value is nil, it throws the `unsupportedDestination` error.

---

## 👤 User
*2023-10-26 12:05:44*

日本語にしてほしい。また、Destinationがnilの場合は空文字を入れて欲しい

enum ConfirmationCodeDeliveryDestination {
    case emailAddress(destination: String)
    case phoneNumber(destination: String)
}

---

## 🤖 Assistant
*2023-10-26 12:06:15*

了解しました。以下のように`DeliveryDestination`から`ConfirmationCodeDeliveryDestination`への変換を行う拡張を作成します。

Destinationが`nil`の場合、空文字を使うように指定されていますので、それに従って変換します。

```swift
enum ConversionError: Error {
    case 未サポートの宛先
}

extension ConfirmationCodeDeliveryDestination {
    init(from deliveryDestination: DeliveryDestination) throws {
        switch deliveryDestination {
        case .email(let emailAddress):
            self = .emailAddress(destination: emailAddress ?? "")
        case .sms(let phoneNumber):
            self = .phoneNumber(destination: phoneNumber ?? "")
        default:
            throw ConversionError.未サポートの宛先
        }
    }
}

// 使用例:
do {
    let deliveryDest: DeliveryDestination = .sms(nil)
    let confirmationDest = try ConfirmationCodeDeliveryDestination(from: deliveryDest)
    print(confirmationDest)
} catch {
    print("エラー: \(error)")
}
```

上記の実装により:

- 与えられた`DeliveryDestination`が`.email`の場合、それを`ConfirmationCodeDeliveryDestination`の`.emailAddress`に変換します。
  
- 与えられた`DeliveryDestination`が`.sms`の場合、それを`ConfirmationCodeDeliveryDestination`の`.phoneNumber`に変換します。

- それ以外の場合、または関連する値がnilの場合、`未サポートの宛先`エラーをスローします。

---
