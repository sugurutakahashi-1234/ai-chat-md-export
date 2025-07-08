# Relative Time Formatters

日付: 2024-07-07

---

## 👤 ユーザー
*2024/07/07 12:03:36*

n分前などをSwiftでうまく表したい。DateComponentsFormatterやRelativeDateTimeFormatter などformatterをうまく活用して欲しい

---

## 🤖 アシスタント
*2024/07/07 12:03:56*

Swiftでは、`DateComponentsFormatter`や`RelativeDateTimeFormatter`を使用して、「n分前」や「n日前」のような相対的な日時表現を行うことができます。以下に具体的な例を示します。

### 使用例

1. **`DateComponentsFormatter`を使った例:**

```swift
import Foundation

func timeAgoWithDateComponentsFormatter(from date: Date) -> String {
    let formatter = DateComponentsFormatter()
    formatter.unitsStyle = .full
    formatter.allowedUnits = [.minute, .hour, .day, .weekOfMonth, .month, .year]
    formatter.maximumUnitCount = 1
    
    let now = Date()
    let interval = now.timeIntervalSince(date)
    
    return formatter.string(from: interval) ?? "今"
}

// 使用例
let pastDate = Calendar.current.date(byAdding: .minute, value: -10, to: Date())!
print(timeAgoWithDateComponentsFormatter(from: pastDate)) // 10分前
```

2. **`RelativeDateTimeFormatter`を使った例:**

```swift
import Foundation

func timeAgoWithRelativeDateTimeFormatter(from date: Date) -> String {
    let formatter = RelativeDateTimeFormatter()
    formatter.unitsStyle = .full
    
    return formatter.localizedString(for: date, relativeTo: Date())
}

// 使用例
let pastDate = Calendar.current.date(byAdding: .minute, value: -10, to: Date())!
print(timeAgoWithRelativeDateTimeFormatter(from: pastDate)) // 10分前
```

### 詳細な説明

- **`DateComponentsFormatter`**:
  - `unitsStyle`: 表示形式を指定します（例：`.full`, `.abbreviated`, `.short`など）。
  - `allowedUnits`: 使用する単位を指定します。例では、分、時間、日、週、月、年を許可しています。
  - `maximumUnitCount`: 表示する最大の単位数を指定します。例では、1つの単位（例：10分）を表示します。

- **`RelativeDateTimeFormatter`**:
  - `unitsStyle`: 表示形式を指定します。`DateComponentsFormatter`と同様に、`.full`, `.abbreviated`, `.short`などを使用できます。

これらのフォーマッタを使用することで、相対的な日時表現を簡単に行うことができます。それぞれのフォーマッタには適用できる状況があるため、使い分けることが重要です。例えば、`RelativeDateTimeFormatter`は自然言語に近い表現を行うのに対して、`DateComponentsFormatter`はより細かいカスタマイズが可能です。

---

## 👤 ユーザー
*2024/07/07 12:04:15*

日本語でうまく表現したい。どちらがいいか？

---

## 🤖 アシスタント
*2024/07/07 12:04:31*

日本語での相対的な日時表現を行う場合、`RelativeDateTimeFormatter`の方が自然な日本語表現を提供してくれます。`DateComponentsFormatter`は特定の単位を表示するのに優れていますが、日本語での自然な表現はやや難しい場合があります。

以下に、日本語での相対的な日時表現を行うための具体例を示します。

### `RelativeDateTimeFormatter`を使った日本語表現

```swift
import Foundation

func timeAgoWithRelativeDateTimeFormatter(from date: Date) -> String {
    let formatter = RelativeDateTimeFormatter()
    formatter.unitsStyle = .full
    formatter.locale = Locale(identifier: "ja_JP")
    
    return formatter.localizedString(for: date, relativeTo: Date())
}

// 使用例
let pastDate = Calendar.current.date(byAdding: .minute, value: -10, to: Date())!
print(timeAgoWithRelativeDateTimeFormatter(from: pastDate)) // 約10分前
```

この例では、`RelativeDateTimeFormatter`の`locale`を日本語（"ja_JP"）に設定することで、日本語での自然な相対的日時表現を得ることができます。

### `DateComponentsFormatter`を使った日本語表現

もし特定のフォーマットが必要で、より細かい制御が必要な場合には、`DateComponentsFormatter`を使用することもできます。ただし、こちらの場合は手動で日本語の単位を設定する必要があります。

```swift
import Foundation

func timeAgoWithDateComponentsFormatter(from date: Date) -> String {
    let formatter = DateComponentsFormatter()
    formatter.unitsStyle = .full
    formatter.allowedUnits = [.minute, .hour, .day, .weekOfMonth, .month, .year]
    formatter.maximumUnitCount = 1
    formatter.locale = Locale(identifier: "ja_JP")
    
    let now = Date()
    let interval = now.timeIntervalSince(date)
    
    return formatter.string(from: interval) ?? "今"
}

// 使用例
let pastDate = Calendar.current.date(byAdding: .minute, value: -10, to: Date())!
print(timeAgoWithDateComponentsFormatter(from: pastDate)) // 10分
```

### 結論

日本語で自然な相対的日時表現を行う場合、`RelativeDateTimeFormatter`を使用するのが最も簡単で効果的です。`RelativeDateTimeFormatter`はロケールに基づいて自動的に適切な日本語の表現を提供してくれるため、特に日本語での表現を手動で調整する必要がありません。

---

## 👤 ユーザー
*2024/07/07 12:05:04*

RelativeDateTimeFormatterでいろいろな表現の例を確認できるような、SwiftUIのプレビューで確認できるコードを書いて欲しい。

---

## 🤖 アシスタント
*2024/07/07 12:05:23*

SwiftUIで`RelativeDateTimeFormatter`を使用してさまざまな相対的な日時表現を確認できるコードを以下に示します。このコードを使用すると、SwiftUIのプレビューで日時表現を簡単に確認することができます。

```swift
import SwiftUI

struct RelativeTimeView: View {
    let dates: [Date]

    var body: some View {
        List(dates, id: \.self) { date in
            Text(relativeTimeString(for: date))
                .padding()
        }
    }

    func relativeTimeString(for date: Date) -> String {
        let formatter = RelativeDateTimeFormatter()
        formatter.unitsStyle = .full
        formatter.locale = Locale(identifier: "ja_JP")
        
        return formatter.localizedString(for: date, relativeTo: Date())
    }
}

struct RelativeTimeView_Previews: PreviewProvider {
    static var previews: some View {
        RelativeTimeView(dates: [
            Calendar.current.date(byAdding: .minute, value: -10, to: Date())!,
            Calendar.current.date(byAdding: .hour, value: -2, to: Date())!,
            Calendar.current.date(byAdding: .day, value: -1, to: Date())!,
            Calendar.current.date(byAdding: .weekOfMonth, value: -1, to: Date())!,
            Calendar.current.date(byAdding: .month, value: -3, to: Date())!,
            Calendar.current.date(byAdding: .year, value: -1, to: Date())!
        ])
    }
}
```

### 詳細な説明

1. **RelativeTimeView構造体**:
   - `dates`という配列を受け取り、それぞれの日時に対して相対的な時間表現をリストで表示します。
   - `relativeTimeString(for:)`メソッドを使って、各日時に対する相対的な時間表現を生成します。

2. **relativeTimeString(for:)メソッド**:
   - `RelativeDateTimeFormatter`を使って、指定された日時に対する相対的な時間表現を生成します。
   - ロケールを日本語（"ja_JP"）に設定して、日本語の表現を得ます。

3. **RelativeTimeView_Previews構造体**:
   - SwiftUIのプレビューでさまざまな日時表現を確認するためのサンプルデータを提供します。
   - 過去10分前、2時間前、1日前、1週間前、3ヶ月前、1年前などのサンプルデータを用意しています。

このコードをXcodeで実行すると、リスト形式でさまざまな相対的な日時表現を確認することができます。プレビューを更新することで、リアルタイムで表示される内容を確認できます。

---

## 👤 ユーザー
*2024/07/08 17:23:42*

RelativeDateTimeFormatter を使うようなDate側のextension を作成してほしい

---

## 🤖 アシスタント
*2024/07/08 17:24:11*

`RelativeDateTimeFormatter`を使用して日時の相対的な表現を返す`Date`のエクステンションを作成することができます。以下にその実装例を示します。

### Date Extension with RelativeDateTimeFormatter

```swift
import Foundation

extension Date {
    func relativeTimeDescription(localeIdentifier: String = "ja_JP") -> String {
        let formatter = RelativeDateTimeFormatter()
        formatter.unitsStyle = .full
        formatter.locale = Locale(identifier: localeIdentifier)
        
        return formatter.localizedString(for: self, relativeTo: Date())
    }
}
```

### 使用例

SwiftUIのプレビューでこのエクステンションを使用してさまざまな日時表現を確認するコードを以下に示します。

```swift
import SwiftUI

struct RelativeTimeView: View {
    let dates: [Date]

    var body: some View {
        List(dates, id: \.self) { date in
            Text(date.relativeTimeDescription())
                .padding()
        }
    }
}

struct RelativeTimeView_Previews: PreviewProvider {
    static var previews: some View {
        RelativeTimeView(dates: [
            Calendar.current.date(byAdding: .minute, value: -10, to: Date())!,
            Calendar.current.date(byAdding: .hour, value: -2, to: Date())!,
            Calendar.current.date(byAdding: .day, value: -1, to: Date())!,
            Calendar.current.date(byAdding: .weekOfMonth, value: -1, to: Date())!,
            Calendar.current.date(byAdding: .month, value: -3, to: Date())!,
            Calendar.current.date(byAdding: .year, value: -1, to: Date())!
        ])
    }
}
```

### 詳細な説明

1. **Dateエクステンション**:
   - `relativeTimeDescription(localeIdentifier:)`メソッドを追加しています。
   - デフォルトのロケールを日本語（"ja_JP"）に設定していますが、引数として他のロケールを指定することも可能です。

2. **relativeTimeDescription(localeIdentifier:)メソッド**:
   - `RelativeDateTimeFormatter`を使用して、呼び出された日時から現在までの相対的な時間を表現します。
   - `localeIdentifier`引数でロケールを指定できます（デフォルトは日本語）。

3. **RelativeTimeView構造体**:
   - 受け取った日時配列をリストで表示します。
   - `relativeTimeDescription()`メソッドを使用して、各日時の相対的な時間表現を取得します。

4. **RelativeTimeView_Previews構造体**:
   - SwiftUIのプレビューでさまざまな日時表現を確認するためのサンプルデータを提供します。

このエクステンションを使用することで、日時に対する相対的な表現を簡単に取得できるようになります。また、SwiftUIのプレビューを使用して、さまざまな日時の表現をリアルタイムで確認することができます。

---

## 👤 ユーザー
*2024/07/08 17:25:34*

Locale.preferredLanguages の先頭を使うようにしてほしい言語設定を使ってほしい。

---

## 🤖 アシスタント
*2024/07/08 17:26:02*

`Locale.preferredLanguages`の先頭の言語設定を使用して、相対的な日時表現を行うように`Date`のエクステンションを修正することができます。以下にその実装例を示します。

### Date Extension with Preferred Language Locale

```swift
import Foundation

extension Date {
    func relativeTimeDescription() -> String {
        let formatter = RelativeDateTimeFormatter()
        formatter.unitsStyle = .full
        
        // 使用するロケールを設定（デフォルトの言語設定を取得）
        if let preferredLanguage = Locale.preferredLanguages.first {
            formatter.locale = Locale(identifier: preferredLanguage)
        }
        
        return formatter.localizedString(for: self, relativeTo: Date())
    }
}
```

### 使用例

SwiftUIのプレビューでこのエクステンションを使用してさまざまな日時表現を確認するコードを以下に示します。

```swift
import SwiftUI

struct RelativeTimeView: View {
    let dates: [Date]

    var body: some View {
        List(dates, id: \.self) { date in
            Text(date.relativeTimeDescription())
                .padding()
        }
    }
}

struct RelativeTimeView_Previews: PreviewProvider {
    static var previews: some View {
        RelativeTimeView(dates: [
            Calendar.current.date(byAdding: .minute, value: -10, to: Date())!,
            Calendar.current.date(byAdding: .hour, value: -2, to: Date())!,
            Calendar.current.date(byAdding: .day, value: -1, to: Date())!,
            Calendar.current.date(byAdding: .weekOfMonth, value: -1, to: Date())!,
            Calendar.current.date(byAdding: .month, value: -3, to: Date())!,
            Calendar.current.date(byAdding: .year, value: -1, to: Date())!
        ])
    }
}
```

### 詳細な説明

1. **Dateエクステンション**:
   - `relativeTimeDescription()`メソッドを追加しています。
   - `Locale.preferredLanguages`の先頭にある言語設定を使用して`RelativeDateTimeFormatter`のロケールを設定しています。

2. **relativeTimeDescription()メソッド**:
   - `RelativeDateTimeFormatter`を使用して、呼び出された日時から現在までの相対的な時間を表現します。
   - `Locale.preferredLanguages.first`で取得したデフォルトの言語設定をロケールに設定します。

3. **RelativeTimeView構造体**:
   - 受け取った日時配列をリストで表示します。
   - `relativeTimeDescription()`メソッドを使用して、各日時の相対的な時間表現を取得します。

4. **RelativeTimeView_Previews構造体**:
   - SwiftUIのプレビューでさまざまな日時表現を確認するためのサンプルデータを提供します。

このエクステンションを使用することで、システムのデフォルト言語設定に基づいた相対的な日時表現を簡単に取得できます。また、SwiftUIのプレビューを使用して、さまざまな日時の表現をリアルタイムで確認することができます。

---
