# Scrollable Card Content Layout

日付: 2025-03-24

---

## 👤 ユーザー
*2025/03/24 23:47:51*

Cardのコンテンツを新たに追加したが、これが大きすぎて入らないことがわかった。スクロール可能にしたい。

---

## 🤖 アシスタント
*2025/03/24 23:48:36*

Looking at the code and the image, I see the issue with the Card content overflowing. Currently, the layout doesn't accommodate the Card content properly when it's too large, causing the "BOTTOM OVERFLOWED BY 92 PIXELS" message visible in your screenshot.

To make the content scrollable, you'll need to modify the Column inside the Stack to be wrapped in a scrollable widget. Here's how you can fix it:
```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```



The main change I've made is wrapping the Column widget inside a SingleChildScrollView, which allows the content to be scrollable when it's too large to fit on the screen. 

Key modifications:

1. Added a SingleChildScrollView around the Padding and Column widgets:
```dart
SingleChildScrollView(
  child: Padding(
    padding: const EdgeInsets.all(8),
    child: Column(
      // existing child widgets
    ),
  ),
),
```

2. Added bottom padding to ensure that content doesn't get hidden behind the bottom navigation bar:
```dart
// Add padding at the bottom to ensure content doesn't get hidden behind the bottom navigation bar
const SizedBox(height: 80),
```

This solution allows the content to scroll while keeping the bottom navigation bar fixed at the bottom of the screen. The loading indicator remains centered on the screen since it's part of the Stack and not affected by the scrolling.

---
