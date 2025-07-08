# SwiftUI Date Formatting

Date: 2024-08-21

---

## 👤 User
*2024-08-21 19:17:26*

public struct MaintenanceInfo: Sendable, Hashable, Equatable {
    public let startTime: Date
    public let endTime: Date
    public let title: String
    public let description: String
    public let imageUrl: URL
    public let detailUrl: URL
    
    public init(startTime: Date, endTime: Date, title: String, description: String, imageUrl: URL, detailUrl: URL) {
        self.startTime = startTime
        self.endTime = endTime
        self.title = title
        self.description = description
        self.imageUrl = imageUrl
        self.detailUrl = detailUrl
    }
}

SwiftUIで以下のような表記にしたい
2024年7月31日23時00分〜2024年8月1日0時00分

---

## 🤖 Assistant
*2024-08-21 19:17:36*

この日付表示をSwiftUIで行うためには、`DateFormatter`を使って適切な形式にフォーマットします。以下はその実装例です。

```swift
import SwiftUI

struct MaintenanceView: View {
    let maintenanceInfo: MaintenanceInfo

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(maintenanceInfo.title)
                .font(.headline)
            
            Text(formattedDateRange)
                .font(.subheadline)
            
            Text(maintenanceInfo.description)
                .font(.body)
        }
        .padding()
    }

    private var formattedDateRange: String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy年M月d日H時mm分"
        
        let startDateString = formatter.string(from: maintenanceInfo.startTime)
        let endDateString = formatter.string(from: maintenanceInfo.endTime)
        
        return "\(startDateString)〜\(endDateString)"
    }
}

struct MaintenanceView_Previews: PreviewProvider {
    static var previews: some View {
        MaintenanceView(maintenanceInfo: MaintenanceInfo(
            startTime: Date(),
            endTime: Calendar.current.date(byAdding: .hour, value: 1, to: Date())!,
            title: "メンテナンスのお知らせ",
            description: "このメンテナンスにより、サービスの一時停止が発生します。",
            imageUrl: URL(string: "https://example.com/image.png")!,
            detailUrl: URL(string: "https://example.com/detail")!
        ))
    }
}
```

このコードでは、`MaintenanceInfo`構造体のインスタンスを受け取って、その日付範囲を「2024年7月31日23時00分〜2024年8月1日0時00分」の形式で表示します。

- `DateFormatter`を使用して`startTime`と`endTime`をフォーマットしています。
- `formattedDateRange`プロパティで、フォーマットされた日付を連結して一つの文字列として返します。

これで、SwiftUIビュー内で指定されたフォーマットで日付が表示されます。

---
