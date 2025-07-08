# Set Date to 18 Years

Date: 2024-08-19

---

## 👤 User
*2024-08-19 17:20:22*

18年前の1月1日にしたい。
@Published var birthDay: Date = Calendar.current.date(byAdding: .year, value: -20, to: Date()) ?? Date()

---

## 🤖 Assistant
*2024-08-19 17:20:27*

`birthDay` を 18 年前の 1 月 1 日に設定するには、以下のように変更できます。

```swift
@Published var birthDay: Date = {
    var components = DateComponents()
    components.year = -18
    components.month = 1
    components.day = 1
    return Calendar.current.date(byAdding: components, to: Date()) ?? Date()
}()
```

これで `birthDay` は、現在の日付から 18 年前の 1 月 1 日の日付が設定されます。

---

## 👤 User
*2024-08-19 17:20:39*

ワンライナーで表現したい

---

## 🤖 Assistant
*2024-08-19 17:20:45*

ワンライナーで表現する場合、以下のようにできます。

```swift
@Published var birthDay: Date = Calendar.current.date(from: DateComponents(year: Calendar.current.component(.year, from: Date()) - 18, month: 1, day: 1)) ?? Date()
```

これで、`birthDay` が 18 年前の 1 月 1 日の日付に設定されます。

---
