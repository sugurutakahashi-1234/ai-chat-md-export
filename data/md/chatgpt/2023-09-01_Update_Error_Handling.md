# Update Error Handling

Date: 2023-09-01

---

## 👤 User
*2023-09-01 15:30:11*

こちらguard文にして階層を低くして欲しい

func updateAlertClosed(appError: AppError) {
        if case .appUpdate(let updateUrlString) = appError {
            guard let urlScheme = URL(string: updateUrlString) else {
                LoggerContainer.logError("Update url is not existed")
                return
            }
            UIApplication.shared.open(urlScheme)
        }
    }

---

## 🤖 Assistant
*2023-09-01 15:30:23*

以下のように、`guard`文を用いて階層を低くできます：

```swift
func updateAlertClosed(appError: AppError) {
    guard case .appUpdate(let updateUrlString) = appError,
          let urlScheme = URL(string: updateUrlString) else {
        LoggerContainer.logError("Update url is not existed or the error type is not appUpdate")
        return
    }
    UIApplication.shared.open(urlScheme)
}
```

このようにすることで、関数の主要な動作（`UIApplication.shared.open(urlScheme)`) が一番外側にあり、それに関連しない条件やエラーハンドリングが`guard`文内にまとめられているので、コードの読みやすさが向上します。

---

## 👤 User
*2023-09-01 15:32:41*

guard 文を2つに分割して欲しい

---

## 🤖 Assistant
*2023-09-01 15:32:52*

了解しました。`guard`文を2つに分割して以下のようになります：

```swift
func updateAlertClosed(appError: AppError) {
    guard case .appUpdate(let updateUrlString) = appError else { return }

    guard let urlScheme = URL(string: updateUrlString) else {
        LoggerContainer.logError("Update url is not existed")
        return
    }

    UIApplication.shared.open(urlScheme)
}
```

このように分割することで、異なるエラーチェックの原因と対応を明確に区別できます。

---
