# Constructor parameter mismatch fix

日付: 2024-12-09

---

## 👤 ユーザー
*2024/12/9 16:39:49*

The super parameter named 'swatch'' does not share the same name as the corresponding parameter in the super constructor, '_swatch'.
Try using the name of the corresponding parameter in the super constructor.
class _MaterialColor extends ColorSwatch&lt;int&gt; {
  const _MaterialColor(super.primary, super.swatch);

  Color get shade10 =&gt; this[10]!;

  Color get shade20 =&gt; this[20]!;

  Color get shade30 =&gt; this[30]!;

  Color get shade40 =&gt; this[40]!;

  Color get shade50 =&gt; this[50]!;

  Color get shade60 =&gt; this[60]!;

  Color get shade70 =&gt; this[70]!;

  Color get shade80 =&gt; this[80]!;

  Color get shade90 =&gt; this[90]!;

  Color get shade100 =&gt; this[100]!;
}

---

## 🤖 アシスタント
*2024/12/9 16:40:03*

The issue occurs because the parameter name `super.swatch` does not match the name expected by the `ColorSwatch` superclass constructor. The `ColorSwatch` constructor uses `_swatch` as the parameter name. To resolve the issue, you need to use the parameter name `_swatch` when calling the superclass constructor.

Here's the corrected version of your `_MaterialColor` class:

```dart
class _MaterialColor extends ColorSwatch<int> {
  const _MaterialColor(super.primary, super._swatch);

  Color get shade10 => this[10]!;

  Color get shade20 => this[20]!;

  Color get shade30 => this[30]!;

  Color get shade40 => this[40]!;

  Color get shade50 => this[50]!;

  Color get shade60 => this[60]!;

  Color get shade70 => this[70]!;

  Color get shade80 => this[80]!;

  Color get shade90 => this[90]!;

  Color get shade100 => this[100]!;
}
```

### Explanation:
- The `ColorSwatch` constructor has a parameter named `_swatch`.
- When you use `super._swatch`, it matches the name of the parameter in the `ColorSwatch` superclass constructor, resolving the error.

---
