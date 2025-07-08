# Calibration If to If

日付: 2023-06-22

---

## 👤 ユーザー
*2023/06/22 17:44:00*

isCalibrationSettingFinished をguard文ではなくて、if文に直して欲しい

func calibrationSettingButtonTapped() {
        guard isCameraPermitted else { return }

        guard isCalibrationSettingFinished else {
            shouldShowCalibrationView = true
            showLoading = true
            return
        }
        didEndPlaySubject.send()
    }

---

## 🤖 アシスタント
*2023/06/22 17:44:21*

以下のようにif文を用いて`calibrationSettingButtonTapped()`関数を書き換えることができます。

```swift
func calibrationSettingButtonTapped() {
    if !isCameraPermitted {
        return
    }

    if !isCalibrationSettingFinished {
        shouldShowCalibrationView = true
        showLoading = true
    } else {
        didEndPlaySubject.send()
    }
}
```

この書き換えでは、`isCameraPermitted`が`false`の場合、関数はすぐにリターンします。その後、`isCalibrationSettingFinished`が`false`の場合、`shouldShowCalibrationView`と`showLoading`を`true`に設定します。そして、`isCalibrationSettingFinished`が`true`の場合には`didEndPlaySubject.send()`を呼び出します。このように、guard文の代わりにif文を使用することで同様の結果を得ることができます。

---
