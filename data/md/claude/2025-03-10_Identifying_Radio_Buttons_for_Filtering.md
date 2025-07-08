# Identifying Radio Buttons for Filtering

日付: 2025-03-10

---

## 👤 ユーザー
*2025/3/10 19:47:29*

フィルター条件 画面 選択式 丸いやつの名前を知りたい。

---

## 🤖 アシスタント
*2025/3/10 19:47:31*

ラジオボタン (Radio button) のことを探されていますか？丸い形状で、複数の選択肢から1つだけを選べる UI 要素です。フィルター条件を設定する画面でよく使われます。

---

## 👤 ユーザー
*2025/3/10 19:47:44*

違くてどんどん選択できるタイプの検索である

---

## 🤖 アシスタント
*2025/3/10 19:47:50*

あ、チェックボックス (Checkbox) のことでしょうか？これは四角い形状が一般的ですが、複数の選択肢から好きなだけ選べる UI 要素です。フィルター条件で「複数選択可能」なタイプの検索によく使われます。

もし丸い形状のものに限定してお探しであれば、以下の可能性があります：

1. 丸型チェックボックス - 一部のデザインシステムでは丸い形状のチェックボックスも使われます
2. マルチセレクトチップ - 丸みを帯びた小さなタグ状の UI で、選択するとハイライトされるタイプ
3. トグルボタン - オン/オフを切り替えられる丸いボタン

具体的にどのような見た目や機能の UI 要素をお探しか、もう少し詳しく教えていただけますか？

---

## 👤 ユーザー
*2025/3/10 19:48:11*

もっと最近のデザインで使われるやつである

---

## 🤖 アシスタント
*2025/3/10 19:48:16*

最近のデザインでよく使われる複数選択可能な丸い UI 要素といえば、「フィルターチップ」や「セレクションチップ」と呼ばれるものかもしれません。

これらは：
- 丸みを帯びた長方形や楕円形の形状
- タップ/クリックで選択・解除ができる
- 選択時に色が変わったりチェックマークが表示されたりする
- 複数選択可能で、フィルター条件として使われる

マテリアルデザインでは「Chips」、iOSでは「Pills」や「Tags」とも呼ばれます。

あるいは、モダンな「トグルボタングループ」の可能性もあります。これらは従来のチェックボックスをより洗練されたデザインに置き換えたもので、複数選択可能なボタンとして機能します。

お探しのものはこれらに近いでしょうか？

---

## 👤 ユーザー
*2025/3/10 20:04:36*

チェックマークを非表示にできるのか？また、色とかも変えたい

import 'package:flutter/material.dart';
/// Flutter code sample for [FilterChip].
enum ExerciseFilter { walking, running, cycling, hiking }
void main() =&gt; runApp(const ChipApp());
class ChipApp extends StatelessWidget {
  const ChipApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData(useMaterial3: true),
      home: Scaffold(
        appBar: AppBar(title: const Text('FilterChip Sample')),
        body: const FilterChipExample(),
      ),
    );
  }
}
class FilterChipExample extends StatefulWidget {
  const FilterChipExample({super.key});
  @override
  State&lt;FilterChipExample&gt; createState() =&gt; _FilterChipExampleState();
}
class _FilterChipExampleState extends State&lt;FilterChipExample&gt; {
  Set&lt;ExerciseFilter&gt; filters = &lt;ExerciseFilter&gt;{};
  @override
  Widget build(BuildContext context) {
    final TextTheme textTheme = Theme.of(context).textTheme;
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: &lt;Widget&gt;[
          Text('Choose an exercise', style: textTheme.labelLarge),
          const SizedBox(height: 5.0),
          Wrap(
            spacing: 5.0,
            children:
                ExerciseFilter.values.map((ExerciseFilter exercise) {
                  return FilterChip(
                    label: Text(exercise.name),
                    selected: filters.contains(exercise),
                    onSelected: (bool selected) {
                      setState(() {
                        if (selected) {
                          filters.add(exercise);
                        } else {
                          filters.remove(exercise);
                        }
                      });
                    },
                  );
                }).toList(),
          ),
          const SizedBox(height: 10.0),
          Text(
            'Looking for: ${filters.map((ExerciseFilter e) =&gt; e.name).join(', ')}',
            style: textTheme.labelLarge,
          ),
        ],
      ),
    );
  }
}

---

## 🤖 アシスタント
*2025/3/10 20:04:43*

なるほど、Flutterの `FilterChip` ですね！カスタマイズについてお答えします。

`FilterChip` はチェックマークを非表示にしたり、色を変更したりすることができます。以下のようにカスタマイズできます：

```dart
FilterChip(
  label: Text(exercise.name),
  selected: filters.contains(exercise),
  showCheckmark: false, // チェックマークを非表示にする
  selectedColor: Colors.blue, // 選択時の背景色
  backgroundColor: Colors.grey[200], // 非選択時の背景色
  labelStyle: TextStyle(color: filters.contains(exercise) ? Colors.white : Colors.black), // ラベルの色
  shape: RoundedRectangleBorder( // 形状のカスタマイズ
    borderRadius: BorderRadius.circular(20.0),
  ),
  onSelected: (bool selected) {
    setState(() {
      if (selected) {
        filters.add(exercise);
      } else {
        filters.remove(exercise);
      }
    });
  },
)
```

特に重要なプロパティ：
- `showCheckmark: false` - チェックマークを完全に非表示にします
- `selectedColor` - 選択時の背景色を変更できます
- `backgroundColor` - 非選択時の背景色を変更できます
- `labelStyle` - テキストの色やスタイルを変更できます
- `shape` - 角の丸みなど形状をカスタマイズできます

上記のプロパティを調整することで、デザインに合わせたフィルターチップを作成できます。

---
