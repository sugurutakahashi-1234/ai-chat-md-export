# SwiftUI List 実装方法

日付: 2024-09-25

---

## 👤 ユーザー
*2024/9/25 17:48:26*

{
  "content\_type": "image\_asset\_pointer",
  "asset\_pointer": "file-service://file-hkaF27pIv3ltca0PwDsmxcoJ",
  "size\_bytes": 61575,
  "width": 777,
  "height": 932,
  "fovea": null,
  "metadata": {
    "dalle": null,
    "gizmo": null,
    "generation": null,
    "container\_pixel\_height": null,
    "container\_pixel\_width": null,
    "emu\_omit\_glimpse\_image": null,
    "emu\_patches\_override": null,
    "sanitized": true,
    "asset\_pointer\_link": null,
    "watermarked\_asset\_pointer": null
  }
}
これをSwiftUIのListを使って記述したい

---

## 🤖 アシスタント
*2024/9/25 17:48:52*

To create a similar UI using `List` in SwiftUI, you can define the date and title items as a data model and then iterate over them in the `List`. Here's an example implementation based on the screenshot you provided:

### Data Model
```swift
struct ConversationLog: Identifiable {
    let id = UUID()
    let date: String
    let title: String
}

let logs = [
    ConversationLog(date: "2024/02/06", title: "一人暮らし"),
    ConversationLog(date: "2024/02/05", title: "スマホ依存"),
    ConversationLog(date: "2024/02/04", title: "スマホ依存"),
    ConversationLog(date: "2024/02/03", title: "週末のリフレッシュ"),
    ConversationLog(date: "2024/02/02", title: "週末のリフレッシュ"),
    ConversationLog(date: "2024/02/01", title: "これから始まるストーリー")
]
```

### SwiftUI View
```swift
struct ContentView: View {
    var body: some View {
        VStack {
            List(logs) { log in
                HStack {
                    Text(log.date)
                        .font(.system(size: 16, weight: .light))
                        .foregroundColor(.gray)
                    Spacer()
                    Text(log.title)
                        .font(.system(size: 16, weight: .regular))
                }
                .padding(.vertical, 8)
            }
            .listStyle(PlainListStyle())
            
            // Bottom TabBar - Placeholder
            HStack {
                Spacer()
                VStack {
                    Image(systemName: "house.fill")
                    Text("ホーム")
                        .font(.system(size: 12))
                }
                Spacer()
                VStack {
                    Image(systemName: "doc.text.fill")
                    Text("会話ログ")
                        .font(.system(size: 12))
                        .foregroundColor(.purple)
                }
                Spacer()
                VStack {
                    Image(systemName: "archivebox.fill")
                    Text("表現ストック")
                        .font(.system(size: 12))
                }
                Spacer()
            }
            .padding(.top, 10)
            .background(Color.white)
        }
        .background(Color(UIColor.systemGroupedBackground))
    }
}
```

### Key Notes:
- **Data Model**: Each log entry is represented by the `ConversationLog` struct.
- **List**: The list iterates over `logs` to display each entry in a `HStack` with the date on the left and the title on the right.
- **Styling**: I used custom fonts, spacing, and text colors to resemble the design in the screenshot.
- **Tab Bar**: I added a basic placeholder for the bottom tab bar with three icons and labels for "ホーム", "会話ログ", and "表現ストック". You can replace this with actual navigation logic.

This should create a UI similar to the one shown in your image using SwiftUI's `List`. Let me know if you need further adjustments!

---

## 👤 ユーザー
*2024/9/25 18:26:59*

LazyVStack で要素の間にディバイダーを入れているが最後の一つには入れたくない

---

## 🤖 アシスタント
*2024/9/25 18:27:12*

`LazyVStack` で要素の間に `Divider` を追加しつつ、最後の要素には `Divider` を表示しないようにするには、要素のインデックスを使用して、最後の要素を判別できます。例えば次のように実装できます：

### 実装例
```swift
struct ContentView: View {
    var body: some View {
        ScrollView {
            LazyVStack {
                ForEach(logs.indices, id: \.self) { index in
                    VStack {
                        HStack {
                            Text(logs[index].date)
                                .font(.system(size: 16, weight: .light))
                                .foregroundColor(.gray)
                            Spacer()
                            Text(logs[index].title)
                                .font(.system(size: 16, weight: .regular))
                        }
                        .padding(.vertical, 8)
                        
                        // 最後の要素には Divider を追加しない
                        if index < logs.count - 1 {
                            Divider()
                        }
                    }
                }
            }
            .padding(.horizontal)
        }
    }
}
```

### ポイント
1. **`logs.indices` の使用**: インデックスを使用して要素をループし、リスト内の最後の要素かどうかを確認します。
2. **条件分岐**: `if index < logs.count - 1` によって最後の要素かどうかを判定し、最後の要素以外には `Divider` を追加します。

これにより、全ての要素の間に `Divider` が表示され、最後の要素には `Divider` が表示されなくなります。

---

## 👤 ユーザー
*2024/9/25 18:27:55*

indexを使いたくない SwiftUiでのパフォーマンスが落ちると言われている

---

## 🤖 アシスタント
*2024/9/25 18:28:12*

User prefers not to use index when looping in SwiftUI to avoid potential performance degradation.

---

## 🔧 ツール
*2024/9/25 18:28:12*

Model set context updated.

---

## 🤖 アシスタント
*2024/9/25 18:28:12*

`index` を使用せずに、最後の要素に `Divider` を追加しない方法として、`ForEach` で直接配列をループしつつ、要素が最後かどうかを `Identifiable` を利用して判別する方法が考えられます。以下のように実装できます。

### 解決方法

```swift
struct ContentView: View {
    var body: some View {
        ScrollView {
            LazyVStack {
                ForEach(logs) { log in
                    VStack {
                        HStack {
                            Text(log.date)
                                .font(.system(size: 16, weight: .light))
                                .foregroundColor(.gray)
                            Spacer()
                            Text(log.title)
                                .font(.system(size: 16, weight: .regular))
                        }
                        .padding(.vertical, 8)
                        
                        // 最後の要素以外に Divider を追加
                        if log.id != logs.last?.id {
                            Divider()
                        }
                    }
                }
            }
            .padding(.horizontal)
        }
    }
}
```

### ポイント
1. **`Identifiable` プロトコル**: `ConversationLog` のモデルで `Identifiable` を使用しているので、個別の `id` を基に最後の要素を判定しています。
2. **`logs.last?.id` を使用**: 最後の要素の `id` と現在の要素の `id` を比較して、最後の要素には `Divider` を追加しないようにしています。

これにより、インデックスを使わずに最後の要素を判別し、パフォーマンスも考慮した実装が可能です。

---

## 👤 ユーザー
*2024/9/25 18:28:40*

これはナイスアイディアかも

---

## 🤖 アシスタント
*2024/9/25 18:28:43*

そう言っていただけて嬉しいです！この方法でパフォーマンスを保ちながら目的を達成できると思います。もし他にも質問や調整が必要な点があれば、いつでもお知らせください！

---

## 👤 ユーザー
*2024/9/25 18:29:02*

そもそもListを使えばこんな工夫いらないのでは？

---

## 🤖 アシスタント
*2024/9/25 18:29:14*

確かにおっしゃる通りです！`List` を使う場合は、自動的に各行の間にディバイダーが入り、最後の要素にはディバイダーが表示されないという仕様になっています。ですので、`List` を使えば、特別な工夫をせずに自然な見た目を実現できます。

以下のように、`List` を使ったシンプルな実装で同じ目的を達成できます：

### `List` の実装例

```swift
struct ContentView: View {
    var body: some View {
        List(logs) { log in
            HStack {
                Text(log.date)
                    .font(.system(size: 16, weight: .light))
                    .foregroundColor(.gray)
                Spacer()
                Text(log.title)
                    .font(.system(size: 16, weight: .regular))
            }
            .padding(.vertical, 8)
        }
        .listStyle(PlainListStyle())
    }
}
```

### なぜ `List` では工夫が不要か
- **自動的にディバイダーを処理**: `List` は行の間に自動でディバイダーを追加し、最後の要素にはディバイダーを表示しない仕様です。
- **スクロールパフォーマンス**: `List` は内部で効率的に最適化されており、大量のデータでもパフォーマンスに優れています。

もし `List` の外観やカスタマイズをもっと行いたい場合でも、`List` のスタイルや `modifier` を使って細かく調整できます。

---

## 👤 ユーザー
*2024/9/25 18:30:03*

全体はスクロールさせたい画面であるが下の方はForEachで回すlist構造なんだ。
どう実装すべきか？

---

## 🤖 アシスタント
*2024/9/25 18:30:26*

全体をスクロールさせたいが、特定の部分（`ForEach`で回すリスト構造）だけリスト表示にしたい場合、`ScrollView` と `LazyVStack` を組み合わせて、`ForEach` をリストのように使う構造が良い選択です。この方法なら、全体をスクロール可能にしつつ、特定の部分だけがリストのように繰り返し構造で表示されるようにできます。

### 実装例

```swift
struct ContentView: View {
    var body: some View {
        ScrollView {
            VStack(alignment: .leading) {
                // 固定部分（例えばヘッダーや他の情報）
                Text("ヘッダー部分")
                    .font(.title)
                    .padding()

                // ここにスクロールされるForEachのリスト部分
                LazyVStack {
                    ForEach(logs) { log in
                        VStack {
                            HStack {
                                Text(log.date)
                                    .font(.system(size: 16, weight: .light))
                                    .foregroundColor(.gray)
                                Spacer()
                                Text(log.title)
                                    .font(.system(size: 16, weight: .regular))
                            }
                            .padding(.vertical, 8)
                            
                            // 最後の要素以外に Divider を追加
                            if log.id != logs.last?.id {
                                Divider()
                            }
                        }
                    }
                }
                .padding(.horizontal)
                
                // 他の固定部分（フッターなど）
                HStack {
                    Spacer()
                    Text("フッター部分")
                        .font(.footnote)
                        .padding()
                    Spacer()
                }
            }
        }
    }
}
```

### 説明
1. **`ScrollView`**: 画面全体をスクロール可能にするために `ScrollView` を使っています。
2. **`VStack`**: 固定されたヘッダーやフッターを含む全体のレイアウトを管理しています。
3. **`LazyVStack`**: ForEach で繰り返し表示するリスト部分に `LazyVStack` を使っています。`List` と同じように使えますが、インデックスを使わずにパフォーマンスを確保しながら、最後の要素には `Divider` を表示しない工夫をしています。

この実装により、ヘッダーやフッターがありつつ、リストの部分だけが繰り返し構造として表示されるUIが実現できます。全体がスクロール可能で、リスト部分もスムーズに表示されます。

---

## 👤 ユーザー
*2024/9/25 18:32:15*

LazyVStackではなく、Listに変えることってできないんだっけ。もしかしてスクロールViewないのListは変換できないんだっけ？

---

## 🤖 アシスタント
*2024/9/25 18:32:32*

`List` は `ScrollView` と似た構造を持つため、`ScrollView` 内に `List` を直接ネストすることはできません。なぜなら、`List` 自体がスクロール可能なビューであり、`ScrollView` の中にスクロールビュー（`List`）を入れることは、SwiftUI のレイアウトにおいて推奨されていないからです。

ただし、目的に応じて `ScrollView` を使い続けたい場合、`LazyVStack` で十分対応可能です。以下のように `LazyVStack` で実装することで、スクロール可能なリスト部分を維持しつつ、固定のヘッダーやフッターを追加することができます。

もしどうしても `List` を使いたい場合は、`List` 全体を画面として独立させるか、特定の部分に `List` ではなく `LazyVStack` でのカスタムリストを使うことをおすすめします。

---
