# Button Layout Adjustment

日付: 2024-12-19

---

## 👤 ユーザー
*2024/12/19 22:38:00*

文言はセンターでIconは右寄せしたい

ElevatedButton(
                        onPressed: () {
                          context.push(Screen.guildCode.path);
                        },
                        child: const Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text('Join an existing guild'),
                            Icon(Icons.arrow_forward),
                          ],
                        ),
                      ),

---

## 🤖 アシスタント
*2024/12/19 22:38:10*

`Row` の中で、`Text` をセンターに配置し、`Icon` を右寄せするには、以下のようにスペーサー (`Spacer`) を使うことで実現できます。

修正後のコードは以下の通りです：

```dart
ElevatedButton(
  onPressed: () {
    context.push(Screen.guildCode.path);
  },
  child: const Row(
    mainAxisSize: MainAxisSize.min,
    children: [
      Text('Join an existing guild'),
      Spacer(),
      Icon(Icons.arrow_forward),
    ],
  ),
),
```

### ポイント
1. `Spacer` を使うことで `Text` と `Icon` の間に空白を作成できます。
2. `mainAxisSize: MainAxisSize.min` により、ボタン全体が必要最小限のサイズになります。

これにより、文言がボタンの中央に配置され、アイコンが右寄せされます。

---

## 👤 ユーザー
*2024/12/19 22:38:37*

これだと文言は本当のセンターにならずにちょっと左側にならない？

---

## 🤖 アシスタント
*2024/12/19 22:38:55*

おっしゃる通り、`Spacer` を使うと、`Text` と `Icon` の間に空白が入るため、`Text` がボタン全体の完全な中央に配置されず、少し左寄りになります。文言を真の中央に配置し、アイコンを右端に寄せたい場合は、`Stack` を使うと実現できます。

以下のように修正します：

```dart
ElevatedButton(
  onPressed: () {
    context.push(Screen.guildCode.path);
  },
  child: const Stack(
    alignment: Alignment.center,
    children: [
      Center(
        child: Text('Join an existing guild'),
      ),
      Positioned(
        right: 0,
        child: Icon(Icons.arrow_forward),
      ),
    ],
  ),
),
```

### 修正のポイント
1. `Stack` を使って要素を重ねて配置します。
2. `alignment: Alignment.center` により、`Text` がボタン全体の中央に配置されます。
3. `Positioned` を使って `Icon` を右端に配置します。

これで、文言はボタンの正確な中央に表示され、アイコンは右端に固定されます。

---
