# showBottomSheet vs Scaffold

日付: 2024-12-13

---

## 👤 ユーザー
*2024/12/13 11:54:10*

flutterでshowBottomsheetとスカホールドのBottomSheetの違い

---

## 🤖 アシスタント
*2024/12/13 11:54:43*

Flutterで`showBottomSheet`と`Scaffold`の`bottomSheet`プロパティにはいくつかの違いがあります。それぞれの用途や使い方を理解することで、適切に選択できます。

---

### 1. **`showBottomSheet`**
- **使い方**:
  `showBottomSheet`は、現在表示されている`Scaffold`の上に一時的なボトムシートを表示します。
- **一時的な表示**:
  ボトムシートを開いてから閉じることができる一時的なUI要素として使用します。
- **モーダルではない**:
  モーダルなボトムシート (`showModalBottomSheet`) とは異なり、`showBottomSheet`は非モーダルであり、他のUI要素にアクセスできます。
- **戻るボタンの対応**:
  デフォルトではAndroidの戻るボタンを押すと閉じます。
- **例**:
  ```dart
  Scaffold(
    appBar: AppBar(title: Text("showBottomSheet Example")),
    body: Center(
      child: ElevatedButton(
        onPressed: () {
          showBottomSheet(
            context: context,
            builder: (context) {
              return Container(
                color: Colors.blue,
                height: 200,
                child: Center(child: Text("This is a Bottom Sheet")),
              );
            },
          );
        },
        child: Text("Show Bottom Sheet"),
      ),
    ),
  );
  ```

---

### 2. **`Scaffold`の`bottomSheet`プロパティ**
- **使い方**:
  `Scaffold`の`bottomSheet`プロパティは、常に画面の下部に表示される固定UI要素を定義するために使用します。
- **固定要素**:
  ページ全体の一部として扱われ、他のUI要素がスクロールしても常に下部に固定されています。
- **戻るボタンの対応**:
  戻るボタンを押しても`bottomSheet`は消えません。
- **例**:
  ```dart
  Scaffold(
    appBar: AppBar(title: Text("Scaffold BottomSheet Example")),
    bottomSheet: Container(
      color: Colors.blue,
      height: 100,
      child: Center(child: Text("This is a Bottom Sheet")),
    ),
    body: Center(child: Text("Body Content")),
  );
  ```

---

### 主な違いの比較表

| 特性                     | `showBottomSheet`                     | `Scaffold.bottomSheet`             |
|--------------------------|---------------------------------------|------------------------------------|
| **用途**                 | 一時的なボトムシート                  | 固定されたボトムシート             |
| **モーダル**             | 非モーダル (他のUIと連動)             | 常に表示 (モーダルではない)        |
| **戻るボタンで閉じる**    | 可能                                 | 不可能                             |
| **スクロール対応**        | ボディがスクロールする際に動かない     | 常に固定                           |
| **使い方**               | アクションによる一時表示              | ページ全体の一部として表示         |

---

### 選択のポイント
- **一時的な操作や表示**: `showBottomSheet`
- **常に表示される固定UI**: `Scaffold.bottomSheet`

`showBottomSheet`はより動的なボトムシートの表示に適しており、`Scaffold.bottomSheet`はデザイン的に固定要素が必要な場合に使用します。

---

## 👤 ユーザー
*2024/12/13 11:55:22*

スカホールどのbottomsheetはどういう時に使うの？

---

## 🤖 アシスタント
*2024/12/13 11:56:08*

`Scaffold`の`bottomSheet`プロパティは、アプリ内で画面の下部に**常に表示される固定のUI要素**を提供したい場合に使用します。このプロパティは、ナビゲーション、ツールバー、状態表示、または他の重要な情報や操作を画面の最下部に配置したいときに便利です。

---

### **`Scaffold.bottomSheet`を使うべき場面**
1. **スクロールに影響されない固定要素が必要な場合**  
   画面全体がスクロールしても、ボトムシートは常に下部に固定されている必要があるときに使います。
   - **例**: 音楽プレイヤーの再生コントロール。
   - **用途**:
     - 再生・停止ボタン
     - 音量調整スライダー

2. **画面全体の一部として設計される要素**  
   ページ設計の一部として**デフォルトで表示されるUI**を提供したい場合。
   - **例**: ショッピングカートの「合計金額」や「購入ボタン」などのUI。

3. **常にユーザーに見せたい操作**  
   ユーザーがどのコンテンツを見ていても、操作可能である必要がある要素。
   - **例**:
     - チャット画面の「メッセージ送信ボックス」
     - アプリ全体のタブバーに似た役割を持つカスタムUI。

4. **スクロール可能なコンテンツに対して固定の補助情報を追加したい場合**  
   スクロールする本文の下に常に見える重要な情報を表示したいとき。
   - **例**:
     - フォーム送信画面で「送信ボタン」を画面の下部に固定する。
     - 「次へ進む」「戻る」などのナビゲーションボタン。

---

### **具体例**
#### 1. **音楽プレイヤーの再生コントロール**
```dart
Scaffold(
  appBar: AppBar(title: Text("Music Player")),
  body: ListView.builder(
    itemCount: 50,
    itemBuilder: (context, index) {
      return ListTile(title: Text("Song $index"));
    },
  ),
  bottomSheet: Container(
    color: Colors.grey[900],
    height: 80,
    child: Row(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: [
        Icon(Icons.skip_previous, color: Colors.white),
        Icon(Icons.play_arrow, color: Colors.white),
        Icon(Icons.skip_next, color: Colors.white),
      ],
    ),
  ),
);
```

#### 2. **ショッピングカートの合計金額と購入ボタン**
```dart
Scaffold(
  appBar: AppBar(title: Text("Shopping Cart")),
  body: ListView(
    children: [
      ListTile(title: Text("Item 1"), trailing: Text("¥1,000")),
      ListTile(title: Text("Item 2"), trailing: Text("¥2,500")),
    ],
  ),
  bottomSheet: Container(
    padding: EdgeInsets.all(16),
    color: Colors.blue,
    height: 80,
    child: Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text("Total: ¥3,500", style: TextStyle(color: Colors.white, fontSize: 18)),
        ElevatedButton(
          onPressed: () {},
          child: Text("Checkout"),
        ),
      ],
    ),
  ),
);
```

#### 3. **フォーム送信ボタンの固定**
```dart
Scaffold(
  appBar: AppBar(title: Text("Feedback Form")),
  body: Padding(
    padding: EdgeInsets.all(16),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text("Name"),
        TextField(),
        SizedBox(height: 20),
        Text("Message"),
        TextField(maxLines: 5),
      ],
    ),
  ),
  bottomSheet: Container(
    padding: EdgeInsets.symmetric(vertical: 8, horizontal: 16),
    color: Colors.grey[200],
    child: ElevatedButton(
      onPressed: () {
        // Submit action
      },
      child: Text("Submit"),
    ),
  ),
);
```

---

### **`Scaffold.bottomSheet`の利点**
- **常に見える位置に固定**: スクロールとは独立して画面下部に固定されるため、重要な要素や操作を提供できます。
- **状態管理が簡単**: `showBottomSheet`のように毎回表示・非表示を管理する必要がありません。
- **デザイン的な一貫性**: 他の画面と統一感を持たせた固定要素として機能します。

---

### **使用時の注意点**
- **スペースの確保**: `bottomSheet`が表示される分だけ`body`の高さが減少するため、コンテンツが隠れないように注意します。
- **動的要素には不向き**: 状況に応じて表示を切り替える必要がある場合は、`showBottomSheet`や`showModalBottomSheet`を使用するほうが適しています。

---

### **まとめ**
`Scaffold.bottomSheet`は、固定された重要なUI要素を設置する際に最適です。動的なボトムシート表示が不要で、画面全体の一部として使いたい場合に検討するとよいでしょう。

---
