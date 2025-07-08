# Function Name Update

日付: 2023-09-01

---

## 👤 ユーザー
*2023/09/01 16:12:00*

関数名がアップデートのチェックだけではなくめんてんす状態の有無もチェックしているので関数名を変更して欲しい

func checkMinimumRequiredVersion() async {
        guard !shouldShowLogin else {
            return
        }

        do {
            let newAppInfo: AppInfo = try await cloudStorageManager.downloadAndParseJson(key: Constants.S3Paths.appConfigJsonFile)
            // メインテステータスをチェックする
            guard !newAppInfo.maintenanceInfo.isMaintenance else {
                appError = .maintenanceError(title: newAppInfo.maintenanceInfo.alertTitle, message: newAppInfo.maintenanceInfo.alertMessage)
                shouldShowMaintenanceAlert = true
                return
            }

            // アップデートステータスをチェックする
            let currentVersion = try Version(deviceInfoManager.appVersion)
            let newVersion = try Version(newAppInfo.appUpdateInfo.minimumRequiredAppVersion)

            LoggerContainer.debugLog("currentVersion: \(currentVersion), newVersion: \(newVersion)")

            if currentVersion &lt; newVersion {
                appError = .appUpdate(updateUrlString: newAppInfo.appUpdateInfo.updateUrl)
                shouldShowUpdateAlert = true
            }
        } catch {
            LoggerContainer.logError(error.toAppError)
        }
    }

---

## 🤖 アシスタント
*2023/09/01 16:12:17*

関数がアップデートのチェックとメンテナンス状態のチェックを行っているので、関数名を変更することで、関数が行っているアクションが明確になります。

上記の関数には、2つの主なチェックがあります。

1. メンテナンス状態のチェック
2. 必要な最小バージョンのチェック

この2つのチェックを行っているので、関数名はそれを反映するものが良いでしょう。以下のように変更を提案します。

```swift
func checkMaintenanceAndVersionStatus() async {
    ...
}
```

この名前は、関数が行っている2つの主要なアクションを反映しており、より明確です。

---
