# Scrollbarテーマカスタマイズ

日付: 2025-02-25

---

## 👤 ユーザー
*2025/02/25 20:01:19*

ScrollbarThemeData で黒背景で会うぐらいの明るさのグレーにしたい

---

## 🔧 ツール
*2025/02/25 20:01:38*

This cut into the code snippet shows how to customize a ScrollbarThemeData in Flutter for a dark theme. It adjusts thumbColor and trackColor to shades of gray that are suitable for a black background.

---

## 🤖 アシスタント
*2025/02/25 20:01:38*

Flutter の `ScrollbarThemeData` を使って、黒背景にマッチするような程よい明るさのグレーでスクロールバーをカスタマイズする例を紹介します。  
たとえば以下のように `MaterialApp` の `theme` プロパティ内で `scrollbarTheme` を指定すると、すべてのスクロールバーにそのテーマが適用されるようになります。

```dart
MaterialApp(
  theme: ThemeData(
    // 他のテーマ設定...
    scrollbarTheme: ScrollbarThemeData(
      // スクロールバーのサム（つまみ）を常に表示したい場合に使用
      thumbVisibility: MaterialStateProperty.all(true),

      // サムの色を指定。黒背景に合うように、やや明るめのグレーを設定している例
      thumbColor: MaterialStateProperty.resolveWith<Color>((states) {
        // ホバーした時など、状態によって微妙に変えたい場合は条件で分岐しても良い
        if (states.contains(MaterialState.hovered)) {
          return Colors.grey.shade600; // ホバー時：やや明るめ
        }
        // 通常時の色
        return Colors.grey.shade700;
      }),

      // トラック（スクロールバーが通るレール部分）の色を指定
      trackColor: MaterialStateProperty.all(Colors.grey.shade900),

      // トラックの枠線の色を指定
      trackBorderColor: MaterialStateProperty.all(Colors.transparent),

      // スクロールバーの角の丸み
      radius: const Radius.circular(8),

      // スクロールバーの太さ
      thickness: MaterialStateProperty.all(4),
    ),
  ),
  home: MyHomePage(),
);
```

### ポイント

1. **常にサムを表示したい場合**  
   - `thumbVisibility: MaterialStateProperty.all(true)` を設定します。  
   - デフォルトではスクロール操作時のみサムが表示されます。

2. **サムの色の指定**  
   - `thumbColor: MaterialStateProperty.resolveWith<Color>((states) { ... })`  
     のように `MaterialStateProperty.resolveWith` を使うと、ホバーやドラッグ中など、状態に応じて色を変えることができます。  
   - 単純に常に同じ色にしたい場合は `MaterialStateProperty.all(Colors.grey.shade700)` のように書けます。

3. **トラック部分の設定**  
   - `trackColor` でレール部分の色、`trackBorderColor` でその枠線の色を指定できます。

4. **角の丸み**  
   - `radius` でスクロールバーの角の丸みを調整できます。

5. **太さ**  
   - `thickness` でスクロールバーの太さを指定できます。

上記を参考に、黒背景に合うように `Colors.grey.shade600` や `Colors.grey.shade700` など、適宜お好みのグレーの明るさに変更してみてください。お好みの濃さが見つかったら、その値を固定で指定するとより簡単です。

---
