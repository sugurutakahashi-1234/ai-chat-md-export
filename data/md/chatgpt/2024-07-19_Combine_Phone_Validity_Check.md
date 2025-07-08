# Combine Phone Validity Check

日付: 2024-07-19

---

## 👤 ユーザー
*2024/7/19 13:20:56*

$rawPhoneNumber
            .combineLatest($isValidPhoneNumber)
            .map { rawPhoneNumber, isValidPhoneNumber in
                switch (rawPhoneNumber.isEmpty, isValidPhoneNumber) {
                    
                case (_, _):
                    &lt;#code#&gt;
                }
            }
            .assign(to: &$isHiddenInvalidMessage)

---

## 🤖 アシスタント
*2024/7/19 13:21:03*

To handle the combination of `$rawPhoneNumber` and `$isValidPhoneNumber` and update the state of `$isHiddenInvalidMessage`, you can fill in the switch statement to cover different cases based on whether the phone number is empty and whether it is valid. Here's an example implementation:

```swift
$rawPhoneNumber
    .combineLatest($isValidPhoneNumber)
    .map { rawPhoneNumber, isValidPhoneNumber in
        switch (rawPhoneNumber.isEmpty, isValidPhoneNumber) {
        case (true, _):
            // If the phone number is empty, hide the invalid message
            return true
        case (_, true):
            // If the phone number is not empty and valid, hide the invalid message
            return true
        case (_, false):
            // If the phone number is not empty and invalid, show the invalid message
            return false
        }
    }
    .assign(to: &$isHiddenInvalidMessage)
```

In this implementation:
- If `rawPhoneNumber` is empty, the invalid message is hidden.
- If `rawPhoneNumber` is not empty and the phone number is valid, the invalid message is hidden.
- If `rawPhoneNumber` is not empty and the phone number is invalid, the invalid message is shown.

---
